# Caseta de exersare „intrarea cu cod” — GATA de folosit (16.10.2026)

Proprietar: autorul lecției V/1 (lucrarea `_campaign\revizuire_completa_2026_09\v1_cu_cod_2026_10_16`).
Pentru lecțiile 1 ale claselor V, VI, VII, VIII. Ce vă lipsește: scrieți în `surse.md` și în răspuns (`"cereri_api"`); dirijorul aduce cererea la proprietar. Nu modificați cele 3 fișiere.

| Componenta | Fișierul | sha1 (16.10.2026 b, după reparație) | sha1 vechi (16.10.2026, dimineața) |
|---|---|---|---|
| Caseta de exersare | `lectii\_sim\intrare-cod.js` | `dda2f2523d07cd04d9e243b471c86e14017cd5be` | `c8c6b4ae9688afa57e196f84275f616cc4931c9d` |
| Unealta de capturi | `lectii\v\m1-l01\_proba\captura_casete_cod.py` | `8f8eae43c4ca43ebcf15ff879472943de29f9f94` | `435973bfed0df4695f79b84648ceb706013de8fc` |
| Proba textelor (R2) | `lectii\_sim\_teste\intrare_cod_texte.py` | `0b18b35fbfdd6034a4ea9f5a0c62e913f1a33e44` | `178afd8a2ab18558aa3e51b1a585c3a48cf07ce6` |
| (proba casetei) | `lectii\_sim\_teste\intrare_cod_proba.py` + pagina `intrare-cod-proba.html` | `52af7759daabc42476e622ed6a8d47413dc9892f` · `4834fe86487dc252dda45adf01c9fb076616f0b6` | `329e8528…` · `bf2eda8b…` |

Totul e probat pe `assets\js\prezenta.js` sha1 `8e852437fb1748289eb8ef901f3063172418466d` și `jocuri\_motor\motor.js` sha1 `bb1e2f7551cb7d898b3f7d26d4c8a91fda24e73a`.
Dacă se schimbă prezenta.js, rulați din nou cele două probe (ultima linie 0) înainte de publicare.

**16.10.2026 b — ce s-a schimbat (API-ul e același; exercițiile voastre merg fără nicio schimbare):**
- după judecata casetei (`…\judecata_caseta\judecator1.md`): **P1** „Scoate-mă din lista calculatorului” nu mai e socotit „Ieși” (Nu încă, cu motivul); **P2** Enter în „Păstrează progresul online” nu mai face nimic, ca în caseta adevărată; **P3** înscrierea cu o greșeală reparată apoi cu „Mi-am scris greșit…” nu mai e „a doua înscriere”; **P4** eticheta arată numele cum a fost TASTAT în formular; **P5** după „Ieși” → „Intră”, cine era conectat e primul în listă; **P8** „Verifică” apăsat imediat după „Intră” / „Trimite” așteaptă acțiunea (nu mai spune „Nu încă”); **P6** proba textelor caută doar în textele afișate, cu locul lor (§3).
- după registrul comun: **C10** chenarul scrie „Exersare: o copie a casetei de jos. Nu e caseta adevărată: …”, iar mesajele spun „eticheta din exersare”; **C6** nota de la `acasa` spune „Doar în exersare: …” și numește semnul de pe site, „Continuă de unde ai rămas” (mesajul „☁ A venit progresul…” nu exista în caseta adevărată); intrarea pe numele colegului trimite la „Nu ești tu? Schimbă elevul”, ca în caseta adevărată.
- NOU, opțional: `elev:{…, faraCod:true}` (elevul tău în listă fără cod); unealta de capturi: `--numar-de-la`, `--nume-montaj`.
- C21 („a doua înscriere acasă”, altă clasă) se face fără stare nouă: `start:'eticheta'` + `scris:{clasa:'5 M'}` (ținta: corectura). Exemplu: lecția V/1, `COD_ACASA_GRESIT`.
- Probele: `intrare_cod_proba.py` → **211 verificări, 0 picate** (era 195; +8 drumuri noi D la fiecare lățime); `intrare_cod_texte.py` → 0 pe toate 4 lecțiile; `--mutant` → 13/13.
- **Atenție în textele lecțiilor:** dacă cerința unui exercițiu spunea „caseta de jos” pentru exersare, schimbați în „chenarul de exersare” (JC1-05 / C10).

