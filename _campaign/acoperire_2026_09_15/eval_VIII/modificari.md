# Evaluator independent VIII (15.09.2026): reparații și semnalări

Am verificat doar ce s-a schimbat față de HEAD (`diff.patch`) în `jocuri/excel-viii/index.html` și `jocuri/web-viii/index.html`.

## Reparații (1)

### R1. web-viii, N3 Î5 („Mută… și șterge…”): o copie rescrisă fără diacritice trecea drept mutare
- **Înainte:** `absent:'<p[^>]*>[^<]*formează un arc[\\s\\S]*<p[^>]*>[^<]*formează un arc'`
- **După:** `absent:'<p[^>]*>[^<]*arc\\s+prin[\\s\\S]*<p[^>]*>[^<]*arc\\s+prin'`
- **Dovada:** `t_eval.py`, cazul `<h1>…</h1><p>Carpatii formeaza un arc prin Romania.</p><img…><p>Carpații formează un arc prin România.</p>` (paragraful rescris sus, originalul lăsat jos) era **acceptat** pe iPhone SE și pe Pixel 7 (`t_eval_out1.txt`). Asta contrazicea `why` („apare o singură dată”). După reparație e respins cu mesajul „apare de două ori” (`t_eval_out2.txt`). Toate variantele corecte (ghilimele simple, spații, majuscule, schelet complet, `./carpati.jpg`) sunt în continuare acceptate.

## Semnalări (nereparate)

| # | Gravitate | Ce | Dovada |
|---|---|---|---|
| S1 | minor | Formatare: după un singur clic + buton, următorul clic pe altă celulă face o ZONĂ (B2 → Centru → clic C2 = B2:C2), nu o selecție nouă. În Excel, clicul următor selectează doar celula nouă. Eticheta „Selecția ta” arată corect zona, iar mesajul de respingere numește celula în plus, deci elevul nu rămâne blocat. E o alegere de interacțiune, nu o greșeală dovedită. | `t_eval_out2.txt`, rândul INFO |
| S2 | minor | gresit() la N3 Î5 alege „imagine fără alt” (GRESELI[0]), nu greșeala specifică întrebării („copiat în loc de mutat”). Poarta testează deci respingerea pe o greșeală secundară. Am testat separat copierea: e respinsă. | INFO `N3Î5:0` |
| S3 | neverificat | Etichetele butoanelor din simulator („Aliniere la centru”, „Culoare de umplere”, „Borduri”) sunt descriptive. Pagina Microsoft ro de scurtături scrie „Aliniați la centru conținutul celulelor” și „Alegeți o culoare de umplere”. Numele exacte ale butoanelor din panglică și „Stiluri celulă” nu le-am putut aduce: articolul ro despre stiluri a dat eroare. Formularea din pagină („stilurile predefinite”) e prudentă. | `surse/scurtaturi.txt` |
| S4 | neverificat | Ctrl+N în Excel pentru Windows: pagina ro nu îl listează, iar pagina en îl dă doar în secțiunea Mac. E cunoscut ca valabil și pe Windows, dar nu e dovedit pe sursa primară. | `surse/en_scurt.txt` |
| S5 | pentru profesor | Excel N8 declară și lecția 12 (mini-proiect), iar web N7 declară lecția 21. Jocul verifică doar părți din proiect (formule, serie, cod după specificații); produsul real stă în „provocarea” de pe diplomă. | `ACOPERIRE.md` |

**Verificat pe sursa primară (curl, support.microsoft.com/ro-ro):**
- Sortare: „Selectați o celulă oarecare din zona de date. Pe fila Date, în grupul Sortare & filtrare, selectați Sortare”; „selectați **Adăugare nivel**”.
- Ctrl+O (deschidere), Ctrl+S (salvare), Ctrl+W (închidere).

## Simulatorul „formatare”, jucat cu clicuri pe iPhone SE (320px) și Pixel 7
- **Acceptate:** altă ordine a comenzilor, colțuri alese invers, rândul 1 selectat din antet, formatare pe bucăți (reuniunea exactă), greșeală reparată cu „Fără formatare”, reparare la a doua încercare.
- **Respinse, cu motivul spus:** prea puțin („lipsește de exemplu în B4”), prea mult („și în afara zonei A1:C1, de exemplu în A2”), comanda greșită, coloana B selectată din antet, borduri doar pe note, nimic făcut. Buton apăsat fără selecție: „Întâi selectezi celulele”.
- Zero erori JS. Pe ecran nu iese nimic în lateral.

## Densitate (`densitate.py`)
Excel N1 (lecțiile 2+3): 114 cuvinte, 6 întrebări, 0 simulatoare, ~10 termeni noi (registru, foaie, panglică, file, casetă de nume, bară de formule, adresă, Ctrl+N/O/S, închidere cu salvare, redenumire).
Excel N6 (lecțiile 8+9): 106 cuvinte, 6 întrebări, dintre care 2 foi de calcul cu formule scrise; 5 funcții + 6 operatori de comparație + separatorul.
Celelalte niveluri: 89–99 de cuvinte, 4–5 întrebări. Ambele se încadrează în §6 (60–120 de cuvinte), cu o întrebare peste plafonul de 5.

## Poarta și acoperirea după reparație
- `test_joc.py excel-viii web-viii`: [TRECUT] ×2, 82 + 72 de întrebări jucate (`poarta_dupa.txt`).
- `acoperire.py`: 0 goluri, 0 probleme de declarare.
