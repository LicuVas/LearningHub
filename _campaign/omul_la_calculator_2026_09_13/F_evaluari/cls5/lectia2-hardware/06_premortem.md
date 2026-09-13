# 06 — Pre-mortem (U14) și explicații alternative (U13)

Schița scrisă imediat după pasul 1; completată la pasul 5 cu verificările făcute.

**„Ora de vineri, 02.10.2026, la 5AM, a eșuat. De ce?”**

| # | Motivul | Verificarea făcută | Rezultatul |
|--:|:--|:--|:--|
| 1 | Elevii au rămas blocați în primele 10 minute la „Uită-te la imaginile de mai jos” — nu există imagini | `u5_verifica.py` numără `<img>`/`<svg>` în HTML | **0 imagini, 0 svg**; fraza „imaginile de mai jos” există. Fără internet sau fără proiector, provocarea nu se poate face |
| 2 | Ora nu a ajuns la exerciții: 3.570 de cuvinte de citit + 3 exerciții scrise | poarta calculează timpul (U12) | vezi `u12_calcul.txt`: nu încape la ritm provizoriu; la ritm dublu încape la limită → „important”, nu „blocant” |
| 3 | Elevii „știau deja” dispozitivele — ora a părut repetare, iar ora 5 de peste o săptămână n-a mai avut ce preda | script: listele de dispozitive din lecția 1 pas 4 vs lecția 2 pas 4 | **12 din 12 identice** (`u5_iesire.json` → `A_suprapunere`); calendarul pune I/O la 09.10 (`surse/calendar_5AM_5M_extras.txt`) |
| 4 | La Izvoare / în clasa-pereche fără laborator nu s-a putut face nimic | citit ce cere lecția fără calculator | Pașii 1-5 și exercițiile 1-3 merg pe caiet dacă profesorul proiectează sau tipărește; **provocarea de început și imaginile NU** (nu există material de tipărit). Nu se poate confirma fără sală: nu știm dacă 5M are laborator |
| 5 | Răspunsurile scrise la exerciții s-au pierdut până ora următoare | Playwright: scris + „Salvează” + reîncărcare + profil nou (`u5_iesire.json` → C) | rămân doar în browserul acelui PC; într-un profil nou câmpul e gol. Dacă PC-urile se resetează la repornire — nu se poate afla fără sală |

## U13 — explicații alternative pentru semnalările grave

**S1 „Lecția nu are imagini deși le promite.”**
- Alternativa A: imaginile există, dar se încarcă dintr-un fișier JS/CSS extern (nu apar ca `<img>` în HTML).
- Alternativa B: imaginile au fost scoase intenționat (drepturi de autor), iar fraza a rămas.
- Observația care le deosebește: textul randat de Chromium (`innerText.txt`) și capturile `pas_*.png`/`dupa_atomi_*.png` după încărcarea tuturor scripturilor. **Făcută:** `consola.json` = 0 erori, nicio imagine în captura provocării (`ecran_prima_vedere.png`), niciun `<img>` în DOM-ul randat (`u5_iesire.json`). A cade. B nu schimbă nimic pentru elev: sub text tot nu e nimic → semnalarea rămâne.

**S2 „Pasul 4 repetă lecția 1.”**
- Alternativa A: repetarea e intenționată (consolidare), iar lecția 1 doar anunța tema.
- Alternativa B: lista coincide doar la nume, dar lecția 2 aduce ceva nou (categoria „stocare”, explicații).
- Observația: am comparat listele și categoriile. **Făcută:** 12/12 dispozitive identice, inclusiv grupa „mixte/intrare-ieșire” (ecran tactil, căști cu microfon, imprimantă multifuncțională). Nou în lecția 2: doar grupa „stocare” (HDD, SSD, stick) și modem/placă de rețea. A e posibilă, dar planul are pentru I/O o oră întreagă separată (ora 5) → oricum trebuie ales: ori lecția 2 scoate pasul 4, ori ora 5 folosește lecția 2.

**S3 „Afirmația 3 GHz = 3 miliarde de operații pe secundă e greșită.”**
- Alternativa A: e o simplificare acceptabilă pentru 11 ani.
- Alternativa B: lecția se referă la „operație simplă” = un ciclu de ceas, deci e corectă tehnic.
- Observația: sursa (`surse/ghz_sursa.txt`) — o instrucțiune poate lua mai multe cicluri de ceas; comparația doar după GHz e numită explicit „gigahertz myth”. B cade (lecția trage concluzia „de câte ori poate executa o operație”); A e parțial adevărată, dar simplificarea predă exact confuzia pe care o exploatează reclamele → „important”, nu „blocant”.
