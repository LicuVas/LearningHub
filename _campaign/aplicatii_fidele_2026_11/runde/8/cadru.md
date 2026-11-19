# Runda 8 · etapa B · Excel · CADRU (pasul 2, înainte de orice reparație)

Suprafața: tastatura și ferestrele Excel-ului simulat (meniuri, liste, ferestre, editarea formulei, panglica), adică cele
9 GRAV deschise de `runde/7/critic.md`: K3, K5, K4, X5, X8, K2, K1, K6, X10 (graficele).

## Presupuneri (de verificat, nu de crezut)
1. Referințele noi din runda `acoperire` (`uia_excel.json › suprafete` + `scenarii_real/excel-*`) ajung ca să decid fiecare
   GRAV fără Excel real. Unde nu ajung (ordinea listei de completare, Order după coloană, Excel fără registru), nu inventez.
2. `date/excel.json` e generat (`aplicatii/_unelte/genereaza_excel.py`) și nu are încă suprafețele noi; regenerat, primește
   cele 17 chei fără să schimbe vreuna veche (verificat: „schimbate: []”). Singura capcană: `dialog.SortDialog#Add Level`
   intră în `dialoguri.SortDialog.file` ca o „filă”; Sort nu are file, deci nu trebuie să apară ca filă.
3. Evenimentele tastelor trec prin `aplicatii.js` (comun cu Word). Ce schimb acolo trebuie să fie opțional (Excel îl cere,
   Word nu), altfel Word se poate strica fără să-mi dau seama.
4. Probele vechi verifică uneori exact comportamentul pe care referința nouă îl contrazice (`proba_grav_cont2.py › X8`:
   „Ctrl+W pe registru modificat → mesajul central”). Acolo proba veche va pica, iar asta e corect; nu o „repar”.
5. O3 se citește pe poligon, prin plasa `deschideSuprafata`; listele (`lista.*`) se deschid DOAR prin plasă. Dacă le desenez
   din referință, O3 scade; dacă le desenez de mână, nu.

## Citiri ale lui „fidel” pentru suprafața asta
- **Aspect**: listele și ferestrele desenate exact ca în referință (poziție, etichete).
- **Gest**: aceeași tastă face același lucru (săgeata în meniu mută alegerea, Alt+literă apasă butonul, Enter = butonul
  implicit, Alt, H, 1 = Bold, `=` + ↑ = adresa).
- **Stare finală / mesaj de eroare**: după gest, `stare()` și ecranul sunt ca în Excel real (`=AVEDEV(…)` 0,666667,
  `=B4`, fereastra „Save your changes…”, fereastra „too few arguments”), fără mesaje false despre Excel.

**Aleg „gest + stare finală”** (cu aspectul din referință acolo unde desenul vine gratis din `date/excel.json`): GRAV-urile
criticului 7 sunt toate de felul „elevul apasă o tastă și obține altă stare sau un mesaj fals” (K1-K6), plus ferestre
care lipsesc (X5, X8, X10). Aspectul singur pierde: o listă frumoasă pe care tastatura o ignoră e tot GRAV. Mesajul singur
pierde: K5 e tocmai un mesaj fals, dar repararea lui cere gestul (modul Point), nu alt text.
