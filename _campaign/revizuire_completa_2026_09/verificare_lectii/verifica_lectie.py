#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""verifica_lectie.py — LINIA DE VERIFICARE pe o lecție LearningHub nouă (un nivel pe pași, pe motorul jocurilor).

    python verifica_lectie.py <cale index.html> [--fara-t1] [--model haiku|sonnet] [--paralel 4] [--iesire <dosar>]

Leagă uneltele existente, în ordine, și scrie totul în verificare_lectii/<clasa>-<folder>/ (sau în --iesire):
  S0  poarta motorului: jocuri/_motor/test_joc.py --dir <dosarul clasei> <folderul lecției>
  S1  identitate exercițiu–verificare: nicio întrebare din `qs` identică (text + variante/răspuns, după
      normalizare: fără etichete HTML, spații, majuscule) cu un `incearca`/`inca`/atelier. test_joc compară
      JSON-ul brut (prinde doar copia exactă); rezultatul lui e citit și inclus aici.
  S2  practică (regula 5): felul fiecărui exercițiu pe CONȚINUT (_extrage.fel_practica): execuție = simulator;
      recunoaștere = răspunsul corect e deja scris în pașii de până atunci / în explicațiile de dinainte;
      aplicare = altfel. Blochează sub 50% aplicare+execuție pe „Încearcă” + atelier (litera regulii);
      „Încă un exercițiu” se raportează separat, fără blocaj.
  S3  extragerea în .md (ca faza0/oracol_build.py) + T0 = oracol_novice.py cu un config GENERAT: glosarul din
      programă (conținuturile legate de titlul lecției din plan) + termenii marcați <mark> în pași; termenii
      lecțiilor VIITOARE (programă + definițiile din materialele cursului) trebuie explicați dacă apar;
      „caietul” = clasele anterioare + lecțiile anterioare din unitati.json / Calendar_ore (titluri + conținuturi
      din programă) — NU profil.json scris de autor. Textul alternativ al pozelor nu intră (nu e instrucțiune);
      densitatea nu dă verdict pe un fișier cu sub 10 propoziții (antetul).
  T1  plimbarea (fără --fara-t1): sarcini.json, obiective.json, conceptii-gresite.json și canarul le scrie un
      apel SEPARAT `claude -p` (sonnet) din extragere + programă; profil-cititor.md din plan (ȘTIE / NU ȘTIE).
      Parcurgerea și cele DOUĂ teach-back-uri le scrie scriptul. Apoi tools/plimbare/scripts/ruleaza_plimbare.py
      cu --model (implicit haiku); la -1 reia o dată cu alt seed. Numărul liniei (nu al kitului) nu numără:
      parcurgerile căzute doar pe simulator/laborator, blocajele citate doar din antet/„La ce folosește”, blocajele
      pe propoziția care introduce termenul (îngroșat) într-o sarcină FACUT, un obiectiv LIPSA la un singur cititor;
      blocajele din aceeași propoziție se numără o dată. Toate rămân în raport ca avertismente.
