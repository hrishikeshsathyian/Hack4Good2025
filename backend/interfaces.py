from pydantic import BaseModel

class CreateUserBody(BaseModel):
    display_name: str 
    email: str