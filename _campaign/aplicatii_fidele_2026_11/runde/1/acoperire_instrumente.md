# Runda 1 · `acoperire` pe INSTRUMENTE — O7 judecă biblioteca doar unde e încărcată; O4 trece pe pagina veche când aplicația nu e în bibliotecă (18.11.2026)

Agentul rundei `acoperire` (nu autorul bibliotecii; `aplicatii/` neatins). Fișiere schimbate: **2**, ambele înghețate:
`oracole/oracol_text_ui.py` (O7) și `oracole/oracol_comportament.py` (O4). `sim_runner.js` și `structura_lib.py` NU au fost
atinse (nu a fost nevoie). Toate ieșirile mele: `runde/1/acoperire/` (scripturile probelor în `runde/1/acoperire/probe/`).

## Numerele întâi

| | înainte de bibliotecă (pornire) | runda 1, cu biblioteca, oracole vechi | cu biblioteca, oracole REPARATE |
|---|---|---|---|
| O7 | 355 | 794 (+439 `lipsa_in_biblioteca`) | **355** — identic citat cu citat cu pornirea |
| O4 | 162 | 128 (Explorer: 18 neexecutabile) | **98** — Explorer 14 ok + 4 diferențe (ca la pornire), Word ca după bibliotecă |
| mutanți O4 | 7/8 (17.11, fără bibliotecă) | — | **7/8** (neprins doar O4-04, ca înainte) |
| mutanți O7 | 6/6 (17.11, fără bibliotecă) | **1/6** (măsurat azi, biblioteca pe disc) | **6/6** |

## Verificarea diagnosticului din `regres.md` (în cod, nu pe cuvânt)
- O7: confirmat. `oracol_text_ui.py:29-43` (vechi) construia indexul bibliotecii din instanțele „conventie” ale tuturor paginilor
  de îndată ce `structura_lib.biblioteca_exista()` (`structura_lib.py:1954`, orice `aplicatii/**/*.js`) era adevărat, iar
  `:63-65` număra `lipsa_in_biblioteca` orice citat bun în referință și negăsit în index. Randarea de azi: **0 pagini** din
  inventar cu vreo instanță în mod „conventie” → index gol → fiecare citat Office bun = „lipsă”. Mai grav decât scria
  regres.md: oracolul devenise și ORB — un citat bun stricat trecea din „lipsa_in_biblioteca” (1) în „loc_gresit” (1), numărul
  nu creștea. Bancul de mutanți pe codul vechi, cu biblioteca pe disc: **O7 1/6** (linia de bază 238 în loc de 55; neprinși
  O7-02…06) — `runde/1/acoperire/mutanti_O7_inainte/rezultat.json`.
- O4: confirmat. `pagini_candidate` pune `aplicatii/poligon.html` primul; `sim_runner.js › motor()` (r. 56) întoarce
  „biblioteca” pentru orice aplicație dacă `LH.aplicatii` există; `joaca` (vechi r. 382-384) întorcea „neexecutabil” la primul
  eșec al pregătirii. Eroarea: `pregătirea a eșuat: „explorer” nu e încă în bibliotecă (vine într-un val următor)` — fraza vine
  din `aplicatii/aplicatii.js:80` (`incarcaApp`, aplicațiile fără intrare în `SURSE_APP`). Excel și PowerPoint pățeau la fel,
  doar că pentru ele nu există adaptor vechi, deci numărul lor nu se schimbă.

## Ce am schimbat și de ce

**A. O7 (`oracol_text_ui.py`)** — `lipsa_in_biblioteca` se judecă doar pe aplicațiile pe care LOCUL citatului le ia din bibliotecă.
- Detectarea, din datele pe care oracolul le avea deja: aceeași randare (`L.randare()`) din care se face și indexul bibliotecii.
  O pagină „încarcă biblioteca” pentru aplicația X dacă are o instanță a lui X în mod „conventie” (rădăcina `[data-lh-aplicatie]`
  pusă de bibliotecă, `arbore_randat.js:483,515`). Am ales asta (nu scriptul `aplicatii/aplicatii.js` din HTML) fiindcă dă
  aplicația, nu doar „pagina are biblioteca”, și e exact sursa indexului: un citat se judecă pe bibliotecă doar unde indexul
  chiar are de unde să-l conțină.
