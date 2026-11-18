# Probele modurilor — scenariile Office rulate în aplicațiile REALE (Etapa 0, R5)

Ce e aici: dovada că fiecare fel de a rula un scenariu („mod” și „canal”) chiar ajunge la Word / Excel / PowerPoint
și dă un rezultat CUNOSCUT dinainte, plus o probă de control care TREBUIE să dea alt rezultat (dacă și ea ar „trece”,
proba n-ar dovedi nimic). Probele rulează automat la începutul FIECĂREI rulări a lui `ruleaza_real.py`, în aceeași
instanță în care rulează apoi scenariile; rezultatul lor e scris de script în blocurile JSON de la final
(între marcajele `PROBE:<aplicație>`). Un scenariu primește `mod_probat: true` doar dacă TOATE canalele folosite de el
au trecut proba în aceeași rulare și scenariul n-a dat eroare.

Unde: instanță NOUĂ a aplicației (`WINWORD /x /q /w`, `EXCEL /x`, `POWERPNT /B`), pornită pe un desktop Windows
ASCUNS (`LHScenarii`, prin `C:/00/AI_0/tools/hidden_desktop.py`): nimic nu apare pe ecranul profesorului. Legătura COM
se ia din fereastra instanței mele (nu din Excel-ul deschis de om). La final: documentul marcat „salvat”, ieșire prin
COM, dosarul temporar cu fișierele salvate de scenarii șters. Office 16.0.20326 (ProPlus 2021, Current Channel,
interfață engleză), Windows 11 Pro în română.

## Cele două moduri și canalele lor

| Mod | Canal | Cum ajunge gestul la aplicație | Proba pozitivă (rezultat cunoscut) | Proba de control (trebuie să dea ALTCEVA) |
|---|---|---|---|---|
| `model_obiect` | `model_obiect` | pașii se fac prin modelul de obiecte (COM), ex. `Range.Font.Bold = True`, `Range.AutoFill`, `Tables.Add` | Word: „Ana” devine bold; Excel: A1 bold; PowerPoint: 2 diapozitive după `AddSlide` | restul textului / A2 rămân neîngroșate; așteptarea „3 diapozitive” pică |
| `gest_real` | `tastare` | un mesaj `WM_CHAR` pe literă, pus în coada ferestrei documentului (aceeași cale pe care o iau literele după `TranslateMessage`) | Word: tastez „xy” → textul „xy”; Excel: „12” + Enter → A1 = 12, activă A2 | așteptarea „xz” / „13” pică |
| `gest_real` | `taste` | `WM_KEYDOWN`/`WM_KEYUP` cu codul tastei; Ctrl/Shift ținute „apăsate” în starea tastaturii FIRULUI aplicației (`AttachThreadInput` + `SetKeyboardState`; starea globală a tastaturii omului nu se atinge) | Word: „Ana” selectat + Ctrl+B → „Ana” bold, textul neschimbat; Excel: Ctrl+B → A1 bold; PowerPoint: Ctrl+M → diapozitiv nou | ACEEAȘI tastă B / M FĂRĂ Ctrl: Word scrie „b” peste selecție și nu îngroașă; Excel scrie „b” în celulă; PowerPoint nu adaugă diapozitiv |
| `gest_real` | `mouse` | `WM_LBUTTONDOWN`/`UP`/`DBLCLK` postate la punctul calculat al cuvântului (Word: `Window.GetPoint`) sau al celulei (Excel: `PointsToScreenPixels`) | Word: dublu clic pe „mere” → selecția „mere ” (8–13); Excel: clic pe C3 → C3 activă | clic SIMPLU pe același punct → nicio selecție (doar cursorul); Shift+clic → zona A1:C3, nu C3 |
| `gest_real` | `panglica` | UI Automation pe butonul din panglică (`Toggle` la butoanele care rămân apăsate, `Invoke` la celelalte, `ExpandCollapse` + elementul ales la listele derulante, elementul galeriei din panglică) | Word/Excel: „Bold” → bold; PowerPoint: „New Slide” → 2 diapozitive | Word/Excel: „Italic” pe aceeași selecție → italic, NU bold; așteptarea „3 diapozitive” pică |

Plasa de siguranță pe panglică: după fiecare comandă din panglică scriptul compară „amprenta” stării înainte/după; dacă
nu s-a schimbat nimic, încearcă metoda următoare (Toggle → Invoke → acțiunea implicită MSAA), iar dacă niciuna nu
schimbă starea, scenariul ia EROARE (nu un rezultat „real” inventat). Așa s-a văzut că `Invoke` pe Bold NU face nimic
în Word (Bold răspunde doar la `Toggle`), iar `Invoke` pe Grow Font merge (11 → 12 pt) — experimentul din 16.11.2026,
22:5x, pe desktopul ascuns.

