"""
AI Chatbot service using Groq free API.
Model: llama-3.1-8b-instant (fast, free, excellent quality)
Supports Hindi and English farming queries.
"""

import httpx
from app.config import settings

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM_PROMPT = """You are KisanBot, an expert AI assistant for Indian farmers. 
You help farmers with:
- Crop disease identification and treatment
- Weather-based farming advice  
- Fertilizer and irrigation recommendations
- Government schemes and subsidies for farmers
- Market prices and selling strategies
- General agricultural guidance

You can respond in both Hindi and English. If the farmer writes in Hindi, respond in Hindi.
If they write in English, respond in English. Keep responses practical, simple, and actionable.
Always be respectful and use simple language that farmers can understand.
When discussing diseases or pests, always mention both treatment and prevention.
When discussing government schemes, mention eligibility criteria."""


async def get_chat_response(message: str, history: list) -> str:
    """Send message to Groq and get response."""
    
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Add conversation history (last 5 turns)
    for turn in history[-5:]:
        if turn.get("user"):
            messages.append({"role": "user", "content": turn["user"]})
        if turn.get("bot"):
            messages.append({"role": "assistant", "content": turn["bot"]})
    
    # Add current message
    messages.append({"role": "user", "content": message})
    
    payload = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": messages,
        "max_tokens": 512,
        "temperature": 0.7,
    }
    
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            res = await client.post(GROQ_API_URL, json=payload, headers=headers)
            res.raise_for_status()
            data = res.json()
            return data["choices"][0]["message"]["content"]
            
    except httpx.TimeoutException:
        return "⏱️ Request timed out. Please try again."
    except Exception as e:
        return f"❌ Error: {str(e)}. Please try again."
