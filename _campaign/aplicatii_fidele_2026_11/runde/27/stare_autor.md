# Runda 27 (B-explorer#2, ciclul paralel D) — starea constructorului

MINOR4_GATA 2026-11-21 · explorer.js: blur-ul casetei de nume fără element-țintă se hotărăște după funcția gazdei (microtask + MutationObserver pe document); dacă rădăcina a fost scoasă / pusă înapoi, caseta rămâne cu textul ei și nimic nu se redenumește până la Enter; `instanta.focus()` pune cursorul în casetă. Proba: `runde/27/proba_grav.py M4` = 0 picate din 13 (la pornire 11 picate); `runde/27/probe/c_mont27.py › redesenare in redenumire`: caseta=comp, focusul în casetă, X+Enter -> compX.docx cu `tasta_enter / redenumire`; O4 Explorer 18/18. Contractul pentru gazdă (api §1) nu se schimbă: rădăcina pusă înapoi în aceeași funcție, apoi `instanta.focus()` dacă fereastra era activă.

## Mersul rundei
- MINOR 4: gata (mai sus). Găsit pe drum și reparat: G27-1 (focusul pierdut după clicul care confirmă redenumirea; era și înainte).
- MINOR 2 reparat, MINOR 1 închis prin măsurare (rotița), aspectul: 2 abateri reparate, 1 lăsată la R27-1.
- Final: `proba_grav.py` 14/47 picate la pornire → 0/47; O4 Explorer 18/18; raportul în `raport_constructor.md`, `gata_pentru_critic.md` scris. Constructorul s-a oprit aici (pașii 7-9 sunt ai orchestratorului).
