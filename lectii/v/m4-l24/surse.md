# V/24 — „Ce este un algoritm. Algoritmi din viața de zi cu zi” — sursele lecției

> **Nu e publicată, nu e în depozit (fără commit).** Autor: tura de noapte 01→02.11.2026 (M4, valul V/23-V/25). Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md` (25.10.2026). Granița: `_campaign\revizuire_completa_2026_09\m4_noapte_01_11\granite\v_l24.md`. Starea autorului: `_proba\stare_autor.md`.

## 1. Ancora (planul, programa, documentele profesorului)

| Ce | De unde | Ce am luat |
|---|---|---|
| Titlul | `Info_Gimnaziu_2026\planificari\Calendar_ore_5AM_5M.md`, r. 32: „19.03.2027 \| 24 \| M4 \| Ce este un algoritm. Algoritmi din viața de zi cu zi \| predare” | titlul întocmai; data 19.03.2027 (= `lectii\plan.json`) |
| Unitatea | `Info_Gimnaziu_2026\data\unitati.json`, V-U5 „Algoritmi. Gândesc pas cu pas” (CS.2.1, CS.2.2, CS.2.3; 7 ore, lecțiile 24-30) | `unitate:'V-U5'`, `competente:['CS.2.1']`; prima lecție a unității |
| Competența și descriptorii | `Info_Gimnaziu_2026\planificari\Proiectul_unitatii_V-U5.md` (citit întreg): CS.2.1 „Identificarea unor modalități algoritmice pentru rezolvarea unor situații din viața cotidiană, exprimate în limbaj natural”; De bază: „proiectează, cu sprijin, modalități de rezolvare a unor situații simple din viața cotidiană, cu secvențe de operații, pe care le exprimă în limbaj natural, în pași ghidați, în contexte familiare” | lecția stă la nivelul De bază: pași ghidați, situații familiare (desen, drum, turn, rețetă), limbaj natural |
| Conținutul | `AI_0\data\informatica_gimnaziu\curriculum.json` (OMEN 3393/2017), V, domeniul Algoritmi: „Noțiunea de algoritm” | `continuturi:['Noțiunea de algoritm']` — declarat DOAR acesta; „Proprietăți ale algoritmilor” e al lecției 25 |
| Activitatea de învățare din programă | programa OMEN 3393/2017, p. 8 (PDF din `_DOSARE_SCOLI\…\Clasa_V`, citit cu `_proba\programa_cauta.py`): „prezentarea unor algoritmi întâlniți în viața cotidiană bazați pe o secvență de operații (de exemplu: prepararea unui ceai etc)”; p. 20: „se recomandă ca noţiunea de algoritm să fie introdusă pornind de la exemple concrete, familiare elevilor” | ceaiul în „Uite cum” la P2; exemplele concrete (rețetă, asamblare, drumul spre școală, tabla) |
| Activitatea profesorului | `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`, „Ce este un algoritm…”: a = „„Robotul din clasă": un elev execută literal instrucțiunile date de colegi pentru o sarcină simplă (de exemplu, desenarea unei figuri pe tablă). Se descoperă nevoia de instrucțiuni clare și complete.”; r = „spațiu liber în clasă, fișe cu rețete și instrucțiuni de asamblare” | vezi §2 |
| Definiția | manualul de a V-a **A1226** = Art Klett (M. Giurgiulescu, V. B. Giurgiulescu; `Materiale_predare\Informatica\Planificari\ManualeOffline\Informatica\Clasa a V-a\A1226.pdf`, ISBN 978-606-076-400-7; aceeași frază e în textul Art Klett descărcat de V/25, `lectii\v\m4-l25\_proba\manual\artklett.txt`), p. 54: „Algoritmul reprezintă o succesiune de operații aflate într-o ordine bine precizată pentru rezolvarea unei probleme sau realizarea unei sarcini.” (citit cu `_proba\manual_algoritm.py` → `manual_algoritm.txt`) | P2, în cuvinte de copil: „un șir de pași, puși într-o ordine anume, care rezolvă o problemă: duc la un rezultat” |
| A doua sursă | manualul **A1232** (Niță, Popescu, Chirilă, Niță — Corint Logistic), p. 56: „prin algoritm vom înțelege o succesiune de operații…”; „Un algoritm este un set finit de instrucțiuni neambigue care se execută într-o ordine bine precizată pentru rezolvarea unei probleme”; „O instrucțiune este o comandă de bază…”; „un robot care ar urma un astfel de algoritm nu va ști ce să facă” | „instrucțiune” (P2), „robotul nu ghicește” (P3, P5). „finit” și „neambigue” NU (sunt ale lecției 25) |
| Ce NU am luat | manualul **A1230** (Pintea, Bălașa — EDP), p. 69: definește algoritmul prin „date de intrare” și „date de ieșire” | lăsat: datele sunt ale lecției 26 |
| Ordinea | manualul A1226, p. 56: „ordinea operațiilor fiind foarte importantă. Imaginați-vă ce s-ar întâmpla dacă am încurca ordinea” (îmbrăcarea) | P4, șosetele și pantofii |

Manualul de la clasă nu e știut (`00_MANUALE.md`: „La clasă: de completat”) → am folosit două manuale care spun același lucru; vezi „Pentru profesor”.

## 2. Activitatea profesorului, pusă în pagină (S12, ora simultană)

- **„Robotul din clasă”** cere colegi care dau instrucțiuni și o tablă. La Tupilați (oră simultană) și pe telefon (Dumbrava) nu există → **executantul din pagină** (`lectii\_sim\executant.js`, extensie NOUĂ): un robot cu marker pe o tablă cu pătrățele face EXACT ce scrie pe cartonașe; greșeala se vede pe tablă (instrucțiunea lipsă → tabla goală, ordinea greșită → robotul oprit în fața blocului, instrucțiunea care se poate face în mai multe feluri → robotul stă pe loc și arată felurile, cu cercurile 1 și 2). Desenarea unei figuri pe tablă = atelierul (steagul) și P3/P5.
- **Fișele cu rețete și instrucțiuni de asamblare** → P1 (instrucțiunile origami), P2 (rețeta ceaiului; instrucțiunile de asamblare ale unui turn de cuburi, amestecate), atelier („Încă un exercițiu”: turnul).
- **„Se descoperă nevoia de instrucțiuni clare și complete”** → P3 (lipsește o instrucțiune), P5 (instrucțiunea neclară), laboratorul (elevul e robotul în Paint și găsește singur pasul neclar: pasul 5 „Colorează casa.”).
- **Elevul e robotul** (gesturi reale, regula 10): P2 (pornește Paint = un algoritm de 3 pași), P3 (trage pe pânză fără să aleagă nimic: Paint face ce face instrumentul ales acum), P5 („Desenează o formă.” — care?), laboratorul (casa din forme, după 6 pași, unul neclar). Pe telefon: laboratorul e pe caietul cu pătrățele (steagul, apoi un pas neclar rescris).

## 3. Conținut → unde e predat, exersat, verificat (S8)

| Conținut / idee | Predat | Exersat (Încearcă / atelier) | Verificat (Î) |
|---|---|---|---|
| Noțiunea de algoritm (pași, în ordine, până la rezultat) | P2 | P2 Încearcă (turnul), P2 Încă (spălatul pe mâini), atelier | Î1, Î3 |
| Algoritmi din viața de zi cu zi (rețeta, asamblarea, drumul spre școală) | P1, P2 | P2 (turnul = asamblare), P4 (drumul spre școală), atelier Încă (drumul, turnul) | Î1, Î3, Î5 |
| Executantul face exact ce scrie | P3 | P3 Încearcă + Încă (pasul lipsă) | Î2, Î5 |
| Ordinea contează | P4 | P4 Încearcă (drumul), P4 Încă (ghiozdanul) | Î3 |
| Instrucțiuni clare și complete (cuvinte obișnuite) | P5 | P5 Încearcă (pătratul), P5 Încă (turnul), atelier (cartonașul „Desenează steagul.”) | Î4 |

## 4. Granița (S59) — ce predau și ce NU

- **Predau:** ce este un algoritm, instrucțiunea, executantul, algoritmi din viața de zi cu zi, ordinea, de ce instrucțiunile trebuie să fie clare și complete — pe exemple.
- **NU predau (și nu apar nici în variante, nici în mesajele simulatorului):** proprietățile ca subiect — claritate, finitudine, generalitate (V/25); datele de intrare / ieșire / de manevră, constante, variabile (V/26); expresii, operatori (V/27); „structura secvențială (liniară)” (V/28); decizia, „dacă … atunci” (V/29); Scratch (V/31). „Clară” și „complet” apar doar în cuvinte obișnuite (prompt: „poți spune «clar» și «complet» în cuvinte obișnuite, fără denumirile ca listă”).
- **Proba mecanică:** `_proba\granita_cuvinte.py` (pagina fără comentarii + textele din `executant.js`) → **0** apariții pentru: claritat, finitudin, generalitat, propriet, date de intrare, de ieșire, de manevr, variabil, constant, expresi, operator, secvenț, liniar, decizi, alternativ, „dacă … atunci”, repet, scratch, program(ul/are/ator), condiți, cod sursă. Controlul: cuvintele există în comentarii (3 rânduri), iar scanerul le găsește când nu sunt comentarii.
- Robotul din pagină se oprește la o instrucțiune neclară și la marginea tablei; NU arată un algoritm care nu se termină (asta e finitudinea, a lui V/25: extensia lui o poate face cu `Executant.instructiune`).

## 5. Ce presupun lecțiile publicate și ce folosesc (din `profil.json`)

| Presupus | Unde e predat | Folosit aici | ✔ |
|---|---|---|---|
| Paint: Start, `pai`, clic pe Paint | V/18 P1 (`afirmatii` A02) | P2 caseta, laborator 1 | ✔ |
| Fișier › Nou; „Salvați lucrul?” → Nu salvați | V/18 P2, P5 (A27, A18, A21) | laborator 1, la sfârșitul orei | ✔ |
| Forme: Dreptunghi, Triunghi; apeși, tragi, lași; „Vezi doar butonul Forme?” | V/19 P3 (A05, A06) | P5 caseta, laborator 2-4 | ✔ |
| Săgeata ↶ de sus (Anulați) | V/19 (A08), V/18 (A28) | P3, P5 casete | ✔ |
| Salvați ca › Imagine PNG; Documente; „există deja” → Nu + cifră | V/18 P3 (A10, A12); V/21 lab (A18); V/22 lab | laborator 6 | ✔ |
| Numele cu numele, prenumele, clasa, liniuța de jos | V/18, V/22 P5 („liniuța de jos”: Shift + minus) | laborator 6 | ✔ (V/22 se publică în noaptea asta; liniuța de jos e și la V/18) |
| Ctrl+S după un clic pe bara de titlu | V/18 P4 (A17, A29) | laborator, Verifică-te (opțional) | ✔ |
| Culoare 1 + o culoare; Umplere într-o zonă închisă | V/21 P2-P3 (A03, A08) | laborator, Verifică-te („Dacă mai ai timp”) | ✔ |
| Numele „Pop_Ana_5A_…” (exemplu) | V/22 (același exemplu); `nume_toate.py --candidat "Ana Pop"` → liber | laborator 6 | ✔ |
| **Ce găsește elevul în Documente când ajunge la V/24** (adăugat 02.11.2026, J2-O): de la V/22, `Nume_Prenume_<clasa ta>_felicitare.png` (sau `_afis.png`), poate neterminată, NEȘTEARSĂ („<b>Nu șterge</b> felicitarea: îți trebuie la lecția 23.”); de la V/23 (nepublicată), afișul de antrenament `Nume_Prenume_<clasa ta>_proba.png`, lângă felicitare („Afișul rămâne în <b>Documente</b>; cum îl predai îți spune profesorul.”). Oricare poate avea și o cifră la sfârșitul numelui („există deja” → Nu + cifră). În ordine alfabetică, ambele stau înaintea lui `…_robot` | V/22 `surse.md` 8 și „Ce rămâne la elev”; V/23 `surse.md` 10 și „Ce rămâne la elev” | la sfârșitul orei (laboratorul, caseta P2, diploma): se șterge DOAR fișierul de azi, cel care se termină cu `_robot` (poate cu cifra); „Felicitarea și afișul tău de la lecțiile 22 și 23 nu le atingi.” | ✔ (V/22 se publică în noaptea asta; de la V/23 doar fișierul, scris și în graniță) |

## 6. Decizii (și variantele respinse)

1. **Simulator nou `executant.js`** (nu `urmarire-algoritm.js`, care e notația de pseudocod a clasei a VI-a: „Citește”, „←”, „Dacă … atunci” = vocabular V/26-V/29). Trei lumi: tabla (activitatea profesorului), drum (drumul spre școală), turn (instrucțiunile de asamblare). Respins: o lume „rețetă” cu obiecte și stări (prea multe reguli inventate pentru o lume de bucătărie; rețeta stă ca exemplu scris, din programă).
2. **Fără tragere**: cartonașele se pun prin atingere (la capătul algoritmului), se mută cu ↑ ↓, se scot cu ✕ (≥ 36 px). Respins: tragerea cartonașelor (greu la 390 px, F3).
3. **Testele judecă rezultatul** (regula 29): desenul ca mulțime de bucăți de 1 pătrățel (ordinea și sensul tragerii nu contează), turnul de jos în sus, locul unde s-a oprit robotul; plus „Robotul face toți pașii, fără să se oprească” (pune primul mesajul adevărat despre oprire). **REPARAT 02.11.2026 (J1-J):** testul se numește „Robotul face toți pașii, până la ultimul”, iar oprirea ca greșeală se spune „înainte de ultimul pas” (la V/25 „se oprește” e lucru bun).
4. **Instrucțiunea neclară oprește robotul** și arată 2 feluri (cercurile 1 și 2 pe tablă, „Felul 1: …” sub butoane). Respins: robotul alege la întâmplare (ar învăța că „merge și așa”).
5. **„executant”**: cuvântul din prompt și din activitatea profesorului („execută literal”); NU e în programă, nici în cele 3 manuale de pe disc (`_proba\manual_extra.py`: 0 pagini) și nici în textele celor 7 manuale de a V-a strânse de V/25 (`lectii\v\m4-l25\_proba\manual\*.txt`, grep: 0) → explicat simplu la P3; întrebare „Pentru profesor”.
6. **P1 = instrucțiuni origami de pe Commons** (desen în pași, fără limbă în afară de „STEP”). Respinse: fișe de rețetă scrise de mână în engleză (greu de citit), diagrama cocoșului origami (are e-mail, adrese și coduri QR ale autorului), instrucțiuni de mobilă cu marcă.
7. **Laboratorul: elevul e robotul în Paint** (prompt), cu un pas intenționat neclar (5 „Colorează casa.”) și unul vag (3 „cât de mare?”); „Verifică-te” e pliat ca să nu dea răspunsul înainte. Fișierul rămâne în Documente (ca la V/22); pe telefon, pe caiet. **REPARAT 02.11.2026 (sonnet J1 M-3, ghidul S82):** la sfârșitul orei elevul închide Paint cu „Nu salvați” și își șterge fișierul (Explorer, Documente, Delete; nu golește Coșul), ca la lecțiile 19-21; fișierul nu-i trebuie la lecția 25.
8. **Tipul în pagină se numește `robot`** (`tipuri:{robot:Executant.tipuri.executant}`): cu numele „executant”, extragerea oracolului T0 scria cuvântul la P2, înainte de definiția din P3 (alarmă a extragerii, nu a paginii). Pentru alte lecții tipul rămâne `Executant.tipuri.executant`.

## 7. Simulatorul `lectii\_sim\executant.js` (proprietar: V/24)

- API-ul complet: capul fișierului și granița (`API FINAL` ~23:22; ADĂUGAT 23:30: `imagine`, `raport.ordine`, `culori`). Fără dependențe; nimic salvat (0 chei `localStorage` — proba `parcurge.py`), nimic trimis.
- **Fidelitate:** nu simulează o aplicație. E un robot imaginar; regula lui e chiar ce predă lecția. Pagina nu spune nicăieri că un program real se poartă ca el (Î4 spune „Robotul din lecție”).
- **Probe:** `_proba\nucleu_test.js` → 0 (17 verificări: pătratul în ambele sensuri = același desen, fără „Pune markerul” → tabla goală, marginea, instrucțiunea neclară cu 2 feluri pornite din starea de acum, blocul pe drum, ocolirea, turnul, cubul lipsă din cutie, o instrucțiune nouă care nu se termină → `prea_multi` după `maxPasi`, o lume nouă). `_proba\parcurge.py` → 0 (vezi §10).

## 8. `afirmatii.json`

18 afirmații: 6 DOCUMENTAT (manualele, programa), 6 CONFIRMAT_LECTIE_ANTERIOARA (Paint, din `afirmatii.json` V/18, V/19, V/21), 2 PRUDENT (tot din lecțiile anterioare, dar neprobate până la capăt: scrise cu „de obicei” / „dacă te întreabă”), 1 PROBAT_PAGINA (robotul), 2 PROBAT_CAPTURA (imaginile), 1 DEDUS (cuvântul „executant”). Susținute de o sursă sau o probă: 15; prudente / deduse: 3. Paint NU a fost pornit (aplicație din Magazin; e noapte, ecranul e vizibil).

## 9. Imaginile

- `img\origami-catel.webp` — „File:Origami Dog Face Instructions.png”, Georgejem, CC BY-SA 4.0 (citit prin API: `_proba\commons_licenta.json`; sha1 = cel de pe Commons; `_proba\licente.py` → 0), întreg, convertit în WebP (11,6 KB). Rândul în `img\SURSE.json`.
- `../m3-l19/img/desen-forme.webp` — refolosit prin cale relativă (captura reală din Paint a lecției 19), cu legenda „de la lecția 19”. Dacă V/19 o mută, se rupe laboratorul (dependență declarată, S5).
- Figurile din „Uite cum” la P3 și P5 sunt **desenele robotului** (`Executant.imagine`), nu capturi; legenda o spune („Desenul robotului din pagină.”).

## 10. Porțile și probele (rulate pe versiunea curentă)

- `test_joc.py --dir …\lectii\v m4-l24` → **TRECUT** (21 de întrebări jucate; diacritice 78,9/1000; „1 niveluri” = obișnuit).
- `verifica_lectie.py … --fara-t1` → **0** (S0 TRECUT, S1 0 identice, S2 5/5 aplicare/execuție, T0 0).
- `_proba\parcurge.py` (gesturi reale: 390 px cu atingere, Pixel 7; 1280 px cu mouse): fiecare exercițiu cu robotul întâi GREȘIT (construit cu atingeri: ✕, cartonașe, ↑), „Verifică” respins cu mesajul adevărat, „Ia-o de la capăt”, apoi bun, „▶ Pornește robotul” până la capăt, „Verifică” → Corect, toate testele bifate; întrebările; 3 stele; 0 erori în consolă; 0 ținte sub 32 px; 0 derulare orizontală; 2 cereri externe oprite (fonturile), 0 spre panou. Ultima linie: vezi `_proba\parcurge_<eticheta>.txt`.
- `_proba\oracol.py` (oracol INDEPENDENT, Python, nu folosește `executant.js`; citește configurația vie): la cele 9 exerciții cu robotul, soluția face toți pașii și dă exact modelul, drumul greșit și algoritmul de pornire NU trec, cartonașele soluției există în paletă sau în pornire; Î2: algoritmul dă un colț de 5 bucăți → **0** nepotriviri.
- `_proba\nucleu_test.js` → 0; `_proba\granita_cuvinte.py` → 0; `_proba\cuvinte.py` → 0 depășiri.
- `_proba\intunecat.py`: capturi în tema întunecată la 390 px (tabla, harta, turnul, atelierul), privite; 0 erori. După ele: etichetele „bloc”/„parc” cu culoare fixă, cerculețul markerului și antena în culoarea textului, „pătrățelele libere” (nu „albe”).
- `activitate.py lista | grep -c "nu e în catalog"`: 0 înainte, 0 după.
- Capturile de telefon PRIVITE: `_proba\telefon_pas2_sim.png`, `telefon_pas3_sim.png`, `telefon_pas4_corect.png`, `telefon_atelier.png` (după ele: rândurile algoritmului se rup pe două rânduri pe ecran îngust, numele „școala” se scrie peste robot, tabla vine la vedere când pornește robotul și arată sub ea pasul de acum).

## 11. Durata (metoda judecătorului, socotită cu `_proba\cuvinte.py`)

Drumul obligatoriu ≈ 1.613 cuvinte (pașii cu „Uite cum”, legendele și casetele, enunțurile, atelierul, laboratorul — cu blocul de telefon —, întrebările). Pași: text 99 / 81 / 73 / 45 / 66 (plafon 110); „Uite cum” ≤ 49 (plafon ~80).
- Citit: 1.613 : 80 cuv./min (ritmul clasei a V-a, S39) ≈ 20 min (la 110 cuv./min ≈ 15 min).
- Exercițiile din pași (4 cu robotul, câte 2-6 atingeri, ~5 s de animație, o greșeală): ~6 min. Atelierul (5 cartonașe, robotul, Verifică): ~3 min. Casetele „Acum la calculator” (3): ~1,5 min. Laboratorul (Paint deja deschis; 2 forme, culoarea, salvarea cu numele): ~8 min. Întrebările: ~3 min.
- **Total ≈ 41-45 min** (sub 50). „Încă un exercițiu” și „Dacă mai ai timp” nu intră. De cronometrat la clasă laboratorul (primul laborator „tu ești robotul”).

## Pentru lecția următoare (V/25 „Proprietățile algoritmilor: claritate, finitudine, generalitate”)

- **Ce rămâne la elev:** cuvintele „algoritm” (pașii, în ordine, până la rezultat), „instrucțiune” (un pas scris), „executant” (cine face pașii; robotul / calculatorul face exact ce scrie), „clară” (se poate face într-un singur fel) și „complet” (nu lipsește niciun pas) — doar în cuvinte obișnuite, fără denumirile proprietăților. Robotul din pagină: tabla cu markerul, harta casă → școală, turnul de cuburi. În laborator: `Documente\Nume_Prenume_<clasa ta>_robot.png` (casa din forme; poate neterminată) și, în caiet, pasul 5 rescris. **REPARAT 02.11.2026:** fișierul se șterge la sfârșitul orei (în Coș); la elev rămâne doar caietul. „Clară” și „complet” nu mai sunt marcate ca termeni (`<mark>`), doar îngroșate (J1-E). Pe telefon: steagul desenat pe caiet și un pas neclar rescris.
- **API-ul `executant.js`** (încarci `../../_sim/executant.js` înaintea extensiei tale): `Executant.ruleaza(lume, instructiuni, optiuni)` → raport (`ok`, `oprit`, `pas`, `mesaj`, `final`, `variante`, `micro`, `urma_pasi`, `ordine`); `Executant.compara`, `Executant.text`, `Executant.imagine`; extinderi `Executant.instructiune(lume, {f, text, fa})` (un iterator care nu se termină e oprit după `maxPasi` cu `oprit:'prea_multi'`) și `Executant.lume(nume, {baza})`; tipul pentru motor `Executant.tipuri.executant` (în pagina mea, sub cheia `robot`). Forma lui `Q`: capul fișierului.
- **Ce nu ai voie să schimbi:** numele lumilor, ale instrucțiunilor și ale testelor, forma raportului, textele cartonașelor, clasele `ex-` și `#ex-css`. Ce îți trebuie în plus: fișier NOU (granița V/25: `algoritm-defect.js`).
- La V/24 robotul NU are o instrucțiune care nu se termină și nu rulează același algoritm pe mai multe cazuri: acestea sunt ale tale (finitudinea, generalitatea); `ruleaza` primește `start` diferit la fiecare apel, deci un „caz” = un apel.

