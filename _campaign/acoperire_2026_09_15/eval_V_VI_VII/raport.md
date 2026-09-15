# Evaluare independentă — adăugirile de acoperire V / VI / VII (15.09.2026)

Doar elementele schimbate față de HEAD (`diff.patch`). Surse: `unitati.json` (lecții), `curriculum.json` (prin poartă + `acoperire.py`), support.microsoft.com/ro-ro prin curl (`surse\*.txt`).

## Verificat pe sursă primară (Microsoft ro-ro, text brut)
- Word: Ctrl+O „Deschiderea unui document”, Ctrl+N „Crearea unui document nou”, Ctrl+W „Închideți documentul” (`surse\word_taste.txt` r.159-167). ✔
- PowerPoint expunere: F5 „de la început”, Shift+F5 „de la diapozitivul curent”, B/punct „diapozitiv negru ... sau reveniți”, Esc „Încheiați prezentarea”, Enter/săgeată dreapta = următorul, săgeată stânga = anteriorul (`ppt_taste_expunere.txt` r.140-170). ✔
- „Vizualizarea prezentator”: notele pe laptop, publicul vede diapozitivele (`ppt_prezentator.txt` r.106). ✔
- Avansare „La clic de mouse” / „După”, pe fila Tranziții, grupul Temporizare (`ppt_temporizare.txt` r.146-160). ✔
- File: Pornire (fonturi, paragrafe), Inserare (tabele, imagini, linkuri), Proiectare (teme), Tranziții, Animații, Expunere diapozitive (`ppt_taste_creare.txt` r.655-690); Ctrl+C/Ctrl+V pentru „textului, obiectului sau diapozitivului” (r.170-173). ✔

## Recalculat
- 1 PB = 1024 TB (convenția paginii, 1024 pe treaptă). Ordinea CD 700 MB < DVD 4,7 GB (4812,8 MB) < stick 64 GB < SSD 512 GB < HDD 2 TB (2048 GB): unică, cheia bună. ✔

## Jucat (Playwright, iPhone SE + Pixel 7) — `joaca_rezultat.json`
- `diapozitiv` N5 și N8: gresit() (galben pe alb) respins cu „Textul galben pe fundal alb se vede slab...”; titlu 20 + text 44 respins cu mesaj clar; drum diferit (alb pe bleumarin, rânduri scoase altfel) ACCEPTAT.
- `montaj` N4 și N7: capăt netăiat respins („încă rămâne: cineva trântește ușa”); dubla ratată lăsată pe pistă respinsă; drum diferit (adăugare în ordinea bibliotecii, reordonare cu butoanele, tăiere prea mult și revenire) ACCEPTAT.
- word-vii N1: Ctrl+N respins, Ctrl+O acceptat; tf acceptat pe Adevărat; lățime 320/412 fără depășire; 0 erori JS.

## Semnalări
### Important (reparat)
1. audio-video-vii N4: întrebarea nouă copiere vs mutare cerea o diferență nepredată pe pagină (pagina dădea același gest „tragi clipul” pentru ambele). Reparat (`modificari.md`).

### Minore (nereparate — țin de gust sau nu sunt dovedite)
2. calculator-v N6: „hard disk 500 GB–4 TB”, „stick 16–256 GB” sunt prezentate ca intervale, fără „de obicei”; există HDD-uri și stickuri mai mari. Neverificat pe sursă (paginile producătorilor nu s-au putut extrage cu curl).
3. Pagini peste 120 de cuvinte: calculator-v N6 (128), prezentari-vi N7 (125), audio-video-vii N2 (121). 6 întrebări pe nivel (doctrina §6 cere 4-5): calculator-v N5, N6; prezentari-vi N1; audio-video-vii N2, N4; word-vii N1.
4. audio-video-vii N3 „Formate și comprimare” declară conținutul „gestionare (...salvare...)”: legătură slabă (pagina predă formate, nu operațiile de gestionare). Nu creează gol fals: N2 îl acoperă real.
5. word-vii N1: distractorul Ctrl+Y e predat abia la N2; „Azi vrei să mai scrii la ea” (ea = compunerea, dar enunțul numește doar fișierul).
6. audio-video-vii, întrebarea „Ce deschizi?”: varianta corectă repetă „salvat ieri” și „proiectul” din enunț (parțial echilibrat de „exportat ieri” și „proiect nou”).
7. prezentari-vi gresit(): comentariul din cod spune contrast „~1,8”; calculat 1,67. Nu se vede de copil.

### Declarații verificate fără probleme
calculator-v (7 niveluri), internet-vi (6), prezentari-vi (8; „Expun prezentarea” pe lecția 8: lecția 3 din `unitati.json` nu mai are „expunere” în titlu), audio-video-vii (7), word-vii `acoperire.json` (7). word-obiecte-vii nu contrazice word-vii: aceleași texte PROG, Ctrl+W = închidere în ambele (word-obiecte-vii r.369), F12/Ctrl+P fără suprapunere.

## De decis de profesor
- (2) Intervalele de capacitate: adaugi „de obicei” sau lași exemplele ca atare?
- (3) Accepți 6 întrebări/nivel și paginile de 121-128 de cuvinte, sau tai câte o întrebare?
- (4) Păstrezi declarația „gestionare” pe audio-video-vii N3?
