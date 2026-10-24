/* Extensia „etica-colab” pentru lecțiile LearningHub — fișier comun (lectii/_sim/etica-colab.js).
   PROPRIETAR: autorul lecției VII · M3 · nr. 21 („Etică în mediul colaborativ: hacker și cracker. Protecția împotriva
   fraudei online”), tura de noapte 23→24.10.2026. Extensie NOUĂ, de sine stătătoare: nu încarcă și nu schimbă niciun alt
   simulator (nici colab-google.js al lecției VII/18, nici posta-gmail*.js ale lecțiilor VI/13-15).
   Folosire (după motor.js):
     <script src="../../_sim/etica-colab.js"></script>
     JocMotor.porneste({ …, tipuri:{docEchipa:SimEticaColab.docEchipa, pagini:SimEticaColab.pagini, casuta:SimEticaColab.casuta} })
   Stilul se pune singur în pagină, o singură dată, cu jetoanele motorului (--line, --paper, --paper2, --ink, --accent…).

   CE SIMULEAZĂ (desene, nu aplicațiile adevărate; fără logo, fără imagini Google; toate persoanele, adresele și mesajele
   sunt INVENTATE — domeniile .test sunt rezervate pentru exemple; celelalte domenii false din lecție nu există, verificat
   pe 24.10.2026 în lectii/vii/m3-l21/surse.md):
   - docEchipa : documentul echipei (Documente Google, desenat). Textul se poate scrie și șterge oriunde (contenteditable,
                 ca documentul adevărat, în care un Editor poate schimba orice). Comentariul: selectezi text, apeși
                 „Adaugă un comentariu” (Add comment) din bara de instrumente, ALEGI comentariul dintr-o listă de variante
                 scrise (Q.variante), apeși „Comentează” (Comment) — pașii din support.google.com/docs/answer/65129?hl=ro;
                 comentariul tău se șterge cu ⋮ Mai multe (More) → Șterge (Delete), tot ca în ajutor.
                 Testele: „neatins” = fiecare parte a unui coleg (de la titlul ei până la titlul următor) are EXACT textul
                 inițial — prinde și rândul nou scris în partea lui; „comentariu” = un comentariu pe partea colegului cerut
                 (dacă Q.ancora: selecția comentată cuprinde ancora); „scris” = comentariul ales e o variantă bună (ok:true)
                 și nu a rămas niciun comentariu nepotrivit (sfatul OPUS nu primește niciodată „Corect”; motivul lui apare
                 sub test).
                 Q {doc:{titlu, eu:'Mihai', parti:[{id, autor, gen?:'Ioanei' (genitivul; implicit „lui <autor>”), titlu, text}]}, tinta:'id-ul părții', selectie:'bucata din
                    textul țintei pe care o selectează rezolvarea', ancora?:'bucata care trebuie să fie în selecție',
                    variante:[{text, ok:bool, dece:'de ce e / nu e potrivit'}] (OBLIGATORIU; cel puțin una ok),
                    gresit:{tip:'schimba', din:'…', in:'…'} | {tip:'sterge'} | {tip:'opus'}, teste?:['neatins','comentariu','scris']}
                 (Schimbat la 24.10.2026, reparația după judecata 1: înainte comentariul se scria liber și se verifica doar
                 numărul de cuvinte — „Ștergi tot capitolul acesta” primea „Corect”. Câmpul `solutie` nu mai e folosit.)
                 (Reparația 2, 24.10.2026: comentariul marchează FIECARE bucată de text din selecție separat — câte un
                 <span class="ec-anc" data-c="id"> pe fiecare nod de text, fără să mute nimic —, iar ștergerea lui scoate
                 toate marcajele. Înainte, o selecție care trecea peste marginea unei părți — din titlu în text sau dintr-o
                 parte în alta — muta textul în pagină și testul „neatins” îl acuza pe elevul care n-a scris nimic. Partea
                 comentariului = partea în care începe primul text selectat. Forma lui Q și numele testelor: neschimbate.)
   - pagini    : un browser cu mai multe file deschise, fiecare cu o pagină de conectare. Elevul citește adresa din bara de
                 adrese și închide cu × filele false; pagina adevărată (adresa care, până la primul „/”, e exact
                 accounts.google.com) rămâne deschisă. Orice scris sau „Înainte” într-o pagină falsă = test picat.
                 Q {file:[{id, adresa, titlu?, adevarata:true|false}], start?:index}
   - casuta    : atelierul: Gmail desenat (Mesaje primite, Spam, mesajul deschis, „⋮ Mai multe” → „Raportează ca phishing”;
                 în Spam: „Raportează: Nu este phishing” — pașii din support.google.com/mail/answer/8253?hl=ro), cu bara de
                 adrese și file. Linkul din mesajul-capcană deschide o filă cu o pagină FALSĂ de conectare (textele copiate
                 după pagina publică accounts.google.com, 24.10.2026). Bara lecției, deasupra: „Citesc” / „Marchez semnele”
                 (unealta lecției, NU există în Gmail): în modul al doilea, atingi bucățile mesajului care sunt semne.
                 Q {cont:{nume, adresa}, mesaje:[{id, de:{nume, adresa}, subiect, rezumat, ora, capcana:bool,
                    corp:[{id?, t:'text', semn?:bool} | {id?, t:'link', text, adresa, titlu, fals:bool, semn?:bool}],
                    semnDe?:bool, semnSubiect?:bool}], principal:'id-ul mesajului-capcană la care se cer semnele',
                    teste?:['deschise','semne','raportate','bune','faraParola']}
   FUNCȚII PUBLICE: SimEticaColab.gazda(adresa) → partea de până la primul „/”, „?” sau „#”, fără https://, cu litere mici;
                    SimEticaColab.eConectareGoogle(adresa) → gazda(adresa) === 'accounts.google.com';
                    SimEticaColab.sectiuni(elementulPaginii) → {idParte:{h, t}} (titlul și textul fiecărei părți, citite din pagină);
                    SimEticaColab.evalDoc(Q, sectiuni, stare) / evalPagini(Q, stare) / evalCasuta(Q, stare) → [{id, ce, ok, m}].
   STAREA (pentru probe): body._stare() întoarce o copie a stării; body._rezolva() / body._gresit() pun soluția / greșeala tipică;
                    la docEchipa și body._alege(i, parte?, bucata?) = comentariul-variantă i pe bucata dată.

   FIDELITATE ȘI ABATERI (spuse elevului pe ecran, în rândul de sub fiecare desen):
   - documentul: un desen cu câteva rânduri; numele autorilor stau în titlurile părților (așa le-a scris echipa); nu există
     meniu, fonturi, istoric. Comentariul se ALEGE dintr-o listă (în Documente Google îl scrii tu: abatere spusă pe ecran);
     meniul ⋮ al comentariului are doar „Șterge”; „Rezolvă” (Resolve) nu e desenat.
     Dacă apeși „Adaugă un comentariu” fără text selectat, desenul îți cere să selectezi întâi
     (ajutorul Google spune: „Evidențiază textul… la care vrei să adaugi un comentariu”); ce face Documente Google atunci
     n-am putut verifica fără cont (NESIGUR, în surse.md);
   - Gmail: meniul „⋮ Mai multe” are aici DOAR comanda de raportare; „Răspunde” e oprit („nu răspunzi la un mesaj-capcană”);
     după „Raportează ca phishing” mesajul trece în Spam (NESIGUR: ajutorul Google spune că mesajele raportate ca SPAM ajung
     în Spam; pentru phishing n-am găsit propoziția exactă);
   - nicio pagină nu vine de pe Internet; nimic nu se descarcă.
   SIGURANȚA: nimic din ce tastează elevul nu se scrie în localStorage / sessionStorage / cookie și nu pleacă în rețea; câmpurile
   sunt <input type="text"> / <textarea> FĂRĂ <form>, fără `name`, cu autocomplete / autocorrect / autocapitalize / spellcheck
   oprite (cu type="password" browserul calculatorului COMUN ar întreba „Salvezi parola?”). De aceea pagina falsă NU are câmp
   de parolă: la primul gest în ea, lecția oprește exercițiul și explică.
   PENTRU LECȚIA URMĂTOARE (VII/22, evaluarea): tipurile de mai sus se pot folosi cu alte date (alt document, alte mesaje,
   alte file). NU schimbați aici: regula adresei (exact accounts.google.com până la primul „/”), numele testelor, forma lui Q,
   regula „nimic nu se salvează, nimic nu pleacă”. O extensie nouă stă în alt fișier din lectii/_sim/, cu nume nou.
   La docEchipa, Q.variante e obligatoriu de la 24.10.2026 (vezi mai sus); nicio variantă cu ok:true nu are voie să ceară
   ștergerea sau schimbarea muncii colegului. */
