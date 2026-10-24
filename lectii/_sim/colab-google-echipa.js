/* Extensia „echipa” pentru simulatorul Google (lectii/_sim/colab-google.js) — fișier comun
   (lectii/_sim/colab-google-echipa.js).
   PROPRIETAR: autorul lecției VII · M3 · nr. 19 („Instrumente de lucru: documente și prezentări în colaborare”), 24.10.2026.
   NU schimbă colab-google.js (proprietar VII/18): se înregistrează cu SimColabGoogle.extensie('echipa', fn) și desenează
   doar în sloturile lui ('doc-pagina', 'doc-lateral', 'doc-bara'), în cârligul `partajare` și într-o fereastră a ei,
   pusă peste simulator. Clasele CSS sunt toate `cge-*`.

   CE SIMULEAZĂ (desen, nu Google adevărat; numele din ajutorul Google în română, surse: lectii/vii/m3-l19/surse.md):
     - fereastra „Permite accesul” (Share): adresa colegului (cu destinatari sugerați din „școală”), rolul Cititor /
       Comentator / Editor, „Notifică persoanele”, mesajul, Trimite; „Persoane cu acces” (Proprietar, rolurile,
       „Elimină accesul”); „Acces general”: Restricționat / Oricine are linkul; Copiază linkul, Gata;
     - documentul ca paragrafe cu autor: colegii simulați (alt nume, cursor colorat cu numele lor) intră și scriu
       singuri în paragraful lor, cât lucrezi tu; Enter la sfârșitul unui paragraf face un paragraf nou, al tău;
     - comentariile, în dreapta: selectezi textul → „Adaugă un comentariu” (bara de instrumente, sau Ctrl+Alt+M) →
       scrii → „Comentează”; clic pe comentariu → „Răspunde”; „✓ Rezolvă” îl închide;
     - prezentarea: slide-urile în stânga, slide-ul ales cu caseta de titlu și caseta de text; „Slide nou” (sau Ctrl+M)
       adaugă după slide-ul ales un slide cu același aspect; colegii își fac singuri slide-urile lor.
   REPARAȚIA DUPĂ JUDECATA 1 (24.10.2026; API-ul vechi rămâne, doar adaosuri):
     - colegii simulați fac DOAR ce le dă voie rolul lor de ACUM (Editor = tot; Comentator = intră, comentează, răspund;
       Cititor / fără acces = nimic); un rol schimbat din „Persoane cu acces” (sau cu seteazaRol) le reia coada cu pașii rămași;
     - comentariul PE ALEGERE: dacă Q are `variante:[{text, ok, dece}]`, caseta comentariului arată variantele scrise (în loc
       de scrisul liber), iar testul `comentat` trece doar cu o variantă ok:true și fără una nepotrivită rămasă deschisă (motivul
       ei apare sub test); colegul simulat răspunde cu `text` doar unui comentariu potrivit (`textNepotrivit`, altfel tace);
     - tastele ca în Documente Google: Ctrl+A alege TOT documentul (și rândurile colegilor; Delete sau o literă le șterg),
       Ctrl+Home / Ctrl+End, săgețile trec dintr-un paragraf în altul, Backspace la început / Delete la sfârșit unesc
       paragrafele (și cu al colegului: atunci textul lui s-a schimbat);
     - după un „Verifică” respins, focusul se întoarce în ultimul câmp în care ai lucrat (inst.echipa.focusLaLucru()),
       niciodată în bara de adrese.
   ROLUL TĂU la un fișier primit (opțiunea `rolMeu` a fișierului): Editor = scrii și comentezi; Comentator = doar
   comentezi (în desen nu poți scrie: în aplicația adevărată, ce scrie un comentator devine sugestie — lecția 20,
   și pagina o spune); Cititor = doar citești.

   SIGURANȚA (ca la colab-google.js): nimic nu se scrie în localStorage / sessionStorage / cookie și nu pleacă în rețea;
   câmpurile sunt <input type="text"> / <textarea> / blocuri contenteditable, fără <form>, fără `name`, cu autocomplete /
   autocorrect / autocapitalize / spellcheck oprite. Persoanele și adresele sunt INVENTATE (domeniul .test).

   CUM SE FOLOSEȘTE:
     <script src="../../_sim/colab-google.js"></script><script src="../../_sim/colab-google-echipa.js"></script>
     SimColabGoogle.creeaza(el, {extensii:['echipa'], …opțiunile lui colab-google…, echipa:{…}})
     sau, în motor: tipuri:{echipa:SimColabEchipa.echipa}  (tipul pune singur extensii:['echipa']).
   Câmpuri în plus pe FIȘIERE (opțiunea `fisiere` a lui colab-google; restul câmpurilor rămân ale lui):
     paragrafe  [{autor:'eu'|'radu'|adresă, text}]       documentul (tip 'doc'); fără ele: rândurile din `text`, ale proprietarului
     comentarii [{autor, text, la:{autor, text}, raspunsuri?:[{autor,text}], rezolvat?}]   firele de comentarii
     slides     [{autor, titlu, text}]                   prezentarea (tip 'prez'); fără ele: un slide gol al proprietarului
     acces      [{cine:'radu'|adresă, rol:'cititor'|'comentator'|'editor'}]   cine are deja acces (în afară de proprietar)
     general    'restrictionat' (implicit) | 'link'
     rolMeu     rolul contului tău la un fișier primit (implicit 'editor')
     scenariu   [{cine, cand:'deschis'|'partajat'|'comentat', fa:'intra'|'scrie'|'comenteaza'|'raspunde'|'slide'|'iese',
                  text?, titlu?, la?:{autor, text}, pauza?:ms}]   ce fac colegii simulați (pe rând, fiecare în coada lui)
   Opțiunea `echipa` a simulatorului: {persoane?:[…] (agenda școlii pentru destinatarii sugerați; implicit PERSOANE),
     viteza?:ms pe literă (implicit 55), scenariuNou?:{doc:[…], prez:[…]} (scenariul fișierelor făcute cu Nou)}.
   API pe instanță: inst.echipa = {stare(), model(id), on(nume, fn), jurnal(), deschideDialog(id?), inchideDialog(),
     partajeaza(id, adresa, rol), seteazaRol(id, adresa, rol), general(id, 'restrictionat'|'link'), scrieParagraf(text, id?),
     atinge(autor, text, id?), comenteaza(autorulTextului, text, id?), raspunde(autorulFirului, text, id?),
     rezolva(autorulFirului, id?), slideNou(id?), scrieSlide(titlu, text, id?), laDrive(), deschide(id), grabeste(),
     persoana(cheie|adresă)}.  Evenimente: 'dialog', 'partajat', 'rol', 'general', 'scris', 'atins', 'comentat',
     'raspuns', 'rezolvat', 'slide', 'coleg', 'schimbare'.
   TIPUL pentru motor: echipa — Q {sim:{…}, teste:[{c, v?, d?, ce?, m?}], gresit?, arata?, buton?}. Testele (TESTE, aici):
     partajat {v:{cine, rol, fisier?}}, doarEchipa {v:['radu',…]}, restrictionat, deschis {v:id}, paragraf {v:cuvinte},
     neatins, comentat {v:'ioana'?}, raspuns {v:'radu'}, rezolvat {v:'radu'}, prezentare {v:titlu?}, slide {v:număr};
     orice altă cheie se ia din SimColabGoogle.TESTE (conectat, titlu, distribuite, iesit, verificat, fereastra…).
     Rezolvarea automată face testele ÎN ORDINEA din `teste`. gresit: {sari:'cheie'} | {adresa:'…'} | {rol:'…'} |
     {general:'link'} | {atinge:'radu'} | {strain:'adresă'}.
   NU SCHIMBAȚI (VII/20, VII/22 se pot sprijini pe ele): numele testelor și forma lui Q, câmpurile fișierelor de mai sus,
   regula „nimic nu se salvează, nimic nu pleacă”. Un lucru nou = extensie nouă, cu nume nou.
   Trecerea 3 (24.10.2026, după judecata 2) — API-ul NU se schimbă: persoanele au în plus câmpul opțional `dat` (genitiv-dativul,
   „Ioanei Rusu”); tot ce scrie simulatorul despre o persoană (etichetele testelor, mesajele, aria-label) îl folosește, iar fără el
   se aplică regula prenumelui (AC). „Elimină accesul” / seteazaRol fără rol scot colegul din fișier, ca pasul `iese` (AG); un coleg
   căruia i s-a șters paragraful cât scria (Ctrl+A + Delete) scrie mai departe într-un paragraf nou. */
