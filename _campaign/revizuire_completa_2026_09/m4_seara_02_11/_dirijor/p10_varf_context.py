"""P10 (T1, R3): varful de context al sesiunii-dirijor, din transcript.

Aceeasi formula ca tools/predare.py context_curent (input + cache_read + cache_creation),
dar pe TOATE raspunsurile, nu doar pe ultimul. Ultima linie = 1 daca varful trece de prag.
Rulare: python p10_varf_context.py <id-sesiune> [--prag 300] [--de-la 2026-11-02T17:47]  (ora UTC; doar raspunsurile de atunci incolo)
"""
import glob
import json
import sys
from pathlib import Path

sesiune = sys.argv[1]
prag = int(sys.argv[sys.argv.index("--prag") + 1]) if "--prag" in sys.argv else 300
de_la = sys.argv[sys.argv.index("--de-la") + 1] if "--de-la" in sys.argv else ""
gasite = glob.glob(str(Path.home() / ".claude" / "projects" / "*" / (sesiune + ".jsonl")))
if not gasite:
    print("transcript negasit pentru", sesiune)
    sys.exit(2)
t = Path(gasite[0])
varf, ora_varf, n, ultimul, ora_ult, prima = 0, "", 0, 0, "", ""
peste = 0
for linie in t.open(encoding="utf-8", errors="replace"):
    try:
        r = json.loads(linie)
    except ValueError:
        continue
    m = r.get("message") or {}
    u = m.get("usage") if isinstance(m, dict) else None
    if not u or r.get("isSidechain"):
        continue
    if de_la and r.get("timestamp", "") < de_la:
        continue
    tot = (u.get("input_tokens", 0) + u.get("cache_read_input_tokens", 0)
           + u.get("cache_creation_input_tokens", 0))
    n += 1
    prima = prima or r.get("timestamp", "")
    ultimul, ora_ult = tot, r.get("timestamp", "")
    if tot > prag * 1000:
        peste += 1
    if tot > varf:
        varf, ora_varf = tot, r.get("timestamp", "")
print(f"transcript: %USERPROFILE%\\.claude\\projects\\{t.parent.name}\\{t.name}" +(f" · de la {de_la} UTC" if de_la else ""))
print(f"raspunsuri cu usage: {n} (de la {prima} la {ora_ult}, ore UTC)")
print(f"varf: {varf // 1000}k la {ora_varf} UTC · ultimul: {ultimul // 1000}k la {ora_ult} UTC")
print(f"raspunsuri peste {prag}k: {peste}")
print(1 if varf > prag * 1000 else 0)
