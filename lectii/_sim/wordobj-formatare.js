/* lectii/_sim/wordobj-formatare.js — Word-ul simulat, FORMATAREA textului și a paragrafului (LearningHub, 27.09.2026).

   PROPRIETAR: autorul lecției VII · M1 · 6 („Formatarea textului și a paragrafului”).
   SE ÎNCARCĂ DUPĂ lectii/_sim/wordobj.js (îi folosește regulile de spații și de cuvânt, TipWordObiecte.MODEL, și stilul
   .wo-*) și după jocuri/_motor/ui-panglica.js + panglica-word.js (panglica reală a Word-ului instalat).
   Tipul de exercițiu: `wordfmt` -> tipuri:{wordfmt:TipWordFormat}. wordobj.js NU se modifică.

   CE FACE, CA ÎN WORD (fiecare fapt probat în Word-ul real prin COM: lectii/vii/m1-l06/_proba/rezultate_word.json):
   - Fiecare literă are formatarea ei: aldin, cursiv, subliniat, font, mărime (pt), culoare. Fiecare paragraf are
     alinierea, retragerea din stânga/dreapta, alineatul (primul rând), spațiul înainte/după și spațierea între rânduri.
     Documentul nou: Calibri (Body) 11 pt, la stânga, 8 pt după paragraf, spațiere 1,08 (probat).
   - B / I / U (butoanele, Ctrl+B/I/U): pe o selecție pornesc sau opresc formatarea după PRIMUL caracter selectat
     (probat: „vin” aldin + „eri” normal -> totul normal; invers -> totul aldin). Apăsat încă o dată = scoate formatarea.
   - Fără selecție, cu cursorul ÎN MIJLOCUL unui cuvânt: se formatează tot cuvântul, fără spațiul de după (probat la
     B, I, U, Grow Font, Font Color și la fereastra Font). La începutul sau la capătul cuvântului, după spațiu, la capătul
     paragrafului: textul nu se schimbă, dar ce tastezi de acum are formatarea (probat).
   - Dublu-clic pe cuvânt ia și spațiul de după, deci Subliniat subliniază și spațiul (probat).
   - Mărimea: lista Word (8…72), sau scrisă (1–1638, din jumătate în jumătate: 13,3 -> 13, probat). Grow/Shrink Font:
     11 -> 12 -> 14 -> … -> 72 -> 80 -> 90; 11 -> 10 -> 9 -> … (probat).
   - Font Color: partea din stânga pune culoarea de pe buton (la început roșu, RGB 238,0,0 — probat); săgeata ▾ deschide
     culorile standard.
   - Alinierea (butoanele Align Left / Center / Align Right / Justify, Ctrl+L/E/R/J) se aplică paragrafului în care stă
     cursorul sau tuturor paragrafelor atinse de selecție (probat). COMUTAREA, la taste ȘI la butoane (TASTE REALE
     postate în Word + ExecuteMso, probat 27.09 după judecător; FindKey().Execute() ocolea comutarea și dăduse o
     concluzie falsă): dacă toate paragrafele țintă au deja alinierea cerută, Center / Align Right / Justify le întorc
     la stânga, iar Align Left (Ctrl+L) le face stânga-dreapta; altfel primesc alinierea cerută (J, E, R, J, L la rând
     nu trec prin stânga). Butonul Justify: prin ExecuteMso nu se poate apăsa; se poartă ca tasta Ctrl+J (probată).
   - Increase / Decrease Indent: retragerea din stânga crește/scade cu 1,25 cm, nu sub 0 (probat).
   - Fereastra Paragraph (săgeata mică din colțul grupului): Alignment, Indentation (Left, Right, Special: First line /
     Hanging, By), Spacing (Before, After, Line spacing: Single / 1.5 lines / Double / Multiple, At).
   - Stânga-dreapta: rândurile ajung la ambele margini, ultimul rând al paragrafului rămâne la stânga (probat pe poziții).
   - Enter: paragraful nou păstrează alinierea (probat). Backspace la începutul paragrafului îl unește cu cel de sus, care
     își păstrează alinierea (probat) — dar, ca în Word cu opțiunea „Set left- and first-indent with tabs and backspaces”
     (pornită, probat TabIndentKey=True), întâi scoate alineatul, apoi retragerea; Tab la începutul unui paragraf cu text
     pune alineat de 1,25 cm (NEPROBAT prin COM: efectul tastelor, trecut ca NESIGUR în afirmatii.json).
   - Ctrl+Z anulează câte o comandă (B, apoi I = două anulări, probat), Ctrl+Y reface. Copierea păstrează formatarea
     (probat). Selectarea, ștergerea, spațiile la lipire: aceleași reguli ca wordobj.js (probate în lecția 5).
   Abateri SPUSE PE ECRAN: lista de fonturi e scurtă; lipsesc culorile temei; fereastra Font (Ctrl+D) și celelalte
   butoane ale filei nu sunt simulate (spun asta la clic); la Line spacing lipsesc „At least” și „Exactly”.

   CONFIGURAȚIA unui exercițiu: {t:'wordfmt', unelte:['caractere','paragraf','text'], q, start:[…], pre:[op…],
     adauga:[op…] (textul pe care îl tastează elevul, pentru soluție), verif:[test…], tipic:[op…] (greșeala tipică)}.
     start: 'text' sau {t:'text', al:'center', prim:1.25, rand:1.5, f:{b:1, sz:18}}.
     op de caractere: {text:'…', nth?, par?, b?, i?, u?, font?, sz?, col?:'rosu'|'FF0000'|null}
     op de paragraf:  {par:N, al?, st?, dr?, prim? (cm), inainte?, dupa? (pt), rand? (1 / 1.5 / 2 / multiplu)}
     op de tastare:   {adauga:'text', par:N, f:{b:1}}   (la capătul paragrafului N)
     test = un op + {ce:'numele testului', doar?:true (nimic altceva nu are formatarea asta), cum?:'indiciu'}
            sau {ce, textulNeschimbat:true} sau {ce, foloseste:'cursor'|'tastare'|'anulare'|'fereastra'}. */