(function(){
'use strict';
const G=window.SimColabGoogle;
if(!G){if(window.console)console.error('colab-google-echipa.js: încarcă întâi lectii/_sim/colab-google.js');return}
const STIL_CSS=`
.cge-pag{flex:1;min-width:0;max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:8px}
.cge-banda{margin:0;padding:6px 10px;border-radius:6px;background:var(--paper);border:1px dashed var(--line);font-size:.85rem;color:var(--ink2)}
.cge-hartie{background:var(--paper);border:1px solid var(--line);box-shadow:0 1px 4px rgba(0,0,0,.12);min-height:220px;padding:16px 18px;box-sizing:border-box}
.cge-bloc{position:relative;min-height:1.6em;padding:2px 3px;margin:0 0 8px;border-radius:3px;line-height:1.55;outline:none;white-space:pre-wrap;word-break:break-word;font-size:1rem}
.cge-bloc:focus{background:var(--paper2)}
.cge-bloc[contenteditable="false"]{cursor:default}
.cge-cur{position:relative;display:inline-block;width:0;height:1.25em;vertical-align:text-bottom;border-left:2px solid var(--cc,#188038);margin-left:1px}
.cge-cur .cge-et{position:absolute;left:-2px;bottom:100%;white-space:nowrap;font-size:.68rem;line-height:1.3;padding:0 4px;border-radius:3px 3px 3px 0;background:var(--cc,#188038);color:#fff;font-weight:700;pointer-events:none;user-select:none}
.cge-anc{background:#FFE7A0;color:#1F1F1F;border-bottom:2px solid #F2B600}
.cge-anc.on{background:#FFD24D}
.cge-tb{margin-left:auto;display:inline-flex;align-items:center;gap:4px;min-height:36px;padding:0 10px!important;border:1px solid var(--line)!important;border-radius:18px!important;background:var(--paper)!important;font-weight:600;white-space:nowrap}
.cge-tb.st{margin-left:0;margin-right:4px}
.cge-av{flex:none;display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--cc,#1A73E8);color:#fff;font-size:.78rem;font-weight:800}
.cge-avs{display:flex;align-items:center;gap:2px}
.cge-avs .cge-av{border:2px solid var(--paper);margin-left:-6px}
.cge-avs .cge-av:first-child{margin-left:0}
.cge-com{display:flex;flex-direction:column;gap:8px;font-size:.88rem}
.cge-com-cap{font-weight:700}
.cge-fir{border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--paper);cursor:pointer}
.cge-fir.on{box-shadow:0 2px 8px rgba(0,0,0,.18);border-color:var(--accent);cursor:default}
.cge-fir-sus{display:flex;align-items:center;gap:6px}
.cge-fir-sus .cge-cine{flex:1;min-width:0;line-height:1.2}
.cge-fir-sus small{display:block;color:var(--ink2);font-size:.75rem}
.cge-rezolva{min-height:34px;min-width:34px;padding:0 8px;border:1px solid var(--line);border-radius:17px;background:var(--paper);cursor:pointer;font-weight:700;white-space:nowrap;color:var(--accent)}
.cge-citat{margin:6px 0 2px;padding:2px 6px;border-left:3px solid #F2B600;color:var(--ink2);font-size:.82rem;word-break:break-word}
.cge-ct{margin:4px 0 0;word-break:break-word}
.cge-r{display:flex;gap:6px;margin-top:8px;padding-top:6px;border-top:1px solid var(--line)}
.cge-r p{margin:0;word-break:break-word}
.cge-ta{width:100%;min-height:60px;margin-top:8px;padding:6px 8px;border:2px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;box-sizing:border-box;resize:vertical}
.cge-ta:focus{outline:none;border-color:var(--accent)}
.cge-bt{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:8px}
.cge-sec2{min-height:36px;padding:4px 14px;border:1px solid var(--line);border-radius:18px;background:var(--paper);color:var(--accent);font-weight:700;cursor:pointer}
.cge-link{min-height:32px;padding:4px 2px;border:0;background:none;color:var(--accent);font-weight:700;cursor:pointer}
.cge-nota{margin:0;font-size:.8rem;color:var(--ink2)}
.cge-ov{position:absolute;inset:0;z-index:20;background:rgba(0,0,0,.35);display:flex;align-items:flex-start;justify-content:center;padding:10px;box-sizing:border-box;overflow:auto}
.cge-dlg{width:min(520px,100%);background:var(--paper);color:var(--ink);border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.3);padding:14px 16px;box-sizing:border-box}
.cge-dlg h3{margin:0 0 10px;font-size:1.2rem;font-weight:500;word-break:break-word}
.cge-adr{display:block}
.cge-adr>span{display:block;font-size:.82rem;color:var(--ink2);margin-bottom:4px}
.cge-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;min-height:46px;padding:4px 8px;border:2px solid var(--line);border-radius:6px;background:var(--paper)}
.cge-chips:focus-within{border-color:var(--accent)}
.cge-chip{display:inline-flex;align-items:center;gap:4px;max-width:100%;padding:2px 2px 2px 10px;border:1px solid var(--line);border-radius:16px;background:var(--paper2);font-size:.85rem;word-break:break-all}
.cge-chip button{min-width:32px;min-height:32px;border:0;border-radius:16px;background:transparent;cursor:pointer}
.cge-in{flex:1;min-width:150px;min-height:36px;margin:0;padding:0 4px;border:0!important;border-radius:0;box-shadow:none!important;background:transparent;color:var(--ink);font:inherit;font-size:1rem;outline:none!important}
.cge-sug{display:flex;flex-direction:column;gap:2px;margin-top:4px}
.cge-sug:empty{display:none}
.cge-s{display:flex;align-items:center;gap:8px;width:100%;min-height:44px;padding:4px 8px;border:1px solid var(--line);border-radius:8px;background:var(--paper);cursor:pointer;text-align:left;color:var(--ink)}
.cge-s:hover,.cge-s:focus{background:var(--sel)}
.cge-s small{display:block;color:var(--ink2);word-break:break-all}
.cge-err{min-height:1.2em;margin:6px 0;font-size:.85rem;color:var(--bad)}
.cge-ok{color:var(--ok)}
.cge-rand{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0}
.cge-rand>span{font-size:.88rem}
.cge-sel{min-height:40px;padding:4px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-size:.92rem;max-width:100%}
.cge-cb{display:flex;align-items:center;gap:8px;min-height:36px;font-size:.9rem;cursor:pointer}
.cge-cb input{width:20px;height:20px}
.cge-msg{width:100%;min-height:54px;padding:6px 8px;border:2px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;box-sizing:border-box}
.cge-tit{margin:12px 0 4px;font-weight:700;font-size:.95rem}
.cge-pr{display:flex;align-items:center;gap:8px;min-height:44px;padding:2px 0;border-bottom:1px solid var(--line)}
.cge-pr .n{flex:1;min-width:0;line-height:1.2}
.cge-pr .n small{display:block;color:var(--ink2);word-break:break-all;font-size:.78rem}
.cge-pr .r0{font-size:.85rem;color:var(--ink2)}
.cge-gen{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.cge-gen small{flex-basis:100%;color:var(--ink2)}
.cge-desen{margin:10px 0 0;font-size:.76rem;color:var(--ink2)}
.cge-toast{margin:0;padding:6px 10px;border-radius:6px;background:var(--okbg);color:var(--ink);font-size:.86rem;border:1px solid var(--ok)}
.cge-prez{flex:1;min-width:0;display:flex;gap:10px;align-items:flex-start}
.cge-mini{flex:0 0 120px;display:flex;flex-direction:column;gap:6px;max-height:340px;overflow:auto;padding:2px}
.cge-th{display:flex;gap:4px;align-items:flex-start;width:100%;min-height:58px;padding:3px;border:2px solid var(--line);border-radius:6px;background:var(--paper);cursor:pointer;text-align:left;color:var(--ink);font-size:.68rem;line-height:1.2;overflow:hidden}
.cge-th.on{border-color:#F2B600}
.cge-th b{flex:none;font-size:.75rem}
.cge-th .tt{display:block;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:84px}
.cge-th .tx{display:block;overflow:hidden;max-height:2.4em}
.cge-th .ba{display:block;height:3px;border-radius:2px;margin-top:3px;background:var(--cc,#1A73E8)}
.cge-scena{flex:1;min-width:0}
.cge-slide{position:relative;aspect-ratio:16/9;width:100%;background:#fff;color:#1F1F1F;border:1px solid var(--line);box-shadow:0 1px 4px rgba(0,0,0,.15);padding:5% 6%;box-sizing:border-box;display:flex;flex-direction:column;gap:10px}
.cge-cas{position:relative;border:1px dashed #9AA0A6;border-radius:3px;padding:4px 6px;outline:none;white-space:pre-wrap;word-break:break-word;min-height:1.6em}
.cge-cas:focus{border:1px solid #1A73E8}
.cge-cas:empty::before{content:attr(data-ph);color:#80868B;font-style:italic;font-weight:400;font-size:.85rem}
.cge-cas-t{font-size:clamp(1rem,3.6vw,1.6rem);font-weight:700}
.cge-cas-x{flex:1;font-size:clamp(.85rem,2.6vw,1.05rem)}
.cge-sl-info{margin:6px 0 0;font-size:.8rem;color:var(--ink2)}
.cge-hartie:focus,.cge-scena:focus{outline:none}
.cge-hartie.cge-tot .cge-bloc{background:#C8DAFC;color:#1F1F1F}
.cge-vars{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.cge-var{display:flex;gap:8px;align-items:flex-start;min-height:40px;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--paper);cursor:pointer;line-height:1.35;box-sizing:border-box}
.cge-var input{flex:none;width:20px;height:20px;margin:1px 0 0}
.cge-var.on{border-color:var(--accent);background:var(--sel)}
@media (max-width:560px){
 .cge-prez{flex-direction:column}
 .cge-mini{flex:none;flex-direction:row;max-height:none;overflow-x:auto;width:100%}
 .cge-th{flex:0 0 96px}
 .cge-hartie{padding:12px}
 .cge-tb{margin-left:0;white-space:normal;text-align:left}
 .cg-unelte{flex-wrap:wrap}
 .cg-doc-sus .cg-drpt{flex-wrap:wrap;justify-content:flex-end}
}
`;
function stil(){if(document.getElementById('cge-stil'))return;const s=document.createElement('style');s.id='cge-stil';s.textContent=STIL_CSS;document.head.appendChild(s)}
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fd=G.faraDiacritice;
const sp=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();
const cuvinte=s=>sp(s).split(' ').filter(w=>/[A-Za-z0-9ĂÂÎȘȚăâîșțŞşŢţ]/.test(w)).length;
const ATR='autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore data-form-type="other"';
const ATINGERE=()=>(('ontouchstart' in window)||(window.matchMedia&&window.matchMedia('(pointer:coarse)').matches));
const RE_ADR=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOM=G.DOMENIU,C=G.CONTURI;

/* ---------------- agenda școlii (inventată; „destinatarii sugerați” din fereastra de partajare) ---------------- */
const PERSOANE={
  ana:{cheie:'ana',adresa:C.ana.adresa,nume:'Ana Pop',dat:'Anei Pop',culoare:'#1A73E8'},
  radu:{cheie:'radu',adresa:C.radu.adresa,nume:'Radu Ene',dat:'lui Radu Ene',culoare:'#188038'},
  ioana:{cheie:'ioana',adresa:C.ioana.adresa,nume:'Ioana Rusu',dat:'Ioanei Rusu',culoare:'#9334E6'},
  profesor:{cheie:'profesor',adresa:'profesor.tic@'+DOM,nume:'Profesorul de TIC',dat:'profesorului de TIC',culoare:'#B3261E'},
  radu2:{cheie:'radu2',adresa:'radu.enescu@'+DOM,nume:'Radu Enescu',dat:'lui Radu Enescu',culoare:'#B06000'},
  ioana2:{cheie:'ioana2',adresa:'ioana.rusu2@'+DOM,nume:'Ioana Rusu',dat:'Ioanei Rusu',culoare:'#00796B'},
  mara:{cheie:'mara',adresa:'mara.dinu@'+DOM,nume:'Mara Dinu',dat:'Marei Dinu',culoare:'#C2185B'}};
/* genitiv-dativul unei persoane, pentru tot ce scrie simulatorul singur („acces lui Radu Ene”, „acces Ioanei Rusu”,
   „profesorului de TIC”, „Paragraful Anei Pop”) — trecerea 3 (24.10.2026, AC). Întâi câmpul `dat` al persoanei (agenda de mai
   sus îl are la toți); fără el, regula prenumelui românesc: -ea → -ei (Andreea → Andreei), -ca / -ga → -căi / -găi (Bianca →
   Biancăi), alt -a → -ei (Ana → Anei, Maria → Mariei); prenumele bărbătești în -a (Luca, Mihnea…) și restul → „lui …” */
const MASC_A=['Luca','Mihnea','Toma','Mircea','Horia','Sava','Costea','Badea','Ilia','Nicola'];
function datNume(n){const s=String(n||'').trim();if(!s)return s;const w=s.split(/\s+/),f=w[0];
  if(f.length>2&&/a$/.test(f)&&MASC_A.indexOf(f)<0){w[0]=/ea$/.test(f)?f.slice(0,-1)+'i':/[cg]a$/.test(f)?f.slice(0,-1)+'ăi':f.slice(0,-1)+'ei';return w.join(' ')}
  return 'lui '+s}
const datP=p=>(p&&p.dat)||datNume(p&&p.nume);
/* „numele lui” / „numele ei”, după aceeași formă */
const luiEi=p=>/^lui |ului\b/.test(datP(p))?'lui':'ei';
const ROLURI=[{id:'cititor',nume:'Cititor',en:'Viewer'},{id:'comentator',nume:'Comentator',en:'Commenter'},{id:'editor',nume:'Editor',en:'Editor'}];
const numeRol=id=>id==='proprietar'?'Proprietar':((ROLURI.find(r=>r.id===id)||{}).nume||id);
const POATE={editor:'scrii, comentezi și poți da acces altora',comentator:'poți doar să comentezi; textul nu-l schimbi',cititor:'poți doar să citești'};
const ini=n=>(fd(n||'?').trim().charAt(0)||'?').toUpperCase();
/* genitivul pentru texte („textul lui Radu”, „textul Ioanei”) */
const GEN={eu:'tău',ana:'Anei',radu:'lui Radu',ioana:'Ioanei',profesor:'profesorului',mara:'Marei'};
/* un singur ascultător de selecție pentru toate instanțele (se scot la distruge) */
const SELECTII=new Set();
document.addEventListener('selectionchange',()=>SELECTII.forEach(f=>{try{f()}catch(e){}}));

function extensie(inst,O){
  stil();
  const E=O.echipa||{};
  const DIR=(E.persoane||Object.values(PERSOANE)).map(p=>Object.assign({},p));
  const VITEZA=E.viteza==null?55:E.viteza;
  const VAR=Array.isArray(E.variante)&&E.variante.length?E.variante:null;   /* comentariul pe alegere (Q.variante, pus de tipul `echipa`) */
  const eu=()=>inst.cont();
  const dupaAdr=a=>DIR.find(p=>p.adresa.toLowerCase()===String(a||'').toLowerCase())||Object.values(PERSOANE).find(p=>p.adresa.toLowerCase()===String(a||'').toLowerCase());
  function per(k){
    if(k==null||k==='eu'){const c=eu();const p=dupaAdr(c.adresa);return p||{cheie:'eu',adresa:c.adresa,nume:c.nume,culoare:'#1A73E8'}}
    if(typeof k==='object')return k;
    return PERSOANE[k]||dupaAdr(k)||{cheie:k,adresa:k,nume:k,culoare:'#5F6368'}}
  const euAdr=()=>eu().adresa;
  let M={},pagini={},laterale={},pend=[],rapid=false,dlg=null,ov=null,bara=null,ultimaSel=null,nrId=0;
  const asc={},J=[];
  function emite(n,d){J.push({n,d:d||{}});(asc[n]||[]).concat(asc['*']||[]).forEach(f=>{try{f(n,d||{})}catch(e){}});
    if(n!=='schimbare')(asc.schimbare||[]).forEach(f=>{try{f('schimbare',{})}catch(e){}})}
  const idNou=p=>p+(++nrId);

  /* ---------- modelul unui fișier ---------- */
  function model(id){
    if(!id)return null;if(M[id])return M[id];
    const f=inst.fisier(id);if(!f)return null;
    const prop=f.proprietar&&f.proprietar.adresa?f.proprietar.adresa:euAdr();
    const m={id,tip:f.tip,proprietar:prop,rolMeu:prop===euAdr()?'proprietar':(f.rolMeu||'editor'),
      acc:(f.acces||[]).map(a=>({adresa:per(a.cine||a.adresa).adresa,rol:a.rol||'editor'})),gen:f.general==='link'?'link':'restrictionat',
      par:[],com:[],sl:[],cur:null,atinse:{},prezenti:[],unde:{},cozi:{},ruleaza:{},declansat:{},tot:false};
    if(f.tip==='doc'){
      const P=f.paragrafe||(String(f.text||'').split('\n').filter(x=>x.trim()).map(t=>({autor:prop,text:t})));
      m.par=P.map(p=>({id:idNou('p'),a:per(p.autor==null?prop:p.autor).adresa,t:p.text||'',nou:false,mod:false}));
      (f.comentarii||[]).forEach(c=>adaugaFir(m,per(c.autor).adresa,c.text,c.la,c.raspunsuri,c.rezolvat,true))}
    if(f.tip==='prez'){
      const S=f.slides||[{autor:prop,titlu:'',text:''}];
      m.sl=S.map(s=>({id:idNou('s'),a:per(s.autor==null?prop:s.autor).adresa,ti:s.titlu||'',tx:s.text||'',nou:false}));
      m.cur=m.sl[0]&&m.sl[0].id}
    const scen=f.scenariu||((E.scenariuNou||{})[f.tip]&&(inst.stare().creat||[]).indexOf(id)>=0?E.scenariuNou[f.tip]:[]);
    scen.forEach(x=>{const k=(x.cine||'?')+'|'+(x.cand||'deschis');(m.cozi[k]=m.cozi[k]||[]).push(Object.assign({},x))});
    M[id]=m;return m}
  const activ=()=>{const s=inst.stare();return s.fila&&s.fila.ecran==='doc'?s.fila.doc:null};
  const mAct=id=>model(id||activ());
  const poateScrie=m=>m.rolMeu==='proprietar'||m.rolMeu==='editor';
  const poateComenta=m=>m.rolMeu!=='cititor';
  const pAut=(m,a)=>m.par.filter(p=>p.a===a);

  /* ---------- fire de comentarii ---------- */
  function adaugaFir(m,autor,text,la,rasp,rez,init){
    let pid=null,txt='';
    if(la){const a=per(la.autor).adresa;const p=m.par.find(x=>x.a===a&&(!la.text||x.t.indexOf(la.text)>=0))||m.par.find(x=>x.a===a);
      if(p){pid=p.id;txt=la.text&&p.t.indexOf(la.text)>=0?la.text:p.t.slice(0,40)}}
    const c={id:idNou('c'),a:autor,t:text,pid,anc:txt,rasp:(rasp||[]).map(r=>({a:per(r.autor).adresa,t:r.text})),rez:!!rez};
    m.com.push(c);return c}

  /* ---------- coada colegilor simulați ---------- */
  /* fiecare pas amânat stă în `pend`: grabeste() le face pe loc, în ordine, fără să sară sau să repete ceva */
  function tmr(fn,ms){if(rapid){fn();return}const o={fn};o.t=setTimeout(()=>{pend=pend.filter(x=>x!==o);fn()},ms);pend.push(o)}
  /* rolul colegului ACUM la fișierul acesta: 'proprietar' | 'editor' | 'comentator' | 'cititor' | null (fără acces) */
  function rolColeg(m,a){if(a===m.proprietar)return 'proprietar';const x=m.acc.find(z=>z.adresa===a);return x?x.rol:null}
  /* ce face un coleg simulat după rolul lui de ACUM (ajutorul RO drive/answer/2494822: Comentatorul nu editează, Cititorul nici nu comentează) */
  function permis(m,a,fa){const r=rolColeg(m,a);if(r==='proprietar'||r==='editor')return true;
    if(r==='comentator')return ['intra','iese','comenteaza','raspunde'].indexOf(fa)>=0;return false}
  /* fiecare pas din coadă are starea lui (st: nefăcut / 'q' programat / 'f' făcut); pașii pe care rolul nu-i permite rămân nefăcuți
     și pornesc când rolul se schimbă (reiaColeg) — nimic nu se face de două ori */
  function porneste(m,cine,cand){const k=cine+'|'+cand;if(!m.cozi[k])return;m.declansat[k]=true;if(m.ruleaza[k])return;m.ruleaza[k]=true;ruleaza(m,k,per(cine).adresa)}
  function porneste2(m,cand,cine){Object.keys(m.cozi).forEach(k=>{const [c,w]=k.split('|');if(w===cand&&(!cine||per(c).adresa===per(cine).adresa)){
    if(cand==='comentat')m.cozi[k].forEach(y=>{if(y.fa==='raspunde'&&y.st==='f')y.st=null});porneste(m,c,w)}})}
  function reiaColeg(m,a){Object.keys(m.declansat).forEach(k=>{const [c,w]=k.split('|');if(per(c).adresa===a)porneste(m,c,w)});porneste2(m,'partajat',a)}
  function ruleaza(m,k,a){const x=(m.cozi[k]||[]).find(y=>!y.st&&permis(m,a,y.fa));if(!x){m.ruleaza[k]=false;return}
    x.st='q';tmr(()=>{if(!permis(m,a,x.fa)){x.st=null;ruleaza(m,k,a);return}fa(m,x,()=>{x.st='f';ruleaza(m,k,a)})},x.pauza==null?700:x.pauza)}
  function fa(m,x,gata){
    const p=per(x.cine),a=p.adresa;
    const intra=()=>{if(m.prezenti.indexOf(a)<0){m.prezenti.push(a);desenBara();emite('coleg',{id:m.id,cine:a,fa:'intra'})}};
    if(x.fa==='intra'){intra();gata();return}
    if(x.fa==='iese'){iese(m,a,true);gata();return}
    if(x.fa==='scrie'){intra();let b=x.nou?null:pAut(m,a).slice(-1)[0];
      if(!b){b={id:idNou('p'),a,t:'',nou:false,mod:false};m.par.push(b);const el=pagini[m.id];if(el){const h=el.querySelector('.cge-hartie');if(h)h.insertAdjacentHTML('beforeend',htmlBloc(m,b))}}
      m.unde[a]={p:b.id};puneCursor(m,a);tasteaza(m,b,'t',x.text||'',a,gata);return}
    if(x.fa==='comenteaza'){intra();const c=adaugaFir(m,a,x.text||'',x.la||{autor:'eu'});refaBloc(m,c.pid);desenCom(m);emite('coleg',{id:m.id,cine:a,fa:'comenteaza'});gata();return}
    /* răspunsul colegului: doar la un comentariu al tău la care n-a răspuns încă; unui comentariu ales dintre variantele
       nepotrivite NU-i mulțumește (textNepotrivit, altfel tace) */
    if(x.fa==='raspunde'){const c=m.com.slice().reverse().find(z=>z.a===euAdr()&&!z.rez&&!z.rasp.some(r=>r.a===a)&&(!x.la||m.par.some(p=>p.id===z.pid&&p.a===a)));
      const t=!c?'':(c.ok===false?(x.textNepotrivit||''):(x.text||''));
      if(c&&t){c.rasp.push({a,t});desenCom(m);emite('coleg',{id:m.id,cine:a,fa:'raspunde'})}gata();return}
    if(x.fa==='slide'){intra();const s={id:idNou('s'),a,ti:'',tx:'',nou:false};m.sl.push(s);desenMini(m);
      m.unde[a]={s:s.id,c:'ti'};tasteaza(m,s,'ti',x.titlu||'',a,()=>{m.unde[a]={s:s.id,c:'tx'};puneCursor(m,a);tasteaza(m,s,'tx',x.text||'',a,gata)});return}
    gata()}
  /* colegul iese din fișier: cercul de sus și cursorul lui dispar. Pasul `iese` al scenariului și, de la trecerea 3 (24.10.2026, AG),
     „Elimină accesul” din „Persoane cu acces” / seteazaRol fără rol: fără acces, colegul nu mai stă în document */
  function iese(m,a,mereu){const era=m.prezenti.indexOf(a)>=0;m.prezenti=m.prezenti.filter(y=>y!==a);delete m.unde[a];
    const el=pagini[m.id];if(el)el.querySelectorAll(`.cge-cur[data-cur="${CSS_ESC(a)}"]`).forEach(z=>z.remove());desenBara();
    if(era||mereu)emite('coleg',{id:m.id,cine:a,fa:'iese'})}
  /* tastarea colegului: literă cu literă, doar în nodul de text din fața cursorului lui (fără redesenare: selecția ta rămâne) */
  function tasteaza(m,ob,camp,text,a,gata){
    let i=0,k=ob.id+':'+camp;
    const pas=()=>{
      /* paragraful lui a dispărut (Ctrl+A + Delete cât scria): scrie mai departe într-un paragraf nou, la sfârșit, cu cursorul lui;
         ce ștersese elevul rămâne șters, iar testul „neatins” îl prinde (trecerea 3, AG) */
      if(m.tip==='doc'&&camp==='t'&&m.par.indexOf(ob)<0&&permis(m,a,'scrie')&&i<text.length){
        ob={id:idNou('p'),a,t:'',nou:false,mod:false};k=ob.id+':t';m.par.push(ob);
        const el=pagini[m.id];if(el){const h=el.querySelector('.cge-hartie');if(h)h.insertAdjacentHTML('beforeend',htmlBloc(m,ob))}
        m.unde[a]={p:ob.id};if(m.prezenti.indexOf(a)<0){m.prezenti.push(a);desenBara()}puneCursor(m,a)}
      if(m.atinse[k]||!permis(m,a,'scrie')){gata();return}
      if(i>=text.length){gata();return}
      const n=rapid?text.length-i:1;const bucata=text.substr(i,n);i+=n;
      ob[camp]+=bucata;
      const cur=cursorEl(m,a);
      if(cur){const pr=cur.previousSibling;if(pr&&pr.nodeType===3)pr.appendData(bucata);else cur.parentNode.insertBefore(document.createTextNode(bucata),cur)}
      if(m.tip==='prez')desenMiniUna(m,ob);
      emite('coleg',{id:m.id,cine:a,fa:'tasteaza'});
      tmr(pas,VITEZA)};
    puneCursor(m,a);tmr(pas,VITEZA)}

  /* ---------- desenul documentului ---------- */
  function textDin(el){let s='';const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentNode.closest('.cge-cur')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
    while(w.nextNode())s+=w.currentNode.nodeValue;return s}
  function htmlText(m,p){
    const firs=m.com.filter(c=>c.pid===p.id&&!c.rez&&c.anc);let t=p.t,out='',poz=0;
    const marc=[];firs.forEach(c=>{const i=t.indexOf(c.anc);if(i>=0&&!marc.some(z=>i<z.e&&i+c.anc.length>z.s))marc.push({s:i,e:i+c.anc.length,c})});
    marc.sort((x,y)=>x.s-y.s).forEach(z=>{out+=esc(t.slice(poz,z.s))+`<span class="cge-anc" data-c="${z.c.id}">${esc(t.slice(z.s,z.e))}</span>`;poz=z.e});
    return out+esc(t.slice(poz))}
  function htmlCur(a){const p=per(a);return `<span class="cge-cur" contenteditable="false" data-cur="${esc(a)}" style="--cc:${p.culoare}" aria-label="Cursorul ${esc(datP(p))}"><span class="cge-et">${esc(p.nume)}</span></span>`}
  function htmlBloc(m,p){
    const ed=poateScrie(m),cine=per(p.a);
    const cur=m.prezenti.filter(a=>a!==euAdr()&&m.unde[a]&&m.unde[a].p===p.id).map(htmlCur).join('');
    return `<div class="cge-bloc" data-p="${p.id}" contenteditable="${ed?'true':'false'}" ${ATR} role="textbox" aria-multiline="true" aria-label="Paragraful ${esc(datP(cine))}">${htmlText(m,p)}${cur}</div>`}
  function banda(m){
    if(m.rolMeu==='proprietar'||m.rolMeu==='editor')return '';
    return `<p class="cge-banda">Ești <b>${numeRol(m.rolMeu)}</b> la acest document: ${POATE[m.rolMeu]}.${m.rolMeu==='comentator'?' (În aplicația adevărată, ce scrie un comentator în text devine o propunere: o înveți în lecția 20.)':''}</p>`}
  function pagDoc(f){
    const m=model(f.id);let el=pagini[f.id];
    if(!el){el=document.createElement('div');el.className='cge-pag';pagini[f.id]=el;construiesteDoc(el,m);leagaDoc(el,m);
      porneste2(m,'deschis');m.acc.forEach(x=>porneste2(m,'partajat',x.adresa))}
    return el}
  function construiesteDoc(el,m){el.innerHTML=`${banda(m)}<div class="cge-toast-loc"></div><div class="cge-hartie" tabindex="-1">${m.par.map(p=>htmlBloc(m,p)).join('')}</div>
    <p class="cge-nota">${ATINGERE()?'Pe telefon: atingi locul unde vrei să scrii. Ca să alegi un text, ții degetul apăsat pe un cuvânt.':'Ca să alegi un text: tragi peste el cu mouse-ul sau dai dublu clic pe un cuvânt.'} Enter la sfârșitul unui paragraf face un paragraf nou.</p>`}
  function reface(m){const el=pagini[m.id];if(!el)return;if(m.tip==='doc'){m.par.forEach(p=>refaBloc(m,p.id))}else desenPrez(m)}
  function refaBloc(m,pid){const el=pagini[m.id];if(!el||!pid)return;const b=el.querySelector(`.cge-bloc[data-p="${pid}"]`);const p=m.par.find(x=>x.id===pid);if(!b||!p)return;
    const foc=document.activeElement===b;b.outerHTML=htmlBloc(m,p);if(foc){const n=el.querySelector(`.cge-bloc[data-p="${pid}"]`);if(n)caretLaCapat(n)}}
  function cursorEl(m,a){const el=pagini[m.id];if(!el)return null;return el.querySelector(`.cge-cur[data-cur="${CSS_ESC(a)}"]`)}
  const CSS_ESC=s=>(window.CSS&&window.CSS.escape)?window.CSS.escape(s):String(s).replace(/["\\]/g,'\\$&');
  function puneCursor(m,a){const el=pagini[m.id];if(!el)return;el.querySelectorAll(`.cge-cur[data-cur="${CSS_ESC(a)}"]`).forEach(x=>x.remove());
    const u=m.unde[a];if(!u)return;
    let host=null;if(u.p)host=el.querySelector(`.cge-bloc[data-p="${u.p}"]`);else if(u.s&&u.s===m.cur)host=el.querySelector(`.cge-cas[data-c="${u.c}"]`);
    if(host)host.insertAdjacentHTML('beforeend',htmlCur(a))}
  function caretLaCapat(n){try{n.focus({preventScroll:true});const r=document.createRange();r.selectNodeContents(n);
    const c=n.querySelector('.cge-cur');if(c)r.setEndBefore(c);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r)}catch(e){}}
  /* cursorul elevului la a `poz`-a literă din bloc (cursoarele colegilor nu se numără) */
  function caretLa(n,poz){try{n.focus({preventScroll:true});const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT,{acceptNode:x=>x.parentNode.closest('.cge-cur')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
    let rest=poz,nod=null;while(w.nextNode()){const L=w.currentNode.nodeValue.length;if(rest<=L){nod=w.currentNode;break}rest-=L}
    const r=document.createRange();if(nod){r.setStart(nod,rest);r.collapse(true)}else{r.selectNodeContents(n);const c=n.querySelector('.cge-cur');if(c&&poz>0)r.setEndBefore(c);r.collapse(poz===0)}
    const s=getSelection();s.removeAllRanges();s.addRange(r)}catch(e){}}
  function offsetIn(host,node,off){let n=0;const w=document.createTreeWalker(host,NodeFilter.SHOW_TEXT,{acceptNode:x=>x.parentNode.closest('.cge-cur')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
    while(w.nextNode()){if(w.currentNode===node)return n+off;n+=w.currentNode.nodeValue.length}
    if(node===host){let k=0;for(let i=0;i<off&&i<host.childNodes.length;i++){const c=host.childNodes[i];if(!(c.nodeType===1&&c.classList.contains('cge-cur')))k+=textDin(c.nodeType===1?c:wrapT(c)).length}return k}
    return n}
  const wrapT=t=>{const d=document.createElement('span');d.textContent=t.nodeValue||'';return d};
  function selInBloc(el){const s=getSelection();if(!s||!s.rangeCount)return null;const r=s.getRangeAt(0);const b=(r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentNode).closest&&(r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentNode).closest('.cge-bloc');
    if(!b||!el.contains(b))return null;const e=(r.endContainer.nodeType===1?r.endContainer:r.endContainer.parentNode).closest('.cge-bloc');
    const s0=offsetIn(b,r.startContainer,r.startOffset),e0=e===b?offsetIn(b,r.endContainer,r.endOffset):textDin(b).length;return {pid:b.dataset.p,s:s0,e:e0,col:s.isCollapsed}}
  function leagaDoc(el,m){
    el.addEventListener('input',e=>{const b=e.target.closest&&e.target.closest('.cge-bloc');if(!b)return;const p=m.par.find(x=>x.id===b.dataset.p);if(!p)return;
      const t=textDin(b);
      if(p.a!==euAdr()){if(t!==p.t){m.atinse[p.id+':t']=true;emite('atins',{id:m.id,pid:p.id,autor:p.a})}return}
      p.t=t;p.mod=true;salvare();emite('scris',{id:m.id,pid:p.id,cuvinte:cuvinte(t)})});
    const enter=(e,b)=>{const p=m.par.find(x=>x.id===b.dataset.p);const s=selInBloc(el);if(!p||!s||!s.col)return false;
      if(s.s<textDin(b).length)return false;e.preventDefault();
      const n={id:idNou('p'),a:euAdr(),t:'',nou:true,mod:false};m.par.splice(m.par.indexOf(p)+1,0,n);b.insertAdjacentHTML('afterend',htmlBloc(m,n));
      const nb=el.querySelector(`.cge-bloc[data-p="${n.id}"]`);if(nb)caretLaCapat(nb);emite('scris',{id:m.id,pid:n.id,cuvinte:0});return true};
    /* tastele care trec de la un paragraf la altul, ca în Documente Google (documentul e UN text; aici, un bloc pe paragraf) */
    const blocuri=()=>Array.from(el.querySelectorAll('.cge-bloc'));
    const peLinia=(b,unde)=>{try{const r=getSelection().getRangeAt(0);const rc=r.getClientRects()[0];if(!rc)return true;const br=b.getBoundingClientRect();
      const lh=parseFloat(getComputedStyle(b).lineHeight)||20;return unde==='sus'?(rc.top-br.top)<lh*0.9:(br.bottom-rc.bottom)<lh*0.9}catch(x){return false}};
    const treci=(e,b)=>{const s=selInBloc(el);if(!s||!s.col)return false;const L=blocuri(),i=L.indexOf(b),n=textDin(b).length;let t=null,poz=0;
      if(e.key==='ArrowLeft'&&s.s===0&&i>0){t=L[i-1];poz=textDin(t).length}
      else if(e.key==='ArrowRight'&&s.s>=n&&i<L.length-1){t=L[i+1];poz=0}
      else if(e.key==='ArrowUp'&&i>0&&peLinia(b,'sus')){t=L[i-1];poz=textDin(t).length}
      else if(e.key==='ArrowDown'&&i<L.length-1&&peLinia(b,'jos')){t=L[i+1];poz=0}
      if(!t)return false;caretLa(t,poz);return true};
    /* Backspace la începutul unui paragraf / Delete la sfârșitul lui: paragrafele se unesc (ca în Google). Al colegului se schimbă. */
    const scoatePar=(x,inLoc)=>{m.par.splice(m.par.indexOf(x),1);const d=el.querySelector(`.cge-bloc[data-p="${x.id}"]`);if(d)d.remove();
      Object.keys(m.unde).forEach(a=>{if(m.unde[a].p===x.id)m.unde[a]={p:inLoc.id}})};
    const lipeste=(sus,jos)=>{const me=euAdr();const bloc=p=>el.querySelector(`.cge-bloc[data-p="${p.id}"]`);
      if(!jos.t){if(jos.a!==me)m.atinse[jos.id+':t']=true;scoatePar(jos,sus);refaBloc(m,sus.id);const n=bloc(sus);if(n)caretLa(n,textDin(n).length)}
      else if(!sus.t){if(sus.a!==me)m.atinse[sus.id+':t']=true;scoatePar(sus,jos);refaBloc(m,jos.id);const n=bloc(jos);if(n)caretLa(n,0)}
      else{const poz=textDin(bloc(sus)||document.createElement('i')).length;if(sus.a!==me)m.atinse[sus.id+':t']=true;if(jos.a!==me)m.atinse[jos.id+':t']=true;
        sus.t+=jos.t;if(sus.a===me)sus.mod=true;scoatePar(jos,sus);refaBloc(m,sus.id);const n=bloc(sus);if(n)caretLa(n,poz)}
      salvare();if(Object.keys(m.atinse).length)emite('atins',{id:m.id,pid:sus.id});emite('scris',{id:m.id,pid:sus.id,cuvinte:cuvinte(sus.t)});return true};
    const uneste=(inapoi,b)=>{const s=selInBloc(el);if(!s||!s.col)return false;const p=m.par.find(x=>x.id===b.dataset.p);if(!p)return false;const i=m.par.indexOf(p);
      if(inapoi){if(s.s!==0||i<=0)return false;return lipeste(m.par[i-1],p)}
      if(s.s<textDin(b).length||i>=m.par.length-1)return false;return lipeste(p,m.par[i+1])};
    /* Ctrl+A alege TOT documentul (ajutorul RO docs/answer/179738: „Selectează tot — Ctrl + a”), cu rândurile colegilor */
    const tot=on=>{m.tot=!!on;const h=el.querySelector('.cge-hartie');if(h)h.classList.toggle('cge-tot',!!on);
      if(on)toast(m,'Ctrl+A a ales tot documentul, și rândurile colegilor, ca în Google. Delete sau o literă le-ar șterge pe toate. Ca să renunți: o săgeată sau clic în paragraful tău.')};
    const stergeTot=ch=>{const me=euAdr();m.par.forEach(p=>{if(p.a!==me&&p.t)m.atinse[p.id+':t']=true});
      const n={id:idNou('p'),a:me,t:ch||'',nou:true,mod:!!ch};m.par=[n];m.tot=false;Object.keys(m.unde).forEach(a=>{if(m.unde[a].p)delete m.unde[a]});
      const h=el.querySelector('.cge-hartie');if(h){h.classList.remove('cge-tot');h.innerHTML=htmlBloc(m,n);const nb=h.querySelector('.cge-bloc');if(nb)caretLaCapat(nb)}
      toast(m,'Ai șters tot documentul, și rândurile colegilor. În Google adevărat dispăreau la toată echipa.');salvare();emite('atins',{id:m.id,tot:true});emite('scris',{id:m.id,pid:n.id,cuvinte:cuvinte(n.t)})};
    el.addEventListener('pointerdown',()=>{if(m.tot)tot(false)});
    el.addEventListener('keydown',e=>{const b=e.target.closest&&e.target.closest('.cge-bloc');if(!b)return;
      const ctrl=e.ctrlKey||e.metaKey;
      if(m.tot){if(ctrl&&(e.key==='c'||e.key==='C'))return;
        if(e.key==='Delete'||e.key==='Backspace'||e.key==='Enter'||(ctrl&&(e.key==='x'||e.key==='X'))||(!ctrl&&!e.altKey&&e.key.length===1)){e.preventDefault();stergeTot(!ctrl&&e.key.length===1?e.key:'');return}
        if(['Shift','Control','Alt','Meta','AltGraph'].indexOf(e.key)<0)tot(false)}
      if(ctrl&&!e.altKey&&(e.key==='a'||e.key==='A'||e.code==='KeyA')){e.preventDefault();tot(true);return}
      if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){enter(e,b);return}
      if(ctrl&&e.altKey&&(e.key==='m'||e.key==='M'||e.code==='KeyM')){e.preventDefault();deschideCompozitor(m);return}
      if(ctrl&&!e.altKey&&!e.shiftKey&&(e.key==='Home'||e.key==='End')){e.preventDefault();const L=blocuri();const t=e.key==='Home'?L[0]:L[L.length-1];if(t)caretLa(t,e.key==='Home'?0:textDin(t).length);return}
      if(!ctrl&&!e.altKey&&!e.shiftKey&&/^Arrow(Up|Down|Left|Right)$/.test(e.key)){if(treci(e,b))e.preventDefault();return}
      if(!ctrl&&!e.altKey&&!e.shiftKey&&(e.key==='Backspace'||e.key==='Delete')){if(uneste(e.key==='Backspace',b))e.preventDefault()}});
    el.addEventListener('beforeinput',e=>{const b=e.target.closest&&e.target.closest('.cge-bloc');if(!b)return;
      if(e.inputType==='insertParagraph'){enter(e,b);return}
      /* tastatura telefonului nu trimite mereu „Backspace” la keydown: aceeași unire, din beforeinput */
      if(m.tot&&/^(insert|delete)/.test(e.inputType)){e.preventDefault();stergeTot(e.inputType==='insertText'?(e.data||'').slice(0,1):'');return}
      if(e.inputType==='deleteContentBackward'||e.inputType==='deleteContentForward'){if(uneste(e.inputType==='deleteContentBackward',b))e.preventDefault()}});
    el.addEventListener('paste',e=>{const b=e.target.closest&&e.target.closest('.cge-bloc');if(!b)return;e.preventDefault();const t=(e.clipboardData&&e.clipboardData.getData('text/plain'))||'';
      try{document.execCommand('insertText',false,t.replace(/\r?\n/g,' '))}catch(x){}});
    el.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('.cge-anc');if(a){const c=m.com.find(x=>x.id===a.dataset.c);if(c){m.firActiv=c.id;desenCom(m)}}})}
  const laSelectie=()=>{const id=activ();const el=id&&pagini[id];if(!el||!el.isConnected)return;const s=selInBloc(el);if(s)ultimaSel=Object.assign({fid:id,t:Date.now()},s)};
  SELECTII.add(laSelectie);
  /* „Se salvează…” → norul: patch pe bara lui colab-google, fără redesenare */
  let cronS=null;
  function salvare(){const r=inst.root;const w=r.querySelector('.cg-doc-sus .cg-stare-wrap')||r.querySelector('.cg-doc-sus .cg-stare');
    if(w&&!w.dataset.cge){const s=document.createElement('span');s.className='cg-stare';s.dataset.cge='1';s.setAttribute('aria-live','polite');s.textContent='Se salvează…';w.replaceWith(s)}
    clearTimeout(cronS);cronS=setTimeout(()=>{const s=r.querySelector('.cg-doc-sus .cg-stare[data-cge]');if(s){s.textContent='☁✓';s.title='Salvat în Drive';s.setAttribute('aria-label','Salvat în Drive (norul cu bifă)')}},800)}

  /* ---------- comentariile (panoul din dreapta) ---------- */
  function latDoc(f){if(f.tip!=='doc')return null;const m=model(f.id);let el=laterale[f.id];
    if(!el){el=document.createElement('div');el.className='cge-com';laterale[f.id]=el;leagaCom(el,m);desenCom(m,el)}return el}
  function htmlFir(m,c){
    const p=per(c.a),on=m.firActiv===c.id;
    const rasp=c.rasp.map(r=>{const q=per(r.a);return `<div class="cge-r"><span class="cge-av" style="--cc:${q.culoare}" aria-hidden="true">${esc(ini(q.nume))}</span><div><b>${esc(q.nume)}</b><p>${esc(r.t)}</p></div></div>`}).join('');
    const rez=poateComenta(m)?`<button type="button" class="cge-rezolva" data-x="rezolva" aria-label="Rezolvă (Resolve): închide comentariul" title="Rezolvă">✓ Rezolvă</button>`:'';
    const jos=!poateComenta(m)?'':on?`<textarea class="cge-ta" data-ta="r" ${ATR} aria-label="Răspunsul tău" placeholder="Scrie răspunsul aici">${esc(m.ciornaR||'')}</textarea>
      <div class="cge-bt"><button type="button" class="cge-sec2" data-x="anuleaza-r">Anulează</button><button type="button" class="cg-prim" data-x="trimite-r">Răspunde</button></div>`
      :`<button type="button" class="cge-link" data-x="deschide">Răspunde</button>`;
    return `<section class="cge-fir${on?' on':''}" data-c="${c.id}" aria-label="Comentariul ${esc(datP(p))}"><div class="cge-fir-sus"><span class="cge-av" style="--cc:${p.culoare}" aria-hidden="true">${esc(ini(p.nume))}</span><span class="cge-cine"><b>${esc(p.nume)}</b><small>acum</small></span>${rez}</div>
      ${c.anc?`<div class="cge-citat">„${esc(c.anc)}”</div>`:''}<p class="cge-ct">${esc(c.t)}</p>${rasp}${jos}</section>`}
  function desenCom(m,el0){
    const el=el0||laterale[m.id];if(!el)return;
    const foc=document.activeElement&&el.contains(document.activeElement)&&document.activeElement.dataset.ta;
    const sel=foc?[document.activeElement.selectionStart,document.activeElement.selectionEnd]:null;
    const desc=m.com.filter(c=>!c.rez),rez=m.com.filter(c=>c.rez);
    const nou=m.compozitor?`<div class="cge-fir on"><div class="cge-fir-sus"><span class="cge-av" style="--cc:${per('eu').culoare}" aria-hidden="true">${esc(ini(eu().nume))}</span><span class="cge-cine"><b>${esc(eu().nume)}</b></span></div>
      <div class="cge-citat">„${esc(m.compozitor.anc)}”</div>${VAR?`<p class="cge-nota">În simulator alegi comentariul din listă; în Google adevărat îl scrii tu.</p>
      <div class="cge-vars" role="radiogroup" aria-label="Alege comentariul">${VAR.map((v,i)=>`<label class="cge-var${m.varN===i?' on':''}"><input type="radio" data-v="${i}" autocomplete="off" ${m.varN===i?'checked':''}><span>${esc(v.text)}</span></label>`).join('')}</div>`
      :`<textarea class="cge-ta" data-ta="n" ${ATR} aria-label="Comentariul tău" placeholder="Scrie comentariul aici">${esc(m.ciornaN||'')}</textarea>`}
      <div class="cge-bt"><button type="button" class="cge-sec2" data-x="anuleaza-n">Anulează</button><button type="button" class="cg-prim" data-x="comenteaza" ${(VAR?m.varN!=null:sp(m.ciornaN))?'':'disabled'}>Comentează</button></div></div>`:'';
    el.innerHTML=`<div class="cge-com-cap">Comentarii</div><p class="cge-err" aria-live="polite">${m.mesajCom||''}</p>${nou}${desc.map(c=>htmlFir(m,c)).join('')}
      ${!desc.length&&!nou?`<p class="cge-nota">Niciun comentariu deschis.${poateComenta(m)?' Alegi un text, apoi <b>Adaugă un comentariu</b>, sus în bara de instrumente.':''}</p>`:''}
      ${rez.length?`<p class="cge-nota">Rezolvate: ${rez.length} (au dispărut de aici; în aplicația adevărată le regăsești la „Afișează toate comentariile”).</p>`:''}`;
    if(foc){const t=el.querySelector(`[data-ta="${foc}"]`);if(t){t.focus({preventScroll:true});try{t.setSelectionRange(sel[0],sel[1])}catch(e){}}}}
  function leagaCom(el,m){
    el.addEventListener('input',e=>{const t=e.target;if(!t.dataset||!t.dataset.ta)return;if(t.dataset.ta==='n'){m.ciornaN=t.value;const b=el.querySelector('[data-x="comenteaza"]');if(b)b.disabled=!sp(t.value)}else m.ciornaR=t.value});
    /* comentariul pe alegere: o singură variantă bifată (fără `name`, ca toate câmpurile simulatorului) */
    el.addEventListener('change',e=>{const t=e.target;if(!VAR||!t.dataset||t.dataset.v==null)return;m.varN=+t.dataset.v;m.ciornaN=VAR[m.varN].text;
      el.querySelectorAll('.cge-var').forEach((l,i)=>{l.classList.toggle('on',i===m.varN);const r=l.querySelector('input');if(r)r.checked=i===m.varN});
      const b=el.querySelector('[data-x="comenteaza"]');if(b)b.disabled=false});
    el.addEventListener('keydown',e=>{if(e.key==='Escape'&&e.target.dataset&&(e.target.dataset.ta||e.target.dataset.v!=null)){e.preventDefault();if(e.target.dataset.ta!=='r'){m.compozitor=null;m.ciornaN='';m.varN=null}else{m.firActiv=null;m.ciornaR=''}desenCom(m)}});
    el.addEventListener('click',e=>{
      const b=e.target.closest('[data-x]');const fir=e.target.closest('.cge-fir[data-c]');
      if(b){const x=b.dataset.x;const c=fir&&m.com.find(z=>z.id===fir.dataset.c);
        if(x==='comenteaza'){comenteazaAcum(m,m.ciornaN);return}
        if(x==='anuleaza-n'){m.compozitor=null;m.ciornaN='';m.varN=null;m.mesajCom='';desenCom(m);return}
        if(x==='deschide'&&c){m.firActiv=c.id;m.ciornaR='';desenCom(m);const t=el.querySelector('[data-ta="r"]');if(t)t.focus({preventScroll:true});marcheazaAncora(m);return}
        if(x==='anuleaza-r'){m.firActiv=null;m.ciornaR='';desenCom(m);marcheazaAncora(m);return}
        if(x==='trimite-r'&&c){raspundeAcum(m,c,m.ciornaR);return}
        if(x==='rezolva'&&c){rezolvaAcum(m,c);return}
        return}
      if(fir&&m.firActiv!==fir.dataset.c&&m.com.some(z=>z.id===fir.dataset.c)){m.firActiv=fir.dataset.c;m.ciornaR='';desenCom(m);marcheazaAncora(m);const t=el.querySelector('[data-ta="r"]');if(t&&!ATINGERE())t.focus({preventScroll:true})}})}
  function marcheazaAncora(m){const el=pagini[m.id];if(!el)return;el.querySelectorAll('.cge-anc').forEach(a=>a.classList.toggle('on',a.dataset.c===m.firActiv))}
  function deschideCompozitor(m,forteaza){
    m=m||mAct();if(!m||m.tip!=='doc')return false;
    if(!poateComenta(m)){m.mesajCom='Ca Cititor nu poți comenta.';desenCom(m);return false}
    let s=forteaza||null;const el=pagini[m.id];
    if(!s&&el){const a=selInBloc(el);s=a&&!a.col?a:(ultimaSel&&ultimaSel.fid===m.id&&!ultimaSel.col&&Date.now()-ultimaSel.t<120000?ultimaSel:a||(ultimaSel&&ultimaSel.fid===m.id?ultimaSel:null))}
    if(!s){m.mesajCom='Întâi alegi textul la care comentezi: tragi peste el (pe telefon, ții degetul pe un cuvânt), apoi Adaugă un comentariu.';desenCom(m);return false}
    const p=m.par.find(x=>x.id===s.pid);if(!p)return false;
    let a0=Math.min(s.s,s.e),a1=Math.max(s.s,s.e);
    if(a0===a1){const t=p.t;while(a0>0&&/\S/.test(t[a0-1]))a0--;while(a1<t.length&&/\S/.test(t[a1]))a1++}
    const anc=p.t.slice(a0,a1).trim();
    if(!anc){m.mesajCom='Alege un cuvânt sau o propoziție (nu un spațiu gol), apoi Adaugă un comentariu.';desenCom(m);return false}
    m.compozitor={pid:p.id,anc};m.ciornaN='';m.varN=null;m.mesajCom='';desenCom(m);
    const t=laterale[m.id]&&laterale[m.id].querySelector('[data-ta="n"],[data-v="0"]');if(t)t.focus({preventScroll:true});emite('compozitor',{id:m.id});return true}
  function comenteazaAcum(m,text){
    if(!m.compozitor||!sp(text))return false;
    /* varianta aleasă (dacă Q are `variante`): ok / dece rămân pe comentariu, pentru test și pentru răspunsul colegului */
    let v=null;if(VAR){const i=VAR.findIndex(x=>sp(x.text)===sp(text));if(i>=0)v=i}
    const c={id:idNou('c'),a:euAdr(),t:sp(text),pid:m.compozitor.pid,anc:m.compozitor.anc,rasp:[],rez:false,v,ok:v==null?undefined:!!VAR[v].ok,dece:v==null?'':(VAR[v].dece||'')};
    m.com.push(c);m.compozitor=null;m.ciornaN='';m.varN=null;m.mesajCom='';refaBloc(m,c.pid);desenCom(m);
    const p=m.par.find(x=>x.id===c.pid);emite('comentat',{id:m.id,autorText:p&&p.a});
    if(p&&p.a!==euAdr())porneste2(m,'comentat',p.a);return true}
  function raspundeAcum(m,c,text){if(!sp(text)||!poateComenta(m))return false;c.rasp.push({a:euAdr(),t:sp(text)});m.ciornaR='';m.firActiv=null;desenCom(m);marcheazaAncora(m);emite('raspuns',{id:m.id,fir:c.id,autor:c.a});return true}
  function rezolvaAcum(m,c){if(!poateComenta(m))return false;c.rez=true;if(m.firActiv===c.id)m.firActiv=null;refaBloc(m,c.pid);desenCom(m);emite('rezolvat',{id:m.id,fir:c.id,autor:c.a});return true}

  /* ---------- prezentarea ---------- */
  function pagPrez(f){const m=model(f.id);let el=pagini[f.id];
    if(!el){el=document.createElement('div');el.className='cge-pag';pagini[f.id]=el;el.innerHTML=`${banda(m)}<div class="cge-toast-loc"></div><div class="cge-prez"><div class="cge-mini" role="list" aria-label="Slide-urile prezentării"></div><div class="cge-scena" tabindex="-1"></div></div>`;
      leagaPrez(el,m);desenPrez(m);porneste2(m,'deschis');m.acc.forEach(x=>porneste2(m,'partajat',x.adresa))}
    return el}
  function htmlTh(m,s,i){const p=per(s.a);return `<button type="button" class="cge-th${s.id===m.cur?' on':''}" data-s="${s.id}" role="listitem" aria-label="Slide-ul ${i+1}${s.ti?': '+esc(s.ti):''} (îl face ${esc(p.nume)})"><b>${i+1}</b><span style="min-width:0;flex:1"><span class="tt">${esc(s.ti)||'&nbsp;'}</span><span class="tx">${esc(s.tx)}</span><span class="ba" style="--cc:${p.culoare}"></span></span></button>`}
  function infoSl(m,s){const i=m.sl.indexOf(s),p=per(s.a);return `Slide-ul ${i+1} din ${m.sl.length} · ${s.a===euAdr()?'slide-ul tău':'îl face '+esc(p.nume)}${poateScrie(m)?'':' · doar te uiți'}`}
  function desenMini(m){const el=pagini[m.id];if(!el)return;const b=el.querySelector('.cge-mini');if(b)b.innerHTML=m.sl.map((s,i)=>htmlTh(m,s,i)).join('');
    const inf=el.querySelector('.cge-sl-info'),s=m.sl.find(x=>x.id===m.cur);if(inf&&s)inf.innerHTML=infoSl(m,s)}
  function desenMiniUna(m,s){const el=pagini[m.id];if(!el)return;const b=el.querySelector(`.cge-th[data-s="${s.id}"]`);if(!b){desenMini(m);return}const i=m.sl.indexOf(s);b.outerHTML=htmlTh(m,s,i)}
  function desenPrez(m){const el=pagini[m.id];if(!el)return;desenMini(m);
    const s=m.sl.find(x=>x.id===m.cur)||m.sl[0];if(!s)return;m.cur=s.id;const i=m.sl.indexOf(s),p=per(s.a),ed=poateScrie(m);
    el.querySelector('.cge-scena').innerHTML=`<div class="cge-slide" data-s="${s.id}">
      <div class="cge-cas cge-cas-t" data-c="ti" contenteditable="${ed}" ${ATR} role="textbox" aria-label="Caseta de titlu" data-ph="(caseta de titlu: clic și scrii)">${esc(s.ti)}</div>
      <div class="cge-cas cge-cas-x" data-c="tx" contenteditable="${ed}" ${ATR} role="textbox" aria-multiline="true" aria-label="Caseta de text" data-ph="(caseta de text: clic și scrii)">${esc(s.tx)}</div></div>
      <p class="cge-sl-info">${infoSl(m,s)}</p>`;
    m.prezenti.forEach(a=>{if(a!==euAdr())puneCursor(m,a)})}
  function slideNou(m){m=m||mAct();if(!m||m.tip!=='prez'||!poateScrie(m))return null;
    const s={id:idNou('s'),a:euAdr(),ti:'',tx:'',nou:true};const i=m.sl.findIndex(x=>x.id===m.cur);m.sl.splice(i<0?m.sl.length:i+1,0,s);m.cur=s.id;desenPrez(m);
    const el=pagini[m.id];const t=el&&el.querySelector('.cge-cas-t');if(t)caretLaCapat(t);emite('slide',{id:m.id,sid:s.id});return s.id}
  function leagaPrez(el,m){
    el.addEventListener('click',e=>{const b=e.target.closest('.cge-th');if(b){m.cur=b.dataset.s;desenPrez(m);emite('slide-ales',{id:m.id})}});
    el.addEventListener('input',e=>{const c=e.target.closest&&e.target.closest('.cge-cas');if(!c)return;const sl=el.querySelector('.cge-slide');const s=m.sl.find(x=>x.id===(sl&&sl.dataset.s));if(!s)return;
      const camp=c.dataset.c,t=textDin(c);
      if(s.a!==euAdr()){if(t!==s[camp]){m.atinse[s.id+':'+camp]=true;emite('atins',{id:m.id,sid:s.id,autor:s.a})}return}
      s[camp]=t;s.mod=true;salvare();desenMiniUna(m,s);emite('scris',{id:m.id,sid:s.id})});
    el.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.altKey&&(e.key==='m'||e.key==='M'||e.code==='KeyM')){e.preventDefault();slideNou(m)}});
    el.addEventListener('paste',e=>{const c=e.target.closest&&e.target.closest('.cge-cas');if(!c)return;e.preventDefault();const t=(e.clipboardData&&e.clipboardData.getData('text/plain'))||'';
      try{document.execCommand('insertText',false,t)}catch(x){}})}

  /* ---------- bara cu colegii din document (slotul doc-bara) ---------- */
  function desenBara(){if(!bara)return;const m=mAct();const L=m?m.prezenti.filter(a=>a!==euAdr()):[];
    bara.innerHTML=L.length?`<span class="cge-avs" title="Cine e acum în fișier">${L.map(a=>{const p=per(a);return `<span class="cge-av" style="--cc:${p.culoare}" title="${esc(p.nume)}" aria-label="${esc(p.nume)} e acum în fișier">${esc(ini(p.nume))}</span>`}).join('')}</span>`:''}

  /* ---------- fereastra „Permite accesul” ---------- */
  function deschideDialog(id){const m=mAct(id);if(!m)return false;dlg={fid:m.id,chips:[],q:'',rol:'editor',notif:true,msg:'',err:'',ok:''};desenDlg('.cge-in');emite('dialog',{id:m.id,deschis:true});return true}
  function inchideDialog(){if(!dlg)return;const id=dlg.fid;dlg=null;if(ov&&ov.parentNode)ov.remove();emite('dialog',{id,deschis:false});
    const b=inst.root.querySelector('[data-a="partajare"]');if(b)b.focus({preventScroll:true})}
  function sugestii(q){q=fd(sp(q)).toLowerCase();if(q.length<2)return [];const m=M[dlg.fid];
    return DIR.filter(p=>p.adresa!==euAdr()&&p.adresa!==m.proprietar&&!dlg.chips.some(c=>c.adresa===p.adresa)&&(fd(p.nume).toLowerCase().indexOf(q)>=0||p.adresa.toLowerCase().indexOf(q)===0)).slice(0,5)}
  function htmlSug(){return dlg.q?sugestii(dlg.q).map(p=>`<button type="button" class="cge-s" data-adr="${esc(p.adresa)}" role="option"><span class="cge-av" style="--cc:${p.culoare}" aria-hidden="true">${esc(ini(p.nume))}</span><span><b>${esc(p.nume)}</b><small>${esc(p.adresa)}</small></span></button>`).join(''):''}
  function desenDlg(focus){
    if(!dlg)return;const m=M[dlg.fid];const f=inst.fisier(dlg.fid);if(!m||!f)return;
    if(!ov){ov=document.createElement('div');ov.className='cge-ov';leagaDlg()}
    const cg=inst.root.querySelector('.cg');if(cg&&ov.parentNode!==cg)cg.appendChild(ov);
    const ed=m.rolMeu==='proprietar'||m.rolMeu==='editor';
    const pr=per(m.proprietar);
    const chips=dlg.chips.map((c,i)=>`<span class="cge-chip">${esc(c.nume?c.nume+' · ':'')}${esc(c.adresa)}<button type="button" data-d="scoate" data-i="${i}" aria-label="Scoate adresa ${esc(c.adresa)}">✕</button></span>`).join('');
    const opRol=(sel,cu)=>ROLURI.map(r=>`<option value="${r.id}"${r.id===sel?' selected':''}>${r.nume}</option>`).join('')+(cu?'<option value="sterge">Elimină accesul</option>':'');
    let corp='';
    if(!ed)corp=`<p class="cge-err">Doar proprietarul și editorii pot da acces. Tu ești ${numeRol(m.rolMeu)}.</p><div class="cge-bt"><button type="button" class="cg-prim" data-d="gata">Gata</button></div>`;
    else if(dlg.chips.length)corp=`<label class="cge-rand"><span>Rolul lor:</span><select class="cge-sel" data-d="rol-nou" aria-label="Rolul persoanelor adăugate">${opRol(dlg.rol)}</select></label>
      <label class="cge-cb"><input type="checkbox" data-d="notif" autocomplete="off" ${dlg.notif?'checked':''}> Notifică persoanele (primesc un e-mail)</label>
      <textarea class="cge-msg" data-d="msg" ${ATR} aria-label="Mesaj (nu e obligatoriu)" placeholder="Mesaj (nu e obligatoriu)">${esc(dlg.msg)}</textarea>
      <div class="cge-bt"><button type="button" class="cge-sec2" data-d="anuleaza">Anulează</button><button type="button" class="cg-prim" data-d="trimite">Trimite</button></div>`;
    else corp=`<div class="cge-tit">Persoane cu acces</div>
      <div class="cge-pr"><span class="cge-av" style="--cc:${pr.culoare}" aria-hidden="true">${esc(ini(pr.nume))}</span><span class="n">${esc(pr.nume)}${pr.adresa===euAdr()?' (tu)':''}<small>${esc(pr.adresa)}</small></span><span class="r0">Proprietar</span></div>
      ${m.acc.map(a=>{const p=dupaAdr(a.adresa)||{nume:'',adresa:a.adresa,culoare:'#5F6368'};return `<div class="cge-pr"><span class="cge-av" style="--cc:${p.culoare}" aria-hidden="true">${esc(ini(p.nume||p.adresa))}</span><span class="n">${esc(p.nume||p.adresa)}${a.adresa===euAdr()?' (tu)':''}<small>${esc(a.adresa)}</small></span>${a.adresa===euAdr()?`<span class="r0">${numeRol(a.rol)}</span>`:`<select class="cge-sel" data-acc="${esc(a.adresa)}" aria-label="Rolul ${esc(p.nume?datP(p):'adresei '+a.adresa)}">${opRol(a.rol,true)}</select>`}</div>`}).join('')}
      <div class="cge-tit">Acces general</div>
      <div class="cge-gen"><span aria-hidden="true">${m.gen==='link'?'🌐':'🔒'}</span><select class="cge-sel" data-d="general" aria-label="Acces general">
        <option value="restrictionat"${m.gen==='restrictionat'?' selected':''}>Restricționat</option><option value="link"${m.gen==='link'?' selected':''}>Oricine are linkul</option></select>
        <small>${m.gen==='link'?'Oricine are linkul poate folosi fișierul, fără să se conecteze.':'Numai persoanele cu acces pot deschide fișierul.'}</small></div>
      <div class="cge-bt"><button type="button" class="cge-sec2" data-d="link">Copiază linkul</button><button type="button" class="cg-prim" data-d="gata">Gata</button></div>`;
    ov.innerHTML=`<div class="cge-dlg" role="dialog" aria-modal="true" aria-label="Permite accesul"><h3>Permite accesul: „${esc(f.titlu)}”</h3>
      ${ed?`<label class="cge-adr"><span>Adaugă persoane: scrie adresa de e-mail de la școală</span><span class="cge-chips">${chips}<input type="text" class="cge-in" ${ATR} aria-label="Adresa de e-mail a persoanei" placeholder="${dlg.chips.length?'':'de exemplu nume.prenume@…'}" value="${esc(dlg.q)}"></span></label>
      <div class="cge-sug" role="listbox" aria-label="Persoane din școală">${htmlSug()}</div>`:''}
      <p class="cge-err${dlg.ok?' cge-ok':''}" aria-live="polite">${esc(dlg.err||dlg.ok||'')}</p>${corp}
      <p class="cge-desen">Desen după ajutorul Google în română: pe ecranul adevărat fereastra arată altfel, dar are aceleași părți.</p></div>`;
    const fo=focus&&ov.querySelector(focus);if(fo){fo.focus({preventScroll:true});if(fo.classList.contains('cge-in')){try{const n=fo.value.length;fo.setSelectionRange(n,n)}catch(e){}}}}
  function adaugaChip(adr){adr=sp(adr);if(!adr)return false;
    if(!RE_ADR.test(adr)){dlg.err='Adresa nu e întreagă: are nevoie de @ și de domeniul școlii, fără spații. Sau alege persoana din listă.';desenDlg('.cge-in');return false}
    const m=M[dlg.fid];if(adr.toLowerCase()===m.proprietar.toLowerCase()||adr.toLowerCase()===euAdr().toLowerCase()){dlg.err='Asta e adresa ta (sau a proprietarului): are deja acces.';dlg.q='';desenDlg('.cge-in');return false}
    const p=dupaAdr(adr);dlg.chips.push({adresa:p?p.adresa:adr.toLowerCase(),nume:p?p.nume:''});dlg.q='';
    dlg.err=/@/.test(adr)&&adr.toLowerCase().split('@')[1]!==DOM?'Adresa nu e de la școală. Cu un cont de la școală, se poate să nu poți da acces în afara școlii.':'';dlg.ok='';
    desenDlg('.cge-in');emite('dialog-adresa',{adresa:adr});return true}
  function trimite(){const m=M[dlg.fid];if(!dlg.chips.length)return false;const L=[];
    dlg.chips.forEach(c=>{const x=m.acc.find(a=>a.adresa===c.adresa);if(x)x.rol=dlg.rol;else m.acc.push({adresa:c.adresa,rol:dlg.rol});L.push(c)});
    const rol=dlg.rol;dlg.chips=[];dlg.msg='';
    const nume=L.map(c=>(c.nume||c.adresa)).join(', ');
    toast(m,`Ai dat acces: ${nume} (${numeRol(rol)}).${dlg.notif?' Au primit un e-mail.':''}`);
    inchideDialog();emite('partajat',{id:m.id,adrese:L.map(c=>c.adresa),rol});
    L.forEach(c=>reiaColeg(m,c.adresa));return true}   /* fiecare pas al colegului verifică rolul lui (permis) */
  let nrToast=0;
  function toast(m,t){const el=pagini[m.id];const loc=el&&el.querySelector('.cge-toast-loc');if(!loc)return;const k=++nrToast;loc.innerHTML=`<p class="cge-toast" role="status" data-t="${k}">${esc(t)}</p>`;
    setTimeout(()=>{const x=loc.querySelector(`[data-t="${k}"]`);if(x)x.remove()},6000)}
  function leagaDlg(){
    ov.addEventListener('input',e=>{const t=e.target;if(!dlg)return;
      if(t.classList.contains('cge-in')){dlg.q=t.value;dlg.err='';const s=ov.querySelector('.cge-sug');if(s)s.innerHTML=htmlSug();const er=ov.querySelector('.cge-err');if(er){er.textContent='';er.classList.remove('cge-ok')}}
      else if(t.dataset.d==='msg')dlg.msg=t.value});
    ov.addEventListener('change',e=>{const t=e.target;if(!dlg)return;const m=M[dlg.fid];
      if(t.dataset.d==='rol-nou')dlg.rol=t.value;
      else if(t.dataset.d==='notif')dlg.notif=t.checked;
      else if(t.dataset.d==='general'){m.gen=t.value==='link'?'link':'restrictionat';desenDlg('[data-d="general"]');emite('general',{id:m.id,gen:m.gen})}
      else if(t.dataset.acc){const a=t.dataset.acc;if(t.value==='sterge'){m.acc=m.acc.filter(x=>x.adresa!==a);emite('rol',{id:m.id,adresa:a,rol:null});iese(m,a)}else{const x=m.acc.find(z=>z.adresa===a);if(x)x.rol=t.value;emite('rol',{id:m.id,adresa:a,rol:t.value});reiaColeg(m,a)}desenDlg('[data-d="gata"]')}});
    ov.addEventListener('keydown',e=>{if(!dlg)return;
      if(e.key==='Escape'){e.preventDefault();inchideDialog();return}
      if(e.target.classList.contains('cge-in')){
        if(e.key==='Enter'||e.key===','){e.preventDefault();const s=sugestii(e.target.value);const v=sp(e.target.value);
          if(RE_ADR.test(v))adaugaChip(v);else if(s.length===1)adaugaChip(s[0].adresa);else if(v){dlg.err=s.length?'Sunt mai multe persoane. În Google, Enter poate alege singur prima din listă: ca să fii sigur, apasă tu pe persoana cu adresa bună.':'Adresa nu e întreagă: are nevoie de @ și de domeniul școlii, fără spații.';desenDlg('.cge-in')}}
        else if(e.key==='Backspace'&&!e.target.value&&dlg.chips.length){dlg.chips.pop();desenDlg('.cge-in')}}});
    ov.addEventListener('click',e=>{if(!dlg)return;if(e.target===ov){inchideDialog();return}
      const s=e.target.closest('.cge-s');if(s){adaugaChip(s.dataset.adr);return}
      const b=e.target.closest('[data-d]');if(!b||b.tagName!=='BUTTON')return;const d=b.dataset.d;
      if(d==='scoate'){dlg.chips.splice(+b.dataset.i,1);desenDlg('.cge-in')}
      else if(d==='anuleaza'){dlg.chips=[];dlg.q='';dlg.err='';desenDlg('.cge-in')}
      else if(d==='trimite')trimite();
      else if(d==='gata')inchideDialog();
      else if(d==='link'){dlg.err='Linkul nu-l folosim azi: colegii primesc documentul pe e-mail și îl găsesc în Distribuite cu mine.';desenDlg('[data-d="gata"]')}})}

  /* ---------- legătura cu desenul lui colab-google ---------- */
  O.partajare=(i,f)=>{if(f)deschideDialog(f.id)};
  inst.slot('doc-pagina',(f)=>{if(!f)return null;if(f.tip==='doc')return pagDoc(f);if(f.tip==='prez')return pagPrez(f);
    return `<div class="cge-hartie"><p class="cge-nota">O foaie de calcul Google. Foile de calcul nu le folosim în lecțiile acestea.</p></div>`});
  inst.slot('doc-lateral',f=>f?latDoc(f):null);
  inst.slot('doc-bara',()=>{if(!bara){bara=document.createElement('span');bara.className='cge-bara'}desenBara();return bara});
  inst.on('desenat',()=>{
    const r=inst.root,id=activ(),m=id&&model(id);
    if(m){
      const un=r.querySelector('.cg-unelte');
      if(un&&!un.querySelector('.cge-tb')){
        if(m.tip==='doc'&&poateComenta(m))un.insertAdjacentHTML('beforeend',`<button type="button" class="cge-tb" data-cge="comentariu" aria-label="Adaugă un comentariu (Add comment)" title="Adaugă un comentariu (Ctrl+Alt+M)">💬＋ Adaugă un comentariu</button>`);
        if(m.tip==='prez'&&poateScrie(m))un.insertAdjacentHTML('afterbegin',`<button type="button" class="cge-tb st" data-cge="slide" aria-label="Slide nou (New slide)" title="Slide nou (Ctrl+M)">＋ Slide nou</button>`);
        un.querySelectorAll('.cge-tb').forEach(b=>{b.addEventListener('mousedown',e=>e.preventDefault());
          b.addEventListener('click',()=>{if(b.dataset.cge==='comentariu')deschideCompozitor(m);else slideNou(m)})})}
      /* nota lui colab-google despre fișierele primite („afli în lecția 19”) → ce poți face, după rolul tău */
      r.querySelectorAll('.cg-doc>.cg-nota').forEach(n=>{if(/lecția 19/.test(n.textContent)){const p=per(m.proprietar);n.innerHTML=`${m.tip==='prez'?'Prezentarea e a':'Documentul e al'} ${esc(datP(p))}. ${m.tip==='prez'?'Ți-a dat-o':'Ți l-a dat'} ca <b>${numeRol(m.rolMeu)}</b>: ${POATE[m.rolMeu]||''}.`}});
      /* numele unui fișier primit: editorul îl poate schimba (ca în aplicație) */
      const ti=r.querySelector('.cg-titlu');if(ti&&ti.readOnly&&m.rolMeu==='editor'){ti.readOnly=false;let v0=ti.value;
        ti.addEventListener('focus',()=>{v0=ti.value});ti.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();inst.redenumeste(ti.value)}else if(e.key==='Escape'){e.preventDefault();ti.value=v0;ti.blur()}})}
      if(m.tip==='prez'){const pr=r.querySelector('.cg-doc .cg-nota');if(pr&&/Azi lucrăm doar cu documente/.test(pr.textContent))pr.remove()}}
    if(dlg){const cg=r.querySelector('.cg');if(cg&&ov&&ov.parentNode!==cg)cg.appendChild(ov)}
    desenBara()});
  inst.on('deconectat',()=>{if(dlg)inchideDialog()});
  inst.on('fereastra-inchisa',()=>{if(dlg)inchideDialog()});

  /* ---------- unde se întoarce focusul după un „Verifică” respins (regula 14) ----------
     în ultimul câmp în care a lucrat elevul (paragraful, caseta slide-ului, comentariul, adresa din fereastra de partajare);
     altfel la capătul ultimului paragraf AL LUI; altfel pe foaia documentului / a slide-ului (nu scrie nimic acolo).
     Bara de adrese NU e niciodată ținta: ce tastează copilul ar ajunge acolo, iar Enter ar da o eroare de adresă. */
  let ultimCamp=null;
  const laFocus=e=>{const t=e.target;if(!t||!t.classList)return;const f=activ();
    if(t.classList.contains('cge-bloc'))ultimCamp={k:'p',id:t.dataset.p,f};
    else if(t.classList.contains('cge-cas'))ultimCamp={k:'cas',c:t.dataset.c,f};
    else if(t.dataset&&t.dataset.ta)ultimCamp={k:'ta',ta:t.dataset.ta,f};
    else if(t.classList.contains('cge-in'))ultimCamp={k:'in'};
    else if(t.id==='cg-in-adr'||t.id==='cg-in-par')ultimCamp={k:'sel',sel:'#'+t.id}};
  inst.root.addEventListener('focusin',laFocus);
  function focusLaLucru(){const r=inst.root,me=euAdr(),m=mAct();const bun=n=>!!(n&&n.isConnected&&n.getClientRects().length&&n.getAttribute('contenteditable')!=='false');
    const slMeu=()=>{const sl=r.querySelector('.cge-slide');const s=m&&sl&&m.sl.find(x=>x.id===sl.dataset.s);return !!(s&&s.a===me)};
    const u=ultimCamp;let n=null;
    if(u){if(u.k==='p'&&u.f===activ())n=r.querySelector(`.cge-bloc[data-p="${u.id}"]`);
      else if(u.k==='cas'&&u.f===activ()&&slMeu())n=r.querySelector(`.cge-cas[data-c="${u.c}"]`);
      else if(u.k==='ta')n=r.querySelector(`[data-ta="${u.ta}"]`);
      else if(u.k==='in')n=r.querySelector('.cge-in');
      else if(u.k==='sel')n=r.querySelector(u.sel)}
    if(!bun(n)&&m&&m.tip==='doc'){const p=m.par.filter(x=>x.a===me).slice(-1)[0];n=p&&r.querySelector(`.cge-bloc[data-p="${p.id}"]`);if(!bun(n))n=r.querySelector('.cge-hartie[tabindex]')}
    if(!bun(n)&&m&&m.tip==='prez')n=slMeu()?r.querySelector('.cge-cas-x'):r.querySelector('.cge-scena[tabindex]');
    if(!bun(n))n=['.cge-in','#cg-in-adr','#cg-in-par'].map(s=>r.querySelector(s)).find(bun)||null;
    if(!n)return false;
    if(n.classList.contains('cge-bloc')||n.classList.contains('cge-cas'))caretLaCapat(n);
    else{n.focus({preventScroll:true});if(typeof n.value==='string'){try{const k=n.value.length;n.setSelectionRange(k,k)}catch(e){}}}
    return true}

  function opreste(){pend.forEach(o=>clearTimeout(o.t));pend=[];clearTimeout(cronS)}
  const d0=inst.distruge,r0=inst.reset;
  inst.distruge=()=>{opreste();SELECTII.delete(laSelectie);inst.root.removeEventListener('focusin',laFocus);ultimCamp=null;dlg=null;if(ov&&ov.parentNode)ov.remove();d0()};
  inst.reset=()=>{opreste();M={};pagini={};laterale={};dlg=null;if(ov&&ov.parentNode)ov.remove();rapid=false;ultimaSel=null;ultimCamp=null;r0()};

  /* ---------- API ---------- */
  const laDrive=()=>{const s=inst.stare();const t=(s.file||[]).find(x=>x.ecran==='drive');if(t){if(s.activ!==t.id)inst.comutaFila(t.id);return true}
    inst.filaNoua();inst.mergiLa('drive.google.com');return true};
  inst.echipa={
    stare:()=>JSON.parse(JSON.stringify(M)),
    model:id=>{const m=model(id||activ());return m?JSON.parse(JSON.stringify(m)):null},
    on(n,f){(asc[n]=asc[n]||[]).push(f);return ()=>{asc[n]=asc[n].filter(x=>x!==f)}},
    jurnal:()=>J.slice(),
    persoana:k=>Object.assign({},per(k)),
    deschideDialog,inchideDialog,
    partajeaza(id,adresa,rol){const m=mAct(id);if(!m)return false;if(!dlg||dlg.fid!==m.id)deschideDialog(m.id);if(!adaugaChip(adresa))return false;dlg.rol=rol||'editor';return trimite()},
    seteazaRol(id,adresa,rol){const m=mAct(id);if(!m)return false;const x=m.acc.find(a=>a.adresa===per(adresa).adresa);if(!x)return false;if(rol)x.rol=rol;else m.acc=m.acc.filter(a=>a!==x);emite('rol',{id:m.id,adresa:x.adresa,rol});if(rol)reiaColeg(m,x.adresa);else iese(m,x.adresa);if(dlg)desenDlg();return true},
    general(id,v){const m=mAct(id);if(!m)return false;m.gen=v==='link'?'link':'restrictionat';if(dlg)desenDlg();emite('general',{id:m.id,gen:m.gen});return true},
    scrieParagraf(text,id){const m=mAct(id);if(!m||m.tip!=='doc'||!poateScrie(m))return false;const p={id:idNou('p'),a:euAdr(),t:String(text||''),nou:true,mod:true};m.par.push(p);
      const el=pagini[m.id];if(el){const h=el.querySelector('.cge-hartie');if(h)h.insertAdjacentHTML('beforeend',htmlBloc(m,p))}emite('scris',{id:m.id,pid:p.id,cuvinte:cuvinte(p.t)});return true},
    atinge(autor,text,id){const m=mAct(id);if(!m)return false;const a=per(autor).adresa;const p=m.par.find(x=>x.a===a);if(p){m.atinse[p.id+':t']=true;p.t+=String(text||' x');refaBloc(m,p.id);emite('atins',{id:m.id,pid:p.id});return true}
      const s=m.sl.find(x=>x.a===a);if(s){m.atinse[s.id+':ti']=true;s.ti+=String(text||' x');desenPrez(m);emite('atins',{id:m.id,sid:s.id});return true}return false},
    comenteaza(autorText,text,id){const m=mAct(id);if(!m||m.tip!=='doc')return false;const a=per(autorText).adresa;const p=m.par.slice().reverse().find(x=>x.a===a&&sp(x.t));if(!p)return false;
      const t=sp(p.t),w=t.split(' ').slice(0,4).join(' ');return deschideCompozitor(m,{pid:p.id,s:p.t.indexOf(w),e:p.t.indexOf(w)+w.length,col:false})&&comenteazaAcum(m,text)},
    raspunde(autorFir,text,id){const m=mAct(id);if(!m)return false;const a=per(autorFir).adresa;const c=m.com.find(x=>x.a===a&&!x.rez);if(!c)return false;return raspundeAcum(m,c,text)},
    rezolva(autorFir,id){const m=mAct(id);if(!m)return false;const a=per(autorFir).adresa;const c=m.com.find(x=>x.a===a&&!x.rez);if(!c)return false;return rezolvaAcum(m,c)},
    slideNou:id=>slideNou(mAct(id)),
    scrieSlide(titlu,text,id){const m=mAct(id);if(!m||m.tip!=='prez')return false;const s=m.sl.find(x=>x.id===m.cur);if(!s||s.a!==euAdr())return false;s.ti=String(titlu||'');s.tx=String(text||'');s.mod=true;desenPrez(m);emite('scris',{id:m.id,sid:s.id});return true},
    laDrive,
    deschide(id){const f=inst.fisier(id);if(!f)return false;laDrive();inst.arataLista(f.loc==='distribuite'?'distribuite':'meu');return inst.deschideFisier(id)},
    grabeste(){rapid=true;let n=0;while(pend.length&&n<500){const L=pend;pend=[];L.forEach(o=>{clearTimeout(o.t);o.fn()});n++}return true},
    focusLaLucru,   /* adaos 24.10.2026 (reparația J1): focusul înapoi în câmpul elevului; false = n-a găsit unde */
    _model:id=>mAct(id)};
}
SimColabGoogleExtensie();
function SimColabGoogleExtensie(){G.extensie('echipa',extensie)}