- Regula: `pe_bib` = aplicațiile citatului (cu referință) luate din bibliotecă de acel loc. Dacă `pe_bib` e gol → judecat exact ca
  înainte de bibliotecă. Dacă citatul e adevărat în referință pentru o aplicație pe care locul o arată încă pe simulatorul vechi
  → judecat ca înainte (o pagină mixtă din etapa C, Word mutat + Excel vechi, nu primește „lipsă” pe citatele Excel).
  Altfel, ca în regula veche: negăsit în bibliotecă → `lipsa_in_biblioteca`. Când locul ia din bibliotecă toate aplicațiile
  citatului (după mutare), regula e **identic cea veche** (dovada 1b).
- Fișele „Cum fac…?” nu sunt pagini care încarcă ceva. Le-am dat aplicațiile luate din bibliotecă de **cel puțin o pagină din
  inventar** (R11 cere explicit fișele în arborele bibliotecii; dacă nu le judecam deloc pe bibliotecă, O7 ar fi devenit orb pe
  ele în etapa C). Azi mulțimea e goală, deci fișele se judecă exact ca la pornire. Aceasta e singura mea extindere peste
  textul cererii („doar citatele de pe paginile care încarcă biblioteca”). Dacă orchestratorul o vrea strict, schimbarea e de un
  cuvânt: `toate_bib` → `set()` la apelul pentru fișe.
- Ieșirea primește `pagini_cu_biblioteca` (pagina → aplicații) și rândul „verificat pe N pagini care încarcă biblioteca”.

**B. O4 (`oracol_comportament.py`)** — funcția nouă `lipseste_din_biblioteca(pg, app, eroare)` și 5 rânduri în `joaca`:
- Când pregătirea pe o pagină cu motorul „biblioteca” pică și (1) eroarea conține fraza bibliotecii `„<app>” nu e încă în
  bibliotecă` pentru EXACT aplicația scenariului și (2) în pagină nu există nicio rădăcină `[data-lh-aplicatie=<app>]`
  (biblioteca n-a început s-o deschidă), pagina e tratată ca pagină fără motor pentru aplicația aceea:
  `cache_motor[(pagina, app)] = None` (următoarele scenarii ale aplicației o sar, la fel ca pe o pagină veche fără adaptor),
  eroarea intră în listă și se trece la pagina candidată următoare (adaptorul vechi).
- Orice alt eșec de pregătire pe bibliotecă (altă frază, fraza pentru altă aplicație, rădăcina deja pusă) rămâne
  `neexecutabil` pe poligon, ca înainte (dovada 2b).
- `sim_runner.js` NEatins: `pregateste` întoarce deja eroarea, iar rădăcina se citește din Python cu un `pg.evaluate`.
- Mesajul final „pe cele N pagini candidate… nu e nici biblioteca (aplicatii/poligon.html)” a devenit „nu e nici biblioteca cu
  „<app>” (…)”. Era fals odată ce biblioteca există. Doar textul; nu se numără.

## Dovezile

**1. O7 cu biblioteca pe disc = pornirea, citat cu citat** (`runde/1/acoperire/iesiri/O7/`, comparat de
`probe/compara_o7.py` → `iesiri/O7/comparatie_pornire.txt`):
număr 355 = 355 · citate judecate 1102 = 1102 · fișe 298 = 298 · pe motiv identic (`fara_referinta` 217, `comanda_inexistenta` 74,
`neacoperit` 39, `loc_gresit` 14, `dialog_inexistent` 10, `fila_inexistenta` 1) · **aceleași 355 de probleme, în aceeași
ordine, pe toate cele 9 câmpuri (unde, sursa, lanț, fel, fila, grupul, aplicații, fără referință, motiv): abateri 0**.
`biblioteca_verificata: true` (biblioteca a fost randată), `pagini_cu_biblioteca: {}`.