## Ce dovedește și ce NU dovedește fiecare mod
- `gest_real` dovedește că aplicația REALĂ răspunde la tastă / clic / butonul din panglică cu starea citită: tastele trec
  prin bucla de mesaje a aplicației (scurtături, corectare automată, grupări de anulare), clicurile prin logica ei de
  selecție (dublu clic = cuvântul + spațiul de după; triplu clic = paragraful cu ¶).
- NU e intrare hardware (`SendInput` nu ajunge pe un desktop ascuns): ce depinde de butonul FIZIC al mouse-ului
  (`GetAsyncKeyState`) nu merge. Proba directă (16.11.2026, 22:5x): tragerea cu mouse-ul peste text în Word NU a selectat
  nimic. De aceea tragerile (selectare, pătrățelul de umplere, mutarea unei forme) sunt trimise la profesor
  (`../de_verificat.md`), cu starea finală — unde se poate — probată separat în `model_obiect`.
- Pregătirea fiecărui scenariu (textul de pornire, formatarea, selecția de pornire, cursorul) și CITIREA stării se fac
  prin COM. Pasul `selecteaza` dintr-un scenariu `gest_real` e pregătire, nu gestul măsurat.
- `model_obiect` dovedește doar STAREA FINALĂ a comenzii, nu cum răspunde aplicația la gest. Folosit când:
  (a) gestul ar atinge clipboard-ul omului (Ctrl+C / Ctrl+X / Ctrl+V: modelul ține zona copiată și o pune cu
  `Range.FormattedText` în Word, `Range.Copy/Cut(Destination)` în Excel — spațierea „inteligentă” a lui Word la
  lipire NU e acoperită); (b) gestul e o tragere (pătrățelul de umplere → `Range.AutoFill(xlFillDefault)`);
  (c) fereastra e a sistemului (alegerea pozei: `AddPicture`; Save As în Excel/PowerPoint: `SaveAs`);
  (d) grila „Insert Table” din panglică (`Tables.Add` / `Shapes.AddTable`).
- Salvarea în Word (`word-salvare-ca-f12`) e gest: F12, numele tastat în caseta „File name” a ferestrei Windows,
  clic (UIA) pe Save. Singura abatere: în fața numelui tastat se pune un dosar TEMPORAR, ca fișierul să nu ajungă în
  Documentele omului; numele final al fișierului (cu extensia pusă de Word) e cel citit.
- Setările acestui PC contează și sunt reale: corectarea automată din Word (majuscula de la începutul propoziției),
  separatorul de zecimale și de argumente din Excel (setări regionale ale Windows). Pe PC-urile din laborator pot fi
  altfel → rândurile din `../de_verificat.md`.

## Profilul word2007 (laboratorul VII)
Scenariile `word2007-*` (Ctrl+Z literă cu literă) NU se rulează: Word 2007 nu e pe acest PC. Starea lor așteptată vine
din faptul spus de profesor (13.11.2026) și din `lectii/vii/m1-l02/index.html` (rândurile 215, 240-242, 290); stă în
scenariu (`stare_asteptata`, `sursa_starii`), iar rezultatul „real” al lor are `mod_probat: false`. Word 365 de pe acest
PC se poartă ALTFEL (scenariile `word-ctrl-z-*`, profilul word365) — vezi rezultatele lor.

## Cum se reia
```
python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/ruleaza_real.py          # toate trei, pe desktopul ascuns
python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/ruleaza_real.py toate --id word-ctrl-b excel-ctrl-d
python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/ruleaza_real.py verifica # ultima linie = nr. de probleme
```
`verifica` numără: format greșit, `sursa_gest` inexistentă, scenariu fără rezultat real și fără rând în
`de_verificat.md`, `mod_probat: true` fără proba canalului trecută, rezultat cu eroare, nume personale în ieșiri, probe
care n-au trecut. Detaliile le tipărește pe rândurile dinaintea numărului (fără JSON separat: fișierele pe care am voie
să le scriu sunt doar scenariile, rezultatele, `ruleaza_real.py`, acest fișier și secțiunea Office din `de_verificat.md`).

