"""Surse suplimentare (liste de nume de tranzitii): descarca cu curl, text brut, cautari -> cautari_extra.txt."""
import html
import re
import subprocess
import sys
from pathlib import Path

D = Path(__file__).resolve().parent
R = D / "raw"
U = {
    "mvp2010_en": "https://learn.microsoft.com/en-us/archive/blogs/mvpawardprogram/mvps-for-office-2010-the-beauty-of-transitions-in-powerpoint-2010",
    "videoweb_en": "https://support.microsoft.com/en-us/office/video-animations-and-transitions-for-powerpoint-web-07a941fb-b027-4f3e-b514-cd9866723f45",
    "videoweb_ro": "https://support.microsoft.com/ro-ro/office/video-animations-and-transitions-for-powerpoint-web-07a941fb-b027-4f3e-b514-cd9866723f45",
    "mspptx_en": "https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/22ebe6b5-2ade-43d9-977a-98fa194725c2",
}
extra = sys.argv[1:]
if extra and extra[0] == "--url":
    U = {extra[1]: extra[2]}
    extra = extra[3:]
TERMENI = extra or ["Subtle", "Exciting", "Dynamic", "Vortex", "Gallery", "Rotate", "Zoom", "Cube", "Flip", "Morph"]
out = []
for n, u in U.items():
    f = R / f"{n}.html"
    subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0", u, "-o", str(f)], check=False)
    h = f.read_text(encoding="utf-8", errors="replace")
    h = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", h)
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"(?s)<[^>]+>", " ", h))).strip()
    (R / f"{n}.txt").write_text(u + "\n\n" + t, encoding="utf-8")
    out.append(f"=== {n} {len(t)} car | {u}")
    for k in TERMENI:
        for m in list(re.finditer(re.escape(k), t))[:2]:
            out.append(f"  [{k}] ..{t[max(0, m.start()-150):m.end()+150]}..")
(D / ("cautari_extra_" + "_".join(U) + ".txt")).write_text("\n".join(out), encoding="utf-8")
print("\n".join(l for l in out if l.startswith("===")))
