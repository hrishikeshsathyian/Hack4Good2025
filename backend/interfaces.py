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
    prompt: str 
    start_date: date
    end_date: date