# -*- coding: utf-8 -*-
"""Bancul de mutanți al oracolelor O1-O9 (contract, Etapa 0: „fiecare oracol trebuie să prindă ≥ 5 mutanți”). 16.11.2026.

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/mutanti/mutanti.py
    python .../mutanti.py --oracol O3              # doar mutanții unui oracol (sau O1,O7)
    python .../mutanti.py --id O3-02,O3-04         # doar acești mutanți
    python .../mutanti.py --paralel 3              # 3 copii ale sitului, oracolele împărțite între ele
    python .../mutanti.py --valideaza              # doar verifică bancul pe o copie (textul „din” apare exact o dată; mutantul
                                                   # se aplică și se scoate, cu sha256 verificat), fără oracole
    python .../mutanti.py --copie <dosar>          # refolosește o copie deja făcută (nu o șterge)

Un mutant (mutanti/banca.json) = o greșeală REALISTĂ de reparator grăbit: (fișier din situl VECHI sau din pagina-jucărie,
text exact `din` -> `in`, oracolul care TREBUIE s-o prindă, paginile pe care se vede). Cum se rulează:
 1. COPIE a worktree-ului în %TEMP% (robocopy; fără .git, node_modules, __pycache__, _campaign, _cercetare, _logs,
    .backup-before-practica). Worktree-ul adevărat nu se atinge niciodată (scriptul refuză o copie care nu e în %TEMP%).
 2. Pregătirea grupului (ex. „jucarie” = pagina-jucărie a oracolelor O4/O5/O9 copiată în <copie>/aplicatii/): pusă O SINGURĂ
    DATĂ la începutul grupului și luată înapoi O SINGURĂ DATĂ la finalul lui; înaintea fiecărui mutant, fișierele pregătite
    sunt verificate (sha256 = sursa) — o jucărie stricată oprește bancul (cod 3), nu dă „neprinși”.
 3. Linia de bază: oracolul rulat pe copia NEMUTATĂ, cu LH_RADACINA=<copie>, LH_PAGINI=paginile mutantului,
    LH_IESIRE=<temp>/iesiri/...; de 2 ori (fără --fara-zgomot), a doua oară cu LH_FARA_CACHE=1 (randare forțată, nu din
    cache-ul primei): două numere diferite = oracol cu zgomot -> NEPRINS.
 4. Mutantul: înlocuirea exactă (textul `din` trebuie să apară EXACT o dată) peste starea curentă (situl + pregătirea),
    oracolul rulat din nou, fișierul pus la loc octet cu octet pe starea de DINAINTEA mutantului (verificat cu sha256).
 PRINS  = numărul oracolului crește față de linia de bază (contractul oracolului respectat: ultima linie întreg, cod 0/1).
 NEPRINS = nu crește, sau: oracolul lipsește, nu citește LH_RADACINA (verificare statică: textul `LH_RADACINA` în oracol sau
           într-un modul local importat), textul `din` nu apare exact o dată, linia de bază/mutantul NECONCLUDENT, zgomot.
Ieșire: tabelul pe oracole (prinși / total, cerința ≥ 5 prinși), calea JSON-ului cu detalii (LH_IESIRE/rezultat.json,
implicit mutanti/rezultat.json), iar pe ULTIMA linie numărul de mutanți NEPRINȘI. Cod 0 = toți prinși, 1 = altfel.
"""
import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

AICI = Path(__file__).resolve().parent
D = AICI.parent
OD = D / "oracole"
WT = D.parents[1]
sys.path.insert(0, str(OD))
import porti as P  # noqa: E402  (ruleaza, citeste_numar, curat_tot)

ORACOLE = {"O1": "oracol_central.py", "O2": "oracol_identic.py", "O3": "oracol_ui.py", "O4": "oracol_comportament.py",
           "O5": "oracol_evenimente.py", "O6": "oracol_sarcini.py", "O7": "oracol_text_ui.py", "O8": "oracol_comenzi_moarte.py",
           "O9": "oracol_asistare.py"}
MINIM = 5
EXCLUSE_DIR = ["node_modules", ".git", "__pycache__", "_campaign", "_cercetare", "_logs", ".backup-before-practica"]
EXCLUSE_FIS = [".git", "*.pyc"]


