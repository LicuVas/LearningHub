"""Text brut (fara script/style/etichete) pentru fiecare surse/raw/*.html -> surse/raw/<nume>_text.txt."""
import html
import re
from pathlib import Path

RAW = Path(__file__).resolve().parent / "surse" / "raw"
for p in sorted(RAW.glob("*.html")):
    s = p.read_text(encoding="utf-8", errors="replace")
    s = re.sub(r"<script.*?</script>|<style.*?</style>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"\s+", " ", html.unescape(s)).replace(" ", " ")
    (RAW / (p.stem + "_text.txt")).write_text(s, encoding="utf-8")
    print(p.stem, len(s))
