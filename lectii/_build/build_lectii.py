# -*- coding: utf-8 -*-
"""Construiește secțiunea /lectii/ din lectii/plan.json.

    python C:/00/Projects/LearningHub/lectii/_build/build_lectii.py              # scrie paginile + intrarea din hub
    python C:/00/Projects/LearningHub/lectii/_build/build_lectii.py --verifica   # nu scrie nimic; numără și paginile nerefăcute

Scrie DOAR:
  lectii/index.html            alegi clasa
  lectii/<clasa>/index.html    modulele clasei (v, vi, vii, viii)
  hub/index.html               blocul dintre <!-- LECTII:START ... --> și <!-- LECTII:END --> (intrarea „Lecțiile”)
Nu atinge lectii/<clasa>/m*-l*/ (acolo scriu autorii lecțiilor), jocuri/ sau _motor/.

Stări (plan.json, câmpul „stare”): publicat -> link; in_pregatire -> „în pregătire”, fără link; in_lucru -> „în lucru”.
Doar dirijorul trece o lecție pe „publicat”. O lecție publicată trebuie să aibă index.html pe disc și să treacă
    python jocuri/_motor/test_joc.py --dir lectii/<clasa> <folder>
altfel e NECONCORDANȚĂ. Tot neconcordanțe: plan.json diferit de Calendar_ore (titlu/modul/tip/cale), stare
necunoscută, folder m*-l* care nu e în plan, căi duble; cu --verifica, și paginile generate care nu mai sunt la zi.

Ultimele trei linii tipărite sunt pline; ultima = DOAR numărul de neconcordanțe.
"""
import html
import json
import re
import subprocess
import sys
from pathlib import Path

AICI = Path(__file__).resolve().parent
LH = AICI.parents[1]
LECTII = LH / "lectii"
PLAN = LECTII / "plan.json"
HUB = LH / "hub" / "index.html"
TEST_JOC = LH / "jocuri" / "_motor" / "test_joc.py"

sys.path.insert(0, str(AICI))
import plan_din_calendar  # noqa: E402  (aceeași citire a calendarelor, pentru comparație)

E = html.escape
HUB_START = "<!-- LECTII:START (generat de lectii/_build/build_lectii.py) -->"
HUB_END = "<!-- LECTII:END -->"
HUB_RE = re.compile(r"<!-- LECTII:START[^>]*-->.*?<!-- LECTII:END -->", re.S)
ETICHETA = {"publicat": "gata", "in_pregatire": "în pregătire", "in_lucru": "în lucru"}

