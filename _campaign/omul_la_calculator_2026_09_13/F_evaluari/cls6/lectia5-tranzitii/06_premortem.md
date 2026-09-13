# 06 — Pre-mortem (U14) + explicații alternative (U13) · cls6/lectia5-tranzitii

## Schiță (scrisă imediat după pasul 1, înainte de a face sarcina)
Ora a eșuat. De ce?
1. **Timpul:** L4 + L5 sunt aceeași oră 7 din plan; L4 singură nu încăpea (54,5 min drum minim). Cu L5 adăugată, ora e cel puțin dublă.
2. **Numele din lecție nu sunt pe ecran:** totul e în engleză (Transitions, Apply To All, Advance Slide, On Mouse Click); dacă PowerPoint din laborator e în română, elevul caută butoane care nu există cu acel nume. În plus, pot exista efecte puse în categoria greșită sau inventate (tiparul din L4).
3. **Morph cere PowerPoint 2019+ / 365** — Ex.2 runda 3 și Ex.3 depind de o versiune necunoscută în laborator.
4. **Nu există „prezentarea mea” de la ora trecută:** primul ecran cere „o prezentare existentă”, dar nicio lecție anterioară nu a cerut salvarea fișierului; elevul pierde minute să facă 3–5 diapozitive noi.
5. **La Izvoare nu există calculator:** o lecție despre efecte care „se vad doar in modul Slide Show” nu se poate simți pe hârtie.

(Completat la pasul 5 mai jos.)

## U14 — cele 5 motive, fiecare cu verificarea făcută
| # | Motivul | Verificarea | Rezultat |
|--:|:--|:--|:--|
| 1 | Timpul L4 + L5 | `u12_timp.py` → `u12_sensibilitate.txt` (formula porții, pe pașii mei și ai L4) | **Confirmat.** L5 singură, drum minim (citit până la Ex.1 + Ex.1): 55,9 min. Ora 7 = L4 minim + L5 minim, o pornire: **102,4 min**; la ritm dublu **55,2 min** — nu încape nici atunci. Doar citirea ambelor lecții: 75,8 min. |
| 2 | Nume de interfață / efecte | curl + text brut Microsoft ro/en (`surse/s_*.txt`), `surse/nume_efecte.py` | **Confirmat parțial, și mai grav decât în schiță:** filele și comenzile au nume românești confirmate (Tranziții, Se aplică tuturor, Opțiuni efect, De la dreapta, Durată, La clic de mouse, După); Push/Wipe/Cube/Flip nu au nume RO confirmat; **categoriile sunt greșite** (Rotate, Gallery, Vortex — `surse/s_dynamic_content.txt`) și „Exciting (Incitante)” nu e traducerea Microsoft („Interesant”). Limba din laborator: nu se poate afla fără sală. |
| 3 | Morph cere 2019+ | text brut `surse/s_morph.txt` | **Confirmat:** „numai în Microsoft 365 sau PowerPoint 2019/2021”; varianta web cere OneDrive de școală/serviciu. Dacă laboratorul are 2016: Ex.2 runda 3 și diapozitivul 4 din Ex.3 nu se pot face. Versiunea: nu se poate afla fără sală. |
| 4 | Nu există prezentarea de ora trecută | `03_pasi.json` pasul 1; JURNAL L3 („nicio cerere de salvare a prezentării”); Grep „Salveaza” în `innerText.txt` | **Confirmat:** singurul „Salveaza” din lecție e butonul „Salveaza raspunsul” pentru caseta de text; pasul 1 costă 3,9 min doar ca să refaci 3 diapozitive. |
| 5 | Izvoare fără calculator | B_context_real §3; lecția: „Tranzitiile se vad doar in modul Slide Show (F5)” | **Nu se poate verifica fără sală**, pentru că nu știm dacă există un calculator + videoproiector la Izvoare. Pe hârtie se poate face doar partea de judecată (vezi U17 în `05_evaluare.md`): fișă cu 3 „povești” de prezentare și alegerea tranziției + a avansării (la clic / după X s), justificat. |

Motiv nou, găsit făcând sarcina (nu era în schiță):
6. **Rezolvarea Ex.3 învață greșit „ambele bifate”** — un elev care a înțeles atomul 4 e corectat greșit la final. Verificat pe `surse/s_ambele_bifate.txt` + `04_a_doua_cale.json`.

## U13 — explicații alternative pentru semnalările grave
**A. „Ora 7 nu încape” (blocant).**
- Alternativă 1: ritmurile porții sunt prea lente pentru o clasă de a VI-a obișnuită. Observația care deosebește: ritm dublu. Făcută: 55,2 min > 50 → rămâne.
- Alternativă 2: Vasile nu ține L4 și L5 în aceeași oră, ci pe două ore. Observația: ce oră ar pierde. Făcută: `Calendar_ore_6A_6M.md` — ora 7 e 23.10.2026, ultima din M1; ora 8 (estetică și ergonomie) nu are lecție pe site, deci a doua oră ar mânca din ora 8 sau ar trece în noiembrie. Semnalarea rămâne: lecția așa cum e scrisă nu încape în ora planului.

**B. Categoriile greșite (Rotate / Gallery / Vortex).**
- Alternativă: Microsoft a reorganizat galeria după 2010/2013, iar lecția descrie o versiune nouă. Observația: dacă Gallery și Vortex ar fi fost adăugate după lista celor 7, n-ar fi fost în ea din motive de vechime. Făcută: `surse/raw/mspptx_en.txt` — `vortex`, `gallery`, `ferris`, `conveyor`, `pan`, `window`, `flythrough` sunt **în același set de extensii PowerPoint 2010**; deci Gallery și Vortex existau când Dynamic Content avea exact 7 efecte fără ele. Rămâne un risc mic de reorganizare ulterioară, pe care nu îl pot exclude fără PowerPoint 365 deschis → gravitate **important**, nu blocant.

**C. „Ambele bifate” (rezolvarea Ex.3).**
- Alternativă: autorul s-a gândit la animațiile rămase „La clic” (atunci diapozitivul chiar așteaptă clic, oricum ar fi bifată avansarea). Observația: ce bifă numește fraza. Făcută: fraza numește explicit „On Mouse Click alaturi de After” (Avansare diapozitiv), nu Start-ul animațiilor; iar în fișierul meu (`07_redeschis.json`) diapozitivele cu animații la clic sunt marcate separat (`asteapta_clic_pentru_animatii`). Deci capcana reală e animația la clic, iar lecția o numește greșit → **important**.

**D. Întrebările puse înaintea predării (5/10).**
- Alternativă: întrebările sunt „previzualizare”, nu verificare. Observația: dacă răspunsul greșit are cost. Făcută: `innerText.txt` — „Atentie! Raspunsul se blocheaza dupa selectare” și „Raspunde corect la intrebarile anterioare pentru a continua” → sunt verificare cu blocare, nu previzualizare → rămâne **important**.
