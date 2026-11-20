# Runda `acoperire` pe PowerPoint după runda 12 — STAREA (agentul 1, 20.11.2026 ~12:05)

Sarcina: `runde/12/acoperire_prompt.md`. D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`.
Nimic comis. `aplicatii/`, lecțiile, jocurile, `jocuri/_motor/` NEatinse.

## Copii de dinainte (nu sunt livrabile)
`uia_powerpoint_inainte.json.bak`, `suprafete_inainte.json.bak`, `api_biblioteca_inainte.md.bak`, `scenarii_inainte/`.

## Generatorul
`referinte/acoperire_powerpoint_r12.py` — importă `acoperire_powerpoint_r11.py` (pornirea sigură, `inchide_sigur`,
`curata_mru`, clasa de scenarii); marcajul fișierelor `lh_ppt_r12_`. Capturi: a_forma_clic, b_fisiere, c_liste,
c_note_vederi, d_durate, e_extra (`--doar=`). Ieșirea brută: `runde/12/acoperire/capturi_powerpoint_brut.json`.

## Lotul 1 (capturi) — în lucru
Trei sesiuni (capturi_rulare1..3.log), toate: tasklist gol înainte, închidere WM_CLOSE cu doar prezentările mele, nicio
instanță rămasă, Recent curățat (doar ComDlg32 `lh_ppt_r12_`). Rezultate (în `capturi_powerpoint_brut.json`):
- a: clicul în MIJLOCUL stelei / săgeții / dreptunghiului / casetei de text = Selection.Type 2 (forma ca obiect); chenarul
  dreptunghiului care încadrează steaua (în afara desenului) = nimic; Ctrl+C → clipboard cu formele PowerPoint; Ctrl+V pe
  miniatura 2 (aleasă prin COM — panoul miniaturilor nu e fereastră separată) → steaua pe diapozitivul 2, același loc.
- b: Blank Presentation (UIA Invoke) → Presentation2, 2 deschise; Open = #32770 „Open” (File name:, Files of type: All
  PowerPoint Presentations (...), Open ▾, Cancel; focus gol); nume + Enter → Plante_6A_Pop.pptx activă. Enter în „Save your
  changes” → [NEVERIFICAT] (ar salva la om; încercarea a lăsat PowerPoint „ocupat”, NIMIC salvat — verificat es.exe + reg).
- c: Font ▾ (Theme Fonts 2 + All Fonts 318) → Font.Name „Calibri Light”, caseta „Calibri Light (Headings)”; Start ▾ (On Click /
  With Previous / After Previous → TriggerType 1/2/3); Shape Fill ▾ (Yellow → #FFFF00), Outline ▾ (Weight ▸ 3 pt → 3.0;
  Orange → #FFC000), Home = Shape Format; Background Styles ▾ (Style 1-12; Style 6 → solid #E9E7E7 pe ambele).
  Hover: niciun ToolTip pe desktopul ascuns → [NEVERIFICAT].
- note: ShowNotes apăsat la pornire; View › Notes și Notes din bara de stare îl comută; zona NU e în UIA; tastarea → în scenariu.
- vederi: Slide Sorter → ViewType 7; Normal → 9; Reading View → fereastră de expunere ne-full-screen; Slide Show → full screen.
- d: fără tranziție „02,00”/2.0; Fade „00,70”/0.7; Push „01,00”/1.0; Wipe „01,00”/1.0 (și unul după altul); EntryEffect=3849
  pus prin COM → rămâne 2.0 (asta a fost captura din runda 11 → contradicția lămurită).
- e: imaginea pe Two Content intră ÎN caseta goală din dreapta (substituent cu imagine, [486,163,408,304]), tot 3 forme.

## Lotul 2 (scenarii) — în lucru: 14 scenarii scrise (`scrie_scenarii`), rularea pe două sesiuni.
- Sesiunea A (scenarii_rulare1.log, 12:15-12:23): probe 5/5 trecute; blank-presentation („Presentation2”/2), ctrl-o-browse
  („Plante_6A_Pop.pptx”/2), font-titlu („Calibri Light”), animatie-start ([["dupa_precedenta"]]), shape-fill (#FFFF00),
  background-styles (#E9E7E7 ×2) — toate mod_probat true. stea-ctrl-c-v NERULAT: clipboard-ul omului avea atunci și altceva
  decât text (regula: nu-l ating) → reîncercat în sesiunea B.
- `api_biblioteca.md` scris: §3 (`bara_stare`, `zona_note`, nota la `margine_forma`), §5 (font_text, pornire_animatii,
  umplere_forme, note_diapozitive, vedere, fel: imagine), §7.1 (start: forme, fonturi, fisiere).
- `de_verificat.md`: note la R11-14, R12-2, R12-5, R12-6, R12-7; rânduri noi R12-11 (hover), R12-12 (note / chenar în UIA).
- Sesiunea B pornită 12:27 (stea, note, slide-sorter ×2, durata ×3, imagine-two-content) → scenarii_rulare2.log.

## Rămas după B: `scrie` (uia_powerpoint.json + suprafete.json), `verifica`, `ruleaza_real.py verifica`, ingheata --acoperire,
masoara (singur, 45-75 min), --verifica = 0, raportul `runde/12/acoperire_powerpoint.md`.

## Sesiunea B (12:23-12:30): slide-sorter („sortare”), slide-sorter-normal („normala”), durata-fade [0.7], -push [1.0],
-wipe [1.0], imagine-two-content (3 forme, a treia `fel: imagine` [486,163,408,304]) — mod_probat true. note: clicul n-a
nimerit zona de note (reparat: punctul din ActiveWindow.SplitVertical + MDIClient); stea: clipboard-ul omului OCUPAT
(OpenClipboard = Access denied, și din desktopul lui) → nerulat.
`scrie` făcut 12:28: 8 suprafețe noi în uia_powerpoint.json + acoperire_r12; suprafete.json 8 intrări (59 PowerPoint).

## INCIDENT 12:30-12:40 (sesiunea C, note + stea)
Am pornit-o cu `timeout 170` pe wrapper: la 170 s timeout a oprit wrapper-ul, hidden_desktop a oprit procesul intern (143)
înainte de `inchide_sigur`; POWERPNT.EXE PID 19528 (al MEU: pornit 12:30:52 cu /B, părinte = procesul meu intern) a rămas
fără ferestre (pe Default, LHScenarii, LHRefOffice: 0), cu 1 fir, în curs de terminare (taskkill /PID 19528 /F la 12:37:
„no running instance” = deja în ieșire; memoria scade). Fără ferestre nu se poate lega COM-ul ca să număr prezentările;
un proces cu 1 fir și fără ferestre nu poate ține o prezentare a omului. Resiliency: DocumentRecovery\B060EA8 („APP-PPT”) și
StartupItems „$<a”, ambele cu ora 12:30:53 = pornirea instanței mele → de șters DUPĂ ce 19528 dispare (altfel omul vede la
următoarea pornire „PowerPoint n-a pornit corect…”). LECȚIA: NICIODATĂ `timeout` mai mic decât sesiunea pe wrapper.
- 12:48: Resiliency șterse (DOAR ale mele, ora 12:30:53): StartupItems „$<a”, DocumentRecovery\B060EA8. PID 19528 tot în
  ieșire (1 fir, ~33 MB, fără ferestre). De reverificat la final: tasklist + Resiliency.
- note / stea rămân fără rezultat real probat: `nota_autor` în scenarii_real + `SC_NEVERIFICAT` în generator (`verifica` = 0).
  `ruleaza_real.py verifica` = 13 (11 vechi + aceste 2).
- 12:49 reînghețat (`ingheata.py --acoperire "…"`, 401 fișiere, `--verifica` = 0); 12:49 pornită măsurarea
  (`masoara.py --runda 12 --paralel 3 --compara runde/12/masurare_final_r12.json` → `runde/12/acoperire/masurare_rulare.log`).
## Rămas: așteptat măsurarea; dacă O6 NECONCLUDENT → pașii din prompt; --verifica = 0; raportul `runde/12/acoperire_powerpoint.md`.

## GATA (14:08): măsurarea 12:49-14:02 (O3 25076 → 26855, O4 30 → 50, porți 41 → 43 = 2 erori de măsurare în
controale_taiate; restul neschimbat; O6 0 concludent; lacăt ok), `--verifica` = 0 după; %TEMP% curat (dosarul gol al sesiunii
întrerupte șters); raportul `runde/12/acoperire_powerpoint.md` → ACOPERIRE_PARTIALA. PID 19528 tot în terminare (520 K) — de
verificat de orchestrator. De reluat într-o rundă viitoare: `scenarii --id=powerpoint-note,powerpoint-stea-ctrl-c-v` (fără
`timeout` mai mic decât sesiunea pe wrapper!), apoi reînghețare + măsurare.
