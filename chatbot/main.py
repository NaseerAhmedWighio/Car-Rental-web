# main.py
import os
import re
import json
import aiohttp
import asyncio
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import AsyncOpenAI

# Try to import agents, fallback to simple mode if not available
try:
    from agents import Agent, Runner, OpenAIChatCompletionsModel, function_tool, set_tracing_disabled
    HAS_AGENTS = True
except ImportError:
    HAS_AGENTS = False
    print("Warning: agents package not available, using simple mode")

from fastapi.middleware.cors import CORSMiddleware

# -------------------- Load environment variables (supports HuggingFace secrets) --------------------
# These will be overridden by HuggingFace Space secrets

# LLM Provider Configuration
# Supports: Gemini (Google AI) or OpenRouter
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openrouter").lower()  # "gemini" or "openrouter"

if LLM_PROVIDER == "gemini":
    LLM_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
    LLM_MODEL = os.getenv("GEMINI_MODEL") or os.getenv("LLM_MODEL", "gemini-2.5-flash")
    LLM_BASE_URL = os.getenv("GEMINI_BASE_URL") or os.getenv("OPENAI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/")
elif LLM_PROVIDER == "openrouter":
    LLM_API_KEY = os.getenv("OPENROUTER_API_KEY")
    if not LLM_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is not set in .env file")
    LLM_MODEL = os.getenv("OPENROUTER_MODEL") or os.getenv("LLM_MODEL", "qwen/qwen-2.5-72b-instruct")
    LLM_BASE_URL = os.getenv("OPENROUTER_BASE_URL") or os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
else:
    # Fallback to generic OpenAI-compatible endpoint
    LLM_API_KEY = os.getenv("OPENAI_API_KEY")
    LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
    LLM_BASE_URL = os.getenv("OPENAI_BASE_URL")

SANITY_PROJECT_ID = os.getenv("SANITY_PROJECT_ID")
SANITY_DATASET = os.getenv("SANITY_DATASET")
SANITY_API_TOKEN = os.getenv("SANITY_API_TOKEN")

# Next.js API base URL
NEXT_PUBLIC_API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:3000")

# -------------------- FastAPI --------------------
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Disable OpenAI tracing (not needed for OpenRouter/Gemini)
set_tracing_disabled(True)

# -------------------- LLM Client (OpenAI-compatible) --------------------
# Add extra headers for OpenRouter provider routing (ensures tool support)
extra_headers = {}
if LLM_PROVIDER == "openrouter":
    extra_headers = {
        "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "http://localhost:3000"),
        "X-Title": os.getenv("OPENROUTER_APP_NAME", "Car Rental Chatbot"),
    }

client = AsyncOpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL, default_headers=extra_headers)
model = OpenAIChatCompletionsModel(model=LLM_MODEL, openai_client=client)

print(f"🤖 Using LLM Provider: {LLM_PROVIDER}")
print(f"🤖 Model: {LLM_MODEL}")
print(f"🤖 Base URL: {LLM_BASE_URL}")

# -------------------- Sanity Fetch --------------------
async def fetch_from_sanity(groq: str, params: dict = None) -> List[Dict]:
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2023-08-01/data/query/{SANITY_DATASET}"
    headers = {"Authorization": f"Bearer {SANITY_API_TOKEN}"}
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers, params={"query": groq, **(params or {})}, timeout=10) as resp:
            if resp.status != 200:
                text = await resp.text()
                raise HTTPException(status_code=resp.status, detail=f"Sanity error: {text}")
            data = await resp.json()
            return data.get("result", [])

