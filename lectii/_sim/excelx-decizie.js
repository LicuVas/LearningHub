/* lectii/_sim/excelx-decizie.js — extensia „funcția de decizie IF” a foii excelx (lecția VIII / M2 / nr. 9).
   PROPRIETAR: autorul lecției VIII/9. Nu schimbă excelx.js (lecția 5), excelx-formule.js (lecția 7) și nici motorul
   (_motor/tip-foaie.js, tip-excel.js). ÎNCĂRCARE, în ordine: motor.js, tip-foaie.js, tip-excel.js, ../../_sim/excelx.js,
   ../../_sim/excelx-formule.js, ../../_sim/excelx-decizie.js; apoi tipuri:{excelx:ExcelD}.
   Toate faptele de mai jos sunt probate în Excel REAL (Microsoft 365, build 20326, interfața în engleză, setări regionale
   românești: virgulă zecimală, „;” între părți), tastat literă cu literă pe un desktop ascuns, cu alertele PORNITE:
   lectii/viii/m2-l09/_proba/proba_ascuns.json (+ proba_ascunse_2/3/4.json).

   CE ADAUGĂ (regula fidelității, jocuri/README.md §1), prin învelirea lui JocFoaie.evaluate:
   1. =IF(B2>=5;„promovat”;„nepromovat”) (ghilimelele românești „ ”) -> Excel NU primește formula: fereastra „There's a
      problem with this formula” (probat; tot așa =IF(C2=„da”;…) și =IF(B2>=5;„promovat";…)). Foaia din motor arăta #NAME?.
   2. =IF(B2>=5;“promovat”;“nepromovat”) și =IF(B2>=5;”promovat”;”nepromovat”) (ghilimele întoarse, fără „) -> #NAME?,
      fără fereastră (probat). Mesajul spune unde e ghilimeaua dreaptă pe tastatura românească și pe cea englezească.
   3. =IF(B2≥5;…) -> #NAME? (probat); foaia din motor arăta fereastra „semnul ≥”.
   4. =IF(B2=>5;…), =<, ==, != -> Excel propune corectura (>=, <=, =, <>; fereastra „We found a typo…”), iar la No
      nu primește formula (probat). Foaia arată fereastra de problemă și spune ce ar propune Excel. „> =” (cu spațiu): la fel.
   5. =IF(B2>=4.5;…) pe setări românești -> fereastra de problemă, FĂRĂ corectură propusă (probat; la =A2*0.5 din
      lecția 7 Excel propunea una). Mesajul lecției 7 ar fi promis o corectură, deci aici are mesajul lui.
   6. =IF(B2>=5,1,0) și =IF(B2<14,10,20) (virgula ca separator între numere) -> fereastra de problemă (probat); foaia din
      motor le calcula (virgula era luată drept separator când formula n-are niciun „;”).
   7. =IF(B2>=5;"promovat";"nepromovat";"x") (patru părți) -> „You've entered too many arguments for this function.”
      (probat); foaia din motor alegea între primele două.
   8. =IF(B2>=5;promovat;nepromovat) și =IF(C3=da;…) (text fără ghilimele) -> #NAME? (probat), cu mesajul „textul se pune
      între ghilimele drepte” (mesajul lecției 7 vorbea de adrese și de semnele de calcul).
   Ce era deja ca în Excel și rămâne (probat): =DACĂ(…) / =DACA(…) -> #NAME?; paranteza de la sfârșit uitată se pune
   singură; literele mici devin mari; "da"="DA" (fără diferență de litere), " da"≠"da"; celula goală valorează 0; un text
   e „mai mare” decât orice număr; 5 < "5"; IF fără a treia parte -> FALSE; =B2>=5 -> TRUE / FALSE, centrat.
   9. TESTELE numite pe COMPORTAMENT: teste:[{ce, formule:{D2:'=IF(B2<14;10;20)'}, variante:[{B2:14},{B2:13}]}] se bifează
      când celula are o formulă cu adrese care dă rezultatul bun pe datele din foaie ȘI pe fiecare variantă (valorile de la
      limită) ȘI pe datele schimbate automat (+3, +6, +9, regula foii din motor). Textul rezultat se compară fără diacritice
      și fără diferență de litere mari/mici (tastatura din laborator poate fi fără diacritice; Excel afișează ce ai scris).
   REPARAȚIILE după judecătorul lecției 9 (lectii/viii/m2-l09/_verificare/judecator.md; faptele din j_excel_real.json):
   10. adresele cu $ ($B$2, puse și de F4) nu mai sunt luate drept cuvinte necunoscute (M4; Excel: =IF($B$2<14;10;20) -> 10);
   11. o ghilimea fără pereche -> fereastra de problemă, ÎNAINTEA celorlalte verificări (M5; e32 fereastra, e70/e73 corectura
       propusă și, fără ea, formula refuzată);
   12. „> =” / „< =” cu spațiu: mesajul spune că Excel propune > / <, adică pierde egalul (m1, e16);
   13. „IF (” cu spațiu și o paranteză ) în plus -> fereastra (Excel propune corectura; m2, e66, e33); "a""b" e textul a"b
       (m2, e71); o parte goală între două ; valorează 0 (m2, e24);
   14. după „Corect!” foaia rămâne vie (M1), ca elevul să vadă cum se reface decizia când schimbă datele;
   15. semnul greșit la limită (< în loc de <=…): mesajul duce la semn, nu la adrese (M3), fără să spună semnul bun
       (judecătorul 2, n4: la întrebările notate ar fi dat răspunsul); Q.functii / teste[].functii cer
       funcția (SUM, MAX) în celula dată (m3);
   17. (judecătorul 2) părțile goale valorează 0 și la sfârșit / la început (n1); ghilimeaua fără pereche: mesajul nu mai
       spune ce fereastră apare (n2); paranteza închisă prea devreme -> fereastra de problemă (n3, r20).
   16. bara de formule cu autocorrect="off" și, pe ecranele cu atingere, butoane pentru " ; < > = (m10; neprobat pe telefon real).
   NU face (spus în lectii/viii/m2-l09/surse.md): fereastra Yes/No a corecturii propuse; mesajele ferestrelor exact ca în
   Excel (le spune pe scurt, cu numele englezesc); setările englezești (butoanele RO/EN rămân ascunse, ca în excelx).
   Global: window.ExcelD (tipul), window.ExcelDecizie ({valoare(src,a), afisare(src,a)} pentru mini-foile „Uite cum”). */
