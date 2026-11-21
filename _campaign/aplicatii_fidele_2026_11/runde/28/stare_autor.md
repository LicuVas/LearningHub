# Starea constructorului, runda 28 (Word, B-word#3, unghiul gest_tastatura, ciclul paralel D)

- 07:05 Citite: CICLU_PARALEL, prompt 28, supliment 28, contract, critic 24 (MINOR 1-7, predarea), critic 26 (K2 „Găsit pe drum”), acoperire_office r26 §4.4-4.5. Copii în `inainte/` (word.js, aplicatii.js, panglica.js, aplicatii.css, word.json, word365/2007.json, de_aprobat.md, de_verificat.md). Diff față de 24fd4eb5 în aplicatii/ la pornire: gol.
- 07:20 Pornire în dosarul meu: O4 word-* = 10 (`probe_iesiri/O4w_inainte/rele.txt`), O9 = 13 (`probe_iesiri/O9_inainte/rele.txt`: F_lectie ×5, paint ×8).
- Sonde (fără verdict): `probe/p28_sonda*.py`, `p28_dbg_*.py` → forma evenimentelor pe 5 aplicații (tastare în câmp / document, Alt+↓, refuzuri).
- Reparat:
  - word.js: Pictures ▾ cu „This Device...” / „Stock Images...” / „Online Pictures...”, antetul „Insert Picture From”, tastele de acces Alt, N, P, D/S/O; lipirea pune spațiul dinainte (Smart cut and paste, doar word365); lista Save as type micșorată cu `kMic`; stilul propriu Word (copiii casetelor Font / Font Size −1/−1, antetul meniului); Ctrl+Backspace / Ctrl+Delete = un cuvânt; Ctrl+↑/↓ = un paragraf.
  - aplicatii.js › L.asistent: REFUZ (nesimulat, nume_interzis, eroare_sortare) nu face pasul; alt_sageti fără schimbare de stare nu e greșeală; tastele de editare într-un câmp de text al interfeței nu sunt greșeli. `indisponibil` scos din REFUZ: O9 E/G PowerPoint au crescut 13 → 15 (Bold gri = pasul lor).
- 08:10 proba_grav: pornire (cod din `inainte/`, `LH_R28_INAINTE=1`) 17 picate / 36; după 0. O4 word-* 10 → 8 (copiere-lipire, imagine-inserare închise; decupare tot 0).
- În lucru: regres.sh (28, 24, 20, 16) și O4 word-* + O9 finale (după scoaterea lui `indisponibil` și tastele Ctrl). Apoi documentele + raport + gata_pentru_critic.
- 08:45 GATA: regres.sh 28 / 24 / 20 / 16 = 0 / 0 / 0 / 0; O4 word-* final 8 (aceleași rânduri ca după reparație); O9 final 13, aceleași cazuri. Scrise: cadru, tinta, contra, diferente (D1-D12), api_propunere (§6.3), blocurile RUNDA28-WORD (R28-1…4, A28-1…2), raport_constructor.md, gata_pentru_critic.md (GATA_PENTRU_CRITIC). api_biblioteca.md neatins.
