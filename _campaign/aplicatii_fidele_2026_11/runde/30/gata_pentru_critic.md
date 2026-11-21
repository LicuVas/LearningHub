# Runda 30 (B-windows#2, ciclul paralel D, unghiul aspect) — gata pentru criticul rece

## Ce s-a schimbat (copiile de dinainte în `runde/30/inainte/`, identice cu 24fd4eb5)
- `aplicatii/windows.js` (al benzii; `runde/30/diff_windows_js.txt`): N1 `:223-227`; Explorer-ul montat `:705-785` + `deseneazaFerestre`
  `:251-294` + butonul fixat `:872-878` + Windows + E `:953` + Start › Explorer `:468`, `:893`; Start la ridicare + tastele din Explorer
  `:787-842`; `seteazaStart` (focusul) `:690-703`; mesajul `win_<tastă>` `:848-852`, `:948-957`; clic dreapta pe Start `:926-932`;
  CSS `:35-37` (stratul ferestrelor) și `:44` (corpul ferestrei); zona maximizării `:252-254`; curățenia `I.distruge`.
- `aplicatii/aplicatii.js` (COMUN), doar zonele din supliment (`runde/30/diff_aplicatii_js_runda30.txt` = A/B, doar ale rundei 30):
  `I.emite` `:121`, `deschideSuprafata` `:187-188`, `WIN_COD` + `tastaWin` + `gestTasta` `:269-298`, `pointerdown` `:350-353`.
- `api_biblioteca.md` NEatins (înghețat): textul propus în `runde/30/api_propunere.md`.
- `de_verificat.md` / `de_aprobat.md`: blocurile `RUNDA30-WINDOWS` (R30-1..6, A30-1).

## Cum se reproduce
- `python .../runde/30/proba_grav.py --minor4 --eticheta <x>` → `probe_iesiri/proba_grav_<x>.json` (secțiuni: N1 N2 W4 A262 SF TEL ASP;
  ultima linie = picate).
- `LH_AB=<dosar temporar> python .../runde/30/regres_ctrl_tasta.py` → Ctrl / Meta + tastă + un clic / clic dreapta pe Word, Excel,
  PowerPoint, Explorer, Windows, A (acum) / B (zonele rundei puse înapoi).
- O4 A/B pe 42 de scenarii: `LH_RADACINA=<LH_AB>/A|B LH_IESIRE=runde/30/probe_iesiri/O4_A|B python oracole/oracol_comportament.py
  --scenarii runde/30/probe/scen30`.
- Probele vechi: `runde/30/regres_r26_proba_grav.py --eticheta r26_final`, `regres_r22_proba_grav.py --eticheta r22_final`,
  `regres_r18_proba.py` (copii, ieșirile în `runde/30/probe_iesiri`).
- `runde/30/probe/z_stiva.py`: Start deasupra ferestrelor după 20 de activări.

## Unde aș căuta eu, dacă aș fi critic
- Montarea e asincronă: între clic și încărcarea Explorer-ului fereastra există fără conținut (titlul „Explorer”); un clic / o redesenare
  în acel interval (`deschideExplorer`, `.then`).
- Focusul după mutarea rădăcinii Explorer-ului (`deseneazaFerestre`, `M.focusMont`, `seteazaStart`): rename-ul din Explorer în timpul
  activării altei ferestre, Start deschis din Explorer și închis cu Esc.
- Tastele cu Windows ținut din Explorer (`tasteMontaj`, pe window, în captură): Windows + Shift + S, Windows + tastă repetată, Windows
  apăsat în Explorer și ridicat după un clic pe desktop.
- `LH.aplicatii.tinte('windows')` cu Explorer-ul montat include țintele lui (cod comun, nereparat, în raport).
- A26-2: evenimentul tastei Windows vine la ridicare; probele care citesc între `down` și `up` văd 0.
- Telefonul: dosarul galben se vede doar după glisarea benzii barei (R30-6).

Raportul: `runde/30/raport_constructor.md`. Diferențele: `runde/30/diferente.md` (nu se dau criticului, după prompt).

GATA_PENTRU_CRITIC
