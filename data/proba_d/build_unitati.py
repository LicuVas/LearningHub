"""Harta operațiilor de la proba D (competențe digitale), din subiectele reale rezolvate.

    python data/proba_d/build_unitati.py

Intrare: raw/batch*.json (cerințele fiecărei variante, extrase din subcompetente-digitale/content/rezolvari/,
         cu punctele din barem și operațiile atomice din vocabular_operatii.md).
Ieșire:
  - operatii.json      : fiecare operație cu aplicația, în câte variante apare, punctele adunate, exemple reale (cu sursa)
  - unitati_xii.json   : aceeași formă ca Info_Gimnaziu_2026/data/unitati.json, ca motorul jocurilor să aibă ancora:
                         o „unitate” pe aplicație (XII-W/X/P/A) + XII-R (simularea); „lecțiile” = treptele scării,
                         în ordinea predării (vocabularul), iar „conținuturile” = ID-urile operațiilor.
  - HARTA.md           : raportul citibil (ce aduce cele mai multe puncte)
Nu se editează de mână fișierele generate.
"""
import json
import re
from collections import defaultdict
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
APPS = {"W": ("XII-W", "Word — procesare de text"), "X": ("XII-X", "Excel — calcul tabelar"),
        "P": ("XII-P", "PowerPoint — prezentări"), "A": ("XII-A", "Access — baze de date")}
NR_START = {"W": 100, "X": 200, "P": 300, "A": 400}  # numerele treptelor: nu se amestecă între aplicații


# operațiile noi găsite de extragere (sufix _NOU), unificate: aceeași operație botezată diferit de loturi diferite
ALIAS = {
    "W_inspectie_document": "W_citire_proprietate", "W_zoom": "W_citire_proprietate",
    "X_inspectie_foaie": "X_citire_proprietate", "P_inspectie_prezentare": "P_citire_proprietate", "A_inspectie_baza": "A_citire_proprietate",
    "W_data_ora_automata": "W_camp_data_ora",
    "W_forme_schema": "W_smartart_forme", "W_schema_forme": "W_smartart_forme", "W_smartart": "W_smartart_forme",
    "W_smartart_organigrama": "W_smartart_forme", "W_grupare_obiecte": "W_smartart_forme",
    "W_setare_tiparire": "W_tiparire", "W_tiparire_setari": "W_tiparire", "P_setare_tiparire": "P_tiparire", "P_tiparire_setari": "P_tiparire",
    "W_paragraf_mutare": "W_editare_text", "W_paragraf_inserare_text": "W_editare_text", "W_tabel_golire_continut": "W_editare_text",
    "W_cautare_automata_numarare": "W_cautare_inlocuire", "W_evidentiere_text": "W_font",
    "W_legenda_caption": "W_nota_subsol", "W_nota_final": "W_nota_subsol", "W_fundal_pagina": "W_watermark",
    "X_foaie_stergere": "X_foaie_redenumire_copiere", "X_foaie_stergere_mutare": "X_foaie_redenumire_copiere",
    "X_culoare_foaie": "X_foaie_redenumire_copiere", "X_fundal_foaie": "X_foaie_redenumire_copiere",
    "X_smartart": "X_obiecte_grafice", "X_forma_desen": "X_obiecte_grafice", "X_wordart": "X_obiecte_grafice", "X_imagine_pozitionare": "X_obiecte_grafice",
    "X_antet_subsol": "X_setare_pagina_imprimare",
    "P_smartart": "P_tabel_diagrama", "P_forma_bordura_efecte": "P_imagine_forma", "P_pozitionare_obiect": "P_imagine_forma",
    "P_ordine_obiecte": "P_imagine_forma", "P_stergere_obiect": "P_imagine_forma", "P_caseta_text_noua": "P_imagine_forma",
    "P_marcatori": "P_liste", "P_numerotare_lista": "P_liste", "P_simbol_caracter_special": "P_text_format",
    "P_dimensiune_diapozitiv": "P_dimensiune_orientare", "P_orientare_diapozitive": "P_dimensiune_orientare", "P_data_ora_automata": "P_antet_subsol_numar",
    "A_camp_reordonare": "A_tabel_creare", "A_camp_stergere": "A_tabel_creare", "A_interogare_stergere": "A_interogare_actiune",
    "A_formular_control_navigare": "A_formular", "O_captura_ecran": "O_sistem",
}


def corecteaza(c, fisier):
    """Corecțiile verificatorului independent (VERIFICARE_EXTRAGERE.md, 15.09.2026), aplicate peste extragere (raw/ rămâne neatins)."""
    ops = list(c.get("operatii") or [])
    t = ((c.get("text") or "") + " " + (c.get("detalii") or "")).lower()
    # 1. seriile (Fill › Series) erau botezate referinta_relativa_copiere / introducere_date
    if c.get("app") == "X" and "serie" in t and not (fisier == "2013-varianta10.html" and c.get("cod") == "3.b"):
        ops = ["X_serie_umplere" if canon(o) in ("X_referinta_relativa_copiere", "X_introducere_date") else o for o in ops]
    # 2. itemul de 1 punct „citești și scrii pe foaie” păstrează doar eticheta de citire
    if c.get("puncte") == 1 and any(canon(o).endswith("_citire_proprietate") for o in ops):
        ops = [o for o in ops if canon(o).endswith("_citire_proprietate")]
    if fisier == "2025-varianta2.html" and c.get("app") == "W" and c.get("cod") == "1a":
        ops = ["W_font"]
    if fisier == "2018-model.html" and c.get("app") == "A" and c.get("cod") == "5b" and "A_interogare_selectie" not in ops:
        ops.append("A_interogare_selectie")
    if c.get("detalii"):
        c["detalii"] = c["detalii"].replace("==TODAY()", "=TODAY()")
    c["operatii"] = list(dict.fromkeys(ops))
    return c


