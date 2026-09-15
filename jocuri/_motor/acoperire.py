"""Acoperirea programei de către jocuri. Scrie jocuri/ACOPERIRE.md și spune ce lipsește.

    python jocuri/_motor/acoperire.py            # raport + rezumat
    python jocuri/_motor/acoperire.py --strict   # exit 1 dacă o unitate CU jocuri are goluri sau declarații false

Surse (acte, nu presupuneri):
  - lecțiile unității: Info_Gimnaziu_2026/data/unitati.json (lecțiile cu tip „evaluare” nu cer acoperire în joc)
  - conținuturile programei: data/informatica_gimnaziu/curriculum.json (OMEN 3393/2017), pe domenii
  - legătura domeniu ↔ unitate: _motor/unitati_domenii.json
Declarațiile vin din fiecare nivel al jocului: {lectii:[4,7], continuturi:['textul exact din programă', ...]}.
Jocurile vechi, fără motor, le declară în <slug>/acoperire.json: {"nivele":[{"t":..., "lectii":[...], "continuturi":[...]}]}.
O declarație spune doar „nivelul acesta predă și verifică asta”. Dacă e adevărată, o confirmă evaluatorul independent, nu unealta.
"""
import difflib
import json
import re
import sys
from pathlib import Path

JOCURI = Path(__file__).resolve().parents[1]
UNITATI = Path(r"C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json")
CURRIC = Path(r"C:\00\AI_0\data\informatica_gimnaziu\curriculum.json")
MAP = Path(__file__).with_name("unitati_domenii.json")
CLS = {"a V-a": "V", "a VI-a": "VI", "a VII-a": "VII", "a VIII-a": "VIII"}
EXTRA = [JOCURI.parent / "data" / "proba_d" / "unitati_xii.json"]  # generat de data/proba_d/build_unitati.py


def find_grade(o, cl):
    if isinstance(o, dict):
        if o.get("clasa") == cl:
            return o
        for v in o.values():
            r = find_grade(v, cl)
            if r:
                return r
    if isinstance(o, list):
        for v in o:
            r = find_grade(v, cl)
            if r:
                return r
    return None


def load_sources():
    un = json.loads(UNITATI.read_text(encoding="utf-8"))["clase"]
    cur = json.loads(CURRIC.read_text(encoding="utf-8"))
    mp = json.loads(MAP.read_text(encoding="utf-8"))
    domains = {}
    for long, short in CLS.items():
        g = find_grade(cur, long)
        domains[short] = {d["domeniu"]: d["continuturi"] for d in g["continuturi"]}
    problems = []
    # clase de liceu cu ancora în subiectele de examen, nu în programa de gimnaziu (ex. XII = proba D):
    # fișierul generat are aceeași formă (clase / domenii / map), deci restul verificărilor merg neschimbate
    for extra in EXTRA:
        if extra.exists():
            ex = json.loads(extra.read_text(encoding="utf-8"))
            un.update(ex["clase"]); domains.update(ex["domenii"]); mp.update(ex["map"])
    for cls, units in mp.items():
        if cls.startswith("_"):
            continue
        for uid, doms in units.items():
            for d in doms:
                if d not in domains[cls]:
                    problems.append(f"unitati_domenii.json: domeniul {d!r} nu există la clasa {cls}")
    return un, domains, mp, problems


def game_configs(exclude=()):
    """(slug, cfg) pentru fiecare joc: pe motor din pagină (Playwright), vechi din acoperire.json."""
    from playwright.sync_api import sync_playwright
    out = []
    dirs = sorted(d for d in JOCURI.iterdir() if d.is_dir() and not d.name.startswith("_") and (d / "index.html").exists() and d.name not in exclude)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        for d in dirs:
            src = (d / "index.html").read_text(encoding="utf-8")
            if "_motor/motor.js" in src:
                pg.goto((d / "index.html").as_uri())
                pg.wait_for_timeout(250)
                cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
                out.append((d.name, cfg))
            else:
                side = d / "acoperire.json"
                m = re.search(r"unitate\s*:\s*'([^']+)'", src)
                if side.exists():
                    cfg = json.loads(side.read_text(encoding="utf-8"))
                    out.append((d.name, cfg))
                else:
                    out.append((d.name, {"_lipsa": True, "unitate": m.group(1) if m else None}))
        b.close()
    return out


