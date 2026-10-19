/* editorweb-tabele.js — extensie pentru simulatorul editorweb.js (proprietar editorweb: lecția VIII/14) și pentru
   editorweb-schelet.js (proprietar: lecția VIII/15). Proprietar ACESTEI extensii: lecția VIII/17 („Tabele și liste în
   pagina web”). Se încarcă DUPĂ editorweb.js și editorweb-schelet.js. NU le schimbă; nu ascultă taste și nu schimbă
   desenul simulatorului. Adaugă window.EditorWebTabele, cu:

   1. Citirea listelor și a tabelelor AȘA CUM LE CITEȘTE BROWSERUL (DOMParser-ul browserului elevului, deci aceleași reguli
      ca pagina desenată): liste(src), tabele(src), celulePeRand(src).
   2. Verificări pe TEXTUL scris de elev (browserul iartă </li>, </td>, </tr> lipsă — probat în Chromium 148,
      lectii/viii/m3-l17/_proba/proba_browser_l17.json —, dar lecția cere perechea): perechi(src, tag), inchise(src),
      lista(src, opt), tabel(src, opt), dupaTabel(src, text), inLista(src, text), numereScrise(src).
   3. Mesajul greșelii FĂCUTE la liste și tabele, cu ce se vede în browser (fapte probate în Chromium 148, aceleași în
      pagina desenată de simulator): mesajText(src). Ordinea: </table> lipsă (textul de după urcă deasupra tabelului),
      </ul> / </ol> lipsă sau lista închisă cu alt nume (ce urmează intră în listă, mutat la dreapta), text direct în <tr>
      (urcă deasupra tabelului), un rând cu altă numărătoare de celule (celulă lipsă: cele din dreapta ei trec în coloana
      din stânga; celulă în plus: iese în dreapta tabelului), <li> în afara listei (fără bulină), numere scrise de mână
      într-o <ol> („1. 1.”), un rând scris după </table> (textele unul după altul, pe un rând, sub tabel, fără coloane), <th>…</td> (închidere cu alt
      nume), o etichetă de listă/tabel fără pereche, </ul… fără >.
      Celulele pot fi scrise fiecare pe rândul ei sau tot rândul tabelului pe un rând: browserul desenează la fel (probat).
   Nu schimbă desenul simulatorului. Lecția VIII/17 face browserul simulat mai înalt din CSS-ul paginii ei
   (#body .ew .lv .br-corp{min-height:15em}), ca tabelul să se vadă întreg: e o alegere a paginii, nu a extensiei.
   4. cuDiagnostic(teste, {spec, coleg}) — ca EditorWebSchelet.cuDiagnostic (aceleași reguli: neatins / faraDiagnostic
      rămân neschimbate; curat / faraOraData pică pe ora și data scrise de F5 în Notepad), dar mesajul spune întâi starea
      (fila colegului, fișier nesalvat — ale schelet-ului), apoi greșeala de listă/tabel, apoi greșelile schelet-ului
      (ü, ghilimele, </title fără >). Un test poate avea msgTactil.
   5. randare(cod, inaltime) — HTML-ul unei pagini desenate de browserul elevului (iframe sandbox="", fără scripturi,
      fără cereri: EditorWebUtil.previewDoc), pentru „Uite cum”. Nu e imagine: e chiar desenul browserului.

   Folosire:  <script src="../../_sim/editorweb.js"></script><script src="../../_sim/editorweb-schelet.js"></script>
              <script src="../../_sim/editorweb-tabele.js"></script>
   apoi în teste  fn:S=>EditorWebTabele.tabel(S.live.text,{randuri:3,coloane:3,cap:true}). */
