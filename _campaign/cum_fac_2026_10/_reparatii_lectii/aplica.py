import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
L = 'C:/00/Projects/LearningHub/lectii/'

# (fisier, vechi, nou)
R = []
def r(f, v, n): R.append((f, v, n))

# 1-2. VII/3
f = 'vii/m1-l03/index.html'
r(f, "Word e închis. Pornește-l din meniul Start (butonul <b>⊞ Start</b>, jos, apoi <b>Word</b>) și fă un document nou din șablonul <b>Diplomă</b>.",
     "Word e închis. Apasă <b>⊞ Start</b> și alege <b>Word</b> (în Word-ul adevărat scrii „word” după Start și alegi Word din rezultate, fiindcă nu e mereu fixat în meniu). Apoi fă un document nou din șablonul <b>Diplomă</b>.")
r(f, "cum:'Apasă ⊞ Start, jos, apoi Word.'",
     "cum:'Apasă ⊞ Start, jos, apoi Word. În Word-ul adevărat: Start, scrii „word”, alegi Word din rezultate.'")
r(f, "cum:'Pe pagina de început, dă clic pe șablonul Diplomă, nu pe Blank document.'",
     "cum:'Pe pagina de început, alege șablonul Diplomă, nu Blank document. În Word-ul adevărat, un clic pe șablon îl arată doar mai mare: documentul vine cu dublu-clic pe șablon sau cu butonul Creare (Create).'")
r(f, "ajutor:'⊞ Start, Word, apoi pe pagina de început alege dala Diplomă.',",
     "ajutor:'⊞ Start, Word, apoi pe pagina de început alege dala Diplomă. În Word-ul adevărat: dublu-clic pe dală sau, după un clic, butonul Creare (Create).',")
r(f, "why:'Pe pagina de început ai ales șablonul: documentul nou vine gata aranjat.'},",
     "why:'Pe pagina de început ai ales șablonul: documentul nou vine gata aranjat. În Word-ul adevărat, un clic pe șablon îl arată doar mai mare; documentul vine cu dublu-clic sau cu butonul Creare (Create).'},")

# 3-5. V/8
f = 'v/m2-l08/index.html'
r(f, "Pe Windows 11 e primul din grupul de butoane din mijlocul barei. Pe Windows 10 e în colțul din stânga jos.</p>",
     "Pe Windows 11 bara e de obicei centrată, iar Start e primul din grupul de butoane din mijlocul ei. Dacă bara e aliniată la stânga (ca pe Windows 10), Start e în colțul din stânga jos.</p>")
r(f, "jos, la începutul grupului din mijloc. În meniu, caută Paint.'",
     "jos, la începutul grupului din mijloc (dacă bara e aliniată la stânga, în colțul din stânga jos). În meniu, caută Paint.'")
r(f, "<li><strong>Închidere</strong> (X): închide fereastra și oprește aplicația.</li></ul>",
     "<li><strong>Închidere</strong> (X): închide fereastra. Dacă era singura fereastră a aplicației (ca la Paint), se oprește și aplicația; dacă aplicația mai are alte ferestre, ea rămâne pornită.</li></ul>")
r(f, "ajutor:'Care buton închide fereastra și oprește aplicația?',why:'X (Închidere) oprește aplicația. Liniuța",
     "ajutor:'Care buton închide fereastra?',why:'X (Închidere) închide fereastra; fiind singura fereastră a aplicației, o oprește și pe ea. Liniuța")
r(f, "ajutor:'X închide și oprește aplicația. Liniuța doar ascunde fereastra.',",
     "ajutor:'X închide fereastra (și oprește aplicația, dacă era singura ei fereastră). Liniuța doar ascunde fereastra.',")
r(f, "sau pe pictograma ei din bara de activități. Ea vine deasupra: e fereastra în care lucrezi acum.</li>",
     "sau pe pictograma ei din bara de activități. Dacă aplicația are mai multe ferestre, clicul pe pictogramă le arată pe toate, iar tu alegi una. Fereastra aleasă vine deasupra: e fereastra în care lucrezi acum.</li>")
r(f, "sau pe pictograma lui din bara de activități. Nu pe foaia albă.',",
     "sau pe pictograma lui din bara de activități (dacă aplicația are mai multe ferestre, clicul pe pictogramă le arată pe toate și alegi una). Nu pe foaia albă.',")

# 6. VI/4
f = 'vi/m1-l04/index.html'
r(f, "<strong>Casetă text (Text Box)</strong>: apeși butonul, dai un clic pe diapozitiv și tastezi.</li>",
     "<strong>Casetă text (Text Box)</strong>: apeși butonul, apoi dai un clic pe diapozitiv sau tragi cu mouse-ul (ca să desenezi caseta) și tastezi.</li>")
r(f, "<strong>Forme (Shapes)</strong>: alegi forma, apoi dai un clic pe diapozitiv.</li>",
     "<strong>Forme (Shapes)</strong>: alegi forma, apoi dai un clic pe diapozitiv sau tragi cu mouse-ul.</li>")
