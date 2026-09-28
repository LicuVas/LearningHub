/* Simulatorul „desktop” pentru lecțiile LearningHub — fișier comun (lectii/_sim/desktop-windows.js).
   PROPRIETAR: autorul lecției V · M2 · nr. 8 („Ce face un sistem de operare. Elemente de interfață”), 28.09.2026.
   Un Windows mic, în stilul Windows 11: desktopul cu pictograme, bara de activități (butonul Start, butoanele
   aplicațiilor deschise, zona de notificare cu ceasul), meniul Start (cu căutare și Alimentare), ferestre cu
   Minimizare / Maximizare-Restabilire jos / Închidere, mutare (tragi de bara de titlu), redimensionare (tragi de o
   margine sau de un colț), comutare (clic pe fereastră sau pe butonul ei din bara de activități).

   Folosire în pagină (după motor.js):
     <script src="../../_sim/desktop-windows.js"></script>
     JocMotor.porneste({ …, tipuri:{desktop:SimDesktop} })

   Q (întrebarea / exercițiul / atelierul):
     Q.q                 enunțul (îl scrie motorul)
     Q.pictograme        pictogramele de pe desktop, din APPS (implicit ['cos','calc','paint'])
     Q.startApps         aplicațiile din meniul Start (implicit ['calc','paint','ceas','setari'])
     Q.deschise          ferestrele deschise la început, în ordinea de jos în sus:
                         [{app, stare:'n'|'max'|'min', x,y,w,h}] (x,y,w,h = fracțiuni din desktop, opționale)
     Q.teste             testele numite, bifate pe loc: [{tip, app?, prin?, zona?, ce, m?}]
                         tip: 'pornit' (app pornită; prin:'start'|'desktop' = pe ce drum)
                              'deschis' (se vede pe ecran) · 'maximizat' · 'minimizat'
                              'readus' (ascunsă, apoi readusă din bara de activități; acum se vede)
                              'restaurat' (a fost cât tot ecranul și a revenit la mărimea de dinainte: Restabilire jos,
                                          dublu-clic pe bara de titlu sau tragere) · 'ramas' (încă pornită, chiar ascunsă)
                              'mutat' (trasă; zona:'dreapta'|'stanga' = centrul ferestrei în acea parte)
                              'marit' / 'micsorat' (mărime schimbată trăgând de margine/colț, cel puțin 20%)
                              'inchis' (închisă) · 'activ' (e fereastra de deasupra, în care lucrezi)
                              'ceas' (ora de pe ceas, scrisă în casetă) · 'oprit' (Start › Alimentare › Închidere)
                         ce = textul testului; m = ce spune pagina când testul nu trece (altfel, un mesaj implicit)
     Q.intrebare         (la testul 'ceas') eticheta casetei de răspuns
     Q.rezolvare         operațiile care rezolvă sarcina (poarta și „Arată-mi răspunsul”)
     Q.gresit            operațiile unei greșeli tipice de copil (poarta verifică respingerea)
     Q.solutieText       pașii, în cuvinte, după „Arată-mi răspunsul”
     Operații: ['start'] · ['cauta',text] · ['lanseaza',app,'start'|'desktop'] · ['btn',app,'min'|'max'|'x']
               ['bara',app] · ['titlu2',app] (dublu-clic pe bara de titlu) · ['muta',app,{x,y}] · ['redim',app,{w,h}]
               ['activ',app] · ['ceas'] (scrie ora afișată) · ['data'] (scrie data, greșeala tipică) · ['rasp',text] · ['alimentare','inchidere'|'repaus'|'repornire']

   FIDELITATE (probat pe Windows-ul real în română, pe desktopul ascuns, 28.09.2026: lectii/v/m2-l08/_proba/proba_fereastra.json):
     - numele butoanelor din bara de titlu: Minimizare, Maximizare, Închidere; după maximizare, butonul din mijloc
       se numește Restaurare (UI Automation), iar sfatul lui e „Restabilire jos” (user32.dll, șirul 903;
       lectii/v/m2-l08/_proba/proba_texte_windows.json): simulatorul îl arată pe al doilea, pe care îl vede elevul;
     - dublu-clic pe bara de titlu maximizează; al doilea dublu-clic readuce fereastra la locul și mărimea de dinainte.
     Din documentația Microsoft ro-ro (neprobat, Explorer nu rulează pe desktopul ascuns): Start › Alimentare › Închidere;
     aplicațiile pornite au o linie sub pictogramă, pe bara de activități; bara e centrată în Windows 11.
     Abateri spuse pe ecran (Q.nota sau nota implicită): bara are doar butoanele aplicațiilor deschise; butoanele
     din bară au și numele scris; colțul cu dungi (pentru deget); ferestrele unor aplicații sunt goale; în Paint nu
     se desenează; de la tastatură, săgețile pe bara de titlu mută fereastra (în Windows se face altfel).
     Tragerea spre marginea din stânga/dreapta pune fereastra pe jumătate de ecran, iar spre marginea de sus o
     maximizează; tragerea unei ferestre maximizate o readuce la mărimea de dinainte (ca în Windows 10/11; neprobat). */
