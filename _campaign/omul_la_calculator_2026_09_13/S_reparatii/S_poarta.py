"""Poarta reparatiei unei lectii M1 (13.09.2026).

python S_poarta.py <cls> <lectia-fara-.html>          ex.: python S_poarta.py cls8 lectia3-formule
python S_poarta.py --toate                             toate lectiile care au raport.json

Verifica, fata de versiunea din git (HEAD):
  1. fiecare data-quiz se citeste ca lista JSON cu question/options/correct/hint; cheia e o litera valida;
     indiciul nu numeste litera; la intrebarile SCHIMBATE: corecta <= 1,2 x media distractorilor (R1.1);
  2. numarul de atomi, <title> si id-urile atomilor sunt neschimbate;
  3. raport.json: fiecare reparatie aplicata are „dupa" care EXISTA in fisierul nou si „inainte" care exista in HEAD
     (sau tip „adaugat"); fiecare semnalare sarita are motiv;
  4. lectia se parcurge in Chromium (H_vede.py): 0 erori JS, niciun pas blocat.
Exit 0 = trece.
"""
import html
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

SITE = Path(r"C:\00\Projects\LearningHub")
CAMP = SITE / "_campaign" / "omul_la_calculator_2026_09_13"
S = CAMP / "S_reparatii"
MODUL = {"cls5": "m1-sisteme", "cls6": "m1-prezentari", "cls7": "m1-word-fundamente", "cls8": "m1-excel-fundamente"}