---

## 1. Caseta de exersare (`intrare-cod.js`)

**Ce e.** Un „Încearcă” de APLICARE: elevul face gesturile adevărate (apasă pe numele lui, scrie codul, „Intră”, eticheta, „Ieși (deconectare)”, „Mi-am uitat codul”…) într-o copie a casetei de jos, desenată în exercițiu. Aceleași texte (copiate literă cu literă din prezenta.js), aceeași ordine, aceleași butoane, aceleași reguli (codul de exact 4 cifre, cele două coduri la fel, 5 coduri greșite la rând = 30 de secunde de pauză, pe orice nume). Deasupra ei: „caietul” elevului inventat (numele, clasa, codul) și rândul „Exersare: o copie a casetei de jos. Nu e caseta adevărată: aici nu se salvează nimic și nu pleacă nimic la profesor.” (16.10 b; înainte: „Exersare: caseta de jos, ca pe calculator…”, care numea două lucruri — judecata cod 1, JC1-05 / C10). În lecții, spuneți „chenarul de exersare” / „eticheta din chenar”, nu „caseta de jos”.

**Izolată (R4, probat):** nu cheamă `window.Prezenta`, nu citește și nu scrie localStorage / sessionStorage / cookie, nu trimite nicio cerere. Starea stă în memorie și se pierde la „Încă un exercițiu” sau la reîncărcare.

### Cum o pui în lecție
```html
<script src="../../../jocuri/_motor/motor.js"></script>
<script src="../../_sim/intrare-cod.js"></script>
<script>
JocMotor.porneste({ …,
  tipuri:{'intrare-cod':SimIntrareCod.intrare /*, ale tale */}
});
</script>
```
În pas: `incearca:{t:'intrare-cod', q:'cerința', start:'…', elev:{…}, cod:'…', …, ajutor:'…', why:'…'}` (și în `inca:[…]`).
Motorul pune singur „Verifică”, „Nu încă”, indiciul după prima greșeală, „Arată-mi răspunsul” după două (caseta trece atunci în starea bună și spune drumul), „Încă un exercițiu”.

### Câmpurile exercițiului
| Câmp | Ce e | Implicit |
|---|---|---|
| `start` | starea de pornire (vezi mai jos) | `'lista'` |
| `elev` | `{nume, clasa, scoala?, faraCod?}` — elevul INVENTAT din exercițiu. `faraCod:true` (16.10 b) = elevul TĂU e în listă fără cod (înscris înainte de coduri): numele lui → „Alege-ți codul (4 cifre)” + „Scrie-l încă o dată”. `clasa` exact ca în lista școlii (`'5 AM'`, `'6 A'`, `'7 MA'`, `'8 A'`, la Tupilați `'V'`…); `scoala` = cheia (`brauner`, `tupilati`, `tibucani`, `dumbrava`, …) | `{clasa:'5 AM', scoala:'brauner'}` |
| `cod` | codul din „caiet” (4 cifre, ca text: `'3946'`) | lipsă = „încă nu l-ai ales” |
| `colegi` | `[{nume, clasa?, cod?, faraCod?}]` — alte nume din listă. Primul coleg stă în listă DEASUPRA elevului (copilul care apasă primul nume greșește) | `[]` |
| `pe` | la `eticheta` / `meniu` / `intreaba`: cine e conectat acum (numele unui coleg = colegul a uitat să iasă) | elevul |
| `scris` | `{nume?, clasa?}` — cum apare elevul în listă, scris greșit (pentru corectură) | — |
| `tinta` | ce trebuie să ajungă să facă: `'intrat'`, `'reintrat'` (iese și intră din nou cu codul), `'iesit'`, `'schimbat'`, `'cerere'`, `'online'`, `'corectat'`, sau o listă în ordine: `['iesit','intrat']`, `['cerere','intrat']` | după `start` (tabelul de mai jos) |
| `deblocat` | `true` = după „Trimite cererea”, exersarea face ce face profesorul în panou („Deblochează”): codul nou intră, cel vechi primește „Codul ăsta nu mai e bun: profesorul te-a deblocat cu un cod nou. Intră cu codul nou.” | `false`: codul nou primește „Profesorul nu te-a deblocat încă. Intri cu codul nou după ce te deblochează.”, cel vechi încă intră |
| `ajutor`, `why`, `q` | ca la orice exercițiu al motorului | — |

