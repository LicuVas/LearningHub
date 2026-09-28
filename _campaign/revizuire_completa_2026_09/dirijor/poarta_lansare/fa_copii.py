"""Copii ale probelor care scriu în depozit sau care sunt depășite, rulate din scratchpad (nu ating depozitul)."""
import shutil
from pathlib import Path

LH = Path(r"C:\00\Projects\LearningHub")
AICI = Path(__file__).resolve().parent
ML = LH / "_campaign" / "revizuire_completa_2026_09" / "motor_lectie"

# 1) proba_tinut: copie identică (doar SITE absolut) + copie cu „Da, eu am lucrat” apăsat după „Da, sunt eu”
src = (LH / "jocuri" / "_motor" / "proba_tinut.py").read_text(encoding="utf-8")
a = 'SITE = Path(__file__).resolve().parents[2]'
assert a in src
src = src.replace(a, 'SITE = Path(r"C:\\00\\Projects\\LearningHub")')
(AICI / "tinut_copie.py").write_text(src, encoding="utf-8")
b = 'pg.click("#lhp-da"); pg.wait_for_timeout(300)'
assert src.count(b) == 1, src.count(b)
src2 = src.replace(b, b + '\n    if pg.locator("#lhp-da2").count(): pg.click("#lhp-da2"); pg.wait_for_timeout(300)')
(AICI / "tinut_cu_da2.py").write_text(src2, encoding="utf-8")

# 2) proba_tinte32: rulată din folderul meu (OUT = folderul scriptului), cu „inainte” și copiile de care are nevoie
d = AICI / "t32"
d.mkdir(exist_ok=True)
shutil.copy(ML / "proba_tinte32.py", d / "proba_tinte32.py")
shutil.copy(ML / "tinte32_inainte.json", d / "tinte32_inainte.json")
t = (d / "proba_tinte32.py").read_text(encoding="utf-8")
print("copii folosite de tinte32:", [ln.strip() for ln in t.splitlines() if "copie" in ln and ("=" in ln or "for" in ln)][:6])
print("ok")
