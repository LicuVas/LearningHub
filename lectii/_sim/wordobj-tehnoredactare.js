/* lectii/_sim/wordobj-tehnoredactare.js — Word-ul simulat pentru TEHNOREDACTARE: repari un document după reguli și îl
   verifici cu semnele ¶ și cu PREVIZUALIZAREA (File › Print, Ctrl+P) (LearningHub, 28.09.2026).
   PROPRIETAR: autorul lecției VII · M2 · 8 („Reguli de tehnoredactare și estetică a paginii tipărite”).
   SE ÎNCARCĂ DUPĂ lectii/_sim/wordobj.js și lectii/_sim/wordobj-formatare.js (editorul: tastare, ⌫, Delete, Enter,
   selectare, Ctrl+Z, fonturi, aliniere, butonul ¶ — toate de acolo, NESCHIMBATE) și după jocuri/_motor/ui-panglica.js +
   panglica-word.js. Tipul de exercițiu: `wordteh` -> tipuri:{wordteh:TipWordTehno}.
   CE ADAUGĂ, probat în Word-ul REAL (Word 16.0.20326, instanță nouă pe desktop ascuns; lectii/vii/m2-l08/_proba/):
   - TESTELE regulilor (nu textul unui singur exercițiu): spații duble, spațiu înaintea semnelor, spațiu lipsă după ele,
     paranteze și ghilimele lipite de text, cratima fără spații, linia de pauză (–) cu spații, rânduri goale, un paragraf
     întreg / aliniat cu butonul, fonturile textului, textul exact. Word NU repară singur nimic din acestea (probat:
     „Luni  mergem la muzeu , la ora 10.Luați” rămâne așa).
   - PREVIZUALIZAREA: Ctrl+P deschide fila File pe pagina Print (probat, dump UI Automation + captură); clic pe File
     deschide pagina Home (ca în wordfisier.js). În stânga: ← (Back), Home, New, Open, Info, Save, Save As, History,
     Print, Share, Export, Close, jos Account, Options. Pagina Print: butonul Print, Copies, Printer, Settings (Print All
     Pages, Pages, Collated, Portrait Orientation, Normal Margins „Top: 2,5 cm Bottom: 2,5 cm…”, 1 Page Per Sheet, Page
     Setup) și, în dreapta, paginile cum ies pe hârtie, cu „1 of 2” dedesubt. Semnele ¶ și · NU apar în previzualizare
     (probat: captură cu ShowAll pornit + PDF-ul făcut de Word, fără ¶ și ·). Esc sau ← te întoarce în document (probat).
   - PAGINILE: foaia A4 21 x 29,7 cm cu marginile Normal de 2,5 cm (probat în lecția 7), deci 16 x 24,7 cm de text; textul
     se așază la aceeași scară ca în editor (11 pt = 16 px). Proba: invitația de la pasul 5 al lecției VII/8 (titlu de
     28 pt + 8 paragrafe de 14 pt) trece pe pagina 2 de la 16 rânduri goale de 14 pt, în Word și aici; lecția pune 20
     (_proba/rezultate_fa.json „e_prag_p5”, proba_ui_l08.json „prag_simulator_p5”).
   - Ctrl+P e prins în TOATĂ pagina cât timp exercițiul e pe ecran (judecătorul, M3: după „Pasul următor →” focusul nu e
     în document, iar Ctrl+P deschidea tipărirea browserului; în Word, Ctrl+P deschide mereu pagina Print).
   - Butonul ¶ are și o tastă de 40 px sub fereastră (judecătorul, M4: pe telefon, butonul din panglică are 16 px).
   - Regula „un spațiu după semn” NU se aplică ÎN INTERIORUL unui număr (7,5), al unei date (13.11.2026), al unei ore
     (10.30, 10:30), al unei abrevieri (ș.a.m.d., S.U.A.) și al unei adrese (www.scoala.ro): DOOM3 1.2.3 („punctul
     interior”), dexonline „Punctuația” (judecătorul, G1; trecerea 2, N2). Între numere DIFERITE dintr-o înșiruire, după
     virgulă se pune spațiu (12, 13 și 14): testul `intreCifre` prinde doar punctul / două puncte urmate de spațiu între
     cifre („13. 11”, „10: 30”), nu și virgula („12, 13” e corect; judecătorul, trecerea 2, N1). „12,13 și 14” scris
     lipit arată ca un număr cu virgulă, deci îl prinde doar testul `tinta` al exercițiului (textul exact).
   ABATERI SPUSE PE ECRAN: în previzualizare setările nu se schimbă și butonul Print nu tipărește; paginile nu se rup
   exact ca în Word (aici tăiem textul la înălțimea paginii; documentele lecției încap pe 1-2 pagini, departe de rupere);
   celelalte pagini ale filei File (Save As, Open…) nu sunt simulate.
   CONFIGURAȚIA: {t:'wordteh', q, start:[par…], pre?:[op…], tinta:[par…] (documentul reparat), verif:[test…],
     tipic?:[par…] (greșeala tipică, pentru poartă), unelte?:[…] (ca wordfmt), previz?:false (fără previzualizare)}
     par = 'text' sau {t, al?:'center'|'right'|…, f?:{font, sz, b}} (ca în wordobj-formatare.js).
   TESTE: {ce, pil:true} | {ce, fara:'spatiiDuble'|'spatiuInainte'|'lipitDupa'|'paranteze'|'ghilimele'|'cratima'|
     'linia'|'randGol'|'spatiiInceput'|'intreCifre' sau o listă} | {ce, paragraf:'text exact', al?} | {ce, paragrafe:N} |
     {ce, fonturiDe:{dela:N, max:1}} | {ce, fmt:{text, b?, sz?, font?}} | {ce, tinta:true, cumDaca?:{text, cum}} | {ce, textPastrat:true} |
     {ce, previzualizare:true} (previzualizarea deschisă DUPĂ ultima schimbare) | {ce, pagini:N}; fiecare cu cum? opțional.
   API: render(Q, body, api), rezolva(Q, body), gresit(Q, body). */