/* ---------------- verificările (pe modelul extensiei + starea lui colab-google) ---------------- */
const X=inst=>inst.echipa;
const ADR=k=>(PERSOANE[k]||{adresa:k}).adresa;
const NUME=k=>(PERSOANE[k]||{nume:k}).nume;
const DAT=k=>datP(PERSOANE[k]||{nume:k});          /* „lui Radu Ene”, „Ioanei Rusu”, „profesorului de TIC” (trecerea 3, AC) */
const LUI_EI=k=>luiEi(PERSOANE[k]||{nume:k});
function fisiereMele(inst,v){const s=inst.stare();const M=X(inst).stare();
  return Object.values(M).filter(m=>(v&&v.fisier)?(v.fisier==='prez'?(m.tip==='prez'&&(s.creat||[]).indexOf(m.id)>=0):m.id===v.fisier):(m.rolMeu==='proprietar'||m.rolMeu==='editor'))}
const toateM=inst=>Object.values(X(inst).stare());
/* comentariile tale (deschise și rezolvate) la textul lui `v` ('eu' = al tău; fără v = oriunde) */
function comentariileMele(inst,v){const me=inst.cont().adresa;const L=[];
  toateM(inst).forEach(m=>m.com.forEach(c=>{if(c.a===me&&(!v||m.par.some(p=>p.id===c.pid&&p.a===(v==='eu'?me:ADR(v)))))L.push(c)}));return L}
