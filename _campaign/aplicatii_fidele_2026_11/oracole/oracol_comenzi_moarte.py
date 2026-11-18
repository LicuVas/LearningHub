# -*- coding: utf-8 -*-
"""O8 — oracol_comenzi_moarte.py (R12 „Fără butoane moarte pe drumul lecțiilor”). Etapa 0, 16.11.2026; reparația 7, 17.11.

Drumul lecției = comenzile și filele CITATE în textul paginii (aceleași citate ca la O7: numele din <b> după fila /
grupul / butonul / bifa / lista / meniul … și lanțurile cu „›”; textul paginii cuprinde și pașii-soluție ai
exercițiilor, deci și comenzile FOLOSITE — ce inventar.json numește „predat”). Pe primul exercițiu al fiecărui
simulator din pagină, fiecare control de pe ecran (inclusiv din celelalte file) al cărui nume se potrivește cu un citat
se apasă cu mouse-ul, pe starea de pornire a exercițiului (reîncărcat înainte de fiecare apăsare). E MORT dacă:
  - după apăsare nu se schimbă nimic: nici structura aplicației (DOM-ul fără blocurile-mesaj, ferestrele de dialog,
    meniurile deschise în afara rădăcinii), nici valorile câmpurilor, nici vreun mesaj vizibil — urmărit până la ~0,7 s,
    pornind de la o stare care stă pe loc (două instantanee la rând egale) — sau nu se poate apăsa deloc;
  - SINGURA schimbare e mesajul „aici nu e simulată” (R12, prima frază: o comandă folosită sau citată de lecție trebuie
    să funcționeze): mesajul marcat de bibliotecă cu data-lh-nesimulat (api_biblioteca.md §3) sau unul dintre tiparele
    de text ale simulatoarelor vechi (structura_lib.TIPARE_NESIMULAT, cu fișier:rând);
  - e GRI pe ecran, dar referința reală (referinte/uia_<app>.json) NU o arată indisponibilă (`activ` ≠ false) — căutată
    în suprafața filei pe care stă + Acces rapid / rândul filelor / barele de stare și de titlu, altfel oriunde în
    referință; o aplicație fără referință (Windows, File Explorer, Paint) nu poate dovedi că e gri în realitate, deci
    gri = moartă acolo (`fara_referinta`: podea până la referința lor, într-o rundă `acoperire`).
Neconcludente (nu se numără, se raportează): pagina se schimbă singură, controlul nu se mai găsește după reîncărcare, fila
e deja activă, listă nativă <select> (clicul doar o deschide), control gri pe ecran ȘI indisponibil în referință (la toate
aparițiile potrivite). O comandă pe care aplicația reală o arată gri la pornire (ex. Undo fără nimic de anulat) dar
simulatorul o arată activă și tace RĂMÂNE moartă (primește doar indiciul de reparație: s-o arate gri).
Rândul informativ dinaintea căii JSON: procentul de comenzi SIMULATE din total (fără țintă): din unitățile referinței Office
(file_panglicii, panglica fiecărei file principale, Acces rapid, bara de stare, File › nav), câte apar desenate în cel
puțin o pagină FĂRĂ marcajul de nesimulat (vechi: data-nesim / pg-nesim / data-*="nesim…"; convenție: data-lh-nesimulat).
Gata (R12) = 0 comenzi moarte. Detalii: <iesiri>/oracol_comenzi_moarte.json."""
import sys
from collections import Counter
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import structura_lib as L


def procent_simulate(c, refs):
    total, simulate, pe_app = 0, 0, {}
    toate = [i for r in c["pagini"].values() for i in r["instante"]]
    for app in L.OFFICE:
        ref = refs[app]
        if not ref.canon:
            continue
        chei = [k for k in ref.canon if k in ("file_panglicii", "acces_rapid", "bara_stare", "backstage.nav") or k.startswith("panglica.")]
        univ, sim = set(), set()
        for k in chei:
            for gi, g in enumerate(ref.canon[k]["grupuri"]):
                for ui in range(len(g["u"])):
                    univ.add((k, gi, ui))
        for i in toate:
            if i["aplicatie"] != app:
                continue
            for k in chei:
                rc = i["suprafete"].get(k)
                if not rc:
                    continue
                RG, XG = ref.canon[k]["grupuri"], rc["grupuri"]
                gR = [{"et": g["g"], "cand": [g["g"]], "id": None if g["g"] else "__implicit__"} for g in RG]
                gX = [{"et": g["g"], "cand": g.get("cand") or [g["g"]], "id": None if g["g"] else "__implicit__"} for g in XG]
                gp, _, _, _ = L.aliniaza(gR, gX)
                for gi, xi in gp:
                    pairs, _, _, _ = L.aliniaza(RG[gi]["u"], XG[xi]["u"], k in ("bara_stare", "bara_titlu"))
                    for a, b in pairs:
                        if not XG[xi]["u"][b]["nesim"]:
                            sim.add((k, gi, a))
        pe_app[app] = {"total": len(univ), "simulate": len(sim)}
        total += len(univ)
        simulate += len(sim)
    return total, simulate, pe_app


def inactive_la_pornire(refs):
    """etichetele pe care aplicația reală le arată DEZACTIVATE (gri) la pornire (referința: activ=false la toate
    aparițiile; ex. Undo/Redo fără nimic de anulat, Cut/Copy fără selecție). NU scuză o comandă moartă: în simulator ea
    arată activă și tace, deci elevul apasă și nu se întâmplă nimic; reparația fidelă e s-o arate gri (atunci O8 o
    judecă după referință). Se notează doar ca indiciu de reparație."""
    out = {}
    for app, ref in refs.items():
        stari = {}
        for c in ref.canon.values():
            for g in c["grupuri"]:
                for u in g["u"]:
                    stari.setdefault(u["et"], set()).add(u.get("activ", True))
        out[app] = {et for et, s in stari.items() if s == {False}}
    return out


