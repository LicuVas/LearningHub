# -*- coding: utf-8 -*-
"""Porțile de regres ale lucrării „Aplicațiile fidele” (contract I2 + I4), învelite într-un singur număr (16.11.2026).

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/oracole/porti.py
    python .../porti.py --doar cum_fac,date_personale      # doar unele
    python .../porti.py --paralel 2                        # câte porți deodată (implicit 1: temporizările probelor nu se calcă)
    python .../porti.py --lista                            # ce porți sunt și cum se rulează

Porțile (fiecare pe situl LH_RADACINA, implicit worktree-ul C:/00/Projects/LearningHub_fidel — oracole/CONVENTIE_RADACINA.md):
  test_joc          jocuri/_motor/test_joc.py --toate          iese doar cu cod: cod != 0 = PICATĂ (nu se modifică scriptul)
  controale_taiate  lectii/_build/oracol_controale_taiate.py   ultima linie = defecte + erori de măsurare; != 0 = PICATĂ
  cum_fac           porti_extra/cum_fac_wt.py                  build.mjs --verifica pe situl măsurat (build.mjs are calea
                                                               masterului scrisă fix; aici e redirecționat), cu digest proaspăt
  fereastra_mica    jocuri/_motor/proba_fereastra_mica.py      fără --baza: doar server local; ruta abandonează tot ce nu e
                                                               127.0.0.1/localhost și orice /api/ (citit în cod, rândurile 84-100)
  date_personale    porti_extra/date_personale_wt.py           C:/00/AI_0/tools/learninghub_date_personale.py cu rădăcina
                                                               schimbată pe situl măsurat, fără --curata
  word2007_j2       porti_extra/j2_parcurs.py                  copia probei Word 2007 (lectii/vii/m1-l02/_verificare nu e în git)
Înainte de rulare, fiecare script e citit: dacă pomenește serverul viu (teste-vasile, teste.api, lh-api, diplome.py,
proba_prezenta, proba_diploma) sau, fiind probă de browser, nu are `.abort(` (regula 24), poarta NU se rulează = NECONCLUDENTĂ.
Paza rețelei (reparația 12 + reverificare_etapa0.md 6.c, 17.11.2026): cele trei probe de browser ale SITULUI (test_joc,
controale_taiate, fereastra_mica — fișiere ale sitului, neatinse) nu opresc navigator.sendBeacon și încarcă prezenta.js.
Rulează deci cu porti_extra/paza_browser/ în PYTHONPATH: sitecustomize.py de acolo se încarcă singur în probă și în
procesele ei Python copil și pune, pe fiecare context de browser, sendBeacon înlocuit (întoarce false), prezenta.js /
site-credit.js abandonate și tot ce nu e local abandonat înaintea rutei probei. Fiecare proces scrie în LH_PAZA_JURNAL
(%TEMP%) câte contexte a păzit; o poartă păzită care n-a păzit niciun context = NECONCLUDENTĂ (rezultat neacceptat).
Proba pazei, cu control negativ: porti_extra/paza_proba.py.

Numărul fiecărei porți = PROBLEMELE ei (n), nu „trecut/picat” (17.11.2026, verificare_etapa0.md 3.h și reparația 6: o poartă
deja roșie — cum_fac 41 — nu se mai putea înrăutăți vizibil; 41 → 80 trecea drept „tot 1 poartă picată”):
  numar  ultima linie a probei (ex. cum_fac 41, date_personale 11);
  cod    test_joc iese doar cu cod: n = rândurile „[PICAT]” din ieșire, minim 1 când codul != 0.
porti.json poartă `pe_poarta` = {poarta: n} (null = NECONCLUDENTĂ). masoara.py îl pune în `pentru_jurnal.porti`, iar
masoara.py și opreste.py compară n cu n pe FIECARE poartă (o poartă care crește = regres, chiar dacă alta scade la fel).
Ieșire: un rând pe poartă, apoi calea JSON-ului cu detalii (LH_IESIRE/porti.json, implicit lângă script), apoi pe ULTIMA
linie SUMA problemelor tuturor porților. De ce suma și nu numărul porților picate: e aceeași unitate ca O1-O9 (probleme),
deci suma din masoara.py rămâne omogenă, iar orice creștere a unei porți mișcă și numărul unic (comparația pe poartă din
masoara/opreste prinde și cazul rar în care o poartă crește cât scade alta). O poartă NECONCLUDENTĂ (n necunoscut: nu poate
fi comparată n cu n) face întreaga ieșire -1, cod 2: o măsurătoare ratată nu trece drept curată și nici drept „1 problemă”.
Cod 0 = suma 0, 1 = suma > 0, 2 = cel puțin o poartă NECONCLUDENTĂ (ultima linie -1).
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

AICI = Path(__file__).resolve().parent
D = AICI.parent
RAD = Path(os.environ.get("LH_RADACINA") or D.parents[1]).resolve()
IESIRE = Path(os.environ["LH_IESIRE"]).resolve() if os.environ.get("LH_IESIRE") else AICI
JURNALE = Path(os.environ["LH_IESIRE"]).resolve() if os.environ.get("LH_IESIRE") else Path(tempfile.gettempdir()) / "lh_porti"
INTERZISE = re.compile(r"teste-vasile|teste\.api|lh-api|diplome\.py|proba_prezenta|proba_diploma", re.I)
# originalul probei Word 2007, la data copierii (porti_extra/j2_parcurs.py); dacă se schimbă, se spune (info, nu cădere)
J2_ORIGINAL = Path("C:/00/Projects/LearningHub/lectii/vii/m1-l02/_verificare/j2_parcurs.py")
J2_SHA_LA_COPIERE = "e16d72beb2ce4e9e40d7599eb5997842a1af0a37cd72eb21a30d41910e1051ef"
PY = sys.executable
# paza rețelei pentru probele de browser ale SITULUI (sitecustomize.py, încărcat prin PYTHONPATH; vezi docstring-ul)
PAZA_BROWSER = AICI / "porti_extra" / "paza_browser"


def porti(rad=RAD, iesire=JURNALE):
    """id -> (comanda, fișierele citite de paza statică, fel, timeout_s, e_proba_de_browser, pazita)
    pazita = rulată cu paza rețelei (PAZA_BROWSER în PYTHONPATH): probele de browser ale sitului, care nu opresc singure
    sendBeacon / prezenta.js. word2007_j2 are paza în codul ei (porti_extra/j_comun.py), deci nu e învelită a doua oară."""
    return {
        "test_joc": ([PY, str(rad / "jocuri/_motor/test_joc.py"), "--toate"], [rad / "jocuri/_motor/test_joc.py"], "cod", 2400, True, True),
        "controale_taiate": ([PY, str(rad / "lectii/_build/oracol_controale_taiate.py"), "--json", str(iesire / "controale_taiate.json")],
                             [rad / "lectii/_build/oracol_controale_taiate.py"], "numar", 3600, True, True),
        "cum_fac": ([PY, str(AICI / "porti_extra/cum_fac_wt.py")], [AICI / "porti_extra/cum_fac_wt.py"], "numar", 900, False, False),
        "fereastra_mica": ([PY, str(rad / "jocuri/_motor/proba_fereastra_mica.py")], [rad / "jocuri/_motor/proba_fereastra_mica.py"],
                           "numar", 2400, True, True),
        "date_personale": ([PY, str(AICI / "porti_extra/date_personale_wt.py")], [AICI / "porti_extra/date_personale_wt.py"],
                           "numar", 900, False, False),
        "word2007_j2": ([PY, str(AICI / "porti_extra/j2_parcurs.py")],
                        [AICI / "porti_extra/j2_parcurs.py", AICI / "porti_extra/j_comun.py"], "numar", 900, True, False),
    }


def jurnal_paza(cale):
    """rândurile scrise de paza_browser/sitecustomize.py (câte unul pe proces Python) → rezumat"""
    procese = []
    if Path(cale).exists():
        for x in Path(cale).read_text(encoding="utf-8", errors="replace").splitlines():
            try:
                procese.append(json.loads(x))
            except ValueError:
                pass
    cu_browser = [p for p in procese if p.get("contexte")]
    return {"procese": len(procese), "procese_cu_browser": len(cu_browser),
            "contexte_pazite": sum(p.get("contexte", 0) for p in procese),
            "rute_invelite": sum(p.get("rute_invelite", 0) for p in procese),
            "cereri_locale_oprite": sum(p.get("cereri_locale_oprite", 0) for p in procese),
            "cereri_externe_oprite": sum(p.get("cereri_externe_oprite", 0) for p in procese),
            "erori": sorted({p["eroare"] for p in procese if p.get("eroare")})[:3]}


# ---------- unelte comune (le folosesc și masoara.py și mutanti/mutanti.py) ----------

def curat(s):
    """Scoate din text calea profilului și numele contului Windows (regula 27: ce scriem în dosarul lucrării ajunge în git)."""
    if not isinstance(s, str):
        return s
    acasa = str(Path.home())
    for v in {acasa, acasa.replace("\\", "/"), acasa.replace("\\", "\\\\")}:
        s = re.sub(re.escape(v), "%USERPROFILE%", s, flags=re.I)
    nume = Path.home().name
    if len(nume) >= 3:
        s = re.sub(r"\b" + re.escape(nume) + r"\b", "<utilizator>", s, flags=re.I)
    return s


def curat_tot(o):
    if isinstance(o, dict):
        return {curat(k): curat_tot(v) for k, v in o.items()}
    if isinstance(o, list):
        return [curat_tot(x) for x in o]
    return curat(o)


def opreste_arborele(pid):
    """Închide procesul pornit de mine și copiii lui (browserele Playwright), nimic altceva."""
    subprocess.run(["taskkill", "/T", "/F", "/PID", str(pid)], capture_output=True)


def ruleaza(cmd, timeout, env=None, jurnal=None):
    """Rulează cmd cu ieșirea într-un fișier (fără blocaje de pipe); la depășire închide arborele procesului.
    Întoarce (cod | None la depășire, textul ieșirii, secunde)."""
    e = dict(os.environ)
    e.update({"PYTHONIOENCODING": "utf-8", "PYTHONDONTWRITEBYTECODE": "1", "PYTHONUTF8": "1", "PYTHONUNBUFFERED": "1"})
    if env:
        e.update(env)
    jurnal = Path(jurnal) if jurnal else Path(tempfile.mkstemp(prefix="lh_rulare_", suffix=".log")[1])
    jurnal.parent.mkdir(parents=True, exist_ok=True)
    t0 = time.time()
    with open(jurnal, "wb") as f:
        p = subprocess.Popen(cmd, stdout=f, stderr=subprocess.STDOUT, env=e, cwd=str(Path(cmd[1]).parent) if len(cmd) > 1 else None,
                             creationflags=getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0))
        try:
            cod = p.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            opreste_arborele(p.pid)
            try:
                p.wait(timeout=30)
            except subprocess.TimeoutExpired:
                pass
            cod = None
    text = jurnal.read_bytes().decode("utf-8", errors="replace")
    jurnal.write_text(curat(text), encoding="utf-8")
    return cod, text, round(time.time() - t0, 1)


def citeste_numar(text, cod, strict_cod=True):
    """Contractul oracolelor: ultima linie = UN întreg, ultimele 3 rânduri nevide, cod 0/1 (0 doar cu 0 probleme).
    Întoarce (numar | None, motiv_neconcludent | None, ultima_linie)."""
    randuri = text.replace("\r\n", "\n").rstrip("\n").split("\n") if text.strip() else []
    ultima = randuri[-1].strip() if randuri else ""
    if cod is None:
        return None, "depășit timpul (procesul a fost oprit)", ultima
    if not re.fullmatch(r"-?\d+", ultima):
        return None, f"ultima linie nu e un întreg: {ultima[:120]!r} (cod {cod})", ultima
    n = int(ultima)
    if n < 0:
        return None, f"oracolul s-a declarat neconcludent ({n})", ultima
    if strict_cod:
        if any(not r.strip() for r in randuri[-3:]) or len(randuri) < 3:
            return None, "una din ultimele 3 linii e goală (sau sunt sub 3 linii)", ultima
        if cod not in (0, 1):
            return None, f"cod de ieșire {cod} (contractul: 0 sau 1; altul = prăbușire)", ultima
        if (n == 0) != (cod == 0):
            return None, f"codul {cod} nu se potrivește cu numărul {n} (0 probleme <-> cod 0)", ultima
    return n, None, ultima


def paza_statica(fisiere, e_browser):
    for f in fisiere:
        if not Path(f).exists():
            return f"lipsește {Path(f).as_posix()}"
        t = Path(f).read_text(encoding="utf-8", errors="replace")
        m = INTERZISE.search(t)
        if m:
            return f"{Path(f).name} pomenește serverul viu ({m.group(0)}) — nerulat"
    if e_browser and not any(".abort(" in Path(f).read_text(encoding="utf-8", errors="replace") for f in fisiere):
        return "probă de browser fără `.abort(` (regula 24) — nerulat"
    return None


def o_poarta(id_, spec, iesire):
    cmd, fisiere, fel, timeout, e_browser, pazita = spec
    r = {"id": id_, "cmd": " ".join(Path(c).as_posix() if i else Path(c).name for i, c in enumerate(cmd)), "fel": fel, "timeout_s": timeout,
         "pazita": pazita}
    motiv = paza_statica(fisiere, e_browser)
    if not motiv and pazita:
        # paza însăși trece prin aceeași verificare statică (fără `.abort(` cerut: acela se cere probei sitului, mai sus)
        motiv = paza_statica([PAZA_BROWSER / "sitecustomize.py"], False)
    if motiv:
        r.update(stare="NECONCLUDENT", motiv=motiv, timp_s=0, cod=None, ultima_linie="", numar=None)
        return r
    log = iesire / f"porti_{id_}.log"
    env = {"LH_RADACINA": str(RAD)}
    jp = iesire / f"paza_{id_}.jsonl"
    if pazita:
        if jp.exists():
            jp.unlink()
        env.update(PYTHONPATH=os.pathsep.join([str(PAZA_BROWSER)] + ([os.environ["PYTHONPATH"]] if os.environ.get("PYTHONPATH") else [])),
                   LH_PAZA_JURNAL=str(jp))
    cod, text, timp = ruleaza(cmd, timeout, env=env, jurnal=log)
    r.update(cod=cod, timp_s=timp, log=str(log))
    if pazita:
        r["paza"] = jurnal_paza(jp)
    randuri = [x for x in text.replace("\r\n", "\n").split("\n") if x.strip()]
    r["ultima_linie"] = randuri[-1].strip()[:200] if randuri else ""
    r["coada"] = [x[:300] for x in randuri[-6:]]
    if fel == "cod":
        r["picate_in_iesire"] = [x[:200] for x in randuri if x.startswith("[PICAT]")]
        if cod is None:
            r.update(stare="NECONCLUDENT", motiv="depășit timpul", numar=None)
        else:
            r.update(stare="TRECUT" if cod == 0 else "PICAT", numar=(len(r["picate_in_iesire"]) or 1) if cod else 0)
            if cod not in (0, 1):
                r.update(stare="NECONCLUDENT", motiv=f"cod {cod} (prăbușire?)")
    else:
        n, motiv, _ = citeste_numar(text, cod, strict_cod=False)   # porțile vechi ies cu 0 și când găsesc probleme
        if n is None:
            r.update(stare="NECONCLUDENT", motiv=motiv, numar=None)
        else:
            r.update(stare="TRECUT" if n == 0 else "PICAT", numar=n)
    if pazita and r["stare"] != "NECONCLUDENT" and not r["paza"]["contexte_pazite"]:
        # o probă de browser a sitului care a rulat fără niciun context păzit: sendBeacon / prezenta.js n-au fost oprite
        r.update(stare="NECONCLUDENT", numar=None,
                 motiv=f"paza rețelei n-a prins niciun context de browser (procese {r['paza']['procese']}; erori "
                       f"{r['paza']['erori'] or '-'}) — rezultat neacceptat (reparația 12)")
    return r


def main():
    ap = argparse.ArgumentParser(description="Porțile de regres, învelite: ultima linie = suma problemelor porților (-1 = neconcludent).")
    ap.add_argument("--doar", help="id-uri cu virgulă (implicit toate)")
    ap.add_argument("--paralel", type=int, default=1)
    ap.add_argument("--lista", action="store_true")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    JURNALE.mkdir(parents=True, exist_ok=True)
    IESIRE.mkdir(parents=True, exist_ok=True)
    P = porti(RAD, JURNALE)
    if a.lista:
        for k, v in P.items():
            print(f"{k:17} {v[2]:6} timeout {v[3]:5} s  {' '.join(Path(c).as_posix() for c in v[0][1:])}")
        print(len(P))
        return 0
    ids = [x.strip() for x in a.doar.split(",")] if a.doar else list(P)
    necunoscute = [x for x in ids if x not in P]
    if necunoscute:
        print(f"porți necunoscute: {necunoscute}; există: {list(P)}")
        print(-1)
        return 2
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max(1, a.paralel)) as ex:
        rez = list(ex.map(lambda i: o_poarta(i, P[i], JURNALE), ids))
    info = []
    if "word2007_j2" in ids and J2_ORIGINAL.exists():
        sha = hashlib.sha256(J2_ORIGINAL.read_bytes()).hexdigest()
        if sha != J2_SHA_LA_COPIERE:
            info.append(f"originalul {J2_ORIGINAL.as_posix()} s-a schimbat de la copiere (sha {sha[:12]}); recopiază porti_extra/j2_parcurs.py")
    picate = sum(r["stare"] != "TRECUT" for r in rez)
    # n pe fiecare poartă (problemele ei); None = NECONCLUDENTĂ (nu se poate compara n cu n)
    pe_poarta = {r["id"]: (r.get("numar") if r["stare"] != "NECONCLUDENT" else None) for r in rez}
    neconcludente = [k for k, v in pe_poarta.items() if v is None]
    total = -1 if neconcludente else sum(pe_poarta.values())
    for r in rez:
        extra = f" · {r.get('numar')} probleme" if r["stare"] == "PICAT" else ""
        extra += f" · {r['motiv']}" if r.get("motiv") else ""
        if r.get("paza"):
            z = r["paza"]
            extra += (f" · paza: {z['contexte_pazite']} contexte în {z['procese_cu_browser']} procese, prezenta/site-credit "
                      f"oprite {z['cereri_locale_oprite']}, externe oprite {z['cereri_externe_oprite']}")
        print(f"[{r['stare']:12}] {r['id']:17} {r['timp_s']:7.1f} s · cod {r.get('cod')} · ultima linie {r.get('ultima_linie', '')[:60]!r}{extra}")
    for x in info:
        print("  info " + x)
    durata = round(time.time() - t0, 1)
    print(f"porți: {len(rez)} · trecute {sum(r['stare'] == 'TRECUT' for r in rez)} · picate {sum(r['stare'] == 'PICAT' for r in rez)}"
          f" · neconcludente {len(neconcludente)} · {durata} s · situl {RAD.as_posix()}")
    print("pe poartă (n = probleme): " + ", ".join(f"{k}={'NECONCLUDENT' if v is None else v}" for k, v in pe_poarta.items())
          + (f" · suma {total}" if total >= 0 else f" · NECONCLUDENT ({', '.join(neconcludente)}): ieșirea e -1"))
    det = IESIRE / "porti.json"
    det.write_text(json.dumps(curat_tot({"situl": str(RAD), "durata_s": durata, "total": total, "pe_poarta": pe_poarta,
                                         "neconcludente": neconcludente, "picate": picate, "porti": rez, "info": info,
                                         "generat": time.strftime("%Y-%m-%d %H:%M:%S")}), ensure_ascii=False, indent=1), encoding="utf-8")
    print(curat(str(det)))
    print(total)
    return 2 if total < 0 else (0 if total == 0 else 1)


if __name__ == "__main__":
    sys.exit(main())
