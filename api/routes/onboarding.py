from fastapi import APIRouter, Query, Request, Depends
from fastapi.responses import StreamingResponse
from ..models.chat import ChatRequest
from ..services.onboarding_chat import OnboardingChat
from ..chat.stream import stream_responses
from ..services.user import UserService
from ..models.user import UserCreate
from ..middleware.auth import verify_auth
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/onboarding")
async def handle_onboarding_chat(
    request: Request,
    chat_request: ChatRequest,
    protocol: str = Query('data'),
    # auth_state = Depends(verify_auth)
):
    logger.debug(f"Received onboarding request with protocol: {protocol}")
    logger.debug(f"Chat request messages: {chat_request.messages}")

    try:
        logger.debug(f"Processing onboarding for user: {request.state.user_id}")
        
        # Check if user exists, if not create one
        # user_service = UserService()
        # user = await user_service.get_user_by_clerk_id(request.state.user_id)
        
        # if not user:
        #     # Create new user
        #     user_create = UserCreate(
        #         clerk_id=request.state.user_id,
        #         onboarding_completed=False
        #     )
        #     user = await user_service.create_user(user_create)
        #     logger.debug(f"Created new user: {user.id}")
        
        onboarding_chat = OnboardingChat()
        response_stream = onboarding_chat.handle_onboarding(chat_request.messages)
        
        return StreamingResponse(stream_responses(response_stream), media_type="text/event-stream")
        
    except Exception as e:
        logger.error(f"Error processing onboarding chat: {str(e)}", exc_info=True)
        raise
