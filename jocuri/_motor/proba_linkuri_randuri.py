"""ORACOLUL contractului 2026-11-07_linkuri_si_randuri_excel (AI_0\\SECRETARY_V3\\docs\\contracte\\...):
  R1  fiecare link (a[href]) vizibil, în fiecare lecție, la fiecare pas (și în „explică-mi altfel”, și în exerciții),
      are contrast >= 4,5:1 față de fundalul de sub el (urcând prin părinți până la primul fundal plin);
  R2  culoarea de VIZITAT (--link-viz; browserul ascunde :visited de scripturi) are >= 4,5:1 pe aceleași fundaluri;
  R4  fiecare exercițiu Excel pornește cu max(5, N + 1) rânduri (N calculat AICI, separat de tip-excel.js).
  R3  se face comparând două rulări (înainte = situl publicat, după = local): python proba_linkuri_randuri.py --compara A.json B.json

  python proba_linkuri_randuri.py --baza http://127.0.0.1:8765 --tema dark|light [--doar viii/m1-l02,...] [--fara-randuri]
       [--iesire raport.json]
Ultima linie = numărul de abateri (0 = trece)."""
import argparse, json, os, re, sys, time
sys.stdout.reconfigure(encoding="utf-8")
ap = argparse.ArgumentParser()
ap.add_argument("--baza", default="http://127.0.0.1:8765"); ap.add_argument("--tema", default="dark", choices=["dark", "light"])
ap.add_argument("--doar", default=""); ap.add_argument("--fara-randuri", action="store_true"); ap.add_argument("--iesire", default="")
ap.add_argument("--compara", nargs=2, metavar=("INAINTE", "DUPA"))
A = ap.parse_args()
RAD = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PRAG = 4.5

if A.compara:   # R3: linkurile CU clasă proprie își păstrează culoarea
    a, b = (json.load(open(f, encoding="utf-8")) for f in A.compara)
    cheie = lambda L: (L["pagina"], L["loc"], L["cls"], L["text"], L["href"])
    ina = {}
    for L in a["linkuri"]:   # o clasă care NU pune culoare lasă culoarea browserului: aceea nu e „stil propriu” (07.11: .lk, .lic, .lp)
        if L["cls"] and L["culoare"] not in ("#0000ee", "#551a8b"): ina.setdefault(cheie(L), L["culoare"])
    dif, vazute = [], 0
    for L in b["linkuri"]:
        if not L["cls"] or cheie(L) not in ina: continue
        vazute += 1
        if ina[cheie(L)] != L["culoare"]: dif.append(f"{L['pagina']} {L['loc']} .{L['cls']} „{L['text'][:30]}”: {ina[cheie(L)]} -> {L['culoare']}")
    for d in dif[:30]: print("  ABATERE R3", d)
    print(f"  R3: {vazute} linkuri cu clasă comparate, {len(dif)} și-au schimbat culoarea")
    print(len(dif)); sys.exit(0)

from playwright.sync_api import sync_playwright

