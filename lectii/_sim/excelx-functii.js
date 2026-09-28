/* lectii/_sim/excelx-functii.js — extensia „funcții: SUM, AVERAGE, MAX, MIN și Însumare automată (AutoSum)” a foii excelx
   (lecția VIII / M2 / nr. 8). PROPRIETAR: autorul lecției VIII/8. Nu schimbă excelx.js (al lecției 5), excelx-formule.js
   (al lecției 7) și nici motorul (_motor/tip-foaie.js, tip-excel.js, ui-panglica.js).
   ÎNCĂRCARE (după excelx.js și excelx-formule.js): <script src="../../_sim/excelx-functii.js"></script>, apoi
   tipuri:{excelx:ExcelFn}.
   FAPTELE vin din Excel-ul REAL (Microsoft 365, interfața în engleză, setări regionale românești), nu din memorie:
   lectii/viii/m2-l08/_proba/proba_excel.json (FormulaLocal, instanță nouă și invizibilă) și proba_ascuns*.json (tastare
   pe un desktop ascuns; butonul Însumare automată dat prin comanda panglicii, CommandBars.ExecuteMso, cu bara de formule
   citită prin UI Automation; lista ▾ deschisă prin UI Automation).

   CE ADAUGĂ (regula fidelității, jocuri/README.md §1):
   1. ÎNSUMAREA AUTOMATĂ (butonul Σ, idMso AutoSum, pe filele Pornire/Home și Formule/Formulas), ca în Excel:
      - butonul e „despărțit”: Σ = Sumă; săgeata ▾ = lista Sumă (Sum), Medie (Average), Contorizare numere (Count
        Numbers), Max, Min, Mai multe funcții… (More Functions…), în ordinea din Excel (cap_panglica_home_lista.png);
      - O CELULĂ aleasă: Excel scrie =SUM( și o zonă aleasă singur, apoi așteaptă Enter. Zona = numerele de DEASUPRA,
        urcând până la primul text sau prima celulă goală; celulele goale de imediat deasupra intră și ele. Probat:
        B7 sub notele B2:B6 (antet text în B1) -> =SUM(B2:B6); B8 sub un total din B7 -> =AVERAGE(B2:B7) (prinde și
        totalul!); B9 -> =MAX(B2:B8); B7 cu B4 goală -> =SUM(B5:B6); B8 cu B7 goală -> =SUM(B5:B7); anul 2026 în antet
        -> =SUM(B1:B4). Fără numere deasupra: rândul din STÂNGA (E2 -> =SUM(B2:D2)). Deasupra doar formule, iar în stânga
        numere -> stânga (E3 -> =SUM(B3:D3)). Nimic în jur -> =SUM() cu cursorul între paranteze;
      - zona propusă e SELECTATĂ în formulă: ce scrii o înlocuiește (probat: B2:B6 scris peste B2:B7 -> =AVERAGE(B2:B6));
        un clic sau o tragere peste celule pune altă zonă în locul ei;
      - o ZONĂ selectată înainte: rezultatul se scrie direct, fără Enter, sub fiecare coloană (B2:B6 -> B7; B2:B7 cu B7
        goală -> B7; B2:D3 -> B4:D4), iar selecția cuprinde apoi și rezultatele (B2:B7, B2:D4), ca în Excel;
      - Alt+= face același lucru ca Σ (scurtătura Excel-ului, scrisă și în sfatul butonului);
      - cât scrii o formulă, butonul nu face nimic (în Excel, panglica e gri cât scrii).
   2. Lista de funcții de sub celulă (când scrii =SU, =MA…) are ordinea din Excel (probat: =SU -> SUBSTITUTE, SUBTOTAL,
      SUM…; =MA -> MATCH, MAX…; =MI -> MID, MIN…; =AV -> AVEDEV, AVERAGE…): Tab alege PRIMA din listă, ca în Excel. Funcțiile
      adăugate doar ca nume (MATCH, SUBSTITUTE…) nu se calculează aici: foaia spune asta, nu arată #NAME?.
   3. =SUM B2:B6 (fără paranteză) și =SUM (B2:B6) (spațiu înaintea parantezei): Excel NU le primește așa; propune
      corectura =SUM(B2:B6) („We found a typo…”, Yes/No; la No: #NAME?). Probat tastat, cu alertele pornite
      (proba_ascuns.json „dialog”, proba_ascuns_spatiu.json). Foaia arată fereastra de problemă și spune ce ar propune Excel.
   4. Verificarea că elevul a folosit FUNCȚIA cerută: verifica.functie={B7:'SUM'} (la Verifică) și testele numite
      teste:[{ce, formule, functie, umple}] (se bifează pe loc; umple = copiat cu mânerul de umplere).
   5. Eticheta butonului mare din fila Formule e „AutoSum”, ca pe ecranul Excel (dump-ul panglicii avea numele „Sum”).
   (după judecătorul lecției 8, 28.09.2026, lectii/viii/m2-l08/_verificare/judecator.md)
   6. Pătrățelul de umplere pe ecranul tactil: zonă de apucare de 36 × 36 px (desenul rămâne 9 × 9 px); lângă el,
      atingerea nu derulează pagina. Dublu clic pe pătrățel: nota „apucă pătrățelul și trage-l”.
   7. Σ (Sumă) sub un total făcut cu SUM propune doar totalul: =SUM(B7) (probat de judecător); Medie/Max/Min urcă peste el.
   8. Enter/Tab pe =SUM (B2:B6) sau =SUM B2:B6: fereastra „Microsoft Excel” cu Yes (corectura) / No (rămâne, #NAME?),
      la FIECARE Enter/Tab, și după un No; ✕ și Esc fac ce face No (judecătorul 2, n1). Σ (Sumă) urcă doar până sub
      ultimul total făcut cu SUM: B9 sub =MAX și =SUM -> =SUM(B8) (n2);
      pe o formulă care își cuprinde celula: fereastra referinței circulare (OK), apoi 0; zona scrisă invers (B6:B2)
      devine B2:B6 după Enter. Toate probate în Excel real de judecător (_verificare/j_excel_ascuns.json).
   9. Nota de sub panglică are textul din CSS și foaia nu e ancoră de derulare (salturile paginii la tragere).
   NU FACE (spus în lectii/viii/m2-l08/surse.md): o singură anulare pentru toate rezultatele unei zone (aici câte una pe
   celulă); regulile rare ale Excel-ului pentru zona propusă (mai multe subtotaluri SUM nelipite); forma de dată a
   rezultatului când prima celulă a zonei e o dată; copierea la dublu clic pe pătrățel; Mai multe funcții… (Insert
   Function) și Contorizare numere se văd în listă, dar prima doar spune că în lecție nu o folosim.
   Global: window.ExcelFn (tipul), window.ExcelFunctii ({zonaAuto} pentru probe). */
