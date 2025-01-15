from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI, Query, Request, Depends
from fastapi.responses import StreamingResponse
from .utils.prompt import ClientMessage, convert_to_openai_messages
from .chat.stream import stream_text
from .middleware.auth import verify_auth
import logging

load_dotenv(".env.local")

app = FastAPI()

logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    messages: List[ClientMessage]

@app.post("/api/chat")
async def handle_chat_data(
    request: Request,
    chat_request: ChatRequest,
    protocol: str = Query('data'),
    auth_state = Depends(verify_auth)
):
    logger.debug(f"Request authenticated for user: {request.state.user_id}")
    messages = chat_request.messages
    openai_messages = convert_to_openai_messages(messages)

    response = StreamingResponse(stream_text(openai_messages, protocol))
    response.headers['x-vercel-ai-data-stream'] = 'v1'
    return response