JS_LINKURI = r"""(loc)=>{
  const P=s=>{const m=String(s).match(/rgba?\(([^)]+)\)/);if(!m)return null;const v=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1}};
  const peste=(f,s)=>({r:f.r*f.a+s.r*(1-f.a),g:f.g*f.a+s.g*(1-f.a),b:f.b*f.a+s.b*(1-f.a),a:1});
  const lum=c=>{const t=[c.r,c.g,c.b].map(x=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)});return 0.2126*t[0]+0.7152*t[1]+0.0722*t[2]};
  const ct=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)};
  const hex=c=>'#'+[c.r,c.g,c.b].map(x=>Math.round(x).toString(16).padStart(2,'0')).join('');
  const viz=P(getComputedStyle(document.body).getPropertyValue('--link-viz').trim().replace(/^#(..)(..)(..)$/,(m,a,b,c)=>`rgb(${parseInt(a,16)},${parseInt(b,16)},${parseInt(c,16)})`));
  const tok=P(getComputedStyle(document.body).getPropertyValue('--link').trim().replace(/^#(..)(..)(..)$/,(m,a,b,c)=>`rgb(${parseInt(a,16)},${parseInt(b,16)},${parseInt(c,16)})`));
  const out=[];
  document.querySelectorAll('a[href]').forEach(a=>{
    const r=a.getBoundingClientRect();if(!a.offsetParent&&getComputedStyle(a).position!=='fixed')return;if(r.width<1||r.height<1)return;
    if(!(a.textContent||'').trim())return;   // linkurile doar cu imagine n-au text de citit
    const st=getComputedStyle(a);if(st.visibility==='hidden'||+st.opacity===0)return;
    const straturi=[];let imagine=false,el=a;
    for(;el;el=el.parentElement){const cs=getComputedStyle(el);if(cs.backgroundImage&&cs.backgroundImage!=='none'&&el!==a)imagine=true;
      const b=P(cs.backgroundColor);if(b&&b.a>0){straturi.push(b);if(b.a>=1)break}}
    let fond={r:255,g:255,b:255,a:1};
    if(straturi.length&&straturi[straturi.length-1].a>=1)fond=straturi.pop();
    for(let i=straturi.length-1;i>=0;i--)fond=peste(straturi[i],fond);
    const c=P(st.color),cc=c.a<1?peste(c,fond):c;
    const cls=(a.getAttribute('class')||'').trim()||(a.id?'#'+a.id:'');
    out.push({loc,cls,text:(a.textContent||'').trim().replace(/\s+/g,' ').slice(0,60),href:a.getAttribute('href').slice(0,80),
      culoare:hex(cc),fond:hex(fond),ct:+ct(cc,fond).toFixed(2),imagine,
      dinTema:!!(tok&&Math.abs(c.r-tok.r)<1&&Math.abs(c.g-tok.g)<1&&Math.abs(c.b-tok.b)<1),
      ctViz:viz?+ct(viz,fond).toFixed(2):null});
  });
  return out}"""

# N separat de tip-excel.js: alt cititor (jetoane), ca o greșeală în randNecesar să nu treacă neobservată
JS_RANDURI = r"""(Q)=>{
  const rand=k=>{const m=/^\$?[A-Z]{1,3}\$?([1-9][0-9]{0,6})$/.exec(String(k));return m?+m[1]:0};
  let n=+Q.rows||0,din='rows';
  const ia=(v,de)=>{if(v>n){n=v;din=de}};
  Object.keys(Q.cells||{}).forEach(k=>ia(rand(k),'date'));
  (Array.isArray(Q.foi)?Q.foi:[]).forEach(f=>Object.keys((f&&f.cells)||{}).forEach(k=>ia(rand(k),'foi')));
  const jet=(s,de)=>{(String(s).match(/[A-Za-z0-9_$]+\(?/g)||[]).forEach(t=>{if(!t.endsWith('('))ia(rand(t),de)})};
  jet(String(Q.q||'').replace(/<kbd>[\s\S]*?<\/kbd>/gi,' ').replace(/<[^>]*>/g,' '),'text');
  ['verifica','start','activa','grafic'].forEach(k=>{if(Q[k]!=null)jet(typeof Q[k]==='string'?Q[k]:JSON.stringify(Q[k]),k)});
  let vechi=Math.max(+Q.rows||8,0);Object.keys(Q.cells||{}).forEach(k=>{vechi=Math.max(vechi,rand(k))});vechi=Math.max(20,vechi);
  const body=document.getElementById('body'),gw=body&&body.querySelector('.gw');
  return {N:n,din,astept:Math.max(5,n+1),are:gw?gw.querySelectorAll('tbody tr').length:null,vechi,q:String(Q.q||'').replace(/<[^>]*>/g,'').slice(0,70)}}"""


def pagini():
    if A.doar: return [x.strip().strip("/") for x in A.doar.split(",") if x.strip()]
    L = []
    for cls in ("v", "vi", "vii", "viii"):
        d = os.path.join(RAD, "lectii", cls)
        for m in sorted(os.listdir(d)):
            if os.path.isfile(os.path.join(d, m, "index.html")): L.append(f"lectii/{cls}/{m}")
    L += ["lectii", "lectii/v", "lectii/vi", "lectii/vii", "lectii/viii"]
    d = os.path.join(RAD, "jocuri")
    for m in sorted(os.listdir(d)):
        if m.startswith("_") or not os.path.isfile(os.path.join(d, m, "index.html")): continue
        if "motor.css" in open(os.path.join(d, m, "index.html"), encoding="utf-8").read(): L.append(f"jocuri/{m}")
    return L


abateri, linkuri, randuri, erori = [], [], [], []
def ab(c, s): abateri.append(f"{c}: {s}"); print("  ABATERE", c, s)
EXCEL = ("excel", "excelx")