(function(G){
'use strict';
const WF=G.TipWordFormat;
if(!WF&&G.console)console.warn('wordobj-tehnoredactare.js: lipsește lectii/_sim/wordobj-formatare.js (se încarcă înainte)');
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PX=16/11, CM=28.3465*PX;                 // aceeași scară ca editorul (wordobj-formatare.js)
const PAG={w:21*CM,h:29.7*CM,m:2.5*CM};        // A4, margini Normal 2,5 cm (lecția 7)
const TXT_H=PAG.h-2*PAG.m;
const baza=f=>String(f||'').replace(/ \((Body|Headings)\)$/,'');
const clone=d=>JSON.parse(JSON.stringify(d));
const scurt=t=>{t=String(t).trim();return '„'+(t.length>34?t.slice(0,34)+'…':t)+'”'};
const arata=s=>esc(s).replace(/ /g,'·');     // în mesaje, spațiile ca în Word cu ¶ pornit
const AL_RO={left:'la stânga',center:'la mijloc',right:'la dreapta',justify:'stânga-dreapta'};
const AL_BTN={left:'<b>Align Left</b> (Ctrl+L)',center:'<b>Center</b> (Ctrl+E)',right:'<b>Align Right</b> (Ctrl+R)',justify:'<b>Justify</b> (Ctrl+J)'};

/* ---------- regulile, pe textul fiecărui paragraf ---------- */
const REG={
  spatiiDuble:{re:/ {2,}/,cum:(p,m)=>`În ${scurt(p)} sunt ${m[0].length} spații la rând (${'·'.repeat(m[0].length)}) lângă ${ctx(p,m)}. Dă un clic între puncte și apasă ⌫, până rămâne unul singur.`},
  spatiuInainte:{re:/ +([,.;:!?)”])/,cum:(p,m)=>`În ${scurt(p)}, înainte de „${esc(m[1])}” e un spațiu (${ctx(p,m)}). Semnul se lipește de cuvântul dinainte: clic după spațiu și ⌫.`},
  lipitDupa:{gaseste:lipitDupa,cum:(p,m)=>`În ${scurt(p)}, după „${esc(m[1])}” lipsește spațiul (${ctx(p,m)}). Dă un clic imediat după semn și apasă bara de spațiu.`},
  paranteze:{re:/\( +| +\)/,cum:(p,m)=>`În ${scurt(p)}, paranteza are un spațiu lipit în interior (${ctx(p,m)}). Paranteza se lipește de textul din ea.`},
  ghilimele:{re:/„ +| +”/,cum:(p,m)=>`În ${scurt(p)}, ghilimelele au un spațiu în interior (${ctx(p,m)}). Ghilimelele se lipesc de textul din ele.`},
  cratima:{re:/ +-|- +/,cum:(p,m)=>`În ${scurt(p)}, cratima are un spațiu lângă ea (${ctx(p,m)}). Cratima (-) nu are spații nici înainte, nici după.`},
  linia:{re:/[^ ]–|–[^ ]/,cum:(p,m)=>`În ${scurt(p)}, linia de pauză (–) e lipită de un cuvânt (${ctx(p,m)}). Pune câte un spațiu de o parte și de alta a ei.`},
  intreCifre:{re:/\d[.:] +\d/,cum:(p,m)=>`În ${scurt(p)}, într-o dată sau într-o oră a rămas un spațiu (${ctx(p,m)}). În interiorul unei date sau al unei ore nu pui spațiu: 13.11.2026, ora 10.30.`},
  spatiiInceput:{re:/^ +/,cum:(p)=>`Paragraful ${scurt(p)} începe cu spații. Șterge-le: le vezi ca puncte · în fața primului cuvânt.`}
};
/* un semn de punctuație lipit de ce urmează — în afară de: cifră-semn-cifră (13.11.2026, 7,5, 10.30, 10:30), semn urmat de
   închidere sau de alt semn („)”, „”” , „?!”, „...”) și adresele (www.scoala.ro, ana@scoala.ro, https://…) */
function lipitDupa(t){
  const re=/[,;:!?.](?=\S)/g;let m;
  while((m=re.exec(t))){const i=m.index,a=t[i-1]||'',z=t[i+1];
    if(/[)”»,;:!?.…]/.test(z))continue;
    if(/\d/.test(a)&&/\d/.test(z))continue;
    let s0=i,s1=i;while(s0>0&&!/\s/.test(t[s0-1]))s0--;while(s1<t.length&&!/\s/.test(t[s1]))s1++;const tok=t.slice(s0,s1);
    if(/www\.|:\/\/|@/i.test(tok))continue;
    if(/^[„(]?(?:[\p{L}]{1,3}\.){2,}[\p{L}]{0,3}\.?[)”,;:!?]*$/u.test(tok))continue;   // abrevieri: ș.a.m.d., S.U.A., a.c.
    return {index:i,0:t[i]+z,1:t[i]}}
  return null;
}
/* telefon: atingere sau ecran îngust (aceeași condiție ca stilurile de telefon din wordobj-formatare.js) */
const ecranMic=()=>typeof matchMedia==='function'&&(matchMedia('(pointer:coarse)').matches||matchMedia('(max-width:760px)').matches);
function ctx(t,m){const a=Math.max(0,m.index-6),z=Math.min(t.length,m.index+m[0].length+6);return '„'+arata(t.slice(a,z))+'”'}
function incalca(doc,nume){
  if(nume==='randGol'){const i=doc.findIndex(p=>!p.t.trim());return i<0?null:`Mai e un rând gol (are doar ¶), al ${i+1}-lea paragraf. Dă un clic pe el și apasă ⌫. Spațiul dintre paragrafe nu se face cu Enter.`}
  const R=REG[nume];if(!R)return null;
  for(const p of doc){const m=R.gaseste?R.gaseste(p.t):R.re.exec(p.t);if(m)return R.cum(p.t,m)}
  return null;
}
/* ---------- paginile: textul așezat pe lățimea de 16 cm, tăiat la 24,7 cm ---------- */
function curatClona(docEl){
  const c=docEl.cloneNode(true);
  c.querySelectorAll('.wt-pd').forEach(x=>x.replaceWith(' '));   // spațiile tastate încă netrimise, desenate ca · (mai jos)
  c.querySelectorAll('.wo-car,.wo-drop,.wf-pm').forEach(x=>x.remove());
  c.querySelectorAll('.wf-pil').forEach(x=>{const tata=x.parentElement;if(tata&&tata.hasAttribute('data-o')&&!tata.classList.contains('wo-tab'))tata.textContent=' ';else x.remove()});
  c.querySelectorAll('.wo-sl').forEach(x=>x.classList.remove('wo-sl'));
  c.removeAttribute('role');c.removeAttribute('aria-label');c.className='wf-doc wt-txt';
  return c;
}
function masoara(docEl){
  const c=curatClona(docEl),gazda=document.createElement('div');
  gazda.className='wo wf wt-masura';gazda.style.cssText=`position:absolute;left:-99999px;top:0;width:${PAG.w-2*PAG.m}px;visibility:hidden`;
  gazda.appendChild(c);document.body.appendChild(gazda);
  const ps=[...c.querySelectorAll('.wf-p')];let h=0;
  if(ps.length){const r0=c.getBoundingClientRect().top,u=ps[ps.length-1],r=u.getBoundingClientRect();h=r.bottom-r0}   // fără spațiul de după ultimul paragraf
  gazda.remove();
  return {h,pagini:Math.max(1,Math.ceil((h-0.5)/TXT_H)),clona:c};
}

