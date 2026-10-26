/* AUTOANALIZA — „Cum am lucrat” (26.10.2026; AI_0\projects\teste-elevi\contracte\2026-10-26_jurnal_autoanaliza, R3, R13).
   Profesorul a cerut o mică autoanaliză în jurnal, pe care elevul s-o vadă: cine trece prin lecții în câteva minute pe
   lecție, sărind pașii, să afle singur asta și să știe ce să reia; aceeași etichetă și în panoul profesorului.
   Regula unei lecții TERMINATE (toate părțile ei din sertar au stele; aprobată de profesor pe 26.10.2026):
     „graba”   ÎN GRABĂ   = ai deschis SUB JUMĂTATE din pașii de învățat, SAU ai sărit Atelierul, SAU (timp numărat) ai lucrat
                            SUB 5 MINUTE;
     „stiai”   ȘTIAI DEJA = ca mai sus, dar din prima ≥ 80% din întrebări ȘI niciun „Arată-mi răspunsul”;
     „bine”               = nimic din cele de mai sus;
     null      nejudecată = lecția fără pași și fără Atelier în date (sertarul vechi {stars, xp}, de dinainte de 01.10.2026):
                            fără prima încercare nu se poate vedea „știai deja”, deci nu judecăm nici după timp.
   Pe pagină (rezumat): „mare” = cel puțin 2 lecții în grabă ȘI cel puțin o treime din cele judecate.
   Modul pur: fără DOM, fără rețea, fără ceas. Îl folosesc jurnalul (LearningHub /jurnal/) și panoul profesorului
   (AI_0\projects\teste-elevi\site\public\autoanaliza.js = COPIE IDENTICĂ a acestui fișier; proba compară octeții).
   Aceeași regulă, scrisă separat în Python, din textul contractului: contracte\2026-10-26_jurnal_autoanaliza\
   autoanaliza_oracol.py (comparația pe tabelul de cazuri). Cine schimbă regula le schimbă pe amândouă și reface proba.
   Intrarea nivelului (motor.js, „CE FACE ELEVUL PE NIVEL”): ps/pn pașii deschiși / câți are, at 0 = Atelier nedeschis,
   p1 {b, t, c} prima încercare, ara „Arată-mi răspunsul”, ind indicii, sec secunde lucrate, t1 ultima atingere. */
