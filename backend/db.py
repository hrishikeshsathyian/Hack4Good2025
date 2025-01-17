import uuid
from fastapi import HTTPException
from supabase_setup import supabase

async def get_user_name_from_id(user_id):
    user_name = supabase.from_("users").select("display_name").eq("uid", user_id).execute()
    return user_name.data[0]["display_name"]

async def get_product_name_from_id(product_id):
    product_name = supabase.from_("products").select("name").eq("id", product_id).execute()
    return product_name.data[0]["name"]

async def get_product_category_from_id(product_id):
    product_category = supabase.from_("products").select("category").eq("id", product_id).execute()
    return product_category

async def get_recipient_name_from_id(recipient_id):
    recipient_name = supabase.from_("users").select("display_name").eq("uid", recipient_id).execute()
    return recipient_name

async def get_transactions_for_prompt(start_date, end_date):
    transactions = supabase.from_("voucher_outflow").select("*").gte("created_at", start_date).lte("created_at", end_date).execute()
    transactions_dict = transactions.data
    for transaction in transactions_dict:
        product_name = await get_product_name_from_id(transaction["product_id"])
        transaction["product_name"] = product_name
        recipient_name = await get_recipient_name_from_id(transaction["recipient_id"])
        transaction["recipient_name"] = recipient_name
    return transactions_dict

async def get_product_price_from_id(product_id):
    product_price = supabase.from_("products").select("price").eq("id", product_id).execute()
    return product_price.data[0]["price"]
async def get_inventory(): 
    # Fetch inventory data
    response = supabase.from_("products").select("*").execute()
    inventory = response.data
    
    # Define fields to exclude
    fields_to_exclude = ["created_at", "created_by", "updated_at"]  # Replace with actual field names

    # Remove specified fields from each item
    if isinstance(inventory, list):
        sanitized_inventory = [
            {key: value for key, value in item.items() if key not in fields_to_exclude}
            for item in inventory
        ]
    
    return sanitized_inventory

async def update_inventory(product_id, qty, price, name, description):
    # Update inventory
    response = supabase.from_("products").update({"qty": qty, "price": price, "name": name, "description": description}).eq("id", product_id).execute()
    return response

async def get_breakdown(start_date, end_date):
    response = supabase.from_("voucher_outflow").select("*").gte("created_at", start_date).lte("created_at", end_date).execute()
    qty_clothings = 0
    qty_electronics = 0
    qty_food = 0
    qty_others = 0
    value_clothings = 0
    value_electronics = 0
    value_food = 0
    value_others = 0
    print(response.data)
    for transaction in response.data:
        product = await get_product_category_from_id(transaction["product_id"])
        print(product.data)
        if product.data[0]["category"] == "Clothings":
            qty_clothings += 1
            value_clothings += 1 * transaction["amount"]
        elif product.data[0]["category"] == "Electronics":
            qty_electronics += 1
            value_electronics += 1 * transaction["amount"]
        elif product.data[0]["category"] == "Food":
            qty_food += 1
            value_food += 1 * transaction["amount"]
        else:
            qty_others += 1
            value_others += 1 * transaction["amount"]
    breakdown_dict = {
        "clothings": {"qty": qty_clothings, "value": value_clothings},
        "electronics": {"qty": qty_electronics, "value": value_electronics},
        "food": {"qty": qty_food, "value": value_food},
        "others": {"qty": qty_others, "value": value_others}
    }
    return breakdown_dict

async def get_top_items(start_date, end_date):
    # Fetch transactions within the date range
    response = supabase.from_("voucher_outflow").select("*").gte("created_at", start_date).lte("created_at", end_date).execute()
    transactions = response.data

    # Dictionary to store item quantities
    item_quantities = {}

    # Aggregate quantities by product_id
    for transaction in transactions:
        product_id = transaction["product_id"]
        if product_id in item_quantities:
            item_quantities[product_id] += 1
        else:
            item_quantities[product_id] = 1

    # Convert to a list of tuples and sort by quantity in descending order
    sorted_items = sorted(item_quantities.items(), key=lambda x: x[1], reverse=True)

    # Limit to at most 5 items
    top_items = sorted_items[:5]

    # Fetch product names for the top items
    top_items_with_names = []
    for product_id, quantity in top_items:
        product_name_response = await get_product_name_from_id(product_id)
        product_name = product_name_response
        top_items_with_names.append({"name": product_name, "quantity": quantity})

    return top_items_with_names