## Pentru profesor

1. **Cuvântul „executant”** nu e în programă și nici în manualele de a V-a (A1226, A1230, A1232 de pe disc și cele 7 de pe manuale.edu.ro strânse de V/25); l-am folosit pentru „cine face pașii” (activitatea dumneavoastră: „un elev execută literal”). Dacă la clasă îi spuneți altfel, se schimbă în 3 locuri (P3, Î5, diploma).
2. **Manualul de la clasă:** definiția e din A1226 (p. 54) și A1232 (p. 56). Dacă elevii au alt manual, vă rog să-mi spuneți ce definiție dă. **Completat 02.11.2026 (J1-K):** pe disc, în dosarele 2025-2026, Tupilați are `Scoala\2025-2026\Tupilati\Manuale\cls_05\A1226.pdf` (definiția folosită aici), iar Brauner are `Scoala\2025-2026\VictorBrauner\Manuale\cls_05\A1230.pdf` (EDP, p. 69: definește algoritmul cu date de intrare și de ieșire, care vin la lecția 26). Care e manualul la clasă în 2026-2027, la fiecare școală?
3. **Fișierul din laborator** (`Nume_Prenume_<clasa>_robot.png` în Documente) rămâne pe calculatorul comun, ca la lecția 22. Dacă nu vreți să rămână, laboratorul poate cere ștergerea lui la final. **Schimbat 02.11.2026:** laboratorul cere acum ștergerea lui la sfârșitul orei (ghidul S82, ca la lecțiile 19-21); dacă vreți să-l vedeți după oră, se scoate rândul acela (P2 și laboratorul).
4. **Pe telefon** (Dumbrava), laboratorul e pe caietul cu pătrățele (steagul + un pas neclar rescris), nu în pagină.

