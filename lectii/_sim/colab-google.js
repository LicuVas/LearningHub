/* Simulatorul „aplicația colaborativă Google” (Drive + Documente Google) pentru lecțiile LearningHub — fișier comun
   (lectii/_sim/colab-google.js).
   PROPRIETAR: autorul lecției VII · M3 · nr. 18 („Ce este o aplicație colaborativă. Accesare și conectare”), 24.10.2026.
   Îl folosesc și îl extind (fără să-l schimbe): VII/19 (documente și prezentări în colaborare: partajarea, rolurile,
   editarea în același timp, comentariile), VII/20 (publicarea, istoricul versiunilor, contribuția fiecăruia), VII/22.
   Granița și API-ul, pe scurt: _campaign/revizuire_completa_2026_09/m3_noapte_23_10/granite/vii_l18.md.

   CE SIMULEAZĂ. Un DESEN al unui browser cu Google Drive și Documente Google, cu contul Google de la școală (decizia
   dirijorului, 23.10.2026): fereastra (normală sau privată), filele, bara de adrese, pagina de conectare (adresa →
   Înainte → parola → Înainte; textele din pagina publică, citită fără cont pe 23.10.2026), întrebarea browserului
   „Salvezi parola?”, Drive-ul (butonul Nou, Acasă, Drive-ul meu, Distribuite cu mine, Recente, Coș de gunoi, lista de
   fișiere), grila de aplicații (pătratul din 9 puncte), ecranul de pornire Documente („Începe un document nou” → Gol),
   documentul (numele „Document fără titlu” care se schimbă cu clic, Enter; textul; starea salvării „Se salvează…” →
   norul „Salvat în Drive”), meniul Profil (Deconectează-te) și închiderea ferestrei private. NU e Drive-ul adevărat:
   fără logo, fără imagini Google. Numele din interfață vin din ajutorul Google în română și din pagina publică de
   conectare (lectii/vii/m3-l18/surse.md); cele neconfirmate sunt trecute acolo ca NESIGURE. Conturile, adresele,
   persoanele și fișierele sunt INVENTATE (domeniile .test sunt rezervate pentru exemple).

   SIGURANȚA (ca lectii/_sim/posta-gmail.js și cont-sigur.js):
     - nimic din ce tastează elevul nu se scrie în localStorage / sessionStorage / cookie și nu pleacă în rețea: stă
       doar în pagină și se pierde la „Ia-o de la capăt”, la reîncărcare sau la închidere;
     - câmpurile sunt <input type="text"> / <textarea> FĂRĂ <form>, fără `name`, cu autocomplete / autocorrect /
       autocapitalize / spellcheck oprite: cu type="password" browserul calculatorului COMUN ar întreba de-adevăratelea
       „Salvezi parola?”. De aceea parola inventată SE VEDE în câmp (pe pagina adevărată apar puncte) și pagina o spune;
     - întrebarea „Salvezi parola?” e un desen: „Salvează” nu salvează nimic, doar pică testul.

   FUNCȚIA DE CREARE:
     const inst = SimColabGoogle.creeaza(elementul, optiuni)
     optiuni:
       cont        {adresa, nume, parola, initiala?}      contul inventat al elevului din exercițiu (implicit CONTURI.ana)
       conturi     [{adresa, nume, parola}]                alte conturi care „există” (implicit: doar `cont`)
       start       'fila' (filă nouă goală, implicit) | 'conectare' | 'drive' | 'docs' | 'doc'
       tinta       'drive' (implicit) | 'docs' | 'slides' | 'cont'   unde duce conectarea pornită cu start 'conectare'
       fereastra   'normala' (implicit) | 'privata'   fereastra privată are banda ei și butonul ✕ „Închide fereastra”
       browser     'chrome' (implicit) | 'edge'      rândul „Nu e computerul tău?” și desenul întrebării „Salvezi parola?”
       intreabaParola  true = după conectare apare întrebarea browserului „Salvezi parola?” (implicit false)
       fisiere     [{id, titlu, tip:'doc'|'prez'|'foaie', text?, loc:'meu'|'distribuite', proprietar?:{nume, adresa},
                     modificat?:'12 ian.'}]  fișierele contului `cont` (implicit FISIERE_ANA)
       contDeschis {adresa, nume}  la start 'drive'/'docs'/'doc' browserul e conectat în ALT cont decât `cont`
                   (un coleg a uitat să iasă); fișierele lui: `fisiereContDeschis` (implicit [])
       lista       lista Drive-ului la start: 'acasa' (implicit) | 'meu' | 'distribuite' | 'recente' | 'cos'
       deschis     id-ul fișierului deschis la start 'doc'
       cuDrive     true = la start 'doc', fila Drive-ului e deschisă alături (prima filă), iar documentul în fila a doua
       extensii    ['nume', …]   extensiile înregistrate cu SimColabGoogle.extensie(nume, fn) — fn(inst, optiuni) la creare
       butoaneDoc  [{id, text, titlu?, la(inst, fisier)}]   butoane în plus în bara documentului (lecțiile următoare)
       partajare   null (implicit: butonul „Permite accesul” e OPRIT, „îl folosești în lecția 19”) | function(inst, fisier)
       etichetaPartajare  textul butonului (implicit 'Permite accesul'; NESIGUR, vezi surse.md)
       meniuStanga [{id, nume}]   rânduri în plus în meniul din stânga al Drive-ului (după „Recente”)
       laEveniment function(nume, date)   același lucru ca inst.on('*', …)
     inst (metodele publice):
       stare()          copie a stării: {fila (fila activă: {id, ecran, url, doc, lista}), file[], conectat, iesit,
                        fostConectat, adresa, altcuiva, privata, fereastraInchisa, bulaVazuta, bulaInchisa, parolaSalvata,
                        ajuns{drive,docs,slides}, dinGrila[], creat[], lucrate[], inchise[], regasite[], deschise[],
                        vizitate[], salv{id:'se-salveaza'|'gata'}, vazutSalvat{id:bool}, verificat, grila, profil, nouMeniu}
       jurnal()  on(nume, fn)  (fn primește (nume, date); '*' = toate; întoarce funcția de dezabonare)
       mergiLa(text)                 ce face Enter în bara de adrese (fila activă)
       conecteaza(adresa, parola)    pașii paginii de conectare
       raspundeBula('refuza'|'inchide'|'salveaza')
       grila(deschis?)  alegeAplicatie('drive'|'docs'|'slides')   grila de aplicații; aplicația se deschide într-o filă nouă
       nou(deschis?)    creeazaDocument(tip='doc')              Nou → Documente Google (din Drive: filă nouă; din Documente: aceeași filă)
       redenumeste(titlu)   scrie(text)   (scrie ÎNLOCUIEȘTE textul documentului deschis; salvarea se face pe loc)
       verificaSalvarea()   ce face un elev care ține mouse-ul pe nor (sau îl atinge): vede „Salvat în Drive”
       filaNoua()  comutaFila(id)  inchideFila(id?)   arataLista(id)   selecteaza(id)   deschideFisier(id)
       deconecteaza()   inchideFereastra()   profil(deschis?)
       fisiere()  fisier(id)  adaugaFisier(f)  modificaFisier(id, patch)
       slot(nume, fn)   desene în plus: 'doc-bara' (lângă butoanele documentului), 'doc-lateral' (panou în dreapta
                        documentului), 'drive-sus' (deasupra listei din Drive), 'doc-pagina' (ÎNLOCUIEȘTE foaia
                        documentului: extensia scrie textul cu inst.scrie / modificaFisier). fn(fisier, stare) → HTML | Element
       arataPanou(html|Element, titlu) / inchidePanou()   o fereastră peste aplicație
       redeseneaza()  reset()  distruge()
     EVENIMENTE: 'bara' {text, ok, tinta?} · 'conectare-adresa' {text, ok, motiv} · 'conectare-parola' {ok, greseli}
       · 'uitat' {ce} · 'creeaza-cont' · 'invitat' · 'bula' {raspuns} · 'conectat' {adresa} · 'grila' {deschis}
       · 'aplicatie' {id} · 'nou' {deschis} · 'creat' {id, tip} · 'titlu' {id, titlu} · 'scris' {id, randuri}
       · 'salvare' {id, stare} · 'salvat-vazut' {id} · 'fila-noua' {id} · 'fila' {id} · 'fila-inchisa' {id, doc}
       · 'lista' {id} · 'selectat' {id} · 'deschis' {id, din} · 'profil' {deschis} · 'deconectat' {altcuiva}
       · 'verificat' · 'fereastra-inchisa' · 'partajare' {id} · 'actiune' {id, fisier} · 'desenat' · 'schimbare'.
   EXTENSII (colegii simulați, partajarea, comentariile… — lecțiile următoare):
       SimColabGoogle.extensie('nume', (inst, optiuni) => { inst.slot('doc-lateral', f => '…'); inst.on('desenat', …) })
       apoi în lecție: SimColabGoogle.creeaza(el, {extensii:['nume'], …}). Codul de aici nu se schimbă pentru asta.

   VERIFICĂRI pe stare: SimColabGoogle.TESTE[cheie] = {ce(Q, v, d), f(stare, v, Q), m(stare, v, Q)}
     bara {v:'drive'|'docs'}, conectat, nesalvata, grila {v:'docs'|'drive'|'slides'}, creat {v:'doc'}, titlu {v:'nume'},
     scris {v:numărul de rânduri}, salvat, inchis, regasit, distribuite, necitit {v:[id-uri]}, iesit, verificat, fereastra.
     Orice element din Q.teste poate avea `m` (mesajul de sub ✗) și `d` (descrierea din textul testului).
   TIPUL pentru motor (tipuri:{colab:SimColabGoogle.colab}):
     colab  o sarcină în simulator, cu teste numite care se bifează singure.
            Q {sim:{…opțiunile de mai sus…}, teste:[{c, v?, d?, ce?, m?}], arata?, buton?,
               gresit?:{sari:'cheia unui test' | adresa:'…' | salveaza:true | titlu:'…' | text:'…' | deschide:'id'}}
            rezolva/gresit fac pașii prin metodele lui inst (nu prin clicuri), deci poarta merge și pe telefon.
   DATE: SimColabGoogle.DOMENIU, .CONTURI (ana, radu, ioana — parole inventate), .FISIERE_ANA, .TIPURI_FISIER.

   NU SCHIMBAȚI AICI (lecțiile 19-22 se sprijină pe ele): textele paginii de conectare, pașii conectării (adresa →
   Înainte → parola → Înainte) și ai ieșirii (Profil → Deconectează-te), numele testelor din TESTE și forma lui Q,
   regula „nimic nu se salvează, nimic nu pleacă” (fără type="password", fără <form>). Un lucru nou = extensie nouă în
   lectii/_sim/ (de exemplu colab-google-partajare.js), cu nume nou.

   CLASELE CSS (lămurit la reparația J1, 24.10.2026): containerele au prefixul `cg-`; ÎNĂUNTRUL lor sunt și clase scurte
   (lbl, nr, s, m, on, sel, t, n, p, d, c, cap, gr, av, ad, pg), scrise în CSS doar sub un părinte `.cg` / `.cg-*`, deci nu
   ies din simulator. Excepție știută: `.cg-teste .lbl` primește și regula globală `.lbl` din motor.css (litere mari,
   monospațiat), ca titlul testelor la celelalte simulatoare; extensiile 19/20 refolosesc marcajul testelor
   (`.cg-teste .lbl/.nr/.s/.m`), de aceea numele lor NU se schimbă. Nu folosiți clasele `foaie`, `doc`, `lbl` în afara lui `.cg`.
   SCHIMBĂRI după publicarea API-ului (doar texte, API-ul neatins): 24.10.2026, reparația J1 — mesajul testului `verificat`
   când fereastra privată e deja închisă; nota întrebării de parolă spune că, în fereastra privată, întrebarea poate lipsi. */