(function(){
'use strict';
const J=window.JocFoaie,JE=window.JocExcel;
const COL=i=>{let s='';for(let n=i+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s};
const pos=a=>{const m=String(a).replace(/\$/g,'').toUpperCase().match(/^([A-Z]{1,3})(\d+)$/);return m?{c:m[1].split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1,r:Number(m[2])-1}:null};
const adr=(c,r)=>COL(c)+(r+1);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function FE(msg,show){const e=new Error(msg);e.show=show;return e}

/* ---------- 2. lista de funcții în ordinea Excel-ului ---------- */
const DOAR_NUME={SUBSTITUTE:[['text','old_text','new_text','[instance_num]'],'înlocuiește o bucată de text'],
  SUBTOTAL:[['function_num','ref1','…'],'un subtotal (suma, media… unei zone)'],SUMIFS:[['sum_range','criteria_range1','criteria1','…'],'adună ce îndeplinește mai multe condiții'],
  SUMPRODUCT:[['array1','[array2]','…'],'suma produselor'],SUMSQ:[['number1','[number2]','…'],'suma pătratelor'],
  SUMX2MY2:[['array_x','array_y'],'o sumă de pătrate (statistică)'],SUMX2PY2:[['array_x','array_y'],'o sumă de pătrate (statistică)'],SUMXMY2:[['array_x','array_y'],'o sumă de pătrate (statistică)'],
  AVEDEV:[['number1','[number2]','…'],'abaterea medie (statistică)'],AVERAGEA:[['value1','[value2]','…'],'media, socotind și textul ca 0'],
  AVERAGEIFS:[['average_range','criteria_range1','criteria1','…'],'media pentru mai multe condiții'],
  MATCH:[['lookup_value','lookup_array','[match_type]'],'poziția unei valori într-o listă'],MAXA:[['value1','[value2]','…'],'maximul, socotind și textul'],
  MAXIFS:[['max_range','criteria_range1','criteria1','…'],'maximul pentru o condiție'],MINA:[['value1','[value2]','…'],'minimul, socotind și textul'],
  MINIFS:[['min_range','criteria_range1','criteria1','…'],'minimul pentru o condiție'],MINUTE:[['serial_number'],'minutul dintr-o oră'],
  MINVERSE:[['array'],'inversa unei matrice'],MIRR:[['values','finance_rate','reinvest_rate'],'o dobândă (finanțe)'],
  MIDB:[['text','start_num','num_bytes'],'o bucată din mijlocul unui text'],SEARCH:[['find_text','within_text','[start_num]'],'caută un text în alt text'],
  ABS:null,ACCRINT:[['issue','first_interest','settlement','rate','par','frequency','[basis]','[calc_method]'],'dobânda (finanțe)']};
if(JE&&JE.FUNC&&!JE.FUNC._l08){const F=JE.FUNC;
  Object.entries(DOAR_NUME).forEach(([k,v])=>{if(v&&!F[k])F[k]=v});
  const toate=Object.keys(F).sort().map(k=>[k,F[k]]);toate.forEach(([k])=>delete F[k]);toate.forEach(([k,v])=>F[k]=v);
  Object.defineProperty(F,'_l08',{value:true,enumerable:false})}
const NUMAI_NUME=new Set(Object.keys(DOAR_NUME).filter(k=>DOAR_NUME[k]&&!['ABS'].includes(k)));

/* ---------- 3. evaluarea: =SUM B2:B6 și funcțiile doar cu nume ---------- */
const FN4=['SUM','AVERAGE','MAX','MIN','COUNT'];
/* formulele cu greșeala de tipar la care elevul a răspuns No (sau ✕ / Esc) în fereastra „We found a typo…”: rămân scrise
   așa și arată #NAME?, ca în Excel; fereastra apare totuși la FIECARE Enter/Tab pe o astfel de formulă (n1) (probat de judecător: j_excel_ascuns.json, T_spatiu_No, T_fara_paranteza_No) */
const CU_NO=new Set();
const cheieNo=f=>String(f).replace(/"[^"]*"?/g,'""').toUpperCase().replace(/\s+/g,' ').trim();
/* corectura pe care o propune Excel pentru =SUM B2:B6 și =SUM (B2:B6), sau null */
function corectura(formula){
  if(typeof formula!=='string'||!formula.startsWith('='))return null;
  const s=formula.slice(1);let m;
  if((m=s.match(/^\s*([A-Za-z]+)\s+(\$?[A-Za-z]{1,3}\$?\d+(?:\s*:\s*\$?[A-Za-z]{1,3}\$?\d+)?)\s*$/))&&FN4.includes(m[1].toUpperCase()))
    return '='+m[1]+'('+m[2].replace(/\s/g,'')+')';
  const sp=s.replace(/"[^"]*"?/g,'""').match(/(^|[^A-Za-z0-9_.])([A-Za-z][A-Za-z0-9.]*)\s+\(/);
  if(sp&&JE&&JE.FUNC&&JE.FUNC[sp[2].toUpperCase()])return '='+s.replace(new RegExp('('+sp[2]+')\\s+\\(','i'),'$1(');
  return null}
if(J&&!J._functiiL08){
  const orig=J.evaluate;
  J.evaluate=function(formula,get){
    if(typeof formula==='string'&&formula.startsWith('=')){
      if(CU_NO.has(cheieNo(formula)))throw FE('Excel nu cunoaște numele scris așa: după numele funcției vine paranteza, fără spațiu, de exemplu =SUM(B2:B6).','#NAME?');
      const s=formula.slice(1).replace(/"[^"]*"?/g,'""');let m;
      if((m=s.match(/^\s*([A-Za-z]+)\s+(\$?[A-Za-z]{1,3}\$?\d+(?:\s*:\s*\$?[A-Za-z]{1,3}\$?\d+)?)\s*$/))&&FN4.includes(m[1].toUpperCase())){
        const f=m[1].toUpperCase(),z=m[2].replace(/\s/g,'').toUpperCase();
        throw FE(`După numele funcției vine paranteza: =${f}(${z}). Excel-ul adevărat îți arată aici fereastra „We found a typo in your formula…” și îți propune corectura =${f}(${z}); o primești cu Yes.`,'⚠')}
      // spațiu între nume și paranteză (=SUM (B2:B6)): Excel propune corectura =SUM(B2:B6); la No arată #NAME? (probat, tastat)
      const sp=s.match(/(^|[^A-Za-z0-9_.])([A-Za-z][A-Za-z0-9.]*)\s+\(/);
      if(sp&&JE&&JE.FUNC&&JE.FUNC[sp[2].toUpperCase()]){const f=sp[2].toUpperCase();
        const cor='='+formula.slice(1).replace(new RegExp('('+sp[2]+')\\s+\\(','i'),'$1(');
        throw FE(`Între numele funcției și paranteză nu se lasă spațiu: ${f}(…). Excel-ul adevărat îți arată aici fereastra „We found a typo in your formula…” și îți propune corectura ${cor}; o primești cu Yes (cu No, celula arată #NAME?).`,'⚠')}
      const re=/([A-Za-z][A-Za-z0-9.]*)\s*\(/g;
      while((m=re.exec(s))){const n=m[1].toUpperCase();
        if(NUMAI_NUME.has(n))throw FE(`Funcția ${n} există în Excel, dar foaia de aici nu o calculează: azi lucrăm cu SUM, AVERAGE, MAX și MIN. Dacă ai ales-o din listă cu Tab, șterge și scrie numele întreg, de exemplu =SUM(.`,'⚠')}
    }
    return orig.call(this,formula,get);
  };
  J._functiiL08=true;
}

/* ---------- valorile foii (pentru zona propusă și pentru teste) ---------- */
const val=(RAW,a)=>{try{return window.ExcelFormule?window.ExcelFormule.valoare(RAW,a):RAW[a]}catch(e){return '#'}};
function felul(RAW,c,r){const a=adr(c,r),raw=RAW[a];
  if(raw==null||raw==='')return 'gol';
  const v=val(RAW,a);if(typeof v==='number')return typeof raw==='string'&&raw[0]==='='?'formula':'numar';
  return 'text'}
/* ---------- 1. zona propusă de Însumare automată, ca în Excel ---------- */
/* într-o direcție (sus: dc=0, dr=-1; stânga: dc=-1, dr=0): sar peste celulele goale de lângă celula aleasă, apoi iau
   numerele (și formulele cu rezultat număr) până la primul text sau prima celulă goală */
function peDirectie(RAW,c,r,dc,dr){
  const k=(i)=>felul(RAW,c+dc*i,r+dr*i),in_=i=>c+dc*i>=0&&r+dr*i>=0;
  let i=1;while(in_(i)&&k(i)==='gol')i++;
  if(!in_(i)||k(i)==='text'||k(i)==='gol')return null;
  let doarF=k(i)==='formula';
  while(in_(i+1)&&(k(i+1)==='numar'||k(i+1)==='formula')){i++;if(k(i)==='numar')doarF=false}
  const a=adr(c+dc*i,r+dr*i),b=adr(c+dc,r+dr);
  return {zt:a===b?a:a+':'+b,doarF}}
/* Σ (Sumă) sub un TOTAL făcut cu SUM: Excel propune doar totalul (sau totalurile SUM lipite, de deasupra), nu și numerele
   de sub ele: B8 sub =SUM(B2:B6) -> =SUM(B7) (probat de judecător de două ori, j_excel_ascuns*.json
   „sub_total_SUM_propunere”, „B8_sigma_greseala_propunere”). Medie, Max, Min urcă peste total (probat: =AVERAGE(B2:B7)). */
const eSuma=raw=>typeof raw==='string'&&/^=\s*SUM\s*\(/i.test(raw);
function subtotaluri(RAW,c,r,dc,dr){
  const in_=i=>c+dc*i>=0&&r+dr*i>=0;let i=1;
  while(in_(i)&&felul(RAW,c+dc*i,r+dr*i)==='gol')i++;
  if(!in_(i)||!eSuma(RAW[adr(c+dc*i,r+dr*i)]))return null;
  const j=i;while(in_(i+1)&&eSuma(RAW[adr(c+dc*(i+1),r+dr*(i+1))]))i++;
  const a=adr(c+dc*i,r+dr*i),b=adr(c+dc*j,r+dr*j);return a===b?a:a+':'+b}
/* n2 (judecătorul 2): Σ (Sumă) urcă doar până SUB ultimul total făcut cu SUM: B9 sub =MAX în B8 și =SUM în B7 -> =SUM(B8)
   (Excel real, _verificare/j_excel_ascuns_trecerea2.json „m1_B9_sigma_sub_MAX_si_SUM”); fără SUM deasupra, urcă peste formule
   (B8 sub =MAX în B7 -> =SUM(B2:B7)). */
function panaLaSuma(RAW,c,r,dc,dr,z){if(!z)return z;
  const [a]=z.zt.split(':').map(pos);const n=dc?c-a.c:r-a.r;
  for(let i=2;i<=n;i++){if(eSuma(RAW[adr(c+dc*i,r+dr*i)])){const x=adr(c+dc*(i-1),r+dr*(i-1)),y=adr(c+dc,r+dr);return {zt:x===y?x:x+':'+y,doarF:z.doarF}}}
  return z}
function zonaAuto(RAW,c,r,fn){
  if(!fn||fn==='SUM'){const t=subtotaluri(RAW,c,r,0,-1);if(t)return t}
  let sus=peDirectie(RAW,c,r,0,-1),st=peDirectie(RAW,c,r,-1,0);
  if(!fn||fn==='SUM'){sus=panaLaSuma(RAW,c,r,0,-1,sus);st=panaLaSuma(RAW,c,r,-1,0,st)}
  const z=sus&&st?(sus.doarF&&!st.doarF?st:sus):(sus||st);
  return z?z.zt:''}

/* ---------- starea foii de pe pagină ---------- */
const wrap=body=>body.querySelector('#xwrap');
const grid=body=>body.querySelector('#xgw');
const fx=body=>body.querySelector('#xfx');
function selectia(body){const w=wrap(body);if(!w)return null;let c1=1e9,c2=-1,r1=1e9,r2=-1;
  w.querySelectorAll('.gw td.act, .gw td.z').forEach(t=>{const p=pos(t.dataset.a);if(!p)return;c1=Math.min(c1,p.c);c2=Math.max(c2,p.c);r1=Math.min(r1,p.r);r2=Math.max(r2,p.r)});
  if(c2<0)return null;const a=w.querySelector('.gw td.act');return {c1,c2,r1,r2,act:a?pos(a.dataset.a):{c:c1,r:r1}}}
const dim=body=>{const w=wrap(body);return {cols:w.querySelectorAll('.gw thead th').length-1,rows:w.querySelectorAll('.gw tbody tr').length}};
const inScriere=body=>{const s=wrap(body)&&wrap(body).querySelector('.st span');return !!s&&!/^Gata/.test(s.textContent)};
function nota(body,html){const w=wrap(body);if(!w)return;let n=w.nextElementSibling;
  if(!n||!n.classList.contains('xp-nota')){n=document.createElement('div');n.className='xp-nota';n.setAttribute('aria-live','polite');w.after(n)}n.innerHTML=html||''}
function tasta(el,key,o){if(!el)return;try{el.focus({preventScroll:true})}catch(e){}const e=new KeyboardEvent('keydown',Object.assign({key,bubbles:true,cancelable:true},o||{}));e._xfn=1;el.dispatchEvent(e)}
function scrieInBara(body,text,s,e){const i=fx(body);if(!i)return;i.value=text;try{i.setSelectionRange(s,s)}catch(x){}
  const ev=new Event('input',{bubbles:true});ev._xfn=1;i.dispatchEvent(ev);try{i.setSelectionRange(s,e)}catch(x){}}
function furnici(body,zt){const w=wrap(body);if(!w)return;w.querySelectorAll('.gw td.xfn-z').forEach(t=>t.classList.remove('xfn-z'));
  if(!zt)return;const [a,b]=zt.split(':').map(pos);const B=b||a;
  for(let c=a.c;c<=B.c;c++)for(let r=a.r;r<=B.r;r++){const t=w.querySelector(`.gw td[data-a="${adr(c,r)}"]`);if(t)t.classList.add('xfn-z')}}

/* Σ pe o celulă: formula în scriere, cu zona selectată în bara de formule */
function propune(body,S,fn){
  const z=selectia(body);if(!z)return;const a=z.act;
  const zt=zonaAuto(S.RAW,a.c,a.r,fn);const text=`=${fn}(${zt})`;
  S.setAct(adr(a.c,a.r));S.draw();
  tasta(grid(body),'=');                                   // foaia intră în scriere (modul Introducere), ca la tastare
  const st=fn.length+2;scrieInBara(body,text,zt?st:st,zt?st+zt.length:st);
  body._xfnProp=zt?{s:st,e:st+zt.length}:null;furnici(body,zt);S.gest.add('autosum');
}
/* Σ pe o zonă: rezultatele se scriu direct (fără Enter), sub fiecare coloană (sau în dreapta unui rând) */
function directPeZona(body,S,fn,z){
  const D=dim(body),RAW=S.RAW,gol=(c,r)=>RAW[adr(c,r)]==null||RAW[adr(c,r)]==='';
  const tinte=[];
  if(z.r2>z.r1||z.c1===z.c2){   // coloane
    const ultimGol=[...Array(z.c2-z.c1+1)].every((_,k)=>gol(z.c1+k,z.r2));
    for(let c=z.c1;c<=z.c2;c++){const r=ultimGol&&z.r2>z.r1?z.r2:z.r2+1,r2=ultimGol&&z.r2>z.r1?z.r2-1:z.r2;
      if(r<D.rows)tinte.push({a:adr(c,r),f:`=${fn}(${adr(c,z.r1)}:${adr(c,r2)})`})}
  }else{   // un singur rând, mai multe coloane
    const ultimGol=gol(z.c2,z.r1),c=ultimGol?z.c2:z.c2+1,c2=ultimGol?z.c2-1:z.c2;
    if(c<D.cols)tinte.push({a:adr(c,z.r1),f:`=${fn}(${adr(z.c1,z.r1)}:${adr(c2,z.r1)})`})}
  if(!tinte.length){nota(body,'Excel ar scrie rezultatul în afara foii de aici. Alege o celulă sub numere și apasă din nou pe Σ.');return}
  const sel0=adr(z.c1,z.r1);let c2=z.c2,r2=z.r2;
  for(const t of tinte){S.setAct(t.a);S.draw();tasta(grid(body),'=');scrieInBara(body,t.f,t.f.length,t.f.length);tasta(fx(body),'Enter');
    const p=pos(t.a);c2=Math.max(c2,p.c);r2=Math.max(r2,p.r)}
  S.setZona(sel0+':'+adr(c2,r2));S.draw();S.gest.add('autosum');
  try{const g=grid(body);if(g)g.focus({preventScroll:true})}catch(e){}
}
function autoSum(body,fn){
  const S=body._xfnS;if(!S||!wrap(body))return;
  if(inScriere(body)){nota(body,'Cât scrii în celulă, butonul Σ nu face nimic (în Excel e gri). Termină cu Enter sau renunță cu Esc.');return}
  nota(body,'');const z=selectia(body);if(!z)return;
  if(z.c1===z.c2&&z.r1===z.r2)propune(body,S,fn);else directPeZona(body,S,fn,z)}

/* ---------- lista ▾ ---------- */
let M=null;
function inchide(){if(M){M.remove();M=null}}
function lista(body,x,y){inchide();
  const it=[['Σ Sumă (Sum)','SUM'],['Medie (Average)','AVERAGE'],['Contorizare numere (Count Numbers)','COUNT'],['Max','MAX'],['Min','MIN'],['-'],['Mai multe funcții… (More Functions…)','']];
  const m=document.createElement('div');m.className='xp-meniu xfn-meniu';m.setAttribute('role','menu');m.setAttribute('aria-label','Însumare automată (AutoSum)');
  m.innerHTML=it.map((x,i)=>x[0]==='-'?'<hr>':`<button type="button" role="menuitem" data-i="${i}">${esc(x[0])}</button>`).join('');
  document.body.appendChild(m);M=m;const r=m.getBoundingClientRect();
  m.style.left=Math.max(4,Math.min(x,innerWidth-r.width-4))+'px';m.style.top=Math.max(4,Math.min(y,innerHeight-r.height-4))+'px';
  m.querySelectorAll('button[data-i]').forEach(b=>b.addEventListener('click',ev=>{ev.stopPropagation();const f=it[+b.dataset.i][1];inchide();
    if(!f){nota(body,'„Mai multe funcții… (More Functions…)” deschide în Excel fereastra Inserare funcție (Insert Function). Azi nu o folosim: scrii funcția sau o alegi din listă.');return}
    autoSum(body,f)}));
  const f=m.querySelector('button');if(f)try{f.focus({preventScroll:true})}catch(e){}}

/* ---------- legăturile, o dată pe pagină și o dată pe elementul-gazdă ---------- */
let globale=false;
function leaga(body){
  if(!globale){globale=true;
    document.addEventListener('pointerdown',ev=>{if(M&&!M.contains(ev.target))inchide()},true);
    document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&M){inchide();ev.stopPropagation()}},true);
    addEventListener('scroll',()=>{if(M)inchide()},true)}
  if(body._xfnL)return;body._xfnL=1;
  // clic pe butonul Σ: partea de sus / pictograma = Sumă; săgeata ▾ / eticheta = lista (înaintea motorului, care ar
  // face doar SUM, cu altă regulă pentru zonă)
  body.addEventListener('click',ev=>{const b=ev.target&&ev.target.closest&&ev.target.closest('[data-rb="sum"]');if(!b||!body.contains(b))return;
    ev.stopPropagation();ev.preventDefault();const r=b.getBoundingClientRect();
    const sag=b.classList.contains('pg-mare')?(isFinite(ev.clientY)&&ev.clientY>0&&ev.clientY>r.top+r.height/2)
      :(!!ev.target.closest('.pg-sag')||(isFinite(ev.clientX)&&ev.clientX>0&&ev.clientX>r.left+r.width*0.6));
    if(sag){if(inScriere(body)){autoSum(body,'SUM');return}lista(body,r.left,r.bottom+2)}else autoSum(body,'SUM')},true);
  // zona propusă e selectată în bara de formule: un clic / o tragere pe celule o înlocuiește (în loc să scrie lângă ea)
  const inlocuieste=()=>{const i=fx(body);if(!body._xfnProp||!i)return false;const s=i.selectionStart,e=i.selectionEnd;
    if(!(e>s)){body._xfnProp=null;furnici(body,'');return false}
    scrieInBara(body,i.value.slice(0,s)+i.value.slice(e),s,s);body._xfnProp=null;furnici(body,'');return true};
  body.addEventListener('pointerdown',ev=>{if(ev._xp||!body._xfnProp)return;const t=ev.target&&ev.target.closest&&ev.target.closest('.gw td[data-a]');
    if(t&&inScriere(body))inlocuieste()},true);
  body.addEventListener('keydown',ev=>{
    if(ev._xfn)return;const i=fx(body);
    if(ev.target===i&&body._xfnProp){
      if(/^Arrow/.test(ev.key)&&!ev.shiftKey)inlocuieste();                               // săgeata mută adresa, ca în Excel
      else if(ev.key==='Escape'||ev.key==='Enter'||ev.key==='Tab'){body._xfnProp=null;furnici(body,'')}}
    // Alt+= (tasta de lângă Backspace) = Σ, din foaie
    if(ev.altKey&&!ev.ctrlKey&&(ev.key==='='||ev.code==='Equal')&&ev.target&&ev.target.closest&&ev.target.closest('.gw')){ev.preventDefault();ev.stopPropagation();autoSum(body,'SUM')}},true);
  body.addEventListener('input',ev=>{if(ev._xfn)return;if(ev.target===fx(body)){body._xfnProp=null;furnici(body,'')}},true);

  // 6. PĂTRĂȚELUL DE UMPLERE pe ecranul tactil (judecătorul lecției 8, M1): desenul rămâne 9 × 9 px, dar o atingere în
  //    pătratul de 36 × 36 px din jurul lui îl apucă (înainte, 6-8 px pe lângă: nimic copiat sau o zonă selectată).
  //    Atingerea e mutată pe pătrățel; tragerea o duce mai departe foaia (excelx.js: degetul, tip-excel.js: umplerea).
  //    Pătrățelul stă pe marginea foii (la ultima coloană iese pe jumătate din ea), deci ascultăm pe tot documentul.
  if(!window._xfnFH){window._xfnFH=1;
    const langa=(t,x,y)=>{if(t&&t.closest&&t.closest('button,a,input,select,textarea,[data-fh],.pg,.fx'))return null;
      return [...document.querySelectorAll('#xwrap .gw [data-fh]')].find(h=>{const r=h.getBoundingClientRect();
        return r.width&&Math.abs(x-(r.left+r.width/2))<=RAZA_FH&&Math.abs(y-(r.top+r.height/2))<=RAZA_FH})||null};
    // în afara foii, browserul ar începe să DERULEZE pagina (și ar opri tragerea): lângă pătrățel, atingerea nu derulează
    document.addEventListener('touchstart',ev=>{const p=ev.touches&&ev.touches[0];if(p&&ev.touches.length===1&&langa(ev.target,p.clientX,p.clientY))ev.preventDefault()},{capture:true,passive:false});
    document.addEventListener('pointerdown',ev=>{
      if(ev._xp||ev._xfn||ev.pointerType!=='touch')return;
      const h=langa(ev.target,ev.clientX,ev.clientY);
      if(!h)return;
      const r=h.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
      ev.stopPropagation();ev.preventDefault();
      const e=new PointerEvent('pointerdown',{bubbles:true,cancelable:true,composed:true,pointerId:ev.pointerId,pointerType:'touch',isPrimary:true,button:0,buttons:1,clientX:cx,clientY:cy});
      e._xfn=1;h.dispatchEvent(e)},true)}
  // dublu clic pe pătrățel (mouse): foaia nu face nimic la el; o spune, ca elevul să tragă (judecătorul, m6)
  let fhApasat=0;
  body.addEventListener('pointerdown',ev=>{if(ev._xp||ev._xfn||ev.pointerType==='touch')return;
    const h=ev.target&&ev.target.closest&&ev.target.closest('[data-fh]');if(!h||!body.contains(h))return;
    const acum=Date.now();if(acum-fhApasat<450)nota(body,'Dublu clic pe pătrățel nu copiază nimic în foaia de aici: apucă pătrățelul și trage-l până unde vrei.');fhApasat=acum},true);

  // 7. ENTER pe o formulă: fereastra „We found a typo…” cu Yes / No (m4) și cea a referinței circulare (m5), ca în Excel
  body.addEventListener('keydown',ev=>{
    const i=fx(body);if(ev._xfn||ev.target!==i||!(ev.key==='Enter'||ev.key==='Tab')||ev.shiftKey||ev.ctrlKey||ev.altKey)return;
    const text=i.value.trim();if(!text.startsWith('='))return;
    const cor=corectura(text);
    if(cor){ev.preventDefault();ev.stopPropagation();fereastraTypo(body,text,cor,ev.key);return}   // la FIECARE Enter/Tab, și după un No (n1)
    const z=selectia(body);if(z&&seCuprinde(text,z.act.c,z.act.r)){const a=adr(z.act.c,z.act.r);setTimeout(()=>fereastraCirculara(body,a),0)}},true);
}
const RAZA_FH=18;
function dlg(body,html){const d=body.querySelector('#xwrap #xdlg');if(!d)return null;d.innerHTML=html;return d}
function fereastraTypo(body,text,cor,tasta0){
  const d=dlg(body,`<div class="dlg xfn-dlg" role="alertdialog" aria-label="Microsoft Excel"><button type="button" class="xfn-x" data-xfn-x="1" aria-label="Închidere (Close)" title="Închidere (Close)">✕</button><b>Microsoft Excel</b>We found a typo in your formula and tried to correct it to:<br><code>${esc(cor)}</code><br>Do you want to accept this correction?
    <div class="xfn-bt"><button type="button" class="btn primary" data-xfn-da="1">Yes</button><button type="button" class="btn" data-xfn-nu="1">No</button></div>
    <span class="xfn-ro">Pe românește: Excel a găsit o greșeală de tipar și îți propune corectura. <span class="xfn-b">Yes</span> o primește; <span class="xfn-b">No</span> (sau ✕) lasă ce ai scris, iar celula arată #NAME?. După numele funcției vine paranteza, fără spațiu.</span></div>`);
  if(!d)return;
  const gata=(nou,nu)=>{if(nu)CU_NO.add(cheieNo(text));else scrieInBara(body,nou,nou.length,nou.length);tasta(fx(body),tasta0||'Enter')};
  d.querySelector('[data-xfn-da]').onclick=()=>gata(cor,false);d.querySelector('[data-xfn-nu]').onclick=()=>gata(text,true);
  // Esc (ca ✕ în Excel) = No: formula rămâne și celula arată #NAME? (Excel real: j_excel_ascuns_trecerea2b.json „typo_inchidere_X”)
  d.querySelector('[data-xfn-x]').onclick=()=>gata(text,true);
  d.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();gata(text,true)}};
  try{d.querySelector('[data-xfn-da]').focus({preventScroll:true})}catch(e){}}
function fereastraCirculara(body,a){
  const d=dlg(body,`<div class="dlg xfn-dlg" role="alertdialog" aria-label="Microsoft Excel"><b>Microsoft Excel</b>There are one or more circular references where a formula refers to its own cell either directly or indirectly. This might cause them to calculate incorrectly.<br>Try removing or changing these references, or moving the formulas to different cells.
    <div class="xfn-bt"><button type="button" class="btn primary" data-xfn-ok="1">OK</button></div>
    <span class="xfn-ro">Pe românește: formula din ${esc(a)} își cuprinde propria celulă (o <i>referință circulară</i>), deci Excel nu o poate calcula și arată 0. Zona funcției trebuie să se oprească deasupra celulei în care scrii.</span></div>`);
  if(!d)return;
  const b=d.querySelector('[data-xfn-ok]');b.onclick=()=>{d.innerHTML='';try{const g=grid(body);if(g)g.focus({preventScroll:true})}catch(e){}};
  try{b.focus({preventScroll:true})}catch(e){}}
/* formula își cuprinde propria celulă? (adresele și zonele din afara ghilimelelor) */
function seCuprinde(text,c,r){
  const s=text.slice(1).replace(/"[^"]*"?/g,'""');const re=/(\$?[A-Za-z]{1,3}\$?\d+)(?:\s*:\s*(\$?[A-Za-z]{1,3}\$?\d+))?/g;let m;
  while((m=re.exec(s))){if(/[A-Za-z0-9_.]/.test(s[m.index-1]||''))continue;const a=pos(m[1]),b=pos(m[2]||m[1]);if(!a||!b)continue;
    if(c>=Math.min(a.c,b.c)&&c<=Math.max(a.c,b.c)&&r>=Math.min(a.r,b.r)&&r<=Math.max(a.r,b.r))return true}
  return false}
/* 8. zona scrisă invers (=SUM(B6:B2)) devine B2:B6 după Enter, ca în Excel (probat de judecător, tastat; m3) */
function normalizeaza(f){if(typeof f!=='string'||f[0]!=='=')return f;
  return f.replace(/("[^"]*"?)|(\$?)([A-Za-z]{1,3})(\$?)(\d+):(\$?)([A-Za-z]{1,3})(\$?)(\d+)/g,(all,str,d1,c1,d2,r1,d3,c2,d4,r2)=>{
    if(str)return str;const A=pos(c1+r1),B=pos(c2+r2);if(!A||!B||(A.c<=B.c&&A.r<=B.r))return all;
    const [cs,csD]=A.c<=B.c?[c1,d1]:[c2,d3],[ce,ceD]=A.c<=B.c?[c2,d3]:[c1,d1],[rs,rsD]=A.r<=B.r?[r1,d2]:[r2,d4],[re_,reD]=A.r<=B.r?[r2,d4]:[r1,d2];
    return `${csD}${cs.toUpperCase()}${rsD}${rs}:${ceD}${ce.toUpperCase()}${reD}${re_}`})}
