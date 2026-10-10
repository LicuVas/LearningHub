# Autor excel_a — Excel, clasa a VIII-a, lecțiile 1-7 (10.10.2026)

Fișier: `cum-fac/_sursa/fise_excel_a.json` — **58 de fișe**.
Verificator: `node cum-fac/_build/valideaza_fise.mjs fise_excel_a.json` → `fișe: 58 · fișiere: 1` / `0`.
Rulat și pe toate fișierele odată (excel_a + excel_b + powerpoint + windows_web): 203 fișe, `0`, niciun id dublat.

## Câte fișe, pe lecții
| Lecția | Fișe | Gesturi |
|---|---|---|
| VIII/1 | 0 | (n-are gesturi în Excel; vezi mai jos) |
| VIII/2 | 10 | zoom, fila panglicii, selectezi o celulă, scrii și confirmi, Tab+Enter pe rând, Esc, săgețile, saltul cu caseta de nume, textul întreg în bara de formule, fișier descărcat + Activare editare |
| VIII/3 | 16 | registru nou, prima salvare, Ctrl+S, Salvare ca, alt format (PDF/CSV), închidere registru, închidere fereastră, deschidere, foaie nouă, trecere între foi, redenumire, culoarea filei, ștergere foaie, recuperarea foii șterse, mutare foaie, copiere foaie |
| VIII/4 | 8 | adresa celulei, selectarea unei zone (tragere și Shift+clic), copiere-lipire (taste, clic dreapta, panglică), decupare-lipire, golire (Delete / Golire conținut), Ctrl+Z, ștergere rând, ștergere coloană |
| VIII/5 | 5 | data calendaristică, tipul după așezare, zecimalele cu virgulă, nota făcută dată (Ctrl+Z / Golire totală), zerourile din față cu apostrof |
| VIII/6 | 14 | lățime coloană (tragere), potrivire automată, înălțime rând, aliniere stânga/centru/dreapta, aliniere sus/mijloc/jos, Îmbinare și centrare, Încadrare text, borduri, culoare de umplere, aldin, stiluri celule, zecimale afișate, procent, Long Date |
| VIII/7 | 5 | formula cu operatori, parantezele, #VALUE!, #DIV/0!, #NAME? |

Cele două fișe din exemplu sunt preluate și verificate cu lecția VIII/3. Trei schimbări: la închidere am scos „fără celule” (lecția spune doar „Excel rămâne deschis, gol”) și am pus captura lecției cu fereastra „Save your changes”. La prima salvare am adăugat cum se tastează „_” și „Excel propune locul folosit ultima dată, poate de un coleg”. Id-ul `excel-salvare-ctrl-s` e chiar cel pomenit în SPEC, în exemplul setului de test.

Am completat cu un script termenii lipsă: unde pașii pomenesc celula, fila Pornire, un grup, panglica, bara de formule, caseta de nume, clic dreapta sau registrul, fișa are acum termenul, cu definiția de un rând din lecții (60 de termeni adăugați).

