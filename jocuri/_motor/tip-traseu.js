/* Tipul de întrebare „traseu”: drumul prin meniurile aplicației până la opțiunea cerută (Word, Excel, PowerPoint, Access).
   Divide et impera: o cerință de examen = selectezi → ajungi la comandă → alegi opțiunea → scrii valoarea.
   Folosire în configurație:  tipuri: { traseu: JocTraseu }
   Întrebare:
     {t:'traseu', q, aplicatie:'Excel', selectie:'A1:D1',
      pasi:[
        {zona:'Fila', o:['Home (Pornire)','Insert (Inserare)','Page Layout (Aspect pagină)'], ok:2},
        {zona:'Comanda', o:['Margins (Margini)','Orientation (Orientare)','Size (Dimensiune)'], ok:0},
        {zona:'Din listă', o:['Normal','Wide (Lat)','Custom Margins… (Margini particularizate…)'], ok:2},
        {zona:'Caseta', eticheta:'Left (Stânga)', ok:'6', unitate:'cm'}          // pas de scris: valoarea se compară
      ], why}
   `ok` poate fi și o listă de indici, când mai multe drumuri sunt bune (ex. clic dreapta › Format Cells sau Ctrl+1).
   La un pas de scris, `ok` poate fi o listă de valori acceptate (ex. ['0 "lei"','0" lei"']).
   Fiecare clic greșit contează ca o încercare (ca la variante); drumul bun rămâne, elevul continuă de unde a greșit. */
