from fastapi import FastAPI
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
     return {"message": f"User {body.display_name} created successfully"}
    except Exception as e:
        return {"message": str(e)}