def rand_ex(pg, pagina, loc, Q):
    if A.fara_randuri or not isinstance(Q, dict) or Q.get("t") not in EXCEL: return
    pg.wait_for_timeout(250)
    r = pg.evaluate(JS_RANDURI, Q); r.update(pagina=pagina, loc=loc); randuri.append(r)
    if r["are"] != r["astept"]: ab("R4", f"{pagina} {loc}: foaia are {r['are']} rânduri, aștept {r['astept']} (N={r['N']} din {r['din']}) „{r['q']}”")


with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(viewport={"width": 1280, "height": 900}, color_scheme=A.tema, reduced_motion="reduce")
    ctx.route(re.compile(r"https?://(?!127\.0\.0\.1|localhost|proba\.learninghub)"), lambda r: r.abort())   # fonturi / analitică: nu contează aici
    for pagina in pagini():
        pg = ctx.new_page(); er = []
        pg.on("pageerror", lambda e, er=er: er.append(str(e)[:160]))
        try:
            pg.goto(A.baza.rstrip("/") + "/" + pagina + "/", timeout=30000); pg.wait_for_timeout(700)
            b = pg.get_by_role("button", name="Nu, doar vizitez")
            if b.count(): b.first.click(); pg.wait_for_timeout(200)
            linkuri += [dict(L, pagina=pagina) for L in pg.evaluate(JS_LINKURI, "cuprins")]
            are_motor = pg.evaluate("!!(window.JocMotor&&JocMotor.test&&JocMotor.test.config)")
            if are_motor:
                cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?undefined:v))")
                pg.evaluate("JocMotor.test.toateIntrebarile()"); pg.evaluate("JocMotor.test.deblocheaza()")
                pg.evaluate("document.getElementById('go-home')&&document.getElementById('go-home').click()")
                for li, lv in enumerate(cfg.get("nivele") or []):
                    if lv.get("pasi"):
                        pg.click(f'.lvl[data-l="{li}"]'); pg.wait_for_timeout(200)
                        for si, pas in enumerate(lv["pasi"]):
                            pg.evaluate(f"JocMotor.test.pas({si})"); pg.wait_for_timeout(250)
                            loc = f"N{li+1}P{si+1}"
                            if pg.locator("#altfel").count(): pg.click("#altfel"); pg.wait_for_timeout(80)
                            linkuri += [dict(L, pagina=pagina) for L in pg.evaluate(JS_LINKURI, loc)]
                            ex = [e for e in [pas.get("incearca")] + list(pas.get("inca") or []) if e]
                            for ei, Q in enumerate(ex):
                                pg.evaluate(f"JocMotor.test.exercitiu({ei})")
                                rand_ex(pg, pagina, f"{loc}E{ei+1}", Q)
                                linkuri += [dict(L, pagina=pagina) for L in pg.evaluate(JS_LINKURI, f"{loc}E{ei+1}")]
                        if lv.get("atelier"):
                            pg.evaluate("JocMotor.test.atelier()"); pg.wait_for_timeout(250)
                            at = lv["atelier"]; ex = [at] + list(at.get("inca") or [])
                            for ei, Q in enumerate(ex):
                                pg.evaluate(f"JocMotor.test.exercitiu({ei})")
                                rand_ex(pg, pagina, f"N{li+1}A{ei+1}", Q)
                                linkuri += [dict(L, pagina=pagina) for L in pg.evaluate(JS_LINKURI, f"N{li+1}A{ei+1}")]
                        pg.evaluate("document.getElementById('go-home').click()"); pg.wait_for_timeout(150)
                    elif lv.get("qs") and not A.fara_randuri and any(q.get("t") in EXCEL for q in lv["qs"]):
                        pg.click(f'.lvl[data-l="{li}"]'); pg.click("#go"); pg.wait_for_timeout(250)
                        for qi, Q in enumerate(lv["qs"]):
                            rand_ex(pg, pagina, f"N{li+1}Î{qi+1}", Q)
                            pg.evaluate("JocMotor.test.rezolva()")
                            if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count(): pg.click("#chk")
                            if pg.locator("#next").count(): pg.click("#next"); pg.wait_for_timeout(150)
                        pg.evaluate("document.getElementById('go-home').click()"); pg.wait_for_timeout(150)
        except Exception as e:
            erori.append(f"{pagina}: {str(e).splitlines()[0][:200]}")
        if er: erori.append(f"{pagina}: erori JS {er[:2]}")
        pg.close()
        print(f"  {pagina}: {sum(1 for L in linkuri if L['pagina'] == pagina)} linkuri, {sum(1 for r in randuri if r['pagina'] == pagina)} foi", flush=True)
    # R5: foaia de 5 rânduri crește ca în Excel (↓ și Enter pe ultimul rând, „+ rând”, „+ coloană”)
    if not A.fara_randuri and (not A.doar or "lectii/viii/m1-l02" in A.doar):
        pg = ctx.new_page()
        try:
            pg.goto(A.baza.rstrip("/") + "/lectii/viii/m1-l02/"); pg.wait_for_timeout(700)
            b = pg.get_by_role("button", name="Nu, doar vizitez")
            if b.count(): b.first.click(); pg.wait_for_timeout(200)
            pg.evaluate("JocMotor.test.deblocheaza()"); pg.evaluate("document.getElementById('go-home').click()")
            pg.click('.lvl[data-l="0"]'); pg.evaluate("JocMotor.test.pas(1)"); pg.evaluate("JocMotor.test.exercitiu(0)"); pg.wait_for_timeout(300)
            dim = lambda: pg.evaluate("(()=>{const g=document.querySelector('#body .gw');return [g.querySelectorAll('thead th').length-1,g.querySelectorAll('tbody tr').length]})()")
            c0, r0 = dim()
            if r0 != 5: ab("R5", f"exercițiul VIII/2 P2 pornește cu {r0} rânduri, nu 5")
            pg.click("#body .gw td[data-a='A5']"); pg.keyboard.press("ArrowDown"); pg.wait_for_timeout(100)
            if dim()[1] != 6: ab("R5", f"↓ pe ultimul rând: foaia are {dim()[1]} rânduri, nu 6")
            pg.click("#body button[data-cr='rand']"); pg.wait_for_timeout(100)
            if dim()[1] != 7: ab("R5", f"„+ rând”: foaia are {dim()[1]} rânduri, nu 7")
            pg.click("#body .gw td[data-a='A7']"); pg.keyboard.type("x"); pg.keyboard.press("Enter"); pg.wait_for_timeout(100)
            if dim()[1] != 8: ab("R5", f"Enter pe ultimul rând: foaia are {dim()[1]} rânduri, nu 8")
            pg.click("#body button[data-cr='col']"); pg.wait_for_timeout(100)
            if dim()[0] != c0 + 1: ab("R5", f"„+ coloană”: {dim()[0]} coloane, nu {c0 + 1}")
            if not [a for a in abateri if a.startswith("R5")]: print(f"  ok R5: 5 rânduri -> ↓ 6 -> „+ rând” 7 -> Enter 8; „+ coloană” {c0} -> {c0 + 1}")
        except Exception as e:
            ab("R5", f"proba creșterii s-a oprit: {str(e).splitlines()[0][:200]}")
        pg.close()
    br.close()

