# 06 — Pre-mortem (schiță, pasul 1; completată la pasul 5)

„Ora din 13.10 (VII A) / 16.10 (7 MA) a eșuat. De ce?”

1. **Nu s-a ajuns la Word.** 4.594 de cuvinte și 10 întrebări-lacăt înainte de primul exercițiu.
2. **Elevul a căutat butoane care nu există cu acel nume.** Lecția spune Home, Font Color, Clear All Formatting, Format Painter, Paste Special; un Word în română le numește altfel.
3. **Scurtătura din lecție a făcut altceva.** Ctrl+Alt+V / Ctrl+= pot diferi între versiunile Word.
4. **La Izvoare nu există calculatoare** — lecția e integral „deschide Word”.
5. **Elevul a formatat subtitlurile „de mână” și a învățat că așa se face**, deși un tehnoredactor folosește stiluri de titlu.

(Verificările și explicațiile alternative: mai jos, la pasul 5.)

---

## Completat la pasul 5 — fiecare motiv cu verificarea făcută (U14)

| # | Motivul | Verificarea făcută | Rezultat |
|--:|:--|:--|:--|
| 1 | Nu s-a ajuns la Word | `G_poarta.py` pe `03_pasi.json` + `masuri.json` (4.594 cuvinte, 10 atomi) → `u12_sensibilitate.txt` | pornire 8 + citire 39,9 + sarcina 30,5 = **78,4 min**; la ritm dublu 43,2 → încape doar dacă elevii citesc de două ori mai repede decât ritmul provizoriu. CONFIRMAT ca risc `important` |
| 2 | Butoane cu alt nume | pagini Microsoft ro-ro descărcate (`surse/`) | Pornire, Culoarea fontului, Culoare evidențiere text, Descriptor de formate, Anulare formatare, Păstrare doar text — lecția nu dă niciunul. CONFIRMAT; cât contează = limba din laborator, nu se poate afla fără sală |
| 3 | Scurtătura face altceva | pagina de scurtături Microsoft + blogul Insider 25.08.2024 (`surse/p_ctrl_alt_v.txt`), `surse/p_indice_exponent.txt` | Ctrl+Alt+V schimbat în Microsoft 365/2024; Ctrl+= absent din documentația de azi. CONFIRMAT pe documentație; efectul pe PC-ul din laborator nu se poate afla fără sală, pentru că depinde de versiune |
| 4 | Izvoare fără calculatoare | Grep `<img` în HTML → 0; toate cele 3 exerciții încep cu „Deschide Microsoft Word”/„Scrie ... in Word” | fără PC lecția nu se poate ține cum e; pe hârtie s-ar putea doar partea de „ce e formatarea” și chestionarele. Existența PC-ului la Izvoare: nu se poate afla fără sală, pentru că vaultul lasă întrebarea deschisă |
| 5 | Titluri făcute de mână | `u1_construieste.py` + PDF: manual 0 semne de carte, stil 4 (`04_a_doua_cale.json`) | CONFIRMAT: Ex.3 produce titluri pe care Word nu le recunoaște ca titluri |

## Explicații alternative pentru semnalările grave (U13)

**A. „Ctrl+Alt+V din lecție e greșit”**
- Alternativa 1: lecția a fost scrisă pentru Office 2016-2021, unde e corect, iar laboratorul are exact asta.
- Alternativa 2: documentația Microsoft e în urmă sau descrie doar Insider.
- Observația care le deosebește, făcută: pagina de scurtături declară „Applies To ... Word 2024 ... Word 2021 ... Word 2016” și dă Ctrl+Alt+V = „Paste the selected text formatting”; office-watch (2026): „There’s no change to Office 2021 and earlier versions.”; Q&A Microsoft: „Beginning this summer 2024, the shortcut no longer works.” → schimbarea e reală și livrată (nu Insider), iar alternativa 1 rămâne posibilă → semnalarea e `important`, `depinde_de_necunoscut: true`, cu formularea pe ambele variante.

**B. „Subtitlurile de mână învață forma greșită”**
- Alternativa 1: e intenționat — stilurile vin mai târziu, lecția 2 predă doar formatarea de caracter.
- Alternativa 2: lecția 1 a predat deja stilurile de titlu, deci elevul le știe.
- Observația făcută: `F_evaluari/cls7/JURNAL.md` (lecția 1): „Ex.3 cere corect stilurile Heading 1/2” — deci stilurile SUNT predate înainte; lecția 2 nu le amintește deloc (Grep „Heading”/„Styles” în innerText = 0) și în atomul 10 prezintă Format Painter ca metoda pentru „toate titlurile de sectiuni” dintr-un document de 10 pagini. Alternativa 1 cade (nu e o amânare, e o contrazicere a lecției 1); alternativa 2 face problema mai gravă, nu mai mică.

**C. „Timpul nu încape”**
- Alternativa 1: profesorul nu pune elevii să citească tot — explică el în 10 minute și trece la exerciții.
- Alternativa 2: ritmurile porții sunt prea lente pentru clasa a VII-a.
- Observația făcută: poarta la ritm dublu = 43,2 min (încape la limită). Blochează lecția exercițiile? În `innerText.txt` atomii 2-10 sunt marcați `[ASCUNS: pas neajuns inca]`, dar blocul „Exercitii practice” (r. 813-959) NU e marcat ascuns → elevul poate derula la exerciții fără să treacă prin cei 10 atomi; dacă profesorul predă frontal, citirea se scurtează. Alternativa 1 e plauzibilă și depinde de cum ține Vasile ora → `important`, nu `blocant`.

**D. „Fără diacritice”**
- Alternativa: e o decizie tehnică (fonturi/codificare) și nu o scăpare.
- Observația făcută: pagina e `lang="ro"` (`masuri.json`), `<meta charset="utf-8"/>` (HTML r. 4), iar spec-ul le cere explicit (r. 401, 751); Grep pe HTML găsește totuși 1 rând cu diacritice (codificarea le suportă) → nu există o limitare tehnică; e o abatere de la normă.
