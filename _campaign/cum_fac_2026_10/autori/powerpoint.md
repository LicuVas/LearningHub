# Autor „powerpoint” — PowerPoint, clasa a VI-a, lecțiile 1-9 (10.10.2026)

Fișierul: `cum-fac/_sursa/fise_powerpoint.json` · **70 de fișe** · verificatorul
(`node cum-fac/_build/valideaza_fise.mjs fise_powerpoint.json`) → ultima linie **0**.

| Lecția | Fișe | Ce acoperă |
|---|---|---|
| 1 | 0 | nu are gesturi în PowerPoint (vezi mai jos) |
| 2 | 12 | cele cinci zone, alegerea diapozitivului, notele (scrii / arăți-ascunzi), panglica, Sortare diapozitive, Schița, expunerea (de la început, de la cel ales, înainte-înapoi, ieșire), deschiderea prezentării descărcate |
| 3 | 15 | prezentare nouă (goală, cu temă, Ctrl+N), prima salvare, salvare în alt folder, Ctrl+S din nou, Salvare ca, PDF, .ppsx, imagine .png/.jpg, File › Close, ✕, deschidere din PowerPoint, din File Explorer, Activare editare |
| 4 | 8 | substituenți, alegerea unui obiect, diapozitiv nou, aspect (Layout), casetă de text, formă, tabel, imagine din fișier |
| 5 | 8 | dublare, ștergere diapozitiv, ștergere obiect, Ctrl+Z, mutare diapozitiv, copiere obiect, mutare prin tragere, mutare pe alt diapozitiv (Ctrl+X) |
| 6 | 15 | toată caseta aleasă, mărime, aldin, cursiv, subliniat, culoarea literelor, umplere, fără umplere, culoare contur, grosime contur, fără contur, fundal pe un diapozitiv, pe toate, resetare fundal, temă |
| 7 | 9 | tranziție, scoaterea ei, durată, Apply To All, Previzualizare, animație, scoaterea ei, Panou animație (ordinea), Pornire (La clic / Cu / După precedentul) |
| 8 | 2 | fontul temei (Headings/Body), Vizualizarea prezentatorului (Alt+F5) |
| 9 | 1 | imaginea lângă text, cu Two Content |

Cum sunt făcute: datele stau în scratchpad (`ppt/fise_*.py`); `build.py` completează `sursa.cale`, `titlu_pas`,
`clasa`, `lectia` și captura (alt, w, h, legenda) **din digest**, refuză o captură care nu e în pasul-sursă,
verifică ancora, titlul ≤ 70, formulările fără diacritice și nerepetate între fișe, apoi adaugă singur termenii
de bază (diapozitiv, miniatură, filă, galerie, expunere, obiect…) oriunde apar în pași.

## Gesturi văzute în lecții care NU au fișă separată, și de ce
1. **Lecția 1, tot**: caietul, notele, nivelurile; singurul gest pe calculator e „apasă pe lecția scrisă cu
   verde, se deschide într-o filă nouă” (pagina sitului, nu o aplicație). Fără fișă.
