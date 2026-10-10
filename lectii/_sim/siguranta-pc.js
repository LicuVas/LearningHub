/* Simulatorul „siguranta-pc” pentru lecțiile LearningHub — fișier comun (lectii/_sim/siguranta-pc.js).
   PROPRIETAR: autorul lecției VI · M2 · nr. 11 („Măsuri de siguranță în utilizarea Internetului. Programele antivirus”),
   tura 10→11.10.2026. Extensie NOUĂ: nu modifică niciun simulator existent și nu trimite nimic spre exterior.

   Folosire (după motor.js):
     <script src="../../_sim/siguranta-pc.js"></script>
     JocMotor.porneste({ …, tipuri:{fereastra:SigurantaPC.fereastra, scanare:SigurantaPC.scanare, laborator:SigurantaPC.laborator} })
   Stilul se pune singur în pagină, o singură dată, cu jetoanele motorului (--line, --paper, --paper2, --ink, --accent…).

   TIPURI
   - fereastra  : un browser cu două file; în fila activă, o pagină falsă („Ai câștigat!”, „Calculatorul tău e infectat!”).
                  Corect = închizi fila ei cu ✕ de pe filă (sau tot browserul cu ✕ din colț). Orice buton apăsat ÎN pagină
                  (inclusiv un „✕” desenat de pagină) = greșeală spusă pe loc. Fără „Verifică”: se rezolvă la închidere.
                  Q: {falsa:'premiu'|'virus'|'descarca'}
   - scanare    : File Explorer cu „Acest PC” (Disc local (C:), STICK (E:)) și „Descărcări”; clic dreapta (pe telefon: ții
                  degetul apăsat sau butonul ⋯) → meniul Windows 11 → „Afișați mai multe opțiuni” → „Scanați cu Microsoft
                  Defender...” → fereastra Securitate Windows cu rezultatul; în căsuța „Răspunsul tău” scrii câte amenințări a găsit.
                  Q: {tinta:'E:'|'<nume fișier>', start:'PC'|'Desc', fisiere?:{'E:':[…], 'Desc':[…]}, teste:[…]}
   - laborator  : calculatorul întreg: browserul (cu fila falsă), Explorer și Securitate Windows, cu bara de activități;
                  testele sarcinii se bifează pe loc. Q: {falsa, teste:[…], fisiere?}
   Testele (Q.teste, câte {c, v?, ce, ajutor?}): c = 'falsaInchisa' (fila falsă închisă FĂRĂ niciun clic în pagină),
     'scanatInainte' (v = 'E:' (implicit) sau numele unui fișier din Descărcări: ținta scanată ÎNAINTE de deschidere; la stick,
       înainte de primul fișier deschis de pe el — ORDINEA se ține minte cu un ceas al simulatorului; judecata 1, GRAV-1),
     'niciunProgram' (niciun fișier cu Tip: Aplicație pornit, nici înainte, nici după scanare),
     'nr' (în căsuța „Răspunsul tău” scrie numărul de amenințări găsite; se acceptă „0”, „0 amenințări”, „0 amenintari
       gasite.”, „zero”, „nicio amenințare”: primul număr din text sau cuvântul pentru zero — regula 23),
     'deschisFaraProgram' (v = [fișierul de deschis, programul de NEpornit]),
     'scanat' (v = ținta; doar „s-a scanat”, fără ordine — păstrat pentru alte lecții; lecția VI/11 NU îl mai folosește).
   Un fișier deschis înainte să fie verificat (el sau stickul lui) dă pe loc mesajul „Ai deschis … înainte să-l verifici”, iar
   „Ia-o de la capăt” golește tot.

   CE E ADEVĂRAT AICI (probat pe Windows 11 25H2 în română, 10-11.10.2026; dovezile în lectii/vi/m2-l11/_proba/):
   - comanda din meniul clasic de clic dreapta: șirul 101 din shellext.dll.mui (ro-RO) = „Scanați cu $(BrandName)...”;
     pagina Microsoft ro-ro „Rămâneți protejat cu aplicația Securitate Windows”: „Scanați cu Microsoft Defender”;
   - „Afișați mai multe opțiuni” (Windows.UI.FileExplorer.dll, șirul 51792; extras de autorul lecției V/10);
   - textele din Securitate Windows (resources.pri al aplicației, ro-RO): „Amenințări curente”, „Momentan nu există
     amenințări.”, „Ultima scanare: %1 (%2)”, „(scanare particularizată)”, „%1!d! amenințări găsite.”, „%1!ld! fișiere scanate.”,
     „Scanare particularizată”; captura jocuri/internet-vi/img/antivirus-scanare.webp arată aceleași rânduri la o scanare rapidă;
   - scanarea unui dosar fără probleme se termină fără amenințări (MpCmdRun -Scan -ScanType 3: „found no threats”, 0,2 s);
   - „Acest PC”, „Dispozitive și unități”, „Disc local (C:)”, Tip „Folder de fișiere”, „Microsoft Word Document” (Office în
     engleză), extensiile ASCUNSE implicit (simulatorul explorer-citire al lecției V/9); „Descărcări” (jocul documentare-v);
   - fila se închide cu ✕ de pe ea sau Ctrl+W; fereastra cu ✕ / Alt+F4 (paginile de ajutor Microsoft Edge și Google Chrome);
   - Tip-urile din File Explorer (AssocQueryString, ro-RO, lectii/vi/m2-l11/_proba/proba_tip_assoc.json): .exe „Aplicație”,
     .msi „Pachet pentru Windows Installer”, .bat „Fișier batch Windows”, .scr „Economizor ecran”, .txt „Fișier TXT”.
   ABATERI de la calculatorul adevărat, spuse elevului pe ecran (rândul de sub calculator și, la browser, cel de deasupra):
   - meniurile au doar câteva comenzi; „Proprietăți” și „Copiere” nu fac nimic aici;
   - un fișier deschis nu pornește aplicația: un mesaj spune ce s-ar întâmpla; ferestrele stau una peste alta, ca maximizate;
   - în bara de adresă doar citești; nu există Start, butoane de micșorare, filă nouă;
   - Ctrl+W NU se folosește în pagină: ar închide chiar lecția (browserul nu lasă pagina să oprească scurtătura). Plasă de
     siguranță: cât o filă falsă e deschisă în simulator, pagina cere browserului întrebarea „părăsești site-ul?” (beforeunload),
     ca un Ctrl+W apăsat totuși să nu închidă lecția fără întrebare;
   - scanarea găsește mereu 0 amenințări (singurul rezultat probat; fereastra cu amenințări găsite nu e desenată);
   - rândul „Scanarea a durat …” al ferestrei adevărate lipsește; în locul lui, o notă spune că pe calculator apare și durata;
   - pe telefon: meniul se deschide ținând degetul apăsat pe element sau cu butonul ⋯; deschizi atingând de două ori.
   FOCUSUL (regula 14): după scanare → căsuța „Răspunsul tău” (cu mouse/tastatură) sau rezultatul (la atingere, ca să nu
   sară tastatura telefonului); după un Verifică greșit → locul primului test care pică (căsuța, „Ia-o de la capăt”, stickul);
   după ✕ pe fila falsă → fila lecției din simulator (nu se pierde pe pagină).

   PENTRU ALTE LECȚII: SigurantaPC.{fereastra, scanare, laborator} + SigurantaPC._intern.{CHK, init, FALSE, FISIERE, rezolvat, nrCitit}.
   Nu schimba textele probate de mai sus fără o probă nouă; adaugă pagini false noi în FALSE și teste noi în CHK. */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const strip=s=>String(s||'').replace(/<[^>]+>/g,'');