(function(){
'use strict';
const lin=s=>String(s==null?'':s).replace(/\r\n?/g,'\n');
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const parse=src=>new DOMParser().parseFromString(String(src||''),'text/html');
const txt=el=>String(el&&el.textContent||'').replace(/\s+/g,' ').trim();
const cod=t=>`<code>&lt;${t}&gt;</code>`;
const codI=t=>`<code>&lt;/${t}&gt;</code>`;

/* ---------- 1. ce citește browserul ---------- */
function liste(src){
  return [...parse(src).querySelectorAll('ul,ol')].map(l=>({tip:l.tagName.toLowerCase(),
    elemente:[...l.children].filter(c=>c.tagName==='LI').map(txt),
    altceva:[...l.children].filter(c=>c.tagName!=='LI').map(c=>c.tagName.toLowerCase())}));
}
function tabele(src){
  return [...parse(src).querySelectorAll('table')].map(t=>({randuri:[...t.rows].map(tr=>[...tr.cells].map(c=>({tag:c.tagName.toLowerCase(),text:txt(c)})))}));
}
function celulePeRand(src,k){const t=tabele(src)[k||0];return t?t.randuri.map(r=>r.length):[]}

/* ---------- 2. ce a scris elevul ---------- */
/* câte etichete de deschidere și de închidere are textul (fără comentarii) */
function perechi(src,tag){
  const s=lin(src).replace(/<!--[\s\S]*?-->/g,'');
  return {deschise:(s.match(new RegExp('<'+tag+'(?=[\\s>/])[^>]*>','gi'))||[]).length,
          inchise:(s.match(new RegExp('</'+tag+'\\s*>','gi'))||[]).length};
}
const TAGURI=['ul','ol','li','table','tr','td','th'];
/* fiecare etichetă de listă / tabel are perechea ei, în ordine (corectorul simulatorului: nimic despre ele) */
function inchise(src,tags){
  tags=tags||TAGURI;
  if(tags.some(t=>{const p=perechi(src,t);return p.deschise!==p.inchise}))return false;
  const U=window.EditorWebUtil;if(!U)return true;
  const re=new RegExp('&lt;/?('+tags.join('|')+')&gt;','i');
  return !U.corecteaza(src).some(x=>re.test(x.text));
}
/* opt: {tip:'ul'|'ol', min, texte:[…] (toate, în orice ordine), ordine:[…] (exact așa), plin:true (fiecare li are text)} */
function lista(src,opt){
  opt=opt||{};
  return liste(src).some(l=>{
    if(opt.tip&&l.tip!==opt.tip)return false;
    if(opt.min&&l.elemente.length<opt.min)return false;
    if(opt.plin!==false&&l.elemente.some(e=>!norm(e)))return false;
    if(l.altceva.length)return false;
    const E=l.elemente.map(norm);
    if(opt.texte&&!opt.texte.every(t=>E.includes(norm(t))))return false;
    if(opt.ordine&&(E.length!==opt.ordine.length||opt.ordine.some((t,i)=>E[i]!==norm(t))))return false;
    return true;
  });
}
/* opt: {randuri, coloane, cap:true (primul rând = doar th, restul = doar td), plin:true, rand:{i:[texte]}} */
function tabel(src,opt){
  opt=opt||{};
  return tabele(src).some(t=>{
    const R=t.randuri;
    if(!R.length)return false;
    if(opt.randuri&&R.length!==opt.randuri)return false;
    const c=opt.coloane||R[0].length;
    if(R.some(r=>r.length!==c))return false;
    if(opt.cap===true&&(!R[0].every(x=>x.tag==='th')||R.slice(1).some(r=>r.some(x=>x.tag!=='td'))))return false;
    if(opt.cap===false&&R.some(r=>r.some(x=>x.tag!=='td')))return false;
    if(opt.plin!==false&&R.some(r=>r.some(x=>!norm(x.text))))return false;
    if(opt.rand)for(const [i,te] of Object.entries(opt.rand)){const r=R[+i];if(!r||r.length!==te.length||te.some((x,j)=>norm(r[j].text)!==norm(x)))return false}
    return true;
  });
}
/* textul `text` stă în pagină DUPĂ tabel (nu a urcat deasupra lui) */
function dupaTabel(src,text){
  const d=parse(src),t=d.querySelector('table');if(!t)return false;
  const w=d.createTreeWalker(d.body,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode()))if(norm(n.nodeValue).includes(norm(text)))return !!(t.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING)&&!t.contains(n);
  return false;
}
/* textul `text` a ajuns într-o listă */
function inLista(src,text){
  const d=parse(src),w=d.createTreeWalker(d.body,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode()))if(norm(n.nodeValue).includes(norm(text)))return !!(n.parentElement&&n.parentElement.closest('ul,ol'));
  return false;
}
/* într-o <ol>, un element începe cu un număr scris de mână („1. Spală…”, „2) …”) */
function numereScrise(src){return liste(src).some(l=>l.tip==='ol'&&l.elemente.some(e=>/^\d+\s*[.)]/.test(e)))}

