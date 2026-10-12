/* Extensia „etichete, agenda, netichetă” a simulatorului poștei Gmail — fișier comun (lectii/_sim/posta-gmail-dosare.js).
   Se încarcă DUPĂ lectii/_sim/posta-gmail.js și lectii/_sim/posta-gmail-scrie.js, pe care NU le schimbă.
   PROPRIETAR: autorul lecției VI · M2 · nr. 15 („Dosare cu mesaje și agenda de utilizatori. Netichetă”), 12.10.2026.
   Folosește DOAR API-ul public al celor două: SimPostaGmailScrie.creeaza (opțiunile `contacte`, `catreClic`, `meniuExtra`,
   metodele inst, evenimentele), SimPostaGmail.TESTE / SimPostaGmailScrie.TESTE / PASI / adrese / areSalut, și câteva
   clase din desenul lor: .pg, .pg-ecran, .pg-meniu, .pg-main, .pg-titlu-lista, .pg-rand[data-m] (.sb, .dt), .pg-msg (h3,
   [data-a="inapoi"]), .pg-url, [data-a="enter"], .pg-fila, [data-lista], [data-s="sug"]. Dacă lecțiile 13-14 schimbă
   clasele, se reface proba: python lectii/vi/m2-l15/_proba/proba_lectie.py (ultima linie = probleme).

   CE ADAUGĂ (textele: ajutorul Gmail și ajutorul Agendei Google, în română și în engleză — lectii/vi/m2-l15/surse.md;
   ce nu s-a putut confirma e trecut acolo ca NESIGUR și în capturi_lipsa.json):
     - ETICHETELE (Labels): în meniul principal, rândul „Etichete” cu + (Creează o etichetă nouă / Create new label) →
       fereastra „Etichetă nouă”: „Introdu un nume de etichetă:”, caseta „Introdu eticheta sub” (nu o folosim), Anulează /
       Creează; etichetele apar în stânga, în ordine alfabetică, cu numărul mesajelor necitite; clic pe una → doar
       mesajele cu eticheta aceea (adresa: #label/<nume>); mesajele din Coș de gunoi și Spam nu apar la etichete;
     - în liste: o casetă de bifat în stânga fiecărui mesaj; după ce bifezi, sus apare iconița 🏷 Etichete → meniul
       „Etichetează ca:” cu etichetele tale de bifat; după o schimbare apare „Aplică” (Apply); pe mesajul deschis, aceeași
       iconiță 🏷 lângă ←. Un mesaj poate avea mai multe etichete și rămâne și în Mesaje primite / Trimise (eticheta NU
       mută mesajul); eticheta se vede lângă subiect, în listă și în mesaj;
     - AGENDA GOOGLE (Google Contacts): în bara de adrese, contacts.google.com + Enter (contul e deja deschis) → pagina
       Agendă: „Creează o persoană de contact” (Create contact) → „Creează o persoană de contact” → Prenume, Nume, E-mail
       → Salvează (Save); lista „Persoane de contact” cu numele și adresele; Profil → Deconectează-te; înapoi la mesaje
       cu gmail.com + Enter. Agenda ține EXACT ce ai scris: o adresă greșită salvată în agendă duce la mesajul întors;
     - ALEGEREA din agendă când scrii: sugestiile de sub Către (opțiunea `contacte` a lecției 14; tabloul crește cu fiecare
       persoană salvată) și clic pe cuvântul „Către” → fereastra „Selectează persoanele de contact” → bifezi → Inserează;
     - NETICHETA (teste de conținut noi): formal (salutul pentru profesor), faraMajuscule (fără cuvinte strigate),
       faraSemneMulte (fără „!!!” / „???”), neredirectionat (n-ai dat mai departe un mesaj, de exemplu un lanț).
   ABATERI de la Gmail (spuse pe ecran sau alese cu motiv): Agenda se deschide doar după ce ai intrat în cont (altfel
   pagina spune să intri întâi în Gmail); fereastra și meniul sunt desene, fără căutare și fără „Gestionează etichetele”;
   sugestiile vin doar din agendă (Gmail sugerează și „Alte persoane de contact”, adresele cărora le-ai scris).

   SIGURANȚA (aceeași regulă ca posta-gmail.js / posta-gmail-scrie.js): nimic din ce tastează elevul nu se scrie în
   localStorage / sessionStorage / cookie și nu pleacă în rețea; câmpurile sunt <input type="text"> FĂRĂ <form>, fără
   `name`, cu autocomplete / autocorrect / autocapitalize / spellcheck oprite (și la adresa din Agendă: fără type="email").

   FUNCȚIA DE CREARE:
     const inst = SimPostaGmailDosare.creeaza(elementul, optiuni)
     optiuni = TOATE opțiunile lui SimPostaGmailScrie.creeaza (cont, mesaje, start, existente, negasite, …) +
       etichete     ['Nume', …]                 etichete care există deja în cont
       mesaje[].etichete ['Nume', …]            etichetele unui mesaj din date (eticheta se creează dacă lipsește)
       agenda       [{nume:'Prenume Nume', adresa}]  persoanele din Agenda Google la pornire (și sugestiile de sub Către)
       (`contacte`, `catreClic`, `meniuExtra` le pune extensia: nu le da tu)
     inst = metodele lui SimPostaGmailScrie.creeaza (stare, stareScrie, conecteaza, scrie, completeaza, adaugaDestinatar,
            trimite, raspunde, redirectioneaza, deconecteaza, …) +
       mergiLa(text)                     ca Enter în bara de adrese (contacts.google.com → Agenda; altfel ca înainte)
       etichete() → ['Nume', …]          eticheteMesaj(id) → ['Nume', …]
       deschideDialogEticheta() · completeazaEticheta(nume) · confirmaEticheta() · anuleazaEticheta()
       creeazaEticheta(nume) → true dacă a creat-o (+, numele, Creează)
       bifeaza(id, da?)                  caseta din stânga mesajului (în lista afișată)
       deschideMeniuEtichete(ids?)       iconița 🏷 (fără ids: mesajele bifate, altfel mesajul deschis)
       comuta(nume) · aplica()           în meniul „Etichetează ca:”
       aplicaEticheta(ids, nume, pune=true)   tot drumul (bifezi, 🏷, eticheta, Aplică)
       deschideEticheta(nume)            clic pe etichetă, în stânga
       deschideAgenda() · inchideAgenda()     contacts.google.com / gmail.com în bara de adrese
       creeazaContact() · completeazaContact('prenume'|'nume'|'email', text) · salveazaContact()
       adaugaContact({prenume, nume, adresa})  tot drumul în Agendă (o deschide, dacă trebuie)
       agenda() → [{prenume, nume, afisat, adresa}]
       deschideAlegerea() · bifeazaContact(adresa) · insereaza() · anuleazaAlegerea()   (clic pe „Către”)
       alegeDinAgenda([adrese])          tot drumul (Către → bifezi → Inserează)
       alegeSugestia(text, adresa)       scrii primele litere în Către și apeși pe sugestia cu adresa dată
       stareDosare() → {etichete[], et:{id:[nume]}, agenda[], ecran:'agenda'|null, formular, dinAgenda[], eticheteVazute[],
                        agendaVazuta, bife[], meniuEt, dlgEt, alege}
       on(nume, fn) · jurnal() · reset() · distruge()
     EVENIMENTE noi (pe lângă cele ale lecțiilor 13-14): 'eticheta-noua' {nume} · 'eticheta-eroare' {motiv} · 'bifa' {id, da}
       · 'meniu-etichete' {deschis, ids} · 'etichetat' {ids, puse[], scoase[]} · 'eticheta-deschisa' {nume}
       · 'agenda' {deschis, ok} · 'contact-nou' {prenume, nume, adresa} · 'alegere' {deschis} · 'din-agenda' {adresa, cum:
       'sugestie'|'catre'} · 'schimbare'.

   TIPUL PENTRU MOTOR (tipuri:{dosare:SimPostaGmailDosare.tip}): o sarcină în căsuță, cu teste numite care se bifează singure.
     Q {sim:{…opțiunile de mai sus…}, mesaj?:{tip, la}, teste:[{c, v?, d?, pe?}], fisa?:[{id, et, ok:[…], adresa?}],
        drum:[[pas, arg…], …], gresit?:{drum:[…]} | {sari: indicele unui pas}}
     teste noi: eticheta {v:'Nume'} · etichetat {v:{ids:[…], et:'Nume'}} · neetichetat {v:{ids, et}} · vazutEticheta {v:'Nume'}
       · agendaVazuta · contact {v:{adresa, nume?}} · dinAgenda {v:'adresa'} · neredirectionat {v:id}
       · de CONȚINUT (fereastra deschisă, altfel ultimul mesaj trimis de tipul cerut): formal {v?:{cuvinte}} · faraMajuscule
       · faraSemneMulte; `trimis` = un mesaj TRIMIS care trece toate testele de conținut cu același `pe` (și pe cele noi);
       + TOATE testele lui SimPostaGmail.TESTE și SimPostaGmailScrie.TESTE (aceleași nume, aceeași formă).
     pașii din `drum`: toți ai lui SimPostaGmailScrie.PASI + eticheta-noua, eticheteaza, scoate-eticheta, eticheta, agenda,
       contact, gmail, din-agenda, sugestie, bifa, bifa-contact.

   PENTRU LECȚIA URMĂTOARE (16, evaluarea sumativă; sau altă lecție): folosiți creeaza() / tip cu opțiunile de mai sus;
   NU schimbați aici: numele din interfață (vin din surse), regula „nimic nu se salvează, nimic nu pleacă”, numele
   testelor și forma lui Q (lecția 15 le folosește). O extensie nouă stă în alt fișier din lectii/_sim/.

   SCHIMBAT LA REPARAȚIA DIN 12.10.2026 (judecata 1 a lecției 15; registrul lectii/vi/m2-l15/_verificare/registru_j1.md).
   Totul e COMPATIBIL ÎNAPOI (aceleași nume de teste, de pași, de metode și de evenimente; doar adăugiri):
     - test NOU de conținut `multumire` {v?:{cuvinte:[…]}} (implicit „mulțumesc / mulțumim / mulțumiri”, fără diacritice,
       oriunde în corp); `trimis` îl socotește ca pe celelalte teste de conținut;
     - `faraMajuscule` nu mai socotește strigăt numele scrise cu majuscule („Tudor MANOLE”): sar cuvintele din numele
       contului și din numele persoanelor din exercițiu (agenda, De la / Către ale mesajelor) care au prenume și nume;
       areMajuscule(text, ignora?) primește, opțional, lista cuvintelor de sărit;
     - un test poate avea `m` (text): mesajul de sub ✗, în locul celui obișnuit (de exemplu „Încă nu spui de ce lipsești…”);
     - eticheta nouă: „există deja” doar la ACELEAȘI litere (literele mari nu contează, diacriticele CONTEAZĂ: „Informatica”
       și „Informatică” sunt două etichete — NESIGUR în Gmail, ales prudent: căsuța nu respinge un nume pe care Gmail îl
       primește probabil); căutarea după nume (metodele inst, pașii `drum`) găsește tot și fără diacritice, dacă e una singură;
     - Agenda: o persoană salvată cu o adresă fără @ primește o NOTĂ A CĂSUȚEI (nu a Agendei Google, care nu e probată):
       „adresa … n-are @: verific-o, literă cu literă”; persoana se salvează oricum (nu respingem ce Agenda poate primi). */
