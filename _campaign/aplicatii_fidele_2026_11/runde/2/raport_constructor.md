# Runda 2 · etapa B · Word — raportul constructorului (pașii 1-7; criticul și publicarea sunt ale orchestratorului)

## Numerele întâi
| | pornire (`masurare_pornire.json`) | după (pasul 7, `masurare_dupa.log`) |
|---|---:|---:|
| O1 central | 61 | 61 |
| O2 identic | 13392 | 13392 |
| O3 interfața | 18546 | 18546 |
| O4 comportament | 98 | 98 |
| O5 evenimente | 154 | 154 |
| O6 sarcini | 0 | 0 |
| O7 text UI | 355 | 355 |
| O8 comenzi moarte | 102 | 102 |
| O9 asistare | 41 | 41 |
| porți | 41 (cum_fac 41; test_joc 0, controale_taiate 0, fereastra_mica 0, date_personale 0, word2007_j2 0) | 42 la măsurare (cum_fac 41, **date_personale 1** = o cale din ACEST raport, nu biblioteca — `regres.md`); reparat, poarta reluată singură → 0, deci **41** |
| repere.lock | ok, 0 neconcludente | ok, 0 neconcludente; `ingheata.py --verifica` → 0 (INTACT, 306) |
| **proba celor 6 GRAV** (`proba_grav.py`, 12 cazuri) | **11 picate** (`proba_grav_inainte.json`) | **0 picate** (`proba_grav_dupa.json`) |

Oracolele nu se mișcă: nimic din cele 6 GRAV nu e măsurat de O1-O9 (sunt gesturi de tastatură pe care niciun oracol nu
le face). Dovada reparației e proba de mai sus, rulată pe poligon cu gesturi reale; dovada că nu s-a stricat nimic e
că niciun oracol și nicio poartă nu cresc. Parțial între pași (`masurare_partiala.log`): O4 98, O5 154, O9 41, fără regres.

## Fiecare GRAV: cum l-am reparat, ce probă am rulat, rezultatul
Proba: server static pe worktree legat de 127.0.0.1 (port liber), Chromium headless, ruta abandonează tot ce nu e
127.0.0.1/localhost; tastele cu `page.keyboard`, clicurile cu `page.mouse`, telefonul cu CDP `Input.imeSetComposition` /
`Input.insertText` (ca la critic). Se citesc `stare()`, ecranul și `window.__lhAplicatieEv`.

1. **Compunerea pe telefon dublează literele** — `aplicatii.js` › `leagaGesturi`: `compositionstart/end` + `isComposing`;
   cât compune, caseta nu se golește, documentul nu se schimbă; textul pleacă o singură dată (merge în ambele ordini
   `input`/`compositionend`); ștergerile din compunere rămân ale casetei; cuvântul în lucru se vede la cursor
   (`aplicatii.css`, `.lh-ap-compune`). Proba G1: compunere a→an→ana + insertText, la fel „are”, „mere” →
   înainte `["aananaana aarareare mmemermeremere"]`, după `["Ana are mere"]` (stare = ecran).
2. **Tastele ajung în document cu Backstage / fereastră deschisă** — `word.js`: `focusStrat()` (Backstage și fereastra
   primesc `tabindex=-1` și focusul; la închiderea ferestrei focusul merge în Backstage dacă e deschis, altfel în
   document); `I.la.text` / `I.la.sterge` refuză scrierea cât e deschis un strat; tastele de acces pe N niveluri
   (`kt.cale`), luate doar din stratul Backstage cât e deschis (cadrul `backstage.cadru` are o copie acoperită a listei,
   exclusă). Probe: G2a Alt, F, A → înainte `["Ana are merea"]`, fără Save As; după text neatins + pagina Save As;
   G2a' Alt, F, A, O → fereastra Save As (Browse = `Alt, F, A, O` în referință); G2b clic File + `xyz` + Backspace →
   înainte `["Ana are merexy"]`, după neatins, Esc închide, apoi „z” → `["Ana are merez"]`; G2c Ctrl+D + `qw` +
   Backspace → înainte `["Ana are mereq"]`, după neatins, Esc, „z” → `["Ana are merez"]`.
3. **Font Size** — `word.js`: caseta „Font Size” editabilă (doar ea, în panglică); clicul o pune în casetă (nu mai dă
   „nesimulat”); `marimeScrisa`: Enter aplică mărimea (1-1638, din 0,5 în 0,5 — pagina Microsoft) pe selecție (fără
   selecție: cuvântul cursorului, ca Grow/Shrink), Enter nu ajunge în document, focusul revine în document; o valoare
   greșită nu schimbă nimic; Alt, H, F S pune focusul în casetă cu valoarea selectată. Probe: G3a „are” selectat, clic
   în casetă, Ctrl+A, 14, Enter → înainte mărime 11 + mesaj „nesimulat”, după 14, un paragraf, focus în document;
   G3b Alt, H, F, S, 20, Enter → înainte `["Ana 20", " mere"]`, după mărime 20, `["Ana are mere"]`.
   Lista ▾: NU (niciun rând al ei în referință) — mesajul central rămâne; `de_verificat.md` R2-1.
