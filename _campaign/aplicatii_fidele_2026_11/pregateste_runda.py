# -*- coding: utf-8 -*-
"""Promptul rundei N, completat din șablon (16.11.2026, „Aplicațiile fidele”).

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/pregateste_runda.py N [--etapa B] [--aplicatia word]
           [--tinta "text"] [--dosar <alt dosar>]

Completează D/prompt_runda.md în D/runde/N/prompt.md:
  {N}, {N+1}       numărul rundei (și al următoarei)
  {ETAPA}          --etapa, altfel etapa ultimului rând din D/jurnal.jsonl (valul continuă); lipsă la ambele = eroare
  {APLICATIA}      --aplicatia, altfel cea din ultimul rând; la etapele 0 și D: „toate”; la B/C lipsă = eroare
  {UNGHI}          aspect | gest_tastatura | stare_finala_erori = UNGHIURI[N mod 3] (ales mecanic, nu de agent)
  {TINTA_PROPUSA}  --tinta, altfel D/runde/N-1/tinta_propusa.md, altfel din runda N-1: GRAV-urile criticului (jurnal
                   `critic_grav_deschise` dacă e listă, altfel rândurile cu GRAV din runde/N-1/critic.md) + numerele oracolelor
                   + porțile pe poartă (n = probleme; 17.11.2026) + ținta ei; la runda 1 sau fără date: spune că nu există
                   o țintă propusă.
Comentariul de la începutul șablonului (instrucțiunile pentru cine întreține șablonul) nu intră în prompt.
Ultima linie = 0 (scris) sau 1 (n-am putut: lipsește etapa/aplicația sau un {LOC} a rămas necompletat).
"""
import argparse
import hashlib
import json
import re
import sys
import time
from pathlib import Path

AICI = Path(__file__).resolve().parent
UNGHIURI = ["aspect", "gest_tastatura", "stare_finala_erori"]
ORDINE_O = [f"O{i}" for i in range(1, 10)]


def unghi(n):
    return UNGHIURI[n % 3]


def randuri_jurnal(d):
    f = d / "jurnal.jsonl"
    out = []
    if f.exists():
        for i, linie in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            if linie.strip():
                try:
                    out.append(json.loads(linie))
                except json.JSONDecodeError:
                    pass   # opreste.py raportează jurnalul stricat; aici doar nu folosesc rândul
    return out


def norm_oracole(v):
    if isinstance(v, dict):
        return {k: v.get(k) for k in ORDINE_O if k in v}
    if isinstance(v, list) and len(v) == 9:
        return dict(zip(ORDINE_O, v))
    return {}


def tinta_propusa(d, n, rand_prec):
    if n <= 1:
        return "(nicio țintă propusă: e prima rundă — alegi ținta la pasul 3, după numerele măsurate acum)"
    f = d / "runde" / str(n - 1) / "tinta_propusa.md"
    if f.exists() and f.read_text(encoding="utf-8").strip():
        return f"(din runde/{n - 1}/tinta_propusa.md)\n" + f.read_text(encoding="utf-8").strip()
    if not rand_prec:
        return f"(nicio țintă propusă: runda {n - 1} nu are rând în jurnal.jsonl — alegi ținta la pasul 3, după numere)"
    parti = [f"(din runda {n - 1}: jurnal.jsonl + runde/{n - 1}/critic.md)"]
    g = rand_prec.get("critic_grav_deschise")
    grav = []
    if isinstance(g, list):
        grav = [str(x) for x in g]
    elif isinstance(g, int) and g > 0:
        c = d / "runde" / str(n - 1) / "critic.md"
        if c.exists():
            grav = [x.strip() for x in c.read_text(encoding="utf-8").splitlines() if "GRAV" in x][:15]
        if not grav:
            grav = [f"{g} GRAV deschise (runde/{n - 1}/critic.md nu le listează pe rânduri cu „GRAV” — citește-l)"]
    if grav:
        parti.append("GRAV-uri deschise ale criticului (au ÎNTÂIETATE; se închid doar când un critic ulterior confirmă cu citat):")
        parti += [f"  - {x}" for x in grav]
    else:
        parti.append("Criticul rundei precedente n-a lăsat GRAV deschise.")
    od = norm_oracole(rand_prec.get("oracole_dupa"))
    oi = norm_oracole(rand_prec.get("oracole_inainte"))
    if od:
        parti.append("Oracolele după runda precedentă: " + ", ".join(f"{k}={od[k]}" + (f" (era {oi[k]})" if k in oi and oi[k] != od[k] else "")
                                                                       for k in od))
        mari = sorted(((k, v) for k, v in od.items() if isinstance(v, int) and v > 0), key=lambda x: -x[1])[:3]
        if mari:
            parti.append("Cele mai mari rămase: " + ", ".join(f"{k}={v}" for k, v in mari)
                         + " (la etapa B ținta = suprafața cu (O3+O4+O8) × lecții cea mai mare, din inventar.json)")
    pd, pi = rand_prec.get("porti_dupa"), rand_prec.get("porti_inainte")
    if isinstance(pd, dict) and pd:   # 17.11.2026: porțile pe poartă (n = probleme), ca să se vadă și o poartă deja roșie
        parti.append("Porțile după runda precedentă (n = probleme): " + ", ".join(
            f"{k}={v}" + (f" (era {pi[k]})" if isinstance(pi, dict) and k in pi and pi[k] != v else "") for k, v in pd.items()))
    elif pd is not None:
        parti.append(f"Porțile după runda precedentă: {pd}")
    if rand_prec.get("tinta"):
        parti.append(f"Ținta rundei precedente: {rand_prec.get('tinta')} · reparat: {rand_prec.get('reparat')}")
    return "\n".join(parti)


