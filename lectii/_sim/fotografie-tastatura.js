/* Extensia „fotografie-tastatura” pentru simulatorul comun lectii/_sim/fotografie.js (pe acela NU îl modifică).
   PROPRIETAR: autorul lecției V · M1 · nr. 2 (28.09.2026). Cerută de judecătorul lecției V/2 (m5, m6).
   Ce adaugă, peste simulatorul neschimbat:
   1) fotografia se poate folosi și DOAR CU TASTATURA: Tab ajunge pe fotografie; un cerc roșu punctat (cursorul) se mută
      cu săgețile (câte 2%; cu Shift, câte 10%); Enter sau Spațiu „atinge” fotografia acolo. Atingerea merge pe ACELAȘI drum
      ca un clic (un eveniment click cu coordonatele cursorului), deci aceleași zone, aceleași mesaje, aceleași teste.
      Cursorul se vede doar la focus din tastatură (:focus-visible), nu la clic sau la atingere.
   2) butonul „Mărește fotografia” are cel puțin 36 px înălțime (regula 20: orice zonă de atins ≥ 32 px).
   Folosire (după fotografie.js):
     <script src="../../_sim/fotografie.js"></script>
     <script src="../../_sim/fotografie-tastatura.js"></script>
     JocMotor.porneste({ …, tipuri:{fotografie:SimFotografieTastatura} })
   rezolva() și gresit() sunt cele ale simulatorului comun (poarta le folosește neschimbate). */
(function(){
'use strict';
if(!window.SimFotografie)return;
const CSS=`
.foto-credit .foto-zoom{min-height:36px}
.foto-wrap:focus{outline:none}
.foto-wrap:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.foto-cursor{position:absolute;width:28px;height:28px;margin:-14px 0 0 -14px;border:3px dashed #E4002B;border-radius:50%;box-shadow:0 0 0 2px #fff;pointer-events:none;display:none;box-sizing:border-box}
.foto-wrap:focus-visible .foto-cursor{display:block}
.foto-tast{font-size:.8rem;color:var(--ink2);margin:2px 0 0;line-height:1.35}
@media (hover:none),(pointer:coarse){.foto-tast{display:none}}
`;
function stil(){
  if(document.getElementById('sim-fotografie-tastatura-css'))return;
  const s=document.createElement('style');s.id='sim-fotografie-tastatura-css';s.textContent=CSS;document.head.appendChild(s);
}
function tastatura(body){
  const wrap=body.querySelector('.foto-wrap');
  if(!wrap||wrap.dataset.tast)return;
  wrap.dataset.tast='1';
  const img=wrap.querySelector('img');
  wrap.tabIndex=0;
  wrap.setAttribute('role','group');
  wrap.setAttribute('aria-label','Fotografia. Mută cercul punctat cu săgețile și apasă Enter ca să pui acolo eticheta aleasă.');
  const cur=document.createElement('span');cur.className='foto-cursor';cur.setAttribute('aria-hidden','true');wrap.appendChild(cur);
  let x=50,y=50;
  const arata=()=>{cur.style.left=x+'%';cur.style.top=y+'%'};
  arata();
  wrap.addEventListener('keydown',e=>{
    const p=e.shiftKey?10:2;let folosita=true;
    if(e.key==='ArrowLeft')x=Math.max(0,x-p);
    else if(e.key==='ArrowRight')x=Math.min(100,x+p);
    else if(e.key==='ArrowUp')y=Math.max(0,y-p);
    else if(e.key==='ArrowDown')y=Math.min(100,y+p);
    else if(e.key==='Enter'||e.key===' '){
      const r=img.getBoundingClientRect();
      wrap.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:r.left+r.width*x/100,clientY:r.top+r.height*y/100}));
    }else folosita=false;
    if(folosita){e.preventDefault();arata();cur.scrollIntoView({block:'nearest',inline:'nearest'})}
  });
  const cr=body.querySelector('.foto-credit');
  if(cr){const p=document.createElement('p');p.className='foto-tast';
    p.textContent='Fără mouse: apasă Tab până ajungi pe fotografie, mută cercul roșu punctat cu săgețile, apoi apasă Enter.';cr.after(p)}
}
window.SimFotografieTastatura={
  render(Q,body,api){stil();const r=window.SimFotografie.render(Q,body,api);tastatura(body);return r},
  rezolva(Q,body,api){return window.SimFotografie.rezolva(Q,body,api)},
  gresit(Q,body,api){return window.SimFotografie.gresit(Q,body,api)}
};
})();
