from fastapi import APIRouter, Query, Request, Depends
from fastapi.responses import StreamingResponse
from ..models.chat import ChatRequest
from ..services.onboarding import OnboardingService
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
    auth_state = Depends(verify_auth)
):
    logger.debug(f"Processing onboarding for user: {request.state.user_id}")
    
    # Check if user exists, if not create one
    user_service = UserService()
    user = await user_service.get_user_by_clerk_id(request.state.user_id)
    
    if not user:
        # Create new user
        user_create = UserCreate(
            clerk_id=request.state.user_id,
            onboarding_completed=False
        )
        user = await user_service.create_user(user_create)
        logger.debug(f"Created new user: {user.id}")
    
    onboarding_service = OnboardingService()
    response = await onboarding_service.process_step(
        user_id=str(user.id),  # Convert UUID to string
        messages=chat_request.messages
    )
    
    return StreamingResponse(
        response,
        headers={'x-vercel-ai-data-stream': 'v1'}
    )
