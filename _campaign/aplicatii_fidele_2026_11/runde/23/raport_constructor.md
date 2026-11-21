# Runda 23 · raportul constructorului (B-explorer, ciclul paralel C, unghiul stare_finala_erori) — 21.11.2026

## Numerele
| proba (`runde/23/proba_grav.py`, gesturi reale, headless, 127.0.0.1) | la pornire | la final |
|---|---|---|
| N2 — tastele în cele 4 câmpuri Explorer + editarea + telefonul + lista | 4 / 15 picate | **0 / 15** |
| N1 — mesajul central pe 1093×526 @1,25, telefon 360 / 390, PC 1366 | 3 / 10 | **0 / 10** |
| MONT — A22-1, gazda `div` + gazda Windows (`probe/montare.html`) | 9 / 15 | **2 / 15** (0 / 15 cu propunerea comună, pe copie) |
| SFE — cele 9 greșeli tipice: stare = ecran = eveniment §4 | 4 / 36 | **0 / 36** |
| **total** | **20 / 76** | **2 / 76** |
- Pornire: `probe_iesiri/proba_grav_inainte.log` (N2 / MONT din `proba_grav_inainte_N2.log`, `proba_grav_inainte_MONT.log`:
  prima rulare număra greșit apăsarea lui Ctrl singur, am reparat proba și le-am reluat pe codul neatins).
- Final: `probe_iesiri/proba_grav_final.{log,json}`. Erori de pagină 0, cereri plecate 0, în toate rulările.
- **O4 pe cele 18 scenarii Explorer:** 18/18 la pornire (`runde/22/iesiri/O4`) → **18/18** după (`probe_iesiri/O4_explorer_final.log`,
  0 diferențe, 0 ecran ≠ stare).
- **Regresul N2 pe celelalte aplicații** (`probe/regres_n2.py`; aceeași copie a lui `aplicatii/` cu și fără hunk-ul N2, în %TEMP%):
  89 de pași pe 7 drumuri (Word Save As › File name; Excel Name Box și editarea în celulă F2; PowerPoint Font Size și textul din
  diapozitiv; Windows căutarea din Start și redenumirea unei pictograme). **0 diferențe neașteptate** (câmp, valoare, selecție,
  evenimente §4, starea întreagă); **11 așteptate**: F12 / Ctrl+S / Ctrl+P / F5 / Ctrl+R / Alt+← în câmp, acum `defaultPrevented: true`.
  Tastarea, diacriticele prin compunere (CDP `insertText` „ăîșțâ”), Ctrl+A / C / V / Z, Home / End / Shift+End, Ctrl+← /
  Ctrl+Backspace, Alt+↓ în Word: identice. Log: `probe_iesiri/regres_n2_compara.log`, rezumat pe pași `regres_n2_dupa_rezumat.txt`.

## Ce am reparat
- **N2** (`19/critic.md:137`) — `aplicatii.js:415-426`, doar condiția `preventDefault` din ascultătorul comun de `keydown`:
  în câmp se opresc toate tastele cu Ctrl / Alt / F, în afară de cele de editare (Ctrl+A/C/V/X/Z/Y, Ctrl+Shift+Z/V, săgețile,
  Home/End, Backspace/Delete simple sau cu Ctrl/Shift; pe Mac și cu Option; Ctrl+Shift+Delete = al browserului, deci oprit).
  Tab în câmp rămâne ca înainte (R23-1). Scrisul, Enter, Esc nu ajung la condiție; AltGr (Ctrl+Alt) iese înainte (`gestTasta = null`).
- **N1** (`19/critic.md:113`) — `explorer.js:49`: `max-height:none` → `max-height:100vh`, ca regula comună (`aplicatii.css:8`).
  La 1093×526 fereastra are 526 px, mesajul și bara de stare sunt în pagină; la 1366×768 tot 640 px. `aplicatii.css` neatins.
- **G23-1** (GRAV nou, găsit de unghiul rundei) — `explorer.js:508-511`: un nume cu `\ / : * ? " < > |` nu mai e primit (numele
  rămâne, mesajul central). Înainte „a/b” muta fișierul într-un folder inexistent (dispărea din listă).
