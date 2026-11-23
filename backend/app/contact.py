"""Contact-form logic with no web-framework dependency (so it is easy to test).

validate()     -> cleaned fields or error messages
RateLimiter    -> max N accepted messages per IP per hour (in memory)
store_message  -> appends one JSON line to runtime/contact_messages.jsonl
"""
import json
import re
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_write_lock = threading.Lock()


def validate(payload: object) -> tuple[dict, dict]:
    """Return (clean_fields, errors). errors is empty when the message is valid."""
    if not isinstance(payload, dict):
        return {}, {"body": "Invalid request."}

    def text(key: str) -> str:
        value = payload.get(key)
        return value.strip() if isinstance(value, str) else ""

    name, email, phone, message = text("name"), text("email"), text("phone"), text("message")
    errors: dict[str, str] = {}
    if not 2 <= len(name) <= 100:
        errors["name"] = "Name must be 2 to 100 characters."
    if email and (len(email) > 254 or not EMAIL_RE.match(email)):
        errors["email"] = "Invalid email address."
    if phone and len(phone) > 40:
        errors["phone"] = "Phone number is too long."
    if not 5 <= len(message) <= 2000:
        errors["message"] = "Message must be 5 to 2000 characters."
    return {"name": name, "email": email or None, "phone": phone or None, "message": message}, errors


def is_spam(payload: object) -> bool:
    """Honeypot: real visitors never fill the hidden 'website' field."""
    return isinstance(payload, dict) and bool(str(payload.get("website") or "").strip())


class RateLimiter:
    def __init__(self, max_per_hour: int, window_seconds: int = 3600):
        self.max = max_per_hour
        self.window = window_seconds
        self._hits: dict[str, list[float]] = {}
        self._lock = threading.Lock()

    def allow(self, key: str, now: float | None = None) -> bool:
        now = time.time() if now is None else now
        with self._lock:
            recent = [t for t in self._hits.get(key, []) if now - t < self.window]
            if len(recent) >= self.max:
                self._hits[key] = recent
                return False
            recent.append(now)
            self._hits[key] = recent
            return True


def store_message(path: Path, fields: dict, ip: str | None) -> None:
    """Append one message as a JSON line. Message bodies are never written to logs."""
    record = {"received_at": datetime.now(timezone.utc).isoformat(), "ip": ip, **fields}
    path.parent.mkdir(parents=True, exist_ok=True)
    line = json.dumps(record, ensure_ascii=False)
    with _write_lock, path.open("a", encoding="utf-8", newline="\n") as handle:
        handle.write(line + "\n")
