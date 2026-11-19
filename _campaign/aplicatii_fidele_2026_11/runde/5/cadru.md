# Runda 5 · etapa B · Word · CADRUL (pasul 2, scris înainte de orice reparație)

Suprafața: drumul unui fișier în Word (salvez / închid / deschid / document nou) plus listele noi cu tastatura —
exact suprafețele celor 7 GRAV deschise din `runde/4/critic.md` (T6, N4, T4, T5, T1, T2, T3). Unghiul rundei:
stare_finala_erori (ce stare rămâne după gest și ce vede elevul când greșește).

## Presupuneri (de verificat, nu de crezut)
1. **Fereastra Open se poate desena din referință ca Save As**: `uia_word.json › dialog.open` are File name, Files of type,
   Open, Cancel, bara de adrese „Documente”, lista cu rânduri. Rândurile listei sunt redactate („[element de listă,
   nesalvat]”), deci numele fișierelor vin din CONȚINUT (`fisiere`), ca la Recent în runda 4.
2. **„Descărcări” are temei în referință doar ca nume implicit Windows 11**: `referinte/acoperire_word_r3.py:55-57`
   (`NAV_IMPLICIT = {"Acasă", "Galerie", "Desktop", "Descărcări", "Documente", …}`, „elementele IMPLICITE” ale panoului
   din stânga al ferestrelor de fișiere). Locul rândului în panou NU e în referință (ca AC-6). Presupun că e mai bine
   să desenez rândurile folderelor din conținut decât să las exercițiul m1-l03:240 imposibil.
3. **Word fără document**: comenzile panglicii nu au referință pentru starea asta; presupun că mesajul central e
   singura ieșire cinstită (supliment, T5), iar Ctrl+N / Blank document fac documentul nou (lecția :116, pagina
   Microsoft a scurtăturilor).
4. **F12 pe document salvat** propune numele fișierului — criticul l-a citit în Word real (`runde/4/critic.md:104`).
   Presupun că valoarea casetei = numele fișierului CU extensia, ca la documentul nou (`word-salvare-ca-f12.json ›
   nume_propus "Tema mea de azi.docx"`).
5. **„already exists”** nu are referință (nici dump, nici scenariu, nici URL în `surse_microsoft.md`) → mesajul central,
   fereastra Save As rămâne deschisă, fișierul nu se atinge.

## Citiri ale lui „fidel” pentru suprafața asta
- **A. Aspect**: fereastra Open / zona PDF arată ca în dump (locuri, etichete, taste de acces).
- **B. Stare finală**: după gestul elevului, `stare()` (fișierele, documentul activ, documente_deschise, numele) e cea din
  Word real; o verificare de lecție dă același verdict ca în laborator.
- **C. Eroare / gest greșit**: când elevul greșește (nume existent, comandă fără document), simulatorul NU face în tăcere
  altceva decât Word: întreabă / arată mesajul, nu distruge.

**Aleasă: B + C (stare finală și erori)** — unghiul rundei și locul unde stă paguba: T2 distruge fișierul colegei în tăcere,
T1 face alt PDF, T5/N4 fac exerciții imposibil de terminat, T6 dă asistentului alt verdict decât gestul. A pierde pentru
că aspectul ferestrelor e deja desenat din dump (O3 nu măsoară încă poligonul), iar fără stare corectă aspectul nu ajută
elevul. A rămâne obligatorie unde desenez ceva nou (Open, zona PDF): tot din referință, nu din memorie.
