/* Extensia „scrii, trimiți, răspunzi, redirecționezi, atașezi” a simulatorului poștei Gmail — fișier comun
   (lectii/_sim/posta-gmail-scrie.js). Se încarcă DUPĂ lectii/_sim/posta-gmail.js, pe care NU îl schimbă.
   PROPRIETAR: autorul lecției VI · M2 · nr. 14 („Operații cu mesaje: compunere, trimitere, răspuns, redirecționare,
   atașare”), 12.10.2026. O folosește și o extinde (fără s-o schimbe) VI/15 (etichete, agenda de contacte): vezi
   „PENTRU LECȚIA 15” mai jos și lectii/vi/m2-l14/surse.md, „Pentru lecția următoare”.

   CE ADAUGĂ (prin cârligele lui posta-gmail.js: `scrie`, `actiuniMesaj`, `arataPanou`, `adaugaMesaj`, `mutaMesaj`,
   evenimentele; nimic din numele, pașii sau testele lui nu se schimbă):
     - butonul Scrie → fereastra „Mesaj nou” (dreapta jos; pe ecranul îngust, sub căsuță): Către, Cc / Bcc, Subiect,
       corpul, jos Trimite, agrafa 📎 (Atașează fișiere) și coșul 🗑 (Renunță); ✕ din colț = închizi fără să trimiți;
     - sub mesajul deschis: Răspunde, Răspunde tuturor (doar când mesajul are mai mulți destinatari), Redirecționează;
       caseta de răspuns / redirecționare se deschide SUB mesaj, ca în Gmail;
     - Trimite: verifică destinatarii (niciunul → eroare; adresă fără @, cu spații, cu doi @ → eroare „nu a fost
       recunoscută”); subiect sau corp gol → întrebarea „Trimiți acest mesaj fără subiect…?”; apoi mesajul intră în
       Trimise, jos în stânga apare „Mesaj trimis · Anulează · Afișează mesajul”; o adresă care nu există (nu e în
       datele exercițiului) aduce în Mesaje primite mesajul întors, de la Mail Delivery Subsystem, cu subiectul
       „Notificare privind starea livrării (eroare)”;
     - fereastra închisă cu ✕ (sau răspunsul părăsit) cu ceva scris în ea → Mesaje nefinalizate; un mesaj nefinalizat
       se redeschide în fereastra de scriere; 🗑 îl aruncă;
     - agrafa → o fereastră „Deschidere” desenată (Documente, Descărcări, foldere), cu fișiere INVENTATE: nimic nu se
       ia de pe calculatorul elevului (fără <input type="file">); fișierul ales apare jos, în mesaj, și se poate scoate
       cu ✕; peste limita de 25 MB nu se atașează: devine o legătură spre Google Drive; mesajele cu fișiere arată
       atașamentele sub text și o agrafă în listă; la Redirecționează, atașamentele merg mai departe, la Răspunde nu.
   Textele interfeței: ajutorul Gmail în română (lectii/vi/m2-l14/surse.md); ce nu s-a putut confirma (titlul „Mesaj
   nou”, textul erorilor, „Re:”/„Fwd:”, corpul mesajului întors) e trecut acolo ca NESIGUR și în capturi_lipsa.json.

   SIGURANȚA (aceeași regulă ca posta-gmail.js): nimic din ce tastează elevul nu se scrie în localStorage /
   sessionStorage / cookie și nu pleacă în rețea; câmpurile sunt <input type="text"> / <textarea> FĂRĂ <form>, fără
   `name`, cu autocomplete / autocorrect / autocapitalize / spellcheck oprite; nicio fereastră de fișiere adevărată.

   FUNCȚIA DE CREARE:
     const inst = SimPostaGmailScrie.creeaza(elementul, optiuni)
     optiuni = TOATE opțiunile lui SimPostaGmail.creeaza (cont, conturi, mesaje, start, intreabaParola, deschide,
               meniuExtra, …) +
       mesaje[].atasate  [{nume, marime (octeți)}]   fișiere atașate la un mesaj din date
       fisiere     {'Documente':[…], 'Descărcări':[…]}  ce arată fereastra Deschidere; un element e {nume, marime} sau
                   {nume, folder:[…]} (implicit: fisiereImplicite(cont): prezentările elevului din exercițiu
                   în Documente › TIC_6A, plus câteva fișiere în Descărcări, unul de 380 MB)
       existente   ['adresa', …]   adrese care „există” pe lângă cele din date (conturile, expeditorii și destinatarii
                   mesajelor, contactele); la orice altă adresă mesajul se întoarce
       negasite    ['adresa', …]   adrese care NU există, deși apar în date (de exemplu destinatarul greșit al unui
                   mesaj din Trimise care s-a întors deja)
       limitaMB    limita atașamentelor (implicit 25)
       anulareSec  cât stă „Mesaj trimis” cu Anulează după Trimite (implicit 10; în Gmail 5/10/20/30, din setări)
       contacte    [{nume, adresa}]  sugestii sub Către / Cc cât scrii (lecția 15: agenda)
       catreClic   function(inst)    dacă există, eticheta „Către” devine buton (lecția 15: alegi din agendă)
       actiuniMesaj  butoane în plus sub mesaj, după cele trei ale lecției
       laEveniment function(nume, date)  = inst.on('*', …)
     inst = metodele lui SimPostaGmail.creeaza (stare, mergiLa, conecteaza, deschideLista, deschideMesaj, deconecteaza,
            adaugaMesaj, mutaMesaj, mesaje, arataPanou, …) +
       scrie()                          ce face butonul Scrie
       completeaza(camp, text)          camp: 'catre' | 'cc' | 'subiect' | 'corp' (înlocuiește tot textul câmpului)
       adaugaDestinatar(adresa, camp?)  adaugă o adresă la Către (sau la 'cc')
       arataCc()
       ataseaza(numeFisier)             agrafa → Deschidere → fișierul (caută în toate locurile) → Deschidere
       scoateAtasament(numeFisier)
       trimite() → true dacă a plecat   confirma(true|false)  (întrebarea „fără subiect…”)   inchideEroarea()
       inchide()                        ✕ (păstrează în Mesaje nefinalizate dacă e ceva scris)
       renunta()                        🗑
       raspunde(id?) · raspundeTuturor(id?) · redirectioneaza(id?)   (fără id: mesajul deschis)
       anuleazaTrimiterea() · afiseazaMesajul()          butoanele din „Mesaj trimis”
       arataCitat(da?)                  „⋯” sub corpul unui răspuns: arată / ascunde mesajul la care răspunzi
       deschideDialog() · alegeLoc(loc) · alegeFisier(nume) · deschidereDialog() · anuleazaDialog()
       stareScrie() → {compune: {mod:'nou'|'raspuns'|'tuturor'|'redir', la, catre, cc, ccVizibil, subiect, corp, citat,
                      atasate[], dinCiorna} | null, trimise:[{id, tip, la, catre[], cc[], subiect, corp, citat,
                      atasate[], intoarse[]}], ciorne, renuntate, intoarse, anulate, verificat, dialog, modal, toast}
       on(nume, fn) · jurnal() · reset() · distruge()
     EVENIMENTE noi (pe lângă cele ale lui posta-gmail.js): 'scrie-deschis' {mod, la} · 'camp' {camp} · 'cc' ·
       'atasat' {nume, drive} · 'atasament-scos' {nume} · 'dialog' {deschis} · 'eroare' {motiv, adresa?} ·
       'intrebare' · 'trimis' {id, tip} · 'intors' {id, adrese} · 'anulat' {id} · 'ciorna' {id} · 'ciorna-deschisa' {id}
       · 'renuntat' · 'schimbare' (și cât scrie elevul).

   TIPUL PENTRU MOTOR (tipuri:{mesaj:SimPostaGmailScrie.tip}): o sarcină în căsuță, cu teste numite care se bifează singure.
     Q {sim:{…opțiunile de mai sus…}, mesaj?:{tip, la} (la ce mesaj se uită testele de conținut; implicit: fereastra
        deschisă, altfel ultimul mesaj trimis), teste:[{c, v?, d?, pe?:{tip, la}}], fisa?:[{id, et, ok:[…], adresa?}],
        drum:[[pas, arg…], …] (rezolvarea, făcută prin metodele lui inst), gresit?:{drum:[…]} | {sari: indicele unui pas}}
     teste de CONȚINUT (pe fereastra deschisă, altfel pe ultimul mesaj trimis de tipul cerut):
       catre {v:'adresa'|[…]} · cc {v} · faraCc · subiect {v:{cuvinte:[…], min?:2}} · salut · semnatura {v:'Prenume'} ·
       continut {v:{cuvinte:[…]}} · atasat {v:'nume'} · faraAtasat {v:'nume'}
     alte teste: trimis (un mesaj TRIMIS care trece toate testele de conținut cu același `pe`) · nefinalizat ·
       renuntat · neintors (niciun mesaj al elevului nu s-a întors) · verificat (după trimitere s-a uitat în Trimise) +
       TOATE testele lui SimPostaGmail.TESTE (bara, conectat, nesalvata, deschis, vazut, necitit, iesit, fisa…).
     pașii din `drum`: bara, conecteaza, bula, lista, deschide, iesi, scrie, catre, cc, subiect, corp, ataseaza, scoate,
       trimite, confirma, inchide, renunta, raspunde, tuturor, redir, anuleaza, fisa.

   SCHIMBAT LA REPARAȚIA DIN 12.10.2026 (judecata 1 a lecției 14; TOTUL compatibil înapoi: numele testelor, forma lui Q,
   pașii din `drum`, metodele și evenimentele de mai sus au rămas; detaliile: lectii/vi/m2-l14/surse.md, „Pentru lecția
   următoare” › „Schimbat la reparația din 12.10.2026”):
     - la Răspunde / Răspunde tuturor, Către (și Cc) sunt câmpuri de scris, ca la Redirecționează (înainte: text fix);
       eticheta „Către” devine buton (`catreClic`) tot doar la Scrie și Redirecționează; sub corp, „⋯” arată mesajul la
       care răspunzi (citatul pus de Gmail; `citat` e acum completat și la răspunsuri; în Trimise, corpul îl include);
     - întrebarea „Trimiți acest mesaj fără subiect sau fără text…?” apare doar dacă subiectul e gol sau dacă NU e nici
       corp, nici citat (la Redirecționează / Răspunde mesajul primit e textul: nu se mai întreabă);
     - „Mesaj trimis” (cu Anulează) stă `anulareSec` secunde (opțiune nouă, implicit 10; în Gmail 5, 10, 20 sau 30, din
       setări — S1) și dispare și când deschizi o fereastră de scriere (pe telefon acoperea butoanele ei);
     - Escape în fereastra „Mesaj nou” = ✕ (păstrează în Mesaje nefinalizate; ajutorul Gmail, S11), dacă nu e deschisă
       altă fereastră (Deschidere, o întrebare, ferestrele altor extensii cu role="dialog");
     - mesajele testelor spun CE a făcut elevul când a folosit alt buton sau alt mesaj decât cere sarcina („Ai apăsat
       Redirecționează; aici trebuie Răspunde…”), în locul lui „Încă n-ai deschis fereastra de scriere”: funcția nouă
       SimPostaGmailScrie.altTip(stareScrie, pe, mesaje, toatePe) → text sau '' (o folosește evalueaza(); extensiile
       care au propriul evalueaza o pot chema la fel); după ieșirea din cont, „Verifică” spune cum reiei;
     - exportate în plus: altTip, potriveste, candidat, arataCitat (metodă inst).

   PENTRU LECȚIA 15: folosiți creeaza() cu `contacte`, `catreClic`, `meniuExtra` (etichetele, din posta-gmail.js) și
   evenimentele; o extensie nouă stă în alt fișier din lectii/_sim/, cu nume nou. NU schimbați aici: numele din
   interfață (vin din surse), regula „nimic nu se salvează, nimic nu pleacă”, mesajul întors, numele testelor și forma
   lui Q de la tipul `mesaj` (lecția 14 le folosește). */
