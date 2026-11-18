# Runda 1 · gata pentru criticul rece (pentru orchestrator — pașii 8-9 sunt ai lui)

## Unde e ce
- Biblioteca: `C:/00/Projects/LearningHub_fidel/aplicatii/` (toate fișierele NOI, necomise; lista în `tinta.md`).
  - `aplicatii.js` — încărcarea (§1-§2), registrul `radacini()`, evenimentele (§4, `leagaGesturi`), asistarea (§6),
    `tipMotor` (§8.1), plasa `deschideSuprafata`.
  - `panglica.js` — motorul comun: desenează orice suprafață din `date/<app>.json` (`deseneaza`), țintele canonice
    (`tintaImplicita`), regulile „ce se vede” (`afisare`).
  - `word.js` — documentul (§5: `I.stare`), comenzile (`CMD`), dialogurile, Backstage, meniurile, tastele (`I.la.tasta`).
  - `date/word.json` — GENERAT de `_unelte/genereaza_word.py` din `referinte/uia_word.json` (`--verifica` → 0).
  - `_unelte/masoara_poligon.py` — rulează codul înghețat al lui O3 pe poligon (diagnostic, nu oracol).
- Referințele cu care se compară: `_campaign/aplicatii_fidele_2026_11/referinte/uia_word.json`,
  `referinte/scenarii_real/word-*.json`, `scenarii/word/*.json`, `api_biblioteca.md`, `oracole/CONVENTIE_ARBORE.md`.
- Diferențele știute: `runde/1/diferente.md` (A = reparate, B = rămase) — criticul NU trebuie să le primească (prompt, pasul 8).

## Cum se deschide poligonul
Server static local pe worktree (doar 127.0.0.1), apoi `http://127.0.0.1:<port>/aplicatii/poligon.html?aplicatie=word`
(`&profil=word2007` pentru laboratorul VII). Din consolă: `LH.aplicatii.deschide('word', {continut: {paragrafe:
['Ana are mere'], selectie: {de_la: 4, pana_la: 7}}})`, `LH.aplicatii.stare('word')`, `window.__lhAplicatieEv`.
Diagnosticul de interfață: `python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/masoara_poligon.py --iesire <temp>`.

## Ce ar trebui să încerce criticul pe unghiul gest_tastatura
1. Tastarea + Ctrl+Z în ambele profiluri: „Planul de luni”, Enter, „Mergem la film.”, Ctrl+Z ×1, ×2, ×3 (word365 vs
   word2007) — și Ctrl+Y după fiecare.
2. AutoCorect: „ana are mere. el are pere.” tastat literă cu literă; apoi un cuvânt care NU e început de propoziție.
3. Tab în tabel (Insert › Table › o celulă din grilă, apoi Tab, Tab… până la rând nou); Shift+Tab înapoi.
4. Tastele cu selecție: Shift+săgeți, Ctrl+săgeți, Home/End pe un paragraf lung (pe mai multe rânduri), săgeata sus/jos.
5. Scurtăturile citate de lecțiile VII (Ctrl+S pe document nesalvat, Ctrl+P, Ctrl+W, Ctrl+O, Ctrl+N): acum dau mesajul central — e corect după R12 sau e o
   comandă moartă pe drumul unei lecții? (lecțiile: `lectii/vii/m1-l0*/index.html`).
6. Tastatura de telefon (fără keydown utilizabil): textul vine prin `input` pe `textarea[data-lh-intrare-document]`.
7. Focusul: după un clic pe panglică, tastele merg tot în document? după F12, tastarea merge în „File name”?
8. Tastele de acces: Alt (apăsat și eliberat) → literele filelor; H → literele comenzilor din Home; 1 → Bold; Esc urcă un
   nivel. Literele vin din `uia_word.json › tasta_acces`. Se compară cu Word real pe câteva comenzi din alte file (N, P, G).
9. Scurtăturile citate din pagina Microsoft a scurtăturilor: Ctrl+D (fereastra Font), Ctrl+Shift+V (lipire doar text),
   Ctrl+S pe un document deja salvat (F12 întâi).

## Ce a mișcat și ce nu (pe scurt; detaliile în regres.md și raport_constructor.md)
- O4/O5/O9 scad (Word); O3/O8 nu se mișcă în etapa B (măsoară lecțiile); O7 crește +439 doar prin `lipsa_in_biblioteca`
  (mecanismul oracolului, `regres.md` §1); O4 Explorer pierde adaptorul vechi pe poligon (`regres.md` §2).
- Diagnosticul de interfață pe poligon (cod înghețat O3): Word 8248 puncte dacă nu e desenat nimic → 392 desenat
  (387 = filele Page Border / Shading ale dialogului Borders and Shading, la care niciun gest din referință nu ajunge).
