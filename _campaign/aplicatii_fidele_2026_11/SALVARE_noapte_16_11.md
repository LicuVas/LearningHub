Esti sesiunea de SALVARE a turei de noapte 16->17.11.2026 (lucrarea "Aplicatiile fidele", LearningHub): dirijorul a murit.
Dosarul lucrarii: D = C:\00\Projects\LearningHub_fidel\_campaign\aplicatii_fidele_2026_11  (worktree C:\00\Projects\LearningHub_fidel, ramura fidelitate-aplicatii)

PLANUL NOPTII (doar atat, nimic mai mult): Etapa 0 = instrumentele de masurare (inventar, referinte reale, scenarii, oracole, banca de mutanti,
verdictele vechi ale exercitiilor), verificate de un verificator independent, apoi inghetate cu ingheata.py. NU se construieste biblioteca,
NU se muta lectii, NU se publica nimic pe proba in noaptea asta (aprobarea lui Vasile la raportul de dimineata; implicit merg mai departe la 12:00).

STAREA LA 02:13 (17.11): Etapa 0 construita (9 agenti, gata 02:09); verificatorul a dat REPARATII_NECESARE (D\verificare_etapa0.md, reparatiile 1-14).
Reparatiile ruleaza in workflow-ul D\etapa0_reparatii_workflow.js (3 reparatori pe fisiere disjuncte -> mutantii + bancul intreg -> reverificare;
o singura runda de reparatii in plus daca reverificarea pica). Daca D\reverificare_etapa0.md NU exista sau e partial: reiei de acolo, cu
aceleasi prompturi, agentii in prim-plan. Daca exista cu GATA_DE_INGHETAT: treci direct la ingheata.py (pasul 4).

1. `python C:\00\AI_0\tools\job_etape.py stare --id aplicatii-fidele` -> ce etape sunt bifate. Daca 0-repere e bifata: scrii doar raportul (pasul 5).
2. Citeste D\contract.md (Etapa 0, R1-R13) si D\etapa0_workflow.js (ce trebuia sa produca fiecare agent).
3. Vezi ce exista pe disc: D\inventar.json, D\suprafete.json, D\referinte\, D\scenarii\, D\oracole\, D\mutanti\, D\api_biblioteca.md,
   D\verificare_etapa0.md. `git -C C:\00\Projects\LearningHub_fidel status --short`.
4. Reia DOAR partile lipsa sau goale, cu agenti in PRIM-PLAN (Agent, nu fundal: in `claude -p` fundalul moare la finalul turei), aceleasi
   prompturi ca in etapa0_workflow.js. Apoi verificatorul independent (agent proaspat, nu a scris nimic din ce verifica) -> D\verificare_etapa0.md.
   GATA_DE_INGHETAT -> `python D\ingheata.py` + `python D\ingheata.py --verifica`; commit pe fidelitate-aplicatii DOAR cu caile din D\
   (git -C C:\00\Projects\LearningHub_fidel add <cai> ; nu `add -A`); `job_etape.py gata --id aplicatii-fidele --etapa 0-repere`.
   REPARATII_NECESARE -> o runda de reparatii (agent proaspat) + reverificare; a doua oara tot picat -> te opresti si scrii de ce.
5. Raportul de dimineata: D\RAPORT_DIMINEATA_17_11.md, romana simpla, numerele intai: FACUT (cu dovada) / NEFACUT (cu deblocatorul) / NESIGUR.

Reguli care nu se negociaza: nimic pe master, niciun push (nici pe proba) in noaptea asta; Office real doar invizibil (COM DispatchEx,
DisplayAlerts=0, inchizi doar PID-urile tale; PowerPoint sarit daca POWERPNT.EXE ruleaza deja); nimic pe ecranul lui; probele in browser
blocheaza tot ce nu e 127.0.0.1; nu rulezi probele care scriu pe serverul viu (proba_prezenta, proba_diploma, teste-vasile, lh-api);
date personale 0; cai absolute, fara `cd` (git cu -C).
