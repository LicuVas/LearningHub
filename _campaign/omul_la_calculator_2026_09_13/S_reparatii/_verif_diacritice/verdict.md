# Verdict: diacritice în 4 lecții LearningHub (verificare independentă, 13.09.2026)

**Cum am verificat:** `diff_words.py` pune față în față HEAD și fișierul de pe disc, linie cu linie. Toate cele 4 fișiere au același număr de linii și același număr de cuvinte pe fiecare linie schimbată (nicio nepotrivire). Raportul complet e în `report.txt`. Am citit cu context toate perechile ambigue: ca/că, sa/să, cat/cât, forme articulate/nearticulate, verbe la infinitiv/prezent, a/ă final, in/în lângă cuvinte englezești. Tot cu context am citit și cuvintele ASCII rămase care au o pereche cu diacritice în corpus, apoi lista integrală de cuvinte ASCII unice din textul vizibil. Unealta ajutătoare e `ctx.py`. Textul din `<code>`, `<pre>`, `<script>`, `<style>`, `<title>` și `<kbd>` e exclus.

| Lecția | Cuvinte schimbate | Greșeli reale | Scăpări reale | Rată de eroare (greșeli / schimbări) |
|---|---|---|---|---|
| cls6 lectia5-tranzitii (cu dicționar) | 877 | **0** | 0 | 0% |
| cls8 lectia7-sortare | 723 | **3** | 4 | ~0,41% (cu scăpări: ~1%) |
| cls5 lectia1-calculator | 722 | **0** | 2 | 0% |
| cls7 lectia5-tabele | 2310 | **0** | 1 | 0% |
| **Total** | **4632** | **3** | **7** | **~0,06%** |

---

## 1. cls6/m1-prezentari/lectia5-tranzitii.html (877 schimbări)
**Greșeli: 0.** Am verificat integral:
- Toate cele 4 `ca→că` sunt conjuncții („înseamnă că are tranziție”, „pare că doar”, „Cum știi că”, „semn că”).
- Toate `sa→să`: 23 (18 + 5 „Să” la început de propoziție).
- `adauga→adăuga` apare după „Poți”, iar `adauga→adaugă` la imperativ sau la prezent. Ambele sunt corecte.
- `diferenta→diferența` (articulat) și `→diferență` („nicio diferență”, „ce diferență”) sunt alese corect după context.
- `pagina→pagină` („ca o pagină de carte”), `tasta→tastă` („Ce tastă”), `lista→listă` („o listă”), `regula→regulă` („aceeași regulă”) sunt toate corecte.
- „Fly In”, „Zoom In” și numele de fișiere `Clasa_Nume_Tranzitii.pptx` / `_Automata.pptx` au rămas neatinse, cum trebuie.

**Scăpări: 0.** Cuvintele ASCII rămase sunt toate corecte: „pentru a aplica” (infinitiv), „tasta F5”, „ultima animație”, „camera face”, „viteza plăcută”, „de tine”, „fila Tranziții”, „de la dreapta”, „sau”.

## 2. cls8/m1-excel-fundamente/lectia7-sortare.html (723 schimbări)
**Greșeli: 3.** Toate trei vin din aplicarea mecanică a regulii de pe cuvânt, fără contextul frazei:
1. L119 `pentru a mută întregul rând` → corect **„pentru a muta”**. După „a” urmează infinitivul, care nu are ă.
2. L251 `pentru a aplică tot ce ai învățat` → corect **„pentru a aplica”**. Aceeași cauză.
3. L195 `a două oară anulează sortarea` → corect **„a doua oară”**. Numeralul ordinal „a doua” nu are ă, spre deosebire de „două ori”.

**Scăpări: 4.** Cuvinte lăsate fără diacritice, deja greșite în HEAD:
1. L108 `Sortarea simplă ordoneza tabelul` → **„ordonează”**.
2. L108 `după o singură coloana` → **„o singură coloană”** (după „o”, forma e nearticulată).
3. L158 `Această coloana permite revenirea` → **„Această coloană”**. Doar jumătate reparat: „Aceasta” a primit ă, „coloana” nu.
4. L226 `o selectie parțială` → **„o selecție parțială”**.

Restul e corect:
- „celula activă”, „coloana B”, „fila Date”, „nota cea mai mare”, „clasa a VIII-a”, „În noua coloană”, „în grupa 8B”.
- „ca tabelul să”, „ca antet”, „ca un teanc” (ca comparativ sau în „ca… să”).
- Numele de coloane „Nota” și „Clasa” sunt lăsate ca etichete din Excel.

## 3. cls5/m1-sisteme/lectia1-calculator.html (722 schimbări)
**Greșeli: 0.**
- Toate cele 6 `ca→că` sunt conjuncții.
- „ocupa o cameră întreagă” și „ocupa un etaj” sunt imperfect, corect lăsate fără ă. „ocupă spațiu” e prezent, corect cu ă.
- „de pe mâna ta”, „la încheietura mâinii” și „Calculator de încheietură” sunt corecte.
- „ai prefera”, „poți explica”, „poți identifica”, „a te uita”, „nu îl poți muta” sunt corecte (infinitiv sau condițional).
- „Consola de jocuri (PlayStation) este” (articulat) și „Consolă PlayStation ___” (etichetă) sunt corecte.

**Scăpări: 2.**
1. L133 `Tableta pe care citesti sau desenezi` → **„citești”**.
2. L147 `Bonus Challenge (optional)` → **„(opțional)”** (minor; e posibil să fie intenționat în engleză, dar restul titlului e mixt).

## 4. cls7/m1-word-fundamente/lectia5-tabele.html (2310 schimbări)
**Greșeli: 0.** Aici a fost cel mai mare volum de verificat:
- 50 de `celula→celulă`: toate după „o / orice / fiecare / ultima / aceeași / altă / în”. Formele articulate („celula vecină”, „celula rezultată”, „în celula 1”) au rămas corect articulate.
- 31 de `coloana→coloană`: la fel. „toată coloana”, „ca coloana de referință”, „Coloana 1:” au rămas corect articulate.
- 19 `pagina→pagină`, `săgeata/săgeată` (articulat vs „o săgeată”, „Tastele săgeată”), `stânga/stângă` („marginea stângă”), `dreapta/dreaptă` („partea dreaptă”; „la dreapta” lăsat corect).
- „frecventă” (adjectiv: „confuzie frecventă”, „greșeală frecventă”) e corect față de „frecvență”.
- „nu îl îmbina pe el” e imperativ negativ, deci corect fără ă. „a adăuga”, „va adăuga”, „poate arăta”, „s-ar întâmpla” sunt corecte.
- Toate cele 11 `ca→că` sunt conjuncții. Cele ~15 „ca” rămase sunt comparative sau „ca… să”, deci corecte.

**Scăpări: 1.**
1. L2334 `Table Properties > Row > bifeza "Specify height"` → **„bifează”**.

Observații în afara mandatului (nu țin de diacritice, nu intră în scor):
- L1059 „Ține apăsat tasta” ar trebui „Ține apăsată tasta” (acord).
- „Potrivire automată fereastră (AutoFit Window)”: eticheta românească reală din Word e „Potrivire automată la fereastră”.

---

## Concluzie
- Lecția făcută cu dicționar (tranziții) e **curată**: 0 greșeli la 877 de schimbări.
- Singurele greșeli reale sunt în **lectia7-sortare**: infinitiv după „a” („a mută”, „a aplică”) și ordinalul „a două oară”.
- Există 7 scăpări în total, toate cuvinte care erau deja fără diacritice în HEAD.
- Toate cele 10 corecturi sunt locale, câte un cuvânt fiecare.
