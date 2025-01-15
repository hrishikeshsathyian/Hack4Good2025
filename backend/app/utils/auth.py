from fastapi import Request, HTTPException, Depends
from firebase_admin import auth
from functools import wraps
from app.config.supabase_setup import supabase
from typing import Optional

async def verify_firebase_token(request: Request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(
            status_code=401, 
            detail="Missing authorization header"
        )
    
    try:
        token = auth_header.split(' ')[1]
        decoded_token = auth.verify_id_token(token)
        # Store user info in request state for later use
        request.state.user_id = decoded_token['uid']
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401, 
            detail="Invalid authentication credentials"
        )

async def get_user_role(user_id: str) -> Optional[str]:
    """Get user role from Supabase."""
    try:
        response = supabase.table('users').select('role').eq('user_id', user_id).execute()
        if response.data:
            return response.data[0]['role']
        return None
    except Exception:
        return None

def require_admin(func):
    """Decorator to check if user is admin."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        request = kwargs.get('request')
        if not request:
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
        
        if not request:
            raise HTTPException(status_code=500, detail="Request object not found")
        
        user_role = await get_user_role(request.state.user_id)
        if user_role != 'admin':
            raise HTTPException(
                status_code=403, 
                detail="Admin privileges required"
            )
            
        return await func(*args, **kwargs)
    return wrapper