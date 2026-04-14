
# # main.py
# import os
# import re
# import json
# import aiohttp
# from typing import List, Dict, Any
# from dotenv import load_dotenv
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from openai import AsyncOpenAI
# from agents import Agent, Runner, OpenAIChatCompletionsModel, function_tool
# from fastapi.middleware.cors import CORSMiddleware

# # -------------------- Load .env --------------------
# load_dotenv()

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# GEMINI_MODEL = "gemini-2.0-flash"
# GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

# SANITY_PROJECT_ID = os.getenv("SANITY_PROJECT_ID")
# SANITY_DATASET = os.getenv("SANITY_DATASET")
# SANITY_API_TOKEN = os.getenv("SANITY_API_TOKEN")

# # -------------------- FastAPI --------------------
# app = FastAPI()
# app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# # -------------------- Gemini Client --------------------
# client = AsyncOpenAI(api_key=GEMINI_API_KEY, base_url=GEMINI_BASE_URL)
# model = OpenAIChatCompletionsModel(model=GEMINI_MODEL, openai_client=client)

# # -------------------- Sanity Fetch --------------------
# async def fetch_from_sanity(groq: str) -> List[Dict]:
#     url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2023-08-01/data/query/{SANITY_DATASET}"
#     headers = {"Authorization": f"Bearer {SANITY_API_TOKEN}"}
#     async with aiohttp.ClientSession() as session:
#         async with session.get(url, headers=headers, params={"query": groq}, timeout=10) as resp:
#             if resp.status != 200:
#                 text = await resp.text()
#                 raise HTTPException(status_code=resp.status, detail=f"Sanity error: {text}")
#             data = await resp.json()
#             return data.get("result", [])

# # -------------------- TOOL: Smart Search --------------------
# @function_tool
# async def search_cars(user_query: str) -> str:
#     """Search cars with smart filtering. Returns JSON."""
#     q = user_query.lower().strip()

#     # Detect intent
#     is_specific_car = any(name in q for name in ["cr-v", "mg zs","mg zx excite","mg zx exclusive", "rush", "terios", "koengsegg", "nissan gt-r", "rolls-royce"])
#     is_category = re.search(r"\b(suv|sedan|hatchback|sport|crossover|pickup|van|luxury)\b", q)
#     is_price = "price" in q or "under" in q or "below" in q or "less than" in q
#     is_fuel = "fuel" in q or "petrol" in q or "diesel" in q
#     is_type = "type" in q or "manual" in q or "automatic" in q
#     is_capacity = "capacity" in q or "seat" in q
#     is_discount = "discount" in q
#     is_popular = "popular" in q
#     is_recommended = "recommended" in q
#     is_all = "all" in q and "cars" in q

#     # Build GROQ
#     groq = '*[_type in ["popular", "recommended"]'
#     filters = []

#     # Specific car by title/slug
#     if is_specific_car:
#         car_name = next((name for name in ["cr-v", "mg zs","mg zx excite","mg zx exclusive", "rush", "terios", "koengsegg", "nissan gt-r", "rolls-royce"] if name in q), None)
#         if car_name:
#             filters.append(f'title match "*{car_name}*" || "slug" == "{car_name}"')

#     # Category
#     if match := is_category:
#         filters.append(f'category == "{match.group(1).title()}"')

#     # Price
#     if match := re.search(r"(?:under|below|less than)\s*\$?(\d+)", q):
#         filters.append(f'price <= {int(match.group(1))}')

#     # Fuel
#     if "petrol" in q: filters.append('fuel == "PETROL"')
#     if "diesel" in q: filters.append('fuel == "DIESEL"')

#     # Type
#     if "manual" in q: filters.append('type == "Manual"')
#     if "automatic" in q: filters.append('type == "Automatic"')

#     # Capacity
#     if match := re.search(r"(\d+)\s*seater", q):
#         filters.append(f'capacity == {int(match.group(1))}')

#     # Discount
#     if is_discount:
#         filters.append('defined(discount) && discount > price')

#     # Popular / Recommended / All
#     if is_popular:
#         filters.append('_type == "popular"')
#     if is_recommended:
#         filters.append('_type == "recommended"')

