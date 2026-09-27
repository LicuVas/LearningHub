/* lectii/_sim/wordobj.js — Word-ul simulat al lecțiilor clasei a VII-a (LearningHub, revizuirea din 27.09.2026).

   PROPRIETAR: autorul lecției VII · M1 · 5 („Operații de editare: copiere, mutare, ștergere”).
   PORNIT DIN: simulatorul `wordobj` al lecției 4 (lectii/vii/m1-l04/index.html), copiat după reparatii.md (27.09.2026).
   Lecția 4 rămâne cu copia ei. NU o muta pe acest fișier până nu i se schimbă textul: aici o atingere pune cursorul ACOLO
   unde atingi (ca în Word), iar lecția 4 spune „atinge paragraful” (cursorul la capăt) — pe acest fișier atelierul ei iese
   7 din 9 (judecătorul, 27.09.2026). Configurația e aceeași (unelte, start, cere) după ce textul cere „atinge după ultima literă”.

   CE ADAUGĂ: cursorul pus între litere, selectarea textului și editarea, ca în Word.
   - Selectare: tragi cu mouse-ul sau cu degetul; dublu-clic (două atingeri repezi) = un „cuvânt Word” (cuvântul + spațiile
     de după; punctuația e cuvânt separat); triplu-clic = paragraful cu semnul lui; Ctrl+clic = propoziția; Shift+clic și
     Shift+săgeți măresc selecția; Ctrl+A = tot. Un clic simplu anulează selecția.
   - Ștergere: Delete (dreapta cursorului), Backspace (stânga), Ctrl+Backspace / Ctrl+Delete (un cuvânt); cu text selectat
     șterg tot textul selectat. La capătul paragrafului, Delete unește paragraful următor; Backspace la început îl unește
     cu cel de deasupra (paragraful rezultat păstrează aspectul celui de sus, ca în Word).
   - Clipboard: Ctrl+C / Ctrl+X / Ctrl+V, butoanele Home › Clipboard (Copy / Cut / Paste), meniul de la clic dreapta.
     Cut și Copy sunt gri fără selecție, Paste e gri cu clipboardul gol (ca în Word). Lipirea peste o selecție o înlocuiește.
   - Tastarea peste o selecție o înlocuiește; Enter cu text selectat îl înlocuiește cu un paragraf nou.
   - Tragerea unui text selectat îl MUTĂ (Ctrl ținut la eliberare = copiere); clipboardul nu se schimbă (ca în Word).
   - Ctrl+Z anulează, Ctrl+Y reface (tastarea legată se anulează dintr-o dată).
   - SPAȚIILE: Word are pornit implicit „Smart cut and paste” („Adjust sentence and word spacing automatically”).
     Regulile de mai jos (stergeSmart, lipesteSmart) sunt scoase din 138 de cazuri rulate în Word-ul real prin COM
     (lectii/vii/m1-l05/_proba/cazuri_word.json) și se verifică pe ele cu proba_sim_vs_word.js (trebuie 0 diferențe).

   CE NU SE POATE PROBA PRIN COM (gesturile de mouse/ecran) e scris în lectii/vii/m1-l05/afirmatii.json.
   Abateri spuse pe ecran: pe telefon tastele Ctrl+… sunt butoane; meniul de clic dreapta are un singur „Paste”.

   API (tipul de exercițiu `wordobj` al motorului): render(Q, body, api), rezolva(Q, body), gresit(Q, body).
   Configurația unui exercițiu de EDITARE: {t:'wordobj', unelte:['text','editare','anulare'], q, start:[…],
     tinta:[…] (documentul cerut), verif:[{ce, selectat}|{ce, text, de}|{ce, par, incepe|termina|egal}|{ce, foloseste:
     'copiere'|'mutare'|'stergere'|'anulare'}], tipic:[…] (greșeala tipică, pentru poartă), tipicSel:'…'}.
   Configurația lecției 4 (INSERARE): {t:'wordobj', unelte:['text','inserare'], start, cere:[{tip:'text'|'poza'|'tabel',…}]}. */
