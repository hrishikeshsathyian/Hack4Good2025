from supabase_setup import supabase

async def get_product_name_from_id(product_id):
    product_name = supabase.from_("products").select("name").eq("id", product_id).execute()
    return product_name

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

async def get_current_inventory():
    # Get current inventory
    response = supabase.from_("products").select("*").execute()
    return response.data

async def add_item(name, description, quantity, price, category):
    # Add item to inventory
    response = supabase.from_("products").insert([{"name": name,"description": description, "qty": quantity, "price": price, "category": category }]).execute()
    return response