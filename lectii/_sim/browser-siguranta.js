/* Extensia „browser-siguranta” pentru lecțiile LearningHub — fișier comun (lectii/_sim/browser-siguranta.js).
   PROPRIETAR: autorul lecției V · M3 · nr. 16 („Siguranța pe Internet: pericole, reguli, credibilitatea surselor”), 19.10.2026.
   Extensie NOUĂ peste lectii/_sim/browser-web.js (V/14), prin API-ul lui public BrowserWeb.creeaza({site, extensii}).
   browser-web.js NU e modificat; paginile lui (BrowserWeb.SITE) rămân neatinse. Lumea de aici e INVENTATĂ (site-uri …-exemplu.ro),
   locală: nimic nu pleacă spre Internet, nimic nu se descarcă.

   Folosire în pagină (după motor.js):
     <script src="../../_sim/browser-web.js"></script>
     <script src="../../_sim/browser-siguranta.js"></script>
     JocMotor.porneste({ …, tipuri:{browserSigur:SimBrowserSiguranta} })

   CE ADAUGĂ (câmpuri noi ale unei pagini din `site`; cele vechi — titlu, site, text, link, cuv, reclama, ascunsa — merg ca în browser-web):
     autor:'dr. Ana Munteanu, …'   data:'3 februarie 2026'   dataN:[3,2,2026]   cheiAutor:['munteanu','muzeu*']
         → sub titlu apare rândul „Scris de … · data”; fără autor/dată pagina nu are rândul (cum sunt multe pagini adevărate).
         cheiAutor (versiunea 2, 19.10.2026, judecata 1 m6 + J7): fiecare cheie se caută ca CUVÂNT ÎNTREG (fără diacritice,
         fără majuscule): „pop” NU mai trece în „Popescu”; cu „*” la sfârșit, ca ÎNCEPUT de cuvânt („muzeu*” = muzeu, muzeul,
         muzeului; „parcul natural*”). Instituția paginii (muzeul, parcul, grădina, enciclopedia) e și ea un răspuns bun la
         „Cine a scris?” (pasul 4 al lecției 16: „Un om cu nume, un muzeu, o enciclopedie?”), deci are cheia ei.
     sursaInfo:'…'                 → un rând mic, jos: de unde știe autorul (întrebarea „De unde știe?” a lecției 16).
     popup:{titlu, text, buton}    → o FEREASTRĂ FALSĂ desenată în pagină (cu un „✕” desenat în colț și butonul ei). Tot ce apeși
                                     în ea e o „capcană”: se numără, iar pagina spune pe ecran ce s-ar fi putut întâmpla.
     butonFals:'DESCARCĂ JOCUL'    → o reclamă care arată ca un buton (capcană).
     vinde:'Comandă acum, -50%!'   → reclama ascunsă într-un „articol”: butonul de la sfârșit (capcană).
     falsa:true                    → pagina-capcană (cu popup): dacă îi închizi FILA cu × de sus, se numără „închisă corect”.
     lectie:true                   → fila lecției (testul filaLectiei). × pe fila ei: mesaj roșu pe ecran („Ai închis fila lecției…”)
                                     și S.lectieInchisa=true (browser-web.js arată atunci nota și la fereastra închisă) — v2, judecata 1 m7.
   FIDELITATE (ce e adevărat, ce e abatere):
     - procedura e cea a lecției VI/11 („Fereastra care te sperie: o închizi”): nu apeși nimic în fereastra falsă, nici „✕”
       desenat în ea; închizi FILA de sus cu × (butonul „Închideți fila” al browserului din browser-web.js, ca în Edge);
     - Microsoft (support.microsoft.com/ro-ro/office/protect-yourself-from-tech-support-scams): ferestrele false pot acoperi
       tot ecranul și pot reapărea; „Mesajele de eroare și de avertizare de la Microsoft nu includ niciodată numere de telefon”;
     - ABATERE, spusă pe ecran la prima capcană: aici nu se descarcă nimic și nu pleacă nimic; pe Internet, de acolo putea porni
       o descărcare sau o pagină care îți cere datele.
   TESTE NOI (checks:[{k,…}]):
     faraCapcane             — n-ai apăsat nimic într-o fereastră falsă / reclamă-buton / „Comandă acum” ȘI ai închis cu ×
                               fila unei pagini-capcană (altfel testul ar fi bifat de la pornire, fără să fi făcut nimic).
                               Mesajul se ia de la PRIMUL test nebifat (browser-web.js), deci în exerciții pune-l DUPĂ
                               filaLectiei și inchisaFalsa: altfel „Verifică” fără gest spune „Ai apăsat în pagina falsă” (judecata 1, M1);
     inchisaFalsa            — ai închis cu × FILA unei pagini-capcană (falsa:true);
     filaLectiei             — o filă arată încă lecția (pagina cu lectie:true);
     vazut{a}                — pagina (sau una din listă) a fost pe ecran în exercițiul acesta, chiar dacă elevul s-a întors
                               cu ← și a mers apoi în altă parte (browser-web scoate atunci pagina din istoric; testul „vizitat” n-ar
                               mai găsi-o) — sau e încă în istoricul unei file;
     fisa{parte:'autor'|'data'|'ambele', a?:[adrese]} — în caseta `raspuns` (din browser-web) ai scris autorul și/sau data
                               paginii DESCHISE ACUM (dacă dai `a`, pagina deschisă trebuie să fie una din ele).
                               Data se acceptă „3 februarie 2026”, „3 feb. 2026”, „03.02.2026”, „3.2.2026”, „3/2/2026”.
   OPERAȚII NOI (sol / gresit): ['capcana'] (apasă în fereastra falsă) · ['inchideFalsa'] (închide cu × fila paginii-capcană).
   PENTRU LECȚIA URMĂTOARE: window.BrowserSiguranta = {versiune, SITE, creeaza(site), potrivesteData, potrivesteAutor};
     BrowserSiguranta.creeaza({…pagini noi…}) dă un tip nou cu aceleași teste, peste lumea de aici. NU schimba numele testelor,
     procedura (× pe filă) și paginile de aici (lecția 16 se sprijină pe textele, autorii și datele lor). */
