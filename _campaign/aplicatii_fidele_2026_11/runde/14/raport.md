# Valul B-powerpoint, încheiat după runda 14 — OPRIT (LIMITA_VAL) (scris de orchestrator, 20.11.2026)

`python D/opreste.py` după rândul 18 din `jurnal.jsonl` a dat **OPRESTE** (`runde/14/opreste.log`).
- **Motivul:** **LIMITA_VAL**, adică „6 runde în valul curent ('B', 'powerpoint') (limita: 6)”. Cele două runde `acoperire` se numără în val.
- **Nu e convergență:** criticul rece 14 mai are **1 GRAV deschis** (S1). Totuși e cel mai curat val de până acum, după Word (8 GRAV) și Excel (3 GRAV).

## Numerele întâi
| | pornire val (r10) | r11 | acoperire 11 | r12 | acoperire 12 | r13 | r14 |
|---|---:|---:|---:|---:|---:|---:|---:|
| O1 | 61 | 61 | 61 | 61 | 61 | 61 | 61 |
| O2 | 13392 | 13392 | 13392 | 13392 | 13392 | 13392 | 13392 |
| O3 | 21586 | 21586 | 25076 | 25076 | 26855 | 26855 | 26855 |
| O4 | 50 | 33 | 48 | 30 | 50 | 32 | 32 |
| O5 | 113 | 82 | 82 | 82 | 82 | 82 | 82 |
| O6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| O7 | 343 | 343 | 341 | 341 | 341 | 341 | 341 |
| O8 | 102 | 102 | 102 | 102 | 102 | 102 | 102 |
| O9 | 34 | 27 | 27 | 27 | 27 | 27 | 27 |
| porți | 41 | 41 | 41 | 41 | 43 | 41 | 41 (doar cum_fac; date_personale 0) |
| GRAV criticul rece | — | 5 | — | 2 vechi + 4 noi | — | 0 vechi + 4 noi | 0 vechi + 1 nou |
| repere.lock | ok | ok | reînghețat | ok | reînghețat | ok | ok |

- **Coloanele `acoperire`:** creșterile lui O3 și O4 sunt suprafețe și scenarii noi, capturate din PowerPoint real (`runde/11/acoperire_powerpoint.md`, `runde/12/acoperire_powerpoint.md`). Contractul le permite.
- **Porțile 43 la acoperirea 12:** sunt două depășiri de timp de 8000 ms pe mașina lentă, nu defecte. Nu s-au mai repetat.
- **O3 nu scade în etapa B:** măsoară paginile lecțiilor, care folosesc încă simulatoarele vechi. Scade în etapa C.
- **Runda 14 n-a mișcat oracolele:** niciunul nu măsoară tastatura în ferestre sau fontul de pe ecran. Dovada ei e `runde/14/proba_grav.py`, cu 73 de verificări: 55 picate la e3300ec9, 0 acum.

## FĂCUT (cu dovada)
- **PowerPoint în bibliotecă** (`aplicatii/powerpoint.js`, `date/powerpoint.json` generat din `uia_powerpoint.json`), construit în runda 11 și reparat în rundele 12-14. E comis LOCAL pe `fidelitate-aplicatii`:
  - r11: 30921acd, 50ab8b24 (acoperire);
  - r12: 32fe7fb1, 552ac0c5, 2623887c, 704a761b;
  - acoperire 12: 62512721, 8ad9e9a9;
  - r13: 7ab108fe, 6751b1f6, bc23d64e, 27b45134;
  - r14: e3300ec9, 667eb704 și commit-ul acestui raport.
- **GRAV închise de critici, cu citat:**
  - criticul 12: P1 KeyTips, P2 Font Color, P5 Duration / Animation Pane / Format Background;
  - criticul 13: P3 fișierele (Blank Presentation, Ctrl+O › Browse › Open), P4 obiectele (clic pe formă = obiect, Ctrl+C/V/X/Delete, `start` cu forme), A1 Shapes, A2 paletele, A3 panourile pe fereastra mică / telefon, A4 comenzile de lecție care dădeau „aici nu e simulată” (`runde/13/critic.md` §2);
  - criticul 14: T1 ferestrele din taste, T2 Shape Format „J D”, T3 fontul temei, T4 Esc = `tasta_esc` (`runde/14/critic.md` §2).
