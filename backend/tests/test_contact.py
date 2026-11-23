"""Pure-logic tests (no FastAPI needed). Run from backend/:  pytest"""
import json

from app.contact import RateLimiter, is_spam, store_message, validate


def test_valid_message_is_cleaned():
    fields, errors = validate({"name": "  Ali  ", "email": "", "phone": None, "message": "Hello there"})
    assert errors == {}
    assert fields == {"name": "Ali", "email": None, "phone": None, "message": "Hello there"}


def test_invalid_fields_are_reported():
    _, errors = validate({"name": "A", "email": "not-an-email", "message": "hey"})
    assert set(errors) == {"name", "email", "message"}


def test_non_object_body_is_rejected():
    assert validate(["x"])[1] == {"body": "Invalid request."}


def test_honeypot():
    assert is_spam({"website": "http://spam.example"}) is True
    assert is_spam({"website": ""}) is False
    assert is_spam({}) is False


def test_rate_limit_allows_five_per_hour_per_ip():
    limiter = RateLimiter(5)
    assert all(limiter.allow("1.2.3.4", now=1000 + i) for i in range(5))
    assert limiter.allow("1.2.3.4", now=1010) is False
    assert limiter.allow("5.6.7.8", now=1010) is True      # other IP unaffected
    assert limiter.allow("1.2.3.4", now=1000 + 3601) is True  # window passed


def test_store_message_writes_one_json_line(tmp_path):
    target = tmp_path / "sub" / "messages.jsonl"
    store_message(target, {"name": "Ali", "email": None, "phone": None, "message": "سلام"}, "9.9.9.9")
    store_message(target, {"name": "Sara", "email": "s@x.com", "phone": None, "message": "Hi there"}, "9.9.9.9")
    lines = target.read_text(encoding="utf-8").splitlines()
    assert len(lines) == 2
    first = json.loads(lines[0])
    assert first["message"] == "سلام" and first["ip"] == "9.9.9.9" and "received_at" in first