(function(){
'use strict';
const J=window.JocFoaie;
function FE(msg,show){const e=new Error(msg);e.show=show;return e}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ce e între ghilimele DREPTE nu contează la verificări (e text); o ghilimea neînchisă merge până la capăt */
const faraText=f=>f.replace(/"[^"]*"?/g,'""');
const areIF=f=>/(^|[^A-Za-z0-9_.])IF\s*\(/i.test(faraText(f));
const CUV=/[A-Za-zĂÂÎȘȚăâîșțŞŢşţ_\\][A-Za-z0-9_.ĂÂÎȘȚăâîșțŞŢşţ]*/g;
function eAdresa(t){const m=String(t).replace(/\$/g,'').match(/^([A-Za-z]{1,3})(\d{1,7})$/);if(!m)return false;
  const col=m[1].toUpperCase().split('').reduce((x,c)=>x*26+c.charCodeAt(0)-64,0);return col<=16384&&+m[2]>=1&&+m[2]<=1048576}
const PROBLEMA='Excel nu primește formula (fereastra „There\'s a problem with this formula”). ';
const GHILIMEA_DREAPTA='Ghilimeaua dreaptă ": pe tastatura englezească, Shift + tasta din stânga lui Enter; pe cea românească (tasta aceea scrie ț), Shift + AltGr + aceeași tastă sau, pe unele calculatoare, Shift + 2.';

/* câte părți are fiecare IF( din formulă (despărțite de ; la primul nivel al parantezei lui) */
function partiIF(f){const s=faraText(f),out=[];const re=/(^|[^A-Za-z0-9_.])IF\s*\(/ig;let m;
  while((m=re.exec(s))){let i=m.index+m[0].length,d=1,n=1;
    for(;i<s.length&&d>0;i++){const c=s[i];if(c==='(')d++;else if(c===')')d--;else if(c===';'&&d===1)n++}
    out.push(n)}
  return out}

/* textul dintre ghilimele are voie să conțină o ghilimea, scrisă dublat: "a""b" e textul a"b (probat de judecătorul
   lecției 9, e71: =IF(B2>=5;"promovat""nepromovat") arată promovat"nepromovat). Foaia din motor nu știe asta, așa că
   ghilimeaua dublată devine un semn-înlocuitor până după calcul. */
const GD='';
function ghilimeleDublate(f){let out='',q=false;for(let k=0;k<f.length;k++){const ch=f[k];
  if(ch==='"'){if(q&&f[k+1]==='"'){out+=GD;k++;continue}q=!q}out+=ch}return out}
const inapoiGD=v=>typeof v==='string'&&v.includes(GD)?v.split(GD).join('"'):v;
/* în afara ghilimelelor: o parte goală valorează 0 — între două ; (e24: =IF(B2<14;;20) -> 0), la sfârșit (r01, r02:
   =IF(B2<14;10;) -> 10 sau 0; r03: =IF(B2<14;) -> 0), la început (r05: =IF(;10;20) -> 20), cu spațiu (r06), și în SUM,
   AVERAGE, MAX (r08-r10: =AVERAGE(B2;;B3) -> 9, adică partea goală e un 0 numărat). „()” gol rămâne gol. */
function partiGoale(f){let out='',q=false;for(let k=0;k<f.length;k++){const ch=f[k];if(ch==='"')q=!q;out+=ch;
  if(q)continue;const rest=f.slice(k+1);
  if((ch===';'&&/^\s*[;)]/.test(rest))||(ch==='('&&/^\s*;/.test(rest)))out+='0'}return out}

if(J&&!J._decizieL09){
  const orig=J.evaluate;   // e deja învelită de excelx-formule.js (lecția 7), dacă e încărcată
  J.evaluate=function(formula,get){
    if(typeof formula==='string'&&formula.startsWith('=')){
      // 0. o ghilimea fără pereche (M5 al judecătorului): Excel arată fereastra de problemă (e32) sau propune singur
      //    corectura (e70, e73), iar fără ea nu primește formula. Înainte de orice altă verificare, ca la Excel.
      const nq=(formula.match(/"/g)||[]).length;
      if(nq%2){
        if(/[„“”]/.test(formula))throw FE(PROBLEMA+'Ai amestecat ghilimelele: ghilimelele românești „ ” sau cele întoarse “ ” nu merg în formule. Fiecare text are o ghilimea dreaptă " la început și una la sfârșit.','⚠');
        throw FE('Ai o ghilimea fără pereche: fiecare text are o ghilimea dreaptă " la început și una la sfârșit, de exemplu "merge". Excel nu primește formula așa: îți arată fereastra „There\'s a problem with this formula” sau îți propune el o corectură (fereastra „We found a typo…”), care poate fi greșită — uită-te bine la ea înainte s-o primești.','⚠');
      }
      const s=faraText(formula.slice(1));let m;
      // 1. ghilimelele românești „ (de pe tasta din stânga lui 1): Excel nu primește formula
      if(s.includes('„'))throw FE(PROBLEMA+'Ghilimelele românești „ ” nu merg în formule. Textul se scrie între ghilimele drepte: "promovat". '+GHILIMEA_DREAPTA,'⚠');
      // 4. >= <= = <> scrise altfel (Excel propune corectura, apoi, la No, nu primește formula)
      //    „> =” / „< =” cu spațiu: Excel propune > / <, adică PIERDE „sau egal” (m1 al judecătorului, e16)
      if((m=s.match(/([<>])\s+=/)))
        throw FE(`Între ${m[1]} și = nu se pune spațiu. Excel îți propune aici ${m[1]}, fără egal (fereastra „We found a typo in your formula…”), iar asta schimbă regula la limită: apasă No și scrie ${m[1]}= lipit.`,'⚠');
      const GRESIT=[[/=\s*>/,'=>','>='],[/=\s*</,'=<','<='],[/==/,'==','='],[/!=/,'!=','<>'],[/<\s+>/,'< >','<>']];
      for(const [re,scris,bun] of GRESIT)if(re.test(s))
        throw FE(`Semnul „${scris}” nu există în Excel. Se scrie ${bun}, cele două semne lipite, în ordinea asta. Excel îți propune el corectura (fereastra „We found a typo in your formula…”); dacă o refuzi, nu primește formula.`,'⚠');
      // 4b. spațiu între IF și paranteză (e66): Excel propune corectura fără spațiu
      if(/(^|[^A-Za-z0-9_.])IF\s+\(/i.test(s))
        throw FE('Între IF și paranteză nu se pune spațiu: IF(. Excel îți propune el corectura (fereastra „We found a typo in your formula…”); dacă o refuzi, nu primește formula.','⚠');
      // 4c'. paranteza închisă prea devreme: un ; rămas în afara oricărei paranteze (r20: fereastra de problemă)
      {let d=0,afara=false;for(const ch of s){if(ch==='(')d++;else if(ch===')')d--;else if(ch===';'&&d<=0)afara=true}
        if(afara&&areIF(formula))throw FE(PROBLEMA+'Ai închis paranteza prea devreme: tot ce vine după ) nu mai e în IF. IF are o paranteză deschisă imediat după nume și una închisă la sfârșit, după a treia parte.','⚠')}
      // 4c. o paranteză ) în plus doar la sfârșit (e33, r25, r27, r34, r36): Excel propune s-o scoată
      {let d=0,minim=0;for(const ch of s){if(ch==='(')d++;else if(ch===')'){d--;minim=Math.min(minim,d)}}
        if(minim<0)throw FE('Ai o paranteză ) în plus. Excel îți propune s-o scoată (fereastra „We found a typo in your formula…”); dacă refuzi, nu primește formula.','⚠')}
      // 5. zecimala cu punct într-un IF: fereastra de problemă, fără corectură propusă
      if(areIF(formula)&&/\d\.\d/.test(s))throw FE(PROBLEMA+'Pe setări românești, zecimala se scrie cu virgulă: 4,5, nu 4.5.','⚠');
      // 6. virgula ca separator între numere (5,1,0): un număr are cel mult o virgulă zecimală
      if(/\d,\d*,/.test(s)||/,\s*,/.test(s))throw FE(PROBLEMA+'Pe setări românești, părțile lui IF se despart cu ; (punct și virgulă). Virgula e pentru zecimale: 4,5.','⚠');
      // 7. prea multe părți într-un IF
      const np=partiIF(formula).find(n=>n>3);
      if(np)throw FE(`Excel nu primește formula (fereastra „You've entered too many arguments for this function”): IF are trei părți, despărțite de ; — condiția; ce scrie dacă e adevărată; ce scrie dacă e falsă. Tu ai pus ${np}.`,'⚠');
      // 3. semnele de la matematică ≥ ≤ ≠: Excel le ia drept nume necunoscute
      if((m=s.match(/[≥≤≠]/))){const b={'≥':'>=','≤':'<=','≠':'<>'}[m[0]];
        throw FE(`Excel nu cunoaște semnul ${m[0]} de la matematică, deci arată #NAME?. În Excel îl scrii din două semne: ${b}.`,'#NAME?')}
      // 2. ghilimele întoarse “ ” (de exemplu, puse de telefon): #NAME?
      if(/[“”]/.test(s))throw FE('Ghilimelele întoarse “ ” nu sunt ghilimele de formulă, deci Excel arată #NAME?. Textul se scrie între ghilimele drepte: "promovat". '+GHILIMEA_DREAPTA+' Pe telefon, caută ghilimeaua dreaptă " printre simboluri.','#NAME?');
      // 8. text fără ghilimele într-un IF: #NAME?, cu mesajul despre ghilimele
      //    (M4 al judecătorului: $B$2 e o adresă, cu $ scos înainte de căutarea cuvintelor; F4 din foaie îl scrie singur)
      if(areIF(formula)){const nec=[],s$=s.replace(/\$/g,'');
        s$.replace(CUV,(w,off)=>{const inainte=s$[off-1]||'',dupa=s$.slice(off+w.length).trimStart();
          if(/[0-9]/.test(inainte))return w;
          if(/^(TRUE|FALSE)$/i.test(w)||dupa[0]==='('||eAdresa(w))return w;
          nec.push(w);return w});
        if(nec.length)throw FE(`Excel nu cunoaște cuvântul „${nec[0]}”, deci arată #NAME?. Un text din formulă se scrie între ghilimele drepte: "${nec[0]}". `+GHILIMEA_DREAPTA,'#NAME?')}
      formula=partiGoale(ghilimeleDublate(formula));
    }
    return inapoiGD(orig.call(this,formula,get));
  };
  J._decizieL09=true;
}

/* valoarea unei celule dintr-o foaie {A1:'…'} (numere cu virgulă zecimală, texte, formule), cu evaluatorul de mai sus */
function valCu(src){const memo={},stiva=new Set();
  const get=a=>{if(a in memo)return memo[a];let r=src[a],v;
    if(r==null||r==='')v='';else if(typeof r==='number')v=r;else{r=String(r);
      if(r[0]==='='){if(stiva.has(a))throw FE('Formula trimite la ea însăși.','0');stiva.add(a);try{v=J.evaluate(r,get)}finally{stiva.delete(a)}}
      else if(/^\s*-?\d+(,\d+)?\s*$/.test(r))v=Number(r.trim().replace(',','.'));
      else v=r}
    memo[a]=v;return v};return get}
const fmt=v=>typeof v==='number'?(Number.isInteger(v)?String(v):String(Math.round(v*1e10)/1e10).replace('.',',')):typeof v==='boolean'?(v?'TRUE':'FALSE'):String(v??'');
function afisare(src,a){try{const v=valCu(src)(a);return {afisat:fmt(v),dreapta:typeof v==='number',centru:typeof v==='boolean',eroare:false}}
  catch(e){return {afisat:e.show&&e.show!=='⚠'?e.show:'#VALUE!',dreapta:false,centru:true,eroare:true}}}
const fara=s=>String(s).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[şș]/g,'s').replace(/[ţț]/g,'t').replace(/\s+/g,' ');
const la=(x,y)=>typeof x==='number'&&typeof y==='number'?Math.abs(x-y)<1e-6:typeof x==='boolean'||typeof y==='boolean'?x===y:fara(x)===fara(y);
const roNr=v=>typeof v==='number'?String(v).replace('.',','):v;

/* 9. testele numite: formula elevului dă același rezultat ca formula de referință pe foaie, pe variante și pe datele schimbate */
function eFormulaBuna(RAW,Q,a,f,variante){const raw=RAW[a];
  if(raw==null||!String(raw).startsWith('=')||!/[A-Za-z]{1,3}\$?\d+/.test(raw))return false;
  const una=D=>{try{return la(valCu(D)(a),valCu({...D,[a]:f})(a))}catch(e){return false}};
  if(!una({...RAW}))return false;
  const auto={};Object.entries(Q.cells||{}).forEach(([k,v],i)=>{if(typeof v==='number')auto[k]=v+(i%3+1)*3});
  for(const v of [...(variante||Q.variants||[]),auto]){const V={};Object.entries(v).forEach(([k,x])=>V[k]=roNr(x));if(!una({...RAW,...V}))return false}
  return true}
function teste(body,Q,S,w){const box=document.createElement('div');box.className='xp-teste';box.setAttribute('aria-live','polite');body.insertBefore(box,w);
  const f=()=>{const rez=Q.teste.map(T=>({ce:T.ce,ok:Object.entries(T.formule||{}).every(([a,fx])=>eFormulaBuna(S.RAW,Q,a,fx,T.variante))
      &&Object.entries(T.functii||{}).every(([a,fn])=>areFunctia(S.RAW[a],fn))}));
    const n=rez.filter(x=>x.ok).length;
    box.innerHTML=`<div class="lbl">Testele atelierului: ${n} din ${rez.length} gata</div><ul>${rez.map(x=>`<li class="${x.ok?'ok':''}"><span aria-hidden="true">${x.ok?'✔':'○'}</span>${x.ce}<span class="xp-sr">${x.ok?' (gata)':' (încă nu)'}</span></li>`).join('')}</ul>`};
  f();new MutationObserver(f).observe(w,{childList:true,subtree:true,characterData:true})}

/* forma pe care o scrie foaia din motor pentru o formulă de referință (peRO din tip-excel.js): „,” -> „;”, 0.5 -> 0,5.
   Referințele lecției sunt scrise DIRECT pe setări românești (cu ; și 3,5): peRO le-ar strica zecimala (3,5 -> 3;5). */
function peRO(f){let out='',q=false;for(let k=0;k<f.length;k++){const ch=f[k];if(ch==='"')q=!q;
  if(!q&&ch===',')out+=';';else if(!q&&ch==='.'&&/\d/.test(f[k-1]||'')&&/\d/.test(f[k+1]||''))out+=',';else out+=ch}return out}
/* telefonul îngust (jocuri/README.md §9: grila încape la 320 px): foile cu 5 coloane ale lecției (medie + decizie,
   excursia) au, sub 420 px, literă mai mică și coloane mai înguste, ca ultima coloană, în care scrie elevul, să nu iasă
   din ecran. Probat: lectii/viii/m2-l09/_proba/proba_latime.py (390 și 320 px). */
const CSS_D=`@media (max-width:420px){#body.xd5 .xl table{font-size:13.5px}#body.xd5 .xl td{min-width:2.3em;max-width:5.2em;padding:0 2px}#body.xd5 .xl thead th,#body.xd5 .xl tbody th{padding:2px 2px;min-width:1.5em}}
@media (max-width:360px){#body.xd5 .xl table{font-size:11.5px}#body.xd5 .xl td{min-width:2em;max-width:5em;padding:0 1px}#body.xd5 .xl tbody th{min-width:1.2em}}`;
function css(){if(!document.getElementById('xd-css')){const s=document.createElement('style');s.id='xd-css';s.textContent=CSS_D;document.head.appendChild(s)}}
const areFunctia=(raw,fn)=>new RegExp('(^|[^A-Za-z0-9_.])'+fn+'\\s*\\(','i').test(faraText(String(raw||'')));
/* semnul greșit la limită: schimbând un singur semn de comparare (< <-> <=, > <-> >=, în afara ghilimelelor), formula
   elevului trece toate verificările -> {scris, bun}; altfel null */
function semnLaLimita(RAW,Q,a,f){const raw=String(RAW[a]||'');if(!raw.startsWith('='))return null;let q=false;
  for(let k=1;k<raw.length;k++){const ch=raw[k];if(ch==='"'){q=!q;continue}if(q||(ch!=='<'&&ch!=='>'))continue;
    if(ch==='<'&&raw[k+1]==='>'){k++;continue}
    const cuEgal=raw[k+1]==='=';const nou=cuEgal?raw.slice(0,k+1)+raw.slice(k+2):raw.slice(0,k+1)+'='+raw.slice(k+1);
    if(eFormulaBuna({...RAW,[a]:nou},Q,a,f,Q.variants))return {scris:cuEgal?ch+'=':ch,bun:cuEgal?ch:ch+'='};
    if(cuEgal)k++}
  return null}
const CSS_S=`.xd-simb{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:0 0 8px}.xd-simb span{font-size:.85rem;color:var(--ink2);flex-basis:100%}
.xd-simb button{min-width:44px;min-height:40px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:600 1.15rem var(--fm);cursor:pointer}`;
function simboluri(body,w){
  let tactil=false;try{tactil=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0}catch(e){}
  if(!tactil||body.querySelector('.xd-simb'))return;
  if(!document.getElementById('xd-simb-css')){const s=document.createElement('style');s.id='xd-simb-css';s.textContent=CSS_S;document.head.appendChild(s)}
  const bar=document.createElement('div');bar.className='xd-simb';bar.setAttribute('role','group');bar.setAttribute('aria-label','Semnele formulei');
  const NUME={'"':'ghilimeaua dreaptă',';':'punct și virgulă','<':'mai mic','>':'mai mare','=':'egal'};
  bar.innerHTML='<span>Semnele formulei (se pun în bara fx, unde e cursorul; ghilimeaua de aici e cea dreaptă):</span>'+
    Object.keys(NUME).map(c=>`<button type="button" data-simb="${esc(c)}" aria-label="${NUME[c]}" title="${NUME[c]}">${esc(c)}</button>`).join('');
  body.insertBefore(bar,w);
  const pune=ev=>{const b=ev.target.closest('[data-simb]');if(!b)return;ev.preventDefault();
    const i=body.querySelector('#xfx');if(!i)return;
    if(document.activeElement!==i){i.focus({preventScroll:true});const L=i.value.length;try{i.setSelectionRange(L,L)}catch(e){}}
    const s=i.selectionStart??i.value.length,e=i.selectionEnd??s;
    i.value=i.value.slice(0,s)+b.dataset.simb+i.value.slice(e);try{i.setSelectionRange(s+1,s+1)}catch(x){}
    i.dispatchEvent(new Event('input',{bubbles:true}))};
  bar.addEventListener('pointerdown',pune);bar.addEventListener('mousedown',ev=>ev.preventDefault());
  bar.addEventListener('click',ev=>ev.preventDefault())}
const F=()=>window.ExcelF||window.ExcelX;
const ExcelD={
  render(Q,body,api){
    const baza=F();
    if(!baza||!window.JocExcel){body.innerHTML='<p class="toast">Foaia Excel nu s-a încărcat. Reîncarcă pagina.</p>';return}
    css();body.classList.toggle('xd5',(Q.cols||6)>=5);
    const areT=Array.isArray(Q.teste)&&Q.teste.some(T=>T.formule);
    const V=Q.verifica||{},doarF=!!V.formule&&Object.keys(V).every(k=>k==='formule');
    let S=null,convertit=false;
    /* NOTAREA, nu simularea (jocuri/README.md §1): foaia din motor compară textul rezultat cu diacritice („preț întreg”
       ≠ „pret intreg”); aici, dacă singurul motiv al lui „Nu încă” e ăsta, răspunsul e primit (tastatura din laborator
       poate fi fără diacritice). Foaia afișează tot ce a scris elevul, ca Excel-ul. */
    /* M3 al judecătorului: când formula greșește DOAR la limită (< în loc de <=, > în loc de >= sau invers), foaia din
       motor spunea „Verifică adresele”; aici mesajul duce la semn. M1: după „Corect!” foaia rămâne vie (done() = fals
       pentru foaie), ca elevul să poată schimba o notă și să vadă cum se reface decizia. Q.functii = {D5:'SUM'}: celula
       trebuie să folosească funcția cerută (m3). */
    const api2=Object.assign({},api,{
      done:()=>Array.isArray(Q.o)?api.done():false,
      resolve:(ok,msg)=>{convertit=false;
        if(Array.isArray(Q.o)||!doarF||!S)return api.resolve(ok,msg);
        const bune=ok||Object.entries(V.formule).every(([a,f])=>eFormulaBuna(S.RAW,Q,a,f,Q.variants));
        const lipsa=Object.entries(Q.functii||{}).find(([a,fn])=>!areFunctia(S.RAW[a],fn));
        if(bune&&lipsa)return api.resolve(false,`${lipsa[0]} dă rezultatul bun, dar aici se cere funcția ${lipsa[1]}: =${lipsa[1]}(…), cu zona între paranteze.`);
        if(bune){if(!ok)convertit=true;return api.resolve(true)}
        for(const [a,f] of Object.entries(V.formule)){if(eFormulaBuna(S.RAW,Q,a,f,Q.variants))continue;
          const d=semnLaLimita(S.RAW,Q,a,f);
          if(d){let acum=false;try{acum=la(valCu(S.RAW)(a),valCu({...S.RAW,[a]:f})(a))}catch(e){}
            return api.resolve(false,(acum?`${a} dă rezultatul bun acum, dar greșește la limită, când valoarea e exact numărul din regulă. Scrie în foaie chiar numărul din regulă și uită-te ce arată ${a}.`
              :`${a} greșește la limită: acum valoarea e exact numărul din regulă, iar ${a} arată ce nu trebuie.`)+' Apoi uită-te la semnul de comparare: la limită, regula trebuie să ia și valoarea egală sau nu?')}}
        return api.resolve(ok,msg)},
      revealButton:fn=>{if(!convertit)return api.revealButton(fn)},
      giveUp:html=>{let h=html;if(typeof h==='string'&&V.formule)Object.values(V.formule).forEach(f=>{const r=peRO(f);if(r!==f)h=h.split(esc(r)).join(esc(f))});return api.giveUp(h)}});
    baza.render(areT?Object.assign({},Q,{teste:undefined}):Q,body,api2);
    S=window.JocExcel.render._stare;const w=body.querySelector('#xwrap');
    if(areT&&w&&S)teste(body,Q,S,w);
    /* m10: bara de formule fără corectura automată a telefonului; pe ecranele cu atingere, semnele formulei ca butoane */
    const fixFx=()=>{const i=body.querySelector('#xfx');if(i&&i.getAttribute('autocorrect')!=='off')i.setAttribute('autocorrect','off')};
    fixFx();if(w){new MutationObserver(fixFx).observe(w,{childList:true,subtree:true});simboluri(body,w)}},
  rezolva(Q,body,api){const r=F().rezolva(Q,body,api);const S=window.JocExcel.render._stare;let ch=false;
    Object.entries((Q.verifica||{}).formule||{}).forEach(([a,f])=>{if(peRO(f)!==f){S.RAW[a]=f;ch=true}});
    if(ch)S.draw();return r},
  gresit(Q,body,api){return F().gresit(Q,body,api)}
};
window.ExcelD=ExcelD;
window.ExcelDecizie={valoare:(src,a)=>valCu(src)(a),afisare,esc,eFormulaBuna};
})();
