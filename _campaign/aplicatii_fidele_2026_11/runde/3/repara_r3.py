# -*- coding: utf-8 -*-
r"""Reparațiile rundei 3 (N1, N2, GRAV 3, N3, N4 parțial) ca înlocuiri EXACTE în aplicatii/word.js și aplicatii/aplicatii.js.
    python .../runde/3/repara_r3.py <radacina>      # <radacina>/aplicatii/...; fiecare text vechi trebuie să apară o dată
Ultima linie = numărul de înlocuiri care NU s-au putut face (0 = toate).
"""
import sys

W = []   # (fisier, vechi, nou)

# ---------------------------------------------------------------- aplicatii.js
W.append(("aplicatii.js",
"""  function emite(I, gest, actiune, tinta, inainte) {
    if (!I || !I.root.isConnected) return null;
    let dupa;
    try { dupa = clona(I.stare()); } catch (e) { dupa = {}; }
    const d = { aplicatie: I.app, gest, actiune: actiune || gest, tinta: tinta || I.zonaTinta, inainte: inainte || {}, dupa,
      ts: Date.now(), profil: I.profil.id, pas: W.__lhPas || null };
""",
"""  function emite(I, gest, actiune, tinta, inainte, extra) {
    if (!I || !I.root.isConnected) return null;
    let dupa;
    try { dupa = clona(I.stare()); } catch (e) { dupa = {}; }
    const d = { aplicatie: I.app, gest, actiune: actiune || gest, tinta: tinta || I.zonaTinta, inainte: inainte || {}, dupa,
      ts: Date.now(), profil: I.profil.id, pas: W.__lhPas || null };
    /* activat = butonul pe care tasta l-a apăsat fără să fie ținta focusului (Enter într-o fereastră = butonul implicit:
       learn.microsoft.com/en-us/windows/win32/dlgbox/dlgbox-programming-considerations, ENTER „… IDOK or control
       identifier of the default push button”); critic runda 2, GRAV N2 */
    if (extra && extra.activat) d.activat = extra.activat;
"""))

W.append(("aplicatii.js",
"""      const inCamp = eCamp(e.target);
      const ina = st();
      I.ultimaActiune = null;
      let act = null;
      if (I.la && I.la.tasta) act = I.la.tasta(e, g, inCamp);
      if (!inCamp && (e.ctrlKey || e.metaKey || e.altKey || /^F\\d/.test(e.key) || e.key === 'Tab')) e.preventDefault();
      const t = tintaDin(I, document.activeElement && r.contains(document.activeElement) ? document.activeElement : null);
      if (inCamp) setTimeout(() => emite(I, g, act || I.ultimaActiune || g, t, ina), 0);
      else emite(I, g, act || I.ultimaActiune || g, t, ina);
""",
"""      const inCamp = eCamp(e.target);
      const ina = st();
      /* la taste, ținta = focusul din MOMENTUL tastei (§4): Enter în File name închide fereastra, iar focusul de după e
         documentul (critic runda 2, GRAV N2) */
      const t0 = inCamp && r.contains(e.target) ? tintaDin(I, e.target) : null;
      I.ultimaActiune = null;
      I.activat = null;
      let act = null;
      if (I.la && I.la.tasta) act = I.la.tasta(e, g, inCamp);
      const extra = I.activat ? { activat: I.activat } : null;
      I.activat = null;
      if (!inCamp && (e.ctrlKey || e.metaKey || e.altKey || /^F\\d/.test(e.key) || e.key === 'Tab')) e.preventDefault();
      const t = t0 || tintaDin(I, document.activeElement && r.contains(document.activeElement) ? document.activeElement : null);
      if (inCamp) setTimeout(() => emite(I, g, act || I.ultimaActiune || g, t, ina, extra), 0);
      else emite(I, g, act || I.ultimaActiune || g, t, ina, extra);
"""))

