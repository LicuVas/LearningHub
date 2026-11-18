# Runda 3 · etapa B · Word · CONTRA (pasul 4)

**Cel mai puternic argument PENTRU plan:** N1, N2, GRAV 3 și N3 au cauza numită de critic la fișier:rând și o reparație
mică, locală (o redesenare uitată, o ordine greșită a ascultătorilor, o ramură care tace, o compunere neîncheiată).
Toate patru se probează cu gesturi reale, înainte (17/19 picate) și după, și nu ating nicio lecție.

**Cel mai puternic argument ÎMPOTRIVĂ:** N4 cere ferestre fără referință (fereastra „Save your changes…”, Word fără
document după Ctrl+W, fereastra Open). Dacă le construiesc, inventez din memorie (interzis: „Nu inventezi ferestre din
memorie”); dacă nu le construiesc, N4 rămâne deschis, iar drumul lecției m1-l03 se oprește tot într-un mesaj la Ctrl+W.
Iar reparația N3 umblă la locul în care s-a reparat GRAV 1 (dublarea literelor): o greșeală acolo strică telefonul.

**Adevărul incomod (punctul cel mai puțin sigur):** N3 e probat doar cu IME-ul emulat prin CDP pe Chromium desktop.
Faptul că `blur()` încheie compunerea SINCRON (cu `compositionend` înainte de mutarea cursorului) e observat pe Chromium,
nu pe Gboard/Samsung Keyboard pe un telefon real; Safari (iPhone) poate trimite evenimentele în altă ordine.

**Hotărârea (după cele de mai sus):**
- N1, N2, GRAV 3, N3: repar și probez; la N3 păstrez proba GRAV 1 (fără dublare) ca regres obligatoriu și trimiterea
  textului o singură dată (golirea casetei după trimitere), ca o a doua încheiere a compunerii să nu mai aibă ce trimite.
- N4: construiesc DOAR ce are citat — Ctrl+O = File › Open (pagina `backstage.Open` din referință; pagina Microsoft
  „open files from the file menu”), rândul „PDF (*.pdf)” al listei Save as type (pagina Microsoft „save or convert to
  PDF”) lângă „Word Document (*.docx)” (valoarea din `uia_word.json`), folderul „Documente” al ferestrei Save As în
  `stare()` (bara de adrese din referință). Ctrl+W, ✕ și fereastra „Save your changes…” rămân cu mesajul central și
  intră în `de_verificat.md` cu scenariul care le-ar lămuri — N4 rămâne deci PARȚIAL, scris ca atare.
