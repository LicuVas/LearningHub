/* Simulatorul „browser-salvare” pentru lecțiile LearningHub — fișier comun (lectii/_sim/browser-salvare.js).
   PROPRIETAR: autorul lecției V · M2 · nr. 15 („Salvarea informațiilor de pe Internet. Drepturile de autor”), 11.10.2026.
   EXTENSIE a lui browser-web.js (lecția V/14), prin API-ul lui public: BrowserWeb.creeaza({site, extensii:[ext]}).
   NU modifică browser-web.js și nici paginile lui: are paginile lui, cu adrese noi.

   Folosire (după motor.js și browser-web.js):
     <script src="../../_sim/browser-web.js"></script><script src="../../_sim/browser-salvare.js"></script>
     JocMotor.porneste({ …, tipuri:{browserSalvare:SimBrowserSalvare} })

   CE E ADEVĂRAT AICI (probat în Microsoft Edge 155, Windows 11 în română, pe desktopul ascuns; lectii/v/m2-l15/_proba/edge_salvare_*.json):
   - clic dreapta pe o imagine → meniul: Deschideți imaginea într-o filă nouă · Salvați imaginea ca · Copiere imagine · Copiați linkul
     imaginii · Căutare vizuală · Captură de ecran · Mai multe instrumente · Trimiteți către dispozitivul dvs. · Inspectare;
   - „Salvați imaginea ca” → fereastra Windows „Salvare ca”; prima dată pornește în „Descărcări”; sus, bara de adresă („› Descărcări”);
     „Nume fișier:” = numele imaginii de pe site, deja selectat; butoanele „Salvare” și „Anulare”; a doua oară pornește în ULTIMUL
     folder folosit;
   - după salvare, Edge arată panoul „Descărcări”, cu numele fișierului și legătura „Deschideți fișierul”;
   - un fișier cu același nume: „Confirmare Salvare ca” — „<nume> există deja. Îl înlocuiți?” — Da / Nu (focusul pe Nu);
   - în fereastra Salvare ca, un clic pe un fișier din listă îi pune numele în „Nume fișier” (văzut în probă);
   - textul selectat → clic dreapta → „Copiere  Ctrl+C”.
   Fereastra „Salvare ca” (dialogul comun Windows, același la Edge și la Notepad), probată 12.10.2026 pe desktopul ascuns, într-un
   dosar de probă (lectii/v/m2-l15/_proba/j1r_dialog_nume.json): la deschidere numele propus e selectat ÎNTREG (tastatul îl
   înlocuiește); numele scris rămâne când intri cu dublu-clic într-un folder; UN clic pe un folder schimbă butonul „Salvare” în
   „Deschidere”, iar butonul acela intră în folder (nu salvează) și selectează din nou numele; un clic pe un fișier îi pune numele
   în „Nume fișier”; „<nume> există deja. Îl înlocuiți?” Da / Nu, iar după Nu numele e din nou selectat întreg;
   „Calea nu există. / Verificați calea și încercați din nou.” și „Numele de fișier nu este valid.” (comdlg32.dll.mui, ro-RO).
   FOCUSUL (repararea J1-1, 12.10.2026): numele se selectează DOAR când fereastra se deschide, după „Nu” și după „Deschidere”;
   după un clic în panoul din stânga sau în listă, focusul rămâne pe ce ai apăsat (ca în Windows: tastele nu mai merg în nume).
   Notepad (probat de lecția VIII/14 pe Notepad-ul real, lectii/viii/m2-l14/surse.md): filele, „Fără titlu”, punctul = nesalvat,
   Fișier › Salvați (Ctrl+S) / Salvați ca (Ctrl+Shift+S) / Închideți fila; prima salvare deschide „Salvare ca”, cu numele propus =
   primul rând + .txt; un nume fără extensie primește .txt; „Salvare cu tipul: Documente text (*.txt)”.
   ABATERI, spuse pe ecran: o fereastră „Salvare ca” mică (în stânga doar Desktop, Descărcări, Documente, Imagini); pe telefon,
   în locul clicului dreapta, butonul „⋮ Meniul imaginii” de sub imagine (sau ții degetul apăsat pe imagine); din meniu merge doar
   „Salvați imaginea ca”; în pagină, Ctrl+S salvează doar în Notepad-ul de mai jos; Notepad-ul e mic (o filă, fără bara de stare);
   fereastra „Salvare ca” a Notepad-ului pornește aici în Documente (pe calculator poate porni în alt folder: te uiți sus).
   NESIGUR (neprobat): un nume de imagine scris fără extensie primește .jpg; dacă, după UN clic pe un folder, dai clic în „Nume
   fișier”, butonul redevine „Salvare” (aici da); o cale întreagă (C:\…) scrisă la nume (aici: mesaj, fereastra din pagină nu le
   primește — abatere spusă pe ecran); o cale relativă (Ex Pop Ana\lup) merge, una care nu există dă „Calea nu există.”.

   TIPUL browserSalvare — Q: ca la tipul browser al lui browser-web.js (start, activa, site, checks, sol, gresit, ghilimele…), plus:
     folderElev?: 'Ex Pop Ana' (folderul elevului din Documente; implicit Ex Pop Ana)
     fs?: [['Descărcări','arici.jpg'], ['Documente/Ex Pop Ana','tema.txt'], ['Documente/Ex Ionescu Dan/']]  (fișiere/foldere în plus)
     notepad?: true | {text:'…'}  — fereastra Notepad, sub browser
     foldere?: true — panoul „Ce e acum în foldere”
     checks noi (k): meniuImg · dialog · salvat{img?, folder?, liber?, nume?} · nesalvat{img, folder?} (folder: doar acolo nu are voie
       să fie; fără folder: nicăieri) · np{are:[[variante],…]} ·
       npPropozitie{din:adresă} · npSursa{adresa?, titlu?, autor?, data?} · npImagine{folder?} (autorul + licența unei imagini libere salvate) ·
       npSalvat{folder?, nume?, are?:[[…]], sursa?:{…}, propozitie?:adresă, imagine?:true} (nume: 'lup' primește lup.txt, lup1.txt,
       lup 2.txt; fără diacritice și cu - sau _ în loc de spațiu) · lectia15 (fila lecției e tot deschisă)
       (img = id-ul imaginii din pagina ei; folder = 'Descărcări' | 'Documente/Ex Pop Ana' | 'elev' = folderul elevului)
     operații noi (sol/gresit): ['meniu', i] (clic dreapta pe imaginea i a paginii) · ['cmd', 'salv'|'cop'|…] (o comandă din meniu) · ['salveaza', i, folder?, nume?] (meniu → Salvați
       imaginea ca → folder → nume → Salvare) · ['dlgNav', folder] · ['dlgNume', nume] · ['dlgSel', 'd:Nume'|'f:nume.jpg'] (UN clic în
       listă) · ['dlgSalvare'] (butonul de jos: „Deschidere” dacă e ales un folder) · ['dlgAnulare'] ·
       ['np', text] · ['npAdauga', text] · ['npSalveaza', folder, nume]
   API-ul de dinainte de 12.10.2026 rămâne neschimbat; s-au ADĂUGAT: nesalvat.folder, npSalvat.nume, operația dlgSel, „Deschidere”.
   Paginile acestui fișier (BrowserSalvare.SITE): www.natura-exemplu.ro/lupul-cenusiu (fotografie cu „Toate drepturile rezervate”),
     www.natura-exemplu.ro/ursul-brun, www.imagini-libere-exemplu.ro/lupi, …/lup-in-zapada (CC BY 4.0), …/lup-cenusiu (domeniu public,
     CC0), …/ursi, …/urs-in-padure (CC BY-SA 4.0). O pagină are, pe lângă câmpurile lui browser-web: imagini:[{id, desen, fisier, autor,
     licenta, liber, legenda}], semnat, data.
   Evenimentul 'browser-web' al lui browser-web.js primește și tipurile noi: {tip:'dialog'|'salvat'|'np-salvat', img?, folder?, nume?, fisier?}
   (și BrowserSalvare.evenimente, ultimele 200, pentru probe).
   window.BrowserSalvare = {SITE, propozitii(adresa), sursaOk(text, cerinte)} — pentru probe și pentru lecțiile următoare.
   PENTRU LECȚIA URMĂTOARE: folosește tipul așa cum e; ai nevoie de altceva → extensie nouă (de ex. browser-salvare-<ceva>.js) prin
   BrowserWeb.creeaza, cu paginile tale. NU schimba: numele din meniuri și ferestre (sunt ale aplicațiilor probate), paginile de aici. */
