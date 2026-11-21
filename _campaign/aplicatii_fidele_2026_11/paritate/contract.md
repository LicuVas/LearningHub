# Contract — inventarul de paritate (21.11.2026 18:40)

**Cererea, verbatim:** „da, fă lista funcțiilor din lecțiile de pe proba” (21.11.2026 18:32), după verdictul de la 09:08: biblioteca nouă „seamănă mult mai mult cu aplicațiile reale, dar când încerc să le folosesc par să aibă pe alocuri mai puține funcționalități decât ce avem acum pe proba”.

**Proba realității:** profesorul deschide o pagină și vede, pe fiecare aplicație, ce poate face elevul în simulatoarele vechi ale lecțiilor și ce nu poate face (încă) în biblioteca nouă. Cu lista asta hotărăște ce completăm și în ce ordine. Lista devine oracolul de paritate al rundelor următoare.

**Sursa:** ce e publicat pe proba (`origin/proba`, commitul din `proba_src/COMMIT.txt`), extras în `paritate/proba_src/` (57 de pagini cu simulatoare + codul simulatoarelor + motorul jocurilor). Biblioteca nouă: `aplicatii/` din ramura `fidelitate-aplicatii`, neschimbată în lucrarea asta.

| R | Ce | Cine verifică | Gata înseamnă |
|---|---|---|---|
| R1 | Toate fișierele de simulator ale celor 6 aplicații (Windows, Explorer, Word, Excel, PowerPoint, Paint) citite | scriptul de unire (`fisiere_citite` față de listă) | N din N |
| R2 | Fiecare funcție are dovada veche `cale:linie`, iar linia există | scriptul de unire | 100 % |
| R3 | Fiecare funcție are verdictul bibliotecii (DA / PARȚIAL / NU) cu dovadă | scriptul de unire | 100 % |
| R4 | Verificare independentă: alt agent rejoacă un eșantion (~15 %, minim 8 pe aplicație, toate felurile de verdict), în poligon, headless | agentul verificator | acord ≥ 90 %; dezacordurile se corectează |
| R5 | O pagină pentru el: pe aplicație, întâi lipsurile cerute de exerciții | eu, deschisă în browser headless | se încarcă, numerele = JSON-ul |
| R6 | Nimic schimbat în `aplicatii/`, în lecții sau pe proba; nimic împins | `git status` | 0 fișiere atinse în afara `paritate/` |

**Timp estimat:** 1,5-2 ore (agenții ~1 oră, verificarea și pagina ~30-45 min).
