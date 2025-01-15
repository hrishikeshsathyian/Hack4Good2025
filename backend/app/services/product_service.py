from app.config.supabase_setup import supabase
from app.models.product import ProductCreate, ProductUpdate, ProductResponse
from fastapi import HTTPException
from typing import List

class ProductService:
    async def create_product(self, product: ProductCreate) -> ProductResponse:
        try:
            response = supabase.table('products').insert(product.dict()).execute()
            return ProductResponse(**response.data[0])
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def get_product(self, product_id: str) -> ProductResponse:
        response = supabase.table('products').select("*").eq('id', product_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return ProductResponse(**response.data[0])

    async def update_stock(self, product_id: str, quantity_change: int) -> ProductResponse:
        # First get current stock
        product = await self.get_product(product_id)
        new_qty = product.qty + quantity_change
        
        if new_qty < 0:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        
        response = supabase.table('products').update(
            {"qty": new_qty}
        ).eq('id', product_id).execute()
        
        return ProductResponse(**response.data[0])