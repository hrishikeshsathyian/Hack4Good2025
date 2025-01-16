import uuid
from fastapi import FastAPI
import ai
from supabase_setup import supabase
from firebase_setup import admin_auth
from interfaces import CreateUserBody, GenerateAiBody, GetBreakdownBody, UpdateInventoryBody
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

@app.post("/breakdown")
async def get_breakdown(body: GetBreakdownBody):
    result = await db.get_breakdown(body.start_date, body.end_date)
    return result

@app.post("/top_items")
async def get_top_items(body: GetBreakdownBody):
    result = await db.get_top_items(body.start_date, body.end_date)
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

@app.post("/generate_ai")
async def generate_ai(body: GenerateAiBody):
    try:
        response = await ai.generate_weekly_report(body.start_date, body.end_date, body.query)
        print(response)
        return response
    except Exception as e:
        print(f"Error generating AI report: {e}")
        return {"message": str(e)}
    
from datetime import datetime

@app.get("/get_pending_items/{email}")
async def get_pending_items(email: str):
    try:
        # Fetch the user details
        user_response = supabase.from_("users").select("*").eq("email", email).execute()
        user = user_response.data[0]
        user_id = user["uid"]

        # Fetch the items for the user
        response = supabase.from_("items").select("*").eq("user_id", user_id).execute()
        items = response.data

        # Replace product_id with product_name and format acquired_at
        updated_items = []
        for item in items:
            # Fetch the product name using the product_id
            product_response = supabase.from_("products").select("name").eq("id", item["product_id"]).execute()
            product_name = product_response.data[0]["name"] if product_response.data else "Unknown"
            
            # Format the acquired_at field to just the date
            acquired_date = datetime.fromisoformat(item["acquired_at"]).date().isoformat()
            price = await db.get_product_price_from_id(item["product_id"])
            # Update the item with the new fields
            updated_item = {
                "id": item["id"],
                "name": product_name,
                "price": price,
                "date_purchased": acquired_date,
                "status": item["status"]
            }
            updated_items.append(updated_item)

        return updated_items

    except Exception as e:
        print(f"Error fetching pending items: {e}")
        return {"message": str(e)}
