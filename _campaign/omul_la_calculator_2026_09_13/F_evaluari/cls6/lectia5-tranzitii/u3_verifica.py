"""U3 + U7 pentru lectia5-tranzitii. Ruleaza in proces NOU fata de u1_construieste.py.
1) redeschide fiecare produs_elev/*.pptx ca ZIP + lxml (nu python-pptx), citeste <p:transition> (Choice + Fallback) si <p:timing>
   -> 07_redeschis.json; calculeaza cat ruleaza Ex.3 dupa regula Microsoft (surse/raw/timp_en.txt: „The timer starts when the final
   animation or other effect on the slide finishes”)
2) a doua cale -> 04_a_doua_cale.json
3) intrebarile data-quiz: in ce atom stau vs in ce atom e predat termenul -> u3_iesire.json
Tipareste un rezumat scurt; tot in u3_rulare.txt"""
import json
import re
import zipfile
from pathlib import Path

from lxml import etree

L = Path(__file__).resolve().parent
LESSON = Path("C:/00/Projects/LearningHub/content/tic/cls6/m1-prezentari/lectia5-tranzitii.html")
RAW = L / "surse" / "raw"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
MC = "{http://schemas.openxmlformats.org/markup-compatibility/2006}"
P14 = "{http://schemas.microsoft.com/office/powerpoint/2010/main}"


def citeste(pptx):
    z = zipfile.ZipFile(pptx)
    slides = sorted([n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)], key=lambda n: int(re.findall(r"\d+", n)[0]))
    red = []
    for n in slides:
        x = etree.fromstring(z.read(n))
        texte = [t for t in ("".join(r.text or "" for r in p.iter(A + "t")) for p in x.iter(A + "p")) if t]
        ch = x.find(MC + "AlternateContent/" + MC + "Choice")
        fb = x.find(MC + "AlternateContent/" + MC + "Fallback")
        tr = ch.find(P + "transition") if ch is not None else x.find(P + "transition")
        tr_fb = fb.find(P + "transition") if fb is not None else None
        efect = etree.QName(tr[0]).localname if tr is not None and len(tr) else None
        info = {"diapozitiv": n, "texte": texte,
                "tranzitie": efect, "ns_efect": etree.QName(tr[0]).namespace if efect else None,
                "directie": tr[0].get("dir") if efect else None,
                "durata_ms": int(tr.get(P14 + "dur")) if tr is not None and tr.get(P14 + "dur") else None,
                "la_clic": (tr.get("advClick") != "0") if tr is not None else None,
                "dupa_ms": int(tr.get("advTm")) if tr is not None and tr.get("advTm") else None,
                "fallback": etree.QName(tr_fb[0]).localname if tr_fb is not None and len(tr_fb) else None,
                "ordine_in_sld": [etree.QName(c).localname for c in x]}
        # animatii: durata totala a secventei principale (fara clic) = max(offset treapta + delay + durata)
        efecte = []
        ms = x.find(".//" + P + "cTn[@nodeType='mainSeq']")
        sfarsit = 0
        if ms is not None:
            for grp in ms.find(P + "childTnLst").findall(P + "par"):
                gc = grp.find(P + "cTn")
                gdel = gc.find(P + "stCondLst/" + P + "cond").get("delay")
                for trp in gc.find(P + "childTnLst").findall(P + "par"):
                    off = int(trp.find(P + "cTn/" + P + "stCondLst/" + P + "cond").get("delay"))
                    for ep in trp.find(P + "cTn/" + P + "childTnLst").findall(P + "par"):
                        ec = ep.find(P + "cTn")
                        d = int(ec.find(P + "stCondLst/" + P + "cond").get("delay"))
                        dur = max(int(b.get("dur")) for b in ec.iter(P + "cTn") if b is not ec and (b.get("dur") or "").isdigit())
                        efecte.append({"clasa": ec.get("presetClass"), "presetID": ec.get("presetID"), "start": ec.get("nodeType"),
                                       "grup_asteapta_clic": gdel == "indefinite", "incepe_ms": off + d, "durata_ms": dur,
                                       "spid": ec.find(".//" + P + "spTgt").get("spid")})
                        sfarsit = max(sfarsit, off + d + dur)
        info["animatii"] = efecte
        info["animatii_se_termina_la_ms"] = sfarsit
        info["asteapta_clic_pentru_animatii"] = any(e["grup_asteapta_clic"] for e in efecte)
        red.append(info)
    return red


out = {}
for f in sorted((L / "produs_elev").glob("*.pptx")):
    out[f.name] = citeste(f)
(L / "07_redeschis.json").write_text(json.dumps({"citit_cu": "zipfile + lxml, proces nou (u3_verifica.py)", "fisiere": out},
                                                ensure_ascii=False, indent=1), encoding="utf-8")

