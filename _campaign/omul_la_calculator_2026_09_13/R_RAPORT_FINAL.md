# Omul la calculator — raportul final (13.09.2026)

> **Cererea ta:** ce verifică un specialist uman când lucrează la calculator; ia lecțiile din modulul curent de TIC,
> una câte una, și vezi ce lipsește și ce ar trebui altfel; învață din asta evaluarea „umană” și fă AI-ul să sară mai puțin.
>
> **Ce s-a făcut:** cercetare cu surse (7 meserii + știința expertizei) → **25 de lecții M1** (V: 6 · VI: 6 · VII: 6 · VIII: 7),
> fiecare evaluată de un agent care a *făcut* sarcina (documente Word/Excel/PowerPoint construite, recalculate, randate; pagina
> parcursă în browser ca un elev) → **261 de semnalări**, toate trecute printr-o poartă mecanică → 4 judecători orbi → un test
> de remediere → verificare adversarială a celor mai grave. Nicio lecție de pe site n-a fost modificată.

---

## 1. Ce am învățat despre „AI-ul sare” — măsurat, nu presupus

**Descoperirea principală: „a sări” are două axe, iar AI-ul le schimbă una pe alta.**

| Metodă (aceleași 4 lecții, verificate de 4 judecători independenți) | Importante prinse | Care schimbă ora | False |
|:--|--:|--:|--:|
| AI obișnuit („citește lecția și spune ce lipsește”) | 90% | 88% | 4 |
| „Omul la calculator” v2 — face sarcina, dovezi pe disc, poartă | 76% | 84% | **0** |
| **Hibrid v3 — citește TOT (hartă cu fiecare element), APOI face** | **89%** | **94%** | 4, **+27 probleme reale noi** |

- Pus să **dovedească**, AI-ul **a citit mai puțin** (v2: zero greșeli, dar a ratat probleme importante).
- Lăsat să **citească**, AI-ul **a afirmat din memorie** (controlul: 4 afirmații false, între ele chiar „Excel în română are funcțiile SUMA, MEDIE” — fals).
- **Remedierea care a mers:** două treceri cu buget separat — întâi o hartă de acoperire în care fiecare pas/exercițiu/rezolvare are un rând (rând gol = gaură), apoi „omul la calculator” pe tot ce contează. A găsit ce nu vede nimeni citind: calculatorul comun (elevul următor vede răspunsurile colegului), tabelele desenate care pe ecran nu sunt tabel, orice text scris primit ca răspuns corect, rezolvarea-model care încalcă regula lecției.

**Cele 5 lecții despre AI care au costat dovezi false azi (toate au intrat în reguli):**
1. **AI-ul își ia norma din document, omul o aduce din afară.** Auditul vechi (464 de agenți) a văzut că lecțiile n-au diacritice și a recomandat să fie scoase și din singurul loc unde erau „pentru consecvență” — deși specificația le cere. Toate cele 25 de lecții M1: 0–1,6 diacritice la 1.000 de litere (text românesc normal: 40–60).
2. **WebFetch nu e sursă** — dă rezumatul unui model mic, care a inventat nume de meniuri („Titlu 1”, „Creare document PDF/XPS”). Citatele se iau din textul brut al paginii.
3. **Mediul greșit inventează defecte:** pagina deschisă de pe disc a raportat o resursă „lipsă” care exista (am greșit chiar eu în pilot); LibreOffice pornit în paralel a pierdut 5 din 6 conversii cu „succes”.
4. **Poarta scrisă de autor are orbirile autorului:** prima mea poartă a trecut o evaluare făcută fără muncă (dovadă: `explorer.exe`). Doar un verificator independent a găsit-o.
5. **O constantă neverificată devine adevăr impus:** ritmurile de citire provizorii puse de mine în poartă au umflat gravitatea — din 16 „blocante”, verificatorul a lăsat 5 (vezi §3).

**Cum rămâne în sistem:** skill-ul **`/omul-la-calculator`** (`C:\00\AI_0\.claude\skills\omul-la-calculator.md`) — cele două treceri + capcanele de mai sus, pentru orice evaluare a unui lucru făcut pentru oameni. Protocolul complet pentru lecții: `P_protocol_hibrid_v3.md`.

---

## 2. Ce lipsește în M1 și ce trebuie altfel — pe tot modulul

