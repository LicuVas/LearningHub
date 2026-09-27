"""Testele mașinii de verificat (nivelul 3): fixturi scrise de mână → verdicte așteptate.

    python _masina/teste/ruleaza_teste.py            # ultimele 3 linii pline; ultima = DOAR numărul de teste picate

Fiecare caz: construiește dosarul (dosar_dumb.py) pe o fixtură, completează un răspuns scris de mână
(teste/raspunsuri/*.json; {{...}} = ce află testul din secret: id-ul sarcinii, numărul-canar, momeala),
rulează valideaza_pas.py și compară verdictul. Plus: testul de scurgere (injectat → dosarul NU se scrie),
măștile (NU ȘTIE, meniul din cealaltă limbă) și proporția canarului pe un lot (≥30%).
La final șterge secretele și registrele create de teste.
"""
import json
import re
import secrets
import shutil
import subprocess
import sys
from pathlib import Path

T = Path(__file__).resolve().parent
M = T.parent
sys.path.insert(0, str(M))
import comun as C  # noqa: E402

PY = sys.executable
IES = T / "_iesire"
LOT = "test_" + secrets.token_hex(3)
creat = []


def dosar(lectie, pas, sarcina, canar="niciunul", profil="profil.json", extra=(), id_=None):
    id_ = id_ or f"test-{lectie}-p{pas}-{sarcina}-{secrets.token_hex(2)}"
    out = IES / id_
    cmd = [PY, str(M / "dosar_dumb.py"), str(T / lectie / "index.html"), "--pas", str(pas), "--profil", str(T / lectie / profil),
           "--sarcina", sarcina, "--canar", canar, "--martor", "0", "--lot", LOT, "--id", id_, "--out", str(out)] + list(extra)
    if "--martor" in extra:
        i = cmd.index("--martor")
        del cmd[i:i + 2]
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    creat.append(id_)
    return id_, out, p


def subst(id_, out, sub):
    s = C.citeste_json(C.cale_secret(id_))
    d = C.citeste_json(out / "dosar.json")
    val = {"DOSAR_ID": id_, "P": s["principal"], "NR": "7"}
    for sid, x in s["sarcini"].items():
        if x["rol"] == "momeala":
            val["M"] = sid
        if x["rol"] == "martor":
            val["MT"] = sid
    if s.get("momeala"):
        val["BUTON"] = s["momeala"]["buton"]
        val["TEXT_MOMEALA"] = next(b["text"] for b in d["blocuri"] if b["id"] == f"{s['momeala']['sarcina']}.SARCINA")
        val["TEXT_MOMEALA_DREPT"] = val["TEXT_MOMEALA"].replace("„", '"').replace("”", '"')
        val["TEXT_MOMEALA_RUPT_BRUT"] = val["TEXT_MOMEALA"].replace("”", '"')  # lipit ca atare: rupe JSON-ul
    c = s.get("canar") or {}
    if c.get("tip") == "numar":
        val.update(NR_VECHI=c["vechi"], NR_NOU=c["nou"], NR=c["nou"])
    for ps, m in (s.get("masca") or {}).items():
        val["PS_" + re.sub(r"\W", "_", m["termen"])] = C.potriveste_forma(ps, m["termen"])
    val.update(sub or {})
    return val


def valideaza(id_, out, raspuns, sub=None, executor=None, val_extra=()):
    val = subst(id_, out, sub)
    txt = (T / "raspunsuri" / raspuns).read_text(encoding="utf-8")
    for k, v in val.items():
        txt = txt.replace("{{" + k + "}}", v if k.endswith("_BRUT") else json.dumps(v, ensure_ascii=False)[1:-1])
    rest = re.findall(r"\{\{\w+\}\}", txt)
    if rest:
        return None, f"înlocuitori necompletați: {rest}"
    (out / "raspuns.json").write_text(txt, encoding="utf-8")
    cmd = [PY, str(M / "valideaza_pas.py"), str(out / "dosar.json"), str(out / "raspuns.json"), "--json"] + list(val_extra)
    if executor == "auto":  # executorul în pagină rulează de-adevăratelea (Chromium, desktop + Pixel 7)
        cmd += ["--executor", "auto"]
    elif executor is not None:
        (out / "executor.json").write_text(json.dumps(executor), encoding="utf-8")
        cmd += ["--executor", str(out / "executor.json")]
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    linii = [x for x in p.stdout.splitlines() if x.strip()]
    js = next((x for x in linii if x.startswith("{")), None)
    if not js or not re.fullmatch(r"\d+", linii[-1]):
        return None, f"ieșire neașteptată: {p.stdout[-400:]} {p.stderr[-400:]}"
    return json.loads(js), ""


