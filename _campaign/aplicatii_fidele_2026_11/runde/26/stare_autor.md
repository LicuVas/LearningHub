# Starea constructorului, runda 26 (B-windows, unghiul stare_finala_erori), 21.11.2026

## Unde sunt
- Citit: CICLU_PARALEL.md, prompt.md, supliment_B_windows_runda26.md, 22/critic.md (K1-K3), codul (aplicatii.js gestTasta / keydown / I.intrare;
  windows.js tastaStart / la.tasta / la.clic / deseneazaStart).
- Copii pentru „dat înapoi”: runde/26/inainte/ (aplicatii.js, windows.js, windows.json, api_biblioteca.md, de_verificat.md, de_aprobat.md),
  luate la 02:33, înainte de orice scriere.

## Planul hotărât (detaliat în contra.md)
- K1: în `gestTasta` (cod comun), tasta Windows + literă = `win_<l>` DOAR în aplicația care declară `I.tastaWindows` (Windows) și nu pe Mac.
  În windows.js: Start deschis de aceeași apăsare a tastei Windows se închide la literă; Windows + literă = mesajul central „Windows + E”.
- K2: `I.activat = 'bara_activitati:Start'` la tasta Windows; `I.activat = 'start:<rezultat>'` la Enter din căutare.
- K3: un `<input>` adevărat (clasa comună `lh-ap-intrare`, `data-lh-intrare-document`) = `I.intrare` al Windows-ului, pus peste caseta din
  Start, în afara lui startEl (care se redesenează); clicul pe casetă îl focalizează; `I.la.text` / `I.la.sterge` duc textul în căutare.

## Făcut (03:00)
- [x] proba_grav.py la pornire: 36 picate din 81 (probe_iesiri/proba_grav_pornire.json)
- [x] cadru / tinta / contra / diferente
- [x] reparația: aplicatii.js:266-275 (gestTasta), windows.js (K1 :741-750, K2 :570 și :759, K3 :380-411, :694, :783-801, stare :558 și :573),
      api_biblioteca.md:170 (§4, un rând); blocurile RUNDA26-WINDOWS în de_verificat (R26-1..3) și de_aprobat (A26-1..2)
- [x] proba la final: 3 picate (K3b ×2 = Paint fără tastare, fără referință; S3 maximizare 2 px = MĂRUNT, nereparat)
- [x] regres: r22 50/50, r18 37/37, Ctrl+litera A/B pe 4 aplicații = 0 diferențe; O5 = 35 (aceleași), O9 = 13 (aceleași)
- [x] O3 / O8: nemăsurate (re-randare > 15 min; procesele mele oprite); argumentul în raport
- [x] proba finală pe codul final: 3/84; r22 50/50 din nou
- [x] raport_constructor.md + gata_pentru_critic.md