(function(G){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* comparația textului pentru testele de inserare (lecția 4): fără diacritice, fără majuscule, spațiile strânse, fără
   punctuația de la capăt (îngăduința ține de NOTARE; documentul arată exact ce a tastat elevul) */
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[„”"]/g,'').toLowerCase().replace(/\s+/g,' ').trim().replace(/[.:!;,]+$/,'').trim();

/* ---------------- pozele (lecția 4) ---------------- */
const FIS={
  'floarea-soarelui.png':{cls:'fs',alt:'desen: o floare-soarelui galbenă, pe cer albastru',dosar:'img'},
  'cetatea-neamt.jpg':{cls:'ce',alt:'desen: zidurile unei cetăți, pe un deal verde',dosar:'img'},
  'lacul-bicaz.jpg':{cls:'lb',alt:'desen: un lac albastru între munți',dosar:'img'},
  'harta-traseului.png':{cls:'ha',alt:'desen: o hartă cu traseul trasat cu roșu',dosar:'img'},
  'pisica.png':{cls:'pi',alt:'desen: capul unei pisici albe',dosar:'desc'}
};
const LISTA=Object.keys(FIS);
const DOSARE={img:'Imagini (Pictures)',desc:'Descărcări (Downloads)'};
const undeE=f=>FIS[f]&&FIS[f].dosar==='desc'?` (e în folderul ${DOSARE.desc})`:'';
/* În Word o poză pusă în text e UN caracter. Aici e un caracter din zona privată Unicode (U+E000 + nr. fișierului). */
const IMGCH={},CHIMG={};
LISTA.forEach((f,i)=>{const c=String.fromCharCode(0xE000+i);IMGCH[f]=c;CHIMG[c]=f});
const eImg=c=>!!CHIMG[c];

/* ---------------- MODELUL WORD PENTRU SPAȚII (probat pe cazuri_word.json) ---------------- */
const LIT=/[\p{L}\p{N}]/u;          // litere (cu diacritice) și cifre
const PUNCT=/[.,;:!?]/;
const DESCHIDE=/[(\[{„“«"]/;
/* ștergerea unei SELECȚII (Delete, Backspace, Cut): după scoatere, dacă au rămas două spații alăturate sau un spațiu la
   începutul paragrafului, Word scoate unul; dacă a rămas „spațiu + punct”, scoate spațiul. Spațiul rămas la capăt rămâne. */
function stergeSmart(s,a,b){
  let r=s.slice(0,a)+s.slice(b),o=a;
  const L=r[o-1],R=r[o];
  if((L===undefined||L===' ')&&R===' ')r=r.slice(0,o)+r.slice(o+1);
  else if(L===' '&&R!==undefined&&PUNCT.test(R)){r=r.slice(0,o-1)+r.slice(o);o--}
  return {s:r,o};
}
/* lipirea: spațiul de la începutul textului lipit cade la început de paragraf sau după un spațiu; între o literă (sau un
   semn de punctuație) și textul lipit care începe cu literă, Word adaugă un spațiu. La capăt: textul care se termină cu
   literă și e urmat de literă primește un spațiu; după punct NU (de aceea „8.Aduceți” rămâne lipit). Spațiul de la
   capătul textului lipit cade la capătul paragrafului, înaintea punctuației și înaintea unui spațiu (dacă e după literă). */
function lipesteSmart(s,p,t){
  const L=s[p-1],R=s[p];let T=t;
  if(/^ /.test(T)){if(L===undefined||L===' ')T=T.replace(/^ +/,'')}
  else if(T&&LIT.test(T[0])&&L!==undefined&&L!==' '&&L!=='\t'&&!DESCHIDE.test(L))T=' '+T;
  if(/ $/.test(T)){
    const ina=T.replace(/ +$/,'').slice(-1);
    if(R===undefined||PUNCT.test(R)||(R===' '&&LIT.test(ina)))T=T.replace(/ +$/,'');
  }else if(T&&LIT.test(T[T.length-1])&&R!==undefined&&LIT.test(R))T=T+' ';
  return {s:s.slice(0,p)+T+s.slice(p),o:p+T.length};
}
/* „cuvântul Word” (dublu-clic, Ctrl+săgeată): literele/cifrele legate + spațiile de după; fiecare semn de punctuație e un
   cuvânt separat, tot cu spațiile de după („Bicaz”, „. ”, „Floarea”, „-”, „soarelui ”, „8”, „:”, „30”). */
function unitCuvant(t,i){
  if(!t.length)return [0,0];
  if(i>=t.length)i=t.length-1;if(i<0)i=0;
  const sp=c=>c===' '||c==='\t';
  if(sp(t[i])){let a=i;while(a>0&&sp(t[a-1]))a--;if(a===0){let b=i;while(b<t.length&&sp(t[b]))b++;return [0,b]}i=a-1}
  let a=i,b=i+1;
  if(LIT.test(t[i])){while(a>0&&LIT.test(t[a-1]))a--;while(b<t.length&&LIT.test(t[b]))b++}
  while(b<t.length&&sp(t[b]))b++;
  return [a,b];
}
/* propoziția (Ctrl+clic): până la . ! ? urmat de spațiu sau de capăt, cu spațiile de după */
function unitPropozitie(t,i){
  let a=0;
  for(let k=0;k<t.length;k++){
    if(/[.!?]/.test(t[k])&&(k+1>=t.length||t[k+1]===' '||/[.!?]/.test(t[k+1]))){
      let e=k+1;while(e<t.length&&/[.!?]/.test(t[e]))e++;while(e<t.length&&t[e]===' ')e++;
      if(i<e)return [a,e];a=e;k=e-1;
    }
  }
  return [a,t.length];
}
const MODEL={stergeSmart,lipesteSmart,unitCuvant,unitPropozitie};

/* ---------------- documentul ---------------- */
const P=t=>({k:'p',t:t||''});
const clone=d=>JSON.parse(JSON.stringify(d));
function mk(start){return (start||[]).map(b=>{
  if(typeof b==='string')return P(b);
  if(b&&b.titlu!=null)return {k:'p',t:String(b.titlu),titlu:true};
  if(b&&b.tabel)return {k:'t',c:b.tabel.map(r=>r.slice())};
  if(b&&b.k==='p'&&b.s)return Object.assign({k:'p',t:b.s.map(x=>x.img?IMGCH[x.img]:(x.x||'')).join('')},b.titlu?{titlu:true}:{});
  if(b&&b.k==='p')return Object.assign({k:'p',t:b.t||''},b.titlu?{titlu:true}:{});
  if(b&&b.k==='t')return {k:'t',c:b.c.map(r=>r.slice())};
  return P('');
})}
const ptext=p=>p.t.replace(/[-]/g,'');
const pimgs=p=>[...p.t].filter(eImg).map(c=>CHIMG[c]);
const gol=b=>b.k==='p'&&!b.t.replace(/\s/g,'');
function gaseste(doc,dupa){
  if(dupa&&typeof dupa==='object'&&dupa.poza)return doc.findIndex(b=>b.k==='p'&&b.t.includes(IMGCH[dupa.poza]));
  const n=norm(dupa);let i=doc.findIndex(b=>b.k==='p'&&norm(ptext(b))===n);
  if(i<0)i=doc.findIndex(b=>b.k==='p'&&norm(ptext(b)).startsWith(n));
  return i;
}
function urmator(doc,i){for(let j=i+1;j<doc.length;j++)if(!gol(doc[j]))return j;return -1}
function scurt(d){if(d&&typeof d==='object'&&d.poza)return 'poza '+d.poza;const w=String(d).split(' ');return '„'+w.slice(0,4).join(' ')+(w.length>4?'…':'')+'”'}
const cuvColoane=n=>n===1?'o coloană':n+' coloane', cuvRanduri=n=>n===1?'un rând':n+' rânduri';
const cuvOri=n=>n===1?'o dată':n===2?'de două ori':`de ${n} ori`;

/* ---------------- TESTELE ---------------- */
/* inserare (lecția 4): fiecare cerință e un test cu nume */
function testeInserare(Q,doc){
  const T=[],add=(ce,ok,cum)=>T.push({ce,ok:!!ok,cum:cum||''});
  const st=mk(Q.start);
  const orig=st.filter(b=>b.k==='p'&&ptext(b).trim()).map(b=>norm(ptext(b)));
  const acum=doc.filter(b=>b.k==='p'&&ptext(b).trim()).map(b=>norm(ptext(b)));
  let j=0;acum.forEach(x=>{if(j<orig.length&&x===orig[j])j++});
  add('Textul de la început a rămas cum era',j===orig.length,'Unul dintre rândurile de la început s-a schimbat: probabil ai tastat în el fără să apeși întâi Enter. Apasă „Ia-o de la capăt” și reia.');
  let nImg=0,nTab=st.filter(b=>b.k==='t').length;
  (Q.cere||[]).forEach(op=>{
    const ia=gaseste(doc,op.dupa),sub=ia>=0?urmator(doc,ia):-1,B=sub>=0?doc[sub]:null;
    if(op.tip==='text'){
      add(`Sub ${scurt(op.dupa)} e un rând nou cu textul „${op.text}”`,B&&B.k==='p'&&!pimgs(B).length&&norm(ptext(B))===norm(op.text),
        `Pune cursorul la capătul rândului ${scurt(op.dupa)}, apasă Enter, apoi tastează exact „${op.text}”.`);
    }else if(op.tip==='poza'){
      nImg++;
      const ip=doc.findIndex(b=>b.k==='p'&&pimgs(b).includes(op.fisier)),Pp=ip>=0?doc[ip]:null;
      add(`Poza ${op.fisier} e în document`,!!Pp,`Inserare (Insert) › Imagini (Pictures) › Acest dispozitiv… (This Device…), clic pe ${op.fisier}${undeE(op.fisier)}, apoi Inserare (Insert).`);
      add(`Poza ${op.fisier} stă singură pe rândul ei`,Pp&&!ptext(Pp).trim()&&pimgs(Pp).length===1,
        Pp&&ptext(Pp).trim()?'Poza s-a lipit de text, pe același rând. Înainte de inserare: clic la capătul paragrafului, apoi Enter.':'Poza trebuie să stea singură pe un rând.');
      add(`Poza ${op.fisier} e imediat sub ${scurt(op.dupa)}`,Pp&&sub===ip,`Pune cursorul pe rândul gol de sub ${scurt(op.dupa)} înainte să inserezi poza.`);
    }else if(op.tip==='tabel'){
      nTab++;
      const tb=B&&B.k==='t'?B:null;
      add(`Sub ${scurt(op.dupa)} e un tabel`,!!tb,`Pune cursorul la capătul rândului ${scurt(op.dupa)}, apoi Inserare (Insert) › Tabel (Table).`);
      const t=tb||doc.find((b,k)=>b.k==='t'&&k>ia),R=t?t.c.length:0,C=t&&t.c[0]?t.c[0].length:0;
      add(`Tabelul are ${cuvColoane(op.c)} și ${cuvRanduri(op.r)}`,t&&R===op.r&&C===op.c,
        t?`Acum are ${cuvColoane(C)} și ${cuvRanduri(R)}. Pe grilă numeri întâi coloanele (de-a latul), apoi rândurile (în jos).${R>op.r?' Ai apăsat Tab în ultima celulă? Așa apare un rând nou.':''} Apasă „Ia-o de la capăt” și reia.`:'Încă nu există tabelul.');
      if(op.celule){
        let gres=null;
        if(t&&R===op.r&&C===op.c)outer:for(let r=0;r<op.r;r++)for(let c=0;c<op.c;c++){if(norm(t.c[r][c])!==norm(op.celule[r][c])){gres=[r,c];break outer}}
        add('În celule scrie exact ce cere sarcina',t&&R===op.r&&C===op.c&&!gres,
          gres?`În rândul ${gres[0]+1}, coloana ${gres[1]+1} trebuie să scrie „${op.celule[gres[0]][gres[1]]}”; acum scrie „${t.c[gres[0]][gres[1]].trim()}”. Atinge celula și corectează cu ⌫; de la o celulă la alta treci cu Tab.`:'Întâi tabelul cu mărimea cerută, apoi textul din celule.');
      }
    }
  });
  const imgs=doc.reduce((a,b)=>a+(b.k==='p'?pimgs(b).length:0),0),tabs=doc.filter(b=>b.k==='t').length;
  if((Q.cere||[]).some(o=>o.tip!=='text'))
    add('Nu sunt obiecte în plus',imgs===nImg&&tabs===nTab,`În document sunt ${imgs} ${imgs===1?'poză':'poze'} și ${tabs} ${tabs===1?'tabel':'tabele'}, iar sarcina cere ${nImg} și ${nTab}. Apasă „Ia-o de la capăt”.`);
  return T;
}
function numara(s,x){if(!x)return 0;let n=0,i=0;while((i=s.indexOf(x,i))>=0){n++;i+=x.length}return n}
const fara=s=>s.replace(/ +$/,'');   // spațiul de la capătul paragrafului nu se vede
/* unde diferă documentul de model: rând gol în plus, text sărit pe un rând nou, spațiu lipsă, spațiu în plus sau altceva */
function diferenta(a,b,cuZ){
  const reia=cuZ?'apasă Ctrl+Z (anulează ultima operație) sau „Ia-o de la capăt”':'apasă „Ia-o de la capăt” și reia';
  const eq=(x,y)=>fara(x)===fara(y);
  const lipsaSpatiu=(x,y)=>{x=fara(x);y=fara(y);let k=0;while(k<x.length&&k<y.length&&x[k]===y[k])k++;return y[k]===' '&&x.slice(k)===y.slice(k+1)};
  if(a.length===b.length+1){
    for(let k=0;k<a.length;k++){      // un rând gol în plus (de exemplu după lipirea unui paragraf întreg, cu semnul lui)
      if(a[k].trim())continue;
      const r=a.slice(0,k).concat(a.slice(k+1));
      if(r.every((x,i)=>eq(x,b[i]))){const sus=k>0?fara(a[k-1]):'';return `A rămas un rând gol${sus?` sub „…${sus.slice(-25)}”`:''}. Dă clic pe rândul gol și apasă o dată ⌫: dispare.`}
    }
    for(let k=0;k+1<a.length;k++){    // textul lipit a sărit pe un rând nou (selecția a prins și sfârșitul de paragraf)
      const r=a.slice(0,k).concat([a[k]+a[k+1]],a.slice(k+2));
      if(r.every((x,i)=>eq(x,b[i])||lipsaSpatiu(x,b[i]))){const jos=fara(a[k+1]);
        return `Un text a sărit pe un rând nou: „${jos.slice(0,28)}${jos.length>28?'…':''}” trebuia să stea pe același rând cu cel de deasupra. Dă clic chiar la începutul lui și apasă o dată ⌫: rândurile se unesc.${r.every((x,i)=>eq(x,b[i]))?'':' Apoi pune spațiul de după punct.'}`}
    }
  }
  if(a.length!==b.length)return `Documentul are ${a.length===1?'un paragraf':a.length+' paragrafe'}, iar modelul ${b.length===1?'unul':b.length}. Dacă s-a unit sau s-a rupt un paragraf, ${reia}.`;
  for(let i=0;i<a.length;i++){
    const x=fara(a[i]),y=fara(b[i]);if(x===y)continue;
    let k=0;while(k<x.length&&k<y.length&&x[k]===y[k])k++;
    const st=x.slice(Math.max(0,k-12),k).replace(/^\S*\s/,'');
    if(y[k]===' '&&x.slice(k)===y.slice(k+1))return `În paragraful ${i+1} lipsește un spațiu după „${st}”: s-au lipit două cuvinte. Pune cursorul între ele și apasă bara de spațiu.`;
    if(x[k]===' '&&x.slice(k+1)===y.slice(k))return `În paragraful ${i+1}, după „${st}” e un spațiu în plus (două spații la rând). Pune cursorul după ele și apasă o dată ⌫.`;
    return `Paragraful ${i+1} nu e încă la fel cu modelul: acum începe „${x.slice(0,28)}${x.length>28?'…':''}”. Compară-l cuvânt cu cuvânt cu sarcina; dacă te-ai încurcat, ${reia}.`;
  }
  return '';
}
/* testele măsoară EXACT gestul din numele lor (judecătorul, 27.09): copierea = Ctrl+C / Copiere (Copy) urmat de lipire;
   mutarea = Ctrl+X / Decupare (Cut) urmat de lipire (tragerea cu mouse-ul e alt gest: 'tragere'); ștergerea = Delete sau ⌫
   pe text selectat; anularea = Ctrl+Z după o ștergere, decupare sau lipire */
function folosit(log,fel){
  if(fel==='copiere')return log.some(x=>x.op==='v'&&x.src==='c');
  if(fel==='mutare')return log.some(x=>x.op==='v'&&x.src==='x');
  if(fel==='tragere')return log.some(x=>x.op==='drag');
  if(fel==='stergere')return log.some(x=>x.op==='dels');
  if(fel==='anulare'){const i=log.findIndex(x=>x.op==='dels'||x.op==='x'||x.op==='v');return i>=0&&log.slice(i+1).some(x=>x.op==='z')}
  return false;
}
const FOLOSIT_CUM={
  copiere:'Selectează textul, apasă Ctrl+C (Copiere), pune cursorul unde vrei copia și apasă Ctrl+V (Lipire).',
  mutare:'Selectează textul, apasă Ctrl+X (Decupare), pune cursorul la locul nou și apasă Ctrl+V (Lipire). Nu-l tasta din nou.',
  tragere:'Mută textul trăgându-l cu mouse-ul.',
  stergere:'Selectează tot textul de șters și apasă o singură dată Delete (sau ⌫), nu literă cu literă.',
  anulare:'Fă întâi ștergerea cerută, apoi apasă Ctrl+Z: ce ai șters revine.'
};
function cumFolosit(log,fel){
  if(fel==='mutare'&&log.some(x=>x.op==='drag'))return 'Ai mutat trăgând cu mouse-ul: și asta merge în Word, dar aici exersăm Ctrl+X (Decupare) și Ctrl+V (Lipire). Apasă Ctrl+Z și mută cu tastele.';
  if(fel==='mutare'&&folosit(log,'copiere'))return 'Ai copiat (Ctrl+C), iar copierea lasă textul și la locul vechi. Pentru mutare: Ctrl+X (Decupare), apoi Ctrl+V (Lipire).';
  if(fel==='copiere'&&log.some(x=>x.op==='dragc'))return 'Ai copiat trăgând cu Ctrl ținut: și asta merge în Word, dar aici exersăm Ctrl+C și Ctrl+V.';
  if(fel==='stergere'&&log.some(x=>x.op==='x'))return 'Ai folosit Ctrl+X (Decupare): textul a dispărut, dar așteaptă în clipboard. Aici exersăm ștergerea: selectezi și apeși Delete (sau ⌫).';
  return FOLOSIT_CUM[fel];
}
function testeEditare(Q,doc,st){
  const T=[],add=(ce,ok,cum)=>T.push({ce,ok:!!ok,cum:cum||''});
  const cuZ=(Q.unelte||[]).includes('anulare'),log=st.log||[];
  const zi=cuZ?'Ctrl+Z anulează ultima operație.':'Apasă „Ia-o de la capăt”.';
  const pars=doc.filter(b=>b.k==='p').map(ptext),tot=pars.join('\n');
  (Q.verif||[]).forEach(v=>{
    if(v.selectat!=null){
      const s=String(st.sel||'').replace(/^\s+|\s+$/g,'');
      add(v.ce||`Textul „${v.selectat}” e selectat`,s===v.selectat,
        !s?'Acum nu e nimic selectat. Trage peste text (cu mouse-ul sau cu degetul) sau dă dublu-clic pe cuvânt.':`Acum e selectat „${s.length>40?s.slice(0,40)+'…':s}”. Dă un clic în altă parte, apoi selectează exact „${v.selectat}”.`);
    }else if(v.text!=null&&v.de!=null){
      const n=numara(tot,v.text),cop=folosit(log,'copiere'),mut=folosit(log,'mutare');
      // întrebarea „ai copiat / ai decupat?” apare doar când jurnalul chiar arată gestul (judecătorul, 27.09)
      add(v.ce||`„${v.text}” apare ${cuvOri(v.de)}`,n===v.de,
        n>v.de?`„${v.text}” apare ${cuvOri(n)}. ${v.de===1&&cop&&!mut?'Ai copiat (Ctrl+C) în loc să muți (Ctrl+X)? ':''}${zi}`
        :n===0?`„${v.text}” nu mai e în document. ${cuZ?'Ctrl+Z îl aduce înapoi.':'Apasă „Ia-o de la capăt”.'}`
        :`„${v.text}” apare ${cuvOri(n)}. ${mut&&!cop?'Ai decupat (Ctrl+X) în loc să copiezi (Ctrl+C)? ':cop?'Ai copiat, dar nu tot textul: uită-te dacă selecția a prins și semnul de la capăt (. ! ?); cu dublu-clic, semnul rămâne pe dinafară. ':''}${zi}`);
    }else if(v.par!=null){
      const p=fara(pars[v.par-1]||'');
      const ok=v.incepe!=null?p.startsWith(v.incepe):v.termina!=null?p.endsWith(v.termina):p===v.egal;
      add(v.ce,ok,v.cum||`Paragraful ${v.par} acum: „${p.length>50?p.slice(0,50)+'…':p}”.`);
    }else if(v.sters!=null){
      add(v.ce,log.some(x=>x.op==='dels'&&String(x.t||'').trim()===v.sters),v.cum||`Selectează exact „${v.sters}” și apasă o dată Delete (sau ⌫).`);
    }else if(v.foloseste){
      add(v.ce,folosit(log,v.foloseste),v.cum||cumFolosit(log,v.foloseste));
    }
  });
  if(Q.tinta){
    const tg=mk(Q.tinta).filter(b=>b.k==='p').map(ptext);
    const la=pars.length===tg.length&&pars.every((x,i)=>fara(x)===fara(tg[i]));
    // tintaDupa: ținta se bifează abia după gesturile cerute (altfel, la „șterge și adu înapoi”, ar fi bifată de la început)
    const lipsa=(Q.tintaDupa||[]).find(f=>!folosit(log,f));
    add(Q.tintaCe||'Tot documentul arată exact ca în sarcină',la&&!lipsa,!la?diferenta(pars,tg,cuZ):lipsa?cumFolosit(log,lipsa):'');
  }
  return T;
}
function teste(Q,doc,st){return Q.cere?testeInserare(Q,doc):testeEditare(Q,doc,st||{})}
/* soluția (lecția 4): aceleași operații ca în Word */
function solutie(Q){
  if(!Q.cere)return mk(Q.tinta||Q.start);
  const d=mk(Q.start);
  (Q.cere||[]).forEach(op=>{
    const i=gaseste(d,op.dupa);
    if(op.tip==='text')d.splice(i+1,0,P(op.text));
    else if(op.tip==='poza')d.splice(i+1,0,P(IMGCH[op.fisier]));
    else if(op.tip==='tabel')d.splice(i+1,0,{k:'t',c:op.celule?op.celule.map(r=>r.slice()):Array.from({length:op.r},()=>Array(op.c).fill(''))},P(''));
  });
  return d;
}
/* greșeala tipică (lecția 4): poza fără Enter; tabelul întors; textul fără Enter. La editare: Q.tipic sau documentul de start. */
function gresitDoc(Q){
  if(!Q.cere)return mk(Q.tipic||Q.start);
  const ops=Q.cere||[],d=mk(Q.start);
  const pz=ops.find(o=>o.tip==='poza'),tb=ops.find(o=>o.tip==='tabel');
  ops.forEach(op=>{
    const i=gaseste(d,op.dupa);
    if(op.tip==='poza'){if(op===pz)d[i].t+=IMGCH[op.fisier];else d.splice(i+1,0,P(IMGCH[op.fisier]))}
    else if(op.tip==='tabel'){
      let c=op.celule?op.celule.map(r=>r.slice()):Array.from({length:op.r},()=>Array(op.c).fill(''));
      if(!pz&&op===tb)c=op.c!==op.r?Array.from({length:op.c},(_,r)=>Array.from({length:op.r},(_,k)=>(c[k]&&c[k][r])||'')):c.slice(0,op.r-1);
      d.splice(i+1,0,{k:'t',c},P(''));
    }
    else if(op.tip==='text'){if(!pz&&!tb)d[i].t+=' '+op.text;else d.splice(i+1,0,P(op.text))}
  });
  return d;
}

/* ---------------- stilul (o singură dată pe pagină) ---------------- */
const CSS=`
.wo{display:grid;gap:0;position:relative}
.wo button,.wo input{touch-action:manipulation}   /* pe telefon: atingerea unui buton lucrează pe loc, fără așteptarea pentru dublă atingere */
.wo-rb{border:1px solid var(--line);border-radius:8px 8px 0 0;overflow:hidden;background:var(--paper)}
.wo-rb .rb.pg{--xlg:#2B579A}
.wo-dlg:empty{display:none}
.wo-leg{margin:0;padding:6px 10px;border:1px solid var(--line);border-top:0;background:var(--paper2);font-size:.82rem}
.wo-pag{background:#E4E7EB;padding:10px;border:1px solid var(--line);border-top:0}
.wo-pag.fara-rb{border-top:1px solid var(--line);border-radius:8px 8px 0 0}
.wo-doc,.wo-mini{background:#fff;color:#111;font-family:Calibri,Carlito,"Segoe UI",Arial,sans-serif;font-size:16px;line-height:1.45;padding:16px 14px;min-height:120px;box-shadow:0 1px 3px rgba(0,0,0,.18);overflow-wrap:anywhere}
.wo-doc{cursor:text;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.wo-doc.wo-trag{cursor:default}
.wo-mini{min-height:0;padding:10px 12px;margin:6px 0;border:1px solid var(--line);border-radius:6px;box-shadow:none}
.wo-p{margin:0 0 6px;min-height:1.45em;white-space:pre-wrap;border-radius:2px}
.wo-mini p{margin:0 0 6px;white-space:pre-wrap}
.wo-p.titlu,.wo-mini .titlu{font-size:1.35em;font-weight:700;text-align:center}
.wo-car{display:inline-block;width:2px;height:1.1em;margin-right:-2px;background:#111;vertical-align:-.18em;animation:wo-clipeste 1.05s steps(1) infinite;pointer-events:none}
.wo-drop{display:inline-block;width:0;height:1.1em;margin-right:0;border-left:2px dashed #2B579A;vertical-align:-.18em;pointer-events:none}
@keyframes wo-clipeste{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.wo-car{animation:none}}
.wo-sl{background:#C8C8C8}
.wo-doc .wo-sl{cursor:default}
.wo-pm{display:inline-block;width:.5em;height:1.1em;vertical-align:-.18em}
.wo-pend{background:#FFF3B0}
.wo-tab{display:inline-block;width:2.2em}
.wo-tb{width:100%;border-collapse:collapse;table-layout:fixed;margin:0 0 6px}
.wo-tb td{border:1px solid #222;padding:3px 6px;vertical-align:top;height:1.9em;white-space:pre-wrap}
.wo-tb td.cur{background:#F4F8FC}
.wo-pic{display:inline-block;position:relative;width:132px;height:96px;vertical-align:bottom;border:1px solid #B5BCC4;cursor:pointer;background-color:#CFE8F7}
.wo-pic.sm{width:66px;height:48px}
.wo-pic.sel{outline:2px solid #5B8BD6;outline-offset:2px}
.wo-pic.fs{background:radial-gradient(circle at 50% 42%,#6B4A2B 0 8%,#F6C21C 9% 19%,transparent 20%),linear-gradient(#2E7D32,#2E7D32) 50% 100%/4px 56% no-repeat,radial-gradient(circle at 84% 18%,#FFE066 0 8%,transparent 9%),linear-gradient(#BFE3F7 0 72%,#7CC36E 72%)}
.wo-pic.ce{background:repeating-linear-gradient(90deg,#7E7E7E 0 7%,transparent 7% 12%) 50% 44%/64% 9% no-repeat,linear-gradient(#8D8D8D,#8D8D8D) 50% 76%/64% 34% no-repeat,linear-gradient(#6F6F6F,#6F6F6F) 26% 70%/13% 50% no-repeat,radial-gradient(ellipse at 50% 125%,#5B9A4A 0 58%,transparent 59%),#CFE8F7}
.wo-pic.lb{background:linear-gradient(#3F8FD0,#2F77B3) 0 100%/100% 36% no-repeat,linear-gradient(135deg,transparent 50%,#6D7F8F 50%) 0 64%/52% 56% no-repeat,linear-gradient(225deg,transparent 50%,#5C6D7C 50%) 100% 64%/52% 56% no-repeat,#DCEFFA}
.wo-pic.pi{background:radial-gradient(circle at 42% 58%,#2F8F5B 0 3%,transparent 4%),radial-gradient(circle at 58% 58%,#2F8F5B 0 3%,transparent 4%),radial-gradient(circle at 50% 66%,#E58A9A 0 2.5%,transparent 3.5%),linear-gradient(45deg,transparent 50%,#fff 50%) 34% 30%/13% 17% no-repeat,linear-gradient(-45deg,transparent 50%,#fff 50%) 66% 30%/13% 17% no-repeat,radial-gradient(circle at 50% 62%,#fff 0 25%,transparent 26%),linear-gradient(#F4C7A1,#E9A97A)}
.wo-pic.ha{background:linear-gradient(35deg,transparent 47%,#D33 47% 52%,transparent 52%),repeating-linear-gradient(0deg,transparent 0 17px,#CFE0BB 17px 18px),repeating-linear-gradient(90deg,transparent 0 17px,#CFE0BB 17px 18px),#EEF5E4}
.wo-kbd{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px}
.wo-kl{flex:1 1 100%;font-family:var(--fm);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink2)}
.wo-in{flex:1 1 150px;min-width:0;font-size:16px;padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink)}
.wo-in:focus-visible,.wo-k:focus-visible{outline:3px solid var(--accent);outline-offset:1px}
.wo-k{min-height:40px;padding:0 12px;border:1px solid var(--line);border-bottom-width:3px;border-radius:6px;background:var(--paper2);color:var(--ink);font-family:var(--fm);font-size:.88rem;cursor:pointer}
.wo-k[aria-disabled="true"]{opacity:.5}
.wo-kh{flex:1 1 100%;margin:0;font-size:.8rem}
.wo-ascuns{position:absolute!important;left:0;top:0;width:1px!important;height:1px!important;min-height:0!important;padding:0!important;border:0!important;overflow:hidden;opacity:0;pointer-events:none}
.wo-nota{min-height:1.3em;margin:8px 0 0;font-size:.92rem;color:var(--ink)}
.wo-nota:empty{display:none}
.wo-nota b{color:var(--accent)}
.wo-teste{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:4px}
.wo-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.92rem;padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper)}
.wo-teste li.ok{border-color:var(--ok);background:var(--okbg)}
.wo-teste .ic{flex:none;width:1.1em;font-weight:700;color:var(--ink2)}
.wo-teste li.ok .ic{color:var(--ok)}
.wo-jos{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;margin-top:8px}
.wo-grila{display:grid;gap:6px;padding:2px 0;width:100%}
.wo-gl{font-weight:600;font-size:.85rem;color:var(--ink)}
.wo-gg{display:grid;grid-template-columns:repeat(10,22px);gap:2px}
.wo-gc{width:22px;height:22px;padding:0;border:1px solid #9AA3AD;background:#fff;border-radius:0;cursor:pointer}
.wo-gc.on{border-color:#D9822B;background:#FDE7CF}
@media (pointer:coarse){.wo-gg{grid-template-columns:repeat(10,minmax(0,1fr));width:min(100%,330px)}.wo-gc{width:auto;height:auto;aspect-ratio:1}}
.wo-dos{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px 10px;border-bottom:1px solid var(--line)}
.wo-dos .wo-bt{min-height:34px;padding:0 10px;font-size:.84rem}
.wo-mi,.wo-meniu{display:grid;gap:1px}
.wo-mi button,.wo-meniu button,.wo-ctx button{text-align:left;padding:6px 10px;border:1px solid transparent;background:none;color:var(--ink);font:inherit;font-size:.85rem;border-radius:4px;cursor:pointer}
.wo-mi button:hover,.wo-meniu button:hover,.wo-ctx button:hover,.wo-mi button:focus-visible,.wo-meniu button:focus-visible,.wo-ctx button:focus-visible{border-color:#2B579A;background:var(--sel)}
.wo-ctx button[aria-disabled="true"]{opacity:.45}
.wo-ro{display:block;font-size:.74rem;color:var(--ink2)}
.wo-ctx{position:absolute;z-index:5;min-width:190px;max-width:calc(100% - 8px);padding:4px;border:1px solid #8A94A3;border-radius:6px;background:var(--paper);box-shadow:0 8px 24px rgba(0,0,0,.22);display:grid;gap:1px}
.wo-ctx[hidden]{display:none}
.wo-ctx .hint{margin:2px 6px 4px;font-size:.74rem}
.wo-win{border:1px solid #8A94A3;border-radius:8px;background:var(--paper);box-shadow:0 8px 24px rgba(0,0,0,.18);margin:8px 0;overflow:hidden}
.wo-wt{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 10px;background:var(--paper2);font-weight:700;font-size:.9rem}
.wo-wt button{min-width:36px;min-height:32px;border:0;background:none;color:var(--ink);font-size:1rem;cursor:pointer}
.wo-wp{padding:6px 10px;font-size:.84rem;color:var(--ink2);border-bottom:1px solid var(--line)}
.wo-fl{display:flex;flex-wrap:wrap;gap:8px;padding:10px}
.wo-f{display:flex;flex-direction:column;align-items:center;gap:4px;width:98px;padding:6px 4px;border:1px solid transparent;border-radius:6px;background:none;color:var(--ink);font-size:.74rem;cursor:pointer;overflow-wrap:anywhere}
.wo-f .wo-pic{width:72px;height:52px;cursor:inherit}
.wo-f.on{border-color:#3B82C4;background:#DBEAFE;color:#111}
.wo-wb{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:flex-end;padding:8px 10px;border-top:1px solid var(--line)}
.wo-nume{flex:1 1 100%;font-size:.85rem}
.wo-bt{min-height:38px;padding:0 16px;border:1px solid var(--line);border-radius:4px;background:var(--paper2);color:var(--ink);font:inherit;cursor:pointer}
.wo-bt.pr{background:#2B579A;color:#fff;border-color:#2B579A}
.wo-bt[disabled]{opacity:.45;cursor:not-allowed}
.wo-dt{display:grid;gap:8px;padding:10px}
.wo-dt label{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:.9rem}
.wo-dt input{width:5em;font-size:16px;padding:4px 6px;border:1px solid var(--line);border-radius:4px;background:var(--paper);color:var(--ink)}
.wo-win .hint{margin:0;padding:0 10px 8px}
.wo .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;
function stil(){if(typeof document==='undefined'||document.getElementById('wordobj-css'))return;const s=document.createElement('style');s.id='wordobj-css';s.textContent=CSS;document.head.appendChild(s)}
stil();

/* ---------------- SIMULATORUL ---------------- */
let NR=0;
function render(Q,body,api){
  stil();
  /* uneltele de pe ecran (tastele sunt mereu active pe tastatura calculatorului, ca în Word; butoanele apar doar pentru
     ce s-a predat): selectare | text (Enter, ⌫) | stergere (Delete) | clipboard (Ctrl+X/C/V, Home › Clipboard) |
     editare (= stergere + clipboard) | anulare (Ctrl+Z) | tab | inserare (lecția 4: Insert › Table/Pictures, Tab) */
  const U=Q.unelte||(Q.cere?['text','inserare']:['text','editare']),has=x=>U.includes(x);
  const areIns=has('inserare'),areClip=has('clipboard')||has('editare'),areDel=has('stergere')||has('editare'),areZ=has('anulare');
  const areText=has('text')||areIns,areTab=areIns||has('tab'),areEd=areClip;
  const faraTaste=!areText&&!areDel&&!areClip&&!areZ;
  const cuRb=areIns||areClip;
  const PW=G.PANGLICA_WORD,UP=G.UiPanglica,real=!!(PW&&UP);
  let doc=mk(Q.start),cur={b:0,o:0},ank={b:0,o:0},pend='',tSnap=null,hist=[],refa=[],clip=null,log=[];
  let fila='TabHome',meniu=null,dlg=null,ales=null,gc=0,gr=0,dosar='img',gAtins=null;
  let mod=null,drop=null,apasat=null,ultim={t:0,x:0,y:0,n:0},ctx=null,tragAnc=null;
  const id='wo-in-'+(++NR);
  let ultimulPointer='mouse';
  const leg=areEd
    ?`Panglica din simulator e în engleză. Pe fila <b>Pornire (Home)</b>, în grupul <b>Clipboard</b>: <b>Decupare (Cut)</b> = foarfeca, <b>Copiere (Copy)</b> = cele două foi, <b>Lipire (Paste)</b> = clipboardul mare din stânga. Pe calculator, ține mouse-ul pe un buton ca să-i vezi numele.`
    :`Aici butoanele panglicii au doar iconițe (în Word au și numele dedesubt). Pe fila <b>Insert</b> (Inserare): <b>Table</b> (Tabel) = iconița cu pătrățele; <b>Pictures</b> (Imagini) = iconița cu o poză cu munte. Pe calculator, ține mouse-ul pe un buton ca să-i vezi numele.`;
  const taste=[];
  if(areText)taste.push(`<button type="button" class="wo-k" data-k="enter" aria-label="Tasta Enter">Enter ↵</button>`);
  if(areTab)taste.push(`<button type="button" class="wo-k" data-k="tab" aria-label="Tasta Tab">Tab ⇥</button>`);
  if(areText||areDel)taste.push(`<button type="button" class="wo-k" data-k="bs" aria-label="Tasta Backspace, șterge la stânga cursorului sau textul selectat">⌫</button>`);
  if(areDel)taste.push(`<button type="button" class="wo-k" data-k="del" aria-label="Tasta Delete, șterge la dreapta cursorului sau textul selectat">Delete</button>`);
  if(areClip)taste.push(`<button type="button" class="wo-k" data-k="x" aria-label="Ctrl+X, decupare">Ctrl+X</button>`,
    `<button type="button" class="wo-k" data-k="c" aria-label="Ctrl+C, copiere">Ctrl+C</button>`,
    `<button type="button" class="wo-k" data-k="v" aria-label="Ctrl+V, lipire">Ctrl+V</button>`);
  if(areZ)taste.push(`<button type="button" class="wo-k" data-k="z" aria-label="Ctrl+Z, anulează ultima operație">Ctrl+Z</button>`);
  body.innerHTML=`<div class="wo">
    ${cuRb?`<div class="wo-rb" role="toolbar" aria-label="Panglica din Word"></div><p class="hint wo-leg">${leg}</p><div class="wo-dlg"></div>`:''}
    <div class="wo-pag${cuRb?'':' fara-rb'}"><div class="wo-doc" role="document" aria-label="Documentul Word simulat"></div></div>
    <div class="wo-ctx" hidden role="menu" aria-label="Meniul de la clic dreapta"></div>
    <div class="wo-kbd${faraTaste?' wo-ascuns':''}"${faraTaste?' aria-hidden="true"':''}><label class="wo-kl" for="${id}">${areText?'Tastatura: atinge caseta și tastează — literele apar în document, la cursor':'Tastele'}</label>
      <input class="wo-in${areText?'':' wo-ascuns'}" id="${id}" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="tastează aici"${faraTaste?' tabindex="-1"':''}>
      ${taste.join('')}${areClip&&!areIns?'<span class="hint wo-kh">Pe calculator merg și tastele adevărate. Pe telefon nu ai tasta Ctrl: atingi butoanele.</span>':''}</div>
    <p class="wo-nota" aria-live="polite"></p>
    <ul class="wo-teste" aria-label="Testele sarcinii"></ul>
    <div class="wo-jos"><span class="hint">${areIns
      ?'Atingi textul și cursorul se pune acolo, între litere (ca în Word).'
      :'Un clic (o atingere) în text pune cursorul acolo. Selectezi trăgând peste text cu mouse-ul sau cu degetul; dublu-clic (două atingeri repezi) pe un cuvânt îl selectează.'}</span>
      <button type="button" class="btn ghost sm" data-k="reset">Ia-o de la capăt</button></div>
  </div>`;
  const $=s=>body.querySelector(s),rbEl=$('.wo-rb'),dlgEl=$('.wo-dlg'),docEl=$('.wo-doc'),inp=$('.wo-in'),notaEl=$('.wo-nota'),testEl=$('.wo-teste'),ctxEl=$('.wo-ctx'),woEl=$('.wo');
  const spune=h=>{notaEl.innerHTML=h||''};
  const focusIn=()=>{if(ultimulPointer==='mouse')inp.focus({preventScroll:true})};

  /* ---- pozițiile ---- */
  const isP=b=>b&&b.k==='p';
  const inCel=p=>p&&p.r!=null;
  const cmp=(p,q)=>p.b-q.b||(inCel(p)&&inCel(q)?(p.r-q.r||p.c-q.c||p.o-q.o):(p.o-q.o));
  const same=(p,q)=>cmp(p,q)===0;
  const areSel=()=>!!ank&&!same(ank,cur);
  const ord=()=>cmp(ank,cur)<=0?[ank,cur]:[cur,ank];
  const cp=p=>Object.assign({},p);
  const txtLa=p=>inCel(p)?doc[p.b].c[p.r][p.c]:(isP(doc[p.b])?doc[p.b].t:'');
  const fin=()=>({b:doc.length,o:0});          // după semnul ultimului paragraf (triplu-clic pe ultimul paragraf, Ctrl+A)
  const pune=p=>{cur=cp(p);ank=cp(p)};
  /* o selecție de o singură poză (clic pe poză) */
  function pozaSel(){if(!areSel())return null;const [s,e]=ord();if(inCel(s)||s.b!==e.b||e.o!==s.o+1)return null;const c=doc[s.b].t[s.o];return eImg(c)?{b:s.b,k:s.o}:null}
  function extrage(s,e){
    if(inCel(s))return {parts:[doc[s.b].c[s.r][s.c].slice(s.o,e.o)],marks:[]};
    if(s.b===e.b)return {parts:[doc[s.b].t.slice(s.o,e.o)],marks:[]};
    const parts=[doc[s.b].t.slice(s.o)],marks=[!!doc[s.b].titlu];
    for(let b=s.b+1;b<e.b;b++){parts.push(isP(doc[b])?doc[b].t:'');marks.push(!!doc[b].titlu)}
    parts.push(e.b<doc.length?doc[e.b].t.slice(0,e.o):'');
    return {parts,marks};
  }
  const textSel=()=>{if(!areSel())return '';const [s,e]=ord();return extrage(s,e).parts.join('\n').replace(/[-]/g,'')};
  /* ștergerea unui interval; smart = regulile Word pentru spații (doar la selecții) */
  function sterge(s,e,smart){
    if(inCel(s)){const C=doc[s.b].c;const r=smart?stergeSmart(C[s.r][s.c],s.o,e.o):{s:C[s.r][s.c].slice(0,s.o)+C[s.r][s.c].slice(e.o),o:s.o};C[s.r][s.c]=r.s;return {b:s.b,r:s.r,c:s.c,o:r.o}}
    if(s.b===e.b){const p=doc[s.b];const r=smart?stergeSmart(p.t,s.o,e.o):{s:p.t.slice(0,s.o)+p.t.slice(e.o),o:s.o};p.t=r.s;return {b:s.b,o:r.o}}
    if(e.b>=doc.length){      // până după semnul ultimului paragraf: Word nu-l poate șterge, deci scoate paragraful întreg
      if(s.o===0){
        if(s.b===0){doc=[P('')];return {b:0,o:0}}
        doc.splice(s.b);
        if(!isP(doc[doc.length-1]))doc.push(P(''));
        const u=doc.length-1;return {b:u,o:doc[u].t.length};
      }
      doc[s.b].t=doc[s.b].t.slice(0,s.o);doc.splice(s.b+1);return {b:s.b,o:s.o};
    }
    // Word, la Delete / Backspace / Cut (probat: _proba/proba_semn_paragraf*.json): o selecție care începe în MIJLOCUL unui
    // paragraf și trece peste semnul lui NU unește paragrafele (restul de jos rămâne paragraf separat); doar semnul singur
    // se unește; o selecție care începe la începutul paragrafului îl scoate cu totul. Tastarea peste selecție unește.
    if(smart&&s.o>0&&!(e.b===s.b+1&&e.o===0&&s.o===doc[s.b].t.length)){
      const sus=Object.assign({},doc[s.b],{t:doc[s.b].t.slice(0,s.o)});
      let jos=doc[e.b].t.slice(e.o);if(e.o>0)jos=stergeSmart(jos,0,0).s;
      doc.splice(s.b,e.b-s.b+1,sus,Object.assign({},doc[e.b],{t:jos}));
      return {b:s.b,o:s.o};
    }
    const tit=s.o===0?doc[e.b].titlu:doc[s.b].titlu;   // Word: paragraful unit păstrează aspectul celui de sus
    let t=doc[s.b].t.slice(0,s.o)+doc[e.b].t.slice(e.o),o=s.o;
    if(smart){const r=stergeSmart(t,o,o);t=r.s;o=r.o}
    const np={k:'p',t};if(tit)np.titlu=true;
    doc.splice(s.b,e.b-s.b+1,np);
    return {b:s.b,o};
  }
  function insereaza(p,c,smart){
    const n=c.parts.length;
    if(inCel(p)){const C=doc[p.b].c,t=c.parts.join('\n'),v=C[p.r][p.c];const r=smart?lipesteSmart(v,p.o,t):{s:v.slice(0,p.o)+t+v.slice(p.o),o:p.o+t.length};C[p.r][p.c]=r.s;return {b:p.b,r:p.r,c:p.c,o:r.o}}
    const par=doc[p.b];
    if(n===1){const r=smart?lipesteSmart(par.t,p.o,c.parts[0]):{s:par.t.slice(0,p.o)+c.parts[0]+par.t.slice(p.o),o:p.o+c.parts[0].length};par.t=r.s;return {b:p.b,o:r.o}}
    const st=par.t.slice(0,p.o),dr=par.t.slice(p.o);
    const prim=smart?lipesteSmart(st,st.length,c.parts[0]).s:st+c.parts[0];
    const u=c.parts[n-1],lr=smart?lipesteSmart(dr,0,u):{s:u+dr,o:u.length};
    const noi=[Object.assign({k:'p',t:prim},c.marks[0]?{titlu:true}:{})];
    for(let i=1;i<n-1;i++)noi.push(Object.assign({k:'p',t:c.parts[i]},c.marks[i]?{titlu:true}:{}));
    noi.push(Object.assign({k:'p',t:lr.s},par.titlu?{titlu:true}:{}));
    doc.splice(p.b,1,...noi);
    return {b:p.b+n-1,o:lr.o};
  }
  /* ---- istoria (Ctrl+Z / Ctrl+Y) ---- */
  const stare=()=>({doc:clone(doc),cur:cp(cur),ank:cp(ank)});
  function snap(){hist.push(stare());if(hist.length>200)hist.shift();refa=[]}
  function commit(){
    if(!pend){if(tSnap){hist.push(tSnap);refa=[];tSnap=null}return}
    if(!tSnap)tSnap=stare();
    const t=pend;pend='';inp.value='';
    if(inCel(cur)){const C=doc[cur.b].c;C[cur.r][cur.c]=C[cur.r][cur.c].slice(0,cur.o)+t+C[cur.r][cur.c].slice(cur.o);cur.o+=t.length}
    else{const p=doc[cur.b];p.t=p.t.slice(0,cur.o)+t+p.t.slice(cur.o);cur.o+=t.length}
    ank=cp(cur);hist.push(tSnap);refa=[];tSnap=null;
  }
  function anuleaza(){
    if(pend||tSnap){const s=tSnap;pend='';inp.value='';tSnap=null;if(s){refa.push(stare());doc=s.doc;cur=s.cur;ank=s.ank}log.push({op:'z'});return true}
    if(!hist.length){spune('Nu mai e nimic de anulat.');return false}
    refa.push(stare());const s=hist.pop();doc=s.doc;cur=s.cur;ank=s.ank;log.push({op:'z'});return true;
  }
  function reface(){if(!refa.length)return false;hist.push(stare());const s=refa.pop();doc=s.doc;cur=s.cur;ank=s.ank;return true}

  /* ---- operațiile ---- */
  function stergeSel(op){const t=textSel(),[s,e]=ord();snap();pune(sterge(s,e,true));log.push({op,t});}
  function copiaza(taie){
    commit();
    if(!areSel()){spune(`Nu e nimic selectat, deci ${taie?'Ctrl+X (Decupare)':'Ctrl+C (Copiere)'} nu face nimic. În Word, butonul ${taie?'Decupare (Cut)':'Copiere (Copy)'} e gri până selectezi ceva.`);return}
    const [s,e]=ord();clip=extrage(s,e);clip.src=taie?'x':'c';
    if(taie){snap();pune(sterge(s,e,true));log.push({op:'x'});spune('Textul selectat a fost <b>decupat</b>: a dispărut din document și stă în clipboard. Pune cursorul unde îl vrei și apasă <b>Ctrl+V</b>.')}
    else{log.push({op:'c'});spune('Textul selectat a fost <b>copiat</b> în clipboard. Originalul a rămas pe loc. Pune cursorul unde vrei copia și apasă <b>Ctrl+V</b>.')}
  }
  function lipeste(){
    commit();
    if(!clip){spune('Clipboardul e gol: încă n-ai copiat sau decupat nimic. În Word, butonul Lipire (Paste) e gri.');return}
    if(pozaSel()){spune('O poză e selectată. Pune întâi cursorul în text, acolo unde vrei să lipești.');return}
    snap();
    if(areSel()){const [s,e]=ord();pune(sterge(s,e,true))}
    if(inCel(cur)||clip.parts.length===1||isP(doc[cur.b]))pune(insereaza(cur,clip,true));
    log.push({op:'v',src:clip.src});spune('');
  }
  /* tragerea unui text selectat: îl mută (copiere cu Ctrl), fără clipboard */
  function trage(d,copie){
    const [s,e]=ord();
    if(cmp(d,s)>=0&&cmp(d,e)<=0)return;
    if(inCel(s)!==inCel(d)||(inCel(d)&&(d.b!==s.b||d.r!==s.r||d.c!==s.c))){spune('În simulator muți textul prin tragere doar în același paragraf sau în alt paragraf, nu în tabel.');return}
    const c=extrage(s,e);snap();
    if(copie){const r=insereaza(d,c,true);ank=cp(d);cur=r;log.push({op:'dragc'});return}
    // mutarea: un semn invizibil ține locul nou cât timp șterg originalul, apoi textul se lipește în locul lui
    const SEMN='';
    const cuSemn=(p,o)=>{if(inCel(p)){const C=doc[p.b].c;C[p.r][p.c]=C[p.r][p.c].slice(0,o)+SEMN+C[p.r][p.c].slice(o)}else doc[p.b].t=doc[p.b].t.slice(0,o)+SEMN+doc[p.b].t.slice(o)};
    cuSemn(d,d.o);
    const s2=cp(s),e2=cp(e);
    if(d.b===s.b&&!inCel(d)&&cmp(d,s)<0){s2.o++;if(e.b===s.b)e2.o++}
    if(inCel(d)&&cmp(d,s)<0){s2.o++;e2.o++}
    sterge(s2,e2,true);
    let unde=null;
    for(let b=0;b<doc.length&&!unde;b++){
      if(isP(doc[b])){const i=doc[b].t.indexOf(SEMN);if(i>=0){doc[b].t=doc[b].t.slice(0,i)+doc[b].t.slice(i+1);unde={b,o:i}}}
      else doc[b].c.forEach((row,r)=>row.forEach((v,k)=>{const i=v.indexOf(SEMN);if(i>=0&&!unde){row[k]=v.slice(0,i)+v.slice(i+1);unde={b,r,c:k,o:i}}}));
    }
    if(!unde)return;
    const r=insereaza(unde,c,true);
    ank=cp(unde);cur=r;log.push({op:'drag'});   // Word lasă textul mutat selectat
  }
  function enter(){
    commit();
    const ps=pozaSel();
    if(ps){ /* Word: Enter cu poza selectată împarte rândul înaintea pozei, iar poza coboară pe rândul următor */
      snap();const p=doc[ps.b],a={k:'p',t:p.t.slice(0,ps.k)},b={k:'p',t:p.t.slice(ps.k)};
      if(p.titlu)a.titlu=true;doc.splice(ps.b,1,a,b);ank={b:ps.b+1,o:0};cur={b:ps.b+1,o:1};return}
    snap();
    if(areSel()){const [s,e]=ord();pune(sterge(s,e,false))}   // Word: Enter înlocuiește textul selectat (fără ajustarea spațiilor)
    if(inCel(cur)){const C=doc[cur.b].c,v=C[cur.r][cur.c];C[cur.r][cur.c]=v.slice(0,cur.o)+'\n'+v.slice(cur.o);cur.o++;ank=cp(cur);return}
    const p=doc[cur.b],a={k:'p',t:p.t.slice(0,cur.o)},b={k:'p',t:p.t.slice(cur.o)};
    if(p.titlu){a.titlu=true;if(cur.o<p.t.length)b.titlu=true}   // la capătul titlului, rândul nou e text obișnuit
    doc.splice(cur.b,1,a,b);pune({b:cur.b+1,o:0});
  }
  function blocatSel(){if(pozaSel()){spune('Poza e <b>selectată</b> (are chenar). Ca să scrii după ea, atinge textul de lângă ea: cursorul se pune acolo. (În Word, ce tastezi cu poza selectată nu ajunge după ea; poate chiar s-o înlocuiască.)');inp.value='';pend='';return true}return false}
  function tab(){
    commit();if(blocatSel())return;
    if(!inCel(cur)){snap();if(areSel()){const [s,e]=ord();pune(sterge(s,e,false))}const p=doc[cur.b];p.t=p.t.slice(0,cur.o)+'\t'+p.t.slice(cur.o);pune({b:cur.b,o:cur.o+1});return}
    const T=doc[cur.b];let r=cur.r,c=cur.c+1;
    if(c>=T.c[0].length){c=0;r++}
    if(r>=T.c.length){snap();T.c.push(Array(T.c[0].length).fill(''));spune('Tab în <b>ultima celulă</b> a adăugat un rând nou.')}
    pune({b:cur.b,r,c,o:T.c[r][c].length});
  }
  function backspace(ctrl){
    commit();
    if(areSel()){stergeSel('dels');return}
    const p=cur,t=txtLa(p);
    if(ctrl&&p.o>0){let a=p.o;while(a>0&&t[a-1]===' ')a--;if(a>0&&LIT.test(t[a-1]))while(a>0&&LIT.test(t[a-1]))a--;else if(a>0)a--;snap();pune(sterge(Object.assign(cp(p),{o:a}),p,true));return}
    if(p.o>0){
      if(eImg(t[p.o-1])){spune('În Word, ⌫ nu șterge poza de lângă cursor. Ca s-o ștergi: atinge poza (se selectează), apoi ⌫.');return}
      snap();pune(sterge(Object.assign(cp(p),{o:p.o-1}),p,false));return}
    if(inCel(p))return;
    const prev=doc[p.b-1];
    if(!isP(prev)){if(p.b>0)spune('Deasupra e un tabel: ⌫ de aici nu-l atinge (ca în Word).');return}
    snap();pune(sterge({b:p.b-1,o:prev.t.length},{b:p.b,o:0},false));
  }
  function del(ctrl){
    commit();
    if(areSel()){stergeSel('dels');return}
    const p=cur,t=txtLa(p);
    if(ctrl&&p.o<t.length){const [a,b]=unitCuvant(t,p.o);snap();pune(sterge(p,Object.assign(cp(p),{o:Math.max(b,p.o+1)}),true));return}
    if(p.o<t.length){snap();pune(sterge(p,Object.assign(cp(p),{o:p.o+1}),false));return}
    if(inCel(p))return;
    const nx=doc[p.b+1];
    if(!isP(nx))return;
    snap();pune(sterge(p,{b:p.b+1,o:0},false));
  }
  function punePoza(f){
    commit();
    if(inCel(cur)){spune('Cursorul e într-o celulă de tabel. În lecția asta pui poza în afara tabelului: atinge întâi rândul unde vrei poza.');return false}
    if(pozaSel()){spune('O poză e selectată. Atinge întâi rândul unde vrei poza nouă.');return false}
    snap();if(areSel()){const [s,e]=ord();pune(sterge(s,e,false))}
    const p=doc[cur.b];p.t=p.t.slice(0,cur.o)+IMGCH[f]+p.t.slice(cur.o);ank={b:cur.b,o:cur.o};cur={b:cur.b,o:cur.o+1};
    spune(`Poza <b>${esc(f)}</b> a apărut la cursor și e <b>selectată</b> (are chenar).`);return true;
  }
  function puneTabel(c,r){
    commit();
    if(inCel(cur)){spune('Cursorul e într-o celulă: în Word ai pune un tabel ÎN tabel. În lecția asta nu facem asta; atinge întâi rândul de sub tabel.');return false}
    if(pozaSel()){spune('O poză e selectată. Atinge întâi rândul unde vrei tabelul.');return false}
    snap();
    const T={k:'t',c:Array.from({length:r},()=>Array(c).fill(''))},p=doc[cur.b];
    if(gol(p)&&!p.titlu)doc.splice(cur.b,1,T,P(''));
    else if(cur.o>=p.t.length)doc.splice(cur.b+1,0,T,P(''));       // la capătul paragrafului: tabelul apare SUB el (probat, lecția 4)
    else if(cur.o===0)doc.splice(cur.b,0,T);                         // la începutul unui paragraf cu text: deasupra lui (neprobat)
    else{const a={k:'p',t:p.t.slice(0,cur.o)},b={k:'p',t:p.t.slice(cur.o)};if(p.titlu){a.titlu=true;b.titlu=true}doc.splice(cur.b,1,a,T,b)}   // la mijloc: îl rupe (neprobat)
    pune({b:doc.indexOf(T),r:0,c:0,o:0});
    spune(`A apărut un tabel cu <b>${cuvColoane(c)}</b> și <b>${cuvRanduri(r)}</b>. Cursorul e în prima celulă.`);return true;
  }
  /* ---- săgețile (tastatura calculatorului) ---- */
  function pasStanga(p){if(p.o>0)return Object.assign(cp(p),{o:p.o-1});if(inCel(p))return p;for(let b=p.b-1;b>=0;b--)if(isP(doc[b]))return {b,o:doc[b].t.length};return p}
  function pasDreapta(p,cuSemn){const t=txtLa(p);if(p.o<t.length)return Object.assign(cp(p),{o:p.o+1});if(inCel(p))return p;for(let b=p.b+1;b<doc.length;b++)if(isP(doc[b]))return {b,o:0};return cuSemn&&p.b<doc.length?fin():p}
  function cuvStanga(p){const t=txtLa(p);if(p.o===0)return pasStanga(p);let a=p.o;while(a>0&&(t[a-1]===' '))a--;const [x]=unitCuvant(t,Math.max(0,a-1));return Object.assign(cp(p),{o:x})}
  function cuvDreapta(p){const t=txtLa(p);if(p.o>=t.length)return pasDreapta(p);const [,y]=unitCuvant(t,p.o);return Object.assign(cp(p),{o:y})}
  function rectLa(p){
    const q=p.b>=doc.length?{b:doc.length-1,o:(doc[doc.length-1].t||'').length}:p;
    const host=inCel(q)?docEl.querySelector(`td[data-b="${q.b}"][data-r="${q.r}"][data-c="${q.c}"]`):docEl.querySelector(`.wo-p[data-b="${q.b}"]`);
    if(!host)return null;
    const ch=host.querySelectorAll('[data-o]');
    if(!ch.length){const r=host.getBoundingClientRect();return {x:r.left+2,y:r.top+4,h:Math.min(r.height,24)}}
    if(q.o<ch.length){const r=ch[q.o].getBoundingClientRect();return {x:r.left,y:r.top+1,h:r.height}}
    const r=ch[ch.length-1].getBoundingClientRect();return {x:r.right,y:r.top+1,h:r.height};
  }
  function vertical(p,sus){const r=rectLa(p);if(!r)return p;const q=posAt(r.x+1,sus?r.y-r.h*0.6:r.y+r.h*1.5,true);return q||p}
  function capRand(p,sfarsit){
    const r=rectLa(p);if(!r)return p;
    const host=inCel(p)?docEl.querySelector(`td[data-b="${p.b}"][data-r="${p.r}"][data-c="${p.c}"]`):docEl.querySelector(`.wo-p[data-b="${p.b}"]`);
    const ch=[...host.querySelectorAll('[data-o]')].filter(x=>{const q=x.getBoundingClientRect();return Math.abs(q.top-(r.y-1))<q.height/2});
    if(!ch.length)return p;
    const o=sfarsit?+ch[ch.length-1].dataset.o+1:+ch[0].dataset.o;
    return Object.assign(cp(p),{o});
  }
  /* ---- punctul de pe ecran -> poziția din document ---- */
  function hosts(){return [...docEl.querySelectorAll('.wo-p, td[data-r]')]}
  function posAt(x,y,libera){
    let el=document.elementFromPoint(x,y),host=el&&el.closest&&el.closest('.wo-p, td[data-r]');
    if(!host||!docEl.contains(host)){
      const hs=hosts();if(!hs.length)return null;
      let best=null,bd=1e9;
      hs.forEach(h=>{const r=h.getBoundingClientRect();const d=y<r.top?r.top-y:y>r.bottom?y-r.bottom:0;const dx=x<r.left?r.left-x:x>r.right?x-r.right:0;const dd=d*4+dx;if(dd<bd){bd=dd;best=h}});
      host=best;
      if(!libera){const r0=hs[0].getBoundingClientRect(),r1=hs[hs.length-1].getBoundingClientRect();if(y<r0.top&&host===hs[0])return hostPos(host,0);if(y>r1.bottom&&host===hs[hs.length-1])return hostPos(host,1e9)}
    }
    const ch=[...host.querySelectorAll('[data-o]')];
    if(!ch.length)return hostPos(host,0);
    const rs=ch.map(c=>c.getBoundingClientRect());
    // rândul (linia vizuală) cel mai apropiat pe verticală
    let lt=null,ld=1e9;rs.forEach(r=>{const cy=(r.top+r.bottom)/2,d=Math.abs(cy-y)-(y>=r.top&&y<=r.bottom?1000:0);if(d<ld){ld=d;lt=r.top}});
    const pe=rs.map((r,i)=>[r,i]).filter(([r])=>Math.abs(r.top-lt)<2);
    for(const [r,i] of pe){if(x<r.left+r.width/2)return hostPos(host,+ch[i].dataset.o)}
    const [,u]=pe[pe.length-1];return hostPos(host,+ch[u].dataset.o+1);
  }
  function hostPos(h,o){const b=+h.dataset.b;if(h.dataset.r!=null){const r=+h.dataset.r,c=+h.dataset.c;return {b,r,c,o:Math.min(o,doc[b].c[r][c].length)}}return {b,o:Math.min(o,doc[b].t.length)}}
  function charAt(x,y){
    const el=document.elementFromPoint(x,y),c=el&&el.closest&&el.closest('[data-o]');
    if(c&&docEl.contains(c)){const h=c.closest('.wo-p, td[data-r]');return Object.assign(hostPos(h,0),{o:+c.dataset.o})}
    const p=posAt(x,y);if(!p)return null;return Object.assign(cp(p),{o:Math.max(0,p.o-1)});
  }
  /* selecția nu trece printr-un tabel și nu iese dintr-o celulă */
  function limiteaza(f,a){
    if(inCel(a)){if(!inCel(f)||f.b!==a.b||f.r!==a.r||f.c!==a.c)return cmp(f,a)<0?Object.assign(cp(a),{o:0}):Object.assign(cp(a),{o:txtLa(a).length});return f}
    const jos=cmp(f,a)>0,lo=Math.min(a.b,f.b),hi=Math.max(a.b,f.b);
    for(let b=jos?a.b+1:a.b-1;jos?b<=hi:b>=lo;b+=jos?1:-1){
      if(b<doc.length&&!isP(doc[b])){const k=jos?b-1:b+1;return jos?{b:k,o:doc[k].t.length}:{b:k,o:0}}
    }
    return inCel(f)?(jos?{b:f.b-1,o:(doc[f.b-1]||{t:''}).t.length}:{b:f.b+1,o:0}):f;
  }

  /* ---- panglica ---- */
  function grila(){
    let g='';for(let r=1;r<=8;r++)for(let c=1;c<=10;c++)g+=`<button type="button" class="wo-gc${c<=gc&&r<=gr?' on':''}" data-gc="${c}" data-gr="${r}" aria-label="${cuvColoane(c)}, ${cuvRanduri(r)}"></button>`;
    return `<div class="wo-grila"><div class="wo-gl" aria-live="polite">${gc?`${gc}x${gr} Table`:'Insert Table'}</div><div class="wo-gg">${g}</div>
      <div class="wo-mi"><button type="button" data-wo="dlg-tabel">Insert Table...<span class="wo-ro">Inserare tabel…</span></button>
      <button type="button" data-wo="nesim" data-n="Draw Table">Draw Table</button><button type="button" data-wo="nesim" data-n="Convert Text to Table">Convert Text to Table...</button>
      <button type="button" data-wo="nesim" data-n="Excel Spreadsheet">Excel Spreadsheet</button><button type="button" data-wo="nesim" data-n="Quick Tables">Quick Tables ›</button></div></div>`;
  }
  function meniuPoze(){
    return `<div class="wo-meniu"><button type="button" data-wo="dlg-poza">This Device...<span class="wo-ro">Acest dispozitiv…</span></button>
      <button type="button" data-wo="net" data-n="Stock Images...">Stock Images...<span class="wo-ro">Imagini stoc…</span></button>
      <button type="button" data-wo="net" data-n="Online Pictures...">Online Pictures...<span class="wo-ro">Imagini online…</span></button></div>`;
  }
  function drawRb(){
    if(!rbEl)return;
    const gri=!areSel(),griV=!clip;
    if(real){
      UP.stil();
      const L={};
      if(areIns){L.TableInsertGallery={attr:'data-wo="tabel"',title:'Tabel (Table)'};L.FlyoutAnchorInsertPictures={attr:'data-wo="poze"',title:'Imagini (Pictures)'}}
      if(areEd){
        L.Paste={attr:'data-wo="lipire"',title:'Lipire (Paste) · Ctrl+V',clasa:griV?'pg-gri':''};
        L.Cut={attr:'data-wo="decupare"',title:'Decupare (Cut) · Ctrl+X',clasa:gri?'pg-gri':''};
        L.Copy={attr:'data-wo="copiere"',title:'Copiere (Copy) · Ctrl+C',clasa:gri?'pg-gri':''};
      }
      const men={};
      if(fila==='TabInsert'&&meniu==='tabel')men.TableInsertGallery=grila();
      if(fila==='TabInsert'&&meniu==='poze')men.FlyoutAnchorInsertPictures=meniuPoze();
      rbEl.innerHTML=UP.html(PW,{fila,legaturi:L,meniu:men});
    }else{ /* fără datele panglicii: filele Home/Insert și butoanele folosite */
      const home=areEd?`<button type="button" class="wo-bt${griV?' pg-gri':''}" data-wo="lipire" title="Lipire (Paste) · Ctrl+V">Paste</button><button type="button" class="wo-bt${gri?' pg-gri':''}" data-wo="decupare" title="Decupare (Cut) · Ctrl+X">Cut</button><button type="button" class="wo-bt${gri?' pg-gri':''}" data-wo="copiere" title="Copiere (Copy) · Ctrl+C">Copy</button>`:'<span class="hint">Butoanele filei Home (Pornire)</span>';
      rbEl.innerHTML=`<div class="rb pg"><div class="tabs" role="tablist"><span class="pg-fisier">File</span>
        <button type="button" data-tab="TabHome" class="${fila==='TabHome'?'on':''}">Home</button><button type="button" data-tab="TabInsert" class="${fila==='TabInsert'?'on':''}">Insert</button></div>
        <div class="pg-banda" style="padding:6px;gap:6px">${fila==='TabInsert'?(areIns?'<button type="button" class="wo-bt" data-wo="tabel" title="Tabel (Table)">Table ▾</button><button type="button" class="wo-bt" data-wo="poze" title="Imagini (Pictures)">Pictures ▾</button>':'<span class="hint">Butoanele filei Insert (Inserare)</span>'):home}</div>
        ${fila==='TabInsert'&&meniu?`<div class="pg-jos"><div class="m">${meniu==='tabel'?grila():meniuPoze()}</div></div>`:''}</div>`;
    }
  }
  function drawDlg(){
    if(!dlgEl)return;
    if(dlg==='poza')dlgEl.innerHTML=`<div class="wo-win" role="dialog" aria-label="Fereastra Insert Picture (Inserare imagine)">
      <div class="wo-wt"><span>Insert Picture</span><button type="button" data-wo="x" aria-label="Închide fereastra">✕</button></div>
      <div class="wo-dos" role="group" aria-label="Folderele (în Word, în stânga ferestrei)"><span class="hint">Folderele:</span>${Object.entries(DOSARE).map(([k,n])=>`<button type="button" class="wo-bt${k===dosar?' pr':''}" data-dosar="${k}" aria-pressed="${k===dosar}">${n}</button>`).join('')}</div>
      <div class="wo-wp">Acest PC › ${DOSARE[dosar]}</div>
      <div class="wo-fl">${LISTA.filter(f=>FIS[f].dosar===dosar).map(f=>`<button type="button" class="wo-f${f===ales?' on':''}" data-f="${f}" aria-pressed="${f===ales}"><span class="wo-pic ${FIS[f].cls}" role="img" aria-label="${esc(FIS[f].alt)}"></span><span>${f}</span></button>`).join('')}</div>
      <div class="wo-wb"><span class="wo-nume">File name: <b>${esc(ales||'')}</b></span>
        <button type="button" class="wo-bt pr" data-wo="ins-poza" ${ales?'':'disabled'}>Insert</button><button type="button" class="wo-bt" data-wo="x">Cancel</button></div>
      <p class="hint">În Word în română: fereastra „Inserare imagine”, butoanele „Inserare” și „Anulare”.</p></div>`;
    else if(dlg==='tabel')dlgEl.innerHTML=`<div class="wo-win" role="dialog" aria-label="Fereastra Insert Table (Inserare tabel)">
      <div class="wo-wt"><span>Insert Table</span><button type="button" data-wo="x" aria-label="Închide fereastra">✕</button></div>
      <div class="wo-dt"><label>Number of columns: <input type="number" min="1" max="10" value="5" data-dc></label>
        <label>Number of rows: <input type="number" min="1" max="12" value="2" data-dr></label></div>
      <div class="wo-wb"><button type="button" class="wo-bt pr" data-wo="ins-tabel-dlg">OK</button><button type="button" class="wo-bt" data-wo="x">Cancel</button></div>
      <p class="hint">În română: „Număr de coloane”, „Număr de rânduri”.</p></div>`;
    else dlgEl.innerHTML='';
  }
  /* ---- desenul documentului ---- */
  const CAR='<span class="wo-car" aria-hidden="true"></span>',DROP='<span class="wo-drop" aria-hidden="true"></span>';
  function randText(t,b,cel,s,e){
    // s,e = intervalul selectat în acest text (sau null); caretul, textul în curs și locul de lăsare se pun după poziție
    const aratCar=!areSel()&&mod!=='trag'&&cur.b===b&&(cel?inCel(cur)&&cur.r===cel.r&&cur.c===cel.c:!inCel(cur));
    const dropAici=mod==='trag'&&drop&&drop.b===b&&(cel?inCel(drop)&&drop.r===cel.r&&drop.c===cel.c:!inCel(drop));
    const ps=pozaSel();
    let h='';
    for(let i=0;i<=t.length;i++){
      if(aratCar&&cur.o===i)h+=(pend?`<span class="wo-pend">${esc(pend)}</span>`:'')+CAR;
      if(dropAici&&drop.o===i)h+=DROP;
      if(i===t.length)break;
      const c=t[i],sl=s!=null&&i>=s&&i<e;
      if(eImg(c)){const f=CHIMG[c],on=ps&&ps.b===b&&ps.k===i&&!cel;h+=`<span class="wo-pic ${(FIS[f]||{}).cls||''}${on?' sel':''}${sl&&!on?' wo-sl':''}" data-o="${i}" data-img="1" role="img" aria-label="${esc((FIS[f]||{}).alt||f)}${on?' (selectată)':''}"></span>`}
      else if(c==='\t')h+=`<span class="wo-tab${sl?' wo-sl':''}" data-o="${i}"></span>`;
      else if(c==='\n')h+=`<span data-o="${i}">\n</span>`;
      else h+=`<span${sl?' class="wo-sl"':''} data-o="${i}">${esc(c)}</span>`;
    }
    return h;
  }
  function drawDoc(){
    const sel=areSel()?ord():null;
    docEl.innerHTML=doc.map((B,i)=>{
      if(B.k==='t')return `<table class="wo-tb" data-b="${i}">${B.c.map((row,r)=>`<tr>${row.map((v,c)=>{
        const aici=inCel(cur)&&cur.b===i&&cur.r===r&&cur.c===c;
        let s=null,e=null;if(sel&&inCel(sel[0])&&sel[0].b===i&&sel[0].r===r&&sel[0].c===c){s=sel[0].o;e=sel[1].o}
        return `<td class="${aici?'cur':''}" data-b="${i}" data-r="${r}" data-c="${c}">${randText(v,i,{r,c},s,e)}</td>`}).join('')}</tr>`).join('')}</table>`;
      let s=null,e=null,semn=false;
      if(sel&&!inCel(sel[0])){const [a,z]=sel;if(i>=a.b&&i<=z.b&&!(i===z.b&&z.o===0&&a.b<z.b)){s=i===a.b?a.o:0;e=i===z.b?z.o:B.t.length}semn=i>=a.b&&i<z.b}
      return `<p class="wo-p${B.titlu?' titlu':''}" data-b="${i}">${randText(B.t,i,null,s,e)}${semn?'<span class="wo-pm wo-sl" aria-hidden="true"></span>':''}</p>`;
    }).join('');
    docEl.classList.toggle('wo-trag',mod==='trag');
  }
  function vDoc(){const d=clone(doc);if(pend){if(inCel(cur)){const C=d[cur.b].c;C[cur.r][cur.c]=C[cur.r][cur.c].slice(0,cur.o)+pend+C[cur.r][cur.c].slice(cur.o)}else{const p=d[cur.b];p.t=p.t.slice(0,cur.o)+pend+p.t.slice(cur.o)}}return d}
  const st=()=>({sel:textSel(),log});
  function drawTeste(){testEl.innerHTML=teste(Q,vDoc(),st()).map(t=>`<li class="${t.ok?'ok':''}"><span class="ic" aria-hidden="true">${t.ok?'✔':'○'}</span><span>${esc(t.ce)}${t.ok?'<span class="sr-only"> — gata</span>':''}</span></li>`).join('')}
  function drawKeys(){if(!areEd)return;const g=!areSel(),gv=!clip;body.querySelectorAll('.wo-k[data-k="x"],.wo-k[data-k="c"]').forEach(k=>k.setAttribute('aria-disabled',g));const v=body.querySelector('.wo-k[data-k="v"]');if(v)v.setAttribute('aria-disabled',gv)}
  function draw(){drawRb();drawDlg();drawDoc();drawTeste();drawKeys()}

  /* ---- meniul de la clic dreapta ---- */
  function arataCtx(x,y){
    const r=woEl.getBoundingClientRect(),g=!areSel(),gv=!clip;
    ctxEl.innerHTML=`<button type="button" role="menuitem" data-ctx="x" aria-disabled="${g}">Cut<span class="wo-ro">Decupare</span></button>
      <button type="button" role="menuitem" data-ctx="c" aria-disabled="${g}">Copy<span class="wo-ro">Copiere</span></button>
      <button type="button" role="menuitem" data-ctx="v" aria-disabled="${gv}">Paste<span class="wo-ro">Lipire</span></button>
      <p class="hint">În Word, în locul lui „Paste” vezi „Paste Options:” cu trei iconițe; oricare lipește textul.</p>`;
    ctxEl.hidden=false;
    const w=ctxEl.offsetWidth,h=ctxEl.offsetHeight;
    let L=x-r.left,T=y-r.top;L=Math.max(4,Math.min(L,r.width-w-4));if(T+h>r.height)T=Math.max(4,T-h);
    ctxEl.style.left=L+'px';ctxEl.style.top=T+'px';ctx=true;
  }
  function inchideCtx(){if(ctx){ctxEl.hidden=true;ctx=null}}

  /* tragerea care trece cu peste 10 px de capătul ultimului rând al paragrafului prinde și semnul de sfârșit de paragraf
     (ca în Word: selecția se vede atunci și după ultimul caracter). Așa se poate exersa reparația „textul a sărit pe un rând nou”. */
  function semnPrins(p,x,y){
    if(inCel(p)||p.b>=doc.length||!isP(doc[p.b])||!p.o||p.o!==doc[p.b].t.length)return null;
    const u=docEl.querySelector(`.wo-p[data-b="${p.b}"] > [data-o="${p.o-1}"]`);if(!u)return null;
    const r=u.getBoundingClientRect();if(y<r.top||y>r.bottom||x<=r.right+10)return null;
    return p.b+1<doc.length?(isP(doc[p.b+1])?{b:p.b+1,o:0}:null):fin();
  }
  /* apăsarea a căzut pe textul selectat? (acolo, în Word, tragerea MUTĂ textul, nu selectează din nou) */
  function inSelectie(p,x,y){
    if(!areSel())return false;
    const [s,z]=ord();
    if(cmp(p,s)>0&&cmp(p,z)<0)return true;
    const c=charAt(x,y);
    if(!c)return false;
    const el=document.elementFromPoint(x,y);
    return !!(el&&el.closest&&el.closest('.wo-sl'))&&cmp(c,s)>=0&&cmp(c,z)<0;
  }
  /* ---- evenimentele: mouse și deget ---- */
  body.addEventListener('pointerdown',e=>{ultimulPointer=e.pointerType||'mouse';if(ctx&&!e.target.closest('.wo-ctx'))inchideCtx()},true);
  docEl.addEventListener('pointerdown',e=>{
    if(api.done())return;
    if(e.button!==0&&e.pointerType==='mouse')return;     // clicul dreapta: vezi contextmenu
    commit();spune('');
    // dublu/triplu-clic ca în Windows: în 500 ms și în pătratul de 4×4 px din jurul primului clic (SM_CXDOUBLECLK);
    // pe ecranul atins degetul nu nimerește același pixel, deci toleranța e mai mare
    const now=Date.now(),tol=e.pointerType==='mouse'?2:26;
    const n=(now-ultim.t<500&&Math.abs(e.clientX-ultim.x)<=tol&&Math.abs(e.clientY-ultim.y)<=tol)?Math.min(ultim.n+1,3):1;
    ultim={t:now,x:e.clientX,y:e.clientY,n};
    const im=e.target.closest('[data-img]');
    const p=posAt(e.clientX,e.clientY);if(!p)return;
    try{docEl.setPointerCapture(e.pointerId)}catch(_){}
    apasat={x:e.clientX,y:e.clientY};
    if(im&&n===1&&!e.shiftKey){const h=im.closest('.wo-p');if(h){const b=+h.dataset.b,o=+im.dataset.o;ank={b,o};cur={b,o:o+1};mod=null;draw();focusIn();return}}
    tragAnc=null;
    if(n===1){
      if(e.shiftKey&&ank){cur=limiteaza(p,ank);mod='selectez'}
      else if((e.ctrlKey||e.metaKey)&&!inCel(p)){const c=charAt(e.clientX,e.clientY)||p;const [a,b]=unitPropozitie(txtLa(c),c.o);ank=Object.assign(cp(c),{o:a});cur=Object.assign(cp(c),{o:b});mod=null}
      else if(inSelectie(p,e.clientX,e.clientY)){mod='poate'}
      else{
        pune(p);mod='selectez';
        // cuvântul de sub deget/mouse la apăsare: Word („When selecting, automatically select entire word”, pornit
        // implicit) trece pe cuvinte întregi când tragerea iese din el
        const c=charAt(e.clientX,e.clientY),t=c?txtLa(c):'';
        const [wa,wb]=c&&t.length?unitCuvant(t,c.o):[p.o,p.o];
        tragAnc={p:cp(p),wa,wb,b:(c||p).b,r:(c||p).r,c:(c||p).c};
      }
    }else if(n===2){const c=charAt(e.clientX,e.clientY)||p;const [a,b]=unitCuvant(txtLa(c),c.o);ank=Object.assign(cp(c),{o:a});cur=Object.assign(cp(c),{o:b});mod=null}
    else{const c=charAt(e.clientX,e.clientY)||p;if(inCel(c)){ank=Object.assign(cp(c),{o:0});cur=Object.assign(cp(c),{o:txtLa(c).length})}else{ank={b:c.b,o:0};const nx=c.b+1;cur=nx<doc.length&&isP(doc[nx])?{b:nx,o:0}:nx>=doc.length?fin():{b:c.b,o:doc[c.b].t.length}}mod=null}
    draw();
  });
  docEl.addEventListener('pointermove',e=>{
    if(!mod||api.done())return;
    if(mod==='selectez'){
      const p=posAt(e.clientX,e.clientY);if(!p)return;
      const baza=tragAnc?tragAnc.p:ank,f=limiteaza(p,baza);
      let na=baza,nf=f;
      if(tragAnc&&!same(f,baza)){
        const A=tragAnc,acelasi=q=>q.b===A.b&&(inCel(q)?q.r===A.r&&q.c===A.c:true),fw=cmp(f,baza)>0;
        if(fw&&!(acelasi(f)&&f.o<=A.wb)){
          na=Object.assign(cp(baza),{o:Math.min(A.wa,baza.o)});
          if(f.o>0&&f.b<doc.length){const t=txtLa(f);nf=Object.assign(cp(f),{o:unitCuvant(t,f.o-1)[1]})}
        }else if(!fw&&!(acelasi(f)&&f.o>=A.wa)){
          na=Object.assign(cp(baza),{o:Math.max(A.wb,baza.o)});
          const t=txtLa(f);if(f.o<t.length)nf=Object.assign(cp(f),{o:unitCuvant(t,f.o)[0]});
        }
      }
      if(cmp(nf,na)>0){const m=semnPrins(nf,e.clientX,e.clientY);if(m)nf=m}
      if(!same(na,ank)||!same(nf,cur)){ank=na;cur=nf;draw()}
      return;
    }
    if(mod==='poate'&&apasat&&Math.hypot(e.clientX-apasat.x,e.clientY-apasat.y)>5)mod='trag';
    if(mod==='trag'){const p=posAt(e.clientX,e.clientY);if(p&&(!drop||!same(p,drop))){drop=p;drawDoc()}}
  });
  function sfarsitApasare(e){
    if(!mod){focusIn();return}
    if(mod==='poate'){const p=posAt(e.clientX,e.clientY);if(p)pune(p);mod=null;draw();focusIn();return}
    if(mod==='trag'){const d=drop;mod=null;drop=null;if(d)trage(d,e.ctrlKey||e.metaKey);draw();focusIn();return}
    mod=null;focusIn();
  }
  docEl.addEventListener('pointerup',sfarsitApasare);
  docEl.addEventListener('pointercancel',()=>{mod=null;drop=null;drawDoc()});
  docEl.addEventListener('contextmenu',e=>{
    e.preventDefault();if(api.done())return;commit();mod=null;drop=null;
    const p=posAt(e.clientX,e.clientY);
    if(p){const inSel=areSel()&&(()=>{const [s,z]=ord();return cmp(p,s)>=0&&cmp(p,z)<=0})();if(!inSel)pune(p)}
    draw();arataCtx(e.clientX,e.clientY);
  });
  ctxEl.addEventListener('click',e=>{
    const b=e.target.closest('[data-ctx]');if(!b)return;
    if(b.getAttribute('aria-disabled')==='true'){spune(b.dataset.ctx==='v'?'Clipboardul e gol: încă n-ai copiat sau decupat nimic.':'Selectează întâi textul.');return}
    inchideCtx();const k=b.dataset.ctx;if(k==='x')copiaza(true);else if(k==='c')copiaza(false);else lipeste();draw();focusIn();
  });

  /* ---- tastatura ---- */
  inp.addEventListener('input',()=>{
    if(api.done()){inp.value='';return}
    if(blocatSel()){drawDoc();return}
    if(!tSnap){tSnap=stare();if(areSel()){const [s,e]=ord();pune(sterge(s,e,false))}}   // tastarea înlocuiește selecția (Word)
    pend=inp.value;if(!pend&&tSnap&&same(tSnap.cur,cur)&&same(tSnap.ank,cur)){tSnap=null}
    drawDoc();drawTeste();drawKeys();
  });
  inp.addEventListener('keydown',e=>{
    if(api.done())return;
    const k=e.key,ctrl=(e.ctrlKey||e.metaKey)&&!e.altKey,kl=k.length===1?k.toLowerCase():k;
    let fa=null;
    if(ctrl&&kl==='c')fa=()=>copiaza(false);
    else if(ctrl&&kl==='x')fa=()=>copiaza(true);
    else if(ctrl&&kl==='v')fa=lipeste;
    else if(ctrl&&kl==='z')fa=anuleaza;
    else if(ctrl&&kl==='y')fa=()=>{commit();reface()};
    else if(ctrl&&kl==='a')fa=()=>{commit();if(inCel(cur)){ank=Object.assign(cp(cur),{o:0});cur=Object.assign(cp(cur),{o:txtLa(cur).length})}else{ank={b:0,o:0};cur=fin()}};
    else if(ctrl&&kl==='s')fa=()=>spune('În simulator nu se salvează nimic. În Word, Ctrl+S salvează documentul.');
    else if(k==='Enter')fa=enter;
    else if(k==='Tab'&&!e.shiftKey)fa=tab;
    else if(k==='Backspace'&&(!inp.value||ctrl))fa=()=>backspace(ctrl);
    else if(k==='Delete')fa=()=>del(ctrl);
    else if(/^(Arrow(Left|Right|Up|Down)|Home|End)$/.test(k)){
      fa=()=>{commit();
        const ext=e.shiftKey,sel=areSel();let f=cur;
        if(!ext&&sel&&(k==='ArrowLeft'||k==='ArrowRight')){const [s,z]=ord();pune(k==='ArrowLeft'?s:(z.b>=doc.length?{b:doc.length-1,o:doc[doc.length-1].t.length}:z));return}
        if(k==='ArrowLeft')f=ctrl?cuvStanga(cur):pasStanga(cur);
        else if(k==='ArrowRight')f=ctrl?cuvDreapta(cur):pasDreapta(cur,ext);
        else if(k==='ArrowUp')f=vertical(cur.b>=doc.length?{b:doc.length-1,o:0}:cur,true);
        else if(k==='ArrowDown')f=vertical(cur.b>=doc.length?{b:doc.length-1,o:0}:cur,false);
        else if(k==='Home')f=ctrl?{b:0,o:0}:capRand(cur,false);
        else if(k==='End')f=ctrl?{b:doc.length-1,o:(doc[doc.length-1].t||'').length}:capRand(cur,true);
        if(!f)return;
        if(ext){cur=limiteaza(f,ank)}else pune(f);
      };
    }
    if(!fa)return;
    e.preventDefault();pend=inp.value;fa();draw();
  });
  inp.addEventListener('paste',e=>{e.preventDefault();pend=inp.value;lipeste();draw()});   // meniul casetei de pe telefon: lipește din clipboardul simulatorului
  inp.addEventListener('copy',e=>{e.preventDefault()});
  inp.addEventListener('cut',e=>{e.preventDefault()});

  /* ---- butoanele: tastele de sub document, panglica, ferestrele ---- */
  const inchide=()=>{meniu=null;dlg=null;ales=null;gc=gr=0;gAtins=null;dosar='img'};
  body.addEventListener('click',e=>{
    const k=e.target.closest('[data-k]');
    if(k&&body.contains(k)){
      if(api.done())return;spune('');pend=inp.value;
      const w=k.dataset.k;
      if(w==='enter')enter();else if(w==='tab')tab();else if(w==='bs')backspace(false);else if(w==='del')del(false);
      else if(w==='x')copiaza(true);else if(w==='c')copiaza(false);else if(w==='v')lipeste();else if(w==='z')anuleaza();
      else if(w==='reset'){doc=mk(Q.start);pune({b:0,o:0});pend='';inp.value='';tSnap=null;hist=[];refa=[];log=[];fila='TabHome';inchide();inchideCtx();spune('Documentul e din nou ca la început.')}
      draw();focusIn();return;
    }
    if(!rbEl&&!dlgEl)return;
    const b=e.target.closest('button');if(!b||!((rbEl&&rbEl.contains(b))||(dlgEl&&dlgEl.contains(b))))return;
    if(api.done())return;spune('');
    if(b.dataset.tab){fila=b.dataset.tab;meniu=null;drawRb();return}
    const w=b.dataset.wo;
    if(w==='decupare'||w==='copiere'||w==='lipire'){pend=inp.value;if(w==='lipire')lipeste();else copiaza(w==='decupare');draw();focusIn();return}
    if(b.dataset.nesim){const n=b.getAttribute('aria-label');spune(n==='Format Painter'?'„Format Painter” e aici și în Word, dar îl folosim abia la lecția despre aspectul textului.':`„${esc(n)}” e aici și în Word, dar în lecția asta nu-l folosim.`);return}
    if(b.dataset.gc){const c=+b.dataset.gc,r=+b.dataset.gr;
      if(ultimulPointer!=='mouse'&&!(gAtins&&gAtins.c===c&&gAtins.r===r)){gAtins={c,r};grilaLa(c,r);const l=body.querySelector('.wo-gl');if(l)l.textContent=`${c}x${r} Table — atinge încă o dată ca să-l pui`;return}
      if(puneTabel(c,r))inchide();draw();focusIn();return}
    if(b.dataset.dosar){dosar=b.dataset.dosar;ales=null;drawDlg();return}
    if(b.dataset.f){ales=b.dataset.f;drawDlg();return}
    if(w==='tabel'){meniu=meniu==='tabel'?null:'tabel';gc=gr=0;dlg=null;drawRb();drawDlg();return}
    if(w==='poze'){meniu=meniu==='poze'?null:'poze';dlg=null;drawRb();drawDlg();return}
    if(w==='dlg-poza'){meniu=null;dlg='poza';ales=null;dosar='img';draw();return}
    if(w==='dlg-tabel'){meniu=null;dlg='tabel';draw();return}
    if(w==='net'){spune(`„${esc(b.dataset.n)}” aduce poze de pe internet. Azi iei poza din calculator: <b>This Device… (Acest dispozitiv…)</b>.`);return}
    if(w==='nesim'){spune(`„${esc(b.dataset.n)}” e și în Word, dar în lecția asta nu-l folosim.`);return}
    if(w==='x'){dlg=null;ales=null;drawDlg();focusIn();return}
    if(w==='ins-poza'&&ales){if(punePoza(ales))inchide();draw();focusIn();return}
    if(w==='ins-tabel-dlg'){
      const c=Math.max(1,Math.min(10,parseInt(dlgEl.querySelector('[data-dc]').value,10)||1)),r=Math.max(1,Math.min(12,parseInt(dlgEl.querySelector('[data-dr]').value,10)||1));
      if(puneTabel(c,r))inchide();draw();focusIn();return}
  });
  body.addEventListener('dblclick',e=>{const f=e.target.closest('.wo-f');if(f&&!api.done()){ales=f.dataset.f;if(punePoza(ales))inchide();draw();focusIn()}});
  body.addEventListener('pointerover',e=>{const g=e.target.closest('.wo-gc');if(g)grilaLa(+g.dataset.gc,+g.dataset.gr)});
  body.addEventListener('focusin',e=>{const g=e.target.closest('.wo-gc');if(g)grilaLa(+g.dataset.gc,+g.dataset.gr)});
  function grilaLa(c,r){gc=c;gr=r;body.querySelectorAll('.wo-gc').forEach(x=>x.classList.toggle('on',+x.dataset.gc<=c&&+x.dataset.gr<=r));const l=body.querySelector('.wo-gl');if(l)l.textContent=`${c}x${r} Table`}

  const nav=api.checkButton(()=>{
    pend=inp.value;commit();inchideCtx();draw();
    const T=teste(Q,doc,st()),bad=T.filter(t=>!t.ok);
    if(!bad.length){nav.innerHTML='';api.resolve(true);return}
    api.resolve(false,`${T.length-bad.length} din ${T.length} teste trecute. ${bad[0].cum}`);
    api.revealButton(()=>{doc=solutie(Q);pune({b:0,o:0});pend='';inp.value='';tSnap=null;
      const s=(Q.verif||[]).find(v=>v.selectat!=null);if(s)selecteazaText(s.selectat);
      inchide();draw();nav.innerHTML='';
      api.giveUp(Q.cere?'documentul arată acum ca în sarcină: uită-te unde stă fiecare obiect și ce e în celule.':'documentul arată acum ca în sarcină. Citește-l și compară-l cu ce aveai.')});
  });
  function selecteazaText(x){for(let b=0;b<doc.length;b++){if(!isP(doc[b]))continue;const i=doc[b].t.indexOf(x);if(i>=0){ank={b,o:i};cur={b,o:i+x.length};return true}}return false}
  body._wo={
    set:(d,o)=>{doc=d;pune({b:0,o:0});pend='';inp.value='';tSnap=null;hist=[];refa=[];inchide();o=o||{};log=o.log||[];if(o.sel)selecteazaText(o.sel);draw()},
    stare:()=>({doc:clone(doc),cur:cp(cur),ank:cp(ank),pend,clip:clip&&clone(clip),log:log.slice(),sel:textSel()}),
    /* pentru probe (_proba/proba_sim_paragrafe.py): o selecție dată prin poziții și o tastă, fără mouse */
    proba:{
      selecteaza:(a,c)=>{commit();ank=cp(a);cur=cp(c);draw()},
      apasa:k=>{pend=inp.value;
        if(k==='del')del(false);else if(k==='bs')backspace(false);else if(k==='x')copiaza(true);else if(k==='c')copiaza(false);
        else if(k==='v')lipeste();else if(k==='z')anuleaza();else if(k==='enter')enter();
        else{inp.value=k;inp.dispatchEvent(new Event('input'));commit()}
        draw()}
    }
  };
  draw();
}
/* rezolvarea pentru poartă: documentul-țintă + operațiile cerute (jurnalul) + selecția cerută */
function jurnalPentru(Q){const L=[];(Q.verif||[]).forEach(v=>{if(v.sters!=null)L.push({op:'dels',t:v.sters});if(v.foloseste==='copiere')L.push({op:'c'},{op:'v',src:'c'});if(v.foloseste==='mutare')L.push({op:'x'},{op:'v',src:'x'});if(v.foloseste==='tragere')L.push({op:'drag'});if(v.foloseste==='stergere')L.push({op:'dels'});if(v.foloseste==='anulare'){if(!L.some(x=>x.op==='dels'))L.push({op:'dels'});L.push({op:'z'})}});(Q.tintaDupa||[]).forEach(f=>{if(f==='stergere'&&!L.some(x=>x.op==='dels'))L.push({op:'dels'});if(f==='anulare'&&!L.some(x=>x.op==='z'))L.push({op:'dels'},{op:'z'})});return L}
function selPentru(Q){const s=(Q.verif||[]).find(v=>v.selectat!=null);return s?s.selectat:null}
G.TipWordObiecte={
  render,
  rezolva(Q,body){body._wo.set(solutie(Q),{log:jurnalPentru(Q),sel:selPentru(Q)})},
  gresit(Q,body){body._wo.set(gresitDoc(Q),{log:[],sel:Q.tipicSel||null})},
  teste,solutie,gresitDoc,MODEL,IMGCH
};
if(typeof module!=='undefined'&&module.exports)module.exports={MODEL,teste,mk};
})(typeof window!=='undefined'?window:globalThis);