const TESTE={
  partajat:{ce:(Q,v,d)=>d||`Ai dat acces ${DAT(v.cine)} (${ADR(v.cine)}), ca ${numeRol(v.rol||'editor')}${v.fisier==='prez'?', la prezentare':''}`,
    f:(s,v,Q,inst)=>fisiereMele(inst,v).some(m=>m.acc.some(a=>a.adresa===ADR(v.cine)&&a.rol===(v.rol||'editor'))),
    m:(s,v,Q,inst)=>{const L=fisiereMele(inst,v);const x=L.map(m=>m.acc.find(a=>a.adresa===ADR(v.cine))).find(Boolean);
      if(x)return `${NUME(v.cine)} are rolul ${numeRol(x.rol)}; trebuie ${numeRol(v.rol||'editor')}. În Permite accesul, schimbă rolul din lista de lângă numele ${LUI_EI(v.cine)}.`;
      const alt=L.map(m=>m.acc.find(a=>a.adresa.split('@')[0].slice(0,4)===ADR(v.cine).split('@')[0].slice(0,4))).find(Boolean);
      if(alt)return `Ai dat acces adresei ${alt.adresa}, care nu e a ${DAT(v.cine)} (${ADR(v.cine)}). Verifică adresa semn cu semn; pe cea greșită o scoți: lista de lângă ea → Elimină accesul.`;
      return `Apasă Permite accesul (sus în dreapta), scrie adresa ${ADR(v.cine)}, alege rolul ${numeRol(v.rol||'editor')} și apasă Trimite.`}},
  doarEchipa:{ce:(Q,v,d)=>d||'N-ai dat acces nimănui din afara echipei',
    f:(s,v,Q,inst)=>fisiereMele(inst,{}).every(m=>m.acc.every(a=>(v||[]).map(ADR).indexOf(a.adresa)>=0)),
    m:(s,v,Q,inst)=>{const a=fisiereMele(inst,{}).map(m=>m.acc.find(x=>(v||[]).map(ADR).indexOf(x.adresa)<0)).find(Boolean);
      return a?`Ai dat acces și adresei ${a.adresa}, care nu e în echipă. Scoate-o: Permite accesul, lista de lângă ea, Elimină accesul.`:''}},
  restrictionat:{ce:(Q,v,d)=>d||'Acces general: a rămas Restricționat (nu Oricine are linkul)',
    f:(s,v,Q,inst)=>fisiereMele(inst,v).every(m=>m.gen==='restrictionat'),
    m:()=>'Ai ales Oricine are linkul: atunci oricine primește linkul intră în fișier. În Permite accesul, la Acces general, alege Restricționat.'},
  deschis:{ce:(Q,v,d)=>d||'Ai deschis fișierul primit',f:(s,v)=>(s.deschise||[]).indexOf(v)>=0,
    m:()=>'În Drive, în stânga, apasă Distribuite cu mine, apoi deschide fișierul (dublu clic; pe telefon, o atingere).'},
  /* doar un paragraf NOU (Enter la sfârșit, apoi scrii): un rând vechi continuat nu e „un rând nou” (reparația J1, 24.10.2026) */
  paragraf:{ce:(Q,v,d)=>d||`Ai scris paragraful tău (cel puțin ${v||5} cuvinte), într-un rând nou`,
    f:(s,v,Q,inst)=>{const me=inst.cont().adresa;return toateM(inst).some(m=>m.par.some(p=>p.a===me&&p.nou&&cuvinte(p.t)>=(v||5)))},
    m:(s,v,Q,inst)=>{const me=inst.cont().adresa;const vechi=toateM(inst).some(m=>m.par.some(p=>p.a===me&&!p.nou&&p.mod));
      return `Clic la sfârșitul ultimului paragraf, Enter, apoi scrie paragraful tău (cel puțin ${v||5} cuvinte).${vechi?' Ai continuat un rând vechi: partea ta stă într-un rând nou, după Enter.':''}`}},
  neatins:{ce:(Q,v,d)=>d||'N-ai schimbat nimic din ce au scris colegii',f:(s,v,Q,inst)=>toateM(inst).every(m=>!Object.keys(m.atinse).length),
    m:(s,v,Q,inst)=>toateM(inst).some(m=>Object.keys(m.atinse).some(k=>k.charAt(0)==='s'))
      ?'Ai schimbat slide-ul unui coleg. Așa ceva se vede la toată echipa. Apasă „Ia-o de la capăt” și scrie doar pe slide-ul tău.'
      :'Ai schimbat textul unui coleg. Așa ceva se vede la toată echipa. Apasă „Ia-o de la capăt” și scrie doar în paragraful tău.'},
  /* cu Q.variante: trece doar un comentariu ales dintre cele potrivite (ok:true), fără unul nepotrivit rămas deschis;
     fără variante (scris liber): ca înainte, cel puțin două cuvinte — testul NU judecă atunci ce spune comentariul */
  comentat:{ce:(Q,v,d)=>d||(Q&&Q.variante?(v?`Ai lăsat la textul ${GEN[v]||DAT(v)} comentariul politicos, care spune exact ce ai schimba`:'Ai lăsat comentariul politicos, care spune exact ce ai schimba')
      :(v?`Ai lăsat un comentariu la textul ${GEN[v]||DAT(v)} (cel puțin două cuvinte)`:'Ai lăsat un comentariu (cel puțin două cuvinte)')),
    f:(s,v,Q,inst)=>{const me=inst.cont().adresa;const L=comentariileMele(inst,v);
      if(Q&&Q.variante)return L.some(c=>c.ok===true)&&!L.some(c=>c.ok===false&&!c.rez);
      return L.some(c=>cuvinte(c.t)>=2)},
    m:(s,v,Q,inst)=>{const rau=Q&&Q.variante&&comentariileMele(inst,v).find(c=>c.ok===false&&!c.rez);
      if(rau)return `Comentariul „${rau.t}” nu e potrivit: ${rau.dece||'nu-l ajută pe coleg'}. Apasă „Ia-o de la capăt” și alege comentariul politicos, care spune exact ce ai schimba.`;
      return `Alege un cuvânt sau o propoziție din textul ${v?(v==='eu'?'tău':'colegului cerut'):'cerut'}, apasă Adaugă un comentariu (sus, în bara de instrumente), ${Q&&Q.variante?'alege comentariul potrivit':'scrie comentariul (cel puțin două cuvinte)'} și apasă Comentează.`}},
  raspuns:{ce:(Q,v,d)=>d||`Ai răspuns la comentariul ${GEN[v]||DAT(v)}`,
    f:(s,v,Q,inst)=>{const me=inst.cont().adresa;return toateM(inst).some(m=>m.com.some(c=>c.a===ADR(v)&&c.rasp.some(r=>r.a===me&&cuvinte(r.t)>=1)))},
    m:(s,v)=>`Clic pe comentariul ${GEN[v]||DAT(v)} (în dreapta), apoi Răspunde: scrii răspunsul și apeși Răspunde.`},
  rezolvat:{ce:(Q,v,d)=>d||`Ai închis comentariul ${GEN[v]||DAT(v)} cu Rezolvă`,
    f:(s,v,Q,inst)=>toateM(inst).some(m=>m.com.some(c=>c.a===ADR(v)&&c.rez)),
    m:(s,v)=>`Pe comentariul ${GEN[v]||DAT(v)}, sus, apasă ✓ Rezolvă.`},
  prezentare:{ce:(Q,v,d)=>d||'Ai făcut o prezentare nouă (Nou, apoi Prezentări Google)',
    f:(s,v,Q,inst)=>{const L=inst.fisiere();return (s.creat||[]).some(id=>{const f=L.find(x=>x.id===id);return f&&f.tip==='prez'})},
    m:()=>'În Drive apasă Nou (sus în stânga), apoi Prezentări Google.'},
  slide:{ce:(Q,v,d)=>d||(v>1?`Ai făcut ${v} slide-uri ale tale, cu titlu și text`:'Ai făcut slide-ul tău: Slide nou, apoi titlul și textul'),
    f:(s,v,Q,inst)=>{const me=inst.cont().adresa;return toateM(inst).reduce((n,m)=>n+m.sl.filter(x=>x.a===me&&cuvinte(x.ti)>=1&&cuvinte(x.tx)>=2).length,0)>=(v||1)},
    m:(s,v,Q,inst)=>{const me=inst.cont().adresa;const x=toateM(inst).map(m=>m.sl.find(y=>y.a===me&&y.nou)).find(Boolean);
      if(!x)return 'Apasă Slide nou (sus în stânga, în bara de instrumente), apoi scrie în caseta de titlu și în caseta de text.';
      return !cuvinte(x.ti)?'Slide-ul tău nu are titlu: clic în caseta de sus și scrie-l.':'Scrie în caseta de text cel puțin două cuvinte.'}}};

