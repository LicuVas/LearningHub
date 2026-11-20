# Runda 22 (B-windows, unghiul gest_tastatura) — cadrul, scris ÎNAINTE de reparații

## Presupuneri despre suprafață (Windows 11: desktop, bara de activități, Start, meniurile desktopului)
1. Referința `uia_windows.json` e a ecranului profesorului (1536×864 logic, 125%); elevul vede biblioteca la 360-1536 px.
   Pozițiile se păstrează relativ (Start centrat și lipit de bară, tava la dreapta), nu absolut.
2. Când o captură are mai multe ferestre, una e „gazda” desenată pe ecran, iar alta poate fi o dublură UIA a aceluiași
   pop-up (meniul de desktop: `ferestre[1]` = gazda barei de comenzi de sus, 304×69, cu aceleași rânduri citite încă o dată).
3. Gesturile de tastatură ale Start-ului nu sunt în `uia_windows.json` (UIA dă structura, nu comportamentul). Singura sursă
   a comportamentului: pagina Microsoft „Use a screen reader to explore and navigate the Start menu in Windows”
   (secțiunile „Search (Windows 11)” și „Navigate to Pinned and All apps”), citată în `diferente.md`.
4. Panoul de rezultate al căutării, forma pictogramelor și indiciul de la trecerea mouse-ului NU sunt capturate:
   [NEVERIFICAT], simple, fără pretenție de fidelitate, cu rând R22-… în `de_verificat.md`.
5. Explorer-ul din bibliotecă (`explorer.js`) e al benzii r19 și nu are (azi) un mod de montare într-o fereastră Windows.

## Citirile lui „fidel” pe unghiul gest_tastatura
- **A. Gestul**: aceeași tastă / același gest ajunge în același loc (focusul, caseta, lista) și dă aceeași stare (fereastra
  pornită, lista derulată), cu evenimentul §4 pe fiecare gest.
- **B. Aspectul**: același panou, aceleași rânduri în aceeași cutie (W1, W2, W4).
- **C. Starea finală**: doar ce ajunge în `stare()` (ferestre, meniu_start_deschis).

## Aleasă: A, cu B unde fără el gestul nu se poate duce la capăt
- B singur pierde: un meniu desenat corect în care tastarea tace (W3) sau lista care nu se derulează (W2) tot blochează
  drumul lecției.
- C singur pierde: R12 („nu tace”) și R6 (evenimentul pe fiecare gest) cer și ce se vede, nu doar starea.
- A cere și B acolo unde elevul trebuie să vadă ținta ca s-o atingă: W1 (rândurile sub bară), W5 (butoanele în afara
  ecranului), W4 (dosarul galben și numele lui sunt singurele indicii date de lecție).
