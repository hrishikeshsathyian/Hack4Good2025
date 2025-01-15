from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.product_service import ProductService
from app.utils.auth import verify_firebase_token, require_admin

router = APIRouter()
product_service = ProductService()

@router.post("/", response_model=ProductResponse)
@require_admin
async def create_product(
    product: ProductCreate, 
    token: dict = Depends(verify_firebase_token)
):
    return await product_service.create_product(product)

@router.get("/", response_model=List[ProductResponse])
async def get_products(token: dict = Depends(verify_firebase_token)):
    return await product_service.get_all_products()

@router.patch("/{product_id}", response_model=ProductResponse)
@require_admin
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    token: dict = Depends(verify_firebase_token)
):
    return await product_service.update_product(product_id, product_update)