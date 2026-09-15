"""Recapitularea amestecată (stratul 3 al repetiției): câte un joc pe clasă, GENERAT din jocurile existente ale clasei.

    python jocuri/_motor/recapitulare_build.py [--exclude slug1,slug2]

Nu se editează de mână: întrebările NU se copiază, se iau la fiecare rulare din jocurile de învățare și de antrenament,
așa că o întrebare reparată într-un joc ajunge și în recapitulare la următoarea generare (catalog_build.py o cheamă).

Construcția:
- 3 runde: „Amestec ușor” (prima treime din nivelurile jocurilor de învățare + runda De bază a antrenamentelor),
  „Amestec mediu” (treimea din mijloc + Consolidat), „Amestec greu” (ultima treime, cu nivelul final + Avansat).
- Fiecare întrebare primește lecția nivelului din care vine, iar motorul trage echilibrat pe lecții, deci din toate unitățile.
- Tipurile care au nevoie de un simulator definit doar în pagina jocului lor nu intră (foaia de calcul intră: e în _motor).
- La fiecare explicație se adaugă de unde vine întrebarea, ca elevul să știe unde să se întoarcă.
"""
import json
import sys
from pathlib import Path

JOCURI = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).parent))
from acoperire import game_configs, load_sources  # noqa: E402

TIPURI_OK = {"choice", "tf", "order", "classify", "match", "hunt", "pick", "foaie", "traseu", "interogare"}
# simulatoarele din _motor: tipul -> (obiectul JS, fișierul)
SIMULATOARE = {"foaie": ("JocFoaie", "tip-foaie.js"), "traseu": ("JocTraseu", "tip-traseu.js"), "interogare": ("JocInterogare", "tip-interogare.js")}
CLASE = {"V": ("a V-a", "#8A5A00"), "VI": ("a VI-a", "#0E6E6E"), "VII": ("a VII-a", "#5B3FA8"), "VIII": ("a VIII-a", "#9C2F2F"),
         "XII": ("a XII-a", "#1F5F8B")}  # XII = proba D: jocurile stau pe subcompetente-digitale, build(root=..., clase=["XII"])
GIMNAZIU = ["V", "VI", "VII", "VIII"]
RUNDE = [("Amestec ușor", "De bază"), ("Amestec mediu", "Consolidat"), ("Amestec greu", "Avansat")]
CATE = 8


def completeaza_jocuri_vechi(configs):
    """Jocurile fără motor își declară acoperirea în acoperire.json, dar întrebările stau în `const LEVELS` din pagină
    (variabilă locală): se citesc din sursă și se atașează nivelurilor; titlul vine din <title>."""
    import re
    from playwright.sync_api import sync_playwright
    vechi = [(s, c) for s, c in configs if "titlu" not in c]
    if not vechi:
        return
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(); pg.goto("about:blank")
        for slug, cfg in vechi:
            src = (JOCURI / slug / "index.html").read_text(encoding="utf-8")
            m = re.search(r"const LEVELS=(\[.*?\n\]);", src, re.S)
            t = re.search(r"<title>(.*?)</title>", src, re.S)
            cfg["titlu"] = t.group(1).strip() if t else slug
            if not m:
                continue
            levels = pg.evaluate("s=>JSON.parse(JSON.stringify((0,eval)('('+s+')'),(k,v)=>typeof v==='function'?'[fn]':v))", m.group(1))
            for lv, q_lv in zip(cfg.get("nivele", []), levels):
                qs = q_lv.get("qs", [])
                for q in qs:
                    if q.get("t") == "hunt":
                        q["spatii"] = True  # în jocul vechi spațiile se vedeau mereu ca puncte
                lv["qs"] = qs
                if q_lv.get("boss"):
                    lv["final"] = True
        b.close()


