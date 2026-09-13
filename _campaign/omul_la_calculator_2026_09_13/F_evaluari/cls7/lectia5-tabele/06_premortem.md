# 06 — Pre-mortem (U14) + explicații alternative (U13) · lectia5-tabele

## Schița (scrisă imediat după pasul 1, înainte de a parcurge lecția)
„Ora de tabele a eșuat în laborator. De ce?”
1. **Timpul:** 8.447 de cuvinte și 11 atomi (dublu față de lecțiile 1-4 ca volum) + cel puțin 2 exerciții în Word — nu încape nici pe jumătate în 50 de minute.
2. **Butoanele în engleză:** Insert › Table, Table Design, Layout, Merge Cells, AutoFit — pe un Word în română elevul nu le găsește (pilotul a numărat 104 denumiri englezești în această lecție).
3. **O afirmație despre taste e greșită** (Tab în ultima celulă, Backspace/Delete pe rând selectat, Ctrl+A în tabel) și elevul face altceva decât scrie lecția.
4. **Lecția predă două ore într-una și lasă imaginile pe dinafară:** ora 4 (obiecte) și ora 7 (formatarea tabelului și paginii) sunt amestecate; formatarea paginii e în atomul 11, imaginile lipsesc.
5. **La Izvoare (fără laborator):** tabelele se pot desena pe caiet, dar Table Styles, AutoFit, Convert Text to Table nu au sens fără program; 0 imagini în lecție.

## Completarea (pasul 5): fiecare motiv cu verificarea făcută
| # | Motiv | Verificarea | Rezultat |
|--:|:--|:--|:--|
| 1 | Timpul | `u12_sensibilitate.py` cu formulele porții | **CONFIRMAT, blocant:** 147,5 min; **77,7 la ritm dublu**. Doar citirea atomilor = 57,2; doar exercițiile în Word = 69,4. Varianta „atomii 1-5 + Ex.1” = 49,2 (28,6 la ritm dublu) → încape. |
| 2 | Engleza | grep + Microsoft ro-ro text brut (`04_mediu.md`, `surse/s04`) | **CONFIRMAT:** 0 nume românești de file; „Aspect tabel”, „Proiectare tabel”, „Borduri și umbrire” confirmate pe ro-ro. Limba din laborator rămâne necunoscută → `depinde_de_necunoscut`. |
| 3 | Taste greșite | text brut Microsoft (`surse/s01`, `s02`, `s03`, `s06`) | **Parțial confirmat:** Tab în ultima celulă = CORECT; Delete = doar conținut = CORECT; **Ctrl+A „celulă, apoi tabel” = GREȘIT** (Word: tot documentul); **Backspace „șterge conținutul” = GREȘIT** pentru tabel selectat (Word: șterge tabelul); Ctrl+Alt+V = Paste Special = GREȘIT (a treia lecție). |
| 4 | Două ore într-una, fără imagini | calendarele orelor (`01_citit_inapoi.md`), grep `<img` | **CONFIRMAT:** atomii 1-5 = ora 4 (29.09 / 02.10), atomii 6-11 = ora 7 (20.10 / 23.10); „imagini” din ambele ore lipsesc (0 atomi, 0 `<img>`). |
| 5 | Izvoare fără laborator | grep `<table`/`<img` în HTML (`u3_iesire.json`); randările mele (`randat_docx/`) | **Nu se poate verifica fără sală**, pentru că nu se știe dacă la Izvoare există măcar un calculator cu proiector. Partea verificabilă: lecția nu are niciun tabel desenat (0 `<table>`, 0 `<img>`) — pe caiet elevul nu are model; randările `Orar_Scolar_p1.png` și `Formular_Inscriere_p1.png` pot deveni fișa tipărită. |

**Motiv nou apărut la execuție (6):** provocarea pentru elevii buni strică tabelul (Merge pe rândul cu date) — verificat în docx și în PDF (`04_a_doua_cale.json` rândul 1).

## U13 — explicații alternative pentru semnalările grave
**A. Ctrl+A „celulă, apoi tot tabelul” (cls7-l5-02).**
- Alternativa 1: Word chiar face asta într-o versiune nouă și documentația e în urmă. Observația care deosebește: pagina de scurtături Word e actualizată (conține Ctrl+Shift+V „Paste text only” și Ctrl+Alt+V „Paste formatting” din 2024) și are o secțiune dedicată „Select table content” care dă Alt+5 pentru tot tabelul, nu Ctrl+A (`surse/s02`). Făcută → documentația curentă nu confirmă.
- Alternativa 2: lecția a preluat comportamentul din Excel. Observația: pagina Excel descrie exact „Press a second time…” la Ctrl+A (`surse/s02`, ultimul rând). Făcută → cea mai probabilă sursă a confuziei.
- Alternativa 3: lecția e doar inconsecventă. Observația: chestionarul 4 din aceeași lecție folosește „Ctrl+A pentru tot documentul” ca distractor (innerText r.444). Făcută → lecția se contrazice singură.
- Ce rămâne neverificat: comportamentul pe Word-ul din laborator (nu pornesc Word).

**B. Backspace „șterge doar conținutul” (cls7-l5-03).**
- Alternativa 1: lecția vorbește de rând/coloană, iar Microsoft de tot tabelul — deci ambele pot fi adevărate. Observația: rezumatul lecției generalizează „Delete sterge continut, nu structura - Tasta Delete (sau Backspace cu selectie)” fără excepție, iar atomul 4 tocmai l-a învățat pe elev să selecteze tot tabelul din pătrățel. Făcută (r.1318) → elevul care aplică regula pe tabelul selectat îl șterge.
- Alternativa 2: nici Microsoft nu e consecvent („Delete Table or press Delete on your keyboard”, `surse/s01` ultimul rând). Observația care deosebește: doar Word în laborator. Nefăcută → de aceea `important`, nu `blocant`.

**C. Timpul (cls7-l5-01).**
- Alternativa: ritmurile porții sunt provizorii și profesorul nu cere citirea integrală. Observația: chiar la ritm dublu tot = 77,7 min; doar citirea atomilor = 57,2 la ritm normal; varianta tăiată încape. Făcută → concluzia nu depinde de ritm.

**D. Provocarea strică tabelul (cls7-l5-04).**
- Alternativa: autorul a presupus că primul rând e antet („Nume, Nota, Absente”). Observația: enunțul cere „5 randuri de text, fiecare cu 3 valori despre elevi” — antetul nu e unul dintre ele; chiar dacă elevul scrie antetul ca rând 1, Merge pune titlul peste antet și antetul se pierde. Făcută (în ambele lecturi rezultatul pierde un rând de sens) → schimbarea propusă: „inserează un rând deasupra”.