#     # Combine filters
#     if filters:
#         groq += " && " + " && ".join(filters)
#     groq += '] { _id, "slug": slug.current, title, category, fuel, type, capacity, price, discount }[0...10]'

#     results = await fetch_from_sanity(groq)
#     if not results:
#         return json.dumps({"cars": [], "message": "No cars found."})

#     cars = []
#     for r in results:
#         car = {
#             "title": r["title"],
#             "category": r["category"],
#             "price": r["price"],
#             "discount": r.get("discount"),
#             "fuel": r["fuel"],
#             "type": r["type"],
#             "capacity": r["capacity"],
#             "slug": r["slug"],
#         }
#         cars.append(car)

#     return json.dumps({"cars": cars, "count": len(cars), "query": user_query})

# # -------------------- AGENT: Smart + Memory --------------------
# chat_agent = Agent(
#     name="CarRentalAgent",
#     instructions="""
# You are a professional car rental assistant. Your goal is to give **only the information the user asks for**.

# CRITICAL RULES:
# 1. **Always call `search_cars` first** for any car-related question.
# 2. Pass the **full user message** to the tool.
# 3. **Never list all cars unless user says "show all cars"**.
# 4. **After tool returns JSON**, respond **exactly** based on user intent:

#    • If user says **"show me SUV cars"** → list **only SUVs**, title + price
#    • If user says **"CR-V"** → show **full details** of that car
#    • If user says **"prices"** → show **title + price**
#    • If user says **"fuel"** → show **title + fuel**
#    • If user says **"discounts"** → show **title + discount**
#    • If user says **"popular"** → show popular cars
#    • If user says **"recommended"** → show recommended cars

# 5. **Format**:
#    • Title (Category) — $price/day (was $discount)
#    • For full details: Title, Category, Price, Discount, Fuel, Type, Capacity

# 6. **End every response** with:  
#    "Which one would you like to book?"  
#    (unless user is just asking for info)

# 7. **Remember previous messages** — if user says "that one", refer to last shown car.

# Be concise, professional, and helpful.
# """.strip(),
#     model=model,
#     tools=[search_cars],
#     output_type=str,
# )

# # -------------------- API with Memory --------------------
# class ChatRequest(BaseModel):
#     message: str
#     session_id: str = "default"  # For memory

# # In-memory session store
# SESSIONS: Dict[str, List[Dict]] = {}

# @app.post("/api/chat")
# async def chat(req: ChatRequest):
#     try:
#         session_id = req.session_id
#         if session_id not in SESSIONS:
#             SESSIONS[session_id] = []

#         # Add user message to history
#         SESSIONS[session_id].append({"role": "user", "content": req.message})

#         # Run agent with history
#         result = await Runner.run(
#             starting_agent=chat_agent,
#             input=req.message,
#             context={"history": SESSIONS[session_id][-5:]}  # Last 5 messages
#         )

#         bot_reply = result.final_output or ""

#         # Try to parse tool output
#         try:
#             data = json.loads(bot_reply)
#             if "error" in data:
#                 bot_reply = f"Error: {data['error']}"
#             elif not data.get("cars"):
#                 bot_reply = "No cars found. Try different filters."
#             else:
#                 # Let agent format it — but fallback
#                 bot_reply = format_response(data["cars"], req.message.lower())
#         except:
#             pass  # Agent already formatted

#         # Save bot reply
#         SESSIONS[session_id].append({"role": "assistant", "content": bot_reply})

#         return {"response": bot_reply}

#     except Exception as e:
#         return {"response": f"Error: {str(e)}"}

# # -------------------- Smart Formatter --------------------
# def format_response(cars: List[Dict], query: str) -> str:
#     if not cars:
#         return "No cars found."

#     lines = []
#     q = query.lower()

#     # Specific car
#     if any(name in q for name in ["cr-v", "mg zs","mg zx excite","mg zx exclusive", "rush", "terios", "koengsegg", "nissan gt-r", "rolls-royce"]):
#         car = cars[0]
#         discount = f" (was ${car['discount']})" if car.get("discount") and car["discount"] > car["price"] else ""
#         return (
#             f"**{car['title']}**\n"
#             f"Category: {car['category']}\n"
#             f"Price: ${car['price']}/day{discount}\n"
#             f"Fuel: {car['fuel']}\n"
#             f"Type: {car['type']}\n"
#             f"Capacity: {car['capacity']} seats\n"
#             f"Slug: {car['slug']}\n\n"
#             "Would you like to book this car?"
#         )

