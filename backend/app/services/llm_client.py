import asyncio
import time
import requests
from app.config import settings


class LLMClient:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = settings.GROQ_MODEL
        self.timeout = settings.GROQ_TIMEOUT
        self.max_retries = settings.GROQ_MAX_RETRIES

    async def generate(self, prompt: str) -> str:
        return await asyncio.to_thread(self._call_with_retry, prompt)

    def _call_with_retry(self, prompt: str) -> str:
        for attempt in range(self.max_retries):
            try:
                return self._call_api(prompt)
            except Exception as e:
                if attempt == self.max_retries - 1:
                    raise Exception(f"LLM failed after retries: {str(e)}")
                time.sleep(2 ** attempt)

    def _call_api(self, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a strict C++ execution tracer.\n"
                        "Return ONLY valid JSON.\n"
                        "No markdown. No explanation. No extra text."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            "temperature": 0,
            "max_tokens": 1200,
            "response_format": {"type": "json_object"}
        }

        response = requests.post(
            self.url,
            headers=headers,
            json=payload,
            timeout=self.timeout
        )

        if response.status_code != 200:
            raise Exception(f"Groq API Error: {response.text}")

        data = response.json()

        return data["choices"][0]["message"]["content"]