/* ---------------- tipul „echipa” (sarcină în simulator, cu teste) ---------------- */
function testeDin(Q){return (Q.teste||[]).map((t,i)=>{const T=TESTE[t.c]||G.TESTE[t.c];if(!T)throw new Error('colab-google-echipa: test necunoscut '+t.c);
  return {c:t.c,v:t.v,i,ce:t.ce||T.ce(Q,t.v,t.d),mm:t.m,T}})}
function evalueaza(Q,inst){const s=inst.stare();return testeDin(Q).map(t=>{let ok=false;try{ok=!!t.T.f(s,t.v,Q,inst)}catch(e){ok=false}
  return {c:t.c,ce:t.ce,ok,m:ok?'':(t.mm||(t.T.m?t.T.m(s,t.v,Q,inst):''))}})}
function hTeste(lista,titlu){return `<div class="cg-teste"><div class="lbl">${titlu} · <span class="nr">0 din ${lista.length} trec</span></div><ol>${lista.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`}
function bifeaza(box,rez,arata){rez.forEach((r,i)=>{const li=box.querySelector(`.cg-teste li[data-i="${i}"]`);if(!li)return;
  li.className=r.ok?'ok':(arata?'rau':'');li.querySelector('.s').textContent=r.ok?'✓':(arata?'✗':'○');li.querySelector('.m').textContent=!r.ok&&arata?r.m:''});
  const n=box.querySelector('.cg-teste .nr');if(n)n.textContent=`${rez.filter(r=>r.ok).length} din ${rez.length} trec`}
