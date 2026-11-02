# Tura de noapte 01→02.11.2026 — M4 la a V-a și a VI-a (planul pe disc)

Cererea (01.11, 22:55, `/bucla`): „mai avem 43% pentru vreo 12 ore. continua pe learninghub cu lectii.” Contractul: `m4_noapte_01_11\contract.md`.

## Ce se face
1. **V/22** — probele finale rerulate (`lectii\v\m4-l22\_proba\proba_reparatii_9_run.txt`, `parcurge_r9_run.txt`, ultima linie `exit=0` și 0 probleme), apoi `python dirijor\publica_lectie.py v/m4-l22` → marcaje LIVE + fum.
2. **6 lecții noi** (V/23, V/24, V/25, VI/23, VI/24, VI/25) pe lanțul din ghid (I.6): autor opus → J1 pereche (opus + sonnet) → R1 autor PROASPĂT → J2 opus pe registru → (T2 / J3 …) până la 0 GRAV / 0 MAJOR → `publica_lectie.py` → LIVE.
3. Valul B (V/26, VI/26) doar dacă la ~03:00 `consum.py` permite (7 zile < 75 %) și J1 din valul A s-a terminat.
4. Dimineața: `DIMINEATA_02_11.md` (FĂCUT / NEFĂCUT / NESIGUR), jurnalul `04_ORCHESTRARE.md`, fișa de memorie, `curata_mru_office.py --sterge`, catastiful închis, T1 (`reprompt`) peste raport.

## Unde e starea
- Catastiful: `python C:\00\AI_0\tools\job_etape.py stare` (lucrările `lhm4n_*`; etapele autor → j1 → reparare → judecata_finala → publicat).
- Registrul agenților: `m4_noapte_01_11\agenti.md`.
- Pe lecție: `lectii\<cls>\m4-lNN\_proba\stare_autor.md` (nota de predare), `_verificare\judecatorN.md` + `registru_j1.md`.
- Calculat: `python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/dirijor/stare.py --modul M4`.

## Prompturile
`m4_noapte_01_11\prompturi\`: `_noapte_01_11.md` (ce e altfel în noaptea asta), `a_<cls><nr>.md` (autori), apoi `j1_*`, `r1_*`, `j2_*` pe măsură ce se scriu. Șabloanele de judecată / reparare: `m4_26_10\prompturi\j1_*.md`, `r1_*.md`, `_judecata2.md`, `t2_*.md`.

## Gărzile (nu se negociază)
- Nimic pe ecranul vizibil; Paint / aplicațiile din Magazin / Chrome / Edge reali NU se pornesc; Office doar pe desktopul ascuns, sub lacăt. Un WINWORD.EXE străin rulează: nu se atinge.
- `activitate.py lista | grep -c "nu e în catalog"` = 0 (start, 23:00) — la fel la final. `learninghub_date_personale.py` → 0.
- Publicare doar prin `publica_lectie.py`; `git add` doar pe căi numite; înainte de push `git -C C:/00/Projects/LearningHub log origin/master..master --oneline` (nimic străin).
- Bugetul: `consum.py` la :13 / :43; peste 95 % pe 7 zile niciun agent nou; peste 97 % nimic. Resetarea ~11:00.
- Nicio oprire de proces după NUME; doar PID-urile proprii.

## Dacă ești sesiunea de SALVARE
Te-a pornit `tools\paza_noapte.py`, pentru că dirijorul a murit (agenții lui au murit cu el). Citește acest fișier, contractul, `job_etape.py stare` și, pe fiecare lecție, `_proba\stare_autor.md` + ultimul `_verificare\judecatorN.md`. Ce e bifat e gata; ce nu, reiei cu un agent PROASPĂT („continuă de unde a rămas predecesorul; verifică întâi ce e pe disc”). Agenții îi rulezi în PRIM-PLAN (în `claude -p` fundalul moare la finalul turei). Nu publici o lecție fără 0 GRAV / 0 MAJOR de la un judecător opus. Nu închizi tura până când lecțiile începute sunt publicate sau oprite curat cu motivul scris, sau până la 10:00. La final: `DIMINEATA_02_11.md` + intrare în `04_ORCHESTRARE.md` („sesiunea de salvare a preluat la <ora>”).