(function(){
'use strict';
const CSS=`
.cg{position:relative;border:1px solid var(--line);border-radius:12px;background:var(--paper);overflow:hidden;font-size:.95rem;line-height:1.4;color:var(--ink)}
.cg button{font:inherit;color:inherit}
.cg-priv{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 6px 4px 12px;background:#2B2F36;color:#F1F3F5;font-size:.84rem}
.cg-priv b{color:#fff}
.cg-priv .cg-x{color:#fff!important}
.cg-br{background:var(--paper2);border-bottom:1px solid var(--line);padding:6px 8px 8px}
.cg-priv+.cg-br{background:#3A3F47}
.cg-priv+.cg-br .cg-fila{background:#4A505A;color:#F1F3F5;border-color:#5A616C}
.cg-priv+.cg-br .cg-fila.on{background:#5A616C}
.cg-priv+.cg-br .cg-plus{color:#F1F3F5!important}
.cg-file{display:flex;gap:4px;align-items:flex-end;margin-bottom:6px;overflow-x:auto}
.cg-fila{display:inline-flex;align-items:center;gap:2px;max-width:46%;min-height:34px;padding:0 2px 0 10px;border:1px solid var(--line);border-bottom:0;border-radius:8px 8px 0 0;background:var(--paper2);font-size:.82rem;white-space:nowrap;cursor:pointer;flex:0 1 auto}
.cg-fila.on{background:var(--paper);font-weight:700}
.cg-fila .t{overflow:hidden;text-overflow:ellipsis;max-width:22ch}
.cg-fila .cg-fx{min-width:32px;min-height:32px;border:0;background:transparent;cursor:pointer;border-radius:6px;font-size:.9rem}
.cg-fila .cg-fx:hover{background:var(--sel)}
.cg-plus{min-width:34px;min-height:34px;border:0;background:transparent;cursor:pointer;font-size:1.2rem;font-weight:700;border-radius:8px}
.cg-plus:hover{background:var(--sel)}
.cg-bara{display:flex;gap:6px;align-items:center}
.cg-bara label{flex:1;min-width:0;display:flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:18px;background:var(--paper);padding:0 10px;min-height:36px}
.cg-bara label span{font-size:.8rem;color:var(--ink2);white-space:nowrap}
@media (max-width:760px),(pointer:coarse){.cg-bara label span{display:none}}
.cg-url{flex:1;min-width:0;border:0;background:transparent;color:var(--ink);font:inherit;font-size:.92rem;min-height:34px;outline:none}
.cg-enter{display:none;min-height:36px;min-width:44px;border:1px solid var(--line);border-radius:8px;background:var(--paper);cursor:pointer;font-weight:700}
@media (max-width:760px),(pointer:coarse){.cg-enter{display:inline-block}}
.cg-ecran{min-height:300px;padding:12px;position:relative}
.cg-info{margin:0 0 10px;padding:8px 10px;border-left:4px solid var(--accent);background:var(--paper2);border-radius:0 6px 6px 0;font-size:.88rem}
.cg-gol{display:grid;place-items:center;min-height:240px;color:var(--ink2);text-align:center;font-size:.92rem;padding:10px}
.cg-card{max-width:520px;margin:4px auto;border:1px solid var(--line);border-radius:22px;padding:18px 18px 16px;background:var(--paper)}
.cg-g{font-weight:700;font-size:1.05rem;letter-spacing:.02em;color:var(--ink2)}
.cg-card h3{margin:8px 0 2px;font-size:1.55rem;font-weight:500}
.cg-card .cg-sub0{margin:0 0 12px}
.cg-f{display:flex;flex-direction:column;gap:4px;margin:6px 0 2px}
.cg-f span{font-size:.82rem;color:var(--accent);font-weight:600}
.cg-f input{min-height:46px;padding:6px 12px;border:2px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-size:1rem;width:100%;box-sizing:border-box}
.cg-f input:focus{outline:none;border-color:var(--accent)}
.cg-err{min-height:1.2em;margin:4px 0;color:var(--bad);font-size:.88rem}
.cg-link{background:none;border:0;padding:6px 0;min-height:32px;color:var(--accent)!important;font-weight:600;cursor:pointer;text-align:left}
.cg-mic{font-size:.84rem;color:var(--ink2);margin:8px 0}
.cg-mic .cg-link{display:inline-block;min-height:32px;padding:6px 0}
.cg-btns{display:flex;justify-content:flex-end;align-items:center;gap:14px;flex-wrap:wrap;margin-top:10px}
.cg-prim{min-height:40px;padding:6px 22px;border:0;border-radius:20px;background:var(--accent);color:var(--accentInk)!important;font-weight:700;cursor:pointer}
.cg-prim:disabled{opacity:.55;cursor:not-allowed}
.cg-sec{min-height:40px;padding:6px 18px;border:1px solid var(--line);border-radius:20px;background:var(--paper);color:var(--accent)!important;font-weight:700;cursor:pointer}
.cg-chip{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:4px 12px;border:1px solid var(--line);border-radius:17px;background:var(--paper);cursor:pointer;font-size:.9rem;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.cg-nota{font-size:.82rem;color:var(--ink2);margin:2px 0 0}
.cg-app{border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--paper)}
.cg-sus{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid var(--line);background:var(--paper2)}
.cg-ic{min-width:40px;min-height:40px;border:0;border-radius:20px;background:transparent;cursor:pointer;font-size:1.1rem}
.cg-ic:hover{background:var(--sel)}
.cg-logo{font-size:1.1rem;font-weight:700;white-space:nowrap}
.cg-cauta{flex:1;min-width:0;min-height:36px;border-radius:18px;background:var(--paper);border:1px solid var(--line);display:flex;align-items:center;padding:0 12px;color:var(--ink2);font-size:.85rem;white-space:nowrap;overflow:hidden}
.cg-grila-b{flex:none;min-width:40px;min-height:40px;border:0;border-radius:20px;background:transparent;cursor:pointer;display:grid;place-items:center}
.cg-grila-b:hover,.cg-grila-b[aria-expanded="true"]{background:var(--sel)}
.cg-9{display:grid;grid-template-columns:repeat(3,5px);gap:3px}
.cg-9 i{width:5px;height:5px;border-radius:50%;background:var(--ink2);display:block}
.cg-profil{flex:none;width:40px;height:40px;border-radius:50%;border:2px solid var(--paper);outline:1px solid var(--line);background:var(--accent);color:var(--accentInk)!important;font-weight:800;cursor:pointer}
.cg-corp{display:grid;grid-template-columns:200px 1fr;min-height:280px}
.cg-meniu{display:flex;flex-direction:column;gap:2px;padding:8px 6px;border-right:1px solid var(--line);background:var(--paper2)}
.cg-meniu button{display:flex;align-items:center;gap:6px;min-height:36px;padding:4px 12px;border:0;border-radius:0 18px 18px 0;background:transparent;cursor:pointer;text-align:left;font-size:.92rem}
.cg-meniu button:hover{background:var(--sel)}
.cg-meniu button.on{background:var(--sel);font-weight:700}
.cg-meniu .cg-nou{border-radius:16px;margin:0 0 8px;min-height:44px;background:var(--paper);border:1px solid var(--line);font-weight:700;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.cg-main{padding:8px 10px;min-width:0}
.cg-titlu-lista{font-size:1.15rem;font-weight:600;margin:2px 0 8px}
.cg-cap{display:grid;grid-template-columns:1fr 130px 90px;gap:8px;padding:0 10px 4px;font-size:.8rem;color:var(--ink2);border-bottom:1px solid var(--line)}
.cg-rand{display:grid;grid-template-columns:1fr 130px 90px;gap:8px;width:100%;min-height:44px;padding:6px 10px;border:0;border-bottom:1px solid var(--line);background:transparent;cursor:pointer;text-align:left;align-items:center;font-size:.92rem}
.cg-rand:hover{background:var(--paper2)}
.cg-rand.sel{background:var(--sel)}
.cg-rand .n{display:flex;align-items:center;gap:8px;min-width:0}
.cg-rand .n span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cg-rand .p,.cg-rand .d{font-size:.84rem;color:var(--ink2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cg-tip{flex:none;display:inline-grid;place-items:center;width:22px;height:22px;border-radius:4px;color:#fff;font-size:.72rem;font-weight:800}
.cg-tip.cg-t-doc{background:#3B78E7}.cg-tip.cg-t-prez{background:#E8A600}.cg-tip.cg-t-foaie{background:#1E8E3E}
.cg-lgol{padding:16px 6px;color:var(--ink2)}
.cg-pop{position:absolute;z-index:6;border:1px solid var(--line);border-radius:10px;background:var(--paper);box-shadow:0 6px 24px rgba(0,0,0,.22);padding:6px}
.cg-nou-m{left:16px;top:118px;min-width:250px}
.cg-pop button{display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;min-height:38px;padding:4px 12px;border:0;border-radius:6px;background:transparent;cursor:pointer;text-align:left;font-size:.92rem}
.cg-pop button:hover{background:var(--sel)}
.cg-pop hr{border:0;border-top:1px solid var(--line);margin:4px 0}
.cg-sub{display:flex;gap:4px;align-items:stretch}
.cg-sub>button:first-child{flex:1}
.cg-sub .cg-sag{flex:none;width:44px;justify-content:center}
.cg-sub-m{margin:2px 0 4px 18px;border-left:2px solid var(--line);padding-left:6px}
.cg-grila{right:58px;top:100px;width:min(300px,calc(100% - 24px))}
.cg-grila .gr{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.cg-grila .gr button{flex-direction:column;justify-content:center;gap:4px;min-height:68px;text-align:center;font-size:.82rem}
.cg-grila .gr .cg-tip{width:28px;height:28px;font-size:.8rem}
.cg-tip.cg-t-drive{background:#0F9D58}.cg-tip.cg-t-mail{background:#C5221F}
.cg-pm{right:10px;top:100px;width:min(320px,calc(100% - 24px));text-align:center;padding:12px}
.cg-pm .av{width:56px;height:56px;margin:4px auto 6px;border-radius:50%;background:var(--accent);color:var(--accentInk);display:grid;place-items:center;font-size:1.5rem;font-weight:800}
.cg-pm .ad{font-size:.88rem;color:var(--ink2);margin-bottom:8px;word-break:break-all}
.cg-pm button{justify-content:center;border:1px solid var(--line);margin-top:6px}
.cg-doc{display:flex;flex-direction:column;min-height:330px}
.cg-doc-sus{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:6px 8px;border-bottom:1px solid var(--line);background:var(--paper2)}
.cg-doc-sus .cg-tip{width:28px;height:28px}
.cg-titlu{flex:1 1 180px;min-width:0;max-width:360px;min-height:36px;padding:2px 8px;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--ink);font:inherit;font-size:1.05rem}
.cg-titlu:hover{border-color:var(--line)}
.cg-titlu:focus{outline:none;border-color:var(--accent);background:var(--paper)}
.cg-stare{min-height:36px;min-width:40px;padding:0 8px;border:0;border-radius:18px;background:transparent;cursor:pointer;color:var(--ink2);font-size:.88rem;white-space:nowrap}
.cg-stare:hover{background:var(--sel)}
.cg-stare-wrap{position:relative;display:inline-flex;align-items:center;flex-wrap:wrap}
.cg-tooltip{pointer-events:none;align-self:center;margin-left:4px;padding:4px 10px;border-radius:6px;background:#3C4043;color:#fff;font-size:.82rem;white-space:nowrap}
.cg-doc-sus .cg-prim{white-space:nowrap}
.cg-drpt{margin-left:auto;display:flex;align-items:center;gap:8px}
.cg-unelte{display:flex;gap:4px;padding:4px 8px;border-bottom:1px solid var(--line);background:var(--paper)}
.cg-unelte button{min-width:40px;min-height:36px;border:0;border-radius:6px;background:transparent;cursor:pointer}
.cg-unelte button:hover{background:var(--sel)}
.cg-foaie-wrap{flex:1;background:var(--paper2);padding:14px 10px;display:flex;gap:10px;align-items:flex-start}
.cg-foaie{flex:1;max-width:620px;margin:0 auto;background:var(--paper);border:1px solid var(--line);box-shadow:0 1px 4px rgba(0,0,0,.12);min-height:220px;padding:18px 20px;box-sizing:border-box}
.cg-text{width:100%;min-height:190px;border:0;resize:vertical;background:transparent;color:var(--ink);font:inherit;font-size:1rem;line-height:1.5;outline:none;box-sizing:border-box}
.cg-text[readonly]{color:var(--ink2)}
.cg-lat{flex:0 0 200px;border:1px solid var(--line);border-radius:8px;background:var(--paper);padding:8px}
.cg-inchisa{display:grid;place-items:center;min-height:260px;text-align:center;padding:16px;color:var(--ink2)}
.cg-bula{position:absolute;right:10px;top:84px;z-index:8;width:min(330px,calc(100% - 20px));border:1px solid var(--line);border-radius:12px;background:var(--paper);box-shadow:0 6px 24px rgba(0,0,0,.22);padding:12px}
.cg-bula .s{display:flex;justify-content:space-between;align-items:center;gap:8px}
.cg-bula .d{margin:8px 0;font-size:.88rem;color:var(--ink2);word-break:break-all}
.cg-x{min-width:36px;min-height:36px;border:0;border-radius:18px;background:transparent;cursor:pointer;font-size:1rem}
.cg-x:hover{background:var(--sel)}
.cg-panou{position:absolute;inset:auto 10px 10px auto;z-index:7;width:min(420px,calc(100% - 20px));border:1px solid var(--line);border-radius:12px;background:var(--paper);box-shadow:0 6px 24px rgba(0,0,0,.22)}
.cg-panou .cap{display:flex;justify-content:space-between;align-items:center;padding:4px 4px 4px 12px;background:var(--paper2);border-bottom:1px solid var(--line);font-weight:700}
.cg-panou .c{padding:10px}
.cg-acasa-d{display:flex;gap:10px;flex-wrap:wrap;margin:4px 0 12px}
.cg-gol-b{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:110px;min-height:110px;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--paper);cursor:pointer}
.cg-gol-b .pg{width:58px;height:72px;border:1px solid var(--line);background:#fff;display:grid;place-items:center;font-size:1.6rem;color:#3B78E7}
.cg-ingust{display:none;margin:0;padding:4px 10px;font-size:.8rem;color:var(--ink2);background:var(--paper2)}
.cg-sarcina .cg-teste{margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--paper2)}
.cg-teste .lbl{font-size:.85rem;font-weight:700}
.cg-teste ol{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:4px}
.cg-teste li{display:flex;gap:8px;align-items:flex-start;font-size:.93rem;line-height:1.35}
.cg-teste li .s{flex:none;width:1.4em;text-align:center;font-weight:800}
.cg-teste li.ok .s{color:var(--ok)}.cg-teste li.rau .s{color:var(--bad)}
.cg-teste li .m{display:block;font-size:.86rem;color:var(--bad)}
.cg-reset{margin-top:10px;min-height:40px;padding:6px 12px;border:1px solid var(--accent);border-radius:8px;background:var(--paper);color:var(--accent)!important;font-weight:700;cursor:pointer}
@media (max-width:560px){
 .cg-ingust{display:block}
 .cg-cauta{display:none}
 .cg-corp{grid-template-columns:1fr}
 .cg-meniu{flex-direction:row;flex-wrap:wrap;border-right:0;border-bottom:1px solid var(--line)}
 .cg-meniu button{border-radius:18px;padding:4px 10px}
 .cg-meniu .cg-nou{margin:0}
 .cg-cap{display:none}
 .cg-rand{grid-template-columns:1fr auto}
 .cg-rand .p{display:none}
 .cg-card{padding:14px 12px;border-radius:14px}
 .cg-nou-m{left:8px;top:150px}
 .cg-grila{right:8px}
 .cg-lat{flex-basis:auto}
 .cg-foaie-wrap{flex-direction:column;align-items:stretch}
 .cg-foaie{padding:12px}
 .cg-titlu{flex:1 1 120px;font-size:1rem}
 .cg-doc-sus .cg-prim{padding:6px 12px;font-size:.85rem}
}
`;
function stil(){if(document.getElementById('cg-stil'))return;const s=document.createElement('style');s.id='cg-stil';s.textContent=CSS;document.head.appendChild(s)}
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const faraDiacritice=s=>String(s||'').normalize('NFKD').replace(/[̀-ͯ]/g,'');
const spatii=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();
const ATR='autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore data-form-type="other"';
const CAMP=(id,et,val,ph)=>`<label class="cg-f"><span>${et}</span><input type="text" id="${id}" value="${esc(val||'')}" placeholder="${esc(ph||'')}" ${ATR}></label>`;
const ATINGERE=()=>typeof window!=='undefined'&&(('ontouchstart' in window)||(window.matchMedia&&window.matchMedia('(pointer:coarse)').matches));
const randuri=t=>String(t||'').split('\n').map(x=>x.trim()).filter(Boolean).length;

/* ---------------- datele inventate ---------------- */
const DOM='scoala-exemplu.test';
const CONTURI={
  ana:{adresa:'ana.pop@'+DOM,nume:'Ana Pop',parola:'Brad5!Lac#Sanie'},
  radu:{adresa:'radu.ene@'+DOM,nume:'Radu Ene',parola:'Ploaie3#Zar!Cuib'},
  ioana:{adresa:'ioana.rusu@'+DOM,nume:'Ioana Rusu',parola:'Lalea7?Tren#Nor'}};
const FISIERE_ANA=[
  {id:'excursie',titlu:'Idei pentru excursia clasei',tip:'doc',loc:'meu',modificat:'12 ian.',text:'Unde mergem: la Cetatea Neamțului.\nCe luăm: apă, o gustare, pelerina.'},
  {id:'orar',titlu:'Orarul meu',tip:'foaie',loc:'meu',modificat:'9 ian.'},
  {id:'stiinte',titlu:'Proiect științe - echipa 2',tip:'prez',loc:'distribuite',modificat:'14 ian.',proprietar:{nume:'Radu Ene',adresa:'radu.ene@'+DOM}}];
const TIPURI_FISIER={
  doc:{gol:'Document fără titlu',app:'Documente Google',lit:'D',cale:'document'},
  prez:{gol:'Prezentare fără titlu',app:'Prezentări Google',lit:'P',cale:'presentation'},
  foaie:{gol:'Foaie de calcul fără titlu',app:'Foi de calcul Google',lit:'F',cale:'spreadsheets'}};
/* subtitlul paginii de conectare, după unde vrei să ajungi (pagina publică, 23.10.2026, _proba/_surse/app_*.txt) */
const TINTE={
  drive:{sub:'Accesează Google Drive',fila:'Google Drive: conectează-te'},
  docs:{sub:'Folosește Contul Google',fila:'Conectează-te – Conturi Google'},
  documente:{sub:'Accesează Documente Google',fila:'Documente Google: conectează-te'},
  slides:{sub:'Accesează Prezentări Google',fila:'Prezentări Google: conectează-te'},
  cont:{sub:'Folosește Contul Google',fila:'Conectează-te – Conturi Google'}};
/* meniul din stânga al Drive-ului (EN: ajutorul Google Drive; RO: NESIGUR, vezi lectii/vii/m3-l18/surse.md) */
const LISTE=[
  {id:'acasa',nume:'Acasă',en:'Home'},
  {id:'meu',nume:'Drive-ul meu',en:'My Drive'},
  {id:'distribuite',nume:'Distribuite cu mine',en:'Shared with me'},
  {id:'recente',nume:'Recente',en:'Recent'},
  {id:'cos',nume:'Coș de gunoi',en:'Trash'}];
const numeLista=(id,extra)=>((LISTE.concat(extra||[]).find(x=>x.id===id))||{}).nume||id;
const URL_LISTA={acasa:'drive.google.com/drive/home',meu:'drive.google.com/drive/my-drive',distribuite:'drive.google.com/drive/shared-with-me',recente:'drive.google.com/drive/recent',cos:'drive.google.com/drive/trash'};
const EXTENSII={};

/* ---------------- creeaza(): browserul simulat ---------------- */
function creeaza(root,O){
  stil();O=Object.assign({start:'fila',tinta:'drive',fereastra:'normala',intreabaParola:false,lista:'acasa'},O||{});
  const BR=(O.browser||'chrome')==='edge'?'edge':'chrome';
  const cont=O.cont||CONTURI.ana,conturi=(O.conturi||[]).concat([cont]);
  const ETP=O.etichetaPartajare||'Permite accesul';
  const asc={},J=[],sloturi={};let st,F,FA,adresaScrisa='',nrId=0,cronSalv={};
  const fisiereDin=l=>JSON.parse(JSON.stringify(l)).map(f=>Object.assign({text:'',loc:'meu',modificat:''},f));
  function nou0(){
    Object.keys(cronSalv).forEach(k=>clearTimeout(cronSalv[k]));cronSalv={};
    F=fisiereDin(O.fisiere||(cont===CONTURI.ana||cont.adresa===CONTURI.ana.adresa?FISIERE_ANA:[]));
    FA=fisiereDin(O.fisiereContDeschis||[]);
    const startApp=['drive','docs','doc'].indexOf(O.start)>=0;
    const altul=startApp&&O.contDeschis&&O.contDeschis.adresa!==cont.adresa?O.contDeschis:null;
    st={file:[],activ:null,conectat:startApp,adresa:startApp?(altul?altul.adresa:cont.adresa):'',altcuiva:!!altul,contAltcuiva:altul?{nume:altul.nume,adresa:altul.adresa}:null,
      iesit:false,fostConectat:startApp&&!altul,privata:O.fereastra==='privata',fereastraInchisa:false,
      err:'',info:'',greseliParola:0,bula:false,bulaVazuta:false,bulaInchisa:false,parolaSalvata:false,bulaRaspuns:'',
      grila:false,profil:false,nouMeniu:false,nouSub:false,panou:null,selectat:null,
      ajuns:{drive:false,docs:false,slides:false},dinGrila:[],creat:[],lucrate:[],inchise:[],regasite:[],deschise:[],vizitate:[],
      salv:{},vazutSalvat:{},tooltip:null,verificat:false,tinta:O.tinta};
    nrId=0;adresaScrisa='';
    const t=filaNouaObj();st.file.push(t);st.activ=t.id;
    if(O.start==='conectare')laConectare(t,O.tinta);
    else if(O.start==='drive'){t.ecran='drive';t.lista=O.lista||'acasa';t.url=URL_LISTA[t.lista]||URL_LISTA.acasa;st.vizitate.push(t.lista)}
    else if(O.start==='docs'){t.ecran='docs';t.url='docs.google.com/document/u/0/'}
    else if(O.start==='doc'){const f=gaseste(O.deschis)||toate()[0];
      /* cuDrive: întâi fila Drive-ului (lista `lista`, implicit Drive-ul meu), apoi fila documentului, activă */
      if(O.cuDrive){t.ecran='drive';t.lista=O.lista&&O.lista!=='acasa'?O.lista:'meu';t.url=URL_LISTA[t.lista];st.vizitate.push(t.lista);
        const d=filaNouaObj();st.file.push(d);st.activ=d.id}
      const td=activ();if(f){td.ecran='doc';td.doc=f.id;td.url=urlDoc(f);st.deschise.push(f.id);st.lucrate.push(f.id);st.salv[f.id]='gata'}}
  }
  /* fișierele contului deschis acum (contul altcuiva rămas deschis are fișierele lui) */
  const toate=()=>st&&st.altcuiva?FA:F;
  const gaseste=id=>toate().find(f=>f.id===id)||F.find(f=>f.id===id);
  const urlDoc=f=>`docs.google.com/${TIPURI_FISIER[f.tip]?TIPURI_FISIER[f.tip].cale:'document'}/d/${f.id}/edit`;
  function filaNouaObj(){nrId++;return {id:'f'+nrId,ecran:'gol',url:'',doc:null,lista:'acasa'}}
  const activ=()=>st.file.find(t=>t.id===st.activ)||st.file[0];
  function emite(nume,date){J.push({nume,date:date||{},t:Date.now()});(asc[nume]||[]).concat(asc['*']||[]).forEach(f=>{try{f(nume,date||{})}catch(e){}});
    if(O.laEveniment)try{O.laEveniment(nume,date||{})}catch(e){}}
  const contCurent=()=>st.altcuiva?st.contAltcuiva:cont;
  const ini=c=>(c.initiala||faraDiacritice(c.nume||c.adresa||'?').trim().charAt(0)||'?').toUpperCase();
  const prop=f=>f.proprietar&&f.proprietar.adresa!==(contCurent()||{}).adresa?f.proprietar.nume:'eu';

  /* --- titlul filei (ce scrie pe ea) --- */
  function titluFila(t){
    if(t.ecran==='gol')return 'Filă nouă';
    if(t.ecran==='conectare-adresa'||t.ecran==='conectare-parola')return (TINTE[t.tinta]||TINTE.drive).fila;
    if(t.ecran==='drive')return `${numeLista(t.lista,O.meniuStanga)} – Google Drive`;
    if(t.ecran==='docs')return 'Documente Google';
    if(t.ecran==='slides')return 'Prezentări Google';
    if(t.ecran==='cont')return 'Contul Google';
    if(t.ecran==='doc'){const f=gaseste(t.doc);return f?`${f.titlu} – ${(TIPURI_FISIER[f.tip]||TIPURI_FISIER.doc).app}`:'Documente Google'}
    return 'Filă nouă'}

  /* --- ecranele --- */
  function hFereastra(){
    if(st.fereastraInchisa)return `<div class="cg-inchisa"><div><b>Fereastra privată s-a închis.</b><br>Tot ce era în ea s-a șters: filele, istoricul, iar contul nu mai e deschis.<br>Fereastra lecției a rămas.</div></div>`;
    const a=activ();
    const priv=st.privata?`<div class="cg-priv"><span><b>Fereastră privată</b> (în Chrome: incognito · în Edge: InPrivate)</span><button type="button" class="cg-x" data-a="inchide-fereastra" aria-label="Închide fereastra privată (✕)" title="Închide fereastra privată">✕</button></div>`:'';
    const file=st.file.map(t=>`<span class="cg-fila${t.id===a.id?' on':''}" data-fila="${t.id}" role="button" tabindex="0" title="${esc(titluFila(t))}"><span class="t">${esc(titluFila(t))}</span>${st.file.length>1?`<button type="button" class="cg-fx" data-inchide="${t.id}" aria-label="Închide fila (×): ${esc(titluFila(t))}" title="Închide fila">×</button>`:''}</span>`).join('');
    return `${priv}<div class="cg-br"><div class="cg-file">${file}<button type="button" class="cg-plus" data-a="fila-noua" aria-label="Filă nouă (+)" title="Filă nouă">+</button></div>
     <div class="cg-bara"><label><span>Bara de adrese</span><input type="text" class="cg-url" aria-label="Bara de adrese" value="${esc(a.url)}" placeholder="Caută sau scrie o adresă" ${ATR}></label><button type="button" class="cg-enter" data-a="enter" aria-label="Enter (ca tasta Enter)">Enter ↵</button></div></div>
     <div class="cg-ecran">${st.info?`<p class="cg-info" aria-live="polite">${st.info}</p>`:''}${hEcran(a)}</div>${hBula()}${hPanou()}`}
  function hEcran(t){
    if(t.ecran==='gol')return `<div class="cg-gol"><div><b>Filă nouă</b><br>Scrie sus, în bara de adrese, adresa aplicației și apasă <kbd>Enter</kbd>${ATINGERE()?' (pe telefon: butonul <b>Enter ↵</b> de lângă bară)':''}.</div></div>`;
    if(t.ecran==='conectare-adresa')return hAdresa(t);
    if(t.ecran==='conectare-parola')return hParola();
    if(t.ecran==='drive')return hDrive(t);
    if(t.ecran==='docs')return hDocs();
    if(t.ecran==='slides')return hSlides();
    if(t.ecran==='cont')return `<div class="cg-card"><div class="cg-g">Google</div><h3>Contul Google</h3><p class="cg-sub0">${esc(contCurent().nume)}</p><p>Aici e pagina Contului Google, nu Drive-ul. Ca să ajungi la fișiere, scrie sus, în bara de adrese, <b>drive.google.com</b> și apasă <kbd>Enter</kbd>.</p></div>`;
    if(t.ecran==='doc')return hDoc(t);
    return ''}
  function hAdresa(t){
    /* rândul „Nu e computerul tău?” depinde de browser (pagina publică: VI/13, 12.10.2026; VII/18, 23.10.2026) */
    const strain=BR==='edge'?'Nu este computerul tău? Pentru a te conecta, folosește o fereastră de navigare privată.'
      :'Nu e computerul tău? Pentru a te conecta privat, folosește modul pentru invitați.';
    return `<div class="cg-card"><div class="cg-g">Google</div><h3>Conectează-te</h3><p class="cg-sub0">${esc((TINTE[t.tinta]||TINTE.drive).sub)}</p>
     ${CAMP('cg-in-adr','Adresa de e-mail sau numărul de telefon',adresaScrisa,'')}
     <p class="cg-err" aria-live="polite">${esc(st.err)}</p>
     <button type="button" class="cg-link" data-a="uitat-adresa">Ai uitat adresa de e-mail?</button>
     <p class="cg-mic">${strain} <button type="button" class="cg-link" data-a="invitat">Află mai multe despre folosirea modului pentru invitați</button></p>
     <div class="cg-btns"><button type="button" class="cg-link" data-a="creeaza">Creează un cont</button><button type="button" class="cg-prim" data-a="inainte">Înainte</button></div></div>`}
  function hParola(){
    return `<div class="cg-card"><div class="cg-g">Google</div><h3>${esc((conturi.find(c=>c.adresa===st.adresaPas)||{}).nume||'')}</h3>
     <p class="cg-sub0"><button type="button" class="cg-chip" data-a="alta-adresa" title="Ai greșit adresa? Apasă aici și o scrii din nou.">${esc(st.adresaPas)} ▾</button></p>
     ${CAMP('cg-in-par','Introdu parola','','')}
     <p class="cg-nota">Aici parola inventată se vede. Pe pagina adevărată, în loc de litere apar puncte.</p>
     <p class="cg-err" aria-live="polite">${esc(st.err)}</p>
     <div class="cg-btns"><button type="button" class="cg-link" data-a="uitat-parola">Ai uitat parola?</button><button type="button" class="cg-prim" data-a="inainte-parola">Înainte</button></div></div>`}
  function hSus(titlu,tip,cauta){
    return `<div class="cg-sus"><span class="cg-tip cg-t-${tip}" aria-hidden="true">${tip==='drive'?'▲':tip==='prez'?'P':'D'}</span><span class="cg-logo">${titlu}</span>
      <span class="cg-cauta" aria-hidden="true">${cauta} (nu o folosim azi)</span>
      <button type="button" class="cg-grila-b" data-a="grila" aria-label="Aplicații Google (grila de aplicații)" title="Aplicații Google" aria-expanded="${st.grila}"><span class="cg-9" aria-hidden="true">${'<i></i>'.repeat(9)}</span></button>
      <button type="button" class="cg-profil" data-a="profil" aria-label="Profil" title="Profil" aria-expanded="${st.profil}">${esc(ini(contCurent()))}</button></div>`}
  function hRand(f){
    const T=TIPURI_FISIER[f.tip]||TIPURI_FISIER.doc;
    const unClic=ATINGERE()||activ().ecran!=='drive';
    return `<button type="button" class="cg-rand${st.selectat===f.id?' sel':''}" data-f="${esc(f.id)}" title="${unClic?(ATINGERE()?'Atinge ca să-l deschizi':'Clic ca să-l deschizi'):'Dublu clic ca să-l deschizi'}"><span class="n"><span class="cg-tip cg-t-${f.tip}" aria-hidden="true">${T.lit}</span><span>${esc(f.titlu)}</span></span><span class="p">${esc(prop(f))}</span><span class="d">${esc(f.modificat||'')}</span></button>`}
  function listaFisiere(id){
    const L=toate();
    if(id==='meu')return L.filter(f=>f.loc==='meu');
    if(id==='distribuite')return L.filter(f=>f.loc==='distribuite');
    if(id==='cos')return L.filter(f=>f.loc==='cos');
    if(id==='recente')return L.filter(f=>f.loc!=='cos'&&(f.recent||st.deschise.indexOf(f.id)>=0||st.creat.indexOf(f.id)>=0));
    if(id==='acasa')return L.filter(f=>f.loc!=='cos');
    const ex=(O.meniuStanga||[]).find(x=>x.id===id);return ex&&ex.fisiere?ex.fisiere(inst):[]}
  function hDrive(t){
    const ex=O.meniuStanga||[];
    const rand=x=>`<button type="button" data-lista="${esc(x.id)}" class="${t.lista===x.id?'on':''}" title="${esc(x.en||x.nume)}">${esc(x.nume)}</button>`;
    const L=listaFisiere(t.lista);
    const titlu=t.lista==='acasa'?'Bun venit în Drive':numeLista(t.lista,ex);
    const gol=t.lista==='cos'?'Coșul de gunoi e gol.':t.lista==='distribuite'?'Nu ți-a trimis nimeni niciun fișier încă. Aici apar documentele colegilor (în lecția 19).':'Nu există fișiere aici.';
    const slot=hSlot('drive-sus',null);
    return `<div class="cg-app">${hSus('Drive','drive','Caută în Drive')}
     <p class="cg-ingust">Pe ecranul îngust, meniul din stânga al Drive-ului apare aici, deasupra listei.</p>
     <div class="cg-corp"><nav class="cg-meniu" aria-label="Meniul Drive"><button type="button" class="cg-nou" data-a="nou" aria-expanded="${st.nouMeniu}">＋ Nou</button>${LISTE.slice(0,4).map(rand).join('')}${ex.map(rand).join('')}${rand(LISTE[4])}</nav>
      <div class="cg-main">${slot}<div class="cg-titlu-lista">${esc(titlu)}</div>${t.lista==='acasa'?'<p class="cg-nota">Fișiere sugerate (cele deschise sau schimbate de curând):</p>':''}
       ${L.length?`<div class="cg-cap" aria-hidden="true"><span>Nume</span><span>Proprietar</span><span>Modificat</span></div>${L.map(hRand).join('')}`:`<div class="cg-lgol">${gol}</div>`}
       ${L.length?`<p class="cg-nota">${ATINGERE()?'Pe telefon atingi fișierul ca să-l deschizi. În Drive-ul adevărat, pe calculator: dublu clic.':'Un clic alege fișierul; dublu clic îl deschide.'}</p>`:''}</div></div></div>
     ${st.nouMeniu?hNou():''}${st.grila?hGrila():''}${st.profil?hProfil():''}`}
  function hNou(){
    return `<div class="cg-pop cg-nou-m" role="menu" aria-label="Nou">
      <button type="button" data-a="nou-dosar">Dosar nou</button><hr><button type="button" data-a="nou-incarca">Încărcare fișier</button><button type="button" data-a="nou-incarca">Încărcare dosar</button><hr>
      <div class="cg-sub"><button type="button" data-nou="doc"><span><span class="cg-tip cg-t-doc" aria-hidden="true">D</span> Documente Google</span></button><button type="button" class="cg-sag" data-a="nou-sub" aria-label="Mai multe variante pentru Documente Google" aria-expanded="${st.nouSub}">▸</button></div>
      ${st.nouSub?`<div class="cg-sub-m"><button type="button" data-nou="doc">Document gol</button><button type="button" data-a="sablon">Dintr-un șablon</button></div>`:''}
      <button type="button" data-nou="foaie"><span><span class="cg-tip cg-t-foaie" aria-hidden="true">F</span> Foi de calcul Google</span></button>
      <button type="button" data-nou="prez"><span><span class="cg-tip cg-t-prez" aria-hidden="true">P</span> Prezentări Google</span></button>
      <button type="button" data-a="nou-x">Închide meniul</button></div>`}
  function hGrila(){
    const app=(id,lit,cls,nume)=>`<button type="button" data-app="${id}"><span class="cg-tip cg-t-${cls}" aria-hidden="true">${lit}</span>${nume}</button>`;
    return `<div class="cg-pop cg-grila" role="dialog" aria-label="Aplicații Google"><div class="gr">${app('drive','▲','drive','Drive')}${app('docs','D','doc','Documente')}${app('slides','P','prez','Prezentări')}${app('foaie','F','foaie','Foi de calcul')}${app('gmail','M','mail','Gmail')}</div>
      <p class="cg-nota">Desen: pe ecranul adevărat sunt mai multe aplicații, cu pictogramele lor.</p><button type="button" data-a="grila-x">Închide</button></div>`}
  function hProfil(){
    const c=contCurent();
    return `<div class="cg-pop cg-pm" role="dialog" aria-label="Profil"><div class="av">${esc(ini(c))}</div><b>${esc(c.nume)}</b><div class="ad">${esc(c.adresa)}</div>
      <button type="button" data-a="gestioneaza">Gestionează Contul Google</button><button type="button" data-a="deconecteaza">Deconectează-te</button><button type="button" data-a="profil-x">Închide</button></div>`}
  function hDocs(){
    const L=toate().filter(f=>f.tip==='doc'&&f.loc!=='cos');
    return `<div class="cg-app">${hSus('Documente','doc','Caută')}<div class="cg-main">
      <div class="cg-titlu-lista">Începe un document nou</div>
      <div class="cg-acasa-d"><button type="button" class="cg-gol-b" data-nou="doc" aria-label="Gol (document nou, gol)"><span class="pg" aria-hidden="true">+</span>Gol</button></div>
      <div class="cg-titlu-lista">Documente recente</div>${L.length?L.map(hRand).join(''):'<div class="cg-lgol">Nu ai încă documente.</div>'}</div></div>
      ${st.grila?hGrila():''}${st.profil?hProfil():''}`}
  function hSlides(){
    const L=toate().filter(f=>f.tip==='prez'&&f.loc!=='cos');
    return `<div class="cg-app">${hSus('Prezentări','prez','Caută')}<div class="cg-main">
      <div class="cg-titlu-lista">Prezentările tale</div>${L.length?L.map(hRand).join(''):'<div class="cg-lgol">Nu ai încă prezentări.</div>'}
      <p class="cg-nota">O prezentare nouă faci tot din Drive: Nou → Prezentări Google. Cum lucrezi la ea cu colegii afli în lecția 19.</p></div></div>
      ${st.grila?hGrila():''}${st.profil?hProfil():''}`}
  function hSlot(nume,f){const fn=sloturi[nume];if(!fn||!fn.length)return '';
    return fn.map((g,i)=>{try{const r=g(f,inst.stare());if(r==null)return '';if(typeof r==='string')return `<div class="cg-slot" data-slot="${nume}">${r}</div>`;return `<div class="cg-slot" data-slot="${nume}" data-slot-el="${i}"></div>`}catch(e){return ''}}).join('')}
  function hDoc(t){
    const f=gaseste(t.doc);if(!f)return '<div class="cg-lgol">Documentul nu mai există.</div>';
    const T=TIPURI_FISIER[f.tip]||TIPURI_FISIER.doc;
    const alAltuia=f.proprietar&&f.proprietar.adresa!==contCurent().adresa;
    const s=st.salv[f.id];
    const stare=s==='se-salveaza'?`<span class="cg-stare" aria-live="polite">Se salvează…</span>`
      :`<span class="cg-stare-wrap"><button type="button" class="cg-stare" data-a="stare" aria-label="Starea documentului (norul cu bifă)" title="Salvat în Drive">☁✓</button>${st.tooltip===f.id?`<span class="cg-tooltip" role="status">Salvat în Drive</span>`:''}</span>`;
    const part=O.partajare?`<button type="button" class="cg-prim" data-a="partajare">${esc(ETP)}</button>`
      :`<button type="button" class="cg-prim" data-a="partajare" disabled title="Butonul acesta îl folosești în lecția 19">${esc(ETP)}</button>`;
    const extra=(O.butoaneDoc||[]).map(b=>`<button type="button" class="cg-sec" data-act="${esc(b.id)}" title="${esc(b.titlu||b.text)}">${esc(b.text)}</button>`).join('');
    const pagina=sloturi['doc-pagina']&&sloturi['doc-pagina'].length?hSlot('doc-pagina',f)
      :f.tip==='doc'?`<div class="cg-foaie"><textarea class="cg-text" aria-label="Textul documentului" ${ATR} ${alAltuia?'readonly':''} placeholder="Scrie aici…">${esc(f.text)}</textarea></div>`
      :`<div class="cg-foaie"><p class="cg-nota">${f.tip==='prez'?'O prezentare':'O foaie de calcul'} Google. Azi lucrăm doar cu documente; ${f.tip==='prez'?'prezentările le faci împreună cu colegii în lecția 19':'foile de calcul nu le folosim în lecțiile acestea'}.</p></div>`;
    const lat=hSlot('doc-lateral',f);
    return `<div class="cg-app cg-doc"><div class="cg-doc-sus"><span class="cg-tip cg-t-${f.tip}" aria-hidden="true">${T.lit}</span>
      <input type="text" class="cg-titlu" aria-label="Numele documentului (apasă ca să-l schimbi)" value="${esc(f.titlu)}" ${ATR} ${alAltuia?'readonly':''}>
      ${stare}<span class="cg-drpt">${hSlot('doc-bara',f)}${extra}${part}<button type="button" class="cg-grila-b" data-a="grila" aria-label="Aplicații Google (grila de aplicații)" title="Aplicații Google" aria-expanded="${st.grila}"><span class="cg-9" aria-hidden="true">${'<i></i>'.repeat(9)}</span></button><button type="button" class="cg-profil" data-a="profil" aria-label="Profil" title="Profil" aria-expanded="${st.profil}">${esc(ini(contCurent()))}</button></span></div>
      <div class="cg-unelte"><button type="button" data-a="anuleaza" aria-label="Anulează" title="Anulează">↶</button><button type="button" data-a="repeta" aria-label="Repetă" title="Repetă">↷</button></div>
      ${alAltuia?`<p class="cg-nota" style="padding:4px 10px">Documentul e al lui ${esc(f.proprietar.nume)}. Ce poți face într-un document primit de la un coleg afli în lecția 19.</p>`:''}
      <div class="cg-foaie-wrap">${pagina}${lat?`<aside class="cg-lat">${lat}</aside>`:''}</div></div>
      ${st.grila?hGrila():''}${st.profil?hProfil():''}`}
  /* întrebarea browserului: desen APROXIMATIV (ca în posta-gmail.js; cuvintele exacte nu sunt în ajutor) */
  function hBula(){
    if(!st.bula)return '';
    const B=BR==='edge'?{t:'Salvați parola?',s:'Salvare',r:'Nu acum',n:'Edge'}:{t:'Salvezi parola?',s:'Salvează',r:'Niciodată',n:'Chrome'};
    return `<div class="cg-bula" role="dialog" aria-label="Întrebarea browserului"><div class="s"><b>${B.t}</b><button type="button" class="cg-x" data-a="bula-x" aria-label="Închide (✕)" title="Închide">✕</button></div>
     <div class="d">${esc(st.adresa)} · ••••••••••</div><div class="cg-btns"><button type="button" class="cg-sec" data-a="bula-refuza">${B.r}</button><button type="button" class="cg-prim" data-a="bula-salveaza">${B.s}</button></div>
     <p class="cg-mic">Întrebarea vine de la browser, nu de la Google Drive. Desen aproximativ după ${B.n}: pe calculatorul tău cuvintele pot fi altele${st.privata?', iar în fereastra privată întrebarea poate să nu apară deloc':''}. Orice buton care nu salvează e bun.</p></div>`}
  function hPanou(){if(!st.panou)return '';
    return `<div class="cg-panou" role="dialog" aria-label="${esc(st.panou.titlu||'Fereastră')}"><div class="cap"><span>${esc(st.panou.titlu||'')}</span><button type="button" class="cg-x" data-a="panou-x" aria-label="Închide">✕</button></div><div class="c" id="cg-panou-c"></div></div>`}

  function deseneaza(focus){
    root.innerHTML=`<div class="cg">${hFereastra()}</div>`;
    if(st.panou){const c=root.querySelector('#cg-panou-c');if(c){if(typeof st.panou.continut==='string')c.innerHTML=st.panou.continut;else if(st.panou.continut)c.appendChild(st.panou.continut)}}
    root.querySelectorAll('[data-slot-el]').forEach(el=>{const fn=sloturi[el.dataset.slot][+el.dataset.slotEl];const a=activ();try{const r=fn(a&&a.doc?gaseste(a.doc):null,inst.stare());if(r&&r.nodeType)el.appendChild(r)}catch(e){}});
    leaga();emite('desenat');emite('schimbare');
    const f=focus&&root.querySelector(focus);if(f)f.focus({preventScroll:true})}

  /* --- acțiunile --- */
  function laConectare(t,tinta){t.ecran='conectare-adresa';t.tinta=tinta||'drive';t.url='accounts.google.com/v3/signin/identifier';st.err='';st.tinta=t.tinta}
  function laDestinatie(t,tinta){
    if(tinta==='docs'||tinta==='documente'){t.ecran='docs';t.url='docs.google.com/document/u/0/'}
    else if(tinta==='slides'){t.ecran='slides';t.url='docs.google.com/presentation/u/0/'}
    else if(tinta==='cont'){t.ecran='cont';t.url='myaccount.google.com'}
    else{t.ecran='drive';t.lista='acasa';t.url=URL_LISTA.acasa;if(st.vizitate.indexOf('acasa')<0)st.vizitate.push('acasa')}}
  const R_DRIVE=/^(https?:\/\/)?drive\.google\.com(\/.*)?$/i,R_DOCS=/^(https?:\/\/)?docs\.google\.com\/?$/i,R_DOCUMENT=/^(https?:\/\/)?docs\.google\.com\/document(\/.*)?$/i,
    R_SLIDES=/^(https?:\/\/)?docs\.google\.com\/presentation(\/.*)?$/i,R_CONT=/^(https?:\/\/)?(accounts|myaccount)\.google\.com(\/.*)?$/i;
  /* aproape bine (o literă lipsă / în plus, alt domeniu): adresa NU e cea scrisă de profesor */
  function aproape(t){const s=t.toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
    return /dr[i1]ve|d[o0]cs|g[o0]+g?le|go{1,3}gle|acc?ou?nts/.test(s)&&!/^(drive|docs|accounts|myaccount)\.google\.com$/.test(s)}
  function mergiLa(text){
    const t=String(text||'').trim(),a=activ();st.info='';st.grila=false;st.profil=false;st.nouMeniu=false;
    let tinta=null;
    if(R_DRIVE.test(t))tinta='drive';else if(R_DOCS.test(t))tinta='docs';else if(R_DOCUMENT.test(t))tinta='documente';else if(R_SLIDES.test(t))tinta='slides';else if(R_CONT.test(t))tinta='cont';
    if(tinta){
      if(tinta==='drive'||tinta==='docs'||tinta==='documente'||tinta==='slides')st.ajuns[tinta==='documente'?'docs':tinta]=true;
      if(st.conectat)laDestinatie(a,tinta);
      else{laConectare(a,tinta);if(st.iesit&&(tinta==='drive'||tinta==='docs'||tinta==='documente')){st.verificat=true;st.info='Verificat: contul nu mai e deschis, iar aplicația îți cere din nou conectarea. Așa trebuie să arate după ce te-ai deconectat. (Pe calculatorul adevărat poate apărea întâi o listă cu contul tău, arătat ca deconectat.)';emite('verificat')}}
      if(tinta==='cont')st.info='Ai deschis pagina <b>Contului Google</b>, nu Drive-ul. Pentru fișiere scrie în bara de adrese <b>drive.google.com</b>.';
      emite('bara',{text:t,ok:tinta!=='cont',tinta});deseneaza(a.ecran==='conectare-adresa'?'#cg-in-adr':null);return tinta!=='cont'}
    st.info=!t?'Bara de adrese e goală: scrie <b>drive.google.com</b>.'
      :/^(https?:\/\/)?(www\.)?google\.(com|ro)\/?$/i.test(t)?'Ai scris adresa paginii de căutare Google, nu a Drive-ului. Un browser adevărat ar deschide căutarea. Pentru fișierele tale scrie <b>drive.google.com</b>.'
      :aproape(t)?`Adresa „${esc(t)}” nu e scrisă exact. Un browser adevărat ar deschide alt site sau o pagină de eroare. Verific-o semn cu semn cu adresa scrisă de profesor: <b>drive.google.com</b>.`
      :`Un browser adevărat ar căuta „${esc(t)}” pe internet sau ar deschide alt site. Aici merg adresele <b>drive.google.com</b> și <b>docs.google.com</b>.`;
    emite('bara',{text:t,ok:false});deseneaza('.cg-url');return false}
  function trimiteAdresa(text){
    const t=String(text==null?'':text).trim();adresaScrisa=String(text==null?'':text);
    let ok=false,motiv='';
    if(!t)motiv='Scrie întâi adresa de e-mail.';
    else{const c=conturi.find(x=>x.adresa.toLowerCase()===t.toLowerCase());
      if(c){ok=true;st.adresaPas=c.adresa}
      else motiv=!t.includes('@')?'Nu găsim contul. Scrie adresa întreagă: înainte de @, @ și domeniul școlii.'
        :/\s/.test(t)?'Nu găsim contul: adresa are un spațiu. Adresa nu are spații.':faraDiacritice(t)!==t?'Nu găsim contul: adresa are diacritice. Adresa nu are diacritice.'
        :'Nu găsim contul cu această adresă. Verific-o semn cu semn, cu adresa din exercițiu.'}
    st.err=ok?'':motiv;emite('conectare-adresa',{text:t,ok,motiv});
    const a=activ();if(ok){a.ecran='conectare-parola';a.url='accounts.google.com/v3/signin/challenge/pwd';st.info=''}
    deseneaza(ok?'#cg-in-par':'#cg-in-adr');return ok}
  function trimiteParola(p){
    const c=conturi.find(x=>x.adresa===st.adresaPas),ok=!!c&&String(p||'')===c.parola,a=activ();
    if(!ok&&String(p||''))st.greseliParola++;
    /* textele sunt ale simulatorului, nu ale Google (pe pagina adevărată sunt alte cuvinte; surse.md) */
    st.err=ok?'':String(p||'')?'Parolă greșită. Mai scrie-o o dată, atent la literele mari și mici, la cifre și la semne.':'Scrie întâi parola.';
    if(!ok&&st.greseliParola>=2)st.info='A doua oară tot greșit. Aici copiază parola din exercițiu, semn cu semn. Pe calculatorul adevărat nu ghicești parole la nesfârșit: îi spui profesorului, iar el sau administratorul conturilor școlii îți dă o parolă nouă.';
    emite('conectare-parola',{ok,greseli:st.greseliParola});
    if(ok){st.conectat=true;st.iesit=false;st.fostConectat=true;st.altcuiva=false;st.contAltcuiva=null;st.adresa=c.adresa;st.info='';st.verificat=false;
      laDestinatie(a,a.tinta);if(O.intreabaParola){st.bula=true;st.bulaVazuta=true}
      emite('conectat',{adresa:c.adresa})}
    deseneaza(ok?(st.bula?'[data-a="bula-x"]':null):'#cg-in-par');return ok}
  function raspundeBula(r){if(!st.bula)return;st.bula=false;
    if(r==='salveaza'){st.parolaSalvata=true;st.bulaRaspuns='salveaza';const b=BR==='edge'?'Salvare':'Salvează';
      st.info='Ai apăsat <b>'+b+'</b>: pe un calculator adevărat, parola ar fi rămas în browserul calculatorului comun și următorul elev ar putea intra în contul tău. Ce faci atunci: te deconectezi oricum și îi spui profesorului înainte să pleci, ca el să șteargă parola din browser. (Aici nu s-a salvat nimic.)'}
    else{st.bulaInchisa=true;st.bulaRaspuns=r==='refuza'?'refuza':r==='alaturi'?'alaturi':'inchide';
      if(r==='alaturi')st.info='Ai apăsat alături, iar întrebarea browserului s-a închis: parola nu s-a salvat. Data viitoare apasă ✕ sau butonul care nu salvează, ca să fii sigur.'}
    emite('bula',{raspuns:st.bulaRaspuns||r});deseneaza()}
  function grila(v){st.grila=v==null?!st.grila:!!v;st.profil=false;st.nouMeniu=false;emite('grila',{deschis:st.grila});deseneaza(st.grila?'[data-app="docs"]':'[data-a="grila"]')}
  function alegeAplicatie(id){
    if(!st.conectat)return false;st.grila=false;
    if(id==='gmail'||id==='foaie'){st.info=id==='gmail'?'Gmail-ul nu-l folosim în lecția aceasta. Alege Drive sau Documente.':'Foile de calcul nu le folosim în lecțiile acestea. Alege Drive sau Documente.';deseneaza('[data-a="grila"]');return false}
    const t=filaNouaObj();st.file.push(t);st.activ=t.id;laDestinatie(t,id==='docs'?'docs':id);
    if(st.dinGrila.indexOf(id)<0)st.dinGrila.push(id);
    st.info='Aplicația s-a deschis într-o filă nouă. Fila de dinainte a rămas, alături.';
    emite('aplicatie',{id});emite('fila-noua',{id:t.id});deseneaza();return true}
  function meniuNou(v){st.nouMeniu=v==null?!st.nouMeniu:!!v;if(!st.nouMeniu)st.nouSub=false;st.grila=false;st.profil=false;emite('nou',{deschis:st.nouMeniu});deseneaza(st.nouMeniu?'[data-nou="doc"]':'[data-a="nou"]')}
  function creeazaDocument(tip){
    tip=TIPURI_FISIER[tip]?tip:'doc';if(!st.conectat)return null;
    let a=activ();if(a.ecran!=='drive'&&a.ecran!=='docs'){const d=st.file.find(x=>x.ecran==='drive'||x.ecran==='docs');if(d){st.activ=d.id;a=d}else{laDestinatie(a,'drive')}}
    nrId++;const id='nou'+nrId;
    const f={id,titlu:TIPURI_FISIER[tip].gol,tip,text:'',loc:'meu',modificat:'acum',proprietar:null,recent:true};
    toate().unshift(f);st.creat.push(id);st.lucrate.push(id);st.deschise.push(id);st.salv[id]='gata';st.nouMeniu=false;st.nouSub=false;
    if(a.ecran==='drive'){const t=filaNouaObj();t.ecran='doc';t.doc=id;t.url=urlDoc(f);st.file.push(t);st.activ=t.id;emite('fila-noua',{id:t.id});
      st.info=`${TIPURI_FISIER[tip].app.replace(' Google','')}: ${tip==='prez'?'prezentarea nouă s-a deschis':tip==='foaie'?'foaia nouă s-a deschis':'documentul nou s-a deschis'} într-o filă nouă. Drive-ul a rămas în fila de alături.`}
    else{a.ecran='doc';a.doc=id;a.url=urlDoc(f);st.info=''}
    emite('creat',{id,tip});deseneaza(tip==='doc'?'.cg-text':null);return id}
  function schimbat(id,motiv){
    st.salv[id]='se-salveaza';st.vazutSalvat[id]=false;st.tooltip=null;
    const el=root.querySelector('.cg-doc-sus .cg-stare-wrap, .cg-doc-sus .cg-stare');if(el)el.outerHTML='<span class="cg-stare" aria-live="polite">Se salvează…</span>';
    clearTimeout(cronSalv[id]);cronSalv[id]=setTimeout(()=>{st.salv[id]='gata';emite('salvare',{id,stare:'gata'});
      const a=activ();if(a&&a.doc===id){const e=root.querySelector('.cg-doc-sus .cg-stare');if(e&&!e.closest('.cg-stare-wrap')){const w=document.createElement('span');w.className='cg-stare-wrap';
        w.innerHTML='<button type="button" class="cg-stare" data-a="stare" aria-label="Starea documentului (norul cu bifă)" title="Salvat în Drive">☁✓</button>';e.replaceWith(w);legaStare(w)}}
      emite('schimbare')},900);
    emite('salvare',{id,stare:'se-salveaza',motiv});emite('schimbare')}
  /* numele nou: cu Enter (sau prin API) se redesenează; la ieșirea din casetă (clic în pagină) NU, ca să nu se piardă clicul */
  function redenumeste(titlu,faraDesen){const a=activ(),f=a&&a.doc&&gaseste(a.doc);if(!f)return false;
    const t=spatii(titlu)||TIPURI_FISIER[f.tip].gol;if(t===f.titlu){if(!faraDesen)deseneaza();return true}f.titlu=t;f.modificat='acum';
    schimbat(f.id,'titlu');emite('titlu',{id:f.id,titlu:t});
    if(faraDesen){const ti=root.querySelector('.cg-titlu');if(ti)ti.value=t;const fl=root.querySelector(`[data-fila="${a.id}"]`);if(fl){fl.title=titluFila(a);const sp=fl.querySelector('.t');if(sp)sp.textContent=titluFila(a)}}
    else{clearTimeout(cronSalv[f.id]);st.salv[f.id]='gata';deseneaza()}
    return true}
  function scrie(text){const a=activ(),f=a&&a.doc&&gaseste(a.doc);if(!f||f.tip!=='doc')return false;
    f.text=String(text==null?'':text);f.modificat='acum';schimbat(f.id,'text');clearTimeout(cronSalv[f.id]);st.salv[f.id]='gata';
    emite('scris',{id:f.id,randuri:randuri(f.text)});deseneaza();return true}
  function verificaSalvarea(){const a=activ();if(!a||!a.doc)return false;if(st.salv[a.doc]!=='gata')return false;
    st.tooltip=a.doc;st.vazutSalvat[a.doc]=true;emite('salvat-vazut',{id:a.doc});deseneaza();return true}
  function filaNoua(){const t=filaNouaObj();st.file.push(t);st.activ=t.id;st.grila=false;st.profil=false;st.nouMeniu=false;st.info='';emite('fila-noua',{id:t.id});deseneaza('.cg-url');return t.id}
  function comutaFila(id){if(!st.file.some(t=>t.id===id))return false;st.activ=id;st.grila=false;st.profil=false;st.nouMeniu=false;st.tooltip=null;st.info='';emite('fila',{id});deseneaza();return true}
  function inchideFila(id){
    id=id||st.activ;if(st.file.length<2)return false;const i=st.file.findIndex(t=>t.id===id);if(i<0)return false;
    const t=st.file[i];st.file.splice(i,1);
    if(t.doc&&st.inchise.indexOf(t.doc)<0)st.inchise.push(t.doc);
    if(st.activ===id)st.activ=(st.file[Math.max(0,i-1)]||st.file[0]).id;
    st.grila=false;st.profil=false;st.tooltip=null;
    st.info=t.doc?'Ai închis fila documentului. Documentul n-a dispărut: e salvat în Drive.':'';
    emite('fila-inchisa',{id,doc:t.doc});deseneaza();return true}
  function arataLista(id){const a=activ();if(!st.conectat||a.ecran!=='drive')return false;a.lista=id;a.url=URL_LISTA[id]||('drive.google.com/drive/'+id);st.selectat=null;st.nouMeniu=false;st.info='';
    if(st.vizitate.indexOf(id)<0)st.vizitate.push(id);emite('lista',{id});deseneaza(`[data-lista="${id}"]`);return true}
  function selecteaza(id){st.selectat=id;emite('selectat',{id});deseneaza(`[data-f="${id}"]`)}
  function deschideFisier(id){
    const f=gaseste(id),a=activ();if(!f||!st.conectat)return false;st.selectat=null;st.grila=false;st.profil=false;
    const din=a.ecran==='drive'?'drive':a.ecran==='docs'||a.ecran==='slides'?a.ecran:'api';
    if(st.inchise.indexOf(id)>=0&&st.regasite.indexOf(id)<0&&(din==='drive'||din==='docs'))st.regasite.push(id);
    if(st.deschise.indexOf(id)<0)st.deschise.push(id);f.recent=true;if(st.salv[id]==null)st.salv[id]='gata';
    if(din==='drive'){const t=filaNouaObj();t.ecran='doc';t.doc=id;t.url=urlDoc(f);st.file.push(t);st.activ=t.id;emite('fila-noua',{id:t.id});st.info='Fișierul s-a deschis într-o filă nouă.'}
    else{a.ecran='doc';a.doc=id;a.url=urlDoc(f);st.info=''}
    emite('deschis',{id,din});deseneaza();return true}
  function deconecteaza(){if(!st.conectat)return false;const alt=st.altcuiva;
    st.conectat=false;st.iesit=true;st.altcuiva=false;st.contAltcuiva=null;st.profil=false;st.grila=false;st.nouMeniu=false;st.bula=false;st.tooltip=null;st.verificat=false;adresaScrisa='';
    /* toate filele cu aplicații Google ajung la pagina de conectare (contul s-a închis în tot browserul) */
    st.file.forEach(t=>{if(t.ecran!=='gol'){const tn=t.ecran==='doc'?'documente':t.ecran==='docs'?'docs':t.ecran==='slides'?'slides':'drive';laConectare(t,tn);t.doc=null}});
    st.info=(alt?'Ai închis contul rămas deschis, fără să te uiți în el.':'Te-ai deconectat.')+' (Pe calculatorul adevărat poate apărea întâi o listă cu contul, arătat ca deconectat: fără parolă nu mai intră nimeni.)';
    emite('deconectat',{altcuiva:alt});deseneaza();return true}
  function inchideFereastra(){if(!st.privata||st.fereastraInchisa)return false;st.fereastraInchisa=true;st.conectat=false;st.bula=false;emite('fereastra-inchisa');deseneaza();return true}
  function profil(v){st.profil=v==null?!st.profil:!!v;st.grila=false;st.nouMeniu=false;emite('profil',{deschis:st.profil});deseneaza(st.profil?'[data-a="deconecteaza"]':'[data-a="profil"]')}

  /* norul cu bifă: mouse-ul pe el, focusul sau o atingere arată „Salvat în Drive” (ca un indiciu); mouse-ul plecat îl ascunde */
  function legaStare(w){const b=w&&w.querySelector('[data-a="stare"]');if(!b)return;
    const arata=()=>{const a=activ();if(!a||!a.doc||(st.tooltip===a.doc&&st.vazutSalvat[a.doc]))return;verificaSalvarea()};
    b.addEventListener('mouseenter',arata);b.addEventListener('focus',arata);b.addEventListener('click',arata);
    b.addEventListener('mouseleave',()=>{if(!st.tooltip)return;st.tooltip=null;const tt=root.querySelector('.cg-tooltip');if(tt)tt.remove()})}
  function leaga(){
    const cg=root.querySelector('.cg');
    /* întrebarea browserului deschisă: un clic alături o închide fără salvare (ca în Chrome); clicul merge mai departe */
    if(st.bula&&cg)cg.addEventListener('click',e=>{if(!st.bula||e.target.closest('.cg-bula'))return;st.bula=false;st.bulaInchisa=true;st.bulaRaspuns='alaturi';
      st.info='Ai apăsat alături, iar întrebarea browserului s-a închis: parola nu s-a salvat. Data viitoare apasă ✕ sau butonul care nu salvează, ca să fii sigur.';emite('bula',{raspuns:'alaturi'});
      setTimeout(()=>{if(root.querySelector('.cg-bula'))deseneaza()},0)},true);
    const url=root.querySelector('.cg-url');
    if(url)url.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();mergiLa(url.value)}});
    const ia=root.querySelector('#cg-in-adr');if(ia){ia.addEventListener('input',()=>{adresaScrisa=ia.value});ia.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();trimiteAdresa(ia.value)}})}
    const ip=root.querySelector('#cg-in-par');if(ip)ip.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();trimiteParola(ip.value)}});
    const ti=root.querySelector('.cg-titlu');
    if(ti&&!ti.readOnly){let vechi=ti.value,gata=false;
      ti.addEventListener('focus',()=>{vechi=ti.value;gata=false;setTimeout(()=>{try{ti.select()}catch(e){}},0)});
      ti.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();gata=true;redenumeste(ti.value);const tx=root.querySelector('.cg-text');if(tx)tx.focus({preventScroll:true})}
        else if(e.key==='Escape'){e.preventDefault();gata=true;ti.value=vechi;ti.blur()}});
      ti.addEventListener('blur',()=>{if(!gata&&spatii(ti.value)!==vechi){gata=true;redenumeste(ti.value,true)}})}
    const tx=root.querySelector('.cg-text');
    if(tx&&!tx.readOnly)tx.addEventListener('input',()=>{const a=activ(),f=a&&gaseste(a.doc);if(!f)return;f.text=tx.value;f.modificat='acum';schimbat(f.id,'text');emite('scris',{id:f.id,randuri:randuri(f.text)})});
    legaStare(root.querySelector('.cg-stare-wrap'));
    root.querySelectorAll('[data-fila]').forEach(el=>{el.addEventListener('click',e=>{if(e.target.closest('[data-inchide]'))return;comutaFila(el.dataset.fila)});
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();comutaFila(el.dataset.fila)}})});
    root.querySelectorAll('[data-inchide]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();inchideFila(b.dataset.inchide)}));
    root.querySelectorAll('[data-lista]').forEach(b=>b.addEventListener('click',()=>arataLista(b.dataset.lista)));
    root.querySelectorAll('[data-f]').forEach(b=>{
      /* în Drive: un clic alege, dublu clic deschide; în ecranul de pornire Documente (și pe telefon): un clic deschide */
      b.addEventListener('click',()=>{const e=activ().ecran;if(ATINGERE()||e==='docs'||e==='slides')deschideFisier(b.dataset.f);else selecteaza(b.dataset.f)});
      b.addEventListener('dblclick',()=>deschideFisier(b.dataset.f));
      b.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();deschideFisier(b.dataset.f)}})});
    root.querySelectorAll('[data-nou]').forEach(b=>b.addEventListener('click',()=>creeazaDocument(b.dataset.nou)));
    root.querySelectorAll('[data-app]').forEach(b=>b.addEventListener('click',()=>alegeAplicatie(b.dataset.app)));
    root.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>{const x=(O.butoaneDoc||[]).find(y=>y.id===b.dataset.act);const a=activ();emite('actiune',{id:b.dataset.act,fisier:a&&a.doc});if(x&&x.la)x.la(inst,a&&gaseste(a.doc))}));
    root.querySelectorAll('[data-a]').forEach(b=>{if(b.tagName!=='BUTTON'||b.dataset.a==='stare')return;b.addEventListener('click',()=>{
      const a=b.dataset.a;
      if(a==='enter')mergiLa(url&&url.value);
      else if(a==='inainte')trimiteAdresa(ia&&ia.value);
      else if(a==='inainte-parola')trimiteParola(ip&&ip.value);
      else if(a==='alta-adresa'){activ().ecran='conectare-adresa';st.err='';activ().url='accounts.google.com/v3/signin/identifier';deseneaza('#cg-in-adr')}
      else if(a==='uitat-adresa'){st.info='La contul de la școală, adresa ți-o spune profesorul. N-o ghici și nu încerca adresele colegilor.';emite('uitat',{ce:'adresa'});deseneaza('#cg-in-adr')}
      else if(a==='uitat-parola'){st.info='Contul acesta e al școlii. Nu-ți faci alt cont: îi spui profesorului, iar el sau administratorul conturilor școlii îți poate da o parolă nouă. (Pe pagina adevărată, mesajul are alte cuvinte.)';emite('uitat',{ce:'parola'});deseneaza('#cg-in-par')}
      else if(a==='creeaza'){st.info='La școală nu-ți faci alt cont: intri cu contul de la școală. Dacă nu-l știi, îl întrebi pe profesor.';emite('creeaza-cont');deseneaza('#cg-in-adr')}
      else if(a==='invitat'){st.info='Modul pentru invitați și fereastra privată sunt feluri de a folosi browserul fără să rămână nimic pe calculator după ce le închizi. În laborator faci ce scrie în lecție.';emite('invitat');deseneaza('#cg-in-adr')}
      else if(a==='bula-x')raspundeBula('inchide');
      else if(a==='bula-refuza')raspundeBula('refuza');
      else if(a==='bula-salveaza')raspundeBula('salveaza');
      else if(a==='fila-noua')filaNoua();
      else if(a==='inchide-fereastra')inchideFereastra();
      else if(a==='grila')grila();
      else if(a==='grila-x')grila(false);
      else if(a==='nou')meniuNou();
      else if(a==='nou-x')meniuNou(false);
      else if(a==='nou-sub'){st.nouSub=!st.nouSub;deseneaza('[data-a="nou-sub"]')}
      else if(a==='nou-dosar'||a==='nou-incarca'){st.info='Dosarele și încărcarea fișierelor nu le folosim azi.';st.nouMeniu=false;deseneaza('[data-a="nou"]')}
      else if(a==='sablon'){st.info='Șabloanele nu le folosim azi. Alege Document gol.';deseneaza('[data-nou="doc"]')}
      else if(a==='profil')profil();
      else if(a==='profil-x')profil(false);
      else if(a==='gestioneaza'){st.info='Pagina contului nu o folosim azi.';st.profil=false;deseneaza('[data-a="profil"]')}
      else if(a==='deconecteaza')deconecteaza();
      else if(a==='partajare'){const x=activ();emite('partajare',{id:x&&x.doc});if(O.partajare)O.partajare(inst,x&&gaseste(x.doc))}
      else if(a==='anuleaza'||a==='repeta'){st.info='Anulează și Repetă merg ca în Word. Aici, în desen, nu le folosim.';deseneaza()}
      else if(a==='panou-x')inchidePanou()})});
  }
  function arataPanou(continut,titlu){st.panou={continut,titlu};deseneaza('[data-a="panou-x"]')}
  function inchidePanou(){st.panou=null;deseneaza()}
  const inst={root,
    stare:()=>{const a=activ();const s=JSON.parse(JSON.stringify(Object.assign({},st,{panou:!!st.panou})));s.fila=a?JSON.parse(JSON.stringify(a)):null;return s},
    jurnal:()=>J.slice(),
    on(n,f){(asc[n]=asc[n]||[]).push(f);return ()=>{asc[n]=asc[n].filter(x=>x!==f)}},
    mergiLa,raspundeBula,grila,alegeAplicatie,nou:meniuNou,creeazaDocument,redenumeste,scrie,verificaSalvarea,
    filaNoua,comutaFila,inchideFila,arataLista,selecteaza,deschideFisier,deconecteaza,inchideFereastra,profil,
    conecteaza(adresa,parola){const a=activ();if(st.conectat)return true;if(a.ecran!=='conectare-adresa'&&a.ecran!=='conectare-parola')mergiLa('drive.google.com');
      if(activ().ecran==='conectare-parola')activ().ecran='conectare-adresa';if(!trimiteAdresa(adresa))return false;return trimiteParola(parola)},
    fisiere:()=>JSON.parse(JSON.stringify(toate())),
    fisier:id=>{const f=gaseste(id);return f?JSON.parse(JSON.stringify(f)):null},
    adaugaFisier(f){toate().push(Object.assign({text:'',loc:'meu',modificat:''},JSON.parse(JSON.stringify(f))));deseneaza()},
    modificaFisier(id,patch){const f=gaseste(id);if(!f)return false;Object.assign(f,patch||{});deseneaza();return true},
    slot(nume,fn){(sloturi[nume]=sloturi[nume]||[]).push(fn);return ()=>{sloturi[nume]=sloturi[nume].filter(x=>x!==fn)}},
    arataPanou,inchidePanou,redeseneaza:()=>deseneaza(),
    reset(){nou0();deseneaza()},
    distruge(){Object.keys(cronSalv).forEach(k=>clearTimeout(cronSalv[k]));root.innerHTML=''},
    cont:()=>Object.assign({},cont)};
  nou0();
  (O.extensii||[]).forEach(n=>{const fn=EXTENSII[n];if(fn)try{fn(inst,O)}catch(e){}});
  deseneaza();
  return inst}

