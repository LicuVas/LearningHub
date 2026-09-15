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

    out = {"generat": date.today().isoformat(), "sursa": "Info_Gimnaziu_2026/data/unitati.json", "clase": clase}
    js = "/* GENERAT de _motor/catalog_build.py - nu edita de mână */\nwindow.JOCURI_CATALOG = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n"
    (JOCURI / "catalog.js").write_text(js, encoding="utf-8")
    n = sum(len(u["jocuri"]) for c in clase for u in c["unitati"])
    tot = sum(len(c["unitati"]) for c in clase)
    print(f"catalog.js: {n} jocuri pe {tot} unități de învățare")


if __name__ == "__main__":
    main()
