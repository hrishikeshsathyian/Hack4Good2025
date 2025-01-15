from pydantic import BaseModel, EmailStr, constr, Field
from datetime import datetime
from typing import Optional
from enum import Enum
from uuid import UUID

class UserRole(str, Enum):
    ADMIN = "admin"
    RESIDENT = "resident"

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone_number: constr(regex=r'^\+?1?\d{9,15}$')
    age: int = Field(gt=0)
    date_of_birth: datetime

class UserCreate(UserBase):
    role: UserRole = UserRole.RESIDENT

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    age: Optional[int] = Field(gt=0, default=None)
    voucher_points: Optional[int] = Field(ge=0, default=None)

class UserResponse(UserBase):
    user_id: UUID
    role: UserRole
    voucher_points: int = Field(ge=0)
    created_at: datetime