# Cadrul rundei 24 (Word, B-word#2, unghiul aspect), scris înainte de reparații

## Presupuneri despre suprafață (de verificat, nu de crezut)
1. Pe drumul PDF făcut doar cu tastele, asistentul se poartă greșit pentru că §6.3 tratează Tab ca pe orice gest: Tab care pleacă de pe Save bifează Save, iar Tab-urile se numără ca greșeli. Verificat la pasul zero: `proba_grav_inainte.log` (AS1a, AS1c, AS2, AS3 și AS4 la PowerPoint pică).
2. Diferențele O4 la Word (`word-clic-pune-cursorul`, `word-imagine-inserare`) sunt diferențe de comportament reparabile în `word.js`. Măsurat: NU. Prima e o asimetrie a hamului de măsură (sub un pixel), a doua e un scenariu care cere o comandă din interiorul unui meniu închis (vezi `diferente.md`).
3. Pe fereastra mică, Save / Cancel ies din ecran pentru că fereastra Save As păstrează dreptunghiul din referință (566 px) într-o rădăcină de 526 px. Pe laptopul real fereastra încape: bara browserului e cea care fură înălțimea. Măsurat: `probe_iesiri/masura_inainte.json` › M1.
4. La 1366×768 și pe tabla SMART fereastra Save As încape întreagă, cu dreptunghiurile referinței; orice reparație pentru fereastra mică trebuie să le lase neatinse (MN4).

## Citiri ale lui „fidel” pe suprafața asta
- **aspect** (unghiul rundei): elementele vizibile sunt în același loc și au aceeași mărime ca în referință (`uia_word.json`, ±2 px).
- **vizibilitate**: elevul VEDE butoanele pe care le-ar vedea pe PC-ul real (Save, Cancel, rândul PDF). Pe ecranul real încap; în browser, pe laptopul de 1366×768 la 125%, nu.
- **gest / stare finală**: Tab, Alt+F4 și Save duc la aceeași stare ca în Windows.

## Citirea aleasă
**Aspect = vizibilitate, acolo unde referința nu poate fi respectată la pixel.** La 1366×768 (ecranul referinței) se păstrează dreptunghiurile la pixel. Pe un ecran mai mic decât fereastra, se păstrează ce vede elevul pe PC-ul real: fereastra întreagă, cu butoanele ei.
- Pierde **aspectul la pixel cu orice preț**: pe fereastra mică el ascunde exact butonul pe care lecția îl cere (Save). Pe PC-ul din laborator elevul l-ar vedea.
- Pierde și **doar derularea** (fără micșorare): un elev care lucrează cu mouse-ul nu știe că trebuie să deruleze ca să găsească Save. Derularea rămâne doar ca plasă sub 70%.
