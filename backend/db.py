from supabase_setup import supabase

async def get_product_name_from_id(product_id):
    product_name = supabase.from_("products").select("name").eq("id", product_id).execute()
    return product_name

async def get_transactions_for_prompt():
    transactions = supabase.from_("voucher_outflow").select("*").execute()
    transactions_dict = transactions.data
    for transaction in transactions_dict:
        product_name = await get_product_name_from_id(transaction["product_id"])
        transaction["product_name"] = product_name
    return transactions_dict


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

