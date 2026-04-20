# main.py - Simple Chatbot without Agents framework
import os
import re
import json
import aiohttp
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import AsyncOpenAI
from fastapi.middleware.cors import CORSMiddleware

# -------------------- Environment Variables --------------------
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openrouter").lower()

if LLM_PROVIDER == "gemini":
    LLM_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
    LLM_MODEL = os.getenv("GEMINI_MODEL") or "gemini-2.0-flash"
    LLM_BASE_URL = os.getenv("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/")
elif LLM_PROVIDER == "openrouter":
    LLM_API_KEY = os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")
    LLM_MODEL = os.getenv("OPENROUTER_MODEL") or "qwen/qwen-2.5-72b-instruct"
    LLM_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
else:
    LLM_API_KEY = os.getenv("OPENAI_API_KEY")
    LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
    LLM_BASE_URL = os.getenv("OPENAI_BASE_URL")

SANITY_PROJECT_ID = os.getenv("SANITY_PROJECT_ID")
SANITY_DATASET = os.getenv("SANITY_DATASET", "production")
SANITY_API_TOKEN = os.getenv("SANITY_API_TOKEN")

# -------------------- FastAPI --------------------
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

print(f"Using LLM Provider: {LLM_PROVIDER}")
print(f"Model: {LLM_MODEL}")

# -------------------- OpenAI Client --------------------
extra_headers = {}
if LLM_PROVIDER == "openrouter":
    extra_headers = {
        "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "http://localhost:3000"),
        "X-Title": os.getenv("OPENROUTER_APP_NAME", "Car Rental Chatbot"),
    }

client = AsyncOpenAI(
    api_key=LLM_API_KEY,
    base_url=LLM_BASE_URL if LLM_BASE_URL else None,
    default_headers=extra_headers if extra_headers else None
)

# -------------------- Sanity Fetch --------------------
async def fetch_from_sanity(groq: str, params: dict = None) -> List[Dict]:
    if not SANITY_PROJECT_ID or not SANITY_API_TOKEN:
        return []
    
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2023-08-01/data/query/{SANITY_DATASET}"
    headers = {"Authorization": f"Bearer {SANITY_API_TOKEN}"}
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url, headers=headers, params={"query": groq, **(params or {})}, timeout=15) as resp:
                if resp.status != 200:
                    return []
                data = await resp.json()
                return data.get("result", [])
        except Exception as e:
            print(f"Sanity error: {e}")
            return []

# -------------------- Tools --------------------
async def search_cars(user_query: str) -> str:
    q = user_query.lower()
    filters = []
    
    if "suv" in q: filters.append('category == "SUV"')
    if "sedan" in q: filters.append('category == "Sedan"')
    if "truck" in q: filters.append('category == "Truck"')
    if "electric" in q: filters.append('category == "Electric"')
    if "popular" in q: filters.append('_type == "popular"')
    if "recommended" in q: filters.append('_type == "recommended"')
    
    groq = '*[_type in ["popular", "recommended"]'
    if filters:
        groq += " && " + " && ".join(filters)
    groq += '] | order(_createdAt desc) { _id, "slug": slug.current, title, category, fuel, type, capacity, price, discount }[0...10]'
    
    results = await fetch_from_sanity(groq)
    return json.dumps({"cars": results, "count": len(results)})

async def add_to_cart(slug: str) -> str:
    if not slug:
        return json.dumps({"success": False, "error": "Slug required"})
    
    groq = '*[_type in ["popular", "recommended"] && slug.current == $slug][0] { _id, "slug": slug.current, title, category, price, discount }'
    car = await fetch_from_sanity(groq, {"slug": slug})
    
    if not car:
        return json.dumps({"success": False, "error": "Car not found"})
    
    return json.dumps({
        "success": True,
        "action": "add",
        "car": car,
        "message": f"{car['title']} added to cart!"
    })

async def get_cart(slugs: List[str]) -> str:
    if not slugs:
        return json.dumps({"cars": []})
    
    groq = f'*[_type in ["popular", "recommended"] && slug.current in $slugs] {{ _id, "slug": slug.current, title, category, price, discount }}'
    cars = await fetch_from_sanity(groq, {"slugs": slugs})
    return json.dumps({"cars": cars, "count": len(cars)})

# -------------------- Chat --------------------
SESSIONS: Dict[str, List[Dict]] = {}

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"
    cart_slugs: Optional[List[str]] = None

