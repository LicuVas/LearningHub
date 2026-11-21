# Starea constructorului, runda 24 (Word, B-word#2, unghiul aspect)

- 02:29 Citite: CICLU_PARALEL, prompt 24, supliment 24, contract, critic 20. Copii de dat înapoi: `inainte/` (word.js, aplicatii.js, api_biblioteca.md, de_aprobat.md, de_verificat.md).
- 02:45 Pornire în dosarul meu: O9 = 13 (`probe_iesiri/O9_inainte`), O4 word-* = 13 (`probe_iesiri/O4w_inainte/rele.txt`, aceleași 12 rânduri ca r20).
- Măsurători (`probe/p24_masura.py` → `probe_iesiri/masura_inainte.json`):
  - clic-pune-cursorul: clicul simulatorului cade la 0,257 px DREAPTA de centrul lui „e” (exact mijlocul, `oracol_comportament.py:189` `w/2`); realul a dat clic la `x + l // 2` (`ruleaza_real.py:596-604`, pixeli întregi, l=31 → 0,5 px STÂNGA de mijloc). Aceeași regulă (cea mai apropiată graniță) dă 9 vs 10. Asimetrie a hamului, NU comportament → nu repar în word.js (ar fi potrivire pe oracol). R24 + Pentru orchestrator.
  - imagine-inserare: `mso:PictureInsertFromFile` e rândul „This Device” din flyout-ul Pictures (`uia_word.json` › Illustrations › `FlyoutAnchorInsertPictures`); O4 nu deschide flyout-ul → neexecutabil fără UI infidel. Scenariul (înghețat) ar trebui rescris cu `element: This Device`. Probez varianta pe o copie.
  - fereastra mică: Save/Cancel la y 518 (+26) > 526; stratul dialogului derulează (566/524), Tab nu aduce în vedere; lista: PDF la y 529.
- Alt+F4: sursa = support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec („Alt+F4 | Close the active window.”, secțiunea Windows 11).
- „already exists” cu întrebare: nicio referință în `referinte/` → rămâne, rând R24.
- 03:05 proba_grav.py la pornire: 13 picate / 19 (`proba_grav_inainte.log`). Reparat:
  - `aplicatii.js` › `L.asistent` (doar `doarFocus`, 2 rânduri + comentariu) și `api_biblioteca.md` §6.3;
  - `word.js`: Alt+F4 = Esc în fereastră; `aduInVedere` la Tab; `kMic` în `arataFilaDialog`; lista din fereastră întoarsă în `listaRef`; `curataEroarea` în `salveaza`.
- După: proba_grav 0 picate; O9 13 → 13 (aceleași cazuri); O4 word-* 13 → 13 (aceleași rânduri); varianta imaginii 1/1; aspect 1366: 0 diferențe vizibile (D8, D9).
- Scrise: cadru, tinta, contra, diferente; blocurile RUNDA24-WORD în de_aprobat (A24-1, A24-2) și de_verificat (R24-1…R24-5).
- 03:30 Scrise: raport_constructor.md, gata_pentru_critic.md. proba_grav final = 0 (`proba_grav_dupa.log`); O9 final 13, aceleași cazuri (`probe_iesiri/O9_final`). Regres parțial: 20 → 2 (era 3; cele 2 = MINOR-ul vechi „Save bifat la refuz”), 16 → 0, 5 → 1, 4 → 0, telefon → 0. O4 pe eșantionul PowerPoint (6) și Excel (6): ca la pornire (diferențele de acolo existau și în r22; autofit-latime chiar s-a îndreptat, din banda Excel).
- 03:55 GATA: regres complet (3 → 0, 2 → 0; O8 nemăsurabil în dosarul meu, peste 10 min). `controale_taiate` încă rulează în fundal → `probe_iesiri/controale_taiate.log`. raport_constructor.md + gata_pentru_critic.md (GATA_PENTRU_CRITIC) scrise.
- (vechi) În lucru: `regres.sh` (probe 20/16/5/4/telefon/3/2 + O8); O4 pe 6 PowerPoint + 6 Excel; controale_taiate. Apoi raport_constructor + gata_pentru_critic.

