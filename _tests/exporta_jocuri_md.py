#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
exporta_jocuri_md.py — jocurile pe pași, ca pagini de citit (markdown), pentru cititorii cu carte închisă (26.09.2026).

Cititorii din C:/00/AI_0/tools/plimbare (T1) lucrează pe un dosar de pagini. Jocurile sunt date, așa că aici
fiecare NIVEL devine o pagină, în ordinea în care îl vede elevul: blocul „Ce trebuie să știi dinainte” (din harta
prerechizitelor, cu link local dacă jocul-sursă e exportat și el), obiectivul, pașii (text, „Uite cum”,
„Explică-mi altfel”, „Încearcă tu” + „Încă un exercițiu”), atelierul și verificarea. Răspunsurile corecte NU
intră în pagini (cititorul trebuie să rezolve), dar indiciile (`ajutor`) intră, cum le vede elevul.

  python _tests/exporta_jocuri_md.py --jocuri web-viii,excel-pas-cu-pas-viii,word-vii --dest <dosar>
Scrie și <dest>/oracol.config.json (ordinea paginilor) și <dest>/plimbare/{profil-cititor.md, sarcini.json}.
"""
from __future__ import annotations

import argparse
import html as htmlmod
import json
import re
import sys
from pathlib import Path

RAD = Path(__file__).resolve().parents[1]
JOCURI = RAD / "jocuri"
RE_TAG = re.compile(r"<[^>]+>")


def md(h: str) -> str:
    """HTML simplu din jocuri -> markdown lizibil (păstrează codul din <pre>/<code>)"""
    s = h or ""
    # codul se scoate întâi (decodat abia la final): „&lt;html&gt;” decodat mai devreme ar arăta ca o etichetă și ar dispărea
    cod: list[str] = []

    def pune(text: str) -> str:
        cod.append(text)
        return f"\x00{len(cod) - 1}\x00"
    s = re.sub(r"<pre[^>]*>(.*?)</pre>", lambda m: pune("\n```\n" + htmlmod.unescape(RE_TAG.sub("", m.group(1))).strip("\n") + "\n```\n"), s, flags=re.S | re.I)
    s = re.sub(r"<(code|kbd)[^>]*>(.*?)</\1>", lambda m: pune("`" + htmlmod.unescape(RE_TAG.sub("", m.group(2))) + "`"), s, flags=re.S | re.I)
    s = re.sub(r"<(b|strong)[^>]*>(.*?)</\1>", r"**\2**", s, flags=re.S | re.I)
    s = re.sub(r"<(i|em)[^>]*>(.*?)</\1>", r"*\2*", s, flags=re.S | re.I)
    s = re.sub(r"<li[^>]*>", "\n- ", s, flags=re.I)
    s = re.sub(r"<br\s*/?>|</p>|</li>|</div>|<p[^>]*>|<div[^>]*>", "\n", s, flags=re.I)
    s = re.sub(r"<img[^>]*alt=\"([^\"]*)\"[^>]*>", r"[imagine: \1]", s, flags=re.I)
    s = htmlmod.unescape(RE_TAG.sub("", s))
    s = re.sub(r"\x00(\d+)\x00", lambda m: cod[int(m.group(1))], s)
    return re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]+\n", "\n", s)).strip()


def exercitiu(e: dict, eticheta: str) -> str:
    r = [f"**{eticheta}.** {md(e.get('q') or e.get('intro') or e.get('titlu') or '')}"]
    o = e.get("o")
    if isinstance(o, list) and o and all(isinstance(x, str) for x in o):
        r += [f"  {chr(65 + i)}) {md(x)}" for i, x in enumerate(o)]
    for k in ("items",):
        v = e.get(k)
        if isinstance(v, list) and v:
            r.append("  Elemente: " + "; ".join(md(x) if isinstance(x, str) else json.dumps(x, ensure_ascii=False) for x in v))
    if e.get("pairs"):
        r.append("  Perechi de potrivit: " + "; ".join(md(p[0]) if isinstance(p, list) else str(p) for p in e["pairs"]))
    if e.get("t") and e["t"] not in ("choice", "tf", "order", "classify", "match", "hunt", "pick"):
        r.append(f"  (se lucrează în simulatorul „{e['t']}”, adică aplicația simulată din joc)")
    if e.get("ajutor"):
        r.append(f"  Indiciu (la cerere): {md(e['ajutor'])}")
    return "\n".join(r)


def main(argv=None) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--jocuri", required=True)
    ap.add_argument("--dest", required=True)
    a = ap.parse_args(argv)
    sluguri = a.jocuri.split(",")
    dest = Path(a.dest)
    (dest / "plimbare").mkdir(parents=True, exist_ok=True)
    harta = json.loads((JOCURI / "_motor" / "prerechizite.json").read_text(encoding="utf-8"))["jocuri"]
    from playwright.sync_api import sync_playwright
    cfgs = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        for s in sluguri:
            pg.goto((JOCURI / s / "index.html").as_uri(), timeout=30000)
            pg.wait_for_timeout(200)
            cfgs[s] = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
        b.close()
    ordine, sarcini = ["index.md"], []
    idx = ["# Jocurile de învățare (export pentru cititor)", ""]
    for s in sluguri:
        c = cfgs[s]
        niv = [lv for lv in c["nivele"] if not lv.get("bazin")]
        pag0 = f"{s}-00.md"
        idx.append(f"- [{c['titlu']} (clasa a {c['clasa']}-a)]({pag0})")
        start = [f"# {c['titlu']}", "", md(c.get("intro", "")), "", md(c.get("cum", "")), "", "## Nivelurile"]
        start += [f"- [Nivelul {i}: {lv.get('t', '')}]({s}-{i:02d}.md)" for i, lv in enumerate(niv, 1)]
        start += ["", f"[Începe cu nivelul 1 →]({s}-01.md)"]
        (dest / pag0).write_text("\n".join(start) + "\n", encoding="utf-8")
        ordine.append(pag0)
        for i, lv in enumerate(niv, 1):
            r = [f"# {c['titlu']} — Nivelul {i}: {lv.get('t', '')}", ""]
            pq = (harta.get(s) or {}).get(str(i)) or []
            if pq:
                r.append("## Ce trebuie să știi dinainte")
                for e in pq:
                    loc = f"{e['joc']}-{e['nivel']:02d}.md" if e["joc"] in sluguri else None
                    unde = f"[{e['joc_titlu']}, nivelul {e['nivel']}]({loc})" if loc else f"{e['joc_titlu']}, nivelul {e['nivel']} (alt joc, neexportat)"
                    r.append(f"- **{e['termen']}** — {e['amintire']} Dacă nu-ți amintești: {unde}")
                r.append("")
            if lv.get("obiectiv"):
                r += [f"**La finalul nivelului:** {md(lv['obiectiv'])}", ""]
            for si, pas in enumerate(lv.get("pasi") or [], 1):
                r += [f"## Pasul {si}: {md(pas.get('t', ''))}", "", md(pas.get("text", ""))]
                if pas.get("exemplu"):
                    r += ["", "### Uite cum", md(pas["exemplu"])]
                if pas.get("altfel"):
                    r += ["", "### Explică-mi altfel", md(pas["altfel"])]
                ex = [pas.get("incearca")] + list(pas.get("inca") or [])
                for ei, e in enumerate([e for e in ex if e], 1):
                    r += ["", exercitiu(e, f"Încearcă tu {si}.{ei}" if ei == 1 else f"Încă un exercițiu {si}.{ei}")]
                r.append("")
            if lv.get("text"):
                r += ["## De citit", md(lv["text"]), ""]
            if lv.get("atelier"):
                at = lv["atelier"]
                r += ["## Atelier", md(at.get("titlu", "") or ""), exercitiu(at, "Sarcina din atelier"), ""]
            for qi, q in enumerate(lv.get("qs") or [], 1):
                r += [exercitiu(q, f"Verificare {qi}"), ""]
            nav = []
            if i > 1:
                nav.append(f"[← Nivelul anterior]({s}-{i - 1:02d}.md)")
            if i < len(niv):
                nav.append(f"[Nivelul următor →]({s}-{i + 1:02d}.md)")
            r += ["---", " · ".join(nav)]
            pag = f"{s}-{i:02d}.md"
            (dest / pag).write_text("\n".join(r) + "\n", encoding="utf-8")
            ordine.append(pag)
        # sarcini de cititor: primul exercițiu din nivelul 1 și din nivelul din mijloc, plus o întrebare de verificare
        for li in (1, max(2, len(niv) // 2)):
            lv = niv[li - 1]
            ex = next((p.get("incearca") for p in lv.get("pasi") or [] if p.get("incearca")), None)
            if ex:
                sarcini.append({"id": f"{s}-EX{li}", "tip": "exercitiu", "text":
                    f"În {s}-{li:02d}.md, rezolvă exercițiul „Încearcă tu” de la primul pas care are unul, folosind DOAR ce scrie în "
                    f"paginile de până la el. Pune răspunsul în `raspuns` și citează regula din pagină pe care te-ai bazat. "
                    f"Dacă pagina nu te-a învățat ce îți trebuie, verdictul e NEFACUT și spui ce lipsește."})
        sarcini.append({"id": f"{s}-WALK", "tip": "walkthrough", "text":
            f"Pornești de la {pag0}. Pași: (1) ajungi la nivelul 1; (2) înțelegi ce vei ști la final; (3) găsești primul "
            f"exercițiu „Încearcă tu”; (4) ajungi la verificarea nivelului 1. Pentru fiecare pas, completează `pasi`."})
    (dest / "index.md").write_text("\n".join(idx) + "\n", encoding="utf-8")
    (dest / "oracol.config.json").write_text(json.dumps({
        "ordine": ordine, "extensii": [".md"], "exemple": {"executa": False},
        "bloc_prereq": {"verifica": False, "sarcini_t1": 0},
        "profil": "plimbare/profil-cititor.md", "sarcini": "plimbare/sarcini.json",
        "momeala": {"id": "MOMEALA-1", "text": "tabel pivot recursiv",
                    "intrebare": "Găsește pasul care explică „tabel pivot recursiv” și citează primul lui rând."}},
        ensure_ascii=False, indent=1), encoding="utf-8")
    (dest / "plimbare" / "sarcini.json").write_text(json.dumps(sarcini, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(ordine)} pagini, {len(sarcini)} sarcini -> {dest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
