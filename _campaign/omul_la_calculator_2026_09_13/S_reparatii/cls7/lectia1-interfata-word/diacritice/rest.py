"""Cauta cuvinte romanesti ramase probabil fara diacritice in nou.html (text vizibil + data-quiz)."""
import re
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls7\lectia1-interfata-word\diacritice")
t = (D / "nou.html").read_text(encoding="utf-8")
lines = t.split("\n")
SUS = re.compile(r"\b(in|si|sa|ca|iti|poti|daca|dupa|cand|fara|intr|pana|tau|lectie|lectia|fisier\w*|pagina|bara|sageata|functi\w*|optiun\w*|contine|esential\w*|romana|engleza|aceeasi|aceleasi|acelasi|\w*ati|\w*eaza|\w*asca|\w*tie|\w*tii|\w*ta)\b")
skip = ("<script", "AtomicLearning", "PracticeSimple", "LessonSummary", "Breadcrumb", "grade:", "gradeName", "module", "lesson:", "LearningProgress", "<title>")
for n, l in enumerate(lines, 1):
    if any(s in l for s in skip):
        continue
    s = re.sub(r"<code>.*?</code>", "", l)
    s = re.sub(r'\b(id|class|href|src|data-[a-z-]+|style)="[^"]*"', "", s)
    s = re.sub(r"<[^>]+>", " ", s) if "data-quiz" not in l else l
    hits = sorted(set(m.group(0) for m in SUS.finditer(s)))
    if hits:
        print(n, hits)
