/* Caseta de exersare „intră pe numele tău, cu codul” — fișier comun (lectii/_sim/intrare-cod.js).
   PROPRIETAR: autorul lecției V · M1 · nr. 1 (16.10.2026, lucrarea _campaign/revizuire_completa_2026_09/v1_cu_cod_2026_10_16).
   Folosită de lecțiile 1 ale claselor V-VIII. API-ul complet, cu exemple: lectii/_sim/intrare-cod.GATA.md.

   CE IMITĂ. Caseta adevărată de jos (assets/js/prezenta.js): aceleași texte (tabelul TEXTE, copiate literă cu literă;
   proba lectii/_sim/_teste/intrare_cod_texte.py le caută în prezenta.js), aceeași ordine, aceleași butoane și aceleași
   reguli: codul are exact 4 cifre; „Scrie-l încă o dată” trebuie să fie la fel; un cod greșit se numără; 5 coduri greșite
   la rând = 30 de secunde de pauză, pe orice nume și după „← Înapoi la listă”; „Mi-am uitat codul” → „Trimite cererea”;
   „Ieși (deconectare)”; meniul etichetei; corectura; „Păstrează-l online”; „Ești tot …?”. Proba de fidelitate
   (lectii/_sim/_teste/intrare_cod_proba.py) compară textul fiecărei stări cu caseta adevărată, adusă în aceeași stare.

   IZOLAREA (R4, probată în intrare_cod_proba.py): nu cheamă window.Prezenta; nu citește și nu scrie localStorage,
   sessionStorage sau cookie; nu trimite nicio cerere. Starea stă în memoria casetei și se pierde la „Încă un exercițiu”
   sau la reîncărcare. Câmpurile de cod sunt ca în caseta adevărată (fără <form>, fără name, autocomplete="off").

   TIPUL pentru motor:  JocMotor.porneste({…, tipuri:{'intrare-cod':SimIntrareCod.intrare}})
   Exercițiul:          {t:'intrare-cod', q:'cerința', start, elev, cod, colegi, pe, scris, tinta, deblocat, ajutor, why}
     start    'nou' (calculator nou: „Spune cine ești”) | 'acasa' (alt aparat: același nume, aceeași clasă, același cod)
              | 'lista' („Cine lucrează acum?”) | 'salut' („Salut, X!”, cere codul) | 'eticheta' (conectat, eticheta jos)
              | 'meniu' (meniul etichetei, deschis) | 'uitat' („Salut, X!”, iar codul lipsește din caiet)
              | 'fara-cod' (conectat FĂRĂ cod: „Progresul tău stă doar pe calculatorul ăsta.”) | 'intreaba' („Ești tot X?”)
              | 'nimeni' („Nu e nimeni conectat · Intră”). Implicit 'lista'.
     elev     {nume, clasa, scoala?, faraCod?} — cine e elevul din exercițiu (nume INVENTAT; scoala = cheia din lista școlilor,
              implicit 'brauner'; clasa = exact ca în listă, ex. '5 AM'). faraCod:true (16.10 b) = elevul e în listă FĂRĂ cod
              (înscris înainte de coduri): numele lui → „Alege-ți codul (4 cifre)” + „Scrie-l încă o dată”.
     cod      codul din caiet ('4 cifre'). Lipsește la 'nou' (îl alege elevul) și la 'fara-cod'; la 'uitat' NU se arată.
     colegi   [{nume, clasa?, cod?, faraCod?}] alte nume din listă; implicit clasa elevului și un cod pe care elevul nu-l știe.
     pe       la 'eticheta' / 'meniu' / 'intreaba': numele celui conectat acum (implicit elevul; poate fi un coleg).
     scris    {nume?, clasa?}: cum apare elevul în listă (scris greșit) — pentru corectură; implicit tinta 'corectat'.
     tinta    ce trebuie să ajungă elevul să facă: 'intrat' | 'reintrat' (iese și intră din nou cu codul) | 'iesit' |
              'schimbat' (lasă calculatorul următorului) | 'cerere' („Mi-am uitat codul” trimis) | 'online' (și-a ales
              cod cu „Păstrează-l online”) | 'corectat'; sau o listă de pași, ex. ['intrat','iesit','intrat'].
              Implicit: nou/acasa/lista/salut/intreaba/nimeni → 'intrat', eticheta/meniu → 'iesit', uitat → 'cerere',
              fara-cod → 'online', cu `scris` → 'corectat'.
     deblocat true = după „Trimite cererea”, exersarea face ce face profesorul în panou („Deblochează”): codul nou intră,
              cel vechi primește mesajul casetei adevărate („Codul ăsta nu mai e bun…”). Implicit false: codul nou
              primește „Profesorul nu te-a deblocat încă…”, iar cel vechi încă intră.
   rezolva / gresit: pentru poarta test_joc.py (gresit = intrarea pe numele colegului sau a doua înscriere / rămas conectat).
   PENTRU ALȚI AUTORI: nu schimbați aici textele (vin din prezenta.js) și nici regulile. Ce vă lipsește cereți
   proprietarului (dirijorul duce cererea). O extensie nouă stă în alt fișier din lectii/_sim/, cu nume nou. */