## Pentru componenta comună

- Nimic schimbat în motor, `prezenta.js`, `rezultat-elev.js` sau în simulatoarele altora: `git status --short lectii/_sim/ jocuri/_motor/ assets/js/prezenta.js` (01.11, după probe) arată doar fișiere NOI (`??`): al meu, `executant.js`, și extensiile vecinilor din val; niciun fișier urmărit modificat.
- Observat (fără legătură cu lecția): în capturile de la 390 px, eticheta „Sunt elev — mă înscriu” (`prezenta.js`) stă peste ultimul rând vizibil al ecranului (aici, lista de teste); proba atinge totuși toate țintele (verificare `elementFromPoint`). De știut pentru proprietarul lui `prezenta.js`; nu schimb nimic.

## Nesigur

- N1: instrumentul ales la pornirea lui Paint (de obicei Pensule) — scris prudent; `capturi_lipsa.json` L1.
- N2: întrebarea de la Fișier › Nou cu un desen nesalvat — scris „dacă te întreabă ceva despre salvare”; L3.
- N3: casa literală din laborator nefotografiată (folosesc desenul lecției 19); L2.
- N4: „executant” — cuvântul lecției, nu al programei.

## Atenție pentru judecător

- Laboratorul are INTENȚIONAT un pas neclar („Colorează casa.”) și unul vag (cât de mare e dreptunghiul): e chiar activitatea profesorului („se descoperă nevoia de instrucțiuni clare și complete”). „Verifică-te” e pliat.
- P5 spune „clară” și „complet” în cuvinte obișnuite; denumirile proprietăților nu apar (proba §4).
- Rezultat, nu drum: atelierul primește steagul tras în orice ordine (pânza întâi, apoi bățul etc.), cu markerul ridicat între bucăți.
- Ordinea (P4) e chiar rezultatul: pe hartă, ordinea greșită oprește robotul în fața blocului.
- Imaginea din laborator e de la lecția 19 (casa colorată, cu soare): legenda spune că elevul face doar casa. **REPARAT 02.11.2026 (J1-I):** legenda spune și ce e altfel (acolo casa e în stânga și colorată; elevul o face jos, la mijloc, iar culorile le alege la pasul 5).