(function(){
'use strict';
const B=window.SimPostaGmail;
if(!B)throw new Error('posta-gmail-scrie.js: încarcă întâi lectii/_sim/posta-gmail.js');
const CSS=`
.pgs-mn{display:flex;flex-direction:column;font-size:.92rem}
.pgs-r{display:flex;align-items:center;gap:4px;border-bottom:1px solid var(--line);min-height:40px;padding:0 2px}
.pgs-r .et{color:var(--ink2);font-size:.86rem;flex:none}
.pgs-r textarea.pgs-ad{flex:1;min-width:0;border:0;background:transparent;color:var(--ink);font:inherit;line-height:1.3;min-height:38px;box-sizing:border-box;outline:none;padding:9px 2px;resize:none;overflow:hidden;field-sizing:content;overflow-wrap:anywhere}
.pgs-r textarea.pgs-ad:focus{box-shadow:inset 0 -2px 0 var(--accent)}
.pgs-r input{flex:1;min-width:0;border:0;background:transparent;color:var(--ink);font:inherit;min-height:38px;outline:none;padding:0 2px}
.pgs-r input:focus{box-shadow:inset 0 -2px 0 var(--accent)}
.pgs-r.cine{font-size:.88rem;padding:6px 2px;flex-wrap:wrap}
.pgs-lk{background:none;border:0;color:var(--ink2)!important;cursor:pointer;min-height:32px;min-width:32px;padding:0 6px;font-size:.86rem}
.pgs-lk:hover{color:var(--ink)!important;text-decoration:underline}
.pgs-et-b{background:none;border:0;color:var(--accent)!important;cursor:pointer;min-height:32px;padding:0 2px;font-size:.86rem;text-decoration:underline}
.pgs-sb{font-size:.84rem;color:var(--ink2);padding:6px 2px;border-bottom:1px solid var(--line)}
.pgs-corp{display:block;width:100%;box-sizing:border-box;min-height:110px;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--ink);font:inherit;line-height:1.4;resize:vertical;padding:8px 2px;outline:none}
.pgs-corp:focus{box-shadow:inset 0 -2px 0 var(--accent)}
.pgs-citat{white-space:pre-line;word-break:break-word;font-size:.84rem;color:var(--ink2);border-left:3px solid var(--line);padding:4px 8px;margin:6px 0;max-height:150px;overflow:auto}
.pgs-atas{display:flex;flex-wrap:wrap;gap:6px;padding:6px 0 0}
.pgs-atas:empty{display:none}
.pgs-chip{display:inline-flex;align-items:center;gap:6px;max-width:100%;min-height:34px;padding:2px 2px 2px 10px;border:1px solid var(--line);border-radius:6px;background:var(--paper2);font-size:.86rem}
.pgs-chip b{font-weight:700;word-break:break-all}
.pgs-chip .mr{color:var(--ink2);white-space:nowrap}
.pgs-chip .x{min-width:32px;min-height:32px;border:0;border-radius:16px;background:transparent;cursor:pointer;color:var(--ink)!important}
.pgs-chip .x:hover{background:var(--sel)}
.pgs-chip.drive{border-style:dashed}
.pgs-nota{margin:6px 0 0;font-size:.84rem;color:var(--ink2)}
.pgs-nota:empty{display:none}
.pgs-sug{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:6px;margin:2px 0 4px;background:var(--paper)}
.pgs-sug:empty{display:none}
.pgs-sug button{min-height:36px;border:0;background:transparent;text-align:left;padding:4px 10px;cursor:pointer;font:inherit;font-size:.88rem}
.pgs-sug button:hover,.pgs-sug button.on{background:var(--sel)}
.pgs-jos{display:flex;align-items:center;gap:6px;padding-top:8px}
.pgs-trimite{min-height:40px;padding:6px 22px;border:0;border-radius:20px;background:var(--accent);color:var(--accentInk)!important;font-weight:700;cursor:pointer}
.pgs-ic{min-width:40px;min-height:40px;border:0;border-radius:20px;background:transparent;cursor:pointer;font-size:1.1rem}
.pgs-ic:hover{background:var(--sel)}
.pgs-sp{flex:1}
.pgs-sub{margin:10px 0 0 50px;border:1px solid var(--line);border-radius:10px;padding:6px 10px 10px;box-shadow:0 2px 8px rgba(0,0,0,.08);background:var(--paper)}
.pgs-on-sub .pg-act{display:none}
.pgs-atas-msg{margin:10px 0 0 50px;display:flex;flex-wrap:wrap;gap:8px}
.pgs-card{display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:6px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper2);font-size:.86rem;max-width:100%;box-sizing:border-box;word-break:break-all}
.pgs-card .mr{color:var(--ink2);word-break:normal;white-space:nowrap}
.pgs-clip{margin-right:4px}
.pgs-toast{position:absolute;left:10px;bottom:10px;z-index:9;display:flex;align-items:center;gap:8px;flex-wrap:wrap;max-width:calc(100% - 20px);box-sizing:border-box;padding:6px 8px 6px 14px;border-radius:8px;background:#202124;color:#fff;font-size:.9rem;box-shadow:0 4px 14px rgba(0,0,0,.3)}
.pgs-toast button{background:none;border:0;color:#8AB4F8!important;font-weight:700;cursor:pointer;min-height:36px;padding:0 6px;font:inherit;font-weight:700}
.pgs-toast .x{color:#fff!important;min-width:36px}
.pgs-modal{position:fixed;left:50%;top:32vh;transform:translateX(-50%);z-index:1001;width:min(380px,calc(100% - 20px));box-sizing:border-box;border-radius:10px;background:var(--paper);border:1px solid var(--line);box-shadow:0 10px 30px rgba(0,0,0,.35);padding:14px 16px}
.pgs-modal b{display:block;font-size:1.02rem;margin-bottom:6px}
.pgs-modal p{margin:0 0 10px;word-break:break-word}
.pgs-modal .bt{display:flex;justify-content:flex-end;gap:8px}
.pgs-modal .bt button{min-height:38px;min-width:72px;padding:4px 14px;border:1px solid var(--line);border-radius:18px;background:var(--paper);cursor:pointer;font-weight:700}
.pgs-modal .bt button.prim{background:var(--accent);color:var(--accentInk)!important;border-color:var(--accent)}
.pgs-dlg{position:fixed;left:50%;top:max(64px,8vh);transform:translateX(-50%);z-index:1000;width:min(560px,calc(100vw - 16px));max-height:calc(100vh - 84px);box-sizing:border-box;display:flex;flex-direction:column;border:1px solid #8a8a8a;border-radius:8px;background:var(--paper);box-shadow:0 10px 30px rgba(0,0,0,.35);overflow:hidden;font-family:"Segoe UI",system-ui,sans-serif;font-size:.88rem}
.pgs-dlg .cap{display:flex;justify-content:space-between;align-items:center;padding:2px 2px 2px 12px;background:var(--paper2);border-bottom:1px solid var(--line)}
.pgs-dlg .bara{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--line)}
.pgs-dlg .bara .adr{flex:1;min-width:0;border:1px solid var(--line);border-radius:4px;padding:6px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pgs-dlg .sus{min-width:36px;min-height:36px;border:1px solid var(--line);border-radius:4px;background:var(--paper);cursor:pointer}
.pgs-dlg .sus[disabled]{opacity:.45;cursor:default}
.pgs-dlg .mij{display:grid;grid-template-columns:150px 1fr;min-height:150px;overflow:auto;flex:1}
.pgs-dlg .st{display:flex;flex-direction:column;gap:2px;padding:6px;border-right:1px solid var(--line);background:var(--paper2)}
.pgs-dlg .st button{min-height:36px;border:0;border-radius:4px;background:transparent;text-align:left;padding:4px 8px;cursor:pointer;font:inherit}
.pgs-dlg .st button.on,.pgs-dlg .st button:hover{background:var(--sel)}
.pgs-dlg .lst{display:flex;flex-direction:column;padding:4px;min-width:0}
.pgs-dlg .lst .hd{display:grid;grid-template-columns:1fr auto;gap:8px;padding:2px 8px 4px;color:var(--ink2);font-size:.8rem;border-bottom:1px solid var(--line)}
.pgs-dlg .lst .r{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;min-height:38px;border:0;border-radius:4px;background:transparent;text-align:left;padding:2px 8px;cursor:pointer;font:inherit}
.pgs-dlg .lst .r:hover{background:var(--paper2)}
.pgs-dlg .lst .r.ales{background:var(--sel);outline:1px solid var(--accent)}
.pgs-dlg .lst .r .n{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pgs-dlg .lst .r .m{color:var(--ink2);font-size:.82rem;white-space:nowrap}
.pgs-dlg .lst .gol{padding:14px 8px;color:var(--ink2)}
.pgs-dlg .jos{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px;border-top:1px solid var(--line)}
.pgs-dlg .jos label{flex:1;min-width:180px;display:flex;align-items:center;gap:6px}
.pgs-dlg .jos label input{flex:1;min-width:0;min-height:34px;border:1px solid var(--line);border-radius:4px;padding:2px 6px;background:var(--paper);color:var(--ink);font:inherit}
.pgs-dlg .jos .bt{display:flex;gap:6px;margin-left:auto}
.pgs-dlg .jos .bt button{min-height:36px;min-width:92px;border:1px solid var(--line);border-radius:4px;background:var(--paper);cursor:pointer;font:inherit}
.pgs-dlg .jos .bt button.prim{background:var(--accent);color:var(--accentInk)!important;border-color:var(--accent)}
.pgs-dlg .err{margin:0;padding:0 8px 6px;color:var(--bad);font-size:.84rem}
.pgs-dlg .err:empty{display:none}
.pgs-dlg .nota{margin:0;padding:6px 8px;font-size:.78rem;color:var(--ink2);background:var(--paper2);border-top:1px solid var(--line)}
.pgs-panou-on .pg-ecran{min-height:520px}
@media (max-width:560px){
 .pgs-panou-on .pg-panou{position:relative;inset:auto;width:auto;margin:8px}
 .pgs-panou-on .pg-ecran{min-height:300px}
 .pgs-sub,.pgs-atas-msg{margin-left:0}
 /* N3 (judecata 2): pe telefon, Către are rândul lui întreg sub etichetă, ca adresa de 33 de semne să se vadă toată */
 .pgs-r.pgs-catre{flex-wrap:wrap;row-gap:0}
 .pgs-r.pgs-catre .et,.pgs-r.pgs-catre .pgs-et-b{order:1;flex:1 1 auto}
 .pgs-r.pgs-catre .pgs-lk{order:2}
 .pgs-r.pgs-catre textarea.pgs-ad{order:3;flex:1 1 100%;font-size:.84rem;min-height:3.3em}
 .pgs-sub{padding-left:8px;padding-right:8px}
 .pgs-dlg .mij{grid-template-columns:1fr}
 .pgs-dlg .st{flex-direction:row;flex-wrap:wrap;border-right:0;border-bottom:1px solid var(--line)}
}
`;
function stil(){if(document.getElementById('pgs-stil'))return;const s=document.createElement('style');s.id='pgs-stil';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fd=B.faraDiacritice;
const norm=s=>fd(String(s||'')).toLowerCase().replace(/\s+/g,' ').trim();
const ATR='autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore data-form-type="other"';

/* ---------------- constante (numele: ajutorul Gmail în română, vezi lectii/vi/m2-l14/surse.md) ---------------- */
const KB=1024,MB=1024*1024,LIMITA_MB=25;
const DAEMON={nume:'Mail Delivery Subsystem',adresa:'mailer-daemon@googlemail.com'};
const SUBIECT_INTORS='Notificare privind starea livrării (eroare)';
const SALUTURI=['buna ziua','buna seara','buna dimineata','buna','salut','salutare','draga','dragi','dragul','stimate','stimata','doamna','domnule','doamnelor','hei','hello','sarut mana','sarutmana','ce faci'];
/* fișierele inventate ale elevului din exercițiu (numele lui de familie, fără diacritice, ca la lecția 3: Anotimp_6A_Nume) */
function fisiereImplicite(cont){const f=fd(String((cont&&cont.nume)||'Elev').trim().split(/\s+/).pop()).replace(/[^A-Za-z0-9]/g,'')||'Elev';
  return {
  'Documente':[
    {nume:'TIC_6A',folder:[
      {nume:`Anotimp_6A_${f}.pptx`,marime:1258291},
      {nume:`Plante_6A_${f}.pptx`,marime:2202010},
      {nume:`Vulcanii_6A_${f}.pptx`,marime:3670016}]},
    {nume:'Compunere_iarna.docx',marime:24*KB}],
  'Descărcări':[
    {nume:'Fisa_concurs.pdf',marime:180*KB},
    {nume:'Harta_excursiei.png',marime:850*KB},
    {nume:'Film_serbare.mp4',marime:380*MB}]}}
const marimeScurta=b=>b>=MB?(Math.round(b/MB*10)/10).toString().replace('.',',')+' MB':Math.max(1,Math.round(b/KB))+' KB';
const marimeKB=b=>Math.ceil(b/KB).toLocaleString('ro-RO')+' KB';   // ca în fereastra Windows (lecția V/9: „3.850 KB”)
const acum=()=>{const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
/* adresele dintr-un câmp: despărțite cu virgulă sau punct și virgulă; „Nume <adresa>” → adresa */
function adrese(t){return (Array.isArray(t)?t:String(t||'').split(/[,;\r\n]+/)).map(x=>{x=String(x).trim();const m=x.match(/<([^<>]*)>/);return m?m[1].trim():x}).filter(Boolean)}
/* Gmail nu trimite deloc la o adresă fără @, cu doi @, cu spații sau goală de o parte (eroare); restul pleacă și,
   dacă adresa nu există, se întorc (diacriticele și domeniul fără punct: pleacă și se întorc — NESIGUR, surse.md) */
function recunoscuta(a){const n=(a.match(/@/g)||[]).length,i=a.indexOf('@');return n===1&&i>0&&i<a.length-1&&!/\s/.test(a)}
const egalAdrese=(a,b)=>{const x=adrese(a).map(s=>s.toLowerCase()).sort(),y=adrese(b).map(s=>s.toLowerCase()).sort();return x.length===y.length&&x.every((v,i)=>v===y[i])};

/* ---------------- creeaza(): căsuța cu scriere ---------------- */
function creeaza(root,O0){
  stil();const O=Object.assign({},O0||{});
  const cont=O.cont||Object.values(B.CONTURI)[0],FIS=O.fisiere||fisiereImplicite(cont),LIM=(O.limitaMB||LIMITA_MB)*MB;
  const MES0=O.mesaje||B.MESAJE_IOANA;
  /* cine „există”: datele exercițiului (calculat O DATĂ, ca adresele greșite trimise de elev să nu devină „existente”) */
  const CARTE={};const pune=c=>{if(c&&c.adresa&&!CARTE[c.adresa.toLowerCase()])CARTE[c.adresa.toLowerCase()]=c.nume||c.adresa};
  pune(cont);(O.conturi||[]).forEach(pune);(O.contacte||[]).forEach(pune);
  MES0.forEach(m=>{if(m.lista==='nefinalizate')return;pune(m.de);(m.catre||[]).forEach(pune);(m.cc||[]).forEach(pune)});
  const EXIST=new Set(Object.keys(CARTE).concat((O.existente||[]).map(a=>String(a).toLowerCase())));EXIST.add(DAEMON.adresa);
  (O.negasite||[]).forEach(a=>EXIST.delete(String(a).toLowerCase()));
  const pers=a=>({nume:CARTE[String(a).toLowerCase()]||a,adresa:a});
  const numeDe=t=>adrese(t).map(a=>CARTE[a.toLowerCase()]||a).join(', ');
  const asc={},J=[];let nrId=0,X,b;
  const emite=(n,d)=>{J.push({nume:n,date:d||{},t:Date.now()});(asc[n]||[]).concat(asc['*']||[]).forEach(f=>{try{f(n,d||{})}catch(e){}});
    if(O.laEveniment&&n!=='schimbare')try{O.laEveniment(n,d||{})}catch(e){}};
  function nou(){X={compune:null,trimise:[],ciorne:0,renuntate:0,intoarse:0,anulate:0,verificat:false,dialog:null,modal:null,toast:null}}
  nou();
  /* elementele care trăiesc peste redesenări (posta-gmail.js rescrie căsuța la fiecare schimbare) */
  const el=cls=>{const e=document.createElement('div');e.className=cls;return e};
  const elPanou=el('pgs-mn'),elSub=el('pgs-mn pgs-sub'),elToast=el('pgs-toast'),elDlg=el('pgs-dlg'),elModal=el('pgs-modal');
  elToast.setAttribute('role','status');elDlg.setAttribute('role','dialog');elDlg.setAttribute('aria-label','Deschidere');elModal.setAttribute('role','alertdialog');

  const optBaza=Object.assign({},O,{
    scrie:()=>scrie(),
    actiuniMesaj:[{id:'raspunde',text:'↩ Răspunde',la:(i,m)=>raspunde(m&&m.id,'raspuns')},
      {id:'tuturor',text:'↩ Răspunde tuturor',la:(i,m)=>raspunde(m&&m.id,'tuturor')},
      {id:'redir',text:'↪ Redirecționează',la:(i,m)=>raspunde(m&&m.id,'redir')}].concat(O.actiuniMesaj||[])});
  delete optBaza.laEveniment;
  b=B.creeaza(root,optBaza);
  const mesaj=id=>b.mesaje().find(m=>m.id===id);

  /* ---- fereastra de scriere ---- */
  const compunere=(mod,extra)=>Object.assign({mod,la:null,catre:'',cc:'',ccVizibil:false,subiect:'',corp:'',citat:'',atasate:[],
    dinCiorna:null,atins:false,confirmat:false,nota:'',loc:mod==='nou'?'panou':'sub'},extra||{});
  function hCompunere(c){
    /* reparația din 12.10.2026: Către (și Cc) se pot scrie și la Răspunde / Răspunde tuturor, ca în Gmail; „Către” ca buton
       (agenda lecției 15) rămâne doar la Scrie și Redirecționează, ca înainte */
    const rasp=c.mod==='raspuns'||c.mod==='tuturor',sug=O.contacte?'<div class="pgs-sug" data-sug="catre"></div>':'';
    const et=O.catreClic&&!rasp?`<button type="button" class="pgs-et-b" data-s="catre-clic">Către</button>`:'<span class="et">Către</span>';
    let h='';
    if(rasp)h+=`<div class="pgs-r cine"><span class="et">${c.mod==='tuturor'?'↩ Răspunde tuturor':'↩ Răspunde'}</span></div>`;
    h+=`<div class="pgs-r pgs-catre">${et}<textarea class="pgs-ad" rows="1" data-c="catre" aria-label="Către" ${ATR}>${esc(c.catre)}</textarea>${c.ccVizibil?'':`<button type="button" class="pgs-lk" data-s="cc" title="Adaugă destinatari în Cc">Cc</button>`}<button type="button" class="pgs-lk" data-s="bcc" title="Adaugă destinatari în Bcc">Bcc</button></div>${sug}`;
    if(c.ccVizibil)h+=`<div class="pgs-r"><span class="et">Cc</span><textarea class="pgs-ad" rows="1" data-c="cc" aria-label="Cc" ${ATR}>${esc(c.cc)}</textarea></div>${O.contacte?'<div class="pgs-sug" data-sug="cc"></div>':''}`;
    h+=c.loc==='panou'?`<div class="pgs-r"><input type="text" data-c="subiect" aria-label="Subiect" placeholder="Subiect" value="${esc(c.subiect)}" ${ATR}></div>`
      :`<div class="pgs-sb">Subiectul (îl pune Gmail): ${esc(c.subiect)}</div>`;
    h+=`<textarea class="pgs-corp" data-c="corp" aria-label="Corpul mesajului" rows="5" ${ATR}>${esc(c.corp)}</textarea>`;
    if(c.citat&&c.mod==='redir')h+=`<div class="pgs-citat" aria-label="Mesajul redirecționat">${esc(c.citat)}</div>`;
    else if(c.citat)h+=`<button type="button" class="pgs-lk pgs-trei" data-s="citat" aria-expanded="${c.citatVazut?'true':'false'}" aria-label="Arată mesajul la care răspunzi" title="Arată mesajul la care răspunzi">⋯</button>${c.citatVazut?`<div class="pgs-citat pgs-citat-r" aria-label="Mesajul la care răspunzi">${esc(c.citat)}</div>`:''}`;
    h+=`<div class="pgs-atas">${hAtas(c)}</div><p class="pgs-nota" aria-live="polite">${c.nota||''}</p>
      <div class="pgs-jos"><button type="button" class="pgs-trimite" data-s="trimite">Trimite</button><button type="button" class="pgs-ic" data-s="agrafa" aria-label="Atașează fișiere (agrafa)" title="Atașează fișiere">📎</button><span class="pgs-sp"></span><button type="button" class="pgs-ic" data-s="renunta" aria-label="Renunță (coșul de gunoi)" title="Renunță">🗑</button></div>`;
    return h}
  const hAtas=c=>c.atasate.map((a,k)=>`<span class="pgs-chip${a.drive?' drive':''}"><span aria-hidden="true">${a.drive?'▲':'📄'}</span><b>${esc(a.nume)}</b><span class="mr">${a.drive?'(legătură Google Drive)':'('+marimeScurta(a.marime)+')'}</span><button type="button" class="x" data-s="scoate" data-k="${k}" aria-label="Scoate atașamentul ${esc(a.nume)}" title="Scoate">✕</button></span>`).join('');
  /* M1 (judecata 3): fără `field-sizing` (Firefox, Safari vechi) caseta ar rămâne de un rând; înălțimea o fixăm din JS, mereu (nu strică Chromium) */
  function creste(t){if(!t||!t.classList||!t.classList.contains('pgs-ad')||!t.offsetParent)return;t.style.height='auto';if(t.scrollHeight>0)t.style.height=t.scrollHeight+'px'}
  function cresteToate(){[elPanou,elSub].forEach(e=>e.querySelectorAll('textarea.pgs-ad').forEach(creste))}
  window.addEventListener('resize',cresteToate);
  function elCompunere(){return X.compune&&X.compune.loc==='panou'?elPanou:elSub}
  function construieste(){const c=X.compune;if(!c)return;const e=elCompunere();e.innerHTML=hCompunere(c);setTimeout(cresteToate,0);cresteToate()}
  function redesenezAtas(){const c=X.compune;if(!c)return;const e=elCompunere(),a=e.querySelector('.pgs-atas'),n=e.querySelector('.pgs-nota');if(a)a.innerHTML=hAtas(c);if(n)n.innerHTML=c.nota||''}
  function sugestii(camp){const c=X.compune,e=elCompunere();if(!O.contacte||!c)return;const box=e.querySelector(`[data-sug="${camp}"]`);if(!box)return;
    const parti=String(c[camp]||'').split(/[,;]/),ult=norm(parti[parti.length-1]);
    const l=ult?O.contacte.filter(p=>norm(p.nume).includes(ult)||norm(p.adresa).startsWith(ult)).slice(0,5):[];
    box.innerHTML=l.map(p=>`<button type="button" data-s="sug" data-camp="${camp}" data-adr="${esc(p.adresa)}">${esc(p.nume)} &lt;${esc(p.adresa)}&gt;</button>`).join('')}
  function leagaCompunere(e){
    e.addEventListener('input',ev=>{const i=ev.target.closest('[data-c]');const c=X.compune;if(!i||!c)return;
      if(i.classList.contains('pgs-ad')){if(/[\r\n]/.test(i.value)){const f=i.value.replace(/[ \t]*[\r\n]+[ \t]*/g,', ');i.value=f;try{i.setSelectionRange(f.length,f.length)}catch(_){}}creste(i)}   // m4: lista lipită pe mai multe rânduri
      c[i.dataset.c]=i.value;c.atins=true;c.confirmat=false;
      if(i.dataset.c==='catre'||i.dataset.c==='cc')sugestii(i.dataset.c);emite('camp',{camp:i.dataset.c});emite('schimbare')});
    e.addEventListener('keydown',ev=>{if((ev.ctrlKey||ev.metaKey)&&ev.key==='Enter'){ev.preventDefault();trimite();return}
      /* sugestii (agenda, lecția 15): ↓/↑ aleg în listă, Enter sau Tab pun sugestia aleasă (Tab fără alegere = prima), ca în Gmail; cu lista închisă Enter rămâne oprit, Tab merge mai departe */
      const ad=ev.target.classList&&ev.target.classList.contains('pgs-ad')?ev.target:null;
      if(ad&&!ev.ctrlKey&&!ev.metaKey&&!ev.altKey){const box=e.querySelector(`[data-sug="${ad.dataset.c}"]`),bts=box?[...box.querySelectorAll('button[data-s="sug"]')]:[];
        if(bts.length){const cur=bts.findIndex(z=>z.classList.contains('on'));
          const pune=k=>bts.forEach((z,j)=>{z.classList.toggle('on',j===k);if(j===k)z.setAttribute('aria-current','true');else z.removeAttribute('aria-current')});
          if(ev.key==='ArrowDown'){ev.preventDefault();pune((cur+1)%bts.length);return}
          if(ev.key==='ArrowUp'){ev.preventDefault();pune(cur<=0?bts.length-1:cur-1);return}
          if(ev.key==='Enter'||(ev.key==='Tab'&&!ev.shiftKey)){ev.preventDefault();actiune('sug',bts[cur>=0?cur:0]);return}}}
      if(ev.key==='Enter'&&ad){ev.preventDefault();return}   // adresele: un singur rând logic, doar se înfășoară
      /* Escape în „Mesaj nou” = ✕: păstrează în Mesaje nefinalizate (ajutorul Gmail, S11) — doar dacă nu e deschisă altă fereastră */
      if(ev.key==='Escape'&&!ev.defaultPrevented&&e===elPanou&&X.compune&&X.compune.loc==='panou'&&!X.dialog&&!X.modal
        &&![...root.querySelectorAll('[role="dialog"],[role="alertdialog"]')].some(d=>!d.classList.contains('pg-panou')&&d.offsetParent!==null)){
        ev.preventDefault();inchide();setTimeout(()=>{const f=root.querySelector('[data-a="scrie"]');if(f&&document.contains(f))try{f.focus({preventScroll:true})}catch(_){}},0)}});
    e.addEventListener('pointerdown',ev=>{const t=ev.target.closest&&ev.target.closest('textarea.pgs-ad');if(t)t._nou=document.activeElement!==t},true);
    e.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('textarea.pgs-ad');   // m3: prima atingere într-o casetă cu adrese pune cursorul la sfârșit
      if(t&&t._nou){t._nou=false;try{t.setSelectionRange(t.value.length,t.value.length)}catch(_){}}});
    e.addEventListener('click',ev=>{const bt=ev.target.closest('[data-s]');if(!bt||!e.contains(bt))return;ev.preventDefault();actiune(bt.dataset.s,bt)})}
  leagaCompunere(elPanou);leagaCompunere(elSub);
  function actiune(s,bt){const c=X.compune;
    if(s==='trimite')trimite();
    else if(s==='agrafa')deschideDialog();
    else if(s==='renunta')renunta();
    else if(s==='cc')arataCc();
    else if(s==='bcc'&&c){c.nota='Bcc (copie ascunsă) nu-l folosim în lecția aceasta.';redesenezAtas()}
    else if(s==='scoate'&&c){const a=c.atasate.splice(+bt.dataset.k,1)[0];c.atins=true;c.nota='';redesenezAtas();if(a)emite('atasament-scos',{nume:a.nume});emite('schimbare')}
    else if(s==='sug'){adaugaDestinatar(bt.dataset.adr,bt.dataset.camp,true);const sc=bt.dataset.camp;sugestii(sc);
      setTimeout(()=>{const f=elCompunere().querySelector(`[data-c="${sc}"]`);if(f&&document.contains(f)){try{f.focus({preventScroll:true});f.setSelectionRange(f.value.length,f.value.length)}catch(_){}}},0)}
    else if(s==='citat')arataCitat();
    else if(s==='catre-clic'&&O.catreClic)O.catreClic(inst)}
  function focus(sel){setTimeout(()=>{const e=elCompunere(),f=e.querySelector(sel);if(f&&document.contains(f)){try{f.focus({preventScroll:true})}catch(_){}}
    if(e&&document.contains(e)&&e.scrollIntoView&&window.innerWidth<=560){try{e.scrollIntoView({block:'nearest'})}catch(_){}}},0)}

  function deschideCompunerea(c){
    if(X.compune){const v=X.compune;X.compune=null;if(v.loc==='panou'&&b.stare().panou)b.inchidePanou();salveazaCiorna(v)}
    X.compune=c;X.modal=null;X.dialog=null;X.toast=null;construieste();   // „Mesaj trimis” nu stă peste fereastra nouă (telefon)
    if(c.loc==='panou')b.arataPanou(elPanou,c.mod==='nou'?'Mesaj nou':(c.subiect||'Mesaj nou'));else b.redeseneaza();
    focus(c.mod==='raspuns'||c.mod==='tuturor'?'[data-c="corp"]':'[data-c="catre"]');
    emite('scrie-deschis',{mod:c.mod,la:c.la});return true}
  function scrie(){const s=b.stare();if(!s.conectat||s.ecran!=='casuta')return false;emite('scrie');return deschideCompunerea(compunere('nou'))}
  function raspunde(id,mod){const s=b.stare();if(!s.conectat)return false;id=id||s.deschis;const m=mesaj(id);if(!m||m.lista==='nefinalizate')return false;
    if(s.deschis!==id)b.deschideMesaj(id);
    const eu=cont.adresa.toLowerCase(),ad=p=>p.adresa;let catre=[],cc=[];
    if(mod!=='redir'){
      if(m.de.adresa.toLowerCase()===eu)catre=(m.catre||[]).map(ad);   // răspuns la un mesaj trimis de tine: merge la destinatarii lui
      else{catre=[m.de.adresa];if(mod==='tuturor'){catre=catre.concat((m.catre||[]).map(ad).filter(a=>a.toLowerCase()!==eu));cc=(m.cc||[]).map(ad).filter(a=>a.toLowerCase()!==eu)}}}
    const pref=mod==='redir'?'Fwd:':'Re:',sb=String(m.subiect||'');
    const subiect=sb.toLowerCase().startsWith(pref.toLowerCase())?sb:pref+' '+sb;
    const pp=p=>`${p.nume} <${p.adresa}>`;
    /* redirecționare: mesajul întreg, la vedere; răspuns: mesajul citat, ascuns sub „⋯” (forma rândului de sus: NESIGUR, C4) */
    const citat=mod==='redir'?`----- Mesaj redirecționat -----\nDe la: ${pp(m.de)}\nData: ${m.data}${m.ora?', '+m.ora:''}\nSubiect: ${m.subiect}\nCătre: ${(m.catre||[]).map(pp).join(', ')}${(m.cc||[]).length?'\nCc: '+m.cc.map(pp).join(', '):''}\n\n${m.corp||''}${m.semnatura?'\n'+m.semnatura:''}`
      :`Pe ${m.data}${m.ora?', la '+m.ora:''}, ${pp(m.de)} a scris:\n${m.corp||''}${m.semnatura?'\n'+m.semnatura:''}`;
    deschideCompunerea(compunere(mod,{la:id,catre:catre.join(', '),cc:cc.join(', '),ccVizibil:!!cc.length,subiect,citat,
      atasate:mod==='redir'?JSON.parse(JSON.stringify(m.atasate||[])):[],loc:'sub'}));
    emite(mod==='redir'?'redirectioneaza':'raspunde',{id,mod});return true}
  function arataCitat(da){const c=X.compune;if(!c||!c.citat||c.mod==='redir')return false;c.citatVazut=da==null?!c.citatVazut:!!da;construieste();
    emite('citat',{deschis:c.citatVazut});focus('[data-s="citat"]');return true}
  function arataCc(){const c=X.compune;if(!c||c.ccVizibil)return;c.ccVizibil=true;construieste();emite('cc');focus('[data-c="cc"]');emite('schimbare')}
  function completeaza(camp,text){const c=X.compune;if(!c||['catre','cc','subiect','corp'].indexOf(camp)<0)return false;
    if(camp==='cc'&&!c.ccVizibil)arataCc();c[camp]=String(text==null?'':text);c.atins=true;c.confirmat=false;
    const i=elCompunere().querySelector(`[data-c="${camp}"]`);if(i){i.value=c[camp];creste(i)}emite('camp',{camp});emite('schimbare');return true}
  function adaugaDestinatar(a,camp,dinSugestie){camp=camp==='cc'?'cc':'catre';const c=X.compune;if(!c)return false;
    let t=String(c[camp]||'');if(dinSugestie){const p=t.split(/[,;]/);p.pop();t=p.join(',')}
    if(adrese(t).some(z=>z.toLowerCase()===String(a).toLowerCase()))return completeaza(camp,t.trim()?t.trim().replace(/[,;]\s*$/,'')+', ':'');   // aceeași adresă nu se adaugă de două ori
    t=(t.trim()?t.trim().replace(/[,;]\s*$/,'')+', ':'')+a+', ';return completeaza(camp,t)}
  function salveazaCiorna(c){if(!c||!c.atins)return null;
    if(c.dinCiorna)b.mutaMesaj(c.dinCiorna,'_inlocuit');
    const m={id:'nef-'+(++nrId),lista:'nefinalizate',de:pers(cont.adresa),catre:adrese(c.catre).map(pers),cc:adrese(c.cc).map(pers),
      subiect:c.subiect,corp:c.corp+(c.citat?'\n\n'+c.citat:''),data:acum(),citit:true,atasate:c.atasate.slice(),
      _c:{mod:c.mod,la:c.la,catre:c.catre,cc:c.cc,subiect:c.subiect,corp:c.corp,citat:c.citat}};
    X.ciorne++;b.adaugaMesaj(m);emite('ciorna',{id:m.id});return m.id}
  function inchide(){const c=X.compune;if(!c)return false;X.compune=null;X.dialog=null;X.modal=null;if(c.loc==='panou'&&b.stare().panou)b.inchidePanou();
    salveazaCiorna(c);b.redeseneaza();return true}
  function renunta(){const c=X.compune;if(!c)return false;X.compune=null;X.dialog=null;X.modal=null;if(c.loc==='panou'&&b.stare().panou)b.inchidePanou();
    if(c.dinCiorna)b.mutaMesaj(c.dinCiorna,'_renuntat');X.renuntate++;emite('renuntat',{});b.redeseneaza();return true}
  /* un mesaj din Mesaje nefinalizate se deschide în fereastra de scriere (ca în Gmail), nu ca mesaj de citit */
  function deschideCiorna(m){const k=m._c||{};
    const c=compunere(k.mod||'nou',{la:k.la||null,catre:k.catre!=null?k.catre:(m.catre||[]).map(p=>p.adresa).join(', '),
      cc:k.cc!=null?k.cc:(m.cc||[]).map(p=>p.adresa).join(', '),subiect:k.subiect!=null?k.subiect:(m.subiect||''),
      corp:k.corp!=null?k.corp:(m.corp||''),citat:k.citat||'',atasate:JSON.parse(JSON.stringify(m.atasate||[])),dinCiorna:m.id,loc:'panou'});
    c.ccVizibil=!!c.cc;deschideCompunerea(c);b.deschideLista('nefinalizate');emite('ciorna-deschisa',{id:m.id})}

  /* ---- Trimite ---- */
  function arataModal(titlu,text,intrebare){X.modal={titlu,text,intrebare:!!intrebare};cur();
    setTimeout(()=>{const f=elModal.querySelector('button.prim');if(f&&document.contains(f))try{f.focus({preventScroll:true})}catch(_){}},0)}
  function trimite(){const c=X.compune;if(!c)return false;
    const to=adrese(c.catre),cc=adrese(c.cc),toate=to.concat(cc);
    if(!toate.length){arataModal('Eroare','Specifică cel puțin un destinatar.');emite('eroare',{motiv:'fara-destinatar'});return false}
    const rea=toate.find(a=>!recunoscuta(a));
    if(rea){arataModal('Eroare',`Adresa „${rea}” din câmpul ${to.indexOf(rea)>=0?'Către':'Cc'} nu a fost recunoscută. Verifică adresa semn cu semn.`);emite('eroare',{motiv:'adresa',adresa:rea});return false}
    /* întrebarea doar când chiar lipsește ceva: subiectul, sau orice text (la Răspunde / Redirecționează mesajul primit e text) */
    if((!c.subiect.trim()||(!c.corp.trim()&&!String(c.citat||'').trim()))&&!c.confirmat){arataModal('','Trimiți acest mesaj fără subiect sau fără text în corpul mesajului?',true);emite('intrebare',{});return false}
    const id='t-'+(++nrId),t=acum();
    X.compune=null;X.modal=null;X.dialog=null;
    if(c.loc==='panou'&&b.stare().panou)b.inchidePanou();
    if(c.dinCiorna)b.mutaMesaj(c.dinCiorna,'_trimis');
    const m={id,lista:'trimise',de:pers(cont.adresa),catre:to.map(pers),cc:cc.map(pers),subiect:c.subiect.trim()||'(fără subiect)',
      corp:c.corp+(c.citat?'\n\n'+c.citat:''),data:t,citit:true,atasate:c.atasate.slice()};
    const rec={id,tip:c.mod,la:c.la,catre:to,cc,subiect:c.subiect.trim(),corp:c.corp,citat:c.citat,atasate:c.atasate.slice(),dinCiorna:c.dinCiorna,intoarse:[]};
    X.trimise.push(rec);X.verificat=false;b.adaugaMesaj(m);
    if(toate.some(a=>a.toLowerCase()===cont.adresa.toLowerCase()))b.adaugaMesaj(Object.assign({},m,{id:id+'-p',lista:'primite',citit:false}));
    const neg=toate.filter(a=>!EXIST.has(a.toLowerCase()));
    if(neg.length){rec.intoarse=neg;X.intoarse++;
      b.adaugaMesaj({id:'int-'+id,lista:'primite',de:DAEMON,catre:[pers(cont.adresa)],subiect:SUBIECT_INTORS,data:t,citit:false,
        corp:`Adresa nu a fost găsită\n\nMesajul tău nu a fost livrat către ${neg.join(', ')}, pentru că adresa nu a fost găsită sau nu poate primi e-mailuri.\n\nSubiectul mesajului tău: „${m.subiect}”.`});
      emite('intors',{id,adrese:neg})}
    X.toast={id};const tid=id;setTimeout(()=>{if(X.toast&&X.toast.id===tid){X.toast=null;cur()}},1000*(+O.anulareSec>0?+O.anulareSec:10));
    emite('trimis',{id,tip:c.mod});b.redeseneaza();return true}
  function confirma(da){if(!X.modal)return false;const q=X.modal.intrebare;X.modal=null;cur();
    if(q&&da&&X.compune){X.compune.confirmat=true;return trimite()}
    if(!q||!da)focus('[data-c="subiect"],[data-c="corp"]');return false}
  function anuleazaTrimiterea(){const t=X.toast;if(!t)return false;const i=X.trimise.findIndex(r=>r.id===t.id);if(i<0)return false;
    const r=X.trimise.splice(i,1)[0];X.toast=null;X.anulate++;
    b.mutaMesaj(r.id,'_anulat');b.mutaMesaj(r.id+'-p','_anulat');if(r.intoarse.length){b.mutaMesaj('int-'+r.id,'_anulat');X.intoarse--}
    deschideCompunerea(compunere(r.tip,{la:r.la,catre:r.catre.join(', '),cc:r.cc.join(', '),ccVizibil:!!r.cc.length,subiect:r.subiect,corp:r.corp,
      citat:r.citat,atasate:r.atasate,atins:true,loc:'panou'}));emite('anulat',{id:r.id});return true}
  function afiseazaMesajul(){const t=X.toast;if(!t)return false;X.toast=null;return b.deschideMesaj(t.id)}

  /* ---- fereastra Deschidere (desen; fișiere inventate) ---- */
  function iteme(){const d=X.dialog;let l=FIS[d.loc]||[];d.cale.forEach(n=>{const f=l.find(x=>x.nume===n&&x.folder);l=f?f.folder:[]});return l}
  function deschideDialog(){if(!X.compune)return false;X.dialog={loc:Object.keys(FIS)[0],cale:[],ales:null,err:''};cur();emite('dialog',{deschis:true});
    setTimeout(()=>{const f=elDlg.querySelector('.lst .r,[data-s="dlg-x"]');if(f&&document.contains(f))try{f.focus({preventScroll:true})}catch(_){}},0);return true}
  function alegeLoc(loc){if(!X.dialog||!FIS[loc])return false;Object.assign(X.dialog,{loc,cale:[],ales:null,err:''});cur();return true}
  function alegeFisier(nume){if(!X.dialog)return false;const f=iteme().find(x=>x.nume===nume);if(!f)return false;X.dialog.ales=f.nume;X.dialog.err='';cur();return true}
  function deschidereDialog(){const d=X.dialog;if(!d)return false;const inp=elDlg.querySelector('[data-dlg="nume"]');
    const n=String((inp&&document.contains(inp)?inp.value:d.ales)||'').trim();
    const f=iteme().find(x=>x.nume.toLowerCase()===n.toLowerCase());
    if(!f){d.err=n?`Nu găsim „${n}” în folderul acesta. Verifică numele.`:'Alege un fișier din listă.';cur();return false}
    if(f.folder){d.cale.push(f.nume);d.ales=null;d.err='';cur();return true}
    X.dialog=null;ataseazaFisier(f);emite('dialog',{deschis:false});return true}
  function anuleazaDialog(){if(!X.dialog)return false;X.dialog=null;cur();emite('dialog',{deschis:false});focus('[data-s="agrafa"]');return true}
  function ataseazaFisier(f){const c=X.compune;if(!c)return false;c.atins=true;
    if(f.marime>LIM){c.atasate.push({nume:f.nume,marime:f.marime,drive:true});
      c.nota=`„${esc(f.nume)}” are ${marimeScurta(f.marime)}, peste limita de ${O.limitaMB||LIMITA_MB} MB: Gmail nu-l atașează ca fișier, ci pune în mesaj o legătură spre el, în Google Drive. (La contul de la școală, limita o stabilește școala.)`}
    else{c.atasate.push({nume:f.nume,marime:f.marime});c.nota=''}
    cur();redesenezAtas();emite('atasat',{nume:f.nume,drive:f.marime>LIM});emite('schimbare');focus('[data-s="trimite"]');return true}
  function cauta(nume){for(const loc of Object.keys(FIS)){const st=[[loc,[],FIS[loc]]];while(st.length){const [l,cale,lst]=st.shift();
    for(const f of lst){if(f.folder)st.push([l,cale.concat(f.nume),f.folder]);else if(f.nume===nume)return {loc:l,cale}}}}return null}
  function ataseaza(nume){if(!X.compune)return false;const u=cauta(nume);if(!u)return false;deschideDialog();
    X.dialog.loc=u.loc;X.dialog.cale=u.cale.slice();X.dialog.ales=nume;cur();return deschidereDialog()}
  function scoateAtasament(nume){const c=X.compune;if(!c)return false;const k=c.atasate.findIndex(a=>a.nume===nume);if(k<0)return false;
    c.atasate.splice(k,1);c.atins=true;c.nota='';redesenezAtas();emite('atasament-scos',{nume});emite('schimbare');return true}
  function hDialog(){const d=X.dialog,l=iteme();
    return `<div class="cap"><span>Deschidere</span><button type="button" class="pg-x" data-s="dlg-x" aria-label="Închide (Anulare)" title="Închide">✕</button></div>
      <div class="bara"><button type="button" class="sus" data-s="dlg-sus" aria-label="Până la folderul de deasupra" title="Până la folderul de deasupra"${d.cale.length?'':' disabled'}>↑</button><span class="adr">${[d.loc].concat(d.cale).map(esc).join(' › ')}</span></div>
      <div class="mij"><nav class="st" aria-label="Locuri">${Object.keys(FIS).map(k=>`<button type="button" data-s="dlg-loc" data-loc="${esc(k)}" class="${k===d.loc&&!d.cale.length?'on':''}">${k==='Descărcări'?'⬇':'🗎'} ${esc(k)}</button>`).join('')}</nav>
       <div class="lst"><div class="hd"><span>Nume</span><span>Dimensiune</span></div>${l.length?l.map((f,i)=>`<button type="button" class="r${d.ales===f.nume?' ales':''}" data-s="dlg-f" data-i="${i}" aria-pressed="${d.ales===f.nume}"><span aria-hidden="true">${f.folder?'📁':'📄'}</span><span class="n">${esc(f.nume)}</span><span class="m">${f.folder?'Folder':marimeKB(f.marime)}</span></button>`).join(''):'<div class="gol">Folderul e gol.</div>'}</div></div>
      <div class="jos"><label><span>Nume fișier:</span><input type="text" data-dlg="nume" aria-label="Nume fișier" value="${esc(d.ales||'')}" ${ATR}></label>
       <div class="bt"><button type="button" class="prim" data-s="dlg-ok">Deschidere</button><button type="button" data-s="dlg-x">Anulare</button></div></div>
      <p class="err" aria-live="polite">${esc(d.err||'')}</p>
      <p class="nota">Desen al ferestrei Windows. Fișierele sunt inventate: nimic nu se ia de pe calculatorul tău. Un clic alege fișierul, dublu clic (sau Deschidere) îl atașează.</p>`}
  let ultimClic={i:-1,t:0};
  elDlg.addEventListener('click',ev=>{const bt=ev.target.closest('[data-s]');if(!bt||!X.dialog)return;const s=bt.dataset.s;
    if(s==='dlg-x')anuleazaDialog();
    else if(s==='dlg-ok')deschidereDialog();
    else if(s==='dlg-sus'){X.dialog.cale.pop();X.dialog.ales=null;X.dialog.err='';cur()}
    else if(s==='dlg-loc')alegeLoc(bt.dataset.loc);
    else if(s==='dlg-f'){const i=+bt.dataset.i,f=iteme()[i];if(!f)return;const t=Date.now(),dublu=ultimClic.i===i&&t-ultimClic.t<450;ultimClic={i,t};
      X.dialog.ales=f.nume;X.dialog.err='';if(dublu){ultimClic={i:-1,t:0};deschidereDialog()}else{cur();const r=elDlg.querySelector(`[data-i="${i}"]`);if(r)try{r.focus({preventScroll:true})}catch(_){}}}});
  elDlg.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&ev.target.closest('[data-dlg="nume"]')){ev.preventDefault();deschidereDialog()}
    else if(ev.key==='Escape'){ev.preventDefault();anuleazaDialog()}});
  elModal.addEventListener('click',ev=>{const bt=ev.target.closest('[data-s]');if(!bt)return;confirma(bt.dataset.s==='modal-ok')});
  elModal.addEventListener('keydown',ev=>{if(ev.key==='Escape'){ev.preventDefault();confirma(false)}});   // Escape = Anulare / închide eroarea
  elToast.addEventListener('click',ev=>{const bt=ev.target.closest('[data-s]');if(!bt)return;const s=bt.dataset.s;
    if(s==='anuleaza')anuleazaTrimiterea();else if(s==='afiseaza')afiseazaMesajul();else{X.toast=null;cur()}});

  /* ---- după fiecare redesenare a căsuței: pun la loc ce e al extensiei ---- */
  function cur(){
    const pg=root.querySelector('.pg');if(!pg)return;const s=b.stare(),c=X.compune;
    root.classList.toggle('pgs-panou-on',!!(c&&c.loc==='panou'));root.classList.toggle('pgs-on-sub',!!(c&&c.loc==='sub'));root.classList.toggle('pgs-dlg-on',!!X.dialog);
    const M=b.mesaje(),dupa={};M.forEach(m=>{dupa[m.id]=m});
    /* agrafa în listă, la mesajele cu fișiere */
    root.querySelectorAll('.pg-rand[data-m]').forEach(r=>{const m=dupa[r.dataset.m];if(m&&(m.atasate||[]).length&&!r.querySelector('.pgs-clip')){const d=r.querySelector('.dt');if(d)d.insertAdjacentHTML('afterbegin','<span class="pgs-clip" aria-label="are fișier atașat" title="Are fișier atașat">📎</span>')}});
    const mm=root.querySelector('.pg-msg'),m=s.deschis&&dupa[s.deschis];
    if(mm&&m&&m.lista!=='nefinalizate'){
      if((m.atasate||[]).length&&!mm.querySelector('.pgs-atas-msg')){const box=document.createElement('div');box.className='pgs-atas-msg';box.setAttribute('aria-label','Fișiere atașate');
        box.innerHTML=m.atasate.map(a=>a.drive?`<span class="pgs-card"><span aria-hidden="true">▲</span><span>${esc(a.nume)}</span><span class="mr">legătură Google Drive</span></span>`
          :`<span class="pgs-card"><span aria-hidden="true">📄</span><span>${esc(a.nume)}</span><span class="mr">${marimeScurta(a.marime)}</span></span>`).join('');
        const act=mm.querySelector('.pg-act');if(act)mm.insertBefore(box,act);else mm.appendChild(box)}
      /* „Răspunde tuturor” doar când mesajul a avut mai mulți destinatari (ca în Gmail; NESIGUR, surse.md) */
      const rt=mm.querySelector('[data-act="tuturor"]');if(rt&&((m.catre||[]).length+(m.cc||[]).length)<2)rt.remove()}
    if(c&&c.loc==='sub'&&mm&&s.deschis===c.la){if(!mm.contains(elSub))mm.appendChild(elSub)}else if(elSub.parentNode)elSub.remove();
    /* „Mesaj trimis”, fereastra Deschidere, întrebările: fiecare e adus în ecran o dată, la apariție (cât mai puțină derulare) */
    const vezi=(e,o)=>{if(o.vazut)return;o.vazut=true;setTimeout(()=>{if(document.contains(e)&&e.scrollIntoView)try{e.scrollIntoView({block:'nearest'})}catch(_){}},0)};
    if(X.toast){elToast.innerHTML='<span>Mesaj trimis</span><button type="button" data-s="anuleaza">Anulează</button><button type="button" data-s="afiseaza">Afișează mesajul</button><button type="button" class="x" data-s="toast-x" aria-label="Închide" title="Închide">✕</button>';if(!pg.contains(elToast))pg.appendChild(elToast);vezi(elToast,X.toast)}else elToast.remove();
    if(X.dialog&&c){elDlg.innerHTML=hDialog();if(!pg.contains(elDlg))pg.appendChild(elDlg)}else{X.dialog=null;elDlg.remove()}
    if(X.modal){const q=X.modal;elModal.innerHTML=`${q.titlu?`<b>${esc(q.titlu)}</b>`:''}<p>${esc(q.text)}</p><div class="bt">${q.intrebare?'<button type="button" data-s="modal-nu">Anulare</button>':''}<button type="button" class="prim" data-s="modal-ok">OK</button></div>`;if(!pg.contains(elModal))pg.appendChild(elModal)}else elModal.remove()}

  b.on('schimbare',()=>{const s=b.stare(),c=X.compune;
    if(c&&c.loc==='panou'&&!s.panou){X.compune=null;X.dialog=null;X.modal=null;salveazaCiorna(c);emite('inchis',{})}        // ✕ din colțul ferestrei
    else if(c&&c.loc==='sub'&&s.deschis!==c.la){X.compune=null;X.dialog=null;X.modal=null;salveazaCiorna(c)}               // ai plecat de la mesaj
    cur();emite('schimbare')});
  b.on('deschide',(n,d)=>{X.toast=null;const m=mesaj(d.id);if(!m)return;
    if(m.lista==='nefinalizate'){deschideCiorna(m);return}
    if(m.lista==='trimise'&&X.trimise.some(r=>r.id===m.id))X.verificat=true});
  b.on('lista',(n,d)=>{X.toast=null;if(d.id==='trimise'&&X.trimise.length)X.verificat=true});
  b.on('deconectat',()=>{const c=X.compune;X.compune=null;X.dialog=null;X.modal=null;X.toast=null;if(c){if(c.loc==='panou')b.inchidePanou();salveazaCiorna(c)}});
  b.on('*',(n,d)=>{if(n!=='schimbare')emite(n,d)});

  const inst=Object.assign({},b,{root,
    on(n,f){(asc[n]=asc[n]||[]).push(f);return ()=>{asc[n]=asc[n].filter(x=>x!==f)}},
    jurnal:()=>J.slice(),
    scrie,completeaza,adaugaDestinatar:(a,camp)=>adaugaDestinatar(a,camp,false),arataCc,ataseaza,scoateAtasament,trimite,confirma,
    inchideEroarea:()=>confirma(false),inchide,renunta,
    raspunde:id=>raspunde(id,'raspuns'),raspundeTuturor:id=>raspunde(id,'tuturor'),redirectioneaza:id=>raspunde(id,'redir'),
    anuleazaTrimiterea,afiseazaMesajul,deschideDialog,alegeLoc,alegeFisier,deschidereDialog,anuleazaDialog,arataCitat,
    stareScrie:()=>{const o=JSON.parse(JSON.stringify(X));   // ciorneInfo (judecata 2, N1): ce fel de mesaj stă acum în Mesaje nefinalizate
      o.cont=cont.adresa;o.ciorneInfo=b.mesaje().filter(m=>m.lista==='nefinalizate'&&m._c).map(m=>({tip:m._c.mod,la:m._c.la}));return o},
    reset(){nou();[elSub,elToast,elDlg,elModal].forEach(e=>e.remove());b.reset()},
    distruge(){nou();b.distruge()}});
  b.redeseneaza();
  return inst}

