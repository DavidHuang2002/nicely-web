from typing import Optional
from ..configs.database import supabase
from ..models.user import UserCreate, UserRead, TherapyFrequency
from fastapi import HTTPException

class UserService:
    @staticmethod
    async def create_user(user_data: UserCreate) -> UserRead:
        try:
            # Check if user already exists
            existing_user = supabase.table('users').select('*').eq('clerk_id', user_data.clerk_id).execute()
            
            if existing_user.data:
                raise HTTPException(status_code=400, detail="User already exists")
            
            # Create new user
            result = supabase.table('users').insert(user_data.model_dump()).execute()
            
            if not result.data:
                raise HTTPException(status_code=500, detail="Failed to create user")
                
            return UserRead(**result.data[0])
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def get_user_by_clerk_id(clerk_id: str) -> Optional[UserRead]:
        try:
            result = supabase.table('users').select('*').eq('clerk_id', clerk_id).execute()
            
            if not result.data:
                return None
                
            return UserRead(**result.data[0])
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