(function(){
'use strict';
const B=window.SimPostaGmail,S=window.SimPostaGmailScrie;
if(!B||!S)throw new Error('posta-gmail-dosare.js: încarcă întâi lectii/_sim/posta-gmail.js și lectii/_sim/posta-gmail-scrie.js');
const CSS=`
.pgd-et-cap{display:flex;justify-content:space-between;align-items:center;gap:6px;margin:8px 0 2px;padding:0 2px 0 12px;font-size:.86rem;font-weight:700;color:var(--ink2)}
.pgd-et-cap button{min-width:38px;min-height:38px;border:0;border-radius:19px;background:transparent;cursor:pointer;font-size:1.3rem;line-height:1;color:var(--ink)!important}
.pgd-et-cap button:hover{background:var(--sel)}
.pgd-rw{display:flex;align-items:stretch;border-bottom:1px solid var(--line)}
.pgd-rw .pg-rand{flex:1;min-width:0;border-bottom:0}
.pgd-rw.ales,.pgd-rw.ales .pg-rand{background:var(--sel)}
.pgd-bifa{flex:none;min-width:40px;min-height:40px;border:0;background:transparent;cursor:pointer;font-size:1.2rem;color:var(--ink)!important}
.pgd-bara{display:flex;align-items:center;gap:6px;min-height:42px;padding:0 4px;margin-bottom:2px;border-bottom:1px solid var(--line)}
.pgd-bara .t{font-size:.84rem;color:var(--ink2)}
.pgd-ic{min-width:40px;min-height:40px;border:1px solid var(--line);border-radius:20px;background:var(--paper);cursor:pointer;font-size:1.05rem}
.pgd-ic[aria-expanded="true"]{background:var(--sel);border-color:var(--accent)}
.pgd-msg-ic{margin-left:6px}
.pgd-chip{display:inline-block;font-size:.74rem;font-weight:700;padding:1px 7px;margin-right:6px;border-radius:5px;background:var(--sel);color:var(--ink);vertical-align:1px;white-space:nowrap}
.pg-msg h3 .pgd-chip{font-size:.75rem;margin:0}
.pgd-mnet{margin:6px 0 8px;width:min(300px,100%);border:1px solid var(--line);border-radius:8px;background:var(--paper);box-shadow:0 4px 16px rgba(0,0,0,.18);padding:6px 0}
.pgd-mnet .cap{padding:4px 12px;font-size:.84rem;color:var(--ink2);font-weight:700}
.pgd-mnet .r{display:flex;align-items:center;gap:8px;width:100%;min-height:40px;padding:4px 12px;border:0;background:transparent;text-align:left;cursor:pointer;font:inherit;color:var(--ink)!important}
.pgd-mnet .r:hover{background:var(--sel)}
.pgd-mnet .r .b{font-size:1.15rem;width:1.3em;text-align:center}
.pgd-mnet .jos{border-top:1px solid var(--line);margin-top:4px;padding:6px 12px 2px;display:flex;justify-content:flex-end}
.pgd-mnet .gol,.pgd-mnet .nota{padding:4px 12px;font-size:.8rem;color:var(--ink2)}
.pgd-info{margin:0 0 8px;padding:8px 10px;border-left:4px solid var(--accent);background:var(--paper2);border-radius:0 6px 6px 0;font-size:.88rem}
.pgd-lgol{padding:18px 8px;color:var(--ink2);font-size:.9rem}
.pgd-dlg{position:fixed;left:50%;top:max(70px,16vh);transform:translateX(-50%);z-index:1002;width:min(400px,calc(100vw - 20px));box-sizing:border-box;border-radius:10px;background:var(--paper);border:1px solid var(--line);box-shadow:0 10px 30px rgba(0,0,0,.35);padding:0 0 12px;font-size:.92rem}
.pgd-dlg .cap{display:flex;justify-content:space-between;align-items:center;padding:4px 4px 4px 16px;border-bottom:1px solid var(--line);background:var(--paper2);border-radius:10px 10px 0 0}
.pgd-dlg .in{padding:10px 16px 0}
.pgd-dlg .pg-f input{min-height:42px}
.pgd-dlg .sub{display:flex;align-items:center;gap:8px;min-height:38px;border:0;background:transparent;padding:0;cursor:pointer;font:inherit;color:var(--ink)!important}
.pgd-dlg .err{min-height:1.1em;margin:4px 0;color:var(--bad);font-size:.86rem}
.pgd-dlg .nota{margin:6px 0 0;font-size:.78rem;color:var(--ink2)}
.pgd-dlg .bt{display:flex;justify-content:flex-end;gap:8px;padding:6px 16px 0}
.pgd-dlg .bt button{min-height:38px;min-width:80px;padding:4px 14px;border:1px solid var(--line);border-radius:18px;background:var(--paper);cursor:pointer;font-weight:700;color:var(--ink)!important}
.pgd-dlg .bt button.prim{background:var(--accent);color:var(--accentInk)!important;border-color:var(--accent)}
.pgd-dlg .bt button[disabled]{opacity:.5;cursor:default}
.pgd-dlg .lst{display:flex;flex-direction:column;max-height:46vh;overflow:auto;padding:4px 8px}
.pgd-dlg .lst .r{display:grid;grid-template-columns:1.5em 1fr;gap:8px;align-items:center;min-height:44px;border:0;border-bottom:1px solid var(--line);background:transparent;text-align:left;cursor:pointer;font:inherit;color:var(--ink)!important;padding:4px 6px}
.pgd-dlg .lst .r .a{display:block;color:var(--ink2);font-size:.84rem;word-break:break-all}
.pgd-dlg .lst .r[aria-checked="true"]{background:var(--sel)}
.pgd-dlg .lst .gol{padding:10px 6px;color:var(--ink2)}
.pgd-ag{border:1px solid var(--line);border-radius:10px;overflow:hidden}
.pgd-ag-corp{display:grid;grid-template-columns:220px 1fr;min-height:280px}
.pgd-ag-nav{display:flex;flex-direction:column;gap:4px;padding:8px 6px;border-right:1px solid var(--line);background:var(--paper2)}
.pgd-ag-nou{min-height:44px;border:1px solid var(--line);border-radius:16px;background:var(--paper);font-weight:700;cursor:pointer;text-align:left;padding:4px 12px;color:var(--ink)!important}
.pgd-ag-mn{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:8px;background:var(--paper);box-shadow:0 4px 14px rgba(0,0,0,.16)}
.pgd-ag-mn button{min-height:40px;border:0;background:transparent;text-align:left;padding:4px 12px;cursor:pointer;font:inherit;color:var(--ink)!important}
.pgd-ag-mn button:hover{background:var(--sel)}
.pgd-ag-nav .lk{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:38px;border:0;border-radius:0 18px 18px 0;background:transparent;text-align:left;padding:4px 12px;cursor:pointer;font:inherit;color:var(--ink)!important}
.pgd-ag-nav .lk.on{background:var(--sel);font-weight:700}
.pgd-ag-main{min-width:0;padding:8px 10px}
.pgd-ag-main h4{margin:2px 0 8px;font-size:1rem}
.pgd-ag-rand{display:grid;grid-template-columns:36px 1fr;gap:8px;align-items:center;width:100%;min-height:46px;border:0;border-bottom:1px solid var(--line);background:var(--paper);text-align:left;cursor:pointer;padding:4px 6px;font:inherit;color:var(--ink)!important}
.pgd-ag-rand:hover{background:var(--paper2)}
.pgd-ag-rand .a{display:block;color:var(--ink2);font-size:.86rem;word-break:break-all}
.pgd-av{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--sel);font-weight:800}
.pgd-form{max-width:460px}
.pgd-form .cap{display:flex;align-items:center;gap:6px;margin-bottom:4px}
.pgd-form .err{min-height:1.1em;margin:4px 0;color:var(--bad);font-size:.86rem}
.pgd-form .pg-prim[disabled]{opacity:.5;cursor:default}
.pgd-fisa{border:1px solid var(--line);border-radius:10px;padding:12px;max-width:460px}
.pgd-fisa .mare{display:flex;align-items:center;gap:10px;font-size:1.15rem;font-weight:700;margin-bottom:8px}
.pgd-fisa .mare .pgd-av{width:44px;height:44px}
.pgd-fisa .rr{word-break:break-all}
.pgd-nota{margin:8px 0 0;font-size:.8rem;color:var(--ink2)}
@media (max-width:560px){
 .pgd-et-cap{flex-basis:100%}
 .pgd-ag-corp{grid-template-columns:1fr}
 .pgd-ag-nav{flex-direction:row;flex-wrap:wrap;border-right:0;border-bottom:1px solid var(--line)}
 .pgd-ag-mn{flex-basis:100%}
 .pgd-ag-nav .lk{border-radius:18px}
}
`;
function stil(){if(document.getElementById('pgd-stil'))return;const s=document.createElement('style');s.id='pgd-stil';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fd=B.faraDiacritice;
const norm=s=>fd(String(s||'')).toLowerCase().replace(/\s+/g,' ').trim();
/* numele unei etichete, pentru „există deja”: fără spațiile de la capete, literele mari = mici, diacriticele rămân */
const cheieEt=s=>String(s||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('ro');
const ATR='autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore data-form-type="other"';
/* id-ul unei etichete = numele codat, ca în adresa Gmail (#label/Informatic%C4%83) */
const idEt=nume=>encodeURIComponent(String(nume||'').trim());
const numeDinId=id=>{try{return decodeURIComponent(id)}catch(e){return id}};
const AGENDA_URL=/^(https?:\/\/)?(www\.)?contacts\.google\.com(\/.*)?$/i;
/* numele listelor din meniul principal (RO + EN): o etichetă nu poate avea același nume */
const REZERVATE=['mesaje primite','trimise','mesaje nefinalizate','spam','cos de gunoi','inbox','sent','drafts','trash'];
const ini=t=>(fd(String(t||'?')).trim().charAt(0)||'?').toUpperCase();

/* ---------------- neticheta: funcții pe text (rulează doar aici) ---------------- */
/* cuvânt „strigat”: numai majuscule și cel puțin 4 litere (fără cifre romane ca VIII), sau 3 cuvinte la rând numai cu
   majuscule (de exemplu „DE CE NU”); „TIC”, „OK”, „VI-a A” trec */
/* `ignora` (opțional): cuvinte care nu se socotesc (numele oamenilor: „Tudor MANOLE” nu e un strigăt) */
function areMajuscule(text,ignora){
  const sari={};[].concat(ignora||[]).forEach(x=>{sari[norm(x)]=1});
  const w=(String(text||'').match(/[A-Za-zĂÂÎȘȚŞŢăâîșțşţ]+/g)||[]).filter(x=>!sari[norm(x)]),mari=x=>x.length>=2&&x===x.toUpperCase()&&x!==x.toLowerCase(),rez=[];
  w.forEach(x=>{if(mari(x)&&x.length>=4&&!/^[IVXLC]+$/.test(x))rez.push(x)});
  for(let i=0;i+2<w.length;i++)if(mari(w[i])&&mari(w[i+1])&&mari(w[i+2])){[w[i],w[i+1],w[i+2]].forEach(x=>{if(rez.indexOf(x)<0)rez.push(x)})}
  return rez}
const areSemneMulte=text=>/[!?]{2,}/.test(String(text||''));
const FORMALE=['buna ziua','buna dimineata','buna seara','stimate','stimata'];
function randuri(t){return String(t||'').split('\n').map(x=>x.trim()).filter(Boolean)}
function salutPoliticos(corp,cuvinte){const r=randuri(corp);if(!r.length)return false;const p=norm(r[0]).replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
  if(!FORMALE.some(s=>p===s||p.startsWith(s+' ')))return false;
  return !cuvinte||!cuvinte.length||cuvinte.some(c=>(' '+p+' ').includes(' '+norm(c)+' '))}

/* ---------------- creeaza(): căsuța cu etichete și agendă ---------------- */
function creeaza(root,O0){
  stil();const O=Object.assign({},O0||{});
  const cont=O.cont||Object.values(B.CONTURI)[0];
  const MES0=O.mesaje||B.MESAJE_IOANA;
  const MENIU=[],AGENDA=[];          // tablouri COMUNE cu posta-gmail.js (meniuExtra) și posta-gmail-scrie.js (contacte)
  const asc={},J=[];let X,b;
  const emite=(n,d)=>{J.push({nume:n,date:d||{},t:Date.now()});(asc[n]||[]).concat(asc['*']||[]).forEach(f=>{try{f(n,d||{})}catch(e){}});
    if(O.laEveniment&&n!=='schimbare')try{O.laEveniment(n,d||{})}catch(e){}};
  const contactDin=c=>{const p=String(c.nume||'').trim().split(/\s+/).filter(Boolean);
    const pre=c.prenume!=null?String(c.prenume):(p[0]||''),nu=c.prenume!=null?String(c.numeFamilie||''):p.slice(1).join(' ');
    return {prenume:pre,nume:nu,afisat:(pre+' '+nu).trim(),adresa:String(c.adresa||'').trim()}};
  /* aceleași litere (literele mari nu contează, diacriticele da) = aceeași etichetă; căutarea primește și numele fără
     diacritice, dacă îi corespunde o singură etichetă */
  const laFel=nume=>X.etichete.find(e=>cheieEt(e)===cheieEt(nume));
  const gasesteEt=nume=>{const e=laFel(nume);if(e)return e;const l=X.etichete.filter(x=>norm(x)===norm(nume));return l.length===1?l[0]:undefined};
  function adaugaEt(nume){const n=String(nume||'').trim();if(!n)return null;if(laFel(n))return laFel(n);X.etichete.push(n);return n}
  function puneEt(id,nume,da){const e=gasesteEt(nume);if(!e)return;const l=X.et[id]||(X.et[id]=[]);const k=l.indexOf(e);
    if(da!==false&&k<0)l.push(e);if(da===false&&k>=0)l.splice(k,1)}
  function nou(){
    X={etichete:[],et:{},agenda:[],ecran:null,formular:null,contactDeschis:null,creeazaMeniu:false,profilAg:false,bife:[],meniuEt:null,dlgEt:null,
      alege:null,dinAgenda:[],eticheteVazute:[],agendaVazuta:false,dinEticheta:null,_dinEt:null,info:'',infoAg:''};
    (O.etichete||[]).forEach(adaugaEt);
    MES0.forEach(m=>(m.etichete||[]).forEach(n=>{adaugaEt(n);puneEt(m.id,n)}));
    (O.agenda||[]).forEach(c=>X.agenda.push(contactDin(c)));
    sincron()}
  /* tablourile comune: meniul (etichetele, în ordine alfabetică) și sugestiile din agendă */
  function sincron(){
    const l=X.etichete.slice().sort((a,c)=>a.localeCompare(c,'ro'));
    MENIU.length=0;l.forEach(n=>MENIU.push({id:idEt(n),nume:n}));
    AGENDA.length=0;X.agenda.forEach(c=>{if(c.adresa)AGENDA.push({nume:c.afisat||c.adresa,adresa:c.adresa})})}
  nou();

  const optScrie=Object.assign({},O,{meniuExtra:MENIU,contacte:AGENDA,catreClic:()=>deschideAlegerea()});
  delete optScrie.laEveniment;
  b=S.creeaza(root,optScrie);
  const mesaje=()=>b.mesaje().filter(m=>String(m.lista||'').charAt(0)!=='_');
  const esteEt=id=>MENIU.some(x=>x.id===id);
  function redesen(focus){b.redeseneaza();if(focus)setTimeout(()=>{const f=root.querySelector(focus)||document.querySelector(focus);if(f&&document.contains(f))try{f.focus({preventScroll:true})}catch(_){}},0)}
  const elDlg=document.createElement('div');elDlg.className='pgd-dlg';elDlg.setAttribute('role','dialog');
  const elAl=document.createElement('div');elAl.className='pgd-dlg pgd-alege';elAl.setAttribute('role','dialog');

  /* ---------- ETICHETELE ---------- */
  function deschideDialogEticheta(){const s=b.stare();if(!s.conectat||X.ecran)return false;X.dlgEt={nume:'',err:'',sub:false};X.meniuEt=null;cur();
    setTimeout(()=>{const i=elDlg.querySelector('[data-dd="et-nume"]');if(i&&document.contains(i))try{i.focus({preventScroll:true})}catch(_){}},0);return true}
  function completeazaEticheta(n){if(!X.dlgEt)return false;X.dlgEt.nume=String(n==null?'':n);X.dlgEt.err='';const i=elDlg.querySelector('[data-dd="et-nume"]');if(i)i.value=X.dlgEt.nume;stareButoane();return true}
  function confirmaEticheta(){const d=X.dlgEt;if(!d)return false;const n=String(d.nume||'').trim();
    /* după eroare, focusul înapoi în nume (fereastra se redesenează; altfel Esc și tastarea nu mai ajung la ea) */
    const inNume=()=>{const i=elDlg.querySelector('[data-dd="et-nume"]');if(i&&document.contains(i))try{i.focus({preventScroll:true});i.select()}catch(_){}};
    if(!n){d.err='Scrie întâi numele etichetei.';cur();inNume();return false}
    if(REZERVATE.indexOf(norm(n))>=0||laFel(n)){d.err='Există deja o etichetă cu acest nume. Alege alt nume.';emite('eticheta-eroare',{motiv:'exista',nume:n});cur();inNume();return false}
    adaugaEt(n);X.dlgEt=null;sincron();X.info=`Eticheta „${esc(n)}” e gata: o vezi în stânga, sub Etichete. Încă nu are niciun mesaj.`;
    emite('eticheta-noua',{nume:n});redesen(`[data-lista="${idEt(n)}"]`);return true}
  function anuleazaEticheta(){if(!X.dlgEt)return false;X.dlgEt=null;cur();redesen('[data-d="et-plus"]');return true}
  function creeazaEticheta(n){if(!deschideDialogEticheta())return false;completeazaEticheta(n);return confirmaEticheta()}
  function bifeaza(id,da){const s=b.stare();if(!s.conectat||s.deschis)return false;const k=X.bife.indexOf(id);const v=da==null?k<0:!!da;
    if(v&&k<0)X.bife.push(id);if(!v&&k>=0)X.bife.splice(k,1);X.meniuEt=null;emite('bifa',{id,da:v});redesen(`[data-d="bifa"][data-id="${id}"]`);return true}
  function deschideMeniuEtichete(ids){const s=b.stare();ids=ids||(s.deschis?[s.deschis]:X.bife.slice());if(!s.conectat||!ids.length)return false;
    const st={};X.etichete.forEach(e=>{const n=ids.filter(id=>(X.et[id]||[]).indexOf(e)>=0).length;st[e]=n===ids.length?'da':n?'partial':'nu'});
    X.meniuEt={ids:ids.slice(),stari:st,initial:Object.assign({},st)};emite('meniu-etichete',{deschis:true,ids});redesen('.pgd-mnet .r, .pgd-mnet');return true}
  function inchideMeniu(){if(!X.meniuEt)return false;X.meniuEt=null;emite('meniu-etichete',{deschis:false});redesen('[data-d="etichete"]');return true}
  function comuta(nume){const m=X.meniuEt,e=gasesteEt(nume);if(!m||!e)return false;m.stari[e]=m.stari[e]==='da'?'nu':'da';redesen(`.pgd-mnet [data-et="${idEt(e)}"]`);return true}
  const schimbat=m=>!!m&&Object.keys(m.stari).some(k=>m.stari[k]!==m.initial[k]);
  function aplica(){const m=X.meniuEt;if(!m||!schimbat(m))return false;const puse=[],scoase=[];
    Object.keys(m.stari).forEach(e=>{if(m.stari[e]===m.initial[e]||m.stari[e]==='partial')return;
      m.ids.forEach(id=>puneEt(id,e,m.stari[e]==='da'));(m.stari[e]==='da'?puse:scoase).push(e)});
    const n=m.ids.length;X.meniuEt=null;X.bife=[];
    X.info=(puse.length?`${n===1?'Mesajul are':'Mesajele au'} acum eticheta ${puse.map(x=>'„'+esc(x)+'”').join(', ')}: o vezi lângă subiect. ${n===1?'A rămas':'Au rămas'} și în lista în care ${n===1?'era':'erau'}.`:'')
      +(scoase.length?` Eticheta ${scoase.map(x=>'„'+esc(x)+'”').join(', ')} s-a scos.`:'');
    emite('etichetat',{ids:m.ids,puse,scoase});redesen(b.stare().deschis?'[data-d="etichete-msg"]':'[data-lista].on');return true}
  function aplicaEticheta(ids,nume,pune){ids=[].concat(ids);const e=gasesteEt(nume);if(!e)return false;
    const s=b.stare();if(!s.conectat)return false;if(X.ecran)inchideAgenda();
    if(!deschideMeniuEtichete(ids))return false;const st=X.meniuEt.stari[e];const vrea=pune===false?'nu':'da';
    if(st!==vrea){comuta(e);if(X.meniuEt.stari[e]!==vrea)comuta(e)}return aplica()}
  function deschideEticheta(nume){const e=gasesteEt(nume);if(!e)return false;if(X.ecran)inchideAgenda();return b.deschideLista(idEt(e))}

  /* ---------- AGENDA ---------- */
  function mergiAgenda(){const s=b.stare();
    if(!s.conectat){X.ecran=null;X.infoAg='Agenda Google se deschide după ce intri în cont. Scrie întâi gmail.com, intră în cont, apoi scrie din nou contacts.google.com.';emite('agenda',{deschis:false,ok:false});redesen('.pg-url');return false}
    const c=b.stareScrie().compune;if(c)b.inchide();
    X.ecran='agenda';X.agendaVazuta=true;X.formular=null;X.contactDeschis=null;X.creeazaMeniu=false;X.profilAg=false;X.meniuEt=null;X.bife=[];X.dlgEt=null;X.alege=null;
    emite('agenda',{deschis:true,ok:true});redesen('[data-d="ag-creeaza"]');return true}
  function mergiLa(text){const t=String(text||'').trim();if(AGENDA_URL.test(t))return mergiAgenda();X.ecran=null;X.infoAg='';return b.mergiLa(text)}
  const deschideAgenda=()=>mergiAgenda();
  const inchideAgenda=()=>mergiLa('gmail.com');
  function creeazaContact(){if(X.ecran!=='agenda')return false;X.creeazaMeniu=false;X.formular={prenume:'',nume:'',email:'',err:''};X.contactDeschis=null;redesen('[data-dd="ag-prenume"]');return true}
  function completeazaContact(camp,text){const f=X.formular;if(!f||['prenume','nume','email'].indexOf(camp)<0)return false;f[camp]=String(text==null?'':text);f.err='';
    const i=root.querySelector(`[data-dd="ag-${camp}"]`);if(i)i.value=f[camp];stareButoane();return true}
  function salveazaContact(){const f=X.formular;if(!f)return false;
    if(!String(f.prenume).trim()&&!String(f.nume).trim()&&!String(f.email).trim()){f.err='Scrie întâi numele și adresa.';redesen('[data-dd="ag-prenume"]');return false}
    const c={prenume:String(f.prenume).trim(),nume:String(f.nume).trim(),adresa:String(f.email).trim()};c.afisat=(c.prenume+' '+c.nume).trim();
    X.agenda.push(c);X.formular=null;X.contactDeschis=X.agenda.length-1;sincron();
    /* nota CĂSUȚEI (nu a Agendei Google, neprobată fără cont): o adresă de e-mail are mereu @ */
    X.infoAg=c.adresa&&c.adresa.indexOf('@')<0?`Nota căsuței de exersare (nu a Agendei Google): adresa „${esc(c.adresa)}” n-are @. O adresă de e-mail are mereu @: verific-o, literă cu literă, cu cea din mesaj.`:'';
    emite('contact-nou',{prenume:c.prenume,nume:c.nume,adresa:c.adresa});redesen('[data-d="ag-lista"]');return true}
  function adaugaContact(p){if(X.ecran!=='agenda'&&!deschideAgenda())return false;if(!creeazaContact())return false;
    completeazaContact('prenume',p.prenume||'');completeazaContact('nume',p.nume||'');completeazaContact('email',p.adresa||'');return salveazaContact()}

  /* ---------- ALEGEREA din agendă (clic pe „Către”) ---------- */
  function deschideAlegerea(){const c=b.stareScrie().compune;if(!c||!(c.mod==='nou'||c.mod==='redir'))return false;X.alege={bife:[]};emite('alegere',{deschis:true});cur();
    setTimeout(()=>{const f=elAl.querySelector('.lst .r,[data-d="al-x"]');if(f&&document.contains(f))try{f.focus({preventScroll:true})}catch(_){}},0);return true}
  function bifeazaContact(a){if(!X.alege)return false;const k=X.alege.bife.findIndex(x=>x.toLowerCase()===String(a).toLowerCase());
    if(k>=0)X.alege.bife.splice(k,1);else if(X.agenda.some(c=>c.adresa.toLowerCase()===String(a).toLowerCase()))X.alege.bife.push(a);else return false;cur();return true}
  function insereaza(){const al=X.alege;if(!al)return false;X.alege=null;cur();
    al.bife.forEach(a=>{b.adaugaDestinatar(a,'catre');X.dinAgenda.push(a);emite('din-agenda',{adresa:a,cum:'catre'})});emite('alegere',{deschis:false});return al.bife.length>0}
  function anuleazaAlegerea(){if(!X.alege)return false;X.alege=null;cur();emite('alegere',{deschis:false});return true}
  function alegeDinAgenda(l){if(!deschideAlegerea())return false;[].concat(l).forEach(bifeazaContact);return insereaza()}
  /* sugestia de sub Către, ca un elev: scrii primele litere (evenimentul „input” al câmpului), apoi apeși pe sugestie */
  function alegeSugestia(text,adresa){if(!b.stareScrie().compune)return false;b.completeaza('catre',text);
    const inp=root.querySelector('.pgs-mn [data-c="catre"]');if(!inp)return false;inp.dispatchEvent(new Event('input',{bubbles:true}));
    const bt=Array.from(root.querySelectorAll('[data-s="sug"][data-camp="catre"]')).find(x=>x.dataset.adr.toLowerCase()===String(adresa).toLowerCase());
    if(!bt)return false;bt.click();return true}

  /* ---------- desenul (după fiecare redesenare a căsuței) ---------- */
  const chips=id=>(X.et[id]||[]).slice().sort((a,c)=>a.localeCompare(c,'ro')).map(e=>`<span class="pgd-chip">${esc(e)}</span>`).join('');
  const bifa=(id,sb)=>{const da=X.bife.indexOf(id)>=0;return `<button type="button" class="pgd-bifa" data-d="bifa" data-id="${esc(id)}" role="checkbox" aria-checked="${da}" aria-label="Bifează mesajul „${esc(sb)}”" title="Bifează">${da?'☑':'☐'}</button>`};
  function hMeniuEt(){const m=X.meniuEt;if(!m)return '';
    const r=X.etichete.slice().sort((a,c)=>a.localeCompare(c,'ro')).map(e=>{const st=m.stari[e];
      return `<button type="button" class="r" data-d="mnet" data-et="${idEt(e)}" role="menuitemcheckbox" aria-checked="${st==='da'?'true':st==='partial'?'mixed':'false'}"><span class="b" aria-hidden="true">${st==='da'?'☑':st==='partial'?'▣':'☐'}</span><span>${esc(e)}</span></button>`}).join('');
    return `<div class="pgd-mnet" role="menu" aria-label="Etichete"><div class="cap">Etichetează ca:</div>${r||'<div class="gol">Încă nu ai etichete. O faci în stânga, cu + de lângă Etichete.</div>'}
      ${schimbat(m)?'<div class="jos"><button type="button" class="pg-prim" data-d="aplica">Aplică</button></div>':''}
      <div class="nota">Desen: în Gmail, meniul are și o căutare și alte rânduri, pe care azi nu le folosim.</div></div>`}
  function hBara(){const n=X.bife.length;if(!n)return '';
    return `<div class="pgd-bara"><button type="button" class="pgd-ic" data-d="etichete" aria-label="Etichete" title="Etichete" aria-expanded="${!!X.meniuEt}">🏷</button><span class="t">${n===1?'1 mesaj bifat':n+' mesaje bifate'}</span></div>${hMeniuEt()}`}
  function hRandEt(m){const inc=String(m.corp||'').replace(/\n/g,' ').slice(0,60),trimis=m.lista==='trimise';
    const cine=trimis?`Către: ${esc((m.catre||[]).map(c=>c.adresa===cont.adresa?'eu':c.nume||c.adresa).join(', '))}`:esc(m.de&&m.de.adresa===cont.adresa?'eu':(m.de&&(m.de.nume||m.de.adresa))||'');
    return `<div class="pgd-rw${X.bife.indexOf(m.id)>=0?' ales':''}">${bifa(m.id,m.subiect)}<button type="button" class="pg-rand${m.citit?'':' nou'}" data-dm="${esc(m.id)}"><span class="de">${cine}</span><span class="sb">${chips(m.id)}<b>${esc(m.subiect)}</b> <span class="inc">– ${esc(inc)}</span></span><span class="dt">${(m.atasate||[]).length?'<span class="pgs-clip" aria-label="are fișier atașat" title="Are fișier atașat">📎</span>':''}${esc(m.data||'')}</span></button></div>`}
  function hAgenda(){const f=X.formular,cd=X.contactDeschis!=null?X.agenda[X.contactDeschis]:null;
    let main;
    if(f)main=`<div class="pgd-form"><div class="cap"><button type="button" class="pg-ic" data-d="ag-lista" aria-label="Înapoi la listă" title="Înapoi la listă">←</button><h4>Creează o persoană de contact</h4></div>
      <label class="pg-f"><span>Prenume</span><input type="text" data-dd="ag-prenume" value="${esc(f.prenume)}" ${ATR}></label>
      <label class="pg-f"><span>Nume</span><input type="text" data-dd="ag-nume" value="${esc(f.nume)}" ${ATR}></label>
      <label class="pg-f"><span>E-mail</span><input type="text" data-dd="ag-email" value="${esc(f.email)}" inputmode="email" ${ATR}></label>
      <p class="err" aria-live="polite">${esc(f.err||'')}</p>
      <div class="pg-btns"><button type="button" class="pg-prim" data-d="ag-salveaza"${(f.prenume+f.nume+f.email).trim()?'':' disabled'}>Salvează</button></div>
      <p class="pgd-nota">Desen al Agendei Google: pe pagina adevărată sunt și alte rânduri (telefon, companie…). Azi scrii doar numele și adresa, literă cu literă: agenda ține minte exact ce scrii.</p></div>`;
    else if(cd)main=`<div class="pgd-fisa"><div class="mare"><span class="pgd-av" aria-hidden="true">${esc(ini(cd.afisat||cd.adresa))}</span><span>${esc(cd.afisat||'(fără nume)')}</span></div>
      <div class="rr"><span class="pgd-nota">E-mail:</span> ${esc(cd.adresa||'(fără adresă)')}</div>
      <p class="pgd-nota">Salvat în agendă. Când scrii un mesaj, numele lui apare sub Către după primele litere.</p>
      <div class="pg-btns"><button type="button" class="pg-sec" data-d="ag-lista">← Înapoi la listă</button></div></div>`;
    else{const l=X.agenda.map((c,i)=>({c,i})).sort((p,q)=>(p.c.afisat||p.c.adresa).localeCompare(q.c.afisat||q.c.adresa,'ro'));
      main=`<h4>Persoane de contact (${X.agenda.length})</h4>${l.length?l.map(({c,i})=>`<button type="button" class="pgd-ag-rand" data-d="ag-vezi" data-i="${i}"><span class="pgd-av" aria-hidden="true">${esc(ini(c.afisat||c.adresa))}</span><span><b>${esc(c.afisat||'(fără nume)')}</b><span class="a">${esc(c.adresa||'(fără adresă)')}</span></span></button>`).join('')
        :'<div class="pgd-lgol">Încă nu ai persoane de contact. Apasă „Creează o persoană de contact”, sus în stânga.</div>'}`}
    return `<div class="pgd-ag"><div class="pg-sus"><button type="button" class="pg-ic" data-d="ag-meniu" aria-label="Meniul principal" title="Meniul principal">☰</button><span class="pg-logo">Agendă</span>
      <span class="pg-cauta" aria-hidden="true">Căutare (nu o folosim azi)</span><button type="button" class="pg-profil" data-d="ag-profil" aria-label="Profil" title="Profil" aria-expanded="${X.profilAg}">${esc(ini(cont.nume))}</button></div>
     <div class="pgd-ag-corp"><nav class="pgd-ag-nav" aria-label="Agenda"><button type="button" class="pgd-ag-nou" data-d="ag-creeaza" aria-expanded="${X.creeazaMeniu}">＋ Creează o persoană de contact</button>
       ${X.creeazaMeniu?'<div class="pgd-ag-mn" role="menu"><button type="button" role="menuitem" data-d="ag-una">Creează o persoană de contact</button><button type="button" role="menuitem" data-d="ag-multe">Creează mai multe persoane de contact</button></div>':''}
       <button type="button" class="lk${!f&&!cd?' on':''}" data-d="ag-lista"><span>Persoane de contact</span><span>${X.agenda.length}</span></button></nav>
      <div class="pgd-ag-main">${X.infoAg?`<p class="pgd-info" aria-live="polite">${X.infoAg}</p>`:''}${main}</div></div></div>
     ${X.profilAg?`<div class="pg-pm" role="dialog" aria-label="Profil"><div class="av">${esc(ini(cont.nume))}</div><b>${esc(cont.nume)}</b><div class="ad">${esc(cont.adresa)}</div>
       <button type="button" data-d="ag-iesi">Deconectează-te</button><button type="button" data-d="ag-profil-x" aria-label="Închide">Închide</button></div>`:''}`}
  function hDlgEt(){const d=X.dlgEt;
    return `<div class="cap"><b>Etichetă nouă</b><button type="button" class="pg-x" data-d="dlg-x" aria-label="Închide (Anulează)" title="Închide">✕</button></div>
     <div class="in"><label class="pg-f"><span>Introdu un nume de etichetă:</span><input type="text" data-dd="et-nume" value="${esc(d.nume)}" ${ATR}></label>
      <button type="button" class="sub" data-d="dlg-sub" role="checkbox" aria-checked="false"><span aria-hidden="true">☐</span> Introdu eticheta sub:</button>
      <p class="err" aria-live="polite">${esc(d.err||'')}</p>
      <p class="nota">Desen al ferestrei din Gmail. ${d.sub?'Eticheta într-o altă etichetă nu o folosim azi: lasă caseta nebifată.':''}</p></div>
     <div class="bt"><button type="button" data-d="dlg-anuleaza">Anulează</button><button type="button" class="prim" data-d="dlg-creeaza"${String(d.nume||'').trim()?'':' disabled'}>Creează</button></div>`}
  function hAlege(){const al=X.alege,l=X.agenda.filter(c=>c.adresa).slice().sort((p,q)=>(p.afisat||p.adresa).localeCompare(q.afisat||q.adresa,'ro'));
    return `<div class="cap"><b>Selectează persoanele de contact</b><button type="button" class="pg-x" data-d="al-x" aria-label="Închide (Anulare)" title="Închide">✕</button></div>
     <div class="lst">${l.length?l.map(c=>{const da=al.bife.some(x=>x.toLowerCase()===c.adresa.toLowerCase());
       return `<button type="button" class="r" data-d="al-bifa" data-adr="${esc(c.adresa)}" role="checkbox" aria-checked="${da}"><span aria-hidden="true">${da?'☑':'☐'}</span><span><b>${esc(c.afisat||c.adresa)}</b><span class="a">${esc(c.adresa)}</span></span></button>`}).join('')
       :'<div class="gol">Agenda ta e goală. Persoanele le adaugi în Agenda Google (contacts.google.com).</div>'}</div>
     <p class="nota" style="padding:4px 16px 0;margin:0;font-size:.78rem;color:var(--ink2)">Desen al ferestrei din Gmail: bifezi persoana, verifici numele și adresa, apoi Inserează.</p>
     <div class="bt"><button type="button" data-d="al-anuleaza">Anulare</button><button type="button" class="prim" data-d="al-insereaza"${al.bife.length?'':' disabled'}>Inserează</button></div>`}
  function stareButoane(){
    const c=elDlg.querySelector('[data-d="dlg-creeaza"]');if(c&&X.dlgEt)c.disabled=!String(X.dlgEt.nume||'').trim();
    const sv=root.querySelector('[data-d="ag-salveaza"]');if(sv&&X.formular)sv.disabled=!(X.formular.prenume+X.formular.nume+X.formular.email).trim()}

  function cur(){
    const pg=root.querySelector('.pg');if(!pg)return;const s=b.stare();
    if(X.ecran==='agenda'&&!s.conectat){X.ecran=null;X.profilAg=false}
    const ecr=pg.querySelector('.pg-ecran');
    if(X.ecran==='agenda'&&ecr){
      if(!ecr.querySelector('.pgd-ag'))ecr.innerHTML=hAgenda();
      const u=pg.querySelector('.pg-url');if(u&&document.activeElement!==u)u.value='contacts.google.com';
      const t=pg.querySelector('.pg-fila');if(t){t.textContent='Agendă Google';t.title='Agendă Google'}
      const panou=pg.querySelector('.pg-panou');if(panou)panou.remove()}
    else if(ecr){
      if(X.infoAg&&!ecr.querySelector('.pgd-info-ag')){ecr.insertAdjacentHTML('afterbegin',`<p class="pgd-info pgd-info-ag" aria-live="polite">${X.infoAg}</p>`)}
      if(s.conectat&&s.ecran==='casuta')gmail(pg,s)}
    if(X.dlgEt&&s.conectat&&!X.ecran){const v=elDlg.querySelector('[data-dd="et-nume"]'),foc=v&&document.activeElement===v;
      if(!elDlg.dataset.k||elDlg.dataset.k!==String(!!X.dlgEt.err)+X.dlgEt.err+X.dlgEt.sub){elDlg.innerHTML=hDlgEt();elDlg.dataset.k=String(!!X.dlgEt.err)+X.dlgEt.err+X.dlgEt.sub}
      elDlg.setAttribute('aria-label','Etichetă nouă');if(!pg.contains(elDlg))pg.appendChild(elDlg);
      if(foc){const i=elDlg.querySelector('[data-dd="et-nume"]');if(i&&document.activeElement!==i)try{i.focus({preventScroll:true})}catch(_){}}}
    else{X.dlgEt=X.ecran||!s.conectat?null:X.dlgEt;elDlg.remove();elDlg.dataset.k=''}
    const c=b.stareScrie().compune;
    if(X.alege&&c&&!X.ecran){elAl.innerHTML=hAlege();elAl.setAttribute('aria-label','Selectează persoanele de contact');if(!pg.contains(elAl))pg.appendChild(elAl)}
    else{X.alege=null;elAl.remove()}}
  function gmail(pg,s){
    const nav=pg.querySelector('nav.pg-meniu');
    if(nav&&!nav.querySelector('.pgd-et-cap')){const cap=document.createElement('div');cap.className='pgd-et-cap';
      cap.innerHTML='<span>Etichete</span><button type="button" data-d="et-plus" aria-label="Creează o etichetă nouă" title="Creează o etichetă nouă">+</button>';
      const prim=MENIU.length?nav.querySelector(`[data-lista="${MENIU[0].id}"]`):null;if(prim)nav.insertBefore(cap,prim);else nav.appendChild(cap)}
    /* numărul mesajelor necitite la fiecare etichetă (ca în Gmail) și eticheta aprinsă când mesajul a fost deschis din ea */
    const M=mesaje(),dupa={};M.forEach(m=>{dupa[m.id]=m});
    MENIU.forEach(x=>{const bt=nav&&nav.querySelector(`[data-lista="${x.id}"]`);if(!bt)return;
      const n=M.filter(m=>m.lista!=='cos'&&m.lista!=='spam'&&!m.citit&&(X.et[m.id]||[]).indexOf(x.nume)>=0).length;
      let sp=bt.querySelector('.n');if(n){if(!sp){sp=document.createElement('span');sp.className='n';bt.appendChild(sp)}sp.textContent=n}else if(sp)sp.remove()});
    if(s.deschis&&X.dinEticheta&&nav){nav.querySelectorAll('[data-lista].on').forEach(x=>x.classList.remove('on'));const bt=nav.querySelector(`[data-lista="${X.dinEticheta}"]`);if(bt)bt.classList.add('on')}
    const t=pg.querySelector('.pg-fila');const lst=s.deschis&&X.dinEticheta?X.dinEticheta:s.lista;
    if(t&&esteEt(lst)){const n=numeDinId(lst);t.textContent=`${n} – ${cont.adresa} – Gmail`;t.title=t.textContent}
    const main=pg.querySelector('.pg-main');if(!main)return;
    if(!s.deschis){
      if(esteEt(s.lista)&&!main.dataset.pgdEt){const n=numeDinId(s.lista);
        const l=M.filter(m=>m.lista!=='cos'&&m.lista!=='spam'&&(X.et[m.id]||[]).indexOf(n)>=0);
        main.innerHTML=`<div class="pg-titlu-lista">${esc(n)}</div>${l.length?l.map(hRandEt).join(''):'<div class="pg-lgol">Nu există mesaje aici.</div>'}`;main.dataset.pgdEt='1'}
      else if(s.lista!=='nefinalizate')main.querySelectorAll('.pg-rand[data-m]').forEach(r=>{if(r.parentNode.classList.contains('pgd-rw'))return;const m=dupa[r.dataset.m];if(!m)return;
        const w=document.createElement('div');w.className='pgd-rw'+(X.bife.indexOf(m.id)>=0?' ales':'');r.parentNode.insertBefore(w,r);w.insertAdjacentHTML('afterbegin',bifa(m.id,m.subiect));w.appendChild(r);
        const sb=r.querySelector('.sb');if(sb&&(X.et[m.id]||[]).length)sb.insertAdjacentHTML('afterbegin',chips(m.id))});
      if(!main.querySelector('.pgd-bara')&&X.bife.length){const tl=main.querySelector('.pg-titlu-lista');if(tl)tl.insertAdjacentHTML('afterend',hBara());else main.insertAdjacentHTML('afterbegin',hBara())}}
    else{const mm=main.querySelector('.pg-msg'),m=dupa[s.deschis];
      if(mm&&m&&m.lista!=='nefinalizate'){
        const h=mm.querySelector('h3');if(h&&!h.querySelector('.pgd-chip')&&(X.et[m.id]||[]).length)h.insertAdjacentHTML('beforeend',chips(m.id));
        const ina=mm.querySelector('[data-a="inapoi"]');
        if(ina&&!mm.querySelector('[data-d="etichete-msg"]')){ina.insertAdjacentHTML('afterend',`<button type="button" class="pgd-ic pgd-msg-ic" data-d="etichete-msg" aria-label="Etichete" title="Etichete" aria-expanded="${!!X.meniuEt}">🏷</button>`);
          const bt=mm.querySelector('[data-d="etichete-msg"]');if(X.meniuEt)bt.insertAdjacentHTML('afterend',hMeniuEt());
          if(X.dinEticheta){const de=X.dinEticheta;ina.addEventListener('click',()=>{if(esteEt(de))setTimeout(()=>b.deschideLista(de),0)})}}}}
    if(X.info&&!main.querySelector('.pgd-info')&&!main.querySelector('.pg-info'))main.insertAdjacentHTML('afterbegin',`<p class="pgd-info" aria-live="polite">${X.info}</p>`)}

  /* ---------- gesturile (delegate pe root: căsuța se redesenează mereu); distruge() le scoate, ca o căsuță nouă pe
     același element (motorul: „Ia-o de la capăt”) să nu primească și ascultătorii celei vechi ---------- */
  const LEG=[];const pe=(tip,fn,cap)=>{root.addEventListener(tip,fn,!!cap);LEG.push([tip,fn,!!cap])};
  const dezleaga=()=>{LEG.splice(0).forEach(([t,f,c])=>root.removeEventListener(t,f,c))};
  pe('click',ev=>{
    const sg=ev.target.closest&&ev.target.closest('[data-s="sug"]');
    if(sg&&root.contains(sg)){const a=sg.dataset.adr;X.dinAgenda.push(a);emite('din-agenda',{adresa:a,cum:'sugestie'});
      /* după alegere, lista de sugestii se închide (ca în Gmail; posta-gmail-scrie.js o lasă deschisă până la următoarea literă) */
      setTimeout(()=>root.querySelectorAll('.pgs-sug').forEach(x=>{x.innerHTML=''}),0)}},true);
  /* bara de adrese: contacts.google.com o duce extensia în Agendă; restul merge mai departe, la posta-gmail.js */
  pe('keydown',ev=>{const u=ev.target.closest&&ev.target.closest('.pg-url');if(!u||ev.key!=='Enter')return;
    if(AGENDA_URL.test(u.value.trim())){ev.preventDefault();ev.stopPropagation();mergiAgenda()}else{X.ecran=null;X.infoAg=''}},true);
  pe('click',ev=>{const e=ev.target.closest&&ev.target.closest('[data-a="enter"]');if(!e)return;const u=root.querySelector('.pg-url');if(!u)return;
    if(AGENDA_URL.test(u.value.trim())){ev.preventDefault();ev.stopPropagation();mergiAgenda()}else{X.ecran=null;X.infoAg=''}},true);
  pe('click',ev=>{
    const rd=ev.target.closest&&ev.target.closest('[data-dm]');if(rd&&root.contains(rd)){X._dinEt=b.stare().lista;b.deschideMesaj(rd.dataset.dm);return}
    const bt=ev.target.closest&&ev.target.closest('[data-d]');if(!bt||!root.contains(bt))return;const d=bt.dataset.d;
    if(d==='et-plus')deschideDialogEticheta();
    else if(d==='bifa')bifeaza(bt.dataset.id);
    else if(d==='etichete'||d==='etichete-msg'){if(X.meniuEt)inchideMeniu();else deschideMeniuEtichete()}
    else if(d==='mnet')comuta(numeDinId(bt.dataset.et));
    else if(d==='aplica')aplica();
    else if(d==='dlg-x'||d==='dlg-anuleaza')anuleazaEticheta();
    else if(d==='dlg-creeaza'){const i=elDlg.querySelector('[data-dd="et-nume"]');if(i)X.dlgEt.nume=i.value;confirmaEticheta()}
    else if(d==='dlg-sub'){if(X.dlgEt){X.dlgEt.sub=true;cur()}}
    else if(d==='al-x'||d==='al-anuleaza')anuleazaAlegerea();
    else if(d==='al-bifa')bifeazaContact(bt.dataset.adr);
    else if(d==='al-insereaza')insereaza();
    else if(d==='ag-creeaza'){X.creeazaMeniu=!X.creeazaMeniu;redesen(X.creeazaMeniu?'[data-d="ag-una"]':'[data-d="ag-creeaza"]')}
    else if(d==='ag-una')creeazaContact();
    else if(d==='ag-multe'){X.creeazaMeniu=false;X.infoAg='Mai multe persoane deodată nu adăugăm azi: alege „Creează o persoană de contact”.';redesen('[data-d="ag-creeaza"]')}
    else if(d==='ag-salveaza'){const f=X.formular;if(f)['prenume','nume','email'].forEach(k=>{const i=root.querySelector(`[data-dd="ag-${k}"]`);if(i)f[k]=i.value});salveazaContact()}
    else if(d==='ag-lista'){X.formular=null;X.contactDeschis=null;X.infoAg='';redesen('[data-d="ag-creeaza"]')}
    else if(d==='ag-vezi'){X.contactDeschis=+bt.dataset.i;X.infoAg='';redesen('[data-d="ag-lista"]')}
    else if(d==='ag-meniu'){X.infoAg='Butonul ☰ strânge sau lărgește meniul din stânga. Nu-l folosim azi.';redesen('[data-d="ag-meniu"]')}
    else if(d==='ag-profil'){X.profilAg=!X.profilAg;redesen(X.profilAg?'[data-d="ag-iesi"]':'[data-d="ag-profil"]')}
    else if(d==='ag-profil-x'){X.profilAg=false;redesen('[data-d="ag-profil"]')}
    else if(d==='ag-iesi'){X.profilAg=false;X.ecran=null;b.deconecteaza()}});
  pe('input',ev=>{const i=ev.target.closest&&ev.target.closest('[data-dd]');if(!i)return;const k=i.dataset.dd;
    if(k==='et-nume'&&X.dlgEt){X.dlgEt.nume=i.value;if(X.dlgEt.err){X.dlgEt.err='';const e=elDlg.querySelector('.err');if(e)e.textContent=''}}
    else if(k.indexOf('ag-')===0&&X.formular){X.formular[k.slice(3)]=i.value;X.formular.err=''}
    stareButoane();emite('schimbare')});
  pe('keydown',ev=>{const i=ev.target.closest&&ev.target.closest('[data-dd="et-nume"]');
    if(i&&ev.key==='Enter'){ev.preventDefault();X.dlgEt.nume=i.value;confirmaEticheta()}
    else if(ev.key==='Escape'){if(X.dlgEt){ev.preventDefault();anuleazaEticheta()}else if(X.alege){ev.preventDefault();anuleazaAlegerea()}else if(X.meniuEt){ev.preventDefault();inchideMeniu()}}});

  b.on('schimbare',()=>{cur();emite('schimbare')});
  b.on('lista',(n,d)=>{X.bife=[];X.meniuEt=null;X.dinEticheta=null;X.info='';if(esteEt(d.id)){const e=numeDinId(d.id);if(X.eticheteVazute.indexOf(e)<0)X.eticheteVazute.push(e);emite('eticheta-deschisa',{nume:e})}});
  b.on('deschide',()=>{X.bife=[];X.meniuEt=null;X.info='';X.dinEticheta=X._dinEt&&esteEt(X._dinEt)?X._dinEt:null;X._dinEt=null});
  b.on('deconectat',()=>{X.ecran=null;X.bife=[];X.meniuEt=null;X.dlgEt=null;X.alege=null;X.info='';X.infoAg='';X.profilAg=false});
  b.on('bara',()=>{X.info=''});
  b.on('*',(n,d)=>{if(n!=='schimbare')emite(n,d)});

  const inst=Object.assign({},b,{root,
    on(n,f){(asc[n]=asc[n]||[]).push(f);return ()=>{asc[n]=asc[n].filter(x=>x!==f)}},
    jurnal:()=>J.slice(),
    mergiLa,
    etichete:()=>X.etichete.slice().sort((a,c)=>a.localeCompare(c,'ro')),
    eticheteMesaj:id=>(X.et[id]||[]).slice(),
    deschideDialogEticheta,completeazaEticheta,confirmaEticheta,anuleazaEticheta,creeazaEticheta,
    bifeaza,deschideMeniuEtichete,comuta,aplica,aplicaEticheta,deschideEticheta,
    deschideAgenda,inchideAgenda,creeazaContact,completeazaContact,salveazaContact,adaugaContact,
    agenda:()=>JSON.parse(JSON.stringify(X.agenda)),
    deschideAlegerea,bifeazaContact,insereaza,anuleazaAlegerea,alegeDinAgenda,alegeSugestia,
    stareDosare:()=>{const c=JSON.parse(JSON.stringify(X));delete c._dinEt;return c},
    reset(){nou();elDlg.remove();elAl.remove();b.reset()},
    distruge(){dezleaga();nou();elDlg.remove();elAl.remove();b.distruge()}});
  b.redeseneaza();
  return inst}

/* ---------------- testele ---------------- */
const potriveste=(r,pe)=>!pe||((!pe.tip||[].concat(pe.tip).indexOf(r.tip||r.mod)>=0)&&(!pe.la||r.la===pe.la));
function dinCompunere(c){return {tip:c.mod,la:c.la,catre:S.adrese(c.catre),cc:S.adrese(c.cc),subiect:c.subiect,corp:c.corp,citat:c.citat,atasate:c.atasate,deschis:true}}
function candidat(x,pe){const c=x.compune;if(c&&potriveste(c,pe))return dinCompunere(c);
  for(let i=x.trimise.length-1;i>=0;i--)if(potriveste(x.trimise[i],pe))return x.trimise[i];return null}
/* mesajele de sub ✗ spun CE a făcut elevul și CE trebuia (cererea dirijorului, 12.10.2026, după judecata VI/14) */
const NIMIC='N-ai deschis fereastra de scriere: trebuia Scrie (mesaj nou), Răspunde sau Redirecționează.';
const ghil=l=>[].concat(l).map(x=>'„'+x+'”').join(', ');
const subiectDin=(Q,id)=>{const m=((Q&&Q.sim&&Q.sim.mesaje)||[]).find(x=>x.id===id);return m?m.subiect:id};
const areEt=(d,id,e)=>(d.et[id]||[]).some(x=>norm(x)===norm(e));
const primulRand=corp=>(String(corp||'').split('\n').map(x=>x.trim()).filter(Boolean)[0]||'');
/* cuvintele din numele oamenilor exercițiului (contul + agenda + De la / Către), doar la numele cu prenume ȘI nume:
   un nume de familie scris cu majuscule („Tudor MANOLE”, ca în catalog) nu e un strigăt; „Mama” nu intră */
function numeOameni(Q){const s=(Q&&Q.sim)||{},l=[];const pune=n=>{const w=String(n||'').trim().split(/[\s-]+/).filter(Boolean);if(w.length>=2)w.forEach(x=>l.push(x))};
  if(s.cont)pune(s.cont.nume);(s.agenda||[]).forEach(c=>pune(c&&c.nume));
  (s.mesaje||[]).forEach(m=>{if(m.de)pune(m.de.nume);(m.catre||[]).forEach(c=>pune(c&&c.nume))});return l}
/* mulțumirea: „mulțumesc / mulțumim / mulțumiri” (sau cuvintele date), oriunde în corp, fără diacritice și majuscule */
function areMultumire(corp,cuv){const t=' '+norm(corp).replace(/[^a-z0-9]+/g,' ')+' ';
  return (cuv&&cuv.length?cuv:['multumesc','multumim','multumiri*']).some(w=>{w=norm(String(w));const p=w.endsWith('*');w=p?w.slice(0,-1):w;return t.includes(' '+w+(p?'':' '))})}
/* testele noi; cele „de conținut” au forma testelor lui posta-gmail-scrie.js: f(mesaj, v, Q), m(mesaj, v, Q) */
const TESTE={
  formal:{continut:true,ce:v=>`Salutul e politicos: „Bună ziua,”${v&&v.cuvinte?' și cui îi scrii (de exemplu „domnule profesor”)':''}`,
    f:(m,v)=>salutPoliticos(m.corp,v&&v.cuvinte),
    m:(m,v)=>!m?NIMIC:`Primul rând din corp e ${primulRand(m.corp)?'„'+primulRand(m.corp)+'”':'gol'}; trebuia „Bună ziua,”${v&&v.cuvinte?' și cui îi scrii, de exemplu „Bună ziua, domnule profesor,”':''}. „Salut” sau „Hei” sunt pentru prieteni.`},
  faraMajuscule:{continut:true,ce:()=>'Fără cuvinte scrise numai cu MAJUSCULE (pe internet, asta înseamnă că strigi)',f:(m,v,Q)=>!areMajuscule((m.subiect||'')+'\n'+(m.corp||''),numeOameni(Q)).length,
    m:(m,v,Q)=>!m?NIMIC:`Ai scris numai cu majuscule: ${ghil(areMajuscule((m.subiect||'')+'\n'+(m.corp||''),numeOameni(Q)).slice(0,4))}. Trebuia cu litere mici; cu literă mare doar începutul propoziției și numele.`},
  multumire:{continut:true,ce:()=>'La final mulțumești („Vă mulțumesc,”), pentru că ai cerut ceva',
    f:(m,v)=>areMultumire(m.corp,v&&v.cuvinte),
    m:m=>!m?NIMIC:'Nu ai mulțumit. Ai cerut ceva, deci înainte de semnătură scrii „Vă mulțumesc,” (unui coleg: „Mulțumesc,”).'},
  faraSemneMulte:{continut:true,ce:()=>'Fără șiruri de semne („!!!”, „???”)',f:m=>!areSemneMulte((m.subiect||'')+'\n'+(m.corp||'')),
    m:m=>!m?NIMIC:'Ai scris mai multe semne la rând („!!!” sau „???”). Trebuia unul singur: mai multe se citesc ca un țipăt.'},
  eticheta:{ce:v=>`Ai creat eticheta „${v}”`,f:(c)=>c.d.etichete.some(e=>norm(e)===norm(c.v)),
    m:c=>(c.d.etichete.length?`Ai etichetele ${ghil(c.d.etichete)}. Trebuia și „${c.v}”`:`N-ai făcut nicio etichetă. Trebuia „${c.v}”`)+': + de lângă Etichete, numele, Creează.'},
  etichetat:{ce:(v,d,Q)=>d||`${v.ids.length===1?'Mesajul':'Mesajele'} ${ghil(v.ids.map(id=>subiectDin(Q,id)))} ${v.ids.length===1?'are':'au'} eticheta „${v.et}”`,
    f:c=>c.v.ids.every(id=>areEt(c.d,id,c.v.et)),
    m:c=>{const lip=c.v.ids.filter(id=>!areEt(c.d,id,c.v.et));return `${ghil(lip.map(id=>subiectDin(c.Q,id)))} ${lip.length===1?'n-are':'n-au'} eticheta „${c.v.et}”, dar trebuia s-o ${lip.length===1?'aibă':'aibă'}: bifezi caseta mesajului, 🏷 sus, bifezi eticheta, Aplică.`}},
  neetichetat:{ce:(v,d,Q)=>d||`${ghil(v.ids.map(id=>subiectDin(Q,id)))} nu ${v.ids.length===1?'are':'au'} eticheta „${v.et}”`,
    f:c=>c.v.ids.every(id=>!areEt(c.d,id,c.v.et)),
    m:c=>`Ai pus eticheta „${c.v.et}” și pe ${ghil(c.v.ids.filter(id=>areEt(c.d,id,c.v.et)).map(id=>subiectDin(c.Q,id)))}, unde nu se potrivește. O scoți: bifezi mesajul, 🏷, debifezi eticheta, Aplică.`},
  vazutEticheta:{ce:v=>`Ai deschis eticheta „${v}” (clic pe ea, în stânga)`,f:c=>c.d.eticheteVazute.some(e=>norm(e)===norm(c.v)),
    m:c=>`N-ai apăsat eticheta „${c.v}”, în stânga, sub Etichete. Trebuia, ca să vezi doar mesajele ei.`},
  agendaVazuta:{ce:()=>'Ai deschis Agenda Google (contacts.google.com în bara de adrese)',f:c=>c.d.agendaVazuta,
    m:()=>'N-ai deschis Agenda Google. Trebuia: în bara de adrese, contacts.google.com și Enter.'},
  contact:{ce:(v,d)=>d||`În agendă e ${v.nume?v.nume+', cu adresa ':'adresa '}${v.adresa}`,
    f:c=>c.d.agenda.some(p=>p.adresa.toLowerCase()===String(c.v.adresa).toLowerCase()&&(!c.v.nume||norm(c.v.nume).split(' ').every(w=>norm(p.afisat).split(' ').indexOf(w)>=0))),
    m:c=>{const v=c.v,p=c.d.agenda.find(x=>x.adresa.toLowerCase()===String(v.adresa).toLowerCase());
      if(p)return `Adresa e bună, dar ai salvat numele „${p.afisat}”. Trebuia, la Prenume și la Nume: ${v.nume}.`;
      const ap=v.nume&&c.d.agenda.find(x=>norm(v.nume).split(' ').every(w=>norm(x.afisat).split(' ').indexOf(w)>=0));
      if(ap)return `La ${ap.afisat} ai salvat adresa „${ap.adresa||'(goală)'}”; trebuia ${v.adresa}. Verific-o literă cu literă: agenda ține minte exact ce scrii.`;
      return c.d.agendaVazuta?`În agendă nu e nimeni cu adresa ${v.adresa}. Trebuia: Creează o persoană de contact, numele, adresa, Salvează.`:'N-ai deschis Agenda Google. Trebuia: contacts.google.com în bara de adrese.'}},
  dinAgenda:{ce:v=>`Adresa ${v} ai luat-o din agendă (sugestia de sub Către sau clic pe „Către”)`,f:c=>c.d.dinAgenda.some(a=>a.toLowerCase()===String(c.v).toLowerCase()),
    m:c=>{const k=c.x.compune,t=k?S.adrese(k.catre).concat(S.adrese(k.cc)):[];
      return (t.some(a=>a.toLowerCase()===String(c.v).toLowerCase())?`Adresa ${c.v} ai tastat-o de mână.`:`În Către nu e adresa ${c.v} luată din agendă.`)
        +' Trebuia aleasă din agendă: în Către scrii primele litere ale numelui și apeși pe sugestie (sau apeși pe cuvântul „Către” și o bifezi).'}},
  neredirectionat:{ce:(v,d,Q)=>d||`N-ai dat mai departe mesajul „${subiectDin(Q,v)}”`,
    f:c=>!c.x.trimise.some(r=>r.tip==='redir'&&r.la===c.v)&&!(c.x.compune&&c.x.compune.mod==='redir'&&c.x.compune.la===c.v),
    m:c=>`Ai redirecționat mesajul „${subiectDin(c.Q,c.v)}”, dar el nu se dă mai departe. Apasă „Ia-o de la capăt”.`}};
function testeDin(Q){return (Q.teste||[]).map((t,i)=>{const pe=t.pe!==undefined?t.pe:(Q.mesaj||null),mx=typeof t.m==='string'?t.m:'';
  if(t.c==='trimis'){const T=S.TESTE.trimis;return {c:t.c,v:t.v,i,pe,mx,fel:'trimis',T,ce:t.ce||T.ce(t.v,t.d)}}
  if(TESTE[t.c]){const T=TESTE[t.c];return {c:t.c,v:t.v,i,pe,mx,fel:T.continut?'continut':'dosar',T,ce:t.ce||(T.continut?(t.d||T.ce(t.v)):T.ce(t.v,t.d,Q))}}
  if(S.TESTE[t.c]){const T=S.TESTE[t.c];return {c:t.c,v:t.v,i,pe,mx,fel:T.continut?'continut':'scrie',T,ce:t.ce||(T.continut?(t.d||T.ce(t.v)):T.ce(t.v,t.d))}}
  const Tb=B.TESTE[t.c];if(!Tb)throw new Error('posta-gmail-dosare: test necunoscut '+t.c);
  return {c:t.c,v:t.v,i,pe,mx,fel:'baza',T:Tb,ce:t.ce||Tb.ce(Q,t.v,t.d)}})}
function evalueaza(Q,inst,fisa){const s=inst.stare(),x=inst.stareScrie(),d=inst.stareDosare(),l=testeDin(Q);
  return l.map(t=>{let ok,m='';
    if(t.fel==='baza'){ok=!!t.T.f(s,t.v,Q,fisa,t.i);if(!ok&&t.T.m)m=t.T.m(s,t.v,Q,fisa,t.i)}
    else if(t.fel==='continut'){const c=candidat(x,t.pe);ok=!!c&&!!t.T.f(c,t.v,Q);if(!ok)m=t.T.m(c,t.v,Q)}
    else if(t.fel==='trimis'){const k=JSON.stringify(t.pe||null),cs=l.filter(u=>u.fel==='continut'&&JSON.stringify(u.pe||null)===k);
      ok=x.trimise.some(r=>potriveste(r,t.pe)&&cs.every(u=>u.T.f(r,u.v,Q)));
      if(!ok)m=x.trimise.some(r=>potriveste(r,t.pe))?'Ai trimis mesajul, dar fără tot ce cer testele de mai sus (cele cu ✗). Trebuia verificat înainte de Trimite: apasă „Ia-o de la capăt”.':x.compune?'Mesajul e încă deschis, netrimis. Când e gata, trebuie apăsat Trimite.':'N-ai trimis mesajul cerut: trebuia Trimite.'}
    else if(t.fel==='scrie'){ok=!!t.T.f(x,t.v,Q,t.pe,s);if(!ok)m=t.T.m(x,t.v,Q,t.pe,s)}
    else{const c={s,x,d,v:t.v,Q,pe:t.pe,fisa};ok=!!t.T.f(c);if(!ok)m=t.T.m(c)}
    if(!ok&&t.mx&&m!==NIMIC)m=t.mx;    // mesajul de sub ✗ dat de lecție (Q.teste[i].m)
    return {c:t.c,ce:t.ce,ok,m}})}

/* ---------------- drumul (rezolvarea, prin metodele lui inst — merge și pe telefon) ---------------- */
const PASI=Object.assign({},S.PASI,{
  bara:(i,a)=>i.mergiLa(a||'gmail.com'),
  'eticheta-noua':(i,a)=>i.creeazaEticheta(a),eticheteaza:(i,ids,e)=>i.aplicaEticheta(ids,e,true),'scoate-eticheta':(i,ids,e)=>i.aplicaEticheta(ids,e,false),
  eticheta:(i,a)=>i.deschideEticheta(a),agenda:i=>i.deschideAgenda(),contact:(i,p)=>i.adaugaContact(p),gmail:i=>i.inchideAgenda(),
  'din-agenda':(i,a)=>i.alegeDinAgenda(a),bifa:(i,a)=>i.bifeaza(a,true),
  sugestie:(i,text,a)=>i.alegeSugestia(text,a)});
function executa(Q,inst,drum,fisaPune){(drum||[]).forEach(p=>{const f=PASI[p[0]];if(!f)throw new Error('posta-gmail-dosare: pas necunoscut '+p[0]);f(inst,p[1],p[2],Q,fisaPune)})}
function drumGresit(Q){const g=Q.gresit||{};if(g.drum)return g.drum;const d=(Q.drum||[]).slice();d.splice(g.sari!=null?g.sari:d.length-1,1);return d}

/* ---------------- tipul „dosare” pentru motor ---------------- */
function hTeste(l){return `<div class="pg-teste"><div class="lbl">Testele sarcinii · <span class="nr">0 din ${l.length} trec</span></div><ol>${l.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`}
function bifeazaT(box,rez,arata){rez.forEach((r,i)=>{const li=box.querySelector(`.pg-teste li[data-i="${i}"]`);if(!li)return;
  li.className=r.ok?'ok':(arata?'rau':'');li.querySelector('.s').textContent=r.ok?'✓':(arata?'✗':'○');li.querySelector('.m').textContent=!r.ok&&arata?r.m:''});
  const n=box.querySelector('.pg-teste .nr');if(n)n.textContent=`${rez.filter(r=>r.ok).length} din ${rez.length} trec`}
const tip={
  render(Q,body,api){
    stil();const l=testeDin(Q);
    body.innerHTML=`<div class="pg-sarcina"><div class="pg-loc"></div>
      ${(Q.fisa||[]).length?`<div class="pg-fisa"><div class="lbl">${Q.fisaTitlu||'Fișa ta (scrii ce citești în căsuță)'}</div>${Q.fisa.map(c=>`<label class="pg-f"><span>${c.et}</span><input type="text" id="pgd-f-${esc(c.id)}" ${ATR}></label>`).join('')}</div>`:''}
      ${hTeste(l)}<button type="button" class="pg-reset" data-pg="reset">Ia-o de la capăt</button></div>`;
    const loc=body.querySelector('.pg-loc'),fisa={};let inst;
    const upd=arata=>{const r=evalueaza(Q,inst,fisa);bifeazaT(body,r,arata);return r};
    const porneste=()=>{if(inst)inst.distruge();inst=creeaza(loc,Q.sim||{});inst.on('schimbare',()=>upd(false));upd(false)};
    (Q.fisa||[]).forEach(c=>{const i=body.querySelector('#pgd-f-'+c.id);fisa[c.id]='';i.addEventListener('input',()=>{fisa[c.id]=i.value;upd(false)})});
    const fisaPune=(id,v)=>{fisa[id]=v;const i=body.querySelector('#pgd-f-'+id);if(i)i.value=v;upd(false)};
    porneste();
    body.querySelector('[data-pg="reset"]').onclick=()=>{(Q.fisa||[]).forEach(c=>fisaPune(c.id,''));porneste();const u=loc.querySelector('.pg-url,#pg-in-adr,[data-lista="primite"]');if(u)u.focus({preventScroll:true})};
    const ruleaza=d=>{inst.reset();(Q.fisa||[]).forEach(c=>fisaPune(c.id,''));executa(Q,inst,d,fisaPune);upd(false)};
    body._rezolva=()=>ruleaza(Q.drum);body._gresit=()=>ruleaza(drumGresit(Q));body._inst=()=>inst;
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok).length;
      if(!rau){nav.innerHTML='';api.resolve(true)}
      else{api.resolve(false,`${rau===1?'Un test nu trece':rau+' teste nu trec'} (marcate cu ✗; sub fiecare scrie de ce). Continuă de unde ai rămas și apasă din nou.`,r.every(x=>!x.ok));
        api.revealButton(()=>{body._rezolva();upd(true);nav.innerHTML='';api.giveUp(Q.arata||'am făcut pașii în căsuța de mai sus: citește-i în ordine și uită-te la teste.')})}
      if(rau){const f=['.pgs-mn [data-c="corp"]','.pgs-mn [data-c="catre"]','[data-dd="ag-prenume"]','[data-d="ag-creeaza"]','.pgd-dlg input','.pg-meniu button.on','#pg-in-par','#pg-in-adr','.pg-url'].map(x=>loc.querySelector(x)).find(Boolean);if(f)f.focus({preventScroll:true})}},Q.buton||'Verifică');
  },
  rezolva(Q,body){body._rezolva()},
  gresit(Q,body){body._gresit()}
};

window.SimPostaGmailDosare={creeaza,tip,TESTE,testeDin,evalueaza,executa,PASI,areMajuscule,areSemneMulte,salutPoliticos,idEt,areMultumire,numeOameni};
})();
