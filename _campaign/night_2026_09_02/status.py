# -*- coding: utf-8 -*-
"""Poarta mecanica de stare pentru tura de noapte LearningHub.

Nu crede pe cuvant niciun agent: deschide fiecare fisier planificat si il masoara.
Iese cu 0 daca totul e GATA, cu 1 daca mai e de lucru.

  python status.py              -> raport pe grupe + lista scurta
  python status.py --pending    -> doar caile care mai trebuie construite (una pe linie)
  python status.py --group lic10 --pending
  python status.py --json       -> STATUS.json pentru unelte
  python status.py --md         -> scrie si STATUS.md (raport in cuvinte simple)
"""
import json, os, io, sys, re, html

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.join(HERE, "PLAN.json")

MIN_BYTES = 11000
MIN_ATOMS = 4
MIN_PRACTICE = 3
MIN_QUIZ = 3


def load_plan():
    with io.open(PLAN, encoding="utf-8") as f:
        return json.load(f)


def read(path):
    try:
        with io.open(path, encoding="utf-8", errors="replace") as f:
            return f.read()
    except Exception:
        return None


def check_lesson(repo, L):
    """Intoarce (ok, [motive]). Un fisier e GATA doar daca trece toate portile."""
    p = os.path.join(repo, L["path"])
    src = read(p)
    if src is None:
        return False, ["lipseste fisierul"]
    body = re.sub(r"<!--.*?-->", "", src, flags=re.S)
    bad = []
    n = len(src.encode("utf-8"))
    if n < MIN_BYTES:
        bad.append("prea scurt (%d octeti, minim %d)" % (n, MIN_BYTES))
    if "lesson-atomic.css" not in src:
        bad.append("nu leaga lesson-atomic.css")
    if re.search(r"<style[\s>]", body, re.I):
        bad.append("are <style> inline (interzis)")
    atoms = len(re.findall(r'class="atom"', src))
    if atoms < MIN_ATOMS:
        bad.append("doar %d atomi (minim %d)" % (atoms, MIN_ATOMS))
    prac = len(re.findall(r'class="practice-exercise"', src))
    if prac < MIN_PRACTICE:
        bad.append("doar %d exercitii de practica (minim %d)" % (prac, MIN_PRACTICE))
    if "review-section" not in src:
        bad.append("nu are sectiunea de recapitulare")
    if "lesson-frame" not in src and "goal-section" not in src:
        bad.append("nu are sectiunea de obiective (FRAME)")
    quizzes = re.findall(r"data-quiz='([^']*)'", src) or re.findall(r'data-quiz="([^"]*)"', src)
    good_q = 0
    for q in quizzes:
        try:
            obj = json.loads(html.unescape(q))
            items = obj if isinstance(obj, list) else [obj]
            for it in items:
                if isinstance(it, dict) and it.get("options") and "correct" in it:
                    good_q += 1
        except Exception:
            pass
    if good_q < MIN_QUIZ:
        bad.append("doar %d quiz-uri valide (minim %d)" % (good_q, MIN_QUIZ))
    for tgt, eticheta in ((L["prev"], "inapoi"), (L["next"], "inainte")):
        if 'href="%s"' % tgt not in src:
            bad.append("navigare %s gresita (asteptat %s)" % (eticheta, tgt))
    return (len(bad) == 0), bad


def check_index(repo, M):
    p = os.path.join(repo, M["indexPath"])
    src = read(p)
    if src is None:
        return False, ["lipseste fisierul"]
    bad = []
    if len(src.encode("utf-8")) < 3000:
        bad.append("prea scurt")
    missing = [L["file"] for L in M["lessons"] if 'href="%s"' % L["file"] not in src]
    if missing:
        bad.append("nu listeaza: " + ", ".join(missing))
    return (len(bad) == 0), bad


def main():
    plan = load_plan()
    repo = plan["repo"]
    only = None
    if "--group" in sys.argv:
        only = sys.argv[sys.argv.index("--group") + 1]

    rows = []
    for M in plan["modules"]:
        if only and M["group"] != only:
            continue
        ok, why = check_index(repo, M)
        rows.append({"kind": "index", "group": M["group"], "path": M["indexPath"],
                     "module": M["module"], "cls": M["cls"], "ok": ok, "why": why})
        for L in M["lessons"]:
            ok, why = check_lesson(repo, L)
            rows.append({"kind": "lesson", "group": M["group"], "path": L["path"],
                         "module": M["module"], "cls": M["cls"], "ok": ok, "why": why})

    pending = [r for r in rows if not r["ok"]]

    if "--pending" in sys.argv:
        for r in pending:
            print(r["path"])
        return 1 if pending else 0

    if "--json" in sys.argv:
        out = os.path.join(HERE, "STATUS.json")
        with io.open(out, "w", encoding="utf-8") as f:
            json.dump({"rows": rows, "pending": len(pending), "total": len(rows)}, f,
                      ensure_ascii=False, indent=1)
        print(out)
        return 1 if pending else 0

    lines = []
    lines.append("STARE TURA DE NOAPTE - LearningHub (liceu / maistri / postliceal)")
    lines.append("")
    lines.append("Gata: %d din %d fisiere planificate." % (len(rows) - len(pending), len(rows)))
    lines.append("")
    lines.append("| Grupa | Ce este | Gata | Total |")
    lines.append("|:--|:--|--:|--:|")
    ETICHETE = {
        "lic10": "Liceu clasa a X-a (Excel, Access, PowerPoint)",
        "lic11": "Liceu clasa a XI-a (competentele 1 si 2)",
        "lic12": "Liceu clasa a XII-a (web + management de proiect)",
        "maistri": "Scoala de maistri, an I - electromecanic auto",
        "sanitar1": "Postliceal sanitar, an I - medicina generala",
        "sanitar2": "Postliceal sanitar, an II - farmacie",
    }
    for g in ["lic10", "lic11", "lic12", "maistri", "sanitar1", "sanitar2"]:
        gr = [r for r in rows if r["group"] == g]
        if not gr:
            continue
        lines.append("| %s | %s | %d | %d |" % (g, ETICHETE[g], len([r for r in gr if r["ok"]]), len(gr)))
    lines.append("")
    if pending:
        lines.append("Mai e de lucru la %d fisiere:" % len(pending))
        for r in pending[:80]:
            lines.append("  - %s  <- %s" % (r["path"], "; ".join(r["why"])[:150]))
        if len(pending) > 80:
            lines.append("  ... si inca %d" % (len(pending) - 80))
    else:
        lines.append("TOTUL E GATA. Ramane doar publicarea (deploy.ps1) si verificarea pe site.")

    txt = "\n".join(lines)
    print(txt)
    if "--md" in sys.argv:
        with io.open(os.path.join(HERE, "STATUS.md"), "w", encoding="utf-8") as f:
            f.write(txt + "\n")
    return 1 if pending else 0


if __name__ == "__main__":
    sys.exit(main())