(function(){
'use strict';
const BW=window.BrowserWeb;
if(!BW){console.error('browser-salvare.js: încarcă întâi browser-web.js');return}

const CSS=`
.bw{position:relative}
.bs-img{position:relative;max-width:300px;margin:6px 0}
.bs-img .bw-poza{cursor:context-menu;-webkit-touch-callout:none}
.bs-leg{font-size:.78rem;color:var(--ink2);margin:2px 0 0}
.bs-mb{border:1px solid var(--line);border-radius:6px;background:var(--paper2);color:var(--ink);font:inherit;font-size:.78rem;padding:3px 9px;min-height:32px;cursor:pointer;margin-top:3px}
.bs-semn{font-size:.85rem;color:var(--ink2);margin-top:.6em}
.bs-lista{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.bs-carte{border:1px solid var(--line);border-radius:8px;padding:6px;background:var(--paper)}
.bs-carte .bs-img{max-width:none;margin:0}
.bs-atr{border:1px dashed var(--line);border-radius:8px;padding:6px 9px;background:var(--paper2);font-size:.85rem;margin-top:8px}
.bs-scut{position:absolute;inset:0;z-index:5}
.bs-modal{position:absolute;inset:0;z-index:6;background:rgba(0,0,0,.10)}
.bs-meniu{position:absolute;z-index:6;min-width:250px;max-width:calc(100% - 8px);background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:10px;box-shadow:0 6px 22px rgba(0,0,0,.28);padding:5px 0;font-size:.86rem}
.bs-meniu button{display:flex;justify-content:space-between;gap:16px;width:100%;border:0;background:none;color:inherit;font:inherit;text-align:left;padding:6px 14px;min-height:32px;cursor:pointer}
.bs-meniu button:hover,.bs-meniu button:focus-visible{background:var(--sel)}
.bs-meniu .sc{color:var(--ink2);font-size:.8rem}
.bs-meniu hr{border:0;border-top:1px solid var(--line);margin:4px 0}
.bs-dlg{position:absolute;z-index:7;left:50%;top:44px;transform:translateX(-50%);width:min(620px,calc(100% - 8px));background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.35);font-size:.86rem;overflow:hidden}
.bs-dlg-t{display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--paper2);border-bottom:1px solid var(--line);font-weight:600}
.bs-dlg-t button{border:0;background:none;color:inherit;font-size:1.1rem;min-width:32px;min-height:32px;cursor:pointer}
.bs-adr{display:flex;align-items:center;gap:4px;flex-wrap:wrap;padding:6px 10px;border-bottom:1px solid var(--line)}
.bs-adr .seg{border:0;background:none;color:inherit;font:inherit;padding:3px 4px;min-height:32px;cursor:pointer;border-radius:4px}
.bs-adr .seg:hover{background:var(--sel)}
.bs-adr .sag{color:var(--ink2)}
.bs-dlg-c{display:grid;grid-template-columns:150px 1fr;min-height:150px;border-bottom:1px solid var(--line)}
@media (max-width:520px){.bs-dlg-c{grid-template-columns:110px 1fr}}
.bs-nav{border-right:1px solid var(--line);padding:4px 0;display:flex;flex-direction:column}
.bs-nav button,.bs-lst button{display:flex;align-items:center;gap:6px;border:0;background:none;color:inherit;font:inherit;text-align:left;padding:4px 8px;min-height:32px;cursor:pointer;width:100%}
.bs-nav button.on{background:var(--sel);font-weight:600}
.bs-lst{padding:4px 0;max-height:190px;overflow:auto}
.bs-lst button.on{background:var(--sel)}
.bs-lst .gol{color:var(--ink2);padding:8px 10px;font-size:.82rem}
.bs-ic{display:inline-block;width:18px;text-align:center}
.bs-rand{display:flex;align-items:center;gap:8px;padding:6px 10px;flex-wrap:wrap}
.bs-rand label{min-width:110px;text-align:right}
.bs-rand input{flex:1 1 200px;min-width:0;border:1px solid var(--line);border-radius:4px;padding:6px 8px;font-family:var(--fb);font-size:.92rem;background:var(--paper);color:var(--ink)}
.bs-rand .tip{flex:1 1 200px;color:var(--ink2)}
.bs-bt{display:flex;justify-content:flex-end;gap:8px;padding:8px 10px;background:var(--paper2)}
.bs-bt button{border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;padding:6px 18px;min-height:34px;cursor:pointer}
.bs-bt button.imp{border:2px solid var(--accent)}
.bs-err{color:var(--bad);padding:0 10px 6px;font-size:.82rem}
.bs-tel{display:none;margin:0 10px 4px;font-size:.78rem;color:var(--ink2)}
@media (pointer:coarse){.bs-tel{display:block}}
.bs-conf{position:absolute;z-index:8;left:50%;top:110px;transform:translateX(-50%);width:min(440px,calc(100% - 8px));background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.4);font-size:.88rem;overflow:hidden}
.bs-conf p{margin:10px 14px}
.bs-fly{position:absolute;z-index:5;right:8px;top:86px;width:min(300px,calc(100% - 16px));background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:12px;box-shadow:0 6px 22px rgba(0,0,0,.28);padding:8px 12px;font-size:.86rem}
.bs-fly b{display:block;font-size:1rem;margin-bottom:4px}
.bs-fly button{border:0;background:none;color:var(--bw-link,#1A0DAB);text-decoration:underline;font:inherit;padding:2px 0;min-height:32px;cursor:pointer}
.bs-np{border:1.5px solid var(--line);border-radius:10px;overflow:hidden;background:var(--paper)}
.bs-np-t{display:flex;align-items:center;gap:8px;padding:4px 8px;background:var(--paper2);border-bottom:1px solid var(--line);font-size:.82rem}
.bs-np-t .fila{background:var(--paper);border:1px solid var(--line);border-bottom:0;border-radius:6px 6px 0 0;padding:3px 10px;font-weight:600}
.bs-np-m{position:relative;display:flex;gap:2px;padding:2px 6px;border-bottom:1px solid var(--line);font-size:.84rem}
.bs-np-m>button{border:0;background:none;color:inherit;font:inherit;padding:4px 10px;min-height:32px;cursor:pointer;border-radius:4px}
.bs-np-m>button:hover{background:var(--sel)}
.bs-np-meniu{position:absolute;z-index:4;left:6px;top:36px;min-width:230px;background:var(--paper);border:1px solid var(--line);border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.25);padding:4px 0}
.bs-np-meniu button{display:flex;justify-content:space-between;gap:14px;width:100%;border:0;background:none;color:inherit;font:inherit;text-align:left;padding:6px 12px;min-height:32px;cursor:pointer}
.bs-np-meniu button:hover{background:var(--sel)}
.bs-np textarea{display:block;width:100%;box-sizing:border-box;min-height:150px;border:0;padding:8px 10px;font-family:Consolas,"Cascadia Mono",var(--fm),monospace;font-size:.92rem;line-height:1.4;background:var(--paper);color:var(--ink);resize:vertical}
.bs-np-nota{font-size:.78rem;color:var(--ink2);padding:3px 10px;border-top:1px solid var(--line)}
.bs-fol{font-size:.86rem}
.bs-fol ul{margin:.2em 0 .2em 1.1em;padding:0}
.bs-fol .fold{font-weight:600}
`;
function css(){if(document.getElementById('bs-css'))return;const s=document.createElement('style');s.id='bs-css';s.textContent=CSS;document.head.appendChild(s)}

const N=s=>String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[„”"“«»]/g,'').replace(/\s+/g,' ').trim();
const ADR=s=>N(s).replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/+$/,'');
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const INTERZISE=/[:*?"<>|]/;   /* în NUME; \ și / despart folderele unei căi (vezi dlgSalvare) */
/* „lup” cerut: lup.txt, lup1.txt, lup 2.txt, Lup.txt; fără diacritice; - sau _ în loc de spațiu */
const numeBun=(fisier,cerut)=>{const b=s=>N(String(s).replace(/\.txt$/i,'')).replace(/[\s_-]+/g,' ').trim();
  const f=b(fisier),c=b(cerut);return f===c||new RegExp('^'+c.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+' ?\\d{1,2}$').test(f)};
const KNOWN=new Set('jpg jpeg png gif webp bmp svg txt html htm'.split(' '));
const ext=n=>{const i=String(n).lastIndexOf('.');return i>0?String(n).slice(i+1).toLowerCase():''};

/* ---------------- desene simple pentru pozele site-urilor inventate (conținutul unor site-uri inventate, nu capturi) ---------------- */
const DES={lup:['#DCE8F0','#9BB0A0','#6E747C'],lupZapada:['#F4F8FB','#FFFFFF','#7A8088'],lupNoapte:['#1E2A44','#33405E','#8A9099'],
  urs:['#CFE6C3','#8FB27F','#6B4A2E'],ursPadure:['#BFD8B0','#5E8A55','#5A3D25']};
function desen(id,alt){
  const c=DES[id]||DES.lup,a=c[2],urs=/^urs/.test(id);
  const fig=urs?`<ellipse cx="80" cy="62" rx="28" ry="15" fill="${a}"/><circle cx="110" cy="52" r="11" fill="${a}"/><circle cx="104" cy="42" r="4" fill="${a}"/><circle cx="116" cy="42" r="4" fill="${a}"/><rect x="58" y="68" width="8" height="14" fill="${a}"/><rect x="92" y="68" width="8" height="14" fill="${a}"/>`
   :`<ellipse cx="80" cy="64" rx="24" ry="10" fill="${a}"/><polygon points="100,56 112,44 116,50 118,40 122,54 112,62" fill="${a}"/><rect x="62" y="68" width="5" height="14" fill="${a}"/><rect x="95" y="68" width="5" height="14" fill="${a}"/><path d="M56,62 q-10,4 -14,14" stroke="${a}" stroke-width="4" fill="none"/>`;
  const extra=id==='lupNoapte'?'<circle cx="132" cy="20" r="9" fill="#F3E9B5"/>':id==='lupZapada'?'<circle cx="30" cy="20" r="2" fill="#C9D6E0"/><circle cx="60" cy="12" r="2" fill="#C9D6E0"/><circle cx="140" cy="26" r="2" fill="#C9D6E0"/>':'';
  return `<svg class="bw-poza" viewBox="0 0 160 96" role="img" aria-label="${E(alt)}"><rect width="160" height="96" fill="${c[0]}"/>${extra}<polygon points="0,96 0,64 40,40 80,66 120,36 160,60 160,96" fill="${c[1]}"/>${fig}</svg>`;
}

/* ---------------- paginile (adrese NOI; lumea lecției 14 rămâne neatinsă) ---------------- */
const LIB='www.imagini-libere-exemplu.ro';
const LECTIE15='learninghub-8z6.pages.dev/lectii/v/m2-l15';   // fila lecției 15 (start:LECTIE15); testul „lectia15”
const SITE=Object.freeze({
 [LECTIE15]:{titlu:'Lecția 15 · LearningHub',site:'LearningHub',ascunsa:true,lectie:true,
  text:['Aici e lecția ta. Ca s-o păstrezi deschisă, lucrezi într-o filă nouă: apasă +, sus, lângă file.']},
 'www.natura-exemplu.ro/lupul-cenusiu':{titlu:'Lupul cenușiu – Natura Exemplu',site:'Natura Exemplu',
  imagini:[{id:'lupFoto',desen:'lup',fisier:'lup-padure.jpg',autor:'Foto Exemplu SRL',licenta:'Toate drepturile rezervate',liber:false,legenda:'Foto: © Foto Exemplu SRL. Toate drepturile rezervate.'}],
  text:['Lupul cenușiu trăiește în haite, în pădurile de munte.','Hrana lui e mai ales carnea: vânează iepuri, cerbi și mistreți.'],
  semnat:'Text: Ana Munteanu',data:'12.03.2026',link:[['Imagini libere cu lupi',LIB+'/lupi']],cuv:'lup lupul cenusiu haita hrana natura'},
 'www.natura-exemplu.ro/ursul-brun':{titlu:'Ursul brun – Natura Exemplu',site:'Natura Exemplu',
  imagini:[{id:'ursFoto',desen:'urs',fisier:'urs-brun.jpg',autor:'Foto Exemplu SRL',licenta:'Toate drepturile rezervate',liber:false,legenda:'Foto: © Foto Exemplu SRL. Toate drepturile rezervate.'}],
  text:['Ursul brun trăiește în pădurile de munte.','Vara, ursul se hrănește cu fructe de pădure, iarbă și rădăcini.'],
  semnat:'Text: Ion Vasilescu',data:'04.02.2026',link:[['Imagini libere cu urși',LIB+'/ursi']],cuv:'urs ursul brun hrana natura'},
 [LIB+'/lupi']:{titlu:'Imagini libere cu lupi – Imagini Libere Exemplu',site:'Imagini Libere Exemplu',lista:['lupZapada','lupCenusiu'],
  text:['Toate imaginile de aici au o licență liberă. Sub fiecare scrie autorul și licența.'],cuv:'imagini libere lup lupi licenta'},
 [LIB+'/lup-in-zapada']:{titlu:'Lup în zăpadă – Imagini Libere Exemplu',site:'Imagini Libere Exemplu',
  imagini:[{id:'lupZapada',desen:'lupZapada',fisier:'lup-in-zapada.jpg',autor:'Maria Ionescu',licenta:'CC BY 4.0',liber:true,legenda:'Autor: Maria Ionescu · Licență: CC BY 4.0 (Creative Commons Atribuire)'}],
  text:['Un lup în zăpadă, iarna.'],data:'05.01.2026',atribuire:'Maria Ionescu, CC BY 4.0, www.imagini-libere-exemplu.ro',link:[['Toate imaginile cu lupi',LIB+'/lupi']],cuv:'lup zapada iarna imagine libera'},
 [LIB+'/lup-cenusiu']:{titlu:'Lup cenușiu, noaptea – Imagini Libere Exemplu',site:'Imagini Libere Exemplu',
  imagini:[{id:'lupCenusiu',desen:'lupNoapte',fisier:'lup-cenusiu-noaptea.jpg',autor:'Dan Pop',licenta:'domeniu public (CC0)',liber:true,legenda:'Autor: Dan Pop · Licență: domeniu public (CC0)'}],
  text:['Un lup cenușiu, noaptea, sub lună.'],data:'20.11.2025',atribuire:'Dan Pop, domeniu public (CC0), www.imagini-libere-exemplu.ro',link:[['Toate imaginile cu lupi',LIB+'/lupi']],cuv:'lup cenusiu noaptea luna imagine libera'},
 [LIB+'/ursi']:{titlu:'Imagini libere cu urși – Imagini Libere Exemplu',site:'Imagini Libere Exemplu',lista:['ursPadure'],
  text:['Toate imaginile de aici au o licență liberă. Sub fiecare scrie autorul și licența.'],cuv:'imagini libere urs ursi licenta'},
 [LIB+'/urs-in-padure']:{titlu:'Urs în pădure – Imagini Libere Exemplu',site:'Imagini Libere Exemplu',
  imagini:[{id:'ursPadure',desen:'ursPadure',fisier:'urs-in-padure.jpg',autor:'Ion Stan',licenta:'CC BY-SA 4.0',liber:true,legenda:'Autor: Ion Stan · Licență: CC BY-SA 4.0 (Creative Commons Atribuire-Partajare în condiții identice)'}],
  text:['Un urs brun în pădure, vara.'],data:'14.07.2025',atribuire:'Ion Stan, CC BY-SA 4.0, www.imagini-libere-exemplu.ro',link:[['Toate imaginile cu urși',LIB+'/ursi']],cuv:'urs padure vara imagine libera'}
});
const IMG={};
Object.entries(SITE).forEach(([a,p])=>(p.imagini||[]).forEach((im,i)=>{IMG[im.id]=Object.assign({pagina:a,i},im)}));
const PAG_IMG=id=>{const im=IMG[id];return im?im.pagina:null};

/* propozițiile unei pagini (pentru testul „ai copiat o propoziție”) */
function propozitii(a){const p=SITE[a]||(BW.SITE||{})[a];if(!p)return[];return (p.text||[]).join(' ').split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>x.split(/\s+/).length>=4)}
/* sursa în Notepad: fiecare cerință (adresă, titlu, autor, data) trebuie să apară; textul se compară fără diacritice și fără ghilimele */
function sursaOk(text,c){
  const t=N(text),ta=' '+t.replace(/https?:\/\//g,'').replace(/www\./g,'')+' ',lipsa=[];
  if(c.adresa&&!ta.includes(ADR(c.adresa)))lipsa.push('adresa');
  if(c.titlu&&!t.includes(N(c.titlu)))lipsa.push('titlul');
  if(c.autor&&!t.includes(N(c.autor)))lipsa.push('autorul');
  if(c.data){const d=N(c.data);if(!t.includes(d)&&!/\b\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4}\b/.test(t))lipsa.push('data')}
  if(c.licenta&&!t.includes(N(c.licenta)))lipsa.push('licența');
  return lipsa;
}

/* sursa unei imagini salvate (cu licență liberă), scrisă în Notepad: autorul și licența (oricare formă din paranteză) */
function imagineScrisa(B,text,folder){
  const t=N(text);
  return B.salvate.some(s=>{const im=IMG[s.img];if(!im||!im.liber||(folder&&s.folder!==folder))return false;
    const lic=String(im.licenta).split(/[()]/).map(x=>N(x)).filter(Boolean);
    return t.includes(N(im.autor))&&lic.some(x=>t.includes(x))});
}

/* ---------------- calculatorul simulat: foldere și fișiere (contul Elev, ca la lecțiile 9-10) ---------------- */
const RADACINI=['Desktop','Descărcări','Documente','Imagini'];
function fsNou(Q){
  const el=Q.folderElev||'Ex Pop Ana';
  const F={el,dosare:new Set(RADACINI.concat(['Documente/'+el])),fis:[]};
  (Q.fs||[]).forEach(x=>{const [d,n]=[].concat(x);if(!n||String(d).endsWith('/')){const c=String(d).replace(/\/$/,'');F.dosare.add(c)}else{F.dosare.add(d);F.fis.push({d,n,tip:ext(n)==='txt'?'txt':'img',text:''})}});
  return F;
}
const folderReal=(F,f)=>f==='elev'?'Documente/'+F.el:f;
const copii=(F,d)=>{
  const sub=[...F.dosare].filter(x=>x.startsWith(d+'/')&&!x.slice(d.length+1).includes('/')).map(x=>x.slice(d.length+1)).sort((a,b)=>a.localeCompare(b,'ro'));
  return {dosare:sub,fis:F.fis.filter(f=>f.d===d).map(f=>f.n).sort((a,b)=>a.localeCompare(b,'ro'))};
};

function stareBS(S,Q){
  if(!S.bs){const F=fsNou(Q);S.bs={F,meniu:null,dlg:null,conf:null,fly:null,ultimFolderEdge:null,salvate:[],deschisMeniu:0,deschisDialog:0,
    np:Q.notepad?{text:(Q.notepad.text||''),fisier:null,folder:null,salvatText:null,meniu:false,salvari:[]}:null,msgBS:'',ultimClic:{n:null,t:0}}}
  return S.bs;
}

/* ---------------- extensia pentru BrowserWeb.creeaza ---------------- */
const EXT_BS={
  pagina(h,ctx){
    const S=ctx.S,Q=ctx.Q,p=ctx.pagina,B=stareBS(S,Q);
    if(!p)return h;
    let fig='';
    if(p.imagini)fig=p.imagini.map((im,i)=>fig1(im,i,B)).join('');
    if(p.lista)fig=`<div class="bs-lista">${p.lista.map(id=>{const im=IMG[id];return `<div class="bs-carte">${fig1(im,'L'+id,B,true)}<button type="button" class="bw-a" data-act="link" data-v="${E(im.pagina)}">Pagina imaginii</button></div>`}).join('')}</div>`;
    if(fig)h=h.replace('</h3>','</h3>'+fig);
    if(p.semnat||p.data)h+=`<p class="bs-semn">${p.semnat?E(p.semnat):''}${p.semnat&&p.data?' · ':''}${p.data?(p.semnat?'':'Data: ')+E(p.data):''}</p>`;
    if(p.atribuire)h+=`<div class="bs-atr"><b>Cum scrii sursa imaginii</b> (o copiezi de aici):<br>${E(p.atribuire)}</div>`;
    return h;
  },
  actiune(act,v,ctx){
    const S=ctx.S,B=stareBS(S,ctx.Q);
    if(!/^(bs|dlg|conf|fly|np)/.test(act)){B.meniu=null;B.fly=null;if(B.np)B.np.meniu=false;return false}
    B.msgBS='';
    if(act==='bsMeniuBtn'){deschideMeniu(B,v);return true}
    if(act==='bsCmd'){comandaMeniu(ctx,B,v);return true}
    if(act==='bsInchideMeniu'){B.meniu=null;return true}
    if(act==='dlgNav'){B.dlg.folder=v;B.dlg.sel=null;return true}
    if(act==='dlgSel'){const ac=Date.now(),dublu=B.ultimClic.n===v&&ac-B.ultimClic.t<500;B.ultimClic={n:v,t:ac};
      if(dublu&&v.slice(0,1)==='d')B.ultimClic={n:null,t:0};
      dlgSel(B,v,dublu);return true}
    if(act==='dlgSalvare'){dlgSalvare(ctx,B);return true}
    if(act==='dlgAnulare'){B.dlg=null;return true}
    if(act==='confDa'){const c=B.conf;B.conf=null;scrie(ctx,B,c.folder,c.nume,true);return true}
    if(act==='confNu'){B.conf=null;B.selecteaza=true;return true}   /* probat: după Nu, numele e din nou selectat întreg */
    if(act==='flyDeschide'){B.fly=null;B.msgBS='În pagină fișierul nu se deschide. Pe calculator, „Deschideți fișierul” îl arată în aplicația lui.';return true}
    if(act==='npMeniu'){B.np.meniu=!B.np.meniu;return true}
    if(act==='npSalvati'){B.np.meniu=false;npCtrlS(ctx,B);return true}
    if(act==='npSalvatiCa'){B.np.meniu=false;npDialog(B,true);return true}
    if(act==='npAltceva'){B.np.meniu=false;B.msgBS='În Notepad-ul din pagină merg doar Salvați și Salvați ca.';return true}
    return false;
  },
  verifica(c,ctx){
    const S=ctx.S,B=stareBS(S,ctx.Q),F=B.F;
    switch(c.k){
      case 'meniuImg':return B.deschisMeniu>0;
      case 'dialog':return B.deschisDialog>0;
      case 'salvat':return B.salvate.some(s=>(!c.img||[].concat(c.img).includes(s.img))&&(!c.folder||s.folder===folderReal(F,c.folder))&&(c.liber==null||!!IMG[s.img].liber===c.liber)&&F.fis.some(f=>f.d===s.folder&&f.n===s.nume)&&(!c.nume||!/^(imagine|image)\b|\(\d+\)/i.test(s.nume)));
      case 'nesalvat':return !B.salvate.some(s=>[].concat(c.img).includes(s.img)&&(!c.folder||s.folder===folderReal(F,c.folder))&&F.fis.some(f=>f.d===s.folder&&f.n===s.nume));
      case 'lectia15':return !S.inchisa&&S.tabs.some(t=>t.h[t.p]===LECTIE15);
      case 'npImagine':return !!B.np&&imagineScrisa(B,B.np.text,c.folder?folderReal(F,c.folder):null);
      case 'np':return !!B.np&&(c.are||[]).every(g=>[].concat(g).some(x=>N(B.np.text).includes(N(x))));
      case 'npPropozitie':return !!B.np&&propozitii(c.din).some(x=>N(B.np.text).includes(N(x)));
      case 'npSursa':return !!B.np&&!sursaOk(B.np.text,c).length;
      case 'npSalvat':{const np=B.np;if(!np||!np.fisier)return false;
        if(c.folder&&np.folder!==folderReal(F,c.folder))return false;
        if(c.nume&&!numeBun(np.fisier,c.nume))return false;
        const t=np.salvatText||'';
        if(c.are&&!c.are.every(g=>[].concat(g).some(x=>N(t).includes(N(x)))))return false;
        if(c.sursa&&sursaOk(t,c.sursa).length)return false;
        if(c.propozitie&&!propozitii(c.propozitie).some(x=>N(t).includes(N(x))))return false;
        if(c.imagine&&!imagineScrisa(B,t,c.folder?folderReal(F,c.folder):null))return false;
        return true}
    }
    return null;
  },
  op(o,ctx){
    const [k,a,b,c]=o,S=ctx.S,B=stareBS(S,ctx.Q);
    if(k==='meniu'){B.meniuPos=null;deschideMeniu(B,ctx.adresa+'|'+a);return true}
    if(k==='cmd'){comandaMeniu(ctx,B,a);return true}
    if(k==='salveaza'){deschideMeniu(B,ctx.adresa+'|'+a);comandaMeniu(ctx,B,'salv');if(b)B.dlg.folder=folderReal(B.F,b);if(c)B.dlg.nume=c;dlgSalvare(ctx,B);return true}
    if(k==='dlgNav'){if(B.dlg)B.dlg.folder=folderReal(B.F,a);return true}
    if(k==='dlgNume'){if(B.dlg)B.dlg.nume=a;return true}
    if(k==='dlgSel'){if(B.dlg)dlgSel(B,a,false);return true}
    if(k==='dlgEnter'){if(B.dlg){if(String(a).slice(0,1)==='d')dlgSel(B,a,true);else{dlgSel(B,a,false);dlgSalvare(ctx,B)}}return true}
    if(k==='dlgSalvare'){if(B.dlg)dlgSalvare(ctx,B);return true}
    if(k==='dlgAnulare'){B.dlg=null;return true}
    if(k==='np'){if(B.np)B.np.text=a;return true}
    if(k==='npAdauga'){if(B.np)B.np.text+=(B.np.text&&!/\n$/.test(B.np.text)?'\n':'')+a;return true}
    if(k==='npCtrlS'){npCtrlS(ctx,B);return true}
    if(k==='npSalvatiCa'){if(B.np){B.np.meniu=false;npDialog(B,true)}return true}
    if(k==='npSalveaza'){if(B.np){npDialog(B,false);if(B.dlg){B.dlg.folder=folderReal(B.F,a||'elev');if(b)B.dlg.nume=b;dlgSalvare(ctx,B)}}return true}
    return false;
  },
  panou(ctx){
    const S=ctx.S,Q=ctx.Q,B=stareBS(S,Q);
    let h='';
    if(B.meniu)h+=htmlMeniu(B);
    if(B.fly)h+=`<div class="bs-fly" role="dialog" aria-label="Descărcări"><b>Descărcări</b><div>${E(B.fly)}</div><button type="button" data-act="flyDeschide">Deschideți fișierul</button></div>`;
    if(B.dlg||B.conf)h+='<div class="bs-modal" aria-hidden="true"></div>';
    if(B.dlg)h+=htmlDialog(B);
    if(B.conf)h+=`<div class="bs-conf" role="alertdialog" aria-label="Confirmare Salvare ca"><div class="bs-dlg-t">Confirmare Salvare ca</div><p>${E(B.conf.nume)} există deja.<br>Îl înlocuiți?</p><div class="bs-bt"><button type="button" data-act="confDa">Da</button><button type="button" class="imp" data-act="confNu">Nu</button></div></div>`;
    if(B.msgBS)h+=`<p class="bw-nota" role="status">${B.msgBS}</p>`;
    if(B.np)h+=htmlNotepad(B);
    if(Q.foldere)h+=htmlFoldere(B);
    return h;
  }
};

function fig1(im,i,B,mic){
  return `<div class="bs-img" data-img="${E(im.id)}">${desen(im.desen,(im.legenda||'')+' ('+im.fisier+')')}
    <p class="bs-leg">${E(im.legenda||'')}</p><button type="button" class="bs-mb" data-act="bsMeniuBtn" data-v="${E(im.id)}">⋮ Meniul imaginii (sau clic dreapta pe imagine)</button></div>`;
}
function deschideMeniu(B,v){
  let id=v;if(String(v).includes('|')){const [a,i]=v.split('|');const p=SITE[a];const L=p&&(p.imagini||[]);id=L[+i]?L[+i].id:(p&&p.lista?p.lista[+i]:null)}
  if(!IMG[id])return;B.meniu={id};B.dlg=null;B.fly=null;B.deschisMeniu++;
}
const MENIU=[['nou','Deschideți imaginea într-o filă nouă'],['salv','Salvați imaginea ca'],['cop','Copiere imagine'],['lnk','Copiați linkul imaginii'],null,
  ['viz','Căutare vizuală','Alt+Shift+S'],null,['capt','Captură de ecran','Ctrl+Shift+S'],['mai','Mai multe instrumente','›'],['trim','Trimiteți către dispozitivul dvs.'],null,['insp','Inspectare']];
function htmlMeniu(B){
  const p=B.meniuPos||{x:12,y:150};
  return `<div class="bs-scut" data-act="bsInchideMeniu" aria-hidden="true"></div><div class="bs-meniu" role="menu" aria-label="Meniul imaginii" style="left:min(${p.x}px,calc(100% - 262px));top:${p.y}px">${MENIU.map(x=>x?`<button type="button" role="menuitem" data-act="bsCmd" data-v="${x[0]}"><span>${x[1]}</span><span class="sc">${x[2]||''}</span></button>`:'<hr>').join('')}</div>`;
}
function comandaMeniu(ctx,B,v){
  const m=B.meniu;B.meniu=null;if(!m)return;
  if(v!=='salv'){B.msgBS='În pagină folosim doar „Salvați imaginea ca”. Celelalte comenzi le vezi în meniu, dar aici nu fac nimic.';return}
  const im=IMG[m.id];
  B.dlg={k:'img',img:im.id,folder:B.ultimFolderEdge||'Descărcări',nume:im.fisier,sel:null,eroare:'',tip:'*.'+(ext(im.fisier)||'jpg')};
  B.selecteaza=true;B.deschisDialog++;ev(ctx,'dialog',{img:im.id});
}
/* UN clic (sau dublu-clic) în lista ferestrei. Probat: clic pe folder = ales, butonul devine „Deschidere”, numele rămâne;
   dublu-clic pe folder = intri în el, numele rămâne; clic pe fișier = numele lui în „Nume fișier”. */
function dlgSel(B,v,dublu){
  const D=B.dlg;if(!D)return;
  const k=String(v).slice(0,1),n=String(v).slice(2);
  if(k==='d'){if(dublu){D.folder=D.folder+'/'+n;D.sel=null}else D.sel=v}
  else{D.sel=v;D.nume=n}
  D.eroare='';
}
function npDialog(B,ca){
  const np=B.np;if(!np)return;
  if(np.fisier&&!ca){return}
  const prim=(np.text.split(/\r?\n/)[0]||'').replace(/[\\/:*?"<>|]/g,'').trim().slice(0,40);
  B.dlg={k:'txt',folder:np.folder||'Documente',nume:np.fisier||((prim||'Fără titlu')+'.txt'),sel:null,eroare:'',tip:'Documente text (*.txt)'};
  B.selecteaza=true;B.deschisDialog++;
}
function npCtrlS(ctx,B){
  const np=B.np;if(!np)return;
  if(np.fisier){const f=B.F.fis.find(x=>x.d===np.folder&&x.n===np.fisier);if(f)f.text=np.text;else B.F.fis.push({d:np.folder,n:np.fisier,tip:'txt',text:np.text});np.salvatText=np.text;np.salvari.push(np.fisier);ev(ctx,'np-salvat',{fisier:np.fisier});return}
  npDialog(B,false);
}
function dlgSalvare(ctx,B){
  const D=B.dlg;if(!D)return;
  /* probat (J1-8): cu un folder ales în listă, butonul de jos e „Deschidere”: intră în folder, nu salvează */
  if(D.sel&&D.sel.slice(0,1)==='d'){D.folder=D.folder+'/'+D.sel.slice(2);D.sel=null;D.eroare='';B.selecteaza=true;return}
  let n=String(D.nume||'').trim(),folder=D.folder;
  if(!n){D.eroare='Scrie un nume la <b>Nume fișier</b>. (Pe calculator, cu numele gol, fereastra nu salvează nimic.)';return}
  if(/^[a-z]:/i.test(n)||/^[\\/]{2}/.test(n)){D.eroare='În fereastra din pagină nu merg căile întregi (C:\\…): scrie doar numele și alege folderul în stânga.';return}
  if(/[\\/]/.test(n)){   /* o cale relativă: folderele trebuie să existe (ca în Windows) */
    const parti=n.split(/[\\/]+/).filter(Boolean),nm=parti.pop()||'';
    for(const p of parti){const g=[...B.F.dosare].find(x=>x.toLowerCase()===(folder+'/'+p).toLowerCase());
      if(!g){D.eroare=E(n)+'<br>Calea nu există.<br>Verificați calea și încercați din nou.';return}folder=g}
    n=nm.trim();if(!n){D.eroare='Scrie un nume la <b>Nume fișier</b>.';return}
  }
  if(INTERZISE.test(n)){D.eroare=E(n)+'<br>Numele de fișier nu este valid. <small>(Lecția 9: \\ / : * ? " &lt; &gt; | nu au voie în nume.)</small>';return}
  if(D.k==='txt'){if(!(ext(n)&&KNOWN.has(ext(n))))n+='.txt'}
  else if(!ext(n))n+='.'+(ext(IMG[D.img].fisier)||'jpg');
  if(B.F.fis.some(f=>f.d===folder&&f.n.toLowerCase()===n.toLowerCase())){B.conf={folder,nume:n};return}
  scrie(ctx,B,folder,n,false);
}
function scrie(ctx,B,folder,n,inlocuieste){
  const D=B.dlg;if(!D)return;
  const F=B.F;
  if(inlocuieste)F.fis=F.fis.filter(f=>!(f.d===folder&&f.n.toLowerCase()===n.toLowerCase()));
  if(D.k==='img'){
    F.fis.push({d:folder,n,tip:'img',img:D.img});B.salvate.push({img:D.img,folder,nume:n});B.ultimFolderEdge=folder;B.fly=n;
    ev(ctx,'salvat',{img:D.img,folder,nume:n});
  }else{
    const np=B.np;F.fis.push({d:folder,n,tip:'txt',text:np.text});np.fisier=n;np.folder=folder;np.salvatText=np.text;np.salvari.push(n);
    ev(ctx,'np-salvat',{fisier:n,folder});
  }
  B.dlg=null;
}
function ev(ctx,tip,d){B_EVT.push(Object.assign({tip},d||{}));if(B_EVT.length>200)B_EVT.shift();try{if(ctx&&ctx.ev)ctx.ev(tip,d)}catch(e){}}
const B_EVT=[];
function htmlDialog(B){
  const D=B.dlg,F=B.F,segs=D.folder.split('/'),{dosare,fis}=copii(F,D.folder);
  const rad=segs[0];
  const lista=dosare.map(n=>`<button type="button" data-act="dlgSel" data-v="d:${E(n)}" class="${D.sel==='d:'+n?'on':''}" title="Dublu-clic: intri în folder"><span class="bs-ic" aria-hidden="true">📁</span>${E(n)}</button>`)
    .concat(fis.filter(n=>D.k==='img'||ext(n)==='txt').map(n=>`<button type="button" data-act="dlgSel" data-v="f:${E(n)}" class="${D.sel==='f:'+n?'on':''}"><span class="bs-ic" aria-hidden="true">${ext(n)==='txt'?'📄':'🖼'}</span>${E(n)}</button>`)).join('');
  return `<div class="bs-dlg" role="dialog" aria-label="Salvare ca">
   <div class="bs-dlg-t"><span>Salvare ca</span><button type="button" data-act="dlgAnulare" aria-label="Închidere">×</button></div>
   <div class="bs-adr" aria-label="Adresă: ${E(segs[segs.length-1])}"><span class="sag">›</span>${segs.map((s,i)=>`<button type="button" class="seg" data-act="dlgNav" data-v="${E(segs.slice(0,i+1).join('/'))}">${E(s)}</button>${i<segs.length-1?'<span class="sag">›</span>':''}`).join('')}</div>
   <div class="bs-dlg-c"><div class="bs-nav" aria-label="Panoul din stânga">${RADACINI.map(r=>`<button type="button" data-act="dlgNav" data-v="${r}" class="${rad===r?'on':''}"><span class="bs-ic" aria-hidden="true">${r==='Descărcări'?'⬇':r==='Imagini'?'🖼':r==='Desktop'?'🖥':'📁'}</span>${r}</button>`).join('')}</div>
    <div class="bs-lst" aria-label="Conținutul folderului">${lista||'<div class="gol">Folderul e gol.</div>'}</div></div>
   <div class="bs-rand"><label for="bs-nume">Nume fișier:</label><input id="bs-nume" class="bs-nume" type="text" value="${E(D.nume)}" autocomplete="off" spellcheck="false" autocapitalize="off" enterkeyhint="done"></div>
   <p class="bs-tel">Pe telefon: dacă numele nu mai e colorat, atinge caseta Nume fișier, șterge-l cu ⌫ și scrie numele cerut.</p>
   <div class="bs-rand"><label>Salvare cu tipul:</label><span class="tip">${E(D.tip)}</span></div>
   ${D.eroare?`<div class="bs-err" role="alert">${D.eroare}</div>`:''}
   <div class="bs-bt"><button type="button" class="imp bs-ok" data-act="dlgSalvare">${D.sel&&D.sel.slice(0,1)==='d'?'Deschidere':'Salvare'}</button><button type="button" data-act="dlgAnulare">Anulare</button></div>
   <p class="bw-nota" style="padding:4px 10px">O fereastră „Salvare ca” mică: în stânga doar câteva foldere. Dublu-clic intră în folder. Un singur clic doar alege folderul, iar butonul de jos devine „Deschidere”: și el doar intră în folder, nu salvează.</p>
  </div>`;
}
function htmlNotepad(B){
  const np=B.np,murdar=np.fisier?np.text!==np.salvatText:!!np.text;
  const nume=np.fisier||((np.text.split(/\r?\n/)[0]||'').replace(/[\\/:*?"<>|]/g,'').trim().slice(0,40)||'Fără titlu');
  return `<div class="bs-np" aria-label="Notepad">
   <div class="bs-np-t"><span aria-hidden="true">🗒</span><span class="fila">${E(nume)}${murdar?' ●':''}</span><span style="margin-left:auto">Notepad</span></div>
   <div class="bs-np-m"><button type="button" data-act="npMeniu" aria-expanded="${np.meniu}">Fișier</button><button type="button" data-act="npAltceva">Editare</button><button type="button" data-act="npAltceva">Vizualizare</button>
    ${np.meniu?`<div class="bs-np-meniu" role="menu"><button type="button" data-act="npSalvati"><span>Salvați</span><span>Ctrl+S</span></button><button type="button" data-act="npSalvatiCa"><span>Salvați ca</span><span>Ctrl+Shift+S</span></button></div>`:''}</div>
   <textarea class="bs-np-ta" aria-label="Textul din Notepad" spellcheck="false">${E(np.text)}</textarea>
   <div class="bs-np-nota">Notepad mic, în pagină. Lipești cu <kbd>Ctrl</kbd>+<kbd>V</kbd> (pe telefon: ții degetul apăsat în casetă → Lipire). Salvezi cu <kbd>Ctrl</kbd>+<kbd>S</kbd> sau din Fișier › Salvați.${murdar?' Punctul ● de pe filă: ai schimbări nesalvate.':''}</div>
  </div>`;
}
function htmlFoldere(B){
  /* J1-16: și Documente, și orice folder în care a ajuns un fișier salvat de elev (ca să vadă unde a greșit) */
  const F=B.F,arata=['Descărcări','Documente','Documente/'+F.el];
  B.salvate.forEach(s=>{if(!arata.includes(s.folder))arata.push(s.folder)});
  if(B.np&&B.np.fisier&&B.np.folder&&!arata.includes(B.np.folder))arata.push(B.np.folder);
  return `<div class="bw-panou bs-fol"><div class="lbl">Ce e acum în foldere (ca să verifici; pe calculator vezi asta în Explorer)</div>${arata.map(d=>{const {fis}=copii(F,d);return `<div><span class="fold">📁 ${E(d.replace('/',' › '))}</span>${fis.length?`<ul>${fis.map(n=>`<li>${E(n)}</li>`).join('')}</ul>`:' — niciun fișier'}</div>`}).join('')}</div>`;
}

/* ---------------- tipul: browser-web + extensie, plus gesturile care nu trec prin data-act ---------------- */
const baza=BW.creeaza({site:SITE,extensii:[EXT_BS]});
const SimBrowserSalvare={
  render(Q,body,api){
    css();
    baza.render(Q,body,api);
    const root=body.querySelector('.bw'),sim=()=>body._sim;
    const S=()=>sim().stare(),B=()=>stareBS(S(),Q);
    const teste=()=>{const ul=root.querySelector('.bw-teste');if(ul)ul.innerHTML=(Q.checks||[]).map(c=>`<li class="${sim().test(c)?'ok':''}">${c.ce}</li>`).join('')};
    /* J1-1 (12.10.2026): numele se selectează DOAR la deschiderea ferestrei, după „Nu” și după „Deschidere” (B.selecteaza);
       după un clic în panoul din stânga sau în listă, focusul rămâne pe ce ai apăsat, ca în Windows */
    let ultimAct=null;
    const focusDupa=()=>setTimeout(()=>{const b=B();
      if(b.conf){const n=root.querySelector('[data-act="confNu"]');if(n)n.focus({preventScroll:true});return}
      if(b.dlg){
        if(b.selecteaza){b.selecteaza=false;const i=root.querySelector('.bs-nume');if(i){i.focus({preventScroll:true});try{i.select()}catch(e){}}return}
        if(ultimAct&&ultimAct.a==='nume'){const i=root.querySelector('.bs-nume');if(i&&document.activeElement!==i){i.focus({preventScroll:true});const L=i.value.length;try{i.setSelectionRange(L,L)}catch(e){}}return}
        if(ultimAct&&/^dlg(Nav|Sel)$/.test(ultimAct.a)){const zona=ultimAct.a==='dlgSel'?'.bs-lst':'.bs-nav';const t=[...root.querySelectorAll(zona+' [data-act="'+ultimAct.a+'"]')].find(x=>x.dataset.v===ultimAct.v)||root.querySelector('.bs-nav button.on')||root.querySelector('.bs-lst button');
          if(t)t.focus({preventScroll:true})}
        return}
      if(b.meniu){const m=root.querySelector('.bs-meniu button');if(m)m.focus({preventScroll:true})}},0);
    /* clic dreapta (mouse) / apăsare lungă (telefon) pe o imagine din pagină */
    const loc=e=>{const r=root.getBoundingClientRect();return {x:Math.max(0,Math.round(e.clientX-r.left)),y:Math.max(0,Math.round(e.clientY-r.top))}};
    root.addEventListener('contextmenu',e=>{const im=e.target.closest('.bs-img');if(!im||!root.contains(im))return;e.preventDefault();
      B().meniuPos=loc(e);const b=im.querySelector('[data-act="bsMeniuBtn"]');if(b){b.dataset.dinClic='1';b.click()}});
    root.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('[data-act="bsMeniuBtn"]');if(b)B().meniuPos=loc(e)},true);
    /* ce s-a apăsat se ține minte ÎNAINTE ca browser-web.js să redeseneze (după redesenare, ținta clicului nu mai e în pagină) */
    root.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-act]');ultimAct=t&&root.contains(t)?{a:t.dataset.act,v:t.dataset.v}:null},true);
    root.addEventListener('click',()=>focusDupa());
    /* un clic în „Nume fișier” după UN clic pe un folder: butonul redevine „Salvare” (NESIGUR în Windows; vezi capul fișierului) */
    root.addEventListener('focusin',e=>{const t=e.target,b=B();
      if(t.classList&&t.classList.contains('bs-nume')&&b.dlg&&b.dlg.sel&&b.dlg.sel.slice(0,1)==='d'){b.dlg.sel=null;
        root.querySelectorAll('.bs-lst button.on').forEach(x=>x.classList.remove('on'));const ok=root.querySelector('.bs-ok');if(ok)ok.textContent='Salvare'}});
    /* ce scrie elevul: numele din fereastră și textul din Notepad (fără redesenare: cursorul rămâne pe loc) */
    root.addEventListener('input',e=>{const t=e.target;
      if(t.classList.contains('bs-nume')&&B().dlg){B().dlg.nume=t.value;B().dlg.sel=null}
      if(t.classList.contains('bs-np-ta')&&B().np){B().np.text=t.value;teste();
        const f=root.querySelector('.bs-np .fila');if(f){const np=B().np,murdar=np.fisier?np.text!==np.salvatText:!!np.text;
          const nm=np.fisier||((np.text.split(/\r?\n/)[0]||'').replace(/[\\/:*?"<>|]/g,'').trim().slice(0,40)||'Fără titlu');f.textContent=nm+(murdar?' ●':'')}}});
    root.addEventListener('keydown',e=>{
      const t=e.target,k=e.key,kl=String(k).toLowerCase(),b=B();
      /* Enter pe un folder ales din listă = intri în el; pe un fișier = Salvare cu numele lui (ca în Windows) */
      if(k==='Enter'&&t.dataset&&t.dataset.act==='dlgSel'&&b.dlg){e.preventDefault();e.stopPropagation();const v=t.dataset.v;
        ultimAct=null;sim().run([['dlgEnter',v]]);const f=root.querySelector('.bs-lst button,.bs-nav button.on');if(f&&!B().conf&&B().dlg)f.focus({preventScroll:true});focusDupa();return}
      if(t.classList&&t.classList.contains('bs-nume')){e.stopPropagation();
        if(k==='Enter'){e.preventDefault();sim().run([['dlgSalvare']]);ultimAct={a:'nume'};focusDupa();return}
        if(k==='Escape'){e.preventDefault();sim().run([['dlgAnulare']]);return}
        return}
      if(t.classList&&t.classList.contains('bs-np-ta')){e.stopPropagation();
        if((e.ctrlKey||e.metaKey)&&kl==='s'){e.preventDefault();sim().run([[e.shiftKey?'npSalvatiCa':'npCtrlS']]);
          const ta=root.querySelector('.bs-np-ta');if(ta&&!B().dlg){ta.focus({preventScroll:true});ta.setSelectionRange(ta.value.length,ta.value.length)}focusDupa();}
        return}
      if((e.ctrlKey||e.metaKey)&&kl==='s'){e.preventDefault();b.msgBS='În pagină, Ctrl+S salvează doar în Notepad-ul de mai jos (dă întâi clic în el).';sim().run([]);return}
      if(k==='Escape'&&(b.meniu||b.dlg||b.conf||b.fly)){e.preventDefault();e.stopPropagation();if(b.conf){b.conf=null;b.selecteaza=true}else if(b.meniu)b.meniu=null;else if(b.dlg)b.dlg=null;else b.fly=null;sim().run([]);focusDupa()}
    },true);
  },
  rezolva(Q,body){return baza.rezolva(Q,body)},
  gresit(Q,body){return baza.gresit(Q,body)}
};

window.SimBrowserSalvare=SimBrowserSalvare;
window.BrowserSalvare={versiune:2,SITE,IMG,LECTIE15,propozitii,sursaOk,evenimente:B_EVT,desen};
})();
