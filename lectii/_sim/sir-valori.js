/* Simulatorul „șirul de valori” pentru lecțiile LearningHub — fișier comun (lectii/_sim/sir-valori.js).
   PROPRIETAR: autorul lecției VIII · M4 · nr. 23 („Ce este un șir de valori. Unde apar șiruri în viața reală”), 26.10.2026.

   CE SIMULEAZĂ. Nu o aplicație, ci tabla clasei din activitatea profesorului (Info_Gimnaziu_2026\data\
   activitati_lectii_VII_VIII.json, lecția 23): „Elevii dau exemple de șiruri din viața lor (notele, temperaturile
   săptămânii, scorurile) și le scriu pe tablă cu indici. Se introduce ideea de element și poziție.”
   Pe ecran: șirul desenat ca un RÂND DE CĂSUȚE; deasupra fiecărei căsuțe, poziția ei (1, 2, 3…, de la stânga);
   dedesubt, opțional, o etichetă (ziua, meciul). FĂRĂ limbaj de programare: nicio sintaxă de tablou, poziții de la 1.

   MODURI (Q.mod):
     'atinge'       atingi căsuța cerută (Q.cauta = {pozitie:k} | {valoare:v} | {ultimul:true});
     'pozitii'      scrii pozițiile deasupra căsuțelor (casete de scris în locul numerelor de poziție);
     'raspuns'      răspunzi în scris la întrebări despre șirul desenat (Q.intrebari);
     'construieste' scrii TU șirul, din textul exercițiului: o căsuță = un element; „+ Adaugă o căsuță” /
                    „− Scoate ultima căsuță”; opțional, și întrebări (Q.intrebari) despre șirul cerut;
     'marcheaza'    atingi, într-o poveste, numerele care fac parte din șir (Q.text cu {n|s} = din șir, {n} = nu);
                    sub poveste se vede, pe loc, „Șirul tău” în ordinea din poveste.
   Gesturile: atingere / clic / tastatură (Tab, Space, Enter pe butoane). Nicio tragere. Ținte (măsurate la 390 px,
   _proba/proba_reparatii.py [L]): căsuțele 46×46 px, butoanele și casetele de răspuns ≥ 44 px înălțime, casetele de
   poziție (mod 'pozitii') 46×36 px, numerele din poveste (mod 'marcheaza') ≥ 44×40 px — toate peste pragul de 32 px
   al regulii 20.
   „Verifică” bifează TESTELE numite (rezultat, nu drum: se judecă doar starea de acum). Enter într-o casetă de scris
   NU verifică (spune „Apasă Verifică când ești gata”). După „Verifică”, focusul revine la locul lucrului (regula 14).
   Nimic nu se salvează și nimic nu pleacă (fără <form>, fără name, fără stocare, fără cereri).

   Q (exercițiul / atelierul), pe lângă q, ajutor, why ale motorului:
     Q.sir          [valori] șirul desenat (moduri atinge / pozitii / raspuns / marcheaza-rezultat)
     Q.etichete     [texte]  sub căsuțe (de ex. zilele), opțional
     Q.nume         numele șirului, scris deasupra rândului (de ex. „Temperaturile de dimineață (°C)”)
     Q.pozitiiVizibile  false = fără numerele de poziție deasupra (implicit true)
     Q.cauta        la 'atinge': {pozitie:k} | {valoare:v} | {ultimul:true}
     Q.intrebari    [{id, ce, cere:{tip:'valoare',pozitie:k} | {tip:'lungime'} | {tip:'pozitii',valoare:v} |
                      {tip:'exista',pozitie:k} , capcane:{'<răspuns greșit>':'mesaj'} , gresit:'<răspunsul greșit tipic>'}]
                    RĂSPUNSUL BUN NU SE SCRIE: se calculează din Q.sir (sau Q.corect) și din `cere`.
                    tip 'exista' = listă „— alege —” / „da, există” / „nu, nu există”.
     Q.corect       la 'construieste': șirul cerut; Q.start = câte căsuțe goale la început (implicit 1);
                    Q.capcane = [{valoare, mesaj}] valori din poveste care NU sunt în șir (vârsta, data…);
                    Q.mesajLipsa = mesajul când lipsesc elemente (de ex. „Și ziua cu 0 e un element.”);
                    Q.gresit = șirul greșit tipic (pentru poartă), implicit Q.corect fără ultimul element
     Q.text         la 'marcheaza': povestea, cu numerele marcate {n|s} (din șir) sau {n} (nu din șir);
                    Q.mesaje = {'<indexul numărului, de la 0>':'mesaj când e ales greșit'}; Q.mesajLipsa;
                    Q.gresit = [indicii aleși] pentru poartă (implicit: toți din șir, fără cel cu valoarea 0 / ultimul)
     Q.negative     true = casetele de scris primesc și minus (inputmode text, pentru telefonul iPhone)
     Q.solutieText  textul de după „Arată-mi răspunsul”

   TESTELE (numele lor spun CE se verifică, nu răspunsul), în ordinea în care primul care pică numește greșeala:
     atinge:       'ales' (ai ales o căsuță) · 'bun' (căsuța aleasă e cea cerută)
     pozitii:      'toate' (fiecare căsuță are deasupra un număr) · 'primul' (primul element e pe poziția 1) ·
                   'pas' (pozițiile cresc din 1 în 1 până la ultimul element; numele nu spune lungimea)
     construieste: 'lungime' (șirul are atâtea elemente câte valori de același fel sunt în text; numele nu spune N) ·
                   'numere' (fiecare căsuță are un singur număr) ·
                   'ordine' (elementele sunt valorile din text, în ordinea lor) · apoi câte un test pe întrebare
     marcheaza:    'toate' (ai ales toate valorile șirului) · 'doar' (n-ai ales numere din afara șirului)
     raspuns:      câte un test pe întrebare (id-ul ei)

   API PUBLIC (pentru lecția următoare; NU se schimbă fără o notă datată în capul fișierului și în surse.md):
     SirValori.render / rezolva / gresit (Q, body, api)  — tipul motorului: tipuri:{sir:SirValori}
     SirValori.html(valori, {etichete, pozitii:true|false, nume, evidentiaza:[poziții], indice:'t'}) — rândul de
       căsuțe ca HTML static, pentru „Uite cum” (fără gesturi); cu `indice`, sub căsuțe apare t₁, t₂…
     SirValori.numere(text) — numerele dintr-un răspuns scris (cifre, „minus”, cuvinte 0-20, „a patra”…; de la r1 și
       „nimic” / „niciunul” / „niciuna” / „deloc” = 0)
     SirValori._evalueaza(Q, stare) -> [{id, ce, ok, m}] ; SirValori._stare(body) -> starea curentă
   Ce NU se schimbă: numele modurilor și ale testelor, forma lui Q de mai sus, clasele CSS „sv-…”, id-ul de stil
   „sim-sir-valori-css”, regula „nimic nu se salvează, nimic nu pleacă”.
   Probe: lectii/viii/m4-l23/_proba/ (proba_gesturi_l23.py, oracol_lectie.py, proba_forme.py, proba_mutanti.py,
   proba_reparatii.py).

   SCHIMBĂRI (fiecare cu data; API-ul — numele, forma lui Q, testele, clasele — a rămas același):
   26.10.2026, reparația după judecata 1 (registrul lectii/viii/m4-l23/_verificare/registru_j1.md):
     - răspunsurile scrise: la cere.tip 'valoare' se lasă deoparte poziția întrebată scrisă cu un cuvânt de loc sau ca
       ordinal („a doua notă e 7”, „pe locul 2”, „poziția a 2-a”, „în ziua 9”, „45 (a noua)”, „g_3 = 4”, „g(3)=4”); o
       altă poziție scrisă așa e respinsă cu mesajul ei; la 'pozitii' se lasă deoparte valoarea căutată scrisă ca subiect
       („5 stă pe…”, „zero e pe…”, „10 este pe…”) și „de două ori”; mesajul la o poziție în plus o numește;
     - numere(): „nimic”, „niciunul”, „niciuna”, „deloc” = 0;
     - mesajele: „ultimul element” și „numără căsuțele” spun poziția / ordinea, nu „capătul din dreapta” (la 390 px
       șirul trece pe mai multe rânduri);
     - numele testului 'pas' nu mai spune lungimea (era „… până la ultimul element (8)”);
     - nota despre ținte spune mărimile măsurate (era „≥ 44 px”).
   26.10.2026, trecerea scurtă după judecata 2 (punctul R, lectii/viii/m4-l23/_verificare/judecator2.md):
     - la 'pozitii' se lasă deoparte și valoarea căutată scrisă DUPĂ verb, când pozițiile sunt scrise înaintea lui
       („pe poziția 3 e 10”, „pe 4 și 6 stă 5”, „pe 2, 3 și 6 e 0”, „pe 4 e 5, pe 6 e 5”); fără o poziție înaintea
       verbului („poziția e 3”) numărul rămâne răspunsul. Numele, Q, testele și mesajele: neschimbate. */
