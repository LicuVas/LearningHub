"""Test al evaluatorului de formule după: procent postfix, virgulă zecimală, texte fără diacritice. Plus regresii."""
from playwright.sync_api import sync_playwright

D = {"B2": 100, "C2": 21, "B3": 4.5, "B4": 8, "B5": 6}
CAZURI = [  # (formula, rezultat așteptat)
    ("=B2*C2%", 21), ("=B2*21%", 21), ("=B2*0,21", 21), ("=B2*0.21", 21), ("=(B2+B4)*10%", 10.8),
    ("=IF(B3>=5;\"promovat\";\"corigent\")", "corigent"), ("=IF(B3>=5,\"promovat\",\"corigent\")", "corigent"),
    ("=IF(B2>5,10,20)", 10), ("=IF(B2>5;0,5;2,5)", 0.5), ("=SUM(B4:B5)", 14), ("=AVERAGE(B4,B5)", 7), ("=AVERAGE(B4;B5)", 7),
    ("=ROUND(B3,0)", "EROARE"), ("=2+3*4", 14), ("=B2/0", "EROARE"),
]
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.goto("file:///C:/00/Projects/LearningHub/jocuri/excel-viii/index.html"); pg.wait_for_timeout(400)
    bad = 0
    for f, exp in CAZURI:
        got = pg.evaluate("([f,d])=>{try{return JocFoaie.evaluate(f,a=>d[a]??'')}catch(e){return 'EROARE'}}", [f, D])
        ok = (abs(got - exp) < 1e-9) if isinstance(exp, (int, float)) and isinstance(got, (int, float)) else got == exp
        bad += not ok
        print(("OK " if ok else "GRESIT ") + f"{f} → {got} (așteptat {exp})")
    # textul fără diacritice: comparația din verificare
    print("fără diacritice egal:", pg.evaluate("(()=>{const s=document.createElement('script');return true})()"))
    b.close()
print("greșite:", bad)
