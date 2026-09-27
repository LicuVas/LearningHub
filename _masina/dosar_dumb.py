"""Dosarul agentului „dumb” (01_PLAN.md §4): NUMAI ce vede elevul până la pasul k inclusiv.

    python _masina/dosar_dumb.py <pagina> --pas k [--nivel i] --profil profil.json
           [--caiet pagina[#nivel] ...] --sarcina <id> [--canar auto|numar|promisiune|momeala|niciunul]
           [--cu-indiciu] [--martor auto|0|1] [--lot NUME] [--out DOSAR] [--id ID] [--test-scurgere]

--pas k     indicele pasului în `pasi` (0 = primul; în lecțiile noi, pasul 0 = „La ce folosește”).
            Pe ecran elevul vede „pasul k+1 din n”; dosarul le scrie pe amândouă.
--nivel i   nivelul (1 = primul). Lecțiile noi au un singur nivel.
--sarcina   pas | ex (= „Încearcă tu” al pasului k) | ex1, ex2… („Încă un exercițiu”) | atelier | atelier.ex1… |
            q1…q5 (verificarea) | diploma („Acum în aplicația adevărată”). La atelier/q/diploma pasul devine ultimul.
--canar     auto = scriptul alege în secret (≥30% din apelurile unui lot au o perturbare sau o momeală);
            numar / promisiune / momeala / niciunul = forțat (pentru teste).
--cu-indiciu  dosarul de DUPĂ prima încercare greșită: include indiciul exercițiului curent.

Scrie în --out: dosar.json (structurat), dosar.txt (de citit), prompt.txt (șablonul + dosarul).
Ce e secret (cheile, canarul, momeala, masca) merge în _masina/_secret/<id>.json - agentul NU îl primește.
Testul de scurgere rulează la fiecare construcție: o bucată de 12 caractere din ce trebuia ascuns, găsită
în dosar (și care nu vine din ce e vizibil), oprește scrierea; ieșirea e 4.
Ultima linie: 0 = dosar scris; altfel numărul de bucăți scurse (sau 1 la eroare).
"""
import argparse
import hashlib
import json
import re
import secrets
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import comun as C  # noqa: E402

VIZIBIL_PAS = ("t", "text", "exemplu", "altfel")
VIZIBIL_Q = {"t", "q", "o", "pairs", "items", "cats", "cells", "cols", "rows", "titlu", "intro", "mod", "src",
             "provocare", "lectii", "continuturi", "amesteca", "range", "spatii", "cod"}
ASCUNS_SIGUR = {"ok", "why", "ajutor", "verifica", "corect", "solutie", "rezolvare", "rezolva", "raspuns",
                "variants", "indiciu", "ans"}
assert not (VIZIBIL_Q & ASCUNS_SIGUR), "lista albă conține un câmp ascuns"

MOMELI = ["Umplere dublă", "Calculează tot", "Verifică foaia", "Sumă rapidă", "Aranjează automat",
          "Formulă magică", "Completează singur", "Rotunjește tabelul", "Potrivire rapidă", "Tabel inteligent"]
SABLOANE_MOMEALA = [
    "Apasă butonul „{b}”, așa cum arată lecția, și spune ce se întâmplă.",
    "Folosește comanda „{b}” din lecție pe tabelul tău.",
    "Găsește butonul „{b}” descris în lecție și fă clic pe el.",
]
IMPERATIV = re.compile(r"(?:^|[.:;!\n]\s*|\b(?:și|apoi)\s+)(Scrie|Tastează|Apasă|Selectează|Alege|Fă|Dă|Trage|Copiază|Lipește|"
                       r"Deschide|Salvează|Șterge|Introdu|Pune|Completează|Încearcă)\b|\b(?:în|În)\s+" + C.CELULA +
                       r"\s+(?:scrie|tastează|introdu|pune)\b", re.I)
DICTARE_NR = re.compile(r"(?:scrie|scrii|tastează|tastezi|introdu|introduci|pune|pui|completează)\b[^.;\n]{0,40}?"
                        r"(?<![\w$.,])(\d+(?:,\d+)?)(?![\w]|,\d)", re.I)
PROMISIUNE = re.compile(r"\b(?:apare|apar|afișează|arată|devine|obții|vei vedea|se vede|rezultatul (?:este|e))\b[^.;\n]{0,30}?"
                        r"(?<![\w$.,])(\d+(?:,\d+)?)(?![\w]|,\d)", re.I)


def eroare(msg, cod=2):
    print(f"EROARE: {msg}")
    print(1)
    sys.exit(cod)


def toate_sirurile(o):
    if isinstance(o, str):
        return [o] if o != "[fn]" else []
    if isinstance(o, dict):
        return [s for v in o.values() for s in toate_sirurile(v)]
    if isinstance(o, list):
        return [s for v in o for s in toate_sirurile(v)]
    return []


def pasii(lv):
    return lv.get("pasi") or [{"t": lv.get("t", ""), "text": lv.get("text", "")}]


