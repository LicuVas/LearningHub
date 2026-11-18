# Runda 2 · CONTRA (pasul 4)

**Planul:** (1) calea `input` din `aplicatii.js` ține cont de compunere (`compositionstart/end`, `isComposing`) și trimite
textul o singură dată, cu majuscula automată (GRAV 1, 6); (2) Backstage și dialogurile iau focusul, iar `I.la.text` /
`I.la.sterge` refuză scrierea cât e deschis un strat; tastele de acces au N niveluri (Alt, F, A, O) (GRAV 2);
(3) caseta Font Size devine editabilă: tastat + Enter aplică mărimea pe selecție și întoarce focusul în document;
Alt, H, F S pune focusul în casetă (GRAV 3); (4) Ctrl+S pe document nou deschide „Save this file” construită DOAR din
textul Microsoft cu URL (GRAV 4); (5) tastele de acces activează elementul printr-o funcție a bibliotecii, fără
`MouseEvent` sintetic, și emit evenimente de tastă (GRAV 5).

**Cel mai puternic argument PENTRU:** toate cele 6 au cauza numită de critic cu fișier:rând și o probă reproductibilă
(CDP / Playwright pe poligon); reparațiile sunt locale (două fișiere) și se pot proba exact pe pașii criticului, deci
„înainte → după” e măsurabil fără să depindă de impresia mea.

**Cel mai puternic ÎMPOTRIVĂ:** GRAV 4 (fereastra „Save this file”) și lista Font Size nu au referință UIA înghețată.
Orice fereastră desenată din text Microsoft are geometria inventată; R4 o numără ca diferență, iar un critic ulterior
o poate da GRAV ca „interfață fără referință”. Lăsată pe mesajul „nu e simulată”, rămâne GRAV pe R12. Ambele drumuri
lasă o diferență; alegerea e care e mai mică pentru elev.

**Adevărul incomod (punctul cel mai puțin sigur):** proba de compunere rulează pe Chromium desktop prin CDP. Ordinea reală
a evenimentelor pe Gboard/Samsung Keyboard (și ce fac ele cu o casetă golită — ex. `deleteContentBackward` pentru
autocorectura cuvântului anterior) nu o pot observa de aici. Reparația o fac robustă la ambele ordini, dar „merge pe
telefon” rămâne NESIGUR până la proba pe un telefon real (de_verificat).

**Hotărârea (după cele de mai sus):** repar toate 6. La GRAV 4 aleg fereastra minimă din textul Microsoft (titlul,
caseta File name, Location, More save options → fereastra Save As din referință, Save), cu fiecare element citat în
`diferente.md`, iar geometria și valorile necitate intră în `de_aprobat.md` + `de_verificat.md`. Lista Font Size ▾
rămâne cu mesajul central (nicio sursă pentru rânduri); drumul lecției („alege 20”) merge prin tastare, care E citată.
Nouă: evenimentul tastelor de acces are felul `tasta_acces` (nu e în lista §4 — de hotărât de orchestrator în
`api_biblioteca.md`).
