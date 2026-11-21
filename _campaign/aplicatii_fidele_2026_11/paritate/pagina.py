"""pagina.py — pagina pentru profesor (R5): ce pot face elevii în simulatoarele lecțiilor de pe proba și ce are biblioteca.

  python pagina.py [--iesire <fișier.html>]
Citește paritate.json (din uneste.py), <eticheta>.json (pentru „doar afișate”) și verificare_rezultat.json (dacă există).
Scrie paritate.html (fără <html>/<head>/<body>: pagina de Artifact) și paritate_local.html (cu schelet, de deschis local).
Ultima linie: numărul de funcții puse în pagină.
"""
from __future__ import annotations

import argparse
import html
import json
from pathlib import Path

P = Path(__file__).resolve().parent
ETICHETE = ["word", "excel-a", "excel-b", "powerpoint", "explorer-windows", "paint"]
NUME = {"windows": "Windows", "explorer": "File Explorer", "word": "Word", "excel": "Excel",
        "powerpoint": "PowerPoint", "paint": "Paint"}
ORDINE = ["word", "excel", "powerpoint", "explorer", "windows", "paint"]

CSS = """
:root{--bg:#f6f7f9;--panel:#ffffff;--fg:#1c2330;--muted:#5b6576;--line:#dde2ea;--accent:#2f5bd3;
--nu:#b42318;--nu-bg:#fde8e6;--pa:#9a5b00;--pa-bg:#fdf1dc;--da:#1f7a3d;--da-bg:#e3f4e8;
--f-text:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif;--f-head:"Space Grotesk","Inter",system-ui,sans-serif;
--f-mono:ui-monospace,"Cascadia Mono",Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12161d;--panel:#1a2029;--fg:#e6e9ef;--muted:#9aa4b5;
--line:#2b3340;--accent:#7f9cf0;--nu:#ff8a7a;--nu-bg:#3a1f1c;--pa:#f0b65a;--pa-bg:#3a2c15;--da:#6fd394;--da-bg:#173023;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#12161d;--panel:#1a2029;--fg:#e6e9ef;--muted:#9aa4b5;--line:#2b3340;--accent:#7f9cf0;
--nu:#ff8a7a;--nu-bg:#3a1f1c;--pa:#f0b65a;--pa-bg:#3a2c15;--da:#6fd394;--da-bg:#173023;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--f-text);font-size:15px;line-height:1.5;
padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:24px 48px}
.zid{max-width:1180px;margin:0 auto;display:grid;gap:20px}
h1,h2,h3{font-family:var(--f-head);text-wrap:balance;margin:0}
h1{font-size:1.7rem;letter-spacing:-.01em}
.sub{color:var(--muted);max-width:70ch;margin:6px 0 0}
.sumar{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.app{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px 14px;display:grid;gap:6px;
cursor:pointer;text-align:left;font:inherit;color:inherit}
.app[aria-pressed="true"]{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 35%,transparent)}
.app:focus-visible,.chip:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.app h3{font-size:1.05rem}
.bara{display:flex;height:8px;border-radius:4px;overflow:hidden;background:var(--line)}
.bara i{display:block}
.cifre{display:flex;gap:10px;flex-wrap:wrap;font-size:.85rem;font-variant-numeric:tabular-nums;color:var(--muted)}
.cifre b{color:var(--fg)}
.alarma{font-size:.82rem;color:var(--nu)}
.unelte{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.chip{border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:999px;padding:5px 12px;font:inherit;font-size:.88rem;cursor:pointer}
.chip[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--panel)}
input[type=search]{flex:1 1 220px;min-width:0;border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:8px;padding:6px 10px;font:inherit}
label.cb{display:flex;gap:6px;align-items:center;font-size:.9rem}
.tabel{overflow-x:auto;background:var(--panel);border:1px solid var(--line);border-radius:10px}
table{border-collapse:collapse;width:100%;min-width:760px;font-size:.9rem}
th,td{padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top;text-align:left}
th{font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);position:sticky;top:0;background:var(--panel)}
tr:last-child td{border-bottom:0}
.pill{display:inline-block;border-radius:999px;padding:1px 9px;font-size:.78rem;font-weight:600;white-space:nowrap}
.NU{color:var(--nu);background:var(--nu-bg)}.PARTIAL{color:var(--pa);background:var(--pa-bg)}.DA{color:var(--da);background:var(--da-bg)}
.ex{font-size:.75rem;color:var(--accent);font-weight:600}
.mic{color:var(--muted);font-size:.82rem}
code{font-family:var(--f-mono);font-size:.78rem;word-break:break-all}
details{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 14px}
summary{cursor:pointer;font-weight:600}
.gol{padding:20px;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
"""

