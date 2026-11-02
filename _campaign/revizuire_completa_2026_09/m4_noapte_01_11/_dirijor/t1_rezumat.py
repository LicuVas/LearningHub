"""Rezumatul T1 din journal.jsonl: eticheta (din „started”, după agentId), verdictul, dovada și nota."""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
J = sys.argv[1]
lab, rez = {}, []
for line in open(J, encoding="utf-8"):
    try:
        e = json.loads(line)
    except Exception:
        continue
    if e.get("type") == "started":
        lab[e.get("agentId")] = e.get("label", "")
    elif e.get("type") == "result":
        rez.append(e)
for e in rez:
    v = e.get("result")
    if isinstance(v, dict) and "verdict" in v:
        print(f"=== {lab.get(e.get('agentId'), '?')} | {v.get('verdict')}")
        print("  dovada:", str(v.get("evidence", ""))[:600])
        if v.get("note"):
            print("  nota:", str(v.get("note"))[:600])
