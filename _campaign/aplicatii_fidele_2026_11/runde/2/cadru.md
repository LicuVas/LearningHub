# Runda 2 · etapa B · Word — CADRUL (pasul 2, scris înainte de orice reparație)

Suprafața: calea TASTATURII în Word-ul bibliotecii (`aplicatii/aplicatii.js` › `leagaGesturi`, `aplicatii/word.js` ›
`I.la.tasta` / `I.la.text` / tastele de acces / straturile Backstage și dialog / caseta Font Size). Unghiul rundei:
**stare_finala_erori** — același gest dă aceeași stare finală ca în Word real, iar gesturile greșite nu strică ascuns documentul.

## Presupuneri (de verificat cu proba, nu de crezut)
1. Pe telefon, tastatura cu compunere (Gboard, Samsung) trimite `compositionstart/update/end` + `input` cu
   `isComposing=true`, iar textul final ajunge o singură dată, la sfârșitul compunerii. CDP (`Input.imeSetComposition` +
   `Input.insertText`) reproduce ordinea asta în Chromium; pe un telefon real ordinea `input`/`compositionend` poate fi
   inversată (Safari) — de aceea golirea casetei trebuie să meargă în ambele ordini.
2. Cât e deschis Backstage sau un dialog, focusul trebuie să plece din `textarea` documentului; altfel orice literă ajunge
   în document prin evenimentul `input`, oricât ar returna `I.la.tasta` `null`.
3. Tastele de acces (`tasta_acces` din `uia_word.json`) sunt o cale de TASTATURĂ: nu trebuie să treacă prin clicuri
   sintetice (care intră în detectorul de dublu clic din `aplicatii.js:276`).
4. Majuscula automată e a gestului de tastare, nu a tastaturii fizice: aceeași frază tastată pe telefon trebuie să dea
   același document ca pe laptop (`scenarii_real/word-tastare-majuscula-automata.json`).
5. Fereastra „Save this file” nu are dump UIA în `referinte/`; există doar text Microsoft cu URL. Tot ce nu e în acel text
   (poziții, valoarea Locației, numele propus) e [NEVERIFICAT].

## Citiri ale lui „fidel” pentru suprafața asta
- **A. Aspect** — tastatura arată aceleași insigne (KeyTips) și aceleași casete ca Word. Pierde: elevul nu e pedepsit de
  aspect, ci de documentul stricat pe ascuns; aspectul e deja măsurat de O3 pe poligon.
- **B. Gest** — fiecare tastă produce un eveniment care spune tasta, nu un clic. Necesar (R6), dar nu ajunge singur.
- **C. Stare finală** — după aceleași taste, `stare()` = starea din Word real (textul, mărimea, numele fișierului), iar
  tastele apăsate cât e deschisă altă suprafață nu schimbă documentul. **ALEASĂ**: e unghiul rundei și singura citire pe
  care se judecă sarcinile (glosar: „verificăm = interogarea stării”); B intră ca efect secundar (GRAV 5).
- **D. Mesaj de eroare** — o comandă nesimulată spune asta (R12), nu tace. Pierde ca citire principală: GRAV 3 și 4 arată
  că mesajul „nu e simulată” pe drumul lecției e el însuși defectul.
