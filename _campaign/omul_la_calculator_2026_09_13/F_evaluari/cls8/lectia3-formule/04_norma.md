# 04 — Norma din afara documentului (U16)

## Diacritice
- Măsurat cu funcția porții (`G_poarta.diacritice_la_1000`) pe `innerText.txt`: **0,0 la 1000 de litere**. Text românesc normal ≈ 40-60 (pilot: 52,3).
- ș/ț cu virgulă: 0; ş/ţ cu sedilă: 0 (numărare pe `innerText.txt`).
- Norma proiectului, `LESSON_SPECIFICATION.md:401`: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; checklist `:751` „Romanian text with proper diacritics (ă, â, î, ș, ț)”. Fără diacritice sunt cerute doar `<title>` și numele fișierului (`:400`).
- Unde doare concret în lecția asta: „Mancare” (Ex. 2, tastat de elev ca etichetă în foaie), „Invatare”, „Impartire”, „Inmultire”, „Scadere” — termenii de matematică pe care elevul îi scrie și la română/matematică; „Pret/elev”.

## Programa (OMEN 3393/2017, `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`, clasa a VIII-a)
- CS.1.1 „Utilizarea foilor de calcul tabelar în vederea rezolvării unor situații problemă simple”.
- Conținuturi, rânduri separate: „**Formule de calcul care utilizează operatori aritmetici (+, -,*, /)**” și „**Funcții specifice aplicaţiei de calcul tabelar pentru sumă, maxim, minim, medie aritmetică şi decizie**”; plus „Structura unui registru de calcul (… adresă de celulă)”.
- Planul 2026-2027 (`Calendar_ore_8A_8M.md` r. 15-16): ora 7 = formule cu operatori (23.10), ora 8 = funcții (06.11). Lecția folosește `SUM` de la primul exercițiu, deci ora 7 predă din ora 8; iar lectia4-functii o va preda „a doua oară”.
- Referințele absolute (`$B$1`, F4) nu sunt un conținut numit în programă; intră sub „adresă de celulă” / „formule de calcul” și sunt necesare pentru rezolvarea de situații-problemă (CS.1.1). Nu e o abatere, dar e încărcare în plus pe o oră.
- Descriptorul „De bază” (O. 4.615/2026): „formule cu operatori aritmetici … în pași ghidați, în contexte familiare” — Încearcă + Ex. 1 corespund exact; Ex. 2 (referințe absolute) și Ex. 3 țin de „Consolidat”.

## Ca specialist (contabilul care trăiește în Excel, 2026)
- **Cota TVA 19% e depășită** din 01.08.2025: Legea 141/2025, art. 291 alin. (1) Cod fiscal: „nivelul acesteia este 21%” (`surse/tva_L141_2025.txt`, PDF ANAF, text extras). Paradoxal, paragraful „Deschidere” al lecției spune corect principiul (o singură celulă pentru cotă) chiar cu exemplul 19% → 21%.
- Principiul „rata fixă într-o singură celulă, referită cu $” e exact practica de meserie — lecția îl predă bine.
- Media calculată ca `=E2/3` e acceptabilă aici (lecția spune singură că `AVERAGE` vine la lecția următoare).
- Formatul mediilor: în catalog, contabilul pune 2 zecimale pe toată coloana; tabelul final al lecției afișează „9.00 / 7 / 9.67” — un format amestecat pe care Excel nu îl produce cu un singur format de coloană (verificat: `0.00` dă `9,00 / 7,00 / 9,67`, General dă `9 / 7 / 9,666667`).