Amprenta paginii (sha256) se ia la început și la sfârșit: dacă pagina s-a schimbat în timpul rulării, raportul e
ÎNVECHIT și ultima linie e -1 (nu un număr de probleme).
Raport: raport.md + raport.json. Ultimele trei linii pline; ultima = DOAR numărul problemelor care blochează
publicarea (S0 FAIL, S1 identice, S2 sub 50%, T0 probleme, T1 numărul liniei), sau -1 dacă e ÎNVECHIT.
Aplicația reală (afirmatii.json) și judecătorul NU sunt aici: arbitru_office.py + dirijorul.
"""
from __future__ import annotations

import argparse
import difflib
import hashlib
import html
import json
import os
import random
import re
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

AICI = Path(__file__).resolve().parent
sys.path.insert(0, str(AICI))
import _plan as PL          # noqa: E402
import _extrage as X        # noqa: E402

LH = Path(r"C:/00/Projects/LearningHub")
TEST_JOC = LH / "jocuri" / "_motor" / "test_joc.py"
KIT = Path(r"C:/00/AI_0/tools/plimbare")
ORACOL = KIT / "oracol" / "oracol_novice.py"
PLIMBARE = KIT / "scripts" / "ruleaza_plimbare.py"
sys.path.insert(0, str(KIT / "oracol"))
import valideaza_verdict as VV   # noqa: E402  (doar citire: _incarca_verdict)

ROMAN = {"v": "V", "vi": "VI", "vii": "VII", "viii": "VIII"}
PRAGURI = {"cuvinte_pe_propozitie": 22, "propozitie_lunga": 25, "procent_propozitii_lungi": 0.30,
           "cuvinte_pe_paragraf": 150, "min_cuvinte_pagina": 30}
MOMELI = ["tabel pivot dinamic", "macrocomandă înregistrată", "recursivitate mutuală", "compilare incrementală",
          "sincronizare prin blockchain"]
ENV_PY = {**os.environ, "PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1"}
MIN_PROPOZITII_DENSITATE = 10     # sub atâtea propoziții, procentele densității nu spun nimic (antetul are 3-6)


def amprenta(p: Path) -> str:
    try:
        return hashlib.sha256(p.read_bytes()).hexdigest()
    except Exception as e:
        return f"eroare: {e}"


def sterge(p: Path) -> None:
    """rmtree care nu oprește rularea. 27.09: un dosar temporar ținut ocupat (WinError 32) a oprit raportul."""
    for _ in range(3):
        try:
            shutil.rmtree(p)
            return
        except FileNotFoundError:
            return
        except OSError:
            time.sleep(1.5)
    shutil.rmtree(p, ignore_errors=True)


def dosar_temp():
    """Dosar temporar gol pentru `claude -p`; la ieșire, curățenia NU aruncă (copilul poate ține un fișier deschis)."""
    return tempfile.TemporaryDirectory(ignore_cleanup_errors=True)


def env_claude() -> dict:
    """Mediul pentru `claude -p` copil: desprins de sesiunea care îl pornește. 27.09: copilul moștenea
    CLAUDE_CODE_MAX_RETRIES=60 și, la 429 (limita de cereri a contului), reîncerca în tăcere 15+ minute."""
    scoase = ("CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_SESSION_ID", "CLAUDE_CODE_CHILD_SESSION",
              "CLAUDE_CODE_MESSAGING_SOCKET", "CLAUDE_CODE_MESSAGING_TOKEN", "CLAUDE_PID", "CLAUDE_CODE_SESSION_ATTENDED",
              "CLAUDE_CODE_RETRY_WATCHDOG")
    env = {k: v for k, v in ENV_PY.items() if k not in scoase}
    env["CLAUDE_CODE_MAX_RETRIES"] = "6"
    return env


def proba_claude(model: str = "haiku") -> tuple[bool, str]:
    """Un apel minim înainte de T1: dacă API-ul refuză (429, lipsă autentificare), nu pornesc nimic și spun de ce."""
    exe = shutil.which("claude") or shutil.which("claude.cmd") or "claude"
    with dosar_temp() as gol:
        rc, out = ruleaza([exe, "-p", "Răspunde doar: ok", "--output-format", "json", "--model", model, "--tools", "",
                           "--no-session-persistence", "--max-budget-usd", "0.5"], timeout=240, env=env_claude(), cwd=gol)
    try:
        d = json.loads(out.split("\n[stderr]\n")[0])
    except Exception:
        d = {}
    # orice rezultat venit de la API dovedește că merge (și „buget depășit”: costul minim variază 0,02-0,10 USD)
    if d.get("type") == "result" and (not d.get("is_error") or str(d.get("subtype", "")).startswith("error_max_budget")):
        return True, f"ok ({d.get('total_cost_usd')} USD)"
    motiv = str(d.get("result") or out)[:300]
    if "429" in motiv or "rate" in motiv.lower() or rc == 124:
        motiv = f"limita de cereri a contului (429) sau API blocat (cod {rc}): {motiv}"
    return False, motiv


def ruleaza(cmd, timeout=900, env=None, stdin=None, cwd=None) -> tuple[int, str]:
    try:
        r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, encoding="utf-8", errors="replace",
                           timeout=timeout, env=env or ENV_PY, input=stdin, cwd=cwd)
        return r.returncode, (r.stdout or "") + (("\n[stderr]\n" + r.stderr) if r.stderr and r.stderr.strip() else "")
    except subprocess.TimeoutExpired as e:
        dec = lambda b: (b.decode("utf-8", "replace") if isinstance(b, bytes) else (b or ""))
        return 124, f"[timeout după {timeout}s]\n{dec(e.stdout)[-2000:]}\n[stderr]\n{dec(e.stderr)[-2000:]}"


def ultima_linie_numar(out: str) -> int | None:
    linii = [l.strip() for l in out.splitlines() if l.strip() and not l.startswith("[stderr]")]
    for l in reversed(linii):
        if re.fullmatch(r"-?\d+", l):
            return int(l)
        break
    return None


def scurt(s: str, n: int = 220) -> str:
    s = re.sub(r"\s+", " ", str(s or "")).strip()
    return s if len(s) <= n else s[: n - 1] + "…"


# ============================================================ S0
def treapta_s0(index: Path, D: Path) -> dict:
    t = time.time()
    rc, out = ruleaza([sys.executable, TEST_JOC, "--dir", index.parent.parent, index.parent.name], timeout=900)
    (D / "s0_test_joc.txt").write_text(out, encoding="utf-8")
    fails = [l.strip()[5:].strip() for l in out.splitlines() if l.strip().startswith("FAIL ")]
    warns = [l.strip()[5:].strip() for l in out.splitlines() if l.strip().startswith("warn ")]
    trecut = "[TRECUT]" in out and rc == 0
    identice = [f for f in fails if "IDENTIC" in f]            # le numără S1 (care le prinde și pe cele normalizate)
    bloc = [f for f in fails if f not in identice]
    if not trecut and not fails:
        bloc = [f"poarta nu a dat TRECUT (cod {rc}); vezi s0_test_joc.txt: {scurt(out, 300)}"]
    return {"treapta": "S0", "nume": "poarta motorului (test_joc.py)", "trecut": trecut, "blocante": bloc,
            "identice_test_joc": identice, "avertismente": [w for w in warns if "niveluri (obișnuit" not in w],
            "avertismente_asteptate": [w for w in warns if "niveluri (obișnuit" in w], "cod": rc,
            "secunde": round(time.time() - t, 1)}


# ============================================================ S1
def _n(s) -> str:
    s = html.unescape(re.sub(r"<[^>]+>", " ", str(s))).replace("\u00a0", " ")
    return re.sub(r"\s+", " ", s).strip().lower().rstrip(" .!?:;")


def _nv(x):
    if isinstance(x, str):
        return _n(x)
    if isinstance(x, list):
        return [_nv(v) for v in x]
    if isinstance(x, dict):
        return {k: _nv(v) for k, v in sorted(x.items()) if k not in ("ajutor", "why", "ce")}
    return x


def cheie_raspuns(q: dict) -> str:
    d = {"t": q.get("t")}
    if isinstance(q.get("o"), list):
        d["o"] = sorted(_n(o) for o in q["o"])
        if isinstance(q.get("ok"), int) and not isinstance(q.get("ok"), bool) and 0 <= q["ok"] < len(q["o"]):
            d["ok"] = _n(q["o"][q["ok"]])
    if isinstance(q.get("ok"), bool):
        d["ok"] = q["ok"]
    for k in ("items", "cats", "ans", "range", "cells", "verifica", "targets", "src", "start"):
        if k in q:
            d[k] = _nv(q[k])
    if isinstance(q.get("pairs"), list):
        d["pairs"] = sorted(json.dumps(_nv(p), ensure_ascii=False) for p in q["pairs"])
    if q.get("t") == "classify" and isinstance(d.get("items"), list):
        d["items"] = sorted(json.dumps(i, ensure_ascii=False) for i in d["items"])
    return json.dumps(d, ensure_ascii=False, sort_keys=True)


def treapta_s1(nivel: dict, s0: dict) -> dict:
    prac = X.practica(nivel)
    identice, aproape = [], []
    for qi, q in enumerate(nivel.get("qs") or [], 1):
        tq, kq = _n(q.get("q", "")), cheie_raspuns(q)
        for loc, e in prac:
            te = _n(e.get("q", "")) or _n(e.get("intro", ""))
            ke = cheie_raspuns(e)
            rap = difflib.SequenceMatcher(None, tq, te).ratio() if tq and te else 0.0
            rec = {"intrebare": f"Î{qi}", "exercitiu": loc, "text_intrebare": scurt(re.sub(r"<[^>]+>", "", q.get("q", "")), 160),
                   "text_exercitiu": scurt(re.sub(r"<[^>]+>", "", e.get("q", "")), 160), "asemanare_text": round(rap, 2)}
            if tq and tq == te and kq == ke:
                rec["de_ce"] = "același text (după normalizare) și același răspuns/aceleași variante"
                identice.append(rec)
            elif (tq and tq == te) or (kq == ke and rap >= 0.85) or (kq == ke and len(kq) > 40 and rap >= 0.6):
                rec["de_ce"] = ("același text, alt răspuns" if tq == te else "același răspuns/aceleași variante, text foarte asemănător")
                aproape.append(rec)
    return {"treapta": "S1", "nume": "identitate exercițiu–verificare", "trecut": not identice,
            "blocante": [f"{r['intrebare']} = {r['exercitiu']}: «{r['text_intrebare']}» ({r['de_ce']})" for r in identice],
            "identice": identice, "aproape_identice": aproape,
            "test_joc_a_prins": s0.get("identice_test_joc", []),
            "nota": "test_joc compară JSON-ul brut (prinde doar copia exactă); S1 compară după normalizare."}


# ============================================================ S2
def treapta_s2(nivel: dict, cfg: dict) -> dict:
    """Regula 5: cel puțin jumătate din „Încearcă” + atelier sunt de aplicare sau execuție. Felul se decide pe
    CONȚINUT (calibrare 27.09: pe tip, orice alegere/ordonare cu un calcul sau o situație nouă ieșea recunoaștere)."""
    prac = dict(X.practica(nivel))
    tipuri_config = set((cfg.get("tipuri") or {}).keys())
    rand = []
    for r in X.fel_practica(nivel):
        e = prac.get(r["loc"]) or {}
        nota = ""
        if r["fel"] == "execuție" and r["tip"] not in tipuri_config:
            nota = "tip necunoscut motorului/configurației"
        if r["fel"] == "execuție" and isinstance(e.get("o"), list) and not (e.get("verifica") or e.get("targets")):
            nota = "simulator, dar răspunsul e o alegere dintre variante"
        if r["fel"] != "execuție" and r["acoperire"] is not None:
            nota = (nota + "; " if nota else "") + f"răspunsul e scris dinainte în proporție de {r['acoperire']:.0%}"
        rand.append({"loc": r["loc"], "tip": r["tip"], "fel": r["fel"], "in_regula5": r["in_regula5"], "nota": nota,
                     "text": scurt(r["text"], 120)})
    r5 = [r for r in rand if r["in_regula5"]]
    n = len(r5)
    ex = sum(1 for r in r5 if r["fel"] != "recunoaștere")
    proc = ex / n if n else 0.0
    n_ext = len(rand)
    ex_ext = sum(1 for r in rand if r["fel"] != "recunoaștere")
    fara = []
    for i, p in enumerate(nivel.get("pasi") or [], 1):
        titlu = X.md(p.get("t", ""))
        if not p.get("incearca") and not re.search(r"la ce folose", titlu, re.I):
            fara.append(f"Pasul {i} „{titlu}” nu are „Încearcă”")
    if n_ext and ex_ext / n_ext < 0.5:
        fara.append(f"cu „Încă un exercițiu” cu tot, aplicare/execuție doar {ex_ext} din {n_ext} ({ex_ext / n_ext:.0%}); "
                    "nu blochează (regula 5 numără „Încearcă” + atelier)")
    pe_tip = {}
    for r in rand:
        pe_tip[r["tip"]] = pe_tip.get(r["tip"], 0) + 1
    trecut = n > 0 and proc >= 0.5
    return {"treapta": "S2", "nume": "practică: aplicare/execuție vs. recunoaștere", "trecut": trecut,
            "blocante": [] if trecut else [f"aplicare/execuție {ex} din {n} ({proc:.0%}) < 50% pe „Încearcă” + atelier"],
            "total": n, "executie": ex, "recunoastere": n - ex, "procent_executie": round(proc, 3),
            "total_extins": n_ext, "executie_extins": ex_ext, "pe_tip": pe_tip,
            "exercitii": rand, "avertismente": fara,
            "nota": "felul pe conținut (regula 5): execuție = simulator; recunoaștere = răspunsul corect e deja scris într-o "
                    "propoziție din pașii de până atunci sau din explicațiile de dinainte; aplicare = altfel. Numărul care "
                    "blochează e pe „Încearcă” + atelier; „Încă un exercițiu” e doar raportat."}


# ============================================================ S3 + T0
_SUF = ["urilor", "ului", "ilor", "elor", "urile", "uri", "ul", "ua", "ea", "ei", "ii", "le", "ă", "a", "e", "i", "u"]


def _stem(w: str) -> str:
    lw = w.lower()
    for s in ("are", "ere", "ire", "âre"):
        if lw.endswith(s) and len(lw) - 3 >= 3:
            return lw[:-3]
    for s in _SUF:
        if lw.endswith(s) and len(lw) - len(s) >= 3:
            return lw[: -len(s)]
    return lw


def forme(termen: str, prudent: bool = False) -> list[str]:
    """Flexiunile unui termen, ca expresie pe care oracol_novice o folosește direct (se termină în \\w{0,3}).
    prudent=True (termenii lecțiilor viitoare): doar forma substantivului (fără ultima vocală + 0-3 litere), ca
    „numărare” să nu prindă „numărul” și „mutare” să nu prindă „muți”."""
    parti = []
    for w in termen.split():
        if len(w) <= 3 or not re.fullmatch(r"[^\W\d_]+(?:-[^\W\d_]+)?", w):
            parti.append(re.escape(w))
        elif prudent:
            st = w[:-1] if len(w) >= 5 and w[-1].lower() in "aăeiu" else w
            parti.append(re.escape(st) + r"\w{0,3}")               # sortar+ea, formul+ele, grafic+ul
        else:
            parti.append(re.escape(_stem(w)) + r"\w{0,2}\w{0,3}")  # select+ează, mut+ată: până la 5 litere
    rx = r"\s+".join(parti)
    return [rx] if rx.endswith(r"\w{0,3}") else []              # oracolul ia forma drept expresie doar așa


def stiute_din_plan(cls: str, nr: int, lectii: list[dict]) -> dict[str, str]:
    """Termenii pe care elevul îi ȘTIE după plan (standardul: „conținutul planului din clasele anterioare” + lecțiile
    anterioare ale clasei): conținuturile programei și definițiile din materialele cursului. {pliat: de unde}.
    Calibrare 27.09 (VIII-4): profilul dădea clasele anterioare doar cu numele unităților, iar „copierea”, „mutarea”,
    predate în V-19, VI-5, VII-5, au ajuns la cititor drept cuvinte străine."""
    un, curric, dom = PL.incarca()
    out: dict[str, str] = {}
    for c in PL.CLASE[:PL.CLASE.index(cls)]:
        for cont in PL.toate_continuturile_clasei(curric, c):
            for t in PL.termeni_din_continut(cont):
                out.setdefault(PL.pliaza(t), f"clasa a {c}-a (programa)")
        for n, ts in PL.definitii_materiale(c).items():
            for t in ts:
                out.setdefault(PL.pliaza(t), f"clasa a {c}-a, lecția {n} (materiale)")
    for l in [x for x in lectii if x["nr"] < nr]:
        for cont in l["continuturi"]:
            for t in PL.termeni_din_continut(cont):
                out.setdefault(PL.pliaza(t), f"lecția {l['nr']}")
    for n, ts in PL.definitii_materiale(cls).items():
        if n < nr:
            for t in ts:
                out.setdefault(PL.pliaza(t), f"lecția {n} (materiale)")
    return out


def cunoscut(t: str, stiute) -> bool:
    """Termenul e deja predat? Comparat pliat și fără articolul hotărât („copierea” = „copiere”)."""
    return PL.pliaza(t) in stiute or PL.pliaza(PL._fara_articol(t)) in stiute


def _fara_alt(text: str, alts: list[str]) -> str:
    """Textul alternativ al pozelor nu e instrucțiune, exercițiu, indiciu sau întrebare (regula 1): în varianta T0
    rămâne doar „[Imagine]”, iar textele alternative se păstrează separat (t0/imagini_alt.txt), nescanate."""
    def _sub(m):
        alts.append(m.group(1))
        return "[Imagine]"
    return re.sub(r"\[Imagine: ([^\]\n]*)\]", _sub, text)


def construieste_t0(D: Path, cls: str, nr: int, lectii: list[dict], cur, nivel: dict, cfg: dict) -> dict:
    T0 = D / "t0"
    if T0.exists():
        sterge(T0)
    T0.mkdir(parents=True, exist_ok=True)
    ordine = []
    ic = PL.CLASE.index(cls)
    un, curric, dom = PL.incarca()
    # clasele anterioare: tot anul, predat
    for k, c in enumerate(PL.CLASE[:ic], 1):
        L = [f"# Clasa a {c}-a — tot anul (predat la clasă)", ""]
        for l in PL.lectiile_clasei(un, curric, dom, c):
            L += [f"## Lecția {l['nr']}: {l['titlu']}", ""]
        for cont in PL.toate_continuturile_clasei(curric, c):
            L += [f"## Programa: {cont}", ""]
        nume = f"0{k}_clasa_{c}.md"
        (T0 / nume).write_text("\n".join(L), encoding="utf-8")
        ordine.append(nume)
    # lecțiile anterioare din clasa lui
    for l in [x for x in lectii if x["nr"] < nr]:
        L = [f"# Lecția {l['nr']} (predată la clasă): {l['titlu']}", ""] + sum(([f"## {c}", ""] for c in l["continuturi"]), [])
        nume = f"1{l['nr']:02d}_lectia_{l['nr']:02d}.md"
        (T0 / nume).write_text("\n".join(L), encoding="utf-8")
        ordine.append(nume)
    alts: list[str] = []
    (T0 / "50_antet.md").write_text(_fara_alt(X.antet_md(cfg, nivel), alts), encoding="utf-8")
    (T0 / "51_lectia.md").write_text(_fara_alt(X.corp_md(cfg, nivel, cu_chei=True), alts), encoding="utf-8")
    (T0 / "imagini_alt.txt").write_text("\n".join(alts) + "\n", encoding="utf-8")   # .txt: oracolul nu-l citește
    ordine += ["50_antet.md", "51_lectia.md"]

    # glosarul
    progr_cls = [PL.pliaza(c) for c in PL.toate_continuturile_clasei(curric, cls)]
    declarate = [PL.virgule_jos(c) for c in nivel.get("continuturi") or [] if PL.pliaza(c) in progr_cls]
    progr_lectie = list(dict.fromkeys((cur["continuturi"] if cur else []) + declarate))
    origine = {}
    for c in progr_lectie:
        for t in PL.termeni_din_continut(c):
            origine.setdefault(t, f"programa lecției: {c}")
    for t in X.termeni_marcati(nivel):
        origine.setdefault(t, "marcat în pași (<mark>)")
    # ce știe elevul: clasele anterioare + lecțiile anterioare (programă + definițiile din materiale)
    anterioare = stiute_din_plan(cls, nr, lectii)
    deja = {PL.pliaza(t) for t in origine}
    # rădăcinile termenilor lecției de azi: un cuvânt singur al unei lecții viitoare cu aceeași rădăcină e tot conceptul
    # de azi (VII-5 predă „selectare”, iar „selecția” venea din lecția 13, „Selecția unor secvențe audio…”)
    rad_azi = set().union(*[PL._tokeni(t) for t in origine]) if origine else set()
    # termenii lecțiilor VIITOARE: prudent, ca să nu blocheze cuvinte obișnuite. Un cuvânt singur intră doar dacă
    # e în titlul lecției viitoare sau în enumerarea din paranteză a programei; sintagmele de 2+ cuvinte intră.
    for l in [x for x in lectii if x["nr"] > nr]:
        tt = PL._tokeni(l["titlu"])
        for c in l["continuturi"]:
            par = PL.termeni_din_paranteze(c)
            for t in PL.termeni_din_continut(c):
                if PL.pliaza(t) in deja or cunoscut(t, anterioare):
                    continue
                if len(t.split()) == 1 and not (PL._tokeni(t) & tt) and t not in par:
                    continue
                if len(t.split()) == 1 and PL._tokeni(t) & rad_azi:
                    continue
                origine[t] = f"lecția viitoare {l['nr']} („{l['titlu']}”)"
                deja.add(PL.pliaza(t))
    # ... și definițiile lecțiilor viitoare din materialele cursului (calibrare 27.09: „aliniere”, „indentare” = VII-6)
    titluri = {l["nr"]: l["titlu"] for l in lectii}
    comune = {PL.pliaza(x) for x in PL.COMUNE} | {PL.pliaza(g) for g in PL.GENERICE}
    for n, ts in sorted(PL.definitii_materiale(cls).items()):
        if n <= nr or n not in titluri:
            continue
        for t in ts:
            if PL.pliaza(t) in deja or cunoscut(t, anterioare) or (len(t.split()) == 1 and PL.pliaza(t) in comune):
                continue
            if len(t.split()) == 1 and PL._tokeni(t) & rad_azi:
                continue
            origine[t] = f"lecția viitoare {n} („{titluri[n]}”; definiție în materialele cursului)"
            deja.add(PL.pliaza(t))
    glosar = {}
    for t, o in origine.items():
        viitor = o.startswith("lecția viitoare")
        spec = {"definit_in": "auto", "forme": forme(t, prudent=viitor)}
        if not viitor:
            spec["exceptii"] = ["50_antet.md"]   # antetul anunță ce vei învăța: nu e folosire
        glosar[t] = spec
    conf = {"_comentariu": "GENERAT de verifica_lectie.py; nu edita de mână (se rescrie la fiecare rulare).",
            "ordine": ordine, "extensii": [".md"], "ignora": [], "glosar": glosar, "nu_stie": [], "prereq": {},
            "stie": [], "prereq_externe": {}, "bloc_prereq": {"verifica": False, "sarcini_t1": 0},
            "exemple": {"limbaje": [], "timeout": 5, "executa": False}, "praguri": PRAGURI,
            "navigatie": {"verifica": False}, "exercitii": {"verifica": False}, "canar": []}
    (T0 / "oracol.config.json").write_text(json.dumps(conf, ensure_ascii=False, indent=1), encoding="utf-8")
    return {"dir": T0, "origine": origine, "programa_lectie": progr_lectie, "declarate": declarate,
            "imagini_alt": len(alts), "stiute": anterioare}


def numar_propozitii(text: str) -> int:
    """Aceeași tăiere ca oracol_novice.verif_densitate (fără titluri, fără marcatori de listă, ≥ 3 cuvinte)."""
    text = re.sub(r"^\s*#{1,6}\s.*$", "", text, flags=re.M)
    text = re.sub(r"^\s*[-*+]\s+", "", text, flags=re.M)
    return len([s for s in re.split(r"(?<=[.!?])\s+|\n{2,}", text) if len(re.findall(r"\w+", s)) >= 3])


def treapta_t0(D: Path, t0: dict) -> dict:
    t = time.time()
    T0 = t0["dir"]
    rc, out = ruleaza([sys.executable, ORACOL, "--sit", T0, "--config", T0 / "oracol.config.json",
                       "--json", T0 / "raport_t0.json", "--fara-executie"], timeout=300)
    (D / "t0_oracol.txt").write_text(out, encoding="utf-8")
    num = ultima_linie_numar(out)
    rap = json.loads((T0 / "raport_t0.json").read_text(encoding="utf-8")) if (T0 / "raport_t0.json").exists() else {}
    probleme, avert = [], []
    for sect in ("termeni", "prereq", "bloc_prereq", "fundaturi", "exemple", "densitate"):
        for p in rap.get(sect) or []:
            termen = p.get("termen") or p.get("concept") or ""
            orig = t0["origine"].get(termen, "")
            rec = {"sectiune": sect, "tip": p.get("tip"), "termen": termen, "origine_termen": orig,
                   "fisier": p.get("fisier"), "detaliu": p.get("detaliu")}
            if sect == "densitate" and p.get("fisier") and (T0 / p["fisier"]).exists():
                np_ = numar_propozitii((T0 / p["fisier"]).read_text(encoding="utf-8"))
                if np_ < MIN_PROPOZITII_DENSITATE:     # calibrare 27.09: „67% peste 25 de cuvinte” = 2 propoziții din 3
                    avert.append(f"densitate fără verdict @ {p['fisier']}: doar {np_} propoziții (< {MIN_PROPOZITII_DENSITATE}); "
                                 f"oracolul spunea: {scurt(p.get('detaliu'), 160)}")
                    continue
            probleme.append(rec)
    bloc = [f"[{p['tip']}] {p['termen'] + ' — ' if p['termen'] else ''}{scurt(p['detaliu'], 260)}"
            + (f" (termenul vine din: {p['origine_termen']})" if p['origine_termen'] else "") for p in probleme]
    if num is not None and num >= 0:
        num = len(probleme)                      # numărul oracolului, fără densitatea scoasă mai sus
    else:
        bloc = bloc or [f"oracolul nu a dat un număr (cod {rc}); vezi t0_oracol.txt"]
    return {"treapta": "T0", "nume": "oracol_novice (determinist)", "trecut": num == 0, "numar": num,
            "blocante": bloc if (num or 0) != 0 or num is None else [], "probleme": probleme, "avertismente": avert,
            "numar_oracol": ultima_linie_numar(out), "imagini_alt_scoase": t0.get("imagini_alt", 0),
            "glosar": t0["origine"], "programa_lectie": t0["programa_lectie"], "secunde": round(time.time() - t, 1)}


# ============================================================ T1
SCHEMA_GEN = {
    "type": "object", "additionalProperties": False,
    "required": ["sarcini", "obiective", "conceptii_gresite", "canar"],
    "properties": {
        "sarcini": {"type": "array", "minItems": 6, "maxItems": 10, "items": {
            "type": "object", "additionalProperties": False, "required": ["tip", "tinta", "fel", "text"],
            "properties": {"tip": {"type": "string", "enum": ["walkthrough", "exercitiu", "intrebare", "teachback"]},
                           "tinta": {"type": "string"},
                           "fel": {"type": "string", "enum": ["aplicare", "recunoastere", "parcurgere", "explicare"]},
                           "text": {"type": "string"}}}},
        "obiective": {"type": "array", "minItems": 3, "maxItems": 6, "items": {
            "type": "object", "additionalProperties": False, "required": ["text", "fel"],
            "properties": {"text": {"type": "string"},
                           "fel": {"type": "string", "enum": ["spune", "performanta", "in_afara_lectiei"]}}}},
        "conceptii_gresite": {"type": "array", "minItems": 3, "maxItems": 5, "items": {
            "type": "object", "additionalProperties": False, "required": ["conceptie", "corect"],
            "properties": {"conceptie": {"type": "string"}, "corect": {"type": "string"}}}},
        "canar": {"type": "object", "additionalProperties": False,
                  "required": ["original", "inlocuit", "intrebare", "raspuns_pagina_regex", "raspuns_lume_regex"],
                  "properties": {k: {"type": "string"} for k in
                                 ("original", "inlocuit", "intrebare", "raspuns_pagina_regex", "raspuns_lume_regex")}},
    },
}


def profil_cititor(cls: str, nr: int, cur: dict, lectii: list[dict], origine: dict, cfg: dict) -> str:
    un, curric, dom = PL.incarca()
    ic = PL.CLASE.index(cls)
    L = ["# Profilul cititorului-țintă", "",
         f"Cine citește: un elev de clasa a {cls}-a, la lecția {nr} din planul anului"
         + (f" („{cur['titlu']}”)." if cur else ".")
         + " Are deschisă doar pagina lecției (index.md). Nu are pe cine întreba și nu caută pe internet."
         + (f" {cfg.get('diploma', {}).get('aplicatie', 'Aplicația adevărată')} o deschide doar la partea „Acum în aplicația adevărată”."
            if (cfg.get("diploma") or {}).get("provocare") else ""),
         "", "## ȘTIE (s-a predat la clasă; din planul anului, nu din lecție)",
         "- să citească, să miște mouse-ul și să facă clic, să tasteze litere și cifre"]
    # calibrare 27.09 (VIII-4): clasele anterioare cu LECȚIILE și conținuturile programei, nu doar numele unităților
    for c in PL.CLASE[:ic]:
        lec = [l["titlu"] for l in PL.lectiile_clasei(un, curric, dom, c)
               if not re.search(r"deschiderea|recapitul|evaluare|ce facem anul", l["titlu"], re.I)]
        L.append(f"- din clasa a {c}-a, lecțiile: " + "; ".join(lec))
        L.append(f"- din clasa a {c}-a, programa: " + "; ".join(PL.toate_continuturile_clasei(curric, c)))
    for l in [x for x in lectii if x["nr"] < nr]:
        L.append(f"- lecția {l['nr']}: {l['titlu']}" + (f" (programa: {'; '.join(l['continuturi'])})" if l["continuturi"] else ""))
    stiute = stiute_din_plan(cls, nr, lectii)
    # cuvintele predate deja, spuse pe nume: „copiere”, „mutare” la a VIII-a nu mai sunt cuvinte străine
    termeni_stiuti = sorted({t for t, o in origine.items() if cunoscut(t, stiute)})
    if termeni_stiuti:
        L.append("- cuvinte pe care le știi deja din anii sau lecțiile trecute (lecția le poate folosi fără să le explice): "
                 + ", ".join(termeni_stiuti))
    L += ["", "## NU ȘTIE (tratezi cuvintele ca pe cuvinte străine până le explică textul lecției)"]
    # ce s-a predat deja (clasele și lecțiile anterioare, chiar dacă lecția declară și ea conținutul) NU intră la NU ȘTIE
    lectie = [t for t, o in origine.items() if not o.startswith("lecția viitoare") and not cunoscut(t, stiute)]
    # calibrare 27.09 (copia cu „aliniere”/„indentare”): o listă de ~40 de termeni din tot anul îi îneca pe cei ai
    # lecțiilor apropiate; cititorul primește doar vocabularul următoarelor 6 lecții (T0 verifică oricum tot glosarul)
    urm = [x for x in lectii if x["nr"] > nr][:6]
    nr_urm = {x["nr"] for x in urm}
    viitor = [t for t, o in origine.items() if o.startswith("lecția viitoare")
              and (m := re.match(r"lecția viitoare (\d+)", o)) and int(m.group(1)) in nr_urm]
    if lectie:
        L.append("- ce predă lecția asta: " + ", ".join(lectie))
    for l in urm:
        L.append(f"- lecția {l['nr']} (urmează): {l['titlu']}")
    if viitor:
        L.append("- cuvintele lecțiilor care urmează (dacă le întâlnești în lecția de azi fără explicație, e un BLOCAJ): "
                 + ", ".join(viitor))
    L += ["- orice tastă, buton, meniu sau semn pe care nu l-ai întâlnit mai sus (în ȘTIE)", "",
          "## CUM SE POARTĂ",
          "- citește pagina în ordine, de sus în jos; nu sare la verificare",
          "- dacă un cuvânt, o tastă sau un buton nu e explicat înainte să i se ceară, se oprește și se blochează (nu ghicește)",
          "- face EXACT ce scrie, literal; dacă instrucțiunea nu spune unde, ce exact sau cu ce confirmă, nu completează din capul lui",
          "- dacă două locuri spun lucruri diferite despre același gest, observă și spune",
          "- nu are altă sursă decât această pagină", ""]
    return "\n".join(L)


def locuri_simulator(nivel: dict, cfg: dict) -> dict:
    """Unde lucrează elevul în simulator (tip necunoscut motorului) sau în aplicația adevărată: acolo cititorul cu carte
    închisă nu poate atinge nimic. Numerotarea pașilor = cea din index.md (## Pasul i, de la 1)."""
    pasi = set()
    for i, p in enumerate(nivel.get("pasi") or [], 1):
        exs = ([p["incearca"]] if p.get("incearca") else []) + list(p.get("inca") or [])
        if any(isinstance(e, dict) and e.get("t") not in X.BUILTIN for e in exs):
            pasi.add(i)
    at = nivel.get("atelier")
    return {"pasi": pasi, "atelier": bool(at) and at.get("t") not in X.BUILTIN,
            "intrebari": {m for m, q in enumerate(nivel.get("qs") or [], 1) if isinstance(q, dict) and q.get("t") not in X.BUILTIN},
            "real": bool((cfg.get("diploma") or {}).get("provocare"))}


def e_loc_simulator(eticheta: str, loc: dict) -> bool:
    e = VV._norm(eticheta or "")
    if re.search(r"aplicatia adevarata|aplicatia reala|aplicatie reala|provocare|laborator|(word|excel|powerpoint)-ul adevarat", e):
        return loc["real"]
    m = re.search(r"intrebarea\s*(\d+)", e)
    if m:
        return int(m.group(1)) in loc["intrebari"]
    if re.search(r"\batelier", e):
        return loc["atelier"]
    m = re.search(r"pasul\s*(\d+)", e)
    return bool(m) and int(m.group(1)) in loc["pasi"]


RE_GEST = re.compile(r"\b(ape[sș]i|apas[ăa]|dai clic|d[ăa] clic|faci clic|f[ăa] clic|tastezi|tasteaz[ăa]|atingi|atinge|"
                     r"selectezi|selecteaz[ăa]|tragi|trage)\b", re.I)


def pasi_cu_actiune(nivel: dict, cfg: dict) -> list[str]:
    """Pașii cu acțiune, din CONFIGURAȚIE (calibrare 27.09: generatorul punea și pași de numărat, fără gest):
    pasul are un exercițiu în simulator sau o listă de instrucțiuni (<ol>) cu un gest; plus atelierul și provocarea."""
    loc = locuri_simulator(nivel, cfg)
    out = []
    for i, p in enumerate(nivel.get("pasi") or [], 1):
        titlu = X.md(p.get("t", ""))
        if re.search(r"la ce folose", titlu, re.I):
            continue
        liste = " ".join(re.findall(r"(?is)<ol\b.*?</ol>", str(p.get("text") or "")))
        if i in loc["pasi"] or RE_GEST.search(re.sub(r"<[^>]+>", " ", liste)):
            out.append(f"Pasul {i} („{titlu}”)")
    if nivel.get("atelier"):
        out.append("Atelierul")
    if loc["real"]:
        out.append("Acum în aplicația adevărată")
    return out


def genereaza(D: Path, cls: str, nr: int, cur: dict | None, lectii: list[dict], lectia_md: str, model: str,
              viitoare: list[str] | None = None, actiune: list[str] | None = None) -> dict:
    """Apelul separat `claude -p` care scrie sarcinile, obiectivele, concepțiile greșite și canarul."""
    G = D / "t1" / "generator"
    G.mkdir(parents=True, exist_ok=True)
    un, curric, dom = PL.incarca()
    comp = []
    for c in PL.CLASE:
        if c != cls:
            continue
        cs_unit = set(cur["cs"]) if cur else set()
        for cs in curric[c]["competente_specifice"]:
            if cs["cod"] in cs_unit:
                comp.append(f"- {cs['cod']}: {cs['titlu']}")
    ant = [f"- lecția {l['nr']}: {l['titlu']}" for l in lectii if l["nr"] < nr] or ["- (nimic din clasa asta; e prima lecție)"]
    tpl = (AICI / "prompt_generator.md").read_text(encoding="utf-8")
    prompt = (tpl.replace("{clasa}", cls).replace("{nr}", str(nr)).replace("{titlu}", cur["titlu"] if cur else "?")
              .replace("{modul}", str((cur or {}).get("modul"))).replace("{unitate}", f"{(cur or {}).get('unitate')} {(cur or {}).get('unitate_titlu', '')}")
              .replace("{continuturi}", "\n".join(f"- {c}" for c in (cur or {}).get("continuturi", [])) or "- (fără conținut legat în programă)")
              .replace("{competente}", "\n".join(comp) or "- (nespecificate)")
              .replace("{anterioare}", "\n".join(ant))
              .replace("{viitoare}", ", ".join(viitoare or []) or "(nimic listat)")
              .replace("{pasi_actiune}", "; ".join(actiune or []) or "(niciunul)")
              .replace("{lectia}", lectia_md))
    (G / "prompt.md").write_text(prompt, encoding="utf-8")
    cmd = ["claude", "-p", "Instrucțiunile și materialul sunt în intrarea standard. Răspunde DOAR cu obiectul JSON cerut de schemă.",
           "--output-format", "json", "--json-schema", json.dumps(SCHEMA_GEN, ensure_ascii=False),
           "--model", model, "--tools", "", "--restricted", "--no-session-persistence", "--max-budget-usd", "1.5"]
    exe = shutil.which("claude") or shutil.which("claude.cmd") or "claude"
    cmd[0] = exe
    t = time.time()
    incercari, obj, cost, rc = [], None, 0.0, None
    for k in (1, 2):                      # 27.09: o rulare a stat 900 s fără răspuns (alta: 118 s) -> plafon + o reluare
        with dosar_temp() as gol:
            t_i = time.time()
            rc, out = ruleaza(cmd, timeout=480, env=env_claude(), stdin=prompt, cwd=gol)
        (G / f"raspuns_brut_{k}.json").write_text(out, encoding="utf-8")
        try:
            d = json.loads(out.split("\n[stderr]\n")[0])
        except Exception:
            d = {}
        cost += float(d.get("total_cost_usd") or 0)
        obj = d.get("structured_output") if isinstance(d.get("structured_output"), dict) else None
        if obj is None and isinstance(d.get("result"), str):
            m = re.search(r"\{.*\}", d["result"], re.S)
            try:
                obj = json.loads(m.group(0)) if m else None
            except Exception:
                obj = None
        incercari.append({"incercare": k, "cod": rc, "secunde": round(time.time() - t_i, 1), "json_valid": obj is not None})
        if obj:
            shutil.copyfile(G / f"raspuns_brut_{k}.json", G / "raspuns_brut.json")
            break
    return {"obj": obj, "cod": rc, "cost_usd": round(cost, 4), "secunde": round(time.time() - t, 1), "incercari": incercari,
            "eroare": None if obj else f"generatorul nu a întors JSON valid în {len(incercari)} încercări (ultimul cod {rc}); "
                                       f"vezi t1/generator/raspuns_brut_*.json"}


def valideaza_canar(c: dict, text: str) -> tuple[dict | None, str]:
    if not c:
        return None, "lipsă"
    orig, inl = c.get("original", ""), c.get("inlocuit", "")
    if len(orig) < 25 or orig == inl:
        return None, "original prea scurt sau identic cu înlocuirea"
    n = text.count(orig)
    if n != 1:
        # generatorul a pierdut spații/ghilimele: caut bucata cu spațiile normalizate
        rx = re.escape(re.sub(r"\s+", " ", orig).strip()).replace(r"\ ", r"\s+")
        gasite = [m.group(0) for m in re.finditer(rx, text)]
        if len(gasite) != 1:
            return None, f"«original» apare de {n} ori în index.md (trebuie exact o dată)"
        orig = gasite[0]
    try:
        rp, rl = re.compile(c["raspuns_pagina_regex"], re.I | re.U), re.compile(c["raspuns_lume_regex"], re.I | re.U)
    except re.error as e:
        return None, f"regex invalid: {e}"
    if not rp.search(inl) or rp.search(orig):
        return None, "raspuns_pagina_regex nu deosebește textul schimbat de cel original"
    if not rl.search(orig) or rl.search(inl):
        return None, "raspuns_lume_regex nu deosebește textul original de cel schimbat"
    return {"id": "CANAR-1", "fisier": "index.md", "original": orig, "inlocuit": inl, "intrebare": c["intrebare"],
            "raspuns_pagina_regex": c["raspuns_pagina_regex"], "raspuns_lume_regex": c["raspuns_lume_regex"]}, "ok"


def cost_dosar(p: Path) -> float:
    tot = 0.0
    for f in p.glob("*.json"):
        if f.name.startswith("_"):
            continue
        try:
            d = json.loads(f.read_text(encoding="utf-8-sig"))
            tot += float(d.get("total_cost_usd") or 0)
        except Exception:
            pass
    return tot


def treapta_t1(D: Path, cls: str, nr: int, cur, lectii, origine: dict, cfg: dict, nivel: dict, a) -> dict:
    t = time.time()
    T1 = D / "t1"
    if a.refa_raport:
        return _t1_refolosit(T1, cfg, nivel, a, origine)
    ok, motiv = proba_claude(a.model)
    if not ok:                                   # nu șterg rularea T1 anterioară și nu cheltui nimic
        return {"treapta": "T1", "nume": "plimbarea", "trecut": False, "numar": None, "cost_usd": 0.0, "rulari": [],
                "blocante": [f"T1 NERULAT: `claude -p` nu răspunde acum — {scurt(motiv, 200)}. Reia mai târziu (sau --fara-t1)."],
                "secunde": round(time.time() - t, 1)}
    if T1.exists():                              # păstrez ultima rulare: o rulare picată nu mai șterge una bună
        vechi = D / "t1_anterior"
        if vechi.exists():
            sterge(vechi)
        try:
            T1.rename(vechi if not vechi.exists() else D / f"t1_anterior_{time.strftime('%H%M%S')}")
        except OSError:                          # dosar ținut ocupat: nu opresc rularea, îl pun deoparte cu alt nume
            sterge(T1)
    SIT = T1 / "sit"
    (SIT / "plimbare").mkdir(parents=True, exist_ok=True)
    lectia_md = X.antet_md(cfg, nivel) + "\n" + X.corp_md(cfg, nivel, cu_chei=False)
    (SIT / "index.md").write_text(lectia_md, encoding="utf-8")
    rez = {"treapta": "T1", "nume": f"plimbarea (cititori cu carte închisă, {a.model})", "trecut": False, "blocante": [],
           "cost_usd": 0.0, "rulari": []}
    viitoare = [t for t, o in origine.items() if o.startswith("lecția viitoare")]
    actiune = pasi_cu_actiune(nivel, cfg)
    g = genereaza(D, cls, nr, cur, lectii, lectia_md, a.model_generator, viitoare=viitoare, actiune=actiune)
    rez["generator"] = {k: v for k, v in g.items() if k != "obj"}
    rez["cost_usd"] += float(g.get("cost_usd") or 0)
    obj = g["obj"]
    if not obj:
        rez["blocante"] = [g["eroare"]]
        rez["numar"] = None
        rez["secunde"] = round(time.time() - t, 1)
        return rez
    avert = []
    # obiectivele: doar cele „de spus” se notează din teach-back; performanța și ce nu ține de lecție -> note
    ob_brut = obj.get("obiective") or []
    ob_spune = [o["text"] if isinstance(o, dict) else str(o) for o in ob_brut
                if not isinstance(o, dict) or o.get("fel", "spune") == "spune"]
    ob_perf = [o["text"] for o in ob_brut if isinstance(o, dict) and o.get("fel") == "performanta"]
    ob_afara = [o["text"] for o in ob_brut if isinstance(o, dict) and o.get("fel") == "in_afara_lectiei"]
    if ob_perf:
        avert.append("obiective de PERFORMANȚĂ (nu se notează din teach-back; le verifică exercițiile/atelierul (S) și "
                     "aplicația reală (R)): " + " | ".join(scurt(x, 120) for x in ob_perf))
    if ob_afara:
        avert.append("obiective din programă pe care lecția de azi NU le predă (de verificat în plan, nu blochează): "
                     + " | ".join(scurt(x, 120) for x in ob_afara))
    if not ob_spune:
        avert.append("niciun obiectiv „de spus”: teach-back-ul nu se notează")
    # parcurgerea și teach-back-ul le scrie SCRIPTUL (calibrare 27.09): cititorul nu poate atinge simulatorul, iar
    # un teach-back de 8 propoziții nu încape pe 5 obiective; două teach-back-uri = doi cititori pentru un LIPSA
    loc = locuri_simulator(nivel, cfg)
    sim = ([f"Pasul {i}" for i in sorted(loc["pasi"])] + (["Atelierul"] if loc["atelier"] else [])
           + [f"Întrebarea {m}" for m in sorted(loc["intrebari"])] + (["Acum în aplicația adevărată"] if loc["real"] else []))
    n_prop = max(8, len(ob_spune) + 3)
    txt_walk = ("Parcurge lecția de la început, ca un elev, pas cu pas (de la Pasul 1 până la Verificare), fără să sari nimic. "
                "Pentru fiecare pas, în `pasi`, răspunde: știi ce să încerci la acest pas? observi acțiunea pe care lecția o "
                "descrie? înțelegi efectul ei? Folosește DOAR ce scrie în lecție."
                + (f" Atenție: {', '.join(sim)} se fac în aplicația simulată din pagină sau în aplicația adevărată, pe care tu "
                   "nu le poți atinge. Acolo contează doar două lucruri: știi ce să încerci? înțelegi efectul promis? Faptul că "
                   "nu poți apăsa NU e un motiv de NEFACUT." if sim else "")
                + " Dă NEFACUT doar dacă la un pas nu știi ce să încerci sau nu înțelegi efectul; numește pasul și citează locul."
                + " Citește fiecare cerință și fiecare exercițiu cuvânt cu cuvânt: orice cuvânt de specialitate pe care profilul "
                  "tău îl pune la NU ȘTIE (mai ales cuvintele lecțiilor care urmează) și pe care lecția nu l-a explicat înainte "
                  "trece-l la `blocaje`, cu citatul propoziției, chiar dacă poți merge mai departe.")
    txt_tb = (f"Explică-i unui coleg, în cel mult {n_prop} propoziții, ce ai învățat din lecție — DOAR cu ce scrie în ea, "
              "cu câte un citat pentru fiecare idee. Pune explicația în `raspuns`.")
    nota_sim = (" Dacă partea asta se face în aplicația simulată din pagină sau în aplicația adevărată, pe care tu nu le poți "
                "atinge: contează doar dacă știi ce să încerci și dacă înțelegi efectul promis; faptul că nu poți apăsa NU e "
                "un motiv de NEFACUT.")
    sarcini = []
    for s in obj.get("sarcini") or []:
        if s["tip"] == "teachback":
            continue
        # parcurgerea întregii lecții o scrie scriptul; o parcurgere pe UN pas (atelier, provocare) rămâne sarcină
        # (27.09: generatorul a dat pașii cu acțiune ca `walkthrough`, iar filtrul vechi i-a scos pe toți)
        if s["tip"] == "walkthrough" and not re.search(r"pasul\s*\d|atelier|aplica[tț]ia|provocare|verificare",
                                                       VV._norm(s.get("tinta", ""))):
            continue
        text = f"[{s['tinta']}] {s['text']}"
        if s["tip"] == "walkthrough" or e_loc_simulator(s.get("tinta", ""), loc):
            text += nota_sim
        sarcini.append({"id": f"S-{len(sarcini) + 1}", "tip": s["tip"], "text": text, "tinta": s["tinta"], "fel": s["fel"]})
    sarcini.append({"id": f"S-{len(sarcini) + 1}", "tip": "walkthrough", "tinta": "toată lecția", "fel": "parcurgere",
                    "text": f"[toată lecția] {txt_walk}"})
    for k in (1, 2):
        sarcini.append({"id": f"S-TB{k}", "tip": "teachback", "lectie": "index.md", "tinta": "toată lecția",
                        "fel": "explicare", "text": f"[toată lecția] {txt_tb}"})
    ex = [s for s in sarcini if s["tip"] in ("exercitiu", "intrebare")]
    apl = sum(1 for s in ex if s["fel"] == "aplicare")
    if ex and apl / len(ex) < 0.5:
        avert.append(f"sarcinile generate au doar {apl}/{len(ex)} de aplicare (cerut: cel puțin jumătate)")
    obiective = {"index.md": ob_spune}
    conceptii = [{"id": f"CG-{k}", **c} for k, c in enumerate(obj.get("conceptii_gresite") or [], 1)]
    canar, motiv = valideaza_canar(obj.get("canar") or {}, lectia_md)
    if not canar:
        avert.append(f"canarul propus a fost respins ({motiv}); rularea are doar momeala")
    mom_text = next((m for m in MOMELI if VV._norm(m) not in VV._norm(lectia_md)), MOMELI[-1])
    conf = {"_comentariu": "GENERAT de verifica_lectie.py (sarcini, obiective, canar: apel separat claude -p).",
            "ordine": ["index.md"], "extensii": [".md"], "ignora": ["plimbare"],
            "profil": "plimbare/profil-cititor.md", "sarcini": "plimbare/sarcini.json", "obiective": "plimbare/obiective.json",
            "bloc_prereq": {"verifica": False, "sarcini_t1": 0}, "canar": [canar] if canar else [],
            "momeala": {"id": "MOMEALA-1", "text": mom_text,
                        "intrebare": f"Găsește în lecție partea despre „{mom_text}” și citează primul ei rând."}}
    (SIT / "oracol.config.json").write_text(json.dumps(conf, ensure_ascii=False, indent=1), encoding="utf-8")
    (SIT / "plimbare" / "sarcini.json").write_text(json.dumps(sarcini, ensure_ascii=False, indent=1), encoding="utf-8")
    (SIT / "plimbare" / "obiective.json").write_text(json.dumps(obiective, ensure_ascii=False, indent=1), encoding="utf-8")
    (SIT / "plimbare" / "conceptii-gresite.json").write_text(json.dumps(conceptii, ensure_ascii=False, indent=1), encoding="utf-8")
    (SIT / "plimbare" / "profil-cititor.md").write_text(profil_cititor(cls, nr, cur, lectii, origine, cfg), encoding="utf-8")
    rez.update(sarcini=sarcini, obiective=obiective["index.md"], conceptii=conceptii, canar=canar, momeala=mom_text,
               avertismente=avert)

    numar, out_ok = None, None
    for seed in (a.seed, a.seed + 1):
        OUT = T1 / f"verdicte_seed{seed}"
        rc, out = ruleaza([sys.executable, PLIMBARE, "--sit", SIT, "--model", a.model, "--paralel", a.paralel,
                           "--seed", seed, "--buget", a.buget, "--out", OUT], timeout=3600, env=env_claude())
        (T1 / f"plimbare_seed{seed}.txt").write_text(out, encoding="utf-8")
        n = ultima_linie_numar(out)
        c = cost_dosar(OUT)
        rez["cost_usd"] += c
        rez["rulari"].append({"seed": seed, "numar": n, "cost_usd": round(c, 4), "cod": rc})
        if n is not None and n >= 0:
            numar, out_ok = n, OUT
            break
    rez["numar"] = numar
    if numar is None:
        rez["blocante"] = ["plimbarea a ieșit invalidă (-1) de două ori: verificarea începătorului nu s-a putut face; "
                           "vezi t1/plimbare_seed*.txt"]
        rez["secunde"] = round(time.time() - t, 1)
        return rez
    return _t1_detalii(rez, out_ok, numar, sarcini, lectia_md, cfg, nivel, t,
                       viitoare={x for x, o in origine.items() if o.startswith("lecția viitoare")},
                       confirma=lambda obs: confirma_obiective(T1, SIT, obs, a, lectia_md, rez))


def _citeste_confirmare(T1: Path, obiective: list[str]) -> dict:
    """Rezultatul confirmării (dacă a rulat): {obiectiv normalizat: {"predat": bool, "detaliu": str}}."""
    C = T1 / "confirmare"
    try:
        harta = json.loads((C / "obiective.json").read_text(encoding="utf-8"))
        rj = json.loads((C / "verdicte" / "_rezultat.json").read_text(encoding="utf-8"))
    except Exception:
        return {}
    if not rj.get("valida", False) or (rj.get("numar") is not None and rj["numar"] < 0):
        return {VV._norm(o): {"predat": False, "detaliu": "confirmarea a ieșit invalidă (momeala găsită sau dovezi false)"}
                for o in obiective}
    fin = {r["id"]: r for r in rj.get("rezultate") or []}
    out = {}
    for sid, ob in harta.items():
        r = fin.get(sid) or {}
        v = VV._incarca_verdict(C / "verdicte" / f"{sid}.json") or {}
        cit = next((d.get("citat") for d in v.get("dovezi") or [] if d.get("citat")), "")
        out[VV._norm(ob)] = {"predat": r.get("verdict_final") == "FACUT" and (r.get("dovezi_valide") or 0) > 0,
                             "detaliu": f"{sid} {r.get('verdict_final')}" + (f": «{scurt(cit, 160)}»" if cit else "")}
    return out


def confirma_obiective(T1: Path, SIT: Path, obiective: list[str], a, lectia_md: str, rez: dict) -> dict:
    """Un obiectiv LIPSA la ≥ 2 teach-back-uri poate fi (1) nepredat — defect — sau (2) predat, dar lăsat pe dinafară dintr-o
    explicație scurtă (VII-4, 27.09: regula „alegi obiectul după ce vrei să afle cititorul” e în pasul 2, cu 4 exerciții).
    Un cititor separat caută obiectivul în lecție și îl citează; momeala verifică că nu inventează. FACUT cu citat valid =
    predat -> avertisment; altfel blochează. Costă un cititor pe obiectiv + momeala."""
    C = T1 / "confirmare"
    if C.exists():
        sterge(C)
    S2 = C / "sit"
    (S2 / "plimbare").mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SIT / "index.md", S2 / "index.md")
    if (SIT / "plimbare" / "profil-cititor.md").exists():
        shutil.copyfile(SIT / "plimbare" / "profil-cititor.md", S2 / "plimbare" / "profil-cititor.md")
    harta = {f"OB-{k}": ob for k, ob in enumerate(obiective, 1)}
    sarcini = [{"id": sid, "tip": "intrebare", "tinta": "toată lecția", "fel": "recunoastere",
                "text": ("[toată lecția] Programa cere ca elevul, după lecție, să poată face asta: «" + ob + "». Caută în lecție "
                         "locul (sau locurile) unde se predă exact asta. Spune, cu cuvintele lecției, ce anume predă lecția despre "
                         "asta și citează propozițiile. Dacă lecția NU predă asta (doar pomenește cuvintele, fără să le explice), "
                         "verdictul e NU_GASESC. Nu completa din ce știi tu.")} for sid, ob in harta.items()]
    mom = next((m for m in reversed(MOMELI) if VV._norm(m) not in VV._norm(lectia_md)), MOMELI[0])
    conf = {"_comentariu": "GENERAT de verifica_lectie.py: confirmarea obiectivelor LIPSA la teach-back.",
            "ordine": ["index.md"], "extensii": [".md"], "ignora": ["plimbare"], "profil": "plimbare/profil-cititor.md",
            "sarcini": "plimbare/sarcini.json", "bloc_prereq": {"verifica": False, "sarcini_t1": 0}, "canar": [],
            "momeala": {"id": "MOMEALA-1", "text": mom, "intrebare": f"Găsește în lecție partea despre „{mom}” și citează primul ei rând."}}
    (S2 / "oracol.config.json").write_text(json.dumps(conf, ensure_ascii=False, indent=1), encoding="utf-8")
    (S2 / "plimbare" / "sarcini.json").write_text(json.dumps(sarcini, ensure_ascii=False, indent=1), encoding="utf-8")
    (C / "obiective.json").write_text(json.dumps(harta, ensure_ascii=False, indent=1), encoding="utf-8")
    rc, out = ruleaza([sys.executable, PLIMBARE, "--sit", S2, "--model", a.model, "--paralel", a.paralel, "--seed", a.seed,
                       "--buget", a.buget, "--fara-teachback", "--out", C / "verdicte"], timeout=1800, env=env_claude())
    (C / "plimbare.txt").write_text(out, encoding="utf-8")
    c = cost_dosar(C / "verdicte")
    rez["cost_usd"] = rez.get("cost_usd", 0.0) + c
    rez.setdefault("rulari", []).append({"seed": f"{a.seed} (confirmare obiective)", "numar": ultima_linie_numar(out),
                                        "cost_usd": round(c, 4), "cod": rc})
    return _citeste_confirmare(T1, obiective)


