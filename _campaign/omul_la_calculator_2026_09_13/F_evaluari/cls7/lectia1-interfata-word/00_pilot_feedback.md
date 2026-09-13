# Feedback de pilot — protocolul v2 + unelte (cls7 / lectia1-interfata-word, 13.09.2026)

Poarta a dat exit 0 **la prima rulare**. Asta e în sine un semnal: mai jos, locurile unde am putut trece fără ca poarta să verifice munca, și locurile neclare.

## A. Unde poarta lasă să treacă ceva fără sens
1. **Pasul 3, `03_pasi.json`, tip `interfata`: poarta verifică doar că URL-ul începe cu `http`, nu că a fost deschis.** Am scris la pasul 8 o adresă ro-ro „plauzibilă” (slug construit de mine, necitită) și aș fi trecut. Am șters-o eu (`url_ro: ""`). Propunere: agentul salvează în L un fișier `surse/<nr>.txt` cu citatul copiat de pe pagină, iar poarta cere fișierul.
2. **Anexa `FACUT` acceptă ca dovadă ieșirea lui H_vede** (`innerText.txt`), deși la `checks` exact asta e interzis. Am folosit-o la `fara_cont_email_stick`. Inconsecvent.
3. **U2 FACUT = „există o captură pas_/dupa_atomi_ în evidence”.** Poarta nu poate ști dacă am privit imaginea; limita de 8 imagini nu e verificabilă. Doar pune numele fișierului.
4. **U12: poarta confirmă doar verdictul, nu tipărește calculul când verdictul se potrivește.** Am calculat singur (u12_sensibilitate.py) ca să știu cât de departe sunt de prag. Ar ajuta ca poarta să tipărească mereu linia „pornire + citire + sarcină = N min”.

## B. Neclarități în protocol
5. **Pasul 3, `cuvinte_citite`: dublă numărare.** Poarta adaugă deja citirea TUTUROR celor 4.655 de cuvinte ale lecției (inclusiv enunțurile exercițiilor). Nu scrie dacă `cuvinte_citite` pe pas înseamnă enunțul (deja numărat) sau textul din program (meniuri, dialoguri). Am ales „doar ce citește în program” — alt agent poate alege altfel și schimbă verdictul.
6. **Gravitate „blocant” vs ritmurile provizorii.** Verdictul „nu încape” vine din ritmuri declarate provizorii (= fapt necunoscut?). Poarta interzice blocant doar dacă *eu* pun `depinde_de_necunoscut: true`. La această lecție verdictul se inversează la ritm dublu (48,4 min). Am pus blocant + sensibilitatea; regula ar trebui să spună explicit dacă ritmul provizoriu contează ca necunoscut.
7. **U11: FACUT sau NESIGUR?** Pasul 3 cere simularea cu constrângeri (se poate face), iar NESIGUR e permis la U11. Nu e clar dacă „am simulat, dar nu am văzut copii reali” e FACUT sau NESIGUR. Am ales NESIGUR; alți agenți vor alege FACUT → evaluări necomparabile.
8. **Pasul 1: „ora din planul anului (B_context_real.md §2)”** — §2 dă numărul orei, dar **data** e în `Info_Gimnaziu_2026\planificari\Calendar_ore_*.md`, nemenționat. L-am găsit cu ls/grep.
9. **U16: „ce cer spec-ul și programa, cu citat”** — nu e dată calea textului programei OMEN 3393/2017. Am citat doar spec-ul și planul.
10. **Pasul 4, specialistul „cu sursă”** — pentru ce LIPSEȘTE din lecție (butonul ¶) sursa e despre program, nu despre lecție; nu e clar dacă asta intră la U3, U16 sau anexă. Am pus-o la `marcaje_paragraf_spatii_enter`.
11. **„Nu citești HTML-ul întreg”, dar checklistul spec (init, LESSON_ID, `<style>`, data-quiz) se verifică doar în HTML.** Grep ajunge, dar protocolul ar putea spune asta explicit.

## C. Unelte
12. **H_vede, `innerText.txt`:** `textContent` lipește elemente vecine fără spațiu — „Pasul 1 din 110 din 11” (pe ecran: „Pasul 1 din 11” și „0 din 11”). Un agent care nu se uită la captură ar raporta un defect fals.
13. **H_vede marchează obiectivele lecției ca `[ASCUNS: pliat (rezolvare/detalii)]`**, iar protocolul spune „textul din [ASCUNS: pliat] e rezolvarea”. Obiectivele NU sunt rezolvare; eticheta împinge spre concluzia greșită (sau spre a nu le citi).
14. **H_vede, `pas_NN.png`:** captura are doar 768 px de la începutul atomului; la atomi lungi întrebarea e tăiată (pas_02: întrebarea abia începe în josul ecranului). Ce „vede elevul” la momentul răspunsului nu e capturat.
15. **`proiector_25.png`** = ecranul micșorat la 341×192 px. Un videoproiector nu micșorează imaginea, o face mare și spălată; la 25% textul e ilizibil din orice motiv, deci captura nu poate susține sau respinge o judecată despre proiector.
16. **H_randeaza** lasă `lo_profile/` (450 KB) în folderul lecției — gunoi în dovezi; putea fi în `%TEMP%`.
18. **(după v2.1) WebFetch nu dă textul paginii, ci rezumatul unui model mic.** Mi-a raportat „Titlu 1 / Titlu 2” pe pagina ro-ro „Adăugarea unui titlu”; descărcată cu HTTP GET (`surse_descarca.py`, text brut în `surse/raw/`), pagina NU conține „Titlu 1”. Tot rezumatul WebFetch mi-a sugerat „QAT ascunsă implicit, apoi readusă” fără pagină citibilă (blogul Microsoft Insider e randat în JavaScript: 20 de caractere). Cerința `sursa_fisier` e bună, dar ar trebui să spună explicit: citatul se copiază din textul brut al paginii (GET/Playwright), nu din răspunsul WebFetch.
17. **Mediul:** hook-ul local `backslash_heredoc_gate` blochează `python -c` cu căi `C:\...`; căile cu backslash din protocol (`python CAMP\H_vede.py`) nu merg copiate direct în Bash. Cu `/` merge. O frază în protocol ar economisi o tură.