/* ---------- 3. mesajul greșelii făcute ---------- */
function mesajText(src){
  const s=lin(src),d=parse(s);
  const pt=perechi(s,'table');
  /* </table> lipsă și ceva scris după tabel: browserul îl mută DEASUPRA tabelului (probat: p, text, h1 + ul) */
  if(pt.deschise>pt.inchise){
    const sl=s.toLowerCase(),i=Math.max(sl.lastIndexOf('</tr>'),sl.lastIndexOf('</td>'),sl.lastIndexOf('</th>'));
    const rest=i>=0?s.slice(i).replace(/^<\/t[rdh]\s*>/i,'').replace(/<\/(body|html)\s*>/gi,'').replace(/<[^>]*>/g,' '):'';
    if(norm(rest))return `Lipsește ${codI('table')}: ce ai scris după tabel a urcat <b>deasupra</b> lui, în pagină. Pune ${codI('table')} pe rândul de după ultimul ${codI('tr')}.`;
    return `Tabelul nu e închis: lipsește ${codI('table')}, pe rândul de după ultimul ${codI('tr')}.`;
  }
  for(const [a,b] of [['ul','ol'],['ol','ul']]){
    const pa=perechi(s,a);
    if(pa.deschise>pa.inchise){
      const pb=perechi(s,b);
      if(pb.inchise>pb.deschise)return `Lista s-a deschis cu ${cod(a)}, deci se închide cu ${codI(a)}, nu cu ${codI(b)}. Altfel, ce scrii după ea intră în listă, mutat la dreapta.`;
      return `Lista ${cod(a)} nu e închisă: lipsește ${codI(a)} după ultimul ${codI('li')}. Altfel, ce scrii după ea intră în listă, mutat la dreapta.`;
    }
  }
  /* text scris direct în <tr> (fără celulă): urcă deasupra tabelului */
  if(/<tr\b[^>]*>\s*[^<\s]/i.test(s))return `Pe un rând al tabelului e text direct după ${cod('tr')}, fără celulă: browserul îl mută deasupra tabelului. Pune fiecare text între ${cod('td')} și ${codI('td')} (în capul tabelului, ${cod('th')} și ${codI('th')}).`;
  const T=tabele(s);
  for(const t of T){
    const R=t.randuri;if(R.length<2)continue;
    const n0=R[0].length;
    const k=R.findIndex(r=>r.length!==n0);
    if(k>0){
      const r=R[k],pr=r[0]?`, cel care începe cu „${esc(r[0].text)}”`:'';
      if(r.length<n0)return `Rândul ${k+1}${pr}, are ${r.length} ${r.length===1?'celulă':'celule'}, iar primul rând are ${n0}. Lipsește o celulă: cele din dreapta ei au trecut în coloana din stânga. Numără celulele pe fiecare rând.`;
      return `Rândul ${k+1}${pr}, are ${r.length} celule, iar primul rând are ${n0}. E o celulă în plus: iese în dreapta tabelului. Numără celulele pe fiecare rând.`;
    }
  }
  if(d.querySelector('li')&&[...d.querySelectorAll('li')].some(li=>!li.closest('ul,ol')))
    return `Un ${cod('li')} stă în afara listei: fără ${cod('ul')} sau ${cod('ol')} în jurul lui, în pagină nu apare bulina sau numărul. Pune rândurile ${cod('li')} între ${cod('ul')} și ${codI('ul')}.`;
  if(numereScrise(s))return `Nu scrie tu numerele: ${cod('ol')} le pune singură. Așa, în pagină apare de două ori „1. 1.”. Șterge numerele scrise de tine.`;
  /* un rând scris după </table>: în afara tabelului, browserul ignoră <tr>/<td> și scrie textele unul după altul, pe un
     rând, sub tabel (probat în Chromium 148, judecata 1 J1-m1: cu celulele pe rânduri separate în Notepad apar despărțite
     de spații, „Miercuri Biologie Istorie”; scrise tot pe un rând, lipite) — lecția VIII/17, _proba/proba_reparatii.py [C] */
  {const sl=s.toLowerCase(),u=sl.lastIndexOf('</table>');if(u>=0&&/<t[rdh]\b/.test(sl.slice(u)))return `Un rând e scris după ${codI('table')}, deci în afara tabelului: browserul îi scrie textele unul după altul, pe un singur rând, sub tabel, fără coloane. Mută-l înaintea lui ${codI('table')}.`}
  /* celula de cap închisă cu </td> sau invers: <th>Ora</td> */
  if(/<th\b[^>]*>[^<]*<\/td\s*>|<td\b[^>]*>[^<]*<\/th\s*>/i.test(s))return `O celulă începe cu ${cod('th')} și se termină cu ${codI('td')} (sau invers). Închiderea repetă numele: ${cod('th')}…${codI('th')}, ${cod('td')}…${codI('td')}.`;
  for(const t of ['li','td','th','tr']){
    const p=perechi(s,t);
    if(p.deschise!==p.inchise)return p.deschise>p.inchise?
      `Un ${cod(t)} nu are perechea: lipsește ${codI(t)}. Browserul iartă aici și pagina arată la fel, dar tu scrii fiecare pereche.`:
      `Un ${codI(t)} nu are ${cod(t)} înaintea lui. Verifică perechea pe fiecare rând.`;
  }
  const m=s.match(/<\/(ul|ol|li|table|tr|td|th)\b(?!\s*>)/i);
  if(m)return `După ${'<code>&lt;/'+m[1].toLowerCase()+'</code>'} trebuie semnul <code>&gt;</code>, care închide eticheta.`;
  return '';
}