W.append(("aplicatii.js",
"""      X.addEventListener('compositionend', () => {
        compune = false;
        r.classList.remove('lh-ap-compune');
        latime();
        setTimeout(() => { if (!compune) trimite('insertFromComposition'); }, 0);
      });
""",
"""      X.addEventListener('compositionend', () => {
        compune = false;
        r.classList.remove('lh-ap-compune');
        latime();
        /* textul pleacă ACUM: o atingere care a încheiat compunerea e urmată imediat de „click” (un „Verifică” citește
           stare()); caseta rămâne goală, deci un „input” venit după (Safari) nu mai are ce trimite (critic runda 2, N3) */
        trimite('insertFromComposition');
        setTimeout(() => { if (!compune && X.value) trimite('insertFromComposition'); }, 0);
      });
      /* O atingere oriunde (alt rând, panglica, „Verifică” din lecție) încheie întâi cuvântul aflat în compunere, ÎNAINTE ca
         aplicația să mute cursorul: caseta iese din focus, iar browserul încheie compunerea (compositionend → trimite; ordinea
         „mousedown → compositionend → blur”, critic runda 2). Atingerea în aplicație readuce focusul în document (I.la.jos).
         Plasă: dacă browserul nu încheie compunerea, biblioteca trimite ea textul casetei. Critic runda 2, GRAV N3. */
      I.incheieCompunerea = tinta => {
        if (!compune || tinta === X) return;
        try { X.blur(); } catch (e) { /* */ }
        if (compune) {
          compune = false;
          r.classList.remove('lh-ap-compune');
          latime();
          trimite('insertFromComposition');
        }
      };
      const laAtingere = e => {
        if (!r.isConnected) { W.removeEventListener('pointerdown', laAtingere, true); return; }
        I.incheieCompunerea(e.target);
      };
      W.addEventListener('pointerdown', laAtingere, true);
"""))

W.append(("aplicatii.js",
"""      else bun = ev.tinta === p.tinta || (!!canonPas(p) && ev.tinta === canonPas(p));
""",
"""      else bun = ev.tinta === p.tinta || (!!canonPas(p) && ev.tinta === canonPas(p)) || (!!ev.activat && ev.activat === p.tinta);
"""))

# ---------------------------------------------------------------- word.js
W.append(("word.js",
"""      sel: { a: 0, f: 0 }, cel: null, fmtIns: null, nume: 'Document1', salvat: false, dialogSalvare: null, zoom: 100,
""",
"""      sel: { a: 0, f: 0 }, cel: null, fmtIns: null, nume: 'Document1', salvat: false, dialogSalvare: null, zoom: 100,
      folder: null, salvari: [],
"""))

W.append(("word.js",
"""        nume_fisier: M.nume,
        dialog_salvare: M.dialogSalvare ? Object.assign({}, M.dialogSalvare) : null
""",
"""        nume_fisier: M.nume,
        dialog_salvare: M.dialogSalvare ? Object.assign({}, M.dialogSalvare) : null,
        /* chei în plus (§5 le permite): folderul documentului salvat și fișierele scrise (lecția m1-l03 verifică folderul;
           critic runda 2, GRAV N4) */
        folder_fisier: M.folder,
        fisiere_salvate: M.salvari.map(x => Object.assign({}, x))
"""))

W.append(("word.js",
"""      dialog.strat.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.closest('input')) { e.preventDefault(); implicitDialog(); }
      });
    }
""",
"""    }
"""))

