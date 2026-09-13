# 04 — Norma (U16) · lectia5-tabele

## Limba română scrisă corect
- **Diacritice la 1000 de litere:** 0,0 (u3_iesire.json: 0,02 — o singură literă, „imporți” din caseta „Dincolo de lectie”, cu ț cu virgulă; 0 ş/ţ cu sedilă). Text românesc normal ≈ 40-60.
- **Ce TASTEAZĂ elevul e fără diacritice:** Ex.1 „Ora | Luni | Marti | Miercuri | Joi | Vineri”, materiile „Romana”; Ex.3 „FORMULAR DE INSCRIERE”, „Data nasterii:”, „Scoala:”, „Semnatura:”; provocarea „Absente”. Un formular „oficial” (cum îl numește lecția) tipărit cu „INSCRIERE” și „Semnatura” e greșit ca document.
- **Ghilimele:** 112 drepte, 0 „românești” (u_anexa_grep.txt).
- **Termen:** lecția spune „chenare”, documentația Microsoft ro-ro „borduri” (Borduri și umbrire) — elevul caută un cuvânt care nu e pe ecran, dacă Word-ul e în română.

## LESSON_SPECIFICATION.md (citat)
- r.401: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text” — încălcat.
- r.751: „- [ ] Romanian text with proper diacritics (ă, â, î, ș, ț)” — nu.
- r.752: „- [ ] 4-8 atoms present, each with content + quiz” — **11 atomi**.
- r.168: „**Content:** 4-8 paragraphs maximum. If more, split into 2 atoms.” și tabelul r.405-411 „Words | 80 | 300” pe atom — **toți cei 11 atomi au între 379 și 629 de cuvinte** (parcurgere.json).
- r.411: „Images/diagrams | 0 | 2” — 0 e permis de spec, dar într-o lecție despre tabele nu există nici `<img>`, nici `<table>` (u3_iesire.json: 0 și 0).

## Programa (OMEN 3393/2017, `data/informatica_gimnaziu/curriculum.json`, clasa a VII-a)
- CS.1.1 „Editarea/tehnoredactarea de documente utilizând aplicații specializate”; activitate: „formatarea unui document utilizând instrumente dedicate”.
- Conținuturi: „Obiecte într-un document: text, imagini, tabele”; „Operaţii de formatare a unui document: text, imagine, tabel, pagină”; „Reguli de lucru în realizarea unui document conform unor specificații (dimensiune pagină, dimensiune font, dimensiune imagine, format tabel)”.
- → Tabelul și pagina sunt în programă (atomul 11 citează corect că formatarea paginii e conținut distinct). **Imaginea** apare de două ori în programă, lângă tabel, și lipsește din lecție și din tot M1 de pe site (lecțiile 1-5).
- Descriptorul „De bază”: „cu sprijin … în pași ghidați, în contexte familiare” — Ex.1 (orar) se potrivește; Ex.3 (formular cu borduri pe laturi) e „Avansat”, corect etichetat „performanta”.

## Ca specialist (tehnoredactor, 2026)
- Lecția e bună pe fond la „stil de tabel înainte de formatare manuală” (greșeala 5) — corect pentru 2026.
- **Tabel pentru aranjare în pagină** („No Border … layout de pagina cu mai multe coloane”, atomul 9): practică depășită și rea pentru accesibilitate; azi se folosesc coloane de secțiune (Aspect › Coloane) sau casete — semnalare minoră, fără sursă descărcată, deci nu o trec în log.
- Ex.2 prezintă ca fapte „Consum memorie: Edge – Mic, Chrome – Mare”, „Firefox – Foarte rapida” fără sursă și fără dată; sunt opinii. Nu am o sursă datată care să le confirme sau infirme → nu semnalez ca greșit, ci ca „exemplu de completat cu date proprii” (09_checklist).
