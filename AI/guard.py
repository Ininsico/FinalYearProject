import os
import threading
import time
from datetime import datetime, timezone


class GuardError(Exception):
    def __init__(self, message, status=429):
        super().__init__(message)
        self.status = status


class Guard:
    """Intercepts every LLM call: spaces them out, caps them per day, and
    tracks token spend, so the AI can never run away past its limits."""

    def __init__(self):
        per_minute = int(os.environ.get('AI_MAX_REQUESTS_PER_MIN', '20'))
        self.min_interval = 60.0 / max(1, per_minute)
        self.daily_request_budget = int(os.environ.get('AI_DAILY_REQUEST_BUDGET', '500'))
        self.daily_token_budget = int(os.environ.get('AI_DAILY_TOKEN_BUDGET', '600000'))
        self.lock = threading.Lock()
        self.day = self._today()
        self.requests = 0
        self.tokens = 0
        self.last_call = 0.0

    @staticmethod
    def _today():
        return datetime.now(timezone.utc).strftime('%Y-%m-%d')

    def _roll_day(self):
        today = self._today()
        if today != self.day:
            self.day = today
            self.requests = 0
            self.tokens = 0

    def acquire(self):
        """Reserve one LLM call, waiting for the pacing interval if needed.
        Raises GuardError when a daily budget is exhausted."""
        with self.lock:
            self._roll_day()
            if self.requests >= self.daily_request_budget:
                raise GuardError(
                    f'Daily AI request budget reached ({self.daily_request_budget}). Try again tomorrow.'
                )
            if self.tokens >= self.daily_token_budget:
                raise GuardError(
                    f'Daily AI token budget reached ({self.daily_token_budget}). Try again tomorrow.'
                )
            wait = self.last_call + self.min_interval - time.monotonic()
            if wait > 0:
                time.sleep(wait)
            self.last_call = time.monotonic()
            self.requests += 1
            return self.requests

    def record(self, tokens):
        with self.lock:
            self.tokens += max(0, int(tokens or 0))

    def snapshot(self):
        with self.lock:
            return {
                'day': self.day,
                'requests': self.requests,
                'requestBudget': self.daily_request_budget,
                'tokens': self.tokens,
                'tokenBudget': self.daily_token_budget,
                'minIntervalSeconds': round(self.min_interval, 2),
            }