def _t1_refolosit(T1: Path, cfg: dict, nivel: dict, a, origine: dict | None = None) -> dict:
    """--refa-raport: fără apeluri noi; recitește sarcinile generate și ultima rulare VALIDĂ din t1/."""
    t = time.time()
    SIT = T1 / "sit"
    rez = {"treapta": "T1", "nume": f"plimbarea (cititori cu carte închisă; rulare refolosită)", "trecut": False,
           "blocante": [], "cost_usd": 0.0, "rulari": [], "refolosit": True}
    try:
        sarcini = json.loads((SIT / "plimbare" / "sarcini.json").read_text(encoding="utf-8"))
        conf = json.loads((SIT / "oracol.config.json").read_text(encoding="utf-8"))
        lectia_md = (SIT / "index.md").read_text(encoding="utf-8")
    except Exception as e:
        rez.update(blocante=[f"--refa-raport: nu găsesc o rulare T1 anterioară în {T1} ({e})"], numar=None)
        return rez
    gb = T1 / "generator" / "raspuns_brut.json"
    try:
        rez["generator"] = {"cost_usd": json.loads(gb.read_text(encoding="utf-8").split("\n[stderr]\n")[0]).get("total_cost_usd")}
    except Exception:
        rez["generator"] = {"cost_usd": None}
    rez["cost_usd"] += float(rez["generator"].get("cost_usd") or 0)
    rez.update(sarcini=sarcini, obiective=json.loads((SIT / "plimbare" / "obiective.json").read_text(encoding="utf-8")).get("index.md"),
               canar=(conf.get("canar") or [None])[0], momeala=(conf.get("momeala") or {}).get("text"), avertismente=[])
    out_ok, numar = None, None
    for OUT in sorted(T1.glob("verdicte_seed*")):
        c = cost_dosar(OUT)
        rez["cost_usd"] += c
        r = json.loads((OUT / "_rezultat.json").read_text(encoding="utf-8")) if (OUT / "_rezultat.json").exists() else {}
        rez["rulari"].append({"seed": OUT.name.replace("verdicte_seed", ""), "numar": r.get("numar"), "cost_usd": round(c, 4)})
        if isinstance(r.get("numar"), int) and r["numar"] >= 0:
            out_ok = OUT
            # numărul kitului = validatorul + obiectivele LIPSA/GRESIT de la teach-back
            tb = sum(1 for f in OUT.glob("*.grader.json") for o in (VV._incarca_verdict(f) or {}).get("obiective") or []
                     if o.get("stare") in ("LIPSA", "GRESIT"))
            numar = r["numar"] + tb
    if out_ok is None:
        rez.update(blocante=["--refa-raport: nicio rulare T1 validă în t1/"], numar=None)
        return rez
    return _t1_detalii(rez, out_ok, numar, sarcini, lectia_md, cfg, nivel, t,
                       viitoare={x for x, o in (origine or {}).items() if o.startswith("lecția viitoare")},
                       confirma=lambda obs: _citeste_confirmare(T1, obs))


