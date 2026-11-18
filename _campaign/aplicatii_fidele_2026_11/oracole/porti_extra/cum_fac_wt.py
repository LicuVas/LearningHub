# -*- coding: utf-8 -*-
"""Poarta „Cum fac…?” pe worktree-ul măsurat (16.11.2026, infrastructura de măsurare a lucrării „Aplicațiile fidele”).

De ce există: `cum-fac/_build/build.mjs`, `valideaza_fise.mjs` și `_campaign/cum_fac_2026_10/_unelte/extrage_lectii.mjs`
au calea sitului scrisă fix (`const L = 'C:/00/Projects/LearningHub'`) — rulate așa, ar verifica worktree-ul MASTER, nu pe cel
al lucrării. Aici le copiez într-un folder temporar, schimb DOAR rădăcina (și `require('../cautare.js')` cu calea absolută),
și rulez `build.mjs --verifica` (care nu scrie nimic în sit). Fișierele originale nu se ating.

Digestul lecțiilor (textul pașilor cu care se compară fișele):
  --digest proaspat  (implicit) re-extrage lecțiile ACUM din situl măsurat, într-un folder temporar; prinde și o lecție
                     schimbată de o rundă fără ca fișele să fie resincronizate (contract I2: „→ 0 sau fișele resincronizate”);
  --digest salvat    folosește digestul din `_campaign/cum_fac_2026_10/digest/` al sitului (exact comportamentul original).
Situl: LH_RADACINA (oracole/CONVENTIE_RADACINA.md), implicit worktree-ul C:/00/Projects/LearningHub_fidel.
Ultima linie = numărul de probleme raportat de build.mjs (sau -1 dacă poarta n-a putut rula: o înlocuire n-a avut loc exact o dată).
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
RAD = Path(os.environ.get("LH_RADACINA") or Path(__file__).resolve().parents[4]).resolve()
L_VECHI = "const L = 'C:/00/Projects/LearningHub';"


def inlocuieste(text, din, in_, nume):
    n = text.count(din)
    if n != 1:
        raise RuntimeError(f"{nume}: textul de înlocuit apare de {n} ori (aștept 1): {din[:80]!r}")
    return text.replace(din, in_)


def main():
    mod = "proaspat"
    if "--digest" in sys.argv:
        mod = sys.argv[sys.argv.index("--digest") + 1]
    if mod not in ("proaspat", "salvat"):
        print("--digest proaspat|salvat"); print(-1); return 3
    tmp = Path(tempfile.mkdtemp(prefix="lh_cumfac_"))
    try:
        js = lambda p: json.dumps(Path(p).as_posix())   # noqa: E731 — șir JS cu ghilimele
        b = (RAD / "cum-fac/_build/build.mjs").read_text(encoding="utf-8")
        v = (RAD / "cum-fac/_build/valideaza_fise.mjs").read_text(encoding="utf-8")
        b = inlocuieste(b, L_VECHI, f"const L = {js(RAD)};", "build.mjs")
        b = inlocuieste(b, "createRequire(import.meta.url)('../cautare.js')",
                        f"createRequire(import.meta.url)({js(RAD / 'cum-fac/cautare.js')})", "build.mjs")
        v = inlocuieste(v, L_VECHI, f"const L = {js(RAD)};", "valideaza_fise.mjs")
        if mod == "proaspat":
            dig = tmp / "digest"
            e = (RAD / "_campaign/cum_fac_2026_10/_unelte/extrage_lectii.mjs")
            if not e.exists():
                raise RuntimeError(f"lipsește {e} (situl măsurat nu are extractorul)")
            et = e.read_text(encoding="utf-8")
            et = inlocuieste(et, L_VECHI, f"const L = {js(RAD)};", "extrage_lectii.mjs")
            et = inlocuieste(et, "const OUT = path.join(L, '_campaign/cum_fac_2026_10/digest');", f"const OUT = {js(dig)};",
                             "extrage_lectii.mjs")
            (tmp / "extrage_lectii.mjs").write_text(et, encoding="utf-8")
            r = subprocess.run(["node", str(tmp / "extrage_lectii.mjs")], capture_output=True, text=True, encoding="utf-8",
                               errors="replace", timeout=600)
            linii = [x for x in (r.stdout or "").strip().splitlines() if x.strip()]
            if r.returncode != 0 or not linii or linii[-1].strip() != "0":
                raise RuntimeError(f"extrage_lectii.mjs: cod {r.returncode}, ultima linie {linii[-1] if linii else ''!r}; "
                                   f"{(r.stderr or '')[-300:]}")
            print("  info digest proaspăt: " + (linii[-2] if len(linii) > 1 else "extras"))
            v = inlocuieste(v, "const DIGEST = path.join(L, '_campaign/cum_fac_2026_10/digest');", f"const DIGEST = {js(dig)};",
                            "valideaza_fise.mjs")
        (tmp / "build.mjs").write_text(b, encoding="utf-8")
        (tmp / "valideaza_fise.mjs").write_text(v, encoding="utf-8")
        r = subprocess.run(["node", str(tmp / "build.mjs"), "--verifica"], capture_output=True, text=True, encoding="utf-8",
                           errors="replace", timeout=600)
        iesire = (r.stdout or "").rstrip()
        print(f"  info situl măsurat: {RAD.as_posix()} · digest: {mod}")
        if iesire:
            print(iesire)
        linii = [x for x in iesire.splitlines() if x.strip()]
        try:
            n = int(linii[-1].strip())
        except (IndexError, ValueError):
            print(f"build.mjs n-a dat un număr pe ultima linie (cod {r.returncode}); {(r.stderr or '')[-300:]}")
            print(-1)
            return 3
        print(n)
        return 0 if n == 0 else 1
    except Exception as e:  # noqa: BLE001 — orice abatere = poarta nu e concludentă, nu „curată”
        print(f"POARTA NU A RULAT: {e}")
        print(-1)
        return 3
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
