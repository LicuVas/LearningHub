"""Cât de amestecată e o tragere din recapitulare: pe 200 de trageri reale (fără modul de test), câte unități apar
și cât de des lipsește o unitate. Rulează funcția trage() a motorului, prin pornirea repetată a rundei."""
import collections
import json
import sys
from playwright.sync_api import sync_playwright

slug = sys.argv[1] if len(sys.argv) > 1 else "recapitulare-vii"
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.goto(f"file:///C:/00/Projects/LearningHub/jocuri/{slug}/index.html"); pg.wait_for_timeout(400)
    res = pg.evaluate("""()=>{
      const C=JocMotor.test.config(), out=[]; JocMotor.test.deblocheaza();
      for(let r=0;r<C.nivele.length;r++){
        const Lv=C.nivele[r]; const unitOf=q=>(q.grup||'')||String(q.why.match(/Din „([^”]+)”/)?.[1]||'?');
        let lipsa=0, per=[];
        for(let t=0;t<200;t++){
          document.getElementById('go-home').click();
          document.querySelector(`.lvl[data-l="${r}"]`)?.click();
          const got=new Set(Lv.qs.map(q=>q.grup||'?'));
          per.push(got.size);
        }
        const all=new Set(Lv.bazin.map(q=>q.grup||'?'));
        out.push({runda:Lv.t, unitati_in_bazin:all.size, medie_unitati_pe_tragere:per.reduce((a,b)=>a+b,0)/per.length, trageri_cu_o_singura_unitate:per.filter(x=>x<2).length});
      }
      return out;}""")
    print(slug, json.dumps(res, ensure_ascii=False))
    b.close()
