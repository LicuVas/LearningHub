/* Simulatorul „video-clipchamp” pentru lecțiile LearningHub — fișier comun (lectii/_sim/video-clipchamp.js).
   PROPRIETAR: autorul lecției VII · M2 · nr. 14 („Efecte de tranziție între scene. Coloană sonoră peste scene”),
   creat 12.10.2026. Lecția VII/15 (textul peste scene) îl EXTINDE într-un fișier nou (de ex. video-clipchamp-text.js),
   nu îl rescrie; ce are voie să schimbe și ce nu: lectii/vii/m2-l14/surse.md, „Pentru lecția următoare”.

   CE SIMULEAZĂ (editorul video Clipchamp din Windows 11, doar ce trebuie lecției):
     pagina de pornire cu butonul „Creați un videoclip nou”; editorul: numele proiectului sus, ↶ ↷, „Exportați” (doar
     mesaj); bara din stânga cu filele „Conținutul meu media” și „Tranziții”; butonul „Importați conținutul media” cu
     fereastra Windows „Deschidere” (Descărcări, clic / Ctrl + clic / Shift + clic, Deschidere, Anulare); previzualizarea
     16:9 cu |◀ ↺5 ▶ ↻5 și ceasul 0:00.00 / 0:16.00; linia de timp (rigla cu secunde, capul de redare, pista video cu
     scenele, pista audio cu unda, pista text dacă proiectul are clipuri text), Mărește / Micșorează / Potrivește;
     panoul de proprietăți (tranziția: felul + Durată; clipul audio: Volum); rândul „Acum, pe ecran” (ce se vede și ce
     se aude la capul de redare: scena, trecerea, ecran negru, muzica și volumul ei).

   FIDELITATE — ce e DOCUMENTAT (documentația oficială Microsoft, citatele în lectii/vii/m2-l14/_proba/docs/citate_clipchamp.md)
   sau VĂZUT în capturile Clipchamp în română din jocul jocuri/audio-video-vii (img/SURSE.json al jocului):
     - D  pagina de pornire: butonul „creați un videoclip nou” (create a new video); proiectul nou e 16:9, fără titlu;
     - C  „Conținutul meu media”, butonul „Importați conținutul media”, „Glisați și fixați conținutul media de pe dispozitiv
          pentru a importa”, „Videoclipuri, audio, imagini, GIF-uri”, ↶ ↷ sus, „Exportați”, „Distribuiți” (captura zonelor);
     - D  materialele ajung pe linia de timp prin glisare (drag and drop) sau cu butonul verde + de pe material;
     - D  o imagine pusă pe linia de timp are durata implicită de PATRU secunde; durata se schimbă cu mânerele de la
          capete, după ce clipul e ales (spre dreapta = mai lungă, spre stânga = mai scurtă);
     - D  golurile apar când scurtezi sau muți clipuri; un gol = spațiu gol între două clipuri; butonul „Ștergeți acest spațiu
          liber” (delete this gap) îl închide și trage clipurile de după el spre stânga; tras spre stânga, clipul se lipește de vecin;
     - D  tranziția se pune DOAR între două clipuri alăturate, fără gol: o tragi din fila „Tranziții” pe linia de timp,
          între ele, sau apeși butonul de adăugare a tranziției dintre ele (pune „cross fade”, Estompare încrucișată);
          aleasă (clic pe ea), panoul de proprietăți arată felul (cu opțiunea „fără” = scoate tranziția) și Durata
          (glisor + casetă cu număr); ↶ anulează;
     - C  fila „Tranziții”: „Adăugați tranziții”, „Glisați o tranziție între două clipuri în cronologie”, grupul „Estompări și
          încețoșări” cu „Estompare încrucișată” (captura clipchamp-tranzitii.webp; celelalte nume sunt tăiate în captură);
     - D  volumul unui clip: panoul de proprietăți, fila Audio, glisorul Volum, de la 0 (fără sunet) la 200 %; clipurile noi
          pornesc de la 100 %;
     - D  Space = redare / pauză; Delete sau Backspace = șterge ce e ales; Ctrl+Z = anulează; Ctrl+Y = reface („Redo:
          CTRL + Y”); butoanele de mărire la colțul liniei de timp; un clic pe rigla cu secunde mută capul de redare (lecția 11);
     - D  golul: butonul lui apare când ții mouse-ul pe gol („Hover your cursor over a gap…”); în pagină stă la vedere
          (pe telefon nu există „ține mouse-ul”) — lecția o spune în text.
   PRESUPUS (nedocumentat, nefotografiat; lecția nu cere elevului niciunul dintre aceste lucruri ca fapt):
     - P  durata implicită a tranziției (aici 1,0 s) și intervalul glisorului (aici 0,1 … 3,0 s); tranziția e centrată pe
          tăietură și NU schimbă lungimea filmului; previzualizarea celorlalte tranziții (aproximată);
     - P  „+” pune imaginea la capătul pistei video și muzica la 0:00 pe pista audio; o imagine lăsată peste alt clip se
          strecoară la cea mai apropiată tăietură și le împinge pe cele de după ea; o imagine lungită le împinge pe cele de după;
          o tranziție dispare dacă cele două clipuri nu mai sunt alăturate; ștergerea unui clip lasă gol;
     - P  numele proiectului nou („Videoclip fără titlu”), numele butoanelor Mărește / Micșorează / Potrivește, eticheta
          „Ștergeți” din bara liniei de timp, etichetele pistelor (Text, Video, Audio — ale simulatorului);
     - P  capătul filmului: redarea se oprește, capul rămâne la capăt, iar ▶ de acolo pornește de la 0:00 (ca în lecția 11);
     - P  muzica mai lungă decât ultima scenă: după scenă, ecran negru cu muzică (lecția îl spune ca „în pagină”, nu ca fapt);
     - P  butonul + dintre două clipuri stă la vedere (în Clipchamp poate apărea abia când ții mouse-ul acolo);
     - P  numele ÎNTREGI ale tranzițiilor „Încețoșare încrucișată” și „Estompare până la negru” (în captură sunt tăiate:
          „Încețoșare încr…”, „Estompare pân…”); „Ardere” și „Dale” sunt întregi în captură; opțiunea „Fără” (ajutorul: „fără” / None);
     - P  „lipirea” (magnet) la marginile clipurilor, la 0:00 și la capul de redare, sub 14 px; scara liniei de timp
          (Potrivește = tot filmul, rotunjit în sus la 5 s, cel puțin 20 s); panoul de proprietăți sub linia de timp când
          simulatorul e mai îngust de 900 px (în Clipchamp e în dreapta); la 900 px și peste, coloana lui din dreapta e mereu
          rezervată (goală, cu o notă, când nu e nimic ales).
   PROBE: lectii/vii/m2-l14/_proba/sim_proba.py (API-ul + punctele de extindere, 1280 și 390 px: 32 de cazuri),
          _proba/proba_gesturi.py (lecția întreagă, gesturi reale cu mouse-ul și cu degetul). Ultima linie a fiecăreia: 0.
   ABATERI SPUSE PE ECRAN: bara din stânga are în Clipchamp mai multe file (aici doar cele două din lecție); pe telefon,
     în fereastra Deschidere, fiecare atingere adaugă sau scoate un fișier (în loc de Ctrl + clic); butonul ✂ și tasta S
     (tăierea în două) nu taie aici; „Exportați” nu exportă aici; peste 100 % sunetul din pagină nu crește; panoul de
     proprietăți stă SUB LINIA DE TIMP când simulatorul e mai îngust de 900 px (în pagina lecției: mereu) și scrie
     deasupra lui „În Clipchamp, panoul acesta stă în dreapta, lângă previzualizare.” (CSS, ::before, pentru orice panou).
   Clipchamp NU a fost pornit (aplicație din Magazin + cont; regula zilei 12.10.2026).

   SCHIMBAT LA REPARAȚIA DIN 12.10.2026 (după judecata 1 a lecției VII/14; versiunea 1.1; totul compatibil înapoi — API-ul,
   numele verificărilor, acțiunile din simuleaza și forma lui start NU s-au schimbat):
     1. FOCUSUL rămâne în simulator: după un clic (mouse / deget) pe orice buton al lui și după orice redesenare care i-a
        scos elementul cu focus (+ dintre scene, semnul tranziției, „Fără”, ▶, |◀, ↶, fișierele din Deschidere…), focusul
        revine pe rădăcină (root.focus({preventScroll:true}); pagina nu sare). Excepții: caseta numelui proiectului,
        glisoarele și caseta cu număr (le lasă cu focus, cum le-a lăsat elevul).
     2. TASTELE editorului merg și când focusul e pe un buton al simulatorului sau pe glisoarele / opțiunile panoului:
        Space = redare / pauză (fără să mai apese butonul și fără să deruleze pagina; ținută apăsată nu se repetă),
        Ctrl+Z = anulare, Ctrl+Y = refacere (NOU, D: „Redo: CTRL + Y”; Ctrl+Shift+Z rămâne și el), Delete / Backspace =
        șterge ce e ales. Caseta numelui și caseta cu număr își păstrează tastele lor (scrii în ele).
     3. Pe telefon, degetul pe linia de timp (nu pe un clip, nu pe riglă) derulează și pagina în sus / în jos
        (.vc-sc: touch-action pan-x pan-y; clipurile, mânerele și rigla au în continuare touch-action:none).
     4. Abaterea panoului de proprietăți e spusă pe ecran (vezi ABATERI).
     Proba: lectii/vii/m2-l14/_proba/proba_reparatii.py (gesturi reale, FĂRĂ v.focus() de probă) + sim_proba.py.

   SCHIMBAT LA REPARAȚIA DIN 12.10.2026, JUDECATA 3 (versiunea 1.2; compatibil înapoi — API-ul public, numele verificărilor,
   acțiunile din simuleaza, forma lui start și evenimentele NU s-au schimbat; jurnalul primește un tip NOU, 'clicIgnorat'):
     1. (R1) Panoul de proprietăți NU mai stă deasupra liniei de timp. Pe telefon, atingerea care alegea o scenă îl băga
        deasupra liniei și o împingea în jos ~146 px, iar clicul acelei atingeri cădea pe 🗑 Ștergeți (scena dispărea) sau
        pe + Mărește. Acum: simulator mai îngust de 900 px → .vc-prop e copil direct al rădăcinii, DUPĂ .vc-linie (sub linia
        de timp); 900 px și peste (.lat) → a patra coloană a grilei e mereu rezervată (.vc-prop.gol cu o notă când nu e
        nimic ales). Nimic de deasupra liniei de timp și nimic de pe ea nu se mută când alegi sau renunți la o alegere.
        Pentru lecția 15: caută panoul cu root.querySelector('.vc-prop') (nu '.vc-mij .vc-prop'); laProprietati e neschimbat.
     2. (R1) PAZA ATINGERII: clicul unei atingeri contează doar dacă ajunge pe ACELAȘI lucru pe care a coborât degetul
        (același data-clip / data-a / data-trx… și după redesenare); altfel se ignoră și intră în jurnal
        {tip:'clicIgnorat', de, pe}. Mouse-ul și tastatura (Enter / Space, e.detail 0) nu trec pe aici.
     3. (R1b) După redesenare, focusul NU mai rămâne pe un buton devenit inactiv (↶ / ↷ / 🗑 apăsate cu Enter după Tab):
        trece pe rădăcina simulatorului, deci Ctrl+Z / Ctrl+Y / Space merg mai departe.
     Proba: lectii/vii/m2-l14/_proba/proba_reparatii_j3.py (atingere reală CDP la 360 / 390 / 412 / 1280, mouse și taste
     reale la 1280; oracol „înainte” = copia 1.1 din _proba/video-clipchamp_inainte_j3.js.txt).

   FOLOSIRE ÎN PAGINĂ (după motor.js):
     <script src="../../_sim/video-clipchamp.js"></script>
     JocMotor.porneste({ …, tipuri:{videoclipchamp:TipVideoClipchamp} })
     Exercițiu: {t:'videoclipchamp', q, catalog, start, teste:[{ce, <verificare>:parametru, cum?}], solutie:[acțiuni],
                 gresit:[acțiuni], why, ajutor?, sunet?}
       catalog: {'nume.jpg':{tip:'imagine', src:'img/x.webp', titlu:'pădurea'}, 'muzica.wav':{tip:'audio', durata:24,
                 fis:'../m2-l13/muzica-fundal.wav', unda:[…50 de vârfuri pe secundă…]}, …}
       start:   {ecran:'acasa'|'editor', nume?, media:['nume',…], descarcari:['nume',…], fila?:'media'|'tranzitii',
                 video:[['nume', durata?], …] (lipite de la 0:00) sau [{m, start, durata}], audio:[{m, start, durata?, de?, vol?}],
                 tranz:[{intre:['numeA','numeB'], nume?, durata?}], text:[{text, start, durata}]}

   API PUBLIC (pentru lecția 15 și pentru probe):
     const v = VideoClipchamp.creeaza(element, {catalog, start, sunet?})
     v.stare()     → {ecran, fila, nume, p, reda, durata, sfarsitVideo, ales:{tip,id}|null, zoom}
     v.proiect()   → {video:[{id,m,start,durata}], audio:[{id,m,start,durata,de,vol}], text:[{id,text,start,durata}],
                      tranz:[{id,st,dr,nume,durata}], media:[{nume,tip}]}   (copie; schimbările doar prin v.schimba)
     v.jurnal()    → [{tip:'nou'|'import'|'adauga'|'muta'|'durata'|'gol'|'tranzitie'|'tranzitieDurata'|'tranzitieScoasa'|
                       'sterge'|'volum'|'scurtat'|'redare'|'pauza'|'capat'|'rigla'|'inceput'|'inapoi5'|'inainte5'|'anuleaza'|
                       'reface'|'nume'|'fila'|'ales'|'mesaj'|…, t, …}]
     v.vazut()     → intervalele redate [[de_la, până_la], …]
     v.simuleaza([acțiuni]) pe loc, cu ceas virtual: {nou:1} {fila:'media'|'tranzitii'} {importa:['a.jpg',…]} {adauga:'a.jpg'}
                   {trage:['a.jpg', secunda]} {muta:['a.jpg', secunda]} {durata:['a.jpg', sec]} {gol:'a.jpg'} (închide golul
                   de dinaintea clipului) {tranzitie:['Estompare încrucișată','A.jpg']} (între A și clipul de după el)
                   {plus:'A.jpg'} (butonul de tranziție de după A) {durataTranzitie:['A.jpg', sec]} {farTranzitie:'A.jpg'}
                   {sterge:'a.jpg'} {capat:['m.wav', secunda]} {inceputAudio:['m.wav', secunda]} {volum:['m.wav', procent]}
                   {alege:'a.jpg'} {rigla:t} {reda:1} {pauza:1} {asteapta:sec} {inceput:1} {inapoi5:1} {inainte5:1}
                   {tasta:'Space'|'Delete'|'z'} {nume:'text'} {anuleaza:1} {reface:1}
     v.avans(sec)  v.reset()  v.redesenare()  v.focus()  v.mesaj(html)  v.on(fn) / v.off(fn): fn(stare, ev) la fiecare
                   schimbare (și evenimentul DOM 'videoclipchamp' pe v.radacina)
     v.schimba(fn) schimbă proiectul cu anulare: fn(P) primește proiectul viu {video, audio, text, tranz, media}; după el
                   pistele se redesenează și pleacă evenimentul. Pentru lecția 15: clipuri text noi în P.text.
     v.adaugaFila({id, eticheta, simbol, deschide(panouEl, v)})   o filă nouă în bara din stânga (de ex. „Text”)
     v.laPrevizualizare(fn(stratEl, t, v))   desenezi peste previzualizare (fn e chemat la fiecare cadru)
     v.laProprietati(tip, fn(panouEl, element, v))   panoul de proprietăți pentru un fel nou de clip ales (de ex. 'text')
     v.alege({tip, id}|null)   v.cadru(t) → {scena, a, b, k, trecere, negru, text:[…]} (ce arată previzualizarea la t)
     VideoClipchamp.verificari[nume] = (v, parametru) => bool   (verificările testelor; se pot adăuga altele)
   NU schimba comportamentul de mai sus și nici numele verificărilor: lecția 14 se sprijină pe ele. */
