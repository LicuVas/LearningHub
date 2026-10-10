/* Simulatorul „audio-linie” pentru lecțiile LearningHub — fișier comun (lectii/_sim/audio-linie.js).
   PROPRIETAR: autorul lecției VII · M2 · nr. 11 („Interfața unei aplicații de prelucrare audio / audio-video”),
   creat în tura de noapte 10→11.10.2026. Lecțiile VII/12-15 îl EXTIND (fișiere noi, de ex. audio-linie-inregistrare.js),
   nu îl rescriu; ce au voie să schimbe și ce nu: lectii/vii/m2-l11/surse.md, „Pentru lecția următoare”.

   CE SIMULEAZĂ (doar interfața de recunoscut și de folosit la redare):
     mod:'audio'  fereastra Audacity: butoanele de redare (Redare/Pauză, Stop, buton roșu, Început, Sfârșit), lupele
                  Mărește/Micșorează, afișajul timpului (00h00m02.30s), linia de timp în secunde, pista cu unda, capul de
                  redare, bara de defilare. Redarea e SIMULATĂ (capul merge în timp real); cu `sunet` se aude și fișierul
                  local al lecției (nimic nu pleacă din pagină).
     mod:'video'  editorul Clipchamp: „Conținutul meu media” (biblioteca), previzualizarea cu butoanele de sub ea,
                  linia de timp jos cu pistele text / video / audio, capul de redare (linie cu cerc), Mărește/Micșorează/
                  Potrivește la colțul liniei de timp.

   FIDELITATE (probat în Audacity 4.0 REAL, pe desktopul ascuns, 11.10.2026 — lectii/vii/m2-l11/_proba/audacity_proba*.json):
     - Space = Redare/Oprire; butonul ▶ devine ‖ (Pauză) cât timp redă; ‖ oprește pe loc, ▶ continuă de acolo;
       în PAUZĂ, Space CONTINUĂ redarea, ca ▶ (probat de judecătorul 1, _verificare/j1_proba_a.json Q1);
       (Audacity 3 e altfel: acolo continui apăsând încă o dată ‖, iar ▶ pornește din nou — o spune lecția, simulatorul e Audacity 4);
     - Stop (■ sau Space) duce capul de redare ÎNAPOI de unde a pornit redarea (sau unde l-ai pus ultima dată cu un clic);
     - redarea care ajunge singură la capătul sunetului se oprește, iar capul RĂMÂNE la capăt; Redare de acolo pornește de la 0;
     - un clic pe undă (pe pistă) sau pe linia de timp mută capul de redare acolo; pe linia de timp NU pornește redarea
       (Audacity 4; în Audacity 3 da, „Quick-Play” — o spune lecția); un clic în timpul redării sare acolo și redarea continuă;
     - o tragere pe undă alege o bucată (porțiunea mai deschisă), fără să mute capul de redare (Audacity 4);
     - Început / Sfârșit / butonul roșu sunt stinse cât timp redă, dar APRINSE în pauză (j1a_Q1a, Q2a);
       |◀ / ▶| apăsate în pauză OPRESC redarea și mută capul la 0:00 / la capăt; ▶ apoi pornește de la 0:00 (și de la capăt
       pornește de la 0:00), iar ■ întoarce capul la 0:00 (probat 11.10.2026, _proba/audacity_proba5.json, _capturi/foaie_p5.png);
     - |◀ duce capul la 0:00 și derulează și vederea la 0:00 (j1a_Q6c);
     - Mărește dublează, Micșorează înjumătățește; mărirea se face în jurul capului de redare.
   SCHIMBĂRI 11.10.2026 (autorul proaspăt al lecției 11, după judecata 1; API-ul NU s-a schimbat):
     01:45 Space în pauză = continuă (era: Stop); butoanele |◀ ▶| și roșu aprinse în pauză (erau stinse), iar |◀ / ▶| (și
           Home / End) apăsate în pauză opresc redarea și mută capul (jurnalul primește 'inceput' / 'sfarsit', nu 'stop'); |◀ derulează vederea
           la 0:00 și în modul audio; Space pe un buton din simulator (ajuns acolo cu Tab) apasă butonul, nu pornește redarea;
           rigla 34 px (era 30 px; ținta de atingere ≥ 32 px); verificarea `stopInainte` judecă doar oprirea de după
           ULTIMA pornire a redării (era: toate opririle din jurnal, deci un Stop târziu bloca exercițiul pentru totdeauna).
     Abateri spuse elevului pe ecran: butonul roșu (înregistrarea, lecția 12) nu înregistrează aici; bucata aleasă prin tragere
     nu se taie/copiază aici (lecția 13); în Clipchamp, un clic pe un clip doar îl alege (capul se mută din linia de timp).
     Clipchamp NU s-a putut porni (cere contul profesorului): ce face e din documentația Microsoft (surse.md), restul `nesigur`.

   FOLOSIRE ÎN PAGINĂ (după motor.js):
     <script src="../../_sim/audio-linie.js"></script>
     JocMotor.porneste({ …, tipuri:{audiolinie:TipAudioLinie} })
     Întrebare / exercițiu: {t:'audiolinie', q, mod?, nume?, piste|unda, durata?, sunet?, vedere?, start?:[acțiuni],
                             teste:[{ce, <verificare>:parametru, cum?}], solutie:[acțiuni], gresit:[acțiuni], why, ajutor?}
       unda: vector de vârfuri (0…1) la fiecare 1/50 s (pentru o singură pistă audio, numită `nume`);
       piste: [{tip:'audio'|'video'|'text', nume, clipuri:[{id, nume, start, durata, unda?, culoare?}]}].

   API PUBLIC (pentru lecțiile următoare și pentru probe):
     const a = AudioLinie.creeaza(element, opțiuni)   // aceleași opțiuni ca mai sus (fără q/teste)
     a.stare()      → {p, s, reda, pauza, v0, span, sel, durata, clipAles, mareste, micsoreaza}
     a.jurnal()     → [{tip:'redare'|'pauza'|'continua'|'stop'|'capat'|'clic'|'rigla'|'cauta'|'mareste'|'micsoreaza'|
                        'inceput'|'sfarsit'|'potriveste'|'selectie'|'clipAles'|'rosu'|'inainte5'|'inapoi5', t, …}]
     a.auzit()      → intervalele redate [[de_la, până_la], …]
     a.simuleaza([acțiuni]) acțiunile, pe loc (ceas virtual): {clic:t} {rigla:t} {reda:1} {asteapta:sec} {pauza:1} {stop:1}
                    {inceput:1} {sfarsit:1} {mareste:n} {micsoreaza:n} {potriveste:1} {tragere:[a,b]} {clip:'id'} {tasta:'Space'|'p'}
     a.avans(sec)   înaintează ceasul redării fără să aștepți;  a.reset() starea de la deschidere (pistele rămân)
     a.piste()      pistele (obiecte vii; după ce le schimbi: a.redesenare());  a.redesenare()
     a.adaugaButon({id, eticheta, simbol, grup:'redare'|'vedere', apasa(a), activ?(stare)})
     a.mesaj(html)  a.on(fn) / a.off(fn): fn(stare, ev) la fiecare schimbare (și evenimentul DOM 'audiolinie' pe a.radacina)
     a.pasRigla() din câte în câte secunde scrie linia de timp acum (depinde de mărire și de lățimea ecranului)
     a.focus()  a.distruge()
     AudioLinie.verificari[nume] = (a, parametru) => bool   (verificările testelor; se pot adăuga altele)
   NU schimba în fișierul acesta comportamentul probat (lista FIDELITATE): lecțiile 11-15 se sprijină pe el. */
