# Runda 27 · cadrul (scris înainte de reparații)

## Presupuneri despre suprafață (Explorer: caseta de nume, meniurile înalte, căutarea, fereastra)
1. Blur-ul casetei de nume e singurul loc unde se confirmă un nume „din afara tastaturii”; gazda care scoate rădăcina din pagină îl declanșează fără să fie un clic al elevului (critic 23, C1).
2. Meniurile mai înalte decât fereastra NU se pot derula (critic 23, MINOR 1). De verificat cu un gest real (rotița) înainte de a schimba ceva: proba criticului derula doar pagina, nu meniul.
3. Căutarea pierde istoricul de anulare pentru că toată fereastra se redesenează la fiecare literă (`explorer.js:828` vechi).
4. Fereastra din poligon e desenată din `date/explorer.json`, care e generat din referință (`genereaza_explorer.py --verifica` = 0), deci abaterile de aspect pot veni doar din CSS-ul scris de mână (înălțimi, margini, lățimi elastice).

## Citiri ale lui „fidel”
- **aspect**: dreptunghiurile din pagină = dreptunghiurile din `uia_explorer.json` (±2 px), cu ancora fiecărei părți;
- **gest**: același gest (rotița pe meniu, Ctrl+Z în casetă, mutarea ferestrei gazdă) duce la același rezultat ca în aplicația reală / ca într-un câmp obișnuit;
- **stare finală**: după gest, numele fișierelor și caseta sunt cele așteptate (nimic redenumit pe ascuns).

## Citirea aleasă
Unghiul rundei e **aspect**, dar primele trei ținte (MINOR 4, 1, 2) sunt de gest / stare finală: le judec pe **gest + stare finală**, cu probă pe gesturi reale (`proba_grav.py`), iar fereastra și meniurile pe **aspect** (`probe/aspect27.py`). Citirea „doar aspect” pierde pentru MINOR 4 și 2: acolo nu se vede nimic greșit pe ecran până nu faci gestul.
