# -*- coding: utf-8 -*-
"""O2 — oracol_identic.py (R2 „Aceeași interfață, întreagă, în toate lecțiile”). Etapa 0, 16.11.2026.

Pentru FIECARE pagină din inventar.json: arborele de interfață randat (extras cu arbore_randat.js după
CONVENTIE_ARBORE.md, la fiecare exercițiu simulat al paginii; la primul exercițiu al fiecărui simulator se apasă și
toate filele, File și lansatoarele dialogurilor) comparat cu arborele de REFERINȚĂ ÎNGHEȚAT din referinte/uia_<app>.json
(aplicația reală) — NU cu randarea bibliotecii.
Suprafețele comparate (R2: „filele, grupurile, comenzile, bara de stare, meniurile”): file_panglicii, panglica.<fiecare
filă principală>, acces_rapid, bara_stare, backstage.nav, meniu_contextual.*. Eticheta comparată e TEXTUL VIZIBIL al
elementului (reparația 9; butoanele doar cu pictogramă: data-lh-eticheta / aria-label), comparat ÎNTREG — „Inserare
(Insert)” pe ecran nu e „Insert” (reverificare 6.b; variantele „RO (EN)” rămân doar pentru citatele din lecții). Diferențele:
lipsa / in_plus / ordine / grup_lipsa / grup_in_plus / ordine_grup / eticheta (același idMso, alt nume pe ecran) /
eticheta_declarata (data-lh-eticheta nu e textul de pe ecran) / grup_fara_legenda (grupul panglicii desenat fără numele
vizibil sub el, numele doar în aria-label — reverificare 6.a); o suprafață nedesenată în pagină = toate unitățile ei lipsă + 1. În plus: o
suprafață „mereu la vedere” (file_panglicii, bara_stare, acces_rapid, bara_titlu) care lipsește într-un exercițiu = 1
(R2: nu se simplifică la unele exerciții).
Aplicațiile fără referință încă (Windows, File Explorer, Paint): fiecare suprafață reală din suprafete.json = 1 diferență
pe pagină („fără referință” — nu se poate dovedi „identic”).
Diferențele unei pagini = reuniunea pe exercițiile ei; numărul tipărit = suma pe pagini. Gata (R2) = 0.
Detalii: <iesiri>/oracol_identic.json."""
import sys
from collections import Counter
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import structura_lib as L


def masoara():
    refs = L.referinte()
    supr = L.suprafete()["aplicatii"]
    c = L.randare()
    total, pe_pagina, pe_fel, erori = 0, {}, Counter(), 0
    n_inst = 0
    for p in L.pagini_inventar():
        r = c["pagini"].get(p["pagina"]) or {"instante": [], "erori": ["lipsește din randare"]}
        inst = r["instante"]
        n_inst += len(inst)
        erori += len(r.get("erori") or [])
        apps = sorted({i["aplicatie"] for i in inst}) or [p["aplicatia_principala"]]
        difs = set()
        for app in apps:
            ref = refs[app]
            ii = [i for i in inst if i["aplicatie"] == app]
            if not ref.canon:
                for s in supr.get(app, {}).get("suprafete", []):
                    if s.get("in_aplicatia_reala") is not False:
                        difs.add(f"{app}|{s['id']}|fara_referinta")
                continue
            for k in L.chei_o2(ref):
                randate = [i["suprafete"][k] for i in ii if k in i["suprafete"]]
                if not randate:
                    difs.update(f"{app}|{x}" for x in L.chei_diferente(k, L.compara(k, ref.canon[k], None)))
                for rc in randate:
                    difs.update(f"{app}|{x}" for x in L.chei_diferente(k, L.compara(k, ref.canon[k], rc)))
            for i in ii:
                for k in L.MEREU_LA_VEDERE:
                    if k in ref.canon and L.nr_unitati(ref.canon[k]) > 0 and k not in i["suprafete"]:
                        difs.add(f"{app}|{k}||lipsa_in_exercitiu|{i['id']}#1")
        for d in difs:
            pe_fel[d.split("|")[3] if d.count("|") >= 3 else d.split("|")[-1]] += 1
        pe_pagina[p["pagina"]] = {"diferente": len(difs), "aplicatii": apps, "exercitii_randate": len(inst),
                                  "moduri": sorted({i["mod"] for i in inst}), "erori": (r.get("erori") or [])[:5],
                                  "mostre": sorted(difs)[:40]}
        total += len(difs)
    det = {"definitie": __doc__.split("\n\n", 1)[1], "pe_pagina": pe_pagina, "pe_fel": dict(pe_fel.most_common()),
           "pagini_cu_diferente": sum(1 for v in pe_pagina.values() if v["diferente"]),
           "randare": {"generat": c.get("generat"), "secunde": c.get("secunde"), "instante": n_inst, "erori": erori}}
    linii = [f"pagini: {len(pe_pagina)}, cu diferențe: {det['pagini_cu_diferente']}; exerciții randate: {n_inst}; "
             f"erori de randare: {erori}",
             "pe fel: " + ", ".join(f"{k}={v}" for k, v in pe_fel.most_common(8))]
    return total, det, linii


if __name__ == "__main__":
    L.ruleaza("oracol_identic", masoara)