def canon(o):
    base = o[:-4] if o.endswith("_NOU") else o
    return ALIAS.get(base, base)


def vocab():
    """ID-urile din vocabular, în ordinea în care sunt scrise (ordinea de predare)."""
    src = (HERE / "vocabular_operatii.md").read_text(encoding="utf-8")
    return re.findall(r"\b([WXPAO]_[A-Za-z0-9_]+)", src)  # și X_SUM, X_IF (majuscule)


def main():
    order = vocab()
    variante, cerinte = [], []
    for f in sorted((HERE / "raw").glob("batch*.json")):
        for v in json.loads(f.read_text(encoding="utf-8"))["variante"]:
            variante.append(v["fisier"])
            for c in v["cerinte"]:
                c = corecteaza(dict(c, fisier=v["fisier"], an=v.get("an")), v["fisier"])
                cerinte.append(c)
    ops = defaultdict(lambda: {"variante": set(), "puncte": 0.0, "cerinte": 0, "exemple": []})
    for c in cerinte:
        ids = list(dict.fromkeys(canon(o) for o in c.get("operatii") or [] if o[:2] in ("W_", "X_", "P_", "A_")))
        if not ids:
            continue
        share = (c.get("puncte") or 0) / len(ids)  # punctele cerinței se împart egal între operațiile ei
        for o in ids:
            r = ops[o]
            r["variante"].add(c["fisier"]); r["puncte"] += share; r["cerinte"] += 1
            if len(r["exemple"]) < 12:
                r["exemple"].append({"sursa": c["fisier"], "cod": c.get("cod"), "text": c.get("text"),
                                     "detalii": c.get("detalii"), "puncte": c.get("puncte")})
    n_var = len(set(variante))
    out_ops = []
    for o, r in ops.items():
        app = o[0]
        out_ops.append({"id": o, "app": app, "nou": o not in order,
                        "variante": len(r["variante"]), "procent_variante": round(100 * len(r["variante"]) / max(1, n_var)),
                        "puncte_total": round(r["puncte"], 1), "cerinte": r["cerinte"], "exemple": r["exemple"]})
    rank = {o: i for i, o in enumerate(order)}
    out_ops.sort(key=lambda x: (x["app"], rank.get(x["id"], 999), x["id"]))
    (HERE / "operatii.json").write_text(json.dumps({"generat": date.today().isoformat(), "variante": n_var,
                                                    "cerinte": len(cerinte), "operatii": out_ops}, ensure_ascii=False, indent=1), encoding="utf-8")

    clase = {"XII": {"total_ore": None, "nota": "Ancora = subiectele reale de la proba D (nu programa). Generat de data/proba_d/build_unitati.py.", "unitati": []}}
    domenii, mp = {"XII": {}}, {"XII": {}}
    for app, (uid, titlu) in APPS.items():
        lst = [x for x in out_ops if x["app"] == app]
        lectii = [{"nr": NR_START[app] + i, "titlu": x["id"], "tip": "predare", "variante": x["variante"], "puncte": x["puncte_total"]}
                  for i, x in enumerate(lst)]
        clase["XII"]["unitati"].append({"id": uid, "titlu": titlu, "cs": [f"proba D · {titlu.split(' ')[0]}"], "ore": None, "lectii": lectii})
        domenii["XII"][titlu] = [x["id"] for x in lst]
        mp["XII"][uid] = [titlu]
    toate = [l for u in clase["XII"]["unitati"] for l in u["lectii"]]
    clase["XII"]["unitati"].append({"id": "XII-R", "titlu": "Simulare proba D", "cs": [u["cs"][0] for u in clase["XII"]["unitati"]],
                                    "ore": None, "lectii": toate})
    mp["XII"]["XII-R"] = list(domenii["XII"].keys())
    (HERE / "unitati_xii.json").write_text(json.dumps({"clase": clase, "domenii": domenii, "map": mp}, ensure_ascii=False, indent=1), encoding="utf-8")

    lines = ["# Harta operațiilor de la proba D", "",
             f"> GENERAT de `build_unitati.py` din {n_var} variante reale ({len(cerinte)} cerințe). Punctele unei cerințe se împart egal între operațiile ei.", ""]
    for app, (uid, titlu) in APPS.items():
        lst = sorted([x for x in out_ops if x["app"] == app], key=lambda x: -x["puncte_total"])
        tot = sum(x["puncte_total"] for x in lst)
        lines += [f"## {titlu} ({uid}) — {tot:.0f} puncte în total", "", "| Operația | Variante | % | Puncte |", "|---|---|---|---|"]
        lines += [f"| {x['id']} | {x['variante']} | {x['procent_variante']}% | {x['puncte_total']} |" for x in lst]
        lines.append("")
    (HERE / "HARTA.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"{n_var} variante · {len(cerinte)} cerințe · {len(out_ops)} operații · noi: {[x['id'] for x in out_ops if x['nou']]}")
    for app, (uid, _) in APPS.items():
        lst = [x for x in out_ops if x["app"] == app]
        print(f"  {uid}: {len(lst)} operații, {sum(x['puncte_total'] for x in lst):.0f} puncte")


if __name__ == "__main__":
    main()
