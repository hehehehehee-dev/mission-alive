"""Keep the current and previous distinct Netlify source ZIPs.

PowerShell's Compress-Archive can emit directory entries with mode 000. Netlify's
Linux build environment may then fail while preparing an uploaded source ZIP.
"""

from __future__ import annotations

from hashlib import sha256
from pathlib import Path
from shutil import copyfile
from stat import S_IFREG
from time import localtime
from uuid import uuid4
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


ROOT = Path(__file__).resolve().parents[1]
CURRENT_NAME = "mission-alive-netlify-update.zip"
PREVIOUS_NAME = "mission-alive-netlify-previous.zip"
SOURCE_FILES = (
    "index.html",
    "package.json",
    "package-lock.json",
    "netlify.toml",
    "vite.config.js",
    "server/voyager-horizons.mjs",
    "server/dsn-now.mjs",
)
SOURCE_DIRS = (
    "src",
    "public",
    "netlify",
    "golden-record-greetings",
)


def add_file(archive: ZipFile, path: Path, name: str) -> None:
    modified = localtime(path.stat().st_mtime)
    info = ZipInfo(name, modified[:6])
    info.create_system = 3  # POSIX permissions, including on Windows hosts.
    info.external_attr = (S_IFREG | 0o644) << 16
    info.compress_type = ZIP_DEFLATED
    archive.writestr(info, path.read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=9)


def write_source(destination: Path) -> None:
    with ZipFile(destination, "w") as archive:
        for name in SOURCE_FILES:
            add_file(archive, ROOT / name, name)
        for directory in SOURCE_DIRS:
            source_directory = ROOT / directory
            if not source_directory.is_dir():
                raise FileNotFoundError(f"Missing source directory: {source_directory}")
            for path in sorted(source_directory.rglob("*")):
                if path.is_file() and not any(part.startswith(".") for part in path.relative_to(ROOT).parts):
                    add_file(archive, path, path.relative_to(ROOT).as_posix())


def manifest(path: Path) -> dict:
    """Compare payloads rather than ZIP timestamps; reading also checks CRCs."""
    with ZipFile(path) as archive:
        return {
            entry.filename: (sha256(archive.read(entry)).digest(), entry.external_attr)
            for entry in archive.infolist()
        }

def checked_path(path: Path) -> Path:
    if path.is_symlink() or path.resolve().parent != ROOT.resolve():
        raise ValueError(f"Refusing to change an archive outside the project root: {path}")
    return path


def prune_archives() -> None:
    keep = {CURRENT_NAME, PREVIOUS_NAME}
    obsolete = [checked_path(path) for path in ROOT.glob("mission-alive-netlify*.zip")
                if path.name not in keep]
    for path in obsolete:
        if path.is_file():
            path.unlink()


def package_source() -> Path:
    destination = checked_path(ROOT / CURRENT_NAME)
    previous = checked_path(ROOT / PREVIOUS_NAME)
    token = uuid4().hex
    staged = checked_path(ROOT / f".netlify-{token}.pending")
    staged_previous = checked_path(ROOT / f".netlify-{token}.previous")
    rollback_previous = checked_path(ROOT / f".netlify-{token}.rollback")
    try:
        write_source(staged)
        payload = manifest(staged)
        current_payload = manifest(destination) if destination.exists() else None
        had_previous = previous.exists()
        if had_previous:
            manifest(previous)
        if payload != current_payload:
            if current_payload is not None:
                copyfile(destination, staged_previous)
                if had_previous:
                    copyfile(previous, rollback_previous)
                staged_previous.replace(previous)
            try:
                staged.replace(destination)
            except OSError:
                # Keep both existing versions if replacing the current ZIP fails.
                if current_payload is not None:
                    if had_previous:
                        rollback_previous.replace(previous)
                    else:
                        previous.unlink()
                raise
        prune_archives()
    finally:
        for path in (staged, staged_previous, rollback_previous):
            if path.exists():
                path.unlink()
    print(f"Current: {destination}")
    if previous.exists():
        print(f"Previous: {previous}")
    return destination


if __name__ == "__main__":
    package_source()
