"""Verdictul pe un pas, pus de SCRIPT (01_PLAN.md §4, „Validatorul”) - agentul nu-l poate convinge.

    python _masina/valideaza_pas.py <dosar.json> <raspuns.json> [--executor exec.json] [--json] [--out validare.json]

Verdicte: FĂCUT · FĂCUT_CU_INDICIU · FĂCUT_FĂRĂ_ÎNȚELEGERE · NEFĂCUT · CONTRADICȚIE · BLOCAJ · NU_GĂSESC · NESIGUR · INVALID.
FĂCUT cere confirmarea EXECUTORULUI (nivelul 1: acțiunile rulate în pagină, ecranul arată promisiunea).
Executorul nu există încă: fără --executor, verdictul maxim e FĂCUT_NECONFIRMAT (sau FĂCUT_CU_INDICIU_NECONFIRMAT).
--executor primește {"confirmat": true|false, "celula_in_editare": true|false} (contract provizoriu).

INVALID = apelul nu valorează nimic (citat inventat, format greșit, canar ignorat, momeală „găsită”) → se reia cu alt agent.
Ieșire: 0 = trece · 1 = problemă a lecției · 3 = apel INVALID · 2 = eroare de folosire.
Ultima linie: numărul de probleme (0 sau 1).
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import comun as C  # noqa: E402

ORDINE = ["INVALID", "BLOCAJ", "CONTRADICȚIE", "NU_GĂSESC", "NESIGUR", "NEFĂCUT", "FĂCUT_FĂRĂ_ÎNȚELEGERE",
          "FĂCUT_CU_INDICIU", "FĂCUT"]
TRECE = {"FĂCUT", "FĂCUT_NECONFIRMAT", "FĂCUT_CU_INDICIU", "FĂCUT_CU_INDICIU_NECONFIRMAT"}
CONFIRMA = {"enter", "tab"}
ALEGERI = {"aleg_varianta", "potrivesc", "ordonez", "sortez"}
RX_CEL = re.compile(rf"{C.CELULA}(?::{C.CELULA})?")


class Invalid(Exception):
    pass


def cel_mai_rau(vs):
    return min(vs, key=ORDINE.index) if vs else "FĂCUT"


def norm_tasta(s):
    return re.sub(r"\s*\+\s*", "+", C.nc(s)).casefold()


def norm_formula(s):
    s = C.nc(str(s)).replace(" ", "")
    parti = re.split(r'("[^"]*")', s)
    return "".join(p if p.startswith('"') else p.upper().replace(";", ",") for p in parti)


def norm_val(s, mod="ro"):
    s = C.nc(str(s))
    t = s.replace(",", ".") if mod == "ro" else s
    try:
        return float(t)
    except ValueError:
        return s.casefold()


class Validator:
    def __init__(self, dosar, secret, cun, distanta=C.FEREASTRA):
        self.d, self.s, self.cun = dosar, secret, cun
        self.dist = distanta
        self.distante = []  # distanța efectivă obiect ↔ citat, pe fiecare acțiune verificată (pentru calibrare)
        self.bl = {b["id"]: b for b in dosar["blocuri"]}
        self.ordine = [b["id"] for b in dosar["blocuri"]]
        self.nb = {i: C.nc(b["text"]) for i, b in self.bl.items()}
        self.flux = {b["id"]: b for b in secret["flux"]}
        self.imagini = {i["id"]: i for i in dosar.get("imagini", [])}
        self.caiete = {c["id"]: c for c in secret.get("caiete", [])}
        self.masca = secret.get("masca") or {}
        prof = secret.get("profil") or {}
        self.stie_texte = C.texte_stie(prof)

    # ---------------------------------------------------------- citate
    def gaseste(self, citat):
        c = C.nc(citat)
        return [(i, m.start()) for i, t in self.nb.items() for m in re.finditer(re.escape(c), t)] if c else []

    def al_sarcinii(self, bid, sid):
        return not re.match(r"S\d+\.", bid) or bid.partition(".")[0] == sid

    def sursa(self, src, sid):
        """(stare, potriviri). stare: ok | nicaieri | ecran | sarcina | netrimis | imagine | imagine_nesigur"""
        if not isinstance(src, dict) or src.get("tip") not in C.SURSE:
            raise Invalid(f"sursă fără tip din listă: {json.dumps(src, ensure_ascii=False)[:120]}")
        for f in ("bloc", "caiet", "imagine"):
            v = src.get(f)
            if isinstance(v, str) and (".." in v or "/" in v or "\\" in v):
                raise Invalid(f"cale de fișier în loc de bloc: {v}")
        tip = src["tip"]
        if tip == "nicaieri":
            return "nicaieri", []
        if tip == "imagine":
            im = self.imagini.get(src.get("imagine"))
            if not im:
                raise Invalid(f"imagine care nu e în dosar: {src.get('imagine')}")
            vede = src.get("ce_se_vede") or ""
            if not vede.strip():
                raise Invalid("sursă „imagine” fără „ce_se_vede”")
            return ("imagine", [("IMG:" + im["id"], 0)]) if C.jetoane(vede) & C.jetoane(im["descriere"]) else ("imagine_nesigur", [])
        citat = src.get("citat") or ""
        if len(C.nc(citat)) < C.BUCATA:
            raise Invalid(f"citat sub {C.BUCATA} caractere: «{citat}»")
        pot = self.gaseste(citat)
        if not pot:
            raise Invalid(f"citat care NU există în dosar (inventat sau din memorie): «{C.nc(citat)[:90]}»")
        pot_s = [(b, o) for b, o in pot if self.al_sarcinii(b, sid)]
        curent = [(b, o) for b, o in pot_s if self.bl[b]["tip"] in C.TIPURI_LECTIE]
        if curent:
            return "ok", curent
        caiet = [(b, o) for b, o in pot_s if self.bl[b]["tip"] in C.TIPURI_CAIET]
        if caiet:
            trimise = [(b, o) for b, o in caiet if self.caiete.get(self.bl[b].get("caiet"), {}).get("trimisa")]
            if trimise:
                return "ok", trimise
            if self.defineste_cuvant(caiet, sid):
                return "ok", caiet
            return "netrimis", []
        tipuri = {self.bl[b]["tip"] for b, _ in pot_s}
        if "ecran" in tipuri:
            return "ecran", []
        return "sarcina", []

    def stare_sursa(self, st, rol, cine):
        if st == "nicaieri":
            return "NU_GĂSESC", f"{cine} - {rol}: nicăieri"
        if st in ("ecran", "sarcina"):
            return "NU_GĂSESC", f"{cine} - {rol}: citat doar din {'ecran' if st == 'ecran' else 'textul sarcinii'} (nu se primește)"
        if st == "netrimis":
            return "NU_GĂSESC", f"{cine} - {rol}: citat dintr-o lecție netrimisă din „Ai nevoie de”"
        if st == "imagine_nesigur":
            return "NESIGUR", f"{cine} - {rol}: ce spune că vede nu se potrivește cu descrierea imaginii"
        return None

    def text_instructiune(self, sid, nemascat=True):
        sec = self.s["sarcini"][sid]
        if sec["tip_sarcina"] == "pas":
            k = self.s["pas"]
            ids = [f"P{k}", f"P{k}.EX", f"P{k}.ALT"]
        else:
            ids = [b for b in sec["blocuri"] if not b.endswith(".SARCINA") and not b.endswith(".ECRAN")]
        src = self.flux if nemascat else self.bl
        return ids, " ".join((src[i]["text"] if i in src else "") for i in ids)

    def defineste_cuvant(self, pot, sid):
        _, instr = self.text_instructiune(sid)
        cuv = {w for w in C.jetoane(instr) if re.fullmatch(r"[^\W\d_]{4,}", w)}
        for b, o in pot:
            fr = self.nb[b][max(0, o - self.dist): o + 200]
            for w in cuv:
                if re.search(rf"(?i){re.escape(w)}\w{{0,3}}\s*(\([^)]{{2,60}}\)\s*)?(este|e|înseamnă|se numește|adică|:)\s", fr):
                    return True
        return False

    def fereastra(self, b, o, n):
        if b.startswith("IMG:"):
            return self.imagini[b[4:]]["descriere"]
        t = self.nb[b]
        return t[max(0, o - self.dist): o + n + self.dist]

    # ---------------------------------------------------------- obiectul acțiunii
    def distanta_efectiva(self, act, pot, citat):
        """câte caractere sunt între citat și cel mai apropiat loc al obiectului în același bloc (0 = în citat);
        None = obiectul nu apare deloc în blocul citatului"""
        a, ob = act["actiune"], act.get("obiect")
        obs = C.nc(ob if isinstance(ob, str) else "")
        if not obs or a in ALEGERI:
            return None
        if a == "selectez" and RX_CEL.fullmatch(obs):
            rx = re.compile(rf"(?<![A-Za-z$]){re.escape(obs)}(?!\d)")
        elif a == "apas_tasta":
            rx = re.compile(r"\s*\+\s*".join(re.escape(x) for x in re.split(r"\s*\+\s*", obs)), re.I)
        elif a == "clic_buton":
            rx = re.compile(re.escape(obs))
        else:
            rx = re.compile(re.escape(obs), re.I)
        n, best = len(C.nc(citat)), None
        for b, o in pot:
            if b.startswith("IMG:"):
                continue
            for m in rx.finditer(self.nb[b]):
                d = 0 if m.start() < o + n and m.end() > o else (m.start() - (o + n) if m.start() >= o + n else o - m.end())
                best = d if best is None else min(best, d)
        return best

    def sustine(self, act, pot, citat, sid):
        a, ob = act["actiune"], act.get("obiect")
        obs = ob if isinstance(ob, str) else " | ".join(map(str, ob)) if isinstance(ob, list) else ("" if ob is None else str(ob))
        n = len(C.nc(citat))
        fer = [self.fereastra(b, o, n) for b, o in pot]
        if a == "tastez":
            return C.nc(obs) != "" and C.nc(obs) in C.nc(citat)
        if a == "apas_tasta":
            return any(norm_tasta(obs) in norm_tasta(f) for f in fer)
        if a == "clic_buton":
            return any(C.nc(obs) in f for f in fer)
        if a == "selectez" and RX_CEL.fullmatch(C.nc(obs)):
            capete = [C.nc(obs)] + (C.nc(obs).split(":") if ":" in obs else [])
            gasit = [any(re.search(rf"(?<![A-Za-z$]){re.escape(x)}(?!\d)", f) for f in fer) for x in capete]
            return gasit[0] or (len(gasit) == 3 and gasit[1] and gasit[2])
        if a in ALEGERI:
            fer = [self.fereastra(b, o, n) for b, o in pot if self.bl.get(b, {}).get("tip") not in ("enunt", "variante")]
            if not fer:
                return False
            ft = set().union(*(C.jetoane(f) for f in fer))
            fn = set().union(*(C.numere(f) for f in fer))
            if a == "aleg_varianta" and C.nc(obs) in ("Adevărat", "Fals"):
                _, instr = self.text_instructiune(sid, nemascat=False)
                return bool(C.jetoane(instr) & ft)
            parti = re.split(r"\s*(?:→|->|\|)\s*", obs) if a != "aleg_varianta" else [obs]
            for p in parti:
                if not p.strip():
                    continue
                if not C.numere(p) <= fn:
                    return False
                if not (p.casefold() in " ".join(fer).casefold() or C.jetoane(p) & ft):
                    return False
            return True
        if not obs.strip():
            return True
        return obs.casefold() in " ".join(fer).casefold() or bool(C.jetoane(obs) & set().union(*(C.jetoane(f) for f in fer)))

    def derivare(self, act, sid):
        d = act.get("derivare")
        if not isinstance(d, dict):
            return False, "textul tastat nu e în citat și nu are derivare"
        ex = d.get("exemplu") or {}
        st, pot = self.sursa({"tip": ex.get("tip", "lectia_curenta"), "bloc": ex.get("bloc"), "citat": ex.get("citat")}, sid)
        if st != "ok":
            return False, f"exemplul din derivare nu e o sursă primită ({st})"
        din = C.nc(d.get("din_exemplu") or "")
        if not din or din not in C.nc(ex.get("citat")):
            return False, "„din_exemplu” nu e bucată din citatul exemplului"
        _, instr = self.text_instructiune(sid, nemascat=False)
        ecran = " ".join(self.nb.get(b, "") for b in self.s["sarcini"][sid]["blocuri"] if b.endswith(".ECRAN"))
        perechi = []
        for p in d.get("inlocuiri") or []:
            if not (isinstance(p, list) and len(p) == 2 and all(isinstance(x, str) and x for x in p)):
                return False, f"înlocuire fără forma [ce era, ce pui]: {p}"
            x, y = p
            fel = lambda t: ("val" if re.fullmatch(rf"{C.CELULA}|\d+(?:[.,]\d+)?", t) else
                             "op" if t in "+-*/" else "fn" if re.fullmatch(r"[A-ZĂÂÎȘȚ]{2,}", t) else None)
            if fel(x) is None or fel(x) != fel(y):
                return False, f"înlocuire nepermisă: {x} → {y} (doar adresă/număr, semn de calcul, nume de funcție)"
            if fel(y) == "val" and not re.search(rf"(?<![A-Za-z$\d]){re.escape(y)}(?!\d)", instr + " " + ecran):
                return False, f"„{y}” nu apare în enunț"
            perechi.append((x, y))
        if perechi:
            harta = dict(perechi)
            rx = re.compile("|".join(
                (rf"(?<![A-Za-z$\d]){re.escape(x)}(?!\d)" if re.fullmatch(r"[A-Z0-9,.]+", x) else re.escape(x))
                for x in sorted(harta, key=len, reverse=True)))
            rez = rx.sub(lambda m: harta[m.group(0)], din)
        else:
            rez = din
        tast = C.nc(act.get("obiect") if isinstance(act.get("obiect"), str) else "")
        if C.nc(rez) != tast:
            return False, f"derivarea dă „{rez}”, nu „{tast}”"
        return True, "derivare refăcută de script"

    # ---------------------------------------------------------- ce trebuie să știi
    def predat(self, conc, pana_la, sid):
        ids = [conc["id"]] + list(conc.get("aliasuri") or [])
        if any(C.stie_cuvant(self.stie_texte, x) for x in ids):
            return True
        for bid in self.ordine[: self.ordine.index(pana_la) + 1] if pana_la in self.ordine else self.ordine:
            b = self.bl[bid]
            if not self.al_sarcinii(bid, sid):
                continue
            if b["tip"] in C.TIPURI_CAIET and not self.caiete.get(b.get("caiet"), {}).get("trimisa"):
                continue
            if b["tip"] not in C.TIPURI_LECTIE | C.TIPURI_CAIET:
                continue
            txt = self.flux.get(bid, b)["text"]
            if any(re.search(p, txt, re.I) for p in conc["predat"]):
                return True
        return False

    def cerute(self, sid, actiuni_sust):
        sec = self.s["sarcini"][sid]
        tastate = [str(a.get("obiect")) for a in actiuni_sust if a["actiune"] == "tastez"]
        v = (sec.get("cheie") or {}).get("verifica") or {}
        if isinstance(v, dict):
            tastate += [str(x) for x in (v.get("formule") or {}).values()]
            tastate += [str(x) for x in (v.get("valori") or {}).values() if str(x).startswith("=")]
        taste = [norm_tasta(str(a.get("obiect"))) for a in actiuni_sust if a["actiune"] == "apas_tasta"]
        acts = {a["actiune"] for a in actiuni_sust}
        _, instr = self.text_instructiune(sid)
        out = {}
        for c in self.cun["concepte"]:
            cd = c["cerut_de"]
            if cd.get("tastat") and any(re.search(cd["tastat"], t) for t in tastate):
                out[c["id"]] = c
            elif any(norm_tasta(x) in taste for x in cd.get("tasta") or []):
                out[c["id"]] = c
            elif cd.get("tasta_contine") and any(cd["tasta_contine"].casefold() in t for t in taste):
                out[c["id"]] = c
            elif acts & set(cd.get("actiune") or []):
                out[c["id"]] = c
            elif cd.get("mentionat") and re.search(cd["mentionat"], instr, re.I):
                out[c["id"]] = c
        fn = self.cun.get("functii") or {}
        for F in fn.get("nume") or []:
            if any(re.search(fn["cerut_de"].replace("{F}", re.escape(F)), t, re.I) for t in tastate):
                out[F] = {"id": F, "ce": f"funcția {F}", "aliasuri": [f"{F}()", f"funcția {F}"],
                          "predat": [p.replace("{F}", re.escape(F)) for p in fn["predat"]]}
        return out

    # ---------------------------------------------------------- foaia (rolurile celulelor)
    def conflicte(self, sid, celule_agent):
        sec = self.s["sarcini"][sid]
        if sec["tip_sarcina"] == "pas":
            k = self.s["pas"]
            secv = []
            for b in self.s["flux"]:
                if re.fullmatch(r"P\d+(\.EX)?", b["id"]) and int(re.match(r"P(\d+)", b["id"]).group(1)) <= k:
                    ev = C.roluri_din_text(b["text"], b["id"]) + (C.roluri_din_grila_html(b["html"], b["id"]) if b["id"].endswith(".EX") else [])
                    secv.append((b["id"], sorted(ev, key=lambda e: e[0])))
            aici = {f"P{k}", f"P{k}.EX"}
        else:
            ev0 = []
            for adr, v in (sec.get("celule") or {}).items():
                cl, cont = C.clasa_continut(str(v), "scrie") if not isinstance(v, (int, float)) else ("numar", str(v))
                ev0.append((0, adr, {"clasa": cl, "continut": cont, "bloc": "ecran", "fraza": f"ecran: {adr} = {v}"}))
            secv = [("ecran", ev0)]
            for b in sec["blocuri"]:
                if b.endswith(".ENUNT"):
                    secv.append((b, C.roluri_din_text(self.flux[b]["text"], b)))
            aici = {b for b in sec["blocuri"]}
        conf = C.conflicte_roluri(secv)
        return [c for c in conf if c["rol2"]["bloc"] in aici or (c["celula"] in celule_agent and not c.get("inchis"))]

    # ---------------------------------------------------------- o sarcină
    def sarcina(self, r, sid):
        sec = self.s["sarcini"][sid]
        V, motive, note = [], [], []

        def pune(v, m):
            V.append(v)
            motive.append(f"{v}: {m}")

        for f in ("lecturi", "intrebari"):
            if f not in r:
                raise Invalid(f"{sid}: lipsește câmpul „{f}”")
        lect = r.get("lecturi") or []
        if not isinstance(lect, list) or len(lect) > 3:
            raise Invalid(f"{sid}: „lecturi” trebuie să fie o listă de cel mult 3")
        intr = r.get("intrebari") or {}
        if not isinstance(intr, dict):
            raise Invalid(f"{sid}: „intrebari” nu e obiect")

        # blocajele și contradicțiile declarate de agent
        for bj in r.get("blocaj") or []:
            st, pot = self.sursa({"tip": "lectia_curenta" if not str(bj.get("bloc", "")).startswith("C") else "lectia_anterioara",
                                  "bloc": bj.get("bloc"), "citat": bj.get("citat")}, sid)
            w = C.nc(bj.get("cuvant") or "")
            if not w or w.casefold() not in C.nc(bj.get("citat")).casefold():
                pune("NESIGUR", f"blocaj pe „{w}”, dar cuvântul nu e în citatul dat")
                continue
            # cuvântul inventat apare cu terminații („dipimen” → „dipimenă”)
            ps = next((m for k, m in sorted(self.masca.items(), key=lambda x: -len(x[0])) if w.casefold().startswith(k)), None)
            ids_i, _ = self.text_instructiune(sid)
            start = min((self.ordine.index(i) for i in ids_i if i in self.ordine), default=len(self.ordine))
            if ps and not ps.get("meniu"):
                ex_la = ps.get("explicat_la")
                if ex_la in self.ordine and self.ordine.index(ex_la) < start:
                    note.append(f"blocaj pe „{w}” respins: lecția îl explică la {ex_la}, înainte de sarcină "
                                f"(folosirea de dinainte, din {bj.get('bloc')}, nu e o instrucțiune)")
                else:
                    pune("BLOCAJ", f"(agent) „{w}” = termen NEEXPLICAT încă (NU ȘTIE: „{ps['termen']}”)")
                continue
            loc = self.explicat_inainte(w, [(i, 0) for i in ids_i if i in self.ordine] or pot, sid)
            if loc:
                note.append(f"blocaj pe „{w}” respins de script: e explicat înainte de sarcină, la {loc}")
            else:
                pune("BLOCAJ", f"(agent) „{w}” folosit înainte de explicație - de confirmat de judecător")
        for ct in r.get("contradictie") or []:
            for i in ("1", "2"):
                self.sursa({"tip": "lectia_curenta", "bloc": ct.get("bloc" + i), "citat": ct.get("citat" + i)}, sid)
            pune("CONTRADICȚIE", f"(agent) «{C.nc(ct.get('citat1'))[:60]}» ↔ «{C.nc(ct.get('citat2'))[:60]}» - decide judecătorul")

        # acțiunile, pe fiecare lectură
        toate_sust, celule_agent = [], set()
        for li, L in enumerate(lect, 1):
            if not isinstance(L, dict) or not isinstance(L.get("actiuni", []), list):
                raise Invalid(f"{sid}: lectura {li} fără listă de acțiuni")
            for act in L.get("actiuni") or []:
                if not isinstance(act, dict) or act.get("actiune") not in C.ACTIUNI:
                    raise Invalid(f"{sid}: acțiune din afara listei fixe: {json.dumps(act, ensure_ascii=False)[:100]}")
                ob = act.get("obiect")
                obs = ob if isinstance(ob, str) else json.dumps(ob, ensure_ascii=False)
                if act["actiune"] == "selectez" and isinstance(ob, str) and RX_CEL.fullmatch(C.nc(ob)):
                    celule_agent |= set(C.nc(ob).split(":"))
                if act.get("celula"):
                    celule_agent.add(C.nc(act["celula"]))
                cine = f"lectura {li}: {act['actiune']} «{C.nc(obs)[:40]}»"
                doua = "citat_metoda" in act or "citat_obiect" in act
                src_m = act.get("citat_metoda") if doua else act.get("sursa")
                src_o = act.get("citat_obiect") if doua else act.get("sursa")
                if doua and (not isinstance(src_m, dict) or not isinstance(src_o, dict)):
                    raise Invalid(f"{sid}: {cine}: trebuie AMBELE citate, „citat_metoda” și „citat_obiect”")
                if src_m is None:
                    raise Invalid(f"{sid}: {cine}: acțiune fără citat")
                st_m, pot_m = self.sursa(src_m, sid)
                st_o, pot_o = self.sursa(src_o, sid) if doua else (st_m, pot_m)
                probl = self.stare_sursa(st_m, "metoda" if doua else "sursa", cine) or \
                    (self.stare_sursa(st_o, "obiectul", cine) if doua else None)
                if probl:
                    pune(*probl)
                    continue
                cit_m = (src_m or {}).get("citat") or ""
                cit_o = (src_o or {}).get("citat") or ""
                if doua and st_m == "ok" and act["actiune"] not in ALEGERI and \
                        not [x for x, _ in pot_m if self.bl.get(x, {}).get("tip") not in ("enunt", "variante")]:
                    pune("NU_GĂSESC", f"{cine} - metoda e citată doar din enunț: lecția n-a arătat CUM se face")
                    continue
                if act["actiune"] == "clic_buton" and any(ps in C.nc(obs).casefold() for ps, m in self.masca.items() if m.get("meniu")):
                    pune("NU_GĂSESC", f"{cine} - numele e din cealaltă limbă a Office-ului (profilul nu-l vede)")
                    continue
                # obiectul se caută lângă citat_obiect; la alegeri (variante, perechi) sprijinul e în citat_metoda
                st, pot, citat = (st_m, pot_m, cit_m) if act["actiune"] in ALEGERI else (st_o, pot_o, cit_o)
                if st != "imagine" and act["actiune"] not in ALEGERI and act["actiune"] != "tastez":
                    d_ = self.distanta_efectiva(act, pot, citat)
                    self.distante.append({"sarcina": sid, "actiune": act["actiune"], "obiect": C.nc(obs)[:40],
                                          "distanta": d_, "prag": self.dist,
                                          "primit": self.sustine(act, pot, citat, sid),
                                          "potrivire": "exactă" if d_ is not None else "pe cuvinte (obiectul nu apare literal)"})
                if act["actiune"] == "tastez" and not (st == "imagine") and not self.sustine(act, pot, citat, sid):
                    ok, cum = self.derivare(act, sid)
                    if not ok:
                        pune("NESIGUR", f"{cine} - {cum}")
                        continue
                    note.append(f"{cine}: {cum} (APLICARE)")
                    act = dict(act, _derivat=True)
                elif st != "imagine" and not self.sustine(act, pot, citat, sid):
                    if act["actiune"] in ALEGERI and not [x for x, _ in pot if self.bl[x]["tip"] not in ("enunt", "variante")]:
                        pune("NU_GĂSESC", f"{cine} - sprijinit doar pe enunț/variante, nu pe lecție")
                    else:
                        pune("NESIGUR", f"{cine} - obiectul nu e în {'citat_obiect' if doua else 'citat'} și nici la ≤{self.dist} caractere de el")
                    continue
                toate_sust.append(act)
            a_ = L.get("astept") or {}
            if isinstance(a_, dict) and a_.get("citat"):
                self.sursa({"tip": "lectia_curenta" if not str(a_.get("bloc", "")).startswith("C") else "lectia_anterioara",
                            "bloc": a_.get("bloc"), "citat": a_.get("citat")}, sid)
        nou = intr.get("nou")
        if isinstance(nou, dict) and nou.get("citat"):
            self.sursa({"tip": "lectia_curenta", "bloc": nou.get("bloc"), "citat": nou.get("citat")}, sid)
        if len(lect) > 1:
            note.append(f"{len(lect)} lecturi ale instrucțiunii: executorul trebuie să le ruleze pe toate")

        # termeni mascați (NU ȘTIE) în instrucțiune → BLOCAJ, orice ar spune agentul
        ids, _ = self.text_instructiune(sid)
        instr_masc = " ".join(self.nb.get(i, "") for i in ids)
        for ps, m in self.masca.items():
            if re.search(rf"(?i)(?<!\w){re.escape(ps)}", instr_masc):
                if m.get("meniu"):
                    note.append(f"numele de meniu „{m['termen']}” (din cealaltă limbă) apare în instrucțiune: profilul nu-l vede")
                else:
                    pune("BLOCAJ", f"(script) termenul „{m['termen']}” e folosit în instrucțiune înainte ca lecția să-l explice")

        # tabelul „acțiune → ce trebuie să știi”
        dictate = [a for a in toate_sust if not a.get("_derivat")]
        pana = ids[-1] if sec["tip_sarcina"] == "pas" else sec["blocuri"][-1]
        pana = next((i for i in reversed(ids) if i in self.ordine), pana) if sec["tip_sarcina"] == "pas" else pana
        for cid, conc in self.cerute(sid, dictate).items():
            if not self.predat(conc, pana, sid):
                pune("BLOCAJ", f"(script) „{cid}” ({conc.get('ce', '')}) e cerut, dar nu e predat înainte și nu e în ȘTIE")

        # foaia: o celulă cu două roluri fără „foaie nouă” între
        for c in self.conflicte(sid, celule_agent):
            pune("CONTRADICȚIE", f"(script) {c['celula']}: întâi {c['rol1']['clasa']} «{c['rol1']['fraza'][:50]}» ({c['rol1']['bloc']}), "
                                  f"apoi {c['rol2']['clasa']} «{c['rol2']['fraza'][:50]}» ({c['rol2']['bloc']}), fără „foaie nouă” între")

        # a făcut ce trebuia?
        if intr.get("vad_unde") is False and "NU_GĂSESC" not in V:
            pune("NU_GĂSESC", "agentul spune că nu vede unde")
        fara = bool(r.get("fara_actiune"))
        are_act = any((L.get("actiuni") or []) for L in lect)
        if sec.get("cere_actiune") and (fara or not are_act):
            pune("NEFĂCUT", "sarcina cere acțiuni, agentul n-a făcut niciuna")
        if intr.get("stiu_ce_sa_fac") is False and not V:
            pune("NEFĂCUT", "agentul spune că nu știe ce să facă")
        self.corectitudine(sec, lect, pune, note)
        if are_act and not V:
            p = intr.get("predictie")
            if not (isinstance(p, dict) and C.nc(p.get("atunci")) and not re.search(r"(?i)nu\s+ș?s?tiu", str(p.get("atunci")))):
                pune("FĂCUT_FĂRĂ_ÎNȚELEGERE", "a făcut acțiunile, dar n-a putut spune ce s-ar întâmpla la o schimbare (predicția)")
        if not V:
            V.append("FĂCUT_CU_INDICIU" if self.s.get("faza") == "dupa_indiciu" else "FĂCUT")
        return cel_mai_rau(V), motive, note, toate_sust

    def explicat_inainte(self, w, pot, sid):
        if C.stie_cuvant(self.stie_texte, w):
            return "profilul (ȘTIE)"
        prim = min((self.ordine.index(b) for b, _ in pot if b in self.ordine), default=len(self.ordine))
        blocuri = [dict(self.flux.get(b, {}), tip=self.bl[b]["tip"]) for b in self.ordine[:prim] if self.al_sarcinii(b, sid)]
        i = C.explicat_in(C.miez_regex(w), blocuri)
        return self.ordine[i] if i is not None else None

    def corectitudine(self, sec, lect, pune, note):
        ch = sec.get("cheie") or {}
        tip = ch.get("tip")
        if sec["tip_sarcina"] in ("pas", "momeala", "provocare") or not lect:
            return
        for li, L in enumerate(lect, 1):
            acts = L.get("actiuni") or []
            alese = [C.nc(str(a.get("obiect"))) for a in acts if a.get("actiune") == "aleg_varianta"]
            if "corect" in ch and (tip in ("choice", "tf") or alese):
                if not alese:
                    pune("NEFĂCUT", f"lectura {li}: n-a ales nicio variantă")
                elif alese[-1].casefold() != C.nc(ch["corect"]).casefold():
                    pune("NEFĂCUT", f"lectura {li}: a ales «{alese[-1][:50]}», răspunsul corect e altul")
                continue
            v = ch.get("verifica")
            if isinstance(v, dict):
                cel, scris, sel = None, {}, None
                edit = False
                modifica = False  # copiere/mutare/ștergere: valorile rezultate le vede doar executorul
                for a in acts:
                    ob = C.nc(str(a.get("obiect", "")))
                    if a.get("actiune") in ("copiez", "lipesc", "trag", "clic_buton", "clic_dreapta") or (
                            a.get("actiune") == "apas_tasta" and norm_tasta(ob) not in CONFIRMA | {"esc"}):
                        modifica = True
                    if a.get("actiune") == "trag":
                        mm = re.search(rf"({C.CELULA})\D+?({C.CELULA})", ob)
                        if mm:
                            sel, cel = f"{mm.group(1)}:{mm.group(2)}", mm.group(1)
                    if a.get("actiune") == "selectez":
                        if edit:
                            edit = False
                        if RX_CEL.fullmatch(ob):
                            sel, cel = ob, ob.split(":")[0]
                    elif a.get("actiune") == "tastez":
                        c2 = C.nc(a.get("celula") or "") or cel
                        if c2:
                            scris[c2] = ob
                        edit = True
                    elif a.get("actiune") == "apas_tasta" and norm_tasta(ob) in CONFIRMA:
                        edit = False
                if edit:
                    pune("NEFĂCUT", f"lectura {li}: celula rămâne în editare (fără Enter/Tab după ce a tastat)")
                for adr, f in (v.get("formule") or {}).items():
                    if adr not in scris:
                        pune("NEFĂCUT", f"lectura {li}: în {adr} trebuia o formulă; agentul n-a scris nimic acolo")
                    elif norm_formula(scris[adr]) != norm_formula(f):
                        pune("NEFĂCUT", f"lectura {li}: în {adr} a scris «{scris[adr]}», nu formula cerută")
                if modifica and (v.get("valori") or v.get("gol")):
                    note.append(f"lectura {li}: valorile de după copiere/mutare/ștergere le verifică executorul")
                else:
                    for adr, x in (v.get("valori") or {}).items():
                        if adr not in scris or norm_val(scris[adr], ch.get("mod", "ro")) != norm_val(x, ch.get("mod", "ro")):
                            pune("NEFĂCUT", f"lectura {li}: în {adr} valoarea nu e cea cerută")
                for f in ("sel", "zona"):
                    if v.get(f) and sel != v[f]:
                        pune("NEFĂCUT", f"lectura {li}: selecția finală e «{sel}», nu cea cerută")
                rest = set(v) - {"formule", "valori", "sel", "zona"} - ({"gol"} if modifica else set())
                if rest:
                    note.append(f"de verificat de executor: {', '.join(sorted(rest))}")
            elif tip == "pick" and ch.get("ans"):
                sel = [C.nc(str(a.get("obiect"))) for a in acts if a.get("actiune") == "selectez"]
                if not sel or sel[-1] != ch["ans"]:
                    pune("NEFĂCUT", f"lectura {li}: a ales «{sel[-1] if sel else '-'}», nu celula cerută")
            elif tip == "match" and ch.get("perechi"):
                date = set()
                for a in acts:
                    if a.get("actiune") == "potrivesc":
                        p = re.split(r"\s*(?:→|->)\s*", C.nc(str(a.get("obiect"))))
                        if len(p) == 2:
                            date.add((p[0].casefold(), p[1].casefold()))
                if date != {(x.casefold(), y.casefold()) for x, y in ch["perechi"]}:
                    pune("NEFĂCUT", f"lectura {li}: perechile nu sunt cele corecte")
            elif tip == "order" and ch.get("ordine"):
                o = [a.get("obiect") for a in acts if a.get("actiune") == "ordonez"]
                if not o or [C.nc(x).casefold() for x in (o[-1] if isinstance(o[-1], list) else [])] != [C.nc(x).casefold() for x in ch["ordine"]]:
                    pune("NEFĂCUT", f"lectura {li}: ordinea nu e cea corectă")

    # ---------------------------------------------------------- tot apelul
    def valideaza(self, r):
        rez = {"dosar_id": self.d["id"], "verdict": None, "motive": [], "note": [], "sarcini": {}, "canar": None,
               "prag_distanta": self.dist, "distante": self.distante}
        try:
            if isinstance(r, dict) and r.get("_eroare"):
                raise Invalid(f"răspunsul nu se poate citi: {r['_eroare']}")
            if not isinstance(r, dict) or not isinstance(r.get("sarcini"), list):
                raise Invalid("răspunsul nu are forma fixă (obiect cu „sarcini”: listă)")
            if r.get("dosar_id") != self.d["id"]:
                raise Invalid(f"dosar_id greșit: {r.get('dosar_id')!r} (dosarul e {self.d['id']!r})")
            pe_id = {}
            for x in r["sarcini"]:
                if not isinstance(x, dict) or not x.get("id"):
                    raise Invalid("sarcină fără id în răspuns")
                pe_id[x["id"]] = x
            asteptate = set(self.s["sarcini"])
            if set(pe_id) != asteptate:
                raise Invalid(f"răspunsul acoperă {sorted(pe_id)}, dosarul are {sorted(asteptate)}")
            for sid in sorted(asteptate):
                v, m, n, sust = self.sarcina(pe_id[sid], sid)
                rez["sarcini"][sid] = {"rol": self.s["sarcini"][sid]["rol"], "verdict": v, "motive": m, "note": n}
                if self.s["sarcini"][sid]["rol"] == "principal":
                    principal = (sid, v, m, n, pe_id[sid], sust)
            # canarul și momeala
            can, mom = self.s.get("canar"), self.s.get("momeala")
            sid, v, m, n, rp, sust = principal
            if can and can.get("tip") == "numar":
                tast = set()
                for L in rp.get("lecturi") or []:
                    for a in L.get("actiuni") or []:
                        if a.get("actiune") == "tastez":
                            tast |= C.numere(str(a.get("obiect")))
                if can["vechi"] in tast and can["nou"] not in tast:
                    raise Invalid(f"canarul ignorat: a tastat {can['vechi']} (numărul lecției reale), dosarul spunea {can['nou']}")
                rez["canar"] = {"tip": "numar", "rezultat": "respectat" if can["nou"] in tast else "neconcludent"}
            elif can and can.get("tip") == "promisiune":
                for L in rp.get("lecturi") or []:
                    a_ = L.get("astept") or {}
                    if can["numar"] in C.numere(str(a_.get("text", "")) + " " + str(a_.get("citat", ""))):
                        raise Invalid(f"canarul ignorat: așteaptă {can['numar']}, o promisiune care NU e în dosar (din memorie)")
                rez["canar"] = {"tip": "promisiune", "rezultat": "respectat"}
            if mom:
                ms = mom["sarcina"]
                for L in pe_id[ms].get("lecturi") or []:
                    for a in L.get("actiuni") or []:
                        for cheie in ("sursa", "citat_metoda", "citat_obiect"):
                            src = a.get(cheie) if isinstance(a, dict) else None
                            if isinstance(src, dict) and src.get("tip") != "nicaieri" and self.sursa(src, ms)[0] in ("ok", "imagine"):
                                raise Invalid(f"momeala „găsită”: butonul „{mom['buton']}” NU există în lecție, "
                                              f"dar agentul îi dă o sursă din lecție ({cheie})")
                # „n-am găsit” poate veni ca NU_GĂSESC, ca BLOCAJ pe numele butonului sau ca NEFĂCUT (n-a făcut nimic);
                # ce NU e voie: o sursă pentru butonul inexistent (verificat mai sus) sau un „FĂCUT”
                if rez["sarcini"][ms]["verdict"] not in ("NU_GĂSESC", "BLOCAJ", "NEFĂCUT"):
                    raise Invalid(f"momeala n-a primit NU_GĂSESC (a primit {rez['sarcini'][ms]['verdict']})")
                rez["sarcini"][ms]["verdict"] = "NU_GĂSESC"
                rez["canar"] = dict(rez["canar"] or {}, momeala="respectată")
            rez["sarcina_principala"] = sid
            rez["verdict"], rez["motive"], rez["note"] = v, m, n
        except Invalid as e:
            rez["verdict"], rez["motive"] = "INVALID", [f"INVALID: {e}"]
        return rez


def citeste_raspuns(cale, repara=True):
    """(răspuns, notă). Dacă JSON-ul pică DOAR din cauza unei ghilimele „ închise cu " drept (agentul a amestecat
    ghilimelele - aceeași familie ca decizia dirijorului din 27.09), le închide cu ” și spune asta în notă."""
    try:
        txt = Path(cale).read_text(encoding="utf-8").strip()
    except OSError as e:
        return {"_eroare": f"nu pot citi răspunsul: {e}"}, ""
    m = re.search(r"```(?:json)?\s*(\{.*\})\s*```", txt, re.S)
    corp = m.group(1) if m else txt
    try:
        return json.loads(corp), ""
    except ValueError as e:
        prima = e
    if repara:
        rx = re.compile(r'„([^"„”\n]{0,200})"')
        n = len(rx.findall(corp))
        if n:
            try:
                return json.loads(rx.sub(r"„\1”", corp)), (
                    f"răspuns REPARAT mecanic: {n} ghilimele „…\" închise cu ghilimea dreaptă (rupeau JSON-ul) → „…”; "
                    "fără reparare apelul era INVALID (--fara-reparare)")
            except ValueError:
                pass
    return {"_eroare": f"JSON invalid: {prima}"}, ""


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dosar")
    ap.add_argument("raspuns")
    ap.add_argument("--executor", help="executor.json scris de executor_pagina.py, sau „auto” = îl rulează acum")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--out")
    ap.add_argument("--fara-reparare", action="store_true", help="nu repara ghilimelele „…\" care rup JSON-ul")
    ap.add_argument("--distanta", type=int, default=C.FEREASTRA,
                    help=f"câte caractere poate fi obiectul departe de citat (implicit {C.FEREASTRA})")
    a = ap.parse_args()
    try:
        dosar = C.citeste_json(a.dosar)
        secret = C.citeste_json(C.cale_secret(dosar["id"]))
        cun = C.citeste_json(C.CUNOSTINTE)
    except (OSError, ValueError, KeyError) as e:
        print(f"EROARE: {e}")
        print(1)
        sys.exit(2)
    raspuns, reparat = citeste_raspuns(a.raspuns, not a.fara_reparare)
    rez = Validator(dosar, secret, cun, a.distanta).valideaza(raspuns)
    if reparat:
        rez["note"].insert(0, reparat)
    v = rez["verdict"]
    ex = None
    if a.executor == "auto" and rez["verdict"] != "INVALID":
        sec_p = secret["sarcini"].get(rez.get("sarcina_principala") or secret["principal"], {})
        out_ex = Path(a.raspuns).with_suffix(".executor.json")
        cmd = [sys.executable, str(Path(__file__).resolve().parent / "executor_pagina.py"), secret["pagina"], "--pas", str(secret["pas"]),
               "--nivel", str(secret["nivel"]), "--sarcina", sec_p.get("sid", "ex"), "--actiuni", a.raspuns, "--dosar", a.dosar,
               "--out", str(out_ex)]
        pr = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        if pr.returncode == 0 and out_ex.exists():
            ex = C.citeste_json(out_ex)
            rez["note"].append(f"executorul a rulat: {out_ex}")
        else:
            rez["note"].append(f"executorul n-a putut rula (ieșire {pr.returncode}): {(pr.stdout + pr.stderr)[-200:]}")
    elif a.executor and a.executor != "auto":
        ex = C.citeste_json(a.executor)
    if ex is not None and ex.get("dosar_id") not in (None, dosar["id"]):
        rez["note"].append(f"executorul e pentru alt dosar ({ex.get('dosar_id')}); nu-l folosesc")
        ex = None
    if ex is not None:
        rez["executor"] = {"confirmat": ex.get("confirmat"), "celula_in_editare": ex.get("celula_in_editare"),
                           "nepotriviri": ex.get("nepotriviri") or []}
        for n in ex.get("note") or []:
            rez["note"].append(f"executor: {n}")
        for x in ex.get("nepotriviri") or []:
            if x.get("profil") == "pixel_7":
                rez["note"].append(f"executor pe telefon (Pixel 7): {x['fel']}: {x['ce']}")
    if v in ("FĂCUT", "FĂCUT_CU_INDICIU"):
        desk = [x for x in (ex or {}).get("nepotriviri") or [] if x.get("profil", "desktop_1280") == "desktop_1280"]
        if ex is None:
            rez["verdict"] = v + "_NECONFIRMAT"
            rez["note"].append("FĂCUT cere confirmarea executorului (nivelul 1: acțiunile rulate în pagină); "
                               "fără --executor, verdictul maxim e *_NECONFIRMAT")
        elif ex.get("celula_in_editare"):
            rez["verdict"] = "NEFĂCUT"
            rez["motive"].append("NEFĂCUT: executorul: celula (sau textul) a rămas în editare după ultima acțiune")
        elif ex.get("confirmat") is None:
            rez["verdict"] = v + "_NECONFIRMAT"
            rez["note"].append("executorul n-a avut ce confirma (sarcină fără simulator, canar pe număr sau nicio verificare pe ecran)")
        elif not ex.get("confirmat"):
            rez["verdict"] = "NEFĂCUT"
            rez["motive"].append("NEFĂCUT: executorul n-a văzut pe ecran ce promite lecția")
            for x in desk[:4]:
                rez["motive"].append(f"NEFĂCUT: executor ({x['fel']}): {x['ce']}")
    de_la_zero = bool((secret.get("profil") or {}).get("de_la_zero"))
    probleme = 0 if rez["verdict"] in TRECE and not (de_la_zero and "CU_INDICIU" in rez["verdict"]) else 1
    rez["probleme"] = probleme
    if a.out:
        C.scrie_json(a.out, rez)
    print(f"VERDICT: {rez['verdict']}")
    for x in rez["motive"]:
        print(f"  - {x}")
    for x in rez["note"]:
        print(f"  · {x}")
    if rez.get("canar"):
        print(f"  canar: {json.dumps(rez['canar'], ensure_ascii=False)}")
    for x in rez.get("distante") or []:
        d_ = x.get("potrivire", "-") if x["distanta"] is None else f"{x['distanta']} caractere"
        print(f"  distanța efectivă {x['sarcina']} {x['actiune']} «{x['obiect']}»: {d_} (prag {x['prag']}) → {'primit' if x['primit'] else 'respins'}")
    if a.json:
        print(json.dumps(rez, ensure_ascii=False))
    print(probleme)
    sys.exit(3 if rez["verdict"] == "INVALID" else probleme)


if __name__ == "__main__":
    main()
