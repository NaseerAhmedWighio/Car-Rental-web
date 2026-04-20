# Docker Deployment Commands

## Build the Chatbot Image

```bash
# Build the image
docker build -f Dockerfile.chatbot -t car-rental-chatbot:latest .

# Or with no cache (faster rebuild)
docker build -f Dockerfile.chatbot -t car-rental-chatbot:latest . --no-cache
```

## Run the Container

```bash
# Run on port 7860
docker run -d -p 7860:7860 --name car-rental-chatbot car-rental-chatbot:latest

# With environment variables
docker run -d -p 7860:7860 -e PORT=7860 --name car-rental-chatbot car-rental-chatbot:latest

# With volume for persistence (optional)
docker run -d -p 7860:7860 -v $(pwd)/data:/app/data --name car-rental-chatbot car-rental-chatbot:latest
```

## Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  chatbot:
    build:
      context: .
      dockerfile: Dockerfile.chatbot
    ports:
      - "7860:7860"
    environment:
      - PORT=7860
      - HOST=0.0.0.0
    restart: unless-stopped
```

Then run:

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Test the API

```bash
# Health check
curl http://localhost:7860/health

# Chat request
curl -X POST http://localhost:7860/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "show me cars"}'
```

## HuggingFace Spaces Deployment

```bash
# Login to HuggingFace
huggingface-cli login

# Create Space (use Dockerfile SDK)
huggingface_spaces create car-rental-chatbot --sdk docker

# Or push to existing Space
git lfs install
git add .
git commit -m "Add chatbot"
git push origin main
```

## Useful Commands

```bash
# List containers
docker ps

# Stop container
docker stop car-rental-chatbot

# Remove container
docker rm car-rental-chatbot

# View logs
docker logs car-rental-chatbot

# Execute command in container
docker exec -it car-rental-chatbot bash

# Rebuild after code changes
docker-compose up -d --build
```