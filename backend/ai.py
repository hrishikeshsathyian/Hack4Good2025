from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from prompts import GENERATE_SUMMARY_PROMPT
import db as db
load_dotenv()   
from ai_interfaces import AiWeeklySummaryOutput


async def generate_weekly_report(start_date, end_date, query):
    llm = ChatOpenAI(model="gpt-4o-mini")
    transactions_for_the_week = await db.get_transactions_for_prompt(start_date=start_date, end_date=end_date)
    current_inventory = await db.get_current_inventory()
    prompt = GENERATE_SUMMARY_PROMPT
    prompt = prompt.format(transaction_history=transactions_for_the_week, current_inventory=current_inventory, query=query) 
    print("Works so far")
    parsed_response : AiWeeklySummaryOutput = llm.with_structured_output(AiWeeklySummaryOutput).invoke(prompt)
    return parsed_response.answer
