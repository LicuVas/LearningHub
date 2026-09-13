"""Copiat din lectia2-hardware/surse/extrage.py, adaptat la lectia4-ergonomie (13.09.2026).
Scoate textul brut din paginile descarcate cu curl (surse/raw/*.html) si cauta frazele.
Scrie surse/<nume>.txt (text complet) si surse/cautari.json (fragmentele gasite, cu context)."""
import html
import json
import re
import sys
from pathlib import Path

S = Path(__file__).resolve().parent
URL = {
    "aao_computer": "https://www.aao.org/eye-health/tips-prevention/computer-usage",
    "ccohs_monitor_positioning": "https://www.ccohs.ca/oshanswers/ergonomics/office/monitor_positioning.html",
    "ccohs_eye_discomfort": "https://www.ccohs.ca/oshanswers/ergonomics/office/eye_discomfort.html",
    "ccohs_chair_adjusting": "https://www.ccohs.ca/oshanswers/ergonomics/office/chair_adjusting.html",
    "ccohs_stretching": "https://www.ccohs.ca/oshanswers/ergonomics/office/stretching.html",
    "ccohs_risk_factors": "https://www.ccohs.ca/oshanswers/ergonomics/office/risk_factors.html",
    "ccohs_idx": "https://www.ccohs.ca/oshanswers/ergonomics/office/",
    "osha_positions_arh": "https://web.archive.org/web/2026id_/https://www.osha.gov/etools/computer-workstations/positions (osha.gov direct = 403 la curl)",
    "stretchly": "https://hovancik.net/stretchly/",
    "hg1028_portalssm": "https://www.portalssm.ro/hg-nr-10282006-privind-cerintele-minime-de-ssm-referitoare-la-utilizarea-echipamentelor-cu-ecran-de-vizualizare-13139.htm (reproducere, nu Monitorul Oficial)",
}
CAUT = {
    "aao_computer": ["20-20-20", "20 feet", "20 seconds", "25 inches", "arm's length", "blink", "permanent"],
    "ccohs_monitor_positioning": ["arm", "eye level", "cm", "distance", "top of the"],
    "ccohs_eye_discomfort": ["20", "rest", "break", "blink"],
    "ccohs_chair_adjusting": ["90", "footrest", "knees", "thighs", "backrest", "angle"],
    "ccohs_stretching": ["break", "minutes", "stretch"],
    "ccohs_risk_factors": ["break", "static", "posture"],
    "osha_positions_arh": ["reclin", "Upright", "90", "120", "135", "neutral"],
    "stretchly": ["Windows", "free", "open", "break"],
    "hg1028_portalssm": ["Art. 8", "pauze"],
}


def text(p: Path) -> str:
    t = p.read_text(encoding="utf-8", errors="replace")
    t = re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>", " ", t)
    t = re.sub(r"(?s)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


out = {}
for p in sorted((S / "raw").glob("*.html")):
    t = text(p)
    (S / (p.stem + ".txt")).write_text("URL: " + URL.get(p.stem, "?") + " | descarcat cu curl 13.09.2026\n\n" + t, encoding="utf-8")
    hits = {}
    for fr in CAUT.get(p.stem, []):
        hits[fr] = [t[max(0, m.start() - 160): m.end() + 220] for m in re.finditer(re.escape(fr), t)][:3]
    out[p.stem] = {"url": URL.get(p.stem, "?"), "caractere": len(t), "gasite": hits}
(S / "cautari.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in out.items():
    print(k, v["caractere"], {f: len(h) for f, h in v["gasite"].items()})
sys.exit(0)
