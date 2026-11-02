/* lectii/_sim/executant.js — „Robotul din clasă” în pagină: un EXECUTANT care face EXACT ce scrie pe cartonașele
   algoritmului, iar greșeala se VEDE (o instrucțiune lipsă, ordinea greșită, o instrucțiune care se poate face în mai multe
   feluri, ieșirea de pe tablă).

   PROPRIETAR: lecția V/24 (lectii/v/m4-l24, „Ce este un algoritm. Algoritmi din viața de zi cu zi”, 01.11.2026).
   Lecțiile următoare (V/25…) îl EXTIND cu fișiere NOI (`lectii/_sim/<nume>.js`), prin `Executant.instructiune(...)` și
   `Executant.lume(...)`; NU îl rescriu și NU schimbă ce e scris mai jos. Granița: _campaign/revizuire_completa_2026_09/
   m4_noapte_01_11/granite/v_l24.md („API FINAL”, 01.11.2026 ~23:22).

   FIDELITATE: nu simulează o aplicație. Executantul e un robot IMAGINAR, desenat de noi; regula lui e chiar ce predă lecția:
   face pașii în ordine, exact cum sunt scriși, fără să ghicească. Ce face el NU se scrie ca fapt despre Paint sau despre
   alt program.

   LUMILE (Executant.lumi):
     tabla — robotul ține un marker pe o tablă cu pătrățele (ca un caiet de matematică). Stă pe COLȚURILE pătrățelelor:
             x 0…w, y 0…h (y crește în jos). Cu markerul pe tablă, fiecare pătrățel mers lasă o linie.
     drum  — același robot, pe o hartă: stă ÎN pătrățele (x 0…w-1, y 0…h-1); într-o clădire nu intră (se oprește în fața ei).
     turn  — instrucțiuni de asamblare: robotul pune cuburi colorate pe masă, fiecare cub nou DEASUPRA celor puse înainte.

   INSTRUCȚIUNILE (obiecte; textul cartonașului îl face Executant.text(ins, lume), ca toate lecțiile să scrie la fel):
     tabla: {f:'pune'} „Pune markerul pe tablă.” · {f:'ridica'} „Ridică markerul de pe tablă.” ·
            {f:'muta', dir:'sus'|'jos'|'dreapta'|'stanga', n} „Mută markerul 3 pătrățele la dreapta.”
     drum:  {f:'muta', dir, n} „Mergi 2 pătrățele în sus.”
     turn:  {f:'cub', c:'rosu'|'galben'|'verde'|'albastru'|'portocaliu'|'mov'} „Pune cubul roșu.”
     orice lume: {f:'neclar', text:'…', variante:[{eticheta:'…', pasi:[…]},…], de_ce:'…'} — instrucțiunea care se poate face
            în mai multe feluri: robotul NU o face, se oprește înaintea ei și arată ce ar ieși în fiecare fel.

   API PUBLIC (window.Executant) — „API FINAL” 01.11.2026 ~23:22; de acum doar ADĂUGIRI compatibile, cu data în graniță:
     versiune                              '1.1 (02.11.2026)' (1.0 la 01.11.2026)
     lumi                                  {tabla, drum, turn, …} (definițiile)
     text(ins, lume)                       -> propoziția cartonașului
     ruleaza(lume, instructiuni, optiuni)  -> raport, FĂRĂ DOM:
        optiuni: tabla/drum {w, h, start:{x,y}, cladiri:[[x,y,'nume?'],…] (drum), maxPasi}; turn {cutie:['rosu',…], maxPasi}
                 maxPasi implicit 200 (un pătrățel mers / un cub pus = un micro-pas)
        raport:  {lume, ok, oprit:null|'margine'|'cladire'|'neclar'|'lipsa'|'prea_multi'|'necunoscut'|<motivul unei extensii>,
                  pas:<indicele instrucțiunii la care s-a oprit, de la 0; -1>, mesaj:'<propoziția pentru elev>',
                  final:{x,y,marker,segmente:['x1,y1,x2,y2',…],urma:[[x,y],…]} | {turn:[…],cutie:[…]},
                  variante:[{eticheta, final, oprit}] (doar la 'neclar'), micro, urma_pasi:[…] (pentru desenul pas cu pas)}
     compara(lume, final, tinta)           -> {la_fel, lipsa:[…], in_plus:[…]}; tinta: tabla {segmente:[[x1,y1,x2,y2],…]}
                                              (orice lungime; se taie în bucăți de 1, deci ordinea și sensul tragerii nu
                                              contează), turn {turn:[…]} (de jos în sus), drum {la:{x,y}}
     instructiune(lume, def)               -> EXTINDERE: def = {f, text:(ins)=>'…', fa:(st, ins, ctx)=>[micro-pași] | iterator}
                                              ctx.pas(dx,dy) · ctx.marker(true|false) · ctx.cub(c) · ctx.opreste(motiv, mesaj)
                                              (un iterator care nu se termină e oprit după maxPasi: oprit 'prea_multi')
     lume(nume, def)                       -> EXTINDERE: o lume nouă pe regulile unei baze: def = {baza:'tabla'|'drum'|'turn', eticheta}
     tipuri.executant                      -> {render, rezolva, gresit} pentru JocMotor (tipuri:{executant:Executant.tipuri.executant})
     imagine(Q, alg, opt)                  -> HTML: desenul după ce robotul face `alg` (pentru „Uite cum”); opt {legenda, aria,
                                              model:false, variante:false}. ADĂUGAT 01.11.2026 23:30 (compatibil).
     raport.ordine                         -> bucățile de linie în ordinea în care au fost trase (tabla). ADĂUGAT 23:30.

   TIPUL „executant”: Q = {t:'executant', lume, q, harta:{w,h,start,cladiri?,casa?,scoala?,cutie?}, model:{segmente|turn|la},
       alg:[…] (algoritmul de la pornire), cartonase:[…] (paleta: atingi un cartonaș și se pune la capătul algoritmului),
       muta:true (↑ ↓), sterge:true (✕), max:12, teste:[{k:'termina'|'desen'|'turn'|'ajunge', ce, msg?}], sol:[…], gresit:[…],
       ajutor, why, solutieText?}
     Testele judecă REZULTATUL (regula 29): desenul ca mulțime de bucăți, turnul de jos în sus, locul unde a ajuns robotul.
     „termina” = robotul a făcut toți pașii, până la ultimul (nu s-a oprit înainte). Testele se verifică în ordinea din Q.teste; primul care pică
     dă mesajul (pune „termina” primul). Bifele apar abia după primul „Verifică”.
     Butoanele: „▶ Pornește robotul” (pas cu pas, instrucțiunea de acum colorată), „Ia-o de la capăt” (algoritmul și tabla ca la
     pornire; motorul redeschide exercițiul), „Verifică” (al motorului). Fără tragere; toate țintele ≥ 36 px.

   REPARAT 02.11.2026 (v1.1, după judecata 1; API, nume, forma raportului și textele cartonașelor NESCHIMBATE):
     - tabla goală deși robotul a mers: mesajul spune, din urma reală, când a fost pus markerul (J1-A);
     - oprirea ca greșeală: „… înainte de ultimul pas” / „… fără să termine ultimul pas”; oprirea după maxPasi o spune
       PAGINA: „Pagina a oprit robotul după 200 de mișcări, în timpul instrucțiunii N: algoritmul nu se terminase.” (J1-J);
     - felurile instrucțiunii neclare: întâi toate liniile, apoi toate cercurile cu cifre (J1-F).

   CE NU SE SCHIMBĂ: numele lumilor, ale instrucțiunilor (f) și ale testelor (k), forma raportului, textele cartonașelor,
   clasele CSS (prefix ex-), id-ul stilului (#ex-css). Nimic nu se salvează (0 localStorage/sessionStorage/cookie) și nimic
   nu pleacă (0 cereri). */
