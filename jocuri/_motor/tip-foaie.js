/* Tipul de întrebare „foaie”: foaie de calcul simulată, cu formule adevărate.
   Folosire în configurație:  tipuri: { foaie: JocFoaie }
   Întrebare: {t:'foaie', q, cells:{A1:'Produs',B2:3,...}, cols, rows, targets:{D2:'=B2*C2',...}, variants:[{B2:4}], why}
   Verificare: rezultatul formulei elevului = rezultatul formulei de referință, pe datele date ȘI pe date schimbate
   (o variantă automată + variants), ca să prindă numerele scrise de mână și comparațiile greșite. */
(function(){
'use strict';
const RO_NAMES={SUMA:'SUM',MEDIE:'AVERAGE',MEDIA:'AVERAGE',DACA:'IF','DACĂ':'IF',MAXIM:'MAX',MINIM:'MIN',ROTUNJIRE:'ROUND',NUMARA:'COUNT','NUMĂRĂ':'COUNT'};
/* copierea formulei (tragerea în jos / la dreapta): referințele fără $ se mută cu dr rânduri și dc coloane, cele cu $ rămân.
   Q.umple = {D2:['D3','D4']} : elevul scrie în D2, jocul „trage” formula în D3, D4, exact ca Excel. */
function shift(f,dr,dc){
  if(typeof f!=='string'||!f.startsWith('='))return f;
  return f.replace(/("[^"]*")|(\$?)([A-Za-z]{1,2})(\$?)(\d+)(?![A-Za-z(])/g,(all,str,d1,col,d2,row,off,s)=>{
    if(str)return str;
    if(/[A-Za-z]/.test(s[off-1]||''))return all;   // parte dintr-un nume de funcție (ex. LOG10)
    const C=col.toUpperCase();let ci=C.split('').reduce((a,ch)=>a*26+ch.charCodeAt(0)-64,0);
    if(!d1)ci+=dc;const r=d2?Number(row):Number(row)+dr;
    if(ci<1||r<1)return '#REF!';
    let name='';for(let n=ci;n>0;n=Math.floor((n-1)/26))name=String.fromCharCode(65+(n-1)%26)+name;
    return d1+name+d2+r;
  });
}
const pos=a=>{const m=a.match(/^([A-Z]+)(\d+)$/);return{c:m[1].split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0),r:Number(m[2])}};
/* show = ce apare în celulă. Numele erorilor sunt cele din Excel-ul adevărat (#VALUE!, #NAME?, #DIV/0!), verificate
   cu oracolul (_cercetare/oracol_excel, 25.09.2026). O formulă scrisă greșit Excel n-o primește deloc (fereastra
   „There's a problem with this formula”): la noi celula arată „⚠” și mesajul spune ce e greșit. */
