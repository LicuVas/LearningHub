# Raport — „Text si Imagini in Prezentari” (TIC, clasa a VI-a)

Ora din plan (cel mai probabil): **ora 6 — „Formatarea textului, a obiectelor și a diapozitivelor”**, marți 13.10.2026 (VI Izvoare) și vineri 16.10.2026 (6A/6M Brauner).
Semnalări: 25 (1 blocant, 11 importante, 13 minore). Detaliile și dovezile: `semnalari.json`; ce am citit, element cu element: `harta_acoperirii.md`.

## Ce schimbă ora de mâine (7)

1. **S01 (blocant) — Întrebările „Verifică dacă ai înțeles” sunt la alt pas decât materia lor.** Am răspuns ca un copil după atomul 1: e întrebat despre SmartArt, predat abia în atomul 7, și primește „❌ Incorect”. Situația se repetă la 8 din 10 atomi (dovada: atributele `data-quiz` din HTML și testul Playwright). → Întrebările trebuie mutate fiecare la atomul ei. Până atunci, profesorul sare peste ele sau le pune la final.
2. **S02 — Lecția nu încape în 50 de minute.** Doar atomii au 4.114 cuvinte, adică 32–41 de minute de citit la ritmul unui copil de clasa a VI-a. Abia după aceea vin provocarea de început (2 imagini) și Exercițiul 1, cu 5 slide-uri și cel puțin 7 imagini. → Atomii 1–5 se fac la clasă, iar atomii 6–10 și restul exercițiului rămân temă sau trec la ora următoare.
3. **S05 — Rezolvarea-model încalcă propria regulă.** Am construit prezentarea exact după „Vezi rezolvarea”: slide-urile 3, 4 și 5 nu au nicio imagine, deși regula obligatorie cere „Minim 1 imagine per slide”.
4. **S07 — Lucrul elevului nu are un loc sigur.** Ce salvează elevul A în caseta de răspuns apare la elevul B care deschide lecția pe același calculator (verificat în browser cu profil păstrat). Pe deasupra, lecția nu spune unde și cu ce nume se salvează fișierul PowerPoint, deși 6A și 6M folosesc același laborator.
5. **S06 — Slide-ul „Familie” cere numele reale ale membrilor familiei.** Pe un calculator comun, nota de siguranță a lecției oprește doar emailul, telefonul și adresa. → Tema slide-ului se schimbă, de exemplu „Locul meu preferat”.
6. **S04 + S12 — Formele sunt trecute la „extindere”, deși standardul De bază le cere pe nume** („casete text, forme predefinite”, Proiectul unității VI-U1). Pe deasupra, Exercițiul 1 „de nivel minim” le cere, alături de 5 slide-uri și fundal în degrade (gradient), lucrate independent. → Nivelul minim devine 2 slide-uri ghidate.
7. **S08 + S09 — Sala.** La Izvoare, fără laborator, lecția nu are nicio variantă pe hârtie. La Brauner, lecția presupune PowerPoint în engleză și Microsoft 365: scrie „Home”, „Design”, „Stock Images”, pe când în PowerPoint în română filele se numesc Pornire, Inserare și Proiectare (după pagina Microsoft ro-ro). → Fiecare cale se scrie în ambele limbi, iar profesorul verifică versiunea înainte de 13/16.10.

## Alte probleme importante

- **S03 — Lecția amestecă mai multe ore din plan.** Pe lângă ora 6, conține ora 5 (inserarea imaginilor), ora 8 (regulile de estetică din atomul 10) și SmartArt/WordArt, care sunt peste programă. Profesorul trebuie să spună clar ce e din ora de azi.
- **S10 — Exercițiul 3 dă „nota maximă 10” pentru efecte în plus.** Asta contrazice `SISTEM_EVALUARE.md`, după care nivelul Avansat înseamnă context nou, nu mai multe funcții. Evaluarea care nu respectă standardele e abatere.
- **S11 — Textul e scris fără diacritice:** 4 caractere cu diacritice în 5.379 de cuvinte („si” apare de 74 de ori, „in” de 59, „sa” de 47).

## Minore (grupate)

- **Mesaje și mecanica paginii:** mesajul de blocare „Raspunde corect...” e fals, pentru că pasul următor se deschide și după răspunsuri greșite (M01, verificat). Caseta de răspuns marchează exercițiul „complet” de la 10 caractere (M13).
- **Contradicții interne:** proporțiile imaginii se păstrează „de la 2013” într-un loc și „de la 365/2021” în altul (M02). Exercițiul cere imagini mici lângă fiecare hobby, iar atomul 10 dă imaginile mici ca exemplu de slide prost (M07). Recapitularea trece SmartArt și WordArt ca învățate, deși sunt opționale (M08).
- **Formulări și fapte:** Ctrl+Shift+] apare ca „Bring to Front”, dar pagina Microsoft îl descrie diferit în două tabele (M03). Un buton e numit „shortcut” (M04). Fontul Helvetica nu vine cu Windows (M05). Recomandări exagerate despre imagini: 1920x1080, Stock Images „sigure” (M06). „Enter” pentru a ieși din decupare (M10). „Fundal:” în loc de „Sfat:” (M12).
- **Norme:** lecția citează doar programa OMEN 3393/2017, fără O. 4.615/2026 (M09). Copiii sunt trimiși la căutări libere pe SlideShare, Pinterest și Google Images (M11).
- **Plan (nu lecția):** în `Calendar_ore_6A_6M.md`, rândul din 11.09.2026 (ora 1) apare de două ori.

## Ce n-am putut verifica și de ce

- **Pașii din interfața PowerPoint** (decuparea cu Enter, Crop to Shape, Remove Background, meniul de clic dreapta Add Text, Convert to SmartArt): pe calculator nu am PowerPoint, iar python-pptx construiește doar fișierul, fără să ruleze interfața. Le-am verificat doar citind textul.
- **Ce exact include Stock Images/Icons în fiecare versiune** și de la ce versiune se păstrează singure proporțiile: n-am luat o sursă primară cu text brut (paginile de suport cu ID sigur nu erau la îndemână). De aceea S09 rămâne „important”, cu soluție pentru ambele variante.
- **Dotarea reală de la Brauner** (versiune Office, limbă) și **existența laboratorului la Izvoare**: necunoscute, am lucrat pe ipotezele date.
- **Ora exactă din plan:** lecțiile de pe site (6) nu sunt legate explicit de orele din plan (9). Potrivirea cu ora 6 e dedusă din faptul că lecția 4 (animații) corespunde orei 7.
- **Condițiile de vârstă ale platformelor** (Pinterest, SlideShare) nu le-am verificat pe sursă.

Fișiere de test: `test/t1_pptx.py` (Exercițiul 1 după rezolvare, slide-ul bun și varianta greșită; randat în `randat_pptx/`), `test/t2_pagina.py` (răspuns greșit, salvare pe calculator comun, diacritice, cuvinte), `surse/shortcuts_*.txt` (text brut Microsoft en-us și ro-ro).
