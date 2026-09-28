import urllib.request
import json
import os

key = os.environ.get("GROQ_API_KEY", "")
print("Using key:", key[:5] + "...")

url = "https://api.groq.com/openai/v1/chat/completions" # oops let's try standard
url = "https://api.groq.com/openai/v1/chat/completions" # wait
url = "https://api.groq.com/openai/v1/chat/completions"
req = urllib.request.Request(
    url,
    headers={
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    },
    data=json.dumps({
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": "Hello!"}],
        "max_tokens": 10
    }).encode("utf-8")
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except Exception as e:
    print("Error:", e)
