"""Control final dupa diacritice: pe cele 25 de lectii M1 - data-quiz JSON valid (cheie litera), randare H_vede
fara pageerror si fara pasi blocati, si textele comune din JS apar cu diacritice."""
import json
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

SITE = Path(r"C:\00\Projects\LearningHub")
CAMP = SITE / "_campaign" / "omul_la_calculator_2026_09_13"
OUT = CAMP / "S_reparatii" / "_final_randare"
MOD = {"cls5": "m1-sisteme", "cls6": "m1-prezentari", "cls7": "m1-word-fundamente", "cls8": "m1-excel-fundamente"}


class Q(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("data-quiz") is not None:
            self.q.append(a["data-quiz"])


bad = 0
for cls, mod in MOD.items():
    for f in sorted((SITE / "content" / "tic" / cls / mod).glob("lectia*.html")):
        errs = []
        p = Q()
        p.feed(f.read_text(encoding="utf-8"))
        nq = 0
        for raw in p.q:
            try:
                for q in json.loads(raw):
                    nq += 1
                    c, o = str(q.get("correct", "")), q.get("options") or []
                    if len(c) != 1 or not ("a" <= c < chr(ord("a") + len(o))):
                        errs.append(f"cheie invalida {c!r}")
            except Exception as e:  # noqa: BLE001
                errs.append(f"data-quiz JSON invalid: {e}")
        out = OUT / cls / f.stem
        subprocess.run([sys.executable, str(CAMP / "H_vede.py"), str(f), str(out)], capture_output=True, text=True, encoding="utf-8", errors="replace")
        try:
            m = json.loads((out / "masuri.json").read_text(encoding="utf-8"))
            cons = json.loads((out / "consola.json").read_text(encoding="utf-8"))
            pe = [c for c in cons if c["tip"] == "pageerror"]
            if pe:
                errs.append("pageerror: " + pe[0]["text"][:100])
            if m.get("pasi_blocati"):
                errs.append(f"{m['pasi_blocati']} pasi blocati")
            vis = (out / "innerText_vizibil.txt").read_text(encoding="utf-8")
            js_ok = "Verifică dacă ai înțeles" in vis or "De ce înveți asta" in vis
            if "Verifica daca ai inteles" in vis:
                errs.append("text comun JS fara diacritice")
        except Exception as e:  # noqa: BLE001
            errs.append(f"randare esuata: {e}")
            js_ok = False
        bad += bool(errs)
        print(f"{'OK  ' if not errs else 'PICA'} {cls}/{f.stem:28} intrebari={nq:3} pasi={m.get('pasi_parcursi','?')} js_diacritice={'da' if js_ok else 'nu'} {'; '.join(errs)}")
print(f"\n{25 - bad}/25 trec")
sys.exit(1 if bad else 0)
