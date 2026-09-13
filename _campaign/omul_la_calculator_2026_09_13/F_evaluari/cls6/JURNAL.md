# Jurnalul clasei a VI-a — M1 Prezentări

## lectia1-powerpoint-intro
- Lecția 1 a „furat” din orele 3-5 ale planului (salvare și formate, adăugare/ștergere/dublare de diapozitive) și a sărit „Ce este o prezentare bună”: la lecțiile 2-6, pune fiecare lângă ora ei din `Calendar_ore_VI.md` și caută repetiții și goluri (regulile de estetică, ora 8, nu au lecție).
- Numele românești PowerPoint sunt deja scoase din textul brut Microsoft în `lectia1-powerpoint-intro/surse/` (Pornire, Inserare, Proiectare, Tranziții, Animații, Expunere diapozitive, Diapozitiv nou, Sortare diapozitive); la animații/tranziții trebuie descărcate paginile cu efectele individuale. WebFetch a inventat „Creare document PDF/XPS” la PowerPoint — doar curl + text brut.
- Exercițiile cu pași numerotați se execută în mai multe citiri: la Ex.2 „slide-ul 5” însemna poziție în rezolvare și număr în enunț, cu rezultate diferite.
- Timpul: 3.740 de cuvinte = ~45 min de pornire + citire înainte de orice exercițiu (ritm provizoriu); verifică dacă lecțiile următoare au aceeași lungime.
- De urmărit: întrebări puse înainte de atomul care predă termenul (4/10 aici) și imagini/fișiere cerute fără sursă.

## lectia2-slide-uri
- Repetiția confirmată cu dovadă proprie: lecția 2 reia din lecția 1 Ctrl+M, dublarea, ștergerea, schimbarea aspectului, tema și Format Background (numărat în `lectia2-slide-uri/u3_iesire.json`), dar nu predă „obiectele” din ora 4. Deci la lecțiile 3-6 întreabă mai întâi: ce a fost deja predat în 1-2 și ce oră din plan rămâne fără lecție?
- Întrebările din `data-quiz` nu sunt doar puse prea devreme, ci **decalate cu un atom** pe tot fișierul (doar 1/10 despre atomul propriu, 4/10 înainte de predare). Se verifică pe HTML cu `lectia2-slide-uri/u9_quiz.py` + `u3_verifica.py`, nu citind textul. Probabil vine din lotul de generare: verifică la fel lecțiile 3-6.
- Timpul e mai rău decât la lecția 1: 4.235 de cuvinte, adică 50,4 min doar pornire + citire. Ex.3 (internet + raport în Word) și Ex.4 (10 diapozitive) sunt fiecare câte o oră. Imaginile cerute fără sursă se repetă, iar acum se cere și „poza ta”.
- Nivelurile exercițiilor contrazic notele „opțional” din atomi: Slide Master e scos din standard în notă, dar cerut la Ex.2 standard. Pune fiecare etichetă de nivel lângă notele din atomi.
- Surse brute noi în `lectia2-slide-uri/surse/`: Coordonator de diapozitive, Închidere vizualizare coordonator, Formatare fundal / Umplere gradient / Se aplică pentru toate, Antet și subsol, Dublare diapozitiv, Ctrl+Shift+D. Temele au nume traduse în română („Bază”, „Integrală”). Numele românești pentru Two Content / Comparison / Title Only / Picture with Caption rămân neconfirmate.

