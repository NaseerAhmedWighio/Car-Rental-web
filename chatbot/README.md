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

Simplified car rental chatbot using OpenAI API directly.

## Quick Deploy

1. Create new Space: https://huggingface.co/new-space
2. Select SDK: Docker
3. Add files: `main.py`, `Dockerfile`, `requirements.txt`
4. Set App Port: `7860`

## Environment Secrets

Add in Settings → Repository secrets:

| Secret | Required | Description |
|--------|----------|-------------|
| `OPENROUTER_API_KEY` | **Yes** | OpenRouter API key |
| `SANITY_PROJECT_ID` | **Yes** | Your Sanity project ID |
| `SANITY_DATASET` | No | production (default) |
| `SANITY_API_TOKEN` | **Yes** | Your Sanity API token |
| `LLM_MODEL` | No | Model to use |

## Files

```
chatbot/
├── main.py           ← Simple chatbot
├── Dockerfile        ← Docker image
└── requirements.txt  ← Python deps
```

## Test

```bash
curl http://localhost:7860/api/health
```