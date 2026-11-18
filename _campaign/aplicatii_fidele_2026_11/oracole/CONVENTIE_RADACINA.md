# Convenția rădăcinii — cum află un oracol CE măsoară și UNDE scrie  (16.11.2026, infrastructura de măsurare)

Toate oracolele O1-O9 din acest dosar, `porti.py` și orice probă chemată de ele o respectă. Fără ea, bancul de mutanți
(`../mutanti/mutanti.py`) nu poate dovedi că oracolul prinde ceva: mutanții se plantează într-o COPIE a sitului din %TEMP%,
iar oracolul trebuie să măsoare copia, nu worktree-ul. Un oracol care n-o respectă iese la mutanți „NEPRINS: nu citește LH_RADACINA”.

## Cele trei variabile de mediu

| variabilă | ce înseamnă | dacă lipsește |
|---|---|---|
| `LH_RADACINA` | rădăcina SITULUI măsurat (folderul care conține `lectii/`, `jocuri/`, `aplicatii/`, `cum-fac/`, `assets/`). Serverul static local servește ACEST folder; paginile din `inventar.json` („pagina”: `lectii/v/m2-l08/index.html`) se rezolvă față de el. | worktree-ul: `C:/00/Projects/LearningHub_fidel` (= `D.parents[1]`) |
| `LH_IESIRE` | folderul în care oracolul scrie detaliile (JSON-ul „lângă”, capturi, fișiere temporare de lucru). Îl creezi dacă nu există. | lângă oracol, DOAR ca `<numele_oracolului>.json` (ex. `oracol_ui.json`) |
| `LH_PAGINI` | opțional: listă cu virgulă de pagini (exact cheia „pagina” din `inventar.json`), ca oracolul să măsoare DOAR acele pagini (mutanții o folosesc ca să nu reia tot situl). | toate paginile |

Sinonime și variabile proprii `structura_lib.py` (O1, O2, O3, O7, O8; reparațiile 3 și 11, 17.11.2026):
- `LH_DOAR_PAGINI` (subșiruri, același efect ca `LH_PAGINI`) — `mutanti.py` le setează pe AMÂNDOUĂ;
- `LH_IESIRI` = dosarul CACHE-ului randării (`randare_<amprentă>.json`); dacă lipsește și `LH_IESIRE`, e și locul lui
  `<oracol>.json`. Fără `LH_IESIRI`, cache-ul stă în `D/oracole/_iesiri/` DOAR când situl măsurat e worktree-ul; pe
  orice altă rădăcină (copiile din %TEMP%, autotestele) stă în `%TEMP%/lh_structura_cache/` — niciodată în `D/` și
  niciodată în `LH_RADACINA`;
- `LH_FARA_CACHE=1` = randare de la zero: se acceptă doar o randare terminată DUPĂ pornirea procesului (de pildă a unui
  oracol pornit în paralel, care ținea lacătul); `mutanti.py` o pune la a doua linie de bază (proba de zgomot), ca ea
  să nu citească randarea primei (verificare_etapa0.md 3.a);
- în cache și în `<oracol>.json` se scriu doar căi RELATIVE la rădăcina sitului: rădăcina = `"."` (+ `radacina_e_worktree`),
  adresa serverului local = `/`, %TEMP% și dosarul utilizatorului înlocuite cu marcaje — calea unei copii din %TEMP%
  (cu numele contului) nu ajunge pe disc în afara %TEMP%.
Un oracol care filtrează paginile doar prin argumente (ex. `oracol_sarcini.py --pagini <subșir>`) le primește din câmpul
`argumente` al mutantului din `mutanti/banca.json`.

Reperele ÎNGHEȚATE se citesc MEREU din dosarul lucrării, niciodată din `LH_RADACINA` (copia nu conține `_campaign/`):
`D/inventar.json`, `D/suprafete.json`, `D/referinte/**`, `D/scenarii/**`, `D/api_biblioteca.md`, unde `D = Path(__file__).resolve().parents[1]`.

## Codul de copiat (Python)

```python
import os
from pathlib import Path

AICI = Path(__file__).resolve().parent                     # D/oracole
D = AICI.parent                                            # dosarul lucrării: reperele înghețate
RAD = Path(os.environ.get("LH_RADACINA") or D.parents[1]).resolve()        # situl măsurat
IESIRE = Path(os.environ["LH_IESIRE"]).resolve() if os.environ.get("LH_IESIRE") else AICI
IESIRE.mkdir(parents=True, exist_ok=True)
DETALII = IESIRE / (Path(__file__).stem + ".json")          # JSON-ul cu detalii; calea lui se tipărește pe penultima linie
PAGINI = [p.strip().replace("\\", "/") for p in os.environ.get("LH_PAGINI", "").split(",") if p.strip()]   # [] = toate
```

