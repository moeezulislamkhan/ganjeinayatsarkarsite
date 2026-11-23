"""API tests; skipped automatically when FastAPI is not installed. Run from backend/:  pytest"""
import pytest

pytest.importorskip("fastapi")
from fastapi.testclient import TestClient  # noqa: E402

from app import config, main  # noqa: E402


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(config, "CONTACT_FILE", tmp_path / "messages.jsonl")
    main.limiter = main.RateLimiter(5)
    return TestClient(main.app)


def test_health_lists_data_files(client):
    body = client.get("/api/health").json()
    assert body["status"] == "ok"
    assert body["data_files"]["site.json"] is True


def test_home_page_is_served(client):
    assert client.get("/").status_code == 200


def test_unknown_page_returns_404_page(client):
    response = client.get("/no-such-page.html")
    assert response.status_code == 404
    assert "404" in response.text


def test_contact_ok_validation_honeypot_and_rate_limit(client, tmp_path):
    good = {"name": "Ali", "message": "Assalam o alaikum", "website": ""}
    assert client.post("/api/contact", json=good).json() == {"ok": True}
    assert len((tmp_path / "messages.jsonl").read_text(encoding="utf-8").splitlines()) == 1
    assert client.post("/api/contact", json={"name": "A", "message": "x"}).status_code == 422
    client.post("/api/contact", json={**good, "website": "spam"})          # honeypot: success but not stored
    assert len((tmp_path / "messages.jsonl").read_text(encoding="utf-8").splitlines()) == 1
    for _ in range(4):
        client.post("/api/contact", json=good)
    assert client.post("/api/contact", json=good).status_code == 429
