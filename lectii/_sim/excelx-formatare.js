/* lectii/_sim/excelx-formatare.js — FORMATAREA pentru foaia „excelx” a lecțiilor de Excel (clasa a VIII-a).
   AUTOR: lecția VIII / M1 / nr. 6 („Formatarea rândurilor, a coloanelor și a celulelor”), 27.09.2026.
   ÎNCĂRCARE (după excelx.js, care rămâne NESCHIMBAT):
     <script src="../../../jocuri/_motor/motor.js"></script><script src="../../../jocuri/_motor/tip-foaie.js"></script>
     <script src="../../../jocuri/_motor/tip-excel.js"></script><script src="../../_sim/excelx.js"></script>
     <script src="../../_sim/excelx-formatare.js"></script>          apoi în configurație: tipuri:{excelx:ExcelXF}
   CE ADAUGĂ (regula fidelității, jocuri/README.md §1). Fiecare regulă e probată în Excel-ul REAL (Microsoft 365, interfața
   în engleză, setări regionale românești), pe o instanță nouă și invizibilă sau pe un desktop ascuns, cu butoanele
   apăsate prin CommandBars.ExecuteMso (aceeași comandă ca un clic): lectii/viii/m1-l06/_proba/proba_*.json.
   - LĂȚIMEA COLOANEI și ÎNĂLȚIMEA RÂNDULUI: tragi de linia din dreapta literei / de sub numărul rândului (mouse și deget),
     dublu-clic (două atingeri) pe linie = potrivire automată după TOT conținutul coloanei (și după un titlu lung din A1,
     ca în Excel); Pornire › Celule › Format (Row Height…, AutoFit Row Height, Column Width…, AutoFit Column Width — doar
     după celulele SELECTATE —, Default Width…); clic dreapta pe litera/numărul antetului › Column Width… / Row Height….
   - „####”: un număr sau o dată care nu încape în coloană. Numărul în formatul General se scurtează întâi (mai puține
     zecimale: 3,14159265 -> 3,1416; apoi 1E+06), abia apoi ####. Textul lung trece peste celula vecină dacă e goală și
     se taie dacă vecina e plină. Excel lățește singur o coloană nemodificată de mână când scrii o dată, un număr mare sau
     când alegi un format mai lung (Accounting, Long Date…); o coloană îngustată de mână rămâne cu #### (probat la tastare).
   - Pornire › Font: Bold/Italic/Underline (comutate după celula ACTIVĂ, pe toată zona), Font Size + A^ A˅, Borders
     (butonul pune ultima bordură folosită, la început Bottom Border; ▾ = cele 13 borduri ale Excel-ului; marginile sunt
     comune între celulele vecine, ca în Excel), Fill Color (butonul = galben / ultima culoare; ▾ = paleta reală a temei
     Office, cu nuanțele citite din Excel), Font Color (roșu / ultima culoare).
   - Pornire › Aliniere: sus / la mijloc / jos (implicit jos), stânga / centru / dreapta — comutatoare: al doilea clic
     readuce alinierea automată —, Wrap Text (rândul crește singur, dacă nu i-ai dat tu înălțimea), Merge & Center
     (avertismentul real „Merging cells only keeps the upper-left value and discards other values.”, OK / Cancel; păstrează
     primul conținut, restul se șterge; al doilea clic desface; ▾ = Merge Across, Merge Cells, Unmerge Cells).
   - Pornire › Număr: lista Number Format (General, Number 0,00, Currency, Accounting, Short Date, Long Date, Time,
     Percentage 0,00%, Fraction, Scientific, Text — codurile citite din Excel după alegerea din listă), Accounting, % (0%),
     Comma Style, Increase/Decrease Decimal (după zecimalele AFIȘATE ale celulei active: 7,5 -> 7,50; 7,5 -> 8).
     Valoarea din spate nu se schimbă: bara de formule arată 7,125 sub 7,13 și 12,5% sub 13% (probat prin UI Automation).
   - Pornire › Stiluri › Cell Styles: galeria reală (Good, Bad, Neutral, Heading 1-4, Title, Total, 20%/40%/60% - Accent…),
     fiecare stil cu ce pune el în Excel (font, umplere, borduri, format), citit prin COM.
   - Editare › Clear › Clear Formats (golește formatele și desface îmbinările; valoarea rămâne).
   - Totul intră în Anulare (Ctrl+Z / ↶): fiecare comandă face întâi instantaneul foii din motor (butonul ascuns
     data-rb="xf:snap" -> aplica() fără efect -> salveaza()), apoi schimbă FMT / MERGE / RAW.
   Starea nouă stă în FMT (deci și în Anulare): FMT['col:C']={w,c} lățimea în caractere Excel (c = pusă de mână),
   FMT['row:3']={h} înălțimea în puncte; pe celulă: nfx (codul formatului, ca în Excel), va (aliniere verticală), wrap,
   fs (mărimea fontului), xb {t,b,l,r} (borduri: 'thin'|'medium'|'double' + ':#culoare'), stil. Aldinul, umplerea,
   culoarea fontului și alinierea orizontală rămân câmpurile foii din motor (b, i, u, fill, color, al).
   CÂMPURI NOI pe întrebare: latimi:{C:6}, inaltimi:{1:30}, forme:{'A2:D2':{b:true}}, imbinari:['A1:D1'],
     verifica.forma:{…} și teste:[{ce, forma:{…}}] (vezi problemeForma mai jos).
   PE ECRANUL CU DEGET (pointer:coarse; după judecătorul lecției 6, G1/M1-M3, regula 20 a standardului):
   - foaia se derulează în lateral trăgând de literele coloanelor (derularea o face stratul; tragerea nu selectează);
     atingerea literei / a numărului rândului selectează coloana / rândul; pe marginea selecției apare un MÂNER de 34 px
     (⇔ pentru lățime, ⇕ pentru înălțime): tragi de el sau îl atingi de două ori (potrivire automată); rândurile >= 32 px;
   - panglica e mărită (butoanele de 35 px), iar grupurile Font, Aliniere, Număr stau pe două rânduri, în ordinea din
     Excel, cu NUMELE scris sub fiecare buton (în Excel îl vezi ținând mouse-ul pe buton — spus pe ecran);
   - derularea foii și a panglicii se păstrează între desene (motorul le redesenează la fiecare comandă), iar #xwrap nu
     se scurtează în mijlocul desenului (altfel pagina sărea cu ~55 px la apăsare și degetul ajungea pe alt rând).
   Pe ecranul cu mouse: Borders și Underline au lățimea lui Fill Color; pictograma pune comanda, doar săgeata ▾ (zonă
   separată) deschide lista; Increase / Decrease Decimal și Comma Style au pictogramele din Excel („←0 .00”, „.00 →.0”, „,”).
   Zona selectată se citește din antetele aprinse de foaie (o celulă ascunsă într-o îmbinare nu are td).
   ABATERI SPUSE PE ECRAN: fereastra Format Cells (Ctrl+1, săgețile mici din colțul grupurilor), Format Painter, Orientation,
   Indent, Conditional Formatting, Format as Table, fontul (numele), Hide/Unhide nu sunt în foaia din pagină — un clic
   spune asta, nu pare stricat. Textul centrat sau aliniat la dreapta nu trece peste vecini (în Excel trece).
   CERERE pentru _motor: o funcție publică de instantaneu (salveaza) și citirea zonei selectate în JocExcel.render._stare. */
