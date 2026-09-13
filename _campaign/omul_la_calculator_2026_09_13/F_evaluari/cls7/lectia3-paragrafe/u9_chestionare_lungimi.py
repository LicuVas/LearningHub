"""R1.1/R1.4/R1.5: lungimea variantelor si pozitia cheii in fiecare data-quiz. Iesire: u9_chestionare_lungimi.json."""
import html, json, re
from pathlib import Path
L = Path(__file__).resolve().parent
src = Path("C:/00/Projects/LearningHub/content/tic/cls7/m1-word-fundamente/lectia3-paragrafe.html").read_text(encoding="utf-8")
out = []
for m in re.finditer(r"data-quiz='(.*?)'", src, re.S):
    for it in json.loads(html.unescape(m.group(1))):
        lens = [len(o) for o in it["options"]]
        i = "abc".index(it["correct"])
        out.append({"q": it["question"][:50], "lungimi": lens, "cheie": it["correct"], "cheia_e_cea_mai_lunga": lens[i] == max(lens) and lens.count(max(lens)) == 1, "json_valid": True})
(L / "u9_chestionare_lungimi.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(out), "chestionare; cheia cea mai lunga la:", [o["q"][:30] for o in out if o["cheia_e_cea_mai_lunga"]])
