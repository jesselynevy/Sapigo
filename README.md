# Backend 

SapiGo backend built with FastAPI for API Routing and Verification with Pytorch for AI Integration

Tech-stack :
FastAPI 
Pytorch

## Setup

Install [uv](https://docs.astral.sh/uv/):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Install dependencies:

```bash
uv sync
```

## Run

```bash
uv run dev
```

The API will be available at `http://127.0.0.1:8000`.

For docs this is using openapi at `http://127.0.0.1:8000/docs`.