(function(){
'use strict';
if(!window.ExcelX||!window.ExcelTipuri){console.error('excelx-formatare.js: încarcă întâi lectii/_sim/excelx.js');return}
const XT=window.ExcelTipuri;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COL=i=>{let s='';for(let n=i+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s};
const pos=a=>{const m=String(a).toUpperCase().match(/^([A-Z]{1,3})(\d+)$/);return m?{c:m[1].split('').reduce((x,ch)=>x*26+ch.charCodeAt(0)-64,0)-1,r:+m[2]-1}:null};
const adr=(c,r)=>COL(c)+(r+1);
const zonaDin=t=>{const [a,b]=String(t).split(':');const p=pos(a),q=pos(b||a);return {c1:Math.min(p.c,q.c),c2:Math.max(p.c,q.c),r1:Math.min(p.r,q.r),r2:Math.max(p.r,q.r)}};
const zonaTxt=z=>z.c1===z.c2&&z.r1===z.r2?adr(z.c1,z.r1):adr(z.c1,z.r1)+':'+adr(z.c2,z.r2);
const peCelule=(z,fn)=>{for(let r=z.r1;r<=z.r2;r++)for(let c=z.c1;c<=z.c2;c++)fn(adr(c,r),c,r)};

/* ============================ DATELE DIN EXCEL-UL REAL (proba_paleta_stiluri.json, proba_comenzi.json) ============ */
const Z=(window.matchMedia&&matchMedia('(max-width:520px)').matches)?1.05:1.25;   // foaia = Excel la 125% (pe telefon 105%: 4 coloane încap)
const STD_W=8.43, STD_H=15;       // lățimea (caractere) și înălțimea (puncte) implicite la Calibri 11, 100%
const PAD=2;                      // marginea textului în celulă (px la 100%)
const FONT='Carlito, Calibri, "Segoe UI", Arial, sans-serif';   // Carlito = aceleași lățimi ca Calibri (Google Fonts)
const TEMA=[['White, Background 1','#FFFFFF',['#F2F2F2','#D9D9D9','#BFBFBF','#A6A6A6','#808080'],['Darker 5%','Darker 15%','Darker 25%','Darker 35%','Darker 50%']],
  ['Black, Text 1','#000000',['#808080','#595959','#404040','#262626','#0D0D0D'],['Lighter 50%','Lighter 35%','Lighter 25%','Lighter 15%','Lighter 5%']],
  ['Background 2','#E7E6E6',['#D0CECE','#AEAAAA','#757171','#3A3838','#161616'],['Darker 10%','Darker 25%','Darker 50%','Darker 75%','Darker 90%']],
  ['Text 2','#44546A',['#D6DCE4','#ACB9CA','#8497B0','#333F4F','#222B35'],null],
  ['Accent 1','#4472C4',['#D9E1F2','#B4C6E7','#8EA9DB','#305496','#203764'],null],
  ['Accent 2','#ED7D31',['#FCE4D6','#F8CBAD','#F4B084','#C65911','#833C0C'],null],
  ['Accent 3','#A5A5A5',['#EDEDED','#DBDBDB','#C9C9C9','#7B7B7B','#525252'],null],
  ['Accent 4','#FFC000',['#FFF2CC','#FFE699','#FFD966','#BF8F00','#806000'],null],
  ['Accent 5','#5B9BD5',['#DDEBF7','#BDD7EE','#9BC2E6','#2F75B5','#1F4E78'],null],
  ['Accent 6','#70AD47',['#E2EFDA','#C6E0B4','#A9D08E','#548235','#375623'],null]];
const NUANTE=['Lighter 80%','Lighter 60%','Lighter 40%','Darker 25%','Darker 50%'];
const STANDARD=[['Dark Red','#C00000'],['Red','#FF0000'],['Orange','#FFC000'],['Yellow','#FFFF00'],['Light Green','#92D050'],['Green','#00B050'],['Light Blue','#00B0F0'],['Blue','#0070C0'],['Dark Blue','#002060'],['Purple','#7030A0']];
/* stilurile de celulă: ce pune fiecare pe o celulă în Excel (aplicat prin COM). i* = categoriile incluse în stil */
const B7='thin:#7F7F7F',B3='thin:#3F3F3F';
const STILURI={
  'Normal':{g:0,f:{},iF:1,iU:1,iB:1,iN:1,iA:1},
  'Bad':{g:0,f:{color:'#9C0006',fill:'#FFC7CE'},iF:1,iU:1},'Good':{g:0,f:{color:'#006100',fill:'#C6EFCE'},iF:1,iU:1},'Neutral':{g:0,f:{color:'#9C5700',fill:'#FFEB9C'},iF:1,iU:1},
  'Calculation':{g:1,f:{b:1,color:'#FA7D00',fill:'#F2F2F2'},bd:{t:B7,b:B7,l:B7,r:B7},iF:1,iU:1,iB:1},
  'Check Cell':{g:1,f:{b:1,color:'#FFFFFF',fill:'#A5A5A5'},bd:{t:'double:#3F3F3F',b:'double:#3F3F3F',l:'double:#3F3F3F',r:'double:#3F3F3F'},iF:1,iU:1,iB:1},
  'Explanatory Text':{g:1,f:{i:1,color:'#7F7F7F'},iF:1},'Input':{g:1,f:{color:'#3F3F76',fill:'#FFCC99'},bd:{t:B7,b:B7,l:B7,r:B7},iF:1,iU:1,iB:1},
  'Linked Cell':{g:1,f:{color:'#FA7D00'},bd:{b:'double:#FF8001'},iF:1,iB:1},'Note':{g:1,f:{fill:'#FFFFCC'},bd:{t:'thin:#B2B2B2',b:'thin:#B2B2B2',l:'thin:#B2B2B2',r:'thin:#B2B2B2'},iU:1,iB:1},
  'Output':{g:1,f:{b:1,color:'#3F3F3F',fill:'#F2F2F2'},bd:{t:B3,b:B3,l:B3,r:B3},iF:1,iU:1,iB:1},'Warning Text':{g:1,f:{color:'#FF0000'},iF:1},
  'Heading 1':{g:2,f:{b:1,fs:15,color:'#44546A'},bd:{b:'thick:#4472C4'},iF:1,iB:1},'Heading 2':{g:2,f:{b:1,fs:13,color:'#44546A'},bd:{b:'thick:#A2B8E1'},iF:1,iB:1},
  'Heading 3':{g:2,f:{b:1,color:'#44546A'},bd:{b:'medium:#8EA9DB'},iF:1,iB:1},'Heading 4':{g:2,f:{b:1,color:'#44546A'},iF:1},
  'Title':{g:2,f:{fs:18,color:'#44546A',usor:1},iF:1},'Total':{g:2,f:{b:1},bd:{t:'thin:#4472C4',b:'double:#4472C4'},iF:1,iB:1},
  'Comma':{g:4,nf:'_-* #.##0,00_-;-* #.##0,00_-;_-* "-"??_-;_-@_-',iN:1},'Comma [0]':{g:4,nf:'_-* #.##0_-;-* #.##0_-;_-* "-"_-;_-@_-',iN:1},
  'Currency':{g:4,nf:'_-* #.##0,00 lei_-;-* #.##0,00 lei_-;_-* "-"?? lei_-;_-@_-',iN:1},'Currency [0]':{g:4,nf:'_-* #.##0 lei_-;-* #.##0 lei_-;_-* "-" lei_-;_-@_-',iN:1},
  'Percent':{g:4,nf:'0%',iN:1}};
[['20%',['#D9E1F2','#FCE4D6','#EDEDED','#FFF2CC','#DDEBF7','#E2EFDA'],'#000000'],['40%',['#B4C6E7','#F8CBAD','#DBDBDB','#FFE699','#BDD7EE','#C6E0B4'],'#000000'],
 ['60%',['#8EA9DB','#F4B084','#C9C9C9','#FFD966','#9BC2E6','#A9D08E'],'#000000'],['',['#4472C4','#ED7D31','#A5A5A5','#FFC000','#5B9BD5','#70AD47'],'#FFFFFF']].forEach(([p,cul,txt])=>
  cul.forEach((f,k)=>{STILURI[(p?p+' - ':'')+'Accent'+(k+1)]={g:3,f:{fill:f,color:txt},iF:1,iU:1}}));
const GRUPE_STIL=['Good, Bad and Neutral','Data and Model','Titles and Headings','Themed Cell Styles','Number Format'];
/* codurile pe care le pune lista „Number Format” (proba_ascuns.json: ales din listă prin UI Automation, citit NumberFormatLocal) */
const ACC='_-* #.##0,00 lei_-;-* #.##0,00 lei_-;_-* "-"?? lei_-;_-@_-',COMMA='_-* #.##0,00_-;-* #.##0,00_-;_-* "-"??_-;_-@_-';
const LISTA_NF=[['General','General','No specific format'],['Number','0,00'],['Currency','#.##0,00 lei'],['Accounting',ACC],['Short Date','dd.mm.yyyy'],
  ['Long Date','[$-F800]dddd, mmmm dd, yyyy'],['Time','[$-F400]h:mm:ss AM/PM'],['Percentage','0,00%'],['Fraction','# ?/?'],['Scientific','0,00E+00'],['Text','@']];
const MARIMI=[8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];
const RAND_PT={8:12,9:12,10:12.75,11:15,12:15.75,13:17.25,14:18.75,15:20.25,16:21,18:23.25,20:26.25,22:28.5,24:31.5,26:33.75,28:36.75,36:46.5,48:63,72:93.75};
const ZILE=['duminică','luni','marți','miercuri','joi','vineri','sâmbătă'];
const LUNI_L=['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'];
const BORDURI=[['bottom','Bottom Border','Bordură jos'],['top','Top Border','Bordură sus'],['left','Left Border','Bordură stânga'],['right','Right Border','Bordură dreapta'],'-',
  ['none','No Border','Fără borduri'],['all','All Borders','Toate bordurile'],['outside','Outside Borders','Borduri exterioare'],['thickOutside','Thick Outside Borders','Borduri exterioare groase'],'-',
  ['doubleBottom','Bottom Double Border','Bordură dublă jos'],['thickBottom','Thick Bottom Border','Bordură groasă jos'],['topBottom','Top and Bottom Border','Bordură sus și jos'],
  ['topThickBottom','Top and Thick Bottom Border','Bordură sus și groasă jos'],['topDoubleBottom','Top and Double Bottom Border','Bordură sus și dublă jos']];
const ULTIM={fill:'#FFFF00',font:'#FF0000',bd:'bottom'};   // ce pune butonul (partea de sus): ultima alegere, ca în Excel

/* ============================ FORMATAREA NUMERELOR (ca Excel pe setări românești) ============================ */
const grup=t=>t.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
function fix(v,k,mii){const t=Math.abs(v).toFixed(k).split('.');const semn=v<0&&Number(Math.abs(v).toFixed(k))!==0?'-':'';return semn+(mii?grup(t[0]):t[0])+(k?','+t[1]:'')}
const p2=n=>String(n).padStart(2,'0');
function dinSerial(v){const z=Math.floor(v+1e-9);let y,m,d;
  if(z===60){y=1900;m=2;d=29}else{const o=new Date((z<60?Date.UTC(1899,11,31):Date.UTC(1899,11,30))+z*864e5);y=o.getUTCFullYear();m=o.getUTCMonth()+1;d=o.getUTCDate()}
  let s=Math.round((v-z)*86400);if(s>=86400)s=86399;return {y,m,d,h:Math.floor(s/3600),mi:Math.floor(s%3600/60),s:s%60,dow:(z+6)%7}}
/* General: tot numărul, cel mult 10 cifre semnificative (Excel: 11 caractere), științific peste 1E+11 */
function general(v){if(!isFinite(v))return String(v);const a=Math.abs(v);
  if(a!==0&&(a>=1e11||a<1e-9)){const [mant,exp]=v.toExponential(5).split('e');return mant.replace(/\.?0+$/,'').replace('.',',')+'E'+(+exp<0?'-':'+')+p2(Math.abs(+exp))}
  return String(Number(v.toPrecision(10))).replace('.',',')}
/* formele mai scurte pe care le încearcă Excel când numărul General nu încape (proba_comenzi.json, „latime”) */
function generalScurt(v){const out=[general(v)];const t=out[0];
  const zec=(t.match(/,(\d+)$/)||['',''])[1].length;
  if(!/E/.test(t))for(let k=zec-1;k>=0;k--){let s=v.toFixed(k).replace('.',',');if(k)s=s.replace(/,?0+$/,'');if(!out.includes(s))out.push(s)}
  if(Math.abs(v)>=1)for(let k=5;k>=0;k--){const [mant,exp]=v.toExponential(k).split('e');const s=mant.replace(/\.?0+$/,'').replace('.',',')+'E'+(+exp<0?'-':'+')+p2(Math.abs(+exp));if(!out.includes(s))out.push(s)}
  return out}
/* General încape după „lățimea în cifre” a textului: fiecare caracter = o cifră, minusul = 0,75 (proba_comenzi.json,
   seriile „latime”: -1234,5 arată -1235 la lățimea 4,78 și -1234,5 la 6,78); cif = lățimea unei cifre, disp = spațiul */
const cifre=x=>x.length-0.25*(x.split("-").length-1);
function generalIncape(v,disp,cif){return generalScurt(v).find(x=>cifre(x)*cif<=disp+0.5)}
const eData=c=>/^\[\$-F800\]|^dd\.|^mmm|yyyy/.test(c)&&!/^\[\$-F400\]/.test(c);
const eOra=c=>/^\[\$-F400\]|^hh:mm/.test(c);
/* textul unui număr v în formatul cod: {t, minus (Accounting: minusul lipit la stânga), rosu} sau {diez:true} */
function formateaza(v,cod){
  cod=cod||'General';
  if(cod==='General'||cod==='@')return {t:general(v)};
  if(/^_-\* /.test(cod)){const sec=cod.split(';'),s=v>0?sec[0]:v<0?sec[1]:sec[2];const lei=/lei/.test(s);
    if(v===0)return {t:'-'+(/\?\?/.test(s)?'  ':'')+(lei?' lei':'')+' ',cont:true};
    const k=(s.match(/0,(0+)/)||['',''])[1].length;return {t:fix(Math.abs(v),k,true)+(lei?' lei':'')+' ',minus:v<0,cont:true}}
  let m;
  if((m=cod.match(/^(0|#\.##0)(?:,(0+))?%$/)))return {t:fix(v*100,(m[2]||'').length,m[1]!=='0')+'%'};
  if((m=cod.match(/^(0|#\.##0)(?:,(0+))?( lei)?(;\[Red\]-.*)?$/))){const k=(m[2]||'').length,mii=m[1]!=='0';
    if(v<0&&m[4])return {t:'-'+fix(-v,k,mii)+(m[3]||''),rosu:true};return {t:fix(v,k,mii)+(m[3]||'')}}
  if((m=cod.match(/^0(?:,(0+))?E\+00$/))){const [mant,exp]=v.toExponential((m[1]||'').length).split('e');return {t:mant.replace('.',',')+'E'+(+exp<0?'-':'+')+p2(Math.abs(+exp))}}
  if(cod==='# ?/?')return {t:XT.afis(v,'# ?/?')};
  if(eData(cod)||eOra(cod)){if(v<0)return {diez:true};const d=dinSerial(v);
    if(/^\[\$-F800\]/.test(cod))return {t:`${ZILE[d.dow]}, ${d.d} ${LUNI_L[d.m-1]} ${d.y}`};
    if(/^\[\$-F400\]/.test(cod))return {t:`${p2(d.h)}:${p2(d.mi)}:${p2(d.s)}`};
    const t=XT.afis(v,cod);return {t:t==='#####'?null:t,diez:t==='#####'}}
  const t=XT.afis(v,cod);return {t:t==null?general(v):t};
}
/* ce arată bara de formule pentru numărul v în formatul cod (probat: 7,125 sub 7,13; 12,5% sub 13%; data cu ora) */
function bara(v,cod){const rn=x=>String(Number(x.toPrecision(15))).replace('.',',');
  if(!cod||cod==='General'||cod==='@')return null;
  if(/%$/.test(cod))return rn(v*100)+'%';
  if(eData(cod)||eOra(cod)){if(v<0)return rn(v);const d=dinSerial(v),data=`${p2(d.d)}.${p2(d.m)}.${d.y}`,ora=`${p2(d.h)}:${p2(d.mi)}:${p2(d.s)}`;
    if(eOra(cod)&&v<1)return ora;return (d.h||d.mi||d.s)?data+'  '+ora:data}
  return rn(v)}
/* numele din lista Number Format pentru un cod (ce scrie în casetă, ca Excel) */
function numeFormat(cod){if(!cod||cod==='General')return 'General';if(cod==='@')return 'Text';if(/^_-\*/.test(cod))return 'Accounting';
  if(/%$/.test(cod))return 'Percentage';if(/lei/.test(cod))return 'Currency';if(/E\+00$/.test(cod))return 'Scientific';if(cod==='# ?/?')return 'Fraction';
  if(eOra(cod))return 'Time';if(eData(cod))return 'Date';if(/^(0|#\.##0)(,0+)?$/.test(cod))return 'Number';return 'Custom'}
/* Increase / Decrease Decimal: noul cod, după codul și textul AFIȘAT al celulei active (proba_comenzi.json + proba_reguli.json) */
function zecimale(cod,afisat,plus){
  if(eData(cod)||eOra(cod)||cod==='@'||cod==='# ?/?')return cod;
  if(!cod||cod==='General'){const d=((afisat||'').match(/,(\d+)(?:E|$)/)||['',''])[1].length;
    if(plus)return '0,'+'0'.repeat(d+1);if(d===0)return cod||'General';return d-1?'0,'+'0'.repeat(d-1):'0'}
  if(/E\+00$/.test(cod)){const k=((cod.match(/^0,(0+)E/)||['',''])[1]).length,n=Math.max(0,k+(plus?1:-1));return '0'+(n?','+'0'.repeat(n):'')+'E+00'}
  return cod.replace(/(0|#\.##0)(,0*)?(?=[ %E"_;]|$)/g,(x,a,b)=>{const k=b?b.length-1:0;const n=Math.max(0,k+(plus?1:-1));return a+(n?','+'0'.repeat(n):'')})}

/* ============================ STAREA PE FOAIE ============================ */
const CTX=new WeakMap();let activ=null;const lista=[];
const latime=(ctx,c)=>{const f=ctx.FMT['col:'+COL(c)];return f?f.w:ctx.stdW};
const colPx=w=>w<=0?0:w<1?Math.round(w*12):Math.round(w*7)+5;      // pixeli la 100%, Calibri 11 (8,43 -> 64)
const pxLat=px=>px<=5?Math.max(0,px/12):Math.round((px-5)/7*100)/100;
const inaltimeCustom=(ctx,r)=>{const f=ctx.FMT['row:'+(r+1)];return f?f.h:null};
const areaDe=(ctx,c,r)=>ctx.MERGE.find(m=>c>=m.c1&&c<=m.c2&&r>=m.r1&&r<=m.r2);
const dimF=ctx=>({cols:ctx.Q.cols||6,rows:ctx.Q.rows||8});
const F=(ctx,a)=>ctx.FMT[a]||(ctx.FMT[a]={});
const rawDe=(ctx,a)=>{const v=ctx.RAW[a];return v==null?'':String(v)};

/* valoarea unei celule (formulele prin motorul foii) */
function valoare(ctx,a,stiva){const raw=rawDe(ctx,a);if(raw==='')return {tip:'gol'};
  if(raw[0]==='='){stiva=stiva||new Set();if(stiva.has(a))return {tip:'err',t:'0'};stiva.add(a);
    try{const v=window.JocFoaie.evaluate(raw,x=>{const q=valoare(ctx,x,stiva);return q.tip==='num'?q.v:q.tip==='text'?q.v:q.tip==='bool'?q.v:''});
      if(typeof v==='number')return {tip:'num',v,formula:1};if(typeof v==='boolean')return {tip:'bool',v};return {tip:'text',v:String(v),formula:1}}
    catch(e){return {tip:'err',t:e.show||'#VALUE!'}}finally{stiva.delete(a)}}
  const p=XT.citeste(raw);
  if(p.tip==='num')return {tip:'num',v:p.v,fmtTastat:p.fmt};
  if(p.tip==='bool')return {tip:'bool',v:p.v};
  if(p.tip==='text')return {tip:'text',v:p.v,tri:!!p.tri};return {tip:'gol'}}
/* codul formatului în vigoare: ales de elev (nfx), apoi cel pus de Excel la tastare (ax, din excelx.js), apoi General */
const codDe=(ctx,a)=>{const f=ctx.FMT[a]||{};return f.nfx||f.ax||'General'};

/* ============================ MĂSURAREA TEXTULUI ============================ */
const cnv=document.createElement('canvas').getContext('2d');const MEM=new Map();
function fontDe(f){return `${f.i?'italic ':''}${f.b?'700':'400'} ${(f.fs||11)*4/3*Z}px ${FONT}`}
function lat(text,font){const k=font+'|'+text;let w=MEM.get(k);if(w==null){cnv.font=font;w=cnv.measureText(text).width;if(MEM.size>4000)MEM.clear();MEM.set(k,w)}return w}
/* lățimea (px, la zoom) a unei zone de coloane și spațiul pentru text */
function pxCol(ctx,c){return colPx(latime(ctx,c))*Z}
function spatiu(ctx,c1,c2){let s=0;for(let c=c1;c<=c2;c++)s+=pxCol(ctx,c);return s-2*PAD*Z-1}   // -1: chenarul celulei
/* textul afișat într-o celulă (cu ####, scurtarea numerelor General) */
function afisare(ctx,a){const p=pos(a),v=valoare(ctx,a),f=ctx.FMT[a]||{},font=fontDe(f),mg=areaDe(ctx,p.c,p.r);
  const disp=mg?spatiu(ctx,mg.c1,mg.c2):spatiu(ctx,p.c,p.c);const o={v,font,disp,cod:codDe(ctx,a)};
  if(v.tip==='gol'){o.t='';return o}
  if(v.tip==='err'){o.t=v.t;o.al='center';o.eroare=1;return o}
  if(v.tip==='bool'){o.t=v.v?'TRUE':'FALSE';o.al='center';return o}
  if(v.tip==='text'){o.t=v.v;o.al='left';o.text=1;o.tri=v.tri;o.plin=v.v;return o}
  o.al='right';o.num=1;const r=formateaza(v.v,o.cod);o.plin=r.t;o.minus=r.minus;o.rosu=r.rosu;o.cont=r.cont;
  const umple=()=>'#'.repeat(Math.max(1,Math.floor(disp/Math.max(1,lat('#',font)))));
  if(r.diez){o.t=umple();o.diez=1;return o}
  const w=x=>lat((r.minus?'-':'')+x,font);
  if(o.cod==='General'||o.cod==='@'){const c=generalIncape(v.v,disp,7*Z*((ctx.FMT[a]||{}).fs||11)/11);if(c!=null){o.t=c;o.scurtat=c!==r.t}else{o.t=umple();o.diez=1}return o}
  if(w(r.t)<=disp+0.5){o.t=r.t}else{o.t=umple();o.diez=1}
  return o}
/* lățimea de care are nevoie o celulă ca să se vadă întreagă (caractere Excel), pentru potrivirea automată */
function nevoie(ctx,a){const o=afisare(ctx,a);if(!o.plin&&o.plin!==0)return 0;const gen=o.num&&(o.cod==='General'||o.cod==='@');const text=gen?general(o.v.v):(o.minus?'-':'')+o.plin;
  if(gen)return Math.round((String(text).length*((ctx.FMT[a]||{}).fs||11)/11+0.22)*100)/100;   // Excel: 12345 -> 5,22; 3,14159265 -> 10,22
  const px=lat(String(text),o.font)/Z+2*PAD+3;return pxLat(Math.ceil(px))}
/* rândurile de text ale unei celule cu Wrap Text, în lățimea ei */
function randuriWrap(text,font,disp){const cuv=String(text).split(/\s+/);let n=1,linie='';
  for(const x of cuv){const t=linie?linie+' '+x:x;if(lat(t,font)<=disp||!linie)linie=t;else{n++;linie=x}}return n}
/* înălțimea automată a unui rând (puncte) */
function inaltimeAuto(ctx,r){const {cols}=dimF(ctx);let h=STD_H;
  for(let c=0;c<cols;c++){const a=adr(c,r),f=ctx.FMT[a]||{};const fs=f.fs||11,lh=RAND_PT[fs]||Math.round(fs*1.364*4)/4;
    let hh=lh;const mg=areaDe(ctx,c,r);
    if(f.wrap&&!mg){const o=afisare(ctx,a);if(o.text)hh=lh*randuriWrap(o.t,o.font,o.disp)}
    if(rawDe(ctx,a)!==''||f.fs)h=Math.max(h,hh)}
  return h}
const inaltime=(ctx,r)=>{const h=inaltimeCustom(ctx,r);return h!=null?h:inaltimeAuto(ctx,r)};

/* ============================ ZONA SELECTATĂ (citită din foaia desenată, ca în excelx.js) ============================ */
function selectia(ctx){const w=ctx.body.querySelector('#xwrap');const {cols,rows}=dimF(ctx);
  const ths=w?[...w.querySelectorAll('.gw thead th')].slice(1):[],trs=w?[...w.querySelectorAll('.gw tbody tr')]:[];
  const cs=ths.map((t,i)=>t.classList.contains('on')?i:-1).filter(i=>i>=0);
  const rs=trs.map((tr,i)=>{const th=tr.querySelector('th');return th&&th.classList.contains('on')?i:-1}).filter(i=>i>=0);
  const tda=w&&w.querySelector('.gw td.act'),nb=((w&&w.querySelector('.nb'))||{}).textContent||'';
  let act=/^[A-Z]{1,3}\d+$/.test(nb.trim())?nb.trim():(tda?tda.dataset.a:'A1');
  let z;
  if(cs.length&&rs.length)z={c1:Math.min(...cs),c2:Math.max(...cs),r1:Math.min(...rs),r2:Math.max(...rs),act};
  else{const p=pos(act)||{c:0,r:0};z={c1:p.c,c2:p.c,r1:p.r,r2:p.r,act}}
  z.c2=Math.min(z.c2,cols-1);z.r2=Math.min(z.r2,rows-1);
  // o zonă care atinge o celulă îmbinată o cuprinde întreagă (ca în Excel); celula activă ascunsă într-o îmbinare = colțul ei
  for(let k=0;k<4;k++)ctx.MERGE.forEach(m=>{if(!(m.c2<z.c1||m.c1>z.c2||m.r2<z.r1||m.r1>z.r2)){z.c1=Math.min(z.c1,m.c1);z.c2=Math.max(z.c2,m.c2);z.r1=Math.min(z.r1,m.r1);z.r2=Math.max(z.r2,m.r2)}});
  const pa=pos(z.act);const ma=pa&&areaDe(ctx,pa.c,pa.r);if(ma)z.act=adr(ma.c1,ma.r1);
  return z}
const coloaneIntregi=(ctx,z)=>z.r1===0&&z.r2===dimF(ctx).rows-1;
const randuriIntregi=(ctx,z)=>z.c1===0&&z.c2===dimF(ctx).cols-1;

/* ============================ ANULAREA: instantaneul foii din motor, apoi schimbarea ============================ */
function snap(ctx){const b=ctx.body.querySelector('button[data-rb="xf:snap"]');if(b&&b.onclick)b.onclick();}
function gata(ctx){ctx.S.draw();focus(ctx)}
function focus(ctx){const g=ctx.body.querySelector('#xgw');if(g)try{g.focus({preventScroll:true})}catch(e){}}
function schimba(ctx,fn){snap(ctx);fn();gata(ctx)}

/* ============================ COMENZILE ============================ */
function comuta(ctx,k){const z=selectia(ctx);const on=!(ctx.FMT[z.act]||{})[k];schimba(ctx,()=>peCelule(z,a=>{const f=F(ctx,a);if(on)f[k]=true;else delete f[k]}))}
function pune(ctx,k,v){const z=selectia(ctx);schimba(ctx,()=>peCelule(z,a=>{const f=F(ctx,a);if(v==null||v==='')delete f[k];else f[k]=v}))}
function aliniazaH(ctx,v){const z=selectia(ctx);const are=(ctx.FMT[z.act]||{}).al===v;schimba(ctx,()=>peCelule(z,a=>{const f=F(ctx,a);if(are)delete f.al;else f.al=v}))}
function aliniazaV(ctx,v){const z=selectia(ctx);const are=(ctx.FMT[z.act]||{}).va===v;const nou=(are||v==='bottom')?null:v;
  schimba(ctx,()=>peCelule(z,a=>{const f=F(ctx,a);if(nou)f.va=nou;else delete f.va}))}
function marime(ctx,fs){const z=selectia(ctx);schimba(ctx,()=>peCelule(z,a=>{const f=F(ctx,a);if(fs===11&&!f.stil)delete f.fs;else f.fs=fs}))}
function marimePas(ctx,plus){const z=selectia(ctx);const cur=(ctx.FMT[z.act]||{}).fs||11;
  const nou=plus?(MARIMI.find(x=>x>cur)||cur):([...MARIMI].reverse().find(x=>x<cur)||cur);marime(ctx,nou)}
/* formatul numerelor: codul pus pe toată zona; nf='x' spune foii din motor și stratului de tipuri că formatul l-a ales elevul */
function puneFormat(ctx,cod,z){z=z||selectia(ctx);schimba(ctx,()=>{peCelule(z,a=>{const f=F(ctx,a);if(cod==='General'){delete f.nfx;delete f.nf;delete f.dec;delete f.ax}else{f.nfx=cod;f.nf='x';delete f.dec}});largesteDupaFormat(ctx,z)})}
function zecimaleCmd(ctx,plus){const z=selectia(ctx);const o=afisare(ctx,z.act);if(!o.num)return;
  const nou=zecimale(o.cod,o.t,plus);if(nou===o.cod)return;puneFormat(ctx,nou,z)}
/* Excel lățește singur o coloană care n-a fost lățită de mână, când un număr nu mai încape (probat la tastare și la Accounting) */
function largesteDupaFormat(ctx,z){for(let c=z.c1;c<=z.c2;c++){const k='col:'+COL(c),f=ctx.FMT[k];if(f&&f.c)continue;let w=latime(ctx,c);
  for(let r=z.r1;r<=z.r2;r++){const a=adr(c,r);if(areaDe(ctx,c,r))continue;const o=afisare(ctx,a);if(o.num&&(o.diez||o.scurtat&&!/E/.test(o.t)&&intregNuIncape(o)))w=Math.max(w,nevoie(ctx,a))}
  if(w>latime(ctx,c)+1e-9)ctx.FMT[k]={w,c:false}}}
function intregNuIncape(o){return !/,/.test(o.t)&&Math.abs(o.v.v)>=1&&String(Math.round(Math.abs(o.v.v))).length>o.t.replace('-','').length}
function borduri(ctx,tip){const z=selectia(ctx);ULTIM.bd=tip;schimba(ctx,()=>aplicaBorduri(ctx,z,tip))}
const OPUS={t:'b',b:'t',l:'r',r:'l'};
function margine(ctx,c,r,lat,val){const {cols,rows}=dimF(ctx);const set=(cc,rr,s)=>{if(cc<0||rr<0||cc>=cols||rr>=rows)return;const f=F(ctx,adr(cc,rr));f.xb=f.xb||{};if(val)f.xb[s]=val;else delete f.xb[s];if(!Object.keys(f.xb).length)delete f.xb};
  set(c,r,lat);const d={t:[0,-1],b:[0,1],l:[-1,0],r:[1,0]}[lat];set(c+d[0],r+d[1],OPUS[lat])}
function aplicaBorduri(ctx,z,tip){const T='thin:#000000',M='medium:#000000',D='double:#000000';
  const sus=v=>{for(let c=z.c1;c<=z.c2;c++)margine(ctx,c,z.r1,'t',v)},jos=v=>{for(let c=z.c1;c<=z.c2;c++)margine(ctx,c,z.r2,'b',v)};
  const st=v=>{for(let r=z.r1;r<=z.r2;r++)margine(ctx,z.c1,r,'l',v)},dr=v=>{for(let r=z.r1;r<=z.r2;r++)margine(ctx,z.c2,r,'r',v)};
  ({bottom:()=>jos(T),top:()=>sus(T),left:()=>st(T),right:()=>dr(T),
    none:()=>peCelule(z,(a,c,r)=>['t','b','l','r'].forEach(s=>margine(ctx,c,r,s,null))),
    all:()=>peCelule(z,(a,c,r)=>['t','b','l','r'].forEach(s=>margine(ctx,c,r,s,T))),
    outside:()=>{sus(T);jos(T);st(T);dr(T)},thickOutside:()=>{sus(M);jos(M);st(M);dr(M)},
    doubleBottom:()=>jos(D),thickBottom:()=>jos(M),topBottom:()=>{sus(T);jos(T)},topThickBottom:()=>{sus(T);jos(M)},topDoubleBottom:()=>{sus(T);jos(D)}}[tip]||(()=>{}))()}
/* îmbinarea (proba_comenzi.json „imbinare” + proba_ascuns.json + proba_reguli.json) */
function continuturi(ctx,z){const o=[];peCelule(z,a=>{if(rawDe(ctx,a)!=='')o.push(a)});return o}
function imbina(ctx,mod){const z=selectia(ctx);const pa=pos(z.act);const m0=areaDe(ctx,pa.c,pa.r);
  if(mod==='center'&&m0){schimba(ctx,()=>{desface(ctx,z);peCelule(z,a=>{delete F(ctx,a).al})});return}        // al doilea clic: desface și scoate centrarea
  if(mod==='unmerge'){schimba(ctx,()=>desface(ctx,z));return}
  const unu=z.c1===z.c2&&z.r1===z.r2;
  if(unu){if(mod==='center')schimba(ctx,()=>{F(ctx,z.act).al='center'});return}                              // o singură celulă: doar centrare
  const bucati=mod==='across'?Array.from({length:z.r2-z.r1+1},(_,k)=>({c1:z.c1,c2:z.c2,r1:z.r1+k,r2:z.r1+k})).filter(b=>b.c2>b.c1):[z];
  if(!bucati.length)return;
  const faCe=()=>schimba(ctx,()=>{desface(ctx,z);bucati.forEach(b=>{const cont=continuturi(ctx,b),tl=adr(b.c1,b.r1);
    if(cont.length&&cont[0]!==tl){ctx.RAW[tl]=ctx.RAW[cont[0]]}
    peCelule(b,a=>{if(a!==tl)delete ctx.RAW[a]});ctx.MERGE.push({c1:b.c1,c2:b.c2,r1:b.r1,r2:b.r2});
    if(mod==='center')peCelule(b,a=>{F(ctx,a).al='center'})});ctx.S.setAct(adr(z.c1,z.r1))});
  if(bucati.some(b=>continuturi(ctx,b).length>1))avertismentImbinare(ctx,faCe);else faCe()}
function desface(ctx,z){for(let k=ctx.MERGE.length-1;k>=0;k--){const m=ctx.MERGE[k];if(!(m.c2<z.c1||m.c1>z.c2||m.r2<z.r1||m.r1>z.r2))ctx.MERGE.splice(k,1)}}
function golesteFormate(ctx){const z=selectia(ctx);schimba(ctx,()=>{peCelule(z,a=>{const f=ctx.FMT[a];if(!f)return;
  ['t','b','l','r'].forEach(s=>{if(f.xb&&f.xb[s]){const p=pos(a);margine(ctx,p.c,p.r,s,null)}});delete ctx.FMT[a]});desface(ctx,z)})}
function aplicaStil(ctx,nume){const S=STILURI[nume];if(!S)return;const z=selectia(ctx);
  schimba(ctx,()=>peCelule(z,(a,c,r)=>{const f=F(ctx,a);
    if(S.iF){['b','i','u','fs','color'].forEach(k=>delete f[k]);Object.entries(S.f||{}).forEach(([k,v])=>{if(k==='fill'||k==='usor')return;f[k]=v===1?true:v});if(S.f&&S.f.usor)f.usor=true;else delete f.usor}
    if(S.iU){delete f.fill;if(S.f&&S.f.fill)f.fill=S.f.fill}
    if(S.iB)['t','b','l','r'].forEach(s=>margine(ctx,c,r,s,(S.bd||{})[s]||null));
    if(S.iN){if(S.nf){f.nfx=S.nf;f.nf='x'}else{delete f.nfx;delete f.nf;delete f.dec;delete f.ax}}
    if(S.iA){delete f.al;delete f.va;delete f.wrap}
    if(nume==='Normal')delete f.stil;else f.stil=nume;
    if(nume==='Normal'){['b','i','u','fs','color','fill','usor'].forEach(k=>delete f[k])}}))}
/* lățimi și înălțimi */
function puneLatime(ctx,cols,w,custom){cols.forEach(c=>{ctx.FMT['col:'+COL(c)]={w:Math.max(0,Math.min(255,w)),c:custom!==false}})}
function potrivesteColoane(ctx,cols,doarZ){cols.forEach(c=>{let w=0,are=false;const {rows}=dimF(ctx);
  for(let r=0;r<rows;r++){if(doarZ&&(r<doarZ.r1||r>doarZ.r2))continue;const a=adr(c,r);if(areaDe(ctx,c,r))continue;if(rawDe(ctx,a)==='')continue;are=true;w=Math.max(w,nevoie(ctx,a))}
  ctx.FMT['col:'+COL(c)]={w:are?w:ctx.stdW,c:true}})}
function puneInaltime(ctx,rows,h){rows.forEach(r=>{ctx.FMT['row:'+(r+1)]={h:Math.max(0,Math.min(409,h))}})}
function potrivesteRanduri(ctx,rows){rows.forEach(r=>{delete ctx.FMT['row:'+(r+1)]})}
function coloaneSel(ctx){const z=selectia(ctx);return Array.from({length:z.c2-z.c1+1},(_,k)=>z.c1+k)}
function randuriSel(ctx){const z=selectia(ctx);return Array.from({length:z.r2-z.r1+1},(_,k)=>z.r1+k)}

/* ============================ FERESTRE ȘI MENIURI (desenate peste pagină) ============================ */
let MEN=null,menT=0;
function inchideMeniu(){if(MEN){MEN.remove();MEN=null}}
function nota(ctx,html){const w=ctx.body.querySelector('#xwrap');if(!w)return;let n=w.nextElementSibling;
  if(!n||!n.classList.contains('xp-nota')){n=document.createElement('div');n.className='xp-nota';n.setAttribute('aria-live','polite');w.after(n)}n.innerHTML=html||''}
const nesim=(ctx,nume,cum)=>nota(ctx,`„${esc(nume)}” e și în Excel${cum?', '+cum:''}, dar foaia din pagină nu-l are. Azi lucrezi cu butoanele din panglică.`);
function meniu(ctx,ancora,html,lat){inchideMeniu();css();const m=document.createElement('div');m.className='xf-meniu';m.setAttribute('role','menu');m.innerHTML=html;
  if(lat)m.style.width=lat;document.body.appendChild(m);MEN=m;menT=Date.now();
  const r=ancora.getBoundingClientRect(),mr=m.getBoundingClientRect();
  let x=r.left,y=r.bottom+2;if(x+mr.width>innerWidth-4)x=Math.max(4,innerWidth-mr.width-4);if(y+mr.height>innerHeight-4)y=Math.max(4,Math.min(r.top-mr.height-2,innerHeight-mr.height-4));
  m.style.left=x+'px';m.style.top=y+'px';m.addEventListener('pointerdown',e=>e.stopPropagation());
  const f=m.querySelector('button:not([disabled])');if(f)try{f.focus({preventScroll:true})}catch(e){}
  return m}
function peMeniu(m,fn){m.querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();const v=b.dataset.m;inchideMeniu();fn(v,b)}))}
function dialog(ctx,titlu,corp,ok,etOk){css();const d=document.createElement('div');d.className='xp-fundal xf-fundal';
  d.innerHTML=`<div class="xp-dlg xf-dlg" role="dialog" aria-modal="true" aria-label="${esc(titlu)}"><b>${titlu}</b>${corp}
    <div class="xp-bt"><button class="btn primary" type="button" data-ok="1">${etOk||'OK'}</button><button class="btn" type="button" data-no="1">Cancel (Revocare)</button></div></div>`;
  document.body.appendChild(d);const inch=()=>{d.remove();focus(ctx)};
  d.querySelector('[data-no]').onclick=inch;d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();inch()}if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();d.querySelector('[data-ok]').click()}});
  d.querySelector('[data-ok]').onclick=()=>{if(ok(d)!==false)inch()};
  const i=d.querySelector('input')||d.querySelector('[data-ok]');try{i.focus();if(i.select)i.select()}catch(e){}
  return d}
function avertismentImbinare(ctx,faCe){dialog(ctx,'Microsoft Excel',`<p class="xf-av"><span aria-hidden="true">⚠</span> Merging cells only keeps the upper-left value and discards other values.</p>
  <p class="xf-tr">(Îmbinarea păstrează doar valoarea din stânga-sus; celelalte se șterg.)</p>`,()=>{setTimeout(faCe,0)})}
const nrRo=x=>String(Math.round(x*100)/100).replace('.',',');
function dialogNumar(ctx,titlu,eticheta,val,max,ok){dialog(ctx,titlu,`<label class="xf-camp">${eticheta} <input type="text" inputmode="decimal" value="${esc(nrRo(val))}" autocomplete="off"></label><p class="xf-err" role="alert"></p>`,
  d=>{const t=d.querySelector('input').value.trim().replace(',','.');const x=Number(t);
    if(t===''||!isFinite(x)||x<0||x>max){d.querySelector('.xf-err').textContent=`Excel primește doar un număr între 0 și ${max}.`;return false}
    ok(x)})}
function paleta(ctx,ancora,cheie){const auto=cheie==='font';
  const sw=(cul,t)=>`<button type="button" class="xf-sw" data-m="${cul}" title="${esc(t)}" aria-label="${esc(t)}" style="background:${cul}"></button>`;
  let h=`<div class="xf-pt">${auto?'<button type="button" class="xf-rand" data-m="">Automatic (Automat)</button>':''}<div class="xf-et">Theme Colors</div><div class="xf-gr">`;
  TEMA.forEach(([n,b])=>{h+=sw(b,n)});h+='</div><div class="xf-gr xf-nu">';
  for(let k=0;k<5;k++)TEMA.forEach(([n,b,t,nn])=>{h+=sw(t[k],n+', '+(nn||NUANTE)[k])});
  h+='</div><div class="xf-et">Standard Colors</div><div class="xf-gr">'+STANDARD.map(([n,c])=>sw(c,n)).join('')+'</div>';
  if(!auto)h+='<button type="button" class="xf-rand" data-m="">No Fill (Fără umplere)</button>';
  h+='<button type="button" class="xf-rand" data-m="more">More Colors… (Mai multe culori…)</button></div>';
  const m=meniu(ctx,ancora,h);peMeniu(m,v=>{if(v==='more')return nesim(ctx,'More Colors…','în fereastra de culori');
    if(v)ULTIM[auto?'font':'fill']=v;pune(ctx,auto?'color':'fill',v||null)})}
function meniuBorduri(ctx,ancora){const h=`<div class="xf-et">Borders</div>`+BORDURI.map(x=>x==='-'?'<hr>':`<button type="button" data-m="${x[0]}"><span class="xf-ic xf-bd-${x[0]}" aria-hidden="true"></span>${x[1]} <small>(${x[2]})</small></button>`).join('')+
  `<hr><div class="xf-et">Draw Borders</div><button type="button" data-m="draw">Draw Border (Desenare bordură)</button><button type="button" data-m="more">More Borders… (Mai multe borduri…)</button>`;
  const m=meniu(ctx,ancora,h);peMeniu(m,v=>{if(v==='draw'||v==='more')return nesim(ctx,v==='draw'?'Draw Border':'More Borders…');borduri(ctx,v)})}
function meniuImbinare(ctx,ancora){const m=meniu(ctx,ancora,[['center','Merge &amp; Center (Îmbinare și centrare)'],['across','Merge Across (Îmbinare pe rânduri)'],['cells','Merge Cells (Îmbinare celule)'],['unmerge','Unmerge Cells (Anulare îmbinare)']]
  .map(([k,t])=>`<button type="button" data-m="${k}">${t}</button>`).join(''));peMeniu(m,v=>imbina(ctx,v))}
function listaFormate(ctx,ancora){const z=selectia(ctx),o=afisare(ctx,z.act);const v=o.v&&o.v.tip==='num'?o.v.v:null;
  const m=meniu(ctx,ancora,LISTA_NF.map(([n,cod,ds])=>{let ex=ds||'';if(!ds&&v!=null){const r=formateaza(v,cod);ex=r.diez?'#####':(r.minus?'-':'')+String(r.t).replace(/[  ]/g,'')}else if(!ds&&o.text)ex=o.t;
    return `<button type="button" data-m="${esc(n)}"><b>${n}</b><small>${esc(ex)}</small></button>`}).join('')+'<hr><button type="button" data-m="more">More Number Formats… (Mai multe formate de număr…)</button>','15.5em');
  peMeniu(m,n=>{if(n==='more')return nesim(ctx,'More Number Formats…','în fereastra Format Cells (Formatare celule)');const x=LISTA_NF.find(y=>y[0]===n);if(x)puneFormat(ctx,x[1])})}
function listaMarimi(ctx,ancora){const cur=(ctx.FMT[selectia(ctx).act]||{}).fs||11;
  const m=meniu(ctx,ancora,MARIMI.map(x=>`<button type="button" data-m="${x}" class="${x===cur?'on':''}">${x}</button>`).join(''),'5em');peMeniu(m,v=>marime(ctx,+v))}
function galerieStiluri(ctx,ancora){let h='';GRUPE_STIL.forEach((g,gi)=>{h+=`<div class="xf-et">${g}</div><div class="xf-st">`;
  Object.entries(STILURI).filter(([n,s])=>s.g===gi).forEach(([n,s])=>{const f=s.f||{},bd=s.bd||{};
    const st=[f.fill?'background:'+f.fill:'',f.color?'color:'+f.color:'',f.b?'font-weight:700':'',f.i?'font-style:italic':'',f.fs?'font-size:'+Math.min(1.25,f.fs/11)+'em':'',
      ...['t','b','l','r'].map(k=>bd[k]?`border-${{t:'top',b:'bottom',l:'left',r:'right'}[k]}:${bordCss(bd[k],1)}`:'')].filter(Boolean).join(';');
    h+=`<button type="button" data-m="${esc(n)}" title="${esc(n)}" style="${st}">${esc(n)}</button>`});h+='</div>'});
  h+='<hr><button type="button" data-m="new" class="xf-rand">New Cell Style… (Stil de celulă nou…)</button>';
  const m=meniu(ctx,ancora,h,'min(40em,94vw)');m.classList.add('xf-gal');peMeniu(m,v=>{if(v==='new')return nesim(ctx,'New Cell Style…');aplicaStil(ctx,v)})}
function meniuFormat(ctx,ancora){const it=[['lbl','Cell Size'],['rh','Row Height… (Înălțime rând…)'],['arh','AutoFit Row Height (Potrivire automată înălțime rând)'],['cw','Column Width… (Lățime coloană…)'],
  ['acw','AutoFit Column Width (Potrivire automată lățime coloană)'],['dw','Default Width… (Lățime implicită…)'],['lbl','Visibility'],['hide','Hide &amp; Unhide ▸ (Ascundere și reafișare)'],
  ['lbl','Organize Sheets'],['ren','Rename Sheet (Redenumire foaie)'],['mov','Move or Copy Sheet… (Mutare sau copiere…)'],['tab','Tab Color ▸ (Culoare filă)'],['lbl','Protection'],['prot','Protect Sheet… (Protejare foaie…)'],['lock','Lock Cell (Blocare celulă)'],['fc','Format Cells… (Formatare celule…)']];
  const m=meniu(ctx,ancora,it.map(([k,t])=>k==='lbl'?`<div class="xf-et">${t}</div>`:`<button type="button" data-m="${k}">${t}</button>`).join(''),'min(22em,94vw)');
  peMeniu(m,v=>formatCmd(ctx,v))}
function formatCmd(ctx,v){const z=selectia(ctx);
  if(v==='rh')return dialogNumar(ctx,'Row Height (Înălțime rând)','Row height (înălțimea rândului, în puncte):',inaltime(ctx,z.r1),409,x=>schimba(ctx,()=>puneInaltime(ctx,randuriSel(ctx),x)));
  if(v==='cw')return dialogNumar(ctx,'Column Width (Lățime coloană)','Column width (lățimea coloanei, în caractere):',latime(ctx,z.c1),255,x=>schimba(ctx,()=>puneLatime(ctx,coloaneSel(ctx),x)));
  if(v==='dw')return dialogNumar(ctx,'Standard Width (Lățime standard)','Standard column width (lățimea standard a coloanelor):',ctx.stdW,255,x=>schimba(ctx,()=>{ctx.stdW=x;Object.keys(ctx.FMT).forEach(k=>{if(/^col:/.test(k)&&!ctx.FMT[k].c)delete ctx.FMT[k]})}));
  if(v==='arh')return schimba(ctx,()=>potrivesteRanduri(ctx,randuriSel(ctx)));
  if(v==='acw')return schimba(ctx,()=>potrivesteColoane(ctx,coloaneSel(ctx),coloaneIntregi(ctx,z)?null:z));
  nesim(ctx,{hide:'Hide & Unhide',ren:'Rename Sheet',mov:'Move or Copy Sheet…',tab:'Tab Color',prot:'Protect Sheet…',lock:'Lock Cell',fc:'Format Cells…'}[v]||v)}

/* ============================ PANGLICA: butoanele de formatare ale filei Pornire (Home) ============================ */
const T=(ro,en,sc)=>`${ro} (${en})${sc?' · '+sc:''}`;
const MINE={Bold:T('Aldin','Bold','Ctrl+B'),Italic:T('Cursiv','Italic','Ctrl+I'),Underline:T('Subliniat','Underline','Ctrl+U'),
  Font:T('Font','Font'),FontSize:T('Dimensiune font','Font Size'),FontSizeIncrease:T('Mărire font','Increase Font Size'),FontSizeDecrease:T('Micșorare font','Decrease Font Size'),
  BorderBottomNoToggle:T('Borduri','Borders')+' — butonul pune ultima bordură; ▾ deschide lista',CellFillColorPicker:T('Culoare de umplere','Fill Color')+' — butonul pune culoarea lui; ▾ deschide paleta',
  FontColorPicker:T('Culoare font','Font Color')+' — butonul pune culoarea lui; ▾ deschide paleta',FormatCellsFontDialog:'Format Cells: Font',
  AlignTopExcel:T('Aliniere sus','Top Align'),AlignMiddleExcel:T('Aliniere la mijloc','Middle Align'),AlignBottomExcel:T('Aliniere jos','Bottom Align'),
  OrientationMenu:'Orientation',TextDirectionLeftToRight:'Text Direction',AlignLeft:T('Aliniere la stânga','Align Left'),AlignCenter:T('Centrare','Center'),AlignRight:T('Aliniere la dreapta','Align Right'),
  IndentDecreaseExcel:'Decrease Indent',IndentIncreaseExcel:'Increase Indent',WrapText:T('Încadrare text','Wrap Text'),MergeCenter:T('Îmbinare și centrare','Merge & Center')+' — ▾ alte îmbinări',
  CellAlignmentOptions:'Format Cells: Alignment',NumberFormatGallery:T('Format număr','Number Format'),InternationalCurrency:T('Format contabil','Accounting Number Format'),
  PercentStyle:T('Stil procent','Percent Style','Ctrl+Shift+%'),CommaStyle:T('Stil virgulă','Comma Style'),DecimalsIncrease:T('Mărire zecimale','Increase Decimal'),DecimalsDecrease:T('Micșorare zecimale','Decrease Decimal'),
  FormatCellsNumberDialog:'Format Cells: Number',CellStylesGallery:T('Stiluri celule','Cell Styles'),FormatCellsMenu:T('Format','Format')+' — lățimea coloanei, înălțimea rândului',ClearFormatsX:'Clear Formats'};
/* ATING = ecran cu deget (telefon, tabletă). Pe el panglica se mărește (butoane >= 35 px, regula 20 / M3) și grupurile
   Font, Aliniere, Număr se așază pe DOUĂ rânduri, în aceeași ordine ca în Excel, cu numele scris sub fiecare buton
   (pe telefon nu există „ține mouse-ul pe buton”). Pe ecranul cu mouse, panglica rămâne ca în Excel. */
const ATING=!!(window.matchMedia&&matchMedia('(pointer: coarse)').matches);
const ZOOM_PG=1.75;
const SPLIT=new Set(['BorderBottomNoToggle','CellFillColorPicker','FontColorPicker','Underline','MergeCenter']);
const NUME_VIZ={Bold:'Bold',Italic:'Italic',Underline:'Underline',BorderBottomNoToggle:'Borders',CellFillColorPicker:'Fill Color',FontColorPicker:'Font Color',
  FontSizeIncrease:'Font Size ▲',FontSizeDecrease:'Font Size ▼',AlignTopExcel:'Top Align',AlignMiddleExcel:'Middle Align',AlignBottomExcel:'Bottom Align',
  OrientationMenu:'Orientation',TextDirectionLeftToRight:'Text Direction',AlignLeft:'Align Left',AlignCenter:'Center',AlignRight:'Align Right',
  IndentDecreaseExcel:'Decrease Indent',IndentIncreaseExcel:'Increase Indent',NumberFormatGallery:'Number Format',InternationalCurrency:'Accounting',
  PercentStyle:'Percent Style',CommaStyle:'Comma Style',DecimalsIncrease:'Increase Decimal',DecimalsDecrease:'Decrease Decimal'};
const GRUPE_TEL=['Font','Alignment','Number'];
/* copia datelor panglicii (datele comune nu se schimbă): Borders și Underline au lățimea lui Fill Color (în dump-ul
   UI Automation apare doar partea cu pictograma; săgeata ▾ e lângă ea); pe ecranul cu deget, rândurile rearanjate */
function panglicaMea(date){const k=ATING?'_xfT':'_xfM';if(date[k])return date[k];const d=JSON.parse(JSON.stringify(date));
  d.file.forEach(f=>{if(f.id!=='TabHome')return;f.grupuri.forEach(g=>{g.butoane.forEach(b=>{if(b.id==='BorderBottomNoToggle'||b.id==='Underline')b.rect[2]=49});
    if(ATING){if(GRUPE_TEL.includes(g.eticheta))aranjeazaTel(g);g.inaltime=Math.max(g.inaltime,158)}})});
  Object.defineProperty(date,k,{value:d,enumerable:false});return d}
function aranjeazaTel(g){const lans=g.butoane.filter(b=>b.lansator),rest=g.butoane.filter(b=>!b.lansator);
  const r1=rest.filter(b=>b.rect[1]<40).sort((a,b)=>a.rect[0]-b.rect[0]),r2=rest.filter(b=>b.rect[1]>=40).sort((a,b)=>a.rect[0]-b.rect[0]);
  const Y=[6,72],CAP=30;let lat=0;
  [r1,r2].forEach((rand,k)=>{let x=8;rand.forEach(b=>{const cb=b.tip_uia==='ComboBox',et=(b.rect[2]>=60&&!cb)||b.marime==='mare';
    const w=cb?b.rect[2]:et?b.rect[2]:(SPLIT.has(b.id)?60:30);const loc=cb||et?w:Math.max(w,50);
    b.rect=[x+(loc-w)/2,Y[k],w,30];b._cap=[x,Y[k]+31,loc,CAP];b._et=et;x+=loc+5});lat=Math.max(lat,x+4)});
  g.latime=Math.max(lat,g.latime*0.6);lans.forEach(b=>{b.rect=[g.latime-22,136,20,20]})}
function infasoara(){const U=window.UiPanglica;if(!U||U._xf)return;U._xf=1;const html0=U.html;
  U.html=function(date,opt){if(date===window.PANGLICA_EXCEL&&opt&&opt.legaturi){const leg=Object.assign({},opt.legaturi);
      Object.entries(MINE).forEach(([id,title])=>{leg[id]={attr:`data-xf="${id}"`,title}});opt=Object.assign({},opt,{legaturi:leg});date=panglicaMea(date)}
    return html0.call(this,date,opt)}}
addEventListener('panglica-excel',infasoara);infasoara();
const inghetat=ctx=>!!(ctx.api&&ctx.api.done&&ctx.api.done()&&!ctx.Q.o);   // după „Corect!” foaia din motor nu mai primește gesturi
function actiune(ctx,id,b,sag){if(inghetat(ctx))return;
  const nes={Font:'Font (numele fontului)',FormatCellsFontDialog:'Format Cells: Font',OrientationMenu:'Orientation (Orientare)',TextDirectionLeftToRight:'Text Direction',
    IndentDecreaseExcel:'Decrease Indent',IndentIncreaseExcel:'Increase Indent',CellAlignmentOptions:'Format Cells: Alignment',FormatCellsNumberDialog:'Format Cells: Number'};
  if(nes[id])return nesim(ctx,nes[id],/Dialog|Options/.test(id)?'în fereastra Format Cells (Formatare celule)':'');
  switch(id){
    case 'Bold':return comuta(ctx,'b');case 'Italic':return comuta(ctx,'i');
    case 'Underline':return sag?nesim(ctx,'Double Underline (subliniere dublă)'):comuta(ctx,'u');
    case 'FontSize':return listaMarimi(ctx,b);case 'FontSizeIncrease':return marimePas(ctx,true);case 'FontSizeDecrease':return marimePas(ctx,false);
    case 'BorderBottomNoToggle':return sag?meniuBorduri(ctx,b):borduri(ctx,ULTIM.bd);
    case 'CellFillColorPicker':return sag?paleta(ctx,b,'fill'):pune(ctx,'fill',ULTIM.fill);
    case 'FontColorPicker':return sag?paleta(ctx,b,'font'):pune(ctx,'color',ULTIM.font);
    case 'AlignTopExcel':return aliniazaV(ctx,'top');case 'AlignMiddleExcel':return aliniazaV(ctx,'middle');case 'AlignBottomExcel':return aliniazaV(ctx,'bottom');
    case 'AlignLeft':return aliniazaH(ctx,'left');case 'AlignCenter':return aliniazaH(ctx,'center');case 'AlignRight':return aliniazaH(ctx,'right');
    case 'WrapText':return comuta(ctx,'wrap');
    case 'MergeCenter':return sag?meniuImbinare(ctx,b):imbina(ctx,'center');
    case 'NumberFormatGallery':return listaFormate(ctx,b);
    case 'InternationalCurrency':return sag?nesim(ctx,'alte monede (lista contabilă)'):puneFormat(ctx,ACC);
    case 'PercentStyle':return puneFormat(ctx,'0%');case 'CommaStyle':return puneFormat(ctx,COMMA);
    case 'DecimalsIncrease':return zecimaleCmd(ctx,true);case 'DecimalsDecrease':return zecimaleCmd(ctx,false);
    case 'CellStylesGallery':return galerieStiluri(ctx,b);
    case 'FormatCellsMenu':return meniuFormat(ctx,b);}}

/* ============================ DESENUL (după fiecare desen al foii din motor) ============================ */
const CSS=`.xl.xf table{table-layout:fixed;font-family:${FONT};font-size:${(11*4/3*Z).toFixed(2)}px}
.xl.xf td{min-width:0;max-width:none;height:auto;padding:0 ${PAD*Z}px;text-overflow:clip;vertical-align:bottom;line-height:1.15;font-variant-numeric:normal;box-sizing:border-box}
.xl.xf th{min-width:0;padding:2px 0;position:relative;box-sizing:border-box;font-family:"Segoe UI",system-ui,sans-serif}
.xl.xf thead th{text-align:center}
.xl.xf td.xf-wrap{white-space:normal;word-break:normal;overflow-wrap:normal}
.xl.xf td .xf-sp{display:inline-block;white-space:nowrap;overflow:hidden;position:relative;z-index:1;vertical-align:bottom;pointer-events:none}
.xl.xf td.xf-cont{padding-right:0}
.xl.xf td .xf-minus{float:left}
.xf-rc,.xf-rr{position:absolute;z-index:3;touch-action:none;background:transparent}
.xf-rc{top:0;right:-5px;width:10px;height:100%;cursor:col-resize}
.xf-rr{left:0;bottom:-5px;height:10px;width:100%;cursor:row-resize}
@media (pointer:coarse){.xf-rc{right:-9px;width:18px}.xf-rr{bottom:-8px;height:16px}}
.xf-rc:hover,.xf-rc.on{background:linear-gradient(90deg,transparent 4px,var(--xlg,#217346) 4px,var(--xlg,#217346) 6px,transparent 6px)}
.xf-rr:hover,.xf-rr.on{background:linear-gradient(180deg,transparent 4px,var(--xlg,#217346) 4px,var(--xlg,#217346) 6px,transparent 6px)}
.xf-bula{position:fixed;z-index:95;background:#FFFFE1;color:#000;border:1px solid #767676;font:12px "Segoe UI",system-ui,sans-serif;padding:2px 6px;pointer-events:none;white-space:nowrap}
.xf-meniu{position:fixed;z-index:80;max-width:94vw;max-height:72vh;overflow:auto;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:8px;box-shadow:0 10px 28px rgba(0,0,0,.28);padding:4px 0;font-family:var(--fb);font-size:.9rem}
.xf-meniu>button,.xf-meniu .xf-rand{display:flex;gap:8px;align-items:center;width:100%;text-align:left;border:0;background:none;color:inherit;font:inherit;padding:7px 12px;cursor:pointer}
.xf-meniu>button small{color:var(--ink2);font-size:.8em}
.xf-meniu>button:hover,.xf-meniu>button:focus-visible,.xf-meniu .xf-rand:hover{background:var(--sel);outline:none}
.xf-meniu>button.on{font-weight:700}
.xf-meniu hr{border:0;border-top:1px solid var(--line);margin:4px 0}
.xf-meniu .xf-et{padding:6px 12px 2px;font-size:.78rem;font-weight:700;color:var(--ink2)}
.xf-pt{padding:2px 0}
.xf-gr{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;padding:3px 12px}
.xf-gr.xf-nu{gap:0 3px}
.xf-sw{width:22px;height:20px;border:1px solid #C8C8C8;padding:0;cursor:pointer;border-radius:0}
.xf-sw:hover,.xf-sw:focus-visible{outline:2px solid #E4002B;outline-offset:0}
@media (pointer:coarse){.xf-sw{width:32px;height:32px}}
.xf-gal .xf-st{display:flex;flex-wrap:wrap;gap:4px;padding:3px 10px}
.xf-gal .xf-st button{flex:0 0 auto;min-width:7.2em;padding:5px 6px;border:1px solid transparent;background:#fff;color:#000;font:13px ${FONT};cursor:pointer;text-align:left}
.xf-gal .xf-st button:hover{outline:2px solid var(--xlg,#217346)}
.xf-meniu>button b{min-width:6.5em;display:inline-block}
.xf-ic{display:inline-block;width:14px;height:14px;border:1px dotted #999;flex:0 0 auto}
.xf-bd-bottom{border-bottom:2px solid currentColor}.xf-bd-top{border-top:2px solid currentColor}.xf-bd-left{border-left:2px solid currentColor}.xf-bd-right{border-right:2px solid currentColor}
.xf-bd-all{border:1px solid currentColor;background:linear-gradient(currentColor,currentColor) center/1px 100% no-repeat,linear-gradient(currentColor,currentColor) center/100% 1px no-repeat}
.xf-bd-outside{border:1.5px solid currentColor}.xf-bd-thickOutside{border:3px solid currentColor}.xf-bd-doubleBottom{border-bottom:3px double currentColor}
.xf-bd-thickBottom{border-bottom:3px solid currentColor}.xf-bd-topBottom{border-top:1.5px solid currentColor;border-bottom:1.5px solid currentColor}
.xf-bd-topThickBottom{border-top:1.5px solid currentColor;border-bottom:3px solid currentColor}.xf-bd-topDoubleBottom{border-top:1.5px solid currentColor;border-bottom:3px double currentColor}
.xf-dlg .xf-camp{display:flex;flex-direction:column;gap:6px;font-size:.94rem}
.xf-dlg .xf-camp input{font:inherit;padding:5px 8px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink);width:8em}
.xf-dlg .xf-err{color:var(--bad);font-size:.88rem;margin:6px 0 0;min-height:1em}
.xf-dlg .xf-av{margin:4px 0}.xf-dlg .xf-tr{margin:4px 0;color:var(--ink2);font-size:.88rem}
.xl.xf .pg .pg-b.xf-split{justify-content:space-between;padding:0 0 0 2px;gap:0}
.xl.xf .pg .pg-b.xf-split>svg{margin:0 auto}
.xl.xf .pg .pg-b.xf-split .pg-sag{flex:0 0 12px;align-self:stretch;display:flex;align-items:center;justify-content:center;border-left:1px solid transparent;font-size:.62rem;opacity:.85}
.xl.xf .pg .pg-b.xf-split:hover .pg-sag{border-left-color:var(--line)}
.xl.xf .pg .xf-gl{display:inline-block;font:700 7.5px/1.05 "Segoe UI",Arial,sans-serif;color:var(--ink);text-align:right;letter-spacing:-.02em}
.xl.xf .pg .xf-gl i{font-style:normal;color:#2B7CD3;font-size:9px;margin-right:1px}
.xl.xf .pg .xf-com{font:900 20px/0.6 Georgia,"Times New Roman",serif;color:var(--ink);margin-top:-6px}
.xl.xf .pg .xf-cap{position:absolute;display:none;text-align:center;font:600 6.4px/1.12 "Segoe UI",system-ui,sans-serif;color:var(--ink2);overflow:hidden;pointer-events:none;word-break:normal;overflow-wrap:anywhere}
.xf-grip{display:none}
@media (pointer:coarse){
  .xl.xf .pg .pg-banda{zoom:${ZOOM_PG}}
  .xl.xf .pg .xf-cap{display:block}
  .xl.xf .pg .pg-b.xf-split .pg-sag{flex-basis:20px;border-left-color:var(--line)}
  .xl.xf .rb .tabs .qat button{min-width:40px;min-height:36px}
  .xl.xf .xf-rc,.xl.xf .xf-rr{display:none}
  .xl.xf thead th{touch-action:none}
  .xl.xf .xf-grip{display:flex;position:absolute;z-index:4;width:34px;height:34px;border-radius:50%;background:var(--xlg,#217346);color:#fff;align-items:center;justify-content:center;font:700 17px/1 system-ui,sans-serif;touch-action:none;box-shadow:0 1px 5px #0007;border:2px solid #fff}
  .xl.xf .xf-grip.c{right:-17px;top:0}
  .xl.xf .xf-grip.r{bottom:-17px;left:50%;margin-left:-17px}
  .xf-meniu>button{min-height:38px}
  .xf-gal .xf-st button{min-height:36px}
  .xf-gr{gap:2px;padding:3px 6px}
}
.xl.xf .pg-b.pg-on{border-color:var(--xlg,#217346);background:var(--sel)}`;
function css(){if(!document.getElementById('xf-css')){const s=document.createElement('style');s.id='xf-css';s.textContent=CSS;document.head.appendChild(s)}
  if(!document.getElementById('xf-font')){const l=document.createElement('link');l.id='xf-font';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap';document.head.appendChild(l);
    try{document.fonts.load(`400 18px Carlito`).then(()=>{MEM.clear();lista.forEach(c=>{if(c.body.isConnected)c.S.draw()})}).catch(()=>{})}catch(e){}}}
function bordCss(v,z){if(!v)return '';const [s,c0]=String(v).split(':');const c=c0||'#000000';const w={thin:1,medium:2,thick:3,double:3}[s]||1;
  return `${Math.max(1,Math.round(w*(z||Z)))}px ${s==='double'?'double':'solid'} ${c.toUpperCase()==='#000000'?'var(--xf-bd,#000)':c}`}
function margini(ctx,c,r){const {cols,rows}=dimF(ctx);const g=(cc,rr,s)=>cc<0||rr<0||cc>=cols||rr>=rows?null:((ctx.FMT[adr(cc,rr)]||{}).xb||{})[s]||null;
  const mg=areaDe(ctx,c,r);if(mg){const o={t:null,b:null,l:null,r:null};
    for(let cc=mg.c1;cc<=mg.c2;cc++){o.t=o.t||g(cc,mg.r1,'t')||g(cc,mg.r1-1,'b');o.b=o.b||g(cc,mg.r2,'b')||g(cc,mg.r2+1,'t')}
    for(let rr=mg.r1;rr<=mg.r2;rr++){o.l=o.l||g(mg.c1,rr,'l')||g(mg.c1-1,rr,'r');o.r=o.r||g(mg.c2,rr,'r')||g(mg.c2+1,rr,'l')}return o}
  return {t:g(c,r,'t')||g(c,r-1,'b'),b:g(c,r,'b')||g(c,r+1,'t'),l:g(c,r,'l')||g(c-1,r,'r'),r:g(c,r,'r')||g(c+1,r,'l')}}
function deseneaza(ctx){const w=ctx.body.querySelector('#xwrap');if(!w)return;const xl=w.querySelector('.xl');if(!xl)return;xl.classList.add('xf');
  const {cols,rows}=dimF(ctx);const tabel=xl.querySelector('.gw table');if(!tabel)return;const editeaza=!/^Gata/.test((xl.querySelector('.st span')||{}).textContent||'Gata');
  const dark=matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches&&document.documentElement.dataset.theme!=='light'||document.documentElement.dataset.theme==='dark';
  xl.style.setProperty('--xf-bd',dark?'var(--ink)':'#000');
  // lățimile coloanelor (primul rând al tabelului hotărăște, table-layout:fixed)
  const ths=tabel.querySelectorAll('thead th');let tot=40;ths.forEach((th,i)=>{if(!i){th.style.width='40px';return}const px=pxCol(ctx,i-1);tot+=px;th.style.width=px+'px';
    if(!th.querySelector('.xf-rc')){const h=document.createElement('span');h.className='xf-rc';h.dataset.col=i-1;h.setAttribute('aria-hidden','true');th.appendChild(h)}
    th.title=`${COL(i-1)} · lățime ${nrRo(latime(ctx,i-1))} (${colPx(latime(ctx,i-1))} pixeli)`});
  tabel.style.width=tot+'px';
  ctx.afis={};
  tabel.querySelectorAll('tbody tr').forEach((tr,r)=>{const hpt=inaltime(ctx,r);tr.style.height=Math.max(ATING?32:0,Math.round(hpt*4/3*Z))+'px';
    const th=tr.querySelector('th');if(th&&!th.querySelector('.xf-rr')){const h=document.createElement('span');h.className='xf-rr';h.dataset.row=r;h.setAttribute('aria-hidden','true');th.appendChild(h)}
    if(th)th.title=`rândul ${r+1} · înălțime ${nrRo(hpt)} puncte`});
  tabel.querySelectorAll('td[data-a]').forEach(td=>{const a=td.dataset.a,p=pos(a),f=ctx.FMT[a]||{};const o=afisare(ctx,a);ctx.afis[a]=o;
    const s=td.style;if(f.fs)s.fontSize=(f.fs*4/3*Z)+'px';if(f.usor)s.fontWeight='300';
    const cul=f.color||(o.rosu?'#C00000':o.eroare?'':(f.fill?'#000':''));if(cul)s.color=cul;
    const al=f.al||o.al||'left';s.textAlign=al==='general'?'':al;s.verticalAlign={top:'top',middle:'middle'}[f.va]||'bottom';
    td.classList.toggle('xf-wrap',!!f.wrap&&!!o.text);td.classList.toggle('xf-cont',!!o.cont);
    const m=margini(ctx,p.c,p.r);s.borderTop=m.t?bordCss(m.t):'';s.borderBottom=m.b?bordCss(m.b):'';s.borderLeft=m.l?bordCss(m.l):'';s.borderRight=m.r?bordCss(m.r):'';
    s.overflow='';
    if(editeaza&&td.classList.contains('act'))return;                        // celula în care scrii acum: textul tău
    if(o.eroare){return}
    const fh=td.querySelector('.fh');td.textContent='';
    if(o.text&&!f.wrap){const need=lat(o.t,o.font),mg=areaDe(ctx,p.c,p.r);
      if(need>o.disp+0.5&&!mg){let extra=0;
        if(al==='left'||al==='general'){for(let c=p.c+1;c<cols&&extra<need-o.disp;c++){const b=adr(c,p.r);if(rawDe(ctx,b)!==''||areaDe(ctx,c,p.r))break;extra+=pxCol(ctx,c)}}
        const sp=document.createElement('span');sp.className='xf-sp';sp.style.maxWidth=Math.max(0,o.disp+extra)+'px';sp.textContent=o.t;
        if(al==='right'){sp.style.maxWidth=o.disp+'px';sp.style.direction='rtl'}
        if(extra)s.overflow='visible';td.appendChild(sp)}
      else td.appendChild(document.createTextNode(o.t))}
    else if(o.minus){const mi=document.createElement('span');mi.className='xf-minus';mi.textContent='-';td.appendChild(mi);td.appendChild(document.createTextNode(o.t))}
    else td.appendChild(document.createTextNode(o.t==null?'':o.t));
    if(fh)td.appendChild(fh)});
  // pe ecranul cu deget: mânerul de lățime / înălțime apare pe marginea coloanei (rândului) selectate întregi
  if(ATING&&!editeaza){const z=selectia(ctx);const pune=(th,cls,k,v,t)=>{if(!th)return;const g=document.createElement('span');g.className='xf-grip '+cls;g.dataset[k]=v;g.textContent=t;
      g.setAttribute('aria-label',k==='col'?`Lățimea coloanei ${COL(+v)}: trage mânerul; două atingeri = potrivire automată`:`Înălțimea rândului ${+v+1}: trage mânerul`);th.appendChild(g)};
    const at=ctx.antetAtins;
    if(coloaneIntregi(ctx,z)&&!randuriIntregi(ctx,z)){const c=at&&at.col&&at.i>=z.c1&&at.i<=z.c2?at.i:z.c2;pune(ths[c+1],'c','col',c,'⇔')}
    else if(randuriIntregi(ctx,z)&&!coloaneIntregi(ctx,z)){const r=at&&!at.col&&at.i>=z.r1&&at.i<=z.r2?at.i:z.r2;pune((tabel.querySelectorAll('tbody tr')[r]||{querySelector:()=>null}).querySelector('th'),'r','row',r,'⇕')}}
  // bara de formule: valoarea din spate, cum o arată Excel (procent, dată)
  const act=xl.querySelector('.gw td.act'),fx=xl.querySelector('#xfx');
  if(act&&fx&&!editeaza&&document.activeElement!==fx){const o=ctx.afis[act.dataset.a];if(o&&o.num&&o.v.tip==='num'&&!o.v.formula){const b=bara(o.v.v,o.cod);if(b!=null)fx.value=b}}
  // panglica: starea butoanelor (apăsat / valoarea din casete)
  const za=act?act.dataset.a:'A1',fa=ctx.FMT[za]||{},oa=ctx.afis[za]||{};const pa=pos(za);
  const on=(id,v)=>{const b=xl.querySelector(`[data-xf="${id}"]`);if(b){b.classList.toggle('pg-on',!!v);b.setAttribute('aria-pressed',String(!!v))}};
  on('Bold',fa.b);on('Italic',fa.i);on('Underline',fa.u);on('WrapText',fa.wrap);on('MergeCenter',!!areaDe(ctx,pa.c,pa.r));
  on('AlignLeft',fa.al==='left');on('AlignCenter',fa.al==='center');on('AlignRight',fa.al==='right');
  on('AlignTopExcel',fa.va==='top');on('AlignMiddleExcel',fa.va==='middle');on('AlignBottomExcel',!fa.va);
  const cb=(id,t)=>{const b=xl.querySelector(`[data-xf="${id}"] .pg-cb`);if(b)b.textContent=t};
  cb('Font',fa.usor?'Calibri Light':'Calibri');cb('FontSize',String(fa.fs||11));cb('NumberFormatGallery',oa.num?numeFormat(oa.cod):(fa.nfx?numeFormat(fa.nfx):'General'));
  const bb=xl.querySelector('[data-xf="BorderBottomNoToggle"]');if(bb){const x=BORDURI.find(y=>y[0]===ULTIM.bd);if(x)bb.title=`${x[2]} (${x[1]}) — butonul o pune; ▾ deschide lista`}
  xl.querySelectorAll('.pg [data-xf]').forEach(b=>{if(SPLIT.has(b.dataset.xf))b.classList.add('xf-split')});
  const gl=(id,h)=>{const b=xl.querySelector(`.pg [data-xf="${id}"]`);if(!b||b.querySelector('.xf-gl,.xf-com'))return;const sv=b.querySelector('svg,.pg-txt');const x=document.createElement('span');x.setAttribute('aria-hidden','true');x.innerHTML=h;const e=x.firstChild;if(sv)sv.replaceWith(e);else b.prepend(e)};
  gl('DecimalsIncrease','<span class="xf-gl"><i>←</i>0<br>.00</span>');gl('DecimalsDecrease','<span class="xf-gl">.00<br><i>→</i>.0</span>');gl('CommaStyle','<span class="xf-com">,</span>');
  if(ATING)xl.querySelectorAll('.pg .pg-grup').forEach(gr=>{const G=gr.getAttribute('aria-label');const P=window.PANGLICA_EXCEL&&panglicaMea(window.PANGLICA_EXCEL);if(!P||!GRUPE_TEL.includes(G))return;
    const gd=P.file.find(f=>f.id==='TabHome').grupuri.find(x=>x.eticheta===G);if(!gd)return;const S=window.UiPanglica.SCARA||0.667;
    gd.butoane.forEach(b=>{if(!b._cap||!NUME_VIZ[b.id]||b._et)return;const c=document.createElement('span');c.className='xf-cap';c.textContent=NUME_VIZ[b.id];
      const [x,y,w,h]=b._cap;c.style.cssText=`left:${Math.round(x*S)}px;top:${Math.round(y*S)}px;width:${Math.round(w*S)}px;height:${Math.round(h*S)}px`;gr.appendChild(c)})});
  const ing=xl.querySelector('.pg .pg-ingust');const TXT_PG='Panglica se derulează în lateral, până la grupurile Aliniere (Alignment), Număr (Number), Stiluri (Styles), Celule (Cells) și Editare (Editing): '+(ATING?'trage de ea cu degetul spre stânga. Sub fiecare buton e scris numele lui; în Excel îl vezi când ții mouse-ul pe buton.':'ține mouse-ul pe ea și rotește rotița (sau trage de bara subțire de sub ea). În Excel-ul de pe calculator o vezi întreagă.');
  if(ing&&ing.textContent!==TXT_PG)ing.textContent=TXT_PG;
  const fb=xl.querySelector('[data-xf="CellFillColorPicker"] svg');if(fb)fb.style.borderBottom=`3px solid ${ULTIM.fill}`;
  const cf=xl.querySelector('[data-xf="FontColorPicker"] svg');if(cf)cf.style.borderBottom=`3px solid ${ULTIM.font}`;
  if(ctx.Q.teste)teste(ctx);
  // derularea laterală a foii rămâne după fiecare desen (motorul înlocuiește .gw), iar #xwrap nu se scurtează în mijlocul
  // desenului (altfel, cu pagina derulată până jos, browserul o derulează înapoi și degetul ajunge pe alt rând)
  const gw=xl.querySelector('.gw');if(gw){if(ctx.gwX)gw.scrollLeft=ctx.gwX;gw.addEventListener('scroll',()=>{ctx.gwX=gw.scrollLeft},{passive:true})}
  const pb=xl.querySelector('.pg .pg-banda');if(pb){if(ctx.pgX)pb.scrollLeft=ctx.pgX;pb.addEventListener('scroll',()=>{ctx.pgX=pb.scrollLeft},{passive:true})   // panglica rămâne unde ai derulat-o
    if(!ATING)pb.addEventListener('wheel',e=>{if(pb.scrollWidth<=pb.clientWidth+1||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;const d=e.deltaY*(e.deltaMode===1?30:1);
      const x0=pb.scrollLeft;pb.scrollLeft+=d;if(pb.scrollLeft!==x0)e.preventDefault()},{passive:false})}   // rotița, cu mouse-ul pe panglică
  w.style.minHeight='';w.style.minHeight=w.offsetHeight+'px'}
/* Excel lățește singur coloana (nelățită de mână) când scrii un număr care nu încape (proba_ascuns.json, „tastare”) */
function sincron(ctx){const vechi=ctx.LAST||{};let schimbat=false;
  Object.keys(ctx.RAW).forEach(a=>{if(ctx.RAW[a]===vechi[a])return;const p=pos(a);if(!p)return;const k='col:'+COL(p.c),fc=ctx.FMT[k];if(fc&&fc.c)return;if(areaDe(ctx,p.c,p.r))return;
    const o=afisare(ctx,a);if(o.num&&!o.v.formula&&(o.diez||(o.scurtat&&intregNuIncape(o))||(o.cod!=='General'&&o.scurtat))){const w=nevoie(ctx,a);if(w>latime(ctx,p.c)){ctx.FMT[k]={w,c:false};schimbat=true}}});
  ctx.LAST=Object.assign({},ctx.RAW);return schimbat}

/* ============================ TRAGEREA DE MARGINEA ANTETULUI (mouse și deget) ============================ */
let trag=null,bula=null,ultimTap=null;
function arataBula(x,y,t){if(!bula){bula=document.createElement('div');bula.className='xf-bula';document.body.appendChild(bula)}bula.textContent=t;bula.style.left=Math.min(innerWidth-150,x+12)+'px';bula.style.top=Math.max(4,y-30)+'px'}
function ascundeBula(){if(bula){bula.remove();bula=null}}
function ctxDin(el){for(const c of lista){if(c.body.isConnected&&c.body.contains(el))return c}return null}
let derul=null,inghiteClic=0;
document.addEventListener('pointerdown',ev=>{const h=ev.target&&ev.target.closest&&ev.target.closest('.xf-rc,.xf-rr,.xf-grip');
  if(!h&&ev.pointerType==='touch'){const th=ev.target&&ev.target.closest&&ev.target.closest('.gw thead th');const c1=th&&ctxDin(th);
    if(th&&c1){const gw=th.closest('.gw');derul={gw,id:ev.pointerId,x0:ev.clientX,s0:gw.scrollLeft,mutat:false}}}
  if(MEN&&!MEN.contains(ev.target)&&!(ev.target.closest&&ev.target.closest('[data-xf]')))inchideMeniu();
  const c0=ctxDin(ev.target);if(c0)activ=c0;
  if(!h)return;const ctx=ctxDin(h);if(!ctx)return;ev.preventDefault();ev.stopPropagation();if(inghetat(ctx))return;
  const col=h.classList.contains('xf-rc')||h.classList.contains('c'),i=+(col?h.dataset.col:h.dataset.row);
  // două atingeri rapide (deget) sau dublu-clic (mouse) = potrivire automată
  const acum=Date.now();if(ultimTap&&ultimTap.el===(col?'c':'r')+i&&acum-ultimTap.t<450){ultimTap=null;trag=null;potrivireDubla(ctx,col,i);return}
  ultimTap={el:(col?'c':'r')+i,t:acum};
  const th=h.parentElement,r=th.getBoundingClientRect();trag={ctx,col,i,x0:ev.clientX,y0:ev.clientY,start:col?r.width:r.height,th,mutat:false,id:ev.pointerId};
  h.classList.add('on');try{h.setPointerCapture(ev.pointerId)}catch(e){}},true);
document.addEventListener('pointermove',ev=>{
  if(derul&&ev.pointerId===derul.id){const dx=ev.clientX-derul.x0;if(Math.abs(dx)>8)derul.mutat=true;if(derul.mutat){derul.gw.scrollLeft=derul.s0-dx;ev.preventDefault();ev.stopPropagation()}return}
  if(!trag||ev.pointerId!==trag.id)return;ev.preventDefault();ev.stopPropagation();const t=trag;
  const d=t.col?ev.clientX-t.x0:ev.clientY-t.y0;if(Math.abs(d)>2)t.mutat=true;if(!t.mutat)return;
  const px=Math.max(0,t.start+d);if(t.col){t.th.style.width=px+'px';const tb=t.th.closest('table');let s=0;tb.querySelectorAll('thead th').forEach(x=>s+=x.getBoundingClientRect().width);tb.style.width=s+'px';
    const w=pxLat(Math.round(px/Z));arataBula(ev.clientX,ev.clientY,`Width: ${nrRo(w)} (${colPx(w)} pixels)`);t.val=w}
  else{const tr=t.th.parentElement;tr.style.height=px+'px';const h=Math.round(px/Z*3/4*4)/4;arataBula(ev.clientX,ev.clientY,`Height: ${nrRo(h)} (${Math.round(h*4/3)} pixels)`);t.val=h}},true);
function termina(ev){if(derul&&ev&&ev.pointerId===derul.id){if(derul.mutat){inghiteClic=Date.now();ev.stopPropagation()}derul=null;return}
  if(!trag||(ev&&ev.pointerId!==trag.id))return;const t=trag;trag=null;ascundeBula();if(ev){ev.preventDefault();ev.stopPropagation()}
  document.querySelectorAll('.xf-rc.on,.xf-rr.on,.xf-grip.on').forEach(x=>x.classList.remove('on'));
  if(!t.mutat||t.val==null){t.ctx.S.draw();return}
  const ctx=t.ctx,z=selectia(ctx);ultimTap=null;
  schimba(ctx,()=>{if(t.col){const toate=coloaneIntregi(ctx,z)&&t.i>=z.c1&&t.i<=z.c2?coloaneSel(ctx):[t.i];puneLatime(ctx,toate,t.val)}
    else{const toate=randuriIntregi(ctx,z)&&t.i>=z.r1&&t.i<=z.r2?randuriSel(ctx):[t.i];puneInaltime(ctx,toate,t.val)}})}
document.addEventListener('pointerup',termina,true);document.addEventListener('pointercancel',termina,true);
function potrivireDubla(ctx,col,i){const z=selectia(ctx);let toate;
  schimba(ctx,()=>{if(col){toate=coloaneIntregi(ctx,z)&&i>=z.c1&&i<=z.c2?coloaneSel(ctx):[i];potrivesteColoane(ctx,toate)}
    else{toate=randuriIntregi(ctx,z)&&i>=z.r1&&i<=z.r2?randuriSel(ctx):[i];potrivesteRanduri(ctx,toate)}});
  const n=toate.length,p=toate[0],u=toate[n-1];
  nota(ctx,col?(n>1?`Coloanele ${COL(p)}–${COL(u)} erau selectate toate, deci s-au potrivit toate, fiecare după cel mai lung conținut al ei (ca în Excel).`:`Coloana ${COL(i)} s-a potrivit după cel mai lung conținut al ei.`)
    :(n>1?`Rândurile ${p+1}–${u+1} erau selectate, deci și-au luat toate înălțimea potrivită.`:`Rândul ${i+1} și-a luat înălțimea potrivită.`))}
// clicul pe marginea antetului nu selectează coloana/rândul (ca în Excel)
['click','dblclick','contextmenu'].forEach(t=>document.addEventListener(t,ev=>{if(ev.target&&ev.target.closest&&ev.target.closest('.xf-rc,.xf-rr,.xf-grip')){ev.preventDefault();ev.stopPropagation();return}
  if(t==='click'&&inghiteClic&&Date.now()-inghiteClic<600&&ev.target.closest&&ev.target.closest('.gw thead')){inghiteClic=0;ev.preventDefault();ev.stopPropagation()}},true));
/* selecția unui antet întreg (litera coloanei / numărul rândului), extinsă peste îmbinări ca în Excel: cu A1:D1 îmbinat,
   clicul pe C selectează A:D (probat de judecător în Excel real); antetAtins = unde s-a dat clicul (acolo stă cercul ⇔) */
function extinde(ctx,z){for(let k=0;k<4;k++)ctx.MERGE.forEach(m=>{if(!(m.c2<z.c1||m.c1>z.c2||m.r2<z.r1||m.r1>z.r2)){z.c1=Math.min(z.c1,m.c1);z.c2=Math.max(z.c2,m.c2);z.r1=Math.min(z.r1,m.r1);z.r2=Math.max(z.r2,m.r2)}});return z}
function antetDin(th){if(th.closest('thead')){const i=[...th.parentElement.children].indexOf(th)-1;return {col:true,i}}
  return {col:false,i:[...th.parentElement.parentElement.children].indexOf(th.parentElement)}}
function selAntet(ctx,h){const {cols,rows}=dimF(ctx);
  if(h.col&&h.i<0){ctx.S.setZona('A1:'+adr(cols-1,rows-1));ctx.antetAtins=null}
  else{const z=extinde(ctx,h.col?{c1:h.i,c2:h.i,r1:0,r2:rows-1}:{c1:0,c2:cols-1,r1:h.i,r2:h.i});ctx.S.setZona(adr(z.c1,z.r1)+':'+adr(z.c2,z.r2));ctx.antetAtins=h}
  ctx.S.draw();focus(ctx)}
const gataFoaie=th=>{const xl=th.closest('.xl');return !!xl&&/^Gata/.test((xl.querySelector('.st span')||{}).textContent||'Gata')};
/* pe ecranul cu deget, atingerea literei unei coloane sau a numărului unui rând le selectează (ca clicul cu mouse-ul) */
document.addEventListener('click',ev=>{if(!ATING)return;const th=ev.target&&ev.target.closest&&ev.target.closest('.gw th');if(!th||ev.target.closest('.xf-grip'))return;const ctx=ctxDin(th);if(!ctx||inghetat(ctx))return;
  if(!gataFoaie(th))return;ev.preventDefault();ev.stopPropagation();selAntet(ctx,antetDin(th))},true);
/* cu mouse-ul: excelx.js selectează antetul prin celulele lui, dar celula ascunsă în îmbinare nu există; când antetul atinge
   o îmbinare, selecția o facem noi (fără Shift; cu Shift rămâne extinderea din excelx.js) */
document.addEventListener('pointerdown',ev=>{if(ev.pointerType==='touch'||ev.button!==0||ev.shiftKey)return;const th=ev.target&&ev.target.closest&&ev.target.closest('.gw th');
  if(!th||ev.target.closest('.xf-rc,.xf-rr,.xf-grip'))return;const ctx=ctxDin(th);if(!ctx||inghetat(ctx)||!gataFoaie(th))return;const h=antetDin(th);if(h.col&&h.i<0)return;
  const {cols,rows}=dimF(ctx);const z0=h.col?{c1:h.i,c2:h.i,r1:0,r2:rows-1}:{c1:0,c2:cols-1,r1:h.i,r2:h.i};const z=extinde(ctx,Object.assign({},z0));
  if(z.c1===z0.c1&&z.c2===z0.c2&&z.r1===z0.r1&&z.r2===z0.r2){ctx.antetAtins=h;return}
  ev.preventDefault();ev.stopPropagation();selAntet(ctx,h)},true);

/* ============================ CLICURILE ÎN PANGLICĂ, TASTELE, MENIURILE DIN excelx.js ============================ */
document.addEventListener('click',ev=>{const b=ev.target&&ev.target.closest&&ev.target.closest('[data-xf]');if(!b)return;const ctx=ctxDin(b);if(!ctx)return;
  ev.preventDefault();ev.stopPropagation();nota(ctx,'');if(MEN&&Date.now()-menT>50){inchideMeniu();}
  const sg=b.querySelector('.pg-sag');const sag=!!ev.target.closest('.pg-sag')||(SPLIT.has(b.dataset.xf)&&!!sg&&ev.clientX>=sg.getBoundingClientRect().left-1);
  actiune(ctx,b.dataset.xf,b,sag)},true);
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&MEN){inchideMeniu();return}
  const g=ev.target&&ev.target.closest&&ev.target.closest('.gw');if(!g)return;const ctx=ctxDin(g);if(!ctx||inghetat(ctx))return;
  const xl=g.closest('.xl');if(!/^Gata/.test((xl.querySelector('.st span')||{}).textContent||'Gata'))return;
  const ctrl=ev.ctrlKey||ev.metaKey,k=(ev.key||'').toLowerCase();if(!ctrl)return;
  const stop=()=>{ev.preventDefault();ev.stopPropagation()};
  if(!ev.shiftKey&&(k==='b'||k==='i'||k==='u')){stop();comuta(ctx,k);return}
  if(!ev.shiftKey&&(k==='1'||ev.code==='Digit1')){stop();nesim(ctx,'Format Cells (Ctrl+1)','în fereastra Formatare celule');return}
  if(ev.shiftKey&&(ev.key==='%'||ev.code==='Digit5')){stop();puneFormat(ctx,'0%');return}},true);
/* meniurile lui excelx.js: Golire formate (Clear Formats) devine adevărată; Golire totală desface și îmbinările;
   clic dreapta pe antet primește Column Width… / Row Height…, ca în Excel */
document.addEventListener('click',ev=>{const b=ev.target&&ev.target.closest&&ev.target.closest('.xp-meniu button');if(!b||!activ||!activ.body.isConnected)return;
  const t=b.textContent||'';
  if(/^Golire formate/.test(t)){ev.preventDefault();ev.stopPropagation();const m=b.closest('.xp-meniu');if(m)m.remove();golesteFormate(activ);return}
  if(/^Golire totală/.test(t)){const ctx=activ,z=selectia(ctx);setTimeout(()=>{desface(ctx,z);ctx.S.draw()},0)}},true);
new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(!(n.classList&&n.classList.contains('xp-meniu'))||!activ)return;
  const txt=[...n.querySelectorAll('button')].map(x=>x.textContent);if(!txt.some(x=>/^Inserare \(Insert\)$/.test(x)))return;   // meniul antetelor
  const ctx=activ,z=selectia(ctx),col=coloaneIntregi(ctx,z)&&!randuriIntregi(ctx,z);
  const add=(t,fn)=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','menuitem');b.textContent=t;b.addEventListener('click',e=>{e.stopPropagation();n.remove();fn()});n.appendChild(b)};
  n.appendChild(document.createElement('hr'));
  add('Formatare celule… (Format Cells…)',()=>nesim(ctx,'Format Cells…','în fereastra Formatare celule'));
  if(col)add('Lățime coloană… (Column Width…)',()=>formatCmd(ctx,'cw'));else add('Înălțime rând… (Row Height…)',()=>formatCmd(ctx,'rh'));
  add('Ascundere (Hide)',()=>nesim(ctx,'Hide (Ascundere)'));add('Reafișare (Unhide)',()=>nesim(ctx,'Unhide (Reafișare)'));
  const r=n.getBoundingClientRect();if(r.bottom>innerHeight-4)n.style.top=Math.max(4,innerHeight-r.height-4)+'px'}))}).observe(document.body,{childList:true});
addEventListener('scroll',()=>{if(MEN&&Date.now()-menT>400)inchideMeniu()},true);addEventListener('resize',()=>inchideMeniu());

/* ============================ VERIFICAREA FORMATĂRII ============================ */
/* spec (verifica.forma / teste[].forma), orice combinație:
   faraDiez:'C3:C6'      nicio celulă nu arată ####           vizibil:'A3:A6'   textul se vede întreg (nu e tăiat)
   latime:{A:{min:12}}   inaltime:{'1':{min:24}} (puncte)      al:{'D3:D6':'center'}  va:{'A1':'middle'}  wrap:{'A5':true}
   imbinat:'A1:D1' (+ centrat:true)   b:{'A2:D2':true}   fill:{'A2:D2':true|'#FFFF00'}  culoare:{…}  fs:{'A1':{min:14}}
   borduri:{'A2:D6':'toate'|'exterior'|'exteriorGros'}   format:{'B3:B6':{zecimale:2}|{procent:0}|{data:'lunga'|'scurta'}|{nume:'Currency'}}
   stil:{'A1':'Title'}   valori:true (valorile din spate au rămas cele de la început)   text:{'A1':'…'} (ce se vede) */
function problemeForma(ctx,S){const out=[],afis=a=>ctx.afis&&ctx.afis[a]||afisare(ctx,a);const Zn=t=>{const z=zonaDin(t),o=[];peCelule(z,a=>o.push(a));return o};
  if(S.vizibil){const d=Zn(S.vizibil).filter(a=>{const o=afis(a);if(!o.text)return false;const p=pos(a),f=ctx.FMT[a]||{};if(f.wrap)return false;
      const mg=areaDe(ctx,p.c,p.r);const disp=mg?spatiu(ctx,mg.c1,mg.c2):o.disp;let extra=0;
      if(!mg&&(!f.al||f.al==='left'))for(let c=p.c+1;c<dimF(ctx).cols;c++){if(rawDe(ctx,adr(c,p.r))!==''||areaDe(ctx,c,p.r))break;extra+=pxCol(ctx,c)}
      return lat(o.t,o.font)>disp+extra+0.5});
    if(d.length)out.push(`Textul din ${d.join(', ')} e tăiat de celula din dreapta. Lățește coloana ${[...new Set(d.map(a=>a.replace(/\d+/,'')))].join(', ')} (tragi de linia din dreapta literei sau dublu-clic pe ea).`)}
  Object.entries(S.latime||{}).forEach(([c,x])=>{const w=latime(ctx,pos(c+'1').c);if(x.min!=null&&w<x.min-1e-9)out.push(`Coloana ${c} e încă prea îngustă (lățimea ${nrRo(w)}).`);if(x.max!=null&&w>x.max+1e-9)out.push(`Coloana ${c} e prea lată (lățimea ${nrRo(w)}).`)});
  Object.entries(S.inaltime||{}).forEach(([r,x])=>{const h=inaltime(ctx,+r-1);if(x.min!=null&&h<x.min-1e-9)out.push(`Rândul ${r} e încă prea scund (${nrRo(h)} puncte). Trage în jos de linia de sub numărul ${r}.`)});
  const NA={left:'la stânga',center:'la centru',right:'la dreapta'},NV={top:'sus',middle:'la mijloc',bottom:'jos'};
  Object.entries(S.al||{}).forEach(([t,v])=>{const d=Zn(t).filter(a=>((ctx.FMT[a]||{}).al||'')!==v);if(d.length)out.push(`${d.slice(0,4).join(', ')}${d.length>4?'…':''}: conținutul nu e aliniat ${NA[v]}. Selectează ${t}, apoi butonul din grupul Aliniere (Alignment).`)});
  Object.entries(S.va||{}).forEach(([t,v])=>{const d=Zn(t).filter(a=>((ctx.FMT[a]||{}).va||'bottom')!==v);if(d.length)out.push(`${d.join(', ')}: conținutul nu e aliniat ${NV[v]}.`)});
  Object.entries(S.wrap||{}).forEach(([t,v])=>{const d=Zn(t).filter(a=>!!(ctx.FMT[a]||{}).wrap!==!!v);if(d.length)out.push(v?`${d.join(', ')} nu are Încadrare text (Wrap Text): textul stă tot pe un rând.`:`${d.join(', ')} are încă Încadrare text (Wrap Text).`)});
  if(S.imbinat){[].concat(S.imbinat).forEach(t=>{const z=zonaDin(t);const m=ctx.MERGE.find(x=>x.c1===z.c1&&x.c2===z.c2&&x.r1===z.r1&&x.r2===z.r2);
    if(!m){const alt=ctx.MERGE.find(x=>!(x.c2<z.c1||x.c1>z.c2||x.r2<z.r1||x.r1>z.r2));out.push(alt?`Ai îmbinat ${zonaTxt(alt)}, dar trebuie exact ${t}. Apasă din nou pe ea și Merge & Center (o desface), apoi selectează ${t} și Merge & Center.`:`Celulele ${t} nu sunt îmbinate. Selectează ${t}, apoi Pornire (Home) › Merge & Center (Îmbinare și centrare).`)}
    else if(S.centrat&&((ctx.FMT[adr(z.c1,z.r1)]||{}).al!=='center'))out.push(`${t} e îmbinată, dar titlul nu e centrat. Folosește Merge & Center, nu Merge Cells.`)})}
  const prop=(k,nume)=>Object.entries(S[k]||{}).forEach(([t,v])=>{const d=Zn(t).filter(a=>{const x=(ctx.FMT[a]||{})[k];return v===true?!x:(typeof v==='object'?false:x!==v)});if(d.length)out.push(`${nume} lipsește în ${d.slice(0,4).join(', ')}${d.length>4?'…':''}. Selectează ${t}, apoi apasă butonul.`)});
  prop('b','Aldinul (Bold)');prop('fill','Culoarea de umplere (Fill Color)');prop('color','Culoarea fontului (Font Color)');
  Object.entries(S.fs||{}).forEach(([t,x])=>{const d=Zn(t).filter(a=>((ctx.FMT[a]||{}).fs||11)<(x.min||0));if(d.length)out.push(`Textul din ${d.join(', ')} e încă mic (${(ctx.FMT[d[0]]||{}).fs||11}). Mărește-l din Font Size.`)});
  Object.entries(S.borduri||{}).forEach(([t,tip])=>{const z=zonaDin(t);const lipsa=[],gros=[];
    peCelule(z,(a,c,r)=>{const m=margini(ctx,c,r);const cer=tip==='toate'?['t','b','l','r']:[r===z.r1?'t':'',r===z.r2?'b':'',c===z.c1?'l':'',c===z.c2?'r':''].filter(Boolean);
      cer.forEach(s=>{if(!m[s])lipsa.push(a);else if(tip==='exteriorGros'&&!/^(medium|thick)/.test(m[s]))gros.push(a)})});
    if(lipsa.length)out.push(tip==='toate'?`Nu toate celulele din ${t} au linii pe toate laturile (de exemplu ${[...new Set(lipsa)].slice(0,3).join(', ')}). Selectează ${t}, apoi Borders ▾ › All Borders (Toate bordurile).`:`Conturul zonei ${t} nu e complet (${[...new Set(lipsa)].slice(0,3).join(', ')}). Selectează ${t}, apoi Borders ▾ › ${tip==='exteriorGros'?'Thick Outside Borders':'Outside Borders'}.`);
    else if(gros.length)out.push(`Conturul lui ${t} e subțire; se cere unul gros: Borders ▾ › Thick Outside Borders.`)});
  Object.entries(S.format||{}).forEach(([t,x])=>{Zn(t).forEach(a=>{const o=afis(a);if(!o.num){out.push(`${a} nu conține un număr.`);return}const txt=String(o.plin||'').replace(/[  ]/g,'').trim();
    if(x.zecimale!=null){const k=((txt.match(/,(\d+)/)||['',''])[1]).length;const zc=n=>n===0?'fără zecimale':n===1?'cu o zecimală':`cu ${n} zecimale`;
      if(/lei|%/.test(txt))out.push(`${a} arată „${txt}”: ai pus un format cu ${/%/.test(txt)?'procent':'lei'}. Se cere doar numărul cu ${x.zecimale} zecimale (Number sau Increase Decimal).`);
      else if(k!==x.zecimale||o.cod==='General'&&x.zecimale>0){const are=o.diez?`are forma ${zc(k)} („${txt}”) și nu încape (se vede ####)`:`arată „${o.t}”, ${zc(k)}`;
        out.push(`${a} ${are}; se cer ${x.zecimale} zecimale.`+(k<x.zecimale&&o.cod!=='General'?` Ai scos zecimale: apasă Ctrl+Z (↶) de atâtea ori câte zecimale ai scos (aici de ${x.zecimale-k===1?'o dată':(x.zecimale-k)+' ori'}), sau Increase Decimal, până revin cele ${x.zecimale}. Dacă apoi apare ####, lățește coloana.`:''))}}
    if(x.procent!=null){const k=((txt.match(/,(\d+)%/)||['',''])[1]).length;if(!/%$/.test(txt))out.push(`${a} arată „${o.t}”, nu un procent. Apasă butonul % (Percent Style).`);else if(k!==x.procent)out.push(`${a} arată „${o.t}”; se cere procentul cu ${x.procent} zecimale.`)}
    if(x.data){const lunga=/^\[\$-F800\]/.test(o.cod);if(!eData(o.cod))out.push(`${a} nu arată o dată.`);else if((x.data==='lunga')!==lunga)out.push(`${a} arată data ${x.data==='lunga'?'scurt':'lung'}; alege ${x.data==='lunga'?'Long Date':'Short Date'} din lista Number Format.`)}
    if(x.nume&&numeFormat(o.cod)!==x.nume)out.push(`${a} are formatul ${numeFormat(o.cod)}, nu ${x.nume}.`)})});
  if(S.faraDiez){const d=Zn(S.faraDiez).filter(a=>afis(a).diez);if(d.length)out.push(`${d.join(', ')} ${d.length>1?'arată':'arată'} încă ####: coloana ${[...new Set(d.map(a=>a.replace(/\d+/,'')))].join(', ')} e prea îngustă. Lățește-o: trage de linia din dreapta literei ei sau dă dublu-clic pe linie.`)}
  Object.entries(S.stil||{}).forEach(([t,n])=>{const d=Zn(t).filter(a=>(ctx.FMT[a]||{}).stil!==n);if(d.length)out.push(`${d.join(', ')} nu are stilul „${n}”. Selectează ${t}, apoi Cell Styles › ${n}.`)});
  Object.entries(S.text||{}).forEach(([a,t])=>{const o=afis(a);if(String(o.t||'').trim()!==t)out.push(`În ${a} trebuie să se vadă „${t}” (acum: „${o.t||''}”).`)});
  if(S.valori){const Q=ctx.Q;Object.entries(Q.cells||{}).forEach(([a,v])=>{const now=valoare(ctx,a),ini=typeof v==='number'?{tip:'num',v}:(()=>{const p=XT.citeste(String(v));return p.tip==='num'?{tip:'num',v:p.v}:{tip:'text',v:p.v}})();
    const inMerge=ctx.MERGE.some(m=>{const p=pos(a);return p.c>=m.c1&&p.c<=m.c2&&p.r>=m.r1&&p.r<=m.r2&&!(p.c===m.c1&&p.r===m.r1)});
    if(ini.tip==='num'&&(now.tip!=='num'||Math.abs(now.v-ini.v)>1e-9))out.push(`Valoarea din ${a} s-a schimbat (era ${String(ini.v).replace('.',',')}). Formatarea nu schimbă valorile: apasă Ctrl+Z (↶) până revine.`);
    else if(ini.tip==='text'&&!inMerge&&(now.tip!=='text'||now.v!==ini.v))out.push(`Conținutul din ${a} s-a schimbat (era „${ini.v}”). Apasă Ctrl+Z (↶) până revine.`)})}
  return out}
function solutieForma(S){const s=[];
  if(S.imbinat)[].concat(S.imbinat).forEach(t=>s.push(`selectezi ${t} și apeși Merge &amp; Center (Îmbinare și centrare)`));
  if(S.faraDiez)s.push(`dai dublu-clic pe linia din dreapta literei coloanei ${[...new Set(zonaCols(S.faraDiez))].join(', ')} (sus, între litere)`);
  if(S.vizibil)s.push(`dai dublu-clic pe linia din dreapta literei ${[...new Set(zonaCols(S.vizibil))].join(', ')}`);
  Object.keys(S.latime||{}).forEach(c=>s.push(`lățești coloana ${c}`));Object.keys(S.inaltime||{}).forEach(r=>s.push(`tragi în jos de linia de sub numărul ${r}`));
  Object.entries(S.al||{}).forEach(([t,v])=>s.push(`selectezi ${t} și apeși ${({left:'Align Left',center:'Center',right:'Align Right'})[v]}`));
  Object.entries(S.va||{}).forEach(([t,v])=>s.push(`selectezi ${t} și apeși ${({top:'Top Align',middle:'Middle Align',bottom:'Bottom Align'})[v]}`));
  Object.keys(S.wrap||{}).forEach(t=>s.push(`selectezi ${t} și apeși Wrap Text (Încadrare text)`));
  Object.keys(S.b||{}).forEach(t=>s.push(`selectezi ${t} și apeși B (Bold)`));Object.keys(S.fill||{}).forEach(t=>s.push(`pe ${t} pui o culoare de umplere (găleata, Fill Color)`));
  Object.entries(S.borduri||{}).forEach(([t,v])=>s.push(`selectezi ${t}, apoi Borders ▾ › ${{toate:'All Borders',exterior:'Outside Borders',exteriorGros:'Thick Outside Borders'}[v]}`));
  Object.entries(S.format||{}).forEach(([t,x])=>s.push(`selectezi ${t}, apoi ${x.zecimale!=null?`lista Number Format › Number (sau Increase Decimal până apar ${x.zecimale} zecimale)`:x.procent!=null?'butonul % (Percent Style)'+(x.procent?` și Increase Decimal de ${x.procent} ori`:''):x.data?`lista Number Format › ${x.data==='lunga'?'Long Date':'Short Date'}`:`lista Number Format › ${x.nume}`}`));
  Object.entries(S.stil||{}).forEach(([t,n])=>s.push(`selectezi ${t}, apoi Cell Styles › ${n}`));
  return s.join('; ')+'.'}
const zonaCols=t=>{const z=zonaDin(t);return Array.from({length:z.c2-z.c1+1},(_,k)=>COL(z.c1+k))};
/* rezolvarea (pentru poarta automată și „Arată-mi”): aplică spec-ul direct pe foaie */
function aplicaSolutie(ctx,S){
  if(S.imbinat)[].concat(S.imbinat).forEach(t=>{const z=zonaDin(t);desface(ctx,z);const cont=continuturi(ctx,z),tl=adr(z.c1,z.r1);if(cont.length&&cont[0]!==tl)ctx.RAW[tl]=ctx.RAW[cont[0]];peCelule(z,a=>{if(a!==tl)delete ctx.RAW[a];if(S.centrat!==false)F(ctx,a).al='center'});ctx.MERGE.push(z)});
  Object.entries(S.al||{}).forEach(([t,v])=>peCelule(zonaDin(t),a=>{F(ctx,a).al=v}));Object.entries(S.va||{}).forEach(([t,v])=>peCelule(zonaDin(t),a=>{if(v==='bottom')delete F(ctx,a).va;else F(ctx,a).va=v}));
  Object.entries(S.wrap||{}).forEach(([t,v])=>peCelule(zonaDin(t),a=>{if(v)F(ctx,a).wrap=true;else delete F(ctx,a).wrap}));
  ['b','fill','color'].forEach(k=>Object.entries(S[k]||{}).forEach(([t,v])=>peCelule(zonaDin(t),a=>{F(ctx,a)[k]=v===true?(k==='b'?true:'#FFFF00'):v})));
  Object.entries(S.fs||{}).forEach(([t,x])=>peCelule(zonaDin(t),a=>{F(ctx,a).fs=x.min||14}));
  Object.entries(S.borduri||{}).forEach(([t,v])=>aplicaBorduri(ctx,zonaDin(t),{toate:'all',exterior:'outside',exteriorGros:'thickOutside'}[v]));
  Object.entries(S.format||{}).forEach(([t,x])=>peCelule(zonaDin(t),a=>{const f=F(ctx,a);f.nf='x';f.nfx=x.zecimale!=null?(x.zecimale?'0,'+'0'.repeat(x.zecimale):'0'):x.procent!=null?(x.procent?'0,'+'0'.repeat(x.procent)+'%':'0%'):x.data?(x.data==='lunga'?'[$-F800]dddd, mmmm dd, yyyy':'dd.mm.yyyy'):(LISTA_NF.find(y=>y[0]===x.nume)||[0,'General'])[1]}));
  Object.entries(S.stil||{}).forEach(([t,n])=>{const z=zonaDin(t);const st=STILURI[n];peCelule(z,(a,c,r)=>{const f=F(ctx,a);Object.entries(st.f||{}).forEach(([k,v])=>{if(k==='usor')f.usor=true;else f[k]=v===1?true:v});if(st.iB)['t','b','l','r'].forEach(s=>margine(ctx,c,r,s,(st.bd||{})[s]||null));if(st.nf){f.nfx=st.nf;f.nf='x'}f.stil=n})});
  const cols=new Set();[S.faraDiez,S.vizibil].filter(Boolean).forEach(t=>zonaCols(t).forEach(c=>cols.add(pos(c+'1').c)));
  if(cols.size)potrivesteColoane(ctx,[...cols]);
  Object.entries(S.latime||{}).forEach(([c,x])=>{const i=pos(c+'1').c;if(x.min!=null&&latime(ctx,i)<x.min)puneLatime(ctx,[i],x.min+1)});
  Object.entries(S.inaltime||{}).forEach(([r,x])=>{if(x.min!=null&&inaltime(ctx,+r-1)<x.min)puneInaltime(ctx,[+r-1],x.min+6)})}
/* răspunsul greșit tipic (pentru poarta automată) */
function aplicaGresit(ctx,S){
  if(S.imbinat){const z=zonaDin([].concat(S.imbinat)[0]);ctx.MERGE.push({c1:z.c1,c2:Math.max(z.c1+1,z.c2-1),r1:z.r1,r2:z.r2});return}
  if(S.borduri){const [t]=Object.keys(S.borduri);aplicaBorduri(ctx,zonaDin(t),S.borduri[t]==='toate'?'outside':'bottom');return}
  if(S.format){const [t]=Object.keys(S.format);peCelule(zonaDin(t),a=>{const f=F(ctx,a);f.nf='x';f.nfx=S.format[t].zecimale!=null?'#.##0,00 lei':'General'});return}
  if(S.faraDiez||S.vizibil){const z=zonaDin(S.faraDiez||S.vizibil);peCelule(z,a=>{F(ctx,a).b=true});return}          // formatează în loc să lățească
  if(S.al){const [t]=Object.keys(S.al);peCelule(zonaDin(t),a=>{F(ctx,a).al=S.al[t]==='right'?'left':'right'});return}
  if(S.wrap||S.b||S.fill||S.stil||S.inaltime||S.latime||S.va||S.fs)return;                                            // nimic făcut
}

/* ============================ TESTELE NUMITE ALE ATELIERULUI ============================ */
function teste(ctx){const Q=ctx.Q,box=ctx.box;if(!box)return;const val={};ctx.body.querySelectorAll('#xwrap .gw td[data-a]').forEach(t=>val[t.dataset.a]=(ctx.afis[t.dataset.a]||{}).t??t.textContent.trim());
  const eq=(x,y)=>String(x??'').trim().toLowerCase()===String(y).trim().toLowerCase();
  const rez=Q.teste.map(T=>({ce:T.ce,ok:Object.entries(T.valori||{}).every(([a,v])=>eq(val[a],v))&&(T.gol||[]).every(a=>!val[a])&&(!T.tip||XT.testeOk(ctx.body,T.tip))&&(!T.forma||problemeForma(ctx,T.forma).length===0)}));
  const n=rez.filter(x=>x.ok).length;const h=`<div class="lbl">Testele atelierului: ${n} din ${rez.length} gata</div><ul>${rez.map(x=>`<li class="${x.ok?'ok':''}"><span aria-hidden="true">${x.ok?'✔':'○'}</span>${x.ce}<span class="xp-sr">${x.ok?' (gata)':' (încă nu)'}</span></li>`).join('')}</ul>`;
  if(box._h!==h){box.innerHTML=h;box._h=h}}

/* ============================ TIPUL „excelx” CU FORMATARE ============================ */
const TEL='<b>Formatarea pe telefon:</b> foaia o derulezi în lateral trăgând de literele coloanelor. Lățimea: atingi litera coloanei, apoi tragi de cercul verde ⇔ de pe marginea ei; două atingeri pe cerc o potrivesc singură. Înălțimea: atingi numărul rândului, apoi tragi de cercul ⇕. Când derulezi foaia în lateral, numerele rândurilor se mută și ele (în Excel rămân pe loc). Săgeata ▾ a unui buton deschide lista lui.';
function render(Q,body,api){css();
  const Q2=Object.assign({},Q);delete Q2.teste;                                    // testele le desenăm noi (au și formatarea)
  const areForma=!Q.o&&Q.verifica&&Q.verifica.forma;
  const ctx={Q,body,stdW:STD_W,api};
  const apiW=Object.assign({},api,{
    resolve:(ok,msg)=>{if(ok&&areForma){const p=problemeForma(ctx,Q.verifica.forma);if(p.length){api.resolve(false,p.slice(0,2).map(esc).join(' '));api.revealButton(()=>{aplicaSolutie(ctx,Q.verifica.forma);ctx.S.draw();api.giveUp(solutieForma(Q.verifica.forma))});focus(ctx);return}}
      api.resolve(ok,msg);if(!ok)focus(ctx)},
    giveUp:html=>api.giveUp(areForma&&(!html||html==='.')?solutieForma(Q.verifica.forma):html)});
  window.ExcelX.render(Q2,body,apiW);
  const S=window.JocExcel&&window.JocExcel.render._stare;if(!S){return}
  Object.assign(ctx,{S,RAW:S.RAW,FMT:S.FMT,MERGE:S.MERGE});CTX.set(body,ctx);
  for(let k=lista.length-1;k>=0;k--)if(!lista[k].body.isConnected||lista[k].body===body)lista.splice(k,1);   // motorul refolosește #body la „Încă un exercițiu”
  lista.push(ctx);
  activ=ctx;
  // starea de pornire a foii (lățimi, înălțimi, formate, îmbinări)
  Object.entries(Q.latimi||{}).forEach(([c,w])=>{S.FMT['col:'+c]={w,c:true}});
  Object.entries(Q.inaltimi||{}).forEach(([r,h])=>{S.FMT['row:'+r]={h}});
  Object.entries(Q.forme||{}).forEach(([t,pr])=>peCelule(zonaDin(t),a=>{const f=F(ctx,a);Object.entries(pr).forEach(([k,v])=>{if(k==='nfx'){f.nfx=v;f.nf='x'}else f[k]=v})}));
  (Q.imbinari||[]).forEach(t=>S.MERGE.push(zonaDin(t)));
  ctx.LAST={};   // la pornire: coloanele nelățite de mână se potrivesc numerelor și datelor, ca după tastare în Excel
  // butonul ascuns prin care facem instantaneul pentru Anulare (foaia din motor îl leagă la fiecare desen)
  const sb=document.createElement('button');sb.type='button';sb.hidden=true;sb.dataset.rb='xf:snap';sb.tabIndex=-1;sb.setAttribute('aria-hidden','true');body.appendChild(sb);
  if(Q.teste){const w=body.querySelector('#xwrap');const box=document.createElement('div');box.className='xp-teste';box.setAttribute('aria-live','polite');body.insertBefore(box,w);ctx.box=box}
  const w=body.querySelector('#xwrap');
  const dupa=()=>{if(sincron(ctx)){ctx.S.draw();return}deseneaza(ctx)};
  new MutationObserver(dupa).observe(w,{childList:true});
  S.draw();
  try{if(matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0){const t=body.querySelector('.xp-tel');const n=document.createElement('p');n.className='xp-tel xf-tel';n.innerHTML=TEL;if(t)t.after(n);else body.insertBefore(n,w)}}catch(e){}}
function rezolva(Q,body,api){const r=window.ExcelX.rezolva(Q,body,api);const ctx=CTX.get(body);
  if(ctx&&!Q.o&&Q.verifica&&Q.verifica.forma){aplicaSolutie(ctx,Q.verifica.forma);ctx.S.draw()}return r}
function gresit(Q,body,api){const ctx=CTX.get(body);
  if(ctx&&!Q.o&&Q.verifica&&Q.verifica.forma){aplicaGresit(ctx,Q.verifica.forma);ctx.S.draw();return true}
  return window.ExcelX.gresit(Q,body,api)}
window.ExcelXF={render,rezolva,gresit};
/* pentru probe și pentru mini-foile „Uite cum” */
window.ExcelFormat={formateaza,general,generalScurt,zecimale,numeFormat,bara,colPx,STILURI,TEMA,STANDARD,LISTA_NF,
  generalLa:(v,w)=>{const c=generalIncape(v,colPx(w)*Z-2*PAD*Z-1,7*Z);return c==null?'#':c},   // ce arată foaia pentru v, General, la lățimea w
  stare:body=>{const c=CTX.get(body);return c?{FMT:c.FMT,MERGE:c.MERGE,RAW:c.RAW,afis:c.afis,latime:i=>latime(c,i),inaltime:r=>inaltime(c,r),probleme:s=>problemeForma(c,s)}:null}};
})();
