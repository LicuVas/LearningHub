# Ce s-a lucrat noaptea de 2 spre 3 septembrie 2026

Ai cerut: **materia pentru clasele de liceu, maiștri și postliceală pe LearningHub**, în stilul celor mai
bune lecții existente, fiecare lecție completă și de sine stătătoare, pentru toate clasele tale de anul acesta.

---

## FĂCUT (cu dovada alături)

**99 de lecții noi, toate trec o poartă mecanică.**
„Poarta" înseamnă un program care deschide fiecare fișier și îl măsoară — nu crede pe cuvânt niciun agent.
O lecție trece doar dacă are peste 11.000 de caractere, minimum 4 atomi de învățare, 3 chestionare cu
răspunsuri valide, 3 exerciții și butoane de navigare care duc unde trebuie. Am calibrat poarta pe două
lecții bune care erau deja pe site — amândouă trec, deci pragul nu e inventat.

| Cine învață | Ce am construit | Lecții |
|:--|:--|--:|
| **X B și X E** (T.E.E.A., mecanică/lemn) | calcul tabelar avansat, baze de date în Access, prezentări digitale | 13 |
| **XI C și XI D** (protecția mediului, mecanică, silvicultură) | date și flux informațional, căutare pe internet, organizarea datelor, operatori, funcții, instrumente de lucru | 19 |
| **XII C și XII D** (lemn, protecția mediului, silvicultură) | creare de site-uri web, management de proiect, proiect integrator | 12 |
| **Maiștri auto, anul I** | modulul „Utilizarea tehnicii de calcul" — cele 3 competențe, cu fișele de evaluare | 16 |
| **Postliceal sanitar, anul I** (medicină generală) | cele 5 competențe, cu protecția datelor pacienților | 17 |
| **Postliceal sanitar, anul II** (farmacie) | aceleași 5 competențe, în context de farmacie | 13 |
| **Artistic, clasa a XII-a** | cele 9 pagini care scriau „În pregătire" pe site | 9 |

**Materia nu e inventată.** Am plecat de la fișa ta de încadrare din vault, care are programele verificate pe
documentele oficiale: OMECI 5099/2009 pentru liceu, O.M.Ed.C. 4760/2006 pentru maiștri, curriculumul de
postliceal sanitar pentru celelalte două. Fiecare modul de pe site poartă codurile competențelor din programă.

**Exemplele sunt din meseria lor, nu din manual.** La maiștri: devize de reparație, evidența pieselor, scheme
electrice, coduri de eroare. La sanitar an I: parametri vitali, stocuri de materiale, evidența pacienților.
La farmacie: loturi, termene de valabilitate, adaos comercial. La artistic: partituri, program de concert,
buget de eveniment, afiș, copertă de album.

**Ce am mai găsit și am reparat pe drum:** pe clasa a XII-a artistic, 9 pagini de pe site-ul public scriau
literal „În pregătire" — pagini goale de 2,8 KB. Erau o promisiune neonorată către oricine intra pe site.
Acum sunt lecții întregi.

**Controalele, toate rulate de mine, nu raportate de agenți:**
- 124 din 124 de fișiere planificate trec poarta
- 603 întrebări de verificare: toate cu 4 variante distincte, indicii reale, iar răspunsul corect e împrăștiat
  (b 30% · c 30% · a 22% · d 18%) — nu se ghicește din poziție
- 855 de legături verificate una câte una pe disc: **0 rupte**
- **un bug real prins și reparat:** în 2 lecții, ghilimelele simple folosite ca citate în text închideau
  atributul HTML mai devreme și stricau chestionarul. Browserul ar fi picat la fel. 6 chestionare reparate.
- **am deschis lecțiile în browser**, nu m-am oprit la „fișierele există": se încarcă stilul, se încarcă toate
  cele 6 motoare (atomi, practică, rezumat, navigare, progres), pagina arată identic cu o lecție veche bună.
  Am verificat inclusiv cea mai adâncă pagină din structură, unde riscul de căi greșite era cel mai mare.

---

## NEFĂCUT — un singur lucru, și e blocat de ceva ce doar tu poți debloca

**Publicarea pe site.** Tot ce s-a construit e salvat în git local, în 4 commit-uri. `git push` **nu trece**:

