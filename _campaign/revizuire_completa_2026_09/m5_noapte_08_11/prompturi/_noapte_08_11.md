# Ce e altfel în noaptea 08→09.11.2026 — se citește DUPĂ `m4_seara_02_11\prompturi\_seara_02_11.md` (și lanțul de fișiere pe care îl cere ea)

Toate regulile de acolo rămân în vigoare, cu schimbările de mai jos. Legea rămâne `00_GHID_LECTII.md`. Contractul: `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\m5_noapte_08_11\contract.md` — citește-l.

## Ce s-a schimbat
- **Starea (calculată 08.11, 23:25):** 101 lecții publicate; M4 = V/22-29, VI/22-26, VII/22-23, VIII/22-23. Rămân 42. `dirijor\stare.py` arată oricând situația.
- **Modul nou: M5.** Lecțiile V/30-36 stau în `lectii\v\m5-lNN\`, cheia `lectie_v_m5_lNN`. Calea și cheia exacte vin din `lectii\plan.json`; nu le deduci. Lecțiile VII/24-29 și VIII/24-29 sunt încă M4 (`m4-lNN`).
- **Limbajul de la VII și VIII este C++, cu Code::Blocks** (contractul, decizia 1). Scratch 3 online fără cont rămâne la V/31-35.
- **Bugetul:** lucrezi pe opus, temeinic, dar economia contextului e obligatorie: ieșirile lungi în `_proba\*.txt`, `_proba\stare_autor.md` la zi după fiecare etapă.
- **Ora și ecranul:** Vasile doarme, apoi e la școală. **Nimic pe ecranul vizibil.**
- **Panoul:** `python C:/00/AI_0/tools/activitate.py lista | grep -c "nu e în catalog"` (CU î) = **3 la start (08.11, 23:27)**: elevi reali, nu din probe. Numărul nu crește. Ieșirea cu nume NU se salvează nicăieri.
- **Granițele:** `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\m5_noapte_08_11\granite\<cls>_l<NN>.md`. Le scrii în primele ~20 de minute și le citești pe ale vecinilor când apar (regulile de graniță din `_noapte_01_11.md`: „SCHIMBAT <ora>”, „presupun de la <lecția>”, nume de extensie liber). Orele din graniță vin din ceas (`python C:/00/AI_0/SECRETARY_V3/memory/query.py now`), nu estimate.
- **Dirijorul poate fi o sesiune fără fereastră** (predarea ștafetei): pentru tine nu se schimbă nimic — răspunsul final rămâne cel din brief.

## Ce au găsit judecătorii des în ultimele valuri (evită de la început)
- Textul care contrazice ce face simulatorul la un caz-limită: orice regulă scrisă în pagină are o probă în `_proba\` care o încearcă pe cazurile-limită.
- Ștergerea și fișierele de la sfârșitul orei: numești exact fișierul de azi și spui ce NU se atinge (lucrările din lecțiile trecute).
- Durata: socotești minutele pe etape, cu elevul lent; ținta e să încapă în 50 de minute fără să tai din practică.
- `continuturi` din antet se copiază întocmai din `curriculum.json` (poarta cere textul identic).

## Ce NU faci
Nu atingi lecțiile publicate, motorul, `prezenta.js`, `rezultat-elev.js` și simulatoarele existente din `lectii\_sim\` (le poți ÎNCĂRCA nemodificate, dacă granița o spune; extensiile tale au nume nou). Nu publici, nu faci commit.