function FErr(msg,show){const e=new Error(msg);e.show=show||'⚠';return e}
function tokenize(src){
  const t=[];let i=0;
  // setări românești: separatorul e „;”, iar zecimalele se scriu cu virgulă (0,21). Doar atunci virgula dintre cifre e zecimală,
  // altfel ar strica =IF(B2>5,10,20) scris pe setări englezești (semnalat de evaluatorul antrenamentului Excel, 15.09.2026)
  const romanesc=src.includes(';');
  const stack=[];   // 'fn' = paranteza unei funcții (acolo virgula poate fi separator), 'p' = paranteză simplă
  while(i<src.length){
    const c=src[i],rest=src.slice(i);let m;
    if(/\s/.test(c)){i++;continue}
    if(c==='"'||c==='„'||c==='”'){const close=src.slice(i+1).search(/["”“]/);if(close<0)throw FErr('Lipsește ghilimeaua de închidere.');t.push({k:'str',v:src.slice(i+1,i+1+close)});i+=close+2;continue}
    const zecimalaVirgula=romanesc||!stack.includes('fn');   // în afara funcțiilor, 0,21 nu poate fi separator
    if((m=rest.match(zecimalaVirgula?/^\d+([.,]\d+)?/:/^\d+(\.\d+)?/))){t.push({k:'num',v:parseFloat(m[0].replace(',','.'))});i+=m[0].length;continue}
    // referință absolută/mixtă ($B$7, B$7, $B7): valoarea e aceeași celulă; `$` contează doar la copierea formulei (vezi shift)
    if((m=rest.match(/^\$?[A-Za-z]{1,2}\$?\d+/))&&!/^[A-Za-z]{3,}/.test(rest)){t.push({k:'ref',v:m[0].replace(/\$/g,'').toUpperCase(),abs:m[0].includes('$')});i+=m[0].length;continue}
    if((m=rest.match(/^([A-Za-zĂÂÎȘȚăâîșț]+)(\d+)?/))){if(m[2])t.push({k:'ref',v:(m[1]+m[2]).toUpperCase()});else t.push({k:'name',v:m[1].toUpperCase()});i+=m[0].length;continue}
    if((m=rest.match(/^(<=|>=|<>|[-+*\/=<>(),;:%^&])/))){
      if(m[0]==='(')stack.push(t.length&&t[t.length-1].k==='name'?'fn':'p');
      if(m[0]===')')stack.pop();
      t.push({k:'op',v:m[0]});i+=m[0].length;continue}
    throw FErr(`Excel nu înțelege semnul „${c}”.`);
  }
  return t;
}
function expand(a,b){if(!/^[A-Z]\d+$/.test(a)||!/^[A-Z]\d+$/.test(b))throw FErr('Zona e prea mare pentru joc.');return JocMotor.expandRange(a,b)}
function evaluate(formula,get){
  if(typeof formula!=='string'||!formula.startsWith('='))throw FErr('Formula trebuie să înceapă cu =.');
  const T=tokenize(formula.slice(1));let p=0;
  if(!T.length)throw FErr('După = nu ai scris nimic.');
  const isOp=v=>T[p]&&T[p].k==='op'&&T[p].v===v;
  // un text care arată ca un număr („12”, rezultatul lui 1&2) intră în calcule ca număr, ca în Excel: =(1&2)+3 dă 15
  const num=v=>{if(typeof v==='number')return v;if(v===''||v==null)return 0;if(typeof v==='boolean')return v?1:0;
    if(typeof v==='string'&&/^\s*-?\d+([.,]\d+)?\s*$/.test(v))return Number(v.trim().replace(',','.'));
    throw FErr('Formula calculează cu un text ca și cum ar fi număr.','#VALUE!')};
  // textul unei valori, ca la & în Excel: TRUE/FALSE, numerele fără zerouri în plus, celula goală = nimic
  const txt=v=>typeof v==='boolean'?(v?'TRUE':'FALSE'):v==null?'':String(v);
  // Excel compară: numerele < textele < TRUE/FALSE; celula goală = 0 lângă un număr și "" lângă un text
  const rang=v=>typeof v==='number'?0:typeof v==='string'?1:2;
  function cmp(){const a=cat(),t=T[p];
    if(t&&t.k==='op'&&['=','<>','<','>','<=','>='].includes(t.v)){p++;const b=cat();let x=a==null?'':a,y=b==null?'':b;
      if(x===''&&typeof y==='number')x=0;if(y===''&&typeof x==='number')y=0;
      if(x===''&&typeof y==='boolean')x=false;if(y===''&&typeof x==='boolean')y=false;
      if(rang(x)!==rang(y)){x=rang(x);y=rang(y)}
      else if(typeof x==='string'){x=x.toLowerCase();y=y.toLowerCase()}
      return {'=':x===y,'<>':x!==y,'<':x<y,'>':x>y,'<=':x<=y,'>=':x>=y}[t.v]}
    return a}
  function cat(){let a=add();while(isOp('&')){p++;const b=add();a=txt(a)+txt(b)}return a}   // „Ana”&” ”&B2
  function add(){let a=mul();while(isOp('+')||isOp('-')){const o=T[p++].v,b=mul();a=o==='+'?num(a)+num(b):num(a)-num(b)}return a}
  function mul(){let a=pw();while(isOp('*')||isOp('/')){const o=T[p++].v,b=pw();if(o==='/'){if(num(b)===0)throw FErr('Împărțire la zero.','#DIV/0!');a=num(a)/num(b)}else a=num(a)*num(b)}return a}
  // puterea: 2^3 = 8. Ca în Excel, minusul din față se aplică ÎNAINTE: -2^2 = 4
  function pw(){let a=un();while(isOp('^')){p++;const b=un();a=Math.pow(num(a),num(b))}return a}
  function un(){if(isOp('-')){p++;return -num(un())}if(isOp('+')){p++;return num(un())}let v=prim();while(isOp('%')){p++;v=num(v)/100}return v}  // 21% = 0,21, ca în Excel
  function prim(){const t=T[p];
    if(!t)throw FErr('Formula se termină prea devreme.');
    if(t.k==='num'||t.k==='str'){p++;return t.v}
    if(t.k==='ref'){p++;if(isOp(':')){p++;const b=T[p];if(!b||b.k!=='ref')throw FErr('După „:” trebuie adresa celuilalt colț.');p++;return{range:expand(t.v,b.v)}}return get(t.v)}
    if(t.k==='name'&&(t.v==='TRUE'||t.v==='FALSE')&&!(T[p+1]&&T[p+1].k==='op'&&T[p+1].v==='(')){p++;return t.v==='TRUE'}
    if(t.k==='name'){p++;if(!isOp('('))throw FErr(`„${t.v}” nu e o adresă de celulă și nici o funcție urmată de paranteză.`,'#NAME?');p++;const args=[];
      if(!isOp(')')){for(;;){args.push(cmp());if(isOp(';')||isOp(',')){p++;continue}break}}
      if(!isOp(')'))throw FErr('Lipsește paranteza de închidere.');p++;return call(t.v,args)}
    if(isOp('(')){p++;const v=cmp();if(!isOp(')'))throw FErr('Lipsește paranteza de închidere.');p++;return v}
    throw FErr(`Nu mă așteptam la „${t.v}” aici.`)}
  function nums(args){const out=[];args.forEach(a=>{if(a&&a.range)a.range.forEach(r=>{const v=get(r);if(typeof v==='number')out.push(v)});else out.push(num(a))});return out}
  const zona=(a,fn)=>{if(!a||!a.range)throw FErr(`${fn} are nevoie de o zonă de celule (ex. B2:B10), nu de o singură valoare.`);return a.range};
  // criteriul din COUNTIF/SUMIF/AVERAGEIF: ">=5", "<>admis", "admis", 5 (ca în Excel: textul fără diferență de litere mari/mici)
  function potriveste(v,crit){
    let op='=',val=crit;
    if(typeof crit==='string'){const m=crit.match(/^(<=|>=|<>|<|>|=)?(.*)$/);op=m[1]||'=';val=m[2];
      if(val!==''&&!isNaN(Number(val.replace(',','.'))))val=Number(val.replace(',','.'))}
    if(typeof val==='number'){if(typeof v!=='number')return op==='<>';return {'=':v===val,'<>':v!==val,'<':v<val,'>':v>val,'<=':v<=val,'>=':v>=val}[op]}
    const a=String(v??'').toLowerCase(),b=String(val).toLowerCase();
    if(/[*?]/.test(b)){   // „A*” = începe cu A, „?” = o literă oarecare
      const re=new RegExp('^'+b.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.')+'$');
      const ok=typeof v==='string'&&re.test(a);return op==='<>'?!ok:op==='='?ok:false}
    return op==='<>'?a!==b:op==='='?a===b:false;
  }
  const vals=args=>{const out=[];args.forEach(a=>{if(a&&a.range)a.range.forEach(r=>out.push(get(r)));else out.push(a)});return out};
  const logice=(args,fn)=>{const v=vals(args).filter(x=>typeof x==='number'||typeof x==='boolean');
    if(!v.length)throw FErr(`${fn} nu are nicio condiție de verificat.`,'#VALUE!');return v.map(x=>!!x)};
  const text1=(a,fn)=>{if(a&&a.range)throw FErr(`${fn} primește o singură celulă sau un text.`,'#VALUE!');return txt(a)};
  const cel_putin=(fn,n,args)=>{if(args.length<n)throw FErr(`${fn} are nevoie de ${n===1?'cel puțin o valoare':n+' părți'} între paranteze.`)};
  function call(name,args){
    if(name==='IF'&&args.some(a=>a&&a.range))throw FErr('IF nu primește o zonă, ci o comparație.');
    if(['SUM','AVERAGE','MIN','MAX','COUNT','COUNTA','AND','OR'].includes(name))cel_putin(name,1,args);
    switch(name){
      // funcțiile din programă care lipseau (găsite de oracolul Excel, 25.09.2026)
      case 'AND':return logice(args,'AND').every(x=>x);
      case 'OR':return logice(args,'OR').some(x=>x);
      case 'NOT':{cel_putin('NOT',1,args);const c=args[0];if(typeof c==='string'&&c!=='')throw FErr('NOT primește o condiție, nu un text.','#VALUE!');return !num(c)}
      case 'COUNTBLANK':{return zona(args[0],'COUNTBLANK').filter(r=>get(r)==='').length}
      case 'ROUNDUP':case 'ROUNDDOWN':{cel_putin(name,2,args);const x=num(args[0]),k=Math.pow(10,num(args[1])),a=Math.abs(x)*k;
        const r=name==='ROUNDUP'?Math.ceil(a-1e-9):Math.floor(a+1e-9);return Math.sign(x)*r/k}
      case 'INT':cel_putin('INT',1,args);return Math.floor(num(args[0]));
      case 'ABS':cel_putin('ABS',1,args);return Math.abs(num(args[0]));
      case 'SQRT':{cel_putin('SQRT',1,args);const x=num(args[0]);if(x<0)throw FErr('Rădăcina unui număr negativ nu există.','#NUM!');return Math.sqrt(x)}
      case 'POWER':cel_putin('POWER',2,args);return Math.pow(num(args[0]),num(args[1]));
      case 'MOD':{cel_putin('MOD',2,args);const a=num(args[0]),b=num(args[1]);if(b===0)throw FErr('Împărțire la zero.','#DIV/0!');return a-b*Math.floor(a/b)}
      case 'LEN':cel_putin('LEN',1,args);return text1(args[0],'LEN').length;
      case 'UPPER':cel_putin('UPPER',1,args);return text1(args[0],'UPPER').toUpperCase();
      case 'LOWER':cel_putin('LOWER',1,args);return text1(args[0],'LOWER').toLowerCase();
      case 'TRIM':cel_putin('TRIM',1,args);return text1(args[0],'TRIM').trim().replace(/ +/g,' ');
      case 'LEFT':cel_putin('LEFT',1,args);return text1(args[0],'LEFT').slice(0,args.length>1?num(args[1]):1);
      case 'RIGHT':{cel_putin('RIGHT',1,args);const s=text1(args[0],'RIGHT'),n=args.length>1?num(args[1]):1;return n?s.slice(-n):''}
      case 'MID':{cel_putin('MID',3,args);const s=text1(args[0],'MID');return s.substr(num(args[1])-1,num(args[2]))}
      case 'CONCATENATE':case 'CONCAT':cel_putin(name,1,args);return vals(args).map(txt).join('');
      case 'COUNT':{let n=0;args.forEach(a=>{if(a&&a.range)a.range.forEach(r=>{if(typeof get(r)==='number')n++});else if(typeof a==='number')n++});return n}
      case 'COUNTA':{let n=0;args.forEach(a=>{if(a&&a.range)a.range.forEach(r=>{if(get(r)!=='')n++});else n++});return n}
      case 'COUNTIF':{if(args.length!==2)throw FErr('COUNTIF are două părți: zona și criteriul, ex. =COUNTIF(C2:C9;">=5").');return zona(args[0],'COUNTIF').filter(r=>potriveste(get(r),args[1])).length}
      case 'SUMIF':case 'AVERAGEIF':{
        if(args.length<2||args.length>3)throw FErr(`${name} are zona de verificat, criteriul și (opțional) zona de adunat.`);
        const z=zona(args[0],name),s=args.length===3?zona(args[2],name):z;
        if(s.length!==z.length)throw FErr('Zona de adunat trebuie să aibă tot atâtea celule cât zona de verificat.');
        const vals=z.map((r,i)=>potriveste(get(r),args[1])?get(s[i]):null).filter(v=>typeof v==='number');
        if(name==='SUMIF')return vals.reduce((a,b)=>a+b,0);
        if(!vals.length)throw FErr('Nicio celulă nu îndeplinește criteriul, deci media nu se poate calcula.','#DIV/0!');
        return vals.reduce((a,b)=>a+b,0)/vals.length}
      case 'ROUND':{if(args.length!==2)throw FErr('ROUND are două părți: valoarea și numărul de zecimale, ex. =ROUND(D2;2).');const k=Math.pow(10,num(args[1]));return Math.round(num(args[0])*k+Math.sign(num(args[0]))*1e-9)/k}
      case 'SUM':return nums(args).reduce((s,x)=>s+x,0);
      case 'AVERAGE':{const n=nums(args);if(!n.length)throw FErr('Media unei zone fără numere nu se poate calcula.','#DIV/0!');return n.reduce((s,x)=>s+x,0)/n.length}
      case 'MAX':{const n=nums(args);return n.length?Math.max(...n):0}
      case 'MIN':{const n=nums(args);return n.length?Math.min(...n):0}
      case 'IF':{if(args.length<2)throw FErr('IF are nevoie de condiție și de cel puțin un rezultat.');const c=args[0];if(typeof c==='string'&&c!=='')throw FErr('Condiția din IF e un text, nu o comparație (ex. B2>=5).','#VALUE!');const yes=!!num(c);return yes?args[1]:(args.length>2?args[2]:false)}
    }
    const ro=RO_NAMES[name];
    throw FErr(`Excel nu cunoaște funcția ${name}.${ro?` Numele funcțiilor sunt în engleză: ${ro}.`:''}`,'#NAME?');
  }
  const v=cmp();
  if(p<T.length){if(T[p].k==='op'&&(T[p].v===';'||T[p].v===','))throw FErr('Semnul „;” sau „,” se folosește doar în interiorul unei funcții.');throw FErr(`Nu mă așteptam la „${T[p].v}” aici.`)}
  if(v&&v.range)throw FErr('O zonă singură nu e un rezultat. Pune-o într-o funcție, de exemplu SUM(…).','#VALUE!');
  return v;
}
// valorile mici (0,002) își păstrează cifrele semnificative; altfel ar apărea „0” deși formula e bună
const fmt=v=>typeof v==='number'?(Number.isInteger(v)?String(v):v.toLocaleString('ro-RO',Math.abs(v)<1?{maximumSignificantDigits:3}:{maximumFractionDigits:2})):typeof v==='boolean'?(v?'TRUE':'FALSE'):String(v??'');
// textul rezultat se compară fără diacritice și fără spații în plus: „in buget” = „în buget” (tastatura din laborator poate fi fără diacritice)
const fara=s=>String(s).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[şș]/g,'s').replace(/[ţț]/g,'t').replace(/\s+/g,' ');
const same=(a,b)=>typeof a==='number'&&typeof b==='number'?Math.abs(a-b)<1e-6:fara(a)===fara(b);
const CSS=`.fxrow{display:flex;align-items:stretch;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:var(--paper);font-family:var(--fm);margin-bottom:8px}
.fxrow .nb{padding:8px 10px;background:var(--paper2);border-right:1px solid var(--line);min-width:3.4em;text-align:center;font-weight:600}
.fxrow .fx{padding:8px;color:var(--ink2);font-style:italic;border-right:1px solid var(--line)}
.fxrow input{flex:1;min-width:0;border:0;background:transparent;padding:8px 10px;font-family:var(--fm);font-size:1rem}
.fxrow button{border:0;border-left:1px solid var(--line);background:var(--accent);color:var(--accentInk);padding:0 14px;font-weight:700}
.g td .num{text-align:right;font-variant-numeric:tabular-nums;display:block}
.g td .hdr{font-weight:600}
.g td.tgt>button{box-shadow:inset 0 0 0 1.5px var(--accent);background:repeating-linear-gradient(135deg,transparent 0 6px,color-mix(in srgb,var(--accent) 9%,transparent) 6px 12px)}
.g td.tgt.filled>button{background:var(--paper)}
.g td.tgt.act>button{box-shadow:inset 0 0 0 3px var(--accent);background:var(--sel)}
.g td.err>button,.g td.err>div{color:var(--bad)}
.g td.copie>div{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--accent) 45%,transparent);font-style:italic}`;

let F={},act=null,Qc=null;
function getter(formulas,data){
  const memo={},stack=new Set();
  const get=addr=>{
    if(addr in memo)return memo[addr];
    if(addr in formulas){const f=formulas[addr];if(f==='')return '';
      if(stack.has(addr))throw FErr('Formula trimite la ea însăși (referință circulară). Excel arată 0 și un avertisment.','0');
      stack.add(addr);try{const v=f.startsWith('=')?evaluate(f,get):f;memo[addr]=v;return v}finally{stack.delete(addr)}}
    return addr in data?data[addr]:'';
  };
  return get;
}
function render(Q,body,api){
  if(!document.getElementById('tip-foaie-css')){const s=document.createElement('style');s.id='tip-foaie-css';s.textContent=CSS;document.head.appendChild(s)}
  Qc=Q;F={};Object.keys(Q.targets).forEach(k=>F[k]='');act=Object.keys(Q.targets)[0];
  const L=i=>String.fromCharCode(65+i),esc=api.esc;
  const copii={};Object.entries(Q.umple||{}).forEach(([src,dests])=>dests.forEach(d=>copii[d]=src));
  // formulele „trase”: fiecare celulă copiată primește formula sursei, mutată cu distanța dintre ele
  const efectiv=src=>{const E={...src};Object.entries(copii).forEach(([d,s])=>{const a=pos(s),b=pos(d);E[d]=src[s]===''||src[s]==null?'':shift(src[s],b.r-a.r,b.c-a.c)});return E};
  function shown(addr){
    const E=efectiv(F);
    if(!(addr in E))return{txt:fmt(Q.cells[addr]??''),num:typeof Q.cells[addr]==='number'};
    const f=E[addr];if(f==='')return{txt:'',num:false};if(!f.startsWith('='))return{txt:f,num:false};
    try{const v=getter(E,Q.cells)(addr);return{txt:fmt(v),num:typeof v==='number'}}catch(e){return{txt:e.show,num:false,err:true}}
  }
  function draw(){
    let h=`<div class="fxrow"><span class="nb">${act}</span><span class="fx">fx</span>
      <input id="fxin" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Bara de formule" value="${esc(F[act]??'')}" placeholder="scrie formula, de ex. =B2*C2">
      <button type="button" id="put" aria-label="Pune formula în celulă">↵</button></div>
      <div class="gridwrap"><table class="g"><thead><tr><th></th>`;
    for(let c=0;c<Q.cols;c++)h+=`<th>${L(c)}</th>`;
    h+='</tr></thead><tbody>';
    for(let r=1;r<=Q.rows;r++){h+=`<tr><th>${r}</th>`;
      for(let c=0;c<Q.cols;c++){const ad=L(c)+r,tg=ad in F,s=shown(ad),cp=ad in copii;
        const cls=[tg?'tgt':'',tg&&F[ad]!==''?'filled':'',ad===act?'act':'',s.err?'err':'',cp?'copie':''].join(' ');
        const inner=`<span class="${s.num?'num':''} ${r===1?'hdr':''}">${esc(s.txt)}</span>`;
        h+=tg?`<td class="${cls}"><button type="button" data-a="${ad}" aria-label="Celula ${ad} de completat">${inner}</button></td>`:`<td class="${cls}"><div data-a="${ad}">${inner}</div></td>`}
      h+='</tr>'}
    body.innerHTML=h+`</tbody></table></div><div class="toast" id="toast" aria-live="polite"></div>
      <p class="hint" style="margin:0">Celulele cu chenar sunt ale tale. Funcțiile se scriu în engleză. Între părțile lui IF merge și <code>;</code>, și <code>,</code>.</p>`;
    body.querySelectorAll('.g td>button').forEach(x=>x.onclick=()=>{if(api.done())return;commit(false);act=x.dataset.a;draw();body.querySelector('#fxin').focus()});
    body.querySelectorAll('.g td>div').forEach(x=>x.onclick=()=>{const a=x.dataset.a,t=body.querySelector('#toast');
      if(a in copii){const E=efectiv(F);t.textContent=E[a]?`${a} are formula trasă din ${copii[a]}: ${E[a]}`:`În ${a} ajunge formula din ${copii[a]} când o scrii acolo (ca la tragerea în jos).`}
      else t.textContent=`${a} are datele tabelului. Tu scrii doar în celulele cu chenar.`});
    body.querySelector('#fxin').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();commit(true)}});
    body.querySelector('#put').onclick=()=>commit(true);
  }
  function commit(advance){
    const inp=body.querySelector('#fxin');if(!inp||api.done())return;
    F[act]=inp.value.trim();
    if(!advance)return;
    const keys=Object.keys(F),i=keys.indexOf(act),nxt=keys.slice(i+1).concat(keys.slice(0,i)).find(k=>F[k]==='');
    const s=shown(act);draw();const t=body.querySelector('#toast');
    if(F[act]!==''&&!F[act].startsWith('='))t.textContent=`În ${act} ai scris text, nu formulă: formula începe cu =.`;
    else if(s.err){try{getter(F,Q.cells)(act)}catch(e){t.textContent=`${act}: ${e.message}`}}
    else if(nxt){act=nxt;draw();body.querySelector('#fxin').focus()}
  }
  function problems(){
    const out=[],variants=(Q.variants||[]).slice(),auto={};
    Object.entries(Q.cells).forEach(([k,v],i)=>{if(typeof v==='number')auto[k]=v+(i%3+1)*3});variants.push(auto);
    for(const ad of Object.keys(F)){
      const f=F[ad];
      if(f===''){out.push(`${ad} e goală.`);continue}
      if(!f.startsWith('=')){out.push(`În ${ad} ai scris text, nu formulă: formula începe cu =.`);continue}
      let toks;try{toks=tokenize(f.slice(1))}catch(e){out.push(`${ad}: ${e.message}`);continue}
      if(!toks.some(t=>t.k==='ref')){out.push(`${ad} are doar numere scrise de mână. Folosește adresele celulelor, ca rezultatul să se recalculeze.`);continue}
      const E=efectiv(F),T=efectiv(Q.targets);
      let got;try{got=getter(E,Q.cells)(ad)}catch(e){out.push(`${ad}: ${e.message}`);continue}
      const exp=getter(T,Q.cells)(ad);
      if(!same(got,exp)){out.push(`${ad} dă ${fmt(got)||'nimic'}, dar ar trebui să dea ${fmt(exp)}.`);continue}
      // celulele în care formula e trasă: aici se vede lipsa lui $ (D2 e bun, D3 mută și referința care trebuia să stea pe loc)
      const rele=Object.keys(copii).filter(d=>copii[d]===ad).filter(d=>{let g;try{g=getter(E,Q.cells)(d)}catch(e){g='#'}return !same(g,getter(T,Q.cells)(d))});
      if(rele.length){out.push(`${ad} e bună, dar trasă în jos greșește în ${rele.join(', ')} (acolo devine ${E[rele[0]]}). O referință care trebuie să rămână pe loc la copiere are nevoie de $.`);continue}
      for(const v of variants){const data={...Q.cells,...v};let g2;try{g2=getter(E,data)(ad)}catch(e){g2='#'}
        if(!same(g2,getter(T,data)(ad))){out.push(`${ad} dă rezultatul bun acum, dar greșește când se schimbă datele din tabel. Verifică adresele și comparația.`);break}}
    }
    return out;
  }
  draw();
  const nav=api.checkButton(()=>{
    commit(false);const pr=problems();draw();
    if(!pr.length){nav.innerHTML='';api.resolve(true)}
    else{api.resolve(false,pr.slice(0,2).join(' ')+(pr.length>2?` (încă ${pr.length-2})`:''));
      api.revealButton(()=>{Object.assign(F,Q.targets);draw();nav.innerHTML='';api.giveUp('formulele corecte sunt acum în celule. Apasă pe ele și citește-le în bara fx.')})}
  });
}
function rezolva(Q,body){
  for(const [ad,f] of Object.entries(Q.targets)){body.querySelector(`.g td>button[data-a="${ad}"]`).click();const inp=body.querySelector('#fxin');inp.value=f;inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))}
}
/* greșeala tipică: rezultatul scris de mână în loc de formulă cu adrese (trebuie respinsă) */
function gresit(Q,body){
  for(const ad of Object.keys(Q.targets)){body.querySelector(`.g td>button[data-a="${ad}"]`).click();const inp=body.querySelector('#fxin');inp.value='=1';inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))}
}
window.JocFoaie={render,rezolva,gresit,evaluate,shift};
})();