JS = r"""
const D=JSON.parse(document.getElementById('date').textContent);
const ORD={NU:0,PARTIAL:1,DA:2};
let app=D.ordine[0], filtru='lipsa', doarEx=false, cauta='';
try{const s=JSON.parse(localStorage.getItem('paritate')||'{}');if(D.ordine.includes(s.app))app=s.app;if(s.filtru)filtru=s.filtru;doarEx=!!s.doarEx}catch(e){}
const $=s=>document.querySelector(s), esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const VERD={NU:'Lipsește',PARTIAL:'Parțial',DA:'Are'};
function salveaza(){try{localStorage.setItem('paritate',JSON.stringify({app,filtru,doarEx}))}catch(e){}}
function sumar(){
  $('#sumar').innerHTML=D.ordine.map(a=>{const r=D.rezumat[a]||{total:0,DA:0,PARTIAL:0,NU:0,cerute_lipsa:0};const t=r.total||1;
  return `<button class="app" data-app="${a}" aria-pressed="${a===app}"><h3>${esc(D.nume[a]||a)}</h3>
  <div class="bara" aria-hidden="true"><i style="width:${100*r.NU/t}%;background:var(--nu)"></i><i style="width:${100*r.PARTIAL/t}%;background:var(--pa)"></i><i style="width:${100*r.DA/t}%;background:var(--da)"></i></div>
  <div class="cifre"><span><b>${r.total}</b> funcții</span><span>lipsesc <b>${r.NU}</b></span><span>parțial <b>${r.PARTIAL}</b></span><span>are <b>${r.DA}</b></span></div>
  ${r.cerute_lipsa?`<div class="alarma">${r.cerute_lipsa} cerute de exerciții lipsesc sau sunt parțiale</div>`:''}</button>`}).join('');
  document.querySelectorAll('.app').forEach(b=>b.onclick=()=>{app=b.dataset.app;salveaza();randeaza()});
}
function randeaza(){
  sumar();
  document.querySelectorAll('[data-f]').forEach(c=>c.setAttribute('aria-pressed',c.dataset.f===filtru));
  $('#doarEx').checked=doarEx;
  let L=D.functii.filter(f=>f.aplicatie===app);
  if(filtru==='lipsa')L=L.filter(f=>f.biblioteca!=='DA'); else if(filtru!=='toate')L=L.filter(f=>f.biblioteca===filtru);
  if(doarEx)L=L.filter(f=>f.ceruta_de_exercitiu);
  if(cauta){const q=cauta.toLowerCase();L=L.filter(f=>[f.functie,f.gest,f.grup,f.lipsa,f.nota,(f.unde||[]).join(' ')].join(' ').toLowerCase().includes(q))}
  L.sort((a,b)=>(ORD[a.biblioteca]-ORD[b.biblioteca])||((b.ceruta_de_exercitiu?1:0)-(a.ceruta_de_exercitiu?1:0))||String(a.grup).localeCompare(String(b.grup))||String(a.id).localeCompare(String(b.id)));
  $('#titluApp').textContent=(D.nume[app]||app)+' — '+L.length+' funcții afișate';
  $('#corp').innerHTML=L.length?L.map(f=>`<tr><td><span class="pill ${f.biblioteca}">${VERD[f.biblioteca]||f.biblioteca}</span>${f.verificat?`<div class="mic">${f.verificat.cum==='jucat'?'încercat de verificator':'reverificat în cod'}</div>`:''}${f.corectat&&f.corectat.din!==f.biblioteca?`<div class="mic">corectat (era ${VERD[f.corectat.din]||f.corectat.din})</div>`:''}</td>
   <td>${esc(f.functie)}${f.ceruta_de_exercitiu?'<div class="ex">cerută de un exercițiu</div>':''}${f.dublura?'<div class="mic">la fel în jocurile Excel (motor separat); numărată o singură dată</div>':''}<div class="mic">${esc(f.grup)}</div></td>
   <td>${esc(f.gest)}</td><td class="mic">${(f.unde||[]).map(esc).join('<br>')}</td>
   <td>${f.lipsa?esc(f.lipsa):''}${f.lipsa&&f.nota?'<br>':''}${f.nota?`<span class="mic">${esc(f.nota)}</span>`:''}</td></tr>`).join('')
   :'<tr><td colspan="5" class="gol">Nimic pe filtrul ăsta.</td></tr>';
  const da=(D.afisate[app]||[]);
  $('#afisate').hidden=!da.length;
  $('#afisateLista').innerHTML=da.map(g=>`<li><b>${esc(g.grup)}</b>: ${(g.exemple||[]).map(esc).join(', ')}</li>`).join('');
}
document.querySelectorAll('[data-f]').forEach(c=>c.onclick=()=>{filtru=c.dataset.f;salveaza();randeaza()});
$('#doarEx').onchange=e=>{doarEx=e.target.checked;salveaza();randeaza()};
$('#cauta').oninput=e=>{cauta=e.target.value.trim();randeaza()};
randeaza();
"""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire", default=str(P / "paritate.html"))
    a = ap.parse_args()
    d = json.loads((P / "paritate.json").read_text(encoding="utf-8"))
    functii = []
    for fn in d["functii"]:
        ap_ = fn.get("aplicatie") or "?"
        functii.append({k: fn.get(k) for k in ("id", "functie", "grup", "gest", "unde", "ceruta_de_exercitiu",
                                               "biblioteca", "lipsa", "nota", "dublura", "verificat", "corectat")} | {"aplicatie": ap_})
    afisate: dict[str, list] = {}
    for et in ETICHETE:
        f = P / f"{et}.json"
        if f.is_file():
            j = json.loads(f.read_text(encoding="utf-8"))
            for g in j.get("doar_afisate", []):
                ap_ = g.get("aplicatie") or j.get("aplicatie") or et
                if ap_ == "explorer-windows":
                    ap_ = "explorer"
                afisate.setdefault(ap_, []).append({"grup": g.get("grup"), "exemple": g.get("exemple", [])[:12]})
    rez = {}
    for fn in functii:
        r = rez.setdefault(fn["aplicatie"], {"total": 0, "DA": 0, "PARTIAL": 0, "NU": 0, "cerute_lipsa": 0})
        if fn.get("dublura"):
            continue
        r["total"] += 1
        if fn["biblioteca"] in r:
            r[fn["biblioteca"]] += 1
        if fn["ceruta_de_exercitiu"] and fn["biblioteca"] in ("NU", "PARTIAL"):
            r["cerute_lipsa"] += 1
    ordine = [x for x in ORDINE if x in rez] + [x for x in rez if x not in ORDINE]
    verif = ""
    vf = P / "verificare_rezultat.json"
    if vf.is_file():
        v = json.loads(vf.read_text(encoding="utf-8"))
        jucate = sum(1 for x in v if x.get("cum") == "jucat")
        schimbate = sum(1 for f in d["functii"] if f.get("corectat") and f["corectat"]["din"] != f.get("biblioteca"))
        verif = (f"Verificare: alți agenți, fără să vadă verdictele primilor, au refăcut {len(v)} de verdicte și au încercat "
                 f"{jucate} dintre ele direct în biblioteca nouă: un eșantion din fiecare aplicație și, în plus, toate funcțiile "
                 f"Word și PowerPoint trecute „are”. Unde au găsit altceva, verdictul s-a corectat ({schimbate} de corecturi, "
                 f"marcate în tabel). Cât de sigur e un „are” rămas: la Excel, 2 din 31 verificate s-au dovedit doar parțiale; "
                 f"la Explorer și Windows, 3 din 3 au ținut. Un „lipsește” n-a ajuns niciodată „are” la verificare.")
    commit = (P / "proba_src" / "COMMIT.txt").read_text(encoding="utf-8").strip()
    date = {"functii": functii, "rezumat": rez, "ordine": ordine, "nume": NUME, "afisate": afisate}
    tot = sum(r["total"] for r in rez.values())
    lipsa = sum(r["NU"] for r in rez.values())
    par = sum(r["PARTIAL"] for r in rez.values())
    corp = f"""<title>Paritatea simulatoarelor LearningHub</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Space+Grotesk:wght@600&display=swap">
<style>{CSS}</style>
<div class="zid">
<header>
<h1>Ce pot face elevii în lecții și ce are biblioteca nouă</h1>
<p class="sub">Toate funcțiile pe care elevul le poate folosi în simulatoarele lecțiilor și jocurilor publicate pe proba (commit <code>{html.escape(commit)}</code>), comparate cu biblioteca nouă de aplicații. {tot} de funcții: {lipsa} lipsesc din bibliotecă, {par} sunt doar parțial. Alege o aplicație; lista arată întâi ce lipsește și e cerut de exerciții.</p>
{f'<p class="sub">{html.escape(verif)}</p>' if verif else ''}
</header>
<section class="sumar" id="sumar" aria-label="Aplicațiile"></section>
<section class="unelte" aria-label="Filtre">
<button class="chip" data-f="lipsa">Lipsește sau parțial</button><button class="chip" data-f="NU">Doar ce lipsește</button>
<button class="chip" data-f="DA">Ce are</button><button class="chip" data-f="toate">Toate</button>
<label class="cb"><input type="checkbox" id="doarEx"> doar cele cerute de exerciții</label>
<input type="search" id="cauta" placeholder="Caută (ex. sortare, Bold, redenumire)" aria-label="Caută">
</section>
<h2 id="titluApp"></h2>
<div class="tabel"><table><thead><tr><th>Biblioteca nouă</th><th>Funcția</th><th>Cum o face elevul</th><th>Unde</th><th>Ce lipsește / notă</th></tr></thead>
<tbody id="corp"></tbody></table></div>
<details id="afisate" hidden><summary>Butoane care în lecții doar arată un mesaj (nu fac nimic)</summary><ul id="afisateLista"></ul></details>
<p class="mic">Sursa: inventarul din <code>_campaign/aplicatii_fidele_2026_11/paritate/</code>; fiecare funcție are locul din codul vechi și dovada din bibliotecă.</p>
</div>
<script type="application/json" id="date">{json.dumps(date, ensure_ascii=False).replace("</", "<\\/")}</script>
<script>{JS}</script>
"""
    out = Path(a.iesire)
    out.write_text(corp, encoding="utf-8")
    (out.with_name(out.stem + "_local.html")).write_text(
        "<!doctype html><html lang=\"ro\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"></head><body>"
        + corp + "</body></html>", encoding="utf-8")
    print(tot)


if __name__ == "__main__":
    main()
