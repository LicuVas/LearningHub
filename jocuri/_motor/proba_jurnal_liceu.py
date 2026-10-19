# -*- coding: utf-8 -*-
r"""Proba „Lecțiile mele” la LICEU (10.10.2026). El: „pentru liceu până acum am folosit materia de la clasa a VIII-a. Pentru
Tibucani pe limba engleză lucrăm pe alt sit.”

Verifică, în Chromium, pe jurnal/index.html adevărat (aceleași unelte ca proba_jurnal_tablou.py: rețeaua doar 127.0.0.1 —
regula 24 —, /api/jurnal simulat, sertarul pus în localStorage):
  - liceu (Forestier X E, Brauner XII M, Brauner 9 M, Transporturi X B) -> „Lecțiile mele” = lecțiile clasei a VIII-a;
  - gimnaziu (Brauner 5 AM) -> tot lecțiile clasei a V-a (neschimbat);
  - maiștri / postliceal (Transporturi Anul I F (Maiștri), I A AMG) și Țibucani (engleză) -> fără „Lecțiile mele”, dar cu „Continuă”.
19.10.2026 (el: „jurnalul celor de la clasa a VII-a arată ciudat - nu arată lecțiile făcute și nefăcute ca la clasa a 8-a”;
Focșanianu Vlad, Tupilați VII, înscris la „Țibucani · VII”): o clasă de GIMNAZIU la o școală fără plan (Țibucani, „Altă școală”)
care a lucrat lecții ale clasei ei -> planul clasei; fără lecții lucrate -> tot fără plan; „VII A C” la Forestier (liceu) și
maiștrii care lucrează lecții de a VIII-a -> tot fără plan.
Controlul: --mutanti servește jurnalul cu regula veche (doar gimnaziul), cu una greșită (Țibucani pe plan), fără regula din 19.10,
cu ea fără condiția „a lucrat lecțiile” și cu ea pe liceele fără gimnaziu — proba trebuie să pice.
Ultima linie = UN număr (0 = curat).
Pornire:  python C:\00\Projects\LearningHub\jocuri\_motor\proba_jurnal_liceu.py [--mutanti]
"""
import argparse
import functools
import json
import sys
import threading
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import proba_jurnal_tablou as T  # noqa: E402  (aceeași rețea simulată, același sertar)
from playwright.sync_api import sync_playwright  # noqa: E402

JURNAL = T.LH / "jurnal" / "index.html"
NOU = "    return LICEU_SCOLI[e.scoala]&&n>=9&&n<=12?'viii':null}"
MUTANTI = [
    ("M1 regula veche: liceul fără plan", NOU, "    return null}"),
    ("M2 Țibucani pe plan (engleza nu e pe LearningHub)", "var LICEU_SCOLI={brauner:1,forestier:1,transporturi:1};",
     "var LICEU_SCOLI={brauner:1,forestier:1,transporturi:1,tibucani:1};PLAN_SCOLI.tibucani=1;"),
    ("M3 maiștrii pe planul de a VIII-a", NOU, "    return LICEU_SCOLI[e.scoala]?'viii':null}"),
]
GIMN = "    if(NIV[n]&&!LICEU_SCOLI[e.scoala])return lucreazaPlanul(NIV[n],D,S)?NIV[n]:null;\n"
MUTANTI += [
    ("M4 fără regula din 19.10 (Țibucani VII care lucrează lecțiile clasei rămâne fără listă)", GIMN, ""),
    ("M5 regula din 19.10 fără „a lucrat lecțiile clasei”", GIMN, "    if(NIV[n]&&!LICEU_SCOLI[e.scoala])return NIV[n];\n"),
    ("M6 regula din 19.10 și pe liceele fără gimnaziu", GIMN, "    if(NIV[n])return lucreazaPlanul(NIV[n],D,S)?NIV[n]:null;\n"),
]
CAZURI = [   # (școala, clasa, ce plan așteptăm: nivelul sau None[, cheia unei lecții lucrate, pusă în sertar])
    ("forestier", "X E", "viii"),
    ("brauner", "XII M", "viii"),
    ("brauner", "9 M", "viii"),
    ("transporturi", "X B", "viii"),
    ("brauner", "5 AM", "v"),
    ("transporturi", "Anul I F (Maiștri)", None),
    ("transporturi", "I A AMG", None),
    ("tibucani", "VII", None),
    ("tibucani", "VII", "vii", "lectie_vii_m1_l02"),
    ("alta", "a VIII -a A", "viii", "lectie_viii_m1_l03"),
    ("alta", "Clasa a VI a", "vi", "lectie_vi_m1_l02"),
    ("alta", "Clasa a VI a", None, "lectie_vii_m1_l02"),
    ("forestier", "VII A C", None, "lectie_vii_m1_l02"),
    ("transporturi", "Anul I F (Maiștri)", None, "lectie_viii_m1_l02"),
]