### Stările de pornire, cu câte un exemplu complet
Numele de mai jos sunt cele din capturi (inventate, nefolosite în probele vechi): elevul **Stanciu Iarina**, colegii **Doroftei Horia** (cu cod) și **Varlam Sânziana** (fără cod). Puteți folosi altele (inventate!), dar atunci rulați și unealta de capturi cu ele (`--elev`, `--coleg`, `--coleg2`), ca poza să spună aceleași nume ca pagina.

```js
const ELEV={nume:'Stanciu Iarina',clasa:'5 AM'};
const COLEGI=[{nume:'Doroftei Horia'},{nume:'Varlam Sânziana',faraCod:true}];

// 1. calculator nou: „Spune cine ești” → „Cine ești?” → Gata. Elevul își ALEGE codul (apare apoi în „caiet”). Ținta: 'intrat'.
{t:'intrare-cod',start:'nou',elev:ELEV,q:'Calculator nou. Înscrie-te: școala, clasa, numele ca în catalog și un cod ales de tine. Apoi „Verifică”.',
 ajutor:'Apasă „Spune cine ești”.',why:'…'}

// 2. acasă / pe telefon: tot calculator nou, dar cu codul din caiet. Corect doar cu ACEEAȘI școală, clasă, nume și cod
//    (nota exersării spune atunci „Doar în exersare: … Pe site, … apare „Continuă de unde ai rămas”…”; 16.10 b: mesajul vechi
//    „☁ A venit progresul…” nu există în caseta adevărată — C6). Ținta: 'intrat'.
{t:'intrare-cod',start:'acasa',elev:ELEV,cod:'3946',q:'Ești acasă, pe telefon. Intră așa încât să-ți vină progresul de la școală.',ajutor:'…',why:'…'}

// 3. lista „Cine lucrează acum?” (codul din caiet). Ținta: 'intrat'.
{t:'intrare-cod',start:'lista',elev:ELEV,cod:'3946',colegi:COLEGI,q:'Intră pe numele tău, cu codul din caiet.',ajutor:'…',why:'…'}

// 4. „Salut, X!” deja deschis (cere codul). Ținta: 'intrat'.
{t:'intrare-cod',start:'salut',elev:ELEV,cod:'3946',colegi:COLEGI,q:'Scrie codul și intră.',ajutor:'…',why:'…'}

// 5. conectat; eticheta „Profesorul vede activitatea ta · Iarina S.” jos. Ținta implicită: 'iesit'.
{t:'intrare-cod',start:'eticheta',elev:ELEV,cod:'3946',colegi:COLEGI,tinta:'reintrat',
 q:'Ieși de pe calculator, apoi intră din nou pe numele tău, cu codul.',ajutor:'…',why:'…'}
//    colegul a uitat să iasă (intrarea pe numele colegului):
{t:'intrare-cod',start:'eticheta',pe:'Doroftei Horia',elev:ELEV,cod:'3946',colegi:COLEGI,tinta:['iesit','intrat'],q:'…',ajutor:'…',why:'…'}
//    lasă calculatorul următorului elev: tinta:'schimbat' („Nu ești tu? Schimbă elevul” sau „Ieși (deconectare)”)

// 6. meniul etichetei, deschis. Ținta implicită: 'iesit'.
{t:'intrare-cod',start:'meniu',elev:ELEV,cod:'3946',colegi:COLEGI,q:'Pleci de la calculator. Ieși.',ajutor:'…',why:'…'}

// 7. cod uitat: „Salut, X!”, iar caietul spune „nu-l mai găsești în caiet”. Ținta implicită: 'cerere'.
{t:'intrare-cod',start:'uitat',elev:ELEV,cod:'3946',colegi:COLEGI,q:'Nu mai găsești codul. Cere unul nou.',ajutor:'…',why:'…'}
//    cu ce face profesorul după (deblocarea):
{t:'intrare-cod',start:'uitat',deblocat:true,tinta:['cerere','intrat'],elev:ELEV,cod:'3946',colegi:COLEGI,q:'…',ajutor:'…',why:'…'}

// 8. ai lucrat fără cod: conectat FĂRĂ cod; meniul spune „Progresul tău stă doar pe calculatorul ăsta.” → „Păstrează-l online”.
//    Ținta implicită: 'online'. (Fără `cod`: elevul alege codul; apare în caiet.)
{t:'intrare-cod',start:'fara-cod',elev:ELEV,colegi:COLEGI,q:'Ai lucrat până acum fără cod. Păstrează-ți progresul online.',ajutor:'…',why:'…'}

// 9. „Ești tot X?” (după 90 de minute). Cu pe: colegul → răspunsul bun e „Nu, sunt alt elev”, apoi numele tău. Ținta: 'intrat'.
{t:'intrare-cod',start:'intreaba',pe:'Doroftei Horia',elev:ELEV,cod:'3946',colegi:COLEGI,q:'…',ajutor:'…',why:'…'}

// 10. „Nu e nimeni conectat · Intră”. Ținta: 'intrat'.
{t:'intrare-cod',start:'nimeni',elev:ELEV,cod:'3946',colegi:COLEGI,q:'…',ajutor:'…',why:'…'}

// numele scris greșit în listă → corectura („Mi-am scris greșit numele, clasa sau școala”). Ținta implicită: 'corectat'.
{t:'intrare-cod',start:'lista',elev:ELEV,cod:'3946',scris:{nume:'Stanciu Irina'},colegi:COLEGI,q:'…',ajutor:'…',why:'…'}
```

