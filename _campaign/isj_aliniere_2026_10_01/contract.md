# Contract — alinierea la actele oficiale: lecțiile 1 V-VIII, V/7, fișele de criterii, literele oficiale (01.10.2026)

**Cererea, verbatim (16:10):**
> 1. aliniaza si lectiile 1 de la 5, 6 si 7.
> 2. Actualizeaza - dar mentioneaza ca explicarea se cere la alte clase mai mici deci ar trebui ca elevul sa fie capabil si aici.. probabil (formuleaza tu)
> 3. folosim etichetarea/notarea oficiala

(continuarea cererii din 14:34: „verifica materialele … de la classroomul isj … daca … coincide - partea de standarde si notare … Actualizeaza situl la final.”)

**Proba realității:** elevul de la oricare clasă V-VIII citește lecția 1 și fișa de criterii lipită în caiet, apoi primește o lucrare. Pe toate trei (lecție, fișă, foaia lucrării) literele înseamnă același lucru ca în actul oficial (anexa 2 a OMEC 4.615/2026: **A = Avansat, B = Consolidat, C = De bază, D1 = În formare, D2 = În dificultate**), iar ce spun despre niveluri și notă nu contrazice actele ISJ/CNCE.

**Decizii luate de profesor (nu se rediscută):** nota = punctaj : 10; punctele pe nivel (De bază 40, Consolidat 30, Avansat 20, oficiu 10); nivelul din notă = regula lui; ≥1 notă pe modul; literele = cele oficiale (3, 01.10).
**Consecința lui 3, aleasă de mine (de confirmat de el):** partea unei lucrări poartă litera nivelului pe care îl verifică: **partea C (De bază) 40 p → partea B (Consolidat) 30 p → partea A (Avansat) 20 p**, în ordinea asta pe foaie (de la ușor la greu).

| R# | Cerința | Cine verifică | Gata înseamnă |
|---|---|---|---|
| R1 | Lecțiile 1 V, VI, VII aliniate ca VIII (cinci niveluri, Avansat fără „explică” în definiția ministerului, regula notă→nivel atribuită profesorului, plan individualizat pentru fiecare elev, „Ministerul Educației și Cercetării”), pe descriptorii anexei 15 ai clasei lor | `oracol_m1l01.py <cls>` + critic-loop + T1 | oracolul 0 la V, VI, VII, VIII |
| R2 | Fișa de criterii VIII actualizată + nota despre explicație („se cere la clasele mai mici… probabil și acum”); la fel, adaptat, la V-VII | critic + T1 | textul în fișa generată + în generator |
| R3 | Literele oficiale peste tot: lecțiile 1 V-VIII, V/7, SISTEM_EVALUARE.md, generatoarele (build_teste, antrenament, instrumente, print_engine, build_materiale, build_saptamana1) și datele lor, materialele tipărite regenerate | grep „B = De bază” = 0; oracol; T1 | 0 urme ale schemei vechi în ce se folosește de acum înainte |
| R4 | Socotelile rămân corecte după relabeling | `verifica_regula.py`, `proba_notare.py` unde există, critic | 0 |
| R5 | Situl actualizat: lecțiile publicate prin `publica_lectie.py`, live = fișier | porțile scriptului + curl | ultima linie 0 |
| R6 | Commit-uri doar pe fișierele mele (alte sesiuni lucrează în Info_Gimnaziu) | git status | doar fișierele numite |