CSS = """
:root{--bg:#0F1318;--card:#19202A;--ink:#E5E9EF;--ink2:#9AA4B2;--line:#2E3744;--soft:#1F2733;--acc:#7C9BFF;--ok:#3DD68C;--wip:#E0B84C;--joc:#22C55E}
@media (prefers-color-scheme:light){:root:not([data-theme="dark"]){--bg:#EEF0F2;--card:#FFFFFF;--ink:#17202B;--ink2:#5A6472;--line:#D5DAE1;--soft:#F4F6F8;--acc:#2F55D4;--ok:#137A4B;--wip:#8A6A00;--joc:#15803D}}
:root[data-theme="light"]{--bg:#EEF0F2;--card:#FFFFFF;--ink:#17202B;--ink2:#5A6472;--line:#D5DAE1;--soft:#F4F6F8;--acc:#2F55D4;--ok:#137A4B;--wip:#8A6A00;--joc:#15803D}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Source Sans 3","Segoe UI",system-ui,sans-serif;font-size:18px;line-height:1.5;padding-inline:16px;padding-block:max(28px,env(safe-area-inset-top)) 48px}
main{max-width:820px;margin:0 auto}
a{color:var(--acc)}
.crumbs{display:flex;flex-wrap:wrap;gap:2px 8px;align-items:center;margin:0 0 14px;font-size:.88rem;color:var(--ink2)}
.crumbs a{color:var(--ink2);text-underline-offset:3px}
.crumbs .sep{color:var(--line)}
.crumbs .cur{color:var(--ink);font-weight:600}
h1{font-family:"Archivo","Segoe UI",sans-serif;font-weight:850;font-stretch:115%;font-size:clamp(2.1rem,8vw,3.2rem);line-height:1.05;margin:0;letter-spacing:-.02em}
h2{font-family:"Archivo","Segoe UI",sans-serif;font-weight:800;font-stretch:110%;font-size:1.4rem;margin:0}
.lede{color:var(--ink2);max-width:60ch;margin:12px 0 0}
.nw{white-space:nowrap}
.joc-link{display:flex;align-items:center;gap:14px;margin-top:22px;padding:14px 16px;text-decoration:none;color:inherit;background:var(--card);border:1px solid var(--line);border-left:5px solid var(--joc);border-radius:6px}
.joc-link:hover,.joc-link:focus-visible{border-color:var(--joc);outline:none}
.joc-link .ic{font-size:1.6rem;flex:none;line-height:1}
.joc-link .t{display:block;font-family:"Archivo","Segoe UI",sans-serif;font-weight:800;font-size:1.05rem;line-height:1.2}
.joc-link .d{display:block;font-size:.88rem;color:var(--ink2);margin-top:2px}
.joc-link .go{margin-left:auto;flex:none;color:var(--joc);font-weight:700}
.clase{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:26px}
a.clasa{display:block;text-decoration:none;color:inherit;background:var(--card);border:1px solid var(--line);border-top:5px solid var(--acc);border-radius:8px;padding:16px 18px}
a.clasa:hover,a.clasa:focus-visible{border-color:var(--acc);outline:none}
a.clasa .n{font-family:"Archivo","Segoe UI",sans-serif;font-weight:850;font-size:1.5rem;line-height:1.1}
a.clasa .s{display:block;font-size:.92rem;color:var(--ink2);margin-top:6px}
a.clasa .go{display:block;margin-top:10px;font-weight:700;color:var(--acc)}
section.mod,details.mod{margin-top:28px}
.shead{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;border-bottom:2px solid var(--ink);padding-bottom:6px}
.shead .cnt{font-family:ui-monospace,Consolas,monospace;font-size:.8rem;color:var(--ink2)}
details.mod>summary{cursor:pointer;list-style:none}
details.mod>summary::-webkit-details-marker{display:none}
details.mod>summary .shead{border-bottom-color:var(--line)}
details.mod>summary h2::after{content:" ▸";color:var(--ink2);font-size:1rem}
details.mod[open]>summary h2::after{content:" ▾"}
ol.lectii{list-style:none;margin:0;padding:0}
ol.lectii li{display:grid;grid-template-columns:3.4em 1fr auto;gap:2px 12px;align-items:start;padding:12px 0;border-bottom:1px solid var(--line)}
ol.lectii .nr{font-family:ui-monospace,Consolas,monospace;font-size:.82rem;color:var(--ink2);padding-top:3px}
ol.lectii .t{font-weight:600}
ol.lectii .tip{display:block;font-size:.84rem;color:var(--ink2);font-weight:400}
ol.lectii a.t{color:var(--ink);text-decoration:none}
ol.lectii a.t:hover,ol.lectii a.t:focus-visible{text-decoration:underline;color:var(--acc)}
.st{font-size:.78rem;white-space:nowrap;border-radius:999px;padding:2px 10px;border:1px solid var(--line);color:var(--ink2);background:var(--soft);margin-top:2px}
.st.publicat{color:var(--ok);border-color:var(--ok);background:transparent;font-weight:700}
.st.in_lucru{border-style:dashed}
.nota{font-size:.9rem;color:var(--ink2);background:var(--soft);border:1px dashed var(--line);border-radius:6px;padding:8px 12px;margin:10px 0 0}
footer{margin-top:34px;color:var(--ink2);font-size:.85rem}
@media (max-width:480px){ol.lectii li{grid-template-columns:2.8em 1fr}ol.lectii .st{grid-column:2;justify-self:start}.joc-link{flex-wrap:wrap}.joc-link .go{margin-left:0}}
"""


