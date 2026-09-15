# Evaluator independent V/VI/VII — modificări (15.09.2026)

## 1. audio-video-vii, nivelul 4 „Tai, șterg, mut”, pagina de citit

**De ce:** întrebarea nouă („Aplauzele... trebuie să se audă și la început, dar să rămână și la final”) cere diferența copiere/mutare (copierea lasă bucata pe loc). Pagina punea mutarea și copierea în același punct, cu același gest („tragi clipul în alt loc pe pistă”), deci diferența nu era predată pe pagină. În plus, tragerea simplă a unui clip îl MUTĂ; nu îl copiază.

**Înainte:**
```
<li><strong>mutarea</strong> și <strong>copierea</strong>: tragi clipul în alt loc pe pistă, iar în multe editoare merg și Ctrl+X, Ctrl+C, Ctrl+V, ca în Word.</li>
```
**După:**
```
<li><strong>mutarea</strong>: tragi clipul în alt loc pe pistă, iar el pleacă de unde era;</li>
<li><strong>copierea</strong>: bucata rămâne pe loc și apare încă una acolo unde o lipești. În multe editoare merg Ctrl+X, Ctrl+C, Ctrl+V, ca în Word.</li>
```
**Dovada:** citatul de mai sus din pagină (copie: `audio-video-vii.index.html.inainte_eval`) comparat cu `why` al întrebării noi („Copierea lasă bucata pe loc și pune încă una unde vrei”). Pagina are acum 106 cuvinte, față de 91 (sub limita de 120; măsurat cu `numara.py`).

## Verificări după reparație
- `test_joc.py calculator-v prezentari-vi internet-vi audio-video-vii` → 4× [TRECUT] (`poarta_dupa.txt`). La o rulare intermediară prezentari-vi a picat cu `Page.goto: Timeout 6000ms` (fișier neschimbat; a trecut la rularea singulară și la rularea completă de după).
- `acoperire.py` → 0 goluri, 0 probleme de declarare (`acoperire_dupa.txt`).
- `joaca.py` (iPhone SE + Pixel 7) → 0 eșecuri (`joaca_dupa.txt`, `joaca_rezultat.json`, `capturi\`).

Nimic altceva modificat.