### Ce spune „Verifică” (exersarea) — cele mai scurte mesaje
- Pe numele colegului: „Acum lucrezi pe numele: X. Nu e numele tău. Profesorul ar vedea munca ta la colegul tău. Apasă eticheta din exersare, apoi „Nu ești tu? Schimbă elevul”, și intră pe numele TĂU.” (16.10 b: ca în caseta adevărată, unde „Nu ești tu? Schimbă elevul” deschide lista; era „Ieși (deconectare)”)
- „Scoate-mă din lista calculatorului” în loc de „Ieși (deconectare)” (16.10 b, judecata casetei P1): „Nu încă. Ai apăsat „Scoate-mă din lista calculatorului”. Pe calculatorul adevărat, așa numele tău nu mai apare în listă. Ca să pleci, apeși „Ieși (deconectare)”.” (înainte era socotit „Ieși” și dădea Corect)
- Toate mesajele exersării spun acum „eticheta din exersare”, nu „eticheta de jos”.
- A doua înscriere („Nu sunt în listă” cu altă clasă / numele scris altfel / altă școală): „Ai făcut a doua înscriere: aceeași persoană, dar altă clasă (5 M). Profesorul ar vedea doi elevi în loc de unul.”
- Cod nou cerut fără motiv (codul e în caiet): „Ai cerut un cod nou, deși codul tău e în caiet. Nu-ți schimba codul în timpul orei: intră cu codul din caiet.”
- Altfel: ce lipsește (n-ai intrat, încă ești conectat, n-ai intrat din nou, n-ai trimis cererea, n-ai păstrat online, progresul de acasă nu a venit).
Toate textele exersării (nu ale casetei) stau în `SimIntrareCod.CADRU`. Textele casetei: `SimIntrareCod.TEXTE`.

