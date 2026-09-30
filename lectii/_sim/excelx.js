/* lectii/_sim/excelx.js — foaia „excelx” a lecțiilor de Excel (clasa a VIII-a), SIMULATOR COMUN.
   PROPRIETAR: autorul lecției VIII / M1 / nr. 5 (05_STANDARD_LECTIE.md, „Simulatoarele din lecțiile nr. 4”).
   ISTORIC: 27.09.2026 — copiat din lectii/viii/m1-l04/index.html (tipul ExcelPlus, după _verificare/reparatii.md), cu
   scriptul lectii/viii/m1-l05/_proba/fa_excelx.py, + stratul „tipuri de date pe setări românești” al lecției 5.
   Lecția 4 rămâne deocamdată cu copia ei. De aici încolo se editează direct acest fișier.
   ÎNCĂRCARE (după motor): <script src="../../../jocuri/_motor/motor.js"></script>
     <script src="../../../jocuri/_motor/tip-foaie.js"></script><script src="../../../jocuri/_motor/tip-excel.js"></script>
     <script src="../../_sim/excelx.js"></script>   apoi în configurație: tipuri:{excelx:ExcelX}
   CÂMPURI pe întrebare (pe lângă cele ale foii din motor): teste:[{ce, valori, gol, fara, tip}], doarMouse, variante,
     verifica.tip:{B2:{numar:7.5},C2:{text:'007'},D2:{data:'05.10.2026'}}, gresitLipit:['B2'], arataSetari,
     inainte:[['B2','8.5'],['B2','DEL'],['B2','8,5']] (pași făcuți cu gesturile foii înainte de exercițiu, anulabili).
   Global: window.ExcelX (tipul), window.ExcelTipuri (parserul: citeste, afisare — pentru mini-foile „Uite cum”). */
