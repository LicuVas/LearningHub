# Starea autorului — runda 15, acoperire pe instrumente (20.11.2026)

Făcut:
- bancul ÎNAINTE (O3 + O2, codul vechi): `mutanti_inainte/` — O3 10/11 (neprins O3-02, ca la 17.11), O2 9/9.
- `oracole/structura_lib.py`: secțiunea „referințele shell” (convertor, tăieturi, legături, ReferintaShell,
  referinte_shell), al treilea pas din `aliniaza` (comenzile ascunse), ramura shell din `referinta_suprafata`,
  `_deschide_shell` (plasa, nu face nimic azi), amprenta cache-ului cu uia_windows/uia_explorer.
- `oracole/oracol_ui.py`: O3 compară și Windows / Explorer (referinte_shell), `fara_referinta_motiv`, `referinte_shell`.
- `oracole/CONVENTIE_ARBORE.md` §2 și §5: cheile Windows / Explorer, arborele turtit, regula nodurilor ascunse.
- `oracole/_jucarie_shell/` (genereaza_jucarie.py + explorer-citire.js): proba `proba_jucarie/` = 0 puncte pe cele 16
  suprafețe explorer.* cu jucăria fidelă; +7 / +8 / +15 / +1 cu stricăciunile.
- `mutanti/banca.json` v4: pregătirea `jucarie_explorer`, mutanții O3-12…O3-15 (validați 5/5).
- `suprafete.json`: 29 de suprafețe explorer/windows (17 legate, 12 cu motivul), `acoperire_r15`.
- O3 rapid pe cache-ul vechi de randare: 27139 -> 28919; Office identic pe toate cele 189 de suprafețe.

- bancul DUPĂ (O3 + O2): O3 14/15 (aceleași prinderi Word, cu aceleași creșteri; O3-12…15 prinși), O2 9/9.
- `--valideaza` pe tot bancul: 72/72 (mutanti/validare.json).
- reînghețat (427 fișiere, 21:23:05) ÎNAINTE de măsurare (masoara refuză cu lacătul rupt; așa a făcut și runda 14),
  măsurarea singură 21:23-22:15: O3 27139 -> 28919, restul și porțile identice, Office pe O3 identic pe toate cele 189
  de suprafețe (comparatie_o3.txt); `--verifica` după = 0.
- raportul `runde/15/acoperire_instrumente.md` scris (lipsesc doar tabelul de numere, dovezile și rezultatul băncii întregi).

De făcut: bancul ÎNTREG (pornit 22:17, `banca_intreaga.log`, scrie mutanti/rezultat.json), apoi {TABEL}, {DOVEZI},
{REZULTAT_BANCA} în raport.
