from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from uuid import UUID

class BidBase(BaseModel):
    auction_id: UUID
    bidder_id: UUID
    bid_amount: int = Field(gt=0)

class BidCreate(BidBase):
    pass

class BidResponse(BidBase):
    id: UUID
    bid_time: datetime

class AuctionBase(BaseModel):
    product_id: UUID
    end_time: datetime
    current_highest_bid: Optional[int] = Field(ge=0)

class AuctionCreate(AuctionBase):
    pass

class AuctionResponse(AuctionBase):
    id: UUID
    is_sold: bool = False
    created_at: datetime
    top_bids: List[BidResponse] = []
    