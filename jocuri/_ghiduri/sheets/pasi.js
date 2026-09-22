/* GENERAT de _motor\ghid_capturi.py — nu edita de mana.
   Capturile vin de pe un Android emulat; pasii din flux.json. */
JocMotor.ghid("sheets", {
 "app": "Foi de calcul Google",
 "titlu": "Cum faci un tabel cu calcule pe telefon",
 "buton": "Cum fac pe telefon",
 "intro": "<p>Tabelul cu calcule se poate face și de pe telefon. Aplicația <b>Foi de calcul Google</b> face același lucru ca Excel la școală: scrii date în celule, iar formulele socotesc singure.</p><p>Exemplul de aici e cu note și medie, ca să se înțeleagă mecanismul. Pentru tabelul cu plante din provocare faci exact la fel — doar schimbi ce scrii în celule și formula.</p>",
 "pasi": [
  {
   "img": "../_ghiduri/sheets/01-lista.webp",
   "w": 360,
   "h": 800,
   "t": "Deschide aplicația <b>Foi de calcul Google</b>",
   "d": "Butonul <b>+</b> din colțul de jos-dreapta face un registru nou (aplicația îi spune „foaie de calcul”).",
   "alt": "Deschide aplicația Foi de calcul Google — ecranul aplicației Foi de calcul Google"
  },
  {
   "img": "../_ghiduri/sheets/02-grila.webp",
   "w": 360,
   "h": 800,
   "t": "Asta e foaia de calcul",
   "d": "Sus, literele <b>A, B, C, D</b> sunt <b>coloanele</b>. În stânga, cifrele <b>1, 2, 3</b> sunt <b>rândurile</b>. Un pătrățel = o <b>celulă</b>, iar numele ei se citește din literă și cifră: cel din colțul de sus-stânga e <b>A1</b>. Atinge A1 <b>de două ori</b> ca să scrii în el.",
   "alt": "Asta e foaia de calcul — ecranul aplicației Foi de calcul Google"
  },
  {
   "img": "../_ghiduri/sheets/03-cap-tabel.webp",
   "w": 360,
   "h": 800,
   "t": "Scrie capul de tabel",
   "d": "S-a deschis rândul de scris, sub tabel: <i>„Introdu textul sau formula”</i>. Scrie primul cap de coloană, apoi treci în celula din dreapta — pe telefon, cu tasta <b>Tab</b> dacă ai tastatură, sau atingând direct celula următoare.",
   "alt": "Scrie capul de tabel — ecranul aplicației Foi de calcul Google"
  },
  {
   "img": "../_ghiduri/sheets/04-date.webp",
   "w": 360,
   "h": 800,
   "t": "Scrie datele pe al doilea rând",
   "d": "Capul de tabel e gata, pe rândul 1. Acum treci pe rândul 2 și scrie un elev cu notele lui. Numerele se scriu simplu, fără nimic în plus.",
   "atentie": "Numerele se scriu cu <b>cifre</b>, nu cu litere, și fără unități în celulă („8”, nu „8 puncte”). Altfel foaia le ia drept text și nu mai poate socoti cu ele.",
   "alt": "Scrie datele pe al doilea rând — ecranul aplicației Foi de calcul Google"
  },
  {
   "img": "../_ghiduri/sheets/05-formula.webp",
   "w": 360,
   "h": 800,
   "t": "Scrie formula care socotește media",
   "d": "În celula de sub „Media” scrie <b>=(B2+C2)/2</b>. Orice formulă începe cu semnul <b>=</b>. B2 și C2 nu sunt cuvinte, sunt <b>adresele celulelor</b> cu cele două note — foaia se uită acolo și ia ce găsește.",
   "alt": "Scrie formula care socotește media — ecranul aplicației Foi de calcul Google"
  },
  {
   "img": "../_ghiduri/sheets/06-rezultat.webp",
   "w": 360,
   "h": 800,
   "t": "Rezultatul apare singur",
   "d": "În celulă se vede <b>9</b>, nu formula. Asta e toată puterea foii de calcul: dacă schimbi o notă, media se reface singură — n-o mai socotești tu.",
   "alt": "Rezultatul apare singur — ecranul aplicației Foi de calcul Google"
  },
  {
   "img": "../_ghiduri/sheets/07-lateral.webp",
   "w": 360,
   "h": 800,
   "t": "Tabelul e mai lat decât ecranul telefonului",
   "d": "Ai văzut că s-a pierdut coloana cu numele când ai ajuns la „Media”? Pe telefon încap vreo trei coloane odată. <b>Aluneci cu degetul în lateral</b> ca să vezi restul — tabelul e întreg, doar ecranul e mic.",
   "alt": "Tabelul e mai lat decât ecranul telefonului — ecranul aplicației Foi de calcul Google"
  },
  {
   "img": "../_ghiduri/sheets/08-redenumeste.webp",
   "w": 360,
   "h": 800,
   "t": "Pune un nume registrului",
   "d": "Atinge numele de sus („Foaie de calcul fără titlu”) și scrie-l pe al tău — de obicei <b>Nume_Prenume_tema</b>.",
   "alt": "Pune un nume registrului — ecranul aplicației Foi de calcul Google"
  },
  {
   "img": "../_ghiduri/sheets/09-ok.webp",
   "w": 360,
   "h": 800,
   "t": "Confirmă cu OK",
   "d": "Apasă <b>OK</b>. Numele nou apare sus.",
   "alt": "Confirmă cu OK — ecranul aplicației Foi de calcul Google"
  },
  {
   "img": "../_ghiduri/sheets/10-salvat.webp",
   "w": 360,
   "h": 800,
   "t": "Nu există buton de salvare",
   "d": "Sub nume scrie <b>„Modificări salvate”</b>. Registrul stă în contul tău de Google, nu pe telefon — îl deschizi de la școală, de pe calculator, cu același cont. De acolo îl poți salva și ca fișier Excel (<code>.xlsx</code>), dacă profesorul cere așa.",
   "alt": "Nu există buton de salvare — ecranul aplicației Foi de calcul Google"
  },
  {
   "img": "../_ghiduri/sheets/11-gata.webp",
   "w": 360,
   "h": 800,
   "t": "Registrul tău e în listă",
   "d": "Gata. Îl găsești aici oricând, ca să-l continui.",
   "alt": "Registrul tău e în listă — ecranul aplicației Foi de calcul Google"
  }
 ]
});