## lectia3-text-imagini
- Aici nu mai e problema repetiției, ci supra-umplerea: `lectia3-text-imagini/u10_repetitii.txt` arată materialul aproape tot nou (SmartArt, WordArt, Align, Group: 0 în L1-2), dar ora 6 + ora 8 (atomul 10 „Reguli de design”) sunt într-o singură lecție de 5.540 de cuvinte (4.084 până la Ex.1). Ora 8 are deci conținut, doar că e ascuns aici după banner.
- Bannerul „EXTINDERE / depășește programa” trebuie pus lângă descriptorul „De bază (casete text, forme predefinite)” din `lectia3-text-imagini/u16_programa.txt`: aici scoate din bază formele și regulile de estetică, pe care Ex.1 minim le cere. Verifică la fel etichetele de nivel din L4-6.
- Decalajul întrebărilor se repetă, cu dovadă proprie (`lectia3-text-imagini/u3_iesire.json`: 3/12 înainte de predare, 1/12 despre atomul propriu). Aici e mai ales „înapoi”, nu doar cu un atom înainte. Scriptul `u3_verifica.py` are tabelul întrebare→linia de predare; la L4-6 se refac doar tiparele.
- Surse brute noi (`lectia3-text-imagini/surse/`): Acest dispozitiv, Imagini de stoc / Bancă de imagini (parțial fără Microsoft 365), Format imagine / Formatare imagine, Trunchiere la formă, Eliminare fundal, Aranjare > Aliniere > Aliniere la diapozitiv, Ctrl+G, Ctrl+Shift+]. NEVERIFICATE: numele românești SmartArt/WordArt.
- Imagini cerute fără sursă (3 lecții la rând) și nicio cerere de salvare a prezentării: dacă L4-5 animă „prezentarea ta”, întreabă de unde vine fișierul. Date personale: Ex.1 cere numele familiei imediat după nota „NU pune date personale reale”.

## lectia4-animatii
- Prima lecție din modul care pune elevul să FACĂ ceva pe primul ecran („Încearcă tu”) și e mai scurtă (2.275 de cuvinte până la Ex.1, față de 4.084 la L3). Totuși nici drumul minim nu încape (54,5 min, `lectia4-animatii/u12_sensibilitate.txt`), iar ora 7 din plan cuprinde și tranzițiile: la lectia5 adună L4+L5 față de aceeași oră de 50 de minute.
- Etichetele de nivel se bat din nou cu notele „optional”, cu dovadă proprie: Motion Paths „Poti sari aceasta sectiune” (r. 247), cerut la Ex.1 **minim** (r. 676). Decalajul întrebărilor se repetă (`lectia4-animatii/u3_iesire.json`: 2/10 înainte de predare, 4/10 înapoi).
- Tipar nou: **nume de efecte inventate prin simetrie** („Fade Out”, „Wipe Out”, „Zoom Out”). Lista Microsoft are „Fade/Wipe/Zoom exit” (`lectia4-animatii/surse/s_estompare_iesire.txt`, pagina „Animation effects available in PowerPoint for the web”, ro+en). La tranziții, verifică fiecare nume de efect pe lista Microsoft, nu doar numele filelor.
- Animațiile se pot proba în fișier: `lectia4-animatii/u1_construieste.py` scrie `p:timing` cu lxml (clic / with / after / delay / paragraf / declanșator), iar `u3_verifica.py` recitește și calculează cronologia. `p:transition` pentru L5 se poate scrie la fel.
- Surse brute noi (`lectia4-animatii/surse/`): fila Animații, La clic / Cu precedentul / După precedentul, Durată / Întârziere, Panou animație (3 traduceri), După paragraf vs Animare text, Căi de mișcare / Cale particularizată, Declanșator. NEVERIFICATE: Pulse, durata implicită, „Motion Paths albastru”.

## lectia5-tranzitii
- Ora 7 adunată: drumul minim L4 + L5 = **102,4 min**, la ritm dublu 55,2 min (`lectia5-tranzitii/u12_sensibilitate.txt`) — singurul blocant. L5 singură are 55,9 min. Pentru mini-proiect (L6, ora 9) calculează la fel și întreabă ce oră din plan rămâne fără lecție (ora 8, estetică).
- Tiparul „nume după cum sună” se mută de la nume la **categorii**: Rotate pus la Exciting, Gallery și Vortex la Dynamic (lista celor 7 Dynamic Content: `lectia5-tranzitii/surse/s_dynamic_content.txt`), plus o traducere inventată „Exciting (Incitante)” (Microsoft ro: „Interesant”, `s_categorii.txt`). La L6 verifică orice clasificare, nu doar numele.
- Tip nou: **rezolvarea contrazice atomul** și sursa („ambele bifate” → „tot asteapta click”, fals după `s_ambele_bifate.txt`). Citește rezolvările pliate după ce ai făcut sarcina, ca pe o afirmație de verificat.
- Decalajul întrebărilor e cel mai mare din modul: 5/10 înainte de predare (`lectia5-tranzitii/u3_iesire.json`). Lanțul fișierului rupt, cu dovadă proprie: primul ecran cere „o prezentare existentă”, nicio lecție n-a cerut salvarea (`03_pasi.json` pasul 1) — la L6 întreabă de unde vine prezentarea.
- Unelte: `lectia5-tranzitii/u1_construieste.py` (`pune_tranzitie`: p14:dur, p159:morph, advClick/advTm) + `u3_verifica.py` (cronologia cu regula „timerul pornește după ultima animație”), `surse/nume_efecte.py` (caută orice nume în tot textul brut). Nume RO încă neconfirmate: Push, Wipe, Cube, Flip, Appear, Grow & Turn.


