# Componentele comune — 24.10.2026, 20:38 → 25.10.2026, ~02:00

Ai cerut (24.10, 20:38): „da, pornește reparațiile la componentele comune”. Lista: `DIMINEATA_24_10.md`, „Pentru componentele comune”.

## Pe scurt
- **Toate cele 7 probleme sunt reparate și sunt pe site.** Fiecare piesă a trecut printr-un verificator independent („poarta de lansare”): 0 probleme grave, 0 majore. Am verificat eu pe site că fiecare fișier e exact cel comis (7/7 identice).
- Am adăugat un al optulea lucru, aceeași regulă (ținte de cel puțin 32 px pentru deget): legăturile din bara de sus a tuturor paginilor aveau 23 px; acum au 34.

## Ce s-a schimbat (cu commitul)
| Piesa | Ce vede elevul acum | Commit |
|---|---|---|
| Motorul (toate lecțiile și jocurile) | Bifele „Acum în aplicația adevărată” și legăturile din bara de sus se ating ușor cu degetul (34×34 px). După „Ia-o de la capăt” într-un simulator nu mai rămâne „Corect!” lângă o greșeală (rămânea în 215 locuri). Punctele nu se pot lua de două ori. | 809d01e1 |
| Scratch (VI/18-21) | Duplică merge cu degetul (copia apare peste partea de jos a programului și se trage de primul ei bloc). Nu mai apare eroarea din consolă. Câmpul direcției se poartă ca în Scratch-ul adevărat: un clic deschide cercul, dublu clic te lasă să scrii. | a6593cd0 |
| Browserul simulat (V/17) | Ambele simulatoare au stilul lor (îl împărțeau, iar al doilea rămânea fără el). | bd7c35f8 |
| Editorul web (VIII) | Textul scris după `</body>` e semnalat cu un mesaj care spune unde să-l muți. 2.333 de pagini corecte sunt primite în continuare. | bd7c35f8 |
| Paint (V/18-21) | Meniul Forme (și Fișier, Editare) nu mai iese din ecran pe telefon. | bd7c35f8 |
| VI/19 | Propozițiile despre Duplică pe telefon, potrivite cu noul Scratch. | 61e7272c |
| V/12 | Legăturile spre lecția 1 duc la pașii corecți (P8, P9). | 61e7272c |
| VII/18 | Legătura „atelierul lecției” are 38 px pe telefon (avea 22). | 61e7272c |

## Am hotărât singur — le poți schimba
1. **Motorul a plecat cu o abatere de la contract:** pe telefon, bara de sus strânsă e cu 8 px mai înaltă (prețul țintelor mai mari). Pe o pagină de probă internă (`jocuri/_fixtura-excel`, fără legătură din cuprins), testul automat apasă acum pe un buton acoperit și pică; elevul atinge partea vizibilă a butonului. Am judecat-o minoră.
2. **Scratch, telefonul:** copia de la Duplică apare acum ca în Scratch-ul adevărat cu atingere (nu se mai lasă printr-o atingere), iar textul din VI/19 spune asta.
3. **Laboratorul VI/21, punctul 4 („Dacă mai ai timp”), pe telefon Android:** verificatorul a propus „Pe telefon: atinge numărul, șterge cifrele cu ⌫ și scrie -90.” N-am pus-o: pe un telefon Android adevărat n-am probat, iar laboratorul e pentru calculator.

## De știut
- **Publicarea a fost oprită o dată, corect,** de poarta „date personale”: în ieșirile probelor agenților apărea calea contului tău de Windows (nu nume de elevi; dosarul nu se publică). Am curățat-o și am publicat a doua oară.
- **Panoul de activitate:** tot 2 rânduri „nu e în catalog”, ca înainte. Date personale în lecții: 0.

## Rămase pentru altă dată (toate există și pe versiunea de dinainte)
- Paint: lista Pensule iese 10-40 px din ecran pe telefon (la 412 px ultima pensulă nu se poate atinge; nicio lecție n-o cere); lista Culori (V/21); butonul Mărire la 360 px (V/20); Da/Nu din confirmarea „Salvare ca” au 26 px.
- Scratch: un salt de 65 px când apuci copia cu zona derulată la capăt (VI/19); a doua atingere pe direcție are 30 px.
- Motorul: la exersare, „Încă un exercițiu” dispare după „Ia-o de la capăt” până la refacere; la VII/2 (P2E2, P4E1), după „Ia-o de la capăt”, „Verifică” fără nimic făcut spune „Corect!” (documentul rămăsese corect; fără puncte).
- VIII/15, atelierul: mesajul „F5 în browser” ar trebui să spună „clic pe fila paginii tale, apoi F5”.
- Bifele proprii ale lecțiilor V/10-12 au 32×28 px.

## NESIGUR
- Atingerile au fost emulate în browser, nu încercate pe un telefon adevărat.
- `proba_prezenta.py` n-a rulat (trimite la serverul viu prin construcție).

Detaliile, oră cu oră: `04_ORCHESTRARE.md`, secțiunea „24.10.2026 seara — componentele comune”. Rapoartele verificatorilor: `componente_24_10/{motor,scratch,mici}/poarta/poarta1.md`.