/* ---------- stilul ---------- */
let STIL=false;
function stil(){
  if(STIL||typeof document==='undefined')return;STIL=true;
  const s=document.createElement('style');s.textContent=`
.wt .wo-teste:not(.wt-teste){display:none}
.wt .pg .pg-fisier{cursor:pointer;min-height:32px;display:inline-flex;align-items:center;border-radius:4px 4px 0 0;color:var(--ink)}
.wt .pg .pg-fisier:hover,.wt .pg .pg-fisier:focus-visible{background:var(--sel);outline:2px solid var(--accent);outline-offset:-2px}
.wt-leg{margin:0;padding:4px 10px;border:1px solid var(--line);border-top:0;background:var(--paper2);font-size:.86rem}
.wt.wt-bs-deschis .wo-rb,.wt.wt-bs-deschis .wo-leg,.wt.wt-bs-deschis .wt-leg,.wt.wt-bs-deschis .wo-dlg,.wt.wt-bs-deschis .wo-pag,.wt.wt-bs-deschis .wo-kbd,.wt.wt-bs-deschis .wo-jos,.wt.wt-bs-deschis .wo-ctx{display:none!important}
.wt-bs{display:none;border:1px solid #C8C8C8;background:#FAFAFA;color:#242424;font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;min-height:320px}
.wt.wt-bs-deschis .wt-bs{display:grid;grid-template-columns:minmax(118px,150px) 1fr}
@media (max-width:620px){.wt.wt-bs-deschis .wt-bs{grid-template-columns:1fr}}
.wt-bs-st{background:#F0F0F0;border-right:1px solid #DADADA;display:flex;flex-direction:column;padding:6px 0}
@media (max-width:620px){.wt-bs-st{flex-direction:row;flex-wrap:wrap;border-right:0;border-bottom:1px solid #DADADA;padding:4px}}
.wt-bs-st button{min-height:34px;border:0;background:none;color:#242424;text-align:left;padding:4px 14px;font:inherit;font-size:.86rem;cursor:pointer;border-left:3px solid transparent}
.wt-bs-st button:hover,.wt-bs-st button:focus-visible{background:#E4E4E4}
.wt-bs-st button.on{background:#E1E1E1;border-left-color:#185ABD;font-weight:600}
.wt-bs-st button.wt-inapoi{font-size:1.15rem;width:44px;text-align:center;padding:4px}
.wt-bs-st .wt-sep{height:1px;background:#D4D4D4;margin:6px 10px}
@media (max-width:620px){.wt-bs-st .wt-sep{display:none}.wt-bs-st button{border-left:0;border-bottom:3px solid transparent;padding:4px 8px}.wt-bs-st button.on{border-bottom-color:#185ABD}}
.wt-bs-c{padding:10px 12px;min-width:0}
.wt-bs-c h4{margin:0 0 8px;font-size:1.25rem;font-weight:600;color:#242424}
.wt-bs-c .wt-ro{font-size:.8rem;color:#555;font-weight:400}
.wt-print{display:grid;gap:12px;grid-template-columns:minmax(200px,250px) 1fr}
@media (max-width:760px){.wt-print{grid-template-columns:1fr}.wt-print .wt-prev{order:-1}}   /* pe ecran îngust: paginile întâi, setările dedesubt */
.wt-set{display:grid;gap:6px;align-content:start;font-size:.84rem}
.wt-set .wt-h{font-weight:600;font-size:.95rem;margin-top:6px}
.wt-set button,.wt-set .wt-cb{min-height:36px;border:1px solid #C8C8C8;background:#fff;color:#242424;border-radius:4px;font:inherit;font-size:.82rem;text-align:left;padding:3px 8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:6px}
.wt-set .wt-print-bt{width:84px;height:66px;flex-direction:column;justify-content:center;border-color:#BDBDBD}
.wt-set .wt-rand{display:flex;gap:10px;align-items:center}
.wt-set .wt-mic{font-size:.74rem;color:#555;display:block}
.wt-set a,.wt-set .wt-link{color:#185ABD;text-decoration:underline;background:none;border:0;min-height:32px;padding:0;justify-content:flex-start}
.wt-print>*{min-width:0}
.wt-prev{background:#E9E9E9;border:1px solid #D0D0D0;padding:10px;min-width:0;display:flex;flex-direction:column;gap:8px;overflow-x:auto}
.wt-foi{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:flex-start}
.wt-foaie{background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.25);position:relative;overflow:hidden;flex:0 0 auto}
.wt-foaie .wt-scala{position:absolute;left:0;top:0;transform-origin:0 0}
.wt-foaie .wt-zona{position:absolute;overflow:hidden}
.wt-txt{padding:0!important;margin:0;min-height:0;border:0;box-shadow:none;background:transparent;color:#111;font-size:16px}
.wt-txt .wf-p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;color:#111;min-height:1em}
.wt-txt .wf-p span{white-space:pre-wrap}
.wt-txt .wo-tab{display:inline-block;width:2.2em}
.wt-nav{display:flex;align-items:center;justify-content:center;gap:8px;font-size:.84rem;color:#242424}
.wt-nav button{min-width:36px;min-height:36px;border:1px solid #C8C8C8;background:#fff;border-radius:4px;cursor:pointer;font-size:1rem}
.wt-nav .wt-nr{display:inline-block;min-width:28px;padding:4px 6px;border:1px solid #C8C8C8;background:#fff;text-align:center}
.wt-bs .wt-nota{min-height:1.2em;margin:6px 0 0;font-size:.86rem;color:#8A1F11}
.wt-bs .hint{font-size:.8rem;color:#555}
`;document.head.appendChild(s);
}

