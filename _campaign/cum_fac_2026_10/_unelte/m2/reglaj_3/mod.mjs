// Variante de încercat pe dicționar, fără să ating _sursa/sensuri.json: banc.mjs --mod nume1,nume2
// Fiecare variantă primește dicționarul (copie) și îl schimbă pe loc.
const scoateNume = (s, app, l) => { const a = s.aplicatii[app]; a.nume = a.nume.filter(x => !l.includes(x)); a.indicii = a.indicii.concat(l); };
const norm = w => String(w).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// înlocuiește intrarea „neacoperite” care conține forma `cheie` cu intrările date (despărțirea gesturilor lipite)
function desparte(s, cheie, bucati) {
  const i = s.neacoperite.findIndex(l => l.some(w => norm(w) === norm(cheie)));
  if (i < 0) throw new Error('nu găsesc intrarea cu ' + cheie);
  s.neacoperite.splice(i, 1, ...bucati);
}
// gesturile din afara materiei, pe CATEGORII GENERALE (alte programe, instalare, conturi, rețele, hardware)
export const CAT = {
  alte_programe: [
    ['google drive', 'onedrive', 'one drive', 'dropbox', 'icloud'],
    ['teams', 'microsoft teams', 'google meet', 'skype', 'ședință online', 'ședința online'],
    ['spotify', 'soundcloud', 'deezer', 'apple music'],
    ['gmail', 'yahoo', 'outlook', 'hotmail'],
    ['chatgpt', 'chat gpt'],
    ['canva', 'photoshop', 'gimp', 'capcut', 'premiere', 'filmora', 'inshot', 'kinemaster', 'movie maker', 'imovie'],
    ['google docs', 'google sheets', 'google slides', 'google forms'],
    ['kahoot', 'wordwall', 'quizizz'],
    ['vlc', 'media player', 'windows media player', 'groove'],
    ['steam', 'epic games', 'play store', 'google play', 'app store', 'microsoft store', 'magazinul microsoft']
  ],
  instalare: [
    ['descarc un program', 'descarc programul', 'descarc o aplicație', 'descarc aplicația', 'descarc aplicații', 'descarc programe']
  ],
  conturi: [
    ['contul meu', 'contul de', 'un cont', 'fac cont', 'fac un cont', 'îmi fac cont', 'creez un cont', 'creez cont', 'contul', 'conturi'],
    ['login', 'log in', 'logare', 'loghez', 'mă loghez', 'sign in', 'autentificare', 'mă autentific', 'delogare', 'deloghez', 'log out', 'ies din cont']
  ],
  retele: [
    ['nu merge internetul', 'internetul nu merge', 'nu am internet', 'nu am net', 'nu merge netul', 'netul nu merge', 'conectez la internet', 'internet lent', 'internetul merge greu'],
    ['router', 'hotspot', 'date mobile', 'cablu de rețea', 'cablul de rețea', 'ethernet', 'rețeaua', 'rețea', 'rețele']
  ],
  hardware: [
    ['imprimanta', 'imprimantă', 'imprimante', 'printer'],
    ['camera web', 'webcam', 'camera nu merge', 'pornesc camera', 'camera laptopului'],
    ['se blochează calculatorul', 's a blocat calculatorul', 'calculatorul s a blocat', 'calculatorul nu pornește', 'nu pornește calculatorul', 'se încinge', 'ecran albastru', 'blue screen'],
    ['scot stickul în siguranță', 'scoatere în siguranță', 'eject', 'safely remove', 'ejectez']
  ]
};
// gesturi ale Windows / Explorer / browser / antivirus care nu sunt în fișe (din meniurile aplicațiilor)
export const WIN = [
  ['golesc coșul', 'golire coș', 'golesc coșul de reciclare', 'empty recycle bin', 'golește coșul', 'goliți coșul'],
  ['proprietăți', 'properties'],
  ['fișiere ascunse', 'foldere ascunse', 'elemente ascunse', 'hidden files'],
  ['comprim', 'comprimare', 'compress', 'arhivez'],
  ['schimb ora', 'setez ora', 'potrivesc ora', 'schimb data'],
  ['mod întunecat', 'dark mode', 'temă întunecată'],
  ['partajez', 'partajare', 'share'],
  ['istoricul browserului', 'istoricul de navigare', 'istoricul din browser', 'șterg istoricul', 'browsing history', 'history'],
  ['favorite', 'la favorite', 'bookmark', 'bookmarks'],
  ['incognito', 'inprivate', 'fereastră privată', 'navigare privată', 'mod privat'],
  ['blochez reclamele', 'blochez reclame', 'adblock', 'ad blocker', 'blocare reclame', 'blochez pop up'],
  ['extensie de browser', 'extensii de browser', 'extensii în browser', 'add on', 'plugin'],
  ['pagina de start', 'home page', 'homepage', 'browser implicit', 'motor de căutare implicit', 'setările browserului', 'setări browser'],
  ['cookie', 'cookies'],
  ['descarc un film', 'descarc filme', 'descarc muzică', 'descarc melodii', 'descarc de pe youtube', 'descarc un video', 'descarc videoclipul'],
  ['firewall', 'paravan de protecție'],
  ['scanare completă', 'scanare rapidă', 'scanez tot calculatorul', 'scanez calculatorul', 'full scan', 'quick scan'],
  ['dezactivez antivirusul', 'opresc antivirusul', 'închid antivirusul', 'dezactivez protecția'],
  ['scot virusul', 'scot virus', 'elimin virusul', 'șterg virusul', 'scap de virus', 'curăț de viruși', 'curăț calculatorul'],
  ['control parental', 'family safety']
];
// aplicatii.audio.neacoperite: editarea audio-video, nepredată în VII/11 (lecția predă doar pornirea, redarea, citirea)
export const AUDIO = [
  ['tai', 'taie', 'tăiat', 'tăiere', 'tai o bucată', 'decupez', 'cut', 'trim', 'split', 'împart', 'separ', 'scot o bucată', 'șterg o bucată', 'șterg o parte'],
  ['efect', 'efecte', 'effect', 'effects', 'ecou', 'echo', 'reverb', 'fade', 'estompare', 'amplific', 'amplificare', 'amplify', 'normalizare', 'zgomot', 'noise', 'schimb vocea', 'voce de robot', 'pitch', 'tempo', 'viteza', 'încetinesc', 'accelerez', 'inversez', 'reverse'],
  ['export', 'exportez', 'exportare', 'salvez ca mp3', 'salvez în mp3', 'salvez ca mp4', 'salvez videoclipul', 'salvez filmul', 'salvez melodia', 'salvez sunetul', 'salvez proiectul', 'convertesc', 'conversie', 'render'],
  ['muzică de fundal', 'muzică peste', 'sunet peste', 'melodie peste', 'coloană sonoră', 'background music'],
  ['adaug text', 'pun text', 'scriu pe video', 'scriu pe film', 'text pe video', 'titlu pe video', 'subtitrare', 'subtitrări', 'subtitle', 'titluri'],
  ['tranziție', 'tranziții', 'transition', 'transitions'],
  ['fac un filmuleț', 'fac un videoclip', 'montaj', 'montez', 'editez', 'editare video', 'adaug clipuri', 'adaug un clip', 'adaug poze']
];
export const MOD = {
  // numele generice ale aplicației web („site”, „pagina de internet”) devin indicii: arată aplicația, dar nu o „numesc”
  web_site: s => scoateNume(s, 'web', ['site', 'situl', 'website', 'web', 'pagina de internet', 'pagini de internet', 'site de internet']),
  web_pagina: s => scoateNume(s, 'web', ['pagina web', 'pagini web']),
  browser_win: s => { s.aplicatii.windows.indicii.push('browser', 'browserul'); },
  browser_nu_web: s => { const a = s.aplicatii.web; a.indicii = a.indicii.filter(x => !['browser', 'browserul'].includes(x)); },
  // intrările „neacoperite” cu gesturi diferite lipite (o fișă care numește una ridica vetoul pentru toate)
  veto_split: s => {
    desparte(s, 'antivirus', [['virus', 'viruși', 'virusi', 'antivirus'], ['actualizare windows', 'update windows', 'actualizez windows', 'windows update']]);
    desparte(s, 'bluetooth', [['wifi', 'wi fi', 'wireless'], ['bluetooth'], ['nu merge internetul', 'conectez la internet']]);
    desparte(s, 'conectez imprimanta', [['conectez imprimanta'], ['conectez la wifi'], ['conectez boxele'], ['conectez căștile', 'conectez casca']]);
    desparte(s, 'parolă', [['parolă', 'parola', 'parole', 'password'], ['protejez', 'protejare', 'criptez']]);
    desparte(s, 'dezinstalez', [['instalez', 'instalare', 'instalează', 'install'], ['dezinstalez', 'dezinstalare', 'uninstall'], ['descarc jocuri', 'descarc un joc']]);
  },
  veto_cat: s => { for (const l of Object.values(CAT)) s.neacoperite.push(...l); },
  veto_win: s => { s.neacoperite.push(...WIN); },
  veto_audio: s => { s.aplicatii.audio.neacoperite = AUDIO.map(l => l.slice()); },
  // „redenumesc folderul”: gestul e acum în materie (windows-redenumire-f2)
  scoate_redenumesc_folder: s => { const i = s.neacoperite.findIndex(l => l[0] === 'redenumesc folderul'); if (i < 0) throw new Error('lipsă'); s.neacoperite.splice(i, 1); },
  // sunetul / filmul sunt CONTEXT în Windows (o melodie descărcată, un fișier video), nu gestul
  win_acopera_sunet: s => { s.aplicatii.windows.acopera = ['sunet', 'video']; },
  // intrarea „sunet” doar cu gesturile (pun / adaug / inserez sunet), fără cuvintele de context
  sunet_gest: s => {
    desparte(s, 'sunet', [['pun sunet', 'pun sunetul', 'adaug sunet', 'inserez sunet', 'pun muzică', 'pun muzica', 'adaug muzică', 'inserez muzică', 'pun o melodie', 'pun melodia', 'pun un cântec', 'să se audă', 'fundal muzical', 'muzică de fundal']]);
    s.aplicatii.audio.acopera = ['pun sunet', 'video'];
  }
};
for (const [k, l] of Object.entries(CAT)) MOD['cat_' + k] = s => { s.neacoperite.push(...l); };
WIN.forEach((l, i) => { MOD['win_' + i] = s => { s.neacoperite.push(l); }; });
AUDIO.forEach((l, i) => { MOD['audio_' + i] = s => { (s.aplicatii.audio.neacoperite = s.aplicatii.audio.neacoperite || []).push(l); }; });
const grup = (s, id) => { const g = s.grupuri.find(x => x.id === id); if (!g) throw new Error('lipsă grupul ' + id); return g; };
Object.assign(MOD, {
  // „înaintea” (ordine) avea aceeași rădăcină cu „înainte” (butonul Înainte, „pagina de dinainte”)
  inaintea_fix: s => { s.radacini_fixe.push(['înaintea']); },
  // undă = desenul sunetului în Audacity, cu vorbele copiilor
  unda_grup: s => { s.grupuri.push({ id: 'unda', aplicatie: 'audio', cuvinte: ['undă', 'unda', 'undei', 'forma de undă', 'forma undei', 'waveform', 'wave', 'valuri', 'valurile', 'zigzag', 'zigzaguri', 'zigzagurile', 'desenul sunetului', 'graficul sunetului'] }); },
  // panglica (fila / meniu / ribbon) e a programelor Office: în browser „fila” e altceva (tab)
  panglica_office: s => {
    const g = grup(s, 'panglica'), i = s.grupuri.indexOf(g);
    s.grupuri.splice(i, 1, ...['excel', 'word', 'powerpoint'].map(a => ({ id: 'panglica_' + a, aplicatie: a, cuvinte: g.cuvinte.slice() })));
  },
  // „browser” lipea reîncărcarea (refresh, F5) de numele browserului: două sensuri
  browser_split: s => {
    const g = grup(s, 'browser');
    const re = ['reîncarc', 'reîmprospătez', 'refresh', 'f5'];
    g.cuvinte = g.cuvinte.filter(w => !re.includes(w));
    s.grupuri.push({ id: 'reimprospatare', cuvinte: ['reîncarc', 'reîncărcare', 'reîmprospătez', 'reîmprospătare', 'refresh', 'reload', 'f5', 'încarc din nou', 'încarc iar'] });
  }
});
Object.assign(MOD, {
  // umplutura: vorbe care nu spun gestul (demonstrative la plural, „știu”, „zice”, „se cheamă”)
  fill_basic: s => { s.umplutura.push('chestii', 'chestiile', 'chestiilor', 'alea', 'astea', 'ăstea', 'ăia', 'știu', 'stiu', 'știi', 'stii', 'zice', 'zis', 'zicea', 'cheamă', 'cheama', 'eram'); },
  fill_prof: s => { s.umplutura.push('profu', 'profei', 'profului', 'proful', 'profesoarei', 'profesorului', 'doamnei', 'domnului', 'diriginta', 'dirigintele', 'diriga'); },
  fill_coleg: s => { s.umplutura.push('coleg', 'colegul', 'colega', 'colegii', 'colegei', 'colegului', 'colegilor', 'colegele'); },
  // „trecut / trecută” (de dinainte) avea rădăcina „trec” a tranziției din PowerPoint
  trecut_fix: s => { s.radacini_fixe.push(['trecut', 'trecută', 'trecute', 'trecuți', 'trecutul', 'trecuta']); },
  anterior_grup: s => { s.grupuri.push({ id: 'anterior', cuvinte: ['anterior', 'anterioară', 'anterioare', 'precedent', 'precedentă', 'precedente', 'trecut', 'trecută', 'dinainte', 'de dinainte', 'previous'] }); }
});
const intrare = (s, cheie) => { const l = s.neacoperite.find(l => l.some(w => norm(w) === norm(cheie))); if (!l) throw new Error('lipsă intrarea ' + cheie); return l; };
Object.assign(MOD, {
  // al doilea val de categorii, după setul independent C (set_reglor3.json); B rămâne nevăzut
  veto_c: s => {
    s.neacoperite.push(['câștig la', 'să câștig', 'x și 0', 'x si zero', 'x și zero', 'tic tac toe', 'mă joc']);
    intrare(s, 'captură de ecran').push('poză la ecran', 'poză la tot ecranul', 'poză ecranului', 'poza ecranului', 'pozez ecranul', 'fotografiez ecranul', 'captura ecranului');
    intrare(s, 'tapet').push('schimb poza de pe desktop', 'schimb imaginea de pe desktop', 'poza de fundal', 'imaginea de fundal', 'fundalul ecranului');
    intrare(s, 'pin to taskbar').push('fixez pe bara', 'mereu pe bara', 'mereu jos pe bara', 'rămână pe bara', 'pin', 'pin to start', 'fixez în start');
    s.neacoperite.push(['sortez fișierele', 'aranjez fișierele', 'ordonez fișierele', 'cel mai nou primul']);
    s.neacoperite.push(['fără sonor', 'sonorul', 'dezactivez sunetul', 'sunetul filei', 'cântă singură', 'cântă singur', 'se aude singur', 'pornește singur sunetul']);
    s.neacoperite.push(['schimb motorul de căutare', 'motorul implicit', 'caute mereu pe', 'să caute mereu']);
    s.neacoperite.push(['de unde îl iau', 'de unde îl descarc', 'de unde descarc', 'îl pun pe calculator', 'îl pun pe laptop']);
    s.neacoperite.push(['actualizez programul', 'actualizez aplicația', 'actualizez jocul', 'îl actualizez', 'actualizare program', 'versiune nouă', 'versiune veche', 'versiunea nouă', 'versiunea veche', 'fac update', 'dau update', 'update la']);
    intrare(s, 'nu merge mouse').push('mouseul nu', 'mouse nu', 'nu mișcă săgeata', 'săgeata nu se mișcă');
    const ist = s.neacoperite.find(l => l.includes('istoricul browserului')); if (ist) ist.push('istoric', 'istoricul');
    const ps = s.neacoperite.find(l => l.includes('pagina de start')); if (ps) ps.push('pagina principală', 'pagina de pornire', 'să deschidă direct');
    const au = s.aplicatii.audio.neacoperite || [];
    const t0 = au.find(l => l.includes('tai')); if (t0) { const i = t0.indexOf('taie'); if (i >= 0) t0.splice(i, 1); t0.push('tai melodia', 'tai sunetul', 'tai filmul', 'tai clipul'); }
    const tx = au.find(l => l.includes('adaug text')); if (tx) tx.push('text peste', 'scriu un text', 'scriu text', 'pun un text', 'adaug un text');
    au.push(['fac mai tare', 'îl fac mai tare', 'o fac mai tare', 'dau mai tare', 'măresc volumul', 'mai tare sunetul', 'sunetul mai tare', 'fac mai încet', 'dau mai încet', 'prea încet', 'prea tare']);
    s.aplicatii.audio.neacoperite = au;
  }
});
Object.assign(MOD, {
  // aplicatii.web.neacoperite: ce NU predau lecțiile de HTML (imagini, legături, liste, tabele, culori, butoane)
  veto_web: s => {
    s.aplicatii.web.neacoperite = [
      ['poză', 'poza', 'poze', 'pozele', 'imagine', 'imagini', 'img', 'fotografie', 'picture', 'image'],
      ['link', 'linkul', 'legătură', 'legătura', 'hyperlink', 'a href', 'href'],
      ['listă', 'lista', 'liste', 'buline', 'marcatori', 'listă numerotată'],
      ['tabel', 'tabelul', 'tabele'],
      ['culoare', 'culoarea', 'culori', 'colorez', 'color', 'css', 'stil', 'fundal', 'fundalul', 'background', 'font', 'fontul', 'îngroșat', 'bold', 'italic', 'subliniat', 'centrat', 'centrez'],
      ['buton', 'butonul', 'butoane', 'formular', 'input', 'casetă de text']
    ];
  },
  // formele de copil ale unor gesturi deja în listă (COUNTIF, îmbinarea de corespondență)
  veto_s2: s => {
    intrare(s, 'countif').push('număr câți', 'număr câte', 'numără câți', 'numără câte', 'câți elevi au', 'de câte ori apare', 'să numere câți', 'să numere câte');
    intrare(s, 'mail merge').push('fiecare cu numele lui', 'fiecare cu numele ei', 'cu numele fiecăruia');
  }
});
Object.assign(MOD, {
  // „merge” e mai des „funcționează” (nu merge, merge greu) decât „Merge cells”; rămân expresiile englezești
  merge_fix: s => { const g = grup(s, 'imbinare'); g.cuvinte = g.cuvinte.filter(w => w !== 'merge'); }
});
// lista generată din cunoașterea aplicațiilor (agent care a văzut doar catalogul titlurilor): gesturi_neacoperite.json
// zonele audacity / clipchamp -> aplicatii.audio.neacoperite; restul -> neacoperite (globale). scoase = forme tăiate
// după costul pe formulările în plus (vetocost.mjs)
import fs from 'node:fs';
export const SCOASE = new Set(['blochez calculatorul', 'blocare calculator', 'marcaj', 'atașament', 'classroom', 'google classroom',
  'tema pe classroom', 'whatsapp', 'trimit pe whatsapp', 'driver', 'drivere', 'împerechez', 'proiector', 'videoproiector',
  'calculatorul merge greu', 'import audio', 'importez un sunet', 'silence'].map(norm));