def pagina(titlu, descriere, corp, adanc):
    """adanc = câte niveluri sub rădăcina sitului (lectii/ = 1, lectii/v/ = 2)."""
    sus = "../" * adanc
    return f"""<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(titlu)}</title>
<meta name="description" content="{E(descriere)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Source+Sans+3:wght@400;600;700&display=swap">
<!-- GENERAT de lectii/_build/build_lectii.py din lectii/plan.json. Nu edita de mână: rulează scriptul. -->
<style>{CSS}</style>
</head>
<body>
<main>
{corp}
</main>
<script src="{sus}assets/js/prezenta.js" id="lh-prezenta" defer></script>
</body>
</html>
"""


def numara(info):
    toate = [le for mo in info["module"] for le in mo["lectii"]]
    return {s: sum(1 for le in toate if le["stare"] == s) for s in ETICHETA}, len(toate)


def rezumat_clasa(info):
    n, _ = numara(info)
    m1 = info["module"][0]
    gata_m1 = sum(1 for le in m1["lectii"] if le["stare"] == "publicat")
    alte = [mo["modul"][1:] for mo in info["module"][1:]]
    rest = f"modulele {alte[0]}–{alte[-1]}: în lucru" if len(alte) > 1 else ("modulul " + alte[0] + ": în lucru" if alte else "")
    if gata_m1 == 0:
        m1_txt = f"Modulul 1: {len(m1['lectii'])} lecții, în pregătire"
    else:
        m1_txt = f"Modulul 1: {gata_m1} din {len(m1['lectii'])} lecții gata"
    return m1_txt, rest, n["publicat"]


def html_index(plan):
    carduri = []
    for slug, info in plan["clase"].items():
        m1_txt, rest, _ = rezumat_clasa(info)
        carduri.append(f"""  <a class="clasa" href="{slug}/index.html">
    <span class="n">Clasa <span class="nw">{E(info['nume'])}</span></span>
    <span class="s">{E(m1_txt)}</span>
    <span class="s">{E(rest.capitalize())}</span>
    <span class="go">Vezi lecțiile →</span>
  </a>""")
    corp = f"""  <nav class="crumbs" aria-label="Unde ești"><a href="../hub/index.html">🏠 LearningHub</a><span class="sep" aria-hidden="true">›</span><span class="cur" aria-current="page">Lecții</span></nav>
  <h1>Lecțiile, refăcute de la capăt</h1>
  <p class="lede">Refacem lecțiile de Informatică și TIC de la capăt, în ordinea în care le facem la clasă. Fiecare lecție are pași scurți, explicați pe rând, și exerciții chiar în pagină. Începem cu primul modul. O lecție apare aici imediat ce e gata. Modulele următoare sunt în lucru.</p>
  <div class="clase">
{chr(10).join(carduri)}
  </div>
  <a class="joc-link" href="../jocuri/index.html">
    <span class="ic" aria-hidden="true">🎮</span>
    <span><span class="t">Jocurile TIC rămân disponibile</span><span class="d">Câte un joc pentru fiecare unitate, la clasele V–VIII.</span></span>
    <span class="go">Jocuri →</span>
  </a>
  <footer>Lecțiile vechi ale claselor V–VIII rămân deocamdată pe sit, cu o bandă „În lucru”, până le înlocuiesc cele noi.</footer>"""
    return pagina("Lecții TIC · gimnaziu",
                  "Lecțiile de Informatică și TIC pentru clasele V–VIII, refăcute de la capăt: pas cu pas, cu exerciții în pagină.",
                  corp, 1)


def html_lectie(le, folder):
    nr = f"L{le['nr']:02d}"
    st = le["stare"]
    if st == "publicat":
        titlu = f'<a class="t" href="{folder}/index.html">{E(le["titlu"])}<span class="tip">{E(le["tip"])}</span></a>'
        # insigna: „verificat parțial” până trece mașina bancul (plan §3); se scrie în plan.json, câmpul „insigna”
        ins = le.get("insigna") or "verificat parțial"
        eticheta = f'<span class="st publicat" title="{E(ins)}">{E(ins)} · deschide →</span>'
    else:
        titlu = f'<span class="t">{E(le["titlu"])}<span class="tip">{E(le["tip"])}</span></span>'
        eticheta = f'<span class="st {st}">{ETICHETA[st]}</span>'
    return f'      <li><span class="nr">{nr}</span>{titlu}{eticheta}</li>'


