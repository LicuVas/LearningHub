/* Extensia „audio-linie-inregistrare” pentru lecțiile LearningHub — fișier comun (lectii/_sim/audio-linie-inregistrare.js).
   PROPRIETAR: autorul lecției VII · M2 · nr. 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”),
   creat în tura de noapte 10→11.10.2026. Se sprijină pe lectii/_sim/audio-linie.js (proprietar VII/11), pe care NU îl modifică:
   creează instanțe AudioLinie.creeaza(...) pentru fereastra proiectului și le adaugă, din afară, butonul roșu adevărat.
   Încărcare: <script src="../../_sim/audio-linie.js"></script><script src="../../_sim/audio-linie-inregistrare.js"></script>
   Tipul pentru motor: tipuri:{audioproiect:TipAudioProiect}  →  {t:'audioproiect', q, start?, teste, solutie, gresit, why, ajutor?}

   CE SIMULEAZĂ: Audacity 4 ca aplicație cu PROIECTE — fila Acasă (Proiect nou, Noi și recente, Nou, Deschide altul...),
     meniul Fișier (Nou…, Deschide…, Salvează, Salvează ca…, Închide proiectul, Închide), fila Proiect (fereastra AudioLinie),
     butonul roșu ● care înregistrează vocea „elevului” (unda o face simulatorul, după distanța aleasă în panoul „Tu, la
     microfon”), săgeata ↶ (Revenire, Ctrl+Z), Setări audio › Dispozitiv înregistrare, ferestrele „Salvează proiect” (Unde dorești să
     salvezi?) și ferestrele Windows „Salvează proiect” / „Deschide” (cu foldere și proiectele colegilor), „Modificări nesalvate”,
     ✕ (Audacity se închide; „Pornește Audacity” îl deschide iar, pe fila Acasă). Nimic nu pleacă din pagină și nu se aude nimic:
     înregistrarea e simulată (în pagină nu se folosește microfonul).

   FIDELITATE (probat în Audacity 4.0.0 REAL, pe desktopul ascuns, 11.10.2026 — lectii/vii/m2-l12/_proba/audacity_proba_l12_*.json):
     - pornit fără fișier: fila Acasă („Proiecte”, „Noi și recente”, dala Proiect nou, jos Nou și Deschide altul...); fila Proiect
       stinsă; meniul Fișier are atunci doar Nou…, Deschide…, Închide;
     - Proiect nou (dala din Acasă sau Fișier › Nou…) → fila Proiect, fără piste, titlul „Audacity 4.0”; cu un proiect deja
       deschis, Fișier › Nou… deschide o FEREASTRĂ NOUĂ (aici: abatere spusă pe ecran, un singur proiect); Setări audio: Gazdă, Dispozitiv redare, Dispozitiv
       înregistrare, Canale înregistrare, Rescanează dispozitive audio, Setări audio;
     - Salvează pe un proiect fără nume → „Salvează proiect”: „Unde dorești să salvezi?”, Salvează în Cloud / Salvează pe
       calculator, bifa „Nu mai arăta din nou” → fereastra Windows „Salvează proiect”, pornită în Documente › Audacity4 ›
       Projects, „Salvare cu tipul: Fișiere Audacity 4 (*.aup4) (*.)”, Salvare / Anulare; numele primește .aup4;
     - după salvare titlul e „<nume> - Audacity 4.0”; a doua Salvează nu mai deschide nicio fereastră; Închide proiectul pe un
       proiect salvat → fila Acasă, fără întrebare, proiectul apare în „Noi și recente” (cu „AZI”); clic pe el → se redeschide;
       ✕ pe un proiect salvat închide Audacity fără întrebare; pe unul nesalvat: „Modificări nesalvate” (Salvează, Nu salva, Renunță);
     - Deschide… / Deschide altul... → fereastra Windows „Deschide”, pornită în Descărcări, Deschidere / Anulare;
     - NUMELE EXISTĂ DEJA, la PRIMA salvare (Salvează pe un proiect fără nume): Audacity 4 NU întreabă nimic și ÎNLOCUIEȘTE
       proiectul care avea numele acela (proba 5 a autorului; judecata 1, a2: amprenta d56f… → 743e…).
     - (1.1, 12.10.2026) NUMELE EXISTĂ DEJA, la „Salvează ca…” de pe un proiect CU NUME, peste ALT proiect din folder: fereastra
       „Audacity” — „Eroare la salvarea proiectului” / „Audacity a eșuat să scrie într-un fișier. Poate C: nu are drepturi de
       scriere sau discul este plin.” (OK); proiectul de acolo DISPARE de pe disc; proiectul deschis rămâne cu numele lui
       (judecata 1, a3: _verificare/j1_proba_a.json, _capturi_j1/a3_dupa_salvare_0.png; și proba 4 a autorului, peste o copie);
       DOAR când proiectul deschis are deja un nume; pe un proiect FĂRĂ nume („Fără titlu”), „Salvează ca…” peste un nume existent
       nu arată nicio fereastră și înlocuiește proiectul de acolo, ca la prima salvare (judecata 2, 12.10.2026, c3 față de c4);
     - (1.1) numele propus pentru un proiect NOU e „Fără titlu.aup4” (judecata 1, b1); fereastra de salvare pornește în ULTIMUL
       folder în care s-a salvat (setarea lastSavedProjectsPath, scrisă la salvare; la început Documente › Audacity4 › Projects);
     - (1.1) „Nu mai arăta din nou” bifat → următoarele salvări sar direct la fereastra Windows (shouldAskSaveLocationType=false,
       judecata 1, c1);
     - scurtăturile (din programul Audacity 4, resursa shortcuts.xml): R = înregistrează, Space = oprește înregistrarea /
       redă-oprește redarea, Ctrl+Z = anulează („Revenire” în traducerea Audacity 4), Ctrl+N / Ctrl+O / Ctrl+S / Ctrl+W (scrise
       și în meniul Fișier).
   NESIGUR (butonul roșu NU s-a apăsat în Audacity real: regula nopții, fără microfon) — urmat după manualul Audacity și spus prudent:
     numele pistei noi („Audio 1” în simulator), unde pornește înregistrarea (aici: la 0:00, într-un proiect gol), unde stă
     capul după oprire (la începutul înregistrării), a doua înregistrare (aici: după prima, pe aceeași pistă, ca în manualul
     Audacity 3: „always begins recording at the end of the currently selected track(s)”), ● în timpul unei redări în pauză
     (aici: „oprește întâi redarea”), titlul unui proiect nou după înregistrare (aici: „Audacity 4.0”), Ctrl+Z pe o înregistrare
     (aici: înregistrarea dispare, iar pista goală se scoate; manualul Audacity 3: „Undo Record”); „Salvează ca…” de pe un proiect
     FĂRĂ nume peste un nume existent (aici: ca la prima salvare, înlocuiește; neprobat); „Modificări nesalvate” › Salvează pe
     un proiect cu nume (aici: salvează, apoi închide).
   ABATERI spuse pe ecran: Nou… cu un proiect deschis (Audacity 4 deschide altă fereastră); Salvează în Cloud (cere cont) nu salvează; meniurile Editează…Ajutor, Importă, Exportă audio nu fac
     nimic aici (lecțiile următoare); ferestrele Windows au doar Desktop, Descărcări, Documente; un singur proiect deschis.
   TASTELE BROWSERULUI (1.1): Ctrl+N, Ctrl+O, Ctrl+W NU sunt prinse aici — în Edge/Chrome le ia browserul (fereastră nouă,
     deschide fișier, închide FILA lecției). În pagină, Nou… / Deschide… / Închide proiectul se aleg din meniul Fișier (nota din
     meniu o spune). Ctrl+S și Ctrl+Z rămân prinse de simulator (vezi surse.md al lecției 12, „Reparațiile după judecata 1”).

   API PUBLIC (lecțiile VII/13-15 și probele):
     const x = AudioProiect.creeaza(element, {start?, vedere?})
       start: {ecran:'acasa'|'proiect'|'inchis', proiect:{nume?, folder?, modificat?, piste?|voce?:{sec, distanta, mic?, zgomot?}},
               fs:{'Documente':[{nume:'X.aup4', autor:'coleg'|'tu', voce?:{…}|piste?}], …}, recente:[{nume, folder}],
               mic:'casti'|'mixaj', distanta:'lipit'|'palma'|'departe', zgomot:bool, nuMaiArata:bool,
               ultimFolderSalvare?:'Documente'|… (1.1: unde a salvat „colegul de dinainte”; implicit 'Documente/Audacity4/Projects')}
     x.stare()   → {ecran, proiect:{nume, folder, modificat, piste}|null, mic, distanta, zgomot, inregistreaza, dialog, recente,
                    nuMaiArata, ultimFolderSalvare (1.1)};  dialog: null|'meniu'|'setari'|'unde'|'win'|'nesalvate'|'eroare' (1.1)
     x.jurnal()  → [{tip:'pornit'|'proiectNou'|'inregistrare'|'stopInregistrare'|'anuleaza'|'salvat'|'inchisProiect'|
                    'aplicatieInchisa'|'deschis'|'mic'|'distanta'|'zgomot'|'al_redare'|'al_stop'|'al_capat'|…, …}]
                 1.1: 'eroareSalvare' {nume, folder, sters:true, autorSters} — „Salvează ca…” peste alt proiect: acela a fost șters,
                 iar 'salvat' NU se emite.
     x.al()      → instanța AudioLinie a proiectului deschis (sau null): redare, mărire, tragere… ca în lecția 11
     x.fs()      → fișierele simulate {folder:[{nume, autor, piste}]};  x.ultima() → ultima înregistrare {clip, durata, calitate}
     x.simuleaza([acțiuni]) pe loc (ceas virtual): {proiectNou:1} {pornesteAplicatia:1} {distanta:'palma'} {zgomot:false}
                 {mic:'casti'|'mixaj'} {inregistreaza:sec} {anuleaza:1} {asculta:1} {salveaza:{nume, folder?, ca?}}
                 {inchideProiect:1, raspuns?:'nusalva'|'salveaza'} {inchideAplicatia:1, raspuns?} {deschideRecent:'nume'}
                 {deschide:{folder, nume}} {al:[acțiuni AudioLinie]}  1.1: {ok:1} (OK pe fereastra „Eroare la salvarea proiectului”)
     x.reset()  x.on(fn)/x.off(fn): fn(stare, ev)  x.mesaj(html)  x.distruge()
     AudioProiect.verificari[nume] = (x, parametru) => bool;  AudioProiect.undaVoce(sec, {distanta, mic, zgomot, seed})
     AudioProiect.RE_NUME: regula numelui „Nume_Prenume_clasa_voce” (fără diacritice, cifră la capăt permisă; 1.1: și mai multe
       prenume — Popescu_Ana_Maria_7A_voce —, literele mari/mici nu contează — _Voce).  1.1: AudioProiect.numeTau(n) = RE_NUME și
       NU modelul copiat ca atare (Nume_Prenume_…); îl folosesc verificările numeRegula / salvatRegula.
     Verificări noi în 1.1: nimicSters (nicio „Eroare la salvarea proiectului” care a șters un proiect); nimicInlocuit cere acum
       și asta (un proiect șters nu e „neatins”).
   Lecția 13 (selecție, ștergere, mixaj) poate deschide un proiect cu voce (start.proiect.voce) și lucra pe x.al(); NU schimba
   aici comportamentul din lista FIDELITATE și nici numele verificărilor: le folosește lecția 12. Ce e nou se adaugă cu nume nou. */
