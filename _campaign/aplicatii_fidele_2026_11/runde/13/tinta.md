# Runda 13 · ținta (pasul 3)

Pornirea (`runde/13/masurare_pornire.json`, măsurarea rundei `acoperire`, 20.11 12:49-14:02, singură):
O1 61 · O2 13392 · O3 26855 · O4 50 · O5 82 · O6 0 · O7 341 · O8 102 · O9 27 · porți 43 (cum_fac 41, controale_taiate 2 pe timp) · lacăt ok.

Etapa B, aplicația powerpoint. Ținta = GRAV-urile deschise ale criticului 12 (au întâietate) în ordinea pagubei din suplimentul
orchestratorului: P4 rest → A4 listele → P3 rest → A4 notele/vederile → A3 → A1 → A2 → MINOR.
Numerele care o aleg: O4 50 (20 pe cele 14 scenarii noi: blank-presentation 2, ctrl-o-browse 2, imagine-two-content 2,
durata-push 1, durata-wipe 1, slide-sorter 1, slide-sorter-normal 1, animatie-start 2, font-titlu 1, shape-fill 1,
background-styles 1, stea-ctrl-c-v 3, note 2); O3 +1779 pe cele 8 suprafețe noi (ShapeFill 540, Outline 547, FileOpen 253,
Font 155, BackgroundStyles 99, Slide Sorter 92, Weight 71, Start 22) — nedesenate; 7 lecții + `prezentari-vi` (31 de apariții)
blocate (critic 12 › tabelul drumurilor).

## Fișierele rundei (doar acestea se modifică)
- `aplicatii/powerpoint.js`
- `aplicatii/aplicatii.css` (doar regulile `.lh-ap-powerpoint` / `.lh-ap-p-*`)
- `aplicatii/date/powerpoint.json` (REGENERAT de `aplicatii/_unelte/genereaza_powerpoint.py`, nu de mână)
- `aplicatii/_unelte/genereaza_powerpoint.py` (doar dacă trebuie dus în date un fapt din referință: lista All Fonts)
- `_campaign/.../de_verificat.md`, `de_aprobat.md`; notele din `runde/13/`
