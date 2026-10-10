# Lecția 10, clasa a V-a — surse, probe și ce n-am putut verifica (10-11.10.2026, tura de noapte)

## Programa și planul
- **Titlul și locul:** `Info_Gimnaziu_2026\planificari\Calendar_ore_5AM_5M.md`, rândul 20.11.2026, lecția 10, M2, „predare”; `data\unitati.json`: V-U2 „Sistemul de operare. Ordinea în fișierele mele”, lecția 10, materiale „teorie, exercitii”; `lectii\plan.json` (cheia `lectie_v_m2_l10`).
- **Programa** (`AI_0\data\informatica_gimnaziu\curriculum.json`, CS.1.2): conținutul „Operații cu fișiere și directoare” (copiat exact în `continuturi`); activitatea de învățare „realizarea într-o aplicație specifică sistemului de operare … a principalelor operații cu fișiere și directoare (creare, ștergere, redenumire, copiere, mutare, căutare) în vederea organizării resurselor digitale personale”; descriptorul De bază: „operații de bază cu fișiere și directoare (accesare, copiere, ștergere)”. `Proiectul_unitatii_V-U2.md`: același standard și descriptori.
- **Activitatea profesorului** (`data\activitati_lectii_V_VI.json`, V/10): „Exercițiu-traseu: fiecare elev primește o listă de 10 operații pe care le execută în ordine; la final structura obținută se compară cu modelul. Căutarea unui fișier „pierdut” pe calculator, cu instrumentul de căutare.” → atelierul (traseul în pagină, cu teste) și laboratorul (10 pași, model de comparat, căutarea „alarm”).
- **Granița.** Lecția 9 (publicată) = fișierul, folderul, arborele, unitatea, calea, Explorer doar citit — nu le repet, le cer în „Ai nevoie de”. Lecția 11 (alt autor) = organizarea unui folder dezordonat după un criteriu: NU predau criterii de organizare. Lecția 12 = evaluarea. NU predau: arhive/zip, Proprietăți, comenzi rapide, OneDrive, Partajare, tragerea cu mouse-ul (decizia de mai jos).

## Ce presupune lecția că știe elevul (lista cerută, cu bife)
| Noțiunea | Unde e predată | Folosită aici |
|---|---|---|
| desktopul, pictograma Coș de reciclare (Recycle Bin) | lecția 8, pasul „Ecranul Windows” | ✔ P6, laborator |
| fereastra, liniuța (micșorare), X (închidere), bara de activități | lecția 8 | ✔ P6, laborator |
| fișier, nume, extensie după ultimul punct, tip, pictogramă | lecția 9, P1 | ✔ P2, P3 |
| folder = director, arbore, unitate, cale cu `\` | lecția 9, P2-P3 | ✔ peste tot |
| `C:\Windows\Media` și sunetele lui | lecția 9, laborator | ✔ P3, laborator |
| Explorer: deschidere, clic = selectează, dublu-clic = deschide, panoul din stânga, bara de adresă | lecția 9, P4-P5 | ✔ peste tot |
| extensii ascunse, coloana Tip | lecția 9, P6 | ✔ P2 |
| semnele interzise în nume `\ / : * ? " < > |` | lecția 9, P3 „Uite cum” | ✔ P1 (tf), simulator |
| Esc (locul tastei) | lecția 9, P5 | ✔ P2 |
| același nume de cont în laborator (Elev), Users | lecția 9, „Verifică-te” | ✔ simulator (C:\Users\Elev) |
| **predate AICI:** bara de comenzi, clic dreapta, Enter, F2, Ctrl, C/X/V/Z cu Ctrl, Delete/Del, Coșul și Restaurare, fereastra „Înlocuire sau omitere fișiere”, „definitiv”, caseta de căutare | lecția 10 | — |
Nicio noțiune din lecțiile 11-15 (criterii de organizare, Internet, motoare de căutare) nu apare. „Căutare” aici = căutarea din Explorer, nu motorul de căutare (lecția 14).

