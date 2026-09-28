# Găsește id-ul sarcinii PIM „cele 8 puncte” (LearningHub revizuire completa) ca să o închid cu pim.py done.
import sys
sys.path.insert(0, r"C:/00/AI_0")
sys.path.insert(0, r"C:/00/AI_0/tools")
sys.stdout.reconfigure(encoding="utf-8")
try:
    from common.db_pool import get_mongo_db
    db = get_mongo_db()
except Exception:
    from pymongo import MongoClient
    db = MongoClient("mongodb://localhost:27017")["ai_knowledge"]
for col in db.list_collection_names():
    if "pim" not in col.lower() and "item" not in col.lower() and "task" not in col.lower():
        continue
    for d in db[col].find({"$or": [{"title": {"$regex": "8 puncte"}}, {"text": {"$regex": "8 puncte"}}, {"content": {"$regex": "8 puncte"}}]}):
        print(col, d.get("_id"), d.get("id"), d.get("item_id"), str(d.get("title") or d.get("text") or d.get("content"))[:80])
