"""Ultimul rezultat pe fiecare etichetă din journal.jsonl (reluarea T1): verdict, dovadă, notă + câte rezultate are eticheta."""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
J = sys.argv[1]
lab, ultim, nr = {}, {}, {}
for line in open(J, encoding="utf-8"):
    try:
        e = json.loads(line)
    except Exception:
        continue
    if e.get("type") == "started":
        lab[e.get("agentId")] = e.get("label", "")
    elif e.get("type") == "result" and isinstance(e.get("result"), dict) and "verdict" in e["result"]:
        l = lab.get(e.get("agentId"), "?")
        ultim[l] = (e.get("agentId"), e["result"])
        nr[l] = nr.get(l, 0) + 1
for l, (aid, r) in sorted(ultim.items()):
    print(f"=== {l} | {r.get('verdict')} | rezultate: {nr[l]} | agent {aid[:8]}")
    print("  nota:", str(r.get("note", ""))[:450])
