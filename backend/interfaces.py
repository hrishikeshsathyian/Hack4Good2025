from datetime import date
from pydantic import BaseModel

class CreateUserBody(BaseModel):
    display_name: str 
    email: str
    age: int
    phone_number: str
    date_of_birth: date
    voucher_points: int