(function(){
'use strict';
const CSS=`
.dw-cum{margin:0 0 6px;font-size:.86rem;color:var(--ink2)}
.dw{position:relative;height:380px;border:1px solid var(--line);border-radius:8px;overflow:hidden;user-select:none;-webkit-user-select:none;
  background:radial-gradient(120% 90% at 70% 10%,#7fb8ea 0,#3f86cf 45%,#1d4f95 100%);font:13px/1.25 "Segoe UI",system-ui,sans-serif;color:#1b1b1b;touch-action:manipulation}
@media (max-width:560px){.dw{height:360px}}
.dw *{box-sizing:border-box}
.dw-desk{position:absolute;left:0;right:0;top:0;bottom:48px;overflow:hidden}
.dw-icons{position:absolute;left:4px;top:4px;display:grid;grid-auto-flow:row;gap:2px}
.dw-ic{width:74px;min-height:66px;padding:4px 2px;border:1px solid transparent;border-radius:4px;background:none;color:#fff;font:inherit;font-size:11.5px;line-height:1.15;text-align:center;text-shadow:0 1px 2px #000,0 0 3px #000;cursor:default}
.dw-ic.sel{background:rgba(255,255,255,.28);border-color:rgba(255,255,255,.65)}
.dw-ic:focus-visible{outline:2px solid #fff;outline-offset:-2px}
.dw-ic .dw-ico{display:block;margin:0 auto 3px}
.dw-ico{display:inline-block;position:relative;width:30px;height:30px;flex:none;vertical-align:middle}
.dw-ico.sm{width:20px;height:20px}
.dw-ico.calc{background:#3b3f46;border-radius:6px;box-shadow:inset 0 0 0 2px #5b616b}
.dw-ico.calc::before{content:"";position:absolute;left:18%;right:18%;top:14%;height:22%;background:#9fd0ff;border-radius:2px}
.dw-ico.calc::after{content:"";position:absolute;left:18%;right:18%;top:46%;bottom:14%;background:radial-gradient(circle,#e8eaee 30%,transparent 34%) 0 0/33.3% 50%}
.dw-ico.paint{border-radius:50% 50% 45% 55%;background:#f7f2e8;box-shadow:inset 0 0 0 2px #c9b38d}
.dw-ico.paint::before{content:"";position:absolute;inset:18%;background:radial-gradient(circle at 30% 30%,#e53935 16%,transparent 18%),radial-gradient(circle at 70% 30%,#1e88e5 16%,transparent 18%),radial-gradient(circle at 30% 70%,#43a047 16%,transparent 18%),radial-gradient(circle at 70% 70%,#fdd835 16%,transparent 18%)}
.dw-ico.cos{width:24px;margin-left:3px;margin-right:3px;border:2px solid #e9f1fb;border-top-width:5px;border-radius:0 0 5px 5px;background:linear-gradient(90deg,transparent 30%,rgba(233,241,251,.8) 30% 36%,transparent 36% 64%,rgba(233,241,251,.8) 64% 70%,transparent 70%)}
.dw-ico.sm.cos{width:15px}
.dw-ico.explorer{background:linear-gradient(#f2c14e,#e0a92e);border-radius:2px 5px 4px 4px;height:22px;margin-top:6px}
.dw-ico.sm.explorer{height:14px;margin-top:4px}
.dw-ico.explorer::before{content:"";position:absolute;left:0;top:-5px;width:45%;height:6px;background:#e0a92e;border-radius:3px 3px 0 0}
.dw-ico.ceas{border-radius:50%;background:#fff;box-shadow:inset 0 0 0 3px #2b579a}
.dw-ico.ceas::before{content:"";position:absolute;left:47%;top:20%;width:2px;height:32%;background:#222}
.dw-ico.ceas::after{content:"";position:absolute;left:49%;top:48%;width:30%;height:2px;background:#222}
.dw-ico.setari{border-radius:50%;background:#6b7788;box-shadow:inset 0 0 0 5px #8b97a8,inset 0 0 0 9px #6b7788,inset 0 0 0 12px #e7ebf0}
.dw-sigla{display:inline-grid;grid-template-columns:9px 9px;gap:2px;vertical-align:middle}
.dw-sigla b{width:9px;height:9px;display:block;background:linear-gradient(135deg,#4cc2ff,#0067c0)}
.dw-win{position:absolute;background:#fff;border:1px solid #8e9aab;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden;min-width:0}
.dw-win.max{border-radius:0;border-width:0}
.dw-win.activ{border-color:#5d7fb0}
.dw-tit{flex:none;display:flex;align-items:center;height:34px;background:#f1f3f6;border-bottom:1px solid #dde2e8;touch-action:none;cursor:default;outline:none}
.dw-win.activ .dw-tit{background:#e3ebf6}
.dw-tit:focus-visible{box-shadow:inset 0 0 0 2px #0067c0}
.dw-tit .dw-ico{margin-left:8px}
.dw-tn{flex:1;min-width:0;padding-left:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12.5px;color:#333}
.dw-win.activ .dw-tn{color:#111}
.dw-tb{flex:none;width:42px;height:34px;border:0;background:none;color:#1b1b1b;font:inherit;font-size:15px;line-height:1;cursor:default;display:flex;align-items:center;justify-content:center}
.dw-tb:hover,.dw-tb:focus-visible{background:#d8dfe8;outline:none}
.dw-tb.x:hover,.dw-tb.x:focus-visible{background:#c42b1c;color:#fff}
.dw-sq{display:block;width:11px;height:11px;border:1.5px solid currentColor;border-radius:2px}
.dw-sq2{display:block;position:relative;width:12px;height:12px}
.dw-sq2::before,.dw-sq2::after{content:"";position:absolute;width:9px;height:9px;border:1.5px solid currentColor;border-radius:2px;background:inherit}
.dw-sq2::before{right:0;top:0}.dw-sq2::after{left:0;bottom:0;background:#fff}
.dw-tb:hover .dw-sq2::after{background:#d8dfe8}
.dw-cont{flex:1;min-height:0;overflow:hidden;position:relative;background:#fff}
.dw-rz{position:absolute;z-index:3;touch-action:none}
.dw-rz[data-rz="e"]{right:0;top:34px;bottom:14px;width:8px;cursor:ew-resize}
.dw-rz[data-rz="w"]{left:0;top:34px;bottom:14px;width:8px;cursor:ew-resize}
.dw-rz[data-rz="s"]{bottom:0;left:14px;right:34px;height:8px;cursor:ns-resize}
.dw-rz[data-rz="n"]{top:0;left:14px;right:130px;height:5px;cursor:ns-resize}
.dw-rz[data-rz="sw"]{left:0;bottom:0;width:14px;height:14px;cursor:nesw-resize}
.dw-rz[data-rz="nw"]{left:0;top:0;width:10px;height:6px;cursor:nwse-resize}
.dw-grip{position:absolute;right:0;bottom:0;z-index:4;width:32px;height:32px;padding:0;border:0;border-radius:0;touch-action:none;cursor:nwse-resize;
  background:linear-gradient(135deg,transparent 52%,#9aa5b4 52% 58%,transparent 58% 68%,#9aa5b4 68% 74%,transparent 74% 84%,#9aa5b4 84% 90%,transparent 90%)}
.dw-grip:focus-visible{outline:2px solid #0067c0;outline-offset:-2px}
.dw-win.max .dw-rz,.dw-win.max .dw-grip{display:none}
.dw-gol{position:absolute;inset:0;background:repeating-linear-gradient(0deg,#fff 0 22px,#f6f8fa 22px 23px)}
.dw-paint{display:flex;flex-direction:column;height:100%}
.dw-paint .m{flex:none;display:flex;gap:12px;padding:5px 10px;font-size:12px;color:#333;border-bottom:1px solid #eceff3;white-space:nowrap;overflow:hidden}
.dw-paint .u{flex:none;height:30px;background:#f7f8fa;border-bottom:1px solid #eceff3}
.dw-paint .p{flex:1;margin:8px;background:#fff;border:1px solid #d7dce3;box-shadow:0 1px 3px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;color:#9aa3ad;font-size:11px;text-align:center;padding:4px}
.dw-calc{display:flex;flex-direction:column;height:100%;background:#f3f3f3;padding:6px 6px 32px;gap:5px}
.dw-calc .d{flex:none;text-align:right;font-size:22px;font-weight:600;padding:2px 6px;overflow:hidden;white-space:nowrap;color:#111}
.dw-calc .k{flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:3px;min-height:0}
.dw-calc .k button{min-height:32px;border:0;border-radius:4px;background:#fff;color:#111;font:inherit;font-size:14px;cursor:default}
.dw-calc .k button.op{background:#f9f9f9}.dw-calc .k button.eg{background:#0067c0;color:#fff}
.dw-calc .k button:hover{filter:brightness(.94)}
.dw-bar{position:absolute;left:0;right:0;bottom:0;height:48px;display:flex;align-items:center;background:rgba(240,243,248,.96);border-top:1px solid #c7d0dc;z-index:900}
.dw-mid{flex:1;min-width:0;display:flex;justify-content:center;align-items:center;gap:2px;padding-left:4px;overflow:hidden}
.dw-bb{position:relative;min-width:40px;height:44px;padding:2px 4px 6px;border:0;border-radius:5px;background:none;color:#1b1b1b;font:inherit;font-size:10px;line-height:1.05;cursor:default;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}
.dw-bb:hover,.dw-bb:focus-visible,.dw-bb.on{background:rgba(0,0,0,.07);outline:none}
.dw-bb .l{max-width:62px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dw-bb.run::after{content:"";position:absolute;left:40%;right:40%;bottom:2px;height:3px;border-radius:2px;background:#8a96a6}
.dw-bb.act::after{left:28%;right:28%;background:#0067c0}
.dw-bb .n{position:absolute;right:3px;top:2px;font-size:9px;background:#0067c0;color:#fff;border-radius:6px;padding:0 3px}
.dw-tray{flex:none;display:flex;align-items:center;gap:0;padding-right:4px}
.dw-vol{display:inline-block;width:32px;height:32px;position:relative}
.dw-vol::before{content:"";position:absolute;left:9px;top:12px;width:5px;height:8px;background:#333}
.dw-vol::after{content:"";position:absolute;left:12px;top:9px;border:7px solid transparent;border-right:7px solid #333;border-left:0;height:0}
.dw-ceas{min-width:64px;height:44px;border:0;border-radius:5px;background:none;color:#1b1b1b;font:inherit;font-size:11.5px;line-height:1.3;text-align:right;padding:0 6px;cursor:default}
.dw-ceas:hover,.dw-ceas:focus-visible,.dw-ceas.on{background:rgba(0,0,0,.07);outline:none}
.dw-start{position:absolute;left:50%;bottom:54px;transform:translateX(-50%);width:min(320px,94%);background:#f3f4f6;border:1px solid #c5ccd6;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.4);padding:10px;z-index:950}
.dw-start input{width:100%;font:inherit;font-size:13px;padding:7px 10px;border:1px solid #c5ccd6;border-bottom:2px solid #0067c0;border-radius:6px;background:#fff;color:#111;margin-bottom:8px}
.dw-sg{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;min-height:70px}
.dw-sa{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 2px;min-height:64px;border:0;border-radius:6px;background:none;color:#111;font:inherit;font-size:11px;cursor:default}
.dw-sa:hover,.dw-sa:focus-visible{background:#e2e7ee;outline:none}
.dw-niciuna{grid-column:1/-1;color:#666;font-size:12px;padding:8px}
.dw-sjos{display:flex;justify-content:flex-end;border-top:1px solid #dde2e8;margin-top:8px;padding-top:6px;position:relative}
.dw-pw{width:40px;height:36px;border:0;border-radius:6px;background:none;cursor:default;display:flex;align-items:center;justify-content:center}
.dw-pw:hover,.dw-pw:focus-visible,.dw-pw.on{background:#e2e7ee;outline:none}
.dw-pw i{display:block;width:14px;height:14px;border:2px solid #333;border-top-color:transparent;border-radius:50%;position:relative}
.dw-pw i::after{content:"";position:absolute;left:4px;top:-5px;width:2px;height:8px;background:#333}
.dw-pm{position:absolute;right:0;bottom:44px;background:#fbfbfc;border:1px solid #c5ccd6;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.3);padding:4px;min-width:140px}
.dw-pm button{display:block;width:100%;min-height:34px;text-align:left;padding:6px 10px;border:0;border-radius:4px;background:none;color:#111;font:inherit;font-size:12.5px;cursor:default}
.dw-pm button:hover,.dw-pm button:focus-visible{background:#e2e7ee;outline:none}
.dw-cal{position:absolute;right:4px;bottom:54px;width:220px;background:#f3f4f6;border:1px solid #c5ccd6;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.4);padding:10px;z-index:950;font-size:12px}
.dw-cal b{display:block;margin-bottom:6px;font-size:13px}
.dw-cal .g{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center}
.dw-cal .g span{padding:3px 0;border-radius:50%}
.dw-cal .g .az{background:#0067c0;color:#fff}
.dw-grup{position:absolute;bottom:54px;left:50%;transform:translateX(-50%);background:#f3f4f6;border:1px solid #c5ccd6;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.4);padding:6px;z-index:950;min-width:190px}
.dw-grup button{display:flex;align-items:center;gap:6px;width:100%;min-height:36px;padding:6px 8px;border:0;border-radius:5px;background:none;color:#111;font:inherit;font-size:12px;text-align:left;cursor:default}
.dw-grup button:hover,.dw-grup button:focus-visible{background:#e2e7ee;outline:none}
.dw-negru{position:absolute;inset:0;z-index:990;background:#000;color:#ddd;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:16px;font-size:13px}
.dw-negru button{min-height:40px;padding:8px 14px;border:1px solid #777;border-radius:8px;background:#222;color:#fff;font:inherit;cursor:pointer}
.dw-rasp{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px}
.dw-rasp label{font-size:.92rem}
.dw-rasp input{flex:1 1 140px;min-width:0;min-height:36px;font:inherit;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)}
.dw-teste{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--paper2)}
.dw-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.dw-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.dw-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800;color:var(--ink2)}
.dw-teste li.ok .s{color:var(--ok)}
.dw-nota{margin:6px 0 0;font-size:.8rem;color:var(--ink2);line-height:1.35}
.dw-jos{margin:6px 0 0}
`;
function stil(){
  if(document.getElementById('sim-desktop-css'))return;
  const s=document.createElement('style');s.id='sim-desktop-css';s.textContent=CSS;document.head.appendChild(s);
}

/* aplicațiile: numele din Windows în română (Get-StartApps pe Windows 11 ro-RO, 28.09.2026: Calculator, Paint,
   Ceas, Setări); titlul ferestrei Paint „Fără titlu - Paint” (captura jocuri/fisiere-v/img/butoane-fereastra.webp);
   Coșul de reciclare se deschide în Explorer (captura cos-restaurare.webp: fereastra „… - Coș de reciclare”, explorer.exe) */
const APPS={
  calc:{nume:'Calculator',titlu:'Calculator',ico:'calc',bara:'Calculator',w:.40,h:.80},
  paint:{nume:'Paint',titlu:'Fără titlu - Paint',ico:'paint',bara:'Paint',w:.64,h:.74},
  cos:{nume:'Coș de reciclare',titlu:'Coș de reciclare',ico:'cos',icoBara:'explorer',bara:'Coș de reciclare',w:.58,h:.64},   /* m14: pe bară, numele ferestrei, nu „Explorer” (lecția 9) */
  ceas:{nume:'Ceas',titlu:'Ceas',ico:'ceas',bara:'Ceas',w:.52,h:.64},
  setari:{nume:'Setări',titlu:'Setări',ico:'setari',bara:'Setări',w:.62,h:.72}
};
const LUNI=['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'];
const MIN_W=220,MIN_H=118,BARA_T=34;   /* 220: pe telefon, bara de titlu a Calculatorului lasă loc de apucat lângă cele trei butoane */
const fara=t=>String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const doi=n=>String(n).padStart(2,'0');
const oraText=d=>`${doi(d.getHours())}:${doi(d.getMinutes())}`;
const dataText=d=>`${doi(d.getDate())}.${doi(d.getMonth()+1)}.${d.getFullYear()}`;

function stareNoua(Q){
  const s={win:[],z:[],start:false,cauta:'',putere:false,cal:false,grup:null,sel:null,log:[],oprit:false,dorm:false,rasp:'',nid:1,calc:{}};
  (Q.deschise||[]).forEach(d=>{const w=fereastraNoua(s,d.app,d);
    if(d.stare==='max'){w.prev={x:w.x,y:w.y,w:w.w,h:w.h};w.st='max'}
    else if(d.stare==='min'){w.stPremin='n';w.st='min'}});
  return s;
}
function fereastraNoua(s,app,g){
  const A=APPS[app]||APPS.setari,k=s.win.length;
  /* o fereastră nouă se deschide lângă pictograme, nu peste ele (auto: locul se socotește la desen, în pixeli) */
  const w={id:s.nid++,app,st:'n',auto:!(g&&g.x!=null),casc:k%4,
    x:g&&g.x!=null?g.x:.14+.05*(k%4),y:g&&g.y!=null?g.y:.03+.05*(k%4),
    w:g&&g.w!=null?g.w:A.w,h:g&&g.h!=null?g.h:A.h,prev:null,stPremin:'n'};
  w.init={w:w.w,h:w.h};
  s.win.push(w);s.z.push(w.id);return w;
}
const gw=(s,id)=>s.win.find(w=>w.id===id);
const deApp=(s,app)=>s.win.filter(w=>w.app===app);
/* ultima fereastră (cea mai de sus) a unei aplicații */
const unaDeApp=(s,app)=>{const ws=deApp(s,app);if(!ws.length)return null;return ws.slice().sort((a,b)=>s.z.indexOf(b.id)-s.z.indexOf(a.id))[0]};
/* fereastra activă = cea mai de sus dintre cele care se văd */
/* m1 (judecătorul): după un clic pe desktop nu mai e activă nicio fereastră (s.faraActiv), ca în Windows */
function activ(s){if(s.faraActiv)return null;for(let i=s.z.length-1;i>=0;i--){const w=gw(s,s.z[i]);if(w&&w.st!=='min')return w.id}return null}
function aduDeasupra(s,id){s.faraActiv=false;s.z=s.z.filter(x=>x!==id).concat(id)}
function inchideMeniuri(s){s.start=false;s.putere=false;s.cal=false;s.grup=null}
function maximizeaza(s,w,din){w.prev={x:w.x,y:w.y,w:w.w,h:w.h};w.st='max';s.log.push({e:'max',app:w.app,id:w.id,din})}
function restaureaza(s,w,din){const p=w.prev||{x:.1,y:.08,w:w.init.w,h:w.init.h};Object.assign(w,{x:p.x,y:p.y,w:p.w,h:p.h});w.st='n';s.log.push({e:'restore',app:w.app,id:w.id,din})}

const ACT={
  start(s){if(s.oprit||s.dorm)return;const d=!s.start;inchideMeniuri(s);s.start=d;s.cauta='';s.sel=null},
  cauta(s,t){s.cauta=t||''},
  lanseaza(s,app,via){if(s.oprit)return;inchideMeniuri(s);s.sel=null;const w=fereastraNoua(s,app);s.log.push({e:'open',app,via,id:w.id});aduDeasupra(s,w.id)},
  btn(s,app,b,id){const w=id?gw(s,id):unaDeApp(s,app);if(!w)return;inchideMeniuri(s);
    if(b==='min'){w.stPremin=w.st==='min'?w.stPremin:w.st;w.st='min';s.log.push({e:'min',app:w.app,id:w.id})}
    else if(b==='max'){if(w.st==='max')restaureaza(s,w,'buton');else maximizeaza(s,w,'buton');aduDeasupra(s,w.id)}
    else{s.win=s.win.filter(x=>x!==w);s.z=s.z.filter(x=>x!==w.id);s.log.push({e:'close',app:w.app,id:w.id})}},
  /* clic pe butonul aplicației din bara de activități: o fereastră → ascunsă: o readuce; activă: o ascunde;
     acoperită: o aduce deasupra. Mai multe ferestre → lista lor, deasupra butonului. */
  bara(s,app){const ws=deApp(s,app);if(!ws.length)return;const g=s.grup===app;inchideMeniuri(s);
    if(ws.length>1){s.grup=g?null:app;return}
    ACT.baraFereastra(s,ws[0].id)},
  baraFereastra(s,id){const w=gw(s,id);if(!w)return;inchideMeniuri(s);
    if(w.st==='min'){w.st=w.stPremin||'n';s.log.push({e:'readus',app:w.app,id});aduDeasupra(s,id)}
    else if(activ(s)===id){w.stPremin=w.st;w.st='min';s.log.push({e:'min',app:w.app,id,din:'bara'})}
    else{aduDeasupra(s,id);s.log.push({e:'activ',app:w.app,id,din:'bara'})}},
  titlu2(s,app,id){const w=id?gw(s,id):unaDeApp(s,app);if(!w||w.st==='min')return;inchideMeniuri(s);
    if(w.st==='max')restaureaza(s,w,'titlu');else maximizeaza(s,w,'titlu');aduDeasupra(s,w.id)},
  activ(s,app,id){const w=id?gw(s,id):unaDeApp(s,app);if(!w||w.st==='min')return;
    if(activ(s)!==w.id)s.log.push({e:'activ',app:w.app,id:w.id});aduDeasupra(s,w.id)},
  muta(s,app,g){const w=unaDeApp(s,app);if(!w)return;if(w.st==='max')restaureaza(s,w,'tragere');
    w.auto=false;w.x=g.x;if(g.y!=null)w.y=g.y;s.log.push({e:'move',app:w.app,id:w.id});aduDeasupra(s,w.id)},
  redim(s,app,g){const w=unaDeApp(s,app);if(!w||w.st!=='n')return;w.w=g.w;w.h=g.h;s.log.push({e:'resize',app:w.app,id:w.id});aduDeasupra(s,w.id)},
  ceas(s){s.rasp=oraText(new Date())},
  data(s){s.rasp=dataText(new Date())},
  rasp(s,t){s.rasp=t},
  alimentare(s,ce){inchideMeniuri(s);
    if(ce==='repaus'){s.dorm=true;s.log.push({e:'repaus'});return}
    s.log.push({e:ce==='inchidere'?'oprit':'repornit'});
    s.win.forEach(w=>s.log.push({e:'close',app:w.app,id:w.id,din:ce}));s.win=[];s.z=[];s.sel=null;
    if(ce==='inchidere')s.oprit=true},
  porneste(s){s.oprit=false;s.dorm=false}
};
function aplica(s,ops){(ops||[]).forEach(o=>{const f=ACT[o[0]];if(f)f(s,...o.slice(1))})}

/* ---------- testele (pe comportament: jurnalul acțiunilor + starea de la final) ---------- */
/* M3 (judecătorul): pe iPhone, tastatura numerică n-are „:”, deci se primește și ora doar din cifre (1035, 935, 10 35) */
function potrivesteOra(t){
  const m=String(t||'').match(/^\s*(\d{1,2})\s*[:.,h ]?\s*(\d{2})\s*$/);if(!m)return false;
  const v=+m[1]*60+(+m[2]),d=new Date(),a=d.getHours()*60+d.getMinutes();
  return v===a||v===(a+1439)%1440;   // și minutul de dinainte, dacă ceasul tocmai s-a schimbat
}
function trece(s,T){
  const ws=T.app?deApp(s,T.app):[],ev=e=>s.log.filter(l=>l.e===e&&(!T.app||l.app===T.app));
  const norm=ws.find(w=>w.st==='n');
  switch(T.tip){
    case 'pornit':return ev('open').some(l=>!T.prin||l.via===T.prin);
    case 'deschis':return ws.some(w=>w.st!=='min');
    case 'maximizat':return ws.some(w=>w.st==='max');
    case 'minimizat':return ws.length>0&&ws.every(w=>w.st==='min');
    case 'readus':return ev('readus').length>0&&ws.some(w=>w.st!=='min');
    case 'restaurat':return ev('restore').length>0&&!!norm;
    case 'ramas':return ws.length>0;
    case 'mutat':{if(!ev('move').length||!norm)return false;const cx=norm.x+(norm._wf||norm.w)/2;   /* _wf = lățimea desenată (după mărimea minimă) */
      return T.zona==='dreapta'?cx>=.6:T.zona==='stanga'?cx<=.4:true}
    case 'marit':case 'micsorat':{if(!ev('resize').length||!norm)return false;const r=(norm.w*norm.h)/(norm.init.w*norm.init.h);
      return T.tip==='marit'?r>=1.2:r<=.8}
    case 'inchis':return ws.length===0&&ev('close').length>0;
    case 'activ':{const a=activ(s),w=a&&gw(s,a);return !!w&&w.app===T.app}
    case 'ceas':return potrivesteOra(s.rasp);
    case 'oprit':return s.log.some(l=>l.e==='oprit');
  }
  return false;
}
function mesaj(s,T){
  if(T.m)return T.m;
  const N=(APPS[T.app]||{}).nume||'';
  switch(T.tip){
    case 'pornit':return T.prin==='desktop'?`Pornește ${N} cu dublu-clic pe pictograma lui de pe desktop.`:T.prin==='start'?`Pornește ${N} din meniul Start: clic pe butonul Start, apoi pe ${N}.`:`Pornește ${N}.`;
    case 'maximizat':return `${N} nu e cât tot ecranul: apasă butonul Maximizare (pătratul) al ferestrei lui.`;
    case 'minimizat':return `${N} se vede încă: apasă butonul Minimizare (liniuța) al ferestrei lui.`;
    case 'readus':return deApp(s,T.app).length?`Ascunde ${N} cu Minimizare (liniuța), apoi readu-l cu un clic pe butonul lui din bara de activități.`:`${N} e închis. Pornește-l din nou, ascunde-l cu Minimizare (liniuța), apoi readu-l din bara de activități.`;
    case 'restaurat':return `Maximizează ${N}, apoi apasă butonul din mijloc, Restabilire jos (cele două pătrate).`;
    case 'mutat':return `Trage fereastra ${N} de bara ei de titlu, până în ${T.zona==='stanga'?'partea din stânga':'partea din dreapta'} a ecranului. Dacă e cât tot ecranul, apasă întâi Restabilire jos.`;
    case 'marit':return `Trage de colțul din dreapta jos al ferestrei ${N} (în simulator, cel cu dungi) sau de o margine, în afară, ca s-o faci mai mare. Maximizarea nu se socotește aici.`;
    case 'micsorat':return `Trage de colțul din dreapta jos al ferestrei ${N} (în simulator, cel cu dungi) spre interiorul ei, ca s-o faci mai mică.`;
    case 'inchis':return `${N} e încă pornit: apasă butonul Închidere (X) al ferestrei lui.`;
    case 'activ':return `${N} nu e fereastra în care lucrezi: dă clic pe bara lui de titlu sau pe butonul lui din bara de activități. Un clic pe desktop face ca nicio fereastră să nu mai fie cea în care lucrezi, chiar dacă se vede deasupra.`;
    case 'ceas':return 'Scrie în casetă ora de pe ceasul din dreapta jos, de exemplu 10:35 (sau 10 35).';
    case 'oprit':return 'Oprește calculatorul simulat: Start, apoi Alimentare, apoi Închidere.';
    case 'deschis':return `${N} nu se vede pe ecran.`;
    case 'ramas':return `${N} s-a închis. Pornește-l din nou și nu-l închide: ajungi la cealaltă fereastră cu butonul ei din bara de activități.`;
  }
  return 'Mai ai de lucru.';
}

/* ---------- desenul ---------- */
/* m3 (judecătorul): căutarea din Start potrivește ÎNCEPUTUL cuvintelor din nume („pai” → Paint; „int” → nimic) */
function potriveste(a,c){const n=fara(APPS[a].nume),q=fara(c);return !q||n.startsWith(q)||n.split(/[\s-]+/).some(p=>p.startsWith(q))}
function gasite(Q,s){return (Q.startApps||['calc','paint','ceas','setari']).filter(a=>potriveste(a,s.cauta))}
function listaStart(lista,api){return lista.length?lista.map(a=>`<button type="button" class="dw-sa" data-sa="${a}" data-k="s-${a}">${icoApp(a)}<span>${api.esc(APPS[a].nume)}</span></button>`).join(''):'<span class="dw-niciuna">Nicio aplicație cu numele acesta.</span>'}
/* M4 (judecătorul, 28.09): după o tragere rapidă, cu degetul ridicat din mers, Chromium trimite pentru atingerea
   următoare pointerdown și pointerup, dar niciun click (4-5 pierdute din 20). Butoanele simulatorului răspund deci,
   la deget, la RIDICAREA lui (pointerup pe butonul pe care a coborât), iar click-ul care vine după se ignoră. */
function apasa(b,fn,body){
  b.addEventListener('pointerdown',ev=>{if(ev.pointerType==='touch')b._pd=ev.pointerId});
  b.addEventListener('pointercancel',()=>{b._pd=null});
  b.addEventListener('pointerup',ev=>{if(ev.pointerType!=='touch'||b._pd!==ev.pointerId)return;b._pd=null;
    const r=b.getBoundingClientRect();if(ev.clientX<r.left-6||ev.clientX>r.right+6||ev.clientY<r.top-6||ev.clientY>r.bottom+6)return;
    body._dwAtins=Date.now();b._tratat=Date.now();fn(ev)});
  /* după o atingere tratată la ridicare, browserul trimite și evenimentele de mouse de compatibilitate (mousedown,
     click), lovite din nou în punctul acela: după desenul nou ar nimeri alt element (proba 28.09: un <p>, iar focusul
     fugea pe body). preventDefault pe touchend le oprește pe toate (ascultătorul stă pe buton, chiar dacă a ieșit din pagină). */
  b.addEventListener('touchend',ev=>{if(b._tratat&&Date.now()-b._tratat<600){b._tratat=0;if(ev.cancelable)ev.preventDefault()}},{passive:false});
  /* click-ul care urmează atingerii (orice pointerType: Safari dă MouseEvent) se ignoră; tastatura (detail 0) trece */
  b.onclick=ev=>{if(ev.detail!==0&&body._dwAtins&&Date.now()-body._dwAtins<800)return;fn(ev)};
}
/* același lucru pentru butoanele motorului de sub ecran („Verifică”, „Arată-mi răspunsul”): la deget, ridicarea
   cheamă handlerul lor, iar click-ul de după e oprit înainte să ajungă la el (ascultător în faza de captură) */
function degetMotor(el,body){
  if(!el||el._dwDeget)return;el._dwDeget=1;
  el.addEventListener('click',ev=>{if(ev.detail!==0&&el._dwAtins&&Date.now()-el._dwAtins<800){ev.stopImmediatePropagation();ev.preventDefault()}},true);
  el.addEventListener('pointerdown',ev=>{if(ev.pointerType==='touch')el._pd=ev.pointerId});
  el.addEventListener('pointercancel',()=>{el._pd=null});
  el.addEventListener('pointerup',ev=>{if(ev.pointerType!=='touch'||el._pd!==ev.pointerId)return;el._pd=null;
    const r=el.getBoundingClientRect();if(ev.clientX<r.left-6||ev.clientX>r.right+6||ev.clientY<r.top-6||ev.clientY>r.bottom+6)return;
    if(typeof el.onclick==='function'){el._dwAtins=Date.now();el._tratat=Date.now();el.onclick(ev)}});
  el.addEventListener('touchend',ev=>{if(el._tratat&&Date.now()-el._tratat<600){el._tratat=0;if(ev.cancelable)ev.preventDefault()}},{passive:false});
}
function icoApp(app,mic,bara){const A=APPS[app]||{};return `<span class="dw-ico ${mic?'sm ':''}${bara&&A.icoBara?A.icoBara:A.ico}" aria-hidden="true"></span>`}
function continut(s,w,api){
  if(w.app==='calc'){const c=s.calc[w.id]||'0';
    const K=['C','÷','×','−','7','8','9','+','4','5','6','=','1','2','3','0'];
    return `<div class="dw-calc"><div class="d" aria-live="polite">${api.esc(c)}</div><div class="k">${K.map(k=>`<button type="button" data-ck="${k}" class="${/[÷×−+]/.test(k)?'op':k==='='?'eg':''}">${k}</button>`).join('')}</div></div>`}
  if(w.app==='paint')return `<div class="dw-paint"><div class="m"><span>Fișier</span><span>Editare</span><span>Vizualizați</span></div><div class="u"></div><div class="p">Aici desenezi. În simulator, nu desenăm.</div></div>`;
  return '<div class="dw-gol"></div>';
}
function calcApasa(s,id,k){
  const c=s.calc[id]||'0';
  if(k==='C'){s.calc[id]='0';return}
  if(k==='='){const e=c.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
    if(!/^[\d+\-*/.]+$/.test(e)||/[+\-*/]$/.test(e)){return}
    let r;try{r=Function('"use strict";return ('+e+')')()}catch(_){return}
    s.calc[id]=Number.isFinite(r)?String(Math.round(r*1e9)/1e9).replace('.',','):'Nu se poate împărți la zero';return}
  if(/^\d$/.test(k)){s.calc[id]=(c==='0'||/[a-z]/i.test(c))?k:c+k;return}
  if(/[a-z]/i.test(c))return;
  s.calc[id]=/[÷×−+]$/.test(c)?c.slice(0,-1)+k:c+k;
}
function geom(w,W,H){
  if(w.st==='max')return {l:0,t:0,w:W,h:H};
  let ww=Math.max(MIN_W,Math.min(W,w.w*W)),hh=Math.max(MIN_H,Math.min(H,w.h*H));
  let l=w.x*W,t=w.y*H;
  if(w.auto&&W>0){l=Math.min(88+w.casc*18,Math.max(0,W-ww));t=8+w.casc*14;w.x=l/W;w.y=t/H}
  l=Math.min(Math.max(l,-(ww-60)),W-60);t=Math.min(Math.max(t,0),H-BARA_T);
  return {l,t,w:ww,h:hh};
}
function calendar(api){
  const d=new Date(),y=d.getFullYear(),m=d.getMonth(),p=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();
  let c='';for(let i=0;i<p;i++)c+='<span></span>';
  for(let i=1;i<=n;i++)c+=`<span class="${i===d.getDate()?'az':''}">${i}</span>`;
  return `<div class="dw-cal" role="dialog" aria-label="Calendarul"><b>${LUNI[m]} ${y}</b><div class="g">${['L','Ma','Mi','J','V','S','D'].map(x=>`<span style="font-weight:700">${x}</span>`).join('')}${c}</div></div>`;
}

function deseneaza(Q,body,api,s){
  const E=api.esc,fe=document.activeElement,cheie=fe&&body.contains(fe)?fe.getAttribute('data-k'):null;
  const vechi=body.querySelector('.dw-desk');
  const W=vechi?vechi.clientWidth:(body.clientWidth||600),H=vechi?vechi.clientHeight:((window.innerWidth<=560?360:380)-48);
  const act=activ(s),pict=Q.pictograme||['cos','calc','paint'];
  const fer=s.z.map(id=>gw(s,id)).filter(w=>w&&w.st!=='min').map(w=>{
    const g=geom(w,W,H),A=APPS[w.app],max=w.st==='max',nume=A.titlu;if(!max&&W>0)w._wf=g.w/W;
    return `<section class="dw-win ${max?'max':''} ${w.id===act?'activ':''}" data-id="${w.id}" aria-label="Fereastra ${E(nume)}" style="left:${g.l}px;top:${g.t}px;width:${g.w}px;height:${g.h}px;z-index:${10+s.z.indexOf(w.id)}">
      <div class="dw-tit" tabindex="0" data-k="t${w.id}" aria-label="Bara de titlu: ${E(nume)}. Cu săgețile o muți.">${icoApp(w.app,true)}<span class="dw-tn">${E(nume)}</span>
        <button type="button" class="dw-tb" data-b="min" data-k="bm${w.id}" title="Minimizare" aria-label="Minimizare">—</button>
        <button type="button" class="dw-tb" data-b="max" data-k="bx${w.id}" title="${max?'Restabilire jos':'Maximizare'}" aria-label="${max?'Restabilire jos':'Maximizare'}"><span class="${max?'dw-sq2':'dw-sq'}"></span></button>
        <button type="button" class="dw-tb x" data-b="x" data-k="bc${w.id}" title="Închidere" aria-label="Închidere">✕</button></div>
      <div class="dw-cont">${continut(s,w,api)}</div>
      <div class="dw-rz" data-rz="e"></div><div class="dw-rz" data-rz="w"></div><div class="dw-rz" data-rz="s"></div><div class="dw-rz" data-rz="n"></div><div class="dw-rz" data-rz="sw"></div><div class="dw-rz" data-rz="nw"></div>
      <button type="button" class="dw-grip" data-rz="se" data-k="g${w.id}" title="Colțul ferestrei: trage de el ca să schimbi mărimea" aria-label="Colțul ferestrei: trage de el ca să schimbi mărimea. De la tastatură, cu săgețile."></button>
    </section>`}).join('');
  /* bara de activități: câte un buton pentru fiecare aplicație pornită, în ordinea pornirii */
  const aplic=[];s.win.slice().sort((a,b)=>a.id-b.id).forEach(w=>{if(!aplic.includes(w.app))aplic.push(w.app)});
  const aw=act&&gw(s,act);
  const bara=aplic.map(app=>{const n=deApp(s,app).length,A=APPS[app];
    return `<button type="button" class="dw-bb run ${aw&&aw.app===app?'act':''} ${s.grup===app?'on':''}" data-bara="${app}" data-k="b-${app}" title="${E(A.bara)}" aria-label="${E(A.bara)}, în bara de activități${n>1?`: ${n} ferestre`:''}">${icoApp(app,true,true)}<span class="l">${E(A.bara)}</span>${n>1?`<span class="n">${n}</span>`:''}</button>`}).join('');
  const lista=gasite(Q,s);
  const acum=new Date();
  const start=s.start?`<div class="dw-start" role="dialog" aria-label="Meniul Start">
      <input type="text" data-k="cauta" value="${E(s.cauta)}" placeholder="Căutare" aria-label="Caută o aplicație: scrie numele ei" autocomplete="off">
      <div class="dw-sg">${listaStart(lista,api)}</div>
      <div class="dw-sjos"><button type="button" class="dw-pw ${s.putere?'on':''}" data-pw="1" data-k="pw" title="Alimentare" aria-label="Alimentare"><i></i></button>
        ${s.putere?`<div class="dw-pm" role="menu"><button type="button" data-al="repaus" data-k="al-r" role="menuitem">Repaus</button><button type="button" data-al="inchidere" data-k="al-i" role="menuitem">Închidere</button><button type="button" data-al="repornire" data-k="al-p" role="menuitem">Repornire</button></div>`:''}</div>
    </div>`:'';
  const grup=s.grup?`<div class="dw-grup" role="menu" aria-label="Ferestrele aplicației ${E(APPS[s.grup].nume)}">${deApp(s,s.grup).map((w,i)=>`<button type="button" data-gf="${w.id}" data-k="gf${w.id}" role="menuitem">${icoApp(w.app,true)}${E(APPS[w.app].titlu)} (${i+1})${w.st==='min'?' — ascunsă':''}</button>`).join('')}</div>`:'';
  const teste=(Q.teste||[]).map(T=>trece(s,T));
  const negru=s.oprit?`<div class="dw-negru"><span>Calculatorul simulat s-a oprit.</span><button type="button" data-porn="1" data-k="porn">Pornește-l din nou</button></div>`
    :s.dorm?`<div class="dw-negru"><span>Calculatorul simulat e în repaus.</span><button type="button" data-porn="1" data-k="porn">Trezește-l</button></div>`:'';
  body.innerHTML=`<p class="dw-cum">${Q.cum||'Clic pe butonul Start (patru pătrate, jos). Dublu-clic = două clicuri repezi; pe telefon, două atingeri repezi. Ca să tragi, ții apăsat și miști.'}</p>
  <div class="dw" role="group" aria-label="Ecran Windows simulat">
    <div class="dw-desk">
      <div class="dw-icons">${pict.map(a=>`<button type="button" class="dw-ic ${s.sel===a?'sel':''}" data-ic="${a}" data-k="i-${a}" aria-label="Pictograma ${E(APPS[a].nume)}">${icoApp(a)}${E(APPS[a].nume)}</button>`).join('')}</div>
      ${fer}
    </div>
    ${start}${grup}${s.cal?calendar(api):''}
    <div class="dw-bar">
      <div class="dw-mid"><button type="button" class="dw-bb ${s.start?'on':''}" data-startb="1" data-k="start" title="Start" aria-label="Start"><span class="dw-sigla"><b></b><b></b><b></b><b></b></span></button>${bara}</div>
      <div class="dw-tray"><span class="dw-vol" title="Sunetul" aria-hidden="true"></span><button type="button" class="dw-ceas ${s.cal?'on':''}" data-ceas="1" data-k="ceas" aria-label="Ceasul: ${oraText(acum)}, ${dataText(acum)}"><span class="o">${oraText(acum)}</span><br><span class="z">${dataText(acum)}</span></button></div>
    </div>
    ${negru}
  </div>
  <p class="dw-jos"><button type="button" class="btn ghost sm dw-reset" data-k="reset">Ia-o de la capăt</button> <span class="hint">ecranul revine cum era la început</span></p>
  ${(Q.teste||[]).some(T=>T.tip==='ceas')?`<div class="dw-rasp"><label for="dw-r-${Q._uid}">${Q.intrebare||'Ce oră arată ceasul?'}</label><input id="dw-r-${Q._uid}" data-k="rasp" type="text" autocomplete="off" value="${E(s.rasp)}"></div>`:''}
  ${teste.length?`<div class="dw-teste"><b>Testele</b> <span class="hint dw-lbl">· ${teste.filter(Boolean).length} din ${teste.length} trec; se bifează pe loc</span><ol>${Q.teste.map((T,i)=>`<li class="${teste[i]?'ok':''}"><span class="s">${teste[i]?'✓':'○'}</span><span>${T.ce}</span></li>`).join('')}</ol></div>`:''}
  <p class="dw-nota">${Q.nota||'Simulatorul e un Windows mic: pe bara lui de activități stau doar aplicațiile pornite, cu numele scris sub pictogramă (în Windows, numele apare când ții săgeata pe pictogramă), iar unele ferestre sunt goale. Colțul cu dungi e doar în simulator, ca să-l nimerești cu degetul; în Windows pui săgeata pe margine până devine o săgeată cu două vârfuri. De la tastatură: Tab până la bara de titlu, apoi săgețile mută fereastra (în Windows, altfel).'}</p>`;
  leaga(Q,body,api,s);
  if(cheie){const el=body.querySelector(`[data-k="${cheie}"]`);if(el)el.focus({preventScroll:true})}
}
function actualizeazaTeste(Q,body,s){
  const t=(Q.teste||[]).map(T=>trece(s,T));
  body.querySelectorAll('.dw-teste li').forEach((li,i)=>{li.className=t[i]?'ok':'';li.querySelector('.s').textContent=t[i]?'✓':'○'});
  const l=body.querySelector('.dw-lbl');if(l)l.textContent=`· ${t.filter(Boolean).length} din ${t.length} trec; se bifează pe loc`;
}

/* ---------- gesturile ---------- */
function leaga(Q,body,api,s){
  const re=()=>deseneaza(Q,body,api,s);
  const root=body.querySelector('.dw'),desk=body.querySelector('.dw-desk');
  const q=(sel,f)=>body.querySelectorAll(sel).forEach(f);
  root.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&(s.start||s.cal||s.grup||s.putere)){inchideMeniuri(s);ev.preventDefault();re()}});
  const P=(sel,fn)=>q(sel,b=>apasa(b,ev=>fn(b,ev),body));
  P('[data-startb]',()=>{ACT.start(s);re();
    const i=body.querySelector('[data-k="cauta"]');if(i&&window.matchMedia&&matchMedia('(pointer:fine)').matches)i.focus({preventScroll:true})});
  const ci=body.querySelector('[data-k="cauta"]');
  /* m12 (judecătorul): la tastare se redesenează doar lista, nu și caseta (tastaturile de telefon compun cuvântul) */
  const leagaLista=()=>body.querySelectorAll('[data-sa]').forEach(b=>apasa(b,()=>{ACT.lanseaza(s,b.dataset.sa,'start');re()},body));
  if(ci){ci.oninput=()=>{s.cauta=ci.value;const g=body.querySelector('.dw-sg');if(g){g.innerHTML=listaStart(gasite(Q,s),api);leagaLista()}};
    ci.onkeydown=ev=>{if(ev.key==='Enter'&&!ev.isComposing){const l=gasite(Q,s);if(l.length){ACT.lanseaza(s,l[0],'start');re()}}}}
  leagaLista();
  P('[data-pw]',()=>{s.putere=!s.putere;re()});
  P('[data-al]',b=>{ACT.alimentare(s,b.dataset.al);re()});
  P('[data-porn]',()=>{ACT.porneste(s);re()});
  P('[data-k="reset"]',()=>{const n=stareNoua(Q);body._dw.s=n;deseneaza(Q,body,api,n);const r=body.querySelector('[data-k="reset"]');if(r)r.focus({preventScroll:true})});
  P('[data-ceas]',()=>{const d=!s.cal;inchideMeniuri(s);s.cal=d;re()});
  P('[data-bara]',b=>{ACT.bara(s,b.dataset.bara);re()});
  P('[data-gf]',b=>{ACT.baraFereastra(s,+b.dataset.gf);re()});
  /* pictogramele: un clic o alege, două clicuri repezi (sau Enter pe cea aleasă) pornesc aplicația */
  q('[data-ic]',b=>{
    apasa(b,ev=>{if(ev.type==='click'&&ev.detail===0)return;const a=b.dataset.ic,t=Date.now();
      if(s.sel===a&&s._icT&&t-s._icT<500){s._icT=0;ACT.lanseaza(s,a,'desktop');re();return}
      inchideMeniuri(s);s.sel=a;s._icT=t;re()},body);
    b.onkeydown=ev=>{if(ev.key==='Enter'){ev.preventDefault();ACT.lanseaza(s,b.dataset.ic,'desktop');re()}
      else if(ev.key===' '){ev.preventDefault();s.sel=b.dataset.ic;re()}}});
  desk.addEventListener('click',ev=>{if(ev.target===desk||ev.target.classList.contains('dw-icons')){
    const had=s.sel||s.start||s.cal||s.grup||(!s.faraActiv&&activ(s)!=null);s.sel=null;inchideMeniuri(s);
    if(s.win.length)s.faraActiv=true;if(had)re()}});
  /* ferestrele */
  q('.dw-win',el=>{const id=+el.dataset.id,w=gw(s,id);
    el.addEventListener('pointerdown',ev=>{if(activ(s)!==id||s.start||s.cal||s.grup){const menu=s.start||s.cal||s.grup;inchideMeniuri(s);ACT.activ(s,null,id);
      if(menu){body.querySelectorAll('.dw-start,.dw-cal,.dw-grup').forEach(x=>x.remove())}
      body.querySelectorAll('.dw-win').forEach(x=>{x.style.zIndex=10+s.z.indexOf(+x.dataset.id);x.classList.toggle('activ',+x.dataset.id===activ(s))});
      body.querySelectorAll('[data-bara]').forEach(x=>x.classList.toggle('act',x.dataset.bara===w.app));actualizeazaTeste(Q,body,s)}});
    el.querySelectorAll('[data-b]').forEach(b=>apasa(b,ev=>{ev.stopPropagation();ACT.btn(s,null,b.dataset.b,id);re()},body));
    el.querySelectorAll('[data-ck]').forEach(b=>apasa(b,()=>{calcApasa(s,id,b.dataset.ck);const d=el.querySelector('.dw-calc .d');if(d)d.textContent=s.calc[id]},body));
    const tit=el.querySelector('.dw-tit');
    tit.addEventListener('pointerdown',ev=>{if(ev.target.closest('button')||ev.button>0)return;trage(ev,'muta',el,w)});
    el.querySelectorAll('[data-rz]').forEach(h=>h.addEventListener('pointerdown',ev=>{if(ev.button>0)return;trage(ev,h.dataset.rz,el,w)}));
    tit.addEventListener('keydown',ev=>{const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[ev.key];if(!d)return;ev.preventDefault();
      if(w.st==='max')restaureaza(s,w,'tastatura');w.auto=false;w.lipit=false;const g=geom(w,W0(),H0());w.x=Math.min(Math.max(w.x+d[0]*.04,-(g.w-60)/W0()),(W0()-60)/W0());w.y=Math.min(Math.max(0,w.y+d[1]*.05),(H0()-BARA_T)/H0());s.log.push({e:'move',app:w.app,id});re()});
    const gr=el.querySelector('.dw-grip');
    gr.addEventListener('keydown',ev=>{const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[ev.key];if(!d||w.st!=='n')return;ev.preventDefault();
      w.w=Math.max(MIN_W/W0(),Math.min(1,w.w+d[0]*.05));w.h=Math.max(MIN_H/H0(),Math.min(1,w.h+d[1]*.06));s.log.push({e:'resize',app:w.app,id});re()});
  });
  const W0=()=>desk.clientWidth||600,H0=()=>desk.clientHeight||300;
  const ra=body.querySelector('[data-k="rasp"]');if(ra)ra.oninput=()=>{s.rasp=ra.value;actualizeazaTeste(Q,body,s)};
  /* tragerea: mutare (bara de titlu) sau redimensionare (margini, colțuri); fără desen nou până la final */
  function trage(ev,mod,el,w){
    const r=desk.getBoundingClientRect(),W=r.width,H=r.height,g=geom(w,W,H);w.auto=false;
    const p0={x:ev.clientX,y:ev.clientY},st={...g},inainte={x:w.x,y:w.y,w:w.w,h:w.h,st:w.st};
    let mutat=false,restauratAcum=false,eraMax=false;
    const tinta=ev.currentTarget;try{tinta.setPointerCapture(ev.pointerId)}catch(_){}
    ev.preventDefault();
    const muta=e=>{const dx=e.clientX-p0.x,dy=e.clientY-p0.y;
      if(!mutat&&Math.abs(dx)+Math.abs(dy)<5)return;
      if(!mutat&&mod!=='muta'&&w.st==='max')return;
      mutat=true;
      if(mod==='muta'){
        if(w.st==='max'||w.lipit){  /* ca în Windows: fereastra maximizată sau lipită pe o jumătate (m2), trasă, revine la mărimea de dinainte, sub deget */
          const p=w.prev||{w:w.init.w,h:w.init.h},fx=(e.clientX-r.left)/W,nw=Math.max(MIN_W,p.w*W);
          eraMax=w.st==='max';w.st='n';w.lipit=false;w.w=p.w;w.h=p.h;restauratAcum=true;el.classList.remove('max');
          st.w=nw;st.h=Math.max(MIN_H,p.h*H);st.l=(e.clientX-r.left)-fx*nw;st.t=0;p0.x=e.clientX;p0.y=e.clientY;
          const bx=el.querySelector('[data-b="max"]');if(bx){bx.title='Maximizare';bx.setAttribute('aria-label','Maximizare');bx.innerHTML='<span class="dw-sq"></span>'}
          el.style.width=st.w+'px';el.style.height=st.h+'px';el.style.left=st.l+'px';el.style.top='0px';w.x=st.l/W;w.y=0;return}
        let l=st.l+dx,t=st.t+dy;l=Math.min(Math.max(l,-(st.w-60)),W-60);t=Math.min(Math.max(t,0),H-BARA_T);
        el.style.left=l+'px';el.style.top=t+'px';w.x=l/W;w.y=t/H;
      }else{
        let {l,t,w:ww,h:hh}=st;
        if(mod.includes('e'))ww=Math.max(MIN_W,Math.min(W-l,st.w+dx));
        if(mod.includes('s'))hh=Math.max(MIN_H,Math.min(H-t,st.h+dy));
        if(mod.includes('w')){const nl=Math.max(0,Math.min(st.l+st.w-MIN_W,st.l+dx));ww=st.w+(st.l-nl);l=nl}
        if(mod.includes('n')){const nt=Math.max(0,Math.min(st.t+st.h-MIN_H,st.t+dy));hh=st.h+(st.t-nt);t=nt}
        el.style.left=l+'px';el.style.top=t+'px';el.style.width=ww+'px';el.style.height=hh+'px';
        w.x=l/W;w.y=t/H;w.w=ww/W;w.h=hh/H;
      }};
    const gata=e=>{tinta.removeEventListener('pointermove',muta);tinta.removeEventListener('pointerup',gata);tinta.removeEventListener('pointercancel',gata);
      try{tinta.releasePointerCapture(e.pointerId)}catch(_){}
      if(!mutat){
        if(mod==='muta'&&e.type==='pointerup'){const t=Date.now();   /* dublu-clic pe bara de titlu */
          if(s._titT&&s._titId===w.id&&t-s._titT<500){s._titT=0;ACT.titlu2(s,null,w.id);setTimeout(re,0)}else{s._titT=t;s._titId=w.id}}
        return}
      if(mod==='muta'){
        if(eraMax)s.log.push({e:'restore',app:w.app,id:w.id,din:'tragere'});
        const px=e.clientX-r.left,py=e.clientY-r.top;
        const pre={x:restauratAcum?w.x:inainte.x,y:restauratAcum?0:inainte.y,w:restauratAcum?w.w:inainte.w,h:restauratAcum?w.h:inainte.h};
        if(py<=3&&e.type==='pointerup'){w.prev=pre;w.st='max';s.log.push({e:'max',app:w.app,id:w.id,din:'tragere-sus'})}
        else if(px<=4&&e.type==='pointerup'){w.prev=pre;w.lipit=true;Object.assign(w,{x:0,y:0,w:.5,h:1});s.log.push({e:'move',app:w.app,id:w.id,din:'margine-stanga'})}
        else if(px>=W-4&&e.type==='pointerup'){w.prev=pre;w.lipit=true;Object.assign(w,{x:.5,y:0,w:.5,h:1});s.log.push({e:'move',app:w.app,id:w.id,din:'margine-dreapta'})}
        else s.log.push({e:'move',app:w.app,id:w.id});
      }else{w.lipit=false;s.log.push({e:'resize',app:w.app,id:w.id})}
      /* desenul nou după ce browserul termină atingerea (touchend ajunge încă la bara de titlu); desenat pe loc,
         următoarea atingere pierdea uneori clicul (proba cu degetul, 28.09) */
      setTimeout(re,0)};
    tinta.addEventListener('pointermove',muta);tinta.addEventListener('pointerup',gata);tinta.addEventListener('pointercancel',gata);
  }
  /* ceasul: se schimbă singur, ca în Windows */
  if(body._dwTimer)clearInterval(body._dwTimer);
  body._dwTimer=setInterval(()=>{if(!document.body.contains(root)){clearInterval(body._dwTimer);return}
    const d=new Date(),c=root.querySelector('.dw-ceas');if(!c)return;
    const o=c.querySelector('.o'),z=c.querySelector('.z');if(o.textContent!==oraText(d)){o.textContent=oraText(d);z.textContent=dataText(d);c.setAttribute('aria-label',`Ceasul: ${oraText(d)}, ${dataText(d)}`);actualizeazaTeste(Q,body,s)}},5000);
}

