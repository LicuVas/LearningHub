# Construieste chestionarele mutate (regula 6) si verifica lungimile (R1.1) inainte de Edit.
import json, html, re, pathlib

F = pathlib.Path(r"C:\00\Projects\LearningHub\content\tic\cls6\m1-prezentari\lectia2-slide-uri.html")
OUT = pathlib.Path(__file__).with_name("s_quiz_nou.txt")

Q = {
 "atom-1": [
  {"question": "Care este scurtatura de tastatura pentru adaugarea unui slide nou?", "options": ["Ctrl + S", "Ctrl + M", "Ctrl + N", "Ctrl + P"], "correct": "b",
   "hint": "Corect! Ctrl+M este scurtatura rapida pentru Diapozitiv nou (New Slide)."},
 ],
 "atom-2": [
  {"question": "Ce aspect (layout) folosesti pentru primul slide al unei prezentari (cu titlul principal)?", "options": ["Titlu (Title Slide)", "Blank - slide complet gol", "Two Content - doua coloane"], "correct": "a",
   "hint": "Corect! Titlu (Title Slide) este aspectul pentru slide-ul de deschidere cu titlu mare si subtitlu."},
  {"question": "Ce layout este ideal pentru o comparatie intre doua lucruri (ex: Avantaje vs Dezavantaje)?", "options": ["Title Only - doar titlu, fara continut", "Two Content sau Comparison", "Blank - slide complet gol, fara elemente"], "correct": "b",
   "hint": "Corect! Two Content sau Comparison sunt perfecte pentru comparatii side-by-side!"},
 ],
 "atom-3": [
  {"question": "Cum stergi rapid un slide?", "options": ["Click dreapta → Dublare diapozitiv (Duplicate Slide)", "Selecteaza slide-ul si apasa Delete", "Ctrl + Z (anuleaza ultima actiune)", "Ctrl + C (copiaza slide-ul selectat)"], "correct": "b",
   "hint": "Corect! Selecteaza slide-ul in panoul de miniaturi din stanga si apasa Delete - cea mai rapida metoda!"},
  {"question": "Cum dublezi rapid un slide?", "options": ["Selecteaza slide-ul in panoul din stanga si apasa Delete", "Click dreapta → Dublare diapozitiv (Duplicate Slide)", "Ctrl + M (creeaza un slide nou gol, nu face o copie)"], "correct": "b",
   "hint": "Corect! Dublarea pune copia imediat dupa original, cu tot continutul."},
 ],
 "atom-4": [
  {"question": "Cum reordonezi slide-urile cel mai usor?", "options": ["Delete si recreeaza in ordinea dorita", "Drag and drop in panoul din stanga", "File → Reorder Slides"], "correct": "b",
   "hint": "Corect! Tragi miniatura in panoul din stanga sau in vizualizarea Sortare diapozitive (Slide Sorter) - metode vizuale si rapide!"},
 ],
 "atom-5": [
  {"question": "Ce este Coordonatorul de diapozitive (Slide Master)?", "options": ["Vizualizarea cu toate slide-urile afisate ca miniaturi, pentru reordonare", "Slide-ul sablon care controleaza aspectul tuturor slide-urilor", "Un slide gol pe care il copiezi manual pe fiecare pagina, pentru aspect unitar"], "correct": "b",
   "hint": "Corect! Coordonatorul de diapozitive (Slide Master) controleaza formatarea si aspectul tuturor slide-urilor din prezentare!"},
 ],
 "atom-6": [
  {"question": "Unde gasesti si aplici teme predefinite?", "options": ["Inserare (Insert) → teme", "Proiectare (Design) → teme", "Vizualizare (View) → teme", "Fișier (File) → teme"], "correct": "b",
   "hint": "Corect! Fila Proiectare (Design) contine galeria de teme predefinite gata de aplicat!"},
 ],
 "atom-7": [
  {"question": "Ce tip de fundal foloseste o trecere progresiva intre 2 sau mai multe culori?", "options": ["Umplere solidă (Solid fill) - o culoare, fara trecere", "Umplere gradient (Gradient fill)", "Picture Fill - fundal dintr-o imagine", "Umplere model (Pattern fill) - model repetat de forme"], "correct": "b",
   "hint": "Corect! Umplere gradient (Gradient fill) creeaza o trecere fluida intre culori!"},
  {"question": "Cum schimbi fundalul unui slide?", "options": ["Click dreapta → Formatare fundal (Format Background)", "Inserare (Insert) → Imagini, apoi seteaza imaginea ca fundal", "Pornire (Home) → Diapozitiv nou → alegi un aspect cu fundal"], "correct": "a",
   "hint": "Corect! Formatare fundal (Format Background) este optiunea corecta pentru schimbarea fundalului!"},
 ],
}

src = F.read_text(encoding="utf-8")
old = {}
for m in re.finditer(r"id=\"(atom-\d)\" data-quiz='(.*?)'>", src):
    for q in json.loads(html.unescape(m.group(2))):
        old[q["question"]] = q

lines = []
for aid, qs in Q.items():
    for q in qs:
        opts = q["options"]; i = ord(q["correct"]) - 97
        oth = [len(o) for k, o in enumerate(opts) if k != i]; avg = sum(oth) / len(oth)
        bad = len(opts[i]) > 1.2 * avg and len(opts[i]) - avg > 8
        assert not bad, (aid, q["question"], len(opts[i]), avg)
        assert not re.search(r"(varianta|optiunea|raspunsul corect este)\s*[\(\"']?[a-d]\b", q["hint"], re.I)
        print(aid, "| schimbata" if old.get(q["question"]) != q else "| identica", "| corecta", len(opts[i]), "medie", round(avg), "|", q["question"][:50])
    enc = json.dumps(qs, ensure_ascii=False).replace('"', "&quot;").replace("'", "&#39;")
    lines.append(f'id="{aid}" data-quiz=\'{enc}\'>')
assert len(old) == 10 and sum(len(v) for v in Q.values()) == 10
OUT.write_text("\n".join(lines), encoding="utf-8")
print("scris", OUT)
