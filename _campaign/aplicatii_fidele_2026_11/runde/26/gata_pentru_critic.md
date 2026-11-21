# Runda 26 (B-windows, unghiul stare_finala_erori) — gata pentru criticul rece

## Ce s-a schimbat (fișierele, cu copiile de dinainte în `runde/26/inainte/`)
- `aplicatii/windows.js` (al benzii): K1 `:741-750`, K2 `:570` și `:759`, K3 `:380-411`, `:694`, `:782-800`, stările cu Start deschis
  `:556-558`, `:573`, Shift+Tab `:576`, CSS `:54`.
- `aplicatii/aplicatii.js` (COMUN): doar `gestTasta`, `:266-275` (8 rânduri adăugate; `runde/26/diff_aplicatii_js.txt`).
- `_campaign/.../api_biblioteca.md` (COMUN): §4, un rând, `:170`.
- `de_verificat.md` / `de_aprobat.md`: blocurile `RUNDA26-WINDOWS` (R26-1..3, A26-1..2).

## Cum se reproduce
- `python .../runde/26/proba_grav.py --eticheta <x>` → `runde/26/probe_iesiri/proba_grav_<x>.json` (ultima linie = picate; azi 3 din 84:
  K3b ×2 fără referință, S3 maximizare 2 px MĂRUNT).
- `LH_AB=<dosar temporar> python .../runde/26/regres_ctrl_litera.py` → Ctrl / Meta + literă pe Word, Excel, PowerPoint, Explorer,
  înainte / după `gestTasta` (azi 0 diferențe).
- `runde/26/regres_r22_proba_grav.py`, `runde/26/regres_r18_proba.py` = probele r22 / r18 copiate, cu ieșirea în `runde/26/probe_iesiri`.

## Unde aș căuta eu, dacă aș fi critic
- K1: Start se deschide la APĂSAREA tastei Windows și se închide la E (A26-2); fluxul are `deschide_start` înainte de `win_e`.
- K3 pe iOS: focusul din „click” (`windows.js:411`) e presupus, nu probat; tastatura ecranului reală nu se vede headless.
- Asistentul: literele din caseta Start sunt greșeli în §6.3 (`L.asistent`, banda r24) → indiciul apare înainte de Enter.
- O3 / O8 nu le-am putut măsura singur (re-randare > 15 min); argumentul „neschimbate” e în raport.
- Explorer-ul montat în Windows (ciclul următor): Windows + E în rădăcina Explorer-ului ar ieși întâi `ctrl_e`.

Raportul: `runde/26/raport_constructor.md`. Diferențele: `runde/26/diferente.md` (nu se dau criticului, după prompt).

GATA_PENTRU_CRITIC