(function(){
'use strict';
const CSS=`
.ec{font-size:.95rem;line-height:1.4;color:var(--ink)}
.ec button{font:inherit;color:inherit}
.ec-nota{margin:6px 0 0;font-size:.84rem;color:var(--ink2)}
.ec-stare{min-height:1.2em;margin:6px 0 0;font-size:.9rem}
.ec-stare.rau{color:var(--bad);font-weight:600}
.ec-btn{min-height:36px;min-width:36px;padding:4px 12px;border:1px solid var(--line);border-radius:8px;background:var(--paper);cursor:pointer}
.ec-btn:hover{background:var(--sel)}
.ec-btn[disabled]{opacity:.5;cursor:not-allowed}
.ec-prim{background:var(--accent);color:var(--accentInk)!important;border-color:var(--accent);font-weight:700}
.ec-prim:hover{background:var(--accent);filter:brightness(1.08)}
.ec-reset{margin-top:8px}
.ec-teste{margin-top:8px;border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--paper2)}
.ec-teste .ec-lbl{font-size:.85rem;font-weight:700}
.ec-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.ec-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.ec-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.ec-teste li.ok .s{color:var(--ok)}.ec-teste li.rau .s{color:var(--bad)}
.ec-teste li .m{display:block;font-size:.86rem;color:var(--bad)}
/* browserul desenat */
.ec-br{border:1px solid var(--line);border-radius:12px;background:var(--paper);overflow:hidden}
.ec-file{display:flex;gap:4px;align-items:flex-end;padding:6px 8px 0;background:var(--paper2);border-bottom:1px solid var(--line);overflow-x:auto}
.ec-fila{display:flex;align-items:center;gap:2px;flex:1 1 0;min-width:0;max-width:240px;border:1px solid var(--line);border-bottom:0;border-radius:8px 8px 0 0;background:var(--paper2);font-size:.8rem}
.ec-fila.on{background:var(--paper);font-weight:700}
.ec-fila .t{flex:1;min-width:44px;min-height:40px;padding:4px 4px 4px 10px;border:0;background:transparent;text-align:left;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ec-fila .x{flex:none;min-width:36px;min-height:36px;margin-left:6px;border:0;border-radius:6px;background:transparent;cursor:pointer;font-size:1.1rem;line-height:1}
.ec-fila .x:hover{background:var(--sel)}
/* ecran îngust (telefon): filele trec pe două rânduri, ca fiecare titlu să rămână lat și × să stea departe de el (regula 20) */
@media (max-width:560px){.ec-file{flex-wrap:wrap;gap:4px;padding:6px}.ec-fila{flex:1 1 calc(50% - 4px);max-width:none;border-bottom:1px solid var(--line);border-radius:8px}}
.ec-adr{display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid var(--line);background:var(--paper)}
.ec-adr .lac{flex:none;font-size:.85rem;color:var(--ink2)}
.ec-adr .u{flex:1;min-width:0;min-height:34px;display:flex;align-items:center;padding:4px 12px;border:1px solid var(--line);border-radius:17px;background:var(--paper2);font-family:var(--fm);font-size:.86rem;overflow-wrap:anywhere;word-break:break-all;line-height:1.3}
.ec-ecran{padding:12px;min-height:220px}
.ec-gol{display:grid;place-items:center;min-height:200px;color:var(--ink2);text-align:center;padding:10px}
/* pagina de conectare (adevărată sau falsă: arată la fel — de asta contează adresa) */
.ec-con{max-width:440px;margin:6px auto;border:1px solid var(--line);border-radius:22px;padding:16px 18px;background:var(--paper)}
.ec-con .g{font-weight:700;color:var(--ink2);letter-spacing:.02em}
.ec-con h4{margin:6px 0 2px;font-size:1.45rem;font-weight:500}
.ec-con p{margin:0 0 10px}
.ec-f{display:flex;flex-direction:column;gap:4px;margin:6px 0}
.ec-f span{font-size:.82rem;color:var(--accent);font-weight:600}
.ec-f input{min-height:44px;padding:6px 12px;border:2px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;width:100%;box-sizing:border-box}
.ec-f input:focus{outline:none;border-color:var(--accent)}
.ec-con .jos{display:flex;justify-content:flex-end;margin-top:10px}
.ec-stop{margin:0 0 10px;padding:8px 10px;border-left:4px solid var(--bad);background:var(--badbg);border-radius:0 6px 6px 0;font-size:.92rem}
.ec-avert{margin:0 0 10px;padding:8px 10px;border-left:4px solid var(--accent);background:var(--paper2);border-radius:0 6px 6px 0;font-size:.92rem}
/* documentul echipei */
.ec-doc-cap{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;padding:8px 10px;border-bottom:1px solid var(--line)}
.ec-doc-cap b{font-size:1.02rem}
.ec-doc-cap small{color:var(--ink2)}
.ec-unelte{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--line);background:var(--paper2)}
.ec-unelte .lbl{font-size:.8rem;color:var(--ink2)}
.ec-corp{display:grid;grid-template-columns:minmax(0,1fr) 230px;gap:10px;padding:10px;background:var(--paper2)}
@media (max-width:760px){.ec-corp{grid-template-columns:1fr}}
.ec-pagina{background:var(--paper);border:1px solid var(--line);border-radius:4px;padding:14px 16px;min-height:200px;outline:none;font-family:var(--fb);line-height:1.5}
.ec-pagina:focus{border-color:var(--accent)}
.ec-pagina .ec-h{font-weight:700;margin:8px 0 2px}
.ec-pagina .ec-h:first-child{margin-top:0}
.ec-pagina .ec-p{margin:0 0 6px}
.ec-anc{background:var(--mark);color:var(--markInk);border-bottom:2px solid var(--accent)}
.ec-marg{display:flex;flex-direction:column;gap:8px}
.ec-marg .gol{font-size:.84rem;color:var(--ink2)}
.ec-card{border:1px solid var(--line);border-radius:10px;background:var(--paper);padding:8px 10px;box-shadow:0 1px 2px rgba(0,0,0,.08)}
.ec-card .cine{font-weight:700;font-size:.88rem}
.ec-card .cit{font-size:.82rem;color:var(--ink2);margin:2px 0 4px;overflow-wrap:anywhere}
.ec-card textarea{width:100%;box-sizing:border-box;min-height:64px;padding:6px 8px;border:2px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;resize:vertical}
.ec-card textarea:focus{outline:none;border-color:var(--accent)}
.ec-card .bt{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.ec-card .cine{display:flex;align-items:center;justify-content:space-between;gap:6px}
.ec-mai{flex:none;min-width:36px;min-height:36px;border:0;border-radius:18px;background:transparent;cursor:pointer;font-size:1.1rem;font-weight:800;line-height:1}
.ec-mai:hover,.ec-mai[aria-expanded="true"]{background:var(--sel)}
.ec-cmeniu{display:flex;flex-direction:column;gap:2px;margin:4px 0;padding:4px;border:1px solid var(--line);border-radius:8px;background:var(--paper2)}
.ec-cmeniu button{min-height:40px;padding:6px 10px;border:0;border-radius:6px;background:transparent;text-align:left;cursor:pointer}
.ec-cmeniu button:hover{background:var(--sel)}
.ec-cmeniu .nota{font-size:.78rem;color:var(--ink2);padding:2px 10px}
.ec-var{display:flex;flex-direction:column;gap:6px;margin:4px 0}
.ec-var .ec-lbl{font-size:.82rem;font-weight:600}
.ec-opt{display:block;width:100%;min-height:44px;padding:6px 10px 6px 34px;border:2px solid var(--line);border-radius:8px;background:var(--paper);text-align:left;cursor:pointer;position:relative;line-height:1.3}
.ec-opt::before{content:"";position:absolute;left:10px;top:50%;width:14px;height:14px;margin-top:-9px;border:2px solid var(--ink2);border-radius:50%;background:var(--paper)}
.ec-opt[aria-checked="true"]{border-color:var(--accent);background:var(--sel);font-weight:600}
.ec-opt[aria-checked="true"]::before{border-color:var(--accent);background:var(--accent);box-shadow:inset 0 0 0 3px var(--paper)}
.ec-opt:hover{border-color:var(--accent)}
/* Gmail desenat */
.ec-lectie{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 8px;padding:6px 10px;border:1px dashed var(--accent);border-radius:8px;background:var(--paper2);font-size:.88rem}
.ec-lectie .ec-btn[aria-pressed="true"]{background:var(--accent);color:var(--accentInk)!important;border-color:var(--accent);font-weight:700}
.ec-gm-sus{display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid var(--line);background:var(--paper2)}
.ec-gm-sus .logo{font-weight:700;font-size:1.05rem}
.ec-gm-sus .cauta{flex:1;min-width:0;min-height:34px;display:flex;align-items:center;padding:0 12px;border:1px solid var(--line);border-radius:17px;background:var(--paper);color:var(--ink2);font-size:.85rem;white-space:nowrap;overflow:hidden}
.ec-gm-sus .prof{flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:var(--accentInk);font-weight:800}
.ec-gm{display:grid;grid-template-columns:170px minmax(0,1fr);min-height:260px}
@media (max-width:760px){.ec-gm{grid-template-columns:1fr}}
.ec-gm-meniu{display:flex;flex-direction:column;gap:2px;padding:8px 6px;border-right:1px solid var(--line);background:var(--paper2)}
@media (max-width:760px){.ec-gm-meniu{flex-direction:row;flex-wrap:wrap;border-right:0;border-bottom:1px solid var(--line)}}
.ec-gm-meniu button{display:flex;justify-content:space-between;gap:8px;min-height:36px;padding:4px 12px;border:0;border-radius:0 18px 18px 0;background:transparent;cursor:pointer;text-align:left}
@media (max-width:760px){.ec-gm-meniu button{border-radius:18px;border:1px solid var(--line)}}
.ec-gm-meniu button.on{background:var(--sel);font-weight:700}
.ec-gm-main{min-width:0;padding:6px 8px}
.ec-gm-titlu{font-size:.85rem;color:var(--ink2);margin:4px 4px 6px}
.ec-rand{display:grid;grid-template-columns:minmax(0,9em) minmax(0,1fr) auto;gap:8px;align-items:center;width:100%;min-height:44px;padding:6px 8px;border:0;border-bottom:1px solid var(--line);background:transparent;cursor:pointer;text-align:left}
.ec-rand:hover{background:var(--sel)}
.ec-rand.nou{font-weight:700}
.ec-rand .de,.ec-rand .sb{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ec-rand .sb span{font-weight:400;color:var(--ink2)}
.ec-rand .ora{font-size:.8rem;color:var(--ink2)}
@media (max-width:560px){.ec-rand{grid-template-columns:minmax(0,1fr) auto}.ec-rand .sb{grid-column:1/-1;grid-row:2}}
.ec-msg h4{margin:4px 0 8px;font-size:1.15rem;font-weight:600;overflow-wrap:anywhere}
.ec-msg .rand-de{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-bottom:6px}
.ec-msg .rand-de .act{margin-left:auto;display:flex;gap:6px;position:relative}
.ec-msg .catre{font-size:.82rem;color:var(--ink2);margin:0 0 8px}
.ec-msg .corp{border-top:1px solid var(--line);padding-top:8px}
.ec-msg .corp p{margin:0 0 8px}
.ec-seg{border-radius:4px}
.ec-semne .ec-seg{display:inline-block;padding:6px 4px;margin:2px 0;outline:2px dashed var(--line);outline-offset:1px;cursor:pointer}
.ec-semne .ec-seg:hover{outline-color:var(--accent)}
.ec-seg.marcat{background:var(--mark);color:var(--markInk);outline:2px solid var(--accent)!important}
.ec-link{display:inline-block;min-height:36px;padding:6px 14px;border:0;border-radius:18px;background:var(--accent);color:var(--accentInk)!important;font-weight:700;cursor:pointer}
.ec-link.txt{background:transparent;color:var(--accent)!important;text-decoration:underline;padding:6px 2px}
.ec-meniu{position:absolute;right:0;top:40px;z-index:5;min-width:220px;border:1px solid var(--line);border-radius:8px;background:var(--paper);box-shadow:0 4px 14px rgba(0,0,0,.18);padding:4px}
.ec-meniu button{display:block;width:100%;min-height:40px;padding:6px 12px;border:0;border-radius:6px;background:transparent;text-align:left;cursor:pointer}
.ec-meniu button:hover{background:var(--sel)}
.ec-meniu .nota{font-size:.78rem;color:var(--ink2);padding:4px 12px}
.ec-toast{margin:6px 0 0;padding:6px 10px;border-radius:6px;background:var(--ink);color:var(--paper);font-size:.88rem;display:inline-block}
.ec-docv{max-width:560px;margin:0 auto;background:var(--paper);border:1px solid var(--line);border-radius:4px;padding:14px 16px}
`;
function stil(){if(document.getElementById('ec-stil'))return;const s=document.createElement('style');s.id='ec-stil';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s==null?'':s).replace(/[ ​]/g,' ').replace(/\s+/g,' ').trim();
const cuvinte=s=>norm(s).split(' ').filter(w=>/[\p{L}\p{N}]/u.test(w)).length;
/* genitivul / dativul numelui: „Ioanei”, „Anei”, „lui Radu” (câmpul gen al părții; implicit „lui <autor>”) */
const gen=p=>p&&(p.gen||('lui '+p.autor))||'';
const ATR='autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore data-form-type="other"';
function gazda(adresa){let a=String(adresa||'').trim().toLowerCase();a=a.replace(/^[a-z][a-z0-9+.\-]*:\/\//,'');const i=a.search(/[\/?#]/);return i<0?a:a.slice(0,i)}
const eConectareGoogle=adresa=>gazda(adresa)==='accounts.google.com';
function testeHtml(lista,titlu){return `<div class="ec-teste"><div class="ec-lbl">${titlu} · <span class="nr">0 din ${lista.length} trec</span></div><ol>${lista.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`}
function bifeaza(root,rez,arata){
  rez.forEach((r,i)=>{const li=root.querySelector(`.ec-teste li[data-i="${i}"]`);if(!li)return;
    li.className=r.ok?'ok':(arata?'rau':'');li.querySelector('.s').textContent=r.ok?'✓':(arata?'✗':'○');
    li.querySelector('.m').textContent=!r.ok&&arata&&r.m?r.m:''});
  const n=root.querySelector('.ec-teste .nr');if(n)n.textContent=`${rez.filter(r=>r.ok).length} din ${rez.length} trec`}
const alege=(lista,ids)=>ids?lista.filter(t=>ids.includes(t.id)):lista;
const listaNume=a=>a.length<=1?(a[0]||''):a.slice(0,-1).join(', ')+' și '+a[a.length-1];
/* pagina de conectare desenată: aceleași texte pe pagina adevărată și pe cea falsă (textele: accounts.google.com, 24.10.2026) */
function conectareHtml(id,adresaElev,stop,nota){
  return `${stop?`<p class="ec-stop" role="alert">${stop}</p>`:nota?`<p class="ec-avert" role="note">${nota}</p>`:''}<div class="ec-con"><div class="g">Google</div><h4>Conectează-te</h4><p>Folosește Contul Google</p>
  <label class="ec-f"><span>Adresa de e-mail sau numărul de telefon</span><input type="text" data-camp="${esc(id)}" value="${esc(adresaElev||'')}" ${ATR}></label>
  <div class="jos"><button type="button" class="ec-btn ec-prim" data-inainte="${esc(id)}">Înainte</button></div></div>`}

/* =============================== docEchipa =============================== */
/* Părțile documentului, citite din pagină: fiecare titlu [data-h] deschide o parte, care ține până la titlul următor.
   Așa se vede și un rând NOU scris în partea colegului (Enter după textul lui), nu doar o schimbare în paragraful lui. */
function sectiuni(pag){
  const S={};let cur=null;
  const pune=(id,cheie,txt)=>{const o=S[id]||(S[id]={h:'',t:''});o[cheie]+=' '+txt};
  if(!pag)return S;
  pag.childNodes.forEach(n=>{
    if(n.nodeType===1&&n.dataset&&n.dataset.h){cur=n.dataset.h;pune(cur,'h',n.innerText||n.textContent||'');return}
    const tx=n.nodeType===1?(n.innerText||n.textContent||''):n.nodeType===3?n.textContent:'';
    if(!norm(tx))return;
    pune(cur||'_inainte','t',tx)});
  Object.keys(S).forEach(k=>{S[k].h=norm(S[k].h);S[k].t=norm(S[k].t)});
  return S}
const schimbatiDin=(colegi,S)=>S?colegi.filter(p=>{const o=S[p.id];return !o||o.h!==norm(p.titlu)||o.t!==norm(p.text)}).map(p=>p.autor):[];
function evalDoc(Q,sect,st){
  const D=Q.doc,eu=D.eu,colegi=D.parti.filter(p=>p.autor!==eu),tinta=D.parti.find(p=>p.id===Q.tinta)||colegi[0];
  const S=sect&&typeof sect==='object'?sect:null,schimbati=schimbatiDin(colegi,S);
  const anc=Q.ancora?norm(Q.ancora):'';
  const pe=st.comentarii.filter(c=>c.parte===tinta.id),peLoc=pe.filter(c=>!anc||norm(c.citat).includes(anc));
  const altundeva=st.comentarii.filter(c=>c.parte!==tinta.id),rele=st.comentarii.filter(c=>!c.ok),bun=st.comentarii.find(c=>c.ok),inceput=Q.ancora?st.comentarii.find(c=>c.parte!==tinta.id&&norm(c.citat).includes(anc)):null;
  const T=[
    {id:'neatins',ce:`Textul colegilor (${listaNume(colegi.map(p=>p.autor))}) a rămas cum l-au scris ei`,ok:!schimbati.length,
      m:schimbati.length?`Ai schimbat ce a scris ${listaNume(schimbati)} sau ai scris în partea ${schimbati.length>1?'lor':gen(colegi.find(p=>p.autor===schimbati[0]))}, fără acordul ${schimbati.length>1?'lor':'colegului'}. Apasă „Ia-o de la capăt” (sau Ctrl+Z, de câte ori e nevoie). Ce vrei să-i spui, spune într-un comentariu.`:''},
    {id:'comentariu',ce:`Ai lăsat un comentariu pe textul ${gen(tinta)}${anc?`, chiar la „${esc(Q.ancora)}”`:''}`,ok:peLoc.length>0,
      m:peLoc.length?'':pe.length?`Comentariul tău e pe „${esc(pe[0].citat)}”. Selectează chiar locul de verificat, „${esc(Q.ancora||'')}”, apoi „Adaugă un comentariu”.`
        :inceput?`Comentariul tău începe în partea ${gen(D.parti.find(p=>p.id===inceput.parte))}. Selectează doar „${esc(Q.selectie||Q.ancora)}”, apoi pune comentariul.`
        :altundeva.length?`Comentariul tău e pe alt text. Selectează un cuvânt din partea ${gen(tinta)}, apoi „Adaugă un comentariu”.`
        :`Încă n-ai niciun comentariu. Selectează un cuvânt din partea ${gen(tinta)}, apoi apasă „Adaugă un comentariu”.`},
    {id:'scris',ce:'Comentariul ales e politicos și util: spune ce ai observat, iar corectura o face colegul',ok:!!bun&&!rele.length,
      m:rele.length?`Comentariul „${esc(rele[0].text)}” nu e potrivit: ${esc(rele[0].dece||'')}. Șterge-l (⋮ pe comentariu, apoi Șterge) și alege altul.`
        :!st.comentarii.length?'Întâi lasă comentariul.':'Alege comentariul care spune politicos ce ai observat.'}];
  return alege(T,Q.teste)}
const docEchipa={
  render(Q,body,api){
    stil();const D=Q.doc,eu=D.eu,colegi=D.parti.filter(p=>p.autor!==eu),V=Q.variante||[];
    if(!V.length)console.warn('etica-colab docEchipa: Q.variante lipsește (comentariul se alege din variante, nu se scrie liber)');
    let st={comentarii:[]},sel=null,cutie=null,ultim='',meniu=null;
    const docH=()=>D.parti.map(p=>`<div class="ec-h" data-h="${esc(p.id)}">${esc(p.titlu)}</div><p class="ec-p" data-p="${esc(p.id)}">${esc(p.text)}</p>`).join('');
    const pag=()=>body.querySelector('.ec-pagina');
    function parteaDin(nod){const e=nod&&(nod.nodeType===1?nod:nod.parentElement);const x=e&&e.closest('[data-p],[data-h]');return x?(x.dataset.p||x.dataset.h):null}
    function desen(){
      body.innerHTML=`<div class="ec ec-docE">
      <div class="ec-br"><div class="ec-file"><div class="ec-fila on"><span class="t">${esc(D.titlu)} – Documente Google</span></div></div>
       <div class="ec-adr"><span class="lac" aria-hidden="true">🔒</span><span class="u">docs.google.com/document/d/…/edit</span></div>
       <div class="ec-doc-cap"><b>${esc(D.titlu)}</b><small>Salvat în Drive</small><small>Lucrezi ca ${esc(eu)} (Editor)</small></div>
       <div class="ec-unelte" role="toolbar" aria-label="Bara de instrumente"><span class="lbl">Bara de instrumente:</span>
        <button type="button" class="ec-btn" data-a="com" title="Adaugă un comentariu (Add comment)">💬+ Adaugă un comentariu</button></div>
       <div class="ec-corp"><div class="ec-pagina" contenteditable="true" spellcheck="false" role="textbox" aria-multiline="true" aria-label="Textul documentului">${docH()}</div>
        <div class="ec-marg" aria-live="polite"></div></div></div>
      <p class="ec-nota">Desen al documentului: numele autorilor stau în titlurile părților (așa le-a scris echipa). Selectezi textul ca în Word: tragi cu mouse-ul peste el; pe telefon ții degetul pe un cuvânt până se colorează. Aici comentariul îl alegi dintr-o listă; în documentul adevărat îl scrii tu. Ce schimbi aici nu se salvează nicăieri.</p>
      <p class="ec-stare" aria-live="polite"></p>
      ${testeHtml(evalDoc(Q,'',st),'Testele sarcinii')}
      <button type="button" class="ec-btn ec-reset" data-a="reset">Ia-o de la capăt</button></div>`;
      const p=pag();
      p.addEventListener('input',()=>upd(false));
      body.querySelector('[data-a="com"]').addEventListener('pointerdown',e=>e.preventDefault());   // selecția rămâne pe loc, ca în Documente
      body.querySelector('[data-a="com"]').onclick=deschideCutie;
      body.querySelector('[data-a="reset"]').onclick=()=>{st={comentarii:[]};sel=null;cutie=null;meniu=null;desen();pag().focus({preventScroll:true})};
      margine();upd(false)}
    const tok={};body._ecTok=tok;     // #body e același element pentru toate exercițiile: ascultătorul vechi se scoate singur
    /* Bucățile de text atinse de selecție: fiecare nod de text, cu porțiunea lui [s, e). Doar bucățile cu litere contează.
       (Reparația 2, 24.10.2026: comentariul marchează FIECARE bucată separat, fără să mute textul — ca în Documente Google,
       unde un comentariu pus peste titlu și paragraf, sau peste două părți, nu schimbă nimic din text.) */
    function bucati(r){
      const p=pag(),L=[];if(!p||!r)return L;
      const rad=r.commonAncestorContainer;
      const ia=n=>{const s=n===r.startContainer?r.startOffset:0,e=n===r.endContainer?r.endOffset:n.length;
        if(e>s&&n.textContent.slice(s,e).trim())L.push({n,s,e})};
      if(rad.nodeType===3){if(p.contains(rad))ia(rad);return L}
      const w=document.createTreeWalker(rad,NodeFilter.SHOW_TEXT);let n;
      while((n=w.nextNode()))if(r.intersectsNode(n))ia(n);
      return L}
    const blocDin=n=>{const e=n.parentElement;return e&&(e.closest('[data-p],[data-h],p,div')||e)};
    function textul(B){let o='',ant=null;B.forEach(x=>{const k=blocDin(x.n);o+=(ant&&k!==ant?' ':'')+x.n.textContent.slice(x.s,x.e);ant=k});return norm(o)}
    function marcheaza(r,id){      // câte un <span class="ec-anc" data-c=id> pe fiecare bucată; textul și ordinea lui rămân neatinse
      bucati(r).forEach(({n,s,e})=>{let t=n;if(e<t.length)t.splitText(e);if(s>0)t=t.splitText(s);
        const sp=document.createElement('span');sp.className='ec-anc';sp.dataset.c=String(id);t.parentNode.insertBefore(sp,t);sp.appendChild(t)})}
    function onSel(){
      if(!body.isConnected||body._ecTok!==tok){document.removeEventListener('selectionchange',onSel);return}
      const s=getSelection();if(!s||!s.rangeCount)return;const r=s.getRangeAt(0),p=pag();if(!p)return;
      if(!p.contains(r.commonAncestorContainer))return;           // clicul pe un buton nu șterge selecția din document
      if(r.collapsed){sel=null;return}
      const B=bucati(r),text=textul(B);if(!text){sel=null;return}
      sel={range:r.cloneRange(),text,parte:parteaDin(B[0].n)}}    // partea = cea în care începe primul text selectat
    document.addEventListener('selectionchange',onSel);
    function stare(msg,rau){const e=body.querySelector('.ec-stare');if(e){e.textContent=msg||'';e.classList.toggle('rau',!!rau)}}
    function deschideCutie(){
      if(api.done&&api.done())return;
      if(!sel||!sel.text){stare('Întâi selectezi textul la care vrei să adaugi comentariul (tragi peste el), apoi apeși „Adaugă un comentariu”.',true);pag().focus({preventScroll:true});return}
      cutie={range:sel.range,text:sel.text,parte:sel.parte,ales:-1};meniu=null;stare('');margine();
      const o=body.querySelector('.ec-card .ec-opt');if(o)o.focus({preventScroll:true})}
    function comenteaza(i){
      if(!cutie||!V[i])return;const v=V[i];
      const c={id:(st.comentarii.reduce((m,x)=>Math.max(m,x.id),0))+1,parte:cutie.parte,citat:cutie.text,text:v.text,ok:!!v.ok,dece:v.dece||''};
      try{const r=cutie.range;if(r&&pag().contains(r.commonAncestorContainer))marcheaza(r,c.id)}catch(_){}
      st.comentarii.push(c);cutie=null;sel=null;margine();upd(false);
      const pp=D.parti.find(p=>p.id===c.parte)||{},autor=pp.autor;
      stare(autor&&autor!==eu?`Ai lăsat un comentariu pe textul ${gen(pp)}. ${autor} îl vede și hotărăște ce schimbă.`:'Ai lăsat un comentariu.')}
    function sterge(id){
      st.comentarii=st.comentarii.filter(c=>c.id!==id);meniu=null;
      const P=pag();                // TOATE marcajele comentariului (un comentariu peste mai multe bucăți are mai multe)
      if(P){const par=new Set();P.querySelectorAll(`.ec-anc[data-c="${id}"]`).forEach(sp=>{const x=sp.parentNode;while(sp.firstChild)x.insertBefore(sp.firstChild,sp);x.removeChild(sp);par.add(x)});
        par.forEach(x=>{if(x.isConnected)x.normalize()})}
      margine();upd(false);stare('Ai șters comentariul.')}
    function margine(){
      const m=body.querySelector('.ec-marg');if(!m)return;
      const scurt=t=>t.length>60?t.slice(0,57)+'…':t;
      const carduri=st.comentarii.map(c=>`<div class="ec-card" data-card="${c.id}"><div class="cine"><span>${esc(eu)} (tu)</span><button type="button" class="ec-mai" data-mai="${c.id}" aria-haspopup="menu" aria-expanded="${meniu===c.id}" aria-label="Mai multe (More)" title="Mai multe (More)">⋮</button></div>
        ${meniu===c.id?`<div class="ec-cmeniu" role="menu"><button type="button" role="menuitem" data-sterge="${c.id}">Șterge (Delete)</button><span class="nota">Aici meniul are doar comanda de care ai nevoie.</span></div>`:''}
        <div class="cit">la „${esc(scurt(c.citat))}”</div><div>${esc(c.text)}</div></div>`).join('');
      const nou=cutie?`<div class="ec-card ec-nou"><div class="cine"><span>${esc(eu)} (tu)</span></div><div class="cit">la „${esc(scurt(cutie.text))}”</div>
        <div class="ec-var" role="radiogroup" aria-label="Alege comentariul"><span class="ec-lbl">Alege comentariul pe care îl trimiți:</span>
        ${V.map((v,i)=>`<button type="button" class="ec-opt" role="radio" aria-checked="${cutie.ales===i}" data-v="${i}">${esc(v.text)}</button>`).join('')}</div>
        <div class="bt"><button type="button" class="ec-btn ec-prim" data-a="comenteaza"${cutie.ales<0?' disabled':''}>Comentează</button><button type="button" class="ec-btn" data-a="anuleaza">Anulează</button></div></div>`:'';
      m.innerHTML=carduri+nou||'<p class="gol">Aici, pe margine, apar comentariile.</p>';
      m.querySelectorAll('[data-mai]').forEach(b=>b.onclick=()=>{const id=+b.dataset.mai;meniu=meniu===id?null:id;margine();const x=m.querySelector(meniu?`[data-sterge="${id}"]`:`[data-mai="${id}"]`);if(x)x.focus({preventScroll:true})});
      m.querySelectorAll('[data-sterge]').forEach(b=>b.onclick=()=>{sterge(+b.dataset.sterge);pag().focus({preventScroll:true})});
      if(cutie){
        m.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{cutie.ales=+b.dataset.v;margine();const x=m.querySelector(`[data-v="${cutie.ales}"]`);if(x)x.focus({preventScroll:true})});
        m.querySelector('[data-a="comenteaza"]').onclick=()=>{if(cutie&&cutie.ales>=0){comenteaza(cutie.ales);pag().focus({preventScroll:true});
          // selecția veche nu rămâne întinsă peste text: o tragere care ar porni din ea ar MUTA textul (trage-și-lasă), nu ar selecta din nou
          const s=getSelection();if(s&&s.rangeCount&&!s.isCollapsed&&pag().contains(s.anchorNode))s.collapseToEnd()}};
        m.querySelector('[data-a="anuleaza"]').onclick=()=>{cutie=null;margine();pag().focus({preventScroll:true})}}}
    function upd(arata){const p=pag(),S=sectiuni(p);const r=evalDoc(Q,S,st);bifeaza(body,r,arata);
      const sch=schimbatiDin(colegi,S),k=sch.join(',');
      if(k!==ultim){ultim=k;if(sch.length)stare(`Atenție: ai schimbat ce a scris ${listaNume(sch)} sau ai scris în partea ${sch.length>1?'lor':gen(colegi.find(x=>x.autor===sch[0]))}. Fără acordul ${sch.length>1?'lor':'colegului'} nu schimbi munca colegilor.`,true);else stare('')}
      return r}
    function selecteaza(parte,bucata){const p=body.querySelector(`[data-p="${parte}"]`);if(!p)return null;
      const w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const i=n.textContent.indexOf(bucata);
        if(i>=0){const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+bucata.length);return r}}return null}
    const iBun=()=>Math.max(0,V.findIndex(v=>v.ok));
    function alegeVarianta(i,parte,bucata){
      const tinta=D.parti.find(p=>p.id===(parte||Q.tinta));const buc=bucata||Q.selectie||tinta.text.split(' ')[0];const r=selecteaza(tinta.id,buc);
      sel={range:r,text:buc,parte:tinta.id};deschideCutie();if(cutie){cutie.ales=i;comenteaza(i)}upd(false)}
    body._rezolva=()=>{st={comentarii:[]};sel=null;cutie=null;meniu=null;desen();alegeVarianta(iBun())};
    body._alege=(i,parte,bucata)=>{alegeVarianta(i,parte,bucata)};          // pentru probe: comentariul i, pe bucata dată
    body._gresit=()=>{st={comentarii:[]};sel=null;cutie=null;meniu=null;desen();const g=Q.gresit||{tip:'sterge'};const p=body.querySelector(`[data-p="${Q.tinta}"]`);
      if(g.tip==='opus'){const i=V.findIndex(v=>!v.ok);alegeVarianta(i<0?0:i);return}
      if(g.tip==='schimba'&&p)p.textContent=p.textContent.replace(g.din,g.in);else if(p)p.textContent='';upd(false)};
    body._stare=()=>({comentarii:JSON.parse(JSON.stringify(st.comentarii)),text:norm(pag()?pag().innerText:''),sectiuni:sectiuni(pag())});
    desen();
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok);
      if(!rau.length){nav.innerHTML='';api.resolve(true)}
      else{api.resolve(false,`${rau.length===1?'Un test nu trece':rau.length+' teste nu trec'} (marcate cu ✗; sub fiecare scrie de ce).`,!st.comentarii.length&&!r.some(x=>x.id==='neatins'&&!x.ok));
        api.revealButton(()=>{body._rezolva();upd(true);nav.innerHTML='';api.giveUp(`un comentariu pe textul ${gen(D.parti.find(p=>p.id===Q.tinta)||{})}, fără să-i schimbi textul: „${esc((V[iBun()]||{}).text||'')}”`)})}
      const p=pag();if(p)p.focus({preventScroll:true})},'Verifică');
  },
  rezolva(Q,body){body._rezolva()},
  gresit(Q,body){body._gresit()}
};