def sha(b):
    return hashlib.sha256(b).hexdigest()


# ---------------------------------------------------------------- bancul
def incarca_banca(f):
    b = json.loads(Path(f).read_text(encoding="utf-8"))
    erori = []
    ids = set()
    for m in b.get("mutanti", []):
        for c in ("id", "oracol", "fisier", "din", "in", "descriere"):
            if c not in m:
                erori.append(f"{m.get('id', '?')}: lipsește câmpul „{c}”")
        if m.get("id") in ids:
            erori.append(f"{m.get('id')}: id dublu")
        ids.add(m.get("id"))
        if m.get("oracol") not in ORACOLE:
            erori.append(f"{m.get('id')}: oracol necunoscut {m.get('oracol')!r}")
        if m.get("din") == m.get("in"):
            erori.append(f"{m.get('id')}: „din” = „in” (nu schimbă nimic)")
        if m.get("pregatire") and m["pregatire"] not in b.get("pregatiri", {}):
            erori.append(f"{m.get('id')}: pregătire necunoscută {m['pregatire']!r}")
    return b, erori


# ---------------------------------------------------------------- respectă convenția?
def module_locale(f, vazute=None):
    """fișierele locale (din oracole/) importate de oracolul f, recursiv"""
    vazute = vazute if vazute is not None else set()
    if f in vazute or not f.exists():
        return vazute
    vazute.add(f)
    t = f.read_text(encoding="utf-8", errors="replace")
    for m in re.finditer(r"^\s*(?:from\s+([\w\.]+)\s+import|import\s+([\w\., ]+))", t, re.M):
        for nume in (m.group(1) or m.group(2) or "").split(","):
            nume = nume.strip().split(" ")[0]
            if not nume:
                continue
            cale = OD.joinpath(*nume.split("."))
            for c in (cale.with_suffix(".py"), cale / "__init__.py"):
                if c.exists():
                    module_locale(c, vazute)
            if cale.is_dir():
                for c in cale.glob("*.py"):
                    module_locale(c, vazute)
    return vazute


def respecta_radacina(oracol):
    f = OD / ORACOLE[oracol]
    if not f.exists():
        return False, "oracolul lipsește"
    for m in module_locale(f):
        if "LH_RADACINA" in m.read_text(encoding="utf-8", errors="replace"):
            return True, m.name
    return False, "nu citește LH_RADACINA (nici el, nici modulele locale importate) — CONVENTIE_RADACINA.md"


# ---------------------------------------------------------------- copia
def fa_copie(dest):
    dest = Path(dest)
    if not str(dest.resolve()).lower().startswith(str(Path(tempfile.gettempdir()).resolve()).lower()):
        raise RuntimeError(f"copia trebuie să fie în %TEMP%, nu {dest}")
    dest.mkdir(parents=True, exist_ok=True)
    cmd = ["robocopy", str(WT), str(dest), "/E", "/XD", *EXCLUSE_DIR, "/XF", *EXCLUSE_FIS,
           "/NFL", "/NDL", "/NJH", "/NJS", "/NP", "/R:1", "/W:1", "/MT:16"]
    r = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
    if r.returncode >= 8:
        raise RuntimeError(f"robocopy a eșuat (cod {r.returncode}): {r.stdout[-300:]} {r.stderr[-300:]}")
    return dest


