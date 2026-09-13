# 06 — Pre-mortem (U14) + explicații alternative (U13) — cls8 / lectia6-proiect

## Schiță (scrisă imediat după pasul 1, cu context proaspăt)
„E 04.12.2026, ora 12 la 8A/8M. Ora a eșuat.” De ce?

1. **Datele lipite nu devin numere.** Blocul „Copiaza” are note cu punct (`7.50`); pe un Windows setat pe română ele devin text sau date calendaristice,
   `AVERAGE` dă #DIV/0! sau valori absurde, graficul iese gol. (Se repetă din L2-L5 — de verificat pe fișierul meu, cu lipire simulată ro-RO.)
2. **Nu încape în 50 de minute.** Lecția spune „15-20 minute” pentru misiune, dar are 6 pași mari + bonus + exerciții + chestionare; plus pornire. (Poarta calculează.)
3. **Elevul nu știe ce n-a fost predat:** Page Layout / antet de pagină, Merge & Center, format Number — nu există oră în VIII-U1 pentru tipar; la Izvoare ora 12 nici nu există (temă acasă, fără laborator).
4. **Fișierul se pierde / nu se poate nota:** „Salveaza fisierul ca Catalog_Clasa8.xlsx” — unde? pe ce PC? cum ajunge la profesor? Nu există barem cu puncte → profesorul nu poate nota 25 de fișiere identice (toți au aceleași date copiate) în mod diferențiat.
5. **Cardul din index spune „Buget Personal”** — elevul/profesorul caută alt proiect; plus traduceri/meniuri engleză (Insert → Column Chart, Page Layout) pe un Office posibil în română.

Alte riscuri de verificat: tragerea `C15` până la `G15` (media pe coloana G = media mediilor — are sens?), selecția B3:B13 + G3:G13 cu Ctrl, date personale în exercițiul „notele tale reale”.

## Completare la pasul 5 — fiecare motiv cu verificarea făcută (U14)
| # | Motivul | Verificarea | Rezultat |
|--:|:--|:--|:--|
| 1 | Datele lipite nu devin numere | `u4_cultura.ps1` → `u4_cultura.txt`; `lipire_roRO_text.xlsx` recalculat | pe ro-RO „7.50” nu e număr (.NET); ca text: toate mediile `#DIV/0!`, COUNTIF 0. **Confirmat ca mecanism; ce face Excel-ul din laborator — nu se poate fără sală** (setarea regională necunoscută). Caseta de ajutor trimite la „Convert to Number”, care pe ro-RO probabil nu apare pentru „7.50” — ipoteză. |
| 2 | Nu încape în 50 de minute | poarta (U12) pe `03_pasi.json` + `masuri.json` (2946 de cuvinte) | poarta: pornire 8 + citire 23,6 + sarcina 59,8 = **91,4 min → nu încape**; la ritm dublu 49,7 min (la limită) → `important`, nu `blocant` |
| 3 | Se cere ce nu s-a predat / ora nu există | `u4_programa.py` → `u4_programa_iesire.txt`; `Calendar_ore_VIII.md` r. 11-13 | Page Layout, antet de pagină, COUNTIF: nu sunt în programă; la Izvoare ora 12 e comasată în temă acasă, fără laborator → **confirmat** |
| 4 | Fișierul se pierde / nu se poate nota | Grep „barem/puncte/grila” în HTML; `Grila_produs.md`; notarea din `03_jurnal_sarcina.md` | lecția nu are barem; locul salvării nespecificat; fișierele celor care urmează pașii sunt identice → grila școlii le dă maximum „De bază” la organizare. Unde salvează elevii — **nu se poate fără sală** (restaurare la repornire? stick?) |
| 5 | Cardul „Buget Personal” + meniuri în engleză | Grep în `index.html`; `surse/*_ro.txt` | card greșit confirmat; 5 nume de meniu verificate pe ro-ro: niciunul nu coincide cu interfața română |
| + | Rezolvarea Ex. 1 | `ex1_dupa_rezolvare.xlsx` recalculat, `u3_verifica.py` | `=AVERAGE(B4:F4)` → 6,125 în loc de 6,4; 14/15 medii greșite, fără nicio eroare vizibilă |
| + | Axa graficului Ex. 2 | `ex2_buletin.pdf` randat | axa pornește la 7,35 → diferențe de 0,15 par duble (în LibreOffice; Excel neverificat) |

## Explicații alternative pentru semnalările grave (U13)
**A. „Rezolvarea Ex. 1 are formula greșită `=AVERAGE(B4:F4)`.”**
- *Alternativa 1:* autorul s-a gândit la un tabel fără coloana Nr. (A = nume, B:F = 5 materii, G = Media) — atunci formula e bună și doar lista antetului e greșită.
- *Alternativa 2:* elevul pune 4 materii, nu 5, și numele în B — formula tot ia B (text, ignorat) și C:F, deci ar da corect.
- *Observația care le deosebește:* enunțul cere explicit „15 elevi cu 5 materii”, iar rezolvarea scrie „Nr., Nume elev, Materia 1...Materia 5” (7 titluri) — deci Nr. există și sunt 5 materii. Am construit varianta cu structura din lecție (Nr. în A, Nume în B, ca la Încearcă): `=AVERAGE(B4:F4)` dă 6,125 față de 6,4 corect (`u5_reproducere.txt`). În alternativa 1, 7 titluri nu încap în A1:F1 — contradicția rămâne. **Semnalarea stă.**

**B. „Status Promovat după media ≥ 5 contrazice regulamentul.”**
- *Alternativa:* lecția folosește promovarea doar ca pretext pentru IF, fără pretenția de regulă reală.
- *Observația:* textul o prezintă ca decizie de catalog („decide daca elevul e promovat sau nepromovat”), într-un catalog pe care „directorul” îl cere. ROFUIP 2024 art. 115 (1) cere minim 5 la fiecare disciplină (`surse/rofuip_2024_art115.txt`); pe datele Ex. 1, 11 elevi ar fi „Promovat” greșit. Lecția nu spune nicăieri „simplificat”. **Stă, ca `important`** (IF-ul în sine e predat corect; regula de domeniu nu).

**C. „Profesorul nu poate nota proiectul pe clasă.”**
- *Alternativa:* profesorul folosește grila școlii (`Grila_produs.md`), deci lecția nu trebuie să aibă barem.
- *Observația:* am aplicat grila pe produsul meu corect: la criteriul 3 („structură dată de profesor”) iese „De bază”, deci nivelul produsului = De bază pentru toată clasa care urmează pașii. Grila funcționează doar pe Ex. 1, iar lecția nu o anunță dinainte, cum cere `SISTEM_EVALUARE.md`. **Stă.**

**D. „Page Layout / COUNTIF nu sunt predate.”**
- *Alternativa:* s-au predat la ora 6 (formatare) sau la lecția 5.
- *Observația:* programa (conținuturile clasei a VIII-a) nu conține tipărire/antet/COUNTIF (`u4_programa_iesire.txt`); lecția însăși zice la COUNTIF „functie noua, dincolo de programa de baza”. Ce s-a predat la ora 6 în clasă — nu se poate fără Vasile; pe site nu există lecție de tipărire. **Stă.**