/* =============================== pagini (file cu pagini de conectare) =============================== */
function evalPagini(Q,st){
  const F=Q.file,false_=F.filter(f=>!f.adevarata),adev=F.filter(f=>f.adevarata);
  const ramase=false_.filter(f=>st.deschise.includes(f.id)),atinse=false_.filter(f=>st.atinse.includes(f.id));
  const adevInchisa=adev.filter(f=>!st.deschise.includes(f.id));
  const T=[
    {id:'falseInchise',ce:`Ai închis cu × filele cu pagini false (${false_.length})`,ok:!ramase.length,
      m:ramase.length?`Încă ${ramase.length===1?'e deschisă o filă':'sunt deschise '+ramase.length+' file'} cu adresa greșită. Uită-te în bara de adrese a fiecărei file.`:''},
    {id:'adevarata',ce:'Pagina adevărată de conectare (accounts.google.com) a rămas deschisă',ok:!adevInchisa.length,
      m:adevInchisa.length?'Ai închis și pagina adevărată. Apasă „Ia-o de la capăt” și citește adresa până la primul semn /.':''},
    {id:'nimic',ce:'Ai citit adresa fiecărei file și n-ai scris sau apăsat nimic într-o pagină falsă',ok:!atinse.length&&F.every(f=>st.vazute.includes(f.id)),
      m:atinse.length?'Ai scris sau ai apăsat într-o pagină falsă. Ce ai scris acolo poate pleca la cel care a făcut pagina: apasă „Ia-o de la capăt”.'
        :F.some(f=>!st.vazute.includes(f.id)&&!st.deschise.includes(f.id))?'Ai închis o filă fără să-i citești adresa. Apasă „Ia-o de la capăt” și apasă întâi pe fiecare filă (nu pe ×).'
        :'Mai ai file la care nu te-ai uitat: apasă pe fiecare filă (nu pe ×) și citește bara de adrese.'}];
  return alege(T,Q.teste)}
