# 04 — Norma (U16 + programa + regulament) — cls8 / lectia6-proiect

## Diacritice (U16)
- Măsurat de poartă pe `innerText.txt`: **0,0 la 1000 de litere** (text românesc normal ≈ 40-60). Nicio literă ă/â/î/ș/ț în toată lecția.
- `LESSON_SPECIFICATION.md:401`: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; checklist `:751` „Romanian text with proper diacritics (ă, â, î, ș, ț)”. Titlul fără diacritice e permis (`:400`), corpul nu.
- Consecință specifică proiectului: elevul copiază „CATALOG CLASA a VIII-a B”, „Nota minima”, „Media pe materie” în documentul lui „profesional, gata de printat” — fără diacritice; lecția care cere „document oficial pe care l-ai putea afisa la avizier” îi dă un model de text scris greșit.

## Programa (OMEN 3393/2017, anexa 2, `curriculum.json`, clasa VIII — `u4_programa_iesire.txt`)
Conținuturile „Calcul tabelar”: interfață; structura registrului; operații cu registrul/foile; editare; formatarea rândurilor/coloanelor; formatarea celulelor (aliniere, borduri, culori de umplere, stiluri predefinite); tipuri de date; sortare; formule cu operatori; „Funcții specifice aplicaţiei de calcul tabelar pentru sumă, maxim, minim, medie aritmetică şi decizie”; „Grafice: tipuri de grafice”; „Serii de date”.
- **În programă și în lecție:** AVERAGE/MIN/MAX/SUM/IF, borduri, culori, graficul. Activitatea de învățare din programă chiar dă exemplul: „graficul mediilor elevilor din clasă” — alegerea temei e bună.
- **În lecție, dar NU în programă:** Page Layout / orientare / margini / antet de pagină (tot atomul 5 și pasul 6), COUNTIF (bonus, cu promisiunea „o vei invata complet in semestrul urmator” — semestrul următor, în plan, e Pagini web: `Calendar_ore_8A_8M.md`, orele 14-22), Conditional Formatting (provocare).
- **În programă, dar NU în proiect:** sortarea (ora 10, predată înainte de proiect în planul școlii; pe site lecția 7 vine *după* proiect).

## Planul anului 2026-2027
Ora 12 „Mini-proiect: produs informatic cu tabel, formule și grafic”: Brauner 8A/8M **04.12.2026**; Izvoare VIII — **comasată** (01.12 liber). Materiale prevăzute: `fisa_proiect, grila_proiect` — lecția nu are grilă.
`SISTEM_EVALUARE.md`: mini-proiectul „DA — o notă, pe grilă anunțată dinainte”.

## Regulamentul (ROFUIP 2024, OME 5.726/2024 — text descărcat din legislatie.just.ro, `surse/rofuip_2024_*.txt`)
- Art. 115 (1): „Sunt declarați promovați elevii care, la sfârșitul anului școlar, obțin la fiecare disciplină de studiu/modul cel puțin media anuală 5 …, iar la purtare, media anuală 6”.
  Lecția: `=IF(G4>=5,"Promovat","Nepromovat")` pe **media tuturor materiilor**. Pe datele mele de la Ex. 1, 11 elevi ies „Promovat” deși au sub 5 la o materie (`u5_reproducere.txt`). Un catalog care decide promovarea după media generală contrazice regula pe care o știe orice elev de a VIII-a.
- Art. 106: notele sunt „note de la 1 la 10 în învățământul gimnazial”; art. 109 (1): media anuală pe disciplină e „calculată prin rotunjirea mediei aritmetice a notelor la cel mai apropiat număr întreg”. Lecția pune „note” 7.50, 5.50 și le formatează cu 2 zecimale — nici nota, nici media pe disciplină din catalog nu arată așa.

## Norme de specialist (contabil / analist, 2026)
- Axa unui grafic cu coloane pornește de la 0 (altfel diferențele mici par mari) — nemenționat; la Ex. 2 produce exact graficul înșelător (`randat_xlsx/ex2_buletin_p1.png`).
- Formatarea condiționată ca „semafor” e practica reală de azi (lecția o pune la „Vrei mai mult?”) — bine.
- Media cu 2 zecimale doar prin format de afișare (8,625 → „8,63”) e rotunjire vizuală; în catalog regula e alta (art. 109) — de spus elevului că formatul nu schimbă valoarea.