def main(strict=False, exclude=()):
    un, domains, mp, problems = load_sources()
    games = game_configs(exclude)
    by_unit = {}
    for slug, cfg in games:
        if cfg.get("recapitulare"):  # recapitularea e generată din celelalte jocuri; nu adaugă acoperire proprie
            continue
        if cfg.get("_lipsa"):
            problems.append(f"{slug}: joc fără motor și fără acoperire.json - acoperirea lui e NEDECLARATĂ")
            continue
        uid = cfg.get("unitate")
        cls = uid.split("-")[0] if uid else None
        unit = next((u for u in un.get(cls, {}).get("unitati", []) if u["id"] == uid), None)
        if not unit:
            problems.append(f"{slug}: unitatea {uid!r} nu există")
            continue
        allowed = {c for dname in mp[cls].get(uid, []) for c in domains[cls][dname]}
        lesson_nrs = {l["nr"] for l in unit["lectii"]}
        rec = by_unit.setdefault(uid, {"unit": unit, "cls": cls, "games": [], "lectii": {}, "cont": {}})
        rec["games"].append(slug)
        for i, lv in enumerate(cfg.get("nivele", []), 1):
            tag = f"{slug} N{i}"
            if not lv.get("lectii"):
                problems.append(f"{tag}: nu declară lectii")
            if not lv.get("continuturi"):
                problems.append(f"{tag}: nu declară continuturi")
            for n in lv.get("lectii", []):
                if n not in lesson_nrs:
                    problems.append(f"{tag}: lecția {n} nu e în unitatea {uid} ({min(lesson_nrs)}–{max(lesson_nrs)})")
                rec["lectii"].setdefault(n, []).append(tag)
            for c in lv.get("continuturi", []):
                if c not in allowed:
                    near = difflib.get_close_matches(c, list(allowed), n=1, cutoff=0.6)
                    problems.append(f"{tag}: conținutul {c!r} nu e în domeniile unității {uid}" + (f" (poate: {near[0]!r})" if near else ""))
                rec["cont"].setdefault(c, []).append(tag)

    lines = ["# Acoperirea programei de către jocuri", "",
             "> GENERAT de `_motor/acoperire.py`, nu edita de mână. Sursele: planificarea 2026-2027 (`unitati.json`) și programa OMEN 3393/2017 (`curriculum.json`).",
             "> ✅ = declarat de cel puțin un nivel · ❌ = neacoperit. Lecțiile de evaluare nu cer acoperire în joc.", ""]
    gaps_total = 0
    for cls in ["V", "VI", "VII", "VIII"]:
        lines += [f"## Clasa a {cls}-a", ""]
        for u in un[cls]["unitati"]:
            if u["id"].endswith(("-E0", "-R")):
                continue
            doms = mp[cls].get(u["id"], [])
            rec = by_unit.get(u["id"])
            if not rec:
                lines += [f"### {u['id']} · {u['titlu']} — **fără joc încă**", ""]
                continue
            lines += [f"### {u['id']} · {u['titlu']} — jocuri: {', '.join(rec['games'])}", "", "| Lecția | Titlu | Acoperită de |", "|---|---|---|"]
            for l in u["lectii"]:
                ev = "evaluare" in l["tip"]
                who = rec["lectii"].get(l["nr"])
                mark = "—" if ev else ("✅ " + ", ".join(who) if who else "❌")
                if not ev and not who:
                    gaps_total += 1
                lines.append(f"| {l['nr']} | {l['titlu']} ({l['tip']}) | {mark} |")
            lines += ["", "| Conținut din programă | Acoperit de |", "|---|---|"]
            for dname in doms:
                for c in domains[cls][dname]:
                    who = rec["cont"].get(c)
                    # un domeniu împărțit pe două unități se socotește pe jocurile ambelor
                    if not who:
                        for other, odoms in mp[cls].items():
                            if other != u["id"] and dname in odoms and other in by_unit:
                                who = by_unit[other]["cont"].get(c)
                    if not who:
                        gaps_total += 1
                    lines.append(f"| {c} *({dname})* | {'✅ ' + ', '.join(who) if who else '❌'} |")
            lines.append("")
    if problems:
        lines += ["## Declarații de verificat", ""] + [f"- {p}" for p in problems] + [""]
    (JOCURI / "ACOPERIRE.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"ACOPERIRE.md scris · goluri în unitățile cu jocuri: {gaps_total} · probleme de declarare: {len(problems)}")
    for p in problems[:40]:
        print("  -", p)
    if strict and (gaps_total or problems):
        sys.exit(1)


if __name__ == "__main__":
    ex = set(sys.argv[sys.argv.index("--exclude") + 1].split(",")) if "--exclude" in sys.argv else set()
    main(strict="--strict" in sys.argv, exclude=ex)
