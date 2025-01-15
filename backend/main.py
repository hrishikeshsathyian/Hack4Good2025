import uuid
from fastapi import FastAPI
from supabase_setup import supabase
from firebase_setup import admin_auth
from interfaces import CreateUserBody, GenerateAiBody, GetBreakdownBody, UpdateInventoryBody
from fastapi.middleware.cors import CORSMiddleware
import db

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/ping")
async def ping():
    return {"message": "pong"}

@app.post("/create/user")
async def create_user(body: CreateUserBody):
    try:
     admin_auth.create_user(display_name=body.display_name, email=body.email)
     print(f"User {body.display_name} created firebase account successfully")
     supabase.from_("users").insert([{
            "display_name": body.display_name,
            "uid": str(uuid.uuid4()),
            "email": body.email,
            "phone_number": body.phone_number,
            "date_of_birth": body.date_of_birth.strftime('%Y-%m-%d'),
            "age": body.age,
            "role": "resident",
        }]).execute()
     print(f"User {body.display_name} created supabase account successfully")
     # add supabase create user
     return {"message": f"User {body.display_name} created successfully"}
    except Exception as e:
        print(f"Error creating user {e}")
        return {"message": str(e)}
    
@app.delete("/delete/user/{email}")
async def delete_user(email: str):
    try:
     print(f"Deleting user {email}")
     firebase_user = admin_auth.get_user_by_email(email)
     admin_auth.delete_user(firebase_user.uid)
     supabase.from_("users").delete().eq("email", email).execute()
     print(f"User {email} deleted successfully")
     return {"message": f"User {email} deleted successfully"}
    except Exception as e:
        print(f"Error deleting user {email}, {e}")
        return {"message": str(e)}
    
@app.get("/get/users")
async def get_users():
    user_list = []
    users = admin_auth.list_users()
    for user in users.users:
        user_obj = {
            "uid": user.uid,
            "email": user.email,
            "display_name": user.display_name
        }
        user_list.append(user_obj)

    return user_list

@app.get("/test")
async def test():
   return supabase.from_("users").select("*").execute()

@app.get("/inventory")
async def get_inventory():
    result = await db.get_inventory()
    return result

@app.put("/inventory/update")
async def update_inventory(body: UpdateInventoryBody):
    result = await db.update_inventory(body.product_id, body.qty, body.price, body.name, body.description)
    return result

@app.post("/breakdown")
async def get_breakdown(body: GetBreakdownBody):
    result = await db.get_breakdown(body.start_date, body.end_date)
    return result

@app.post("/top_items")
async def get_top_items(body: GetBreakdownBody):
    result = await db.get_top_items(body.start_date, body.end_date)
    return result

