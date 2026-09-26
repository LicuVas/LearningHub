/* tip-html.js — ATELIERUL HTML al lecțiilor-joc (26.09.2026). Se încarcă după motor.js:
     <script src="../_motor/tip-html.js"></script>
   și se folosește ca orice întrebare: {t:'html', q, start, checks:[…], solutie, why, fisier?:'pagina.html'}.

   De ce: el a arătat htmledit.squarefree.com („o idee simplă - dar i-ar trebui un mod de testare”). Aici:
     - scrii în stânga, pagina se desenează imediat dedesubt/alături (ca în browser);
     - editor ca în Notepad++: numere de rând, Tab = 2 spații, Enter păstrează indentarea;
     - MODUL DE TESTARE: fiecare cerință e un test cu nume („Titlul <h1> e «Munții Carpați»”). „Rulează testele”
       le bifează verde/roșu; după prima rulare se re-verifică singure cât scrii;
     - CORECTORUL: arată etichetele neînchise, închise greșit sau care nu există (<h7>, </heat>), cu rândul lor —
       adică exact ce ar fi trebuit să vadă elevul, nu doar „nu e bine”;
     - „Salvează pagina pe calculator”: descarcă fișierul .html, pe care îl deschide în browserul ADEVĂRAT
       (scopul final: lucrul real, decis 25.09.2026).
   Fără `checks` = atelier liber (fără teste): doar editor + pagină + descărcare.

   O verificare (câmpurile se combină pe ACELAȘI element), cu `ce` = numele testului arătat elevului:
     el:'selector CSS' · text:'textul exact' (fără diferențe de litere mari/diacritice/spații) · full:true
     attrs:{src:'carpati.jpg', alt:'*'} ('*' = orice valoare nevidă) · min:3, child:'li'
     style:{'text-align':'center','background-color':'*'} · absent:'regex' (NU are voie să apară în cod)
     are:'regex' (TREBUIE să apară în cod) · curat:true (corectorul nu găsește nicio etichetă greșită)
     msg:'ce îi spunem elevului când testul pică' */
