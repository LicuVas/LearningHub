# Propunere pentru `api_biblioteca.md` §6.3 (runda 28, banda Word) — o aplică o rundă `acoperire`

`api_biblioteca.md` e în zona înghețată (repere.lock); nu l-am atins. Textul de mai jos descrie ce face acum `aplicatii/aplicatii.js` › `L.asistent` (rândurile ~664-726).

## Rândul vechi (§6.3, `api_biblioteca.md:262-268`, citat întocmai)
> (și `deschide(..., {asistent: {...}})`). Pasul curent e făcut când vine un eveniment al aplicației cu `tinta` = ținta
> canonică a pasului (aliasul `mso:` se rezolvă), cu `activat` (§4) = ținta canonică a pasului, sau `asteapta(ev)` =
> true. **Greșeală** = orice alt eveniment al aplicației, în afară de `rotita`, `sageti`, `tasta_home_end`,
> `tasta_pagina`, `tasta_acces` cu `actiune` `arata_taste_acces` / `prefix_tasta_acces` (§4) și orice eveniment cu
> `actiune: 'mutare_focus'` (Tab / Shift+Tab care doar mută focusul într-o fereastră, §4). Evenimentul `mutare_focus` nici
> nu face pasul: `tinta` lui e focusul din momentul tastei, deci Tab care pleacă de pe Save nu e „Save” (runda 24, critic
> 20 › B; un pas cu `asteapta` primește evenimentul și hotărăște singur).

## Rândul nou (propus)
> (și `deschide(..., {asistent: {...}})`). Pasul curent e făcut când vine un eveniment al aplicației cu `tinta` = ținta
> canonică a pasului (aliasul `mso:` se rezolvă), cu `activat` (§4) = ținta canonică a pasului, sau `asteapta(ev)` =
> true. **Un refuz nu face pasul**: un eveniment cu `actiune` `nesimulat` (comanda afișată, nesimulată; „… already exists”),
> `nume_interzis` sau `eroare_sortare` nu bifează pasul nici când ținta lui e ținta pasului (clicul pe un buton gri,
> `indisponibil`, îl bifează ca înainte). **Greșeală** = orice alt eveniment al aplicației, în afară de `rotita`, `sageti`,
> `tasta_home_end`, `tasta_pagina`, `tasta_acces` cu `actiune` `arata_taste_acces` / `prefix_tasta_acces` (§4), orice
> eveniment cu `actiune: 'mutare_focus'` (Tab / Shift+Tab care doar mută focusul într-o fereastră, §4), `alt_sageti` care nu
> schimbă starea (`inainte` = `dupa`: Alt+↓ / Alt+↑ deschide sau închide lista unei casete; Alt+săgeată care mută folderul în
> Explorer rămâne greșeală) și tastele de editare ale unui câmp de text (`tastare`, `tasta_backspace`, `tasta_delete`,
> `ctrl_a|c|v|x|z|y`) cu focusul într-un câmp al interfeței — un câmp obișnuit (File name, adresa, Name Box, redenumirea,
> Font Size) sau câmpul care primește tastele unei casete din afara zonei de lucru (caseta din Start); câmpul ascuns al
> documentului (ținta în `[data-lh-zona]` sau `fereastra_app:`) nu e câmp, deci tastarea în document rămâne greșeală.
> Evenimentul `mutare_focus` nici nu face pasul: `tinta` lui e focusul din momentul tastei, deci Tab care pleacă de pe Save
> nu e „Save” (runda 24, critic 20 › B). Un pas cu `asteapta` primește orice eveniment și hotărăște singur (refuzurile și
> `mutare_focus` inclusiv); regulile de mai sus îl privesc doar pe pasul fără `asteapta` (runda 28: critic 24 › MINOR 4, 5;
> critic 26 › „Găsit pe drum”).

## De ce
- Critic 24 › MINOR 4: Save se bifa la salvarea refuzată (nume interzis; „already exists” + Save pe drumul `m1-l03:157`).
- Critic 24 › MINOR 5: Alt+↓ care deschide lista Save as type era greșeală; o a doua deschidere chema bula pe drumul bun.
- Critic 26 › K2 „Găsit pe drum”: fiecare literă din caseta Start era greșeală, iar „Alege Paint” apărea după două litere bune.
- `indisponibil` NU e refuz: cazurile E / G ale lui O9 (înghețat) iau ca pas Bold-ul gri al PowerPoint-ului la pornire; cu el în refuz O9 creștea 13 → 15 (`runde/28/probe_iesiri/O9_dupa/rele.txt`). Decizia de a-l trece la refuz cere și schimbarea cazurilor O9 (rundă `acoperire`).
- Dovada: `runde/28/proba_grav.py` › AS_a / AS_b / AS_c / AS_e (pornire 6 picate din cele 19 verificări ale asistentului → 0; `runde/28/proba_grav_inainte.log` → `proba_grav_dupa.log`); O9 13 → 13, aceleași cazuri.
