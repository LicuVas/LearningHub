# Runda 12 · ținta (pasul 3) — constructorul 1

## Numerele care au ales ținta
- Pornirea (`runde/12/masurare_pornire.json`): O1 61 · O2 13392 · O3 25076 · O4 48 · O5 82 · O6 0 · O7 341 · O8 102 · O9 27; porți 41 (cum_fac).
- Etapa B, aplicația powerpoint. GRAV-urile criticului 11 au întâietate (supliment): P1 KeyTips, P3 închiderea/fișierele,
  P2 Font Color, P4 obiectele, P5 efectele; apoi MINOR (critic §6).
- O4 pe PowerPoint (runde/11/iesiri/O4): 48 din care PowerPoint = 17 (ctrl-w-modificat 3, ctrl-c-v-caseta 3, animatii-move-up 2,
  sageata-dreapta 2, ctrl-n 2, font-color-titlu 1, two-content-new-slide 1, two-content-layout 1, fundal-aplica-la-toate 1,
  durata-aplica-la-toate 1, imagine 1, tragere-forma 1 fără real).
- O3: +3490 pe cele 11 suprafețe noi, toate cu `randari: 0` (runde/11/iesiri/O3/oracol_ui.json); lecțiile PowerPoint
  (11 pagini în inventar, ≤ 21 de exerciții pe pagină) încă pe simulatoarele vechi → vezi cadru.md, presupunerea 1.

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/powerpoint.js` (tot ce e P1-P5 + MINOR);
- `aplicatii/date/powerpoint.json` (DOAR regenerat de `_unelte/genereaza_powerpoint.py` din referința înghețată);
- `aplicatii/_unelte/genereaza_powerpoint.py` (dacă generarea are nevoie de câmpuri noi — fără etichete de mână);
- `aplicatii/aplicatii.css` (doar secțiunea `.lh-ap-p-*` / `.lh-ap-powerpoint`, plus mutarea regulii `.lh-ap-strat-backstage`
  sub `.lh-ap-powerpoint` — MINOR);
- `aplicatii/aplicatii.js` (doar dacă e nevoie de un cârlig comun; Word/Excel neschimbate);
- `_campaign/aplicatii_fidele_2026_11/de_verificat.md` (R12-*), `de_aprobat.md` (doar dacă păstrez o diferență);
- notele mele din `runde/12/` (cadru, tinta, contra, diferente, stare_autor, proba_grav.py + ieșirile ei, raport_constructor,
  gata_pentru_critic, regres dacă e cazul).
NU: lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, scenariile, `api_biblioteca.md`, `suprafete.json`.
