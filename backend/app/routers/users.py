from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from app.models.user import UserCreate, UserUpdate, UserResponse
from app.services.user_service import UserService
from app.utils.auth import verify_firebase_token, require_admin

router = APIRouter()
user_service = UserService()

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate, token: dict = Depends(verify_firebase_token)):
    return await user_service.create_user(user, token)

@router.get("/me", response_model=UserResponse)
async def get_current_user(token: dict = Depends(verify_firebase_token)):
    return await user_service.get_user_by_id(token['uid'])

@router.get("/", response_model=List[UserResponse])
@require_admin
async def get_all_users(token: dict = Depends(verify_firebase_token)):
    return await user_service.get_all_users()

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str, 
    user_update: UserUpdate, 
    token: dict = Depends(verify_firebase_token)
):
    # Check if user is updating their own profile or is admin
    if token['uid'] != user_id:
        await require_admin(token)
    return await user_service.update_user(user_id, user_update)