r(f, "un cerc (<i>Oval</i>) → un clic pe diapozitiv. Sus s-a deschis",
     "un cerc (<i>Oval</i>) → un clic pe diapozitiv sau tragi cu mouse-ul. Sus s-a deschis")

# 7. VI/6
f = 'vi/m1-l06/index.html'
r(f, "<strong>Reset Background</strong> (Resetare fundal) pune înapoi fundalul temei.",
     "<strong>Reset Background</strong> (Resetare fundal) renunță la fundalul pe care l-ai ales, dacă n-ai apăsat încă Apply to All (Aplicare la toate).")

# 8. VII/6 si VII/9
f = 'vii/m1-l06/index.html'
r(f, "(merge și cu punct: 1.25 cm)", "(aici, în fereastra Paragraf, merge și cu punct: 1.25 cm)")
f = 'vii/m2-l09/index.html'
r(f, "Dacă Word nu primește virgula (0,5), scrie cu punct (0.5).`,",
     "Scrie numerele cu virgulă (0,5): pe un calculator cu setări românești, cu punct (0.5) Word spune „This is not a valid measurement.”.`,")
r(f, "Într-o casetă a rămas ceva lângă număr: <b>OK</b> pe mesaj; Word selectează tot ce scrie în caseta greșită, deci scrii direct numărul.",
     "Într-o casetă a rămas ceva lângă număr sau ai scris cu punct (0.5) în loc de virgulă (0,5): <b>OK</b> pe mesaj; Word selectează tot ce scrie în caseta greșită, deci scrii direct numărul, cu virgulă.")

# afirmatii.json: modificari pe text
A = []
def a(f, v, n): A.append((f, v, n))
S_MS = "sursa: documentația Microsoft, neprobat în aplicație"
a('vi/m1-l04/afirmatii.json',
  "\"actiune\": \"Insert → Text Box, apoi un singur clic pe diapozitiv (fără tragere), apoi tastezi Proiect la geografie.\",",
  "\"actiune\": \"Insert → Text Box (sau Shapes → o formă), apoi un clic pe diapozitiv sau tragi cu mouse-ul, apoi tastezi Proiect la geografie.\",")
a('vi/m1-l04/afirmatii.json',
  "\"stare_autor\": \"NETESTAT (MS ro-ro descrie „faceți clic și glisați”; varianta cu un singur clic e de confirmat)\"",
  "\"stare_autor\": \"NETESTAT (sursa oficială pentru Windows spune „click and drag”: https://support.microsoft.com/en-us/powerpoint/add-text-to-a-slide și https://support.microsoft.com/en-us/powerpoint/add-shapes; varianta cu un singur clic e scrisă oficial doar pentru Mac; lecția spune acum «un clic sau tragi». " + S_MS + ")\"")
a('vi/m1-l06/afirmatii.json',
  "\"rezultat_promis\": \"Diapozitivul revine la fundalul temei.\",\n   \"aplicatie\": \"PowerPoint\",\n   \"stare_autor\": \"NETESTABIL_COM\",",
  "\"rezultat_promis\": \"Reset Background renunță la fundalul ales, dacă n-ai apăsat încă Apply to All; după Apply to All, ce face e de probat (lecția nu promite nimic).\",\n   \"aplicatie\": \"PowerPoint\",\n   \"sursa\": \"https://support.microsoft.com/en-us/powerpoint/use-eyedropper-to-match-colors-on-your-slide — " + S_MS + "\",\n   \"stare_autor\": \"NETESTABIL_COM\",")
a('vii/m2-l09/afirmatii.json',
  "\"actiune\": \"Pe un Windows cu setări românești scrii „0.5” (cu punct) la o margine.\",\n   \"rezultat_promis\": \"Word spune „This is not a valid measurement.”; cu virgulă („0,5”) merge.\",",
  "\"actiune\": \"Pe un Windows cu setări românești scrii „0.5” (cu punct) la o margine.\",\n   \"rezultat_promis\": \"Word spune „This is not a valid measurement.”; cu virgulă („0,5”) merge. Lecția spune acum asta în laborator (punctele 3 și 4).\",\n   \"sursa\": \"separatorul zecimal vine din setările regionale: https://learn.microsoft.com/en-us/office/vba/api/word.wdinternationalindex; proba pe calculator: A17 + judecător\",")
a('v/m2-l08/afirmatii.json',
  "\"rezultat_promis\": \"Pe Windows 11 e primul din grupul de butoane din mijlocul barei; pe Windows 10, în colțul din stânga jos.\",",
  "\"rezultat_promis\": \"Pe Windows 11 bara e de obicei centrată și Start e primul din grupul din mijloc; dacă bara e aliniată la stânga, Start e în colțul din stânga jos.\",")
a('v/m2-l08/afirmatii.json',
  "\"rezultat_promis\": \"Închide fereastra și oprește aplicația; butonul ei dispare de pe bara de activități.\",",
  "\"rezultat_promis\": \"Închide fereastra; aplicația se oprește doar dacă era singura ei fereastră (Paint), iar atunci butonul ei dispare de pe bara de activități. Cu mai multe ferestre, aplicația rămâne pornită.\",")

