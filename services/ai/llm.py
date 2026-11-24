import os
import time

import requests

from guard import GuardError


class LLMError(Exception):
    def __init__(self, message, status=502):
        super().__init__(message)
        self.status = status


class LLM:
    """Groq chat client with hard limits: prompt truncation, token caps,
    pacing, retries with backoff, and model fallback."""

    def __init__(self, guard):
        self.guard = guard
        self.api_key = os.environ.get('GROQ_API_KEY', '').strip()
        self.url = os.environ.get(
            'GROQ_API_URL', 'https://api.groq.com/openai/v1/chat/completions'
        )
        self.primary_model = os.environ.get('GROQ_MODEL', 'openai/gpt-oss-120b')
        self.fallback_model = os.environ.get('GROQ_FALLBACK_MODEL', 'openai/gpt-oss-20b')
        self.max_tokens = int(os.environ.get('AI_MAX_TOKENS_PER_CALL', '1200'))
        self.max_prompt_chars = int(os.environ.get('AI_MAX_PROMPT_CHARS', '12000'))

    def chat(self, system, user, temperature=0.4, max_tokens=None):
        if not self.api_key:
            raise LLMError('GROQ_API_KEY is not configured for the AI service', 503)

        tokens = min(int(max_tokens or self.max_tokens), self.max_tokens)
        user = str(user)[: self.max_prompt_chars]

        try:
            self.guard.acquire()
        except GuardError:
            raise

        models = [self.primary_model]
        if self.fallback_model and self.fallback_model != self.primary_model:
            models.append(self.fallback_model)

        last_error = 'AI unavailable'
        for model in models:
            for attempt in range(3):
                try:
                    res = requests.post(
                        self.url,
                        headers={
                            'Authorization': f'Bearer {self.api_key}',
                            'Content-Type': 'application/json',
                        },
                        json={
                            'model': model,
                            'temperature': temperature,
                            'max_tokens': tokens,
                            'messages': [
                                {'role': 'system', 'content': system},
                                {'role': 'user', 'content': user},
                            ],
                        },
                        timeout=60,
                    )
                except requests.RequestException as exc:
                    raise LLMError(f'Groq request failed: {exc}', 502)

                if res.status_code == 200:
                    data = res.json()
                    usage = data.get('usage') or {}
                    self.guard.record(usage.get('total_tokens', 0))
                    content = (data.get('choices') or [{}])[0].get('message', {}).get('content', '')
                    return (content or '').strip()

                if res.status_code == 404:
                    last_error = f'unknown model {model}'
                    break  # try the fallback model

                if res.status_code == 429:
                    last_error = 'rate limited'
                    time.sleep(min(2 ** attempt, 8))
                    continue

                detail = res.text[:200] if res.text else ''
                print(f'[llm] {model} failed {res.status_code}: {detail}', flush=True)
                raise LLMError(f'AI request failed ({res.status_code})', 502)

        raise LLMError(f'AI unavailable ({last_error})', 502)

    def chat_json(self, system, user, temperature=0.2, max_tokens=None):
        raw = self.chat(system, user, temperature=temperature, max_tokens=max_tokens)
        cleaned = raw.strip()
        if cleaned.startswith('```'):
            cleaned = cleaned.split('```')[1]
            if cleaned.startswith('json'):
                cleaned = cleaned[4:]
        cleaned = cleaned.strip()
        start = cleaned.find('{')
        end = cleaned.rfind('}')
        body = cleaned[start : end + 1] if start >= 0 and end > start else cleaned
        try:
            import json

            return json.loads(body)
        except ValueError:
            raise LLMError('AI returned an unreadable response — try again', 502)
