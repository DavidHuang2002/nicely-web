from pydantic import BaseModel
from typing import Optional, List
from .attachment import ClientAttachment


class ClientMessage(BaseModel):
    role: str
    content: str
    experimental_attachments: Optional[List[ClientAttachment]] = None

class ChatRequest(BaseModel):
    messages: List[ClientMessage]
