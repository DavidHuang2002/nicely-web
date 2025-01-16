from fastapi import APIRouter, Query, Request, Depends
from fastapi.responses import StreamingResponse
from ..models.chat import ChatRequest
from ..utils.prompt import convert_to_openai_messages
from ..chat.stream import handle_chat_stream
from ..middleware.auth import verify_auth
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/chat")
async def handle_chat_data(
    request: Request,
    chat_request: ChatRequest,
    protocol: str = Query('data'),
    # auth_state = Depends(verify_auth)
):
    # logger.debug(f"Request authenticated for user: {request.state.user_id}")
    messages = chat_request.messages
    openai_messages = convert_to_openai_messages(messages)

    response = StreamingResponse(handle_chat_stream(openai_messages, protocol))
    response.headers['x-vercel-ai-data-stream'] = 'v1'
    return response 