def main():
    ap = argparse.ArgumentParser(description="Completează prompt_runda.md pentru runda N.")
    ap.add_argument("n", type=int)
    ap.add_argument("--etapa")
    ap.add_argument("--aplicatia")
    ap.add_argument("--tinta")
    ap.add_argument("--dosar")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    d = Path(a.dosar).resolve() if a.dosar else AICI
    sablon_f = d / "prompt_runda.md"
    sablon = sablon_f.read_text(encoding="utf-8")
    rj = randuri_jurnal(d)
    ultim = rj[-1] if rj else {}
    prec = next((r for r in reversed(rj) if str(r.get("runda")) == str(a.n - 1)), None)
    etapa = a.etapa or (str(ultim.get("etapa")) if ultim.get("etapa") is not None else None)
    if not etapa:
        print("Lipsește etapa: dă --etapa 0|B|C|D (jurnalul nu are încă un rând din care s-o iau).")
        print(1)
        return 1
    aplicatia = a.aplicatia or ultim.get("aplicatia")
    if not aplicatia:
        if etapa in ("0", "D"):
            aplicatia = "toate"
        else:
            print(f"Lipsește aplicația pentru etapa {etapa}: dă --aplicatia word|excel|powerpoint|explorer|windows|paint.")
            print(1)
            return 1
    tinta = a.tinta or tinta_propusa(d, a.n, prec)
    tinta_bloc = "\n     " + "\n     ".join(tinta.splitlines()) + "\n     "
    corp = sablon
    if corp.lstrip().startswith("<!--"):
        corp = corp[corp.index("-->") + 3:].lstrip("\n")
    for k, v in (("{N+1}", str(a.n + 1)), ("{N}", str(a.n)), ("{ETAPA}", etapa), ("{APLICATIA}", aplicatia),
                 ("{UNGHI}", unghi(a.n)), ("{TINTA_PROPUSA}", tinta_bloc)):
        corp = corp.replace(k, v)
    ramase = sorted(set(re.findall(r"\{[A-Z_]+(?:\+1)?\}", corp)))
    if ramase:
        print(f"Au rămas locuri necompletate în șablon: {ramase}")
        print(1)
        return 1
    antet = (f"<!-- Runda {a.n} · etapa {etapa} · aplicația {aplicatia} · unghiul {unghi(a.n)} · generat de pregateste_runda.py "
             f"la {time.strftime('%Y-%m-%d %H:%M')} din prompt_runda.md (sha256 {hashlib.sha256(sablon.encode()).hexdigest()[:12]}) -->\n\n")
    out = d / "runde" / str(a.n) / "prompt.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(antet + corp, encoding="utf-8")
    print(f"runda {a.n}: etapa {etapa} · aplicația {aplicatia} · unghiul {unghi(a.n)} · ținta propusă: {tinta.splitlines()[0][:90]}")
    print(out)
    print(0)
    return 0


if __name__ == "__main__":
    sys.exit(main())