/* ---------- simulatorul ---------- */
function efectiv(st){const d=clone(st.doc);if(st.pend){const p=d[Math.min(st.cur.b,d.length-1)];const o=Math.min(st.cur.o,p.t.length);
  const F=Object.assign({},st.tf||(o>0?p.f[o-1]:p.t.length?p.f[0]:p.mf));   // literele tastate, încă netrimise, cu formatarea de la cursor
  p.t=p.t.slice(0,o)+st.pend+p.t.slice(o);p.f.splice(o,0,...Array.from({length:st.pend.length},()=>Object.assign({},F)))}return d}
const amprenta=d=>JSON.stringify(d.map(p=>[p.t,p.pf,p.f.map(f=>[baza(f.font),f.sz,f.b,f.i,f.u,f.col])]));
const textul=d=>d.map(p=>p.t);
const litere=d=>d.map(p=>p.t).join('').replace(/\s+/g,'');

function testeaza(Q,doc,x){
  const T=[],add=(ce,ok,cum)=>T.push({ce,ok:!!ok,cum:cum||''});
  const tinta=Q.tinta?WF.mk(Q.tinta):null;
  (Q.verif||[]).forEach(v=>{
    if(v.pil){add(v.ce,x.pil,v.cum||(ecranMic()?'Pornește semnele: atinge tasta <b>¶</b> de sub fereastră, lângă caseta de tastare (face ce face butonul ¶ din panglică).'
      :'Pornește semnele: fila <b>Pornire (Home)</b>, grupul <b>Paragraf (Paragraph)</b>, butonul <b>¶</b> (Show All); merge și tasta <b>¶</b> de sub fereastră.'));return}
    if(v.fara){const L=[].concat(v.fara);for(const n of L){const m=incalca(doc,n);if(m){add(v.ce,false,v.cum||m);return}}add(v.ce,true);return}
    if(v.paragraf!=null){
      const p=doc.find(q=>q.t===v.paragraf),q2=p||doc.find(q=>q.t.trim()===v.paragraf);
      if(!q2){const parte=doc.find(q=>q.t.trim().length>=8&&(v.paragraf.startsWith(q.t.trim())||v.paragraf.endsWith(q.t.trim())));
        add(v.ce,false,v.cum||(parte?`Paragraful ${scurt(v.paragraf)} e încă rupt: ${scurt(parte.t)} e un paragraf separat. Pornește ¶: la capătul rândului din mijlocul propoziției e un ¶. Dă un clic la începutul rândului de sub el și apasă ⌫; dacă două cuvinte se lipesc, apasă bara de spațiu între ele.`
          :`Nu găsesc paragraful ${scurt(v.paragraf)} scris exact așa. Verifică literele și spațiile; te-ai încurcat? Ctrl+Z sau „Ia-o de la capăt”.`));return}
      if(!p){add(v.ce,false,v.cum||`Paragraful ${scurt(v.paragraf)} are încă spații în față sau la capăt (le vezi ca puncte ·). Șterge-le.`);return}
      if(v.al&&p.pf.al!==v.al){add(v.ce,false,v.cum||`Paragraful ${scurt(v.paragraf)} e ${AL_RO[p.pf.al]}; trebuie ${AL_RO[v.al]}. Dă un clic în el și apasă ${AL_BTN[v.al]}.`);return}
      add(v.ce,true);return}
    if(v.paragrafe!=null){add(v.ce,doc.length===v.paragrafe,v.cum||`Documentul are ${doc.length} ${doc.length===1?'paragraf':'paragrafe'}; trebuie ${v.paragrafe}. Pornește ¶ și numără semnele ¶.`);return}
    if(v.fonturiDe){const o=v.fonturiDe,set=new Set();doc.slice((o.dela||1)-1).forEach(p=>p.t.split('').forEach((c,k)=>{if(c.trim())set.add(baza(p.f[k].font))}));
      add(v.ce,set.size<=(o.max||1),v.cum||`Textul de sub titlu are ${set.size} fonturi: ${[...set].map(esc).join(', ')}. Dă un clic în paragraful scris cu fontul bun: caseta <b>Font</b> îți arată numele lui. Apoi selectează paragraful cu alt font (trage peste el) și alege același font din caseta Font.`);return}
    if(v.fmt){const o=v.fmt,p=doc.find(q=>q.t.includes(o.text));if(!p){add(v.ce,false,v.cum||`Nu găsesc „${esc(o.text)}” în document.`);return}
      const a=p.t.indexOf(o.text);let rau=null;for(let k=a;k<a+o.text.length&&!rau;k++){if(!p.t[k].trim())continue;const f=p.f[k];
        if(o.b!=null&&!!f.b!==!!o.b)rau=o.b?'nu e aldin (B)':'e aldin';else if(o.sz!=null&&f.sz!==o.sz)rau=`are ${String(f.sz).replace('.',',')} pt, nu ${o.sz} pt`;else if(o.font&&baza(f.font)!==baza(o.font))rau=`are fontul ${esc(f.font)}, nu ${esc(o.font)}`}
      add(v.ce,!rau,v.cum||`„${esc(o.text)}” ${rau}. Selectează-l și schimbă-l din grupul <b>Font</b>.`);return}
    if(v.tinta){if(!tinta){add(v.ce,true);return}const a=textul(doc),b=textul(tinta);
      if(a.join('\n')===b.join('\n')){add(v.ce,true);return}
      let msg;if(a.length!==b.length)msg=`Documentul are ${a.length} paragrafe; anunțul reparat are ${b.length}. Pornește ¶ și caută rândurile goale sau ¶ din mijlocul unei propoziții.`;
      else{const i=a.findIndex((t,k)=>t!==b[k]),s=a[i],t=b[i];let k=0;while(k<s.length&&k<t.length&&s[k]===t[k])k++;
        const A=Math.max(0,k-10);msg=`În paragraful ${scurt(t)} e ceva diferit: la „${arata(s.slice(A,k+8))}” trebuie „${arata(t.slice(A,k+8))}”.`}
      /* cumDaca:{text, cum}: mesajul anume se arată DOAR cât timp greșeala lui e în document (judecătorul 3, P1: la „5,··6”
         mesajul „apasă bara de spațiu” ar fi adăugat al treilea spațiu); altfel, diferența găsită */
      if(v.cumDaca&&a.join('\n').includes(v.cumDaca.text))msg=v.cumDaca.cum;else if(v.cum&&!v.cumDaca)msg=v.cum;
      add(v.ce,false,msg);return}
    if(v.textPastrat){add(v.ce,!tinta||litere(doc)===litere(tinta),v.cum||'Ai șters sau ai adăugat litere ori semne: azi repari doar spațiile, Enter-urile și aspectul. Apasă Ctrl+Z sau „Ia-o de la capăt”.');return}
    if(v.previzualizare){add(v.ce,x.previz===amprenta(doc),v.cum||(x.previz?'Ai schimbat documentul după ultima previzualizare. Deschide-o din nou (Ctrl+P sau <b>File</b> › <b>Print</b>) și uită-te la pagină.':'Deschide previzualizarea: <b>Ctrl+P</b> sau <b>File</b> › <b>Print</b> (Fișier › Imprimare). Uită-te la pagină, apoi întoarce-te cu ← sau Esc.'));return}
    if(v.pagini!=null){const n=x.pagini();add(v.ce,n===v.pagini,v.cum||`Documentul are acum ${n} pagini (în previzualizare: „1 of ${n}”); trebuie ${v.pagini}. Pornește ¶ și caută rândurile goale făcute cu Enter.`);return}
  });
  return T;
}

