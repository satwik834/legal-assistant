import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load API key from .env file
load_dotenv()
api_key = os.getenv("api_key")

# Initialize Gemini 2.0 Flash model with API key from .env
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-pro')

def query(text, context=""):
    """
    Takes a legal question and optional context, returns an answer from Gemini.
    """
    prompt = (
        "This is my legal document question. Answer according to legal principles, "
        "laws, and best practices. Explain in simple terms.\n"
    )
    if context:
        prompt += f"Document context:\n{context}\n"
    prompt += f"Question: {text}"
    response = model.generate_content(prompt)
    return response.text.strip()
