/* sim_runner.js — rulatorul de scenarii în SIMULATOR (Etapa 0, 16.11.2026; contractul: ../api_biblioteca.md, §7).
   Îl injectează oracol_comportament.py (O4) într-o pagină servită local; NU face gesturi: gesturile le face Python-ul cu
   mouse și tastatură ADEVĂRATE (Playwright). Aici doar:
     - pregătește aplicația cu starea de pornire a scenariului (scenariu.start);
     - traduce un pas de scenariu în ținta canonică (tintaPas) și ținta în elementul din pagină (element), plus
       „pregătirea” fără de care elementul nu se vede (drum: ex. intri întâi în folderul Ana);
     - citește starea finală pe cheile cerute (stare) și, la „text”/„celule”, ce e PE ECRAN (ecran; O4 le compară).
   Două motoare:
     'biblioteca'     — biblioteca centrală aplicatii/aplicatii.js (window.LH.aplicatii, contractul din api_biblioteca.md);
     'vechi:explorer' — simulatorul VECHI lectii/_sim/explorer-operatii.js sau explorer-organizare.js, desenat într-un
                        container nou, cu un adaptor care citește starea lui internă (body._exo.s). Doar pentru linia de
                        bază de azi; dispare odată cu simulatoarele vechi.
   Celelalte simulatoare vechi (wordobj, excelx, simppt, paint, desktop-windows) n-au adaptor: scenariile lor ies
   „neexecutabile” până există biblioteca (e corect: linia de bază e mare).
   window.LHSimRunner = {motor, pregateste, tintaPas, drum, element, stare, ecran, jurnal} */
