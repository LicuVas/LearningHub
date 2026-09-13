# Verificare — cls8 / lectia5-grafice (13.09.2026)

**Verdict: trece_cu_defecte_minore** · 27 de schimbari verificate · 0 blocante · 0 importante · 4 minore

| # | Unde | Problema | Gravitate |
|:--|:--|:--|:--|
| 1 | Caseta „axa Y porneste de la 0” (atom 6) | La Bar axa valorilor e orizontala, nu Y | minor |
| 2 | Schema „Anatomia” — a 5-a bara | La 400 px bara FZ taiata si legenda iese din vedere (depasire pre-existenta, marita de la 49 la 93 px); pe desktop arata corect | minor |
| 3 | Atom 7, atom 8, rezolvari | „Insert → Charts”, „Tab-ul Chart Design” ramase doar in engleza, langa forma RO din acelasi atom | minor |
| 4 | Incearca pasul 5 | Nota nedeclarata „butonul cu aceeasi pictograma” pentru o comanda de meniu | minor |

Verificat in browser (Playwright headless, nou vs git HEAD, 1366 si 400 px): barele au acum 65/61/73/68/57 px, aliniate la baza, proportionale cu notele (axa de la 0); consola fara erori; restul paginii neatins (`verif/v_nou_1366.png`, `verif/v_nou_400.png`, `verif/v_browser.json`).
Fondul reparatiei e corect: Pie → Bar in Incearca, cifrele casetei (7 ori, 22%), citatele GSS, mutarea intrebarii Line si numele din glosar sunt reproduse; poarta S_poarta.py = OK.
Defectele ramase sunt de formulare/consecventa si de afisare pe telefon, nu de continut gresit.
