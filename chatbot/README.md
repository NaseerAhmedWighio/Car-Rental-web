---
title: Car Rental Chatbot
emoji: 🤖
colorFrom: blue
colorTo: green
sdk: docker
app_file: main.py
pinned: false
---

# Car Rental Chatbot

AI-powered car rental chatbot using OpenAI Agents. Fetches real cars from Sanity CMS.

## Quick Deploy

1. Create new Space: https://huggingface.co/new-space
2. Select SDK: Docker
3. Add files: `main.py`, `Dockerfile`, `requirements.txt`
4. Set App Port: `7860`

## Environment Secrets (Required)

Add in Settings → Repository secrets:

| Secret | Required | Description |
|--------|----------|-------------|
| `OPENAI_API_KEY` or `OPENROUTER_API_KEY` | **Yes** | AI API key |
| `LLM_PROVIDER` | No | "openrouter" or "gemini" (default: openrouter) |
| `SANITY_PROJECT_ID` | **Yes** | Your Sanity project ID |
| `SANITY_DATASET` | **Yes** | Your Sanity dataset name |
| `SANITY_API_TOKEN` | **Yes** | Your Sanity API token |

## Files

```
chatbot/
├── main.py           ← Main application (AI Agent)
├── Dockerfile       ← Docker image
└── requirements.txt ← Python dependencies
```

## API Endpoints

- `GET /` - API info
- `GET /api/health` - Health check
- `POST /api/chat` - Chat endpoint
- `POST /api/cart/sync` - Cart sync

## Test

```bash
curl http://localhost:7860/api/health
```
```json
{"status": "ok", "service": "car-rental-chatbot"}
```