ex3 = out["Tranzitii_ex3.pptx"]
# cronologie Ex.3: diapozitivul k intra cu tranzitia lui (durata), apoi animatiile, apoi timerul After (regula Microsoft)
t = 0
cron = []
for i, s in enumerate(ex3):
    intra = t
    t += s["durata_ms"] + s["animatii_se_termina_la_ms"] + s["dupa_ms"]
    cron.append({"diap": i + 1, "intra_la_s": intra / 1000, "tranzitie": s["tranzitie"], "tranz_s": s["durata_ms"] / 1000,
                 "animatii_s": s["animatii_se_termina_la_ms"] / 1000, "after_s": s["dupa_ms"] / 1000, "la_clic": s["la_clic"],
                 "asteapta_clic": s["asteapta_clic_pentru_animatii"] or s["la_clic"]})
total_real = t / 1000
it = (L / "innerText.txt").read_text(encoding="utf-8")


def raw(nume):
    return (RAW / f"{nume}.txt").read_text(encoding="utf-8")


rows = []
lectie_secunde = [int(x) for x in re.findall(r"\((\d+) secunde", it)]
rows.append({"ce": "Ex.3: cat ruleaza prezentarea automata (6 diapozitive)",
             "cale1": "textul Ex.3 (timerele „(5 secunde)”, „(8 secunde fiecare)” ... adunate; diap. 2-3 = 2 x 8)",
             "val1": f"{sum(lectie_secunde) + 8} s (timere {lectie_secunde}, 8 numarat de doua ori)",
             "cale2": "07_redeschis.json + regula Microsoft (timerul After porneste dupa ultima animatie; surse/s_timer_dupa_animatie.txt) + duratele tranzitiilor recitite",
             "val2": f"{total_real:.1f} s pana dupa ultimul diapozitiv; cronologie {[(c['diap'], c['intra_la_s']) for c in cron]}"})
rows.append({"ce": "Ex.3: cate diapozitive asteapta un clic (trebuie 0)",
             "cale1": "cerinta lectiei: „trebuie sa avanseze singura fara niciun clic”", "val1": 0,
             "cale2": "XML recitit: advClick=0 pe toate + niciun grup de animatie cu delay=indefinite",
             "val2": sum(1 for c in cron if c["asteapta_clic"])})
rows.append({"ce": "„Ambele bifate” (On Mouse Click + After): avanseaza singur sau asteapta clic?",
             "cale1": "lectia se contrazice: atomul 4 „Poti face click ORICAND, dar daca nu faci nimic, trece automat dupa X secunde” vs rezolvarea Ex.3 „daca ramane bifat \"On Mouse Click\" alaturi de \"After\", prezentarea tot asteapta click la fiecare slide”",
             "val1": "atom 4: automat · rezolvare Ex.3: asteapta clic" if "prezentarea tot asteapta click la fiecare slide" in it and "daca nu faci nimic, trece automat dupa X secunde" in it else "NEGASIT",
             "cale2": "Microsoft Support en-us + ro-ro „Set the timing and speed of a transition” (surse/s_ambele_bifate.txt)",
             "val2": "avanseaza automat, clicul doar grabeste" if "The slide will advance automatically, but you can advance it more quickly by clicking the mouse" in raw("timp_en") else "NEGASIT"})
q10 = "Doar o tranzitie" in it and "Fiecare slide poate avea doar o singura tranzitie aplicata" in it
rows.append({"ce": "Cheia intrebarii „Cate tranzitii poti aplica pe un slide?”",
             "cale1": "data-quiz atomul 5: corect = „Doar o tranzitie”", "val1": "o tranzitie" if q10 else "NEGASIT",
             "cale2": "Microsoft Support (surse/s_o_tranzitie.txt): „Only one transition effect can be applied to a slide at a time”",
             "val2": "o tranzitie" if "Only one transition effect can be applied to a slide at a time" in raw("tranzitii_en") else "NEGASIT"})
dyn = "Pan, Ferris Wheel, Conveyor, Rotate, Window, Orbit and Fly Through"
lect = {"Rotate": "EXCITING" if it.find("Rotate: Slide-ul se roteste") < it.find("3. DYNAMIC CONTENT") else "?",
        "Gallery": "DYNAMIC" if it.find("Gallery: Slide-urile se aranjeaz") > it.find("3. DYNAMIC CONTENT") else "?",
        "Vortex": "DYNAMIC" if "categoria Dynamic (de exemplu Vortex)" in it else "?"}
rows.append({"ce": "In ce categorie stau Rotate, Gallery, Vortex",
             "cale1": "lectia (atomul 2 + „De gandit”)", "val1": json.dumps(lect),
             "cale2": "Microsoft Learn (arhiva MVP, PowerPoint 2010) + Indezine PowerPoint 2013: lista celor 7 Dynamic Content (surse/s_dynamic_content.txt)",
             "val2": json.dumps({k: ("DYNAMIC" if k in dyn else "nu e in Dynamic Content") for k in lect}) if dyn in raw("mvp2010_en") else "NEGASIT"})