- tokenul GitHub din variabila de mediu e **expirat** — GitHub răspunde `401`
  (același motiv pentru care ți-a picat și serverul MCP de GitHub la pornirea sesiunii);
- managerul de credențiale Windows cere autentificare **interactivă**. Un push pornit a stat 40 de minute
  fără să urce nimic. **Nu ți-am atins ecranul cât dormeai** — regula ta.

**Ce ai de făcut, două minute:**
```
cd C:\00\Projects\LearningHub
git push
```
Dacă apare fereastra GitHub, autentifică-te. Ca să nu se mai repete, fă-ți un token nou
(GitHub → Settings → Developer settings → Personal access tokens, scope `repo`).

**După push, verifică — nu te opri la „am dat push":**
```
curl -s -o /dev/null -w "%{http_code}" https://learninghub-8z6.pages.dev/content/profesional/maistri/an1/c1-aplicatii-software/index.html
```
Trebuie să răspundă `200`. Cloudflare reconstruiește în vreo un minut.

---

## NESIGUR — lucruri pe care nu le pot decide eu

**1. Liceul de Arte „Victor Brauner" — ce clase ai anul acesta?**
Ai 7 ore acolo, dar clasele pe 2026-2027 nu sunt scrise nicăieri în vault. Există doar lista de anul trecut
(5A, 6MA, 7A, 7M, 8A, 8M, 9A, 9M, 11M, 12M). Am construit clasa a XII-a artistic pentru că erau pagini goale
pe site oricum. Dar dacă ai **9A/9M sau 11M**, mai e de verificat ce lipsește la clasele alea.
*Când afli clasele, spune-mi și completez ce trebuie.*

**2. Postliceal sanitar, anul I — care variantă de curriculum aplică școala?**
Lecțiile acoperă varianta care se potrivește cu orele tale (56 = 4 ore × 14 săptămâni). Dacă școala aplică
varianta din O.M.E.N. 3499/2018, modulul se numește „Elemente de statistică și informatică medicală" și are
28 de ore — caz în care cele 56 de ore înseamnă **două grupe** și aceeași materie se folosește de două ori.
Oricum, materia nu se pierde.

**3. Cotele de resurse.** Mi-ai spus să urmăresc pagina de utilizare. **N-am reușit să o citesc** — tab-ul e
deschis, dar panoul e o fereastră care nu se randează la citirea textului paginii. Am insistat de două ori și
m-am oprit. În schimb am construit altceva, care rezolvă problema de fond: **starea nu e în capul meu, e pe
disc**. O sesiune nouă, fără niciun context, reia din trei comenzi — scrise în `RESUME.md`, alături.

---

## Ce n-am atins deliberat

**Dumbrava Roșie** e gimnaziu, iar gimnaziul era deja acoperit pe site. N-am presupus asta — am numărat:
207 lecții reale pe clasele V-VIII, niciuna schelet. (Rămâne totuși nelămurit dacă ai 5A/5B/7B/8 sau
6/7A/7B/8 — documentul semnat și doamna Archip spun lucruri diferite. Materia există pentru toate variantele.)

---

## Cum a fost construit (dacă vrei să refolosești mașina)

Nu am scris 99 de lecții „de mână" într-o singură sesiune care se îngroașă. Am făcut o mașină:

1. **`PLAN.json`** — ce se construiește: 34 de module, 99 de lecții, fiecare cu tema exactă din programă.
2. **`status.py`** — poarta care măsoară realitatea de pe disc.
3. **`make_wave.py`** — pune într-un val **numai ce nu trece poarta**, cu lotul scris în fișierul de lucru,
   nu purtat prin conversație. Asta e și motivul pentru care se poate relua după orice întrerupere.
4. **Valuri de agenți:** fiecare lecție a fost scrisă de un agent ieftin, apoi **atacată** de un verificator
   scump care căuta ce e greșit (conformitate cu programa, corectitudine factuală, dacă lecția chiar stă
   singură în picioare, cod valid, chestionare), apoi reparată. **314 agenți, 0 erori.**

Refolosire pentru altă materie: schimbi conținutul din `build_plan.py` și rulezi aceleași comenzi.
