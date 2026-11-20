# -*- coding: utf-8 -*-
"""Jucăria shell a bancului de mutanți pentru O3 (runda `acoperire` pe instrumente, 20.11.2026).

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/oracole/_jucarie_shell/genereaza_jucarie.py
    python .../genereaza_jucarie.py --verifica     # doar spune dacă fișierul scris e la zi (cod 0 = da, 1 = nu)

Ce scrie: oracole/_jucarie_shell/explorer-citire.js = simulatorul vechi lectii/_sim/explorer-citire.js al sitului (copiat
întocmai, ca lecția V/M2-L09 să meargă) + la coadă un File Explorer desenat după CONVENTIE_ARBORE.md din referința
shell (structura_lib.referinte_shell()["explorer"]): o rădăcină [data-lh-aplicatie="explorer"] ÎNREGISTRATĂ (LH.aplicatii
.radacini(), plus un <script> nefolosit cu src „…/aplicatii/aplicatii.js”, cum cere arbore_randat.js), câte un
[data-lh-suprafata] pe fiecare cheie de randare (fereastra, bara_comenzi, panou_navigare, meniu_nou …), iar în fiecare
suprafață comenzile ei, cu data-lh-tip / data-lh-eticheta / data-lh-id-mso și textul pe ecran, în locul din referință
(față de colțul suprafeței). Comenzile ascunse pentru date personale primesc un nume oarecare („Folderul meu N”), ca la
un constructor care pune conținutul lui: O3 trebuie să le ia drept prezente.
Folosire: banca.json › pregatiri › „jucarie_explorer” o copiază PESTE lectii/_sim/explorer-citire.js în copia din %TEMP%
a sitului (niciodată în worktree); mutanții O3-12…O3-14 strică apoi câte un rând din datele jucăriei.
Regenerare: după orice schimbare a referinței Explorer, a convertorului shell sau a simulatorului vechi (--verifica spune
dacă e cazul). Fiecare comandă stă pe rândul ei, ca textul „din” al unui mutant să apară o singură dată."""
import argparse
import json
import sys
from pathlib import Path

AICI = Path(__file__).resolve().parent
sys.path.insert(0, str(AICI.parent))
import structura_lib as L  # noqa: E402

SIM = "lectii/_sim/explorer-citire.js"
IESIRE = AICI / "explorer-citire.js"
SEMN = "/* ===== JUCĂRIA SHELL a bancului de mutanți (O3) — oracole/_jucarie_shell/genereaza_jucarie.py ===== */"


def date_jucarie():
    ref = L.referinte_shell()["explorer"]
    out = {}
    nr_ascuns = 0
    for k, c in ref.canon.items():
        rr = c["rect"] or [0, 0, 400, 300]
        rand = []
        for g in c["grupuri"]:
            for u in g["u"]:
                r = u["rect"] or [rr[0], rr[1], 10, 10]
                et = u["raw"]
                if u.get("ascuns"):
                    nr_ascuns += 1
                    et = "Folderul meu %d" % nr_ascuns
                rand.append([u["tip"], et, u["id"], r[0] - rr[0], r[1] - rr[1], r[2], r[3]])
        out[k] = {"r": [rr[2], rr[3]], "u": rand}
    return out


def text_jucarie():
    d = date_jucarie()
    linii = [SEMN, "(function () {", "  var DATE = {"]
    chei = list(d)
    for i, k in enumerate(chei):
        linii.append("    %s: {r: %s, u: [" % (json.dumps(k), json.dumps(d[k]["r"])))
        for u in d[k]["u"]:
            linii.append("      " + json.dumps(u, ensure_ascii=False) + ",")
        linii.append("    ]}" + ("," if i < len(chei) - 1 else ""))
    linii += [
        "  };",
        "  function pune() {",
        "    if (document.getElementById('lh-jucarie-shell')) return;",
        "    var R = document.createElement('div');",
        "    R.id = 'lh-jucarie-shell';",
        "    R.setAttribute('data-lh-aplicatie', 'explorer');",
        "    R.style.cssText = 'position:absolute;left:0;top:0;width:1600px;z-index:99999;background:#fff;color:#000;"
        "font:9px sans-serif;';",
        "    var y = 0;",
        "    Object.keys(DATE).forEach(function (k) {",
        "      var s = DATE[k], S = document.createElement('div');",
        "      S.setAttribute('data-lh-suprafata', k);",
        "      S.setAttribute('data-lh-tip', 'Pane');",
        "      S.style.cssText = 'position:absolute;left:0;top:' + y + 'px;width:' + s.r[0] + 'px;height:' + s.r[1] + 'px;';",
        "      s.u.forEach(function (u) {",
        "        var e = document.createElement('div');",
        "        e.setAttribute('data-lh-tip', u[0]);",
        "        e.setAttribute('data-lh-eticheta', u[1]);",
        "        if (u[2]) e.setAttribute('data-lh-id-mso', u[2]);",
        "        e.textContent = u[1];",
        "        e.style.cssText = 'position:absolute;left:' + u[3] + 'px;top:' + u[4] + 'px;width:' + u[5] + 'px;height:' + "
        "u[6] + 'px;white-space:nowrap;';",
        "        S.appendChild(e);",
        "      });",
        "      R.appendChild(S);",
        "      y += s.r[1] + 12;",
        "    });",
        "    R.style.height = y + 'px';",
        "    document.body.appendChild(R);",
        "    var sc = document.createElement('script');",
        "    sc.type = 'text/x-lh-jucarie';",
        "    sc.src = '/__lh_jucarie__/aplicatii/aplicatii.js';",
        "    document.head.appendChild(sc);",
        "    window.LH = window.LH || {};",
        "    if (!window.LH.aplicatii) window.LH.aplicatii = {};",
        "    window.LH.aplicatii.radacini = function () { return [R]; };",
        "  }",
        "  if (document.body) pune(); else document.addEventListener('DOMContentLoaded', pune);",
        "})();",
        ""]
    return "\n".join(linii)


def continut():
    sim = (L.WT_IMPLICIT / SIM).read_text(encoding="utf-8")
    return sim.rstrip("\n") + "\n\n" + text_jucarie()


def main():
    ap = argparse.ArgumentParser(description="Jucăria shell (File Explorer după referință) pentru bancul de mutanți O3.")
    ap.add_argument("--verifica", action="store_true")
    a = ap.parse_args()
    nou = continut()
    if a.verifica:
        la_zi = IESIRE.exists() and IESIRE.read_text(encoding="utf-8") == nou
        print("jucăria shell: " + ("la zi" if la_zi else "DE REGENERAT"))
        sys.exit(0 if la_zi else 1)
    IESIRE.write_text(nou, encoding="utf-8", newline="\n")
    d = date_jucarie()
    print("scris %s: %d suprafețe, %d comenzi" % (IESIRE.name, len(d), sum(len(v["u"]) for v in d.values())))


if __name__ == "__main__":
    main()