let NR=0;
function render(Q,body,api){
  stil();
  const Q2=Object.assign({},Q,{t:'wordfmt',verif:[],unelte:Q.unelte||['caractere','paragraf','text']});
  const fals={innerHTML:''};
  WF.render(Q2,body,Object.assign({},api,{checkButton:()=>fals,revealButton:()=>{},resolve:()=>{},giveUp:()=>{}}));
  const wo=body.querySelector('.wo');wo.classList.add('wt');
  const id='wt'+(++NR);
  let previz=null,bs=null,pagCur=0,marit=false;
  const X={get pil(){return !!body._wf.stare().pil},get previz(){return previz},pagini:()=>masoara(body.querySelector('.wo-doc')).pagini};
  if(Q.previz!==false){
    const leg=document.createElement('p');leg.className='hint wt-leg';
    leg.innerHTML='Previzualizarea: <b>Ctrl+P</b> sau <b>Fișier (File)</b> › <b>Imprimare (Print)</b>. Înapoi în document: săgeata ← din stânga-sus sau <b>Esc</b>.';
    const l0=wo.querySelector('.wo-leg');if(l0)l0.after(leg);
    const kb=wo.querySelector('.wo-kbd');if(kb){const b=document.createElement('button');b.type='button';b.className='wo-k';b.dataset.wt='ctrlp';b.textContent='Ctrl+P';b.setAttribute('aria-label','Ctrl+P, previzualizarea (Print)');kb.insertBefore(b,kb.querySelector('.wo-kh'))}
  }
  /* tasta ¶ de sub fereastră: face exact ce face butonul ¶ (Show All) din panglică, pe care îl apasă */
  {const kb=wo.querySelector('.wo-kbd');if(kb){const b=document.createElement('button');b.type='button';b.className='wo-k wt-k-pil';b.dataset.wt='pil';b.textContent='¶';
    b.title='Afișare/Ascundere ¶ (Show All): ca butonul ¶ din panglică, grupul Paragraf (Paragraph)';b.setAttribute('aria-label','Butonul ¶, Afișare/Ascundere ¶ (Show All)');b.setAttribute('aria-pressed','false');
    kb.insertBefore(b,kb.querySelector('.wo-in')?kb.querySelector('.wo-in').nextSibling:kb.firstChild)}}
  const bsEl=document.createElement('div');bsEl.className='wt-bs';bsEl.setAttribute('role','region');bsEl.setAttribute('aria-label','Fila File (Fișier) din Word');
  const pag=wo.querySelector('.wo-pag');pag.before(bsEl);
  const teste=document.createElement('ul');teste.className='wo-teste wt-teste';teste.setAttribute('aria-label','Testele sarcinii');
  wo.querySelector('.wo-teste').after(teste);
  const inp=wo.querySelector('.wo-in');

  function desenTeste(){const T=testeaza(Q,efectiv(body._wf.stare()),X);
    teste.innerHTML=T.map(t=>`<li class="${t.ok?'ok':''}"><span class="ic" aria-hidden="true">${t.ok?'✔':'○'}</span><span>${esc(t.ce)}${t.ok?'<span class="sr-only"> — gata</span>':''}</span></li>`).join('')}
  /* Cu ¶ pornit, Word arată · imediat ce tastezi un spațiu; editorul din wordobj-formatare.js desenează literele încă
     netrimise („în așteptare”) fără puncte. Aici le punem punctul, ca elevul să-și vadă spațiul pe loc. */
  function puncteInAsteptare(){if(!body._wf.stare().pil)return;wo.querySelectorAll('.wo-doc .wo-pend').forEach(sp=>{
    if(sp.querySelector('.wt-pd')||!/ /.test(sp.textContent))return;sp.innerHTML=esc(sp.textContent).replace(/ /g,'<span class="wt-pd wf-pil">·</span>')})}
  const tastaPil=()=>{const b=wo.querySelector('.wt-k-pil');if(b)b.setAttribute('aria-pressed',String(!!body._wf.stare().pil))};
  let rafT=0;const programeaza=()=>{if(rafT)return;rafT=requestAnimationFrame(()=>{rafT=0;puncteInAsteptare();desenTeste();fisier();tastaPil()})};
  /* fila File: în wordobj-formatare.js e un simplu <span>; aici se deschide, ca în Word */
  function fisier(){wo.querySelectorAll('.pg-fisier').forEach(s=>{if(s.dataset.wt)return;s.dataset.wt='1';s.setAttribute('role','button');s.tabIndex=0;
    s.setAttribute('aria-label','File (Fișier)');s.title='Fișier (File): Imprimare (Print) și comenzile pentru tot documentul'})}
  const obs=new MutationObserver(programeaza);
  obs.observe(wo.querySelector('.wo-doc'),{childList:true,subtree:true,characterData:true});
  obs.observe(wo.querySelector('.wo-rb'),{childList:true,subtree:true});

  /* ---------- fila File (backstage) ---------- */
  const NAV=[['back','←','Înapoi (Back)'],['home','Home','Pornire'],['new','New','Nou'],['open','Open','Deschidere'],['sep'],['info','Info','Informații'],['save','Save','Salvare'],['saveas','Save As','Salvare ca'],['history','History','Istoric'],['print','Print','Imprimare'],['share','Share','Partajare'],['export','Export','Export'],['close','Close','Închidere'],['sep'],['account','Account','Cont'],['options','Options','Opțiuni']];
  function deschide(pagina){bs=pagina;pagCur=0;marit=false;wo.classList.add('wt-bs-deschis');desenBs();
    const b=bsEl.querySelector(bs==='print'?'.wt-print-bt':'[data-bs="back"]');if(b&&ultimPtr==='mouse')b.focus({preventScroll:true})}
  function inchide(){bs=null;wo.classList.remove('wt-bs-deschis');bsEl.innerHTML='';programeaza();if(ultimPtr==='mouse'&&inp&&!api.done())inp.focus({preventScroll:true})}
  function desenBs(){
    const nav=`<nav class="wt-bs-st" aria-label="Meniul File">${NAV.map(([k,n,ro])=>k==='sep'?'<span class="wt-sep"></span>':`<button type="button" data-bs="${k}" class="${k==='back'?'wt-inapoi':''}${bs===k?' on':''}" title="${esc(ro)} (${esc(n==='←'?'Back':n)})" aria-label="${esc(n==='←'?'Back, înapoi în document':n+', '+ro)}">${esc(n)}</button>`).join('')}</nav>`;
    let c;
    if(bs==='print'){
      const m=masoara(wo.querySelector('.wo-doc')),n=m.pagini;if(pagCur>=n)pagCur=n-1;
      previz=amprenta(efectiv(body._wf.stare()));
      const lat=Math.max(160,Math.min(bsEl.clientWidth-60,marit?PAG.w:400)),s=Math.min(1,(marit?Math.max(lat,PAG.w*0.75):Math.min(lat,n>1?lat/2-10:lat))/PAG.w);
      const foaie=k=>{const cl=m.clona.cloneNode(true);return `<div class="wt-foaie" style="width:${(PAG.w*s).toFixed(1)}px;height:${(PAG.h*s).toFixed(1)}px" aria-label="Pagina ${k+1} din ${n}"><div class="wt-scala" style="width:${PAG.w}px;height:${PAG.h}px;transform:scale(${s.toFixed(4)})"><div class="wt-zona" style="left:${PAG.m}px;top:${PAG.m}px;width:${(PAG.w-2*PAG.m).toFixed(1)}px;height:${TXT_H.toFixed(1)}px"><div style="position:relative;top:${(-k*TXT_H).toFixed(1)}px">${cl.outerHTML}</div></div></div></div>`};
      const arat=marit?[pagCur]:(n>1?[pagCur,Math.min(pagCur+1,n-1)].filter((v,i,a)=>a.indexOf(v)===i):[0]);
      c=`<h4>Print <span class="wt-ro">(Imprimare)</span></h4><div class="wt-print">
        <div class="wt-set">
          <div class="wt-rand"><button type="button" class="wt-print-bt" data-wt="tipar" aria-label="Print, tipărește"><span aria-hidden="true">🖨</span>Print</button><label>Copies: <span class="wt-nr" style="display:inline-block;min-width:30px;padding:3px 6px;border:1px solid #C8C8C8;background:#fff">1</span></label></div>
          <div class="wt-h">Printer</div><button type="button" class="wt-cb" data-wt="setare"><span>(imprimanta calculatorului)</span><span aria-hidden="true">▾</span></button><button type="button" class="wt-link" data-wt="setare">Printer Properties</button>
          <div class="wt-h">Settings</div>
          <button type="button" class="wt-cb" data-wt="setare"><span>Print All Pages<span class="wt-mic">The whole thing</span></span><span aria-hidden="true">▾</span></button>
          <label class="wt-rand">Pages: <span style="flex:1;min-height:28px;border:1px solid #C8C8C8;background:#fff"></span></label>
          <button type="button" class="wt-cb" data-wt="setare"><span>Collated<span class="wt-mic">1,2,3 &nbsp; 1,2,3 &nbsp; 1,2,3</span></span><span aria-hidden="true">▾</span></button>
          <button type="button" class="wt-cb" data-wt="setare"><span>Portrait Orientation</span><span aria-hidden="true">▾</span></button>
          <button type="button" class="wt-cb" data-wt="setare"><span>Normal Margins<span class="wt-mic">Top: 2,5 cm Bottom: 2,5 cm…</span></span><span aria-hidden="true">▾</span></button>
          <button type="button" class="wt-cb" data-wt="setare"><span>1 Page Per Sheet</span><span aria-hidden="true">▾</span></button>
          <button type="button" class="wt-link" data-wt="setare">Page Setup</button>
        </div>
        <div class="wt-prev" aria-label="Previzualizarea: paginile cum ies pe hârtie">
          <div class="wt-foi">${arat.map(foaie).join('')}</div>
          <div class="wt-nav"><button type="button" data-wt="pag-" aria-label="Previous Page, pagina anterioară"${pagCur<=0?' disabled':''}>◀</button><span class="wt-nr">${pagCur+1}</span> of ${n}<button type="button" data-wt="pag+" aria-label="Next Page, pagina următoare"${pagCur>=n-1?' disabled':''}>▶</button>
            <button type="button" data-wt="zoom" aria-label="${marit?'Micșorează pagina':'Mărește pagina'}" title="${marit?'Micșorează':'Mărește'}" style="min-width:auto;padding:0 10px;font-size:.82rem">${marit?'Micșorează':'Mărește'}</button></div>
          <p class="hint" style="margin:0">Așa iese pe hârtie: fără semnele ¶ și ·. Jos, „${pagCur+1} of ${n}” = pagina ${pagCur+1} din ${n}.</p>
        </div></div>
        <p class="hint">Simulator: setările nu se schimbă, iar Print nu tipărește. În Word, paginile sunt în dreapta, iar setările în stânga.</p>`;
    }else if(bs==='home')c=`<h4>Home <span class="wt-ro">(Pornire)</span></h4><p class="hint">În Word, aici sunt <b>New</b> (Nou) și fișierele deschise de curând. Previzualizarea e la <b>Print</b> (Imprimare), în lista din stânga.</p>`;
    else c=`<h4>${esc((NAV.find(z=>z[0]===bs)||[])[1]||'')}</h4><p class="hint">Pagina asta e și în Word, dar în simulator nu e. Aici folosești <b>Print</b> (Imprimare) sau te întorci cu ←.</p>`;
    bsEl.innerHTML=nav+`<div class="wt-bs-c">${c}<p class="wt-nota" aria-live="polite"></p></div>`;
    programeaza();
  }
  const nota=h=>{const n=bsEl.querySelector('.wt-nota');if(n)n.innerHTML=h};
  bsEl.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||!bsEl.contains(b))return;
    if(b.dataset.bs){const k=b.dataset.bs;if(k==='back'){inchide();return}bs=k;desenBs();const f=bsEl.querySelector(`[data-bs="${k}"]`);if(f&&ultimPtr==='mouse')f.focus({preventScroll:true});return}
    const w=b.dataset.wt;
    if(w==='tipar'){nota('În simulator nu se tipărește nimic. În laborator apeși <b>Print</b> doar dacă ți-a cerut profesorul: altfel consumi hârtie degeaba.');return}
    if(w==='setare'){nota('În simulator setările nu se schimbă. Azi te uiți doar la pagină, în dreapta.');return}
    if(w==='pag-'){pagCur=Math.max(0,pagCur-1);desenBs();return}
    if(w==='pag+'){pagCur++;desenBs();return}
    if(w==='zoom'){marit=!marit;desenBs();return}
  });
  let ultimPtr='mouse';
  wo.addEventListener('pointerdown',e=>{ultimPtr=e.pointerType||'mouse'},true);
  /* Ocolire (defect al editorului din wordobj-formatare.js, semnalat proprietarului): literele tastate stau „în așteptare”
     până la următoarea comandă; un clic le trimite în document, dar caută locul clicului pe desenul VECHI, deci în același
     paragraf, după literele tastate, cursorul ajungea cu atâtea litere mai la stânga (proba_ui_l08.py: „la  Târgul” ->
     ⌫ ștergea „a”). Aici, înainte de clic, trimitem tastarea cu Ctrl+Y (în editor: întâi trimite tastarea, apoi n-are ce
     reface) și editorul se redesenează; clicul lui găsește apoi desenul nou. Nu schimbă nimic din ce vede elevul. */
  wo.querySelector('.wo-doc').addEventListener('pointerdown',()=>{
    const st=body._wf.stare();if(!st.pend||api.done()||!inp)return;
    inp.dispatchEvent(new KeyboardEvent('keydown',{key:'y',ctrlKey:true,bubbles:true,cancelable:true}));
  },true);
  /* clic pe File, Ctrl+P (tastele adevărate), butonul Ctrl+P de pe telefon, Esc în fila File */
  wo.addEventListener('click',e=>{
    if(e.target.closest('.pg-fisier')){e.preventDefault();e.stopPropagation();deschide('home');return}
    if(e.target.closest('[data-wt="ctrlp"]')){e.preventDefault();deschide('print');return}
    if(e.target.closest('[data-wt="pil"]')){e.preventDefault();if(api.done())return;const r=wo.querySelector('.wo-rb [data-wf="pil"]');if(r)r.click();tastaPil();if(ultimPtr==='mouse'&&inp)inp.focus({preventScroll:true})}
  },true);
  wo.addEventListener('keydown',e=>{
    if(e.target.closest&&e.target.closest('.pg-fisier')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();deschide('home')}
  },true);
  /* Ctrl+P și Esc în TOATĂ pagina, cât e exercițiul pe ecran (focusul poate fi pe pagină, după „Pasul următor →”) */
  const tasteGlobale=e=>{
    if(!document.body.contains(wo)){document.removeEventListener('keydown',tasteGlobale,true);return}
    if(!wo.offsetParent&&!bs)return;
    if(bs&&e.key==='Escape'){e.preventDefault();e.stopPropagation();inchide();return}
    if((e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&(e.key==='p'||e.key==='P'||e.code==='KeyP')){e.preventDefault();e.stopPropagation();deschide('print')}
  };
  document.addEventListener('keydown',tasteGlobale,true);
  window.addEventListener('resize',()=>{if(bs==='print')desenBs()});

  const nav=api.checkButton(()=>{
    if(bs)inchide();
    const T=testeaza(Q,efectiv(body._wf.stare()),X),bad=T.filter(t=>!t.ok);desenTeste();
    if(!bad.length){nav.innerHTML='';api.resolve(true);return}
    api.resolve(false,`${T.length-bad.length} din ${T.length} teste trecute. ${bad[0].cum}`);
    if(ultimPtr==='mouse'&&inp)inp.focus({preventScroll:true});   // regula 14: focusul înapoi în document
    api.revealButton(()=>{pune(body,Q,true);nav.innerHTML='';api.giveUp('documentul arată acum ca în sarcină. Pornește ¶ și compară-l cu ce aveai.')});
  });
  body._wt={setPreviz:v=>{previz=v},amprenta:()=>amprenta(efectiv(body._wf.stare())),desen:desenTeste,pagini:()=>X.pagini(),deschis:()=>bs};
  fisier();desenTeste();
}
/* pune documentul reparat (sau greșeala tipică), cu ¶ pornit și previzualizarea făcută, pentru poartă și „Arată-mi” */
function pune(body,Q,bun){
  const doc=WF.mk(bun?(Q.tinta||Q.start):(Q.tipic||Q.start));
  body._wf.set(doc,{log:[]});
  const vrea=bun&&(Q.verif||[]).some(v=>v.pil);
  if(vrea&&!body._wf.stare().pil){const b=body.querySelector('[data-wf="pil"]');if(b)b.click()}
  if(body._wt){if(bun)body._wt.setPreviz(body._wt.amprenta());else body._wt.setPreviz(null);body._wt.desen()}
}
G.TipWordTehno={
  render,
  rezolva(Q,body){pune(body,Q,true)},
  gresit(Q,body){pune(body,Q,false)},
  teste:testeaza,REG
};
})(typeof window!=='undefined'?window:globalThis);
