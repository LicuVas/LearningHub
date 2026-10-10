/* Simulatorul „browser-web” pentru lecțiile LearningHub — fișier comun (lectii/_sim/browser-web.js).
   PROPRIETAR: autorul lecției V · M2 · nr. 14 („Navigarea pe web. Căutarea informațiilor cu motoare de căutare”), 11.10.2026.
   Extensie NOUĂ (nu modifică niciun simulator existent). Pornit din ideea browserului „de probă” din jocuri/documentare-v,
   rescris după Microsoft Edge-ul REAL (română), probat pe desktopul ascuns (lectii/v/m2-l14/_proba/edge_*.json).
   Lumea e INVENTATĂ (site-uri …-exemplu.ro), locală: nimic nu pleacă spre Internet.

   Folosire în pagină (după motor.js):
     <script src="../../_sim/browser-web.js"></script>
     JocMotor.porneste({ …, tipuri:{browser:SimBrowserWeb, cautare:TipCautare} })
   Stilul se pune singur, o dată; folosește jetoanele motorului (--paper, --paper2, --line, --ink, --ink2, --accent, --sel, --ok…).

   CE E ADEVĂRAT AICI (Edge 154/155, Windows 11 în română, 10-11.10.2026):
   - sus, filele; pe fiecare filă × („Închideți fila”); lângă ele + („Filă nouă”, sfatul „Filă nouă (Ctrl+T)”);
   - ← Înapoi (sfat: „Faceți clic pentru a merge înapoi (Alt+Săgeată la stânga), țineți apăsat pentru a vedea istoricul”);
     → Înainte APARE DOAR după ce te-ai întors (la pornire nu e; sfat „Faceți clic pentru a merge înainte, țineți apăsat…”);
     ↻ Reîmprospătare (sfat „Reîmprospătați (Ctrl+R)”): cere din nou pagina;
   - „Bara de adrese și de căutare”, cu textul „Căutați sau introduceți adresa web”; un CLIC în ea selectează tot textul;
   - fila nouă: bara e goală și are deja cursorul;
   - o adresă + Enter deschide pagina; cuvinte (nu o adresă) + Enter => motorul de căutare al browserului (la Edge, Bing);
   - o adresă greșită => „Hmm... nu se poate accesa această pagină” / „Verificați dacă există o eroare de ortografie în <site>.”;
   - X pe fereastră cu mai multe file: Edge se închide fără întrebare; × pe ULTIMA filă închide fereastra;
   - motorul (după Bing, probat headless): ghilimelele drepte "…" și cele englezești “…” cer expresia EXACTĂ (cuvintele lipite, în
     ordinea scrisă); ghilimelele românești „…” NU (Bing le ia drept semne oarecare); reclamele poartă eticheta „Sponsorizat”;
     un rezultat = numele site-ului și adresa, titlul albastru (legătura), descrierea.
   ABATERI, spuse elevului pe ecran (rândul de sub fereastră):
   - un browser mic, cu câteva site-uri inventate; motorul are doar paginile lor;
   - Ctrl+T, Ctrl+W, Ctrl+N lucrează pe browserul tău ADEVĂRAT (nu le poate opri nicio pagină): în pagină folosești + și ×;
     Ctrl+R / F5 și Alt+← / Alt+→ sunt prinse de simulator cât lucrezi în el;
   - pe telefon (fără tastatură fizică) apare lângă bara de adrese butonul „Enter ↵”, în locul tastei Enter;
   - Esc în bara de adrese pune adresa filei la loc dintr-o apăsare (în Edge: Esc, Esc).
   REPARAT 11.10.2026 (judecata 1 a lecției 14): butonul „Scrie "” nu mai ia focusul și nu mai lasă bara să selecteze tot (G1);
   caseta de căutare (TipCautare) verifică la RIDICAREA tastei Enter, ca ghilimeaua unei taste moarte (US-International:
   " + Enter dă " abia odată cu Enter) să ajungă în casetă; adresa greșită își păstrează calea în bară; „lup.html” (fără
   terminație de site cunoscută) = căutare, ca în Edge; „…/index.html” = aceeași pagină; umplutura se caută doar în afara
   ghilimelelor, cu „si”, „despre”, „te” în plus; "" lipite au mesajul lor.

   TIPUL browser — Q:
     start?: 'nou' | 'lectie' | adresă | 'cauta:cuvinte' | 'eroare:site' | [istoric] | [ …mai multe file… ]
             (o filă = un șir sau un istoric ['adr1','adr2'] — ultima e pagina afișată); implicit 'nou'
     activa?: indicele filei active la pornire (implicit ultima)
     site?: {adresă: pagină} — pagini în plus (se adaugă la lumea implicită BrowserWeb.SITE, fără s-o schimbe)
     raspuns?: {eticheta:'Ce mănâncă ursul?'} — o casetă sub fereastră, în care elevul scrie ce a aflat
     ghilimele?: true — butonul „Scrie "” (pune ghilimeaua dreaptă unde e cursorul), pentru telefon
     checks:[{k, ce, msg?, …}] — testele numite, bifate singure:
       filaNoua · file{min?,max?} · fila{a} · pagina{a} (fila activă) · vizitat{a} · tastat{a} (adresa scrisă de elev)
       link{a} (ajuns prin legătură) · dinRezultate{a} (deschis din lista de rezultate) · inapoi · inainte · reimprospatat
       cautare{are:[[variante],…], max?, min?, fraza?, fara?:[cuvinte], faraGhilimele?, faraReclama?} (oricare căutare din sesiune;
         faraGhilimele: true = o căutare FĂRĂ expresie între ghilimele — adăugat 11.10.2026, după judecata 1 a lecției 14)
       lectie (o filă arată încă lecția) · activaLectie · inchise{min} · raspuns{are:[variante], minN?} · filtru{v:'imagini'|'video'|'stiri'}
     Sub fereastră: butonul „Ia-o de la capăt” (pune exercițiul la starea de pornire) și testele.
     sol:[[op,…]], gresit:[[op,…]] — op: ['tab'] · ['go',adresă] (scrisă în bară + Enter) · ['cauta',cuvinte] · ['rez',adresă]
       (clic pe rezultat) · ['link',adresă] · ['back'] · ['fwd'] · ['reload'] · ['sel',i] · ['close',i] · ['filtru','imagini'|…] ·
       ['raspuns',text]
     solText?, why — ca la orice întrebare.
   TIPUL cautare (o casetă de căutare, fără browser) — Q: {q, ok:'urs brun hrană', tipic:'răspunsul greșit tipic',
     are?, max?, min?, fraza?, fara?, eticheta?} — aceeași verificare ca testul „cautare”.

   PENTRU LECȚIA URMĂTOARE (V/15: salvarea textului și a imaginilor, sursa, licențele) — API-ul public:
     BrowserWeb.creeaza({site?, extensii?:[ext]}) => un tip nou (render/rezolva/gresit), cu lumea implicită + paginile tale.
     ext (toate opționale): pagina(html, ctx) => html (de ex. butoane „Salvează imaginea ca…” lângă poze);
       actiune(act, v, ctx) => true dacă a tratat un data-act al tău; verifica(c, ctx) => true|false (teste noi, k-ul tău);
       op(op, ctx) => true dacă a tratat o operație nouă din sol/gresit; panou(ctx) => html sub fereastră (de ex. „Fișierele tale”).
       ctx = {S, Q, esc, adresa, pagina, go(a), draw(), msg(text), ev(tip, detaliu)}.
     Evenimentul 'browser-web' (pe body-ul exercițiului, cu bubbles): detail {tip:'nav'|'cautare'|'fila'|'inchide'|'inapoi'|
       'inainte'|'reimprospatare', adresa?, q?, fila?}.
     BrowserWeb.SITE (lumea implicită, înghețată), BrowserWeb.cauta(q, site), BrowserWeb.parseQ(q), BrowserWeb.norm(a).
     NU schimba: numele butoanelor și sfaturile (sunt ale Edge-ului probat), regula ghilimelelor, aspectul unui rezultat,
     faptul că Înainte apare doar după Înapoi; paginile existente (lecția 14 se bazează pe textele lor). */