## Regulile standardului verificate pe lecție

1 (T0 = 0; vocabularul vecinilor = 0), 2 (cuvinte pe pas, `cuvinte.py`), 3, 4 (P1 fotografie Commons; P2-P5 simulator; desenele robotului), 5 (S2 5/5), 7 (`afirmatii.json`), 9 (robotul face exact ce scrie — e regula lui), 10 (3 casete + laborator), 20 (ținte ≥ 32 px, `parcurge.py`), 22 (Commons doar cu User-Agent-ul regulii), 23 (nimic salvat), 24 (rețeaua blocată, `ctx.close()`, `activitate.py` 0/0), 25 (Paint nepornit, nimic pe ecran), 26 („există deja” → Nu și o cifră), 27 (nume inventate verificate; `learninghub_date_personale.py`), 29 (rezultat, nu drum), 31 (390 px cu atingere), 32 (laboratorul fără profesor, fără cont; drumul de telefon), 33 (granițele), 34, 38 (pași mici + „Cum arată”: casa de la lecția 19).

## Reparațiile după judecata 1 (02.11.2026)

Reparator proaspăt, tura de noapte 01→02.11. Registrul complet, cu citatul, reparația, locul și starea fiecărui punct: `_verificare\registru_j1.md` (14 puncte: opus A-K, sonnet L-N; 1 MAJOR + 13 MINOR; toate REPARATE, niciunul respins). Copia dinainte: `_proba\inainte_r1\` (și `executant.js`).

**Ce s-a schimbat în pagină:** P3 „Încearcă” — mesajul tablei goale spune adevărul și ordinea (A); laboratorul — „Tu ești robotul” în intro, rândurile 1-6 = Pasul 1-6 (B); „robotul din pagină s-ar fi oprit” (C, și în caseta P5); P5 — „unde e nevoie, spune cât, încotro, cu ce” (D), „clară” / „complet” îngroșate, fără `<mark>` (E); „Ai nevoie de” cu lecțiile 10, 21 și 22 (G); atelierul — „bățul și pânza”, indiciul „Poți trage liniile și în altă ordine…” (H); legenda casei din laborator (I); testul „Robotul face toți pașii, până la ultimul” (J); „Pentru profesor” 2 cu manualele de pe disc (K); P3 — regula „exact cum sunt scrise” e a robotului din pagină (L); P2 — „Robotul din pagină face pașii…” (M); la sfârșitul orei — „Nu salvați” și ștergerea fișierului din Documente, fără să golești Coșul (N, ghidul S82, ca lecțiile 19-21). Tăiat ca durata să nu crească: „Și pornirea lui Paint e un algoritm…” din „Uite cum” P2 (caseta de dedesubt o spune), „salvează iar (Ctrl+S…)” din „Dacă mai ai timp” (fișierul se șterge oricum), „pas cu pas,” și „tu ești robotul,” (repetiții).

**`lectii\_sim\executant.js` 1.1 — pentru lecția următoare și pentru oricine îl încarcă:** API-ul NU s-a schimbat (funcțiile, opțiunile, forma raportului, numele lumilor / instrucțiunilor / testelor, textele cartonașelor, clasele `ex-`). S-au schimbat doar: (1) textul mesajului „tabla goală” (din urma reală: „n-a pus deloc markerul” / „l-a pus abia după ce a mers” / „l-a ridicat înainte să meargă” / „cât timp a mers, markerul era ridicat”); (2) sfârșitul mesajelor de oprire ale robotului: „…, înainte de ultimul pas.” / „…, fără să termine ultimul pas.” (la instrucțiunea neclară: „…înaintea ei, înainte de ultimul pas.” / „…, chiar înainte de ultimul pas.”); (3) oprirea după `maxPasi` o spune pagina: „Pagina a oprit robotul după 200 de mișcări, în timpul instrucțiunii N: algoritmul nu se terminase.” (era „…: l-am oprit noi.”); (4) desenul felurilor: întâi liniile, apoi cercurile cu cifre; (5) `Executant.versiune` = '1.1 (02.11.2026)'. Cine compară mesajele cuvânt cu cuvânt trebuie să citească textele noi; formulările sunt și în granița `m4_noapte_01_11\granite\v_l24.md` (SCHIMBAT 00:42 și 00:47). V/25 nu încarcă `executant.js`, dar și-a aliniat vocea opririi (granița lui, 00:57: „Pagina a oprit executantul după 40 de faceri…”).

**Ce rămâne la elev după V/24 (schimbat):** fișierul `…_robot.png` se șterge la sfârșitul orei; rămâne caietul (pasul 5 rescris). Pe telefon, ca înainte.

**Porțile pe versiunea finală:** `_proba\proba_reparatii.py` → `proba_reparatii_2.txt`: 97 de verificări, 0 probleme (390 cu atingere + 1280 cu mouse și taste; drumurile greșite ale P3 urmate literal până la „Corect”, fără buclă); `nucleu_test.js` 0; `oracol.py` 0; `parcurge.py final_r1` 0 (3 stele la ambele lățimi, consola goală, 2 cereri oprite = fonturile); `granita_cuvinte.py` 0; `cuvinte.py` 0 (1.604 cuvinte, era 1.613); `test_joc.py` TRECUT; `verifica_lectie.py --fara-t1` 0; durata după metoda judecătorului (`_proba\durata_r1.py`, copia lui `j1_durata.py`, schimbată doar la intrare): 2.244 → 2.239 cuvinte, 29,3 min la 110 cuv./min (neschimbat) + un gest nou de ~10-15 s în ultimele 10 minute (ștergerea din Explorer); copia neschimbată a probei judecătorului (`_proba\j1_probe.py`): vezi registrul.
