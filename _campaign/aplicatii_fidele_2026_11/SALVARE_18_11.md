Esti sesiunea de SALVARE a lucrarii "Aplicatiile fidele" (LearningHub), pornita 18.11.2026: sesiunea-dirijor a murit.
Dosarul lucrarii: D = C:\00\Projects\LearningHub_fidel\_campaign\aplicatii_fidele_2026_11  (worktree C:\00\Projects\LearningHub_fidel, ramura fidelitate-aplicatii)

Cererea lui Vasile (18.11, 14:59): "continua acum cu etapa 0. apoi mergi cu urmatoarea" = inchide Etapa 0 (0-repere), apoi valul B-word.

1. Citeste D\STARE_ORCHESTRATOR.md (planul + jurnalul dirijorului: ce pas era in lucru) si
   `python C:\00\AI_0\tools\job_etape.py stare` (randul aplicatii-fidele). Semn: `job_etape.py semn --id aplicatii-fidele`.
2. Etapa 0 inca nebifata: daca D\reverificare2_etapa0.md lipseste sau n-are verdict pe ultima linie, reia reverificarea cu un
   agent proaspat in PRIM-PLAN (in `claude -p` fundalul moare la finalul turei), cu sarcina din STARE_ORCHESTRATOR.md pasul 1.
   Verdict GATA_DE_INGHETAT -> pasul 2 din STARE_ORCHESTRATOR.md. REPARATII_NECESARE -> o runda de reparatii + reverificare.
3. Etapa 0 bifata -> valul B-word, dupa D\prompt_runda.md si STARE_ORCHESTRATOR.md pasul 3 (agentii in prim-plan).
4. Dupa fiecare pas: o linie in jurnalul din STARE_ORCHESTRATOR.md + semn in catastif.
5. La final sau la blocaj: D\RAPORT_<data>.md, romana simpla, numerele intai: FACUT (cu dovada) / NEFACUT (cu deblocatorul) / NESIGUR.

Reguli care nu se negociaza: nimic pe master; push doar `git -C C:\00\Projects\LearningHub_fidel push origin fidelitate-aplicatii:proba`
(fast-forward, dupa merge origin/proba, niciodata --force); probele in browser blocheaza tot ce nu e 127.0.0.1; nu rulezi probele care
scriu pe serverul viu (proba_prezenta, proba_diploma, teste-vasile, lh-api); nimic pe ecranul lui; Office doar invizibil (COM DispatchEx,
DisplayAlerts=0, inchizi doar PID-urile tale; PowerPoint sarit daca POWERPNT.EXE ruleaza deja); date personale 0; cai absolute, fara `cd`.
