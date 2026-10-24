# Sâmbătă 24.10.2026 — tura M3 (a început 23.10, 23:34; închisă 24.10, ~16:20)

Ai cerut (23.10, 23:34): „lecțiile din modulul 3 la toate clasele de gimnaziu, cu aceeași structură și rigurozitate… nu aștepta confirmări”.

## Pe scurt
- **M3 e GATA: toate cele 24 de lecții (16-21 la clasele V, VI, VII, VIII) sunt PE SITE și verificate live.** `stare.py --modul M3` → publicat 24 · în lucru 0.
- Fiecare lecție a trecut prin judecători independenți (opus) până la 0 probleme GRAV / 0 MAJOR, apoi prin scriptul cu porți (`publica_lectie.py`: plan, build, legături, date personale, test_joc, verificare, conținutul de pe site = fișierul comis, proba de fum la 390 și 1280 px). Am mai verificat eu, pe site, câte o frază nouă din fiecare.
- Cele mai grele: V/20 (5 judecăți), VIII/16 (6 judecăți), VI/19 (3 judecăți + 3 reparații).
- Bugetul: o dată s-a umplut fereastra de 5 ore (02:50-04:40, agenții opriți, reluați la resetare); a doua oară (08:15-09:50) doar n-am mai pornit agenți noi, cei porniți au lucrat. N-am pierdut nimic.

## Publicate (cu commitul)
| Clasa | Lecția | Commit |
|---|---|---|
| V | 16 Siguranța pe Internet · 18 Paint: interfața (19.10) | 8b317fa3 · abae4f7c |
| V | 17 Evaluare: Internet și documentare | b41ebffb |
| V | 19 Paint: selectare, copiere, mutare, desen | f00d7deb |
| V | 20 Redimensionare, trunchiere, rotire, zoom (5 judecăți) | e172ab20 |
| V | 21 Culori și stiluri de umplere, culori personalizate | ec0d7603 |
| VI | 17 Recapitulare algoritmi (19.10) | f0b982d9 |
| VI | 16 Evaluare: comunicarea prin Internet | 4199e1ae |
| VI | 18 Scratch: interfața (republicată cu simulatorul nou) | 929ce4fd · 95449728 |
| VI | 19 De ce repetiția; etapele rezolvării | 95449728 |
| VI | 20 Repetiția cu contor („repetă 10”, „pentru”) | 95449728 |
| VI | 21 Repetiția cu condiție („cât timp”, „repetă până când”) | 95449728 |
| VII | 15 (o frază) + 16 Mini-proiect montaj + 17 Evaluare audio-video | b2c85c54 |
| VII | 18 Aplicația colaborativă: conectarea (Google) | f97bf36e |
| VII | 19 Documente în echipă: partajare, roluri, comentarii | 655dac6b |
| VII | 20 Istoricul versiunilor; sugestii și comentarii | 587ac13c |
| VII | 21 Etică: hacker / cracker, frauda online | 982f3c6a |
| VIII | 17 Tabele și liste (19.10) | 8b317fa3 |
| VIII | 16 Paragrafe și imagini (6 judecăți) | fb75e3a1 |
| VIII | 18 Legături | 5b0aaec3 |
| VIII | 19 Formatarea cu style | 5c023ede |
| VIII | 20 Ce nu publici pe web | 9121dfd4 |
| VIII | 21 Mini-proiect: pagina web (proiectul notat) | 467ff040 |

**Simulatorul Scratch (componenta comună a clasei a VI-a) — reparat și publicat separat: b52018e3 (`scratch.js` 1.3).** Pe telefon: zona de cod nu mai fuge în lateral, degetul nu mai rupe programul, steagul nu se mai pierde, căsuțele și blocurile au acum zona de atingere ≥ 32 px (0 ținte mai mici, din 793). Verificat de un judecător independent pe toate cele 4 lecții care îl folosesc: 0 atingeri pe alt bloc din 75.295 (versiunea veche: 1.013). Contează pentru școala unde elevii lucrează doar pe telefoane.