rezultate = []


def caz(*args, **kw):
    try:
        _caz(*args, **kw)
    except Exception as e:  # noqa: BLE001 - un caz stricat e un test PICAT, nu o rulare prăbușită
        rezultate.append((False, args[0], f"excepție: {type(e).__name__}: {e}"))


def bloc(nume, fn):
    try:
        fn()
    except Exception as e:  # noqa: BLE001
        rezultate.append((False, nume, f"excepție: {type(e).__name__}: {e}"))


def _caz(nume, lectie, pas, sarcina, raspuns, astept, canar="niciunul", profil="profil.json", extra=(), sub=None,
         executor=None, motiv=None, val_extra=(), verifica=None):
    id_, out, p = dosar(lectie, pas, sarcina, canar, profil, extra)
    if p.returncode != 0:
        rezultate.append((False, nume, f"dosarul nu s-a construit (ieșire {p.returncode}): {p.stdout[-300:]} {p.stderr[-300:]}"))
        return
    rez, err = valideaza(id_, out, raspuns, sub, executor, val_extra)
    if rez is None:
        rezultate.append((False, nume, err))
        return
    ok = rez["verdict"] == astept and (motiv is None or any(motiv in m for m in rez["motive"] + rez["note"])) and \
        (verifica is None or verifica(rez))
    det = f"{rez['verdict']}" + ("" if ok else f" (așteptat {astept}{', motiv: ' + motiv if motiv else ''}) → {rez['motive'][:3]}")
    rezultate.append((ok, nume, det))


def verif(nume, ok, det=""):
    rezultate.append((bool(ok), nume, det))


