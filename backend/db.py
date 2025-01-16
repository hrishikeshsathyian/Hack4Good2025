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
        product_name = product_name_response.data[0]["name"] if product_name_response.data else "Unknown"
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
    response = supabase.from_("items").update({"status": "APPROVED"}).eq("id", voucher_id).execute()
    return response