function stil(){
  if(document.getElementById('spc-stil'))return;
  const st=document.createElement('style');st.id='spc-stil';
  st.textContent=`
.spc{border:1px solid var(--line);border-radius:10px;background:var(--paper2);font-family:var(--fb);color:var(--ink);overflow:hidden}
.spc *{box-sizing:border-box}
.spc button{font:inherit;color:inherit}
.spc-ecran{padding:8px;display:flex;flex-direction:column;gap:8px;min-height:250px}
.spc-win{border:1px solid var(--line);border-radius:8px;background:var(--paper);overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.spc-tb{display:flex;align-items:center;gap:6px;background:var(--paper2);padding:3px 4px 3px 10px;border-bottom:1px solid var(--line);min-height:40px}
.spc-tit{flex:1;font-weight:600;font-size:.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.spc-x,.spc-b{min-height:36px;min-width:36px;border:1px solid transparent;border-radius:6px;background:transparent;cursor:pointer;padding:0 8px;touch-action:manipulation}
.spc-x:hover,.spc-b:hover{background:var(--sel)}
.spc-x:focus-visible,.spc-b:focus-visible,.spc-it:focus-visible,.spc-fila:focus-visible,.spc-mi:focus-visible{outline:3px solid var(--accent);outline-offset:1px}
.spc-x.win:hover{background:#C42B1C;color:#fff}
/* browserul */
.spc-file{display:flex;align-items:flex-end;gap:2px;background:var(--paper2);padding:4px 4px 0;border-bottom:1px solid var(--line);min-height:44px}
.spc-fila{display:flex;align-items:center;gap:2px;max-width:46%;min-width:0;border:1px solid var(--line);border-bottom:0;border-radius:8px 8px 0 0;background:var(--desk);padding:0 0 0 8px;min-height:38px;cursor:pointer}
.spc-fila.on{background:var(--paper)}
.spc-fila .ft{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.88rem}
.spc-fila .spc-x{min-width:34px;min-height:34px;font-size:.9rem}
.spc-file .gol{flex:1}
.spc-adr{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--line);font-family:var(--fm);font-size:.82rem;color:var(--ink2);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.spc-adr span{overflow:hidden;text-overflow:ellipsis}
.spc-pag{padding:14px;min-height:190px;position:relative}
.spc-pag.lectie{color:var(--ink2)}
.spc-falsa{max-width:440px;margin:0 auto;border:3px solid #C8102E;border-radius:10px;background:#FFF4D6;color:#3A0A0A;padding:14px 14px 12px;position:relative;box-shadow:0 6px 18px rgba(0,0,0,.25)}
.spc-falsa.virus{background:#FFE5E5}
.spc-falsa .fx{position:absolute;top:4px;right:4px;min-width:34px;min-height:34px;border:1px solid #C8102E;border-radius:6px;background:#fff;color:#C8102E;font-weight:700;cursor:pointer}
.spc-falsa h4{margin:0 34px 6px 0;font-size:1.15rem;color:#B00020;letter-spacing:.02em}
.spc-falsa p{margin:.35em 0;font-size:.95rem}
.spc-falsa .fb{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.spc-falsa .fb button{min-height:40px;padding:0 16px;border-radius:6px;border:0;background:#B00020;color:#fff;font-weight:700;cursor:pointer}
.spc-falsa .fb button.gri{background:#6B6B6B}
.spc-inchis{padding:16px;color:var(--ink2);font-style:italic}
/* Explorer */
.spc-ex-bara{display:flex;align-items:center;gap:4px;padding:4px 6px;border-bottom:1px solid var(--line)}
.spc-ex-cale{flex:1;min-width:0;border:1px solid var(--line);border-radius:6px;padding:6px 8px;font-size:.88rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.spc-ex-corp{display:flex;min-height:170px}
.spc-ex-nav{width:132px;flex:0 0 132px;border-right:1px solid var(--line);padding:6px 4px;display:flex;flex-direction:column;gap:2px}
.spc-ex-nav .spc-b{text-align:left;font-size:.88rem}
.spc-ex-nav .spc-b.on{background:var(--sel)}
.spc-ex-lista{flex:1;min-width:0;padding:6px}
.spc-ex-grup{font-size:.85rem;color:var(--ink2);margin:2px 4px 6px}
.spc-ex-cap{display:flex;font-size:.8rem;color:var(--ink2);border-bottom:1px solid var(--line);padding:2px 6px}
.spc-ex-cap span:first-child,.spc-it .n{flex:1.4;min-width:0}
.spc-ex-cap span:last-child,.spc-it .t{flex:1;min-width:0}
.spc-it{display:flex;align-items:center;gap:6px;width:100%;min-height:40px;text-align:left;border:1px solid transparent;border-radius:6px;background:transparent;padding:4px 6px;cursor:default;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;touch-action:manipulation}
.spc-it:hover{background:var(--paper2)}
.spc-it.sel{background:var(--sel);border-color:var(--accent)}
.spc-it .n,.spc-it .t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.spc-it .t{color:var(--ink2);font-size:.88rem}
.spc-it .ic{flex:0 0 22px;text-align:center}
.spc-it .more{display:none;flex:0 0 auto;min-width:36px;min-height:36px;border:1px solid var(--line);border-radius:6px;background:var(--paper);align-items:center;justify-content:center}
@media (pointer:coarse){.spc-it .more{display:inline-flex}}
.spc-unit{display:flex;align-items:center;gap:8px;min-height:48px}
.spc-meniu{margin:2px 0 6px 26px;max-width:290px;border:1px solid var(--line);border-radius:8px;background:var(--paper);box-shadow:0 6px 16px rgba(0,0,0,.18);padding:4px;display:flex;flex-direction:column}
.spc-mi{min-height:38px;text-align:left;border:0;border-radius:6px;background:transparent;padding:0 10px;cursor:pointer}
.spc-mi:hover{background:var(--sel)}
.spc-mi.sep{border-top:1px solid var(--line);border-radius:0 0 6px 6px}
.spc-meniu .rest{font-size:.78rem;color:var(--ink2);padding:2px 10px 4px}
.spc-stare{border-top:1px solid var(--line);padding:4px 8px;font-size:.82rem;color:var(--ink2);min-height:26px}
/* Securitate Windows */
.spc-sec{padding:12px 14px}
.spc-sec h4{margin:0 0 6px;font-size:1.05rem}
.spc-sec p{margin:.2em 0;font-size:.92rem}
.spc-bar{height:6px;border-radius:3px;background:var(--line);overflow:hidden;margin:8px 0;max-width:280px}
.spc-bar i{display:block;height:100%;width:40%;background:var(--accent);animation:spcmerge 1.1s linear infinite}
@keyframes spcmerge{from{margin-left:-40%}to{margin-left:100%}}
/* bara de activități */
.spc-task{display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:4px 6px;border-top:1px solid var(--line);background:var(--desk)}
.spc-task .spc-b{font-size:.85rem;border-color:var(--line);background:var(--paper)}
.spc-task .spc-b.on{border-color:var(--accent);box-shadow:inset 0 -3px 0 var(--accent)}
.spc-task .eti{font-size:.78rem;color:var(--ink2);margin-right:4px}
/* caietul, testele, notele */
.spc-caiet{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;border-top:1px dashed var(--line);background:var(--paper)}
.spc-caiet label{font-size:.92rem}
.spc-caiet input{font-size:16px;width:7em;min-height:38px;border:1px solid var(--line);border-radius:6px;padding:4px 8px;background:var(--paper);color:var(--ink)}
.spc-mesaj{padding:6px 10px;font-size:.9rem;border-top:1px solid var(--line);background:var(--paper)}
.spc-mesaj:empty{display:none}
.spc-mesaj.rau{background:var(--badbg);color:var(--bad)}
.spc-mesaj.bun{background:var(--okbg);color:var(--ok)}
.spc-teste{padding:8px 10px;border-top:1px solid var(--line);background:var(--paper)}
.spc-teste .lbl{font-size:.85rem;color:var(--ink2);margin-bottom:4px}
.spc-teste ol{margin:0;padding-left:1.2em}
.spc-teste li{margin:.15em 0;font-size:.92rem}
.spc-teste li .s{display:inline-block;width:1.3em;font-weight:700}
.spc-teste li.ok{color:var(--ok)}
.spc-teste li.rau{color:var(--bad)}
.spc-nota{font-size:.82rem;color:var(--ink2);padding:6px 10px;border-top:1px solid var(--line)}
.spc-nota.sus{border-top:0;border-bottom:1px solid var(--line);background:var(--paper)}
.spc-sec .spc-abat{font-size:.8rem;color:var(--ink2);font-style:italic;margin-top:.5em}
.spc-sec:focus-visible{outline:3px solid var(--accent);outline-offset:-3px}
.spc-reset{margin:6px 10px 8px}
@media (max-width:560px){.spc-ex-nav{display:none}.spc-fila{max-width:56%}.spc-pag{padding:10px}}
`;
  document.head.appendChild(st);
}