4. **Ctrl+S pe document nou** — `word.js`: fereastra „Save this file” construită DOAR din textul a trei pagini Microsoft
   (URL-urile în comentariul de la `cuSalvareNoua` și în `diferente.md` D7): File name (numele propus = prima linie),
   Location „Documente” (folderul ferestrei Save As din referință; lista ▾ = mesajul central), More save options →
   fereastra Save As din referință cu numele scris, Save / Enter → salvează; Esc închide. `word2007` → Save As.
   Proba G4: Ctrl+S → înainte mesajul „Ctrl+S … nu e simulată”, după `dialog_salvare.titlu = "Save this file"`, nume
   tastat + Enter → `Marin_Ioana_7B_poezie.docx`, al doilea Ctrl+S → `salvare` (fără fereastră). Captura ferestrei:
   `runde/2/salvare_noua.png`.
   Geometria nu are referință → `de_aprobat.md` A2-1, `de_verificat.md` R2-2.
5. **Tastele de acces fabrică `dublu_clic`** — `aplicatii.js`: `I.activeazaTasta(el, tasta)` cheamă efectul clicului
   fără `MouseEvent` și fără detectorul de dublu clic; fiecare tastă emite `gest: 'tasta_acces'` (Alt =
   `arata_taste_acces`, prefix = `prefix_tasta_acces`, Esc = `iesire_taste_acces`, activarea = acțiunea comenzii cu
   ținta ei); asistentul nu numără ca greșeli afișarea insignelor și prefixele. Probe: G5 asistent Bold→Italic,
   Alt, H, 1 + un clic greșit → înainte `dublu_clic` pe Bold + indiciu pe Italic după o greșeală, după: evenimentele
   `tasta_acces/arata_taste_acces`, `tasta_acces/fila/fila:Home`, `tasta_acces/aldin/panglica:Home/Font/Bold`,
   `clic/pozitionare`, fără indiciu, „are” aldin; G5b Alt, H, A, C → centru, fără `dublu_clic`.
6. **Majuscula automată pe telefon** — `word.js` › `I.la.text(v, info)` scrie cu AutoCorect (ca tastatura fizică),
   mai puțin la lipire/plasare. Proba G6: insertText „ana”, „ ”, „are”, „ ”, „mere.”, „ ”, „el”, „ ” → înainte
   `["ana are mere. el "]`, după `["Ana are mere. El "]`; G6b tastatura fizică (regres) → `["Ana are mere. El are pere."]`.
   Verificat și: word2007 Ctrl+S → `dialog_salvare.titlu = "Save As"`.

## Fișierele schimbate (exact)
- `C:/00/Projects/LearningHub_fidel/aplicatii/aplicatii.js`, `aplicatii/word.js`, `aplicatii/aplicatii.css`
  (toate prin `runde/2/repara_r2.py`, 25 de înlocuiri exacte).
- Notele: `runde/2/` (`cadru.md`, `tinta.md`, `contra.md`, `diferente.md`, `proba_grav.py`, `proba_grav_inainte.json`,
  `proba_grav_dupa.json`, `repara_r2.py`, `masurare_*.json/log`, `iesiri/`, `regres.md`, `salvare_noua.png`,
  `poarta_date_personale_dupa.log`, acest raport, `gata_pentru_critic.md`),
  `de_verificat.md` (secțiunea RUNDA2-WORD, R2-1…R2-9), `de_aprobat.md` (NOU, A2-1).
- NEatinse: lecțiile, jocurile, `jocuri/_motor/`, reperele înghețate. Fără commit, fără push.

## FĂCUT / NEFĂCUT / NESIGUR
**FĂCUT** — cele 6 GRAV, fiecare cu proba lui trecută (12/12, înainte 1/12), oracolele și porțile fără regres (tabelul).
**NEFĂCUT** — pașii 8-9 (criticul, commit, publicare): ai orchestratorului. Lista Font Size ▾ și lista Location: fără
referință (deblocator: capturile R2-1, R2-2 într-o rundă `acoperire`). Caseta Font (numele fontului, folosită și ea de
`m2-l10:274, 387`) a rămas cu mesajul central: în afara celor 6 GRAV (deblocator: lista fonturilor din referință).
Constatările [FARA_REFERINTA] ale criticului (tabel, tastat peste aldin, Ctrl+A + Delete cu tabel): trecute în
`de_verificat.md` R2-7…R2-9, nereparate (fără referință de gest).
**NESIGUR** — (1) telefonul real: compunerea e probată doar prin CDP pe Chromium desktop (R2-3); (2) felul de eveniment
`tasta_acces` nu e în lista §4 din `api_biblioteca.md` (de adăugat de orchestrator), iar regula „afișarea insignelor nu
e greșeală” e o completare a §6.3; (3) fereastra „Save this file”: geometria, numele propus, Esc (A2-1, R2-2); unde e
focusul în fereastra Font (R2-4); valoarea selectată la Alt, H, F S și mesajul pentru o mărime greșită (R2-5) — toate
[NEVERIFICAT]; (4) Esc din tastele de acces în Backstage iese din taste (nu urcă la file) — ales de mine, necitat.

## Concluzia
Cele 6 GRAV ale criticului rundei 1 se reproduceau pe pornire (11/12 cazuri picate) și nu se mai reproduc (0/12), cu
aceleași gesturi ca ale criticului. O1-O9 și porțile nu cresc din bibliotecă (singurul regres, date_personale, venea
dintr-o notă a mea și e reparat; măsurarea întreagă nu a fost reluată după el). Un GRAV se închide doar când criticul
rundei 3 îl confirmă cu citat. **GATA_PENTRU_CRITIC**