# -------------------- TOOL: Search Cars --------------------
@function_tool
async def search_cars(user_query: str) -> str:
    """Search cars with smart filtering. Returns JSON with car details."""
    q = user_query.lower().strip()

    # Detect intent
    is_suv = "suv" in q
    is_sedan = "sedan" in q
    is_specific = any(name in q for name in ["cr-v", "mg zs", "rush", "terios", "koengsegg", "nissan", "rolls"])
    is_price = "price" in q
    is_fuel = "fuel" in q
    is_popular = "popular" in q
    is_recommended = "recommended" in q
    is_all = ("all" in q and "cars" in q) or q == "all"
    is_transmission = "automatic" in q or "manual" in q

    # Build GROQ
    groq = '*[_type in ["popular", "recommended"]'
    filters = []

    if is_suv:
        filters.append('category == "SUV"')
    if is_sedan:
        filters.append('category == "Sedan"')
    if is_specific:
        car_name = next((n for n in ["cr-v", "mg zs", "rush", "terios", "koengsegg", "nissan gt-r", "rolls-royce"] if n in q), None)
        if car_name:
            filters.append(f'(title match "*{car_name}*" || slug.current match "*{car_name}*")')
    if is_popular:
        filters.append('_type == "popular"')
    if is_recommended:
        filters.append('_type == "recommended"')
    if is_transmission:
        filters.append('type == "Automatic"' if "automatic" in q else 'type == "Manual"')

    if filters:
        groq += " && " + " && ".join(filters)
    groq += '] | order(_createdAt desc) { _id, "slug": slug.current, title, category, fuel, type, capacity, price, discount }[0...12]'

    results = await fetch_from_sanity(groq)
    if not results:
        return json.dumps({"cars": [], "message": "No cars found matching your criteria."})

    cars = []
    for r in results:
        cars.append({
            "id": r["_id"],
            "title": r["title"],
            "category": r.get("category", ""),
            "price": r["price"],
            "discount": r.get("discount"),
            "fuel": r.get("fuel", ""),
            "type": r.get("type", ""),
            "capacity": r.get("capacity", ""),
            "slug": r["slug"],
        })

    return json.dumps({"cars": cars, "count": len(cars)})

# -------------------- TOOL: Add to Cart --------------------
@function_tool
async def add_to_cart(slug: str) -> str:
    """Add a car to the user's cart. Requires the car slug."""
    if not slug:
        return json.dumps({"success": False, "error": "Car slug is required"})

    # Validate car exists
    groq = '*[_type in ["popular", "recommended"] && slug.current == $slug][0] { _id, "slug": slug.current, title, category, price, discount }'
    car = await fetch_from_sanity(groq, {"slug": slug})

    if not car:
        return json.dumps({"success": False, "error": "Car not found"})

    return json.dumps({
        "success": True,
        "action": "add",
        "car": {
            "slug": car["slug"],
            "title": car["title"],
            "category": car.get("category", ""),
            "price": car["price"],
            "discount": car.get("discount"),
        },
        "message": f"{car['title']} added to cart!"
    })

# -------------------- TOOL: Remove from Cart --------------------
@function_tool
async def remove_from_cart(slug: str) -> str:
    """Remove a car from the user's cart. Requires the car slug."""
    if not slug:
        return json.dumps({"success": False, "error": "Car slug is required"})

    # Validate car exists
    groq = '*[_type in ["popular", "recommended"] && slug.current == $slug][0] { _id, "slug": slug.current, title }'
    car = await fetch_from_sanity(groq, {"slug": slug})

    if not car:
        return json.dumps({"success": False, "error": "Car not found"})

    return json.dumps({
        "success": True,
        "action": "remove",
        "car": {
            "slug": car["slug"],
            "title": car["title"],
        },
        "message": f"{car['title']} removed from cart"
    })

# -------------------- TOOL: Get Reviews --------------------
@function_tool
async def get_reviews(car_slug: str = "") -> str:
    """Get reviews for a car. Pass the car slug to get reviews for that car, or empty string for all reviews."""
    if car_slug:
        groq = '*[_type == "review" && productSlug == $slug] | order(date desc) { _id, productSlug, username, subname, comment, rating, date, imageUrl }[0...20]'
        reviews = await fetch_from_sanity(groq, {"slug": car_slug})

        if not reviews:
            return json.dumps({"reviews": [], "message": "No reviews yet for this car", "averageRating": 0})

        avg = sum(r["rating"] for r in reviews) / len(reviews) if reviews else 0
        return json.dumps({
            "reviews": reviews,
            "count": len(reviews),
            "averageRating": round(avg, 1),
            "message": f"Found {len(reviews)} reviews (avg: {avg:.1f}/5)"
        })
    else:
        groq = '*[_type == "review"] | order(date desc) { _id, productSlug, username, subname, comment, rating, date, imageUrl }[0...20]'
        reviews = await fetch_from_sanity(groq)
        return json.dumps({"reviews": reviews, "count": len(reviews)})