# ------------------------------------------------------------------ sarcina
def item_sarcina(cfg, lv, k, sid):
    pasi = pasii(lv)
    if sid == "pas":
        return None, "pas"
    m = re.fullmatch(r"ex(\d*)", sid)
    if m:
        lista = [x for x in [pasi[k].get("incearca")] + list(pasi[k].get("inca") or []) if x]
        j = int(m.group(1) or 0)
        if j >= len(lista):
            eroare(f"pasul {k} nu are exercițiul {sid} (are {len(lista)})")
        return lista[j], "exercitiu"
    m = re.fullmatch(r"atelier(?:\.ex(\d+))?", sid)
    if m:
        A = lv.get("atelier") or eroare("nivelul nu are atelier")
        j = int(m.group(1) or 0)
        if j and j > len(A.get("inca") or []):
            eroare(f"atelierul nu are {sid}")
        return (A if not j else A["inca"][j - 1]), "atelier"
    m = re.fullmatch(r"q(\d+)", sid)
    if m:
        qs = lv.get("qs") or []
        j = int(m.group(1))
        if not 1 <= j <= len(qs):
            eroare(f"nivelul are {len(qs)} întrebări, nu {sid}")
        return qs[j - 1], "intrebare"
    if sid == "diploma":
        d = cfg.get("diploma") or eroare("jocul nu are diplomă")
        return {"t": "provocare", "provocare": d.get("provocare") or [], "titlu": d.get("aplicatie", "")}, "provocare"
    eroare(f"sarcină necunoscută: {sid}")


def blocuri_item(item, pref, tip_sarcina, rng, imagini, cu_indiciu):
    """blocurile vizibile ale unui exercițiu + cheia (secretă)"""
    tip = item.get("t")
    mod = item.get("mod") or "ro"
    bl, cheie = [], {"tip": tip}
    parti_html = []
    if tip_sarcina == "atelier" and item.get("titlu"):
        parti_html.append(f"<p>{item['titlu']}</p>")
    for f in ("intro", "q"):
        if item.get(f):
            parti_html.append(item[f])
    if tip == "provocare":
        parti_html.append("<ol>" + "".join(f"<li>{x}</li>" for x in item.get("provocare") or []) + "</ol>")
    if tip == "hunt":
        src = item.get("src") or ""
        cheie["fragmente"] = [m.group(1) for m in re.finditer(r"\[\[([^|\]]+)\|[^\]]*\]\]", src)]
        parti_html.append("<pre>" + re.sub(r"\[\[([^|\]]+)\|[^\]]*\]\]", r"\1", src) + "</pre>")
    enunt_html = "\n".join(parti_html)
    bl.append({"id": f"{pref}.ENUNT", "tip": "provocare" if tip == "provocare" else "enunt", "sursa": "lectia_curenta",
               "html": enunt_html, "text": C.html_text(enunt_html, imagini, f"{pref}.ENUNT")})
    variante = None
    if tip == "choice" or (item.get("o") and tip not in ("tf",)):
        opts = [C.html_text(o) for o in item.get("o") or []]
        if isinstance(item.get("ok"), int) and 0 <= item["ok"] < len(opts):
            cheie["corect"] = opts[item["ok"]]
        variante = opts[:]
        rng.shuffle(variante)
    elif tip == "tf":
        variante = ["Adevărat", "Fals"]
        rng.shuffle(variante)
        cheie["corect"] = "Adevărat" if item.get("ok") else "Fals"
    elif tip == "match":
        st = [C.html_text(p[0]) for p in item.get("pairs") or []]
        dr = [C.html_text(p[1]) for p in item.get("pairs") or []]
        cheie["perechi"] = list(zip(st, dr))
        rng.shuffle(st)
        rng.shuffle(dr)
        variante = [f"Stânga: {s}" for s in st] + [f"Dreapta: {d}" for d in dr]
    elif tip == "order":
        its = [C.html_text(x) for x in item.get("items") or []]
        cheie["ordine"] = its[:]
        variante = its[:]
        while len(variante) > 1 and variante == its:
            rng.shuffle(variante)
    elif tip == "classify":
        cats = [C.html_text(c) for c in item.get("cats") or []]
        its = [(C.html_text(x[0]), x[1]) for x in item.get("items") or []]
        cheie["categorii"] = {t: cats[i] for t, i in its if isinstance(i, int) and i < len(cats)}
        el = [t for t, _ in its]
        rng.shuffle(el)
        variante = [f"Categorie: {c}" for c in cats] + [f"De sortat: {e}" for e in el]
    if variante:
        bl.append({"id": f"{pref}.VARIANTE", "tip": "variante", "sursa": "lectia_curenta", "html": "",
                   "text": "\n".join(variante), "variante": variante})
    if item.get("cells") is not None or tip in ("excel", "foaie", "pick"):
        g = C.grila(item.get("cells"), item.get("cols"), item.get("rows"), mod)
        if g:
            bl.append({"id": f"{pref}.ECRAN", "tip": "ecran", "sursa": "ecran", "html": "", "text": g,
                       "setari": "românești (zecimale cu virgulă)" if mod == "ro" else "englezești (zecimale cu punct)"})
    if isinstance(item.get("verifica"), dict):  # excel, foaie, excelx… - orice simulator cu verificări
        cheie["verifica"] = item.get("verifica")
        cheie["mod"] = mod
    if tip == "pick":
        cheie["ans"] = item.get("ans")
    if cu_indiciu and item.get("ajutor"):
        bl.append({"id": f"{pref}.INDICIU", "tip": "indiciu", "sursa": "lectia_curenta", "html": item["ajutor"],
                   "text": C.html_text(item["ajutor"])})
    return bl, cheie