## Gesturi văzute în lecții, fără fișă proprie (și de ce)
1. **VIII/1, pasul real 1: filă nouă în browser (+) și adresa scrisă în bara de adrese + Enter.** E un gest de browser, nu de Excel, deci n-am făcut fișă. Nici `fise_windows_web.json` nu-l are (am verificat id-urile). **De decis de dirijor**: o fișă `windows-…` sau `web-…`, sau rămâne neacoperit.
2. VIII/1, pașii reali 2-3: caseta profesorului și deschiderea lecției L01 din listă. Sunt gesturi ale sitului LearningHub, nu ale unei aplicații.
3. VIII/1, pașii reali 4-7: scrisul în caiet. Nu e gest în aplicație.
4. VIII/2 p2: trecerea pe altă foaie cu clic pe filă. Intră în `excel-trecere-foi` (sursa e VIII/3 p5, mai completă), deci nu e fișă separată.
5. Butoanele de pe telefon: Tab/Enter/Esc/săgețile „de sub foaie” (VIII/2 p5), „Pe telefon scrii în bara de formule” (VIII/2 p5, captura), cercul verde ⇔ (VIII/6 p2), Copy/Paste „din stânga panglicii” (VIII/4 p4), „degetul ținut apăsat” (VIII/3 p5-p6). Sunt doar ale simulatorului, deci nu intră (regula 3). Din legenda capturii `scriere-enter.webp` am scos fraza despre telefon.
6. VIII/2 p2: „cele șase zone ale ferestrei”. E idee fără gest. Zonele apar în fișele lor: zoom, panglica, caseta de nume, bara de formule.
7. VIII/4 p7: Backspace. E în `atentie` la `excel-golire-celule`, nu e fișă separată.
8. VIII/4 p8: clic dreapta pe celulă › „Ștergere… (Delete…)” › „Deplasare celule în sus (Shift cells up)”. Lecția îl arată ca **capcană**, nu ca gest de folosit. E în `atentie` la golire.
9. VIII/5 p5: Golire totală (Clear All) ca gest separat. E pasul 2 din `excel-numar-devenit-data`, singurul context în care o predă lecția.
10. VIII/5, pasul real 2: proba setărilor regionale (7,5 față de 7.5). E în `atentie` la `excel-zecimale-virgula`.
11. VIII/5 p2: „scrii un număr / un text”. Fără gest separat de `excel-scriere-celula` și `excel-tip-date-aliniere`.
12. VIII/6 p2: **Format › Column Width… (Lățime coloană…)**. Lecția spune doar „îți cere un număr”, fără ce scrii și cu ce confirmi, deci n-ar fi executabil literal (regula 4). N-am făcut fișă; dacă lecția primește pașii, se poate adăuga.
13. VIII/6 p6: „valoarea din spate” în bara de formule. E în rezultatul/atenția fișelor de zecimale, procent și Long Date.
14. VIII/7 p2: „fiecare număr în celula lui”. E pasul 1 din `excel-formula-operatori` (idee, nu gest separat).
15. VIII/7 p4: „schimbi un număr, rezultatul se reface singur”. E idee, pusă în `atentie` la `excel-formula-operatori`.
16. VIII/7 p3: × și ÷ pe care „Excel 365 le schimbă singur”. E o observație pentru telefon, nu gest. Nu l-am pus.

## Nesiguranțe (afirmații pe care lecția nu le spune limpede)
- **`excel-aldin`**: lecția spune „B (Bold, aldin) îngroașă literele” în pasul despre grupul Font de pe Pornire (Home), dar nu scrie explicit că B e pe fila Pornire. Am scris „Pe fila Pornire (Home), apasă B”. E de verificat în Excel, sau de lăsat fără locul butonului.
- **`excel-deschidere-fisier-descarcat`**, rezultatul „nu mai e doar pentru citit: poți lucra în el”: dedus din „fișierele descărcate se deschid întâi doar pentru citit” + „Activare editare”. Lecția nu descrie ce se vede după apăsare.
- **`excel-eroare-name`**, pasul 3 („scrie din nou formula în celulă, cu steluța”): VIII/7 spune doar „Schimbi x cu *”, fără cum. Am folosit regula din VIII/2 p5 („Ce scrii înlocuiește tot ce era acolo”), deci e o bucată din altă lecție.
- **`excel-eroare-value` / `excel-eroare-div0`**, pasul 1 („uită-te în bara de formule ce celule folosește formula”): dedus din VIII/7 p3 (bara de formule arată formula când alegi celula) și din capturile pasului. Pasul p6 nu-l spune ca instrucțiune.
- **„folder”** (prima salvare, Salvare ca, deschidere, recuperare): lecția VIII/3 nu-l definește (trimite la „clasa a V-a”). Nu l-am pus în `termeni`, fiindcă n-am o definiție din lecție.
- Termenii au uneori definiția luată din altă lecție a aceleiași unități (de exemplu „bara de formule” din VIII/2, folosită în fișele din VIII/5-7, sau „zonă” din VIII/4 în `excel-imbinare-centrare`). Afirmațiile despre gest sunt toate din lecția-sursă.
- `excel-salvare-ca` și `excel-salvare-alt-format` folosesc aceeași captură (`salvare-ca-nume.webp`, VIII/3 p3), iar `excel-zecimale-format` și `excel-procent` pe `grup-numar.webp` (VIII/6 p6). Sunt capturi reale din pasul-sursă, doar repetate.
