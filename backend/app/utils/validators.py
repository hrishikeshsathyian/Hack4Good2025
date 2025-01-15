from datetime import datetime
from fastapi import HTTPException
from typing import Optional

def validate_auction_end_time(end_time: datetime) -> None:
    """Validate that auction end time is in the future."""
    if end_time <= datetime.now():
        raise HTTPException(
            status_code=400,
            detail="Auction end time must be in the future"
        )

def validate_voucher_points(points: int, required_points: int) -> None:
    """Validate if user has enough voucher points."""
    if points < required_points:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient voucher points. Required: {required_points}, Available: {points}"
        )

def validate_product_quantity(
    available_qty: int,
    requested_qty: int,
    product_name: Optional[str] = None
) -> None:
    """Validate if product has enough quantity."""
    if available_qty < requested_qty:
        product_info = f" for {product_name}" if product_name else ""
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient stock{product_info}. Available: {available_qty}, Requested: {requested_qty}"
        )