# services/ai-tagger/main.py
# FastAPI microservice for AI-powered video tagging.
# Runs separately from Next.js. Called by the ingest pipeline.
# Uses OpenAI by default; falls back to Ollama (self-hosted) if OLLAMA_HOST is set.

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import httpx
import json

app = FastAPI(title="Weknoq AI Tagger", version="0.1.0")

OPENAI_API_KEY  = os.getenv("OPENAI_API_KEY", "")
OLLAMA_HOST     = os.getenv("OLLAMA_HOST", "")   # e.g. http://localhost:11434
OLLAMA_MODEL    = os.getenv("OLLAMA_MODEL", "llama3")

# ─────────────────────────────────────────────
# Request / Response models
# ─────────────────────────────────────────────

class TagRequest(BaseModel):
    title: str
    description: str
    channel_name: Optional[str] = ""

class TagResponse(BaseModel):
    topic_slugs: list[str]
    difficulty: str           # BEGINNER | INTERMEDIATE | ADVANCED
    summary: str              # "What you'll learn" — 1-2 sentences
    tags: list[str]           # raw keyword tags

# ─────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────

SYSTEM_PROMPT = """You are a video classifier for an educational video aggregator.
Given a video title, description, and channel name, return ONLY a JSON object with:
- topic_slugs: array of matching slugs from: programming, science, philosophy, finance, music-arts, languages, mathematics, history, psychology, design
- difficulty: one of BEGINNER, INTERMEDIATE, ADVANCED
- summary: 1-2 sentence "what you'll learn" blurb, plain English, no hype
- tags: array of up to 8 relevant lowercase keyword tags

Return ONLY the JSON, no explanation."""

def build_user_prompt(title: str, description: str, channel: str) -> str:
    desc_preview = description[:600].strip()
    return f"""Title: {title}
Channel: {channel}
Description: {desc_preview}"""

# ─────────────────────────────────────────────
# LLM calls
# ─────────────────────────────────────────────

async def call_openai(prompt: str) -> str:
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={
                "model": "gpt-4o-mini",   # cheapest, fast
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": prompt},
                ],
                "max_tokens": 300,
                "temperature": 0.2,
            },
        )
        res.raise_for_status()
        return res.json()["choices"][0]["message"]["content"]

async def call_ollama(prompt: str) -> str:
    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            f"{OLLAMA_HOST}/api/chat",
            json={
                "model": OLLAMA_MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": prompt},
                ],
                "stream": False,
            },
        )
        res.raise_for_status()
        return res.json()["message"]["content"]

# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "mode": "ollama" if OLLAMA_HOST else "openai"}

@app.post("/tag", response_model=TagResponse)
async def tag_video(req: TagRequest):
    prompt = build_user_prompt(req.title, req.description, req.channel_name or "")

    try:
        if OLLAMA_HOST:
            raw = await call_ollama(prompt)
        elif OPENAI_API_KEY:
            raw = await call_openai(prompt)
        else:
            raise HTTPException(
                status_code=503,
                detail="No AI backend configured. Set OPENAI_API_KEY or OLLAMA_HOST."
            )

        # Parse JSON — strip any markdown fences
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(clean)

        return TagResponse(
            topic_slugs=data.get("topic_slugs", []),
            difficulty=data.get("difficulty", "BEGINNER"),
            summary=data.get("summary", ""),
            tags=data.get("tags", []),
        )

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="LLM returned invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
