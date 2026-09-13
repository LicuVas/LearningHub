"""Copiat din lectia4-ergonomie/surse/extrage.py, adaptat la lectia5-reguli (13.09.2026).
Scoate textul brut din paginile descarcate cu curl (surse/raw/*.html) si cauta frazele.
Scrie surse/<nume>.txt (text complet, cu URL in capul fisierului) si surse/cautari.json."""
import html
import json
import re
from pathlib import Path

S = Path(__file__).resolve().parent
URL = {
    "word_recover_en": "https://support.microsoft.com/en-us/word/recover-your-word-files-and-documents",
    "word_recover_ro": "https://support.microsoft.com/ro-ro/word/recover-your-word-files-and-documents",
    "crash_en": "https://support.microsoft.com/en-us/topic/help-protect-your-files-in-case-of-a-crash-551c29b1-6a4b-4415-a3ff-a80415b92f99",
    "crash_ro": "https://support.microsoft.com/ro-ro/topic/help-protect-your-files-in-case-of-a-crash-551c29b1-6a4b-4415-a3ff-a80415b92f99",
    "snip_en": "https://support.microsoft.com/en-us/windows/use-snipping-tool-to-capture-screenshots-00246869-1843-655f-f220-97299b865f6b",
    "snip_ro": "https://support.microsoft.com/ro-ro/windows/use-snipping-tool-to-capture-screenshots-00246869-1843-655f-f220-97299b865f6b",
    "prtsc_en": "https://support.microsoft.com/en-us/windows/keyboard-shortcut-for-print-screen-601210c0-b3a9-7b58-bc40-bae4dcf5f108",
    "prtsc_ro": "https://support.microsoft.com/ro-ro/windows/keyboard-shortcut-for-print-screen-601210c0-b3a9-7b58-bc40-bae4dcf5f108",
    "shutdown_en": "https://support.microsoft.com/en-us/windows/shut-down-sleep-or-hibernate-your-pc-2941d165-7d0a-a5e8-c5ad-8c972e8e6eff",
    "shutdown_ro": "https://support.microsoft.com/ro-ro/windows/shut-down-sleep-or-hibernate-your-pc-2941d165-7d0a-a5e8-c5ad-8c972e8e6eff",
    "nist_63b": "https://pages.nist.gov/800-63-4/sp800-63b.html",
    "legea319": "https://legislatie.just.ro/Public/DetaliiDocument/136504",
    "statut_elev": "https://legislatie.just.ro/Public/DetaliiDocument/181088",
}
CAUT = {
    "word_recover_en": ["AutoRecover", "Document Recovery", "10 minutes", "power"],
    "word_recover_ro": ["AutoRecuperare", "Recuperare document", "10 minute", "curent"],
    "crash_en": ["AutoRecover", "every", "minutes", "power failure"],
    "crash_ro": ["AutoRecuperare", "minute", "pană de curent", "curent"],
    "snip_en": ["Print Screen", "PrtSc", "clipboard"],
    "snip_ro": ["Print Screen", "PrtSc", "clipboard", "Instrument"],
    "prtsc_en": ["Print Screen", "Snipping", "clipboard", "PrtScn"],
    "prtsc_ro": ["Print Screen", "Instrument de decupare", "clipboard", "PrtScn"],
    "shutdown_en": ["Shut down", "Power", "Start"],
    "shutdown_ro": ["Închidere", "Alimentare", "Pornire", "Oprire"],
    "nist_63b": ["composition rules", "minimum password length", "at least 15", "SHALL NOT impose other composition", "8 characters"],
    "legea319": ["elevi", "pericol", "să comunice imediat", "instruire", "art. 3"],
    "statut_elev": ["deterior", "interzis", "bunurile", "laborator"],
}


def text(p: Path) -> str:
    t = p.read_text(encoding="utf-8", errors="replace")
    t = re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>", " ", t)
    t = re.sub(r"(?s)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


out = {}
for nume, url in URL.items():
    p = S / "raw" / f"{nume}.html"
    if not p.is_file():
        out[nume] = "LIPSA"
        continue
    t = text(p)
    (S / f"{nume}.txt").write_text(f"URL: {url} | descarcat cu curl 13.09.2026\n\n{t}", encoding="utf-8")
    g = {}
    for c in CAUT.get(nume, []):
        g[c] = [t[max(0, m.start() - 220): m.end() + 260] for m in re.finditer(re.escape(c), t, re.I)][:3]
    out[nume] = {"caractere": len(t), "gasit": g}
(S / "cautari.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in out.items():
    if isinstance(v, dict):
        print(k, v["caractere"], {c: len(x) for c, x in v["gasit"].items()})
    else:
        print(k, v)
