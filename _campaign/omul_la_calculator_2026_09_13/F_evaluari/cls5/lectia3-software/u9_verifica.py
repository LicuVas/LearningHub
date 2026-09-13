"""U9/U3 - verificari mecanice pe HTML-ul lectiei (Grep permis de protocol) + cheia chestionarelor.
Iesire: u9_iesire.json. Tipareste <= 20 de randuri."""
import html
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
F = Path(r"C:/00/Projects/LearningHub/content/tic/cls5/m1-sisteme/lectia3-software.html")
src = F.read_text(encoding="utf-8")
out = {}
out["marime_kb"] = round(F.stat().st_size / 1024, 1)
out["blocuri_style_inline"] = len(re.findall(r"<style\b", src))
out["img"] = len(re.findall(r"<img\b", src))
out["lesson_summary_div"] = 'id="lesson-summary"' in src
out["placeholder"] = re.findall(r"MODEL_ANSWER_REQUIRED|TODO|TBD|FIXME|PLACEHOLDER", src)
out["lesson_id"] = sorted(set(re.findall(r"cls5-m1-sisteme-[a-z0-9-]+", src)))
out["init_apeluri"] = sorted(set(re.findall(r"\b(\w+\.init\w*|init\w+)\s*\(", src)))[:12]
out["scripturi"] = re.findall(r'<script[^>]+src="([^"]+)"', src)
out["linkuri_nav"] = sorted(set(re.findall(r'href="([^"#]*lectia[^"]*)"', src)))
out["mentiune_OMEN"] = bool(re.search(r"OMEN|3393", src))
out["titlu"] = html.unescape(re.search(r"<title>(.*?)</title>", src, re.S).group(1))

quiz = []
for m in re.finditer(r"data-quiz='([^']*)'|data-quiz=\"([^\"]*)\"", src):
    raw = html.unescape(m.group(1) or m.group(2))
    try:
        q = json.loads(raw)
    except Exception as e:  # noqa: BLE001
        quiz.append({"eroare_json": str(e)[:80]})
        continue
    for it in (q if isinstance(q, list) else q.get("questions", [q])):
        opts = it.get("options") or it.get("answers") or []
        corr = it.get("correct", it.get("answer"))
        corr = corr.upper() if isinstance(corr, str) else corr
        idx = corr if isinstance(corr, int) else ("ABCD".index(corr[0]) if isinstance(corr, list) and isinstance(corr[0], str) else
                                                   ("ABCD".index(corr) if isinstance(corr, str) and corr in "ABCD" else None))
        lens = [len(str(o)) for o in opts]
        quiz.append({"intrebare": str(it.get("question", ""))[:70], "corect": corr, "lungimi": lens,
                     "corecta_e_cea_mai_lunga": idx is not None and lens and lens[idx] == max(lens) and lens.count(max(lens)) == 1,
                     "indiciu": str(it.get("hint") or it.get("explanation") or "")[:90]})
out["quiz"] = quiz
(L / "u9_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k in ("marime_kb", "blocuri_style_inline", "img", "lesson_summary_div", "placeholder", "lesson_id", "linkuri_nav", "mentiune_OMEN"):
    print(k, out[k])
print("quiz:", len(quiz), "| corecta cea mai lunga:", sum(1 for q in quiz if q.get("corecta_e_cea_mai_lunga")))
for q in quiz[:8]:
    print(" ", q.get("corect"), q.get("lungimi"), q.get("indiciu", "")[:50] or q)
