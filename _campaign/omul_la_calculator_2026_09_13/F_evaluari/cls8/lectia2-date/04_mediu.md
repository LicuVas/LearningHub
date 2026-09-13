# 04 — Ce mediu presupune lecția (U4)

| Aspect | Ce presupune lecția (citat din innerText.txt) | Ce se știe (sursă) | Verdict |
|:--|:--|:--|:--|
| Program | „Deschide Excel sau Google Sheets” | laborator Brauner: dotare NECUNOSCUTĂ; Izvoare: probabil fără laborator (B_context_real §3) | depinde de necunoscut |
| Limba interfeței | engleză: „tab-ul Home”, „Fill Color”, „Borders”, „Merge & Center”, „Currency”, „Percentage” | Microsoft ro-ro, text brut: „Pe fila Pornire , selectați Îmbinare & centru” (`surse/imbinare_ro.txt`); „Monedă”, „Procentaj”, „Număr” (`surse/formate_numar_ro.txt`); „Alegeți o culoare de umplere. Alt+H, H” (`surse/shortcuts_ro.txt`). Numele românesc pentru Borders: NECONFIRMAT (pagina a dat eroare) | dacă laboratorul are Office în română, niciun nume de buton din lecție nu se potrivește |
| Separator zecimal | punct peste tot: „8.5 devine 8.50”, „3.50 lei”, „1234.5”, „0.85” | Windows ro-RO: separator zecimal „,”, listă „;”, dată scurtă „dd.MM.yyyy”; en-US: „.”, „,”, „M/d/yyyy” (`u4_cultura.txt`, CultureInfo .NET pe acest PC). LibreOffice pe acest PC (ro-RO) afișează „8,50”, „1.234,50”, „3,50 lei” (`07_redeschis.json`) | depinde de setarea regională a laboratorului (necunoscută) |
| Format de dată | „Scrie data in formatul zz/ll/aaaa (de ex. 15/01/2026)” | .NET TryParse: „15/06/2026” = dată în ro-RO, **nu** e dată în en-US; „8.5” în ro-RO **nu** e număr (e interpretat ca dată 8 mai) — indiciu .NET, NU comportamentul exact al Excel (`u4_cultura.txt`) | **niciuna dintre cele două setări nu face să meargă ambele convenții ale lecției**: pe ro-RO merge data, nu merge zecimala cu punct; pe en-US invers |
| Scurtături | „Align Left … Ctrl + L”, „Center … Ctrl + E”, „Align Right … Ctrl + R” | Microsoft en-us: „Display the Create Table dialog box. Ctrl+L or Ctrl+T”, „Invoke Flash Fill … Ctrl+E” (`surse/shortcuts_en.txt`); ro-ro la fel (`surse/shortcuts_ro.txt`) | greșit în Excel, indiferent de limbă |
| Scurtătura Currency | „Ctrl+Shift+4 functioneaza doar pe tastaturi cu layout US” | lecția însăși declară dependența de tastatură — corect semnalat | ok |
| Nume funcții | „=SUM(E4:E8)” | Excel ro nu traduce numele funcțiilor (fapt stabilit în protocol, U4) | ok; separatorul nu apare (un singur argument) |
| Windows | nespecificat | necunoscut | — |

**Ce trebuie scris în lecție (propunere):** o casetă „Înainte de oră” cu două rânduri: *pe calculatoarele cu Windows în română scrii 8,5 și 3,50; data 15.06.2026 sau 15/06/2026* · *pe Windows în engleză scrii 8.5; data 6/15/2026*, plus numele butoanelor pe două limbi: „fila Pornire (Home) → Îmbinare & centru (Merge & Center)”.