class Copie:
    """o copie a sitului folosită de UN singur lucrător. Două straturi, ținute SEPARAT (17.11.2026, reparația 1 din
    verificare_etapa0.md — înainte, mutantul și pregătirea împărțeau același registru: primul mutant pus la loc ștergea
    biblioteca-jucărie, iar următorii ieșeau „fișierul aplicatii/aplicatii.js nu există în copie”):
      - PREGĂTIREA unui grup (scrie / pune_la_loc): registrul `originale` = starea sitului de dinaintea grupului;
        se pune o singură dată la începutul grupului și se ia înapoi o singură dată, la finalul lui;
      - MUTANTUL (aplica_mutant / scoate_mutant): ține minte octeții de dinaintea LUI (situl + pregătirea grupului) și îi
        pune înapoi exact pe aceia, deci fiecare mutant pornește de la aceeași copie, cu pregătirea INTACTĂ."""

    def __init__(self, cale):
        self.cale = Path(cale).resolve()
        if self.cale == WT.resolve():
            raise RuntimeError("refuz: copia nu poate fi worktree-ul adevărat")
        self.originale = {}   # rel -> bytes | None (None = nu exista)   — DOAR pregătirile
        self.dosare_noi = []  # dosarele create de pregătiri (ex. aplicatii/): se șterg la loc, ca biblioteca să nu „existe” după
        self.mutant_activ = None   # (rel, octeții de dinaintea mutantului) cât timp un mutant e aplicat

    def aplica_mutant(self, rel, date):
        """scrie mutantul peste starea CURENTĂ a fișierului și întoarce octeții de dinainte (nu atinge `originale`)"""
        if self.mutant_activ is not None:
            raise RuntimeError(f"un mutant e deja aplicat pe {self.mutant_activ[0]}")
        f = self.cale / rel
        inainte = f.read_bytes()
        self.mutant_activ = (rel, inainte)
        f.write_bytes(date)
        return inainte

    def scoate_mutant(self):
        """pune înapoi octeții de dinaintea mutantului; True = fișierul are din nou exact acel sha256"""
        if self.mutant_activ is None:
            return True
        rel, inainte = self.mutant_activ
        f = self.cale / rel
        f.write_bytes(inainte)
        self.mutant_activ = None
        return sha(f.read_bytes()) == sha(inainte)

    def scrie(self, rel, date):
        f = self.cale / rel
        if rel not in self.originale:
            self.originale[rel] = f.read_bytes() if f.exists() else None
        lipsa = [p for p in reversed(f.relative_to(self.cale).parents) if str(p) != "." and not (self.cale / p).exists()]
        f.parent.mkdir(parents=True, exist_ok=True)
        self.dosare_noi += [self.cale / p for p in lipsa if self.cale / p not in self.dosare_noi]
        f.write_bytes(date)

    def pune_la_loc(self, rel):
        f = self.cale / rel
        o = self.originale.pop(rel, "nimic")
        if o == "nimic":
            return True
        if o is None:
            f.unlink(missing_ok=True)
            for d in sorted(self.dosare_noi, key=lambda p: -len(p.parts)):
                try:
                    if d.exists() and not any(d.iterdir()):
                        d.rmdir()
                        self.dosare_noi.remove(d)
                except OSError:
                    pass
            return not f.exists()
        f.write_bytes(o)
        return sha(f.read_bytes()) == sha(o)

    def pune_tot_la_loc(self):
        ok = self.scoate_mutant()
        return all([ok] + [self.pune_la_loc(r) for r in list(self.originale)])


# ---------------------------------------------------------------- rulare
def ruleaza_oracol(oracol, copie, pagini, iesire, timeout, argumente=(), fara_cache=False):
    # LH_DOAR_PAGINI = numele folosit de structura_lib.py (O1/O2/O3/O7/O8) pentru același filtru: le dau pe amândouă
    # LH_IESIRI = dosarul de ieșiri al lui structura_lib.py (cache-ul randării): în %TEMP%, comun lucrătorului (cache-ul e cheiat
    # pe sha-ul sitului, deci un mutant nu reia randarea veche). Fără el, cache-ul ar ajunge în oracole/_iesiri/ cu calea
    # copiei din %TEMP% — care conține numele contului Windows (poarta datelor personale l-ar prinde).
    # LH_FARA_CACHE=1 (fara_cache) = randare forțată în structura_lib.py: a doua linie de bază (proba de zgomot) NU are voie
    # să citească randarea scrisă de prima — altfel „61 / 61” iese prin construcție (reparația 11, verificare_etapa0.md 3.a).
    env = {"LH_RADACINA": str(copie.cale), "LH_IESIRE": str(iesire), "LH_PAGINI": ",".join(pagini or []),
           "LH_DOAR_PAGINI": ",".join(pagini or []), "LH_IESIRI": str(Path(iesire).parent / "cache_structura")}
    if fara_cache:
        env["LH_FARA_CACHE"] = "1"
    cmd = [sys.executable, str(OD / ORACOLE[oracol]), *argumente]
    cod, text, timp = P.ruleaza(cmd, timeout, env=env, jurnal=Path(iesire) / "iesire.log")
    n, motiv, ultima = P.citeste_numar(text, cod, strict_cod=True)
    return {"valoare": n, "motiv": motiv, "ultima_linie": ultima[:160], "timp_s": timp, "cod": cod,
            "fara_cache": bool(fara_cache)}


