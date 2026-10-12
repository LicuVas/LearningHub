/* Simulatorul „poșta Gmail” pentru lecțiile LearningHub — fișier comun (lectii/_sim/posta-gmail.js).
   PROPRIETAR: autorul lecției VI · M2 · nr. 13 („Poșta electronică: cont, adresă, structura unui mesaj”), 12.10.2026.
   Îl folosesc și îl extind (fără să-l schimbe): VI/14 (compunere, trimitere, răspuns, redirecționare, atașare) și
   VI/15 (etichete, agenda de contacte, netichetă). Ce au voie să schimbe: vezi „PENTRU LECȚIILE 14-15” mai jos.

   CE SIMULEAZĂ. Un DESEN al Gmail-ului în browser, cu contul Google de la școală (decizia profesorului, 11.10.2026):
   o filă de browser cu bara de adrese, pagina de conectare (adresa → Înainte → parola → Înainte), întrebarea browserului
   „Salvezi parola?”, căsuța cu meniul principal din stânga (Mesaje primite, Trimise, Mesaje nefinalizate, Mai multe →
   Spam, Coș de gunoi), lista mesajelor, mesajul deschis (expeditorul, „către”, „Afișează detaliile”: de la / către / cc /
   data / subiect, corpul, semnătura) și ieșirea din cont (Profil → Deconectează-te). Nu e Gmail-ul adevărat: fără logo,
   fără imagini Google; textele interfeței sunt cele din pagina publică de conectare și din ajutorul Gmail în română
   (lectii/vi/m2-l13/surse.md); ce n-a putut fi confirmat e trecut acolo ca NESIGUR. Toate conturile, adresele, persoanele
   și mesajele sunt INVENTATE (domeniile .test sunt rezervate pentru exemple).

   SIGURANȚA (ca lectii/_sim/cont-sigur.js; probată în lectii/vi/m2-l13/_proba/proba_lectie.py):
     - nimic din ce tastează elevul nu se scrie în localStorage / sessionStorage / cookie și nu pleacă în rețea: stă doar
       în pagină și se pierde la „Încă un exercițiu”, la reîncărcare sau la închidere;
     - câmpurile sunt <input type="text"> FĂRĂ <form>, fără `name`, cu autocomplete / autocorrect / autocapitalize /
       spellcheck oprite: cu type="password" browserul calculatorului COMUN ar întreba de-adevăratelea „Salvezi parola?”.
       De aceea parola inventată SE VEDE în câmp (pe pagina adevărată apar puncte) și pagina o spune;
     - întrebarea „Salvezi parola?” e și ea un desen: „Salvează” nu salvează nimic, doar pică testul.

   FUNCȚIA DE CREARE (pentru lecțiile care vin):
     const inst = SimPostaGmail.creeaza(elementul, optiuni)
     optiuni:
       cont        {adresa, nume, parola, initiala?}           contul inventat al elevului din exercițiu
       conturi     [{adresa, nume, parola}]                     alte conturi care „există” (implicit: doar `cont`)
       mesaje      [{id, lista:'primite'|'trimise'|'nefinalizate'|'spam'|'cos', de:{nume, adresa},
                     catre:[{nume, adresa}], cc:[{nume, adresa}]?, subiect, corp:'text, rânduri cu \n',
                     semnatura?:'text, rânduri cu \n', data:'10 dec.', ora?:'08:15', citit?:bool}]
       start       'fila' (filă nouă goală) | 'conectare' | 'casuta' (contul `cont` e deja deschis)
       intreabaParola  true = după conectare apare întrebarea browserului „Salvezi parola?” (implicit false)
       browser     'chrome' (implicit) | 'edge' — desenul întrebării de salvare a parolei și rândul „Nu e computerul tău?”
                   de pe pagina de conectare (12.10.2026); `bulaBrowser` = același lucru (nume vechi, acceptat)
       alteConturiDeschise [{adresa, nume}]  alte conturi deschise în același browser (start 'casuta'): Profil arată
                   „Deconectează-te de la toate conturile”, iar deconecteaza() le închide pe toate
       detalii     true = mesajul deschis arată de la început detaliile (de la / către / cc / data / subiect)
       parti       {cere:['de','catre','cc','subiect','corp','semnatura','data']} = elevul atinge pe rând părțile cerute
                   ale mesajului deschis (fără să afle pe loc dacă a nimerit; verificarea o face lecția)
       deschide    id-ul unui mesaj de deschis la pornire (când start = 'casuta')
       scrie       null (implicit: butonul Scrie e oprit, „în lecția 14”) | function(inst)  — ce face butonul Scrie
       actiuniMesaj [{id, text, la(inst, mesaj)}]   butoane sub mesajul deschis (lecția 14: Răspunde, Redirecționează…)
       meniuExtra  [{id, nume, numar?}]            rânduri în plus în meniul principal, după „Mai multe” (lecția 15: etichete)
       laEveniment function(nume, date)            același lucru ca inst.on('*', …)
     inst (metodele publice):
       stare()            copie a stării: {ecran, conectat, adresa, lista, deschis, vizitate[], deschise[], parolaSalvata,
                          bulaInchisa, bulaVazuta, iesit, ajunsGmail, parti{}, contDeschisLaStart}
       jurnal()           lista evenimentelor [{nume, date, t}]
       on(nume, fn)       ascultă un eveniment ('*' = toate); întoarce funcția de dezabonare
       mergiLa(text)      ce face Enter în bara de adrese
       conecteaza(adresa, parola)   pașii paginii de conectare (pentru rezolvări automate și pentru lecțiile care vin)
       inchideBula() / refuzaBula() / salveazaBula()   răspunsurile la întrebarea browserului (✕ / „Niciodată” sau
                          „Nu acum” / Salvează); un clic în pagină, alături de întrebare, o închide fără salvare
       deschideLista(id)  deschideMesaj(id)  arataDetalii(bool)  atingeParte(parte)
       deconecteaza()     Profil → Deconectează-te
       mesaje()           copie a listei de mesaje   ·  adaugaMesaj(m)  ·  mutaMesaj(id, lista)  ·  stergeMesaj(id)
       arataPanou(html|Element, titlu) / inchidePanou()   o fereastră peste căsuță (lecția 14: „Mesaj nou”)
       redeseneaza()      reset()   distruge()
     EVENIMENTE: 'bara' {text, ok, cont?} · 'conectare-adresa' {text, ok, motiv} · 'conectare-parola' {ok, greseli} · 'uitat' {ce:'adresa'|'parola'}
       · 'creeaza-cont' · 'invitat' · 'bula' {raspuns:'salveaza'|'inchide'|'refuza'|'alaturi'} · 'conectat' · 'lista' {id} · 'mai-multe' {deschis}
       · 'deschide' {id} · 'detalii' {deschis} · 'parte' {cerut, atins} · 'profil' {deschis} · 'deconectat' · 'scrie'
       · 'actiune' {id, mesaj} · 'schimbare' (după orice redesenare).

   VERIFICĂRI pe stare (pentru motor și pentru lecțiile care vin): SimPostaGmail.TESTE[cheie] = {ce(Q,t), f(stare, v, Q, fisa)}
     bara, conectat, nesalvata, deschis {v:id}, vazut {v:[liste]}, necitit {v:[id-uri]}, iesit, parte {v:'de'|…}, fisa {v:id}.
     Orice element din Q.teste poate avea `m`: mesajul de sub ✗ pentru testul acela (bate mesajul implicit).

   SCHIMBAT LA REPARAȚIA DIN 12.10.2026 (judecata 1; totul compatibil înapoi — numele testelor, forma lui Q, pașii
   conectării și ai ieșirii au rămas; detaliile în lectii/vi/m2-l13/surse.md §10):
     - opțiunile `browser` / `bulaBrowser` și `alteConturiDeschise`; metoda `refuzaBula()`; clicul alături închide întrebarea;
     - `m` pe un test din Q.teste; `necitit` spune singur „din Spam” când mesajul deschis e din Spam;
     - fișa cu `adresa:true` ia din răspuns doar adresa (bucata cu @, sau ce e între < și >);
     - parola greșită: alt text, iar la a doua greșeală un sfat (nu ghicești, profesorul); „Ai uitat parola?” spune „îți poate da o parolă nouă”;
     - accounts.google.com scris în bară deschide pagina de conectare a Contului Google („Folosește Contul Google”), iar după
       conectare pagina contului, nu Gmail-ul (ca un browser adevărat, probat 12.10.2026);
     - CONTURI.andrei are alt nume de familie și altă adresă (cheia `andrei` a rămas): numele vechi se potrivea cu un elev real.
   TIPURI pentru motor (tipuri:{adresa:SimPostaGmail.adresa, posta:SimPostaGmail.posta}):
     adresa  scrii o adresă din prenume + nume + domeniu (mod 'scrie'), o repari (mod 'repara') sau o desparți în numele de
             utilizator și domeniu (mod 'desparte'); testele se bifează cât scrii.
             Q {mod, prenume, nume, domeniu, adresa (la 'repara'/'desparte'), solutie?, gresit?}
     posta   o sarcină în căsuța simulată, cu teste numite care se bifează singure.
             Q {sim:{…optiunile de mai sus…}, teste:[{c, v?, ce?}], fisa?:[{id, et, ok:[răspunsuri primite], ph?}],
                gresit?:{sari:'cheia unui test' | adresa:'…' | salveaza:true | citeste:'id'}}
             rezolva/gresit fac pașii prin metodele lui inst (nu prin clicuri), deci poarta merge și pe telefon.
   FUNCȚII: SimPostaGmail.verificaAdresa(text) → {ok, arond, spatii, diacritice, stanga, dreapta, punctDomeniu, probleme[]}
            SimPostaGmail.faraDiacritice(text), SimPostaGmail.LISTE (meniul principal), SimPostaGmail.CONTURI, .MESAJE_IOANA.

   PENTRU LECȚIILE 14-15: folosiți creeaza() cu `scrie`, `actiuniMesaj`, `meniuExtra`, `arataPanou` și evenimentele; o
   extensie nouă stă în alt fișier din lectii/_sim/ (de exemplu posta-gmail-scrie.js), cu nume nou. NU schimbați aici:
   numele RO din interfață (vin din surse, vezi lectii/vi/m2-l13/surse.md), regula „nimic nu se salvează, nimic nu
   pleacă” (fără type="password", fără <form>), pașii conectării (adresa → Înainte → parola → Înainte) și ieșirea
   (Profil → Deconectează-te), numele testelor din TESTE și forma lui Q la tipurile adresa și posta (lecția 13 le folosește). */
