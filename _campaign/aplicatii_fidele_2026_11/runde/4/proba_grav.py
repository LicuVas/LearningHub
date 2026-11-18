# -*- coding: utf-8 -*-
r"""Proba celor 4 GRAV deschise din runde/3/critic.md (A1, A2, N4, GRAV 3), pe poligon — runda 4, constructorul.

Server static pe worktree, legat de 127.0.0.1, port liber; Chromium headless; ruta abandonează tot ce nu e
127.0.0.1/localhost (regula 24). Gesturi reale: page.keyboard / page.mouse. Citește stare(), ecranul (textul vizibil,
valoarea casetelor), mesajele [data-lh-nesimulat] și window.__lhAplicatieEv. Ce cere fiecare caz vine din referința
înghețată (uia_word.json › lista.*, dialog.save_*, dialog.FileSaveAs; scenarii_real/word-*.json), citată lângă caz.
    python .../runde/4/proba_grav.py [--iesire <fisier.json>]
Ultima linie = numărul de cazuri picate (0 = toate trec). Cod 0 / 1.
"""
import argparse
import functools
import http.server
import json
import os
import sys
import threading
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

WT = os.environ.get("LH_WT") or r"C:/00/Projects/LearningHub_fidel"
D = WT + "/_campaign/aplicatii_fidele_2026_11"
PAUZA = 60

REF = json.load(open(D + "/referinte/uia_word.json", encoding="utf-8"))["suprafete"]


def randuri(cheie):
    out = []

    def umbla(n):
        if n.get("tip") == "ListItem":
            out.append(n.get("eticheta"))
        for c in n.get("copii") or []:
            umbla(c)
    umbla(REF[cheie])
    return out


TIPURI = randuri("lista.FileSaveAs_tip")          # 17 rânduri
MARIMI = randuri("lista.FontSize")                # 16 rânduri
INTREBARE = "Save your changes to this file?"
BUTOANE = ["More options…", "Save", "Don't Save", "Cancel"]   # scenarii_real/word-ctrl-w-nesalvat.json


def real(i):
    return json.load(open(D + "/referinte/scenarii_real/%s.json" % i, encoding="utf-8"))["stare"]


def server():
    class Tacut(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k):
            pass
    # LH_SERVIT = alt dosar servit (o copie a bibliotecii, probată înainte de a atinge worktree-ul); implicit worktree-ul
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=os.environ.get("LH_SERVIT") or WT))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


def doar_local(route):
    if urlparse(route.request.url).hostname in ("127.0.0.1", "localhost"):
        route.continue_()
    else:
        route.abort()


def deschide(pg, cont):
    pg.evaluate("""async c => { window.__lhAplicatieEv && (window.__lhAplicatieEv.length = 0);
        await LH.aplicatii.deschide('word', {continut: c, focus: true}); }""", cont)
    pg.wait_for_timeout(250)


def stare(pg):
    return pg.evaluate("LH.aplicatii.stare('word')")


def taste(pg, *k):
    for x in k:
        pg.keyboard.press(x)
        pg.wait_for_timeout(PAUZA)
    pg.wait_for_timeout(120)


def scrie(pg, t):
    pg.keyboard.type(t, delay=15)
    pg.wait_for_timeout(100)


def mesaje(pg):
    return pg.evaluate("[...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(m => m.getAttribute('data-lh-nesimulat'))")


VIZ = """const viz = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
           return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden'; };"""


def text_vizibil(pg, sel):
    """textul de pe ecran al primului element vizibil care se potrivește (noduri text vizibile + valoarea casetelor)"""
    return pg.evaluate("""s => { %s
        const e = [...document.querySelectorAll(s)].find(viz); if (!e) return null;
        let t = ''; const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) { const p = w.currentNode.parentElement; if (p && viz(p) && !p.closest('[aria-hidden="true"]')) t += w.currentNode.textContent; }
        e.querySelectorAll('input').forEach(i => { if (viz(i)) t += i.value; });
        return t.replace(/\\s+/g, ' ').trim(); }""" % VIZ, sel)