let UID=0;
function porneste(Q,body,api,ops){
  stil();if(Q._uid==null)Q._uid=++UID;
  const s=stareNoua(Q);if(ops)aplica(s,ops);
  body._dw={s,Q,re:()=>deseneaza(Q,body,api,body._dw.s)};
  deseneaza(Q,body,api,s);
  return s;
}
window.SimDesktop={
  render(Q,body,api){
    porneste(Q,body,api);
    const nav=api.checkButton(()=>{
      const s=body._dw.s,T=Q.teste||[],rez=T.map(t=>trece(s,t)),k=rez.indexOf(false);
      actualizeazaTeste(Q,body,s);
      if(k<0){nav.innerHTML='';api.resolve(true);return}   /* m11: a trecut, focusul rămâne unde l-a pus motorul */
      api.resolve(false,`${rez.filter(Boolean).length} din ${T.length} teste trec. ${mesaj(s,T[k])}`);
      api.revealButton(()=>{porneste(Q,body,api,Q.rezolvare);nav.innerHTML='';api.giveUp(Q.solutieText||'pașii sunt făcuți acum pe ecranul simulat.')});
      degetMotor(nav.querySelector('#reveal'),body);
      /* m11: focusul se întoarce în casetă, dacă testul care nu trece e ceasul; altfel pe butonul Start */
      const f=T[k].tip==='ceas'?body.querySelector('[data-k="rasp"]'):body.querySelector('[data-k="start"]');if(f)f.focus({preventScroll:true});
    },'Verifică');
    degetMotor(nav.querySelector('#chk'),body);
  },
  rezolva(Q,body,api){porneste(Q,body,api,Q.rezolvare)},
  gresit(Q,body,api){porneste(Q,body,api,Q.gresit||[])},
  /* pentru probe: starea curentă și testele */
  _stare:body=>body&&body._dw?body._dw.s:null,
  _trece:trece
};
})();
