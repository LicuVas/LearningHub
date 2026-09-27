/* lectii/_sim/excelx-formule.js — extensia „formule cu operatori aritmetici” a foii excelx (lecția VIII / M1 / nr. 7).
   PROPRIETAR: autorul lecției VIII/7. Nu schimbă excelx.js (al lecției 5) și nici motorul (_motor/tip-foaie.js, tip-excel.js).
   ÎNCĂRCARE (după excelx.js): <script src="../../_sim/excelx-formule.js"></script>, apoi tipuri:{excelx:ExcelF}.
   Toate faptele de mai jos sunt probate în Excel REAL (Microsoft 365, interfața în engleză, setări regionale românești):
   lectii/viii/m1-l07/_proba/proba_excel.json (COM, instanță nouă și invizibilă) și proba_ascuns*.json (tastare adevărată
   pe un desktop ascuns, cu ferestrele de dialog prinse).

   CE ADAUGĂ (regula fidelității, jocuri/README.md §1), prin învelirea lui JocFoaie.evaluate (chemat dinamic de foaie):
   1. =A2xB2 (x în loc de *) -> #NAME?, ca în Excel (foaia din motor arăta fereastra de problemă). Orice cuvânt din formulă
      care nu e adresă de celulă și nici funcție urmată de paranteză -> #NAME? (dacă restul formulei e scris corect).
   2. =5x3 -> Excel NU o primește: propune „corectura” =5*3 (fereastra „We found a typo in your formula…”, Yes/No; la No:
      „There's a problem with this formula”). Foaia arată fereastra de problemă și spune ce ar propune Excel.
   3. =A2*0.5 pe setări românești -> Excel NU o primește: propune „corectura” =A2*05, adică =A2*5 (probat). Foaia din motor
      o calcula (4). Acum: fereastra de problemă + explicația (zecimala cu virgulă).
   4. =A2:B2 (două puncte în loc de /) -> Excel 365 „varsă” valorile (C2 = 20, D2 = 4); Excel 2016/2019 dă #VALUE!.
      Foaia arată #VALUE! (ca Excel-ul mai vechi) și explică: „:” face o zonă. =20:4 -> Excel o primește ca rândurile 4:20
      (#SPILL! sau 0, după locul formulei); foaia arată #SPILL! și aceeași explicație (înainte: fereastra de problemă).
   5. Un număr păstrat ca text cu apostrof ('007) intră în calcul ca număr: cu '007 în A2, =A2*2 dă 14, ca în Excel
      (foaia dădea #VALUE!).
   6. TESTELE numite pentru formule, pe COMPORTAMENT (ca verificarea foii): teste:[{ce, formule:{D2:'=B2*C2'}, tip, valori}]
      se bifează doar când celula are o formulă cu adrese care dă rezultatul bun și pe datele schimbate (numerele din
      `cells` + 3, + 6, + 9, aceeași regulă ca foaia din motor), deci nu și pentru un număr scris de mână.
   7. (reparațiile după judecătorul lecției 7, 27.09.2026, lectii/viii/m1-l07/_verificare/judecator.md)
      - un text pe care Excel îl ia drept număr („150 lei”, „12 octombrie 2026”) intră în calcul ca număr chiar din primul
        desen (înainte: C2 arăta #VALUE! până la următorul clic);
      - =A2 x B2 (cu spații) -> #NAME? cu mesajul despre * (înainte: fereastra despre un „0” nescris);
      - × și ÷ devin * și / (Excel 365); +A2*B2 / -A2*B2 devin formule (=+A2*B2), ca în Excel;
      - celula cu cod de eroare are triunghiul verde; pe ecranele tactile, ținte de atins de cel puțin 36-40 px.
      - (judecătorul 2) =A2 B2, cu semnul uitat -> #NULL! și mesajul „Ai uitat semnul dintre A2 și B2”, fără fereastră.
   NU face (spus în lectii/viii/m1-l07/surse.md): fereastra Yes/No a corecturii propuse (elevul nu o poate accepta aici);
   „vărsarea” lui =A2:B2 din Excel 365 (mesajul o spune); afișarea „General” pe lățimea coloanei (3,333333 în Excel, aici
   mai multe zecimale); „'12 lei” cu apostrof într-o formulă (Excel: 24; aici #VALUE!).
   Global: window.ExcelF (tipul), window.ExcelFormule ({valoare, afisare} pentru mini-foile „Uite cum”). */