Object.assign(MOD, {
  veto_gen: s => {
    const L = JSON.parse(fs.readFileSync('C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/gesturi_neacoperite.json', 'utf8'));
    for (const g of L) {
      const forme = g.forme.filter(f => !SCOASE.has(norm(f)));
      if (!forme.length) continue;
      if (g.zona === 'audacity' || g.zona === 'clipchamp') (s.aplicatii.audio.neacoperite = s.aplicatii.audio.neacoperite || []).push(forme);
      else s.neacoperite.push(forme);
    }
  }
});
Object.assign(MOD, {
  // pluralul în -ere / -are era tăiat ca infinitivul lung: fișiere -> „fisi”, foldere -> „fold”, numere -> „num”
  // (iar fișierele -> „fisier”): aceeași rădăcină pentru toate formele
  plural_fix: s => {
    s.radacini_fixe.push(
      ['fișier', 'fișierul', 'fișiere', 'fișierele', 'fișierului', 'fișierelor'],
      ['folder', 'folderul', 'foldere', 'folderele', 'folderului', 'folderelor'],
      ['dosar', 'dosarul', 'dosare', 'dosarele', 'dosarului', 'dosarelor'],
      ['număr', 'numărul', 'numere', 'numerele', 'numărului', 'numerelor'],
      ['literă', 'litera', 'litere', 'literele', 'literei', 'literelor'],
      ['caracter', 'caracterul', 'caractere', 'caracterele'],
      ['fereastră', 'fereastra', 'ferestre', 'ferestrele', 'ferestrei', 'ferestrelor'],
      ['culoare', 'culoarea', 'culori', 'culorile', 'culorii', 'culorilor']);
  }
});
Object.assign(MOD, {
  // „site” nu mai arată nicio aplicație: îl spun și cei care navighează (fișele browserului, la Windows), și cei care
  // fac pagini web; rămâne cuvânt de căutat (se aplică DUPĂ web_site)
  site_neutru: s => {
    const l = ['site', 'situl', 'website', 'site de internet'];
    const a = s.aplicatii.web; a.indicii = a.indicii.filter(x => !l.includes(x));
  },
  // browserul: îl spun și elevii de la fișele browserului (Windows)
  browser_neutru: s => { const a = s.aplicatii.web; a.indicii = a.indicii.filter(x => !['browser', 'browserul'].includes(x)); }
});
Object.assign(MOD, {
  // vorbele copiilor pentru subiectele noi (browser, securitate, Audacity, Clipchamp)
  dict_noi: s => {
    grup(s, 'legatura').cuvinte.push('mânuță', 'mânuța', 'mânuțe', 'cuvânt albastru', 'cuvinte albastre', 'text albastru', 'scris albastru', 'albastru subliniat');
    s.grupuri.push(
      { id: 'ghilimele', cuvinte: ['ghilimele', 'ghilimelele', 'quotes', 'virgulițe', 'virgulițele', 'virgulițe sus', 'semnele citării'] },
      { id: 'securitate', cuvinte: ['securitate', 'securitatea', 'protecție', 'protecția', 'pază', 'paza', 'scut', 'scutul', 'apărare', 'windows security', 'microsoft defender', 'defender'] },
      { id: 'moment_audio', aplicatie: 'audio', cuvinte: ['secunda', 'secundă', 'secunde', 'minutul', 'minutele', 'momentul', 'clipa', 'timpul exact'] },
      { id: 'liniste_audio', aplicatie: 'audio', cuvinte: ['liniște', 'liniștea', 'tăcere', 'tăcerea', 'bucăți mute', 'părți mute', 'fără sunet'] },
      { id: 'biblioteca_media', aplicatie: 'audio', cuvinte: ['media library', 'your media', 'biblioteca', 'biblioteca media', 'conținutul meu media', 'fișierele media'] });
  }
});
export function aplica(s, nume) {
  for (const n of nume) { if (!n) continue; if (!MOD[n]) throw new Error('variantă necunoscută: ' + n); MOD[n](s); }
  return s;
}
