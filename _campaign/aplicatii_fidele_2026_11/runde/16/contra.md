# Runda 16 · Word · contra

**Planul:** toate cele 8 reparații doar în `aplicatii/word.js`, fără fișiere comune:
folderul ferestrei = folderul documentului salvat (S2); bara de adrese ținută de un reper fix, nu căutată după etichetă (S1); lista
Save As umplută ca în Open, filtrată după tipul din „Save as type”, clic = numele în File name (S5); deschiderea unui fișier deja
deschis aduce documentul existent în față (S4); un contor de documente noi (S6); verificarea semnelor interzise în `salveaza` (S3);
Alt+↓ = clicul pe ▾ al casetei, cu `activat` (T6); fără document, comenzile panglicii gri și tastele lor fără efect (T5).

**Cel mai puternic argument PENTRU:** fiecare reparație are dovadă din Word real sau din referința înghețată (`com_r5.json`,
`uia_word.json`, lecția m1-l03), iar proba de azi arată 18/20 verificări picate pe exact gesturile criticului. Totul stă într-un
singur fișier propriu, deci nu poate strica Excel / PowerPoint / Explorer (regresul lor nu e nici măcar obligatoriu).

**Cel mai puternic argument ÎMPOTRIVĂ:** câteva reparații ating starea pe care o citesc lecțiile vechi (`folder_fisier`,
`documente_deschise`, `fisiere`). O lecție care azi trece pentru că F12 duce mereu în Documente (atelierul m1-l03 :267, elevul care
sare peste „Documente”) va da alt verdict după S2 — exact ce cere criticul, dar O6 (verdictele vechi) ar putea crește dacă un
exercițiu din `verdicte_vechi.json` depindea de comportamentul greșit.

**Adevărul incomod (punctul cel mai puțin sigur):** două alegeri NU au citat direct:
1. ce arată lista Save As când tipul e „Word Document (*.docx)” — doar fișierele .docx (filtrul tipului) sau toate (referința are
   8 rânduri redactate). Aleg filtrul tipului, cum e caseta „Save as type” din referință, și pun întrebarea în `de_verificat.md`;
2. textul ferestrei de eroare la numele interzis: Word real prin COM dă „This is not a valid file name.”, dar fereastra desenată nu
   e în referință → mesajul central, cu textul lecției (m1-l03:156), nu o fereastră inventată.
Și una cu dovadă slabă: fără document, „toată panglica gri” e extinsă de la cele 8 comenzi probate prin COM (Bold, Italic, FontSize,
Paste, FileSave…) la toate comenzile panglicii (ca la PowerPoint, unde referința o arată). Rând în `de_verificat.md`.

**Hotărârea:** merg pe plan. Pentru riscul O6: rulez regresul Word pe toate scenariile `word-*` (O4) și probele vechi ale lui Word
(rundele 2-5), iar orice verdict schimbat se scrie în raport; orchestratorul măsoară O6 la pasul 7.
