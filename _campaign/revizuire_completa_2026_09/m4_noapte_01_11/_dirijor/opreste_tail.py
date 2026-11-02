"""Oprește DOAR procesele tail.exe rămase de la agenții turei (urmăresc fișiere din lecțiile M4 de azi). Doar după PID, niciodată după nume."""
import psutil
LECTII = ["m4-l22", "m4-l23", "m4-l24", "m4-l25", "m4-l26", "m4-l27"]
oprite = []
for p in psutil.process_iter(["pid", "name", "cmdline"]):
    try:
        if (p.info["name"] or "").lower() != "tail.exe":
            continue
        c = " ".join(p.info["cmdline"] or [])
        if "-f" in c and any(l in c for l in LECTII) and "LearningHub" in c:
            p.terminate(); oprite.append((p.info["pid"], c[-90:]))
    except Exception as e:
        print("eroare", e)
for o in oprite:
    print("oprit", o)
print("total", len(oprite))
