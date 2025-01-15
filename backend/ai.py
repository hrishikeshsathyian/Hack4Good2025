from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import db as db
load_dotenv()   
from ai_interfaces import AiWeeklySummaryOutput


async def generate_weekly_report():
    llm = ChatOpenAI(model="gpt-4o-mini")
    transactions_for_the_week = await db.get_transactions_for_prompt()
    prompt = """ 
    You are a AI meant to help a welfare home. Residents can spend their voucher points to purchase items from
    the welfare home. You are tasked to generate a weekly summary of the items that are in high demand and should be purchased more. Here are the transactions for the week:
    {transactions_for_the_week}

    In each transactions, you should be able to see the amount spent on the item and the name of the item. 

    Your response should STRICTLY be in the format: 
        class AiWeeklySummaryOutput(AiOutput):
            high_demand_items_to_purchase : str = Field(
                description="The list of items that we should purchase more based on the previous purchases "
            )

    """
    prompt = prompt.format(transactions_for_the_week=transactions_for_the_week)
    parsed_response : AiWeeklySummaryOutput = llm.with_structured_output(AiWeeklySummaryOutput).invoke(prompt)
    print(parsed_response)

import asyncio

asyncio.run(generate_weekly_report())