#     # Price only
#     if "price" in q and not any(x in q for x in ["fuel", "type", "capacity"]):
#         for c in cars:
#             discount = f" (was ${c['discount']})" if c.get("discount") else ""
#             lines.append(f"• {c['title']} — ${c['price']}/day{discount}")
#         return "\n".join(lines) + "\n\nWhich one would you like to book?"

#     # Fuel only
#     if "fuel" in q:
#         for c in cars:
#             lines.append(f"• {c['title']} — {c['fuel']}")
#         return "\n".join(lines)

#     # Default: title + price
#     for c in cars:
#         price_line = f"${c['price']}/day"
#         if c.get("discount") and c["discount"] > c["price"]:
#             price_line = f"Was ${c['discount']}, now ${c['price']}/day"
#         lines.append(f"• {c['title']} ({c['category']}) — {price_line}")

#     return "\n".join(lines) + "\n\nWhich one would you like to book?"

# # -------------------- Run --------------------
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)





























# main.py
import os
import re
import json
import aiohttp
from typing import List, Dict
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import AsyncOpenAI
from agents import Agent, Runner, OpenAIChatCompletionsModel, function_tool
from fastapi.middleware.cors import CORSMiddleware

# -------------------- Load .env --------------------
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

SANITY_PROJECT_ID = os.getenv("SANITY_PROJECT_ID")
SANITY_DATASET = os.getenv("SANITY_DATASET")
SANITY_API_TOKEN = os.getenv("SANITY_API_TOKEN")

# -------------------- FastAPI --------------------
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# -------------------- Gemini Client --------------------
client = AsyncOpenAI(api_key=GEMINI_API_KEY, base_url=GEMINI_BASE_URL)
model = OpenAIChatCompletionsModel(model=GEMINI_MODEL, openai_client=client)

# -------------------- Sanity Fetch --------------------
async def fetch_from_sanity(groq: str) -> List[Dict]:
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2023-08-01/data/query/{SANITY_DATASET}"
    headers = {"Authorization": f"Bearer {SANITY_API_TOKEN}"}
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers, params={"query": groq}, timeout=10) as resp:
            if resp.status != 200:
                text = await resp.text()
                raise HTTPException(status_code=resp.status, detail=f"Sanity error: {text}")
            data = await resp.json()
            return data.get("result", [])

# -------------------- TOOL: Search Cars --------------------
@function_tool
async def search_cars(user_query: str) -> str:
    q = user_query.lower().strip()

    # Detect intent
    is_suv = "suv" in q
    is_sedan = "sedan" in q
    is_specific = any(name in q for name in ["cr-v", "mg zs", "rush", "terios", "koengsegg", "nissan", "rolls"])
    is_price = "price" in q
    is_fuel = "fuel" in q
    is_popular = "popular" in q
    is_recommended = "recommended" in q
    is_all = "all" in q

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
            filters.append(f'title match "*{car_name}*" || slug.current == "{car_name}"')
    if is_popular:
        filters.append('_type == "popular"')
    if is_recommended:
        filters.append('_type == "recommended"')

    if filters:
        groq += " && " + " && ".join(filters)
    groq += '] { _id, "slug": slug.current, title, category, fuel, type, capacity, price, discount }[0...10]'

    results = await fetch_from_sanity(groq)
    if not results:
        return json.dumps({"cars": [], "message": "No cars found."})

    cars = []
    for r in results:
        cars.append({
            "title": r["title"],
            "category": r["category"],
            "price": r["price"],
            "discount": r.get("discount"),
            "fuel": r["fuel"],
            "type": r["type"],
            "capacity": r["capacity"],
            "slug": r["slug"],
        })

    return json.dumps({"cars": cars, "count": len(cars)})

