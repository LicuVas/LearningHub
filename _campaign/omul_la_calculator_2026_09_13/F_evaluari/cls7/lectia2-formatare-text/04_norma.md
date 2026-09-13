# 04 — Norma din afara lecției (U16 + specialistul)

## Limba română scrisă
- **Diacritice la 1000 de litere: 0,0** (calculat din `innerText.txt`, fără textul din `[ASCUNS]`). Text românesc normal ≈ 40-60. Nicio ș/ț cu sedilă — pentru că nu există deloc diacritice.
- `LESSON_SPECIFICATION.md:401`: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; `:751`: „- [ ] Romanian text with proper diacritics (ă, â, î, ș, ț)”. Lecția încalcă ambele.
- **Textul pe care îl TASTEAZĂ elevul e fără diacritice** (Ex.1: „proceseaza”, „Astazi”, „viata”; Ex.2: „usor”). La o lecție de tehnoredactare, elevul copiază în Word un text românesc greșit — produsul lui iese greșit la fond, nu doar lecția.
- **Ghilimele:** 24 de ghilimele drepte `"`, 0 ghilimele românești „ ”. Ex.1 cere scrierea unui citat între ghilimele drepte.

## Programa (OMEN 3393/2017, din `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`, clasa a VII-a)
- CS.1.1 „Editarea/tehnoredactarea de documente utilizând aplicații specializate”; activitate: „formatarea unui document utilizând instrumente dedicate”.
- Conținuturi: „Operaţii de formatare a unui document: text, imagine, tabel, pagină”; „Reguli generale de tehnoredactare şi estetică a paginii tipărite”.
- Lecția acoperă formatarea textului (caracter). Nu acoperă paragraful, deși ora 6 din plan e „Formatarea textului și a paragrafului”.

## Specialistul (tehnoredactor cu 20 de ani de Word): se predă ceva cum nu se mai lucrează în 2026?
1. **Subtitluri formatate de mână + Format Painter pentru consecvență** (atomul 8, atomul 10 „Consistenta”, Ex.3, Provocarea). Un profesionist face asta cu **stiluri**: modifici o dată stilul de titlu și toate titlurile se schimbă. Microsoft ro-ro, text brut (`surse/raw/ms_ro_styles.txt`): „Puteți utiliza stiluri pentru a aplica rapid un set de opțiuni de formatare în mod consistent, în tot documentul.”; en-us: „All text with the style that you changed will automatically change to match the new style that you defined.” Probat pe fișier: varianta din lecție are 0 titluri recunoscute de Word (PDF: 0 semne de carte), varianta cu stil — 4 (`04_a_doua_cale.json`). Format Painter e util, dar prezentat ca soluția pentru „toate titlurile de sectiuni sa arate la fel” într-un document de 10 pagini, învață forma greșită.
2. **„Lasa un rand gol intre ele”** (Ex.3) — spațiere cu Enter gol, exact ce corectează un tehnoredactor (spațiu înainte/după paragraf).
3. **Cuvântul „stil” folosit pentru aldin/cursiv/subliniat** („Cele trei stiluri fundamentale”, „aplica stilul Italic”) — în Word „Stil” e altceva (galeria Stiluri de pe fila Pornire). Elevul care aude „stil” la lecția 1 (Titlu 1/Heading 1) și „stil” la lecția 2 (aldin) nu mai deosebește formatarea de stil.
4. **Emboss/Engrave din fereastra Font** — dispărute din 2010 (`surse/p_efecte_font.txt`).
5. **Ctrl+Alt+V = Paste Special** și **Calibri 11 = implicit** — adevărate doar până la Office 2021 (`surse/p_ctrl_alt_v.txt`, `surse/p_font_implicit.txt`).
6. **Culori:** „Text Highlight Color ... limitate la culori puternice: galben, verde, turcoaz, roz” — paleta nu am putut-o confirma pe text brut; nesemnalat.