async def get_voucher_outflow(recipient_id: str):
    # Get voucher outflow based on user id
    response = supabase.from_("voucher_outflow").select("*").eq("recipient_id", recipient_id).execute()
    return response

async def get_voucher_inflow(recipient_id: str):
    # Get voucher inflow based on user id
    response = supabase.from_("voucher_inflow").select("*").eq("recipient_id", recipient_id).execute()
    return response

async def get_product_name(product_id: str):
    # Get product details based on product id
    response = supabase.from_("products").select("name").eq("id", product_id).execute()
    return response

async def get_issuer_name(issuer_id: str):
    # Get issuer details based on issuer id
    response = supabase.from_("users").select("display_name").eq("uid", issuer_id).execute()
    return response

async def get_all_products():
    # Get all products
    response = supabase.from_("products").select("*").execute()
    return response

async def get_filtered_products(filter: str):
    # Get products based on filter
    response = supabase.from_("products").select("*").ilike("category", f"%{filter}%").execute()
    return response

async def get_current_inventory():
    # Get current inventory
    response = supabase.from_("products").select("*").execute()
    return response.data

async def add_item(name, description, quantity, price, category):
    # Add item to inventory
    response = supabase.from_("products").insert([{"name": name,"description": description, "qty": quantity, "price": price, "category": category }]).execute()
    return response

async def update_item_status(product_id, quantity):
    """
    Update the status of items from 'RESTOCK' to 'READY', ensuring the quantity excludes already 'READY' items.

    Args:
        product_id (int): The product ID for which to update the items.
        quantity (int): The desired number of items to set to 'READY'.

    Returns:
        response: The response from the Supabase query.
    """
    # Count how many items are already 'READY'
    ready_count_response = (
        supabase.from_("items")
        .select("id", count="exact")  # Count the exact number of items
        .eq("product_id", product_id)
        .eq("status", "READY")
        .execute()
    )
    
    
    ready_count = ready_count_response.count

    # Calculate the remaining quantity to update
    remaining_quantity = max(quantity - ready_count, 0)

    if remaining_quantity == 0:
        return {"message": "No items need to be updated"}

    # Fetch IDs of the items with status 'RESTOCK' to limit the update
    restock_items_response = (
        supabase.from_("items")
        .select("id")  # Only fetch the IDs
        .eq("product_id", product_id)
        .eq("status", "RESTOCK")
        .limit(remaining_quantity)  # Limit the selection to the remaining quantity
        .execute()
    )


    restock_item_ids = [item["id"] for item in restock_items_response.data]

    if not restock_item_ids:
        return {"message": "No 'RESTOCK' items available to update"}

    # Update the fetched items by their IDs
    update_response = (
        supabase.from_("items")
        .update({"status": "READY"})
        .in_("id", restock_item_ids)  # Update only the selected IDs
        .execute()
    )
    
    return update_response


async def get_transactions_for_admin():
    # Fetch all transactions for admin view
    response = supabase.from_("items").select("*").execute()
    data = response.data
    for d in data:
        d["product_name"] = await get_product_name_from_id(d["product_id"])
        d["user_name"] = await get_user_name_from_id(d["user_id"])
        d["price"] = await get_product_price_from_id(d["product_id"])
    return data

async def update_voucher_request(voucher_id):
    # Update voucher request status
    response = supabase.from_("items").update({"status": "REDEEMED"}).eq("id", voucher_id).execute()
    return response

async def add_auction_item(name, description):
    # Add item to auction inventory
    result = supabase.from_("products").insert([{"name": name,"description": description, "qty": 0, "price": 0, "category": "Others", "is_auction": True }]).execute()
    id = result.data[0]["id"]
    response = supabase.from_("auction_items").insert([{"product_id": id}]).execute()
    return response

async def pull_auction_items():
    # Fetch auction items
    response = supabase.from_("products").select("*").eq("is_auction", True).execute()
    # get items from auction_items table with the product id 
    auction_items = response.data
    for item in auction_items:
        auction_item = supabase.from_("auction_items").select("*").eq("product_id", item["id"]).execute()
        item["auction_item"] = auction_item.data
    value = []
    for item in auction_items:
        if item["auction_item"]:
            current_highest_bidder = await get_user_name_from_id(item["auction_item"][0]["current_highest_bidder"]) if item["auction_item"][0]["current_highest_bidder"] else None
            value.append({
                "id": item["id"],
                "name": item["name"],
                "description": item["description"],
                "current_highest_bid": item["auction_item"][0]["current_highest_bid"],
                "current_highest_bidder": current_highest_bidder,
                "status": "ONGOING" if not item["auction_item"][0]["is_sold"] else "SOLD",
                "current_highest_bidder_id": item["auction_item"][0]["current_highest_bidder"],
                "auction_product_id": item["auction_item"][0]["id"]
            })
    return value

