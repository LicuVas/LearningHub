# -*- coding: utf-8 -*-
"""Citeste si scrie chestionarele unei lectii, in siguranta.

    python tools/quiz_io.py dump <fisier>            -> JSON curat cu toate intrebarile
    python tools/quiz_io.py apply <fisier> <json>    -> scrie variante noi, cu garzi

Garzile la scriere (orice incalcare => refuz, exit 2):
  - acelasi numar de variante
  - aceeasi litera corecta
  - varianta corecta pastreaza majoritatea cuvintelor de continut (nu s-a schimbat sensul)
  - nicio varianta goala sau duplicata
"""
import os, io, re, sys, json, html as _html
from html.parser import HTMLParser

ATTR = re.compile(r"data-quiz=([\"'])(.*?)\1(?=[\s>])", re.S)
STOP = set("si sau de la in pe cu un o al ale ai a e ii ul ului care ce este sunt "
           "pentru din prin ca sa se nu mai foarte doar toate toata orice".split())


class G(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = []

    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k == "data-quiz" and v:
                self.q.append(v)


def cuvinte(s):
    w = re.findall(r"[A-Za-zĂÂÎȘȚăâîșț0-9_.]{3,}", str(s).lower())
    return set(x for x in w if x not in STOP)


def dump(path):
    src = io.open(path, encoding="utf-8", errors="replace").read()
    g = G()
    g.feed(src)
    out, n = [], 0
    for raw in g.q:
        try:
            d = json.loads(raw)
        except Exception:
            continue
        for q in (d if isinstance(d, list) else [d]):
            if not isinstance(q, dict):
                continue
            n += 1
            opts = [re.sub(r"\s+", " ", str(o)).strip() for o in (q.get("options") or [])]
            c = str(q.get("correct", ""))
            i = ord(c.lower()) - 97 if c[:1].lower() in "abcdefgh" else -1
            L = [len(o) for o in opts]
            out.append({
                "idx": n,
                "intrebare": re.sub(r"\s+", " ", str(q.get("question", ""))).strip(),
                "variante": opts,
                "corect": c,
                "lungimi": L,
                "indiciu": re.sub(r"\s+", " ", str(q.get("hint", ""))).strip(),
                "corecta_e_cea_mai_lunga": bool(opts and i >= 0 and i < len(L) and L[i] == max(L) and L.count(max(L)) == 1),
            })
    return out


def enc(o):
    t = json.dumps(o, ensure_ascii=False)
    return (t.replace("&", "&amp;").replace("<", "&lt;")
             .replace(">", "&gt;").replace("'", "&#39;").replace('"', "&quot;"))


def apply(path, schimbari):
    """schimbari: [{"idx": n, "variante": [...], "indiciu": "...", "intrebare": "..."}]

    "variante" trece prin garzile stricte (numar, litera corecta, sensul pastrat).
    "indiciu" si "intrebare" sunt text explicativ: se schimba liber, dar nu pot fi goale.
    """
    prin_idx = {int(s["idx"]): s for s in schimbari}
    src = io.open(path, encoding="utf-8", errors="replace").read()
    out, last, n, aplicate, refuzate, chei_schimbate = [], 0, 0, 0, [], []
    for m in ATTR.finditer(src):
        try:
            d = json.loads(_html.unescape(m.group(2)))
        except Exception:
            continue
        lst = d if isinstance(d, list) else [d]
        schimbat = False
        for q in lst:
            if not isinstance(q, dict):
                continue
            n += 1
            cerere = prin_idx.get(n)
            if not cerere:
                continue

            # schimbarea CHEII de raspuns: deliberata, cere justificare scrisa
            ch_noua = cerere.get("cheie")
            if ch_noua is not None:
                ch_noua = str(ch_noua).strip().lower()
                motiv_cheie = str(cerere.get("motiv_cheie", "")).strip()
                nopt = len(q.get("options") or [])
                if len(ch_noua) != 1 or ch_noua not in "abcdefgh" or ord(ch_noua) - 97 >= nopt:
                    refuzate.append((n, "cheie noua invalida: %r" % ch_noua))
                elif len(motiv_cheie) < 25:
                    refuzate.append((n, "schimbarea cheii cere motiv_cheie de macar 25 de caractere"))
                elif ch_noua == str(q.get("correct", "")).lower():
                    pass  # deja e asa, nimic de facut
                else:
                    chei_schimbate.append((n, str(q.get("correct")), ch_noua, motiv_cheie[:120]))
                    q["correct"] = ch_noua
                    schimbat = True
                    aplicate += 1

            # text explicativ: indiciu si enunt, fara garzi stricte (dar nu goale)
            for camp, cheie in (("indiciu", "hint"), ("intrebare", "question")):
                v = cerere.get(camp)
                if v is not None:
                    v = re.sub(r"\s+", " ", str(v)).strip()
                    if len(v) >= 10:
                        q[cheie] = v
                        schimbat = True
                        aplicate += 1
                    else:
                        refuzate.append((n, "%s prea scurt(a)" % camp))

            noi = cerere.get("variante")
            if not noi:
                continue
            vechi = [str(o) for o in (q.get("options") or [])]
            c = str(q.get("correct", ""))
            i = ord(c.lower()) - 97 if c[:1].lower() in "abcdefgh" else -1
            motiv = None
            if len(noi) != len(vechi):
                motiv = "alt numar de variante (%d vs %d)" % (len(noi), len(vechi))
            elif i < 0 or i >= len(noi):
                motiv = "litera corecta invalida"
            elif any(not str(x).strip() for x in noi):
                motiv = "varianta goala"
            elif len(set(re.sub(r"\s+", " ", str(x)).strip().lower() for x in noi)) != len(noi):
                motiv = "variante duplicate"
            else:
                vc, nc = cuvinte(vechi[i]), cuvinte(noi[i])
                if vc and len(vc & nc) < 0.5 * len(vc):
                    motiv = "varianta corecta si-a schimbat sensul (pastreaza %d/%d cuvinte)" % (len(vc & nc), len(vc))
            if motiv:
                refuzate.append((n, motiv))
                continue
            q["options"] = [re.sub(r"\s+", " ", str(x)).strip() for x in noi]
            schimbat = True
            aplicate += 1
        if schimbat:
            out.append(src[last:m.start(2)])
            out.append(enc(d))
            last = m.end(2)
    if aplicate:
        out.append(src[last:])
        io.open(path, "w", encoding="utf-8").write("".join(out))
    return aplicate, refuzate, chei_schimbate


if __name__ == "__main__":
    cmd = sys.argv[1]
    p = sys.argv[2]
    if not os.path.isabs(p):
        p = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), p.replace("/", os.sep))
    if cmd == "dump":
        print(json.dumps(dump(p), ensure_ascii=False, indent=1))
    elif cmd == "apply":
        sch = json.loads(io.open(sys.argv[3], encoding="utf-8").read())
        a, r, ch = apply(p, sch)
        print("aplicate: %d" % a)
        for n, v, nou, motiv in ch:
            print("  CHEIE SCHIMBATA Q%d: %s -> %s | %s" % (n, v, nou, motiv))
        for n, motiv in r:
            print("  REFUZAT Q%d: %s" % (n, motiv))
        sys.exit(2 if r and not a else 0)
