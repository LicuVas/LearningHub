# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului pe care îl joc (U11)
- 11-12 ani, clasa a VI-a, **n-a mai deschis PowerPoint** (lecția însăși presupune asta: „Nu stii cum sa deschizi PowerPoint...”).
- Nu știe engleză de meniu: „Home”, „Insert”, „Slide Sorter” sunt cuvinte noi; nu știe că într-un Office în română ele se numesc Pornire, Inserare, Sortare diapozitive.
- Citește ~100 de cuvinte pe minut (ritm provizoriu al porții pentru cls6); nu deschide pliantele cu rezolvări cât lucrează.
- Are 50 de minute din care ~8 se duc pe pornirea PC-ului și logare.
- Nu are imagini proprii pe calculator și nu știm dacă are internet.
- Pe PC-ul din laborator mai lucrează și alți elevi (fișierele cu același nume se pot suprascrie).

## Ce am făcut, pas cu pas (python-pptx, `u1_construieste.py` → `u1_iesire.txt`)
1. **Încearcă tu:** o prezentare cu un diapozitiv și titlu, salvată `Prima_mea_explorare.pptx`. Pasul „numără filele” nu are răspuns așteptat în lecție; lecția listează 8 file, Microsoft 365 în română are 11 (Pornire, Inserare, Desenare, Proiectare, Tranziții, Animații, Expunere diapozitive, Înregistrare, Revizuire, Vizualizare, Ajutor) plus Fișier. Elevul care numără 12 crede că a greșit.
2. **Ex.1 (minim):** 5 diapozitive, 3 layout-uri, 3 imagini, note la 2 diapozitive. Imaginile le-am **generat eu** — elevul nu are de unde lua 3 imagini fără internet sau fără un dosar pregătit de profesor. Tema de design nu se poate aplica din python-pptx și **nu e predată** în atomi → pas de interfață (fila Proiectare, sursă Microsoft ro-ro).
3. **Ex.2 (standard):** 8 diapozitive numerotate, inversate, apoi „Duplica slide-ul 5” și „Sterge toate slide-urile pare (2, 4, 6, 8)”. Am executat **trei citiri**:
   - cum spune rezolvarea (poziția 5; pozițiile pare, șterse deodată) → **8, 6, 4, 3, 1**;
   - ad litteram (diapozitivul cu numărul 5; numerele pare) → **7, 5, 5, 3, 1**;
   - elevul care șterge pe rând pozițiile 2, 4, 6, 8 → după al treilea pas rămân 6 diapozitive și **poziția 8 nu mai există**.
   Enunțul nu spune „poziție” sau „număr”, iar lecția nu dă rezultatul final de verificat. Selecția cu Ctrl și schimbarea aspectului (layout) nu sunt predate (rezolvarea recunoaște asta).
4. **Ex.3 (performanță):** „Școala mea”, 8 diapozitive, 4 layout-uri, note la toate, PDF randat (8 pagini). Enunțul cere „Introducere → 5 slide-uri de continut → Concluzie” = **7**, dar și „exact 8 slide-uri”; rezolvarea spune 2-7 conținut (= 6). Elevul atent se blochează la aritmetică. Pentru PDF lecția dă „File → Export → Create PDF/XPS Document”; pagina Microsoft (text brut, ro și en) spune pentru PowerPoint doar Fișier → Export → „Salvare cu tipul” PDF.
5. **Ex.4 (performanță):** 4 diapozitive „Cum să faci un sandviș”, fără probleme.

## Unde se blochează un începător (ipoteze AI — de verificat la oră)
- caută „Home”/„Insert”/„Slide Sorter” într-un PowerPoint în română (sau LibreOffice Impress);
- nu are imagini pentru Ex.1;
- la Ex.2 nu știe dacă „slide-ul 5” e poziția sau numărul;
- la întrebarea din atomul 1 despre „Slide Sorter View” nu a întâlnit încă termenul (se predă în atomii 2-3);
- salvează `Prima_mea_explorare.pptx` pe Desktop peste fișierul colegului din ora precedentă.
