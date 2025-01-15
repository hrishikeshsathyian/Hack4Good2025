from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

class VoucherBase(BaseModel):
    amount: int = Field(gt=0)
    recipient_id: UUID

class VoucherInflowCreate(VoucherBase):
    issuer_id: UUID

class VoucherOutflowCreate(VoucherBase):
    item_id: Optional[UUID] = None
    product_id: Optional[UUID] = None
    is_auction: bool = False

class VoucherResponse(VoucherBase):
    id: UUID
    created_at: datetime