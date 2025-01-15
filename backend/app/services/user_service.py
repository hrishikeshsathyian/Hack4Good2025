from app.config.supabase_setup import supabase
from app.config.firebase_setup import admin_auth
from app.models.user import UserCreate, UserUpdate, UserResponse
from fastapi import HTTPException
from typing import List

class UserService:
    async def create_user(self, user: UserCreate, token: dict) -> UserResponse:
        try:
            # Create user in Firebase if not exists
            firebase_user = admin_auth.get_user_by_email(user.email)
            
            # Create user in Supabase
            supabase_user = {
                "user_id": firebase_user.uid,
                "name": user.name,
                "email": user.email,
                "phone_number": user.phone_number,
                "age": user.age,
                "date_of_birth": user.date_of_birth,
                "role": user.role
            }
            
            response = supabase.table('users').insert(supabase_user).execute()
            return UserResponse(**response.data[0])
            
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def get_user_by_id(self, user_id: str) -> UserResponse:
        response = supabase.table('users').select("*").eq('user_id', user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return UserResponse(**response.data[0])

    async def get_all_users(self) -> List[UserResponse]:
        response = supabase.table('users').select("*").execute()
        return [UserResponse(**user) for user in response.data]

    async def update_user(self, user_id: str, user_update: UserUpdate) -> UserResponse:
        update_data = user_update.dict(exclude_unset=True)
        response = supabase.table('users').update(update_data).eq('user_id', user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return UserResponse(**response.data[0])