def html_clasa(slug, info):
    sectiuni = []
    for mo in info["module"]:
        k = mo["modul"][1:]
        n = len(mo["lectii"])
        gata = sum(1 for le in mo["lectii"] if le["stare"] == "publicat")
        toate_in_lucru = all(le["stare"] == "in_lucru" for le in mo["lectii"])
        lista = "\n".join(html_lectie(le, le["cale"].rstrip("/").split("/")[-1]) for le in mo["lectii"])
        if toate_in_lucru:
            sectiuni.append(f"""  <details class="mod" id="m{k}">
    <summary><div class="shead"><h2>Modulul {k}</h2><span class="cnt">{n} lecții · în lucru</span></div></summary>
    <p class="nota">Lecțiile acestui modul sunt în lucru. Le punem aici pe rând, cum sunt gata.</p>
    <ol class="lectii">
{lista}
    </ol>
  </details>""")
        else:
            cnt = f"{gata} din {n} lecții gata" if gata else f"{n} lecții · în pregătire"
            nota = ("" if gata == n else
                    '\n    <p class="nota">Lecțiile fără link sunt în pregătire. Apar aici, cu link, imediat ce sunt gata.</p>')
            sectiuni.append(f"""  <section class="mod" id="m{k}">
    <div class="shead"><h2>Modulul {k}</h2><span class="cnt">{cnt}</span></div>{nota}
    <ol class="lectii">
{lista}
    </ol>
  </section>""")
    corp = f"""  <nav class="crumbs" aria-label="Unde ești"><a href="../../hub/index.html">🏠 LearningHub</a><span class="sep" aria-hidden="true">›</span><a href="../index.html">Lecții</a><span class="sep" aria-hidden="true">›</span><span class="cur" aria-current="page">Clasa {E(info['nume'])}</span></nav>
  <h1>Lecțiile clasei <span class="nw">{E(info['nume'])}</span></h1>
  <p class="lede">Lecțiile de Informatică și TIC, în ordinea în care le facem la clasă, refăcute de la capăt: pași scurți, explicați pe rând, și exerciții chiar în pagină. Începem cu Modulul 1; celelalte module sunt în lucru.</p>
  <a class="joc-link" href="../../jocuri/index.html#clasa-{info['roman']}">
    <span class="ic" aria-hidden="true">🎮</span>
    <span><span class="t">Jocurile TIC ale clasei rămân disponibile</span><span class="d">Câte un joc pentru fiecare unitate a clasei {E(info['nume'])}.</span></span>
    <span class="go">Jocuri →</span>
  </a>
{chr(10).join(sectiuni)}
  <footer>Lecțiile vechi ale clasei rămân deocamdată pe sit, cu o bandă „În lucru”, până le înlocuiesc cele noi.</footer>"""
    return pagina(f"Lecții TIC · clasa {info['nume']}",
                  f"Lecțiile de Informatică și TIC ale clasei {info['nume']}, pe module, refăcute de la capăt.",
                  corp, 2)


