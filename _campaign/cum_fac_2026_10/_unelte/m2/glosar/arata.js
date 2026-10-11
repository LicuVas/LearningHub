const fs=require("fs");const dir="C:/00/Projects/LearningHub/cum-fac/_sursa/";
for(const fn of ["fise_m2_audio_evaluari.json","fise_m2_windows.json"]){let j=JSON.parse(fs.readFileSync(dir+fn,"utf8"));if(!Array.isArray(j))j=j.fise;
for(const f of j)if(process.argv.slice(2).includes(f.id))console.log(JSON.stringify({id:f.id,pasi:f.pasi,rez:f.rezultat,sursa:f.sursa,termeni:f.termeni},null,1));}