(function(){
'use strict';
const CSS=`
.pg{position:relative;border:1px solid var(--line);border-radius:12px;background:var(--paper);overflow:hidden;font-size:.95rem;line-height:1.4;color:var(--ink)}
.pg button{font:inherit;color:inherit}
.pg-br{background:var(--paper2);border-bottom:1px solid var(--line);padding:6px 8px 8px}
.pg-file{display:flex;gap:6px;align-items:flex-end;margin-bottom:6px}
.pg-fila{display:inline-flex;align-items:center;gap:6px;max-width:70%;padding:4px 10px;border:1px solid var(--line);border-bottom:0;border-radius:8px 8px 0 0;background:var(--paper);font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pg-bara{display:flex;gap:6px;align-items:center}
.pg-bara label{flex:1;min-width:0;display:flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:18px;background:var(--paper);padding:0 10px;min-height:36px}
.pg-bara label span{font-size:.8rem;color:var(--ink2);white-space:nowrap}
@media (max-width:760px),(pointer:coarse){.pg-bara label span{display:none}}
.pg-url{flex:1;min-width:0;border:0;background:transparent;color:var(--ink);font:inherit;font-size:.92rem;min-height:34px;outline:none}
.pg-enter{display:none;min-height:36px;min-width:44px;border:1px solid var(--line);border-radius:8px;background:var(--paper);cursor:pointer;font-weight:700}
@media (max-width:760px),(pointer:coarse){.pg-enter{display:inline-block}}
.pg-ecran{min-height:300px;padding:12px}
.pg-info{margin:0 0 10px;padding:8px 10px;border-left:4px solid var(--accent);background:var(--paper2);border-radius:0 6px 6px 0;font-size:.88rem}
.pg-gol{display:grid;place-items:center;min-height:240px;color:var(--ink2);text-align:center;font-size:.92rem;padding:10px}
.pg-card{max-width:520px;margin:4px auto;border:1px solid var(--line);border-radius:22px;padding:18px 18px 16px;background:var(--paper)}
.pg-g{font-weight:700;font-size:1.05rem;letter-spacing:.02em;color:var(--ink2)}
.pg-card h3{margin:8px 0 2px;font-size:1.55rem;font-weight:500}
.pg-card .pg-sub0{margin:0 0 12px}
.pg-f{display:flex;flex-direction:column;gap:4px;margin:6px 0 2px}
.pg-f span{font-size:.82rem;color:var(--accent);font-weight:600}
.pg-f input{min-height:46px;padding:6px 12px;border:2px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-size:1rem;width:100%;box-sizing:border-box}
.pg-f input:focus{outline:none;border-color:var(--accent)}
.pg-err{min-height:1.2em;margin:4px 0;color:var(--bad);font-size:.88rem}
.pg-link{background:none;border:0;padding:6px 0;min-height:32px;color:var(--accent)!important;font-weight:600;cursor:pointer;text-align:left}
.pg-mic{font-size:.84rem;color:var(--ink2);margin:8px 0}
.pg-mic .pg-link{padding:0;min-height:0;display:inline}
.pg-btns{display:flex;justify-content:flex-end;align-items:center;gap:14px;flex-wrap:wrap;margin-top:10px}
.pg-prim{min-height:40px;padding:6px 22px;border:0;border-radius:20px;background:var(--accent);color:var(--accentInk)!important;font-weight:700;cursor:pointer}
.pg-chip{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:4px 12px;border:1px solid var(--line);border-radius:17px;background:var(--paper);cursor:pointer;font-size:.9rem;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.pg-nota{font-size:.82rem;color:var(--ink2);margin:2px 0 0}
.pg-app{border:1px solid var(--line);border-radius:10px;overflow:hidden}
.pg-sus{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid var(--line);background:var(--paper2)}
.pg-ic{min-width:40px;min-height:40px;border:0;border-radius:20px;background:transparent;cursor:pointer;font-size:1.15rem}
.pg-ic:hover{background:var(--sel)}
.pg-logo{font-size:1.15rem;font-weight:700}
.pg-cauta{flex:1;min-width:0;min-height:36px;border-radius:18px;background:var(--paper);border:1px solid var(--line);display:flex;align-items:center;padding:0 12px;color:var(--ink2);font-size:.85rem;white-space:nowrap;overflow:hidden}
.pg-profil{flex:none;width:40px;height:40px;border-radius:50%;border:2px solid var(--paper);outline:1px solid var(--line);background:var(--accent);color:var(--accentInk)!important;font-weight:800;cursor:pointer}
.pg-corp{display:grid;grid-template-columns:190px 1fr;min-height:280px}
.pg-meniu{display:flex;flex-direction:column;gap:2px;padding:8px 6px;border-right:1px solid var(--line);background:var(--paper2)}
.pg-meniu button{display:flex;justify-content:space-between;align-items:center;gap:6px;min-height:36px;padding:4px 12px;border:0;border-radius:0 18px 18px 0;background:transparent;cursor:pointer;text-align:left;font-size:.92rem}
.pg-meniu button:hover{background:var(--sel)}
.pg-meniu button.on{background:var(--sel);font-weight:700}
.pg-meniu button .n{font-size:.8rem;font-weight:700}
.pg-meniu .pg-scrie{justify-content:flex-start;border-radius:16px;margin:0 0 8px;min-height:44px;background:var(--paper);border:1px solid var(--line);font-weight:700}
.pg-meniu .pg-scrie[disabled]{opacity:.6;cursor:default}
.pg-meniu .pg-mm{color:var(--ink2)}
.pg-main{min-width:0;padding:6px 8px}
.pg-titlu-lista{font-size:.82rem;color:var(--ink2);margin:2px 4px 6px;font-weight:700}
.pg-rand{display:grid;grid-template-columns:minmax(80px,30%) 1fr auto;gap:8px;align-items:center;width:100%;min-height:42px;padding:6px 8px;border:0;border-bottom:1px solid var(--line);background:var(--paper);cursor:pointer;text-align:left;font-size:.9rem}
.pg-rand:hover{background:var(--paper2)}
.pg-rand .de,.pg-rand .sb{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pg-rand .sb .inc{color:var(--ink2)}
.pg-rand .dt{font-size:.8rem;color:var(--ink2);white-space:nowrap}
.pg-rand.nou .de,.pg-rand.nou .sb b,.pg-rand.nou .dt{font-weight:800;color:var(--ink)}
.pg-rand .ciorna{color:var(--bad);font-weight:700}
.pg-lgol{padding:18px 8px;color:var(--ink2);font-size:.9rem}
.pg-msg{padding:4px 4px 8px}
.pg-msg h3{margin:4px 0 10px;font-size:1.2rem;font-weight:600;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.pg-et{font-size:.75rem;font-weight:600;padding:2px 8px;border-radius:6px;background:var(--paper2);border:1px solid var(--line)}
.pg-exp{display:grid;grid-template-columns:40px 1fr auto;gap:10px;align-items:start}
.pg-av{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--sel);font-weight:800}
.pg-exp .cine{word-break:break-word}
.pg-exp .adr{color:var(--ink2);font-size:.86rem}
.pg-catre{background:none;border:0;padding:4px 0;min-height:32px;cursor:pointer;color:var(--ink2)!important;font-size:.86rem}
.pg-dt{font-size:.8rem;color:var(--ink2);white-space:nowrap}
.pg-det{margin:6px 0 4px 50px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper);box-shadow:0 2px 8px rgba(0,0,0,.08);font-size:.86rem}
.pg-det table{border-collapse:collapse}
.pg-det td{padding:2px 6px;vertical-align:top;word-break:break-word}
.pg-det td:first-child{color:var(--ink2);text-align:right;white-space:nowrap}
.pg-text{margin:12px 0 6px 50px;white-space:pre-line;word-break:break-word}
.pg-semn{margin:6px 0 4px 50px;white-space:pre-line;color:var(--ink2);font-size:.9rem}
.pg-act{margin:10px 0 0 50px;display:flex;gap:8px;flex-wrap:wrap}
.pg-act button{min-height:38px;padding:4px 16px;border:1px solid var(--line);border-radius:19px;background:var(--paper);cursor:pointer}
.pg-spam{margin:0 0 10px;padding:8px 10px;border-radius:8px;background:var(--badbg);font-size:.86rem}
.pg-ciorna{border:1px solid var(--line);border-radius:10px;overflow:hidden;max-width:560px}
.pg-ciorna .cap{background:var(--paper2);padding:6px 10px;font-weight:700;font-size:.9rem}
.pg-ciorna .r{padding:6px 10px;border-top:1px solid var(--line);font-size:.9rem}
.pg-ciorna .r span{color:var(--ink2)}
.pg-ciorna .t{padding:10px;border-top:1px solid var(--line);white-space:pre-line;min-height:60px}
.pg-pm{position:absolute;right:10px;top:104px;z-index:5;width:min(300px,calc(100% - 20px));border:1px solid var(--line);border-radius:16px;background:var(--paper);box-shadow:0 6px 24px rgba(0,0,0,.18);padding:14px;text-align:center}
.pg-pm .av{width:56px;height:56px;margin:0 auto 6px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:var(--accentInk);font-weight:800;font-size:1.4rem}
.pg-pm .ad{font-size:.88rem;color:var(--ink2);word-break:break-all}
.pg-pm button{display:block;width:100%;min-height:40px;margin-top:8px;border:1px solid var(--line);border-radius:20px;background:var(--paper);cursor:pointer;font-weight:600}
.pg-bula{position:absolute;right:10px;top:58px;z-index:6;width:min(300px,calc(100% - 20px));border:1px solid var(--line);border-radius:12px;background:var(--paper);box-shadow:0 6px 24px rgba(0,0,0,.22);padding:12px}
.pg-bula .s{display:flex;justify-content:space-between;align-items:center;gap:8px}
.pg-bula .s b{font-size:1rem}
.pg-x{min-width:40px;min-height:40px;border:0;border-radius:20px;background:transparent;cursor:pointer;font-size:1.1rem}
.pg-x:hover{background:var(--sel)}
.pg-bula .d{margin:6px 0;font-size:.86rem;color:var(--ink2);word-break:break-all}
.pg-sec{min-height:40px;padding:6px 18px;border:1px solid var(--line);border-radius:20px;background:var(--paper);color:var(--accent)!important;font-weight:700;cursor:pointer}
.pg-pm .alt{margin-top:8px;padding-top:6px;border-top:1px solid var(--line);font-size:.86rem;color:var(--ink2);word-break:break-all}
.pg-panou{position:absolute;inset:auto 10px 10px auto;z-index:7;width:min(420px,calc(100% - 20px));border:1px solid var(--line);border-radius:12px;background:var(--paper);box-shadow:0 6px 24px rgba(0,0,0,.22)}
.pg-panou .cap{display:flex;justify-content:space-between;align-items:center;padding:4px 4px 4px 12px;background:var(--paper2);border-bottom:1px solid var(--line);font-weight:700}
.pg-panou .c{padding:10px}
[data-parte].pg-tinta{outline:2px dashed var(--accent);outline-offset:2px;cursor:pointer;border-radius:4px}
/* în modul „parti” fiecare parte e o țintă de atins de cel puțin 32 px (regula 20) */
span[data-parte].pg-tinta,div[data-parte].pg-tinta{display:inline-block;min-height:32px;padding:5px 4px;box-sizing:border-box}
div[data-parte].pg-tinta{display:block}
tr[data-parte].pg-tinta td{padding:9px 6px}
.pg-mic .pg-link{display:inline-block;min-height:32px;padding:6px 0}
[data-parte].pg-atins{outline:3px solid #E4002B;outline-offset:2px}
.pg-cere{margin:0 0 8px;padding:8px 10px;border:1px solid var(--accent);border-radius:8px;background:var(--paper2);font-size:.92rem}
.pg-cere ol{margin:4px 0 0;padding-left:1.3em}
.pg-cere li.acum{font-weight:800}
.pg-cere li .ales{font-weight:400;color:var(--ink2)}
.pg-teste{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--paper2)}
.pg-teste .lbl{font-size:.85rem;font-weight:700}
.pg-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.pg-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.pg-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.pg-teste li.ok .s{color:var(--ok)}.pg-teste li.rau .s{color:var(--bad)}
.pg-teste li .m{display:block;font-size:.86rem;color:var(--bad)}
.pg-fisa{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:8px 12px}
.pg-fisa .lbl{font-size:.85rem;font-weight:700;margin-bottom:4px}
.pg-reset{margin-top:10px;min-height:40px;padding:6px 12px;border:1px solid var(--accent);border-radius:8px;background:var(--paper);color:var(--accent)!important;font-weight:700;cursor:pointer}
.pg-adr{display:flex;flex-direction:column;gap:6px}
.pg-ingust{display:none;margin:0;padding:4px 10px;font-size:.8rem;color:var(--ink2);background:var(--paper2)}
@media (max-width:560px){
 .pg-ingust{display:block}
 .pg-cauta{visibility:hidden}
 .pg-corp{grid-template-columns:1fr}
 .pg-meniu{flex-direction:row;flex-wrap:wrap;border-right:0;border-bottom:1px solid var(--line)}
 .pg-meniu button{border-radius:18px;padding:4px 10px}
 .pg-meniu .pg-scrie{margin:0;width:auto}
 .pg-rand{grid-template-columns:1fr auto}
 .pg-rand .sb{grid-column:1 / -1;grid-row:2}
 .pg-text,.pg-semn,.pg-act,.pg-det{margin-left:0}
 .pg-exp{grid-template-columns:36px 1fr}
 .pg-exp .pg-dt{grid-column:2}
 .pg-card{padding:14px 12px;border-radius:14px}
 .pg-pm{top:96px}
}
`;
function stil(){if(document.getElementById('pg-stil'))return;const s=document.createElement('style');s.id='pg-stil';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const faraDiacritice=s=>String(s||'').normalize('NFKD').replace(/[̀-ͯ]/g,'');
const norm=s=>faraDiacritice(String(s||'').trim()).toLowerCase().replace(/\s+/g,' ').replace(/[„”"'.!?,;:]+$/,'').replace(/^[„”"']+/,'');
const ATR='autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore data-form-type="other"';
const CAMP=(id,et,val,ph,extra)=>`<label class="pg-f"><span>${et}</span><input type="text" id="${id}" value="${esc(val||'')}" placeholder="${esc(ph||'')}" ${ATR} ${extra||''}></label>`;

/* ---------------- meniul principal (numele RO: ajutorul Gmail; vezi surse.md) ---------------- */
const LISTE=[
  {id:'primite',nume:'Mesaje primite'},
  {id:'trimise',nume:'Trimise'},
  {id:'nefinalizate',nume:'Mesaje nefinalizate'}];
const MAI_MULTE=[{id:'spam',nume:'Spam'},{id:'cos',nume:'Coș de gunoi'}];
const numeLista=id=>((LISTE.concat(MAI_MULTE).find(x=>x.id===id))||{}).nume||id;
const PARTI={de:'expeditorul (De la)',catre:'destinatarul (Către)',cc:'Cc (cine mai primește o copie)',subiect:'subiectul',corp:'corpul mesajului',semnatura:'semnătura',data:'data'};

/* ---------------- adresa: verificarea semn cu semn (rulează doar aici) ---------------- */
function verificaAdresa(t){
  const s=String(t||'').trim(),n=(s.match(/@/g)||[]).length,i=s.indexOf('@');
  const st=i>0?s.slice(0,i):'',dr=i>=0?s.slice(i+1):'';
  const r={text:s,arond:n===1,spatii:/\s/.test(s),diacritice:faraDiacritice(s)!==s,stanga:st,dreapta:dr,
    punctDomeniu:n===1&&/^[^.\s@]+(\.[^.\s@]+)+$/.test(dr),probleme:[]};
  if(!s)r.probleme.push('n-ai scris nimic');
  else{
    if(n===0)r.probleme.push('nu are @');if(n>1)r.probleme.push('are mai mult de un @');
    if(r.spatii)r.probleme.push('are un spațiu');if(r.diacritice)r.probleme.push('are diacritice (ă, â, î, ș, ț)');
    if(n===1&&!st)r.probleme.push('nu are nimic înainte de @');if(n===1&&!dr)r.probleme.push('nu are nimic după @');
    if(n===1&&dr&&!r.punctDomeniu)r.probleme.push('domeniul (după @) nu are punct');}
  r.ok=!r.probleme.length;return r}

/* ---------------- datele inventate ---------------- */
const DOM='scoala-exemplu.test';
const CONTURI={
  ioana:{adresa:'ioana.rusu@'+DOM,nume:'Ioana Rusu',parola:'Lalea7?Tren#Nor'},
  andrei:{adresa:'andrei.pavel@'+DOM,nume:'Andrei Pavel',parola:'Nuca4!Pod#Fluier'},
  sofia:{adresa:'sofia.ilie@'+DOM,nume:'Sofia Ilie',parola:'Cartof8#Lac!Zmeu'}};
const DIRIG={nume:'Elena Matei',adresa:'elena.matei@'+DOM};
const PROF={nume:'Mihai Stan',adresa:'mihai.stan@'+DOM};
const MESAJE_IOANA=[
  {id:'excursia',lista:'primite',de:DIRIG,catre:[{nume:'Ioana Rusu',adresa:'ioana.rusu@'+DOM}],cc:[{nume:'Părinții clasei a VI-a A',adresa:'parinti.6a@'+DOM}],
   subiect:'Excursia de vineri',data:'10 dec.',ora:'08:15',
   corp:'Bună ziua, dragi elevi,\nVineri mergem la muzeu. Plecăm la ora 9, din fața școlii. Luați cu voi apă și o gustare.\nVă aștept!',
   semnatura:'Elena Matei\nDiriginta clasei a VI-a A'},
  {id:'bunvenit',lista:'primite',de:PROF,catre:[{nume:'Ioana Rusu',adresa:'ioana.rusu@'+DOM}],subiect:'Bun venit în contul de la școală',data:'8 dec.',ora:'12:40',citit:true,
   corp:'Bună, Ioana,\nDe azi ai contul tău de la școală. Parola o știi doar tu și părinții tăi. La sfârșitul orei ieși din cont.',
   semnatura:'Mihai Stan\nProfesor de informatică'},
  {id:'proiect',lista:'primite',de:{nume:'Radu Ene',adresa:'radu.ene@'+DOM},catre:[{nume:'Ioana Rusu',adresa:'ioana.rusu@'+DOM}],subiect:'Proiectul la științe',data:'9 dec.',ora:'17:05',citit:true,
   corp:'Salut, Ioana! Mâine aduc eu planșa, tu aduci lipiciul?',semnatura:'Radu'},
  {id:'bunica',lista:'trimise',de:{nume:'Ioana Rusu',adresa:'ioana.rusu@'+DOM},catre:[{nume:'Bunica Maria',adresa:'bunica.maria@posta-exemplu.test'}],subiect:'Mulțumesc pentru carte!',data:'7 dec.',ora:'19:20',citit:true,
   corp:'Dragă bunico,\nCartea cu povești e minunată. Am citit deja două!',semnatura:'Te pup,\nIoana'},
  {id:'tema',lista:'nefinalizate',de:{nume:'Ioana Rusu',adresa:'ioana.rusu@'+DOM},catre:[DIRIG],subiect:'Întrebare despre temă',data:'9 dec.',ora:'20:10',citit:true,
   corp:'Bună ziua, doamna dirigintă,\nTema la'},
  {id:'tableta',lista:'spam',de:{nume:'Premii Rapide',adresa:'premii@castiga-acum.test'},catre:[{nume:'Ioana Rusu',adresa:'ioana.rusu@'+DOM}],subiect:'Ai câștigat o tabletă!!!',data:'9 dec.',ora:'03:12',
   corp:'Apasă aici în 10 minute și scrie-ne parola contului ca să primești premiul.'},
  {id:'inchis',lista:'spam',de:{nume:'Suport Cont',adresa:'suport@g00gle-cont.test'},catre:[{nume:'Ioana Rusu',adresa:'ioana.rusu@'+DOM}],subiect:'Contul tău va fi închis azi',data:'8 dec.',ora:'02:47',
   corp:'Trimite-ne parola, altfel îți închidem contul.'},
  {id:'pizza',lista:'cos',de:{nume:'Pizzeria Colțului',adresa:'oferte@pizzeria-exemplu.test'},catre:[{nume:'Ioana Rusu',adresa:'ioana.rusu@'+DOM}],subiect:'Pizza la jumătate de preț',data:'6 dec.',ora:'11:00',citit:true,
   corp:'Doar azi, a doua pizza la jumătate de preț!'}];

/* ---------------- creeaza(): căsuța simulată ---------------- */
function creeaza(root,O){
  stil();O=Object.assign({start:'conectare',intreabaParola:false,detalii:false},O||{});
  const BR=(O.browser||O.bulaBrowser||'chrome')==='edge'?'edge':'chrome';
  const cont=O.cont||CONTURI.ioana,conturi=(O.conturi||[]).concat([cont]);
  let M=JSON.parse(JSON.stringify(O.mesaje||MESAJE_IOANA));
  const asc={},J=[];let st,adresaScrisa='';
  function nou(){
    st={ecran:O.start==='casuta'?'casuta':O.start==='fila'?'fila':'conectare-adresa',conectat:O.start==='casuta',adresa:O.start==='casuta'?cont.adresa:'',
      lista:'primite',deschis:null,vizitate:O.start==='casuta'?['primite']:[],deschise:[],parolaSalvata:false,bulaInchisa:false,bulaVazuta:false,bula:false,
      iesit:false,ajunsGmail:O.start!=='fila',parti:{},pas:0,maiMulte:false,profil:false,detalii:!!O.detalii,err:'',info:'',url:'',panou:null,
      contDeschisLaStart:O.start==='casuta',bulaRaspuns:'',greseliParola:0,dest:'gmail',tineInfo:false,
      alteDeschise:O.start==='casuta'?JSON.parse(JSON.stringify(O.alteConturiDeschise||[])):[]};
    st.url=st.ecran==='fila'?'':st.ecran==='casuta'?'mail.google.com/mail/u/0/#inbox':'accounts.google.com/v3/signin/identifier';
    if(O.start==='casuta'&&O.deschide){st.deschis=O.deschide;st.deschise.push(O.deschide);const m=M.find(x=>x.id===O.deschide);if(m)m.citit=true}}
  nou();
  function emite(nume,date){J.push({nume,date:date||{},t:Date.now()});(asc[nume]||[]).concat(asc['*']||[]).forEach(f=>{try{f(nume,date||{})}catch(e){}});
    if(O.laEveniment)try{O.laEveniment(nume,date||{})}catch(e){}}
  const msg=id=>M.find(x=>x.id===id);
  const inLista=id=>M.filter(x=>x.lista===id);
  const ini=c=>(c.initiala||faraDiacritice(c.nume||c.adresa||'?').trim().charAt(0)||'?').toUpperCase();
  const nume=c=>c&&c.adresa===cont.adresa?'eu':c?c.nume||c.adresa:'';

  /* --- ecranele --- */
  function hBara(){
    const titlu=st.ecran==='fila'?'Filă nouă':st.ecran==='casuta'?`${numeLista(st.lista)} – ${cont.adresa} – Gmail`:st.ecran==='cont'||st.dest==='cont'?'Contul Google':'Gmail';
    return `<div class="pg-br"><div class="pg-file"><span class="pg-fila" title="${esc(titlu)}">${esc(titlu)}</span></div>
     <div class="pg-bara"><label><span>Bara de adrese</span><input type="text" class="pg-url" aria-label="Bara de adrese" value="${esc(st.url)}" placeholder="Caută sau scrie o adresă" ${ATR}></label><button type="button" class="pg-enter" data-a="enter" aria-label="Enter (ca tasta Enter)">Enter ↵</button></div></div>`}
  function hFila(){return `<div class="pg-gol"><div><b>Filă nouă</b><br>Scrie sus, în bara de adrese, adresa Gmail și apasă <kbd>Enter</kbd>${'ontouchstart' in window?' (pe telefon: butonul <b>Enter ↵</b> de lângă bară)':''}.</div></div>`}
  function hAdresa(){
    /* rândul „Nu e computerul tău?” depinde de browser (pagina publică, 12.10.2026: cu Chrome „modul pentru invitați”,
       cu Edge „o fereastră de navigare privată”); subtitlul depinde de unde ai venit (gmail.com sau accounts.google.com) */
    const strain=BR==='edge'?'Nu este computerul tău? Pentru a te conecta, folosește o fereastră de navigare privată.'
      :'Nu e computerul tău? Pentru a te conecta privat, folosește modul pentru invitați.';
    return `<div class="pg-card"><div class="pg-g">Google</div><h3>Conectează-te</h3><p class="pg-sub0">${st.dest==='cont'?'Folosește Contul Google':'Accesează Gmail'}</p>
     ${CAMP('pg-in-adr','Adresa de e-mail sau numărul de telefon',adresaScrisa,'')}
     <p class="pg-err" aria-live="polite">${esc(st.err)}</p>
     <button type="button" class="pg-link" data-a="uitat-adresa">Ai uitat adresa de e-mail?</button>
     <p class="pg-mic">${strain} <button type="button" class="pg-link" data-a="invitat">Află mai multe despre folosirea modului pentru invitați</button></p>
     <div class="pg-btns"><button type="button" class="pg-link" data-a="creeaza">Creează un cont</button><button type="button" class="pg-prim" data-a="inainte">Înainte</button></div></div>`}
  function hParola(){
    return `<div class="pg-card"><div class="pg-g">Google</div><h3>${esc((conturi.find(c=>c.adresa===st.adresa)||{}).nume||'')}</h3>
     <p class="pg-sub0"><button type="button" class="pg-chip" data-a="alta-adresa" title="Ai greșit adresa? Apasă aici și o scrii din nou.">${esc(st.adresa)} ▾</button></p>
     ${CAMP('pg-in-par','Introdu parola','','')}
     <p class="pg-nota">În căsuța de exersare parola inventată se vede. Pe pagina adevărată, în loc de litere apar puncte.</p>
     <p class="pg-err" aria-live="polite">${esc(st.err)}</p>
     <div class="pg-btns"><button type="button" class="pg-link" data-a="uitat-parola">Ai uitat parola?</button><button type="button" class="pg-prim" data-a="inainte-parola">Înainte</button></div></div>`}
  function hRand(m){
    const ciorna=m.lista==='nefinalizate',trimis=m.lista==='trimise';
    const cine=ciorna?`<span class="ciorna">Mesaj nefinalizat</span>`:trimis?`Către: ${esc((m.catre||[]).map(nume).join(', '))}`:esc(nume(m.de));
    const inc=String(m.corp||'').replace(/\n/g,' ').slice(0,60);
    return `<button type="button" class="pg-rand${m.citit?'':' nou'}" data-m="${esc(m.id)}"><span class="de">${cine}</span><span class="sb"><b>${esc(m.subiect)}</b> <span class="inc">– ${esc(inc)}</span></span><span class="dt">${esc(m.data||'')}</span></button>`}
  function hLista(){
    const l=inLista(st.lista);
    return `<div class="pg-titlu-lista">${esc(numeLista(st.lista))}</div>${l.length?l.map(hRand).join(''):`<div class="pg-lgol">Nu există mesaje aici.</div>`}`}
  function hMesaj(m){
    if(m.lista==='nefinalizate')return `<div class="pg-msg"><button type="button" class="pg-ic" data-a="inapoi" aria-label="Înapoi la listă" title="Înapoi la listă">←</button>
      <div class="pg-ciorna"><div class="cap">Mesaj început, netrimis</div><div class="r"><span>Către</span> ${esc((m.catre||[]).map(c=>c.adresa).join(', '))}</div><div class="r"><span>Subiect</span> ${esc(m.subiect)}</div><div class="t">${esc(m.corp)}</div></div>
      <p class="pg-nota">Așa arată un mesaj început și netrimis. Cum îl termini și cum îl trimiți afli în lecția 14.</p></div>`;
    /* părțile mesajului: data-parte pe fiecare (în modul „parti” se pot atinge; clasele le pune deseneaza()) */
    const P=p=>`data-parte="${p}"${O.parti?' tabindex="0" role="button"':''}`;
    const catreScurt=(m.catre||[]).map(c=>c.adresa===cont.adresa?'mine':c.nume||c.adresa).join(', ');
    const det=st.detalii?`<div class="pg-det" id="pg-det"><table>
      <tr ${P('de')}><td>de la:</td><td><b>${esc(m.de.nume)}</b> &lt;${esc(m.de.adresa)}&gt;</td></tr>
      <tr ${P('catre')}><td>către:</td><td>${esc((m.catre||[]).map(c=>`${c.nume} <${c.adresa}>`).join(', '))}</td></tr>
      ${(m.cc||[]).length?`<tr ${P('cc')}><td>cc:</td><td>${esc(m.cc.map(c=>`${c.nume} <${c.adresa}>`).join(', '))}</td></tr>`:''}
      <tr ${P('data')}><td>data:</td><td>${esc(m.data)}${m.ora?', '+esc(m.ora):''}</td></tr>
      <tr ${P('subiect')}><td>subiect:</td><td>${esc(m.subiect)}</td></tr></table></div>`:'';
    const act=(O.actiuniMesaj||[]).map(a=>`<button type="button" data-act="${esc(a.id)}">${esc(a.text)}</button>`).join('');
    return `<div class="pg-msg"><button type="button" class="pg-ic" data-a="inapoi" aria-label="Înapoi la listă" title="Înapoi la listă">←</button>
     ${m.lista==='spam'?`<p class="pg-spam">Mesajul e în Spam: nu apeși pe nimic din el și nu răspunzi.</p>`:''}
     <h3><span ${P('subiect')}>${esc(m.subiect)}</span><span class="pg-et">${esc(numeLista(m.lista))}</span></h3>
     <div class="pg-exp"><span class="pg-av" aria-hidden="true">${esc(ini(m.de))}</span>
      <div><span class="cine" ${P('de')}><b>${esc(m.de.nume)}</b> <span class="adr">&lt;${esc(m.de.adresa)}&gt;</span></span><br>
       <button type="button" class="pg-catre" data-a="detalii" ${P('catre')} aria-expanded="${st.detalii}" title="Afișează detaliile">către ${esc(catreScurt)} ▾</button></div>
      <span class="pg-dt" ${P('data')}>${esc(m.data)}${m.ora?', '+esc(m.ora):''}</span></div>
     ${det}
     <div class="pg-text" ${P('corp')}>${esc(m.corp)}</div>
     ${m.semnatura?`<div class="pg-semn" ${P('semnatura')}>${esc(m.semnatura)}</div>`:''}
     ${act?`<div class="pg-act">${act}</div>`:''}</div>`}
  function hCasuta(){
    const nr=id=>{const l=inLista(id);if(id==='nefinalizate')return l.length;return l.filter(m=>!m.citit).length};
    const rand=x=>`<button type="button" data-lista="${x.id}" class="${st.lista===x.id&&!st.deschis?'on':st.lista===x.id?'on':''}"><span>${esc(x.nume)}</span>${nr(x.id)?`<span class="n">${nr(x.id)}</span>`:''}</button>`;
    const extra=(O.meniuExtra||[]).map(x=>`<button type="button" data-lista="${esc(x.id)}" class="${st.lista===x.id?'on':''}"><span>${esc(x.nume)}</span>${x.numar?`<span class="n">${x.numar}</span>`:''}</button>`).join('');
    const scrie=O.scrie?`<button type="button" class="pg-scrie" data-a="scrie">✎ Scrie</button>`:`<button type="button" class="pg-scrie" data-a="scrie" disabled title="Butonul Scrie îl folosești în lecția 14">✎ Scrie</button>`;
    const m=st.deschis&&msg(st.deschis);
    return `<div class="pg-app"><div class="pg-sus"><button type="button" class="pg-ic" data-a="meniu" aria-label="Meniul principal" title="Meniul principal">☰</button><span class="pg-logo">Gmail</span>
      <span class="pg-cauta" aria-hidden="true">Căutare (nu o folosim azi)</span>
      <button type="button" class="pg-profil" data-a="profil" aria-label="Profil" title="Profil" aria-expanded="${st.profil}">${esc(ini(cont))}</button></div>
     <p class="pg-ingust">Pe ecranul îngust, meniul principal (în Gmail stă în stânga) apare aici, deasupra listei.</p>
     <div class="pg-corp"><nav class="pg-meniu" aria-label="Meniul principal">${scrie}${LISTE.map(rand).join('')}
       <button type="button" class="pg-mm" data-a="mai-multe" aria-expanded="${st.maiMulte}"><span>${st.maiMulte?'Mai puține ▴':'Mai multe ▾'}</span></button>
       ${st.maiMulte?MAI_MULTE.map(rand).join(''):''}${extra}</nav>
      <div class="pg-main">${m?hMesaj(m):hLista()}</div></div></div>
     ${st.profil?`<div class="pg-pm" role="dialog" aria-label="Profil"><div class="av">${esc(ini(cont))}</div><b>${esc(cont.nume)}</b><div class="ad">${esc(cont.adresa)}</div>
       ${st.alteDeschise.length?`<div class="alt">Tot în browserul acesta: ${st.alteDeschise.map(c=>esc(c.nume+' · '+c.adresa)).join('; ')}</div>`:''}
       <button type="button" data-a="gestioneaza">Gestionează Contul Google</button><button type="button" data-a="deconecteaza">${st.alteDeschise.length?'Deconectează-te de la toate conturile':'Deconectează-te'}</button>
       <button type="button" data-a="profil-x" aria-label="Închide">Închide</button></div>`:''}`}
  /* pagina Contului Google (după conectarea pornită din accounts.google.com): nu e Gmail-ul */
  function hCont(){return `<div class="pg-card"><div class="pg-g">Google</div><h3>Contul Google</h3><p class="pg-sub0">${esc(cont.nume)}</p>
     <p>Aici e pagina Contului Google, nu Gmail-ul. Ca să ajungi la mesaje, scrie sus, în bara de adrese, <b>gmail.com</b> și apasă <kbd>Enter</kbd>.</p></div>`}
  /* întrebarea browserului: desen APROXIMATIV (cuvintele exacte nu sunt în ajutorul Google / Microsoft; surse.md §3, §11) */
  function hBula(){
    if(!st.bula)return '';
    const B=BR==='edge'?{t:'Salvați parola?',s:'Salvare',r:'Nu acum',n:'Edge'}:{t:'Salvezi parola?',s:'Salvează',r:'Niciodată',n:'Chrome'};
    return `<div class="pg-bula" role="dialog" aria-label="Întrebarea browserului"><div class="s"><b>${B.t}</b><button type="button" class="pg-x" data-a="bula-x" aria-label="Închide (✕)" title="Închide">✕</button></div>
     <div class="d">${esc(st.adresa)} · ••••••••••</div><div class="pg-btns"><button type="button" class="pg-sec" data-a="bula-refuza">${B.r}</button><button type="button" class="pg-prim" data-a="bula-salveaza">${B.s}</button></div>
     <p class="pg-mic">Întrebarea vine de la browser, nu de la Gmail. Desen aproximativ după ${B.n}: pe calculatorul tău cuvintele pot fi altele. Orice buton care nu salvează e bun.</p></div>`}
  function hPanou(){if(!st.panou)return '';
    return `<div class="pg-panou" role="dialog" aria-label="${esc(st.panou.titlu||'Fereastră')}"><div class="cap"><span>${esc(st.panou.titlu||'')}</span><button type="button" class="pg-x" data-a="panou-x" aria-label="Închide">✕</button></div><div class="c" id="pg-panou-c"></div></div>`}

  function deseneaza(focus){
    const ecr=st.ecran==='fila'?hFila():st.ecran==='conectare-adresa'?hAdresa():st.ecran==='conectare-parola'?hParola():st.ecran==='cont'?hCont():hCasuta();
    root.innerHTML=`<div class="pg">${hBara()}<div class="pg-ecran">${st.info?`<p class="pg-info" aria-live="polite">${st.info}</p>`:''}${O.parti&&st.deschis?hCere():''}${ecr}</div>${hBula()}${hPanou()}</div>`;
    if(st.panou){const c=root.querySelector('#pg-panou-c');if(typeof st.panou.continut==='string')c.innerHTML=st.panou.continut;else if(st.panou.continut)c.appendChild(st.panou.continut)}
    if(O.parti){const atinse=Object.values(st.parti);root.querySelectorAll('[data-parte]').forEach(e=>{e.classList.add('pg-tinta');if(atinse.indexOf(e.dataset.parte)>=0)e.classList.add('pg-atins')})}
    leaga();emite('schimbare');
    const f=focus&&root.querySelector(focus);if(f)f.focus({preventScroll:true})}
  function hCere(){const c=O.parti.cere||[];
    return `<div class="pg-cere"><b>Atinge în mesaj, pe rând:</b><ol>${c.map((p,i)=>`<li class="${i===st.pas?'acum':''}">${esc(PARTI[p]||p)}${st.parti[i]?` <span class="ales">— ai atins: ${esc(PARTI[st.parti[i]]||st.parti[i])}</span>`:''}</li>`).join('')}</ol>
      ${st.pas>=c.length?'<span>Gata. Apasă <b>Verifică</b>.</span>':''}</div>`}

  /* --- acțiunile --- */
  const GMAIL=/^(https?:\/\/)?(www\.)?(gmail\.com|mail\.google\.com)(\/.*)?$/i;
  const CONTG=/^(https?:\/\/)?(accounts|myaccount)\.google\.com(\/.*)?$/i;
  function mergiLa(text){
    const t=String(text||'').trim();
    if(GMAIL.test(t)){st.ajunsGmail=true;st.info='';st.dest='gmail';
      if(st.conectat){st.ecran='casuta';st.url='mail.google.com/mail/u/0/#inbox'}
      else{st.ecran='conectare-adresa';st.url='accounts.google.com/v3/signin/identifier';st.err=''}
      emite('bara',{text:t,ok:true});deseneaza(st.ecran==='conectare-adresa'?'#pg-in-adr':null);return true}
    /* accounts.google.com: un browser adevărat deschide pagina de conectare a Contului Google („Folosește Contul Google”),
       iar după conectare pagina contului, nu Gmail-ul (probat 12.10.2026, _proba/surse_reparare2.py) */
    if(CONTG.test(t)){st.dest='cont';st.err='';
      if(st.conectat){st.ecran='cont';st.url='myaccount.google.com'}else{st.ecran='conectare-adresa';st.url='accounts.google.com/v3/signin/identifier'}
      st.info='Ai deschis pagina <b>Contului Google</b>, nu Gmail-ul. Așa face și browserul adevărat: după conectare ajungi în pagina contului, nu la mesaje. Pentru Gmail scrie în bara de adrese <b>gmail.com</b>.';
      emite('bara',{text:t,ok:false,cont:true});deseneaza(st.ecran==='conectare-adresa'?'#pg-in-adr':'.pg-url');return false}
    st.info=t?`Un browser adevărat ar căuta „${esc(t)}” pe Internet sau ar deschide alt site. Aici merge doar adresa Gmail: <b>gmail.com</b>.`:'Bara de adrese e goală: scrie <b>gmail.com</b>.';
    emite('bara',{text:t,ok:false});deseneaza('.pg-url');return false}
  function trimiteAdresa(text){
    const t=String(text==null?'':text).trim();adresaScrisa=String(text==null?'':text);
    let ok=false,motiv='';
    if(!t)motiv='Scrie întâi adresa de e-mail.';
    else{const c=conturi.find(x=>x.adresa.toLowerCase()===t.toLowerCase());
      if(c){ok=true;st.adresa=c.adresa}
      else{const v=verificaAdresa(t);
        motiv=!t.includes('@')?'Nu găsim contul. Scrie adresa întreagă: înainte de @, @ și domeniul școlii.'
          :v.ok?'Nu găsim contul cu această adresă. Verific-o semn cu semn, cu adresa din exercițiu.'
          :`Nu găsim contul: adresa ${v.probleme.join(', ')}. Verific-o semn cu semn.`}}
    st.err=ok?'':motiv;emite('conectare-adresa',{text:t,ok,motiv});
    if(ok){st.ecran='conectare-parola';st.url='accounts.google.com/v3/signin/challenge/pwd';st.info=''}
    deseneaza(ok?'#pg-in-par':'#pg-in-adr');return ok}
  function trimiteParola(p){
    const c=conturi.find(x=>x.adresa===st.adresa),ok=!!c&&String(p||'')===c.parola;
    /* textele sunt ale căsuței de exersare, nu ale Google (pe pagina adevărată sunt alte cuvinte; surse.md §9) */
    if(!ok&&String(p||''))st.greseliParola++;
    st.err=ok?'':String(p||'')?'Parolă greșită. Mai scrie-o o dată, atent la literele mari și mici, la cifre și la semne.':'Scrie întâi parola.';
    if(!ok&&st.greseliParola>=2)st.info='A doua oară tot greșit. Aici copiază parola din exercițiu, semn cu semn. Pe calculatorul adevărat nu ghicești parole la nesfârșit: închizi fila cu × și îi spui profesorului.';
    emite('conectare-parola',{ok,greseli:st.greseliParola});
    if(ok&&st.dest==='cont'){st.conectat=true;st.iesit=false;st.ecran='cont';st.deschis=null;st.url='myaccount.google.com';st.info='';
      if(O.intreabaParola){st.bula=true;st.bulaVazuta=true}
      emite('conectat',{adresa:c.adresa,cont:true});deseneaza(st.bula?'[data-a="bula-x"]':'.pg-url');return ok}
    if(ok){st.conectat=true;st.iesit=false;st.ecran='casuta';st.lista='primite';st.deschis=null;st.url='mail.google.com/mail/u/0/#inbox';st.info='';
      if(st.vizitate.indexOf('primite')<0)st.vizitate.push('primite');
      if(c.adresa!==cont.adresa){/* alt cont (lecțiile care vin) */}
      if(O.intreabaParola){st.bula=true;st.bulaVazuta=true}
      emite('conectat',{adresa:c.adresa})}
    deseneaza(ok?(st.bula?'[data-a="bula-x"]':'[data-lista="primite"]'):'#pg-in-par');return ok}
  function deschideLista(id){if(!st.conectat||st.ecran!=='casuta')return false;st.lista=id;st.deschis=null;st.profil=false;if(!st.parolaSalvata&&!st.tineInfo)st.info='';st.tineInfo=false;
    if(MAI_MULTE.some(x=>x.id===id))st.maiMulte=true;
    if(st.vizitate.indexOf(id)<0)st.vizitate.push(id);st.url='mail.google.com/mail/u/0/#'+({primite:'inbox',trimise:'sent',nefinalizate:'drafts',spam:'spam',cos:'trash'}[id]||'label/'+id);
    emite('lista',{id});deseneaza(`[data-lista="${id}"]`);return true}
  function deschideMesaj(id){const m=msg(id);if(!m||!st.conectat)return false;st.lista=m.lista;st.deschis=id;st.profil=false;m.citit=true;if(!st.parolaSalvata&&!st.tineInfo)st.info='';st.tineInfo=false;
    if(st.deschise.indexOf(id)<0)st.deschise.push(id);if(st.vizitate.indexOf(m.lista)<0)st.vizitate.push(m.lista);
    if(MAI_MULTE.some(x=>x.id===m.lista))st.maiMulte=true;st.pas=0;st.parti={};
    emite('deschide',{id});deseneaza('[data-a="inapoi"]');return true}
  function arataDetalii(v){st.detalii=v==null?!st.detalii:!!v;emite('detalii',{deschis:st.detalii});deseneaza('[data-a="detalii"]')}
  function atingeParte(p){if(!O.parti||!st.deschis)return;const c=O.parti.cere||[];if(st.pas>=c.length)return;
    st.parti[st.pas]=p;emite('parte',{cerut:c[st.pas],atins:p});st.pas++;deseneaza(`[data-parte="${p}"]`)}
  function deconecteaza(){if(!st.conectat)return false;const toate=st.alteDeschise.length>0;
    st.conectat=false;st.iesit=true;st.profil=false;st.deschis=null;st.bula=false;st.alteDeschise=[];st.dest='gmail';
    st.ecran='conectare-adresa';st.url='accounts.google.com/v3/signin/identifier';st.err='';adresaScrisa='';
    st.info=(toate?'Ai ieșit din toate conturile deschise.':'Ai ieșit din cont.')+' (Pe calculatorul adevărat poate apărea întâi o listă cu contul tău, arătat ca deconectat: fără parolă nu mai intră nimeni.)';
    emite('deconectat',{toate});deseneaza('#pg-in-adr');return true}
  const dupaBula=()=>st.ecran==='casuta'?'[data-lista="primite"]':'.pg-url';
  function inchideBula(){if(!st.bula)return;st.bula=false;st.bulaInchisa=true;st.bulaRaspuns='inchide';emite('bula',{raspuns:'inchide'});deseneaza(dupaBula())}
  /* „Niciodată” (Chrome) / „Nu acum” (Edge): parola nu se salvează (în Chrome, pagina trece la „Site-uri și aplicații refuzate”) */
  function refuzaBula(){if(!st.bula)return;st.bula=false;st.bulaInchisa=true;st.bulaRaspuns='refuza';
    if(BR==='chrome')st.info='Ai apăsat <b>Niciodată</b>: parola nu s-a salvat, iar browserul nu te mai întreabă pe pagina aceasta. E bine și așa.';
    emite('bula',{raspuns:'refuza'});deseneaza(dupaBula())}
  /* clic în pagină, alături de întrebare: browserul o închide, fără să salveze parola */
  function bulaAlaturi(){if(!st.bula)return;st.bula=false;st.bulaInchisa=true;st.bulaRaspuns='alaturi';st.tineInfo=true;
    st.info='Ai apăsat alături, iar întrebarea browserului s-a închis: parola nu s-a salvat. Data viitoare apasă ✕ sau butonul care nu salvează, ca să fii sigur.';
    emite('bula',{raspuns:'alaturi'})}
  function salveazaBula(){if(!st.bula)return;st.bula=false;st.parolaSalvata=true;st.bulaRaspuns='salveaza';st.butonSalv=BR==='edge'?'Salvare':'Salvează';
    st.info='Ai apăsat <b>'+st.butonSalv+'</b>: pe un calculator adevărat, parola ar fi rămas în browserul calculatorului comun și următorul elev ar putea intra în contul tău. Ce faci atunci: ieși oricum din cont și îi spui profesorului înainte să pleci, ca el să șteargă parola din browser. (Aici nu s-a salvat nimic.)';
    emite('bula',{raspuns:'salveaza'});deseneaza(dupaBula())}

  function leaga(){
    /* întrebarea browserului deschisă: un clic oriunde în pagină, în afara ei, o închide fără salvare (ca în Chrome),
       iar clicul merge mai departe la ce ai apăsat (nu e „înghițit”) */
    const pgEl=root.querySelector('.pg');
    if(st.bula&&pgEl)pgEl.addEventListener('click',e=>{if(!st.bula||e.target.closest('.pg-bula'))return;bulaAlaturi();
      setTimeout(()=>{if(!st.bula&&root.querySelector('.pg-bula')){st.tineInfo=false;deseneaza(dupaBula())}},0)},true);
    const url=root.querySelector('.pg-url');
    if(url)url.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();mergiLa(url.value)}});
    const ia=root.querySelector('#pg-in-adr');if(ia){ia.addEventListener('input',()=>{adresaScrisa=ia.value});ia.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();trimiteAdresa(ia.value)}})}
    const ip=root.querySelector('#pg-in-par');if(ip)ip.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();trimiteParola(ip.value)}});
    root.querySelectorAll('[data-a]').forEach(b=>{if(b.tagName!=='BUTTON')return;b.addEventListener('click',ev=>{
      const a=b.dataset.a;
      if(O.parti&&b.dataset.parte&&st.deschis){ev.preventDefault();atingeParte(b.dataset.parte);return}
      if(a==='enter')mergiLa(url&&url.value);
      else if(a==='inainte')trimiteAdresa(ia&&ia.value);
      else if(a==='inainte-parola')trimiteParola(ip&&ip.value);
      else if(a==='alta-adresa'){st.ecran='conectare-adresa';st.err='';st.url='accounts.google.com/v3/signin/identifier';deseneaza('#pg-in-adr')}
      else if(a==='uitat-adresa'){st.info='La contul de la școală, adresa ți-o spune profesorul. N-o ghici și nu încerca adresele colegilor.';emite('uitat',{ce:'adresa'});deseneaza('#pg-in-adr')}
      else if(a==='uitat-parola'){st.info='Contul acesta e al școlii. Ca să primești o parolă nouă, îi spui profesorului: el sau administratorul conturilor școlii îți poate da o parolă nouă. (Pe pagina adevărată, mesajul are alte cuvinte.)';emite('uitat',{ce:'parola'});deseneaza('#pg-in-par')}
      else if(a==='creeaza'){st.info='La școală nu-ți faci alt cont: intri cu contul de la școală. Dacă nu-l știi, îl întrebi pe profesor.';emite('creeaza-cont');deseneaza('#pg-in-adr')}
      else if(a==='invitat'){st.info='Modul pentru invitați e un fel de a folosi browserul fără să rămână nimic pe calculator. În laborator faci ce scrie în lecție: nu salvezi parola și, la final, ieși din cont.';emite('invitat');deseneaza('#pg-in-adr')}
      else if(a==='bula-x')inchideBula();
      else if(a==='bula-refuza')refuzaBula();
      else if(a==='bula-salveaza')salveazaBula();
      else if(a==='mai-multe'){st.maiMulte=!st.maiMulte;emite('mai-multe',{deschis:st.maiMulte});deseneaza('[data-a="mai-multe"]')}
      else if(a==='inapoi'){st.deschis=null;st.pas=0;st.parti={};deseneaza(`[data-lista="${st.lista}"]`)}
      else if(a==='detalii')arataDetalii();
      else if(a==='profil'){st.profil=!st.profil;emite('profil',{deschis:st.profil});deseneaza(st.profil?'[data-a="deconecteaza"]':'[data-a="profil"]')}
      else if(a==='profil-x'){st.profil=false;deseneaza('[data-a="profil"]')}
      else if(a==='gestioneaza'){st.info='Pagina contului nu o folosim azi.';st.profil=false;deseneaza('[data-a="profil"]')}
      else if(a==='deconecteaza')deconecteaza();
      else if(a==='meniu'){st.info='Butonul ☰ strânge sau lărgește meniul principal. Nu-l folosim azi.';deseneaza('[data-a="meniu"]')}
      else if(a==='scrie'){emite('scrie');if(O.scrie)O.scrie(inst)}
      else if(a==='panou-x')inchidePanou()})});
    root.querySelectorAll('[data-lista]').forEach(b=>b.addEventListener('click',()=>deschideLista(b.dataset.lista)));
    root.querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',()=>deschideMesaj(b.dataset.m)));
    root.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>{const a=(O.actiuniMesaj||[]).find(x=>x.id===b.dataset.act);emite('actiune',{id:b.dataset.act,mesaj:st.deschis});if(a&&a.la)a.la(inst,msg(st.deschis))}));
    if(O.parti)root.querySelectorAll('[data-parte]').forEach(e=>{if(e.tagName==='BUTTON')return;
      e.addEventListener('click',()=>atingeParte(e.dataset.parte));
      e.addEventListener('keydown',k=>{if(k.key==='Enter'||k.key===' '){k.preventDefault();atingeParte(e.dataset.parte)}})});
  }
  function arataPanou(continut,titlu){st.panou={continut,titlu};deseneaza('[data-a="panou-x"]')}
  function inchidePanou(){st.panou=null;deseneaza()}
  const inst={root,
    stare:()=>JSON.parse(JSON.stringify(Object.assign({},st,{panou:!!st.panou}))),
    jurnal:()=>J.slice(),
    on(n,f){(asc[n]=asc[n]||[]).push(f);return ()=>{asc[n]=asc[n].filter(x=>x!==f)}},
    mergiLa,deschideLista,deschideMesaj,arataDetalii,atingeParte,deconecteaza,inchideBula,refuzaBula,salveazaBula,
    conecteaza(a,p){if(st.ecran==='fila')mergiLa('gmail.com');if(st.conectat)return true;if(!trimiteAdresa(a))return false;return trimiteParola(p)},
    mesaje:()=>JSON.parse(JSON.stringify(M)),
    adaugaMesaj(m){M.push(JSON.parse(JSON.stringify(m)));deseneaza()},
    mutaMesaj(id,l){const m=msg(id);if(m){m.lista=l;if(st.deschis===id)st.deschis=null;deseneaza()}},
    stergeMesaj(id){inst.mutaMesaj(id,'cos')},
    arataPanou,inchidePanou,redeseneaza:()=>deseneaza(),
    reset(){M=JSON.parse(JSON.stringify(O.mesaje||MESAJE_IOANA));adresaScrisa='';nou();deseneaza()},
    distruge(){root.innerHTML=''},
    cont:()=>Object.assign({},cont)};
  deseneaza();
  return inst}