Ordinea = cât schimbă ora. Fiecare punct are dovezi în `F_evaluari\<clasa>\<lectia>\05_evaluare.md`.

1. **Lecțiile nu urmează orele din planul tău 2026-2027.** Aproape fiecare lecție ia din 2–3 ore; unele ore n-au lecție (V: dispozitivele I/O și stocarea; VII: imaginea, copierea/mutarea, regulile de tehnoredactare, mini-proiectul), iar la VIII lecțiile 4–7 se țin abia în noiembrie–decembrie. **Harta fișier ↔ oră trebuie refăcută înainte de orice reparație de text.**
2. **Lecțiile sunt prea lungi pentru o oră** (2.200–8.400 de cuvinte; specificația cere 4–8 pași, unele au 10–11). La un ritm prudent unele încap strâns, dar **5 nu se pot ține deloc așa**: posterul de la a V-a (exercițiul minim scrie singur 120 de minute; editorul grafic se predă abia la ora 18), paragrafele și tabelele de la a VII-a, evaluarea de la a VII-a (nu e test: n-are barem, arată răspunsul corect).
3. **Rezolvările, tabelele-model și indiciile sunt greșite când le faci efectiv** — cel mai grav la Excel: rezolvările altor exerciții (VIII L1), media calculată greșit pentru 14 din 15 elevi fără nicio eroare afișată (VIII L6), tabelul-model de sortare cu rândurile rupte — exact greșeala predată (VIII L7), adrese de celule decalate (VIII L4), explicația „fără `$` iese celulă goală” când de fapt iese un număr greșit care arată normal (VIII L3). La PowerPoint: efecte care nu există („Fade Out”), categorii amestecate, o rezolvare care învață fals despre temporizare. La V: provocarea cu fișiere nu se poate termina cum e scrisă; rezolvarea contrazice lecția (antivirusul).
4. **Presupun un laborator pe care nu-l știm și ignoră Izvoare.** Toate meniurile doar în engleză (Word ro: „Pornire”, „Inserați”); zecimale cu punct (pe Windows în română „7.2” devine dată → grafice cu bare de 46.000); nicio variantă pe hârtie, deși la Izvoare ipoteza e că nu există laborator; aproape nicio imagine/captură (inclusiv „uită-te la imaginile de mai jos” fără imagini).
5. **Lucrul elevului nu are unde să stea:** nicio lecție nu spune unde se salvează; răspunsurile „salvate” rămân în browserul calculatorului și le vede următorul copil; fișiere cu același nume se suprascriu între clase.
6. **Sfaturi de specialist depășite sau traduse greșit:** „20 de pași” (sursa spune 20 de *picioare*), „3 GHz = 3 miliarde de operații”, parola „minim 8 caractere + amestec” (ghidul actual NIST: 15, fără reguli de amestec), TVA 19% (azi 21%), scurtături Word predate ca Excel (Ctrl+L/E/R), Ctrl+Alt+V schimbată în Word 2024/365, Ctrl+A „selectează tabelul” (selectează tot documentul).
7. **Întrebările stau lângă pasul greșit:** la PowerPoint 5 din 6 lecții, la Excel 4 din 7 — copilul e întrebat ce se predă abia la pașii următori, iar răspunsul se blochează.
8. **Evaluarea nu e aplicabilă:** proiectele n-au barem cu puncte, deși ai deja `Info_Gimnaziu_2026\instrumente\Grila_produs.md` și nivelurile din O. 4.615/2026.
9. **Norma limbii:** zero diacritice în toate 25, inclusiv în textul pe care îl tastează elevul și în lecția despre ordinea alfabetică.

**Pe clase, într-un rând:** V — lecțiile repetă și încalecă orele; proiectul e imposibil în M1. VI — întrebări decalate și nume de meniuri/efecte inventate; lanțul fișierului se rupe de la L1 la L6. VII — cea mai curată la întrebări, dar golurile de programă ies abia la „test”, iar titlurile se fac când de mână, când cu stil. VIII — cifrele și rezolvările trebuie *construite*, nu citite; setarea regională strică numere, date și sortarea.

---

## 3. Cât de sigure sunt concluziile

