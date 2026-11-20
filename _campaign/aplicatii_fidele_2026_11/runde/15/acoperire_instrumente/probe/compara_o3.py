# -*- coding: utf-8 -*-
"""Runda 15, acoperire pe instrumente: O3 înainte / după, suprafață cu suprafață, + celelalte oracole din masurare.json.
    python .../probe/compara_o3.py   -> scrie ../comparatie_o3.txt și îl afișează
Înainte = acoperire_instrumente/iesiri_inainte/O3/oracol_ui.json (copia ieșirilor măsurării de pornire 20:08-20:50)
          + runde/15/masurare_inainte_instrumente.json; după = runde/15/iesiri/O3/oracol_ui.json + runde/15/masurare.json."""
import json
from pathlib import Path

AICI = Path(__file__).resolve().parent
R15 = AICI.parents[1]
OFFICE = ("word", "excel", "powerpoint")
SHELL = ("windows", "explorer")


def citeste(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def main():
    a = citeste(AICI.parent / "iesiri_inainte" / "O3" / "oracol_ui.json")
    b = citeste(R15 / "iesiri" / "O3" / "oracol_ui.json")
    ma = citeste(R15 / "masurare_inainte_instrumente.json")
    mb = citeste(R15 / "masurare.json")
    out = [f"O3: {a['numar']} -> {b['numar']} (randare înainte {a['randare']['generat']}, după {b['randare']['generat']}; "
           f"instanțe {a['randare']['instante']} -> {b['randare']['instante']})"]
    pa, pb = a["pe_suprafata"], b["pe_suprafata"]
    camp = ("puncte", "diferente", "comenzi_cu_diferente", "randari", "unitati_referinta", "mostre")
    for app in OFFICE:
        ka = sorted(k for k in pa if k.split(".")[0] == app)
        kb = sorted(k for k in pb if k.split(".")[0] == app)
        dif = [k for k in set(ka) | set(kb) if any(pa.get(k, {}).get(c) != pb.get(k, {}).get(c) for c in camp)]
        out.append(f"  {app}: suprafețe {len(ka)} -> {len(kb)}; puncte {sum(pa[k]['puncte'] for k in ka)} -> "
                   f"{sum(pb[k]['puncte'] for k in kb)}; suprafețe cu ORICE câmp diferit ({', '.join(camp)}): {len(dif)}"
                   + (f" {sorted(dif)[:8]}" if dif else ""))
    fa, fb = a["fara_referinta"], b["fara_referinta"]
    rest_a = [x for x in fa if x.split(".")[0] not in SHELL]
    rest_b = [x for x in fb if x.split(".")[0] not in SHELL]
    out.append(f"  fara_referinta: {len(fa)} -> {len(fb)}; în afara Windows/Explorer identice: {rest_a == rest_b} ({len(rest_b)})")
    legate = [x for x in fa if x not in fb]
    out.append(f"  legate acum ({len(legate)}): {', '.join(legate)}")
    out.append(f"  rămase fără referință ({len([x for x in fb if x.split('.')[0] in SHELL])}):")
    for x in fb:
        if x.split(".")[0] in SHELL:
            out.append(f"    {x}: {b.get('fara_referinta_motiv', {}).get(x, '?')}")
    sh = {k: v for k, v in pb.items() if k.split(".")[0] in SHELL}
    out.append(f"  suprafețe shell comparate: {len(sh)}; puncte {sum(v['puncte'] for v in sh.values())}; desenate: "
               f"{[k for k, v in sh.items() if v['randari']]}")
    for k, v in sorted(sh.items()):
        out.append(f"    {k}: {v['puncte']} puncte, {v['unitati_referinta']} comenzi în referință, {v['randari']} randări")
    pf_a, pf_b = a["pe_fel"], b["pe_fel"]
    out.append("  pe fel: " + ", ".join(f"{k} {pf_a.get(k, 0)}->{pf_b.get(k, 0)}" for k in sorted(set(pf_a) | set(pf_b))
                                       if pf_a.get(k, 0) != pf_b.get(k, 0)))
    out.append("Celelalte oracole și porțile (masurare.json, valoare înainte -> după):")
    for k in sorted(set(ma["oracole"]) | set(mb["oracole"])):
        va, vb = ma["oracole"].get(k, {}), mb["oracole"].get(k, {})
        out.append(f"  {k}: {va.get('valoare')} -> {vb.get('valoare')} ({va.get('stare')} -> {vb.get('stare')})"
                   + ("" if va.get("valoare") == vb.get("valoare") else "   <<< DIFERIT"))
    for k in ("porti",):
        pa_, pb_ = (ma.get("pe_poarta") or {}), (mb.get("pe_poarta") or {})
        if pa_ or pb_:
            dif = {x: (pa_.get(x), pb_.get(x)) for x in set(pa_) | set(pb_) if pa_.get(x) != pb_.get(x)}
            out.append(f"  porți diferite: {dif or 'niciuna'}")
    out.append(f"suma: {ma.get('suma')} -> {mb.get('suma')}; lacăt: {ma.get('lacat')} -> {mb.get('lacat')}; "
               f"regres: {mb.get('regres')}")
    t = "\n".join(out) + "\n"
    (AICI.parent / "comparatie_o3.txt").write_text(t, encoding="utf-8")
    print(t)


if __name__ == "__main__":
    main()