def stare_in_referinta(r, ref):
    """Starea comenzii apăsate în aplicația REALĂ: 'inactiva' (toate aparițiile potrivite au activ=false), 'activa',
    'negasita' (nu e în referință) sau 'fara_referinta' (aplicația n-are încă referință). Se caută întâi în fila pe care
    stă comanda (fila activă la pornire sau fila apăsată) + suprafețele mereu la vedere, apoi în toată referința."""
    if not ref.canon:
        return "fara_referinta"
    cand = set(L.cand_norm([r.get("raw")] + list(r.get("cand") or [])))
    idm = r.get("id")

    def stari(chei):
        s = []
        for k in chei:
            c = ref.canon.get(k)
            if not c:
                continue
            for g in c["grupuri"]:
                for u in g["u"]:
                    if (idm and u.get("id") == idm) or (u["et"] and u["et"] in cand):
                        s.append(u.get("activ", True))
        return s
    chei = list(L.MEREU_LA_VEDERE)
    for v in r.get("fila_cand") or []:
        fk = ref.cheie_pentru("panglica?" + v)
        if fk:
            chei.insert(0, fk)
            break
    s = stari(chei) or stari(list(ref.canon))
    if not s:
        return "negasita"
    return "activa" if any(s) else "inactiva"


def masoara():
    refs = L.referinte()
    c = L.randare()
    rez = [dict(r, pagina=p) for p, pr in c["pagini"].items() for r in pr.get("o8") or []]
    inactive = inactive_la_pornire(refs)
    gri_morti, gri_scuzate = 0, 0
    for r in rez:
        if r.get("efect") is False and any(x in inactive.get(r.get("aplicatie"), set()) for x in L.cand_norm([r.get("raw")])):
            r["indiciu"] = "în aplicația reală e gri la pornire (referința: activ=false): simulatorul ar trebui s-o arate gri"
        if r.get("gri"):
            st = stare_in_referinta(r, refs[r["aplicatie"]]) if r.get("aplicatie") in refs else "fara_referinta"
            r["in_referinta"] = st
            if st == "inactiva":
                gri_scuzate += 1
                r["motiv"] = "gri pe ecran, ca în aplicația reală (referința: indisponibilă) — nu se judecă"
            else:
                gri_morti += 1
                r["efect"] = False
                r["motiv"] = {"activa": "gri pe ecran, dar ACTIVĂ în aplicația reală (referința n-o arată indisponibilă)",
                              "negasita": "gri pe ecran, iar referința n-o arată indisponibilă (nu e în referință)",
                              "fara_referinta": "gri pe ecran; aplicația n-are referință care s-o arate indisponibilă"}[st]
    moarte = [r for r in rez if r.get("efect") is False]
    vii = [r for r in rez if r.get("efect") is True]
    necon = [r for r in rez if r.get("efect") is None]
    pe_motiv = Counter(r.get("motiv") for r in necon)
    pe_fel_moarte = Counter("gri" if r.get("gri") else "doar_mesaj_nesimulat" if r.get("doar_nesimulat") else
                            "nu_se_poate_apasa" if r.get("motiv") == "nu se poate apăsa" else "nicio_schimbare" for r in moarte)
    pagini_moarte = {}
    for p in c["pagini"]:
        m = [r for r in moarte if r.get("pagina") == p]
        if m:
            pagini_moarte[p] = [{"comanda": r["raw"], "simulator": r["tip_sim"], "exercitiu": r["instanta"],
                                 "marcata_nesimulata": r.get("nesim_marcat"), "motiv": r.get("motiv"),
                                 "mesaje_noi": r.get("mesaje_noi"), "in_referinta": r.get("in_referinta"),
                                 "indiciu": r.get("indiciu")} for r in m]
    tot, sim, pe_app = procent_simulate(c, refs)
    pct = (100.0 * sim / tot) if tot else 0.0
    det = {"definitie": __doc__.split("\n\n", 1)[1], "apasate": len(rez), "cu_efect": len(vii), "moarte": len(moarte),
           "moarte_pe_fel": dict(pe_fel_moarte), "gri_judecate_moarte": gri_morti, "gri_scuzate_de_referinta": gri_scuzate,
           "neconcludente": len(necon), "neconcludente_pe_motiv": dict(pe_motiv), "pagini_cu_comenzi_moarte": pagini_moarte,
           "moarte_marcate_nesimulate": sum(1 for r in moarte if r.get("nesim_marcat")),
           "tipare_nesimulat": L.TIPARE_NESIMULAT,
           "procent_comenzi_simulate": round(pct, 2), "comenzi_simulate": sim, "comenzi_total": tot, "pe_aplicatie": pe_app,
           "toate_apasarile": rez, "randare": {"generat": c.get("generat"), "secunde": c.get("secunde")}}
    linii = [f"comenzi de pe drumul lecțiilor apăsate: {len(rez)} (cu efect: {len(vii)}, moarte: {len(moarte)}, "
             f"neconcludente: {len(necon)}); pagini cu comenzi moarte: {len(pagini_moarte)}",
             "moarte pe fel: " + (", ".join(f"{k}={v}" for k, v in pe_fel_moarte.most_common()) or "-") +
             f"; gri scuzate de referință: {gri_scuzate}",
             f"procent_comenzi_simulate: {pct:.1f}% ({sim}/{tot}; Word+Excel+PowerPoint, unitățile referinței desenate "
             f"fără marcaj de nesimulat în cel puțin o pagină)"]
    return len(moarte), det, linii


if __name__ == "__main__":
    L.ruleaza("oracol_comenzi_moarte", masoara)
