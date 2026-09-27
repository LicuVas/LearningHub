# Faza 0: construieste, pe fiecare clasa, un "sit" .md din nivelurile jocurilor (ordinea: caietul = nivelurile
# de dinainte, apoi nivelurile care declara lectia 4) + config pentru oracol_novice.py, apoi il ruleaza.
# Navigarea si exercitiile NU se verifica (le face motorul jocului; ar da doar zgomot). Nu modifica situl.
import json, re, sys, html, subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

F0 = Path(r"C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/faza0")
EX = F0 / "_extras"
OR = F0 / "_oracol"
ORACOL = r"C:/00/AI_0/tools/plimbare/oracol/oracol_novice.py"

SITURI = {
    "V": [("calculator-v", [1, 2, 3], "caiet"), ("calculator-v", [4], "lectia4")],
    "VI": [("prezentari-vi", [1, 2], "caiet"), ("prezentari-vi", [3], "lectia4")],
    "VII": [("word-vii", [1], "caiet"), ("word-obiecte-vii", [1, 3], "lectia4")],
    "VIII": [("excel-viii", [1], "caiet"), ("excel-pas-cu-pas-viii", [1], "caiet"),
             ("excel-viii", [2], "lectia4"), ("excel-pas-cu-pas-viii", [2, 5], "lectia4")],
}

def G(forme):
    return {"definit_in": "auto", "forme": forme}

CFG = {
    "V": {"glosar": {"hardware": G(["hardware-ul", "hardware-ului"]), "software": G(["software-ul", "software-ului"]),
                     "procesor": G(["procesorul", "procesorului", "CPU"]), "memorie RAM": G(["memoria RAM", "RAM"]),
                     "placă de bază": G(["placa de bază", "plăcii de bază"]), "disc": G(["discul", "SSD", "HDD", "hard disk"]),
                     "sursă de alimentare": G(["sursa", "sursa de alimentare"]), "placă video": G(["placa video", "GPU"]),
                     "periferic": G(["periferice", "perifericele", "perifericul"]),
                     "Manager de activități": G(["Managerul de activități", "Task Manager"]), "gigahertz": G(["GHz"]), "gigabyte": G(["GB"])},
          "nu_stie": ["GHz", "DDR4", "GPU", "Task Manager", "nucleu", "megahertz"],
          "prereq": {"procesor": ["hardware"], "memorie RAM": ["hardware"], "periferic": ["hardware"]}},
    "VI": {"glosar": {"diapozitiv": G(["diapozitive", "diapozitivul", "diapozitivului", "diapozitivele", "slide"]),
                      "obiect": G(["obiecte", "obiectul", "obiectele", "obiectelor"]),
                      "aspect": G(["aspectul", "Layout", "machetă", "machete", "macheta"]),
                      "substituent": G(["placeholder", "casetă", "casete", "caseta"]),
                      "prezentare": G(["prezentarea", "prezentări", "prezentării"]), "Pornire": G(["Home"])},
           "nu_stie": ["placeholder", "Layout", "Title Slide", "machetă"],
           "prereq": {"obiect": ["diapozitiv"], "aspect": ["diapozitiv"], "substituent": ["aspect"]}},
    "VII": {"glosar": {"obiect": G(["obiecte", "obiectul", "obiectele"]), "imagine": G(["imagini", "imaginea", "imaginile"]),
                       "tabel": G(["tabelul", "tabele", "tabelului"]), "rând": G(["rânduri", "rândul", "rândurile"]),
                       "coloană": G(["coloane", "coloana", "coloanele"]), "celulă": G(["celule", "celula", "celulele"]),
                       "antet": G(["antetul", "rândul de antet"]), "Inserare": G(["Insert", "fila Inserare"]), "sursă": G(["sursa"])},
            "nu_stie": ["Insert", "Table", "Pictures", "antet"],
            "prereq": {"celulă": ["rând", "coloană"], "antet": ["rând", "tabel"], "rând": ["tabel"], "coloană": ["tabel"]}},
    "VIII": {"glosar": {"celulă": G(["celule", "celula", "celulele", "celulei"]), "adresă": G(["adresa", "adrese", "adresele", "adresei"]),
                        "zonă": G(["zona", "zone", "zonei"]), "celulă activă": G(["celula activă"]),
                        "caseta de nume": G(["Caseta Nume", "Name Box"]), "decupare": G(["decupezi", "Ctrl+X"]),
                        "mâner de umplere": G(["mânerul de umplere", "fill handle"]), "formulă": G(["formula", "formule", "formulele"]),
                        "bara de formule": G(["bara fx", "Formula Bar"]), "bara de stare": G(["Status Bar"]),
                        "adrese relative": G(["adresă relativă", "adresele relative"])},
             "nu_stie": ["Ctrl", "Shift", "fill handle", "clipboard"],
             "prereq": {"adresă": ["celulă"], "zonă": ["adresă"], "mâner de umplere": ["formulă"], "adrese relative": ["formulă", "adresă"]}},
}

