# Verificatorul independent al inventarului de paritate (R4) — 21.11.2026

P = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate`
L = `C:/00/Projects/LearningHub_fidel/aplicatii` (biblioteca nouă)

## Ce e
Alți agenți au făcut lista funcțiilor pe care elevul le poate folosi în simulatoarele vechi ale lecțiilor (codul publicat pe proba, extras în `P/proba_src/`) și au hotărât, pentru fiecare, dacă biblioteca nouă (L) o are. Tu primești un eșantion din lista lor, FĂRĂ verdictele lor, și ajungi singur la verdict. Un script îți compară apoi răspunsurile cu ale lor. Nu încerca să ghicești ce au spus ei: spune ce e adevărat.

## Pentru fiecare funcție din `P/esantion_<grup>.json`
1. **Descrierea e corectă?** Citește codul vechi la `vechi_dovada` (căi relative la `P/proba_src/`). Face codul acolo ce spun `functie` și `gest`? `descriere_corecta`: true / false (la false scrii în `nota` ce face de fapt).
2. **Biblioteca o are?** `biblioteca`:
   - **DA** = biblioteca o face cu același rezultat pentru elev;
   - **PARTIAL** = o face, dar lipsește ceva ce vechiul face (scrii ce);
   - **NU** = nu o face.
   - Dovada (`dovada`): `aplicatii/<fișier>.js:<rând>` și / sau ce ai văzut când ai jucat-o.
   - `cum`: `jucat` sau `cod`. **Cel puțin jumătate din funcțiile tale le joci** în poligon (`L/poligon.html?aplicatie=<word|excel|powerpoint|explorer|windows>`), headless, cu Playwright (Python):
     - server local pornit de tine: `python -m http.server <port liber> --bind 127.0.0.1 --directory C:/00/Projects/LearningHub_fidel`;
     - `context.route("**/*", ...)` care abandonează orice cerere care nu e 127.0.0.1 / localhost;
     - nimic pe ecranul omului; serverul îl oprești la final;
     - API-ul bibliotecii (cum citești starea, evenimentele): `P/../api_biblioteca.md`. Scriptele tale în `P/probe_verif_<grup>/`.
   - La grupul `paint` biblioteca nu are Paint: faci doar pasul 1 și pui `"biblioteca": "NU"`.

## Reguli
- Nu modifici nimic în L, în lecții sau în `_campaign` în afară de fișierele tale din P. Fără git care scrie. Fără Word / Excel / PowerPoint / Paint reale. Fără date personale.
- Nu citești `P/<eticheta>.json`, `P/<eticheta>.md`, `P/paritate.json` sau `P/_esantion_cheie.json` (acolo sunt verdictele celorlalți).

## Ieșirea
`P/verif_<grup>.json`: `[{"id": "...", "descriere_corecta": true, "biblioteca": "DA|PARTIAL|NU", "dovada": "...", "cum": "jucat|cod", "nota": "..."}]`, câte un rând pentru fiecare funcție din eșantion. Răspunsul final: cel mult 5 rânduri (câte DA / PARȚIAL / NU, câte jucate, ce n-ai putut verifica).