(function(){
'use strict';
if(window.LHSimRunner)return;

const J=[];                                  // jurnalul rulatorului (îl citește oracolul la eroare)
const log=m=>{J.push(String(m));if(J.length>200)J.shift()};
let ST=null;                                 // {app, scen, motor, loc, ...}

/* ---------- utilitare ---------- */
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const spatii=t=>String(t==null?'':t).replace(/\s+/g,' ').trim();
/* eticheta accesibilă a unui buton: aria-label, altfel textul fără <small> (scurtăturile scrise mărunt) și fără
   semnele din față (✓ ↶ ⇆ ▾ din simulatoarele vechi = pictograme; în Windows sunt imagini, nu text) */
function eticheta(e){
  if(!e)return '';
  const a=e.getAttribute&&e.getAttribute('aria-label');
  if(a&&!/^(Extinde|Restrânge)\b/.test(a))return spatii(a);
  const c=e.cloneNode(true);c.querySelectorAll('small,svg,.exo-ic,[aria-hidden="true"]').forEach(x=>x.remove());
  return spatii(c.textContent).replace(/^[^\p{L}\p{N}]+/u,'').replace(/\s*[▾›]\s*$/u,'').trim();
}
const vizibil=e=>{if(!e||!e.isConnected)return false;const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return false;
  const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity!==0};
const numeDinCale=p=>{const q=String(p).replace(/\/$/,'');return q.slice(q.lastIndexOf('/')+1)};
const parinte=p=>{const q=String(p).replace(/\/$/,'');const i=q.lastIndexOf('/');return i<0?'':q.slice(0,i+1)};
const eFolder=p=>/\/$/.test(p);
/* ținta canonică a unui element (api_biblioteca.md §3, CONVENTIE_ARBORE.md): data-lh-tinta, plus „:”+data-lh-id când
   există (data-lh-tinta="celula" data-lh-id="B2" -> „celula:B2”); o data-lh-tinta care are deja „:” e scrisă întreagă */
const canon=e=>{const t=e.getAttribute('data-lh-tinta')||'',id=e.getAttribute('data-lh-id');return t.includes(':')||id==null||id===''?t:t+':'+id};

function bib(){const L=(window.LH&&window.LH.aplicatii)||window.LHAplicatii;return L&&typeof L.deschide==='function'&&typeof L.stare==='function'?L:null}
function containerNou(){
  const vechi=document.getElementById('lh-sim-runner');if(vechi)vechi.remove();
  const loc=document.createElement('div');loc.id='lh-sim-runner';
  loc.style.cssText='position:relative;display:block;width:1100px;max-width:calc(100vw - 16px);margin:8px;background:var(--paper,#fff);color:var(--ink,#111);z-index:1';
  document.body.prepend(loc);
  return loc;
}

/* ---------- motorul disponibil pe pagină ---------- */
function motor(app){
  if(bib())return 'biblioteca';
  if(app==='explorer'&&(window.SimExplorerOperatii||window.SimExplorerOrganizare))return 'vechi:explorer';
  return null;
}

/* ---------- pasul de scenariu -> ținta canonică (api_biblioteca.md §7.2) ----------
   Ținta canonică = „<fel>:<valoare>” (orice fel scris cu litere mici și _) sau un nume simplu (document, grila, zona…).
   Pasul poate numi ținta direct (tinta) sau prin parametrii formatului comun al scenariilor:
     id_mso / mso -> mso:<idMso>      celula -> celula:<A1>        diapozitiv -> miniatura:<n>   forma:[d,s] -> forma:<d>/<s>
     cuvant (+aparitia, capat) -> cuvant:<cuvânt>#<n>[@capat]      de_la==pana_la (număr) -> pozitie:<k>
     Explorer: un nume simplu -> lista:<nume>; comanda_panglica în „bara de comenzi” -> bara_comenzi:<comanda>
     meniu {element} -> meniu:<element> */
const CANONIC=/^[a-z_]+:/;
const SIMPLE=new Set(['document','grila','zona','zoom','panza','adresa','cautare','desktop','maner_umplere','fila_file','lista','diapozitiv']);
function tintaObiect(o,app){   // {cuvant, aparitia, capat} | {celula} | număr (poziție) | șir
  if(o==null)return null;
  if(typeof o==='number')return 'pozitie:'+o;
  if(typeof o==='string')return tintaPas({gest:'clic',tinta:o},app);
  if(o.cuvant!=null)return 'cuvant:'+o.cuvant+'#'+(o.aparitia||1)+(o.capat?'@'+o.capat:'');
  if(o.celula!=null)return 'celula:'+String(o.celula).replace(/\$/g,'');
  if(o.tinta!=null)return tintaPas({gest:'clic',tinta:o.tinta},app);
  return null;
}
function tintaPas(pas,app){
  app=app||(ST&&ST.app);
  if(!pas)return null;
  const g=pas.gest;
  if(g==='comanda_panglica'){
    const m=pas.id_mso||pas.mso;
    if(m)return 'mso:'+m;
    if(pas.tinta&&CANONIC.test(pas.tinta))return pas.tinta;
    if(app==='explorer'||/bara de comenzi/i.test(pas.zona||''))return 'bara_comenzi:'+(pas.comanda||pas.tinta);
    return 'panglica:'+[pas.fila,pas.grup,pas.comanda||pas.tinta].filter(Boolean).join('/');
  }
  if(g==='meniu'){const e=pas.element||pas.tinta||pas.comanda;return e&&CANONIC.test(e)?e:'meniu:'+e}
  if(pas.cuvant!=null)return 'cuvant:'+pas.cuvant+'#'+(pas.aparitia||1)+(pas.capat?'@'+pas.capat:'');
  if(typeof pas.de_la==='number'&&(pas.pana_la==null||pas.pana_la===pas.de_la)&&g!=='trage')return 'pozitie:'+pas.de_la;
  if(pas.celula!=null)return 'celula:'+String(pas.celula).replace(/\$/g,'');
  if(pas.diapozitiv!=null&&pas.tinta==null&&pas.forma==null)return 'miniatura:'+pas.diapozitiv;
  if(Array.isArray(pas.forma))return 'forma:'+pas.forma.join('/');
  let t=pas.tinta!=null?pas.tinta:pas.element;
  if(t==null)return null;
  t=String(t);
  if(CANONIC.test(t)||SIMPLE.has(t))return t;
  if(app==='excel'&&/^\$?[A-Z]{1,3}\$?\d+$/.test(t))return 'celula:'+t.replace(/\$/g,'');
  if(app==='explorer')return 'lista:'+t;
  return t;
}

/* ---------- dreptunghiul unei ținte de TEXT (cuvant:<cuvânt>#n@capat, pozitie:k) ----------
   Biblioteca îl dă prin LH.aplicatii.dreptunghi(app, ținta); altfel îl caut eu în textul randat din [data-lh-zona]
   (paragrafele = elementele cu ținta canonică „text:N” sau „paragraf:N”, între ele un caracter de capăt de paragraf, ca în
   Range.Start din Word). Întoarce {x,y,w,h,capat} în coordonatele ferestrei, sau null. */
function textRadacina(){
  if(!ST)return null;
  const r=(ST.loc&&ST.loc.querySelector('[data-lh-aplicatie]'))||ST.loc;
  return r&&(r.querySelector('[data-lh-zona]')||r);
}
function bucatiText(z){
  const par=[...z.querySelectorAll('[data-lh-tinta]')].filter(e=>/^(text|paragraf):\d+$/.test(canon(e)));
  const blocuri=par.length?par:[z];const out=[];let k=0;
  blocuri.forEach((b,bi)=>{if(bi)k+=1;
    const w=document.createTreeWalker(b,NodeFilter.SHOW_TEXT);let n=w.nextNode();
    while(n){out.push({n,de:k,la:k+n.data.length});k+=n.data.length;n=w.nextNode()}});
  return out;
}
const LITERA=/[\p{L}\p{N}]/u;
function dreptunghi(t){
  if(!ST||!t)return null;
  const L=bib();
  if(ST.motor==='biblioteca'&&L&&typeof L.dreptunghi==='function'){
    try{const r=L.dreptunghi(ST.app,t);
      if(r)return {x:r.x!=null?r.x:r.left,y:r.y!=null?r.y:r.top,w:r.width!=null?r.width:r.w,h:r.height!=null?r.height:r.h,capat:r.capat}}
    catch(e){log('dreptunghi '+t+': '+e)}}
  const z=textRadacina();if(!z)return null;
  const B=bucatiText(z);if(!B.length)return null;
  let m=/^cuvant:(.*?)(?:#(\d+))?(?:@(stanga|dreapta|mijloc))?$/.exec(t);
  if(m){
    const cuv=m[1];let n=+(m[2]||1),gasit=null;
    for(const b of B){
      const s=b.n.data;let i=s.indexOf(cuv);
      while(i>=0){
        const inainte=i===0||!LITERA.test(s[i-1]),dupa=i+cuv.length>=s.length||!LITERA.test(s[i+cuv.length]);
        if(inainte&&dupa){n-=1;if(n===0){gasit={b,i};break}}
        i=s.indexOf(cuv,i+1);
      }
      if(gasit)break;
    }
    if(!gasit)return null;
    const interval=document.createRange();interval.setStart(gasit.b.n,gasit.i);interval.setEnd(gasit.b.n,gasit.i+cuv.length);
    const r=interval.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height,capat:m[3]||'mijloc'};
  }
  m=/^pozitie:(\d+)$/.exec(t);
  if(m){const k=+m[1];
    for(const b of B){
      if(k<b.de||k>b.la)continue;
      const interval=document.createRange();
      if(k<b.la){interval.setStart(b.n,k-b.de);interval.setEnd(b.n,k-b.de+1);const r=interval.getBoundingClientRect();return {x:r.left,y:r.top,w:0,h:r.height,capat:'stanga'}}
      if(b.la>b.de){interval.setStart(b.n,k-b.de-1);interval.setEnd(b.n,k-b.de);const r=interval.getBoundingClientRect();return {x:r.right,y:r.top,w:0,h:r.height,capat:'stanga'}}
    }
    return null}
  return null;
}

/* ============================ MOTORUL „biblioteca” ============================ */
const B={
  async pregateste(scen){
    const L=bib();
    if(L.gata&&typeof L.gata.then==='function')await L.gata;
    ST.loc=containerNou();
    const opt={loc:ST.loc,continut:scen.start||{},scenariu:true,focus:true};
    if(scen.profil)opt.profil=scen.profil;
    ST.inst=await L.deschide(scen.aplicatie,opt);
    ST.cum='biblioteca aplicatii/aplicatii.js (LH.aplicatii.deschide, versiunea '+((L.versiune)||'?')+')';
  },
  element(t){
    const L=bib();let e=null;
    try{if(typeof L.element==='function')e=L.element(ST.app,t)}catch(x){log('element('+t+'): '+x)}
    if(e&&e.nodeType===1)return e;
    const r=ST.loc.querySelector('[data-lh-aplicatie]')||ST.loc;
    if(t.startsWith('mso:'))return [...r.querySelectorAll('[data-lh-id-mso="'+CSS.escape(t.slice(4))+'"]')].find(vizibil)||null;
    return [...r.querySelectorAll('[data-lh-tinta]')].find(e=>canon(e)===t&&vizibil(e))||null;
  },
  folderCurent(){try{const s=B.stare(['cale_curenta']).cale_curenta;return s&&s!=='__LIPSA__'?numeDinCale(s):null}catch(e){return null}},
  stare(chei){
    const L=bib();const s=(ST.inst&&typeof ST.inst.stare==='function')?ST.inst.stare():L.stare(ST.app);
    const o={};(chei||Object.keys(s||{})).forEach(k=>{o[k]=s&&k in s?s[k]:undefined});
    return JSON.parse(JSON.stringify(o,(k,v)=>v===undefined?'__LIPSA__':v));
  },
  /* ce e PE ECRAN la cheile „text” (Word) și „celule” (Excel), citit DOAR din DOM — O4 îl compară cu stare() (reparația
     10 din verificare_etapa0.md: un model corect cu un ecran neredesenat nu trebuie să treacă). Convenția (§3): în zona de
     lucru ([data-lh-zona]; fără ea, toată rădăcina) paragrafele = țintele text:N (sau paragraf:N), celulele = țintele
     celula:<A1>; textul de pe ecran al unui element = textEcran(). Doar elementele vizibile. */
  ecran(chei){
    const o={},k=new Set(chei||[]);
    if(!k.has('text')&&!k.has('celule'))return o;
    const r=(ST.loc&&ST.loc.querySelector('[data-lh-aplicatie]'))||ST.loc;if(!r)return o;
    const Z=[...r.querySelectorAll('[data-lh-zona]')],zone=Z.length?Z:[r],tinte=[],vazut=new Set();
    zone.forEach(z=>[z,...z.querySelectorAll('[data-lh-tinta]')].forEach(e=>{
      if(!e.hasAttribute('data-lh-tinta')||vazut.has(e))return;
      const sus=e.parentElement&&e.parentElement.closest('[data-lh-tinta]');
      if(sus&&r.contains(sus)&&canon(sus)===canon(e))return;   // bucățile marcate la fel ca părintele: textul e deja în el
      vazut.add(e);tinte.push(e)}));
    const pre=e=>/^(pre|break-spaces)/.test(getComputedStyle(e).whiteSpace||'');
    if(k.has('text')){
      const par={};
      tinte.forEach(e=>{const m=/^(?:text|paragraf):(\d+)$/.exec(canon(e));if(!m||!vizibil(e))return;
        const n=+m[1];if(!par[n])par[n]={n,t:'',pre:pre(e)};par[n].t+=textEcran(e)});
      o.text={paragrafe:Object.values(par).sort((a,b)=>a.n-b.n),zona:Z.length>0};
    }
    if(k.has('celule')){
      const cel={};
      tinte.forEach(e=>{const m=/^celula:\$?([A-Za-z]{1,3})\$?(\d+)$/.exec(canon(e));if(!m||!vizibil(e))return;
        const a=m[1].toUpperCase()+m[2],t=textEcran(e);if(!(a in cel)||(!cel[a]&&t))cel[a]=t});
      o.celule={celule:cel,zona:Z.length>0};
    }
    return o;
  }
};
/* textul pe care îl VEDE elevul într-un element: nodurile de text randate (fără subarborii aria-hidden="true" — marcajele ¶,
   cursorul, decorațiile — fără display:none, fără visibility:hidden), plus valoarea câmpurilor de editare din el
   (input/textarea: celula în editare); <br> = rând nou */
function textEcran(el){
  let out='';
  const w=document.createTreeWalker(el,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode(n){
    if(n.nodeType===3){const p=n.parentElement;return p&&getComputedStyle(p).visibility==='visible'?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}
    if(n.getAttribute('aria-hidden')==='true'||getComputedStyle(n).display==='none')return NodeFilter.FILTER_REJECT;
    return /^(INPUT|TEXTAREA|BR)$/.test(n.tagName)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});
  for(let n=w.nextNode();n;n=w.nextNode()){
    if(n.nodeType===3)out+=n.data;else if(n.tagName==='BR')out+='\n';else out+=String(n.value==null?'':n.value)}
  return out;
}

/* ============================ MOTORUL „vechi:explorer” ============================ */
const BAZA='C:/Users/Elev/Documents/';
const X={
  sim(){return window.SimExplorerOperatii||window.SimExplorerOrganizare},
  modul(){return window.SimExplorerOperatii?window.ExplorerOperatii:window.ExplorerOrganizare},
  s(){return ST.body&&ST.body._exo&&ST.body._exo.s},
  async pregateste(scen){
    const st=scen.start||{},Sim=X.sim();
    if(!st.folder)throw new Error('start.folder lipsește (formatul scenariului Explorer)');
    const W=BAZA+st.folder+'/',fs=[W],cont={};
    (st.arbore||[]).forEach(n=>{fs.push(W+n);if(st.continut&&st.continut[n]!=null)cont[W+n]=st.continut[n]});
    if(st.sursa_lipirii){const sl=st.sursa_lipirii,S=BAZA+sl.folder+'/';fs.push(S);
      (sl.arbore||[]).forEach(n=>{fs.push(S+n);if(sl.continut&&sl.continut[n]!=null)cont[S+n]=sl.continut[n]})}
    const set=st.setari||{};
    const Q={fs,doc:BAZA,start:W,extensii:!!set.extensii_vizibile,desktop:true,checks:[],acum:'16.11.2026 21:43'};
    ST.W=W;ST.loc=containerNou();
    const body=document.createElement('div');ST.loc.appendChild(body);ST.body=body;
    const api={esc,checkButton(){},resolve(){},revealButton(){},giveUp(){},feedback(){}};
    Sim.render(Q,body,api);
    const s=X.s();if(!s)throw new Error('simulatorul vechi nu a expus starea (body._exo.s)');
    Object.entries(cont).forEach(([p,c])=>{const i=s.M.f.get(p);if(i)i.continut=c});
    ST.cum='simulator vechi '+(window.SimExplorerOperatii?'lectii/_sim/explorer-operatii.js':'lectii/_sim/explorer-organizare.js')+
      ' pe pagina '+location.pathname+', gesturi Playwright (mouse/tastatură reale), starea din body._exo.s';
    if(st.sortare&&!(st.sortare.coloana==='Nume'&&/^cresc/.test(st.sortare.directie||'')))log('sortarea cerută nu e în simulatorul vechi: '+JSON.stringify(st.sortare));
    /* dialogurile: le fotografiez când apar (textul vizibil) și notez butonul apăsat cu adevărat */
    ST.dialog=null;ST.semn='';
    const foto=()=>{const d=body.querySelector('.exo-dlg');if(!d){ST.semn='';return}
      const titlu=spatii((d.querySelector('.t span')||{}).textContent);
      const mare=d.querySelector('.c p.mare');
      const ps=[...d.querySelectorAll('.c > p')].filter(p=>!p.classList.contains('exo-mic')&&!p.querySelector('.exo-ic'));
      const intrebare=mare?spatii(mare.textContent):ps.map(p=>spatii(p.textContent)).join('\n\n');
      const butoane=[...d.querySelectorAll('button')].filter(b=>b.dataset.d!=='x').map(eticheta);
      const semn=titlu+'|'+intrebare+'|'+butoane.join('|');
      if(semn!==ST.semn){ST.semn=semn;ST.dialog={titlu,intrebare,butoane,apasat:null}}};
    new MutationObserver(foto).observe(body,{childList:true,subtree:true});
    body.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.exo-dlg button');
      if(b&&ST.dialog)ST.dialog.apasat=b.dataset.d==='x'?'Închidere':eticheta(b)},true);
  },
  element(t){
    const r=ST.body&&ST.body.querySelector('.exo');if(!r)return null;
    const s=X.s(),M=s&&s.M,cauta=(sel,f)=>[...r.querySelectorAll(sel)].filter(vizibil).find(f)||null;
    const [k,...rest]=t.split(':');const v=rest.join(':');
    if(k==='fereastra')return cauta('.exo-dlg button',b=>b.dataset.d!=='x'&&eticheta(b)===v)||(v==='Închidere'?cauta('.exo-dlg button[data-d="x"]',()=>true):null);
    if(k==='meniu')return cauta('.exo-mn button',b=>eticheta(b)===v||b.title===v);
    if(k==='bara_comenzi')return cauta('.exo-cmd button',b=>(b.title||'').replace(/\s*\(.*\)\s*$/,'')===v||eticheta(b)===v);
    if(k==='desktop')return /^Co[sș]/i.test(v)?cauta('[data-cos-desk]',()=>true):null;
    if(k==='cos')return cauta('.exo-rand.cosr[data-cos]',e=>{const c=s.cos[+e.dataset.cos];return c&&(numeDinCale(c.orig)===v||spatii((e.querySelector('.t')||{}).textContent)===v)});
    if(k==='arbore')return cauta('.exo-arb [data-nav]',b=>{const p=b.dataset.nav;return numeDinCale(p)===v||(M&&X.modul()&&X.modul().afis(M,p)===v)||spatii(b.textContent)===v});
    if(k==='lista'){if(v.includes('/'))return null;
      return cauta('.exo-lista [data-p]',e=>numeDinCale(e.dataset.p)===v||spatii((e.querySelector('.t')||{}).textContent)===v)}
    if(k==='nav')return cauta('.exo-nav3 button[data-n="'+({sus:'sus',inapoi:'ina',inainte:'inf'}[v]||v)+'"]',()=>true);
    if(t==='adresa')return cauta('.exo-bara',()=>true);
    if(t==='cautare')return cauta('.exo-caut input',()=>true);
    if(t==='zona'||t==='lista')return cauta('.exo-lista',()=>true);
    return null;
  },
  folderCurent(){const s=X.s();return s&&s.cur&&s.cur!=='PC'&&s.cur!=='COS'?numeDinCale(s.cur):s&&s.cur},
  stare(chei){
    const s=X.s(),M=s.M,W=ST.W,mod=X.modul();
    const copiiW=[...M.f.keys()].filter(p=>p!==W&&parinte(p)===W);
    const o={};
    for(const k of chei){
      if(k==='nume_fisiere')o[k]=copiiW.map(p=>numeDinCale(p)+(eFolder(p)?'/':''));
      else if(k==='ordine_afisata')o[k]=(mod&&mod.copii?mod.copii(M,W):copiiW).map(p=>numeDinCale(p)+(eFolder(p)?'/':''));
      else if(k==='in_cos')o[k]=s.cos.filter(e=>parinte(e.orig)===W).map(e=>numeDinCale(e.orig)+(eFolder(e.orig)?'/':''));
      else if(k==='continut_fisiere'){const c={};copiiW.forEach(p=>{const i=M.f.get(p);if(i&&i.continut!==undefined)c[numeDinCale(p)]=i.continut});o[k]=c}
      else if(k==='dialog')o[k]=ST.dialog?Object.assign({},ST.dialog):null;
      else if(k==='cale_curenta')o[k]=s.cur;
      else o[k]='__LIPSA__';
    }
    return o;
  }
};

