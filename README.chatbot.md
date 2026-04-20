# Car Rental Chatbot Docker Deployment

## Files Created

- `Dockerfile.chatbot` - Docker image for HuggingFace Spaces
- `requirements.chatbot.txt` - Python dependencies  
- `app.py` - FastAPI chatbot backend (port 7860)

## Deploy to HuggingFace

1. Create a new Space on HuggingFace: https://space.new/space

2. Select "Docker" as the SDK

3. Upload these files:
   - `Dockerfile.chatbot`
   - `requirements.chatbot.txt`
   - `app.py`

4. Set the port to `7860` in the Space settings

5. The Space will automatically build and deploy

## Local Development

```bash
# Build the image
docker build -f Dockerfile.chatbot -t car-rental-chatbot .

# Run the container
docker run -p 7860:7860 car-rental-chatbot

# Or use docker-compose
docker-compose up -d
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /api/chat` - Chat endpoint

## Chat Request Example

```json
{
  "message": "show me SUVs",
  "session_id": "user-123",
  "user_id": "user-456"
}
```

## Environment Variables

- `PORT` - Server port (default: 7860)
- `HOST` - Server host (default: 0.0.0.0)