- **Toate cele 9 drumuri de lecție PowerPoint** (m1-l02, m1-l03, m1-l05, m1-l06, m1-l07, m2-l08, m2-l09, m2-l10, `jocuri/prezentari-vi`) se duc la capăt pe poligon (`runde/14/critic.md`, tabelul drumurilor). Ctrl+Z / Ctrl+Y revin exact pe 14 greșeli tipice.
- **PowerPoint: 38 din 41 de scenarii trec.** Celelalte trei (`note`, `stea-ctrl-c-v`, `tragere-forma`) n-au rezultat real probat.
- **Referințe reale noi** (două runde `acoperire`, POWERPNT /B pe desktop ascuns): 19 suprafețe și 24 de scenarii noi.
- **Regresul Word și Excel:** curat în toate rundele. Capturile sunt identice la pixel; singura schimbare voită e Esc → `tasta_esc`, cerută de contract.

## NEFĂCUT
- **Publicarea pe proba:** niciuna. Regula cere criticul fără GRAV, iar rămâne deschis 1 (`runde/14/critic.md`):
  - **S1** — la finalul lecțiilor m1-l02 și m2-l08 („Închide PowerPoint cu ✕ → Don't Save”), PowerPoint rămâne deschis, gol, cu comenzile gri. Al doilea ✕ dă „aici nu e simulată” (`powerpoint.js` în jur de 1120). Ce face PowerPoint real după ✕ → Don't Save pe ultima prezentare NU e capturat. Lecția m1-l03:215 și comentariul constructorului spun că se închide de tot.
- **Deblocatorul:** o rundă `acoperire` PowerPoint scurtă, apoi o rundă de reparații. De capturat (`runde/14/critic.md` §9):
  1. ✕ → Don't Save pe singura prezentare;
  2. Save As peste un fișier existent („already exists”);
  3. Ctrl+Z după tastare în note și în titlu;
  4. Open cu un nume inexistent;
  5. Enter în File name din „Save your changes” și ordinea Tab în ferestre;
  6. forma aleasă după Ctrl+Z.
  Nu cere nimic de la Vasile, afară de a nu avea PowerPoint deschis cât rulează.
- **MINOR lăsate:** listele la +3 px, „Pov” tăiat, fereastra „Save your changes” la x = −26 pe 360 px, zonele de atins < 32 px în grilele de 24 px, fila „Fill” ca text, grosimea conturului care nu e în `stare()` (R14-7).

## NESIGUR
- **[FARA_REFERINTA]** din critic 12-14 și `D/de_verificat.md`: R11-…, R12-1…R12-12, R13-1…R13-17, R14-1…R14-7. Așteaptă o rundă `acoperire` sau privirea lui Vasile la PC.
- **`D/de_aprobat.md` A14-1…A14-3** așteaptă decizia lui Vasile:
  - felul `tasta_acces` pentru Alt + literă într-o fereastră;
  - cheia nouă `caseta_activa` în `stare()`;
  - Esc-ul din KeyTips nu mai e greșeală la asistent.
- **Un proces POWERPNT.EXE (PID 19528)** pornit de prima rundă `acoperire` 12 la 12:30 e blocat în ieșire: fără ferestre, cu 1 fir, iar `taskkill /PID` nu-l mai oprește. Intrările lui de recuperare au fost șterse. Pleacă la repornirea PC-ului. Lecția e în `runde/12/acoperire/stare_autor.md`: niciodată un `timeout` pe wrapper mai mic decât sesiunea PowerPoint.
- **Constructorii au trecut de 200k de context** (r13: 345k; r14: 400k). Predarea a mers curat o dată (r13). Al doilea constructor r13 a căzut pe o eroare de rețea DUPĂ pasul 7, iar orchestratorul i-a completat golurile din raport, din fișiere.
