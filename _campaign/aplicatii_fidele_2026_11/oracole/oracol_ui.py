# -*- coding: utf-8 -*-
"""O3 — oracol_ui.py (R4a „Interfața fidelă”). Etapa 0, 16.11.2026; reparațiile 9 și f, 17.11.

Diferențele de interfață față de referința REALĂ înghețată (referinte/uia_<app>.json: dump UI Automation, fereastra
1366×768 la 100% DPI, fără Developer/add-in-uri), pe SUPRAFAȚĂ, la fereastra paginii de 1366×768:
  etichete (`eticheta`: același idMso, alt nume PE ECRAN; `eticheta_declarata`: data-lh-eticheta nu e textul de pe
  ecran — se compară textul VIZIBIL ÎNTREG, fără variantele „RO (EN)”, CONVENTIE_ARBORE.md §5, reverificare 6.b), ordine
  (`ordine`, `ordine_grup`), grupare (`grupare`: comanda e în alt grup), tip de control (`tip`: familia ControlType),
  prezența comenzilor (`lipsa`, `in_plus`, `grup_lipsa`, `grup_in_plus`), legenda grupului (`grup_fara_legenda`: grupul
  desenat fără numele vizibil sub el — reverificare 6.a) și poziția relativă (`pozitie`, `pozitie_grup`: deplasarea față de colțul grupului /
  suprafeței diferă cu > 8 px pe x sau pe y — toleranța TOL_PX din structura_lib.py).
Fiecare suprafață a referinței (toate filele, filele contextuale, File/Backstage, bara de titlu, Acces rapid, bara de
stare, meniurile de clic dreapta, dialogurile din lecții, panourile) se compară cu TOATE randările ei din toate paginile
(reuniunea diferențelor); o suprafață pe care nicio pagină n-o desenează = toate unitățile ei lipsă + 1.
Numărul = PUNCTE, pe COMANDĂ (reparația f: o comandă deja greșită care devine lipsă nu se mai anulează −1 +1): o comandă
a referinței are punctele = câte feluri de diferență are (`ordine`, `tip`, `eticheta`, `pozitie`, `eticheta_declarata`,
cel mult 5), dar o comandă mutată în alt grup (`grupare`) are cel puțin 6, iar una LIPSĂ cel puțin 7 — deci
„desenată greșit → în alt grup → lipsă” crește mereu. Restul (`in_plus`, felurile de grup și de suprafață) = 1 punct.
Windows și File Explorer (runda `acoperire` pe instrumente, 20.11.2026): referinte/uia_windows.json și uia_explorer.json
(formatul referinte/dump_shell_uia.py) se citesc prin structura_lib.referinte_shell(): fiecare captură legată de
suprafete.json devine o suprafață de referință, cu cheia de randare din structura_lib.SHELL_SUPRAFETE (fereastra Explorer
tăiată pe AutomationId în bara_comenzi, panou_navigare, zona_continut …), comparată la fel ca cele Office; nodurile ascunse
pentru date personale sunt comenzi prezente, fără text.
În plus, din suprafete.json: fiecare suprafață FĂRĂ referință (Paint întreg; riglele, panourile etc. necapturate;
dialogurile Explorer, desktopul, calendarul … — motivul fiecăreia în fara_referinta_motiv) = 1, și fiecare suprafață care
NU există în aplicația reală (ex. tastele pentru telefon) = 1 (abatere de aprobat). Gata (R4a) = 0.
Detalii: <iesiri>/oracol_ui.json."""
import sys
from collections import Counter
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import structura_lib as L

# felurile de diferență ale UNEI comenzi a referinței (cheia lor poartă eticheta din referință)
FELURI_COMANDA_DESENATA = {"ordine", "tip", "eticheta", "pozitie", "eticheta_declarata"}
P_GRUPARE = len(FELURI_COMANDA_DESENATA) + 1        # 6: mai mult decât orice comandă desenată, oricât de greșită
P_LIPSA = P_GRUPARE + 1                             # 7: mai mult decât una mutată în alt grup


def puncte(chei):
    """chei = reuniunea cheilor de diferență ale unei suprafețe („suprafață|grup|fel|etichetă#n”) → (puncte, pe comandă).
    Pe comandă: max(P_LIPSA dacă e lipsă undeva, P_GRUPARE dacă e în alt grup undeva, numărul felurilor ei de diferență)."""
    pe_cmd, altele = {}, 0
    for x in chei:
        p = x.split("|")
        fel = p[2] if len(p) >= 4 else ""
        if fel in FELURI_COMANDA_DESENATA or fel in ("lipsa", "grupare"):
            pe_cmd.setdefault((p[0], p[1], "|".join(p[3:])), set()).add(fel)
        else:
            altele += 1
    tot = altele
    for fels in pe_cmd.values():
        tot += max(P_LIPSA if "lipsa" in fels else 0, P_GRUPARE if "grupare" in fels else 0,
                   len(fels & FELURI_COMANDA_DESENATA))
    return tot, len(pe_cmd)