(function(){
'use strict';
/* ============================================================================================
   STRATUL „TIPURI DE DATE” pe setări românești (lecția VIII/5, 27.09.2026), peste foaia „excel” din motor
   (_motor/tip-excel.js, NESCHIMBATĂ). Regulile vin din Excel-ul REAL, nu din memorie: lectii/viii/m1-l05/_proba/
   (proba_excel*.json: FormulaLocal pe o instanță nouă, invizibilă; proba_tastare.json: tastare adevărată pe un desktop
   ascuns; proba_parser.py compară 172 de cazuri: 0 nepotriviri). Ce adaugă (regula fidelității, jocuri/README.md §1):
   - citeste(): ce face Excel cu textul tastat: 7,5 număr; 7.5 -> data 07.mai; 6.75 -> iun.75; 1.250 -> 1250;
     12 lei -> număr cu „lei”; 10% -> 0,1; 27.09.2026 / 27/09/2026 / 2026-09-27 / 12 octombrie 2026 -> dată;
     12:30 -> oră; '007 -> text „007” cu triunghi verde; 12 elevi, 7B, 12,10,2026 -> text;
   - FORMA pusă automat rămâne în celulă (FMT[a].ax, salvată de Anulare odată cu restul foii): 7,5 scris peste
     07.mai apare 07.ian; Delete golește doar conținutul; Ctrl+Z scoate și forma; Golire totală (Clear All) o scoate;
   - bara de formule după Enter arată ce arată Excel: 07.05.2026 pentru 7.5, 9,5 pentru 9,50, '007, 12 pentru 12 lei;
   - verificarea pe TIP: verifica.tip = {B2:{numar:7.5}, C2:{text:'007'}, D2:{data:'05.10.2026'}}; în teste:[{ce, tip}];
     gresitLipit:['B2'] = răspunsul greșit al porții e „7,5 scris peste o dată” (forma rămasă);
   - butoanele RO/EN ale foii se ascund (doar setările românești sunt probate pe Excel real); arataSetari:true le lasă.
   NEPROBAT (spus în lectii/viii/m1-l05/surse.md): intrarea automată a procentelor la tastare într-o celulă cu %,
   bara de formule pentru ore, procente și mii; setările englezești.
   ============================================================================================ */
const Tipuri=(function(){
'use strict';
const LUNI=['ian','feb','mar','apr','mai','iun','iul','aug','sept','oct','nov','dec'];
const LUNG=['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'];
const MS=864e5,p2=n=>String(n).padStart(2,'0');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const anCurent=()=>new Date().getFullYear();
const valid=(y,m,d)=>{if(!(y>=1900&&y<=9999&&m>=1&&m<=12&&d>=1&&d<=31))return false;const o=new Date(Date.UTC(y,m-1,d));return o.getUTCFullYear()===y&&o.getUTCMonth()===m-1&&o.getUTCDate()===d};
/* numărul zilei, ca în Excel: 1 = 01.01.1900; Excel socotește și ziua 29.02.1900 (care n-a existat), deci după 1 martie 1900 se adaugă 1 */
const serial=(y,m,d)=>{const t=Date.UTC(y,m-1,d),s=Math.round((t-Date.UTC(1899,11,31))/MS);return t<Date.UTC(1900,2,1)?s:s+1};
function dinSerial(v){const z=Math.floor(v+1e-9);let y,m,d;
  if(z===60){y=1900;m=2;d=29}else{const o=new Date((z<60?Date.UTC(1899,11,31):Date.UTC(1899,11,30))+z*MS);y=o.getUTCFullYear();m=o.getUTCMonth()+1;d=o.getUTCDate()}
  let s=Math.round((v-z)*86400);if(s>=86400)s=86399;return {y,m,d,h:Math.floor(s/3600),mi:Math.floor(s%3600/60),s:s%60}}
const an2=y=>y<30?2000+y:1900+y;   // anul din două cifre: 00-29 -> 20xx, 30-99 -> 19xx (2.30 -> feb.1930, probat)
const lunaDin=t=>{t=t.toLowerCase();let i=LUNI.indexOf(t);if(i<0)i=LUNG.indexOf(t);return i<0?0:i+1};
const FDATA=['dd.mm.yyyy','dd.mm.yyyy hh:mm','dd.mmm','mmm.yy','dd.mmm.yy'],FORA=['hh:mm','hh:mm:ss'],FPROC=['0%','0,00%'];
/* un număr scris cu virgulă zecimală, fără separator de mii: 12 · -4 · 7,5 · ,5 · 5, · +5 · - 7,5 · 007 */
function numarSimplu(s){const m=String(s).match(/^([+-]?)\s*(\d*)(?:,(\d*))?$/);if(!m||!(m[2]||m[3]))return null;
  const v=Number((m[2]||'0')+'.'+(m[3]||'0'));return m[1]==='-'?-v:v}
const miiDin=s=>{const k=s.match(/^([+-]?)(\d+(?:\.\d{3,})+)(?:,(\d*))?$/);if(!k)return null;let v=Number(k[2].replace(/\./g,'')+'.'+(k[3]||'0'));return {v:k[1]==='-'?-v:v,zec:k[3]!=null&&k[3]!==''}};
const N=(v,fmt)=>({tip:'num',v,fmt}),T=raw=>({tip:'text',v:raw});
/* CE FACE EXCEL (setări românești, Office în engleză) cu textul tastat într-o celulă cu formatul General */
function citeste(raw){
  if(raw==null)return {tip:'gol'};
  raw=String(raw);if(raw==='')return {tip:'gol'};
  if(raw[0]==="'"){const r=raw.slice(1);return {tip:'text',v:r,apostrof:true,tri:numarSimplu(r.trim())!==null}}
  if(raw[0]==='=')return {tip:'formula'};
  const s=raw.trim();if(!s)return T(raw);
  let m,v;
  if((v=numarSimplu(s))!==null)return N(v,'General');
  if((m=s.match(/^\(\s*(\d+(?:,\d*)?)\s*\)$/)))return N(-numarSimplu(m[1]),'General');
  if(/^(true|false)$/i.test(s))return {tip:'bool',v:/^true$/i.test(s)};
  // data cu an (27.09.2026 · 27/09/2026 · 27-09-2026 · 27. 09. 2026 · 1.2.3), opțional cu ora
  if((m=s.match(/^(\d{1,2})([.\/-])\s*(\d{1,2})\2\s*(\d{1,2}|\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/))){
    const d=+m[1],l=+m[3],y=m[4].length===4?+m[4]:an2(+m[4]);if(!valid(y,l,d))return T(raw);
    const t=serial(y,l,d);if(m[5]==null)return N(t,'dd.mm.yyyy');
    const h=+m[5],mi=+m[6],se=+(m[7]||0);if(h>23||mi>59||se>59)return T(raw);return N(t+(h*3600+mi*60+se)/86400,'dd.mm.yyyy hh:mm')}
  if((m=s.match(/^(\d{4})([.\/-])(\d{1,2})\2(\d{1,2})$/))){const y=+m[1],l=+m[3],d=+m[4];return valid(y,l,d)?N(serial(y,l,d),'dd.mm.yyyy'):T(raw)}
  // două părți: zi.lună din anul curent (7.5 -> 07.mai), altfel lună.an (6.75 -> iun.75), altfel text (13.13)
  if((m=s.match(/^(\d{1,2})([.\/-])(\d{1,2})$/))){const a=+m[1],b=+m[3],y=anCurent();
    if(valid(y,b,a))return N(serial(y,b,a),'dd.mmm');
    if(m[3].length===2&&a>=1&&a<=12)return N(serial(an2(b),a,1),'mmm.yy');
    return T(raw)}
  // punctul ca separator de mii: 1.250 -> 1250 (și 7.5555 -> 75555, ca Excel)
  if((v=miiDin(s)))return N(v.v,v.zec?'#.##0,00':'#.##0');
  if((m=s.match(/^(.*?)\s*%$/))&&(v=numarSimplu(m[1].trim()))!==null)return N(v/100,/,\d/.test(m[1])?'0,00%':'0%');
  if((m=s.match(/^(.+?)\s*lei$/))){const t=m[1].trim();let x=numarSimplu(t),f=null;
    if(x!==null)f=/,\d/.test(t)?'#.##0,00 lei':'#.##0 lei';else{const k=miiDin(t);if(k){x=k.v;f=k.zec?'#.##0,00 lei':'#.##0 lei'}}
    if(f)return N(x,f)}
  if((m=s.match(/^€\s*(.+)$/)||s.match(/^(.+?)\s*€$/))&&(v=numarSimplu(m[1].trim()))!==null)return N(v,'General');
  if((m=s.match(/^([+-]?\d+(?:,\d*)?)[eE]([+-]?\d{1,3})$/)))return N(numarSimplu(m[1])*Math.pow(10,+m[2]),'0,00E+00');
  if((m=s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/))){const h=+m[1],mi=+m[2],se=+(m[3]||0);if(h<24&&mi<60&&se<60)return N((h*3600+mi*60+se)/86400,m[3]!=null?'hh:mm:ss':'hh:mm')}
  if((m=s.match(/^(\d+)\s+(\d)\/(\d)$/))){const i=+m[1],n=+m[2],d=+m[3];if(d>0&&n<d)return N(i+n/d,'# ?/?')}
  if((m=s.match(/^(\d{1,2})\s+([a-zăâîșşțţ]+)\.?\s+(\d{2}|\d{4})$/i))){const l=lunaDin(m[2]),d=+m[1],y=m[3].length===4?+m[3]:an2(+m[3]);if(l&&valid(y,l,d))return N(serial(y,l,d),'dd.mmm.yy')}
  if((m=s.match(/^([a-zăâîșşțţ]+)\.?\s+(\d{2}|\d{4})$/i))){const l=lunaDin(m[1]),y=m[2].length===4?+m[2]:an2(+m[2]);if(l)return N(serial(y,l,1),'mmm.yy')}
  return T(raw);
}
/* afișarea unui număr într-o formă (format) dată, ca Excel pe setări românești */
const grup=t=>t.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
function fix(v,k,mii){const t=Math.abs(v).toFixed(k).split('.');const semn=v<0&&Number(Math.abs(v).toFixed(k))!==0?'-':'';return semn+(mii?grup(t[0]):t[0])+(k?','+t[1]:'')}
function general(v){if(!isFinite(v))return String(v);const a=Math.abs(v);
  if(a!==0&&(a>=1e11||a<1e-9)){const [mant,exp]=v.toExponential(5).split('e');return mant.replace(/\.?0+$/,'').replace('.',',')+'E'+(+exp<0?'-':'+')+p2(Math.abs(+exp))}
  return String(Number(v.toPrecision(10))).replace('.',',')}
function afis(v,f){
  if(FDATA.includes(f)||FORA.includes(f)){if(v<0)return '#####';const t=dinSerial(v),o=p2(t.h)+':'+p2(t.mi);
    return {'dd.mm.yyyy':`${p2(t.d)}.${p2(t.m)}.${t.y}`,'dd.mm.yyyy hh:mm':`${p2(t.d)}.${p2(t.m)}.${t.y} ${o}`,'dd.mmm':`${p2(t.d)}.${LUNI[t.m-1]}`,
      'mmm.yy':`${LUNI[t.m-1]}.${p2(t.y%100)}`,'dd.mmm.yy':`${p2(t.d)}.${LUNI[t.m-1]}.${p2(t.y%100)}`,'hh:mm':o,'hh:mm:ss':o+':'+p2(t.s)}[f]}
  if(f==='#.##0')return fix(v,0,true);if(f==='#.##0,00')return fix(v,2,true);
  if(f==='#.##0 lei')return fix(v,0,true)+' lei';if(f==='#.##0,00 lei')return fix(v,2,true)+' lei';
  if(f==='0%')return fix(v*100,0,false)+'%';if(f==='0,00%')return fix(v*100,2,false)+'%';
  if(f==='0,00E+00'){const [mant,exp]=v.toExponential(2).split('e');return mant.replace('.',',')+'E'+(+exp<0?'-':'+')+p2(Math.abs(+exp))}
  if(f==='# ?/?'){const i=Math.trunc(v),r=Math.abs(v-i);let best=[0,1,1];for(let d=1;d<=9;d++){const n=Math.round(r*d),e=Math.abs(r-n/d);if(e<best[2]-1e-12)best=[n,d,e]}
    return best[0]===0?String(i):(i===0?' ':i+' ')+best[0]+'/'+best[1]}
  return general(v)}
const rawNum=v=>String(Number(v.toPrecision(15))).replace('.',',');
/* ce arată bara de formule după Enter (probat pe tastare reală: 7.5 -> 07.05.2026; 7,5 peste o dată -> 07.01.1900  12:00:00;
   9,50 -> 9,5; 12 lei -> 12; '007 -> '007) */
function bara(v,f){
  if(FDATA.includes(f)||FORA.includes(f)){if(v<0)return rawNum(v);const t=dinSerial(v),data=`${p2(t.d)}.${p2(t.m)}.${t.y}`,ora=`${p2(t.h)}:${p2(t.mi)}:${p2(t.s)}`;
    if(FORA.includes(f)&&v<1)return ora;return (t.h||t.mi||t.s)?data+'  '+ora:data}
  if(FPROC.includes(f))return rawNum(v*100)+'%';
  return rawNum(v)}
/* ce vede elevul într-o celulă cu textul raw și forma ax (fără formă = General) */
function afisare(raw,ax){const p=citeste(raw);
  if(p.tip==='gol')return {tip:'gol',afisat:'',dreapta:false};
  if(p.tip==='formula')return {tip:'formula'};
  if(p.tip==='text')return {tip:'text',v:p.v,afisat:p.v,dreapta:false,tri:!!p.tri,apostrof:!!p.apostrof};
  if(p.tip==='bool')return {tip:'bool',v:p.v,afisat:p.v?'TRUE':'FALSE',centru:true};
  const f=ax||p.fmt;
  return {tip:FDATA.includes(f)?'data':FORA.includes(f)?'ora':'numar',v:p.v,fmt:f,afisat:afis(p.v,f),dreapta:true,rosu:/lei$/.test(f)&&p.v<0}}

/* ------------------ stratul peste foaia din motor (o stare pe fiecare #body) ------------------ */
const CTX=new WeakMap();
const eGata=body=>{const s=body.querySelector('#xwrap .st span');return !s||/^Gata/.test(s.textContent)};
const formaAleasa=F=>F&&(F.nf||F.dec!=null);   // forma aleasă din panglică (lecția 6): o desenează foaia din motor
function formaPusa(FMT,a){const f=FMT[a];return f&&!formaAleasa(f)?f.ax:undefined}
/* ce face Excel când confirmi (Enter) textul din celula a: forma se pune o singură dată, pe o celulă fără formă */
function confirma(ctx,a){const {RAW,FMT}=ctx,raw=RAW[a];const p=citeste(raw);if(p.tip!=='num'||formaAleasa(FMT[a]))return;
  let v=p.v,f=formaPusa(FMT,a);
  if(!f){if(p.fmt!=='General'){(FMT[a]=FMT[a]||{}).ax=p.fmt;FMT[a].axv=afis(p.v,p.fmt);f=p.fmt}else f='General'}   // axv = ce arăta celula când a primit forma (07.mai): semnul de oprire pentru Ctrl+Z
  else if(FPROC.includes(f)&&p.fmt==='General')v=v/100;       // intrarea automată a procentelor (NEPROBAT pe tastare)
  const nou=bara(v,f);if(nou!==raw){ctx.TASTAT[a]=raw;(ctx.IST[a]=ctx.IST[a]||{})[nou]=raw;RAW[a]=nou}}
function sync(ctx){if(!ctx||!ctx.S||ctx.S.mod()!=='ro')return;const {RAW,LAST}=ctx;
  for(const a of new Set([...Object.keys(RAW),...Object.keys(LAST)])){const r=RAW[a]??'';if(r===(LAST[a]??''))continue;
    if(r!==''){ctx.TASTAT[a]=(ctx.IST[a]&&ctx.IST[a][r])||r;confirma(ctx,a)}}   // ce a tastat elevul (și după Anulare: textul lui, nu forma din bara de formule)
  ctx.LAST=Object.assign({},RAW)}
function info(ctx,a){if(!(a in ctx.RAW))return {tip:'gol',afisat:''};return afisare(ctx.RAW[a],formaPusa(ctx.FMT,a))}
function deseneaza(ctx){const {body,S}=ctx;if(!S||S.mod()!=='ro')return;const w=body.querySelector('#xwrap');if(!w)return;
  const gata=eGata(body);
  const bar=w.querySelector('.bara');if(bar&&!ctx.Q.arataSetari&&!bar.querySelector('.xt-set')){const s=document.createElement('span');s.className='xt-set';s.textContent='Setări românești: 7,5 cu virgulă · date 05.10.2026';bar.prepend(s)}
  w.querySelectorAll('.gw td[data-a]').forEach(td=>{const a=td.dataset.a;
    if(!gata&&td.classList.contains('act'))return;                 // celula în care scrii acum: textul tău
    if(formaAleasa(ctx.FMT[a]))return;
    const i=info(ctx,a);if(i.tip==='formula')return;
    const fh=td.querySelector('.fh');td.textContent=i.afisat||'';if(fh)td.appendChild(fh);
    td.classList.toggle('n',!!i.dreapta);td.classList.toggle('e',!!i.centru);td.classList.toggle('xtri',!!i.tri);
    td.style.color=i.rosu?'#C00000':'';
    if(i.tri)td.title='Număr păstrat ca text (Number Stored as Text)';else td.removeAttribute('title')});
  if(gata){const act=w.querySelector('.gw td.act'),fx=w.querySelector('#xfx');if(act&&fx&&document.activeElement!==fx)fx.value=ctx.RAW[act.dataset.a]??''}}
function tick(ctx){sync(ctx);deseneaza(ctx);numeGolire(ctx.body)}
function numeGolire(body){const b=body.querySelector('#xwrap .pg [data-nesim="ClearMenu"]');if(!b||b.querySelector('.pg-et'))return;
  const slot=b.closest('.pg-slot'),grup=b.closest('.pg-grup');if(!slot||!grup)return;
  const s=document.createElement('span');s.className='pg-et';s.textContent='Clear';b.insertBefore(s,b.querySelector('.pg-sag'));
  const x0=parseFloat(slot.style.left)||0,w0=parseFloat(slot.style.width)||0,plus=Math.max(0,64-w0);
  grup.querySelectorAll('.pg-slot').forEach(o=>{const l=parseFloat(o.style.left)||0;if(o!==slot&&l>=x0+w0-1)o.style.left=(l+plus)+'px'});
  slot.style.width=(w0+plus)+'px';grup.style.width=((parseFloat(grup.style.width)||0)+plus)+'px'}

/* ------------------ verificarea pe TIP ------------------ */
const numarRo=x=>String(x).replace('.',',');
function dataCeruta(d){const m=String(d).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);return m?serial(+m[3],+m[2],+m[1]):NaN}
/* REPARAREA unei forme de dată rămase (judecătorul lecției 5, G1; probat pe Excel real prin tastare, _proba/proba_tastare2.json):
   după 7.5 → 7,5 peste, Anularea dă 07.mai, apoi gol; după 7.5 → Delete → 7,5, prima Anulare dă o celulă GOALĂ, dar cu forma
   de dată. Deci semnul de oprire NU e „celula goală”, ci: „până vezi din nou 07.mai, apoi încă o dată”. */
const PE_GOLIRE=a=>`selectează ${a}, apoi, pe fila Pornire (Home), butonul cu radieră Golire (Clear), al treilea din grupul Editare (Editing) (dacă nu vezi grupul, derulează panglica spre dreapta) › Golire totală (Clear All): celula rămâne goală, fără forma de dată`;
const areGolire=ctx=>ctx.Q.panglica!==false;   // foaia are panglica (fila Pornire, cu Golire totală)
function reparaForma(ctx,a,xs){const v=(ctx.FMT[a]||{}).axv||'data scrisă greșit la început';
  if(areGolire(ctx))return `Ca s-o scoți, ${PE_GOLIRE(a)}. Apoi scrie ${xs}.`;
  return `Apasă Ctrl+Z (sau ↶) până reapare ${v} în ${a}, apoi mai apasă până dispare și ${v}. Ce ai scris între timp în alte celule se anulează și el; scrie-l din nou. Apoi scrie ${xs} în ${a}.`}
function problema(ctx,a,exp){const i=info(ctx,a),tastat=ctx.TASTAT[a]||ctx.RAW[a]||'';
  if('numar' in exp){const x=exp.numar,xs=numarRo(x);
    if(i.tip==='gol')return `${a} e goală: scrie în ea ${xs}.`;
    if(i.tip==='numar'&&Math.abs(i.v-x)<1e-9)return '';
    if(i.tip==='data'||i.tip==='ora'){const p0=citeste(tastat),simplu=p0.tip==='num'&&p0.fmt==='General';
      if(Math.abs(i.v-x)<1e-9||simplu)return `În ${a} ai scris un număr, dar celula a păstrat forma de dată de la o greșeală de mai devreme și arată ${i.afisat}. ${reparaForma(ctx,a,xs)}`;
      return `În ${a} ai scris „${tastat}”, iar Excel a făcut din el o dată: ${i.afisat}. Pe setări românești zecimala se scrie cu virgulă: ${xs}. `+(areGolire(ctx)
        ?`Dacă a fost ultimul lucru făcut, apasă Ctrl+Z (sau ↶); altfel ${PE_GOLIRE(a)}. Apoi scrie ${xs}.`
        :`Apasă Ctrl+Z (sau ↶) până dispare ${i.afisat} din ${a}. Ce ai scris între timp în alte celule se anulează și el; scrie-l din nou. Apoi scrie ${xs} în ${a}.`)}
    if(i.tip==='text')return i.apostrof?`În ${a} ai pus un apostrof în față, deci Excel ține „${i.afisat}” ca text. Scrie doar ${xs}, fără apostrof.`:`În ${a}, „${i.afisat}” a rămas text (stă la stânga), nu număr. Scrie doar cifrele, cu virgulă la zecimale: ${xs}.`;
    return `În ${a} se vede ${i.afisat}, dar trebuie numărul ${xs}.`}
  if('data' in exp){const d=exp.data,s=dataCeruta(d);
    if(i.tip==='gol')return `${a} e goală: scrie în ea data ${d}.`;
    if(i.tip==='data'&&Math.floor(i.v+1e-9)===s)return '';
    if(i.tip==='text')return `În ${a}, „${i.afisat}” a rămas text, la stânga: Excel nu l-a recunoscut ca dată. Scrie ziua, punct, luna, punct, anul: ${d}.`;
    if(i.tip==='data')return `În ${a} e data ${i.afisat}, dar se cere ${d}.`;
    return `În ${a} e un număr, nu o dată. Scrie data cu puncte: ${d}.`}
  if('text' in exp){const t=String(exp.text);
    if(i.tip==='gol')return `${a} e goală: scrie în ea ${t}.`;
    if(i.tip==='text'&&String(i.v).trim().toLowerCase()===t.toLowerCase())return '';
    /* tastatura românească (Română Standard): tasta din stânga lui Enter scrie ț; apostroful e AltGr + aceeași tastă (probat
       pe acest PC: _proba/proba_tastatura.json). Telefonul poate pune ’ în loc de ' (Excel îl ține ca pe o literă, probat). */
    if(i.tip==='text'&&/^[țȚ]/.test(i.v))return `În ${a} a apărut „${i.afisat}”: tastatura e românească, iar tasta din stânga lui Enter scrie ț. Apostroful îl faci ținând apăsată tasta AltGr (Alt din dreapta) și apăsând aceeași tastă. Scrie din nou: '${t}.`;
    if(i.tip==='text'&&/^[’‘`´]/.test(i.v))return `În ${a} a apărut „${i.afisat}”: în loc de apostroful drept ' s-a pus alt semn (${i.afisat[0]}), pe care Excel îl ține ca pe o literă. Pe telefon, atinge butonul „' apostrof drept” de sub foaie și scrie din nou ${t}.`;
    if(i.tip==='numar'&&/^0\d/.test(t))return `În ${a} Excel a făcut din „${tastat}” numărul ${i.afisat} (la dreapta) și a pierdut zerourile din față. Scrie un apostrof înainte: '${t}.`;
    if(i.tip!=='text')return `În ${a} Excel a făcut din „${tastat}” ${i.tip==='data'?'o dată':'un număr'}: ${i.afisat}. Ca să rămână text, scrie un apostrof înainte: '${t}.`;
    return `În ${a} trebuie să se vadă „${t}”.`}
  return ''}
function probleme(ctx,tip){return Object.entries(tip||{}).map(([a,e])=>problema(ctx,a,e)).filter(Boolean)}
function solutie(ctx){const V=(ctx.Q.verifica||{}).tip||{};
  const s=Object.entries(V).map(([a,e])=>'numar' in e?`în ${a} scrii <code>${esc(numarRo(e.numar))}</code>`:'data' in e?`în ${a} scrii <code>${esc(e.data)}</code>`:
    `în ${a} scrii <code>${esc((citeste(e.text).tip==='text'?'':"'")+e.text)}</code>`);
  return s.join(', ')+'. '+(areGolire(ctx)?'Dacă o celulă a rămas cu forma de dată (scrii un număr și apare o dată), o selectezi și alegi, pe fila Pornire (Home), butonul cu radieră Golire (Clear), al treilea din grupul Editare (Editing), apoi Golire totală (Clear All); apoi scrii din nou.'
    :'Dacă o celulă a rămas cu forma de dată (scrii un număr și apare o dată), apeși Ctrl+Z (sau ↶) până reapare data greșită de la început, apoi până dispare și ea; ce ai scris între timp scrii din nou.')}
const CSS_T=`.xl td.xtri{background-image:linear-gradient(135deg,#1E8C45 0,#1E8C45 6px,transparent 6px)!important}   /* și pe celula activă (td.act pune „background”), ca în Excel */
.xl.xt-fara-setari .bara [data-mod]{display:none}
.xl.xt-fara-setari .bara>span:not(.mod):not(.xt-set){display:none}
.xl .bara .xt-set{font-size:.8rem;color:var(--ink2);margin-right:auto}
.xt-apos-bar{margin:6px 0 0;font-size:.88rem;color:var(--ink2)}
.xt-apos-bar .xt-apos{padding:4px 12px;font-family:var(--fm,monospace)}`;
function css(){if(!document.getElementById('xt-css')){const s=document.createElement('style');s.id='xt-css';s.textContent=CSS_T;document.head.appendChild(s)}}

/* copierea și lipirea duc și FORMA celulei, ca în Excel (foaia din motor copiază doar conținutul): la Ctrl+C / Ctrl+X
   (de la tastatură, din meniu sau din panglică: toate ajung ca tastă pe foaie) ținem minte forma zonei; după lipire o
   punem în destinație (iar la decupare o scoatem de la sursă). Anularea o desface odată cu lipirea (instantaneul foii
   e luat înainte de lipire). Umplerea prin tragere (lecția 7) nu duce încă forma. */
const poz=a=>{const m=String(a).match(/^([A-Z]{1,3})(\d+)$/);return m?{c:m[1].split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1,r:+m[2]-1}:null};
const adrX=(c,r)=>{let s='';for(let n=c+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s+(r+1)};
function cadruDOM(w){let c1=1e9,c2=-1,r1=1e9,r2=-1;w.querySelectorAll('.gw td.act, .gw td.z').forEach(t=>{const p=poz(t.dataset.a);if(!p)return;c1=Math.min(c1,p.c);c2=Math.max(c2,p.c);r1=Math.min(r1,p.r);r2=Math.max(r2,p.r)});return c2<0?null:{c1,c2,r1,r2}}
const copieF=f=>f?JSON.parse(JSON.stringify(f)):null;
const MOARTA={a:'á',e:'é',i:'í',o:'ó',u:'ú',y:'ý',c:'ç',A:'Á',E:'É',I:'Í',O:'Ó',U:'Ú',Y:'Ý',C:'Ç'};
function incepeCu(body,text){const g=body.querySelector('#xgw');if(!g)return;const e=new KeyboardEvent('keydown',{key:text[0],bubbles:true,cancelable:true});e._xp=1;g.dispatchEvent(e);
  const i=body.querySelector('#xfx');if(!i)return;i.value=text;i.dispatchEvent(new Event('input',{bubbles:true}));try{i.setSelectionRange(text.length,text.length)}catch(x){}}
function leagaTastaMoarta(body){if(body._xtm)return;body._xtm=1;
  body.addEventListener('keydown',ev=>{if(ev._xp)return;const g=ev.target&&ev.target.closest&&ev.target.closest('.gw');if(!g)return;const ctx=CTX.get(body);if(!ctx)return;
    if(!eGata(body)){ctx.mort=null;return}                      // în bara de formule, tastatura compune singură
    if(ev.key==='Dead'){ctx.mort=ev.code==='Quote'&&!ev.shiftKey?"'":null;return}
    const k=ev.key||'';let text=null;
    if(ctx.mort){const m=ctx.mort;ctx.mort=null;if(ev.ctrlKey||ev.altKey||ev.metaKey)return;
      if(k===' ')text=m;else if(k.length===1)text=MOARTA[k]||(/^[\x21-\x7e]$/.test(k)?m+k:k)}
    else if(k.length===2&&/^['`´]/.test(k))text=k;                 // unele browsere trimit „'0” într-o singură apăsare
    if(text===null)return;ev.preventDefault();ev.stopPropagation();incepeCu(body,text)},true)}
function leagaCopierea(body){if(body._xtc)return;body._xtc=1;
  body.addEventListener('keydown',ev=>{if(!(ev.ctrlKey||ev.metaKey))return;const g=ev.target&&ev.target.closest&&ev.target.closest('.gw');if(!g)return;
    const ctx=CTX.get(body),w=body.querySelector('#xwrap');if(!ctx||!w)return;const k=(ev.key||'').toLowerCase();
    if((k==='c'||k==='x')&&!ev.shiftKey){const z=cadruDOM(w);if(!z)return;const f={};
      for(let r=z.r1;r<=z.r2;r++)for(let c=z.c1;c<=z.c2;c++)f[(r-z.r1)+','+(c-z.c1)]=copieF(ctx.FMT[adrX(c,r)]);
      ctx.clipF={z,f,taie:k==='x'};return}
    if(k==='v'&&ctx.clipF&&w.querySelector('.gw td.mq')){const a=w.querySelector('.gw td.act'),d=a&&poz(a.dataset.a);if(!d)return;const C=ctx.clipF;
      setTimeout(()=>{const {z}=C,h=z.r2-z.r1+1,l=z.c2-z.c1+1,inDest=(c,r)=>c>=d.c&&c<d.c+l&&r>=d.r&&r<d.r+h,exista=x=>!!w.querySelector(`.gw td[data-a="${x}"]`);
        if(!exista(adrX(d.c+l-1,d.r+h-1)))return;   // FOAIA MARE: lipirea n-a încăput nici până la limita foii (motorul n-a lipit nimic): nici forma
        if(C.taie)for(let r=z.r1;r<=z.r2;r++)for(let c=z.c1;c<=z.c2;c++)if(!inDest(c,r))delete ctx.FMT[adrX(c,r)];
        for(let r=0;r<h;r++)for(let c=0;c<l;c++){const x=adrX(d.c+c,d.r+r);if(!exista(x))continue;const f=C.f[r+','+c];if(f)ctx.FMT[x]=copieF(f);else delete ctx.FMT[x]}
        if(C.taie)ctx.clipF=null;ctx.S.draw()},0)}},true)}
/* render: foaia din motor, cu API-ul învelit (verificarea pe tip după cea a foii), apoi stratul la fiecare desen */
function render(Q,body,api){css();
  const baza=window.JocExcel;if(!baza){body.innerHTML='<p class="toast">Foaia Excel nu s-a încărcat. Reîncarcă pagina.</p>';return}
  const ctx={Q,body,LAST:{},TASTAT:{},IST:{}};
  const areTip=!Q.o&&Q.verifica&&Q.verifica.tip;
  /* după „Nu încă” foaia își ia înapoi focusul (judecătorul lecției 5, M2): mesajul cere Ctrl+Z, care trebuie să ajungă la foaie */
  const laFoaie=()=>{const g=body.querySelector('#xgw');if(g)try{g.focus({preventScroll:true})}catch(e){}};
  const apiW=Object.assign({},api,{
    resolve:(ok,msg)=>{if(ok&&areTip){sync(ctx);const p=probleme(ctx,Q.verifica.tip);
        if(p.length){api.resolve(false,p.slice(0,2).map(esc).join(' '));api.revealButton(()=>api.giveUp(solutie(ctx)));laFoaie();return}}
      api.resolve(ok,msg);if(!ok&&!Q.o)laFoaie()},
    giveUp:html=>api.giveUp(areTip&&(!html||html==='.')?solutie(ctx):areTip?solutie(ctx)+' '+html:html)});
  baza.render(Object.assign({},Q,{mod:Q.mod||'ro'}),body,apiW);
  ctx.S=baza.render._stare;ctx.RAW=ctx.S.RAW;ctx.FMT=ctx.S.FMT;CTX.set(body,ctx);
  const w=body.querySelector('#xwrap');tick(ctx);leagaCopierea(body);leagaTastaMoarta(body);leagaAnularea();
  if(w){const marcheaza=()=>{const x=w.querySelector('.xl');if(x&&!Q.arataSetari)x.classList.add('xt-fara-setari')};marcheaza();
    new MutationObserver(()=>{marcheaza();tick(ctx)}).observe(w,{childList:true})}
  if(w&&Q.inainte)inainte(ctx,Q.inainte);
  if(w&&areTip&&Object.values(Q.verifica.tip).some(e=>'text' in e&&citeste(String(e.text)).tip!=='text'))butonApostrof(ctx,w)}
/* Ctrl+Z / Ctrl+Y ajung la foaie oriunde ar fi focusul (butoanele lecției, pagina), ca în Excel; nu și dintr-un câmp de scris */
let anulareLegata=false;
function leagaAnularea(){if(anulareLegata)return;anulareLegata=true;
  document.addEventListener('keydown',ev=>{if(!(ev.ctrlKey||ev.metaKey)||ev.altKey)return;const k=(ev.key||'').toLowerCase();if(k!=='z'&&k!=='y')return;
    const t=ev.target;if(t&&t.closest&&(t.closest('.gw')||t.closest('input,textarea,select,[contenteditable="true"]')))return;
    const g=document.querySelector('#body #xgw');if(!g)return;ev.preventDefault();try{g.focus({preventScroll:true})}catch(e){}
    g.dispatchEvent(new KeyboardEvent('keydown',{key:ev.key,ctrlKey:true,bubbles:true,cancelable:true}))},true)}
/* Q.inainte: [[adresa, text | 'DEL'], ...] = ce „s-a întâmplat” în foaie înainte de exercițiu, făcut cu gesturile foii
   (deci Anularea le poate desface pe rând, ca în Excel, în aceeași sesiune) */
function inainte(ctx,pasi){const {body}=ctx,g=()=>body.querySelector('#xgw'),fx=()=>body.querySelector('#xfx');const y0=window.scrollY;
  const tasta=(el,key,o)=>{const e=new KeyboardEvent('keydown',Object.assign({key,bubbles:true,cancelable:true},o||{}));e._xp=1;el.dispatchEvent(e)};
  const pe=(el,tip)=>{const e=new PointerEvent(tip,{bubbles:true,cancelable:true,pointerId:1,pointerType:'mouse',isPrimary:true,button:0,buttons:tip==='pointerup'?0:1});e._xp=1;el.dispatchEvent(e)};
  const alege=a=>{tasta(g(),'Shift');const td=body.querySelector(`#xwrap td[data-a="${a}"]`);if(td){pe(td,'pointerdown');pe(g(),'pointerup')}};
  for(const [a,t] of pasi){alege(a);
    if(t==='DEL')tasta(g(),'Delete');
    else{tasta(g(),String(t)[0]);const i=fx();if(i){i.value=String(t);i.dispatchEvent(new Event('input',{bubbles:true}));tasta(i,'Enter')}}
    sync(ctx)}
  if(pasi.length){alege(pasi[pasi.length-1][0]);tasta(g(),'Shift')}   // Shift uită clicul pregătit: primul clic al elevului nu e luat drept dublu-clic
  try{document.activeElement&&document.activeElement.blur()}catch(e){}window.scrollTo(0,y0)}
/* pe telefon, tastatura poate pune ’ în loc de ': butonul pune apostroful drept la începutul barei de formule */
function butonApostrof(ctx,w){if(!(matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0))return;const {body}=ctx;
  const p=document.createElement('p');p.className='xt-apos-bar';
  p.innerHTML='Telefonul îți pune ’ în loc de \'? Atinge <button type="button" class="btn ghost xt-apos">\' apostrof drept</button>: bara de formule pornește de la capăt, cu \' la început. Apoi scrii restul (de exemplu 007).';
  w.after(p);const b=p.querySelector('button');
  b.addEventListener('pointerdown',ev=>ev.preventDefault());   // tastatura telefonului rămâne deschisă
  b.addEventListener('click',()=>{const i=body.querySelector('#xfx');if(!i)return;const scria=document.activeElement===i&&!eGata(body);   // în scriere: rămânem în ea (tastatura telefonului nu se închide)
    if(!scria)i.focus();i.value="'";i.dispatchEvent(new Event('input',{bubbles:true}));
    try{i.focus();i.setSelectionRange(i.value.length,i.value.length)}catch(e){}})}
function rezolva(Q,body,api){const ctx=CTX.get(body);
  if(ctx&&!Q.o){const {RAW,FMT}=ctx;Object.entries((Q.verifica||{}).tip||{}).forEach(([a,e])=>{
    if('numar' in e){if(FMT[a])delete FMT[a].ax;RAW[a]=numarRo(e.numar)}
    else if('data' in e){if(FMT[a]&&!FDATA.includes(FMT[a].ax))delete FMT[a].ax;RAW[a]=e.data}
    else if('text' in e)RAW[a]=(citeste(e.text).tip==='text'?'':"'")+e.text})}
  return window.JocExcel.rezolva(Q,body,ctx?ctx.S:api)}
function gresit(Q,body,api){const ctx=CTX.get(body);
  if(ctx&&!Q.o){const {RAW,FMT}=ctx;Object.entries((Q.verifica||{}).tip||{}).forEach(([a,e])=>{
    if('numar' in e){if((Q.gresitLipit||[]).includes(a)){(FMT[a]=FMT[a]||{}).ax='dd.mmm';RAW[a]=numarRo(e.numar)}   // scris peste o dată: rămâne forma de dată
      else RAW[a]=Number.isInteger(e.numar)?"'"+e.numar:String(e.numar)}                                           // 7.5 cu punct / număr cu apostrof
    else if('data' in e)RAW[a]=e.data.replace(/\./g,',');                                                            // 05,10,2026 = text
    else if('text' in e)RAW[a]=citeste(e.text).tip==='text'?e.text+'?':e.text})}                                    // 007 fără apostrof = numărul 7
  return window.JocExcel.gresit(Q,body,ctx?ctx.S:api)}
/* testele numite: {ce, tip:{...}} se bifează când tipul și valoarea sunt cele cerute */
function testeOk(body,tip){const ctx=CTX.get(body);if(!ctx)return false;sync(ctx);return probleme(ctx,tip).length===0}
/* Golire totală (Clear All): după golirea făcută de foaie (cu Anulare), scoate și forma celulelor din zonă */
function golesteForma(body,z){const ctx=CTX.get(body);if(!ctx||!z)return;
  for(let c=z.c1;c<=z.c2;c++)for(let r=z.r1;r<=z.r2;r++){let s='';for(let n=c+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;delete ctx.FMT[s+(r+1)]}
  ctx.S.draw()}
return {render,rezolva,gresit,testeOk,golesteForma,citeste,afisare,afis,serial};
})();

/* tip-excel.js pune copia și în clipboardul calculatorului (navigator.clipboard.writeText) într-un try{}, dar
   promisiunea respinsă (fără permisiune: file://, fereastră fără focus) scapă ca eroare în consolă. O prindem aici,
   fără să schimbăm ce face foaia. CERERE pentru _motor: .catch(()=>{}) în copiaza(). */
try{const cb=navigator.clipboard;if(cb&&cb.writeText){const scrie=cb.writeText.bind(cb);cb.writeText=t=>scrie(t).catch(()=>{})}}catch(e){}
/* Panglica reală vine din dump-ul UI Automation, unde butonul mare din grupul Cells se numește „Delete Cells...”;
   pe ecranul Excel scrie „Delete” (și „Insert”). Corectăm doar eticheta, în memorie, înainte să se deseneze
   (ascultătorul ăsta e pus înaintea celui din tip-excel.js, deci rulează primul). */
function corecteazaPanglica(){const P=window.PANGLICA_EXCEL;if(!P||P._xp)return;P._xp=1;
  (P.file||[]).forEach(f=>(f.grupuri||[]).forEach(g=>(g.butoane||[]).forEach(b=>{if(b.id==='CellsDeleteSmart')b.eticheta='Delete';if(b.id==='CellsInsertSmart')b.eticheta='Insert'})))}
addEventListener('panglica-excel',corecteazaPanglica);
/* ============================================================================================
   Tipul „excelx” = foaia „excel” din motor (_motor/tip-excel.js), NESCHIMBATĂ, plus drumurile din Excel-ul
   adevărat de care are nevoie lecția 4 și pe care foaia nu le avea încă (regula fidelității, jocuri/README.md §1):
   - clic dreapta pe celulă / pe numărul rândului / pe litera coloanei: meniul cu Decupare (Cut), Copiere (Copy),
     Lipire (Paste), Ștergere… (Delete…), Golire conținut (Clear Contents); clic dreapta în zonă păstrează zona;
   - clic pe numărul rândului / pe litera coloanei = tot rândul / toată coloana (Shift+clic extinde);
   - panglica, fila Pornire (Home): Lipire (planșeta lipește, cuvântul „Paste ▾” deschide lista; gri cât nu e nimic
     copiat), Decupare, Copiere; Ștergere (pictograma scoate imediat celulele, ca în Excel; „Delete ▾” deschide lista);
     Golire (Clear);
   - fereastra Ștergere (Delete): deplasare în sus / la stânga, rând întreg, coloană întreagă;
   - lipirea: pe o singură celulă, pe o zonă de aceeași mărime sau (la copiere) pe un multiplu exact, repetată ca în
     Excel; altfel mesajul Excel-ului; Enter după copiere lipește și oprește copierea;
   - golirea (Delete), ștergerea de rânduri/celule opresc copierea (marginea punctată), ca în Excel;
   - Backspace pe o zonă golește doar celula activă și intră în scriere, ca în Excel;
   - telefonul: tragerea cu degetul selectează; atingerea lungă deschide meniul; notă pe ecran;
   - tastele Ctrl+- (ștergere), Shift+Spațiu (rândul), Ctrl+Spațiu (coloana), tasta Meniu / Shift+F10;
   - caseta de nume se poate scrie: B2 sau B2:C4 + Enter selectează.
   Totul trece prin gesturile foii (clic, tragere, Ctrl+X/C/V, Delete, Esc), trimise ca evenimente: foaia își face
   singură Anularea (Undo) și desenul. Ștergerea unui rând = decuparea rândurilor de dedesubt, lipită un rând mai
   sus (o singură operație pentru Ctrl+Z, ca în Excel). CERERE pentru _motor: mutat în tip-excel.js (vezi surse.md).
   Câmpuri noi pe întrebare: `teste:[{ce, valori, gol, fara}]` (testele numite ale atelierului, bifate pe loc);
   `doarMouse:true` (copierea și lipirea trebuie date din meniu sau din panglică); `variante:true` (lasă butonul
   „Exersează pe variante”: la sarcinile cu valori, varianta() din motor schimbă numele și numerele din foaie, dar nu
   și valorile așteptate, deci acolo e oprit). */
const ExcelPlus=(function(){
'use strict';
const COL=i=>{let s='';for(let n=i+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s};
const pos=a=>{const m=String(a).toUpperCase().match(/^([A-Z]{1,3})(\d+)$/);return m?{c:m[1].split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1,r:Number(m[2])-1}:null};
const adr=(c,r)=>COL(c)+(r+1);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const bun=v=>typeof v==='number'&&isFinite(v)&&v>0;
const CSS=`.xp-meniu{position:fixed;z-index:80;min-width:250px;max-width:94vw;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:8px;box-shadow:0 10px 28px rgba(0,0,0,.28);padding:4px 0;font-family:var(--fb);font-size:.92rem}
.xp-meniu button{display:block;width:100%;text-align:left;border:0;background:none;color:inherit;font:inherit;padding:8px 14px;cursor:pointer}
.xp-meniu button:hover,.xp-meniu button:focus-visible{background:var(--sel);outline:none}
.xp-meniu button[disabled]{opacity:.45;cursor:default;background:none}
.xp-meniu hr{border:0;border-top:1px solid var(--line);margin:4px 0}
.xp-meniu .xp-lbl{padding:5px 14px 1px;font-size:.78rem;color:var(--ink2)}
.xp-fundal{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:16px}
.xp-dlg{background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:14px 16px;max-width:360px;width:100%;box-shadow:0 12px 32px rgba(0,0,0,.3);font-family:var(--fb)}
.xp-dlg b{display:block;margin-bottom:8px}
.xp-dlg label{display:flex;gap:8px;align-items:flex-start;padding:5px 0;font-size:.94rem;cursor:pointer}
.xp-dlg .xp-bt{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}
.xp-nota{margin:6px 0 0;font-size:.88rem;color:var(--ink2)}
.xp-nota:empty{display:none}
.xp-tel{margin:0 0 8px;padding:6px 10px;font-size:.86rem;border-radius:6px;background:var(--sel);color:var(--ink)}
.xp-nb-in{width:100%;min-width:0;box-sizing:border-box;font:inherit;border:0;outline:2px solid var(--accent);background:var(--paper);color:var(--ink);padding:0 2px}
.xp-teste{margin:0 0 10px;padding:10px 12px;border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:8px;background:var(--paper)}
.xp-teste .lbl{font-weight:700;font-size:.9rem;margin-bottom:4px}
.xp-teste ul{list-style:none;margin:0;padding:0}
.xp-teste li{padding:3px 0;color:var(--ink2)}
.xp-teste li.ok{color:var(--ok);font-weight:600}
.xp-teste li span[aria-hidden]{display:inline-block;width:1.3em}
.xp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* din pagina lecției 4: degetul trage peste celule (selectează), derulează pe numerele rândurilor și pe literele coloanelor */
.xl .gw td{touch-action:none}
.xl .gw tbody th{touch-action:pan-y}
.xl .gw thead th{touch-action:pan-x}
/* panglica se derulează în lateral și pe ecran lat (grupul Celule / Cells nu încape): spus mereu */
.xl .pg .pg-ingust{display:block}`;
function css(){if(!document.getElementById('xp-css')){const s=document.createElement('style');s.id='xp-css';s.textContent=CSS;document.head.appendChild(s)}}

/* ---- starea, citită din foaia desenată (tip-excel redesenează tot la fiecare schimbare) ----
   Toate funcțiile de mai jos primesc învelișul stabil #xwrap (îi zic tot „xl”) și caută în el foaia de ACUM:
   .xl se înlocuiește la fiecare desen, iar un meniu deschis ar citi altfel selecția veche. */
const wrapDe=el=>{const x=el&&el.closest&&el.closest('.xl');return x?x.parentElement:null};
const grid=xl=>xl&&xl.querySelector('.gw');
const td=(xl,a)=>xl.querySelector(`.gw td[data-a="${a}"]`);
const dim=xl=>({cols:xl.querySelectorAll('.gw thead th').length-1,rows:xl.querySelectorAll('.gw tbody tr').length});
function cadru(celule){let c1=1e9,c2=-1,r1=1e9,r2=-1;celule.forEach(t=>{const p=pos(t.dataset.a);if(!p)return;c1=Math.min(c1,p.c);c2=Math.max(c2,p.c);r1=Math.min(r1,p.r);r2=Math.max(r2,p.r)});return c2<0?null:{c1,c2,r1,r2}}
function zona(xl){const z=cadru(xl.querySelectorAll('.gw td.act, .gw td.z'));if(!z)return null;const a=xl.querySelector('.gw td.act');z.act=a?pos(a.dataset.a):{c:z.c1,r:z.r1};return z}
const zonaCopiata=xl=>cadru(xl.querySelectorAll('.gw td.mq'));
const eGata=xl=>{const s=xl.querySelector('.st span');return !s||/^Gata/.test(s.textContent)};   // modul Gata (Ready), nu în scriere
const areCopie=xl=>!!xl.querySelector('.gw td.mq');   // marginea punctată = ceva copiat/decupat
const randuriIntregi=(z,D)=>z&&z.c1===0&&z.c2===D.cols-1;
const coloaneIntregi=(z,D)=>z&&z.r1===0&&z.r2===D.rows-1;

/* ---- gesturile foii, trimise ca evenimente (marcate _xp, ca să nu le prindă tot aici) ---- */
function pe(el,tip,o){if(!el)return;const e=new PointerEvent(tip,Object.assign({bubbles:true,cancelable:true,composed:true,pointerId:1,pointerType:'mouse',isPrimary:true,button:0,buttons:tip==='pointerup'?0:1},o||{}));e._xp=1;el.dispatchEvent(e)}
function tasta(xl,key,o){const g=grid(xl);if(!g)return;try{g.focus({preventScroll:true})}catch(e){}
  const e=new KeyboardEvent('keydown',Object.assign({key,bubbles:true,cancelable:true},o||{}));e._xp=1;g.dispatchEvent(e)}
/* selectează de la „a” (celula activă) la „b”; tasta Shift trimisă înainte uită clicul precedent (altfel un clic pe
   aceeași celulă în 450 ms ar fi luat drept dublu-clic) */
function selecteaza(xl,a,b){tasta(xl,'Shift');pe(td(xl,a),'pointerdown');if(b&&b!==a)pe(td(xl,b),'pointermove');pe(grid(xl),'pointerup');tasta(xl,'Shift')}
const selZ=(xl,z)=>selecteaza(xl,adr(z.c1,z.r1),adr(z.c2,z.r2));
const opresteCopierea=xl=>{if(areCopie(xl))tasta(xl,'Escape')};
function copiaza(xl,dinMeniu){xl._taiat=false;if(dinMeniu)xl._mc=1;tasta(xl,'c',{ctrlKey:true})}
function taie(xl,dinMeniu){xl._taiat=true;if(dinMeniu)xl._mc=1;tasta(xl,'x',{ctrlKey:true})}
/* LIPIREA, ca în Excel: pe o celulă (colțul stânga-sus al locului nou), pe o zonă de aceeași mărime, sau — doar la
   copiere — pe o zonă care e un multiplu exact (copia se repetă, probat în Excel real de judecător); altfel Excel dă
   mesajul „nu au aceeași mărime și formă” și nu lipește nimic. `siOpreste` = Enter: lipește și oprește copierea. */
function lipeste(xl,dinMeniu,siOpreste){
  if(!areCopie(xl))return;if(dinMeniu)xl._mp=1;
  const s=zonaCopiata(xl),z=zona(xl);if(!s||!z)return tasta(xl,'v',{ctrlKey:true});
  const h=s.r2-s.r1+1,w=s.c2-s.c1+1,H=z.r2-z.r1+1,W=z.c2-z.c1+1;
  if(H===1&&W===1)tasta(xl,'v',{ctrlKey:true});
  else if(H===h&&W===w){selecteaza(xl,adr(z.c1,z.r1));tasta(xl,'v',{ctrlKey:true});selZ(xl,z)}
  else if(!xl._taiat&&H%h===0&&W%w===0){for(let r=z.r1;r<=z.r2;r+=h)for(let c=z.c1;c<=z.c2;c+=w){selecteaza(xl,adr(c,r));tasta(xl,'v',{ctrlKey:true})}selZ(xl,z)}
  else{nota(xl,`Excel nu lipește aici: zona ${xl._taiat?'decupată':'copiată'} are ${h}×${w} celule, iar zona selectată are ${H}×${W}, deci nu au aceeași mărime și formă. Fă clic pe <b>o singură celulă</b> (colțul stânga-sus al locului nou) și lipește din nou.`);return}
  if(siOpreste)opresteCopierea(xl)}
function taieSiLipeste(xl,src,dst){selZ(xl,src);taie(xl);selecteaza(xl,adr(dst.c,dst.r));tasta(xl,'v',{ctrlKey:true})}
function goleste(xl,z){if(z)selZ(xl,z);tasta(xl,'Delete');opresteCopierea(xl)}   // golirea oprește copierea (Excel: CutCopyMode 1 → 0)
function stergeRanduri(xl,r1,r2){const D=dim(xl);
  if(r2<D.rows-1)taieSiLipeste(xl,{c1:0,c2:D.cols-1,r1:r2+1,r2:D.rows-1},{c:0,r:r1});else goleste(xl,{c1:0,c2:D.cols-1,r1,r2});
  selZ(xl,{c1:0,c2:D.cols-1,r1,r2})}
function stergeColoane(xl,c1,c2){const D=dim(xl);
  if(c2<D.cols-1)taieSiLipeste(xl,{c1:c2+1,c2:D.cols-1,r1:0,r2:D.rows-1},{c:c1,r:0});else goleste(xl,{c1,c2,r1:0,r2:D.rows-1});
  selZ(xl,{c1,c2,r1:0,r2:D.rows-1})}
function deplaseazaSus(xl,z){const D=dim(xl);
  if(z.r2<D.rows-1)taieSiLipeste(xl,{c1:z.c1,c2:z.c2,r1:z.r2+1,r2:D.rows-1},{c:z.c1,r:z.r1});else goleste(xl,z);selZ(xl,z)}
function deplaseazaStanga(xl,z){const D=dim(xl);
  if(z.c2<D.cols-1)taieSiLipeste(xl,{c1:z.c2+1,c2:D.cols-1,r1:z.r1,r2:z.r2},{c:z.c1,r:z.r1});else goleste(xl,z);selZ(xl,z)}
/* pictograma butonului Pornire › Ștergere (Delete): în Excel scoate DIRECT, fără meniu (probat în Excel real):
   rânduri întregi → rândurile; coloane întregi → coloanele; o zonă mai înaltă decât lată → celulele din dreapta vin
   la stânga; altfel (o celulă, o zonă lată sau pătrată) → celulele de dedesubt urcă */
function stergeDirect(xl){const z=zona(xl),D=dim(xl);if(!z)return;
  if(randuriIntregi(z,D))stergeRanduri(xl,z.r1,z.r2);else if(coloaneIntregi(z,D))stergeColoane(xl,z.c1,z.c2);
  else if(z.r2-z.r1>z.c2-z.c1)deplaseazaStanga(xl,z);else deplaseazaSus(xl,z)}

/* ---- mesajele de sub foaie ---- */
function nota(xl,html){const w=xl;if(!w)return;let n=w.nextElementSibling;
  if(!n||!n.classList.contains('xp-nota')){n=document.createElement('div');n.className='xp-nota';n.setAttribute('aria-live','polite');w.after(n)}n.innerHTML=html||''}
const nesim=(xl,nume)=>nota(xl,`„${esc(nume)}” e și în Excel, dar în exercițiile de azi nu-l folosim.`);

/* ---- meniurile (clic dreapta, săgețile din panglică) ---- */
let M=null,Mt=0;
function inchide(){if(M){M.remove();M=null}}
/* derularea închide meniul, ca în Excel; nu și derularea pe care o face chiar clicul care l-a deschis */
const inchideLaDerulare=()=>{if(M&&Date.now()-Mt>300)inchide()};
function meniu(xl,x,y,items){inchide();css();const m=document.createElement('div');m.className='xp-meniu';m.setAttribute('role','menu');
  m.innerHTML=items.map((it,i)=>it==='-'?'<hr>':it.lbl?`<div class="xp-lbl">${it.lbl}</div>`:`<button type="button" role="menuitem" data-i="${i}" ${it.off?'disabled':''}>${it.t}</button>`).join('');
  document.body.appendChild(m);M=m;Mt=Date.now();const r=m.getBoundingClientRect();
  x=isFinite(x)?x:innerWidth/2-r.width/2;y=isFinite(y)?y:innerHeight/3;
  m.style.left=Math.max(4,Math.min(x,innerWidth-r.width-4))+'px';m.style.top=Math.max(4,Math.min(y,innerHeight-r.height-4))+'px';
  m.querySelectorAll('button[data-i]').forEach(b=>b.addEventListener('click',ev=>{ev.stopPropagation();const it=items[+b.dataset.i];inchide();nota(xl,'');it.fn()}));
  const f=m.querySelector('button:not([disabled])');if(f)try{f.focus({preventScroll:true})}catch(e){}}
const LIPIRE=xl=>[{lbl:'Opțiuni lipire (Paste Options):'},{t:'📋 Lipire (Paste)',off:!areCopie(xl),fn:()=>lipeste(xl,true)}];
function itemiCelula(xl){return [
  {t:'✂ Decupare (Cut)',fn:()=>taie(xl,true)},{t:'⧉ Copiere (Copy)',fn:()=>copiaza(xl,true)},...LIPIRE(xl),'-',
  {t:'Inserare… (Insert…)',fn:()=>nesim(xl,'Inserare… (Insert…)')},{t:'Ștergere… (Delete…)',fn:()=>dialogSterge(xl)},
  {t:'Golire conținut (Clear Contents)',fn:()=>goleste(xl)},'-',{t:'Formatare celule… (Format Cells…)',fn:()=>nesim(xl,'Formatare celule… (Format Cells…)')}]}
function itemiAntet(xl,tip){return [
  {t:'✂ Decupare (Cut)',fn:()=>taie(xl,true)},{t:'⧉ Copiere (Copy)',fn:()=>copiaza(xl,true)},...LIPIRE(xl),'-',
  {t:'Inserare (Insert)',fn:()=>nesim(xl,'Inserare (Insert)')},
  {t:'Ștergere (Delete)',fn:()=>{const z=zona(xl);if(!z)return;if(tip==='col')stergeColoane(xl,z.c1,z.c2);else stergeRanduri(xl,z.r1,z.r2)}},
  {t:'Golire conținut (Clear Contents)',fn:()=>goleste(xl)}]}
function itemiStergere(xl){return [
  {t:'Ștergere celule… (Delete Cells…)',fn:()=>dialogSterge(xl)},
  {t:'Ștergere rânduri foaie (Delete Sheet Rows)',fn:()=>{const z=zona(xl);if(z)stergeRanduri(xl,z.r1,z.r2)}},
  {t:'Ștergere coloane foaie (Delete Sheet Columns)',fn:()=>{const z=zona(xl);if(z)stergeColoane(xl,z.c1,z.c2)}},'-',
  {t:'Ștergere foaie (Delete Sheet)',fn:()=>nesim(xl,'Ștergere foaie (Delete Sheet)')}]}
function itemiGolire(xl){return [
  {t:'Golire totală (Clear All)',fn:()=>{const z=zona(xl);goleste(xl);Tipuri.golesteForma(xl.parentElement,z)}},{t:'Golire formate (Clear Formats)',fn:()=>nesim(xl,'Golire formate (Clear Formats)')},
  {t:'Golire conținut (Clear Contents)',fn:()=>goleste(xl)},{t:'Golire comentarii și note (Clear Comments and Notes)',fn:()=>nesim(xl,'Golire comentarii și note')}]}
function itemiPaste(xl){return [...LIPIRE(xl),'-',{t:'Lipire specială… (Paste Special…)',fn:()=>nesim(xl,'Lipire specială… (Paste Special…)')}]}
function itemiCopy(xl){return [{t:'⧉ Copiere (Copy)',fn:()=>copiaza(xl,true)},{t:'Copiere ca imagine… (Copy as Picture…)',fn:()=>nesim(xl,'Copiere ca imagine… (Copy as Picture…)')}]}
function dialogSterge(xl){const z=zona(xl);if(!z)return;inchide();css();
  const d=document.createElement('div');d.className='xp-fundal';
  d.innerHTML=`<div class="xp-dlg" role="dialog" aria-modal="true" aria-label="Ștergere (Delete)"><b>Ștergere (Delete)</b>
    <label><input type="radio" name="xp-del" value="stanga"> Deplasare celule la stânga (Shift cells left)</label>
    <label><input type="radio" name="xp-del" value="sus" checked> Deplasare celule în sus (Shift cells up)</label>
    <label><input type="radio" name="xp-del" value="rand"> Rând întreg (Entire row)</label>
    <label><input type="radio" name="xp-del" value="col"> Coloană întreagă (Entire column)</label>
    <div class="xp-bt"><button class="btn primary" type="button" data-ok="1">OK</button><button class="btn" type="button" data-no="1">Revocare (Cancel)</button></div></div>`;
  document.body.appendChild(d);
  const gata=()=>{d.remove();const g=grid(xl);if(g)try{g.focus({preventScroll:true})}catch(e){}};
  d.querySelector('[data-no]').onclick=gata;d.addEventListener('keydown',e=>{if(e.key==='Escape')gata()});
  d.querySelector('[data-ok]').onclick=()=>{const v=(d.querySelector('input[name="xp-del"]:checked')||{}).value;gata();
    if(v==='sus')deplaseazaSus(xl,z);else if(v==='stanga')deplaseazaStanga(xl,z);else if(v==='rand')stergeRanduri(xl,z.r1,z.r2);else if(v==='col')stergeColoane(xl,z.c1,z.c2)};
  try{d.querySelector('[data-ok]').focus()}catch(e){}}

/* ---- antetele: numărul rândului, litera coloanei, colțul (tot) ---- */
function antet(th){const tr=th.parentElement;
  if(th.closest('thead')){const i=[...tr.children].indexOf(th)-1;return i>=0?{tip:'col',i}:{tip:'tot'}}
  return {tip:'rand',i:[...tr.parentElement.children].indexOf(tr)}}
function selecteazaAntet(xl,h,shift){const D=dim(xl),z=zona(xl),a=z?z.act:{c:0,r:0};
  if(h.tip==='tot')return selecteaza(xl,'A1',adr(D.cols-1,D.rows-1));
  if(h.tip==='rand'){if(shift&&z)selecteaza(xl,adr(0,a.r),adr(D.cols-1,h.i));else selecteaza(xl,adr(0,h.i),adr(D.cols-1,h.i))}
  else{if(shift&&z)selecteaza(xl,adr(a.c,0),adr(h.i,D.rows-1));else selecteaza(xl,adr(h.i,0),adr(h.i,D.rows-1))}}

/* ---- caseta de nume: scrii B2 sau B2:C4 și Enter ---- */
function scrieInCaseta(xl,nb){const vechi=nb.textContent;nb.textContent='';const i=document.createElement('input');i.className='xp-nb-in';i.value=vechi;
  i.setAttribute('aria-label','Caseta de nume: scrie o adresă, de exemplu B2 sau B2:C4, și apasă Enter');i.autocomplete='off';i.spellcheck=false;nb.appendChild(i);
  let gata=false;const iesi=()=>{if(gata)return;gata=true;if(nb.isConnected&&nb.contains(i))nb.textContent=vechi};
  i.addEventListener('keydown',e=>{e.stopPropagation();
    if(e.key==='Enter'){e.preventDefault();gata=true;du(xl,i.value.trim(),vechi,nb)}
    else if(e.key==='Escape'){e.preventDefault();iesi();const g=grid(xl);if(g)g.focus()}});
  i.addEventListener('blur',iesi);try{i.focus();i.select()}catch(e){}}
function du(xl,t,vechi,nb){const D=dim(xl),m=t.toUpperCase().match(/^([A-Z]{1,3})(\d+)(?::([A-Z]{1,3})(\d+))?$/);
  if(nb.isConnected)nb.textContent=vechi;
  if(!m){nota(xl,!t||/^\d/.test(t)?'Excel nu primește asta: scrie întâi litera coloanei, apoi numărul rândului, de exemplu <b>B2</b>, sau o zonă ca <b>B2:C4</b>.'
    :`În Excel, „${esc(t)}” ar deveni un NUME pentru celulele selectate (îl vei folosi în clasele mari). Azi scrie o adresă, de exemplu <b>B2</b> sau <b>B2:C4</b>.`);return}
  const a=pos(m[1]+m[2]),b=m[3]?pos(m[3]+m[4]):a;
  if(!a||!b||a.r<0||b.r<0){nota(xl,'Excel nu primește asta: scrie întâi litera coloanei, apoi numărul rândului, de exemplu <b>B2</b>, sau o zonă ca <b>B2:C4</b>.');return}
  /* FOAIA MARE (29.09.2026): o adresă dincolo de ce se vede întinde foaia până acolo (în Excel foaia continuă), prin
     motor; dincolo de limita foii de aici (Z100) nu sărim, iar sub foaie apare mesajul motorului */
  const cMax=Math.max(a.c,b.c),rMax=Math.max(a.r,b.r);
  if(cMax>=D.cols||rMax>=D.rows){const S=stareDe(xl);
    if(!S||!S.creste){nota(xl,`În Excel ai sări acolo. Foaia din exercițiu are doar coloanele A–${COL(D.cols-1)} și rândurile 1–${D.rows}.`);return}
    if(!S.creste(cMax,rMax)){nota(xl,'');S.draw();return}
    S.draw()}
  /* ca în Excel, caseta de nume te duce la celulă: motorul o aduce în vedere (caseta foii în lateral, pagina în jos) */
  const Sv=stareDe(xl);if(Sv&&Sv.arata)Sv.arata();
  nota(xl,'');selZ(xl,{c1:Math.min(a.c,b.c),c2:Math.max(a.c,b.c),r1:Math.min(a.r,b.r),r2:Math.max(a.r,b.r)})}
/* starea foii din motor (tip-excel.js) pentru învelișul #xwrap: motorul o pune pe elementul în care a desenat foaia */
const stareDe=xl=>{const b=xl&&xl.parentElement;return b&&b._xlS||null};

/* ---- după fiecare desen al foii: Lipire gri cât nu e nimic copiat, sfaturile butoanelor, nota despre derulare ---- */
const SFAT={Cut:'Decupare (Cut) · Ctrl+X',Copy:'Copiere (Copy) · Ctrl+C',Paste:'Lipire (Paste) · Ctrl+V — planșeta lipește; cuvântul „Paste ▾” deschide lista',
  CellsDeleteSmart:'Ștergere (Delete): pictograma scoate IMEDIAT celulele selectate; „Delete ▾” deschide lista',ClearMenu:'Golire (Clear) ▾'};
const TXT_ING='Panglica se derulează în lateral: mai la dreapta sunt grupurile Celule (Cells) și Editare (Editing). În Excel-ul de pe calculator o vezi întreagă.';
function ajusteaza(xl){
  const p=xl.querySelector('[data-nesim="Paste"]');if(p){const gri=!areCopie(xl);p.classList.toggle('pg-gri',gri);p.setAttribute('aria-disabled',String(gri))}
  for(const [id,t] of Object.entries(SFAT)){const b=xl.querySelector(`[data-nesim="${id}"]`);if(b&&b.title!==t)b.title=t}
  /* SALTUL PAGINII (29.09.2026; lecțiile VIII/2, VIII/5, VIII/8): nota se scrie O DATĂ, peste textul implicit al panglicii
     (ui-panglica.js), când apare panglica; la desenele următoare motorul (tip-excel.js) o păstrează. Înainte o rescriam
     după FIECARE desen: pagina era o clipă mai scurtă, iar cu pagina derulată până jos browserul o muta (18 px), deci
     tragerea B2 → B6 selecta B2:B5. O notă pusă de altă extensie (formatarea, lecția 6) nu se mai înlocuiește. */
  const i=xl.querySelector('.pg-ingust');if(i&&/^Pe ecran îngust/.test(i.textContent))i.textContent=TXT_ING}
/* butoanele despărțite (mari): partea de sus (pictograma) face comanda, partea de jos (eticheta ▾) deschide lista */
function susPeButon(b,ev){const s=b.querySelector('svg'),r=b.getBoundingClientRect();const lim=s?s.getBoundingClientRect().bottom+1:r.top+r.height/2;return !bun(ev.clientY)||ev.clientY<=lim}

/* ---- legăturile, o singură dată pe elementul-gazdă (motorul refolosește #body la „Încă un exercițiu”) ---- */
let globale=false;
function leaga(body){
  if(!globale){globale=true;
    document.addEventListener('pointerdown',ev=>{if(M&&!M.contains(ev.target))inchide()},true);
    document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&M){inchide()}},true);
    addEventListener('resize',inchideLaDerulare);addEventListener('scroll',inchideLaDerulare,true)}
  if(body._xp)return;body._xp=1;
  const xlDin=ev=>{const g=ev.target&&ev.target.closest&&ev.target.closest('.gw');return g?wrapDe(g):null};
  let deget=null;   // tragerea cu degetul: {xl, id, ultima}
  body.addEventListener('pointerdown',ev=>{if(ev._xp)return;const xl=xlDin(ev);if(!xl)return;xl._tip=ev.pointerType;
    if(ev.button===2){ev.stopPropagation();return}                 // clic dreapta: meniul hotărăște (păstrează zona)
    const th=ev.target.closest('th'),cel=ev.target.closest('td[data-a]');
    if(th&&ev.button===0&&eGata(xl)){ev.stopPropagation();ev.preventDefault();if(ev.pointerType!=='touch')selecteazaAntet(xl,antet(th),ev.shiftKey);return}   // la deget: la „click” (altfel derularea ar selecta)
    if(cel&&ev.button===0&&(ev.ctrlKey||ev.metaKey))nota(xl,'În Excel, Ctrl+clic adaugă celula la selecție (mai multe zone deodată). Foaia de aici ține o singură zonă, iar lecția nu are nevoie de asta.');
    if(cel&&ev.pointerType==='touch'){deget={xl,id:ev.pointerId,ultima:cel.dataset.a};try{cel.releasePointerCapture(ev.pointerId)}catch(e){}}},true);
  body.addEventListener('pointermove',ev=>{if(ev._xp||!deget||ev.pointerId!==deget.id)return;ev.stopPropagation();
    const el=document.elementFromPoint(ev.clientX,ev.clientY),t=el&&el.closest&&el.closest('td[data-a]');
    if(t&&wrapDe(t)===deget.xl&&t.dataset.a!==deget.ultima){deget.ultima=t.dataset.a;pe(t,'pointermove')}},true);
  const gataDeget=ev=>{if(!deget||ev.pointerId!==deget.id)return;const d=deget;deget=null;
    if(!(ev.target&&ev.target.closest&&grid(d.xl)&&grid(d.xl).contains(ev.target)))pe(grid(d.xl),'pointerup')};
  document.addEventListener('pointerup',gataDeget,true);document.addEventListener('pointercancel',gataDeget,true);
  body.addEventListener('pointerup',ev=>{if(!ev._xp&&ev.button===2&&xlDin(ev))ev.stopPropagation()},true);
  body.addEventListener('contextmenu',ev=>{const xl=xlDin(ev);if(!xl)return;ev.preventDefault();ev.stopPropagation();if(!eGata(xl))return;
    const rt=ev.target.getBoundingClientRect();
    const x=bun(ev.clientX)?ev.clientX:rt.left+rt.width/2,y=bun(ev.clientY)?ev.clientY:rt.bottom,cel=ev.target.closest('td[data-a]'),th=ev.target.closest('th');
    if(cel){if(!(cel.classList.contains('act')||cel.classList.contains('z')))selecteaza(xl,cel.dataset.a);meniu(xl,x,y,itemiCelula(xl));return}
    if(th){const h=antet(th),D=dim(xl),z=zona(xl);
      if(h.tip==='tot'){selecteazaAntet(xl,h);meniu(xl,x,y,itemiCelula(xl));return}
      const inZ=h.tip==='rand'?randuriIntregi(z,D)&&h.i>=z.r1&&h.i<=z.r2:coloaneIntregi(z,D)&&h.i>=z.c1&&h.i<=z.c2;
      if(!inZ)selecteazaAntet(xl,h,false);meniu(xl,x,y,itemiAntet(xl,h.tip))}},true);
  body.addEventListener('keydown',ev=>{if(ev._xp)return;const g=ev.target&&ev.target.closest&&ev.target.closest('.gw');if(!g)return;const xl=wrapDe(g);if(!xl)return;
    if(!eGata(xl))return;const k=ev.key,kk=k.toLowerCase(),ctrl=ev.ctrlKey||ev.metaKey,stop=()=>{ev.preventDefault();ev.stopPropagation()};
    if(ctrl&&kk==='c'&&!ev.shiftKey){xl._taiat=false;return}          // foaia copiază; ținem minte doar că e copiere
    if(ctrl&&kk==='x'){xl._taiat=true;return}
    if(ctrl&&kk==='v'){stop();lipeste(xl,false,false);return}
    if(k==='Enter'&&!ctrl&&!ev.shiftKey&&!ev.altKey&&areCopie(xl)){stop();lipeste(xl,false,true);return}   // Enter după copiere = lipește
    if(k==='Delete'&&!ctrl){if(areCopie(xl)){stop();goleste(xl)}return}                                     // golirea oprește copierea
    if(k==='Backspace'&&!ctrl){const z=zona(xl);if(z&&(z.c1!==z.c2||z.r1!==z.r2)){stop();opresteCopierea(xl);selecteaza(xl,adr(z.act.c,z.act.r));tasta(xl,'Backspace')}return}   // doar celula activă
    if(k==='ContextMenu'||(k==='F10'&&ev.shiftKey)){stop();const a=xl.querySelector('.gw td.act'),r=(a||g).getBoundingClientRect();meniu(xl,r.left+r.width/2,r.bottom,itemiCelula(xl));return}
    if(ctrl&&(k==='-'||k==='Subtract')){stop();const z=zona(xl),D=dim(xl);if(!z)return;
      if(randuriIntregi(z,D))stergeRanduri(xl,z.r1,z.r2);else if(coloaneIntregi(z,D))stergeColoane(xl,z.c1,z.c2);else dialogSterge(xl);return}
    if(k===' '&&(ev.shiftKey!==ctrl)){stop();const z=zona(xl),D=dim(xl);if(!z)return;
      if(ev.shiftKey)selZ(xl,{c1:0,c2:D.cols-1,r1:z.r1,r2:z.r2});else selZ(xl,{c1:z.c1,c2:z.c2,r1:0,r2:D.rows-1})}},true);
  body.addEventListener('click',ev=>{const t=ev.target;if(!t||!t.closest)return;const xl=wrapDe(t);if(!xl)return;
    const th=t.closest('.gw th');
    if(th&&xl._tip==='touch'&&eGata(xl)){ev.stopPropagation();selecteazaAntet(xl,antet(th),false);return}
    const b=t.closest('[data-nesim]');
    if(b){const id=b.getAttribute('data-nesim'),r=b.getBoundingClientRect(),sus=susPeButon(b,ev),sag=!!t.closest('.pg-sag');
      const f={Paste:()=>{if(sus)lipeste(xl,true);else meniu(xl,r.left,r.bottom+2,itemiPaste(xl))},
        Cut:()=>taie(xl,true),Copy:()=>{if(sag)meniu(xl,r.left,r.bottom+2,itemiCopy(xl));else copiaza(xl,true)},
        CellsDeleteSmart:()=>{if(sus)stergeDirect(xl);else meniu(xl,r.left,r.bottom+2,itemiStergere(xl))},
        ClearMenu:()=>meniu(xl,r.left,r.bottom+2,itemiGolire(xl))}[id];
      if(f){ev.stopPropagation();ev.preventDefault();nota(xl,'');f()}return}
    const nb=t.closest('.nb');if(nb&&!nb.querySelector('input')&&eGata(xl))scrieInCaseta(xl,nb)},true);
}

/* ---- testele numite ale atelierului: se bifează singure, după ce e acum în foaie ---- */
function teste(body,Q,w){const box=document.createElement('div');box.className='xp-teste';box.setAttribute('aria-live','polite');body.insertBefore(box,w);
  const f=()=>{const xl=w.querySelector('.xl');if(!xl)return;const val={};xl.querySelectorAll('.gw td[data-a]').forEach(t=>val[t.dataset.a]=t.textContent.trim());
    const toate=Object.values(val).map(x=>x.toLowerCase()),eq=(x,y)=>String(x??'').trim().toLowerCase()===String(y).trim().toLowerCase();
    const rez=Q.teste.map(T=>({ce:T.ce,ok:Object.entries(T.valori||{}).every(([a,v])=>eq(val[a],v))&&(T.gol||[]).every(a=>!val[a])&&(T.fara||[]).every(x=>!toate.includes(String(x).toLowerCase()))&&(!T.tip||Tipuri.testeOk(body,T.tip))}));
    const n=rez.filter(x=>x.ok).length;
    box.innerHTML=`<div class="lbl">Testele atelierului: ${n} din ${rez.length} gata</div><ul>${rez.map(x=>`<li class="${x.ok?'ok':''}"><span aria-hidden="true">${x.ok?'✔':'○'}</span>${x.ce}<span class="xp-sr">${x.ok?' (gata)':' (încă nu)'}</span></li>`).join('')}</ul>`};
  f();new MutationObserver(f).observe(w,{childList:true,subtree:true,characterData:true})}

const TEL='Pe telefon: <b>tragi cu degetul</b> peste celule ca să selectezi o zonă; <b>ții degetul apăsat</b> pe o celulă sau pe numărul unui rând în loc de clic dreapta. Pagina o derulezi trăgând de numerele rândurilor sau de textul de deasupra foii. Ca să <b>scrii</b> într-o celulă: o atingi, apoi atingi bara de formule (câmpul de lângă <i>fx</i>) și scrii; Enter (↵) pe tastatura telefonului confirmă. În loc de Ctrl+Z atingi ↶, sus.';
function render(Q,body,api){css();corecteazaPanglica();
  if(!window.JocExcel){body.innerHTML='<p class="toast">Foaia Excel nu s-a încărcat. Reîncarcă pagina.</p>';return}
  /* doarMouse: Verifică cere ca Copiere și Lipire să fi fost date din meniu sau din panglică */
  const api2=!Q.doarMouse?api:Object.assign({},api,{checkButton:(fn,l)=>api.checkButton(()=>{const w=body.querySelector('#xwrap');
    if(w&&!(w._mc&&w._mp)){api.resolve(false,'De data asta dă comenzile cu mouse-ul: clic dreapta pe zonă › Copiere (Copy), apoi clic dreapta pe celula nouă › Lipire (Paste), sau butoanele din fila Pornire (Home).');return}fn()},l)});
  Tipuri.render(Q.variante?Q:Object.assign({},Q,{_practica:true}),body,api2);
  leaga(body);const w=body.querySelector('#xwrap');if(!w)return;
  ajusteaza(w);new MutationObserver(()=>ajusteaza(w)).observe(w,{childList:true});
  if(Q.teste)teste(body,Q,w);
  try{if(matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0){const n=document.createElement('p');n.className='xp-tel';n.innerHTML=TEL;body.insertBefore(n,w)}}catch(e){}}
const rezolva=(Q,body,api)=>{const w=body.querySelector('#xwrap');if(w&&Q.doarMouse){w._mc=w._mp=1}return Tipuri.rezolva(Q,body,api)};
const gresit=(Q,body,api)=>Tipuri.gresit(Q,body,api);
return {render,rezolva,gresit};
})();

window.ExcelX=ExcelPlus;window.ExcelTipuri=Tipuri;
})();