- **Gravitatea „blocant” a fost umflată de poarta mea:** din 16, verificatorul adversarial a confirmat 5, a coborât 9 la important și 1 la minor, și a infirmat 1 (`Q_verdict_blocante.md`).
- **„67% nu le-ar fi prins un audit pe text”** e declarația evaluatorilor, **nu** o cifră validată. Validarea reală e tabelul din §1.
- **Punctatorii hibridului nu erau orbi**; lista de adevăr a judecătorilor a fost construită din rapoartele comparate (înclinată în favoarea lor).
- **Nesigur, depinde de sală (60 de semnalări):** limba Office-ului, setarea regională, dacă PC-urile se resetează, dacă 5M/6M/8A/8M sunt în laborator.

## 4. Clase de defect pe tot situl (nu doar M1)

- **Întrebări decalate față de pas:** 73 din 525 de lecții (14%); la verificarea cu ochiul 8 din 10 confirmate. Probabil de la reparația din 04.09 care a pornit 2.400 de chestionare deodată (`M_intrebari_decalate\M_raport.md`).
- **Rezolvări posibil ale altui exercițiu:** 100 de perechi suspecte pe 75 de pagini, dar ~60% alarme false la verificare → listă de triaj, nu de reparat automat (`K_rezolvari_nepotrivite\K_raport.md`).
- **Site-ul se contrazice la Excel:** M1 spune „SUM, nu SUMA”, M5 predă `=SUMA`, `=MEDIE`, `=DACA`.

---

## 5. Întrebări pentru tine (deblochează 60 de semnalări)

1. În sala „1 (TIC)” de la Brauner: ce Office e instalat (versiune, **limba meniurilor**), ce **setare regională** are Windows-ul (virgulă sau punct la zecimale)?
2. PC-urile păstrează fișierele de la o oră la alta sau se resetează? Au cont separat pe clasă?
3. Care clase-pereche vin efectiv în laborator (5M, 6M, 8A/8M)? La Izvoare rămâne sigur „fără calculatoare”?
4. Tastaturile sunt setate și pe română (ș, ț)?
5. Au voie copiii de a V-a cu telefonul la ora de TIC (lecția de ergonomie îl cere în 7 locuri)?
6. La primele ore: notezi unde se ridică mâinile? (Blocajele copiilor nu se pot simula de AI — sunt ipoteze de confirmat la clasă.)

## 6. Ce urmează (decizia ta)

- **A. Reparațiile sigure de fond**, verificate de două ori (cifre, scurtături, sfaturi depășite, rezolvări greșite la Excel) — pot fi aplicate și publicate imediat, lecție cu lecție, cu verificare în browser.
- **B. Refacerea M1 pe orele reale ale planului** (harta fișier ↔ oră, lecții tăiate pe o sarcină principală, variantă pe hârtie, loc de salvare, barem din `Grila_produs`) — schimbă structura; aici hotărăști tu ordinea.
- **C. Repararea claselor de defect pe tot situl** (întrebări decalate — cu verificare, nu automat).

---

## FĂCUT / NEFĂCUT / NESIGUR

**FĂCUT (cu dovadă pe disc):**
- cercetarea cu surse (`A_cercetare_ce_verifica_omul.md`) și contextul real (`B_context_real.md`);
- 25/25 lecții evaluate, poarta trece pe toate (`G_poarta.py F_evaluari --astept 25` → exit 0), amprentele uneltelor neschimbate, lecțiile neatinse (`git status -- content` curat);
- comparația oarbă (`O_comparatie_AB.md`), testul hibridului (`P_rezultat_hibrid.md`), verificarea blocantelor (`Q_verdict_blocante.md`), agregarea (`N_agregare.md`);
- 2 scanări pe tot situl (K, M); skill-ul `/omul-la-calculator`; 6 lecții în baza de cunoștințe; commit-uri în git.

**NEFĂCUT (blocaj numit):**
- nicio lecție reparată — ai cerut evaluarea; reparațiile schimbă site-ul public și structura pe care o decizi tu (§6);
- verificare pe PowerPoint/Word/Excel **în română, pe calculatoarele din laborator** — se poate doar acolo (§5).

**NESIGUR:**
- ritmurile de citire ale copiilor (au decis verdictele de timp; de calibrat la clasă);
- LibreOffice în română: numele funcțiilor, neverificat;
- estimarea „+27 probleme noi” a hibridului vine de la punctatori care știau ce punctează.