def _t1_detalii(rez: dict, out_ok: Path, numar: int, sarcini: list, lectia_md: str, cfg: dict, nivel: dict, t: float,
                viitoare: set[str] | None = None, confirma=None) -> dict:
    """Numărul LINIEI din rularea kitului (calibrare 27.09, 19 alarme false pe V/VII/VIII nr. 4). Nu se numără, dar
    rămân în raport ca avertismente:
      - o parcurgere NEFACUT ai cărei pași căzuți sunt TOȚI în simulator/laborator, cu „știi ce să încerci” și
        „înțelegi efectul” adevărate (cititorul text nu poate atinge nimic; notă pentru J/R);
      - un blocaj citat doar din antet sau din pasul „La ce folosește” (fără acțiuni, după standard);
      - un blocaj pe propoziția care INTRODUCE termenul (îngroșat acolo, în textul unui pas, nu într-un exercițiu), dacă
        toate sarcinile care l-au semnalat au ieșit FACUT — dar NU pentru vocabularul lecțiilor viitoare (regula 9);
      - un obiectiv LIPSA la un singur cititor (teach-back); LIPSA la ≥ 2 cititori blochează doar dacă un cititor
        separat NU îl găsește predat în lecție, cu citat (confirma_obiective); GRESIT blochează oricum.
    Blocajele din aceeași propoziție se numără o dată."""
    rj = json.loads((out_ok / "_rezultat.json").read_text(encoding="utf-8"))
    by_id = {s["id"]: s for s in sarcini}
    verd = {}
    for f in out_ok.glob("*.json"):
        if f.name.startswith("_") or f.name.endswith(".grader.json"):
            continue
        v = VV._incarca_verdict(f) or {}
        verd[str(v.get("intrebare_id") or f.stem)] = v
    final = {r["id"]: r.get("verdict_final") for r in rj.get("rezultate") or []}
    loc = locuri_simulator(nivel, cfg)
    detalii, bloc = [], []
    av = rez.setdefault("avertismente", [])
    for r in rj.get("rezultate") or []:
        v = verd.get(r["id"], {})
        cit = next((d.get("citat") for d in v.get("dovezi") or [] if d.get("citat")), "")
        s = by_id.get(r["id"], {})
        rec = {"id": r["id"], "tip": r.get("tip"), "tinta": s.get("tinta", "(canar/momeală)" if r["id"] in ("CANAR-1", "MOMEALA-1") else ""),
               "verdict": r.get("verdict_final"), "raspuns": scurt(v.get("raspuns", ""), 400), "citat": scurt(cit, 200),
               "motive": r.get("motive") or []}
        detalii.append(rec)
        if r["id"] in ("CANAR-1", "MOMEALA-1") or r.get("verdict_final") not in ("NEFACUT", "NU_GASESC"):
            continue
        text = f"{r['id']} [{rec['tinta']}] {r['verdict_final']}: {rec['raspuns']}" + (f" — citat: «{rec['citat']}»" if rec["citat"] else "")
        if (s.get("tip") or r.get("tip")) == "walkthrough" and r.get("verdict_final") == "NEFACUT":
            cazuti = [p for p in v.get("pasi") or [] if isinstance(p, dict)
                      and not (p.get("stie_ce_sa_incerce") and p.get("observa_actiunea") and p.get("intelege_efectul"))]
            doar_sim = bool(cazuti) and all(e_loc_simulator(str(p.get("pas", "")), loc) and p.get("stie_ce_sa_incerce")
                                            and p.get("intelege_efectul") for p in cazuti)
            if doar_sim:
                av.append(f"parcurgere căzută DOAR pe simulator/laborator (cititorul știe ce să încerce și înțelege efectul; "
                          f"notă pentru J/R, nu blochează): {'; '.join(scurt(p.get('pas'), 70) for p in cazuti)}")
                rec["nenumarat"] = "simulator/laborator"
                continue
        bloc.append(text)

    # blocajele (termeni folosiți înainte de explicație)
    lectia_n = VV._norm(lectia_md)
    antet_n = VV._norm(X.antet_md(cfg, nivel))
    intro_n = VV._norm("\n".join(X.md(p.get(k) or "") for p in nivel.get("pasi") or []
                                 if re.search(r"la ce folose", X.md(p.get("t", "")), re.I) for k in ("text", "exemplu", "altfel")))
    par_pas = [ln for p in nivel.get("pasi") or [] for k in ("text", "exemplu", "altfel")
               for ln in X.md(p.get(k) or "").split("\n") if ln.strip()]
    viitoare_n = {VV._norm(x) for x in (viitoare or set())}
    kit_bl = rj.get("blocaje") or {}

    def _introdus(cuv: str, citat: str) -> bool:
        cn, qn = VV._norm(cuv), VV._norm(citat)
        if any(cn[:5] == w[:5] or w.startswith(cn[:5]) for w in viitoare_n):
            return False                       # vocabularul lecțiilor viitoare nu are voie să apară (regula 9)
        for par in par_pas:
            if qn and qn in VV._norm(par):
                for m in re.finditer(r"\*\*(.+?)\*\*", par):
                    bn = VV._norm(m.group(1))
                    if bn and (bn[:4] == cn[:4] or cn in bn):
                        return True
        return False

    pe_cuvant: dict[str, list] = {}
    for vid, v in verd.items():
        for x in v.get("blocaje") or []:
            k = VV._norm(x.get("cuvant", ""))
            c = x.get("citat") or ""
            if k in kit_bl and c and VV._norm(c) in lectia_n:
                pe_cuvant.setdefault(k, []).append((vid, final.get(vid), c))
    pe_propozitie: dict[str, dict] = {}
    for k, b in sorted(kit_bl.items()):
        cit = pe_cuvant.get(k) or []
        cuv = b.get("cuvant") or k
        if cit and all(VV._norm(c) in antet_n or VV._norm(c) in intro_n for _, _, c in cit):
            rez.setdefault("blocaje_in_antet", []).append(f"«{cuv}» — «{scurt(cit[0][2], 160)}»")
            continue
        if cit and all(vf == "FACUT" and _introdus(cuv, c) for _, vf, c in cit):
            av.append(f"blocaj «{cuv}» pe propoziția care introduce termenul (îngroșat acolo), sarcina FACUT: "
                      f"introdus fără definiție explicită? — «{scurt(cit[0][2], 160)}»")
            continue
        c0 = next((c for _, _, c in cit if VV._norm(c) not in antet_n and VV._norm(c) not in intro_n), cit[0][2] if cit else "")
        cheie = VV._norm(c0) or f"(fără citat) {k}"
        g = pe_propozitie.setdefault(cheie, {"cuvinte": [], "citat": c0, "aparitii": 0})
        g["cuvinte"].append(cuv)
        g["aparitii"] += int(b.get("aparitii") or 1)
    for g in pe_propozitie.values():
        cuv = ", ".join(f"«{w}»" for w in g["cuvinte"])
        bloc.append(f"blocaj {cuv} (×{g['aparitii']}): termen folosit înainte de explicație — «{scurt(g['citat'], 160)}»"
                    + (" (aceeași propoziție: numărat o dată)" if len(g["cuvinte"]) > 1 else ""))

    # teach-back: un obiectiv LIPSA blochează doar confirmat de ≥ 2 cititori; GRESIT blochează oricum
    tb, stari, lipsa2 = [], {}, []
    graderi = sorted(out_ok.glob("*.grader.json"))
    for f in graderi:
        gdat = VV._incarca_verdict(f) or {}
        for o in gdat.get("obiective") or []:
            tb.append({"sarcina": f.name.split(".")[0], **o})
            e = stari.setdefault(VV._norm(o.get("obiectiv") or ""), {"obiectiv": o.get("obiectiv"), "LIPSA": 0, "GRESIT": 0,
                                                                     "propozitii": []})
            if o.get("stare") in ("LIPSA", "GRESIT"):
                e[o["stare"]] += 1
                if o.get("propozitia"):
                    e["propozitii"].append(o["propozitia"])
    for e in stari.values():
        spus = f" — cititorul a spus: «{scurt(e['propozitii'][0], 140)}»" if e["propozitii"] else ""
        if e["GRESIT"]:
            bloc.append(f"teach-back GRESIT: obiectivul din programă «{scurt(e['obiectiv'], 140)}»{spus}")
        elif e["LIPSA"] >= 2:
            lipsa2.append(e["obiectiv"])
        elif e["LIPSA"] == 1:
            av.append(f"teach-back LIPSA la un singur cititor din {len(graderi)} (neconfirmat, nu blochează): "
                      f"«{scurt(e['obiectiv'], 140)}»")
    if lipsa2:
        try:
            conf = confirma(lipsa2) if confirma else {}
        except Exception as e:                      # confirmarea n-a mers: obiectivul rămâne blocant
            conf = {}
            av.append(f"confirmarea obiectivelor LIPSA a eșuat: {type(e).__name__}: {scurt(str(e), 160)}")
        for ob in lipsa2:
            c = conf.get(VV._norm(ob or "")) or {}
            if c.get("predat"):
                av.append(f"teach-back LIPSA la 2 cititori, dar lecția îl PREDĂ (confirmat de un cititor separat, {c['detaliu']}); "
                          f"poate nu e destul de vizibil — nu blochează: «{scurt(ob, 140)}»")
            else:
                bloc.append(f"teach-back LIPSA la 2 cititori: obiectivul din programă «{scurt(ob, 140)}»"
                            + (f" — confirmarea nu l-a găsit predat ({c['detaliu']})" if c else " — neconfirmat (confirmarea n-a rulat)"))
    detalii.sort(key=lambda d: [int(x) if x.isdigit() else x for x in re.split(r"(\d+)", d["id"])])
    # fără trecere tăcută: un cititor care a crăpat sau n-a adus dovezi iese NESIGUR și nu se numără
    reale = [d for d in detalii if d["id"] not in ("CANAR-1", "MOMEALA-1")]
    nesigure = [d["id"] for d in reale if d["verdict"] == "NESIGUR"]
    lipsa = rj.get("sarcini_fara_verdict") or []
    if nesigure:
        av.append(f"{len(nesigure)} sarcini NESIGUR (fără dovadă validă sau eroare de rulare): {', '.join(nesigure)}")
    if lipsa:
        av.append(f"sarcini fără verdict: {', '.join(lipsa)}")
    if reale and (len(nesigure) + len(lipsa)) * 2 >= len(reale) + len(lipsa):
        bloc.append(f"T1 NECONCLUDENT: {len(nesigure) + len(lipsa)} din {len(reale) + len(lipsa)} sarcini fără verdict dovedit; "
                    "reia plimbarea (alt seed/model) înainte de a crede numărul")
    numar_linie = len(bloc)
    rez.update(detalii=detalii, teachback=tb, contor=rj.get("contor"), valida=rj.get("valida"), numar_kit=numar,
               numar=numar_linie, blocante=bloc, trecut=numar_linie == 0, secunde=round(time.time() - t, 1))
    if numar != numar_linie:
        rez["nota_numar"] = (f"numărul kitului e {numar}; numărul liniei e {numar_linie} (diferența e explicată în "
                             "avertismente și în „blocaje în antet”)"
                             + (f"; blocaje citate doar din antet/„La ce folosește”: {'; '.join(rez['blocaje_in_antet'])}"
                                if rez.get("blocaje_in_antet") else ""))
    return rez