(function(){
'use strict';
if(!window.BrowserWeb){console.error('browser-siguranta.js: lipsește browser-web.js (se încarcă înainte).');return}
const CSS=`
.bs-meta{font-size:.84rem;color:var(--ink2);margin:-.2em 0 .5em}
.bs-meta b{color:var(--ink)}
.bs-sursa{font-size:.8rem;color:var(--ink2);border-top:1px dashed var(--line);margin-top:.7em;padding-top:.4em}
.bs-pop{position:relative;margin:2px 0 12px;border:3px solid #C8102E;border-radius:10px;background:#FFF4D6;color:#1B1B1B;padding:12px 44px 12px 14px;box-shadow:0 6px 18px rgba(0,0,0,.28)}
.bs-pop h4{margin:0 0 .3em;font-size:1.08rem;color:#B00020}
.bs-pop p{margin:.2em 0 .6em}
.bs-pop .bs-px{position:absolute;top:6px;right:6px;width:32px;height:32px;border:1px solid #999;border-radius:6px;background:#fff;color:#333;font-size:1rem;line-height:1;cursor:pointer}
.bs-pop .bs-pb{border:0;border-radius:8px;background:#C8102E;color:#fff;font:inherit;font-weight:800;padding:8px 18px;min-height:36px;cursor:pointer}
.bs-fals{display:inline-block;border:0;border-radius:10px;background:#1DB954;color:#fff;font:inherit;font-size:1.05rem;font-weight:800;padding:10px 20px;min-height:40px;margin:.4em 0;cursor:pointer;box-shadow:0 3px 0 #127a37}
.bs-vinde{display:inline-block;border:0;border-radius:8px;background:#F08C00;color:#1B1B1B;font:inherit;font-weight:800;padding:8px 16px;min-height:36px;margin:.3em 0;cursor:pointer}
`;
function css(){if(document.getElementById('bs-css'))return;const s=document.createElement('style');s.id='bs-css';s.textContent=CSS;document.head.appendChild(s)}
const N=s=>String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const LUNI=['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'];
/* data scrisă de elev, în oricare formă obișnuită; [zi, lună, an] căutat în text */
function potrivesteData(text,dn){
  if(!dn)return false;const [z,l,a]=dn,t=N(text);
  const num=new RegExp('(^| )0?'+z+' 0?'+l+' '+a+'( |$)');               // 03.02.2026, 3.2.2026, 3/2/2026, 03 02 2026
  if(num.test(t))return true;
  const lu=LUNI[l-1],pref=lu.slice(0,3);
  const cuv=new RegExp('(^| )0?'+z+' '+pref+'[a-z]* '+a+'( |$)');      // 3 februarie 2026, 3 feb 2026
  return cuv.test(t);
}
/* autorul: fiecare cheie = cuvânt(e) ÎNTREG(i); „*” la sfârșit = început de cuvânt (v2, judecata 1 m6: „pop” trecea în „Popescu”) */
function potrivesteAutor(text,chei){const t=' '+N(text)+' ';
  return (chei||[]).some(k=>{const s=String(k),pref=s.endsWith('*'),c=N(pref?s.slice(0,-1):s);return !!c&&t.includes(' '+c+(pref?'':' '))})}

const LECTIE16='learninghub-8z6.pages.dev/lectii/v/m3-l16';
/* lumea lecției 16 (inventată). Tema atelierului: unde pleacă barza albă iarna (fapt: iernează în Africa — surse.md). */
const CUV_BARZA='barza berze berzele alba albe iarna iarnă ierneaza pleaca africa pasare pasari';
const SITE=Object.freeze({
 [LECTIE16]:{titlu:'Lecția 16 · LearningHub',site:'LearningHub',ascunsa:true,lectie:true,
  text:['Aici e lecția ta. Ca s-o păstrezi deschisă, lucrezi într-o filă nouă: apasă +, sus, lângă file.']},
 'www.muzeu-exemplu.ro/barza-alba':{titlu:'Barza albă: unde pleacă iarna',site:'Muzeul de Științe Naturale Exemplu',
  autor:'dr. Ana Munteanu, cercetătoare a păsărilor',data:'3 februarie 2026',dataN:[3,2,2026],cheiAutor:['munteanu','muzeu*'],
  text:['Barza albă stă la noi din martie până la sfârșitul verii. Toamna pleacă în Africa, unde e cald și găsește hrană. Primăvara se întoarce, de obicei la același cuib.'],
  sursaInfo:'De unde știm: din numărătorile făcute în fiecare an de cercetătorii muzeului.',credibila:true,cuv:CUV_BARZA+' muzeu cuib'},
 'www.enciclopedie-exemplu.ro/barza':{titlu:'Barza albă, pasărea călătoare',site:'Enciclopedia Exemplu',
  autor:'echipa Enciclopediei Exemplu',data:'10 decembrie 2025',dataN:[10,12,2025],cheiAutor:['enciclopedi*','echipa'],
  text:['Barza albă este o pasăre mare, cu pene albe, aripi negre și cioc roșu.','Este o pasăre călătoare: iarna zboară în Africa, iar primăvara se întoarce în Europa.'],
  sursaInfo:'Surse: cărțile de păsări ale muzeelor și atlasul păsărilor.',credibila:true,cuv:CUV_BARZA+' enciclopedie cioc'},
 'www.super-stiri-exemplu.ro/berze-blocuri':{titlu:'INCREDIBIL!!! Berzele nu mai pleacă iarna, dorm în blocuri!',site:'Super Știri Exemplu',
  text:['Nu o să crezi!!! Berzele au învățat să stea iarna în scările blocurilor. Vezi pozele ȘOCANTE mai jos!!!'],falsa:true,
  popup:{titlu:'Ești norocos! Ai câștigat o minge cu autograf!',text:'Ești vizitatorul cu numărul 1.000.000! Apasă OK în 30 de secunde ca să-ți primești premiul.',buton:'OK'},
  cuv:CUV_BARZA+' blocuri incredibil'},
 'www.binocluri-exemplu.ro/totul-despre-berze':{titlu:'Tot ce trebuie să știi despre berze',site:'Binocluri Exemplu',
  text:['Berzele sunt păsări mari și frumoase. Iarna sunt greu de văzut.','Ca să vezi orice barză de aproape, îți trebuie binoclul Super Zoom! Doar azi, la jumătate de preț.'],
  vinde:'Comandă acum, -50%!',cuv:CUV_BARZA+' despre tot binoclu'},
 'www.forum-exemplu.ro/berze-iarna':{titlu:'unde dorm berzele iarna???',site:'Forum Exemplu',
  text:['am auzit ca berzele se ingroapa iarna in noroi si dorm pana la primavara. mi-a zis cineva, nu mai stiu cine'],cuv:CUV_BARZA+' dorm unde forum'},
 'www.magazin-exemplu.ro/barza-plus':{titlu:'Barză de pluș – reducere 40%! Cumpără acum',site:'Magazin Exemplu',reclama:true,
  text:['Barza de pluș, cadoul perfect pentru iarnă.'],cuv:'barza berze alba plus jucarie iarna'},
 /* pagini-capcană pentru exerciții (nu apar la căutare) */
 'www.jocuri-gratis-exemplu.ro':{titlu:'Jocuri GRATIS – monede nelimitate',site:'Jocuri Gratis Exemplu',ascunsa:true,falsa:true,
  text:['Cele mai tari jocuri, toate gratis! Alege unul.'],butonFals:'DESCARCĂ JOCUL',
  popup:{titlu:'ATENȚIE! Calculatorul tău are 5 viruși!',text:'Fișierele tale se vor șterge în 2 minute. Apasă REPARĂ ACUM sau sună imediat la 07xx xxx xxx.',buton:'REPARĂ ACUM'}},
 'www.desene-exemplu.ro/colorat':{titlu:'Desene de colorat',site:'Desene Exemplu',ascunsa:true,falsa:true,
  text:['Alege un desen și colorează-l.'],
  popup:{titlu:'Ai câștigat 1000 de monede!',text:'Scrie numele tău și adresa de acasă ca să primești monedele. Apasă PRIMEȘTE.',buton:'PRIMEȘTE'}},
 /* pagini pentru „Cine a scris? Când?” */
 'www.parc-exemplu.ro/veverita':{titlu:'Veverița, vecina din pădurea parcului',site:'Parcul Natural Exemplu',
  autor:'Mihai Pop, pădurar',data:'12 septembrie 2026',dataN:[12,9,2026],cheiAutor:['pop','parcul natural*'],
  text:['Veverița roșcată trăiește în copaci. Toamna ascunde alune și ghinde, ca să aibă ce mânca iarna.'],
  sursaInfo:'De unde știm: pădurarii parcului numără veverițele în fiecare toamnă.',credibila:true,cuv:'veverita veverite parc alune ghinde'},
 'www.gradina-botanica-exemplu.ro/ghiocelul':{titlu:'Ghiocelul, prima floare a primăverii',site:'Grădina Botanică Exemplu',
  autor:'Elena Dinu, botanistă',data:'2 martie 2026',dataN:[2,3,2026],cheiAutor:['dinu','gradina botanic*'],
  text:['Ghiocelul înflorește la sfârșitul iernii, uneori chiar prin zăpadă. Florile lui albe atârnă ca niște clopoței.'],
  sursaInfo:'De unde știm: din observațiile botaniștilor grădinii, în fiecare primăvară.',credibila:true,cuv:'ghiocel ghiocelul floare primavara inflorire'},
 'www.forum-exemplu.ro/ghiocei':{titlu:'ghioceii inflorsc vara??',site:'Forum Exemplu',
  text:['eu cred ca ghioceii inflorsc vara, in iulie, cand e cald. asa am vazut intr-un film'],cuv:'ghiocel ghiocei floare vara forum'}
});

function seteazaCapcana(S,ce){S.capcane=(S.capcane||0)+1;
  const a=cur(S);if(a)(S.capcanePe=S.capcanePe||{})[a]=1;   /* judecata 2, R: ține minte pe ce pagină s-a apăsat */
  S.msg='<b>Capcană!</b> Ai apăsat '+ce+'. Pe Internet, de aici putea porni o descărcare sau o pagină care îți cere datele. Aici, în browserul din pagină, nu s-a întâmplat nimic. Ce faci corect: nu apeși nimic în ea și închizi <b>fila</b>, sus, cu × de pe ea. Apoi spui unui adult.';
  S.rau=true}
function inchideFila(S,i){/* aceeași regulă ca browser-web.js (inchide): × pe filă; ultima filă închide fereastra */
  if(!S.tabs[i])return;S.tabs.splice(i,1);S.inchise++;
  if(!S.tabs.length){S.inchisa=true;S.act=-1}else if(S.act>=S.tabs.length)S.act=S.tabs.length-1;else if(i<S.act)S.act--}
const cur=S=>{const t=S.tabs[S.act];return t?t.h[t.p]:null};

function ext(){return {
  pagina(h,ctx){
    css();
    const p=ctx.pagina,esc=ctx.esc;if(!p)return h;
    (ctx.S.vazute=ctx.S.vazute||new Set()).add(ctx.adresa);   /* testul „vazut”: pagina a fost pe ecran (chiar dacă a ieșit din istoric) */
    if(p.autor||p.data){
      const meta=`<p class="bs-meta">${p.autor?'Scris de <b>'+esc(p.autor)+'</b>':''}${p.autor&&p.data?' · ':''}${p.data?esc(p.data):''}</p>`;
      h=h.replace('</h3>','</h3>'+meta);
    }
    if(p.butonFals)h+=`<p><button type="button" class="bs-fals" data-act="bs-capcana" data-v="buton">${esc(p.butonFals)}</button></p>`;
    if(p.vinde)h+=`<p><button type="button" class="bs-vinde" data-act="bs-capcana" data-v="vinde">${esc(p.vinde)}</button></p>`;
    if(p.sursaInfo)h+=`<p class="bs-sursa">${esc(p.sursaInfo)}</p>`;
    if(p.popup){
      const q=p.popup;
      h=`<div class="bs-pop" role="dialog" aria-label="${esc(q.titlu)}"><button type="button" class="bs-px" data-act="bs-capcana" data-v="x" aria-label="✕ desenat în fereastra falsă">✕</button>
        <h4>${esc(q.titlu)}</h4><p>${esc(q.text)}</p><button type="button" class="bs-pb" data-act="bs-capcana" data-v="buton">${esc(q.buton)}</button></div>`+h;
    }
    return h;
  },
  actiune(a,v,ctx){
    const S=ctx.S;
    if(a==='bs-capcana'){seteazaCapcana(S,v==='x'?'pe ✕ desenat în fereastra falsă: și el e al paginii false':v==='vinde'?'pe butonul care te trimite să cumperi':'în fereastra sau pe butonul paginii false');return true}
    if(a==='close'){const t=S.tabs[+v];const adr=t?t.h[t.p]:null;const p=adr&&S.W[adr];if(p&&p.falsa){S.inchiseFalse=(S.inchiseFalse||0)+1;
      /* judecata 2, R: mesajul verde doar dacă chiar nu s-a apăsat nimic (altfel contrazice „Capcană!” și „Verifică”) */
      if(S.capcanePe&&S.capcanePe[adr]){S.msg='Ai închis fila paginii false, dar înainte ai apăsat în ea. Data viitoare nu apeși nimic în ea, doar îi închizi fila. Acum apasă „Ia-o de la capăt”.';S.rau=true}
      else if(S.capcane>0){S.msg='Ai închis fila paginii false fără să apeși nimic în ea. Dar mai devreme ai apăsat într-o capcană, așa că apasă „Ia-o de la capăt”.';S.rau=true}
      else{S.msg='Ai închis fila paginii false, fără să apeși nimic în ea. Așa faci și în browserul adevărat; apoi îi spui unui adult.';S.rau=false}}
      /* v2 (judecata 1, m7): fila lecției 16 are nota ei, ca fila lecției 14 în browser-web.js */
      else if(p&&p.lectie){S.lectieInchisa=true;
      S.msg='Ai închis fila lecției. În browserul tău adevărat, lecția s-ar fi închis. Apasă „Ia-o de la capăt”: lecția rămâne în fila ei, iar tu lucrezi în file noi.';S.rau=true}}
    return false;   /* „close” merge mai departe, la browser-web.js */
  },
  verifica(c,ctx){
    const S=ctx.S;
    switch(c.k){
      case 'faraCapcane':return !(S.capcane>0)&&(S.inchiseFalse||0)>0;   /* nu se bifează „din oficiu” la pornire */
      case 'inchisaFalsa':return (S.inchiseFalse||0)>0;
      case 'filaLectiei':return !S.inchisa&&S.tabs.some(t=>{const p=S.W[t.h[t.p]];return p&&p.lectie});
      case 'vazut':{const a=[].concat(c.a);return a.some(x=>S.vazute&&S.vazute.has(x))||S.tabs.some(t=>t.h.some(x=>a.includes(x)))}
      case 'fisa':{
        if(S.inchisa)return false;const a=cur(S),p=S.W[a];if(!p||!(p.autor||p.data))return false;
        if(c.a&&![].concat(c.a).includes(a))return false;
        const r=S.rasp||'',parte=c.parte||'ambele';
        const okA=potrivesteAutor(r,p.cheiAutor),okD=potrivesteData(r,p.dataN);
        return parte==='autor'?okA:parte==='data'?okD:(okA&&okD);
      }
    }
    return null;
  },
  op(o,ctx){
    const S=ctx.S,[k]=o;
    if(k==='capcana'){seteazaCapcana(S,'în fereastra falsă');return true}
    if(k==='inchideFalsa'){const i=S.tabs.findIndex(t=>{const p=S.W[t.h[t.p]];return p&&p.falsa});if(i>=0){S.inchiseFalse=(S.inchiseFalse||0)+1;inchideFila(S,i)}return true}
    return false;
  }
}}

function creeaza(site){return BrowserWeb.creeaza({site:Object.assign({},SITE,site||{}),extensii:[ext()]})}
const SimBrowserSiguranta=creeaza();
window.SimBrowserSiguranta=SimBrowserSiguranta;
window.BrowserSiguranta={versiune:2,SITE,LECTIE16,creeaza,potrivesteData,potrivesteAutor};
})();
