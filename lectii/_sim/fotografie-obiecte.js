/* Extensia „fotografie-obiecte” a simulatorului comun „fotografie” (lectii/_sim/fotografie.js), modul CATEGORII.
   AUTOR: lecția V · M1 · nr. 3 (27-28.09.2026). NU modifică fotografie.js (are proprietar); îl folosește așa cum e.

   De ce: în modul CATEGORII, mesajele simulatorului spun „dispozitiv” („Atinge pe fotografie un dispozitiv din lista
   testelor”). Cuvântul „dispozitive” se predă abia la lecția V/5, cu un sens anume: „aparatele legate de unitatea
   centrală”. La lecția 3 elevul sortează obiecte obișnuite (o bicicletă, o carte, un cuptor), deci pagina trebuie să
   spună „obiect”. Extensia schimbă DOAR cuvântul, în mesajele simulatorului; restul (testele, zonele, verificarea,
   „Arată-mi răspunsul”, poarta) rămâne al simulatorului comun.

   Folosire (după motor.js și fotografie.js):
     <script src="../../_sim/fotografie.js"></script>
     <script src="../../_sim/fotografie-obiecte.js"></script>
     JocMotor.porneste({ …, tipuri:{fotografie:SimFotografieObiecte} })   // atelier:{t:'fotografie', categorii:[…], obiecte:[…], …}
   Același Q ca la SimFotografie (vezi antetul din fotografie.js). */
(function(){
'use strict';
const obiect=s=>typeof s!=='string'?s:s
  .replace(/Dispozitivele/g,'Obiectele').replace(/dispozitivele/g,'obiectele')
  .replace(/Dispozitivul/g,'Obiectul').replace(/dispozitivul/g,'obiectul')
  .replace(/Dispozitive/g,'Obiecte').replace(/dispozitive/g,'obiecte')
  .replace(/Dispozitiv/g,'Obiect').replace(/dispozitiv/g,'obiect');
window.SimFotografieObiecte={
  render(Q,body,api){
    const api2=Object.assign({},api,{
      resolve:(ok,m)=>api.resolve(ok,obiect(m)),
      giveUp:m=>api.giveUp(obiect(m))
    });
    window.SimFotografie.render(Q,body,api2);
    const acum=body.querySelector('.foto-acum');
    if(!acum)return;
    const repara=()=>{const h=acum.innerHTML,n=obiect(h);if(n!==h)acum.innerHTML=n};
    repara();
    new MutationObserver(repara).observe(acum,{childList:true,characterData:true,subtree:true});
  },
  rezolva(Q,body,api){window.SimFotografie.rezolva(Q,body,api)},
  gresit(Q,body,api){window.SimFotografie.gresit(Q,body,api)}
};
})();