const pagini={
  render(Q,body,api){
    stil();const F=Q.file;
    const nou=()=>{const a=F[Math.min(Q.start||0,F.length-1)].id;return {deschise:F.map(f=>f.id),activa:a,atinse:[],vazute:[a]}};
    let st=nou();
    function desen(foc){
      const act=F.find(f=>f.id===st.activa&&st.deschise.includes(f.id));
      if(act&&!st.vazute.includes(act.id))st.vazute.push(act.id);
      const fileH=F.filter(f=>st.deschise.includes(f.id)).map(f=>`<div class="ec-fila${act&&f.id===act.id?' on':''}"><button type="button" class="t" data-fila="${esc(f.id)}" title="${esc(f.titlu||'Conectează-te – Conturi Google')}">${esc(f.titlu||'Conectează-te – Conturi Google')}</button><button type="button" class="x" data-inchide="${esc(f.id)}" aria-label="Închide fila ${esc(f.titlu||'Conectează-te')}" title="Închide fila">×</button></div>`).join('');
      const stop=act&&!act.adevarata&&st.atinse.includes(act.id)?`Stop! Ai scris sau ai apăsat într-o pagină falsă. Uită-te la bara de adrese: până la primul / nu scrie exact <b>accounts.google.com</b>. Închide fila cu ×. În viața reală, spune imediat profesorului.`:'';
      body.innerHTML=`<div class="ec ec-pag"><div class="ec-br"><div class="ec-file" role="tablist" aria-label="Filele browserului">${fileH||'<span class="ec-nota" style="padding:8px">nicio filă deschisă</span>'}</div>
        <div class="ec-adr"><span class="lac" aria-hidden="true">🔒</span><span class="u" aria-label="Bara de adrese">${act?esc(act.adresa):''}</span></div>
        <div class="ec-ecran">${act?conectareHtml(act.id,'',stop):'<div class="ec-gol">Ai închis toate filele. Apasă „Ia-o de la capăt”.</div>'}</div></div>
        <p class="ec-nota">Filele și paginile sunt desenate: nu se deschide nimic de pe Internet. Apasă pe o filă ca s-o vezi, pe × ca s-o închizi. În browserul adevărat, la începutul adresei poate apărea și https://; treci peste el.</p>
        ${testeHtml(evalPagini(Q,st),'Testele sarcinii')}
        <button type="button" class="ec-btn ec-reset" data-a="reset">Ia-o de la capăt</button></div>`;
      body.querySelectorAll('[data-fila]').forEach(b=>b.onclick=()=>{st.activa=b.dataset.fila;desen(`[data-fila="${b.dataset.fila}"]`)});
      body.querySelectorAll('[data-inchide]').forEach(b=>b.onclick=()=>{const id=b.dataset.inchide,i=st.deschise.indexOf(id);st.deschise=st.deschise.filter(x=>x!==id);
        if(st.activa===id)st.activa=st.deschise[Math.min(i,st.deschise.length-1)]||null;desen(st.activa?`[data-fila="${st.activa}"]`:'[data-a="reset"]')});
      body.querySelectorAll('[data-camp]').forEach(inp=>inp.addEventListener('input',()=>atinge(inp.dataset.camp,'[data-camp="'+inp.dataset.camp+'"]')));
      body.querySelectorAll('[data-inainte]').forEach(b=>b.onclick=()=>atinge(b.dataset.inainte,`[data-inchide="${b.dataset.inainte}"]`));
      body.querySelector('[data-a="reset"]').onclick=()=>{st=nou();desen('[data-fila]')};
      upd(false);if(foc){const e=body.querySelector(foc);if(e)e.focus({preventScroll:true})}}
    function atinge(id,foc){const f=F.find(x=>x.id===id);if(f&&!f.adevarata&&!st.atinse.includes(id)){st.atinse.push(id);desen(`[data-inchide="${id}"]`)}else if(foc){upd(false)}}
    function upd(arata){const r=evalPagini(Q,st);bifeaza(body,r,arata);return r}
    body._rezolva=()=>{st=nou();st.vazute=F.map(f=>f.id);st.deschise=F.filter(f=>f.adevarata).map(f=>f.id);st.activa=st.deschise[0]||null;desen()};
    body._gresit=()=>{st=nou();st.vazute=F.map(f=>f.id);const fals=F.filter(f=>!f.adevarata);   // greșeala tipică: închide doar falsele „evidente”; cea care începe cu accounts.google.com rămâne
      const capcana=fals.find(f=>gazda(f.adresa).startsWith('accounts.google.com'))||fals[0];
      st.deschise=F.filter(f=>f.adevarata||f===capcana).map(f=>f.id);st.activa=st.deschise[0];desen()};
    body._stare=()=>JSON.parse(JSON.stringify(st));
    desen();
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok);
      if(!rau.length){nav.innerHTML='';api.resolve(true)}
      else{api.resolve(false,`${rau.length===1?'Un test nu trece':rau.length+' teste nu trec'} (marcate cu ✗).`,st.deschise.length===F.length&&!st.atinse.length);
        api.revealButton(()=>{body._rezolva();upd(true);nav.innerHTML='';api.giveUp(`rămâne deschisă doar fila cu adresa ${esc((F.find(f=>f.adevarata)||{}).adresa||'')}: până la primul / scrie exact accounts.google.com. Celelalte, închise cu ×.`)})}
      const e=body.querySelector('.ec-file [data-fila]')||body.querySelector('[data-a="reset"]');if(e)e.focus({preventScroll:true})},'Verifică');
  },
  rezolva(Q,body){body._rezolva()},
  gresit(Q,body){body._gresit()}
};

