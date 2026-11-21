# Runda 27 · contra

**Cel mai puternic argument PENTRU:** toate reparațiile stau în `explorer.js` și sunt păzite: blur-ul amânat lucrează doar când blur-ul n-are element-țintă (clicul în listă, Tab, clicul în căutare merg pe drumul vechi, sincron); redesenarea parțială a căutării cade pe redesenarea întreagă când e deschis un meniu, un dialog, o redenumire sau adresa. Nimic din codul comun, deci nimic la Word / Excel / PowerPoint / Windows.

**Cel mai puternic argument ÎMPOTRIVĂ:** amânarea confirmării (microtask) schimbă ORDINEA pentru blur-urile fără țintă: clicul pe un loc nefocusabil din afara Explorer-ului confirmă numele după ascultătorul de blur, nu în el. Iar „rădăcina a fost scoasă” se citește din înregistrările unui MutationObserver pe tot documentul — dacă o gazdă scoate și pune la loc ALT strat care conține rădăcina în aceeași funcție dintr-un clic al elevului, caseta rămâne deschisă (cum cere api §1, dar altfel decât un clic obișnuit).

**Adevărul incomod (punctul cel mai puțin sigur):** MINOR 1 l-am închis prin MĂSURARE, nu prin cod: meniurile se derulau deja cu rotița (cutia `.lh-ap-e-mw` are `overflow:auto; max-height:100%`), proba criticului 23 derula doar pagina. Pe telefon, gestul cu degetul nu se poate juca headless (nici un `div` martor nu derulează cu `Input.synthesizeScrollGesture`), deci derularea cu degetul e dedusă din CSS (`touch-action: auto`, niciun `preventDefault` pe touch / pointer — măsurat), nu observată → R27-2.

**Hotărârea:** reparațiile 4 și 2 + G27-1 rămân (probe 0 picate, regres 0); MINOR 1 fără cod, cu R27-2 pentru telefonul real; aspectul: două abateri reparate în CSS (bara de stare, adresa pe telefon), una lăsată pe seama referinței (lățimea panoului de navigare, R27-1).