def main():
    IES.mkdir(parents=True, exist_ok=True)
    # ---------------- lecția curată
    caz("curată p1: răspuns bun", "lectie_curata", 1, "pas", "A_pas1_bun.json", "FĂCUT_NECONFIRMAT")
    caz("curată p1: bun + executorul confirmă", "lectie_curata", 1, "pas", "A_pas1_bun.json", "FĂCUT", executor={"confirmat": True})
    caz("curată p1: executorul: celula rămasă în editare", "lectie_curata", 1, "pas", "A_pas1_bun.json", "NEFĂCUT",
        executor={"confirmat": True, "celula_in_editare": True})
    caz("curată p1: citat inventat", "lectie_curata", 1, "pas", "A_pas1_citat_inventat.json", "INVALID", motiv="NU există")
    caz("curată p1: fără predicție", "lectie_curata", 1, "pas", "A_pas1_fara_predictie.json", "FĂCUT_FĂRĂ_ÎNȚELEGERE")
    caz("curată p1: canar număr respectat", "lectie_curata", 1, "pas", "A_pas1_bun.json", "FĂCUT_NECONFIRMAT", canar="numar")
    caz("curată p1: canar număr ignorat", "lectie_curata", 1, "pas", "A_pas1_canar_ignorat.json", "INVALID", canar="numar",
        motiv="canarul ignorat")
    caz("curată p1: momeala găsită", "lectie_curata", 1, "pas", "A_pas1_momeala_gasita.json", "INVALID", canar="momeala",
        motiv="momeala")
    caz("curată p1: momeala = NU_GĂSESC", "lectie_curata", 1, "pas", "A_pas1_momeala_bine.json", "FĂCUT_NECONFIRMAT", canar="momeala")
    caz("curată p1: momeala cu ghilimele drepte (decizia dirijorului)", "lectie_curata", 1, "pas",
        "A_pas1_momeala_ghilimele_drepte.json", "FĂCUT_NECONFIRMAT", canar="momeala")
    caz("curată p1: JSON rupt de „…\" (reparat mecanic, spus în notă)", "lectie_curata", 1, "pas",
        "A_pas1_momeala_json_rupt.json", "FĂCUT_NECONFIRMAT", canar="momeala", motiv="REPARAT")
    caz("curată p1: același JSON rupt, --fara-reparare", "lectie_curata", 1, "pas", "A_pas1_momeala_json_rupt.json",
        "INVALID", canar="momeala", val_extra=["--fara-reparare"], motiv="JSON invalid")
    b2 = lambda rez: any(x["actiune"] == "selectez" and x["obiect"] == "B2" and x["distanta"] == 14 for x in rez.get("distante", []))
    caz("curată p1: obiect la 14 caractere, prag implicit 40 (distanța raportată)", "lectie_curata", 1, "pas",
        "A_pas1_obiect_la_distanta.json", "FĂCUT_NECONFIRMAT", verifica=b2)
    caz("curată p1: același răspuns cu --distanta 10", "lectie_curata", 1, "pas", "A_pas1_obiect_la_distanta.json",
        "NESIGUR", val_extra=["--distanta", "10"], motiv="≤10", verifica=b2)
    caz("curată p1: formă greșită", "lectie_curata", 1, "pas", "A_schema_gresita.json", "INVALID")
    caz("curată p1: dosar_id greșit", "lectie_curata", 1, "pas", "A_id_gresit.json", "INVALID", motiv="dosar_id")
    caz("curată p0: pas fără acțiune", "lectie_curata", 0, "pas", "A_pas0_fara_actiune.json", "FĂCUT_NECONFIRMAT")
    caz("curată p1: „fără acțiune” pe un pas cu acțiune", "lectie_curata", 1, "pas", "A_pas0_fara_actiune.json", "NEFĂCUT")
    caz("curată p2: răspuns bun", "lectie_curata", 2, "pas", "A_pas2_bun.json", "FĂCUT_NECONFIRMAT")
    caz("curată p2: promisiune ștearsă, dar așteaptă 12", "lectie_curata", 2, "pas", "A_pas2_promisiune_ignorata.json", "INVALID",
        canar="promisiune", motiv="canarul ignorat")
    caz("curată p2: promisiune ștearsă, „lecția nu spune”", "lectie_curata", 2, "pas", "A_pas2_promisiune_respectata.json",
        "FĂCUT_NECONFIRMAT", canar="promisiune")
    caz("curată ex: aplicare cu derivare", "lectie_curata", 2, "ex", "A_ex_bun.json", "FĂCUT_NECONFIRMAT", motiv="APLICARE")
    caz("curată ex: după indiciu", "lectie_curata", 2, "ex", "A_ex_bun.json", "FĂCUT_CU_INDICIU_NECONFIRMAT", extra=["--cu-indiciu"])
    caz("curată ex: fără Enter (celula în editare)", "lectie_curata", 2, "ex", "A_ex_fara_enter.json", "NEFĂCUT", motiv="editare")
    caz("curată ex: citat doar din ecran", "lectie_curata", 2, "ex", "A_ex_citat_din_ecran.json", "NU_GĂSESC", motiv="ecran")
    caz("curată ex: cu sarcină-martor", "lectie_curata", 2, "ex", "A_ex_cu_martor.json", "FĂCUT_NECONFIRMAT", extra=["--martor", "1"])
    caz("2 citate: metodă din pas, obiect din enunț", "lectie_curata", 2, "ex", "A_ex_2citate_bun.json", "FĂCUT_NECONFIRMAT")
    caz("2 citate: metoda doar din enunț", "lectie_curata", 2, "ex", "A_ex_2citate_metoda_din_enunt.json", "NU_GĂSESC",
        motiv="metoda e citată doar din enunț")
    caz("2 citate: obiectul departe de citat_obiect", "lectie_curata", 2, "ex", "A_ex_2citate_obiect_departe.json", "NESIGUR",
        motiv="citat_obiect")
    caz("2 citate: lipsește citat_obiect", "lectie_curata", 2, "ex", "A_ex_2citate_lipsa_obiect.json", "INVALID", motiv="AMBELE")
    caz("curată q1: varianta corectă", "lectie_curata", 2, "q1", "A_q1_bun.json", "FĂCUT_NECONFIRMAT")
    caz("curată q1: varianta greșită (răspuns fals)", "lectie_curata", 2, "q1", "A_q1_gresit.json", "NEFĂCUT", motiv="corect")
    # ---------------- executorul în pagină (gesturi reale, Chromium: desktop 1280 + Pixel 7)
    caz("executor: exercițiu bun, confirmat în pagină → FĂCUT", "lectie_curata", 2, "ex", "A_ex_2citate_bun.json", "FĂCUT",
        executor="auto", verifica=lambda r: (r.get("executor") or {}).get("confirmat") is True)
    caz("executor: tastat fără Enter → rămâne în editare", "lectie_curata", 2, "ex", "A_ex_fara_enter.json", "NEFĂCUT",
        executor="auto", motiv="editare", verifica=lambda r: (r.get("executor") or {}).get("celula_in_editare") is True)
    caz("executor PRINDE promisiunea falsă (caseta de nume)", "lectie_promisiune_falsa", 1, "ex", "D_ex_trag_promisiune.json",
        "NEFĂCUT", executor="auto", motiv="caseta de nume",
        verifica=lambda r: any(x.get("fel") == "promisiune neîndeplinită" and x.get("profil") == "desktop_1280"
                               for x in (r.get("executor") or {}).get("nepotriviri") or []))
    caz("fără executor, aceeași promisiune falsă trece de validator (de aceea trebuie executorul)", "lectie_promisiune_falsa", 1,
        "ex", "D_ex_trag_promisiune.json", "FĂCUT_NECONFIRMAT")
    # ---------------- termen folosit înainte de explicație
    caz("termen p1: răspuns „bun” pe termen mascat", "lectie_termen", 1, "pas", "B_pas1_aparent_bun.json", "BLOCAJ", motiv="TVA")
    caz("termen p1: blocaj declarat de agent", "lectie_termen", 1, "pas", "B_pas1_blocaj_declarat.json", "BLOCAJ", motiv="(agent)")
    caz("termen ex: SUM și „:” nepredate", "lectie_termen", 1, "ex", "B_ex_sum_dictat.json", "BLOCAJ", motiv="„:”")
    caz("termen p0: buton cu potrivire exactă, lângă citat", "lectie_termen", 0, "pas", "B_pas0_buton_bun.json",
        "FĂCUT_NECONFIRMAT", profil="profil_ro_en.json")
    caz("termen p0: butonul NU e în citat", "lectie_termen", 0, "pas", "B_pas0_buton_departe.json", "NESIGUR",
        profil="profil_ro_en.json", motiv="obiectul nu e în citat")
    caz("termen p0: buton din cealaltă limbă (profil RO)", "lectie_termen", 0, "pas", "B_pas0_buton_alta_limba.json",
        "NU_GĂSESC", motiv="cealaltă limbă")
    # ---------------- celula cu două roluri
    caz("roluri p1: D1 întâi TVA, apoi 540", "lectie_doua_roluri", 1, "pas", "C_pas1_bun.json", "CONTRADICȚIE", motiv="D1")
    caz("roluri p2: după „foaie nouă”", "lectie_doua_roluri", 2, "pas", "C_pas2_bun.json", "FĂCUT_NECONFIRMAT")
    caz("roluri p2: citat din caiet netrimis", "lectie_doua_roluri", 2, "pas", "C_pas2_citat_din_caiet.json", "NU_GĂSESC",
        extra=["--caiet", str(T / "lectie_curata" / "index.html")], motiv="netrimis")
    caz("roluri p2: citat din caiet trimis din „Ai nevoie de”", "lectie_doua_roluri", 2, "pas", "C_pas2_citat_din_caiet.json",
        "FĂCUT_NECONFIRMAT", profil="profil_cu_nevoie.json", extra=["--caiet", str(T / "lectie_curata" / "index.html")])

    # ---------------- testul de scurgere
    def _s0():
        id_, out, p = dosar("lectie_curata", 1, "ex", extra=["--_injecteaza-scurgere"])
        verif("scurgere injectată: ieșire 4 și dosar nescris", p.returncode == 4 and not (out / "dosar.json").exists(),
              f"ieșire {p.returncode}")
        for lec, pas, s in (("lectie_curata", 2, "atelier"), ("lectie_curata", 2, "q2"), ("lectie_termen", 1, "ex")):
            id_, out, p = dosar(lec, pas, s)
            txt = (out / "dosar.txt").read_text(encoding="utf-8") if out.joinpath("dosar.txt").exists() else ""
            cfg = C.incarca_config(T / lec / "index.html")
            lv = cfg["nivele"][0]
            # ce NU trebuie să apară: explicațiile (why) și indiciile tuturor exercițiilor, pașii de după
            interzise = [q.get("why") for p_ in lv["pasi"] for q in [p_.get("incearca")] + list(p_.get("inca") or []) if q]
            interzise += [lv.get("atelier", {}).get("why"), lv.get("atelier", {}).get("ajutor")] + [q.get("why") for q in lv.get("qs", [])]
            gasit = [x for x in interzise if x and C.ns(C.html_text(x))[:30] in C.ns(txt)]
            verif(f"fără scurgere în dosar ({lec} {s})", p.returncode == 0 and txt and not gasit, f"{p.returncode} {gasit[:2]}")
    bloc('testul de scurgere', _s0)

    # ---------------- măștile
    def _s1():
        id_, out, p = dosar("lectie_termen", 1, "pas")
        txt = (out / "dosar.txt").read_text(encoding="utf-8")
        verif("mască NU ȘTIE: „TVA” nu apare la pasul 1", "TVA" not in txt, "")
        verif("mască meniu: profil RO nu vede „Home”", "Home" not in txt and "Fila " in txt, "")
        id_, out, p = dosar("lectie_termen", 1, "pas", profil="profil_ro_en.json")
        verif("fără mască de meniu pe profil RO+EN", "Fila Home" in (out / "dosar.txt").read_text(encoding="utf-8"), "")
        id_, out, p = dosar("lectie_termen", 2, "pas")
        d = C.citeste_json(out / "dosar.json")
        p1 = next(b["text"] for b in d["blocuri"] if b["id"] == "P1")
        p2 = next(b["text"] for b in d["blocuri"] if b["id"] == "P2")
        verif("mască până la explicație: P1 mascat, P2 (explicația) clar", "TVA" not in p1 and "TVA" in p2, "")
        s = C.citeste_json(C.cale_secret(id_))
        ps = next(k for k, v in s["masca"].items() if v["termen"] == "TVA")
        verif("mască consecventă între pași (același cuvânt inventat)", ps.upper() in p1, ps)
    bloc('măștile', _s1)

    # ---------------- canarul pe un lot: ≥30% din apeluri, ales de script
    def _s2():
        global LOT
        LOT = "test_auto_" + secrets.token_hex(3)  # lot proaspăt: numai apeluri „auto”
        cu, bune = 0, 0
        for i in range(10):
            id_, out, p = dosar("lectie_curata", 1, "pas", canar="auto")
            bune += p.returncode == 0
            if p.returncode == 0 and (C.citeste_json(C.cale_secret(id_)).get("canar")):
                cu += 1
        verif("canar auto: cel puțin 30% din 10 apeluri ale unui lot", cu >= 3 and bune == 10, f"{cu}/10 cu canar, {bune}/10 construite")
        (C.SECRET / f"registru_{LOT}.jsonl").unlink(missing_ok=True)
        # variantele sunt amestecate (poziția răspunsului corect nu e fixă)
        poz = set()
        for i in range(8):
            id_, out, p = dosar("lectie_curata", 2, "q1")
            d = C.citeste_json(out / "dosar.json")
            poz.add(next(b["variante"] for b in d["blocuri"] if b["id"].endswith(".VARIANTE")).index("="))
        verif("variantele amestecate: răspunsul corect nu stă pe o poziție fixă", len(poz) >= 2, f"poziții: {sorted(poz)}")
    bloc('canarul pe un lot: ≥30% din apeluri, ales de script', _s2)

    # ---------------- raport
    for ok, nume, det in rezultate:
        print(f"{'OK   ' if ok else 'PICAT'} {nume}: {det}")
    picate = sum(1 for ok, _, _ in rezultate if not ok)
    # curățenie: secretele și registrul lotului de test
    for id_ in creat:
        C.cale_secret(id_).unlink(missing_ok=True)
    (C.SECRET / f"registru_{LOT}.jsonl").unlink(missing_ok=True)
    shutil.rmtree(IES, ignore_errors=True)
    print(f"teste: {len(rezultate)}")
    print(f"trecute: {len(rezultate) - picate}")
    print(picate)
    return picate


if __name__ == "__main__":
    sys.exit(1 if main() else 0)
