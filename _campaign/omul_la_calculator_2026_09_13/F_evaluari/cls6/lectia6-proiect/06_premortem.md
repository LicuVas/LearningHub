# 06 — Pre-mortem (U14) și explicații alternative (U13) · cls6/lectia6-proiect

> Schița (5 motive) scrisă imediat după pasul 1; completată la pasul 5 cu verificarea făcută.

**Ora a eșuat. De ce?**

1. **Proiectul nu încape în 50 de minute.**
   *Verificat* (`u12_sensibilitate.txt`, formula porții): lecție + Ex.1 + Ex.2 = **110 min** (ritm dublu 59); doar Ex.2, fără nicio lectură de atomi = 54 min (dublu 31); susținerea: 3-5 min × elev → 10 elevi = 30-50 min în plus. Planul orei 9 cere „realizare + susținere” în aceeași oră. **Confirmat** (blocant pe realizare + susținere; pe realizarea singură, doar la ritm provizoriu).
2. **Nu se poate nota.**
   *Verificat* (`u1_notare.md`): 0 puncte în lecție; 18 criterii în 3 locuri, unul dintre ele pliat în rezolvare; 5 criterii nu se văd din fișier (3 doar în Slide Show, 2 doar ascultând). **Confirmat.** Timpul de notare pe clasă (2 min/proiect) e ipoteză nemăsurată.
3. **Proiectul se pierde.**
   *Verificat* (grep în `innerText.txt`): singura mențiune e „fisierul salvat ca .pptx”; 0 × Documents/Desktop/stick; „💾 Salveaza raspunsul” = text în pagină. L1 a predat Ctrl+S cu „Desktop sau Documents”, dar L2-L5 n-au cerut un fișier păstrat (carry-forward lectia5). Dacă fișierul supraviețuiește repornirii = **nu se poate fără sală**, pentru că depinde de setarea PC-urilor (restaurare, profil de elev).
4. **Imagini fără drept / date personale.**
   *Verificat*: rezolvarea Ex.1 propune poză cu echipa (minori identificabili) — date personale (`surse/s_gdpr_imagini.txt`), contra regulii din L3. Imaginile de stoc sunt „libere de drepturi” doar cu Microsoft 365 / parțial Office 2021 (`surse/s_stoc_drepturi.txt`). **Confirmat** pe latura de norme; ce versiune e în laborator = necunoscut.
5. **Proiectul cere ce n-a fost predat.**
   *Verificat* (`04_norma.md`, grep L1-L5): WordArt/SmartArt/aspect personalizat NU sunt cerute. Hyperlinkul intern nu apare în L1-L5, dar e predat în atomul 4 al L6 și e în programă („legături”). PDF-ul e predat în L1 (exerciții). Google Slides nu e predat deloc. **Respins în mare parte**: proiectul nu cere ce n-a fost predat; doar Google Slides și numele temelor „Ion/Facet” sunt nesprijinite.

(6. Izvoare: ora 9 nu există în calendar — `Calendar_ore_VI.md` o comasează în ora 8 + temă acasă — și ipoteza e fără laborator. Plan A pe hârtie: „Încearcă singur” + Ex.1 + susținere cu planul pe o foaie A3 / poster. Verificat în calendar; dotarea = nu se poate fără sală.)

## U13 — explicații alternative pentru semnalările grave

| Semnalare | Explicația mea | Alternativa | Observația care le deosebește — făcută |
|:--|:--|:--|:--|
| Nu încape (cls6-l6-01) | lecția e scrisă ca oră de predare + proiect în aceeași oră | lecția e gândită pe 2 ore (8 și 9): atomii 5-8 = ora 8 „reguli de susținere”, exercițiile = ora 9 | calendarul pune „Reguli de susținere” la ora 8 (`Calendar_ore_6A_6M.md` r. 16) → alternativa e plauzibilă; dar și atunci drumul E (doar Ex.2) = 54 min la ritm provizoriu și susținerea tot nu încape. Împărțirea nu e scrisă nicăieri în lecție („Modul finalizat!” la final). |
| Fără barem (cls6-l6-02) | lecția nu are barem | baremul există în altă parte (fișă profesor, index modul) | grep „barem|punct|criterii” în HTML: doar „Criteriile de evaluare” pliat în Ex.3; nu există fișier de evaluare la clasa a VI-a (`B_context_real.md` §2, ora 10) → alternativa respinsă pe site; o fișă a lui Vasile pe hârtie = de întrebat. |
| PDF pierde linkurile (cls6-l6-05) | afirmația e absolută și greșită | e corectă pentru programul pe care l-a avut autorul în minte | Microsoft: web păstrează, macOS pierde; LibreOffice (măsurat) pierde → ambele parțial adevărate; corect = „depinde de program; verifică”. |
| Poza cu echipa (cls6-l6-04) | rezolvarea încalcă regula datelor personale | e o poză pe care elevul o păstrează local, nepublicată | proiectul se susține în fața clasei și se predă profesorului = prelucrare/afișare; iar L3 interzice explicit date personale reale în prezentare → semnalarea rămâne. |