function simDin(Q){const o=Object.assign({},Q.sim||{});o.extensii=(o.extensii||[]).concat(['echipa']);
  if(Array.isArray(Q.variante)&&Q.variante.length)o.echipa=Object.assign({},o.echipa||{},{variante:Q.variante});return o}
function solutie(Q,inst,gr){
  const O=Q.sim||{},cont=O.cont||C.ana,T=Q.teste||[],sari=gr&&gr.sari,E=inst.echipa;
  E.grabeste();let primul=true;
  T.forEach(t=>{if(t.c===sari)return;const v=t.v;
    switch(t.c){
      case 'bara':inst.mergiLa(v==='docs'?'docs.google.com':'drive.google.com');break;
      case 'conectat':inst.conecteaza(cont.adresa,cont.parola);break;
      case 'nesalvata':if(inst.stare().bula)inst.raspundeBula('refuza');break;
      case 'distribuite':E.laDrive();inst.arataLista('distribuite');break;
      case 'deschis':E.deschide(v);break;
      case 'partajat':{const adr=gr&&gr.adresa&&primul?gr.adresa:ADR(v.cine);const rol=gr&&gr.rol&&primul?gr.rol:(v.rol||'editor');primul=false;
        let id=null;if(v.fisier&&v.fisier!=='prez')id=v.fisier;if(id&&inst.stare().fila&&inst.stare().fila.doc!==id)E.deschide(id);
        E.partajeaza(null,adr,rol);break}
      case 'doarEchipa':if(gr&&gr.strain)E.partajeaza(null,gr.strain,'editor');break;
      case 'restrictionat':E.general(null,gr&&gr.general?gr.general:'restrictionat');break;
      case 'paragraf':E.scrieParagraf('Eu scriu partea mea: '+Array.from({length:Math.max(2,(v||5))},(_,i)=>'cuvântul'+(i+1)).join(' ')+'.');break;
      case 'neatins':if(gr&&gr.atinge)E.atinge(gr.atinge,' (schimbat)');break;
      case 'comentat':{const V=Q.variante;const t=V?((gr&&gr.varianta!=null&&V[gr.varianta])||V.find(x=>x.ok)||V[0]).text:'Poți adăuga și un exemplu?';E.comenteaza(v||'radu',t);break}
      case 'raspuns':E.raspunde(v,'Da, îl adaug acum.');break;
      case 'rezolvat':E.rezolva(v);break;
      case 'prezentare':E.laDrive();inst.creeazaDocument('prez');break;
      case 'titlu':inst.redenumeste(gr&&gr.titlu!=null?gr.titlu:v);break;
      case 'slide':for(let k=0;k<(v||1);k++){E.slideNou();E.scrieSlide('Partea mea '+(k+1),'Aici scriu ideea mea principală.')}break;
      case 'salvat':inst.verificaSalvarea();break;
      case 'iesit':if(inst.stare().conectat)inst.deconecteaza();break;
      case 'verificat':inst.filaNoua();inst.mergiLa('drive.google.com');break;
      case 'fereastra':inst.inchideFereastra();break;
      default:break}});
  E.grabeste()}
