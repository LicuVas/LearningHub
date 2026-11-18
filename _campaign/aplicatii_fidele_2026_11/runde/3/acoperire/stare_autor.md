# Starea agentului rundei `acoperire` pe Word (18.11.2026, ~23:45) — notă de predare

FĂCUT (cu dovadă pe disc):
- `referinte/acoperire_word_r3.py` (generator-soră; `capturi` / `scrie` / `verifica` / `scenarii`); `verifica` = 0.
- `referinte/uia_word.json`: 16 suprafețe noi + blocul `acoperire_r3` (brut: `runde/3/acoperire/capturi_word_brut.json`);
  `dump_uia_office.py verifica` = 0.
- `scenarii/word/`: 10 scenarii noi (`rulat_de`: acoperire_word_r3.py); 9 cu rezultat real în `referinte/scenarii_real/`
  (`word-font-size-tastat` = trimis_la_profesor, AC-1). Jurnalele: `scenarii_word_jurnal_rularea1.json`, `scenarii_word_jurnal.json`.
  `ruleaza_real.py verifica` = 0. `ruleaza_real.py › scenarii()` sare scenariile cu `rulat_de` străin (2 rânduri).
- `suprafete.json` (17 intrări noi/completate), `api_biblioteca.md` (§3 `bara_titlu`, `camp:tip_fisier`; §4 `tasta_acces`,
  `activat`; §5 cheile noi; §6.3), `de_verificat.md` (AC-1…AC-3), `de_aprobat.md` (notă la A2-1), README_referinte.md.
- `ingheata.py --acoperire` rulat (326 fișiere), `--verifica` = 0 înainte de măsurare.

TERMINAT 19.11 ~00:00: măsurarea a rulat (O3 20337, O4 120, O7 353, restul neschimbate; lacăt ok), `--verifica` = 0,
raportul = `runde/3/acoperire_word.md`. Rândurile de mai jos = starea de dinainte de măsurare.
(era în lucru) `oracole/masoara.py --runda 3 --paralel 3` (log: `runde/3/acoperire/masurare_acoperire.log`). Înainte = `runde/3/masurare_2.json`
(O1 61, O2 13392, O3 18546, O4 98, O5 154, O6 0, O7 355, O8 102, O9 41, porți 41).
Așteptat la O3: +1801 puncte pe cele 16 suprafețe noi dacă nicio pagină nu le desenează (calcul offline, `oracol_ui.puncte`),
−3 `fara_referinta` (save_this_file, save_your_changes_to_this_file, open au acum referință). O4: +10 scenarii (9 cu real, 1 fără).

DE FĂCUT după măsurare: `ingheata.py --verifica` = 0; `runde/3/acoperire_word.md` (numerele înainte → după, explicate).
Oracolele NU au fost atinse (citesc singure dosarele) → bancul de mutanți nu e cerut; nerulat.