# afirmatii noi, adaugate la sfarsit
def nou(f, entries):
    a(f, "\n  }\n ]\n}", "\n  },\n" + ",\n".join(entries) + "\n ]\n}")
nou('vii/m1-l03/afirmatii.json', [
 """  {
   "id": "A45",
   "loc": "pasul 2, Încearcă 2 (șablonul Diplomă): q, cum, ajutor, why",
   "actiune": "În Word-ul adevărat, pe pagina de început dai un clic pe un șablon.",
   "rezultat_promis": "Un clic deschide doar o previzualizare mare; documentul vine cu dublu-clic pe șablon sau cu butonul Creare (Create) din previzualizare. (Simulatorul din pagină face documentul deja la un clic: de reparat separat.)",
   "aplicatie": "Word",
   "sursa": "https://support.microsoft.com/en-us/office/basic-tasks-in-word-87b3243c-b0bf-4a29-82aa-09a681999fdc · https://support.microsoft.com/en-us/word/training/create-a-document-in-word — sursa: documentația Microsoft, neprobat în aplicație"
  }""",
 """  {
   "id": "A46",
   "loc": "pasul 2, Încearcă 2 (cerința: pornirea lui Word)",
   "actiune": "Apeși Start, scrii „word” și alegi Word din rezultate.",
   "rezultat_promis": "Word pornește; nu e mereu fixat în meniul Start, deci poate să nu fie în listă.",
   "aplicatie": "Windows + Word",
   "sursa": "https://support.microsoft.com/en-us/office/can-t-find-office-applications-in-windows-10-907ce545-6ae8-459b-8d9d-de6764a635d6 · https://support.microsoft.com/en-us/windows/find-your-office-apps-in-windows-76a91bce-ba92-b406-7213-0f4c4fe0d51c — sursa: documentația Microsoft, neprobat în aplicație"
  }"""])
nou('v/m2-l08/afirmatii.json', [
 """  {
   "id": "A27",
   "loc": "P6 text + Î6 (aplicația adevărată, treci la altă fereastră)",
   "actiune": "Dai clic pe pictograma unei aplicații cu mai multe ferestre, din bara de activități.",
   "rezultat_promis": "Se arată ferestrele ei, iar tu alegi una; la o aplicație cu o singură fereastră (Paint), clicul o aduce direct deasupra.",
   "aplicatie": "windows",
   "sursa": "https://support.microsoft.com/en-us/windows/customize-the-taskbar-in-windows-0657a50f-0cc7-dbfd-ae6b-05020b195b07 · https://learn.microsoft.com/en-us/windows/win32/uxguide/winenv-taskbar — sursa: documentația Microsoft, neprobat în aplicație",
   "stare": "activ"
  }""",
 """  {
   "id": "A28",
   "loc": "P4 text + Încă 2 + Î3 + Î5 (Închidere X)",
   "actiune": "Dai clic pe X (Închidere) într-o aplicație cu mai multe ferestre.",
   "rezultat_promis": "Se închide doar fereastra aceea; aplicația rămâne pornită cât timp are alte ferestre.",
   "aplicatie": "windows",
   "sursa": "https://learn.microsoft.com/en-us/windows/win32/uxguide/win-window-mgt — sursa: documentația Microsoft, neprobat în aplicație",
   "stare": "activ"
  }"""])
nou('vii/m1-l06/afirmatii.json', [
 """  {
   "id": "A36",
   "loc": "pasul 6 (text): „aici, în fereastra Paragraf, merge și cu punct”",
   "actiune": "În fereastra Paragraph scrii la By „1.25 cm” (cu punct).",
   "rezultat_promis": "Merge, la fel ca „1,25 cm”; doar în fereastra Paragraph (la marginile din Page Setup punctul dă eroare, vezi VII/9).",
   "aplicatie": "Word",
   "sursa": "probat în A20 (fereastra_paragraph_punct_sau_virgula); separatorul zecimal vine din setările regionale: https://learn.microsoft.com/en-us/office/vba/api/word.wdinternationalindex"
  }"""])

bad = 0
by = {}
for f, v, n in R:
    by.setdefault(f, []).append((v, n))
for f, v, n in A:
    by.setdefault(f, []).append((v, n))
for f, lst in by.items():
    tt = open(L + f, encoding='utf-8', newline='').read().replace(chr(13)+chr(10), chr(10))
    for v, n in lst:
        if tt.count(v) != 1:
            print('EROARE', f, tt.count(v), v[:70]); bad += 1
if bad:
    sys.exit(1)
for f, lst in by.items():
    p = L + f
    t = open(p, encoding='utf-8', newline='').read()
    crlf = '\r\n' in t
    if crlf:
        t = t.replace('\r\n', '\n')
    for v, n in lst:
        c = t.count(v)
        if c != 1:
            print('EROARE', f, c, v[:70]); bad += 1
    if bad:
        continue
    for v, n in lst:
        t = t.replace(v, n)
    if crlf:
        t = t.replace('\n', '\r\n')
    open(p, 'w', encoding='utf-8', newline='').write(t)
    print('ok', f, len(lst))
print('erori', bad)