/* ---------------- testele ---------------- */
const lista=v=>[].concat(v).join(', ');
function randuri(t){return String(t||'').split('\n').map(x=>x.trim()).filter(Boolean)}
const areSalut=corp=>{const r=randuri(corp);if(!r.length)return false;const p=norm(r[0]).replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();return SALUTURI.some(s=>p===s||p.startsWith(s+' '))};
function areSemnatura(corp,nume){const r=randuri(corp);if(r.length<2)return false;const u=norm(r[r.length-1]);return u.split(' ').length<=8&&(!nume||u.includes(norm(nume)))}
/* cuvinte: „vin” = cuvântul întreg; „prezentar*” = orice cuvânt care începe așa (fără diacritice, fără majuscule) */
function areCuvant(text,cuv){const t=' '+norm(text).replace(/[^a-z0-9]+/g,' ')+' ';
  return [].concat(cuv).some(w=>{w=String(w);const p=w.endsWith('*');w=norm(p?w.slice(0,-1):w);return t.includes(' '+w+(p?'':' '))})}
/* candidatul: fereastra deschisă (dacă e de tipul cerut), altfel ultimul mesaj trimis de tipul cerut */
const potriveste=(r,pe)=>!pe||((!pe.tip||[].concat(pe.tip).indexOf(r.tip||r.mod)>=0)&&(!pe.la||r.la===pe.la));
function dinCompunere(c){return {tip:c.mod,la:c.la,catre:adrese(c.catre),cc:adrese(c.cc),subiect:c.subiect,corp:c.corp,citat:c.citat,atasate:c.atasate,deschis:true}}
function candidat(x,pe){const c=x.compune;if(c&&potriveste(c,pe))return dinCompunere(c);
  for(let i=x.trimise.length-1;i>=0;i--)if(potriveste(x.trimise[i],pe))return x.trimise[i];return null}
