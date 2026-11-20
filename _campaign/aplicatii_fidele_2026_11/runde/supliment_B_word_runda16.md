# Supliment la promptul rundei 16 (valul B-word REDESCHIS, `B-word#2`) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/16/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli). Citește ÎNTÂI
`runde/_paralel/CICLU_PARALEL.md`: runda ta merge în paralel cu Explorer (r15) și Excel (r17), iar regulile de acolo (fișiere
proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`) bat pașii 1 și 7 din prompt.

## Unde suntem
- **Valul Word s-a oprit după runda 5** pe limita de 6 rânduri, cu 8 GRAV deschise (`runde/5/raport.md:33-46`, `runde/5/critic.md`).
  - Deblocatorul scris acolo: „o rundă Word nouă, cu ținta = aceste 8”.
  - Toate au referință sau dovadă din Word real (`runde/5/critic_probe/`). Niciuna nu cere ceva de la Vasile.
- **De atunci s-au schimbat fișiere comune:**
  - Excel r6-r10 și PowerPoint r11-r14 au atins `aplicatii.js`, `panglica.js` și `aplicatii.css` (de exemplu Esc → `tasta_esc`, Alt + literă în ferestre, KeyTips);
  - regresul Word a ieșit curat în toate rundele, dar unele GRAV pot fi atinse pe drum.
  - **Pasul tău zero:** reproduci fiecare GRAV pe codul de azi, cu proba lui. „Deja închis” se scrie DOAR cu dovada de azi (eveniment / `stare()` / captură headless).
- **Pornirea măsurată:** `runde/16/masurare_pornire.json` (măsurarea de după acoperirea pe instrumente). Unghiul rundei: `gest_tastatura`.

## Ținta rundei 16 = cele 8 GRAV, în ordinea pagubei pentru elev
1. **S1 + S2** (`runde/5/critic.md:140`, `:159`) — folderul din Save As / Open.
   - Bara de adrese urmează folderul ales.
   - F12 pe un document deschis din Descărcări deschide Save As în folderul documentului, ca în Word real (citează proba din critic).
   - Locul unde se salvează = locul arătat.
2. **S5** (`:207`) — lista ferestrei Save As arată fișierele folderului (fișierul colegei din `lectii/vii/m1-l03:172`).
3. **S4** (`:193`) — același fișier deschis a doua oară nu devine al doilea document. Word real aduce în față fereastra existentă; dovada e în critic.
   - Atelierul trece de `docuri:0`.
4. **S6** (`:224`) — Ctrl+N dă Document2, Document3… și o pagină nouă, fără să pară ștearsă cea veche.
5. **S3** (`:178`) — numele cu `: ? * "` și alte caractere interzise de Windows nu se salvează.
   - Se afișează mesajul pe care îl dă Word / Windows, din referință. Dacă textul exact nu e în referință: mesajul central standard + rând `R16-…` în `de_verificat.md`.
   - Nu inventezi textul unei ferestre.
6. **T6** (`:109`) — Alt+↓ în lista Font Size, apoi alegerea cu tastatura, poartă câmpul `activat`, ca la mouse.
   - Drumul cu tastatura al scenariului `word-font-size-lista` trece de pasul 0.
   - Verifici și celelalte liste derulante din Word, cu același gest.
7. **T5** (`:84`) — fără niciun document deschis, panglica e gri ca în Word real (`runde/5/critic_probe/com_r5.json`).
   - Mesajul nu mai spune că „Bold” funcționează.
   - Ce rămâne activ fără document (File, Ctrl+N, Ctrl+O) se ia din referință.
   - ATENȚIE: `panglica.js` e comun. Starea gri o ceri prin API-ul existent sau o păzești pe aplicație (`CICLU_PARALEL.md`), iar regresul Excel și PowerPoint e obligatoriu.

## Ce NU faci
- Nu atingi `excel.js`, `powerpoint.js`, `explorer.js` sau datele lor, nici zona înghețată.
- Nu pornești Word real: dovezile Word sunt deja în `runde/5/critic_probe/` și `referinte/`. WINWORD-ul deschis e al lui Vasile.
- Fără commit, fără push, fără git care scrie.

## Gata înseamnă
- Pentru fiecare dintre cele 8 GRAV, un rând în `raport_constructor.md`:
  - ÎNCHIS, cu dovada de azi (fișierul probei + rezultatul înainte / după);
  - sau NEÎNCHIS, cu motivul verificat.
- `runde/16/proba_grav.py`: verificările picate la pornire și câte pică la final.
- Regresul Word pe toate scenariile `word-*`.
- Regresul Excel / PowerPoint, dacă ai atins un fișier comun.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau `PREDARE` în `stare_autor.md`.