# -------------------- TOOL: Submit Review --------------------
@function_tool
async def submit_review(product_slug: str, username: str, rating: int, comment: str, subname: str = "") -> str:
    """Submit a new review for a car. Requires: product_slug, username, rating (1-5), comment. Optional: subname."""
    if not product_slug or not username or not rating or not comment:
        return json.dumps({"success": False, "error": "Missing required fields: product_slug, username, rating, comment"})

    if rating < 1 or rating > 5:
        return json.dumps({"success": False, "error": "Rating must be between 1 and 5"})

    # Validate car exists
    groq = '*[_type in ["popular", "recommended"] && slug.current == $slug][0] { _id, "slug": slug.current, title }'
    car = await fetch_from_sanity(groq, {"slug": product_slug})

    if not car:
        return json.dumps({"success": False, "error": "Car not found"})

    # Return data to be sent to Next.js API
    return json.dumps({
        "success": True,
        "action": "submit_review",
        "car": {
            "slug": product_slug,
            "title": car["title"]
        },
        "reviewData": {
            "username": username,
            "subname": subname,
            "rating": rating,
            "comment": comment
        },
        "message": f"Review submitted for {car['title']}! Rating: {rating}/5"
    })

# -------------------- TOOL: Create Rental --------------------
@function_tool
async def create_rental(
    car_slug: str,
    customer_name: str,
    customer_phone: str,
    pickup_location: str,
    pickup_date: str,
    dropoff_location: str,
    dropoff_date: str,
    customer_email: str = "",
    pickup_time: str = "",
    dropoff_time: str = ""
) -> str:
    """Create a rental booking. Requires all booking details."""
    required = [car_slug, customer_name, customer_phone, pickup_location, pickup_date, dropoff_location, dropoff_date]
    if not all(required):
        return json.dumps({"success": False, "error": "Missing required booking fields"})

    # Get car details
    groq = '*[_type in ["popular", "recommended"] && slug.current == $slug][0] { _id, "slug": slug.current, title, category, price, discount }'
    car = await fetch_from_sanity(groq, {"slug": car_slug})

    if not car:
        return json.dumps({"success": False, "error": "Car not found"})

    # Calculate total price (simplified - 3 day minimum)
    days = 3  # Default minimum
    try:
        from datetime import datetime
        p1 = datetime.strptime(pickup_date, "%Y-%m-%d")
        p2 = datetime.strptime(dropoff_date, "%Y-%m-%d")
        days = max(3, (p2 - p1).days)
    except:
        pass

    price = car["discount"] if car.get("discount") and car["discount"] < car["price"] else car["price"]
    total_price = price * days

    return json.dumps({
        "success": True,
        "action": "create_rental",
        "car": {
            "slug": car["slug"],
            "title": car["title"],
            "category": car.get("category", ""),
        },
        "rentalData": {
            "carTitle": car["title"],
            "carSlug": car["slug"],
            "category": car.get("category", ""),
            "customerName": customer_name,
            "customerPhone": customer_phone,
            "customerEmail": customer_email,
            "pickupLocation": pickup_location,
            "pickupDate": pickup_date,
            "pickupTime": pickup_time,
            "dropoffLocation": dropoff_location,
            "dropoffDate": dropoff_date,
            "dropoffTime": dropoff_time,
            "totalPrice": total_price,
        },
        "summary": {
            "days": days,
            "pricePerDay": price,
            "totalPrice": total_price
        },
        "message": f"Rental created for {car['title']}! Total: ${total_price} for {days} days"
    })

# -------------------- TOOL: Get Cart --------------------
@function_tool
async def get_cart(slugs_json: str = "") -> str:
    """Get details of cars in cart. Pass a JSON array of slugs, or empty to get from localStorage on client."""
    if not slugs_json:
        return json.dumps({"cars": [], "message": "No slugs provided. Cart is managed client-side."})

    try:
        slugs = json.loads(slugs_json)
        if not isinstance(slugs, list):
            slugs = [slugs]
    except:
        return json.dumps({"cars": [], "error": "Invalid slugs format"})

    if not slugs:
        return json.dumps({"cars": [], "message": "Cart is empty"})

    groq = f'*[_type in ["popular", "recommended"] && slug.current in $slugs] {{ _id, "slug": slug.current, title, category, price, discount }}'
    cars = await fetch_from_sanity(groq, {"slugs": slugs})

    return json.dumps({
        "cars": cars,
        "count": len(cars),
        "total": sum(c.get("discount", c["price"]) for c in cars if c.get("discount", c["price"]))
    })

