from app.config.supabase_setup import supabase
from app.models.auction import AuctionCreate, AuctionResponse, BidCreate, BidResponse
from fastapi import HTTPException
from typing import List
from datetime import datetime

class AuctionService:
    async def create_auction(self, auction: AuctionCreate) -> AuctionResponse:
        if auction.end_time <= datetime.now():
            raise HTTPException(status_code=400, detail="End time must be in the future")
            
        try:
            response = supabase.table('auction_items').insert(auction.dict()).execute()
            return AuctionResponse(**response.data[0])
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def place_bid(self, auction_id: str, bid: BidCreate, user_id: str) -> BidResponse:
        # Get auction
        auction = await self.get_auction(auction_id)
        
        # Validate auction is still active
        if auction.end_time <= datetime.now():
            raise HTTPException(status_code=400, detail="Auction has ended")
            
        # Validate bid amount
        if bid.bid_amount <= auction.current_highest_bid:
            raise HTTPException(
                status_code=400, 
                detail=f"Bid must be higher than current bid of {auction.current_highest_bid}"
            )
            
        # Create bid
        try:
            bid_data = bid.dict()
            bid_data["bidder_id"] = user_id
            
            response = supabase.table('bids').insert(bid_data).execute()
            
            # Update auction's current highest bid
            supabase.table('auction_items').update({
                "current_highest_bid": bid.bid_amount
            }).eq('id', auction_id).execute()
            
            return BidResponse(**response.data[0])
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))