(function(){
'use strict';
if(!window.AudioLinie){console.error('audio-linie-inregistrare.js: încarcă întâi lectii/_sim/audio-linie.js');return}
const VERS='1.1 (12.10.2026)';
const CSS=`
.ap{font:14px/1.35 "Segoe UI",system-ui,sans-serif;color:#1d2330;max-width:100%}
.ap-fer{position:relative;border:1px solid #c9ccd6;border-radius:8px;background:#f3f3f6;overflow:hidden;outline:none}
.ap-fer:focus-visible{box-shadow:0 0 0 3px #7aa7ff}
.ap-bt{display:flex;align-items:center;gap:8px;background:#fff;border-bottom:1px solid #d8dae2;padding:2px 2px 2px 10px;min-height:36px}
.ap-bt .ap-tt{flex:1 1 auto;min-width:0;font-size:.82rem;color:#3c4354;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ap-bt .ap-logo{color:#e8476b;font-size:.9rem}
.ap-x{min-width:44px;min-height:34px;border:0;background:transparent;font-size:1.05rem;cursor:pointer;border-radius:4px;color:#1d2330}
.ap-x:hover{background:#e81123;color:#fff}
.ap-mb{display:flex;flex-wrap:wrap;gap:0 2px;background:#fff;border-bottom:1px solid #e3e5ec;padding:0 4px}
.ap-mb button{border:0;background:transparent;font:inherit;font-size:.86rem;padding:6px 7px;min-height:34px;cursor:pointer;border-radius:4px;color:#1d2330}
.ap-mb button:hover,.ap-mb button.deschis{background:#e6e8f0}
.ap-tb{display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:3px 6px;background:#f7f7fa;border-bottom:1px solid #e3e5ec}
.ap-tab{border:0;background:transparent;font:inherit;font-weight:600;padding:6px 10px;min-height:34px;cursor:pointer;border-bottom:3px solid transparent;color:#1d2330}
.ap-tab.activ{border-bottom-color:#7b6cf6}.ap-tab[disabled]{color:#a3a8b5;cursor:default}
.ap-sp{flex:1 1 auto}
.ap-btn{border:1px solid #d0d3dd;background:#fff;font:inherit;font-size:.84rem;padding:4px 9px;min-height:34px;min-width:34px;border-radius:5px;cursor:pointer;color:#1d2330}
.ap-btn[disabled]{opacity:.45;cursor:default}
.ap-corp{min-height:220px;background:#f3f3f6}
.ap-acasa{padding:12px 14px}
.ap-acasa h4{margin:0 0 6px;font-size:1.25rem}
.ap-acasa .ap-filerow{display:flex;gap:16px;border-bottom:1px solid #e0e2ea;margin-bottom:10px;font-size:.86rem}
.ap-acasa .ap-filerow span{padding:4px 0}.ap-acasa .ap-filerow span:first-child{border-bottom:2px solid #7b6cf6;font-weight:600}
.ap-dale{display:flex;flex-wrap:wrap;gap:12px}
.ap-dala{width:132px;border:0;background:transparent;font:inherit;cursor:pointer;text-align:center;padding:0;color:#1d2330}
.ap-dala .ap-dimg{display:flex;align-items:center;justify-content:center;height:74px;border:1px solid #d8dae2;border-radius:6px;background:#fff;font-size:2rem;color:#333}
.ap-dala.rec .ap-dimg{background:#3d4150;color:#5fd6c2;font-size:.9rem}
.ap-dala .ap-dn{display:block;margin-top:4px;font-size:.8rem;word-break:break-all}
.ap-dala .ap-dz{display:block;font-size:.68rem;color:#5a6275}
.ap-acasa .ap-jos2{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
.ap .al{border:0;border-radius:0}
.ap .al-titlu{display:none}
.ap .al-b.rosu.ap-inreg{background:#e8476b}.ap .al-b.rosu.ap-inreg .ic,.ap .al-b.rosu.ap-inreg .et{color:#fff}
.ap-strat{position:absolute;inset:0;display:none;background:rgba(20,24,34,.28);z-index:20;overflow:auto}
.ap-strat.vizibil{display:block}
.ap-meniu{position:absolute;left:4px;top:72px;min-width:230px;max-width:calc(100% - 8px);background:#fff;border:1px solid #d0d3dd;border-radius:7px;box-shadow:0 6px 18px rgba(0,0,0,.18);padding:4px 0}
.ap-meniu button{display:flex;justify-content:space-between;gap:18px;width:100%;border:0;background:transparent;font:inherit;font-size:.88rem;text-align:left;padding:7px 14px;min-height:34px;cursor:pointer;color:#1d2330}
.ap-meniu button:hover{background:#eef0f6}.ap-meniu button[aria-disabled="true"]{color:#a3a8b5;cursor:default}
.ap-meniu kbd{font:inherit;font-size:.8rem;color:#5a6275;background:none;border:0;padding:0}
.ap-meniu hr{border:0;border-top:1px solid #e3e5ec;margin:3px 0}
.ap-meniu .ap-nota{margin:2px 0 0;padding:6px 14px 4px;border-top:1px solid #e3e5ec;font-size:.76rem;line-height:1.3;color:#5a6275;max-width:300px}
.ap-dlg .ap-er{display:flex;gap:14px;align-items:flex-start}
.ap-dlg .ap-er .ap-eri{flex:none;width:40px;height:40px;border:3px solid #1d2330;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:700}
.ap-dlg .ap-er b{display:block;font-size:1rem;margin-bottom:6px}.ap-dlg .ap-er p{margin:0;font-size:.88rem}
.ap-dlg{position:relative;margin:18px auto;width:min(560px,calc(100% - 16px));background:#fff;border:1px solid #c9ccd6;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.ap-dlg .ap-dt{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border-bottom:1px solid #e3e5ec;font-size:.84rem}
.ap-dlg .ap-dt span{flex:1}
.ap-dlg .ap-dc{padding:12px 14px}
.ap-dlg .ap-db{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:10px 14px;border-top:1px solid #eceef3}
.ap-dlg .ap-db button,.ap-carduri button{min-height:36px;min-width:88px;border:1px solid #c9ccd6;border-radius:5px;background:#eceef3;font:inherit;cursor:pointer;color:#1d2330;padding:4px 12px}
.ap-dlg .ap-db button.prim{background:#c3c0f5;border-color:#a9a4ef}
.ap-carduri{display:flex;flex-wrap:wrap;gap:12px}
.ap-card{flex:1 1 200px;border:1px solid #e3e5ec;border-radius:8px;padding:10px}
.ap-card b{display:block;font-size:1rem;margin-bottom:4px}.ap-card p{margin:0 0 8px;font-size:.84rem;color:#3c4354}
.ap-bifa{display:flex;align-items:center;gap:8px;margin-top:12px;font-size:.86rem;min-height:32px}
.ap-bifa input{width:20px;height:20px}
.ap-win .ap-adr{display:flex;align-items:center;gap:6px;border:1px solid #d0d3dd;border-radius:4px;padding:6px 8px;font-size:.85rem;margin-bottom:8px;background:#fafbfd}
.ap-win .ap-wcorp{display:flex;gap:8px;min-height:150px}
.ap-win .ap-nav{flex:0 0 118px;display:flex;flex-direction:column;gap:2px;border-right:1px solid #eceef3;padding-right:6px}
.ap-win .ap-nav button{border:0;background:transparent;font:inherit;font-size:.85rem;text-align:left;padding:6px 6px;min-height:34px;border-radius:4px;cursor:pointer;color:#1d2330}
.ap-win .ap-nav button.activ,.ap-win .ap-nav button:hover{background:#e6eefc}
.ap-win .ap-lista{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
.ap-win .ap-lista .ap-cap{font-size:.75rem;color:#5a6275;border-bottom:1px solid #eceef3;padding:2px 6px}
.ap-win .ap-lista button{display:flex;gap:6px;border:0;background:transparent;font:inherit;font-size:.85rem;text-align:left;padding:6px;min-height:34px;border-radius:4px;cursor:pointer;color:#1d2330;word-break:break-all}
.ap-win .ap-lista button.sel{background:#cce4ff}
.ap-win .ap-gol{font-size:.82rem;color:#5a6275;padding:12px 6px}
.ap-win .ap-camp{display:grid;grid-template-columns:auto 1fr;gap:6px 8px;align-items:center;margin-top:10px;font-size:.85rem}
.ap-win .ap-camp input,.ap-win .ap-camp select{font:inherit;min-height:32px;border:1px solid #9aa0ad;border-radius:3px;padding:2px 6px;width:100%;box-sizing:border-box;min-width:0}
.ap-win .ap-eroare{color:#b42318;font-size:.84rem;margin-top:6px}
.ap-setari{position:absolute;right:6px;top:110px;width:270px;max-width:calc(100% - 12px);background:#fff;border:1px solid #d0d3dd;border-radius:7px;box-shadow:0 6px 18px rgba(0,0,0,.18);padding:4px 0}
.ap-setari button{display:flex;justify-content:space-between;width:100%;border:0;background:transparent;font:inherit;font-size:.88rem;text-align:left;padding:7px 12px;min-height:34px;cursor:pointer;color:#1d2330}
.ap-setari button:hover{background:#eef0f6}
.ap-setari .ap-sub{border-top:1px solid #eceef3;margin-top:2px;padding-top:2px;background:#fafbfd}
.ap-setari .ap-sub button{padding-left:22px}
.ap-inchis{display:none;padding:22px 14px;text-align:center;border:1px dashed #b9bdc9;border-radius:8px;background:#eef0f5}
.ap-inchis button{min-height:40px;padding:6px 14px;border-radius:6px;border:1px solid #9aa0ad;background:#fff;font:inherit;cursor:pointer}
.ap.inchis .ap-fer{display:none}.ap.inchis .ap-inchis{display:block}
.ap-mic{margin-top:8px;border:1px solid #d8dae2;border-radius:8px;padding:8px 10px;background:#fbfbfd;font-size:.86rem}
.ap-mic .ap-rand{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:4px}
.ap-mic button{min-height:34px;padding:4px 10px;border-radius:16px;border:1px solid #b9bdc9;background:#fff;font:inherit;font-size:.84rem;cursor:pointer;color:#1d2330}
.ap-mic button[aria-pressed="true"]{background:#1f7f70;border-color:#1f7f70;color:#fff}
.ap-mic label{display:inline-flex;align-items:center;gap:6px;min-height:34px}
.ap-mic input{width:20px;height:20px}
.ap-mesaj{margin:6px 2px 0;min-height:1.3em;font-size:.88rem}
.ap-mesaj:empty{display:none}
.ap-jos{margin-top:6px}.ap-jos button{min-height:34px;padding:4px 12px;border-radius:6px;border:1px solid #b9bdc9;background:#fff;font:inherit;font-size:.84rem;cursor:pointer}
.ap-teste{margin-top:10px;border:1px solid var(--line,#ccc);border-radius:8px;padding:10px 12px;background:var(--paper2,#f5f5f5)}
.ap-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.ap-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.ap-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.ap-teste li.ok .s{color:var(--ok,#1b7a4a)}.ap-teste li.rau .s{color:var(--bad,#b42318)}
.ap-teste li .m{display:block;font-size:.85rem;color:var(--bad,#b42318)}
@media (max-width:560px){.ap-win .ap-wcorp{flex-direction:column}.ap-win .ap-nav{flex-direction:row;flex-wrap:wrap;flex-basis:auto;border-right:0;border-bottom:1px solid #eceef3;padding:0 0 4px}
  .ap-dala{width:112px}.ap-meniu{top:64px}.ap-setari{top:96px}}
`;
function stil(){if(document.getElementById('sim-audio-proiect-css'))return;const s=document.createElement('style');s.id='sim-audio-proiect-css';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* 1.1 (judecata 1, M6): mai multe prenume (Popescu_Ana_Maria_7A_voce, Popescu_Ana-Maria_7A_voce), literele mari/mici nu contează
   (…_Voce). numeTau: regula ȘI nu modelul copiat ca atare (Nume_Prenume_…), ca doi copii care copiază modelul să nu se întâlnească. */
const RE_NUME=/^[A-Za-z][A-Za-z-]*(?:_[A-Za-z][A-Za-z-]*)+_[0-9IVXivx]{1,4}[A-Za-z]{0,2}_voce[0-9]*$/i;
const RE_MODEL=/^nume_prenume(_|$)/i;
const numeTau=n=>{const s=String(n||'').replace(/\.aup4$/i,'');return RE_NUME.test(s)&&!RE_MODEL.test(s)};
const DISP={casti:'Microfon (căștile cu microfon)',mixaj:'Mixaj stereo (sunetul calculatorului)'};
const FOLDERE={'Desktop':[],'Descărcări':[],'Documente':['Audacity4'],'Documente/Audacity4':['Projects'],'Documente/Audacity4/Projects':[]};
const NUME_FOLDER=f=>f.split('/').join(' › ');
const fara=n=>String(n).replace(/\.aup4$/i,'');

/* unda vocii (vârfuri 0…1, 50 pe secundă): cuvinte de ~0,9 s cu pauze scurte; înălțimea vine din distanța față de microfon */
function rng(seed){let s=(seed>>>0)||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%10000)/10000}}
function undaVoce(sec,opt){
  opt=opt||{};const r=rng(opt.seed||7),n=Math.max(1,Math.round(sec*50)),out=[];
  const baza=opt.mic==='mixaj'?0:opt.distanta==='lipit'?1.7:opt.distanta==='departe'?0.07:0.55;
  for(let i=0;i<n;i++){const t=i/50,f=t%1.25,vorbeste=f<0.92&&t>0.2;
    let v=vorbeste?baza*(0.5+0.5*Math.abs(Math.sin(t*Math.PI*4.4)))*(0.75+0.25*r()):0.015*r()*(baza>0?1:0);
    if(opt.zgomot)v=Math.max(v,0.12+0.06*r());
    out.push(Math.min(1,Math.round(v*100)/100))}
  return out}
function calitate(o){if(o.mic==='mixaj')return 'gol';if(o.zgomot)return 'zgomot';return o.distanta==='lipit'?'taiata':o.distanta==='departe'?'plata':'buna'}
function pisteVoce(v){const sec=v.sec||8,o={distanta:v.distanta||'palma',mic:v.mic||'casti',zgomot:!!v.zgomot,seed:v.seed||5};
  return [{tip:'audio',nume:'Audio 1',clipuri:[{id:'v1',nume:'Audio 1',start:0,durata:sec,unda:undaVoce(sec,o),calitate:calitate(o)}]}]}
const copie=x=>JSON.parse(JSON.stringify(x));

function creeaza(el,opt){
  stil();
  const O=Object.assign({vedere:40},opt||{});
  const st={};let J=[],al=null,alId=0,raf=0,asc=new Set(),dupaSalvare=null;
  const wrap=document.createElement('div');wrap.className='ap';el.innerHTML='';el.appendChild(wrap);
  wrap.innerHTML=`<div class="ap-fer" tabindex="0" role="application" aria-label="Audacity 4, simulat în pagină">
    <div class="ap-bt"><span class="ap-logo" aria-hidden="true">●</span><span class="ap-tt"></span><button type="button" class="ap-x" data-a="x" title="Închide (✕)" aria-label="Închide Audacity (✕)">✕</button></div>
    <div class="ap-mb">${['Fișier','Editează','Selectează','Vizualizează','Înregistrează','Piste','Generează','Efect','Analiză','Unelte','Ajutor'].map(m=>`<button type="button" data-a="meniu" data-m="${m}">${m}</button>`).join('')}</div>
    <div class="ap-tb"><button type="button" class="ap-tab" data-a="tab-acasa">Acasă</button><button type="button" class="ap-tab" data-a="tab-proiect">Proiect</button><span class="ap-sp"></span>
      <button type="button" class="ap-btn" data-a="setari">🔧 Setări audio</button><button type="button" class="ap-btn ap-undo" data-a="anuleaza" title="Revenire: anulează ultima operație (Ctrl+Z)" aria-label="Revenire, anulează ultima operație (Ctrl+Z)">↶</button></div>
    <div class="ap-corp"><div class="ap-acasa"></div><div class="ap-proiect"><div class="ap-al"></div></div></div>
    <div class="ap-strat"></div></div>
  <div class="ap-inchis"><p>Audacity e închis.</p><button type="button" data-a="porneste">Pornește Audacity</button></div>
  <div class="ap-mic"><b>Tu, la microfon</b> <span style="color:#5a6275">(nu e în Audacity: așa alegi cum vorbești la microfon)</span>
    <div class="ap-rand">Distanța: <button type="button" data-a="dist" data-v="lipit">lipit de microfon</button><button type="button" data-a="dist" data-v="palma">la o palmă</button><button type="button" data-a="dist" data-v="departe">departe</button></div>
    <div class="ap-rand"><label><input type="checkbox" data-a="zgomot"> zgomot în jur (colegii vorbesc tare)</label></div></div>
  <p class="ap-mesaj" aria-live="polite"></p>
  <div class="ap-jos"><button type="button" data-a="reset">Ia-o de la capăt</button></div>`;
  const $=s=>wrap.querySelector(s);
  const FER=$('.ap-fer'),TT=$('.ap-tt'),ACASA=$('.ap-acasa'),PROI=$('.ap-proiect'),ALEL=$('.ap-al'),STRAT=$('.ap-strat'),MSG=$('.ap-mesaj');

  function init(){
    const S0=O.start||{};
    const fs={};Object.keys(FOLDERE).forEach(f=>fs[f]=[]);
    Object.entries(S0.fs||{}).forEach(([f,L])=>{fs[f]=(fs[f]||[]).concat(L.map(x=>({nume:/\.aup4$/i.test(x.nume)?x.nume:x.nume+'.aup4',autor:x.autor||'coleg',piste:x.piste?copie(x.piste):pisteVoce(x.voce||{seed:(x.nume.length*7)%97+1})})))});
    Object.assign(st,{ecran:S0.ecran||'acasa',proiect:null,fs,recente:copie(S0.recente||[]),mic:S0.mic||'casti',distanta:S0.distanta||'palma',
      zgomot:!!S0.zgomot,rec:null,undo:[],ultima:null,dialog:null,nuMaiArata:!!S0.nuMaiArata,seed:11,idClip:0,
      ultimFolder:S0.ultimFolderSalvare&&S0.ultimFolderSalvare in fs?S0.ultimFolderSalvare:'Documente/Audacity4/Projects'});
    J=[];dupaSalvare=null;
    if(S0.proiect){const p=S0.proiect;st.proiect={nume:p.nume?(/\.aup4$/i.test(p.nume)?p.nume:p.nume+'.aup4'):null,folder:p.folder||(p.nume?'Documente':null),
      modificat:!!p.modificat,piste:p.piste?copie(p.piste):p.voce?pisteVoce(p.voce):[]};
      if(st.proiect.piste.length&&st.proiect.piste[0].clipuri.length){const c=st.proiect.piste[0].clipuri.slice(-1)[0];st.ultima={clip:c,alId:-1,baza:0};
        /* proiect fără nume = înregistrare abia făcută: se poate anula (Ctrl+Z), ca după ■ */
        if(!st.proiect.nume)st.proiect.piste.forEach(p=>p.clipuri.forEach(cl=>st.undo.push({clip:cl,pista:p})))}
      if(st.proiect.nume&&!st.fs[st.proiect.folder].some(f=>f.nume===st.proiect.nume))st.fs[st.proiect.folder].push({nume:st.proiect.nume,autor:'tu',piste:copie(st.proiect.piste)})}
    if(st.ecran==='proiect'&&!st.proiect)st.ecran='acasa';
    J=[{tip:'start',ora:Date.now(),salvat:!!(st.proiect&&st.proiect.nume&&!st.proiect.modificat)}];
  }
  function emite(tip,date){const ev=Object.assign({tip,ora:Date.now()},date||{});J.push(ev);const S=stare();asc.forEach(f=>{try{f(S,ev)}catch(e){}});wrap.dispatchEvent(new CustomEvent('audioproiect',{detail:{stare:S,ev}}))}
  function stare(){return{ecran:st.ecran,proiect:st.proiect?{nume:st.proiect.nume,folder:st.proiect.folder,modificat:st.proiect.modificat,piste:st.proiect.piste}:null,
    mic:st.mic,distanta:st.distanta,zgomot:st.zgomot,inregistreaza:!!st.rec,dialog:st.dialog?st.dialog.tip:null,recente:copie(st.recente),nuMaiArata:st.nuMaiArata,
    ultimFolderSalvare:st.ultimFolder}}
  function mesaj(h){MSG.innerHTML=h||''}
  function titlu(){const p=st.proiect;if(!p||!p.nume)return 'Audacity 4.0';return fara(p.nume)+(p.modificat?' * ':' ')+'- Audacity 4.0'}

  /* ---------- fereastra proiectului (instanța AudioLinie) ---------- */
  function creeazaAL(){
    if(al){try{al.distruge()}catch(e){}al=null}
    if(!st.proiect)return;
    al=AudioLinie.creeaza(ALEL,{mod:'audio',nume:'proiect',piste:st.proiect.piste,vedere:O.vedere});alId++;
    al.on((S,ev)=>{if(ev&&['redare','continua','pauza','stop','capat','inceput','sfarsit','clic','rigla'].includes(ev.tip)){emite('al_'+ev.tip,{t:ev.t});verificaAscultat()}});
    const r=al.radacina.querySelector('[data-b="rosu"]');if(r){r.title='Înregistrează (R)';r.setAttribute('aria-label','Înregistrează (R)')}
  }
  /* „ai ascultat ultima înregistrare”: când redarea a acoperit 90% din ea, rămâne scris în jurnal (și după redeschidere) */
  function verificaAscultat(){const u=st.ultima;if(!u||!al||st.rec)return;
    if(J.some(e=>e.tip==='ascultat'&&e.clip===u.clip.id&&e.durata===u.clip.durata))return;
    const I=al.auzit().slice(u.alId===alId?u.baza:0);
    if(acopera(I,u.clip.start,u.clip.start+u.clip.durata)>=0.9)emite('ascultat',{clip:u.clip.id,durata:u.clip.durata})}
  function totalPiste(){return st.proiect?Math.max(0,...st.proiect.piste.flatMap(p=>p.clipuri.map(c=>c.start+c.durata))):0}

  /* ---------- înregistrarea ---------- */
  function pornesteInreg(){
    if(!st.proiect||st.rec||st.dialog)return;
    if(al&&al.stare().reda){mesaj('Întâi oprește redarea (■), apoi apasă ●.');return}
    let p=st.proiect.piste[0],noua=false;
    if(!p){p={tip:'audio',nume:'Audio 1',clipuri:[]};st.proiect.piste.push(p);noua=true}
    const start=p.clipuri.length?Math.max(...p.clipuri.map(c=>c.start+c.durata)):0;
    const o={distanta:st.distanta,mic:st.mic,zgomot:st.zgomot,seed:st.seed++};
    const c={id:'r'+(++st.idClip),nume:'Audio 1',start,durata:0.02,unda:[],calitate:calitate(o)};
    p.clipuri.push(c);
    if(noua||!al)creeazaAL();
    st.rec={clip:c,pista:p,o,t0:performance.now()/1000,noua};
    st.proiect.modificat=true;
    emite('inregistrare',{start,aDoua:p.clipuri.length>1});
    mesaj(p.clipuri.length>1?'● Se înregistrează, <b>după</b> prima înregistrare, pe aceeași pistă (așa face Audacity 3; Audacity 4 o poate pune pe o pistă nouă). Ca s-o refaci pe prima: oprești și apeși întâi săgeata ↶ (Ctrl+Z).'
      :'● Se înregistrează… Vorbește. Oprești cu ■ (Stop) sau cu bara de spațiu. <small>(În pagină nu se folosește microfonul: unda o face simulatorul.)</small>');
    deseneaza();
    const f=()=>{if(!st.rec||!wrap.isConnected)return;actualizeazaInreg(performance.now()/1000-st.rec.t0);raf=requestAnimationFrame(f)};raf=requestAnimationFrame(f);
  }
  function actualizeazaInreg(sec){
    const r=st.rec;if(!r||!al)return;const d=Math.max(0.02,Math.min(sec,600));
    r.clip.durata=d;r.clip.unda=undaVoce(d,r.o);al.redesenare();
    const S=al.stare(),Z=al.radacina.querySelector('.al-zona'),CAP=al.radacina.querySelector('.al-cap'),CE=al.radacina.querySelector('.al-ceas');
    if(Z&&CAP){const x=(r.clip.start+d-S.v0)/S.span*(Z.clientWidth||600);CAP.style.left=x.toFixed(1)+'px';CAP.style.display=''}
    if(CE)CE.textContent=AudioLinie.formatAudacity(r.clip.start+d);
  }
  function opresteInreg(secVirtual){
    const r=st.rec;if(!r)return;cancelAnimationFrame(raf);
    actualizeazaInreg(secVirtual!=null?secVirtual:performance.now()/1000-r.t0);
    st.rec=null;st.undo.push({clip:r.clip,pista:r.pista});
    st.ultima={clip:r.clip,alId,baza:al?al.auzit().length:0};
    al.redesenare();
    emite('stopInregistrare',{durata:r.clip.durata,calitate:r.clip.calitate});
    mesaj('Înregistrarea s-a oprit. Ascult-o: |◀ (Început), apoi ▶ (Redare). <small>În pagină nu se aude nimic: e doar o simulare.</small>');
    deseneaza();
  }
  function anuleaza(){
    if(st.rec){mesaj('Întâi oprește înregistrarea (■).');return}
    if(!st.proiect)return;
    const u=st.undo.pop();if(!u){mesaj('Nu e nimic de anulat.');return}
    const i=u.pista.clipuri.indexOf(u.clip);if(i>=0)u.pista.clipuri.splice(i,1);
    if(!u.pista.clipuri.length){const k=st.proiect.piste.indexOf(u.pista);if(k>=0)st.proiect.piste.splice(k,1);creeazaAL()}else if(al)al.redesenare();
    st.proiect.modificat=true;
    const rest=st.proiect.piste.flatMap(p=>p.clipuri);st.ultima=rest.length?{clip:rest[rest.length-1],alId,baza:0}:null;
    emite('anuleaza',{calitate:u.clip.calitate});mesaj('↶ Ai anulat ultima înregistrare. Acum poți înregistra din nou (●).');deseneaza();
  }

  /* ---------- fișierele ---------- */
  function existaFis(folder,nume){return (st.fs[folder]||[]).find(f=>f.nume.toLowerCase()===nume.toLowerCase())}
  function scrieFis(folder,nume){const L=st.fs[folder]||(st.fs[folder]=[]);const v=existaFis(folder,nume);const ob={nume,autor:'tu',piste:copie(st.proiect.piste)};
    if(v)L.splice(L.indexOf(v),1,ob);else L.push(ob);return v}
  function adaugaRecent(folder,nume){st.recente=[{nume,folder}].concat(st.recente.filter(r=>!(r.nume===nume&&r.folder===folder))).slice(0,8)}
  function deschideFisier(folder,nume,cale){
    const f=existaFis(folder,nume);if(!f){mesaj('Fișierul nu mai e acolo.');return false}
    st.proiect={nume:f.nume,folder,modificat:false,piste:copie(f.piste)};st.undo=[];
    const rest=st.proiect.piste.flatMap(p=>p.clipuri);st.ecran='proiect';creeazaAL();
    st.ultima=rest.length?{clip:rest[rest.length-1],alId,baza:0}:null;
    adaugaRecent(folder,f.nume);emite('deschis',{nume:f.nume,folder,cale,autor:f.autor});mesaj('');deseneaza();return true}
  function proiectNou(){
    if(st.proiect){mesaj('Ai deja un proiect deschis. În Audacity 4, Nou… deschide alt proiect, într-o fereastră nouă; în pagină lucrăm cu un singur proiect: închide-l întâi (Fișier › Închide proiectul).');return}
    st.proiect={nume:null,folder:null,modificat:false,piste:[]};st.undo=[];st.ultima=null;st.ecran='proiect';creeazaAL();emite('proiectNou');mesaj('');deseneaza()}

  /* ---------- salvarea / închiderea ---------- */
  function salveaza(ca){
    if(!st.proiect)return;if(st.rec){mesaj('Întâi oprește înregistrarea (■).');return}
    if(!ca&&st.proiect.nume){scrieFis(st.proiect.folder,st.proiect.nume);st.proiect.modificat=false;adaugaRecent(st.proiect.folder,st.proiect.nume);st.ultimFolder=st.proiect.folder;
      emite('salvat',{nume:st.proiect.nume,folder:st.proiect.folder,prima:false,inlocuitAltul:false});mesaj('Salvat: nicio fereastră, pentru că proiectul are deja nume.');deseneaza();gataSalvare();return}
    st.dialog=st.nuMaiArata?dialogWin('salvare',ca):{tip:'unde',ca};deseneaza();
  }
  function dialogWin(mod,ca){
    /* 1.1: numele propus „Fără titlu.aup4” (judecata 1, b1); folderul de pornire = ultimul folder în care s-a salvat (lastSavedProjectsPath) */
    return mod==='salvare'?{tip:'win',mod,ca,folder:st.ultimFolder in st.fs?st.ultimFolder:'Documente/Audacity4/Projects',nume:st.proiect&&st.proiect.nume?st.proiect.nume:'Fără titlu.aup4',sel:null,eroare:''}
      :{tip:'win',mod,folder:'Descărcări',nume:'',sel:null,eroare:''}}
  function confirmaSalvare(numeIntrodus){
    const d=st.dialog;let n=String(numeIntrodus==null?d.nume:numeIntrodus).trim();d.nume=n;
    if(!n){d.eroare='';deseneaza();return}
    if(/[\\/:*?"<>|]/.test(n)){d.eroare='Numele fișierului nu este valid. Nu folosi \\ / : * ? " < > |';deseneaza();return}
    if(!/\.aup4$/i.test(n))n+='.aup4';
    const prima=!st.proiect.nume,v=existaFis(d.folder,n);
    const altul=!!v&&!(st.proiect.nume&&st.proiect.folder===d.folder&&st.proiect.nume.toLowerCase()===n.toLowerCase());
    /* 1.1: „Salvează ca…” de pe un proiect CU NUME, peste ALT proiect existent → „Eroare la salvarea proiectului”, proiectul de acolo
       dispare, al tău rămâne cum era (judecata 1, a3). Fără 'salvat'; eveniment nou 'eroareSalvare'. */
    if(d.ca&&!prima&&altul){
      const L=st.fs[d.folder]||[];L.splice(L.indexOf(v),1);
      st.dialog={tip:'eroare'};dupaSalvare=null;
      emite('eroareSalvare',{nume:v.nume,folder:d.folder,sters:true,autorSters:v.autor});
      mesaj('');deseneaza();return}
    scrieFis(d.folder,n);   /* Audacity 4: NU întreabă dacă numele există deja — înlocuiește (probat, proba 5; judecata 1, a2) */
    st.proiect.nume=n;st.proiect.folder=d.folder;st.proiect.modificat=false;st.dialog=null;adaugaRecent(d.folder,n);st.ultimFolder=d.folder;
    emite('salvat',{nume:n,folder:d.folder,prima,inlocuitAltul:altul,autorInlocuit:altul?v.autor:null});mesaj('');deseneaza();gataSalvare();
  }
  function gataSalvare(){if(dupaSalvare){const f=dupaSalvare;dupaSalvare=null;f()}}
  function nevoieIntrebare(){return !!st.proiect&&(st.proiect.modificat||!st.proiect.nume)}
  function inchideProiect(apoi){
    if(!st.proiect)return;if(st.rec){mesaj('Întâi oprește înregistrarea (■).');return}
    if(nevoieIntrebare()){st.dialog={tip:'nesalvate',apoi:apoi||'proiect'};deseneaza();return}
    termina(apoi||'proiect')}
  function termina(apoi){
    if(al){try{al.distruge()}catch(e){}al=null}
    st.proiect=null;st.undo=[];st.ultima=null;st.dialog=null;
    if(apoi==='aplicatie'){st.ecran='inchis';emite('aplicatieInchisa')}else{st.ecran='acasa';emite('inchisProiect')}
    mesaj('');deseneaza()}
  function inchideAplicatia(){if(st.rec){mesaj('Întâi oprește înregistrarea (■).');return}if(st.proiect)inchideProiect('aplicatie');else{st.ecran='inchis';st.dialog=null;emite('aplicatieInchisa');deseneaza()}}

  /* ---------- desenul ---------- */
  function deseneaza(){
    wrap.classList.toggle('inchis',st.ecran==='inchis');
    TT.textContent=titlu();
    const tA=$('[data-a="tab-acasa"]'),tP=$('[data-a="tab-proiect"]');
    tA.classList.toggle('activ',st.ecran==='acasa');tP.classList.toggle('activ',st.ecran==='proiect');tP.disabled=!st.proiect;
    $('[data-a="setari"]').style.display=st.ecran==='proiect'?'':'none';$('[data-a="anuleaza"]').style.display=st.ecran==='proiect'?'':'none';
    ACASA.style.display=st.ecran==='acasa'?'':'none';PROI.style.display=st.ecran==='proiect'?'':'none';
    if(st.ecran==='acasa')ACASA.innerHTML=`<h4>Proiecte</h4><div class="ap-filerow"><span>Noi și recente</span><span>Proiecte în Cloud</span></div>
      <div class="ap-dale"><button type="button" class="ap-dala" data-a="proiect-nou"><span class="ap-dimg" aria-hidden="true">+</span><span class="ap-dn">Proiect nou</span></button>
      ${st.recente.map((r,i)=>`<button type="button" class="ap-dala rec" data-a="recent" data-i="${i}"><span class="ap-dimg" aria-hidden="true">∿∿∿</span><span class="ap-dn">${esc(fara(r.nume))}</span><span class="ap-dz">AZI</span></button>`).join('')}</div>
      <div class="ap-jos2"><button type="button" class="ap-btn" data-a="nou-jos">Nou</button><button type="button" class="ap-btn" data-a="deschide-altul">Deschide altul...</button></div>`;
    const R=al&&al.radacina.querySelector('[data-b="rosu"]');if(R)R.classList.toggle('ap-inreg',!!st.rec);
    wrap.querySelectorAll('[data-a="dist"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===st.distanta)));
    $('[data-a="zgomot"]').checked=st.zgomot;
    desenStrat();
  }
  function desenStrat(){
    const d=st.dialog;STRAT.classList.toggle('vizibil',!!d);
    $('.ap-mb [data-m="Fișier"]').classList.toggle('deschis',!!d&&d.tip==='meniu');
    if(!d){STRAT.innerHTML='';return}
    if(d.tip==='meniu'){const P=!!st.proiect,it=(a,t,k,ok)=>`<button type="button" data-a="mf" data-v="${a}" aria-disabled="${ok?'false':'true'}"><span>${t}</span><kbd>${k||''}</kbd></button>`;
      STRAT.innerHTML=`<div class="ap-meniu" role="menu" aria-label="Meniul Fișier">${it('nou','Nou…','Ctrl+N',1)}${it('deschide','Deschide…','Ctrl+O',1)}${it('recent','Deschide recent','',0)}<hr>
        ${it('importa','Importă…','Ctrl+Shift+I',P)}<hr>${it('salveaza','Salvează','Ctrl+S',P)}${it('cloud','Salvează în cloud…','',P)}${it('salveazaca','Salvează ca…','',P)}<hr>
        ${it('exporta','Exportă audio…','Ctrl+Shift+E',P&&totalPiste()>0)}<hr>${it('inchide-proiect','Închide proiectul','Ctrl+W',P)}${it('inchide','Închide','Ctrl+Q',1)}
        <p class="ap-nota">În pagină alegi din meniu. Ctrl+N, Ctrl+O și Ctrl+W le apeși doar în Audacity-ul adevărat: în browser ele deschid sau închid file și ferestre (Ctrl+W închide lecția).</p></div>`;return}
    if(d.tip==='eroare'){STRAT.innerHTML=`<div class="ap-dlg" role="alertdialog" aria-label="Eroare la salvarea proiectului"><div class="ap-dt"><span>Audacity</span><button type="button" class="ap-x" data-a="er-ok" aria-label="Închide fereastra">✕</button></div>
      <div class="ap-dc ap-er"><span class="ap-eri" aria-hidden="true">✕</span><div><b>Eroare la salvarea proiectului</b><p>Audacity a eșuat să scrie într-un fișier.<br>Poate C: nu are drepturi de scriere sau discul este plin.</p></div></div>
      <div class="ap-db"><button type="button" class="prim" data-a="er-ok">OK</button></div></div>`;
      const ok=STRAT.querySelector('.ap-db [data-a="er-ok"]');setTimeout(()=>{try{ok.focus({preventScroll:true})}catch(e){}},0);return}
    if(d.tip==='setari'){STRAT.innerHTML=`<div class="ap-setari" role="menu" aria-label="Setări audio"><button type="button" data-a="sa" data-v="alt"><span>Gazdă</span><span>▸</span></button>
      <button type="button" data-a="sa" data-v="alt"><span>Dispozitiv redare</span><span>▸</span></button><button type="button" data-a="sa" data-v="inreg"><span>Dispozitiv înregistrare</span><span>▸</span></button>
      ${d.sub?`<div class="ap-sub">${Object.entries(DISP).map(([k,v])=>`<button type="button" data-a="mic" data-v="${k}"><span>${st.mic===k?'✓ ':''}${esc(v)}</span></button>`).join('')}</div>`:''}
      <button type="button" data-a="sa" data-v="alt"><span>Canale înregistrare</span><span>▸</span></button><button type="button" data-a="sa" data-v="alt"><span>Rescanează dispozitive audio</span></button><button type="button" data-a="sa" data-v="alt"><span>Setări audio</span></button></div>`;return}
    if(d.tip==='unde'){STRAT.innerHTML=`<div class="ap-dlg" role="dialog" aria-label="Salvează proiect"><div class="ap-dt"><span>Salvează proiect</span><button type="button" class="ap-x" data-a="dlg-x" aria-label="Închide fereastra">✕</button></div>
      <div class="ap-dc"><p style="text-align:center;font-weight:700;font-size:1.05rem;margin:2px 0 10px">Unde dorești să salvezi?</p><div class="ap-carduri">
      <div class="ap-card"><b>Salvează în Cloud (gratuit)</b><p>Proiectul tău este salvat privat pe audio.com…</p><button type="button" data-a="cloud">Salvează în Cloud</button></div>
      <div class="ap-card"><b>Pe calculatorul meu</b><p>Dacă preferi să îți salvezi fișierele pe calculator, poți face asta de aici.</p><button type="button" data-a="pe-calculator">Salvează pe calculator</button></div></div>
      <label class="ap-bifa"><input type="checkbox" data-a="nu-mai-arata"${st.nuMaiArata?' checked':''}> Nu mai arăta din nou</label>${d.info?`<p class="ap-eroare">${d.info}</p>`:''}</div></div>`;return}
    if(d.tip==='nesalvate'){STRAT.innerHTML=`<div class="ap-dlg" role="dialog" aria-label="Modificări nesalvate"><div class="ap-dt"><span>Modificări nesalvate</span><button type="button" class="ap-x" data-a="ns-renunta" aria-label="Închide fereastra">✕</button></div>
      <div class="ap-dc"><b>Dorești să salvezi modificările acestui proiect înainte de a-l închide?</b><p style="margin:6px 0 0">Modificările tale vor fi pierdute dacă nu le salvezi.</p></div>
      <div class="ap-db"><button type="button" class="prim" data-a="ns-salveaza">Salvează</button><button type="button" data-a="ns-nu">Nu salva</button><button type="button" data-a="ns-renunta">Renunță</button></div></div>`;return}
    if(d.tip==='win'){const S=d.mod==='salvare',f=d.folder,subs=FOLDERE[f]||[],fis=(st.fs[f]||[]).filter(x=>/\.aup4$/i.test(x.nume));
      STRAT.innerHTML=`<div class="ap-dlg ap-win" role="dialog" aria-label="${S?'Salvează proiect':'Deschide'}"><div class="ap-dt"><span>${S?'Salvează proiect':'Deschide'}</span><button type="button" class="ap-x" data-a="w-anulare" aria-label="Închide fereastra">✕</button></div>
      <div class="ap-dc"><div class="ap-adr" aria-label="Bara de adresă">📁 ${esc(NUME_FOLDER(f))}</div>
      <div class="ap-wcorp"><div class="ap-nav" aria-label="Locuri">${['Desktop','Descărcări','Documente'].map(n=>`<button type="button" data-a="w-nav" data-v="${n}" class="${f===n?'activ':''}">${n==='Desktop'?'🖥':n==='Descărcări'?'⬇':'📄'} ${n}</button>`).join('')}</div>
      <div class="ap-lista" aria-label="Fișierele din folder"><div class="ap-cap">Nume</div>${subs.map(s=>`<button type="button" data-a="w-folder" data-v="${esc(s)}">📁 ${esc(s)}</button>`).join('')}
      ${fis.map(x=>`<button type="button" data-a="w-fis" data-v="${esc(x.nume)}" class="${d.sel===x.nume?'sel':''}">∿ ${esc(x.nume)}</button>`).join('')}
      ${!subs.length&&!fis.length?'<div class="ap-gol">Niciun element nu corespunde căutării.</div>':''}</div></div>
      <div class="ap-camp"><label for="ap-nf-${alId}">Nume fișier:</label><input id="ap-nf-${alId}" type="text" data-a="w-nume" value="${esc(d.nume)}" autocomplete="off" spellcheck="false">
      <span>${S?'Salvare cu tipul:':'Tip:'}</span><select disabled aria-label="${S?'Salvare cu tipul':'Tipul fișierelor'}"><option>${S?'Fișiere Audacity 4 (*.aup4) (*.)':'Toate fișierele suportate (*.aup4,…)'}</option></select></div>
      ${d.eroare?`<p class="ap-eroare">${esc(d.eroare)}</p>`:''}</div>
      <div class="ap-db"><button type="button" class="prim" data-a="w-ok">${S?'Salvare':'Deschidere'}</button><button type="button" data-a="w-anulare">Anulare</button></div></div>`;
      const inp=STRAT.querySelector('[data-a="w-nume"]');if(inp&&d.selecteaza!==false){d.selecteaza=false;setTimeout(()=>{try{inp.focus({preventScroll:true});inp.select()}catch(e){}},0)}
      return}
  }

  /* ---------- gesturile ---------- */
  function actiune(a,b){
    const d=st.dialog;
    switch(a){
      case 'meniu':if(b.dataset.m==='Fișier'){st.dialog=d&&d.tip==='meniu'?null:{tip:'meniu'};deseneaza()}
        else{st.dialog=null;deseneaza();mesaj(`Meniul <b>${esc(b.dataset.m)}</b> nu-l folosim în lecția asta.${b.dataset.m==='Înregistrează'?' Pentru înregistrare folosești butonul roșu ●.':''}`)}return;
      case 'mf':{if(b.getAttribute('aria-disabled')==='true')return;const v=b.dataset.v;st.dialog=null;deseneaza();
        if(v==='nou')proiectNou();else if(v==='deschide'){st.dialog=dialogWin('deschide');deseneaza()}
        else if(v==='salveaza')salveaza(false);else if(v==='salveazaca')salveaza(true);
        else if(v==='cloud')mesaj('Salvarea în cloud cere un cont pe audio.com. La școală salvezi <b>pe calculator</b>.');
        else if(v==='importa')mesaj('Importul (aduci un sunet din alt fișier) îl folosești într-o lecție următoare.');
        else if(v==='exporta')mesaj('Exportul (faci din proiect un fișier MP3 sau WAV) îl înveți într-o lecție următoare.');
        else if(v==='inchide-proiect')inchideProiect('proiect');else if(v==='inchide')inchideAplicatia();return}
      case 'tab-acasa':if(st.rec)return mesaj('Întâi oprește înregistrarea (■).');st.ecran='acasa';st.dialog=null;deseneaza();return;
      case 'tab-proiect':if(st.proiect){st.ecran='proiect';deseneaza();if(al)al.redesenare()}return;
      case 'proiect-nou':case 'nou-jos':proiectNou();return;
      case 'recent':{const r=st.recente[+b.dataset.i];if(r)deschideFisier(r.folder,r.nume,'recent');return}
      case 'deschide-altul':st.dialog=dialogWin('deschide');deseneaza();return;
      case 'setari':if(st.rec)return mesaj('Întâi oprește înregistrarea (■).');st.dialog=d&&d.tip==='setari'?null:{tip:'setari',sub:false};deseneaza();return;
      case 'sa':if(b.dataset.v==='inreg'){d.sub=!d.sub;deseneaza()}else mesaj('Asta nu o schimbăm. Aici ne trebuie doar <b>Dispozitiv înregistrare</b>.');return;
      case 'mic':st.mic=b.dataset.v;st.dialog=null;emite('mic',{mic:st.mic});mesaj(`Audacity înregistrează acum de la: <b>${esc(DISP[st.mic])}</b>.`);deseneaza();return;
      case 'anuleaza':anuleaza();return;
      case 'x':inchideAplicatia();return;
      case 'porneste':st.ecran='acasa';st.dialog=null;emite('pornit');mesaj('');deseneaza();return;
      case 'dist':if(st.rec)return mesaj('Schimbă distanța între două înregistrări, nu în timpul uneia.');st.distanta=b.dataset.v;emite('distanta',{distanta:st.distanta});deseneaza();return;
      case 'reset':reset();return;
      case 'dlg-x':st.dialog=null;dupaSalvare=null;deseneaza();return;
      case 'cloud':d.info='Salvarea în Cloud cere un cont pe audio.com. La școală alegi «Salvează pe calculator».';deseneaza();return;
      case 'pe-calculator':st.dialog=dialogWin('salvare',d.ca);deseneaza();return;
      case 'ns-salveaza':{const ap=d.apoi;dupaSalvare=()=>termina(ap);st.dialog=null;salveaza(false);return}
      case 'ns-nu':termina(d.apoi);return;
      case 'ns-renunta':st.dialog=null;dupaSalvare=null;deseneaza();return;
      case 'er-ok':st.dialog=null;deseneaza();return;
      case 'w-nav':d.folder=b.dataset.v;d.sel=null;d.eroare='';deseneaza();return;
      case 'w-folder':d.folder=d.folder+'/'+b.dataset.v;d.sel=null;deseneaza();return;
      case 'w-fis':d.sel=b.dataset.v;d.nume=b.dataset.v;d.selecteaza=false;deseneaza();return;
      case 'w-anulare':st.dialog=null;dupaSalvare=null;deseneaza();return;
      case 'w-ok':{const inp=STRAT.querySelector('[data-a="w-nume"]');const v=inp?inp.value:d.nume;
        if(d.mod==='salvare')confirmaSalvare(v);else{let n=String(v).trim();if(!n&&d.sel)n=d.sel;if(!n)return;if(!/\.aup4$/i.test(n))n+='.aup4';
          if(!existaFis(d.folder,n)){d.nume=n;d.eroare=`Nu se găsește „${n}” în ${NUME_FOLDER(d.folder)}.`;deseneaza();return}
          if(st.proiect){mesaj('Ai deja un proiect deschis: închide-l întâi (Fișier › Închide proiectul).');st.dialog=null;deseneaza();return}
          st.dialog=null;deschideFisier(d.folder,n,'dialog')}return}
    }
  }
  wrap.addEventListener('click',e=>{
    /* butoanele AudioLinie pe care le preia extensia (faza de captură: ajung la noi înaintea simulatorului lecției 11) */
    const bl=e.target.closest('.al [data-b]');
    if(bl&&wrap.contains(bl)){const id=bl.dataset.b;
      if(id==='rosu'){e.stopPropagation();e.preventDefault();if(!bl.disabled)pornesteInreg();FER.focus({preventScroll:true});return}
      if(st.rec&&id==='stop'){e.stopPropagation();e.preventDefault();opresteInreg();FER.focus({preventScroll:true});return}
      if(st.rec&&['reda','inceput','sfarsit'].includes(id)){e.stopPropagation();e.preventDefault();mesaj('Întâi oprește înregistrarea (■).');return}
      return}
    if(st.rec&&e.target.closest('.al-zona')){e.stopPropagation();e.preventDefault();return}
  },true);
  wrap.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||!wrap.contains(b)||b.tagName==='INPUT')return;
    if(b.disabled)return;actiune(b.dataset.a,b);
    if(['meniu','mf','tab-proiect','tab-acasa','recent','proiect-nou','nou-jos','w-ok','ns-nu','dlg-x','w-anulare','ns-renunta','er-ok'].includes(b.dataset.a)&&!st.dialog)FER.focus({preventScroll:true})});
  STRAT.addEventListener('click',e=>{if(e.target===STRAT&&st.dialog&&['meniu','setari'].includes(st.dialog.tip)){st.dialog=null;deseneaza()}});
  STRAT.addEventListener('dblclick',e=>{const b=e.target.closest('[data-a="w-fis"]');const d=st.dialog;if(b&&d&&d.tip==='win'&&d.mod==='deschide'){d.sel=b.dataset.v;d.nume=b.dataset.v;actiune('w-ok',b)}});
  wrap.addEventListener('change',e=>{const t=e.target;if(t.dataset.a==='zgomot'){if(st.rec){t.checked=st.zgomot;return mesaj('Schimbă asta între două înregistrări.')}st.zgomot=t.checked;emite('zgomot',{zgomot:st.zgomot});deseneaza()}
    else if(t.dataset.a==='nu-mai-arata'){st.nuMaiArata=t.checked;if(t.checked)mesaj('Pe calculatorul din laborator <b>nu</b> bifa „Nu mai arăta din nou”: colegul de după tine n-ar mai vedea întrebarea.')}
    else if(t.dataset.a==='w-nume'&&st.dialog)st.dialog.nume=t.value});
  wrap.addEventListener('input',e=>{if(e.target.dataset.a==='w-nume'&&st.dialog){st.dialog.nume=e.target.value;st.dialog.sel=null}});
  wrap.addEventListener('keydown',e=>{
    const inInput=e.target.tagName==='INPUT';const d=st.dialog;
    /* 1.1 (judecata 1, M5): după Enter în „Nume fișier”, focusul se întoarce pe fereastra Audacity (ca la clic pe Salvare),
       ca Ctrl+S, Ctrl+Z, R și Space să meargă mai departe; dacă rămâne o fereastră (eroarea), focusul e pe butonul ei. */
    if(d&&d.tip==='win'&&e.key==='Enter'&&inInput){e.preventDefault();actiune('w-ok',e.target);if(!st.dialog)FER.focus({preventScroll:true});return}
    if(d&&e.key==='Escape'){e.preventDefault();st.dialog=null;dupaSalvare=null;deseneaza();FER.focus({preventScroll:true});return}
    /* 1.1 (judecata 1, M4): Ctrl+N, Ctrl+O, Ctrl+W NU se mai prind — în Edge/Chrome le ia browserul (Ctrl+W închide fila lecției),
       iar o probă headless care le „trece” minte. În pagină se aleg din meniul Fișier. Rămân Ctrl+S și Ctrl+Z. */
    if(e.ctrlKey&&!e.altKey){const k=e.key.toLowerCase();
      if(['s','z'].includes(k)){e.preventDefault();e.stopPropagation();if(inInput&&k!=='s')return;if(d&&d.tip!=='meniu')return;st.dialog=null;
        if(st.ecran==='inchis')return;
        if(k==='s')salveaza(false);else if(k==='z'){if(st.ecran==='proiect')anuleaza()}}
      return}
    if(inInput||d)return;
    if(st.rec&&(e.code==='Space'||e.key===' ')){e.preventDefault();e.stopPropagation();opresteInreg();return}
    if(!st.rec&&st.ecran==='proiect'&&(e.key==='r'||e.key==='R')&&!e.target.closest('.ap-mic')){e.preventDefault();e.stopPropagation();pornesteInreg();return}
    /* 1.1 (judecata 1, m1): Space în afara înregistrării, pe fila Proiect, cu focusul pe fereastra Audacity (nu pe un buton, nu în
       fereastra AudioLinie, care își prinde singură tasta) = Redare / Stop, ca în lecția 11 (Audacity 4: playback/toggle-play-stop). */
    if(!st.rec&&st.ecran==='proiect'&&al&&(e.code==='Space'||e.key===' ')&&FER.contains(e.target)&&!al.radacina.contains(e.target)&&!e.target.closest('button,input,select,textarea,a')){
      e.preventDefault();e.stopPropagation();al.simuleaza([{tasta:'Space'}]);return}
  },true);

  /* ---------- simulare (poartă, probe, „Arată-mi răspunsul”) ---------- */
  function simuleaza(L){(L||[]).forEach(a=>{
    if(a.proiectNou)proiectNou();
    else if(a.pornesteAplicatia)actiune('porneste',{dataset:{}});
    else if('distanta' in a){st.distanta=a.distanta;emite('distanta',{distanta:a.distanta})}
    else if('zgomot' in a){st.zgomot=!!a.zgomot;emite('zgomot',{zgomot:st.zgomot})}
    else if('mic' in a){st.mic=a.mic;emite('mic',{mic:a.mic})}
    else if('inregistreaza' in a){pornesteInreg();if(st.rec)opresteInreg(a.inregistreaza)}
    else if(a.anuleaza)anuleaza();
    else if(a.asculta){if(al){const t=totalPiste();al.simuleaza([{inceput:1},{reda:1},{asteapta:t+0.5}])}}
    else if(a.al){if(al)al.simuleaza(a.al)}
    else if(a.salveaza){const s=a.salveaza;salveaza(!!s.ca);if(st.dialog&&st.dialog.tip==='unde')st.dialog=dialogWin('salvare',s.ca);
      if(st.dialog&&st.dialog.tip==='win'){if(s.folder)st.dialog.folder=s.folder;confirmaSalvare(s.nume)}}
    else if(a.inchideProiect||a.inchideAplicatia){if(a.inchideProiect)inchideProiect('proiect');else inchideAplicatia();
      if(st.dialog&&st.dialog.tip==='nesalvate'){if(a.raspuns==='salveaza')actiune('ns-salveaza',{dataset:{}});else actiune('ns-nu',{dataset:{}})}}
    else if(a.deschideRecent){const i=st.recente.findIndex(r=>fara(r.nume)===fara(a.deschideRecent));if(i>=0)deschideFisier(st.recente[i].folder,st.recente[i].nume,'recent')}
    else if(a.deschide){let n=a.deschide.nume;if(!/\.aup4$/i.test(n))n+='.aup4';deschideFisier(a.deschide.folder||'Documente',n,'dialog')}
    else if(a.ok){if(st.dialog&&st.dialog.tip==='eroare')actiune('er-ok',{dataset:{}})}
  });deseneaza()}
  function reset(){cancelAnimationFrame(raf);if(al){try{al.distruge()}catch(e){}al=null}alId++;init();if(st.proiect){creeazaAL()}mesaj('');emite('reset');deseneaza()}

  init();if(st.proiect)creeazaAL();deseneaza();
  const x={radacina:wrap,versiune:VERS,stare,jurnal:()=>J.map(e=>Object.assign({},e)),al:()=>al,fs:()=>st.fs,
    ultima:()=>st.ultima?{clip:st.ultima.clip,durata:st.ultima.clip.durata,calitate:st.ultima.clip.calitate}:null,
    auzitUltima:()=>{const u=st.ultima;if(!u||!al)return 0;const I=al.auzit().slice(u.alId===alId?u.baza:0),a=u.clip.start,b=u.clip.start+u.clip.durata;return acopera(I,a,b)},
    auzitTot:()=>{if(!al)return 0;const t=totalPiste();return t>0?acopera(al.auzit(),0,t):0},
    simuleaza,reset,mesaj,on:f=>asc.add(f),off:f=>asc.delete(f),focus:()=>FER.focus({preventScroll:true}),
    distruge(){cancelAnimationFrame(raf);if(al){try{al.distruge()}catch(e){}}wrap.remove()}};
  return x;
}
const acopera=(I,a,b)=>{if(b<=a)return 0;const L=I.map(x=>[Math.max(a,x[0]),Math.min(b,x[1])]).filter(x=>x[1]>x[0]).sort((x,y)=>x[0]-y[0]);let tot=0,cur=a;L.forEach(([x,y])=>{if(y>cur){tot+=y-Math.max(x,cur);cur=y}});return tot/(b-a)};

/* ---------- verificările testelor: (x, parametru) => true/false ---------- */
const ev=(x,t)=>x.jurnal().filter(e=>e.tip===t);
const VERIFICARI={
  proiectNou:x=>ev(x,'proiectNou').length>0,
  inregistrat:(x,p)=>{const u=x.ultima();p=p||{};return !!u&&!x.stare().inregistreaza&&u.durata>=(p.min||1)&&(!p.buna||u.calitate==='buna')},
  inregistrareBuna:x=>{const u=x.ultima();return !!u&&u.calitate==='buna'},
  ascultat:x=>{const u=x.ultima();return !!u&&(x.auzitUltima()>=0.9||ev(x,'ascultat').some(e=>e.clip===u.clip.id&&e.durata===u.durata))},
  ascultatTot:x=>x.auzitTot()>=0.9,
  refacut:x=>ev(x,'anuleaza').some(e=>e.calitate!=='buna')&&(()=>{const u=x.ultima();return !!u&&u.calitate==='buna'})(),
  micCorect:x=>x.stare().mic==='casti'&&ev(x,'mic').length>0,
  salvat:(x,p)=>{p=p||{};return ev(x,'salvat').some(e=>(!p.folder||e.folder===p.folder)&&(!p.nume||new RegExp(p.nume,'i').test(e.nume.replace(/\.aup4$/i,'')))&&(!p.prima||e.prima))},
  salvatDupaInregistrare:x=>{const J=x.jurnal();const i=J.map(e=>e.tip).lastIndexOf('stopInregistrare');return i>=0&&J.slice(i+1).some(e=>e.tip==='salvat')},
  numeRegula:x=>ev(x,'salvat').some(e=>numeTau(e.nume)),
  /* 1.1: un proiect șters de „Salvează ca…” (eroareSalvare) nu e nici el „neatins” */
  nimicInlocuit:x=>ev(x,'salvat').length>0&&!ev(x,'salvat').some(e=>e.inlocuitAltul)&&!ev(x,'eroareSalvare').some(e=>e.sters),
  nimicSters:x=>!ev(x,'eroareSalvare').some(e=>e.sters),
  inchis:x=>ev(x,'inchisProiect').length+ev(x,'aplicatieInchisa').length>0,
  salvatRegula:(x,p)=>ev(x,'salvat').some(e=>e.folder===((p&&p.folder)||'Documente')&&numeTau(e.nume)),
  redeschis:(x,p)=>{p=p||{};const J=x.jurnal();const iS=J.findIndex(e=>e.tip==='salvat'||(e.tip==='start'&&e.salvat));if(iS<0)return false;
    const iI=J.findIndex((e,i)=>i>iS&&(e.tip==='inchisProiect'||e.tip==='aplicatieInchisa'));if(iI<0)return false;
    return J.some((e,i)=>i>iI&&e.tip==='deschis'&&e.autor==='tu'&&(!p.cale||e.cale===p.cale))&&!!x.stare().proiect},
  ecran:(x,v)=>x.stare().ecran===v,
  folosit:(x,t)=>ev(x,t).length>0
};
function verifica(x,T){for(const k of Object.keys(T)){if(k==='ce'||k==='cum')continue;const f=VERIFICARI[k];if(f)return !!f(x,T[k])}return false}

/* ---------- tipul pentru motor: {t:'audioproiect', …} ---------- */
const TipAudioProiect={
  render(Q,body,api){
    stil();
    body.innerHTML=`<div class="ap-loc"></div>${(Q.teste||[]).length?`<div class="ap-teste"><b>Testele</b> <span class="hint">· se bifează singure, pe măsură ce lucrezi</span><ol>${Q.teste.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`:''}`;
    const x=creeaza(body.querySelector('.ap-loc'),Q);body._ap=x;
    const T=Q.teste||[];
    function marcheaza(arata){let ok=0;T.forEach((t,i)=>{const li=body.querySelector(`.ap-teste li[data-i="${i}"]`),b=verifica(x,t);if(b)ok++;
      if(!li)return;li.classList.toggle('ok',b);li.classList.toggle('rau',!b&&arata);li.querySelector('.s').textContent=b?'✓':arata?'✗':'○';li.querySelector('.m').innerHTML=!b&&arata&&t.cum?t.cum:''});return ok}
    x.on(()=>marcheaza(false));
    let al0=null;const leagaAl=()=>{const a=x.al();if(a&&a!==al0){al0=a;a.on(()=>marcheaza(false))}};x.on(leagaAl);leagaAl();
    const nav=api.checkButton(()=>{
      const ok=marcheaza(true);x.focus();
      if(ok===T.length){nav.innerHTML='';api.resolve(true)}
      else{const p=T.find(t=>!verifica(x,t));api.resolve(false,`${ok} din ${T.length} teste trecute. ${p&&p.cum?p.cum:''}`);
        api.revealButton(()=>{x.reset();x.simuleaza(Q.solutie||[]);marcheaza(true);nav.innerHTML='';api.giveUp(Q.raspuns||'testele sunt acum bifate: uită-te ce s-a făcut, pas cu pas.')})}
    },Q.verifica||'Verifică');
    marcheaza(false);
  },
  rezolva(Q,body){const x=body._ap;x.reset();x.simuleaza(Q.solutie||[]);return true},
  gresit(Q,body){const x=body._ap;x.reset();x.simuleaza(Q.gresit||[]);return true}
};
window.AudioProiect={versiune:VERS,creeaza,verificari:VERIFICARI,verifica,undaVoce,RE_NUME,numeTau,dispozitive:DISP};
window.TipAudioProiect=TipAudioProiect;
})();
