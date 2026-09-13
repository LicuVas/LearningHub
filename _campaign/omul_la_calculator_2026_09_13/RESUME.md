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

## După cele 25
1. Comparația A/B pe cele 4 lecții ★ — judecător orb (opus), care nu a scris niciuna.
2. Verificare adversarială a semnalărilor blocante/importante (eșantion pe clasă).
3. Sinteza: ce lipsește în M1 (pe clase + transversal), ce trebuie altfel.
4. Lecțiile generale: skill reutilizabil pentru „omul la calculator” la orice lucru AI + regula în `knowledge/learninghub_calitate/00_INDEX.md` (R7) + KB.
