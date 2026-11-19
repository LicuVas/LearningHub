# Runda 6 · CONTRA (pasul 4)

**PENTRU** construirea lui Excel acum, în bibliotecă, din referință: fără el, etapa C (mutarea celor 18 pagini Excel)
nu poate începe, iar O4/O5/O9 rămân blocate pe „nu e în bibliotecă”. Motorul de panglică și scheletul există și sunt
probate pe Word (rundele 2-5); Excel aduce doar datele și comportamentul lui. Scenariile reale (39) dau un oracol
mecanic pentru fiecare gest.

**ÎMPOTRIVĂ**: e o aplicație întreagă scrisă într-o rundă — mult cod nou, deci multe locuri în care poate greși fără să
se vadă în numere: O3 nu măsoară poligonul (doar lecțiile), deci aspectul Excel din bibliotecă nu are oracol mecanic în
runda asta; un aspect greșit ar trece neobservat până la mutare. Iar un model „ecran = stare” făcut pentru oracol poate
ascunde o abatere de comportament (celula în editare).

**Adevărul incomod**: scenariile Excel testează mai ales starea, nu aspectul; cele două scenarii care ar spune ce face
Excel la o formulă greșită (`excel-separator-virgula`, `excel-autocompletare-tab`) n-au rezultat real probat. Și setările
regionale: tot ce știm despre RO („;”, „,”, data „07.mai”) vine din câte un singur scenariu.

**Hotărârea**: construiesc, dar aspectul îl țin legat MECANIC de referință — panglica, Backstage, meniurile și ferestrele
le desenează motorul comun din `date/excel.json`; zona foii (Name Box, fx, antete, Sheet1, bara de stare) se așază la
coordonatele din `uia_excel.json › zona_document`, cu numele de acolo. Proba mea (`proba_excel.py`) compară și aspectul:
pozițiile elementelor zonei față de referință (toleranța de 8 px a O3). Ce nu are referință probată intră în
`de_verificat.md`, nu în cod ca „adevărat”.
