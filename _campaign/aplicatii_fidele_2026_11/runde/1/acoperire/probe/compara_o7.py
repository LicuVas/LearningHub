# -*- coding: utf-8 -*-
"""Dovada 1: O7 nou (biblioteca pe disc) vs. iesiri_pornire/O7 (inainte de biblioteca): citat cu citat, motiv cu motiv."""
import json
import sys
from collections import Counter
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
D = Path(r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11")
PORNIRE = D / "runde/1/iesiri_pornire/O7/oracol_text_ui.json"
NOU = Path(sys.argv[1]) if len(sys.argv) > 1 else D / "runde/1/acoperire/iesiri/O7/oracol_text_ui.json"
CAMPURI = ("unde", "sursa", "lant", "fel", "fila_spusa", "grupul_spus", "aplicatii", "aplicatii_fara_referinta", "motiv")


def chei(r):
    return Counter(json.dumps({k: p.get(k) for k in CAMPURI}, sort_keys=True, ensure_ascii=False) for p in r["probleme"])


p = json.loads(PORNIRE.read_text(encoding="utf-8"))
n = json.loads(NOU.read_text(encoding="utf-8"))
print("pornire: numar", p["numar"], "· citate", p["citate_judecate"], "· fise", p["fise_cum_fac"], "· pe motiv", p["pe_motiv"])
print("NOU    : numar", n["numar"], "· citate", n["citate_judecate"], "· fise", n["fise_cum_fac"], "· pe motiv", n["pe_motiv"],
      "· biblioteca_verificata", n.get("biblioteca_verificata"), "· pagini cu biblioteca", n.get("pagini_cu_biblioteca"))
cp, cn = chei(p), chei(n)
lipsa, in_plus = cp - cn, cn - cp
for k, v in list(lipsa.items())[:10]:
    print("DOAR LA PORNIRE x%d: %s" % (v, k[:300]))
for k, v in list(in_plus.items())[:10]:
    print("DOAR LA NOU x%d: %s" % (v, k[:300]))
# ordinea contează și ea (aceeași parcurgere): comparăm și listele, nu doar multiseturile
ordine_ok = [json.dumps({k: q.get(k) for k in CAMPURI}, sort_keys=True, ensure_ascii=False) for q in p["probleme"]] == \
            [json.dumps({k: q.get(k) for k in CAMPURI}, sort_keys=True, ensure_ascii=False) for q in n["probleme"]]
print("aceleași probleme în aceeași ordine:", ordine_ok)
dif = sum(lipsa.values()) + sum(in_plus.values()) + (p["citate_judecate"] != n["citate_judecate"]) + \
      (p["fise_cum_fac"] != n["fise_cum_fac"]) + (p["pe_motiv"] != n["pe_motiv"]) + (p["numar"] != n["numar"]) + (not ordine_ok)
print("abateri:", dif)
print(dif)