## Am hotărât singur — le poți schimba
1. **A VII-a (aplicația colaborativă) = Google** (Drive, Documente, Prezentări) cu contul Google de la școală — din ce mi-ai spus pe 11.10 despre conturile Gmail ale elevilor.
2. **A VI-a (algoritmi) = Scratch online, în română, fără cont** — planificarea ta numește Scratch drept „mediul grafic interactiv”.
3. **A VIII-a, formatarea = atributul `style`** (ca jocul web-viii).
4. **V/17:** testul tău pentru unitate nu există → probă de antrenament pe C/B/A; „Ce face ursul iarna” e pe **alegere** (cu răspuns scris liber, sistemul fie primea răspunsuri opuse, fie respingea răspunsuri bune).
5. **VIII/18:** ca să încapă în oră, atelierul 1 e „pentru cine are timp” (pragul: cel puțin 35 de minute rămase).
6. **VII/19-20:** profesorul primește în documentul echipei rolul **Comentator**.
7. **VI/21:** schimbarea direcției în Scratch = **dublu clic pe 90** (probat în editorul adevărat; „clic + încă un clic” dă 9, nu −90).
8. **V/20:** ajutorul de la pasul 3 spune „până în colțul din dreapta-jos al pânzei”. Pe telefon, 11 tăieri din 12 ies din prima; a 12-a primește un mesaj adevărat și iese la a doua. Judecătorul a propus „dincolo de colț” (12/12 în simulator), dar n-am fotografiat ce face Paint-ul adevărat, așa că n-am schimbat.

## De cronometrat la clasă
- **VII/19, VII/20, V/20, V/21** încap în 50 de minute după metoda judecătorilor, dar la limită (49,5-49,9). Prima oră ținută cu ele spune sigur. Unde există pași „Dacă mai ai timp”, ei se sar primii.

## Întrebări pentru tine (când ai timp)
- VIII/21: **fișa ta de specificații pentru mini-proiect** nu există pe disc → tema și cele 8 cerințe sunt ale lecției („Excursia clasei în Retezat”); întrebările sunt în `lectii\viii\m3-l21\surse.md`, „Pentru profesor”.
- VI/20 și VI/21: **notațiile tale pentru pseudocod** (am folosit `pentru i ← 1, n execută … sfârșit pentru` și `cât timp … execută … sfârșit cât timp`).
- În toate lecțiile: bara de jos numerotează „La ce folosește” ca P1, deci „pasul 2” din text apare ca P3 în bară (la VI/20 a dus chiar la o trimitere greșită, reparată). Vrei să schimbăm numerotarea peste tot?

## O regulă nouă pentru standard (propunere)
- **Testul din simulator se uită la REZULTAT, nu la drumul elevului.** În tura asta, de trei ori (VIII/16, V/20 de două ori), un rezultat bun a fost respins pentru că elevul ajunsese la el pe alt drum, iar mesajul îl trimitea în buclă. La V/20 a rezolvat-o abia o reparare din temelie: testul se uită doar la poza finală, verificată de o probă independentă pe pixeli. Propun s-o trecem în `05_STANDARD_LECTIE.md`, lângă „mesajul spune numai ce e sigur adevărat”. Hotărăști tu.

## De făcut de tine (o singură dată)
- Patru dosare cu profiluri temporare de browser lăsate de judecători (`lectii\vii\m3-l19\_verificare\ab_sonnet\_prof_390`, `_prof_1280`, la fel în `vii\m3-l20`) conțin în căi numele contului Windows. **Nu sunt publicate** (dosarele `_verificare` sunt excluse din git), dar e bine să le ștergi: mie mi s-a refuzat ștergerea.

## Siguranța datelor (regula 27)
- Am găsit și **șters 11 fișiere** în care agenții salvaseră lista din panoul de activitate (cu nume de elevi), în dosarele de probă — **nepublicate** (excluse din git). La închidere: panoul are aceleași 2 rânduri „nu e în catalog” ca înainte de tură, **0 elevi de probă**; verificarea de date personale pe lecții = 0.

## Pentru componentele comune (de reparat cu poarta de lansare, altă dată)
- `browser-salvare.js` + `browser-siguranta.js` folosesc același stil (`bs-css`); `editorweb-schelet.js` acceptă conținut după `</body>`.
- Meniul Forme din V/19 iese 19 px din fereastră la 390 px.
- Motorul: bifele `.bifa-real` au 20×20 px (sub 32); după „Corect”, „Ia-o de la capăt” + o greșeală lasă textul „Corect!” lângă bifa roșie.
- V/12 trimite la lecția 1 cu `?vezi=p6/p7` (acum P8/P9).
- VII/18 (publicată): legătura „atelierul lecției” din laborator are 22 px pe telefon (reparată la VII/19-20; la VII/18 la următoarea republicare).
- `scratch.js`: Duplică pe telefon; o eroare în consolă la 1280 (câmp lăsat fără Enter + tragere din paletă); câmpul direcției din simulator primește taste după UN clic (Scratch-ul adevărat cere dublu clic).

Detaliile, oră cu oră: `04_ORCHESTRARE.md` (secțiunea 23→24.10.2026).