## lectia6-proiect
- Proiectul se poate construi cap-coadă fără surprize (`lectia6-proiect/produs_elev/Proiect_Albinele.pptx`, 7 diapozitive, 6x6 și 24 pt respectate): **nu cere WordArt, SmartArt sau aspect personalizat**; hyperlinkul intern e nou (0 în L1-L5) dar predat în atomul 4 și prevăzut în programă („legături”). Problema nu e PowerPoint-ul, ci ora.
- Timpul, cu dovadă proprie (`lectia6-proiect/u12_sensibilitate.txt`): lecție + Ex.1 + Ex.2 = 110 min (59 la ritm dublu); doar Ex.2 = 54 min; susținerile de 3-5 min/elev nu mai au loc. La Izvoare ora 9 nici nu există (`Calendar_ore_VI.md` o comasează), deci varianta pe hârtie e singura.
- Tip nou: **proiect fără barem** — 18 criterii în trei locuri, 0 puncte, 5 vizibile doar în Slide Show sau ascultând (`lectia6-proiect/u1_notare.md`). Lanțul fișierului rupt se repetă, cu dovadă proprie: singura frază e „fisierul salvat ca .pptx”, fără loc și nume.
- Rezolvările pliate ca instrucțiuni (tiparul din L5) se agravează: aici propun **poze cu echipa de pe telefon** (date personale ale minorilor, contra regulii din L3) și afirmă că PDF-ul „pierde hyperlinkurile” (Microsoft: web le păstrează, Mac nu; LibreOffice măsurat: 0 linkuri).
- Surse brute noi (`lectia6-proiect/surse/`): Plasare în acest document, Proiectare, Creare document PDF/XPS, PDF și hyperlinkuri (web/macOS), Imagini de stoc libere de drepturi (Microsoft 365 / parțial Office 2021), GDPR imagini. NEVERIFICATE: temele „Ion/Facet”, butonul Numerotare în română.

## Concluzia modulului
- **Planul pe ore trebuie scris în modul, nu dedus**: L4+L5 stau pe ora 7, ora 8 (estetică + susținere) e împrăștiată în L3 (atomul 10) și L6 (atomii 5-8), iar L6 pune „realizare + susținere” într-o oră care nu încape; la Izvoare ora 9 lipsește. O pagină de modul „ce se face la ora 2…10” cu drumul minim pe fiecare oră ar rezolva jumătate din semnalări.
- **Lanțul fișierului**: o singură regulă de la L1 la L6 — „salvează ca Clasa_Nume_Lectia.pptx în folderul clasei” — și o prezentare-starter descărcabilă, ca L5 și L6 să nu depindă de ce a salvat (sau nu) elevul acum trei săptămâni.
- **Numele din meniuri în ambele limbi** în toate cele 6 lecții (Pornire/Inserare/Proiectare/Tranziții/Animații), plus eliminarea numelor inventate prin simetrie (L4) și a clasificărilor greșite (L5).
- **Rezolvările pliate se verifică la fel ca atomii**: în L5 contrazic sursa, în L6 propun date personale și reguli absolute greșite.
- **Diacritice** (0-1,6 la 1.000 în toate) și un barem cu puncte pentru mini-proiect, cu criterii verificabile din ușă, plus o variantă pe hârtie pentru clasele fără laborator.
