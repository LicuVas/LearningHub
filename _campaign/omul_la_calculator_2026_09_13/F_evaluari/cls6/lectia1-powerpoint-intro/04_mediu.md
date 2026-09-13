# 04 — Ce mediu presupune lecția (U4)

## Ce presupune lecția
- **Program:** Microsoft PowerPoint (numit explicit peste tot; „Deschide PowerPoint (cauta in Start Menu → Microsoft PowerPoint)”). Nicio mențiune de LibreOffice Impress sau Google Slides în atomi; LibreOffice apare doar o dată, în „Vrei mai mult”, ca program care deschide .pptx.
- **Sistem:** Windows (meniul Start, tasta Windows).
- **Limba interfeței:** **engleză** — măsurat în HTML (`u3_iesire.json`): „Home” ×11, „Insert” ×11, „Design” ×15, „Slide Sorter” ×17, „Slide Show” ×16, „New Slide” ×4; nume românești de comenzi: „Pornire” 0, „Proiectare” 0, „Diapozitiv nou” 0, „Sortare diapozitive” 0, „Expunere” 0.
- **Versiune:** nedeclarată; unele pași sunt de Office 2010-2019 (galeria „Background Styles”, „Create PDF/XPS Document”), altele de Microsoft 365 (AutoSave, OneDrive).
- **Internet / fișiere:** Ex.1 cere 3 imagini („Insert → Pictures”), iar rezolvarea spune „This Device” — adică imagini deja pe PC. Nu se spune de unde.

## Ce se știe despre laborator (B_context_real.md §3)
- Brauner, sala „1 (TIC)”: există laborator; sistem, Office, limbă, internet — **necunoscute**. 6A e în sala 1 TIC; 6M e în sala 4 — laborator sau clasă obișnuită, **deschis**.
- Izvoare (VI, marți 9:00): ipoteza de lucru — **fără laborator**.
- Office-ul de pe PC-ul lui Vasile e în engleză — nu spune nimic despre laborator.

## Numele românești verificate (Microsoft Support, text BRUT descărcat cu curl, 13.09.2026)
| Lecția (en) | Microsoft ro-ro | Fișier-dovadă |
|:--|:--|:--|
| Home / Insert / Design | fila **Pornire** / fila **Inserare** / fila **Proiectare** | `surse/s_file_panglica.txt`, `surse/s_tema_imagini.txt` |
| Transitions / Animations / Slide Show | fila **Tranziții** / fila **Animații** / fila **Expunere diapozitive** | `surse/s_file_panglica.txt` |
| New Slide / Duplicate Slide / Delete Slide | **Diapozitiv nou** / **Dublare diapozitiv** / **Ștergere diapozitiv** | `surse/s_diapozitive.txt` |
| Slide Sorter / Reading View / Normal | vizualizarea **Sortare diapozitive** / vizualizarea **citire** / **Normală** | `surse/s_vizualizari.txt` |
| Insert → Pictures | **Inserare → Imagini** | `surse/s_tema_imagini.txt` |
| File → Export → Create PDF/XPS Document | Fișier → **Export** → „Salvare cu tipul” **PDF (*.pdf)** (secțiunea PowerPoint) | `surse/s_pdf.txt` |
| Blank Presentation, Variants | **NEGĂSIT** în paginile descărcate — neverificat | `surse/cautari.txt` |

Atenție de metodă: rezumatul WebFetch pentru pagina PDF a pus „Creare document PDF/XPS” și la PowerPoint; textul brut arată că fraza e doar la Project și Visio. De aceea toate citatele de mai sus sunt copiate din `surse/raw/*.txt` de `surse/citate.py`.

Scurtăturile Ctrl+M, F5, Esc, Ctrl+S sunt aceleași în ambele limbi (sursa ro-ro le confirmă) — partea de tastatură a lecției **merge și pe un PowerPoint în română**.

## Ce trebuie diferit
Pentru că limba din laborator e necunoscută: **ambele nume la prima apariție** — „fila Pornire (Home)”, „Diapozitiv nou (New Slide)”, „vizualizarea Sortare diapozitive (Slide Sorter)”, „Expunere diapozitive (Slide Show)”. Dacă laboratorul are LibreOffice Impress, lecția nu se poate urma pas cu pas (alte meniuri) — de întrebat.
