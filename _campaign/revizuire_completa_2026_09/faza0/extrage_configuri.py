# Faza 0: extrage configurile jocurilor-candidat (ca prereq_jocuri.py: Playwright, file://, JocMotor.test.config())
# si scrie, pentru fiecare nivel care declara lectia 4, un fisier text lizibil (ce vede elevul, in ordine).
# Nu modifica situl. Scrie doar in faza0/_extras/.
import json, re, sys, html
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8")

JOCURI = Path(r"C:/00/Projects/LearningHub/jocuri")
OUT = Path(r"C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/faza0/_extras")
OUT.mkdir(parents=True, exist_ok=True)
SLUGS = ["calculator-v", "calculator-antrenament-v", "prezentari-vi", "prezentari-antrenament-vi",
         "word-obiecte-vii", "word-vii", "word-antrenament-vii",
         "excel-pas-cu-pas-viii", "excel-viii", "excel-antrenament-viii"]
# nivelurile declarate in ACOPERIRE.md pentru lectia 4 (1-based) + vecinii ca sa vedem ordinea
LECTIA = {"calculator-v": 4, "prezentari-vi": 4, "word-obiecte-vii": 4, "word-vii": 4,
          "excel-pas-cu-pas-viii": 4, "excel-viii": 4}

def plain(s):
    if s is None:
        return ""
    s = str(s)
    def _img(m):
        tag = m.group(0)
        src = re.search(r"src=[\"']([^\"']*)[\"']", tag)
        alt = re.search(r"alt=\"([^\"]*)\"", tag) or re.search(r"alt='([^']*)'", tag)
        return f"[IMAGINE src={src.group(1) if src else '?'} alt={alt.group(1) if alt else 'LIPSA'}]"
    s = re.sub(r"<img\b[^>]*>", _img, s)
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = re.sub(r"</(p|li|tr|h\d|pre|div|figcaption)>", "\n", s)
    s = re.sub(r"<li[^>]*>", "- ", s)
    s = re.sub(r"<(td|th)[^>]*>", " | ", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n", s)
    return s.strip()

def q_text(q, ind="   "):
    lines = []
    for k in ("tip", "t", "type"):
        if k in q and isinstance(q[k], str) and len(q[k]) < 20:
            lines.append(f"{ind}[tip: {q[k]}]")
            break
    for k, v in q.items():
        if k in ("tip", "type"):
            continue
        if isinstance(v, str):
            if v == "[fn]":
                continue
            lines.append(f"{ind}{k}: {plain(v)}")
        elif isinstance(v, (list, dict)):
            lines.append(f"{ind}{k}: {plain(json.dumps(v, ensure_ascii=False))}")
        else:
            lines.append(f"{ind}{k}: {v}")
    return "\n".join(lines)

def nivel_text(slug, i, n):
    L = [f"#### {slug} N{i+1}: {plain(n.get('t'))}",
         f"lectii={n.get('lectii')} final={n.get('final', False)}",
         f"continuturi={json.dumps(n.get('continuturi'), ensure_ascii=False)}"]
    if n.get("obiectiv"):
        L.append("OBIECTIV: " + plain(n["obiectiv"]))
    if n.get("ilustratie"):
        L.append("ILUSTRATIE: " + plain(n["ilustratie"]))
    if n.get("text"):
        L.append("--- TEXT (pagina de citit) ---\n" + plain(n["text"]))
    for j, p in enumerate(n.get("pasi") or []):
        L.append(f"--- P{j+1}: {plain(p.get('t'))} ---")
        for k in ("text", "exemplu", "altfel"):
            if p.get(k):
                L.append(f"[{k}] " + plain(p[k]))
        if p.get("incearca"):
            L.append("[incearca]\n" + q_text(p["incearca"]))
        for m, x in enumerate(p.get("inca") or []):
            L.append(f"[inca {m+1}]\n" + q_text(x))
    if n.get("atelier"):
        L.append("--- ATELIER ---\n" + q_text(n["atelier"]))
    for m, q in enumerate(n.get("qs") or []):
        L.append(f"--- Q{m+1} ---\n" + q_text(q))
    return "\n".join(L)

def main():
    rez = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        for s in SLUGS:
            pg.goto((JOCURI / s / "index.html").as_uri(), timeout=30000)
            pg.wait_for_timeout(400)
            cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
            (OUT / f"{s}.config.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=1), encoding="utf-8")
            niv = cfg.get("nivele") or []
            rez[s] = [{"N": i + 1, "t": n.get("t"), "lectii": n.get("lectii"), "pasi": len(n.get("pasi") or []),
                       "qs": len(n.get("qs") or []), "are_text": bool(n.get("text"))} for i, n in enumerate(niv)]
            # antrenament: bazin
            if cfg.get("bazin") is not None:
                bz = cfg["bazin"]
                rez[s + "#bazin"] = {"tip": type(bz).__name__, "len": len(bz) if hasattr(bz, "__len__") else None}
            # textul nivelurilor care declara lectia 4
            parts = [nivel_text(s, i, n) for i, n in enumerate(niv) if 4 in (n.get("lectii") or [])]
            if parts:
                (OUT / f"{s}.lectia4.txt").write_text("\n\n".join(parts), encoding="utf-8")
            (OUT / f"{s}.toate.txt").write_text("\n\n".join(nivel_text(s, i, n) for i, n in enumerate(niv)), encoding="utf-8")
        b.close()
    (OUT / "_niveluri.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    for s, v in rez.items():
        if isinstance(v, list):
            print(s, [(x["N"], x["lectii"], x["pasi"], x["qs"]) for x in v])
        else:
            print(s, v)

main()
