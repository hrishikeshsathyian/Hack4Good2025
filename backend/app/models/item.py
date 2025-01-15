from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class ItemBase(BaseModel):
    product_id: UUID
    user_id: UUID

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: UUID
    acquired_at: datetime