const NIMIC='Încă n-ai deschis fereastra de scriere (Scrie, Răspunde sau Redirecționează).';
/* Alt buton sau alt mesaj decât cere sarcina (reparația din 12.10.2026, judecata 1: „Încă n-ai deschis fereastra” îl mințea
   pe copilul care deschisese fereastra cu alt buton). x = stareScrie(), pe = {tip, la} al testului, mesaje = inst.mesaje()
   (pentru subiecte), toatePe = toate `pe`-urile sarcinii (un mesaj care e ALTĂ parte a sarcinii nu e o greșeală).
   Întoarce textul pentru elev sau '' (atunci rămâne mesajul obișnuit al testului). */
const BUTON={nou:'Scrie',raspuns:'Răspunde',tuturor:'Răspunde tuturor',redir:'Redirecționează'};
const APASAT={nou:'Ai deschis un mesaj nou, cu Scrie',raspuns:'Ai apăsat Răspunde',tuturor:'Ai apăsat Răspunde tuturor',redir:'Ai apăsat Redirecționează'};
const FACUT={nou:'Ai scris un mesaj nou, cu Scrie',raspuns:'Ai răspuns doar expeditorului (Răspunde)',tuturor:'Ai răspuns tuturor (Răspunde tuturor)',redir:'Ai redirecționat mesajul (Redirecționează)'};
const DE_CE={nou:'ca să scrii un mesaj nou',raspuns:'ca mesajul să plece înapoi doar la cine ți l-a trimis',tuturor:'ca răspunsul să ajungă la toți cei din mesaj',
  redir:'ca mesajul, cu fișierele lui, să plece la cineva care nu l-a primit'};
