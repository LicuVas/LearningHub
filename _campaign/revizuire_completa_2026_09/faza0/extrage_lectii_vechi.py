# Faza 0: textul VIZIBIL al lectiilor vechi candidate (fara script/style/nav), ca elevul il citeste.
import re, sys, html
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
C = Path(r"C:/00/Projects/LearningHub/content/tic")
OUT = Path(r"C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/faza0/_extras")
LECTII = {
    "V": ["cls5/m1-sisteme/lectia2-hardware.html"],
    "VI": ["cls6/m1-prezentari/lectia2-slide-uri.html", "cls6/m1-prezentari/lectia3-text-imagini.html"],
    "VII": ["cls7/m1-word-fundamente/lectia5-tabele.html", "cls7/m2-word-avansat/lectia5-imagini-obiecte.html"],
    "VIII": ["cls8/m1-excel-fundamente/lectia1-interfata.html", "cls8/m1-excel-fundamente/lectia2-date.html"],
}

def vizibil(h):
    h = re.sub(r"(?is)<(script|style|noscript|svg)\b.*?</\1>", " ", h)
    h = re.sub(r"(?is)<nav\b.*?</nav>", " ", h)
    h = re.sub(r"(?is)<header\b.*?</header>", " ", h)
    h = re.sub(r"(?is)<footer\b.*?</footer>", " ", h)
    h = re.sub(r"(?i)<img\b[^>]*alt=\"([^\"]*)\"[^>]*>", r"[IMAGINE: \1]", h)
    h = re.sub(r"(?i)<img\b[^>]*>", "[IMAGINE fara alt]", h)
    h = re.sub(r"(?i)<br\s*/?>", "\n", h)
    h = re.sub(r"(?i)</(p|li|tr|h\d|pre|div|section|figcaption|summary|details)>", "\n", h)
    h = re.sub(r"(?i)<h(\d)[^>]*>", lambda m: "\n" + "#" * int(m.group(1)) + " ", h)
    h = re.sub(r"(?i)<li[^>]*>", "- ", h)
    h = re.sub(r"(?i)<(td|th)[^>]*>", " | ", h)
    h = re.sub(r"<[^>]+>", "", h)
    h = html.unescape(h)
    h = re.sub(r"[ \t]+", " ", h)
    h = re.sub(r"\n\s*\n+", "\n", h)
    return h.strip()

for cls, lst in LECTII.items():
    for rel in lst:
        f = C / rel
        t = vizibil(f.read_text(encoding="utf-8", errors="replace"))
        imgs = len(re.findall(r"(?i)<img\b", f.read_text(encoding="utf-8", errors="replace")))
        name = rel.replace("/", "__").replace(".html", ".txt")
        (OUT / f"vechi_{name}").write_text(f"SURSA: {f}\nIMAGINI <img> in pagina: {imgs}\n\n" + t, encoding="utf-8")
        print(cls, rel, "caractere:", len(t), "img:", imgs)