/* ---------------- verificările (pe stare) ---------------- */
const NUME_APP={drive:'Drive',docs:'Documente',slides:'Prezentări'};
const lucratF=(s,fn)=>(s.lucrate||[]).some(fn);
const TESTE={
  bara:{ce:(Q,v)=>`Ai deschis ${v==='docs'?'Documente':'Drive'} din bara de adrese (${v==='docs'?'docs.google.com':'drive.google.com'}, apoi Enter)`,f:(s,v)=>!!s.ajuns[v||'drive'],
    m:(s,v)=>`Scrie în bara de adrese ${v==='docs'?'docs.google.com':'drive.google.com'}, exact, și apasă Enter.`},
  conectat:{ce:(Q,v)=>`Ai intrat în contul ${v||'din exercițiu'} (adresa, Înainte, parola, Înainte)`,f:s=>s.fostConectat,m:()=>'Încă nu ești în cont: adresa, Înainte, apoi parola și iar Înainte.'},
  nesalvata:{ce:()=>'La întrebarea browserului despre parolă n-ai salvat parola: ai refuzat (✕ sau butonul care nu salvează)',f:s=>s.bulaVazuta&&s.bulaInchisa&&!s.parolaSalvata,
    m:s=>s.parolaSalvata?'Ai apăsat butonul care salvează parola. Pe calculatorul comun nu salvezi parola: apasă „Ia-o de la capăt”.':'Întrebarea apare după conectare: refuz-o cu ✕ sau cu butonul care nu salvează.'},
  grila:{ce:(Q,v)=>`Ai deschis ${NUME_APP[v]||v} din grila de aplicații (pătratul din 9 puncte)`,f:(s,v)=>s.dinGrila.indexOf(v)>=0,m:(s,v)=>`Apasă grila de aplicații (pătratul din 9 puncte, sus în dreapta), apoi ${NUME_APP[v]||v}.`},
  creat:{ce:(Q,v)=>v==='prez'?'Ai creat o prezentare nouă':'Ai creat un document nou (Nou, apoi Documente Google)',f:s=>(s.creat||[]).length>0,
    m:()=>'Încă n-ai creat documentul: în Drive apasă Nou (sus în stânga), apoi Documente Google.'},
  titlu:{ce:(Q,v,d)=>d||`Documentul se cheamă exact „${v}”`,f:(s,v,Q,inst)=>{const L=inst?inst.fisiere():[];return lucratF(s,id=>{const f=L.find(x=>x.id===id);return f&&f.titlu===spatii(v)})},
    m:(s,v,Q,inst)=>{const L=inst?inst.fisiere():[];const f=L.find(x=>s.lucrate.indexOf(x.id)>=0);if(!f)return 'Întâi creezi documentul.';
      if(f.titlu===TIPURI_FISIER[f.tip].gol)return 'Documentul se cheamă tot „'+f.titlu+'”. Apasă pe nume (sus, în stânga), scrie numele cerut și apasă Enter.';
      if(faraDiacritice(f.titlu).toLowerCase()===faraDiacritice(spatii(v)).toLowerCase())return 'Aproape: verifică literele mari și mici. Numele cerut: „'+v+'”.';
      return 'Numele scris e „'+f.titlu+'”. Numele cerut: „'+v+'” (litere, liniuțe jos, cifre, semn cu semn).'}},
  scris:{ce:(Q,v)=>`Ai scris ${v||2} rânduri în document`,f:(s,v,Q,inst)=>{const L=inst?inst.fisiere():[];return lucratF(s,id=>{const f=L.find(x=>x.id===id);return f&&randuri(f.text)>=(v||2)})},
    m:(s,v)=>`Scrie în pagina documentului ${v||2} rânduri (Enter la sfârșitul primului rând).`},
  salvat:{ce:()=>'Ai verificat salvarea: norul de lângă nume spune „Salvat în Drive”',f:s=>lucratF(s,id=>s.salv[id]==='gata'&&s.vazutSalvat[id]),
    m:s=>lucratF(s,id=>s.salv[id]==='se-salveaza')?'Încă scrie „Se salvează…”. Așteaptă o clipă, apoi ține mouse-ul pe nor (pe telefon: atinge-l).':'Ține mouse-ul pe norul cu bifă de lângă nume (pe telefon: atinge-l) și citește ce scrie.'},
  inchis:{ce:()=>'Ai închis fila documentului (× de pe filă)',f:s=>lucratF(s,id=>s.inchise.indexOf(id)>=0),m:()=>'Închide fila documentului cu × de pe ea (nu fila Drive-ului).'},
  regasit:{ce:()=>'Ai găsit documentul în Drive și l-ai deschis din nou',f:s=>lucratF(s,id=>s.regasite.indexOf(id)>=0),
    m:s=>lucratF(s,id=>s.inchise.indexOf(id)>=0)?'În fila Drive-ului apasă Drive-ul meu, apoi deschide documentul tău (dublu clic; pe telefon, o atingere).':'Întâi închizi fila documentului, apoi îl cauți în Drive.'},
  distribuite:{ce:()=>'Te-ai uitat în Distribuite cu mine',f:s=>s.vizitate.indexOf('distribuite')>=0,m:()=>'În meniul din stânga al Drive-ului apasă Distribuite cu mine.'},
  necitit:{ce:(Q,v,d)=>`N-ai deschis niciun fișier ${d||'al altcuiva'}`,f:(s,v)=>!(v||[]).some(x=>s.deschise.indexOf(x)>=0),m:()=>'Ai deschis un fișier care nu e al tău. Nu se face: apasă „Ia-o de la capăt”.'},
  iesit:{ce:(Q,v,d)=>d||'La final te-ai deconectat (Profil, apoi Deconectează-te)',f:s=>s.iesit&&!s.conectat,
    m:s=>s.fereastraInchisa&&!s.iesit?'Ai închis fereastra, dar întâi trebuia să te deconectezi: Profil, apoi Deconectează-te. Apasă „Ia-o de la capăt”.':'Încă ești în cont: apasă Profil (cerculețul din dreapta sus), apoi Deconectează-te.'},
  verificat:{ce:()=>'Ai verificat ieșirea: drive.google.com îți cere din nou conectarea',f:s=>s.verificat,m:s=>s.fereastraInchisa?'Ai închis fereastra privată înainte să verifici, iar acum nu mai ai bara de adrese. Apasă „Ia-o de la capăt”: întâi verifici, apoi închizi fereastra.':s.iesit?'Scrie din nou drive.google.com în bara de adrese (sau într-o filă nouă, cu +) și apasă Enter: trebuie să apară pagina de conectare.':'Întâi te deconectezi, apoi verifici.'},
  fereastra:{ce:()=>'La sfârșit ai închis fereastra privată (✕ din colțul ei)',f:s=>s.fereastraInchisa,m:()=>'Închide fereastra privată cu ✕ din colțul ei de sus (fâșia închisă la culoare).'}};