(function(){
'use strict';

/* ---------------- TEXTELE casetei adevărate (assets/js/prezenta.js), literă cu literă ----------------
   {nume}, {clasa}, {scoala}, {scurt}, {n}, {s}, {secunde}, {cuAlt}, {nor} = locuri pentru date; restul e copiat exact.
   Fiecare bucată dintre locuri și etichete HTML e căutată în prezenta.js de intrare_cod_texte.py (R2). */
const TEXTE={
  intrebare:'Lucrezi pentru ora de informatică? <b>Spune cine ești</b>: profesorul vede ce lecții deschizi, cât lucrezi și ce niveluri termini.',
  nota:'🔒 Se vede <b>doar</b> ce faci pe LearningHub (lecțiile și jocurile profesorului). Nu se vede nimic din alte site-uri, aplicații, mesaje, poze sau fișiere de pe calculator ori telefon.',
  notaNota:'📝 Ce termini aici poate aduce <b>până la 2 puncte</b> la nota lucrării de modul, de la ora la care profesorul anunță regula (fișa de criterii). Fără înscriere, faci aceeași muncă la oră, la calculatorul școlii, sau pe foaie.',
  bCine:'Spune cine ești', bViz:'Nu, doar vizitez',
  pillViz:'Sunt elev — mă înscriu', pillVizS:'Mă înscriu',
  pillActiv:'Profesorul vede activitatea ta · <b>{scurt}</b>', pillIesi:'Ieși',
  pillNimeni:'Nu e nimeni conectat · <b>Intră</b>', pillNimeniS:'Nimeni conectat · <b>Intră</b>',
  intreaba:'Ești tot <b>{nume}</b> ({clasa})?', intreabaMic:'Ce lucrezi acum se păstrează: ajunge la profesor pe numele tău după ce apeși „Da”.',
  bDa:'Da, sunt eu', bNu:'Nu, sunt alt elev',
  iesit:'Ai ieșit, <b>{nume}</b>. Data viitoare îți cer codul.', bIntra:'Intră', bBine:'Bine',
  meniu:'Ești înscris ca <b>{nume}</b> · {clasa} · {scoala}.', bIesi:'Ieși (deconectare)', bInchide:'Închide',
  meniuPleci:'Pleci de la calculator? Apasă „Ieși”. După aceea, pe numele tău se intră doar cu codul tău.',
  meniuVede:'Profesorul vede: paginile deschise, minutele lucrate (doar când lucrezi, nu cu fila uitată deschisă) și nivelurile terminate. Numele pleacă criptat.',
  meniuOnline:'☁ Progresul tău se păstrează online: pe alt calculator sau pe telefon te înscrii cu același nume și același cod și continui de unde ai rămas.',
  meniuLocal:'<b>Progresul tău stă doar pe calculatorul ăsta.</b> Alege un cod ca să-l poți continua și pe alt calculator sau acasă.',
  bJurnal:'Jurnalul meu', bPastreazaOnline:'Păstrează-l online', bAlt:'Nu ești tu? Schimbă elevul',
  bCorect:'Mi-am scris greșit numele, clasa sau școala', bScoate:'Scoate-mă din lista calculatorului',
  corAlegeCod:'<b>Întâi alege-ți un cod</b>', corAlegeCodMic:'Ca să-ți poți corecta numele, ai nevoie de un cod de 4 cifre. Alege-l acum, scrie-l în caiet, apoi apasă din nou „Mi-am scris greșit…”.',
  bAlegCod:'Aleg codul', bInapoi:'Înapoi',
  corCod:'<b>Corectează ce ai scris greșit</b> · {nume} ({clasa})', corCodMic:'Întâi scrie codul tău de 4 cifre, ca să știm că ești tu.',
  bMaiDeparte:'Mai departe',
  corForm:'<b>Corectează ce ai scris greșit</b>', corFormMic:'Schimbă școala, clasa sau numele. Nivelurile, lecțiile și minutele tale vin cu tine; codul rămâne același.',
  bSalveaza:'Salvează',
  corNimic:'N-ai schimbat nimic. Corectează școala, clasa sau numele, apoi apasă „Salvează”.',
  corMut:'Îți mut progresul…',
  corDeja:'Pe calculatorul ăsta e deja {nume}{cuAlt}. Intră pe numele acela din listă, cu codul lui, sau spune-i profesorului.', corCuAlt:', cu alt cod',
  corGata:'<b>Gata, {nume}!</b> Acum ești la {clasa} · {scoala}. Progresul tău a venit cu tine. Data viitoare intri cu numele ăsta și cu același cod.',
  lista:'<b>Cine lucrează acum?</b>', listaMic:'Apasă pe numele tău, scrie-ți codul și continui de unde ai rămas. Progresul fiecăruia se păstrează.',
  listaNor:' · ☁', bNuSunt:'Nu sunt în listă', bMaiTarziu:'Mai târziu',
  listaJos:'„Nu sunt în listă” = prima dată pe calculatorul ăsta. Dacă ai lucrat pe alt calculator sau acasă, scrie același nume și același cod și îți vine progresul.',
  cod4:'Codul are exact 4 cifre.', codDiferit:'Cele două coduri nu sunt la fel. Scrie-l din nou.', verific:'Verific codul…',
  mutat:'Codul ăsta nu mai e bun: profesorul te-a deblocat cu un cod nou. Intră cu codul nou.',
  asteptare:'Profesorul nu te-a deblocat încă. Intri cu codul nou după ce te deblochează.',
  gresit:'Cod greșit.', ramase1:' Mai ai o încercare, apoi urmează o pauză de 30 de secunde.',
  ramase2:' Mai ai două încercări, apoi urmează o pauză de 30 de secunde.', ramaseMulte:' Mai încearcă.',
  asteapta:'Așteaptă {s} s', pauza:'Ai greșit codul de 5 ori la rând. Mai încearcă peste {secunde}.',
  secDe:'{n} de secunde', sec1:'o secundă', secN:'{n} secunde',
  salut:'<b>Salut, {nume}!</b> ({clasa})',
  salutNou:'De acum, fiecare elev intră pe numele lui <b>cu un cod de 4 cifre</b>, ca nimeni altcineva să nu poată intra în locul lui. Alege-ți codul și scrie-l în caiet. Dacă ai mai lucrat cu un cod pe alt calculator sau pe telefon, pune codul de atunci.',
  salutVechi:'Scrie codul tău de 4 cifre.', etAlegeCod:'Alege-ți codul (4 cifre)', etCodTau:'Codul tău (4 cifre)', etIncaOData:'Scrie-l încă o dată',
  bInapoiLista:'← Înapoi la listă', bUitat:'Mi-am uitat codul',
  intra:'Salut, <b>{nume}</b>! Îți aduc progresul…',
  uitat:'<b>Mi-am uitat codul</b> · {nume} ({clasa})',
  uitatMic:'Alege un cod NOU de 4 cifre și scrie-l în caiet. Cererea ajunge la profesor; după ce te deblochează, intri cu numele tău și cu codul nou și îți găsești tot progresul. Profesorul nu vede codul.',
  etCodNou:'Codul nou (4 cifre)', bTrimite:'Trimite cererea', codNou4:'Codul nou are exact 4 cifre.', trimit:'Trimit cererea…',
  cerereOk:'<b>Cererea a ajuns la profesor.</b> După ce te deblochează, intri cu numele și codul nou.', bAmInteles:'Am înțeles',
  pastreaza:'<b>Păstrează progresul online</b>',
  pastreazaMic:'Alege un cod de 4 cifre și ține-l minte (scrie-l în caiet). Pe alt calculator sau pe telefon te înscrii cu același nume, aceeași clasă și același cod, iar nivelurile tale te așteaptă acolo.',
  exCod:'ex. 4827', bPastreaza:'Păstrează',
  cineEsti:'<b>Cine ești?</b>', cineEstiMic:'Pe calculatoarele din laborator, la final apasă pe etichetă → „Ieși”.',
  etScoala:'Școala', alege:'— alege —', altaScoala:'Altă școală (nu e în listă)',
  etNumeScoala:'Numele școlii', exScoala:'ex. Școala Gimnazială Nr. 3', etLocalitate:'Localitatea și județul', exLocalitate:'ex. Roman, Neamț',
  etClasa:'Clasa', exClasa:'ex. a VI-a B', alegeIntai:'— alege întâi școala —', altaClasa:'Altă clasă din școala asta…', etScrieClasa:'Scrie clasa ta',
  etNume:'Numele și prenumele, <b>întregi, ca în catalog</b>', exNume:'ex. Popescu Ana-Maria',
  etCodSecret:'Codul tău secret, <b>4 cifre</b> (scrie-l în caiet)',
  formMic:'Cu același nume și același cod îți continui progresul pe orice calculator sau pe telefon. Dacă ai mai lucrat în altă parte, pune codul de atunci.',
  bGata:'Gata',
  errAlta:'Scrie numele școlii, localitatea cu județul și clasa.', errClasa:'Scrie clasa ta (ex. a VI-a B).', errScoalaClasa:'Alege școala și clasa.',
  errNume:'Scrie numele și prenumele (două cuvinte).', errCod:'Alege un cod de exact 4 cifre (ex. 4827) și scrie-l în caiet.',
  errAltCod:'Pe calculatorul ăsta, {nume} intră cu alt cod. ', errAltCodUitat:' Dacă ți-ai uitat codul, apasă „Mi-am uitat codul”.',
  caut:'Caut progresul tău…'
};

/* Ce scrie EXERSAREA în jurul casetei (nu imită nimic din prezenta.js; nu se caută acolo). */
const CADRU={
  eticheta:'Exersare: o copie a casetei de jos. Nu e caseta adevărată: aici nu se salvează nimic și nu pleacă nimic la profesor.',
  caiet:'Caietul tău', codCaiet:'codul', codLipsa:'nu-l mai găsești în caiet', codAlege:'încă nu l-ai ales', codNuAi:'încă nu ai cod',
  jurnal:'În exersare, „Jurnalul meu” nu se deschide. Pe site, acolo îți vezi minutele lucrate.',
  venit:'Doar în exersare: ai scris exact ca la școală. Pe site, pagina se încarcă din nou, iar pe lecția începută apare „Continuă de unde ai rămas”. Așa știi că ți-a venit munca.',
  nevenit:'Doar în exersare: numele, clasa sau codul nu sunt exact ca la școală. Pe site nu ți-ar apărea „Continuă de unde ai rămas”: munca de la școală nu ți-ar veni.',
  deblocat:'În exersare, profesorul te-a deblocat. Acum intri cu numele tău și cu codul NOU.',
  // mesajele de după „Verifică” (exersarea), cât mai scurte
  nuIntrat:'Încă nu ești conectat pe numele tău.',
  pasiLista:'Apasă pe numele tău din listă, scrie codul din caiet și apasă „Intră”.',
  pasiNou:'Apasă „Spune cine ești”. Alege școala și clasa, scrie numele ca în catalog și un cod, apoi apasă „Gata”.',
  pasiAcasa:'Apasă „Spune cine ești”. Scrie exact ce ai scris la școală: aceeași școală, aceeași clasă, același nume, același cod.',
  peColeg:'Acum lucrezi pe numele: {nume}. Nu e numele tău. Profesorul ar vedea munca ta la colegul tău. Apasă eticheta din exersare, apoi „Nu ești tu? Schimbă elevul”, și intră pe numele TĂU.',
  aDoua:'Ai făcut a doua înscriere: {ce}. Profesorul ar vedea doi elevi în loc de unul.',
  aDouaClasa:'aceeași persoană, dar altă clasă ({clasa})', aDouaNume:'numele scris altfel ({nume})', aDouaScoala:'altă școală',
  cerereFaraRost:'Ai cerut un cod nou, deși codul tău e în caiet. Nu-ți schimba codul în timpul orei: intră cu codul din caiet.',
  intreabaPrimul:'Răspunde întâi la întrebarea „Ești tot …?” de pe ecran.',
  incaConectat:'Încă ești conectat pe numele tău. Apasă eticheta din exersare, apoi „Ieși (deconectare)”.',
  nuIesit:'Întâi ieși: apasă eticheta din exersare, apoi „Ieși (deconectare)”.',
  scos:'Ai apăsat „Scoate-mă din lista calculatorului”. Pe calculatorul adevărat, așa numele tău nu mai apare în listă. Ca să pleci, apeși „Ieși (deconectare)”.',
  nuReintrat:'Ai ieșit. Acum intră din nou: apasă pe numele tău din listă și scrie codul din caiet.',
  nuCerere:'Apasă „Mi-am uitat codul”. Alege un cod nou, scrie-l de două ori și apasă „Trimite cererea”.',
  nuOnline:'Apasă eticheta din exersare, apoi „Păstrează-l online”. Alege un cod, scrie-l în caiet și apasă „Păstrează”.',
  nuCorectat:'Intră pe numele tău, așa cum e scris în listă. Apoi apasă eticheta din exersare și „Mi-am scris greșit numele, clasa sau școala”.',
  nuVenit:'Ești conectat, dar progresul de la școală nu a venit. Ieși și înscrie-te din nou, exact ca la școală.',
  arata:{
    intrat:'pe numele tău din listă, apoi codul din caiet și „Intră”. Eticheta arată acum numele tău.',
    nou:'„Spune cine ești” → școala, clasa, numele ca în catalog, un cod de 4 cifre (scris în caiet) → „Gata”.',
    acasa:'„Spune cine ești” → aceeași școală, aceeași clasă, același nume, același cod ca la școală → „Gata”.',
    iesit:'eticheta → „Ieși (deconectare)”. Scrie „Ai ieșit…”: pe numele tău se intră acum doar cu codul tău.',
    reintrat:'eticheta → „Ieși (deconectare)” → „Intră” → numele tău → codul din caiet → „Intră”.',
    cerere:'„Mi-am uitat codul” → un cod nou, scris de două ori (și în caiet) → „Trimite cererea”.',
    online:'eticheta → „Păstrează-l online” → un cod de 4 cifre, scris în caiet → „Păstrează”.',
    corectat:'numele tău din listă → codul → „Intră”; apoi eticheta → „Mi-am scris greșit numele, clasa sau școala” → codul → numele corect → „Salvează”.',
    schimbat:'eticheta → „Nu ești tu? Schimbă elevul” (sau „Ieși (deconectare)”).'
  }
};

/* Școlile și clasele din jocuri/_motor/diplome-date.js (copie; intrare_cod_texte.py verifică să fie aceleași).
   Pe pagină se folosește window.DIPLOME.scoli dacă prezenta.js a încărcat deja fișierul (doar citit, nicio cerere). */
const SCOLI_COPIE=[
  {key:'transporturi',nume:'Colegiul Tehnic de Transporturi',clase:['X B','Anul I F (Maiștri)','I A AMG','II C AMF','I B AMG']},
  {key:'forestier',nume:'Liceul Forestier',clase:['X E','XI C','XI D','XII C','XII D']},
  {key:'brauner',nume:'Liceul de Arte "Victor Brauner"',clase:['7 MA','X A','X M','XII M','9 M','9 A','XI M','5 AM','5 M','6 A','6 M','8 A','8 M']},
  {key:'tibucani',nume:'Scoala Gimnaziala Comuna Tibucani',clase:['VI','VII','VIII']},
  {key:'dumbrava',nume:'Scoala Gimnaziala Nr. 1 Dumbrava Rosie',clase:['VI','VII A','VII B','VIII']},
  {key:'tupilati',nume:'Scoala Gimnaziala Tupilati',clase:['V','VI','VII','VIII']}
];
function scoli(){const d=window.DIPLOME;return d&&Array.isArray(d.scoli)&&d.scoli.length?d.scoli:SCOLI_COPIE}

const GRESITE_MAX=5,PAUZA_MS=30000;
const COD_COLEGI=['7130','5262','8417','6094','2873'];

/* ---------------- unelte, copiate din prezenta.js (aceleași reguli) ---------------- */
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function faraDiacritice(s){
  const L={'ı':'i','İ':'I','ł':'l','Ł':'L','ø':'o','Ø':'O','đ':'d','Đ':'D','ð':'d','Ð':'D','þ':'th','Þ':'Th',
    'ß':'ss','æ':'ae','Æ':'Ae','œ':'oe','Œ':'Oe','ħ':'h','Ħ':'H','ŧ':'t','Ŧ':'T'};
  return String(s||'').replace(/[ıİłŁøØđĐðÐþÞßæÆœŒħĦŧŦ]/g,c=>L[c])
    .normalize('NFKD').replace(/[̀-ͯ᪰-᫿᷀-᷿⃐-⃿︠-︯]/g,'');
}
const normNume=s=>faraDiacritice(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(' ').sort().join(' ');
const cheieElev=e=>e.scoala+'|'+e.clasa+'|'+normNume(e.nume);
function scurt(nume){const w=String(nume||'').trim().split(/\s+/);return w.length>1?w[w.length-1]+' '+w[0].charAt(0)+'.':w[0]||''}
const ROM={i:1,ii:2,iii:3,iv:4,v:5,vi:6,vii:7,viii:8,ix:9,x:10,xi:11,xii:12,xiii:13};
function cheieClasa(et){const w=String(et||'').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  for(let i=0;i<w.length;i++){const n=/^\d+$/.test(w[i])?+w[i]:ROM[w[i]];if(n)return [n,w.filter((_,j)=>j!==i).join(' ')]}
  return [99,w.join(' ')]}
function cmpClasa(a,b){const x=cheieClasa(a),y=cheieClasa(b);return x[0]-y[0]||x[1].localeCompare(y[1],'ro')}
function normClasa(s,proprii){
  let t=String(s||'').trim().replace(/\s+/g,' ').replace(/^clasa\s+/i,'').replace(/^a\s+/i,'').replace(/-a\b/i,'').toUpperCase();
  t=t.replace(/^(\d+|[IVX]+(?![IVX]))(?=[A-Z])/,'$1 ').slice(0,20);
  if(!t)return '';const k=cheieClasa(t);
  return (proprii||[]).filter(x=>{const q=cheieClasa(x);return q[0]===k[0]&&q[1]===k[1]})[0]||t}
const secunde=n=>n>=20?TEXTE.secDe.replace('{n}',n):n===1?TEXTE.sec1:TEXTE.secN.replace('{n}',n);
/* un text din TEXTE, cu locurile completate (valorile se dau deja „escapate” când e cazul) */
function T(k,o){return TEXTE[k].replace(/\{(\w+)\}/g,(m,x)=>o&&o[x]!=null?o[x]:m)}
function C(k,o){return String(CADRU[k]).replace(/\{(\w+)\}/g,(m,x)=>o&&o[x]!=null?o[x]:m)}

/* ---------------- aspectul: CSS-ul casetei adevărate (#lhp din prezenta.js), pus pe .ic-lhp ----------------
   Diferențe cerute de locul ei (în pagină, nu fixată jos): fără position:fixed și fără înălțimea maximă a ecranului. */
let STIL=false;
function stil(){
  if(STIL)return;STIL=true;const s=document.createElement('style');s.setAttribute('data-sim','intrare-cod');
  s.textContent=`
.ic-cadru{display:flex;flex-direction:column;gap:8px;margin:4px 0}
.ic-caiet{align-self:flex-start;max-width:100%;box-sizing:border-box;padding:7px 12px;border:1px solid var(--line);border-left:6px solid #c0392b;border-radius:6px;
  background:repeating-linear-gradient(0deg,transparent 0 22px,var(--line) 22px 23px),var(--paper);font-size:.95rem;line-height:23px}
.ic-caiet b.ic-cod{font-family:var(--fm,monospace);letter-spacing:.12em}
.ic-ecran{border:2px dashed var(--line);border-radius:10px;padding:8px 10px 12px;background:var(--paper2)}
.ic-ecran>.ic-et{font-size:.82rem;color:var(--ink2);margin:0 0 8px}
.ic-nota{font-size:.92rem;padding:6px 10px;border-left:4px solid var(--accent);background:var(--sel);border-radius:0 6px 6px 0}
.ic-nota:empty{display:none}
.ic-ecran .ic-lhp{font:14px/1.35 system-ui,Segoe UI,Arial,sans-serif;color:#e8ecf4;max-width:100%;text-align:left}
.ic-ecran .ic-lhp .pill{display:inline-flex;align-items:center;gap:6px;background:#1b2234;border:1px solid #33405e;border-radius:999px;padding:5px 11px;cursor:pointer;box-shadow:0 2px 8px #0006;font-size:12.5px;min-height:32px;box-sizing:border-box}
.ic-ecran .ic-lhp .pill:hover{border-color:#5b8cff}.ic-ecran .ic-lhp .dot{width:8px;height:8px;border-radius:50%;background:#34d399;flex:none}
.ic-ecran .ic-lhp .bar{background:#1b2234;border:1px solid #5b8cff;border-radius:12px;padding:12px 14px;box-shadow:0 4px 16px #0008;max-width:420px;box-sizing:border-box}
.ic-ecran .ic-lhp .bar b{color:#fff}.ic-ecran .ic-lhp .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.ic-ecran .ic-lhp button{font:inherit;border-radius:8px;padding:7px 12px;border:1px solid #5b8cff;background:#5b8cff;color:#fff;cursor:pointer}
.ic-ecran .ic-lhp button:disabled{cursor:default}
.ic-ecran .ic-lhp button.g{background:transparent;color:#c8d3ea;border-color:#44506c}.ic-ecran .ic-lhp a{color:#8fb0ff}
.ic-ecran .ic-lhp label{display:block;margin:10px 0 4px;font-size:13px;color:#c8d3ea}
.ic-ecran .ic-lhp select,.ic-ecran .ic-lhp input{width:100%;box-sizing:border-box;font:inherit;padding:8px;border-radius:8px;border:1px solid #44506c;background:#0f1422;color:#fff}
.ic-ecran .ic-lhp .mic{font-size:12px;color:#9aa7c2;margin-top:8px}.ic-ecran .ic-lhp .err{color:#fca5a5;font-size:13px;margin-top:6px}
.ic-ecran .ic-lhp .lista{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;margin-top:10px;max-height:46vh;overflow:auto}
.ic-ecran .ic-lhp .lista .el{display:flex;flex-direction:column;align-items:flex-start;text-align:left;background:#0f1422;border-color:#44506c;padding:8px 10px}
.ic-ecran .ic-lhp .lista .el:hover{border-color:#5b8cff;background:#18213a}.ic-ecran .ic-lhp .lista .el span{font-size:12px;color:#9aa7c2}
.ic-ecran .ic-lhp .bar:has(.lista){max-width:560px}
.ic-ecran .ic-lhp .pill .s{display:none}
.ic-ecran .ic-lhp .pill.cere{border-color:#5b8cff;background:#1d2a4a}.ic-ecran .ic-lhp .pill.cere .dot{background:#5b8cff}
.ic-ecran .ic-lhp input.cod{-webkit-text-security:disc;letter-spacing:.35em;font-size:18px;max-width:9em}
.ic-ecran .ic-lhp button.iesi{background:#b3392f;border-color:#b3392f}
.ic-ecran .ic-lhp .pill.nimeni .dot{background:#9aa7c2}
.ic-ecran .ic-lhp .pill .bt{background:#b3392f;color:#fff;border-radius:999px;padding:2px 9px;font-weight:600;white-space:nowrap;line-height:1.35}
`;
  document.head.appendChild(s);
}

let NR=0;
const TINTA_IMPLICITA={nou:'intrat',acasa:'intrat',lista:'intrat',salut:'intrat',intreaba:'intrat',nimeni:'intrat',
  eticheta:'iesit',meniu:'iesit',uitat:'cerere','fara-cod':'online'};
const START=['nou','acasa','lista','salut','eticheta','meniu','uitat','fara-cod','intreaba','nimeni'];

/* ---------------- o casetă de exersare ---------------- */
function Caseta(Q,body,api){
  stil();
  const n=++NR,id=s=>'ic'+n+'-'+s;
  const start=START.includes(Q.start)?Q.start:'lista';
  const scoalaDe=key=>scoli().filter(x=>x.key===key)[0]||{key,nume:key,clase:[]};
  const om=(p,cls)=>{p=p||{};const sc=p.scoala||(Q.elev&&Q.elev.scoala)||'brauner';
    const o={nume:String(p.nume||'Elev Exersare').trim(),clasa:p.clasa||cls||(Q.elev&&Q.elev.clasa)||'5 AM',scoala:sc,scoalaNume:p.scoalaNume||scoalaDe(sc).nume};
    o.k=cheieElev(o);return o};
  const ELEV=om(Q.elev);
  const K=ELEV.k;
  const SCRIS=Q.scris?om(Object.assign({},Q.elev,Q.scris)):null;   // cum apare în listă (scris greșit)
  const KS=SCRIS?SCRIS.k:K;
  const eTu=k=>k===K||k===KS;
  const COLEGI=(Q.colegi||[]).map((c,i)=>Object.assign(om(c,ELEV.clasa),{cod:c.faraCod?null:String(c.cod||COD_COLEGI[i%COD_COLEGI.length])}));
  const kColegi=new Set(COLEGI.map(c=>c.k));
  const codCaiet=Q.cod!=null?String(Q.cod):null;
  let tinta=Q.tinta||(SCRIS?'corectat':TINTA_IMPLICITA[start]);
  if(tinta==='reintrat')tinta=['iesit','intrat'];
  const PE=Q.pe?(COLEGI.filter(c=>c.nume===Q.pe)[0]||om({nume:Q.pe})):null;

  /* starea (echivalentul localStorage-ului casetei adevărate, aici doar în memorie) */
  const S={lista:[],coduri:{},eu:null,intreaba:false,refuz:false,iesit:false,mesajIesit:'',g:{n:0,pana:0},
    cereri:{},deblocat:{},ev:[],venit:null,codAles:null,gest:false};
  let ultima=1e6;
  const inLista=(p,cod)=>{S.lista.push({k:p.k,nume:p.nume,clasa:p.clasa,scoala:p.scoala,scoalaNume:p.scoalaNume,cod:cod||null,ultima:ultima--});if(cod)S.coduri[p.k]=cod};
  const eu0=SCRIS||ELEV;
  if(start!=='nou'&&start!=='acasa'){
    const elevCod=start==='fara-cod'||(Q.elev&&Q.elev.faraCod)?null:(codCaiet||'0000');
    if(COLEGI.length){inLista(COLEGI[0],COLEGI[0].cod);inLista(eu0,elevCod);COLEGI.slice(1).forEach(c=>inLista(c,c.cod))}
    else inLista(eu0,elevCod);
  }
  const intrare=k=>S.lista.filter(x=>x.k===k)[0]||null;
  const conecteaza=(x,cod)=>{S.eu={k:x.k,nume:x.nume,clasa:x.clasa,scoala:x.scoala,scoalaNume:x.scoalaNume,cod:cod||null}};
  if(start==='eticheta'||start==='meniu'||start==='intreaba'){const x=intrare((PE||eu0).k)||PE||eu0;conecteaza(x,x.cod||S.coduri[x.k]);if(start==='intreaba')S.intreaba=true}
  if(start==='fara-cod'){conecteaza(intrare(eu0.k),null)}
  if(start==='nimeni'){S.iesit=true}
  if(S.eu){const x=intrare(S.eu.k);if(x)x.ultima=2e6}   // judecata casetei P5: după „Ieși” → „Intră”, cine era conectat e primul în listă
  const kStart=S.eu?S.eu.k:null;   // cine era conectat la început: „Ieși” / „Schimbă elevul” pe numele lui contează (și la un coleg rămas conectat)

  /* ---------------- desenul ---------------- */
  body.innerHTML=`<div class="ic-cadru">
    <div class="ic-caiet" aria-label="${esc(CADRU.caiet)}"></div>
    <div class="ic-ecran"><p class="ic-et">${esc(CADRU.eticheta)}</p><div class="ic-lhp" role="region" aria-label="Caseta de exersare"></div></div>
    <div class="ic-nota" aria-live="polite"></div></div>`;
  const root=body.querySelector('.ic-lhp'),caietEl=body.querySelector('.ic-caiet'),notaEl=body.querySelector('.ic-nota');
  const nota=h=>{notaEl.innerHTML=h||''};
  function caiet(){
    let c;
    if(start==='uitat')c=`<i>${esc(CADRU.codLipsa)}</i>`;
    else if(codCaiet&&start!=='fara-cod')c=`<b class="ic-cod">${esc(codCaiet)}</b>`;
    else if(S.codAles)c=`<b class="ic-cod">${esc(S.codAles)}</b>`;
    else c=`<i>${esc(start==='fara-cod'?CADRU.codNuAi:CADRU.codAlege)}</i>`;
    caietEl.innerHTML=`📒 <b>${esc(CADRU.caiet)}</b>: ${esc(ELEV.nume)} · ${esc(ELEV.clasa)} · ${esc(CADRU.codCaiet)} ${c}`;
  }
  let act={};
  function arata(html,a){root.innerHTML=html;act=a||{}}
  root.addEventListener('click',e=>{
    const b=e.target.closest('[data-a]');if(!b||!root.contains(b))return;
    if(b.disabled)return;S.gest=true;const f=act[b.getAttribute('data-a')];if(f)f(b,e);
  });
  root.addEventListener('keydown',e=>{
    if(e.key!=='Enter')return;const i=e.target.closest('[data-enter]');if(!i)return;
    const b=root.querySelector(`[data-a="${i.getAttribute('data-enter')}"]`);if(b&&!b.disabled){e.preventDefault();b.click()}
  });
  const vie=()=>root.isConnected;
  const dupa=(ms,f)=>setTimeout(()=>{if(vie())f()},ms);
  let lucru=0;   // judecata casetei P8: câte acțiuni (Intră, Trimite, Păstrează, Gata, corectura) sunt încă în curs
  const dupaL=(ms,f)=>{lucru++;setTimeout(()=>{lucru--;if(vie())f()},ms)};
  const $=s=>root.querySelector(s);
  const camp=(i,cls,extra)=>`<input id="${id(i)}"${cls?' class="cod"':''} inputmode="numeric" maxlength="4" autocomplete="off"${extra||''}>`;
  const focus=i=>{if(!S.gest)return;try{root.querySelector('#'+id(i)).focus({preventScroll:true})}catch(e){}};
  const jurnal=(e,o)=>S.ev.push(Object.assign({e,t:Date.now()},o||{}));

  /* ---------------- pauza după 5 coduri greșite (pauza(), gresit(), asteaptaPauza() din prezenta.js) ---------------- */
  const pauza=()=>S.g.pana&&S.g.pana>Date.now()?S.g.pana-Date.now():0;
  function gresit(){let g=S.g;if(g.pana)g={n:0,pana:0};g.n=(g.n||0)+1;if(g.n>=GRESITE_MAX)g={n:0,pana:Date.now()+PAUZA_MS};S.g=g;jurnal('gresit');return g.pana?0:GRESITE_MAX-g.n}
  function asteaptaPauza(btn,err,text){
    (function tick(){
      if(!btn.isConnected)return;
      const p=pauza();
      if(!p){btn.disabled=false;btn.textContent=text;err.textContent='';return}
      const s=Math.ceil(p/1000);
      btn.disabled=true;btn.textContent=T('asteapta',{s});
      err.textContent=T('pauza',{secunde:secunde(s)});
      setTimeout(tick,1000);
    })();
  }
  function mesajCod(r,ramase){
    if(r.motiv==='mutat')return TEXTE.mutat;
    if(r.motiv==='asteptare')return TEXTE.asteptare;
    return TEXTE.gresit+(ramase===1?TEXTE.ramase1:ramase===2?TEXTE.ramase2:ramase>0?TEXTE.ramaseMulte:'');
  }
  /* verificaCod: pe calculator (fără server). hStiut = codul ținut pe calculator pentru numele ăsta */
  function verificaCod(x,cod,hStiut){
    if(!hStiut)return {ok:true,nou:true};
    if(cod===hStiut)return S.deblocat[x.k]&&S.deblocat[x.k]!==cod?{ok:false,motiv:'mutat'}:{ok:true};
    if(S.deblocat[x.k]===cod)return {ok:true,deblocat:true};
    if(S.cereri[x.k]===cod)return {ok:false,motiv:'asteptare'};
    return {ok:false,motiv:'gresit'};
  }
  const codStiut=k=>{const x=intrare(k);return (x&&x.cod)||S.coduri[k]||null};
  function inregistreaza(){
    if(!S.eu)return;const e=S.eu,vechi=intrare(e.k);
    S.lista=S.lista.filter(x=>x.k!==e.k);
    S.lista.unshift({k:e.k,nume:e.nume,clasa:e.clasa,scoala:e.scoala,scoalaNume:e.scoalaNume,cod:e.cod||(vechi&&vechi.cod)||null,ultima:Date.now()});
    if(e.cod)S.coduri[e.k]=e.cod;
  }

  /* ---------------- ce arată caseta (randeaza() din prezenta.js) ---------------- */
  function stare(){return S.eu?(S.intreaba?'intreaba':'activ'):(S.refuz?'vizitator':'necunoscut')}
  function randeaza(){
    const s=stare();
    if(s==='vizitator'){
      arata(`<span class="pill" data-a="viz" style="opacity:.75"><span class="dot" style="background:#9aa7c2"></span><span class="t">${T('pillViz')}</span><span class="s" aria-hidden="true">${T('pillVizS')}</span></span>`,{viz:()=>formular()});
      return;
    }
    if(s==='activ'){
      const sc=esc(scurt(S.eu.nume));
      arata(`<span class="pill" data-a="pill"><span class="dot"></span><span class="t">${T('pillActiv',{scurt:sc})}</span><span class="s" aria-hidden="true"><b>${sc}</b></span><span class="bt">${T('pillIesi')}</span></span>`,{pill:()=>meniu()});
      return;
    }
    if(s==='intreaba'){
      arata(`<div class="bar">${T('intreaba',{nume:esc(S.eu.nume),clasa:esc(S.eu.clasa)})}<div class="mic">${T('intreabaMic')}</div><div class="row"><button type="button" data-a="da">${T('bDa')}</button><button type="button" class="g" data-a="nu">${T('bNu')}</button></div></div>`,
        {da:()=>{S.intreaba=false;jurnal('confirmat',{k:S.eu.k});randeaza()},nu:()=>{jurnal('nu-eu',{k:S.eu.k});uita();alege()}});
      return;
    }
    if(S.iesit){
      if(S.mesajIesit){
        arata(`<div class="bar" role="status"><span>${S.mesajIesit}</span><div class="row"><button type="button" data-a="intra2">${T('bIntra')}</button><button type="button" class="g" data-a="bine">${T('bBine')}</button></div></div>`,
          {intra2:()=>{S.mesajIesit='';alege()},bine:()=>{S.mesajIesit='';randeaza()}});
      }else{
        arata(`<span class="pill cere nimeni" data-a="nimeni"><span class="dot"></span><span class="t">${T('pillNimeni')}</span><span class="s" aria-hidden="true">${T('pillNimeniS')}</span></span>`,{nimeni:()=>{S.mesajIesit='';alege()}});
      }
      return;
    }
    if(S.lista.length){alege();return}
    arata(`<div class="bar">${T('intrebare')}<div class="mic">${T('nota')}</div><div class="mic">${T('notaNota')}</div><div class="row"><button type="button" data-a="cine">${T('bCine')}</button><button type="button" class="g" data-a="viz">${T('bViz')}</button></div></div>`,
      {cine:()=>formular(),viz:()=>{S.refuz=true;jurnal('vizitator');randeaza()}});
  }

  function meniu(){
    const e=S.eu;
    arata(`<div class="bar">${T('meniu',{nume:esc(e.nume),clasa:esc(e.clasa),scoala:esc(e.scoalaNume||e.scoala)})}`+
      `<div class="row"><button type="button" class="iesi" data-a="iesi">${T('bIesi')}</button><button type="button" class="g" data-a="x">${T('bInchide')}</button></div>`+
      `<div class="mic">${T('meniuPleci')}</div><div class="mic">${T('meniuVede')}</div><div class="mic">${T('nota')}</div><div class="mic">${T('notaNota')}</div>`+
      (e.cod?`<div class="mic">${T('meniuOnline')}</div>`:`<div class="mic">${T('meniuLocal')}</div>`)+
      `<div class="row"><a data-a="jurnal"><button type="button">${T('bJurnal')}</button></a>${e.cod?'':`<button type="button" data-a="cod">${T('bPastreazaOnline')}</button>`}`+
      `<button type="button" class="g" data-a="alt">${T('bAlt')}</button></div>`+
      `<div class="row"><button type="button" class="g" data-a="corect">${T('bCorect')}</button></div>`+
      `<div class="row"><button type="button" class="g" data-a="scoate">${T('bScoate')}</button></div></div>`,
      {iesi:()=>iesi(),x:()=>randeaza(),jurnal:()=>nota(esc(CADRU.jurnal)),cod:()=>cereCod(),
       alt:()=>{jurnal('schimbat',{k:S.eu.k});uita();alege()},corect:()=>corecteaza(),
       scoate:()=>{const k=S.eu.k;if(S.eu.cod)S.coduri[k]=S.eu.cod;S.lista=S.lista.filter(x=>x.k!==k);jurnal('scos',{k});iesi(true)}});
  }
  function iesi(scos){   // scos = din „Scoate-mă din lista calculatorului”: nu se numără ca „Ieși (deconectare)” (judecata casetei P1)
    const nume=S.eu?S.eu.nume:'';if(S.eu&&!scos)jurnal('iesit',{k:S.eu.k});
    S.iesit=true;uita();
    S.mesajIesit=T('iesit',{nume:esc(nume)});   // în exersare, „Ieși” e mereu pe un nume (prezenta.js: „Ai ieșit, X. …”)
    randeaza();
  }
  function uita(){S.eu=null;S.intreaba=false}

  /* „Cine lucrează acum?” */
  function alege(){
    const l=S.lista.slice().sort((a,b)=>(b.ultima||0)-(a.ultima||0));
    if(!l.length){formular();return}
    arata(`<div class="bar">${T('lista')}<div class="mic">${T('listaMic')}</div><div class="lista">`+
      l.map((x,i)=>`<button type="button" class="el" data-a="el" data-i="${i}"><b>${esc(x.nume)}</b><span>${esc(x.clasa)}${x.cod?T('listaNor'):''}</span></button>`).join('')+'</div>'+
      `<div class="row"><button type="button" data-a="nou">${T('bNuSunt')}</button><button type="button" class="g" data-a="x">${T('bMaiTarziu')}</button></div>`+
      `<div class="mic">${T('listaJos')}</div></div>`,
      {el:b=>eSunt(l[+b.getAttribute('data-i')]),nou:()=>formular(),x:()=>{S.refuz=true;jurnal('vizitator');randeaza()}});
  }

  /* „Salut, X!”: fereastra care cere codul (eSunt) */
  function eSunt(x){
    const hStiut=codStiut(x.k),nou=!hStiut;
    jurnal('salut',{k:x.k});
    arata(`<div class="bar">${T('salut',{nume:esc(x.nume),clasa:esc(x.clasa)})}`+
      (nou?`<div class="mic">${T('salutNou')}</div>`:`<div class="mic">${T('salutVechi')}</div>`)+
      `<label for="${id('pc')}">${nou?T('etAlegeCod'):T('etCodTau')}</label>${camp('pc',true,' data-enter="intra"')}`+
      (nou?`<label for="${id('pc2')}">${T('etIncaOData')}</label>${camp('pc2',true,' data-enter="intra"')}`:'')+
      `<div class="err" aria-live="polite"></div><div class="row"><button type="button" data-a="intra">${T('bIntra')}</button><button type="button" class="g" data-a="inapoi">${T('bInapoiLista')}</button></div>`+
      (nou?'':`<div class="row"><button type="button" class="g" data-a="uitat">${T('bUitat')}</button></div>`)+'</div>',
      {inapoi:()=>alege(),uitat:()=>uitat(x,()=>eSunt(x)),intra:btn=>{
        const err=$('.err');
        if(pauza()){asteaptaPauza(btn,err,T('bIntra'));return}
        const c=$('#'+id('pc')).value.trim();
        if(!/^\d{4}$/.test(c)){err.textContent=TEXTE.cod4;return}
        if(nou&&$('#'+id('pc2')).value.trim()!==c){err.textContent=TEXTE.codDiferit;return}
        btn.disabled=true;err.textContent=TEXTE.verific;
        dupaL(350,()=>{
          const r=verificaCod(x,c,hStiut);
          if(r.ok){S.g={n:0,pana:0};if(r.deblocat){S.coduri[x.k]=c;delete S.deblocat[x.k];delete S.cereri[x.k]}intra(x,c,nou);return}
          const ramase=r.motiv==='gresit'?gresit():-1;
          $('#'+id('pc')).value='';btn.disabled=false;err.textContent=mesajCod(r,ramase);
          if(ramase===0)asteaptaPauza(btn,err,T('bIntra'));
          focus('pc');
        });
      }});
    if(pauza())asteaptaPauza($('[data-a="intra"]'),$('.err'),T('bIntra'));
    focus('pc');
  }
  /* „Mi-am uitat codul” */
  function uitat(x,inapoi){
    arata(`<div class="bar">${T('uitat',{nume:esc(x.nume),clasa:esc(x.clasa)})}<div class="mic">${T('uitatMic')}</div>`+
      `<label for="${id('n1')}">${T('etCodNou')}</label>${camp('n1',true)}<label for="${id('n2')}">${T('etIncaOData')}</label>${camp('n2',true,' data-enter="trimite"')}`+
      `<div class="err" aria-live="polite"></div><div class="row"><button type="button" data-a="trimite">${T('bTrimite')}</button><button type="button" class="g" data-a="inapoi">${T('bInapoi')}</button></div></div>`,
      {inapoi:()=>inapoi(),trimite:btn=>{
        const err=$('.err'),c=$('#'+id('n1')).value.trim();
        if(!/^\d{4}$/.test(c)){err.textContent=TEXTE.codNou4;return}
        if($('#'+id('n2')).value.trim()!==c){err.textContent=TEXTE.codDiferit;return}
        btn.disabled=true;err.textContent=TEXTE.trimit;
        dupaL(450,()=>{
          jurnal('cerere',{k:x.k});
          if(Q.deblocat){S.deblocat[x.k]=c;delete S.cereri[x.k]}else S.cereri[x.k]=c;
          if(eTu(x.k)&&!codCaiet){S.codAles=c;caiet()}
          arata(`<div class="bar" role="status">${T('cerereOk')}<div class="row"><button type="button" data-a="am">${T('bAmInteles')}</button></div></div>`,{am:()=>alege()});
          if(Q.deblocat)nota(esc(CADRU.deblocat));
        });
      }});
    focus('n1');
  }
  /* codul e bun: elevul x intră (intra()) */
  function intra(x,cod,codNou){
    conecteaza(x,cod||codStiut(x.k));S.iesit=false;S.mesajIesit='';S.refuz=false;S.intreaba=false;
    inregistreaza();jurnal('intrat',{k:x.k,codNou:!!codNou});
    if(codNou&&eTu(x.k)&&!codCaiet){S.codAles=cod;caiet()}
    arata(`<div class="bar">${T('intra',{nume:esc(x.nume)})}</div>`);
    dupa(600,randeaza);
  }
  /* „Păstrează progresul online” (cereCod) */
  function cereCod(){
    arata(`<div class="bar">${T('pastreaza')}<div class="mic">${T('pastreazaMic')}</div>`+
      `<label for="${id('k')}">${T('etCodTau')}</label><input id="${id('k')}" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="${TEXTE.exCod}">`+   /* fără Enter, ca în prezenta.js (judecata casetei P2) */
      `<div class="err"></div><div class="row"><button type="button" data-a="ok">${T('bPastreaza')}</button><button type="button" class="g" data-a="x">${T('bInapoi')}</button></div></div>`,
      {x:()=>meniu(),ok:btn=>{
        const c=$('#'+id('k')).value.trim();
        if(!/^\d{4}$/.test(c)){$('.err').textContent=TEXTE.cod4;return}
        btn.disabled=true;
        dupaL(350,()=>{S.eu.cod=c;inregistreaza();jurnal('online',{k:S.eu.k});if(eTu(S.eu.k)){S.codAles=c;caiet()}meniu()});
      }});
    focus('k');
  }
  /* corectura numelui (corecteaza, formular({cod}), salveazaCorectura) */
  function corecteaza(){
    const e=S.eu;
    if(!e.cod){
      arata(`<div class="bar">${T('corAlegeCod')}<div class="mic">${T('corAlegeCodMic')}</div><div class="row"><button type="button" data-a="ok">${T('bAlegCod')}</button><button type="button" class="g" data-a="x">${T('bInapoi')}</button></div></div>`,
        {ok:()=>cereCod(),x:()=>meniu()});
      return;
    }
    arata(`<div class="bar">${T('corCod',{nume:esc(e.nume),clasa:esc(e.clasa)})}<div class="mic">${T('corCodMic')}</div>`+
      `<label for="${id('pc')}">${T('etCodTau')}</label>${camp('pc',true,' data-enter="ok"')}`+
      `<div class="err" aria-live="polite"></div><div class="row"><button type="button" data-a="ok">${T('bMaiDeparte')}</button><button type="button" class="g" data-a="x">${T('bInapoi')}</button></div></div>`,
      {x:()=>meniu(),ok:btn=>{
        const err=$('.err'),c=$('#'+id('pc')).value.trim();
        if(!/^\d{4}$/.test(c)){err.textContent=TEXTE.cod4;return}
        if(pauza()){asteaptaPauza(btn,err,T('bMaiDeparte'));return}
        btn.disabled=true;
        dupaL(300,()=>{
          if(c!==e.cod){const ramase=gresit();btn.disabled=false;err.textContent=mesajCod({motiv:'gresit'},ramase);if(ramase===0)asteaptaPauza(btn,err,T('bMaiDeparte'));return}
          S.g={n:0,pana:0};formular({cod:c});
        });
      }});
    if(pauza())asteaptaPauza($('[data-a="ok"]'),$('.err'),T('bMaiDeparte'));
    focus('pc');
  }

  /* „Cine ești?” (formular); cor = {cod} la corectură */
  function formular(cor){
    const GATA=cor?T('bSalveaza'):T('bGata'),SC=scoli();
    arata(`<div class="bar">`+(cor?`${T('corForm')}<div class="mic">${T('corFormMic')}</div>`:`${T('cineEsti')}<div class="mic">${T('cineEstiMic')}</div><div class="mic">${T('nota')}</div><div class="mic">${T('notaNota')}</div>`)+
      `<label for="${id('s')}">${T('etScoala')}</label><select id="${id('s')}"><option value="">${T('alege')}</option>`+
        SC.map(x=>`<option value="${esc(x.key)}">${esc(x.nume)}</option>`).join('')+`<option value="alta">${T('altaScoala')}</option></select>`+
      `<div class="ic-alta" style="display:none"><label for="${id('as')}">${T('etNumeScoala')}</label><input id="${id('as')}" maxlength="60" autocomplete="off" placeholder="${TEXTE.exScoala}">`+
        `<label for="${id('al')}">${T('etLocalitate')}</label><input id="${id('al')}" maxlength="50" autocomplete="off" placeholder="${TEXTE.exLocalitate}">`+
        `<label for="${id('ac')}">${T('etClasa')}</label><input id="${id('ac')}" maxlength="20" autocomplete="off" placeholder="${TEXTE.exClasa}"></div>`+
      `<div class="ic-cc"><label for="${id('c')}">${T('etClasa')}</label><select id="${id('c')}" disabled><option value="">${T('alegeIntai')}</option></select>`+
        `<div class="ic-cxw" style="display:none"><label for="${id('cx')}">${T('etScrieClasa')}</label><input id="${id('cx')}" maxlength="20" autocomplete="off" placeholder="${TEXTE.exClasa}"></div></div>`+
      `<label for="${id('n')}">${T('etNume')}</label><input id="${id('n')}" maxlength="40" autocomplete="off" placeholder="${TEXTE.exNume}" data-enter="ok">`+
      (cor?'':`<label for="${id('k')}">${T('etCodSecret')}</label><input id="${id('k')}" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="${TEXTE.exCod}">`+
        `<div class="mic">${T('formMic')}</div>`)+
      `<div class="err" aria-live="polite"></div><div class="row"><button type="button" data-a="ok">${GATA}</button>`+
      (cor?`<button type="button" class="g" data-a="x">${T('bInapoi')}</button></div>`
        :(S.lista.length?`<button type="button" class="g" data-a="inapoi">${T('bInapoiLista')}</button>`:'')+`<button type="button" class="g" data-a="x">${T('bMaiTarziu')}</button></div>`+
        `<div class="row"><button type="button" class="g" data-a="uitat">${T('bUitat')}</button></div>`)+'</div>',
      {x:cor?()=>meniu():()=>{randeaza()},inapoi:()=>alege(),uitat:()=>{const err=$('.err');err.textContent='';const e=date();if(!e)return;uitat(e,()=>formular())},
       ok:btn=>{const err=$('.err');err.textContent='';const nou=date();if(!nou)return;if(cor){salveazaCorectura(nou,btn);return}gata(nou,btn)}});
    const sel=$('#'+id('s')),cls=$('#'+id('c'));
    sel.onchange=()=>{
      const alta=sel.value==='alta';
      $('.ic-alta').style.display=alta?'':'none';$('.ic-cc').style.display=alta?'none':'';
      const sc=SC.filter(x=>x.key===sel.value)[0];
      cls.innerHTML=`<option value="">${T('alege')}</option>`+(sc?sc.clase.slice().sort(cmpClasa).map(x=>`<option>${esc(x)}</option>`).join('')+`<option value="__alta">${T('altaClasa')}</option>`:'');
      cls.disabled=!sc;$('.ic-cxw').style.display='none';
    };
    cls.onchange=()=>{const alta=cls.value==='__alta';$('.ic-cxw').style.display=alta?'':'none';if(alta)$('#'+id('cx')).focus()};
    if(cor&&S.eu){
      const e=S.eu;
      if(e.scoala==='alta'||SC.some(x=>x.key===e.scoala)){sel.value=e.scoala;sel.onchange()}
      if([].some.call(cls.options,o=>o.value===e.clasa))cls.value=e.clasa;
      else if(sel.value){cls.value='__alta';cls.onchange();$('#'+id('cx')).value=e.clasa}
      $('#'+id('n')).value=e.nume;
    }
    function date(){
      const err=$('.err');let sc=sel.value,cl=cls.value,st='';const nm=$('#'+id('n')).value.trim().replace(/\s+/g,' ');
      if(sc==='alta'){
        const as=$('#'+id('as')).value.trim(),al=$('#'+id('al')).value.trim();cl=$('#'+id('ac')).value.trim();
        if(!as||!al||!cl){err.textContent=TEXTE.errAlta;return null}
        st=(as+', '+al).slice(0,120);
      }else if(cl==='__alta'){
        cl=normClasa($('#'+id('cx')).value,((SC.filter(x=>x.key===sc)[0])||{}).clase);
        if(!cl){err.textContent=TEXTE.errClasa;return null}
      }
      if(!sc||!cl){err.textContent=TEXTE.errScoalaClasa;return null}
      if(nm.split(' ').length<2){err.textContent=TEXTE.errNume;return null}
      const sn=st||(SC.filter(x=>x.key===sc)[0]||{}).nume||sc;
      const e={nume:nm,clasa:cl,scoala:sc,scoalaNume:sn};if(st)e.scoalaText=st;e.k=cheieElev(e);return e;
    }
  }
  function gata(nou,btn){
    const err=$('.err'),cod=$('#'+id('k')).value.trim();
    if(!/^\d{4}$/.test(cod)){err.textContent=TEXTE.errCod;return}
    const pe=intrare(nou.k)||(S.coduri[nou.k]?{}:null),hStiut=codStiut(nou.k);
    if(hStiut&&pauza()){asteaptaPauza(btn,err,TEXTE.bGata);return}
    btn.disabled=true;err.textContent=TEXTE.verific;
    dupaL(350,()=>{
      const r=verificaCod(nou,cod,hStiut);
      if(!r.ok){
        const ramase=r.motiv==='gresit'?gresit():-1;btn.disabled=false;
        err.textContent=(r.motiv==='gresit'?T('errAltCod',{nume:nou.nume}):'')+mesajCod(r,ramase)+(r.motiv==='gresit'?TEXTE.errAltCodUitat:'');
        if(ramase===0)asteaptaPauza(btn,err,TEXTE.bGata);
        return;
      }
      if(hStiut)S.g={n:0,pana:0};
      if(r.deblocat){S.coduri[nou.k]=cod;delete S.deblocat[nou.k];delete S.cereri[nou.k]}
      const x=intrare(nou.k);
      conecteaza(x?Object.assign({},x,{nume:nou.nume}):nou,cod);S.iesit=false;   // judecata casetei P4: numele TASTAT
     S.mesajIesit='';S.refuz=false;S.intreaba=false;
      inregistreaza();
      jurnal(pe?'intrat':'inscris',{k:nou.k,nume:nou.nume,clasa:nou.clasa,scoala:nou.scoala});
      if(eTu(nou.k)&&!codCaiet){S.codAles=cod;caiet()}
      if(start==='acasa'){S.venit=nou.k===K&&cod===codCaiet;nota(esc(S.venit?CADRU.venit:CADRU.nevenit))}
      err.textContent=TEXTE.caut;
      dupa(450,randeaza);
    });
  }
  function salveazaCorectura(nou,btn){
    const err=$('.err'),e=S.eu,kVechi=e.k;
    if(nou.k===kVechi){err.textContent=TEXTE.corNimic;return}
    btn.disabled=true;err.textContent=TEXTE.corMut;
    dupaL(450,()=>{
      const pc=intrare(nou.k),hPc=pc?pc.cod:(S.coduri[nou.k]||null);
      if((pc||S.coduri[nou.k])&&hPc!==e.cod){btn.disabled=false;err.textContent=T('corDeja',{nume:nou.nume,cuAlt:hPc?TEXTE.corCuAlt:''});return}
      S.lista=S.lista.filter(x=>x.k!==kVechi);delete S.coduri[kVechi];
      S.eu={k:nou.k,nume:nou.nume,clasa:nou.clasa,scoala:nou.scoala,scoalaNume:nou.scoalaNume,cod:e.cod};
      inregistreaza();jurnal('corectat',{din:kVechi,k:nou.k,nume:nou.nume,clasa:nou.clasa,scoala:nou.scoala});
      arata(`<div class="bar" role="status">${T('corGata',{nume:esc(S.eu.nume),clasa:esc(S.eu.clasa),scoala:esc(S.eu.scoalaNume||S.eu.scoala)})}<div class="row"><button type="button" data-a="bine2">${T('bBine')}</button></div></div>`,{bine2:()=>randeaza()});
    });
  }

  /* ---------------- „Verifică” (ce a ajuns elevul să facă) ---------------- */
  function evalueaza(){
    const E=S.ev,eu=S.eu;
    /* judecata casetei P3: o înscriere (sau o corectură) mutată apoi de o corectură nu mai e o a doua înscriere */
    const mutata=k=>E.some(y=>y.e==='corectat'&&y.din===k);
    const inscrieri=E.filter(x=>(x.e==='inscris'||x.e==='corectat')&&x.nume&&!eTu(x.k)&&!kColegi.has(x.k)&&!mutata(x.k));
    if(inscrieri.length){
      const x=inscrieri[inscrieri.length-1];
      const ce=normNume(x.nume)===normNume(ELEV.nume)&&x.scoala===ELEV.scoala?C('aDouaClasa',{clasa:esc(x.clasa)})
        :x.scoala!==ELEV.scoala?C('aDouaScoala'):C('aDouaNume',{nume:esc(x.nume)});
      return {ok:false,m:C('aDoua',{ce})};
    }
    if(eu&&!eTu(eu.k))return {ok:false,m:C('peColeg',{nume:esc(eu.nume)})};
    if(S.intreaba)return {ok:false,m:C('intreabaPrimul')};
    const pasi=Array.isArray(tinta)?tinta:[tinta];
    if(!pasi.includes('cerere')&&codCaiet&&E.some(x=>x.e==='cerere'&&eTu(x.k)))return {ok:false,m:C('cerereFaraRost')};
    // pașii ceruți, în ordine, în jurnalul exersării (doar ai elevului)
    const echiv={intrat:['intrat','inscris','corectat','confirmat'],iesit:['iesit'],schimbat:['schimbat','iesit'],cerere:['cerere'],online:['online'],corectat:['corectat']};
    const alLui=x=>eTu(x.k)||(x.e==='corectat'&&eTu(x.din))||(['iesit','schimbat','scos'].includes(x.e)&&kStart&&x.k===kStart);
    let i=0;for(const x of E){if(i<pasi.length&&(echiv[pasi[i]]||[pasi[i]]).includes(x.e)&&alLui(x))i++}
    const ultim=pasi[pasi.length-1],gol=!E.some(x=>x.e!=='salut');
    if(i<pasi.length){
      const lipsa=pasi[i];
      const m=lipsa==='intrat'?(i>0?C('nuReintrat'):C('nuIntrat')+' '+C(start==='nou'?'pasiNou':start==='acasa'?'pasiAcasa':'pasiLista'))
        :lipsa==='iesit'||lipsa==='schimbat'?C(E.some(x=>x.e==='scos'&&alLui(x))?'scos':eu?'incaConectat':'nuIesit'):lipsa==='cerere'?C('nuCerere'):lipsa==='online'?C('nuOnline'):C('nuCorectat');
      return {ok:false,m,gol};
    }
    if(['intrat','online','corectat'].includes(ultim)&&!(eu&&(ultim==='corectat'?eu.k===K:eTu(eu.k))))return {ok:false,m:C('nuIntrat')+' '+C('pasiLista')};
    if(ultim==='online'&&!(eu&&eu.cod))return {ok:false,m:C('nuOnline')};
    if((ultim==='iesit'||ultim==='schimbat')&&eu&&eTu(eu.k))return {ok:false,m:C('incaConectat')};
    if(start==='acasa'&&ultim==='intrat'&&!S.venit)return {ok:false,m:C('nuVenit')};
    return {ok:true};
  }
  function textArata(){
    const p=Array.isArray(tinta)?(tinta.length>1&&tinta[0]==='iesit'?'reintrat':tinta[tinta.length-1]):tinta;
    const k=p==='intrat'&&(start==='nou'||start==='acasa')?start:p;
    return 'apeși '+esc(CADRU.arata[k]||CADRU.arata.intrat);
  }

  /* starea-țintă (rezolva) și o stare greșită tipică (gresit), pentru poartă */
  function laTinta(){
    const pasi=Array.isArray(tinta)?tinta:[tinta],ultim=pasi[pasi.length-1];
    const x=intrare(KS)||intrare(K)||ELEV,cod=codCaiet||S.codAles||'2468';
    S.intreaba=false;S.refuz=false;
    pasi.forEach(p=>{
      if(p==='intrat'){conecteaza(x,x.cod||cod);S.iesit=false;inregistreaza();jurnal('intrat',{k:x.k});if(start==='acasa')S.venit=true}
      else if(p==='iesit'||p==='schimbat'){if(!S.eu)conecteaza(x,x.cod||cod);jurnal(p,{k:S.eu.k});S.iesit=true;S.mesajIesit=T('iesit',{nume:esc(S.eu.nume)});uita()}
      else if(p==='cerere'){jurnal('cerere',{k:x.k});S.cereri[x.k]='6182'}
      else if(p==='online'){if(!S.eu)conecteaza(x,null);S.eu.cod=cod;inregistreaza();jurnal('online',{k:S.eu.k})}
      else if(p==='corectat'){if(!S.eu||S.eu.k!==K){const din=(S.eu||x).k;S.lista=S.lista.filter(y=>y.k!==din);conecteaza(ELEV,cod);inregistreaza();jurnal('corectat',{din,k:K})}}
    });
    if(ultim==='cerere')arata(`<div class="bar" role="status">${T('cerereOk')}<div class="row"><button type="button" data-a="am">${T('bAmInteles')}</button></div></div>`,{am:()=>alege()});
    else randeaza();
  }
  function stareGresita(){
    const pasi=Array.isArray(tinta)?tinta:[tinta],ultim=pasi[pasi.length-1];
    if(ultim==='iesit'||ultim==='schimbat'){const x=intrare(KS)||ELEV;conecteaza(x,x.cod||codCaiet||'2468');S.iesit=false;S.intreaba=false;randeaza();return}
    if(COLEGI.length){const c=COLEGI[0];conecteaza(c,c.cod);inregistreaza();jurnal('intrat',{k:c.k});randeaza();return}
    // fără colegi: a doua înscriere, cu altă clasă
    const sc=scoalaDe(ELEV.scoala),alta=(sc.clase||[]).filter(c=>c!==ELEV.clasa)[0]||'VIII';
    const e=om({nume:ELEV.nume,clasa:alta,scoala:ELEV.scoala});conecteaza(e,'1357');inregistreaza();
    jurnal('inscris',{k:e.k,nume:e.nume,clasa:e.clasa,scoala:e.scoala});randeaza();
  }

  caiet();
  if(start==='salut'||start==='uitat'){const x=intrare(eu0.k);eSunt(x)}
  else if(start==='meniu')meniu();
  else randeaza();

  let amanat=false;
  function verifica(){
    const r=evalueaza();
    if(r.ok){nav.innerHTML='';api.resolve(true);return}
    api.resolve(false,r.m,r.gol);
    api.revealButton(()=>{laTinta();nav.innerHTML='';api.giveUp(textArata()+' Caseta de mai sus arată acum cum trebuia să ajungă.')});
  }
  const nav=api.checkButton(()=>{
    if(!lucru){verifica();return}
    if(amanat)return;amanat=true;   // „Intră” / „Trimite” încă lucrează: Verifică vine imediat după (judecata casetei P8)
    (function asteapta(){if(!vie())return;if(lucru)return setTimeout(asteapta,50);amanat=false;verifica()})();
  });
  body._intrareCod={stare:()=>JSON.parse(JSON.stringify({start,tinta,eu:S.eu,lista:S.lista,ev:S.ev,g:S.g,iesit:S.iesit,cereri:S.cereri,deblocat:S.deblocat,venit:S.venit})),
    rezolva:laTinta,gresit:stareGresita,evalueaza,cheie:K};
}

const intrare={
  render(Q,body,api){Caseta(Q,body,api)},
  rezolva(Q,body){body._intrareCod.rezolva()},
  gresit(Q,body){body._intrareCod.gresit()}
};
window.SimIntrareCod={intrare,TEXTE,CADRU,SCOLI_COPIE,START,versiune:'intrare-cod-2026-10-16b'};
})();