SYSTEM_PROMPT = """You are a professional car rental assistant.

Rules:
1. For car searches, call search_cars tool first
2. Format car listings with prices: **$80/day** or **$120/day (was $150)**
3. When user wants to book, call add_to_cart with car slug
4. Use get_cart to show user's cart
5. Be helpful, concise, and professional

Car search examples:
- "show SUVs" -> search_cars
- "all cars" -> search_cars  
- "automatic cars" -> search_cars"""

# No tools - using direct function calls instead
TOOLS = []

@app.post("/api/chat")
async def chat(req: ChatRequest):
    session_id = req.session_id
    if session_id not in SESSIONS:
        SESSIONS[session_id] = []
    
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Add conversation history
    for msg in SESSIONS[session_id][-6:]:
        messages.append(msg)
    
    messages.append({"role": "user", "content": req.message})
    
    # Check for tool calls in message
    msg_lower = req.message.lower()
    
    try:
        # Handle car search
        if any(k in msg_lower for k in ["show", "browse", "list", "available", "cars", "suv", "sedan", "truck"]):
            result = await search_cars(req.message)
            data = json.loads(result)
            if data.get("cars"):
                cars_text = "\n".join([f"**{c['title']}** - ${c.get('discount', c.get('price', 0))}/day ({c.get('category', 'N/A')})" for c in data["cars"]])
                response = f"🚗 **Available Cars:**\n{cars_text}\n\nWhich car would you like to book?"
            else:
                response = "No cars found. Try different filters!"
            SESSIONS[session_id].append({"role": "user", "content": req.message})
            SESSIONS[session_id].append({"role": "assistant", "content": response})
            return {"response": response}
        
        # Handle add to cart
        if any(k in msg_lower for k in ["book", "rent", "add"]):
            # Try to extract car name
            match = re.search(r"(?:book|rent|add)\s+(?:the\s+)?(.+?)(?:\s+car)?$", msg_lower)
            if match:
                car_name = match.group(1).strip()
                result = await search_cars(car_name)
                data = json.loads(result)
                if data.get("cars"):
                    car = data["cars"][0]
                    result = await add_to_cart(car.get("slug"))
                    add_data = json.loads(result)
                    if add_data.get("success"):
                        response = f"✅ {add_data.get('message', 'Added to cart!')}"
                        SESSIONS[session_id].append({"role": "user", "content": req.message})
                        SESSIONS[session_id].append({"role": "assistant", "content": response})
                        return {"response": response}
            
            response = "I couldn't find that car. Say 'show me cars' to see available options."
            SESSIONS[session_id].append({"role": "user", "content": req.message})
            SESSIONS[session_id].append({"role": "assistant", "content": response})
            return {"response": response}
        
        # Handle show cart
        if "my cart" in msg_lower or "my rentals" in msg_lower:
            if req.cart_slugs:
                result = await get_cart(req.cart_slugs)
                data = json.loads(result)
                if data.get("cars"):
                    cars_text = "\n".join([f"**{c['title']}** - ${c.get('discount', c.get('price', 0))}/day" for c in data["cars"]])
                    response = f"📋 **Your Cart:**\n{cars_text}"
                else:
                    response = "Your cart is empty."
            else:
                response = "Your cart is empty. Browse cars to add some!"
            SESSIONS[session_id].append({"role": "user", "content": req.message})
            SESSIONS[session_id].append({"role": "assistant", "content": response})
            return {"response": response}
        
        # Use OpenAI for other messages
        try:
            response = await client.chat.completions.create(
                model=LLM_MODEL,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            reply = response.choices[0].message.content or "I couldn't process that."
        except Exception as e:
            print(f"OpenAI error: {e}")
            reply = f"I understood: '{req.message}'. Try: 'show me cars', 'book Tesla car', or 'show my rentals'."
        
        reply = response.choices[0].message.content or "I couldn't process that. Try 'show me cars'!"
        
    except Exception as e:
        print(f"Error: {e}")
        reply = f"I understood: '{req.message}'. Try: 'show me cars', 'book Tesla car', or 'show my rentals'."
    
    SESSIONS[session_id].append({"role": "user", "content": req.message})
    SESSIONS[session_id].append({"role": "assistant", "content": reply})
    
    # Keep session limited
    if len(SESSIONS[session_id]) > 10:
        SESSIONS[session_id] = SESSIONS[session_id][-10:]
    
    return {"response": reply}

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "car-rental-chatbot", "provider": LLM_PROVIDER}

# -------------------- Run --------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "7860"))
    uvicorn.run("main:app", host="0.0.0.0", port=port)