/* ---------------- tipul „colab” (sarcină în simulator, cu teste) ---------------- */
function testeDin(Q){return (Q.teste||[]).map((t,i)=>{const T=TESTE[t.c];if(!T)throw new Error('colab-google: test necunoscut '+t.c);
  return {c:t.c,v:t.v,i,ce:t.ce||T.ce(Q,t.v,t.d),mm:t.m,T}})}
function evalueaza(Q,inst){const s=inst.stare();return testeDin(Q).map(t=>{const ok=!!t.T.f(s,t.v,Q,inst);return {c:t.c,ce:t.ce,ok,m:ok?'':(t.mm||(t.T.m?t.T.m(s,t.v,Q,inst):''))}})}
function hTeste(lista,titlu){return `<div class="cg-teste"><div class="lbl">${titlu} · <span class="nr">0 din ${lista.length} trec</span></div><ol>${lista.map((t,i)=>`<li data-i="${i}"><span class="s">○</span><span>${t.ce}<span class="m"></span></span></li>`).join('')}</ol></div>`}
function bifeaza(box,rez,arata){rez.forEach((r,i)=>{const li=box.querySelector(`.cg-teste li[data-i="${i}"]`);if(!li)return;
  li.className=r.ok?'ok':(arata?'rau':'');li.querySelector('.s').textContent=r.ok?'✓':(arata?'✗':'○');li.querySelector('.m').textContent=!r.ok&&arata?r.m:''});
  const n=box.querySelector('.cg-teste .nr');if(n)n.textContent=`${rez.filter(r=>r.ok).length} din ${rez.length} trec`}