## Ce a arătat rularea reală (17.11.2026, 00:4x–01:05) — fapte care contează pentru simulatoare
Citite din `scenarii_real/<id>.json`; fiecare are `mod_probat: true`. Comparația cu simulatoarele o face O4, nu acest fișier.
- Word 365 grupează tastarea la anulare: „Planul de luni”, Enter, „Mergem la film.”, Ctrl+Z ×3 → document gol
  (`word-ctrl-z-dupa-tastare`); „abc” + Ctrl+Z → gol (`word-ctrl-z-abc`); „Titlu”, Enter, „Text”, Ctrl+Z ×2 → „Titlu”
  (`word-ctrl-z-dupa-enter`). Lecția VII·2 (profilul word2007) spune „literă cu literă” — e Word 2007 din laborator, nu
  acesta. Corectura automată e și ea un pas de anulare separat (experimentul din 16.11, 22:5x: „abc def.” → „Abc def.”).
- Ctrl+Y fără anulare repetă tastarea: „ha” + Ctrl+Y → „haha” (`word-ctrl-y-repeta`).
- Ctrl+E de două ori → paragraful revine la stânga; Ctrl+L pe un paragraf deja la stânga → stânga-dreapta (justify);
  Ctrl+L pe unul centrat → stânga (`word-ctrl-e-de-doua-ori`, `word-ctrl-l-pe-paragraf-*`) — exact ce spune lecția VII·6:201.
- Dublu clic pe „mere” selectează „mere ” (cu spațiul de după); triplu clic = tot paragraful, cu ¶; Ctrl+B cu cursorul în
  mijlocul cuvântului îngroașă tot cuvântul; Shift+→ ×3 de la început = „Ana”.
- Corectura automată: „ana are mere. el are pere.” → „Ana are mere. El are pere.”.
- F12: fereastra „Save As” propune ca nume primul rând al documentului („Tema mea de azi.docx”) și tipul
  „Word Document (*.docx)”; după „Tema mea” + Save, fișierul e „Tema mea.docx”.
- Grow Font / Shrink Font: 11 → 12 / 10 pt; Layout › Margins › „Narrow Margins” = 1,27 cm pe toate laturile (eticheta din
  listă e „Narrow Margins”, nu „Narrow”); Landscape = 29,7 × 21 cm; Tab în ultima celulă adaugă un rând; marcatorul listei
  e U+F0B7 din fontul Symbol.
- Excel: Tab apoi Enter întoarce în coloana de început (A3 după „Ana”, Tab, „150”, Enter); „7,5” = număr 7,5, „7.5” = DATA
  7 mai („07.mai”) pe setările românești ale acestui PC; =SUM(A1;A2) merge, =SUM(A1,A2) NU e primită (Excel rămâne în
  editare); „0741234567” → 741234567, cu apostrof rămâne text; F4 o dată → $A$1, de două ori → A$1; Backspace + Esc
  repune valoarea; Delete golește dar păstrează îngroșarea; umplerea unui singur număr îl copiază (1,1,1,1), „Elev 1” →
  „Elev 2”, „Elev 3”; mutarea (Cut) face formula care o folosea să urmărească celula (=B1*2 → =B3*2); Ctrl+Z după o
  celulă scrisă o golește; Sort A to Z păstrează capul de tabel.
- PowerPoint: New Slide după „Title Slide” → „Title and Content”; Increase Font Size pe titlu: 60 → 66 pt; „Title Only”
  scoate caseta de conținut (2 → 1 forme); Ctrl+Z după New Slide → un singur diapozitiv; Fade = cod de tranziție 3849,
  Fly In = cod de efect 2 (codurile sunt ale modelului de obiecte; numele din galerie e citit din panglică).

## Rezultatele probelor (scrise de `ruleaza_real.py` la fiecare rulare — nu se editează de mână)

