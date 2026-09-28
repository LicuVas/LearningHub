"""Proba modului lecție din motorul jocurilor (27.09.2026).

    python proba_motor_lectie.py jocuri inainte   # 3 jocuri existente, cu motorul de ACUM -> jocuri_inainte.json + capturi
    python proba_motor_lectie.py jocuri dupa      # aceleași 3 jocuri după schimbare  -> jocuri_dupa.json + capturi
    python proba_motor_lectie.py compara          # textele înainte == după? (ultima linie: numărul de diferențe)
    python proba_motor_lectie.py lectii           # TOATE lecțiile lectii/*/m1-l0*/index.html în modul lecție -> lectii.json + capturi

Jocurile: pornești, intri într-un nivel, răspunzi la o întrebare (390px și 1280px), cu Math.random fixat,
ca amestecarea să fie aceeași înainte și după. Se servește LearningHub pe http://127.0.0.1:8766 (căile /jocuri/…
și /lectii/… ca pe site). Erorile din consolă = console.error + pageerror.
Ultima linie tipărită = numărul de probleme (0 = trecut).
"""
import json
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

LH = Path(r"C:\00\Projects\LearningHub")
OUT = Path(__file__).resolve().parent
CAP = OUT / "capturi"
PORT = 8766
BASE = f"http://127.0.0.1:{PORT}"
JOCURI = ["excel-viii", "word-vii", "excel-antrenament-viii"]
LATIMI = {"390": {"width": 390, "height": 844}, "1280": {"width": 1280, "height": 900}}
SEED = """(()=>{let a=20260927;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}})();"""
# Prezenta.eveniment prins, ca proba să vadă ce ar pleca spre panoul profesorului (fără elev înscris nu pleacă nimic)
PRINDE_EV = """window.__ev=[];(function w(){if(window.Prezenta&&window.Prezenta.eveniment&&!window.Prezenta.__prins){
const o=window.Prezenta.eveniment;window.Prezenta.eveniment=function(e){window.__ev.push(e);try{return o.apply(this,arguments)}catch(x){}};
window.Prezenta.__prins=1}else setTimeout(w,50)})();"""

TEXTE = """()=>{const t=s=>{const e=document.querySelector(s);return e?e.innerText.trim():null};
const all=s=>[...document.querySelectorAll(s)].map(e=>e.innerText.trim());
return {crumbs:t('#crumbs'),hud:t('#hud'),eyebrow:t('#app .eyebrow'),tabs:t('.tabs'),toch:t('.toc-h'),
lvl:all('.lvl .n'),butoane:all('#app .btn'),fb:t('#fb'),h2:t('#app h2')}}"""


def server():
    p = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1", "--directory", str(LH)],
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    return p


def pagina(b, lat, erori):
    ctx = b.new_context(viewport=LATIMI[lat])
    ctx.route("**/*", lambda r: r.continue_() if ("127.0.0.1" in r.request.url or "localhost" in r.request.url) else r.abort())   # REGULA 24: nicio cerere în afara serverului local (nici elevi falși în panoul profesorului)
    ctx.add_init_script(SEED)
    pg = ctx.new_page()
    pg.set_default_timeout(8000)
    pg.on("console", lambda m: erori.append("console: " + m.text[:200]) if m.type == "error" and "net::ERR_FAILED" not in m.text else None)
    pg.on("pageerror", lambda e: erori.append("pageerror: " + str(e)[:200]))
    return ctx, pg


def clic(pg, sel):
    pg.evaluate("s=>{const e=document.querySelector(s);if(!e)throw new Error('lipsește '+s);e.click()}", sel)
    pg.wait_for_timeout(150)


def rezolva(pg):
    ok = pg.evaluate("JocMotor.test.rezolva()")
    if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
        clic(pg, "#chk")
    return ok and pg.locator("#fb .fb.ok").count() > 0