function solutie(Q,inst,gr){
  const O=Q.sim||{},cont=O.cont||CONTURI.ana,T=Q.teste||[],sari=gr&&gr.sari;
  const are=c=>T.some(t=>t.c===c)&&c!==sari;
  const val=c=>(T.find(t=>t.c===c)||{}).v;
  if(gr&&gr.deschide&&inst.stare().conectat){const a=inst.stare().fila;if(a&&a.ecran==='drive')inst.deschideFisier(gr.deschide)}
  /* contul altcuiva rămas deschis: întâi îl închizi (dacă testele cer ieșirea sau conectarea ta) */
  if(inst.stare().altcuiva&&(are('iesit')||are('conectat')))inst.deconecteaza();
  if(are('bara'))inst.mergiLa(gr&&gr.bara||(val('bara')==='docs'?'docs.google.com':'drive.google.com'));
  if(are('conectat')){if(!inst.conecteaza(gr&&gr.adresa||cont.adresa,cont.parola))return}
  if(inst.stare().bula){if(gr&&gr.salveaza)inst.raspundeBula('salveaza');else if(are('nesalvata'))inst.raspundeBula('refuza')}
  const inchide=()=>{const s=inst.stare();if(s.fila&&s.fila.ecran==='doc')inst.inchideFila()};
  /* documentul era deschis de la start (nu se creează): întâi se închide fila lui, apoi se caută (prin grilă sau Drive) */
  if((are('inchis')||are('regasit'))&&!are('creat'))inchide();
  if(are('grila')){inst.grila(true);inst.alegeAplicatie(val('grila'))}
  if(are('creat'))inst.creeazaDocument(val('creat')||'doc');
  if(are('titlu')||(gr&&gr.titlu))inst.redenumeste(gr&&gr.titlu!=null?gr.titlu:val('titlu'));
  if(are('scris')){const n=val('scris')||2;inst.scrie(gr&&gr.text!=null?gr.text:Array.from({length:n},(_,i)=>'Rândul '+(i+1)+' din documentul meu.').join('\n'))}
  if(are('salvat'))inst.verificaSalvarea();
  if(are('inchis')||are('regasit'))inchide();
  if(are('distribuite'))inst.arataLista('distribuite');
  if(are('regasit')){inst.arataLista('meu');const s=inst.stare();const id=(s.lucrate||[]).find(x=>s.inchise.indexOf(x)>=0);if(id)inst.deschideFisier(id)}
  if(are('iesit')&&inst.stare().conectat)inst.deconecteaza();
  if(are('verificat')){inst.filaNoua();inst.mergiLa('drive.google.com')}
  if(are('fereastra'))inst.inchideFereastra()}
