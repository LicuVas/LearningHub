"""SCORUL ȘI FĂRĂ FINAL (05.11.2026, el: „Fă să permită vizualizarea scorului și dacă nu termină - pentru că unii chiar
nu știu ce să pună acolo”).

Până acum fișa trimitea la profesor DOAR „terminată” (joc-gata), când toate testele erau verzi. Acum, în plus, testele
bifate pleacă la fiecare schimbare ca NOTĂ pe pagina fișei, prin Prezenta.nota (calea notelor din lecții, aceeași pe server:
r.note[pagina] = prima / ultima / maximul / încercări / detalii „atomic N/M”). Prezenta.nota trimite doar când nota se
schimbă. Nota = 1 din oficiu + 9 × bifate/total (rotunjit); nimic până la primul test bifat.

Patch idempotent pe cele 6 fișe din 05.11.2026 (4 familii de cod, făcute de agenți diferiți): fiecare ancoră trebuie să
apară EXACT o dată, altfel nu scrie nimic.

    python scor_partial.py            # aplică (sare peste fișele deja modificate)
    python scor_partial.py --verifica # doar spune ce ar face; ultima linie = câte fișe NU sunt la zi (0 = toate)
"""
import os
import sys

ZI = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "2026-11-05")
SEMN = "function scorLaProfesor("

FUNCTIA = """/* SCORUL ȘI FĂRĂ FINAL (05.11.2026, el: „să permită vizualizarea scorului și dacă nu termină”): testele bifate pleacă la
   profesor ca NOTĂ pe pagina fișei (Prezenta.nota, ca la lecții: pleacă doar când nota se schimbă; detaliile „atomic N/M” =
   teste bifate din total). Nota = 1 din oficiu + 9 × bifate/total. Nimic până la primul test bifat. Vezi _unelte/scor_partial.py */
function scorLaProfesor(ok,tot){
  try{ if(!(window.Prezenta&&window.Prezenta.nota)||!(tot>0)||!(ok>0))return;
    window.Prezenta.nota({grade:Math.max(1,Math.min(10,Math.round(1+9*ok/tot))),atomicCorrect:ok,atomicTotal:tot,practiceStarted:false});
  }catch(e){}
}
"""

# familia -> [(ancora, inlocuire)]; {F} = FUNCTIA
FAM = {
    "xi": [
        ("/* anunțarea terminării: ca în jocuri/_motor/motor.js",
         "{F}/* anunțarea terminării: ca în jocuri/_motor/motor.js"),
        ("$('#pastila').textContent='Teste: '+nr+' din '+T.length;",
         "$('#pastila').textContent='Teste: '+nr+' din '+T.length;\n  scorLaProfesor(nr,T.length);"),
        ("window.addEventListener('load',function(){setTimeout(function(){if(S.gata&&teste().every(function(t){return t.ok}))anunta(true)},800)});",
         "window.addEventListener('load',function(){setTimeout(function(){if(S.gata&&teste().every(function(t){return t.ok}))anunta(true)},800)});\n"
         "/* scorul de pe fișă după ce prezenta.js știe cine e elevul (vezi scorLaProfesor) */\n"
         "function scorAcum(){var T=teste();scorLaProfesor(T.filter(function(t){return t.ok}).length,T.length)}\n"
         "window.addEventListener('prezenta',scorAcum);window.addEventListener('load',function(){setTimeout(scorAcum,1500)});"),
    ],
    "xii-c": [
        ("  function anunta(sinc) {",
         "{F}  function anunta(sinc) {"),
        ("document.getElementById('cnt').textContent = 'Teste bifate: ' + n + ' din ' + TOT;",
         "document.getElementById('cnt').textContent = 'Teste bifate: ' + n + ' din ' + TOT;\n    scorLaProfesor(n, TOT);"),
        ("  void n0;",
         "  /* scorul de pe fișă după ce prezenta.js știe cine e elevul (vezi scorLaProfesor) */\n"
         "  function scorAcum() { var n = 0; rezultate().forEach(function (r) { if (r.ok) n++; }); scorLaProfesor(n, TOT); }\n"
         "  window.addEventListener('prezenta', scorAcum);\n"
         "  window.addEventListener('load', function () { setTimeout(scorAcum, 1500); });\n"
         "  void n0;"),
    ],
    "x": [
        ("/* ---- anunțul de final, ca în jocuri/_motor/motor.js",
         "{F}/* ---- anunțul de final, ca în jocuri/_motor/motor.js"),
        ("  $('#nr-ok').textContent = ok;",
         "  $('#nr-ok').textContent = ok;\n  scorLaProfesor(ok, N);"),
        ("addEventListener('prezenta', sincron);",
         "addEventListener('prezenta', sincron);\n"
         "/* scorul de pe fișă după ce prezenta.js știe cine e elevul (vezi scorLaProfesor) */\n"
         "function scorAcum(){ scorLaProfesor(nrOk(evalueaza()), N); }\n"
         "addEventListener('prezenta', scorAcum);\n"
         "addEventListener('load', function(){ setTimeout(scorAcum, 1500); });"),
    ],
    "maistri": [
        ("/* ---------------- anunțul de final (ca în jocuri/_motor/motor.js",
         "{F}/* ---------------- anunțul de final (ca în jocuri/_motor/motor.js"),
        ("' · teste bifate: '+nrOk()+' din '+TESTE.length;",
         "' · teste bifate: '+nrOk()+' din '+TESTE.length;\n  scorLaProfesor(nrOk(),TESTE.length);"),
        ("if(eraGata){var incercari=0,t=setInterval(",
         "/* scorul de pe fișă după ce prezenta.js știe cine e elevul (vezi scorLaProfesor) */\n"
         "function scorAcum(){scorLaProfesor(nrOk(),TESTE.length)}\n"
         "addEventListener('prezenta',scorAcum);addEventListener('load',function(){setTimeout(scorAcum,1500)});\n"
         "if(eraGata){var incercari=0,t=setInterval("),
    ],
}
FISE = {"xi-c": "xi", "xi-d": "xi", "xii-c": "xii-c", "x-e": "x", "x-b": "x", "maistri-i-f": "maistri"}


def main():
    doar = "--verifica" in sys.argv
    nu_la_zi = 0
    for slug, fam in FISE.items():
        cale = os.path.join(ZI, slug, "index.html")
        with open(cale, "rb") as f:
            text = f.read().decode("utf-8")
        if SEMN in text:
            print("%-12s deja la zi" % slug)
            continue
        nu_la_zi += 1
        nou = text
        for anc, inl in FAM[fam]:
            n = nou.count(anc)
            if n != 1:
                sys.exit("%s: ancora apare de %d ori (trebuie o dată): %r - NU scriu nimic" % (slug, n, anc[:70]))
            nou = nou.replace(anc, inl.replace("{F}", FUNCTIA))
        if doar:
            print("%-12s de modificat (%d ancore găsite)" % (slug, len(FAM[fam])))
            continue
        with open(cale, "wb") as f:
            f.write(nou.encode("utf-8"))
        nu_la_zi -= 1
        print("%-12s modificată (+%d caractere)" % (slug, len(nou) - len(text)))
    print(nu_la_zi)


if __name__ == "__main__":
    main()
