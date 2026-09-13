# 04 — Mediul (U4) · lectia5-tabele

## Ce presupune lecția
- **Program:** Microsoft Word pentru Windows, versiune recentă (file „Table Design” și „Layout”, Quick Tables, Border Painter, semnul „+” de inserare) — nicăieri declarat.
- **Limba interfeței:** exclusiv **engleză**. Pilotul a numărat 104 denumiri de meniu în engleză în această lecție (maximul din M1). Grep propriu (`u_anexa_grep.txt`): „Insert” pe 37 de rânduri, „Layout” pe 33, „Table Design” pe 16; 0 denumiri românești de file.
- **Separatorul:** nu se aplică la Word (nu sunt formule); la conversia text-tabel lecția recomandă „Punct-si-virgula (date europene)” — descriere de uz, nu setare.
- **Sistemul de operare:** Windows (Alt+5 pe tastatura numerică, Ctrl+Alt+V, clic dreapta).

## Ce se știe (text brut Microsoft, descărcat 13.09.2026 cu `surse_descarca.py`, citate în `surse/s01-s07`)
| În lecție (engleză) | În Word în română (Microsoft ro-ro) | Sursa |
|:--|:--|:--|
| tab-ul Layout (al tabelului) | **fila Aspect tabel** (en-us scrie azi „Table Layout”, nu „Layout”) | s04 |
| Table Design | **Proiectare tabel** | s04 |
| grupul Rows & Columns | **Rânduri & Coloane** | s04 |
| Delete Rows / Delete Columns | **Ștergere rânduri / Ștergere coloane** | s04 |
| AutoFit Contents / AutoFit Window | **Potrivire automată la conținut / Potrivire automată fereastră** | s04 |
| Insert > Table > Convert Text to Table | **Inserare > tabel > Conversie text în tabel**; tabel → text: fila **Aspect**, secțiunea **Date**, **Conversie în text** | s04 |
| Table Properties | **Proprietăți tabel** | s04 |
| Borders and Shading | **Borduri și umbrire** (nu „Chenare”) | s04 |
| Distribute Columns / Rows | **Distribuiți coloanele / Distribuire rânduri** (două forme pe aceeași pagină) | s07 |

Atenție: paginile ro-ro sunt amestecate (unele rânduri rămân în engleză: „On the Table Design tab…”) și inconsecvente („Inserați” / „Inserare”). Ce vede elevul pe ecran se află **doar din laborator**.

**Neconfirmate pe text brut Word ro:** „Îmbinare celule” / „Scindare celule” (le-am găsit doar pe pagina Publisher ro-ro, `change_rows_cols_ro-ro.txt`; pagina Word „merge and split” n-are variantă ro — descărcarea ro-ro a întors pagina generală), Quick Tables, Draw Table, Border Painter, Header Row / Banded Rows în română.

## Scurtături verificate
- **Tab în ultima celulă = rând nou:** CONFIRMAT (s03). **Ctrl+Tab = tabulator în celulă:** confirmat. **Alt+5 numeric = tot tabelul:** confirmat (s02). **ALT la tragere = măsuri pe riglă:** confirmat (s05).
- **Ctrl+A în tabel:** lecția spune „primul apăs = celula, al doilea = tot tabelul”. Microsoft Word: „Selectați tot conținutul documentului” (s02). Descrierea „apasă a doua oară” există la **Excel** (s02, pagina Excel en-us). **Greșit în lecție.**
- **Backspace pe selecție:** lecția spune „sterge continutul”. Microsoft: tabel selectat din handle + Backspace = șterge tabelul (s01). **Greșit în lecție pentru tabel selectat**; pentru un singur rând selectat nu am găsit text Microsoft (neclar). Tot pe paginile Microsoft există o inconsecvență: „click Delete Table or press Delete on your keyboard” (s01, ultimul rând) vs „Delete … rows and columns remain” — de observat în laborator.
- **Ctrl+Alt+V = Paste Special:** pe Word Windows azi = „Lipiți formatarea textului selectat” (s06). Greșit, a treia lecție la rând.
- **Ctrl+P = Print Preview:** Ctrl+P deschide Imprimare (cu previzualizare în Word 2010+); aproximare acceptabilă, fără semnalare.

## Comparat cu ce se știe despre laborator
- Brauner, sala 1 (TIC): versiunea Office, limba, Windows — **necunoscute** (B_context_real §3). Office-ul lui Vasile e în engleză (ProPlus 2021) — nu spune nimic despre laborator.
- Office 2016/2019 afișează „Design” și „Layout” (lecția scrie „(sau Design)”); Microsoft 365 afișează „Table Design” / „Table Layout”; în română „Proiectare tabel” / „Aspect tabel”. Lecția acoperă doar varianta engleză, fără nume român la prima folosire.
- Izvoare (VII A, VII B): ipoteza de lucru = fără laborator → mediul e caietul (vezi 06_premortem.md, motivul 5).