def lucrator(oracole_ale_mele, mutanti, banca, copie_cale, tmp, a, jurnal):
    copie = Copie(copie_cale)
    rez = {}
    for o in oracole_ale_mele:
        ai = [m for m in mutanti if m["oracol"] == o]
        ok, motiv = respecta_radacina(o)
        if not ok and not a.valideaza:
            for m in ai:
                rez[m["id"]] = {"stare": "NEPRINS", "motiv": motiv}
            jurnal(f"{o}: {len(ai)} mutanți NEPRINȘI fără rulare — {motiv}")
            continue
        for preg in sorted({m.get("pregatire") or "" for m in ai}):
            grup = [m for m in ai if (m.get("pregatire") or "") == preg]
            # pregătirea grupului: pusă O SINGURĂ DATĂ aici, luată înapoi O SINGURĂ DATĂ după ultimul mutant al grupului;
            # `asteptat` = sha256 al fiecărui fișier pregătit, verificat înaintea FIECĂRUI mutant (jucăria trebuie să fie intactă)
            asteptat = {}
            if preg:
                for dest, sursa in banca["pregatiri"][preg].get("copiaza", {}).items():
                    date = (D / sursa).read_bytes()
                    copie.scrie(dest, date)
                    asteptat[dest] = sha(date)

            def pregatire_stricata():
                return [d_ for d_, h in asteptat.items()
                        if not (copie.cale / d_).exists() or sha((copie.cale / d_).read_bytes()) != h]
            baze = {}
            for m in grup:
                arg = [str(x).replace("{RADACINA}", str(copie.cale)) for x in (m.get("argumente") or [])]
                cheie = ",".join(m.get("pagini") or []) + " | " + " ".join(m.get("argumente") or [])
                stricate = pregatire_stricata()
                if stricate:   # defect al bancului, nu al oracolului: nu măsor nimic pe o jucărie stricată
                    raise RuntimeError(f"{m['id']}: pregătirea „{preg}” nu mai e intactă înaintea mutantului: {', '.join(stricate)}")
                f = copie.cale / m["fisier"]
                if not f.exists():
                    rez[m["id"]] = {"stare": "NEPRINS", "motiv": f"fișierul {m['fisier']} nu există în copie"}
                    continue
                t = f.read_bytes().decode("utf-8")
                nr = t.count(m["din"])
                if nr != 1:
                    rez[m["id"]] = {"stare": "NEPRINS", "motiv": f"textul „din” apare de {nr} ori în {m['fisier']} (trebuie exact o dată)"}
                    continue
                if a.valideaza:
                    # validarea trece și prin mecanica adevărată (aplic + scot mutantul, fără oracol): defectul din 16.11
                    # (jucăria ștearsă după primul mutant) trecea de o validare care doar număra textul „din”
                    inainte = copie.aplica_mutant(m["fisier"], t.replace(m["din"], m["in"]).encode("utf-8"))
                    try:
                        aplicat = m["in"] in f.read_bytes().decode("utf-8")
                    finally:
                        pus = copie.scoate_mutant()
                    if not pus:
                        raise RuntimeError(f"{m['id']}: fișierul {m['fisier']} n-a putut fi pus la loc în copie")
                    rez[m["id"]] = ({"stare": "VALID", "motiv": "textul „din” apare exact o dată; mutantul s-a aplicat și s-a scos "
                                     "(sha256 la loc)", "sha_inainte": sha(inainte)[:16]} if aplicat else
                                    {"stare": "NEPRINS", "motiv": "după aplicare, textul „in” nu apare în fișier"})
                    continue
                if cheie not in baze:
                    b1 = ruleaza_oracol(o, copie, m.get("pagini"), tmp / "iesiri" / f"baza_{o}_{len(baze)}_{preg or 'sit'}", a.timeout, arg)
                    # a doua linie de bază = proba de zgomot: cu randare FORȚATĂ (LH_FARA_CACHE=1), nu din cache-ul primei
                    b2 = b1 if a.fara_zgomot or b1["valoare"] is None else \
                        ruleaza_oracol(o, copie, m.get("pagini"), tmp / "iesiri" / f"baza_{o}_{len(baze)}_{preg or 'sit'}_bis", a.timeout, arg,
                                       fara_cache=True)
                    baze[cheie] = (b1, b2)
                    jurnal(f"{o} linia de bază [{preg or 'sit'}; {cheie.strip(' |') or 'toate paginile'}]: {b1['valoare']} / {b2['valoare']} "
                           f"({b1['timp_s']} s / {b2['timp_s']} s{' fără cache' if b2 is not b1 else ', o singură rulare'})"
                           f"{' — ' + b1['motiv'] if b1['motiv'] else ''}")
                b1, b2 = baze[cheie]
                if b1["valoare"] is None:
                    rez[m["id"]] = {"stare": "NEPRINS", "motiv": f"linia de bază NECONCLUDENTĂ: {b1['motiv']}", "baza": b1}
                    continue
                if b2["valoare"] != b1["valoare"]:
                    rez[m["id"]] = {"stare": "NEPRINS", "motiv": f"oracol cu zgomot: copia nemutată dă {b1['valoare']} și {b2['valoare']}",
                                    "baza": b1}
                    continue
                inainte = copie.aplica_mutant(m["fisier"], t.replace(m["din"], m["in"]).encode("utf-8"))
                try:
                    r = ruleaza_oracol(o, copie, m.get("pagini"), tmp / "iesiri" / m["id"], a.timeout, arg)
                finally:
                    pus = copie.scoate_mutant()
                if not pus:
                    raise RuntimeError(f"{m['id']}: fișierul {m['fisier']} n-a putut fi pus la loc în copie")
                if r["valoare"] is None:
                    st, mot = "NEPRINS", f"oracolul NECONCLUDENT pe mutant: {r['motiv']}"
                elif r["valoare"] > b1["valoare"]:
                    st, mot = "PRINS", f"{b1['valoare']} -> {r['valoare']}"
                else:
                    st, mot = "NEPRINS", f"numărul nu a crescut: {b1['valoare']} -> {r['valoare']}"
                # sha_inainte = fișierul pe care s-a plantat mutantul (dovada că fiecare pornește de la aceeași copie intactă)
                rez[m["id"]] = {"stare": st, "motiv": mot, "baza": b1["valoare"], "baza_bis": b2["valoare"], "mutant": r["valoare"],
                                "timp_s": r["timp_s"], "sha_inainte": sha(inainte)[:16],
                                **({"pregatire": preg, "pregatire_intacta": True} if preg else {})}
                jurnal(f"  {st:7} {m['id']} ({o}) {mot} · {m['descriere'][:70]}")
            if preg:
                for dest in banca["pregatiri"][preg].get("copiaza", {}):
                    if not copie.pune_la_loc(dest):
                        raise RuntimeError(f"pregătirea „{preg}”: {dest} n-a putut fi luat înapoi din copie")
    if not copie.pune_tot_la_loc():
        raise RuntimeError("copia n-a putut fi adusă la starea inițială")
    return rez


