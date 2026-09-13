"""Trecerea 2: copilul care greseste la quiz + ce se intampla cu raspunsul salvat pe un calculator comun.
+ masuratori: diacritice, cuvinte, timp de citit."""
import json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

L = Path(r"C:\00\Projects\LearningHub\content\tic\cls6\m1-prezentari\lectia3-text-imagini.html")
D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\P_hibrid\lectia3-text-imagini")
rez = {}

txt = (D / "vede" / "innerText.txt").read_text(encoding="utf-8")
cuv = re.findall(r"[A-Za-z\u0100-\u017F\u0218-\u021B]+", txt)
rez["cuvinte_innerText"] = len(cuv)
rez["caractere_diacritice"] = len(re.findall(r"[ăâîșțşţĂÂÎȘȚŞŢ]", txt))
rez["cuvinte_cu_diacritice"] = sum(1 for w in cuv if re.search(r"[ăâîșțşţĂÂÎȘȚŞŢ]", w))
# cuvinte care in romana corecta cer diacritica (esantion frecvent)
lipsa = ["inveti", "lectiei", "stii", "sa", "si", "in", "caseta", "marime", "imagini", "functie", "atentie", "pasi", "tragi", "apasat", "fata"]
rez["aparitii_fara_diacritice_esantion"] = {w: len(re.findall(r"\b" + w + r"\b", txt)) for w in lipsa}
# cuvintele din atomi (fara exercitii): intre 'Obiectivul lectiei' si 'Exercitii practice'
a = txt.find("Obiectivul lectiei"); b = txt.find("Exercitii practice")
rez["cuvinte_pana_la_exercitii"] = len(re.findall(r"\w+", txt[a:b]))
rez["cuvinte_exercitii_si_final"] = len(re.findall(r"\w+", txt[b:]))

with sync_playwright() as p:
    import tempfile
    br = p.chromium.launch_persistent_context(tempfile.mkdtemp(), viewport={"width": 1366, "height": 768})
    pg = br.new_page()
    pg.goto(L.as_uri()); pg.wait_for_timeout(1500)
    # raspund GRESIT la toate intrebarile din atomul 1
    opts = pg.evaluate("""() => {
        const a = document.querySelector('#atom-1');
        const qs = a.querySelectorAll('.atom-quiz [data-question], .atom-quiz .quiz-question, .atom-quiz .question');
        return a.querySelector('.atom-quiz').innerHTML.slice(0, 1500);
    }""")
    (D / "test" / "atom1_quiz_html.txt").write_text(opts, encoding="utf-8")
    butoane = pg.locator("#atom-1 .atom-quiz button, #atom-1 .atom-quiz .quiz-option, #atom-1 .atom-quiz [data-option]")
    n = butoane.count(); rez["atom1_nr_optiuni_clicabile"] = n
    gresite = []
    data = json.loads(pg.get_attribute("#atom-1", "data-quiz"))
    # gasesc textul corect pentru fiecare intrebare si dau clic pe o optiune cu alt text
    for qi, q in enumerate(data):
        corect = q["options"]["abcd".index(q["correct"])]
        for i in range(n):
            el = butoane.nth(i)
            t = el.inner_text()
            if any(o in t for o in q["options"]) and corect not in t:
                el.click(); gresite.append(t.strip().replace("\n", " ")); break
        pg.wait_for_timeout(500)
    rez["atom1_clicuri_gresite"] = gresite
    rez["atom1_feedback_dupa_gresit"] = pg.locator("#atom-1 .atom-feedback").all_inner_texts()
    nxt = pg.locator("#btnNext, .btn-next, button:has-text('Urmatoarea'), button:has-text('Continua')")
    rez["buton_urmator_gasit"] = nxt.count()
    rez["atom2_clase_dupa_gresit"] = pg.get_attribute("#atom-2", "class")
    rez["text_navigare"] = pg.evaluate("() => (document.querySelector('.atom-nav, .nav-atomi, #atomNav')||{}).innerText || ''")
    pg.screenshot(path=str(D / "test" / "dupa_gresit_atom1.png"), full_page=False)
    # salvez un raspuns la exercitiul 1, apoi "alt elev" deschide pagina pe acelasi calculator
    rez["textarea_vizibil_inainte_de_atomi"] = pg.locator("textarea").first.is_visible()
    print(json.dumps(rez, indent=1, ensure_ascii=False))
    pg.evaluate("""() => { const t=document.querySelector('textarea'); t.value='Raspunsul elevului A din 6A: am facut 5 slide-uri';
        t.dispatchEvent(new Event('input',{bubbles:true}));
        const b=[...document.querySelectorAll('button')].find(x=>x.innerText.includes('Salveaza')); b.click(); }""")
    pg.wait_for_timeout(500)
    rez["localStorage_chei"] = pg.evaluate("() => Object.keys(localStorage)")
    pg.close()
    pg2 = br.new_page()
    pg2.goto(L.as_uri()); pg2.wait_for_timeout(1500)
    rez["elev_B_vede_in_textarea"] = pg2.locator("textarea").first.input_value()
    br.close()

print(json.dumps(rez, indent=1, ensure_ascii=False))
(D / "test" / "t2_rezultat.json").write_text(json.dumps(rez, indent=1, ensure_ascii=False), encoding="utf-8")