/* ---------------- verificările (pe stare) ---------------- */
const TESTE={
  bara:{ce:()=>'Ai deschis Gmail din bara de adrese (gmail.com, apoi Enter)',f:s=>s.ajunsGmail,m:()=>'Scrie gmail.com în bara de adrese și apasă Enter.'},
  conectat:{ce:(Q,v)=>`Ai intrat în contul ${v||'din exercițiu'} (adresa, Înainte, parola, Înainte)`,f:s=>s.conectat||s.iesit,m:()=>'Încă nu ești în cont: adresa, Înainte, apoi parola și iar Înainte.'},
  nesalvata:{ce:()=>'La întrebarea browserului despre parolă n-ai salvat parola: ai refuzat (✕ sau butonul care nu salvează)',f:s=>s.bulaVazuta&&s.bulaInchisa&&!s.parolaSalvata,
    m:s=>s.parolaSalvata?'Ai apăsat '+(s.butonSalv||'Salvează')+'. Pe calculatorul comun nu salvezi parola: apasă „Ia-o de la capăt”.':'Întrebarea apare după conectare: refuz-o cu ✕ sau cu butonul care nu salvează.'},
  deschis:{ce:(Q,v,d)=>`Ai deschis mesajul ${d||v}`,f:(s,v)=>s.deschise.indexOf(v)>=0,m:()=>'Încă n-ai deschis mesajul cerut. Caută-l în lista potrivită din meniul principal.'},
  vazut:{ce:(Q,v)=>`Te-ai uitat în ${v.map(numeLista).join(' și în ')}`,f:(s,v)=>v.every(x=>s.vizitate.indexOf(x)>=0),
    m:(s,v)=>'Încă n-ai deschis: '+v.filter(x=>s.vizitate.indexOf(x)<0).map(numeLista).join(', ')+'.'+(v.some(x=>MAI_MULTE.some(y=>y.id===x))?' Spam și Coș de gunoi apar după ce apeși Mai multe.':'')},
  /* mesajul de sub ✗: „din Spam” când toate mesajele deschise dintre cele interzise sunt din Spam (contul TĂU), altfel
     „nu e al tău” (contul altcuiva rămas deschis); `m` pe test bate amândouă (reparația J1, 12.10.2026) */
  necitit:{ce:(Q,v,d)=>`N-ai deschis niciun mesaj ${d||'al altcuiva'}`,f:(s,v)=>!v.some(x=>s.deschise.indexOf(x)>=0),
    m:(s,v,Q)=>{const L=(Q&&Q.sim&&Q.sim.mesaje)||MESAJE_IOANA,des=v.filter(x=>s.deschise.indexOf(x)>=0);
      return des.length&&des.every(id=>{const m=L.find(y=>y.id===id);return m&&m.lista==='spam'})
        ?'Ai deschis un mesaj din Spam. Pe acestea nu le deschizi: te uiți doar la listă. Apasă „Ia-o de la capăt”.'
        :'Ai deschis un mesaj care nu e al tău. Nu se face: apasă „Ia-o de la capăt”.'}},
  iesit:{ce:()=>'La final ai ieșit din cont (Profil, apoi Deconectează-te)',f:s=>s.iesit&&!s.conectat,m:()=>'Încă ești în cont: apasă Profil (cerculețul din dreapta sus), apoi Deconectează-te.'},
  parte:{ce:(Q,v,d)=>`Ai atins ${PARTI[v]||v}`,f:(s,v,Q,f,i)=>s.parti[i]===v,m:(s,v,Q,f,i)=>s.parti[i]?`Ai atins ${PARTI[s.parti[i]]||s.parti[i]}, nu ${PARTI[v]||v}.`:'Încă n-ai atins partea asta.'},
  /* fișa: răspunsul scris se compară fără majuscule, diacritice și semne de la capăt; la adrese (c.adresa) se ia doar
     adresa — ce e între < și > sau bucata cu @ — deci trece și rândul copiat întreg „Nume <adresa>” (reparația J1) */
  fisa:{ce:(Q,v,d)=>d||'Ai completat fișa',f:(s,v,Q,fisa)=>{const c=(Q.fisa||[]).find(x=>x.id===v);if(!c)return false;
      const n=x=>c.adresa?doarAdresa(x):norm(x);return (c.ok||[]).map(n).indexOf(n(fisa[v]))>=0},
    m:(s,v,Q,fisa)=>{const c=((Q&&Q.fisa)||[]).find(x=>x.id===v)||{};fisa=fisa||{};
      if(!norm(fisa[v]))return 'Încă n-ai completat căsuța din fișă.';
      if(c.adresa&&String(fisa[v]).indexOf('@')<0)return 'Aici scrii adresa, cu @: o vezi între < și >, lângă nume.';
      return c.adresa?'Adresa din fișă nu se potrivește: verific-o semn cu semn cu cea dintre < și > din mesaj.':'Răspunsul din fișă nu se potrivește: uită-te încă o dată în mesaj.'}}};
