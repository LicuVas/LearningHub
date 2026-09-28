# Lecția 8, clasa a V-a (M2): „Ce face un sistem de operare. Elemente de interfață” — sursele și probele

Autor: agent-autor, 28.09.2026. Standardul: `_campaign\revizuire_completa_2026_09\05_STANDARD_LECTIE.md`. Brieful: `07_BRIEF_AUTOR.md`.

## 1. Planul și programa
- **Calendar_ore_5AM_5M.md**: 06.11.2026, săpt. 8, **M2**, „Ce face un sistem de operare. Elemente de interfață”, **predare**. Prima lecție a modulului 2.
- **unitati.json**: unitatea **V-U2** „Sistemul de operare. Ordinea în fișierele mele”, CS.1.2, lecțiile 8-12. Titlul lecției e copiat exact.
- **curriculum.json** (clasa a V-a, domeniul „Sisteme de operare”): `continuturi` declarate = „Rolul unui sistem de operare”, „Elemente de interfață ale unui sistem de operare”. Activitatea de învățare din programă: „exersarea utilizării elementelor de interfață, într-o aplicație specifică sistemului de operare folosit (…), cu evidenţierea rolului unui sistem de operare”.
- **Proiectul_unitatii_V-U2.md**: descriptorul De bază cere „elemente de interfață a sistemului de operare pentru a interacționa cu sistemul de calcul”. Nu are exemple de lecție.
- **Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json** (activitatea profesorului pentru lecția 8): „Explorarea dirijată a desktopului: elevii găsesc și denumesc singuri pictograme, ferestre, bara de activități, meniul de start. Compararea a două interfețe diferite (calculatorul din laborator și telefonul propriu).” → pasul din laborator (punctele 3-7) și galeria Windows / Android / iOS din pasul 1.