# -------------------- TOOL: Get Billing Info --------------------
@function_tool
async def get_billing_info(slug: str = "", days: int = 1) -> str:
    """Get billing/price information for a car. Requires car slug and rental days."""
    if not slug:
        return json.dumps({"error": "Car slug is required"})

    groq = '*[_type in ["popular", "recommended"] && slug.current == $slug][0] { _id, "slug": slug.current, title, category, price, discount }'
    car = await fetch_from_sanity(groq, {"slug": slug})

    if not car:
        return json.dumps({"error": "Car not found"})

    original_price = car["price"]
    discounted_price = car.get("discount") if car.get("discount") and car["discount"] < car["price"] else None
    price = discounted_price if discounted_price else original_price
    total = price * days
    tax = total * 0.1  # 10% tax estimate
    grand_total = total + tax

    return json.dumps({
        "success": True,
        "car": {
            "slug": car["slug"],
            "title": car["title"],
        },
        "billing": {
            "days": days,
            "pricePerDay": price,
            "originalPrice": original_price,
            "discountedPrice": discounted_price,
            "subtotal": total,
            "tax": round(tax, 2),
            "grandTotal": round(grand_total, 2),
        },
        "message": f"**{car['title']}** - {days} day rental\nPrice: ${price}/day\nSubtotal: ${total}\nTax (10%): ${round(tax, 2)}\n**Total: ${round(grand_total, 2)}**"
    })

# -------------------- AGENT: Car Rental Assistant --------------------
chat_agent = Agent(
    name="CarRentalAgent",
    instructions="""
You are a professional car rental assistant for a premium car rental service.

CRITICAL RULES:
1. For ANY car search/query, call `search_cars` FIRST with the full user message.
2. Format car listings clearly with price information.
3. After listing cars, ALWAYS ask "Which car would you like to book?"
4. When user wants to add a car to cart, call `add_to_cart` with the car slug.
5. When user wants to remove from cart, call `remove_from_cart`.
6. When user asks for reviews/ratings, call `get_reviews` with the car slug.
7. When user wants to leave a review, collect: their name, rating (1-5), and comment, then call `submit_review`.
8. When user wants to checkout, guide them to the checkout page at /checkout
9. For billing/pricing info, call `get_billing_info` with car slug and days.
10. When user confirms a SINGLE car booking with ALL details (name, phone, pickup/dropoff location & date), call `create_rental`.
11. If user wants to book MULTIPLE cars, tell them to add cars to cart and go to /checkout

CAR SEARCH EXAMPLES:
- "show SUVs" -> search_cars with "suv"
- "CR-V price" -> search_cars with "cr-v price"
- "all cars" -> search_cars with "all"
- "automatic cars" -> search_cars with "automatic"

RESPONSE FORMATTING:
- Use **bold** for car names and prices
- Use bullet points for lists
- Show prices clearly: **$80/day** or **$120/day (was $150)**
- Show ratings with stars if available
- NEVER share or display image URLs, photo links, or URLs in your response

BOOKING FLOW (Single Car):
1. User expresses interest in a car
2. Show car details and ask if they want to book
3. Collect: pickup location, pickup date, dropoff location, dropoff date
4. Also collect: customer name, phone, email (optional)
5. Confirm all details and create rental

CART CHECKOUT FLOW (Multiple Cars):
1. User adds multiple cars to cart using `add_to_cart`
2. When user says "checkout" or "checkout my cart", respond: "Go to /checkout to complete your booking for {count} cars totaling ${total}/day"
3. Do NOT call `create_rental` for cart checkouts

Be professional, concise, and helpful. Never make up car data - always use the search tool.
""".strip(),
    model=model,
    tools=[search_cars, add_to_cart, remove_from_cart, get_reviews, submit_review, create_rental, get_cart, get_billing_info],
    output_type=str,
)

# -------------------- Session Memory --------------------
SESSIONS: Dict[str, List[Dict]] = {}
BOOKING_STATE: Dict[str, Dict] = {}

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    cart_slugs: Optional[List[str]] = None  # Passed from client to track cart

