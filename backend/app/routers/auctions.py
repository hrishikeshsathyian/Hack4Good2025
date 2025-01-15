from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.auction import AuctionCreate, AuctionResponse, BidCreate, BidResponse
from app.services.auction_service import AuctionService
from app.utils.auth import verify_firebase_token, require_admin

router = APIRouter()
auction_service = AuctionService()

@router.post("/", response_model=AuctionResponse)
@require_admin
async def create_auction(
    auction: AuctionCreate,
    token: dict = Depends(verify_firebase_token)
):
    return await auction_service.create_auction(auction)

@router.post("/{auction_id}/bid", response_model=BidResponse)
async def place_bid(
    auction_id: str,
    bid: BidCreate,
    token: dict = Depends(verify_firebase_token)
):
    return await auction_service.place_bid(auction_id, bid, token['uid'])

@router.get("/active", response_model=List[AuctionResponse])
async def get_active_auctions(token: dict = Depends(verify_firebase_token)):
    return await auction_service.get_active_auctions()