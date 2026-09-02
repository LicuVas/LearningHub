# -*- coding: utf-8 -*-
"""Scrie un fisier de workflow gata de rulat pentru o grupa, cu datele lotului COAPTE inauntru.

  python make_wave.py lic10          -> waves/lic10.js  (doar ce lipseste)
  python make_wave.py lic10 --all    -> tot lotul

De ce coapte si nu prin args: asa lotul nu mai trece prin contextul sesiunii principale.
Sesiunea porneste doar `Workflow(scriptPath=waves/lic10.js)` si nu cara nimic.
"""
import io, os, sys, json, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
WAVES = os.path.join(HERE, "waves")
TPL = os.path.join(HERE, "wave.js")

MARKER_START = "// ── args:"
MARKER_END = "const REPO ="


def main():
    if len(sys.argv) < 2:
        print("uz: python make_wave.py <grupa> [--all]", file=sys.stderr)
        return 2
    g = sys.argv[1]
    cmd = [sys.executable, os.path.join(HERE, "make_args.py"), g]
    if "--all" in sys.argv:
        cmd.append("--all")
    raw = subprocess.check_output(cmd, cwd=HERE)
    data = json.loads(raw.decode("utf-8"))
    n = sum(len(m["lessons"]) for m in data["modules"])

    tpl = io.open(TPL, encoding="utf-8").read()
    i = tpl.index(MARKER_START)
    j = tpl.index(MARKER_END)
    baked = "const A = " + json.dumps(data, ensure_ascii=False) + "\n\n"
    baked += "const LABEL = A.label\nconst AUDIENCE = A.audience\nconst FLAVOR = A.flavor\nconst MODULES = A.modules\n"
    baked += "if (!MODULES.length) { return { error: 'lot gol - nimic de facut', lot: LABEL } }\n\n"
    out = tpl[:i] + baked + tpl[j:]
    out = out.replace("name: 'lh-night-wave'", "name: 'lh-night-%s'" % g)
    out = out.replace("dintr-un lot primit prin args", "lotul %s (%d lectii)" % (g, n))

    if not os.path.isdir(WAVES):
        os.makedirs(WAVES)
    p = os.path.join(WAVES, g + ".js")
    io.open(p, "w", encoding="utf-8", newline="\n").write(out)
    print(p)
    print("  module: %d | lectii de construit: %d" % (len(data["modules"]), n))
    return 0


if __name__ == "__main__":
    sys.exit(main())
