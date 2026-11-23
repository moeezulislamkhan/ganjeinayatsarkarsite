"""Convert any image to an optimized WebP (or PNG for logos) for the website.

Examples (run from the project root; needs Pillow:  pip install pillow):
    python tools/optimize_image.py my-photo.jpg frontend/assets/gallery/darbar-28.webp --max 1600
    python tools/optimize_image.py my-photo.jpg frontend/assets/gallery/thumbs/darbar-28.webp --max 520
    python tools/optimize_image.py logo.png frontend/assets/brand/logo.png --max 500
Rules of thumb: gallery 1600 px long edge, thumbs 520, portraits 1000, hero 1920 wide; quality 82.
"""
import argparse
from pathlib import Path

from PIL import Image, ImageOps


def optimize(src: Path, dest: Path, max_edge: int, quality: int) -> None:
    image = ImageOps.exif_transpose(Image.open(src))
    image.thumbnail((max_edge, max_edge), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.suffix.lower() == ".png":
        image.save(dest, optimize=True)
    else:
        image.convert("RGB").save(dest, quality=quality, method=6)
    print(f"{dest}  {image.size[0]}x{image.size[1]}  {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("src", type=Path)
    parser.add_argument("dest", type=Path)
    parser.add_argument("--max", type=int, default=1600, help="longest edge in pixels")
    parser.add_argument("--quality", type=int, default=82)
    args = parser.parse_args()
    optimize(args.src, args.dest, args.max, args.quality)