def masoara():
    refs = L.referinte()
    shell = L.referinte_shell()      # Windows / File Explorer: doar aici (O2, O7, O8 și randarea folosesc referinte())
    supr = L.suprafete()["aplicatii"]
    c = L.randare()
    toate = [i for r in c["pagini"].values() for i in r["instante"]]
    total, pe_fel, pe_suprafata, n_chei = 0, Counter(), {}, 0
    for app in L.OFFICE + list(L.SHELL):
        ref = shell[app] if app in L.SHELL else refs[app]
        if not ref.canon:
            continue
        ii = [i for i in toate if i["aplicatie"] == app]
        for k, refc in ref.canon.items():
            randate = [i["suprafete"][k] for i in ii if k in i["suprafete"]]
            if randate:
                d = set()
                for rc in randate:
                    d.update(L.chei_diferente(k, L.compara(k, refc, rc, detaliat=True)))
            else:
                d = set(L.chei_diferente(k, L.compara(k, refc, None)))
            for x in d:
                pe_fel[x.split("|")[2]] += 1
            pct, ncmd = puncte(d)
            pe_suprafata[f"{app}.{k}"] = {"puncte": pct, "diferente": len(d), "comenzi_cu_diferente": ncmd,
                                          "randari": len(randate), "unitati_referinta": L.nr_unitati(refc),
                                          "mostre": sorted(d)[:25]}
            total += pct
            n_chei += len(d)
    fara, nereale, motiv = [], [], {}
    for app in L.APLICATII:
        ref = shell[app] if app in L.SHELL else refs[app]
        for s in supr.get(app, {}).get("suprafete", []):
            if s.get("in_aplicatia_reala") is False:
                nereale.append(s["id"])
            elif not L.referinta_suprafata(app, s["id"], ref):
                fara.append(s["id"])
                if app in L.SHELL:
                    motiv[s["id"]] = ref.motiv_fara(s["id"])
    total += len(fara) + len(nereale)
    pe_fel["fara_referinta"] += len(fara)
    pe_fel["nu_exista_in_aplicatia_reala"] += len(nereale)
    harta = {s["id"]: L.referinta_suprafata(a, s["id"], shell[a] if a in L.SHELL else refs[a])
             for a in L.APLICATII for s in supr.get(a, {}).get("suprafete", [])}
    ref_shell = {a: {"fisier": "referinte/" + L.SHELL_FISIER[a],
                     "suprafete": {k: {"captura": r.surse[k][0], "regula": r.surse[k][1], "unitati": L.nr_unitati(r.canon[k]),
                                       "ascunse": sum(1 for g in r.canon[k]["grupuri"] for u in g["u"] if u.get("ascuns"))}
                                   for k in r.canon},
                     "taieturi_negasite": r.taieturi_negasite, "capturi_necomparate": r.necomparate}
                 for a, r in shell.items()}
    det = {"definitie": __doc__.split("\n\n", 1)[1], "toleranta_px": L.TOL_PX, "fereastra": L.VIEWPORT,
           "puncte": {"lipsa": P_LIPSA, "grupare": P_GRUPARE, "comanda_desenata": "1 pe fel, cel mult "
                      f"{len(FELURI_COMANDA_DESENATA)}", "restul": 1},
           "chei_de_diferenta": n_chei + len(fara) + len(nereale),
           "pe_suprafata": pe_suprafata, "pe_fel": dict(pe_fel.most_common()), "fara_referinta": fara,
           "fara_referinta_motiv": motiv, "nu_exista_in_aplicatia_reala": nereale, "harta_suprafete_referinta": harta,
           "referinte_shell": ref_shell,
           "randare": {"generat": c.get("generat"), "secunde": c.get("secunde"), "instante": len(toate)}}
    linii = [f"suprafețe de referință comparate: {len(pe_suprafata)} (desenate în cel puțin o pagină: "
             f"{sum(1 for v in pe_suprafata.values() if v['randari'])}); din suprafete.json fără referință: {len(fara)}, "
             f"inexistente în aplicația reală: {len(nereale)}",
             f"chei de diferență: {det['chei_de_diferenta']}; puncte (lipsă={P_LIPSA}, alt grup={P_GRUPARE}): {total}",
             "pe fel (chei): " + ", ".join(f"{k}={v}" for k, v in pe_fel.most_common(10))]
    return total, det, linii


if __name__ == "__main__":
    L.ruleaza("oracol_ui", masoara)
