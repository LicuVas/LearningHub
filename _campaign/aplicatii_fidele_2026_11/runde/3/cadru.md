# Runda 3 · etapa B · Word · CADRUL (pasul 2, înainte de orice reparație)

Suprafața: drumul „salvez / închid / deschid un document” al lecției `lectii/vii/m1-l03` + caseta Font Size + tastarea pe
telefon — exact locurile celor 5 GRAV deschise din `runde/2/critic.md` (N1, N2, GRAV 3, N3, N4).

## Presupuneri (de verificat, nu de crezut)
1. Bara de titlu se rescrie doar în `actualizeazaPanglica()` (`word.js:876-883`); dacă `salveaza()` o cheamă, N1 se
   închide pe toate cele 4 drumuri (Enter și clic, F12 și Ctrl+S) fără altă schimbare.
2. Pe drumul cu Enter, salvarea se face în ascultătorul `keydown` al stratului (`word.js:1002-1004`), ÎNAINTEA
   ascultătorului rădăcinii; mutând salvarea în `I.la.tasta` (ramura `inCamp`), evenimentul poate purta `actiune: 'salvare'`
   și ținta focusului de la momentul tastei (`camp:nume_fisier`), calculată înainte ca fereastra să dispară.
3. Chrome încheie compunerea (cu `compositionend`) când caseta de tastare pierde focusul — criticul a văzut ordinea
   `mousedown → compositionend → blur` (`runde/2/critic.md:93`). Deci o atingere oriunde poate încheia compunerea
   ÎNAINTE ca aplicația să mute cursorul, dacă biblioteca forțează ieșirea din casetă la `pointerdown`.
4. Pentru Ctrl+W, ✕ și fereastra „Save your changes…” nu există nicio referință înghețată (nici `uia_word.json`, nici
   `scenarii_real/`) — doar textul scurtăturilor de pe pagina Microsoft. Fără referință, nu se construiește fereastra.

## Citiri ale lui „fidel” pe suprafața asta
- (a) **stare finală**: după gest, `stare()` și ecranul spun același lucru ca Word real (titlul = numele salvat, cuvântul
  tastat e în document, fișierul e în Documente).
- (b) **gest / eveniment**: gestul elevului e raportat ca ce a înțeles aplicația (Enter în File name = salvare), ca
  profesorul și asistentul să vadă pasul.
- (c) **aspect**: elementele (lista Save as type, pagina Open) arată ca în referință.

**Aleasă: (a) + (b).** Toate cele 5 GRAV sunt de stare finală sau de raportare: elevul vede „Document1” deși a salvat,
verificarea vede documentul fără ultimul cuvânt, asistentul rămâne pe un pas făcut. (c) pierde: aspectul ferestrelor nou
cerute (Save your changes, Word fără document) nu are referință, deci nu poate fi judecat — iar unghiul rundei („aspect”)
se aplică doar la ce se construiește din referință (lista Save as type, pagina Open din `backstage.Open`).