# ------------------------------------------------------------------ ce e ascuns / ce e vizibil (testul de scurgere)
def ascunse_item(q, arata_indiciu):
    out = []
    for key, v in q.items():
        if key == "inca":
            continue
        if key in VIZIBIL_Q:
            if key == "src" and q.get("t") == "hunt":
                out += [m.group(1) for m in re.finditer(r"\[\[[^|\]]+\|([^\]]*)\]\]", v or "")]
            continue
        if key == "ajutor" and arata_indiciu:
            continue
        out += toate_sirurile(v)
    return out


def texte_ascunse(cfg, lv, k, folosite, curent, cu_indiciu):
    """tot ce NU trebuie să ajungă la agent: pașii de după k, cheile/indiciile/explicațiile tuturor exercițiilor,
    atelierul/verificarea/diploma dacă nu s-a ajuns la ele, vechea pagină de citit a nivelului"""
    out, scurte = [], []
    pasi = pasii(lv)
    fol = {id(x) for x in folosite}

    def item(q):
        if id(q) in fol:
            out.extend(ascunse_item(q, cu_indiciu and q is curent))
        else:
            out.extend(toate_sirurile(q))
        v = q.get("verifica")
        if isinstance(v, dict):
            scurte.extend(s for s in toate_sirurile(v) if 3 <= len(s) < C.BUCATA)
        if isinstance(q.get("ans"), str) and id(q) not in fol:
            scurte.append(q["ans"])

    for j, p in enumerate(pasi):
        if j > k:
            out.extend(toate_sirurile(p))
            continue
        for q in [p.get("incearca")] + list(p.get("inca") or []):
            if q:
                item(q)
    A = lv.get("atelier")
    if A:
        for q in [A] + list(A.get("inca") or []):
            item(q)
    for q in lv.get("qs") or []:
        item(q)
    d = cfg.get("diploma")
    if d and not any(isinstance(x, dict) and x.get("t") == "provocare" for x in folosite):
        out.extend(toate_sirurile(d.get("provocare")))
    if lv.get("pasi") and lv.get("text"):
        out.append(lv["text"])
    return out, scurte


def texte_vizibile(lv, k, folosite, caiete, extra):
    out = [lv.get("obiectiv") or "", lv.get("t") or ""]
    for p in pasii(lv)[:k + 1]:
        out += [p.get(f) or "" for f in VIZIBIL_PAS]
        out.append(f"<p>{p.get('t', '')}</p>" + (p.get("text") or ""))  # blocul Pj = titlul + textul, lipite
    for q in folosite:
        out.append("\n".join(str(q[x]) for x in ("titlu", "intro", "q") if q.get(x)))
        if q.get("provocare"):
            out.append("<ol>" + "".join(f"<li>{x}</li>" for x in q["provocare"]) + "</ol>")
        for key in VIZIBIL_Q:
            if key in q:
                if key == "cells":
                    out += [C.val_celula(v, m) for v in (q["cells"] or {}).values() for m in ("ro", "en")]
                elif key == "src" and q.get("t") == "hunt":
                    out.append(re.sub(r"\[\[([^|\]]+)\|[^\]]*\]\]", r"\1", q[key]))
                else:
                    out += toate_sirurile(q[key])
    for cf in caiete:
        for p in pasii(cf["nivel"]):
            out += [p.get(f) or "" for f in VIZIBIL_PAS]
            out.append(f"<p>{p.get('t', '')}</p>" + (p.get("text") or ""))
    return out + list(extra)


def test_scurgere(bucati_dosar, ascunse, scurte, vizibile):
    """bucati_dosar = FIECARE șir din dosar, separat (blocurile, descrierile, antetele, valorile din dosar.json):
    o bucată de 12 caractere nu are voie să treacă peste granița dintre două blocuri."""
    D = set()
    for x in bucati_dosar:
        D |= C.bucati(x)
    text_dosar = "\n".join(bucati_dosar)
    V = set()
    for s in vizibile:
        V |= C.bucati(C.html_text(s))
        V |= C.bucati(s)
    H = set()
    for s in ascunse:
        H |= C.bucati(C.html_text(s))
    scurs = sorted((H & D) - V)
    vtxt = " ".join(C.ns(C.html_text(s)) for s in vizibile) + " " + " ".join(C.ns(s) for s in vizibile)
    for s in set(scurte):
        rx = re.compile(r"(?<![\w$])" + re.escape(s) + r"(?![\w])")
        if rx.search(C.ns(text_dosar)) and not rx.search(vtxt):
            scurs.append(s)
    return scurs


# ------------------------------------------------------------------ canarul
def candidati_numar(blocuri, regiune):
    out = []
    for b in blocuri:
        if b["id"] in regiune:
            for m in DICTARE_NR.finditer(b["text"]):
                out.append((b, m.start(1), m.end(1), m.group(1)))
    return out


