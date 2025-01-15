from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, UUID4

class TherapyFrequency(str, Enum):
    WEEKLY = 'weekly'
    BIWEEKLY = 'biweekly'
    MONTHLY = 'monthly'
    OTHER = 'other'

class UserBase(BaseModel):
    preferred_name: Optional[str] = None
    therapy_frequency: Optional[TherapyFrequency] = None
    onboarding_completed: bool = False

class UserCreate(UserBase):
    clerk_id: str

class UserRead(UserBase):
    id: UUID4
    clerk_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True