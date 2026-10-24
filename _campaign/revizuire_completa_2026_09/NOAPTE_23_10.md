# Tura de noapte 23→24.10.2026 — M3 la toate clasele de gimnaziu

> Cererea lui (23.10, 23:34): „munca de noapte. avem mult credit care se reseteaza in doua zile. Foloseste skillurile necesare pentru a adauga pe learninghub lectiile din modulul 3 la toate clasele de gimnaziu - cu aceeasi structura si rigurozitate ca pana acum. Nu astepta confirmari”
> Contract: `m3_noapte_23_10\contract.md` · prompturi: `m3_noapte_23_10\prompturi\` (`_noapte.md` + câte unul pe lecție, peste `noapte_10_10\prompturi\_comun.md`, `luni_12_10\prompturi\_zi.md`, `m3_19_10\prompturi\_m3.md`) · granițe: `m3_noapte_23_10\granite\` · agenții: `m3_noapte_23_10\agenti.md` · jurnalul: `04_ORCHESTRARE.md` (secțiunea „23→24.10.2026”).

## Planul
- **Val B (pornit 23:58):** autori V/17, V/19, VI/18, VII/18, VII/21, VIII/18, VIII/19, VIII/20 + terminarea reparațiilor VI/16 (r2) și VIII/16 (r3) + trecerea de text VII/16-17 (S, Y, Z).
- **Val C** (când lecțiile de care depind au ieșit din prima judecată): V/20, V/21 (pe `paint.js` + extensia V/19) · VI/19, VI/20 (pe simulatorul Scratch al VI/18) · VII/19, VII/20 (pe simulatorul VII/18) · VIII/21 (mini-proiect, după 18-20). Prompturile se scriu din șablonul celor din val B (`a_*.md`), cu granițele reale ale lecțiilor de dinainte.
- **Val D:** VI/21 (după VI/20).
- Lanțul pe lecție (`08_RELUARE.md` §3): autor opus → J1 pereche opus + sonnet (`noapte_10_10\prompturi\_judecator.md` + prompt `j1_<lecție>.md`) → reparare la autor PROASPĂT (cu `_verificare\registru_j1.md`) → J2 opus pe registru (`m3_19_10\prompturi\_judecata2.md`) → … până la 0 GRAV / 0 MAJOR pe opus → trecere scurtă de text pentru minorele de siguranță/fapte → `publica_lectie.py` (în fundal, `timeout 5400`).
- Publicare: `08_RELUARE.md` §4. VII/15 (o frază, modificată pe 19.10) se publică ÎMPREUNĂ cu VII/16 + VII/17.

## Gărzi
- Depozitul e folosit și de alte sesiuni: înainte de push, `git -C C:/00/Projects/LearningHub log origin/master..master --oneline` — doar commiturile lecțiilor. Nu comite niciodată `cum-fac/`, `_campaign/cum_fac_2026_10/`, `curriculum/school_year_2026_2027.json`, `_backup_local/`.
- Catastiful: `python C:\00\AI_0\tools\job_etape.py stare` (lucrările `lhm3n_<clasa><nr>`, etape: autor, judecata, publicat).
- Paza: `tools\paza_noapte.py` detașat păzește dirijorul (claude.exe PID 30368); salvarea = `claude -p` cu `C:\00\AI_0\data\paza_noapte\prompt_salvare_lh_m3n.md`.

## Dacă ești sesiunea de SALVARE (pornită de paza_noapte)
1. `python C:\00\AI_0\tools\job_etape.py stare` + `python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/dirijor/stare.py --modul M3` + ultimul `_verificare\judecatorN.md` al fiecărei lecții M3 în lucru (`lectii\{v,vi,vii,viii}\m3-lNN\`). Ultimele rânduri din `04_ORCHESTRARE.md` spun unde a rămas dirijorul.
2. Lecțiile cu ultima judecată opus 0 GRAV / 0 MAJOR → trecerea de text (dacă au minore de fapte/siguranță) → publicare. Lecțiile cu GRAV/MAJOR → reparare cu autor proaspăt → judecata următoare pe opus. Lecțiile fără draft → autor (promptul din `m3_noapte_23_10\prompturi\`; dacă lipsește, îl scrii după șablonul celor existente).
3. Publică după `08_RELUARE.md` §4, cu gărzile de mai sus. Scrie `DIMINEATA_24_10.md` (FĂCUT cu dovada văzută / NEFĂCUT cu ce-l deblochează / NESIGUR + deciziile care îl așteaptă pe Vasile), în cuvinte simple. Închide lucrările terminate (`job_etape.py inchide`).
