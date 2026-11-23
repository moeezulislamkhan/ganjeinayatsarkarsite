"""Check the website content files before you publish.   Run from the project root:

    python tools/validate_data.py

It reports ERRORS (the site will break or show a wrong label) and WARNINGS (something is empty or only
in one language). Exit code 1 when there is at least one error. Needs only Python 3.
"""
import json
import re
import sys
from pathlib import Path

FRONT = Path(__file__).resolve().parents[1] / "frontend"
DATA = FRONT / "data"
ICONS = {"book-open", "prayer-beads", "users", "file-text", "heart-hand"}
GALLERY_CATEGORIES = {"darbar", "events"}        # labels exist in js/i18n.js as gallery.<category>
PROGRAM_TYPES = {"weekly", "monthly", "annual"}
PUB_TYPES = {"book", "article"}
errors: list[str] = []
warnings: list[str] = []


def err(msg): errors.append(msg)
def warn(msg): warnings.append(msg)


def load(name):
    path = DATA / f"{name}.json"
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        err(f"{name}.json: file is missing")
    except ValueError as exc:
        err(f"{name}.json: not valid JSON ({exc})")
    return None


def bilingual(where, value, required=False):
    """value must be {"ur": "...", "en": "..."}."""
    if not isinstance(value, dict) or not ({"ur", "en"} <= set(value)):
        err(f'{where}: must look like {{"ur": "...", "en": "..."}}')
        return
    ur, en = bool(str(value["ur"]).strip()), bool(str(value["en"]).strip())
    if required and not (ur or en):
        err(f"{where}: both languages are empty")
    elif ur != en and (ur or en):
        warn(f"{where}: only {'Urdu' if ur else 'English'} is filled (the other language will show a notice)")


def paragraphs(where, value):
    if not isinstance(value, dict) or not isinstance(value.get("ur", []), list) or not isinstance(value.get("en", []), list):
        err(f'{where}: must look like {{"ur": ["paragraph", ...], "en": ["paragraph", ...]}}')
        return
    if bool(value.get("ur")) != bool(value.get("en")):
        warn(f"{where}: only {'Urdu' if value.get('ur') else 'English'} paragraphs are filled")


def file_exists(where, rel):
    if not rel:
        return
    if re.match(r"^https?://", rel):
        return
    if not (FRONT / rel).is_file():
        err(f"{where}: image/file not found -> {rel}")


def ids_unique(name, items):
    seen = set()
    for item in items:
        i = item.get("id")
        if i in seen:
            err(f"{name}.json: duplicate id {i}")
        seen.add(i)


def items_of(name):
    data = load(name)
    if data is None:
        return []
    items = data.get("items")
    if not isinstance(items, list):
        err(f'{name}.json: needs an "items": [ ... ] list')
        return []
    ids_unique(name, items)
    return items


def check_date(where, value):
    if value and not re.match(r"^\d{4}-\d{2}-\d{2}$", str(value)):
        err(f'{where}: date must look like 2024-01-31, found "{value}"')


