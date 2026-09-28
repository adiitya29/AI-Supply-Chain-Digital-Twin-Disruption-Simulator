import httpx
import os

key = os.environ.get("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
print("Key:", key[:5])
try:
    with httpx.Client(timeout=15) as client:
        response = client.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": "Hello"}],
                "max_tokens": 10,
                "temperature": 0.7,
            },
        )
        print("Status:", response.status_code)
        print("Text:", response.text)
        response.raise_for_status()
        print("OK")
except Exception as e:
    print("Error:", repr(e))