function doarAdresa(x){let s=String(x||'');const u=s.match(/<([^<>]*@[^<>]*)>/);if(u)s=u[1];
  else{const t=s.split(/[\s,;]+/).find(w=>w.indexOf('@')>=0);if(t)s=t}
  return s.replace(/[\s<>]/g,'').replace(/[.,;:!?]+$/,'').toLowerCase()}

/* ---------------- tipul „posta” (sarcină în căsuță, cu teste) ---------------- */
function testeDin(Q){return (Q.teste||[]).map((t,i)=>{const T=TESTE[t.c];if(!T)throw new Error('posta-gmail: test necunoscut '+t.c);
  return {c:t.c,v:t.v,i:t.i!=null?t.i:i,ce:t.ce||T.ce(Q,t.v,t.d),mm:t.m,T}})}
function evalueaza(Q,s,fisa){
  let ip=0;
  return testeDin(Q).map(t=>{const idx=t.c==='parte'?ip++:t.i;const ok=!!t.T.f(s,t.v,Q,fisa,idx);return {c:t.c,ce:t.ce,ok,m:ok?'':(t.mm||(t.T.m?t.T.m(s,t.v,Q,fisa,idx):''))}})}
function hTeste(lista,titlu){return `<div class="pg-teste"><div class="lbl">${titlu} · <span class="nr">0 din ${lista.length} trec</span></div><ol>${lista.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`}
function bifeaza(box,rez,arata){rez.forEach((r,i)=>{const li=box.querySelector(`.pg-teste li[data-i="${i}"]`);if(!li)return;
  li.className=r.ok?'ok':(arata?'rau':'');li.querySelector('.s').textContent=r.ok?'✓':(arata?'✗':'○');li.querySelector('.m').textContent=!r.ok&&arata?r.m:''});
  const n=box.querySelector('.pg-teste .nr');if(n)n.textContent=`${rez.filter(r=>r.ok).length} din ${rez.length} trec`}