def jocuri(eticheta):
    CAP.mkdir(exist_ok=True)
    rez, probleme = {}, 0
    srv = server()
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            for slug in JOCURI:
                for lat in LATIMI:
                    erori = []
                    ctx, pg = pagina(b, lat, erori)
                    pg.goto(f"{BASE}/jocuri/{slug}/index.html", wait_until="networkidle", timeout=30000)
                    pg.wait_for_timeout(400)
                    r = {"cuprins": pg.evaluate(TEXTE)}
                    pg.screenshot(path=str(CAP / f"{eticheta}_{slug}_{lat}_1cuprins.png"), full_page=False)
                    clic(pg, '.lvl[data-l="0"]')
                    r["nivel"] = pg.evaluate(TEXTE)
                    pg.screenshot(path=str(CAP / f"{eticheta}_{slug}_{lat}_2nivel.png"), full_page=False)
                    clic(pg, "#go")
                    r["intrebare"] = pg.evaluate(TEXTE)
                    r["corect_acceptat"] = rezolva(pg)
                    r["dupa_raspuns"] = pg.evaluate(TEXTE)
                    pg.screenshot(path=str(CAP / f"{eticheta}_{slug}_{lat}_3raspuns.png"), full_page=False)
                    r["erori_consola"] = erori
                    if erori or not r["corect_acceptat"]:
                        probleme += 1
                    rez[f"{slug}@{lat}"] = r
                    ctx.close()
            b.close()
    finally:
        srv.terminate()
    (OUT / f"jocuri_{eticheta}.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    for k, r in rez.items():
        print(f"{k}: corect acceptat={r['corect_acceptat']} · erori în consolă={len(r['erori_consola'])} · hud={r['dupa_raspuns']['hud']!r}")
        for e in r["erori_consola"]:
            print("   ", e)
    print(probleme)


def compara():
    a = json.loads((OUT / "jocuri_inainte.json").read_text(encoding="utf-8"))
    d = json.loads((OUT / "jocuri_dupa.json").read_text(encoding="utf-8"))
    dif = 0
    for k in a:
        for etapa in ("cuprins", "nivel", "intrebare", "dupa_raspuns"):
            for camp, v in a[k][etapa].items():
                w = d.get(k, {}).get(etapa, {}).get(camp)
                if v != w:
                    dif += 1
                    print(f"DIFERIT {k} {etapa}.{camp}:\n   înainte: {v!r}\n   după:    {w!r}")
        if a[k]["corect_acceptat"] != d[k]["corect_acceptat"] or len(d[k]["erori_consola"]):
            dif += 1
            print(f"DIFERIT {k}: acceptat {a[k]['corect_acceptat']}->{d[k]['corect_acceptat']}, erori după: {d[k]['erori_consola']}")
    print(f"{len(a)} rulări (3 jocuri x 2 lățimi) comparate pe crumbs/hud/eyebrow/tabs/toc/butoane/feedback/h2")
    print(dif)


INTERZISE = ["niveluri", "Nivelul ", "nivelul final", "jocului", "Toate jocurile", "Jocuri TIC", "Nivel terminat", "Nivel trecut"]


def cauta_interzise(txt):
    return [w for w in INTERZISE if w.lower() in (txt or "").lower()]


def lectii():
    CAP.mkdir(exist_ok=True)
    rez, probleme = {}, []
    srv = server()
    # toate lecțiile care există acum (m1-l04, m1-l05 …), doar cele cu index.html
    lectii_gasite = sorted((d.parent.name, d.name) for d in LH.glob("lectii/*/m1-l0*") if (d / "index.html").exists())
    print("Lecții găsite: " + ", ".join(f"{c}/{l}" for c, l in lectii_gasite))
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            for c, lnume in lectii_gasite:
                for lat in LATIMI:
                    tag = f"{c}/{lnume}@{lat}"
                    P = lambda m: probleme.append(f"{tag}: {m}")
                    erori = []
                    ctx, pg = pagina(b, lat, erori)
                    ctx.add_init_script(PRINDE_EV)
                    url = f"{BASE}/lectii/{c}/{lnume}/index.html"
                    pg.goto(url, wait_until="networkidle", timeout=30000)
                    pg.wait_for_timeout(500)
                    r = {"mod": pg.evaluate("JocMotor.test.config().mod"), "lectie": pg.evaluate("JocMotor.test.lectie()")}
                    if r["mod"] != "lectie":
                        P(f"configurația nu are mod:'lectie' (are {r['mod']!r})")
                    # numele pasului: aplicatieReala.titlu (pe nivel sau în configurație) sau textele implicite ale motorului
                    AR = pg.evaluate("(()=>{const c=JocMotor.test.config(),A=c.nivele[0].aplicatieReala||c.aplicatieReala||{};return {titlu:A.titlu||'',scurt:A.scurt||''}})()")
                    r["aplicatieReala"] = AR
                    nume_real = AR["titlu"] or "Acum în aplicația adevărată"
                    fila_real = AR["scurt"] or "Aplicația"
                    shots = []

                    def cap(n):
                        f = f"lectie_{c}_{lnume}_{lat}_{n}.png"
                        pg.screenshot(path=str(CAP / f), full_page=False)
                        shots.append(f)
                    # CUPRINS: firimituri + butoane -> pagina clasei
                    r["cuprins"] = pg.evaluate(TEXTE)
                    linkuri = pg.evaluate("""()=>[...document.querySelectorAll('#crumbs a, #app a.btn')].map(a=>[a.innerText.trim(),a.href])""")
                    r["linkuri_cuprins"] = linkuri
                    tinte = {t: h for t, h in linkuri}
                    asteptat = {"Lecții": f"{BASE}/lectii/index.html", f"Clasa {pg.evaluate('JocMotor.test.config().clasa')}": f"{BASE}/lectii/{c}/index.html",
                                "Toate lecțiile clasei": f"{BASE}/lectii/{c}/index.html"}
                    for t, h in asteptat.items():
                        if tinte.get(t) != h:
                            P(f"legătura „{t}” duce la {tinte.get(t)!r}, nu la {h}")
                    for t, h in linkuri:  # fiecare legătură din firimituri și de pe butoane există pe disc
                        cale = LH / h.replace(BASE + "/", "").split("#")[0]
                        if h.startswith(BASE) and not cale.exists():
                            P(f"legătura „{t}” duce la un fișier care nu există: {cale}")
                        if "#" in h:
                            P(f"legătura „{t}” are ancoră: {h}")
                    if (r["cuprins"]["crumbs"] or "").split("›")[-1].strip() != f"Lecția {r['lectie']['nr']}":
                        P(f"ultima firimitură pe cuprins: {r['cuprins']['crumbs']!r}")
                    if AR["titlu"] and (AR["titlu"] not in (r["cuprins"]["toch"] or "") or AR["titlu"] not in pg.inner_text(".lvl .drum")):
                        P(f"cuprinsul nu folosește titlul pasului: {r['cuprins']['toch']!r} / {pg.inner_text('.lvl .drum')!r}")
                    cap("1cuprins")
                    # PAȘII -> ATELIER -> APLICAȚIA ADEVĂRATĂ -> VERIFICARE, pe butoanele elevului
                    clic(pg, '.lvl[data-l="0"]')
                    cfg_niv = pg.evaluate("(()=>{const L=JocMotor.test.config().nivele[0];return {pasi:L.pasi.length,atelier:!!L.atelier,qs:L.qs.length}})()")
                    ordine, texte_chrome = [], [r["cuprins"]]
                    cap("2pas1")
                    # „La finalul lecției:” (nu „nivelului”) în blocul obiectivului de la primul pas
                    r["obiectiv"] = pg.evaluate("(()=>{const b=document.querySelector('.obiectiv b');return b?b.innerText.trim():null})()")
                    if r["obiectiv"] is not None and r["obiectiv"] != "La finalul lecției:":
                        P(f"obiectivul începe cu {r['obiectiv']!r}")
                    for _ in range(cfg_niv["pasi"] + 3):
                        st = pg.evaluate("JocMotor.test.stare()")
                        ordine.append(st["phase"] + (str(st["si"]) if st["phase"] == "learn" else ""))
                        texte_chrome.append(pg.evaluate(TEXTE))
                        if st["phase"] == "atelier":
                            cap("3atelier")
                            # bara de sus a atelierului: neutră dacă titlul pasului real există și nu spune „aplicația”
                            r["atelier_hud"] = pg.inner_text("#hud")
                            bara_ast = "Atelier: exersezi aici, în pagină" if AR["titlu"] and "aplicația" not in AR["titlu"].lower() else "Atelier · fă-o ca în aplicația reală"
                            if bara_ast not in r["atelier_hud"]:
                                P(f"bara atelierului: {r['atelier_hud']!r}, trebuia {bara_ast!r}")
                            if not rezolva(pg):  # simulatorul din pagină (wordobj, fotografie, excelx, ppt) merge în modul lecție
                                P("atelierul: răspunsul corect nu a fost acceptat: " + (pg.locator("#fb").inner_text()[:150] if pg.locator("#fb").count() else ""))
                            else:
                                r["atelier_rezolvat"] = True
                            gtxt = pg.locator("#go").inner_text()
                            if gtxt.strip() != nume_real + " →":
                                P(f"butonul din atelier spune {gtxt!r}, trebuia {nume_real + ' →'!r}")
                            clic(pg, "#go")
                            continue
                        if st["phase"] == "real":
                            cap("4aplicatia")
                            r["real"] = pg.evaluate("""()=>({h2:document.querySelector('#app h2').innerText,pasi:document.querySelectorAll('.aplicatie-reala > li').length,
                              prov:(()=>{const c=JocMotor.test.config(),A=c.nivele[0].aplicatieReala||c.aplicatieReala;return ((A&&A.pasi)||c.diploma.provocare).length})()})""")
                            r["real"]["crumbs"] = pg.inner_text("#crumbs").split("›")[-1].strip()
                            r["real"]["hud"] = pg.inner_text("#hud")
                            r["real"]["fila"] = pg.inner_text(".tabs .now")
                            if r["real"]["h2"].strip() != nume_real or r["real"]["pasi"] != r["real"]["prov"] or not r["real"]["pasi"]:
                                P(f"blocul „{nume_real}”: {r['real']}")
                            if r["real"]["crumbs"] != (AR["titlu"] or "În aplicația adevărată") or nume_real not in r["real"]["hud"] or r["real"]["fila"].strip() != fila_real:
                                P(f"pasul real: firimitura {r['real']['crumbs']!r}, bara de sus {r['real']['hud']!r}, fila {r['real']['fila']!r}")
                            clic(pg, "#go")
                            break
                        if st["phase"] == "learn":
                            clic(pg, "#pas-next")
                    st = pg.evaluate("JocMotor.test.stare()")
                    ordine.append(st["phase"])
                    r["ordinea"] = ordine
                    asteapta = [f"learn{i}" for i in range(cfg_niv["pasi"])] + (["atelier"] if cfg_niv["atelier"] else []) + ["real", "q"]
                    if ordine != asteapta:
                        P(f"ordinea pașilor e {ordine}, trebuia {asteapta}")
                    tabs = pg.locator(".tabs").inner_text().split()
                    r["bara_pasilor"] = tabs
                    tabs = pg.locator(".tabs").inner_text().split("\n")
                    r["bara_pasilor"] = tabs
                    ia, ir, iq = (tabs.index("Atelier") if "Atelier" in tabs else -1), (tabs.index(fila_real) if fila_real in tabs else -1), (tabs.index("Î1") if "Î1" in tabs else -1)
                    if not (ir > ia and iq > ir and ir >= 0):
                        P(f"bara pașilor nu are Atelier < {fila_real} < Î1: {tabs}")
                    cap("5intrebare1")
                    for qi in range(cfg_niv["qs"]):
                        texte_chrome.append(pg.evaluate(TEXTE))
                        if not rezolva(pg):
                            P(f"Î{qi+1}: răspunsul corect nu a fost acceptat")
                            break
                        clic(pg, "#next")
                    r["final"] = pg.evaluate(TEXTE)
                    texte_chrome.append(r["final"])
                    cap("6final")
                    stele = pg.locator(".end-stars").get_attribute("aria-label") if pg.locator(".end-stars").count() else None
                    if not (stele or "").startswith("3 "):
                        P(f"finalul dă {stele!r}, nu 3 stele")
                    clic(pg, "#dp")
                    pg.wait_for_timeout(400)
                    r["diploma"] = pg.evaluate("""()=>({p:document.querySelector('.diploma p').innerText,recap:!!document.querySelector('details.real-recap'),
                       nrecap:document.querySelectorAll('details.real-recap li').length,
                       h3:[...document.querySelectorAll('#app h3')].map(h=>h.innerText.trim()),
                       hints:[...document.querySelectorAll('#app p.hint')].map(h=>h.innerText.trim()),
                       linkuri:[...document.querySelectorAll('#crumbs a, #app a.btn')].map(a=>[a.innerText.trim(),a.href])})""")
                    texte_chrome.append(pg.evaluate(TEXTE))
                    cap("7diploma")
                    if not r["diploma"]["p"].startswith(f"a terminat lecția {r['lectie']['nr']},"):
                        P(f"diploma spune {r['diploma']['p'][:80]!r}")
                    if not r["diploma"]["recap"]:
                        P("diploma nu repetă pașii din aplicația adevărată")
                    # 27.09 (dirijor): profesorul poate fi la cealaltă clasă (ora simultană) -> elevul verifică singur
                    hints = " ".join(r["diploma"]["hints"])
                    if "verifică-i singur cu lista de la ultimul pas" not in hints or "arată-i profesorului" in hints.lower():
                        P(f"fraza de pe diplomă: {hints[:200]!r}")
                    if nume_real not in r["diploma"]["h3"]:
                        P(f"pe diplomă titlul pasului nu e {nume_real!r}: {r['diploma']['h3']}")
                    dl = {t: h for t, h in r["diploma"]["linkuri"]}
                    if dl.get("Toate lecțiile clasei") != f"{BASE}/lectii/{c}/index.html":
                        P(f"pe diplomă „Toate lecțiile clasei” -> {dl.get('Toate lecțiile clasei')!r}")
                    # textele motorului nu mai vorbesc de niveluri / joc (firimituri, bara de sus, eyebrow, bara pașilor, butoane, h2, diploma)
                    # titlurile scrise de AUTOR (lecția, nivelul, pașii, rezumatul) nu contează: lecția nr. 1 chiar predă
                    # „cele trei niveluri” de evaluare. Se caută doar în ce scrie motorul.
                    autor = pg.evaluate("(()=>{const c=JocMotor.test.config(),L=c.nivele[0];return [c.titlu,L.t,c.diploma.rezumat||'',(L.atelier&&L.atelier.titlu)||''].concat((L.pasi||[]).map(p=>p.t)).filter(Boolean).sort((a,b)=>b.length-a.length)})()")
                    def motor_doar(s):
                        s = (s or "").lower()   # eyebrow-ul e scris cu majuscule din CSS: se compară fără majuscule
                        for a in autor:
                            s = s.replace(a.lower(), "")
                        return s
                    gasite, unde = set(), set()
                    def verif(eticheta, s):
                        g = cauta_interzise(motor_doar(s))
                        if g:
                            gasite.update(g); unde.add(f"{eticheta}: {motor_doar(s).strip()[:90]!r}")
                    for T in texte_chrome:
                        for camp in ("crumbs", "hud", "eyebrow", "tabs", "toch", "h2"):
                            verif(camp, T.get(camp))
                        for x in (T.get("butoane") or []) + (T.get("lvl") or []):
                            verif("buton", x)
                    verif("diploma", r["diploma"]["p"])
                    if gasite:
                        P(f"texte de joc rămase: {sorted(gasite)} în {sorted(unde)[:3]}")
                    # cu `titlu`, textul implicit „aplicația adevărată” nu mai apare nicăieri în textele motorului (decât dacă e chiar în titlu)
                    if AR["titlu"] and "aplicația adevărată" not in AR["titlu"].lower():
                        rest = set()
                        for T in texte_chrome:
                            for x in [T.get(k) for k in ("crumbs", "hud", "eyebrow", "tabs", "toch", "h2")] + (T.get("butoane") or []) + (T.get("lvl") or []):
                                if x and "aplicația adevărată" in x.lower():
                                    rest.add(x.replace("\n", " ")[:80])
                        rest.update(h for h in r["diploma"]["h3"] if "aplicația adevărată" in h.lower())
                        if rest:
                            P(f"„aplicația adevărată” rămas deși lecția are titlu: {sorted(rest)}")
                    ev = pg.evaluate("window.__ev||[]")
                    r["evenimente_activitate"] = ev
                    tinta = r["lectie"]["cheieActivitate"]
                    if tinta != f"lectie_{c}_{lnume.replace('-', '_')}":
                        P(f"cheia activității e {tinta!r}")
                    if not any(e.get("tip") == "nivel" and e.get("joc") == tinta and str(e.get("titlu", "")).startswith("Lecția ") for e in ev):
                        P(f"evenimentul „nivel” spre panou lipsește sau are alt nume: {ev}")
                    if not any(e.get("tip") == "joc-gata" and e.get("joc") == tinta for e in ev):
                        P("evenimentul „joc-gata” (lecție terminată) lipsește")
                    r["erori_consola"] = erori
                    if erori:
                        P(f"{len(erori)} erori în consolă: {erori[:3]}")
                    r["capturi"] = shots
                    rez[tag] = r
                    ctx.close()
            b.close()
    finally:
        srv.terminate()
    (OUT / "lectii.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    for k, r in rez.items():
        print(f"{k}: ordinea={' > '.join(r.get('ordinea', []))} · bara={' '.join(r.get('bara_pasilor', []))} · erori consolă={len(r.get('erori_consola', []))}")
        print(f"   firimituri: {r['cuprins']['crumbs']!r} · diploma: {r.get('diploma', {}).get('p', '')[:70]!r}")
        print(f"   panou: {r['lectie'].get('cheieActivitate')} / {r['lectie'].get('titluPanou')!r}")
    for x in probleme:
        print("PROBLEMĂ", x)
    print(len(probleme))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "jocuri":
        jocuri(sys.argv[2])
    elif cmd == "compara":
        compara()
    elif cmd == "lectii":
        lectii()
    else:
        print(__doc__)
        sys.exit(2)
