# 03 — Jurnalul sarcinii (U1, U11, U7)

## Constrângerile elevului pe care l-am jucat (U11)
- 13 ani, clasa a VII-a, la a doua lecție de Word. Știe vag din lecția 1 unde e „fila Home”, dar nu știe dacă Word-ul din fața lui e în engleză sau în română.
- Citește încet (ritmul porții: 115 cuvinte/minut), tastează 60 de caractere/minut, nu știe engleză de meniu (Font Color, Format Painter, Clear All Formatting, Paste Special).
- NU deschide „Vezi rezolvarea” cât lucrează.
- Are o singură oră (50 min, din care ~8 pornire); înainte de exerciții trebuie să treacă 10 întrebări-lacăt și ~4.600 de cuvinte.
- Nu are cont, stick sau e-mail; lecția nu cere niciunul.

## Ce am făcut, pas cu pas (dovezi în `03_pasi.json`, `produs_elev/`, `randat_docx/`)
1. **Ex.1** — am scris paragraful exact cum îl dă lecția (fără diacritice: „Astazi”, „viata”) și am pus aldin pe „Calculatorul”, cursiv pe „ENIAC”, subliniat pe „dispozitiv electronic”. Redeschis cu python-docx și verificat în PDF-ul LibreOffice: toate trei aplicate, inclusiv linia de subliniere desenată sub text. Pasul merge.
2. **Ex.2** — propoziția de 3 ori, cu Times New Roman / Arial / Courier New. PDF-ul confirmă cele trei fonturi. Merge.
3. **Ex.3** — patru subtitluri, rând gol între ele, primul Arial 16 aldin albastru, restul „cu Format Painter” (rezultatul: aceeași formatare directă pe toate 4). Toate patru rămân în stilul **Normal**. Contra-proba cu stilul Heading 2, identică la vedere, dă 4 semne de carte în PDF; varianta din lecție dă **0**.
4. Răspunsurile scrise sunt în `u1_raspunsuri_elev.txt`.

## Unde se blochează un începător (IPOTEZE AI — de verificat la oră, nu observate)
- **Nu ajunge la Word.** Lecția îl ține la citit: poarta calculează 40 de minute doar pentru citire, peste cele 8 de pornire.
- **Caută „Font Color”, „Format Painter”, „Clear All Formatting” pe o panglică în română**, unde se numesc „Culoarea fontului”, „Descriptor de formate”, „Anulare formatare” (surse Microsoft ro-ro în `surse/`).
- **Clic simplu pe pensulă** → prima selecție primește formatul, a doua nu. Lecția avertizează doar în rezolvarea ascunsă („Capcana”) și în atomul 8.
- **„Caseta de font”** — elevul nu știe care din cele două casete e fontul și care e mărimea; lecția nu are nicio imagine a panglicii (0 `<img>`).
- **Ex.3, întrebarea „Cat timp ai economisit”** nu se poate răspunde: elevul n-a formatat de mână ca să compare.
- **Dacă încearcă scurtăturile din teorie**: în Microsoft 365, Ctrl+Alt+V nu deschide Paste Special (lipește formatarea), iar Ctrl+= pentru indice nu apare în documentația de azi.
- Nicio stare intermediară de tipul „ridicați mâna când vedeți cuvântul Calculatorul îngroșat”; singurul control e caseta de răspuns de pe site, care nu vede documentul Word.

## Salvare
Lecția nu spune nici să salveze documentul Word, nici unde, nici cu ce nume. Butonul „Salveaza raspunsul” salvează doar textul din caseta de pe site.