/* ---------------- pagini false (conținut inventat; adrese .example, care nu pot exista) ---------------- */
const FALSE={
  premiu:{fila:'FELICITĂRI! Ai câștigat!',adr:'https://castiga-premii.example/felicitari',cls:'',
    h:'FELICITĂRI!!! AI CÂȘTIGAT!',p:['Ești vizitatorul cu numărul 1.000.000. Ai câștigat o tabletă nouă!','Apasă OK în 30 de secunde, altfel premiul trece la altcineva.'],
    b:[['OK',''],['Revendică premiul','']]},
  virus:{fila:'⚠ AVERTISMENT DE SECURITATE',adr:'https://alerta-calculator.example/scanare',cls:'virus',
    h:'AVERTISMENT: calculatorul tău este infectat!',p:['Am găsit 5 viruși. Fișierele tale vor fi șterse în 2 minute!','Apasă „Curăță acum” sau sună imediat la 07xx xxx xxx.'],
    b:[['Curăță acum',''],['Anulare','gri']]},
  descarca:{fila:'Jocul complet GRATIS',adr:'https://jocuri-gratis.example/descarca',cls:'',
    h:'Jocul complet, GRATIS!',p:['Descarcă acum programul și primești 1.000 de monede în joc.','Oferta expiră în 5 minute!'],
    b:[['DESCARCĂ GRATIS',''],['Mai târziu','gri']]}
};
const FILA_LECTIE={fila:'Lecția 11 · LearningHub',adr:'https://learninghub-8z6.pages.dev/lectii/vi/m2-l11/'};

/* ---------------- fișierele implicite ---------------- */
const FISIERE={
  'E:':[{n:'Tema_6A_Pop',t:'Microsoft PowerPoint Presentation',ic:'P'},{n:'joc_gratis',t:'Aplicație',ic:'▣'},{n:'Fisa_TIC',t:'Microsoft Word Document',ic:'W'}],
  'Desc':[{n:'fisa-de-lucru',t:'Microsoft Word Document',ic:'W'},{n:'program_monede',t:'Aplicație',ic:'▣'}]
};
const LOC_NUME={PC:'Acest PC','E:':'STICK (E:)',Desc:'Descărcări'};

function init(Q){
  const f=Object.assign({},FISIERE,Q.fisiere||{});
  const br=Q.t==='scanare'?null:{file:[{id:'lectie'},{id:'falsa'}],activa:'falsa'};
  return {br,brDeschis:!!br,ex:Q.t==='fereastra'?null:{loc:Q.start||'PC',sel:null,meniu:null},exDeschis:Q.t!=='fereastra',
    sec:null,secDeschis:false,activa:Q.t==='scanare'?'ex':'br',f,
    /* scanat[id] și deschisLa[id] = momentul (ceasul simulatorului) la care s-a terminat scanarea / s-a deschis prima oară */
    apasatFals:false,falsaInchisa:false,scanat:{},deschisLa:{},primaDeschidereStick:null,deschise:[],pornite:[],deschisNeverificat:false,
    nr:'',mesaj:'',mesajCls:'',ceas:0};
}
function tick(S){return ++S.ceas}
function acum(){const d=new Date(),z=n=>String(n).padStart(2,'0');return `${z(d.getDate())}.${z(d.getMonth()+1)}.${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`}
/* ce a scris elevul în căsuța „Răspunsul tău”, ca număr (regula 23: „0 amenințări”, „0.”, „zero”, „nicio amenințare” = 0) */
const fara=s=>String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim();
function nrCitit(S){
  const t=fara(S.nr);const m=t.match(/(\d+)/);if(m)return Number(m[1]);
  return /\b(nimic|zero|nicio|niciuna|nici una|nici o|niciun)\b/.test(t)?0:null;
}