async def end_auction(current_highest_bidder_id, auction_id, auction_product_id):
    # End auction
    response = supabase.from_("auction_items").update({"is_sold": True}).eq("id", auction_id).execute()
    response = supabase.from_("items").insert([{"product_id": auction_product_id, "user_id": current_highest_bidder_id, "status": "READY"}]).execute()

    return response

async def get_user_from_email(email):
    # Get user details based on email
    response = supabase.from_("users").select("*").eq("email", email).execute()
    return response.data
async def get_user_points(user_id: str):
    """Get user's current voucher points"""
    response = supabase.from_("users").select("voucher_points").eq("uid", user_id).execute()
    if not response.data:
        return None
    return response.data[0]["voucher_points"]

async def get_product_details(product_id: str):
    """Get product details including name, price, and quantity"""
    response = supabase.from_("products").select("*").eq("id", product_id).execute()
    if not response.data:
        return None
    return response.data[0]

async def update_product_quantity(product_id: str, quantity: int):
    """Update product quantity after purchase"""
    # Get current quantity first
    current = await get_product_details(product_id)
    new_quantity = current["qty"] - quantity
    
    response = supabase.from_("products").update(
        {"qty": new_quantity}
    ).eq("id", product_id).execute()
    return response

async def update_user_points(user_id: str, cost: float):
    """Update user's voucher points after purchase"""
    # Get current points first
    current_points = await get_user_points(user_id)
    new_points = current_points - cost
    
    response = supabase.from_("users").update(
        {"voucher_points": new_points}
    ).eq("uid", user_id).execute()
    return response

async def record_purchase_transaction(user_id: str, product_id: int, quantity: int, amount: float):
    """Record the purchase transaction"""
    response = supabase.from_("voucher_outflow").insert([{
        "recipient_id": user_id,
        "product_id": product_id,
        "quantity": quantity,
        "amount": amount
    }]).execute()
    return response

async def process_purchase(product_id: str, user_id: str, quantity: int = 1):
    try:
        # Get product details
        product = await get_product_details(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get user's points
        user_points = await get_user_points(user_id)
        if user_points is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        total_cost = product["price"] * quantity
        
        # Validate sufficient stock
        if product["qty"] < quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        
        # Validate sufficient voucher points
        if user_points < total_cost:
            raise HTTPException(status_code=400, detail="Insufficient voucher points")
        
        # 1. Update product quantity in products table
        update_product_response = await update_product_quantity(product_id, quantity)
        if not update_product_response:
            raise HTTPException(status_code=500, detail="Failed to update product quantity")
        
        # 2. Create items - one at a time to get their IDs
        item_ids = []
        for _ in range(quantity):
            items_response = supabase.from_("items").insert({
                "product_id": product_id,
                "status": "READY",
                "user_id": user_id,
                "id": str(uuid.uuid4())
            }).execute()
            
            if not items_response or not items_response.data:
                raise HTTPException(status_code=500, detail="Failed to create item")
            
            item_ids.append(items_response.data[0]["id"])

        # 3. Create voucher outflows - one for each item
        for item_id in item_ids:
            outflow_response = supabase.from_("voucher_outflow").insert({
                "recipient_id": user_id,
                "product_id": product_id,
                "item_id": item_id,
                "amount": product["price"]
            }).execute()
            
            if not outflow_response:
                raise HTTPException(status_code=500, detail="Failed to record voucher outflow")

        # 4. Update user's voucher points
        update_points_response = await update_user_points(user_id, total_cost)
        if not update_points_response:
            raise HTTPException(status_code=500, detail="Failed to update user points")
        
        return {
            "message": "Purchase successful",
            "transaction": {
                "product_name": product["name"],
                "quantity": quantity,
                "total_cost": total_cost,
                "item_ids": item_ids
            }
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def user_id_from_email(email):
    user_id = supabase.from_("users").select("uid").eq("email", email).execute()
    return user_id.data[0]["uid"]