"""Ganj-e-Inayat Sarkar web server.

Run locally (from the backend/ folder):   uvicorn app.main:app --reload --port 8000
Site:  http://localhost:8000      Health check:  http://localhost:8000/api/health

In development FastAPI also serves the static site from ../frontend. In production Nginx can serve
those files directly and forward only /api/ to this app (see README).
"""
import json

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from app import config
from app.contact import RateLimiter, is_spam, store_message, validate

app = FastAPI(
    title="Ganj-e-Inayat Sarkar",
    docs_url=None if config.IS_PRODUCTION else "/docs",
    redoc_url=None,
    openapi_url=None if config.IS_PRODUCTION else "/openapi.json",
)
limiter = RateLimiter(config.CONTACT_MAX_PER_HOUR)
MAX_BODY_BYTES = 10_000


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    return response


@app.get("/api/health")
def health() -> dict:
    """Checks that the content files exist and are valid JSON."""
    data_dir = config.FRONTEND_DIR / "data"
    files, ok = {}, True
    for path in sorted(data_dir.glob("*.json")):
        try:
            json.loads(path.read_text(encoding="utf-8"))
            files[path.name] = True
        except (OSError, ValueError):
            files[path.name] = False
            ok = False
    if not files:
        ok = False
    return {"status": "ok" if ok else "degraded", "data_files": files}


@app.post("/api/contact")
async def contact(request: Request):
    raw = await request.body()
    if len(raw) > MAX_BODY_BYTES:
        return JSONResponse({"ok": False, "error": "Request too large."}, status_code=413)
    try:
        payload = json.loads(raw)
    except ValueError:
        return JSONResponse({"ok": False, "error": "Invalid JSON."}, status_code=400)

    ip = request.client.host if request.client else "unknown"
    if is_spam(payload):               # bots: pretend success, store nothing
        return {"ok": True}
    if not limiter.allow(ip):
        return JSONResponse({"ok": False, "error": "Too many messages. Please try later."}, status_code=429)
    fields, errors = validate(payload)
    if errors:
        return JSONResponse({"ok": False, "errors": errors}, status_code=422)
    store_message(config.CONTACT_FILE, fields, ip)
    return {"ok": True}


@app.exception_handler(StarletteHTTPException)
async def not_found(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404 and not request.url.path.startswith("/api/"):
        page = config.FRONTEND_DIR / "404.html"
        if page.is_file():
            return FileResponse(page, status_code=404)
    return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)


if config.FRONTEND_DIR.is_dir():
    app.mount("/", StaticFiles(directory=config.FRONTEND_DIR, html=True), name="frontend")
