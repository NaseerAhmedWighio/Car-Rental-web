---
title: Car Rental Chatbot
emoji: 🤖
colorFrom: blue
colorTo: green
sdk: docker
app_file: app.py
pinned: false
---

# Car Rental Chatbot

FastAPI-based chatbot for car rental website. Deploy to HuggingFace Spaces.

## Quick Deploy

1. **Create new Space**: https://huggingface.co/new-space
2. **Select SDK**: Docker
3. **Add files**: `app.py`, `Dockerfile`, `requirements.txt`
4. **Set App Port**: `7860`

## Environment Secrets

Add in **Settings → Repository secrets**:

| Secret | Required | Default |
|--------|----------|---------|
| `OPENAI_API_KEY` | Yes* | - |
| `MODEL_NAME` | No | gpt-3.5-turbo |
| `TEMPERATURE` | No | 0.7 |
| `MAX_TOKENS` | No | 500 |

*Leave empty for rule-based mode (no AI)

## Files

```
chatbot/
├── app.py           # Main application
├── Dockerfile      # Docker image
├── requirements.txt
└── README.md       # This file
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /api/chat` - Chat endpoint

## Test

```bash
curl http://localhost:7860/health
```

## Chat Request

```json
{
  "message": "show me cars",
  "user_id": "user-123"
}
```