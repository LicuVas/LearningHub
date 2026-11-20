# Runda 19 · B-explorer · unghiul gest_tastatura · CADRUL (înainte de orice reparație)

Pornirea: `masurare_pornire.json` (măsurarea comună de la finalul ciclului A: O1 61 · O2 13392 · O3 28919 · O4 28 · O5 35 ·
O6 0 · O7 341 · O8 102 · O9 13 · porți 41). Pasul zero (GRAV-urile reproduse pe codul de azi, HEAD c29b583a, `aplicatii/`
neschimbat): `probe_iesiri/pornire_e1.log` (E1: 10 din 10 picate), `probe_iesiri/pornire_e2_tast.log` (E2: 27 din 34 picate;
tastatura: 8 din 32 picate, din care 4 în cascadă după Alt+Enter, care intră în folder).

## Suprafața aleasă
Drumurile lecțiilor din File Explorer (v/m2-l09 … m2-l12) cu trei feluri de gest: comanda afișată și nesimulată (E1), redenumirea
cu atingeri (E2), tastatura pe listă / adresă / căutare (unghiul rundei).

## Presupuneri (de verificat, nu de crezut)
1. **Mesajul central dispare doar pentru că Explorer rescrie rădăcina** (`explorer.js:409` `root.innerHTML = …`), iar mesajul stă
   ÎN rădăcină (`aplicatii.js:229`). Dacă e așa, orice aplicație care își redesenează rădăcina întreagă pierde mesajul; Word / Excel /
   PowerPoint nu o rescriu după pornire (`root.innerHTML = ''` doar la creare: `word.js:595`, `excel.js:655`, `powerpoint.js:252`),
   deci la ele mesajul trăiește 5 s. Proba: E1 la pornire 10/10 cu mesajul inserat și scos în aceeași milisecundă.
2. **Mesajul trebuie să rămână SUB rădăcină** (api §3: „stă sub rădăcină și are role=status”; O1 / O8 citesc doar sub
   `[data-lh-aplicatie]`, `oracole/arbore_randat.js:6`). Un strat în afara rădăcinii ar rupe convenția; deci reparația comună
   trebuie să-l readucă în rădăcină după redesenare, nu să-l mute afară.
3. **Pe telefon caseta se închide din `mousedown`-ul de compatibilitate** pe care browserul îl trimite DUPĂ `pointerup` (comanda
   rulează pe `pointerup`, `aplicatii.js:349`): focusul trece pe rădăcină (`tabIndex = -1`), `blur` (`explorer.js:419`) închide
   redenumirea. Proba: la +30 ms `caseta: null`, focusul pe `DIV.lh-ap lh-ap-explorer`.
4. **Tastatura e în mare parte bună** (pornire: 24 din 32 verificări trec), iar ce lipsește e legat de referință: Alt+Enter
   (`explorer_meniu_fisier › Proprietăți`, scurtătura `Alt+Enter`) e tratat ca Enter (intră în folder), Ctrl+Shift+C
   (`Copiere ca o cale`, `Ctrl+Shift+C`) tace.

## Citiri ale lui „fidel” pentru suprafața asta
- **A. Aspect**: mesajul / caseta arată ca în Windows. Pierde: unghiul rundei e gestul, iar aspectul a fost judecat în runda 15
  (±2 px); mesajul central nici nu există în aplicația reală (e convenția bibliotecii, R12).
- **B. Gest → stare finală + ecran** (ALEASĂ): același gest (atingere, tastă) duce la aceeași stare ca în aplicația reală
  (scenariile `explorer_*`, scurtăturile din `uia_explorer.json`) și ecranul o arată; o comandă nesimulată SPUNE că nu e simulată
  (R12) și spusul rămâne pe ecran cât să fie citit. Câștigă pentru că asta face elevul în laborator / pe telefon: apasă și
  vede ce s-a întâmplat.
- **C. Mesajul de eroare**: textele dialogurilor = scenariile reale. Pierde: dialogurile au trecut la critic 15 (§B5); aici
  nu se schimbă niciun text.

## Ce NU se face în runda asta (și de ce)
- Tab între zone, săgețile ←/→ în vederea Detalii, Backspace, Ctrl+Shift+N, F4 / Ctrl+L, Ctrl+E / Ctrl+F, căutarea rapidă
  după literă: NU sunt în referința înghețată (`uia_explorer.json` dă scurtături doar pentru Înapoi Alt+Stânga, Înainte
  Alt+Dreapta, Până la … Alt+Sus, Reîmprospătare F5, Deschideți Enter, Copiere ca o cale Ctrl+Shift+C, Proprietăți Alt+Enter,
  Decupare Ctrl+X, Copiere Ctrl+C, Redenumire F2, Ștergere del, Anulare Ctrl+Z). Comportamentul lor de azi rămâne, intră în
  `de_verificat.md` ca rânduri `R19-…` cu scenariul care l-ar lămuri.
- Proprietăți simulat: fereastra `explorer_proprietati` există în referință, dar nicio lecție n-o cere (critic 15 §B5); rămâne
  mesajul central, acum vizibil.
