# Reluare — campania „Omul la calculator” (13.09.2026)

**Cererea (Vasile, 13:15):** ce verifică un om specialist când lucrează la calculator; ia lecțiile M1 de TIC din LearningHub
una câte una și vezi ce lipsește / ce ar trebui altfel; învață din asta — evaluarea „umană” — și fă AI-ul să sară mai puțin.
Lucrează până termini sau până zice stop.

## Starea NU se citește de aici — se re-derivă
```bash
python C:/00/Projects/LearningHub/_campaign/omul_la_calculator_2026_09_13/G_poarta.py C:/00/Projects/LearningHub/_campaign/omul_la_calculator_2026_09_13/F_evaluari --astept 25
```
Lista completă a celor 25 (ordinea din lanț, în interiorul clasei):
- cls5/m1-sisteme: lectia1-calculator, lectia2-hardware★, lectia3-software, lectia4-ergonomie, lectia5-reguli, lectia6-proiect
- cls6/m1-prezentari: lectia1-powerpoint-intro, lectia2-slide-uri, lectia3-text-imagini★, lectia4-animatii, lectia5-tranzitii, lectia6-proiect
- cls7/m1-word-fundamente: lectia1-interfata-word (pilot), lectia2-formatare-text, lectia3-paragrafe, lectia4-liste, lectia5-tabele★, lectia6-evaluare
- cls8/m1-excel-fundamente: lectia1-interfata, lectia2-date, lectia3-formule★, lectia4-functii, lectia5-grafice, lectia6-proiect, lectia7-sortare

★ = lecțiile auditate și de controlul „AI obișnuit” (`../omul_la_calculator_2026_09_13_CONTROL/C_baseline/`) → comparația A/B.

## Mecanica
- Un subagent (opus) = o lecție. În paralel pe clase, în ordine în interiorul clasei (jurnalul `F_evaluari/<clasa>/JURNAL.md` trece lecția mai departe).
- Protocolul: `E_protocol_v2.md` (v2.2). Poarta: `G_poarta.py`. Unelte: `H_vede.py`, `H_randeaza.py`.
- Amprentele uneltelor: `../omul_la_calculator_2026_09_13_CONTROL/hash_unelte.txt` — la final se compară (un agent nu are voie să-și modifice poarta).
- `git status -- content` trebuie să fie curat la final (evaluatorii nu ating lecțiile).

## Stare 15:50 (de re-verificat din fișiere)
- A/B orb FĂCUT: `O_comparatie_AB.md` — v2 „om la calculator”: 44 adevărate / **0 false** / 20 schimbă ora; control: 90 / 4 false / 21; unice importante 3 vs 8. Scor judecători 2–2.
  Concluzie: v2 repară axa VERIFICARE, strică axa ACOPERIRE.
- Test remediere PORNIT: `P_protocol_hibrid_v3.md` (două treceri) pe cele 4 lecții → `P_hibrid/<lectie>/`.
  De punctat: recall față de adevărul judecătorilor (`O_orb/<lectie>/judecata.json`: probleme cu verdict adevarat + ce_au_ratat_amandoua) + false noi (verificate).
- Clase de defect pe tot situl: `K_rezolvari_nepotrivite/K_raport.md` (100 suspecte, triaj), `M_intrebari_decalate/M_raport.md` (73/525 pagini, 20% fals-pozitiv).

## După cele 25
1. Comparația A/B pe cele 4 lecții ★ — judecător orb (opus), care nu a scris niciuna.
2. Verificare adversarială a semnalărilor blocante/importante (eșantion pe clasă).
3. Sinteza: ce lipsește în M1 (pe clase + transversal), ce trebuie altfel.
4. Lecțiile generale: skill reutilizabil pentru „omul la calculator” la orice lucru AI + regula în `knowledge/learninghub_calitate/00_INDEX.md` (R7) + KB.

## Strat 13.09.2026 seara — faza 2 (cererea 17:43: „Office RO sau EN, virgulă și punct și virgulă, calculatoarele nu se resetează — fă modificările pe site”) — ÎNCHISĂ
Commit-uri LearningHub (toate publicate, dovadă: conținut live == git HEAD 28/28, `S_reparatii/D_live.py`):
- `73b1d1d4` motor: răspunsuri scrise pe profil + butonul „Sunt alt elev” + fără „Corect!” sub „Incorect”
- `bb1f3b46` 25 de lecții reparate (nume RO (EN), ambele separatoare, salvare Clasa_Nume, chestionare) — verificator independent 25/25 fără blocante/importante; `S_poarta.py --toate` 25/25
- `60cb647f` diacritice: 25 de lecții (`D_toate.py` 25/25) + 194 texte din 15 fișiere JS comune; verificare independentă 4 lecții/4.632 cuvinte → 3 greșeli + 7 scăpări, reparate; `D_final_randare.py` 25/25
Re-derivă starea: `python S_reparatii/S_stare.py` · `python S_reparatii/D_toate.py` · `python S_reparatii/D_live.py`
DESCHIS (de știut, nu blocant): greșeli de tipar care cer litere în plus (ordoneza, bifeza, Recreaza, evidentiare...) sunt în `S_reparatii/<cls>/<lectia>/diacritice/observatii.md` — val de corectură separat; breadcrumb-ul și `<title>` rămân fără diacritice (regula sitului; breadcrumb-ul vine din scriptul lecției); `now-data.js`/`school-year.js` sunt generate — diacriticele lor se pun la sursă; `active-module.js:128` caută /in curs/i în HTML.