W.append(("word.js",
"""    function salveaza() {
      let v = valoareCamp('camp:nume_fisier').trim();
      if (!v) return 'fara_efect';
      if (!/\\.[a-z0-9]{2,5}$/i.test(v)) v += '.docx';
      M.nume = v;
      M.salvat = true;
      inchideDialog();
      if (backstage) inchideBackstage();
      return 'salvare';
    }
""",
"""    /* folderul în care se deschide fereastra Save As = bara ei de adrese în referință (uia_word.json › dialog.FileSaveAs ›
       ToolBar „Adresă: Documente”); „Save this file” are același loc (Location, A2-1) */
    function folderSalvare() {
      let f = null;
      (function cauta(n) { if (!n || f) return; const m = /^Adres[ăa]: (.+)$/.exec(n.e || ''); if (m) { f = m[1]; return; } (n.c || []).forEach(cauta); })(SUP['dialog.FileSaveAs']);
      return f || 'Documente';
    }
    function salveaza() {
      let v = valoareCamp('camp:nume_fisier').trim();
      if (!v) return 'fara_efect';
      const folder = folderSalvare(), tip = (dialog && dialog.tip) || null;
      let r = 'salvare';
      if (tip && /\\(\\*\\.pdf\\)/.test(tip)) {
        /* Save as type „PDF (*.pdf)”: o copie PDF lângă document; documentul deschis rămâne cel de lucru (NEVERIFICAT: R3-2) */
        M.salvari.push({ nume: v.replace(/\\.(docx?|pdf)$/i, '') + '.pdf', folder, tip });
        r = 'salvare_pdf';
      } else {
        if (!/\\.[a-z0-9]{2,5}$/i.test(v)) v += '.docx';
        M.nume = v;
        M.salvat = true;
        M.folder = folder;
        M.salvari.push({ nume: v, folder, tip: tip || 'Word Document (*.docx)' });
      }
      inchideDialog();
      if (backstage) inchideBackstage();
      /* bara de titlu arată numele imediat, pe orice drum (Enter / Save; F12 / Ctrl+S) — critic runda 2, GRAV N1 */
      actualizeazaPanglica();
      return r;
    }
    /* Save As › „Save as type:” ▾ — DOAR rândurile citate: „Word Document (*.docx)” (uia_word.json › dialog.FileSaveAs,
       valoarea casetei) și „PDF (*.pdf)” (support.microsoft.com/en-us/office/save-or-convert-to-pdf-or-xps-in-office-desktop-
       apps-d85416c5-7d77-4fd6-a216-6f4bf7c7c110: „In the drop-down list, select PDF.”); celelalte: NEVERIFICAT (R3-1) */
    const TIPURI_SALVARE = ['Word Document (*.docx)', 'PDF (*.pdf)'];
    function alegeTip(cb, tip) {
      if (!dialog) return 'fara_efect';
      dialog.tip = tip;
      if (M.dialogSalvare) M.dialogSalvare.tip_propus = tip;
      cb.querySelectorAll('[data-lh-tip="Text"]').forEach(x => { const sp = x.querySelector('.lh-ap-text') || x; sp.textContent = tip; });
      return 'tip_fisier';
    }
"""))

W.append(("word.js",
"""      FontSize: elx => { const c = elx.querySelector('input'); if (c && document.activeElement !== c) try { c.focus({ preventScroll: true }); } catch (x) { /* */ } return 'camp'; },
""",
"""      FontSize: elx => {
        const c = elx.querySelector('input');
        /* săgeata ▾ (Button „Open” al casetei în referință): rândurile listei NU sunt în referință (de_verificat R2-1) →
           mesajul central, nu tăcere (R12; critic runda 2, GRAV 3) */
        if (!c) return I.nesimulat('Font Size ▾');
        if (document.activeElement !== c) try { c.focus({ preventScroll: true }); } catch (x) { /* */ }
        return 'camp';
      },
"""))

W.append(("word.js",
"""      if (fel === 'fereastra' && dialog) {
        if (/^(OK|Insert)$/.test(v)) return implicitDialog();
""",
"""      /* săgeata casetei „Save as type:” (ținta ei în fereastră: fereastra:Deschidere) → lista cu rândurile citate */
      if (dialog && dialog.baza === 'dialog.FileSaveAs' && (fel === 'fereastra' || fel === 'meniu_derulant')) {
        const cb = elx.closest('[data-lh-tip="ComboBox"]');
        if (cb && /^Save as type/.test(cb.getAttribute('data-lh-eticheta') || '')) {
          meniuLa(elx, TIPURI_SALVARE.map(tip => ({ tinta: tip, text: tip, fa: () => alegeTip(cb, tip) })));
          return 'meniu_tip_fisier';
        }
      }
      if (fel === 'fereastra' && dialog) {
        if (/^(OK|Insert)$/.test(v)) return implicitDialog();
"""))

W.append(("aplicatii.js",
"""    r.addEventListener('pointerdown', e => {
      if (e.button !== 0) { jos = null; return; }
      const t = tintaDin(I, e.target);
      inaintePas = st();
      jos = { x: e.clientX, y: e.clientY, t, tras: false, fel: null, tinta0: e.target };
      if (I.la && I.la.jos) jos.fel = I.la.jos(e, t) || null;
    }, true);
""",
"""    r.addEventListener('pointerdown', e => {
      if (e.button !== 0) { jos = null; return; }
      /* încheierea compunerii (laAtingere, pe window, înaintea acestui ascultător) redesenează documentul: elementul atins
         nu mai e în pagină → se ia elementul nou din același punct, ca atingerea să mute cursorul acolo (critic runda 2, N3 b) */
      let tg = e.target, ex = e;
      if (!tg.isConnected) {
        const x = document.elementFromPoint(e.clientX, e.clientY);
        if (x && r.contains(x)) {
          tg = x;
          ex = { target: x, clientX: e.clientX, clientY: e.clientY, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey,
            altKey: e.altKey, button: e.button, buttons: e.buttons, pointerType: e.pointerType, preventDefault: () => e.preventDefault() };
        }
      }
      const t = tintaDin(I, tg);
      inaintePas = st();
      jos = { x: e.clientX, y: e.clientY, t, tras: false, fel: null, tinta0: tg };
      if (I.la && I.la.jos) jos.fel = I.la.jos(ex, t) || null;
    }, true);
"""))

