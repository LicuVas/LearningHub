# Componentele comune — tura 24.10.2026 seara (pornită 20:53)

Contractul: `contract.md` (aici). Prompturile: `prompturi\a_motor.md`, `b_scratch.md`, `c_mici.md`. Jurnalul: `..\04_ORCHESTRARE.md`, secțiunea „24.10.2026 seara — componentele comune”.

## Lucrările (catastiful `job_etape`, prefix `lhcomp_`)
| id | Ce | Etape |
|---|---|---|
| lhcomp_motor | motor.js + motor.css: bifele ≥ 32 px, „Corect!” rămas, antetul 23 px | autor → poarta → lansare |
| lhcomp_scratch | scratch.js 1.4: Duplică pe telefon, eroarea din consolă, câmpul direcției | autor → poarta → lansare |
| lhcomp_mici | browser-salvare/siguranta (bs-css), editorweb-schelet (după </body>), Paint meniul Forme | autor → poarta → lansare |
| lhcomp_lectii | V/12 (?vezi=p8/p9) + VII/18 (legătura 38 px) — FĂCUTE pe disc de dirijor, probate (proba din scratchpad: 0) | publicare (la final, după componente) |

## Cum se lansează o componentă (08_RELUARE.md §3)
1. Autorul termină (raportul în `<dosar>\raport.md`). 2. POARTA DE LANSARE = agent opus PROASPĂT, independent: verdict LANSEAZA / NU_LANSA, probe pe TOATE paginile care încarcă fișierul (390 atingere + 1280 mouse), sha1 verificat pe disc = sha1 din raportul autorului; la motor și sertarele vechi + test_joc pe toate lecțiile publicate și jocurile. 3. NU_LANSA → reparare cu autor proaspăt → poarta din nou. 4. LANSEAZA → dirijorul: `git add <căile numite>` + commit separat + push; verificare: blobul de pe sit = blobul comis (sha1 al conținutului servit, cu LF). 5. Ordinea: mici + scratch întâi, motorul ultimul. 6. La final: `publica_lectie.py v/m2-l12 vii/m3-l18` (după ce toate componentele sunt comise — altfel poarta „componentă comună neschimbată” sau testele pe fișiere în lucru).

## Dacă ești sesiunea de SALVARE
- `python C:\00\AI_0\tools\job_etape.py stare` → ce e bifat e gata. Pentru o lucrare la etapa „autor”: dacă `<dosar>\raport.md` există și e complet, treci la poartă; altfel pornești un autor PROASPĂT cu același prompt + „continuă de unde a rămas predecesorul: citește <dosar>\ și copia `inainte\`”.
- Componentele schimbate pe disc și nelansate rămân pe disc; NU le comiți fără verdictul LANSEAZA al unei porți independente.
- Nu publica nimic după 03:00. Dacă nu termini, scrie `RAPORT.md` (aici) cu FĂCUT / NEFĂCUT / NESIGUR și lasă fișierele nelansate exact cum sunt, cu `git diff --stat` în raport.
