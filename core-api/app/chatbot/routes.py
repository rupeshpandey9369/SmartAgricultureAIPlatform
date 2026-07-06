from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.chatbot.service import get_chat_response

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


class ChatMessage(BaseModel):
    user: str
    bot: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


@router.post("/chat")
async def chat(payload: ChatRequest):
    history = [{"user": h.user, "bot": h.bot} for h in (payload.history or [])]
    response = await get_chat_response(
        message=payload.message,
        history=history
    )
    return {
        "response": response,
        "message": payload.message
    }