function dupaDesen(body,S){if(inScriere(body))return;let sch=false;
  for(const [a,raw] of Object.entries(S.RAW)){const n=normalizeaza(raw);if(n!==raw){S.RAW[a]=n;sch=true}}
  if(sch)S.draw()}

/* ---------- 5. eticheta butonului din fila Formule ---------- */
function corecteaza(){const P=window.PANGLICA_EXCEL;if(!P||P._xfn)return;P._xfn=1;
  (P.file||[]).forEach(f=>(f.grupuri||[]).forEach(g=>(g.butoane||[]).forEach(b=>{if(b.id==='AutoSum')b.eticheta='AutoSum'})))}
addEventListener('panglica-excel',corecteaza);

/* ---------- 4. funcția cerută: la Verifică și în testele numite ---------- */
const areFunctia=(raw,fn)=>typeof raw==='string'&&raw[0]==='='&&new RegExp('(^|[^A-Z0-9_.])'+fn+'\\s*\\(','i').test(raw.replace(/"[^"]*"?/g,'""'));
function lipsaFunctie(S,V){for(const [a,fn] of Object.entries(V||{}))if(!areFunctia(S.RAW[a],fn))return {a,fn};return null}
function eFormulaBuna(RAW,Q,a,f){const raw=RAW[a];
  if(raw==null||!String(raw).startsWith('=')||!/[A-Za-z]{1,3}\$?\d+/.test(raw))return false;
  const V=window.ExcelFormule&&window.ExcelFormule.valoare;if(!V)return false;
  const la=(x,y)=>typeof x==='number'&&typeof y==='number'?Math.abs(x-y)<1e-6:String(x)===String(y);
  const cu=(src,x)=>{try{return V(src,x)}catch(e){return '#'+(e.show||'')}};
  if(!la(cu(RAW,a),cu({...RAW,[a]:f},a)))return false;
  const D={};Object.entries(Q.cells||{}).forEach(([k,v],i)=>{if(typeof v==='number')D[k]=String(v+(i%3+1)*3).replace('.',',')});
  if(!Object.keys(D).length)return true;const X={...RAW,...D};return la(cu(X,a),cu({...X,[a]:f},a))}
function teste(body,Q,S,w){const box=document.createElement('div');box.className='xp-teste';box.setAttribute('aria-live','polite');body.insertBefore(box,w);
  const f=()=>{const rez=Q.teste.map(T=>({ce:T.ce,ok:Object.entries(T.formule||{}).every(([a,fx])=>eFormulaBuna(S.RAW,Q,a,fx))
      &&!lipsaFunctie(S,T.functie)&&(!T.umple||S.gest.has('umple'))}));
    const n=rez.filter(x=>x.ok).length;
    const h=`<div class="lbl">Testele atelierului: ${n} din ${rez.length} gata</div><ul>${rez.map(x=>`<li class="${x.ok?'ok':''}"><span aria-hidden="true">${x.ok?'✔':'○'}</span>${x.ce}<span class="xp-sr">${x.ok?' (gata)':' (încă nu)'}</span></li>`).join('')}</ul>`;
    if(box.innerHTML!==h)box.innerHTML=h};
  f();new MutationObserver(f).observe(w,{childList:true,subtree:true,characterData:true})}

/* Nota de sub panglică: excelx.js (ajusteaza) îi schimbă textul DUPĂ fiecare desen al foii, dintr-un rând în două.
   Cu pagina derulată până jos, pagina se scurta o clipă, browserul o derula ~18 px, iar o tragere pornită atunci
   selecta cu un rând mai puțin (probat: _proba/depanare_salt.py, 1459 -> 1441 px). Aici textul vine din CSS, deci
   înălțimea nu se mai schimbă. CERERE pentru excelx.js: textul pus o singură dată (vezi lectii/viii/m2-l08/surse.md). */
const TXT_ING='Panglica se derulează în lateral: mai la dreapta sunt grupurile Celule (Cells) și Editare (Editing). În Excel-ul de pe calculator o vezi întreagă.';
/* Pe telefon (390 px, pagina cu panglică), la atingerea unei celule, pagina sărea 34 px: în timpul desenului foaia e o
   clipă mai înaltă, iar browserul (ancorarea derulării) muta pagina. Foaia nu mai e ancoră (_proba/depanare_tel.py:
   2677 -> 2643 px înainte, 2677 -> 2677 după; selecția B2:B6 trasă cu degetul ieșea B2:B3). */
const CSS=`#body .xl{overflow-anchor:none}
#body .xl .pg .pg-ingust{font-size:0!important}
#body .xl .pg .pg-ingust::after{content:"${TXT_ING}";font-size:.72rem}
#body .xl .gw td.xfn-z{outline:2px dashed #217346;outline-offset:-3px}
.xfn-meniu{min-width:230px}
.xfn-dlg code{font-family:var(--fm);font-weight:600}
.xfn-dlg .xfn-bt{display:flex;gap:8px;justify-content:flex-end;margin:8px 0 4px}
.xfn-dlg .xfn-bt .btn{min-height:36px;min-width:64px}
.xfn-dlg .xfn-ro{display:block;font-size:.86rem;color:var(--ink2);margin-top:4px}
.xfn-dlg{position:relative}
.xfn-dlg .xfn-b{font-weight:700;color:var(--ink)}
.xfn-dlg .xfn-x{position:absolute;top:2px;right:2px;min-width:36px;min-height:36px;border:0;background:none;color:var(--ink2);font-size:1rem;cursor:pointer}
@media (pointer:coarse){.xfn-meniu button{min-height:40px}}`;
function css(){if(!document.getElementById('xfn-css')){const s=document.createElement('style');s.id='xfn-css';s.textContent=CSS;document.head.appendChild(s)}}

const MESAJ_GEST=/Folosește butonul Σ AutoSum din fila Pornire \(Home\)\./;
const ExcelFn={
  render(Q,body,api){
    css();corecteaza();
    const F=window.ExcelF;if(!F){body.innerHTML='<p class="toast">Foaia Excel nu s-a încărcat. Reîncarcă pagina.</p>';return}
    const V=Q.verifica||{},areT=Array.isArray(Q.teste)&&Q.teste.some(T=>T.functie||T.umple);
    let S=null;
    const api2=Object.assign({},api,{resolve:(ok,msg)=>{
      if(ok&&S&&V.functie){const l=lipsaFunctie(S,V.functie);
        if(l){api.resolve(false,`În ${l.a} rezultatul e bun, dar aici se cere funcția ${l.fn}: scrie =${l.fn}(…) cu zona potrivită${V.gest&&V.gest.includes('autosum')?' (sau folosește butonul Σ)':''}.`);
          api.revealButton(()=>api.giveUp(`în ${l.a} scrii <code>${esc('='+l.fn+'(…)')}</code>, ca în soluția de mai sus.`));return}}
      if(!ok&&typeof msg==='string')msg=msg.replace(MESAJ_GEST,'Folosește butonul Σ, Însumare automată (AutoSum): fila Formule (Formulas), la început, sau fila Pornire (Home), în dreapta.');
      return api.resolve(ok,msg)}});
    F.render(areT?Object.assign({},Q,{teste:undefined}):Q,body,api2);
    S=window.JocExcel&&window.JocExcel.render._stare;body._xfnS=S;body._xfnProp=null;
    leaga(body);const w=wrap(body);
    if(w&&S){dupaDesen(body,S);new MutationObserver(()=>dupaDesen(body,S)).observe(w,{childList:true})}
    if(areT&&w&&S)teste(body,Q,S,w)},
  rezolva(Q,body,api){return window.ExcelF.rezolva(Q,body,api)},
  gresit(Q,body,api){return window.ExcelF.gresit(Q,body,api)}
};
window.ExcelFn=ExcelFn;
window.ExcelFunctii={zonaAuto,areFunctia};
})();
