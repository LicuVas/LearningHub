# STARE — „Cum fac…?” (nota de reluare; dirijorul o ține la zi după fiecare val)

Contract: `contract.md` (aprobat 10.10.2026 21:51, toate implicitele). Specificația comună: `SPEC.md`.

## Valuri
- [x] 0. Extractor (`_unelte/extrage_lectii.mjs` → `digest/`, 42 lecții, 277 capturi, 0 erori) · verificator fișe
      (`cum-fac/_build/valideaza_fise.mjs`, prinde 5/5 defecte injectate) · `push_ready` → POT PUBLICA SINGUR.
- [x] 1. (pornit ~21:55) 5 autori → 281 de fișe (`cum-fac/_sursa/fise_<grup>.json`, rapoarte `autori/`), verificator 0,
      126 cu captură · lista independentă: 288 gesturi (`_independent/gesturi.json`) · inginer → cautare.js,
      sensuri.json, build.mjs, index.html, `_teste/` (`inginer.md`).
- [x] 2. (până ~22:35) set_ascuns 354 (317+37, `_ascuns/`) · set_dezvoltare 219 (194+25) · acoperire 98,6% (4 lipsuri
      de browser → adăugate) · judecata 1: 2 GRAV, 138 MEDIU (mult G5 → glosar comun `termeni.json`), 49 MINOR ·
      reparații pe toate grupurile (`_verificare/reparatii_*.json`), verificator 0 pe 285 fișe.
      Dev înainte de reglaj: top1 82,0%, top3 90,2%, în afară 23/25; exemplele profesorului 8/8.
- [x] 3. (până ~23:15) reglaj dev 94,3/97,4 (A 96,9/100, B 91,8/94,8), în afară 23/25 (`reglaj.md`) · glosar 185,
      0 fișe neacoperite · afirmații: 685/856 legate de probe, 171 nelegate → `_verificare/afirmatii_nelegate.json` →
      verificare în surse Microsoft (PORNITĂ) · judecata 2: Word/PPT 51/51 țin + 5 noi mici; Excel/Win 56/57 + 6 noi
      (1 MEDIU) · elev de probă (30 fișe, sămânța 20261011, `_proba_elev/`): cl. V 25 OK/4 INCURCA/1 BLOCAJ;
      cl. VII 20 OK/10 INCURCA/0 BLOCAJ.
      **SETUL ASCUNS, prima măsurare (date.js eddea7afd594): locul 1 76,3% (trece), primele 3 84,9% (PICĂ R4),
      în afară 31/37 (PICĂ R6 proporțional).** Dirijorul a văzut doar cifrele agregate și pe tipuri.
- [ ] 4. PORNIT ~23:20: auditor set ascuns (`_ascuns/audit_set_ascuns.json`, setul original neatins, cifre înainte/după)
      · set de reglaj nr. 2 (opus, greu, 260+45 → `cum-fac/_teste/set_dezvoltare_2.json`). Urmează: reglor nr. 2 pe
      dev1+dev2 → a doua măsurare pe ascuns. Dacă tot < 90% → varianta (b) din contract (model AI în browser) = ÎNTREB
      întâi (30-100 MB pe PC). Reparațiile finale ale fișelor: după `afirmatii_surse.json` (judecata 2 + elevul de probă
      + Word: la margini punctul NU merge, la alineat merge — VII/6 vs VII/9).
- [x] 4. GATA ~00:50: auditorul: testul e drept (51/54 ratări = motorul) · set de reglaj nr. 2 (429, opus) · 7.125
      formulări în plus (`_sursa/formulari_extra_*.json`) · reglor nr. 2 (`reglaj_2.md`) · reparații finale + surse
      Microsoft (102 confirmate, 48 parțial, 1 fals reparat, 20 negăsite) + elev runda 2 (V 32/10/0, VII 40/2/0, 0 blocaje)
      **SETUL ASCUNS, a doua măsurare (date.js 097916c1ae01): locul 1 85,8%, primele 3 94,3%, în afară 34/37 = TREC.**
      proba_browser 0 · proba_vezi (I5, motorul 3af8b783 al lui ai-0-b7) 0 · selfcheck `cum-fac-fise-la-zi` +
      `cum-fac-lectii-acoperite` VERZI (AI_0 c98ef35a) · commituri LH locale f26dbec6, 46f86b24, 26420c62.
- [ ] 5. probă browser + publicare (verifică `git log origin/master..master`) + probe live + contract selfcheck +
      commit + raport (CLOSEOUT).

## Blocaje / note
- 23:25 ai-0-79 (dirijorul lecțiilor M2: 18 lecții noi V-VII, primul commit nu înainte de ~02:00) rulează
  publica_lectie.py → build_lectii.py + hub. Am SCOS legăturile mele (patch: `_patch/legaturi_cum_fac.patch`, se
  reaplică cu `git -C <LH> apply`); .gitignore, build_lectii.py, lectii/index.html, hub/index.html = HEAD. La
  publicarea mea: îi scriu întâi, reaplic patch-ul peste commiturile lui, regenerez lectii/index.html.
- 22:36 ai-0-b7 (jurnal/panou/baza comună) ține motor.js, prezenta.js, jurnal\index.html, probele din jocuri\_motor și
  projects\teste-elevi până pe la ~01:00; îmi scrie când motor.js e comis. `?pas=` e al jurnalului (deschide pasul în
  lucru) — NU-i schimbăm sensul. Fișele trimit la `?vezi=pN` (azi ignorat → cuprinsul).
- 22:37 ai-0-b7: preia ea `?vezi=pN` după agentul ei și-mi scrie commitul (proba: `python
  C:/00/AI_0/projects/teste-elevi/contracte/2026-10-10_jurnal_panou_baza_comuna/oracol_lucrare.py --repede` → 0).
  Commiturile ei („P5/P7/P8/P11”, „anti-pacaleli”, „ap”) NU le împing eu; dacă apar în `origin/master..master` la
  publicare → STOP și îi scriu.
- Fișa `windows-browser-salvare-imagine` se sprijină pe `jocuri/documentare-v/` (joc publicat, la care trimite VI/9):
  decizia dirijorului = rămâne.
