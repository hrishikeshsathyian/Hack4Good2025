import uuid
from datetime import date
from pydantic import BaseModel

class CreateUserBody(BaseModel):
    display_name: str 
    email: str
    age: int
    voucher_points: int
    phone_number: str
    date_of_birth: date
    

class UpdateUserBody(BaseModel):
    uid: str
    display_name: str 
    supabase_id: str
    email: str
    voucher_points: int

class UpdateInventoryBody(BaseModel):
    product_id: str
    name: str
    description: str
    qty: int
    price: int

class GetBreakdownBody(BaseModel):
    start_date: date
    end_date: date

class GenerateAiBody(BaseModel):
    query: str 
    start_date: date
    end_date: date

class TransactionOutflow(BaseModel):
    id: uuid.UUID
    amount: int
    recipient_id: uuid.UUID
    product_id: str
    qty: int
    price: int
    date: date

class UUIDBody(BaseModel):
    uuid: str


class addItemBody(BaseModel):
    name: str
    description: str
    qty: int
    price: int
    category: str

class UpdateStatusBody(BaseModel):
    product_id: str
    quantity: int

class Transaction(BaseModel):
    user_name: str 
    status: str
    acquired_at: date 
    product_name: str
    price: int

class AddAuctionItemBody(BaseModel):
    name: str
    description: str

class EndAuctionItemBody(BaseModel):
    current_highest_bidder_id: str
    auction_id: str
    auction_product_id: str 

