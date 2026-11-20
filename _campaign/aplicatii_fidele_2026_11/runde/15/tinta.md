# Runda 15 · pasul 3 · ȚINTA — aplicația File Explorer în biblioteca centrală (etapa B, val `B-explorer`)

Ținta e dată de orchestrator (`runde/supliment_B_explorer_runda15.md`); nu există GRAV-uri de critic pe Explorer
(prima rundă de construcție a valului). Numerele care o susțin (pornirea, `runde/15/iesiri/`):

| ce | valoare | sursa |
|---|---|---|
| O3 pe `explorer.*` | 1261 puncte (16 suprafețe; cele mai mari: meniu_fisier_clasic 232, panou_navigare 169, meniu_nou 148, meniu_fisier 134, meniu_vizualizare 113) | `iesiri/O3/oracol_ui.json › pe_suprafata` |
| O4 pe Explorer | 14/18 trec pe simulatorul vechi; 4 diferențe (2 × `dialog.butoane`, 2 × `dialog.intrebare`) | `iesiri/O4/oracol_comportament.json` |
| O5 pe Explorer | 32/32 gesturi fără eveniment („explorer nu e încă în bibliotecă”) | `iesiri/O5/oracol_evenimente.json › pe_aplicatie` |
| O9 pe Explorer | 8/8 cazuri picate | `iesiri/O9/oracol_asistare.json` |
| lecții cu Explorer | 9 pagini (v/m2-l09, l10, l11, l12, l15, m5-l31, m5-l36, vi/m3-l18, jocuri/fisiere-v) | `inventar.json` |

(O3+O4+O8) × lecții: Explorer = (1261 + 4 + O8 pe Explorer) × 9 — singura aplicație din valul B fără nicio implementare
în bibliotecă; O3/O7/O8 nu se mișcă în etapa B (lecțiile nu încarcă biblioteca), deci efectul se vede în O4, O5, O9 și în
diagnosticul pe poligon (`runde/15/masoara_poligon_explorer.py`, construit pe codul înghețat al O3, ca `masoara_poligon.py`).

## Fișierele pe care le deține runda (doar acestea se modifică)
Proprii (noi): `aplicatii/explorer.js`, `aplicatii/date/explorer.json`, `aplicatii/_unelte/genereaza_explorer.py`,
`aplicatii/profiluri/explorer_windows11.json`; dosarul `runde/15/`.
Comune, câte o bucată mică cu Edit, păzită pe aplicație (copiile în `runde/15/inainte/`):
- `aplicatii/aplicatii.js` — `explorer` în `SURSE_APP` și profilul `explorer_windows11` în `PROFILURI` / `SETARI_IMPLICITE`
  (o linie nouă după fiecare obiect, ca să nu ating liniile pe care le poate atinge banda Windows);
- `aplicatii/setari.json` — `"explorer": "explorer_windows11"`;
- `aplicatii/poligon.html` — ramura de conținut `explorer` (folderul de lucru de probă).
`D/de_verificat.md` / `D/de_aprobat.md`: doar adaug, în blocul `<!-- RUNDA15-EXPLORER:START/END -->`.
NU ating: word.js, excel.js, powerpoint.js, panglica.js, stare.js, aplicatii.css, lecțiile, jocurile, zona înghețată.