2. **L2 (aplicația adevărată, ultimul punct) și L8 (aplicația adevărată, ultimul punct): închizi cu ✕ și alegi „Nu salvați (Don't Save)”, ca prezentarea să rămână
   neschimbată pentru colegul de după tine.** E același gest ca `powerpoint-inchizi-powerpoint` (sursa e L3 p6).
   Regula 2 cere ca bucățile unei fișe să fie din aceeași lecție, deci avertismentul despre coleg (L2/L8) **nu
   e în fișă**. Dirijorul poate decide dacă merită o fișă separată, cu sursa în L2, pentru calculatorul comun.
3. **L2 p6, Vizualizare citire (Reading View)**: lecția spune „nu o folosim”.
4. **L4 p6, structura prezentării; L4 p2, ce fel de obiect e fiecare; sunetul și legătura** („azi doar le
   recunoști”): sunt idei, nu gesturi. Sunetul și legătura nu sunt predate.
5. **L8 p3, alinierea (tragi caseta de chenar până începe sub titlu)**: e gestul din `powerpoint-muti-obiect-tragere`
   (L5 p6); am pus acolo formularea „cum aliniez textul sub titlu”.
6. **L8 p4 lista de verificare, L8 p5 susținerea (privire, ritm, vorbele tale), L7 p7 „ajută sau încurcă”**:
   nu sunt gesturi în aplicație. Pornirea expunerii ca să privești efectele e în fișele din L2.
7. **L9 p2, p3, p5, p6** (cerința, planul pe hârtie, criteriile, punctajul): nu sunt gesturi. **L9 p7**
   (repetiția cu F5, notele) e acoperit de fișele din L2. **L9 în aplicația adevărată, punctul 1** (salvezi imaginile de pe internet în
   Documente, „Nu (No)” la „există deja”): e gest de browser/Windows din clasa a V-a, nu de PowerPoint.
8. **L5 p2, captura meniului de pe miniatură** arată și Cut/Copy/Paste pentru diapozitive: lecția nu le predă
   (predă doar Dublare/Ștergere), deci nu am scris fișă.
9. **L6, aplicația adevărată, punctul 10 („afli mărimea literelor” citind Dimensiune font după clic pe chenar)**: e doar o verificare, nu un gest
   separat. Nu e pus nici în fișa de mărime.
10. **L2, ultimele întrebări ale lecției: „Slide Show → From Current Slide”**: apare doar în întrebările de la final,
    nu în pași, așa că nu l-am folosit (fișa de pornire de la diapozitivul ales are doar butonul din bara de stare).

## Unde nu sunt sigur
- **`powerpoint-fundal-resetare`**: lecția spune doar „Reset Background (Resetare fundal) pune înapoi fundalul
  temei”, în fraza de după „Apply to All, jos în panou”. Am scris „În panou apasă Reset Background”: locul e
  dedus din ordinea frazelor, nu e spus direct. De verificat în PowerPoint.
- **`powerpoint-previzualizare`**: „primul buton din stânga filei” e spus doar pentru Tranziții; pentru Animații
  am scris doar că butonul Preview e pe fila Animații (L7 p7), fără poziție.
- **Termenii** au definițiile luate din toată seria de PowerPoint, nu neapărat din lecția-sursă (de exemplu
  „font = forma literelor” vine din L6, dar e folosit în fișa din L8). Definiția pentru „File Explorer” (din clasa
  a V-a, cerută ca „Ai nevoie de” în L3) nu e scrisă în lecțiile de PowerPoint; e marcată „(clasa a V-a)”.
- **Un gest = o fișă, unde am ales**: Aldin / Cursiv / Subliniat = 3 fișe; umplere, fără umplere, culoare contur,
  grosime contur, fără contur = 5 fișe; „săgeata ▾ de sub Diapozitiv nou” e un pas în `powerpoint-diapozitiv-nou`,
  nu fișă separată; cele trei opțiuni din lista Pornire (Start) sunt o singură fișă (e un singur gest: alegi din listă).
- **Câmpul `scurtatura`** are trei valori compuse: „→ / ←”, „Ctrl+C, Ctrl+V”, „Ctrl+X, Ctrl+V”. Dacă pagina
  așteaptă o singură tastă, inginerul le poate împărți.
- **Capturile**: am pus doar capturi din pasul-sursă (regula 7). Unele fișe au rămas fără captură, deși în alt pas
  al aceleiași lecții există o captură potrivită (de exemplu, bara de stare cu Notes și Slide Show, din L2 p6, pentru
  fișele de note și de expunere de la diapozitivul ales).
- **`powerpoint-deschizi-prezentare-descarcata`** (L2, pasul din aplicația adevărată) e pe jumătate un gest de browser (clic în lista de descărcări).
  L-am păstrat pentru că e primul pas din fiecare lecție de PowerPoint, în aplicația adevărată.
- `powerpoint-activare-editare` are sursa în L3 p7 (unde e predat), deși bara galbenă apare în pasul din
  aplicația adevărată din L2, L5, L6, L7 și L8.
