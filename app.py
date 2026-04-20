"""
Car Rental Chatbot for HuggingFace Spaces
Port: 7860
Environment Variables:
  - OPENAI_API_KEY (required for AI responses)
  - MODEL_NAME (default: gpt-3.5-turbo)
  - TEMPERATURE (default: 0.7)
  - MAX_TOKENS (default: 500)
  - SYSTEM_PROMPT (optional custom prompt)
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
import re

app = FastAPI(title="Car Rental Chatbot")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Environment variables with defaults
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
MODEL_NAME = os.getenv("MODEL_NAME", "gpt-3.5-turbo")
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "500"))
SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT", "You are a helpful car rental assistant.")

CARS = [
    {"slug": "tesla-model-y", "title": "Tesla Model Y", "category": "Electric", "price": 120, "discount": 100},
    {"slug": "bmw-x5", "title": "BMW X5", "category": "SUV", "price": 90, "discount": 80},
    {"slug": "mercedes-gle", "title": "Mercedes GLE", "category": "SUV", "price": 110, "discount": 95},
    {"slug": "toyota-camry", "title": "Toyota Camry", "category": "Sedan", "price": 45, "discount": 40},
    {"slug": "honda-civic", "title": "Honda Civic", "category": "Sedan", "price": 40, "discount": 35},
    {"slug": "ford-f150", "title": "Ford F-150", "category": "Truck", "price": 85, "discount": 75},
    {"slug": "chevrolet-silverado", "title": "Chevrolet Silverado", "category": "Truck", "price": 80, "discount": 70},
    {"slug": "nissan-leaf", "title": "Nissan Leaf", "category": "Electric", "price": 55, "discount": 50},
    {"slug": "audi-q7", "title": "Audi Q7", "category": "SUV", "price": 100, "discount": 90},
    {"slug": "hyundai-santa-fe", "title": "Hyundai Santa Fe", "category": "SUV", "price": 60, "discount": 55},
]

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    cart_slugs: Optional[List[str]] = []
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    user_name: Optional[str] = None

user_sessions = {}

def chat_response(msg: str, user_id: Optional[str], cart: List[str]) -> Dict[str, Any]:
    msg = msg.lower()
    response = {"response": "", "action": None, "success": False, "car": None, "cars": None}
    
    # Search/browse cars
    if any(k in msg for k in ["show", "browse", "list", "available"]):
        cat = None
        if "suv" in msg: cat = "SUV"
        elif "sedan" in msg: cat = "Sedan"
        elif "truck" in msg: cat = "Truck"
        elif "electric" in msg: cat = "Electric"
        
        cars = [c for c in CARS if not cat or c["category"] == cat][:5]
        if cars:
            response["cars"] = cars
            response["car"] = cars[0]
            response["action"] = "search_cars"
            response["success"] = True
            text = "Here are some cars:\n"
            text += "\n".join([f"• **{c['title']}** - ${c.get('discount', c['price'])}/day ({c['category']})" for c in cars])
            text += "\n\nSay 'book this car' to add one!"
            response["response"] = text
        return response
    
    # Book specific car
    if any(k in msg[:20] for k in ["book", "rent", "reserve"]):
        name = re.search(r"(?:book|rent|reserve)\s+(?:the\s+)?(?:my\s+)?(.+?)(?:\s+car)?$", msg)
        if name:
            car_name = name.group(1).strip()
            for c in CARS:
                if car_name in c["title"].lower():
                    response["car"] = c
                    response["action"] = "add"
                    response["success"] = True
                    response["response"] = f"✅ **{c['title']}** added! Price: ${c.get('discount', c['price'])}/day"
                    return response
            response["response"] = f"Can't find '{car_name}'. Say 'show me cars' to browse."
        return response
    
    # Book current shown car
    if "book this car" in msg or "rent this car" in msg:
        if user_id and user_id in user_sessions and "last_car" in user_sessions[user_id]:
            c = user_sessions[user_id]["last_car"]
            response["car"] = c
            response["action"] = "add"
            response["success"] = True
            response["response"] = f"✅ **{c['title']}** added!"
        else:
            response["response"] = "Browse cars first with 'show me cars'."
        return response
    
    # Show rentals
    if "my rent" in msg or "show rentable" in msg or "show my car" in msg:
        if cart:
            cars = [c for c in CARS if c["slug"] in cart]
            if cars:
                text = "Your rentals:\n" + "\n".join([f"• **{c['title']}**" for c in cars])
                response["response"] = text
            else:
                response["response"] = "Your rental list is empty."
        else:
            response["response"] = "No cars added. Say 'show me cars' to browse!"
        return response
    
    # Checkout
    if "checkout" in msg or "proceed" in msg:
        if cart:
            cars = [c for c in CARS if c["slug"] in cart]
            total = sum(c.get("discount", c["price"]) for c in cars)
            response["response"] = f"Ready for checkout!\n\nYou have {len(cars)} car(s).\nTotal: ${total}/day\n\nProceed to payment page to complete."
        else:
            response["response"] = "No cars to checkout. Add cars first with 'show me cars'."
        return response
    
    # Help
    if "help" in msg:
        response["response"] = """I can help you:
• Browse cars: "show me cars" or "show me SUVs"
• Book a car: "book this car" or "book Tesla car"
• View rentals: "show my rentals"
• Checkout: "checkout"

What would you like?"""
        return response
    
    # Default
    response["response"] = f"I understood: '{msg}'. Try:\n• \"show me cars\"\n• \"book Tesla car\"\n• \"show my rentals\"\nOr ask me anything!"
    return response

@app.post("/api/chat")
async def chat(req: ChatRequest):
    sid = req.session_id or str(uuid.uuid4())
    result = chat_response(req.message, req.user_id, req.cart_slugs or [])
    if req.user_id and result.get("car"):
        if req.user_id not in user_sessions:
            user_sessions[req.user_id] = {}
        user_sessions[req.user_id]["last_car"] = result["car"]
    return result

@app.get("/health")
async def health():
    return {"status": "healthy", "port": 7860}

@app.get("/")
async def root():
    return {"name": "Car Rental Chatbot", "version": "1.0.0", "endpoints": ["/api/chat", "/health"]}

async def get_ai_response(message: str, car_context: str = "") -> str:
    """Get AI response using OpenAI API"""
    if not OPENAI_API_KEY:
        return None
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
        
        context = f"""You are a car rental assistant. Available cars: {car_context}

Rules:
- When user wants to see cars, list them with prices
- When user wants to book, confirm with car name
- Keep responses short and helpful
- Use markdown for formatting"""

        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT + "\n\n" + context},
                {"role": "user", "content": message}
            ],
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI error: {e}")
        return None

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "7860"))
    uvicorn.run(app, host="0.0.0.0", port=port)