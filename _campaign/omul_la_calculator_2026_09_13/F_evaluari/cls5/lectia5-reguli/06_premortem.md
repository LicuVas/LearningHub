# 06 — Pre-mortem (U14) și explicații alternative (U13)

## SCHIȚA (scrisă imediat după pasul 1, înainte de a face sarcina)
„Vineri, 18.09.2026, ora de la 9:00 a eșuat. De ce?”
1. **Nu încape:** ora 2 are de fapt lecția 4 (poziția) + lecția 5 (normele); lecția 5 singură are ~4.400 de cuvinte de citit, iar sarcina practică stă la început.
2. **Sarcina practică nu se poate face:** clasa-pereche (5M) nu e în laborator; sau PC-urile au cont comun / restaurare la repornire, deci „Documents/Scoala/TIC/Clasa5” există deja de la altă clasă sau dispare.
3. **Normele de securitate propriu-zise lipsesc:** lecția vorbește despre Ctrl+S, fișiere, internet; profesorul nu are ce să citească elevilor ca „instructaj” real.
4. **Elevul învață un lucru periculos sau fals:** ce faci când se varsă apă (atingi PC-ul?), „pierzi tot” fără Ctrl+S (Word are recuperare automată), parola „complicată” de 8 caractere.
5. **Numele din interfață nu se potrivesc:** „New → Folder”, „Power → Shut down”, Print Screen → Paint pe Windows 11 în română.

## COMPLETAT la pasul 5 — fiecare motiv cu verificarea făcută
| # | Motiv | Verificarea | Rezultat |
|--:|:--|:--|:--|
| 1 | Nu încape | poarta (`u12_poarta_iesire.txt`) + `lectia4-ergonomie/masuri.json` | **confirmat**: 96,1 min; 52,1 la ritm dublu; plus 3.239 de cuvinte din lecția 4 în aceeași oră |
| 2 | Sarcina la PC cade | `u1_sarcina.py` pe două ramuri | **confirmat pe disc** pentru contul comun (clasa a doua suprascrie). Dacă 5M n-are PC-uri: **nu se poate fără sală**, pentru că sala 4/5 e necunoscută → întrebare U17 |
| 3 | Normele lipsesc | numărare de cuvinte-cheie (`u5_iesire.json` A7) + Legea 319/2006, Statutul elevului (text brut) | **confirmat**: 0 la prize/cabluri deteriorate/fum/incendiu/evacuare; nu există normă RO specifică pentru laboratorul de gimnaziu, deci conținutul trebuie luat din regulamentul școlii |
| 4 | Lucru fals/periculos | Microsoft ro-ro (Word), NIST SP 800-63B-4 (parola), rezolvarea Ex. 2 vs atomul 1 | **confirmat** pe toate trei (`04_a_doua_cale.json` rândurile 3, 4, 6) |
| 5 | Nume din interfață | Microsoft ro-ro/en-us, text brut | **parțial**: „Documente” și „Alimentare > Închidere” confirmate; Print Screen → Paint **merge** (Microsoft: tot ecranul în clipboard) — motivul 5 respins pentru Print Screen; „Nou → Folder” neconfirmat pe text brut |

## U13 — explicații alternative pentru semnalările grave
**cls5-l5-11 (timpul, blocant).**
- Alternativa A: ritmurile de citire sunt provizorii, iar elevii nu citesc lecția întreagă (profesorul o proiectează și o rezumă). Observația care deosebește: cât din text e „de citit” vs pliat. Făcut: `masuri.json` — 536 de cuvinte vizibile la deschidere, 4.369 în total; textul pliat (rezolvări, ajutoare) e numărat și el, deci citirea e supraestimată. Dar numai sarcina practică + exercițiile dau 39,6 min la ritmul provizoriu (poarta), iar ora e împărțită cu lecția 4. Blocantul rămâne pe „lecția 4 + lecția 5 în aceeași oră”.
- Alternativa B: profesorul nu vrea să le țină pe amândouă vineri. Observația: calendarul are o singură oră pentru ambele conținuturi (`surse/calendar_5AM_5M_extras.txt`) — confirmat.

**cls5-l5-03 (apa vărsată).**
- Alternativa: „Opresti calculatorul” e gândit pentru un profesor/elev cu mâinile uscate, iar tensiunea la tastatura USB e mică (5 V), deci riscul e mai mult pentru echipament decât de electrocutare. Observația: ce spune chiar lecția despre atingere și despre butonul Power. Făcut (`u5_iesire.json` A3): lecția interzice „Sa atingi calculatorul cu mainile ude” și „Sa tii apasat butonul Power … (doar in caz de urgenta extrema!)”, iar rezolvarea nu spune cum oprești. Concluzia rămâne: pentru un copil de 11 ani primul pas corect e „anunț”, nu „opresc”; gravitatea rămâne *important*, nu blocant, pentru că riscul real de electrocutare la tastatură e mic.

**cls5-l5-04 (Word).**
- Alternativa: în laborator e un Office vechi sau LibreOffice fără recuperare. Observația: ce versiuni acoperă pagina Microsoft. Făcut: pagina se aplică la „Word 2024 … Word 2021 … Word 2019 Word 2016” (`surse/word_recover_en.txt`); pentru LibreOffice nu am verificat. Varianta „pierzi tot” e oricum prea categorică pentru Word ≥ 2016.

**cls5-l5-02 (fișierul suprascris).**
- Alternativa: fiecare elev are cont propriu, deci folderele nu se amestecă. Observația care deosebește: contul folosit în laborator — **nu se poate fără sală**, pentru că nu știu contul → de aceea semnalarea e `depinde_de_necunoscut: true` și `important`.
