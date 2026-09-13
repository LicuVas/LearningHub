"""Scoate textul brut din paginile descarcate cu curl (surse/raw/*.html) si cauta frazele.
Copiat si adaptat din lectia2-hardware/surse/extrage.py (13.09.2026).
Scrie surse/<nume>.txt (text complet) si surse/cautari.json (fragmentele gasite, cu context)."""
import html
import json
import re
import sys
from pathlib import Path

S = Path(__file__).resolve().parent
CAUT = {
    "meniu_en": ["top of the context menu", "Hover over", "Rename", "Show more options"],
    "meniu_ro": ["meniului contextual", "Redenumire", "Afișați mai multe opțiuni", "Mai multe opțiuni", "pictogram"],
    "win10_en": ["October 14, 2025", "no longer"],
    "win10_ro": ["14 octombrie 2025", "nu mai"],
    "macos": ["macOS Tahoe", "macOS Sequoia", "macOS Ventura", "macOS Monterey"],
    "perf_en": ["run slowly", "startup apps", "limited storage", "malware", "virus"],
    "knownfolder": ["FOLDERID_Documents", "%USERPROFILE%\\Documents"],
    "startup_en": ["Startup apps", "Task Manager"],
    "startup_ro": ["Aplicații la pornire", "Manager de activități", "pornire"],
    "ios": ["iOS 26", "iOS 18", "iOS 16"],
    "android": ["Android 16", "Android 17"],
}


def text(p: Path) -> str:
    t = p.read_text(encoding="utf-8", errors="replace")
    t = re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>", " ", t)
    t = re.sub(r"(?s)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


out = {}
for p in sorted((S / "raw").glob("*.html")):
    t = text(p)
    (S / (p.stem + ".txt")).write_text(t, encoding="utf-8")
    hits = {}
    for fr in CAUT.get(p.stem, []):
        hits[fr] = [t[max(0, m.start() - 200): m.end() + 220] for m in re.finditer(re.escape(fr), t)][:3]
    out[p.stem] = {"caractere": len(t), "gasite": hits}
(S / "cautari.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in out.items():
    print(k, v["caractere"], {f: len(h) for f, h in v["gasite"].items()})
sys.exit(0)