/* N2a (judecata 2): „Ai răspuns doar expeditorului” doar când chiar așa e; altfel spunem cine a primit și cine nu */
function faptul(f,mesaje){
  if(f.mod!=='raspuns'||!f.r)return FACUT[f.mod];
  const r=f.r,toti=(r.catre||[]).concat(r.cc||[]),o=(mesaje||[]).find(z=>z.id===f.la);
  const nume=a=>{let n=null;(mesaje||[]).forEach(z=>[z.de].concat(z.catre||[],z.cc||[]).forEach(p=>{if(p&&p.adresa&&p.adresa.toLowerCase()===String(a).toLowerCase()&&p.nume)n=p.nume}));return n||a};
  const exp=o&&o.de&&o.de.adresa?o.de.adresa.toLowerCase():null;
  if(!exp)return FACUT.raspuns;
  const extra=toti.filter(a=>a.toLowerCase()!==exp),laExp=toti.some(a=>a.toLowerCase()===exp);
  if(!extra.length)return laExp?FACUT.raspuns:'Ai trimis cu Răspunde, dar expeditorul nu e în Către';
  return `Ai trimis cu Răspunde, iar răspunsul a plecat la ${toti.map(nume).join(', ')}`+(laExp?'':` (expeditorul, ${nume(exp)}, nu l-a primit)`)
    +(o.atasate&&o.atasate.length?`; ${extra.map(nume).join(', ')} ${extra.length>1?'l-au':'l-a'} primit fără fișier, fiindcă la Răspunde fișierele nu pleacă`:'')}
