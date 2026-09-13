"""U9: checklistul spec pe HTML (Grep permis) + R1.1/R1.4/R1.6 pe data-quiz. Scrie u9_quiz.json."""
import html
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
F = Path(r"C:\00\Projects\LearningHub\content\tic\cls6\m1-prezentari\lectia2-slide-uri.html")
src = F.read_text(encoding="utf-8")
out = {"marime_bytes": F.stat().st_size, "style_inline": len(re.findall(r"<style", src)),
       "init": re.findall(r"(\w+)\.init\('([^']+)'", src), "escaped_quotes": src.count('\\"'),
       "img": len(re.findall(r"<img", src)), "atomi": []}
for m in re.finditer(r'<div class="atom" id="(atom-\d+)" data-quiz=\'([^\']*)\'', src):
    q = json.loads(html.unescape(m.group(2)))
    rows = []
    for it in q:
        opts = it["options"]
        c = it["correct"]
        ci = "abcd".index(c) if isinstance(c, str) else c
        lens = [len(o) for o in opts]
        rows.append({"q": it["question"], "correct": c, "raspuns": opts[ci], "cea_mai_lunga": lens[ci] == max(lens) and lens.count(max(lens)) == 1,
                     "are_hint": bool(it.get("hint")), "hint": it.get("hint", "")[:120]})
    out["atomi"].append({"id": m.group(1), "intrebari": rows})
toate = [r for a in out["atomi"] for r in a["intrebari"]]
out["total_intrebari"] = len(toate)
out["corecta_cea_mai_lunga"] = sum(r["cea_mai_lunga"] for r in toate)
out["fara_hint"] = sum(not r["are_hint"] for r in toate)
(L / "u9_quiz.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print({k: out[k] for k in ("marime_bytes", "style_inline", "escaped_quotes", "img", "total_intrebari", "corecta_cea_mai_lunga", "fara_hint")})
print(out["init"])
for r in toate:
    print(r["cea_mai_lunga"], r["correct"], r["raspuns"][:40], "| hint:", r["hint"][:80])