def main():
    ap = argparse.ArgumentParser(description="Bancul de mutanți: ultima linie = mutanți neprinși.")
    ap.add_argument("--banca", default=str(AICI / "banca.json"))
    ap.add_argument("--oracol", help="O1,...,O9 cu virgulă")
    ap.add_argument("--id", help="id-uri de mutanți cu virgulă")
    ap.add_argument("--paralel", type=int, default=1)
    ap.add_argument("--timeout", type=int, default=1500, help="secunde pe o rulare de oracol")
    ap.add_argument("--fara-zgomot", action="store_true", help="linia de bază o singură dată (mai repede, fără proba de determinism)")
    ap.add_argument("--valideaza", action="store_true")
    ap.add_argument("--copie", help="o copie existentă a sitului (în %TEMP%), refolosită și păstrată")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    t0 = time.time()
    banca, erori = incarca_banca(a.banca)
    if erori:
        for e in erori:
            print("  BANCA " + e)
        print(f"bancul are {len(erori)} erori de structură")
        print(-1)
        return 2
    mutanti = banca["mutanti"]
    if a.oracol:
        vrute = {x.strip() for x in a.oracol.split(",")}
        mutanti = [m for m in mutanti if m["oracol"] in vrute]
    if a.id:
        vrute = {x.strip() for x in a.id.split(",")}
        mutanti = [m for m in mutanti if m["id"] in vrute]
    pe_oracol = {o: [m for m in mutanti if m["oracol"] == o] for o in ORACOLE}
    oracole = [o for o in ORACOLE if pe_oracol[o]]
    tmp = Path(tempfile.mkdtemp(prefix="lh_mutanti_"))
    k = max(1, min(a.paralel, len(oracole) or 1))
    copii = []
    linii = []

    def jurnal(s):
        linii.append(s)
        print(s, flush=True)

    try:
        if a.copie:
            copii = [Path(a.copie).resolve()] * 1
            k = 1
        else:
            for i in range(k):
                t1 = time.time()
                copii.append(fa_copie(tmp / f"sit{i}"))
                jurnal(f"copia {i + 1}/{k} a sitului: {round(time.time() - t1)} s")
        grupe = [oracole[i::k] for i in range(k)]
        with ThreadPoolExecutor(max_workers=k) as ex:
            parti = list(ex.map(lambda i: lucrator(grupe[i], mutanti, banca, copii[i], tmp / f"l{i}", a, jurnal), range(k)))
        rez = {}
        for p in parti:
            rez.update(p)
    finally:
        if not a.copie:
            shutil.rmtree(tmp, ignore_errors=True)
    tabel = {}
    for o in ORACOLE:
        ai = pe_oracol[o]
        prinsi = sum(rez.get(m["id"], {}).get("stare") in ("PRINS", "VALID") for m in ai)
        tabel[o] = {"total": len(ai), "prinsi": prinsi, "neprinsi": [m["id"] for m in ai if rez.get(m["id"], {}).get("stare") not in ("PRINS", "VALID")]}
    neprinsi = sum(len(v["neprinsi"]) for v in tabel.values())
    sub_minim = [o for o, v in tabel.items() if v["prinsi"] < MINIM and (not (a.oracol or a.id) or v["total"])]
    for o, v in tabel.items():
        if not v["total"] and (a.oracol or a.id):
            continue
        print(f"{o} {ORACOLE[o]:26} {'validi' if a.valideaza else 'prinși'} {v['prinsi']:2}/{v['total']:2}"
              + ("" if v["prinsi"] >= MINIM else f"   SUB {MINIM}") + (f" · neprinși: {', '.join(v['neprinsi'])}" if v["neprinsi"] else ""))
    print(f"mutanți: {len(mutanti)} · {'validi' if a.valideaza else 'prinși'}: {len(mutanti) - neprinsi} · neprinși: {neprinsi} · "
          f"oracole sub {MINIM}: {', '.join(sub_minim) or 'niciunul'} · {round(time.time() - t0)} s")
    iesire = Path(os.environ["LH_IESIRE"]) if os.environ.get("LH_IESIRE") else AICI
    iesire.mkdir(parents=True, exist_ok=True)
    det = iesire / ("validare.json" if a.valideaza else "rezultat.json")
    det.write_text(json.dumps(P.curat_tot({"generat": time.strftime("%Y-%m-%d %H:%M:%S"), "valideaza": a.valideaza, "pe_oracol": tabel,
                                           "sub_minim": sub_minim, "mutanti": {m["id"]: {"oracol": m["oracol"], "fisier": m["fisier"],
                                                                                         "descriere": m["descriere"], **rez.get(m["id"], {})}
                                                                               for m in mutanti},
                                           "jurnal": linii, "durata_s": round(time.time() - t0)}), ensure_ascii=False, indent=1),
                   encoding="utf-8")
    print(P.curat(str(det)))
    print(neprinsi)
    return 0 if neprinsi == 0 else 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SystemExit:
        raise
    except Exception:  # noqa: BLE001 — prăbușirea are cod propriu (3), nu se confundă cu „mutanți neprinși”
        import traceback
        print(P.curat(traceback.format_exc()[-1500:]))
        print("mutanti.py a căzut — rezultatul nu e o măsurare")
        print(-1)
        sys.exit(3)