(function(radacina){
"use strict";
var PRAG_PASI=0.5,PRAG_SEC=300,PRAG_STIE=0.8,MAX_PASI=60,MAX_NIV=200;
function nr(x){return typeof x==="number"&&isFinite(x)&&x>=0?x:0}
function p1Bun(p){return !!p&&typeof p==="object"&&typeof p.b==="number"&&typeof p.t==="number"&&p.t>0}

/* lv: nivelurile UNEI lecții, {"0": intrare, "1": …} (indicele de la 0, ca în sertar); sec: secundele de pe pagina lecției
   (toate aparatele); fără ele (0), suma secundelor de pe niveluri. Pagina întreabă pentru lecțiile ei „făcute”; aici se
   judecă doar dacă și sertarul o arată terminată (fiecare parte din el cu stele), ca jurnalul și panoul să judece la fel
   aceleași date (jurnalul socotește „făcută” și lecția veche cu notă, panoul nu). Întoarce {fel, sarPasi, sarAtelier, rapid
   (ce a făcut-o „în grabă”, de folosit în text: pragurile stau doar aici), pasi:{v,din}|null, atelier:{sarit, din}|null,
   sec, p1:{b,t}|null, ara, ind, reia:{ni, pas:"p3"|"atelier"}|null, cand (ms, când a terminat: prima verificare, altfel
   ultima atingere)}. */
function lectie(lv,sec){
  var chei=Object.keys(lv||{}).filter(function(k){return /^\d+$/.test(k)&&+k<MAX_NIV&&lv[k]&&typeof lv[k]==="object"})
    .map(Number).sort(function(a,b){return a-b});
  var gata=chei.length>0&&chei.every(function(i){return nr(lv[i].stars)>0});
  var v=0,din=0,arePasi=false,atDin=0,atS=0,b=0,t=0,ara=0,ind=0,secN=0,cand=0,reiaPas=null,reiaAt=null;
  chei.forEach(function(i){var l=lv[i],pn=+l.pn;
    if(pn>0&&pn<=MAX_PASI&&Array.isArray(l.ps)){arePasi=true;din+=pn;
      var ps={},n=0;l.ps.forEach(function(x){if(typeof x==="number"&&x%1===0&&x>=0&&x<pn&&!ps[x]){ps[x]=1;n++}});v+=n;
      if(!reiaPas)for(var k=0;k<pn;k++)if(!ps[k]){reiaPas={ni:i,pas:"p"+(k+1)};break}}
    if(l.at===0||l.at===1){atDin++;if(l.at===0){atS++;if(!reiaAt)reiaAt={ni:i,pas:"atelier"}}}
    if(p1Bun(l.p1)){b+=nr(l.p1.b);t+=nr(l.p1.t)}
    ara+=nr(l.ara);ind+=nr(l.ind);secN+=nr(l.sec);
    cand=Math.max(cand,p1Bun(l.p1)&&nr(l.p1.c)?nr(l.p1.c):nr(l.t1));
  });
  var s=nr(sec)||secN,o={fel:null,sarPasi:false,sarAtelier:false,rapid:false,pasi:arePasi?{v:v,din:din}:null,
    atelier:atDin?{sarit:atS,din:atDin}:null,sec:s,p1:t?{b:b,t:t}:null,ara:ara,ind:ind,reia:null,cand:cand};
  if(!gata)return o;                // o parte din sertar fără stele: neterminată aici, nimic de judecat
  if(!arePasi&&!atDin)return o;     // sertarul vechi: nimic de judecat
  o.sarPasi=arePasi&&v/din<PRAG_PASI;o.sarAtelier=atS>0;o.rapid=s>0&&s<PRAG_SEC;
  var sarit=o.sarPasi||o.sarAtelier,rapid=o.rapid,stie=t>0&&b/t>=PRAG_STIE&&ara===0;
  o.fel=sarit||rapid?(stie?"stiai":"graba"):"bine";
  if(o.fel==="graba")o.reia=reiaPas&&arePasi&&v<din?reiaPas:reiaAt;   // primul pas sărit, altfel Atelierul; doar timpul = de la început
  return o;
}

/* L: lecțiile JUDECATE ale elevului, [{…ce vrea pagina (titlu, url, cheie), a: lectie(…)}], în ordinea lor.
   zi(ms) -> "AAAA-LL-ZZ" (ziua în ora României, a paginii). Întoarce {n, graba, stiai, bine, mare, g:{…sumele pe lecțiile
   în grabă}, reia: cel mult 3 lecții în grabă (prima încercare cea mai slabă întâi), zi:{zi, n} ziua cu cele mai multe
   lecții terminate (cel puțin 3; la egalitate, cea mai nouă) sau null}. */
function rezumat(L,zi){
  L=(L||[]).filter(function(x){return x&&x.a&&x.a.fel});
  var G=L.filter(function(x){return x.a.fel==="graba"}),S=L.filter(function(x){return x.a.fel==="stiai"}),
    B=L.filter(function(x){return x.a.fel==="bine"});
  var g={nSec:0,sec:0,v:0,din:0,atS:0,atDin:0,b:0,t:0,ara:0};
  G.forEach(function(x){var a=x.a;if(a.sec>0){g.nSec++;g.sec+=a.sec}
    if(a.pasi){g.v+=a.pasi.v;g.din+=a.pasi.din}
    if(a.atelier){g.atS+=a.atelier.sarit>0?1:0;g.atDin++}
    if(a.p1){g.b+=a.p1.b;g.t+=a.p1.t}g.ara+=a.ara});
  var cot=function(x){return x.a.p1?x.a.p1.b/x.a.p1.t:1};
  var reia=G.map(function(x,i){return {x:x,i:i}}).sort(function(p,q){return cot(p.x)-cot(q.x)||q.x.a.ara-p.x.a.ara||p.i-q.i})
    .slice(0,3).map(function(p){return p.x});
  var pe={},best=null;
  if(typeof zi==="function")L.forEach(function(x){if(!x.a.cand)return;var z=zi(x.a.cand);pe[z]=(pe[z]||0)+1});
  Object.keys(pe).forEach(function(z){if(pe[z]>=3&&(!best||pe[z]>best.n||(pe[z]===best.n&&z>best.zi)))best={zi:z,n:pe[z]}});
  return {n:L.length,graba:G,stiai:S,bine:B,mare:G.length>=2&&3*G.length>=L.length,g:g,reia:reia,zi:best};
}

var A={lectie:lectie,rezumat:rezumat,PRAG_PASI:PRAG_PASI,PRAG_SEC:PRAG_SEC,PRAG_STIE:PRAG_STIE};
if(typeof module==="object"&&module.exports)module.exports=A;else radacina.Autoanaliza=A;
})(typeof window!=="undefined"?window:this);
