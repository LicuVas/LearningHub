/* lectii/_sim/wordfisier.js — Word-ul simulat pentru GESTIONAREA documentului (LearningHub, 27-28.09.2026).

   PROPRIETAR: autorul lecției VII · M1 · 3 („Gestionarea unui document: creare, deschidere, vizualizare, salvare,
   închidere”). Extensie NOUĂ: wordobj.js / wordobj-formatare.js / wordobj-pagina.js NU se ating. Se încarcă după
   jocuri/_motor/ui-panglica.js + panglica-word.js (panglica reală, fila View). Tipul de exercițiu: `wordfis`
   -> tipuri:{wordfis:TipWordFisier}.

   CE E ADEVĂRAT AICI (probat în Word-ul real, Word 16.0.20326 EN pe Windows 11 RO; lectii/vii/m1-l03/_proba/):
   - pagina de început: Blank document, șabloane, lista Recent; File: Back, Home, New, Open, Info, Save, Save As,
     History, Print, Share, Export, Close, Options (dump UI Automation, desktop ascuns);
   - documentul nou se numește Document1, Document2… și e în Print Layout (COM + UIA);
   - F12 = fereastra Save As (Windows): în stânga folderele (pe Windows RO: Documente, Descărcări…), File name:, Save as
     type: (Word Document (*.docx) … PDF (*.pdf) … Rich Text Format (*.rtf) … OpenDocument Text (*.odt)), Save, Cancel;
     numele propus pentru un document nou = primul rând al textului; la PDF apar Standard / Minimum size și bifa
     „Open file after publishing” (nebifată); un nume care EXISTĂ -> „The file X already exists. Do you want to:”
     cu Replace existing file (ALES implicit) / Save changes with a different name / Merge changes…, OK / Cancel;
   - Ctrl+S pe un document nesalvat niciodată: fereastra mică „Save this file” (File name = primul rând, locul,
     More options…, Save, Cancel); pe un document salvat: salvează pe loc, fără fereastră;
   - Salvare ca .pdf: în Word rămâne deschis .docx-ul; Salvare ca .odt / .rtf: lucrezi mai departe în fișierul nou;
   - Ctrl+W cu modificări: „Save your changes to this file?” cu Save / Don't Save / Cancel; după Don't Save Word rămâne
     deschis, gol; Ctrl+N în Word gol face un document; X (închiderea ferestrei) pe singurul document închide Word;
   - Read Mode: fără panglică, sus File / Tools / View; View › Edit Document; tastarea nu schimbă textul; Esc -> Print
     Layout; Web Layout / Print Layout din fila View și din bara de stare; zoom 10–500 %, nu schimbă textul;
   - fișierul „de pe internet” se deschide în Protected View: nu se poate scrie; Enable Editing -> se poate (COM).
   ABATERI, spuse pe ecran: tastele Ctrl+N/O/S/W, F12 și Esc sunt butoane (în browser, Ctrl+W ar închide pagina);
   PDF-ul nu se deschide în Word-ul simulat; butoanele + / − ale zoom-ului: 8 % peste 100 %, 2 % sub 100 % (măsurat în Word; sub 100 %, Word mai sare uneori cu 1).

   Configurația exercițiului: {t:'wordfis', q, start:{word:'deschis'|'start'|'inchis', docs:[{nume?,ext?,folder?,
   text:[…], modificat?, pv?, vedere?, zoom?}], fisiere:[{folder:'doc'|'desc'|'desk', nume, ext, text:[…], web?,
   citire?}], recente:[{folder,nume,ext}]}, taste:['ctrln','ctrlo','ctrls','f12','ctrlw','esc'], tastatura:bool,
   verif:[{ce, …test…, cum?}], solutie:[…operații…], tipic:[…operații…]}.
   API: render(Q, body, api), rezolva(Q, body), gresit(Q, body). */