### Pentru poarta `test_joc.py`
`rezolva()` pune caseta în starea-țintă; `gresit()` pune o greșeală tipică (pe numele colegului; fără colegi: a doua înscriere, cu altă clasă; la ieșire: rămas conectat). Poarta verifică „Corect” / „Nu încă”. Probat pe toate cele 16 exerciții ale paginii-probă, la 1280 și la 390.

### ATENȚIE pentru textul lecției (din caseta adevărată)
- **Codul NU e ascuns peste tot.** Se tastează ascuns (puncte) doar în „Salut, X!”, „Mi-am uitat codul” și la corectură. În formularul „Cine ești?” („Codul tău secret, 4 cifre (scrie-l în caiet)”) și în „Păstrează progresul online” cifrele SE VĂD (vezi `cod-cine-esti-completat.webp`). Nu scrieți „codul se vede ca puncte” la prima înscriere; scrieți „ai grijă să nu se uite colegul când îl scrii”.
- În lecții, butoanele gri ale casetei („Mai târziu”, „Închide”, „Bine”, „← Înapoi la listă”…) sunt cât toată caseta de late (regula `.g` din motor.css); pozele sunt făcute tot așa, ca în lecție.
- Eticheta arată numele SCURT: „Profesorul vede activitatea ta · Iarina S.” (prenumele + inițiala). „Ești înscris ca …”, „Salut, …!”, „Ai ieșit, …” arată numele întreg.
- După „Intră” sau „Gata”, pagina adevărată se poate reîncărca singură (ca să-ți aducă progresul). Exersarea nu se reîncarcă.

---

## 2. Unealta de capturi (`captura_casete_cod.py`)
Pornește caseta ADEVĂRATĂ de azi (prezenta.js de pe disc) pe un server LOCAL fals (127.0.0.1), pe o pagină goală cu stilul motorului (ca în lecții), o aduce cu gesturi reale în 20 de stări și o fotografiază. Tot ce nu e 127.0.0.1 e oprit și numărat; nimic nu ajunge la profesor.

```
python C:/00/Projects/LearningHub/lectii/v/m1-l01/_proba/captura_casete_cod.py --clasa VI --iesire C:/00/Projects/LearningHub/lectii/vi/m1-l01/img
```
Opțiuni (16.10 b, noi și compatibile: `--numar-de-la N` = montajul numerotează de la N; `--nume-montaj F` = alt nume decât casete-cod.webp; așa o lecție pune două montaje la rând, 1-3 și 4-7): `--elev "Nume Prenume"` `--coleg "…"` (cu cod) `--coleg2 "…"` (fără cod) · `--scoala brauner` `--clasa-exacta "6 A"` (implicit: V = 5 AM, VI = 6 A, VII = 7 MA, VIII = 8 A, toate la brauner) · `--doar lista,salut` · `--montaj lista,salut,meniu,iesit` (ordinea din montaj) sau `--fara-montaj` · `--telefon` (și ecranul întreg al telefonului, 390 px, atingere) · `--fara-poze` · `--fara-surse` · `--texte <fișier.json>`.
Durează ~1 minut (cu `--telefon` ~2). Ultima linie = probleme (0 = bine).

**Fișierele** (în `--iesire`), `cod-<stare>.webp`, toate la aceeași scară (1 px de pe ecran = 1,36 px în poză), sub 150 KB:

| Fișier | Ce arată |
|---|---|
| `cod-intrebare.webp` | calculator nou: „Lucrezi pentru ora de informatică? Spune cine ești…”, cu „Nu, doar vizitez” |
| `cod-vizitator.webp` | eticheta „Sunt elev — mă înscriu” |
| `cod-cine-esti.webp` | formularul „Cine ești?” gol |
| `cod-cine-esti-completat.webp` | formularul completat (școala, clasa, numele, codul — codul SE VEDE) |
| `cod-lista.webp` | „Cine lucrează acum?” cu cei trei elevi (doi cu ☁) |
| `cod-salut.webp` | „Salut, X! (clasa)”: „Codul tău (4 cifre)”, „Intră”, „← Înapoi la listă”, „Mi-am uitat codul” |
| `cod-gresit.webp` | „Cod greșit. Mai încearcă.” |
| `cod-ultima-incercare.webp` | „Cod greșit. Mai ai o încercare, apoi urmează o pauză de 30 de secunde.” |
| `cod-pauza.webp` | „Așteaptă 30 s” + „Ai greșit codul de 5 ori la rând. Mai încearcă peste 30 de secunde.” |
| `cod-eticheta.webp` | „Profesorul vede activitatea ta · Iarina S.” + „Ieși” |
| `cod-meniu.webp` | meniul etichetei (cu cod: ☁ …) |
| `cod-corectura-cod.webp` | „Corectează ce ai scris greșit · X (clasa)”: întâi codul |
| `cod-iesit.webp` | „Ai ieșit, X. Data viitoare îți cer codul.” + „Intră” / „Bine” |
| `cod-nimeni.webp` | „Nu e nimeni conectat · Intră” |
| `cod-uitat.webp` | „Mi-am uitat codul · X (clasa)”: codul nou de două ori, „Trimite cererea” |
| `cod-cerere.webp` | „Cererea a ajuns la profesor. După ce te deblochează, intri cu numele și codul nou.” |
| `cod-salut-fara-cod.webp` | „Salut, X!” la un elev fără cod: „Alege-ți codul (4 cifre)” + „Scrie-l încă o dată” |
| `cod-meniu-fara-cod.webp` | meniul la un elev fără cod: „Progresul tău stă doar pe calculatorul ăsta.” + „Păstrează-l online” |
| `cod-pastreaza.webp` | „Păstrează progresul online” |
| `cod-intreaba.webp` | „Ești tot X (clasa)?” cu „Da, sunt eu” / „Nu, sunt alt elev” |
| `casete-cod.webp` | montajul (implicit: lista, salut, meniu, iesit), numerotat 1-4 în cercuri roșii |
| `cod-<stare>-telefon.webp` | (cu `--telefon`) ecranul întreg al telefonului, 600 px lățime |

