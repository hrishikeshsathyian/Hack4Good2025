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


