# -*- coding: utf-8 -*-
"""O7 — oracol_text_ui.py (R11 „Textul lecțiilor rămâne adevărat”). Etapa 0, 16.11.2026.

Citatele de interfață din textul paginilor din inventar.json (HTML-ul paginii + șirurile din configurația exercițiilor)
și din fișele „Cum fac…?” (cum-fac/_sursa/fise_*.json: întrebare, titlu, pași, rezultat, atenție) se caută în arborele
de REFERINȚĂ (azi) și, când biblioteca aplicatii/ există, ȘI în arborele randat al bibliotecii (mai târziu), în LOCUL SPUS.
Un citat = numele dintr-un <b>/<strong> precedat de un cuvânt-cheie (fila, grupul, butonul, comanda, bifa, lista,
meniul, opțiunea, caseta, fereastra …) sau un lanț legat cu „›” (File › Save As › Browse). Locul spus: fila numită mai
devreme în aceeași propoziție, apoi grupul; un lanț se urmează pas cu pas (filă › grup › comandă; File › pagina
Backstage › comandă; comandă care deschide un dialog › control din dialog).
Numele „RO (EN)” / „EN (RO)” se acceptă dacă perechea ENGLEZĂ există (interfața reală e în engleză; perechea scrisă imediat
după bold — „grupul <b>Temporizare</b> (Timing)” — face parte din nume); un nume doar românesc nu se potrivește. Numele
fără litere sau de o literă (¶, ✕, B, A→Z) sunt pictograme și nu se judecă; codul de șablon (${…}) nu se judecă;
bold-urile fără cuvânt-cheie nu se judecă (pot fi termeni). „Fila” = fila panglicii, a unui dialog (Page Setup ›
Margins), a unei pagini Backstage sau fila unei foi Excel (numele foii e conținut: „colorează fila Octombrie”).
În referință există tot ce are nume în arborele UI Automation, inclusiv elementele derulate din galerii (vizibil=false).
Aplicațiile căutate: ale paginii (inventar) + Windows (orice lecție rulează pe Windows).
Motivele: fila_inexistenta, grup_inexistent, comanda_inexistenta, dialog_inexistent, loc_gresit (există, dar în alt
loc), neacoperit (urmează o listă derulantă/galerie necapturată în referință), fara_referinta (aplicația nu are încă
referință: Windows, File Explorer, Paint), lipsa_in_biblioteca. Toate se numără. Gata (R11) = 0.
Detalii: <iesiri>/oracol_text_ui.json."""
import sys
from collections import Counter
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import structura_lib as L


def index_biblioteca(refs):
    if not L.biblioteca_exista():
        return None
    c = L.randare()
    out = {}
    for app in L.APLICATII:
        uni = {}
        for r in c["pagini"].values():
            for i in r["instante"]:
                if i["aplicatie"] != app or i["mod"] != "conventie":
                    continue
                for k, v in i["suprafete"].items():
                    uni.setdefault(k, v)
        out[app] = L.IndexUI(uni, refs[app] if refs[app].canon else None)
    return out


def masoara():
    refs = L.referinte()
    idx_ref = {a: L.IndexUI(r.canon, r) for a, r in refs.items() if r.canon}
    idx_bib = index_biblioteca(refs)
    probleme, n_cit, pe_motiv = [], 0, Counter()

    def judeca(cit, apps, unde):
        nonlocal n_cit
        n_cit += 1
        cu_ref = [a for a in apps if a in idx_ref]
        motiv = None
        if not cu_ref:
            motiv = "fara_referinta"
        else:
            rez = [idx_ref[a].rezolva(cit) for a in cu_ref]
            if not any(ok for ok, _ in rez):
                motiv = rez[0][1]
            elif idx_bib is not None:
                if not any(idx_bib[a].rezolva(cit)[0] for a in cu_ref if a in idx_bib):
                    motiv = "lipsa_in_biblioteca"
        if motiv:
            pe_motiv[motiv] += 1
            probleme.append({"unde": unde, "sursa": cit["sursa"], "lant": cit["lant"], "fel": cit["fel"],
                             "fila_spusa": cit["ctx_fila"], "grupul_spus": cit["ctx_grup"], "aplicatii": apps,
                             "aplicatii_fara_referinta": [a for a in apps if a not in idx_ref],
                             "motiv": motiv})
    for p in L.pagini_inventar():
        apps = []
        for a in [p.get("aplicatia_principala")] + list(p.get("aplicatii") or []) + ["windows"]:
            if a in L.APLICATII and a not in apps:
                apps.append(a)
        for cit in L.citate_pagina(p["pagina"]):
            judeca(cit, apps, "lectie")
    n_fise = 0
    for f in L.fise_cum_fac():
        if f["aplicatie"] not in L.APLICATII:
            continue
        n_fise += 1
        apps = [f["aplicatie"]] + (["windows"] if f["aplicatie"] != "windows" else [])
        for cit in L.citate_din_text(f["text"], f"{f['fisier']}#{f['fisa']}"):
            judeca(cit, apps, "cum_fac")
    n = len(probleme)
    det = {"definitie": __doc__.split("\n\n", 1)[1], "citate_judecate": n_cit, "fise_cum_fac": n_fise,
           "biblioteca_verificata": idx_bib is not None, "pe_motiv": dict(pe_motiv.most_common()), "probleme": probleme}
    linii = [f"citate judecate: {n_cit} (lecții din inventar + {n_fise} fișe Cum fac); arborele bibliotecii: "
             f"{'verificat' if idx_bib is not None else 'nu există încă (doar referința)'}",
             "pe motiv: " + ", ".join(f"{k}={v}" for k, v in pe_motiv.most_common())]
    return n, det, linii


if __name__ == "__main__":
    L.ruleaza("oracol_text_ui", masoara)