# -------------------- AGENT: Smart + Booking Flow --------------------
chat_agent = Agent(
    name="CarRentalAgent",
    instructions="""
You are a professional car rental assistant.

RULES:
1. For any car query, CALL `search_cars` with full user message.
2. After JSON result:
   - List **only requested cars**
   - Format: **Title** (Category) — $price/day (was $discount)
   - Each car on **new line**
3. If user says "book this car" or selects a car:
   - Ask: "From which date to which date would you like to rent?"
   - Then: "From which location to which location?"
   - Confirm booking
4. If user says "CR-V" → show **full details** of CR-V
5. End list with: "Which one would you like to book?"

Be concise and professional.
""".strip(),
    model=model,
    tools=[search_cars],
    output_type=str,
)

# -------------------- Session Memory --------------------
SESSIONS: Dict[str, List[Dict]] = {}
BOOKING_STATE: Dict[str, Dict] = {}

# -------------------- API --------------------
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

@app.post("/api/chat")
async def chat(req: ChatRequest):
    session_id = req.session_id
    if session_id not in SESSIONS:
        SESSIONS[session_id] = []
        BOOKING_STATE[session_id] = {"step": None, "selected_car": None}

    user_msg = req.message.strip()
    SESSIONS[session_id].append({"role": "user", "content": user_msg})

    # Booking flow
    state = BOOKING_STATE[session_id]
    if state["step"] == "await_dates" and state["selected_car"]:
        BOOKING_STATE[session_id]["step"] = "await_locations"
        BOOKING_STATE[session_id]["dates"] = user_msg
        reply = "From which location to which location would you like to rent the car?"
        SESSIONS[session_id].append({"role": "assistant", "content": reply})
        return {"response": reply}

    if state["step"] == "await_locations" and state["selected_car"]:
        BOOKING_STATE[session_id]["step"] = None
        locations = user_msg
        car = state["selected_car"]
        reply = (
            f"Booking confirmed!\n"
            f"**{car['title']}** ({car['category']})\n"
            f"From: {BOOKING_STATE[session_id]['dates']}\n"
            f"Locations: {locations}\n"
            f"Total: ${car['price'] * 3}/3 days\n\n"
            f"Thank you for choosing us!"
        )
        SESSIONS[session_id].append({"role": "assistant", "content": reply})
        BOOKING_STATE[session_id] = {"step": None, "selected_car": None}
        return {"response": reply}

    # Run agent
    result = await Runner.run(starting_agent=chat_agent, input=user_msg)
    raw = result.final_output or ""

    try:
        data = json.loads(raw)
        if "error" in data:
            reply = f"Error: {data['error']}"
        elif not data.get("cars"):
            reply = "No cars found. Try different filters."
        else:
            cars = data["cars"]
            lines = []

            # Specific car?
            if len(cars) == 1 and any(name in user_msg.lower() for name in ["cr-v", "mg zs", "rush"]):
                c = cars[0]
                discount = f" (was ${c['discount']})" if c.get("discount") else ""
                reply = (
                    f"**{c['title']}**\n"
                    f"Category: {c['category']}\n"
                    f"Price: ${c['price']}/day{discount}\n"
                    f"Fuel: {c['fuel']}\n"
                    f"Type: {c['type']}\n"
                    f"Capacity: {c['capacity']} seats\n\n"
                    f"Would you like to book this car?"
                )
                if "book" in user_msg.lower():
                    BOOKING_STATE[session_id] = {"step": "await_dates", "selected_car": c}
                    reply = "From which date to which date would you like to rent?"
            else:
                for c in cars:
                    price_line = f"${c['price']}/day"
                    if c.get("discount") and c["discount"] > c["price"]:
                        price_line = f"Was ${c['discount']}, now ${c['price']}/day"
                    lines.append(f"**{c['title']}** ({c['category']}) — {price_line}")
                reply = "\n".join(lines) + "\n\nWhich one would you like to book?"

            # Detect booking intent
            if "book" in user_msg.lower() or "this car" in user_msg.lower():
                if cars:
                    BOOKING_STATE[session_id] = {"step": "await_dates", "selected_car": cars[0]}
                    reply = "From which date to which date would you like to rent?"

    except:
        reply = raw or "No response."

    SESSIONS[session_id].append({"role": "assistant", "content": reply})
    return {"response": reply}

# -------------------- Run --------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)