@app.post("/api/chat")
async def chat(req: ChatRequest):
    session_id = req.session_id
    if session_id not in SESSIONS:
        SESSIONS[session_id] = []
        BOOKING_STATE[session_id] = {}

    user_msg = req.message.strip()
    SESSIONS[session_id].append({"role": "user", "content": user_msg})

    # Check if this is a direct tool call result
    try:
        data = json.loads(user_msg)
        if "tool_response" in data:
            return {"response": data["tool_response"]}
    except:
        pass

    # Run the agent
    import asyncio
    import time
    start_time = time.time()
    print(f"⏱️ Processing request: {user_msg[:50]}...")

    try:
        result = await asyncio.wait_for(
            Runner.run(
                chat_agent,
                user_msg,
                max_turns=3,
                context={"session_id": session_id, "cart_slugs": req.cart_slugs or []}
            ),
            timeout=120.0  # 120 second timeout
        )
        elapsed = time.time() - start_time
        print(f"✅ Response in {elapsed:.1f}s")
        raw = result.final_output or ""
    except asyncio.TimeoutError:
        elapsed = time.time() - start_time
        print(f"❌ Timeout after {elapsed:.1f}s")
        raw = "Sorry, the request timed out. Please try again with a simpler query."
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"❌ Error after {elapsed:.1f}s: {e}")
        raw = f"Sorry, an error occurred. Please try again."

    # Parse and format response
    reply = format_response(raw, user_msg.lower())

    SESSIONS[session_id].append({"role": "assistant", "content": reply})
    return {"response": reply}

@app.post("/api/cart/sync")
async def sync_cart(req: ChatRequest):
    """Sync cart items from client."""
    try:
        data = json.loads(req.message)
        slugs = data.get("slugs", [])
        if slugs:
            groq = f'*[_type in ["popular", "recommended"] && slug.current in $slugs] {{ _id, "slug": slug.current, title, category, price, discount }}'
            cars = await fetch_from_sanity(groq, {"slugs": slugs})
            return {"success": True, "cars": cars, "count": len(cars)}
        return {"success": True, "cars": [], "count": 0}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/reviews/submit")
async def submit_review_api(req: ChatRequest):
    """Submit a review via the API."""
    try:
        data = json.loads(req.message)
        # This will be called by the client to actually submit the review
        return {"success": True, "data": data}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "car-rental-chatbot"}

# -------------------- Smart Formatter --------------------
def format_response(raw: str, query: str) -> str:
    """Format the response from the agent."""
    if not raw:
        return "I'm sorry, I couldn't process that request. Please try again."

    # If it's JSON, try to format it nicely
    try:
        data = json.loads(raw)

        # Handle error responses
        if "error" in data:
            return f"Error: {data['error']}"

        # Handle cart responses
        if "success" in data and "action" in data:
            if data["action"] == "add":
                return f"✅ {data.get('message', 'Added to cart!')}"
            elif data["action"] == "remove":
                return f"🗑️ {data.get('message', 'Removed from cart')}"

        # Handle review submissions
        if "success" in data and data.get("action") == "submit_review":
            return f"⭐ {data.get('message', 'Review submitted!')}"

        # Handle rental creations
        if "success" in data and data.get("action") == "create_rental":
            summary = data.get("summary", {})
            return f"📋 {data.get('message')}\n\nDetails:\n- Days: {summary.get('days', 'N/A')}\n- Price/day: ${summary.get('pricePerDay', 'N/A')}\n- **Total: ${summary.get('totalPrice', 'N/A')}**"

        # Handle cars list
        if "cars" in data and isinstance(data["cars"], list):
            cars = data["cars"]
            if not cars:
                return "No cars found matching your criteria. Try different filters!"

            lines = ["🚗 **Available Cars:**\n"]
            for c in cars:
                title = c['title']
                category = c.get('category', 'Car')
                price = c['price']
                discount = c.get('discount')

                if discount and discount < price:
                    price_display = f"**${discount}/day** ~~${price}~~"
                else:
                    price_display = f"**${price}/day**"

                lines.append(f"• **{title}** ({category}) — {price_display}")
                if c.get("fuel"):
                    lines.append(f"  └ {c.get('fuel', '')} • {c.get('type', '')} • {c.get('capacity', '')} seats")

            lines.append("\nWhich car would you like to book?")
            return "\n".join(lines)

        # Handle reviews
        if "reviews" in data:
            reviews = data["reviews"]
            if not reviews:
                return data.get("message", "No reviews found.")

            lines = [f"⭐ **{data.get('averageRating', 'N/A')}/5** ({data.get('count', 0)} reviews)\n"]
            for r in reviews[:5]:
                stars = "⭐" * int(r.get("rating", 0))
                lines.append(f"{stars} **{r.get('username', 'Anonymous')}**: {r.get('comment', '')[:100]}...")
            return "\n".join(lines)

    except:
        pass

    # Return raw response if not JSON
    return raw

# -------------------- Run --------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "7860"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)