/* ---------------- verificările sarcinii ---------------- */
const CHK={
  falsaInchisa:S=>S.falsaInchisa&&!S.apasatFals,
  scanat:(S,v)=>!!S.scanat[v],
  scanatInainte:(S,v)=>{v=v||'E:';const s=S.scanat[v];if(!s)return false;
    const d=v==='E:'?S.primaDeschidereStick:S.deschisLa[v];return d==null||s<d},
  niciunProgram:S=>!S.pornite.length,
  nr:S=>Object.keys(S.scanat).length>0&&nrCitit(S)===0,
  deschisFaraProgram:(S,v)=>S.deschise.includes(v[0])&&!S.deschise.includes(v[1])
};
const trece=(S,t)=>!!CHK[t.c](S,t.v);

/* ---------------- desenul ---------------- */
function htmlBrowser(S,Q){
  const fals=FALSE[Q.falsa||'premiu'];
  if(!S.brDeschis)return `<div class="spc-win" data-w="br"><div class="spc-inchis">Browserul e închis.</div></div>`;
  const file=S.br.file.map(f=>{const d=f.id==='falsa'?fals:FILA_LECTIE;const on=S.br.activa===f.id;
    return `<div class="spc-fila${on?' on':''}" role="tab" aria-selected="${on}" tabindex="0" data-a="fila" data-id="${f.id}" data-foc="fila-${f.id}" title="${esc(d.fila)}"><span class="ft">${esc(d.fila)}</span><button type="button" class="spc-x" data-a="inchideFila" data-id="${f.id}" data-foc="x-${f.id}" aria-label="Închide fila ${esc(d.fila)}" title="Închide fila">✕</button></div>`}).join('');
  const act=S.br.activa,d=act==='falsa'?fals:FILA_LECTIE;
  const pag=act==='falsa'?`<div class="spc-falsa ${fals.cls}" data-falsa="1"><button type="button" class="fx" data-a="fals" data-ce="✕ (desenat de pagină)" aria-label="✕ desenat în pagină">✕</button><h4>${esc(fals.h)}</h4>${fals.p.map(p=>`<p>${esc(p)}</p>`).join('')}<div class="fb">${fals.b.map(b=>`<button type="button" class="${b[1]}" data-a="fals" data-ce="${esc(b[0])}">${esc(b[0])}</button>`).join('')}</div></div>`
    :`<div class="spc-pag lectie"><p><b>Lecția 11.</b> Măsuri de siguranță în utilizarea Internetului.</p><p>Aici e pagina lecției tale.</p></div>`;
  return `<div class="spc-win" data-w="br"><div class="spc-file" role="tablist">${file}<span class="gol"></span><button type="button" class="spc-x win" data-a="inchideBrowser" data-foc="x-br" aria-label="Închide fereastra browserului (toate filele)" title="Închide fereastra">✕</button></div>
  <div class="spc-adr"><span>${esc(d.adr)}</span></div><div class="spc-pag">${act==='falsa'?pag:pag}</div></div>`;
}
function htmlExplorer(S,Q){
  if(!S.exDeschis)return `<div class="spc-win" data-w="ex"><div class="spc-inchis">File Explorer e închis.</div></div>`;
  const e=S.ex,loc=e.loc;
  const cale=loc==='PC'?'Acest PC':loc==='E:'?'Acest PC › STICK (E:)':'Descărcări';
  let lista='';
  const meniu=id=>{
    if(!e.meniu||e.meniu.id!==id)return '';
    if(e.meniu.fel==='scurt')return `<div class="spc-meniu" role="menu" aria-label="Meniul de clic dreapta"><button type="button" class="spc-mi" role="menuitem" data-a="mi" data-mi="deschidere" data-foc="mi-1">Deschidere</button><button type="button" class="spc-mi" role="menuitem" data-a="mi" data-mi="proprietati" data-foc="mi-2">Proprietăți</button><button type="button" class="spc-mi sep" role="menuitem" data-a="mi" data-mi="maimulte" data-foc="mi-3">Afișați mai multe opțiuni</button><div class="rest">(meniul adevărat are și alte comenzi)</div></div>`;
    return `<div class="spc-meniu" role="menu" aria-label="Meniul cu mai multe opțiuni"><button type="button" class="spc-mi" role="menuitem" data-a="mi" data-mi="deschidere" data-foc="mi-1">Deschidere</button><button type="button" class="spc-mi" role="menuitem" data-a="mi" data-mi="scan" data-foc="mi-2">Scanați cu Microsoft Defender...</button><button type="button" class="spc-mi" role="menuitem" data-a="mi" data-mi="copiere" data-foc="mi-3">Copiere</button><button type="button" class="spc-mi" role="menuitem" data-a="mi" data-mi="proprietati" data-foc="mi-4">Proprietăți</button><div class="rest">(meniul adevărat are și alte comenzi)</div></div>`;
  };
  const more=id=>`<span class="more" role="button" tabindex="-1" data-a="more" data-id="${esc(id)}" aria-label="Meniu (ca un clic dreapta)">⋯</span>`;
  if(loc==='PC'){
    lista=`<div class="spc-ex-grup">Dispozitive și unități</div>`+[['C:','Disc local (C:)','▤'],['E:','STICK (E:)','▭']].map(u=>
      `<button type="button" class="spc-it spc-unit${e.sel===u[0]?' sel':''}" data-a="it" data-id="${u[0]}" data-foc="it-${u[0]}"><span class="ic" aria-hidden="true">${u[2]}</span><span class="n">${esc(u[1])}</span>${more(u[0])}</button>${meniu(u[0])}`).join('');
  }else{
    const fs=S.f[loc]||[];
    lista=`<div class="spc-ex-cap"><span>Nume</span><span>Tip</span></div>`+fs.map(x=>
      `<button type="button" class="spc-it${e.sel===x.n?' sel':''}" data-a="it" data-id="${esc(x.n)}" data-foc="it-${esc(x.n)}"><span class="ic" aria-hidden="true">${esc(x.ic||'▢')}</span><span class="n">${esc(x.n)}</span><span class="t">${esc(x.t)}</span>${more(x.n)}</button>${meniu(x.n)}`).join('');
  }
  return `<div class="spc-win" data-w="ex"><div class="spc-tb"><span class="spc-tit">${esc(LOC_NUME[loc])}</span><button type="button" class="spc-x win" data-a="inchideEx" data-foc="x-ex" aria-label="Închide File Explorer" title="Închide">✕</button></div>
  <div class="spc-ex-bara"><button type="button" class="spc-b" data-a="inapoi" data-foc="ex-inapoi" aria-label="Înapoi" title="Înapoi"${loc==='E:'?'':' disabled'}>←</button><div class="spc-ex-cale">${esc(cale)}</div></div>
  <div class="spc-ex-corp"><div class="spc-ex-nav"><button type="button" class="spc-b${loc!=='Desc'?' on':''}" data-a="nav" data-loc="PC" data-foc="nav-pc">Acest PC</button><button type="button" class="spc-b${loc==='Desc'?' on':''}" data-a="nav" data-loc="Desc" data-foc="nav-desc">Descărcări</button></div>
  <div class="spc-ex-lista">${lista}</div></div><div class="spc-stare" aria-live="polite">${esc(e.stare||'')}</div></div>`;
}
function htmlSec(S){
  if(!S.secDeschis||!S.sec)return '';
  const s=S.sec;
  const corp=s.faza==='merge'?`<h4>Scanare particularizată</h4><div class="spc-bar" aria-hidden="true"><i></i></div><p>Se verifică: ${esc(s.numeTinta)}</p>`
    :`<h4>Amenințări curente</h4><p>Momentan nu există amenințări.</p><p>Ultima scanare: ${esc(s.ora)} (scanare particularizată)</p><p><b>0 amenințări găsite.</b></p><p>${s.nrFis} fișiere scanate.</p><p class="spc-abat">(Pe calculator, aici apare și cât a durat scanarea.)</p>`;
  return `<div class="spc-win" data-w="sec"><div class="spc-tb"><span class="spc-tit">Securitate Windows</span><button type="button" class="spc-x win" data-a="inchideSec" data-foc="x-sec" aria-label="Închide Securitate Windows" title="Închide">✕</button></div><div class="spc-sec" tabindex="-1" data-foc="sec" aria-live="polite">${corp}</div></div>`;
}
function desen(st){
  const {S,Q,root}=st;
  const foc=document.activeElement&&root.contains(document.activeElement)?document.activeElement.getAttribute('data-foc'):null;
  let ec='';
  if(Q.t==='fereastra')ec=htmlBrowser(S,Q);
  else ec=S.activa==='br'?htmlBrowser(S,Q):S.activa==='ex'?htmlExplorer(S,Q):S.activa==='sec'?htmlSec(S):'<div class="spc-inchis">Nicio fereastră deschisă. Alege una din bara de activități, de jos.</div>';
  let task='';
  if(Q.t!=='fereastra'){
    const b=[];
    if(Q.t==='laborator')b.push(['br','Browser',S.brDeschis]);
    b.push(['ex','File Explorer',S.exDeschis]);
    if(S.secDeschis)b.push(['sec','Securitate Windows',true]);
    task=`<div class="spc-task" role="toolbar" aria-label="Bara de activități"><span class="eti">Bara de activități:</span>${b.map(x=>`<button type="button" class="spc-b${S.activa===x[0]?' on':''}" data-a="task" data-w="${x[0]}" data-foc="task-${x[0]}">${esc(x[1])}${x[2]?'':' (închis)'}</button>`).join('')}</div>`;
  }
  const caiet=Q.t==='fereastra'?'':`<div class="spc-caiet"><label for="${st.uid}-nr">Răspunsul tău (scrii aici, în pagină): câte amenințări a găsit scanarea?</label><input id="${st.uid}-nr" type="text" inputmode="numeric" autocomplete="off" data-a="nr" data-foc="nr" value="${esc(S.nr)}"></div>`;
  const teste=(Q.teste||[]).length?`<div class="spc-teste"><div class="lbl">Testele sarcinii · <span class="nrt">0 din ${Q.teste.length} trec</span></div><ol>${Q.teste.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}</span></li>`).join('')}</ol></div>`:'';
  /* judecata 1, MAJOR-4: avertismentul despre Ctrl+W stă DEASUPRA browserului (la 390 px se vedea abia după fereastra falsă) */
  const sus=Q.t==='scanare'?'':'<div class="spc-nota sus">Browser simulat. Aici, în lecție, <b>nu</b> apăsa Ctrl+W: ar închide chiar lecția. Închizi cu mouse-ul (pe telefon, cu degetul).</div>';
  const nota=Q.t==='fereastra'?''
    :`<div class="spc-nota">Calculator simulat: meniurile au doar câteva comenzi, iar un fișier deschis doar spune ce s-ar întâmpla. Clic dreapta deschide meniul; pe telefon ții degetul apăsat pe element (sau atingi ⋯) și atingi de două ori ca să deschizi. Pe unele calculatoare (de exemplu cu Windows 10), Scanați cu Microsoft Defender... e direct în primul meniu.</div>`;
  const reset=Q.t==='fereastra'?'':`<button type="button" class="spc-b spc-reset" data-a="reset" data-foc="reset">Ia-o de la capăt</button>`;
  root.innerHTML=`${sus}<div class="spc-ecran">${ec}</div>${task}<div class="spc-mesaj ${S.mesajCls}" aria-live="polite">${S.mesaj}</div>${caiet}${teste}${nota}${reset}`;
  if(foc){const el=root.querySelector(`[data-foc="${CSS.escape(foc)}"]`);if(el)try{el.focus({preventScroll:true})}catch(e){}}
  upd(st,false);
}
function upd(st,arata){
  const {S,Q,root}=st;const T=Q.teste||[];if(!T.length)return [];
  const rez=T.map(t=>trece(S,t));
  rez.forEach((ok,i)=>{const li=root.querySelector(`.spc-teste li[data-i="${i}"]`);if(!li)return;li.className=ok?'ok':(arata?'rau':'');li.querySelector('.s').textContent=ok?'✓':(arata?'✗':'○')});
  const n=root.querySelector('.spc-teste .nrt');if(n)n.textContent=`${rez.filter(Boolean).length} din ${rez.length} trec`;
  return rez;
}
function mesaj(st,html,cls){st.S.mesaj=html;st.S.mesajCls=cls||''}

/* ---------------- acțiunile ---------------- */
function inchideFila(st,id){
  const {S,Q,api}=st;
  S.br.file=S.br.file.filter(f=>f.id!==id);
  if(id==='falsa'){S.falsaInchisa=true;tick(S)}
  if(!S.br.file.length){S.brDeschis=false;if(Q.t==='laborator')S.activa=S.exDeschis?'ex':null}
  else if(S.br.activa===id)S.br.activa=S.br.file[0].id;
  if(Q.t==='fereastra'){
    if(id==='falsa'){
      const lectie=S.br.file.some(f=>f.id==='lectie');
      mesaj(st,lectie?'Fila falsă s-a închis; ai revenit la fila lecției.':'Fila falsă s-a închis. Era ultima filă, așa că s-a închis și browserul.','bun');desen(st);
      if(!api.done())api.resolve(true);
      focusPierdut(st);return;
    }
    mesaj(st,'Ai închis fila <b>lecției</b>, iar pagina falsă a rămas deschisă.','rau');desen(st);
    if(!api.done()){api.resolve(false,'Ai închis fila lecției, nu pe cea falsă. Închide fila paginii false: ✕ de lângă numele ei, sus.');revela(st)}
    return;
  }
  mesaj(st,id==='falsa'?'Fila falsă s-a închis.':'Ai închis fila lecției.',id==='falsa'?'bun':'');desen(st);
}
function inchideBrowser(st){
  const {S,Q,api}=st;
  const aveaFalsa=S.br.file.some(f=>f.id==='falsa');
  S.br.file=[];S.brDeschis=false;if(aveaFalsa){S.falsaInchisa=true;tick(S)}
  if(Q.t==='laborator')S.activa=S.exDeschis?'ex':null;
  mesaj(st,'Browserul s-a închis cu toate filele lui, și cu fila lecției. Merge și așa; de obicei ajunge ✕ de pe fila falsă. (Microsoft Edge te poate întreba întâi dacă închizi toate filele.)',aveaFalsa?'bun':'');
  desen(st);
  if(Q.t==='fereastra'&&aveaFalsa&&!api.done())api.resolve(true);
  focusPierdut(st);
}
/* elementul cu focus a dispărut la redesenare (✕ de pe filă): focusul nu cade pe pagină, ci pe fila lecției din simulator
   (judecata 1, sonnet MINOR-7). Dacă motorul a pus deja focusul pe „Mai departe”, nu-l mutăm. */
function focusPierdut(st){
  const a=document.activeElement;
  if(a&&a!==document.body&&document.contains(a))return;
  const f=st.root.querySelector('[data-foc="fila-lectie"]');
  if(f){try{f.focus({preventScroll:true})}catch(e){}return}
  st.root.tabIndex=-1;try{st.root.focus({preventScroll:true})}catch(e){}
}
function apasaFals(st,ce){
  const {S,Q,api}=st;
  S.apasatFals=true;
  const txt=`Ai apăsat „${esc(ce)}” <b>în</b> pagina falsă. Pe un site adevărat de felul ăsta, clicul putea porni descărcarea unui program rău-intenționat. Aici e doar exercițiu: nu s-a descărcat nimic. Nu apăsa nimic în pagină: închide fila de sus, cu ✕ de lângă numele ei.${Q.t==='laborator'?' Primul test cere să nu apeși nimic în pagina falsă: ca să-l treci, apasă jos „Ia-o de la capăt”.':''}`;
  mesaj(st,txt,'rau');desen(st);
  if(Q.t==='fereastra'&&!api.done()){api.resolve(false,`Ai apăsat „${esc(ce)}” în pagina falsă. Închide fila ei de sus, cu ✕ de lângă numele ei, fără să apeși nimic în pagină.`);revela(st)}
}
function revela(st){
  st.api.revealButton(()=>{const {S}=st;S.br.file=S.br.file.filter(f=>f.id!=='falsa');S.br.activa=S.br.file.length?S.br.file[0].id:null;S.falsaInchisa=true;
    mesaj(st,'Fila falsă e închisă acum: ✕ de lângă numele ei, sus.','bun');desen(st);st.api.giveUp('închizi fila paginii false cu ✕ de lângă numele ei (sus), fără să apeși nimic în pagină.')});
}
function deschide(st,id){
  const {S}=st;const e=S.ex;e.meniu=null;
  if(e.loc==='PC'){
    if(id==='C:'){e.stare='În exercițiul ăsta nu intrăm pe Disc local (C:).';desen(st);return}
    e.loc='E:';e.sel=null;e.stare='';desen(st);return;
  }
  const x=(S.f[e.loc]||[]).find(f=>f.n===id);if(!x)return;
  /* verificat = fișierul însuși sau stickul pe care stă au fost scanați ÎNAINTE de clipa asta (judecata 1, GRAV-1) */
  const verificat=!!(S.scanat[id]||(e.loc==='E:'&&S.scanat['E:']));
  const t=tick(S);
  if(!S.deschise.includes(id))S.deschise.push(id);
  if(S.deschisLa[id]==null)S.deschisLa[id]=t;
  if(e.loc==='E:'&&S.primaDeschidereStick==null)S.primaDeschidereStick=t;
  if(!verificat)S.deschisNeverificat=true;
  const ceVerifici=e.loc==='E:'?'stickul':'fișierul';
  if(x.t==='Aplicație'){
    if(!S.pornite.includes(id))S.pornite.push(id);
    mesaj(st,`Ai pornit programul <b>${esc(id)}</b> (Tip: Aplicație)${verificat?'':`, înainte să verifici ${ceVerifici} cu antivirusul`}! Un program adus de pe un site necunoscut nu se pornește fără acordul unui adult, chiar dacă antivirusul n-a găsit nimic. Ca să încerci din nou: „Ia-o de la capăt”.`,'rau');
    e.stare=`${id}: programul a pornit (simulat).`;
  }else{
    const app=/PowerPoint/.test(x.t)?'PowerPoint':/Word/.test(x.t)?'Word':'aplicația lui';
    if(verificat)mesaj(st,`<b>${esc(id)}</b> s-a deschis în ${app} (aici doar simulat; pe calculator apare ${app}).`,'');
    else mesaj(st,`Ai deschis <b>${esc(id)}</b> înainte să verifici ${ceVerifici} cu antivirusul. Regula: întâi scanezi, apoi deschizi. Ca să încerci din nou: „Ia-o de la capăt”, apoi scanează întâi.`,'rau');
    e.stare=`${id} s-a deschis în ${app} (simulat).`;
  }
  desen(st);
}
function scaneaza(st,id){
  const {S,Q}=st;const e=S.ex;e.meniu=null;
  const numeTinta=id==='E:'?'STICK (E:)':id==='C:'?'Disc local (C:)':id;
  const nrFis=id==='E:'?(S.f['E:']||[]).length:1;
  if(id==='C:'){e.stare='În exercițiul ăsta scanezi doar stickul sau un fișier.';desen(st);return}
  S.sec={faza:'merge',numeTinta,nrFis,ora:acum()};S.secDeschis=true;S.activa='sec';
  mesaj(st,'','');desen(st);
  clearTimeout(st.tmr);
  st.tmr=setTimeout(()=>{if(!st.root.isConnected||st.S!==S)return;S.sec.faza='gata';if(!S.scanat[id])S.scanat[id]=tick(S);
    mesaj(st,`Scanarea s-a terminat. Citește rezultatul și scrie numărul în căsuța „Răspunsul tău”, de mai jos.`,'');desen(st);
    /* focusul (judecata 1, MINOR-1): cu mouse/tastatură pe căsuță; la atingere pe rezultat, ca să nu sară tastatura telefonului */
    const tinta=Date.now()-(st.ultimTouch||0)<1500?st.root.querySelector('.spc-sec'):st.root.querySelector('input[data-a="nr"]');
    if(tinta)try{tinta.focus({preventScroll:true})}catch(x){}
  },1200);
}
function arataMeniu(st,id,fel){const e=st.S.ex;e.sel=id;e.meniu={id,fel:fel||'scurt'};e.stare='';desen(st);
  const p=st.root.querySelector('.spc-meniu .spc-mi');if(p)try{p.focus({preventScroll:true})}catch(x){}}

function leaga(st){
  const {root,Q,api}=st;     // starea se citește mereu din st.S (după „Ia-o de la capăt” e alt obiect)
  let ultimTouch=0,ultimAtingere={id:null,t:0},timerLung=null,lungDeschis=0,x0=0,y0=0;
  root.addEventListener('pointerdown',ev=>{
    if(ev.pointerType==='touch')ultimTouch=st.ultimTouch=Date.now();
    const it=ev.target.closest('[data-a="it"]');
    if(it&&ev.pointerType==='touch'&&!api.done()){x0=ev.clientX;y0=ev.clientY;clearTimeout(timerLung);
      timerLung=setTimeout(()=>{timerLung=null;lungDeschis=Date.now();arataMeniu(st,it.dataset.id,'scurt')},550)}
  });
  root.addEventListener('pointermove',ev=>{if(timerLung&&Math.hypot(ev.clientX-x0,ev.clientY-y0)>10){clearTimeout(timerLung);timerLung=null}});
  ['pointerup','pointercancel'].forEach(n=>root.addEventListener(n,()=>{if(timerLung){clearTimeout(timerLung);timerLung=null}}));
  root.addEventListener('contextmenu',ev=>{
    const it=ev.target.closest('[data-a="it"]');
    if(!it)return;
    ev.preventDefault();if(api.done())return;
    if(Date.now()-lungDeschis<800)return;           // pe Android, ținutul apăsat dă și „contextmenu”: o singură deschidere
    arataMeniu(st,it.dataset.id,'scurt');
  });
  root.addEventListener('click',ev=>{
    if(Date.now()-lungDeschis<500&&ev.target.closest('[data-a="it"]'))return;  // ridicarea degetului după ținut apăsat
    const el=ev.target.closest('[data-a]');if(!el||!root.contains(el))return;
    if(api.done()&&Q.t==='fereastra')return;
    const S=st.S;
    const a=el.dataset.a;
    if(a==='fals'){ev.stopPropagation();apasaFals(st,el.dataset.ce);return}
    if(a==='inchideFila'){ev.stopPropagation();inchideFila(st,el.dataset.id);return}
    if(a==='fila'){if(S.br.activa!==el.dataset.id){S.br.activa=el.dataset.id;desen(st)}return}
    if(a==='inchideBrowser'){inchideBrowser(st);return}
    if(api.done())return;
    if(a==='more'){ev.stopPropagation();arataMeniu(st,el.dataset.id,'scurt');return}
    if(a==='it'){
      const id=el.dataset.id,e=S.ex;
      const atingere=Date.now()-ultimTouch<700;
      if(atingere&&ultimAtingere.id===id&&Date.now()-ultimAtingere.t<600){ultimAtingere={id:null,t:0};deschide(st,id);return}
      ultimAtingere={id,t:Date.now()};
      if(e.sel!==id||e.meniu){e.sel=id;e.meniu=null;e.stare='';desen(st)}
      return;
    }
    if(a==='mi'){
      const m=el.dataset.mi,id=S.ex.meniu&&S.ex.meniu.id;
      if(m==='maimulte'){arataMeniu(st,id,'lung');return}
      if(m==='deschidere'){deschide(st,id);return}
      if(m==='scan'){scaneaza(st,id);return}
      S.ex.meniu=null;S.ex.stare=m==='copiere'?'Copierea nu o folosim în exercițiul ăsta.':'Proprietățile nu le folosim în exercițiul ăsta.';desen(st);return;
    }
    if(a==='inapoi'){S.ex.loc='PC';S.ex.sel=null;S.ex.meniu=null;S.ex.stare='';desen(st);return}
    if(a==='nav'){S.ex.loc=el.dataset.loc;S.ex.sel=null;S.ex.meniu=null;S.ex.stare='';desen(st);return}
    if(a==='inchideEx'){S.exDeschis=false;S.ex.meniu=null;S.activa=S.secDeschis?'sec':(S.brDeschis?'br':null);desen(st);return}
    if(a==='inchideSec'){S.secDeschis=false;S.activa=S.exDeschis?'ex':(S.brDeschis?'br':null);desen(st);return}
    if(a==='task'){const w=el.dataset.w;
      if(w==='br'&&!S.brDeschis){S.brDeschis=true;S.br={file:[{id:'lectie'}],activa:'lectie'}}
      if(w==='ex'&&!S.exDeschis){S.exDeschis=true;S.ex={loc:'PC',sel:null,meniu:null}}
      S.activa=w;desen(st);return}
    if(a==='reset'){clearTimeout(st.tmr);st.S=init(Q);desen(st);return}
  });
  root.addEventListener('dblclick',ev=>{
    const it=ev.target.closest('[data-a="it"]');if(!it||api.done())return;
    if(Date.now()-ultimTouch<700)return;            // pe telefon deschide atingerea dublă de mai sus
    deschide(st,it.dataset.id);
  });
  root.addEventListener('keydown',ev=>{
    const S=st.S,el=ev.target.closest('[data-a]');
    if(ev.key==='Escape'&&S.ex&&S.ex.meniu){S.ex.meniu=null;desen(st);const f=root.querySelector('.spc-it.sel');if(f)f.focus({preventScroll:true});return}
    if(!el||api.done())return;
    if(el.dataset.a==='it'&&ev.key==='Enter'){ev.preventDefault();deschide(st,el.dataset.id);return}
    if(el.dataset.a==='fila'&&(ev.key==='Enter'||ev.key===' ')){ev.preventDefault();S.br.activa=el.dataset.id;desen(st)}
  });
  root.addEventListener('input',ev=>{if(ev.target.dataset.a==='nr'){st.S.nr=ev.target.value;upd(st,false)}});
}

/* după un Verifică greșit, focusul merge unde e de lucru (judecata 1, MINOR-1; regula 14), fără să sară pagina */
function focusDupaGresit(st,t){
  const {S,root}=st;let el=null;
  const deLaCapat=S.apasatFals||S.pornite.length>0||S.deschisNeverificat;
  if(deLaCapat)el=root.querySelector('[data-a="reset"]');
  else if(t.c==='nr')el=root.querySelector('input[data-a="nr"]');
  else if(t.c==='falsaInchisa')el=root.querySelector('[data-a="inchideFila"][data-id="falsa"]')||root.querySelector('[data-a="task"][data-w="br"]');
  else if(t.c==='scanat'||t.c==='scanatInainte')el=root.querySelector(`[data-a="it"][data-id="${CSS.escape(t.v||'E:')}"]`)||root.querySelector('[data-a="task"][data-w="ex"]');
  else if(t.c==='deschisFaraProgram')el=root.querySelector(`[data-a="it"][data-id="${CSS.escape(t.v[0])}"]`)||root.querySelector('[data-a="it"][data-id="E:"]')||root.querySelector('[data-a="task"][data-w="ex"]');
  if(el)try{el.focus({preventScroll:true})}catch(e){}
}
/* plasa pentru Ctrl+W (judecata 1, MAJOR-4): cât o filă falsă e deschisă într-un simulator din pagină, browserul întreabă
   înainte să închidă lecția. Un singur ascultător pe pagină. */
let pazaPusa=false;
function pazaInchidere(){
  if(pazaPusa)return;pazaPusa=true;
  window.addEventListener('beforeunload',ev=>{
    const falsaDeschisa=[...document.querySelectorAll('.spc')].some(r=>{const st=r._st;
      return st&&r.isConnected&&st.S.br&&st.S.brDeschis&&st.S.br.file.some(f=>f.id==='falsa')});
    if(falsaDeschisa){ev.preventDefault();ev.returnValue=''}
  });
}
function render(Q,body,api){
  stil();
  body.innerHTML='<div class="spc"></div>';
  const root=body.firstChild;
  const st={Q,api,root,S:init(Q),tmr:null,ultimTouch:0,uid:'spc'+Math.random().toString(36).slice(2,8)};
  root._st=st;
  leaga(st);
  desen(st);
  if(Q.t!=='scanare')pazaInchidere();
  if(Q.t!=='fereastra'){
    const nav=api.checkButton(()=>{
      const rez=upd(st,true),T=Q.teste||[];
      const k=rez.findIndex(x=>!x);
      if(k<0){nav.innerHTML='';api.resolve(true);return}
      api.resolve(false,`Mai ai de făcut: ${strip(T[k].ce)}.${T[k].ajutor?' '+T[k].ajutor:''}`);
      api.revealButton(()=>{clearTimeout(st.tmr);st.S=rezolvat(Q);desen(st);upd(st,true);nav.innerHTML='';api.giveUp(Q.rezText||'pașii sunt făcuți acum în simulator.')});
      focusDupaGresit(st,T[k]);
    },Q.verifica||'Verifică');
  }
}
/* starea „rezolvat” / „greșit tipic”, pentru poartă și pentru „Arată-mi răspunsul”.
   rezolvat: ținta scanată ÎNTÂI (ceasul simulatorului), apoi, unde cere sarcina, tema deschisă. */
function rezolvat(Q){
  const S=init(Q);
  if(S.br){S.br.file=[{id:'lectie'}];S.br.activa='lectie';S.falsaInchisa=true}
  const T=Q.teste||[];
  T.forEach(t=>{if(t.c==='scanat'||t.c==='scanatInainte'){const v=t.v||'E:';if(!S.scanat[v])S.scanat[v]=tick(S)}});
  if(T.some(t=>t.c==='nr'))S.nr='0';
  T.filter(t=>t.c==='deschisFaraProgram').forEach(t=>{const n=t.v[0],tt=tick(S);S.deschise.push(n);
    if(S.deschisLa[n]==null)S.deschisLa[n]=tt;if((S.f['E:']||[]).some(x=>x.n===n)&&S.primaDeschidereStick==null)S.primaDeschidereStick=tt});
  if(Object.keys(S.scanat).length){const id=Object.keys(S.scanat)[0];S.sec={faza:'gata',numeTinta:id==='E:'?'STICK (E:)':id,nrFis:id==='E:'?(S.f['E:']||[]).length:1,ora:acum()};S.secDeschis=true}
  if(Q.t==='laborator'){S.activa='ex';S.ex.loc='E:'}
  return S;
}
function rezolva(Q,body){
  const root=body.querySelector('.spc');if(!root||!root._st)return;const st=root._st;
  if(Q.t==='fereastra'){const x=root.querySelector('[data-a="inchideFila"][data-id="falsa"]');if(x)x.click();return}
  clearTimeout(st.tmr);st.S=rezolvat(Q);desen(st);
}
function gresit(Q,body){
  const root=body.querySelector('.spc');if(!root||!root._st)return;const st=root._st;
  if(Q.t==='fereastra'){const b=root.querySelector('.spc-falsa .fb button');if(b)b.click();return}
  clearTimeout(st.tmr);
  const S=rezolvat(Q);
  if(Q.t==='laborator'){S.deschise.push('joc_gratis');S.pornite.push('joc_gratis')}   // „antivirusul a zis 0, deci îl pornesc”
  else{                                                        // greșeala lecției: DESCHIS întâi, scanat abia apoi (GRAV-1)
    const t=(Q.teste||[]).find(x=>x.c==='scanatInainte');
    if(t){const v=t.v||'E:';
      if(v==='E:'){const n=(S.f['E:']||[])[0].n;S.primaDeschidereStick=0;S.deschisLa[n]=0;S.deschise.push(n)}
      else{S.deschisLa[v]=0;S.deschise.push(v)}
      S.deschisNeverificat=true}
    else S.nr='3';                                             // a scris alt număr decât cel de pe ecran
  }
  st.S=S;desen(st);
}
const tip={render,rezolva,gresit};
window.SigurantaPC={fereastra:tip,scanare:tip,laborator:tip,_intern:{CHK,init,FALSE,FISIERE,rezolvat,nrCitit}};
})();