function solutie(Q,inst,fisaPune,gr){
  const O=Q.sim||{},cont=O.cont||CONTURI.ioana,T=Q.teste||[],sari=gr&&gr.sari;
  const are=c=>T.some(t=>t.c===c&&c!==sari);
  if(are('bara')||(O.start==='fila'&&are('conectat')))inst.mergiLa(gr&&gr.bara||'gmail.com');
  if(are('conectat')){if(!inst.conecteaza(gr&&gr.adresa||cont.adresa,cont.parola))return}
  if(inst.stare().bula){if(gr&&gr.salveaza)inst.salveazaBula();else if(are('nesalvata'))inst.inchideBula();}
  if(gr&&gr.citeste)inst.deschideMesaj(gr.citeste);
  T.filter(t=>t.c==='vazut'&&t.c!==sari).forEach(t=>t.v.forEach(l=>inst.deschideLista(l)));
  T.filter(t=>t.c==='deschis'&&t.c!==sari).forEach(t=>inst.deschideMesaj(t.v));
  if(are('parte')){const ps=T.filter(t=>t.c==='parte');if(!inst.stare().deschis&&O.deschide)inst.deschideMesaj(O.deschide);
    ps.forEach((t,k)=>inst.atingeParte(gr&&gr.parte&&k===ps.length-1?gr.parte:t.v))}
  (Q.fisa||[]).forEach(c=>fisaPune(c.id,gr&&gr.fisa&&gr.fisa[c.id]!=null?gr.fisa[c.id]:(c.ok||[''])[0]));
  if(are('iesit'))inst.deconecteaza()}