- **A22-1** — `explorer.js`, opțiunea `incadrat` (`:51-52` CSS, `:198-202`, `:243-246`, `:275-276`, `:927-932`):
  - fără bara de titlu (rândul filelor + Minimizare / Maximizare / Închidere) și fără desktopul cu Coșul; umple corpul gazdei;
  - își oprește evenimentele în rădăcină (click, dblclick, contextmenu, wheel, taste, pointer, mouse, touch, input, drag);
  - `stare().titlu` = „<folder> - Explorer” (referința: „sesiune - Explorer”), doar la montare, ca starea din poligon / O4 să nu se schimbe;
  - supraviețuiește redesenării gazdei: gazda pune înapoi `instanta.radacina` (starea și ascultătorii rămân) și cheamă `focus()`;
  - documentat în `api_biblioteca.md` §1.
  - **Neînchis pe worktree (2 verificări):** clicul din Explorer ajunge și la gazda Windows (captura ei de `pointerdown`), iar
    `deschideSuprafata` ia prima aplicație vie. Ambele sunt cod comun în afara zonei r23 → patch exact + proba pe copie (0 / 15):
    `propunere_comun_A22-1.md`, cererea **A23-1** în `de_aprobat.md`.
- **Unghiul stare_finala_erori:** cele 9 greșeli tipice trec (stare = ecran = eveniment); ce nu e în referință → R23-1…5.

## Fișiere comune atinse
- `aplicatii/aplicatii.js` — **`:415-426`** (rândul vechi `:407` `if (!inCamp && (e.ctrlKey || …)) e.preventDefault();` înlocuit
  cu comentariul `:415-419`, `cuMod` `:420`, `lit` `:421`, `deEditare` `:422-425`, `if (inCamp ? cuMod && !deEditare : cuMod || e.key === 'Tab')` `:426`).
  Nimic altceva din fișier (zonele r24 `L.asistent` și r26 `gestTasta` / `litera` neatinse). Hunk-ul singur: `diff_runda23.patch`.
- `_campaign/aplicatii_fidele_2026_11/api_biblioteca.md` — **§1 `:38-41`** (rândul `opt.incadrat`) și **§4 `:191-194`** (regula
  tastelor din câmpuri, precizată cum o cere N2).
- `de_verificat.md` / `de_aprobat.md` — doar blocurile `<!-- RUNDA23-EXPLORER:START/END -->` (la capăt).
- `aplicatii.css`, `panglica.js`, `stare.js`, `poligon.html`, `setari.json`, `versiune.json`: neatinse.
- Copiile pentru „dat înapoi”: `runde/23/inainte/` (identice cu HEAD la copiere).

## Fișierele benzii
`aplicatii/explorer.js` (diff întreg în `diff_runda23.patch`). Artefactele rundei: `cadru.md`, `tinta.md`, `contra.md`,
`diferente.md`, `proba_grav.py`, `probe/{h23.py, montare.html, regres_n2.py, aplica_propunere.py}`, `propunere_comun_A22-1.md`,
`probe_iesiri/`.

## NEFĂCUT
- **A22-1, partea comună** (dublurile clicului la gazda Windows, `deschideSuprafata` pe aplicația cerută) — deblocator:
  orchestratorul aplică P1 + P2 din `propunere_comun_A22-1.md` (A23-1). Legarea în `windows.js` = banda Windows, ciclul următor.
- **MINOR-urile** din critic 19 (1-5) și 15 — neatinse în runda asta (am oprit înainte de prag ca să las loc criticului).
- **Măsurarea completă** (`masoara.py`, pasul 7) și pașii 8-10: ai orchestratorului.

## NESIGUR
- Headless n-are scurtăturile Chrome: dovada N2 e `defaultPrevented`, nu „F5 nu reîncarcă”. Ctrl+W / N / T sunt rezervate în
  Chrome (pagina nu le poate opri).
- [NEVERIFICAT] → `de_verificat.md`: R23-1 (Tab în câmp), R23-2 (balonul pentru semne interzise), R23-3 (Ctrl+X → Ctrl+V în
  același folder), R23-4 (textul listei goale la căutare), R23-5 (titlul pe bara de activități).
- Așteaptă aprobarea lui Vasile: A23-2 (semnele interzise = numele rămâne + mesajul central, nu balonul).
