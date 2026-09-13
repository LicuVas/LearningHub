"""U3: cheia din sursa (data-quiz, litera -> varianta) vs varianta pe care H_vede a apasat-o in pagina randata."""
import html
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
src = Path(r"C:\00\Projects\LearningHub\content\tic\cls7\m1-word-fundamente\lectia1-interfata-word.html").read_text(encoding="utf-8")
parc = json.loads((L / "parcurgere.json").read_text(encoding="utf-8"))
rows = []
for k, m in enumerate(re.findall(r"data-quiz='(.*?)'", src, re.S)):
    q = json.loads(html.unescape(m))[0]
    cheie = q["options"]["abc".index(q["correct"])]
    apasat = parc[k]["raspunsuri"][0]["raspuns"].split("\n", 1)[-1]
    lung = max(q["options"], key=len) == cheie
    rows.append({"nr": k + 1, "cheie_sursa": cheie, "apasat_in_pagina": apasat, "egal": cheie == apasat,
                 "corecta_e_cea_mai_lunga": lung})
(L / "u3_cheie_quiz.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
print(sum(r["egal"] for r in rows), "din", len(rows), "egale;", sum(r["corecta_e_cea_mai_lunga"] for r in rows), "corecte = cea mai lunga")