(function(){
'use strict';
const J=window.JocFoaie;
function FE(msg,show){const e=new Error(msg);e.show=show;return e}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function eAdresa(t){const m=String(t).replace(/\$/g,'').match(/^([A-Za-z]{1,3})(\d{1,7})$/);if(!m)return false;
  const col=m[1].toUpperCase().split('').reduce((x,c)=>x*26+c.charCodeAt(0)-64,0);return col<=16384&&+m[2]>=1&&+m[2]<=1048576}
const faraText=f=>f.replace(/"[^"]*"?/g,'""');   // ce e între ghilimele nu contează la verificările de mai jos
const CUV=/[A-Za-zĂÂÎȘȚăâîșțŞŢşţ_\\][A-Za-z0-9_.ĂÂÎȘȚăâîșțŞŢşţ]*/g;

/* × și ÷ devin * și / (în afara ghilimelelor), ca în Excel 365: =A2×B2 -> =A2*B2 (probat de judecătorul lecției 7,
   _verificare/j_excel_semne.json); literele din afara ghilimelelor, mari (ca la Enter în Excel) */
const semne=f=>{let q=false,o='';for(const ch of f){if(ch==='"')q=!q;o+=q?ch:ch==='×'?'*':ch==='÷'?'/':ch}return o};
const mari=f=>{let q=false,o='';for(const ch of f){if(ch==='"')q=!q;o+=q?ch:ch.toUpperCase()}return o};
if(J&&!J._formuleL07){
  const orig=J.evaluate;
  J.evaluate=function(formula,get){
    if(typeof formula==='string'&&formula.startsWith('=')){
      formula=semne(formula);
      const s=faraText(formula.slice(1)).replace(/\$/g,''),t=s.trim();let m;
      // 4. două puncte între două adrese / două numere, singure în formulă
      if((m=t.match(/^([A-Za-z]{1,3}\d+)\s*:\s*([A-Za-z]{1,3}\d+)$/))&&eAdresa(m[1])&&eAdresa(m[2])){const a=m[1].toUpperCase(),b=m[2].toUpperCase();
        throw FE(`Semnul : nu împarte. În Excel, ${a}:${b} înseamnă zona de celule de la ${a} la ${b} (lecția 4). Excel-ul nou (365) copiază alături numerele din zonă, fără să calculeze; Excel-ul mai vechi arată #VALUE!. Împărțirea se scrie cu /, de exemplu =${a}/${b}.`,'#VALUE!')}
      if((m=t.match(/^(\d+)\s*:\s*(\d+)$/)))
        throw FE(`Semnul : nu împarte. Excel ia ${m[1]}:${m[2]} drept rândurile de la ${Math.min(+m[1],+m[2])} la ${Math.max(+m[1],+m[2])}. Împărțirea se scrie cu /, de exemplu =${m[1]}/${m[2]}.`,'#SPILL!');
      // 3. zecimala cu punct, pe setări românești
      if(/\d\.\d/.test(s)){const prop='='+formula.slice(1).replace(/(\d)\.(\d)/g,'$1$2');
        throw FE(`Pe setări românești, zecimala se scrie cu virgulă (de exemplu 0,5), nu cu punct. Excel-ul adevărat îți propune aici „corectura” ${prop}, care scoate punctul și schimbă numărul: nu o accepta, scrie virgula.`,'⚠')}
      // 2. x între două numere
      if(/\d\s*[xX]\s*\d/.test(s)){const prop='='+formula.slice(1).replace(/(\d)\s*[xX]\s*(\d)/g,'$1*$2');
        throw FE(`Înmulțirea se scrie cu *, nu cu x. Excel-ul adevărat îți propune aici corectura ${prop}.`,'⚠')}
      // 1. cuvinte necunoscute -> #NAME? (dacă, fără ele, formula e scrisă corect). În Excel, spațiul dintre doi
      //    operanzi e și el un semn (intersecția), deci =A2 x B2 e primită și dă #NAME? (probat de judecător).
      const necunoscute=[];
      const inloc=s.replace(CUV,(w,off)=>{const inainte=s[off-1]||'',dupa=s.slice(off+w.length).trimStart();
        if(/[0-9]/.test(inainte))return w;                          // bucată dintr-un număr: o lasă foii
        if(/^(TRUE|FALSE)$/i.test(w)||dupa[0]==='('||eAdresa(w))return w;
        necunoscute.push(w);return '0'});
      if(necunoscute.length){
        const proba='='+inloc.replace(/([A-Za-z0-9_)"])\s+(?=[A-Za-z0-9_("])/g,'$1+');
        try{orig.call(this,proba,()=>0)}catch(e){if(e&&e.show==='⚠')throw e}
        const w=/^[xX]$/.test(necunoscute[0])?'x':necunoscute[0],cuX=mari('='+formula.slice(1).replace(/([A-Za-z]{1,3}\d+)\s*[xX]\s*(?=[A-Za-z]{1,3}\d+)/g,'$1*'));
        throw FE(cuX!==mari(formula)?`Excel nu cunoaște cuvântul „${w}”: litera x nu înmulțește. Înmulțirea se scrie cu *: ${cuX}.`
          :`Excel nu cunoaște cuvântul „${w}” din formulă. O adresă se scrie cu litera coloanei și numărul rândului (A2), iar semnele de calcul sunt + - * /.`,'#NAME?')}
      // 0. semnul uitat între două adrese (=A2 B2): în Excel spațiul e intersecția a două zone care nu se ating -> #NULL!
      //    (judecătorul 2 al lecției 7, N1: Excel real, tastat, arată #NULL!, fără fereastră)
      if((m=s.match(/([A-Za-z]{1,3}\d+)\s+([A-Za-z]{1,3}\d+)/))&&eAdresa(m[1])&&eAdresa(m[2])&&m[1].toUpperCase()!==m[2].toUpperCase()){
        const proba='='+s.replace(/([A-Za-z]{1,3}\d+)\s+(?=[A-Za-z]{1,3}\d+)/g,'$1+');
        try{orig.call(this,proba,()=>0)}catch(e){if(e&&e.show==='⚠')throw e}
        const a=m[1].toUpperCase(),b=m[2].toUpperCase();
        throw FE(`Ai uitat semnul dintre ${a} și ${b}: între ele trebuie un semn de calcul (+ - * /). Excel arată aici #NULL!.`,'#NULL!')}
    }
    // 5. în calcul: textul cu apostrof ('007) intră fără apostrof; un text pe care Excel îl ia drept număr („150 lei”,
    //    „12 octombrie 2026”) intră ca număr ÎNAINTE ca foaia să-l fi rescris (judecătorul lecției 7, G1: C2 arăta #VALUE!)
    const T=window.ExcelTipuri;
    const g=typeof get==='function'?(a=>{const v=get(a);if(typeof v!=='string'||v==='')return v;
      if(v[0]==="'")return v.slice(1);
      if(T){try{const p=T.citeste(v);if(p&&p.tip==='num'&&typeof p.v==='number')return p.v}catch(e){}}
      return v}):get;
    return orig.call(this,formula,g);
  };
  J._formuleL07=true;
}

/* după fiecare desen al foii (ce face Excel la Enter, pe care foaia din motor nu-l face):
   - × și ÷ din formulă devin * și /;
   - un text care începe cu + sau - și e o formulă bună devine formulă (+A2*B2 -> =+A2*B2, probat de judecător: 600);
   - celula cu cod de eroare primește triunghiul verde (Range.Errors(xlEvaluateToError) = True în Excel, probat). */
const ERORI=/^#(VALUE!|DIV\/0!|NAME\?|SPILL!|REF!|N\/A|NUM!|NULL!)$/;
function dupaDesen(S,w){
  const gata=(()=>{const st=w.querySelector('.st span');return !st||/^Gata/.test(st.textContent)})();
  if(gata){let schimbat=false;
    for(const [a,raw] of Object.entries(S.RAW)){if(typeof raw!=='string'||!raw)continue;
      if(raw[0]==='='&&/[×÷]/.test(raw)){S.RAW[a]=mari(semne(raw));schimbat=true;continue}
      if((raw[0]==='+'||raw[0]==='-')&&raw.length>1){let e=false;
        try{const p=window.ExcelTipuri&&window.ExcelTipuri.citeste(raw);if(p&&p.tip==='num')continue}catch(x){}
        try{J.evaluate('='+raw,()=>0)}catch(x){e=x&&x.show==='⚠'}
        if(!e){S.RAW[a]=mari(semne('='+raw));schimbat=true}}}
    if(schimbat){S.draw();return}}
  w.querySelectorAll('.gw td[data-a]').forEach(td=>{const raw=S.RAW[td.dataset.a];
    if(typeof raw==='string'&&raw[0]==='='&&ERORI.test(td.textContent.trim())){td.classList.add('xtri');td.title='Eroare în formulă'}})}

/* valoarea unei celule dintr-o foaie dată ca {A1:'…'} (numere cu virgulă, formule) — pentru teste și mini-foi */
function valCu(src){const memo={},stiva=new Set();
  const get=a=>{if(a in memo)return memo[a];let r=src[a],v;
    if(r==null||r==='')v='';else if(typeof r==='number')v=r;else{r=String(r);
      if(r[0]==='='){if(stiva.has(a))throw FE('Formula trimite la ea însăși.','0');stiva.add(a);try{v=J.evaluate(r,get)}finally{stiva.delete(a)}}
      else if(/^\s*-?\d+(,\d+)?\s*$/.test(r))v=Number(r.trim().replace(',','.'));
      else v=r}
    memo[a]=v;return v};return get}
const fmt=v=>{if(typeof v!=='number')return String(v);const s=Number.isInteger(v)?String(v):String(Math.round(v*1e10)/1e10);return s.replace('.',',')};
/* ce se vede în celulă: rezultatul formulei (cu virgulă zecimală) sau codul de eroare */
function afisare(src,a){try{const v=valCu(src)(a);return {afisat:fmt(v),dreapta:typeof v==='number',eroare:false}}
  catch(e){return {afisat:e.show&&e.show!=='⚠'?e.show:'#VALUE!',dreapta:false,eroare:true}}}

/* testele numite ale atelierului, pe comportament */
function eFormulaBuna(RAW,Q,a,f){const raw=RAW[a];
  if(raw==null||!String(raw).startsWith('=')||!/[A-Za-z]{1,3}\$?\d+/.test(raw))return false;
  const la=(x,y)=>typeof x==='number'&&typeof y==='number'?Math.abs(x-y)<1e-6:false;
  try{if(!la(valCu(RAW)(a),valCu({...RAW,[a]:f})(a)))return false}catch(e){return false}
  const V={};Object.entries(Q.cells||{}).forEach(([k,v],i)=>{if(typeof v==='number')V[k]=String(v+(i%3+1)*3).replace('.',',')});
  if(!Object.keys(V).length)return true;
  try{const D={...RAW,...V};return la(valCu(D)(a),valCu({...D,[a]:f})(a))}catch(e){return false}}
function teste(body,Q,S,w){const box=document.createElement('div');box.className='xp-teste';box.setAttribute('aria-live','polite');body.insertBefore(box,w);
  const f=()=>{const xl=w.querySelector('.xl');if(!xl)return;const val={};xl.querySelectorAll('.gw td[data-a]').forEach(t=>val[t.dataset.a]=t.textContent.trim());
    const eq=(x,y)=>String(x??'').trim().toLowerCase()===String(y).trim().toLowerCase();
    const rez=Q.teste.map(T=>({ce:T.ce,ok:Object.entries(T.formule||{}).every(([a,fx])=>eFormulaBuna(S.RAW,Q,a,fx))
      &&Object.entries(T.valori||{}).every(([a,v])=>eq(val[a],v))&&(!T.tip||(window.ExcelTipuri&&window.ExcelTipuri.testeOk(body,T.tip)))}));
    const n=rez.filter(x=>x.ok).length;
    box.innerHTML=`<div class="lbl">Testele atelierului: ${n} din ${rez.length} gata</div><ul>${rez.map(x=>`<li class="${x.ok?'ok':''}"><span aria-hidden="true">${x.ok?'✔':'○'}</span>${x.ce}<span class="xp-sr">${x.ok?' (gata)':' (încă nu)'}</span></li>`).join('')}</ul>`};
  f();new MutationObserver(f).observe(w,{childList:true,subtree:true,characterData:true})}

/* telefonul îngust (jocuri/README.md §9: grila trebuie să încapă la 320 px): coloane mai înguste și, sub 360 px, literă
   mai mică în foaie, ca a patra coloană (unde scrie elevul formula) să nu iasă din ecran. Probat: _proba/proba_latime.py.
   Pe ecranele tactile: celule de 36 px înălțime, ↶ ↷ de 40 × 40 px, „Copiază tabelul” de 40 px (judecătorul lecției 7, m5). */
const CSS_F=`@media (max-width:420px){#body .xl td{min-width:3.3em}}
@media (max-width:360px){#body .xl .gw{font-size:13.5px}#body .xl td{min-width:3em;max-width:5.4em;padding:0 3px}#body .xl .nb{width:3.6em}}
@media (max-width:340px){#body .xl .gw{font-size:12.5px}#body .xl td{min-width:2.6em;padding:0 2px}}
@media (pointer:coarse){#body .xl td,#body .xl tbody th{height:36px}#body .xl [data-ud]{min-width:40px;min-height:40px}#body .xl [data-copiaza]{min-height:40px}}`;
function css(){if(!document.getElementById('xf-css')){const s=document.createElement('style');s.id='xf-css';s.textContent=CSS_F;document.head.appendChild(s)}}

const X=window.ExcelX;
const ExcelF={
  render(Q,body,api){
    css();
    if(!X||!window.JocExcel){body.innerHTML='<p class="toast">Foaia Excel nu s-a încărcat. Reîncarcă pagina.</p>';return}
    const areF=Array.isArray(Q.teste)&&Q.teste.some(T=>T.formule);
    const q2=areF?Object.assign({},Q,{teste:undefined}):Q;
    X.render(q2,body,api);
    const S=window.JocExcel.render._stare;const w=body.querySelector('#xwrap');
    if(w&&S){dupaDesen(S,w);new MutationObserver(()=>dupaDesen(S,w)).observe(w,{childList:true})}
    if(areF&&w&&S)teste(body,Q,S,w)},
  rezolva(Q,body,api){return X.rezolva(Q,body,api)},
  gresit(Q,body,api){return X.gresit(Q,body,api)}
};
window.ExcelF=ExcelF;
window.ExcelFormule={valoare:(src,a)=>valCu(src)(a),afisare,esc};
})();
