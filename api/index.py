from fastapi import FastAPI
from dotenv import load_dotenv
import logging
from .routes import chat

load_dotenv(".env.local")

app = FastAPI()
logger = logging.getLogger(__name__)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
# app.include_router(onboarding.router, prefix="/api", tags=["onboarding"])
# app.include_router(user.router, prefix="/api", tags=["user"])