def build(exclude=(), root=None, clase=None):
    un, domains, mp, _ = load_sources()
    out_root = Path(root) if root else JOCURI
    configs = [(s, c) for s, c in game_configs(exclude, root) if not s.startswith(("recapitulare-", "simulare-")) and not c.get("_lipsa")]
    completeaza_jocuri_vechi(configs)
    made = []
    for cls, (clasa, accent) in CLASE.items():
        if cls not in (clase or GIMNAZIU) or cls not in un:
            continue
        units = {u["id"]: u for u in un[cls]["unitati"]}
        order = [u["id"] for u in un[cls]["unitati"]]
        games = sorted([(s, c) for s, c in configs if str(c.get("unitate", "")).split("-")[0] == cls and "nivele" in c],
                       key=lambda sc: (order.index(sc[1]["unitate"]) if sc[1]["unitate"] in order else 99, sc[1].get("mod") == "antrenament", sc[0]))
        if not games:
            continue
        buckets = [{"bazin": [], "lectii": set(), "continuturi": set(), "surse": set()} for _ in RUNDE]
        for slug, cfg in games:
            niv = cfg["nivele"]
            antr = cfg.get("mod") == "antrenament"
            for i, lv in enumerate(niv):
                b = min(i, 2) if antr else min(2, (3 * i) // max(1, len(niv)))
                if not antr and lv.get("final"):
                    b = 2
                qs = lv.get("bazin") if antr else lv.get("qs")
                nume_nivel = (f"runda {lv.get('t')}" if antr else f"nivelul {i + 1} („{lv.get('t')}”)")
                for q in qs or []:
                    if q.get("t") not in TIPURI_OK:
                        continue
                    q2 = json.loads(json.dumps(q))
                    q2["lectii"] = (q.get("lectii") or lv.get("lectii") or [])[:1]
                    q2["grup"] = cfg.get("unitate")  # motorul trage echilibrat pe grupuri: fiecare tragere amestecă unitățile
                    if not q2["lectii"]:
                        continue
                    q2["why"] = (q.get("why") or "") + f'<br><span class="hint">Din „{cfg.get("titlu")}”, {nume_nivel}.</span>'
                    buckets[b]["bazin"].append(q2)
                    buckets[b]["lectii"].update(q2["lectii"])
                buckets[b]["continuturi"].update(lv.get("continuturi", []))
                buckets[b]["surse"].add(cfg.get("titlu"))
        runde = []
        for k, (nume, descr) in enumerate(RUNDE):
            bz = buckets[k]
            if len(bz["bazin"]) < 6:
                continue
            cate = min(CATE, len(bz["bazin"]) // 2)
            runde.append({"t": nume, "descriptor": descr, "cate": cate, "bazin": bz["bazin"],
                          "lectii": sorted(bz["lectii"]), "continuturi": sorted(bz["continuturi"]),
                          "text": "<p>Întrebări amestecate din " + ", ".join(f"„{x}”" for x in sorted(bz["surse"])) + ".</p>"})
        if not runde:
            continue
        runde[-1]["final"] = True
        unit_ids = [u for u in order if any(c.get("unitate") == u for _, c in games)]
        rid = next(u["id"] for u in un[cls]["unitati"] if u["id"].endswith("-R"))
        cfg = {
            "cheie": f"recapitulare_{cls.lower()}",
            "mod": "antrenament", "recapitulare": True,
            "titlu": f"Recapitulare: clasa {clasa}",
            "marca": f"Recapitulare <b>{clasa}</b>",
            "clasa": clasa, "unitate": rid, "unitateTitlu": units[rid]["titlu"],
            "competente": units[rid]["cs"],
            "intro": ("Întrebări amestecate din toate jocurile clasei de până acum: "
                      + ", ".join(units[u]["titlu"] for u in unit_ids)
                      + ". La fiecare reluare primești altele. Sub fiecare explicație scrie din ce joc vine întrebarea, ca să știi unde să revii."),
            "banda": "".join(f'<span class="u">{u.split("-")[1]} · {units[u]["titlu"]}</span>' for u in unit_ids),
            "nivele": runde,
            "diploma": {"titlu": f"Recapitulare trecută, clasa {clasa}", "rezumat": "întrebări amestecate din toate unitățile de până acum",
                        "aplicatie": "jocurile clasei",
                        "provocare": ["Uită-te la întrebările la care ai greșit: sub explicație scrie jocul și nivelul.",
                                      "Reia acel nivel din jocul de învățare, apoi runda potrivită din antrenament.",
                                      "Peste o săptămână, reia recapitularea: vei primi alte întrebări."]},
        }
        if cls == "XII":  # proba D: simularea examenului, pe site-ul de bac
            titlu = "Simulare proba D"
            cfg.update({"cheie": "proba_d_simulare", "titlu": titlu, "marca": "Simulare <b>proba D</b>",
                        "eticheta": "Jocuri proba D", "acasa": {"href": "../../index.html", "text": "Competențe digitale"},
                        "ancoraText": "Întrebări amestecate din jocurile Word, Excel, PowerPoint și Access, construite din subiectele reale 2013–2026",
                        "intro": ("Întrebări amestecate din toate jocurile de proba D: " + ", ".join(units[u]["titlu"] for u in unit_ids)
                                  + ". Fiecare tragere ia din toate aplicațiile, ca la examen. La fiecare reluare primești altele; sub explicație scrie din ce joc vine întrebarea."),
                        "diploma": {"titlu": "Simulare proba D trecută", "rezumat": "cerințe amestecate din toate aplicațiile examenului",
                                    "aplicatie": "Word, Excel, PowerPoint și Access",
                                    "provocare": ["Uită-te la întrebările la care ai greșit: sub explicație scrie jocul și nivelul.",
                                                  "Reia acel nivel, apoi rezolvă în aplicația reală o variantă de pe site care conține aceeași cerință.",
                                                  "Peste o săptămână, reia simularea: vei primi alte întrebări."]}})
            slug = "simulare-proba-d"
        else:
            titlu = f"Recapitulare: clasa {clasa}"
            slug = f"recapitulare-{cls.lower()}"
        folosite = sorted({q.get("t") for r in runde for q in r["bazin"]} & set(SIMULATOARE))
        if folosite:
            cfg["tipuri"] = "__TIPURI__"
        data = json.dumps(cfg, ensure_ascii=False, indent=0).replace("</", "<\\/")
        data = data.replace('"__TIPURI__"', "{" + ",".join(f"{t}:{SIMULATOARE[t][0]}" for t in folosite) + "}")
        scripturi = "\n".join(f'<script src="../_motor/{SIMULATOARE[t][1]}"></script>' for t in folosite)
        n_q = sum(len(r["bazin"]) for r in runde)
        page = f'''<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titlu}</title>
<meta name="description" content="{'Simulare proba D: ' + str(n_q) + ' de întrebări luate din jocurile Word, Excel, PowerPoint și Access' if cls == 'XII' else 'Recapitulare amestecată pentru clasa ' + clasa + ': ' + str(n_q) + ' de întrebări luate din jocurile clasei'}, trase la întâmplare la fiecare reluare.">
<!-- GENERAT de jocuri/_motor/recapitulare_build.py din jocurile clasei. NU se editează de mână. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Public+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Martian+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="../_motor/motor.css">
<style>
:root{{--desk:#F1EFEA;--paper:#FFFFFF;--paper2:#F6F4EF;--line:#DAD5CB;--ink:#1F1B16;--ink2:#655D52;--accent:{accent};--accentInk:#FFFFFF;--sel:#EDE3D3;
  --mark:#FFE36B;--markInk:#1F1B16;--ok:#1E7A45;--okbg:#E3F3E8;--bad:#B83A32;--badbg:#F8E5E2;
  --fd:"DM Serif Display",Georgia,serif;--fb:"Public Sans","Segoe UI",system-ui,sans-serif;--fm:"Martian Mono",Consolas,monospace}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--desk:#15130F;--paper:#1F1C17;--paper2:#28241E;--line:#3A342B;--ink:#EEE8DE;--ink2:#ADA395;--accentInk:#15130F;--sel:#3A3024;
  --markInk:#1F1B16;--ok:#5CC98A;--okbg:#17301F;--bad:#FF8A7E;--badbg:#3A1F1C;--accent:color-mix(in srgb,{accent} 55%,#ffffff)}}}}
:root[data-theme="dark"]{{--desk:#15130F;--paper:#1F1C17;--paper2:#28241E;--line:#3A342B;--ink:#EEE8DE;--ink2:#ADA395;--accentInk:#15130F;--sel:#3A3024;
  --markInk:#1F1B16;--ok:#5CC98A;--okbg:#17301F;--bad:#FF8A7E;--badbg:#3A1F1C;--accent:color-mix(in srgb,{accent} 55%,#ffffff)}}
h1,h2{{font-weight:400}}
.banda{{display:flex;flex-wrap:wrap;gap:4px 6px;padding:6px 10px}}
.banda .u{{font-family:var(--fm);font-size:.66rem;color:var(--ink2);border:1px solid var(--line);border-radius:999px;padding:1px 8px;background:var(--paper);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}}
</style>
</head>
<body>
<script src="../_motor/motor.js"></script>
{scripturi}
<script>
JocMotor.porneste({data});
</script>
</body>
</html>
'''
        d = out_root / slug
        d.mkdir(exist_ok=True)
        (d / "index.html").write_text(page, encoding="utf-8")
        made.append((slug, len(runde), [len(r["bazin"]) for r in runde], [s for s, _ in games]))
        print(f"{slug}: runde {[len(r['bazin']) for r in runde]} întrebări · din {', '.join(s for s, _ in games)}")
    return made


if __name__ == "__main__":
    ex = set(sys.argv[sys.argv.index("--exclude") + 1].split(",")) if "--exclude" in sys.argv else set()
    # a XII-a (proba D):  recapitulare_build.py --root C:\00\AI_0\projects\subcompetente-digitale\jocuri --clase XII
    root = sys.argv[sys.argv.index("--root") + 1] if "--root" in sys.argv else None
    cls = sys.argv[sys.argv.index("--clase") + 1].split(",") if "--clase" in sys.argv else None
    build(ex, root=root, clase=cls)