(function(G){
'use strict';
const WO=G.TipWordObiecte,MODEL=WO&&WO.MODEL;
if(!MODEL){if(G.console)console.warn('wordobj-formatare.js: lipsește lectii/_sim/wordobj.js (se încarcă înainte)');}
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LIT=/[\p{L}\p{N}]/u;
const PX=16/11;              // 11 pt pe ecran = 16 px, ca în wordobj.js
const CM=28.3465*PX;         // 1 cm pe ecran, la aceeași scară cu literele
const TAB=1.25;              // oprirea de tab implicită cu centimetri: 35,4 pt = 1,25 cm (probat)
const F0={b:0,i:0,u:0,font:'Calibri (Body)',sz:11,col:null};
const PF0={al:'left',st:0,dr:0,prim:0,inainte:0,dupa:8,rand:1.08,rt:'multiplu'};
/* numele cu spații stau între APOSTROFURI: fontul intră într-un atribut style="…" scris cu ghilimele */
const FONT_CSS={
  'Calibri (Body)':"Calibri,Carlito,'Segoe UI',Arial,sans-serif",'Calibri Light (Headings)':"'Calibri Light',Calibri,Carlito,sans-serif",
  'Aptos':'Aptos,Calibri,Carlito,sans-serif','Arial':"Arial,'Liberation Sans',Helvetica,sans-serif",'Calibri':"Calibri,Carlito,'Segoe UI',Arial,sans-serif",
  'Cambria':'Cambria,Caladea,Georgia,serif','Comic Sans MS':"'Comic Sans MS','Comic Neue',cursive",'Courier New':"'Courier New','Liberation Mono',monospace",
  'Georgia':'Georgia,serif','Times New Roman':"'Times New Roman','Liberation Serif',Times,serif",'Verdana':"Verdana,'DejaVu Sans',sans-serif"};
const FONT_TEMA=['Calibri Light (Headings)','Calibri (Body)'];
const FONT_TOATE=['Aptos','Arial','Calibri','Cambria','Comic Sans MS','Courier New','Georgia','Times New Roman','Verdana'];
const MARIMI=[8,9,10,10.5,11,12,14,16,18,20,22,24,26,28,36,48,72];
const PASI=[8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];
const CULORI=[['C00000','Dark Red','roșu închis'],['FF0000','Red','roșu'],['FFC000','Orange','portocaliu'],['FFFF00','Yellow','galben'],
  ['92D050','Light Green','verde deschis'],['00B050','Green','verde'],['00B0F0','Light Blue','albastru deschis'],['0070C0','Blue','albastru'],
  ['002060','Dark Blue','albastru închis'],['7030A0','Purple','mov']];
const CUL_BUTON='EE0000';    // ce pune butonul Font Color la prima apăsare (probat: RGB 238,0,0)
const FAMILIE={rosu:['FF0000','EE0000'],albastru:['0070C0'],verde:['00B050'],portocaliu:['FFC000'],galben:['FFFF00'],mov:['7030A0'],
  'rosu inchis':['C00000'],'albastru inchis':['002060'],'albastru deschis':['00B0F0'],'verde deschis':['92D050']};
const NUME_CUL=h=>{if(!h)return 'automată (neagră)';const c=CULORI.find(x=>x[0]===h);if(c)return c[2];for(const k in FAMILIE)if(FAMILIE[k].includes(h))return k.replace('rosu','roșu').replace('inchis','închis');return '#'+h};
const AL_RO={left:'la stânga',center:'centrat',right:'la dreapta',justify:'stânga-dreapta'};
const AL_BTN={left:'<b>Align Left</b> (Ctrl+L)',center:'<b>Center</b> (Ctrl+E)',right:'<b>Align Right</b> (Ctrl+R)',justify:'<b>Justify</b> (Ctrl+J)'};
const NUME={b:'aldin',i:'cursiv',u:'subliniat'};
const NUME_F={b:'aldină',i:'cursivă',u:'subliniată'};   // „prima literă, care e deja …”
const ORD=['primul','al doilea','al treilea','al patrulea','al cincilea','al șaselea','al șaptelea','al optulea','al nouălea','al zecelea'];
const BTN={b:'<b>B</b> (Ctrl+B)',i:'<b>I</b> (Ctrl+I)',u:'<b>U</b> (Ctrl+U)'};
const nr=n=>String(Math.round(n*100)/100).replace('.',',');
const cf=f=>Object.assign({},f);
const cpf=p=>Object.assign({},p);
const clone=d=>JSON.parse(JSON.stringify(d));
const rtDin=v=>v===1?'simplu':v===1.5?'1.5':v===2?'dublu':'multiplu';
function culHex(c){if(c==null||c==='auto')return null;const k=String(c).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');if(FAMILIE[k])return FAMILIE[k][0];return String(c).replace('#','').toUpperCase()}
function culOk(cer,act){if(cer==null||cer==='auto')return act==null;const k=String(cer).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');if(FAMILIE[k])return FAMILIE[k].includes(act);return culHex(cer)===act}

/* ---------------- documentul ---------------- */
function par(t,pf,f){t=t||'';const F=Object.assign({},F0,f||{});return {t,f:Array.from({length:t.length},()=>cf(F)),pf:Object.assign({},PF0,pf||{}),mf:cf(F)}}
function mk(start){return (start&&start.length?start:['']).map(x=>{
  if(typeof x==='string')return par(x);
  const pf={};['al','st','dr','prim','inainte','dupa','rand'].forEach(k=>{if(x[k]!=null)pf[k]=x[k]});if(x.rand!=null)pf.rt=rtDin(x.rand);
  return par(x.t,pf,normF(x.f||{}));
})}
const CHAR_K=['b','i','u','font','sz','col'],PAR_K=['al','st','dr','prim','inainte','dupa','rand'];
function normF(o){const r={};CHAR_K.forEach(k=>{if(o[k]!==undefined)r[k]=k==='col'?culHex(o[k]):(k==='b'||k==='i'||k==='u')?(o[k]?1:0):o[k]});return r}
function gaseste(doc,text,parN,nth){
  nth=nth||1;let k=0;
  for(let b=0;b<doc.length;b++){if(parN&&b!==parN-1)continue;let i=-1;while((i=doc[b].t.indexOf(text,i+1))>=0){if(++k===nth)return {b,a:i,e:i+text.length}}}
  return null;
}
function aplica(doc,op){
  if(op.adauga!=null){const b=(op.par||doc.length)-1,p=doc[b];if(!p)return;const F=Object.assign(p.t.length?cf(p.f[p.t.length-1]):cf(p.mf),normF(op.f||{}));
    p.t+=op.adauga;for(let k=0;k<op.adauga.length;k++)p.f.push(cf(F));return}
  if(op.text!=null){const g=gaseste(doc,op.text,op.par,op.nth);if(!g)return;const nf=normF(op);for(let k=g.a;k<g.e;k++)Object.assign(doc[g.b].f[k],nf);return}
  if(op.par!=null){const p=doc[op.par-1];if(!p)return;PAR_K.forEach(k=>{if(op[k]!=null)p.pf[k]=op[k]});if(op.rand!=null)p.pf.rt=rtDin(op.rand)}
}
function start(Q){const d=mk(Q.start);(Q.pre||[]).forEach(o=>aplica(d,o));return d}
function solutie(Q){const d=start(Q);(Q.adauga||[]).forEach(o=>aplica(d,o));(Q.verif||[]).forEach(v=>{if(v.text!=null||(v.par!=null&&PAR_K.some(k=>v[k]!=null)))aplica(d,v)});return d}
function gresitDoc(Q){const d=start(Q);(Q.tipic||[]).forEach(o=>aplica(d,o));return d}
const scurt=t=>{const w=String(t).trim().split(/\s+/);return '„'+w.slice(0,3).join(' ')+(w.length>3?'…':'')+'”'};

/* ---------------- TESTELE ---------------- */
function folosit(log,fel){
  if(fel==='cursor')return log.some(x=>x.op==='cuvant');
  if(fel==='tastare')return log.some(x=>x.op==='tastat_tf');
  if(fel==='anulare')return log.some(x=>x.op==='z');
  if(fel==='fereastra')return log.some(x=>x.op==='dlgpar');
  return false;
}
const FOLOSIT_CUM={
  cursor:'Nu selecta nimic: dă un singur clic în mijlocul cuvântului (cursorul între două litere), apoi apasă butonul.',
  tastare:'Pune cursorul la capătul rândului, apasă butonul (sau scurtătura) și abia apoi tastează.',
  anulare:'După ce ai formatat, apasă Ctrl+Z: ultima formatare se anulează.',
  fereastra:'Deschide fereastra Paragraph cu săgeata mică ↘ din colțul de jos al grupului Paragraph.'
};
const spatiu=c=>c===' '||c==='\t';
function testeaza(Q,doc,st){
  const T=[],add=(ce,ok,cum)=>T.push({ce,ok:!!ok,cum:cum||''});
  const sol=solutie(Q),txt=d=>d.map(p=>p.t).join('\n'),laFel=txt(doc)===txt(sol);
  (Q.verif||[]).forEach(v=>{
    if(v.textulNeschimbat){add(v.ce,laFel,v.cum||'Textul s-a schimbat: azi schimbi doar cum arată, nu ce scrie. Apasă Ctrl+Z sau „Ia-o de la capăt”.');return}
    if(v.foloseste){add(v.ce,folosit(st.log||[],v.foloseste),v.cum||FOLOSIT_CUM[v.foloseste]);return}
    if(v.text!=null){
      const g=gaseste(doc,v.text,v.par,v.nth);
      if(!g){add(v.ce,false,v.cum||`„${esc(v.text)}” nu apare în document exact așa. Verifică literele și spațiile (de exemplu, un spațiu lipsă); dacă te-ai încurcat, apasă Ctrl+Z sau „Ia-o de la capăt”.`);return}
      const cer=normF(v),P=doc[g.b];let rau=null;
      for(let k=g.a;k<g.e&&!rau;k++){if(spatiu(P.t[k]))continue;for(const pr of Object.keys(cer)){
        const ok=pr==='col'?culOk(v.col,P.f[k].col):P.f[k][pr]===cer[pr];if(!ok){rau={pr,act:P.f[k][pr]};break}}}
      if(rau){let parte=null;
        if(rau.pr==='b'||rau.pr==='i'||rau.pr==='u'){   // doar o parte e greșită, iar PRIMA literă e deja bună: B/I/U pe tot ar merge invers
          const pr=rau.pr,idx=[];for(let k=g.a;k<g.e;k++)if(!spatiu(P.t[k]))idx.push(k);
          const rele=idx.filter(k=>P.f[k][pr]!==cer[pr]);
          if(rele.length<idx.length&&P.f[idx[0]][pr]===cer[pr])parte=P.t.slice(rele[0],rele[rele.length-1]+1).trim();}
        add(v.ce,false,v.cum||cumChar(v,rau.pr,rau.act,parte));return}
      if(v.doar){
        if(!laFel){add(v.ce,false,'Textul nu mai e cel de la început. Apasă Ctrl+Z sau „Ia-o de la capăt”.');return}
        for(let b=0;b<doc.length;b++)for(let k=0;k<doc[b].t.length;k++){
          if(b===g.b&&k>=g.a&&k<g.e)continue;if(spatiu(doc[b].t[k]))continue;
          for(const pr of Object.keys(cer)){if(doc[b].f[k][pr]!==sol[b].f[k][pr]){
            add(v.ce,false,v.cum||cumDoar(pr,bucata(doc,sol,b,k,pr,g),v.text));return}}}
      }
      add(v.ce,true);return;
    }
    if(v.par!=null){
      const p=doc[v.par-1];if(!p){add(v.ce,false,'Documentul are acum alt număr de paragrafe. Apasă Ctrl+Z sau „Ia-o de la capăt”.');return}
      for(const k of PAR_K){if(v[k]==null)continue;
        const a=p.pf[k],c=v[k],tol=k==='al'?0:k==='rand'?0.011:(k==='inainte'||k==='dupa')?0.5:0.031;
        const ok=k==='al'?a===c:Math.abs(a-c)<=tol;
        if(!ok){add(v.ce,false,v.cum||cumPar(p,k,a,c));return}}
      add(v.ce,true);
    }
  });
  return T;
}
/* cum selectezi DOAR o bucată: dublu-clicul ia un singur cuvânt sau un singur semn; altfel tragi (judecător 2, R1) */
const unCuvant=f=>/^[\p{L}\p{N}]+$/u.test(f)||/^[.,;:!?„”]$/.test(f);
const cumSel=f=>unCuvant(f)?'dublu-clic pe el':'trăgând peste el';
function cumChar(v,pr,act,parte){
  const X=esc(v.text);
  if(parte&&(pr==='b'||pr==='i'||pr==='u')){const F=esc(parte);
    return v[pr]?`„${X}” e ${NUME[pr]} doar pe o parte: „${F}” nu e. Selectează doar „${F}” (${cumSel(parte)}) și apasă ${BTN[pr]}. Nu apăsa pe tot „${X}”: Word se ia după prima literă, care e deja ${NUME_F[pr]}, așa că prima apăsare ar scoate formatarea de peste tot (abia a doua ar pune-o pe tot).`
      :`„${F}” din „${X}” e încă ${NUME[pr]}, dar nu trebuie. Selectează doar „${F}” (${cumSel(parte)}) și apasă încă o dată ${BTN[pr]}. Nu apăsa pe tot „${X}”: Word se ia după prima literă, care nu e ${NUME_F[pr]}, așa că prima apăsare l-ar face pe tot ${NUME[pr]}.`}
  if(pr==='b'||pr==='i'||pr==='u')return v[pr]?`„${X}” nu e încă tot ${NUME[pr]}. Selectează exact „${X}” și apasă ${BTN[pr]}.`
    :`„${X}” e ${NUME[pr]}, dar nu trebuie. Selectează-l și apasă încă o dată ${BTN[pr]}.`;
  if(pr==='sz')return `„${X}” are acum ${nr(act)} pt; trebuie ${nr(v.sz)} pt. Selectează-l și alege ${nr(v.sz)} în caseta de mărime (<b>Font Size</b>), a doua casetă din grupul Font.`;
  if(pr==='font')return `„${X}” are fontul ${esc(act)}; trebuie ${esc(v.font)}. Selectează-l și alege ${esc(v.font)} din prima casetă a grupului Font.`;
  if(pr==='col'){const h=culHex(v.col),i=CULORI.findIndex(c=>c[0]===h),ales=act?` Acum e ${NUME_CUL(act)}${CULORI.find(c=>c[0]===act)?' ('+CULORI.find(c=>c[0]===act)[1]+')':''}.`:' Acum are culoarea automată (neagră).';
    return `„${X}” nu e încă ${NUME_CUL(h)}.${ales} Selectează-l, apasă săgeata ▾ de lângă butonul <b>A</b> (<b>Font Color</b>) și alege ${i>=0?ORD[i]+' pătrățel din rândul Standard Colors ('+CULORI[i][1]+')':'pătrățelul '+NUME_CUL(h)}.`}
  return `„${X}” nu arată încă așa cum cere sarcina.`;
}
/* bucata care are formatarea greșită: doar caracterele din AFARA textului cerut, lipite între ele (spațiile dintre ele intră,
   cele de la capete nu) — ca mesajul să nu-i ceară copilului să scoată formatarea chiar de pe textul cerut (judecător, M3) */
function bucata(doc,sol,b,k,pr,g){
  const t=doc[b].t,rau=j=>!(b===g.b&&j>=g.a&&j<g.e)&&j>=0&&j<t.length&&(spatiu(t[j])||doc[b].f[j][pr]!==sol[b].f[j][pr]);
  let a=k,z=k+1;while(rau(a-1))a--;while(rau(z))z++;
  while(a<z&&spatiu(t[a]))a++;while(z>a&&spatiu(t[z-1]))z--;
  const sp=(x,y)=>{for(let j=x;j<y;j++)if(!spatiu(t[j]))return false;return true};
  const lipit=b!==g.b?null:(a>=g.e&&sp(g.e,a))?'dupa':(z<=g.a&&sp(z,g.a))?'inainte':null;
  return {frag:t.slice(a,z),lipit,act:doc[b].f[k][pr],cer:sol[b].f[k][pr]};
}
/* [cu articol (subiect), după „pe” (fără articol)] */
const SEMN={'.':['punctul','punct'],'!':['semnul „!”','semnul „!”'],'?':['semnul „?”','semnul „?”'],',':['virgula','virgulă'],':':['semnul „:”','semnul „:”'],';':['semnul „;”','semnul „;”'],'„':['ghilimelele „','ghilimelele „'],'”':['ghilimelele ”','ghilimelele ”']};
function cumDoar(pr,o,tinta){
  const F=esc(o.frag.length>24?o.frag.slice(0,24)+'…':o.frag),T=esc(tinta),ce=SEMN[o.frag]?SEMN[o.frag][0]:`„${F}”`,pe=SEMN[o.frag]?SEMN[o.frag][1]:`„${F}”`;
  const comut=pr==='b'||pr==='i'||pr==='u',felul=comut?NUME[pr]:pr==='sz'?'cu altă mărime':pr==='font'?'cu alt font':'colorat';
  if(comut&&!o.act)return `${ce[0].toUpperCase()+ce.slice(1)} nu mai e ${NUME[pr]}, deși trebuie să fie. Selectează-l și apasă ${BTN[pr]}, sau apasă Ctrl+Z.`;
  const repar=comut?`apasă încă o dată ${BTN[pr]}`:pr==='sz'?`pune-i la loc ${nr(o.cer)} pt`:pr==='font'?`pune-i la loc fontul ${esc(o.cer)}`:`pune-i la loc culoarea ${NUME_CUL(o.cer)}`;
  const gest=unCuvant(o.frag)?`dublu-clic pe ${pe} (se selectează doar el)`:`selectează doar ${ce} (trage peste el)`;
  if(o.lipit)return `Selecția a prins mai mult decât „${T}”: ${ce} de ${o.lipit==='dupa'?'după':'dinainte de'} „${T}” e și el ${felul}. Repari așa: ${gest} și ${repar}. Dacă a fost ultima ta comandă, merge și Ctrl+Z, apoi selectezi din nou exact „${T}”.`;
  return `E ${felul} și ${ce}, pe care sarcina nu-l cere: selecția l-a prins și pe el. Repari așa: ${gest} și ${repar}; sau apasă Ctrl+Z și selectează din nou doar „${T}”.`;
}
function cumPar(p,k,a,c){
  const N=`paragraful ${esc(scurt(p.t))}`;
  if(k==='al')return `Acum ${N} e aliniat ${AL_RO[a]}; trebuie ${AL_RO[c]}. Dă un clic oriunde în el și apasă ${AL_BTN[c]}.`;
  if(k==='prim'){if(p.pf.st>0.01&&Math.abs(p.pf.prim)<0.01)return `Ai retras TOT ${N} (butonul Increase Indent), nu doar primul rând. Apasă Decrease Indent sau Ctrl+Z, apoi fereastra <b>Paragraph</b>: Special: <b>First line</b>, By: <b>${nr(c)} cm</b>, OK.`;
    return `Acum primul rând din ${N} are alineat de ${nr(a)} cm; trebuie ${nr(c)} cm. Clic în paragraf, săgeata mică ↘ din colțul grupului <b>Paragraph</b>, apoi Special: <b>First line</b>, By: <b>${nr(c)} cm</b>, OK.`}
  if(k==='rand'){const n=c===1.5?'1.5 lines':c===2?'Double':c===1?'Single':'Multiple, At: '+nr(c);return `Acum spațierea dintre rânduri la ${N} e ${nr(a)}; trebuie ${nr(c)}. Deschide fereastra <b>Paragraph</b> și, la Line spacing, alege <b>${n}</b>, apoi OK.`}
  if(k==='st')return `Acum ${N} e retras din stânga ${nr(a)} cm; trebuie ${nr(c)} cm.`;
  if(k==='dupa'||k==='inainte')return `Acum ${N} are ${nr(a)} pt ${k==='dupa'?'după':'înainte'}; trebuie ${nr(c)} pt (fereastra Paragraph, Spacing).`;
  return `Acum ${N} nu e încă cum cere sarcina.`;
}

/* ---------------- stilul (o singură dată pe pagină) ---------------- */
const CSS=`
/* numele grupului (ex. „Paragraph”) stă peste săgeata mică ↘ din colț: clicul trebuie să treacă prin el, ca în Word */
.wf .pg .pg-nume{pointer-events:none}
/* pe telefon (deget, ~40 px): zone de atingere mai mari, FĂRĂ să mute butoanele din locul lor real (judecător, M2).
   Săgeata ↘ a grupului Paragraph are zona de 32×32 px din motor (ui-panglica.js, 27.09.2026), deci aici nu mai e nimic
   pentru ea. Casetele Font / Font Size și butonul Font Color: zona crește doar pe verticală, până la rândul vecin
   (măsurat în _proba/proba_ui_l06.py). */
@media (pointer:coarse){
  .wf .pg .pg-camp,.wf .pg .wf-cb,.wf .pg .wf-split .pg-b{overflow:visible}
  .wf .pg .wf-cb,.wf .pg .wf-split .pg-b{position:relative}
  /* Font Color stă deasupra zonei de 32 px a săgeții ↘ din grupul Font (fereastra Font nu e folosită în lecție) */
  .wf .pg .pg-camp{z-index:3}
  .wf .pg .wf-cb::after{content:"";position:absolute;left:0;right:0;top:-6px;bottom:-5px}
  .wf .pg .wf-split .pg-b::after{content:"";position:absolute;left:-1px;right:-1px;top:-4px;bottom:-11px}
}
.wf-doc{font-size:16px;padding:14px 12px}
.wf-doc .wf-p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;color:#111;min-height:1em}
.wf-doc .wf-p span{white-space:pre-wrap}
.wf-doc .wf-pm{display:inline-block;width:.45em;height:1em;vertical-align:-.15em}
.wf-doc .wf-pil{color:#4A7FC1}
/* spațiul tastat încă netrimis, cu ¶ pornit: · peste spațiu, doar în documentul de pe ecran (.wo-doc), pe linia literelor */
.wo-doc .wf-psp::before{content:"·";display:inline-block;width:0;color:#4A7FC1}
.wf-doc .wo-car{width:2px}
.wf-doc .wo-tab{display:inline-block;width:2.2em}
.pg .wf-cb{width:100%;height:100%;display:flex;align-items:center;justify-content:space-between;gap:2px;border:1px solid var(--line);border-radius:2px;background:var(--paper);color:var(--ink);font:inherit;font-size:.72rem;padding:0 2px 0 4px;cursor:pointer;overflow:hidden;white-space:nowrap;min-height:0}
.pg .wf-cb .wf-cbv{overflow:hidden;text-overflow:ellipsis}
.pg .wf-cb[data-wf="m-marime"]{padding:0 0 0 2px;gap:0;letter-spacing:-.02em}
.pg .wf-cb[data-wf="m-marime"] .pg-sag{font-size:.5rem}
.pg .wf-split{display:flex;width:100%;height:100%}
.pg .wf-split .pg-b{position:static;flex:1 1 auto;min-width:0;height:100%}
.pg .wf-split .wf-sag{flex:0 0 11px;font-size:.6rem;padding:0}
.pg .wf-a{display:flex;flex-direction:column;align-items:center;line-height:1}
.pg .wf-bara{display:block;width:14px;height:3px;margin-top:1px}
.wf-meniu{display:grid;gap:4px;width:100%}
.wf-meniu .wf-h{font-size:.74rem;font-weight:600;color:var(--ink2);margin:4px 0 0}
.wf-meniu .wf-lst{display:flex;flex-wrap:wrap;gap:4px}
.wf-meniu .wf-lst button{min-height:34px;padding:2px 10px;border:1px solid var(--line);border-radius:4px;background:var(--paper2);color:#111;background:#fff;cursor:pointer;font-size:.95rem}
.wf-meniu .wf-lst button.on{border-color:#2B579A;box-shadow:inset 0 0 0 1px #2B579A}
.wf-meniu .wf-scrie{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:.82rem}
.wf-meniu .wf-scrie input{width:9em;font-size:16px;padding:4px 6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink)}
.wf-meniu .wf-lst.wf-culori{display:grid;grid-template-columns:repeat(10,minmax(0,32px));gap:3px}
.wf-meniu .wf-cul{width:100%;height:32px;min-height:0;padding:0;border:1px solid #8A94A3;border-radius:2px;cursor:pointer}
.wf-meniu .wf-auto{min-height:32px;padding:0 10px;border:1px solid var(--line);border-radius:4px;background:var(--paper2);color:var(--ink);cursor:pointer}
.wf-meniu .hint{margin:2px 0 0;font-size:.76rem}
.wf-dp{display:grid;gap:8px;padding:10px}
.wf-dp fieldset{border:1px solid var(--line);border-radius:6px;padding:6px 8px 8px;margin:0;display:grid;gap:6px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.wf-dp legend{font-weight:700;font-size:.84rem;padding:0 4px}
.wf-dp label{display:flex;flex-direction:column;gap:2px;font-size:.84rem}
.wf-dp label .wo-ro{display:inline}
.wf-dp input,.wf-dp select{font-size:16px;padding:4px 6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);min-width:0}
`;
function stil(){if(typeof document==='undefined'||document.getElementById('wordfmt-css'))return;const s=document.createElement('style');s.id='wordfmt-css';s.textContent=CSS;document.head.appendChild(s)}
stil();
/* ultimul fel de apăsare (mouse / deget), pe toată pagina: după „Verifică” (butonul e în afara simulatorului), focusul se
   întoarce în document doar dacă elevul lucrează cu mouse-ul (pe telefon, focusul ar deschide tastatura) */
let PTR='mouse';
if(typeof document!=='undefined')document.addEventListener('pointerdown',e=>{PTR=e.pointerType||'mouse'},true);

/* ---------------- SIMULATORUL ---------------- */
let NR=0;
function render(Q,body,api){
  stil();
  const U=Q.unelte||['caractere','paragraf','text'],has=x=>U.includes(x);
  const PW=G.PANGLICA_WORD,UP=G.UiPanglica,real=!!(PW&&UP);
  const {stergeSmart,lipesteSmart,unitCuvant,unitPropozitie}=MODEL;
  let doc=start(Q),cur={b:0,o:0},ank={b:0,o:0},pend='',tSnap=null,tf=null,hist=[],refa=[],clip=null,log=[];
  let fila='TabHome',meniu=null,dlg=null,pil=false,culBtn=CUL_BUTON,ctx=false;
  let mod=null,drop=null,apasat=null,ultim={t:0,x:0,y:0,n:0},tragAnc=null;
  const id='wf-in-'+(++NR);
  const taste=[];
  if(has('text'))taste.push(['enter','Enter ↵','Tasta Enter'],['bs','⌫','Tasta Backspace'],['del','Delete','Tasta Delete']);
  if(has('caractere'))taste.push(['b','Ctrl+B','Ctrl+B, aldin'],['i','Ctrl+I','Ctrl+I, cursiv'],['u','Ctrl+U','Ctrl+U, subliniat']);
  if(has('paragraf'))taste.push(['l','Ctrl+L','Ctrl+L, aliniere la stânga'],['e','Ctrl+E','Ctrl+E, centrat'],['r','Ctrl+R','Ctrl+R, aliniere la dreapta'],['j','Ctrl+J','Ctrl+J, stânga-dreapta']);
  taste.push(['z','Ctrl+Z','Ctrl+Z, anulează ultima operație']);
  body.innerHTML=`<div class="wo wf">
    <div class="wo-rb" role="toolbar" aria-label="Panglica din Word"></div>
    <p class="hint wo-leg">Panglica e cea din Word, în engleză. Pe fila <b>Home</b> (Pornire): grupul <b>Font</b> (forma, mărimea, culoarea literelor și <b>B</b>, <b>I</b>, <b>U</b>) și grupul <b>Paragraph</b> (Paragraf): alinierea și, în colțul de jos, săgeata mică ↘ care deschide fereastra Paragraph. Pe calculator, ține mouse-ul pe un buton ca să-i vezi numele.</p>
    <div class="wo-dlg"></div>
    <div class="wo-pag"><div class="wo-doc wf-doc" role="document" aria-label="Documentul Word simulat"></div></div>
    <div class="wo-ctx" hidden role="menu" aria-label="Meniul de la clic dreapta"></div>
    <div class="wo-kbd"><label class="wo-kl" for="${id}">${has('text')?'Tastatura: atinge caseta și tastează — literele apar în document, la cursor':'Tastele'}</label>
      <input class="wo-in${has('text')?'':' wo-ascuns'}" id="${id}" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="tastează aici"${has('text')?'':' tabindex="-1"'}>
      ${taste.map(([k,t,a])=>`<button type="button" class="wo-k" data-k="${k}" aria-label="${a}">${t}</button>`).join('')}
      <span class="hint wo-kh">Pe calculator merg și tastele adevărate (Ctrl+B, Ctrl+E…). Pe telefon nu ai tasta Ctrl: atingi butoanele.</span></div>
    <p class="wo-nota" aria-live="polite"></p>
    <ul class="wo-teste" aria-label="Testele sarcinii"></ul>
    <div class="wo-jos"><span class="hint">Un clic (o atingere) pune cursorul. Selectezi trăgând peste text cu mouse-ul sau cu degetul; dublu-clic (două atingeri repezi) pe un cuvânt îl selectează.</span>
      <button type="button" class="btn ghost sm" data-k="reset">Ia-o de la capăt</button></div>
  </div>`;
  const $=s=>body.querySelector(s),rbEl=$('.wo-rb'),dlgEl=$('.wo-dlg'),docEl=$('.wo-doc'),inp=$('.wo-in'),notaEl=$('.wo-nota'),testEl=$('.wo-teste'),ctxEl=$('.wo-ctx'),woEl=$('.wo');
  const spune=h=>{notaEl.innerHTML=h||''};
  let ultimulPointer='mouse';
  const focusIn=()=>{if(ultimulPointer==='mouse'&&!api.done())inp.focus({preventScroll:true})};
  /* „Am nevoie de un indiciu” (butonul motorului, pus chiar înaintea lui #body): după clic, focusul înapoi în document,
     ca tastele din indiciu (Ctrl+E, Ctrl+R…) să ajungă în Word-ul simulat, nu în browser (judecător, m9) */
  {const aj=body.previousElementSibling,bt=aj&&aj.classList&&aj.classList.contains('ajutor')&&aj.querySelector('button');
   if(bt)bt.addEventListener('click',()=>setTimeout(()=>{if(PTR==='mouse'&&!api.done())inp.focus({preventScroll:true})},0))}

  /* ---- pozițiile ---- */
  const cmp=(p,q)=>p.b-q.b||p.o-q.o,same=(p,q)=>cmp(p,q)===0;
  const areSel=()=>!!ank&&!same(ank,cur);
  const ord=()=>cmp(ank,cur)<=0?[ank,cur]:[cur,ank];
  const cp=p=>({b:p.b,o:p.o});
  const fin=()=>({b:doc.length,o:0});
  let tfCmd=false;   // formatarea de tastare vine de la un buton apăsat fără selecție (nu de la o selecție înlocuită)
  const pune=p=>{cur=cp(p);ank=cp(p);tf=null;tfCmd=false};
  const txtLa=p=>p.b<doc.length?doc[p.b].t:'';
  /* formatarea cu care se tastează la cursor: cea pusă cu butoanele fără selecție, altfel a literei din stânga (la început
     de paragraf: a primei litere; în paragraful gol: a semnului de paragraf) */
  function fmtTastare(){if(tf)return tf;const p=doc[Math.min(cur.b,doc.length-1)];if(!p)return cf(F0);const o=Math.min(cur.o,p.t.length);return cf(o>0?p.f[o-1]:p.t.length?p.f[0]:p.mf)}

  /* ---- ștergerea și inserarea, cu formatare ---- */
  function extrage(s,e){
    const L=b=>doc[b];
    if(s.b===e.b)return [{t:L(s.b).t.slice(s.o,e.o),f:L(s.b).f.slice(s.o,e.o).map(cf),pf:cpf(L(s.b).pf)}];
    const out=[{t:L(s.b).t.slice(s.o),f:L(s.b).f.slice(s.o).map(cf),pf:cpf(L(s.b).pf)}];
    for(let b=s.b+1;b<e.b&&b<doc.length;b++)out.push({t:L(b).t,f:L(b).f.map(cf),pf:cpf(L(b).pf)});
    out.push(e.b<doc.length?{t:L(e.b).t.slice(0,e.o),f:L(e.b).f.slice(0,e.o).map(cf),pf:cpf(L(e.b).pf)}:{t:'',f:[],pf:cpf(PF0)});
    return out;
  }
  function stergeIn(p,a,z,smart){ // în paragraful p, [a,z); întoarce poziția cursorului
    const baza=p.t.slice(0,a)+p.t.slice(z),bf=p.f.slice(0,a).concat(p.f.slice(z));
    if(!smart){p.t=baza;p.f=bf;return a}
    const r=stergeSmart(p.t,a,z);
    if(r.s.length<baza.length){const k=r.o===a?a:a-1;bf.splice(k,1)}
    p.t=r.s;p.f=bf;return r.o;
  }
  function sterge(s,e,smart){
    if(s.b===e.b){const o=stergeIn(doc[s.b],s.o,e.o,smart);return {b:s.b,o}}
    if(e.b>=doc.length){
      if(s.o===0){if(s.b===0){const m=cf(doc[0].mf),pf=cpf(doc[0].pf);doc=[{t:'',f:[],pf,mf:m}];return {b:0,o:0}}
        doc.splice(s.b);const u=doc.length-1;return {b:u,o:doc[u].t.length}}
      const p=doc[s.b];p.t=p.t.slice(0,s.o);p.f=p.f.slice(0,s.o);doc.splice(s.b+1);return {b:s.b,o:s.o};
    }
    const A=doc[s.b],Z=doc[e.b];
    const np={t:A.t.slice(0,s.o)+Z.t.slice(e.o),f:A.f.slice(0,s.o).concat(Z.f.slice(e.o)),pf:cpf(A.pf),mf:cf(A.mf)};   // Word: rămâne aspectul paragrafului de sus (probat la unire)
    let o=s.o;if(smart){const tmp={t:np.t,f:np.f};o=stergeIn(tmp,o,o,true);np.t=tmp.t;np.f=tmp.f}
    doc.splice(s.b,e.b-s.b+1,np);return {b:s.b,o};
  }
  /* lipirea unei bucăți de text cu formatele ei, cu regulile Word de spații (wordobj.js / lecția 5) */
  function lipesteIn(t,f,o,T,FT,smart){
    if(!smart||!T.length)return {t:t.slice(0,o)+T+t.slice(o),f:f.slice(0,o).concat(FT.map(cf),f.slice(o)),o:o+T.length};
    const r=lipesteSmart(t,o,T),I=r.s.slice(o,r.o);
    const lead=(T.match(/^ */)||[''])[0].length,trail=(T.match(/ *$/)||[''])[0].length,core=T.slice(lead,Math.max(lead,T.length-trail));
    const li=(I.match(/^ */)||[''])[0].length,FI=[];
    for(let k=0;k<I.length;k++){
      if(k<li)FI.push(cf(FT[Math.min(k,lead-1)]||FT[0]||F0));
      else if(k<li+core.length)FI.push(cf(FT[lead+k-li]||FT[FT.length-1]||F0));
      else FI.push(cf(FT[T.length-trail+(k-li-core.length)]||FT[FT.length-1]||F0));
    }
    return {t:r.s,f:f.slice(0,o).concat(FI,f.slice(o)),o:r.o};
  }
  function insereaza(p,parts,smart){
    const P=doc[p.b],n=parts.length;
    if(n===1){const r=lipesteIn(P.t,P.f,p.o,parts[0].t,parts[0].f,smart);P.t=r.t;P.f=r.f;return {b:p.b,o:r.o}}
    const st=P.t.slice(0,p.o),sf=P.f.slice(0,p.o),dr=P.t.slice(p.o),df=P.f.slice(p.o);
    const r0=lipesteIn(st,sf,st.length,parts[0].t,parts[0].f,smart);
    const u=parts[n-1],ru=lipesteIn(dr,df,0,u.t,u.f,smart);
    const noi=[{t:r0.t,f:r0.f,pf:cpf(parts[0].pf),mf:cf(P.mf)}];
    for(let i=1;i<n-1;i++)noi.push({t:parts[i].t,f:parts[i].f.map(cf),pf:cpf(parts[i].pf),mf:cf(parts[i].f[0]||P.mf)});
    noi.push({t:ru.t,f:ru.f,pf:cpf(P.pf),mf:cf(P.mf)});
    doc.splice(p.b,1,...noi);return {b:p.b+n-1,o:ru.o};
  }
  /* ---- istoria ---- */
  const stare=()=>({doc:clone(doc),cur:cp(cur),ank:cp(ank)});
  function snap(){hist.push(stare());if(hist.length>200)hist.shift();refa=[]}
  function commit(){
    if(!pend){if(tSnap){hist.push(tSnap);refa=[];tSnap=null}return}
    if(!tSnap)tSnap=stare();
    const t=pend,F=fmtTastare();pend='';inp.value='';
    const p=doc[cur.b];p.t=p.t.slice(0,cur.o)+t+p.t.slice(cur.o);p.f.splice(cur.o,0,...Array.from({length:t.length},()=>cf(F)));
    if(tfCmd)log.push({op:'tastat_tf'});
    // după tastare, formatarea vine din literele tastate (care o au deja)
    cur={b:cur.b,o:cur.o+t.length};ank=cp(cur);hist.push(tSnap);refa=[];tSnap=null;tf=null;tfCmd=false;
    /* Reparat 28.09.2026 (semnalat de autorul lecției VII/8): desenul trebuie să urmeze documentul. Până aici, literele
       tastate stăteau pe ecran într-un <span class="wo-pend"> fără data-o, iar literele de după ele aveau încă pozițiile
       VECHI. Clicul, clicul dreapta, tragerea și ↑ ↓ Home End caută locul PE DESEN (posAt, charAt, rectLa), deci
       ajungeau cu atâtea litere mai la stânga câte tastase elevul (⌫ ștergea altă literă). Redesenăm înainte să caute. */
    drawDoc();
  }
  function anuleaza(){
    if(pend||tSnap){const s=tSnap;pend='';inp.value='';tSnap=null;if(s){refa.push(stare());doc=s.doc;cur=s.cur;ank=s.ank}log.push({op:'z'});tf=null;return}
    if(!hist.length){spune('Nu mai e nimic de anulat.');return}
    refa.push(stare());const s=hist.pop();doc=s.doc;cur=s.cur;ank=s.ank;tf=null;log.push({op:'z'});
  }
  function reface(){commit();if(!refa.length)return;hist.push(stare());const s=refa.pop();doc=s.doc;cur=s.cur;ank=s.ank;tf=null}

  /* ---- formatarea caracterelor ---- */
  const cresc=s=>{const n=PASI.find(x=>x>s);return n!=null?n:Math.floor(s/10)*10+10};
  const scad=s=>{if(s<=8)return Math.max(1,Math.ceil(s)-1);const l=PASI.filter(x=>x<s);return l.length?l[l.length-1]:s};
  function aplicaF(f,k,v){if(k==='grow')f.sz=cresc(f.sz);else if(k==='shrink')f.sz=scad(f.sz);else if(k==='reset')Object.assign(f,F0);else f[k]=v;return f}
  function interval(s,e,fn){   // fiecare caracter din [s,e), plus semnele de paragraf cuprinse
    for(let b=s.b;b<=e.b&&b<doc.length;b++){const p=doc[b],a=b===s.b?s.o:0,z=b===e.b?e.o:p.t.length;for(let k=a;k<z;k++)fn(p.f[k]);if(b<e.b)fn(p.mf)}
  }
  function primulF(s,e){for(let b=s.b;b<=e.b&&b<doc.length;b++){const p=doc[b],a=b===s.b?s.o:0,z=b===e.b?e.o:p.t.length;if(z>a)return p.f[a];if(b<e.b)return p.mf}return doc[Math.min(s.b,doc.length-1)].mf}
  function formChar(k,v){
    commit();if(api.done())return;
    const comut=k==='b'||k==='i'||k==='u';
    if(areSel()){const [s,e]=ord();if(comut)v=primulF(s,e)[k]?0:1;snap();interval(s,e,f=>aplicaF(f,k,v));log.push({op:'sel',k});return}
    const p=doc[cur.b],t=p?p.t:'',o=cur.o;
    if(p&&o>0&&o<t.length&&LIT.test(t[o-1])&&LIT.test(t[o])){   // cursorul în mijlocul cuvântului: tot cuvântul (probat)
      let a=o;while(a>0&&LIT.test(t[a-1]))a--;let z=o;while(z<t.length&&LIT.test(t[z]))z++;
      if(comut)v=p.f[a][k]?0:1;snap();for(let x=a;x<z;x++)aplicaF(p.f[x],k,v);log.push({op:'cuvant',k});tf=null;return;
    }
    const baza=cf(fmtTastare());if(comut)v=baza[k]?0:1;tf=aplicaF(baza,k,v);tfCmd=true;log.push({op:'tf',k});   // modul de tastare
  }
  /* ---- formatarea paragrafelor ---- */
  function tinte(){const [s,e]=areSel()?ord():[cur,cur];let z=Math.min(e.b,doc.length-1);if(areSel()&&e.o===0&&e.b>s.b)z=Math.min(e.b-1,doc.length-1);const r=[];for(let b=Math.min(s.b,doc.length-1);b<=z;b++)r.push(b);return r}
  function formPar(fn,op){commit();if(api.done())return;const T=tinte();snap();T.forEach(b=>fn(doc[b].pf));log.push({op:op||'par'})}
  /* Word (TASTE REALE + butoane, probat 27.09 după judecător): dacă TOATE paragrafele țintă au deja alinierea cerută, comanda
     comută: Center / Right / Justify -> stânga, iar Left -> stânga-dreapta; altfel pune alinierea cerută. */
  function aliniaza(al){
    const T=tinte(),toate=T.length&&T.every(b=>doc[b].pf.al===al);
    formPar(pf=>{pf.al=toate?(al==='left'?'justify':'left'):al},'al');
  }
  const indent=semn=>formPar(pf=>{pf.st=semn>0?(Math.floor(pf.st/TAB+1e-6)+1)*TAB:Math.max(0,(Math.ceil(pf.st/TAB-1e-6)-1)*TAB)},'ind');
  const spatiere=(v,rt)=>formPar(pf=>{pf.rand=v;pf.rt=rt||rtDin(v)},'sp');

  /* ---- operațiile de editare ---- */
  function stergeSel(){const [s,e]=ord();snap();pune(sterge(s,e,true));log.push({op:'dels'})}
  function copiaza(taie){
    commit();if(!areSel()){spune(`Nu e nimic selectat, deci ${taie?'Ctrl+X':'Ctrl+C'} nu face nimic.`);return}
    const [s,e]=ord();clip=extrage(s,e);
    if(taie){snap();pune(sterge(s,e,true));log.push({op:'x'})}else{log.push({op:'c'});spune('Copiat, cu tot cu formatare. Pune cursorul unde vrei copia și apasă Ctrl+V.')}
  }
  function lipeste(){
    commit();if(!clip){spune('Clipboardul e gol: încă n-ai copiat sau decupat nimic.');return}
    snap();if(areSel()){const [s,e]=ord();pune(sterge(s,e,true))}
    if(cur.b>=doc.length)pune({b:doc.length-1,o:doc[doc.length-1].t.length});
    pune(insereaza(cur,clip,true));log.push({op:'v'});
  }
  function enter(){
    commit();snap();
    if(areSel()){const [s,e]=ord();pune(sterge(s,e,false))}
    if(cur.b>=doc.length)pune({b:doc.length-1,o:doc[doc.length-1].t.length});
    const p=doc[cur.b],o=cur.o;
    const a={t:p.t.slice(0,o),f:p.f.slice(0,o),pf:cpf(p.pf),mf:cf(p.mf)},b={t:p.t.slice(o),f:p.f.slice(o),pf:cpf(p.pf),mf:cf(p.mf)};   // paragraful nou păstrează alinierea (probat)
    doc.splice(cur.b,1,a,b);pune({b:cur.b+1,o:0});
  }
  function backspace(ctrl){
    commit();if(areSel()){stergeSel();return}
    const p=doc[cur.b],o=cur.o;
    if(o>0){let a=o-1;if(ctrl){a=o;while(a>0&&p.t[a-1]===' ')a--;if(a>0&&LIT.test(p.t[a-1]))while(a>0&&LIT.test(p.t[a-1]))a--;else if(a>0)a--}
      snap();const r=stergeIn(p,a,o,!!ctrl);pune({b:cur.b,o:r});return}
    // la începutul paragrafului: întâi alineatul, apoi retragerea (opțiunea „Set left- and first-indent with tabs and
    // backspaces”, pornită: TabIndentKey=True, probat; efectul tastei NU se poate proba prin COM), apoi unirea cu cel de sus
    if(p.pf.prim>0.001){snap();p.pf.prim=0;return}
    if(p.pf.st>0.001){snap();p.pf.st=Math.max(0,(Math.ceil(p.pf.st/TAB-1e-6)-1)*TAB);return}
    if(cur.b===0)return;
    const prev=doc[cur.b-1];snap();pune(sterge({b:cur.b-1,o:prev.t.length},{b:cur.b,o:0},false));
  }
  function del(ctrl){
    commit();if(areSel()){stergeSel();return}
    const p=doc[cur.b],o=cur.o;
    if(o<p.t.length){let z=o+1;if(ctrl)z=Math.max(unitCuvant(p.t,o)[1],o+1);snap();const r=stergeIn(p,o,z,!!ctrl);pune({b:cur.b,o:r});return}
    if(cur.b+1>=doc.length)return;snap();pune(sterge({b:cur.b,o},{b:cur.b+1,o:0},false));
  }
  function tab(){
    commit();const p=doc[cur.b];
    if(!areSel()&&cur.o===0&&p.t.length){snap();if(p.pf.prim<0.001)p.pf.prim=TAB;else p.pf.st+=TAB;log.push({op:'tab'});return}   // opțiunea TabIndentKey
    snap();if(areSel()){const [s,e]=ord();pune(sterge(s,e,false))}
    const q=doc[cur.b],F=fmtTastare();q.t=q.t.slice(0,cur.o)+'\t'+q.t.slice(cur.o);q.f.splice(cur.o,0,cf(F));pune({b:cur.b,o:cur.o+1});
  }
  function trage(d,copie){
    const [s,e]=ord();if(cmp(d,s)>=0&&cmp(d,e)<=0)return;
    const parts=extrage(s,e);snap();
    if(copie){pune(insereaza(d,parts,true));ank=cp(d);log.push({op:'dragc'});return}
    // mutarea: dacă locul nou e după selecție, se mută cu lungimea scoasă
    const SEMN='';const P=doc[d.b];P.t=P.t.slice(0,d.o)+SEMN+P.t.slice(d.o);P.f.splice(d.o,0,cf(F0));
    const s2=cp(s),e2=cp(e);if(d.b===s.b&&d.o<=s.o){s2.o++;if(e.b===s.b)e2.o++}else if(d.b===e.b&&d.o<=e.o&&d.b!==s.b)e2.o++;
    sterge(s2,e2,true);
    let unde=null;for(let b=0;b<doc.length&&!unde;b++){const i=doc[b].t.indexOf(SEMN);if(i>=0){doc[b].t=doc[b].t.slice(0,i)+doc[b].t.slice(i+1);doc[b].f.splice(i,1);unde={b,o:i}}}
    if(!unde)return;const r=insereaza(unde,parts,true);ank=cp(unde);cur=r;log.push({op:'drag'});
  }

  /* ---- punctul de pe ecran -> poziția din document ---- */
  const hosts=()=>[...docEl.querySelectorAll('.wf-p')];
  function hostPos(h,o){const b=+h.dataset.b;return {b,o:Math.max(0,Math.min(o,doc[b].t.length))}}
  function posAt(x,y){
    let el=document.elementFromPoint(x,y),host=el&&el.closest&&el.closest('.wf-p');
    if(!host||!docEl.contains(host)){const hs=hosts();if(!hs.length)return null;let best=null,bd=1e9;
      hs.forEach(h=>{const r=h.getBoundingClientRect();const d=y<r.top?r.top-y:y>r.bottom?y-r.bottom:0;const dx=x<r.left?r.left-x:x>r.right?x-r.right:0;const dd=d*4+dx;if(dd<bd){bd=dd;best=h}});host=best}
    const ch=[...host.querySelectorAll('[data-o]')];if(!ch.length)return hostPos(host,0);
    const rs=ch.map(c=>c.getBoundingClientRect());
    let lt=null,ld=1e9;rs.forEach(r=>{const cy=(r.top+r.bottom)/2,d=Math.abs(cy-y)-(y>=r.top&&y<=r.bottom?1000:0);if(d<ld){ld=d;lt=r.top}});
    const pe=rs.map((r,i)=>[r,i]).filter(([r])=>Math.abs(r.top-lt)<3);
    for(const [r,i] of pe){if(x<r.left+r.width/2)return hostPos(host,+ch[i].dataset.o)}
    const [,u]=pe[pe.length-1];return hostPos(host,+ch[u].dataset.o+1);
  }
  function charAt(x,y){const el=document.elementFromPoint(x,y),c=el&&el.closest&&el.closest('[data-o]');
    if(c&&docEl.contains(c)){const h=c.closest('.wf-p');return {b:+h.dataset.b,o:+c.dataset.o}}
    const p=posAt(x,y);return p?{b:p.b,o:Math.max(0,p.o-1)}:null}
  function rectLa(p){const q=p.b>=doc.length?{b:doc.length-1,o:doc[doc.length-1].t.length}:p;const h=docEl.querySelector(`.wf-p[data-b="${q.b}"]`);if(!h)return null;
    const ch=h.querySelectorAll('[data-o]');if(!ch.length){const r=h.getBoundingClientRect();return {x:r.left+2,y:r.top+4,h:Math.min(r.height,24)}}
    if(q.o<ch.length){const r=ch[q.o].getBoundingClientRect();return {x:r.left,y:r.top+1,h:r.height}}
    const r=ch[ch.length-1].getBoundingClientRect();return {x:r.right,y:r.top+1,h:r.height}}
  function vertical(p,sus){const r=rectLa(p);if(!r)return p;return posAt(r.x+1,sus?r.y-r.h*0.6:r.y+r.h*1.5)||p}
  function capRand(p,sf){const r=rectLa(p);if(!r)return p;const h=docEl.querySelector(`.wf-p[data-b="${Math.min(p.b,doc.length-1)}"]`);
    const ch=[...h.querySelectorAll('[data-o]')].filter(x=>Math.abs(x.getBoundingClientRect().top-(r.y-1))<x.getBoundingClientRect().height/2);
    if(!ch.length)return p;return {b:+h.dataset.b,o:sf?+ch[ch.length-1].dataset.o+1:+ch[0].dataset.o}}

  /* ---- desenul ---- */
  function cssF(f){return `font-family:${FONT_CSS[f.font]||("'"+String(f.font).replace(/["'<>;&]/g,'')+"',"+FONT_CSS['Calibri (Body)'])};font-size:${(f.sz*PX).toFixed(2)}px;${f.b?'font-weight:700;':''}${f.i?'font-style:italic;':''}${f.u?'text-decoration:underline;':''}${f.col?'color:#'+f.col+';':''}`}
  function drawDoc(){
    const sel=areSel()?ord():null;
    docEl.innerHTML=doc.map((p,b)=>{
      let s=null,e=null,semn=false;
      if(sel){const [a,z]=sel;if(b>=a.b&&b<=z.b&&!(b===z.b&&z.o===0&&a.b<z.b)){s=b===a.b?a.o:0;e=b===z.b?z.o:p.t.length}semn=b>=a.b&&b<z.b}
      const car=!sel&&mod!=='trag'&&cur.b===b,F=car?fmtTastare():null,dr=mod==='trag'&&drop&&drop.b===b;
      let h='';
      /* cu ¶ pornit, și spațiul abia tastat (încă în așteptare) se vede ca ·, pe loc, ca în Word (reparat 28.09.2026).
         Rămâne un spațiu ADEVĂRAT în pagină; punctul îl desenează doar stilul (.wf-psp), ca o copie a documentului
         (de ex. previzualizarea din wordobj-tehnoredactare.js) să aibă spațiul, fără punct. */
      const pendH=car&&pend?(pil?esc(pend).replace(/ /g,'<span class="wf-psp"> </span>'):esc(pend)):'';
      for(let i=0;i<=p.t.length;i++){
        if(car&&cur.o===i)h+=(pend?`<span class="wo-pend" style="${cssF(F)}">${pendH}</span>`:'')+`<span class="wo-car" aria-hidden="true" style="height:${(F.sz*PX*1.15).toFixed(1)}px"></span>`;
        if(dr&&drop.o===i)h+='<span class="wo-drop" aria-hidden="true"></span>';
        if(i===p.t.length)break;
        const c=p.t[i],sl=s!=null&&i>=s&&i<e,cl=sl?' class="wo-sl"':'';
        if(c==='\t')h+=`<span class="wo-tab${sl?' wo-sl':''}" data-o="${i}" style="${cssF(p.f[i])}">${pil?'<span class="wf-pil">→</span>':''}</span>`;
        else if(c===' '&&pil)h+=`<span${cl} data-o="${i}" style="${cssF(p.f[i])}"><span class="wf-pil">·</span></span>`;
        else h+=`<span${cl} data-o="${i}" style="${cssF(p.f[i])}">${esc(c)}</span>`;
      }
      if(pil)h+=`<span class="wf-pil${semn?' wo-sl':''}" style="${cssF(p.mf)}" aria-hidden="true">¶</span>`;
      else if(semn)h+=`<span class="wf-pm wo-sl" style="${cssF(p.mf)}" aria-hidden="true"></span>`;
      const pf=p.pf,lh=(pf.rand||1)*1.22;
      const ps=`text-align:${pf.al};padding-left:${(pf.st*CM).toFixed(1)}px;padding-right:${(pf.dr*CM).toFixed(1)}px;text-indent:${(pf.prim*CM).toFixed(1)}px;margin:${(pf.inainte*PX).toFixed(1)}px 0 ${(pf.dupa*PX).toFixed(1)}px;line-height:${lh.toFixed(3)};min-height:${(p.mf.sz*PX*lh).toFixed(1)}px`;
      return `<p class="wf-p" data-b="${b}" style="${ps}">${h}</p>`;
    }).join('');
    docEl.classList.toggle('wo-trag',mod==='trag');
  }
  /* starea butoanelor, ca în Word: apăsat dacă toată selecția (sau textul de la cursor) are formatarea */
  function fSel(){if(!areSel())return [fmtTastare()];const [s,e]=ord(),r=[];interval(s,e,f=>r.push(f));return r.length?r:[fmtTastare()]}
  const icon=(nume,m)=>{const ic=PW&&PW.icoane&&PW.icoane[nume];return ic?`<svg viewBox="0 0 20 20" width="${m}" height="${m}" aria-hidden="true" focusable="false">${ic.map(d=>`<path d="${d}"/>`).join('')}</svg>`:''};
  function valFont(){const fs=fSel(),v=[...new Set(fs.map(f=>f.font))];return v.length===1?v[0]:''}
  function valMarime(){const fs=fSel(),v=[...new Set(fs.map(f=>f.sz))];return v.length===1?nr(v[0]):''}
  function meniuFont(){
    const v=valFont(),b=n=>`<button type="button" data-font="${esc(n)}" class="${n===v?'on':''}" style="font-family:${FONT_CSS[n]}">${esc(n)}</button>`;
    return `<div class="wf-meniu"><label class="wf-scrie">Scrie numele fontului: <input type="text" data-in="font" value="${esc(v)}" autocomplete="off" spellcheck="false"> <button type="button" class="wo-bt" data-wf="font-ok">Enter</button></label>
      <p class="wf-h">Theme Fonts (fonturile temei)</p><div class="wf-lst">${FONT_TEMA.map(b).join('')}</div>
      <p class="wf-h">All Fonts (toate fonturile)</p><div class="wf-lst">${FONT_TOATE.map(b).join('')}</div>
      <p class="hint">În Word lista are sute de fonturi; aici sunt câteva.</p></div>`;
  }
  function meniuMarime(){
    const v=valMarime();
    return `<div class="wf-meniu"><label class="wf-scrie">Scrie mărimea: <input type="text" inputmode="decimal" data-in="marime" value="${esc(v)}" autocomplete="off"> <button type="button" class="wo-bt" data-wf="marime-ok">Enter</button></label>
      <div class="wf-lst">${MARIMI.map(m=>`<button type="button" data-marime="${m}" class="${nr(m)===v?'on':''}">${nr(m)}</button>`).join('')}</div>
      <p class="hint">În Word scrii mărimea direct în casetă și apeși Enter, sau o alegi din listă.</p></div>`;
  }
  function meniuCuloare(){
    return `<div class="wf-meniu"><div class="wf-lst"><button type="button" class="wf-auto" data-col="auto">Automatic (automată)</button></div>
      <p class="wf-h">Standard Colors (culorile standard)</p><div class="wf-lst wf-culori">${CULORI.map(([h,en,ro])=>`<button type="button" class="wf-cul" data-col="${h}" style="background:#${h}" title="${en} (${ro})" aria-label="${en}, ${ro}"></button>`).join('')}</div>
      <p class="hint">În Word, deasupra sunt și culorile temei (Theme Colors); aici avem doar rândul culorilor standard.</p></div>`;
  }
  function meniuSpatiere(){
    const T=tinte(),v=T.length?doc[T[0]].pf.rand:1.08;
    return `<div class="wf-meniu"><div class="wf-lst">${[[1,'1.0'],[1.15,'1.15'],[1.5,'1.5'],[2,'2.0'],[2.5,'2.5'],[3,'3.0']].map(([x,t])=>`<button type="button" data-sp="${x}" class="${Math.abs(x-v)<0.001?'on':''}">${t}</button>`).join('')}</div>
      <div class="wf-lst"><button type="button" data-wf="dlg-par">Line Spacing Options...</button><button type="button" data-wf="nesim" data-n="Add Space Before Paragraph">Add Space Before Paragraph</button><button type="button" data-wf="nesim" data-n="Remove Space After Paragraph">Remove Space After Paragraph</button></div></div>`;
  }
  function drawRb(){
    if(!rbEl)return;
    const fs=fSel(),on=k=>fs.every(f=>f[k])?'pg-on':'';
    const T=tinte(),onAl=a=>T.length&&T.every(b=>doc[b].pf.al===a)?'pg-on':'';
    if(!real){rbEl.innerHTML='<p class="hint" style="margin:6px">Panglica nu s-a încărcat. Folosește tastele de sub document (Ctrl+B, Ctrl+E…).</p>';return}
    UP.stil();
    const L={
      Bold:{attr:'data-wf="b"',title:'Aldin (Bold) · Ctrl+B',clasa:on('b')},
      Italic:{attr:'data-wf="i"',title:'Cursiv (Italic) · Ctrl+I',clasa:on('i')},
      UnderlineGallery:{title:'Subliniat (Underline) · Ctrl+U',html:`<span class="wf-split"><button type="button" class="pg-b ${on('u')}" data-wf="u" title="Subliniat (Underline) · Ctrl+U" aria-label="Underline">${icon('UnderlineGallery',16)}</button><button type="button" class="pg-b wf-sag" data-wf="m-u" title="Alte feluri de linie" aria-label="Underline, alte feluri de linie">▾</button></span>`},
      Font:{title:'Font (Font)',html:`<button type="button" class="wf-cb" data-wf="m-font" title="Font (Font)" aria-label="Font: ${esc(valFont()||'mai multe')}"><span class="wf-cbv">${esc(valFont())}</span><span class="pg-sag">▾</span></button>`},
      FontSize:{title:'Mărimea fontului (Font Size)',html:`<button type="button" class="wf-cb" data-wf="m-marime" title="Mărimea fontului (Font Size)" aria-label="Font Size: ${esc(valMarime()||'mai multe')}"><span class="wf-cbv">${esc(valMarime())}</span><span class="pg-sag">▾</span></button>`},
      FontSizeIncreaseWord:{attr:'data-wf="grow"',title:'Mărire dimensiune font (Grow Font) · Ctrl+Shift+>'},
      FontSizeDecreaseWord:{attr:'data-wf="shrink"',title:'Micșorare dimensiune font (Shrink Font) · Ctrl+Shift+<'},
      FontColorPicker:{title:'Culoare font (Font Color)',html:`<span class="wf-split"><button type="button" class="pg-b" data-wf="col" title="Culoare font (Font Color): ${esc(NUME_CUL(culBtn))}" aria-label="Font Color"><span class="wf-a">A<span class="wf-bara" style="background:#${culBtn}"></span></span></button><button type="button" class="pg-b wf-sag" data-wf="m-col" title="Alege culoarea" aria-label="Font Color, alege culoarea">▾</button></span>`},
      AlignLeft:{attr:'data-wf="al-left"',title:'Aliniere la stânga (Align Left) · Ctrl+L',clasa:onAl('left')},
      AlignCenter:{attr:'data-wf="al-center"',title:'Centrat (Center) · Ctrl+E',clasa:onAl('center')},
      AlignRight:{attr:'data-wf="al-right"',title:'Aliniere la dreapta (Align Right) · Ctrl+R',clasa:onAl('right')},
      AlignJustifyMenu:{attr:'data-wf="al-justify"',title:'Stânga-dreapta (Justify) · Ctrl+J',clasa:onAl('justify')},
      IndentIncreaseWord:{attr:'data-wf="ind+"',title:'Mărire indent (Increase Indent)'},
      IndentDecreaseWord:{attr:'data-wf="ind-"',title:'Micșorare indent (Decrease Indent)'},
      LineSpacingGallery:{attr:'data-wf="m-sp"',title:'Spațiere între rânduri și paragrafe (Line and Paragraph Spacing)'},
      ParagraphMarks:{attr:'data-wf="pil"',title:'Afișare/ascundere ¶ (Show All)',clasa:pil?'pg-on':''},
      ParagraphDialog:{attr:'data-wf="dlg-par"',title:'Paragraph (Paragraf): fereastra cu alineatul și spațierea'},
      FontDialog:{attr:'data-wf="dlg-font"',title:'Font… (fereastra Font)'},
      Paste:{attr:'data-wf="v"',title:'Lipire (Paste) · Ctrl+V',clasa:clip?'':'pg-gri'},
      Cut:{attr:'data-wf="x"',title:'Decupare (Cut) · Ctrl+X',clasa:areSel()?'':'pg-gri'},
      Copy:{attr:'data-wf="c"',title:'Copiere (Copy) · Ctrl+C',clasa:areSel()?'':'pg-gri'}
    };
    const men={};
    if(fila==='TabHome'&&meniu){const m={Font:meniuFont,FontSize:meniuMarime,FontColorPicker:meniuCuloare,LineSpacingGallery:meniuSpatiere,
      UnderlineGallery:()=>'<p class="hint" style="margin:2px 4px">În Word, aici alegi alt fel de linie (dublă, groasă, punctată). În lecția asta folosim linia simplă: butonul <b>U</b>.</p>'}[meniu];if(m)men[meniu]=m()}
    rbEl.innerHTML=UP.html(PW,{fila,legaturi:L,meniu:men});
  }
  function drawDlg(){
    if(dlg!=='par'){dlgEl.innerHTML='';return}
    const T=tinte(),pf=doc[T[0]].pf,sp=pf.prim>0.001?'first':pf.prim<-0.001?'hang':'',by=sp?nr(Math.abs(pf.prim))+' cm':'';
    const left=pf.prim<-0.001?pf.st+pf.prim:pf.st;
    dlgEl.innerHTML=`<div class="wo-win" role="dialog" aria-label="Fereastra Paragraph (Paragraf)">
      <div class="wo-wt"><span>Paragraph</span><button type="button" data-wf="dlg-x" aria-label="Închide fereastra">✕</button></div>
      <div class="wo-wp">Indents and Spacing</div>
      <div class="wf-dp">
        <fieldset><legend>General</legend><label>Alignment: <select data-d="al">${[['left','Left'],['center','Centered'],['right','Right'],['justify','Justified']].map(([v,t])=>`<option value="${v}"${pf.al===v?' selected':''}>${t}</option>`).join('')}</select></label></fieldset>
        <fieldset><legend>Indentation</legend>
          <label>Left: <input data-d="st" value="${nr(left)} cm"></label><label>Right: <input data-d="dr" value="${nr(pf.dr)} cm"></label>
          <label>Special: <select data-d="sp"><option value=""${sp===''?' selected':''}>(none)</option><option value="first"${sp==='first'?' selected':''}>First line</option><option value="hang"${sp==='hang'?' selected':''}>Hanging</option></select></label>
          <label>By: <input data-d="by" value="${esc(by)}"></label></fieldset>
        <fieldset><legend>Spacing</legend>
          <label>Before: <input data-d="inainte" value="${nr(pf.inainte)} pt"></label><label>After: <input data-d="dupa" value="${nr(pf.dupa)} pt"></label>
          <label>Line spacing: <select data-d="rt">${[['simplu','Single'],['1.5','1.5 lines'],['dublu','Double'],['multiplu','Multiple']].map(([v,t])=>`<option value="${v}"${pf.rt===v?' selected':''}>${t}</option>`).join('')}</select></label>
          <label>At: <input data-d="at" value="${pf.rt==='multiplu'?nr(pf.rand):''}"></label></fieldset>
      </div>
      <div class="wo-wb"><button type="button" class="wo-bt pr" data-wf="dlg-ok">OK</button><button type="button" class="wo-bt" data-wf="dlg-x">Cancel</button></div>
      <p class="hint">Etichetele sunt cele din Word-ul în engleză. Într-un Word în română sunt traduse, în aceleași locuri ale ferestrei. În simulator, la Line spacing ai Single, 1.5 lines, Double și Multiple (Word mai are „At least” și „Exactly”).</p></div>`;
  }
  const st=()=>({log});
  function drawTeste(){const d=clone(doc);if(pend){const p=d[cur.b],F=fmtTastare();p.t=p.t.slice(0,cur.o)+pend+p.t.slice(cur.o);p.f.splice(cur.o,0,...Array.from({length:pend.length},()=>cf(F)))}
    testEl.innerHTML=testeaza(Q,d,st()).map(t=>`<li class="${t.ok?'ok':''}"><span class="ic" aria-hidden="true">${t.ok?'✔':'○'}</span><span>${esc(t.ce)}${t.ok?'<span class="sr-only"> — gata</span>':''}</span></li>`).join('')}
  function draw(){drawRb();drawDlg();drawDoc();drawTeste()}

  /* ---- meniul de la clic dreapta ---- */
  function arataCtx(x,y){
    const r=woEl.getBoundingClientRect(),g=!areSel();
    ctxEl.innerHTML=`<button type="button" role="menuitem" data-ctx="x" aria-disabled="${g}">Cut<span class="wo-ro">Decupare</span></button>
      <button type="button" role="menuitem" data-ctx="c" aria-disabled="${g}">Copy<span class="wo-ro">Copiere</span></button>
      <button type="button" role="menuitem" data-ctx="v" aria-disabled="${!clip}">Paste<span class="wo-ro">Lipire</span></button>
      <button type="button" role="menuitem" data-ctx="font">Font...<span class="wo-ro">Font…</span></button>
      <button type="button" role="menuitem" data-ctx="par">Paragraph...<span class="wo-ro">Paragraf…</span></button>`;
    ctxEl.hidden=false;const w=ctxEl.offsetWidth,h=ctxEl.offsetHeight;let L=x-r.left,T=y-r.top;L=Math.max(4,Math.min(L,r.width-w-4));if(T+h>r.height)T=Math.max(4,T-h);
    ctxEl.style.left=L+'px';ctxEl.style.top=T+'px';ctx=true;
  }
  function inchideCtx(){if(ctx){ctxEl.hidden=true;ctx=false}}
  function inSelectie(p,x,y){if(!areSel())return false;const [s,z]=ord();if(cmp(p,s)>0&&cmp(p,z)<0)return true;const c=charAt(x,y);if(!c)return false;
    const el=document.elementFromPoint(x,y);return !!(el&&el.closest&&el.closest('.wo-sl'))&&cmp(c,s)>=0&&cmp(c,z)<0}

  /* ---- mouse și deget ---- */
  woEl.addEventListener('pointerdown',e=>{ultimulPointer=e.pointerType||'mouse';if(ctx&&!e.target.closest('.wo-ctx'))inchideCtx()},true);
  docEl.addEventListener('pointerdown',e=>{
    if(api.done())return;if(e.button!==0&&e.pointerType==='mouse')return;
    commit();spune('');if(meniu){meniu=null;drawRb()}
    const now=Date.now(),tol=e.pointerType==='mouse'?2:26;
    const n=(now-ultim.t<500&&Math.abs(e.clientX-ultim.x)<=tol&&Math.abs(e.clientY-ultim.y)<=tol)?Math.min(ultim.n+1,3):1;
    ultim={t:now,x:e.clientX,y:e.clientY,n};
    const p=posAt(e.clientX,e.clientY);if(!p)return;
    try{docEl.setPointerCapture(e.pointerId)}catch(_){}
    apasat={x:e.clientX,y:e.clientY};tragAnc=null;
    if(n===1){
      if(e.shiftKey&&ank){cur=p;tf=null;mod='selectez'}
      else if(e.ctrlKey||e.metaKey){const c=charAt(e.clientX,e.clientY)||p;const [a,b]=unitPropozitie(txtLa(c),c.o);ank={b:c.b,o:a};cur={b:c.b,o:b};tf=null;mod=null}
      else if(inSelectie(p,e.clientX,e.clientY)){mod='poate'}
      else{pune(p);mod='selectez';const c=charAt(e.clientX,e.clientY),t=c?txtLa(c):'';const [wa,wb]=c&&t.length?unitCuvant(t,c.o):[p.o,p.o];tragAnc={p:cp(p),wa,wb,b:(c||p).b}}
    }else if(n===2){const c=charAt(e.clientX,e.clientY)||p;const [a,b]=unitCuvant(txtLa(c),c.o);ank={b:c.b,o:a};cur={b:c.b,o:b};tf=null;mod=null}
    else{const c=charAt(e.clientX,e.clientY)||p;ank={b:c.b,o:0};cur=c.b+1<doc.length?{b:c.b+1,o:0}:fin();tf=null;mod=null}
    draw();
  });
  docEl.addEventListener('pointermove',e=>{
    if(!mod||api.done())return;
    if(mod==='selectez'){
      const p=posAt(e.clientX,e.clientY);if(!p)return;
      const baza=tragAnc?tragAnc.p:ank;let na=baza,nf=p;
      if(tragAnc&&!same(p,baza)){const A=tragAnc,fw=cmp(p,baza)>0;   // „When selecting, automatically select entire word” (pornit, probat în lecția 5)
        if(fw&&!(p.b===A.b&&p.o<=A.wb)){na={b:baza.b,o:Math.min(A.wa,baza.o)};if(p.o>0){const t=txtLa(p);nf={b:p.b,o:unitCuvant(t,p.o-1)[1]}}}
        else if(!fw&&!(p.b===A.b&&p.o>=A.wa)){na={b:baza.b,o:Math.max(A.wb,baza.o)};const t=txtLa(p);if(p.o<t.length)nf={b:p.b,o:unitCuvant(t,p.o)[0]}}}
      if(!same(na,ank)||!same(nf,cur)){ank=na;cur=nf;tf=null;draw()}
      return;
    }
    if(mod==='poate'&&apasat&&Math.hypot(e.clientX-apasat.x,e.clientY-apasat.y)>5)mod='trag';
    if(mod==='trag'){const p=posAt(e.clientX,e.clientY);if(p&&(!drop||!same(p,drop))){drop=p;drawDoc()}}
  });
  docEl.addEventListener('pointerup',e=>{
    if(mod==='poate'){const p=posAt(e.clientX,e.clientY);if(p)pune(p);mod=null;draw();focusIn();return}
    if(mod==='trag'){const d=drop;mod=null;drop=null;if(d)trage(d,e.ctrlKey||e.metaKey);draw();focusIn();return}
    mod=null;draw();focusIn();
  });
  docEl.addEventListener('pointercancel',()=>{mod=null;drop=null;drawDoc()});
  docEl.addEventListener('contextmenu',e=>{e.preventDefault();if(api.done())return;commit();mod=null;drop=null;
    const p=posAt(e.clientX,e.clientY);if(p){const [s,z]=ord();if(!(areSel()&&cmp(p,s)>=0&&cmp(p,z)<=0))pune(p)}draw();arataCtx(e.clientX,e.clientY)});
  ctxEl.addEventListener('click',e=>{const b=e.target.closest('[data-ctx]');if(!b)return;
    if(b.getAttribute('aria-disabled')==='true'){spune(b.dataset.ctx==='v'?'Clipboardul e gol.':'Selectează întâi textul.');return}
    inchideCtx();const k=b.dataset.ctx;
    if(k==='x')copiaza(true);else if(k==='c')copiaza(false);else if(k==='v')lipeste();
    else if(k==='par'){commit();dlg='par';meniu=null}else if(k==='font')spune('Fereastra Font (Ctrl+D) nu e în simulator. Folosește grupul <b>Font</b> de pe fila Home.');
    draw();focusIn()});

  /* ---- tastatura ---- */
  inp.addEventListener('input',()=>{
    if(api.done()){inp.value='';return}
    if(!tSnap){tSnap=stare();if(areSel()){const F=cf(primulF(...ord()));const [s,e]=ord();pune(sterge(s,e,false));tf=F}}   // tastarea înlocuiește selecția și îi ia formatarea
    if(cur.b>=doc.length)pune({b:doc.length-1,o:doc[doc.length-1].t.length});
    pend=inp.value;drawDoc();drawTeste();
  });
  const CTRL_K={b:()=>formChar('b'),i:()=>formChar('i'),u:()=>formChar('u'),e:()=>aliniaza('center'),l:()=>aliniaza('left'),
    r:()=>aliniaza('right'),j:()=>aliniaza('justify'),z:()=>{commit();anuleaza()},y:reface,c:()=>copiaza(false),x:()=>copiaza(true),v:lipeste,
    m:()=>indent(1),1:()=>spatiere(1,'simplu'),2:()=>spatiere(2,'dublu'),5:()=>spatiere(1.5,'1.5'),q:()=>formPar(pf=>Object.assign(pf,cpf(PF0)),'reset'),
    a:()=>{commit();ank={b:0,o:0};cur=fin();tf=null},s:()=>spune('În simulator nu se salvează nimic. În Word, Ctrl+S salvează documentul.'),
    d:()=>spune('Fereastra Font (Ctrl+D) nu e în simulator. Folosește grupul <b>Font</b> de pe fila Home.')};
  inp.addEventListener('keydown',e=>{
    if(api.done())return;
    const k=e.key,ctrl=(e.ctrlKey||e.metaKey)&&!e.altKey,kl=k.length===1?k.toLowerCase():k;
    let fa=null;
    if(ctrl&&e.shiftKey&&(k==='>'||k==='.'))fa=()=>formChar('grow');
    else if(ctrl&&e.shiftKey&&(k==='<'||k===','))fa=()=>formChar('shrink');
    else if(ctrl&&e.shiftKey&&kl==='m')fa=()=>indent(-1);
    else if(ctrl&&k===' ')fa=()=>formChar('reset');
    else if(ctrl&&!e.shiftKey&&CTRL_K[kl])fa=CTRL_K[kl];
    else if(k==='Enter')fa=enter;
    else if(k==='Tab'&&!e.shiftKey)fa=tab;
    else if(k==='Backspace'&&(!inp.value||ctrl))fa=()=>backspace(ctrl);
    else if(k==='Delete')fa=()=>del(ctrl);
    else if(/^(Arrow(Left|Right|Up|Down)|Home|End)$/.test(k)){
      fa=()=>{commit();const ext=e.shiftKey;let f=cur;
        if(!ext&&areSel()&&(k==='ArrowLeft'||k==='ArrowRight')){const [s,z]=ord();pune(k==='ArrowLeft'?s:(z.b>=doc.length?{b:doc.length-1,o:doc[doc.length-1].t.length}:z));return}
        const c0=cur.b>=doc.length?{b:doc.length-1,o:doc[doc.length-1].t.length}:cur;
        if(k==='ArrowLeft')f=c0.o>0?{b:c0.b,o:c0.o-1}:c0.b>0?{b:c0.b-1,o:doc[c0.b-1].t.length}:c0;
        else if(k==='ArrowRight')f=c0.o<doc[c0.b].t.length?{b:c0.b,o:c0.o+1}:c0.b+1<doc.length?{b:c0.b+1,o:0}:(ext?fin():c0);
        else if(k==='ArrowUp')f=vertical(c0,true);else if(k==='ArrowDown')f=vertical(c0,false);
        else if(k==='Home')f=ctrl?{b:0,o:0}:capRand(c0,false);else if(k==='End')f=ctrl?{b:doc.length-1,o:doc[doc.length-1].t.length}:capRand(c0,true);
        if(ext){cur=f;tf=null}else pune(f)};
    }
    if(!fa)return;
    e.preventDefault();pend=inp.value;fa();draw();
  });
  inp.addEventListener('paste',e=>{e.preventDefault();pend=inp.value;lipeste();draw()});
  inp.addEventListener('copy',e=>e.preventDefault());inp.addEventListener('cut',e=>e.preventDefault());

  /* ---- butoanele: tastele de sub document, panglica, meniurile, fereastra ---- */
  function aplicaMarime(txt){
    const s=String(txt).trim().replace(',','.');
    if(!/^\d+(\.\d+)?$/.test(s)){spune('Word: „This is not a valid number.” (Nu e un număr.) Scrie doar numărul, de exemplu 18.');return false}
    const v=Math.floor(parseFloat(s)*2)/2;   // din jumătate în jumătate: 13,3 -> 13 (probat)
    if(v<1||v>1638){spune('Word: „The number must be between 1 and 1638.” (Numărul trebuie să fie între 1 și 1638.)');return false}
    formChar('sz',v);return true;
  }
  function aplicaFont(txt){const n=String(txt).trim();if(!n)return false;const g=[...FONT_TEMA,...FONT_TOATE].find(x=>x.toLowerCase()===n.toLowerCase());
    if(!g)spune(`Fontul „${esc(n)}” nu e în lista simulatorului. În Word, un font care nu e pe calculator se scrie totuși în casetă, dar literele se văd cu alt font. Alege unul din listă.`);
    formChar('font',g||n);return true}
  woEl.addEventListener('click',e=>{
    const k=e.target.closest('[data-k]');
    if(k&&woEl.contains(k)){
      if(api.done())return;spune('');pend=inp.value;const w=k.dataset.k;
      if(w==='enter')enter();else if(w==='bs')backspace(false);else if(w==='del')del(false);
      else if(w==='reset'){doc=start(Q);pune({b:0,o:0});pend='';inp.value='';tSnap=null;hist=[];refa=[];log=[];meniu=null;dlg=null;inchideCtx();spune('Documentul e din nou ca la început.')}
      else if(CTRL_K[w])CTRL_K[w]();
      draw();focusIn();return;
    }
    const b=e.target.closest('button');if(!b||!((rbEl&&rbEl.contains(b))||(dlgEl&&dlgEl.contains(b))))return;
    if(api.done())return;spune('');pend=inp.value;
    if(b.dataset.tab){fila=b.dataset.tab;meniu=null;drawRb();if(fila!=='TabHome')spune('În lecția asta lucrezi pe fila <b>Home</b> (Pornire).');return}
    if(b.dataset.nesim){const n=b.getAttribute('aria-label')||'';spune(n==='Format Painter'?'„Format Painter” e aici și în Word, dar în lecția asta nu-l folosim.':`„${esc(n)}” e aici și în Word, dar în lecția asta nu-l folosim.`);return}
    if(b.dataset.font){meniu=null;formChar('font',b.dataset.font);draw();focusIn();return}
    if(b.dataset.marime){meniu=null;formChar('sz',+b.dataset.marime);draw();focusIn();return}
    if(b.dataset.col){meniu=null;const c=b.dataset.col==='auto'?null:b.dataset.col;if(c)culBtn=c;formChar('col',c);draw();focusIn();return}
    if(b.dataset.sp){meniu=null;const v=+b.dataset.sp;spatiere(v,v===1?'simplu':v===1.5?'1.5':v===2?'dublu':'multiplu');draw();focusIn();return}
    const w=b.dataset.wf;if(!w)return;
    const MEN={'m-font':'Font','m-marime':'FontSize','m-col':'FontColorPicker','m-sp':'LineSpacingGallery','m-u':'UnderlineGallery'};
    if(MEN[w]){commit();meniu=meniu===MEN[w]?null:MEN[w];dlg=null;drawRb();drawDlg();const i=rbEl.querySelector('[data-in]');if(i&&ultimulPointer==='mouse')i.focus({preventScroll:true});return}
    if(w==='font-ok'){const i=rbEl.querySelector('[data-in="font"]');if(i&&aplicaFont(i.value))meniu=null;draw();focusIn();return}
    if(w==='marime-ok'){const i=rbEl.querySelector('[data-in="marime"]');if(i&&aplicaMarime(i.value))meniu=null;draw();focusIn();return}
    if(w==='nesim'){spune(`„${esc(b.dataset.n)}”: în Word adaugă sau scoate spațiul dintre paragrafe. În simulator îl schimbi din fereastra Paragraph (Before / After).`);return}
    if(w==='b'||w==='i'||w==='u')formChar(w);
    else if(w==='grow'||w==='shrink')formChar(w);
    else if(w==='col')formChar('col',culBtn);
    else if(w.startsWith('al-'))aliniaza(w.slice(3));
    else if(w==='ind+')indent(1);else if(w==='ind-')indent(-1);
    else if(w==='pil')pil=!pil;
    else if(w==='v')lipeste();else if(w==='x')copiaza(true);else if(w==='c')copiaza(false);
    else if(w==='dlg-font'){spune('Fereastra Font nu e în simulator. Folosește casetele și butoanele din grupul <b>Font</b>.');return}
    else if(w==='dlg-par'){commit();dlg='par';meniu=null;draw();const s=dlgEl.querySelector('select,input');if(s&&ultimulPointer==='mouse')s.focus({preventScroll:true});return}
    else if(w==='dlg-x'){dlg=null;draw();focusIn();return}
    else if(w==='dlg-ok'){if(okDialog()){dlg=null;draw();focusIn()}return}
    meniu=null;draw();focusIn();
  });
  woEl.addEventListener('keydown',e=>{const i=e.target.closest&&e.target.closest('[data-in]');if(!i||e.key!=='Enter')return;e.preventDefault();
    if(i.dataset.in==='font'){if(aplicaFont(i.value))meniu=null}else if(aplicaMarime(i.value))meniu=null;draw();focusIn()});
  woEl.addEventListener('change',e=>{const s=e.target.closest&&e.target.closest('[data-d="sp"]');if(!s)return;const by=dlgEl.querySelector('[data-d="by"]');if(!by)return;
    if(s.value==='')by.value='';else if(!by.value.trim()||parseFloat(by.value.replace(',','.'))===0)by.value='1,27 cm'});   // valoarea pusă singură de Word: NEPROBATĂ (afirmatii.json)
  const masura=(txt,unit)=>{let s=String(txt).trim().toLowerCase().replace(',','.');if(!s)return 0;
    const m=s.match(/^(-?\d+(?:\.\d+)?)\s*(cm|pt|"|in|mm)?$/);if(!m)return NaN;const v=parseFloat(m[1]),u=m[2]||unit;
    if(unit==='pt')return u==='cm'?v*28.3465:u==='mm'?v*2.83465:u==='"'||u==='in'?v*72:v;
    return u==='pt'?v/28.3465:u==='mm'?v/10:u==='"'||u==='in'?v*2.54:v};
  function okDialog(){
    const q=s=>dlgEl.querySelector(`[data-d="${s}"]`);
    const al=q('al').value,stv=masura(q('st').value,'cm'),drv=masura(q('dr').value,'cm'),sp=q('sp').value,by=sp?masura(q('by').value,'cm'):0;
    const inainte=masura(q('inainte').value,'pt'),dupa=masura(q('dupa').value,'pt'),rt=q('rt').value,at=parseFloat(String(q('at').value).replace(',','.'));
    if([stv,drv,by,inainte,dupa].some(x=>isNaN(x))||(rt==='multiplu'&&!(at>0))){spune('Word: „This is not a valid measurement.” (Nu e o măsură bună.) Scrie un număr, de exemplu <b>1,25 cm</b>.');return false}
    const rand=rt==='simplu'?1:rt==='1.5'?1.5:rt==='dublu'?2:at;
    formPar(pf=>{pf.al=al;pf.dr=drv;pf.inainte=inainte;pf.dupa=dupa;pf.rand=rand;pf.rt=rt;
      if(sp==='first'){pf.prim=by;pf.st=stv}else if(sp==='hang'){pf.prim=-by;pf.st=stv+by}else{pf.prim=0;pf.st=stv}},'dlgpar');
    return true;
  }

  const nav=api.checkButton(()=>{
    pend=inp.value;commit();inchideCtx();meniu=null;draw();
    const T=testeaza(Q,doc,st()),bad=T.filter(t=>!t.ok);
    if(!bad.length){nav.innerHTML='';api.resolve(true);return}
    api.resolve(false,`${T.length-bad.length} din ${T.length} teste trecute. ${bad[0].cum}`);
    if(PTR==='mouse')inp.focus({preventScroll:true});   // focusul înapoi în document: Ctrl+Z, Ctrl+B merg imediat (regula 14)
    api.revealButton(()=>{doc=solutie(Q);pune({b:0,o:0});pend='';inp.value='';tSnap=null;dlg=null;draw();nav.innerHTML='';
      api.giveUp('documentul arată acum ca în sarcină. Uită-te ce s-a schimbat față de al tău.')});
  });
  body._wf={
    set:(d,o)=>{doc=d;pune({b:0,o:0});pend='';inp.value='';tSnap=null;hist=[];refa=[];o=o||{};log=o.log||[];dlg=null;meniu=null;draw()},
    stare:()=>({doc:clone(doc),cur:cp(cur),ank:cp(ank),pend,tf:tf&&cf(tf),log:log.slice(),dlg,meniu,pil})
  };
  draw();
}
function jurnalPentru(Q){const L=[];(Q.verif||[]).forEach(v=>{if(v.foloseste==='cursor')L.push({op:'cuvant'});if(v.foloseste==='tastare')L.push({op:'tf'},{op:'tastat_tf'});if(v.foloseste==='anulare')L.push({op:'z'});if(v.foloseste==='fereastra')L.push({op:'dlgpar'})});return L}
G.TipWordFormat={
  render,
  rezolva(Q,body){body._wf.set(solutie(Q),{log:jurnalPentru(Q)})},
  gresit(Q,body){body._wf.set(gresitDoc(Q),{log:[]})},
  teste:testeaza,solutie,gresitDoc,mk
};
if(typeof module!=='undefined'&&module.exports)module.exports={testeaza,solutie,gresitDoc,mk};
})(typeof window!=='undefined'?window:globalThis);
