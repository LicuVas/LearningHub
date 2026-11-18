# -*- coding: utf-8 -*-
r"""Reparațiile rundei 4 (B-word): cele 4 GRAV ale criticului 3 (A1, A2, N4, GRAV 3), ca înlocuiri EXACTE în bibliotecă.

Fiecare înlocuire cere ca textul vechi să apară de exact N ori (altfel scriptul se oprește fără să scrie nimic).
    python .../runde/4/repara_r4.py <dosarul aplicatii/>        # ex. C:/00/Projects/LearningHub_fidel/aplicatii
Ultima linie = numărul de înlocuiri care NU s-au potrivit (0 = totul aplicat).
"""
import sys
from pathlib import Path

AICI = Path(__file__).resolve().parent
PIESE = AICI / "piese_r4"          # bucățile de cod noi, ca fișiere (mai ușor de citit decât șiruri în Python)


def piesa(nume):
    return (PIESE / nume).read_text(encoding="utf-8")


def inlocuiri_word():
    return [
        # 1. fereastra „Save this file” inventată (cuSalvareNoua) -> cheile din referință
        ("intre", "  /* „Save this file” (Ctrl+S pe un document nou, Word M365). NU e în referința UIA",
         "  function creeaza(I, c) {", piesa("w01_constante.js")),
        ("exact", "    I.date = cuSalvareNoua(I.date);\n", "", 1),
        ("exact", "    const M = {\n      P: (Array.isArray(c.paragrafe)",
         "    const paginaNoua = () => ({ orientare: 'portret', latime_cm: 21.0, inaltime_cm: 29.7, margini_cm: { sus: 2.5, jos: 2.5, stanga: 2.5, dreapta: 2.5 } });\n"
         "    const M = {\n      P: (Array.isArray(c.paragrafe)", 1),
        ("exact", "      pag: { orientare: 'portret', latime_cm: 21.0, inaltime_cm: 29.7, margini_cm: { sus: 2.5, jos: 2.5, stanga: 2.5, dreapta: 2.5 } },\n",
         "      pag: paginaNoua(),\n", 1),
        ("exact", "      folder: null, salvari: [],\n",
         "      folder: null, salvari: [], fs: [], recente: [], deschis: true, inchisApp: false, modificat: false, altele: [],\n"
         "      tipAfisat: null, intrebare: null, dupaInchidere: null,\n", 1),
        # 2. cursorul implicit = capătul documentului, ca rulatorul real
        ("exact", "    const clamp = p => Math.max(0, Math.min(maxCaret(), p));\n",
         "    const clamp = p => Math.max(0, Math.min(maxCaret(), p));\n" + piesa("w02_cursor.js"), 1),
        # 3. istoricul pe document; „modificat”
        ("exact", "    const H = st.istoric(grupeaza);\n", "    let H = st.istoric(grupeaza);\n", 1),
        ("exact", "M.sel = s.sel; M.cel = s.cel; M.fmtIns = null; };", "M.sel = s.sel; M.cel = s.cel; M.fmtIns = null; M.modificat = true; };", 1),
        ("exact", "      H.inainte(tip, instantaneu());\n      const r = fn();\n",
         "      H.inainte(tip, instantaneu());\n      M.modificat = true;\n      const r = fn();\n", 1),
        # 4. mărimea: o funcție comună pentru casetă și listă
        ("exact", "    function marimeScrisa(inp) {\n      const n = Number(String(inp.value).trim().replace(',', '.'));\n      let r = 'fara_efect';\n      if (Number.isFinite(n)",
         "    function marimeScrisa(inp) { return marimeLa(Number(String(inp.value).trim().replace(',', '.'))); }\n"
         "    function marimeLa(n) {\n      let r = 'fara_efect';\n      if (M.deschis && Number.isFinite(n)", 1),
        # 5. starea
        ("exact", "        text: M.P.map(p => p.t),\n", "        text: M.deschis ? M.P.map(p => p.t) : [],\n", 1),
        ("intre", "        nume_fisier: M.nume,\n", "    I.pxPePunct = () =>", piesa("w05_stare.js")),
        # 6. ținte și desenul ferestrelor Office
        ("intre", "      tinta(n, ctx) {\n        if (ctx.cheie === 'dialog.FileSaveAs'", "      editabil(n, ctx) {\n", piesa("w06_opt.js")),
        ("exact", "        if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA) && n.t === 'Edit'",
         "        if ((ctx.cheie === 'dialog.FileSaveAs' || ctx.cheie === 'dialog.PictureInsertFromFile' || ctx.cheie === SALVARE_NOUA || ctx.cheie === INTREBARE_INCHIDERE) && n.t === 'Edit'", 1),
        ("exact", "    const SUP = date.suprafete;\n", "    const SUP = date.suprafete;\n" + piesa("w07_continut.js"), 1),
        ("exact", "    pozitie(titlu, SUP.bara_titlu.r);\n",
         "    pozitie(titlu, SUP.bara_titlu.r);\n    const BTN_TITLU = [...titlu.querySelectorAll('[data-lh-tinta^=\"bara_titlu:\"][data-lh-tip=\"Button\"]')]\n"
         "      .find(b => /\\s-\\s/.test(b.getAttribute('data-lh-eticheta') || '')) || null;\n", 1),
        ("intre", "      const ti = root.querySelectorAll('[data-lh-tinta^=\"bara_titlu:\"][data-lh-tip=\"Button\"]');\n",
         "    }\n    function actualizeaza() {\n", piesa("w08_titlu.js")),
        # 7. dialogurile
        ("intre", "      if (baza === 'dialog.FileSaveAs' || baza === SALVARE_NOUA) {\n        const prim",
         "      arataFilaDialog(fila || null);\n", piesa("w09_deschide_dialog.js")),
        ("exact", "    function inchideDialog() {\n      if (!dialog) return;\n      dialog.strat.remove();\n",
         "    function inchideDialog() {\n      if (!dialog) return;\n      const tv = tipAfisatAcum();\n      if (tv != null) M.tipAfisat = tv;\n      dialog.strat.remove();\n", 1),
        ("exact", "        if (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) nf.value = dialog.propus;\n",
         "        /* numele propus de bibliotecă (valoarea din referință e textul capturii, ex. „Ana are mere”) */\n"
         "        if (dialog.propus != null) nf.value = dialog.propus;\n", 1),
        ("exact", "      dialog.strat.appendChild(s);\n      dialog.el = s;\n",
         "      dialog.strat.appendChild(s);\n      dialog.el = s;\n" + piesa("w10_panou_stanga.js"), 1),
        ("exact", "      if (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) return salveaza();\n",
         "      if (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) return salveaza();\n" + piesa("w11_implicit.js"), 1),
        ("intre", "    function salveaza() {\n", "    function insereazaImagine() {\n", piesa("w12_salvare_liste.js")),
        # 8. Backstage: Recent din conținut; închiderea / deschiderea documentelor
        ("exact", "      backstage.pag = p;\n      backstage.pagina = pagina;\n",
         "      backstage.pag = p;\n      backstage.pagina = pagina;\n      if (pagina === 'Open') umpleRecente(p);\n", 1),
        ("exact", "    function inchideMeniuContextual() {", piesa("w13_documente.js") + "    function inchideMeniuContextual() {", 1),
        # 9. comenzile și clicurile
        ("intre", "      FontSize: elx => {\n", "      AlignLeft: () =>", piesa("w14_fontsize.js")),
        ("exact", "      if (meniu && !meniu.contains(tg)) inchideMeniu();\n",
         "      if (meniu && !meniu.contains(tg)) { if (meniu.__anc && meniu.__anc.contains(tg)) inchisLa = { anc: meniu.__anc, t: Date.now() }; inchideMeniu(); }\n", 1),
        ("exact", "      if (!eInDocument(tg) || dialog || backstage) {\n", "      if (!eInDocument(tg) || dialog || backstage || !M.deschis) {\n", 1),
        ("exact", "      if (eInDocument(tg) && !dialog && !backstage) return numarClic",
         "      if (eInDocument(tg) && !dialog && !backstage && !M.deschis) return 'fara_efect';\n      if (eInDocument(tg) && !dialog && !backstage) return numarClic", 1),
        ("exact", "        const n2 = elx.__nod || {};\n", "        const n2 = elx.__nod || {};\n        if (elx.__fisier) return deschideFisier(elx.__fisier);\n", 1),
        ("intre", "      if (dialog && dialog.baza === SALVARE_NOUA) {\n        /* „More save options”",
         "      if (fel === 'fila_dialog' && dialog)", piesa("w15_clic_office.js")),
        ("intre", "      /* săgeata casetei „Save as type:” (ținta ei în fereastră: fereastra:Deschidere)",
         "      if (fel === 'fereastra' && dialog) {\n", piesa("w16_clic_tip.js")),
        ("exact", "      if (fel === 'panglica' || fel === 'meniu_derulant' || fel === 'lansator' || fel === 'meniu') return apasa(elx, tinta);\n      return I.nesimulat(v || tinta);\n",
         "      if (fel === 'panglica' || fel === 'meniu_derulant' || fel === 'lansator' || fel === 'meniu') return M.deschis ? apasa(elx, tinta) : 'fara_efect';\n"
         "      /* ✕ al ferestrei Word = Ctrl+W pe document (acoperire_r3.fapte.b_x_la_fel_ca_ctrl_w: true) — critic runda 3, GRAV N4 */\n"
         "      if (fel === 'bara_titlu' && v === 'Close') return cerereInchidere('x');\n      return I.nesimulat(v || tinta);\n", 1),
        ("exact", "    I.la.dreapta = (tinta, e) => {\n      if (dialog || backstage) return null;\n",
         "    I.la.dreapta = (tinta, e) => {\n      if (dialog || backstage || !M.deschis) return null;\n", 1),
        # 10. tastele
        ("exact", "ctrl_q: 'Ctrl+Q', ctrl_w: 'Ctrl+W', ctrl_shift_m", "ctrl_q: 'Ctrl+Q', ctrl_shift_m", 1),
        ("exact", "      const eSalvare = () => dialog && (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA);\n",
         piesa("w17_tasta_inceput.js"), 1),
        ("exact", "if (eSalvare()) I.activat = 'dialog_salvare:Save';", "if (activatEnter()) I.activat = activatEnter();", 2),
        ("intre", "        /* Alt+↓ deschide lista casetei (support.microsoft.com", "        /* Enter într-un câmp al ferestrei = butonul ei implicit", piesa("w18_alt_jos.js")),
        ("exact", "      if (backstage) { if (e.key === 'Escape') { inchideBackstage(); return 'inapoi'; } return 'fara_efect'; }\n",
         "      if (backstage) { if (e.key === 'Escape') { inchideBackstage(); return 'inapoi'; } return 'fara_efect'; }\n"
         "      /* fără document (Ctrl+W → Don't Save) tastele nu au unde scrie; Ctrl+O deschide pagina Open */\n"
         "      if (!M.deschis && g !== 'ctrl_o') { actualizeaza(); return 'fara_efect'; }\n", 1),
        ("exact", "        case 'ctrl_s': r = M.salvat ? 'salvare' :", "        case 'ctrl_s': r = M.salvat ? salveazaPeLoc() :", 1),
        ("exact", "        case 'tasta_esc': r = 'fara_efect'; break;\n",
         "        /* Ctrl+W: „Close the document. | Ctrl+W” (support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-\n"
         "           7142-4b50-afb2-f762f663ceb2); modificat → „Save your changes to this file?” (scenarii_real/word-ctrl-w-nesalvat.json) */\n"
         "        case 'ctrl_w': r = cerereInchidere('ctrlw'); break;\n        case 'tasta_esc': r = 'fara_efect'; break;\n", 1),
        ("exact", "      if (dialog || backstage) return 'fara_efect';\n", "      if (dialog || backstage || !M.deschis) return 'fara_efect';\n", 2),
        ("exact", "    /* ---- tastele de acces (KeyTips): Alt apăsat și eliberat",
         piesa("w19_alt_fereastra.js") + "    /* ---- tastele de acces (KeyTips): Alt apăsat și eliberat", 1),
    ]


