# -*- coding: utf-8 -*-
"""Proba jucăriei shell (runda 15, acoperire pe instrumente): O3 pe lecția V/M2-L09 dintr-o copie a sitului în %TEMP%,
cu oracole/_jucarie_shell/explorer-citire.js pus peste simulatorul vechi — întâi curată, apoi cu câte o stricăciune.
Ce arată: (1) O3 vede File Explorer-ul desenat după convenție și îl compară cu referinte/uia_explorer.json; (2) un Explorer
desenat FIDEL după referință dă 0 puncte pe suprafețele explorer.* (convertorul, tăieturile, regula nodurilor ascunse,
pozițiile); (3) fiecare stricăciune crește numărul exact pe suprafața ei.
Ieșiri: runde/15/acoperire_instrumente/proba_jucarie/<varianta>/oracol_ui.json + proba_jucarie.log (fără căi absolute)."""
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

AICI = Path(__file__).resolve().parent
D = AICI.parents[3]
OD = D / "oracole"
sys.path.insert(0, str(D / "mutanti"))
import mutanti as M  # noqa: E402  (fa_copie)

PAGINA = "lectii/v/m2-l09/index.html"
SIM = "lectii/_sim/explorer-citire.js"
JUCARIE = OD / "_jucarie_shell" / "explorer-citire.js"
IES = AICI.parent / "proba_jucarie"
VARIANTE = [
    ("curat", None, None, "jucăria nemutată"),
    ("nou_fara_folder", '      ["MenuItem", "Folder", null, 15, 7, 264, 28],\n', "", "meniul Nou fără rândul „Folder”"),
    ("decupare_tradus", '["Button", "Decupare", null, 102, 0, 40, 46]', '["Button", "Tăiere", null, 102, 0, 40, 46]',
     "bara de comenzi: „Decupare” scris „Tăiere”"),
    ("ascuns_lipsa", '      ["TreeItem", "Folderul meu 7", null, 51, 160, 42, 32],\n', "",
     "panoul de navigare cu un folder fixat (ascuns în referință) mai puțin"),
    ("detalii_buton", '["RadioButton", "Detalii", "ViewMode_Details", 1466, 0, 24, 24]',
     '["Button", "Detalii", "ViewMode_Details", 1466, 0, 24, 24]', "bara de stare: „Detalii” desenat ca Button, nu RadioButton"),
]


def main():
    copie = Path(tempfile.gettempdir()) / "lh_proba_jucarie_shell" / "sit"
    if copie.parent.exists():
        shutil.rmtree(copie.parent, ignore_errors=True)
    M.fa_copie(copie)
    jucarie = JUCARIE.read_text(encoding="utf-8")
    linii = []
    try:
        for nume, din, in_, desc in VARIANTE:
            t = jucarie
            if din is not None:
                assert t.count(din) == 1, (nume, t.count(din))
                t = t.replace(din, in_)
            (copie / SIM).write_text(t, encoding="utf-8", newline="\n")
            ies = IES / nume
            ies.mkdir(parents=True, exist_ok=True)
            env = dict(os.environ, LH_RADACINA=str(copie), LH_PAGINI=PAGINA, LH_DOAR_PAGINI=PAGINA, LH_IESIRE=str(ies),
                       LH_IESIRI=str(copie.parent / "cache"))
            r = subprocess.run([sys.executable, str(OD / "oracol_ui.py")], env=env, capture_output=True, text=True,
                               encoding="utf-8", errors="replace")
            ultima = (r.stdout.strip().splitlines() or ["?"])[-1]
            det = json.loads((ies / "oracol_ui.json").read_text(encoding="utf-8"))
            ex = {k: v for k, v in det["pe_suprafata"].items() if k.startswith("explorer.")}
            pct = {k: v["puncte"] for k, v in ex.items()}
            randate = sum(1 for v in ex.values() if v["randari"])
            linii.append(f"{nume}: O3 = {ultima} (cod {r.returncode}) · {desc}")
            linii.append(f"   suprafețe explorer.* desenate: {randate}/{len(ex)}; puncte explorer.* = {sum(pct.values())}; "
                         f"nenule: {({k: p for k, p in pct.items() if p})}")
            print(linii[-2] + "\n" + linii[-1], flush=True)
            for k, v in ex.items():
                if v["puncte"]:
                    linii.append(f"   {k}: {v['mostre'][:6]}")
    finally:
        shutil.rmtree(copie.parent, ignore_errors=True)
    (IES / "proba_jucarie.log").write_text("\n".join(linii) + "\n", encoding="utf-8")
    print("\n".join(linii))


if __name__ == "__main__":
    main()
