# Plan reparatie — cls8 / lectia2-date

Surse citite: S_CONVENTII.md, GLOSAR_UI.md (Excel + Office + scurtaturi + fapte Excel), F_evaluari/cls8/lectia2-date/05_evaluare.md, log.json (12 findings), 04_mediu.md, u4_cultura.txt, surse/shortcuts_*.txt, 07_redeschis.json; Q_verdict_blocante.json (cls8-l2-01 -> important); M_rezultat.csv (intrebarea 3 = decalat_inainte); K_rezultat.csv (3 randuri, toate „ok”, nimic de aplicat). P_hibrid / O_orb nu exista pentru lectie.

| id | semnalare | decizie | cum |
|:--|:--|:--|:--|
| cls8-l2-01 | Ctrl+L/E/R in tabelul de aliniere (sunt ale Word-ului) | **aplic** (fond) | Scot scurtaturile, pun butoanele din Pornire (Home) + Alt+H, A, C (confirmat) + avertisment: in Excel Ctrl+L = Creare tabel, Ctrl+E = Umplere instant (glosar, scurtaturi confirmate), Ctrl+R = umple la dreapta (shortcuts_en.txt). |
| cls8-l2-08 | Backspace „sterge ultimul caracter” | **aplic** (fond) | „Goleste celula selectata si incepe editarea” (shortcuts_ro/en.txt) + ce face in modul editare. Si rezumatul/obiectivele raman valabile (doar numesc tasta). |
| cls8-l2-02 | zecimale cu punct si data zz/ll/aaaa | **aplic** (excel_separator) | Caseta din conventia 2 (text exact) o data, la Incearca; zecimalele trecute la virgula cu „(sau 7.5, dupa calculator)” o data; data cu ambele ordini (u4_cultura.txt). |
| cls8-l2-04 | tabelul din Ex. 1 nu se lipeste in coloane | **aplic** (fond) | Bloc copiabil cu Tab intre coloane, tiparul `.copyable-code > .copy-btn + .code-block` deja folosit in lectia3-formule (motorul copiaza textContent, CSS pre-wrap pastreaza Tab). Verificare: lipire simulata (split pe Tab) in xlsx. |
| cls8-l2-05 | „5 buc”, „3.50 lei” scrise in celula | **aplic** (rezolvare) | Model reconstruit in xlsx (openpyxl + H_randeaza xlsx): cantitati si preturi ca numere, unitatea in antet; fraza „nu scrie lei in celula, il pune formatul”. |
| cls8-l2-10 | exemplul da 47.50, rezolvarea 62.10 | **aplic** (rezolvare) | Exemplul primeste totalul recalculat (62,10), aceleasi produse ca rezolvarea. |
| cls8-l2-03 | Bonusul imbina randul cu antetul | **aplic** (fond) | Bonus: intai inserezi un rand deasupra, apoi imbini A1:D1. Verificat pe xlsx (antetul ramane in randul 2). |
| cls8-l2-07 | butoane doar in engleza | **aplic** (nume_comenzi) | Doar perechi din glosar CONFIRMAT: Pornire (Home), Îmbinare & centru (Merge & Center), Monedă (Currency), Procent (Percentage), Formatare celule (Format Cells), Mărire zecimală (Increase Decimal), grupul Font. Fill Color / Borders (NECONFIRMAT) / Number / Wrap Text: engleza + nota „butonul cu aceeasi pictograma”. |
| cls8-l2-12 | intrebarile atomilor 3 si 4 intreaba ce se preda mai tarziu | **aplic** (intrebare_mutata) | Rotesc data-quiz: atom 3 <- Ctrl+B (predat in tabelul atomului 3), atom 4 <- gridlines/Borders, atom 5 <- Merge. Repar si spatiile lipite din intrebari („valoarea42intr-o”). |
| conv. 3 | salvare fara nume + loc | **aplic** (salvare) | Ex. 1, Ex. 2, Ex. 3, Incearca: Clasa_Nume_<tema> in folderul clasei; Incearca: „deschide fisierul tau (cu numele tau)”. |
| conv. 4 | „Completeaza 5 elevi” (pot fi colegi reali) | **aplic** (date_personale) | „5 elevi imaginari (nume inventate)”. |
| cls8-l2-06 | lectia nu incape intr-o ora | **sar** | Impartirea lectiei in doua ore e decizie de structura (profesor). |
| cls8-l2-09 | fara diacritice | **sar** | Val separat, cu poarta proprie (conventia 5). |
| cls8-l2-11 | Ex. 3 compara tabele care nu sunt pe pagina | **sar** | Adaugarea de capturi/tabele noi = imagini/continut nou de structura (conventia 5). |