(function(){
'use strict';
const VERS='1.1 (11.10.2026)';
const CSS=`
.al{--al-bg:#f3f3f6;--al-ink:#1d2330;--al-ink2:#5a6275;--al-line:#c9ccd6;--al-btn:#e2e3ea;--al-acc:#2fb5a0;--al-tr:#3d4150;--al-clip:#f19a9a;--al-clip2:#ec7f7f;--al-unda:#2a1414;
  background:var(--al-bg);color:var(--al-ink);border:1px solid var(--al-line);border-radius:8px;font:14px/1.3 "Segoe UI",system-ui,sans-serif;outline:none;max-width:100%;overflow:hidden;user-select:none;-webkit-user-select:none}
.al:focus-visible{box-shadow:0 0 0 3px #7aa7ff}
.al-titlu{font-size:.8rem;color:var(--al-ink2);padding:4px 10px;border-bottom:1px solid var(--al-line);background:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.al-unelte{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;padding:6px 8px;border-bottom:1px solid var(--al-line)}
.al-grup{display:flex;gap:3px;align-items:flex-start}
.al-b{display:flex;flex-direction:column;align-items:center;gap:1px;min-width:44px;min-height:44px;padding:3px 2px 2px;border:0;border-radius:5px;background:var(--al-btn);color:var(--al-ink);cursor:pointer;font:inherit}
.al-b .ic{font-size:17px;line-height:20px;height:20px;font-family:"Segoe UI Symbol","Segoe UI",system-ui,sans-serif}
.al-b .et{font-size:.66rem;line-height:1;color:var(--al-ink2);white-space:nowrap}
.al-b:hover{filter:brightness(.95)}
.al-b.verde .ic{color:#169c86}.al-b.rosu .ic{color:#e8476b}
.al-b.activ{background:var(--al-acc)}.al-b.activ .ic,.al-b.activ .et{color:#06231e}
.al-b[disabled]{opacity:.38;cursor:default}
.al-ceas{font:600 15px/1 Consolas,"Fira Mono",monospace;letter-spacing:.06em;background:#1f2430;color:#f5f7ff;padding:9px 9px;border-radius:5px;min-height:20px}
.al-sunet{margin-left:auto}
.al-corp{display:flex;align-items:stretch;background:var(--al-tr)}
.al-panou{flex:0 0 96px;background:#eceef3;border-right:1px solid var(--al-line);display:flex;flex-direction:column}
.al-panou .cap{height:34px;border-bottom:1px solid var(--al-line);font-size:.75rem;color:var(--al-ink2);padding:7px 6px 0}
.al-panou .pn{height:96px;padding:6px;box-sizing:border-box;font-size:.75rem;border-bottom:1px solid var(--al-line);overflow:hidden}
.al-panou .pn b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:6px}
.al-panou .ms{display:flex;gap:3px}.al-panou .ms span{border:1px solid var(--al-line);border-radius:3px;padding:0 4px;color:var(--al-ink2)}
.al-zona{position:relative;flex:1 1 auto;min-width:0;overflow:hidden;touch-action:pan-y;cursor:text}
.al-rigla{position:relative;height:34px;background:#e6e7ec;border-bottom:1px solid var(--al-line);cursor:pointer}
.al-rigla i{position:absolute;bottom:0;width:1px;background:#8a8f9e}
.al-rigla span{position:absolute;top:3px;font-size:.72rem;color:#2c3140;transform:translateX(2px);white-space:nowrap}
.al-pista{position:relative;height:96px;border-bottom:1px solid #2b2e39}
.al-pista canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.al-sel{position:absolute;top:34px;bottom:0;background:rgba(255,255,255,.38);pointer-events:none;display:none}
.al-cap{position:absolute;top:0;bottom:0;width:0;pointer-events:none;z-index:3}
.al-cap::before{content:"";position:absolute;left:-1px;top:14px;bottom:0;width:2px;background:#30333c;box-shadow:0 0 0 1px rgba(255,255,255,.55)}
.al-cap::after{content:"";position:absolute;left:-7px;top:12px;width:12px;height:12px;background:#fff;border:1px solid #30333c;border-radius:2px 2px 6px 6px}
.al-defilare{display:block;width:calc(100% - 16px);height:32px;margin:2px 8px 0;accent-color:#4b5263;cursor:pointer}
.al-mesaj{margin:2px 8px 8px;min-height:1.3em;font-size:.86rem;color:var(--al-ink)}
.al-mesaj:empty{display:none}
/* modul video (Clipchamp) */
.al-video{--al-bg:#f7f6fb;--al-acc:#7b3ff2;--al-tr:#fbfaff}
.al-sus{display:flex;flex-wrap:wrap;gap:8px;padding:8px;border-bottom:1px solid var(--al-line)}
.al-biblio{flex:1 1 150px;max-width:230px;background:#fff;border:1px solid var(--al-line);border-radius:6px;padding:6px 8px}
.al-biblio b{font-size:.8rem}
.al-biblio ul{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.al-biblio li button{width:100%;text-align:left;min-height:34px;border:1px solid var(--al-line);border-radius:5px;background:#f4f1ff;font:inherit;font-size:.8rem;cursor:pointer;padding:3px 6px}
.al-prev{flex:2 1 220px;display:flex;flex-direction:column;gap:6px;min-width:0}
.al-ecran{position:relative;aspect-ratio:16/9;background:#000;border-radius:6px;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;font-size:1rem;padding:6px}
.al-ecran .sc{opacity:.9}.al-ecran .tx{position:absolute;left:8%;right:8%;bottom:12%;font-weight:700;font-size:1.05rem;text-shadow:0 1px 3px #000}
.al-ecran .mz{position:absolute;right:8px;top:6px;font-size:.8rem;opacity:.85}
.al-ctrl{display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap}
.al-ctrl .al-ceas{background:transparent;color:var(--al-ink);padding:4px}
.al-tlw{position:relative}
.al-tl-unelte{display:flex;justify-content:flex-end;gap:3px;padding:4px 6px;border-bottom:1px solid var(--al-line);background:#fff}
.al-video .al-corp{background:#fbfaff}
.al-video .al-panou{flex-basis:58px}
.al-video .al-panou .pn{height:46px}
.al-video .al-pista{height:46px;border-bottom:1px solid #e7e4f3;background:#fbfaff}
.al-clip{position:absolute;top:6px;bottom:6px;border-radius:5px;font-size:.72rem;padding:3px 5px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;box-sizing:border-box;border:1px solid rgba(0,0,0,.25);color:#20163a;cursor:pointer}
.al-clip.text{background:#e9d5ff;border-color:#a855f7}.al-clip.video{background:#cfe0ff;border-color:#5b8def}.al-clip.audio{background:#c7f0d6;border-color:#3aa66a}
.al-clip.ales{outline:2px solid #7b3ff2;outline-offset:1px}
.al-video .al-cap::before{background:#2b2b33;box-shadow:none}
.al-video .al-cap::after{left:-7px;top:10px;width:12px;height:12px;border-radius:50%;background:#2b2b33;border:2px solid #fff}
.al-video .al-rigla{background:#fff}
@media (max-width:560px){.al-panou{flex-basis:70px}.al-b{min-width:40px}.al-ceas{font-size:13px;padding:8px 6px}.al-biblio{max-width:none}}
`;
function stil(){if(document.getElementById('sim-audio-linie-css'))return;const s=document.createElement('style');s.id='sim-audio-linie-css';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const doi=n=>String(n).padStart(2,'0');
/* Audacity: 00h00m02.30s (ore, minute, secunde cu sutimi) */
function fmtAudacity(t){t=Math.max(0,t);const cs=Math.floor(t*100+1e-6),h=Math.floor(cs/360000),m=Math.floor(cs/6000)%60,s=Math.floor(cs/100)%60,c=cs%100;return `${doi(h)}h${doi(m)}m${doi(s)}.${doi(c)}s`}
/* Clipchamp: 0:02.30 */
function fmtClipchamp(t){t=Math.max(0,t);const cs=Math.floor(t*100+1e-6),m=Math.floor(cs/6000),s=Math.floor(cs/100)%60,c=cs%100;return `${m}:${doi(s)}.${doi(c)}`}
const etRigla=t=>{const m=Math.floor(t/60),s=t-m*60;return Number.isInteger(s)?`${m}:${doi(s)}`:`${m}:${doi(Math.floor(s))},${String(Math.round((s%1)*10))}`};
const PASI=[0.5,1,2,5,10,15,30,60,120];

function creeaza(el,opt){
  stil();
  const O=Object.assign({mod:'audio',nume:'sunet',piste:null},opt||{});
  const V=O.mod==='video';
  let piste=O.piste;
  if(!piste){const d=O.unda?O.unda.length/50:(O.durata||10);piste=[{tip:'audio',nume:O.nume,clipuri:[{id:'c1',nume:O.nume,start:0,durata:d,unda:O.unda||null}]}]}
  const durata=()=>O.durata||Math.max(0.5,...piste.flatMap(p=>p.clipuri.map(c=>c.start+c.durata)));
  const span0=()=>O.vedere||(V?durata()*1.15:durata()*2);
  const st={p:0,s:0,reda:false,pauza:false,v0:0,span:0,sel:null,clipAles:null,mareste:0,micsoreaza:0};
  let J=[],AUZ=[],seg=null,ceasOff=0,t0=0,p0=0,raf=0,asc=new Set(),sunetPornit=!!O.sunet,audio=null,butoaneExtra=[];
  const acum=()=>performance.now()/1000+ceasOff;
  function initStare(){Object.assign(st,{p:0,s:0,reda:false,pauza:false,v0:0,span:span0(),sel:null,clipAles:null,mareste:0,micsoreaza:0});J=[];AUZ=[];seg=null}
  initStare();
  const root=document.createElement('div');
  root.className='al '+(V?'al-video':'al-audio');root.tabIndex=0;
  root.setAttribute('role','application');
  root.setAttribute('aria-label',V?'Editorul video Clipchamp, simulat în pagină':'Fereastra Audacity, simulată în pagină. Space = Redare sau Stop.');
  el.innerHTML='';el.appendChild(root);
  /* lupa cu + / − (desen SVG: fontul telefonului n-are mereu semnul lupei) */
  const LUPA=semn=>`<svg viewBox="0 0 20 20" width="19" height="19" aria-hidden="true" style="vertical-align:top"><circle cx="8.5" cy="8.5" r="5.6" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="12.6" y1="12.6" x2="17.5" y2="17.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><line x1="5.8" y1="8.5" x2="11.2" y2="8.5" stroke="currentColor" stroke-width="1.6"/>${semn==='+'?'<line x1="8.5" y1="5.8" x2="8.5" y2="11.2" stroke="currentColor" stroke-width="1.6"/>':''}</svg>`;
  const B=(id,simbol,eticheta,cls)=>`<button type="button" class="al-b ${cls||''}" data-b="${id}" title="${esc(eticheta)}" aria-label="${esc(eticheta)}"><span class="ic" aria-hidden="true">${simbol}</span><span class="et">${esc(eticheta)}</span></button>`;
  const panouri=()=>`<div class="al-panou"><div class="cap">${V?'':'Piste'}</div>${piste.map(p=>`<div class="pn"><b title="${esc(p.nume||'')}">${esc(p.nume||'')}</b>${V?'':'<div class="ms"><span>M</span><span>S</span></div>'}</div>`).join('')}</div>`;
  const zona=()=>`<div class="al-zona"><div class="al-rigla" aria-label="Linia de timp, în secunde"></div>${piste.map((p,i)=>`<div class="al-pista" data-pi="${i}">${V?'':'<canvas></canvas>'}</div>`).join('')}<div class="al-sel"></div><div class="al-cap" aria-hidden="true"></div></div>`;
  if(!V){
    root.innerHTML=`<div class="al-titlu">${esc(O.nume)} — Audacity (simulat în pagină)</div>
      <div class="al-unelte"><div class="al-grup" data-g="redare">${B('reda','▶','Redare','verde')}${B('stop','■','Stop')}${B('rosu','●','Înregistrare','rosu')}${B('inceput','|◀','Început')}${B('sfarsit','▶|','Sfârșit')}</div>
      <div class="al-grup" data-g="vedere">${B('mareste',LUPA('+'),'Mărește')}${B('micsoreaza',LUPA('-'),'Micșorează')}</div>
      <div class="al-ceas" aria-label="Afișajul timpului">${fmtAudacity(0)}</div>
      ${O.sunet?B('sunet','🔊','Sunet: pornit','al-sunet'):''}</div>
      <div class="al-corp">${panouri()}${zona()}</div>
      <input type="range" class="al-defilare" min="0" max="1000" value="0" aria-label="Bara de defilare a liniei de timp">
      <p class="al-mesaj" aria-live="polite"></p>`;
  }else{
    const media=[];piste.forEach(p=>p.clipuri.forEach(c=>{if(p.tip!=='text'&&!media.includes(c.nume))media.push((p.tip==='audio'?'♪ ':'🎬 ')+c.nume)}));
    root.innerHTML=`<div class="al-titlu">Clipchamp (simulat în pagină)</div>
      <div class="al-sus"><div class="al-biblio"><b>Conținutul meu media</b><ul>${media.map(m=>`<li><button type="button" data-media>${esc(m)}</button></li>`).join('')}</ul></div>
      <div class="al-prev"><div class="al-ecran" aria-label="Previzualizarea"></div>
      <div class="al-ctrl">${B('inceput','|◀','Început')}${B('inapoi5','↺5','−5 s')}${B('reda','▶','Redare','verde')}${B('inainte5','↻5','+5 s')}<span class="al-ceas" aria-label="Timpul">${fmtClipchamp(0)} / ${fmtClipchamp(durata())}</span></div></div></div>
      <div class="al-tlw"><div class="al-tl-unelte">${B('micsoreaza','−','Micșorează')}${B('mareste','+','Mărește')}${B('potriveste','⤢','Potrivește')}</div>
      <div class="al-corp">${panouri()}${zona()}</div></div>
      <input type="range" class="al-defilare" min="0" max="1000" value="0" aria-label="Bara de defilare a liniei de timp">
      <p class="al-mesaj" aria-live="polite"></p>`;
  }
  const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
  const Z=$('.al-zona'),RG=$('.al-rigla'),CAP=$('.al-cap'),SEL=$('.al-sel'),DEF=$('.al-defilare'),MSG=$('.al-mesaj'),CEAS=$('.al-ceas');
  const W=()=>Z.clientWidth||600;
  const tx=t=>(t-st.v0)/st.span*W();
  const xt=x=>st.v0+x/W()*st.span;
  /* mărirea: cel mult 1/4 s pe toată lățimea, cel puțin cât 4 vederi de la deschidere; defilarea: de la 0 până când
     capătul sunetului ajunge la jumătatea ferestrei */
  function limiteaza(){
    st.span=Math.min(Math.max(st.span,0.25),Math.max(span0()*4,durata()*8));
    const max=Math.max(0,durata()-st.span*0.5);st.v0=Math.min(Math.max(0,st.v0),max);
  }
  function emite(ev){
    if(ev)J.push(Object.assign({ora:Date.now()},ev));
    const S=stare();asc.forEach(f=>{try{f(S,ev)}catch(e){}});
    root.dispatchEvent(new CustomEvent('audiolinie',{detail:{stare:S,ev}}));
  }
  function stare(){return {p:st.p,s:st.s,reda:st.reda,pauza:st.pauza,v0:st.v0,span:st.span,sel:st.sel?st.sel.slice():null,durata:durata(),clipAles:st.clipAles,mareste:st.mareste,micsoreaza:st.micsoreaza}}
  /* ---------- desen ---------- */
  const pasRigla=()=>PASI.find(p=>p*W()/st.span>=58)||PASI[PASI.length-1];
  function deseneazaRigla(){
    const w=W();let pas=pasRigla();
    const mic=pas/(pas>=5?5:pas===2?4:pas===0.5?5:5);let h='';
    const a=Math.floor(st.v0/mic)*mic;
    for(let t=a;t<=st.v0+st.span+1e-9;t+=mic){const tt=Math.round(t*1000)/1000,x=tx(tt);if(x<-1||x>w+1)continue;
      const mare=Math.abs(tt/pas-Math.round(tt/pas))<1e-6;h+=`<i style="left:${x.toFixed(1)}px;height:${mare?12:6}px"></i>`;
      if(mare)h+=`<span style="left:${x.toFixed(1)}px">${etRigla(tt)}</span>`}
    RG.innerHTML=h;
  }
  function deseneazaPiste(){
    const w=W();
    $$('.al-pista').forEach((div,i)=>{const P=piste[i];
      if(V){div.innerHTML=P.clipuri.map(c=>{const x1=tx(c.start),x2=tx(c.start+c.durata);if(x2<0||x1>w)return '';
        return `<div class="al-clip ${P.tip}${st.clipAles===c.id?' ales':''}" data-clip="${esc(c.id)}" style="left:${x1.toFixed(1)}px;width:${Math.max(4,x2-x1).toFixed(1)}px" title="${esc(c.nume)}">${P.tip==='text'?'T ':P.tip==='audio'?'♪ ':''}${esc(c.nume)}</div>`}).join('');return}
      const cv=div.querySelector('canvas'),dpr=window.devicePixelRatio||1,h=div.clientHeight||96;
      cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);
      P.clipuri.forEach(c=>{const x1=tx(c.start),x2=tx(c.start+c.durata);if(x2<0||x1>w)return;
        g.fillStyle=c.culoare||'#f19a9a';g.fillRect(x1,1,x2-x1,h-2);g.fillStyle='#ec7f7f';g.fillRect(x1,1,x2-x1,16);
        g.fillStyle='#3b1a1a';g.font='11px Segoe UI, system-ui, sans-serif';g.fillText(c.nume,Math.max(x1,0)+4,13);
        g.strokeStyle='rgba(0,0,0,.35)';g.strokeRect(x1+.5,1.5,x2-x1-1,h-3);
        const U=c.unda||[],mid=(h+16)/2,amp=(h-20)/2;g.strokeStyle='#2a1414';g.lineWidth=1;g.beginPath();
        g.moveTo(Math.max(x1,0),mid);g.lineTo(Math.min(x2,w),mid);
        for(let x=Math.max(0,Math.floor(x1));x<Math.min(w,x2);x++){const ta=xt(x)-c.start,tb=xt(x+1)-c.start;let v=0;
          for(let k=Math.max(0,Math.floor(ta*50));k<=Math.min(U.length-1,Math.floor(tb*50));k++)v=Math.max(v,U[k]);
          if(v>0.004){g.moveTo(x+.5,mid-v*amp);g.lineTo(x+.5,mid+v*amp)}}
        g.stroke()});
    });
  }
  function deseneazaCap(){
    const x=tx(st.p);CAP.style.left=x.toFixed(1)+'px';CAP.style.display=(x<-2||x>W()+2)?'none':'';
    if(st.sel){const a=tx(Math.min(...st.sel)),b=tx(Math.max(...st.sel));SEL.style.display='';SEL.style.left=a+'px';SEL.style.width=Math.max(1,b-a)+'px'}else SEL.style.display='none';
    CEAS.textContent=V?`${fmtClipchamp(st.p)} / ${fmtClipchamp(durata())}`:fmtAudacity(st.p);
    if(V){const E=$('.al-ecran');const la=tip=>{const P=piste.filter(p=>p.tip===tip);for(const p of P)for(const c of p.clipuri)if(st.p>=c.start&&st.p<c.start+c.durata)return c;return null};
      const v=la('video'),t=la('text'),a=la('audio');
      E.innerHTML=`${v?`<span class="sc">🎬 ${esc(v.nume)}</span>`:'<span class="sc" style="opacity:.6">(ecran negru: aici nu e niciun clip video)</span>'}${t?`<span class="tx">${esc(t.nume)}</span>`:''}${a?`<span class="mz">♪ ${esc(a.nume)}</span>`:''}`}
  }
  function deseneazaButoane(){
    const b=id=>root.querySelector(`[data-b="${id}"]`),r=b('reda');
    if(r){const ruleaza=st.reda&&!st.pauza;r.classList.toggle('activ',ruleaza);r.querySelector('.ic').textContent=ruleaza?'‖':'▶';
      r.querySelector('.et').textContent=ruleaza?'Pauză':'Redare';r.title=r.querySelector('.et').textContent;r.setAttribute('aria-label',r.title)}
    if(!V)['rosu','inceput','sfarsit'].forEach(id=>{const x=b(id);if(x)x.disabled=st.reda&&!st.pauza});
    const s=b('sunet');if(s){s.querySelector('.ic').textContent=sunetPornit?'🔊':'🔇';s.querySelector('.et').textContent=sunetPornit?'Sunet: pornit':'Sunet: oprit'}
    butoaneExtra.forEach(d=>{const x=b(d.id);if(x&&d.activ)x.classList.toggle('activ',!!d.activ(stare()))});
    const L=Math.max(durata(),st.span),max=Math.max(0,L-st.span*0.1);DEF.disabled=max<=0.0001;DEF.value=max>0?Math.round(st.v0/max*1000):0;
  }
  function redesenare(){limiteaza();deseneazaRigla();deseneazaPiste();deseneazaCap();deseneazaButoane()}
  /* ---------- sunetul local (opțional) ---------- */
  function sunet(op){
    if(!O.sunet||!sunetPornit)return;
    try{if(!audio){audio=new Audio(O.sunet);audio.preload='auto'}
      if(op==='play'){audio.currentTime=Math.min(st.p,durata());const pr=audio.play();if(pr&&pr.catch)pr.catch(()=>{})}
      else if(op==='seek'){audio.currentTime=Math.min(st.p,durata())}
      else audio.pause()}catch(e){}
  }
  /* ---------- redarea (ceas virtual: performance.now + avans) ---------- */
  function inchideSeg(){if(seg!==null){const a=seg,b=st.p;if(b>a+0.001)AUZ.push([a,b]);seg=null}}
  function porneste(){if(st.p>=durata()-0.005){st.p=0}st.s=st.p;st.reda=true;st.pauza=false;t0=acum();p0=st.p;seg=st.p;emite({tip:'redare',t:st.p});sunet('play');bucla()}
  function pauza(){if(!st.reda||st.pauza)return;st.p=pozitie();inchideSeg();st.pauza=true;emite({tip:'pauza',t:st.p});sunet('pause');redesenare()}
  function continua(){if(!st.pauza)return;st.pauza=false;t0=acum();p0=st.p;seg=st.p;emite({tip:'continua',t:st.p});sunet('play');bucla()}
  function pozitie(){return Math.min(p0+(acum()-t0),durata())}
  function opreste(motiv){if(!st.reda)return;if(!st.pauza)st.p=pozitie();inchideSeg();const la=st.p;st.reda=false;st.pauza=false;
    if(motiv==='capat'){st.p=durata();emite({tip:'capat',t:st.p})}else{st.p=V?st.p:st.s;emite({tip:'stop',t:la,inapoi:st.p})}
    sunet('pause');redesenare()}
  /* |◀ / ▶| apăsate în PAUZĂ (Audacity 4 real, proba 5): redarea se oprește (fără evenimentul 'stop'), apoi capul se mută */
  function opresteTacut(){if(!st.reda)return;if(!st.pauza)st.p=pozitie();inchideSeg();st.reda=false;st.pauza=false;sunet('pause')}
  function actualizeaza(){
    if(!st.reda||st.pauza)return;
    st.p=pozitie();
    if(st.p>=durata()-1e-9){opreste('capat');return}
    if(st.p>st.v0+st.span){st.v0=st.p;limiteaza();deseneazaRigla();deseneazaPiste()}
  }
  function bucla(){
    cancelAnimationFrame(raf);
    const f=()=>{if(!root.isConnected){if(st.reda){st.reda=false;sunet('pause')}return}
      actualizeaza();deseneazaCap();deseneazaButoane();if(st.reda&&!st.pauza)raf=requestAnimationFrame(f)};
    raf=requestAnimationFrame(f);deseneazaButoane();
  }
  function avans(sec){if(st.reda&&!st.pauza){ceasOff+=sec;actualizeaza();deseneazaCap();deseneazaButoane()}}
  /* ---------- acțiunile elevului ---------- */
  function mesaj(h){MSG.innerHTML=h||''}
  function cauta(t,tip){t=Math.min(Math.max(0,t),durata());
    if(st.reda&&!st.pauza){st.p=pozitie();inchideSeg();st.p=t;st.s=t;t0=acum();p0=t;seg=t;sunet('seek')}else{st.p=t;st.s=t}
    st.sel=null;emite({tip,t});redesenare()}
  function redaSauPauza(){if(!st.reda)porneste();else if(st.pauza)continua();else pauza();redesenare()}
  function apasa(id){
    if(id==='reda'){redaSauPauza();return}
    if(id==='stop'){if(st.reda)opreste('stop');else{emite({tip:'stopOprit',t:st.p})}return}
    if(id==='rosu'){emite({tip:'rosu',t:st.p});mesaj('Butonul roșu <b>●</b> pornește <b>înregistrarea</b> de la microfon. O înveți în lecția 12; aici nu înregistrează nimic.');return}
    if(id==='inceput'){if(st.reda&&!st.pauza&&!V)return;if(!V)opresteTacut();cauta(0,'inceput');st.v0=0;redesenare();return}
    if(id==='sfarsit'){if(st.reda&&!st.pauza)return;if(!V)opresteTacut();cauta(durata(),'sfarsit');st.v0=Math.max(0,durata()-st.span*0.9);redesenare();return}
    if(id==='inapoi5'||id==='inainte5'){cauta(st.p+(id==='inainte5'?5:-5),id);return}
    if(id==='mareste'||id==='micsoreaza'){const c=st.p,f=id==='mareste'?0.5:2,vechi=st.span;st.span=st.span*f;limiteaza();
      if(st.span!==vechi){st.v0=c-st.span/2;limiteaza();st[id]++;emite({tip:id,span:st.span})}else mesaj(id==='mareste'?'Mai mult nu se poate mări.':'Mai mult nu se poate micșora.');redesenare();return}
    if(id==='potriveste'){st.v0=0;st.span=durata()*1.05;emite({tip:'potriveste',span:st.span});redesenare();return}
    if(id==='sunet'){sunetPornit=!sunetPornit;if(!sunetPornit&&audio)audio.pause();else if(st.reda&&!st.pauza)sunet('play');deseneazaButoane();return}
    const d=butoaneExtra.find(x=>x.id===id);if(d&&d.apasa)d.apasa(api);
  }
  root.addEventListener('click',e=>{const b=e.target.closest('[data-b]');if(b&&root.contains(b)&&!b.disabled){apasa(b.dataset.b);root.focus({preventScroll:true})}
    if(e.target.closest('[data-media]'))mesaj('Aici, în <b>Conținutul meu media</b>, stau filmările, pozele și sunetele aduse pentru film. Le pui pe linia de timp (le tragi acolo) în lecțiile următoare.')});
  root.addEventListener('keydown',e=>{
    if(e.target.closest&&e.target.closest('input'))return;
    if((e.code==='Space'||e.key===' ')&&e.target.closest&&e.target.closest('button'))return;   /* Space pe un buton cu focus (Tab) = apasă butonul (browserul) */
    if(e.code==='Space'||e.key===' '){e.preventDefault();if(V){redaSauPauza()}else{if(st.reda&&st.pauza)continua();else if(st.reda)opreste('stop');else porneste();redesenare()}emite({tip:'tasta',tasta:'Space'})}
    else if(!V&&(e.key==='p'||e.key==='P')){e.preventDefault();redaSauPauza()}
    else if(!V&&e.key==='Home'&&(!st.reda||st.pauza)){e.preventDefault();apasa('inceput')}
    else if(!V&&e.key==='End'&&(!st.reda||st.pauza)){e.preventDefault();apasa('sfarsit')}
  });
  /* mouse / deget pe linia de timp: clic = mută capul; tragere pe undă = alege o bucată (Audacity) */
  let jos=null;
  Z.addEventListener('pointerdown',e=>{if(e.button>0)return;const r=Z.getBoundingClientRect();jos={x:e.clientX-r.left,y:e.clientY-r.top,rigla:!!e.target.closest('.al-rigla'),clip:e.target.closest('.al-clip'),cap:false,mutat:false,id:e.pointerId};
    if(V&&Math.abs(jos.x-tx(st.p))<14&&jos.y<38)jos.cap=true;});
  Z.addEventListener('pointermove',e=>{if(!jos||e.pointerId!==jos.id)return;const r=Z.getBoundingClientRect(),x=e.clientX-r.left;
    if(!jos.mutat&&Math.abs(x-jos.x)>6){jos.mutat=true;try{Z.setPointerCapture(e.pointerId)}catch(_){}}
    if(!jos.mutat)return;
    if(V){if(jos.cap||jos.rigla){st.p=Math.min(Math.max(0,xt(x)),durata());st.s=st.p;deseneazaCap()}}
    else if(!jos.rigla){st.sel=[xt(jos.x),xt(x)].map(t=>Math.min(Math.max(0,t),durata()));deseneazaCap()}});
  const sus=e=>{if(!jos||e.pointerId!==jos.id)return;const J0=jos;jos=null;const r=Z.getBoundingClientRect(),x=e.clientX-r.left,t=xt(x);root.focus({preventScroll:true});
    if(J0.mutat){
      if(V){if(J0.cap||J0.rigla)cauta(t,'cauta');else mesaj('Clipurile le muți pe linia de timp în lecțiile următoare. Capul de redare îl muți apăsând pe rigla cu secunde sau trăgând de cercul lui.');return}
      if(J0.rigla){cauta(t,'rigla');return}
      st.sel=[xt(J0.x),t].map(v=>Math.min(Math.max(0,v),durata())).sort((a,b)=>a-b);emite({tip:'selectie',a:st.sel[0],b:st.sel[1]});
      mesaj('Ai tras cu mouse-ul (sau cu degetul) pe undă: așa <b>alegi o bucată</b> din sunet (o înveți în lecția 13). Capul de redare a rămas pe loc. Ca să-l muți, dă <b>un singur clic</b> pe undă.');redesenare();return}
    if(V){if(J0.clip){st.clipAles=J0.clip.dataset.clip;emite({tip:'clipAles',id:st.clipAles});mesaj('Ai ales un clip (are acum chenar). Capul de redare se mută apăsând pe <b>rigla cu secunde</b> de deasupra pistelor.');redesenare();return}
      if(J0.rigla||J0.cap){cauta(t,'rigla');mesaj('');return}
      st.clipAles=null;mesaj('Ca să muți capul de redare, apasă pe <b>rigla cu secunde</b>, deasupra pistelor.');redesenare();return}
    cauta(t,J0.rigla?'rigla':'clic');mesaj('')};
  Z.addEventListener('pointerup',sus);
  Z.addEventListener('pointercancel',()=>{jos=null});
  DEF.addEventListener('input',()=>{const L=Math.max(durata(),st.span),max=Math.max(0,L-st.span*0.1);st.v0=DEF.value/1000*max;deseneazaRigla();deseneazaPiste();deseneazaCap()});
  let ro=null;try{ro=new ResizeObserver(()=>{if(root.isConnected)redesenare()});ro.observe(Z)}catch(e){}
  /* ---------- simulare (poartă, probe, „Arată-mi răspunsul”) ---------- */
  function simuleaza(L){(L||[]).forEach(a=>{
    if('clic' in a)cauta(a.clic,'clic');
    else if('rigla' in a)cauta(a.rigla,'rigla');
    else if(a.reda){if(!st.reda||st.pauza)redaSauPauza()}
    else if('asteapta' in a)avans(a.asteapta);
    else if(a.pauza){if(st.reda&&!st.pauza)redaSauPauza()}
    else if(a.stop)apasa('stop');
    else if(a.inceput)apasa('inceput');
    else if(a.sfarsit)apasa('sfarsit');
    else if(a.mareste)for(let k=0;k<a.mareste;k++)apasa('mareste');
    else if(a.micsoreaza)for(let k=0;k<a.micsoreaza;k++)apasa('micsoreaza');
    else if(a.potriveste)apasa('potriveste');
    else if(a.tragere){st.sel=a.tragere.slice().sort((x,y)=>x-y);emite({tip:'selectie',a:st.sel[0],b:st.sel[1]})}
    else if(a.clip){st.clipAles=a.clip;emite({tip:'clipAles',id:a.clip})}
    else if(a.tasta){root.dispatchEvent(new KeyboardEvent('keydown',{key:a.tasta==='Space'?' ':a.tasta,code:a.tasta==='Space'?'Space':'',bubbles:true}))}
    else if(a.inainte5)apasa('inainte5');else if(a.inapoi5)apasa('inapoi5');
  });redesenare()}
  /* O.start: acțiunile de la deschidere (de ex. mărirea sau capul de redare pregătite); nu intră în jurnal */
  function aplicaStart(){if(O.start&&O.start.length){simuleaza(O.start);J=[];AUZ=[];seg=null;st.mareste=0;st.micsoreaza=0;st.sel=null;redesenare()}}
  function reset(){if(st.reda){st.reda=false;sunet('pause')}cancelAnimationFrame(raf);initStare();mesaj('');aplicaStart();emite({tip:'reset'});redesenare()}
  const api={radacina:root,versiune:VERS,stare,jurnal:()=>J.map(x=>Object.assign({},x)),
    auzit:()=>{const a=AUZ.map(x=>x.slice());if(seg!==null&&st.reda&&!st.pauza){const q=pozitie();if(q>seg)a.push([seg,q])}return a},
    simuleaza,avans,reset,piste:()=>piste,redesenare,mesaj,pasRigla,focus:()=>root.focus({preventScroll:true}),
    on:f=>asc.add(f),off:f=>asc.delete(f),
    adaugaButon(d){butoaneExtra.push(d);const g=root.querySelector(`[data-g="${d.grup||'redare'}"]`)||root.querySelector('.al-unelte')||root.querySelector('.al-ctrl');
      g.insertAdjacentHTML('beforeend',B(d.id,d.simbol||'•',d.eticheta||d.id));deseneazaButoane()},
    apasa,distruge(){reset();try{ro&&ro.disconnect()}catch(e){}root.remove()}};
  redesenare();
  aplicaStart();
  return api;
}

/* ---------- verificările testelor (fiecare: (a, parametru) => true/false) ---------- */
const acopera=(I,a,b)=>{const L=I.map(x=>[Math.max(a,x[0]),Math.min(b,x[1])]).filter(x=>x[1]>x[0]).sort((x,y)=>x[0]-y[0]);let tot=0,cur=a;L.forEach(([x,y])=>{if(y>cur){tot+=y-Math.max(x,cur);cur=y}});return tot/(b-a)};
const ev=(a,tip)=>a.jurnal().filter(e=>e.tip===tip);
const VERIFICARI={
  mareste:(a,n)=>a.stare().mareste>=n,
  micsoreaza:(a,n)=>a.stare().micsoreaza>=n,
  vedereMax:(a,s)=>a.stare().span<=s+1e-6,
  vedeTot:(a)=>{const S=a.stare();return S.v0<=0.001&&S.v0+S.span>=S.durata-0.001},
  cap:(a,[x,y])=>{const S=a.stare();return !S.reda&&S.p>=x&&S.p<=y},
  clic:(a,[x,y])=>{const L=a.jurnal().filter(e=>e.tip==='clic'||e.tip==='rigla');const u=L[L.length-1];return !!u&&u.t>=x&&u.t<=y},
  clicIn:(a,Z)=>{const L=a.jurnal().filter(e=>e.tip==='clic'||e.tip==='rigla');const u=L[L.length-1];return !!u&&Z.some(([x,y])=>u.t>=x&&u.t<=y)},
  pasRigla:(a,max)=>a.pasRigla()<=max+1e-9,
  stopIntre:(a,[x,y])=>ev(a,'stop').some(e=>e.t>=x&&e.t<=y),
  pornitIntre:(a,[x,y])=>ev(a,'redare').some(e=>e.t>=x&&e.t<=y),
  auzit:(a,[x,y])=>acopera(a.auzit(),x,y)>=0.9,
  stopDupa:(a,x)=>ev(a,'stop').some(e=>e.t>=x),
  /* doar ultima ascultare: oprirea de după ULTIMA pornire a redării (un Stop târziu de mai demult nu blochează exercițiul) */
  stopInainte:(a,x)=>{const J=a.jurnal();let i=-1;J.forEach((e,k)=>{if(e.tip==='redare')i=k});const s=J.slice(i+1).filter(e=>e.tip==='stop');return s.length>0&&s[s.length-1].t<=x},
  pauzaIntre:(a,[x,y])=>{const J=a.jurnal();const i=J.findIndex(e=>e.tip==='pauza'&&e.t>=x&&e.t<=y);return i>=0&&J.slice(i+1).some(e=>e.tip==='continua')},
  capat:(a)=>ev(a,'capat').length>0,
  oprit:(a)=>!a.stare().reda,
  inceputLaFinal:(a)=>{const J=a.jurnal().filter(e=>!['tasta','reset'].includes(e.tip));const S=a.stare();const u=J[J.length-1];return !!u&&u.tip==='inceput'&&!S.reda&&S.p===0&&ev(a,'redare').length>0},
  inClip:(a,id)=>{const S=a.stare();return a.piste().some(p=>p.clipuri.some(c=>c.id===id&&S.p>=c.start&&S.p<c.start+c.durata))},
  redatInClip:(a,id)=>{const c=a.piste().flatMap(p=>p.clipuri).find(c=>c.id===id);return !!c&&ev(a,'redare').concat(ev(a,'continua')).some(e=>e.t>=c.start&&e.t<c.start+c.durata)},
  folosit:(a,tip)=>ev(a,tip).length>0
};
function verifica(a,T){for(const k of Object.keys(T)){if(k==='ce'||k==='cum')continue;const f=VERIFICARI[k];if(f)return !!f(a,T[k])}return false}

/* ---------- tipul pentru motor: {t:'audiolinie', …} ---------- */
const CSS_T=`.al-teste{margin-top:10px;border:1px solid var(--line,#ccc);border-radius:8px;padding:10px 12px;background:var(--paper2,#f5f5f5)}
.al-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.al-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.al-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.al-teste li.ok .s{color:var(--ok,#1b7a4a)}.al-teste li.rau .s{color:var(--bad,#b42318)}
.al-teste li .m{display:block;font-size:.85rem;color:var(--bad,#b42318)}`;
function stilT(){if(document.getElementById('sim-audio-linie-teste-css'))return;const s=document.createElement('style');s.id='sim-audio-linie-teste-css';s.textContent=CSS_T;document.head.appendChild(s)}
const TipAudioLinie={
  render(Q,body,api){
    stil();stilT();
    body.innerHTML=`<div class="al-loc"></div>${(Q.teste||[]).length?`<div class="al-teste"><b>Testele</b> <span class="hint">· se bifează singure, pe măsură ce lucrezi</span><ol>${Q.teste.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`:''}`;
    const a=creeaza(body.querySelector('.al-loc'),Q);body._al=a;
    const T=Q.teste||[];
    function marcheaza(arata){let ok=0;T.forEach((t,i)=>{const li=body.querySelector(`.al-teste li[data-i="${i}"]`),b=verifica(a,t);if(b)ok++;
      if(!li)return;li.classList.toggle('ok',b);li.classList.toggle('rau',!b&&arata);li.querySelector('.s').textContent=b?'✓':arata?'✗':'○';li.querySelector('.m').innerHTML=!b&&arata&&t.cum?t.cum:''});return ok}
    a.on(()=>marcheaza(false));
    const nav=api.checkButton(()=>{
      const ok=marcheaza(true);a.focus();
      if(ok===T.length){nav.innerHTML='';api.resolve(true)}
      else{const p=T.find(t=>!verifica(a,t));api.resolve(false,`${ok} din ${T.length} teste trecute. ${p&&p.cum?p.cum:''}`);
        api.revealButton(()=>{a.reset();a.simuleaza(Q.solutie||[]);marcheaza(true);nav.innerHTML='';api.giveUp(Q.raspuns||'testele sunt acum bifate: uită-te unde a ajuns capul de redare și ce s-a redat.')})}
    },Q.verifica||'Verifică');
    marcheaza(false);
  },
  rezolva(Q,body){const a=body._al;a.reset();a.simuleaza(Q.solutie||[]);return true},
  gresit(Q,body){const a=body._al;a.reset();a.simuleaza(Q.gresit||[]);return true}
};
window.AudioLinie={versiune:VERS,creeaza,verificari:VERIFICARI,verifica,formatAudacity:fmtAudacity,formatClipchamp:fmtClipchamp};
window.TipAudioLinie=TipAudioLinie;
})();