def main():
    site = load("site")
    if site:
        for key in ("name", "tagline", "description", "footerAbout", "address", "hours"):
            bilingual(f"site.json {key}", site.get(key), required=True)
        for key in ("whatsapp", "whatsappNumber", "email"):
            if not site.get(key):
                err(f"site.json: {key} is missing")
        if site.get("whatsappNumber") and not re.match(r"^\d{8,15}$", str(site["whatsappNumber"])):
            err("site.json: whatsappNumber must be digits only with the country code, e.g. 923334328031")
        if not site.get("map", {}).get("url"):
            warn("site.json: map.url is missing")
    for n, h in enumerate(items_of("hero"), 1):
        file_exists(f"hero.json item {n}", h.get("image")); bilingual(f"hero.json item {n} title", h.get("title"), True)
        if h.get("ctaHref") and not (FRONT / h["ctaHref"].split("#")[0]).is_file() and not h["ctaHref"].startswith("http"):
            err(f"hero.json item {n}: ctaHref page not found -> {h['ctaHref']}")
    for n, k in enumerate(items_of("khidmaat"), 1):
        bilingual(f"khidmaat.json item {n} title", k.get("title"), True)
        if k.get("icon") not in ICONS:
            err(f"khidmaat.json item {n}: icon must be one of {sorted(ICONS)}")
    for n, p in enumerate(items_of("programs"), 1):
        if p.get("type") not in PROGRAM_TYPES:
            err(f"programs.json item {n}: type must be one of {sorted(PROGRAM_TYPES)}")
        bilingual(f"programs.json item {n} title", p.get("title"), True); file_exists(f"programs.json item {n}", p.get("image"))
    for n, f in enumerate(items_of("farameen"), 1):
        bilingual(f"farameen.json item {n} text", f.get("text"), True); file_exists(f"farameen.json item {n}", f.get("image"))
    for n, g in enumerate(items_of("gallery"), 1):
        file_exists(f"gallery.json item {n} image", g.get("image")); file_exists(f"gallery.json item {n} thumb", g.get("thumb"))
        if g.get("category") not in GALLERY_CATEGORIES:
            err(f"gallery.json item {n}: category '{g.get('category')}' has no label. Use one of {sorted(GALLERY_CATEGORIES)} or add gallery.<name> to js/i18n.js")
    for n, v in enumerate(items_of("videos"), 1):
        if not re.match(r"^[A-Za-z0-9_-]{11}$", str(v.get("youtubeId", ""))):
            err(f"videos.json item {n}: youtubeId must be the 11-character code after v= in the YouTube link")
    for n, p in enumerate(items_of("publications"), 1):
        if p.get("type") not in PUB_TYPES:
            err(f"publications.json item {n}: type must be 'book' or 'article'")
        bilingual(f"publications.json item {n} title", p.get("title"), True)
        file_exists(f"publications.json item {n} cover", p.get("cover")); file_exists(f"publications.json item {n} file", p.get("file"))
        check_date(f"publications.json item {n} published", p.get("published"))
    for n, x in enumerate(items_of("news"), 1):
        bilingual(f"news.json item {n} title", x.get("title"), True); file_exists(f"news.json item {n}", x.get("image"))
        check_date(f"news.json item {n} published", x.get("published"))
        if not x.get("published"):
            err(f"news.json item {n}: published date is missing")
    about = load("about")
    if about:
        for who in ("institution", "hazoor", "father", "sahibzada"):
            block = about.get(who)
            if not block:
                err(f"about.json: '{who}' is missing"); continue
            file_exists(f"about.json {who} image", block.get("image")); bilingual(f"about.json {who} name/title", block.get("name") or block.get("title"), True)
            if block.get("paragraphs"):
                paragraphs(f"about.json {who} paragraphs", block["paragraphs"])
            for ph in block.get("photos", []):
                file_exists(f"about.json {who} photos", ph)
        for sec in about.get("hazoor", {}).get("sections", []):
            bilingual(f"about.json hazoor section {sec.get('id')} title", sec.get("title"), True); paragraphs(f"about.json hazoor section {sec.get('id')}", sec.get("paragraphs"))
    silsila = load("silsila")
    if silsila:
        paragraphs("silsila.json article", silsila.get("article")); file_exists("silsila.json shajra image", silsila.get("shajra", {}).get("image"))
    for f in sorted(DATA.glob("*.json")):
        if f.stem not in {"site", "hero", "khidmaat", "programs", "farameen", "gallery", "videos", "publications", "news", "about", "silsila"}:
            warn(f"{f.name}: this file is not used by the website")
    print(f"Checked {len(list(DATA.glob('*.json')))} data files in {DATA}\n")
    for w in warnings: print("WARNING:", w)
    for e in errors: print("ERROR:  ", e)
    print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