(function(){
'use strict';
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const VOID=new Set(['area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr']);
// etichetele pe care le poate întâlni un elev de gimnaziu; o etichetă din afara listei e semnalată ca „nu există”
const STIUTE=new Set(('html head title body meta link style script h1 h2 h3 h4 h5 h6 p br hr b i u strong em small mark sub sup span div '+
  'img a ul ol li table tr td th thead tbody tfoot caption header footer nav main section article aside figure figcaption '+
  'blockquote pre code q abbr cite form input button label select option textarea audio video source iframe center font').split(' '));
const CSS=`.hx{display:grid;gap:10px}
@media (min-width:900px){.hx.lat{grid-template-columns:1fr 1fr}}
.hx-tools{display:flex;flex-wrap:wrap;gap:6px}
.hx-tools button{font-family:var(--fm);font-size:.88rem;min-width:2.4em;padding:4px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper2);color:var(--ink);font-variant-ligatures:none}
.hx-ed{display:flex;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--paper)}
.hx-nr{flex:none;padding:10px 6px 10px 8px;text-align:right;font-family:var(--fm);font-size:.9rem;line-height:1.5;color:var(--ink2);background:var(--paper2);border-right:1px solid var(--line);user-select:none;white-space:pre;overflow:hidden}
.hx-ta{flex:1;min-width:0;min-height:15em;resize:vertical;border:0;outline:0;font-family:var(--fm);font-size:.9rem;line-height:1.5;padding:10px;background:transparent;color:var(--ink);tab-size:2;white-space:pre;overflow:auto;font-variant-ligatures:none}
.hx-ta:focus-visible{box-shadow:inset 0 0 0 2px var(--accent)}
.hx-prev{border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--paper2);display:flex;flex-direction:column}
.hx-prev .bar{display:flex;align-items:center;gap:6px;padding:5px 10px;font-family:var(--fm);font-size:.72rem;color:var(--ink2)}
.hx-prev .bar i{width:8px;height:8px;border-radius:50%;background:var(--line);display:block;flex:none}
.hx-prev .bar .tab{margin-left:8px;padding:1px 10px;border:1px solid var(--line);border-radius:6px 6px 0 0;background:var(--paper);color:var(--ink);max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hx-prev iframe{display:block;width:100%;min-height:220px;flex:1;border:0;border-top:1px solid var(--line);background:#fff}
.hx-teste{border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--paper2)}
.hx-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.hx-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem}
.hx-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:700}
.hx-teste li.ok .s{color:var(--ok)} .hx-teste li.rau .s{color:var(--bad)}
.hx-teste li .m{display:block;font-size:.85rem;color:var(--bad)}
.hx-lint{font-size:.9rem;border-radius:8px;padding:8px 12px;background:var(--badbg);color:var(--ink);border:1px solid var(--bad)}
.hx-lint.bun{background:var(--okbg);border-color:var(--ok)}
.hx-lint ul{margin:4px 0 0;padding-left:1.2em}
.hx-lint code,.hx-teste code{font-variant-ligatures:none}`;

function parse(src){return new DOMParser().parseFromString(src,'text/html')}
function styles(el){const o={};String(el.getAttribute('style')||'').split(';').forEach(p=>{const i=p.indexOf(':');if(i>0)o[p.slice(0,i).trim().toLowerCase()]=p.slice(i+1).trim().toLowerCase()});return o}
function fits(el,c){
  if(c.text!=null&&norm(el.textContent)!==norm(c.text))return false;
  if(c.full&&!norm(el.textContent))return false;
  if(c.attrs)for(const [k,v] of Object.entries(c.attrs)){const a=el.getAttribute(k);if(a==null||!a.trim())return false;if(v!=='*'&&a.trim().replace(/^\.\//,'').toLowerCase()!==String(v).toLowerCase())return false}
  if(c.style){const st=styles(el);for(const [k,v] of Object.entries(c.style)){const alt=k==='background-color'?(st[k]||st['background']):st[k];if(!alt)return false;if(v!=='*'&&alt.replace(/\s*!important$/,'')!==v)return false}}
  if(c.min){const kids=[...el.children].filter(x=>x.matches(c.child)&&norm(x.textContent));if(kids.length<c.min)return false}
  return true;
}
/* CORECTORUL: etichete cu nume inexistent, închideri fără deschidere, închideri în ordinea greșită, etichete
   rămase deschise. Întoarce [{rand, text}] în limbajul elevului. Nu e un validator complet: prinde greșelile
   de gimnaziu (cele din exercițiile de „găsește greșeala”). */
function corecteaza(src){
  const out=[],stiva=[],re=/<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g;let m;
  const rand=i=>src.slice(0,i).split('\n').length;
  while((m=re.exec(src))){
    if(!m[2])continue;
    const inchide=m[1]==='/',nume=m[2].toLowerCase(),r=rand(m.index);
    if(!STIUTE.has(nume)&&inchide&&out.some(x=>x.rand===r&&x.nume===nume))continue;   // <h7>…</h7>: o singură problemă
    if(!STIUTE.has(nume)){out.push({rand:r,nume,text:`<code>&lt;${inchide?'/':''}${esc(m[2])}&gt;</code> nu e o etichetă HTML${/^h\d$/.test(nume)?' (titlurile merg doar de la <code>&lt;h1&gt;</code> la <code>&lt;h6&gt;</code>)':''}. Verifică numele, literă cu literă.`});continue}
    if(VOID.has(nume)){if(inchide)out.push({rand:r,text:`<code>&lt;${nume}&gt;</code> nu are etichetă de închidere: șterge <code>&lt;/${nume}&gt;</code>.`});continue}
    if(!inchide){stiva.push({nume,r});continue}
    const k=stiva.map(x=>x.nume).lastIndexOf(nume);
    if(k<0){out.push({rand:r,text:`<code>&lt;/${nume}&gt;</code> închide o etichetă care nu a fost deschisă.`});continue}
    for(let j=stiva.length-1;j>k;j--)out.push({rand:stiva[j].r,text:`<code>&lt;${stiva[j].nume}&gt;</code> nu e închisă: lipsește <code>&lt;/${stiva[j].nume}&gt;</code> înainte de <code>&lt;/${nume}&gt;</code> (rândul ${r}).`});
    stiva.length=k;
  }
  // p și li se pot închide singure în HTML, dar la gimnaziu învățăm să le închidem mereu
  stiva.forEach(x=>out.push({rand:x.r,text:`<code>&lt;${x.nume}&gt;</code> nu e închisă: lipsește <code>&lt;/${x.nume}&gt;</code>.`}));
  return out.sort((a,b)=>a.rand-b.rand);
}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function testeaza(src,checks){
  const doc=parse(src);
  return checks.map(c=>{
    let ok;
    if(c.absent)ok=!new RegExp(c.absent,'i').test(doc.documentElement.textContent+'\n'+src);
    else if(c.are)ok=new RegExp(c.are,'i').test(src);
    else if(c.curat)ok=!corecteaza(src).length;
    else ok=[...doc.querySelectorAll(c.el)].some(el=>fits(el,c));
    return {c,ok};
  });
}
function problems(src,checks){return testeaza(src,checks||[]).filter(x=>!x.ok).map(x=>x.c.msg)}
/* previzualizarea: pagina elevului, curățată, într-un iframe sandbox fără scripturi și fără rețea */
function previewDoc(src){
  const doc=parse(src);
  doc.querySelectorAll('script,iframe,object,embed,link,meta[http-equiv],base,form').forEach(x=>x.remove());
  doc.querySelectorAll('*').forEach(el=>[...el.attributes].forEach(a=>{if(/^on/i.test(a.name))el.removeAttribute(a.name)}));
  const m=doc.createElement('meta');m.setAttribute('http-equiv','Content-Security-Policy');m.setAttribute('content',"default-src 'none'; style-src 'unsafe-inline'; img-src data:");
  doc.head.prepend(m);
  const s=doc.createElement('style');s.textContent='html{color-scheme:light}body{font-family:"Times New Roman",serif;margin:8px;background:#fff;color:#000}a{pointer-events:none}img{max-width:100%}';
  doc.head.insertBefore(s,m.nextSibling);
  return '<!doctype html>'+doc.documentElement.outerHTML;
}
function titluPagina(src){const t=parse(src).querySelector('title');return t&&t.textContent.trim()||'(pagina fără titlu)'}

function render(Q,body,api){
  if(!document.getElementById('tip-html-css')){const st=document.createElement('style');st.id='tip-html-css';st.textContent=CSS;document.head.appendChild(st)}
  const checks=Q.checks||[],unelte=Q.unelte||['<','>','/','"','=','<p>','</p>'];
  body.insertAdjacentHTML('beforeend',`<div class="hx ${Q.alaturi===false?'':'lat'}">
    <div>
      <div class="hx-tools" role="group" aria-label="Semne și etichete de inserat">${unelte.map(k=>`<button type="button" data-k="${esc(k)}">${esc(k)}</button>`).join('')}<button type="button" data-inchide="1" title="Scrie eticheta de închidere pentru ultima etichetă rămasă deschisă">închide eticheta</button></div>
      <div class="hx-ed" style="margin-top:6px"><div class="hx-nr" aria-hidden="true">1</div>
      <textarea class="hx-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Codul HTML al paginii (Tab = indentare)">${esc(Q.start||'')}</textarea></div>
      <p class="hint" style="margin:6px 0 0"><kbd>Tab</kbd> împinge rândul la dreapta (indentare), <kbd>Shift</kbd>+<kbd>Tab</kbd> îl trage înapoi. <kbd>Enter</kbd> păstrează alinierea rândului de sus.</p>
    </div>
    <div class="hx-prev"><div class="bar"><i></i><i></i><i></i><span class="tab" title="Titlul paginii, așa cum apare pe fila browserului"></span></div><iframe sandbox="" title="Previzualizarea paginii tale"></iframe></div>
  </div>
  <div class="hx-lint" hidden aria-live="polite"></div>
  ${checks.length?`<div class="hx-teste"><div class="lbl">Testele sarcinii · <span class="nr">0 din ${checks.length} trec</span></div><ol>${checks.map((c,i)=>`<li data-i="${i}"><span class="s">○</span><span>${c.ce||'Cerința '+(i+1)}<span class="m" hidden></span></span></li>`).join('')}</ol></div>`:''}
  <div class="row" style="margin-top:4px"><button class="btn ghost sm hx-desc" type="button">Salvează pagina pe calculator (${esc(Q.fisier||'pagina.html')})</button></div>
  <p class="hint" style="margin:2px 0 0">Imaginile nu se încarcă aici, așa că vezi în locul lor textul <code>alt</code>. Fișierul salvat îl deschizi cu dublu-clic în browser; cu clic dreapta → <b>Deschide cu → Notepad</b> îi vezi codul.</p>`);
  const ta=body.querySelector('.hx-ta'),nr=body.querySelector('.hx-nr'),fr=body.querySelector('iframe'),tab=body.querySelector('.hx-prev .tab'),lint=body.querySelector('.hx-lint');
  let testat=false,tm=null;
  function numere(){const n=ta.value.split('\n').length;nr.textContent=Array.from({length:n},(_,i)=>i+1).join('\n');nr.scrollTop=ta.scrollTop}
  function arataTeste(){
    if(!checks.length)return [];
    const rez=testeaza(ta.value,checks);
    rez.forEach((x,i)=>{const li=body.querySelector(`.hx-teste li[data-i="${i}"]`);if(!li)return;li.className=x.ok?'ok':'rau';li.querySelector('.s').textContent=x.ok?'✓':'✗';
      const m=li.querySelector('.m');m.hidden=x.ok;m.textContent=x.ok?'':(x.c.msg||'')});
    body.querySelector('.hx-teste .nr').textContent=`${rez.filter(x=>x.ok).length} din ${rez.length} trec`;
    return rez;
  }
  function arataCorector(){
    const L=corecteaza(ta.value);
    if(!L.length){lint.hidden=!testat;lint.className='hx-lint bun';lint.innerHTML='<b>Corectorul:</b> toate etichetele sunt scrise corect și închise la locul lor.';return}
    lint.hidden=false;lint.className='hx-lint';
    lint.innerHTML=`<b>Corectorul a găsit ${L.length===1?'o problemă':L.length+' probleme'}</b> (browserul nu ți le-ar spune — ar ghici ce ai vrut):<ul>${L.slice(0,6).map(x=>`<li>rândul ${x.rand}: ${x.text}</li>`).join('')}</ul>`;
  }
  // după „Încă un exercițiu” editorul vechi dispare din pagină; o actualizare rămasă în așteptare nu mai are ce desena
  const upd=()=>{if(!ta.isConnected)return;fr.srcdoc=previewDoc(ta.value);tab.textContent=titluPagina(ta.value);numere();if(testat){arataTeste();arataCorector()}};
  ta.addEventListener('input',()=>{numere();clearTimeout(tm);tm=setTimeout(upd,200)});
  ta.addEventListener('scroll',()=>{nr.scrollTop=ta.scrollTop});
  // editorul: Tab / Shift+Tab / Enter cu indentare, ca în Notepad++
  ta.addEventListener('keydown',e=>{
    if(api.done())return;
    const v=ta.value,a=ta.selectionStart,b=ta.selectionEnd,inc=v.lastIndexOf('\n',a-1)+1;
    if(e.key==='Tab'){
      e.preventDefault();
      if(e.shiftKey){const sp=v.slice(inc).match(/^ {1,2}/);if(sp){ta.value=v.slice(0,inc)+v.slice(inc+sp[0].length);ta.selectionStart=ta.selectionEnd=Math.max(inc,a-sp[0].length)}}
      else{ta.value=v.slice(0,a)+'  '+v.slice(b);ta.selectionStart=ta.selectionEnd=a+2}
      ta.dispatchEvent(new Event('input'));
    }else if(e.key==='Enter'&&!e.ctrlKey&&!e.altKey){
      e.preventDefault();
      const linie=v.slice(inc,a),ind=linie.match(/^\s*/)[0];
      // după o etichetă de deschidere lăsată singură pe rând (<ul>, <body>…), rândul nou intră cu 2 spații
      const m=linie.trim().match(/^<([a-z][a-z0-9]*)\b[^>]*>$/i),extra=m&&!VOID.has(m[1].toLowerCase())?'  ':'';
      ta.value=v.slice(0,a)+'\n'+ind+extra+v.slice(b);ta.selectionStart=ta.selectionEnd=a+1+ind.length+extra.length;
      ta.dispatchEvent(new Event('input'));
    }
  });
  body.querySelectorAll('.hx-tools button').forEach(bt=>bt.onclick=()=>{
    if(api.done())return;
    let k=bt.dataset.k;
    if(bt.dataset.inchide){
      const inainte=ta.value.slice(0,ta.selectionStart),st=[],re=/<(\/?)([a-z][a-z0-9]*)\b[^>]*>/gi;let m;
      while((m=re.exec(inainte))){const n=m[2].toLowerCase();if(VOID.has(n))continue;if(m[1]){const j=st.lastIndexOf(n);if(j>=0)st.length=j}else st.push(n)}
      if(!st.length){lint.hidden=false;lint.className='hx-lint';lint.innerHTML='Nu e nicio etichetă deschisă înainte de cursor.';return}
      k='</'+st[st.length-1]+'>';
    }
    const a=ta.selectionStart,e=ta.selectionEnd;ta.value=ta.value.slice(0,a)+k+ta.value.slice(e);ta.focus();ta.selectionStart=ta.selectionEnd=a+k.length;upd();
  });
  body.querySelector('.hx-desc').onclick=()=>{
    const u=URL.createObjectURL(new Blob([ta.value],{type:'text/html;charset=utf-8'}));
    const l=document.createElement('a');l.href=u;l.download=Q.fisier||'pagina.html';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);
  };
  upd();
  if(!checks.length)return;   // atelier liber: fără teste
  const nav=api.checkButton(()=>{
    testat=true;upd();const rez=arataTeste();arataCorector();
    const pic=rez.filter(x=>!x.ok);
    if(!pic.length){ta.readOnly=true;nav.innerHTML='';api.resolve(true)}
    else{api.resolve(false,`${pic.length===1?'Un test nu trece':pic.length+' teste nu trec'} (marcate cu ✗ în lista de teste). Repară și apasă din nou: testele se verifică și singure cât scrii.`);
      api.revealButton(()=>{ta.value=Q.solutie;ta.readOnly=true;upd();arataTeste();nav.innerHTML='';api.giveUp('un cod corect e acum în editor, iar pagina lui în previzualizare. Compară-l cu al tău, rând cu rând.')})}
  },'Rulează testele');
}
function rezolva(Q,body){const ta=body.querySelector('.hx-ta');ta.value=Q.solutie;ta.dispatchEvent(new Event('input',{bubbles:true}))}
/* răspunsul greșit tipic, pornind de la soluție: prima greșeală de copil pe care testele o prind */
const GRESELI=[
  s=>s.replace(/\salt\s*=\s*"[^"]*"/gi,''),
  s=>s.replace(/<a\s+href=/gi,'<a src='),
  s=>s.replace(/text-align\s*:\s*center/gi,'align: center'),
  s=>s.replace(/<\/(h1|p|li|title|head|body|ul|ol|table|tr|td)>/i,'<$1>'),
  s=>s.replace(/\s*<li>[^<]*<\/li>(?![\s\S]*<li>)/i,'').replace(/\s*<li>[^<]*<\/li>(?![\s\S]*<li>)/i,''),
  s=>s.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)\s*(<p>[^<]*<\/p>)/i,'$1\n$2\n$2')
];
function gresit(Q,body){
  const ta=body.querySelector('.hx-ta');let src=Q.start||'';
  for(const g of GRESELI){const s=g(Q.solutie);if(s!==Q.solutie&&problems(s,Q.checks).length){src=s;break}}
  ta.value=src;ta.dispatchEvent(new Event('input',{bubbles:true}));
}
window.TipHtml={corecteaza,testeaza,problems,previewDoc};
if(window.JocMotor&&JocMotor.tip)JocMotor.tip('html',{render,rezolva,gresit});
})();