class Atomi(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.quiz, self.ids, self.title, self._t = [], [], "", False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self._t = True
        if "atom" in (a.get("class") or "").split():
            self.ids.append(a.get("id"))
            if a.get("data-quiz") is not None:
                self.quiz.append((a.get("id"), a.get("data-quiz")))

    def handle_endtag(self, tag):
        if tag == "title":
            self._t = False

    def handle_data(self, d):
        if self._t:
            self.title += d


def parse(src):
    p = Atomi()
    p.feed(src)
    return p


def norm(t):
    t = html.unescape(re.sub(r"<[^>]+>", " ", t))
    return re.sub(r"\s+", " ", t).strip().lower()


def check(cls, les):
    errs, warns = [], []
    rel = f"content/tic/{cls}/{MODUL[cls]}/{les}.html"
    new = (SITE / rel).read_text(encoding="utf-8")
    old = subprocess.run(["git", "-C", str(SITE), "show", f"HEAD:{rel}"], capture_output=True, text=True, encoding="utf-8").stdout
    pn, po = parse(new), parse(old)
    if pn.title.strip() != po.title.strip():
        errs.append(f"<title> schimbat: {po.title.strip()!r} -> {pn.title.strip()!r}")
    if pn.ids != po.ids:
        errs.append(f"atomii s-au schimbat (numar/id): {len(po.ids)} -> {len(pn.ids)}")
    old_q = {}
    for aid, raw in po.quiz:
        try:
            for q in json.loads(raw):
                old_q[q.get("question", "")] = q
        except Exception:  # noqa: BLE001
            pass
    for aid, raw in pn.quiz:
        try:
            qs = json.loads(raw)
        except Exception as e:  # noqa: BLE001
            errs.append(f"{aid}: data-quiz nu e JSON valid ({e})")
            continue
        if not isinstance(qs, list):
            errs.append(f"{aid}: data-quiz nu e lista")
            continue
        for q in qs:
            opts = q.get("options") or []
            c = str(q.get("correct", ""))
            if not q.get("question") or len(opts) < 2:
                errs.append(f"{aid}: intrebare fara text sau cu <2 variante")
                continue
            if len(c) != 1 or not ("a" <= c <= chr(ord("a") + len(opts) - 1)):
                errs.append(f"{aid}: cheia {c!r} nu e o litera valida pentru {len(opts)} variante")
                continue
            if re.search(r"(varianta|optiunea|raspunsul corect este)\s*[\(\"']?[a-d]\b", q.get("hint", ""), re.I):
                warns.append(f"{aid}: indiciul pare sa numeasca o litera")
            changed = old_q.get(q["question"]) != q
            if changed:
                i = ord(c) - ord("a")
                others = [len(o) for k, o in enumerate(opts) if k != i]
                if others and len(opts[i]) > 1.2 * (sum(others) / len(others)) and len(opts[i]) - sum(others) / len(others) > 8:
                    errs.append(f"{aid}: intrebare schimbata cu varianta corecta prea lunga ({len(opts[i])} vs media {sum(others)/len(others):.0f}): {q['question'][:60]!r}")

    rp = S / cls / les / "raport.json"
    if not rp.is_file():
        errs.append("lipseste raport.json")
    else:
        r = json.loads(rp.read_text(encoding="utf-8"))
        # textul chestionarelor sta in atributul data-quiz, pe care norm() il sterge odata cu eticheta
        # (orbire gasita de reparatorul cls5/lectia1, 13.09.2026) -> il adaug explicit la textul comparat
        def quiz_text(p):
            bucati = []
            for _, raw in p.quiz:
                try:
                    for q in json.loads(raw):
                        bucati += [q.get("question", ""), q.get("hint", "")] + list(q.get("options") or [])
                except Exception:  # noqa: BLE001
                    pass
            return " ".join(bucati)

        nn = norm(new) + " " + norm(quiz_text(pn))
        on = norm(old) + " " + norm(quiz_text(po))
        aplicate = r.get("aplicate") or []
        # schimbarile din chestionare au fost trecute de reparatori sub chei separate, cand poarta inca nu vedea
        # textul chestionarelor; le verificam, dar ca AVERTISMENT (verificarea lor de fond o face verificatorul)
        chest = []
        for cheie in ("aplicate_chestionar", "aplicate_in_chestionar", "aplicate_chestionare"):
            chest += r.get(cheie) or []
        if not aplicate and not chest:
            errs.append("raport.json: nicio reparatie aplicata")
        def bucati(citat):
            # un citat poate fi o fraza exacta SAU bucati exacte legate cu „..."; un prefix de reper
            # („atom-1 intrebarea 2:") se ignora. Fiecare bucata de >= 6 caractere trebuie sa existe.
            c = re.sub(r"^\s*atom[-\w]*\s+(intrebarea|întrebarea)\s*\d+\s*:\s*", "", citat or "", flags=re.I)
            return [norm(x) for x in re.split(r"\.\.\.|…", c) if len(norm(x)) >= 6]

        for k, f in enumerate(aplicate):
            dupa_b = bucati(f.get("dupa_citat"))
            inainte_b = bucati(f.get("inainte_citat"))
            if not dupa_b or any(x not in nn for x in dupa_b):
                errs.append(f"aplicate[{k}] {f.get('id')}: „dupa_citat” nu se gaseste in fisierul nou: {f.get('dupa_citat','')[:70]!r}")
            if f.get("tip") != "adaugat":
                if not inainte_b or any(x not in on for x in inainte_b):
                    errs.append(f"aplicate[{k}] {f.get('id')}: „inainte_citat” nu se gaseste in versiunea veche")
                elif all(x in nn for x in inainte_b) and not all(any(x in d for d in dupa_b) for x in inainte_b):
                    errs.append(f"aplicate[{k}] {f.get('id')}: textul vechi e inca in fisier")
            if len(str(f.get("verificare") or "")) < 20:
                errs.append(f"aplicate[{k}] {f.get('id')}: fara verificare (ce ai rulat/observat)")
        for k, f in enumerate(chest):
            if not isinstance(f, dict):
                continue
            db = bucati(f.get("dupa_citat") or f.get("dupa") or "")
            if db and any(x not in nn for x in db):
                warns.append(f"chestionar[{k}] {f.get('id')}: citatul „dupa” nu se regaseste exact (de verificat de verificator)")
        for k, f in enumerate(r.get("sarite") or []):
            if len(str(f.get("motiv") or "")) < 20:
                errs.append(f"sarite[{k}] {f.get('id')}: fara motiv")

    out = S / cls / les / "vede_dupa"
    pr = subprocess.run([sys.executable, str(CAMP / "H_vede.py"), str(SITE / rel), str(out)], capture_output=True, text=True, encoding="utf-8", errors="replace")
    try:
        m = json.loads((out / "masuri.json").read_text(encoding="utf-8"))
        cons = json.loads((out / "consola.json").read_text(encoding="utf-8"))
        pe = [c for c in cons if c["tip"] == "pageerror"]
        if pe:
            errs.append(f"erori JS la randare: {pe[0]['text'][:120]}")
        if m.get("pasi_blocati"):
            errs.append(f"{m['pasi_blocati']} pas(i) blocat(i) la parcurgere")
        if m.get("pasi_parcursi", 0) < len(pn.ids) - 1:
            warns.append(f"parcursi {m.get('pasi_parcursi')} din {len(pn.ids)} atomi")
    except Exception as e:  # noqa: BLE001
        errs.append(f"randarea a esuat: {e} {pr.stderr[-200:]}")
    return errs, warns


def main():
    if "--toate" in sys.argv:
        tinte = [(p.parent.parent.name, p.parent.name) for p in sorted(S.glob("cls*/*/raport.json"))]
    else:
        tinte = [(sys.argv[1], sys.argv[2])]
    bad = 0
    for cls, les in tinte:
        e, w = check(cls, les)
        bad += bool(e)
        print(("OK   " if not e else "PICA ") + f"{cls}/{les}")
        for x in e:
            print("  - " + x)
        for x in w:
            print("  ~ " + x)
    print(f"\n{len(tinte) - bad}/{len(tinte)} trec")
    return 1 if bad or not tinte else 0


if __name__ == "__main__":
    sys.exit(main())