# ============================================================ raport
def scrie_raport(D: Path, meta: dict, trepte: list[dict], total: int) -> None:
    L = [f"# Verificarea lecției {meta['id']}", ""]
    if meta.get("invechit"):
        L += [f"> **ÎNVECHIT, rulează din nou.** Pagina s-a schimbat în timpul rulării ({meta['invechit']}); treptele de mai "
              "jos au lucrat, măcar în parte, pe o versiune care nu mai există. Numărul final nu se dă (ultima linie = -1).", ""]
    L += [f"- lecția: `{meta['index']}`",
         f"- clasa a {meta['clasa']}-a, lecția {meta['nr']} din plan: „{meta['titlu_plan']}” ({meta.get('modul')}, {meta.get('unitate')})",
         f"- nivelul din pagină: „{meta['titlu_nivel']}” · lectii declarate: {meta['lectii_declarate']}",
         f"- rulat: {meta['start']} · durata: {meta['durata_min']} min · cost `claude -p`: {meta['cost_usd']} USD"
         + (f" (generator {meta['cost_generator']} + cititori {meta['cost_cititori']})" if meta.get("cost_generator") is not None else ""),
         "", "## Rezumat", "", "| Treapta | Ce verifică | Rezultat | Blochează |", "|---|---|---|---|"]
    for t in trepte:
        rez = "NERULAT" if t.get("nerulat") else ("TRECUT" if t["trecut"] else "PICAT")
        L.append(f"| {t['treapta']} | {t['nume']} | {rez} | {0 if t.get('nerulat') else t['numar_blocante']} |")
    L += [""]
    for t in trepte:
        L += [f"## {t['treapta']} — {t['nume']}", ""]
        if t.get("nerulat"):
            L += [f"Nerulat: {t['nerulat']}", ""]
            continue
        L.append("**Blochează publicarea:** " + (str(t["numar_blocante"]) if t["numar_blocante"] else "nimic"))
        for b in t["blocante"]:
            L.append(f"- {b}")
        L.append("")
        M, L = L, []                       # o treaptă oprită de o eroare n-are detalii: raportul se scrie oricum
        try:
            if t["treapta"] == "S0":
                if t.get("identice_test_joc"):
                    L += ["Prinse de test_joc ca identice (numărate la S1): " + "; ".join(t["identice_test_joc"]), ""]
                for w in t.get("avertismente") or []:
                    L.append(f"- avertisment: {w}")
                L += [f"- (așteptat) {w}" for w in t.get("avertismente_asteptate") or []] + ["", "Ieșirea completă: `s0_test_joc.txt`.", ""]
            if t["treapta"] == "S1":
                L.append(t["nota"])
                for r in t.get("aproape_identice") or []:
                    L.append(f"- aproape identică (nu blochează; de refăcut ca variantă-soră): {r['intrebare']} ~ {r['exercitiu']} "
                             f"({r['de_ce']}, asemănare {r['asemanare_text']}): «{r['text_intrebare']}» / «{r['text_exercitiu']}»")
                L.append("")
            if t["treapta"] == "S2":
                L += [f"Aplicare/execuție pe „Încearcă” + atelier (regula 5, blochează sub 50%): **{t['executie']} din {t['total']} "
                      f"({t['procent_executie']:.0%})** · cu „Încă un exercițiu” (doar raportat): {t.get('executie_extins')} din "
                      f"{t.get('total_extins')} · pe tipuri: " + ", ".join(f"{k} {v}" for k, v in t["pe_tip"].items()), "",
                      "| Loc | Tip | Fel | Numărat la regula 5 | Notă |", "|---|---|---|---|---|"]
                L += [f"| {r['loc']} | {r['tip']} | {r['fel']} | {'da' if r.get('in_regula5') else 'nu'} | {r['nota']} |"
                      for r in t["exercitii"]]
                L += [""] + [f"- avertisment: {w}" for w in t.get("avertismente") or []] + ["", t["nota"], ""]
            if t["treapta"] == "T0":
                L += [f"- avertisment: {w}" for w in t.get("avertismente") or []]
                if t.get("imagini_alt_scoase"):
                    L.append(f"- {t['imagini_alt_scoase']} texte alternative de poze scoase din verificare (nu sunt instrucțiuni; "
                             "le găsești în `t0/imagini_alt.txt`)")
                L += ["", "Glosarul generat (termen → de unde vine): " + "; ".join(f"{k} ← {v}" for k, v in t["glosar"].items()), "",
                      "Programa legată de lecție: " + (" | ".join(t["programa_lectie"]) or "(nimic)"), "",
                      "Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.", ""]
            if t["treapta"] == "T1" and not t.get("sarcini"):
                L += ["Cititorii nu au rulat; nu există verdicte.", ""]
            elif t["treapta"] == "T1":
                for w in t.get("avertismente") or []:
                    L.append(f"- avertisment: {w}")
                if t.get("nota_numar"):
                    L.append(f"- {t['nota_numar']}")
                if t.get("generator", {}).get("incercari"):
                    L.append("- generator: " + "; ".join(f"încercarea {i['incercare']}: cod {i['cod']}, {i['secunde']} s, "
                                                         f"{'JSON valid' if i['json_valid'] else 'fără JSON'}" for i in t["generator"]["incercari"]))
                L += ["", f"Rulări: " + ("; ".join(f"seed {r['seed']} → {r['numar']} ({r['cost_usd']} USD)" for r in t.get("rulari") or [])
                                         or "niciuna (cititorii nu au pornit)"),
                      f"Canar: {'«' + scurt(t['canar']['original'], 90) + '» → «' + scurt(t['canar']['inlocuit'], 90) + '»' if t.get('canar') else 'fără'} · momeală: «{t.get('momeala')}»",
                      "", "| Sarcină | Țintă | Verdict | Răspuns / motiv |", "|---|---|---|---|"]
                for d in t.get("detalii") or []:
                    L.append(f"| {d['id']} | {d['tinta']} | {d['verdict']} | {scurt(d['raspuns'], 160).replace('|', '/')} |")
                L += ["", "Sarcinile, obiectivele (din programă), concepțiile greșite și profilul: `t1/sit/plimbare/`; verdictele: `t1/verdicte_seed*/`.", ""]
        except Exception as e:
            L = [f"(detaliile treptei {t['treapta']} lipsesc: {type(e).__name__}: {e})", ""]
        L = M + L
    L += ["## Ce NU verifică linia asta", "",
          "- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.",
          "- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.", "",
          "TREPTE: " + " · ".join(f"{t['treapta']} " + ("NERULAT" if t.get("nerulat") else ("TRECUT" if t["trecut"] else f"PICAT {t['numar_blocante']}")) for t in trepte),
          (f"BLOCHEAZĂ PUBLICAREA: necunoscut — ÎNVECHIT, rulează din nou (raport: {D / 'raport.md'})" if meta.get("invechit")
           else f"BLOCHEAZĂ PUBLICAREA: {total} (raport: {D / 'raport.md'})"),
          str(-1 if meta.get("invechit") else total)]
    (D / "raport.md").write_text("\n".join(L) + "\n", encoding="utf-8")