/* =============================== casuta (atelierul) =============================== */
function segmenteSemn(m){const s=[];if(m.semnDe)s.push('de');if(m.semnSubiect)s.push('subiect');(m.corp||[]).forEach((c,i)=>{if(c.semn)s.push(c.id||('c'+i))});return s}
function evalCasuta(Q,st){
  const M=Q.mesaje,capc=M.filter(m=>m.capcana),bune=M.filter(m=>!m.capcana),princ=M.find(m=>m.id===Q.principal)||capc[0];
  const nedeschise=M.filter(m=>!st.citite.includes(m.id));
  const semne=princ?segmenteSemn(princ):[],marc=(princ&&st.marcate[princ.id])||[];
  const gasite=semne.filter(s=>marc.includes(s)).length,inPlus=marc.filter(s=>!semne.includes(s)).length;
  const neraport=capc.filter(m=>!st.raportate.includes(m.id)),bunePierdute=bune.filter(m=>st.raportate.includes(m.id));
  const T=[
    {id:'deschise',ce:`Ai deschis și ai citit toate cele ${M.length} mesaje`,ok:!nedeschise.length,
      m:nedeschise.length?`Mai ai de deschis: ${listaNume(nedeschise.map(m=>'„'+m.subiect+'”'))}.`:''},
    {id:'semne',ce:princ?`În mesajul „${princ.subiect}” ai marcat toate locurile cu semne (${semne.length}), fără nimic în plus`:'Semnele',ok:!!princ&&gasite===semne.length&&!inPlus,
      m:`Ai marcat ${gasite} din ${semne.length} locuri cu semne${inPlus?`, iar ${inPlus} ${inPlus===1?'bucată marcată nu e semn':'bucăți marcate nu sunt semne'}`:''}. Apasă „Marchez semnele”, deschide mesajul și atinge bucățile.`},
    {id:'raportate',ce:`Ai raportat ca phishing mesajele-capcană (${capc.length}): ⋮ Mai multe → Raportează ca phishing`,ok:!neraport.length,
      m:neraport.length?`Încă nu ${neraport.length===1?'e raportat':'sunt raportate'}: ${listaNume(neraport.map(m=>'„'+m.subiect+'”'))}.`:''},
    {id:'bune',ce:`Mesajele adevărate (de la ${listaNume(bune.map(m=>m.de.nume))}) le-ai citit și au rămas în Mesaje primite`,ok:!bunePierdute.length&&bune.every(m=>st.citite.includes(m.id)),
      m:bunePierdute.length?`Ai raportat și un mesaj adevărat: ${listaNume(bunePierdute.map(m=>'„'+m.subiect+'”'))}. Deschide Spam, deschide mesajul, apoi ⋮ Mai multe → Raportează: Nu este phishing.`:'Întâi deschide și citește mesajele.'},
    {id:'faraParola',ce:'N-ai scris și n-ai apăsat nimic într-o pagină falsă de conectare, iar fila ei e închisă',ok:!!princ&&st.citite.includes(princ.id)&&!st.falsAtins&&!st.file.some(f=>f.fals),
      m:st.falsAtins?'Ai scris sau ai apăsat într-o pagină falsă. Ce ai scris poate pleca la cel care a făcut-o: apasă „Ia-o de la capăt”.':st.file.some(f=>f.fals)?'Pagina falsă e încă deschisă într-o filă: închide-o cu ×.':`Întâi deschide mesajul „${princ?princ.subiect:''}”.`}];
  return alege(T,Q.teste)}