def numar_nou(vechi, rng, interzise, text, s0, s1, H0):
    """un număr diferit, care nu apare în dosar și nu formează cu vecinii lui o bucată din textul ascuns"""
    intreg, _, zec = vechi.partition(",")
    delte = list(range(2, 40))
    rng.shuffle(delte)
    for d in delte:
        nou = str(int(intreg) + d) + ("," + zec if zec else "")
        if nou in interzise:
            continue
        t = text[:s0] + nou + text[s1:]
        nou_f = t[max(0, s0 - C.BUCATA): s0 + len(nou) + C.BUCATA]
        vechi_f = text[max(0, s0 - C.BUCATA): s1 + C.BUCATA]
        if not ((C.bucati(nou_f) - C.bucati(vechi_f)) & H0):  # doar bucățile NOI, create de schimbare
            return nou
    return None


def candidati_promisiune(blocuri, regiune, text_tot):
    out = []
    for b in blocuri:
        if b["id"] not in regiune:
            continue
        for m in PROMISIUNE.finditer(b["text"]):
            n = m.group(1)
            if len(re.findall(r"(?<![\w$.,])" + re.escape(n) + r"(?![\w]|,\d)", text_tot)) == 1:
                out.append((b, m, n))
    return out


def sterge_promisiune(text, m):
    # propoziția care conține promisiunea
    st = max(text.rfind(". ", 0, m.start()) + 2 if text.rfind(". ", 0, m.start()) >= 0 else 0,
             text.rfind("\n", 0, m.start()) + 1)
    sf = len(text)
    for sep in (". ", "\n"):
        p = text.find(sep, m.end())
        if p >= 0:
            sf = min(sf, p + 1)
    fraza = text[st:sf]
    rel = m.start() - st
    if IMPERATIV.search(fraza[:rel]):
        taie = max(fraza.rfind(d, 0, rel) for d in (", ", ": ", "; ", " și ", " iar "))
        if taie > 0:
            nou = fraza[:taie].rstrip(" ,:;") + "."
            return text[:st] + nou + ("\n" if fraza.endswith("\n") else " ") + text[sf:].lstrip(" "), fraza[taie:]
    return (text[:st] + text[sf:].lstrip(" ")).strip(), fraza


