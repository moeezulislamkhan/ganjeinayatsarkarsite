"""Settings from environment variables (and an optional backend/.env file)."""
import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
ROOT_DIR = BACKEND_DIR.parent


def _load_dotenv(path: Path) -> None:
    """Tiny .env reader (KEY=value lines) so no extra package is needed."""
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_dotenv(BACKEND_DIR / ".env")

APP_ENV = os.getenv("APP_ENV", "development")
IS_PRODUCTION = APP_ENV.lower() == "production"
FRONTEND_DIR = Path(os.getenv("FRONTEND_DIR", ROOT_DIR / "frontend")).resolve()
RUNTIME_DIR = Path(os.getenv("RUNTIME_DIR", BACKEND_DIR / "runtime")).resolve()
CONTACT_FILE = RUNTIME_DIR / "contact_messages.jsonl"
CONTACT_MAX_PER_HOUR = int(os.getenv("CONTACT_MAX_PER_HOUR", "5"))
