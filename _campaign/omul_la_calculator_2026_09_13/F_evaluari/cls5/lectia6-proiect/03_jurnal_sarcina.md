# 03 — Jurnalul sarcinii: am făcut posterul ca un elev de a V-a (U1, U11)

## Constrângerile elevului jucat (U11)
- 11 ani, citește încet (ritm porții: 90 de cuvinte/minut, 40 de caractere tastate/minut, 20 s pe clic).
- **Nu știe:** PowerPoint (nu e în planul clasei a V-a), Paint (ora 18, 29.01.2027), Canva (cere cont + invitație de la profesor + acordul părinților sub 13 ani). Nu știe ce e o casetă de text, cum se mută un obiect, cum se exportă PDF, unde se salvează.
- **Nu vede:** rezolvarea „Model de continut” e pliată; exemplul de poster din atomul 1 apare ca listă verticală (clasele `poster-*` nu au CSS — `u5_iesire.json` A3/B), deci nu vede niciodată cum arată un poster.
- **Timp:** ora de 50 de minute, din care 8 pornire; lecția îi cere 5 min provocare + 4 atomi cu 6 întrebări + 120 de minute de faze.
- Tastatură fără diacritice configurate (necunoscut) — oricum lecția nu are diacritice de copiat.

## Ce am făcut, pas cu pas
1. **Provocarea (5 min):** „Deschide PowerPoint sau Paint”. Primul blocaj: *care* dintre ele e pe PC, și cum se deschide. Am ales PowerPoint, pentru că indiciile lecției sunt scrise pentru PowerPoint („Insert → Shapes”).
2. **Titlul:** o casetă de text, 40 pt, portocaliu. 6 clicuri, 17 caractere. Un începător nu știe că trebuie întâi „Inserare → Casetă text”; lecția nu spune.
3. **Formele în loc de imagini** (indiciul 3): 9 forme. În Office în română fila e „Inserare” (Microsoft ro-ro), nu „Insert”.
4. **Cele 4 secțiuni:** „Imparte pagina in 4 sectiuni” — nu spune cum. Am pus 4 coloane.
5. **8 componente:** am copiat din „Model de continut”. Blocaj real: modelul dă „Procesor (CPU) - proceseaza toate datele” fără tip, tabelul din atomul 2 dă Tip = „Procesor”, iar „Sfat PRO” vrea „Mov pentru componente interne”. Copilul scrie „Procesor - Procesor”.
6. **Input/Output, Hard/Soft, 5+5 reguli:** textele intră pe un diapozitiv 16:9 doar cu **11-12 pt**. „Asigura-te ca textul e lizibil de la distanta” și „10 reguli + 8 componente + 20 de exemple” se bat cap în cap pe o singură pagină.
7. **Săgeata** (bonusul provocării): încă o formă + text.
8. **PDF:** exportul a mers (LibreOffice). Cu Paint, PDF nu apare în formatele listate de Microsoft. Lecția nu spune unde salvez și cum predau.
9. **Exercițiul 2** l-am scris în căsuța paginii; „Salveaza raspunsul” ține doar în browserul acestui PC.
10. **Exercițiul 3** — nu am ajuns; „culori futuriste” cer culori personalizate (ora 21).

Total produs: 20 de casete de text, 9 forme, ~995 de caractere pe poster + ~400 la Exercițiul 2, ~180 de clicuri estimate (`u1_poster_iesire.json`). Timpul îl calculează poarta.

## Notarea (profesorul)
Am aplicat „Checklist Final” pe posterul meu (`u1_notare.py`): 7 bife se decid, 3 cer judecată fără descriptor („Titlu clar si vizibil”, „Toate informatiile sunt corecte”, „Layout frumos”). Nicio bifă nu are puncte și nu există conversie în notă sau nivel. Ca să verifici „toate informațiile corecte” citești ~45 de fapte pe poster. Cu ipotezele scrise în `u1_notare_iesire.json`: ~3,5 min/poster → **86 min pentru 25, 104 min pentru 30**. Calcul, nu cronometrare.

## Unde se blochează probabil (ipoteze AI, de verificat la oră)
1. „Ce program deschid și cum?” — la minutul 1, toată clasa.
2. „Cum pun text / cum mut dreptunghiul?” — nepredat.
3. „Nu încape tot pe pagină” / textul devine mic.
4. „Unde îl salvez? Cum vi-l dau?”
5. „Procesorul e Input sau Output?” — lecția îi dă tipul „Procesor”.
Nicio „ridicați mâna când vedeți…”: lecția nu are puncte de verificare pentru profesor, doar liste de bifat pentru elev.