def inlocuiri_panglica():
    return [
        ("exact", "      if (w >= 40 && h >= 14) return { text: n.e, icoana: false, sageata: t === 'MenuItem' || t === 'SplitButton' };\n",
         "      /* butonul care își are numele într-un copil Text („More options…” în ferestrele Office) nu-l scrie de două ori */\n"
         "      const textInCopil = (n.c || []).some(c => c.t === 'Text' && c.e === n.e);\n"
         "      if (w >= 40 && h >= 14) return { text: textInCopil ? null : n.e, icoana: false, sageata: t === 'MenuItem' || t === 'SplitButton' };\n", 1),
        ("exact", "    /* SplitButton: părțile lui desenează conținutul; partea „săgeată” a unui buton MARE poartă numele sub pictogramă */\n",
         piesa("p01_split_text.js") + "    /* SplitButton: părțile lui desenează conținutul; partea „săgeată” a unui buton MARE poartă numele sub pictogramă */\n", 1),
        ("exact", "        if (c2.splitMare && /More Options/.test(c.e || '')) {\n",
         "        if (splitCuText && c.t === 'Button') {\n          ce.innerHTML = glifSageata;\n          ce.removeAttribute('title');\n"
         "        } else if (c2.splitMare && /More Options/.test(c.e || '')) {\n", 1),
    ]


