# Reparatorul unei lecții M1 — instrucțiuni comune

Repari **O lecție** de TIC de pe LearningHub pe baza evaluării deja făcute. Scrii în română. Folderul tău: `S = C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\<cls>\<lectia>\`.

## Citești întâi (felii, nu tot)
1. `S_reparatii\S_CONVENTII.md` — integral. Deciziile profesorului și formulările exacte.
2. `S_reparatii\GLOSAR_UI.md` — tabelele pentru aplicația lecției tale.
3. Evaluarea lecției: `F_evaluari\<cls>\<lectia>\05_evaluare.md` integral și `log.json` (câmpul `findings`); `04_mediu.md`; fișierele-dovadă când ai nevoie de detaliu.
4. Dacă există: `Q_verdict_blocante.json` (gravitatea corectată de verificator — ea are prioritate), `P_hibrid\<lectia>\semnalari.json`, `O_orb\<lectia>\judecata.json` (probleme cu verdict „adevarat”), `M_intrebari_decalate\M_rezultat.csv` și `K_rezolvari_nepotrivite\K_rezultat.csv` pe rândurile lecției tale (atenție: K are multe alarme false — verifici pe lecție).
Toate căile sunt relative la `C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\`.

## Pasul 1 — Planul (`S\plan.md`)
Fiecare semnalare reală devine un rând: **aplic** sau **sar** + motiv. Sari, cu motiv, tot ce e decizie de structură (ora din plan, lecție prea lungă de spart, imagini de adăugat, variantă pe hârtie, barem nou, test nou) — aceste decizii rămân la profesor. Semnalările deja infirmate (verdict „fals”) nu se aplică.

## Pasul 2 — Repari, chirurgical
- Doar cu **Edit** pe `C:\00\Projects\LearningHub\content\tic\<cls>\<modul>\<lectia>.html`, bucăți mici. **Niciodată** nu rescrii fișierul întreg și nu îl regenerezi din script.
- Categorii: greșeli de fond; rezolvări / tabele-model / indicii / cifre (le **construiești** din nou în xlsx/docx/pptx cu openpyxl / python-docx / python-pptx și `H_randeaza.py` și treci în lecție ce iese); nume de comenzi pe ambele limbi (glosar); separator și zecimale în Excel (convenția 2); salvarea cu nume + loc (convenția 3); date personale (convenția 4); întrebări puse la alt pas decât materia lor (regula 6); sfaturi depășite (cu sursa din evaluare — surse web doar din text brut, `curl`, niciodată WebFetch).
- După fiecare reparație de fond: o verifici din nou (recalculezi, reconstruiești, recitești sursa) și notezi cum.

## Pasul 3 — `S\raport.json`
```json
{"lectia": "content/tic/<cls>/<modul>/<lectia>.html",
 "aplicate": [{"id": "din log.json sau nou", "categorie": "fond|rezolvare|nume_comenzi|excel_separator|salvare|date_personale|intrebare_mutata|sfat_depasit",
               "tip": "inlocuit|adaugat", "inainte_citat": "fraza EXACTĂ din versiunea veche (≥ 6 caractere)",
               "dupa_citat": "fraza EXACTĂ din versiunea nouă", "verificare": "ce ai rulat/recalculat/citit și ce a ieșit"}],
 "sarite": [{"id": "...", "motiv": "..."}]}
```
Citatele se compară cu textul fișierului (fără etichete HTML), deci copiază-le din fișier, nu le reformula.

## Pasul 4 — Poarta
`python C:/00/Projects/LearningHub/_campaign/omul_la_calculator_2026_09_13/S_reparatii/S_poarta.py <cls> <lectia>` → **exit 0**. Ea verifică chestionarele, că n-ai atins atomii/titlul, că fiecare reparație declarată se vede și că lecția se parcurge în browser fără erori. Dacă pică, repari cauza, nu raportul.

## Interdicții
- Nu atingi alte fișiere de pe site (motorul JS, CSS, alte lecții, index-uri). Nu faci `git commit`, nu publici.
- Nu adaugi diacritice în textul existent (val separat). Nu ștergi atomi, nu schimbi `<title>`, `id`, scripturi.
- Nu pornești Word/Excel/PowerPoint. Căi absolute în Bash, fără `cd`; scripturi Python cu backslash-uri prin Write.

## Ce returnezi (≤10 rânduri)
Exit-ul porții (ultimele 2 rânduri), câte aplicate pe categorii, câte sărite, cele 3 reparații de fond cele mai importante (înainte → după, într-o frază).
