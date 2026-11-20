# Runda 15 · pasul 2 · CADRU (înainte de orice reparație) — File Explorer în bibliotecă, unghiul `aspect`

Pornirea: `runde/15/masurare_pornire.json`. Explorer NU există în bibliotecă (`aplicatii.js:77-81`: `SURSE_APP` are doar
word/excel/powerpoint → „„explorer” nu e încă în bibliotecă”). Azi O4 joacă scenariile Explorer pe simulatorul VECHI
(`lectii/v/m2-l10`, motor `vechi:explorer`): 14/18 trec, 4 au diferențe (dialogul de conflict fără „Mai puține detalii”,
dialogul „nume existent” cu alt text). O5: 32/32 gesturi Explorer fără eveniment. O9: 8/8 cazuri Explorer picate.
O3 pe suprafețele `explorer.*` = 1261 de puncte (citite din lecțiile vechi; biblioteca nu desenează nimic).

## Presupuneri despre suprafață (de verificat, nu de crezut)
1. **Fereastra reală are 1534×814 px** (`uia_explorer.json › explorer_fereastra › ferestre[0].rect_ecran_100`), mai lată
   decât poligonul (1100-1366). Presupun că elevul recunoaște Explorer-ul după ORDINEA și LOCUL relativ al părților (rândul
   de file sus, butoanele de navigare stânga, adresa la mijloc, căutarea dreapta, bara de comenzi, panoul de navigare
   stânga, lista, bara de stare), nu după pixelul absolut. Comenzile aliniate la dreapta (Previzualizare, butoanele
   de vizualizare din bara de stare, căutarea) se lipesc de marginea dreaptă, ca la o fereastră mai îngustă.
2. **Etichetele din referință sunt cele de pe PC-ul din laborator** (Windows 11 25H2, română). Cele specifice PC-ului
   profesorului (Google Drive (G:), RamDisk (A:), Volum nou (W:), „FastStone PNG File”, extensiile din meniuri: Dropbox,
   Notepad++, 7-Zip, PDF24, Bytello…) NU sunt pe PC-ul elevului; le păstrez totuși (fidel = ca referința), iar diferența
   „PC profesor ≠ PC laborator” intră în `de_verificat.md` (R15-…), nu o rezolv prin etichete scrise de mână.
3. **Nodurile ascunse pentru date personale** (15 în panoul de navigare, 1 în adresă) sunt locuri pe care Windows le
   umple cu foldere ale utilizatorului: pun acolo folderele obișnuite ale unui cont de elev (Desktop, Descărcări,
   Documente, Imagini, Muzică, Videoclipuri) și folderele de lucru ale lecției — aceeași familie de tip (`TreeItem`).
4. **Comportamentul din cele 18 scenarii e `model_obiect`** (starea după operație, prin shell COM), nu gestul. Textele
   dialogurilor (titlu, întrebare, butoane) sunt reale; aspectul ferestrelor de dialog NU e capturat
   (`SHELL_FARA_MOTIV › explorer.dialog.*`).

## Ce poate însemna „fidel” pentru Explorer
- **(a) aspect** — aceleași elemente, în aceeași ordine, cu aceleași etichete și același loc relativ (R4, O3).
- **(b) gest** — același gest (dublu clic, F2, Delete, Ctrl+C/V, clic dreapta) pornește aceeași comandă (R5/R6, O5).
- **(c) stare finală** — după operație, numele fișierelor, Coșul, conținutul și dialogul sunt ca în Windows (R5, O4).
- **(d) mesajul** — dialogurile au exact titlul, întrebarea și butoanele reale (O4 › `dialog`).

## Citirea aleasă
Unghiul rundei e `aspect`, dar Explorer nu există deloc: o interfață frumoasă care dă altă stare ar învăța elevul greșit,
iar o stare corectă pe o interfață inventată nu se găsește în laborator. Aleg **(a)+(c)+(d) împreună, cu (a) ca
prioritate de unghi**: interfața GENERATĂ din referință (nicio etichetă scrisă de mână), comportamentul din scenarii,
dialogurile cu textele reale. (b) intră prin evenimente (O5), fără să inventez gesturi pe care referința nu le dă.
De ce pierd celelalte citiri luate singure: (a) singur lasă O4 să crească (biblioteca ar înlocui simulatorul vechi în O4,
deci un comportament lipsă ar fi regres); (c)/(d) singure n-ar folosi referința UI capturată azi, care e motivul rundei.
