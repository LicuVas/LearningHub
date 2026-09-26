/* cpp.js — ATELIERUL C++ al Misiunii Compilator (26.09.2026): un mic Code::Blocks în pagină.
   Profesorul: „posibilitatea efectivă a exersării - simulare a aplicației adevărate”; „i-ar trebui un mod de testare”.
   Ce face:
     - editor cu numere de rând (Tab = 4 spații, Enter păstrează indentarea, după „{” intră cu 4 spații);
     - Build and run (F9): „compilează” un C++ de clasa a VII-a (int, double, cin, cout, endl, if/else,
       while, do…while, for, % și /, &&, ||, !) și arată erorile ca în Build messages (rândul + mesajul g++,
       cu explicația în română); apoi rulează programul cu datele din caseta „Date de intrare” și arată consola;
     - Pas cu pas (Next line, F7): săgeata pe rândul care urmează, tabelul Watches cu variabilele, puncte de
       oprire (clic pe numărul rândului) și Start / Continue (F8), ca în meniul Debug;
     - TESTE cu nume: programul se rulează pe mai multe seturi de date (verificare pe COMPORTAMENT, nu pe text),
       plus teste pe cod (de ex. „folosești o buclă”);
     - Salvează .cpp: fișierul se deschide în Code::Blocks-ul adevărat.
   Întrebarea: {t:'cpp', q, start, solutie, gresit?, intrare?, fisier?, teste:[{in:'5 3', out:'16', ce?, linii?}],
                cod?:[{re:'regex', ce:'…', msg:'…'}], why, ajutor?}
   Interpretul e și în module.exports (pentru proba cu node). */