## Decizii (luate fără profesor; motivul)
1. **Laboratorul fără descărcări, cu fișiere din `C:\Windows\Media`.** Media există pe orice Windows 10/11 (lecția 9 l-a deschis), deci elevul are fișiere reale fără să descarce nimic (descărcarea e lecția 15) și fără folder pregătit de profesor (ora poate fi fără profesor). Din Media doar COPIAZĂ (pagina o spune de trei ori; simulatorul refuză Ștergere/Redenumire acolo, cu motivul; Decuparea o primește, ca Windows, și o refuză la Lipire, unde Windows ar cere permisiunea administratorului — corectat 11.10, după judecata 1, punctul U).
2. **Folderul elevului:** `Ex Nume Prenume`, în Documente, cu spații (fără `_`, ca să nu predau Shift). Lucrează doar în el; la final îl șterge cu Delete (ajunge în Coș) și NU golește Coșul (acolo pot fi fișierele colegilor). Așa Documente rămâne cum l-a găsit (regulile 23 și 25), iar profesorul poate restaura folderul din Coș dacă vrea să vadă lucrarea. Varianta respinsă: ștergerea folderului și din Coș (ar fi cerut „Da” la întrebarea „definitiv”, exact gestul pe care lecția îl învață să-l evite).
3. **Tragerea cu mouse-ul NU se predă**: pe același disc mută, pe alt disc copiază (Microsoft: „Ctrl+mouse … creați o copie”, „Shift+mouse … mutați-l”) — prea multe reguli pentru clasa a V-a; pe telefon, în simulator, tragerea se bate cu derularea. Pasul 4 spune „Nu trage fișierele cu mouse-ul”; simulatorul nu mută nimic la tragerea cu mouse-ul, dar spune pe ecran de ce (11.10, judecata 1, punctul C).
4. **Gesturile reale dese (regula 10):** după fiecare „Încearcă” rezolvat, explicația are o casetă „Acum, dacă ești la calculatorul din laborator: …” cu gestul de o secundă, în folderul lui (folder, redenumire, copiere din Media, mutare, fereastra de același nume cu Omitere, ștergere + Restaurare, căutare). Laboratorul final reia totul într-un traseu (10 pași) și compară cu modelul.
5. **8 pași** (0 + 7): titlul are șase operații, iar fereastra „Înlocuire sau omitere” e o idee separată, de siguranță în laboratorul comun (ca regula 26 la Office). Regula 2 („un pas = o idee”) bate „3-5 pași”, ca la lecția 9.
6. **Ctrl+Z** apare o singură dată, în pliabilul „Vrei să știi mai mult?” de la mutare, cu „pe calculator” și „imediat după” (regula 13), fără exercițiu; e NESIGUR (mai jos). (Până la judecata 1 era în „Uite cum”.)
8. **Pliabilele „Vrei să știi mai mult?” / „Ai Windows 10?”** (11.10, judecata 1, punctul F): ce nu e cerut și nu e exersat (fereastra extensiei la P2, meniul lung și Ctrl+Z la P4, Windows 10 la P1) stă strâns, ca fiecare pas să rămână o idee.
9. **Laboratorul** (11.10, punctele A, G, O, T): 16 puncte scurte, cu căsuță de bifat (nepăstrată, doar pentru elevul de acum) și „Vezi:”; cât durează (15-20 de minute) și „sari la ultimul punct” dacă se termină ora; Coșul se vede micșorând ȘI Explorer, ȘI fereastra lecției; lecția revine din bara de activități; întoarcerea în folder după Restaurare merge oricum s-a deschis Coșul (fereastră sau filă).
7. **Shift, Shift+Delete, Ctrl+Shift+N, selecția multiplă**: nepredate (nu sunt cerute; ar adăuga taste).