(function(){
'use strict';
const CSS=`
.sv-wrap{margin:4px 0}
.sv-nume{font-size:.9rem;font-weight:700;margin:0 0 4px;color:var(--ink)}
.sv-sir{display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start;margin:2px 0 6px}
.sv-el{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:46px}
.sv-poz{font-size:.78rem;line-height:1;color:var(--ink2);font-family:var(--fm,monospace);min-height:1em}
.sv-poz.sv-gol{visibility:hidden}
.sv-cas{min-width:46px;min-height:46px;padding:4px 6px;display:flex;align-items:center;justify-content:center;
  border:2px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-weight:700;
  font-size:1.02rem;line-height:1.1;box-sizing:border-box}
button.sv-cas{cursor:pointer}
button.sv-cas:focus-visible,.sv-in:focus-visible,.sv-btn:focus-visible,.sv-nr:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.sv-cas[aria-pressed="true"]{border-color:#E4002B;box-shadow:0 0 0 2px #E4002B inset;background:var(--sel)}
.sv-cas.sv-ev{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent) inset}
.sv-et{font-size:.74rem;line-height:1.1;color:var(--ink2);max-width:58px;text-align:center;min-height:.9em}
.sv-ind{font-size:.82rem;color:var(--ink2);font-style:italic}
.sv-in{width:52px;min-height:46px;box-sizing:border-box;padding:4px;border:2px solid var(--line);border-radius:6px;
  background:var(--paper);color:var(--ink);font:inherit;font-size:16px;font-weight:700;text-align:center}
.sv-in.sv-pz{width:46px;min-height:36px;font-size:16px;font-weight:600;padding:2px}
.sv-in.rau{border-color:var(--bad)}
.sv-unelte{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 8px}
.sv-btn{min-height:44px;padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);color:var(--ink);font:inherit;font-size:.9rem;cursor:pointer}
.sv-btn[disabled]{opacity:.5;cursor:default}
.sv-acum{margin:0 0 6px;font-size:.92rem;line-height:1.4;color:var(--ink);min-height:1.4em}
.sv-intr{display:grid;gap:8px;margin:8px 0 4px}
.sv-intr label{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:.95rem;line-height:1.35}
.sv-intr input.sv-r{flex:0 0 auto;width:150px;max-width:100%;min-height:44px;box-sizing:border-box;padding:4px 8px;border:2px solid var(--line);
  border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-size:16px}
.sv-intr select{min-height:44px;font:inherit;font-size:16px;border-radius:6px;border:2px solid var(--line);background:var(--paper);color:var(--ink);padding:2px 6px}
.sv-intr .rau input,.sv-intr .rau select{border-color:var(--bad)}
.sv-poveste{font-size:1rem;line-height:2.4;margin:4px 0 8px}
.sv-nr{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:40px;margin:0 2px;padding:2px 8px;
  border:2px dashed var(--line);border-radius:8px;background:var(--paper);color:var(--ink);font:inherit;font-weight:700;cursor:pointer;line-height:1.1;vertical-align:middle}
.sv-nr[aria-pressed="true"]{border-style:solid;border-color:#E4002B;background:var(--sel)}
.sv-al{font-size:.88rem;color:var(--ink2);margin:2px 0 0}
.sv-teste{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:var(--paper2)}
.sv-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.sv-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.sv-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.sv-teste li.ok .s{color:var(--ok)}.sv-teste li.rau .s{color:var(--bad)}
.sv-teste li .m{display:block;font-size:.85rem;color:var(--bad)}
.sv-teste .hint{font-size:.85rem;color:var(--ink2)}
`;
function stil(){
  if(document.getElementById('sim-sir-valori-css'))return;
  const s=document.createElement('style');s.id='sim-sir-valori-css';s.textContent=CSS;(document.head||document.documentElement).appendChild(s);
}
stil();   // stilul se pune la încărcare: rândurile statice din „Uite cum” (SirValori.html) îl folosesc înainte de orice exercițiu
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SUB='₀₁₂₃₄₅₆₇₈₉';
const sub=n=>String(n).split('').map(c=>SUB[+c]||c).join('');
const arataNr=v=>{const s=String(v);return /^-\d/.test(s)?'−'+s.slice(1):s};   // minusul tipografic, doar la desen

/* ---------- numerele dintr-un răspuns scris (forma copilului: cifre, minus, cuvinte, ordinale) ---------- */
const CUV={zero:0,unu:1,doi:2,doua:2,trei:3,patru:4,cinci:5,sase:6,sapte:7,opt:8,noua:9,zece:10,
  unsprezece:11,doisprezece:12,douasprezece:12,treisprezece:13,paisprezece:14,patrusprezece:14,cincisprezece:15,
  saisprezece:16,saptesprezece:17,optsprezece:18,nouasprezece:19,douazeci:20,
  prima:1,primul:1,intai:1,intaiul:1,doilea:2,treia:3,treilea:3,patra:4,patrulea:4,cincea:5,cincilea:5,sasea:6,saselea:6,
  saptea:7,saptelea:7,opta:8,optulea:8,noualea:9,zecea:10,zecelea:10,
  nimic:0,niciunul:0,niciuna:0,deloc:0};   // r1: „nimic” / „deloc” pentru o valoare 0
function fara(s){return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[ţ]/g,'t').replace(/[ş]/g,'s').toLowerCase()}
function numere(text){
  let s=fara(text).replace(/[−–—]/g,'-');
  const out=[];
  // zecile în cuvinte: „patruzeci și cinci” = 45, „douăzeci” = 20
  const ZECI={douazeci:20,treizeci:30,patruzeci:40,cincizeci:50,saizeci:60,saptezeci:70,optzeci:80,nouazeci:90};
  const UNIT={unu:1,una:1,doi:2,doua:2,trei:3,patru:4,cinci:5,sase:6,sapte:7,opt:8,noua:9};
  s=s.replace(/\b(douazeci|treizeci|patruzeci|cincizeci|saizeci|saptezeci|optzeci|nouazeci)(?:\s+si\s+(unu|una|doi|doua|trei|patru|cinci|sase|sapte|opt|noua)\b)?/g,
    (_,z,u)=>' '+(ZECI[z]+(u?UNIT[u]:0))+' ');
  // minus scris în cuvinte: „minus 2”
  s=s.replace(/minus\s*(\d+)/g,' -$1 ');
  const re=/(-?)\s?(\d+)(?:[.,](\d+))?|([a-z]+)/g;let m,prev='';
  while((m=re.exec(s))){
    if(m[2]!=null){
      const i=m.index,inainte=s.slice(0,i).replace(/\s+$/,'');
      let neg=m[1]==='-';
      if(neg&&/\d$/.test(inainte))neg=false;   // „4 - 6” = două numere, nu 4 și −6
      let v=m[3]!=null?Number(m[2]+'.'+m[3]):Number(m[2]);
      out.push(neg?-v:v);prev='';
    }else{
      const w=m[4];
      if(w==='minus'){prev='minus';continue}
      if(w in CUV){let v=CUV[w];if(prev==='minus')v=-v;out.push(v)}
      prev=w==='minus'?'minus':'';
    }
  }
  return out;
}

/* ---------- numerele care doar repetă întrebarea (r1, 26.10.2026) ----------
   scoatePozitii: la „Ce valoare are elementul de pe poziția k?”, pozițiile scrise cu un cuvânt de loc sau ca ordinal
   („pe poziția 2”, „poziția a 2-a”, „pe locul 2”, „în ziua 9”, „a doua notă”, „al doilea”, „(a noua)”, „g3 =”, „g_3 =”,
   „g(3) =”); întoarce textul fără ele și numerele lor (cele diferite de k sunt respinse cu mesajul lor).
   scoateValoarea: la „Pe ce poziții stă valoarea v?”, valoarea v scrisă ca subiect („5 stă pe…”, „zero e pe…”,
   „valoarea 5…”, „nota 10…”), scrisă după verb după poziții („pe poziția 3 e 10”, t2) și „de două ori” nu sunt
   poziții. Textul vine deja fără diacritice, cu litere mici. */
const ORDIN={prima:1,primul:1,intai:1,intaiul:1,doua:2,doilea:2,treia:3,treilea:3,patra:4,patrulea:4,cincea:5,cincilea:5,
  sasea:6,saselea:6,saptea:7,saptelea:7,opta:8,optulea:8,noua:9,noualea:9,zecea:10,zecelea:10};
const nrCuvant=t=>{t=String(t).replace(/^minus\s*/,'-');return /^-?\d+$/.test(t)?Number(t):(t in CUV)?CUV[t]:null};
function scoatePozitii(s,k,indice){
  const poz=[],ia=n=>{poz.push(n);return ' '};
  const LOC=w=>new RegExp('\\b(?:pe\\s+|in\\s+)?(?:'+w+')\\s+(?:a\\s+|al\\s+)?(\\d+|[a-z]+)(?:\\s*-\\s*(?:a|lea)\\b|-?(?:a|lea)\\b)?','g');
  const nrLoc=t=>/^\d+$/.test(t)?Number(t):(t in ORDIN)?ORDIN[t]:nrCuvant(t);
  s=s.replace(LOC('pozitia|pozitie|pozitiei|locul|loc|elementul'),(m,t)=>{const n=nrLoc(t);return n==null?m:ia(n)});   // cuvinte de poziție: orice număr
  s=s.replace(LOC('ziua|zi|saptamana|sambata|meciul|meci|runda'),(m,t)=>{const n=nrLoc(t);return n===Number(k)?ia(n):m});   // „în ziua 9”: doar poziția întrebată („în al treilea meci 4 goluri” păstrează 4)
  s=s.replace(/\b(?:a|al)\s+(\d+)\s*-?\s*(?:a|lea)\b/g,(m,t)=>ia(Number(t)));                       // „a 2-a”, „al 2-lea”
  s=s.replace(/\b(?:a|al)\s+(prima|primul|intai|intaiul|doua|doilea|treia|treilea|patra|patrulea|cincea|cincilea|sasea|saselea|saptea|saptelea|opta|optulea|noua|noualea|zecea|zecelea)\b/g,(m,w)=>ia(ORDIN[w]));
  s=s.replace(/\b(prima|primul|intaiul|doilea|treilea|patrulea|cincilea|saselea|saptelea|optulea|noualea|zecelea|treia|patra|cincea|sasea|saptea|zecea)\b/g,(m,w)=>ia(ORDIN[w]));   // ordinale fără „a” (doar cele care nu sunt și numere)
  const lit=(l,t)=>l===String(indice||'').toLowerCase()||Number(t)===Number(k);                      // „g3”: litera șirului sau poziția întrebată
  s=s.replace(/\b([a-z])\s?(?:_\s?|\(\s?|\[\s?)?(\d+)\s?[)\]]?\s*[=:]/g,(m,l,t)=>lit(l,t)?ia(Number(t)):m);   // „g3 =”, „g_3 =”, „g(3)=”
  s=s.replace(/\b([a-z])(\d+)\b/g,(m,l,t)=>lit(l,t)?ia(Number(t)):m);                                  // „g3”, „t5”
  return {s,poz};
}
function scoateValoarea(s,v){
  let scos=false;const eV=t=>{const n=nrCuvant(t);return n!=null&&n===Number(v)};
  const NR='(-?\\d+|minus\\s*\\d+|[a-z]+)';
  s=s.replace(new RegExp('\\b(?:valoarea|valoare|valorii|nota|notei|numarul|numar)\\s+'+NR,'g'),(m,t)=>eV(t)?(scos=true,' '):m);
  s=s.replace(/\bde\s+(?:\d+|[a-z]+)\s+ori\b/g,' ');   // „(de două ori)” nu e o poziție
  /* t2 (26.10.2026, punctul R al judecății 2): valoarea scrisă DUPĂ verb, când pozițiile sunt scrise înaintea verbului
     („pe poziția 3 e 10”, „pe 4 și 6 stă 5”, „pe 2, 3 și 6 e 0”), la sfârșitul răspunsului (cel mult cu o unitate după
     ea: „5 lei”) sau înaintea unei bucăți noi „și pe… / , pe…”. Fără o poziție scrisă înaintea verbului („poziția e 3”,
     „răspunsul este 3”), numărul de după verb rămâne răspunsul. Rulează ÎNAINTEA regulii cu valoarea-subiect, ca în
     „pe 1 și 3 e 3” (valoarea 3 pe pozițiile 1 și 3) poziția 3 de dinaintea verbului să nu fie luată drept subiect. */
  s=s.replace(new RegExp('(^|[^a-z0-9-])(?:sta|stau|e|este|apare|apar|scrie|se\\s+afla|se\\s+gaseste|se\\s+gasesc)\\s+'+NR+
    '(?=(?:\\s+(?:de\\s+)?([a-z]+))?[\\s.!?()]*$|\\s*(?:[,;]|\\bsi\\b|\\biar\\b)\\s*pe\\b)','g'),
    (m,p,t,u,i,tot)=>eV(t)&&(u==null||nrCuvant(u)==null)&&(x=>{x=x.replace(/\s+(?:pozitie|pozitia|pozitii|pozitiile|locul|locurile|locuri)\s*$/,'').replace(/\s*-\s*(?:a|lea)\s*$/,'');const w=(x.match(/(-?\d+|[a-z]+)\s*$/)||[])[1];return w!=null&&(/^-?\d+$/.test(w)||nrCuvant(w)!=null||w in ORDIN)})(tot.slice(0,i))?(scos=true,p+' '):m);
  s=s.replace(new RegExp('(^|[^a-z0-9-])'+NR+'(?=\\s*(?:(?:sta|stau|e|este|apare|apar|se\\s+afla|se\\s+gaseste|se\\s+gasesc|se\\s+repeta)\\b|:))','g'),
    (m,p,t)=>eV(t)?(scos=true,p+' '):m);
  return {s,scos};
}

/* ---------- rândul de căsuțe ---------- */
function htmlSir(valori,o){
  o=o||{};const poz=o.pozitii!==false,ev=o.evidentiaza||[],et=o.etichete||[];
  return `<div class="sv-wrap">${o.nume?`<p class="sv-nume">${o.nume}</p>`:''}<div class="sv-sir" role="list"${o.nume?` aria-label="${esc(String(o.nume).replace(/<[^>]+>/g,''))}"`:''}>${valori.map((v,i)=>
    `<div class="sv-el" role="listitem"><span class="sv-poz${poz?'':' sv-gol'}">${poz?i+1:'·'}</span><span class="sv-cas${ev.includes(i+1)?' sv-ev':''}"${poz?` aria-label="poziția ${i+1}: ${esc(v)}"`:''}>${esc(arataNr(v))}</span>${o.indice?`<span class="sv-ind">${esc(o.indice)}${sub(i+1)}</span>`:''}${et.length?`<span class="sv-et">${esc(et[i]||'')}</span>`:''}</div>`).join('')}</div></div>`;
}

/* ---------- răspunsurile așteptate (calculate din șir, nu scrise de mână) ---------- */
function sirul(Q){return Q.mod==='construieste'?(Q.corect||[]):Q.mod==='marcheaza'?jetoane(Q).filter(t=>t.s).map(t=>t.n):(Q.sir||[])}
function asteptat(Q,I){
  const s=sirul(Q).map(Number),c=I.cere||{};
  if(c.tip==='valoare')return {numar:s[c.pozitie-1]};
  if(c.tip==='lungime')return {numar:s.length};
  if(c.tip==='pozitii')return {set:s.map((v,i)=>v===Number(c.valoare)?i+1:0).filter(x=>x)};
  if(c.tip==='exista')return {alege:c.pozitie>=1&&c.pozitie<=s.length?'da':'nu'};
  return {};
}
function verificaIntrebare(Q,I,raspuns){
  const a=asteptat(Q,I),r=raspuns==null?'':String(raspuns);
  if(a.alege!=null){
    if(!r)return {ok:false,m:'Alege un răspuns din listă.'};
    if(r===a.alege)return {ok:true};
    return {ok:false,m:(I.capcane&&I.capcane[r])||'Numără căsuțele șirului, de la prima la ultima, și compară cu poziția din întrebare.'};
  }
  const c0=I.cere||{};
  /* propoziția întreagă a copilului: „pe poziția 2 e 7”, „a doua notă e 7”, „g3 = 4”, „5 stă pe pozițiile 4 și 6” —
     numerele care doar repetă întrebarea (poziția întrebată, numele elementului, valoarea căutată) nu sunt răspunsul */
  let curat=fara(r),pozScoase=[],valScoasa=false;
  if(c0.tip==='valoare'){const sp=scoatePozitii(curat.replace(/\b(?:l\s*\/\s*)?m\s*2\b/g,' '),c0.pozitie,Q.indice);curat=sp.s;pozScoase=sp.poz}   // „12 l/m2”: unitatea, nu un număr
  if(c0.tip==='pozitii'){const sv=scoateValoarea(curat,c0.valoare);curat=sv.s.replace(/[,;&+]/g,' ');valScoasa=sv.scos}   // „4,6” = pozițiile 4 și 6, nu 4,6
  const alta=pozScoase.find(x=>x!==Number(c0.pozitie));
  if(alta!=null)return {ok:false,m:`Ai scris poziția ${esc(alta)}, dar întrebarea e despre poziția ${esc(c0.pozitie)}: scrie valoarea din căsuța de pe poziția ${esc(c0.pozitie)}.`};
  let n=numere(curat);
  if(n.length>1&&!a.set&&n.every(x=>x===n[0]))n=[n[0]];   // „7 (șapte)” = un singur număr
  if(!n.length&&(valScoasa||pozScoase.length))return {ok:false,m:c0.tip==='pozitii'?'Ai scris doar valoarea din întrebare. Scrie și pozițiile pe care stă ea.':`Ai scris doar poziția din întrebare. Scrie și valoarea din căsuța de pe poziția ${c0.pozitie}.`};
  if(!r.trim()||!n.length)return {ok:false,m:'Scrie un număr în căsuța de răspuns.'};
  const cheie=fara(r).replace(/\s+/g,' ').trim(),cap=I.capcane||{};
  if(a.set){
    const got=[...new Set(n.map(Math.abs))].sort((x,y)=>x-y),want=a.set.slice().sort((x,y)=>x-y);
    if(got.length===want.length&&got.every((x,i)=>x===want[i]))return {ok:true};
    if(cap[got.join(',')])return {ok:false,m:cap[got.join(',')]};
    const lipsa=want.filter(x=>!got.includes(x)).length,plusL=got.filter(x=>!want.includes(x)),plus=plusL.length;
    const v=Number(I.cere.valoare),L=sirul(Q).length,X=plusL.includes(Math.abs(v))?Math.abs(v):plusL[0];
    /* regula 28: mesajul numește numărul în plus și spune doar ce e sigur adevărat despre el */
    const deCe=X===Math.abs(v)?`Ai scris și ${esc(X)}, adică valoarea din întrebare. Scrie doar pozițiile pe care stă ea.`
      :X<1?`Ai scris și ${esc(X)}, dar pozițiile încep de la 1.`
      :X>L?`Ai scris și ${esc(X)}, dar șirul are doar ${L} ${L===1?'element':'elemente'}: poziția ${esc(X)} nu există.`
      :`Ai scris și poziția ${esc(X)}, dar în căsuța de pe poziția ${esc(X)} nu stă valoarea ${esc(I.cere.valoare)}.`;
    return {ok:false,m:plus&&!lipsa?deCe:lipsa&&!plus?`Valoarea ${esc(I.cere.valoare)} ${lipsa===1?'mai apare o dată în șir':'mai apare în șir, în alte căsuțe'}: caut-o în toate căsuțele.`:`Caută valoarea ${esc(I.cere.valoare)} în căsuțe și scrie numerele de poziție de deasupra lor.`};
  }
  if(n.length>1)return {ok:false,m:'Ai scris mai multe numere: scrie doar unul.'};
  if(n[0]===a.numar)return {ok:true};
  const k=String(n[0]);
  if(cap[k])return {ok:false,m:cap[k]};
  if(cap[cheie])return {ok:false,m:cap[cheie]};
  const c=I.cere||{};
  if(c.tip==='valoare'&&n[0]===c.pozitie)return {ok:false,m:`Ai scris ${esc(k)}: acesta e numărul poziției. Întrebarea cere valoarea scrisă în căsuța de pe poziția ${c.pozitie}.`};
  if(c.tip==='valoare'&&a.numar<0&&n[0]===-a.numar)return {ok:false,m:'Atenție la semn: în căsuță, numărul are minus (−) în față. Scrie-l și tu cu minus.'};
  if(c.tip==='lungime')return {ok:false,m:'Numără toate căsuțele, de la prima la ultima. Dacă vezi pozițiile deasupra, uită-te la ultima.'};
  return {ok:false,m:c.tip==='valoare'?`În căsuța de pe poziția ${c.pozitie} nu scrie ${esc(k)}. ${cumGasesti(Q,c.pozitie)}`:'Mai uită-te o dată la șir.'};
}
function cumGasesti(Q,k){
  return Q.pozitiiVizibile!==false?`Caută numărul ${k} deasupra căsuțelor.`:`Numără căsuțele în ordine, de la prima din stânga, de la 1 până la ${k} (dacă șirul trece pe rândul de dedesubt, numărătoarea continuă acolo).`;
}

/* ---------- povestea de la „marcheaza” ---------- */
function jetoane(Q){
  if(Q._jet)return Q._jet;
  const t=[];String(Q.text||'').replace(/\{(-?\d+)(\|s)?\}/g,(_,n,s)=>{t.push({n:Number(n),s:!!s,i:t.length});return ''});
  Object.defineProperty(Q,'_jet',{value:t,enumerable:false});return t;
}

/* ---------- starea ---------- */
function stareNoua(Q){
  const st={ales:null,poz:[],val:[],r:{},sel:[],verificat:false};
  if(Q.mod==='pozitii')st.poz=(Q.sir||[]).map(()=>'');
  if(Q.mod==='construieste')st.val=Array(Math.max(1,Q.start||1)).fill('');
  return st;
}
function raspunsBun(Q,I){
  const a=asteptat(Q,I);
  if(a.alege!=null)return a.alege;
  if(a.set)return a.set.join(' și ');
  return String(a.numar);
}
function stareCorecta(Q){
  const st=stareNoua(Q),s=sirul(Q);
  if(Q.mod==='atinge')st.ales=tinta(Q);
  if(Q.mod==='pozitii')st.poz=s.map((_,i)=>String(i+1));
  if(Q.mod==='construieste')st.val=s.map(String);
  if(Q.mod==='marcheaza')st.sel=jetoane(Q).filter(t=>t.s).map(t=>t.i);
  (Q.intrebari||[]).forEach(I=>{st.r[I.id]=raspunsBun(Q,I)});
  return st;
}
function stareGresita(Q){
  const st=stareCorecta(Q),s=sirul(Q);
  if(Q.mod==='atinge'){
    const c=Q.cauta||{},n=s.length;
    if(c.pozitie!=null){const j=s.findIndex(v=>Number(v)===Number(c.pozitie));st.ales=j>=0&&j+1!==c.pozitie?j+1:Math.min(n,c.pozitie+1)}
    else if(c.valoare!=null){st.ales=Number(c.valoare)>=1&&Number(c.valoare)<=n&&Number(s[c.valoare-1])!==Number(c.valoare)?Number(c.valoare):(tinta(Q)%n)+1}
    else st.ales=Math.max(1,n-1);
  }
  if(Q.mod==='pozitii')st.poz=s.map((_,i)=>String(i));                 // pozițiile de la 0
  if(Q.mod==='construieste')st.val=(Q.gresit||s.slice(0,-1)).map(String);
  if(Q.mod==='marcheaza'){
    const J=jetoane(Q);
    if(Q.gresit)st.sel=Q.gresit.slice();
    else{const z=J.find(t=>t.s&&t.n===0);st.sel=J.filter(t=>t.s&&t!==(z||J.filter(x=>x.s).slice(-1)[0])).map(t=>t.i)}
  }
  (Q.intrebari||[]).forEach(I=>{if(I.gresit!=null)st.r[I.id]=String(I.gresit)});
  if(Q.mod==='raspuns'&&(Q.intrebari||[]).every(I=>I.gresit==null)&&Q.intrebari&&Q.intrebari.length){
    const I=Q.intrebari[0],c=I.cere||{};st.r[I.id]=c.tip==='valoare'?String(c.pozitie):c.tip==='lungime'?String(sirul(Q).length-1):c.tip==='exista'?(asteptat(Q,I).alege==='da'?'nu':'da'):'0';
  }
  return st;
}
function tinta(Q){
  const c=Q.cauta||{},s=sirul(Q);
  if(c.pozitie!=null)return c.pozitie;
  if(c.valoare!=null)return s.findIndex(v=>Number(v)===Number(c.valoare))+1;
  return s.length;
}

/* locul unei căsuțe în mesaje: cu pozițiile desenate, „poziția k”; fără ele (exercițiile de dinaintea pasului care
   predă poziția), „căsuța a k-a de la stânga” — ca mesajul să nu folosească un cuvânt încă nepredat (regula 1) */
function loc(Q,i,subiect){
  if(Q.pozitiiVizibile!==false)return subiect?`Căsuța de pe poziția ${i}`:`Pe poziția ${i}`;
  if(i===1)return subiect?'Prima căsuță':'În prima căsuță';
  return subiect?`Căsuța a ${i}-a de la stânga`:`În căsuța a ${i}-a de la stânga`;
}

/* ---------- testele ---------- */
function evalueaza(Q,st){
  const T=[],s=sirul(Q),n=s.length;
  if(Q.mod==='atinge'){
    const c=Q.cauta||{},t=tinta(Q),a=st.ales;
    T.push({id:'ales',ce:'Ai ales o căsuță',ok:a!=null,m:a!=null?'':'Atinge o căsuță din șir.'});
    let m='';
    if(a!=null&&!(c.valoare!=null?Number(s[a-1])===Number(c.valoare):a===t)){
      const v=s[a-1];
      const vz=Q.pozitiiVizibile!==false;
      if(c.pozitie!=null&&Number(v)===Number(c.pozitie))m=`Ai ales căsuța de pe poziția ${a}, în care scrie ${esc(v)}. ${vz?'Poziția e numărul mic de DEASUPRA căsuței, nu numărul din ea.':'Poziția e locul căsuței, numărat de la stânga, nu numărul din ea.'}`;
      else if(c.pozitie!=null&&a===c.pozitie+1)m=`Ai ales căsuța de pe poziția ${a}. Numără de la stânga, iar prima căsuță e pe poziția 1.`;
      else if(c.valoare!=null&&a===Number(c.valoare))m=`Ai ales căsuța de pe poziția ${a}, dar în ea scrie ${esc(v)}. Caută valoarea ${esc(c.valoare)} ÎN căsuțe.`;
      else if(c.ultimul)m=`Ai ales căsuța de pe poziția ${a}. Ultimul element e cel de după toate celelalte, pe poziția cea mai mare (dacă șirul trece pe mai multe rânduri, e ultima căsuță din ultimul rând).`;
      else m=`Ai ales căsuța de pe poziția ${a}, în care scrie ${esc(v)}. ${c.valoare!=null?`Caută valoarea ${esc(c.valoare)} în căsuțe.`:cumGasesti(Q,c.pozitie)}`;
    }
    const okB=a!=null&&(c.valoare!=null?Number(s[a-1])===Number(c.valoare):a===t);
    T.push({id:'bun',ce:c.valoare!=null?`Căsuța aleasă are valoarea ${esc(arataNr(c.valoare))}`:c.ultimul?'Căsuța aleasă e ultimul element':`Căsuța aleasă e elementul de pe poziția ${c.pozitie}`,ok:okB,m:a==null?'Întâi atinge o căsuță.':okB?'':m});
  }
  if(Q.mod==='pozitii'){
    const p=st.poz.map(x=>numere(x)),goale=p.map((x,i)=>x.length!==1?i:-1).filter(i=>i>=0);
    T.push({id:'toate',ce:'Fiecare căsuță are deasupra un număr',ok:!goale.length,m:goale.length?`Deasupra căsuței ${goale[0]+1===1?'din stânga':`a ${goale[0]+1}-a de la stânga`} ${p[goale[0]].length>1?'ai scris mai multe numere':'nu ai scris încă nimic'}.`:''});
    const p1=p[0]&&p[0].length===1?p[0][0]:null;
    T.push({id:'primul',ce:'Primul element din stânga e pe poziția 1',ok:p1===1,m:p1===0?'Deasupra primului element ai scris 0. Aici numărăm ca în viața de zi cu zi: primul element e pe poziția 1.':p1==null?'Scrie întâi numărul de deasupra primei căsuțe, din stânga.':`Deasupra primului element ai scris ${p1}. Primul element e pe poziția 1.`});
    let k=-1;for(let i=1;i<n;i++){if(!(p[i].length===1&&p[i-1].length===1&&p[i][0]===p[i-1][0]+1)){k=i;break}}
    const okPas=!goale.length&&p1===1&&k<0;
    T.push({id:'pas',ce:'Pozițiile cresc din 1 în 1, până la ultimul element',ok:okPas,m:okPas?'':goale.length||p1!==1?'Întâi fă să treacă testele de mai sus.':`Deasupra căsuței a ${k+1}-a ai scris ${p[k][0]}, iar înaintea ei e ${p[k-1][0]}: după ${p[k-1][0]} urmează ${p[k-1][0]+1}.`});
  }
  if(Q.mod==='construieste'){
    const v=st.val.map(x=>numere(x)),c=s.map(Number),L=v.length;
    const plin=v.map((x,i)=>x.length===1?x[0]:null);
    let mL='';
    if(L!==n){
      const cap=(Q.capcane||[]).find(k=>plin.some(x=>x===Number(k.valoare))&&!c.includes(Number(k.valoare)));
      if(L>n&&cap)mL=`Șirul tău are ${L} elemente, iar în text sunt ${n}. ${cap.mesaj}`;
      else if(L<n)mL=`Șirul tău are ${L} ${L===1?'element':'elemente'}, iar în text sunt ${n}.${Q.mesajLipsa?' '+Q.mesajLipsa:''}`;
      else mL=`Șirul tău are ${L} elemente, iar în text sunt ${n}: ai o căsuță în plus. Scoate-o cu „− Scoate ultima căsuță”, după ce muți valorile la locul lor.`;
    }
    T.push({id:'lungime',ce:'Șirul are atâtea elemente câte valori de același fel sunt în text',ok:L===n,m:mL});   // numele nu spune câte (ar da răspunsul)
    const rele=v.map((x,i)=>x.length!==1?i:-1).filter(i=>i>=0);
    T.push({id:'numere',ce:'Fiecare căsuță are un singur număr',ok:!rele.length,m:rele.length?`${loc(Q,rele[0]+1,true)} ${v[rele[0]].length?'are mai multe numere':'e goală sau nu are un număr'}.`:''});
    let mO='',okO=L===n&&!rele.length&&plin.every((x,i)=>x===c[i]);
    if(!okO){
      if(L!==n||rele.length)mO='Întâi fă să treacă testele de mai sus.';
      else{const i=plin.findIndex((x,j)=>x!==c[j]);const cap=(Q.capcane||[]).find(k=>Number(k.valoare)===plin[i]&&!c.includes(plin[i]));
        mO=cap?`${loc(Q,i+1,false)} ai scris ${esc(arataNr(plin[i]))}. ${cap.mesaj}`:`${loc(Q,i+1,false)} ai scris ${esc(arataNr(plin[i]))}. Recitește textul și ia valorile una câte una, în ordinea lor.`}
    }
    T.push({id:'ordine',ce:'Elementele sunt valorile din text, în ordinea lor',ok:okO,m:mO});
  }
  if(Q.mod==='marcheaza'){
    const J=jetoane(Q),S=new Set(st.sel),din=J.filter(t=>t.s),lips=din.filter(t=>!S.has(t.i)),afara=J.filter(t=>!t.s&&S.has(t.i));
    let m='';
    if(lips.length){
      if(Q.mesajLipsa&&lips.some(t=>t.n===0))m=Q.mesajLipsa;
      else m=`Șirul tău are ${din.length-lips.length} ${din.length-lips.length===1?'element':'elemente'}; în poveste sunt ${din.length} valori de același fel. Recitește povestea de la început.`;
    }
    T.push({id:'toate',ce:'Ai ales toate valorile șirului',ok:!lips.length,m});
    const mesaje=Q.mesaje||{};
    T.push({id:'doar',ce:'N-ai ales numere care nu fac parte din șir',ok:!afara.length,m:afara.length?(mesaje[String(afara[0].i)]||`Numărul ${esc(arataNr(afara[0].n))} nu e o valoare de același fel cu celelalte.`):''});
  }
  (Q.intrebari||[]).forEach(I=>{
    const pre=Q.mod==='construieste'&&!T.slice(0,3).every(t=>t.ok);
    const r=pre?{ok:false,m:'Întâi construiește șirul (testele de mai sus).'}:verificaIntrebare(Q,I,st.r[I.id]);
    T.push({id:I.id,ce:I.ce,ok:r.ok,m:r.m||''});
  });
  return T;
}

/* ---------- desenul ---------- */
function deseneaza(Q,body,api,st){
  const s=sirul(Q),zona=body.querySelector('.sv-joc'),neg=Q.negative?'text':'numeric',et=Q.etichete||[];
  const poz=Q.pozitiiVizibile!==false;
  let h='';
  if(Q.mod==='atinge'){
    h=`${Q.nume?`<p class="sv-nume">${Q.nume}</p>`:''}<div class="sv-sir" role="group" aria-label="${esc(String(Q.nume||'Șirul').replace(/<[^>]+>/g,''))}">${s.map((v,i)=>
      `<div class="sv-el"><span class="sv-poz${poz?'':' sv-gol'}">${poz?i+1:'·'}</span><button type="button" class="sv-cas" data-p="${i+1}" aria-pressed="${st.ales===i+1}" aria-label="${poz?`poziția ${i+1}: `:''}${esc(v)}">${esc(arataNr(v))}</button>${et.length?`<span class="sv-et">${esc(et[i]||'')}</span>`:''}</div>`).join('')}</div>`;
  }
  if(Q.mod==='pozitii'){
    h=`${Q.nume?`<p class="sv-nume">${Q.nume}</p>`:''}<div class="sv-sir" role="group" aria-label="Șirul, cu casete pentru poziții">${s.map((v,i)=>
      `<div class="sv-el"><input class="sv-in sv-pz" data-i="${i}" inputmode="numeric" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="poziția căsuței ${i+1} de la stânga" value="${esc(st.poz[i]||'')}"><span class="sv-cas">${esc(arataNr(v))}</span>${et.length?`<span class="sv-et">${esc(et[i]||'')}</span>`:''}</div>`).join('')}</div>`;
  }
  if(Q.mod==='raspuns'){
    h=htmlSir(s,{pozitii:poz,etichete:et,nume:Q.nume,indice:Q.indice});
  }
  if(Q.mod==='construieste'){
    h=`${Q.nume?`<p class="sv-nume">${Q.nume}</p>`:''}<div class="sv-sir" role="group" aria-label="Șirul tău">${st.val.map((v,i)=>
      `<div class="sv-el"><span class="sv-poz${poz?'':' sv-gol'}">${poz?i+1:'·'}</span><input class="sv-in" data-i="${i}" inputmode="${neg}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="căsuța ${i+1}" value="${esc(v)}"></div>`).join('')}</div>
      <div class="sv-unelte"><button type="button" class="sv-btn" data-k="plus">+ Adaugă o căsuță</button><button type="button" class="sv-btn" data-k="minus"${st.val.length<=1?' disabled':''}>− Scoate ultima căsuță</button></div>`;
  }
  if(Q.mod==='marcheaza'){
    const J=jetoane(Q),S=new Set(st.sel);let k=0;
    const txt=esc(String(Q.text||'').replace(/\{(-?\d+)(\|s)?\}/g,'\u0001')).replace(/\u0001/g,()=>{const t=J[k++];return `<button type="button" class="sv-nr" data-j="${t.i}" aria-pressed="${S.has(t.i)}">${esc(arataNr(t.n))}</button>`});
    const ales=J.filter(t=>S.has(t.i));
    h=`<p class="sv-poveste">${txt}</p><p class="sv-nume">Șirul tău (numerele alese, în ordinea din poveste):</p>${ales.length?htmlSir(ales.map(t=>t.n),{pozitii:true}):'<p class="sv-al">încă niciun număr ales</p>'}`;
  }
  if(Q.intrebari&&Q.intrebari.length){
    h+=`<div class="sv-intr">${Q.intrebari.map(I=>{
      const c=I.cere||{},val=st.r[I.id]||'';
      if(c.tip==='exista')return `<label data-q="${esc(I.id)}">${I.text}<select data-r="${esc(I.id)}" aria-label="${esc(I.ce)}"><option value="">— alege —</option><option value="da"${val==='da'?' selected':''}>da, există</option><option value="nu"${val==='nu'?' selected':''}>nu, nu există</option></select></label>`;
      return `<label data-q="${esc(I.id)}">${I.text}<input class="sv-r" data-r="${esc(I.id)}" inputmode="${c.tip==='pozitii'?'text':neg}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value="${esc(val)}"></label>`}).join('')}</div>`;
  }
  zona.innerHTML=h;
}
function scrieTeste(Q,body,st){
  const T=evalueaza(Q,st),arata=st.verificat;
  body.querySelector('.sv-teste ol').innerHTML=T.map((t,k)=>`<li data-t="${esc(t.id)}" class="${arata?(t.ok?'ok':'rau'):''}"><span class="s">${arata?(t.ok?'✓':'✗'):'○'}</span><span>${k+1}. ${t.ce}${arata&&!t.ok&&t.m?`<span class="m">${t.m}</span>`:''}</span></li>`).join('');
  if(arata){
    body.querySelectorAll('.sv-intr [data-q]').forEach(l=>{const t=T.find(x=>x.id===l.dataset.q);l.classList.toggle('rau',!!t&&!t.ok)});
  }
  return T;
}
function mesajAcum(Q){
  return {atinge:'Atinge căsuța cerută. Apoi apasă „Verifică”.',pozitii:'Scrie deasupra fiecărei căsuțe poziția ei. Apoi apasă „Verifică”.',
    raspuns:'Scrie răspunsurile în casetele de mai jos. Apoi apasă „Verifică”.',construieste:'Scrie câte un număr în fiecare căsuță, în ordinea din text. Ai nevoie de mai multe căsuțe? Apasă „+ Adaugă o căsuță”.',
    marcheaza:'Atinge în poveste numerele care fac parte din șir. Atinge din nou un număr ca să-l scoți.'}[Q.mod]||'';
}
function porneste(Q,body,api,st){
  stil();
  body._sv={st,Q};
  /* motorul refolosește #body (ghidul, III.1 S4): mânerele stau pe .sv-rad, refăcut la fiecare desen, nu pe #body */
  body.innerHTML=`<div class="sv-rad"><p class="sv-acum" aria-live="polite"></p><div class="sv-joc"></div>
    <div class="sv-unelte"><button type="button" class="sv-btn" data-k="capat">Ia-o de la capăt</button></div>
    <div class="sv-teste"><b>Testele</b> <span class="hint">· se bifează când apeși „Verifică”</span><ol></ol></div></div>`;
  const rad=body.querySelector('.sv-rad'),acum=body.querySelector('.sv-acum');
  const S=()=>body._sv.st;
  const redesen=(focus)=>{deseneaza(Q,body,api,S());scrieTeste(Q,body,S());if(focus){const el=body.querySelector(focus);if(el)el.focus({preventScroll:true})}};
  acum.textContent=mesajAcum(Q);
  redesen();
  const joc=body.querySelector('.sv-joc');
  rad.addEventListener('click',e=>{
    const t=e.target,b=t.closest&&t.closest('button');if(!b||!rad.contains(b))return;
    if(b.dataset.k==='capat'){body._sv.st=stareNoua(Q);acum.textContent=mesajAcum(Q);redesen(Q.mod==='atinge'?'.sv-cas':Q.mod==='marcheaza'?'.sv-nr':'.sv-in, .sv-r, select');return}
    if(api.done())return;
    const s=S();
    if(b.classList.contains('sv-cas')&&b.dataset.p){const p=+b.dataset.p;s.ales=s.ales===p?null:p;redesen(`.sv-cas[data-p="${p}"]`);
      acum.textContent=s.ales?`Ai ales căsuța de pe poziția ${s.ales}. Apasă „Verifică” sau atinge altă căsuță.`:mesajAcum(Q);return}
    if(b.classList.contains('sv-nr')){const j=+b.dataset.j,ix=s.sel.indexOf(j);if(ix>=0)s.sel.splice(ix,1);else s.sel.push(j);redesen(`.sv-nr[data-j="${j}"]`);return}
    if(b.dataset.k==='plus'){s.val.push('');redesen(`.sv-in[data-i="${s.val.length-1}"]`);return}
    if(b.dataset.k==='minus'&&s.val.length>1){s.val.pop();redesen(`.sv-in[data-i="${s.val.length-1}"]`);return}
  });
  joc.addEventListener('input',e=>{
    const t=e.target,s=S();
    if(t.matches('.sv-pz'))s.poz[+t.dataset.i]=t.value;
    else if(t.matches('.sv-in'))s.val[+t.dataset.i]=t.value;
    else if(t.matches('[data-r]'))s.r[t.dataset.r]=t.value;
    else return;
    if(s.verificat)scrieTeste(Q,body,s);   // după prima verificare, testele urmăresc starea de acum
  });
  joc.addEventListener('change',e=>{const t=e.target;if(t.matches('select[data-r]')){S().r[t.dataset.r]=t.value;if(S().verificat)scrieTeste(Q,body,S())}});
  joc.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();acum.textContent='Apasă „Verifică” când ești gata.'}
  });
  const nav=api.checkButton(()=>{
    const s=S();s.verificat=true;
    const T=scrieTeste(Q,body,s),k=T.findIndex(t=>!t.ok);
    if(k<0){nav.innerHTML='';acum.textContent='Toate testele trec.';api.resolve(true);
      setTimeout(()=>{const b=['inca','pas-next','go','next'].map(i=>document.getElementById(i)).find(x=>x&&x.offsetParent!==null&&!x.disabled);if(b)b.focus({preventScroll:true})},0);
      return}
    api.resolve(false,`${T.filter(t=>t.ok).length} din ${T.length} teste trec. ${T[k].m}`);
    api.revealButton(()=>{body._sv.st=stareCorecta(Q);body._sv.st.verificat=true;redesen();nav.innerHTML='';
      api.giveUp(Q.solutieText||'acum se vede răspunsul bun, cu toate testele bifate.')});
    /* regula 14: focusul se întoarce la locul lucrului, pe ce trebuie reparat */
    const t=T[k];let f=null;
    if(Q.intrebari&&Q.intrebari.some(I=>I.id===t.id))f=body.querySelector(`[data-r="${t.id}"]`);
    if(!f)f=Q.mod==='atinge'?body.querySelector('.sv-cas[aria-pressed="true"]')||body.querySelector('.sv-cas')
      :Q.mod==='marcheaza'?body.querySelector('.sv-nr'):body.querySelector('.sv-in, .sv-r, select');
    if(f)f.focus({preventScroll:true});
  });
  return S();
}
window.SirValori={
  render(Q,body,api){porneste(Q,body,api,stareNoua(Q))},
  rezolva(Q,body,api){porneste(Q,body,api,stareCorecta(Q))},
  gresit(Q,body,api){porneste(Q,body,api,stareGresita(Q))},
  html:htmlSir,
  numere,
  _evalueaza:evalueaza,
  _asteptat:asteptat,
  _stare:body=>body&&body._sv?body._sv.st:null
};
})();