const posta={
  render(Q,body,api){
    stil();const lista=testeDin(Q);
    body.innerHTML=`<div class="pg-sarcina"><div class="pg-loc"></div>
      ${(Q.fisa||[]).length?`<div class="pg-fisa"><div class="lbl">${Q.fisaTitlu||'Fișa ta (scrii ce citești în mesaj)'}</div>${Q.fisa.map(c=>CAMP('pg-f-'+c.id,c.et,'',c.ph||'')).join('')}</div>`:''}
      ${hTeste(lista,'Testele sarcinii')}<button type="button" class="pg-reset" data-pg="reset">Ia-o de la capăt</button></div>`;
    const loc=body.querySelector('.pg-loc'),fisa={};
    let inst;
    const upd=arata=>{const r=evalueaza(Q,inst.stare(),fisa);bifeaza(body,r,arata);return r};
    const porneste=()=>{inst=creeaza(loc,Q.sim||{});inst.on('schimbare',()=>upd(false));upd(false)};
    (Q.fisa||[]).forEach(c=>{const i=body.querySelector('#pg-f-'+c.id);fisa[c.id]='';i.addEventListener('input',()=>{fisa[c.id]=i.value;upd(false)})});
    const fisaPune=(id,v)=>{fisa[id]=v;const i=body.querySelector('#pg-f-'+id);if(i)i.value=v;upd(false)};
    porneste();
    body.querySelector('[data-pg="reset"]').onclick=()=>{(Q.fisa||[]).forEach(c=>fisaPune(c.id,''));porneste();const u=loc.querySelector('.pg-url,#pg-in-adr,[data-lista="primite"]');if(u)u.focus({preventScroll:true})};
    body._rezolva=()=>{inst.reset();(Q.fisa||[]).forEach(c=>fisaPune(c.id,''));solutie(Q,inst,fisaPune,null);upd(false)};
    body._gresit=()=>{inst.reset();(Q.fisa||[]).forEach(c=>fisaPune(c.id,''));solutie(Q,inst,fisaPune,Q.gresit||{sari:(Q.teste||[]).slice(-1)[0].c});upd(false)};
    body._inst=()=>inst;
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok).length;
      if(!rau){nav.innerHTML='';api.resolve(true)}
      else{api.resolve(false,`${rau===1?'Un test nu trece':rau+' teste nu trec'} (marcate cu ✗; sub fiecare scrie de ce). Continuă de unde ai rămas și apasă din nou.`,r.every(x=>!x.ok));
        api.revealButton(()=>{body._rezolva();upd(true);nav.innerHTML='';api.giveUp(Q.arata||'am făcut pașii în căsuța de mai sus: citește-i în ordine și uită-te la teste.')})}
      /* după „Verifică” (greșit), focusul înapoi în căsuță, pe locul de lucru (regula 14), fără derulare */
      if(rau){const f=loc.querySelector('#pg-in-adr,#pg-in-par,[data-a="bula-x"],.pg-meniu button.on,.pg-url');if(f)f.focus({preventScroll:true})}},Q.buton||'Verifică');
  },
  rezolva(Q,body){body._rezolva()},
  gresit(Q,body){body._gresit()}
};