(function(){
'use strict';
const VERS='1.2 (12.10.2026, reparația J3)';
const DUR_IMAGINE=4;                 // D: „the default duration is set to four seconds”
const TR_IMPLICIT=1.0,TR_MIN=0.1,TR_MAX=3.0;   // P (nedocumentat)
const VOL_MAX=200;                   // D: „down to mute or up to 200%”
const NUME_NOU='Videoclip fără titlu';   // P (EN: „untitled”)
const TRANZITII=[                    // C: grupul „Estompări și încețoșări” (primul nume e întreg în SURSE.json al jocului)
  {nume:'Estompare încrucișată',en:'Cross fade',fel:'cross'},
  {nume:'Încețoșare încrucișată',en:'Cross blur',fel:'blur'},
  {nume:'Ardere',en:'Burn',fel:'burn'},
  {nume:'Estompare până la negru',en:'Fade through black',fel:'negru'},
  {nume:'Dale',en:'Tiles',fel:'dale'}];
const TOL=0.02;

const CSS=`
.vc{--vc-bg:#f4f4f7;--vc-ink:#1d1f2a;--vc-ink2:#5d6173;--vc-line:#d7d8e0;--vc-acc:#7b3fe4;--vc-acc2:#efe7ff;--vc-pane:#fff;--vc-tl:#fafafc;
  background:var(--vc-bg);color:var(--vc-ink);border:1px solid var(--vc-line);border-radius:8px;font:14px/1.3 "Segoe UI",system-ui,sans-serif;max-width:100%;overflow:hidden;position:relative;outline:none;user-select:none;-webkit-user-select:none}
.vc:focus-visible{box-shadow:0 0 0 3px #7aa7ff}
.vc button{font:inherit;color:inherit}
.vc-b{min-height:36px;min-width:36px;border:1px solid var(--vc-line);background:#fff;border-radius:8px;padding:4px 10px;cursor:pointer}
.vc-b:hover{background:#f0f0f5}.vc-b[disabled]{opacity:.4;cursor:default}
.vc-b.mov{background:var(--vc-acc);border-color:var(--vc-acc);color:#fff;font-weight:600}
.vc-acasa{padding:18px 16px 22px;background:#fff;min-height:220px}
.vc-acasa h3{margin:0 0 4px;font:600 1.15rem/1.2 "Segoe UI",system-ui,sans-serif}
.vc-acasa p{margin:4px 0 14px;color:var(--vc-ink2);font-size:.9rem}
.vc-sus{display:flex;align-items:center;gap:6px;padding:6px 8px;background:#fff;border-bottom:1px solid var(--vc-line);flex-wrap:wrap}
.vc-nume{border:1px solid transparent;background:transparent;border-radius:6px;padding:4px 8px;min-height:36px;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:text;font-weight:600}
.vc-nume:hover{border-color:var(--vc-line)}
.vc-nume-in{font:inherit;font-weight:600;border:1px solid var(--vc-acc);border-radius:6px;padding:4px 8px;min-height:36px;width:220px;max-width:60vw;box-sizing:border-box}
.vc-sp{flex:1 1 auto}
.vc-mij{display:grid;grid-template-columns:72px 176px minmax(0,1fr);background:var(--vc-bg)}
.vc.lat .vc-mij,.vc.lat .vc-mij.cuprop{grid-template-columns:72px 176px minmax(0,1fr) 190px}
.vc-rail{display:flex;flex-direction:column;gap:4px;padding:6px 4px;background:#fff;border-right:1px solid var(--vc-line)}
.vc-fila{display:flex;flex-direction:column;align-items:center;gap:2px;border:0;background:transparent;border-radius:8px;padding:6px 2px;min-height:48px;cursor:pointer;font-size:.68rem;line-height:1.1;text-align:center;color:var(--vc-ink2)}
.vc-fila .ic{font-size:18px;line-height:20px;font-family:"Segoe UI Symbol","Segoe UI",system-ui,sans-serif}
.vc-fila.on{background:var(--vc-acc2);color:var(--vc-acc);font-weight:600}
.vc-panou{background:#fff;border-right:1px solid var(--vc-line);padding:8px;min-width:0}
.vc-panou h4{margin:0 0 6px;font:600 .9rem/1.2 "Segoe UI",system-ui,sans-serif}
.vc-imp{display:block;width:100%;border:0;border-radius:8px;background:var(--vc-acc);color:#fff;font-weight:600;padding:8px 6px;min-height:40px;cursor:pointer;line-height:1.15}
.vc-gol-media{border:1px dashed var(--vc-line);border-radius:8px;margin-top:8px;padding:10px 6px;text-align:center;font-size:.74rem;color:var(--vc-ink2)}
.vc-lib{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}
.vc-item{position:relative;border:2px solid transparent;border-radius:8px;background:#f2f2f6;padding:3px;cursor:grab;touch-action:none;min-height:40px}
.vc-item.ales{border-color:var(--vc-acc)}
.vc-item .mini{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:5px;background:#2a2d3a;pointer-events:none}
.vc-item .mini.aud{display:flex;align-items:center;justify-content:center;color:#0b5d4f;background:#cdeee6;font-size:20px}
.vc-item .et{display:block;font-size:.66rem;line-height:1.15;margin-top:2px;word-break:break-all;color:var(--vc-ink2)}
.vc-plus{position:absolute;top:2px;right:2px;width:32px;height:32px;border-radius:50%;border:0;background:#16a34a;color:#fff;font-weight:700;font-size:18px;line-height:32px;cursor:pointer;padding:0}
.vc-tr-lista{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.vc-tr{border:2px solid transparent;border-radius:8px;background:#f2f2f6;padding:3px;cursor:grab;touch-action:none;min-height:40px}
.vc-tr .mini{display:block;aspect-ratio:16/9;border-radius:5px;pointer-events:none}
.vc-tr .et{display:block;font-size:.66rem;line-height:1.15;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--vc-ink2)}
.vc-indr{border:1px solid #e3d6ff;background:#faf7ff;border-radius:8px;padding:8px;font-size:.78rem;margin:0 0 8px}
.vc-gr{font-size:.74rem;font-weight:600;margin:6px 0 4px}
.vc-scena{padding:8px;min-width:0;display:flex;flex-direction:column;gap:6px}
.vc-ecran{position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:6px;overflow:hidden}
.vc-ecran img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0}
.vc-ecran .neg{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none}
.vc-ecran .strat{position:absolute;inset:0;pointer-events:none}
.vc-ecran .txt{position:absolute;left:6%;right:6%;top:40%;text-align:center;color:#fff;font-weight:700;font-size:clamp(14px,4vw,28px);text-shadow:0 1px 3px #000}
.vc-ctrl{display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap}
.vc-cb{min-width:40px;min-height:40px;border:0;background:transparent;border-radius:50%;cursor:pointer;font-family:"Segoe UI Symbol","Segoe UI",system-ui,sans-serif;font-size:15px}
.vc-cb:hover{background:#e7e7ee}
.vc-cb.play{background:#1d1f2a;color:#fff;font-size:16px}
.vc-ceas{font:600 13px/1 Consolas,"Fira Mono",monospace;padding:0 4px;white-space:nowrap}
.vc-ceas b{color:var(--vc-ink)}.vc-ceas span{color:var(--vc-ink2)}
.vc-acum{font-size:.8rem;background:#fff;border:1px solid var(--vc-line);border-radius:6px;padding:5px 8px;min-height:2.4em}
.vc-acum b{font-weight:600}
.vc-sunet{align-self:flex-start;font-size:.78rem}
.vc-prop{background:#fff;border-top:1px solid var(--vc-line);padding:8px;min-width:0;grid-column:1/-1}
.vc.lat .vc-prop{grid-column:auto;border-top:0;border-left:1px solid var(--vc-line)}
.vc:not(.lat) .vc-prop::before{content:"În Clipchamp, panoul acesta stă în dreapta, lângă previzualizare.";display:block;font-size:.74rem;color:var(--vc-ink2);margin:0 0 4px}
.vc-prop.gol p{margin:0;font-size:.78rem;color:var(--vc-ink2)}
.vc-prop [role=radiogroup]{display:flex;flex-wrap:wrap;gap:0 12px}
.vc-prop h4{margin:0 0 6px;font:600 .88rem/1.2 "Segoe UI",system-ui,sans-serif}
.vc-prop label{display:block;font-size:.8rem;margin:8px 0 2px}
.vc-prop input[type=range]{width:100%;min-height:32px;accent-color:var(--vc-acc)}
.vc-prop .rand{display:flex;align-items:center;gap:6px}
.vc-prop input[type=number]{width:64px;min-height:32px;font:inherit;border:1px solid var(--vc-line);border-radius:6px;padding:2px 4px}
.vc-opt{display:flex;align-items:center;gap:6px;min-height:32px;font-size:.8rem;cursor:pointer;border-radius:6px;padding:2px 4px}
.vc-opt input{width:18px;height:18px;accent-color:var(--vc-acc)}
.vc-linie{background:var(--vc-tl);border-top:1px solid var(--vc-line)}
.vc-lunelte{display:flex;align-items:center;gap:4px;padding:4px 6px;flex-wrap:wrap}
.vc-lunelte .vc-b{min-height:34px;padding:2px 8px;font-size:.8rem}
.vc-zoom{display:flex;gap:4px;margin-left:auto}
.vc-sc{position:relative;overflow-x:auto;overflow-y:hidden;touch-action:pan-x pan-y;padding:0 0 4px}
.vc-in{position:relative;min-width:100%}
.vc-rigla{position:relative;height:34px;cursor:pointer;border-bottom:1px solid var(--vc-line);touch-action:none;background:#fff}
.vc-rigla .tk{position:absolute;bottom:0;width:1px;height:7px;background:#b9bccb}
.vc-rigla .tk.mare{height:12px;background:#8c90a3}
.vc-rigla .lb{position:absolute;top:3px;font:11px/1 Consolas,"Fira Mono",monospace;color:var(--vc-ink2);transform:translateX(-50%);white-space:nowrap}
.vc-pista{position:relative;border-bottom:1px dashed #e2e3ea}
.vc-pista.v{height:74px}.vc-pista.a{height:46px}.vc-pista.t{height:46px}
.vc-pista .eti{position:absolute;left:2px;top:2px;font-size:.6rem;color:#9a9db0;pointer-events:none;z-index:1}
.vc-pista.tinta{background:#efe7ff}
.vc-clip{position:absolute;top:5px;bottom:5px;border-radius:7px;overflow:hidden;cursor:grab;touch-action:none;box-sizing:border-box;border:2px solid rgba(0,0,0,.08)}
.vc-pista.a .vc-clip{background:#bfe9de}
.vc-pista.t .vc-clip{background:#f3c9f0;font-size:.7rem;padding:2px 6px;white-space:nowrap;text-overflow:ellipsis}
.vc-pista.v .vc-clip,.vc-pista.v .vc-gol{top:26px;bottom:4px}
.vc-clip.img{background:#2a2d3a;background-size:auto 100%;background-repeat:repeat-x}
.vc-clip .nm{position:absolute;left:4px;bottom:2px;right:4px;font-size:.62rem;color:#fff;text-shadow:0 1px 2px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}
.vc-pista.a .vc-clip .nm{color:#0b4d40;text-shadow:none}
.vc-clip svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.vc-clip.ales{border:3px solid var(--vc-acc);box-shadow:0 0 0 2px #fff inset}
.vc-man{position:absolute;top:0;bottom:0;width:32px;touch-action:none;cursor:ew-resize;z-index:3;display:flex;align-items:center}
.vc-man.st{left:-2px;justify-content:flex-start}.vc-man.dr{right:-2px;justify-content:flex-end}
.vc-man i{display:block;width:10px;height:60%;background:var(--vc-acc);border-radius:3px;box-shadow:0 0 0 2px #fff}
.vc-gol{position:absolute;top:5px;bottom:5px;background:repeating-linear-gradient(135deg,#eceef3 0 6px,#f8f8fb 6px 12px);border-radius:6px;display:flex;align-items:center;justify-content:center}
.vc-golb{width:32px;height:32px;border-radius:50%;border:1px solid var(--vc-line);background:#fff;cursor:pointer;padding:0;font-size:15px}
.vc-imb{position:absolute;top:0;width:32px;height:32px;margin-left:-16px;z-index:4;border-radius:8px;border:2px solid #fff;padding:0;cursor:pointer;touch-action:none;box-shadow:0 1px 3px rgba(0,0,0,.35);font-size:14px;line-height:28px}
.vc-imb.adauga{background:#fff;color:var(--vc-acc);font-weight:700;border-color:var(--vc-acc);line-height:28px;font-size:17px}
.vc-imb.tr{background:var(--vc-acc);color:#fff}
.vc-imb.tr.ales{box-shadow:0 0 0 3px #ffd54a}
.vc-imb.tinta{outline:3px solid #16a34a;outline-offset:2px;background:#dcfce7;color:#14532d}
.vc-cap{position:absolute;top:0;bottom:0;width:2px;background:#1d1f2a;pointer-events:none;z-index:5;margin-left:-1px}
.vc-cap::before{content:"";position:absolute;top:0;left:-6px;width:14px;height:14px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#1d1f2a}
.vc-gol-linie{position:absolute;left:44px;right:8px;top:12px;font-size:.78rem;color:var(--vc-ink2);pointer-events:none}
.vc-msg{margin:6px 8px;font-size:.84rem;background:#fff7d6;border:1px solid #f1d27a;border-radius:6px;padding:6px 8px;display:none}
.vc-msg.on{display:block}
.vc-fantoma{position:fixed;z-index:9999;pointer-events:none;opacity:.85;border-radius:8px;background:#fff;border:2px solid var(--vc-acc);padding:4px 8px;font-size:.8rem;box-shadow:0 4px 12px rgba(0,0,0,.25);transform:translate(-50%,-120%)}
.vc-dlg{position:absolute;inset:0;background:rgba(20,20,30,.35);display:flex;align-items:center;justify-content:center;z-index:20;padding:8px}
.vc-dlg .w{background:#fff;border-radius:8px;width:min(560px,100%);box-shadow:0 10px 30px rgba(0,0,0,.35);display:flex;flex-direction:column;max-height:100%}
.vc-dlg .tt{padding:8px 10px;border-bottom:1px solid var(--vc-line);font-size:.85rem;display:flex;justify-content:space-between;align-items:center}
.vc-dlg .cp{display:grid;grid-template-columns:120px minmax(0,1fr);min-height:150px}
.vc-dlg .nav{border-right:1px solid var(--vc-line);padding:6px;font-size:.8rem}
.vc-dlg .nav div{padding:6px;border-radius:5px;color:var(--vc-ink2)}
.vc-dlg .nav div.on{background:#e5f1fb;color:var(--vc-ink);font-weight:600}
.vc-dlg .fis{padding:4px;overflow:auto;max-height:240px}
.vc-dlg .f{display:flex;align-items:center;gap:6px;padding:6px;min-height:32px;border-radius:4px;cursor:default;font-size:.84rem;border:1px solid transparent;width:100%;background:transparent;text-align:left}
.vc-dlg .f.on{background:#cce8ff;border-color:#99d1ff}
.vc-dlg .f .ic{width:20px;text-align:center}
.vc-dlg .jos{border-top:1px solid var(--vc-line);padding:8px 10px;display:flex;flex-direction:column;gap:6px}
.vc-dlg .nf{display:flex;gap:6px;align-items:center;font-size:.8rem}
.vc-dlg .nf span{flex:1;border:1px solid var(--vc-line);border-radius:4px;padding:4px 6px;min-height:26px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;background:#fff}
.vc-dlg .bt{display:flex;gap:6px;justify-content:flex-end}
.vc-dlg .tel{font-size:.74rem;color:#7a4b00;background:#fff7d6;border-radius:4px;padding:4px 6px}
.vc.ingust .vc-mij,.vc.ingust .vc-mij.cuprop{grid-template-columns:minmax(0,1fr)}
.vc.ingust .vc-rail{flex-direction:row;border-right:0;border-bottom:1px solid var(--vc-line)}
.vc.ingust .vc-fila{flex:1;flex-direction:row;justify-content:center;gap:6px;font-size:.78rem;min-height:40px}
.vc.ingust .vc-panou{border-right:0;border-bottom:1px solid var(--vc-line)}
.vc.ingust .vc-lib,.vc.ingust .vc-tr-lista{grid-template-columns:repeat(3,minmax(0,1fr))}
.vc.ingust .vc-prop{border-left:0;border-top:1px solid var(--vc-line)}
.vc.ingust .vc-dlg .cp{grid-template-columns:minmax(0,1fr)}
.vc.ingust .vc-dlg .nav{display:none}
`;
function stil(){if(document.getElementById('sim-video-clipchamp-css'))return;const s=document.createElement('style');s.id='sim-video-clipchamp-css';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const doi=n=>String(n).padStart(2,'0');
function fmt(t){t=Math.max(0,t);const cs=Math.round(t*100),m=Math.floor(cs/6000),s=Math.floor(cs/100)%60,c=cs%100;return `${m}:${doi(s)}.${doi(c)}`}
function fmtS(x){return (Math.round(x*10)/10).toFixed(1).replace('.',',')+' s'}
const r1=x=>Math.round(x*10)/10;
const cl=(x,a,b)=>Math.max(a,Math.min(b,x));
const copie=o=>JSON.parse(JSON.stringify(o));

/* ---------------- creeaza ---------------- */
function creeaza(el,O){
  stil();O=O||{};
  const CAT=O.catalog||{};
  const st0=O.start||{};
  let nrId=0;const nid=p=>p+(++nrId);
  let S,P,J,VAZ,istoric,viitor,asc=[],extFile=[],extPrev=[],extProp={},ultimaRedare=null;
  const root=document.createElement('div');root.className='vc';root.tabIndex=0;el.appendChild(root);
  const audioEl={};   // sunetul adevărat (opțional)

  function init(){
    nrId=0;
    S={ecran:st0.ecran||'editor',fila:st0.fila||'media',nume:st0.nume||NUME_NOU,p:0,reda:false,ales:null,zoom:0,dialog:null,
       descarcari:(st0.descarcari||Object.keys(CAT)).slice(),sunet:false,mesaj:'',ver:0};
    P={media:[],video:[],audio:[],text:[],tranz:[]};
    (st0.media||[]).forEach(n=>P.media.push({nume:n,tip:(CAT[n]||{}).tip||'imagine'}));
    let t=0;
    (st0.video||[]).forEach(x=>{const o=Array.isArray(x)?{m:x[0],durata:x[1]}:x;const c={id:nid('v'),m:o.m,start:o.start!=null?o.start:t,durata:o.durata||DUR_IMAGINE};P.video.push(c);t=c.start+c.durata});
    (st0.audio||[]).forEach(o=>{const L=(CAT[o.m]||{}).durata||10;P.audio.push({id:nid('a'),m:o.m,start:o.start||0,de:o.de||0,durata:o.durata||L-(o.de||0),vol:o.vol==null?100:o.vol})});
    (st0.text||[]).forEach(o=>P.text.push({id:nid('t'),text:o.text,start:o.start,durata:o.durata}));
    (st0.tranz||[]).forEach(o=>{const a=clipM(o.intre[0]),b=clipM(o.intre[1]);if(a&&b)P.tranz.push({id:nid('x'),st:a.id,dr:b.id,nume:o.nume||TRANZITII[0].nume,durata:o.durata||TR_IMPLICIT})});
    [...new Set(P.video.map(c=>c.m).concat(P.audio.map(c=>c.m)))].forEach(n=>{if(!P.media.some(m=>m.nume===n))P.media.push({nume:n,tip:(CAT[n]||{}).tip||'imagine'})});
    J=[];VAZ=[];istoric=[];viitor=[];ultimaRedare=null;
  }
  /* ---- model ---- */
  const clipM=n=>P.video.find(c=>c.m===n)||P.audio.find(c=>c.m===n)||P.text.find(c=>c.id===n)||P.video.find(c=>c.id===n)||P.audio.find(c=>c.id===n);
  const vSort=()=>P.video.slice().sort((a,b)=>a.start-b.start);
  const capV=()=>P.video.reduce((m,c)=>Math.max(m,c.start+c.durata),0);
  function durata(){let d=capV();P.audio.forEach(c=>d=Math.max(d,c.start+c.durata));P.text.forEach(c=>d=Math.max(d,c.start+c.durata));return d}
  const alaturate=(a,b)=>Math.abs(a.start+a.durata-b.start)<=TOL;
  /* P: „lipirea” (magnet) la marginile clipurilor, la 0:00 și la capul de redare, la mai puțin de 14 px pe ecran */
  const tolSnap=()=>Math.max(0.12,14/(root._k||20));
  function snap(t,faraId){const pct=[0,S.p];[P.video,P.audio,P.text].forEach(L=>L.forEach(c=>{if(c.id!==faraId){pct.push(c.start,c.start+c.durata)}}));
    let best=t,bd=tolSnap();pct.forEach(x=>{const d=Math.abs(x-t);if(d<bd){bd=d;best=x}});return Math.round(best*1000)/1000}
  function curataTranz(){const V=vSort();P.tranz=P.tranz.filter(x=>{const a=P.video.find(c=>c.id===x.st),b=P.video.find(c=>c.id===x.dr);if(!a||!b)return false;const i=V.indexOf(a);return V[i+1]===b&&alaturate(a,b)})}
  function salveaza(){istoric.push(JSON.stringify({P,nume:S.nume}));if(istoric.length>60)istoric.shift();viitor=[]}
  const SCHIMBARI=['nou','adauga','muta','durata','gol','tranzitie','tranzitieDurata','tranzitieScoasa','sterge','volum','scurtat','anuleaza','reface','schimbare','durataText'];
  function emit(ev){ev=Object.assign({t:r1(S.p)},ev);if(SCHIMBARI.includes(ev.tip)){S.ver++;if(S.reda&&ultimaRedare){ultimaRedare=[S.p,S.p,S.ver];VAZ.push(ultimaRedare)}}J.push(ev);asc.forEach(f=>{try{f(stare(),ev)}catch(e){console.error(e)}});root.dispatchEvent(new CustomEvent('videoclipchamp',{detail:{stare:stare(),ev}}))}
  function stare(){return {ecran:S.ecran,fila:S.fila,nume:S.nume,p:S.p,reda:S.reda,durata:durata(),sfarsitVideo:capV(),ales:S.ales?Object.assign({},S.ales):null,zoom:S.zoom}}
  function mesaj(h){S.mesaj=h||'';const m=root.querySelector('.vc-msg');if(m){m.innerHTML=S.mesaj;m.classList.toggle('on',!!S.mesaj)}if(h)J.push({tip:'mesaj',t:r1(S.p)})}

  /* ---- operații pe pista video ---- */
  function insereazaVideo(c,t){   // c: {id,m,durata}; t: unde a fost lăsat (început)
    const V=vSort();const cap=capV();
    if(!V.length){c.start=0;P.video.push(c);return}   // P: primul clip pe linia goală începe la 0:00
    if(t>=cap-c.durata/2){c.start=(t-cap<Math.max(0.6,24/(root._k||20)))?cap:r1(t);P.video.push(c);return}   // după capăt: lipit (sau cu gol, dacă e departe)
    // peste clipuri: la cea mai apropiată tăietură, iar cele de după se împing (P)
    const mid=t+c.durata/2;let i=V.findIndex(x=>mid<x.start+x.durata/2);if(i<0)i=V.length;
    const j=i===0?Math.min(V[0].start,Math.max(0,t)):V[i-1].start+V[i-1].durata;
    c.start=r1(j);
    V.slice(i).forEach(x=>{if(x.start<c.start+c.durata-TOL)x.start=r1(x.start+c.durata)});
    // împingerea poate crea suprapuneri în lanț: le rezolvăm în ordine
    const W=V.slice(i);let fin=c.start+c.durata;W.forEach(x=>{if(x.start<fin-TOL)x.start=r1(fin);fin=x.start+x.durata});
    P.video.push(c);
  }
  function adaugaMedia(n,t,cum){
    const M=CAT[n]||{};
    if(M.tip==='audio'){
      const L=M.durata||10;let s=t==null?0:snap(r1(Math.max(0,t)));if(s<Math.max(0.6,24/(root._k||20)))s=0;
      // pe pista audio, fără suprapunere: după clipul audio de dinainte
      const A=P.audio.slice().sort((a,b)=>a.start-b.start);A.forEach(a=>{if(s<a.start+a.durata-TOL&&s+L>a.start+TOL)s=r1(a.start+a.durata)});
      const c={id:nid('a'),m:n,start:s,de:0,durata:L,vol:100};P.audio.push(c);emit({tip:'adauga',m:n,pista:'audio',start:s,cum});return c}
    const c={id:nid('v'),m:n,durata:DUR_IMAGINE};
    insereazaVideo(c,t==null?capV():t);curataTranz();emit({tip:'adauga',m:n,pista:'video',start:c.start,cum});return c
  }
  function mutaVideo(c,t){const vechi=c.start;P.video=P.video.filter(x=>x!==c);insereazaVideo(c,Math.max(0,t));curataTranz();emit({tip:'muta',m:c.m,de:vechi,la:c.start})}
  function durataVideo(c,d){
    d=r1(Math.max(0.5,d));const delta=d-c.durata;const V=vSort();const i=V.indexOf(c);
    c.durata=d;
    if(delta>0){let fin=c.start+c.durata;V.slice(i+1).forEach(x=>{if(x.start<fin-TOL)x.start=r1(fin);fin=x.start+x.durata})}   // P: le împinge
    curataTranz();emit({tip:'durata',m:c.m,durata:d})
  }
  function stergeGol(c){   // închide golul dinaintea lui c (D: clipurile de după se trag spre stânga)
    const V=vSort();const i=V.indexOf(c);const pr=i>0?V[i-1].start+V[i-1].durata:0;const g=r1(c.start-pr);if(g<=TOL)return;
    V.slice(i).forEach(x=>x.start=r1(x.start-g));emit({tip:'gol',m:c.m,gol:g})
  }
  function stergeClip(tip,id){
    if(tip==='tranz'){const x=P.tranz.find(x=>x.id===id);if(!x)return;P.tranz=P.tranz.filter(y=>y!==x);emit({tip:'tranzitieScoasa'});return}
    const L=tip==='audio'?P.audio:tip==='text'?P.text:P.video;const c=L.find(x=>x.id===id);if(!c)return;
    if(tip==='audio')P.audio=P.audio.filter(x=>x!==c);else if(tip==='text')P.text=P.text.filter(x=>x!==c);else P.video=P.video.filter(x=>x!==c);
    curataTranz();emit({tip:'sterge',m:c.m||c.text,pista:tip})
  }
  function puneTranz(nume,a){   // între a și clipul de după el
    const V=vSort();const i=V.indexOf(a);const b=V[i+1];
    if(!b||!alaturate(a,b)){mesaj('Tranziția se pune între două clipuri <b>alăturate, fără gol</b>. Închide întâi golul.');return false}
    const x=P.tranz.find(x=>x.st===a.id&&x.dr===b.id);
    if(x){x.nume=nume}else P.tranz.push({id:nid('x'),st:a.id,dr:b.id,nume,durata:TR_IMPLICIT});
    const y=P.tranz.find(x=>x.st===a.id&&x.dr===b.id);S.ales={tip:'tranz',id:y.id};
    emit({tip:'tranzitie',nume,intre:[a.m,b.m],durata:y.durata});return true
  }
  /* ---- capul de redare ---- */
  let raf=0,tPrev=0;
  function deschideInterval(){ultimaRedare=[S.p,S.p,S.ver];VAZ.push(ultimaRedare)}
  function avans(dt){
    if(!S.reda)return;const D=durata();let np=S.p+dt;
    if(np>=D){np=D;S.p=np;if(ultimaRedare)ultimaRedare[1]=np;S.reda=false;ultimaRedare=null;opresteSunet();emit({tip:'capat'});return}
    S.p=np;if(ultimaRedare)ultimaRedare[1]=np;sunetLa();
  }
  function bucla(ts){if(!S.reda){raf=0;return}const dt=tPrev?(ts-tPrev)/1000:0;tPrev=ts;avans(Math.min(dt,0.25));deseneazaTimp();raf=requestAnimationFrame(bucla)}
  function reda(){if(S.reda)return;const D=durata();if(D<=0){mesaj('Linia de timp e goală: pune întâi o scenă pe ea.');return}if(S.p>=D-0.01)S.p=0;S.reda=true;deschideInterval();emit({tip:'redare'});tPrev=0;sunetLa(true);if(!raf&&!SIM)raf=requestAnimationFrame(bucla);deseneaza()}
  function pauza(){if(!S.reda)return;S.reda=false;ultimaRedare=null;opresteSunet();emit({tip:'pauza'});deseneaza()}
  function cauta(t,tip){const r=S.reda;if(r){ultimaRedare=null}S.p=cl(r1(t*100)/100,0,Math.max(durata(),0));if(r){deschideInterval();sunetLa(true)}emit({tip:tip||'rigla'});deseneazaTimp()}
  /* ---- sunetul adevărat (opțional) ---- */
  function opresteSunet(){Object.values(audioEl).forEach(a=>{try{a.pause()}catch(e){}})}
  function sunetLa(nou){
    if(!S.sunet||SIM)return;
    P.audio.forEach(c=>{const M=CAT[c.m]||{};if(!M.fis)return;let a=audioEl[c.id];
      const in_=S.p>=c.start&&S.p<c.start+c.durata;
      if(!in_){if(a&&!a.paused)a.pause();return}
      if(!a){a=audioEl[c.id]=new Audio(M.fis);a.preload='auto'}
      a.volume=cl(c.vol/100,0,1);
      const poz=S.p-c.start+c.de;
      if(a.paused||nou){try{a.currentTime=poz}catch(e){}a.play().catch(()=>{})}
    })
  }
  /* ---- ce arată previzualizarea la t ---- */
  function cadru(t){
    const V=vSort();const R={scena:null,a:null,b:null,k:0,trecere:null,negru:false,text:P.text.filter(c=>t>=c.start&&t<c.start+c.durata).map(c=>c.text)};
    for(const x of P.tranz){const a=P.video.find(c=>c.id===x.st),b=P.video.find(c=>c.id===x.dr);if(!a||!b)continue;const j=b.start;
      if(t>=j-x.durata/2&&t<j+x.durata/2){R.a=a.m;R.b=b.m;R.k=cl((t-(j-x.durata/2))/x.durata,0,1);R.trecere=x;return R}}
    const c=V.find(c=>t>=c.start-1e-6&&t<c.start+c.durata);
    if(c){R.scena=c.m;R.a=c.m}else R.negru=true;
    return R
  }
  function ceSeAude(t){const A=P.audio.filter(c=>t>=c.start&&t<c.start+c.durata);if(!A.length)return 'liniște';
    return A.map(c=>`${esc(c.m)} (volum ${c.vol} %${c.vol===0?', fără sunet':c.vol<=60?', încet':c.vol>130?', tare':''})`).join(', ')}
  const titlu=n=>(CAT[n]&&CAT[n].titlu)||n;

  /* ---------------- desenarea ---------------- */
  /* Reparația J1 (12.10.2026): dacă focusul era într-un element al simulatorului pe care redesenarea îl scoate, el revine
     pe rădăcină (altfel cădea pe pagină: Ctrl+Z / Space / Delete / Escape nu mai mergeau, iar Space derula pagina). */
  const focRad=()=>{try{root.focus({preventScroll:true})}catch(_){root.focus()}};
  function deseneaza(){
    const ae0=document.activeElement,aveaFocus=root.contains(ae0);
    /* N5 (judecata 2): un buton [data-a] ajuns cu Tab (focus-visible) își păstrează focusul și după redesenare (Enter de două ori pe ▶) */
    let da=null;try{if(aveaFocus&&ae0.matches&&ae0.matches('button[data-a]:focus-visible'))da=ae0.getAttribute('data-a')}catch(_){}
    deseneaza0();
    if(aveaFocus&&!root.contains(document.activeElement)){
      let nou=null;if(da!==null){try{nou=root.querySelector('button[data-a="'+da+'"]')}catch(_){}}
      /* R1b (judecata 3): butonul cu același data-a poate fi acum INACTIV (↶ la capătul istoricului, ↷, 🗑 după ștergere);
         focus() pe el nu face nimic și focusul ar cădea pe pagină → atunci (și oricând focusul tot n-a ajuns în simulator) pe rădăcină */
      if(nou&&!nou.disabled){try{nou.focus({preventScroll:true})}catch(_){nou.focus()}}
      if(!root.contains(document.activeElement))focRad();
    }
  }
  function deseneaza0(){
    if(S.ecran==='acasa'){root.innerHTML=`<div class="vc-acasa"><h3>Clipchamp</h3><p>Pagina de pornire. Proiectele tale apar aici.</p><button type="button" class="vc-b mov" data-a="nou">＋ Creați un videoclip nou</button></div><div class="vc-msg"></div>${dialogHtml()}`;mesaj(S.mesaj);return}
    const ales=S.ales;const prop=!!ales&&(ales.tip==='tranz'||ales.tip==='audio'||ales.tip==='video'||extProp[ales.tip]);
    /* R1 (judecata 3): panoul de proprietăți NU mai intră deasupra liniei de timp (o împingea în jos ~146 px chiar la atingerea
       care alegea o scenă, iar clicul atingerii cădea pe 🗑 Ștergeți). Simulator îngust / mediu: panoul stă SUB linia de timp;
       lat (≥ 900 px): coloana din dreapta e rezervată mereu (goală, cu o notă, când nu e nimic ales), deci previzualizarea nu se
       îngustează la alegere. Nimic de deasupra liniei de timp și nimic de pe ea nu se mută când alegi sau renunți. */
    latime();const lat=root.classList.contains('lat');   // lățimea măsurată ÎNAINTE de desen (și la primul desen)
    const propHtml=prop?'<div class="vc-prop"></div>':lat?'<div class="vc-prop gol"><p>Alege o scenă, o tranziție sau muzica de pe linia de timp: aici apar proprietățile ei.</p></div>':'';
    const sc=root.querySelector('.vc-sc');const scl=sc?sc.scrollLeft:0;
    root.innerHTML=`<div class="vc-sus"><button type="button" class="vc-cb" data-a="anuleaza" aria-label="Anulare" title="Anulare (Ctrl+Z)" ${istoric.length?'':'disabled'}>↶</button><button type="button" class="vc-cb" data-a="reface" aria-label="Refacere" title="Refacere" ${viitor.length?'':'disabled'}>↷</button>
      <button type="button" class="vc-nume" data-a="nume" title="Numele proiectului: clic ca să-l schimbi">${esc(S.nume)}</button><span class="vc-sp"></span>
      <button type="button" class="vc-b" data-a="export">⇧ Exportați</button></div>
    <div class="vc-mij${prop?' cuprop':''}">
      <div class="vc-rail" role="tablist">${[{id:'media',eticheta:'Conținutul meu media',simbol:'▤'},{id:'tranzitii',eticheta:'Tranziții',simbol:'⧉'}].concat(extFile).map(f=>`<button type="button" class="vc-fila${S.fila===f.id?' on':''}" data-fila="${f.id}" role="tab" aria-selected="${S.fila===f.id}"><span class="ic">${f.simbol||'□'}</span><span>${esc(f.eticheta)}</span></button>`).join('')}</div>
      <div class="vc-panou"></div>
      <div class="vc-scena"><div class="vc-ecran"><img alt="" class="l0"><img alt="" class="l1"><div class="neg"></div><div class="strat"></div></div>
        <div class="vc-ctrl"><button type="button" class="vc-cb" data-a="inceput" aria-label="Salt la început" title="Salt la început">|◀</button><button type="button" class="vc-cb" data-a="inapoi5" aria-label="Înapoi 5 secunde" title="Înapoi 5 secunde">↺5</button><button type="button" class="vc-cb play" data-a="reda" aria-label="Redare">▶</button><button type="button" class="vc-cb" data-a="inainte5" aria-label="Înainte 5 secunde" title="Înainte 5 secunde">↻5</button><span class="vc-ceas"><b>0:00.00</b> <span>/ 0:00.00</span></span></div>
        <div class="vc-acum" aria-live="polite"></div>
        ${O.sunet?`<button type="button" class="vc-b vc-sunet" data-a="sunet">${S.sunet?'🔊 Sunet: pornit':'🔇 Sunet: oprit'}</button>`:''}</div>
      ${lat?propHtml:''}</div>
    <div class="vc-msg"></div>
    <div class="vc-linie"><div class="vc-lunelte"><button type="button" class="vc-b" data-a="taie" title="Tăiere în două (S)">✂</button><button type="button" class="vc-b" data-a="sterge" ${ales?'':'disabled'} title="Ștergeți ce e ales (Delete)">🗑 Ștergeți</button>
      <span class="vc-zoom"><button type="button" class="vc-b" data-a="micsoreaza" aria-label="Micșorează" title="Micșorează">− Micșorează</button><button type="button" class="vc-b" data-a="mareste" aria-label="Mărește" title="Mărește">+ Mărește</button><button type="button" class="vc-b" data-a="potriveste" title="Potrivește">Potrivește</button></span></div>
      <div class="vc-sc"><div class="vc-in"></div></div></div>
    ${lat?'':propHtml}
    ${dialogHtml()}`;
    deseneazaPanou();if(prop)deseneazaProp();deseneazaLinie();
    const sc2=root.querySelector('.vc-sc');if(sc2)sc2.scrollLeft=scl;
    mesaj(S.mesaj);deseneazaTimp();latime();
  }
  function deseneazaPanou(){
    const pn=root.querySelector('.vc-panou');if(!pn)return;
    const ext=extFile.find(f=>f.id===S.fila);if(ext){pn.innerHTML='';try{ext.deschide(pn,API)}catch(e){console.error(e)}return}
    if(S.fila==='tranzitii'){
      pn.innerHTML=`<h4>Tranziții</h4><p class="vc-indr">Glisați o tranziție între două clipuri în cronologie.</p><div class="vc-gr">Estompări și încețoșări</div>
        <div class="vc-tr-lista">${TRANZITII.map((x,i)=>`<div class="vc-tr" data-tr="${i}" title="${esc(x.nume)} (${x.en})" role="button" tabindex="0"><span class="mini" style="${miniTr(x.fel)}"></span><span class="et">${esc(x.nume)}</span></div>`).join('')}</div>`;
      return}
    pn.innerHTML=`<h4>Conținutul meu media</h4><button type="button" class="vc-imp" data-a="import">Importați conținutul media</button>
      ${P.media.length?`<div class="vc-lib">${P.media.map((m,i)=>{const M=CAT[m.nume]||{};return `<div class="vc-item" data-med="${i}" title="${esc(m.nume)}" role="button" tabindex="0">${M.tip==='audio'?'<span class="mini aud">♫</span>':`<img class="mini" src="${esc(M.src||'')}" alt="" loading="lazy">`}<span class="et">${esc(m.nume)}</span><button type="button" class="vc-plus" data-plus="${i}" aria-label="Adaugă la cronologie: ${esc(m.nume)}" title="Adaugă la cronologie">+</button></div>`}).join('')}</div>`
        :`<div class="vc-gol-media">Glisați și fixați conținutul media de pe dispozitiv pentru a importa<br><small>Videoclipuri, audio, imagini, GIF-uri</small></div>`}`;
  }
  function miniTr(f){return f==='negru'?'background:linear-gradient(90deg,#7aa0c8,#000 50%,#d7b98c)':f==='blur'?'background:linear-gradient(90deg,#8aa9cf,#c9b8e8);filter:blur(1px)':f==='burn'?'background:linear-gradient(90deg,#8aa9cf,#ffd27a,#e6a3a3)':f==='dale'?'background:repeating-linear-gradient(90deg,#8aa9cf 0 10px,#d7b98c 10px 20px)':'background:linear-gradient(90deg,#7aa0c8,#d7b98c)'}
  function deseneazaProp(){
    const pr=root.querySelector('.vc-prop');if(!pr||!S.ales)return;const a=S.ales;
    if(extProp[a.tip]){const L=a.tip==='text'?P.text:[];const elx=L.find(x=>x.id===a.id);try{extProp[a.tip](pr,elx,API)}catch(e){console.error(e)}return}
    if(a.tip==='tranz'){const x=P.tranz.find(x=>x.id===a.id);if(!x){pr.innerHTML='';return}
      pr.innerHTML=`<h4>Tranziții</h4><div role="radiogroup">${[{nume:'Fără',en:'None'}].concat(TRANZITII).map(o=>`<label class="vc-opt"><input type="radio" name="vc-tr-${root._uid}" value="${esc(o.nume)}" ${o.nume===x.nume?'checked':''}> ${esc(o.nume)}</label>`).join('')}</div>
        <label for="vc-trd-${root._uid}">Durată</label><div class="rand"><input type="range" id="vc-trd-${root._uid}" min="${TR_MIN}" max="${TR_MAX}" step="0.1" value="${x.durata}"><input type="number" min="${TR_MIN}" max="${TR_MAX}" step="0.1" value="${x.durata}" aria-label="Durata tranziției, în secunde"> s</div>`;
      pr.querySelectorAll('input[type=radio]').forEach(r=>r.onchange=()=>{salveaza();if(r.value==='Fără'){P.tranz=P.tranz.filter(y=>y!==x);S.ales=null;emit({tip:'tranzitieScoasa'})}else{x.nume=r.value;const A=P.video.find(c=>c.id===x.st),B=P.video.find(c=>c.id===x.dr);emit({tip:'tranzitie',nume:x.nume,intre:[A.m,B.m],durata:x.durata})}deseneaza();focRad()});
      const rg=pr.querySelector('input[type=range]'),nb=pr.querySelector('input[type=number]');
      let pornitT=false;const pune=(v)=>{v=cl(r1(+v||0),TR_MIN,TR_MAX);x.durata=v;rg.value=v;nb.value=v;deseneazaLinie();deseneazaTimp()};
      rg.oninput=()=>{if(!pornitT){salveaza();pornitT=true}pune(rg.value)};rg.onchange=()=>{pornitT=false;pune(rg.value);emit({tip:'tranzitieDurata',durata:x.durata})};
      nb.onchange=()=>{salveaza();pune(nb.value);emit({tip:'tranzitieDurata',durata:x.durata})};return}
    if(a.tip==='audio'){const c=P.audio.find(x=>x.id===a.id);if(!c){pr.innerHTML='';return}
      pr.innerHTML=`<h4>Audio</h4><div style="font-size:.78rem;color:var(--vc-ink2)">${esc(c.m)}</div><label for="vc-vol-${root._uid}">Volum</label><div class="rand"><input type="range" id="vc-vol-${root._uid}" min="0" max="${VOL_MAX}" step="1" value="${c.vol}"><span class="val" style="min-width:3.2em;text-align:right">${c.vol} %</span></div>`;
      const rg=pr.querySelector('input'),vl=pr.querySelector('.val');let pornit=false;
      rg.oninput=()=>{if(!pornit){salveaza();pornit=true}c.vol=+rg.value;vl.textContent=c.vol+' %';deseneazaTimp();sunetLa()};
      rg.onchange=()=>{c.vol=+rg.value;pornit=false;emit({tip:'volum',m:c.m,vol:c.vol});deseneazaTimp()};return}
    if(a.tip==='video'){const c=P.video.find(x=>x.id===a.id);if(!c){pr.innerHTML='';return}
      pr.innerHTML=`<h4>Imagine</h4><div style="font-size:.8rem">${esc(c.m)}</div><div style="font-size:.8rem;margin-top:6px">Ține: <b>${fmtS(c.durata)}</b>, de la ${fmt(c.start)} la ${fmt(c.start+c.durata)}.</div><div style="font-size:.74rem;color:var(--vc-ink2);margin-top:6px">Durata o schimbi trăgând de mânerele de la capetele clipului.</div>`;return}
    pr.innerHTML='';
  }
  function spanVazut(){return Math.max(20,Math.ceil((durata()+2)/5)*5)}   // „Potrivește”: tot filmul, rotunjit în sus la 5 s
  function pxs(){if(root._kFix)return root._kFix;const sc=root.querySelector('.vc-sc');const w=Math.max(200,(sc?sc.clientWidth:600)-50);return w/spanVazut()*Math.pow(1.6,S.zoom)}
  function deseneazaLinie(){
    const inn=root.querySelector('.vc-in');if(!inn)return;const k=pxs();const D=Math.max(spanVazut(),durata()+2);const X0=40;const W=X0+D*k+20;
    inn.style.width=(root._kFix&&root._wFix?Math.max(W,root._wFix):W)+'px';   // cât ții apăsat, linia nu se îngustează (altfel bara de derulare ar sări)
    const pas=k>=60?1:k>=25?2:k>=12?5:10;
    let rig='';for(let s=0;s<=D;s+=pas/(pas>=2?2:1)){const mare=Math.abs(s/pas-Math.round(s/pas))<1e-6;rig+=`<span class="tk${mare?' mare':''}" style="left:${X0+s*k}px"></span>`;if(mare)rig+=`<span class="lb" style="left:${X0+s*k}px">${Math.floor(s/60)}:${doi(Math.round(s)%60)}</span>`}
    const V=vSort();
    const vClip=c=>{const M=CAT[c.m]||{};const al=S.ales&&S.ales.tip==='video'&&S.ales.id===c.id;return `<div class="vc-clip img${al?' ales':''}" data-clip="${c.id}" data-p="video" style="left:${X0+c.start*k}px;width:${c.durata*k}px;background-image:url('${esc(M.src||'')}')" title="${esc(c.m)}: ${fmtS(c.durata)}"><span class="nm">${esc(titlu(c.m))}</span>${al?'<span class="vc-man st" data-man="st"><i></i></span><span class="vc-man dr" data-man="dr"><i></i></span>':''}</div>`};
    const aClip=c=>{const M=CAT[c.m]||{};const al=S.ales&&S.ales.tip==='audio'&&S.ales.id===c.id;return `<div class="vc-clip${al?' ales':''}" data-clip="${c.id}" data-p="audio" style="left:${X0+c.start*k}px;width:${c.durata*k}px" title="${esc(c.m)}: ${fmtS(c.durata)}, volum ${c.vol} %">${undaSvg(M.unda,c.de,c.durata,c.vol)}<span class="nm">${esc(c.m)}</span>${al?'<span class="vc-man st" data-man="st"><i></i></span><span class="vc-man dr" data-man="dr"><i></i></span>':''}</div>`};
    let goluri='',imb='';
    V.forEach((c,i)=>{const pr=i?V[i-1].start+V[i-1].durata:0;if(c.start-pr>TOL)goluri+=`<div class="vc-gol" style="left:${X0+pr*k}px;width:${(c.start-pr)*k}px"><button type="button" class="vc-golb" data-gol="${c.id}" aria-label="Ștergeți acest spațiu liber" title="Ștergeți acest spațiu liber">🗑</button></div>`;
      const b=V[i+1];if(b&&alaturate(c,b)){const x=P.tranz.find(x=>x.st===c.id&&x.dr===b.id);const al=x&&S.ales&&S.ales.tip==='tranz'&&S.ales.id===x.id;
        imb+=x?`<button type="button" class="vc-imb tr${al?' ales':''}" data-trx="${x.id}" data-ros="${c.id}" style="left:${X0+b.start*k}px" aria-label="Tranziție: ${esc(x.nume)}, între ${esc(titlu(c.m))} și ${esc(titlu(b.m))}" title="${esc(x.nume)} (${fmtS(x.durata)})">⧉</button>`
          :`<button type="button" class="vc-imb adauga" data-adtr="${c.id}" data-ros="${c.id}" style="left:${X0+b.start*k}px" aria-label="Adăugați o tranziție între ${esc(titlu(c.m))} și ${esc(titlu(b.m))}" title="Adăugați o tranziție">+</button>`}});
    const txt=P.text.length||extFile.length?`<div class="vc-pista t" data-pista="text"><span class="eti">Text</span>${P.text.map(c=>{const al=S.ales&&S.ales.tip==='text'&&S.ales.id===c.id;return `<div class="vc-clip${al?' ales':''}" data-clip="${c.id}" data-p="text" style="left:${X0+c.start*k}px;width:${c.durata*k}px">${esc(c.text)}${al?'<span class="vc-man st" data-man="st"><i></i></span><span class="vc-man dr" data-man="dr"><i></i></span>':''}</div>`}).join('')}</div>`:'';
    inn.innerHTML=`<div class="vc-rigla" data-rigla="1">${rig}</div>${txt}<div class="vc-pista v" data-pista="video"><span class="eti">Video</span>${goluri}${V.map(vClip).join('')}${imb}</div><div class="vc-pista a" data-pista="audio"><span class="eti">Audio</span>${P.audio.map(aClip).join('')}</div>${!P.video.length&&!P.audio.length?'<div class="vc-gol-linie">Trage aici, pe linia de timp, materialele din „Conținutul meu media” (sau apasă + pe ele).</div>':''}<div class="vc-cap"></div>`;
    root._X0=X0;root._k=k;
  }
  function undaSvg(U,de,d,vol){if(!U||!U.length)return '';const n=Math.max(2,Math.round(d*8));const g=cl(vol/100,0.05,1.6);let p='';for(let i=0;i<n;i++){const t=de+(i/n)*d;const v=U[Math.min(U.length-1,Math.round(t*50))]||0;const h=Math.min(48,v*g*46+1);p+=`M${(i/n*100).toFixed(2)} ${50-h} V${50+h} `}return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${p}" stroke="#2f7f6c" stroke-width="0.6" fill="none" vector-effect="non-scaling-stroke"/></svg>`}
  function deseneazaTimp(){
    if(S.ecran!=='editor')return;
    const D=durata();const ce=root.querySelector('.vc-ceas');if(ce)ce.innerHTML=`<b>${fmt(S.p)}</b> <span>/ ${fmt(D)}</span>`;
    const pl=root.querySelector('[data-a="reda"]');if(pl){pl.textContent=S.reda?'‖':'▶';pl.setAttribute('aria-label',S.reda?'Pauză':'Redare')}
    const cap=root.querySelector('.vc-cap');if(cap)cap.style.left=(root._X0+S.p*root._k)+'px';
    const F=cadru(S.p);const l0=root.querySelector('.vc-ecran .l0'),l1=root.querySelector('.vc-ecran .l1'),ng=root.querySelector('.vc-ecran .neg');
    if(l0){const src=n=>(CAT[n]&&CAT[n].src)||'';
      const set=(im,n,op,flt)=>{if(n){const s=src(n);if(im.getAttribute('src')!==s)im.setAttribute('src',s);im.style.opacity=op;im.style.filter=flt||''}else{im.style.opacity=0}};
      ng.style.opacity=0;
      if(F.trecere){const f=(TRANZITII.find(x=>x.nume===F.trecere.nume)||{}).fel||'cross';const k=F.k;
        if(f==='negru'){if(k<0.5){set(l0,F.a,1);set(l1,null);ng.style.opacity=k*2}else{set(l0,F.b,1);set(l1,null);ng.style.opacity=(1-k)*2}}
        else if(f==='blur'){set(l0,F.a,1,`blur(${(k*8).toFixed(1)}px)`);set(l1,F.b,k,`blur(${((1-k)*8).toFixed(1)}px)`)}
        else if(f==='burn'){set(l0,F.a,1,`brightness(${1+k*1.5})`);set(l1,F.b,k,`brightness(${1+(1-k)*1.5})`)}
        else{set(l0,F.a,1);set(l1,F.b,k)}}
      else if(F.negru){set(l0,null);set(l1,null)}
      else{set(l0,F.a,1);set(l1,null)}
      const strat=root.querySelector('.vc-ecran .strat');if(strat){strat.innerHTML=F.text.map(t=>`<div class="txt">${esc(t)}</div>`).join('');extPrev.forEach(fn=>{try{fn(strat,S.p,API)}catch(e){console.error(e)}})}}
    const ac=root.querySelector('.vc-acum');
    if(ac){let ved;
      if(F.trecere)ved=`trecerea de la <b>${esc(titlu(F.a))}</b> la <b>${esc(titlu(F.b))}</b> (${esc(F.trecere.nume)}, ${fmtS(F.trecere.durata)})`;
      else if(F.negru)ved=D>0&&S.p<D?'<b>ecran negru</b>: aici nu e nicio scenă':'<b>ecran negru</b>: filmul s-a terminat';
      else ved=`scena <b>${esc(titlu(F.a))}</b>`;
      ac.innerHTML=`Acum, la ${fmt(S.p)}: vezi ${ved}. Se aude: ${ceSeAude(S.p)}.`}
  }
  function latime(){const w=root.clientWidth||600;root.classList.toggle('ingust',w<640);root.classList.toggle('lat',w>=900)}
  function dialogHtml(){
    if(!S.dialog)return '';const D=S.dialog;
    return `<div class="vc-dlg" role="dialog" aria-label="Deschidere"><div class="w"><div class="tt"><b>Deschidere</b><button type="button" class="vc-cb" data-dlg="x" aria-label="Închide">✕</button></div>
      <div class="cp"><div class="nav"><div>Desktop</div><div class="on">Descărcări</div><div>Documente</div><div>Imagini</div></div>
      <div class="fis" role="listbox" aria-multiselectable="true">${S.descarcari.map((n,i)=>{const M=CAT[n]||{};return `<button type="button" class="f${D.sel.includes(n)?' on':''}" data-f="${i}" role="option" aria-selected="${D.sel.includes(n)}"><span class="ic">${M.tip==='audio'?'♫':M.tip==='imagine'?'🖼':'📄'}</span>${esc(n)}</button>`}).join('')}</div></div>
      <div class="jos">${D.atingere?'<div class="tel">Pe telefon nu ai Ctrl: aici fiecare atingere adaugă sau scoate un fișier din alegere (pe calculator: Ctrl + clic).</div>':''}
        <div class="nf">Nume fișier: <span>${D.sel.map(n=>'"'+esc(n)+'"').join(' ')}</span></div>
        <div class="bt"><button type="button" class="vc-b mov" data-dlg="ok" ${D.sel.length?'':'disabled'}>Deschidere</button><button type="button" class="vc-b" data-dlg="x">Anulare</button></div></div></div></div>`;
  }

  /* ---------------- acțiunile ---------------- */
  function actiune(a,ev){
    switch(a){
      case 'nou':S.ecran='editor';S.nume=NUME_NOU;P={media:[],video:[],audio:[],text:[],tranz:[]};istoric=[];viitor=[];S.p=0;emit({tip:'nou'});deseneaza();break;
      case 'import':S.dialog={sel:[],atingere:false,ultim:-1};emit({tip:'importDeschis'});deseneaza();break;
      case 'reda':S.reda?pauza():reda();deseneazaTimp();break;
      case 'inceput':if(S.reda){pauza()}S.p=0;emit({tip:'inceput'});deseneazaTimp();break;
      case 'inapoi5':cauta(Math.max(0,S.p-5),'inapoi5');break;
      case 'inainte5':cauta(Math.min(durata(),S.p+5),'inainte5');break;
      case 'mareste':S.zoom=Math.min(4,S.zoom+1);emit({tip:'mareste'});deseneazaLinie();deseneazaTimp();break;
      case 'micsoreaza':S.zoom=Math.max(-2,S.zoom-1);emit({tip:'micsoreaza'});deseneazaLinie();deseneazaTimp();break;
      case 'potriveste':S.zoom=0;emit({tip:'potriveste'});deseneazaLinie();deseneazaTimp();break;
      case 'anuleaza':anuleaza();break;
      case 'reface':reface();break;
      case 'sterge':if(S.ales){salveaza();stergeClip(S.ales.tip,S.ales.id);S.ales=null;deseneaza()}break;
      case 'taie':mesaj('Tăierea în două (✂, tasta S) nu e în lecția asta: aici schimbi durata trăgând de mânerele clipului.');break;
      case 'export':mesaj('„Exportați” nu exportă în pagină: aici lucrezi doar la montaj.');break;
      case 'sunet':S.sunet=!S.sunet;if(!S.sunet)opresteSunet();else if(S.reda)sunetLa(true);deseneaza();break;
      case 'nume':editeazaNume();break;
    }
  }
  function anuleaza(){if(!istoric.length)return;viitor.push(JSON.stringify({P,nume:S.nume}));const o=JSON.parse(istoric.pop());P=o.P;S.nume=o.nume;S.ales=null;curataTranz();emit({tip:'anuleaza'});deseneaza()}
  function reface(){if(!viitor.length)return;istoric.push(JSON.stringify({P,nume:S.nume}));const o=JSON.parse(viitor.pop());P=o.P;S.nume=o.nume;S.ales=null;emit({tip:'reface'});deseneaza()}
  function editeazaNume(){
    const b=root.querySelector('.vc-nume');if(!b)return;const inp=document.createElement('input');inp.className='vc-nume-in';inp.value=S.nume;inp.setAttribute('aria-label','Numele proiectului');b.replaceWith(inp);inp.focus();inp.select();
    let gata=false;const fin=ok=>{if(gata)return;gata=true;const v=inp.value.trim();if(ok&&v&&v!==S.nume){salveaza();S.nume=v;emit({tip:'nume',nume:v})}deseneaza();root.focus({preventScroll:true})};
    inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();fin(true)}else if(e.key==='Escape'){e.preventDefault();fin(false)}};inp.onblur=()=>fin(true);
  }
  function dialogClic(i,e,atingere){
    const D=S.dialog;const n=S.descarcari[i];if(!D||!n)return;if(atingere)D.atingere=true;
    if(atingere||e&&(e.ctrlKey||e.metaKey)){D.sel=D.sel.includes(n)?D.sel.filter(x=>x!==n):D.sel.concat([n]);D.ultim=i}
    else if(e&&e.shiftKey&&D.ultim>=0){const a=Math.min(D.ultim,i),b=Math.max(D.ultim,i);D.sel=S.descarcari.slice(a,b+1)}
    else{D.sel=[n];D.ultim=i}
    deseneaza();
  }
  function dialogOk(){const D=S.dialog;if(!D||!D.sel.length)return;salveaza();const noi=[];D.sel.forEach(n=>{if(!P.media.some(m=>m.nume===n)){P.media.push({nume:n,tip:(CAT[n]||{}).tip||'imagine'});noi.push(n)}});S.dialog=null;S.fila='media';emit({tip:'import',fisiere:noi});if(noi.length<D.sel.length)mesaj('Unele fișiere erau deja în „Conținutul meu media”.');else mesaj('');deseneaza()}

  /* ---- tragerile (mouse și deget) ---- */
  let drag=null;
  function laTimp(x){const inn=root.querySelector('.vc-in');const r=inn.getBoundingClientRect();return (x-r.left-root._X0)/root._k}
  function pistaSub(x,y){const els=document.elementsFromPoint(x,y);for(const e of els){const p=e.closest&&e.closest('.vc-pista');if(p&&root.contains(p))return p.dataset.pista}return null}
  function fantoma(txt,x,y){let f=document.querySelector('.vc-fantoma');if(!f){f=document.createElement('div');f.className='vc-fantoma';document.body.appendChild(f)}f.textContent=txt;f.style.left=x+'px';f.style.top=y+'px'}
  function farFantoma(){const f=document.querySelector('.vc-fantoma');if(f)f.remove();root.querySelectorAll('.tinta').forEach(e=>e.classList.remove('tinta'))}
  function intreSub(x,y){const els=document.elementsFromPoint(x,y);for(const e of els){const b=e.closest&&e.closest('[data-ros]');if(b&&root.contains(b))return b}
    // aproape de o tăietură (± 18 px) pe pista video
    if(pistaSub(x,y)!=='video')return null;let best=null,bd=19;root.querySelectorAll('[data-ros]').forEach(b=>{const r=b.getBoundingClientRect();const d=Math.abs(r.left+r.width/2-x);if(d<bd){bd=d;best=b}});return best}
  root.addEventListener('pointerdown',e=>{
    if(S.ecran!=='editor'||S.dialog)return;
    const t=e.target;
    const plus=t.closest('[data-plus]');if(plus)return;
    const it=t.closest('.vc-item'),tr=t.closest('.vc-tr'),man=t.closest('.vc-man'),clip=t.closest('.vc-clip'),rig=t.closest('.vc-rigla'),trx=t.closest('[data-trx]');
    if(it){drag={fel:'media',i:+it.dataset.med,x0:e.clientX,y0:e.clientY,pornit:false,el:it}}
    else if(tr){drag={fel:'tranz',i:+tr.dataset.tr,x0:e.clientX,y0:e.clientY,pornit:false,el:tr}}
    else if(trx){return}
    else if(man&&clip){const id=clip.dataset.clip,p=clip.dataset.p;const c=(p==='audio'?P.audio:p==='text'?P.text:P.video).find(x=>x.id===id);if(!c)return;drag={fel:'man',parte:man.dataset.man,c,p,x0:e.clientX,y0:e.clientY,pornit:false,s0:c.start,d0:c.durata,de0:c.de||0};
      if(p==='video'){const V=vSort();const i=V.indexOf(c);drag.min=i>0?V[i-1].start+V[i-1].durata:0}e.preventDefault()}
    else if(clip){const id=clip.dataset.clip,p=clip.dataset.p;const c=(p==='audio'?P.audio:p==='text'?P.text:P.video).find(x=>x.id===id);if(!c)return;drag={fel:'clip',c,p,x0:e.clientX,y0:e.clientY,pornit:false,s0:c.start,t0:laTimp(e.clientX)}}
    else if(rig){drag={fel:'rigla'};cauta(laTimp(e.clientX));e.preventDefault()}
    else return;
    try{root.setPointerCapture(e.pointerId)}catch(_){}
    drag.atingere=e.pointerType==='touch';root._kFix=root._k;{const i_=root.querySelector('.vc-in');root._wFix=i_?i_.offsetWidth:0}   // scara rămâne aceeași cât ții apăsat
  });
  root.addEventListener('pointermove',e=>{
    if(!drag)return;
    if(drag.fel==='rigla'){cauta(laTimp(e.clientX));return}
    if(!drag.pornit){if(Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)<7)return;drag.pornit=true;if(drag.fel==='man'||drag.fel==='clip')salveaza()}
    e.preventDefault();
    if(drag.fel==='media'){const n=P.media[drag.i].nume;fantoma(n,e.clientX,e.clientY);root.querySelectorAll('.vc-pista').forEach(p=>p.classList.toggle('tinta',p.dataset.pista===pistaSub(e.clientX,e.clientY)));return}
    if(drag.fel==='tranz'){fantoma(TRANZITII[drag.i].nume,e.clientX,e.clientY);const b=intreSub(e.clientX,e.clientY);root.querySelectorAll('[data-ros]').forEach(x=>x.classList.toggle('tinta',x===b));return}
    if(drag.fel==='man'){const c=drag.c,t=laTimp(e.clientX);
      const ts=snap(t,c.id);const r3=x=>Math.round(x*1000)/1000;
      if(drag.p==='video'){if(drag.parte==='dr'){c.durata=r3(Math.max(0.5,ts-c.start))}else{const fin=drag.s0+drag.d0;const s=cl(ts,drag.min||0,fin-0.5);c.start=r3(s);c.durata=r3(fin-s)}}
      else if(drag.p==='audio'){const L=(CAT[c.m]||{}).durata||c.durata;if(drag.parte==='dr'){c.durata=r3(cl(ts-c.start,0.3,L-c.de))}else{const fin=drag.s0+drag.d0;const s=cl(ts,Math.max(0,drag.s0-drag.de0),fin-0.3);c.de=r3(drag.de0+(s-drag.s0));c.start=r3(s);c.durata=r3(fin-s)}}
      else{if(drag.parte==='dr')c.durata=r3(Math.max(0.5,ts-c.start));else{const fin=drag.s0+drag.d0;const s=cl(ts,0,fin-0.5);c.start=r3(s);c.durata=r3(fin-s)}}
      deseneazaLinie();deseneazaTimp();return}
    if(drag.fel==='clip'){const t=laTimp(e.clientX);const ns=Math.max(0,r1(drag.s0+(t-drag.t0)));
      if(drag.p==='video'){fantoma(titlu(drag.c.m)+' → '+fmt(snap(ns,drag.c.id)),e.clientX,e.clientY)}else{let s2=snap(ns,drag.c.id);const fin=snap(ns+drag.c.durata,drag.c.id);if(Math.abs(fin-(ns+drag.c.durata))<Math.abs(s2-ns))s2=Math.max(0,fin-drag.c.durata);drag.c.start=Math.round(s2*1000)/1000;deseneazaLinie();deseneazaTimp()}}
  });
  function sfarsitDrag(e,anulat){
    if(!drag)return;const d=drag;drag=null;farFantoma();root._kFix=0;root._wFix=0;
    if(d.fel==='rigla'||anulat){if(anulat&&d.pornit)deseneaza();return}
    if(!d.pornit){   // a fost doar un clic / o atingere
      if(d.fel==='media'){root.querySelectorAll('.vc-item').forEach(x=>x.classList.toggle('ales',x===d.el));return}
      if(d.fel==='tranz'){mesaj('Trage tranziția cu mouse-ul (sau cu degetul) între două clipuri de pe linia de timp. Sau apasă butonul + dintre două clipuri.');return}
      if(d.fel==='clip'||d.fel==='man'){S.ales={tip:d.p,id:d.c.id};emit({tip:'ales',m:d.c.m||d.c.text,pista:d.p});deseneaza();return}
      return}
    if(d.fel==='media'){const n=P.media[d.i].nume;const pista=pistaSub(e.clientX,e.clientY);if(!pista){mesaj('Lasă materialul pe linia de timp, jos.');return}
      const M=CAT[n]||{};salveaza();const t=laTimp(e.clientX);adaugaMedia(n,M.tip==='audio'?t:t-0.2,'trage');deseneaza();return}
    if(d.fel==='tranz'){const b=intreSub(e.clientX,e.clientY);if(!b){mesaj('Glisați o tranziție între două clipuri în cronologie: lasă-o chiar pe tăietura dintre două scene.');deseneaza();return}
      const a=P.video.find(c=>c.id===b.dataset.ros);salveaza();puneTranz(TRANZITII[d.i].nume,a);deseneaza();return}
    if(d.fel==='man'){const c=d.c;if(d.p==='video'){const nd=c.durata,ns=c.start;c.durata=d.d0;c.start=d.s0;if(d.parte==='dr')durataVideo(c,nd);else{c.start=ns;c.durata=nd;curataTranz();emit({tip:'durata',m:c.m,durata:nd})}}
      else if(d.p==='audio')emit({tip:'scurtat',m:c.m,start:c.start,durata:c.durata,de:c.de});
      else emit({tip:'durataText',id:c.id,durata:c.durata});
      S.ales={tip:d.p,id:c.id};deseneaza();return}
    if(d.fel==='clip'){const c=d.c;if(d.p==='video'){const t=laTimp(e.clientX);mutaVideo(c,snap(Math.max(0,r1(d.s0+(t-d.t0))),c.id))}else emit({tip:'muta',m:c.m||c.text,la:c.start,pista:d.p});S.ales={tip:d.p,id:c.id};deseneaza()}
  }
  root.addEventListener('pointerup',e=>{sfarsitDrag(e,false);
    /* reparația J1: după un gest (clip, mâner, riglă, glisor) tastele editorului trebuie să meargă; nu luăm focusul casetei numelui */
    const t=e.target;if(t&&t.closest&&t.closest('.vc-nume-in'))return;if(!root.contains(document.activeElement))focRad()});
  root.addEventListener('pointercancel',e=>sfarsitDrag(e,true));
  root.addEventListener('click',e=>{
    const t=e.target;if(S.dialog){const f=t.closest('[data-f]');if(f){dialogClic(+f.dataset.f,e,S.dialog.atingereUltima);return}
      const b=t.closest('[data-dlg]');if(b){if(b.dataset.dlg==='ok')dialogOk();else{S.dialog=null;emit({tip:'importAnulat'});deseneaza()}}return}
    const a=t.closest('[data-a]');if(a&&!a.disabled){actiune(a.dataset.a,e);return}
    const fl=t.closest('[data-fila]');if(fl){S.fila=fl.dataset.fila;emit({tip:'fila',fila:S.fila});deseneaza();return}
    const pl=t.closest('[data-plus]');if(pl){const n=P.media[+pl.dataset.plus].nume;salveaza();adaugaMedia(n,null,'plus');deseneaza();return}
    const g=t.closest('[data-gol]');if(g){const c=P.video.find(x=>x.id===g.dataset.gol);if(c){salveaza();stergeGol(c);deseneaza()}return}
    const ad=t.closest('[data-adtr]');if(ad){const c=P.video.find(x=>x.id===ad.dataset.adtr);if(c){salveaza();puneTranz(TRANZITII[0].nume,c);deseneaza()}return}
    const tx=t.closest('[data-trx]');if(tx){S.ales={tip:'tranz',id:tx.dataset.trx};emit({tip:'ales',pista:'tranz'});deseneaza();return}
    if(t.closest('.vc-pista')&&!t.closest('.vc-clip')&&S.ales){S.ales=null;deseneaza()}
  });
  /* reparația J1: după un clic cu mouse-ul / degetul (e.detail > 0) pe un buton al simulatorului, focusul vine pe simulator,
     ca Ctrl+Z, Space, Delete, Escape să meargă imediat, cum le predă lecția. Enter / Space pe un buton (e.detail 0) îi lasă
     focusul acolo (cine lucrează cu tastatura nu-și pierde locul). Casetele (numele, numărul) și glisoarele își păstrează focusul. */
  root.addEventListener('click',e=>{
    if(!(e.detail>0))return;const t=e.target;
    if(t&&t.closest&&(t.closest('input,label,textarea,select,.vc-nume-in')||t.closest('[data-a="nume"]')))return;
    const ae=document.activeElement;if(ae&&ae.classList&&ae.classList.contains('vc-nume-in'))return;
    focRad();
  });
  root.addEventListener('pointerdown',e=>{if(S.dialog){const f=e.target.closest('[data-f]');if(f)S.dialog.atingereUltima=e.pointerType==='touch'}},true);
  /* R1 (judecata 3) — PAZA ATINGERII. Chromium trimite clicul unei atingeri DUPĂ pointerup / touchend, la locul degetului, pe
     ce se află ACOLO după redesenare. Dacă între timp ceva s-a mutat sub deget, clicul ar apăsa alt buton decât cel atins
     (așa ștergea 🗑 scena abia aleasă, iar pe muzică apăsa + Mărește). Regula: clicul unei atingeri (sau al unui creion)
     contează doar dacă ajunge pe ACELAȘI lucru pe care a coborât degetul (aceeași scenă, același buton — și după redesenare,
     după data-*); altfel se ignoră și se notează în jurnal {tip:'clicIgnorat', de, pe}. Mouse-ul și tastatura nu trec pe aici. */
  const ATR_TINTA=['data-clip','data-a','data-trx','data-adtr','data-gol','data-plus','data-fila','data-f','data-dlg','data-med','data-tr','data-rigla'];
  function tintaDe(el){
    if(!el||!el.closest)return 'fond';
    const o=el.closest('.vc-opt');if(o&&root.contains(o)){const i=o.querySelector('input');return 'opt:'+(i?i.name+'='+i.value:o.textContent.trim())}
    const k=el.closest('['+ATR_TINTA.join('],[')+']');
    if(k&&k!==root&&root.contains(k)){for(const a of ATR_TINTA)if(k.hasAttribute(a))return a+'='+k.getAttribute(a)}
    // elementele extensiilor (lecția 15): primul strămoș cu data-* sau buton / casetă; cheia NU ține de clasă (ales / on se schimbă)
    for(let e=el;e&&e!==root&&e.nodeType===1;e=e.parentElement){
      const d=e.getAttributeNames().filter(a=>a.startsWith('data-')).sort();
      if(d.length||/^(BUTTON|INPUT|SELECT|TEXTAREA|LABEL|A)$/.test(e.tagName)||e.getAttribute('role')==='button'||e.hasAttribute('tabindex'))
        return e.tagName+'|'+d.map(a=>a+'='+e.getAttribute(a)).join(',')+'|'+(e.getAttribute('aria-label')||'')+(d.length?'':'|'+e.textContent.trim().slice(0,40));
    }
    return 'fond';
  }
  let atins=null;
  root.addEventListener('pointerdown',e=>{atins=e.pointerType&&e.pointerType!=='mouse'?{el:e.target,tinta:tintaDe(e.target),t:performance.now()}:null},true);
  root.addEventListener('pointercancel',()=>{atins=null},true);
  root.addEventListener('click',e=>{
    const a=atins;atins=null;
    if(!a||!(e.detail>0)||performance.now()-a.t>1500)return;
    const t=e.target;
    if(t===a.el||(a.el.isConnected&&a.el.contains&&a.el.contains(t))||(t&&t.contains&&t.contains(a.el)))return;
    const pe=tintaDe(t);if(pe===a.tinta)return;
    e.preventDefault();e.stopImmediatePropagation();J.push({tip:'clicIgnorat',t:r1(S.p),de:a.tinta,pe});
  },true);
  /* Tastele editorului (D: „Play or pause: SPACE”, „Undo: CTRL + Z”, „Redo: CTRL + Y”, „Delete: DEL or BACKSPACE”).
     Reparația J1: merg și cu focusul pe un buton al simulatorului (Space nu-l mai apasă din nou) și pe glisoarele /
     opțiunile panoului; caseta numelui și caseta cu număr își păstrează tastele (în ele scrii). */
  let spatiuLuat=false;
  root.addEventListener('keydown',e=>{
    const inp=e.target.closest&&e.target.closest('input');
    if(inp&&inp.type!=='range'&&inp.type!=='radio')return;
    if(S.ecran!=='editor')return;
    if(S.dialog){if(e.key==='Escape'){S.dialog=null;emit({tip:'importAnulat'});deseneaza();e.preventDefault()}return}
    const ctrl=e.ctrlKey||e.metaKey;
    if((e.key===' '||e.code==='Space')&&!ctrl&&!e.altKey){e.preventDefault();spatiuLuat=true;if(e.repeat)return;S.reda?pauza():reda();deseneazaTimp()}
    else if((e.key==='Delete'||e.key==='Backspace')&&S.ales&&!ctrl){e.preventDefault();actiune('sterge')}
    else if(ctrl&&!e.altKey&&(e.key==='z'||e.key==='Z')){e.preventDefault();e.shiftKey?reface():anuleaza()}
    else if(ctrl&&!e.altKey&&(e.key==='y'||e.key==='Y')){e.preventDefault();reface()}
    else if(!inp&&!ctrl&&!e.altKey&&(e.key==='s'||e.key==='S')){actiune('taie')}
  });
  root.addEventListener('keyup',e=>{if((e.key===' '||e.code==='Space')&&spatiuLuat){spatiuLuat=false;e.preventDefault()}});
  let ro=null;if(window.ResizeObserver){ro=new ResizeObserver(()=>{const a=root.classList.contains('ingust'),b=root.classList.contains('lat');latime();if(a!==root.classList.contains('ingust')||b!==root.classList.contains('lat'))deseneaza();else{deseneazaLinie();deseneazaTimp()}});ro.observe(root)}

  /* ---------------- simularea (pentru probe și pentru „Arată-mi răspunsul”) ---------------- */
  let SIM=false;
  function simuleaza(L){
    SIM=true;
    try{for(const x of (L||[])){const k=Object.keys(x)[0],v=x[k];const cv=n=>P.video.find(c=>c.m===n)||P.video.find(c=>c.id===n);const ca=n=>P.audio.find(c=>c.m===n)||P.audio.find(c=>c.id===n);
      switch(k){
        case 'nou':actiune('nou');break;
        case 'fila':S.fila=v;emit({tip:'fila',fila:v});break;
        case 'importa':S.dialog={sel:v.filter(n=>S.descarcari.includes(n)),atingere:false,ultim:-1};dialogOk();break;
        case 'adauga':salveaza();adaugaMedia(v,null,'plus');break;
        case 'trage':salveaza();adaugaMedia(v[0],v[1],'trage');break;
        case 'muta':{const c=cv(v[0]);if(c){salveaza();mutaVideo(c,v[1])}else{const a=ca(v[0]);if(a){salveaza();a.start=v[1];emit({tip:'muta',m:a.m,la:a.start,pista:'audio'})}}break}
        case 'durata':{const c=cv(v[0]);if(c){salveaza();durataVideo(c,v[1])}break}
        case 'gol':{const c=cv(v);if(c){salveaza();stergeGol(c)}break}
        case 'tranzitie':{const c=cv(v[1]);if(c){salveaza();puneTranz(v[0],c)}break}
        case 'plus':{const c=cv(v);if(c){salveaza();puneTranz(TRANZITII[0].nume,c)}break}
        case 'durataTranzitie':{const c=cv(v[0]);const x=c&&P.tranz.find(y=>y.st===c.id);if(x){salveaza();x.durata=cl(r1(v[1]),TR_MIN,TR_MAX);emit({tip:'tranzitieDurata',durata:x.durata})}break}
        case 'farTranzitie':{const c=cv(v);const x=c&&P.tranz.find(y=>y.st===c.id);if(x){salveaza();P.tranz=P.tranz.filter(y=>y!==x);emit({tip:'tranzitieScoasa'})}break}
        case 'sterge':{const c=cv(v)||ca(v);if(c){salveaza();stergeClip(P.audio.includes(c)?'audio':'video',c.id)}break}
        case 'capat':{const a=ca(v[0]);if(a){salveaza();const L=(CAT[a.m]||{}).durata||a.durata;a.durata=r1(cl(v[1]-a.start,0.3,L-a.de));emit({tip:'scurtat',m:a.m,start:a.start,durata:a.durata,de:a.de})}break}
        case 'inceputAudio':{const a=ca(v[0]);if(a){salveaza();a.start=Math.max(0,v[1]);emit({tip:'muta',m:a.m,la:a.start,pista:'audio'})}break}
        case 'volum':{const a=ca(v[0]);if(a){salveaza();a.vol=cl(Math.round(v[1]),0,VOL_MAX);emit({tip:'volum',m:a.m,vol:a.vol})}break}
        case 'alege':{const c=cv(v);const a=!c&&ca(v);if(c)S.ales={tip:'video',id:c.id};else if(a)S.ales={tip:'audio',id:a.id};emit({tip:'ales'});break}
        case 'rigla':cauta(v);break;
        case 'reda':reda();break;
        case 'pauza':pauza();break;
        case 'asteapta':{let r=v;while(r>0&&S.reda){const d=Math.min(0.1,r);avans(d);r-=d}break}
        case 'inceput':actiune('inceput');break;
        case 'inapoi5':actiune('inapoi5');break;
        case 'inainte5':actiune('inainte5');break;
        case 'tasta':if(v==='Space'){S.reda?pauza():reda()}else if(v==='Delete'){actiune('sterge')}else if(v==='z'){anuleaza()}break;
        case 'nume':salveaza();S.nume=v;emit({tip:'nume',nume:v});break;
        case 'anuleaza':anuleaza();break;
        case 'reface':reface();break;
      }}}finally{SIM=false}
    deseneaza();if(S.reda&&!raf){tPrev=0;raf=requestAnimationFrame(bucla)}
  }
  function reset(){S&&S.reda&&pauza();opresteSunet();init();deseneaza()}
  const API={
    radacina:root,versiune:VERS,
    stare,jurnal:()=>J.slice(),vazut:()=>VAZ.map(x=>x.slice(0,2)),vazutLaFinal:()=>VAZ.filter(x=>x[2]===S.ver).map(x=>x.slice(0,2)),cadru,durata,
    proiect:()=>copie({video:vSort(),audio:P.audio,text:P.text,tranz:P.tranz,media:P.media}),
    simuleaza,avans:s=>{let r=s;while(r>0&&S.reda){const d=Math.min(0.1,r);avans(d);r-=d}deseneazaTimp()},reset,redesenare:deseneaza,
    focus:()=>root.focus({preventScroll:true}),mesaj:h=>mesaj(h),
    on:f=>asc.push(f),off:f=>{asc=asc.filter(x=>x!==f)},
    schimba:fn=>{salveaza();fn(P);curataTranz();emit({tip:'schimbare'});deseneaza()},
    adaugaFila:f=>{extFile.push(f);deseneaza()},
    laPrevizualizare:fn=>{extPrev.push(fn);deseneazaTimp()},
    laProprietati:(tip,fn)=>{extProp[tip]=fn},
    alege:x=>{S.ales=x;deseneaza()},
    nouId:p=>nid(p||'t'),
    distruge:()=>{pauza();if(ro)ro.disconnect();root.remove()}
  };
  root._uid=Math.random().toString(36).slice(2,8);
  init();deseneaza();
  return API;
}

/* ---------------- verificările testelor ---------------- */
const V_=v=>v.proiect().video,A_=v=>v.proiect().audio;
const ev=(v,tip)=>v.jurnal().filter(e=>e.tip===tip);
function acoperit(v,a,b,laFinal){const I=(laFinal?v.vazutLaFinal():v.vazut()).sort((x,y)=>x[0]-y[0]);let c=a;for(const [x,y] of I){if(x>c+0.15)break;c=Math.max(c,y)}return c>=b-0.15}
const VERIFICARI={
  proiectNou:v=>ev(v,'nou').length>0&&v.stare().ecran==='editor',
  importate:(v,L)=>L.every(n=>v.proiect().media.some(m=>m.nume===n)),
  doarImportate:(v,L)=>{const M=v.proiect().media.map(m=>m.nume);return M.length===L.length&&L.every(n=>M.includes(n))},
  peLinie:(v,L)=>L.every(n=>V_(v).some(c=>c.m===n)),
  ordine:(v,L)=>{const m=V_(v).map(c=>c.m);return m.length===L.length&&m.every((x,i)=>x===L[i])},
  faraGoluri:v=>{const V=V_(v);if(!V.length)return false;let t=0;for(const c of V){if(Math.abs(c.start-t)>TOL)return false;t=c.start+c.durata}return true},
  durata:(v,o)=>{const c=V_(v).find(c=>c.m===o.m);return !!c&&c.durata>=o.de[0]-1e-6&&c.durata<=o.de[1]+1e-6},
  sfarsitVideo:(v,[a,b])=>{const s=v.stare().sfarsitVideo;return s>=a-1e-6&&s<=b+1e-6},
  tranzitie:(v,o)=>{const P=v.proiect();const a=P.video.find(c=>c.m===o.intre[0]),b=P.video.find(c=>c.m===o.intre[1]);if(!a||!b)return false;const x=P.tranz.find(x=>x.st===a.id&&x.dr===b.id);if(!x)return false;
    if(o.nume&&x.nume!==o.nume)return false;if(o.durata&&(x.durata<o.durata[0]-1e-6||x.durata>o.durata[1]+1e-6))return false;return true},
  nrTranzitii:(v,n)=>v.proiect().tranz.length===n,
  faraTranzitie:(v,L)=>{const P=v.proiect();const a=P.video.find(c=>c.m===L[0]),b=P.video.find(c=>c.m===L[1]);return !!a&&!!b&&!P.tranz.some(x=>x.st===a.id&&x.dr===b.id)},
  muzica:(v,n)=>A_(v).some(c=>c.m===n),
  muzicaDeLa0:(v,n)=>A_(v).some(c=>c.m===n&&c.start<=0.15&&c.de<=0.15),
  muzicaPanaLaCapat:(v,n)=>{const s=v.stare().sfarsitVideo;return s>0&&A_(v).some(c=>c.m===n&&Math.abs(c.start+c.durata-s)<=0.3)},
  volum:(v,o)=>A_(v).some(c=>c.m===o.m&&c.vol>=o.de[0]&&c.vol<=o.de[1]),
  vazut:(v,[a,b])=>acoperit(v,a,b),
  vazutTot:v=>{const D=v.stare().durata;return D>0&&acoperit(v,0,D,true)},   // tot filmul, de la 0:00 la capăt, DUPĂ ultima schimbare
  vazutTrecerea:(v,L)=>{const P=v.proiect();const a=P.video.find(c=>c.m===L[0]),b=P.video.find(c=>c.m===L[1]);if(!a||!b)return false;const x=P.tranz.find(x=>x.st===a.id&&x.dr===b.id);const d=x?x.durata:0.4;return acoperit(v,b.start-d/2,b.start+d/2)},
  numeSchimbat:v=>v.stare().nume!==NUME_NOU&&v.stare().nume.trim().length>=3,
  numeEste:(v,n)=>{const f=s=>String(s).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ');return f(v.stare().nume)===f(n)},
  folosit:(v,tip)=>ev(v,tip).length>0
};
function verifica(v,T){for(const k of Object.keys(T)){if(k==='ce'||k==='cum')continue;const f=VERIFICARI[k];if(f)return !!f(v,T[k])}return false}

/* ---------------- tipul pentru motor: {t:'videoclipchamp', …} ---------------- */
const CSS_T=`.vc-teste{margin-top:10px;border:1px solid var(--line,#ccc);border-radius:8px;padding:10px 12px;background:var(--paper2,#f5f5f5)}
.vc-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.vc-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.vc-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.vc-teste li.ok .s{color:var(--ok,#1b7a4a)}.vc-teste li.rau .s{color:var(--bad,#b42318)}
.vc-teste li .m{display:block;font-size:.85rem;color:var(--bad,#b42318)}`;
function stilT(){if(document.getElementById('sim-video-clipchamp-teste-css'))return;const s=document.createElement('style');s.id='sim-video-clipchamp-teste-css';s.textContent=CSS_T;document.head.appendChild(s)}
const TipVideoClipchamp={
  render(Q,body,api){
    stil();stilT();
    body.innerHTML=`<div class="vc-loc"></div><div style="margin-top:6px"><button type="button" class="btn sm ghost" data-vc-reset>↺ Ia-o de la capăt</button></div>${(Q.teste||[]).length?`<div class="vc-teste"><b>Testele</b> <span class="hint">· se bifează singure, pe măsură ce lucrezi</span><ol>${Q.teste.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`:''}`;
    const v=creeaza(body.querySelector('.vc-loc'),{catalog:Q.catalog,start:Q.start,sunet:Q.sunet});body._vc=v;
    const T=Q.teste||[];
    function marcheaza(arata){let ok=0;T.forEach((t,i)=>{const li=body.querySelector(`.vc-teste li[data-i="${i}"]`),b=verifica(v,t);if(b)ok++;
      if(!li)return;li.classList.toggle('ok',b);li.classList.toggle('rau',!b&&arata);li.querySelector('.s').textContent=b?'✓':arata?'✗':'○';li.querySelector('.m').innerHTML=!b&&arata&&t.cum?t.cum:''});return ok}
    v.on(()=>marcheaza(false));
    body.querySelector('[data-vc-reset]').onclick=()=>{if(api.done())return;v.reset();marcheaza(false);v.focus()};
    const nav=api.checkButton(()=>{
      const ok=marcheaza(true);v.focus();
      if(ok===T.length){nav.innerHTML='';api.resolve(true)}
      else{const p=T.find(t=>!verifica(v,t));api.resolve(false,`${ok} din ${T.length} teste trecute. ${p&&p.cum?p.cum:''}`);
        api.revealButton(()=>{v.reset();v.simuleaza(Q.solutie||[]);marcheaza(true);nav.innerHTML='';api.giveUp(Q.raspuns||'testele sunt acum bifate: uită-te pe linia de timp ce s-a schimbat.')})}
    },Q.verifica||'Verifică');
    marcheaza(false);
  },
  rezolva(Q,body){const v=body._vc;v.reset();v.simuleaza(Q.solutie||[]);return true},
  gresit(Q,body){const v=body._vc;v.reset();v.simuleaza(Q.gresit||[]);return true}
};
window.VideoClipchamp={versiune:VERS,creeaza,verificari:VERIFICARI,verifica,format:fmt,tranzitii:TRANZITII.map(x=>x.nume),durataImagine:DUR_IMAGINE};
window.TipVideoClipchamp=TipVideoClipchamp;
})();