function altTip(x,pe,mesaje,toatePe){
  if(!x||!pe||(!pe.tip&&!pe.la))return '';
  if(x.compune&&potriveste(x.compune,pe))return '';
  if((x.trimise||[]).some(r=>potriveste(r,pe)))return '';
  const k=JSON.stringify(pe),alte=(toatePe||[]).filter(p=>p&&JSON.stringify(p)!==k),altaParte=r=>alte.some(p=>potriveste(r,p));
  const sub=id=>{const m=(mesaje||[]).find(z=>z.id===id);return m?`„${m.subiect}”`:''};
  const cer=[].concat(pe.tip||[]).filter(t=>BUTON[t]),ce=cer.map(t=>BUTON[t]).join(' sau ');
  const unde=pe.la&&sub(pe.la)?`, sub mesajul ${sub(pe.la)}`:'',de=cer.length===1?', '+DE_CE[cer[0]]:'';
  /* N1 (judecata 2): răspunsul/mesajul scris și netrimis a plecat în Mesaje nefinalizate: spunem asta, nu „n-ai deschis fereastra” */
  const dd=(x.ciorneInfo||[]).filter(d=>!altaParte(d)),dr=dd.find(d=>potriveste(d,pe))||(!x.compune&&!(x.trimise||[]).length?dd[dd.length-1]:null),potr=!!dr&&potriveste(dr,pe);
  if(dr){const w={nou:['mesajul','l'],raspuns:['răspunsul','l'],tuturor:['răspunsul','l'],redir:['redirecționarea','o']}[dr.tip]||['mesajul','l'];
    return `Ai scris ${w[0]}, dar nu ${w[1]==='o'?'ai trimis-o':'l-ai trimis'}: e în Mesaje nefinalizate (Drafts) — deschide-${w[1]==='o'?'o':'l'} de acolo și apasă Trimite.`+(potr||!ce?'':` Atenție: aici trebuie ${ce}${unde}.`)}
  const c=x.compune;let f=null;
  if(c&&!altaParte(c))f={mod:c.mod,la:c.la,deschis:true};
  else{const r=(x.trimise||[]).slice().reverse().find(r=>!altaParte(r));if(r)f={mod:r.tip,la:r.la,deschis:false,r}}
  if(!f)return c||(x.trimise||[]).length?`Încă n-ai făcut partea cu ${ce||'mesajul cerut'}${unde}.`:'';
  if(!cer.length||cer.indexOf(f.mod)>=0)   // butonul bun, dar la alt mesaj
    return `${f.deschis?APASAT[f.mod]:(f.mod==='raspuns'?'Ai trimis un răspuns, cu Răspunde,':FACUT[f.mod])} la alt mesaj${f.la&&sub(f.la)?' ('+sub(f.la)+')':''}; aici trebuie tot ${BUTON[f.mod]}, dar${pe.la&&sub(pe.la)?' sub mesajul '+sub(pe.la):' la alt mesaj'}.`+(f.deschis?' Apasă 🗑 (Renunță) și deschide mesajul cerut.':' Deschide mesajul cerut și fă din nou.');
  if(!f.deschis&&f.mod==='raspuns'&&f.r&&cer.length===1&&cer[0]==='tuturor'){   // m2: răspunsul a ajuns totuși la toți
    const o=(mesaje||[]).find(z=>z.id===f.la),eu=String(x.cont||'').toLowerCase(),toti=(f.r.catre||[]).concat(f.r.cc||[]).map(a=>a.toLowerCase());
    if(o&&[o.de].concat(o.catre||[],o.cc||[]).filter(p=>p&&p.adresa&&p.adresa.toLowerCase()!==eu).every(p=>toti.indexOf(p.adresa.toLowerCase())>=0))
      return 'Răspunsul a ajuns la toți, fiindcă i-ai scris singur în Către. Merge și așa, dar aici exersăm Răspunde tuturor: Gmail îi pune pe toți singur, fără nicio literă greșită.'}
  const doarScrie=cer.length===1&&cer[0]==='nou';
  return `${f.deschis?APASAT[f.mod]:faptul(f,mesaje)}; aici ${f.deschis?'trebuie':'trebuia'} ${ce}${unde}${de}.`
    +(f.deschis?` Apasă 🗑 (Renunță), apoi ${ce}.`:doarScrie?' Apasă Scrie, în stânga sus.':` Deschide mesajul și apasă ${ce}.`)}
