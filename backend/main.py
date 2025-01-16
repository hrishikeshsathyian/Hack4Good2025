import uuid
from fastapi import FastAPI
from supabase_setup import supabase
from firebase_setup import admin_auth
from interfaces import CreateUserBody, UUIDBody, UpdateInventoryBody
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

@app.get("/get_voucher_outflow")
async def get_voucher_outflow(body: UUIDBody):
    result = await db.get_voucher_outflow(uuid.UUID(body.uuid))
    return result.data

@app.get("/get_voucher_inflow")
async def get_voucher_inflow(body: UUIDBody):
    result = await db.get_voucher_inflow(uuid.UUID(body.uuid))
    return result.data

@app.post("/get_transaction_history")
async def get_transaction_history(body: UUIDBody):
    try:
        # Fetch voucher inflow
        inflow_result = await db.get_voucher_inflow(body.uuid)
        inflow_data = inflow_result.data if inflow_result else []

        # Add transaction type to inflow
        for record in inflow_data:
            record["transaction_type"] = "inflow"
            if "issuer_id" in record and record["issuer_id"]:
                # Fetch issuer name for each issuer_id
                issuer_name_result = await get_issuer_name(record["issuer_id"])
                record["issuer_name"] = issuer_name_result
            else:
                record["issuer_name"] = "-"

        # Fetch voucher outflow
        outflow_result = await db.get_voucher_outflow(body.uuid)
        outflow_data = outflow_result.data if outflow_result else []

        # Add transaction type to outflow and fetch product names
        for record in outflow_data:
            record["transaction_type"] = "outflow"
            if "product_id" in record and record["product_id"]:
                # Fetch product name for each product_id
                product_name_result = await get_product_name(record["product_id"])
                record["product_name"] = product_name_result  # Replace product_id with name
            else:
                record["product_name"] = "-"

        # Combine and sort by created_at
        combined_data = inflow_data + outflow_data
        sorted_data = sorted(combined_data, key=lambda x: x["created_at"], reverse=True)

        return {"transaction_history": sorted_data}

    except Exception as e:
        print(f"Error fetching transaction history: {e}")
        return {"message": str(e)}
    
@app.get("/get_product_name/{product_id}")
async def get_product_name(product_id: str):
    result = await db.get_product_name(product_id)
    return result.data[0]["name"]

@app.get("/get_issuer_name/{issuer_id}")
async def get_issuer_name(issuer_id: str):
    result = await db.get_issuer_name(issuer_id)
    return result.data[0]["display_name"]

@app.get("/get_all_products")
async def get_all_products():
    result = await db.get_all_products()

    if not result.data:
        return {"error": "Failed to fetch products"}

    products_with_images = []
    for product in result.data:
        image_path = product.get("image_path")
        if image_path:
            public_url = supabase.storage.from_('image').get_public_url(image_path)
            product["image_url"] = public_url
        else:
            product["image_url"] = None

        products_with_images.append(product)

    return products_with_images

@app.get("/get_filtered_products/{filter}")
async def get_filtered_products(filter: str):
    result = await db.get_filtered_products(filter)
    return result.data