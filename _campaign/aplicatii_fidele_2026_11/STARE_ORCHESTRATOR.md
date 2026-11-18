# Starea orchestratorului — „Aplicațiile fidele” (reluat 18.11.2026, 14:59, la cererea lui Vasile)

Cererea (18.11, 14:59, verbatim): „continua acum cu etapa 0. apoi mergi cu urmatoarea”
=> închid Etapa 0 (0-repere), apoi valul B-word (următoarea etapă din catastif).

## Pașii și starea lor (se actualizează la fiecare pas)
1. [în lucru 15:03] Reverificarea 2 a Etapei 0: agent proaspăt (opus), fără nimic scris în Etapa 0.
   Verifică reparațiile 1-5 din `reverificare_etapa0.md` (făcute 17.11 07:01-07:12, neverificate), reia TOT bancul de mutanți
   (~1 h), rulează O1-O9 + porti.py pe worktree, `ingheata.py --arata`. Ieșire: `reverificare2_etapa0.md`, verdict pe ultima linie.
2. GATA_DE_INGHETAT -> `python D/ingheata.py` + `--verifica` (= 0) -> commit pe `fidelitate-aplicatii` DOAR cu căile din D
   (fără `add -A`, fără push) -> `job_etape.py gata --id aplicatii-fidele --etapa 0-repere`.
   REPARATII_NECESARE -> o rundă de reparații (agent proaspăt, doar reparațiile obligatorii) + reverificare 3; a doua picare = stop, scriu de ce.
3. Valul B-word: `python D/pregateste_runda.py 1 --etapa B --aplicatia word` -> D/runde/1/prompt.md (+ supliment: biblioteca
   `aplicatii/` nu există încă; runda 1 = scheletul §1-§8 din api_biblioteca.md + Word, pe aplicatii/poligon.html).
   Rundele: agentul rundei face pașii 1-7 și 10a (fără critic); orchestratorul pornește CRITICUL RECE (agent separat, pasul 8),
   apoi publicarea (pasul 9: commit, merge origin/proba, re-măsurare, push fast-forward pe proba, nonce văzut live) și jurnalul + opreste.py.
4. Reguli: nimic pe master; push doar `fidelitate-aplicatii:proba`, fără --force; probele în browser doar 127.0.0.1; nimic pe ecranul lui;
   Office doar invizibil; date personale 0. Catastif: `job_etape.py semn --id aplicatii-fidele` la fiecare pas.

## Jurnalul orchestratorului
- 18.11 15:00 semn de viață; buget VERDE (19%); POWERPNT nu rulează; treaz.py --ore 10 pornit.
- 18.11 15:05 paza_noapte.py pornită ascuns (pid 27496; păzește dirijorul 11680; salvare = D\SALVARE_18_11.md; până 05:30, oprire 08:00).
- 18.11 15:10 suplimentul rundei 1 B-word scris: D\runde\supliment_B_word_runda1.md. Aștept verdictul reverificării 2.