const TESTE={
  catre:{continut:true,ce:v=>`În Către e ${lista(v)}`,f:(m,v)=>egalAdrese(m.catre,v),
    m:(m,v)=>!m?NIMIC:!m.catre.length?'Câmpul Către e gol.':`În Către trebuie să fie ${lista(v)}. Acum e: ${m.catre.join(', ')}. Verifică semn cu semn.`},
  cc:{continut:true,ce:v=>`În Cc e ${lista(v)}`,f:(m,v)=>adrese(v).every(a=>m.cc.map(x=>x.toLowerCase()).indexOf(a.toLowerCase())>=0),
    m:(m,v)=>!m?NIMIC:!m.cc.length?'Încă n-ai pus pe nimeni în Cc (apasă „Cc”, în dreapta rândului Către).':`În Cc trebuie să fie ${lista(v)}.`},
  faraCc:{continut:true,ce:()=>'Nimeni în Cc',f:m=>!m.cc.length,m:m=>!m?NIMIC:'În Cc nu trebuie nimeni la mesajul acesta.'},
  subiect:{continut:true,ce:()=>'Subiectul spune clar, în câteva cuvinte, despre ce e mesajul',
    f:(m,v)=>{const s=String(m.subiect||'').replace(/^\s*(re|fwd?)\s*:\s*/i,'');return s.trim().split(/\s+/).filter(Boolean).length>=((v&&v.min)||2)&&(!v||!v.cuvinte||areCuvant(s,v.cuvinte))},
    m:(m,v)=>!m?NIMIC:!String(m.subiect||'').trim()?'Subiectul e gol.':`Subiectul trebuie să spună, în câteva cuvinte (cel puțin ${(v&&v.min)||2}), despre ce e mesajul${v&&v.cuvinte?': despre '+(v.despre||String(v.cuvinte[0]).replace('*','…')):''}. Recitește cerința.`},
  salut:{continut:true,ce:()=>'Corpul începe cu un salut (de exemplu „Bună ziua,”)',f:m=>areSalut(m.corp),
    m:m=>!m?NIMIC:'Primul rând din corp e salutul: „Bună ziua,” (sau „Salut,” pentru un coleg).'},
  semnatura:{continut:true,ce:v=>`Pe ultimul rând e semnătura (${v||'numele tău'})`,f:(m,v)=>areSemnatura(m.corp,v),
    m:(m,v)=>!m?NIMIC:`Semnătura stă pe un rând al ei, ultimul din corp: ${v||'numele tău'}.`},
  continut:{continut:true,ce:(v,d)=>d||'Mesajul spune ce trebuie',f:(m,v)=>areCuvant(m.corp,(v&&v.cuvinte)||[]),
    m:(m,v)=>!m?NIMIC:'Recitește cerința: mesajul tău trebuie să spună ce scrie acolo.'},
  atasat:{continut:true,ce:v=>`Fișierul ${v} e atașat`,f:(m,v)=>(m.atasate||[]).some(a=>a.nume===v&&!a.drive),
    m:(m,v)=>!m?NIMIC:(m.atasate||[]).some(a=>a.nume===v&&a.drive)?`${v} e prea mare: a devenit legătură, nu atașament.`:`Încă nu e atașat ${v}: agrafa 📎, apoi fișierul, apoi Deschidere.`},
  faraAtasat:{continut:true,ce:v=>`${v} nu mai e atașat`,f:(m,v)=>!(m.atasate||[]).some(a=>a.nume===v),m:(m,v)=>!m?NIMIC:`Scoate ${v}: ✕ de lângă numele lui.`},
  trimis:{ce:(v,d)=>d||'Ai trimis mesajul (Trimite)',f:(x,v,Q,pe)=>{const cs=testeleContinut(Q,pe);return x.trimise.some(r=>potriveste(r,pe)&&cs.every(t=>t.T.f(r,t.v,Q)))},
    m:(x,v,Q,pe)=>x.trimise.some(r=>potriveste(r,pe))?'Ai trimis un mesaj, dar nu trec toate testele de mai sus. Apasă „Ia-o de la capăt” și verifică înainte de Trimite.':x.compune?'Mesajul e încă deschis: când e gata, apasă Trimite.':'Încă n-ai apăsat Trimite.'},
  nefinalizat:{ce:(v,d)=>d||'Mesajul a rămas în Mesaje nefinalizate',f:x=>x.ciorne>0,m:()=>'Închide fereastra cu ✕ din colțul ei, fără Trimite.'},
  renuntat:{ce:(v,d)=>d||'Ai aruncat mesajul nefinalizat (coșul 🗑, Renunță)',f:x=>x.renuntate>0,m:()=>'Apasă coșul 🗑, jos în dreapta ferestrei de scriere.'},
  neintors:{ce:(v,d)=>d||'Niciun mesaj trimis de tine nu s-a întors',f:x=>!x.trimise.some(r=>r.intoarse.length),
    m:x=>'Un mesaj s-a întors: adresa '+((x.trimise.find(r=>r.intoarse.length)||{}).intoarse||[]).join(', ')+' nu există. Apasă „Ia-o de la capăt”.'},
  verificat:{ce:(v,d)=>d||'După Trimite, te-ai uitat în Trimise',f:x=>x.verificat,m:()=>'Apasă Trimise, în stânga, și uită-te la mesajul tău.'}};
