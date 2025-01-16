import uuid
from datetime import date
from pydantic import BaseModel

class CreateUserBody(BaseModel):
    display_name: str 
    email: str
    age: int
    phone_number: str
    date_of_birth: date
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