## 2. Documentele profesorului (au prioritate)
- Pentru M2 nu există încă material al profesorului (`materiale\continut\` are doar `clasa_V_M1.json`).
- `clasa_V_M1.json`: „Pornesc și opresc calculatorul **corect** (nu de la butonul de la priză)” și „Software = totalitatea programelor: sistemul de operare și aplicațiile”. `teste_sumative.json` (testul V-U1): „Sistemul de operare face parte din hardware.” (F). Lecția 7 a semnalat că termenul nu fusese predat; **acum e predat** (pasul 1: „Sistemul de operare e tot un program, nu o piesă”) și exersat (pasul 1, „Încă un exercițiu” 2: exact afirmația testului, A/F).
- Cuvântul „software” nu apare: lecția 4 a folosit „program” și „aplicație” (profil.json al lecției 4).

## 3. Oprirea calculatorului (cerută de brief: o predau aici?)
**Da, ca parte din interfață**, în pasul 3: „Tot din Start se oprește calculatorul: Alimentare, apoi Închidere”, cu „Uite cum” (Start › Alimentare (Power) › Închidere (Shut down); „În laborator, doar când îți spune profesorul”) și un exercițiu de ordonare („Acasă vrei să oprești calculatorul corect”). Simulatorul are butonul Alimentare cu Repaus / Închidere / Repornire; „Închidere” stinge ecranul simulat, cu „Pornește-l din nou”.
- Se potrivește cu lecția 2 (publicată): „nu stingi calculatorul din ștecăr sau de la butonul unui prelungitor: îl oprește profesorul”. Nimic din lecția 8 nu contrazice asta: pasul din laborator spune „nu oprești calculatorul”, iar întrebarea Î5 are „Start, apoi Alimentare, apoi Închidere” ca variantă GREȘITĂ (ar opri tot calculatorul).
- Numele: documentația Microsoft ro-ro (Windows 11 și Windows 10, aceleași): „Pentru a închide, selectați **Start** și apoi selectați **Alimentare** > **Închidere**” — https://support.microsoft.com/ro-ro/windows/închideți-puneți-în-stare-de-repaus-sau-de-hibernare-pc-ul-2941d165-7d0a-a5e8-c5ad-8c972e8e6eff . „Repaus” și „Hibernare” din aceeași pagină; „Repornire” din „Sfaturi pentru îmbunătățirea performanței PC-ului” (ro-ro).

## 4. Faptele despre Windows: ce am PROBAT pe Windows-ul real (ro-RO, Windows 11 Pro 26200), nimic pe ecranul vizibil
- `_proba/proba_fereastra.py` → `proba_fereastra.json` (rulat cu `C:\00\AI_0\tools\hidden_desktop.py`, desktopul ascuns „A6Hidden”; o fereastră Tk, bara de titlu desenată de Windows):
  - numele UI Automation ale butoanelor din bara de titlu: **Minimizare, Maximizare, Închidere**; după maximizare, butonul din mijloc: **Restaurare**;
  - meniul de sistem al ferestrei: Restaurare, Mutare, Dimensiune, Minimizare, Maximizare, Închidere (Alt+F4);
  - **dublu-clic pe bara de titlu** (mesajul real WM_NCLBUTTONDBLCLK) → fereastra maximizată; al doilea → înapoi la același loc și aceeași mărime [100,100,616,439].
- `_proba/proba_texte_windows.py` → `proba_texte_windows.json` (fără nicio fereastră):
  - sfaturile butoanelor din bara de titlu, din `user32.dll` în limba interfeței (ro-RO): 900 „Minimizare”, 901 „Maximizare”, 902 „Restabilire sus”, **903 „Restabilire jos”**, 905 „Închidere”. De aici: lecția numește butonul cu două pătrate **„Restabilire jos”** (ce vede elevul când ține mouse-ul pe el), nu „Restaurare” (numele pentru cititorul de ecran). Jocul `fisiere-v` scria „Restaurare jos” în simulatorul lui: e greșit (semnalat aici; nu l-am atins);
  - formatul regional: oră `HH:mm`, dată `dd.MM.yyyy` → ceasul din zona de notificare și exemplul „10:35 / 06.11.2026”;
  - numele din meniul Start (`Get-StartApps`): **Calculator, Paint, Ceas, Setări**, Notepad (pe calculatorul de lucru, „Notepad”, nu „Blocnotes”; lecția nu-l folosește).
- Pachetul de limbă engleză al Windows-ului (en-US `user32.dll.mui`) lipsește pe calculatorul de lucru, deci numele englezești NU sunt probate (vezi §8).

## 5. Documentația Microsoft ro-ro (citată)
- „Personalizați bara de activități în Windows” (https://support.microsoft.com/ro-ro/windows/particularizarea-barei-de-activităților-în-windows-0657a50f-0cc7-dbfd-ae6b-05020b195b07):
  - Windows 11: „Bara de activități Windows este alcătuită din mai multe componente (…): 1. Widgeturi 2. Start 3. Căutați 4. Vizualizare activități 5. Aplicații 6. Bară de sistem”; „În mod implicit, bara de activități este centrată în Windows 11. Dacă doriți în schimb să fie aliniat la stânga, consultați Modificarea alinierii barei de activități”; „Aplicațiile care rulează sunt afișate pe bara de activități cu o linie sub pictogramă”.
  - Windows 10: „1. Porniți 2. Căutați 3. Vizualizare activități 4. Aplicații 5. Știri și interese 6. Zonă de notificare”.
  - **De hotărât de profesor:** programa și brieful spun „zona de notificare”; Microsoft ro-ro o numește „Zonă de notificare” la Windows 10 și „Bară de sistem” la Windows 11. Lecția folosește „zona de notificare” (un singur nume, al programei și al Windows 10) și o descrie după ce conține (ceasul, data, sunetul). NESIGUR: ce nume apare, dacă apare, pe Windows 11 în română, în bara reală.
- „Particularizați meniul Start din Windows” (https://support.microsoft.com/ro-ro/windows/experience/personalization/customize-the-windows-start-menu): la Windows 11, în meniul Start „tastați cuvinte cheie” pentru căutare → „Nu o vezi? Scrie primele litere din numele ei: Windows o caută.”
- Butonul Start la Windows 10: în colțul din stânga jos (bara nealiniată la centru). La Windows 11, bara poate fi aliniată la stânga din setări; atunci Start e tot primul din stânga — textul spune „primul din grupul de butoane din mijlocul barei” pentru Windows 11 implicit.

## 6. Material refolosit și verificat
- **Capturile reale** (copie identică, octet cu octet, verificată cu sha256 de `_proba/imagini.py`), din `jocuri\fisiere-v\img\` (Windows 11 în română, capturi proprii ale sitului, 20.09.2026): `aplicatie-peste-desktop.webp`, `desktop-pictograme.webp`, `bara-activitati.webp`, `butoane-fereastra.webp`, `butoane-fereastra-fara-nume.webp`. Proveniența în `img\SURSE.json`. Chenarele și etichetele roșii sunt ale sitului: fiecare legendă o spune („Chenarele roșii le-am pus noi.”, judecătorul V/6, m10).
  - Verificat pe imagini: `desktop-pictograme` arată „Coș de reciclare” (Windows în română) și pictograme de programe de pe calculatorul profesorului (Encrypto, IrfanView, PDF24, Audacity, Everything, Blender, KeePass…): fără nume de cont, e-mail sau fișiere personale.
  - `bara-activitati` se oprește înainte de zona de notificare: legenda spune „fără partea din dreapta”; captura lipsă e în `capturi_lipsa.json` (L1).
- **Fotografiile noi** (Wikimedia Commons, licența citită din API cu User-Agent neutru „LearningHub-lectii/1.0 (educational site)”, 28.09.2026; `img\SURSE.json`): `laptop-pornire.webp` (StrangeApparition2011, CC0, „Microsoft Surface Laptop 7 booting Windows 11”), `telefon-android.webp` (liewcf, CC BY-SA 2.0, Samsung Galaxy Note 3), `telefon-iphone.webp` (freestocks.org, CC0). Toate sub 150 KB, decupate și micșorate; nimic desenat sau generat.
- **Jocul `fisiere-v`**, nivelurile 1-2 (lecția 8): ideile (programul-șef care pornește primul, patru treburi, turnul pe etaje, caietul pus în bancă la minimizare). **Diferențe voite:** jocul spune că pictogramele sunt „pentru programe, fișiere și foldere” și că în Coșul de reciclare „ajung fișierele pe care le ștergi” — aici nu apar fișierele (lecția 9) și ștergerea (lecția 10): „Fiecare duce la ceva, de exemplu la o aplicație” și „despre el afli la lecția 10”. Jocul are și „păstrează fișierele în ordine pe disc” printre treburi; aici rămâne pentru lecția 9 („Data viitoare: cum ține sistemul de operare ordinea în ce păstrezi pe disc”). Întrebările sunt noi.
- Analogia „administratorul școlii” (pasul 1) și „foile de pe masă” (pasul 5): verificate din perspectiva unui copil român (judecătorii, regula 5): administratorul deschide școala dimineața și o închide seara, dă săli orelor; nu răstoarnă nimic.

## 7. Simulatorul nou: `lectii\_sim\desktop-windows.js` (proprietar: autorul lecției V/8)
Un Windows 11 mic: desktop cu pictograme (Coș de reciclare, Calculator, Paint), bara de activități (Start la începutul grupului din mijloc, butoanele aplicațiilor pornite cu linia de sub pictogramă, zona de notificare cu sunetul și ceasul real al calculatorului), meniul Start (caseta Căutare care filtrează după primele litere, Alimentare › Repaus/Închidere/Repornire), ferestre cu Minimizare / Maximizare-„Restabilire jos” / Închidere, dublu-clic pe bara de titlu, mutare (tragi de bara de titlu), mărime (tragi de margini sau de colțul cu dungi), comutare (clic pe fereastră sau pe butonul din bară; clic pe butonul aplicației active o ascunde; două ferestre ale aceleiași aplicații → lista lor), calendarul la clic pe ceas, Calculatorul care socotește (2 + 3 = 5), „Ia-o de la capăt”. Testele se bifează pe loc, pe comportament (jurnalul gesturilor + starea de la final), iar „Verifică” spune testul care nu trece și ce ai de făcut.
- **Fidelitate** (regula 9): numele și dublu-clicul pe bara de titlu probate (§4); restul, după documentația Microsoft (§5) și comportamentul standard (NESIGUR, §8). Tragerea spre marginea de sus maximizează, spre stânga/dreapta pune fereastra pe jumătate de ecran (ca în Windows 10/11; neprobat).
- **Abateri spuse pe ecran** (nota de sub ecran): pe bară stau doar aplicațiile pornite, cu numele scris sub pictogramă; unele ferestre sunt goale; în Paint nu se desenează; colțul cu dungi e pentru deget; de la tastatură, săgețile pe bara de titlu mută fereastra (în Windows se face altfel). Fereastra nouă se deschide lângă pictograme, nu peste ele.
- **Defect găsit și reparat de proba cu degetul (28.09):** la sfârșitul unei trageri, simulatorul redesena ecranul chiar la `pointerup`, înainte de `touchend`; următoarea atingere își pierdea uneori clicul (Start: 1 din 6). Acum desenul nou vine după `setTimeout(…,0)`: 12 din 12 (`_proba/depanare.py`). În Chromium fără ecran, o atingere de 0 ms venită după o tragere începută PE UN BUTON își mai pierde uneori clicul (2 din 12), fără ca pagina să facă ceva; cu atingerea ținută 70 ms, ca un deget adevărat, 0. Parcurgerea folosește atingeri de 70 ms.

## 8. NESIGUR (neprobat; de confirmat pe un calculator din laborator)
1. Dublu-clic pe pictogramă pornește, un clic doar o alege (Explorer nu rulează pe desktopul ascuns).
2. Minimizare → butonul din bară readuce fereastra; clicul pe butonul aplicației active o ascunde; tragerea ferestrei maximizate o readuce la mărimea de dinainte; mutarea și mărimea cu mouse-ul (clicurile de mouse nu merg pe desktopul ascuns).
3. Numele englezești: Recycle Bin, Power, Shut down, Minimize, Maximize, **Restore Down**, Close (pachetul en-US lipsește; „Restore Down” apare în Microsoft Q&A).
4. Sfatul „Restabilire jos” e al ferestrelor clasice (`user32.dll`); Paint și Calculator (aplicații noi din Magazin) își desenează singure bara de titlu: sfatul lor nu e probat.
5. Căutarea „pai” / „calc” în meniul Start real.
6. Paint se închide fără întrebări dacă n-ai desenat nimic (n-am pornit Paint: e aplicație din Magazin și risca să apară pe ecranul profesorului).
7. Ora și data pe două rânduri, în zona de notificare; numele zonei pe Windows 11 în română (§5).
8. Ce Windows au laboratoarele (10 sau 11): lecția le acoperă pe amândouă la locul butonului Start.
9. Pronunția „ai-o-es” (după numele literelor în engleză).
10. Calculator și Paint își amintesc locul și mărimea ferestrei la pornirea următoare (singura urmă posibilă a pasului din laborator; nu e o schimbare a calculatorului, dar colegul următor poate găsi fereastra altundeva).

## 9. Pasul „Acum la calculatorul din laborator” (fără profesor, fără schimbări permanente)
Elevul: citește ce e pe ecran (sistemul de operare, două pictograme, ora și data) și scrie în caiet; pornește Calculatorul din Start (cu căutare, dacă nu-l vede), îl ascunde, îl readuce, îl maximizează și îl readuce; pornește Paint fără să deseneze, îl mută, îl micșorează; comută între ele; le închide. Interzis explicit: tras pictogramele sau bara, clic dreapta, ștergere, oprire, parolă. Dacă ecranul e stins sau cere parolă: scrie în cuvinte pașii și trece mai departe. La final, „Verifică-te” (cheia ascunsă, judecătorii V/6-V/7).

## 10. Granița cu lecțiile 9-10 (alt autor, în paralel)
Nu apar: fișier, folder/director, Explorer, cale, salvare (în afară de „alege butonul care nu salvează” în laborator), creare/redenumire/copiere/mutare de fișiere, ștergere, căutare de fișiere (`_proba/cuvinte.js` pe configurația paginii: „fișierele” apare o singură dată, în titlul unității din plan, „Sistemul de operare. Ordinea în fișierele mele”, obligatoriu; „ștergi” apare doar în interdicția din laborator, „nu ștergi nimic”; „Coș de reciclare” doar numit, cu „afli la lecția 10”; în fereastra Paint simulată se vede meniul „Fișier”, ca în Paint-ul real, fără să fie folosit). „Mutare” aici = mutarea FERESTREI. Clic dreapta și Alt+Tab nu se predau.

## 11. Porțile (28.09.2026)
- `test_joc.py --dir …\lectii\v m2-l08` → **TRECUT** (avertismentul „1 niveluri” e așteptat; cel cu 155 de cuvinte la pasul 2 venea din legendele figurilor — scurtate).
- `verifica_lectie.py … --fara-t1` → S0 TRECUT, S1 0 identice, S2 aplicare/execuție 6/6, T0 0 → ultima linie **0** (prima rulare: T0 2 — „fereastră” folosit înainte de definiție în pasul 0 și „mutare” nedefinit în diplomă; reformulate).
- `_proba/parcurge.py`: gesturi reale la 390 px cu atingere (Pixel 7; tragerea cu degetul prin CDP) și la 1280 px cu mouse-ul; rețeaua blocată în afară de file:/127.0.0.1/localhost; închidere doar cu `ctx.close()`. La fiecare exercițiu: greșeala tipică (respinsă), „Ia-o de la capăt”, drumul corect (acceptat); plus 11 probe de fidelitate pe simulator; ținte ≥ 32 px. Rezultat în `_proba/parcurge_log.txt` (ultima linie = probleme). Singurul mesaj de consolă: fontul Google blocat de probă.

## 12. Reparațiile după judecător (28.09.2026, `_verificare/judecator.md`: 0 GRAV, 4 MAJOR, 16 MINOR)
| Problema | Ce am schimbat |
|---|---|
| **M1** laborator 6-7: clicul pe fereastra Paint lasă un punct pe pânză; la X, „Salvați lucrul?” cu focusul pe Salvați (probat de judecător pe Paint-ul real) | Punctul 5: „Nu da clic pe foaia albă din mijlocul lui Paint: Paint e gata de desenat, iar un clic acolo lasă un punct.” Punctul 6: treci la Paint „cu un clic pe bara lui de titlu, sus, unde scrie Paint, sau pe pictograma lui din bara de activități. Nu pe foaia albă.” Punctul 7: „Dacă Paint te întreabă «Salvați lucrul?», apasă **Nu salvați** (în engleză, Don't save). **Nu apăsa Enter și nici butonul albastru**: ar începe salvarea desenului pe calculatorul comun.” Pasul 5 predă comutarea prin bara de titlu, nu „o bucată din ea”. |
| **M2** colțul cu dungi există doar în simulator | Pasul 5: „pui săgeata exact pe o margine sau pe un colț al ei. Când devine o săgeată cu două vârfuri, tragi” + „Colțul cu dungi e doar în simulator.” Laborator 5, indiciile, soluțiile, mesajele simulatorului și nota de sub ecran spun la fel. Captura lipsă: L7. |
| **M3** ceasul nu se poate scrie pe iPhone (tastatura numerică n-are „:”) | Simulatorul primește și ora doar din cifre (1035, 935, 10 35); caseta nu mai cere tastatura numerică; enunțul: „de exemplu 10:35 (pe telefon poți scrie și 10 35)”. Parcurgerea scrie ora doar din cifre, cu taste reale. |
| **M4** atingerea pierdută după o tragere rapidă, ridicată din mers | Butoanele simulatorului răspund, la deget, la ridicarea lui (`pointerup` pe butonul pe care a coborât); click-ul de după se ignoră (orice tip: Safari dă MouseEvent), tastatura trece. În plus, după o atingere tratată, `touchend` primește `preventDefault()`: altfel browserul trimitea evenimentele de mouse de compatibilitate (mousedown, click) lovite din nou în același punct, iar după desenul nou ele nimereau alt element (probat: un paragraf, iar focusul fugea pe `body`; ar fi putut nimeri și „Mai departe”). La fel „Verifică” și „Arată-mi răspunsul” ale motorului, dar numai în exercițiile cu simulatorul (handlerul motorului e chemat la ridicare; click-ul de după e oprit în faza de captură). Proba: `_proba/proba_atingere.py` (390 px, atingeri CDP, pauzele probei judecătorului): 40 + 40 de cicluri „tragere repede ridicată din mers → atingere pe butonul din bară” (ținută 70 ms și 0 ms), „Verifică” după tragere (10/10, fără încercare dublă), Start comutat exact o dată (20/20), Î3 rămâne pe loc după atingere. Control: același simulator fără răspunsul la ridicare (servit prin rută) pierde atingeri. |
| m1 clic pe desktop, apoi butonul ferestrei de sus | Clicul pe desktop face ca nicio fereastră să nu fie activă; butonul din bară o activează (nu o ascunde). |
| m2 fereastra lipită pe jumătate, trasă înapoi | Își ia mărimea de dinainte, ca fereastra maximizată. |
| m3 căutarea din Start | Potrivește începutul cuvintelor („int” nu mai arată Paint). Laborator 4: „dă clic pe Calculator, primul rezultat”. |
| m4 panoul cu dreptunghiuri (Windows 11) | Pasul 4 și laborator 4: „nu alege nimic din el, apasă chiar pe pătrat”. Simulatorul nu-l arată (NESIGUR, neprobat). |
| m5, m13 pictogramele din bară, dosarul galben | Pasul 2: „Are butonul Start și pictogramele unor aplicații, care sunt tot butoane; sub cele pornite e o linie.” „Uite cum”: „de exemplu un dosar galben (afli ce e la lecția 9). Numele unei pictograme de pe bară apare când ții săgeata pe ea.” Captura lipsă: L6. |
| m6 data în engleză | „Pe unele calculatoare cu Windows în engleză, data începe cu luna (11/06/2026), iar ora are AM sau PM.” (pasul 2 și laborator 3) |
| m7 „exact ca la început” | „La sfârșit, pe ecran nu mai rămâne nicio fereastră a ta, iar pictogramele și bara de activități sunt ca la început.” (Paint ține minte locul ferestrei: §8.10.) |
| m8 ecranul negru | „Dacă ecranul e negru, mișcă puțin mouse-ul: de obicei se aprinde.” |
| m9 oprirea = a doua idee; butonul Alimentare nedescris | Oprirea a ieșit din textul pasului 3 și stă în „Uite cum”: „În meniul Start, jos în dreapta, e butonul Alimentare: un cerc cu o linie sus.” |
| m10 definiția pictogramei | „imagini mici care duc la ceva, de exemplu la o aplicație. Pe desktop au numele dedesubt.” |
| m11 focusul după „Verifică” | Dacă testul care nu trece e ceasul, focusul intră în casetă; altfel pe butonul Start; dacă a trecut, focusul nu se mută. |
| m12 căutarea pe telefon („ppapaipai”) | La tastare se redesenează doar lista; Enter nu pornește nimic în timpul compunerii. Parcurgerea compune „p/pa/pai” prin CDP. |
| m14 „Explorer” pe bară | Butonul ferestrei Coș de reciclare scrie „Coș de reciclare”. |
| m15 legenda capturii | „Chenarul «sistemul de operare» arată ecranul de lucru pe care îl desenează Windows; Windows e programul din spatele lui.” |
| m16 „Scrie «pai»” | „Scrie «pai» și dă clic pe Paint când apare.” |

Regula 25, completată de judecător: probele mele n-au pornit Paint sau Calculator (doar o fereastră Tk pe desktopul ascuns și citirea resurselor), deci nu am atins `SystemAppData\Helium\User.dat`.

## 13. Porțile după reparații (28.09.2026, seara)
- `test_joc.py --dir …\lectii\v m2-l08` → **TRECUT** (doar „1 niveluri”, așteptat).
- `verifica_lectie.py … --fara-t1` → S0 TRECUT · S1 0 · S2 6/6 · T0 0 → ultima linie **0**.
- `_proba/parcurge.py` (390 px cu atingere + 1280 px cu mouse, rețeaua blocată, `ctx.close()`) → **0 probleme**; noi în probă: ora scrisă doar din cifre (M3), focusul după „Verifică” greșit (m11: caseta la ceas, Start în rest), compunerea „p/pa/pai” pe telefon (m12), „int” / „pai”+Enter în Start (m3), desktop + butonul din bară (m1), fereastra lipită trasă înapoi (m2: 0,64 → 0,50 → 0,64). Consola: 0 erori proprii (doar fontul Google blocat de probă).
- `_proba/proba_atingere.py 40` (M4) → 0 pierdute din 40 (atingere de 70 ms) + 0 din 40 (0 ms); „Verifică” după tragere 10/10, fără încercare dublă; Start 20/20; Î3 rămâne pe loc → **0**.
- `_proba/judecator_atelier4_copie.py` (copia sondei judecătorului, logica neschimbată) → V2 repede, ridicat din mers: **0 pierdute din 20** (la judecător: 4, 5, 5); V1 0/20; V3 0/20. **Control** (`--mutant`: același simulator, fără răspunsul la ridicarea degetului, servit prin rută): V2 **4 din 20** pierdute — sonda prinde defectul, reparația îl scoate.

## 14. Judecătorul 2 (28.09.2026, `_verificare/judecator2.md`: 0 GRAV, 0 MAJOR) — minorele reparate
- **n1:** testele „Calculatorul e fereastra de deasupra” → „Calculatorul e fereastra în care lucrezi (deasupra)”; mesajul simulatorului: „… nu e fereastra în care lucrezi: dă clic pe bara lui de titlu sau pe butonul lui din bara de activități. Un clic pe desktop face ca nicio fereastră să nu mai fie cea în care lucrezi, chiar dacă se vede deasupra.”
- **n3:** pasul 2, „Uite cum”: „Pe Windows în engleză americană, data începe cu luna: 11/6/2026 e 6 noiembrie. După oră scrie AM (înainte de prânz) sau PM (după prânz): 10:35 AM.” (formatul probat de judecător; en-GB, 06/11/2026, nu e numit).
- **n4:** pasul 3, „Uite cum”: butonul Alimentare „pe Windows 11 jos în dreapta, pe Windows 10 jos în stânga” (Windows 10: NESIGUR, neprobat).
- **n5:** `_proba/parcurge_dep.txt` avea numele contului Windows în căi: curățat cu `_proba/curata_date_personale.py --curata` (tiparele poartei `learninghub_date_personale.py`, aplicate și pe `_proba/`) → 0; poarta comună → 0.
- **n2** (butoanele motorului după o tragere rapidă) e al motorului comun: neatins aici.
- Porți: `test_joc` TRECUT · `verifica_lectie --fara-t1` → 0. „Uite cum” la pașii 2-3: 79 și 82 de cuvinte.
