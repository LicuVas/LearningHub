# Runda 11 · unde e ce (pentru critic)

- Modulul: `aplicatii/powerpoint.js` (nou). Datele: `aplicatii/date/powerpoint.json`, GENERAT de `aplicatii/_unelte/genereaza_powerpoint.py`
  din `_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json` (`--verifica` = 0). Profilul: `aplicatii/profiluri/powerpoint365.json`.
- Cod comun atins: `aplicatii/aplicatii.js` (doar `SURSE_APP` += powerpoint), `aplicatii/aplicatii.css` (secțiunea de la capăt,
  `.lh-ap-powerpoint` / `.lh-ap-p-*`), `aplicatii/poligon.html` (conținutul de probă `P.powerpoint`).
- Poligonul cu PowerPoint: `aplicatii/poligon.html?aplicatie=powerpoint` (servit local, ex. `python -m http.server` din worktree).
- Parametrii de CONȚINUT (`LH.aplicatii.deschide('powerpoint', {continut})`, formatul `start` al scenariilor, api §7.1):
  `diapozitive: [{aspect: 'Title Slide'|'Title and Content'|'Title Only', texte: [...]}]`, `diapozitiv_activ` (1…n),
  `panou: 'miniaturi'|'diapozitiv'`, `selectie_text: [d, s]` (tot textul casetei s ales; caseta goală = cursorul în ea),
  `selectie_forma: [d, s]` (caseta aleasă ca obiect), `forma_citita: [d, s]` (ce citește `formatare_text`), `tema`, `nume_fisier`.
- Starea: `diapozitive [{aspect, texte, forme, tranzitie_cod?, animatii_cod?}]`, `formatare_text {text, bold, marime}`, `tema`,
  `tranzitie_galerie`, `animatie_galerie`, `nume_fisier`, `diapozitiv_activ`, `panou`, `selectie_text`, plus `selectie_forma`,
  `backstage`, `dialog`, `expunere`.
- Țintele: `miniatura:N`, `forma:D/S`, `margine_forma:D/S` (marginea casetei — fel NOU, R11-5), `diapozitiv:N` (fundalul),
  galeriile `meniu:<efect>`, listele ▾ `meniu:<aspect>` / `meniu:3x2 Table`, restul din referință (panglica.js).
- Ce n-are referință: `de_verificat.md` R11-1 … R11-10. Proba constructorului: `runde/11/proba_powerpoint.py` → `proba_powerpoint.json`.
