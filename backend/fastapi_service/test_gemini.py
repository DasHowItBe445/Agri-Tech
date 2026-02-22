import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print(f"Key starts with: {api_key[:5]}..." if api_key else "No Key")

genai.configure(api_key=api_key)

try:
    print("Trying to list models...")
    models = list(genai.list_models())
    print(f"Found {len(models)} models")
    for m in models:
        print(f" - {m.name}")
except Exception as e:
    print(f"Error: {e}")