**1b. O7 nu e mai orb unde biblioteca E încărcată** (`probe/proba_reducere_o7.py`, fără browser → `proba_reducere_o7.log`):
randarea simulată spune că o pagină încarcă biblioteca (Word: `lectii/vii/m1-l03`; separat Excel: `lectii/viii/m1-l02`), cu
arborele bibliotecii gol. Regula nouă comparată cu regula veche de la HEAD (care reproduce exact 794 pe tot situl):
- Word: 77 de probleme pe pagina aceea + fișele Cum fac Word = **identice** cu regula veche (din care `lipsa_in_biblioteca` 65:
  11 pe pagină, 54 în fișe); restul de 343 = **identice** cu pornirea; abateri 0.
- Excel: 67 = 67 identice (`lipsa` 58: 1 pe pagină, 57 în fișe); restul 346 = pornirea; abateri 0.

**2. O4: 98** (`runde/1/acoperire/iesiri/O4/`, comparat de `probe/compara_o4.py` → `iesiri/O4/comparatie.txt`), pe fiecare
scenariu cu verdict, pondere, diferențele (cheie și valori) și ecranul:
- Explorer 18/18 identice cu `iesiri_pornire/O4`: **14 ok + 4 cu diferențe**, toate pe `vechi:explorer` (paginile vechi);
- Word 54/54 identice cu `iesiri/O4` (după bibliotecă): 45 ok, 1 diferență, 7 fără real, 1 neexecutabil (`word-imagine-inserare`,
  pasul 1, nu pregătirea, deci rămâne);
- Excel 41/41 și PowerPoint 17/17 identice cu pornirea;
- totalul calculat din referințe (diferențe 6 + chei neexecutabile 80 + fără real 12 + ecran 0) = **98 = 98** măsurat.
  Totalul nou al lui O4 e **98** (pornire 162, runda 1 cu oracolul vechi 128).

**2b. Trecerea pe pagina veche nu ascunde eșecurile** (`probe/proba_trecere_o4.py` → `proba_trecere_o4.log`; copie în %TEMP%
= simulatoarele vechi + biblioteca-jucărie cu un singur rând plantat în `L.deschide` pentru explorer; 6/6 verificări ok):
V0 fără bibliotecă = 4 (14 ok + 4 dif.) · J0 jucăria curată = 0 (18 ok pe bibliotecă) · **L1** fraza „nu e încă în bibliotecă”
= 4, aceleași verdicte ca V0, toate pe `vechi:explorer` · **E1** alt eșec („datele nu s-au încărcat”) = 34 = toate cheile, 18
neexecutabile pe poligon · **E2** fraza corectă DUPĂ ce rădăcina a fost pusă = 34, rămâne eșec · **E3** fraza pentru altă
aplicație („„word” nu e încă…”) = 34, rămâne eșec.

**3. Bancul de mutanți O4 + O7** (`LH_IESIRE=runde/1/acoperire/mutanti_dupa python mutanti/mutanti.py --oracol O4,O7 --paralel 2`,
288 s, pe copia worktree-ului cu biblioteca rundei 1 în ea → `mutanti_dupa/rezultat.json`):
**O4 7/8** (neprins doar O4-04, 4 → 4, ca în reverificarea 2) · **O7 6/6** · niciun oracol sub 5. Mulțimile prinse sunt
identice cu `mutanti/rezultat.json` (O4: 01, 02, 03, 05, 06, 07, 08; O7: 01-06). Liniile de bază sunt aceleași (O4 4/4 și 23/23
pe jucărie, O7 55/55), la fel creșterile (O4-03 4 → 14, O4-08 23 → 27 …). Explorer-ul (O4-01…07) e prins doar prin trecerea pe
pagina veche: în copie biblioteca are doar Word.
`mutanti/rezultat.json` NU a fost suprascris: `mutanti.py` îl scrie în `LH_IESIRE` dacă e dat, altfel în `mutanti/`. Am dat
`LH_IESIRE` la ambele rulări. Fișierul e în git, dar NU în `repere.lock` (lacătul are din `mutanti/` doar `mutanti.py` și
`banca.json`). sha256 înainte = după = `c361b48d…c7a1464a` (`acoperire/rezultat_json_sha_inainte.txt` + rândul de la finalul
rulării).

