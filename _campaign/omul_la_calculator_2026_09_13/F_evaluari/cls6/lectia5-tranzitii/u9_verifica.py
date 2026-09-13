"""U9: verificari mecanice pe HTML-ul lectiei (Grep permis de protocol) + R1.1 (varianta corecta cea mai lunga?). -> u9_iesire.json"""
import html
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
src = Path("C:/00/Projects/LearningHub/content/tic/cls6/m1-prezentari/lectia5-tranzitii.html").read_text(encoding="utf-8")
r = {}
qs = []
ok_json = True
for m in re.finditer(r"data-quiz='(.*?)'>", src):
    try:
        qs += json.loads(html.unescape(m.group(1)))  # atributul HTML poate fi codat cu &quot; (atomii 1,2,4,5); browserul il decodeaza
    except ValueError:
        ok_json = False
r["data_quiz_json_valid"] = ok_json
r["intrebari"] = len(qs)
lung = []
for q in qs:
    i = "abcd".index(q["correct"])
    L_ = [len(o) for o in q["options"]]
    lung.append({"q": q["question"][:60], "corecta_cea_mai_lunga_strict": L_[i] == max(L_) and L_.count(max(L_)) == 1,
                 "indiciul_are_raspunsul": q["options"][i].split(" (")[0].lower()[:12] in q["hint"].lower()})
r["R1_1_corecta_cea_mai_lunga"] = sum(x["corecta_cea_mai_lunga_strict"] for x in lung)
r["R1_4_indiciu_contine_raspunsul"] = sum(x["indiciul_are_raspunsul"] for x in lung)
r["detaliu"] = lung
r["style_inline_blocks"] = len(re.findall(r"<style", src))
r["init_calls"] = re.findall(r"(\w+\.init\([^)]*\))", src)[:10]
r["lesson_id"] = re.findall(r"LESSON_ID\s*=\s*['\"]([^'\"]+)", src)[:2]
r["lesson_summary_div"] = 'id="lesson-summary"' in src
r["nav_links"] = re.findall(r'href="([^"]*lectia\d[^"]*)"', src)[:4]
r["atomi"] = len(re.findall(r'class="atom" id="atom-', src))
r["niveluri_exercitii"] = re.findall(r"Exercitiul \d \(Nivel (\w+)\)", src)
r["placeholder"] = re.findall(r"MODEL_ANSWER_REQUIRED|TODO|TBD|FIXME|PLACEHOLDER", src)
r["img_fara_max_width"] = len([t for t in re.findall(r"<img[^>]*>", src) if "max-width" not in t])
r["dimensiune_octeti"] = len(src.encode("utf-8"))
r["cedilla_s_t"] = len(re.findall("[şţŞŢ]", src))
r["comma_s_t"] = len(re.findall("[șțȘȚ]", src))
(L / "u9_iesire.json").write_text(json.dumps(r, ensure_ascii=False, indent=1), encoding="utf-8")
print({k: v for k, v in r.items() if k != "detaliu"})
