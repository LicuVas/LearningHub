# Starea autorului — runda `acoperire` Office (după ciclul paralel C), 21.11.2026

Pornire: HEAD 27a0e685 (ramura `fidelitate-aplicatii`), lacăt INTACT (427 fișiere), O4 = 28 (`runde/26/iesiri/O4`).
Procesele omului (neatinse, aceleași PID-uri la final): WINWORD 28392, EXCEL 11152, POWERPNT 19528 (blocat). Clipboard-ul omului: gol la pornire, gol la final.
`ruleaza_real.py verifica`: 28 la pornire → 30 la final (+2 = canalul nou `taste_in_mesaj`, ca `taste_alt` / `taste_ctrl_sageti` ale rundelor 7 / 14).

## Făcut (toate cu dovada în dosarul ăsta)
1. Sortarea: `acoperire_excel_r7.py` › `sortare_doua_niveluri` (Worksheet.Sort.SortFields); real recapturat (05:31): VIII A 95/88/60, VIII B 95/78/60. Diagnostic: `excel_jurnal_0535.json` › `fapte.sortare_diagnostic`.
2. Autocompletare / separator: două momente (scenariul vechi = mesajul + editarea; perechea `-esc-esc` = Esc, Esc + celulele). Esc ajunge în mesajul NetUI prin copilul NetUIHWND (proba `taste_in_mesaj` trecută, `excel_jurnal_0556.json`). Rulările 0542 / 0550 au arătat că Esc postat documentului sau ferestrei NUIDialog NU ajunge — reale aruncate, recapturate în 0556.
3. Clicul: `de_la = pana_la = 10` → real 10 (`word_jurnal_0557.json`).
4. Imaginea: Pictures ▾ capturat (`capturi_word_brut.json`): This Device... / Stock Images... / Online Pictures...; scenariul rescris cu „This Device...”; real 1 imagine în linie.
5. Fără real: Ctrl+C/V și Ctrl+X/V jucate cu clipboard-ul adevărat (gol, golit, pus la loc) → reale noi; Font Size (focus UIA pică), tragerile Word și Excel (mouse postat pică) → `de_verificat.md` R26O-1…3.
6. api_biblioteca.md: textul ciclului C (13+ / 3-), verificat pe cod.
7. de_verificat: R24-2, R25-1, R25-2, `word-copiere-lipire`, `word-decupare-lipire` bifate; R24-1 adnotat; blocul R26O-1…5. de_aprobat: A26O-1…3.
8. O4 pe scenariile atinse (copie, `o4_atinse/`): 7/9 ok; rămân `word-copiere-lipire` (simulatorul fără spațierea inteligentă) și `word-imagine-inserare` (word.js are „This Device”, realul „This Device...”).
9. Reînghețat 05:59 (434 fișiere), `--verifica` = 0. Măsurarea finală pornită 06:01:07, singură pe mașină (`masurare_dupa_acoperire.log`). Copia măsurării: `runde/26/masurare_ciclu_C.json`.
10. Măsurarea finală (06:01-06:59): O1 61, O2 13392, O3 28919, O4 15, O5 35, O6 0, O7 341, O8 102, O9 13, porți 41; lacăt ok; regres niciunul. Rezultatul în `acoperire_office/masurare.json`, ieșirile în `acoperire_office/iesiri/`; `runde/26/masurare.json` și `runde/26/iesiri/` puse înapoi (identice cu ciclul C). `ingheata.py --verifica` = 0.
11. Raportul: `runde/26/acoperire_office.md` (ultima linie ACOPERIRE_GATA).

## Rămâne
- nimic din runda asta. Pentru runda Word următoare: „This Device...” în `word.js:1664` și spațierea la Ctrl+V.
