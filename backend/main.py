import uuid
from fastapi import FastAPI
from supabase_setup import supabase
from firebase_setup import admin_auth
from interfaces import CreateUserBody
from fastapi.middleware.cors import CORSMiddleware

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