function testeDin(Q){return (Q.teste||[]).map((t,i)=>{const pe=t.pe!==undefined?t.pe:(Q.mesaj||null);
  if(TESTE[t.c]){const T=TESTE[t.c];return {c:t.c,v:t.v,i,pe,T,ce:t.ce||(T.continut?(t.d||T.ce(t.v)):T.ce(t.v,t.d))}}
  const Tb=B.TESTE[t.c];if(!Tb)throw new Error('posta-gmail-scrie: test necunoscut '+t.c);
  return {c:t.c,v:t.v,i,pe,T:Tb,baza:true,ce:t.ce||Tb.ce(Q,t.v,t.d)}})}
function testeleContinut(Q,pe){const k=JSON.stringify(pe||null);return testeDin(Q).filter(t=>!t.baza&&t.T.continut&&JSON.stringify(t.pe||null)===k)}
function toatePeDin(l){const v={};l.forEach(t=>{if(t.pe)v[JSON.stringify(t.pe)]=t.pe});return Object.values(v)}
function evalueaza(Q,inst,fisa){const s=inst.stare(),x=inst.stareScrie(),l=testeDin(Q),tp=toatePeDin(l);let M=null;
  const alt=pe=>altTip(x,pe,M||(M=inst.mesaje?inst.mesaje():[]),tp);
  return l.map(t=>{let ok,m='';
    if(t.baza){ok=!!t.T.f(s,t.v,Q,fisa,t.i);if(!ok&&t.T.m)m=t.T.m(s,t.v,Q,fisa,t.i)}
    else if(t.T.continut){const c=candidat(x,t.pe);ok=!!c&&!!t.T.f(c,t.v,Q);if(!ok)m=(!c&&alt(t.pe))||t.T.m(c,t.v,Q)}
    else{ok=!!t.T.f(x,t.v,Q,t.pe,s);if(!ok)m=(t.c==='trimis'&&alt(t.pe))||t.T.m(x,t.v,Q,t.pe,s)}
    return {c:t.c,ce:t.ce,ok,m}})}

/* ---------------- drumul (rezolvarea, prin metodele lui inst — merge și pe telefon) ---------------- */
const PASI={
  bara:(i,a)=>i.mergiLa(a||'gmail.com'),conecteaza:(i,a,b,Q)=>{const c=(Q.sim&&Q.sim.cont)||Object.values(B.CONTURI)[0];return i.conecteaza(a||c.adresa,b||c.parola)},
  bula:(i,a)=>a==='salveaza'?i.salveazaBula():i.inchideBula(),lista:(i,a)=>i.deschideLista(a),deschide:(i,a)=>i.deschideMesaj(a),iesi:i=>i.deconecteaza(),
  scrie:i=>i.scrie(),catre:(i,a)=>i.completeaza('catre',a),cc:(i,a)=>i.completeaza('cc',a),subiect:(i,a)=>i.completeaza('subiect',a),corp:(i,a)=>i.completeaza('corp',a),
  ataseaza:(i,a)=>i.ataseaza(a),scoate:(i,a)=>i.scoateAtasament(a),trimite:i=>i.trimite(),confirma:i=>i.confirma(true),inchide:i=>i.inchide(),renunta:i=>i.renunta(),
  raspunde:(i,a)=>i.raspunde(a),tuturor:(i,a)=>i.raspundeTuturor(a),redir:(i,a)=>i.redirectioneaza(a),anuleaza:i=>i.anuleazaTrimiterea(),
  fisa:(i,a,b,Q,fp)=>fp(a,b)};
function executa(Q,inst,drum,fisaPune){(drum||[]).forEach(p=>{const f=PASI[p[0]];if(!f)throw new Error('posta-gmail-scrie: pas necunoscut '+p[0]);f(inst,p[1],p[2],Q,fisaPune)})}
function drumGresit(Q){const g=Q.gresit||{};if(g.drum)return g.drum;const d=(Q.drum||[]).slice();d.splice(g.sari!=null?g.sari:d.length-1,1);return d}

/* ---------------- tipul „mesaj” pentru motor ---------------- */
function hTeste(l){return `<div class="pg-teste"><div class="lbl">Testele sarcinii · <span class="nr">0 din ${l.length} trec</span></div><ol>${l.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`}
function bifeaza(box,rez,arata){rez.forEach((r,i)=>{const li=box.querySelector(`.pg-teste li[data-i="${i}"]`);if(!li)return;
  li.className=r.ok?'ok':(arata?'rau':'');li.querySelector('.s').textContent=r.ok?'✓':(arata?'✗':'○');li.querySelector('.m').textContent=!r.ok&&arata?r.m:''});
  const n=box.querySelector('.pg-teste .nr');if(n)n.textContent=`${rez.filter(r=>r.ok).length} din ${rez.length} trec`}
const tip={
  render(Q,body,api){
    stil();const l=testeDin(Q);
    body.innerHTML=`<div class="pg-sarcina"><div class="pg-loc"></div>
      ${(Q.fisa||[]).length?`<div class="pg-fisa"><div class="lbl">${Q.fisaTitlu||'Fișa ta (scrii ce citești în căsuță)'}</div>${Q.fisa.map(c=>`<label class="pg-f"><span>${c.et}</span><input type="text" id="pgs-f-${esc(c.id)}" ${ATR}></label>`).join('')}</div>`:''}
      ${hTeste(l)}<button type="button" class="pg-reset" data-pg="reset">Ia-o de la capăt</button></div>`;
    const loc=body.querySelector('.pg-loc'),fisa={};let inst;
    const upd=arata=>{const r=evalueaza(Q,inst,fisa);bifeaza(body,r,arata);return r};
    const porneste=()=>{if(inst)inst.distruge();inst=creeaza(loc,Q.sim||{});inst.on('schimbare',()=>upd(false));upd(false)};
    (Q.fisa||[]).forEach(c=>{const i=body.querySelector('#pgs-f-'+c.id);fisa[c.id]='';i.addEventListener('input',()=>{fisa[c.id]=i.value;upd(false)})});
    const fisaPune=(id,v)=>{fisa[id]=v;const i=body.querySelector('#pgs-f-'+id);if(i)i.value=v;upd(false)};
    porneste();
    body.querySelector('[data-pg="reset"]').onclick=()=>{(Q.fisa||[]).forEach(c=>fisaPune(c.id,''));porneste();const u=loc.querySelector('.pg-url,#pg-in-adr,[data-lista="primite"]');if(u)u.focus({preventScroll:true})};
    const ruleaza=d=>{inst.reset();(Q.fisa||[]).forEach(c=>fisaPune(c.id,''));executa(Q,inst,d,fisaPune);upd(false)};
    body._rezolva=()=>ruleaza(Q.drum);body._gresit=()=>ruleaza(drumGresit(Q));body._inst=()=>inst;
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok).length;
      if(!rau){nav.innerHTML='';api.resolve(true)}
      else{const st=inst.stare(),start=(Q.sim&&Q.sim.start)||'casuta';
        /* după ieșirea din cont, „Continuă de unde ai rămas” nu ajută: în căsuța care pornește deschisă, parola nu e în sarcină */
        const cont=!st.conectat&&st.iesit?(start==='casuta'?' Ai ieșit din cont, deci aici nu mai poți repara: apasă „Ia-o de la capăt” (contul se deschide singur) și refă pașii, cu ieșirea din cont la sfârșit.'
          :' Ai ieșit din cont: intră din nou (adresa și parola sunt în cerință) sau apasă „Ia-o de la capăt”.'):' Continuă de unde ai rămas și apasă din nou.';
        api.resolve(false,`${rau===1?'Un test nu trece':rau+' teste nu trec'} (marcate cu ✗; sub fiecare scrie de ce).${cont}`,r.every(x=>!x.ok));
        api.revealButton(()=>{body._rezolva();upd(true);nav.innerHTML='';api.giveUp(Q.arata||'am făcut pașii în căsuța de mai sus: citește-i în ordine și uită-te la teste.')})}
      if(rau){const f=['.pgs-mn [data-c="corp"]','.pgs-mn [data-c="catre"]','.pgs-dlg .r','.pg-meniu button.on','#pg-in-par','#pg-in-adr','.pg-url'].map(x=>loc.querySelector(x)).find(Boolean);if(f)f.focus({preventScroll:true})}},Q.buton||'Verifică');
  },
  rezolva(Q,body){body._rezolva()},
  gresit(Q,body){body._gresit()}
};

window.SimPostaGmailScrie={creeaza,tip,TESTE,testeDin,evalueaza,executa,PASI,fisiereImplicite,DAEMON,SUBIECT_INTORS,LIMITA_MB,
  adrese,recunoscuta,areSalut,areSemnatura,marimeScurta,
  altTip,potriveste,candidat};   // + reparația din 12.10.2026
})();
