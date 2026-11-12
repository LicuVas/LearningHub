/* Conținutul paginii „Toată lumea are probleme” (gimnaziu).
   Motorul e în index.html; aici stă doar textul, ca să se poată corecta fără să atingi codul.
   Faptele istorice și numerele de telefon au sursa în C:\00\AI_0\projects\probleme-alese\surse.md */
window.PAGINA = {
  parti: [
    /* ───────────────────────── PARTEA 1 ───────────────────────── */
    {
      id: "p1", emoji: "🧊", titlu: "Cine n-are probleme?",
      rezumat: "12 oameni, de la un bebeluș de o zi la un împărat. Ghicește problema fiecăruia.",
      blocuri: [
        { tip: "text", titlu: "Caută omul fără probleme",
          html: "<p>Gândește-te la cineva care, crezi tu, n-are nicio problemă. Poate un coleg cu note mari. Poate un fotbalist celebru. Poate un om foarte bogat.</p><p>Acum cunoști 12 oameni, de la un bebeluș de o zi până la unul dintre cei mai puternici oameni din istorie. La fiecare vezi întâi <b>ce vede lumea</b>. Tu alegi <b>ce problemă are</b>.</p>" },
        /* La potrivire, variantele greșite sunt problemele altor oameni din listă.
           nu: ["…"] = oamenii (după „cine”, scris exact) a căror problemă NU apare ca variantă greșită la cartonașul ăsta,
           pentru că o poate avea și el (ex.: și sportivul campion e criticat de străini, ca influencerul). */
        { tip: "potrivire", intrebare: "Ce problemă are?",
          items: [
            { emoji: "👶", cine: "Nou-născutul", detaliu: "o zi", vede: "Doarme, toată lumea îl iubește, n-are teme.",
              corect: "Îi e foame la câteva ore, zi și noapte, dar nu poate spune asta. Poate doar să plângă.",
              ascuns: "Nu-și poate ține singur capul. Îi e frig ușor. Nu știe încă nimic despre lume.",
              alege: "Plânsul e prima lui unealtă de rezolvat probleme. Tot ce va învăța de acum înainte (să meargă, să vorbească) îl va ajuta să-și rezolve singur problemele." },
            { emoji: "🧒", cine: "Copilul de un an", vede: "Se joacă toată ziua.",
              corect: "Vrea să ajungă la jucărie, dar încă nu știe să meargă. Cade iar și iar.",
              ascuns: "Nu înțelege de ce n-are voie să atingă priza. Îi cresc dinții și îl dor.",
              alege: "Se ridică după fiecare cădere. Așa ai învățat și tu să mergi: căzând de foarte multe ori, fără să renunți." },
            { emoji: "🎒", cine: "Elevul de clasa a V-a", vede: "N-are griji, doar școala.",
              nu: ["Cel mai popular elev din clasă"],
              corect: "Are profesori noi la fiecare materie, iar mâine are test la o lecție pe care n-a înțeles-o.",
              ascuns: "Vrea să-și facă prieteni noi în clasă. Se teme că o să greșească în fața tuturor.",
              alege: "Poate să-l întrebe azi pe profesor (o problemă mică) sau poate spera că testul nu vine (o problemă mare, mâine)." },
            { emoji: "🎓", cine: "Elevul de clasa a VIII-a", vede: "E printre cei mai mari din școală. Mai are un an și termină gimnaziul.",
              nu: ["Elevul de clasa a V-a", "Cel mai popular elev din clasă"],
              corect: "În iunie are Evaluarea Națională. De nota de acolo depinde mult la ce liceu intră.",
              ascuns: "Prietenii lui vor pleca la licee diferite. Toți îl întreabă ce vrea să se facă, iar el încă nu știe.",
              alege: "Poate învăța puțin de acum, ca să-și aleagă el liceul. Sau poate amâna, și atunci liceul îl alege media." },
            { emoji: "⭐", cine: "Cel mai popular elev din clasă", vede: "Toți vor să fie prieteni cu el.",
              nu: ["Milionarul", "Elevul de clasa a V-a", "Elevul de clasa a VIII-a"],
              corect: "Simte că trebuie să pară mereu „tare”. Dacă greșește, vede toată clasa.",
              ascuns: "Nu știe care prieteni țin la el cu adevărat. Acasă poate fi o ceartă de care nu știe nimeni.",
              alege: "Să spună uneori „nu știu” și să râdă de propriile greșeli. Altfel trăiește mereu cu frica să nu greșească în fața tuturor." },
            { emoji: "🏆", cine: "Sportivul campion", vede: "Medalii, aplauze, interviuri.",
              nu: ["Influencerul cu un milion de urmăritori"],
              corect: "Se antrenează în fiecare zi, ore întregi, chiar și când îl doare ceva sau n-are chef.",
              ascuns: "Dacă se rănește grav, poate fi nevoit să se lase de sport. Când pierde, îl critică mii de oameni.",
              alege: "A ales problema antrenamentului, ca să nu-l aleagă problema de a pierde fără să fi luptat." },
            { emoji: "📱", cine: "Influencerul cu un milion de urmăritori", vede: "E celebru și primește lucruri gratis.",
              nu: ["Sportivul campion"],
              corect: "Primește în fiecare zi comentarii răutăcioase de la oameni pe care nu i-a văzut niciodată.",
              ascuns: "Trebuie să posteze mereu ceva nou, altfel e uitat. Nu mai poate ieși liniștit pe stradă.",
              alege: "Cât din viața lui arată tuturor și cât păstrează doar pentru el." },
            { emoji: "💰", cine: "Milionarul", vede: "Are tot ce vrea: case, mașini, vacanțe.",
              nu: ["Părintele"],
              corect: "Nu știe dacă oamenii din jur îl plac pe el sau doar banii lui.",
              ascuns: "Trebuie să aibă grijă să nu piardă ce are. Copiii lui pot crește fără să știe ce înseamnă efortul.",
              alege: "Ce face cu banii: doar lucruri pentru el sau și probleme rezolvate pentru alții." },
            { emoji: "👩‍👧", cine: "Părintele", vede: "E adult, face ce vrea.",
              corect: "Merge la serviciu, plătește facturile și stă treaz noaptea când copilul e bolnav.",
              ascuns: "Se teme pentru viitorul copiilor. Uneori e obosit și n-are pe cine să întrebe ce să facă.",
              alege: "Alege în fiecare zi grija pentru copiii lui: una dintre cele mai grele munci din viață. Și una dintre cele mai frumoase." },
            { emoji: "🧑‍🏫", cine: "Profesorul", vede: "Vine la școală, vorbește și pune note.",
              nu: ["Părintele"],
              corect: "Are aproape 30 de elevi în clasă și fiecare înțelege altfel, în alt ritm.",
              ascuns: "Seara pregătește lecții și corectează lucrări. Are și el probleme acasă, ca toată lumea.",
              alege: "Cum explică a treia oară aceeași lecție fără să-și piardă răbdarea." },
            { emoji: "🏰", cine: "Ștefan cel Mare", detaliu: "domn al Moldovei, 1457–1504", vede: "Eroul din manuale, domnitorul care a câștigat multe bătălii.",
              corect: "A pierdut și el o bătălie mare, la Războieni, în 1476. A trebuit să înceapă din nou.",
              ascuns: "A fost rănit la picior în 1462, într-o luptă la cetatea Chilia. Rana l-a chinuit toată viața.",
              alege: "Să se ridice după înfrângere. O legendă scrisă de Ion Neculce spune că mama lui nu l-a lăsat să intre în Cetatea Neamțului și l-a trimis înapoi să lupte. Dimitrie Bolintineanu a făcut din ea poezia „Muma lui Ștefan cel Mare”. Cetatea e chiar în județul nostru: o poți vizita." },
            { emoji: "👑", cine: "Împăratul Marcus Aurelius", detaliu: "Roma, 161–180", vede: "Conduce Imperiul Roman. E unul dintre cei mai puternici oameni din lume în vremea lui.",
              corect: "O boală molipsitoare omoară oameni în tot imperiul. La graniță e război ani la rând. Un general încearcă să-i ia locul.",
              ascuns: "Mai mulți dintre copiii lui au murit de mici. A stat ani întregi în tabere de război, departe de Roma.",
              alege: "Își scria gânduri pentru el însuși, ca să rămână calm și drept. Oamenii le citesc și azi, în cartea „Gânduri către sine însuși”." }
          ] },
        { tip: "text", titlu: "Vârful aisbergului", svg: "aisberg",
          html: "<p>Un <b>aisberg</b> e un munte de gheață care plutește pe mare. Deasupra apei se vede doar un vârf mic. Partea cea mare stă ascunsă sub apă.</p><p>La ceilalți vezi doar <b>vârful aisbergului</b>: poza din vacanță, nota de 10, telefonul nou.</p><p>La tine vezi <b>tot aisbergul</b>, și partea de sub apă: grijile, fricile, greșelile.</p><p>De aceea pare că doar tu ai probleme. Nu e adevărat.</p>" },
        { tip: "intrebari", items: [
            { text: "„Colegul care ia mereu 10 n-are probleme.”", opts: ["Adevărat: n-are probleme.", "Fals: are și el probleme."], ok: 1, fix: true,
              expl: "Poate învață ore întregi. Poate se teme acasă de un 9. Tu nu vezi partea asta." },
            { text: "„Pe internet, oamenii pun mai ales momentele lor bune.”", opts: ["Adevărat", "Fals"], ok: 0, fix: true,
              expl: "Cei mai mulți pun doar momentele bune. Și chiar când arată o zi proastă, tot ei aleg ce pun și cum. Tu compari toată ziua ta cu ce aleg alții să-ți arate." },
            { text: "„Dacă toată lumea are probleme, înseamnă că problema mea nu contează.”", opts: ["Adevărat: problema mea nu contează.", "Fals: problema mea contează."], ok: 1, fix: true,
              expl: "Problema ta contează. Faptul că și alții au probleme nu o face mai mică. Te ajută doar să știi că nu ești singur și că nu e ceva în neregulă cu tine." },
            { text: "„Când crești mare, problemele dispar.”", opts: ["Adevărat", "Fals"], ok: 1, fix: true,
              expl: "Se schimbă. Un adult are alte probleme decât tine, nu mai puține. Vestea bună: și tu vei fi mai puternic." },
            { text: "Câți dintre cei 12 oameni de mai sus n-aveau nicio problemă?", opts: ["Niciunul", "Doi dintre ei", "Cam jumătate"], ok: 0,
              expl: "Niciunul. Nici bebelușul de o zi, nici împăratul. A avea probleme nu înseamnă că e ceva în neregulă cu tine. Înseamnă că trăiești." }
          ] }
      ]
    },

    /* ───────────────────────── PARTEA 2 ───────────────────────── */
    {
      id: "p2", emoji: "🚪", titlu: "Cele două uși",
      rezumat: "Ideea cea mai importantă: nu alegi DACĂ ai probleme, alegi adesea CARE.",
      blocuri: [
        { tip: "text", titlu: "Ideea cea mai importantă", svg: "usi",
          html: "<p>Când apare o problemă, de obicei ai în față două uși:</p><p><b>Ușa A, problema pe care o ALEGI.</b> O iei tu, acum. E mai mică, dar rar e plăcută.</p><p><b>Ușa B, problema care TE ALEGE.</b> Vine singură dacă nu faci nimic. De obicei vine mai târziu și e mai urâtă.</p><p>A treia ușă, cea fără probleme, nu există.</p><p>Atenție: ușile sunt doar pentru problemele în care poți face ceva. Unele probleme vin fără nicio ușă: o boală, părinți plecați departe sau despărțiți, o familie cu bani puțini. Ele NU sunt vina ta. Despre ele vorbim în Partea 4.</p><p>Urmează 12 situații, în două runde. La fiecare alegi ce faci. Apoi afli pe ce ușă ai intrat și ce era în spatele celeilalte.</p>" },
        { tip: "usi", items: [
            { emoji: "🍳", titlu: "Ți-e foame", situatie: "Ai venit de la școală. Ți-e foame. Acasă nu e nimic gata de mâncare, dar ai pâine, brânză și ouă.",
              a: { et: "Îți faci ceva de mâncare: un sandviș sau, dacă ai voie la aragaz, o omletă.", acum: "Zece minute de muncă: pui pe pâine ce găsești, apoi speli farfuria. Nu e greu, dar nici plăcut când ești obosit.", apoi: "Ești sătul. Ai energie pentru teme și pentru joacă. Și ai învățat să-ți faci singur mâncare." },
              b: { et: "Nu-ți faci mâncare. Rozi ce găsești: chipsuri, biscuiți.", acum: "Niciun efort. Gata în zece secunde.", apoi: "Peste o oră ți-e iar foame. Te doare burta, ești nervos și te cerți cu toată lumea. Seara nu poți fi atent la teme." },
              q: { text: "Dacă alegi ușa B, scapi de probleme?", opts: ["Da: dacă nu muncesc, n-am de ce să am probleme.", "Nu: am o altă problemă, pe care n-am ales-o, și e mai urâtă.", "Da: am mâncat ceva, deci problema e rezolvată."], ok: 1 },
              lectie: "Ușa B nu e ușa fără probleme. E ușa cu problema pe care n-ai ales-o, și e mai urâtă. Să-ți faci mâncare nu e ușor, dar e problema TA, aleasă de tine. Iar dacă se întâmplă des să n-ai ce mânca acasă, asta nu e vina ta. Spune-i dirigintelui." },
            { emoji: "🔐", titlu: "Contul tău", situatie: "Jocul tău preferat îți cere să pui un cod de siguranță pe cont (verificarea în doi pași). Durează trei minute.",
              a: { et: "Îl pui acum.", acum: "Trei minute de setări plictisitoare. Și, din când în când, un cod în plus când intri în cont.", apoi: "Nimic. Și asta e partea bună: nu se întâmplă nimic rău." },
              b: { et: "„Cine să-mi spargă mie contul?” Apeși „Mai târziu”.", acum: "Intri direct, fără coduri.", apoi: "Multă vreme nu se întâmplă nimic. Apoi, într-o zi, cineva îți fură contul. Pierzi tot ce ai strâns, iar prietenii primesc mesaje „de la tine”." },
              q: { text: "Care e ideea ascunsă aici?", opts: ["Cine nu pune codul își pierde sigur contul chiar în săptămâna aia.", "Un lucru mic și plictisitor te apără de o problemă rară, dar mare.", "Cel mai rău lucru din toată povestea sunt codurile."], ok: 1 },
              lectie: "Multe probleme alese arată așa: mici, plictisitoare și fără nimic de văzut după. Problema care te alege vine rar, dar mare." },
            { emoji: "📱", titlu: "Încă un clip…", situatie: "E 23:30. Te uiți la clipuri scurte; după fiecare mai vine unul. Mâine ai școală la 8.",
              a: { et: "Lași telefonul și te culci.", acum: "Ratezi ce mai urma. Pare că pierzi ceva.", apoi: "Dimineața te trezești mai ușor. La ore înțelegi ce se predă." },
              b: { et: "Încă unul… și încă unul…", acum: "E plăcut și nu cere niciun efort.", apoi: "Adormi la 1. Dimineața te trezești greu și întârzii. La ore ți-e somn. Și clipurile de aseară? Nu le mai ții minte." },
              q: { text: "Ce problemă rezolva, de fapt, clipul de la 23:30?", opts: ["Plictiseala sau oboseala, fără niciun efort.", "Niciuna: clipul nu rezolvă nimic, e doar rău.", "Te ajută să adormi mai repede și mai ușor."], ok: 0 },
              lectie: "Clipul nu e „rău”. Rezolvă o problemă: plictiseala. Dar o rezolvă pe datorie: plătești a doua zi. Mai vorbim despre asta la Partea 6, despre plăceri." },
            { emoji: "💥", titlu: "Ai stricat ceva", situatie: "Ai scăpat telefonul fratelui tău și ecranul s-a crăpat. Nu te-a văzut nimeni.",
              a: { et: "Îi spui adevărul acum.", acum: "Ți-e rușine. Probabil se supără, poate vă certați. Poate trebuie să ajuți la reparație din banii tăi.", apoi: "Cearta trece. Fratele tău știe că poate avea încredere în tine." },
              b: { et: "Taci și pui telefonul la loc.", acum: "Scapi de ceartă… deocamdată.", apoi: "Te temi tot timpul să nu afle. De obicei află. Atunci ai două probleme: telefonul stricat ȘI minciuna. Încrederea se repară mai greu decât un ecran." },
              q: { text: "De ce face minciuna problema mai mare?", opts: ["Pentru că la telefonul stricat se adaugă problema încrederii.", "Pentru că telefonul se strică și mai tare.", "Nu o face mai mare, dacă fratele nu află niciodată."], ok: 0 },
              lectie: "Adevărul spus devreme e o problemă aleasă. Minciuna e ca un împrumut: plătești mai târziu, și mai mult." },
            { emoji: "🤝", titlu: "Cearta cu prietenul", situatie: "Te-ai certat cu cel mai bun prieten. Știi că ai greșit tu: ai râs de el în fața altora.",
              a: { et: "Îi ceri scuze.", acum: "E jenant. Îți tremură vocea. Poate nu te iartă pe loc.", apoi: "De cele mai multe ori, prietenia se repară. Uneori devine chiar mai puternică." },
              b: { et: "Nu zici nimic. Aștepți să-i treacă.", acum: "Nu trebuie să recunoști nimic.", apoi: "Treceți unul pe lângă altul fără să vorbiți. Cu cât trece mai mult timp, cu atât e mai greu să începi. Poate îți pierzi prietenul." },
              q: { text: "Ce se întâmplă cu o ceartă dacă doar aștepți?", opts: ["Trece singură, mereu, dacă ai destulă răbdare.", "De obicei devine tot mai greu de reparat.", "Până la urmă vine celălalt primul și gata."], ok: 1 },
              lectie: "Scuza e o problemă mică și aleasă. Tăcerea pare comodă, dar face problema tot mai mare." },
            { emoji: "✋", titlu: "N-ai înțeles la oră", situatie: "Profesorul explică ceva nou. Tu n-ai înțeles. Pare că toți ceilalți au înțeles.",
              a: { et: "Ridici mâna și întrebi. Sau îl întrebi pe profesor după oră.", acum: "Îți bate inima. Te temi că o să râdă colegii.", apoi: "Afli. Și de obicei mai sunt câțiva colegi care n-au înțeles nici ei și se bucură că ai întrebat." },
              b: { et: "Taci și speri că o să înțelegi mai târziu.", acum: "Nu se uită nimeni la tine.", apoi: "Rămâi cu un gol. La temă nu știi, la test nu știi. Golul crește odată cu lecțiile noi." },
              q: { text: "Cât durează problema din ușa A (rușinea că întrebi)?", opts: ["Puțin: trece repede.", "Tot anul.", "Toată viața."], ok: 0 },
              lectie: "Rușinea de a întreba trece repede. Golul din lecție poate dura tot anul. Dacă ți-e greu în fața clasei, întreabă după oră." },
            { emoji: "📋", titlu: "Copiezi sau nu?", situatie: "Un coleg îți cere tema ca s-o copieze. Nu vrei să se supere pe tine.",
              a: { et: "Îi spui „nu” sau „hai să-ți explic cum am făcut”.", acum: "E incomod. Poate se supără pe tine o zi.", apoi: "Dacă îi explici, chiar învață ceva. Tu rămâi cu tema ta și cu liniștea ta." },
              b: { et: "I-o dai.", acum: "Scapi de o discuție neplăcută. Colegul e mulțumit.", apoi: "Dacă profesorul vede că temele sunt identice, aveți o problemă amândoi. Colegul n-a învățat nimic, deci la test e la fel de pierdut. Și data viitoare îți cere iar." },
              q: { text: "Cine are o problemă dacă îi dai tema?", opts: ["Doar colegul: el n-a învățat nimic din temă.", "Doar tu, pentru că tema e a ta și riști.", "Amândoi: el nu învață nimic, iar tu poți avea necazuri."], ok: 2 },
              lectie: "Uneori problema aleasă e să spui „nu”. E mică și incomodă. „Da” doar pare mai ușor." },
          ] },
        { tip: "text", titlu: "Pauză: ce ai observat?",
          html: "<p>Până acum, ușa B a venit mereu mai târziu și a fost mai urâtă.</p><p>Gândește-te, doar pentru tine: care dintre situații ți s-a întâmplat și ție? Ce ușă ai ales atunci? Nu trebuie să spui nimănui.</p><p>Mai urmează 5 situații. Citește-le atent: nu toate sunt cum par.</p>" },
        { tip: "usi", items: [
            { emoji: "🎧", titlu: "Banii strânși", situatie: "Vrei niște căști care costă 150 de lei. Din când în când primești câțiva lei: de ziua ta, de la bunici sau pentru o treabă făcută.",
              a: { et: "Pui deoparte o parte din fiecare ban primit.", acum: "O vreme fără dulciuri sau alte lucruri mici. Și ții socoteala: cât ai strâns, cât mai lipsește.", apoi: "După o vreme îți cumperi căștile din banii tăi. Și te bucuri de ele mai mult." },
              b: { et: "Cheltui pe loc fiecare ban primit, ca de obicei.", acum: "Te bucuri de ceva mic de fiecare dată când primești bani.", apoi: "Căștile nu vin niciodată. Banii s-au dus pe lucruri mici, pe care nici nu le mai ții minte." },
              q: { text: "Ce faci, de fapt, când pui bani deoparte?", opts: ["Aleg o problemă mică acum, ca să am ceva mai mare mai târziu.", "Pierd bucuriile mici, fără să primesc nimic în schimb.", "Nimic: banii stau degeaba într-o pușculiță."], ok: 0 },
              lectie: "Să pui bani deoparte e o problemă aleasă: renunți puțin acum ca să ai ceva mai mare mai târziu. Iar banii strânși te ajută și la o problemă neașteptată, ca un ecran crăpat." },
            { emoji: "😟", titlu: "Colegul de care râd alții", ajutor: true, situatie: "Un grup râde mereu de un coleg. Azi l-au împins. Seara, pe grupul clasei apare o poză cu el, făcută pe ascuns. Curg emoji care râd.",
              a: { et: "Nu râzi cu ei. Îi spui unui profesor, fără să afle grupul, și stai lângă colegul tău.", acum: "Ți-e teamă că grupul se va lua și de tine. E greu.", apoi: "Un adult poate opri ce se întâmplă: arată-i și poza. Colegul tău nu mai e singur, iar tu știi că ai făcut ce trebuia." },
              b: { et: "Nu te bagi. „Nu e treaba mea.”", acum: "Nu riști nimic.", apoi: "Pentru el, totul continuă, poate mai rău. Tu te tot gândești la asta și te simți rău. Și data viitoare poate fi rândul tău." },
              q: { text: "Ce e cel mai bine să faci, ca elev?", opts: ["Să te bați cu grupul, ca să-l aperi pe colegul tău.", "Să spui unui adult și să nu-l lași singur.", "Să râzi și tu cu ei, ca să nu se ia și de tine."], ok: 1 },
              lectie: "Uneori problema aleasă cere curaj. Nu trebuie să te bați cu nimeni: să spui unui adult e o alegere curajoasă și deșteaptă. Și nu e pârâre: spui ca să oprești un rău. Iar dacă ți se întâmplă ție: nu e vina ta. Spune unui adult, iar dacă nu te ascultă, spune altuia." },
            { emoji: "📝", titlu: "„Mai e timp”", situatie: "Ești în clasa a VIII-a. E noiembrie. Evaluarea Națională e abia în iunie.",
              a: { et: "Lucrezi de acum, în fiecare săptămână, câte o variantă de Evaluare.", acum: "Două ore pe săptămână luate din timpul liber. Și afli ce nu știi, ceea ce nu e plăcut.", apoi: "Afli golurile încă din noiembrie, când mai ai timp să le umpli. În iunie ai emoții, dar nu panică." },
              b: { et: "„Mai e timp.” Te apuci serios în mai.", acum: "Toamna și iarna sunt libere.", apoi: "În mai afli că ai goluri din clasa a V-a încoace. Nu mai ai timp pentru toate. Iar nota de la Evaluare contează mult la liceu." },
              q: { text: "Ce e, de fapt, „mai e timp”?", opts: ["O problemă pe care o lași să te aleagă pe tine, în mai.", "Adevărul: dacă înveți serios o lună, recuperezi tot.", "Un motiv bun să te odihnești acum, ca să ai putere în mai."], ok: 0 },
              lectie: "„Mai e timp” e ușa B cu cea mai frumoasă etichetă. Timpul chiar există, dar doar dacă îl folosești acum." },
            { emoji: "😴", titlu: "Seara dinaintea testului", ambele: true,
              situatie: "Mâine ai test. E 23:00, ești foarte obosit și ai repetat deja o parte. De data asta, AMBELE uși sunt alegeri.",
              a: { et: "Înveți mai departe, până la 2 noaptea.", acum: "Încă trei ore de învățat, cu ochii care ți se închid.", apoi: "Dormi cinci ore. Dimineața ești ca un zombi și uiți și ce știai." },
              b: { et: "Te culci acum și repeți un sfert de oră dimineața.", acum: "Te culci cu teama că nu știi tot.", apoi: "În somn, creierul păstrează ce ai învățat. Dimineața ești odihnit și repeți ce e mai important." },
              q: { text: "Care problemă e mai mică, până la urmă?", opts: ["Ușa A: învăț mai departe, până la 2 noaptea.", "Ușa B: mă culc și repet dimineața."], ok: 1, fix: true },
              lectie: "Capcană! Să alegi bine NU înseamnă să alegi mereu varianta cea mai grea. Și somnul e o problemă aleasă, una deșteaptă. Cel mai bine era să înveți cu câteva zile înainte." },
            { emoji: "🎂", titlu: "Două invitații", ambele: true,
              situatie: "Ai două invitații în aceeași după-amiază, la aceeași oră: ziua de naștere a unui prieten și meciul echipei tale. Nu poți merge la amândouă.",
              a: { et: "Mergi la ziua prietenului.", acum: "Ratezi meciul.", apoi: "Te distrezi cu prietenul. Afli de la alții cum a fost meciul." },
              b: { et: "Mergi la meci.", acum: "Ratezi petrecerea.", apoi: "Te bucuri de meci. Îi duci prietenului cadoul altă dată." },
              q: { text: "Care e alegerea corectă?", opts: ["Ziua prietenului: prietenii sunt mai importanți.", "Meciul: cadoul i-l poți duce prietenului altă dată.", "Oricare, dacă alegi tu și știi la ce renunți."], ok: 2 },
              lectie: "Aici nu există un singur răspuns corect. Dar orice alegere costă: ca să primești ceva, renunți la altceva. Și asta e tot o problemă. Important e să alegi TU, știind la ce renunți." }
          ] }
      ]
    },

    /* ───────────────────────── PARTEA 3 ───────────────────────── */
    {
      id: "p3", emoji: "☃️", titlu: "Bulgărele de zăpadă",
      rezumat: "Ce se întâmplă cu o problemă pe care o amâni. Și cui îi ajunge.",
      blocuri: [
        { tip: "text", titlu: "Problemele amânate cresc",
          html: "<p>O problemă amânată nu stă pe loc. Crește, ca un bulgăre de zăpadă care se rostogolește la vale.</p><p>Apasă „Dă timpul înainte ▶” de câteva ori, până la capăt, ca să vezi ce se întâmplă cu timpul. Poți și să tragi de bară.</p>" },
        { tip: "glisor", items: [
            { emoji: "🦷", titlu: "O pată pe un dinte",
              etape: [
                { cand: "Azi", text: "O pată mică pe un dinte. Nu doare. Dentistul o rezolvă repede." },
                { cand: "Peste câteva luni", text: "Pata a devenit carie. Te doare când mănânci dulce. Îți trebuie o plombă." },
                { cand: "Peste un an", text: "Caria a ajuns adânc. Te doare noaptea. Îți trebuie un tratament lung, cu mai multe vizite." },
                { cand: "Mai târziu", text: "Uneori dintele nu se mai poate salva și trebuie scos." }
              ],
              q: { text: "Când e cel mai ușor și mai puțin dureros să rezolvi problema?", opts: ["Acum, cât e mică.", "Când începe să doară.", "Când nu mai ai de ales."], ok: 0,
                   expl: "Cu cât aștepți mai mult, cu atât rezolvarea e mai grea, mai dureroasă și mai scumpă." } },
            { emoji: "📐", titlu: "O lecție neînțeleasă",
              etape: [
                { cand: "Săptămâna 1", text: "N-ai înțeles fracțiile. Ți-ar trebui o oră ca să le recuperezi." },
                { cand: "Săptămâna 3", text: "Acum se fac operații cu fracții. Nu le înțelegi nici pe ele, pentru că nu știi fracțiile." },
                { cand: "Săptămâna 6", text: "La test sunt fracții peste tot. Ai de recuperat trei lecții. Începi să crezi că „nu ești bun la mate”." },
                { cand: "Anul următor", text: "Și ecuațiile au fracții. Golul vechi te urmărește. Dar nu e prea târziu: se repară, doar că acum cere mai multă muncă." }
              ],
              q: { text: "Ce înseamnă, de multe ori, „nu sunt bun la mate”?", opts: ["Că m-am născut fără talent la mate și n-am ce face.", "Un gol vechi, nerezolvat, peste care s-au adunat altele.", "Că profesorul nu explică bine și de-asta nu înțeleg nimic."], ok: 1,
                   expl: "De multe ori, „nu sunt bun la mate” e un bulgăre: un gol mic, de demult, peste care s-au rostogolit lecțiile noi. Vestea bună: golurile se pot umple, începând cu primul." } },
            { emoji: "🤐", titlu: "O ceartă nerezolvată",
              etape: [
                { cand: "Ziua 1", text: "Ajunge o scuză: „Îmi pare rău, n-am vrut.”" },
                { cand: "O săptămână", text: "Nu vă mai vorbiți. Fiecare așteaptă să vină celălalt primul." },
                { cand: "O lună", text: "Fiecare și-a găsit alți colegi cu care să stea. E ciudat să mai începi o discuție." },
                { cand: "Un an", text: "Vă salutați ca doi străini. Nici nu mai știți exact de la ce a pornit totul." }
              ],
              q: { text: "Ce costă mai puțin?", opts: ["O scuză în ziua 1.", "O prietenie pierdută după un an."], ok: 0,
                   expl: "Scuza din prima zi e o problemă mică, aleasă. Prietenia pierdută e o problemă mare, pe care n-a ales-o nimeni." } }
          ] },
        { tip: "text", titlu: "Problema ta ajunge la altcineva",
          html: "<p>Când nu-ți rezolvi o problemă, ea nu dispare. Uneori trece la altcineva, care n-a ales-o.</p>" },
        { tip: "intrebari", items: [
            { text: "Nu-ți speli farfuria după masă. A cui problemă devine?", opts: ["A nimănui: farfuria mai poate aștepta până mâine.", "A celui care o spală în locul tău.", "A farfuriei."], ok: 1,
              expl: "Problema ta n-a dispărut. S-a mutat la altcineva, care acum are o treabă în plus." },
            { text: "Nu-ți faci partea în proiectul de grup. A cui problemă devine?", opts: ["A colegilor, care muncesc în plus.", "A profesorului, care a dat proiectul.", "A nimănui, dacă proiectul iese bine oricum."], ok: 0,
              expl: "Colegii tăi primesc problema pe care n-ai rezolvat-o tu. Și data viitoare n-o să mai vrea să lucreze cu tine." },
            { text: "Arunci un ambalaj pe jos în curtea școlii. A cui problemă devine?", opts: ["A vântului, care oricum îl duce de acolo.", "A îngrijitorului sau a tuturor, dacă rămâne acolo.", "A nimănui: e doar un ambalaj mic."], ok: 1,
              expl: "Cineva îl strânge în locul tău. Sau rămâne acolo și toată școala trăiește în mizerie." },
            { text: "Înveți să-ți rezolvi problemele: singur când poți, cu ajutor când e prea greu. Ce se întâmplă cu cei din jur?", opts: ["Au mai puține probleme datorită ție.", "Nimic: fiecare are oricum problemele lui.", "Au mai multe probleme decât înainte."], ok: 0,
              expl: "Omul care își rezolvă problemele la timp ușurează viața celor din jur. Să ceri ajutor la timp nu înseamnă că-ți arunci problema pe altul. E tot un fel de a o rezolva, înainte să crească." },
            { text: "Curtea școlii e plină de ambalaje. Ana le strânge singură în fiecare pauză, dar a doua zi sunt iar acolo. Ce fel de problemă e?", opts: ["Una pe care Ana trebuie s-o rezolve singură, doar mai repede.", "Una care se rezolvă doar împreună: fiecare își aruncă ambalajul la coș.", "Una fără rezolvare: așa sunt copiii."], ok: 1,
              expl: "Unele probleme nu le poate rezolva un singur om, oricât de harnic ar fi. Se rezolvă doar împreună. Să-i aduni pe ceilalți și să mergeți la diriginte e tot o problemă aleasă. Și încă una curajoasă." }
          ] }
      ]
    },

    /* ───────────────────────── PARTEA 4 ───────────────────────── */
    {
      id: "p4", emoji: "🌧️", titlu: "Problemele pe care nu le alegi",
      rezumat: "Nu toate problemele se aleg. Atunci ce poți alege? Și unde ceri ajutor.",
      blocuri: [
        { tip: "text", titlu: "Să fim cinstiți",
          html: "<p>Nu toate problemele se aleg. Unele vin peste tine fără să fi făcut nimic.</p><p>Pentru fiecare cartonaș, alege un coș: <b>A ținut de mine</b> (puteam alege altfel) sau <b>N-a ținut de mine</b> (a venit fără s-o aleg).</p><p>Atenție: și pe ușa B vine o problemă pe care n-ai ales-o. Dar acolo exista și o ușă A, iar tu ai ocolit-o. La o boală sau la o mutare nu există nicio ușă A. Asta nu e „ușa B” și nu e vina ta.</p>" },
        { tip: "sortare", cosuri: ["A ținut de mine", "N-a ținut de mine"], items: [
            { text: "Am luat 4 la un test pentru care n-am învățat.", cos: 0, expl: "Aici a fost o alegere: învățatul. Vestea bună: data viitoare poți alege altfel." },
            { text: "Părinții mei se despart.", cos: 1, bland: true, expl: "N-ai ales asta și NU e vina ta. E o hotărâre a adulților, nu a copiilor." },
            { text: "Am o carie pentru că nu m-am spălat pe dinți luni la rând.", cos: 0, expl: "Problema s-a adunat din multe alegeri mici." },
            { text: "S-a îmbolnăvit bunicul.", cos: 1, bland: true, expl: "Nimeni n-a ales asta. Poți alege totuși ceva: să-l suni, să-l vizitezi, să-i faci o bucurie." },
            { text: "Ne mutăm în alt oraș pentru serviciul unui părinte.", cos: 1, expl: "N-ai ales mutarea. Poți alege cum începi: cu cine vorbești în prima zi la școala nouă." },
            { text: "Plouă tocmai în ziua excursiei.", cos: 1, expl: "Nimeni nu alege vremea. Poți alege să faceți altceva frumos în ziua aia." },
            { text: "Am întârziat la școală pentru că am stat pe telefon până la 2 noaptea.", cos: 0, expl: "Alegerea s-a făcut aseară, la 23:30." },
            { text: "Mama sau tata lucrează în altă țară și ne vedem rar.", cos: 1, bland: true, expl: "N-ai ales asta și NU e vina ta. De obicei, părintele a plecat ca să muncească pentru familie. E normal să-ți fie dor. Când se poate, vorbiți des, fie și la telefon. Și poți spune unui adult de aici când ți-e greu." },
            { text: "Un coleg mă jignește în fiecare zi.", cos: 1, bland: true, expl: "Nu e vina ta. Dar poți alege să nu rămâi singur cu asta: spune-i unui adult." },
            { text: "Mă dor mușchii după antrenament.", cos: 0, expl: "O problemă aleasă, și încă una bună: înseamnă că te-ai antrenat." },
            { text: "M-am născut într-o familie care nu are mulți bani.", cos: 1, bland: true, expl: "N-ai ales asta și nu e vina ta. E mai greu, și e corect s-o spunem. Banii puțini nu spun nimic despre cât valorează familia ta. Școala e unul dintre lucrurile care te pot ajuta să-ți construiești drumul." },
            { text: "Mi s-a descărcat telefonul pentru că am uitat să-l pun la încărcat.", cos: 0, expl: "O alegere mică, uitată: a fost de ajuns un minut aseară." },
            { text: "Unii râd de mine pentru familia sau locul din care vin.", cos: 1, bland: true, expl: "N-ai ales asta și NU e vina ta. Nimeni nu-și alege familia sau locul în care se naște. Cine râde de tine pentru asta greșește. Poți alege să nu rămâi singur cu asta: spune-i unui adult." },
            { text: "Am o boală cu care m-am născut.", cos: 1, bland: true, expl: "N-ai ales-o. Poți alege, cu ajutorul medicilor și al familiei, cum trăiești cu ea." }
          ] },
        { tip: "text", titlu: "Atunci ce poți alege?",
          html: "<p>Când nu alegi problema, tot poți alege ceva: <b>ce faci cu ea</b>.</p>" },
        { tip: "text", titlu: "Povestea lui Viktor Frankl",
          html: "<p>Viktor Frankl a fost un medic din Austria. În al Doilea Război Mondial, naziștii l-au închis în lagăre. Lagărele erau închisori groaznice, unde au murit foarte mulți oameni. Au murit acolo și oameni din familia lui.</p><p>El a scăpat cu viață. A scris că a avut și noroc: mulți oameni buni n-au scăpat.</p><p>După război a scris că omului i se poate lua totul. Un singur lucru nu i se poate lua: libertatea de a alege cum răspunde la ce i se întâmplă.</p><p>Asta nu înseamnă că trebuie să fii mereu tare. Când vine o problemă pe care n-ai ales-o, e normal să fii trist, speriat sau furios. Nu e un răspuns greșit. Nu trebuie să te prefaci că e bine.</p>" },
        { tip: "text", titlu: "Ce poți face când e greu", ajutor: true,
          html: "<p>Lucruri pe care le poți alege aproape mereu:</p><ul><li>să vorbești cu cineva;</li><li>să ceri ajutor;</li><li>să ai grijă de tine: somn, mâncare, mișcare;</li><li>să faci partea mică pe care o poți face tu.</li></ul><p><b>Dar atenție:</b> dacă cineva te lovește, te umilește sau te amenință, nu trebuie să rabzi. La fel dacă te atinge într-un fel care nu-ți place, care te sperie sau te încurcă. Nu contează unde: acasă, la școală sau pe internet. Astfel de lucruri le opresc adulții. Partea ta e doar să spui. Nu e vina ta, chiar dacă cel care îți face rău spune altceva sau îți cere să păstrezi secretul.</p>" },
        { tip: "intrebari", items: [
            { text: "Un prieten îți spune că are o problemă foarte grea acasă și te roagă să nu spui nimănui. Ce faci?",
              opts: ["Promit și tac, orice s-ar întâmpla, ca să nu-i pierd încrederea prietenului meu.", "Îl ascult și îl rog să spună unui adult de încredere. Dacă e în pericol, spun eu.", "Le povestesc colegilor din clasă, ca să ne gândim toți împreună la o soluție."], ok: 1,
              expl: "Să asculți e mult. Dar unele probleme sunt prea grele pentru doi copii. Nu-i promite că taci orice ar fi: spune-i că vrei să-l ajuți. Dacă cineva îi face rău sau e în pericol, să spui unui adult nu e trădare. E ajutor." },
            { text: "Ai o problemă grea pe care n-ai ales-o. Ce înseamnă să ceri ajutor?", opts: ["Că ești slab și nu te descurci singur.", "O problemă aleasă și bună: nu mai ești singur cu ea.", "Că deranjezi pe cineva care are și el problemele lui."], ok: 1,
              expl: "Să ceri ajutor e greu, dar e o problemă pe care o alegi tu. Și e una bună: împarți greutatea cu cineva mai puternic." }
          ] },
        { tip: "text", titlu: "O pauză", ajutor: true,
          html: "<p>Partea asta a fost despre lucruri grele. Poate te-ai gândit la ceva din viața ta. Orice simți acum e în regulă, chiar dacă nu simți nimic deosebit.</p><p>Înainte să mergi mai departe, respiră încet de trei ori. Gândește-te la un om lângă care te simți bine.</p><p>Nu trebuie să spui nimănui din clasă ce problemă ai. Dacă vrei să vorbești cu cineva, alegi tu cu cine și când.</p>" }
      ]
    },

    /* ───────────────────────── PARTEA 5 ───────────────────────── */
    {
      id: "p5", emoji: "🏪", titlu: "Economia: oameni care rezolvă probleme",
      rezumat: "Fiecare meserie rezolvă o problemă a altcuiva. De acolo vin banii.",
      blocuri: [
        { tip: "text", titlu: "În spatele fiecărui lucru e o problemă rezolvată",
          html: "<p>Uită-te în jurul tău: pâinea, autobuzul, telefonul, școala. În spatele fiecăruia e cineva care rezolvă o problemă a altcuiva.</p><p>Asta e, de fapt, <b>economia</b>: oameni care rezolvă probleme pentru alți oameni și primesc bani pentru asta.</p><p>Alege ce problemă rezolvă fiecare meserie.</p>" },
        { tip: "potrivire", intrebare: "Ce problemă rezolvă?",
          items: [
            { emoji: "🥖", cine: "Brutarul", corect: "Oamenilor le e foame și n-au timp să facă pâine acasă.", expl: "Brutarul își alege o problemă grea: se trezește noaptea. Așa rezolvă problema foamei pentru sute de oameni, care îi plătesc pâinea." },
            { emoji: "🩺", cine: "Medicul", corect: "Oamenii se îmbolnăvesc și nu știu singuri ce au.", expl: "A învățat mulți ani ca să poată rezolva o problemă pe care oamenii n-o pot rezolva singuri. De aceea meseria lui e prețuită." },
            { emoji: "🧑‍🏫", cine: "Profesorul", corect: "Copiii au de învățat lucruri pe care nu le-ar putea afla ușor singuri.", expl: "Profesorul rezolvă problema „nu știu”. Iar tu, când înveți, rezolvi de azi problemele tale de mai târziu." },
            { emoji: "🚒", cine: "Pompierul", corect: "Arde o casă și oamenii sunt în pericol.", expl: "O problemă urgentă și periculoasă. Toți plătim pentru ea prin taxe (bani pe care oamenii îi dau statului), chiar dacă sperăm să n-avem nevoie de pompieri." },
            { emoji: "🚌", cine: "Șoferul de autobuz", corect: "Elevii stau departe de școală și nu pot merge pe jos.", expl: "Fără el, fiecare familie ar trebui să-și rezolve singură drumul. El îl rezolvă pentru zeci de elevi deodată." },
            { emoji: "🔧", cine: "Instalatorul", corect: "S-a spart o țeavă și apa curge prin casă.", expl: "O problemă urgentă, pe care puțini oameni știu s-o rezolve. De aceea un instalator bun e căutat." },
            { emoji: "💻", cine: "Programatorul", corect: "O firmă vrea o aplicație prin care clienții să comande de pe telefon.", expl: "Firma are o problemă: clienții vor să comande ușor. Programatorul o rezolvă scriind cod, iar firma îl plătește pentru asta.", nu: ["Creatorul de jocuri", "Influencerul"] },
            { emoji: "🚜", cine: "Fermierul", corect: "Orașele au nevoie de legume, lapte și carne, dar acolo nu sunt câmpuri.", expl: "Fermierul rezolvă una dintre cele mai vechi probleme ale oamenilor: hrana. Până și brutarul are nevoie de grâul lui.", nu: ["Brutarul"] },
            { emoji: "🎮", cine: "Creatorul de jocuri", corect: "Oamenii se plictisesc și vor să se distreze.", expl: "Și distracția e o problemă rezolvată: plictiseala. Despre asta vorbim în Partea 6, la plăceri." },
            { emoji: "🎥", cine: "Influencerul", corect: "O firmă vrea ca mii de tineri să afle de produsul ei.", expl: "Influencerul nu e plătit pentru că e celebru. E plătit pentru că rezolvă o problemă a firmelor: cum să afle de produsul lor cât mai mulți oameni. Ce vinde el firmei e atenția celor care îl urmăresc, deci și atenția ta. Mai vorbim despre asta în Partea 6.", nu: ["Programatorul", "Creatorul de jocuri"] },
            { emoji: "💇", cine: "Frizerul", corect: "Ți-a crescut părul și nu te poți tunde singur frumos.", expl: "O problemă mică, dar a multor oameni, în fiecare lună. Din multe probleme mici se poate face o meserie întreagă." },
            { emoji: "🌉", cine: "Inginerul de poduri", corect: "Un râu taie drumul dintre două sate.", expl: "Un pod rezolvă o problemă pentru mii de oameni, ani la rând. Ca să-l construiască, inginerul a învățat multă matematică și fizică." },
            { emoji: "⚖️", cine: "Avocatul", corect: "Doi oameni se ceartă pe un teren și nu știu ce spune legea.", expl: "Avocatul cunoaște legile și îi ajută pe oameni să-și rezolve certurile după lege, nu după cine strigă mai tare." }
          ] },
        { tip: "intrebari", items: [
            { text: "De ce primește brutarul bani?", opts: ["Pentru că se trezește foarte devreme.", "Pentru că rezolvă foamea multor oameni.", "Pentru că așa e legea."], ok: 1,
              expl: "Banii sunt, într-un fel, un „mulțumesc” pentru o problemă rezolvată. Trezitul devreme e problema pe care și-a ales-o el, ca s-o rezolve pe a ta." },
            { text: "Când cumperi un sandviș, ce faci de fapt?", opts: ["Plătesc pe cineva să-mi rezolve foamea.", "Pierd bani, fără să primesc ceva de valoare.", "Îi fac un cadou vânzătorului, din bunătate."], ok: 0,
              expl: "Banii tăi plătesc munca altcuiva. Iar banii din casă vin, de obicei, tot din probleme rezolvate. Vin din munca celor mari din familie sau din pensia bunicilor, câștigată cu ani de muncă. Chiar și alocația copiilor vine din munca tuturor, prin taxe." },
            { text: "De obicei, cine câștigă mai mulți bani?", opts: ["Cine rezolvă probleme grele sau ale multor oameni.", "Cine muncește cele mai multe ore, orice muncă ar face.", "Cine se laudă cel mai mult cu munca lui."], ok: 0,
              expl: "De obicei, contează cât de grea e problema și pentru câți oameni o rezolvi. Dar contează și norocul: locul unde te-ai născut, banii familiei, școala de lângă casă. Unele munci foarte importante, ca a asistentelor medicale, nu sunt plătite cât merită. Iar mulți oameni muncesc multe ore, greu și cinstit, pe bani puțini. Munca lor nu valorează mai puțin." },
            { text: "Ce legătură are asta cu școala?", opts: ["Niciuna: la serviciu nu te întreabă nimeni de școală.", "Te antrenează să rezolvi probleme tot mai grele.", "Școala e doar pentru note și pentru diplome."], ok: 1,
              expl: "Fiecare lucru pe care îl înveți e o unealtă în plus. O vei folosi mai târziu, la problemele tale și la ale oamenilor pentru care vei lucra." },
            { text: "Primăria are bani fie pentru un teren de sport nou, fie pentru repararea școlii. Ce înseamnă asta?", opts: ["Că primăria e rea și nu-i pasă deloc de copii.", "Că banii nu ajung la tot: orice alegere costă ceva.", "Că până la urmă se pot face amândouă gratis."], ok: 1,
              expl: "Și primăriile, și firmele, și familiile au aceeași problemă ca tine la cele două invitații: nu pot avea totul deodată. Orice alegere costă ceva." },
            { text: "Dimineața, înainte de ore, e mereu coadă mare la magazinul de lângă școală. Cum gândește cineva care vrea să pornească o afacere?", opts: ["„Nu e treaba mea, eu doar îmi cumpăr covrigul și plec.”", "„Mulți au problema asta. Dacă o rezolv, pot câștiga.”", "„Să se plângă cineva la director, poate face el ceva.”"], ok: 1,
              expl: "Așa pornesc multe afaceri. Cineva vede o problemă pe care o au mulți oameni. Apoi găsește o soluție, de exemplu un chioșc chiar în școală sau comenzi făcute dinainte. Iar oamenii sunt gata să plătească pentru ea." }
          ] }
      ]
    },

    /* ───────────────────────── PARTEA 6 ───────────────────────── */
    {
      id: "p6", emoji: "🍫", titlu: "Plăcerile: soluție sau capcană?",
      rezumat: "Și plăcerea rezolvă o problemă. Dar plăcerea e câștigată sau pe datorie?",
      blocuri: [
        { tip: "text", titlu: "Și plăcerea rezolvă o problemă",
          html: "<p>Și plăcerile? Jocurile, dulciurile, clipurile, filmele…</p><p>Surpriză: <b>și plăcerea rezolvă o problemă</b>. Rezolvă plictiseala, oboseala, tristețea. De aceea există firme uriașe care vând plăcere: jocuri, rețele sociale, dulciuri, filme.</p><p>Plăcerea nu e rea. Dar are un preț. Întrebarea e: plăcerea mea e câștigată sau pe datorie?</p><p>✅ <b>Plăcere câștigată</b>: nu-ți aduce o problemă nouă. Adesea vine după ce ți-ai rezolvat problema aleasă.</p><p>⏳ <b>Plăcere pe datorie</b>: o iei acum, iar problema o plătești mai târziu. Ca la un împrumut de la bancă: dai înapoi mai mult decât ai luat.</p>" },
        { tip: "sortare", cosuri: ["✅ Câștigată", "⏳ Pe datorie"], items: [
            { text: "Joc pe telefon o oră, după ce mi-am făcut temele.", cos: 0, expl: "Temele sunt gata, iar ora de joc nu-ți aduce nicio problemă nouă." },
            { text: "Joc pe telefon până la 2 noaptea, deși mâine am test.", cos: 1, expl: "Plătești mâine: somn puțin și un test mai greu." },
            { text: "Mănânc o felie de tort la ziua mea.", cos: 0, expl: "O bucurie potrivită pentru ziua ta, și nu prea mare." },
            { text: "Mănânc o pungă de dulciuri în loc de prânz.", cos: 1, expl: "Peste o oră îți e iar foame și n-ai energie. Plătești cu burta și cu dinții." },
            { text: "Mă uit la un film cu familia vineri seara.", cos: 0, expl: "E vineri, iar a doua zi nu ai școală. Nu se adună nimic pe datorie." },
            { text: "Mă uit la clipuri în loc să învăț pentru test.", cos: 1, expl: "Testul tot vine. Doar că acum te găsește nepregătit." },
            { text: "Ascult muzică după ce am terminat curățenia.", cos: 0, expl: "Cea mai bună pauză e pauza de după o treabă terminată." },
            { text: "Îmi cumpăr ceva ce-mi place, cu banii pe care i-am strâns.", cos: 0, expl: "Ai ales întâi problema economisirii. Acum te bucuri de ce ai strâns." },
            { text: "Îmi cumpăr ceva ce-mi place, cu banii primiți pentru rechizite.", cos: 1, expl: "Rechizitele tot trebuie cumpărate. Problema s-a mutat la părinți sau la tine, peste o săptămână." },
            { text: "Ies cu prietenii după școală, la fotbal sau la o plimbare.", cos: 0, expl: "Mișcare, prieteni, aer: plăcere fără datorie." },
            { text: "Copiez tema ca să am mai mult timp de joacă.", cos: 1, expl: "Joaca e pe datorie: la test plătești tot ce n-ai învățat." },
            { text: "Dorm mai mult sâmbătă dimineața, după o săptămână grea.", cos: 0, expl: "Odihna după o săptămână de muncă e câștigată." }
          ] },
        { tip: "text", titlu: "Ai observat?",
          html: "<p>Aceeași plăcere (jocul, mâncarea, clipul) poate fi <b>câștigată</b> sau <b>pe datorie</b>.</p><p>Nu plăcerea e problema. Contează <b>momentul</b> și <b>cât de mult</b>.</p>" },
        { tip: "intrebari", items: [
            { text: "Care e o NEVOIE, nu doar o dorință?", opts: ["Gustarea de la școală, când ți-e foame.", "Niște adidași de firmă, deși ai deja o pereche bună.", "Un costum nou (skin) pentru personajul din joc."], ok: 0,
              expl: "Nevoia e ceva fără de care îți e greu: mâncarea, hainele groase iarna, rechizitele. Dorința e ceva ce ar fi plăcut să ai. Dorințele nu sunt rele, dar banii merg întâi pe nevoi. Pentru o dorință, strângi bani și aștepți." },
            { text: "Primești telefonul pe care ți l-ai dorit mult. Cât crezi că ține bucuria cea mare?", opts: ["Toată viața, dacă ți l-ai dorit cu adevărat.", "Câteva zile sau săptămâni, apoi te obișnuiești.", "Cel puțin un an întreg, cât timp telefonul e nou."], ok: 1,
              expl: "Oamenii se obișnuiesc repede cu lucrurile noi. De aceea plăcerea nu te scapă de probleme pentru totdeauna: după o vreme apare iar „vreau ceva nou”. Nu e vina ta, așa suntem toți." },
            { text: "Ieri telefonul tău mergea bine. Azi vezi o reclamă: „Telefonul tău e vechi și încet! Ia-l pe cel nou!” Ce face reclama?", opts: ["Îmi rezolvă o problemă pe care o aveam deja.", "Mă face să simt o problemă, ca să-mi vândă soluția.", "Doar mă informează, fără să vrea nimic de la mine."], ok: 1,
              expl: "Unele reclame doar te informează. Altele te fac să simți o problemă pe care n-o aveai, ca să-ți vândă soluția. Și influencerii care primesc lucruri „gratis” sunt, de obicei, plătiți așa ca să ți le arate. Întreabă-te: aveam problema asta înainte de reclamă?" },
            { text: "O aplicație e gratuită. Din ce câștigă bani firma care a făcut-o?", opts: ["Din nimic: o face din bunătate, ca să ne ajute.", "Mai ales din reclame și din ce cumperi în ea.", "De la stat."], ok: 1,
              expl: "Când nu plătești cu bani, plătești des cu timpul, cu atenția și cu datele tale: ce cauți, ce-ți place. Și firma are o problemă de rezolvat: cum să te țină cât mai mult în aplicație. De aceea, după un clip vine imediat altul. Iar „diamantele” sau „monedele” din joc se cumpără cu bani adevărați." },
            { text: "Ce mâncare e cea mai gustoasă?", opts: ["Cea pe care o mănânci flămând, după ce ai alergat.", "Cea pe care o mănânci când ești deja sătul.", "E la fel de gustoasă, oricând ai mânca-o."], ok: 0,
              expl: "Foamea face mâncarea mai gustoasă. La fel, multe plăceri mari vin DUPĂ o problemă rezolvată. Golul vine după multe antrenamente. Vacanța vine după un an de școală. Nota mare vine după învățat." },
            { text: "Ce întrebare e bine să-ți pui înainte de o plăcere?", opts: ["„E plăcerea asta rea și trebuie să renunț la ea?”", "„Am câștigat-o sau o iau pe datorie?”", "„Mă vede cineva sau pot s-o fac pe ascuns?”"], ok: 1,
              expl: "Nu trebuie să renunți la plăceri. Doar să știi, de fiecare dată, cine plătește și când." },
            { text: "Ești trist după o zi proastă. Care plăcere e o soluție bună?", opts: ["Să mănânci singur în cameră o pungă mare de dulciuri.", "Să ieși la o plimbare cu cineva sau să suni un prieten.", "Să stai pe telefon până adormi, ca să uiți de tot."], ok: 1,
              expl: "Când ești trist, e bine să te ajuți cu ceva plăcut. Alege ceva care nu-ți aduce mâine o problemă nouă. Iar dacă tristețea nu trece zile la rând, vorbește cu un adult." }
          ] }
      ]
    },

    /* ───────────────────────── PARTEA 7 ───────────────────────── */
    {
      id: "p7", emoji: "🧗", titlu: "Probleme tot mai bune",
      rezumat: "Problemele nu dispar. Devin mai bune. Școala e sala ta de antrenament.",
      blocuri: [
        { tip: "text", titlu: "Atunci care e rostul?",
          html: "<p>Dacă problemele nu dispar niciodată, care e rostul?</p><p>Rostul e să ai <b>probleme tot mai bune</b>. Ca într-un joc: nivelul următor nu e mai ușor, e mai interesant.</p><p>De obicei, cine rezolvă problemele de acum ajunge la probleme mai bune. Cine le ocolește rămâne adesea cu aceleași probleme, doar că tot mai mari.</p><p>Iar dacă rămâi mai mult timp la o problemă din motive care nu țin de tine, asta nu înseamnă că ai ocolit-o.</p><p>Așază treptele în ordine: atinge-le de la prima problemă până la cea mai bună.</p>" },
        { tip: "scara", items: [
            { emoji: "📐", titlu: "La matematică", trepte: ["Nu știu tabla înmulțirii.", "Știu tabla, dar mă încurc la fracții.", "Știu fracțiile, dar ecuațiile mi se par grele.", "Rezolv ecuații și mă încerc la probleme de concurs.", "Le explic colegilor și caut probleme pe care nu le-a rezolvat nimeni din clasă."],
              expl: "Fiecare treaptă are o problemă. Dar problema de sus e mult mai bună decât cea de jos." },
            { emoji: "⚽", titlu: "La fotbal", trepte: ["Nu pot alerga două ture de teren fără să mă opresc.", "Alerg, dar pierd mingea ușor.", "Țin mingea, dar nu știu cui s-o pasez.", "Joc în echipa școlii, iar problema mea e să batem echipa școlii vecine.", "Sunt căpitan, iar problema mea e cum să-i ajut pe cei noi să crească."],
              expl: "Căpitanul are tot probleme. Dar ce probleme!" },
            { emoji: "💰", titlu: "Cu banii", trepte: ["Cheltui tot chiar în ziua în care primesc banii.", "Nu mai cheltui tot deodată, dar nu știu unde mi se duc banii.", "Știu unde mi se duc banii, dar abia reușesc să pun ceva deoparte.", "Mă gândesc cum să câștig mai mult, de exemplu învățând o meserie bună.", "Mă gândesc cum să-i ajut și pe alții cu ce am."],
              expl: "Banii nu scot pe nimeni din probleme. Doar schimbă problemele: de la „unde mi s-au dus banii?” la „pe cine pot ajuta?”. Câți bani are familia ta nu ține de tine. Treptele astea le poți urca oricât de puțini bani ai." },
            { emoji: "🌱", titlu: "Tu, crescând", trepte: ["Nou-născut: nu pot spune că mi-e foame.", "La un an: nu pot ajunge singur la jucărie.", "În clasa a V-a: am multe materii și profesori noi.", "În clasa a VIII-a: ce liceu aleg?", "Adult: ce meserie fac și pe cine ajut cu ea?"],
              expl: "Ți-ai amintit de Partea 1? Viața ta e o scară de probleme. Ai rezolvat deja multe: ai învățat să vorbești, să mergi, să citești. Ai observat? În vârful fiecărei scări rezolvi problema altcuiva: a colegilor, a echipei, a celor pe care îi ajuți. Asta face o problemă „mai bună”. Acolo își găsesc mulți oameni rostul." }
          ] },
        { tip: "text", titlu: "Școala, sala ta de antrenament",
          html: "<p>Acum ești în <b>perioada de formare</b>: anii în care te formezi ca om. Școala e ca o sală de antrenament pentru viață.</p><ul><li><b>La școală, problemele au răspuns.</b> Profesorul te poate corecta.</li><li><b>Aici, greșeala costă puțin.</b> Iei o notă mică, înveți, repari. Mai târziu, greșelile costă mai mult.</li><li><b>Mintea crește când te chinui puțin</b>, ca mușchii la antrenament. Dacă exercițiul e greu, înseamnă că mintea lucrează.</li><li><b>Cine fuge acum de tot ce e greu</b> ajunge adult cu „mușchii” slabi.</li></ul>" },
        { tip: "intrebari", items: [
            { text: "Te chinui zece minute cu un exercițiu greu și nu-ți iese. Ce înseamnă?", opts: ["Că nu sunt bun la asta și n-are rost să mai încerc.", "Că mintea mea lucrează. Mai încerc o dată sau cer un mic ajutor.", "Că exercițiul e sigur greșit, dacă nu-mi iese mie."], ok: 1,
              expl: "Chinul ăsta e chiar antrenamentul. Nu e semn că nu poți, e semn că înveți." },
            { text: "Care elev se pregătește mai bine pentru viață?", opts: ["Cel care alege mereu doar ce e ușor, ca să nu greșească.", "Cel care alege ce e puțin mai greu și se și odihnește.", "Cel care lucrează fără oprire, fără nicio pauză."], ok: 1,
              expl: "Nici prea ușor, nici fără oprire. Probleme puțin peste puterea de azi, plus odihnă: așa crești." }
          ] },
        { tip: "fisa" }
      ]
    },

    /* ───────────────────────── PARTEA 8 ───────────────────────── */
    {
      id: "p8", emoji: "🏅", titlu: "Testul final",
      rezumat: "10 situații: unele noi, altele cunoscute. Folosește tot ce ai aflat și ia-ți insigna.",
      blocuri: [
        { tip: "text", titlu: "Zece situații",
          html: "<p>Zece situații: unele noi, altele pe care le recunoști de mai devreme. Folosește tot ce ai aflat până acum.</p>" },
        { tip: "intrebari", items: [
            { text: "Andrei nu vrea să meargă la dentist, deși îl doare puțin un dinte. Ce îl așteaptă, de fapt?", opts: ["Nicio problemă, dacă durerea trece singură în câteva zile.", "O problemă mai mare, mai târziu.", "O problemă mai mică decât vizita la dentist."], ok: 1,
              expl: "Amânarea nu-l scapă de dentist. Doar face vizita de mai târziu mai grea (bulgărele de zăpadă)." },
            { text: "Care dintre ei n-are probleme: un bebeluș, un elev sau un împărat?", opts: ["Bebelușul: alții au grijă de tot ce-i trebuie.", "Împăratul: are putere, bani și palate.", "Niciunul. Fiecare are problemele lui."], ok: 2,
              expl: "Nimeni nu e scutit: nici bebelușul de o zi, nici împăratul." },
            { text: "Maria vede pe internet doar poze din vacanțele colegilor și crede că numai viața ei e grea. Ce nu înțelege?", opts: ["Că la ceilalți vede doar vârful aisbergului.", "Că ea chiar are cea mai grea viață.", "Că și ea ar fi fericită dacă ar pleca în vacanțe ca ei."], ok: 0,
              expl: "Maria compară toată viața ei cu cele mai bune momente ale altora." },
            { text: "Bunica lui Mihai e bolnavă. Mihai e trist și crede că e vina lui. Ce i-ai spune?", opts: ["„E problema ta și a familiei tale, descurcă-te singur.”", "„Nu e vina ta. Poți s-o suni și să vorbești cu cineva despre ce simți.”", "„Toată lumea are probleme, așa că nu te mai plânge atâta.”"], ok: 1,
              expl: "Faptul că toți au probleme nu înseamnă că a lui nu contează. Înseamnă că nu e singur." },
            { text: "De ce primește bani un instalator?", opts: ["Pentru că rezolvă problema altcuiva.", "Pentru că muncește greu, cu mâinile, ore întregi.", "Pentru că are o diplomă și o firmă."], ok: 0,
              expl: "Economia înseamnă oameni care rezolvă probleme pentru alți oameni." },
            { text: "Sofia primește luni banii de buzunar pentru toată săptămâna, din care își cumpără și gustarea de la școală. Îi cheltuie pe toți chiar în prima zi, pe dulciuri. Plăcerea ei e:", opts: ["Câștigată.", "Pe datorie."], ok: 1,
              expl: "De marți până vineri, Sofiei tot îi va fi foame în pauză, dar n-o să mai aibă bani. Plăcerea de luni o plătește restul săptămânii." },
            { text: "Ai uitat să-ți faci tema, iar profesoara te întreabă unde e. Ce problemă e mai mică?", opts: ["Să spui adevărul: „Am uitat. O fac și v-o arăt mâine.”", "Să spui că ai făcut-o, dar că ai uitat caietul acasă, pe birou."], ok: 0,
              expl: "Adevărul costă puțin și se termină repede. Minciuna trebuie apoi păzită. Mâine tot trebuie să aduci tema. Iar dacă se află, pierzi și încrederea profesoarei. Încrederea se repară greu." },
            { text: "Vlad e foarte obosit în seara dinaintea concursului. Ce problemă e bine să aleagă?", opts: ["Să învețe toată noaptea, ca să recupereze.", "Să doarmă și să repete puțin dimineața.", "Să nu mai meargă la concurs."], ok: 1,
              expl: "Să alegi bine nu înseamnă să alegi mereu varianta cea mai grea. Somnul e și el o problemă aleasă, și una deșteaptă." },
            { text: "Dacă problemele nu dispar niciodată, care e scopul?", opts: ["Să scap de toate problemele.", "Să am probleme tot mai bune.", "Să le ocolesc pe cât se poate."], ok: 1,
              expl: "Ca într-un joc: nivelul următor nu e mai ușor, e mai interesant." },
            { text: "Matei bea ultimul pahar de lapte și pune cutia goală înapoi în frigider, fără să spună nimănui. A cui problemă devine?", opts: ["A nimănui: laptele s-a terminat oricum.", "A celui care găsește dimineață cutia goală.", "A magazinului."], ok: 1,
              expl: "Lui Matei i-ar fi luat un minut să arunce cutia și să spună „s-a terminat laptele”. Acum altcineva are o dimineață fără lapte: o problemă pe care n-a ales-o. O problemă nerezolvată nu dispare, se mută la altcineva." }
          ] }
      ]
    }
  ],

  legi: [
    "Toată lumea are probleme. Nimeni nu e scutit: nici bebelușul, nici împăratul.",
    "La alții vezi doar vârful aisbergului. La tine îl vezi pe tot.",
    "Nu alegi DACĂ ai probleme. Alegi, de multe ori, CARE.",
    "Dacă nu alegi tu, te alege o problemă: de obicei mai târziu și mai urâtă.",
    "Problemele amânate cresc. Iar problema ta nerezolvată ajunge la altcineva.",
    "Unele probleme nu le alegi. Atunci alegi ce faci cu ele și ceri ajutor. Nu e vina ta.",
    "Să alegi bine nu înseamnă mereu varianta cea mai grea. Și orice alegere costă ceva.",
    "Economia înseamnă oameni care rezolvă probleme pentru alți oameni.",
    "Și plăcerea e o soluție. Întreabă-te: e câștigată sau pe datorie?",
    "Scopul nu e o viață fără probleme, ci probleme tot mai bune."
  ]
};