(function(G){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fara=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
const FOLDERE={desk:{n:'Desktop',en:'Desktop'},desc:{n:'Descărcări',en:'Downloads'},doc:{n:'Documente',en:'Documents'},img:{n:'Imagini',en:'Pictures'},od:{n:'OneDrive - Personal',en:'OneDrive'}};
/* numele cu extensie, ca în caseta File name a Word-ului pe un calculator care arată extensiile (probat: „Orarul meu.docx”; la tipul PDF devine singur „….pdf”) */
const cuExt=(n,e)=>String(n||'').replace(/\.(docx|doc|pdf|rtf|odt|txt|htm)$/i,'')+'.'+e;
const ORDINE_FOLDERE=['desk','desc','doc','img'];
/* lista „Save as type” din Word-ul real (în ordinea ei; aici doar o parte) */
const TIPURI=[['docx','Word Document (*.docx)'],['doc','Word 97-2003 Document (*.doc)'],['pdf','PDF (*.pdf)'],['htm','Web Page (*.htm;*.html)'],
  ['rtf','Rich Text Format (*.rtf)'],['txt','Plain Text (*.txt)'],['odt','OpenDocument Text (*.odt)']];
const NUME_TIP={docx:'Document Microsoft Word',doc:'Document Word 97-2003',pdf:'Document PDF',htm:'Pagină web',rtf:'Format text îmbogățit (RTF)',txt:'Document text',odt:'Text OpenDocument'};
const DESCHIDE_WORD=['docx','doc','rtf','odt','htm','txt'];
const SABLOANE={'Referat școlar cu fotografie':['Titlul referatului','Scrie aici textul referatului.'],'Diplomă':['DIPLOMĂ','Se acordă elevului …'],'Fluturaș':['Titlul fluturașului','Scrie aici anunțul.']};
const VEDERI={print:'Print Layout',read:'Read Mode',web:'Web Layout'};
const VEDERI_RO={print:'Aspect pagină imprimată',read:'Mod citire',web:'Aspect web'};
const clone=o=>JSON.parse(JSON.stringify(o));
const MODAL_TIPURI=['saveas','open','savethis','inchidere','exista','existaPdf','odt'];
const INTERZISE=/[\\/:*?"<>|]/;

/* ---------------- starea ---------------- */
function stareInit(Q){
  const S=Q.start||{};
  const st={word:S.word||'deschis',docs:[],activ:-1,nrNou:0,fs:[],recente:clone(S.recente||[]),ecran:'doc',bs:'home',dlg:null,
    fila:'TabHome',meniuCitire:false,expl:null,start:false,fl:{web:false,citire:false,zoom:false,printDupaWeb:false},jurnal:[],nota:''};
  (S.fisiere||[]).forEach(f=>st.fs.push({folder:f.folder||'doc',nume:f.nume,ext:f.ext||'docx',text:(f.text||['']).slice(),web:!!f.web,citire:!!f.citire}));
  st.fs0=clone(st.fs);
  (S.docs||[]).forEach(d=>st.docs.push(docDin(st,d)));
  st.activ=st.docs.length-1;
  return st;
}
function docDin(st,d){
  let nr=0;if(!d.nume){st.nrNou++;nr=st.nrNou}
  return {nume:d.nume||null,nr,ext:d.ext||'docx',folder:d.folder||null,text:(d.text&&d.text.length?d.text:['']).slice(),modificat:!!d.modificat,pv:!!d.pv,
    vedere:d.vedere||'print',zoom:d.zoom||100,sablon:d.sablon||null};
}
const activ=st=>st.activ>=0?st.docs[st.activ]:null;
const numeDoc=d=>d?(d.nume||('Document'+d.nr)):'';
const gasesteF=(st,folder,nume,ext)=>st.fs.find(f=>f.folder===folder&&fara(f.nume)===fara(nume)&&f.ext===ext);
function primulRand(d){const t=(d.text||[]).find(x=>String(x).trim());return t?String(t).trim().slice(0,60):('Document'+(d.nr||1))}

/* ---------------- operațiile, ca în Word ---------------- */
function nota(st,h){st.nota=h}
function docNouGol(st,sablon){
  const d=docDin(st,{text:sablon&&SABLOANE[sablon]?SABLOANE[sablon]:[''],sablon:sablon||null});
  st.docs.push(d);st.activ=st.docs.length-1;st.word='deschis';st.ecran='doc';st.dlg=null;st.fila='TabHome';
  nota(st,sablon?`Word a făcut un document nou din șablonul <b>${esc(sablon)}</b>. Sus scrie <b>${numeDoc(d)}</b>: nu e salvat încă.`:`Word a făcut un document nou, gol: <b>${numeDoc(d)}</b>. Nu e salvat încă.`);
}
function pornesteWord(st){
  if(st.word!=='inchis'){nota(st,'Word e deja pornit.');return}
  st.word='start';st.nrNou=0;st.ecran='doc';st.bs='home';st.dlg=null;st.expl=null;st.start=false;
  nota(st,'Word a pornit: vezi pagina de început.');
}
function scrieFisier(st,d,folder,nume,ext){
  let f=gasesteF(st,folder,nume,ext);
  if(!f){f={folder,nume,ext,text:[],web:false};st.fs.push(f)}
  f.nume=nume;f.text=d.text.slice();f.web=false;f.citire=false;
  return f;
}
function adaugaRecent(st,folder,nume,ext){
  if(!DESCHIDE_WORD.includes(ext))return;
  st.recente=st.recente.filter(r=>!(r.folder===folder&&fara(r.nume)===fara(nume)&&r.ext===ext));
  st.recente.unshift({folder,nume,ext});
}
/* salvarea propriu-zisă (după ce fereastra a fost completată); întoarce true dacă s-a scris */
function executaSalvare(st,folder,nume,ext,opt){
  const d=activ(st);
  scrieFisier(st,d,folder,nume,ext);
  st.jurnal.push({op:'salvat',folder,nume,ext});
  if(ext==='pdf'){
    nota(st,`În <b>${FOLDERE[folder].n}</b> a apărut <b>${esc(nume)}.pdf</b>. În Word a rămas deschis tot documentul <b>${esc(numeDoc(d))}</b>.`+
      (opt&&opt.deschide?' Bifa „Open file after publishing” era pusă: pe calculator, PDF-ul s-ar fi deschis acum într-un alt program (de exemplu browserul).':''));
  }else{
    const eraNou=!d.nume;
    d.nume=nume;d.ext=ext;d.folder=folder;d.modificat=false;d.pv=false;
    adaugaRecent(st,folder,nume,ext);
    nota(st,`Salvat în <b>${FOLDERE[folder].n}</b>: <b>${esc(nume)}.${ext}</b>. Sus, în bara de titlu, scrie acum ${esc(nume)}.`+(!eraNou&&ext!=='docx'?` De acum lucrezi în fișierul .${ext}.`:''));
  }
  st.dlg=null;st.ecran='doc';
  if(st.dupaSalvare){const c=st.dupaSalvare;st.dupaSalvare=null;inchideDoc(st,c==='fereastra',true)}
  return true;
}
/* încearcă salvarea: verifică numele și dacă fișierul există deja (fereastra „already exists”) */
function incearcaSalvare(st,folder,numeBrut,ext,opt){
  let nume=String(numeBrut||'').trim();
  const x=TIPURI.find(t=>t[0]===ext);
  if(nume.toLowerCase().endsWith('.'+ext))nume=nume.slice(0,-(ext.length+1)).trim();
  if(!nume){nota(st,'Scrie un nume în caseta <b>File name</b> (Nume fișier).');return false}
  if(INTERZISE.test(nume)){nota(st,'Windows nu primește în numele unui fișier semnele \\ / : * ? " &lt; &gt; |. Scrie numele fără ele.');return false}
  if(!x)return false;
  if(gasesteF(st,folder,nume,ext)&&!(opt&&opt.inlocuieste)){
    /* Word întreabă altfel la PDF (probat de judecător): „You already have a file named X.pdf. Do you want to replace it
       with this one?”, OK / Cancel; la documente: „The file X already exists. Do you want to:” cu Replace existing file ales */
    st.dlg={tip:ext==='pdf'?'existaPdf':'exista',folder,nume,ext,alegere:'inlocuieste',inapoi:st.dlg,opt:opt||{}};
    return false;
  }
  if(ext==='odt'&&!(opt&&opt.da)){
    /* la .odt Word întreabă întâi dacă păstrează formatul (probat de judecător, Yes / No); la .rtf nu întreabă */
    const d=activ(st);
    st.dlg={tip:'odt',folder,nume,ext,inapoi:st.dlg,opt:opt||{},doc:d?(d.nume?d.nume+'.'+d.ext:numeDoc(d)):''};
    return false;
  }
  return executaSalvare(st,folder,nume,ext,opt);
}
function ctrlS(st){
  const d=activ(st);
  if(!d){nota(st,st.word==='inchis'?'Word e închis.':'Nu e deschis niciun document.');return}
  if(d.pv){nota(st,'Documentul e în <b>Vizualizare protejată</b>. Întâi apasă <b>Enable Editing</b> (Activare editare) pe bara galbenă.');return}
  if(d.nume){
    scrieFisier(st,d,d.folder,d.nume,d.ext);d.modificat=false;st.jurnal.push({op:'ctrls',nume:d.nume});adaugaRecent(st,d.folder,d.nume,d.ext);
    nota(st,`Salvat în același fișier, <b>${esc(d.nume)}.${d.ext}</b>. Word nu arată nicio fereastră.`);st.ecran='doc';return;
  }
  st.dlg={tip:'savethis',nume:primulRand(d),folder:'doc'};st.ecran='doc';nota(st,'');
}
function f12(st){
  const d=activ(st);
  if(!d){nota(st,st.word==='inchis'?'Word e închis.':'Nu e deschis niciun document: nu ai ce salva.');return}
  if(d.pv){nota(st,'Documentul e în <b>Vizualizare protejată</b>. Întâi apasă <b>Enable Editing</b> (Activare editare) pe bara galbenă.');return}
  const e=DESCHIDE_WORD.includes(d.ext)?d.ext:'docx';
  st.dlg={tip:'saveas',folder:d.folder||'doc',nume:cuExt(d.nume||primulRand(d),e),ext:e,pdfDeschide:false,sel:null};
  st.ecran='doc';nota(st,'');
}
function inchideDoc(st,fereastra,fortat){
  const d=activ(st);
  if(!d){
    if(fereastra&&st.word!=='inchis'){st.word='inchis';st.ecran='doc';st.dlg=null;nota(st,'Word s-a închis.');}
    else nota(st,st.word==='inchis'?'Word e închis.':'Nu e deschis niciun document.');
    return;
  }
  if(d.modificat&&!fortat){st.dlg={tip:'inchidere',fereastra,nume:d.nume||primulRand(d),folder:d.folder||'doc'};return}
  st.docs.splice(st.activ,1);st.activ=st.docs.length-1;st.ecran='doc';st.dlg=null;
  st.jurnal.push({op:fereastra?'x':'ctrlw',nume:d.nume});
  if(fereastra&&!st.docs.length){st.word='inchis';nota(st,`Fereastra <b>${esc(numeDoc(d))}</b> s-a închis. Era singurul document, deci Word s-a închis de tot.`);return}
  nota(st,fereastra?`Fereastra <b>${esc(numeDoc(d))}</b> s-a închis. Word a rămas deschis cu celelalte documente.`:
    (st.docs.length?`Documentul <b>${esc(numeDoc(d))}</b> s-a închis. Word a rămas deschis.`:`Documentul <b>${esc(numeDoc(d))}</b> s-a închis. Word a rămas deschis, gol: poți face alt document (Ctrl+N) sau deschide unul (Ctrl+O).`));
}
function deschideFisier(st,f){
  if(f.ext==='pdf'){nota(st,'Word poate deschide și un PDF, dar în lecția asta deschidem doar documente Word (.docx, .odt, .rtf). PDF-ul îl citești în browser.');return false}
  if(!DESCHIDE_WORD.includes(f.ext)){nota(st,'Fișierul acesta nu e un document.');return false}
  const i=st.docs.findIndex(d=>d.nume&&fara(d.nume)===fara(f.nume)&&d.ext===f.ext&&d.folder===f.folder);
  if(i>=0){st.activ=i;st.ecran='doc';st.dlg=null;st.word='deschis';nota(st,'Documentul era deja deschis: Word îl aduce în față.');return true}
  if(st.word==='inchis')st.nrNou=0;
  const d=docDin(st,{nume:f.nume,ext:f.ext,folder:f.folder,text:f.text,pv:!!f.web,vedere:f.citire?'read':'print'});
  st.docs.push(d);st.activ=st.docs.length-1;st.word='deschis';st.ecran='doc';st.dlg=null;st.expl=null;st.fila='TabHome';
  adaugaRecent(st,f.folder,f.nume,f.ext);st.jurnal.push({op:'deschis',nume:f.nume,ext:f.ext,folder:f.folder});
  if(d.vedere==='read')st.fl.citire=true;
  nota(st,d.pv?`S-a deschis <b>${esc(f.nume)}</b>, venit de pe internet: Word îl arată în <b>Vizualizare protejată</b>.`:`S-a deschis <b>${esc(f.nume)}</b>.`);
  return true;
}
function seteazaVedere(st,v){
  const d=activ(st);if(!d)return;
  if(v==='web')st.fl.web=true;
  if(v==='read')st.fl.citire=true;
  if(v==='print'&&st.fl.web)st.fl.printDupaWeb=true;
  d.vedere=v;st.meniuCitire=false;
  nota(st,`Vizualizarea: <b>${VEDERI[v]}</b> (${VEDERI_RO[v]}). Textul documentului n-a fost schimbat.`);
}
function seteazaZoom(st,z){
  const d=activ(st);if(!d)return;
  z=Math.max(10,Math.min(500,Math.round(z)));if(z!==100)st.fl.zoom=true;d.zoom=z;
}
function tasteaza(st,t,enter){
  const d=activ(st);
  if(!d){nota(st,'Nu e deschis niciun document în care să scrii.');return false}
  if(d.pv){nota(st,'În <b>Vizualizare protejată</b> Word nu te lasă să scrii. Apasă întâi <b>Enable Editing</b> (Activare editare).');return false}
  if(d.vedere==='read'){nota(st,'În <b>Read Mode</b> (Mod citire) tastele nu scriu în document. Ieși cu <b>Esc</b>.');return false}
  if(t){d.text[d.text.length-1]+=t;d.modificat=true}
  if(enter){d.text.push('');d.modificat=true}
  return true;
}

/* ---------------- operațiile scrise (soluția și greșeala tipică, pentru poartă și „Arată-mi răspunsul”) ---------------- */
function executa(st,op){
  if(typeof op==='string')op={[op]:true};
  const k=Object.keys(op)[0],v=op[k];
  if(k==='porneste')pornesteWord(st);
  else if(k==='blank'||k==='ctrln')docNouGol(st,null);
  else if(k==='sablon')docNouGol(st,v);
  else if(k==='ctrls')ctrlS(st);
  else if(k==='f12')f12(st);
  else if(k==='ctrlw')inchideDoc(st,false);
  else if(k==='x')inchideDoc(st,true);
  else if(k==='esc'){const d=activ(st);if(d&&d.vedere==='read')seteazaVedere(st,'print')}
  else if(k==='enable'){const d=activ(st);if(d&&d.pv){d.pv=false;if(d.vedere==='read')d.vedere='print';st.jurnal.push({op:'enable'})}}
  else if(k==='saveas'){f12(st);incearcaSalvare(st,v.folder,v.nume,v.tip||'docx',{inlocuieste:!!v.inlocuieste,da:true});}
  else if(k==='savethis'){ctrlS(st);if(st.dlg&&st.dlg.tip==='savethis')incearcaSalvare(st,v.folder||'doc',v.nume,'docx',{})}
  else if(k==='inchidere'){const D=st.dlg;if(D&&D.tip==='inchidere'){if(v==='save'){const d=activ(st);if(d.nume){ctrlS(st);inchideDoc(st,D.fereastra,true)}else{st.dupaSalvare=D.fereastra?'fereastra':'doc';incearcaSalvare(st,v.folder||D.folder,v.nume||D.nume,'docx',{})}}
    else if(v==='dont')inchideDoc(st,D.fereastra,true);else st.dlg=null}}
  else if(k==='deschide'){const f=gasesteF(st,v.folder,v.nume,v.ext||'docx');if(f)deschideFisier(st,f)}
  else if(k==='vedere')seteazaVedere(st,v);
  else if(k==='zoom')seteazaZoom(st,v);
  else if(k==='scrie')tasteaza(st,v,false);
  else if(k==='enter')tasteaza(st,'',true);
}

/* ---------------- testele ---------------- */
function potriveste(nume,t){return t.re?new RegExp(t.re,'i').test(nume):fara(nume)===fara(t.nume)}
function teste(Q,st){
  const T=[],add=(ce,ok,cum)=>T.push({ce,ok:!!ok,cum:cum||''});
  const d=activ(st);
  (Q.verif||[]).forEach(v=>{
    let ok=false;
    if(v.fisier){const f=st.fs.find(x=>x.folder===v.fisier.folder&&x.ext===(v.fisier.ext||'docx')&&potriveste(x.nume,v.fisier)&&
        !(v.fisier.nuNumele&&v.fisier.nuNumele.some(n=>fara(n)===fara(x.nume))));
      ok=!!f&&(!v.fisier.contine||f.text.join(' ').toLowerCase().includes(String(v.fisier.contine).toLowerCase()))&&(!v.fisier.maiLung||f.text.join('').length>v.fisier.maiLung);}
    else if(v.fara){ok=!st.fs.some(x=>x.folder===v.fara.folder&&x.ext===(v.fara.ext||'docx')&&potriveste(x.nume,v.fara))}
    else if(v.neschimbat){const a=st.fs.find(x=>x.folder===v.neschimbat.folder&&x.ext===(v.neschimbat.ext||'docx')&&fara(x.nume)===fara(v.neschimbat.nume)),
        b=st.fs0.find(x=>x.folder===v.neschimbat.folder&&x.ext===(v.neschimbat.ext||'docx')&&fara(x.nume)===fara(v.neschimbat.nume));
      ok=!!a&&!!b&&a.text.join('\n')===b.text.join('\n')}
    else if(v.activ){ok=!!d&&d.nume&&potriveste(d.nume,v.activ)&&d.ext===(v.activ.ext||'docx')&&(!v.activ.folder||d.folder===v.activ.folder)}
    else if(v.activNou){ok=!!d&&!d.nume&&(v.activNou===true||d.sablon===v.activNou)&&(v.activNou!==true||!d.sablon)}
    else if(v.docuri!=null){ok=st.word!=='inchis'&&st.docs.length===v.docuri}
    else if(v.word){ok=v.word==='inchis'?st.word==='inchis':st.word!=='inchis'}
    else if(v.vedere){ok=!!d&&d.vedere===v.vedere}
    else if(v.zoom){ok=!!d&&d.zoom>=v.zoom[0]&&d.zoom<=v.zoom[1]}
    else if(v.pv===false){ok=!!d&&!d.pv}
    else if(v.modificat===false){ok=!!d&&!d.modificat}
    else if(v.fost){ok=!!st.fl[v.fost]}
    else if(v.scris){ok=!!d&&d.text.join('').length>v.scris}
    else if(v.jurnal){ok=st.jurnal.some(j=>[].concat(v.jurnal.op).includes(j.op)&&(!v.jurnal.nume||fara(j.nume||'')===fara(v.jurnal.nume)))}
    else if(v.salvatNume){ok=st.jurnal.some(j=>j.op==='salvat'&&potriveste(j.nume,v.salvatNume)&&(!v.salvatNume.ext||j.ext===v.salvatNume.ext))}
    add(v.ce,ok,v.cum||'Recitește sarcina și testul care nu e bifat.');
  });
  return T;
}
function stareDin(Q,ops){const st=stareInit(Q);(ops||[]).forEach(o=>executa(st,o));st.nota='';return st}

/* ---------------- desenul ---------------- */
const CSS=`
.wf{display:grid;gap:0;font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif}
/* fereastra Word e mereu în tema luminoasă (ca Word-ul din laborator): variabilele temei se suprascriu aici, așa că și
   panglica desenată de ui-panglica.js iese luminoasă și în tema întunecată a paginii */
.wf-fer{border:1px solid #8A94A3;border-radius:8px;overflow:hidden;background:#fff;color:#1b1b1b;--paper:#FFFFFF;--paper2:#F3F3F3;--ink:#1b1b1b;--ink2:#555;--line:#D0D5DC;--sel:#DDE6F4}
.wf-tb{display:flex;align-items:center;gap:6px;background:#2B579A;color:#fff;padding:0 0 0 8px;min-height:34px}
.wf-tb .wf-w{font-weight:700;font-size:.8rem;background:#fff;color:#2B579A;border-radius:3px;padding:0 5px;line-height:18px}
.wf-tb .wf-titlu{flex:1;min-width:0;font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}
.wf-tb button{min-width:40px;min-height:34px;border:0;background:none;color:#fff;font-size:.95rem;cursor:pointer}
.wf-tb button:hover,.wf-tb button:focus-visible{background:rgba(255,255,255,.18)}
.wf-tb button.wf-x:hover,.wf-tb button.wf-x:focus-visible{background:#C42B1C}
.wf-rb .rb.pg{--xlg:#2B579A}
.wf-rb{border-bottom:1px solid #D0D5DC}
.wf-rb .pg-fisier{background:#2B579A!important;color:#fff!important;border-radius:3px;padding:4px 10px!important;font-weight:600}
.wf-pv{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;background:#FFF1B8;border-bottom:1px solid #E6C84C;padding:6px 10px;font-size:.84rem;color:#3b2f00}
.wf-pv b{letter-spacing:.02em}
.wf-pv button{min-height:32px;border:1px solid #9C7C00;background:#fff;color:#1b1b1b;border-radius:3px;padding:0 10px;cursor:pointer;font:inherit;font-size:.84rem}
.wf-rm{display:flex;gap:2px;align-items:center;background:#F3F3F3;border-bottom:1px solid #D0D5DC;padding:2px 6px;font-size:.84rem;flex-wrap:wrap}
.wf-rm button{min-height:32px;border:0;background:none;color:#1b1b1b;padding:0 10px;cursor:pointer;font:inherit;border-radius:3px}
.wf-rm button:hover,.wf-rm button:focus-visible,.wf-rm button.on{background:#DDE6F4}
.wf-rm-meniu{display:grid;background:#fff;border:1px solid #C9CFD8;box-shadow:0 6px 18px rgba(0,0,0,.15);margin:0 6px 6px;max-width:320px}
.wf-rm-meniu button{text-align:left;min-height:34px;border:0;background:none;padding:4px 12px;cursor:pointer;font:inherit;font-size:.85rem;color:#1b1b1b}
.wf-rm-meniu button:hover,.wf-rm-meniu button:focus-visible{background:#DDE6F4}
.wf-ro{display:block;font-size:.72rem;color:#555}
.wf-zona{background:#E4E7EB;padding:10px;min-height:170px;overflow:auto;max-height:340px}
.wf-zona.web{background:#fff;padding:6px 10px}
.wf-zona.read{background:#FAF7F0}
.wf-pag{background:#fff;color:#111;box-shadow:0 1px 3px rgba(0,0,0,.2);margin:0 auto;padding:22px 26px;max-width:520px;min-height:150px;font-family:Calibri,Carlito,'Segoe UI',Arial,sans-serif;line-height:1.4;overflow-wrap:anywhere}
.wf-zona.web .wf-pag{box-shadow:none;max-width:none;padding:4px 2px;min-height:0}
.wf-zona.read .wf-pag{background:none;box-shadow:none;column-width:13em;column-gap:2em;max-width:none;font-family:Georgia,'Times New Roman',serif}
.wf-pag p{margin:0 0 .45em;min-height:1.3em}
.wf-pag p:first-child{font-weight:700}
.wf-car{display:inline-block;width:2px;height:1.05em;background:#111;vertical-align:-.15em;margin-left:1px;animation:wf-cl 1.05s steps(1) infinite}
@keyframes wf-cl{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.wf-car{animation:none}}
.wf-gol{display:grid;place-items:center;min-height:170px;background:#F3F3F3;color:#555;font-size:.9rem;text-align:center;padding:14px}
.wf-sb{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;background:#F3F3F3;border-top:1px solid #D0D5DC;padding:3px 8px;font-size:.76rem;color:#333}
.wf-sb .wf-sp{flex:1}
.wf-sb button{min-height:32px;min-width:32px;border:1px solid transparent;background:none;color:#1b1b1b;border-radius:3px;cursor:pointer;font:inherit;font-size:.72rem;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;padding:1px 4px;line-height:1.05}
.wf-sb button:hover,.wf-sb button:focus-visible{border-color:#2B579A;background:#DDE6F4}
.wf-sb button.on{border-color:#2B579A;background:#DDE6F4}
.wf-sb svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.4}
.wf-sb input[type=range]{width:110px;height:32px;accent-color:#2B579A}
.wf-pr{min-width:3.2em;text-align:right;font-variant-numeric:tabular-nums}
/* pagina File (Backstage) și pagina de început */
.wf-bs{display:grid;grid-template-columns:128px 1fr;min-height:260px}
.wf-bs-st{background:#2B579A;color:#fff;display:flex;flex-direction:column;padding:4px 0}
.wf-bs-st button{min-height:32px;border:0;background:none;color:#fff;text-align:left;padding:4px 12px;cursor:pointer;font:inherit;font-size:.84rem}
.wf-bs-st button:hover,.wf-bs-st button:focus-visible,.wf-bs-st button.on{background:rgba(255,255,255,.2)}
.wf-bs-st .wf-sep{border-top:1px solid rgba(255,255,255,.3);margin:4px 0}
.wf-bs-c{padding:10px 12px;background:#fff;min-width:0}
.wf-bs-c h4{margin:0 0 8px;font-size:1rem;font-weight:600}
.wf-dale{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.wf-dala{width:104px;min-height:120px;border:1px solid #C9CFD8;background:#fff;border-radius:3px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:6px;font:inherit;font-size:.74rem;color:#1b1b1b;gap:4px}
.wf-dala:hover,.wf-dala:focus-visible{border-color:#2B579A;background:#EEF3FA}
.wf-dala i{display:block;width:62px;height:78px;background:#fff;border:1px solid #D0D5DC;box-shadow:0 1px 2px rgba(0,0,0,.12)}
.wf-dala i.s1{background:linear-gradient(#2B579A 0 14%,transparent 14% 24%,#C9CFD8 24% 27%,transparent 27% 33%,#C9CFD8 33% 36%,transparent 36%) ,radial-gradient(circle at 50% 70%,#9CC3E6 0 18%,transparent 19%) #fff}
.wf-dala i.s2{background:repeating-linear-gradient(0deg,transparent 0 6px,transparent 6px),linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#D4A017,#F3D36B) border-box;border:4px solid transparent}
.wf-dala i.s3{background:linear-gradient(160deg,#E86A33 0 30%,#fff 30%)}
.wf-lista{display:grid;gap:2px}
.wf-lista button{display:flex;gap:8px;align-items:center;min-height:34px;border:1px solid transparent;background:none;text-align:left;padding:3px 8px;cursor:pointer;font:inherit;font-size:.84rem;color:#1b1b1b;border-radius:3px}
.wf-lista button:hover,.wf-lista button:focus-visible,.wf-lista button.on{border-color:#2B579A;background:#EEF3FA}
.wf-lista small{color:#555}
.wf-ic{flex:none;display:inline-grid;place-items:center;width:22px;height:26px;border-radius:2px;font-size:.62rem;font-weight:700;color:#fff;background:#2B579A}
.wf-ic.pdf{background:#C4302B}.wf-ic.odt{background:#1E7B45}.wf-ic.rtf{background:#6B6B6B}.wf-ic.fold{background:#E8B532;color:#5b4300}
.wf-bt{min-height:36px;padding:0 14px;border:1px solid #8A94A3;border-radius:4px;background:#F3F3F3;color:#1b1b1b;font:inherit;font-size:.86rem;cursor:pointer}
.wf-bt.pr{background:#2B579A;border-color:#2B579A;color:#fff}
.wf-bt.pr .wf-ro{color:#DCE6F5}
.wf-bt[disabled]{opacity:.5;cursor:not-allowed}
.wf-nav small{display:block;font-size:.7rem;color:#555}
.wf-nav button{white-space:normal;line-height:1.15}
.wf-rb .rb.pg .tabs button,.wf-rb .rb.pg .tabs .pg-fisier{min-height:32px}
/* fila View: butoanele cu numele scris, ca în Word (Read Mode, Print Layout, Web Layout sunt butoane mari cu nume) */
.wf-vb{display:flex;align-items:stretch;overflow-x:auto;background:#fff;border-top:1px solid #D0D5DC;scrollbar-width:thin}
.wf-vg{flex:0 0 auto;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid #D0D5DC;padding:3px 4px 1px}
.wf-vbs{display:flex;gap:2px;align-items:stretch;flex-wrap:nowrap}
.wf-vg button{min-width:44px;min-height:44px;border:1px solid transparent;border-radius:3px;background:none;color:#1b1b1b;font:inherit;font-size:.72rem;line-height:1.1;padding:2px 5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.wf-vg button:hover,.wf-vg button:focus-visible{border-color:#2B579A;background:#DDE6F4}
.wf-vg button.on{border-color:#2B579A;background:#DDE6F4;font-weight:600}
.wf-vg button.ns{opacity:.8}
.wf-vg svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.3}
.wf-vg .nm{font-size:.66rem;color:#555;text-align:center;white-space:nowrap}
.wf-bt:hover,.wf-bt:focus-visible{outline:2px solid #2B579A;outline-offset:1px}
/* ferestrele (Save As, Open, Save this file, închiderea, „already exists”) */
.wf-dlg{border:1px solid #8A94A3;border-radius:8px;background:#fff;color:#1b1b1b;box-shadow:0 8px 24px rgba(0,0,0,.2);overflow:hidden;margin:8px}
.wf-dt{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#F3F3F3;padding:4px 4px 4px 10px;font-weight:600;font-size:.86rem}
.wf-dt button{min-width:36px;min-height:32px;border:0;background:none;cursor:pointer;font-size:1rem}
.wf-dc{padding:8px 10px;display:grid;gap:8px;font-size:.86rem}
.wf-fer2{display:grid;grid-template-columns:150px 1fr;gap:6px;min-height:150px}
.wf-nav{display:grid;align-content:start;gap:1px;border-right:1px solid #E1E4E8;padding-right:4px}
.wf-nav button{display:flex;gap:6px;align-items:center;min-height:32px;border:1px solid transparent;background:none;text-align:left;padding:2px 6px;cursor:pointer;font:inherit;font-size:.8rem;color:#1b1b1b;border-radius:3px}
.wf-nav button.on,.wf-nav button:hover,.wf-nav button:focus-visible{background:#DDE6F4;border-color:#9DB6DC}
.wf-cale{font-size:.78rem;color:#444;background:#F7F7F7;border:1px solid #E1E4E8;padding:3px 6px;border-radius:3px}
.wf-camp{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;align-items:center}
.wf-camp label{font-size:.82rem;white-space:nowrap}
.wf-camp input[type=text],.wf-camp select{min-width:0;width:100%;min-height:36px;font-size:16px;padding:5px 6px;border:1px solid #8A94A3;border-radius:3px;background:#fff;color:#1b1b1b}
.wf-dj{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;align-items:center}
.wf-bifa{display:flex;gap:6px;align-items:center;font-size:.82rem;min-height:32px}
.wf-bifa input{width:18px;height:18px}
.wf-dc .hint{margin:0}
/* bara de activități (Windows) și Explorer */
.wf-ta{display:flex;flex-wrap:wrap;gap:4px;align-items:center;background:#1F2633;padding:4px 6px;border-radius:0 0 8px 8px}
.wf-ta button{min-height:34px;border:1px solid #3a4456;background:#2b3444;color:#fff;border-radius:4px;padding:0 10px;cursor:pointer;font:inherit;font-size:.78rem;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wf-ta button.on{border-color:#7FA7E0;background:#34466a}
.wf-ta button:focus-visible{outline:2px solid #7FA7E0}
.wf-desk{min-height:200px;background:linear-gradient(135deg,#1c4f8a,#2a7ab8);color:#fff;padding:14px;font-size:.9rem;display:grid;align-content:start;gap:10px}
.wf-meniu-start{display:grid;gap:4px;background:#fff;color:#1b1b1b;border-radius:6px;padding:8px;max-width:260px}
/* tastele de pe ecran, tastatura, testele */
.wf-taste{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px}
.wf-taste .wf-kl{flex:1 1 100%;font-size:.74rem;color:var(--ink2)}
.wf-k{min-height:40px;padding:0 12px;border:1px solid var(--line);border-bottom-width:3px;border-radius:6px;background:var(--paper2);color:var(--ink);font-family:var(--fm),Consolas,monospace;font-size:.86rem;cursor:pointer}
.wf-k:focus-visible,.wf-in:focus-visible{outline:3px solid var(--accent);outline-offset:1px}
.wf-in{flex:1 1 150px;min-width:0;font-size:16px;padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)}
.wf-nota{min-height:1.3em;margin:8px 0 0;font-size:.92rem;color:var(--ink)}
.wf-nota:empty{display:none}
.wf-teste{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:4px}
.wf-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.92rem;padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper)}
.wf-teste li.ok{border-color:var(--ok);background:var(--okbg)}
.wf-teste .ic{flex:none;width:1.1em;font-weight:700;color:var(--ink2)}
.wf-teste li.ok .ic{color:var(--ok)}
.wf-jos{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;margin-top:8px}
.wf-leg{margin:0;padding:5px 10px;border:1px solid var(--line);border-top:0;background:var(--paper2);font-size:.8rem}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (max-width:560px){
  .wf-sb .wf-sp{flex:1 1 100%;height:0}
  .wf-bs{grid-template-columns:1fr}
  .wf-bs-st{flex-direction:row;flex-wrap:wrap}
  .wf-bs-st .wf-sep{display:none}
  .wf-fer2{grid-template-columns:1fr}
  .wf-nav{grid-template-columns:repeat(2,minmax(0,1fr));border-right:0;border-bottom:1px solid #E1E4E8;padding:0 0 4px}
  .wf-camp{grid-template-columns:1fr}
  .wf-sb input[type=range]{width:80px}
}
`;
function stil(){if(typeof document==='undefined'||document.getElementById('wordfisier-css'))return;const s=document.createElement('style');s.id='wordfisier-css';s.textContent=CSS;document.head.appendChild(s)}

const TASTE={ctrln:['Ctrl+N','document nou'],ctrlo:['Ctrl+O','deschide'],ctrls:['Ctrl+S','salvează'],f12:['F12','Salvare ca'],ctrlw:['Ctrl+W','închide documentul'],esc:['Esc','ieși din Mod citire / din fereastră']};
const SVG={read:'<svg viewBox="0 0 16 16"><path d="M2 3.5h5v9H2zM9 3.5h5v9H9z"/></svg>',print:'<svg viewBox="0 0 16 16"><path d="M4 2h8v12H4z"/><path d="M6 5h4M6 7.5h4M6 10h3"/></svg>',
  web:'<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M2.5 8h11M8 2.5c2 2 2 9 0 11M8 2.5c-2 2-2 9 0 11"/></svg>'};
let NR=0;

function render(Q,body,api){
  stil();
  let st=stareInit(Q);
  const id='wf-in-'+(++NR);
  const taste=(Q.taste||Object.keys(TASTE)).filter(k=>TASTE[k]);
  const cuTastatura=Q.tastatura!==false;
  body.innerHTML=`<div class="wf" tabindex="-1">
    <div class="wf-fer" aria-label="Word simulat"></div>
    <p class="hint wf-leg">Tastele de mai jos le apeși <b>aici, cu butoanele</b>. Pe calculator merg și tastele Ctrl+S, Ctrl+O și F12, cu clicul pus în Word-ul simulat; <b>Ctrl+N</b> și <b>Ctrl+W</b> nu le poate opri pagina (Ctrl+W ar închide lecția), așa că pentru ele folosește butoanele. În Word-ul adevărat apeși tastele.</p>
    <div class="wf-taste" role="group" aria-label="Tastele din Word"><span class="wf-kl">Tastele (ca pe tastatură):</span>${taste.map(k=>`<button type="button" class="wf-k" data-tasta="${k}" aria-label="Tasta ${TASTE[k][0]}: ${TASTE[k][1]}">${TASTE[k][0]}</button>`).join('')}</div>
    ${cuTastatura?`<div class="wf-taste"><label class="wf-kl" for="${id}">Tastatura: ce tastezi aici apare în document, la capătul textului</label>
      <input class="wf-in" id="${id}" type="text" enterkeyhint="enter" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="tastează aici">
      <button type="button" class="wf-k" data-tasta="enter" aria-label="Tasta Enter">Enter ↵</button></div>`:''}
    <p class="wf-nota" aria-live="polite"></p>
    <ul class="wf-teste" aria-label="Testele sarcinii"></ul>
    <div class="wf-jos"><span class="hint">Un clic (o atingere) pe butoanele din fereastră face ce ar face în Word.</span><button type="button" class="btn ghost sm" data-wf="reset">Ia-o de la capăt</button></div>
  </div>`;
  const $=s=>body.querySelector(s),rad=$('.wf'),ferEl=$('.wf-fer'),notaEl=$('.wf-nota'),testEl=$('.wf-teste'),inp=$('.wf-in');
  const PW=window.PANGLICA_WORD,UP=window.UiPanglica,real=!!(PW&&UP);

  function titlu(){const d=activ(st);if(!d)return 'Word';
    return `${esc(numeDoc(d))}${d.nume&&d.ext!=='docx'?'.'+d.ext:''}${d.pv?' - Protected View':''}${['rtf','doc'].includes(d.ext)?' - Compatibility Mode':''} - Word`}
  function barTitlu(){return `<div class="wf-tb"><span class="wf-w" aria-hidden="true">W</span><span class="wf-titlu" title="Bara de titlu">${titlu()}</span>
    <button type="button" data-wf="min" aria-label="Minimizare (Minimize)" title="Minimizare (Minimize)">&#8212;</button><button type="button" data-wf="max" aria-label="Restaurare (Restore Down)" title="Restaurare (Restore Down)">&#9633;</button><button type="button" class="wf-x" data-wf="x" aria-label="Închidere (Close): butonul X" title="Închidere (Close)">&#10005;</button></div>`}
  function panglica(){
    const d=activ(st);
    if(!real)return `<div class="rb pg"><div class="tabs"><button type="button" class="pg-fisier" data-wf="file">File</button><button type="button" data-tab="TabHome" class="${st.fila==='TabHome'?'on':''}">Home</button><button type="button" data-tab="TabView" class="${st.fila==='TabView'?'on':''}">View</button></div>
      <div class="pg-banda" style="padding:6px;gap:6px">${st.fila==='TabView'?`<button type="button" class="wf-bt" data-v="read">Read Mode</button><button type="button" class="wf-bt" data-v="print">Print Layout</button><button type="button" class="wf-bt" data-v="web">Web Layout</button><button type="button" class="wf-bt" data-wf="z100">100%</button>`:'<span class="hint">Butoanele filei Home (Pornire)</span>'}</div></div>`;
    UP.stil();
    const on=v=>d&&d.vedere===v?'pg-on':'';
    const leg={ViewFullScreenReadingView:{attr:'data-v="read"',title:'Mod citire (Read Mode)',clasa:on('read')},ViewPrintLayoutView:{attr:'data-v="print"',title:'Aspect pagină imprimată (Print Layout)',clasa:on('print')},
      ViewWebLayoutView:{attr:'data-v="web"',title:'Aspect web (Web Layout)',clasa:on('web')},ZoomCurrent100:{attr:'data-wf="z100"',title:'100%: zoom la mărimea obișnuită'}};
    const fisier='<button type="button" class="pg-fisier" data-wf="file" title="Fișier (File)">File</button>';
    if(st.fila!=='TabView')return UP.html(PW,{fila:st.fila,legaturi:leg,fisier});
    /* fila View: grupurile și butoanele din dump (panglica-word.json), cu numele scris sub fiecare, ca în Word */
    const f=(PW.file||[]).find(x=>x.id==='TabView');
    const V={ViewFullScreenReadingView:'read',ViewPrintLayoutView:'print',ViewWebLayoutView:'web'};
    const banda=f?`<div class="wf-vb" role="group" aria-label="Fila View">${f.grupuri.map(g=>`<div class="wf-vg" role="group" aria-label="${esc(g.eticheta)}"><div class="wf-vbs">${g.butoane.map(b=>{
      if(V[b.id])return `<button type="button" data-v="${V[b.id]}" class="${d&&d.vedere===V[b.id]?'on':''}" title="${VEDERI_RO[V[b.id]]} (${esc(b.eticheta)})">${SVG[V[b.id]]}${esc(b.eticheta)}</button>`;
      if(b.id==='ZoomCurrent100')return `<button type="button" data-wf="z100" title="100%: zoom la mărimea obișnuită"><b>100</b>${esc(b.eticheta)}</button>`;
      return `<button type="button" class="ns" data-nesim="${esc(b.eticheta)}" aria-label="${esc(b.eticheta)}">${esc(b.eticheta)}</button>`}).join('')}</div><div class="nm">${esc(g.eticheta)}</div></div>`).join('')}</div>`:'';
    return UP.html(PW,{fila:st.fila,legaturi:leg,fisier,bandaInlocuita:banda});
  }
  function barPV(){return `<div class="wf-pv" role="status"><b>PROTECTED VIEW</b><span>Be careful—files from the Internet can contain viruses. Unless you need to edit, it's safer to stay in Protected View.</span>
    <button type="button" data-wf="enable">Enable Editing</button><span class="wf-ro" style="flex-basis:100%">În română: bara galbenă <b>Vizualizare protejată</b>, cu butonul <b>Activare editare</b>.</span></div>`}
  function barCitire(){
    return `<div class="wf-rm" role="menubar" aria-label="Meniul din Mod citire"><button type="button" data-wf="file" role="menuitem">File</button><button type="button" data-wf="nesim" data-n="Tools" role="menuitem">Tools</button><button type="button" data-wf="meniuview" role="menuitem" class="${st.meniuCitire?'on':''}" aria-expanded="${st.meniuCitire}">View</button></div>
      ${st.meniuCitire?`<div class="wf-rm-meniu" role="menu"><button type="button" data-v="print" role="menuitem">Edit Document<span class="wf-ro">Editare document</span></button>${['Focus','Navigation Pane','Column Width','Page Color','Layout','Read Aloud'].map(n=>`<button type="button" data-wf="nesim" data-n="${n}" role="menuitem">${n}</button>`).join('')}</div>`:''}`;
  }
  function pagina(){
    const d=activ(st);
    if(!d)return `<div class="wf-gol">Word e deschis, dar nu e niciun document.<br>Fă unul nou (Ctrl+N) sau deschide unul (Ctrl+O).</div>`;
    const sc=d.zoom/100;
    const par=d.text.map((t,i)=>`<p>${esc(t)}${i===d.text.length-1&&!d.pv&&d.vedere!=='read'?'<span class="wf-car" aria-hidden="true"></span>':''}</p>`).join('');
    return `<div class="wf-zona ${d.vedere}" role="document" aria-label="Documentul ${esc(numeDoc(d))}, în ${VEDERI[d.vedere]}"><div class="wf-pag" style="font-size:${(16*sc).toFixed(1)}px">${par}</div></div>`;
  }
  function barStare(){
    const d=activ(st);if(!d)return `<div class="wf-sb"><span>Word</span></div>`;
    const b=(v,n,ro)=>`<button type="button" data-v="${v}" class="${d.vedere===v?'on':''}" aria-label="${n} (${ro})" title="${ro} (${n})">${SVG[v]}<span>${n}</span></button>`;
    return `<div class="wf-sb" aria-label="Bara de stare"><span>Page 1 of 1</span><span>${d.text.join(' ').trim().split(/\s+/).filter(Boolean).length} words</span><span class="wf-sp"></span>
      ${b('read','Read Mode','Mod citire')}${b('print','Print Layout','Aspect pagină imprimată')}${b('web','Web Layout','Aspect web')}
      <button type="button" data-wf="zminus" aria-label="Zoom Out: micșorează">−</button><input type="range" min="10" max="500" step="1" value="${d.zoom}" aria-label="Zoom: glisorul" data-wf="zslider"><button type="button" data-wf="zplus" aria-label="Zoom In: mărește">+</button><span class="wf-pr">${d.zoom}%</span></div>`;
  }
  function backstage(deStart){
    const d=activ(st);
    const it=deStart?[['home','Home'],['new','New'],['open','Open'],['sep'],['options','Options']]:
      [['back','←  Back'],['home','Home'],['new','New'],['open','Open'],['sep'],['info','Info'],['save','Save'],['saveas','Save As'],['history','History'],['print','Print'],['share','Share'],['export','Export'],['close','Close'],['sep'],['options','Options']];
    const RO={home:'Pornire',new:'Nou',open:'Deschidere',save:'Salvare',saveas:'Salvare ca',close:'Închidere',back:'Înapoi',info:'Informații',print:'Imprimare'};
    const st_=`<nav class="wf-bs-st" aria-label="Meniul File">${it.map(([k,n])=>k==='sep'?'<span class="wf-sep"></span>':`<button type="button" data-bs="${k}" class="${st.bs===k?'on':''}" title="${RO[k]?RO[k]+' ('+n.replace('←  ','')+')':n}">${n}</button>`).join('')}</nav>`;
    const dale=(cu)=>`<div class="wf-dale"><button type="button" class="wf-dala" data-wf="blank"><i></i>Blank document<span class="wf-ro">Document necompletat</span></button>${cu?Object.keys(SABLOANE).map((s,k)=>`<button type="button" class="wf-dala" data-sablon="${esc(s)}"><i class="s${k+1}"></i>${esc(s)}</button>`).join(''):''}</div>`;
    const rec=()=>st.recente.length?`<div class="wf-lista" role="list">${st.recente.map((r,k)=>`<button type="button" data-rec="${k}" role="listitem"><span class="wf-ic ${r.ext}">${r.ext==='docx'?'W':r.ext.toUpperCase()}</span><span>${esc(r.nume)}.${r.ext}<br><small>${FOLDERE[r.folder].n}</small></span></button>`).join('')}</div>`:'<p class="hint">Lista e goală.</p>';
    let c='';
    if(st.bs==='home')c=`<h4>${deStart?'Bun venit în Word':'Home'}</h4><p class="hint">New (Nou): documentul gol sau un șablon</p>${dale(true)}<h4>Recent <span class="wf-ro" style="display:inline">(Recente)</span></h4><p class="hint">Fișierele deschise de curând pe ACEST calculator (și ale colegilor).</p>${rec()}`;
    else if(st.bs==='new')c=`<h4>New <span class="wf-ro">Nou</span></h4>${dale(true)}<p class="hint">Mai multe șabloane: caseta Search for online templates (în Word-ul adevărat).</p>`;
    else if(st.bs==='open')c=`<h4>Open <span class="wf-ro">Deschidere</span></h4><div class="wf-dj" style="justify-content:flex-start"><button type="button" class="wf-bt" data-wf="browse-open">Browse<span class="wf-ro">Răsfoire</span></button></div><h4 style="margin-top:10px">Recent <span class="wf-ro" style="display:inline">(Recente)</span></h4>${rec()}`;
    else if(st.bs==='saveas')c=`<h4>Save As <span class="wf-ro">Salvare ca</span></h4><p class="hint">This PC (Acest PC)</p><div class="wf-dj" style="justify-content:flex-start"><button type="button" class="wf-bt" data-wf="browse-save">Browse<span class="wf-ro">Răsfoire</span></button></div>`;
    else c=`<h4>${esc(st.bs)}</h4><p class="hint">Pagina asta e și în Word, dar în lecția asta nu o folosim.</p>`;
    return `<div class="wf-bs">${st_}<div class="wf-bs-c">${c}</div></div>`;
  }
  function listaFisiere(folder,filtru,sel){
    const f=st.fs.filter(x=>x.folder===folder&&(!filtru||filtru.includes(x.ext)));
    return f.length?`<div class="wf-lista" role="listbox" aria-label="Fișierele din ${FOLDERE[folder].n}">${f.map(x=>{const k=st.fs.indexOf(x);return `<button type="button" role="option" data-fis="${k}" class="${sel===k?'on':''}" aria-selected="${sel===k}"><span class="wf-ic ${x.ext}">${x.ext==='docx'?'W':x.ext.toUpperCase()}</span><span>${esc(x.nume)}<br><small>${NUME_TIP[x.ext]||x.ext}</small></span></button>`}).join('')}</div>`:'<p class="hint">Folderul e gol.</p>';
  }
  function nav(folder){return `<div class="wf-nav" role="group" aria-label="Folderele (în stânga ferestrei)">${ORDINE_FOLDERE.map(k=>`<button type="button" data-folder="${k}" class="${folder===k?'on':''}" aria-pressed="${folder===k}"><span class="wf-ic fold" aria-hidden="true">▤</span><span>${FOLDERE[k].n}${k!=='desk'?`<small>(${FOLDERE[k].en})</small>`:''}</span></button>`).join('')}</div>`}
  function dialog(){
    const D=st.dlg;if(!D)return '';
    const cap=(t,ro)=>`<div class="wf-dt"><span>${t}${ro?` <span class="wf-ro" style="display:inline">(${ro})</span>`:''}</span><button type="button" data-wf="dlg-x" aria-label="Închide fereastra (Cancel)">✕</button></div>`;
    if(D.tip==='saveas'){
      const pdf=D.ext==='pdf';
      return `<div class="wf-dlg" role="dialog" aria-label="Fereastra Save As (Salvare ca)">${cap('Save As','Salvare ca')}<div class="wf-dc">
        <div class="wf-cale">Acest PC › ${FOLDERE[D.folder].n}</div>
        <div class="wf-fer2">${nav(D.folder)}<div>${listaFisiere(D.folder,[D.ext],null)}</div></div>
        <div class="wf-camp"><label for="${id}-n">File name: <span class="wf-ro">Nume fișier</span></label><input type="text" id="${id}-n" data-camp="nume" value="${esc(D.nume)}" autocomplete="off" autocapitalize="off" spellcheck="false">
          <label for="${id}-t">Save as type: <span class="wf-ro">Salvare cu tipul</span></label><select id="${id}-t" data-camp="tip">${TIPURI.map(([e,n])=>`<option value="${e}" ${e===D.ext?'selected':''}>${n}</option>`).join('')}</select></div>
        ${pdf?`<div class="wf-dj" style="justify-content:flex-start;gap:14px"><span class="wf-bifa">Optimize for: <label><input type="radio" name="${id}-o" checked> Standard</label> <label><input type="radio" name="${id}-o"> Minimum size</label></span>
          <label class="wf-bifa"><input type="checkbox" data-camp="pdfdeschide" ${D.pdfDeschide?'checked':''}> Open file after publishing <span class="wf-ro" style="display:inline">(Se deschide fișierul după publicare)</span></label></div>`:''}
        <div class="wf-dj"><button type="button" class="wf-bt pr" data-wf="saveas-ok">Save<span class="wf-ro">Salvare</span></button><button type="button" class="wf-bt" data-wf="dlg-x">Cancel<span class="wf-ro">Anulare</span></button></div>
        <p class="hint">Folderele din stânga le scrie Windows: pe un Windows în română, Documente și Descărcări; în engleză, Documents și Downloads.</p></div></div>`;
    }
    if(D.tip==='open'){
      return `<div class="wf-dlg" role="dialog" aria-label="Fereastra Open (Deschidere)">${cap('Open','Deschidere')}<div class="wf-dc">
        <div class="wf-cale">Acest PC › ${FOLDERE[D.folder].n}</div>
        <div class="wf-fer2">${nav(D.folder)}<div>${listaFisiere(D.folder,['docx','doc','rtf','odt','pdf','htm'],D.sel)}</div></div>
        <div class="wf-camp"><label for="${id}-o">File name: <span class="wf-ro">Nume fișier</span></label><input type="text" id="${id}-o" data-camp="numeO" value="${D.sel!=null&&st.fs[D.sel]?esc(st.fs[D.sel].nume):''}" readonly>
          <span class="wf-bifa" style="grid-column:1/-1">Tipul: All Word Documents (toate documentele Word)</span></div>
        <div class="wf-dj"><button type="button" class="wf-bt pr" data-wf="open-ok" ${D.sel==null?'disabled':''}>Open<span class="wf-ro">Deschidere</span></button><button type="button" class="wf-bt" data-wf="dlg-x">Cancel<span class="wf-ro">Anulare</span></button></div>
        <p class="hint">Atinge un fișier ca să-l alegi, apoi Open (sau dublu-clic pe el).</p></div></div>`;
    }
    if(D.tip==='savethis'){
      return `<div class="wf-dlg" role="dialog" aria-label="Fereastra Save this file">${cap('Save this file')}<div class="wf-dc"><p class="hint" style="margin:0">Fereastra care îți cere numele și locul, la prima salvare cu Ctrl+S.</p>
        <div class="wf-camp"><label for="${id}-s">File name <span class="wf-ro">Nume fișier</span></label><input type="text" id="${id}-s" data-camp="nume" value="${esc(D.nume)}" autocomplete="off" autocapitalize="off" spellcheck="false">
          <label for="${id}-l">Choose a Location <span class="wf-ro">alegi locul</span></label><select id="${id}-l" data-camp="loc">${['doc','od'].map(k=>`<option value="${k}" ${k===D.folder?'selected':''}>${k==='doc'?'Documents (Documente)':'OneDrive - Personal (în cont, pe internet)'}</option>`).join('')}</select></div>
        <div class="wf-dj"><button type="button" class="wf-bt" data-wf="more">More options…<span class="wf-ro">duce la Salvare ca</span></button><span style="flex:1"></span><button type="button" class="wf-bt pr" data-wf="savethis-ok">Save<span class="wf-ro">Salvare</span></button><button type="button" class="wf-bt" data-wf="dlg-x">Cancel<span class="wf-ro">Anulare</span></button></div>
        <p class="hint">Apare în Word-ul nou (Microsoft 365). În Word 2016, Ctrl+S deschide direct pagina Salvare ca (Save As).</p></div></div>`;
    }
    if(D.tip==='inchidere'){
      const d=activ(st),nou=d&&!d.nume;
      return `<div class="wf-dlg" role="dialog" aria-label="Fereastra Save your changes to this file?">${cap('Microsoft Word')}<div class="wf-dc">
        <p style="margin:0;font-size:1rem"><b>Save your changes to this file?</b><span class="wf-ro">Word te întreabă dacă salvezi modificările.</span></p>
        ${nou?`<div class="wf-camp"><label for="${id}-c">File name <span class="wf-ro">Nume fișier</span></label><input type="text" id="${id}-c" data-camp="nume" value="${esc(D.nume)}" autocomplete="off" autocapitalize="off" spellcheck="false">
          <label for="${id}-cl">Choose a Location <span class="wf-ro">alegi locul</span></label><select id="${id}-cl" data-camp="loc">${['doc','od'].map(k=>`<option value="${k}" ${k===D.folder?'selected':''}>${k==='doc'?'Documents (Documente)':'OneDrive - Personal (în cont, pe internet)'}</option>`).join('')}</select></div>`:`<p class="hint" style="margin:0">${esc(d.nume)}.${d.ext} · ${FOLDERE[d.folder].n}</p>`}
        <div class="wf-dj"><button type="button" class="wf-bt pr" data-wf="c-save">Save<span class="wf-ro">Salvare</span></button><button type="button" class="wf-bt" data-wf="c-dont">Don't Save<span class="wf-ro">Nu salvați</span></button><button type="button" class="wf-bt" data-wf="c-cancel">Cancel<span class="wf-ro">Anulare</span></button></div></div></div>`;
    }
    if(D.tip==='exista'){
      const o=(k,t,ro)=>`<label class="wf-bifa"><input type="radio" name="${id}-e" value="${k}" data-camp="alege" ${D.alegere===k?'checked':''}> ${t} <span class="wf-ro" style="display:inline">(${ro})</span></label>`;
      return `<div class="wf-dlg" role="dialog" aria-label="Fișierul există deja">${cap('Microsoft Word')}<div class="wf-dc">
        <p style="margin:0">The file <b>${esc(D.nume)}.${D.ext}</b> already exists. <span class="wf-ro">Fișierul există deja.</span></p><p style="margin:0">Do you want to:</p>
        ${o('inlocuieste','Replace existing file.','înlocuiești fișierul care e acolo')}${o('altnume','Save changes with a different name.','salvezi cu alt nume')}${o('imbina','Merge changes into existing file.','le amesteci')}
        <div class="wf-dj"><button type="button" class="wf-bt pr" data-wf="exista-ok">OK</button><button type="button" class="wf-bt" data-wf="exista-cancel">Cancel<span class="wf-ro">Anulare</span></button></div></div></div>`;
    }
    if(D.tip==='existaPdf'){
      return `<div class="wf-dlg" role="dialog" aria-label="Fișierul PDF există deja">${cap('Microsoft Word')}<div class="wf-dc">
        <p style="margin:0">You already have a file named <b>${esc(D.nume)}.pdf</b>. Do you want to replace it with this one?<span class="wf-ro">Ai deja un fișier cu acest nume. Îl înlocuiești cu acesta?</span></p>
        <div class="wf-dj"><button type="button" class="wf-bt pr" data-wf="exista-ok">OK</button><button type="button" class="wf-bt" data-wf="exista-cancel">Cancel<span class="wf-ro">Anulare</span></button></div></div></div>`;
    }
    if(D.tip==='odt'){
      return `<div class="wf-dlg" role="dialog" aria-label="Păstrezi formatul .odt?">${cap('Microsoft Word')}<div class="wf-dc">
        <p style="margin:0"><b>${esc(D.doc)}</b> may contain features that are not compatible with this format. Do you want to continue to save in this format?<span class="wf-ro">Word te întreabă dacă păstrezi formatul .odt.</span></p>
        <label class="wf-bifa"><input type="checkbox"> Don't show this message again</label>
        <div class="wf-dj"><button type="button" class="wf-bt pr" data-wf="odt-da">Yes<span class="wf-ro">Da</span></button><button type="button" class="wf-bt" data-wf="odt-nu">No<span class="wf-ro">Nu</span></button></div></div></div>`;
    }
    return '';
  }
  function explorer(){
    const E=st.expl;if(!E)return '';
    return `<div class="wf-dlg" role="dialog" aria-label="Explorer (Explorer de fișiere)"><div class="wf-dt"><span>Explorer <span class="wf-ro" style="display:inline">(Explorer de fișiere)</span></span><button type="button" data-wf="expl-x" aria-label="Închide Explorer">✕</button></div><div class="wf-dc">
      <div class="wf-cale">Acest PC › ${FOLDERE[E.folder].n}</div><div class="wf-fer2">${nav(E.folder)}<div>${listaFisiere(E.folder,null,E.sel)}</div></div>
      <div class="wf-dj"><button type="button" class="wf-bt pr" data-wf="expl-deschide" ${E.sel==null?'disabled':''}>Deschide (Enter)</button></div>
      <p class="hint">În Explorer deschizi un fișier cu dublu-clic pe el (sau îl alegi și apeși Enter). Aici: atinge-l, apoi „Deschide”, sau dublu-clic.</p></div></div>`;
  }
  function taskbar(){
    return `<div class="wf-ta" role="toolbar" aria-label="Bara de activități din Windows"><button type="button" data-wf="startmeniu" aria-expanded="${!!st.start}">⊞ Start</button><button type="button" data-wf="explorer" class="${st.expl?'on':''}">Explorer</button>
      ${st.word!=='inchis'?(st.docs.length?st.docs.map((d,k)=>`<button type="button" data-fer="${k}" class="${k===st.activ&&!st.expl?'on':''}" title="Fereastra ${esc(numeDoc(d))} - Word">W ${esc(numeDoc(d))}</button>`).join(''):`<button type="button" class="on" data-fer="-1">W Word</button>`):''}</div>`;
  }
  function desen(){
    let h='';
    if(st.word==='inchis'){
      h=`<div class="wf-desk"><div><b>Word e închis.</b> Pe ecran e doar desktopul Windows.</div>
        ${st.start?`<div class="wf-meniu-start" role="menu" aria-label="Meniul Start"><b style="font-size:.8rem">Meniul Start</b><button type="button" class="wf-bt" data-wf="porneste" role="menuitem">W  Word</button></div>`:'<div class="hint" style="color:#e8eefc">Pornești Word din meniul Start (butonul ⊞ Start de jos).</div>'}${explorer()}</div>`;
    }else if(st.word==='start'){
      h=barTitlu()+(st.dlg?dialog():backstage(true))+(st.expl?explorer():'');
      if(st.start)h+=`<div class="wf-desk" style="min-height:0"><div class="wf-meniu-start" role="menu" aria-label="Meniul Start"><b style="font-size:.8rem">Meniul Start</b><button type="button" class="wf-bt" data-wf="porneste" role="menuitem">W  Word</button></div></div>`;
    }else{
      const d=activ(st);
      h=barTitlu();
      if(st.expl)h+=explorer();
      else if(st.ecran==='bs')h+=backstage(false);
      else{
        if(d&&d.vedere==='read')h+=barCitire();else h+=`<div class="wf-rb" role="toolbar" aria-label="Panglica din Word">${panglica()}</div>`+(st.fila==='TabView'&&real?
          '':'');
        if(d&&d.pv)h+=barPV();
        h+=st.dlg?dialog():pagina();
        h+=barStare();
      }
      if(st.start)h+=`<div class="wf-desk" style="min-height:0"><div class="wf-meniu-start" role="menu" aria-label="Meniul Start"><b style="font-size:.8rem">Meniul Start</b><button type="button" class="wf-bt" data-wf="porneste" role="menuitem">W  Word</button></div></div>`;
    }
    ferEl.innerHTML=h+taskbar();
    notaEl.innerHTML=st.nota||'';
    testEl.innerHTML=teste(Q,st).map(t=>`<li class="${t.ok?'ok':''}"><span class="ic" aria-hidden="true">${t.ok?'✔':'○'}</span><span>${esc(t.ce)}${t.ok?'<span class="sr-only"> — gata</span>':''}</span></li>`).join('');
  }
  /* câmpurile din fereastra deschisă: se citesc înainte de orice acțiune (ca textul scris să nu se piardă la redesenare) */
  function citesteCampuri(){
    const D=st.dlg;if(!D)return;
    const q=s=>ferEl.querySelector(`[data-camp="${s}"]`);
    if(q('nume'))D.nume=q('nume').value;
    if(q('tip'))D.ext=q('tip').value;
    if(q('loc'))D.folder=q('loc').value;
    if(q('pdfdeschide'))D.pdfDeschide=q('pdfdeschide').checked;
    const a=ferEl.querySelector('[data-camp="alege"]:checked');if(a)D.alegere=a.value;
  }
  function fa(k){
    const d=activ(st);
    if(st.dlg&&k!=='esc'&&k!=='enter'){nota(st,'Întâi închide fereastra deschisă: Save (Salvare) sau Cancel (Anulare). Până atunci Word nu primește alte comenzi.');return}
    if(k==='ctrln'){if(st.word==='inchis'){nota(st,'Word e închis. Pornește-l din meniul Start.');return}docNouGol(st,null);st.jurnal.push({op:'ctrln'});return}
    if(k==='ctrlo'){if(st.word==='inchis'){nota(st,'Word e închis. Pornește-l din meniul Start.');return}if(st.word==='start'){st.bs='open';return}st.ecran='bs';st.bs='open';st.dlg=null;return}
    if(k==='ctrls'){ctrlS(st);return}
    if(k==='f12'){f12(st);return}
    if(k==='ctrlw'){if(st.word==='inchis'){nota(st,'Word e închis.');return}inchideDoc(st,false);return}
    if(k==='esc'){if(st.dlg){st.dlg=null;nota(st,'Fereastra s-a închis (ca la Cancel).');return}if(st.meniuCitire){st.meniuCitire=false;return}
      if(d&&d.vedere==='read'){seteazaVedere(st,'print');return}if(st.ecran==='bs'){st.ecran='doc';return}
      if(st.word==='start'){docNouGol(st,null);nota(st,'Esc pe pagina de început face un document nou, gol (ca în Word).');return}nota(st,'Esc: nu e nimic de închis acum.');return}
    if(k==='enter'){const t=inp?inp.value:'';if(tasteaza(st,t,true)&&inp)inp.value='';return}
  }
  function pas(f){citesteCampuri();f();desen()}
  const focusRad=()=>{try{rad.focus({preventScroll:true})}catch(e){}};

  body.addEventListener('click',e=>{
    if(api.done())return;
    const b=e.target.closest('button,[data-rec],[data-fis]');if(!b||!body.contains(b))return;
    const ds=b.dataset;
    /* fereastra deschisă (Save As, Open, întrebările) e MODALĂ, ca în Windows: până apeși Save/OK/Cancel, Word nu primește
       alte clicuri sau taste. Enter-ul de pe ecran apasă butonul principal al ferestrei, ca Enter în Word. */
    const MODAL=['saveas','open','savethis','inchidere','exista','existaPdf','odt'];
    if(st.dlg&&MODAL.includes(st.dlg.tip)&&ds.wf!=='reset'&&!b.closest('.wf-dlg')){
      if(ds.tasta==='enter'){citesteCampuri();const p=ferEl.querySelector('.wf-dlg .wf-bt.pr');if(p&&!p.disabled)p.click();return}
      if(ds.tasta==='esc'){pas(()=>fa('esc'));return}
      pas(()=>nota(st,'Întâi închide fereastra deschisă: Save (Salvare), OK sau Cancel (Anulare). Până atunci Word nu primește alte clicuri.'));return}
    if(ds.wf==='reset'){st=stareInit(Q);if(inp)inp.value='';nota(st,'Totul e din nou ca la început.');desen();return}
    if(ds.tasta){pas(()=>{if(ds.tasta==='enter'){fa('enter')}else{const t=inp?inp.value:'';if(t&&ds.tasta!=='esc'&&!(st.dlg&&MODAL_TIPURI.includes(st.dlg.tip))){tasteaza(st,t,false);inp.value=''}fa(ds.tasta)}});return}
    if(ds.tab){pas(()=>{st.fila=ds.tab;nota(st,'')});return}
    if(ds.nesim){pas(()=>nota(st,`„${esc(b.getAttribute('aria-label')||ds.nesim)}” e și în Word, dar în lecția asta nu-l folosim.`));return}
    if(ds.v){pas(()=>seteazaVedere(st,ds.v));return}
    if(ds.bs){pas(()=>{const k=ds.bs;
      if(k==='back'){st.ecran='doc';return}
      if(k==='save'){if(d0()&&d0().nume){ctrlS(st)}else{st.bs='saveas'}return}
      if(k==='close'){st.ecran='doc';inchideDoc(st,false);return}
      st.bs=k;nota(st,'')});return}
    if(ds.sablon){pas(()=>{docNouGol(st,ds.sablon);st.jurnal.push({op:'sablon'})});return}
    if(ds.rec!=null){pas(()=>{const r=st.recente[+ds.rec],f=r&&gasesteF(st,r.folder,r.nume,r.ext);if(f)deschideFisier(st,f);else nota(st,'Fișierul nu mai e acolo (a fost mutat sau șters).')});return}
    if(ds.folder){pas(()=>{if(st.expl&&!st.dlg){st.expl.folder=ds.folder;st.expl.sel=null}else if(st.dlg){st.dlg.folder=ds.folder;st.dlg.sel=null}});return}
    if(ds.fis!=null){const k=+ds.fis;
      /* alegerea unui fișier în Open / Explorer NU redesenează lista: al doilea clic al unui dublu-clic trebuie să
         cadă pe același element, altfel browserul nu mai trimite dblclick (probat cu mouse-ul, 28.09.2026) */
      if((st.expl&&!st.dlg)||(st.dlg&&st.dlg.tip==='open')){
        if(st.expl&&!st.dlg)st.expl.sel=k;else st.dlg.sel=k;
        body.querySelectorAll('[data-fis]').forEach(x=>{const on=+x.dataset.fis===k;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});
        const o=ferEl.querySelector('[data-wf="open-ok"],[data-wf="expl-deschide"]');if(o)o.disabled=false;
        const n=ferEl.querySelector('[data-camp="numeO"]');if(n)n.value=st.fs[k].nume;
        return}
      pas(()=>{if(st.dlg&&st.dlg.tip==='saveas'){st.dlg.nume=st.fs[k].nume;nota(st,`Ai ales numele <b>${esc(st.fs[k].nume)}</b>: e numele unui fișier care EXISTĂ deja.`)}});return}
    if(ds.fer!=null){pas(()=>{st.expl=null;st.start=false;if(+ds.fer>=0){st.activ=+ds.fer;st.ecran='doc'}});return}
    const w=ds.wf;if(!w)return;
    pas(()=>{
      const D=st.dlg;
      const modal=['saveas','open','savethis','inchidere','exista','existaPdf','odt'];
      if(D&&modal.includes(D.tip)&&['x','file','min','max','startmeniu','explorer','browse-open','browse-save','blank','z100','zminus','zplus','enable','meniuview'].includes(w)){nota(st,'Întâi închide fereastra deschisă: Save (Salvare) sau Cancel (Anulare). Până atunci Word nu primește alte clicuri.');return}
      if(w==='x'){inchideDoc(st,true)}
      else if(w==='min'||w==='max')nota(st,'Butonul acesta schimbă doar mărimea ferestrei. În lecția asta nu-l folosim.');
      else if(w==='file'){st.ecran='bs';st.bs='home';st.meniuCitire=false}
      else if(w==='meniuview')st.meniuCitire=!st.meniuCitire;
      else if(w==='nesim')nota(st,`„${esc(ds.n||'')}” e și în Word, dar în lecția asta nu-l folosim.`);
      else if(w==='z100'){seteazaZoom(st,100);nota(st,'Zoom 100%: mărimea obișnuită.')}
      else if(w==='zminus'){const d=d0();if(d)seteazaZoom(st,d.zoom>100?Math.max(100,d.zoom-8):d.zoom-2)}
      else if(w==='zplus'){const d=d0();if(d)seteazaZoom(st,d.zoom<100?Math.min(100,d.zoom+2):d.zoom+8)}
      else if(w==='enable'){const d=d0();if(d){d.pv=false;if(d.vedere==='read')d.vedere='print';st.jurnal.push({op:'enable'});nota(st,'Bara galbenă a dispărut: acum poți scrie în document.')}}
      else if(w==='blank'){docNouGol(st,null);st.jurnal.push({op:'blank'})}
      else if(w==='browse-open'){st.dlg={tip:'open',folder:'doc',sel:null};st.ecran='doc'}
      else if(w==='browse-save'){st.ecran='doc';f12(st)}
      else if(w==='dlg-x'){st.dlg=null;st.dupaSalvare=null;nota(st,'Fereastra s-a închis. Nu s-a salvat nimic.')}
      else if(w==='saveas-ok'&&D)incearcaSalvare(st,D.folder,D.nume,D.ext,{deschide:D.pdfDeschide});
      else if(w==='savethis-ok'&&D)incearcaSalvare(st,D.folder,D.nume,'docx',{});
      else if(w==='more'&&D){const n=D.nume;st.dlg=null;st.ecran='bs';st.bs='saveas';st._numePropus=n}
      else if(w==='open-ok'&&D&&D.sel!=null)deschideFisier(st,st.fs[D.sel]);
      else if(w==='c-save'&&D){const d=d0();if(d&&d.nume){ctrlS(st);inchideDoc(st,D.fereastra,true)}else{st.dupaSalvare=D.fereastra?'fereastra':'doc';incearcaSalvare(st,D.folder,D.nume,'docx',{})}}
      else if(w==='c-dont'&&D)inchideDoc(st,D.fereastra,true);
      else if(w==='c-cancel'){st.dlg=null;nota(st,'Ai apăsat Cancel (Anulare): documentul a rămas deschis, cu tot ce ai scris.')}
      else if(w==='exista-ok'&&D){
        if(D.alegere==='inlocuieste'){const inapoi=D.inapoi;st.dlg=inapoi;executaSalvare(st,D.folder,D.nume,D.ext,Object.assign({},D.opt,{inlocuieste:true}));st.jurnal.push({op:'inlocuit',nume:D.nume});}
        else if(D.alegere==='altnume'){st.dlg=D.inapoi||null;nota(st,'Scrie alt nume, apoi Save.')}
        else nota(st,'Îmbinarea (Merge) nu o folosim în lecția asta. Alege Cancel și schimbă numele.')}
      else if(w==='odt-da'&&D){const inapoi=D.inapoi;st.dlg=inapoi;incearcaSalvare(st,D.folder,D.nume,D.ext,Object.assign({},D.opt,{da:true}))}
      else if(w==='odt-nu'&&D){st.dlg=D.inapoi||null;nota(st,'Ai apăsat No (Nu): nu s-a salvat nimic. Ești din nou în fereastra Save As.')}
      else if(w==='exista-cancel'&&D){st.dlg=D.inapoi||null;st.dupaSalvare=null;nota(st,'Nu s-a salvat nimic. Schimbă numele (de exemplu adaugă o cifră) și apasă din nou Save.')}
      else if(w==='startmeniu')st.start=!st.start;
      else if(w==='porneste'){st.start=false;pornesteWord(st)}
      else if(w==='explorer'){st.expl=st.expl?null:{folder:'doc',sel:null};st.start=false}
      else if(w==='expl-x')st.expl=null;
      else if(w==='expl-deschide'&&st.expl&&st.expl.sel!=null){const f=st.fs[st.expl.sel];if(DESCHIDE_WORD.includes(f.ext)){st.expl=null;deschideFisier(st,f)}else nota(st,'Un PDF se deschide cu programul de PDF (de obicei browserul), nu cu Word. În lecția asta nu-l deschidem.')}
    });
  });
  const d0=()=>activ(st);
  body.addEventListener('dblclick',e=>{
    if(api.done())return;
    const b=e.target.closest('[data-fis]');if(!b)return;
    pas(()=>{const f=st.fs[+b.dataset.fis];
      if(st.dlg&&st.dlg.tip==='open')deschideFisier(st,f);
      else if(st.expl){if(DESCHIDE_WORD.includes(f.ext)){st.expl=null;deschideFisier(st,f)}else nota(st,'Un PDF se deschide cu programul de PDF (de obicei browserul), nu cu Word. În lecția asta nu-l deschidem.')}});
  });
  body.addEventListener('input',e=>{
    const t=e.target;
    if(t.matches('[data-wf="zslider"]')){const d=activ(st);if(d){seteazaZoom(st,+t.value);const p=ferEl.querySelector('.wf-pr');if(p)p.textContent=d.zoom+'%';const pg=ferEl.querySelector('.wf-pag');if(pg)pg.style.fontSize=(16*d.zoom/100).toFixed(1)+'px';testEl.innerHTML=teste(Q,st).map(x=>`<li class="${x.ok?'ok':''}"><span class="ic" aria-hidden="true">${x.ok?'✔':'○'}</span><span>${esc(x.ce)}</span></li>`).join('')}}
  });
  body.addEventListener('change',e=>{if(e.target.matches('[data-camp="tip"]')&&st.dlg){citesteCampuri();const D=st.dlg;D.nume=cuExt(D.nume,D.ext);desen()}});
  body.addEventListener('keydown',e=>{
    if(api.done())return;
    if(e.target===inp&&e.key==='Enter'){e.preventDefault();pas(()=>fa('enter'));inp.focus({preventScroll:true});return}
    /* Enter în caseta File name salvează, ca în Word (probat de judecător: fereastra se închide, fișierul apare) */
    if(e.key==='Enter'&&e.target.matches('[data-camp="nume"]')&&st.dlg){e.preventDefault();
      const b=ferEl.querySelector('[data-wf="saveas-ok"],[data-wf="savethis-ok"],[data-wf="c-save"]');if(b)b.click();return}
    /* tastele reale fac EXACT ce fac butoanele de pe ecran: întâi textul rămas în caseta „Tastatura” intră în document
       (în Word ce tastezi e deja în document), apoi comanda (judecata 2, M1: F12 real salva fișa fără nume) */
    const tastaReala=k=>{e.preventDefault();pas(()=>{const t=inp?inp.value:'';if(t&&!(st.dlg&&MODAL_TIPURI.includes(st.dlg.tip))){tasteaza(st,t,false);inp.value=''}fa(k)});focusRad()};
    if(e.ctrlKey&&!e.altKey&&(e.key==='s'||e.key==='S'||e.key==='o'||e.key==='O')){tastaReala(e.key.toLowerCase()==='s'?'ctrls':'ctrlo');return}
    if(e.key==='F12'&&!e.ctrlKey){tastaReala('f12');return}
    if(e.key==='Escape'&&!e.target.matches('select')){e.preventDefault();pas(()=>fa('esc'));focusRad()}
  });

  const nav2=api.checkButton(()=>{
    citesteCampuri();desen();
    const T=teste(Q,st),bad=T.filter(t=>!t.ok);
    focusRad();
    if(!bad.length){nav2.innerHTML='';api.resolve(true);return}
    api.resolve(false,`${T.length-bad.length} din ${T.length} teste trecute. ${bad[0].cum}`);
    api.revealButton(()=>{st=stareDin(Q,Q.solutie);st.nota='Uite starea de la final, făcută cu pașii corecți.';desen();nav2.innerHTML='';
      api.giveUp('Word arată acum ca la finalul sarcinii. Citește testele bifate și nota de deasupra lor.')});
  });
  body._wf={set:ops=>{st=stareDin(Q,ops);desen()},stare:()=>st};
  desen();
}
G.TipWordFisier={render,rezolva(Q,body){body._wf.set(Q.solutie||[])},gresit(Q,body){body._wf.set(Q.tipic||[])},teste,stareDin,stareInit,executa};
if(typeof module!=='undefined'&&module.exports)module.exports={teste,stareDin,stareInit,executa};
})(typeof window!=='undefined'?window:globalThis);