def html_hub(plan):
    butoane = []
    for slug, info in plan["clase"].items():
        _, _, gata = rezumat_clasa(info)
        sub = f"{gata} {'lecție gata' if gata == 1 else 'lecții gata'}" if gata else "în pregătire"
        butoane.append(f'<a href="../lectii/{slug}/index.html">Clasa {E(info["nume"])}<small>{sub}</small></a>')
    return f"""{HUB_START}
        <style>
        .lh-lectii{{margin:0 0 2.5rem;padding:1.4rem;border-radius:16px;border:2px solid var(--accent-cyan,#06b6d4);background:linear-gradient(135deg,var(--bg-card,#1a1a2e),rgba(6,182,212,.14))}}
        .lh-lectii-main{{display:flex;align-items:center;gap:1rem;text-decoration:none;color:inherit}}
        .lh-lectii-ic{{font-size:2.6rem;line-height:1;flex:none}}
        .lh-lectii-t{{display:block;font-size:1.45rem;font-weight:800;line-height:1.2}}
        .lh-lectii-d{{display:block;color:var(--text-secondary,#94a3b8);font-size:.98rem;line-height:1.55;margin-top:.3rem}}
        .lh-lectii-go{{margin-left:auto;flex:none;font-weight:700;color:var(--accent-cyan,#06b6d4);white-space:nowrap}}
        .lh-lectii-cls{{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.6rem;margin-top:1.1rem}}
        .lh-lectii-cls a{{display:block;text-align:center;text-decoration:none;color:var(--text-primary,#f1f5f9);font-weight:700;background:var(--bg-secondary,#12121f);border:1px solid rgba(6,182,212,.45);border-radius:10px;padding:.7rem .5rem}}
        .lh-lectii-cls a:hover,.lh-lectii-cls a:focus-visible,.lh-lectii-main:focus-visible{{border-color:var(--accent-cyan,#06b6d4);outline:2px solid var(--accent-cyan,#06b6d4);outline-offset:2px}}
        .lh-lectii-cls small{{display:block;font-weight:500;font-size:.8rem;color:var(--text-muted,#64748b);margin-top:.15rem}}
        @media (max-width:560px){{.lh-lectii-main{{flex-wrap:wrap}}.lh-lectii-go{{margin-left:0}}}}
        </style>
        <section class="lh-lectii" aria-labelledby="lh-lectii-t">
            <a class="lh-lectii-main" href="../lectii/index.html">
                <span class="lh-lectii-ic" aria-hidden="true">📘</span>
                <span><span class="lh-lectii-t" id="lh-lectii-t">Lecțiile (refăcute de la capăt)</span><span class="lh-lectii-d">Lecții noi, pas cu pas, cu exerciții chiar în pagină. Începem cu primul modul la clasele V–VIII și le punem pe sit pe rând, cum sunt gata. Jocurile TIC rămân disponibile, mai jos.</span></span>
                <span class="lh-lectii-go">Intră →</span>
            </a>
            <div class="lh-lectii-cls">{''.join(butoane)}</div>
        </section>
        {HUB_END}"""


def hub_nou(text, bloc):
    nl = "\r\n" if "\r\n" in text else "\n"
    bloc = bloc.replace("\n", nl)
    if HUB_RE.search(text):
        return HUB_RE.sub(lambda _m: bloc, text, count=1)
    i = text.find("</header>")
    if i < 0:
        raise SystemExit("hub/index.html: nu găsesc </header> unde să pun intrarea „Lecțiile”")
    i += len("</header>")
    return text[:i] + nl + nl + "        " + bloc + text[i:]


def poarta(slug, folder):
    r = subprocess.run([sys.executable, str(TEST_JOC), "--dir", str(LECTII / slug), folder],
                       capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=900)
    ok = r.returncode == 0 and "[TRECUT]" in r.stdout
    return ok, (r.stdout.strip().splitlines() or [r.stderr.strip()[:200]])[0]