**4. `--autotest`**: `python oracole/oracol_comportament.py --autotest` → **0** neprinși / verificări picate, cod 0 (`acoperire/autotest_O4.log`): copia nemutată cu simulatoarele vechi, scenariile Explorer = 4; 7/7 mutanți pe simulatoarele vechi prinși (4 → 5…10); jucăria curată = 0; 2/2 mutanți pe jucărie prinși (0 → 3, 0 → 6); ecranul = starea pe jucăria curată = 0; 2/2 mutanți ecran≠stare prinși (0 → 1). Calea nouă nu se declanșează în copiile autotestului (simulatoarele vechi fără bibliotecă sau jucăria care are toate aplicațiile), deci autotestul trece pe exact aceleași drumuri ca înainte. Cazurile trecerii sunt în dovada 2b. O7 nu are `--autotest` (nici înainte, nici acum).

**5. Reînghețarea**: `python ingheata.py --verifica` înainte: abateri 2 (SCHIMBAT `oracole/oracol_comportament.py`, `oracole/oracol_text_ui.py`, nimic NOU, nimic LIPSĂ) → `python ingheata.py --acoperire "O7 per pagină + O4 trece pe pagina veche când aplicația nu e în bibliotecă; runda 1 B-word"` → `repere.lock` scris 18.11.2026 19:36:05, 306 fișiere, amprenta `1c9cceb820ea4829`, `acoperire: true`, lacătul vechi (17:10:04) trecut în `istoric` → `python ingheata.py --verifica` = **0** (INTACT).

## Ce NU am putut dovedi / ce rămâne
- **O4 se sprijină pe fraza bibliotecii** (`aplicatii/aplicatii.js:80`, cod NEînghețat). Contractul înghețat `api_biblioteca.md`
  nu are un semnal oficial pentru „aplicația nu e (încă) în bibliotecă”. Dacă fraza se schimbă, trecerea se oprește și
  scenariile ies `neexecutabil` (numărul CREȘTE, nu se ascunde nimic). Riscul rămas: cineva scoate o aplicație din `SURSE_APP`
  ca să nu-i mai pice scenariile. Atunci O4 măsoară simulatorul vechi, adică exact ce încarcă lecțiile, iar O1 numără în
  continuare paginile pe simulatoare vechi. Propunere pentru o rundă `acoperire` viitoare: un semnal declarat în
  `api_biblioteca.md` (ex. `LH.aplicatii.are(nume)`) în locul frazei.
- **O7 detectează „încarcă biblioteca” din randare.** O pagină care încarcă biblioteca, dar a cărei randare pică pentru o
  instanță, nu are instanță „conventie” pentru aplicația aceea și e judecată ca înainte. Erorile de randare stau în
  `randare_*.json › erori`; NU am verificat dacă O2/O3 le numără [NEVERIFICAT].
- O5 și O9 lucrează și ele pe `aplicatii/poligon.html`. NU le-am citit și NU le-am atins (în afara perimetrului). Nu știu dacă
  au același tipar „prima pagină cu bibliotecă, apoi stop” [NEVERIFICAT].
- Autotestul O4 nu are cazurile de trecere (copiile lui n-au biblioteca reală). Le acoperă `probe/proba_trecere_o4.py`, care e
  în dosarul rundei, nu în oracol: oracolul înghețat nu se schimbă mai mult decât trebuie.
- `masoara.py` întreg NU l-am rulat (îl rulează orchestratorul la publicare). Nimic comis, nimic împins.

## Diff-ul complet al oracolelor
`git -C C:/00/Projects/LearningHub_fidel diff -- _campaign/aplicatii_fidele_2026_11/oracole` (și în `acoperire/diff_oracole.patch`):