/* ============================ interfața comună ============================ */
const MOT={'biblioteca':B,'vechi:explorer':X};
async function pregateste(scen){
  const app=scen.aplicatie,m=motor(app);
  ST={app,scen,motor:m};
  if(!m)return {ok:false,motor:null,eroare:'pe această pagină nu e nici biblioteca (window.LH.aplicatii), nici un simulator vechi cu adaptor pentru „'+app+'”'};
  try{await MOT[m].pregateste(scen);return {ok:true,motor:m,cum:ST.cum}}
  catch(e){return {ok:false,motor:m,eroare:'pregătirea a eșuat: '+(e&&e.message||e)}}
}
function element(t){if(!ST||!ST.motor)return null;try{return MOT[ST.motor].element(t)}catch(e){log('element '+t+': '+e);return null}}
/* „drum” (Explorer): ce gest trebuie făcut ÎNAINTE ca ținta să fie pe ecran, unul câte unul (Python-ul îl face cu
   mouse-ul adevărat și întreabă din nou, de cel mult 6 ori). Ținta „lista:Ana/tema.docx” = elementul tema.docx din
   folderul Ana: dacă nu suntem în Ana, intrăm în el — dublu clic pe el în listă, clic pe el în panoul de navigare, sau
   un nivel mai sus (nav:sus) până se vede. Ținta „lista:Colegul” care nu e în folderul curent: un nivel mai sus până
   apare în listă (sau clic în panoul de navigare, dacă se vede acolo). Întoarce {gata:true, finala} sau {gest, tinta}.
   La fel pe ambele motoare: biblioteca trebuie să aibă țintele lista:, arbore:, nav:sus și cheia cale_curenta. */