def main():
    verifica = "--verifica" in sys.argv[1:]
    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    necon, info_ = [], []

    # 1) plan.json față de calendare (titlu, modul, tip, cale) - fără stare
    probleme_cal = []
    din_cal = plan_din_calendar.construieste({}, probleme_cal)
    necon += [f"calendar: {p}" for p in probleme_cal]
    if plan_din_calendar.fara_stare(plan) != plan_din_calendar.fara_stare(din_cal):
        necon.append("plan.json diferă de Calendar_ore (rulează plan_din_calendar.py)")

    # 2) stări, căi, lecții publicate (blocate = „publicat” cu neconcordanță: NU primesc link)
    cai, blocate = set(), set()
    for slug, info in plan["clase"].items():
        for mo in info["module"]:
            for le in mo["lectii"]:
                folder = le["cale"].rstrip("/").split("/")[-1]
                if le["cale"] in cai:
                    necon.append(f"{le['cale']}: cale dublă")
                cai.add(le["cale"])
                if le["stare"] not in ETICHETA:
                    necon.append(f"{le['cale']}: stare necunoscută „{le['stare']}”")
                    continue
                pag = LECTII / slug / folder / "index.html"
                if le["stare"] == "publicat":
                    if not pag.exists():
                        necon.append(f"{le['cale']}: „publicat”, dar nu are index.html")
                        blocate.add(le["cale"])
                        continue
                    ok, linie = poarta(slug, folder)
                    if not ok:
                        necon.append(f"{le['cale']}: „publicat”, dar poarta test_joc.py NU trece: {linie}")
                        blocate.add(le["cale"])
                    else:
                        info_.append(f"{le['cale']}: publicat, poarta: {linie[:80]}")
                elif pag.exists():
                    info_.append(f"{le['cale']}: are index.html pe disc, încă „{le['stare']}” (nepublicată, fără link)")
        # 3) foldere de lecție care nu sunt în plan
        d = LECTII / slug
        if d.exists():
            cunoscute = {le["cale"].rstrip("/").split("/")[-1] for mo in info["module"] for le in mo["lectii"]}
            for sub in sorted(p for p in d.iterdir() if p.is_dir() and not p.name.startswith(("_", "."))):
                if re.fullmatch(r"m\d+-l\d+", sub.name) and sub.name not in cunoscute:
                    necon.append(f"lectii/{slug}/{sub.name}/: folder de lecție care nu e în plan.json")
                elif sub.name not in cunoscute:
                    info_.append(f"lectii/{slug}/{sub.name}/: folder care nu e lecție (ignorat)")

    # 4) paginile - din starea EFECTIVĂ: stare necunoscută -> „în lucru”; „publicat” cu neconcordanță -> „în
    #    pregătire”, fără link (elevul nu ajunge niciodată la o lecție lipsă sau care pică poarta)
    afisat = json.loads(json.dumps(plan))
    for info in afisat["clase"].values():
        for mo in info["module"]:
            for le in mo["lectii"]:
                if le["stare"] not in ETICHETA:
                    le["stare"] = "in_lucru"
                elif le["cale"] in blocate:
                    le["stare"] = "in_pregatire"
    tinte = [(LECTII / "index.html", html_index(afisat))]
    tinte += [(LECTII / slug / "index.html", html_clasa(slug, info)) for slug, info in afisat["clase"].items()]
    scrise, la_zi = 0, 0
    for cale, continut in tinte:
        vechi = cale.read_text(encoding="utf-8") if cale.exists() else None
        if vechi == continut:
            la_zi += 1
            continue
        if verifica:
            necon.append(f"{cale.relative_to(LH).as_posix()}: nu e la zi (rulează build_lectii.py)")
        else:
            cale.parent.mkdir(parents=True, exist_ok=True)
            cale.write_text(continut, encoding="utf-8", newline="\n")
            scrise += 1
    hub_txt = HUB.read_bytes().decode("utf-8")
    hub_rez = hub_nou(hub_txt, html_hub(afisat))
    if hub_rez == hub_txt:
        hub_stare = "la zi"
    elif verifica:
        hub_stare = "NU e la zi"
        necon.append("hub/index.html: intrarea „Lecțiile” nu e la zi (rulează build_lectii.py)")
    else:
        HUB.write_bytes(hub_rez.encode("utf-8"))
        hub_stare = "actualizat"

    for x in info_:
        print("  info", x)
    for x in necon:
        print("  NECONCORDANȚĂ", x)
    tot = {s: 0 for s in ETICHETA}
    n_tot = 0
    for info in plan["clase"].values():
        n, t = numara(info)
        n_tot += t
        for s in tot:
            tot[s] += n[s]
    mod = "verificare (nu s-a scris nimic)" if verifica else f"scrise {scrise}, la zi {la_zi}"
    print(f"pagini: {len(tinte)} ({mod}) · intrarea din hub: {hub_stare}")
    print(f"lecții: {n_tot} · publicat {tot['publicat']} · in_pregatire {tot['in_pregatire']} · in_lucru {tot['in_lucru']} · neconcordanțe:")
    print(len(necon))
    return 1 if necon else 0


if __name__ == "__main__":
    sys.exit(main())