Un modul comun (ex. `structura_lib.py`) poate citi el variabilele; atunci oracolul care îl importă trebuie să-l importe din
`AICI` (nu dintr-o cale fixă). Verificarea statică a mutanților caută textul `LH_RADACINA` în oracol SAU într-un modul local
pe care îl importă (`import structura_lib` / `from structura_lib import ...`).

## Reguli

1. **Nimic scris în `LH_RADACINA`.** Oracolul doar citește situl (copia trebuie să rămână exact cum a lăsat-o mutantul).
2. **Nimic scris în `D/oracole/` în afară de `<oracol>.json`.** Tot ce e în `oracole/` e înghețat în `repere.lock`; excepțiile
   (nu se îngheață): `__pycache__/`, `*.pyc`, `_iesiri/**`, `*.png`/`*.jpg`/`*.webm`/`*.log`, și `<x>.json` când există `<x>.py`
   în același folder. Orice alt fișier nou apărut în `oracole/` după înghețare RUPE lacătul.
3. **Ieșirea:** ultima linie = UN întreg (numărul de probleme), fără linii goale în ultimele 3 rânduri; penultima linie = calea
   JSON-ului cu detalii; cod 0 (0 probleme) sau 1 (probleme); orice prăbușire = alt cod. Un rând informativ (ex. procentul de
   comenzi simulate la O8) stă ÎNAINTEA penultimei linii.
4. **Durata:** `masoara.py` dă fiecărui oracol un timp maxim (implicit 1800 s; `porti.py` 5400 s). Peste el = NECONCLUDENT.
5. **Rețeaua:** server static pe `("127.0.0.1", 0)` servind `RAD`; `ctx.route` abandonează tot ce nu e 127.0.0.1/localhost (regula 24);
   în plus (reparația 12) `navigator.sendBeacon` înlocuit prin `add_init_script` cu o funcție care întoarce `false`, iar
   cererile către `assets/js/prezenta.js` și `assets/js/site-credit.js` abandonate — ca în `sarcini_lib/joaca.py`
   (sendBeacon la închiderea paginii a scăpat odată de rută: `jocuri/_motor/garda_locala.py`). Model: `structura_lib.py`
   (`JS_INIT`, `FARA_LOCALE`, `blocheaza_externe`). Același lucru în `inventar_build.py --viu` (17.11.2026). Probele de
   browser ale SITULUI rulate de `porti.py` (test_joc, controale_taiate, fereastra_mica — fișiere ale sitului, neatinse)
   rulează prin paza `porti_extra/paza_browser/sitecustomize.py` (pusă în PYTHONPATH de `porti.py`: învelește Playwright
   în probă și în procesele ei copil; o poartă păzită fără niciun context păzit = NECONCLUDENTĂ); proba ei, cu control
   negativ: `porti_extra/paza_proba.py`.
6. **Determinism:** aceeași copie, rulată de două ori, dă același număr (mutanții compară numărul cu cel de pe copia nemutată).
   Un oracol cu zgomot (temporizări) își repetă măsurarea sau ia maximul — altfel produce „prinși” falși.

## Cine setează variabilele

- `masoara.py --runda N`: `LH_IESIRE=D/runde/N/iesiri/<O#>/`; `LH_RADACINA` doar dacă e deja setat în mediul lui.
- `mutanti/mutanti.py`: `LH_RADACINA=<copia din %TEMP%>`, `LH_IESIRE=<temp>/iesiri/<mutant>/`, `LH_PAGINI=` paginile mutantului,
  `LH_IESIRI=<temp>/iesiri/cache_structura` (cache-ul randării al lui structura_lib.py) și, la a doua linie de bază,
  `LH_FARA_CACHE=1`.
- ATENȚIE la orice rulare pe o copie din %TEMP% (și autotestele oracolelor): calea copiei conține numele contului Windows.
  Ieșirile (inclusiv cache-urile) trebuie să rămână în %TEMP% (`LH_IESIRE` / `LH_IESIRI`), nu în `D/` — altfel poarta
  `date_personale` din `porti.py` (care citește tot `_campaign/`) le prinde, pe drept.
- Ambele pun `PYTHONDONTWRITEBYTECODE=1` (nu apar `__pycache__` noi).