/* ---------- 4. aceleași teste, cu mesajul greșelii ---------- */
function diagnostic(S,U,opt){
  const ES=window.EditorWebSchelet;
  const s=ES?ES.src(S,U,opt&&opt.spec):(S.live&&S.live.text);
  if(ES){const d=ES.diagnostic(S,U,opt||{});if(d&&(!s||d!==ES.mesajText(s)))return d}   /* starea: fila colegului, nesalvat, F5 în Notepad */
  const m=s?mesajText(s):'';
  if(m)return m;
  return ES&&s?ES.mesajText(s):'';
}
function cuDiagnostic(teste,opt){
  opt=opt||{};
  const ES=window.EditorWebSchelet;
  return (teste||[]).map(c=>{
    if(!c||c.neatins||c.faraDiagnostic)return c;
    let d='';
    const o={ce:c.ce,fn(S,U){
      const ok=typeof c.fn==='function'?!!c.fn(S,U):U.test(S,c);
      if(ES&&(c.curat||c.faraOraData)){
        const sp=c.fisier||opt.spec,s=ES.src(S,U,sp);
        if(s&&ES.oraData(s)){d=ES.mesajOraSalvata(S,U,sp,s,opt);return false}
      }
      d=ok?'':diagnostic(S,U,opt);return ok}};
    Object.defineProperty(o,'msg',{enumerable:true,get(){return d||(c.msgTactil&&ES&&ES.tactil()?c.msgTactil:c.msg)||''}});
    return o;
  });
}

/* ---------- 5. desenul browserului, pentru „Uite cum” ---------- */
function randare(codPagina,inaltime){
  const U=window.EditorWebUtil;
  const doc=U?U.previewDoc(codPagina):String(codPagina);
  return `<div class="ewt-randare"><div class="ewt-eticheta">Așa desenează browserul tău codul de mai sus:</div><iframe sandbox="" tabindex="-1" title="Pagina desenată de browser din codul de mai sus" style="height:${+inaltime||140}px" srcdoc="${esc(doc)}"></iframe></div>`;
}
const STIL=`.ewt-randare{margin:.4em 0 .7em;border:1px solid var(--line,#ccd4e2);border-radius:6px;overflow:hidden;background:#fff}
.ewt-eticheta{font-size:.78rem;color:var(--ink2,#4e5a6e);background:var(--paper2,#eef2f8);padding:3px 10px;border-bottom:1px solid var(--line,#ccd4e2)}
.ewt-randare iframe{display:block;width:100%;border:0;background:#fff}`;
function css(){if(!document.getElementById('editorweb-tabele-css')){const s=document.createElement('style');s.id='editorweb-tabele-css';s.textContent=STIL;document.head.appendChild(s)}}
if(document.head)css();else document.addEventListener('DOMContentLoaded',css);

window.EditorWebTabele={liste,tabele,celulePeRand,perechi,inchise,lista,tabel,dupaTabel,inLista,numereScrise,mesajText,diagnostic,cuDiagnostic,randare};
})();