(function(root){
'use strict';

/* ======================= 1. ANALIZA LEXICALĂ ======================= */
const KW=new Set(['int','double','float','long','bool','char','void','if','else','while','do','for','return','using','namespace','true','false','break','continue','unsigned','const']);
const OPS=['<<=','>>=','<<','>>','<=','>=','==','!=','&&','||','++','--','+=','-=','*=','/=','%=','::','+','-','*','/','%','<','>','=','!','(',')','{','}',';',',','&','|','?',':','[',']','.'];
function Err(line,msg,ro){return {cErr:true,line,msg,ro:ro||''}}
function lex(src){
  const T=[];let i=0,line=1,bol=true;const n=src.length;
  while(i<n){
    const c=src[i];
    if(c==='\n'){line++;i++;bol=true;continue}
    if(c===' '||c==='\t'||c==='\r'||c==='\u00a0'){i++;continue}
    if(c==='/'&&src[i+1]==='/'){while(i<n&&src[i]!=='\n')i++;continue}
    if(c==='/'&&src[i+1]==='*'){const j=src.indexOf('*/',i+2),end=j<0?n:j+2;for(let k=i;k<end;k++)if(src[k]==='\n')line++;i=end;continue}
    if(c==='#'&&bol){let j=i;while(j<n&&src[j]!=='\n')j++;T.push({k:'pp',v:src.slice(i,j).trim(),line});i=j;continue}
    bol=false;
    if(/[0-9]/.test(c)||(c==='.'&&/[0-9]/.test(src[i+1]||''))){
      const m=/^(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?/.exec(src.slice(i)),s=m[0];
      if(/[A-Za-z_]/.test(src[i+s.length]||'')){const w=/^[A-Za-z_0-9]+/.exec(src.slice(i))[0];
        throw Err(line,`unable to find numeric literal operator 'operator""${w.slice(s.length)}'`,`„${w}” nu e nici număr, nici nume: un nume de variabilă nu poate începe cu o cifră.`)}
      T.push({k:'num',v:parseFloat(s),real:/[.eE]/.test(s),line,s});i+=s.length;continue}
    if(/[A-Za-z_]/.test(c)){const w=/^[A-Za-z_]\w*/.exec(src.slice(i))[0];T.push({k:KW.has(w)?'kw':'id',v:w,line});i+=w.length;continue}
    if(c==='"'||c==="'"){
      let j=i+1,s='';
      while(j<n&&src[j]!==c){
        if(src[j]==='\n')throw Err(line,`missing terminating ${c} character`,'Ghilimelele nu s-au închis pe același rând: textul dintre ghilimele se termină tot cu ".');
        if(src[j]==='\\'){const e=src[j+1];s+=e==='n'?'\n':e==='t'?'\t':e;j+=2}else s+=src[j++]}
      if(j>=n)throw Err(line,`missing terminating ${c} character`,'Ghilimelele nu s-au închis.');
      T.push({k:'str',v:s,line});i=j+1;continue}
    const op=OPS.find(o=>src.startsWith(o,i));
    if(op){T.push({k:'op',v:op,line});i+=op.length;continue}
    const ghilimele='„”“«»'.includes(c);
    throw Err(line,`stray '${c}' in program`,ghilimele?'Ghilimelele din cod sunt cele drepte, de pe tastatură: "text". Ghilimelele românești „ ” nu merg.':
      /[ăâîșțşţĂÂÎȘȚ]/.test(c)?'Literele cu diacritice nu au voie în nume de variabile (doar în textul dintre ghilimele).':'Semnul acesta nu face parte din limbajul C++.');
  }
  T.push({k:'eof',v:'',line});
  return T;
}

/* ======================= 2. ANALIZA SINTACTICĂ (+ tipuri) ======================= */
function parse(src){
  const T=lex(src);let p=0;const warns=[];
  const pk=(o=0)=>T[Math.min(p+o,T.length-1)],nx=()=>T[p++];
  const is=(v,o=0)=>{const t=pk(o);return (t.k==='op'||t.k==='kw')&&t.v===v};
  const desc=t=>t.k==='eof'?'end of input':t.k==='str'?`string constant`:t.k==='num'?'numeric constant':`'${t.v}'`;
  const lastLine=()=>T[Math.max(0,p-1)].line;
  function expect(v,ro){
    if(is(v))return nx();
    const t=pk();
    if(t.k==='eof')throw Err(lastLine(),`expected '${v}' at end of input`,ro||`Lipsește „${v}” la final.`);
    throw Err(t.line,`expected '${v}' before ${desc(t)}`,ro||`Lipsește „${v}”.`);
  }
  const SEMI='Lipsește ; la capătul unei instrucțiuni. Compilatorul observă lipsa abia la ce urmează, deci uită-te și pe rândul DE DINAINTE.';
  // domeniile de vizibilitate: nume -> tip
  const sc=[new Map()];let io=false,stdns=false;
  const find=nm=>{for(let k=sc.length-1;k>=0;k--)if(sc[k].has(nm))return sc[k].get(nm);return null};
  function nedeclarat(t){
    const nm=t.v;
    if(['cin','cout','endl'].includes(nm))return Err(t.line,`'${nm}' was not declared in this scope`,io?'Lipsește rândul using namespace std; de sub #include.':'Lipsește rândul #include <iostream> de la începutul programului.');
    const sim=[...sc].reverse().flatMap(m=>[...m.keys()]).find(k=>k.toLowerCase()===nm.toLowerCase());
    if(sim)return Err(t.line,`'${nm}' was not declared in this scope; did you mean '${sim}'?`,`Ai declarat „${sim}”, iar aici ai scris „${nm}”. Literele mari și mici contează.`);
    if(['cin','cout','endl'].includes(nm.toLowerCase()))return Err(t.line,`'${nm}' was not declared in this scope; did you mean '${nm.toLowerCase()}'?`,`Se scrie cu litere mici: ${nm.toLowerCase()}.`);
    return Err(t.line,`'${nm}' was not declared in this scope`,`Variabila „${nm}” nu a fost declarată (de exemplu int ${nm};) sau numele e scris greșit.`);
  }
  function tipDecl(){
    const t=pk();
    if(t.k!=='kw')return null;
    if(t.v==='const'){nx();return tipDecl()}
    if(t.v==='unsigned'){nx();if(is('int'))nx();else if(is('long')){nx();if(is('long'))nx()}return 'int'}
    if(t.v==='int'){nx();return 'int'}
    if(t.v==='double'||t.v==='float'){nx();return 'double'}
    if(t.v==='long'){nx();if(is('long'))nx();if(is('int'))nx();if(is('double')){nx();return 'double'}return 'int'}
    if(t.v==='bool'){nx();return 'bool'}
    if(t.v==='char'){throw Err(t.line,"'char' is not supported here",'În atelier lucrăm doar cu numere: int și double.')}
    return null;
  }
  // --- expresii ---
  const aritm=(a,b)=>a.ty==='double'||b.ty==='double'?'double':'int';
  function primar(){
    const t=nx();
    if(t.k==='num')return {k:'num',v:t.v,ty:t.real?'double':'int',line:t.line};
    if(t.k==='kw'&&(t.v==='true'||t.v==='false'))return {k:'num',v:t.v==='true'?1:0,ty:'bool',line:t.line};
    if(t.k==='op'&&t.v==='('){const e=expr();expect(')','Lipsește paranteza care se închide: ).');return e}
    if(t.k==='id'){
      const ty=find(t.v);
      if(!ty){if(['cin','cout','endl'].includes(t.v)&&io&&stdns)throw Err(t.line,`invalid use of '${t.v}' here`,`„${t.v}” se folosește doar la citire (cin >>) sau afișare (cout <<), la începutul instrucțiunii.`);throw nedeclarat(t)}
      return {k:'var',name:t.v,ty,line:t.line};
    }
    if(t.k==='str')throw Err(t.line,'string constant used as a number','Textul între ghilimele se poate doar afișa cu cout, nu intră în calcule sau în condiții.');
    if(t.k==='kw')throw Err(t.line,`expected primary-expression before '${t.v}'`,`„${t.v}” e cuvânt-cheie și nu are ce căuta aici.`);
    if(t.k==='eof')throw Err(lastLine(),'expected primary-expression at end of input','Programul se termină în mijlocul unei expresii.');
    throw Err(t.line,`expected primary-expression before '${t.v}'`,'Aici lipsește un număr sau o variabilă.');
  }
  function postfix(){
    const e=primar();
    if((is('++')||is('--'))){const o=nx();if(e.k!=='var')throw Err(o.line,'lvalue required as increment operand','++ și -- merg doar pe o variabilă.');return {k:'post',op:o.v,name:e.name,ty:e.ty,line:o.line}}
    return e;
  }
  function unar(){
    if(is('-')||is('+')||is('!')){const o=nx();const e=unar();return {k:'un',op:o.v,e,ty:o.v==='!'?'bool':(e.ty==='bool'?'int':e.ty),line:o.line}}
    if(is('++')||is('--')){const o=nx();const e=unar();if(e.k!=='var')throw Err(o.line,'lvalue required as increment operand','++ și -- merg doar pe o variabilă.');return {k:'pre',op:o.v,name:e.name,ty:e.ty,line:o.line}}
    return postfix();
  }
  function bin(next,ops){
    return function(){
      let a=next();
      while(ops.some(o=>is(o))){
        const o=nx(),b=next();
        if(o.v==='%'&&(a.ty==='double'||b.ty==='double'))throw Err(o.line,`invalid operands of types '${a.ty}' and '${b.ty}' to binary 'operator%'`,'Restul % se calculează doar între numere întregi (int).');
        const cmp=['<','<=','>','>=','==','!=','&&','||'].includes(o.v);
        a={k:'bin',op:o.v,a,b,ty:cmp?'bool':aritm(a,b),line:o.line};
      }
      return a;
    };
  }
  const mul=bin(unar,['*','/','%']),add=bin(mul,['+','-']),rel=bin(add,['<','<=','>','>=']),eq=bin(rel,['==','!=']),and=bin(eq,['&&']),or=bin(and,['||']);
  function expr(){
    if(is('<<')||is('>>'))throw Err(pk().line,`expected primary-expression before '${pk().v}'`,'Săgețile << și >> merg doar după cout, respectiv cin.');
    const a=or();
    if(['=','+=','-=','*=','/=','%='].some(o=>is(o))){
      const o=nx();
      if(a.k!=='var')throw Err(o.line,'lvalue required as left operand of assignment','În stânga semnului = trebuie să fie o singură variabilă, care primește valoarea.');
      const e=expr();
      if(o.v==='%='&&(a.ty==='double'||e.ty==='double'))throw Err(o.line,"invalid operands to binary 'operator%'",'Restul % se calculează doar între numere întregi (int).');
      return {k:'asg',op:o.v,name:a.name,e,ty:a.ty,line:o.line};
    }
    return a;
  }
  // --- instrucțiuni ---
  function declaratie(ty,line){
    const items=[];
    for(;;){
      const t=pk();
      if(t.k!=='id'){
        if(t.k==='kw')throw Err(t.line,`expected unqualified-id before '${t.v}'`,`„${t.v}” e cuvânt-cheie: are un sens fix în limbaj și nu poate fi nume de variabilă.`);
        if(t.k==='num')throw Err(t.line,'expected unqualified-id before numeric constant','Un nume de variabilă nu poate începe cu o cifră.');
        throw Err(t.line,`expected unqualified-id before ${desc(t)}`,'După tip (int, double) urmează numele variabilei.');
      }
      nx();
      if(sc[sc.length-1].has(t.v))throw Err(t.line,`redeclaration of '${ty} ${t.v}'`,`Variabila „${t.v}” e deja declarată mai sus. O declari o singură dată.`);
      if(pk().k==='id')throw Err(pk().line,`expected initializer before '${pk().v}'`,'Un nume de variabilă nu are spații. Leagă cuvintele cu _ (nota_mea).');
      let init=null;
      if(is('=')){nx();init=expr()}
      sc[sc.length-1].set(t.v,ty);
      items.push({name:t.v,ty,init});
      if(is(',')){nx();continue}
      break;
    }
    return {k:'decl',items,line};
  }
  function instr(){
    const t=pk();
    if(is('{'))return bloc();
    if(is(';')){nx();return {k:'empty',line:t.line}}
    const ty=tipDecl();
    if(ty){const d=declaratie(ty,t.line);expect(';',SEMI);return d}
    if(t.k==='kw'){
      nx();
      if(t.v==='if'){
        expect('(','După if, condiția se scrie între paranteze: if (…).');const c=expr();expect(')','Lipsește paranteza care închide condiția.');
        if(c.k==='asg'&&c.op==='=')warns.push({line:c.line,msg:'suggest parentheses around assignment used as truth value',ro:'În condiție ai scris = (atribuire). Pentru comparare se scrie ==.'});
        if(is(';'))warns.push({line:pk().line,msg:"suggest braces around empty body in an 'if' statement",ro:'După if (…) ai pus ; — asta încheie if-ul. Instrucțiunea de dedesubt se execută mereu.'});
        const a=instr();let b=null;
        if(is('else')){nx();b=instr()}
        return {k:'if',c,a,b,line:t.line};
      }
      if(t.v==='else')throw Err(t.line,"'else' without a previous 'if'",'else trebuie să vină imediat după ramura lui if. Poate ai pus ; după if (…) sau ai uitat acoladele { } la o ramură cu mai multe instrucțiuni.');
      if(t.v==='while'){
        expect('(','După while, condiția se scrie între paranteze.');const c=expr();expect(')','Lipsește paranteza care închide condiția.');
        if(is(';'))warns.push({line:pk().line,msg:"suggest braces around empty body in a 'while' statement",ro:'După while (…) ai pus ; — bucla nu mai are corp.'});
        return {k:'while',c,body:instr(),line:t.line};
      }
      if(t.v==='do'){
        const body=instr();const w=pk();
        if(!is('while'))throw Err(w.line,`expected 'while' before ${desc(w)}`,'După corpul lui do urmează while (condiția);');
        nx();expect('(');const c=expr();expect(')');expect(';','După do … while (…) se pune ;');
        return {k:'do',body,c,line:t.line,lineEnd:w.line};
      }
      if(t.v==='for'){
        expect('(','După for urmează paranteza: for (început; condiție; pas).');
        sc.push(new Map());
        let init=null;
        if(!is(';')){const t2=pk(),ty2=tipDecl();init=ty2?declaratie(ty2,t2.line):{k:'expr',e:expr(),line:t2.line}}
        expect(';','În for, cele trei părți se despart cu ; — for (int i = 1; i <= n; i++).');
        const c=is(';')?null:expr();
        expect(';','În for, cele trei părți se despart cu ; — for (int i = 1; i <= n; i++).');
        const step=is(')')?null:expr();
        expect(')','Lipsește paranteza care închide for (…).');
        if(is(';'))warns.push({line:pk().line,msg:"suggest braces around empty body in a 'for' statement",ro:'După for (…) ai pus ; — bucla nu mai are corp.'});
        const body=instr();sc.pop();
        return {k:'for',init,c,step,body,line:t.line};
      }
      if(t.v==='return'){let e=null;if(!is(';'))e=expr();expect(';',SEMI);return {k:'ret',e,line:t.line}}
      if(t.v==='break'||t.v==='continue'){expect(';',SEMI);return {k:t.v,line:t.line}}
      throw Err(t.line,`expected primary-expression before '${t.v}'`,`„${t.v}” nu poate începe o instrucțiune aici.`);
    }
    if(t.k==='id'&&(t.v==='cin'||t.v==='cout')&&io&&stdns&&!find(t.v)){
      nx();
      if(t.v==='cin'){
        if(is('<<'))throw Err(pk().line,"no match for 'operator<<' (operand types are 'std::istream' and 'int')",'La cin săgețile sunt >> : datele merg de la tastatură ÎN variabilă (cin >> a;).');
        const targets=[];
        if(!is('>>'))throw Err(pk().line,`expected ';' before ${desc(pk())}`,'După cin urmează >> și variabila: cin >> a;');
        while(is('>>')){
          nx();const v=pk();
          if(v.k!=='id'){if(v.k==='num'||v.k==='str')throw Err(v.line,"no match for 'operator>>' (operand types are 'std::istream' and 'const int')",'Cu cin citești într-o VARIABILĂ, nu într-un număr sau text.');throw Err(v.line,`expected primary-expression before ${desc(v)}`,'După >> urmează numele unei variabile.')}
          nx();if(!find(v.v))throw nedeclarat(v);
          if(is('<<'))throw Err(pk().line,"no match for 'operator<<' (operand types are 'std::istream' and 'int')",'La cin toate săgețile sunt >> : cin >> a >> b;');
          targets.push({name:v.v,line:v.line});
        }
        expect(';',SEMI);return {k:'cin',targets,line:t.line};
      }
      if(is('>>'))throw Err(pk().line,"no match for 'operator>>' (operand types are 'std::ostream' and 'int')",'La cout săgețile sunt << : valoarea merge spre ecran (cout << a;).');
      const items=[];
      if(!is('<<'))throw Err(pk().line,`expected ';' before ${desc(pk())}`,'După cout urmează << și ce afișezi: cout << a;');
      while(is('<<')){
        nx();const v=pk();
        if(v.k==='str'){nx();items.push({k:'str',v:v.v})}
        else if(v.k==='id'&&v.v==='endl'&&!find('endl')){nx();items.push({k:'endl'})}
        else items.push(add());
        if(is('>>'))throw Err(pk().line,"no match for 'operator>>' (operand types are 'std::ostream' and 'int')",'La cout toate săgețile sunt << : cout << a << b;');
      }
      expect(';',SEMI);return {k:'cout',items,line:t.line};
    }
    if(t.k==='id'&&!find(t.v))throw nedeclarat(t);
    if(t.k==='eof')throw Err(lastLine(),"expected '}' at end of input",'Lipsește acolada } care închide main (sau un bloc).');
    if(t.k==='op'&&t.v==='}')throw Err(t.line,"expected primary-expression before '}'",'O acoladă } în plus.');
    const e=expr();expect(';',SEMI);
    return {k:'expr',e,line:t.line};
  }
  function bloc(){
    const o=expect('{');sc.push(new Map());const body=[];
    while(!is('}')){if(pk().k==='eof')throw Err(lastLine(),"expected '}' at end of input",'Lipsește o acoladă } : fiecare { are perechea ei }.');body.push(instr())}
    const c=nx();sc.pop();return {k:'block',body,line:o.line,end:c.line};
  }
  // --- programul ---
  while(pk().k==='pp'){
    const t=nx();
    if(/^#\s*include\s*<\s*iostream\s*>$/.test(t.v))io=true;
    else if(/^#\s*include\s*<[\w.]+>$/.test(t.v)){}
    else if(/^#\s*include/.test(t.v))throw Err(t.line,'#include expects "FILENAME" or <FILENAME>','Biblioteca se scrie între semnele < și > : #include <iostream>');
    else throw Err(t.line,`invalid preprocessing directive ${t.v.split(/\s/)[0]}`,'Rândul cu # trebuie să fie #include <iostream>.');
  }
  if(is('using')){
    const u=nx();
    if(!is('namespace'))throw Err(pk().line,`expected nested-name-specifier before ${desc(pk())}`,'Rândul se scrie: using namespace std;');
    nx();const s=pk();
    if(s.k!=='id'||s.v!=='std')throw Err(s.line,`'${s.v}' is not a namespace-name`,'Rândul se scrie: using namespace std;');
    nx();expect(';','Lipsește ; la finalul rândului using namespace std;');stdns=true;
  }
  const m0=pk();
  if(!(is('int')&&pk(1).k==='id'&&pk(1).v==='main')){
    if(is('int')&&pk(1).k==='id'&&/^main$/i.test(pk(1).v))throw Err(pk(1).line,"undefined reference to 'main'",`Funcția se numește main, cu litere mici (ai scris ${pk(1).v}).`);
    if(m0.k==='eof')throw Err(m0.line,"undefined reference to 'main'",'Lipsește funcția int main() { … }, de unde începe programul.');
    if(m0.k==='pp'||(m0.k==='op'&&m0.v==='#'))throw Err(m0.line,'misplaced #include','Rândurile cu #include stau la începutul programului.');
    if(is('void')&&pk(1).v==='main')throw Err(m0.line,"'::main' must return 'int'",'Se scrie int main(), nu void main().');
    throw Err(m0.line,`expected unqualified-id before ${desc(m0)}`,'După #include și using namespace std; urmează int main().');
  }
  nx();nx();expect('(');expect(')','Se scrie int main() — cu paranteze goale.');
  if(!is('{'))throw Err(pk().line,`expected '{' before ${desc(pk())}`,'Corpul lui main începe cu acolada {.');
  const main=bloc();
  if(pk().k!=='eof'){const t=pk();throw Err(t.line,`expected declaration before ${desc(t)}`,'După acolada care închide main nu mai urmează nimic. Poate ai o acoladă } în plus mai sus.')}
  return {main,warns};
}

/* ======================= 3. RULAREA ======================= */
function fmtD(x){
  if(!isFinite(x))return isNaN(x)?'nan':x>0?'inf':'-inf';
  if(x===0)return '0';
  const s=Number(x.toPrecision(6)),ex=Math.floor(Math.log10(Math.abs(s)));
  if(ex<-5||ex>=6){let m=(s/Math.pow(10,ex)).toPrecision(6).replace(/\.?0+$/,'');return m+'e'+(ex<0?'-':'+')+String(Math.abs(ex)).padStart(2,'0')}
  return String(s);
}
function fmt(ty,v){return ty==='double'?fmtD(v):String(v)}
const GUNOI={int:4200256,double:6.95335e-310,bool:1};
function run(prog,input,opt){
  opt=opt||{};const MAX=opt.max||200000;
  const sc=[];let steps=0,out='',con='';const trace=[];const neinit=new Set();
  const inp=String(input||'');let pos=0,ecou=0,fail=false;
  const look=nm=>{for(let k=sc.length-1;k>=0;k--)if(sc[k].has(nm))return sc[k].get(nm);return null};
  function snap(){const m=new Map();for(const s of sc)for(const [k,v] of s)m.set(k,v.init?fmt(v.ty,v.v):'?');return [...m.entries()]}
  function tick(line){
    if(++steps>MAX)throw {rt:true,bucla:true,line,msg:'Programul nu se mai oprește: o buclă se repetă la nesfârșit, pentru că valoarea din condiție nu se schimbă cum trebuie.'};
    if(trace.length<800)trace.push({line,vars:snap(),con:con.length});
  }
  function ecouPana(k){
    if(k<ecou)return;
    let e=inp.indexOf('\n',k);e=e<0?inp.length:e+1;
    let s=inp.slice(ecou,e);if(!s.endsWith('\n'))s+='\n';con+=s;ecou=e;
  }
  function citeste(ty){
    if(fail)return 0;
    while(pos<inp.length&&/\s/.test(inp[pos]))pos++;
    if(pos>=inp.length)return null;
    ecouPana(pos);
    const r=inp.slice(pos),m=ty==='double'?/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(r):/^[+-]?\d+/.exec(r);
    if(!m){fail=true;return 0}
    pos+=m[0].length;return ty==='double'?parseFloat(m[0]):parseInt(m[0],10);
  }
  const conv=(ty,v)=>ty==='double'?v:ty==='bool'?(v?1:0):Math.trunc(v);
  function arit(op,x,y,ty,line){
    if(ty==='double'){switch(op){case '+':return x+y;case '-':return x-y;case '*':return x*y;case '/':return x/y}}
    switch(op){
      case '+':return x+y;case '-':return x-y;case '*':return x*y;
      case '/':case '%':if(y===0)throw {rt:true,line,msg:'Programul s-a oprit: împărțire la 0 între numere întregi.'};return op==='/'?Math.trunc(x/y):x%y;
    }
  }
  function ev(e){
    switch(e.k){
      case 'num':return e.v;
      case 'var':{const c=look(e.name);if(!c.init){neinit.add(e.name);return GUNOI[c.ty]}return c.v}
      case 'asg':{const c=look(e.name);let r=ev(e.e);
        if(e.op!=='='){const cur=c.init?c.v:(neinit.add(e.name),GUNOI[c.ty]);r=arit(e.op[0],cur,r,c.ty==='double'||e.e.ty==='double'?'double':'int',e.line)}
        c.v=conv(c.ty,r);c.init=true;return c.v}
      case 'pre':case 'post':{const c=look(e.name);if(!c.init){neinit.add(e.name);c.v=GUNOI[c.ty];c.init=true}const old=c.v;c.v=conv(c.ty,c.v+(e.op==='++'?1:-1));return e.k==='pre'?c.v:old}
      case 'un':{const v=ev(e.e);return e.op==='-'?-v:e.op==='!'?(v?0:1):v}
      case 'bin':{
        if(e.op==='&&')return ev(e.a)&&ev(e.b)?1:0;
        if(e.op==='||')return ev(e.a)||ev(e.b)?1:0;
        const x=ev(e.a),y=ev(e.b);
        switch(e.op){case '<':return x<y?1:0;case '<=':return x<=y?1:0;case '>':return x>y?1:0;case '>=':return x>=y?1:0;case '==':return x===y?1:0;case '!=':return x!==y?1:0}
        return arit(e.op,x,y,e.ty,e.line);
      }
    }
  }
  function scrie(s){out+=s;con+=s;if(out.length>20000)throw {rt:true,bucla:true,line:0,msg:'Programul afișează fără oprire: o buclă se repetă la nesfârșit, pentru că valoarea din condiție nu se schimbă cum trebuie.'}}
  function ex(s){
    switch(s.k){
      case 'block':sc.push(new Map());try{for(const x of s.body)ex(x)}finally{sc.pop()}return;
      case 'empty':tick(s.line);return;
      case 'decl':tick(s.line);for(const it of s.items){const v=it.init?conv(it.ty,ev(it.init)):undefined;sc[sc.length-1].set(it.name,{ty:it.ty,v,init:!!it.init})}return;
      case 'expr':tick(s.line);ev(s.e);return;
      case 'cin':tick(s.line);
        for(const t of s.targets){const c=look(t.name),v=citeste(c.ty);
          if(v===null)throw {rt:true,astept:true,line:s.line,msg:'Programul așteaptă date de la tastatură (cin), dar nu mai are ce citi. Scrie datele în caseta „Date de intrare”.'};
          c.v=conv(c.ty,v);c.init=true}
        return;
      case 'cout':tick(s.line);
        for(const it of s.items){if(it.k==='str')scrie(it.v);else if(it.k==='endl')scrie('\n');else scrie(fmt(it.ty,ev(it)))}
        return;
      case 'if':tick(s.line);if(ev(s.c))ex(s.a);else if(s.b)ex(s.b);return;
      case 'while':for(;;){tick(s.line);if(!ev(s.c))break;try{ex(s.body)}catch(z){if(z&&z.brk)break;if(z&&z.cont)continue;throw z}}return;
      case 'do':for(;;){try{ex(s.body)}catch(z){if(z&&z.brk)break;if(!(z&&z.cont))throw z}tick(s.lineEnd);if(!ev(s.c))break}return;
      case 'for':sc.push(new Map());
        try{
          if(s.init){tick(s.line);if(s.init.k==='decl'){for(const it of s.init.items){const v=it.init?conv(it.ty,ev(it.init)):undefined;sc[sc.length-1].set(it.name,{ty:it.ty,v,init:!!it.init})}}else ev(s.init.e)}
          for(;;){tick(s.line);if(s.c&&!ev(s.c))break;
            try{ex(s.body)}catch(z){if(z&&z.brk)break;if(!(z&&z.cont))throw z}
            if(s.step)ev(s.step)}
        }finally{sc.pop()}
        return;
      case 'ret':tick(s.line);throw {ret:true,v:s.e?ev(s.e):0};
      case 'break':tick(s.line);throw {brk:true};
      case 'continue':tick(s.line);throw {cont:true};
    }
  }
  let err=null,cod=0;
  try{ex(prog.main);trace.push({line:prog.main.end,vars:[],con:con.length})}
  catch(z){if(z&&z.ret){cod=z.v;trace.push({line:prog.main.end,vars:snap(),con:con.length})}else if(z&&z.rt)err=z;else throw z}
  return {out,con,trace,err,cod,neinit:[...neinit]};
}
function compile(src){try{return parse(src)}catch(z){if(z&&z.cErr)return {err:z};throw z}}

/* compararea ieșirii: pe „cuvinte” (spațiile și rândurile nu contează) sau pe rânduri (linii:true) */
function laFel(got,exp,linii){
  if(linii){const L=s=>String(s).replace(/\r/g,'').split('\n').map(x=>x.trim().replace(/\s+/g,' ')).filter((x,i,a)=>true).join('\n').replace(/\n+$/,'');return L(got)===L(exp)}
  const W=s=>String(s).trim().split(/\s+/).filter(Boolean).join(' ');
  return W(got)===W(exp);
}
function faraComentarii(src){return String(src).replace(/\/\*[\s\S]*?\*\//g,' ').replace(/\/\/[^\n]*/g,' ').replace(/"(\\.|[^"\\])*"/g,'""')}
/* rulează toate testele sarcinii; întoarce {ok, compErr, rez:[{ok, got, exp, t}], cod:[…]} */
function testeaza(src,Q){
  const c=compile(src);
  const teste=Q.teste||[],cod=Q.cod||[];
  if(c.err)return {ok:false,compErr:c.err,rez:teste.map(t=>({ok:false,t})),cod:cod.map(k=>({ok:false,k}))};
  const rez=teste.map(t=>{const r=run(c,t.in||'');const ok=!r.err&&laFel(r.out,t.out,t.linii);return {ok,t,got:r.out,err:r.err,r}});
  const curat=faraComentarii(src);
  const cr=cod.map(k=>({ok:new RegExp(k.re).test(curat)===!k.nu,k}));
  return {ok:rez.every(x=>x.ok)&&cr.every(x=>x.ok),rez,cod:cr,warns:c.warns};
}

const API={lex,parse,compile,run,fmtD,laFel,testeaza};
if(typeof module!=='undefined'&&module.exports){module.exports=API;return}

/* ======================= 4. INTERFAȚA: un mic Code::Blocks ======================= */
const CSS=`.cb{display:grid;gap:8px;min-width:0}
.cb-bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.cb-bar .btn{font-size:.85rem}
.cb-fis{font-family:var(--fm);font-size:.8rem;padding:3px 10px;border:1px solid var(--line);border-bottom:0;border-radius:6px 6px 0 0;background:var(--paper);color:var(--ink);justify-self:start;margin-bottom:-8px}
.cb-ed{display:flex;border:1px solid var(--line);border-radius:0 8px 8px 8px;overflow:hidden;background:var(--paper);min-width:0}
.cb-nr{flex:none;padding:10px 6px 10px 8px;text-align:right;font-family:var(--fm);font-size:.9rem;line-height:1.5;color:var(--ink2);background:var(--paper2);border-right:1px solid var(--line);user-select:none;white-space:pre;overflow:hidden}
.cb-ta{flex:1;min-width:0;min-height:13em;resize:vertical;border:0;outline:0;font-family:var(--fm);font-size:.9rem;line-height:1.5;padding:10px;background:transparent;color:var(--ink);tab-size:4;white-space:pre;overflow:auto;font-variant-ligatures:none}
.cb-ta:focus-visible{box-shadow:inset 0 0 0 2px var(--accent)}
.cb-in-w{display:grid;gap:3px;font-size:.9rem}
.cb-in{font-family:var(--fm);font-size:.95rem;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);resize:vertical;min-height:2.2em;width:100%;box-sizing:border-box}
.cb-msg{border:1px solid var(--line);border-radius:8px;background:var(--paper);font-family:var(--fm);font-size:.8rem;overflow:auto}
.cb-msg .h{font-family:var(--fb);font-weight:700;font-size:.78rem;padding:4px 8px;background:var(--paper2);border-bottom:1px solid var(--line)}
.cb-msg table{border-collapse:collapse;width:100%}
.cb-msg td{padding:3px 8px;vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere}
.cb-msg td.l{width:3em;white-space:nowrap}
@media (max-width:560px){.cb-msg td.f{display:none}}
.cb-msg tr.e td{color:var(--bad);background:var(--badbg)}
.cb-msg tr.w td{color:#8a5a00}
.cb-msg .ro{font-family:var(--fb);font-size:.88rem;color:var(--ink);padding:5px 8px;border-top:1px dashed var(--line)}
.cb-con{margin:0;background:#0C0C0C;color:#CCCCCC;font-family:Consolas,var(--fm);font-size:.85rem;line-height:1.35;padding:8px 10px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere;min-height:3.5em;max-height:18em;overflow:auto}
.cb-con .tit{display:block;background:#fff;color:#000;margin:-8px -10px 6px;padding:3px 10px;border-radius:8px 8px 0 0;font-family:var(--fb);font-size:.78rem}
.cb-dbg{border:1px solid var(--line);border-radius:8px;background:var(--paper);overflow:hidden}
.cb-dbg .h{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:6px 8px;background:var(--paper2);border-bottom:1px solid var(--line);font-size:.85rem}
.cb-lst{font-family:var(--fm);font-size:.85rem;line-height:1.5;overflow:auto;max-height:20em}
.cb-lst div{display:flex;white-space:pre}
.cb-lst .n{flex:none;width:3.6em;text-align:right;padding-right:6px;color:var(--ink2);cursor:pointer;user-select:none;background:var(--paper2)}
.cb-lst .n::before{content:'';display:inline-block;width:.8em;margin-right:4px}
.cb-lst .bp .n::before{content:'●';color:#D11}
.cb-lst .acum{background:var(--mark);color:var(--markInk)}
.cb-lst .acum .n::after{content:' ▶';color:#B8860B}
.cb-lst code{padding-left:8px;background:none;border:0;color:inherit;font-size:inherit}
.cb-w{border-collapse:collapse;font-family:var(--fm);font-size:.85rem;margin:6px 8px 8px}
.cb-w th,.cb-w td{border:1px solid var(--line);padding:2px 10px;text-align:left}
.cb-w th{background:var(--paper2);font-family:var(--fb)}
.cb-w td.nou{background:var(--sel);font-weight:700}
.cb-teste ol{margin:.3em 0 0;padding-left:1.4em}
.cb-teste li{margin:.25em 0}
.cb-teste li .s{display:inline-block;width:1.3em;font-weight:700}
.cb-teste li.ok .s{color:var(--ok)} .cb-teste li.rau .s{color:var(--bad)}
.cb-teste li .m{display:block;font-size:.88rem;color:var(--bad)}
.cb-teste code{white-space:pre-wrap}`;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const vizibil=s=>String(s).replace(/\n/g,'⏎ ').trim()||'(nimic)';

function render(Q,body,api){
  if(!document.getElementById('tip-cpp-css')){const st=document.createElement('style');st.id='tip-cpp-css';st.textContent=CSS;document.head.appendChild(st)}
  const teste=Q.teste||[],cod=Q.cod||[],fis=Q.fisier||'main.cpp';
  const numeTest=t=>t.ce||`Pentru datele <code>${esc(t.in)}</code>, programul afișează <code>${esc(t.out).replace(/\n/g,'⏎ ')}</code>`;
  body.insertAdjacentHTML('beforeend',`<div class="cb">
    <div class="cb-bar" role="toolbar" aria-label="Comenzile din Code::Blocks">
      <button type="button" class="btn sm cb-run" title="Build → Build and run (F9): compilează și rulează">Build and run (F9)</button>
      <button type="button" class="btn ghost sm cb-pas" title="Debug → Next line (F7): rulezi rând cu rând și vezi variabilele">Pas cu pas (F7)</button>
      <button type="button" class="btn ghost sm cb-desc" title="Descarcă fișierul și deschide-l în Code::Blocks">Salvează ${esc(fis)}</button>
      <button type="button" class="btn ghost sm cb-reset" title="Pune la loc codul de la începutul sarcinii">Codul de la început</button>
    </div>
    <div class="cb-fis">${esc(fis)}</div>
    <div class="cb-ed"><div class="cb-nr" aria-hidden="true">1</div>
      <textarea class="cb-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Codul programului C++ (Tab = indentare)">${esc(Q.start||'')}</textarea></div>
    <p class="hint" style="margin:0"><kbd>Tab</kbd> = 4 spații de indentare, <kbd>Enter</kbd> păstrează alinierea (după <code>{</code> intră singur mai la dreapta). <kbd>F9</kbd> rulează.</p>
    <label class="cb-in-w">Date de intrare (ce ar scrie cineva la tastatură, în consolă):
      <textarea class="cb-in" rows="1" spellcheck="false" autocapitalize="off" autocomplete="off">${esc(Q.intrare||(teste[0]&&teste[0].in)||'')}</textarea></label>
    <div class="cb-msg" hidden aria-live="polite"></div>
    <pre class="cb-con" hidden aria-live="polite"></pre>
    <div class="cb-dbg" hidden></div>
    ${teste.length+cod.length?`<div class="cb-teste"><div class="lbl">Testele sarcinii · <span class="nr">0 din ${teste.length+cod.length} trec</span></div><ol>
      ${cod.map((k,i)=>`<li data-c="${i}"><span class="s">○</span><span>${k.ce}<span class="m" hidden></span></span></li>`).join('')}
      ${teste.map((t,i)=>`<li data-t="${i}"><span class="s">○</span><span>${numeTest(t)}<span class="m" hidden></span></span></li>`).join('')}</ol></div>`:''}
  </div>`);
  const $=s=>body.querySelector(s);
  const ta=$('.cb-ta'),nr=$('.cb-nr'),inb=$('.cb-in'),msg=$('.cb-msg'),con=$('.cb-con'),dbg=$('.cb-dbg');
  let dbgSt=null;
  function numere(){const n=ta.value.split('\n').length;nr.textContent=Array.from({length:n},(_,i)=>i+1).join('\n');nr.scrollTop=ta.scrollTop}
  ta.addEventListener('input',()=>{numere();if(dbgSt)opresteDbg()});
  ta.addEventListener('scroll',()=>{nr.scrollTop=ta.scrollTop});
  ta.addEventListener('keydown',e=>{
    if(e.key==='F9'){e.preventDefault();ruleaza();return}
    if(e.key==='F7'){e.preventDefault();pas();return}
    if(api.done())return;
    const v=ta.value,a=ta.selectionStart,b=ta.selectionEnd,inc=v.lastIndexOf('\n',a-1)+1;
    if(e.key==='Tab'){
      e.preventDefault();
      if(e.shiftKey){const sp=v.slice(inc).match(/^ {1,4}/);if(sp){ta.value=v.slice(0,inc)+v.slice(inc+sp[0].length);ta.selectionStart=ta.selectionEnd=Math.max(inc,a-sp[0].length)}}
      else{ta.value=v.slice(0,a)+'    '+v.slice(b);ta.selectionStart=ta.selectionEnd=a+4}
      ta.dispatchEvent(new Event('input'));
    }else if(e.key==='Enter'&&!e.ctrlKey&&!e.altKey){
      e.preventDefault();
      const linie=v.slice(inc,a),ind=linie.match(/^\s*/)[0],extra=/\{\s*$/.test(linie)?'    ':'';
      ta.value=v.slice(0,a)+'\n'+ind+extra+v.slice(b);ta.selectionStart=ta.selectionEnd=a+1+ind.length+extra.length;
      ta.dispatchEvent(new Event('input'));
    }else if(e.key==='}'){
      const linie=v.slice(inc,a);
      if(/^\s{4,}$/.test(linie)&&a===b){e.preventDefault();ta.value=v.slice(0,a-4)+'}'+v.slice(b);ta.selectionStart=ta.selectionEnd=a-3;ta.dispatchEvent(new Event('input'))}
    }
  });
  function mesaje(c,extra){
    const rows=[];let erori=0,avert=0;
    rows.push(`<tr><td class="f">${esc(fis)}</td><td class="l"></td><td>=== Build file: ${esc(fis)} ===</td></tr>`);
    if(c.err){erori=1;rows.push(`<tr class="e"><td class="f">${esc(fis)}</td><td class="l">${c.err.line}</td><td>error: ${esc(c.err.msg)}</td></tr>`)}
    for(const w of (c.warns||[])){avert++;rows.push(`<tr class="w"><td class="f">${esc(fis)}</td><td class="l">${w.line}</td><td>warning: ${esc(w.msg)}</td></tr>`)}
    rows.push(`<tr${erori?' class="e"':''}><td class="f"></td><td class="l"></td><td>=== Build ${erori?'failed':'finished'}: ${erori} error(s), ${avert} warning(s) ===</td></tr>`);
    const ro=[];
    if(c.err)ro.push(`<b>Rândul ${c.err.line}:</b> ${esc(c.err.ro)}`);
    for(const w of (c.warns||[]))ro.push(`<b>Atenție, rândul ${w.line}:</b> ${esc(w.ro)}`);
    if(extra)ro.push(extra);
    msg.hidden=false;
    msg.innerHTML=`<div class="h">Build messages (mesajele de compilare)</div><table><tbody>${rows.join('')}</tbody></table>${ro.length?`<div class="ro">${ro.join('<br>')}</div>`:''}`;
  }
  function consola(r,final){
    con.hidden=false;
    let t=r.con;
    if(final){
      if(r.err&&r.err.astept)t+=(t&&!t.endsWith('\n')?'\n':'')+'_';
      else if(r.err&&r.err.bucla)t+=(t.length>600?'…':'')+'\n\nProcess terminated with status -1073741510';
      else if(r.err)t+='\nProcess returned -1073741676 (0xC0000094)';
      else t+=`\nProcess returned ${r.cod} (0x${(r.cod>>>0).toString(16).toUpperCase()})   execution time : 0.0${Math.floor(Math.random()*80+10)} s\nPress any key to continue.`;
    }
    if(t.length>4000)t=t.slice(0,1800)+'\n…\n'+t.slice(-1800);
    con.innerHTML=`<span class="tit">${esc(fis.replace(/\.cpp$/,'.exe'))}</span>${esc(t)}`;
  }
  function explicaRulare(r){
    const x=[];
    if(r.err)x.push(`<b>La rulare:</b> ${esc(r.err.msg)}`);
    if(r.neinit.length)x.push(`<b>Atenție:</b> ai folosit ${r.neinit.map(n=>`<code>${esc(n)}</code>`).join(', ')} înainte să primească o valoare, așa că programul a luat „ce era în memorie” (un număr la întâmplare). Dă-i o valoare de pornire, de exemplu <code>int s = 0;</code>.`);
    return x.join('<br>');
  }
  function ruleaza(){
    opresteDbg();
    const c=compile(ta.value);
    if(c.err){mesaje(c);con.hidden=true;return null}
    const r=run(c,inb.value);
    mesaje(c,explicaRulare(r));consola(r,true);
    return r;
  }
  /* ---- depanatorul: Next line (F7), Start / Continue (F8), puncte de oprire ---- */
  function opresteDbg(){dbgSt=null;dbg.hidden=true;dbg.innerHTML=''}
  function pas(){
    if(!dbgSt){
      const c=compile(ta.value);
      if(c.err){mesaje(c);con.hidden=true;return}
      const r=run(c,inb.value,{max:20000});
      mesaje(c,explicaRulare(r));
      dbgSt={r,i:0,bp:new Set(),lines:ta.value.split('\n')};
      dbg.hidden=false;
    }else if(dbgSt.i<dbgSt.r.trace.length-1)dbgSt.i++;
    deseneazaDbg();
  }
  function continua(){
    if(!dbgSt)return;
    const T=dbgSt.r.trace;let i=dbgSt.i+1;
    while(i<T.length-1&&!dbgSt.bp.has(T[i].line))i++;
    dbgSt.i=Math.min(i,T.length-1);deseneazaDbg();
  }
  function deseneazaDbg(){
    const S=dbgSt,T=S.r.trace,ev=T[S.i],prev=S.i?T[S.i-1]:null,gata=S.i>=T.length-1;
    const pv=new Map(prev?prev.vars:[]);
    const w=ev.vars.length?`<table class="cb-w"><thead><tr><th>Watches: variabila</th><th>valoarea</th></tr></thead><tbody>${ev.vars.map(([k,v])=>`<tr><td>${esc(k)}</td><td class="${prev&&pv.get(k)!==v?'nou':''}">${esc(v)}</td></tr>`).join('')}</tbody></table>`:'<p class="hint" style="margin:6px 8px">Nicio variabilă declarată încă.</p>';
    dbg.innerHTML=`<div class="h"><b>Rulare pas cu pas</b> <span class="hint">pasul ${S.i+1} din ${T.length}${gata?' · programul s-a terminat':''}</span>
      <button type="button" class="btn sm cb-next"${gata?' disabled':''}>Next line (F7)</button>
      <button type="button" class="btn ghost sm cb-cont"${gata?' disabled':''} title="Merge până la următorul punct de oprire">Start / Continue (F8)</button>
      <button type="button" class="btn ghost sm cb-stop">Stop debugger</button></div>
      <p class="hint" style="margin:4px 8px 0">Săgeata ▶ arată rândul care urmează să se execute. Atinge numărul unui rând ca să pui sau să scoți un punct de oprire ●.</p>
      <div class="cb-lst">${S.lines.map((l,k)=>`<div class="${k+1===ev.line?'acum ':''}${S.bp.has(k+1)?'bp':''}"><span class="n" data-l="${k+1}">${k+1}</span><code>${esc(l)||' '}</code></div>`).join('')}</div>${w}`;
    dbg.querySelector('.cb-next').onclick=pas;dbg.querySelector('.cb-cont').onclick=continua;dbg.querySelector('.cb-stop').onclick=opresteDbg;
    dbg.querySelectorAll('.cb-lst .n').forEach(x=>x.onclick=()=>{const l=+x.dataset.l;S.bp.has(l)?S.bp.delete(l):S.bp.add(l);deseneazaDbg()});
    const r=Object.assign({},S.r,{con:S.r.con.slice(0,ev.con)});
    consola(r,gata);
    const a=dbg.querySelector('.acum');if(a&&a.scrollIntoView){const L=dbg.querySelector('.cb-lst');L.scrollTop=Math.max(0,a.offsetTop-L.offsetTop-60)}
  }
  body.querySelector('.cb-run').onclick=ruleaza;
  body.querySelector('.cb-pas').onclick=pas;
  body.querySelector('.cb-reset').onclick=()=>{if(api.done())return;ta.value=Q.start||'';ta.dispatchEvent(new Event('input'));msg.hidden=true;con.hidden=true};
  body.querySelector('.cb-desc').onclick=()=>{
    const u=URL.createObjectURL(new Blob([ta.value],{type:'text/plain;charset=utf-8'}));
    const l=document.createElement('a');l.href=u;l.download=fis;document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);
  };
  numere();
  function arataTeste(){
    const R=testeaza(ta.value,Q);let bune=0;
    R.cod.forEach((x,i)=>{const li=body.querySelector(`li[data-c="${i}"]`);if(!li)return;if(x.ok)bune++;li.className=x.ok?'ok':'rau';li.querySelector('.s').textContent=x.ok?'✓':'✗';const m=li.querySelector('.m');m.hidden=x.ok;m.textContent=x.ok?'':(x.k.msg||'')});
    R.rez.forEach((x,i)=>{const li=body.querySelector(`li[data-t="${i}"]`);if(!li)return;if(x.ok)bune++;li.className=x.ok?'ok':'rau';li.querySelector('.s').textContent=x.ok?'✓':'✗';const m=li.querySelector('.m');m.hidden=x.ok;
      m.textContent=x.ok?'':R.compErr?'nu se poate rula: programul nu se compilează':x.err?x.err.msg:`a afișat: ${vizibil(x.got)}`});
    const n=body.querySelector('.cb-teste .nr');if(n)n.textContent=`${bune} din ${R.rez.length+R.cod.length} trec`;
    return R;
  }
  body._arataTeste=arataTeste;
  const nav=api.checkButton(()=>{
    opresteDbg();
    const R=arataTeste();
    if(R.compErr){mesaje({err:R.compErr,warns:[]});con.hidden=true}
    else{const pic=R.rez.find(x=>!x.ok);if(pic){inb.value=pic.t.in||'';const c=compile(ta.value);mesaje(c,explicaRulare(pic.r));consola(pic.r,true)}else{msg.hidden=true;con.hidden=true}}
    if(R.ok){ta.readOnly=true;nav.innerHTML='';api.resolve(true);return}
    let m;
    if(R.compErr)m=`Programul nu se compilează — uită-te în <b>Build messages</b>: rândul ${R.compErr.line}. ${esc(R.compErr.ro)}`;
    else{const pic=R.rez.find(x=>!x.ok),pc=R.cod.find(x=>!x.ok);
      m=pic?`La datele <code>${esc(pic.t.in)}</code> trebuia să afișeze <code>${esc(vizibil(pic.t.out))}</code>, dar a afișat <code>${esc(vizibil(pic.got))}</code>${pic.err?' ('+esc(pic.err.msg)+')':''}. Consola de mai sus arată rularea. Urmărește programul cu <b>Pas cu pas</b> pe aceste date.`
        :`${esc(pc.k.msg||'Un test pe cod nu trece.')}`}
    api.resolve(false,m);
    api.revealButton(()=>{ta.value=Q.solutie;ta.readOnly=true;ta.dispatchEvent(new Event('input'));arataTeste();msg.hidden=true;con.hidden=true;nav.innerHTML='';api.giveUp('un program corect e acum în editor. Rulează-l cu <b>Build and run</b> sau <b>Pas cu pas</b> și compară-l cu al tău, rând cu rând.')});
  },'Rulează testele');
}
function rezolva(Q,body){const ta=body.querySelector('.cb-ta');ta.value=Q.solutie;ta.dispatchEvent(new Event('input',{bubbles:true}))}
function gresit(Q,body){const ta=body.querySelector('.cb-ta');ta.value=Q.gresit!=null?Q.gresit:(Q.start||'');ta.dispatchEvent(new Event('input',{bubbles:true}))}
root.TipCpp={render,rezolva,gresit,API};
})(typeof window!=='undefined'?window:globalThis);
