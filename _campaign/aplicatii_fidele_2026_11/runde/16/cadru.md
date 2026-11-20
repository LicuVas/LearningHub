# Runda 16 · Word · cadrul (scris înainte de orice reparație)

**Pasul zero, pe codul de azi** (`proba_grav.py` → `proba_grav_inainte.json` / `.log`): **18 din 20 de verificări pică**. Toate cele
8 GRAV din `runde/5/critic.md` se reproduc azi, la fel ca la critic (rundele Excel 6-10 și PowerPoint 11-14 nu le-au atins):
- S1: bara de adrese rămâne „Descărcări” după a doua navigare (Save As și Open);
- S2: F12 pe club-lectura deschis din Descărcări → bara „Documente”, se salvează în Documente;
- S5: lista Save As are 8 rânduri goale; clicul pe rând nu face nimic;
- S4: a doua deschidere dă `documente_deschise 2`; atelierul se termină cu `docs 1`;
- S6: Ctrl+N dă mereu „Document1”; F12 pe documentul gol propune „Document1.docx”;
- S3: „Pop?Mihai”, „Pop_Mihai:7A” etc. se salvează (pe F12, Save this file și PDF);
- T6: Alt+↓ în Font Size nu poartă `activat`; pasul rămâne 0 și bula stă pe ecran (și pe drumul KeyTips Alt, H, F, S);
- T5: fără document, panglica e toată activă; Bold / Ctrl+B / F12 / Ctrl+S… spun „În aplicația reală, „X” funcționează”.
Trec deja (regres): drumul lecției F12 › Documente; Ctrl+N / Ctrl+O / Ctrl+F12 fără document.

## Presupuneri (despre suprafețele alese: ferestrele de fișiere ale lui Word și Word fără document)
1. Fereastra Save As și fereastra Open sunt aceeași fereastră Windows de fișiere: bara de adrese, panoul din stânga și lista
   arată TOATE același folder, cel în care se va salva / din care se deschide (`uia_word.json › dialog.FileSaveAs` și `dialog.open`:
   ToolBar „Adresă: Documente” + List „Vizualizare elemente”).
2. Word ține minte, pentru fiecare document, folderul lui; F12 pornește din el (Word real prin COM: `com_r5.json ›
   deschis_din_descarcari_propus_F12` = calea din Descărcări). Pentru documentul nou, folderul ferestrei din referință („Documente”).
3. O tastă care face același lucru ca un clic trebuie să lase aceeași urmă în evenimente (`activat`, api §4), altfel asistentul și
   verificarea lecției văd alt drum decât al mouse-ului.
4. Fără document, Word real nu face nimic la comenzile de document (`com_r5.json › activ_fara_document`: Bold … FileClose = false),
   deci simulatorul nu are voie să spună că ele „funcționează”.
5. Ce nu e în referință (textul ferestrei de eroare la nume, ce arată lista Save As la alt tip, cum arată Word gol) NU se inventează:
   mesajul central + rând în `de_verificat.md`.

## Citirile lui „fidel” pe suprafața asta
- **A. stare finală** — același gest dă aceeași stare (`folder_fisier`, `documente_deschise`, `titlu_fereastra`, `fisiere`).
- **B. gest de tastatură** (unghiul rundei) — tasta (Alt+↓, Ctrl+N, F12, Ctrl+B fără document) are efectul tastei din Word real și
  aceeași urmă în evenimente ca gestul de mouse echivalent.
- **C. aspect** — ce se vede (bara de adrese, rândurile listei, comenzile gri, titlul „Document2”) e ce arată Word real.

**Aleasă: B + A, cu C doar unde ecranul minte despre stare.** De ce pierd celelalte:
- C singură ar repara bara de adrese și griul, dar ar lăsa salvarea în alt folder (S2), fișierul cu „?” (S3) și documentul dublu
  (S4) — elevul ar vedea corect și ar ajunge la altă stare în laborator.
- A singură ar trece verificările lecției, dar ar lăsa Alt+↓ fără `activat` (T6) și mesajul fals „funcționează” (T5) — exact
  ce măsoară unghiul `gest_tastatura`.
- B + A acoperă toate cele 8; C intră doar acolo unde ecranul contrazice starea (bara de adrese, lista, titlul, panglica gri).