W.append(("word.js",
"""      if (inCamp) {
        if (dialog && e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        if (e.key === 'Enter' && e.target.closest && e.target.closest('[data-lh-id-mso="FontSize"]')) { e.preventDefault(); return marimeScrisa(e.target); }
        return null;
      }
      if (dialog) {
        if (e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        if (e.key === 'Enter') { e.preventDefault(); return implicitDialog(); }
        return 'fara_efect';
      }
""",
"""      const eSalvare = () => dialog && (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA);
      if (inCamp) {
        if (dialog && e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        if (e.key === 'Enter' && e.target.closest && e.target.closest('[data-lh-id-mso="FontSize"]')) { e.preventDefault(); return marimeScrisa(e.target); }
        /* Alt+↓ deschide lista casetei (support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-
           afb2-f762f663ceb2: „Open the menu for the selected button. | Alt+Down arrow key”); rândurile ei: NEVERIFICAT (R2-1) */
        if (e.key === 'ArrowDown' && e.altKey && e.target.closest && e.target.closest('[data-lh-id-mso="FontSize"]')) { e.preventDefault(); return I.nesimulat('Font Size ▾'); }
        /* Enter într-un câmp al ferestrei = butonul ei implicit (Save: uia_word.json › dialog.FileSaveAs, Button „Save”
           id_win32 1 = IDOK); evenimentul spune ce s-a apăsat (activat), ținta rămâne focusul (§4) — critic runda 2, N2 */
        if (dialog && e.key === 'Enter' && dialog.strat.contains(e.target)) {
          e.preventDefault();
          if (eSalvare()) I.activat = 'dialog_salvare:Save';
          return implicitDialog();
        }
        return null;
      }
      if (dialog) {
        if (e.key === 'Escape') { inchideDialog(); return 'anulare'; }
        if (e.key === 'Enter') { e.preventDefault(); if (eSalvare()) I.activat = 'dialog_salvare:Save'; return implicitDialog(); }
        return 'fara_efect';
      }
"""))

W.append(("word.js",
"""        case 'ctrl_s': r = M.salvat ? 'salvare' : (deschideDialog(p2007 ? 'dialog.FileSaveAs' : SALVARE_NOUA) ? 'dialog_salvare' : I.nesimulat('Ctrl+S')); break;
""",
"""        case 'ctrl_s': r = M.salvat ? 'salvare' : (deschideDialog(p2007 ? 'dialog.FileSaveAs' : SALVARE_NOUA) ? 'dialog_salvare' : I.nesimulat('Ctrl+S')); break;
        /* support.microsoft.com/en-us/office/open-files-from-the-file-menu-97f087d8-3136-4485-8e86-c5b12a8c4176: „select
           File > Open, select the Open icon, or press CTRL+O” → pagina Open din Backstage (uia_word.json › backstage.Open).
           Word 2007 n-are Backstage, iar fereastra Open nu are referință → mesajul central (critic runda 2, GRAV N4) */
        case 'ctrl_o': if (p2007) r = I.nesimulat('Ctrl+O'); else { deschideBackstage('Open'); r = 'backstage'; } break;
"""))


def main():
    rad = sys.argv[1].rstrip("/\\")
    texte, rate = {}, 0
    for fis, vechi, nou in W:
        p = rad + "/aplicatii/" + fis
        if p not in texte:
            with open(p, encoding="utf-8", newline="") as f:
                texte[p] = f.read()
        n = texte[p].count(vechi)
        if n != 1:
            rate += 1
            print("NU (%d aparitii): %s :: %s" % (n, fis, vechi.strip().splitlines()[0][:90]))
            continue
        texte[p] = texte[p].replace(vechi, nou)
    if rate == 0:
        for p, t in texte.items():
            with open(p, "w", encoding="utf-8", newline="") as f:
                f.write(t)
        print("scris:", ", ".join(sorted(x.split("/aplicatii/")[1] for x in texte)))
    print(rate)
    return 1 if rate else 0


if __name__ == "__main__":
    sys.exit(main())
