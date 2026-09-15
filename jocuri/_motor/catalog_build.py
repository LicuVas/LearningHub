"""Generează jocuri/catalog.js: traseul anului pe clase (din unitati.json) + jocul fiecărei unități.

    python jocuri/_motor/catalog_build.py

Nu se editează catalog.js de mână. Un joc intră în catalog dacă folderul lui are index.html
cu `unitate:'<id>'` în configurație (sau e în LEGACY, pentru jocurile care nu folosesc încă motorul).
"""
import json
import re
from datetime import date
from pathlib import Path

JOCURI = Path(__file__).resolve().parents[1]
UNITATI = Path(r"C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json")
LEGACY = {"word-vii": {"unitate": "VII-U1", "accent": "#2F55D4"}}  # jocuri de sine stătătoare (fără motor)


def field(src, name):
    m = re.search(name + r"""\s*:\s*(['"])(.*?)\1""", src)
    return m.group(2) if m else None


GRADE_PAGES = {"V": "cls5", "VI": "cls6", "VII": "cls7", "VIII": "cls8"}
# unde intră blocul prima dată (înainte de acest element, unic pe pagină); după aceea se înlocuiește între markeri
GRADE_ANCHORS = ['<div class="curriculum-note">', '<div class="exam-notice"']
START, END = "<!-- JOCURI:START (generat de jocuri/_motor/catalog_build.py) -->", "<!-- JOCURI:END -->"


def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"))


def write_grade_blocks(clase):
    """Pe pagina fiecărei clase din LearningHub (content/tic/clsN/index.html): blocul „Jocuri TIC” cu jocurile clasei,
    în ordinea unităților. Folosește clasele existente ale paginii (domain-label, modules-grid, module-card)."""
    root = JOCURI.parent / "content" / "tic"
    for c in clase:
        page = root / GRADE_PAGES[c["clasa"]] / "index.html"
        if not page.exists():
            print(f"[ATENȚIE] lipsește {page}")
            continue
        src = page.read_text(encoding="utf-8")
        cards = []
        for u in c["unitati"]:
            for g in u["jocuri"]:
                cards.append(f'''            <a href="../../../jocuri/{esc(g["slug"])}/index.html" class="module-card" style="border-left: 3px solid {esc(g["accent"])};">
                <div class="module-icon" style="background: {esc(g["accent"])};">🎮</div>
                <div class="module-content">
                    <div class="module-title">{esc(g["titlu"])}</div>
                    <div class="module-desc">{esc(g["descriere"])}</div>
                    <div class="module-meta">{esc(u["id"])} &bull; {esc(u["titlu"])} &bull; lecțiile {esc(u["lectii"])}</div>
                </div>
                <span class="module-status" style="background: var(--border); color: var(--text-muted);">Joc</span>
            </a>''')
        n = len(cards)
        body = "\n".join(cards) if cards else '            <p style="color: var(--text-muted);">Jocurile acestei clase sunt în lucru.</p>'
        block = f'''{START}
        <div class="domain-label" style="color: var(--accent-green); border-color: var(--accent-green);">
            <span>🎮</span> Jocuri TIC &bull; {n} {"joc" if n == 1 else "jocuri"} pe traseul anului
        </div>
        <p style="color: var(--text-muted); margin-bottom: 1rem; font-size: 0.9rem;">
            Lecții-joc: citești o pagină scurtă, răspunzi la întrebări, iei diploma. <a href="../../../jocuri/index.html#clasa-{c["clasa"]}" style="color: var(--accent-green);">Toate jocurile clasei, în ordinea unităților →</a>
        </p>

        <div class="modules-grid">
{body}
        </div>
        {END}
'''
        if START in src and END in src:
            a, rest = src.split(START, 1)
            _, b = rest.split(END, 1)
            new = a + block.rstrip("\n") + b
        else:
            anchor = next((x for x in GRADE_ANCHORS if src.count(x) == 1), None)
            if not anchor:
                print(f"[ATENȚIE] {page.parent.name}: nu găsesc un loc unic pentru blocul de jocuri")
                continue
            i = src.index(anchor)
            line_start = src.rfind("\n", 0, i) + 1
            new = src[:line_start] + "        " + block + "\n" + src[line_start:]
        if new != src:
            page.write_text(new, encoding="utf-8")
        print(f"{page.parent.name}: bloc jocuri cu {n} {'joc' if n == 1 else 'jocuri'}")


def main():
    un = json.loads(UNITATI.read_text(encoding="utf-8"))["clase"]
    games = {}
    for d in sorted(p for p in JOCURI.iterdir() if p.is_dir() and not p.name.startswith("_")):
        page = d / "index.html"
        if not page.exists():
            continue
        src = page.read_text(encoding="utf-8")
        title = re.search(r"<title>(.*?)</title>", src, re.S)
        desc = re.search(r'<meta name="description" content="(.*?)"', src)
        accent = re.search(r"--accent:\s*(#[0-9A-Fa-f]{6})", src)
        info = {
            "slug": d.name,
            "titlu": field(src, "titlu") or (title.group(1).strip() if title else d.name),
            "descriere": desc.group(1) if desc else "",
            "unitate": field(src, "unitate"),
            "accent": accent.group(1) if accent else "#2F55D4",
            "motor": "_motor/motor.js" in src,
        }
        for k, v in LEGACY.get(d.name, {}).items():
            if not info.get(k):
                info[k] = v
        if not info["unitate"]:
            print(f"[SARIT] {d.name}: nu are unitate în configurație")
            continue
        games.setdefault(info["unitate"], []).append(info)

    clase = []
    for cls in ["V", "VI", "VII", "VIII"]:
        rows = []
        for u in un[cls]["unitati"]:
            if u["id"].endswith(("-E0", "-R")):
                continue  # deschiderea anului și recapitularea nu au joc de unitate
            ls = u["lectii"]
            rows.append({"id": u["id"], "titlu": u["titlu"], "ore": u["ore"],
                         "lectii": f"{ls[0]['nr']}–{ls[-1]['nr']}", "jocuri": games.pop(u["id"], [])})
        clase.append({"clasa": cls, "unitati": rows})
    for orphan, g in games.items():
        print(f"[ATENȚIE] unitatea {orphan} a jocului {[x['slug'] for x in g]} nu există în unitati.json")

    write_grade_blocks(clase)
    out = {"generat": date.today().isoformat(), "sursa": "Info_Gimnaziu_2026/data/unitati.json", "clase": clase}
    js = "/* GENERAT de _motor/catalog_build.py - nu edita de mână */\nwindow.JOCURI_CATALOG = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n"
    (JOCURI / "catalog.js").write_text(js, encoding="utf-8")
    n = sum(len(u["jocuri"]) for c in clase for u in c["unitati"])
    tot = sum(len(c["unitati"]) for c in clase)
    print(f"catalog.js: {n} jocuri pe {tot} unități de învățare")


if __name__ == "__main__":
    main()