(function(){
'use strict';
const CSS=`
.bw{--bw-link:#1A0DAB;--bw-adr:#3C4A45;--bw-bar:#E9ECEB;--bw-tab:#D8DDDB;display:flex;flex-direction:column;gap:10px;text-align:left;font-family:var(--fb)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .bw{--bw-link:#8AB4F8;--bw-adr:#B5C2BD;--bw-bar:#202A27;--bw-tab:#2B3734}}
:root[data-theme="dark"] .bw{--bw-link:#8AB4F8;--bw-adr:#B5C2BD;--bw-bar:#202A27;--bw-tab:#2B3734}
.bw-win{border:1.5px solid var(--line);border-radius:10px;overflow:hidden;background:var(--paper);color:var(--ink);outline:none}
.bw-win:focus-visible{box-shadow:0 0 0 3px var(--sel)}
.bw-tabs{display:flex;align-items:flex-end;gap:2px;padding:6px 6px 0;background:var(--bw-bar);overflow-x:auto;scrollbar-width:thin}
.bw-tab{display:flex;align-items:center;flex:0 1 158px;min-width:76px;border-radius:8px 8px 0 0;background:var(--bw-tab);color:var(--ink2);font-size:.8rem}
.bw-tab.on{background:var(--paper);color:var(--ink);font-weight:600}
.bw-tab .nm{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;background:none;border:0;color:inherit;font:inherit;padding:7px 4px 7px 9px;min-height:36px;cursor:pointer}
.bw-tab .x{flex:none;width:32px;height:32px;margin-right:2px;border:0;border-radius:6px;background:none;color:inherit;font-size:1.05rem;line-height:1;cursor:pointer}
.bw-tab .x:hover,.bw-plus:hover,.bw-ico:hover:not(:disabled){background:var(--sel)}
.bw-plus{flex:none;position:sticky;right:0;width:36px;height:36px;margin:0 0 2px 2px;border:0;border-radius:8px;background:var(--bw-bar);color:var(--ink);font-size:1.35rem;line-height:1;cursor:pointer}
.bw-bar{display:flex;align-items:center;gap:2px;padding:6px;border-bottom:1px solid var(--line);background:var(--paper)}
.bw-ico{flex:none;width:36px;height:36px;border:0;border-radius:8px;background:none;color:var(--ink);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}
.bw-ico:disabled{opacity:.32;cursor:default}
.bw-ico svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.bw-adr{flex:1 1 auto;min-width:0;display:flex;gap:4px;margin:0 0 0 4px}
.bw-adr input{flex:1 1 auto;min-width:0;width:40px;border:1px solid var(--line);border-radius:999px;padding:7px 12px;font-family:var(--fb);font-size:.92rem;background:var(--paper2);color:var(--ink)}
.bw-adr input:focus{outline:2px solid var(--accent);background:var(--paper)}
.bw-enter{display:none;flex:none;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-size:.82rem;padding:0 9px;min-height:36px;cursor:pointer}
@media (max-width:600px),(hover:none) and (pointer:coarse){.bw-enter{display:inline-flex;align-items:center}}
@media (max-width:600px){.bw-bar{flex-wrap:wrap}.bw-adr{order:10;flex:1 1 100%;margin:4px 0 0}}
.bw-page{padding:12px 14px;min-height:200px;max-height:440px;overflow:auto;font-size:.95rem;line-height:1.45;overflow-wrap:anywhere;background:var(--paper)}
.bw-page p{margin:.45em 0}
.bw-site{font-size:.74rem;letter-spacing:.04em;text-transform:uppercase;color:var(--ink2)}
.bw-h{font-family:var(--fd);font-size:1.22rem;margin:.15em 0 .35em}
.bw-a{border:0;background:none;color:var(--bw-link);text-decoration:underline;font:inherit;padding:3px 1px;min-height:32px;cursor:pointer}
.bw-lk{display:flex;flex-wrap:wrap;gap:4px 14px;margin:.5em 0}
.bw-nou{text-align:center;padding:30px 6px 18px}
.bw-sf{display:flex;gap:6px;max-width:460px;margin:0 auto}
.bw-sf input{flex:1 1 auto;min-width:0;width:40px;border:1.5px solid var(--line);border-radius:999px;padding:9px 14px;font-family:var(--fb);font-size:.95rem;background:var(--paper);color:var(--ink)}
.bw-sf button{flex:none;border:0;border-radius:999px;background:var(--accent);color:var(--accentInk);font:inherit;font-weight:700;padding:0 14px;min-height:36px;cursor:pointer}
.bw-mic{font-size:.8rem;color:var(--ink2)}
.bw-motor{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.bw-motor .sigla{font-family:var(--fd);font-weight:700;color:var(--accent)}
.bw-filtre{display:flex;gap:2px;flex-wrap:wrap;border-bottom:1px solid var(--line);margin:8px 0 2px}
.bw-filtre button{border:0;border-bottom:3px solid transparent;background:none;color:var(--ink2);font:inherit;font-size:.84rem;padding:6px 9px;min-height:34px;cursor:pointer}
.bw-filtre button.on{color:var(--ink);font-weight:700;border-bottom-color:var(--accent)}
.bw-rez{padding:9px 0;border-bottom:1px solid var(--line)}
.bw-spons{display:inline-block;font-size:.72rem;font-weight:700;color:var(--ink2);margin-bottom:2px}
.bw-rsite{display:flex;align-items:center;gap:8px;font-size:.8rem;line-height:1.25}
.bw-rsite .ic{flex:none;width:24px;height:24px;border-radius:50%;background:var(--paper2);border:1px solid var(--line);display:inline-flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;color:var(--ink2)}
.bw-radr{color:var(--bw-adr)}
.bw-rt{display:block;border:0;background:none;color:var(--bw-link);font:inherit;font-size:1.04rem;text-align:left;padding:3px 0;min-height:32px;cursor:pointer}
.bw-rt:hover{text-decoration:underline}
.bw-rd{font-size:.86rem;color:var(--ink2)}
.bw-poze{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-top:8px}
.bw-poze button{border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font:inherit;font-size:.78rem;padding:4px;text-align:left;cursor:pointer}
.bw-poza{display:block;width:100%;height:auto;border-radius:6px}
.bw-err{padding:22px 10px}
.bw-err h3{font-family:var(--fd);font-size:1.25rem;margin:.2em 0 .5em}
.bw-btn{border:0;border-radius:6px;background:var(--accent);color:var(--accentInk);font:inherit;font-weight:700;padding:6px 14px;min-height:36px;cursor:pointer}
.bw-gol{padding:26px 12px;text-align:center}
.bw-msg{font-size:.84rem;padding:6px 12px;background:var(--okbg);color:var(--ink);border-top:1px solid var(--line)}
.bw-msg.rau{background:var(--badbg)}
.bw-nota{font-size:.82rem;color:var(--ink2);margin:0}
.bw-panou{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:10px 12px;font-size:.9rem}
.bw-panou .lbl{font-weight:700;margin-bottom:4px}
.bw-panou input{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:6px;padding:7px 9px;font-family:var(--fb);font-size:.95rem;background:var(--paper2);color:var(--ink)}
.bw-teste{list-style:none;margin:0;padding:0}
.bw-teste li{position:relative;padding:3px 0 3px 26px}
.bw-teste li::before{content:"";position:absolute;left:2px;top:6px;width:14px;height:14px;border:2px solid var(--ink2);border-radius:3px}
.bw-teste li.ok{color:var(--ok)}
.bw-teste li.ok::before{border-color:var(--ok);background:var(--ok)}
.bw-teste li.ok::after{content:"";position:absolute;left:7px;top:8px;width:5px;height:9px;border:solid var(--paper);border-width:0 2px 2px 0;transform:rotate(45deg)}
.bw-ghil{border:1px solid var(--line);border-radius:6px;background:var(--paper2);color:var(--ink);font:inherit;font-size:.85rem;padding:4px 10px;min-height:32px;cursor:pointer}
.bw-cq{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.bw-cq input{flex:1 1 240px;min-width:0;border:1.5px solid var(--line);border-radius:999px;padding:9px 14px;font-family:var(--fb);font-size:1rem;background:var(--paper);color:var(--ink)}
`;
function css(){if(document.getElementById('bw-css'))return;const s=document.createElement('style');s.id='bw-css';s.textContent=CSS;document.head.appendChild(s)}

const N=s=>String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim();
const CURAT=s=>N(s).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const STEM=w=>w.length>4?w.slice(0,-1):w;
const MOTOR='www.cautare-exemplu.ro';
const LECTIE='learninghub-8z6.pages.dev/lectii/v/m2-l14';   // fila lecției (start:'lectie'); adresa ei, fără „/” la sfârșit
const UMPLUTURA=['buna','ziua','vreau','vrea','as','rog','va','salut','multumesc','spune','spuneti','imi','mi','si','despre','te'];
/* terminațiile de site cunoscute: un cuvânt cu punct fără una dintre ele (ex. „lup.html”) e o căutare, ca în Edge (probat de judecătorul 1) */
const TLD=/^(ro|com|org|net|eu|dev|de|md|info|edu|gov|io|app|uk|fr|it|es|hu|us|ca|biz|tv|me|co)$/;

/* ---------------- lumea inventată (INGHEȚATĂ; extensiile adaugă pagini prin creeaza({site})) ---------------- */
const SITE=Object.freeze({
 [LECTIE]:{titlu:'Lecția 14 · LearningHub',site:'LearningHub',ascunsa:true,lectie:true,
  text:['Aici e lecția ta. Ca s-o păstrezi deschisă, lucrezi într-o filă nouă: apasă +, sus, lângă file.']},
 'learninghub-8z6.pages.dev/lectii/v':{titlu:'Lecții, clasa a V-a · LearningHub',site:'LearningHub',ascunsa:true,
  text:['Lecțiile clasei a V-a, pe module. Alege lecția la care lucrezi.'],link:[['Lecția 14: Navigarea pe web',LECTIE]]},
 'www.biblioteca-exemplu.ro':{titlu:'Biblioteca de probă',site:'Biblioteca Exemplu',text:['O pagină făcută pentru lecție. Alege un animal:'],
  link:[['Ariciul','www.biblioteca-exemplu.ro/arici.html'],['Lupul','www.biblioteca-exemplu.ro/lup.html']],cuv:'biblioteca proba animale'},
 'www.biblioteca-exemplu.ro/arici.html':{titlu:'Ariciul',site:'Biblioteca Exemplu',text:['Ariciul iese mai ales noaptea. Se hrănește cu insecte, râme și melci.'],
  link:[['Lupul','www.biblioteca-exemplu.ro/lup.html'],['Înapoi la bibliotecă','www.biblioteca-exemplu.ro']],cuv:'arici'},
 'www.biblioteca-exemplu.ro/lup.html':{titlu:'Lupul',site:'Biblioteca Exemplu',text:['Lupul trăiește în haite, în pădurile de munte.'],
  link:[['Ariciul','www.biblioteca-exemplu.ro/arici.html']],cuv:'lup'},
 'www.enciclopedie-exemplu.ro/arici':{titlu:'Ariciul – Enciclopedia Exemplu pentru copii',site:'Enciclopedia Exemplu',poza:'arici',
  text:['Ariciul este un mamifer mic, acoperit cu țepi. Iese mai ales noaptea.','Hrana lui: insecte, râme, melci și gândaci. Iarna doarme.'],
  link:[['Lupul','www.enciclopedie-exemplu.ro/lup'],['Ursul brun','www.enciclopedie-exemplu.ro/urs']],cuv:'arici ariciul aricii hrana hraneste mananca mamifer'},
 'www.enciclopedie-exemplu.ro/lup':{titlu:'Lupul – Enciclopedia Exemplu pentru copii',site:'Enciclopedia Exemplu',poza:'lup',
  text:['Lupul cenușiu trăiește în haite, în pădurile de munte.','Hrana lui e mai ales carnea: vânează iepuri, cerbi și mistreți. La nevoie mănâncă și fructe.'],
  link:[['Ariciul','www.enciclopedie-exemplu.ro/arici'],['Ursul brun','www.enciclopedie-exemplu.ro/urs']],cuv:'lup lupul lupii cenusiu hrana hraneste mananca carne haita'},
 'www.parc-exemplu.ro/lupul-cenusiu':{titlu:'Lupul cenușiu în Parcul Natural Exemplu',site:'Parcul Natural Exemplu',
  text:['În pădurile parcului trăiesc câteva haite de lupi cenușii. Lupul se hrănește mai ales cu carne: iepuri, cerbi, mistreți.'],cuv:'lup lupi cenusii hraneste parc carne'},
 'www.magazin-exemplu.ro/lup-plus':{titlu:'Lup de pluș – reducere 50%! Cumpără acum',site:'Magazin Exemplu',reclama:true,
  text:['Lupul de pluș preferat al copiilor, acum la reducere.'],cuv:'lup lupul cenusiu plus jucarie'},
 'www.enciclopedie-exemplu.ro/urs':{titlu:'Ursul brun – Enciclopedia Exemplu pentru copii',site:'Enciclopedia Exemplu',poza:'urs',
  text:['Ursul brun trăiește în pădurile de munte.','Hrana lui: fructe de pădure, rădăcini, miere, insecte și, uneori, carne.'],
  link:[['Lupul','www.enciclopedie-exemplu.ro/lup'],['Ariciul','www.enciclopedie-exemplu.ro/arici']],cuv:'urs ursul ursii brun hrana hraneste mananca'},
 'www.parc-exemplu.ro/ursul-brun':{titlu:'Ursul brun în Parcul Natural Exemplu',site:'Parcul Natural Exemplu',
  text:['În pădurile parcului trăiesc urși bruni. Vara, ursul se hrănește cu fructe de pădure, iarbă și rădăcini.'],cuv:'urs ursi brun bruni hraneste parc'},
 'www.gradina-exemplu.ro/ariciul':{titlu:'Ariciul, prietenul grădinii',site:'Grădina Exemplu',
  text:['Ariciul vine noaptea în grădină. Mănâncă melcii și insectele care strică plantele.'],cuv:'arici gradina hrana mananca melci'},
 'www.magazin-exemplu.ro/hrana-arici':{titlu:'Hrană pentru arici – reducere 30%! Cumpără acum',site:'Magazin Exemplu',reclama:true,
  text:['Ofertă specială! Comandă azi hrană pentru ariciul tău.'],cuv:'hrana arici ariciul mancare'},
 'www.magazin-exemplu.ro/urs-plus':{titlu:'Urs de pluș – reducere 50%! Cumpără acum',site:'Magazin Exemplu',reclama:true,
  text:['Ursul de pluș preferat al copiilor, acum la reducere.'],cuv:'urs ursul brun plus jucarie'},
 'www.salut-exemplu.ro/buna-ziua':{titlu:'Cum spui „Bună ziua” în zece limbi',site:'Salut Exemplu',
  text:['Bună ziua! Vreau să știu cum se salută copiii din toată lumea? Iată zece feluri de a spune „bună ziua”.'],cuv:'buna ziua salut limbi vreau stiu'},
 'www.intrebari-exemplu.ro':{titlu:'Vreau să știu! Întrebări și răspunsuri pentru curioși',site:'Întrebări Exemplu',
  text:['Bună ziua! Aici găsești o mulțime de întrebări: vreau să știu de ce, vreau să știu cum, ce mănâncă, ce înseamnă.'],cuv:'vreau stiu intrebari raspunsuri buna ziua ce mananca'},
 'www.povesti-exemplu.ro/capra-cu-trei-iezi':{titlu:'Capra cu trei iezi – Ion Creangă',site:'Povești Exemplu',
  text:['Era odată o capră care avea trei iezi.','Povestea întreagă a lui Ion Creangă, pentru copii.'],cuv:'capra cu trei iezi creanga poveste'},
 'www.teatru-exemplu.ro/capra-cu-trei-iezi':{titlu:'„Capra cu trei iezi”, spectacol de păpuși',site:'Teatrul Exemplu',fel:'stire',
  text:['Duminică, teatrul de păpuși joacă „Capra cu trei iezi”.'],cuv:'capra cu trei iezi spectacol teatru papusi'},
 'www.ferma-exemplu.ro/capre':{titlu:'La fermă: trei capre și iezii lor',site:'Ferma Exemplu',poza:'capra',
  text:['La ferma noastră sunt trei capre. Capra Mița are doi iezi, iar capra Bela are trei iezi.'],cuv:'capra capre iezi trei ferma'},
 'www.cantece-exemplu.ro/iezii':{titlu:'Cântecul iezilor, video pentru copii',site:'Cântece Exemplu',fel:'video',
  text:['Cântecul din poveste: „Trei iezi cucuieți, ușa mamei descuieți!”'],cuv:'cantec iezi trei capra video'},
 'www.astronomie-exemplu.ro/marte':{titlu:'Planeta Marte, planeta roșie',site:'Astronomie Exemplu',poza:'marte',
  text:['Marte este a patra planetă de la Soare.','Pare roșie din cauza prafului de pe ea.'],cuv:'planeta marte planete rosie soare'},
 'www.stiri-exemplu.ro/marte-robot':{titlu:'Un robot nou a ajuns pe Marte',site:'Știri Exemplu',fel:'stire',
  text:['Un robot trimis pe planeta Marte a făcut primele fotografii.'],cuv:'marte robot planeta stire'},
 'www.animals-example.com/hedgehog':{titlu:'Hedgehog – what does a hedgehog eat?',site:'Animals Example',limba:'en',
  text:['Hedgehogs eat insects, worms and snails. They sleep in winter.'],cuv:'hedgehog hedgehogs eat food insects worms snails'},
 'www.dex-exemplu.ro':{titlu:'Dicționar (exemplu)',site:'DEX Exemplu',text:['HAITĂ = grup de lupi care trăiesc și vânează împreună.','MAMIFER = animal care își hrănește puii cu lapte.'],
  cuv:'dictionar haita mamifer cuvinte'}
});
const ALIAS={'www.biblioteca-exemplu.ro/index.html':'www.biblioteca-exemplu.ro'};

/* desene simple pentru pozele site-urilor inventate (nu sunt capturi: sunt conținutul unor site-uri inventate) */
const POZE={arici:['#DDEFD0','#9CC47F','#7B5B3F'],lup:['#DCE8F0','#F4F8FA','#6E747C'],urs:['#CFE6C3','#8FB27F','#6B4A2E'],capra:['#E8F2D8','#B7D39A','#F2F2EE'],marte:['#1B2333','#2B3550','#C2552E']};
function poza(id,alt){
  const c=POZE[id]||['#ddd','#bbb','#777'],a=c[2];
  const fig=id==='marte'?`<circle cx="80" cy="48" r="30" fill="${a}"/><circle cx="70" cy="40" r="5" fill="#A8462A"/><circle cx="92" cy="58" r="4" fill="#A8462A"/>`
   :id==='urs'?`<ellipse cx="80" cy="62" rx="28" ry="15" fill="${a}"/><circle cx="110" cy="52" r="11" fill="${a}"/><circle cx="104" cy="42" r="4" fill="${a}"/><circle cx="116" cy="42" r="4" fill="${a}"/><rect x="58" y="68" width="8" height="14" fill="${a}"/><rect x="92" y="68" width="8" height="14" fill="${a}"/>`
   :id==='arici'?`<ellipse cx="80" cy="72" rx="22" ry="11" fill="${a}"/><path d="M60,70 l4,-12 l4,10 l4,-13 l4,12 l4,-13 l4,12 l4,-12 l4,11 l4,-9" stroke="${a}" stroke-width="3" fill="none"/><circle cx="103" cy="75" r="6" fill="#C9A27E"/>`
   :id==='capra'?`<ellipse cx="78" cy="60" rx="24" ry="11" fill="${a}" stroke="#999"/><circle cx="104" cy="50" r="8" fill="${a}" stroke="#999"/><rect x="60" y="66" width="4" height="16" fill="#999"/><rect x="92" y="66" width="4" height="16" fill="#999"/>`
   :`<ellipse cx="80" cy="64" rx="24" ry="10" fill="${a}"/><circle cx="106" cy="54" r="8" fill="${a}"/><rect x="62" y="68" width="5" height="14" fill="${a}"/><rect x="95" y="68" width="5" height="14" fill="${a}"/>`;
  return `<svg class="bw-poza" viewBox="0 0 160 96" role="img" aria-label="${String(alt).replace(/"/g,'&quot;')}"><rect width="160" height="96" fill="${c[0]}"/>${id==='marte'?'':`<polygon points="0,96 0,64 40,40 80,66 120,36 160,60 160,96" fill="${c[1]}"/>`}${fig}</svg>`;
}

/* ---------------- adrese, căutare ---------------- */
function norm(a){let s=String(a||'').trim().toLowerCase();s=s.replace(/^https?:\/\//,'').replace(/\/index\.html?$/,'').replace(/\/+$/,'');return ALIAS[s]||s}
function gaseste(a,W){a=norm(a);if(W[a])return a;if(W['www.'+a])return 'www.'+a;if(ALIAS['www.'+a])return ALIAS['www.'+a];return null}
const pareAdresa=v=>{const t=v.trim().replace(/^https?:\/\//,'');if(/\s/.test(v.trim())||!/^[^.\s]+(\.[^.\s/]+)+(\/.*)?$/.test(t))return false;
  return TLD.test(t.split('/')[0].split('.').pop())};
function parseQ(q){
  const s=String(q||''),fr=[];
  /* expresie exactă: ghilimele drepte "…" sau englezești “…” (Bing le ia pe amândouă); „…” (românești) NU */
  const rest=s.replace(/["“]([^"“”„]*)["”“]/g,(m,a)=>{const f=CURAT(a);if(f)fr.push(f);return ' '});
  const ghilRo=/„/.test(s)&&!fr.length;
  const w=CURAT(rest).split(' ').filter(Boolean);
  const toate=CURAT(s.replace(/["“”„]/g,' ')).split(' ').filter(Boolean);
  return {fr,w,ghilRo,toate};
}
function idx(p){return ' '+CURAT([p.titlu,p.site,(p.text||[]).join(' '),p.cuv||''].join(' '))+' '}
function cauta(q,W){
  W=W||SITE;const P=parseQ(q),cuv=P.w.filter(x=>x.length>2||/\d/.test(x)),out=[],reclame=[];
  Object.entries(W).forEach(([a,p])=>{
    if(p.ascunsa)return;
    const t=idx(p),tok=t.trim().split(' ');
    if(P.fr.some(f=>!t.includes(' '+f+' ')))return;
    const potr=cuv.filter(x=>tok.some(y=>y.startsWith(STEM(x)))).length,scor=potr+P.fr.length*3;
    if(!scor)return;
    if(p.reclama){if(potr>=Math.max(1,Math.ceil(cuv.length/2)))reclame.push({a,p,scor});return}
    out.push({a,p,scor});
  });
  const best=Math.max(0,...out.map(r=>r.scor)),prag=Math.max(1,Math.ceil(best*0.6));
  const rez=out.filter(r=>r.scor>=prag).sort((x,y)=>y.scor-x.scor||x.a.localeCompare(y.a));
  return {rez:reclame.slice(0,1).concat(rez),P};
}
/* verificarea unei căutări (testul „cautare” și tipul cautare): {ok, msg} */
function evalCautare(q,c){
  const P=parseQ(q),toate=P.toate;
  if(!String(q||'').trim())return {ok:false,msg:'Nu ai scris nimic de căutat.'};
  /* tasta moartă (US-International): copilul care nu vede ghilimeaua o apasă din nou și iese "" */
  const dubla=/""/.test(String(q))?{ok:false,msg:'Ai două ghilimele lipite: <code>""</code>. Pe unele calculatoare ghilimeaua apare abia odată cu litera de după ea: șterge una dintre ele.'}:null;
  if(c.faraGhilimele&&(P.fr.length||dubla))return {ok:false,msg:c.msgGhil||'Aici caută fără ghilimele: doar cuvintele-cheie.'};
  if(c.fraza){
    const f=CURAT(c.fraza);
    if(!P.fr.includes(f)){
      if(dubla)return dubla;
      if(P.ghilRo)return {ok:false,msg:'Ai scris ghilimele românești „ ”. Motorul nu le ia drept ghilimele: scrie ghilimelele drepte <code>"</code> la început și la sfârșit.'};
      if(P.fr.length)return {ok:false,msg:'Între ghilimele trebuie să fie exact expresia, cu toate cuvintele ei, în ordinea lor.'};
      return {ok:false,msg:'Pune expresia între ghilimele drepte: <code>"</code> la început și <code>"</code> la sfârșit.'};
    }
  }
  const fara=(c.fara||UMPLUTURA).map(N);
  /* cuvintele de umplutură, arătate cum le-a scris elevul (cu diacritice); doar în afara ghilimelelor (expresia exactă rămâne cum e) */
  const rau=String(q).replace(/["“]([^"“”„]*)["”“]/g,' ').replace(/["“”„,.!?;:]/g,' ').split(/\s+/).filter(x=>x&&fara.includes(CURAT(x)));
  if(rau.length)return {ok:false,msg:`Scoate cuvintele care nu spun ce cauți: ${[...new Set(rau.map(x=>x.toLowerCase()))].map(x=>'«'+x+'»').join(', ')}.`};
  if(c.max&&toate.length>c.max)return {ok:false,msg:`Ai scris ${toate.length} cuvinte. Păstrează doar cuvintele importante: cel mult ${c.max}.`};
  if(c.min&&toate.length<c.min)return {ok:false,msg:`Ai scris prea puțin: ${toate.length} ${toate.length===1?'cuvânt':'cuvinte'}. Spune și despre cine e vorba, și ce vrei să afli.`};
  for(const g of (c.are||[])){const v=[].concat(g).map(x=>CURAT(x));if(!v.some(x=>toate.some(y=>y.startsWith(STEM(x)))))return {ok:false,msg:c.msgAre||'Lipsește un cuvânt-cheie: despre cine e vorba sau ce vrei să afli.'}}
  return {ok:true,msg:''};
}

const SVG={
 back:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 5l-7 7 7 7"/></svg>',
 fwd:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg>',
 reload:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>'
};
const SFAT={back:'Faceți clic pentru a merge înapoi (Alt+Săgeată la stânga), țineți apăsat pentru a vedea istoricul',
 fwd:'Faceți clic pentru a merge înainte, țineți apăsat pentru a vedea istoricul',reload:'Reîmprospătați (Ctrl+R)',tab:'Filă nouă (Ctrl+T)'};
const FILTRE=[['toate','Toate'],['imagini','Imagini'],['video','Videoclipuri'],['stiri','Știri']];

function creeaza(opt){
  opt=opt||{};
  const EXT=opt.extensii||[];
  const lume=Q=>Object.assign({},SITE,opt.site||{},Q.site||{});
  function stareNoua(Q){
    const W=lume(Q);
    /* start: un șir = o filă; o listă = mai multe file; în listă, un șir = o pagină, o listă = istoricul filei (ultima = afișată) */
    const tabs=[].concat(Q.start==null?'nou':Q.start)
      .map(x=>{const h=[].concat(x).map(y=>y==='lectie'?LECTIE:y==='nou'||/^(cauta|eroare):/.test(y)?y:(gaseste(y,W)||'eroare:'+y));return {h,p:h.length-1}});
    return {W,tabs,act:Q.activa!=null?Q.activa:tabs.length-1,inchisa:false,lectieInchisa:false,cautari:[],dinRez:new Set(),dinLink:new Set(),tastate:new Set(),
      inapoi:0,inainte:0,reimp:0,fileNoi:0,inchise:0,rasp:'',msg:'',rau:false,filtru:{},incarcare:0};
  }
  return {
  render(Q,body,api){
    css();
    const esc=api.esc;
    let S=stareNoua(Q);
    body.innerHTML=`<div class="bw">
      <div class="bw-win" tabindex="-1" aria-label="Browserul din pagină"></div>
      <p class="bw-nota">Un browser mic, cu site-uri inventate. Aici folosești butoanele <b>+</b> și <b>×</b>: tastele Ctrl+T și Ctrl+W ar lucra pe browserul tău adevărat, nu pe cel din pagină. <button type="button" class="bw-ghil" data-reset="1">Ia-o de la capăt</button></p>
      ${Q.ghilimele?`<p class="bw-nota"><button type="button" class="bw-ghil" data-ghil="1">Scrie "</button> pune o ghilimea dreaptă acolo unde e cursorul (pe telefon o găsești și pe tastatura cu semne).</p>`:''}
      ${Q.raspuns?`<div class="bw-panou"><label class="lbl" for="bw-r-${Q.raspuns.id||'r'}">${esc(Q.raspuns.eticheta||'Răspunsul tău')}</label><input id="bw-r-${Q.raspuns.id||'r'}" class="bw-rasp" type="text" autocomplete="off" spellcheck="false"></div>`:''}
      <div class="bw-ext"></div>
      <div class="bw-panou"><div class="lbl">Teste — se bifează singure când faci ce trebuie</div><ul class="bw-teste"></ul></div>
    </div>`;
    const root=body.querySelector('.bw'),win=root.querySelector('.bw-win'),testeEl=root.querySelector('.bw-teste'),extEl=root.querySelector('.bw-ext');
    let ultimInput=null,faraSelectie=false;
    const T=()=>S.tabs[S.act],cur=(t=T())=>t?t.h[t.p]:null;
    const ev=(tip,d)=>{try{body.dispatchEvent(new CustomEvent('browser-web',{bubbles:true,detail:Object.assign({tip},d||{})}))}catch(e){}};
    const ctx=()=>({S,Q,esc,adresa:cur(),pagina:S.W[cur()],go:a=>go(a),draw,msg:t=>{S.msg=t;S.rau=false},ev});
    function go(a,cum){const t=T();if(!t)return;t.h=t.h.slice(0,t.p+1);t.h.push(a);t.p=t.h.length-1;S.msg='';S.rau=false;S.incarcare++;
      if(cum==='tastat'&&S.W[a])S.tastate.add(a);if(cum==='link')S.dinLink.add(a);if(cum==='rez')S.dinRez.add(a);ev('nav',{adresa:a,fila:S.act})}
    function doCauta(q){q=String(q).trim();if(!q)return;S.cautari.push(q);go('cauta:'+q);ev('cautare',{q})}
    function omni(v,cum){v=String(v||'').trim();if(!v)return;
      const a0=/\s/.test(v)?null:gaseste(v,S.W);if(a0){go(a0,cum);return}
      if(pareAdresa(v)){
        /* site cunoscut, pagină necunoscută => pagina „nu există” a site-ului; site necunoscut => eroarea lui Edge (adresa rămâne întreagă în bară) */
        const n=norm(v),host=n.split('/')[0],h2=Object.keys(S.W).find(k=>k.split('/')[0]===host||k.split('/')[0]==='www.'+host);
        go(h2?'lipsa:'+n:'eroare:'+n,cum)}else doCauta(v)}
    function filaNoua(){if(S.inchisa){S.inchisa=false;S.tabs=[]}S.tabs.push({h:['nou'],p:0});S.act=S.tabs.length-1;S.fileNoi++;S.msg='';ev('fila',{fila:S.act})}
    function inchide(i){const t=S.tabs[i];if(!t)return;if(cur(t)===LECTIE)S.lectieInchisa=true;S.tabs.splice(i,1);S.inchise++;
      if(!S.tabs.length){S.inchisa=true;S.act=-1}else if(S.act>=S.tabs.length)S.act=S.tabs.length-1;else if(i<S.act)S.act--;
      ev('inchide',{fila:i})}
    function inapoi(){const t=T();if(t&&t.p>0){t.p--;S.inapoi++;S.msg='';S.incarcare++;ev('inapoi',{adresa:cur()})}}
    function inainte(){const t=T();if(t&&t.p<t.h.length-1){t.p++;S.inainte++;S.msg='';S.incarcare++;ev('inainte',{adresa:cur()})}}
    function reimp(){if(!T())return;S.reimp++;S.incarcare++;S.msg='Pagina s-a încărcat din nou.';S.rau=false;ev('reimprospatare',{adresa:cur()})}
    const titluFila=a=>a==='nou'?'Filă nouă':a.startsWith('cauta:')?a.slice(6)+' - Căutare':a.startsWith('eroare:')?a.slice(7).split('/')[0]:a.startsWith('lipsa:')?'Pagina nu există':(S.W[a]?S.W[a].titlu:a);
    const adresaAfis=a=>a==='nou'?'':a.startsWith('learninghub-')?'https://'+a+'/':a.startsWith('lipsa:')?'https://'+a.slice(6):a.startsWith('cauta:')?'https://'+MOTOR+'/cautare?q='+encodeURIComponent(a.slice(6)).replace(/%20/g,'+'):a.startsWith('eroare:')?a.slice(7):'https://'+a;
    function rezultat(x,p){
      const host=x.split('/')[0],rest=x.split('/').slice(1).filter(Boolean);
      return `<div class="bw-rez">${p.reclama?'<div class="bw-spons">Sponsorizat</div>':''}
        <div class="bw-rsite"><span class="ic" aria-hidden="true">${esc((p.site||host)[0])}</span><span><b>${esc(p.site||host)}</b><br><span class="bw-radr">https://${esc(host)}${rest.length?' › '+rest.map(esc).join(' › '):''}</span></span></div>
        <button type="button" class="bw-rt" data-act="rez" data-v="${esc(x)}">${esc(p.titlu)}</button>
        <div class="bw-rd">${esc((p.text||[]).join(' ').slice(0,150))}${(p.text||[]).join(' ').length>150?' …':''}</div></div>`;
    }
    function pagina(a){
      if(a==='nou')return `<div class="bw-nou"><form class="bw-sf" data-f="nou"><input type="text" aria-label="Căutați sau introduceți adresa web" placeholder="Căutați sau introduceți adresa web" autocomplete="off" spellcheck="false" enterkeyhint="go"><button type="submit">Caută</button></form>
        <p class="bw-mic">Fila nouă. Poți scrie și sus, în bara de adrese: cursorul e deja acolo.</p></div>`;
      if(a.startsWith('lipsa:'))return `<div class="bw-err"><h3>Pagina nu există</h3><p>Site-ul <b>${esc(a.slice(6).split('/')[0])}</b> nu are pagina <b>${esc(a.slice(6))}</b>. Verifică adresa literă cu literă.</p></div>`;
      if(a.startsWith('eroare:'))return `<div class="bw-err"><h3>Hmm... nu se poate accesa această pagină</h3><p>Verificați dacă există o eroare de ortografie în <b>${esc(a.slice(7).split('/')[0])}</b>.</p><button type="button" class="bw-btn" data-act="reload">Reîmprospătare</button></div>`;
      if(a.startsWith('cauta:')){
        const q=a.slice(6),{rez,P}=cauta(q,S.W),f=S.filtru[a]||'toate';
        const lista=f==='toate'?rez:f==='imagini'?rez.filter(r=>r.p.poza&&!r.p.reclama):rez.filter(r=>!r.p.reclama&&(r.p.fel===(f==='video'?'video':'stire')));
        return `<div class="bw-motor"><span class="sigla">Căutare</span><form class="bw-sf sus" data-f="cauta" style="flex:1 1 220px;margin:0"><input type="text" aria-label="Caseta de căutare" value="${esc(q)}" autocomplete="off" spellcheck="false" enterkeyhint="search"><button type="submit">Caută</button></form></div>
          <div class="bw-filtre" role="tablist" aria-label="Felul rezultatelor">${FILTRE.map(([k,t])=>`<button type="button" role="tab" aria-selected="${k===f}" class="${k===f?'on':''}" data-act="filtru" data-v="${k}">${t}</button>`).join('')}</div>
          ${P.ghilRo?'<p class="bw-mic">Ai scris ghilimele românești „ ”: motorul nu le ia drept ghilimele, deci caută cuvintele oriunde în pagină.</p>':''}
          ${!lista.length?`<p>Nu am găsit ${f==='toate'?'pagini':'rezultate de acest fel'} pentru <b>${esc(q)}</b>. Verifică literele sau încearcă alte cuvinte-cheie, mai puține.</p>`
           :f==='imagini'?`<div class="bw-poze">${lista.map(({a:x,p})=>`<button type="button" data-act="rez" data-v="${esc(x)}">${poza(p.poza,p.titlu)}<span>${esc(p.site)}</span></button>`).join('')}</div>`
           :lista.map(({a:x,p})=>rezultat(x,p)).join('')}`;
      }
      const p=S.W[a];if(!p)return '';
      let h=`<div class="bw-site">${esc(p.site||'')}${p.reclama?' · reclamă':''}</div><h3 class="bw-h">${esc(p.titlu)}</h3>${p.poza?`<div style="max-width:260px">${poza(p.poza,p.titlu)}</div>`:''}${(p.text||[]).map(t=>`<p>${esc(t)}</p>`).join('')}
        ${p.link?`<div class="bw-lk">${p.link.map(([t,x])=>`<button type="button" class="bw-a" data-act="link" data-v="${esc(x)}">${esc(t)}</button>`).join('')}</div>`:''}`;
      EXT.forEach(e=>{if(e.pagina)h=e.pagina(h,ctx())||h});
      return h;
    }
    function draw(){
      if(S.inchisa){
        win.innerHTML=`<div class="bw-gol"><p>Ai închis ultima filă, deci și fereastra browserului (Edge face la fel).${S.lectieInchisa?' Ai închis și fila lecției: în browserul tău adevărat, lecția s-ar fi închis.':''}</p><button type="button" class="bw-btn" data-act="porneste">Pornește din nou browserul</button></div>`;
      }else{
        const t=T(),a=cur();
        win.innerHTML=`<div class="bw-tabs">${S.tabs.map((x,i)=>`<div class="bw-tab${i===S.act?' on':''}"><button type="button" class="nm" data-act="sel" data-v="${i}" title="${esc(titluFila(cur(x)))}" aria-label="Fila ${esc(titluFila(cur(x)))}${i===S.act?' (deschisă acum)':''}">${esc(titluFila(cur(x)))}</button><button type="button" class="x" data-act="close" data-v="${i}" aria-label="Închideți fila" title="Închideți fila">×</button></div>`).join('')}
          <button type="button" class="bw-plus" data-act="tab" aria-label="Filă nouă" title="${SFAT.tab}">+</button></div>
         <div class="bw-bar">
          <button type="button" class="bw-ico" data-act="back" aria-label="Înapoi" title="${SFAT.back}" ${t.p>0?'':'disabled'}>${SVG.back}</button>
          ${t.p<t.h.length-1?`<button type="button" class="bw-ico" data-act="fwd" aria-label="Înainte" title="${SFAT.fwd}">${SVG.fwd}</button>`:''}
          <button type="button" class="bw-ico" data-act="reload" aria-label="Reîmprospătare" title="${SFAT.reload}">${SVG.reload}</button>
          <form class="bw-adr" data-f="adr"><input type="text" aria-label="Bara de adrese și de căutare" placeholder="Căutați sau introduceți adresa web" value="${esc(adresaAfis(a))}" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"><button type="submit" class="bw-enter" aria-label="Enter (pe telefon, în locul tastei Enter)">Enter ↵</button></form>
         </div>
         <div class="bw-page" data-inc="${S.incarcare}">${pagina(a)}</div>
         ${S.msg?`<div class="bw-msg${S.rau?' rau':''}" aria-live="polite">${S.msg}</div>`:''}`;
      }
      extEl.innerHTML=EXT.map(e=>e.panou?e.panou(ctx())||'':'').join('');
      ticks();
    }
    function test(c){
      const ad=x=>[].concat(x).map(y=>gaseste(y,S.W)||norm(y));
      switch(c.k){
        case 'filaNoua':return S.fileNoi>0;
        case 'file':return !S.inchisa&&S.tabs.length>=(c.min||0)&&(c.max==null||S.tabs.length<=c.max);
        case 'fila':return S.tabs.some(t=>ad(c.a).includes(cur(t)));
        case 'pagina':return !S.inchisa&&ad(c.a).includes(cur());
        case 'vizitat':return S.tabs.some(t=>t.h.some(x=>ad(c.a).includes(x)));
        case 'tastat':return ad(c.a).some(x=>S.tastate.has(x));
        case 'link':return ad(c.a).some(x=>S.dinLink.has(x));
        case 'dinRezultate':return ad(c.a).some(x=>S.dinRez.has(x));
        case 'inapoi':return S.inapoi>0;
        case 'inainte':return S.inainte>0;
        case 'reimprospatat':return S.reimp>0;
        case 'cautare':return S.cautari.some(q=>evalCautare(q,c).ok);
        case 'lectie':return S.tabs.some(t=>cur(t)===LECTIE);
        case 'activaLectie':return !S.inchisa&&cur()===LECTIE;
        case 'inchise':return S.inchise>=(c.min||1);
        case 'raspuns':{const v=CURAT(S.rasp);return !!v&&[].concat(c.are).filter(x=>v.includes(CURAT(x))).length>=(c.minN||1)}
        case 'filtru':return Object.values(S.filtru).includes(c.v);
      }
      for(const e of EXT){if(e.verifica){const r=e.verifica(c,ctx());if(r!=null)return !!r}}
      return false;
    }
    function ticks(){testeEl.innerHTML=(Q.checks||[]).map(c=>`<li class="${test(c)?'ok':''}">${c.ce}</li>`).join('')}
    function aplica(ops){
      (ops||[]).forEach(o=>{const [k,x]=o;
        if(k==='tab')filaNoua();else if(k==='go')omni(x,'tastat');else if(k==='cauta')doCauta(x);
        else if(k==='rez')go(gaseste(x,S.W)||x,'rez');else if(k==='link')go(gaseste(x,S.W)||x,'link');
        else if(k==='back')inapoi();else if(k==='fwd')inainte();else if(k==='reload')reimp();
        else if(k==='sel'){if(S.tabs[x])S.act=x}else if(k==='close')inchide(x);
        else if(k==='filtru'){const a=cur();if(a&&a.startsWith('cauta:'))S.filtru[a]=x}
        else if(k==='raspuns'){S.rasp=x}
        else{for(const e of EXT){if(e.op&&e.op(o,ctx()))break}}
      });
    }
    function run(ops,fresh){if(fresh)S=stareNoua(Q);aplica(ops);const r=root.querySelector('.bw-rasp');if(r)r.value=S.rasp;draw()}
    body._sim={run,stare:()=>S,test};
    root.addEventListener('click',e=>{
      if(e.target.closest('[data-reset]')){run([],true);win.focus({preventScroll:true});return}
      const g=e.target.closest('[data-ghil]');
      /* G1 (judecata 1, V/14): focusul întors în bară NU trebuie să selecteze tot (următoarea literă ar șterge ce era scris) */
      if(g){const i=ultimInput&&root.contains(ultimInput)?ultimInput:win.querySelector('.bw-adr input');if(i){/* G2 (judecata 2, m2): bara neactivă => ca la primul clic în ea: selectează tot, apoi pune ghilimeaua */const act=!i.matches('.bw-adr input')||i.dataset.bwAct==='1';const s=act?(i.selectionStart??i.value.length):0,f=act?(i.selectionEnd??s):i.value.length;i.value=i.value.slice(0,s)+'"'+i.value.slice(f);faraSelectie=true;i.focus();faraSelectie=false;i.setSelectionRange(s+1,s+1)}return}
      const b=e.target.closest('[data-act]');if(!b||!root.contains(b))return;
      const a=b.dataset.act,v=b.dataset.v;
      let handled=false;
      for(const x of EXT){if(x.actiune&&x.actiune(a,v,ctx())){handled=true;break}}
      if(!handled){
        if(a==='tab'){filaNoua();draw();const i=win.querySelector('.bw-adr input');if(i)i.focus({preventScroll:true});return}
        if(a==='porneste'){S.inchisa=false;S.tabs=[];filaNoua();draw();return}
        if(a==='sel'){S.act=+v;S.msg=''}
        else if(a==='close')inchide(+v);
        else if(a==='back')inapoi();else if(a==='fwd')inainte();else if(a==='reload')reimp();
        else if(a==='link')go(v,'link');else if(a==='rez')go(v,'rez');
        else if(a==='filtru'){const c=cur();if(c)S.filtru[c]=v}
      }
      draw();
      /* focusul rămâne în browserul din pagină (Alt+← etc. merg mai departe); pe fila aleasă sau pe butonul apăsat, dacă mai există */
      const t=win.querySelector(a==='close'||a==='sel'?'.bw-tab.on .nm':a==='back'?'[data-act="back"]:not([disabled])':a==='fwd'?'[data-act="fwd"]':a==='reload'?'[data-act="reload"]':null);
      (t||win).focus({preventScroll:true});
    });
    root.addEventListener('submit',e=>{e.preventDefault();const f=e.target,i=f.querySelector('input'),v=i?i.value:'';
      if(f.dataset.f==='adr'||f.dataset.f==='nou')omni(v,'tastat');else if(v.trim())doCauta(v);
      draw();win.focus({preventScroll:true})});
    /* un clic în bara de adrese selectează tot textul (ca în Edge, probat) */
    root.addEventListener('focusout',e=>{const i=e.target,n=e.relatedTarget;if(i.matches&&i.matches('.bw-adr input')&&n&&!(n.closest&&n.closest('[data-ghil]')))delete i.dataset.bwAct});
    root.addEventListener('focusin',e=>{const i=e.target;if(i.tagName==='INPUT'&&i.type==='text')ultimInput=i;
      if(i.matches&&i.matches('.bw-adr input'))i.dataset.bwAct='1';
      if(faraSelectie)return;   /* focusul vine de la butonul „Scrie "”: cursorul rămâne după ghilimea */
      if(i.matches&&i.matches('.bw-adr input')){setTimeout(()=>{try{i.select()}catch(x){}},0);i.addEventListener('mouseup',ev2=>ev2.preventDefault(),{once:true})}});
    /* butonul „Scrie "” nu ia focusul: bara (sau caseta) rămâne cu cursorul unde era, iar tastatura telefonului nu se închide */
    root.addEventListener('mousedown',e=>{if(e.target.closest&&e.target.closest('[data-ghil]'))e.preventDefault()});
    root.addEventListener('input',e=>{if(e.target.classList.contains('bw-rasp')){S.rasp=e.target.value;ticks()}});
    root.addEventListener('keydown',e=>{
      const k=e.key,kl=String(k).toLowerCase();
      if((e.ctrlKey&&kl==='r')||k==='F5'){e.preventDefault();reimp();draw();return}
      if(e.altKey&&k==='ArrowLeft'){e.preventDefault();inapoi();draw();return}
      if(e.altKey&&k==='ArrowRight'){e.preventDefault();inainte();draw();return}
      if((e.ctrlKey&&kl==='l')||(e.altKey&&kl==='d')){const i=win.querySelector('.bw-adr input');if(i){e.preventDefault();i.focus();i.select()}}
      /* Esc în bara de adrese: adresa filei la loc, selectată (Edge: Esc, Esc) */
      if(k==='Escape'&&e.target.matches&&e.target.matches('.bw-adr input')&&!S.inchisa){e.preventDefault();e.target.value=adresaAfis(cur()||'nou');e.target.select();return}
      if(k==='Enter'&&e.target.classList&&e.target.classList.contains('bw-rasp')){e.preventDefault();const b=document.getElementById('chk');if(b)b.click()}
    });
    draw();
    const nav=api.checkButton(()=>{
      const bad=(Q.checks||[]).find(c=>!test(c));ticks();
      if(!bad){nav.innerHTML='';api.resolve(true);win.focus({preventScroll:true});return}
      api.resolve(false,bad.msg||('Testul care nu trece încă: '+bad.ce+'.'));
      win.focus({preventScroll:true});
      api.revealButton(()=>{run(Q.sol,true);nav.innerHTML='';api.giveUp(Q.solText||'am făcut pașii pentru tine în browserul din pagină. Privește filele, bara de adrese și testele: acum trec toate.')});
    },'Verifică');
  },
  rezolva(Q,body){body._sim.run(Q.sol,true);return true},
  gresit(Q,body){body._sim.run(Q.gresit||[],true);return true}
  };
}

const SimBrowserWeb=creeaza({});

const TipCautare={
  render(Q,body,api){
    css();
    body.innerHTML=`<div class="bw"><div class="bw-cq"><label class="bw-nota" style="flex:1 1 100%" for="bw-cq-i">${api.esc(Q.eticheta||'Ce scrii în caseta de căutare:')}</label>
      <input id="bw-cq-i" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" aria-label="${api.esc(Q.eticheta||'Căutarea ta')}">
      ${Q.ghilimele!==false?'<button type="button" class="bw-ghil" data-ghil="1">Scrie "</button>':''}</div>
      ${Q.ghilimele!==false?'<p class="bw-nota">Butonul <b>Scrie "</b> pune o ghilimea dreaptă acolo unde e cursorul.</p>':''}</div>`;
    const inp=body.querySelector('input');
    const g=body.querySelector('[data-ghil]');
    if(g)g.onclick=()=>{const s=inp.selectionStart??inp.value.length,f=inp.selectionEnd??s;inp.value=inp.value.slice(0,s)+'"'+inp.value.slice(f);inp.focus();inp.setSelectionRange(s+1,s+1)};
    if(g)g.addEventListener('mousedown',e=>e.preventDefault());   /* butonul nu ia focusul: cursorul rămâne în casetă */
    /* Enter: verificarea pornește la RIDICAREA tastei. Pe US-International, ghilimeaua (tastă moartă) urmată de Enter ajunge în
       casetă abia după apăsarea lui Enter; oprită la apăsare (keydown + preventDefault), s-ar fi pierdut (judecata 1, V/14, M3). */
    let enterJos=false;
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing)enterJos=true});
    inp.addEventListener('keyup',e=>{if(e.key==='Enter'&&enterJos){enterJos=false;const b=document.getElementById('chk');if(b&&!inp.readOnly)b.click()}});
    const nav=api.checkButton(()=>{
      const r=evalCautare(inp.value,Q);
      if(r.ok){inp.readOnly=true;nav.innerHTML='';api.resolve(true);return}
      api.resolve(false,r.msg);inp.focus({preventScroll:true});
      api.revealButton(()=>{inp.value=Q.ok;inp.readOnly=true;nav.innerHTML='';api.giveUp(`<code>${api.esc(Q.ok)}</code>`)});
    });
  },
  rezolva(Q,body){body.querySelector('input').value=Q.ok;return true},
  gresit(Q,body){body.querySelector('input').value=Q.tipic||'';return true}
};

window.SimBrowserWeb=SimBrowserWeb;
window.TipCautare=TipCautare;
window.BrowserWeb={versiune:1,SITE,creeaza,cauta,parseQ,norm,evalCautare,LECTIE,MOTOR};
})();