def main(argv=None) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("index", help="calea lecției: .../lectii/<clasa>/m1-lNN/index.html")
    ap.add_argument("--fara-t1", action="store_true", help="fără plimbare (fără cost)")
    ap.add_argument("--model", default="haiku", choices=["haiku", "sonnet", "opus"], help="modelul cititorilor T1")
    ap.add_argument("--model-generator", default="sonnet", choices=["haiku", "sonnet", "opus"])
    ap.add_argument("--paralel", type=int, default=4)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--buget", type=float, default=0.5, help="USD maxim per cititor")
    ap.add_argument("--refa-raport", action="store_true",
                    help="refă S0-T0 și raportul, dar T1 doar RECITIT din rularea anterioară (fără cost; nu vede modificările lecției)")
    ap.add_argument("--iesire", help="dosarul raportului (implicit verificare_lectii/<clasa>-<folder>); pentru copii de probă")
    a = ap.parse_args(argv)

    t_start = time.time()
    index = Path(a.index).resolve()
    if not index.exists():
        print(f"[eroare] nu există {index}")
        print("TREPTE: niciuna rulată")
        print("BLOCHEAZĂ PUBLICAREA: 1 (lecția lipsește)")
        print(1)
        return 1
    folder = index.parent.name
    cls = ROMAN.get(index.parent.parent.name.lower())
    m = re.search(r"l(\d+)", folder)
    nr = int(m.group(1)) if m else None
    D = Path(a.iesire).resolve() if a.iesire else AICI / f"{index.parent.parent.name.lower()}-{folder}"
    D.mkdir(parents=True, exist_ok=True)
    amp_start = amprenta(index)          # calibrare 27.09: pagina V s-a schimbat la 16:53, linia pornise la 16:52
    print(f"Lecția: {index}\nIeșire: {D}")
    if not cls or nr is None:
        print(f"[eroare] nu deduc clasa/numărul din cale (aștept .../<v|vi|vii|viii>/m1-lNN/index.html)")
        print("TREPTE: niciuna rulată")
        print("BLOCHEAZĂ PUBLICAREA: 1 (cale nerecunoscută)")
        print(1)
        return 1

    un, curric, dom = PL.incarca()
    lectii = PL.lectiile_clasei(un, curric, dom, cls)
    cur = next((l for l in lectii if l["nr"] == nr), None)

    # extragerea configurației (o dată, pentru S1/S2/T0/T1)
    cfg, nivel, err_extr = {}, {}, None
    try:
        cfg = X.config_din_pagina(index)
        (D / "config.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=1), encoding="utf-8")
        niv = cfg.get("nivele") or []
        nivel = next((n for n in niv if nr in (n.get("lectii") or [])), niv[0] if niv else {})
        if not nivel:
            err_extr = "configurația nu are niciun nivel"
    except Exception as e:
        err_extr = f"extragerea configurației a eșuat: {str(e).splitlines()[0][:200]}"

    def sigur(tr: str, nume: str, fn, *args):
        """O treaptă care crapă nu mai oprește raportul: devine o problemă care blochează, cu motivul."""
        try:
            return fn(*args)
        except Exception as e:
            return {"treapta": tr, "nume": nume, "trecut": False, "numar": None, "cost_usd": 0.0, "rulari": [],
                    "blocante": [f"{tr} s-a oprit cu o eroare: {type(e).__name__}: {scurt(str(e), 200)}"]}

    trepte = []
    s0 = sigur("S0", "poarta motorului (test_joc.py)", treapta_s0, index, D)
    s0.setdefault("secunde", 0)
    print(f"S0: {'TRECUT' if s0['trecut'] else 'PICAT'} ({s0['secunde']} s)")
    trepte.append(s0)
    if err_extr:
        s0["blocante"].append(err_extr)
        for tr, nume in (("S1", "identitate exercițiu–verificare"), ("S2", "practică"), ("T0", "oracol_novice"), ("T1", "plimbarea")):
            trepte.append({"treapta": tr, "nume": nume, "nerulat": "extragerea configurației a eșuat", "trecut": False, "blocante": []})
    else:
        s1 = sigur("S1", "identitate exercițiu–verificare", treapta_s1, nivel, s0)
        print(f"S1: {len(s1.get('identice') or [])} identice, {len(s1.get('aproape_identice') or [])} aproape identice")
        s2 = sigur("S2", "practică: aplicare/execuție vs. recunoaștere", treapta_s2, nivel, cfg)
        print(f"S2: aplicare/execuție pe Încearcă+atelier {s2.get('executie')}/{s2.get('total')}")
        t0in = sigur("T0", "oracol_novice (determinist)", construieste_t0, D, cls, nr, lectii, cur, nivel, cfg)
        t0 = t0in if "blocante" in t0in else sigur("T0", "oracol_novice (determinist)", treapta_t0, D, t0in)
        print(f"T0: {t0.get('numar')} ({t0.get('secunde')} s)")
        trepte += [s1, s2, t0]
        if a.fara_t1:
            trepte.append({"treapta": "T1", "nume": "plimbarea", "nerulat": "--fara-t1", "trecut": False, "blocante": []})
        else:
            print(f"T1: generez sarcinile ({a.model_generator}), apoi cititorii ({a.model})…", flush=True)
            t1 = sigur("T1", "plimbarea", treapta_t1, D, cls, nr, cur, lectii, (t0in.get("origine") or {}), cfg, nivel, a)
            print(f"T1: {t1.get('numar')} ({t1.get('secunde')} s, {round(t1.get('cost_usd') or 0, 3)} USD)")
            trepte.append(t1)

    for t in trepte:
        if t.get("nerulat"):
            t["numar_blocante"] = 0
        elif t["treapta"] in ("T0", "T1") and isinstance(t.get("numar"), int) and t["numar"] >= 0:
            t["numar_blocante"] = t["numar"]           # numărul oracolului / al kitului (validat)
        else:
            t["numar_blocante"] = len(t["blocante"])
    if err_extr:
        trepte[0]["numar_blocante"] = len(trepte[0]["blocante"])
    total = sum(t["numar_blocante"] for t in trepte)
    t1 = next((t for t in trepte if t["treapta"] == "T1" and not t.get("nerulat")), None)
    meta = {"id": D.name, "index": str(index), "clasa": cls, "nr": nr, "titlu_plan": (cur or {}).get("titlu", "? (nu e în plan)"),
            "modul": (cur or {}).get("modul"), "unitate": (cur or {}).get("unitate"),
            "titlu_nivel": X.md(nivel.get("t", "")) if nivel else "?", "lectii_declarate": nivel.get("lectii") if nivel else None,
            "start": time.strftime("%Y-%m-%d %H:%M", time.localtime(t_start)),
            "durata_min": round((time.time() - t_start) / 60, 1),
            "cost_usd": round(t1["cost_usd"], 3) if t1 else 0.0,
            "cost_generator": round(float((t1 or {}).get("generator", {}).get("cost_usd") or 0), 3) if t1 else None,
            "cost_cititori": round(sum(r["cost_usd"] for r in (t1 or {}).get("rulari", [])), 3) if t1 else None,
            "total_blocante": total}
    amp_final = amprenta(index)
    meta["amprenta"] = {"inceput": amp_start, "sfarsit": amp_final}
    if amp_final != amp_start:
        meta["invechit"] = (f"amprenta index.html la început {amp_start[:12]}…, la sfârșit {amp_final[:12]}…; "
                            f"modificat la {time.strftime('%H:%M:%S', time.localtime(index.stat().st_mtime))}, rularea a pornit la "
                            f"{time.strftime('%H:%M:%S', time.localtime(t_start))}")
    (D / "raport.json").write_text(json.dumps({"meta": meta, "trepte": trepte}, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
    scrie_raport(D, meta, trepte, total)
    print("TREPTE: " + " · ".join(f"{t['treapta']} " + ("NERULAT" if t.get("nerulat") else ("TRECUT" if t["trecut"] else f"PICAT {t['numar_blocante']}")) for t in trepte))
    if meta.get("invechit"):
        print(f"ÎNVECHIT, rulează din nou: pagina s-a schimbat în timpul rulării ({meta['invechit']})")
        print(f"BLOCHEAZĂ PUBLICAREA: necunoscut (raport ÎNVECHIT: {D / 'raport.md'})")
        print(-1)
        return 2
    print(f"BLOCHEAZĂ PUBLICAREA: {total} (raport: {D / 'raport.md'}; durata {meta['durata_min']} min; cost {meta['cost_usd']} USD)")
    print(total)
    return 0 if total == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
