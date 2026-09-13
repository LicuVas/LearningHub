"""Scoate textul brut din paginile descarcate cu curl (surse/raw/*.html) si cauta frazele.
Scrie surse/<nume>.txt (text complet) si surse/cautari.json (fragmentele gasite, cu context)."""
import html
import json
import re
import sys
from pathlib import Path

S = Path(__file__).resolve().parent
CAUT = {
    "tm_ro": ["Manager de activități", "Ctrl + Shift + Esc", "Performanță", "nuclee", "Nuclee"],
    "tm_en": ["Task Manager", "Ctrl + Shift + Esc", "Performance", "Cores"],
    "mhz": ["instructions per", "clock rate", "megahertz myth", "performance"],
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
        hits[fr] = [t[max(0, m.start() - 160): m.end() + 200] for m in re.finditer(re.escape(fr), t)][:3]
    out[p.stem] = {"caractere": len(t), "gasite": hits}
(S / "cautari.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in out.items():
    print(k, v["caractere"], {f: len(h) for f, h in v["gasite"].items()})
sys.exit(0)
