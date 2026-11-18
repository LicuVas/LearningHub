# -*- coding: utf-8 -*-
"""Proba reparației B (O4): trecerea pe pagina veche se face DOAR când aplicația nu e în bibliotecă.
Copie temporară = simulatoarele VECHI (ca în --autotest) + biblioteca-jucărie (are Explorer) cu o singură linie plantată
în L.deschide pentru explorer:
  V0  fără bibliotecă                                  -> linia de bază (adaptorul vechi)
  L1  biblioteca spune „„explorer” nu e încă în bibliotecă” înainte de rădăcină  -> TRECE pe paginile vechi: = V0
  E1  biblioteca pică altfel („datele nu s-au încărcat”)                         -> rămâne eșec: toate neexecutabile pe poligon
  E2  fraza corectă, dar DUPĂ ce a pus rădăcina [data-lh-aplicatie=explorer]       -> rămâne eșec
  E3  fraza pentru ALTĂ aplicație („„word” nu e încă…”)                           -> rămâne eșec
  J0  jucăria curată (Explorer în bibliotecă și merge)                           -> 0 (ca în autotest)
Ultima linie = verificări picate."""
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
WT = Path(r"C:/00/Projects/LearningHub_fidel")
D = WT / "_campaign/aplicatii_fidele_2026_11"
O4 = D / "oracole/oracol_comportament.py"
JUC = D / "oracole/_jucarie"
INV = json.loads((D / "inventar.json").read_text(encoding="utf-8"))
PAG = ",".join(p["pagina"] for p in INV["pagini"] if "explorer" in (p.get("aplicatii") or []) or p.get("aplicatia_principala") == "explorer")
ANCORA = "opt=opt||{};stil();"
ANCORA_RAD = "root.setAttribute('data-lh-versiune',L.versiune);root.tabIndex=-1;loc.appendChild(root);"
CAZURI = {
    "L1": (ANCORA, ANCORA + "if(nume==='explorer')return Promise.reject(new Error('„explorer” nu e încă în bibliotecă (vine într-un val următor)'));"),
    "E1": (ANCORA, ANCORA + "if(nume==='explorer')return Promise.reject(new Error('explorer: datele nu s-au încărcat'));"),
    "E2": (ANCORA_RAD, ANCORA_RAD + "if(nume==='explorer')return Promise.reject(new Error('„explorer” nu e încă în bibliotecă'));"),
    "E3": (ANCORA, ANCORA + "if(nume==='explorer')return Promise.reject(new Error('„word” nu e încă în bibliotecă'));"),
}


def ruleaza(rad, iesire):
    env = dict(os.environ, LH_RADACINA=str(rad), LH_IESIRE=str(iesire), LH_PAGINI=PAG, PYTHONDONTWRITEBYTECODE="1")
    p = subprocess.run([sys.executable, str(O4)], capture_output=True, text=True, encoding="utf-8", errors="replace",
                       env=env, timeout=1800)
    linii = [x for x in p.stdout.splitlines() if x.strip()]
    det = json.loads((Path(iesire) / "oracol_comportament.json").read_text(encoding="utf-8"))
    sc = [s for s in det["scenarii"] if s.get("verdict") != "sarit"]
    return int(linii[-1]), sc


def rezumat(sc):
    from collections import Counter
    return dict(Counter((s.get("verdict"), s.get("motor"), (s.get("pagina") or "-").split("/")[0]) for s in sc))


tmp = Path(tempfile.mkdtemp(prefix="lh_o4_trecere_"))
picate = 0
try:
    rad = tmp / "sit"
    for sub in ("lectii/_sim", "lectii/v", "jocuri/_motor"):
        shutil.copytree(WT / sub, rad / sub, ignore=shutil.ignore_patterns("_proba", "_verificare", "*.png", "*.jpg", "*.webm"))
    v0, sc0 = ruleaza(rad, tmp / "V0")
    semn0 = {s["id"]: (s["verdict"], json.dumps(s.get("diferente", []), sort_keys=True, ensure_ascii=False)) for s in sc0}
    print(f"V0 fără bibliotecă: {v0} · {rezumat(sc0)}")
    (rad / "aplicatii").mkdir()
    shutil.copy2(JUC / "poligon.html", rad / "aplicatii" / "poligon.html")
    curat = (JUC / "aplicatii.js").read_text(encoding="utf-8")
    (rad / "aplicatii" / "aplicatii.js").write_text(curat, encoding="utf-8")
    j0, scj = ruleaza(rad, tmp / "J0")
    ok = j0 == 0
    picate += not ok
    print(f"{'ok ' if ok else 'RĂU'} J0 jucăria curată (Explorer în bibliotecă): {j0} (așteptat 0) · {rezumat(scj)}")
    chei_total = sum(max(1, len(json.loads(Path(s['fisier']).read_text(encoding='utf-8')).get('stare_citita') or [])) for s in sc0)
    for nume, (din, in_) in CAZURI.items():
        assert curat.count(din) == 1, (nume, curat.count(din))
        (rad / "aplicatii" / "aplicatii.js").write_text(curat.replace(din, in_), encoding="utf-8")
        try:
            n, sc = ruleaza(rad, tmp / nume)
        finally:
            (rad / "aplicatii" / "aplicatii.js").write_text(curat, encoding="utf-8")
        if nume == "L1":
            semn = {s["id"]: (s["verdict"], json.dumps(s.get("diferente", []), sort_keys=True, ensure_ascii=False)) for s in sc}
            ok = n == v0 and semn == semn0 and all(s.get("motor") == "vechi:explorer" for s in sc if s.get("verdict") in ("ok", "diferente"))
            print(f"{'ok ' if ok else 'RĂU'} {nume} aplicația lipsește din bibliotecă -> pagina veche: {n} (așteptat {v0}, aceleași verdicte: {semn == semn0}) · {rezumat(sc)}")
        else:
            toate_neex = all(s.get("verdict") == "neexecutabil" and s.get("motor") == "biblioteca" and s.get("pagina") == "aplicatii/poligon.html"
                             for s in sc)
            ok = toate_neex and n == chei_total
            print(f"{'ok ' if ok else 'RĂU'} {nume} eșec pe bibliotecă rămâne eșec: {n} (așteptat {chei_total} = toate cheile, "
                  f"toate neexecutabile pe poligon: {toate_neex}) · {rezumat(sc)} · ex.: {(sc[0].get('eroare') or '')[:120]}")
        picate += not ok
finally:
    shutil.rmtree(tmp, ignore_errors=True)
print("verificări picate:", picate)
print(picate)
