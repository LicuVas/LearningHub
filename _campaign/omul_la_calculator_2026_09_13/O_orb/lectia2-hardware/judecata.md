# Judecată independentă — lectia2-hardware (TIC, clasa a V-a)

Verificat pe lecție (citire integrală, scripturi Python, Playwright headless pe `http.server`), pe calendarul 5AM/5M, pe LESSON_SPECIFICATION.md, pe Wikipedia (curl, text brut) și pe resursele Windows ro-RO (`Taskmgr.exe.mui`).

| ID | Problema | Găsită de | Verdict | Gravitate (judecător) | Schimbă ora | X | Y |
|---|---|---|---|---|---|---|---|
| P1 | Nicio imagine, deși scrie „imaginile de mai jos” | ambele | adevărat | important | da | dovedit | dovedit |
| P2 | Start = căutare liberă Google în engleză; căutarea web se predă abia la ora 14 (18.12) | ambele | adevărat | important | da | dovedit | dovedit |
| P3 | Trei clasificări diferite (5 / 3 / 4 categorii) | X | adevărat | important | da | dovedit | n/a |
| P4 | INPUT/OUTPUT în engleză în șablon și la pasul 8 | ambele | adevărat | minor | nu | dovedit | afirmat |
| P5 | Quiz despre PSU în atomul 1, PSU predat în atomul 5 | ambele | adevărat | minor | nu | dovedit | dovedit |
| P6 | Indiciul „Corect!” apare sub „Incorect.” (confirmat în browser) | ambele | adevărat | important | nu | dovedit | afirmat |
| P7 | „Cum colaborează componentele” / structura generală nepredată; Ex. 3 cere flux | X | adevărat | important | da | dovedit | n/a |
| P8 | Flux liniar greșit în rezolvarea Ex. 3 | X | adevărat | minor | nu | afirmat | n/a |
| P9 | Rezolvarea Ex. 2 fără „capacitate” | X | adevărat | minor | nu | dovedit | n/a |
| P10 | 3 GHz = „3 miliarde de operații/s” (mitul gigahertz-ului) | ambele | adevărat | important | da | afirmat | afirmat |
| P11 | Prea mulți termeni tehnici (Cache, PCIe, SATA, VRAM, 500–750W) | X | adevărat | important | da | dovedit | n/a |
| P12 | Analogii contradictorii (CPU = profesor/director/clasă) | X | adevărat | minor | nu | dovedit | n/a |
| P13 | Pictograme greșite (scanner = imprimantă, monitor = laptop, dischetă) | X | adevărat | minor | nu | dovedit | n/a |
| P14 | 0 diacritice din 17.905 litere; spec le cere | ambele | adevărat | important | nu | dovedit | dovedit |
| P15 | Quiz-urile nu verifică stocarea („prea puține” nu încalcă spec: 1–2/atom) | X | adevărat | minor | nu | dovedit | n/a |
| P16 | Modem/placă de rețea contrazice regula „TU trimiți” | X | adevărat | minor | nu | dovedit | n/a |
| P17 | HTML duplicat (try-challenge în try-challenge, 2×h2) | X | adevărat | minor | nu | dovedit | n/a |
| P18 | „Copiază” fără instrucțiune unde se lipește (butonul merge) | X | adevărat | minor | nu | dovedit | n/a |
| P19 | „Performance” vs „Performanță” în Windows RO; întrebare fără răspuns | ambele | adevărat | minor | nu | afirmat | afirmat |
| P20 | Nu încape în 50 min (~3.300 cuvinte + 3 exerciții) | ambele | adevărat | important | da | afirmat | dovedit |
| P21 | Atomul 4 repetă lecția 1 și ia temele orelor 5 și 6 din calendar | Y | adevărat | important | da | n/a | dovedit |
| P22 | Fără strat pentru profesor; niveluri minim/standard/performanță ≠ De bază/Consolidat/Avansat | X | adevărat | minor | nu | afirmat | n/a |
| P23 | Stiluri inline „contra regulii din fișier” | X | **fals** | — | nu | afirmat | n/a |

**Rezumat numeric**

| | Adevărate | False | Neverif. | Blocant | Important | Minor | Schimbă ora | Unice adevărate | Unice important/blocant |
|---|---|---|---|---|---|---|---|---|---|
| X | 21 | 1 | 0 | 0 | 9 | 12 | 7 | 12 | 3 |
| Y | 10 | 0 | 0 | 0 | 7 | 3 | 5 | 1 | 1 |

**Ratate de amândouă:** rezolvarea Ex. 3 spune că GB-ii „NU au fost predați”, dar atomul 2 îi predă; „GPU-ul afișează tot ce vezi pe ecran” (afișează monitorul); „4 nuclee = 4 procese în paralel” (simplificare inexactă). Toate minore.

## Concluzie
1. Niciun raport nu a găsit un blocant real; amândouă au dreptate la fond pe tot ce au în comun (imagini, Google, GHz, diacritice, indiciul „Corect!”, timpul).
2. X acoperă aproape tot ce are Y plus 3 probleme importante în plus (clasificările contradictorii, fluxul/structura nepredate, supraîncărcarea cu termeni); are o singură afirmație falsă (P23, fără efect asupra orei).
3. Y are o singură descoperire unică, dar e cea mai practică pentru 02.10: atomul 4 aparține orei 5 și repetă lecția 1 — spune exact ce tai.
4. Y și-a dovedit mai des afirmațiile care cer măsurare (script pentru suprapunere, calcul de timp); X a afirmat fără dovadă timpul și fluxul corect.
5. Mâine, ca profesor, m-ar ajuta mai mult **X** (vede mai multe lucruri care schimbă ce spun la tablă: clasificarea unică, schema de flux, ce termeni sar), cu condiția să adaug P21 din Y: la ora 4 predau atomii 1, 2, 3, 5 fără detaliile tehnice, iar atomul 4 îl las pentru 09.10.