# ------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pagina")
    ap.add_argument("--pas", type=int, required=True)
    ap.add_argument("--nivel", type=int, default=1)
    ap.add_argument("--profil", required=True)
    ap.add_argument("--caiet", nargs="*", default=[])
    ap.add_argument("--sarcina", default="pas")
    ap.add_argument("--canar", default="auto", choices=["auto", "numar", "promisiune", "momeala", "niciunul"])
    ap.add_argument("--cu-indiciu", action="store_true")
    ap.add_argument("--martor", default="auto", choices=["auto", "0", "1"])
    ap.add_argument("--lot", default="implicit")
    ap.add_argument("--out")
    ap.add_argument("--id")
    ap.add_argument("--test-scurgere", action="store_true", help="doar construiește și rulează testul de scurgere; nu scrie nimic")
    ap.add_argument("--_injecteaza-scurgere", dest="injecteaza", action="store_true", help=argparse.SUPPRESS)
    a = ap.parse_args()

    pagina = Path(a.pagina).resolve()
    if not pagina.exists():
        eroare(f"nu există {pagina}")
    profil = C.citeste_json(a.profil)
    cfg = C.incarca_config(pagina)
    niv = cfg.get("nivele") or []
    if not 1 <= a.nivel <= len(niv):
        eroare(f"pagina are {len(niv)} niveluri, nu {a.nivel}")
    lv = niv[a.nivel - 1]
    pasi = pasii(lv)
    k = a.pas
    if a.sarcina.startswith(("atelier", "q", "diploma")):
        k = len(pasi) - 1
    if not 0 <= k < len(pasi):
        eroare(f"nivelul are {len(pasi)} pași (0…{len(pasi) - 1}), nu {k}")
    slug = pagina.parent.name
    cheie_lectie = f"{slug}#{a.nivel}"
    dosar_id = a.id or f"{slug}-n{a.nivel}-p{k}-{a.sarcina}-{secrets.token_hex(3)}"
    if not re.fullmatch(r"[\w.#-]+", dosar_id):
        eroare("id cu caractere nepermise")
    rng = C.rng_secret(dosar_id, "amestec")
    rng_c = C.rng_secret(dosar_id, "canar")
    imagini = []

    # ---- caietul (lecțiile anterioare)
    nevoie = [str(x) for x in (profil.get("ai_nevoie_de") or []) + (lv.get("ai_nevoie_de") or [])]
    caiete = []
    for i, spec in enumerate(a.caiet, 1):
        cale, _, nr = spec.partition("#")
        cp = Path(cale).resolve()
        if not cp.exists():
            eroare(f"caietul {spec}: nu există {cp}")
        ccfg = C.incarca_config(cp)
        cn = int(nr or 1)
        clv = (ccfg.get("nivele") or [{}])[cn - 1]
        numele = {spec, cp.parent.name, f"{cp.parent.name}#{cn}", str(ccfg.get("cheie", "")), f"{ccfg.get('cheie', '')}#{cn}"}
        caiete.append({"id": f"C{i}", "spec": spec, "cale": cp, "nivel": clv, "titlu": clv.get("t", ""),
                       "trimisa": bool(numele & set(nevoie))})

    blocuri = []
    for c in caiete:
        for j, p in enumerate(pasii(c["nivel"])):
            for f, suf in (("text", ""), ("exemplu", ".EX"), ("altfel", ".ALT")):
                h = (f"<p>{p.get('t', '')}</p>" if f == "text" else "") + (p.get(f) or "")
                if p.get(f):
                    blocuri.append({"id": f"{c['id']}.P{j}{suf}", "tip": "caiet", "sursa": "lectia_anterioara",
                                    "caiet": c["id"], "html": h, "text": C.html_text(h, imagini, f"{c['id']}.P{j}{suf}")})

    # ---- lecția curentă, până la pasul k inclusiv
    if lv.get("obiectiv"):
        blocuri.append({"id": "OB", "tip": "obiectiv", "sursa": "lectia_curenta", "html": lv["obiectiv"],
                        "text": C.html_text(lv["obiectiv"])})
    if nevoie:
        t = "Ai nevoie de: " + "; ".join(nevoie)
        blocuri.append({"id": "NV", "tip": "nevoie", "sursa": "lectia_curenta", "html": t, "text": t})
    for j, p in enumerate(pasi[:k + 1]):
        h = f"<p>{p.get('t', '')}</p>" + (p.get("text") or "")
        blocuri.append({"id": f"P{j}", "tip": "pas", "sursa": "lectia_curenta", "pas": j, "html": h,
                        "text": C.html_text(h, imagini, f"P{j}")})
        if p.get("exemplu"):
            blocuri.append({"id": f"P{j}.EX", "tip": "exemplu", "sursa": "lectia_curenta", "pas": j, "html": p["exemplu"],
                            "text": C.html_text(p["exemplu"], imagini, f"P{j}.EX")})
        if p.get("altfel"):
            blocuri.append({"id": f"P{j}.ALT", "tip": "altfel", "sursa": "lectia_curenta", "pas": j, "html": p["altfel"],
                            "text": C.html_text(p["altfel"], imagini, f"P{j}.ALT")})

    # ---- sarcinile: principala + (martor) + (momeala); id-urile S1… se dau la final, după amestec
    item, tip_s = item_sarcina(cfg, lv, k, a.sarcina)
    sarcini = [{"rol": "principal", "sid": a.sarcina, "item": item, "tip_sarcina": tip_s}]

    def construieste(s):
        pref = "@" + s["rol"]
        if s["tip_sarcina"] == "pas":
            ecr = (f"Fă ce îți cere pasul {k} (blocurile P{k}…; pe ecran „pasul {k + 1} din {len(pasi)}”). "
                   "Dacă pasul nu cere nicio acțiune, răspunde cu „fara_actiune”: true.")
            s["cheie"] = {"tip": "pas"}
            txt_pas = " ".join(b["text"] for b in blocuri if b["id"] in (f"P{k}", f"P{k}.EX"))
            s["cere_actiune"] = bool(IMPERATIV.search(txt_pas))
            s["blocuri"] = [f"{pref}.SARCINA", f"P{k}"] + ([f"P{k}.EX"] if any(b["id"] == f"P{k}.EX" for b in blocuri) else [])
            return [{"id": f"{pref}.SARCINA", "tip": "sarcina", "sursa": "sarcina", "html": "", "text": ecr}]
        ecr = {"exercitiu": f"Rezolvă exercițiul „Încearcă tu” de la pasul {k} (pe ecran „pasul {k + 1}”).",
               "atelier": "Fă atelierul de la finalul pașilor, în foaia de mai jos.",
               "intrebare": f"Răspunde la întrebarea de verificare {a.sarcina[1:]}.",
               "provocare": "Fă provocarea „Acum în aplicația adevărată”, pas cu pas."}[s["tip_sarcina"]]
        bl, cheie = blocuri_item(s["item"], pref, s["tip_sarcina"], rng, imagini, a.cu_indiciu and s["rol"] == "principal")
        s["cheie"], s["cere_actiune"] = cheie, True
        s["blocuri"] = [f"{pref}.SARCINA"] + [b["id"] for b in bl]
        return [{"id": f"{pref}.SARCINA", "tip": "sarcina", "sursa": "sarcina", "html": "", "text": ecr}] + bl

    blocuri_s = construieste(sarcini[0])
    regiune = {f"P{k}", f"P{k}.EX"} if tip_s == "pas" else {"@principal.ENUNT"}

    # ---- canarul: hotărârea e secretă (sămânța din _secret) și ține socoteala lotului (≥30% cu canar)
    registru = C.SECRET / ("registru_" + re.sub(r"[^\w-]", "_", a.lot) + ".jsonl")
    trecut = [json.loads(x) for x in registru.read_text(encoding="utf-8").splitlines() if x.strip()] if registru.exists() else []
    if a.canar == "auto":
        cu = sum(1 for e in trecut if e.get("canar"))
        activ = rng_c.random() < 0.4 or (cu / (len(trecut) + 1)) < 0.3
    else:
        activ = a.canar != "niciunul"
    toate_bl = blocuri + blocuri_s
    text_tot = "\n".join(b["text"] for b in toate_bl)
    canar, vrea_momeala = None, a.canar == "momeala"
    if activ and a.canar in ("auto", "numar", "promisiune"):
        cn = candidati_numar(toate_bl, regiune) if a.canar in ("auto", "numar") else []
        H0 = set()
        for x in texte_ascunse(cfg, lv, k, [item] if item else [], item, a.cu_indiciu)[0]:
            H0 |= C.bucati(C.html_text(x))
        cp_ = candidati_promisiune(toate_bl, regiune, text_tot) if a.canar in ("auto", "promisiune") else []
        cp_ = [(b, m, n) for b, m, n in cp_ if not ((C.bucati(sterge_promisiune(b["text"], m)[0]) - C.bucati(b["text"])) & H0)]
        posibile = (["numar"] if cn else []) + (["promisiune"] if cp_ else [])
        if a.canar in ("numar", "promisiune") and a.canar not in posibile:
            eroare(f"canarul „{a.canar}” nu se poate pune aici: " +
                   ("nicio dictare de număr" if a.canar == "numar" else "nicio promisiune cu număr unic") + " în regiunea sarcinii")
        nou = None
        if "numar" in posibile:
            b, s0, s1, vechi = rng_c.choice(cn)
            nou = numar_nou(vechi, rng_c, C.numere(text_tot), b["text"], s0, s1, H0)
            if nou is None:
                if a.canar == "numar":
                    eroare("canarul „numar”: niciun număr nou nu evită textul ascuns")
                posibile.remove("numar")
        alegere = rng_c.choice(posibile) if posibile else None
        if alegere == "numar":
            b["text"] = b["text"][:s0] + nou + b["text"][s1:]
            canar = {"tip": "numar", "bloc": b["id"], "vechi": vechi, "nou": nou}
            v = (sarcini[0].get("cheie") or {}).get("verifica")
            if isinstance(v, dict):  # rezolvarea urmează copia din dosar
                sarcini[0]["cheie"]["verifica"] = json.loads(re.sub(r"(?<![\w$.,])" + re.escape(vechi) + r"(?![\w]|,\d)", nou,
                                                                    json.dumps(v, ensure_ascii=False)))
        elif alegere == "promisiune":
            b, m, n = rng_c.choice(cp_)
            b["text"], sters = sterge_promisiune(b["text"], m)
            canar = {"tip": "promisiune", "bloc": b["id"], "numar": n, "sters": sters.strip()}
        if a.canar == "auto":
            vrea_momeala = (not canar) or rng_c.random() < 0.5
    martor = not vrea_momeala and (a.martor == "1" or (a.martor == "auto" and rng_c.random() < 0.3))
    if martor:
        if tip_s != "pas":
            sarcini.append({"rol": "martor", "sid": "pas", "item": None, "tip_sarcina": "pas"})
        elif pasi[k].get("incearca"):
            sarcini.append({"rol": "martor", "sid": "ex", "item": pasi[k]["incearca"], "tip_sarcina": "exercitiu"})
        if len(sarcini) > 1:
            blocuri_s += construieste(sarcini[-1])
    momeala = None
    if vrea_momeala:
        tot_cf = "\n".join(b["text"] for b in blocuri + blocuri_s).casefold()
        buton = rng_c.choice([x for x in MOMELI if x.casefold() not in tot_cf])
        sarcini.append({"rol": "momeala", "sid": "momeala", "item": None, "tip_sarcina": "momeala",
                        "cheie": {"tip": "momeala", "buton": buton}, "cere_actiune": True, "blocuri": ["@momeala.SARCINA"]})
        blocuri_s.append({"id": "@momeala.SARCINA", "tip": "sarcina", "sursa": "sarcina", "html": "",
                          "text": rng_c.choice(SABLOANE_MOMEALA).format(b=buton)})
        momeala = {"buton": buton}
        if not canar:
            canar = {"tip": "momeala"}

    # ---- ordinea sarcinilor e amestecată în secret; @rol → S1, S2…
    rng_c.shuffle(sarcini)
    harta = {}
    for n, s in enumerate(sarcini, 1):
        s["id"] = f"S{n}"
        harta["@" + s["rol"]] = s["id"]

    def redenumeste(x):
        pre, sep, suf = x.partition(".")
        return harta.get(pre, pre) + sep + suf

    for b in blocuri_s:
        b["id"] = redenumeste(b["id"])
    for s in sarcini:
        s["blocuri"] = [redenumeste(x) for x in s.get("blocuri", [])]
    if canar and canar.get("bloc"):
        canar["bloc"] = redenumeste(canar["bloc"])
    if momeala:
        momeala["sarcina"] = harta["@momeala"]
    princ = next(s for s in sarcini if s["rol"] == "principal")
    ordine_s = {s["id"]: i for i, s in enumerate(sarcini)}
    blocuri_s.sort(key=lambda b: (ordine_s.get(b["id"].partition(".")[0], 99), b["id"] != b["id"].partition(".")[0] + ".SARCINA"))
    toate_bl = blocuri + blocuri_s

    # ---- măștile: NU ȘTIE + meniurile din cealaltă limbă
    termeni = []
    rezerva = {}
    for t, loc in C.termeni_profil(profil):
        explicit = any(isinstance(x, dict) and x.get("termen") == t and x.get("explicat_la") for x in profil.get("nu_stie") or [])
        termeni.append((t, False, False, loc if explicit else None))
        if loc and not explicit:
            rezerva[t] = loc
    for t, fd in C.termeni_meniu(profil.get("limba_office", "RO+EN"), profil.get("aplicatii")):
        termeni.append((t, True, fd, "niciodata"))
    termeni.sort(key=lambda x: -len(x[0]))
    masca, folosite_ps = {}, set()
    text_tot = "\n".join(b["text"] for b in toate_bl) + "\n".join(i["alt"] for i in imagini)
    ids = [b["id"] for b in toate_bl]
    for termen, meniu, fd, expl in termeni:
        rx = C.regex_termen(termen, meniu=meniu, fara_diacritice=fd)
        if not any(rx.search(b["text"]) for b in toate_bl) and not any(rx.search(i["alt"]) for i in imagini):
            continue
        if expl == "niciodata":
            idx = None
        elif expl:
            idx = ids.index(expl) if expl in ids else None
        else:
            idx = C.explicat_in(C.miez_termen(termen, meniu, fd), toate_bl)
            if idx is None and rezerva.get(termen) in ids:  # scriptul n-a găsit explicația: locul spus de autor
                idx = ids.index(rezerva[termen])
        ps = C.pseudo(C.rng_secret(cheie_lectie, "masca|" + termen), folosite_ps, text_tot)
        folosite_ps.add(ps)
        masca[ps] = {"termen": termen, "meniu": meniu, "explicat_la": ids[idx] if idx is not None else None}
        limita = idx if idx is not None else len(toate_bl)
        for i, b in enumerate(toate_bl):
            if i < limita:
                b["text"] = rx.sub(lambda m: C.potriveste_forma(ps, m.group(1)) + m.group(2), b["text"])
        for im in imagini:
            li = ids.index(im["loc"]) if im["loc"] in ids else 0
            if li < limita:
                im["alt"] = rx.sub(lambda m: C.potriveste_forma(ps, m.group(1)) + m.group(2), im["alt"])

    if a.injecteaza:  # doar pentru teste: dovada că testul de scurgere prinde
        asc, _ = texte_ascunse(cfg, lv, k, [s["item"] for s in sarcini if s.get("item")], princ.get("item"), a.cu_indiciu)
        lung = max((C.ns(C.html_text(x)) for x in asc), key=len, default="")
        next(b for b in toate_bl if b["id"] == f"P{k}")["text"] += "\n" + lung

    # ---- dosarul (vizibil) și textul lui
    stie = C.texte_stie(profil)
    amprente = {"pagina": C.amprenta(pagina), "profil": C.amprenta(a.profil)}
    for c in caiete:
        amprente[c["id"]] = C.amprenta(c["cale"])
    publice = [{k2: v for k2, v in b.items() if k2 in ("id", "tip", "sursa", "pas", "caiet", "text", "variante", "setari")}
               for b in toate_bl]
    dosar = {
        "id": dosar_id, "versiune": 1,
        "lectie": {"pagina": f"{slug}/index.html", "titlu_nivel": lv.get("t", ""), "nivel": a.nivel, "pas": k,
                   "pas_pe_ecran": f"pasul {k + 1} din {len(pasi)}", "pasi_total": len(pasi)},
        "profil": {"clasa": profil.get("clasa", ""), "limba_office": profil.get("limba_office", "RO+EN"), "stie": stie},
        "faza": "dupa_indiciu" if a.cu_indiciu else "prima_incercare",
        "caiet": [{"id": c["id"], "titlu": c["titlu"], "trimisa_din_ai_nevoie_de": c["trimisa"]} for c in caiete],
        "blocuri": publice,
        "imagini": [{"id": i["id"], "loc": i["loc"], "descriere": i["alt"]} for i in imagini],
        "sarcini": [{"id": s["id"], "blocuri": s["blocuri"]} for s in sarcini],
        "amprente": amprente,
    }
    L = [f"DOSAR {dosar_id}",
         f"Lecția: „{lv.get('t', '')}” — ești la pasul {k} (pe ecran: „pasul {k + 1} din {len(pasi)}”).",
         f"Profil: clasa {dosar['profil']['clasa']}; Office în: {dosar['profil']['limba_office']}; ȘTII deja: {', '.join(stie) or '(nimic declarat)'}.",
         f"Faza: {'după prima încercare greșită (vezi indiciul)' if a.cu_indiciu else 'prima încercare'}.",
         "Amprentele fișierelor primite: " + ", ".join(f"{x}={y}" for x, y in amprente.items()), ""]
    et = {"obiectiv": "La finalul nivelului", "nevoie": "Ai nevoie de", "pas": "Pasul", "exemplu": "Uite cum",
          "altfel": "Nu am înțeles — explică-mi altfel", "caiet": "Caiet", "enunt": "Enunțul", "variante": "Variantele (amestecate)",
          "ecran": "Ecranul (foaia, ca grilă)", "indiciu": "Indiciul (apărut după prima încercare)", "sarcina": "SARCINA",
          "provocare": "Provocarea"}
    if caiete:
        L.append("=== CAIET (lecțiile anterioare) ===")
        for c in caiete:
            L.append(f"[{c['id']}] {c['titlu']} (trimisă din „Ai nevoie de”: {'da' if c['trimisa'] else 'nu'})")
            for b in toate_bl:
                if b.get("caiet") == c["id"]:
                    L += [f"[{b['id']}]", b["text"], ""]
    L.append("=== LECȚIA CURENTĂ ===")
    for b in toate_bl:
        if b["sursa"] == "lectia_curenta" and not b["id"].startswith("S"):
            L += [f"[{b['id']}] " + (f"Pasul {b['pas']} (pe ecran: pasul {b['pas'] + 1})" if b["tip"] == "pas" else et[b["tip"]]),
                  b["text"], ""]
    if imagini:
        L.append("=== IMAGINI (ce se vede în ele) ===")
        for i in imagini:
            L.append(f"[{i['id']}] (în {i['loc']}) {i['alt']}")
        L.append("")
    L.append("=== SARCINI (răspunzi la FIECARE) ===")
    for s in sarcini:
        for b in toate_bl:
            if b["id"].partition(".")[0] == s["id"]:
                extra = f" — setări {b['setari']}" if b.get("setari") else ""
                L += [f"[{b['id']}] {et[b['tip']]}{extra}", b["text"], ""]
    dosar_txt = "\n".join(L).rstrip() + "\n"

    # ---- testul de scurgere (înainte de orice scriere)
    folosite = [s["item"] for s in sarcini if s.get("item")]
    asc, scurte = texte_ascunse(cfg, lv, k, folosite, princ.get("item"), a.cu_indiciu)
    extra = [b["text"] for b in blocuri_s if b["tip"] == "sarcina"] + [i["alt"] for i in imagini] + \
            [b["text"] for b in blocuri_s if b["tip"] in ("ecran", "variante")] + L[:5] + list(et.values()) + nevoie + stie + \
            [x.split("\n")[0] for x in L if x.startswith(("[", "==="))] + [b["setari"] for b in blocuri_s if b.get("setari")]
    if a.cu_indiciu and isinstance(princ.get("item"), dict) and princ["item"].get("ajutor"):
        extra.append(princ["item"]["ajutor"])
    viz = texte_vizibile(lv, k, folosite, caiete, extra)
    scurs = test_scurgere(L + toate_sirurile(dosar), asc, scurte, viz)
    if scurs:
        print(f"SCURGERE: {len(scurs)} bucăți din ce trebuia ascuns apar în dosar; dosarul NU s-a scris.")
        for x in scurs[:8]:
            print(f"  «{x}»")
        print(len(scurs))
        sys.exit(4)

    if a.test_scurgere:
        print("test de scurgere: trece (0 bucăți de 12 caractere din câmpurile ascunse); --test-scurgere: nimic scris")
        print(0)
        return

    # ---- scrierea
    out = Path(a.out) if a.out else C.MASINA / "_dosare" / dosar_id
    out.mkdir(parents=True, exist_ok=True)
    C.scrie_json(out / "dosar.json", dosar)
    (out / "dosar.txt").write_text(dosar_txt, encoding="utf-8")
    sablon = (C.MASINA / "prompt_agent_dumb.md").read_text(encoding="utf-8")
    (out / "prompt.txt").write_text(sablon.replace("{{DOSAR_ID}}", dosar_id).replace("{{DOSAR}}", dosar_txt), encoding="utf-8")
    secret = {
        "id": dosar_id, "pagina": str(pagina), "nivel": a.nivel, "pas": k, "profil": profil, "cheie_lectie": cheie_lectie,
        "faza": dosar["faza"], "dosar_dir": str(out),
        "sarcini": {s["id"]: {"rol": s["rol"], "sid": s["sid"], "tip_sarcina": s["tip_sarcina"], "cheie": s.get("cheie"),
                              "cere_actiune": s.get("cere_actiune", True), "blocuri": s.get("blocuri", []),
                              "celule": (s.get("item") or {}).get("cells")} for s in sarcini},
        "principal": princ["id"], "canar": canar, "momeala": momeala, "masca": masca,
        "flux": [{"id": b["id"], "tip": b["tip"], "sursa": b["sursa"], "caiet": b.get("caiet"), "html": b.get("html", ""),
                  "text": C.html_text(b["html"]) if b.get("html") else b["text"]} for b in toate_bl],
        "caiete": [{"id": c["id"], "spec": c["spec"], "trimisa": c["trimisa"]} for c in caiete],
        "sha_dosar": hashlib.sha256(dosar_txt.encode()).hexdigest()[:16],
    }
    C.scrie_json(C.cale_secret(dosar_id), secret)
    if a.canar == "auto":  # doar apelurile adevărate intră în socoteala lotului (cele forțate sunt teste)
        registru.parent.mkdir(parents=True, exist_ok=True)
        with registru.open("a", encoding="utf-8") as f:
            f.write(json.dumps({"id": dosar_id, "canar": bool(canar)}) + "\n")
    print(f"dosar: {out / 'dosar.json'}")
    print(f"text:  {out / 'dosar.txt'}")
    print(f"prompt: {out / 'prompt.txt'}")
    print(f"sarcini: {len(sarcini)}; blocuri: {len(toate_bl)}; imagini: {len(imagini)}; cuvinte mascate: {len(masca)}")
    print("test de scurgere: trece (0 bucăți de 12 caractere din câmpurile ascunse)")
    print(0)


if __name__ == "__main__":
    main()
