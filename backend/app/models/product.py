from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID

class ProductBase(BaseModel):
    name: str
    qty: int = Field(ge=0)
    category: str
    price: int = Field(gt=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    qty: Optional[int] = Field(ge=0, default=None)
    category: Optional[str] = None
    price: Optional[int] = Field(gt=0, default=None)

class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime