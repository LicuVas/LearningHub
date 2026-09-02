# -*- coding: utf-8 -*-
"""Adauga grupa artistic12 in unelte: profil de public, adancime corecta catre assets,
si sarirea peste pagina de index la modulele care nu au una separata."""
import io, os

HERE = os.path.dirname(os.path.abspath(__file__))
NL = chr(10)

PROF = (
    '    "artistic12": {' + NL +
    '        "label": "Liceu artistic, clasa a XII-a - proba de competente digitale si proiecte",' + NL +
    '        "gradeName": "Clasa a XII-a",' + NL +
    '        "audienceShort": "Liceu de Arte, Clasa a XII-a",' + NL +
    '        "audience": ("elevi de clasa a XII-a la liceu de arte (muzica, arte plastice), care dau la '
    'bacalaureat proba de evaluare a competentelor digitale"),' + NL +
    '        "flavor": ("Exemplele sunt din viata unui artist: partituri si inregistrari, programe de concert, '
    'afise, coperte de album, portofoliu online, biografie de artist, bugetul unui eveniment. Foloseste programe '
    'GRATUITE acolo unde exista (GIMP, LibreOffice) si spune explicit ca merge la fel si in varianta platita. '
    'Elevii sunt buni la altceva decat la calculatoare - explica fara graba, dar fara sa ii tratezi ca pe copii."),' + NL +
    '    },' + NL
)

p = os.path.join(HERE, "make_args.py")
s = io.open(p, encoding="utf-8", newline="").read().replace(chr(13) + NL, NL)
anchor = "}" + NL + NL + NL + "def main():"
assert anchor in s, "ancora make_args lipseste"
s = s.replace(anchor, PROF + anchor, 1)

old = "            if take_all or not ok:" + NL + "                lessons.append(L)"
new = ("            if take_all or not ok:" + NL +
       "                LL = dict(L)" + NL +
       '                LL["assets"] = "../" * (len(L["path"].split("/")) - 1) + "assets"' + NL +
       "                lessons.append(LL)")
assert old in s, "ancora lessons.append lipseste"
s = s.replace(old, new, 1)

s = s.replace(
    '        mm = {k: M[k] for k in ("cls", "module", "title", "icon", "desc", "indexPath")}',
    '        mm = {k: M[k] for k in ("cls", "module", "title", "icon", "desc", "indexPath")}' + NL +
    '        mm["noIndex"] = bool(M.get("noIndex"))', 1)
s = s.replace('        idx_ok, _ = S.check_index(repo, M)',
              '        idx_ok = True if M.get("noIndex") else S.check_index(repo, M)[0]', 1)
io.open(p, "w", encoding="utf-8", newline=NL).write(s)
print("make_args.py actualizat")

p = os.path.join(HERE, "wave.js")
w = io.open(p, encoding="utf-8", newline="").read().replace(chr(13) + NL, NL)
w = w.replace('href="../../../../../assets/css/lesson-atomic.css"',
              'href="${L.assets}/css/lesson-atomic.css"')
w = w.replace("aceeasi adancime ../../../../../assets/js/...",
              "aceeasi adancime ${L.assets}/js/...")
w = w.replace("const scaffoldJobs = MODULES.map(M => () => agent(",
              "const scaffoldJobs = MODULES.filter(M => !M.noIndex).map(M => () => agent(")
io.open(p, "w", encoding="utf-8", newline=NL).write(w)
print("wave.js actualizat")
