from fastapi import Depends, HTTPException, Request
# from clerk_backend_api import Clerk
# from clerk_backend_api.jwks_helpers import authenticate_request, AuthenticateRequestOptions
import os
import logging
from dotenv import load_dotenv

load_dotenv(".env.local")

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

clerk_secret_key = os.environ.get("CLERK_SECRET_KEY")
frontend_url = os.environ.get("FRONTEND_URL")

# clerk = Clerk(bearer_auth=clerk_secret_key)

async def verify_auth(request: Request):
    """
    FastAPI dependency that verifies Clerk authentication using the recommended approach
    """
    try:
        logger.debug("Starting clerk auth verification")
        
        logger.debug(f"Clerk secret key: {clerk_secret_key}")
        logger.debug(f"frontend url: {frontend_url}")
        
        logger.debug(f"origin of request: {request.headers.get('origin')}")
        
        # Use Clerk's authenticate_request method
        # request_state = authenticate_request(
        #     clerk,
        #     request,
        #     AuthenticateRequestOptions(
        #         # Update this with your actual frontend URL
        #         authorized_parties=[frontend_url]
        #     )
        # )
        
        # if not request_state.is_signed_in:
        #     logger.error(f"Authentication failed: {request_state.message}")
        #     raise HTTPException(status_code=401, detail=request_state.message or "Authentication failed")

        # # Add user info to request state if needed
        # if request_state.payload:
        #     request.state.user_id = request_state.payload.get('sub')
        #     logger.debug(f"Authentication successful for user: {request.state.user_id}")
        
        # return request_state

    except Exception as e:
        logger.error(f"Auth verification failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {str(e)}") 