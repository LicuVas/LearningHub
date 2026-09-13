# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului jucat (U11)
- 12 ani, clasa a VI-a; a avut o singură oră de PowerPoint (lecția 1), pe care probabil n-a terminat-o.
- Nu știe engleză de meniu: „Format Background”, „Gradient fill”, „Close Master View”, „Header & Footer” sunt pentru el șiruri de litere.
- Citește încet (ritm provizoriu 100 de cuvinte/min); tastează ~50 de caractere/min; caută butoanele cu mouse-ul.
- Nu vede rezolvările pliate când lucrează; nu are imagini proprii pe PC-ul școlii; PC-ul poate fi comun cu altă clasă.
- Are 50 de minute, din care ~8 se duc pe pornire și deschiderea programului.
- Nu știe ce e „placeholder”, „template”, „branding”, „overlay”, „stop” de gradient (termenii apar fără explicație).

## Ce am făcut, pas cu pas (python-pptx + lxml, `u1_construieste.py`, ieșire `u1_iesire.txt`)
1. **Încearcă tu** („Vacanta Ideala”) — 6 diapozitive, șters unul, mutat unul, fundal galben pe ultimul. **Blocaj:** sarcina cere „5 slide-uri noi, câte o metodă diferită pentru fiecare”, dar până acolo lecția a arătat doar 3 metode (Indiciul #1: Home → New Slide, Ctrl+M, click dreapta). Copilul conștiincios rămâne blocat căutând a 4-a și a 5-a metodă. „Aplică o temă” nu se poate face din fișier — pas de interfață.
2. **Ex.1 „Pasiunile Mele”** — 7 diapozitive cu aspectele cerute. **Blocaje:** (a) numele aspectelor (Two Content, Comparison, Title Only, Picture with Caption) — în română am găsit în documentație doar „Titlu” și „Titlu și conținut”; (b) „Comparison” are 5 casete (titlu + 2 subtitluri + 2 conținuturi) — elevul nu știe ce scrie în fiecare; (c) „imagine” la diapozitivele 2-3 și „Poza ta preferata facand ceva ce-ti place” la 5: de unde? Pe PC-ul școlii nu sunt poze cu copilul (și nici nu e bine să fie); (d) după dublarea diapozitivului 2, imaginea copiată rămâne cea de la Pasiunea #1 — lecția nu spune cum schimbi o imagine.
3. **Gradientul** — am pus exact culorile din atomul 7 (#60a5fa → #3b82f6, diagonală). **Observat în randare (`randat_pptx/Pasiunile_Mele_p1.png`):** trecerea abia se vede (contrast între capete 1,45:1); subtitlul gri „Nume Prenume” aproape dispare pe albastru. **Blocaj:** codul hex se tastează într-un dialog de „Mai multe culori”/Custom pe care lecția nu-l arată; iar gradientul implicit din PowerPoint are mai multe opriri decât 2 — „Păstrează 2 stops” cere ștergerea celorlalte, neexplicată (ipoteză, de văzut în program).
4. **Ex.2 Slide Master** — caseta „VG” pusă numai pe master apare pe toate 3 paginile randate: principiul lecției e corect. **Blocaje:** Header & Footer nu e predat în niciun atom; „Close Master View” se cheamă în română „Închidere vizualizare coordonator”; și eticheta „Nivel standard” contrazice nota „nu este evaluată la nivel minim sau standard”.
5. **Ex.3** — nu se poate executa în laborator fără internet și fără Word; cere un raport de o pagină (≈48 min doar tastarea și citirea, după ritm).
6. **Ex.4 Ghid turistic** — 10 diapozitive, 6 aspecte, 3 tipuri de fundal, master cu nume, numerotare, subsol. Fișierul iese, dar e o oră întreagă singur (37,5 min după ritm).

## Unde se blochează începătorul (ipoteze AI — de verificat la oră)
Numele englezești în Office românesc · întrebarea despre Slide Master în atomul 1 · imaginile · a 4-a/a 5-a metodă de adăugare · codul hex al culorii · „Comparison” cu 5 casete. Sunt **ipoteze** (simularea AI e prea competentă); trecute în `log.json` → `anexa.blocaje_probabile_ipoteza`.

## Puncte de verificare
Doar „VERIFICARE RAPIDĂ” din Încearcă tu are bife. Ex.1-Ex.4 nu dau o stare observabilă („ridicați mâna când vedeți 7 miniaturi și primul diapozitiv albastru”).
