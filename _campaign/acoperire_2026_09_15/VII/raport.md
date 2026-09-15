# Auditul de acoperire VII-U1 + VII-U2 și evaluarea word-obiecte-vii — 15.09.2026

## A. Evaluarea independentă a word-obiecte-vii
- Semnalări: 0 blocante, 4 importante (S01–S04, toate reparate), 6 minore (S05–S06 reparate, S07–S10 lăsate profesorului). Detalii și dovezi: `modificari_word_obiecte.md`.
- Simulatorul `pagina`: 38/38 cazuri de copil pe iPhone SE și Pixel 7, zero erori JS.

## B. Acoperirea (rulările mele ale `acoperire.py`)
| Unitate | Înainte | După |
|---|---|---|
| VII-U1 | 8 lecții ❌ + 8 conținuturi ❌ (word-vii nedeclarat, word-obiecte-vii fără declarații) | 0 ❌ (word-vii + word-obiecte-vii) |
| VII-U2 | 6 lecții ❌ + 8 conținuturi ❌ | 0 ❌ |

## C. Ce am adăugat
- **word-vii:** `acoperire.json` (7 niveluri, scris de `scrie_acoperire_word_vii.py` din curriculum.json, cu verificarea titlurilor față de LEVELS). În nivelul 1 am adăugat un paragraf despre creare/deschidere/închidere și 2 întrebări: Ctrl+O (choice, cu răspunsul pe altă poziție decât celelalte) și Ctrl+N/Ctrl+W (tf). Sursa: `surse\scurt.txt` (Microsoft ro: „Deschiderea unui document. Ctrl+O”, „Crearea unui document nou. Ctrl+N”, „Închideți documentul. Ctrl+W”).
- **audio-video-vii:** declarații pe niveluri. N2: întrebarea „ce deschizi a doua zi” (proiectul, nu MP4-ul) și fraza despre deschiderea proiectului. N4: întrebarea copiere vs mutare (aplauzele). `gresit()` pentru `montaj`: montajul corect, cu tăietura de la sfârșit uitată.
- **word-obiecte-vii:** vezi A. Plus `gresit()` pentru `pagina`, declarațiile și punctul despre font la diplomă.
- **Declarate cu rezervă (pentru profesor):** audio-video-vii N3 (formate, comprimare) e trecut la „gestionare” (salvare/export), fiindcă programa nu numește formatele. Aceeași observație apare în raportul evaluatorului, la S08. Evaluatorul audio-video-vii a semnalat și lipsa integrării clipului într-o prezentare. Am lăsat-o intenționat: nu e un conținut al programei, e o activitate CS.3.2, și ar fi dublat unitatea de prezentări.
- **Neverificate pe sursă primară:** numele românești „Îmbinare celule” și „Repetare rânduri antet” (jocul nu le dă); comportamentul Clipchamp/Audacity la deschiderea proiectului (formulat general, „din editor”).

## D. Poarta
- `test_joc.py word-obiecte-vii audio-video-vii`: [TRECUT] 70 de întrebări jucate / [TRECUT] 74, fără avertismente (deci `gresit()` a fost testat).
- `verifica_modificari.py`: word-vii N1 jucat pe 2 telefoane, cu greșeli respinse și răspunsuri corecte acceptate; N2–N7 deschise fără depășirea ecranului. `gresit()` respins și `rezolva()` acceptat pe TOATE cele 12 simulatoare × telefoane. Întrebările noi audio: 4/4. Zero erori JS.
- `acoperire.py`: 0 goluri, 0 probleme de declarare (o rulare intermediară a căzut cu traceback, cel mai probabil din cauza editărilor paralele ale altor auditori; rularea următoare a trecut curat).