const echipa={
  render(Q,body,api){
    const lista=testeDin(Q);
    body.innerHTML=`<div class="cg-sarcina"><div class="cg-loc"></div>${hTeste(lista,'Testele sarcinii')}<button type="button" class="cg-reset" data-cg="reset">Ia-o de la capăt</button></div>`;
    const loc=body.querySelector('.cg-loc');let inst,stop=[],marcat=false;
    /* după primul „Verifică”, ✗-urile și mesajele rămân la vedere și se actualizează singure: colegii simulați schimbă
       documentul și după apăsare, iar o actualizare fără marcaje le-ar șterge sub ochii elevului */
    const upd=arata=>{if(arata)marcat=true;const r=evalueaza(Q,inst);bifeaza(body,r,marcat);return r};
    const porneste=()=>{stop.forEach(f=>f());stop=[];marcat=false;if(inst)inst.distruge();inst=G.creeaza(loc,simDin(Q));
      stop.push(inst.on('schimbare',()=>upd(false)));stop.push(inst.echipa.on('schimbare',()=>upd(false)));upd(false)};
    porneste();
    body.querySelector('[data-cg="reset"]').onclick=()=>{porneste();if(inst.echipa.focusLaLucru())return;const u=loc.querySelector('#cg-in-adr,[data-a="partajare"],[data-a="profil"],.cg-url');if(u)u.focus({preventScroll:true})};
    body._rezolva=()=>{inst.reset();marcat=false;solutie(Q,inst,null);upd(false)};
    body._gresit=()=>{inst.reset();marcat=false;solutie(Q,inst,Q.gresit||{sari:(Q.teste||[]).slice(-1)[0].c});upd(false)};
    body._inst=()=>inst;
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok).length;
      if(!rau){nav.innerHTML='';api.resolve(true)}
      else{api.resolve(false,`${rau===1?'Un test nu trece':rau+' teste nu trec'} (marcate cu ✗; sub fiecare scrie de ce). Continuă de unde ai rămas și apasă din nou.`,r.every(x=>!x.ok));
        api.revealButton(()=>{body._rezolva();upd(true);nav.innerHTML='';api.giveUp(Q.arata||'am făcut pașii în simulatorul de mai sus: citește-i în ordine și uită-te la teste.')})}
      /* regula 14: focusul înapoi unde lucra elevul (niciodată în bara de adrese, care stă deasupra documentului) */
      if(rau)inst.echipa.focusLaLucru()},Q.buton||'Verifică')},
  rezolva(Q,body){body._rezolva()},
  gresit(Q,body){body._gresit()}};

window.SimColabEchipa={echipa,TESTE,PERSOANE,ROLURI,numeRol,cuvinte};
})();