<!-- PROBE:word:START -->
```json
{
 "aplicatie": "word",
 "generat": "2026-11-17 00:52",
 "probe": {
  "model_obiect": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "dupa_Range.Font.Bold": [
     {
      "text": "Ana",
      "bold": true,
      "italic": false,
      "underline": false,
      "marime": 11.0
     },
     {
      "text": " are mere",
      "bold": false,
      "italic": false,
      "underline": false,
      "marime": 11.0
     }
    ]
   }
  },
  "tastare": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "tastat": "xy",
    "citit": [
     "xy"
    ],
    "control": "așteptarea „xz” pică"
   }
  },
  "taste": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "Ctrl+B": {
     "text": [
      "Ana are mere"
     ],
     "formatare_pe_caractere": [
      {
       "text": "Ana",
       "bold": true,
       "italic": false,
       "underline": false,
       "marime": 11.0
      },
      {
       "text": " are mere",
       "bold": false,
       "italic": false,
       "underline": false,
       "marime": 11.0
      }
     ]
    },
    "B fara Ctrl (control)": {
     "text": [
      "b are mere"
     ],
     "formatare_pe_caractere": [
      {
       "text": "b are mere",
       "bold": false,
       "italic": false,
       "underline": false,
       "marime": 11.0
      }
     ]
    }
   }
  },
  "mouse": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "dublu_clic_pe_mere": {
     "de_la": 8,
     "pana_la": 13,
     "text": "mere "
    },
    "clic_simplu (control: nu selectează)": {
     "de_la": 9,
     "pana_la": 9,
     "text": ""
    }
   }
  },
  "panglica": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "Bold": [
     {
      "text": "Ana",
      "bold": true,
      "italic": false,
      "underline": false,
      "marime": 11.0
     },
     {
      "text": " are mere",
      "bold": false,
      "italic": false,
      "underline": false,
      "marime": 11.0
     }
    ],
    "cum": "UIA Toggle pe Bold",
    "Italic (control: nu face bold)": [
     {
      "text": "Ana",
      "bold": false,
      "italic": true,
      "underline": false,
      "marime": 11.0
     },
     {
      "text": " are mere",
      "bold": false,
      "italic": false,
      "underline": false,
      "marime": 11.0
     }
    ]
   }
  }
 },
 "scenarii": 47,
 "rulate": 47,
 "erori_sesiune": [],
 "mod_probat": 47
}
```
<!-- PROBE:word:END -->

<!-- PROBE:excel:START -->
```json
{
 "aplicatie": "excel",
 "generat": "2026-11-17 00:59",
 "probe": {
  "model_obiect": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "format": {
     "A1": {
      "bold": true
     }
    }
   }
  },
  "tastare": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "citit": {
     "celule": {
      "A1": {
       "valoare": 12,
       "text": "12"
      }
     },
     "selectie": {
      "activa": "A2",
      "zona": "A2"
     }
    },
    "control": "așteptarea 13 pică"
   }
  },
  "taste": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "Ctrl+B": {
     "celule": {
      "A1": {
       "valoare": "Ana",
       "text": "Ana"
      }
     },
     "format_celule": {
      "A1": {
       "bold": true
      }
     }
    },
    "B fara Ctrl (control)": {
     "celule": {
      "A1": {
       "valoare": "b",
       "text": "b"
      }
     },
     "format_celule": {}
    }
   }
  },
  "mouse": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "clic_C3": {
     "activa": "C3",
     "zona": "C3"
    },
    "Shift+clic_C3 (control: alt rezultat)": {
     "activa": "A1",
     "zona": "A1:C3"
    }
   }
  },
  "panglica": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "Bold": {
     "A1": {
      "bold": true
     }
    },
    "cum": "UIA Toggle pe Bold",
    "Italic (control)": {
     "A1": {
      "italic": true
     }
    }
   }
  }
 },
 "scenarii": 39,
 "rulate": 39,
 "erori_sesiune": [
  "NU s-a închis în 90 s: oprit forțat (doar PID-ul nostru)"
 ],
 "mod_probat": 39
}
```
<!-- PROBE:excel:END -->

<!-- PROBE:powerpoint:START -->
```json
{
 "aplicatie": "powerpoint",
 "generat": "2026-11-17 01:05",
 "probe": {
  "model_obiect": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "diapozitive": [
     {
      "aspect": "Title Slide",
      "texte": [
       "Titlu"
      ],
      "forme": 2
     },
     {
      "aspect": "Title and Content",
      "texte": [],
      "forme": 2
     }
    ]
   }
  },
  "panglica": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "dupa_New_Slide": [
     {
      "aspect": "Title Slide",
      "texte": [],
      "forme": 2
     },
     {
      "aspect": "Title and Content",
      "texte": [],
      "forme": 2
     }
    ],
    "cum": "UIA Invoke pe SlideNewGallery",
    "control": "așteptarea 3 diapozitive pică"
   }
  },
  "taste": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "Ctrl+M": [
     {
      "aspect": "Title Slide",
      "texte": [],
      "forme": 2
     },
     {
      "aspect": "Title and Content",
      "texte": [],
      "forme": 2
     }
    ],
    "M fara Ctrl (control)": [
     {
      "aspect": "Title Slide",
      "texte": [],
      "forme": 2
     }
    ]
   }
  },
  "tastare": {
   "pozitiv": true,
   "control": true,
   "trecut": true,
   "detalii": {
    "tastat în titlul gol": "xy",
    "citit": [
     "xy"
    ],
    "control": "așteptarea „xz” pică"
   }
  }
 },
 "scenarii": 16,
 "rulate": 16,
 "erori_sesiune": [],
 "mod_probat": 16
}
```
<!-- PROBE:powerpoint:END -->
