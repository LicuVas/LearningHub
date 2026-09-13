# 03 — Jurnalul sarcinii (U1, U11, U12)

## Constrângerile elevului jucat (U11)
- 11 ani, clasa a V-a, **prima oră de predare TIC din viața lui de gimnazist** (ora 2, 18.09.2026) — nu știe încă ce e „monitor”, „ergonomie”, „tastatură” ca termeni de lecție (lecțiile 1-2 despre hardware vin DUPĂ, în orele 3-4).
- Citește încet (ritmul porții: 90 de cuvinte/min); tastează ~40 de caractere/min, fără diacritice sigure.
- Nu are raportor, riglă sau telefon la îndemână în laborator (necunoscut dacă are voie cu telefonul).
- Nu poate regla scaunul sau monitorul dacă mobilierul e fix (necunoscut).
- Vede doar pasul curent; rezolvările sunt pliate. Timp: 50 de minute, din care primele ~8 pornirea.

## Povestea pașilor
1. **Deschide lecția și dă peste „Incearca singur!”** — o provocare cu 6 pași fizici, înainte de orice teorie. Bine gândit (exemplul înaintea definiției). Dar primul blocaj apare imediat: pasul 1 spune „Intinde bratul complet. Degetele ar trebui sa atinga ecranul”, iar indiciul 1 spune „ca si cum ai face salut militar”. Salutul militar e cu mâna la tâmplă. Un copil care deschide indiciul pentru că nu a înțeles face exact gestul greșit.
2. **Scaunul și genunchii la 90°.** Fără desen (lecția are 0 imagini; „postura corectă” e un emoji cu o persoană lângă un scaun — `pas_02.png`), fără raportor, „90 de grade” la genunchi e o ghicitoare. Dacă scaunul e prea înalt, indiciul 2 propune „o cutie sau o carte groasa” — la școală, pentru 15-30 de copii, profesorul trebuie să le aibă pregătite.
3. **Checklistul de 10 puncte.** L-am aplicat pe scenariile din Ex. 3 cu `u1_checklist.py`: la Mihai doar 5 din 10 puncte se pot decide din text, la Elena 7. Pe locul real, copilul dă scorul „după ochi”. Punctul 10 („Am un plan pentru pauze la fiecare 45-60 minute”) cere ceva predat abia la pasul 5.
4. **Cele 6 întrebări de verificare** trec fără blocaj pentru cine răspunde corect (`parcurgere.json`, 5/5). Cine greșește vede „❌ Incorect” și imediat dedesubt „💡 Corect! …” (`u5_iesire.json` B) — același defect ca la lecțiile 2 și 3.
5. **Regula 20-20-20** e predată ca „20 de pasi (aproximativ 6 metri)”. Copilul reține „20 de pași”; la exercițiul 1 scrie „20 de pași”. Sursa (CCOHS, text brut) spune „6 metres (20 feet)”.
6. **Exercițiul 2** cere reminder-e pe telefon „pentru regula 20-20-20” la 15:00, 17:00, 19:00 — la două ore distanță. Copilul copiază orele din exemplu și crede că a respectat o regulă „la fiecare 20 de minute”. Calculul: 13 reamintiri între 15 și 19, nu 3.
7. **Exercițiul 3** — copilul bun scrie „tunel carpian” pentru că e în tabel, deși scenariul lui Mihai nu spune nimic despre încheieturi.
8. **Salvarea:** „Salveaza raspunsul” păstrează textul doar în browserul acelui calculator (`u7_salvare_iesire.json`). Clasa-pereche care vine la același PC vede răspunsul (sau îl suprascrie), iar acasă elevul nu-l mai găsește.

## Blocajele-ipoteză (le trec în anexă ca întrebare pentru Vasile)
Salutul militar; „90 de grade” fără desen; scaun/masă de adult; telefonul la oră; tastarea a trei răspunsuri lungi. Sunt **ipoteze AI** — simularea mea e mai competentă decât un copil real; se confirmă doar notând la oră unde s-au ridicat mâinile.

## Timpul (U12)
Clicuri, caractere și cuvinte în `03_pasi.json`; poarta face calculul. Singura sarcină care cere tastare e partea cu exercițiile (≈1.100 de caractere pentru toate trei). Doar citirea lecției = 3.239 cuvinte ÷ 90 ≈ 36 de minute.
