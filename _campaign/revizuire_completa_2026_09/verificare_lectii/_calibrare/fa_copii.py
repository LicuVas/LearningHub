# -*- coding: utf-8 -*-
"""Copiile de calibrare ale lecției VII nr. 4, fiecare cu UN defect real plantat (proba că linia nu e oarbă).

    python fa_copii.py

Scrie _calibrare/<nume>/vii/m1-l04/index.html (calea păstrează <clasa>/m1-lNN, ca linia să deducă clasa și nr.).
Fiecare copie primește <base href> spre dosarul lecției originale: scripturile motorului și pozele se încarcă de acolo.
Lecția originală NU se modifică.
  control   — doar <base>: trebuie să dea același rezultat ca originalul (proba că mecanismul copiei nu schimbă nimic)
  a_termen  — „aliniere” și „indentare” (vocabularul lecției 6) folosite într-un „Încearcă”, neexplicate (regula 1)
  b_recun   — trei „Încearcă” (pașii 3, 4, 5) făcute recunoaștere pură: răspunsul e copiat din textul pasului (regula 5)
  c_identic — întrebarea de verificare 1 = copie identică a exercițiului „Încă un exercițiu” 1 de la pasul 2 (regula 5)
"""
from pathlib import Path

ORIG = Path(r"C:/00/Projects/LearningHub/lectii/vii/m1-l04/index.html")
AICI = Path(__file__).resolve().parent
BASE = '<head>\n<base href="file:///C:/00/Projects/LearningHub/lectii/vii/m1-l04/">'


def inlocuieste(s: str, vechi: str, nou: str) -> str:
    assert s.count(vechi) == 1, f"trebuie să apară exact o dată ({s.count(vechi)}): {vechi[:70]}"
    return s.replace(vechi, nou)


def felie(s: str, inceput: str, sfarsit: str, nou: str) -> str:
    """Înlocuiește bucata de la `inceput` până la (inclusiv) `sfarsit`, ambele unice."""
    assert s.count(inceput) == 1, f"început neunic: {inceput[:70]}"
    a = s.index(inceput)
    b = s.index(sfarsit, a)
    return s[:a] + nou + s[b + len(sfarsit):]


def main():
    s0 = ORIG.read_text(encoding="utf-8")
    s0 = inlocuieste(s0, "<head>", BASE)
    copii = {"control": s0}

    # (a) termenii lecției 6, într-un „Încearcă” al pasului 3, fără explicație (fără îngroșare: o scăpare de autor)
    copii["a_termen"] = inlocuieste(
        s0,
        "q:'Sub titlul „Floarea-soarelui” scrie, pe un rând nou, <b>Clasa a VII-a</b>. Atinge titlul",
        "q:'Sub titlul „Floarea-soarelui” scrie, pe un rând nou, <b>Clasa a VII-a</b>, cu aceeași aliniere și aceeași "
        "indentare ca titlul. Atinge titlul")

    # (b) „Încearcă” 3, 4, 5 -> întrebări al căror răspuns e scris chiar în pas (recunoaștere pură)
    b = s0
    b = felie(b, "   incearca:{t:'wordobj',unelte:['text'],\n    q:'Sub titlul „Floarea-soarelui”",
              "Paragraful de dedesubt a rămas neatins.'},",
              "   incearca:{t:'choice',q:'Cum se numește linia subțire care clipește în document?',"
              "o:['Cursorul','Paragraful','Titlul','Rândul'],ok:0,\n"
              "    ajutor:'Citește din nou primul rând al pasului.',why:'Linia subțire care clipește în document este cursorul.'},")
    b = felie(b, "   incearca:{t:'wordobj',\n    q:'Pune poza <b>floarea-soarelui.png</b>",
              "De aceea stă singură pe rândul ei, sub paragraf.'},",
              "   incearca:{t:'choice',q:'Ce înseamnă a insera?',"
              "o:['A pune un obiect nou în document','A șterge un obiect din document','A muta cursorul la capăt','A salva documentul'],ok:0,\n"
              "    ajutor:'Citește prima propoziție a pasului.',why:'Așa scrie în pas: a insera înseamnă a pune un obiect nou în document.'},")
    b = felie(b, "   incearca:{t:'choice',q:'Faci un tabel cu 6 colegi;",
              "6 colegi + 1 rând pentru numele coloanelor → 7 rânduri.'},",
              "   incearca:{t:'choice',q:'Cum se numește o singură căsuță a tabelului?',"
              "o:['Celulă','Rând','Coloană','Pagină'],ok:0,\n"
              "    ajutor:'Citește lista de la începutul pasului.',why:'O celulă e o singură căsuță, acolo unde se întâlnesc un rând și o coloană.'},")
    copii["b_recun"] = b

    # (c) întrebarea 1 = copie identică a exercițiului „Încă un exercițiu” 1 de la pasul 2
    ex = ("{t:'choice',q:'Vrei ca un coleg să vadă cum arată barajul de la Bicaz. Ce obiect pui în document?',"
          "o:['O imagine','Un tabel','Un text lung','Un titlu mare'],ok:0,\n"
          "     ajutor:'Ce trebuie să facă cititorul: să vadă, să citească date sau să citească o explicație?',"
          "why:'Cititorul trebuie să VADĂ cum arată ceva, deci pui o imagine.'}")
    assert s0.count(ex) == 1, "exercițiul-sursă nu mai e în pagină"
    copii["c_identic"] = felie(
        s0, "  {t:'choice',q:'Vrei ca cititorul să compare prețul biletului la 3 muzee.",
        "se citesc cel mai ușor într-un tabel.'},", "  " + ex + ",")

    for nume, text in copii.items():
        p = AICI / nume / "vii" / "m1-l04" / "index.html"
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
        print(f"{nume}: {p} ({len(text)} caractere)")


if __name__ == "__main__":
    main()
