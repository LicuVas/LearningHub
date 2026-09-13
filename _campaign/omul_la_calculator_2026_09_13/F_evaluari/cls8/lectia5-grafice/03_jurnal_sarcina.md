# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului pe care îl joc (U11)
Elev de clasa a VIII-a, 13-14 ani, în noiembrie 2026. A făcut formule și funcții, dar **n-a făcut încă sortarea** (în plan ora 10 e sortarea, ora 11 graficele — pe site e invers). Nu a mai făcut un grafic în Excel. Nu știe dacă Office-ul din laborator e în română sau engleză și nu știe ce e setarea regională. Citește lecția pe același PC pe care are Excel (fereastră împărțită sau Alt+Tab). Are 50 de minute, din care primele ~8 se duc pe pornire. Nu vede rezolvările pliate când lucrează. Nu are cont Microsoft personal (ipoteză — de întrebat).

## Pașii, cum i-am făcut (openpyxl.chart + LibreOffice prin H_randeaza.py)
1. **Copiază tabelul.** Blocul „Copiaza” are Tab — pe un Windows în engleză cele 5 note intră ca numere și graficul Column iese bine (axa de la 0 la 9, etichetele 7,2…6,3). **Aici se poate rupe toată ora:** pe Windows în română „7.2” nu e număr. Am încercat ambele variante posibile: ca dată (07.02.2026), graficul are bare între 45.900 și 46.300 și Matematica pare cea mai mare; ca text, COUNT = 0 și graficul nu are nicio bară. Elevul vede un grafic „stricat” și nu are cum să știe de ce — lecția nu spune nimic despre punct/virgulă.
2. **Insert → Charts → Column → 2-D Clustered Column.** Pe Excel în română fila e „Inserați”, iar grupul vorbește de „diagrame”, nu de „Grafice”. Un copil care caută cuvântul „Grafice” nu-l găsește.
3. **Butonul „+” (Chart Elements).** Nici documentația în engleză nu-l numește „Chart Elements”; se cheamă „Adăugare element de diagramă”. Pliantul „Nu gasesti butonul +” ajută.
4. **Change Chart Type → Pie, apoi Line.** Am randat ambele. Pie-ul pe medii arată 5 felii aproape egale (18-23 %) — procente dintr-o „sumă a mediilor” care nu există. Line-ul face o „evoluție” de la Română la Fizică. Pasul 6 întreabă „ce tip ti se pare cel mai clar” și **nu dă răspunsul nicăieri**; atomul 3 condamnă Line-ul pe materii, dar Pie-ul pe medii nu e condamnat nicăieri. Elevul rămâne cu ideea că orice tabel poate fi Pie.
5. **Bonus.** Lecția nu dă notele pentru Chimie/Biologie/Geografie — elevul le inventează (am pus valori marcate în foaie).
6. **Atomul 6, Anatomia.** Pe ecran schema „graficului Column” nu are coloane: barele au 0 px (măsurat în Chromium). Elevul citește „AXA Y”, „LEGENDA” lângă un dreptunghi negru cu patru numere.
7. **Ex. 1** (Column → Bar) merge; **Ex. 2** e de scris (doar bugetul are cifre, suma 100 verificată); **Ex. 3** — linia galbenă pe alb chiar abia se vede în randare, lecția are dreptate.
8. **Provocarea** cere „tabelul din lectie … pentru 5 elevi”; tabelul din lecție are 3. Elevul bun caută 2 elevi care nu există.
9. **Stil 3D** e dat ca opțiune de formatare fără nicio avertizare; randat, citirea înălțimii barelor pe grilă devine aproximativă.

## Unde se blochează un începător (ipoteze AI — de verificat la oră)
- Graficul „cu numere uriașe” sau fără bare după lipire (setare regională).
- Caută „Grafice” / „Inserare” pe o panglică în română.
- Nu găsește „+” pentru că nu a dat clic pe grafic.
- La Pie: „care e felia cea mai mare?” — toate par egale.
- La Bonus: „ce note pun?”.