const casuta={
  render(Q,body,api){
    stil();const M=Q.mesaje,K=Q.cont||{nume:'Elev',adresa:'elev@scoala-exemplu.test'};
    const nou=()=>({lista:'primite',deschis:null,citite:[],raportate:[],marcate:{},mod:'citesc',meniu:false,toast:'',file:[],fila:'gmail',falsAtins:false});
    let st=nou();
    const inLista=l=>M.filter(m=>(st.raportate.includes(m.id)?'spam':'primite')===l);
    function segH(m,id,html,cls){const mar=(st.marcate[m.id]||[]).includes(id);return `<span class="ec-seg${mar?' marcat':''}${cls?' '+cls:''}" data-seg="${esc(id)}"${st.mod==='semne'?` role="button" tabindex="0" aria-pressed="${mar}"`:''}>${html}</span>`}
    function mesajH(m){
      const spam=st.raportate.includes(m.id);
      const corp=(m.corp||[]).map((c,i)=>{const id=c.id||('c'+i);
        if(c.t==='link')return `<p>${segH(m,id,`<button type="button" class="ec-link${c.stil==='text'?' txt':''}" data-link="${esc(m.id)}|${i}">${esc(c.text)}</button>`)}</p>`;
        return `<p>${segH(m,id,esc(c.text))}</p>`}).join('');
      return `<div class="ec-msg"><button type="button" class="ec-btn" data-a="inapoi" aria-label="Înapoi la listă">← Înapoi</button>
        <h4>${segH(m,'subiect',esc(m.subiect))}</h4>
        <div class="rand-de"><b>${esc(m.de.nume)}</b> ${segH(m,'de','&lt;'+esc(m.de.adresa)+'&gt;')}
         <span class="act"><button type="button" class="ec-btn" disabled title="Aici nu răspunzi la mesaje">↩ Răspunde</button>
          <button type="button" class="ec-btn" data-a="mai" aria-haspopup="menu" aria-expanded="${st.meniu}" title="Mai multe (More)">⋮ Mai multe</button>
          ${st.meniu?`<div class="ec-meniu" role="menu">${spam?'<button type="button" role="menuitem" data-a="nuphishing">Raportează: Nu este phishing</button>':'<button type="button" role="menuitem" data-a="phishing">Raportează ca phishing</button>'}<div class="nota">Aici meniul are doar comanda de care ai nevoie.</div></div>`:''}</span></div>
        <p class="catre">către mine · ${esc(m.ora)}</p><div class="corp">${corp}</div></div>`}
    function gmailH(){
      const lst=inLista(st.lista);
      const m=st.deschis&&M.find(x=>x.id===st.deschis);
      const nr=l=>inLista(l).filter(x=>!st.citite.includes(x.id)).length;
      const meniu=`<nav class="ec-gm-meniu" aria-label="Meniul principal"><button type="button" class="${st.lista==='primite'?'on':''}" data-lista="primite"><span>Mesaje primite</span><b>${nr('primite')||''}</b></button><button type="button" class="${st.lista==='spam'?'on':''}" data-lista="spam"><span>Spam</span><b>${inLista('spam').length||''}</b></button></nav>`;
      const main=m?mesajH(m):`<div class="ec-gm-titlu">${st.lista==='primite'?'Mesaje primite':'Spam'}</div>${lst.length?lst.map(x=>`<button type="button" class="ec-rand${st.citite.includes(x.id)?'':' nou'}" data-msg="${esc(x.id)}"><span class="de">${esc(x.de.nume)}</span><span class="sb">${esc(x.subiect)} <span>– ${esc(x.rezumat)}</span></span><span class="ora">${esc(x.ora)}</span></button>`).join(''):`<p class="ec-nota" style="padding:8px">${st.lista==='spam'?'Spam e gol.':'Nu ai mesaje aici.'}</p>`}`;
      return `<div class="ec-gm-sus"><span class="logo">Gmail</span><span class="cauta">Caută în e-mailuri</span><span class="prof" title="${esc(K.nume)}">${esc((K.nume||'E').trim()[0])}</span></div>
        <div class="ec-gm">${meniu}<div class="ec-gm-main${st.mod==='semne'?' ec-semne':''}">${main}${st.toast?`<p class="ec-toast" role="status">${esc(st.toast)}</p>`:''}</div></div>`}
    function desen(foc){
      const fila=st.file.find(f=>f.id===st.fila);
      const fileH=`<div class="ec-fila${!fila?' on':''}"><button type="button" class="t" data-fila="gmail">Gmail</button></div>`+st.file.map(f=>`<div class="ec-fila${fila&&fila.id===f.id?' on':''}"><button type="button" class="t" data-fila="${esc(f.id)}">${esc(f.titlu)}</button><button type="button" class="x" data-inchide="${esc(f.id)}" aria-label="Închide fila ${esc(f.titlu)}" title="Închide fila">×</button></div>`).join('');
      const adresa=fila?fila.adresa:(st.deschis?'mail.google.com/mail/u/0/#'+(st.lista==='spam'?'spam':'inbox')+'/…':'mail.google.com/mail/u/0/#'+(st.lista==='spam'?'spam':'inbox'));
      let ecran;
      if(!fila)ecran=gmailH();
      else if(fila.fals)ecran=`<div class="ec-ecran">${conectareHtml(fila.id,K.adresa,st.falsAtins?`Stop! Ai scris sau ai apăsat într-o pagină falsă. Uită-te la bara de adrese: până la primul / nu scrie <b>accounts.google.com</b>. Pe Internet, ce ai scris aici putea pleca la un cracker. Închide fila cu ×. În viața reală spui imediat profesorului sau părinților.`:'',
        `În viața reală nu apeși pe linkul dintr-un mesaj-capcană. Aici l-ai deschis ca să-i vezi adresa: citește bara de adrese, nu scrie nimic, apoi închide fila cu ×.`)}</div>`;
      else ecran=`<div class="ec-ecran"><div class="ec-docv"><b>${esc(fila.titlu)}</b><p>${esc(fila.text||'Aici se deschide documentul. Închide fila cu × ca să te întorci în Gmail.')}</p></div></div>`;
      body.innerHTML=`<div class="ec ec-cas">
        <div class="ec-lectie" role="group" aria-label="Unealta lecției"><span>Unealta lecției (nu e în Gmail):</span>
          <button type="button" class="ec-btn" data-mod="citesc" aria-pressed="${st.mod==='citesc'}">Citesc</button>
          <button type="button" class="ec-btn" data-mod="semne" aria-pressed="${st.mod==='semne'}">Marchez semnele</button>
          <span class="ec-nota" style="margin:0">${st.mod==='semne'?'Atinge în mesaj bucățile care sunt semne de phishing. Încă o atingere scoate marcajul.':'Lucrezi ca în Gmail.'}</span></div>
        <div class="ec-br"><div class="ec-file">${fileH}</div>
         <div class="ec-adr"><span class="lac" aria-hidden="true">🔒</span><span class="u" aria-label="Bara de adrese">${esc(adresa)}</span></div>${ecran}</div>
        <p class="ec-nota">Gmail desenat, cu mesaje inventate: nimic nu pleacă și nimic nu vine de pe Internet. „Răspunde” e oprit, iar meniul ⋮ are doar comanda de raportare.</p>
        ${testeHtml(evalCasuta(Q,st),'Testele atelierului')}
        <button type="button" class="ec-btn ec-reset" data-a="reset">Ia-o de la capăt</button></div>`;
      leaga();upd(false);if(foc){const e=body.querySelector(foc);if(e)e.focus({preventScroll:true})}}
    function leaga(){
      const q=s=>body.querySelectorAll(s);
      q('[data-mod]').forEach(b=>b.onclick=()=>{st.mod=b.dataset.mod;st.meniu=false;desen(`[data-mod="${st.mod}"]`)});
      q('[data-fila]').forEach(b=>b.onclick=()=>{st.fila=b.dataset.fila;desen(`[data-fila="${st.fila}"]`)});
      q('[data-inchide]').forEach(b=>b.onclick=()=>{const id=b.dataset.inchide;st.file=st.file.filter(f=>f.id!==id);if(st.fila===id)st.fila='gmail';desen('[data-fila="gmail"]')});
      q('[data-lista]').forEach(b=>b.onclick=()=>{st.lista=b.dataset.lista;st.deschis=null;st.meniu=false;st.toast='';desen(`[data-lista="${st.lista}"]`)});
      q('[data-msg]').forEach(b=>b.onclick=()=>deschide(b.dataset.msg));
      q('[data-a="inapoi"]').forEach(b=>b.onclick=()=>{st.deschis=null;st.meniu=false;desen('[data-msg]')});
      q('[data-a="mai"]').forEach(b=>b.onclick=()=>{st.meniu=!st.meniu;desen(st.meniu?'.ec-meniu button':'[data-a="mai"]')});
      q('[data-a="phishing"]').forEach(b=>b.onclick=()=>raporteaza(st.deschis,true));
      q('[data-a="nuphishing"]').forEach(b=>b.onclick=()=>raporteaza(st.deschis,false));
      q('[data-link]').forEach(b=>b.onclick=e=>{if(st.mod==='semne')return;e.stopPropagation();const [mid,i]=b.dataset.link.split('|');deschideLink(mid,+i)});
      q('.ec-seg').forEach(s=>{const fn=e=>{if(st.mod!=='semne'||!st.deschis)return;e.preventDefault();e.stopPropagation();marcheaza(st.deschis,s.dataset.seg)};
        s.addEventListener('click',fn,true);s.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')fn(e)})});
      q('[data-camp]').forEach(inp=>inp.addEventListener('input',()=>atingeFals()));
      q('[data-inainte]').forEach(b=>b.onclick=()=>atingeFals());
      const r=body.querySelector('[data-a="reset"]');if(r)r.onclick=()=>{st=nou();desen('[data-msg]')}}
    function deschide(id){st.deschis=id;st.meniu=false;st.toast='';if(!st.citite.includes(id))st.citite.push(id);desen('[data-a="inapoi"]')}
    function raporteaza(id,da){if(!id)return;
      if(da){if(!st.raportate.includes(id))st.raportate.push(id);st.toast='Mesajul a fost raportat ca phishing și mutat în Spam.'}
      else{st.raportate=st.raportate.filter(x=>x!==id);st.toast='Mesajul a fost raportat ca nefiind phishing și mutat înapoi în Mesaje primite.'}
      st.deschis=null;st.meniu=false;desen(`[data-lista="${st.lista}"]`)}
    function marcheaza(mid,seg){const a=st.marcate[mid]||(st.marcate[mid]=[]);const i=a.indexOf(seg);if(i>=0)a.splice(i,1);else a.push(seg);desen(`[data-seg="${seg}"]`)}
    function deschideLink(mid,i){const m=M.find(x=>x.id===mid),c=m&&m.corp[i];if(!c)return;const id='f-'+mid+'-'+i;
      if(!st.file.some(f=>f.id===id))st.file.push({id,titlu:c.titlu||(c.fals?'Conectează-te – Conturi Google':'Document'),adresa:c.adresa,fals:!!c.fals,text:c.textPagina});
      st.fila=id;desen(`[data-fila="${id}"]`)}
    function atingeFals(){if(!st.falsAtins){st.falsAtins=true;const f=st.file.find(x=>x.id===st.fila);desen(f?`[data-inchide="${f.id}"]`:null)}}
    function upd(arata){const r=evalCasuta(Q,st);bifeaza(body,r,arata);return r}
    function solutie(){const s=nou();s.citite=M.map(m=>m.id);s.raportate=M.filter(m=>m.capcana).map(m=>m.id);
      const p=M.find(m=>m.id===Q.principal)||M.find(m=>m.capcana);if(p)s.marcate[p.id]=segmenteSemn(p);s.mod='citesc';return s}
    body._rezolva=()=>{st=solutie();desen()};
    body._gresit=()=>{st=solutie();const p=M.find(m=>m.id===Q.principal)||M.find(m=>m.capcana);const li=p.corp.findIndex(c=>c.t==='link');   // greșeala tipică: a apăsat linkul și a scris în pagina falsă
      if(li>=0){st.file.push({id:'f-'+p.id+'-'+li,titlu:'Conectează-te – Conturi Google',adresa:p.corp[li].adresa,fals:true});st.fila='f-'+p.id+'-'+li}st.falsAtins=true;desen()};
    body._stare=()=>JSON.parse(JSON.stringify(st));
    desen();
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok);
      if(!rau.length){nav.innerHTML='';api.resolve(true)}
      else{api.resolve(false,`${rau.length===1?'Un test nu trece':rau.length+' teste nu trec'} (marcate cu ✗; sub fiecare scrie de ce).`,!st.citite.length);
        api.revealButton(()=>{body._rezolva();upd(true);nav.innerHTML='';api.giveUp('toate mesajele deschise; semnele marcate cu galben; mesajele-capcană raportate ca phishing (⋮ Mai multe → Raportează ca phishing); cele adevărate rămase în Mesaje primite; în pagina falsă n-ai scris nimic.')})}
      const e=body.querySelector('.ec-teste li.rau')?body.querySelector('.ec-br [data-fila="gmail"]'):null;if(e)e.focus({preventScroll:true})},'Verifică');
  },
  rezolva(Q,body){body._rezolva()},
  gresit(Q,body){body._gresit()}
};

window.SimEticaColab={docEchipa,pagini,casuta,gazda,eConectareGoogle,evalDoc,evalPagini,evalCasuta,segmenteSemn,sectiuni};
})();
