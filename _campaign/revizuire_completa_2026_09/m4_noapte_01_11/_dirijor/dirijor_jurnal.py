"""Adaugă la jurnal un rând cu ora DIN CEAS (nu scrisă de mână). Textul vine dintr-un fișier, citit pe bytes (fără traduceri de \\r)."""
import sys, datetime
F = r"C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\04_ORCHESTRARE.md"
raw = open(sys.argv[1], "rb").read().decode("utf-8")
ora = datetime.datetime.now().strftime("%H:%M")
raw = raw.replace("{ORA}", ora)
lines = [l for l in raw.replace("\r\n", "\n").split("\n") if l.strip()]
data = open(F, "rb").read()
if not data.endswith(b"\r\n"):
    data += b"\r\n"
data += ("\r\n".join(lines) + "\r\n").encode("utf-8")
open(F, "wb").write(data)
print("adaugat", len(lines), "randuri la", ora)
