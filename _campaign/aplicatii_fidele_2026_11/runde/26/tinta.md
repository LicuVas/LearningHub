# Ținta rundei 26 (B-windows)

## De unde vine
- GRAV-urile criticului din runda trecută au întâietate (prompt.md, pasul 3); ținta e scrisă de orchestrator în
  `runde/supliment_B_windows_runda26.md`: K1, K2, K3 (`runde/22/critic.md:83`, `:100`, `:119`), apoi unghiul stare_finala_erori.
- W4 rămâne parțial: montarea Explorer-ului o face banda r23 în ciclul ăsta; legarea vine în ciclul următor (A22-1).

## Numerele care au ales-o
- Pornirea (`masurare_pornire.json`, comună ciclului): O3 = 28919, O4 = 28, O5 = 35 (din care windows 3: clic_fila, lansator_grup,
  selectie — nu sunt ținta), O8 = 102, O9 = 13, porți = 41.
- Proba rundei la pornire (`probe_iesiri/proba_grav_pornire.json`): **36 de verificări picate din 81** — K1 12/16, K2 5/6, K3 14/21,
  K3b (Paint fără tastare pe telefon) 2/2, S3 1/10, S5 2/6 (S5 = artefact al probei: al doilea clic dreapta cădea pe folderul creat de
  primul; reparat în probă, nu în simulator).
- Lecțiile atinse: Windows + E apare în 11 lecții (critic 22, K1); drumul „tasta Windows, scrie, Enter” în vi/m2-l11, cele 9 lecții viii
  și v/m2-l08 (K2); caseta pe telefon în v/m2-l08 (K3).

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/windows.js` (propriu benzii Windows).
- `aplicatii/aplicatii.js` — COMUN, doar `litera` / `gestTasta` (zona dată de orchestrator; azi `:261-284`).
- `_campaign/.../api_biblioteca.md` — COMUN, doar §4 (un rând).
- `D/de_verificat.md`, `D/de_aprobat.md` — doar blocul `RUNDA26-WINDOWS`.
- `D/runde/26/*`.
- NU: `aplicatii/explorer.js` (r23), `word.js` (r24), `excel.js` (r25), zonele lor din `aplicatii.js`, zona înghețată, lecțiile.