```diff
diff --git a/_campaign/aplicatii_fidele_2026_11/oracole/oracol_comportament.py b/_campaign/aplicatii_fidele_2026_11/oracole/oracol_comportament.py
index 4c1f6bc0..30749a7f 100644
--- a/_campaign/aplicatii_fidele_2026_11/oracole/oracol_comportament.py
+++ b/_campaign/aplicatii_fidele_2026_11/oracole/oracol_comportament.py
@@ -22,6 +22,11 @@ Unde se joacă (în ordine; primul care merge):
     1. <rad>/aplicatii/poligon.html cu biblioteca centrală (window.LH.aplicatii) — contractul din ../api_biblioteca.md;
     2. paginile din „lectii” ale scenariului, apoi paginile din inventar.json cu aceeași aplicație principală, pe
        simulatoarele VECHI care au adaptor în sim_runner.js (azi: doar Explorer).
+    O pagină cu biblioteca pe care pregătirea pică DOAR pentru că aplicația nu e (încă) în bibliotecă (biblioteca spune
+    „„<app>” nu e încă în bibliotecă” și n-a pus nicio rădăcină [data-lh-aplicatie=<app>]) e tratată ca o pagină fără
+    motor pentru aplicația aceea: se trece la pagina următoare (runda `acoperire` din 18.11.2026 — înainte, în etapa B,
+    biblioteca doar cu Word oprea scenariile Explorer pe poligon, fără să mai ajungă la adaptorul vechi). Orice alt eșec
+    de pregătire pe bibliotecă rămâne eșec (neexecutabil), nu se ascunde pe o pagină veche.
 Rezultatul simulat al fiecărui scenariu: D/runde/_sim/<id>.json (cu LH_IESIRE: <LH_IESIRE>/_sim/<id>.json), aceeași formă
 ca rezultatul real: {id, mod_probat, stare, eroare, cum}. mod_probat = true doar dacă scenariul s-a jucat până la capăt.
 Cheile comparate ca MULȚIMI (descrierea scenariilor: „ordonate cu sorted() din Python”): nume_fisiere, in_cos.
@@ -359,6 +364,18 @@ def deschide(pg, baza, pagina):
     pg.add_script_tag(path=str(RUNNER))
 
 
+def lipseste_din_biblioteca(pg, app, eroare):
+    """True doar dacă pregătirea pe bibliotecă a picat pentru că aplicația NU e (încă) în ea: fraza bibliotecii
+    (aplicatii/aplicatii.js › incarcaApp: „„<app>” nu e încă în bibliotecă”) pentru EXACT aplicația scenariului, și nicio
+    rădăcină [data-lh-aplicatie=<app>] pusă în pagină (biblioteca n-a început s-o deschidă). Altă frază, altă aplicație
+    sau o rădăcină începută = aplicația e în bibliotecă și pică: rămâne eșec. Dacă biblioteca își schimbă fraza, trecerea
+    se oprește și scenariile ies neexecutabile (numărul crește, nu se ascunde nimic)."""
+    if not re.search(r"[„“\"']%s[”“\"'] nu e încă în bibliotecă" % re.escape(str(app)), str(eroare or "")):
+        return False
+    return not pg.evaluate("a=>[...document.querySelectorAll('[data-lh-aplicatie]')]"
+                           ".some(e=>e.getAttribute('data-lh-aplicatie')===a)", app)
+
+
 def joaca(br, baza, scen, inv, plecate, cache_motor):
     """Întoarce (rezultat_sim, pagina, motor, eroare)."""
     app = scen.get("aplicatie")
@@ -381,6 +398,11 @@ def joaca(br, baza, scen, inv, plecate, cache_motor):
                 continue
             r = pg.evaluate("s=>window.LHSimRunner.pregateste(s)", scen)
             if not r.get("ok"):
+                if m == "biblioteca" and lipseste_din_biblioteca(pg, app, r.get("eroare")):
+                    # ca și cum biblioteca n-ar exista pentru aplicația asta: pagina nu are motor pentru ea -> următoarea
+                    cache_motor[(pagina, app)] = None
+                    erori.append("%s: %s" % (pagina, r.get("eroare", "?")))
+                    continue
                 return None, pagina, m, "neexecutabil: " + r.get("eroare", "?")
             pg.wait_for_timeout(150)
             for i, pas in enumerate(scen.get("pasi") or []):
@@ -402,8 +424,8 @@ def joaca(br, baza, scen, inv, plecate, cache_motor):
         finally:
             ctx.close()
     if fara_motor and not erori:
-        return None, None, None, ("neexecutabil: pe cele %d pagini candidate (%s…) nu e nici biblioteca (aplicatii/poligon.html), "
-                                  "nici un simulator vechi cu adaptor pentru „%s”" % (len(fara_motor), fara_motor[0], app))
+        return None, None, None, ("neexecutabil: pe cele %d pagini candidate (%s…) nu e nici biblioteca cu „%s” (aplicatii/poligon.html), "
+                                  "nici un simulator vechi cu adaptor pentru „%s”" % (len(fara_motor), fara_motor[0], app, app))
     return None, None, None, "neexecutabil: " + ("; ".join(erori[:3]) if erori else "nicio pagină candidată pe disc")
 
 
diff --git a/_campaign/aplicatii_fidele_2026_11/oracole/oracol_text_ui.py b/_campaign/aplicatii_fidele_2026_11/oracole/oracol_text_ui.py
index 6a20d43e..e140014f 100644
--- a/_campaign/aplicatii_fidele_2026_11/oracole/oracol_text_ui.py
+++ b/_campaign/aplicatii_fidele_2026_11/oracole/oracol_text_ui.py
@@ -18,6 +18,10 @@ Aplicațiile căutate: ale paginii (inventar) + Windows (orice lecție rulează
 Motivele: fila_inexistenta, grup_inexistent, comanda_inexistenta, dialog_inexistent, loc_gresit (există, dar în alt
 loc), neacoperit (urmează o listă derulantă/galerie necapturată în referință), fara_referinta (aplicația nu are încă
 referință: Windows, File Explorer, Paint), lipsa_in_biblioteca. Toate se numără. Gata (R11) = 0.
+lipsa_in_biblioteca (runda `acoperire`, 18.11.2026) se judecă doar pe aplicațiile pe care locul citatului le ia din
+bibliotecă: pagina = aplicațiile cu instanță în mod „conventie” în randarea ei; fișa Cum fac = aplicațiile luate din
+bibliotecă de cel puțin o pagină din inventar. Citatele unei pagini care nu încarcă biblioteca (etapa B: toate) se
+judecă exact ca înainte de apariția ei.
 Detalii: <iesiri>/oracol_text_ui.json."""
 import sys
 from collections import Counter
@@ -27,9 +31,13 @@ import structura_lib as L
 
 
 def index_biblioteca(refs):
+    """→ (indexul bibliotecii pe aplicație, {pagina: aplicațiile pe care pagina le încarcă din bibliotecă}).
+    O pagină „încarcă biblioteca” pentru o aplicație dacă randarea ei are o instanță a aplicației în mod „conventie”
+    (rădăcina [data-lh-aplicatie] pusă de bibliotecă) — aceleași instanțe din care se face și indexul."""
     if not L.biblioteca_exista():
-        return None
+        return None, {}
     c = L.randare()
+    din_bib = {p: {i["aplicatie"] for i in r["instante"] if i["mod"] == "conventie"} for p, r in c["pagini"].items()}
     out = {}
     for app in L.APLICATII:
         uni = {}
@@ -40,16 +48,22 @@ def index_biblioteca(refs):
                 for k, v in i["suprafete"].items():
                     uni.setdefault(k, v)
         out[app] = L.IndexUI(uni, refs[app] if refs[app].canon else None)
-    return out
+    return out, din_bib
 
 
 def masoara():
     refs = L.referinte()
     idx_ref = {a: L.IndexUI(r.canon, r) for a, r in refs.items() if r.canon}
-    idx_bib = index_biblioteca(refs)
+    idx_bib, din_bib = index_biblioteca(refs)
+    toate_bib = set().union(*din_bib.values()) if din_bib else set()
     probleme, n_cit, pe_motiv = [], 0, Counter()
 
-    def judeca(cit, apps, unde):
+    def judeca(cit, apps, unde, bib):
+        """bib = aplicațiile pe care locul citatului le ia din bibliotecă (pagina: ale ei; fișele Cum fac: cele luate din
+        bibliotecă de cel puțin o pagină din inventar). Runda `acoperire` din 18.11.2026: `lipsa_in_biblioteca` se judecă
+        DOAR pe aplicațiile din bib; un citat adevărat în referință pentru o aplicație pe care locul o arată încă pe
+        simulatorul vechi se judecă exact ca înainte de bibliotecă. Când bib cuprinde toate aplicațiile citatului (după
+        mutare), regula e cea veche, neschimbată."""
         nonlocal n_cit
         n_cit += 1
         cu_ref = [a for a in apps if a in idx_ref]
@@ -61,7 +75,9 @@ def masoara():
             if not any(ok for ok, _ in rez):
                 motiv = rez[0][1]
             elif idx_bib is not None:
-                if not any(idx_bib[a].rezolva(cit)[0] for a in cu_ref if a in idx_bib):
+                pe_bib = [a for a in cu_ref if a in bib]
+                adevarat_pe_vechi = any(ok for a, (ok, _) in zip(cu_ref, rez) if a not in bib)
+                if pe_bib and not adevarat_pe_vechi and not any(idx_bib[a].rezolva(cit)[0] for a in pe_bib if a in idx_bib):
                     motiv = "lipsa_in_biblioteca"
         if motiv:
             pe_motiv[motiv] += 1
@@ -75,7 +91,7 @@ def masoara():
             if a in L.APLICATII and a not in apps:
                 apps.append(a)
         for cit in L.citate_pagina(p["pagina"]):
-            judeca(cit, apps, "lectie")
+            judeca(cit, apps, "lectie", din_bib.get(p["pagina"], set()))
     n_fise = 0
     for f in L.fise_cum_fac():
         if f["aplicatie"] not in L.APLICATII:
@@ -83,12 +99,16 @@ def masoara():
         n_fise += 1
         apps = [f["aplicatie"]] + (["windows"] if f["aplicatie"] != "windows" else [])
         for cit in L.citate_din_text(f["text"], f"{f['fisier']}#{f['fisa']}"):
-            judeca(cit, apps, "cum_fac")
+            judeca(cit, apps, "cum_fac", toate_bib)
     n = len(probleme)
+    cu_bib = {p: sorted(a) for p, a in sorted(din_bib.items()) if a}
     det = {"definitie": __doc__.split("\n\n", 1)[1], "citate_judecate": n_cit, "fise_cum_fac": n_fise,
-           "biblioteca_verificata": idx_bib is not None, "pe_motiv": dict(pe_motiv.most_common()), "probleme": probleme}
+           "biblioteca_verificata": idx_bib is not None, "pagini_cu_biblioteca": cu_bib,
+           "pe_motiv": dict(pe_motiv.most_common()), "probleme": probleme}
     linii = [f"citate judecate: {n_cit} (lecții din inventar + {n_fise} fișe Cum fac); arborele bibliotecii: "
-             f"{'verificat' if idx_bib is not None else 'nu există încă (doar referința)'}",
+             + (f"verificat pe {len(cu_bib)} pagini care încarcă biblioteca"
+                + (f" ({', '.join(sorted(toate_bib))}; și fișele Cum fac ale acestor aplicații)" if toate_bib else "")
+                if idx_bib is not None else "nu există încă (doar referința)"),
              "pe motiv: " + ", ".join(f"{k}={v}" for k, v in pe_motiv.most_common())]
     return n, det, linii
 
```

INSTRUMENTE_REPARATE