def md(s):
    if not s:
        return ""
    s = str(s)
    s = re.sub(r"(?is)<(b|strong)>(.*?)</\1>", r"**\2**", s)
    s = re.sub(r"(?is)<code>(.*?)</code>", r"`\1`", s)
    s = re.sub(r"(?is)<kbd>(.*?)</kbd>", r"`\1`", s)
    s = re.sub(r"(?i)<br\s*/?>", "\n", s)
    s = re.sub(r"(?i)</(p|li|tr|h\d|div|figcaption|pre)>", "\n", s)
    s = re.sub(r"(?i)<li[^>]*>", "- ", s)
    s = re.sub(r"(?i)<(td|th)[^>]*>", " | ", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n\n", s)
    return s.strip()

def q_md(q):
    parts = []
    for k in ("q", "intro"):
        if q.get(k):
            parts.append(md(q[k]))
    for k in ("o", "items", "pairs"):
        if q.get(k):
            parts.append(md(json.dumps(q[k], ensure_ascii=False)))
    if q.get("ajutor"):
        parts.append("Indiciu: " + md(q["ajutor"]))
    if q.get("why"):
        parts.append("Explicație: " + md(q["why"]))
    return "\n\n".join(parts)

def pagina(slug, i, n):
    L = [f"# {md(n.get('t'))}", ""]
    if n.get("obiectiv"):
        L += ["Obiectiv: " + md(n["obiectiv"]), ""]
    if n.get("text"):
        L += [md(n["text"]), ""]
    for j, p in enumerate(n.get("pasi") or []):
        L += [f"## {md(p.get('t'))}", ""]
        for k in ("text", "exemplu", "altfel"):
            if p.get(k):
                L += [md(p[k]), ""]
        if p.get("incearca"):
            L += ["### Încearcă", "", q_md(p["incearca"]), ""]
        for x in p.get("inca") or []:
            L += ["### Încă un exercițiu", "", q_md(x), ""]
    if n.get("atelier"):
        L += ["## Atelier", "", q_md(n["atelier"]), ""]
    for m, q in enumerate(n.get("qs") or []):
        L += [f"### Întrebarea {m+1}", "", q_md(q), ""]
    return "\n".join(L)

rez = {}
for cls, lst in SITURI.items():
    d = OR / cls
    d.mkdir(parents=True, exist_ok=True)
    for f in d.glob("*.md"):
        f.unlink()
    ordine = []
    k = 0
    for slug, nivele, rol in lst:
        cfg = json.loads((EX / f"{slug}.config.json").read_text(encoding="utf-8"))
        for nn in nivele:
            k += 1
            nume = f"{k:02d}_{rol}_{slug}_N{nn}.md"
            (d / nume).write_text(pagina(slug, nn - 1, cfg["nivele"][nn - 1]), encoding="utf-8")
            ordine.append(nume)
    conf = {"_comentariu": "Faza 0, 27.09.2026: situl = nivelurile jocurilor ca .md; calibrare NEFACUTA cu omul.",
            "ordine": ordine, "extensii": [".md"], "ignora": [],
            "stie": ["calculator", "mouse", "tastatura", "ecran", "fisier"],
            "prereq_externe": {},
            "bloc_prereq": {"verifica": False},
            "exemple": {"limbaje": [], "timeout": 5, "executa": False},
            "praguri": {"cuvinte_pe_propozitie": 22, "propozitie_lunga": 25, "procent_propozitii_lungi": 0.30,
                        "cuvinte_pe_paragraf": 150, "min_cuvinte_pagina": 30},
            "navigatie": {"verifica": False}, "exercitii": {"verifica": False}, "canar": []}
    conf.update(CFG[cls])
    (d / "oracol.config.json").write_text(json.dumps(conf, ensure_ascii=False, indent=1), encoding="utf-8")
    out = subprocess.run([sys.executable, ORACOL, "--sit", str(d), "--config", str(d / "oracol.config.json"),
                          "--json", str(OR / f"raport_{cls}.json"), "--fara-executie"],
                         capture_output=True, text=True, encoding="utf-8", errors="replace")
    (OR / f"raport_{cls}.txt").write_text(out.stdout + out.stderr, encoding="utf-8")
    ultima = [l for l in out.stdout.splitlines() if l.strip()][-1:] or ["?"]
    rez[cls] = {"exit": out.returncode, "ultima_linie": ultima[0], "pagini": ordine}
    print(cls, "exit", out.returncode, "ultima:", ultima[0])
(OR / "_rezumat.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
