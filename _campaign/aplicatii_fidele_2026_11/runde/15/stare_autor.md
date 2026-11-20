# Runda 15 (B-explorer) — starea constructorului

Pași 2-4 scriși: `cadru.md`, `tinta.md`, `contra.md`. Copii înainte de scriere: `runde/15/inainte/` (aplicatii.js, setari.json, poligon.html).
Unelte de citire (doar citesc referința): `runde/15/lucru/dump_ref.py`, `dump_canon.py`, `dump_scen.py` → `lucru/*.txt`.

## Bucăți
1. generatorul — FĂCUT: `aplicatii/_unelte/genereaza_explorer.py` → `aplicatii/date/explorer.json` (43 KB; `--verifica` = 0).
2-6. fereastra, meniurile, operațiile, dialogurile, telefonul — FĂCUTE în `aplicatii/explorer.js` (+ profil, + 3 atingeri comune: aplicatii.js 2 linii după SURSE_APP.windows, setari.json, poligon.html fragment P.explorer).
   O4 pe cele 18 scenarii: **18/18** (`probe_iesiri/O4/iesire.log`). Proba de fum 1366/375 px: 0 picate.
7. probele — FĂCUTE: O4 Explorer 18/18; O5 0/32; O9 7/8 (F = etapa C); diagnostic O3 pe poligon 254 (lecțiile vechi 1261);
   regres Word/Excel/PowerPoint 13/15 = identic cu pornirea; fum 1366/375 px 0. Toate în `probe_iesiri/`.
Pas 5 + ieșirea: `diferente.md`, `de_verificat.md` R15-1…16, `de_aprobat.md` A15-1, `raport_constructor.md`, `gata_pentru_critic.md` (GATA).

## Hotărâri luate (de păstrat dacă predau)
- Etichetele = referința profesorului (și cele specifice PC-ului lui); diferența profesor/laborator → R15 în de_verificat.
- Tragerea: de pe nume SAU de pe rândul deja ales = `tragere` (mutare); din rest / spațiul gol = `selectie` (dreptunghi). [NEVERIFICAT] → R15.
- `desktop:Coș de reciclare`: o fâșie de desktop lângă fereastră, în rădăcină, în afara suprafețelor (abatere A15-1 în de_aprobat).
- Folderul de lucru stă în „Documente/<folder>” (conținut implicit, nu etichetă de interfață).
- Fila activă poartă `data-lh-selectat`, nu `aria-selected` (O5 sare filele cu aria-selected=true).
