# Partea comună a prompturilor de judecător — tura 10→11.10.2026

Citește întâi și urmează întocmai `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\06_BRIEF_JUDECATOR.md`. Legea = `05_STANDARD_LECTIE.md` ÎNTREG (inclusiv regula 10 — gesturi reale mici și dese în aplicația adevărată — și „Ce au găsit judecătorii” 1-27). Unde brieful scrie `m1-lNN`, la tine e `m2-lNN`.

Din `05_STANDARD_LECTIE.md` aplici strict regulile:
- **22** — nicio dată a profesorului spre servicii externe (nici în pagină, nici în probele tale);
- **24** — probele cu browser blochează tot ce nu e 127.0.0.1/localhost și închid DOAR cu `ctx.close()`; după probe, `python C:/00/AI_0/tools/activitate.py lista | grep "nu e in catalog"` → nimic nou;
- **25** — calculatorul profesorului rămâne cum era: doar PID-ul tău, Office invizibil (`DispatchEx`, `Saved=True` + `Close` înainte de `Quit`, `AddToMru=False`), PowerPoint cu `verificare_lectii\lacat_office.py`, fără urme în „Recent”, fără fișiere de recuperare, setările puse la loc;
- **26** — „numele există deja” arată diferit la prima salvare și la Salvare ca;
- **27** — nicio dată personală în ce se publică (`python C:/00/AI_0/tools/learninghub_date_personale.py` → 0).

Interdicțiile nopții (profesorul doarme, ecranul lui e vizibil): NU porni aplicații din Magazin / UWP (Clipchamp, Securitate Windows, Fotografii, Calculator, Setări) — se deschid pe ecranul vizibil; faptele lor le verifici în documentația oficială și în capturile existente. NU înregistra de la microfon, nu porni camera. NU schimba nicio setare de securitate. Browser real (Edge) doar pe desktopul ascuns (`C:\00\AI_0\tools\hidden_desktop.py`) cu profil temporar; site-uri publice doar în Chromium headless cu profil temporar, fără cont. Explorer: nimic pe ecranul vizibil; probe prin cod pe un dosar al tău din `_verificare\`. Nicio oprire de procese după NUME.

Depozitul: alte sesiuni lucrează în paralel. NU modifici lecția și nimic din depozit în afara `_verificare\` al lecției tale. NU faci commit. Dacă `test_joc.py` pică din motorul comun (sesiunea `ai-0-b7` poate schimba `jocuri\_motor\motor.js` în noaptea asta, doar parametrul `?vezi=pN`), reiei după 5 minute și scrii ce ai văzut.

Ieșiri: `_verificare\judecator<N>.md` + `.json` (sau în subdosarul care ți se spune). Ultimele trei linii ale .md pline; ultima = DOAR numărul de GRAV. Răspunsul final: JSON-ul din brief.
