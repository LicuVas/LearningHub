# Autor windows_web — raport (10.10.2026)

Fișierul: `cum-fac/_sursa/fise_windows_web.json` · **41 de fișe** (22 `windows`, 19 `web`), 16 cu captură din pasul-sursă, 25 cu `captura: null`.
Verificatorul: `node cum-fac/_build/valideaza_fise.mjs fise_windows_web.json` → `fișe: 41 · fișiere: 1` / **0**.
Probă proprie în plus: nicio formulare cu diacritice, nicio dublură, toate „înrudite” există în fișier.

## Fișele, pe lecții
- **V/8** (13): pornire din Start · pornire cu dublu-clic pe desktop · oprirea corectă (Start › Alimentare › Închidere) · ecranul negru → miști mouse-ul · Minimizare · Maximizare · Restabilire jos · Închidere (X) · mutarea ferestrei · schimbarea mărimii · trecerea la altă fereastră · numele unei pictograme (ții săgeata pe ea) · ora și data din zona de notificare.
- **V/9** (9): deschiderea Explorer (dosarul galben / Windows+E) · intrarea într-un folder (dublu-clic) · selectarea (un clic) · panoul din stânga (Documente, Acest PC) · unitățile și locul liber în Acest PC · calea din bara de adresă (+ Esc) · extensia, din nume · tipul din coloana Tip, când extensia e ascunsă · coborârea în listă cu rotița.
- **VIII/14** (11): pornirea Notepad · filă nouă · închiderea filelor (Fișier › Închideți fila, nu X) · semnele < > / pe tastatură · schimbarea textului din h1 · salvarea .html (Salvare ca, Toate fișierele, UTF-8) · Salvați ca / Ctrl+Shift+S · deschiderea în browser din Explorer · Ctrl+S + F5 · sursa cu Ctrl+U · verificarea .html sau .txt (coloana Tip).
- **VIII/15** (8): scheletul (DOCTYPE, html lang, head, body) · textul în corp · title (fila browserului) · meta charset (diacriticele) · ghilimelele drepte · Ș pe tastatura românească (+ Windows+Spațiu) · indentarea cu Tab · închiderea etichetelor în ordine inversă.

## Gesturi văzute în lecții, FĂRĂ fișă, și de ce
1. **V/1 — butoanele lecției, bara de jos, „Verifică”, indiciul, trasul barei pe telefon**: sunt gesturi pe situl LearningHub, nu într-o aplicație adevărată (regula 3).
2. **V/2 — regulile laboratorului, ce faci la fum / miros de ars, poziția la birou, regula 20–20–20**: conduită și postură, fără gest în aplicație (postura e exclusă explicit în sarcină).
3. **V/3, V/4, V/7 — sisteme de calcul, drumul datelor, piesele, recapitularea**: idei, fără gest.
4. **V/5 — mișcarea mouse-ului / a degetului pe touchpad ca să vezi săgeata; foaia pusă pe geamul scanerului**: observații sau gesturi fizice, nu pași într-o aplicație.
5. **V/6 — cum compari capacități / „încape sau nu”**: calcul în minte. Captura „Disc local (C:) 198 GB liber din 475 GB” e în V/6, dar V/6 nu spune cum ajungi la ea; gestul (Acest PC) e acoperit din V/9 (`windows-acest-pc-unitati`). **Băgatul stickului în mufa USB** și **scoaterea în siguranță a stickului** nu sunt predate ca pași (V/6 interzice chiar atingerea mufelor în laborator).
6. **V/8 — panoul cu dreptunghiuri de pe Windows 11** (Snap): lecția spune doar „nu alege nimic din el”; avertismentul e în fișa Maximizare, nu e un gest separat. **Scrierea literei A** (p2): idee despre drumul datelor.
7. **V/9 — scrierea căii unui fișier pornind de la un arbore desenat**: exercițiu în caiet, nu gest. **Semnele pe care Windows nu le primește în nume** (\ / : * ? " < > |): regulă; redenumirea nu e predată în lecțiile 1–9, deci n-am unde s-o pun. **Folder nou, redenumire, copiere, mutare, ștergere, Coșul de reciclare**: NU sunt în lecțiile publicate ale clasei a V-a (lecția 9 trimite la lecția 10, care nu există în digest) → nicio fișă.
8. **VIII/14 — butoanele H1, B, I din Notepad**: lecția spune să NU le folosești. **„Clic pe pagină înainte de Ctrl+U”** apare doar în indiciul simulatorului. **Închiderea filei din browser cu ×** și **caseta cu tipul la ținutul mouse-ului pe fișier** sunt incluse ca pași în fișele Ctrl+U și „.html sau .txt”, nu separat.
9. **VIII/15 — selectarea unui rând cu mouse-ul + Delete** (experimentul cu meta): lecția nu spune CUM selectezi cu mouse-ul, așa că o fișă n-ar fi executabilă literal fără ceva ce lecția nu spune. **Pe telefon, două spații în loc de Tab**: nu e aplicația adevărată.

## Nesiguranțe (pentru judecători / dirijor)
- **`sursa.titlu_pas` la VIII/15 p3 și p4** e copiat exact: `Titlul de pe filă: <title>` și `Literele ă, î, ș, ț: <meta charset="utf-8">`, cu etichete adevărate în text. Dacă pagina pune titlu_pas în HTML fără escape, trebuie scăpat la build (verificatorul nu se uită la câmpul ăsta).
- **Capturi care arată rezultatul, nu clicul**: `notepad-fila-noua` (filă nouă), `edge-f5` (după F5), `edge-cu-meta` (diacritice corecte), `bara-activitati` (unde e Start / dosarul galben). Le-am păstrat pentru că sunt din pasul-sursă și arată ce trebuie să vezi; un judecător strict pe regula 7 le-ar putea vrea `null`. Am pus `null` acolo unde captura arăta doar simptomul greșelii (`edge-txt`, `edge-title-neinchis`).
- **`scurtatura` la Maximizare / Restabilire jos** = „Dublu-clic pe bara de titlu” (lecția o numește „Scurtătură”); nu e o combinație de taste, deci pagina n-ar trebui s-o deseneze cu `<kbd>`.
- **Aplicația pentru gesturile Windows din lecțiile de clasa a VIII-a** (Windows+Spațiu, Explorer ca să deschizi pagina): le-am lăsat `web`, cum cere sarcina pentru VIII/14–15; cine filtrează pe „Windows” nu le vede acolo.
- **Fișe de „privit”** (ora și data, numele pictogramei, ecranul negru): le-am făcut pentru că lecția predă ce faci (unde te uiți, ții săgeata pe pictogramă, miști mouse-ul); sunt la limita regulii 1.
- **Definițiile din `termeni` pentru Explorer în fișele VIII** sunt formulate din contextul lecției 14 („în Documente găsești fișierul tău”); lecția 14 nu-l definește explicit.
- **Locul liber în Acest PC**: afirmația „o bară albastră și textul … liber din …” vine din textul alternativ al capturii din V/9 p4, nu din textul pasului.