def clic_tinta(pg, t):
    c = pg.evaluate("""t => { const e = LH.aplicatii.element('word', t); if (!e) return null; e.scrollIntoView({block: 'nearest', inline: 'nearest'});
        const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }""", t)
    if not c:
        return False
    pg.mouse.click(c[0], c[1])
    pg.wait_for_timeout(180)
    return True


def clic_sel(pg, sel_js):
    c = pg.evaluate("""() => { %s const e = (%s); if (!e) return null; e.scrollIntoView({block: 'nearest', inline: 'nearest'});
        const r = e.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; }""" % (VIZ, sel_js))
    if not c:
        return False
    pg.mouse.click(c[0], c[1])
    pg.wait_for_timeout(180)
    return True


def tinte_vizibile(pg, prefix):
    """țintele vizibile cu prefixul dat, în ordinea din DOM, FĂRĂ cele din panglică (dalele galeriei de stiluri sunt și ele
    „meniu:Normal”…): rămân rândurile unei liste / unui meniu deschis și restul ferestrei"""
    return pg.evaluate("""p => { %s const r = document.querySelector('[data-lh-aplicatie="word"]'); const o = [];
        r.querySelectorAll('[data-lh-tinta]').forEach(e => { if (e.closest('[data-lh-suprafata^="panglica"]') || !viz(e)) return;
          const t = LH.aplicatii._canon(e); if (t.startsWith(p) && o.indexOf(t) < 0) o.push(t); }); return o; }""" % VIZ, prefix)


def marime_la(st, bucata):
    for b in st.get("formatare_pe_caractere") or []:
        if b.get("text") == bucata:
            return b.get("marime")
    return None


def caz(rez, cheie_caz, ok, **detalii):
    rez.append(dict(caz=cheie_caz, ok=bool(ok), **detalii))
    print(("OK   " if ok else "PICA ") + cheie_caz, flush=True)


CASETA_TIP = ("[...document.querySelectorAll('[data-lh-aplicatie=\"word\"] [data-lh-tip=\"ComboBox\"]')]"
              ".filter(c => /^Save as type/.test(c.getAttribute('data-lh-eticheta') || '')).find(viz)")
SAGEATA_TIP = "(" + CASETA_TIP + " || document).querySelector('[data-lh-tip=\"Button\"]')"
SAGEATA_FONT = ("[...document.querySelectorAll('[data-lh-aplicatie=\"word\"] [data-lh-id-mso=\"FontSize\"] [data-lh-tip=\"Button\"]')].find(viz)")
CASETA_FONT = "document.querySelector('[data-lh-aplicatie=\"word\"] [data-lh-id-mso=\"FontSize\"] input')"


def deschide_lista_tip(pg):
    """clic pe caseta Save as type (camp:tip_fisier, §3); fără ea, pe ▾-ul casetei"""
    return clic_tinta(pg, "camp:tip_fisier") or clic_sel(pg, SAGEATA_TIP)


def valoare_caseta_tip(pg):
    return pg.evaluate("""() => { %s const c = (%s); if (!c) return null; const i = c.querySelector('input');
        return i && viz(i) ? i.value : null; }""" % (VIZ, CASETA_TIP))


