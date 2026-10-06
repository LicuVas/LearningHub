# -*- coding: utf-8 -*-
"""Extragerea unei lectii pe motor (un nivel pe pasi) in text: configuratia (ca test_joc: Playwright, file://,
JocMotor.test.config()) si doua variante .md:
  - varianta T0 (pentru oracolul determinist): tot ce vede elevul + cheile raspunsurilor (indicii si explicatii
    intra si ele sub regula 1: „si indiciile respecta regula”);
  - varianta T1 (pentru cititorii cu carte inchisa): ce vede elevul INAINTE sa raspunda (variantele, indiciul care
    apare dupa o greseala), FARA raspunsul corect, fara `why` si fara conditiile verificarii automate.
Randarea HTML -> md urmeaza faza0/oracol_build.py (md()), cu trei adaugiri: <mark>/<dfn> = termen introdus (**X**),
<kbd> ramane text simplu (tastele se verifica si ele), <img> -> [Imagine: alt].
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

BUILTIN = {"choice", "tf", "order", "classify", "match", "hunt", "pick"}   # ca in test_joc.py
# Calibrare 27.09: tipurile cu variante NU mai sunt automat „recunoaștere”. Felul se hotărăște pe CONȚINUT
# (fel_practica): recunoaștere dacă răspunsul corect e deja scris în pașii de până atunci sau în explicațiile
# exercițiilor anterioare; altfel aplicare. Simulatorul (tip necunoscut motorului) = execuție.
RECUNOASTERE = BUILTIN                                                     # păstrat pentru compatibilitate (tipurile „cu variante”)


def config_din_pagina(index_html: Path) -> dict:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        try:
            pg = b.new_page()
            erori = []
            pg.on("pageerror", lambda e: erori.append(str(e)))
            pg.goto(index_html.resolve().as_uri(), timeout=30000)
            pg.wait_for_timeout(500)
            cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
            cfg["_erori_js"] = erori
            return cfg
        finally:
            b.close()


def _curat(s: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s)).replace(" ", " ")).strip()


def _tabel(m) -> str:
    """Un <table> devine text citibil. Grila desenată de lecție (class="g") -> celulele pline și cele colorate."""
    t = m.group(0)
    grid = []
    for r in re.findall(r"(?is)<tr[^>]*>(.*?)</tr>", t):
        grid.append([(a, _curat(x)) for a, x in re.findall(r"(?is)<t[dh]([^>]*)>(.*?)</t[dh]>", r)])
    if not grid:
        return " "
    if re.search(r"class=[\"']g[\"']", t) and len(grid) > 1:
        cap = [x for _, x in grid[0]][1:]
        pline, colorate = [], []
        for row in grid[1:]:
            rn = row[0][1] if row else "?"
            for j, (a, x) in enumerate(row[1:]):
                adr = f"{cap[j] if j < len(cap) else '?'}{rn}"
                if re.search(r"class=[\"'][^\"']*\bpick\b", a):
                    colorate.append(adr)
                if x:
                    pline.append(f"{adr} = {x}")
        s = f"[Foaie desenată: coloanele {cap[0] if cap else '?'}–{cap[-1] if cap else '?'}, rândurile 1–{len(grid) - 1}"
        s += ("; celule completate: " + ", ".join(pline)) if pline else "; toate celulele goale"
        s += ("; celule colorate: " + ", ".join(colorate)) if colorate else ""
        return "\n\n" + s + "]\n\n"
    return "\n\n" + "\n\n".join(" | ".join(x for _, x in row) for row in grid) + "\n\n"


def md(s) -> str:
    if not s:
        return ""
    s = str(s)
    s = re.sub(r"(?is)<table\b.*?</table>", _tabel, s)

    def _img(m):
        tag = m.group(0)
        alt = re.search(r'alt="([^"]*)"', tag) or re.search(r"alt='([^']*)'", tag)
        return f"\n\n[Imagine: {alt.group(1) if alt else 'fără descriere'}]\n\n"
    s = re.sub(r"(?is)<img\b[^>]*>", _img, s)
    # 06.10.2026: eticheta era „Legenda imaginii:” — oracolul T0 o lua drept termenul „legendă”
    # (predat în VIII/11, grafice) folosit înainte de definiție: alarmă falsă (raport T0: „prima folosire
    # … Legenda imaginii: Un grafic cu bare”). Comparat pe toate cele 42 de lecții: nicio altă lecție nu se schimbă.
    s = re.sub(r"(?is)<figcaption[^>]*>(.*?)</figcaption>", r"\n\nSub imagine: \1\n\n", s)
    s = re.sub(r"(?is)<(mark|dfn)>(.*?)</\1>", r"**\2**", s)
    s = re.sub(r"(?is)<(b|strong)>(.*?)</\1>", r"**\2**", s)
    s = re.sub(r"(?is)<kbd>(.*?)</kbd>", r"\1", s)
    s = re.sub(r"(?is)<code>(.*?)</code>", r"`\1`", s)
    s = re.sub(r"(?is)<pre[^>]*>(.*?)</pre>", lambda m: "\n\n```\n" + re.sub(r"<[^>]+>", "", m.group(1)) + "\n```\n\n", s)
    s = re.sub(r"(?i)<br\s*/?>", "\n", s)
    s = re.sub(r"(?i)</(p|li|tr|h\d|div|figcaption|ol|ul|table)>", "\n\n", s)
    s = re.sub(r"(?i)<li[^>]*>", "- ", s)
    s = re.sub(r"(?i)<(td|th)[^>]*>", " | ", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s).replace(" ", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r" *\n *", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def _celule(cells: dict) -> str:
    if not isinstance(cells, dict) or not cells:
        return ""
    return "Foaia de la început: " + "; ".join(f"{a} = {v}" for a, v in cells.items()) + "."


def _teste_numite(x) -> list[str]:
    """Numele testelor pe care elevul le vede bifandu-se (campurile `ce:` din verificari)."""
    out = []
    if isinstance(x, dict):
        if isinstance(x.get("ce"), str):
            out.append(md(x["ce"]))
        for v in x.values():
            out += _teste_numite(v)
    elif isinstance(x, list):
        for v in x:
            out += _teste_numite(v)
    return out


def q_md(q: dict, cu_chei: bool) -> str:
    """Un exercitiu / o intrebare. cu_chei=False: fara raspunsul corect (varianta pentru cititori)."""
    if not isinstance(q, dict):
        return ""
    t = q.get("t", "?")
    L = []
    if t not in BUILTIN:
        L.append(f"(Exercițiu în aplicația simulată din pagină — tipul „{t}”.)")
    elif t == "tf":
        L.append("(Adevărat sau fals?)")
    for k in ("titlu", "intro", "q"):
        if q.get(k) and isinstance(q[k], str):
            L.append(md(q[k]))
    if q.get("cells"):
        L.append(_celule(q["cells"]))
    if isinstance(q.get("o"), list):
        L.append("Variante:")
        for i, o in enumerate(q["o"]):
            mark = " (corect)" if cu_chei and q.get("ok") == i else ""
            L.append(f"- {md(o)}{mark}")
    if isinstance(q.get("items"), list):
        if t == "order":
            L.append("Pașii de pus în ordine" + (" (ordinea corectă):" if cu_chei else " (amestecați în pagină):"))
            its = q["items"] if cu_chei else sorted(q["items"], key=lambda x: str(x))
            L += [f"- {md(x)}" for x in its]
        elif t == "classify":
            L.append("Categorii: " + "; ".join(md(c) for c in q.get("cats") or []))
            for it in q["items"]:
                if isinstance(it, list) and it:
                    extra = f" → {md((q.get('cats') or ['?'])[it[1]])}" if cu_chei and len(it) > 1 and isinstance(it[1], int) and it[1] < len(q.get("cats") or []) else ""
                    L.append(f"- {md(it[0])}{extra}")
    if isinstance(q.get("pairs"), list):
        L.append("De potrivit:")
        st = [md(p[0]) for p in q["pairs"] if isinstance(p, list) and p]
        dr = [md(p[1]) for p in q["pairs"] if isinstance(p, list) and len(p) > 1]
        if cu_chei:
            L += [f"- {a} ↔ {b}" for a, b in zip(st, dr)]
        else:
            L.append("- stânga: " + "; ".join(st))
            L.append("- dreapta (amestecate în pagină): " + "; ".join(sorted(dr)))
    if t == "hunt" and q.get("src"):
        src = str(q["src"])
        if cu_chei:
            L.append("Textul (greșelile între [[ ]]): " + md(src))
        else:
            L.append("Textul în care cauți: " + md(re.sub(r"\[\[([\s\S]*?)\|[\s\S]*?\]\]", r"\1", src)))
    if t == "pick":
        L.append(f"(Grilă de {q.get('cols', '?')} coloane × {q.get('rows', '?')} rânduri; alegi " +
                 ("o zonă" if q.get("range") else "o celulă") + " cu clic.)")
        if cu_chei and q.get("ans"):
            L.append(f"Răspuns: {q['ans']}")
    teste = _teste_numite({k: v for k, v in q.items() if k not in ("inca",)})
    if teste:
        L.append("Teste care se bifează: " + "; ".join(teste))
    if cu_chei:
        for k in ("verifica", "targets"):
            if q.get(k):
                L.append(f"Verificarea automată ({k}): {json.dumps(q[k], ensure_ascii=False)}")
        if isinstance(q.get("ok"), bool):
            L.append(f"Răspuns: {'Adevărat' if q['ok'] else 'Fals'}")
    if q.get("ajutor"):
        L.append("Indiciu (apare după prima greșeală): " + md(q["ajutor"]))
    if cu_chei and q.get("why"):
        L.append("Explicația de după răspuns: " + md(q["why"]))
    return "\n\n".join(x for x in L if x)


def practica(nivel: dict) -> list[tuple[str, dict]]:
    """Exercitiile de practica, cu locul lor: incearca + inca pe pasi, atelier + atelier.inca."""
    out = []
    for i, p in enumerate(nivel.get("pasi") or [], 1):
        if p.get("incearca"):
            out.append((f"P{i} Încearcă", p["incearca"]))
        for j, x in enumerate(p.get("inca") or [], 1):
            out.append((f"P{i} Încă un exercițiu {j}", x))
    a = nivel.get("atelier")
    if a:
        out.append(("Atelier", a))
        for j, x in enumerate(a.get("inca") or [], 1):
            out.append((f"Atelier încă unul {j}", x))
    return out


# ---------------------------------------------------------------- felul exercițiului, pe conținut (regula 5)
_STOP = set("""a al ale ai cu de din in în la pe pentru prin sau si și un o unei unui unor care ce dupa după despre
este e sunt sa să se ca că mai dintr fara fără intre între cel cea doua două acest aceasta această lor lui ei ea el
iar apoi doar tot toate fiecare cum unde cand când nu da ai am are au fi fost vei poti poți tău ta tu""".split())


def _pl(s: str) -> str:
    s = s.replace("ş", "ș").replace("ţ", "ț").replace("Ş", "Ș").replace("Ţ", "Ț")
    return s.lower().translate(str.maketrans("șțăâî", "staai"))


def _tok(s) -> set[str]:
    """Cuvintele de conținut ale unui text, pliate, pe primele 4 litere; numerele rămân (un calcul nou = aplicare)."""
    out = set()
    stop = {_pl(w) for w in _STOP}
    for w in re.findall(r"\w+", _pl(md(s) if isinstance(s, str) else str(s))):
        if w.isdigit():
            out.add(w)
        elif len(w) >= 3 and w not in stop:
            out.add(w[:4])
    return out


def _propozitii(s: str) -> list[set[str]]:
    txt = md(s) if s else ""
    return [t for t in (_tok(p) for p in re.split(r"(?<=[.!?;:])\s+|\n+|\s→\s", txt)) if t]


def _parti_raspuns(q: dict) -> list:
    """Răspunsul corect al unui exercițiu cu variante, pe bucăți. O bucată e un set de cuvinte (varianta bună,
    enunțul A/F, un pas de ordonat) sau o PERECHE (item, categorie) la sortare/potrivire."""
    t = q.get("t")
    if t == "choice" and isinstance(q.get("o"), list) and isinstance(q.get("ok"), int) and not isinstance(q.get("ok"), bool) \
            and 0 <= q["ok"] < len(q["o"]):
        return [_tok(q["o"][q["ok"]])]
    if t == "tf":
        return [_tok(q.get("q", ""))]
    if t == "classify" and isinstance(q.get("items"), list):
        cats = q.get("cats") or []
        out = []
        for it in q["items"]:
            if isinstance(it, list) and len(it) > 1 and isinstance(it[1], int) and it[1] < len(cats):
                out.append((_tok(it[0]), _tok(cats[it[1]])))
        return out
    if t == "match" and isinstance(q.get("pairs"), list):
        return [(_tok(p[0]), _tok(p[1])) for p in q["pairs"] if isinstance(p, list) and len(p) > 1]
    if t == "order" and isinstance(q.get("items"), list):
        return [_tok(x) for x in q["items"]]
    if t == "pick" and q.get("ans"):
        return [_tok(q["ans"])]
    if t == "hunt" and q.get("src"):
        return [_tok(m.group(1)) for m in re.finditer(r"\[\[([\s\S]*?)\|", str(q["src"]))]
    return []


def _acoperire(parte, corpus: list[set[str]]) -> float:
    """Cât din răspuns stă într-o singură propoziție. La o pereche (item, categorie): 1 dacă o propoziție conține și
    categoria, și măcar un cuvânt al itemului („imaginea: o fotografie sau un desen” -> „Fotografia cetății” = Imagine),
    altfel acoperirea obișnuită a reuniunii."""
    if isinstance(parte, tuple):
        item, cat = parte
        if item and cat and any((cat & p) and (item & p) for p in corpus):
            return 1.0
        parte = item | cat
    if not parte:
        return 0.0
    return max((len(parte & p) / len(parte) for p in corpus), default=0.0)


def _prag(parte, tip: str) -> float:
    if isinstance(parte, tuple):
        return 1.0 if len(parte[0] | parte[1]) <= 4 else 0.7
    if tip == "tf":
        return 0.5          # un enunț A/F care repetă pe jumătate o propoziție din pas = definiția, întoarsă
    return 1.0 if len(parte) <= 4 else 0.7


def fel_practica(nivel: dict) -> list[dict]:
    """Fiecare exercițiu de practică, cu felul lui după regula 5 a standardului:
      execuție     = simulator (tip care nu e inclus în motor);
      recunoaștere = răspunsul corect e deja scris: fiecare bucată a lui (varianta bună, itemul cu categoria lui,
                     perechea) apare într-o SINGURĂ propoziție din pașii de până atunci (text, „Uite cum”, „Explică-mi
                     altfel”) sau din explicațiile exercițiilor dinainte; prag: toate cuvintele pentru un răspuns scurt
                     (≤ 4 cuvinte de conținut), 70% pentru unul lung; la tipurile cu mai multe bucăți, ≥ 70% din bucăți;
      aplicare     = altfel (răspunsul se obține aplicând regula pe date noi).
    `in_regula5` = „Încearcă” + atelier (numărătoarea care blochează); „Încă un exercițiu” se raportează separat."""
    out = []
    corpus: list[set[str]] = []
    whys: list[set[str]] = []

    def clasifica(loc: str, e: dict, in_r5: bool):
        t = e.get("t", "?")
        rec = {"loc": loc, "tip": t, "in_regula5": in_r5, "acoperire": None}
        if t not in BUILTIN:
            rec["fel"] = "execuție"
        else:
            parti = [p for p in _parti_raspuns(e) if p]
            baza = corpus + whys
            if not parti:
                rec["fel"] = "recunoaștere"          # nu știu ce e răspunsul: prudent, nu umflu aplicarea
                rec["acoperire"] = None
            else:
                acop = [_acoperire(p, baza) for p in parti]
                gasite = [a >= _prag(p, t) for a, p in zip(acop, parti)]
                rec["acoperire"] = round(sum(acop) / len(acop), 2)
                if len(parti) == 1:
                    rec["fel"] = "recunoaștere" if gasite[0] else "aplicare"
                else:
                    rec["fel"] = "recunoaștere" if sum(gasite) >= 0.7 * len(parti) else "aplicare"
        rec["text"] = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", str(e.get("q", "") or e.get("intro", ""))))[:120]
        out.append(rec)
        if e.get("why"):
            whys.extend(_propozitii(e["why"]))

    for i, p in enumerate(nivel.get("pasi") or [], 1):
        for k in ("text", "exemplu", "altfel"):
            corpus.extend(_propozitii(p.get(k) or ""))
        if p.get("incearca"):
            clasifica(f"P{i} Încearcă", p["incearca"], True)
        for j, x in enumerate(p.get("inca") or [], 1):
            clasifica(f"P{i} Încă un exercițiu {j}", x, False)
    a = nivel.get("atelier")
    if a:
        clasifica("Atelier", a, True)
        for j, x in enumerate(a.get("inca") or [], 1):
            clasifica(f"Atelier încă unul {j}", x, False)
    return out


def antet_md(cfg: dict, nivel: dict) -> str:
    L = [f"# {md(nivel.get('t') or cfg.get('titlu'))}", ""]
    if cfg.get("intro"):
        L += [md(cfg["intro"]), ""]
    if nivel.get("obiectiv"):
        L += ["La finalul nivelului: " + md(nivel["obiectiv"]), ""]
    cunoscute = {"t", "obiectiv", "pasi", "atelier", "qs", "lectii", "continuturi", "final", "text", "bazin", "cate",
                 "descriptor"}
    for k, v in nivel.items():                         # alte campuri text ale nivelului (ex. „Ai nevoie de”)
        if k not in cunoscute and isinstance(v, str) and len(v) > 3:
            L += [f"## {k}", "", md(v), ""]
    if nivel.get("text"):
        L += [md(nivel["text"]), ""]
    return "\n".join(L).strip() + "\n"


def corp_md(cfg: dict, nivel: dict, cu_chei: bool) -> str:
    L = []
    for i, p in enumerate(nivel.get("pasi") or [], 1):
        L += [f"## Pasul {i}: {md(p.get('t'))}", ""]
        if p.get("text"):
            L += [md(p["text"]), ""]
        if p.get("exemplu"):
            L += ["**Uite cum:**", "", md(p["exemplu"]), ""]
        if p.get("altfel"):
            L += ["**Explică-mi altfel:**", "", md(p["altfel"]), ""]
        if p.get("incearca"):
            L += [f"### Încearcă (pasul {i})", "", q_md(p["incearca"], cu_chei), ""]
        for j, x in enumerate(p.get("inca") or [], 1):
            L += [f"### Încă un exercițiu (pasul {i}, varianta {j})", "", q_md(x, cu_chei), ""]
    a = nivel.get("atelier")
    if a:
        L += [f"## Atelier: {md(a.get('titlu') or '')}".rstrip(": "), "", q_md({k: v for k, v in a.items() if k != "inca"}, cu_chei), ""]
        for j, x in enumerate(a.get("inca") or [], 1):
            L += [f"### Atelier — încă unul ({j})", "", q_md(x, cu_chei), ""]
    D = cfg.get("diploma") or {}
    prov = D.get("provocare")
    if prov:
        L += ["## Acum în aplicația adevărată", ""]
        if isinstance(prov, list):
            for k, x in enumerate(prov, 1):          # fiecare punct e un <li> separat în pagină
                L += [f"{k}. {md(x)}", ""]
        else:
            L += [md(prov), ""]
    for m, q in enumerate(nivel.get("qs") or [], 1):
        if m == 1:
            L += ["## Verificare", ""]
        L += [f"### Întrebarea {m}", "", q_md(q, cu_chei), ""]
    if D.get("rezumat"):
        L += ["## Ce am învățat", "", md(D["rezumat"]), ""]
    return "\n".join(L).strip() + "\n"


def termeni_marcati(nivel: dict) -> list[str]:
    """Termenii pe care lectia ii INTRODUCE: <mark>/<dfn> din textul pasilor (conventia motorului)."""
    out = []
    for p in nivel.get("pasi") or []:
        for m in re.finditer(r"(?is)<(mark|dfn)>(.*?)</\1>", str(p.get("text") or "")):
            t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", m.group(2)))).strip()
            if re.search(r"[^\W\d_]{3,}", t) and len(t.split()) <= 4 and t.lower() not in [o.lower() for o in out]:
                out.append(t)
    return out


def taste(nivel: dict, cfg: dict) -> list[str]:
    """Tastele si combinatiile folosite in pagina (<kbd>)."""
    brut = json.dumps(nivel, ensure_ascii=False) + json.dumps(cfg.get("diploma") or {}, ensure_ascii=False)
    out = []
    for m in re.finditer(r"((?:<kbd>[^<]{1,12}</kbd>\s*\+\s*)*<kbd>[^<]{1,12}</kbd>)", brut):
        t = re.sub(r"\s+", "", re.sub(r"</?kbd>", "", m.group(1)))
        if t and t not in out:
            out.append(t)
    return out
