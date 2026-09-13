# 04 — Mediul pe care îl presupune lecția (U4)

## Ce presupune lecția
- **Excel desktop Microsoft 365/2016+, interfață în ENGLEZĂ**, cu traduceri improvizate în paranteză: „tab-ul Insert (Inserare)”, „sectiunea Charts (Grafice)”, „Pie (Circular)”, „Column (Coloana)”, „Bar (Bara orizontala)”. Butonul „+” lângă grafic și fila „Chart Design” (pagina Microsoft „Creați o diagramă” se aplică la Excel 2016-2024 și Microsoft 365; versiunea din laborator e necunoscută).
- **Alternativ Excel Online** — „gratuit cu cont Microsoft” (cere cont).
- **Datele cu punct zecimal** (`7.2`, `6.8`, …) — merg doar pe un Windows cu setare regională engleză.
- Nicio mențiune despre LibreOffice.

## Comparat cu ce se știe (surse brute, 13.09.2026)
| Lecția scrie | Microsoft Support ro-ro (text brut) | Microsoft en-us | Fișier |
|:--|:--|:--|:--|
| Insert (Inserare) → Charts (Grafice) | „Selectați **Inserați** > **diagrame** recomandate”; „Grafice” 0 apariții | „Select Insert > Recommended Charts” | `surse/create_ro.txt`, `create_en.txt` |
| „+” (Chart Elements) | „În colțul din dreapta sus, lângă diagramă, selectați **Adăugare element de diagramă** și alegeți **Etichete de date**” | „Chart Elements” 0 apariții | `surse/etichete_ro.txt`, `etichete_en.txt` |
| Change Chart Type | „**Modificare tip diagramă**” (4) | „Change Chart Type” (4) | `surse/tip_ro.txt`, `tip_en.txt` |
| Select Data | „alegeți "**Selectare date**"” | „Select Data” | `surse/create_ro.txt` |
| Chart Design | „fila **Proiectare diagramă**” | „Chart Design” | `surse/create_ro.txt` |
| Pie (Circular) | „diagramă de **structură radială**” | „pie chart” | `surse/tipuri_ro.txt` |
| 2-D Clustered Column | „**Coloană grupată**” | „Clustered column” | `surse/tipuri_ro.txt` |

Concluzie: numele englezești din lecție există în Excel-ul în engleză (cu excepția „Chart Elements”, care nu apare în documentație ca nume de buton). **Traducerile din paranteză sunt inventate** („Grafice”, „Inserare”, „Circular”) — nu sunt nici ale Excel-ului în română. Ce vede efectiv elevul depinde de limba Office-ului din laborator: **NECUNOSCUTĂ**. Formularea sigură: „fila Insert / Inserați → Charts / Diagrame”.

## Setarea regională și datele
`u4_cultura.txt` (.NET pe acest PC, ro-RO): separator zecimal `,`, separator de listă `;`, dată scurtă `dd.MM.yyyy`. `7.2`, `6.8`, `8.1`, `7.5`, `6.3` în ro-RO: **nu sunt numere, sunt date valide** (07.02, 06.08, 08.01, 07.05, 06.03). În en-US sunt numere. .NET nu e Excel — de aceea am randat ambele deznodăminte posibile ale lipirii pe ro-RO: ca dată (`randat_xlsx/lipire_roRO.pdf`, bare de ~46.000) și ca text (`lipire_text.pdf`, COUNT 0, grafic fără bare). În niciuna graficul nu arată notele. Setarea din laborator e necunoscută → semnalarea e `depinde_de_necunoscut: true`, iar schimbarea propusă acoperă ambele (date scrise fără zecimale sau o notă „pe calculatoarele în română scrie 7,2”).

Randarea LibreOffice pe acest PC (ro-RO) afișează etichetele cu virgulă (`7,2`), deci și rezolvarea Ex. 1 („apar 7.2, 6.8…”) nu se potrivește cu ecranul unui Windows în română.

## Specialistul (analistul de date), în 2026
- **Axa de la 0:** lecția nu spune nicăieri că la bare/coloane axa pornește de la 0; ghidul britanic de statistică publică: „Do not break the numerical axis on bar charts … breaking the numerical axis distorts these relative proportions” (`surse/gss_charts.txt`). La datele lecției (6,3-8,1) o axă pornită de la 6 ar face bara Fizicii (6,3) de 7 ori mai scurtă decât a Englezei (8,1), deși Fizica e doar cu 22 % sub Engleza — exact lucrul pe care un analist îl verifică primul. LibreOffice a pornit axa de la 0 (`montaj_incearca.png`); ce face Excel automat nu am verificat pe sursă (pagina „Change the scale of the vertical axis” spune doar că Excel alege singur minimul — `surse/axa_en.txt`).
- **3D:** lecția îl dă ca „Stil 3D” fără avertizare; același ghid: „Avoid: … 3D shapes” (`surse/gss_charts.txt`).
- **Pie:** regula din atom e corectă și confirmată de Microsoft (părți ale unui întreg, ≤ 7 categorii), dar Încearcă o încalcă (`surse/tipuri_ro.txt`).