def ruleaza(br, baza, jurnal_txt=None, tacut=False):
    P = T.Proba(br, baza, jurnal_txt=jurnal_txt, tacut=tacut)
    plan = json.loads((T.LH / "lectii" / "plan.json").read_text(encoding="utf-8"))["clase"]
    ctx = P.context(viewport={"width": 360, "height": 780}, device_scale_factor=2, is_mobile=True, has_touch=True)
    for i, caz in enumerate(CAZURI):
        sc, cl, niv = caz[:3]
        lucrat = caz[3] if len(caz) > 3 else None
        cl = cl + (" (a lucrat %s)" % lucrat if lucrat else "")   # doar în mesaje: cazurile cu aceeași clasă se deosebesc
        pg = ctx.new_page()
        try:
            eu = P.eu(id="idliceu%02d" % i + "0" * 15, scoala=sc, clasa=caz[1], nume="Liceu Proba %d" % i)
            ls = {"lh_prezenta": eu, "learninghub_active_profile": "e_lic%d" % i}
            if lucrat:
                ls[lucrat + "@e_lic%d" % i] = {"nume": "", "lv": {"0": {"stars": 2, "v": 1}}}
            P.pune(pg, ls)
            pg.goto(baza + "/jurnal/")
            # desenul după plan: „Continuă” fără „Caut unde ai rămas…” (planul încărcat)
            pg.wait_for_function("()=>{const c=document.getElementById('continua');return c&&!/Caut unde/.test(c.innerText)}", timeout=15000)
            pg.wait_for_timeout(300)
            r = pg.evaluate("()=>({lectii:!!document.getElementById('lectii'),chei:[...document.querySelectorAll('#lectii li[data-cheie]')].map(x=>x.dataset.cheie),"
                            "cont:(document.getElementById('continua-link')||{}).getAttribute?document.getElementById('continua-link').getAttribute('href'):null})")
            if niv:
                # jurnalul arată doar lecțiile PUBLICATE din plan (jurnal/index.html, „lecțiile clasei lui”)
                asteptate = [l["cheie"] for m in plan[niv]["module"] for l in m["lectii"] if l.get("stare") == "publicat" and l.get("cheie") and l.get("cale")]
                bune = r["lectii"] and r["chei"] and all(k.startswith("lectie_%s_" % niv) for k in r["chei"])
                P.verifica(bune and len(r["chei"]) == len(asteptate),
                           "%s %s: „Lecțiile mele” = lecțiile clasei a %s-a (%d din %d)" % (sc, cl, niv.upper(), len(r["chei"]), len(asteptate)), r["chei"][:3])
                P.verifica(bool(r["cont"]) and ("/lectii/%s/" % niv) in (r["cont"] or ""), "%s %s: „Continuă” duce la o lecție a clasei a %s-a" % (sc, cl, niv.upper()), r["cont"])
            else:
                P.verifica(not r["lectii"], "%s %s: fără „Lecțiile mele” (nu e pe planul de pe LearningHub)" % (sc, cl), r["chei"][:3])
                P.verifica(r["cont"] is not None, "%s %s: „Continuă” rămâne" % (sc, cl))
        except Exception as e:
            P.verifica(False, "proba s-a oprit (%s %s): %s" % (sc, cl, str(e).splitlines()[0][:200]))
        finally:
            pg.close()
    ctx.close()
    P.verifica(not P.erori, "0 erori JS", P.erori[:3])
    return P


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mutanti", action="store_true")
    a = ap.parse_args()
    srv = T.Server(("127.0.0.1", 0), functools.partial(T.Tacut, directory=str(T.LH)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    baza = "http://127.0.0.1:%d" % srv.server_address[1]
    externe, scapati = [], 0
    try:
        with sync_playwright() as p:
            br = p.chromium.launch(args=["--mute-audio"])
            print("Proba „Lecțiile mele” la liceu (%s)" % baza)
            P = ruleaza(br, baza)
            externe += P.externe
            prob = P.probleme
            if a.mutanti:
                txt = JURNAL.read_text(encoding="utf-8")
                print("Mutanții (jurnalul stricat, servit în locul celui adevărat)")
                for nume, din, in_ in MUTANTI:
                    if txt.count(din) != 1:
                        print("  RĂU  %s: textul de mutat apare de %d ori" % (nume, txt.count(din)))
                        scapati += 1
                        continue
                    M = ruleaza(br, baza, jurnal_txt=txt.replace(din, in_), tacut=True)
                    externe += M.externe
                    prins = bool([x for x in M.probleme if not x.startswith("proba s-a oprit")])
                    print(("  ok   " if prins else "  RĂU  ") + "%s: %s" % (nume, "prins" if prins else "SCĂPAT"), flush=True)
                    scapati += not prins
            br.close()
    finally:
        srv.shutdown()
        srv.server_close()
    print("cereri externe abandonate în browser: %d" % len(externe))
    if a.mutanti:
        print("Rezultat: %d verificări picate pe jurnalul adevărat; mutanți neprinși: %d din %d" % (len(prob), scapati, len(MUTANTI)))
        print(scapati + len(prob))
    else:
        print("Rezultat: " + ("TOATE OK" if not prob else "; ".join(prob)[:600]))
        print(len(prob))


if __name__ == "__main__":
    main()