rows.append({"ce": "Tastele din tabelul „Rularea Prezentarii” (F5, Shift+F5, B, W)",
             "cale1": "lectia atomul 5: F5 primul, Shift+F5 curent, B negru, W alb",
             "val1": "F5/Shift+F5/B/W" if all(k in it for k in ("Shift + F5", "B (Black)", "W (White)")) else "NEGASIT",
             "cale2": "Microsoft „Use keyboard shortcuts to deliver PowerPoint presentations” (surse/s_taste_livrare.txt)",
             "val2": "confirmat" if all(k in raw("livrare_en") for k in ("Start a presentation from the current slide. Shift+F5", "Display a blank black slide, or return to the presentation from a blank black slide. B", "Display a blank white slide")) else "NEGASIT"})
try:
    import fitz
    pdf = fitz.open(str(L / "randat_pptx" / "Tranzitii_ex3.pdf"))
    rows.append({"ce": "Ex.3: continutul fisierului pptx vs randarea LibreOffice",
                 "cale1": "07_redeschis.json (XML)", "val1": f"{len(ex3)} diapozitive; diap.4 = {ex3[3]['texte']}",
                 "cale2": "randat_pptx/Tranzitii_ex3.pdf (PyMuPDF)", "val2": f"{len(pdf)} pagini; pag.4 = {[x for x in pdf[3].get_text().splitlines() if x.strip()]}"})
except Exception as e:  # noqa: BLE001
    rows.append({"ce": "pdf", "cale1": "pdf", "val1": "eroare", "cale2": "-", "val2": str(e)})
(L / "04_a_doua_cale.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")

# ---------- 3) intrebari vs atomul care preda ----------
src = LESSON.read_text(encoding="utf-8")
lines = it.splitlines()
atom_start = {int(m.group(1)): i + 1 for i, l in enumerate(lines) for m in [re.fullmatch(r"(\d)\. Continut", l.strip())] if m}
ex_start = next(i + 1 for i, l in enumerate(lines) if l.strip() == "Exercitii practice")


def atom_of(line):
    k = 0
    for a, s in sorted(atom_start.items()):
        if line >= s:
            k = a
    return k if line < ex_start else "Ex"


PREDARE = {
    "Care este diferenta principala": "Definitie: Tranzitiile sunt efecte vizuale",
    "Care este durata recomandata": "Mediu (1-1.5 secunde - DEFAULT)",
    "Ce combinatie de taste porneste": "Porneste de la slide-ul CURENT",
    "Cand ar trebui sa folosesti sunete": "Evita sunetele de tranzitie in prezentari formale",
    "Care categorie de tranzitii": "1. SUBTLE (Subtile) - Pentru prezentari profesionale",
    "Ce inseamna setarea": "On Mouse Click (Default - RECOMANDAT)",
    "Ce face butonul": "aplica setarile de tranzitie curente pe toate slide-urile",
    "Ce face tranzitia": "Push: Slide-ul nou impinge pe cel vechi",
    "Ce tasta porneste prezentarea de la primul slide": "Porneste prezentarea de la PRIMUL slide",
    "Cate tranzitii poti aplica": "O singura tranzitie per slide",
}
quiz = []
for m in re.finditer(r'id="atom-(\d)" data-quiz=\'(.*?)\'>', src):
    for q in json.loads(m.group(2).replace("&quot;", '"')):
        key = next(k for k in PREDARE if q["question"].startswith(k))
        ln = next(i + 1 for i, l in enumerate(lines) if PREDARE[key] in l)
        ta = atom_of(ln)
        quiz.append({"atom_intrebare": int(m.group(1)), "intrebare": q["question"], "predat_la_linia": ln, "atom_predare": ta,
                     "relatie": "propriu" if ta == int(m.group(1)) else ("INAINTE de predare" if ta > int(m.group(1)) else "inapoi")})
cuv = lambda a, b: len(" ".join(re.sub(r"\[/?ASCUNS[^\]]*\]", " ", l) for l in lines[a - 1:b]).split())  # noqa: E731
rez = {"quiz": quiz,
       "quiz_rezumat": {r: sum(1 for q in quiz if q["relatie"] == r) for r in ("propriu", "INAINTE de predare", "inapoi")},
       "cuvinte": {"pana_la_Ex1": cuv(1, ex_start), "Ex1": cuv(ex_start, 705), "Ex2": cuv(706, 740), "Ex3": cuv(741, 783),
                   "incearca_tu": cuv(50, 104), "tot": cuv(1, len(lines))},
       "atom_start": atom_start, "ex_start": ex_start, "ex3_cronologie": cron, "ex3_total_s": total_real}
(L / "u3_iesire.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
summary = [f"{k}: " + "; ".join(f"{s['tranzitie']}/{s['directie']}/{s['durata_ms']}ms/clic={s['la_clic']}/after={s['dupa_ms']}/anim={len(s['animatii'])}" for s in v) for k, v in out.items()]
summary += [f"U3 {r['ce'][:55]}: {str(r['val1'])[:70]} || {str(r['val2'])[:90]}" for r in rows]
summary += [f"quiz: {rez['quiz_rezumat']}", f"cuvinte: {rez['cuvinte']}"]
(L / "u3_rulare.txt").write_text("\n".join(summary), encoding="utf-8")
print("\n".join(summary))