## Faptele despre Windows — probate pe calculatorul de lucru (Windows 11 Pro 25H2, în română), fără Explorer pe ecran
Toate probele sunt în `_proba\`; fișierele de probă DOAR în `_proba\sandbox\` (foldere `Ana_Pop_5A`, `Exercitii`).

| Fapt | Cum l-am probat | Dovada |
|---|---|---|
| Lipire în același folder → „tema - Copie.docx”, apoi „tema - Copie (2).docx” | `sonda_operatii.py` S1: IFileOperation.CopyItem în același folder cu redenumire la coliziune (ce face Explorer la Lipire în același loc; fără ea, IFileOperation spune „Numele de fișier al sursei și destinației sunt identice”); șirul `%s - Copie` (windows.storage 4178) | `sonda_operatii.json` |
| Folder nou → „Folder nou”, apoi „Folder nou (2)” | S9: IFileOperation.NewItem | `sonda_operatii_S9.json`; shell32 16888 |
| Fereastra „Înlocuire sau omitere fișiere”: „Se copiază 1 element de la A la B”, „Destinația are deja un fișier cu numele „tema.docx””, „Înlocuire fișier de la destinație” (cu chenar), „Se omite acest fișier”, „Comparați informațiile pentru ambele fișiere” | S2 pe desktopul ascuns (`C:\00\AI_0\tools\hidden_desktop.py`): fereastra procesului meu citită cu UI Automation și fotografiată (PrintWindow); paza a apăsat „Se omite acest fișier” | `capturi_sonda\S2_conflict_omitere_0.png` → `img\inlocuire-sau-omitere.webp` |
| „Se omite acest fișier” lasă fișierul din destinație neschimbat | S2: conținutul lui `Exercitii\tema.docx` a rămas „tema din B (a colegului)” | `sonda_operatii.json` |
| **Enter = Înlocuire** | S2b: Enter trimis ferestrei → `Exercitii\tema.docx` a primit conținutul copiat („tema din A”) | idem |
| La mutare: „Se mută 1 element de la <src> la <dst>” | șirul shell32 33261 (fereastra nefotografiată la mutare) | `stringuri_windows3.json` |
| Delete (cu Coș) nu întreabă nimic (setarea implicită) și pune fișierul în „Coș de reciclare” | S4: ștergere cu FOF_ALLOWUNDO, fără FOF_NOCONFIRMATION → nicio fereastră; fișierul găsit în Coș (Shell.Application NameSpace(10)) cu Locație inițială = folderul de probă | `sonda_operatii.json` |
| Coloanele Coșului: Nume, Locație inițială, Data ștergerii, Dimensiune, Tip element, Data modificării; verbele: Restaurare, Decupare, Ștergere, Proprietăți; Restaurare pune fișierul înapoi | S4 (GetDetailsOf, Verbs, DoIt pe „&Restaurare”) | idem |
| Ștergerea fără Coș: „Ștergere fișier” / „Sigur ștergeți definitiv acest fișier?”, Da (cu chenar) / Nu; Nu păstrează fișierul | S5 pe desktopul ascuns (captură + UI Automation; paza a apăsat Nu) | `capturi_sonda\S5_…png` → `img\stergere-definitiva.webp` |
| Numele din bara de comenzi Windows 11 și sfaturile lor | resursele explorerframe.dll (50195 Nou, 50217-50221, 50228-50231) | `stringuri_windows.json` |
| „Afișați mai multe opțiuni” | Windows.UI.FileExplorer.dll 51792 | `stringuri_windows.json` |
| Panglica Windows 10: filele Pornire / Partajare / Vizualizare; butoanele Folder nou, Redenumire, Decupare, Copiere, Ștergere, Lipire | explorerframe 49921-49933; shell32 31236-31380 (resursele panglicii, încă în Windows 11) | `stringuri_windows2.json` |
| Mesajele simulatorului: semnele interzise (shell32 4109), extensia (4112), subfolderul (6262), Golire / Restaurare totală / Restaurare elemente selectate (31331/31333/31335), întrebările de golire și restaurare (16800, 16917), redenumirea peste un nume existent (16878, 17025, 17029), „Căutați în %1”, „Rezultatele căutării în %1” (explorerframe 13830, 13833) | resursele lui Windows (`sonda_stringuri.py`) | `stringuri_windows*.json` |
| Sunetele din Media: Alarm01-10, Ring01-…, folderele Afternoon, Calligraphy…; data 01.04.2024 10:22, 480 / 324 / 487 / 308 KB | listare + os.stat | — |
| **Lipire după redenumirea sursei** → fereastra „Element negăsit”: „Imposibil de găsit acest element” / „Nu se mai află în <folder>. Verificați locația elementului și încercați din nou.”, butoanele „Încercați din nou” / „Anulare”; nu se lipește nimic. Fără redenumire (martorul), Lipirea merge. | `sonda_lipire_redenumire.py` L1/L2 (11.10, desktopul ascuns, `sandbox2`): Copiere = IDataObject-ul elementului (BHID_DataObject, ce pune Explorer în clipboard), F2 = IFileOperation.RenameItem, Lipire = IFileOperation.CopyItems(IDataObject); fereastra citită cu UI Automation; clipboardul real neatins | `sonda_lipire_redenumire.json`, `capturi_sonda\L1_…png`; shell32 16864, 16865 |
| **Restaurare peste un nume existent** → „Înlocuire sau omitere fișiere”, „Se mută un element la Restaurare” și „Destinația are deja un fișier cu numele „$RF1WO0C.txt”” (numele intern din Coș, nu cel din folder); „Se omite” lasă elementul în Coș, fișierul din folder neatins | L3 (verbul „&Restaurare” prin Shell.Application); curățenia: 0 elemente ale mele în Coș la final; registrul: 0 schimbări | idem |
| Tastele Explorer-ului (F2, Ctrl+D/Delete → Coș, Shift+Delete, Ctrl+Shift+N, Ctrl+X/C/V/Z, Ctrl+E/F, F3) | Microsoft ro-ro și en-us „Comenzi rapide de la tastatură în Windows” (descărcate de lecția 9: `lectii\v\m2-l09\_proba\surse_web\taste_ro.txt`, `taste_en.txt`) | — |

**Ce NU s-a putut proba cu o sondă:** IFileOperation.RenameItem (S6, S7) dă alte ferestre decât redenumirea din Explorer („O eroare neașteptată… 0x80070057”), deci ferestrele de redenumire NU sunt probate (vezi „Nesigur”). Meniul clasic al locului gol, cerut prin `IShellFolder::CreateViewObject` în procesul meu, nu are „Anulare” (îl adaugă vederea Explorer), deci Ctrl+Z nu e probat.

**Regula 25 (calculatorul profesorului).** Explorer NU a fost pornit; nicio fereastră pe ecranul vizibil (toate pe desktopul ascuns, în procesul meu, oprit de `hidden_desktop.py` la expirare: două rulări au expirat, procesele au fost oprite după PID de unealtă). Coșul: elementul meu (`notite.txt`) a intrat și a fost restaurat; verificat la final: 0 elemente ale mele în Coș. Clipboardul nu a fost atins (operațiile prin IFileOperation, nu prin Ctrl+C/V). Registrul Explorer: instantaneu în memorie în sonda S9 → 0 schimbări; pentru rulările întrerupte, `registru_ora.py` + `registru_subarbore.py` (ora scrierii cheilor BagMRU/Bags/ComDlg32/RecentDocs/TypedPaths; ieșirile nu se păstrează, au nume de foldere ale profesorului) → nicio cheie scrisă de mine: nodurile scrise între 23:46 și 00:08 sunt ale altor procese (23:46, înaintea primei mele sonde; 00:07, fereastra „Salvare” a altei sesiuni, `ComDlg32\OpenSavePidlMRU\png`; nodul `lectii` la 00:07:45, după ultima mea sondă). Nu am pus nimic la loc (nu era nimic al meu).

**Regula 22.** Cererile web (API-ul Commons, paginile Microsoft) au plecat doar cu User-Agent „LearningHub-lectii/1.0 (educational site)”.

## Numele RO / EN
`calibrare\meniuri_ro_en.json` nu are Windows. RO = din resursele lui Windows 11 în română (tabelul de mai sus). Pe acest calculator **nu există resurse en-US** (doar `ro-RO\*.mui`; `_proba\sonda_stringuri_en.py`, 11.10), deci EN vine din paginile Microsoft (citite 11.10.2026):
- Cut, Copy, Paste, Rename, Delete, Recycle Bin — Microsoft en-us „Keyboard shortcuts in Windows”;
- **New** > Folder — https://support.microsoft.com/en-us/word/create-a-new-folder („select New > Folder”);
- **Show more options** — https://support.microsoft.com/en-us/windows/experience/fileexplorer/file-explorer-in-windows;
- **Replace the file in the destination**, **Skip this file**, **Compare info for both files** — Microsoft Q&A https://learn.microsoft.com/en-us/answers/questions/3219983/do-this-for-all-conflicts-when-copying-moving-file;
- **Restore**, **Original Location** — Microsoft Q&A https://learn.microsoft.com/en-us/answers/questions/2787670/where-are-restored-files-from-recycle-bin;
- **„ - Copy”** („My Stuff - Copy.doc”) — Microsoft Q&A https://learn.microsoft.com/en-us/answers/questions/4029867/copy-a-file-to-the-same-folder-no-longer-appends-t.

În pagină: o dată fiecare, cu italic (P1, P3, P4 pliabil, P5, P6). **NESIGUR EN, nescrise în pagină:** titlul ferestrei „Înlocuire sau omitere fișiere” (doar surse terțe: „Replace or Skip Files”), numele implicit „Folder nou” (nicio pagină Microsoft găsită), „Element negăsit”, Home (Pornire).

## Lecțiile și jocurile folosite
- `jocuri\fisiere-v` („Misiunea Ordine”), nivelurile 4 „Creez și redenumesc” și 5 „Copiez, mut, șterg, caut” (lecția 10): refolosite ideile (strategia de redenumire, nume bune, copiere vs mutare, Coșul, căutarea după o parte din nume) și capturile `meniu-nou-folder`, `redenumire-f2`, `cos-restaurare`, `cautare-explorer`, `structura-matei` (bara de comenzi). **Verificat față de Windows:** jocul spune „Restaurare” în Coș (corect, captura și S4); „Vizualizare → Afișare → Extensii nume fișiere” NU l-am preluat (lecția 9 a decis să nu se schimbe setarea pe calculatorul comun); „Shift+Delete” și ștergerea de pe stick „definitiv” — păstrate doar ca întrebarea „definitiv”, cu „de obicei” la stick; „În același folder nu pot sta două fișiere cu exact același nume” — confirmat indirect (S1: Windows dă alt nume copiei).
- Lecțiile 8 și 9 (desktopul, Coșul pe desktop, Explorer, Media, numele contului „Elev”).

## Imagini (`img\SURSE.json`)
Copiatorul (pasul 0): Wikimedia Commons, CC0, Dennis Sylvester Hurd (licența citită din API, 11.10.2026). Capturile: refolosite din `jocuri\fisiere-v\img` (Windows 11 RO) și două noi, ale ferestrelor procesului meu pe desktopul ascuns (numele din ele sunt ale folderelor de probă). Respinsă: „Paper To Paper Bin.jpg” (CC BY-SA 3.0, dar e o fotografie de produs, cu marcă și telefon).

## Nesigur (de confirmat în laborator / de dirijor)
1. **Ctrl+Z** după mutare/ștergere în Explorer (A16): doar din resurse + Microsoft („Anulați o acțiune”); câte operații înapoi — neprobat (simulatorul ține o stivă).
2. **Stickul** (A24): ștergerea de pe stick „de obicei” definitivă — neprobată (n-am stick); pagina spune „de obicei” și învață semnul (întrebarea „definitiv”).
3. **Ferestrele redenumirii**: schimbarea extensiei (titlul „Redenumire”, Da/Nu), numele existent („Redenumire fișier”, „Redenumiți … ca … (2)?”), numele gol (simulatorul păstrează numele vechi; Windows are și mesajul „Trebuie să tastați un nume de fișier.”), Esc la redenumire, caseta gata de scris după Folder nou (A04, A08, A10, A30).
4. **Extensiile ascunse la redenumire** (A09): „Romania” peste „harta” → Romania.png; „x.jpg” peste un .png ascuns → „x.jpg.png” (în simulator). Pe calculatorul de lucru extensiile se văd, nu am schimbat setarea.
5. **Meniul de clic dreapta pe un fișier** (A15): rândul de sus fotografiat doar în Coș; pe un fișier obișnuit presupun Decupare, Copiere, Redenumire, Partajare, Ștergere. „Lipire” în rândul de sus al meniului locului gol, când ai ceva de lipit — presupus.
6. **Coșul în Windows 11**: butoanele Golire / Restaurare totală / Restaurare elemente selectate în bara de comenzi și titlul ferestrei de golire („Ștergere mai multe elemente” în simulator) — din resurse/presupus.
7. **Pictograma Coș de reciclare pe desktopul din laborator** (A22) — poate lipsi pe calculatoare configurate de școală.
8. **Windows 10** (A03): filele panglicii din resurse, fără Windows 10 de probat.
9. Tipul „Fișier WAV” din simulator (pe calculatorul de lucru Media e în vederea Muzică, fără coloana Tip); fișierul decupat „mai șters” (A31).
10. „Comparați informațiile pentru ambele fișiere” (A19): ce arată, neprobat.
11. **Căutarea după bucăți din nume** (A35): un cuvânt de după „_” sau o bucată din mijlocul unui cuvânt — depinde de indexare, neprobat. Pagina spune doar „un cuvânt întreg sau începutul numelui”; simulatorul găsește doar începutul numelui sau al unui cuvânt de după spațiu.
12. **Redenumirea unui FOLDER cu un nume existent**: titlul și textul sunt din resurse (shell32 16885, 17041); dacă Windows propune „(2)” sau altceva — neprobat (A30).
13. **Întrebarea „muți în Coș?” la Delete** (A37): apare doar cu confirmarea pornită; laboratorul spune „dacă întreabă, Da”.
14. **„Lipire” în meniul de clic dreapta al unui FOLDER** (Windows 11 pune acolo Lipire, care lipește ÎN folder?): neprobat; simulatorul nu o are (refuzat la judecata 1, punctul U).
15. **Tragerea cu mouse-ul** (A36): implicitul (același disc = mutare, alt disc = copiere) din documentație, neprobat pe ecran.
16. **Coșul deschis ca filă** în Explorer (Windows 11 nou): laboratorul nu mai depinde de asta (punctul O).

## Simulatorul `lectii\_sim\explorer-operatii.js` (nou; proprietar: lecția V/10)
Explorer mic cu operații: bara de comenzi (Nou ▾ → Folder, Decupare, Copiere, Lipire, Redenumire, Ștergere), clic dreapta / ținut apăsat (meniul elementului, al locului gol, al Coșului, cu „Afișați mai multe opțiuni”), tastele (Ctrl+C/X/V/Z, F2, Delete, Ctrl+D, Shift+Delete, Ctrl+Shift+N, Enter, Backspace, Alt+←/↑, săgeți, Home/End, Ctrl+E/F/F3, Shift+F10), redenumirea în rând (semnele interzise cu balonul lui Windows, extensia ascunsă rămâne, întrebarea la schimbarea extensiei, numele existent), Lipire cu „ - Copie”, fereastra „Înlocuire sau omitere fișiere” (Enter = Înlocuire), Coșul de pe „desktop” (dublu-clic), Restaurare, ștergerea definitivă (stick / Shift+Delete / din Coș), căutarea în folder și subfoldere, Anulare. Fidelitatea: capul fișierului (ce e probat, ce e nesigur, abaterile spuse pe ecran).
**Defect găsit și reparat la mine:** coloana „Data modificării” avea clasa `d`, aceeași cu pictograma folderului (`exo-ic d`), iar regula de telefon care ascunde coloana ascundea și pictograma folderelor. Același defect îl are `lectii\_sim\explorer-citire.js` (lecția 9, NU l-am atins): `.exc-rand .d{display:none}` sub 560 px ascunde pictograma folderelor din listă pe telefon (`.exc-ic.d`) — **pentru dirijor / proprietarul lecției 9**.

## Pentru lecția următoare (V/11, V/12)
- Încarci `<script src="../../_sim/explorer-operatii.js"></script>` și `tipuri:{explorerop:SimExplorerOperatii}`. Configurația (capul fișierului, „API”): `fs`, `unitati` (cu `stick:true`), `doc`, `afisat`, `blocat`, `doarCitire`, `cos` (al altora; `'meu'` = al elevului), `start`, `extensii`, `acum`, `checks`, `solutie`, `gresit`.
- Testele gata făcute: `are`, `nu`, `in`, `sel`, `cos`, `restaurat`, `gasit`(+`cautat`), `neatins` (fișierul nu a fost înlocuit), `cosNeatins` (Coșul altora neatins), `copii` (`{copii:folder,n:N}` — numărul de elemente dintr-un folder, util la „compară cu modelul”), `intrebat` (a apărut întrebarea „definitiv”), `toate` (mai multe condiții într-un test). Operațiile pentru soluții: `cd sel nou ren copy cut paste omite inlocuieste del shiftdel da nu rest cauta undo`.
- `window.ExplorerOperatii` = `{stare, aplica, test, numeCopie, numeLiber, model, afis, copii}` (pentru probe); evenimentul `explorer-operatii` pe `window`, cu `{tip, cale}`, la fiecare operație.
- **Ce nu ai voie să schimbi:** comportamentul probat (numele „ - Copie”, „Folder nou (2)”, fereastra de conflict cu Enter = Înlocuire, Delete fără întrebare pe disc, „definitiv” pe stick, refuzul semnelor interzise). Ai nevoie de altceva (selecție multiplă, sortare, tragere)? Extensie cu nume nou în `lectii\_sim\`, ca regula proprietarului; nu modifici fișierul fără proprietar.
- Lecția 10 lasă în laborator: nimic în Documente (folderul elevului e în Coș). Lecția 11 nu se poate baza pe el.
- **Schimbări de comportament în `explorer-operatii.js` (11.10.2026, 01:30-02:10, runda de reparații după judecata 1; API-ul, forma configurației și numele testelor NU s-au schimbat):**
  1. **Lipirea după redenumirea / mutarea / ștergerea sursei** (probat, L1): Copiere ține minte CALEA de atunci. Înainte, redenumirea muta clipboardul pe numele nou; acum Lipirea arată fereastra „Element negăsit” („Încercați din nou” / „Anulare”) și nu lipește nimic. Și ștergerea sursei nu mai golește clipboardul (aceeași fereastră). O soluție (`solutie`) care redenumește apoi lipește trebuie să aibă din nou `['copy', numeNou]` înainte de `['paste']`.
  2. **Restaurarea peste un nume existent** (probat, L3): în loc de refuz cu mesaj, fereastra „Înlocuire sau omitere fișiere” („Se mută un element la Restaurare”, cu numele intern din Coș, de forma $R…); `['inlocuieste']` pune elementul din Coș peste cel din folder, `['omite']` îl lasă în Coș. „Restaurare totală elemente” le sare pe cele în conflict și spune asta.
  3. **Căutarea** (nesigur, ales prudent): găsește doar dacă textul e începutul numelui sau al unui cuvânt de după spațiu („arm” nu mai găsește Alarm02; „toamna” nu găsește „compunere_toamna”). Testul `gasit` cu `cautat` e neschimbat.
  4. **Tragerea cu mouse-ul** și **Ctrl/Shift+clic**: nu fac nimic, dar acum spun pe ecran de ce; rândul de sus al simulatorului o scrie.
  5. **Redenumirea unui folder** cu un nume existent: titlul „Redenumire folder” și „…un folder cu același nume.”.
  6. **Lipirea unui folder peste unul cu același nume**: fișierele care se ciocnesc tot se omit, dar acum apare mesajul că în Windows ar veni, pentru fiecare, „Înlocuire sau omitere fișiere”.
  7. **Nou, sub teste:** butonul „↺ Reîncep exercițiul” (starea de la început a sarcinii) și, la „Verifică”, mesajul „Testul … nu mai poate trece: …” când un test `neatins` pică pentru că fișierul a fost înlocuit, sau `cosNeatins` pentru că s-a golit Coșul.
  8. **Telefon:** în Coș, Locația inițială trece sub nume, întreagă.

## Runda de reparații după judecata 1 (11.10.2026, autor proaspăt)
Registrul punctelor (opus + sonnet, fără dubluri, literele A…V) și ce s-a schimbat unde: `_verificare\registru_j1.md`. Probe noi: `_proba\sonda_lipire_redenumire.py` (L1-L3), `_proba\sonda_stringuri_en.py`; `_proba\parcurge.py` are acum și: Înlocuire la pasul 5 → mesajul „nu mai poate trece” + „Reîncep exercițiul”, Lipirea după redenumire, restaurarea peste același nume, căutarea „arm”, tragerea și Ctrl+clic (1280), căsuțele laboratorului.

## Poarta și probele
- `test_joc.py --dir lectii\v m2-l10` → TRECUT (29 de întrebări jucate pe Pixel 7 + iPhone SE; avertismentul „1 niveluri” e cel așteptat).
- `verifica_lectie.py index.html --fara-t1` → ultima linie 0 (S0 TRECUT, S1 0 identice, S2 8/8 aplicare/execuție, T0 0; avertisment fără verdict: densitatea antetului).
- `_proba\parcurge.py` (Playwright, rețeaua blocată, `ctx.close()`): gesturi REALE — la 1280 px clicuri, clic dreapta, Ctrl+C/X/V/Z, F2, Delete; la 390 px (Pixel 7) atingeri, bara de comenzi, ținut apăsat pentru meniu; la fiecare exercițiu „Verifică” fără nimic (respins), apoi soluția; gesturile libere (fișier deschis, semn interzis, Esc, folder în el însuși, Ctrl+Z, golirea Coșului → Nu). Rezultatul: `parcurge_log.txt`, ultima linie = numărul de probleme; capturile de telefon `telefon_*.png` (privite).