def inlocuiri_css():
    return [("final", piesa("c01_css.css"))]


def aplica(cale, lista, rapoarte):
    t = cale.read_text(encoding="utf-8")
    nl = "\r\n" if "\r\n" in t else "\n"
    t = t.replace("\r\n", "\n")
    for x in lista:
        fel = x[0]
        if fel == "exact":
            _, vechi, nou, n = x
            k = t.count(vechi)
            if k != n:
                rapoarte.append("%s: '%s…' apare de %d ori, nu %d" % (cale.name, vechi[:70].replace("\n", "⏎"), k, n))
                continue
            t = t.replace(vechi, nou)
        elif fel == "intre":
            _, a, b, nou = x
            i = t.find(a)
            if i < 0 or t.find(a, i + 1) >= 0:
                rapoarte.append("%s: începutul '%s…' nu e unic (%d)" % (cale.name, a[:70].replace("\n", "⏎"), t.count(a)))
                continue
            j = t.find(b, i + len(a))
            if j < 0:
                rapoarte.append("%s: sfârșitul '%s…' lipsește după început" % (cale.name, b[:70].replace("\n", "⏎")))
                continue
            t = t[:i] + nou + t[j:]
        elif fel == "final":
            if x[1] not in t:
                t = t.rstrip("\n") + "\n" + x[1]
    return t.replace("\n", nl)


def main():
    if len(sys.argv) < 2:
        print("dă dosarul aplicatii/")
        print(1)
        return 1
    bib = Path(sys.argv[1])
    rapoarte = []
    noi = {}
    for nume, lista in (("word.js", inlocuiri_word()), ("panglica.js", inlocuiri_panglica()), ("aplicatii.css", inlocuiri_css())):
        noi[nume] = aplica(bib / nume, lista, rapoarte)
    for r in rapoarte:
        print("NEPOTRIVIT:", r)
    if rapoarte:
        print(len(rapoarte))
        return 1
    for nume, t in noi.items():
        (bib / nume).write_bytes(t.encode("utf-8"))
        print("scris", bib / nume)
    print(0)
    return 0


if __name__ == "__main__":
    sys.exit(main())
