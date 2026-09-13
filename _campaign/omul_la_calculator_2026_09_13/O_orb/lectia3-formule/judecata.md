# Judecată independentă — lecția 3 „Formule” (clasa a VIII-a)

Cum am verificat: am căutat în HTML și am citit bucăți din el; am recalculat în LibreOffice tabelele din activitatea de start, din Ex. 1 și din Ex. 2 (cu și fără $), apoi ordinea operațiilor și TVA-ul; am deschis lecția în Playwright (browser fără fereastră) și am dat un răspuns greșit la test. Pentru fapte am citit în text brut Microsoft Support (en/ro) și PwC Tax Summaries. Am citit și planul anului (ora 7 = operatori aritmetici, ora 8 = funcții), `curriculum.json` și specificația sitului.

| # | Problema | Găsită de | Verdict | Gravitate | Schimbă ora | X | Y |
|---|---|---|---|---|---|---|---|
| P1 | Indiciul spune 78, corect e 77 | ambele | adevărat | blocant | da | dovedit | dovedit |
| P2 | Testele sunt decalate față de atomi; ordinea operațiilor n-are întrebare | ambele | adevărat | important | da | dovedit | afirmat |
| P3 | SUM și intervalele sunt folosite peste tot, dar nepredate (în plan SUM e la ora 8) | ambele | adevărat | important | da | dovedit | afirmat |
| P4 | „Excel nu calculează de la stânga la dreapta” e fals | ambele | adevărat | important | da | dovedit | dovedit |
| P5 | Ciclul F4 e descris greșit | ambele | adevărat | minor | nu | afirmat | afirmat |
| P6 | TVA 19% (cota standard e 21%) | ambele | adevărat | important | da | afirmat | afirmat |
| P7 | Zecimale cu punct, fără avertisment despre setarea regională | ambele | adevărat | important | da | afirmat | afirmat |
| P8 | Rezultate afișate inconsecvent (9.00 / 7 / 9.67; 7.50) | ambele | adevărat | minor | nu | afirmat | afirmat |
| P9 | În Excel în română funcțiile au nume traduse (AVERAGE = MEDIE) | X | **fals** | — | nu | afirmat | — |
| P10 | Ex. 2: „celule goale” e greșit (C4 dă #VALUE!, C5 dă 1575 fără nicio eroare) | ambele | adevărat | important | nu | dovedit | dovedit |
| P11 | Lipsesc erorile tipice și cum le citești | X | adevărat | minor | nu | dovedit | — |
| P12 | Obiectivele și rezumatul sunt lipite mecanic din titluri | X | adevărat | minor | nu | dovedit | — |
| P13 | Bara de formule nu e explicată (dar ora 2 din plan o acoperă) | X | adevărat | minor | nu | dovedit | — |
| P14 | Nicio captură de ecran | X | adevărat | minor | nu | dovedit | — |
| P15 | Spații lipsă în întrebări („scrii=A1+B1in”) | X | adevărat | minor | nu | dovedit | — |
| P16 | Scrie „Corect!” imediat sub „Incorect.” | X | adevărat | minor | nu | dovedit | — |
| P17 | Numerotarea atomilor e dezordonată | X | adevărat | minor | nu | dovedit | — |
| P18 | Kill_Points / „Ruler” / „Cu calculatorul?” | X | adevărat | minor | nu | dovedit | — |
| P19 | Aplicațiile din programă (TVA pe bon, fizică) lipsesc | X | adevărat | minor | nu | dovedit | — |
| P20 | Excel Online cere cont; o secțiune stă în altă secțiune | X | adevărat | minor | nu | dovedit | — |
| P21 | Butonul „← Inapoi” nu face nimic | X | **fals** (duce în capul paginii) | — | nu | afirmat | — |
| P22 | Lecția depășește ora 7 (SUM, $, F4), fără ghid pentru profesor | ambele | adevărat | important | da | afirmat | dovedit |
| P23 | Niciun semn diacritic (specificația le cere) | ambele | adevărat | important | nu | afirmat | dovedit |
| P24 | „Următoarea lecție” e generică | X | adevărat | minor | nu | dovedit | — |
| P25 | „Drag handle” nu e termenul din Excel (în română: „instrumentul de umplere”) | Y | adevărat | minor | nu | — | afirmat |

**Rezumat.** X: 22 adevărate, 2 false · 1 blocant, 8 importante, 13 minore · 7 schimbă ora · 11 unice, dar niciuna importantă. Y: 12 adevărate, 0 false · 1 blocant, 8 importante, 3 minore · 7 schimbă ora · 1 unică (minoră).
**Au ratat amândouă:** indiciul testului de la atomul 7 repetă greșeala cu „celule goale”. Fără $, C3 și C4 dau 15 și 24, adică numere greșite fără nicio eroare afișată.

## Concluzie
1. Pentru ce contează în ora de mâine, rapoartele sunt la egalitate: amândouă prind toate cele 8 probleme care schimbă ora (78/77, testele decalate, SUM nepredat, „stânga la dreapta”, TVA, zecimalele, depășirea orei 7).
2. Y e mai curat: 0 false din 12. În plus leagă lecția de planul real (ora 7 = operatori aritmetici, SUM la ora 8) și găsește rezultatul greșit fără eroare de la Ex. 2 (1575), exact cazul pe care elevul nu-l observă.
3. X e mai complet, dar tot surplusul e minor (finisaje). Are și 2 afirmații false: numele funcțiilor „traduse” în Excel în română și butonul „inert”.
4. Ca profesor mâine l-aș lua pe **Y**: în 10 puncte îmi spune ce tai și ce corectez în 50 de minute, fără să verific ce e fals.
5. X e lista mai bună pentru cine repară pagina după oră, cu condiția să se elimine P9 și P21.