(function(){
'use strict';
const CSS=`.trs{border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--paper)}
.trs .bar{display:flex;flex-wrap:wrap;gap:4px 6px;align-items:center;padding:8px 10px;background:var(--paper2);border-bottom:1px solid var(--line);font-family:var(--fm);font-size:.72rem;color:var(--ink2);min-height:2.4em}
.trs .bar .app{font-weight:700;color:var(--ink)}
.trs .bar .st{background:var(--paper);border:1px solid var(--line);border-radius:999px;padding:1px 8px;color:var(--ink);max-width:100%;overflow:hidden;text-overflow:ellipsis}
.trs .bar .sep{opacity:.6}
.trs .pas{padding:10px}
.trs .zona{font-family:var(--fm);font-size:.7rem;text-transform:uppercase;letter-spacing:.04em;color:var(--ink2);margin-bottom:6px}
.trs .ops{display:flex;flex-wrap:wrap;gap:6px}
.trs .ops button{border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:6px;padding:8px 10px;font:inherit;font-size:.9rem;text-align:left;max-width:100%}
.trs .ops button:hover:not(:disabled){border-color:var(--accent)}
.trs .ops button.bad{border-color:var(--bad);color:var(--bad);background:var(--badbg);text-decoration:line-through}
.trs .ops button.ok{border-color:var(--ok);color:var(--ok);background:var(--okbg)}
.trs .val{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.trs .val label{font-weight:600}
.trs .val input{border:1px solid var(--line);border-radius:6px;padding:8px 10px;font-family:var(--fm);font-size:1rem;min-width:0;width:12em;max-width:100%;background:var(--paper);color:var(--ink)}
.trs .val button{border:0;background:var(--accent);color:var(--accentInk);border-radius:6px;padding:8px 14px;font-weight:700}
.trs .sel{font-family:var(--fm);font-size:.75rem;color:var(--ink2);padding:6px 10px;border-bottom:1px dashed var(--line)}`;
const norm=s=>String(s).trim().toLowerCase().replace(/[“”„]/g,'"').replace(/\s+/g,' ').replace(/,/g,'.');
const scurt=s=>String(s).replace(/\s*\(.*?\)\s*$/,'');   // în bara de sus: doar numele, fără traducerea din paranteză
function okList(p){return Array.isArray(p.ok)?p.ok:[p.ok]}
function render(Q,body,api){
  if(!document.getElementById('tip-traseu-css')){const s=document.createElement('style');s.id='tip-traseu-css';s.textContent=CSS;document.head.appendChild(s)}
  const esc=api.esc;let k=0;const ales=[];const gresite={};
  // ordinea butoanelor se amestecă o dată pe întrebare: varianta bună nu are voie să stea mereu pe același loc
  // (evaluatorul pilotului Excel XII: prima variantă era cea bună la 27 din 54 de pași). data-i rămâne indicele din date.
  const ordine=Q.pasi.map(p=>p.o?(Q.fixa?p.o.map((_,i)=>i):api.shuffle(p.o.map((_,i)=>i))):null);
  function draw(){
    const p=Q.pasi[k];
    const bar=`<div class="bar"><span class="app">${esc(Q.aplicatie||'')}</span>${ales.map(a=>`<span class="sep">›</span><span class="st">${esc(a)}</span>`).join('')}</div>`;
    const sel=Q.selectie?`<div class="sel">Selecția: ${esc(Q.selectie)}</div>`:'';
    let pas='';
    if(!p){pas='<div class="pas"><div class="zona">Gata</div></div>'}
    else if(p.o){
      pas=`<div class="pas"><div class="zona">Pasul ${k+1} din ${Q.pasi.length} · ${esc(p.zona||'Alege')}</div><div class="ops">${
        ordine[k].map(i=>[p.o[i],i]).map(([x,i])=>`<button type="button" data-i="${i}" class="${(gresite[k]||[]).includes(i)?'bad':''}" ${(gresite[k]||[]).includes(i)||api.done()?'disabled':''}>${esc(x)}</button>`).join('')}</div></div>`;
    }else{
      pas=`<div class="pas"><div class="zona">Pasul ${k+1} din ${Q.pasi.length} · ${esc(p.zona||'Scrie valoarea')}</div><div class="val"><label for="trs-in">${esc(p.eticheta||'Valoarea')}</label>
        <input id="trs-in" type="text" autocomplete="off" spellcheck="false" ${api.done()?'disabled':''}>${p.unitate?`<span>${esc(p.unitate)}</span>`:''}<button type="button" id="trs-ok" ${api.done()?'disabled':''}>OK</button></div></div>`;
    }
    body.innerHTML=`<div class="trs">${bar}${sel}${pas}</div>`;
    body.querySelectorAll('.ops button').forEach(b=>b.onclick=()=>alege(+b.dataset.i));
    const inp=body.querySelector('#trs-in');
    if(inp){inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();scrie(inp.value)}});body.querySelector('#trs-ok').onclick=()=>scrie(inp.value)}
  }
  function avans(eticheta){
    ales.push(eticheta);k++;
    if(k>=Q.pasi.length){draw();api.resolve(true)}else draw();
  }
  function greseala(msg){
    api.resolve(false,msg);
    api.revealButton(()=>{
      while(k<Q.pasi.length){const p=Q.pasi[k];ales.push(p.o?scurt(p.o[okList(p)[0]]):`${p.eticheta||''}: ${okList(p)[0]}${p.unitate?' '+p.unitate:''}`);k++}
      draw();api.giveUp(esc(ales.join(' › ')));
    });
  }
  function alege(i){
    if(api.done())return;const p=Q.pasi[k];
    if(okList(p).includes(i)){avans(scurt(p.o[i]))}
    else{(gresite[k]=gresite[k]||[]).push(i);draw();greseala(p.indiciu?esc(p.indiciu):`„${esc(scurt(p.o[i]))}” nu duce la ce se cere. Gândește-te ce fel de comandă e: ${esc(p.zona||'')}.`)}
  }
  function scrie(v){
    if(api.done())return;const p=Q.pasi[k];
    if(String(v).trim()===''){api.feedback('bad','Scrie întâi valoarea.');return}
    if(okList(p).some(x=>norm(x)===norm(v)))avans(`${p.eticheta||''}: ${v}${p.unitate?' '+p.unitate:''}`);
    else greseala(p.indiciu?esc(p.indiciu):`Valoarea „${esc(v)}” nu e cea din cerință. Recitește cerința.`);
  }
  draw();
}
function rezolva(Q,body){
  Q.pasi.forEach(p=>{
    if(p.o){body.querySelector(`.trs .ops button[data-i="${okList(p)[0]}"]`).click()}
    else{const inp=body.querySelector('#trs-in');inp.value=okList(p)[0];body.querySelector('#trs-ok').click()}
  });
}
/* greșeala tipică: un alt buton la primul pas (trebuie respins) */
function gresit(Q,body){
  const p=Q.pasi[0],i=p.o.findIndex((_,j)=>!okList(p).includes(j));
  body.querySelector(`.trs .ops button[data-i="${i}"]`).click();
}
window.JocTraseu={render,rezolva,gresit};
})();
