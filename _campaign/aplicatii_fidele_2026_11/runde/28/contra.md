# Contra (runda 28)

## Cel mai puternic argument PENTRU plan
Cele două rânduri O4 au acum referință și oracol (acoperirea r26 le-a făcut defecte curate ale simulatorului), iar regulile asistentului sunt cerute de doi critici, cu gesturi date (K2, „already exists”, Alt+↓). Totul se poate dovedi pe gesturi reale, înainte și după, fără să ating fișierele altor benzi.

## Cel mai puternic argument ÎMPOTRIVĂ
Spațiul de la lipire și granițele lui Ctrl+Backspace sunt reguli ale lui Word pe care le am doar din DOUĂ ieșiri reale (lipire, decupare) și dintr-o frază Microsoft („Delete one word to the left”). O regulă scrisă din două exemple poate potrivi oracolul fără să fie a lui Word (aceeași capcană ca „clic-pune-cursorul” din r24). Iar asistentul e comun: o regulă prea largă ascunde greșeli adevărate pe alte 4 aplicații (de ex. tastarea într-un câmp care NU e pe drum).

## Adevărul incomod (punctul cel mai puțin sigur)
Regula „tastarea într-un câmp al interfeței nu e greșeală” nu are referință: e o decizie despre asistare, nu despre Word. Un elev care scrie la nesfârșit în caseta greșită (de ex. în Font Size în loc de document) nu mai primește indiciu din litere; primește doar după 30 s sau după alte greșeli. Am ales-o pentru că așa cer criticii 24/26 și supliment (K2: indiciul apărea după două litere bune), iar ceasul de 30 s rămâne plasa.

## Hotărârea, după ele
- Spațiul la lipire: DOAR marginea dovedită (înainte, la capăt de cuvânt, după literă/cifră/punctuație), doar word365; mijlocul cuvântului, după „(”, după spațiu, word2007 → neschimbate și R28-1.
- Ctrl+Backspace / Ctrl+Delete / Ctrl+↑/↓: felul gestului din pagina Microsoft (cuvânt / paragraf, nu literă / rând); granițele, aceleași ca Ctrl+← / → deja existente, marcate [presupus] R28-3.
- Asistentul: câmpul se recunoaște strict (focus într-un input; câmp obișnuit = `eCamp`; câmpul ascuns doar când ținta evenimentului e în afara zonei de lucru și nu e `fereastra_app:`); documentul (Word, Excel, PowerPoint) rămâne greșeală, probat (AS_c_tastarea_in_document, AS_c_excel). Alt+săgeată doar cu starea neschimbată (Explorer Alt+↑/← rămân greșeli, probat). `indisponibil` scos din refuz după ce O9 a crescut 13 → 15.
