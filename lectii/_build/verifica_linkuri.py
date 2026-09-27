# -*- coding: utf-8 -*-
"""Verifică LOCAL linkurile din paginile noi ale secțiunii /lectii/.

    python C:/00/Projects/LearningHub/lectii/_build/verifica_linkuri.py

Ce verifică (href + src, fără adresele externe http/https/mailto):
  1. lectii/index.html și lectii/<clasa>/index.html - tot;
  2. hub/index.html - doar blocul <!-- LECTII:START ... --> (restul hub-ului nu e al secțiunii);
  3. banda <!-- REVIZIE:START ... --> de pe paginile vechi content/tic/cls5..cls8.
Un link se rezolvă dacă fișierul există (x/ -> x/index.html); ancora (#...) trebuie să existe ca id în pagina
țintă. Excepție documentată: jocuri/index.html își face secțiunile #clasa-V... din catalog.js (în browser), deci
acolo ancora e bună dacă clasa apare în jocuri/catalog.js.
Ultimele trei linii tipărite sunt pline; ultima = DOAR numărul de linkuri moarte.
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote

LH = Path(__file__).resolve().parents[2]
ATTR = re.compile(r"""\b(?:href|src)\s*=\s*["']([^"']+)["']""", re.I)
BLOCURI = {
    "hub": re.compile(r"<!-- LECTII:START[^>]*-->.*?<!-- LECTII:END -->", re.S),
    "banda": re.compile(r"<!-- REVIZIE:START[^>]*-->.*?<!-- REVIZIE:END -->", re.S),
}
EXTERN = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//)", re.I)
CATALOG = (LH / "jocuri" / "catalog.js").read_text(encoding="utf-8") if (LH / "jocuri" / "catalog.js").exists() else ""


def ancora_ok(tinta, frag):
    txt = tinta.read_text(encoding="utf-8", errors="replace")
    if re.search(r"""\bid\s*=\s*["']%s["']""" % re.escape(frag), txt):
        return True
    m = re.fullmatch(r"clasa-([IVX]+)", frag)
    if m and tinta == LH / "jocuri" / "index.html" and "id=\"clasa-${" in txt:
        return re.search(r"""clasa["']?\s*:\s*["']%s["']""" % m.group(1), CATALOG) is not None
    return False


def rezolva(pagina, url):
    """None = link bun; altfel motivul."""
    if EXTERN.match(url):
        return None
    cale, _, frag = url.partition("#")
    cale = unquote(cale.split("?")[0])
    if not cale:
        tinta = pagina
    elif cale.startswith("/"):
        tinta = LH / cale.lstrip("/")
    else:
        tinta = (pagina.parent / cale)
    tinta = tinta.resolve()
    if cale.endswith("/") or tinta.is_dir():
        tinta = tinta / "index.html"
    if not tinta.exists():
        return f"fișier inexistent: {tinta}"
    if LH.resolve() not in tinta.parents and tinta != LH.resolve():
        return f"iese din sit: {tinta}"
    if frag and not ancora_ok(tinta, frag):
        return f"ancora #{frag} nu există în {tinta.name}"
    return None


def main():
    surse = [LH / "lectii" / "index.html"] + sorted((LH / "lectii").glob("*/index.html"))
    de_verificat = [(p, p.read_text(encoding="utf-8")) for p in surse]
    hub = LH / "hub" / "index.html"
    m = BLOCURI["hub"].search(hub.read_text(encoding="utf-8"))
    de_verificat.append((hub, m.group(0) if m else ""))
    lipsa = [] if m else ["hub/index.html: lipsește blocul LECTII"]
    vechi = sorted(p for c in ("cls5", "cls6", "cls7", "cls8") for p in (LH / "content" / "tic" / c).rglob("*.html"))
    for p in vechi:
        mb = BLOCURI["banda"].search(p.read_text(encoding="utf-8", errors="replace"))
        if mb:
            de_verificat.append((p, mb.group(0)))
    total, moarte = 0, []
    for pagina, text in de_verificat:
        for url in ATTR.findall(text):
            total += 1
            motiv = rezolva(pagina, url)
            if motiv:
                moarte.append(f"{pagina.relative_to(LH).as_posix()}: {url} -> {motiv}")
    for x in lipsa + moarte[:60]:
        print("  MORT", x)
    print(f"pagini noi: {len(surse)} · bloc hub: {'da' if m else 'NU'} · benzi pe pagini vechi: {len(de_verificat) - len(surse) - 1} · linkuri verificate: {total}")
    print("linkuri moarte:")
    print(len(moarte) + len(lipsa))
    return 1 if (moarte or lipsa) else 0


if __name__ == "__main__":
    sys.exit(main())