Scrie și rândurile în `<iesire>\SURSE.json` (înlocuiește doar rândurile cu același `fisier`; „captură din LearningHub: caseta de jos (assets/js/prezenta.js, sha1 …)”, numele inventate, cum s-a făcut). **Ștergeți pozele pe care nu le folosiți** (și rândurile lor din SURSE.json). Textul fiecărei stări merge în `--texte` (implicit lângă unealtă, `casete_cod_<CLASA>.json`).
Probat pe 16.10: V → `lectii\v\m1-l01\img\` (0 probleme); VIII, cu `--telefon` → `lectii\v\m1-l01\_proba\capturi_viii_proba\` (0 probleme, 41 de poze, clasa 8 A).
(16.10, etapa 2 a V/1: în `lectii\v\m1-l01\img\` au rămas doar pozele folosite, `casete-cod.webp` și `casete-cod-uitat.webp`; setul întreg al clasei V, cu `cod-cine-esti-completat.webp`, e în `lectii\v\m1-l01\_proba\capturi_p3\`. Un al doilea montaj se face rulând unealta cu alt `--iesire` și alt `--montaj`, apoi copiind `casete-cod.webp` sub alt nume, cu rândul lui din SURSE.json — fără nicio schimbare în unealtă.)

---

## 3. Proba textelor (`intrare_cod_texte.py`, R2)
```
python C:/00/Projects/LearningHub/lectii/_sim/_teste/intrare_cod_texte.py --lectie vi/m1-l01
python C:/00/Projects/LearningHub/lectii/_sim/_teste/intrare_cod_texte.py            (toate 4)
python C:/00/Projects/LearningHub/lectii/_sim/_teste/intrare_cod_texte.py --mutant   (proba probei)
```
Ultima linie = numărul de nume negăsite (0 = bine); la `--mutant`, mutanții scăpați (0 = bine).
- **T**: fiecare text al casetei de exersare (`TEXTE`) se găsește în prezenta.js (16.10: 113 texte, 134 de bucăți, 0 negăsite). **S**: copia școlilor = `diplome-date.js` (da).
- **16.10 b (judecata casetei P6):** textele se caută DOAR în literalele de șir din prezenta.js / motor.js (comentariile și expresiile regulate sunt sărite; literalele lipite cu „+” se lipesc). **T'** (locul): un text pe care exersarea îl arată în funcția F (randeaza, meniu, alege, eSunt, uitat, cereCod, corecteaza, formular…; `gata()` = `formular()`) trebuie să fie, în prezenta.js, tot în funcția F (138 de bucăți, 0 negăsite; excepțiile din `LOC_ALTFEL`, cu motivul: notele NOTA / NOTA_NOTA, puse din variabile comune). **R** (regulile): 5 coduri greșite, pauza de 30 s, exact 4 cifre în „Salut, X!”, cifrele ascunse în `input.cod` — la fel în cele două casete. Pe cei 12 mutanți ai judecătorului casetei (`judecata_caseta\mutanti.py`, partea a): 10 prinși (toți 6 de text + 4 de reguli); scapă M6 (ordinea butoanelor din meniu) și M11 (Enter): pe acelea le prinde diferențialul judecătorului (`scenarii.py`) și, pentru Enter, `intrare_cod_proba.py`. Proba: `_teste\_iesiri\mutanti_judecator_texte.py` (ultima linie = mutanți de TEXT scăpați: 0).
- **L — cum intră pasul vostru în probă: SINGUR.** Proba deschide lecția (servită local, rețeaua oprită), citește configurația (`JocMotor.test.config()`) și ia: (1) fiecare pas care are în `incearca` sau `inca` un exercițiu `t:'intrare-cod'` (textul, „Uite cum”, „Altfel”, cerințele, indiciile, explicațiile); (2) toți pașii din `aplicatieReala.pasi` („Acum la calculatorul din laborator”); (3) introducerea; (4) întrebările care conțin „cod”. Orice text dintre „…” trebuie să se găsească în prezenta.js sau în motor.js. Numele inventate din exercițiile `intrare-cod` ale lecției (și cele din capturi), forma scurtă („Iarina S.”) și „…” sunt locuri pentru date: se caută bucățile dintre ele. Deci scrieți „Ai ieșit, Stanciu Iarina. Data viitoare îți cer codul.” sau „Ești tot …?”, nu o parafrază.
- **Excepții** (un text între ghilimele care NU e nume de buton sau mesaj, ex. titlul din caiet „Unde sunt:”, un nume de pe pagina clasei „Modulul 1”): în dosarul vostru, `lectii\<clasa>\m1-l01\_proba\intrare_cod_exceptii.json` = `{"Unde sunt:": "titlul scris în caiet, nu e buton"}` (cheia = textul exact dintre ghilimele). Fiecare excepție cu motivul ei; judecătorul le citește.
- `--tot` = toată lecția; `--strict` = o lecție fără pas `intrare-cod` se numără. Textele îngroșate (`<b>…</b>`) negăsite din pasul cu codul apar ca „atenție” (nu se numără).
- Mutanții (16.10 b): 13 din 13 prinși (un buton și un mesaj schimbate în casetă, o clasă schimbată în copia școlilor; pe o COPIE a prezenta.js: un text unic, „Mi-am uitat codul” schimbat doar în „Salut, X!”, „Cele două coduri nu sunt la fel” schimbat doar în „Salut, X!”, butonul „Nu ești tu? Schimbă elevul” schimbat cu textul vechi rămas în comentariu, „intră cu alt cod”, „Cod greșit.”; un pas corect = 0, un buton / un mesaj / o literă fără diacritic greșite în lecție).
- Starea de azi (16.10, înainte de pașii noi): V 0; VI 6, VII 0 (2 excepții), VIII 6 — toate în pașii vechi din laborator (titluri din caiet, „Modulul 1”, „Laborator”), nu în casetă.

## 4. Proba casetei (`intrare_cod_proba.py`)
```
python C:/00/Projects/LearningHub/lectii/_sim/_teste/intrare_cod_proba.py      (~6 min; --vp 1280 --fara-pauza = ~2 min)
```
16.10 b: **211 de verificări, 0 picate** (dimineața: 195) (`_teste\_iesiri\proba_final.txt`, `intrare_cod_proba.json`):
- F: 20 de stări × 2 dimensiuni — textul casetei de exersare = caseta adevărată, bucată cu bucată (texte, butoane, câmpuri ascunse sau nu, liste);
- D: drumurile copilului (3 cifre; greșit 1-4 cu mesajele exacte; al 5-lea = „Așteaptă 30 s”; pauza ține pe alt nume și după „← Înapoi la listă”; după 30 s „Intră” revine; codul tău pe numele colegului = „Cod greșit”; colegul fără cod revendicat → „Nu încă”; a doua înscriere cu altă clasă → „Nu încă”; ieșire + întoarcere; „Schimbă elevul”; colegul rămas conectat; cererea înainte și după deblocare; „Păstrează-l online”; corectura; „Ești tot …?”; acasă cu alt cod / cu același cod; „Jurnalul meu” nu pleacă din pagină; Enter);
- P: `rezolva()` → Corect și `gresit()` → Nu încă la toate cele 16 exerciții;
- I (R4): **0 chei `lh_*` schimbate, 0 citiri/scrieri de stocare și 0 cereri cu intrare-cod.js pe stivă, `window.Prezenta` neatins, 0 cereri spre /api cât lucrează caseta**; la fel cu un elev adevărat conectat (prezenta.js activ), care rămâne conectat;
- A: la 390 px nicio derulare laterală, butoanele ≥ 32 px; E: 0 erori, 0 cereri spre afară.

---

## 5. Limitele: ce NU imită caseta de exersare
1. Locul și forma: stă în exercițiu, nu fixată jos; nu se strânge la primul gest, nu are forma mică („mini”) și nu se ferește de butoane; pe telefon nu se derulează în ea (curge cu pagina).
2. Serverul: nu întreabă serverul. Imită doar „Cod greșit” (cu pauza), „Codul ăsta nu mai e bun…” (după `deblocat`) și „Profesorul nu te-a deblocat încă…”. NU imită: fără internet („Nu pot verifica acum codul…”, „Cererea nu a plecat…”), „Profesorul a respins cererea…”, „Pe datele astea nu se mai intră…”, prea multe cereri (429), sertarele vechi fără amprentă (GRAV-1/2), erorile corecturii pe server. „Trimite cererea” reușește mereu.
3. Progresul: nu aduce și nu duce nimic; nu reîncarcă pagina după intrare. La `acasa`, nota exersării spune „Doar în exersare: …” și numește semnul de pe site („Continuă de unde ai rămas”).
4. „Altă școală”: primește datele, dar nu recunoaște școala scrisă de mână (caseta adevărată spune „Școala ta e în listă: … Am ales-o mai sus…”).
5. „Ești tot X?”: nu apare singură după 90 de minute (doar ca stare de pornire) și nu are a doua întrebare („Cât stătea întrebarea, pe calculatorul ăsta s-a lucrat…”).
6. Pauza de 30 s ține doar în exercițiul deschis (cea adevărată ține și după reîncărcare, pe tot calculatorul).
7. „Jurnalul meu” nu se deschide (nota exersării spune de ce).
8. Codurile stau în memorie ca atare (cea adevărată ține doar amprenta); copilul nu vede diferența.
9. Lista școlilor: `window.DIPLOME` dacă e deja în pagină, altfel copia (probată egală cu `diplome-date.js`).