const colab={
  render(Q,body,api){
    stil();const lista=testeDin(Q);
    body.innerHTML=`<div class="cg-sarcina"><div class="cg-loc"></div>${hTeste(lista,'Testele sarcinii')}<button type="button" class="cg-reset" data-cg="reset">Ia-o de la capăt</button></div>`;
    const loc=body.querySelector('.cg-loc');
    let inst;
    const upd=arata=>{const r=evalueaza(Q,inst);bifeaza(body,r,arata);return r};
    const porneste=()=>{if(inst)inst.distruge();inst=creeaza(loc,Q.sim||{});inst.on('schimbare',()=>upd(false));upd(false)};
    porneste();
    body.querySelector('[data-cg="reset"]').onclick=()=>{porneste();const u=loc.querySelector('.cg-url,#cg-in-adr,[data-a="profil"]');if(u)u.focus({preventScroll:true})};
    body._rezolva=()=>{inst.reset();solutie(Q,inst,null);upd(false)};
    body._gresit=()=>{inst.reset();solutie(Q,inst,Q.gresit||{sari:(Q.teste||[]).slice(-1)[0].c});upd(false)};
    body._inst=()=>inst;
    const nav=api.checkButton(()=>{const r=upd(true),rau=r.filter(x=>!x.ok).length;
      if(!rau){nav.innerHTML='';api.resolve(true)}
      else{api.resolve(false,`${rau===1?'Un test nu trece':rau+' teste nu trec'} (marcate cu ✗; sub fiecare scrie de ce). Continuă de unde ai rămas și apasă din nou.`,r.every(x=>!x.ok));
        api.revealButton(()=>{body._rezolva();upd(true);nav.innerHTML='';api.giveUp(Q.arata||'am făcut pașii în simulatorul de mai sus: citește-i în ordine și uită-te la teste.')})}
      /* după „Verifică” (greșit), focusul înapoi în simulator, pe locul de lucru (regula 14), fără derulare */
      if(rau){const f=loc.querySelector('#cg-in-adr,#cg-in-par,[data-a="bula-x"],.cg-text,.cg-titlu,.cg-url');if(f)f.focus({preventScroll:true})}},Q.buton||'Verifică');
  },
  rezolva(Q,body){body._rezolva()},
  gresit(Q,body){body._gresit()}
};

window.SimColabGoogle={creeaza,TESTE,colab,CONTURI,FISIERE_ANA,TIPURI_FISIER,LISTE,DOMENIU:DOM,
  extensie(nume,fn){EXTENSII[nume]=fn},faraDiacritice,randuri};
})();
