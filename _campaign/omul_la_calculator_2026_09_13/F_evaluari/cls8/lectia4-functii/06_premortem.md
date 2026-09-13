# 06 — Pre-mortem (U14) și explicații alternative (U13)

Schița scrisă după pasul 1 (context proaspăt), completată la pasul 5 cu verificările făcute.

## „Ora din 06.11 (Brauner) a eșuat. De ce?” — 5 motive

| # | Motivul | Verificarea făcută / rezultatul |
|--:|:--|:--|
| 1 | **Elevul face exact ce scrie lecția și vede alte cifre.** „Schimba nota din B4 din 10 in 3” — în B4 e 5; scenariul atomului 8 („Schimbam B7 din 4 in 10”) — în B7 e 6. | Foaia construită după lecție + recalculată de LibreOffice: 10 e pe rândul 5, 4 pe rândul 8 (`u5_reproducere.txt`, `recalculat/incearca_note.xlsx`). B7 → 10 dă MIN 4 și media 7,75, nu 5 și 8 cum spune tabelul. **CONFIRMAT.** |
| 2 | **Nu încape în 50 de minute**: două ore din plan (funcții + decizie), 3.685 de cuvinte, 9 atomi, 3 exerciții. | Poarta calculează din `03_pasi.json` + `masuri.json` (vezi ieșirea porții). Plan: ora 8 și ora 9 separate (`01_citit_inapoi.md`). **CONFIRMAT** (verdict: nu încape). |
| 3 | **Separatorul**: `=IF(B2>=5, "Promovat", "Corigent")` și `=MIN(B2, B5, B8)` cu virgulă; pe Windows în română separatorul de listă e „;” și formula tastată cu virgulă nu e acceptată. | Pe acest PC ro-RO: separator listă „;” (`F_evaluari/cls8/lectia2-date/u4_cultura.txt`, refolosit în `u4_cultura.txt`). Setarea din laborator: **nu se poate afla fără sală**, pentru că nimeni n-a notat regiunea Windows a PC-urilor din sala 1 (TIC). |
| 4 | **Bonusul „șterge o notă și compară COUNT cu COUNTA” nu arată nicio diferență.** | `recalculat/incearca_note.xlsx`, foaia Bonus_sters: COUNT = 7, COUNTA = 7. Diferența apare doar dacă nota e înlocuită cu text („absent”). **CONFIRMAT.** |
| 5 | **Butonul „Function Wizard” / „Asistentul de functii” nu se găsește cu acest nume; „Home -> Number” nu există pe o interfață în română.** | Microsoft: „Insert Function” / „Inserare funcție”; „Function Wizard” = 0 apariții în en-us (`surse/fx_en.txt`); ro-ro: „Număr de pornire > … Mărire zecimală” (`surse/zecimale_ro.txt`). Limba interfeței din laborator: **nu se poate afla fără sală**. |

## U13 — explicații alternative pentru semnalările grave

### A. Adresele greșite (B4 / B7)
- **Alternativa 1:** elevul numerotează notele de la B1 (fără antet), deci „B4” ar fi a patra notă (10) și „B7” a șaptea (4) — lecția ar fi corectă pentru o foaie fără antet.
  **Observația care le deosebește:** pasul 1 al Încearcă cere antetul „Nota” în B1 și notele în B2:B9; toate formulele lecției folosesc `B2:B9`. Recitit în `innerText.txt` 66 și 265 → foaia are antet, deci alternativa cade: cu B2:B9, a patra notă e în B5.
- **Alternativa 2:** e doar o scăpare în text, iar valorile din tabel sunt totuși cele pe care le vede elevul.
  **Observația:** am executat pasul literal (B7 → 10): MIN rămâne 4, media 7,75 (`u5_reproducere.txt`). Tabelul „Dupa (cu 10)” = 5 și 8 corespunde doar schimbării lui B8. Deci elevul care execută ce scrie vede alte cifre decât tabelul — nu e doar cosmetic.

### B. Timpul
- **Alternativa:** ritmurile porții sunt provizorii; clasa citește mai repede, iar atomii 1-2 sunt deja cunoscuți (SUM în lecția 3).
  **Observația:** poarta tipărește și varianta la ritm dublu; dacă și aceea depășește, ora nu încape oricum. Semnalarea rămâne `important`, nu blocant, tocmai pentru că ritmurile nu sunt calibrate.

### C. Bonusul COUNT/COUNTA
- **Alternativa:** poate lecția vrea ca elevul să observe că **nu** e nicio diferență (ambele scad).
  **Observația:** pliantul „Ce diferenta am gasit intre COUNT si COUNTA?” spune „Daca stergi o nota, COUNT scade cu 1” și concluzionează „COUNT ≤ COUNTA mereu!” — adică se așteaptă la o diferență pe care pasul nu o produce (foaia Bonus_sters: 7 și 7). Alternativa cade.

## U17 — sala reală
- **Brauner (8A/8M, sala 1 TIC, vineri 11:00):** ora se poate ține dacă există un program de calcul tabelar; dotarea e necunoscută.
- **Izvoare (VIII, marți 8:00, fără laborator — ipoteză de lucru):** pe hârtie merg: atomii 1-5 și 8 (calcule de mână: MIN/MAX/medie/COUNT pe 8 note — toate verificate aici), tabelul IF (8/5/4/2), Ex. 1 calculat în caiet, Ex. 3 integral. Nu merg fără calculator: butonul fx (atomul 6), actualizarea automată (pasul 6), Ex. 2 ca fișier. De pregătit: tabelul cu notele scris pe tablă cu adresele corecte (B2…B9), o fișă cu Ex. 3.
