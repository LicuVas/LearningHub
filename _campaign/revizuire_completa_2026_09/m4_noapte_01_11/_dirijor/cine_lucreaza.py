"""Ce procese lucrează pe o lecție (după linia de comandă). Doar citire."""
import sys, psutil, datetime
cheie = sys.argv[1] if len(sys.argv) > 1 else "m4-l24"
for p in psutil.process_iter(["pid", "name", "cmdline", "create_time", "cpu_times"]):
    try:
        c = " ".join(p.info["cmdline"] or [])
    except Exception:
        continue
    if cheie in c and "cine_lucreaza" not in c:
        t = datetime.datetime.fromtimestamp(p.info["create_time"]).strftime("%H:%M")
        cpu = sum(p.info["cpu_times"][:2]) if p.info["cpu_times"] else 0
        print(p.info["pid"], p.info["name"], "pornit", t, f"cpu {cpu:.0f}s", c[:180])
print("gata")
