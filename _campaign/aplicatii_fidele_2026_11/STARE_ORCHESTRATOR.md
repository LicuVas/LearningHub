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
- 18.11 17:10 reverificarea 2 = GATA_DE_INGHETAT (66/68, fiecare oracol >= 5). ingheata.py -> repere.lock 306 fisiere, amprenta 14eed9addab7efde, --verifica 0.
- 18.11 17:11 commit be0ae421 pe fidelitate-aplicatii (doar D + .gitignore; fara push). Catastif: 0-repere BIFAT. PASUL 1 si 2 = FACUTE.
- 18.11 17:13 PASUL 3 in lucru: runde/1/prompt.md generat (B, word, unghi gest_tastatura); constructorul rundei 1 pornit (agent opus, fundal).
  Urmeaza la notificare: daca PREDARE -> constructor proaspat din runde/1/stare_autor.md; daca GATA_PENTRU_CRITIC -> criticul rece (pasul 8), apoi publicarea (9) si jurnalul (10).
- 18.11 19:14 Constructorul rundei 1 = GATA_PENTRU_CRITIC (670k context, 2 h 03 min). Dupa: O4 162->128 (Word 74->10), O5 201->154, O9 48->41, O7 355->794 REGRES, restul egale, porti 41, lacat 0. Biblioteca aplicatii/ pe disc, NECOMISA.
  HOTARARE: O7 +439 = defect de instrument (oracol_text_ui.py:29-43,63-65 comuta GLOBAL pe biblioteca la primul aplicatii/*.js, desi nicio lectie n-o incarca in etapa B); O4 Explorer 18 scenarii neexecutabile = joaca() nu trece la pagina urmatoare cand biblioteca n-are aplicatia (oracol_comportament.py:382-384). NU dau inapoi biblioteca (regula pasului 7 ar face etapa B imposibila).
  => runda ACOPERIRE pe instrumente (agent separat de constructor): O7 judeca biblioteca doar pe paginile care o incarca, O4 cade pe paginile vechi; dovezi: O7 citat cu citat = iesiri_pornire (355), O4 Explorer = pornire, Word = dupa, bancul de mutanti O4+O7 aceleasi prinderi, ingheata --acoperire. In paralel: CRITICUL RECE (pasul 8) pe Word, unghi gest_tastatura.
- 18.11 19:17 pornite in fundal: CRITICUL RECE (scrie runde/1/critic.md, ultima linie GRAV: n) + agentul ACOPERIRE pe instrumente (scrie runde/1/acoperire_instrumente.md, ultima linie INSTRUMENTE_REPARATE / NU_SE_POATE).
  Urmeaza: ambele gata -> daca INSTRUMENTE_REPARATE: re-masor O4+O7 (--doar) pt randul din jurnal; daca GRAV=0 -> publicarea (pasul 9, masurare intreaga pe unire); daca GRAV>0 -> fara publicare, rand in jurnal.jsonl (critic_grav_deschise=n), opreste.py -> runda 2 (constructor PROASPAT, cu critic.md ca tinta).
- 18.11 19:29 CRITICUL RECE runda 1 = GRAV: 6 (runde/1/critic.md): 1 tastatura de telefon cu compunere dubleaza literele (aplicatii.js:370-377); 2 tastele trec in document cu Backstage/dialog deschis; 3 Font Size nesimulat (lectia vii/m2-l10, R12); 4 Ctrl+S pe document nou = mesaj central (lectia vii/m1-l03, R12; 'Save this file' fara referinta); 5 tastele de acces fabrica dublu_clic (api 4, 6.3); 6 majuscula automata lipsa pe telefon. => FARA publicare in runda 1; GRAV-urile = tinta rundei 2. Astept agentul acoperire.
