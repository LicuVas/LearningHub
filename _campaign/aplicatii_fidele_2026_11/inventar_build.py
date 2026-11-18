"""inventar_build.py — Etapa 0 a lucrării „Aplicațiile fidele” (contract.md, 16.11.2026): INVENTARUL.

Găsește STATIC (citind HTML/JS, fără să ruleze paginile) toate paginile LearningHub care simulează o aplicație din
perimetru — Windows, File Explorer, Word, Excel, PowerPoint, Paint — și scrie, lângă acest fișier:
  inventar.json   = o intrare pe pagină: aplicațiile, fișierele simulatoarelor, dacă încarcă panglica comună
                    (ui-panglica.js), suprafețele de interfață atinse, gesturile (unde sunt simulate / predate, fișier:rând),
                    exercițiile (id-ul din test_joc.py, unde sunt scrise, cum se verifică), complexitatea și ordinea de mutare;
  suprafete.json  = pe fiecare aplicație: suprafețele de interfață (id stabil, nume, ce conține, în câte pagini apare) —
                    cele folosite de lecții ȘI cele ale aplicației reale pe care lecțiile nu le folosesc încă (R2: interfața
                    întreagă), fiecare cu sursa faptului sau [NEVERIFICAT] — și gesturile (id stabil, descriere, pagini).

Cum:
  python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/inventar_build.py          (static)
  python .../inventar_build.py --viu   (în plus: deschide fiecare pagină din perimetru în Chromium, pe un server local
        127.0.0.1 cu port liber, cu TOT ce nu e 127.0.0.1/localhost abandonat (regula 24), navigator.sendBeacon
        înlocuit cu o funcție care întoarce false și prezenta.js / site-credit.js neîncărcate (reparația 12),
        citește JocMotor.test.config()
        și compară exercițiile găsite static cu cele din configurația vie; diferențele intră în inventar.json)
Ultima linie tipărită: numărul de pagini în perimetru (întreg).

Metoda (de ce așa): un lexer JS mic (șiruri, șabloane `${}` imbricate, comentarii, expresii regulate) + un parser de
literali obiect/tablou peste jetoane. Configurația motorului (JocMotor.porneste({...})) e citită ca arbore; constantele
la care trimite (pasi:PROVOCARE, nivele:[LECTIA]) se leagă prin nume. Un exercițiu = un obiect cu `t:'<tip>'`, unde
<tip> e o cheie din `tipuri:{...}` a paginii. Id-ul exercițiului e cel din poarta jocuri/_motor/test_joc.py
(N<nivel>P<pas>E<k>, N<nivel>AE<k>, N<nivel>Î<k>), ca să se poată juca la fel de oracol_sarcini.py; lista de exerciții a
unui pas e cea din motor.js:598 (practiceList = [incearca, ...inca].filter(Boolean)).
Gesturile și suprafețele: reguli (expresii regulate) peste codul simulatoarelor (= „simulat”) și peste textul lecției
(= „predat/cerut”), fiecare potrivire cu fișier:rând ca dovadă — verificabile de oricine, nu ghicite.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import time
from collections import Counter, defaultdict
from pathlib import Path

WT = Path(r"C:/00/Projects/LearningHub_fidel")
D = Path(__file__).resolve().parent
CERC = WT / "_cercetare" / "office_comenzi"

BUILTIN = {"choice", "tf", "order", "classify", "match", "hunt", "pick"}
APLICATII = ["windows", "explorer", "word", "excel", "powerpoint", "paint"]

# ---------------------------------------------------------------- perimetrul: fișierele simulatoarelor -> aplicația
# Citite pe disc (16.11.2026): antetul fiecărui fișier spune ce simulează. Ce nu e aici și nu e în AFARA = „neclasificat”.
SIM_APP_RE = [
    (r"lectii/_sim/desktop-windows\.js$", "windows"),
    (r"lectii/_sim/siguranta-pc\.js$", "windows"),        # bara de activități, Securitate Windows, ferestre (antetul fișierului)
    (r"lectii/_sim/explorer-[\w-]+\.js$", "explorer"),
    (r"lectii/_sim/wordobj[\w-]*\.js$", "word"),
    (r"lectii/_sim/wordfisier\.js$", "word"),
    (r"lectii/_sim/wordteh-[\w-]+\.js$", "word"),
    (r"lectii/_sim/excelx[\w-]*\.js$", "excel"),
    (r"lectii/_sim/registru-foi\.js$", "excel"),
    (r"jocuri/_motor/tip-excel\.js$", "excel"),
    (r"jocuri/_motor/tip-foaie\.js$", "excel"),
    (r"jocuri/_motor/panglica-excel\.js$", "excel"),
    (r"jocuri/_motor/panglica-word\.js$", "word"),
    (r"jocuri/_motor/panglica-powerpoint\.js$", "powerpoint"),
    (r"lectii/_sim/simppt[\w-]*\.js$", "powerpoint"),
    (r"lectii/_sim/paint[\w-]*\.js$", "paint"),
]
# piese comune, nu o aplicație anume
COMUNE_RE = [r"jocuri/_motor/ui-panglica\.js$", r"jocuri/_motor/motor\.js$"]
# în afara perimetrului (contract + sarcina): browser, poștă, Clipchamp, audio, Scratch, C++, editor web, algoritmi, ...
AFARA_RE = [r"browser-", r"posta-", r"video-clipchamp", r"audio-", r"scratch", r"cpp-mic", r"editorweb", r"algoritm",
            r"urmarire-", r"executant", r"cutii-variabile", r"evaluare-expresii", r"secventa-liniara", r"schema-logica",
            r"sir-valori", r"compara-repetitii", r"fotografie", r"intrare-cod", r"bilete-servicii", r"cont-sigur",
            r"colab-google", r"etica-colab", r"eval-", r"analiza-enunt", r"fisa-niveluri", r"scenariu-casute",
            r"rezultat-elev", r"tur-captura", r"tip-html", r"tip-interogare", r"tip-traseu", r"_ghiduri/", r"program-vii/cpp",
            r"prerechizite", r"qrcode", r"diplome-date"]

# simbolurile definite DIRECT în pagină (fără fișier de simulator), citite pe disc; restul vin din exporturile fișierelor
SIMBOL_INLINE_APP = {
    "TipWordObiecte": "word",      # lectii/vii/m1-l04 (copie în pagină a lui wordobj.js)
    "SimPPT": "powerpoint",        # lectii/vi/m1-l04
    "ExcelPlus": "excel",          # lectii/viii/m1-l04
    "TipEditor": "word", "TipCorectura": "word",          # jocuri/word-vii (panglica-word.js)
    "JocPagina": "word",           # jocuri/word-obiecte-vii, word-antrenament-vii: pagina Word (orientare, margini, încadrare)
    "JocDiapozitiv": "powerpoint", # jocuri/prezentari-*: un diapozitiv (contrast, mărimea textului)
    "JocPPT": "powerpoint",        # jocuri/prezentari-vi (ui-panglica + panglica-powerpoint.js)
    "JocFormatare": "excel",       # jocuri/excel-viii, excel-antrenament-viii
    "TIP_EXPLORER": "explorer",    # jocuri/fisiere-v
    "TIP_ECRAN": "windows",        # jocuri/fisiere-v: desktopul cu ferestre (render -> ecDesen)
    "JocPaint": "paint", "JocCaseta": "paint",            # jocuri/grafica-v
}

# ---------------------------------------------------------------- lexerul JS
ID_RE = re.compile(r"[A-Za-z_$\u0080-\uffff][\w$\u0080-\uffff]*")
NUM_RE = re.compile(r"0[xX][0-9a-fA-F_]+n?|0[bB][01_]+n?|0[oO][0-7_]+n?|(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?n?")
WS = " \t\r\f\v\ufeff\u00a0\u2028\u2029"
PUNCTS = {4: {">>>="}, 3: {"...", "===", "!==", "**=", "<<=", ">>=", ">>>", "&&=", "||=", "??="},
          2: {"=>", "==", "!=", "<=", ">=", "&&", "||", "??", "?.", "++", "--", "+=", "-=", "*=", "/=", "%=", "&=", "|=",
              "^=", "<<", ">>", "**"}}
KW_REGEX = {"return", "typeof", "instanceof", "in", "of", "new", "delete", "void", "throw", "case", "do", "else", "yield", "await"}


class Tok:
    __slots__ = ("k", "v", "line", "a", "b")

    def __init__(self, k, v, line, a, b):
        self.k, self.v, self.line, self.a, self.b = k, v, line, a, b

    def __repr__(self):
        return f"{self.k}:{self.v!r}@{self.line}"


def _regex_ok(prev):
    if prev is None:
        return True
    if prev.k in ("num", "str", "tmpl", "re"):
        return False
    if prev.k == "id":
        return prev.v in KW_REGEX
    return prev.v not in (")", "]")


def _scan_regex(src, i):
    j, n, cls = i + 1, len(src), False
    while j < n:
        c = src[j]
        if c == "\\":
            j += 2
            continue
        if c == "\n":
            return None
        if cls:
            if c == "]":
                cls = False
        elif c == "[":
            cls = True
        elif c == "/":
            j += 1
            while j < n and (src[j].isalnum() or src[j] in "_$"):
                j += 1
            return j
        j += 1
    return None


def lex(src, i=0, line=1, stop_brace=False):
    """Jetoanele de la i; cu stop_brace se oprește la acolada care închide un ${...} (o consumă)."""
    toks, n, depth = [], len(src), 0
    while i < n:
        c = src[i]
        if c == "\n":
            line += 1
            i += 1
            continue
        if c in WS:
            i += 1
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j < 0 else j
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            line += src.count("\n", i, j)
            i = j
            continue
        if c in "\"'":
            j = i + 1
            while j < n and src[j] != c and src[j] != "\n":
                j += 2 if src[j] == "\\" else 1
            toks.append(Tok("str", src[i + 1:j], line, i, j + 1))
            i = j + 1
            continue
        if c == "`":
            a, l0 = i, line
            j = i + 1
            while j < n:
                ch = src[j]
                if ch == "\\":
                    j += 2
                    continue
                if ch == "`":
                    j += 1
                    break
                if ch == "\n":
                    line += 1
                    j += 1
                    continue
                if ch == "$" and j + 1 < n and src[j + 1] == "{":
                    _, j, line = lex(src, j + 2, line, stop_brace=True)
                    continue
                j += 1
            toks.append(Tok("tmpl", src[a + 1:j - 1] if j - 1 > a else "", l0, a, j))
            i = j
            continue
        if c.isdigit() or (c == "." and i + 1 < n and src[i + 1].isdigit()):
            m = NUM_RE.match(src, i)
            toks.append(Tok("num", m.group(0), line, i, m.end()))
            i = m.end()
            continue
        if c.isalpha() or c in "_$" or ord(c) > 127:
            m = ID_RE.match(src, i)
            toks.append(Tok("id", m.group(0), line, i, m.end()))
            i = m.end()
            continue
        if c == "/" and _regex_ok(toks[-1] if toks else None):
            j = _scan_regex(src, i)
            if j:
                toks.append(Tok("re", src[i:j], line, i, j))
                i = j
                continue
        if c == "{":
            depth += 1
        elif c == "}":
            if stop_brace and depth == 0:
                return toks, i + 1, line
            depth -= 1
        for L in (4, 3, 2):
            if src[i:i + L] in PUNCTS[L]:
                toks.append(Tok("p", src[i:i + L], line, i, i + L))
                i += L
                break
        else:
            toks.append(Tok("p", c, line, i, i + 1))
            i += 1
    return toks, i, line


def perechi(toks):
    """pair[i] = indicele parantezei care o închide pe toks[i] (și invers)."""
    pair, st = {}, []
    deschis = {"(": ")", "[": "]", "{": "}"}
    for k, t in enumerate(toks):
        if t.k != "p":
            continue
        if t.v in deschis:
            st.append(k)
        elif t.v in (")", "]", "}"):
            if st:
                o = st.pop()
                pair[o], pair[k] = k, o
    return pair


# ---------------------------------------------------------------- parserul de literali peste jetoane
class Lit:
    """Citește literalii obiect/tablou ai unui script: rădăcini (const X = {...}/[...], porneste({...})), referințe
    (o valoare = un nume), obiectele cu cheile lor, pe căi ca ('porneste','nivele',0,'pasi',2,'incearca')."""

    def __init__(self, toks, fis):
        self.t, self.fis = toks, fis
        self.pair = perechi(toks)
        self.obiecte = {}      # cale(tuple) -> {'chei': {cheie: valoare-scurtă}, 'line': n}
        self.refs = []         # (cale, nume) — la calea asta stă valoarea din constanta `nume`
        self.spread = []       # (cale, nume) — ...nume într-un tablou: indicii de după sunt nesiguri
        self.incerte = set()   # căi de tablou cu spread înainte
        self.fabrici = self._fabrici()   # NUME -> tipul exercițiului pe care îl întoarce funcția NUME(...)

    def _fabrici(self):
        """const NUME = (...) => ... {t:'tip', ...} ... / function NUME(...){ ... {t:'tip'} ... }: funcțiile care fac
        exerciții. Tipul = primul `t:'...'` scris în corpul lor (un șir scurt, fără spații)."""
        t, pair, out = self.t, self.pair, {}
        n = len(t)
        for j in range(n - 3):
            x = t[j]
            a = b = None
            if x.k == "id" and x.v in ("const", "let", "var") and t[j + 1].k == "id" and t[j + 2].v == "=":
                k = j + 3
                pk = pair.get(k)
                if t[k].v == "(" and pk is not None and pk + 1 < n and t[pk + 1].v == "=>":
                    a, b = k, pk + 2
                elif t[k].k == "id" and k + 1 < n and t[k + 1].v == "=>":
                    a, b = k, k + 2
                elif t[k].k == "id" and t[k].v == "function":
                    a, b = k, k + 1
                if a is None:
                    continue
                # corpul: un bloc {...}, o paranteză (...) sau o expresie până la ; / declarația următoare
                c = b
                while c < n and not (t[c].k == "p" and t[c].v in ("{", "(")) and t[c].v != ";":
                    c += 1
                if c >= n or t[c].v == ";":
                    continue
                fin = pair.get(c, c)
                # corpul unei expresii-săgeată poate continua: Object.assign({...},o) -> căutăm până la ; sau linia nouă
                while fin + 1 < n and t[fin + 1].k == "p" and t[fin + 1].v in (".", "("):
                    nx = fin + 2 if t[fin + 1].v == "." else fin + 1
                    if t[nx].v == "(":
                        fin = pair.get(nx, nx)
                    elif nx + 1 < n and t[nx + 1].v == "(":
                        fin = pair.get(nx + 1, nx + 1)
                    else:
                        break
                nume = t[j + 1].v
            elif x.k == "id" and x.v == "function" and t[j + 1].k == "id" and t[j + 2].v == "(":
                c = pair.get(j + 2, j + 2) + 1
                if c >= n or t[c].v != "{":
                    continue
                fin, nume = pair.get(c, c), t[j + 1].v
            else:
                continue
            for q in range(c, min(fin, n - 2)):
                if t[q].k in ("id", "str") and t[q].v == "t" and t[q + 1].v == ":" and t[q + 2].k == "str" \
                        and re.fullmatch(r"[A-Za-z][\w-]{0,30}", t[q + 2].v) and (t[q - 1].v in ("{", ",")):
                    out[nume] = t[q + 2].v
                    break
        return out

    def _skip_expr(self, j, end):
        t, pair = self.t, self.pair
        while j < end:
            x = t[j]
            if x.k == "p" and x.v in ("(", "[", "{"):
                j = pair.get(j, j) + 1
                continue
            if x.k == "p" and x.v in (",", ")", "]", "}", ";"):
                return j
            j += 1
        return j

    def valoare(self, j, end, cale):
        t = self.t
        if j >= end:
            return j, None
        x = t[j]
        if x.k == "p" and x.v == "{":
            self.obiect(j, cale)
            k = self.pair.get(j, j) + 1
            return self._skip_expr(k, end), ("obj", None)
        if x.k == "p" and x.v == "[":
            self.tablou(j, cale)
            k = self.pair.get(j, j) + 1
            gen = k < end and t[k].k == "p" and t[k].v in (".", "?.")
            return self._skip_expr(k, end), ("arr_gen" if gen else "arr", None)
        # (t[end] e paranteza care închide: ultimul element al unui tablou/obiect se termină chiar pe ea)
        if x.k in ("str",) and j + 1 <= end and t[j + 1].k == "p" and t[j + 1].v in (",", "}", "]", ")"):
            return j + 1, ("str", x.v)
        if x.k == "tmpl" and j + 1 <= end and t[j + 1].k == "p" and t[j + 1].v in (",", "}", "]", ")"):
            return j + 1, ("tmpl", None)
        if x.k == "id" and j + 1 <= end and t[j + 1].k == "p" and t[j + 1].v in (",", "}", "]", ")"):
            if x.v not in ("true", "false", "null", "undefined"):
                self.refs.append((cale, x.v))
            return j + 1, ("id", x.v)
        # FABRICI (16.11): un exercițiu scris ca apel OP({...}), unde const OP=o=>Object.assign({t:'explorerop',...},o)
        if x.k == "id" and x.v in self.fabrici and j + 1 <= end and t[j + 1].v == "(":
            inchide = self.pair.get(j + 1, j + 1)
            k = j + 2
            while k < inchide and not (t[k].k == "p" and t[k].v == "{"):
                k += 1
            if k < inchide:
                rec = self.obiect(k, cale)
            else:
                rec = {"chei": {}, "line": x.line}
                self.obiecte[tuple(cale)] = rec
            rec["chei"].setdefault("t", ("str", self.fabrici[x.v]))
            rec["chei"].setdefault("_linii", {}).setdefault("t", x.line)
            rec["fabrica"] = x.v
            return self._skip_expr(inchide + 1, end), ("fabrica", x.v)
        # o expresie (apel, aritmetică, funcție): poate conține literali (ex. FisaNiveluri.curat({...}))
        k = self._skip_expr(j, end)
        return k, ("expr", t[j].v if t[j].k in ("id", "str") else None)

    def obiect(self, i, cale):
        t, end = self.t, self.pair.get(i, i)
        chei, j = {}, i + 1
        rec = {"chei": chei, "line": t[i].line}
        self.obiecte[tuple(cale)] = rec
        while j < end:
            x = t[j]
            if x.k == "p" and x.v == ",":
                j += 1
                continue
            if x.k == "p" and x.v == "...":
                k = self._skip_expr(j + 1, end)
                if t[j + 1].k == "id":
                    chei["..." + t[j + 1].v] = ("spread", t[j + 1].v)
                j = k
                continue
            if x.k == "p" and x.v == "[":      # cheie calculată
                j = self.pair.get(j, j) + 1
                if j < end and t[j].v == ":":
                    j = self._skip_expr(j + 1, end)
                continue
            if x.k in ("id", "str", "num"):
                cheie = x.v
                nx = t[j + 1] if j + 1 < end else None
                if nx is not None and nx.k == "p" and nx.v == ":":
                    k, v = self.valoare(j + 2, end, cale + [cheie])
                    chei[cheie] = (v[0], v[1]) if v else (None, None)
                    chei.setdefault("_linii", {})
                    chei["_linii"][cheie] = x.line
                    j = k
                    continue
                if nx is not None and nx.k == "p" and nx.v == "(":      # metodă: nume(...){...}
                    k = self.pair.get(j + 1, j + 1) + 1
                    if k < end and t[k].v == "{":
                        k = self.pair.get(k, k) + 1
                    chei[cheie] = ("metoda", None)
                    j = k
                    continue
                if x.k == "id" and x.v in ("get", "set", "async") and nx is not None and nx.k == "id":
                    j += 1
                    continue
                chei[cheie] = ("shorthand", cheie)       # {a, b}
                if x.k == "id":
                    self.refs.append((cale + [cheie], cheie))
                j += 1
                continue
            j += 1
        return rec

    def tablou(self, i, cale):
        t, end = self.t, self.pair.get(i, i)
        j, idx, incert = i + 1, 0, False
        while j < end:
            x = t[j]
            if x.k == "p" and x.v == ",":
                j += 1
                continue
            if x.k == "p" and x.v == "...":
                nume = t[j + 1].v if t[j + 1].k == "id" else None
                self.spread.append((cale + [idx], nume))
                incert = True
                j = self._skip_expr(j + 1, end)
                idx += 1
                continue
            c = cale + [idx]
            if incert:
                self.incerte.add(tuple(c))
            j, _ = self.valoare(j, end, c)
            idx += 1
        return idx

    def radacini(self):
        """const/let/var NUME = {..}|[..] (la orice adâncime) și JocMotor.porneste(...)."""
        t = self.t
        n = len(t)
        for j in range(n - 3):
            x = t[j]
            if x.k == "id" and x.v in ("const", "let", "var") and t[j + 1].k == "id" and t[j + 2].v == "=":
                v = t[j + 3]
                if v.k == "p" and v.v in ("{", "["):
                    end = self.pair.get(j + 3, j + 3) + 1
                    self.valoare(j + 3, max(end, j + 4), [t[j + 1].v])
            if x.k == "id" and x.v == "porneste" and j > 0 and t[j - 1].v == "." and t[j + 1].v == "(":
                a = j + 2
                if t[a].k == "p" and t[a].v == "{":
                    self.obiect(a, ["porneste"])
                elif t[a].k == "id":
                    self.refs.append((["porneste"], t[a].v))


def definitii(toks, pair):
    """Simbolurile definite într-un script: const X = ..., function X(...){...}; -> {X: (linie_start, linie_sfarsit)}"""
    out = {}
    n = len(toks)
    for j in range(n - 2):
        x = toks[j]
        if x.k == "id" and x.v in ("const", "let", "var") and toks[j + 1].k == "id" and toks[j + 2].v == "=":
            k = j + 3
            # capătul valorii: sare peste paranteze până la ; sau la o declarație nouă la același nivel
            ultim = k
            while k < n:
                y = toks[k]
                if y.k == "p" and y.v in ("(", "[", "{"):
                    ultim = pair.get(k, k)
                    k = ultim + 1
                    continue
                if y.k == "p" and y.v in (";", ",", ")", "]", "}"):
                    break
                if y.k == "id" and y.v in ("const", "let", "var", "function") and k > j + 3:
                    break
                ultim = k
                k += 1
            out.setdefault(toks[j + 1].v, (x.line, toks[min(ultim, n - 1)].line))
        if x.k == "id" and x.v == "function" and toks[j + 1].k == "id" and toks[j + 2].v == "(":
            k = pair.get(j + 2, j + 2) + 1
            if k < n and toks[k].v == "{":
                out.setdefault(toks[j + 1].v, (x.line, toks[pair.get(k, k)].line))
    return out


# ---------------------------------------------------------------- fișiere: citire, exporturi
_cache_text = {}


def text(p: Path) -> str:
    k = str(p)
    if k not in _cache_text:
        _cache_text[k] = p.read_text(encoding="utf-8", errors="replace")
    return _cache_text[k]


_cache_tok = {}
CUV_CHEIE = {"if", "for", "while", "switch", "catch", "else", "return", "function", "do", "try", "with"}


def jetoane_fisier(p: Path):
    k = str(p)
    if k not in _cache_tok:
        toks, _, _ = lex(text(p))
        _cache_tok[k] = (toks, perechi(toks))
    return _cache_tok[k]


def cine_cuprinde(toks, pair, idx):
    """Lanțul funcțiilor care cuprind jetonul idx, din interior spre exterior: ['checkButton(callback)', 'render'].
    Merge pe acoladele deschise (perechile), nu pe indentare."""
    deschise = sorted(o for o, c in pair.items() if o < c and toks[o].v == "{" and o < idx < c)
    lant = []
    for o in reversed(deschise):
        a = toks[o - 1] if o > 0 else None
        nume = None
        if a is not None and a.v == ")":
            p = pair.get(o - 1)
            if p is not None and p > 0:
                b = toks[p - 1]
                if b.k == "id" and b.v not in CUV_CHEIE:
                    nume = b.v                                   # function NUME(...){ / NUME(...){ (metodă)
                elif b.k == "id" and b.v == "function" and p > 2 and toks[p - 2].v in ("=", ":"):
                    nume = toks[p - 3].v                         # NUME = function(...){ / NUME: function(...){
        elif a is not None and a.v == "=>":
            q = pair.get(o - 2, o - 2) if toks[o - 2].v == ")" else o - 2
            if q > 0:
                b = toks[q - 1]
                if b.v in ("=", ":") and q > 1:
                    nume = toks[q - 2].v                         # const NUME = (...) => {   /   NUME: (...) => {
                elif b.v == "(" and q > 1 and toks[q - 2].k == "id":
                    nume = toks[q - 2].v + "(callback)"          # checkButton(() => {...})
        if nume:
            lant.append(nume)
    return lant


def verdict_in_callback(toks, pair, idx):
    """În checkButton(() => { ... }): funcția care DECIDE verdictul = cea care dă valoarea testată de if-ul de dinaintea
    lui resolve(true). Ex. tip-excel.js:1073-1074: const p=probleme(); if(!p.length) resolve(true) -> probleme;
    simppt.js:921-922: const lipsa=Q.teste.find(t=>!trece(S,t)); if(!lipsa) -> trece. Urmărește atribuirile cel mult 3 pași."""
    deschise = sorted(o for o, c in pair.items() if o < c and toks[o].v == "{" and o < idx < c)
    for o in reversed(deschise):
        if toks[o - 1].v != "=>":
            continue
        q = pair.get(o - 2, o - 2) if toks[o - 2].v == ")" else o - 2
        if not (q > 1 and toks[q - 1].v == "(" and toks[q - 2].v == "checkButton"):
            continue
        # if-ul cel mai apropiat dinaintea lui resolve, în callback
        cond = None
        for z in range(idx - 1, o, -1):
            if toks[z].v == "if" and toks[z + 1].v == "(":
                cond = (z + 2, pair.get(z + 1, z + 1))
                break
        def apeluri(a, b):
            return [toks[z].v for z in range(a, b) if toks[z].k == "id" and toks[z + 1].v == "(" and toks[z - 1].v not in (".", "?.")
                    and toks[z].v not in CUV_CHEIE]
        def nume_libere(a, b):
            return [toks[z].v for z in range(a, b) if toks[z].k == "id" and toks[z - 1].v not in (".", "?.") and toks[z].v not in CUV_CHEIE]
        if cond:
            de_urmarit, vazute = nume_libere(*cond), set()
            gasit = apeluri(*cond)
            if gasit:
                return gasit[0]
            for _pas in range(3):
                urm = []
                for v in de_urmarit:
                    if v in vazute:
                        continue
                    vazute.add(v)
                    for z in range(cond[0] - 1, o, -1):       # ultima atribuire v = ... înaintea if-ului
                        if toks[z].v == v and toks[z + 1].v == "=" and toks[z - 1].v not in (".", "?."):
                            fin = z + 2
                            while fin < cond[0] and toks[fin].v not in (";", ","):
                                fin = pair.get(fin, fin) + 1 if toks[fin].v in ("(", "[", "{") else fin + 1
                            c = apeluri(z + 2, fin)
                            if c:
                                return c[0]
                            urm += nume_libere(z + 2, fin)
                            break
                de_urmarit = urm
        return None
    return None


_cache_res = {}


def situri_resolve(cheie, rr, toks, pair, interval):
    """Apelurile api.resolve(...) dintr-un fișier (sau dintr-un interval de rânduri al paginii), cel din „Verifică”
    (checkButton) întâi: „fișier:rând render › checkButton(callback) · verdict: probleme()”."""
    if cheie in _cache_res:
        return _cache_res[cheie]
    out = []
    for z in range(1, len(toks) - 2):
        t = toks[z]
        if t.k != "id" or t.v != "resolve" or toks[z + 1].v != "(":
            continue
        if interval and not (interval[0] <= t.line <= interval[1]):
            continue
        membru = toks[z - 1].v == "." and toks[z - 2].v in ("api", "A", "apiP", "API", "a")
        liber = toks[z - 1].v != "." and toks[z + 2].v in ("true", "false", "ok", "!", "bun", "toate", "r")
        if not (membru or liber):
            continue
        lant = cine_cuprinde(toks, pair, z)
        in_chk = any(x.startswith("checkButton") for x in lant)
        verd = verdict_in_callback(toks, pair, z) if in_chk else None
        s = f"{rr}:{t.line} " + " › ".join(reversed(lant[:3])) + (f" · verdict: {verd}()" if verd else "")
        out.append((0 if in_chk else 1, t.line, s.strip()))
    vazut, rez = set(), []
    for _p, ln, s in sorted(out):
        if ln not in vazut:
            vazut.add(ln)
            rez.append(s)
    _cache_res[cheie] = rez
    return rez


_cache_curat = {}


def cod_curat(p: Path) -> str:
    k = str(p)
    if k not in _cache_curat:
        _cache_curat[k] = fara_comentarii(text(p))
    return _cache_curat[k]


def rel(p: Path) -> str:
    return p.resolve().relative_to(WT.resolve()).as_posix()


def app_fisier(r: str):
    for pat, app in SIM_APP_RE:
        if re.search(pat, r):
            return app
    return None


def e_comun(r):
    return any(re.search(p, r) for p in COMUNE_RE)


def e_afara(r):
    return any(re.search(p, r) for p in AFARA_RE)


EXPORT_RE = re.compile(r"(?:\bwindow|\bG|\bglobalThis)\.([A-Za-z_$][\w$]*)\s*=(?!=)")


def exporturi(p: Path):
    """Numele globale puse de un fișier .js (window.X= / G.X= cu G=window) + declarațiile de la col. 0 dacă fișierul
    nu e învelit într-o funcție (IIFE)."""
    s = text(p)
    nume = {}
    for m in EXPORT_RE.finditer(s):
        nume.setdefault(m.group(1), s.count("\n", 0, m.start()) + 1)
    # primul cod după comentariile de la început (antetele lungi depășesc ușor 4000 de caractere)
    inceput = re.sub(r"\A(?:\s+|/\*.*?\*/|//[^\n]*\n)*", "", s, count=1, flags=re.S)[:200]
    if not re.match(r"['\"]use strict['\"];?\s*\(|[;!(]?\s*\(?\s*function\s*\(|\(\s*\(\s*\)\s*=>", inceput):
        for m in re.finditer(r"^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)", s, re.M):
            nume.setdefault(m.group(1), s.count("\n", 0, m.start()) + 1)
    return nume


# ---------------------------------------------------------------- gesturile: reguli pe cod (simulat) și pe text (predat)
def _k(*nume):
    alt = "|".join(re.escape(x) for x in nume)
    return (r"(?:\b(?:k|kl|lk|kk|key|e\.key|ev\.key|ev\.code|e\.code|event\.key)\s*===?\s*'(?:%s)'|case\s*'(?:%s)'\s*:"
            r"|data-k=\"(?:%s)\")" % (alt, alt, alt.lower()))


def _kbd(*nume):
    alt = "|".join(re.escape(x) for x in nume)
    return r"(?:<kbd>\s*(?:%s)\s*</kbd>|K\(\s*'(?:%s)'\s*\)|\btasta\s+(?:<[^>]+>\s*)?(?:%s)\b)" % (alt, alt, alt)


GESTURI = [
    # id, descriere, regex pe COD (simulatorul îl face), regex pe TEXT (lecția îl predă/cere)
    ("clic_fila", "clic pe o filă (a panglicii sau a ferestrei)",
     r"data-tab=|\[data-tab\]|dataset\.tab\b|data-t=\"tab-|\[data-t\]|dataset\.t\b|role=\"tab\"|atribFila",
     r"\bfil(?:a|ele|ei)\s+(?:<[^>]+>\s*)*[„\"]?[A-ZĂÂÎȘȚ]"),
    ("clic_comanda_panglica", "clic pe o comandă din panglică",
     r"UiPanglica\.html|\bUP\.html\(|legaturi\s*[:=]|data-rb=|\[data-rb\]", r"\([A-Z][\w&' -]{1,30}\)\s*(?:</[^>]+>\s*)*›"),
    ("lansator_grup", "clic pe săgeata ↘ a unui grup (fereastra/panoul grupului)",
     r"lansator|DialogLauncher|ParagraphDialog|FontDialog|ShowClipboard|StylesPane|PageSetupDialog|FormatCellsDialog",
     r"săgeat[aă] mic[aă]|↘|lansator"),
    ("meniu_derulant", "deschide lista ▾ a unui buton (galerie, culori, variante)",
     r"aria-expanded|meniu\s*[:=]\s*\{|\bmen\.[A-Z]\w*\s*=", r"▾|săgeata de lângă|lista de lângă"),
    ("fila_file", "deschide File (Fișier) / Backstage", r"[Bb]ackstage|Fila Fișier|Meniul File|data-t=\"tab-file\"|data-wo=\"fisier\"",
     r"Fișier\s*\(File\)|File\s*\(Fișier\)|\bfila\s+(?:<[^>]+>\s*)*Fișier|Backstage"),
    ("acces_rapid", "buton din bara Acces rapid (Quick Access)", r"\bqat\b|Acces rapid|Quick Access", r"Acces rapid|Quick Access"),
    ("clic_dreapta", "clic dreapta (meniul contextual)", r"contextmenu", r"clic(?:-|\s)+(?:cu\s+butonul\s+din\s+)?dreapta|click dreapta|butonul din dreapta al mouse"),
    ("dublu_clic", "dublu clic", r"dblclick|dublu-?clic", r"dublu[\s-]?cli[ck]|de două ori repede"),
    ("tragere", "trage cu mouse-ul/degetul (selecție, mutare, redimensionare)",
     r"pointermove|dragstart|draggable|mousemove|touchmove", r"\btrag(?:i|e|eți|ere|erea)\b|glisez|ține(?:ți)? apăsat"),
    ("selectie", "selectează (text, o zonă de celule, un element)",
     r"getSelection|selectionStart|setSelectionRange|\bank\s*=|dragSel|\bselZ\(|\bselecteaza\(", r"selectez|selectează|selectezi|selecția|selectați"),
    ("shift_clic", "Shift+clic (extinde selecția)", r"shiftKey", r"Shift\s*(?:\+|și)\s*clic"),
    ("ctrl_clic", "Ctrl+clic (adaugă la selecție)", r"(?:ctrlKey|metaKey)[^\n]{0,80}(?:click|pointerdown|button)", r"Ctrl\s*(?:\+|și)\s*clic"),
    ("rotita", "rotița mouse-ului (derulare/zoom)", r"'wheel'", r"rotiț"),
    ("tastare", "tastează text", r"type=\"text\"|contenteditable|beforeinput|'input'|\"input\"", r"tastez|tastezi|tastează|tastați"),
    ("tasta_enter", "tasta Enter", _k("Enter"), _kbd("Enter") + r"|Enter\s*↵"),
    ("tasta_tab", "tasta Tab", _k("Tab"), _kbd("Tab") + r"|Tab\s*⇥"),
    ("tasta_backspace", "tasta Backspace (⌫)", _k("Backspace"), _kbd("Backspace", "⌫") + r"|⌫"),
    ("tasta_delete", "tasta Delete", _k("Delete"), _kbd("Delete", "Del")),
    ("tasta_esc", "tasta Esc", _k("Escape", "Esc"), _kbd("Esc", "Escape")),
    ("tasta_f2", "tasta F2 (redenumire / editare)", _k("F2"), _kbd("F2")),
    ("tasta_f4", "tasta F4 ($ în adrese)", _k("F4"), _kbd("F4")),
    ("tasta_f5", "tasta F5 (expunere / reîmprospătare)", _k("F5"), _kbd("F5")),
    ("tasta_f12", "tasta F12 (Save As)", _k("F12"), _kbd("F12")),
    ("sageti", "săgețile", _k("ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight") + r"|Arrow\((?:Left|Right|Up|Down)",
     r"tastele cu săgeț|săgețile|săgeata (?:în )?(?:sus|jos|stânga|dreapta)|<kbd>\s*[←→↑↓]\s*</kbd>"),
    ("tasta_home_end", "Home / End", _k("Home", "End") + r"|\|Home\|End\)", _kbd("Home", "End")),
    ("tasta_pagina", "Page Up / Page Down", _k("PageDown", "PageUp"), _kbd("Page Down", "Page Up", "PgDn", "PgUp")),
    ("alt_sageti", "Alt+săgeată (înapoi/înainte/sus în Explorer)", r"altKey[^\n]{0,60}Arrow|Alt \+ săgeată", r"Alt\s*\+\s*(?:săgeat|←|→|↑)"),
    ("tasta_windows", "tasta Windows", r"'Meta'|tasta Windows|data-k=\"win\"", r"tasta\s+(?:<[^>]+>\s*)?Windows|⊞"),
    ("umplere_tragere", "trage pătrățelul de umplere (fill handle)", r"fillTo|fill handle|[Pp]ătrățelul de umplere",
     r"pătrățelul (?:de umplere|din colț)|fill handle|mânerul de umplere"),
    ("zoom", "zoom (glisor, +/−)", r"Zoom In|Zoom Out|[Gg]lisorul zoom|\bzoom\s*[+\-*]?=|setZoom|\bzoom\(", r"\bzoom\b|glisorul"),
]
# Ctrl+literă: un rând de cod care pomenește Ctrl (nenegat) + o literă comparată cu tasta
CTRL_LINIE = re.compile(r"(?<![!\w.])(?:e|ev|event)\.ctrlKey|\((?:e|ev|event)\.ctrlKey|(?<![!\w])ctrl\s*&&|(?<![!\w.])c\s*&&\s*\(?\s*(?:kl|k|lk|kk|key)\b")
CTRL_LITERA = re.compile(r"(?:\bkl|\bk|\blk|\bkk|\bkey|e\.key|ev\.key)(?:\.toLowerCase\(\))?\s*===?\s*'([a-zA-Z])'|(?:e|ev)\.code\s*===?\s*'Key([A-Z])'")
CTRL_TASTA_FN = re.compile(r"\(\s*'([a-zA-Z])'\s*,\s*\{\s*ctrlKey\s*:\s*true")
CTRL_TEXT = re.compile(r"Ctrl\s*\+\s*(?:</?kbd>\s*)?(Shift\s*\+\s*)?(?:</?kbd>\s*)?([A-Za-z])\b")
SHIFT_POZ = re.compile(r"(?<![!\w.])(?:e|ev|event)\.shiftKey\s*&&")
CTRL_BLOC = re.compile(r"if\s*\(\s*(?:ctrl|c|(?:e|ev)\.ctrlKey)\s*\)\s*\{")
GEST_DESCR = {g[0]: g[1] for g in GESTURI}
for _l in "abcdefghijklmnopqrstuvwxyz":
    GEST_DESCR[f"ctrl_{_l}"] = f"Ctrl+{_l.upper()}"
    GEST_DESCR[f"ctrl_shift_{_l}"] = f"Ctrl+Shift+{_l.upper()}"


def fara_comentarii(src):
    """Același text, cu comentariile JS înlocuite de spații (rândurile rămân pe loc): regulile nu se potrivesc pe ce
    scrie în comentarii (antetul lui ui-panglica.js pomenește „bara Acces rapid”, dar nu o desenează)."""
    toks, _, _ = lex(src)
    out, prev = [], 0
    for t in toks + [Tok("p", "", 0, len(src), len(src))]:
        gol = src[prev:t.a]
        out.append(re.sub(r"[^\n]", " ", gol) if "/" in gol else gol)
        out.append(src[t.a:t.b])
        prev = t.b
    return "".join(out)

# ---------------------------------------------------------------- suprafețele: reguli pe codul simulatoarelor
# (id fără prefixul aplicației, nume, regex). Filele panglicii și ferestrele (dialogurile) se adaugă separat.
SUPRAFETE_REGULI = {
    "_office": [
        ("bara_titlu", "bara de titlu", r"bara de titlu|AutoSave|Document1 - Word|Presentation1|Book1|[\"']titlu[\"']\s*:"),
        ("acces_rapid", "bara Acces rapid (Quick Access Toolbar)", r"\bqat\b|Acces rapid|Quick Access|\binainte\s*:"),
        ("buton_file", "butonul/fila File (Fișier)", r"pg-fisier|data-t=\"tab-file\"|Fila Fișier|Meniul File|Fila File"),
        ("backstage", "File/Backstage (meniul Fișier: Nou, Deschidere, Salvare ca, Imprimare...)", r"[Bb]ackstage|Fila Fișier \(File\)|Meniul File|Fila File"),
        ("bara_stare", "bara de stare (jos)", r"bara de stare|Bara de stare|bara-stare|status-?bar|Page \d+ of|Slide \d+ of|MODE_TXT|\bReady\b"),
        ("meniu_clic_dreapta", "meniul de la clic dreapta", r"contextmenu|[Mm]eniul de (?:la )?clic dreapta"),
        ("mini_bara", "bara mică de formatare (Mini toolbar)", r"Mini ?toolbar|mini-bara|minibar|bara mică"),
        ("zoom", "glisorul de zoom + butoanele −/+ (bara de stare)", r"Zoom In|Zoom Out|[Gg]lisorul zoomului|Zoom: glisorul|aria-label=\"Zoom\""),
        ("tastele_simulate", "[sim] butoanele de taste de sub document (pentru telefon)", r"data-k=\"(?:enter|tab|bs|del)\"|Tastele din"),
    ],
    "word": [
        ("zona_document", "pagina documentului", r"role=\"document\"|wo-doc|Pagina documentului"),
        ("rigla", "riglele (Ruler)", r"[Rr]igl|Ruler"),
        ("bara_derulare", "barele de defilare", r"[Bb]ara de defilare|Derulează în|scrollbar"),
        ("vederi", "butoanele de vedere (Read Mode / Print Layout / Web Layout)", r"Print Layout|Read Mode|Web Layout"),
        ("panou_navigare", "panoul Navigation (Navigare)", r"Navigation Pane|Panoul Navigare|NavigationPane"),
        ("panou_stiluri", "panoul Styles", r"StylesPane|panoul Stiluri|Styles pane"),
        ("panou_clipboard", "panoul Clipboard", r"ShowClipboard|panoul Clipboard"),
        ("meniu_tabel", "grila Insert Table ▾", r"TableInsertGallery|wo-grila|Insert Table\.\.\."),
        ("meniu_imagini", "lista Pictures ▾ (This Device / Stock / Online)", r"FlyoutAnchorInsertPictures|This Device"),
        ("optiuni_aspect", "butonul Layout Options al imaginii", r"Layout Options"),
        ("explorer_in_word", "[sim] fereastra Explorer deschisă din Word", r"Explorer \(Explorer de fișiere\)"),
    ],
    "excel": [
        ("caseta_nume", "caseta de nume (Name Box)", r"[Cc]aseta de nume|Name Box"),
        ("bara_formule", "bara de formule (fx)", r"[Bb]ara de formule|[Ff]ormula [Bb]ar|\bfx\b"),
        ("grila", "foaia: celulele, literele coloanelor, numerele rândurilor", r"Foaia de calcul|class=\"gw|\bgrila\b|data-a=\"[A-Z]"),
        ("file_foi", "filele foilor (sheet tabs) + butonul + (foaie nouă)", r"[Ff]ilele foilor|sheet tabs|Foaie nouă|New sheet|Sheet1"),
        ("maner_umplere", "pătrățelul de umplere (fill handle)", r"[Pp]ătrățelul de umplere|fill handle|fillTo"),
        ("lista_functii", "lista de funcții la =SU… (Formula AutoComplete) + bula cu argumentele", r"lista de funcții|autocomplet|bula"),
        ("grafic", "graficul (Chart) + butoanele lui", r"[Cc]hart|[Gg]rafic"),
        ("lansator_registru", "[sim] Excel fără registru deschis / folderele registrului", r"fără niciun registru|Fișierele din folder"),
        ("butoane_foaie_mare", "[sim] + rând / + coloană (foaia mare, pentru telefon)", r"Adaugă un rând la foaie|Adaugă o coloană"),
    ],
    "powerpoint": [
        ("panou_miniaturi", "panoul cu miniaturile diapozitivelor", r"miniatur|[Tt]humbnail"),
        ("zona_diapozitiv", "diapozitivul în lucru (substituenții)", r"substituent|placeholder|Titlul diapozitivului"),
        ("panou_note", "panoul Notes (note)", r"\bNotes\b|panoul de note"),
        ("expunere", "expunerea (Slide Show)", r"[Ee]xpunere|Slide Show"),
        ("panou_format", "panoul Format (ex. Format Background)", r"Format Background|Format Shape|panoul de formatare"),
        ("comentarii", "butonul/panoul Comments", r"Comments \(Comentarii\)|\bComments\b"),
        ("explorer_in_ppt", "[sim] File Explorer simplificat (Save As/Open)", r"File Explorer simplificat"),
    ],
    "explorer": [
        ("fereastra", "fereastra File Explorer (titlu, minimizare/maximizare/închidere)", r"Închide File Explorer|Explorer simulat|aria-label=\"Închidere\""),
        ("butoane_navigare", "Înapoi / Înainte / Sus", r"Înapoi|Înainte|Un nivel mai sus|aria-label=\"Sus\""),
        ("bara_adresa", "caseta de adresă (calea)", r"[Cc]aseta de adresă|[Bb]ara de adresă|address"),
        ("cautare", "caseta de căutare", r"[Cc]aseta de căutare"),
        ("bara_comenzi", "bara de comenzi (Nou, Decupare, Copiere, Lipire, Redenumire, Ștergere, Sortare, Vizualizare...)", r"[Bb]ara de comenzi"),
        ("panou_navigare", "panoul de navigare (stânga)", r"[Pp]anoul de navigare|Panoul din stânga"),
        ("zona_continut", "lista fișierelor și folderelor (zona din dreapta)", r"Explorer simulat|class=\"(?:ex|eo|eg)-(?:lista|fis|it)"),
        ("bara_stare", "bara de stare (câte elemente)", r"elemente selectate|\belemente\b|bara de stare"),
        ("meniu_clic_dreapta", "meniul de la clic dreapta", r"contextmenu"),
        ("redenumire", "redenumirea pe loc (caseta cu numele nou)", r"Numele nou|Redenumire"),
        # așteptate în Explorer-ul din Windows 11, încă nefolosite de lecții (de confirmat din referință):
        ("file_fereastra", "filele ferestrei Explorer (+ filă nouă)", r"[Ff]ilă nouă|New tab"),
        ("panou_detalii", "panoul Detalii / Previzualizare", r"[Pp]anoul (?:de )?[Dd]etalii|[Pp]revizualizare"),
        ("meniu_nou", "lista Nou ▾ (Folder, documente)", r"[Mm]eniul Nou|data-[a-z]+=\"nou\""),
        ("meniu_sortare_vizualizare", "listele Sortare ▾ / Vizualizare ▾ din bara de comenzi", r"Sortare ▾|Vizualizare ▾|Sortați|Vizualizați"),
    ],
    "windows": [
        ("desktop", "desktopul (pictograme, fundal)", r"Ecran Windows simulat|desktop"),
        ("bara_activitati", "bara de activități (Start, căutare, aplicații fixate, ceas)", r"[Bb]ara de activități|taskbar"),
        ("meniu_start", "meniul Start", r"Meniul Start"),
        ("calendar", "calendarul de la ceas", r"Calendarul"),
        ("cautare", "căutarea din Start/bară", r"Caută o aplicație|[Cc]ăutare"),
        ("fereastra", "o fereastră (bara de titlu, Minimizare / Maximizare / Închidere)", r"Minimizare|Maximizare|Închidere|Închide fereastra"),
        ("meniu_clic_dreapta", "meniul de la clic dreapta", r"contextmenu|[Mm]eniul de clic dreapta"),
        ("alimentare", "butonul de alimentare (Oprire / Repornire)", r"Alimentare"),
        ("securitate_windows", "aplicația Securitate Windows (scanare)", r"Securitate Windows|[Ss]canare"),
        ("zona_notificare", "colțul din dreapta al barei (ceas, rețea, volum, notificări)", r"[Zz]ona de notificare|[Cc]easul"),
    ],
    "paint": [
        ("bara_titlu", "bara de titlu", r"bara de titlu|Paint din pagină"),
        ("meniu", "meniul de sus (Fișier, Editare, Vizualizați)", r"meniul de sus|aria-label=\"Fișier\"|Vizualizați"),
        ("bara_instrumente", "bara cu instrumente (Selecție, Imagine, Instrumente, Pensule, Forme, Dimensiune, Culori)", r"bara cu instrumente|Pensule|Forme"),
        ("culori", "grupul Culori / paleta", r"Paleta de culori|grupul Culori|Editare culori"),
        ("panza", "pânza (zona de desen)", r"pânza|panza"),
        ("bara_stare", "bara de stare (poziție, mărime, zoom)", r"bara de stare|Potrivire la fereastră"),
        ("bara_text", "bara Text (font, mărime, B/I/U)", r"FONTURI|bara Text|Font"),
        ("salvare_deschidere", "Salvați ca / Deschidere (fereastra de fișiere)", r"Salvați ca|Deschidere|Salvați lucrul"),
    ],
}

DIALOG_RE = re.compile(r"role=\"dialog\"(?:[^>]{0,40}?)aria-label=\"([^\"]{2,90})\"")
TAB_ID_RE = re.compile(r"\b(Tab(?!le\b|Start\b|Key\b|Indent)[A-Z][A-Za-z0-9]+)\b")
# numele de file inventate de simulatoare -> id-ul oficial Microsoft (M365_SAEC: HelpTab, TabDrawInk, TabRecording)
TAB_NORM = {"TabDraw": "TabDrawInk", "TabRecord": "TabRecording", "TabHelp": "HelpTab"}
TAB_CONTEXT = {"'Picture Format'": "TabPictureToolsFormat", "'Shape Format'": "TabDrawingToolsFormat",
               "'Table Design'": "TabTableToolsDesign", "'Chart Design'": "TabChartToolsDesignNew"}
TAB_SCURT_RE = re.compile(r"data-tab=\"([a-z]+)\"|data-t=\"tab-([a-z]+)\"")
TAB_SCURT = {
    "excel": {"home": "TabHome", "insert": "TabInsert", "data": "TabData", "formulas": "TabFormulas", "view": "TabView",
              "review": "TabReview", "layout": "TabPageLayoutExcel", "design": "TabChartToolsDesignNew", "format": "TabChartToolsFormatNew"},
    "powerpoint": {"home": "TabHome", "insert": "TabInsert", "design": "TabDesign", "transitions": "TabTransitions",
                   "animations": "TabAnimations", "slideshow": "TabSlideShow", "view": "TabView", "review": "TabReview",
                   "draw": "TabDrawInk", "record": "TabRecording", "help": "HelpTab"},
    "word": {"home": "TabHome", "insert": "TabInsert", "layout": "TabPageLayoutWord", "view": "TabView", "design": "TabWordDesign"},
}


def slug(s):
    s = s.lower()
    for a, b in (("ă", "a"), ("â", "a"), ("î", "i"), ("ș", "s"), ("ş", "s"), ("ț", "t"), ("ţ", "t")):
        s = s.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "_", s).strip("_")[:40] or "x"


# etichete doar în română ale unor ferestre Office (aplicația reală e în engleză) -> numele englezesc, ca id-ul să fie același
DIALOG_ALIAS = {"Avertisment de sortare": "Sort Warning", "Sortare particularizată": "Sort"}
# role=dialog care sunt de fapt alte suprafețe (meniuri, Backstage, expunerea)
DIALOG_SUPRAFATA = {"Calendarul": "calendar", "Meniul Start": "meniu_start", "File": "backstage", "Fișier": "backstage",
                    "PowerPoint Slide Show": "expunere"}


def nume_dialog(lbl):
    """„Fereastra Insert Picture (Inserare imagine)” -> „Insert Picture”; „Ștergere (Delete)” -> „Delete”: dintre cele două
    jumătăți, cea fără diacritice și cu majusculă (eticheta din aplicația în engleză)."""
    if "${" in lbl:
        return None
    n = re.sub(r"^(?:Fereastra|Panoul|Fila)\s+", "", lbl).strip()
    m = re.match(r"^(.*?)\s+\((.*)\)\s*$", n)
    if m:
        a, b = m.group(1).strip(), m.group(2).strip()
        ascii_ = lambda s: re.fullmatch(r"[A-Za-z0-9 .:?'&-]+", s) is not None and s[:1].isupper()  # noqa: E731
        n = a if ascii_(a) or not ascii_(b) else b
    return DIALOG_ALIAS.get(n, n)


# ---------------------------------------------------------------- referința reală (fapte cu sursă)
def referinte_office():
    """Filele vizibile din dump-urile UI Automation (27.09.2026), grupurile din panglica-<app>.json (același dump) și
    listele oficiale Microsoft (OfficeDev/office-fluent-ui-command-identifiers, MIT): file contextuale, Backstage,
    Acces rapid, meniuri contextuale."""
    out = {}
    try:
        import openpyxl  # noqa: F401
    except Exception:  # noqa: BLE001
        openpyxl = None
    for app in ("word", "excel", "powerpoint"):
        r = {"file_vizibile": [], "grupuri": {}, "tabsets": {}, "core_saec": [], "backstage": [], "qat": [], "ctx": [],
             "titlu_fereastra": None, "surse": []}
        dp = CERC / f"dump_{app}_uia.json"
        if dp.exists():
            d = json.loads(text(dp))
            r["file_vizibile"] = [tuple(x) for x in d.get("file_gasite", [])]
            r["titlu_fereastra"] = [w for w in d.get("ferestre", []) if not w.startswith("UAC")]
            r["surse"].append(f"{rel(dp)} (dump UI Automation {d.get('generat')}, aplicația instalată)")
        pp = WT / "jocuri" / "_motor" / f"panglica-{app}.json"
        if pp.exists():
            d = json.loads(text(pp))
            for f in d["file"]:
                r["grupuri"][f["id"]] = {"eticheta": f["eticheta"], "grupuri": [g["eticheta"] for g in f["grupuri"]],
                                         "butoane": sum(len(g["butoane"]) for g in f["grupuri"])}
            r["surse"].append(f"{rel(pp)} (din același dump; grupuri și butoane)")
        xp = CERC / "M365_SAEC" / f"{app}controls.xlsx"
        if xp.exists() and openpyxl is not None:
            import openpyxl as ox
            ws = ox.load_workbook(xp, read_only=True).worksheets[0]
            core, sets, bs, qat, ctx = Counter(), defaultdict(set), Counter(), [], Counter()
            for i, row in enumerate(ws.iter_rows(values_only=True)):
                if i == 0:
                    continue
                ts, tab, grp = row[2], row[3], row[4]
                if ts == "None (Core Tab)" and tab:
                    core[tab] += 1
                elif ts and str(ts).startswith("TabSet") and tab and tab != "None":
                    sets[ts].add(tab)
                if ts == "None (Backstage View)" and tab and tab != "None":
                    bs[tab] += 1
                if tab == "Quick Access Toolbar":
                    qat.append(row[0])
                if ts == "None (Context Menu)" and grp:
                    ctx[grp] += 1
            r["core_saec"] = sorted(core)
            r["tabsets"] = {k: sorted(v) for k, v in sets.items()}
            r["backstage"] = sorted(bs)
            r["qat"] = qat
            r["ctx"] = sorted(ctx)
            r["surse"].append(f"{rel(xp)} (lista oficială Microsoft, https://github.com/OfficeDev/office-fluent-ui-command-identifiers, MIT)")
        out[app] = r
    return out


# ---------------------------------------------------------------- analiza unei pagini
SCRIPT_RE = re.compile(r"<script\b([^>]*)>(.*?)</script\s*>", re.S | re.I)
STYLE_RE = re.compile(r"<style\b[^>]*>.*?</style\s*>", re.S | re.I)
SRC_RE = re.compile(r"\bsrc\s*=\s*[\"']([^\"']+)[\"']")


def linii_potrivite(txt, rx, linie0=1, intervale=None, maxim=3):
    """Rândurile (numerotate de la linie0) pe care regex-ul se potrivește; intervale = [(a,b)] de rânduri permise."""
    out = []
    for k, ln in enumerate(txt.split("\n")):
        nr = linie0 + k
        if intervale is not None and not any(a <= nr <= b for a, b in intervale):
            continue
        if rx.search(ln):
            out.append(nr)
            if len(out) >= maxim:
                break
    return out


def ctrl_litere(txt, linie0=1, intervale=None):
    """{litera: [rânduri]} pentru Ctrl+literă simulat în cod."""
    out = defaultdict(list)
    rand = txt.split("\n")
    for k, ln in enumerate(rand):
        nr = linie0 + k
        if intervale is not None and not any(a <= nr <= b for a, b in intervale):
            continue
        for m in CTRL_TASTA_FN.finditer(ln):
            out[m.group(1).lower()].append(nr)
        # blocul „if(ctrl){ ... }” (tip-excel.js:918): toate literele comparate în bloc sunt Ctrl+literă
        if CTRL_BLOC.search(ln):
            adanc, kk = 0, k
            while kk < len(rand) and kk < k + 60:
                seg = rand[kk] if kk > k else ln[CTRL_BLOC.search(ln).start():]
                for m in CTRL_LITERA.finditer(seg):
                    out[(m.group(1) or m.group(2)).lower()].append(linie0 + kk)
                adanc += seg.count("{") - seg.count("}")
                if adanc <= 0 and kk > k:
                    break
                kk += 1
            continue
        if not CTRL_LINIE.search(ln):
            continue
        # tabelă de scurtături: ctrl&&CTRL_K[kl] (wordobj-formatare.js:721) -> cheile de o literă din const CTRL_K={...}
        for mm in re.finditer(r"\b([A-Z][A-Z0-9_]{1,})\[(?:kl|k|lk|kk|key)\]", ln):
            dm = re.search(r"\b(?:const|let|var)\s+" + mm.group(1) + r"\s*=\s*\{", txt)
            if dm:
                lin_def = txt.count("\n", 0, dm.start()) + linie0
                corp = txt[dm.end():dm.end() + 1500]
                adanc, fin = 1, 0
                for q, ch in enumerate(corp):
                    adanc += (ch == "{") - (ch == "}")
                    if adanc == 0:
                        fin = q
                        break
                for kk_ in re.findall(r"(?:^|[{,]\s*)([a-zA-Z])\s*:", corp[:fin]):
                    out[kk_.lower()].append(lin_def)
        sh = "shift_" if SHIFT_POZ.search(ln) else ""
        lit = [sh + (m.group(1) or m.group(2)).lower() for m in CTRL_LITERA.finditer(ln)]
        if not lit and "ctrlKey" in ln:
            for kk in range(1, 7):
                if k + kk >= len(rand) or "ctrlKey" in rand[k + kk]:
                    break
                sh2 = "shift_" if SHIFT_POZ.search(rand[k + kk]) else ""
                lit += [sh2 + (m.group(1) or m.group(2)).lower() for m in CTRL_LITERA.finditer(rand[k + kk])]
        for x in lit:
            out[x].append(nr)
    return out


class Pagina:
    def __init__(self, p: Path, exp_index):
        self.p, self.r = p, rel(p)
        self.html = text(p)
        self.exp_index = exp_index
        self.scripturi = []          # (rel, Path) din src
        self.inline = []             # (linie_start, cod, toks, Lit, defs)
        self.analiza()

    def analiza(self):
        h = self.html
        # aceeași pagină, cu comentariile din scripturi înlocuite de spații (rândurile și pozițiile rămân aceleași)
        bucati, prev = [], 0
        for m in SCRIPT_RE.finditer(h):
            if SRC_RE.search(m.group(1)):
                continue
            bucati += [h[prev:m.start(2)], fara_comentarii(m.group(2))]
            prev = m.end(2)
        bucati.append(h[prev:])
        self.html_curat = re.sub(r"<!--.*?-->", lambda m: re.sub(r"[^\n]", " ", m.group(0)), "".join(bucati), flags=re.S)
        for m in SCRIPT_RE.finditer(h):
            attrs, cod = m.group(1), m.group(2)
            sm = SRC_RE.search(attrs)
            if sm:
                src = sm.group(1).split("?")[0]
                if src.startswith(("http:", "https:", "//")):
                    self.scripturi.append((src, None))
                else:
                    q = (self.p.parent / src).resolve()
                    try:
                        self.scripturi.append((rel(q), q))
                    except ValueError:
                        self.scripturi.append((src, None))
                continue
            if 'type="application/ld+json"' in attrs or "json" in attrs.lower():
                continue
            l0 = h.count("\n", 0, m.start(2)) + 1
            toks, _, _ = lex(cod, 0, l0)
            lit = Lit(toks, self.r)
            lit.radacini()
            self.inline.append((l0, cod, toks, lit, definitii(toks, lit.pair)))

    # tipuri:{...} din configurația porneste (sau din constanta la care trimite)
    def tipuri(self):
        out = {}
        for (_, cod, toks, lit, _) in self.inline:
            pair = lit.pair
            for j, t in enumerate(toks):
                if t.k in ("id", "str") and t.v == "tipuri" and j + 2 < len(toks) and toks[j + 1].v == ":":
                    # primul { din valoarea cheii (și prin FisaNiveluri.curat({...}))
                    k = j + 2
                    if toks[k].k == "str" or toks[k].k == "tmpl":
                        continue          # „tipuri: 'Tipuri de date'” = text, nu harta tipurilor
                    while k < len(toks) and not (toks[k].k == "p" and toks[k].v == "{"):
                        if toks[k].k == "p" and toks[k].v in (",", "}"):
                            break
                        if toks[k].k == "p" and toks[k].v == "(":
                            k += 1
                            continue
                        k += 1
                    if k >= len(toks) or toks[k].v != "{":
                        continue
                    end = pair.get(k, k)
                    q = k + 1
                    while q < end:
                        x = toks[q]
                        if x.k in ("id", "str") and toks[q + 1].v == ":":
                            a = q + 2
                            b = lit._skip_expr(a, end)
                            expr = cod[toks[a].a - 0:toks[b - 1].b] if b > a else ""
                            # rădăcina simbolului: primul identificator (WordProba.punctat(X) -> WordProba; dar și argumentele)
                            # doar numele globale: nu și membrii (X.tipuri.scena -> doar X; WordProba.punctat(TipWordFormat) -> WordProba, TipWordFormat)
                            ids = [toks[z].v for z in range(a, b) if toks[z].k == "id"
                                   and not (z > 0 and toks[z - 1].k == "p" and toks[z - 1].v in (".", "?."))]
                            out[x.v] = {"expr": re.sub(r"\s+", " ", expr)[:120], "ids": ids, "line": x.line}
                            q = b
                            continue
                        q += 1
        return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--viu", action="store_true", help="compară exercițiile cu JocMotor.test.config() în Chromium (local)")
    args = ap.parse_args()
    t0 = time.time()

    # ---- indexul exporturilor tuturor fișierelor .js din lectii/_sim, jocuri/_motor, jocuri/*/ (nu _campaign)
    exp_index = {}   # nume -> [(rel, linie)]
    js_fis = sorted(set((WT / "lectii" / "_sim").glob("*.js")) | set((WT / "jocuri" / "_motor").glob("*.js"))
                    | set((WT / "jocuri").glob("*/*.js")) | set((WT / "jocuri").glob("_ghiduri/*/*.js")))
    for f in js_fis:
        for n, ln in exporturi(f).items():
            exp_index.setdefault(n, []).append((rel(f), ln))

    pagini_fis = sorted((WT / "lectii").glob("*/*/index.html")) + sorted((WT / "jocuri").glob("*/index.html"))
    pagini_fis = [p for p in pagini_fis if not rel(p).startswith("lectii/_")]

    REF = referinte_office()
    inventar, afara, neclasificate = [], [], []
    verificari = {}   # cheie -> detalii (o dată pe simbol)

    for pf in pagini_fis:
        P = Pagina(pf, exp_index)
        tip = "joc" if P.r.startswith("jocuri/") else "lectie"
        if P.r.startswith("jocuri/_fixtura"):
            tip = "fixtura"
        loaded = [(r, q) for r, q in P.scripturi if q is not None]
        loaded_rel = [r for r, _ in loaded]
        tipuri = P.tipuri()

        # simbol -> unde e definit (fișier încărcat de pagină sau chiar în pagină)
        def_inline = {}
        for (l0, cod, toks, lit, defs) in P.inline:
            for n, (a, b) in defs.items():
                def_inline.setdefault(n, (a, b))

        def unde(simbol):
            # 1) în pagină (o definiție locală acoperă un export cu același nume)
            if simbol in def_inline:
                return ("pagina", P.r, def_inline[simbol])
            for r, ln in exp_index.get(simbol, []):
                if r in loaded_rel:
                    return ("fisier", r, (ln, ln))
            # un nume exportat de un fișier pe care pagina NU îl încarcă nu poate veni de acolo: nu-i dăm aplicația
            return (None, None, (None, None))

        tipuri_info, apps_tip = {}, {}
        for cheie, inf in tipuri.items():
            ids = [x for x in inf["ids"] if x not in ("true", "false", "null")]
            rad = ids[0] if ids else None
            fel, r, (a, b) = unde(rad) if rad else (None, None, (None, None))
            app = None
            if fel == "pagina":
                app = SIMBOL_INLINE_APP.get(rad)
                if app is None:
                    # o definiție în pagină care nu e în tabel: aplicația ei din numele altor simboluri pe care le folosește
                    for x in ids[1:]:
                        f2, r2, _ = unde(x)
                        if r2 and app_fisier(r2):
                            app = app_fisier(r2)
                            break
            elif r:
                app = app_fisier(r)
                if app is None:
                    for x in ids[1:]:    # WordProba.punctat(TipWordFormat): rădăcina e în wordobj-proba.js (word)
                        f2, r2, _ = unde(x)
                        if r2 and app_fisier(r2):
                            app = app_fisier(r2)
                            break
            tipuri_info[cheie] = {"expr": inf["expr"], "simbol": rad, "definit_in": f"{r}:{a}" if r else None,
                                  "fel": fel, "aplicatie": app, "rand_in_pagina": inf["line"]}
            if app:
                apps_tip[cheie] = app
            elif cheie not in BUILTIN and rad and fel in (None, "pagina") and not (r and e_afara(r)) and \
                    re.search(r"(?i)word|excel|ppt|power|paint|explor|desktop|foaie|diapoz|panglic|fereastr|ecran|windows", rad + " " + cheie):
                # un simbol cu nume „de aplicație” pe care nu-l putem lega de un fișier din perimetru: îl arătăm, nu-l ghicim
                neclasificate.append({"pagina": P.r, "tip": cheie, "simbol": rad, "fel": fel})

        sim_files = [r for r in loaded_rel if app_fisier(r)]
        apps = Counter()
        for r in sim_files:
            if not r.startswith("jocuri/_motor/panglica-"):
                apps[app_fisier(r)] += 2
        for k, a in apps_tip.items():
            apps[a] += 3
        incarca_up = any(re.search(r"jocuri/_motor/ui-panglica\.js$", r) for r in loaded_rel)
        up_cum = "script" if incarca_up else None
        if not incarca_up and any(r.endswith("jocuri/_motor/tip-excel.js") for r in loaded_rel):
            incarca_up, up_cum = True, "dinamic: jocuri/_motor/tip-excel.js:305-306 (cerePanglica, dacă Q.panglica!==false)"

        if not apps:
            motiv = []
            outs = [r for r in loaded_rel if e_afara(r)]
            if outs:
                motiv.append("simulatoare în afara perimetrului: " + ", ".join(sorted({Path(r).name for r in outs})))
            if tipuri:
                motiv.append("tipuri: " + ", ".join(sorted(tipuri)))
            afara.append({"pagina": P.r, "tip": tip, "motiv": "; ".join(motiv) or "fără simulator (doar întrebări)"})
            continue

        aplicatii = [a for a in APLICATII if a in apps]
        principala = max(aplicatii, key=lambda a: (apps[a], -APLICATII.index(a)))

        # ---- codul simulatoarelor (simulat) și textul lecției (predat)
        cod_surse = []    # (rel, text fără comentarii, linie0, intervale|None, app)
        for r, q in loaded:
            a = app_fisier(r)
            if a and not r.startswith("jocuri/_motor/panglica-"):
                cod_surse.append((r, cod_curat(q), 1, None, a))
        # ui-panglica.js NU intră aici: desenează panglica din date, dar nu tratează niciun gest (clicurile le leagă
        # simulatorul prin `legaturi`); filele pe care le desenează se adaugă mai jos, din panglica-<app>.json
        intervale_sim = defaultdict(list)    # app -> intervale de rânduri din pagină care sunt cod de simulator
        for cheie, inf in tipuri_info.items():
            if inf["fel"] == "pagina" and inf["aplicatie"]:
                a, b = def_inline[inf["simbol"]]
                intervale_sim[inf["aplicatie"]].append((a, b))
        # funcții ajutătoare ale simulatorului din pagină (înainte de definiția lui, în același script): nu le știm sigur;
        # rămân text. Codul din pagină = doar definițiile simbolurilor din tipuri.
        for a, iv in intervale_sim.items():
            cod_surse.append((P.r, P.html_curat, 1, iv, a))
        toate_iv_sim = [x for iv in intervale_sim.values() for x in iv]
        # textul lecției = toate rândurile paginii, minus <style> și minus definițiile simulatoarelor din pagină
        stil = set()
        for m in STYLE_RE.finditer(P.html):
            a = P.html.count("\n", 0, m.start()) + 1
            b = P.html.count("\n", 0, m.end()) + 1
            stil.update(range(a, b + 1))
        n_rand = P.html.count("\n") + 1
        text_rand = [x for x in range(1, n_rand + 1) if x not in stil and not any(a <= x <= b for a, b in toate_iv_sim)]
        text_iv = []
        for x in text_rand:
            if text_iv and text_iv[-1][1] == x - 1:
                text_iv[-1][1] = x
            else:
                text_iv.append([x, x])
        text_iv = [tuple(x) for x in text_iv]

        # ---- gesturile
        gest = {}

        def adauga_g(gid, fel, r, rows):
            if not rows:
                return
            e = gest.setdefault(gid, {"gest": gid, "descriere": GEST_DESCR.get(gid, gid), "simulat": [], "predat": []})
            for x in rows:
                s = f"{r}:{x}"
                if s not in e[fel] and len(e[fel]) < 6:
                    e[fel].append(s)

        for gid, _d, rc, rt in GESTURI:
            rxc, rxt = re.compile(rc), re.compile(rt)
            for r, tx, l0, iv, a in cod_surse:
                adauga_g(gid, "simulat", r, linii_potrivite(tx, rxc, l0, iv))
            adauga_g(gid, "predat", P.r, linii_potrivite(P.html_curat, rxt, 1, text_iv))
        for r, tx, l0, iv, a in cod_surse:
            for lit_, rows in ctrl_litere(tx, l0, iv).items():
                adauga_g(f"ctrl_{lit_}", "simulat", r, rows[:3])
        for k, ln in enumerate(P.html_curat.split("\n"), 1):
            if not any(a <= k <= b for a, b in text_iv):
                continue
            for m in CTRL_TEXT.finditer(ln):
                adauga_g(f"ctrl_{'shift_' if m.group(1) else ''}{m.group(2).lower()}", "predat", P.r, [k])
        gesturi = sorted(gest.values(), key=lambda g: g["gest"])

        # ---- suprafețele atinse (desenate de simulatoarele paginii)
        sup = {}

        def adauga_s(sid, r, rows, nota=None):
            if not rows:
                return
            e = sup.setdefault(sid, {"id": sid, "dovada": []})
            for x in rows:
                s = f"{r}:{x}" + (f" ({nota})" if nota else "")
                if s not in e["dovada"] and len(e["dovada"]) < 4:
                    e["dovada"].append(s)

        for r, tx, l0, iv, a in cod_surse:
            if a is None:
                continue
            reguli = SUPRAFETE_REGULI.get(a, []) + (SUPRAFETE_REGULI["_office"] if a in ("word", "excel", "powerpoint") else [])
            for sid, _n, rx in reguli:
                adauga_s(f"{a}.{sid}", r, linii_potrivite(tx, re.compile(rx), l0, iv, maxim=2))
            # ferestrele (dialogurile)
            for k, ln in enumerate(tx.split("\n"), l0):
                if iv is not None and not any(x <= k <= y for x, y in iv):
                    continue
                for m in DIALOG_RE.finditer(ln):
                    nd = nume_dialog(m.group(1))
                    if nd in DIALOG_SUPRAFATA:
                        tinta = DIALOG_SUPRAFATA[nd]
                        app_t = "windows" if tinta in ("meniu_start", "calendar") else a
                        adauga_s(f"{app_t}.{tinta}", r, [k], f"role=dialog „{m.group(1)[:40]}”")
                    elif nd == "Explorer" and a == "word":
                        adauga_s("word.explorer_in_word", r, [k])
                    else:
                        adauga_s(f"{a}.dialog.{slug(nd) if nd else 'dinamic'}", r, [k], None if nd else m.group(1)[:50])
            # suprafețe Windows desenate în simulatorul altei aplicații (Start și bara de activități în Paint/Word)
            if a != "windows":
                for sid in ("meniu_start", "bara_activitati"):
                    rx = dict((x[0], x[2]) for x in SUPRAFETE_REGULI["windows"])[sid]
                    adauga_s(f"windows.{sid}", r, linii_potrivite(tx, re.compile(rx), l0, iv, maxim=2))
            # filele panglicii numite în cod
            if a in ("word", "excel", "powerpoint"):
                for k, ln in enumerate(tx.split("\n"), l0):
                    if iv is not None and not any(x <= k <= y for x, y in iv):
                        continue
                    for m in TAB_ID_RE.finditer(ln):
                        tid = TAB_NORM.get(m.group(1), m.group(1))
                        if tid in ("TabIndentKey", "TabCtxA", "TabCtxB"):
                            continue
                        adauga_s(f"{a}.panglica.{tid}", r, [k])
                    # filele contextuale numite după eticheta lor (simppt.js:316: ['TabCtxA','Picture Format',...])
                    for et, tid in TAB_CONTEXT.items():
                        if et in ln:
                            if tid == "TabTableToolsDesign" and a == "excel":
                                tid = "TabTableToolsDesignExcel"
                            adauga_s(f"{a}.panglica.{tid}", r, [k], f"eticheta „{et.strip(chr(39))}”")
                    if re.search(r"\['TabCtxB'\s*,\s*'Layout'", ln):
                        adauga_s(f"{a}.panglica.TabTableToolsLayout", r, [k], "eticheta „Layout” a tabelului")
                    for m in TAB_SCURT_RE.finditer(ln):
                        sc = m.group(1) or m.group(2)
                        tid = TAB_SCURT.get(a, {}).get(sc)
                        if tid:
                            adauga_s(f"{a}.panglica.{tid}", r, [k])
                        elif sc == "file":
                            adauga_s(f"{a}.buton_file", r, [k])
        # panglica întreagă desenată de ui-panglica.js din panglica-<app>.json
        for a in ("word", "excel", "powerpoint"):
            date_ok = any(r.endswith(f"jocuri/_motor/panglica-{a}.js") for r in loaded_rel) or \
                (a == "excel" and up_cum and up_cum.startswith("dinamic"))
            if not (incarca_up and date_ok and a in aplicatii):
                continue
            # cineva chiar cheamă UiPanglica.html cu datele aplicației?
            cheama = False
            for r, tx, l0, iv, aa in cod_surse:
                if aa == a and re.search(r"UiPanglica\.html|\bUP\.html\(|\bUP\s*=\s*window\.UiPanglica|UiPanglica", "\n".join(
                        tx.split("\n")[(iv[0][0] - 1 if iv else 0):(iv[-1][1] if iv else None)])):
                    cheama = True
            if not cheama:
                continue
            for tid in REF[a]["grupuri"]:
                adauga_s(f"{a}.panglica.{tid}", "jocuri/_motor/ui-panglica.js", [66], f"toate filele din panglica-{a}.json")
            adauga_s(f"{a}.buton_file", "jocuri/_motor/ui-panglica.js", [69], "eticheta File")
        suprafete = sorted(sup.values(), key=lambda s: s["id"])
        # aplicațiile ale căror suprafețe le desenează simulatoarele paginii, în plus (ex. Start din Windows în Paint)
        secundare = sorted({s["id"].split(".")[0] for s in suprafete} - set(aplicatii))

        # ---- exercițiile
        sim_chei = {k for k, a in apps_tip.items()}
        toate_chei = set(tipuri) | BUILTIN
        ex_static, intrebari_simple, nelegate = [], Counter(), []
        for (l0, cod, toks, lit, defs) in P.inline:
            # rezolvarea referințelor: rădăcina X -> căile la care e folosită
            refmap = defaultdict(list)
            for cale, nume in lit.refs:
                refmap[nume].append(cale)

            def rezolva(cale, adanc=0):
                if not cale or adanc > 6:
                    return []
                if cale[0] == "porneste":
                    return [list(cale)]
                out = []
                for c2 in refmap.get(cale[0], []):
                    for c3 in rezolva(c2, adanc + 1):
                        out.append(c3 + list(cale[1:]))
                return out

            for cale, rec in lit.obiecte.items():
                ch = rec["chei"]
                tv = ch.get("t")
                if not tv or tv[0] != "str" or tv[1] not in toate_chei:
                    continue
                tval = tv[1]
                linie = rec["chei"].get("_linii", {}).get("t", rec["line"])
                rez = rezolva(list(cale))
                if not rez:
                    if tval in sim_chei:
                        nelegate.append({"tip": tval, "unde": f"{P.r}:{linie}", "cale": ".".join(map(str, cale))})
                    continue
                for c in rez:
                    incert = any(tuple(c[:k]) in lit.incerte for k in range(1, len(c) + 1)) or \
                        any(tuple(cale[:k]) in lit.incerte for k in range(1, len(cale) + 1))
                    if tval not in sim_chei:
                        intrebari_simple[tval] += 1
                        continue
                    ex_static.append({"tip": tval, "cale": c, "unde": f"{P.r}:{linie}", "incert": incert,
                                      "criterii": sorted(k for k in ch if k not in ("t", "_linii", "q", "why", "ajutor", "titlu")
                                                         and not k.startswith("..."))[:12],
                                      "_parinte_chei": lit.obiecte})

        def ex_id(c, obiecte_lit):
            # c = ['porneste','nivele',li,...]
            if len(c) >= 4 and c[1] == "nivele" and isinstance(c[2], int):
                li = c[2] + 1
                rest = c[3:]
                if rest[:1] == ["pasi"] and len(rest) >= 3 and isinstance(rest[1], int):
                    si = rest[1] + 1
                    if rest[2:] == ["incearca"]:
                        return f"N{li}P{si}E1"
                    if rest[2] == "inca" and len(rest) == 4 and isinstance(rest[3], int):
                        return f"N{li}P{si}E{rest[3] + 2}"
                if rest == ["atelier"]:
                    return f"N{li}AE1"
                if rest[:2] == ["atelier", "inca"] and len(rest) == 3 and isinstance(rest[2], int):
                    return f"N{li}AE{rest[2] + 2}"
                if rest[:1] in (["qs"], ["bazin"]) and len(rest) == 2 and isinstance(rest[1], int):
                    return f"N{li}Î{rest[1] + 1}"
            return "X:" + ".".join(map(str, c[1:]))

        exercitii, vazute = [], set()
        for e in ex_static:
            eid = ex_id(e["cale"], e["_parinte_chei"])
            cheie = (eid, e["unde"])
            if cheie in vazute:
                continue
            vazute.add(cheie)
            exercitii.append({"id": eid, "tip": e["tip"], "aplicatie": apps_tip.get(e["tip"]), "unde": e["unde"],
                              "cale": ".".join(map(str, e["cale"][1:])), "criterii": e["criterii"],
                              **({"index_nesigur": True} if e["incert"] else {})})
        # pașii cu incearca lipsă: E-urile se renumerotează (practiceList filtrează golurile) — verificat la --viu

        # ---- cum se verifică: pe simbol, o dată
        def verificare(cheie_tip):
            inf = tipuri_info[cheie_tip]
            rad, fel, r = inf["simbol"], inf["fel"], (inf["definit_in"] or ":").rsplit(":", 1)[0]
            k = f"{r}#{rad}" if fel != "pagina" else f"{P.r}#{rad}"
            if k in verificari:
                return k
            if fel == "pagina":
                a, b = def_inline[rad]
                tx, iv, rr = P.html_curat, [(a, b)], P.r
            elif r and (WT / r).exists():
                tx, iv, rr = cod_curat(WT / r), None, r
            else:
                verificari[k] = {"simbol": rad, "fisier": r, "rezolva": None, "gresit": None, "resolve": []}
                return k
            rows = tx.split("\n")
            if fel == "pagina":
                sc = next(((tk, lit.pair) for (_l0, _c, tk, lit, _d) in P.inline if tk and tk[0].line <= a <= tk[-1].line), (None, None))
                res = situri_resolve(f"{P.r}#{a}-{b}", rr, sc[0], sc[1], (a, b)) if sc[0] else []
            else:
                tk, pr = jetoane_fisier(WT / rr)
                res = situri_resolve(rr, rr, tk, pr, None)
            rez, gre, chk = None, None, []
            for i, ln in enumerate(rows, 1):
                if iv and not any(x <= i <= y for x, y in iv):
                    continue
                if rez is None and re.search(r"\brezolva\s*(?:\(|:)|\brezolva\s*=", ln):
                    rez = f"{rr}:{i}"
                if gre is None and re.search(r"\bgresit\s*(?:\(|:)|\bgresit\s*=", ln):
                    gre = f"{rr}:{i}"
                if "checkButton(" in ln and len(chk) < 3:
                    chk.append(f"{rr}:{i}")
            # delegări: ce alte simulatoare încărcate cheamă (ex. ExcelX -> JocExcel din tip-excel.js)
            deleg = []
            corp = "\n".join(rows[(iv[0][0] - 1):iv[0][1]]) if iv else tx
            for n2, locs in exp_index.items():
                for r2, _ln in locs:
                    if r2 in loaded_rel and r2 != rr and app_fisier(r2) and not r2.startswith("jocuri/_motor/panglica-") \
                            and re.search(r"\b" + re.escape(n2) + r"\b", corp):
                        if r2 not in deleg:
                            deleg.append(r2)
            verificari[k] = {"simbol": rad, "fisier": rr, "resolve": res[:8], "nr_resolve": len(res),
                             "checkButton": chk, "rezolva": rez, "gresit": gre, "delegat_la": deleg}
            return k

        for e in exercitii:
            k = verificare(e["tip"])
            v = verificari[k]
            e["verificare_ref"] = k
            prima = v["resolve"][0] if v["resolve"] else None
            if not prima and v.get("delegat_la"):
                for r2 in v["delegat_la"]:
                    tk, pr = jetoane_fisier(WT / r2)
                    s2 = situri_resolve(r2, r2, tk, pr, None)
                    if s2:
                        prima = s2[0] + " (delegat)"
                        break
            e["cum_se_verifica"] = (prima or "[negăsit static]") + (f" · după Q.{', Q.'.join(e['criterii'][:4])}" if e["criterii"] else "")
        # tipurile din perimetru fără niciun exercițiu găsit static: tot le scriem verificarea (pentru --viu)
        for cheie_tip in apps_tip:
            verificare(cheie_tip)

        intrare = {
            "pagina": P.r, "tip_pagina": tip, "aplicatii": aplicatii, "aplicatia_principala": principala,
            "fisiere_sim": sim_files,
            "alte_scripturi": [r for r in loaded_rel if not app_fisier(r) and not e_comun(r)],
            # simulatorul scris chiar în pagină (nu într-un fișier din lectii/_sim): R1 cere să plece de aici
            "simulator_in_pagina": sorted({v["definit_in"] for v in tipuri_info.values() if v["fel"] == "pagina" and v["aplicatie"]}),
            "aplicatii_secundare": secundare,
            "incarca_ui_panglica": incarca_up, "ui_panglica_cum": up_cum,
            "tipuri_sim": {k: v for k, v in tipuri_info.items() if v["aplicatie"]},
            "tipuri_afara": sorted(k for k, v in tipuri_info.items() if not v["aplicatie"]),
            "suprafete_atinse": suprafete, "gesturi": gesturi, "exercitii": exercitii,
            "exercitii_nelegate_static": nelegate, "intrebari_simple": dict(intrebari_simple),
            "complexitate": len(gesturi),
        }
        inventar.append(intrare)

    # ---- ordinea de mutare: pe aplicație, cele mai simple întâi (gesturi distincte, apoi exerciții, apoi fișiere)
    for a in APLICATII:
        lst = [x for x in inventar if a in x["aplicatii"]]
        lst.sort(key=lambda x: (x["complexitate"], len(x["exercitii"]), len(x["fisiere_sim"]), x["pagina"]))
        for k, x in enumerate(lst, 1):
            x.setdefault("ordine_mutare", {})[a] = k

    # ---- verificarea vie (opțional)
    viu = None
    if args.viu:
        viu = verificare_vie(inventar)

    # ---- rezumat
    pe_app = {a: sum(1 for x in inventar if a in x["aplicatii"]) for a in APLICATII}
    ex_app = Counter()
    for x in inventar:
        for e in x["exercitii"]:
            ex_app[e["aplicatie"]] += 1
    n_ex = sum(len(x["exercitii"]) for x in inventar)
    rezumat = {
        "pagini_in_perimetru": len(inventar),
        "lectii": sum(1 for x in inventar if x["tip_pagina"] == "lectie"),
        "jocuri": sum(1 for x in inventar if x["tip_pagina"] == "joc"),
        "fixturi": sum(1 for x in inventar if x["tip_pagina"] == "fixtura"),
        "pe_aplicatie": pe_app,
        "pe_aplicatie_principala": dict(Counter(x["aplicatia_principala"] for x in inventar)),
        "pe_aplicatie_cu_secundare": {a: sum(1 for x in inventar if a in x["aplicatii"] or a in x["aplicatii_secundare"]) for a in APLICATII},
        "exercitii_simulate": n_ex,
        "exercitii_pe_aplicatie": {a: ex_app.get(a, 0) for a in APLICATII},
        "exercitii_index_nesigur": sum(1 for x in inventar for e in x["exercitii"] if e.get("index_nesigur")),
        "exercitii_nelegate_static": sum(len(x["exercitii_nelegate_static"]) for x in inventar),
        "intrebari_simple_in_aceste_pagini": sum(sum(x["intrebari_simple"].values()) for x in inventar),
        "incarca_ui_panglica": sum(1 for x in inventar if x["incarca_ui_panglica"]),
        "pagini_in_afara": len(afara),
        "simboluri_neclasificate": len(neclasificate),
    }
    if viu is not None:
        rezumat["verificare_vie"] = viu["rezumat"]

    try:
        commit = subprocess.run(["git", "-C", str(WT), "rev-parse", "HEAD"], capture_output=True, text=True, timeout=30).stdout.strip()
    except Exception:  # noqa: BLE001
        commit = None
    out = {
        "_despre": "GENERAT de inventar_build.py (static, din HTML/JS; nu edita de mână). Etapa 0, contract.md R1-R13.",
        "generat": time.strftime("%Y-%m-%d %H:%M"), "worktree": str(WT), "commit": commit,
        "metoda": {
            "perimetru": "o pagină e în perimetru dacă încarcă un fișier de simulator din SIM_APP_RE sau dacă `tipuri:{...}` "
                         "din configurația ei trimite la un simbol de aplicație (export al unui fișier încărcat sau definiție "
                         "în pagină din SIMBOL_INLINE_APP)",
            "exercitii": "obiectele cu `t:'<cheie din tipuri>'` din configurația JocMotor.porneste (și din constantele la care "
                         "trimite); id = eticheta din jocuri/_motor/test_joc.py (N<nivel>P<pas>E<k> / N<nivel>AE<k> / N<nivel>Î<k>); "
                         "listele de exerciții ale unui pas = motor.js:598 practiceList",
            "cum_se_verifica": "primul apel api.resolve(...) din codul simbolului (funcția care îl cuprinde), plus Q.<criterii> = "
                               "cheile exercițiului care descriu ce se cere; detaliile în `verificari`",
            "gesturi": "reguli GESTURI, pe text fără comentarii: `simulat` = rândurile din codul simulatoarelor încărcate (sau "
                       "din definiția din pagină) unde e tratat gestul (ui-panglica.js nu intră: doar desenează); `predat` = "
                       "rândurile din textul lecției (în afara simulatorului) care îl pomenesc — predat, cerut sau interzis "
                       "(ex. V/8: „nu apeși butonul din dreapta”); Ctrl+literă: comparațiile cu tasta pe un rând cu Ctrl, "
                       "blocurile if(ctrl){...} și tabelele de scurtături (CTRL_K[kl])",
            "suprafete": "reguli SUPRAFETE_REGULI + ferestrele role=dialog + filele numite în cod; panglica desenată de "
                         "ui-panglica.js = toate filele din panglica-<app>.json",
            "complexitate": "numărul de gesturi distincte (simulate sau predate); ordine_mutare = pe aplicație, crescător după "
                            "(complexitate, exerciții, fișiere)",
            "limite": "static: exercițiile făcute de funcții (map, generatoare) nu se văd — de aceea --viu le compară cu "
                      "JocMotor.test.config(); gesturile/suprafețele sunt potriviri de text cu dovadă, nu execuție",
        },
        "rezumat": rezumat,
        "pagini": inventar,
        "ordine_mutare": {a: [x["pagina"] for x in sorted((y for y in inventar if a in y["aplicatii"]),
                                                          key=lambda y: y["ordine_mutare"][a])] for a in APLICATII},
        "in_afara_perimetrului": afara,
        "simboluri_neclasificate": neclasificate,
        "verificari": verificari,
    }
    if viu is not None:
        out["verificare_vie"] = viu
    (D / "inventar.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

    # ---------------------------------------------------------------- suprafete.json
    scrie_suprafete(inventar, REF)

    print(f"inventar: {len(inventar)} pagini în perimetru ({rezumat['lectii']} lecții, {rezumat['jocuri']} jocuri, "
          f"{rezumat['fixturi']} fixturi); pe aplicație: " + ", ".join(f"{a} {pe_app[a]}" for a in APLICATII))
    print(f"exerciții simulate: {n_ex} (" + ", ".join(f"{a} {ex_app.get(a, 0)}" for a in APLICATII) + ")"
          f"; în afara perimetrului: {len(afara)} pagini; neclasificate: {len(neclasificate)}; {time.time() - t0:.1f} s")
    print(f"scris: {D / 'inventar.json'} și {D / 'suprafete.json'}")
    print(len(inventar))


def scrie_suprafete(inventar, REF):
    pagini_sup = defaultdict(set)
    pagini_gest = defaultdict(lambda: {"pagini": set(), "simulat": set(), "predat": set()})
    for x in inventar:
        for s in x["suprafete_atinse"]:
            pagini_sup[s["id"]].add(x["pagina"])
        for g in x["gesturi"]:
            for a in x["aplicatii"]:
                gid = f"{a}.{g['gest']}"
                pagini_gest[gid]["pagini"].add(x["pagina"])
                if g["simulat"]:
                    pagini_gest[gid]["simulat"].add(x["pagina"])
                if g["predat"]:
                    pagini_gest[gid]["predat"].add(x["pagina"])

    NV = "[NEVERIFICAT]"
    out = {"_despre": "GENERAT de inventar_build.py. Pe aplicație: suprafețele de interfață (id stabil = <aplicație>.<suprafață>) "
                      "și gesturile (id stabil = <aplicație>.<gest>). `sursa` = de unde știm că aplicația REALĂ are suprafața; "
                      "fără sursă = [NEVERIFICAT] (se lămurește din referințele Etapei 0: referinte/uia_*.json). "
                      "`pagini` = în câte pagini din inventar.json o desenează simulatoarele de azi.",
           "generat": time.strftime("%Y-%m-%d %H:%M"), "aplicatii": {}}
    descr_reguli = {}
    for app, reg in SUPRAFETE_REGULI.items():
        for sid, n, _ in reg:
            descr_reguli[(app, sid)] = n

    for app in APLICATII:
        sup = {}

        def pune(sid, nume, ce, sursa, real=True):
            e = sup.setdefault(sid, {"id": sid, "nume": nume, "ce_contine": ce, "sursa": sursa, "in_aplicatia_reala": real})
            if e["ce_contine"] in (None, NV) and ce not in (None, NV):
                e["ce_contine"] = ce
            if (e["sursa"] in (None, NV)) and sursa not in (None, NV):
                e["sursa"] = sursa
            return e

        if app in REF:
            R = REF[app]
            dump = f"_cercetare/office_comenzi/dump_{app}_uia.json (UI Automation, 27.09.2026)"
            saec = f"_cercetare/office_comenzi/M365_SAEC/{app}controls.xlsx (https://github.com/OfficeDev/office-fluent-ui-command-identifiers)"
            pune(f"{app}.bara_titlu", "bara de titlu", "titlul ferestrei: " + "; ".join(R["titlu_fereastra"] or []) +
                 "; restul (AutoSave, căutarea, butoanele ferestrei) " + NV, dump)
            pune(f"{app}.acces_rapid", "bara Acces rapid (Quick Access Toolbar)",
                 "comenzile pe care le poate avea (lista oficială): " + ", ".join(R["qat"]) + "; cele vizibile implicit " + NV, saec)
            pune(f"{app}.buton_file", "butonul/fila File (deschide Backstage)", "eticheta „File” " + NV + " (dump-ul din 27.09 n-a citit-o)", NV)
            pune(f"{app}.backstage", "File/Backstage", "paginile (id-uri oficiale): " + ", ".join(R["backstage"]) +
                 "; etichetele afișate (Home, New, Open, Info, Save As, Print, Share, Export, Close, Account, Options) " + NV, saec)
            viz = {t for t, _ in R["file_vizibile"]}
            for tid, et in R["file_vizibile"]:
                if tid == "TabDeveloper":
                    continue            # contractul: profil curat, fără Developer
                g = R["grupuri"].get(tid)
                ce = ("grupuri: " + ", ".join(g["grupuri"]) + f" ({g['butoane']} butoane)") if g else \
                    f"fila „{et}” e vizibilă (dump); grupurile ei {NV} (dump-ul din 27.09 n-a deschis-o)"
                pune(f"{app}.panglica.{tid}", f"fila {et}", ce, dump)
            for tid in R["core_saec"]:
                if tid in viz or tid in ("TabDeveloper", "None"):
                    continue
                if tid in ("HelpTab", "TabHelp", "TabDrawInk", "TabAutomate"):
                    pune(f"{app}.panglica.{tid}", f"fila {tid}", f"există în lista oficială; vizibilă implicit pe PC-ul lui {NV} "
                         "(lipsește din dump-ul din 27.09)", saec)
            for ts, tabs in R["tabsets"].items():
                if ts in ("TabSetTableTools", "TabSetPictureTools", "TabSetDrawingTools", "TabSetChartTools",
                          "TabSetHeaderAndFooterTools", "TabSetTableToolsExcel"):
                    for tid in tabs:
                        # graficele: în listă sunt și id-urile vechi (Layout, fără „New”); păstrăm doar *New
                        if ts == "TabSetChartTools" and not tid.endswith("New"):
                            continue
                        pune(f"{app}.panglica.{tid}", f"fila contextuală {tid}", f"apare doar la selecție ({ts}); etichetă și grupuri {NV}", saec)
            pune(f"{app}.meniu_clic_dreapta", "meniul de la clic dreapta",
                 f"meniurile contextuale din lista oficială ({len(R['ctx'])}): " + ", ".join(R["ctx"][:25]) +
                 ("…" if len(R["ctx"]) > 25 else "") + f"; meniul textului/celulei (clasic) {NV}", saec)
            pune(f"{app}.bara_stare", "bara de stare", f"conținutul {NV} (de citit din referinte/uia_{app}.json)", NV)
            pune(f"{app}.mini_bara", "bara mică de formatare (Mini toolbar)", NV, NV)
            pune(f"{app}.zoom", "glisorul de zoom + butoanele −/+", NV, NV)
        # suprafețele din reguli (folosite de lecții sau așteptate) — conținutul real NEVERIFICAT dacă nu e mai sus
        for (a2, sid), n in descr_reguli.items():
            if a2 == app or (a2 == "_office" and app in ("word", "excel", "powerpoint")):
                simulat = n.startswith("[sim]")
                pune(f"{app}.{sid}", n.replace("[sim] ", ""), NV if not simulat else "doar în simulator (ajutor pentru telefon/pagină)",
                     NV if not simulat else None, real=not simulat)
        # ce apare în pagini și nu e încă în listă (ferestre, file contextuale)
        for sid in pagini_sup:
            if sid.startswith(app + "."):
                if sid not in sup:
                    parte = sid.split(".", 1)[1]
                    nume = ("fereastra " + parte.split(".", 1)[1]) if parte.startswith("dialog.") else parte
                    pune(sid, nume, NV, NV)
        for sid, e in sup.items():
            pg = sorted(pagini_sup.get(sid, []))
            e["pagini"] = len(pg)
            e["lista_pagini"] = pg
            e["folosita_in_lectii"] = bool(pg)
        gest = []
        for gid, g in sorted(pagini_gest.items()):
            if not gid.startswith(app + "."):
                continue
            gest.append({"id": gid, "descriere": GEST_DESCR.get(gid.split(".", 1)[1], gid), "pagini": len(g["pagini"]),
                         "simulat_in": len(g["simulat"]), "predat_in": len(g["predat"]),
                         "predat_dar_nesimulat": sorted(g["predat"] - g["simulat"]), "lista_pagini": sorted(g["pagini"])})
        suprafete = sorted(sup.values(), key=lambda e: (not e["folosita_in_lectii"], e["id"]))
        out["aplicatii"][app] = {
            "pagini": sum(1 for x in inventar if app in x["aplicatii"]),
            "surse_reale": REF.get(app, {}).get("surse", []) or [f"{NV}: nicio referință reală pe disc încă (Etapa 0: dump UI Automation)"],
            "suprafete": suprafete,
            "nr_suprafete": len(suprafete),
            "nr_suprafete_folosite": sum(1 for e in suprafete if e["folosita_in_lectii"]),
            "nr_suprafete_neverificate": sum(1 for e in suprafete if e["sursa"] in (None, NV) and e["in_aplicatia_reala"]),
            "gesturi": gest,
        }
    (D / "suprafete.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")


# ---------------------------------------------------------------- verificarea vie (opțională)
def verificare_vie(inventar):
    import http.server
    import socketserver
    import threading
    from functools import partial

    class Tacut(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), partial(Tacut, directory=str(WT)))
    srv.daemon_threads = True
    port = srv.server_address[1]
    th = threading.Thread(target=srv.serve_forever, daemon=True)
    th.start()
    rez = {"rezumat": {}, "pagini": {}}
    from playwright.sync_api import sync_playwright

    JS = """() => {
      const C = JocMotor.test.config(); const out = [];
      (C.nivele||[]).forEach((L, li) => {
        (L.pasi||[]).forEach((P, si) => { [P.incearca].concat(P.inca||[]).filter(Boolean).forEach((e, k) => out.push([`N${li+1}P${si+1}E${k+1}`, e.t])) });
        if (L.atelier) [L.atelier].concat(L.atelier.inca||[]).filter(Boolean).forEach((e, k) => out.push([`N${li+1}AE${k+1}`, e.t]));
        (L.bazin||L.qs||[]).forEach((q, qi) => out.push([`N${li+1}Î${qi+1}`, q.t]));
      });
      return out; }"""
    # Rețeaua (regula 24 + reparația 12, reverificare_etapa0.md punctul 12; ca în oracole/porti_extra/j_comun.py și
    # oracole/structura_lib.py): tot ce nu e 127.0.0.1/localhost se abandonează; navigator.sendBeacon e înlocuit, înainte
    # de orice script al paginii, cu o funcție care întoarce false (sendBeacon la închiderea paginii a scăpat odată de rută:
    # jocuri/_motor/garda_locala.py); fișierele LOCALE care vorbesc cu serverul viu (prezenta.js, site-credit.js) nu se
    # încarcă deloc. Pe fiecare pagină se verifică și că înlocuirea a prins (navigator.sendBeacon(...) === false).
    import re as _re
    from urllib.parse import urlsplit

    fara_beacon_js = ("(() => { try { Object.defineProperty(navigator, 'sendBeacon', "
                      "{ value: function () { return false; }, configurable: true, writable: true }); } catch (e) {} })();")
    fara_locale = ("/assets/js/prezenta.js", "/assets/js/site-credit.js")
    local_re = _re.compile(r"^https?://(127\.0\.0\.1|localhost)(:\d+)?/")
    retea = {"cereri_externe_oprite": 0, "cereri_locale_oprite": 0, "pagini_cu_beacon_neoprit": 0}

    def ruta(r):
        u = r.request.url
        if u.startswith(("data:", "blob:", "about:")):
            return r.continue_()
        if local_re.match(u):
            if urlsplit(u).path.endswith(fara_locale):
                retea["cereri_locale_oprite"] += 1
                return r.abort()
            return r.continue_()
        retea["cereri_externe_oprite"] += 1
        return r.abort()

    ok = dif = err = 0
    with sync_playwright() as p:
        b = p.chromium.launch()
        for x in inventar:
            ctx = b.new_context()
            ctx.add_init_script(fara_beacon_js)
            ctx.route("**/*", ruta)
            pg = ctx.new_page()
            erori = []
            pg.on("pageerror", lambda e: erori.append(str(e)[:160]))
            try:
                pg.goto(f"http://127.0.0.1:{port}/{x['pagina']}", timeout=30000)
                # proba pazei: înlocuirea întoarce false fără să trimită nimic (dacă n-ar fi prins, cererea ar merge doar
                # la serverul local, pe o adresă inexistentă)
                if pg.evaluate("() => navigator.sendBeacon('/__proba_beacon_oprit', 'x') !== false"):
                    retea["pagini_cu_beacon_neoprit"] += 1
                pg.wait_for_function("window.JocMotor && JocMotor.test && JocMotor.test.config()", timeout=15000)
                lista = pg.evaluate(JS)
            except Exception as e:  # noqa: BLE001
                rez["pagini"][x["pagina"]] = {"eroare": str(e).splitlines()[0][:200], "erori_pagina": erori[:3]}
                err += 1
                ctx.close()
                continue
            ctx.close()
            sim = set(x["tipuri_sim"])
            vii = {(i, t) for i, t in lista if t in sim}
            sta = {(e["id"], e["tip"]) for e in x["exercitii"]}
            lipsa, plus = sorted(vii - sta), sorted(sta - vii)
            x["exercitii_vii"] = len(vii)
            if lipsa or plus:
                dif += 1
                rez["pagini"][x["pagina"]] = {"static": len(sta), "viu": len(vii), "lipsesc_static": lipsa[:40], "in_plus_static": plus[:40]}
                # exercițiile găsite doar în configurația vie intră în inventar, marcate
                for i, t in lipsa:
                    x["exercitii"].append({"id": i, "tip": t, "aplicatia": None, "aplicatie": x["tipuri_sim"][t]["aplicatie"],
                                           "unde": "[doar viu: făcut de cod, nu literal]", "cale": None, "criterii": [],
                                           "sursa": "viu: JocMotor.test.config()"})
                    x["exercitii"][-1].pop("aplicatia", None)
            else:
                ok += 1
        b.close()
    srv.shutdown()
    rez["rezumat"] = {"pagini_identice": ok, "pagini_cu_diferente": dif, "pagini_cu_eroare": err, "port": "liber (127.0.0.1, 0)",
                      "retea": dict(retea, sendBeacon="înlocuit (întoarce false)", abandonate_locale=list(fara_locale))}
    return rez


if __name__ == "__main__":
    main()