(function(){
'use strict';
const VERS='1.1 (02.11.2026)';
const DIR={sus:[0,-1],jos:[0,1],dreapta:[1,0],stanga:[-1,0]};
const DIR_T={sus:'în sus',jos:'în jos',dreapta:'la dreapta',stanga:'la stânga'};
const CUL={rosu:{n:'roșu',hex:'#d7263d',ink:'#ffffff'},galben:{n:'galben',hex:'#f5c518',ink:'#16202c'},
  verde:{n:'verde',hex:'#2e9e4f',ink:'#ffffff'},albastru:{n:'albastru',hex:'#1f6fd1',ink:'#ffffff'},
  portocaliu:{n:'portocaliu',hex:'#f08a24',ink:'#16202c'},mov:{n:'mov',hex:'#8e44ad',ink:'#ffffff'}};
const ORD=['primul','al doilea','al treilea','al patrulea','al cincilea','al șaselea','al șaptelea','al optulea'];
const pat=n=>n===1?'1 pătrățel':`${n} pătrățele`;
/* „200 de mișcări”, „12 mișcări”, „o mișcare” (o mișcare = un pătrățel mers, un cub pus, markerul pus sau ridicat) */
const miscari=n=>n===1?'o mișcare':`${n} ${n>=20&&(n%100===0||n%100>=20)?'de ':''}mișcări`;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------------- lumile și instrucțiunile ---------------- */
const LUMI={
  tabla:{baza:'tabla',eticheta:'Tabla cu pătrățele'},
  drum:{baza:'drum',eticheta:'Harta: de acasă la școală'},
  turn:{baza:'turn',eticheta:'Masa cu cuburi'}
};
const INS={tabla:{},drum:{},turn:{}};
const baza=L=>(LUMI[L]||{}).baza||L;
function defIns(L,f){const t=INS[L]||INS[baza(L)]||{};return t[f]||(INS[baza(L)]||{})[f]||null}

INS.tabla.pune={f:'pune',text:()=>'Pune markerul pe tablă.',fa:(st,ins,ctx)=>[ctx.marker(true)]};
INS.tabla.ridica={f:'ridica',text:()=>'Ridică markerul de pe tablă.',fa:(st,ins,ctx)=>[ctx.marker(false)]};
INS.tabla.muta={f:'muta',text:ins=>`Mută markerul ${pat(ins.n)} ${DIR_T[ins.dir]||'?'}.`,
  fa:(st,ins,ctx)=>{const d=DIR[ins.dir];if(!d||!(ins.n>0))return[ctx.opreste('necunoscut','Instrucțiunea nu spune încotro sau cât să meargă.')];
    return Array.from({length:ins.n},()=>ctx.pas(d[0],d[1]))}};
INS.drum.muta={f:'muta',text:ins=>`Mergi ${pat(ins.n)} ${DIR_T[ins.dir]||'?'}.`,fa:INS.tabla.muta.fa};
INS.turn.cub={f:'cub',text:ins=>`Pune cubul ${(CUL[ins.c]||{n:ins.c}).n}.`,fa:(st,ins,ctx)=>[ctx.cub(ins.c)]};
const NECLAR={f:'neclar',text:ins=>ins.text||'(instrucțiune neclară)'};

function text(ins,L){
  if(!ins)return'';
  if(ins.f==='neclar')return NECLAR.text(ins);
  const d=defIns(L,ins.f);
  return d&&d.text?d.text(ins):(ins.text||`(instrucțiune necunoscută: ${ins.f})`);
}

/* ---------------- execuția (fără DOM) ---------------- */
function stareInit(L,o){
  o=o||{};
  if(baza(L)==='turn')return{turn:[],cutie:(o.cutie||Object.keys(CUL)).slice()};
  const s=o.start||{x:0,y:0};
  return{x:s.x,y:s.y,marker:false,seg:[],segSet:new Set(),urma:[[s.x,s.y]],
    w:o.w||8,h:o.h||5,cladiri:new Map((o.cladiri||[]).map(c=>[c[0]+','+c[1],c[2]||'']))};
}
function copie(st){
  if(st.turn)return{turn:st.turn.slice(),cutie:st.cutie.slice()};
  return{x:st.x,y:st.y,marker:st.marker,seg:st.seg.slice(),segSet:new Set(st.segSet),urma:st.urma.map(p=>p.slice()),
    w:st.w,h:st.h,cladiri:st.cladiri};
}
const cheie=(a,b,c,d)=>(a<c||(a===c&&b<=d))?`${a},${b},${c},${d}`:`${c},${d},${a},${b}`;
function finalDin(st){
  if(st.turn)return{turn:st.turn.slice(),cutie:st.cutie.slice()};
  return{x:st.x,y:st.y,marker:st.marker,segmente:[...st.segSet].sort(),urma:st.urma.map(p=>p.slice())};
}
function mkCtx(){
  return{pas:(dx,dy)=>({t:'pas',dx,dy}),marker:v=>({t:'marker',v:!!v}),cub:c=>({t:'cub',c}),
    opreste:(motiv,mesaj)=>({t:'stop',motiv,mesaj})};
}
/* un micro-pas; întoarce null sau {motiv, mesaj} (descrie starea de ACUM, fără să ghicească).
   ultim = instrucțiunea e ultima din algoritm: oprirea ca greșeală se spune mereu „înainte de ultimul pas” / „fără să
   termine ultimul pas” (REPARAT 02.11.2026, J1-J: la V/25 „se oprește” = lucru bun, după ultimul pas). */
function aplica(st,m,L,ins,i,ultim){
  const nr=`instrucțiunea ${i+1}`,sf=ultim?'fără să termine ultimul pas':'înainte de ultimul pas';
  if(m.t==='marker'){st.marker=m.v;return null}
  if(m.t==='cub'){
    const k=st.cutie.indexOf(m.c),nume=(CUL[m.c]||{n:m.c}).n;
    if(k<0)return{motiv:'lipsa',mesaj:`La ${nr}, „${text(ins,L)}”, în cutie nu mai e niciun cub ${nume}. Robotul s-a oprit, ${ultim?'fără să facă ultimul pas':sf}.`};
    st.cutie.splice(k,1);st.turn.push(m.c);return null;
  }
  if(m.t==='pas'){
    const b=baza(L),nx=st.x+m.dx,ny=st.y+m.dy;
    const W=b==='drum'?st.w-1:st.w,H=b==='drum'?st.h-1:st.h;
    const dir=Object.keys(DIR).find(k=>DIR[k][0]===m.dx&&DIR[k][1]===m.dy)||'';
    if(nx<0||ny<0||nx>W||ny>H)return{motiv:'margine',mesaj:`La ${nr}, „${text(ins,L)}”, robotul a ajuns la marginea ${b==='drum'?'hărții':'tablei'} și nu mai are loc să meargă ${DIR_T[dir]||''}. S-a oprit acolo, ${sf}.`};
    if(b==='drum'&&st.cladiri.has(nx+','+ny)){const n=st.cladiri.get(nx+','+ny);
      return{motiv:'cladire',mesaj:`La ${nr}, „${text(ins,L)}”, în fața robotului e ${n?n:'o clădire'}: nu poate merge ${DIR_T[dir]||''}. S-a oprit în fața ${n?'lui':'ei'}, ${sf}.`}}
    if(b==='tabla'&&st.marker){const k=cheie(st.x,st.y,nx,ny);if(!st.segSet.has(k)){st.segSet.add(k);st.seg.push(k)}}
    st.x=nx;st.y=ny;st.urma.push([nx,ny]);return null;
  }
  return null;
}
function exec(st,L,ins,o,urma){
  const max=(o&&o.maxPasi)||200,ctx=mkCtx();let micro=0;
  const snap=i=>{if(urma)urma.push(st.turn?{i,turn:st.turn.slice()}:{i,x:st.x,y:st.y,marker:st.marker,n:st.seg.length})};
  for(let i=0;i<ins.length;i++){
    const it=ins[i]||{},ultim=i===ins.length-1;
    if(it.f==='neclar'){
      const variante=(it.variante||[]).map(v=>{const c=copie(st),r=exec(c,L,v.pasi||[],o,null);return{eticheta:v.eticheta||'',final:finalDin(c),oprit:r.oprit}});
      return{oprit:'neclar',pas:i,micro,variante,
        mesaj:`Instrucțiunea ${i+1}, „${text(it,L)}”${it.de_ce?`, ${it.de_ce}`:''}: se poate face în mai multe feluri. Robotul nu ghicește, așa că s-a oprit înaintea ei, ${ultim?'chiar înainte de ultimul pas':'înainte de ultimul pas'}.`};
    }
    const d=defIns(L,it.f);
    if(!d||!d.fa)return{oprit:'necunoscut',pas:i,micro,mesaj:`Robotul nu știe să facă instrucțiunea ${i+1}.`};
    const seq=d.fa(st,it,ctx);
    const iter=Array.isArray(seq)?seq[Symbol.iterator]():(seq&&typeof seq.next==='function'?seq:[][Symbol.iterator]());
    for(let r=iter.next();!r.done;r=iter.next()){
      const m=r.value;if(!m)continue;
      if(m.t==='stop')return{oprit:m.motiv||'oprit',pas:i,micro,mesaj:m.mesaj||`Robotul s-a oprit la instrucțiunea ${i+1}.`};
      micro++;
      /* VOCEA PAGINII (REPARAT 02.11.2026, J1-J, aliniat cu V/25): oprirea după maxPasi o face PAGINA, nu robotul */
      if(micro>max)return{oprit:'prea_multi',pas:i,micro:max,mesaj:`Pagina a oprit robotul după ${miscari(max)}, în timpul instrucțiunii ${i+1}: algoritmul nu se terminase.`};
      const e=aplica(st,m,L,it,i,ultim);
      if(e){snap(i);return{oprit:e.motiv,pas:i,micro,mesaj:e.mesaj}}
      snap(i);
    }
  }
  return{oprit:null,pas:-1,micro,mesaj:''};
}
function ruleaza(L,ins,o){
  o=o||{};const st=stareInit(L,o),urma=[];
  const r=exec(st,L,ins||[],o,urma);
  return{lume:L,ok:r.oprit===null,oprit:r.oprit,pas:r.pas,mesaj:r.mesaj,final:finalDin(st),variante:r.variante||null,micro:r.micro,
    urma_pasi:urma,ordine:st.seg?st.seg.slice():[]};   // ordine = bucățile de linie în ordinea în care au fost trase (tabla)
}
function unitare(segs){
  const s=new Set();
  (segs||[]).forEach(g=>{let[x1,y1,x2,y2]=g;const dx=Math.sign(x2-x1),dy=Math.sign(y2-y1);
    if(dx&&dy)return;   // doar orizontale și verticale
    while(x1!==x2||y1!==y2){const nx=x1+dx,ny=y1+dy;s.add(cheie(x1,y1,nx,ny));x1=nx;y1=ny}});
  return s;
}
function compara(L,fin,tinta){
  const b=baza(L);tinta=tinta||{};
  if(b==='turn'){const a=(fin&&fin.turn)||[],t=tinta.turn||[];
    const la_fel=a.length===t.length&&a.every((c,k)=>c===t[k]);
    return{la_fel,lipsa:t.filter((c,k)=>a[k]!==c),in_plus:a.filter((c,k)=>t[k]!==c)}}
  if(b==='drum'){const la=tinta.la||{};const ok=fin&&fin.x===la.x&&fin.y===la.y;return{la_fel:!!ok,lipsa:ok?[]:[la],in_plus:[]}}
  const T=unitare(tinta.segmente),A=new Set((fin&&fin.segmente)||[]);
  const lipsa=[...T].filter(k=>!A.has(k)),in_plus=[...A].filter(k=>!T.has(k));
  return{la_fel:!lipsa.length&&!in_plus.length,lipsa,in_plus};
}
function instructiune(L,def){
  if(!def||!def.f)throw new Error('Executant.instructiune: lipsește f');
  if(!INS[L]){if(!LUMI[L])throw new Error('Executant.instructiune: lume necunoscută '+L);INS[L]={}}
  INS[L][def.f]=def;return def;
}
function lume(nume,def){
  if(!def||!LUMI[def.baza]||LUMI[def.baza].baza!==def.baza)throw new Error('Executant.lume: baza trebuie să fie tabla, drum sau turn');
  LUMI[nume]=Object.assign({},def,{baza:def.baza});if(!INS[nume])INS[nume]={};return LUMI[nume];
}

/* ---------------- desenul ---------------- */
const CEL=40,PAD=22,GH=['#e67e22','#8e44ad','#16a085'];
function stil(){
  if(document.getElementById('ex-css'))return;
  const s=document.createElement('style');s.id='ex-css';
  s.textContent=`
.ex{display:grid;gap:10px}
@media (min-width:760px){.ex.ex-lat{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);align-items:start}}
.ex-scena{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:6px}
.ex-scena svg{display:block;width:100%;height:auto;max-width:520px;margin:0 auto}
.ex-scena .ex-et{font-size:.85rem;color:var(--ink2);text-align:center;margin:2px 0 0}
.ex-dr{display:grid;gap:10px;min-width:0}
.ex-alg{border:2px solid var(--accent);border-radius:10px;background:var(--paper2);padding:6px 8px}
.ex-alg>b,.ex-pal>b{font-family:var(--fd);font-weight:600}
.ex-alg ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:5px}
.ex-alg li{display:flex;align-items:center;gap:6px;background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:3px 4px 3px 6px;min-height:40px}
.ex-alg li.ex-acum{outline:3px solid var(--mark);outline-offset:1px;background:var(--sel)}
.ex-alg li.ex-stop{border-color:var(--bad);background:var(--badbg)}
.ex-alg li.ex-neclar .ex-tx{font-style:italic}
.ex-nr{flex:none;min-width:1.7em;font-weight:800;color:var(--accent);text-align:right}
.ex-tx{flex:1 1 auto;min-width:0;line-height:1.3}
.ex-bt{flex:none;display:flex;gap:3px}
.ex-bt button,.ex-cart,.ex-cmd button{font:inherit;cursor:pointer;border-radius:8px;border:1px solid var(--line);background:var(--paper2);color:var(--ink)}
.ex-bt button{min-width:36px;min-height:36px;padding:0 6px;font-weight:800}
.ex-bt button:disabled{opacity:.35;cursor:default}
@media (max-width:480px){.ex-alg li{flex-wrap:wrap;row-gap:2px}.ex-tx{flex:1 1 50%}.ex-bt{margin-left:auto}}
.ex-scena .ex-et .ex-m{color:var(--ink);font-weight:600}.ex-scena .ex-et .ex-m-rau{color:var(--bad);font-weight:600}
.ex-gol{color:var(--ink2);font-size:.9rem;padding:6px}
.ex-pal{border:1px dashed var(--line);border-radius:10px;padding:6px 8px;background:var(--paper)}
.ex-pal .hint,.ex-teste .hint{font-size:.85rem;color:var(--ink2)}
.ex-carts{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.ex-cart{min-height:40px;padding:4px 10px;text-align:left;border:2px solid var(--line);background:var(--paper2);max-width:100%}
.ex-cart.neclar{font-style:italic}
.ex-cmd{display:flex;flex-wrap:wrap;gap:8px}
.ex-cmd button{min-height:40px;padding:4px 12px;font-weight:700}
.ex-cmd .ex-run{background:var(--accent);color:var(--accentInk);border-color:var(--accent)}
.ex-acum{margin:0;min-height:1.4em;font-size:.95rem}
.ex-acum.rau{color:var(--bad)}
.ex-var{font-size:.9rem;margin:4px 0 0;padding-left:1.2em}
.ex-teste{border:1px solid var(--line);border-radius:8px;padding:8px 10px;background:var(--paper2)}
.ex-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.ex-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.ex-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.ex-teste li.ok .s{color:var(--ok)}.ex-teste li.rau .s{color:var(--bad)}
.ex-teste li .m{display:block;font-size:.88rem;color:var(--bad)}
.ex svg .ex-grid{stroke:var(--line);stroke-width:1}
.ex svg .ex-model{stroke:#9aa6b2;stroke-width:6;stroke-dasharray:7 6;stroke-linecap:round;fill:none}
.ex svg .ex-linie{stroke:var(--accent);stroke-width:6;stroke-linecap:round}
.ex svg .ex-linie.plus{stroke:var(--bad)}
.ex svg .ex-txt{fill:var(--ink);font:600 12px var(--fb,system-ui),sans-serif}
.ex svg .ex-txt2{font:700 13px var(--fb,system-ui),sans-serif}
`;
  document.head.appendChild(s);
}
function robot(cx,cy,marker){
  /* capul stă DEASUPRA punctului (cx,cy), ca locul robotului și markerul să se vadă; marker: true = pe tablă (punct plin),
     false = ridicat (cerculeț punctat), null = fără marker (harta, masa). Conturul în culoarea textului (și în tema întunecată). */
  const t=cy-30;
  return `<g aria-hidden="true"><line x1="${cx}" y1="${t}" x2="${cx}" y2="${t-6}" style="stroke:var(--ink,#16202c)" stroke-width="2"/><circle cx="${cx}" cy="${t-7}" r="2.5" fill="#d7263d"/>
<rect x="${cx-12}" y="${t}" width="24" height="20" rx="6" fill="#ffffff" stroke="#16202c" stroke-width="2"/>
<circle cx="${cx-5}" cy="${t+9}" r="2.6" fill="#16202c"/><circle cx="${cx+5}" cy="${t+9}" r="2.6" fill="#16202c"/>
${marker===true?`<line x1="${cx}" y1="${t+20}" x2="${cx}" y2="${cy-5}" style="stroke:var(--accent,#0b5cad)" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="5.5" style="fill:var(--accent,#0b5cad);stroke:var(--paper,#ffffff)" stroke-width="1.5"/>`
  :marker===false?`<circle cx="${cx}" cy="${cy}" r="5" fill="none" style="stroke:var(--ink,#16202c)" stroke-width="1.8" stroke-dasharray="2 2"/>`:''}</g>`;
}
function svgTabla(Q,stare,opt){
  const H=Q.harta||{},w=H.w||8,h=H.h||5,W=w*CEL+2*PAD,Ht=h*CEL+2*PAD+8+16,P=v=>PAD+v*CEL;   // +16 sus: capul robotului pe rândul de sus
  let g='';
  for(let x=0;x<=w;x++)g+=`<line class="ex-grid" x1="${P(x)}" y1="${P(0)}" x2="${P(x)}" y2="${P(h)}"/>`;
  for(let y=0;y<=h;y++)g+=`<line class="ex-grid" x1="${P(0)}" y1="${P(y)}" x2="${P(w)}" y2="${P(y)}"/>`;
  const seg=k=>k.split(',').map(Number);
  let m='';if(Q.model&&Q.model.segmente&&opt.model!==false)unitare(Q.model.segmente).forEach(k=>{const[a,b,c,d]=seg(k);m+=`<line class="ex-model" x1="${P(a)}" y1="${P(b)}" x2="${P(c)}" y2="${P(d)}"/>`});
  const plus=new Set(opt.plus||[]);
  let l='';(stare.segs||[]).forEach(k=>{const[a,b,c,d]=seg(k);l+=`<line class="ex-linie${plus.has(k)?' plus':''}" x1="${P(a)}" y1="${P(b)}" x2="${P(c)}" y2="${P(d)}"/>`});
  /* felurile instrucțiunii neclare: ÎNTÂI toate liniile, APOI toate cercurile cu cifre (REPARAT 02.11.2026, J1-F: linia
     felului 2 acoperea cercul 1) */
  let v='',vc='';(opt.variante||[]).forEach((va,j)=>{const col=GH[j%GH.length];const ss=(va.final.segmente||[]).filter(k=>!(stare.segSet||new Set()).has(k));
    ss.forEach(k=>{const[a,b,c,d]=seg(k);v+=`<line x1="${P(a)}" y1="${P(b)}" x2="${P(c)}" y2="${P(d)}" stroke="${col}" stroke-width="5" stroke-dasharray="4 5" stroke-linecap="round"/>`});
    const fx=P(va.final.x),fy=P(va.final.y);vc+=`<circle cx="${fx}" cy="${fy}" r="10" fill="${col}"/><text x="${fx}" y="${fy+4.5}" text-anchor="middle" class="ex-txt2" fill="#ffffff">${j+1}</text>`});
  v+=vc;
  const s=H.start||{x:0,y:0};
  const st=`<circle cx="${P(s.x)}" cy="${P(s.y)}" r="9" fill="none" stroke="#d7263d" stroke-width="3"/><text x="${P(s.x)}" y="${P(s.y)+24}" text-anchor="middle" class="ex-txt">Start</text>`;
  return `<svg viewBox="0 0 ${W} ${Ht}" role="img" aria-label="${esc(opt.aria||'Tabla cu pătrățele și robotul')}"><g transform="translate(0,16)">${g}${m}${l}${st}${v}${robot(P(stare.x),P(stare.y),!!stare.marker)}</g></svg>`;
}
function svgDrum(Q,stare,opt){
  const H=Q.harta||{},w=H.w||7,h=H.h||5,W=w*CEL+2*PAD,Ht=h*CEL+2*PAD,P=v=>PAD+v*CEL,C=v=>PAD+v*CEL+CEL/2;
  let g='';
  for(let x=0;x<w;x++)for(let y=0;y<h;y++)g+=`<rect x="${P(x)+1}" y="${P(y)+1}" width="${CEL-2}" height="${CEL-2}" rx="3" fill="var(--paper2)" stroke="var(--line)"/>`;
  (H.cladiri||[]).forEach(c=>{const parc=/parc/.test(c[2]||'');g+=`<rect x="${P(c[0])+1}" y="${P(c[1])+1}" width="${CEL-2}" height="${CEL-2}" rx="3" fill="${parc?'#7fbf7f':'#8a96a3'}"/><text x="${C(c[0])}" y="${C(c[1])+4}" text-anchor="middle" class="ex-txt" style="fill:#16202c">${esc((c[2]||'bloc').replace(/^(blocul|parcul)$/,m=>m.slice(0,-2)))}</text>`});
  /* casa și școala: chenarul sub robot, numele DEASUPRA robotului (cu contur în culoarea foii), ca să se citească și când robotul e acolo */
  const loc=(p,col)=>p?`<rect x="${P(p.x)+3}" y="${P(p.y)+3}" width="${CEL-6}" height="${CEL-6}" rx="5" fill="none" stroke="${col}" stroke-width="3"/>`:'';
  const nume=(p,t)=>p?`<text x="${C(p.x)}" y="${P(p.y)+CEL-5}" text-anchor="middle" class="ex-txt" style="paint-order:stroke;stroke:var(--paper,#ffffff);stroke-width:3px">${t}</text>`:'';
  const pc=H.casa||H.start,ps=H.scoala||(Q.model&&Q.model.la);
  g+=loc(pc,'#d7263d')+loc(ps,'#2e9e4f');
  const u=stare.urma||[];
  const tr=u.length>1?`<polyline points="${u.map(p=>C(p[0])+','+C(p[1])).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>`:'';
  let v='',vc='';(opt.variante||[]).forEach((va,j)=>{const col=GH[j%GH.length];const uu=va.final.urma||[];   // întâi liniile, apoi cercurile (J1-F)
    if(uu.length>u.length)v+=`<polyline points="${uu.slice(u.length-1).map(p=>C(p[0])+','+C(p[1])).join(' ')}" fill="none" stroke="${col}" stroke-width="4" stroke-dasharray="4 5"/>`;
    vc+=`<circle cx="${C(va.final.x)}" cy="${C(va.final.y)}" r="9" fill="${col}"/><text x="${C(va.final.x)}" y="${C(va.final.y)+4.5}" text-anchor="middle" class="ex-txt2" fill="#ffffff">${j+1}</text>`});
  v+=vc;
  return `<svg viewBox="0 0 ${W} ${Ht}" role="img" aria-label="${esc(opt.aria||'Harta cu casa, școala și robotul')}">${g}${tr}${v}${robot(C(stare.x),C(stare.y)+16,null)}${nume(pc,'casa')}${nume(ps,'școala')}</svg>`;
}
function svgTurn(Q,stare,opt){
  const model=(Q.model&&Q.model.turn)||[],a=stare.turn||[],n=Math.max(model.length,a.length,4),CW=86,CH=30;
  const W=2*CW+110,Ht=(n+2)*CH+64,baseY=Ht-34;   // un rând în plus sus: robotul stă deasupra turnului
  const cub=(c,x,y,cls)=>{const k=CUL[c]||{n:c,hex:'#999',ink:'#000'};return `<rect x="${x}" y="${y}" width="${CW}" height="${CH-3}" rx="4" fill="${k.hex}" stroke="#16202c" stroke-width="${cls?3:1.5}" ${cls?'stroke-dasharray="5 3"':''}/><text x="${x+CW/2}" y="${y+CH/2+3}" text-anchor="middle" class="ex-txt2" fill="${k.ink}">${k.n}</text>`};
  let g=`<line x1="10" y1="${baseY}" x2="${W-10}" y2="${baseY}" stroke="var(--ink2)" stroke-width="4"/>`;
  const xm=20,xr=W-20-CW;
  if(model.length&&opt.model!==false){g+=`<text x="${xm+CW/2}" y="${baseY+22}" text-anchor="middle" class="ex-txt">Modelul</text>`;model.forEach((c,k)=>{g+=cub(c,xm,baseY-(k+1)*CH)})}
  g+=`<text x="${xr+CW/2}" y="${baseY+22}" text-anchor="middle" class="ex-txt">Turnul robotului</text>`;
  a.forEach((c,k)=>{g+=cub(c,xr,baseY-(k+1)*CH)});
  (opt.variante||[]).forEach((va,j)=>{const t=va.final.turn||[];if(t.length>a.length){const c=t[a.length];
    g+=`<g opacity=".8">${cub(c,xr+(j?16:-16),baseY-(a.length+1)*CH-(j?CH*0.15:0),true)}</g><circle cx="${xr+(j?16:-16)+CW-6}" cy="${baseY-(a.length+1)*CH+6}" r="9" fill="${GH[j%GH.length]}"/><text x="${xr+(j?16:-16)+CW-6}" y="${baseY-(a.length+1)*CH+10.5}" text-anchor="middle" class="ex-txt2" fill="#ffffff">${j+1}</text>`}});
  g+=robot(xr+CW/2,baseY-a.length*CH-4,null);
  return `<svg viewBox="0 0 ${W} ${Ht}" role="img" aria-label="${esc(opt.aria||'Masa cu modelul și turnul robotului')}">${g}</svg>`;
}

/* ---------------- tipul pentru motor ---------------- */
function optRulare(Q){const H=Q.harta||{};return{w:H.w,h:H.h,start:H.start||H.casa,cladiri:H.cladiri,cutie:H.cutie,maxPasi:Q.maxPasi}}
function stareVedere(Q,rap,pana){
  /* starea desenată: la pornire (rap = null) sau după o rulare (până la micro-pasul `pana`, pentru animație) */
  const L=Q.lume,b=baza(L),H=Q.harta||{};
  if(!rap){if(b==='turn')return{turn:[]};const s=H.start||H.casa||{x:0,y:0};return{x:s.x,y:s.y,marker:false,segs:[],segSet:new Set(),urma:[[s.x,s.y]]}}
  const U=rap.urma_pasi||[];
  if(pana==null||pana>=U.length){
    if(b==='turn')return{turn:rap.final.turn.slice()};
    return{x:rap.final.x,y:rap.final.y,marker:rap.final.marker,segs:ordine(rap),segSet:new Set(rap.final.segmente),urma:rap.final.urma}}
  const u=U[pana];
  if(b==='turn')return{turn:u.turn.slice()};
  const segs=ordine(rap).slice(0,u.n);
  return{x:u.x,y:u.y,marker:u.marker,segs,segSet:new Set(segs),urma:rap.final.urma.slice(0,pana+2)};
}
function ordine(rap){return rap.ordine||rap.final.segmente||[]}
/* REPARAT 02.11.2026 (J1-A, regula 28): tabla goală deși robotul a mers = la fiecare pătrățel mers markerul era ridicat
   (cu markerul jos, orice pătrățel mers lasă linie). Din urma reală (urma_pasi, după fiecare micro-pas) spunem și CÂND a
   fost pus markerul, doar dacă e sigur: niciodată / abia după ce a mers / pus, dar ridicat înainte de mers. */
function tablaGoala(rap){
  const U=rap.urma_pasi||[],s0=(rap.final.urma||[[0,0]])[0];
  let px=s0[0],py=s0[1],primMers=-1,ultimMers=-1,primPus=-1;
  U.forEach((u,k)=>{if(u.x!==px||u.y!==py){if(primMers<0)primMers=k;ultimMers=k;px=u.x;py=u.y}if(u.marker&&primPus<0)primPus=k});
  if(primPus<0)return'Tabla a rămas goală: robotul a mers, dar n-a pus deloc markerul pe tablă.';
  if(primPus>ultimMers)return'Tabla a rămas goală: robotul a pus markerul pe tablă abia după ce a mers. Cât timp a mers, markerul era ridicat.';
  if(primPus<primMers)return'Tabla a rămas goală: robotul a pus markerul pe tablă, dar l-a ridicat înainte să meargă.';
  return'Tabla a rămas goală: cât timp robotul a mers, markerul era ridicat.';
}
function ruleazaQ(Q,alg){return ruleaza(Q.lume,alg,optRulare(Q))}
function evalueaza(Q,rap){
  const L=Q.lume,b=baza(L),cmp=compara(L,rap.final,Q.model),T=Q.teste||[];
  return T.map((t,k)=>{
    let ok=true,m='';
    if(t.k==='termina'){ok=rap.ok;m=rap.mesaj+(t.msg?' '+t.msg:'')}
    else if(t.k==='desen'||t.k==='turn'||t.k==='ajunge'){
      ok=cmp.la_fel;
      if(!ok){
        if(b==='tabla'){const gol=!rap.final.segmente.length,mers=rap.final.urma.length>1;
          if(gol)m=mers?tablaGoala(rap):'Tabla a rămas goală: robotul n-a desenat nimic.';
          else if(cmp.in_plus.length)m=`Robotul a desenat și ${cmp.in_plus.length===1?'o bucată de linie care nu e':cmp.in_plus.length+' bucăți de linie care nu sunt'} în model (cu roșu pe tablă)${cmp.lipsa.length?`, iar din model ${cmp.lipsa.length===1?'lipsește o bucată':'lipsesc '+cmp.lipsa.length+' bucăți'} (au rămas punctate, gri)`:''}.`;
          else m=`Desenul nu e gata: din model ${cmp.lipsa.length===1?'lipsește o bucată':'lipsesc '+cmp.lipsa.length+' bucăți'} (au rămas punctate, gri).`}
        else if(b==='turn'){const a=rap.final.turn,tm=(Q.model&&Q.model.turn)||[];
          if(!a.length)m='Pe masă nu e niciun cub.';
          else if(a.length!==tm.length)m=`Turnul robotului are ${a.length===1?'un cub':a.length+' cuburi'}, iar modelul are ${tm.length===1?'unul':tm.length}.`;
          else{const j=a.findIndex((c,i)=>c!==tm[i]);m=`${(ORD[j]||'un').replace(/^./,c=>c.toUpperCase())} cub de jos e ${(CUL[a[j]]||{n:a[j]}).n}, iar în model e ${(CUL[tm[j]]||{n:tm[j]}).n}.`}}
        else m='Robotul nu s-a oprit la școală.';
        if(t.msg)m+=' '+t.msg;
      }
    }
    return{id:t.k+k,ce:t.ce||t.k,ok,m};
  });
}
function porneste(Q,body,api,alg){
  stil();
  const L=Q.lume,b=baza(L),lat=true;
  const S={alg:(alg||Q.alg||[]).map(x=>Object.assign({},x)),rap:null,timer:null,arata:false,acum:-1};
  body._ex=S;
  const muta=Q.muta!==false,sterge=Q.sterge!==false&&(Q.cartonase||[]).length>0,max=Q.max||12;
  body.innerHTML=`<div class="ex${lat?' ex-lat':''}">
  <div class="ex-scena"><div class="ex-svg"></div><p class="ex-et" aria-live="polite"></p></div>
  <div class="ex-dr">
    <div class="ex-alg"><b>Algoritmul</b> <span class="hint">· robotul face pașii de sus în jos</span><ol></ol></div>
    ${(Q.cartonase||[]).length?`<div class="ex-pal"><b>Cartonașele</b> <span class="hint">· atinge unul ca să-l pui la capătul algoritmului</span><div class="ex-carts">${Q.cartonase.map((c,k)=>`<button type="button" class="ex-cart${c.f==='neclar'?' neclar':''}" data-c="${k}">${esc(text(c,L))}</button>`).join('')}</div></div>`:''}
    <div class="ex-cmd"><button type="button" class="ex-run">▶ Pornește robotul</button><button type="button" class="ex-capat">Ia-o de la capăt</button></div>
    <p class="ex-acum" aria-live="polite"></p>
  </div></div>
  ${(Q.teste||[]).length?`<div class="ex-teste"><b>Testele</b> <span class="hint">· se bifează când apeși „Verifică”</span><ol></ol></div>`:''}`;
  const $=s=>body.querySelector(s);
  const acum=(h,rau)=>{const p=$('.ex-acum');p.innerHTML=h||'';p.classList.toggle('rau',!!rau)};
  function deseneazaScena(pana,opt){
    opt=opt||{};const st=stareVedere(Q,S.rap,pana);
    const html=b==='turn'?svgTurn(Q,st,opt):b==='drum'?svgDrum(Q,st,opt):svgTabla(Q,st,opt);
    $('.ex-svg').innerHTML=html;
    const et=$('.ex-et');let cap='';
    if(b==='tabla')cap=`Markerul: ${st.marker?'pe tablă (punctul albastru)':'ridicat (cerculețul punctat)'}.${Q.model&&Q.model.segmente?' Modelul: liniile punctate, gri.':''}`;
    else if(b==='turn'){const rest=(optRulare(Q).cutie||Object.keys(CUL)).slice();(st.turn||[]).forEach(c=>{const j=rest.indexOf(c);if(j>=0)rest.splice(j,1)});
      cap=`În cutie: ${rest.length?rest.map(c=>(CUL[c]||{n:c}).n).join(', '):'niciun cub'}.`}
    else cap=(Q.harta&&(Q.harta.cladiri||[]).length)?'Robotul nu intră în blocuri (gri) și nici în parc (verde): merge doar pe pătrățelele libere.':'';
    /* sub tablă: și ce face robotul ACUM (pe telefon, lista e mai jos și nu se vede cât te uiți la tablă) */
    et.innerHTML=(opt.msg?`<span class="${opt.rau?'ex-m-rau':'ex-m'}">${opt.msg}</span><br>`:'')+esc(cap);
  }
  function scrieAlg(focus){
    const ol=$('.ex-alg ol'),n=S.alg.length;
    ol.innerHTML=n?S.alg.map((ins,i)=>`<li data-i="${i}" class="${ins.f==='neclar'?'ex-neclar':''}${S.acum===i?' ex-acum':''}${S.rap&&!S.rap.ok&&S.rap.pas===i&&S.acum<0?' ex-stop':''}"><span class="ex-nr">${i+1}.</span><span class="ex-tx">${esc(text(ins,L))}</span><span class="ex-bt">${muta?`<button type="button" data-a="sus" aria-label="Mută pasul ${i+1} mai sus" ${i===0?'disabled':''}>↑</button><button type="button" data-a="jos" aria-label="Mută pasul ${i+1} mai jos" ${i===n-1?'disabled':''}>↓</button>`:''}${sterge?`<button type="button" data-a="sterge" aria-label="Scoate pasul ${i+1}">✕</button>`:''}</span></li>`).join('')
      :`<li class="ex-gol">Niciun pas încă. ${(Q.cartonase||[]).length?'Atinge cartonașele de mai jos, în ordinea în care vrei să le facă robotul.':''}</li>`;
    if(focus){const el=body.querySelector(focus);if(el&&!el.disabled)el.focus({preventScroll:true})}
  }
  function scrieTeste(arata){
    const ol=$('.ex-teste ol');if(!ol)return[];
    const T=S.rap?evalueaza(Q,S.rap):(Q.teste||[]).map((t,k)=>({id:t.k+k,ce:t.ce||t.k,ok:false,m:''}));
    ol.innerHTML=T.map((t,k)=>`<li class="${arata?(t.ok?'ok':'rau'):''}"><span class="s">${arata?(t.ok?'✓':'✗'):'○'}</span><span>${k+1}. ${t.ce}${arata&&!t.ok&&t.m?`<span class="m">${esc(t.m)}</span>`:''}</span></li>`).join('');
    return T;
  }
  function opreste(){if(S.timer){clearInterval(S.timer);S.timer=null}S.acum=-1;const r=$('.ex-run');if(r)r.textContent='▶ Pornește robotul'}
  /* cât robotul merge, același buton arată deodată sfârșitul („⏭ Arată tot”) */
  function schimbat(msg,focus){opreste();S.rap=null;S.arata=false;deseneazaScena();scrieAlg(focus);scrieTeste(false);acum(msg||'Algoritmul s-a schimbat. Apasă „▶ Pornește robotul” ca să vezi ce face acum.')}
  function variante(){const v=S.rap&&S.rap.variante;if(!v||!v.length)return'';
    return `<ul class="ex-var">${v.map((x,j)=>`<li><b style="color:${GH[j%GH.length]}">Felul ${j+1}</b>: ${esc(x.eticheta)}</li>`).join('')}</ul>`}
  function dupaRulare(){
    const r=S.rap;scrieAlg();
    const plus=S.arata&&b==='tabla'?compara(L,r.final,Q.model).in_plus:[];
    const m=r.ok?`${S.alg.length===1?'Robotul a făcut singurul pas, exact cum e scris.':`Robotul a făcut toți cei ${S.alg.length} pași, exact cum sunt scriși.`}${b==='drum'?(compara(L,r.final,Q.model).la_fel?' A ajuns la școală.':' Uită-te unde s-a oprit.'):''}`:esc(r.mesaj);
    deseneazaScena(null,{variante:r.variante,plus,msg:m,rau:!r.ok});
    if(r.ok)acum(m);else acum(m+variante(),true);
  }
  function porneste_animatia(){
    if(S.timer){opreste();dupaRulare();return}
    if(!S.alg.length){acum('Algoritmul n-are niciun pas: robotul n-are ce face.',true);return}
    S.rap=ruleazaQ(Q,S.alg);S.arata=false;
    const U=S.rap.urma_pasi||[];let k=-1;
    $('.ex-run').textContent='⏭ Arată tot';
    const pas=()=>{
      k++;
      if(k>=U.length){opreste();dupaRulare();return}
      const m=`Robotul face pasul ${U[k].i+1}: „${esc(text(S.alg[U[k].i],L))}”`;
      S.acum=U[k].i;scrieAlg();deseneazaScena(k,{msg:m});acum(m);
    };
    /* pe ecran îngust, tabla vine la vedere cât merge robotul */
    if(window.innerWidth<760){const sc=$('.ex-scena'),r=sc.getBoundingClientRect();if(r.top<56||r.bottom>window.innerHeight)sc.scrollIntoView({block:'center',behavior:'smooth'})}
    /* starea de pornire, apoi câte un pătrățel (sau un cub) la ~0,35 s */
    S.acum=-1;const r0=S.rap;S.rap=null;deseneazaScena();S.rap=r0;
    if(!U.length){opreste();dupaRulare();return}
    S.timer=setInterval(pas,350);pas();
  }
  body.querySelector('.ex-dr').addEventListener('click',e=>{
    const t=e.target;
    if(t.closest('.ex-run')){porneste_animatia();return}
    if(t.closest('.ex-capat')){opreste();S.alg=(Q.alg||[]).map(x=>Object.assign({},x));schimbat('Totul e ca la început: algoritmul și tabla.');return}
    if(api.done())return;
    const btn=t.closest('.ex-bt button');
    if(btn){const i=+btn.closest('li').dataset.i,a=btn.dataset.a;
      if(a==='sus'&&i>0){[S.alg[i-1],S.alg[i]]=[S.alg[i],S.alg[i-1]];schimbat('',`li[data-i="${i-1}"] [data-a="sus"]`)}
      else if(a==='jos'&&i<S.alg.length-1){[S.alg[i+1],S.alg[i]]=[S.alg[i],S.alg[i+1]];schimbat('',`li[data-i="${i+1}"] [data-a="jos"]`)}
      else if(a==='sterge'){S.alg.splice(i,1);schimbat('',S.alg.length?`li[data-i="${Math.min(i,S.alg.length-1)}"] [data-a="sterge"]`:'.ex-cart')}
      return}
    const c=t.closest('.ex-cart');
    if(c){if(S.alg.length>=max){acum(`Algoritmul are deja ${max} pași: scoate unul (✕) ca să pui altul.`,true);return}
      S.alg.push(Object.assign({},Q.cartonase[+c.dataset.c]));schimbat(`Ai pus pasul ${S.alg.length}: „${esc(text(S.alg[S.alg.length-1],L))}”.`);
      c.focus({preventScroll:true})}
  });
  const verifica=()=>{
    opreste();
    if(!S.alg.length){S.rap=ruleazaQ(Q,S.alg);S.arata=true;scrieTeste(true);deseneazaScena();api.resolve(false,'Algoritmul n-are niciun pas încă.'+((Q.cartonase||[]).length?' Atinge cartonașele, în ordinea în care vrei să le facă robotul.':''));return}
    S.rap=ruleazaQ(Q,S.alg);S.arata=true;dupaRulare();
    const T=scrieTeste(true),k=T.findIndex(x=>!x.ok);
    if(k<0){api.nav().innerHTML='';api.resolve(true);
      setTimeout(()=>{const bb=['inca','pas-next','go','next'].map(i=>document.getElementById(i)).find(e=>e&&e.offsetParent!==null&&!e.disabled);if(bb)bb.focus({preventScroll:true})},0);
      return}
    api.resolve(false,`${T.filter(x=>x.ok).length} din ${T.length} teste trec. ${esc(T[k].m)}`);
    api.revealButton(()=>{opreste();S.alg=(Q.sol||[]).map(x=>Object.assign({},x));S.rap=ruleazaQ(Q,S.alg);S.arata=true;dupaRulare();scrieTeste(true);api.nav().innerHTML='';
      api.giveUp(Q.solutieText||('robotul face acum pașii: '+S.alg.map((x,j)=>`${j+1}. ${esc(text(x,L))}`).join(' ')))});
  };
  deseneazaScena();scrieAlg();scrieTeste(false);
  acum(S.alg.length?'Apasă „▶ Pornește robotul” ca să vezi ce face.':(Q.cartonase||[]).length?'Atinge cartonașele, în ordinea în care vrei să le facă robotul.':'');
  api.checkButton(verifica);
  return S;
}
/* imaginea unei rulări (pentru „Uite cum”): desenul simulatorului după ce robotul face `alg`, ca HTML (SVG cu aria-label) */
function imagine(Q,alg,opt){
  stil();opt=opt||{};const r=ruleaza(Q.lume,alg||[],optRulare(Q)),st=stareVedere(Q,r),b=baza(Q.lume);
  const o={variante:opt.variante===false?null:r.variante,model:opt.model,aria:opt.aria};
  const svg=b==='turn'?svgTurn(Q,st,o):b==='drum'?svgDrum(Q,st,o):svgTabla(Q,st,o);
  return `<figure class="ex ex-fig"><div class="ex-scena">${svg}</div>${opt.legenda?`<figcaption>${opt.legenda}</figcaption>`:''}</figure>`;
}
const tipExecutant={
  render(Q,body,api){porneste(Q,body,api,Q.alg)},
  rezolva(Q,body,api){porneste(Q,body,api,Q.sol)},
  gresit(Q,body,api){porneste(Q,body,api,Q.gresit||Q.alg)}
};

window.Executant={versiune:VERS,lumi:LUMI,culori:CUL,text,ruleaza,compara,instructiune,lume,imagine,
  tipuri:{executant:tipExecutant},
  _stare:body=>body&&body._ex?body._ex:null,_evalueaza:evalueaza,_unitare:unitare};
})();
