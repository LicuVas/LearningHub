# Runda 15 · B-explorer · pentru criticul rece

## Unde e ce
- Aplicația: `aplicatii/explorer.js` (comportamentul + desenul; stilul injectat, clase `lh-ap-e-*`).
- Interfața generată: `aplicatii/date/explorer.json`, din `referinte/uia_explorer.json` prin `aplicatii/_unelte/genereaza_explorer.py`
  (`--verifica` → ultima linie 0 = la zi).
- Profilul: `aplicatii/profiluri/explorer_windows11.json`; în `aplicatii/setari.json`: `"explorer": "explorer_windows11"`.
- Încărcarea: `aplicatii/aplicatii.js` (rândul `SURSE_APP.explorer = …`).
- Referințele: `referinte/uia_explorer.json` (capturile explorer_*), `referinte/scenarii_real/explorer_*.json` (18), `scenarii/explorer/*.json`.
- Raportul constructorului: `runde/15/raport_constructor.md`; ce nu e în referință: `de_verificat.md` › R15-1…R15-16; abaterea: `de_aprobat.md` › A15-1.

## Cum se deschide
- Pentru om: `aplicatii/poligon.html?aplicatie=explorer` (server local; folderul „Clasa a V-a”, folderul alăturat „Teme”, Coșul pe desktop).
- Din cod: `LH.aplicatii.deschide('explorer', {loc, continut, focus: true})`.
- Probe: `python runde/15/proba_explorer.py` (fum 1366/375 px), `python runde/15/masoara_poligon_explorer.py` (diagnostic O3 pe poligon),
  O4 pe Explorer: `LH_IESIRE=<dosar> python oracole/oracol_comportament.py --scenarii runde/15/lucru/scen`.

## Parametrii de CONȚINUT (`continut`, formatul `start` al scenariilor, api §7.1)
- `folder` (numele folderului de lucru; implicit „Exercitii”), `arbore` (numele din el, cu extensie; folderele cu „/”; căi cu „/” = în subfoldere;
  lipsă = un folder de probă, `[]` = gol), `continut` `{nume: text}`, `sortare` `{coloana, directie: crescator|descrescator}`,
  `setari` `{extensii_vizibile, confirmare_la_cos, panou_examinare}`, `sursa_lipirii` `{folder, arbore, continut}`.
- În plus (runda 15): `foldere_alaturate` `[{folder, arbore, continut}]` (alte foldere lângă cel de lucru), `parinte` (folderul care le
  cuprinde; implicit „Documente”), `desktop: false` (fără fâșia de desktop cu Coșul).
- `stare()`: `nume_fisiere`, `ordine_afisata`, `in_cos`, `continut_fisiere`, `dialog`, `cale_curenta`, `selectie` (api §5).

GATA_PENTRU_CRITIC