def cazuri(pg, rez):
    orar = ["Orar", "Marti: sport"]
    # ================= A1: Save as type arată alegerea; lista = cele 17 rânduri ale referinței
    deschide(pg, {"paragrafe": orar, "cursor": 0})
    taste(pg, "F12")
    deschide_lista_tip(pg)
    lst = [t[6:] for t in tinte_vizibile(pg, "meniu:")]
    caz(rez, "a1_lista_17", lst == TIPURI, vazut=lst, asteptat_nr=len(TIPURI))
    clic_tinta(pg, "meniu:PDF (*.pdf)")
    v = valoare_caseta_tip(pg)
    st = stare(pg)
    caz(rez, "a1_caseta_arata_pdf", v == "PDF (*.pdf)" and st.get("tip_salvare_afisat") == "PDF (*.pdf)",
        caseta=v, tip_salvare_afisat=st.get("tip_salvare_afisat"))
    clic_tinta(pg, "camp:nume_fisier")
    taste(pg, "Control+a")
    scrie(pg, "Orar")
    clic_tinta(pg, "dialog_salvare:Save")
    st = stare(pg)
    r = real("word-salvare-pdf")
    caz(rez, "a1_scenariu_pdf", all(st.get(k) == r[k] for k in r), sim={k: st.get(k) for k in r}, real=r)
    # tastatura: lista deschisă, ↓ de 6 ori de la rândul ales (Word Document), Enter → PDF; caseta arată PDF
    deschide(pg, {"paragrafe": orar, "cursor": 0})
    taste(pg, "F12")
    deschide_lista_tip(pg)
    taste(pg, *(["ArrowDown"] * 6), "Enter")
    v = valoare_caseta_tip(pg)
    st = stare(pg)
    caz(rez, "a1_tastatura_jos_enter", v == "PDF (*.pdf)" and st.get("tip_salvare_afisat") == "PDF (*.pdf)" and not tinte_vizibile(pg, "meniu:"),
        caseta=v, tip=st.get("tip_salvare_afisat"))
    taste(pg, "Escape")

    # ================= A2: bara de adrese, antetele coloanelor, panoul din stânga
    deschide(pg, {"paragrafe": orar, "cursor": 0})
    taste(pg, "F12")
    adr = text_vizibil(pg, "[data-lh-suprafata='dialog.FileSaveAs'] [data-lh-tip='SplitButton'][data-lh-eticheta='Documente']")
    caz(rez, "a2_adresa_documente", adr == "Documente", vazut=adr)
    ante = [text_vizibil(pg, "[data-lh-suprafata='dialog.FileSaveAs'] [data-lh-tip='SplitButton'][data-lh-eticheta='%s']" % x)
            for x in ("Nume", "Data modificării", "Tip", "Dimensiune")]
    caz(rez, "a2_antete", ante == ["Nume", "Data modificării", "Tip", "Dimensiune"], vazut=ante)
    pan = text_vizibil(pg, "[data-lh-suprafata='dialog.FileSaveAs'] [data-lh-eticheta='Panou de navigare']")
    caz(rez, "a2_panou_stanga", bool(pan) and all(x in pan for x in ("Acasă", "Galerie", "Acest PC", "Rețea")), vazut=pan)
    taste(pg, "Escape")

    # ================= N4: Ctrl+W / ✕ pe document modificat (scenarii_real/word-ctrl-w-*.json, word-x-nesalvat-cancel.json)
    for cheie, gest, buton, rid in (("n4_ctrlw_intreaba", "Control+w", None, "word-ctrl-w-nesalvat"),
                                    ("n4_x_cancel", "x", "Cancel", "word-x-nesalvat-cancel"),
                                    ("n4_ctrlw_nu_salva", "Control+w", "Don't Save", "word-ctrl-w-nu-salva")):
        deschide(pg, {"paragrafe": ["Ana are mere"], "cursor": 12})
        scrie(pg, " azi")
        if gest == "x":
            clic_tinta(pg, "bara_titlu:Close")
        else:
            taste(pg, gest)
        intreb = text_vizibil(pg, "[data-lh-aplicatie='word'] [data-lh-dialog-intrebare]")
        if buton:
            clic_tinta(pg, "fereastra:" + buton)
        st = stare(pg)
        r = real(rid)
        ok = all(st.get(k) == r[k] for k in r) and intreb == INTREBARE
        caz(rez, cheie, ok, intrebare_ecran=intreb, sim={k: st.get(k) for k in r}, real=r, mesaje=mesaje(pg))
    # titlul de pe ecran după Don't Save = „Word” (scenarii_real/word-ctrl-w-nu-salva.json › titlu_fereastra)
    tt = text_vizibil(pg, "[data-lh-aplicatie='word'] [data-lh-suprafata='bara_titlu'] [data-lh-tip='Button'][data-lh-tinta^='bara_titlu:']")
    caz(rez, "n4_titlu_word_pe_ecran", tt == "Word", vazut=tt)

    # Ctrl+S pe document nou → „Save this file” (scenarii_real/word-ctrl-s-document-nou.json; uia_word.json › dialog.save_this_file)
    deschide(pg, {"paragrafe": ["Poezia mea", "Toamna vine."], "cursor": 0})
    taste(pg, "Control+s")
    st = stare(pg)
    r = real("word-ctrl-s-document-nou")
    mare = text_vizibil(pg, "[data-lh-aplicatie='word'] [data-lh-dialog-intrebare]")
    btn = [t for t in ("dialog_salvare:Save", "dialog_salvare:Cancel", "fereastra:More options…") if pg.evaluate("t => !!LH.aplicatii.element('word', t)", t)]
    caz(rez, "n4_ctrls_save_this_file", st.get("dialog_salvare") == r["dialog_salvare"] and mare == "Save this file" and len(btn) == 3,
        sim=st.get("dialog_salvare"), real=r["dialog_salvare"], text_mare=mare, butoane=btn)
    clic_tinta(pg, "fereastra:More options…")
    st = stare(pg)
    caz(rez, "n4_more_options_saveas", st.get("pagina_backstage") == "Save As", pagina=st.get("pagina_backstage"))

    # Ctrl+O → pagina Open (scenarii_real/word-ctrl-o.json)
    deschide(pg, {"paragrafe": ["Orar"], "cursor": 0})
    taste(pg, "Control+o")
    st = stare(pg)
    caz(rez, "n4_ctrlo", st.get("pagina_backstage") == "Open", pagina=st.get("pagina_backstage"))

    # lecția m1-l03:212 — document salvat, modificat; Ctrl+W → Save; Ctrl+O → Recent → redeschis (parametri de CONȚINUT)
    orar_a = ["Orarul meu", "Luni: sport"]
    cont = {"paragrafe": orar_a + ["Miercuri: desen"], "cursor": 0, "nume": "Popescu_Ana_7A_orar", "salvat": True, "modificat": True,
            "fisiere": [{"nume": "Popescu_Ana_7A_orar.docx", "text": orar_a},
                        {"nume": "Popescu_Ana_7B_orar.docx", "text": ["Orarul Anei din 7B", "Luni: fizică"]}],
            "recente": [{"nume": "Popescu_Ana_7B_orar.docx"}, {"nume": "Popescu_Ana_7A_orar.docx"}]}
    deschide(pg, cont)
    st0 = stare(pg)
    taste(pg, "Control+w")
    clic_tinta(pg, "fereastra:Save")
    st1 = stare(pg)
    f7a = [f for f in (st1.get("fisiere") or []) if f.get("nume") == "Popescu_Ana_7A_orar.docx"]
    caz(rez, "n4_lectie_inchide_cu_save", st0.get("nume_fisier") == "Popescu_Ana_7A_orar.docx" and st1.get("documente_deschise") == 0
        and bool(f7a) and "Miercuri: desen" in (f7a[0].get("text") or []),
        nume_inainte=st0.get("nume_fisier"), deschise=st1.get("documente_deschise"), fisier=f7a)
    taste(pg, "Control+o")
    rec = [t for t in tinte_vizibile(pg, "backstage:") if "Popescu" in t]
    # rândul Recent arată numele fără extensie, ca bara de titlu (AC-7); oricare formă ar fi, clicul trebuie să-l deschidă
    clic_tinta(pg, "backstage:Popescu_Ana_7A_orar") or clic_tinta(pg, "backstage:Popescu_Ana_7A_orar.docx")
    st2 = stare(pg)
    caz(rez, "n4_lectie_redeschide_din_recent", len(rec) == 2 and st2.get("nume_fisier") == "Popescu_Ana_7A_orar.docx"
        and st2.get("documente_deschise") == 1 and "Miercuri: desen" in (st2.get("text") or []) and st2.get("pagina_backstage") is None,
        recent=rec, nume=st2.get("nume_fisier"), text=st2.get("text"), deschise=st2.get("documente_deschise"))
    # documentul nemodificat se închide fără întrebare
    deschide(pg, {"paragrafe": orar_a, "nume": "Popescu_Ana_7A_orar", "salvat": True})
    taste(pg, "Control+w")
    st = stare(pg)
    intreb = text_vizibil(pg, "[data-lh-aplicatie='word'] [data-lh-dialog-intrebare]")
    caz(rez, "n4_nemodificat_fara_intrebare", st.get("documente_deschise") == 0 and not intreb and st.get("dialog") is None,
        deschise=st.get("documente_deschise"), intrebare=intreb)

    # ================= unghiul gest_tastatura: tastele de acces ale ferestrelor, din referință (tasta_acces)
    # „Save your changes…”: Don't Save „ALT+n” (uia_word.json › dialog.save_your_changes_to_this_file)
    deschide(pg, {"paragrafe": ["Ana are mere"]})
    scrie(pg, " azi")
    taste(pg, "Control+w", "Alt+n")
    st = stare(pg)
    e = pg.evaluate("(window.__lhAplicatieEv || []).slice(-1).map(x => [x.gest, x.actiune, x.tinta])")
    caz(rez, "k_alt_n_dont_save", st.get("documente_deschise") == 0 and st.get("titlu_fereastra") == "Word"
        and (st.get("dialog") or {}).get("apasat") == "Don't Save" and e and e[0][0] == "tasta_acces", stare={k: st.get(k) for k in ("documente_deschise", "titlu_fereastra")}, ev=e)
    # „Save this file”: Save „ALT+S” (dialog.save_this_file) → salvat cu numele propus
    deschide(pg, {"paragrafe": ["Poezia mea", "Toamna vine."], "cursor": 0})
    taste(pg, "Control+s", "Alt+s")
    st = stare(pg)
    caz(rez, "k_alt_s_save_this_file", st.get("nume_fisier") == "Poezia mea.docx" and not text_vizibil(pg, "[data-lh-aplicatie='word'] [data-lh-dialog-intrebare]"),
        nume=st.get("nume_fisier"))
    # Save As: Alt+T (Save as type „ALT+t”) → Alt+↓ → ↓ ×6 → Enter → caseta arată PDF; Alt+S → Orar.pdf
    deschide(pg, {"paragrafe": ["Orar", "Marti: sport"], "cursor": 0})
    taste(pg, "F12", "Alt+t", "Alt+ArrowDown", *(["ArrowDown"] * 6), "Enter")
    v = valoare_caseta_tip(pg)
    taste(pg, "Alt+n", "Control+a")
    scrie(pg, "Orar")
    taste(pg, "Alt+s")
    st = stare(pg)
    caz(rez, "k_saveas_alt_t_alt_s", v == "PDF (*.pdf)" and st.get("fisiere_salvate") == ["Orar.pdf"] and st.get("nume_fisier") is None,
        caseta=v, fisiere=st.get("fisiere_salvate"), nume=st.get("nume_fisier"))

    # ================= GRAV 3: lista Font Size (uia_word.json › lista.FontSize; scenarii_real/word-font-size-lista.json)
    for profil in ("word365", "word2007"):
        pg.evaluate("p => LH.aplicatii.deschide('word', {continut: {paragrafe: ['Ana are mere'], selectie: {de_la: 4, pana_la: 7}}, profil: p, focus: true})", profil)
        pg.wait_for_timeout(250)
        clic_sel(pg, SAGEATA_FONT)
        lst = [t[6:] for t in tinte_vizibile(pg, "meniu:")]
        clic_tinta(pg, "meniu:20")
        st = stare(pg)
        r = real("word-font-size-lista")
        caz(rez, "g3_lista_clic_20_" + profil, lst == MARIMI and st.get("formatare_pe_caractere") == r["formatare_pe_caractere"]
            and st.get("text") == r["text"], lista=lst, fmt=st.get("formatare_pe_caractere"), mesaje=mesaje(pg))
    # Alt+↓ în casetă: lista se deschide; ↓ mută alegerea; Enter o aplică (support.microsoft.com … keyboard-shortcuts-in-word:
    # „Open the menu for the selected button. | Alt+Down arrow key”, „When a menu or submenu is open, move to the next command.
    # | Down arrow key”, „Activate the selected button. | Spacebar or Enter”)
    deschide(pg, {"paragrafe": ["Ana are mere"], "selectie": {"de_la": 4, "pana_la": 7}})
    clic_sel(pg, CASETA_FONT)
    taste(pg, "Alt+ArrowDown")
    deschisa = len(tinte_vizibile(pg, "meniu:"))
    taste(pg, "ArrowDown")
    ales = pg.evaluate("() => { const e = document.querySelector('[data-lh-aplicatie=\"word\"] [data-lh-tinta^=\"meniu:\"].lh-ap-ales'); return e ? e.getAttribute('data-lh-tinta').slice(6) : null; }")
    taste(pg, "Enter")
    st = stare(pg)
    caz(rez, "g3_alt_jos_tastatura", deschisa == 16 and ales is not None and marime_la(st, "are") == float(ales or 0) and not tinte_vizibile(pg, "meniu:"),
        lista=deschisa, ales=ales, marime=marime_la(st, "are"), mesaje=mesaje(pg))
    # Esc închide lista fără schimbare
    deschide(pg, {"paragrafe": ["Ana are mere"], "selectie": {"de_la": 4, "pana_la": 7}})
    clic_sel(pg, SAGEATA_FONT)
    taste(pg, "Escape")
    st = stare(pg)
    caz(rez, "g3_esc_inchide", not tinte_vizibile(pg, "meniu:") and marime_la(st, "are") in (None, 11, 11.0) and st.get("text") == ["Ana are mere"],
        marime=marime_la(st, "are"))
    # regres: clic în casetă, Ctrl+A, 14, Enter → 14
    deschide(pg, {"paragrafe": ["Ana are mere"], "selectie": {"de_la": 4, "pana_la": 7}})
    clic_sel(pg, CASETA_FONT)
    taste(pg, "Control+a")
    scrie(pg, "14")
    taste(pg, "Enter")
    st = stare(pg)
    caz(rez, "g3_regres_ctrla_14", marime_la(st, "are") == 14, marime=marime_la(st, "are"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire")
    a = ap.parse_args()
    s = server()
    url = "http://127.0.0.1:%d/aplicatii/poligon.html" % s.server_address[1]
    rez = []
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        cx = b.new_context(viewport={"width": 1366, "height": 768})
        cx.route("**/*", doar_local)
        pg = cx.new_page()
        pg.goto(url)
        pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.gata")
        pg.evaluate("LH.aplicatii.gata")
        try:
            cazuri(pg, rez)
        except Exception as e:      # un caz care crapă = picat, cu motivul
            caz(rez, "eroare_proba", False, eroare=str(e)[:400])
        cx.close()
        b.close()
    s.shutdown()
    picate = [r["caz"] for r in rez if not r["ok"]]
    if a.iesire:
        with open(a.iesire, "w", encoding="utf-8") as f:
            json.dump({"cazuri": rez, "picate": picate}, f, ensure_ascii=False, indent=1)
    print("picate:", picate)
    print(len(picate))
    return 1 if picate else 0


if __name__ == "__main__":
    sys.exit(main())