/* ---------------- tipul „adresa” ---------------- */
/* adresa așteptată: Q.solutie; la 'desparte', chiar adresa dată; altfel prenume.nume@domeniu, cu litere mici, fără diacritice */
function asteptata(Q){if(Q.solutie)return Q.solutie;if(Q.mod==='desparte')return String(Q.adresa||'');
  const n=s=>faraDiacritice(s).toLowerCase().replace(/\s+/g,'');return `${n(Q.prenume)}.${n(Q.nume)}@${Q.domeniu}`}
const adresa={
  render(Q,body,api){
    stil();const mod=Q.mod||'scrie',exp=asteptata(Q),utilizator=exp.split('@')[0],domeniu=exp.split('@')[1];
    const teste=mod==='desparte'?[
      {ce:'În prima căsuță: numele de utilizator (tot ce e înainte de @)',f:(a,b)=>norm(a)===utilizator.toLowerCase()},
      {ce:'În a doua căsuță: domeniul (tot ce e după @)',f:(a,b)=>norm(b)===domeniu.toLowerCase()},
      {ce:'Semnul @ nu intră în niciuna dintre căsuțe',f:(a,b)=>!!(a||b)&&!/@/.test(a+b)}]:[
      {ce:'Are exact un @',f:a=>verificaAdresa(a).arond},
      {ce:'Nu are spații',f:a=>!!a.trim()&&!/\s/.test(a.trim())},
      {ce:'Nu are diacritice (ă, â, î, ș, ț)',f:a=>!!a.trim()&&!verificaAdresa(a).diacritice},
      {ce:mod==='repara'?`Înainte de @: ${utilizator.replace('.',' (punct) ')}`:'Înainte de @: prenumele, un punct, numele',f:a=>verificaAdresa(a).stanga.toLowerCase()===utilizator.toLowerCase()},
      {ce:'După @: domeniul școlii',f:a=>verificaAdresa(a).dreapta.toLowerCase()===domeniu.toLowerCase()}];
    body.innerHTML=`<div class="pg-adr">${mod==='desparte'
      ?`<p style="margin:0">Adresa: <b class="cod" style="font-family:var(--fm)">${esc(Q.adresa)}</b></p>${CAMP('pg-a1','Numele de utilizator (înainte de @)','','')}${CAMP('pg-a2','Domeniul (după @)','','')}`
      :CAMP('pg-a1',Q.eticheta||'Adresa de e-mail',mod==='repara'?Q.adresa:'','scrie aici adresa')}
      ${hTeste(teste,'Testele adresei')}</div>`;
    const a1=body.querySelector('#pg-a1'),a2=body.querySelector('#pg-a2');
    const rez=()=>teste.map(t=>{const ok=!!t.f(a1.value,a2?a2.value:'');return {ok,m:''}});
    const upd=arata=>{const r=rez();bifeaza(body,r,arata);return r};
    [a1,a2].forEach(i=>i&&i.addEventListener('input',()=>upd(false)));upd(false);
    body._pune=(x,y)=>{a1.value=x;if(a2)a2.value=y||'';upd(false)};
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok).length;
      if(!rau){nav.innerHTML='';api.resolve(true)}
      else{const v=mod==='desparte'?null:verificaAdresa(a1.value);
        api.resolve(false,`${rau===1?'Un test nu trece':rau+' teste nu trec'} (marcate cu ✗).${v&&v.probleme.length?' Adresa ta '+v.probleme.join(', ')+'.':''} Schimbă și apasă din nou.`,!a1.value.trim()&&!(a2&&a2.value.trim()));
        api.revealButton(()=>{if(mod==='desparte')body._pune(utilizator,domeniu);else body._pune(exp);upd(true);nav.innerHTML='';
          api.giveUp(mod==='desparte'?`numele de utilizator <code>${esc(utilizator)}</code>, domeniul <code>${esc(domeniu)}</code>.`:`<code>${esc(exp)}</code>`)})}
      if(rau)a1.focus({preventScroll:true})});
  },
  rezolva(Q,body){const e=asteptata(Q);if((Q.mod||'scrie')==='desparte')body._pune(e.split('@')[0],e.split('@')[1]);else body._pune(e)},
  gresit(Q,body){const e=asteptata(Q);if((Q.mod||'scrie')==='desparte')body._pune(e,'');else body._pune(Q.gresit||e.replace('.',' '))}
};

window.SimPostaGmail={creeaza,verificaAdresa,faraDiacritice,LISTE,MAI_MULTE,PARTI,TESTE,CONTURI,MESAJE_IOANA,DOMENIU:DOM,posta,adresa};
})();
