# Cadrul rundei 26 (B-windows, unghiul stare_finala_erori) — scris ÎNAINTE de reparație

## Suprafețele
Tastatura Windows-ului simulat (tasta cu sigla, singură și cu o literă), caseta de căutare din Start (PC și telefon), asistentul (§6.3)
pe drumul cu tastatura al lecțiilor și stările finale ale drumurilor din lecții (Start, căutarea, ferestrele, meniul desktopului, Nou › Folder).

## Presupuneri (de verificat, nu de crezut)
1. **Tasta cu sigla + E ajunge la pagină doar în afara unui Windows real.** Pe PC-urile cu Windows ale elevilor, combinația o prinde
   sistemul (critic 22, K1, „Observație pentru orchestrator”). Deci reparația contează pe ChromeOS / Linux / Mac și în probe; pe Windows
   real pagina vede cel mult tasta Windows apăsată. Nu o pot verifica pe un Windows real (nimic pe ecranul omului) → rămâne presupunere.
2. **`metaKey` tratat ca Ctrl în `gestTasta` e pentru Mac** (Cmd + B = aldin în Word pe Mac). O schimbare pentru toate aplicațiile ar strica
   Mac-ul la Word / Excel / PowerPoint; de aici: schimbarea doar în aplicația care declară tasta Windows a ei, și nu pe Mac.
3. **Pe telefon, tastatura ecranului apare doar pentru un câmp editabil focalizat dintr-un gest al omului**, iar un câmp scos din pagină
   își pierde focusul (tastatura se închide). `deseneazaStart` refăcea tot Start-ul la fiecare literă, deci câmpul nu poate sta în el.
4. **„mousedown”-ul de compatibilitate vine DUPĂ atingere** (pointerdown → pointerup → mousedown → click) și mută focusul pe cel mai apropiat
   element focalizabil (rădăcina, tabIndex -1). Un focus dat la pointerup ar fi furat imediat. Anularea lui pointerdown oprește
   evenimentele de mouse de compatibilitate (Pointer Events, „compatibility mapping”).
5. **Asistentul (§6.3) numără tastarea ca greșeală.** Pe drumul „Windows, pai, Enter”, literele „p”, „a” sunt două greșeli → indiciul pasului
   următor apare înainte de Enter. Asta e regula comună din `L.asistent` (banda r24), nu a mea.

## Citirile lui „fidel” pentru suprafața asta
- **(a) Aspect**: Start și caseta arată ca în referință. Deja închis la 18 / 22 (W1-W3); runda nu-l atinge.
- **(b) Gestul**: aceeași apăsare dă același lucru ca în Windows (tasta singură = Start, la ridicare; tasta + E = altceva decât Start).
- **(c) Starea finală + mesajul (unghiul rundei)**: după fiecare drum al lecției, `stare()` = ecranul, evenimentul §4 spune ce s-a întâmplat,
  asistentul nu-l mustră pe elevul care urmează lecția, iar o comandă nesimulată dă mesajul central, nu tăcere (R12).

## Citirea aleasă: (c), cu (b) cât se poate fără să stric (c)
- (a) pierde: e închisă și nu e unghiul rundei.
- (b) pierde parțial: Windows deschide Start la RIDICAREA tastei; ca să fac la fel, evenimentul de deschidere ar trebui emis la `keyup`, adică
  prin `I.emite`, care NU poartă `activat` (`aplicatii.js:121`, `I.emite = (gest, actiune, tinta, inainte) => …`). K2 cere `activat` pe tasta
  Windows. Zona mea din cod comun e doar `litera` / `gestTasta`, deci `I.emite` nu-l pot lărgi. Aleg: Start se deschide la apăsare (ca azi,
  cu `activat`), iar Windows + literă îl închide înapoi și dă mesajul. Starea finală e cea din Windows; pe drum rămâne o clipire și un
  eveniment `deschide_start` în plus (scris în contra.md ca adevărul incomod).
