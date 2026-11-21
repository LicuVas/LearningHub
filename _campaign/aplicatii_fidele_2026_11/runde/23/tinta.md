# Runda 23 · ținta (etapa B, aplicația explorer, unghiul stare_finala_erori)

## Ce a ales ținta
- **Ținta e scrisă de orchestrator** în `runde/supliment_B_explorer_runda23.md`; GRAV-urile criticului 19 au întâietate (prompt, pasul 3).
- **Numerele de pornire** (`runde/23/masurare_pornire.json`, măsurarea comună de la finalul ciclului B):
  O1 61 · O2 13392 · O3 28919 · O4 28 · O5 35 · O6 0 · O7 341 · O8 102 · O9 13 · porți 41.
  Pe Explorer: O4 = 18/18 scenarii la fel ca aplicația reală (`runde/22/iesiri/O4/oracol_comportament.json`, toate `ok`).
- **În câte lecții apare Explorer** (`D/inventar.json`, grep „explorer”): 11 pagini — v/m2-l09, l10, l11, l12, m2-l15, m5-l31,
  m5-l36, vi/m1-l03, vi/m3-l18, vii/m1-l03, jocuri/fisiere-v.
- **De ce aceste GRAV-uri:** N2 (caseta de nume) e pe drumul tuturor celor 11 (Nou › Folder lasă caseta deschisă; F2);
  N1 e pe v/m2-l09 („Acest PC” din panou) pe ecranul I1 al laboratorului; G23-1 (semnele interzise) e pe drumul redenumirii
  (v/m2-l10, l11), unde elevul greșește cel mai des.

## Ținta, în ordine
1. **N2** (`19/critic.md:137`) — cod COMUN, doar condiția `preventDefault` din ascultătorul `keydown` (`aplicatii.js:407`).
2. **N1** (`19/critic.md:113`) — `explorer.js`: rădăcina se încadrează în înălțimea ecranului, ca celelalte aplicații.
3. **A22-1** (`de_aprobat.md:79`) — opțiunea `incadrat` în `explorer.js` + rândul din `api_biblioteca.md` §1. Proba pe
   `runde/23/probe/montare.html`, nu în poligon.
4. **Unghiul stare_finala_erori** — cele 9 greșeli tipice; reparat doar ce pică: **G23-1** (nume cu `\ / : * ? " < > |`).
5. MINOR-urile din critic 19 / 15 — doar dacă rămâne context.

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/explorer.js` (al benzii Explorer);
- `aplicatii/aplicatii.js` — DOAR ascultătorul comun de `keydown`, condiția `preventDefault` (azi `:407`);
- `_campaign/.../api_biblioteca.md` — §1 (rândul `incadrat`) și §4 (regula tastelor din câmpuri, pe care N2 o cere precis);
- `D/de_verificat.md`, `D/de_aprobat.md` — doar blocurile `<!-- RUNDA23-EXPLORER:START/END -->`;
- `D/runde/23/*` (probele, pagina de montare, rapoartele).
Copiile pentru „dat înapoi”: `D/runde/23/inainte/` (aplicatii.js, explorer.js, aplicatii.css, api_biblioteca.md, explorer.json),
făcute înainte de prima scriere; la copiere toate erau identice cu HEAD (`git diff --stat` gol pe `aplicatii/`).