function drum(t){
  if(!ST||ST.app!=='explorer'||!t||!t.startsWith('lista:'))return {gata:true,finala:t};
  const x=t.slice(6),i=x.lastIndexOf('/');
  const dir=i>=0?numeDinCale(x.slice(0,i)):null,nume=i>=0?x.slice(i+1):x;
  const sus=()=>element('nav:sus')?{gest:'clic',tinta:'nav:sus'}:{gata:false,eroare:'ținta „'+t+'” nu se vede și nu am cum urca un nivel (nav:sus)'};
  if(dir!==null){
    const cur=MOT[ST.motor].folderCurent();
    if(cur===dir)return element('lista:'+nume)?{gata:true,finala:'lista:'+nume}:{gata:false,eroare:'„'+nume+'” nu e în folderul '+dir};
    if(element('lista:'+dir))return {gest:'dublu_clic',tinta:'lista:'+dir};
    if(element('arbore:'+dir))return {gest:'clic',tinta:'arbore:'+dir};
    return sus();
  }
  if(element(t))return {gata:true,finala:t};
  if(element('arbore:'+nume))return {gata:true,finala:'arbore:'+nume};
  return sus();
}
function stare(chei){return MOT[ST.motor].stare(chei)}
/* ecranul la cheile text/celule — doar motorul „biblioteca”; simulatorul vechi de Explorer n-are aceste chei ({}) */
function ecran(chei){const m=ST&&MOT[ST.motor];return m&&typeof m.ecran==='function'?m.ecran(chei):{}}
window.LHSimRunner={motor,pregateste,tintaPas,tintaObiect,dreptunghi,drum,element,stare,ecran,jurnal:()=>J.slice(),versiune:'2026-11-17'};
})();
