# Runda 23 · cadrul (înainte de orice reparație) — B-explorer, ciclul paralel C, unghiul stare_finala_erori

## Pasul zero: GRAV-urile reproduse pe codul de azi (HEAD aa474508, worktree neatins de alte benzi la pornire)
Proba: `runde/23/proba_grav.py` (headless, 127.0.0.1, port liber; ieșiri în `probe_iesiri/proba_grav_inainte*.{log,json}`).
- **N2 reprodus:** în toate cele 4 câmpuri Explorer (caseta F2, caseta după Ctrl+Shift+N, adresa F4, căutarea Ctrl+E), toate cele
  26 de scurtături (F5, F3, F4, F6, F7, F10, F11, F12, Ctrl+R/P/S/L/E/F/D/H/J/O/U/G, Alt+← → ↑ Home, Ctrl+Shift+C/Delete) au
  `defaultPrevented: false` (4 verificări picate din 15). Tastele de editare și lista se poartă corect.
- **N1 reprodus:** la 1093×526 css (1366×657 la 125 %) mesajul „Acest PC” / „Proprietăți” e la y 570-605, sub ecran
  (`inPagina: false`); rădăcina are 640 px față de 526 (3 verificări picate). Telefonul 360 / 390 și PC-ul 1366 trec.
- **A22-1 (cerere, nu GRAV al criticului):** opțiunea nu există: bara de titlu + Coșul se desenează, `stare()` n-are titlul,
  evenimentele ajung la gazdă (cu gazda Windows: `clic`, `clic_dreapta` ale aplicației „windows” pe ținte din Explorer),
  după redesenarea gazdei focusul se pierde, `deschideSuprafata` ia prima aplicație vie (9 picate din 15).
- **Unghiul stare_finala_erori:** 8 din 9 greșeli tipice dau o stare = ecranul = evenimentul. A noua NU: redenumirea cu semne
  interzise. „a/b” mută `notite.txt` într-un folder inexistent `a/` (dispare din listă, `selectie: ["b.txt"]`); „x:y”, „de ce?”,
  „a<b>” devin nume de fișier pe care Windows nu le poate avea (4 picate). E un GRAV nou, găsit de această rundă (G23-1).

## Presupuneri despre suprafață
1. N2 e o regulă de API (§4), deci „fidel” se judecă aici pe `defaultPrevented`, nu pe referința UIA: Windows nu are browser.
   Ce contează e că tasta nu pleacă din lecție (F5 / Ctrl+R / Alt+←) și că editarea în câmp lucrează exact ca înainte.
2. Celelalte aplicații au câmpuri (Save As, Name Box, Start, casetele panglicii) care azi primesc toate tastele; schimbarea comună
   le atinge pe toate → regresul pe ele e obligatoriu, iar orice tastă pe care o aplicație o tratează singură în câmp (Alt+↓ în
   Word, Tab / Enter / Esc în ferestre) trebuie să rămână neschimbată.
3. Rădăcina Explorer are `max-height:none` din runda 15; celelalte aplicații au `max-height:100vh` (aplicatii.css:8). Presupun
   că `none` a fost o scăpare (critic 15 › MINOR 7 „bara de stare sub pliu”), nu o alegere legată de O3: la 1366×768 (pe care
   măsoară O3) 100vh = 768 > 640, deci aspectul măsurat nu se mișcă.
4. Montarea (A22-1): gazda e o rădăcină a bibliotecii (Windows). Ascultătorii ei de `pointerdown` (captură pe rădăcină) și de
   `pointerup` (captură pe window) sunt în `aplicatii.js › leagaGesturi`, în afara zonei mele; din `explorer.js` se pot opri doar
   evenimentele care urcă (bubbling).

## Citiri ale lui „fidel” pentru suprafețele rundei
- **(a) stare finală:** după o greșeală, starea și ecranul sunt cele ale aplicației reale (referința: scenariile `explorer_*`).
- **(b) mesaj de eroare:** greșeala dă mesajul / dialogul aplicației reale (balonul „Un nume de fișier nu poate conține…”).
- **(c) gest:** tasta face în câmp ce face în Windows (editează), iar scurtăturile nu ies din lecție.
**Aleasă: (a), cu (c) pentru N2.** De ce pierd celelalte: (b) cere textul și locul balonului, care NU sunt în referința înghețată
(`uia_explorer.json`, `scenarii_real/`, `surse_microsoft.md` — grep „nu poate conține / caracter”: 0) → [NEVERIFICAT]; după
regulă, comportamentul nereferit nu se inventează: starea rămâne corectă (numele nu se schimbă), iar ce nu e simulat primește
mesajul central (R12). Rândul R23-… cere captura balonului.