# R1 / R2
for L in linkuri:
    if L["imagine"]: continue
    if L["ct"] < PRAG: ab("R1", f"{L['pagina']} {L['loc']} „{L['text'][:40]}” {L['culoare']} pe {L['fond']} = {L['ct']}:1{' .' + L['cls'] if L['cls'] else ''}")
    if L["dinTema"] and L["ctViz"] is not None and L["ctViz"] < PRAG: ab("R2", f"{L['pagina']} {L['loc']} „{L['text'][:40]}” vizitat pe {L['fond']} = {L['ctViz']}:1")
for e in erori: ab("ERR", e)
fara = [L for L in linkuri if not L["dinTema"] and not L["cls"]]
print(f"  tema {A.tema}: {len(linkuri)} linkuri ({sum(L['dinTema'] for L in linkuri)} cu culoarea temei, {len(fara)} fără clasă și fără culoarea temei, "
      f"{sum(L['imagine'] for L in linkuri)} pe imagine); {len(randuri)} foi Excel")
if randuri:
    sc = [r for r in randuri if r["are"] is not None and r["vechi"] > r["are"]]
    print(f"  foi: {len(sc)} au acum mai puține rânduri decât înainte (20+); N din text la {sum(r['din'] == 'text' for r in randuri)}")
if A.iesire:
    json.dump({"cand": time.strftime("%Y-%m-%d %H:%M:%S"), "baza": A.baza, "tema": A.tema, "abateri": abateri, "linkuri": linkuri, "randuri": randuri},
              open(A.iesire, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(abateri))
