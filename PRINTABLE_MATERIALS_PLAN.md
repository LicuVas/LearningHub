# Plan: Printable ICT Materials - Free Sheets System
**Date:** 2026-02-08 | **Author:** CTO/John | **Status:** DRAFT - Awaiting CEO Approval

---

## The Problem

Previous printable attempt produced **524 pages** across all grades. Unusable. Too much filler, too little substance. Students don't need printed Wikipedia - they need **compressed, actionable worksheets** they can write on, reorder, and build upon.

## The Vision: Free Sheet System ("Foi Volante")

**Physical format:** A4 loose-leaf sheets, hole-punched on left margin, stored in a thin ring binder or folder with fastener clips. NOT a bound notebook.

**Why this works:**
- Sheets can be **reordered** by student preference or teacher instruction
- New sheets (notes, extra exercises, test corrections) can be **inserted between** existing ones
- Damaged/lost sheets can be **reprinted individually**
- Teacher can **distribute new sheets** mid-year without breaking sequence
- Students who miss class get **only the sheets they missed**

---

## Page Budget

| Grade | Topics | Theory+Exercise Sheets | Module Covers | Reference Cards | Assessment | Total |
|-------|--------|----------------------|---------------|-----------------|------------|-------|
| cls5 | 32 | 24 (some topics grouped) | 5 | 3 | 5 | **37** |
| cls6 | 33 | 24 | 5 | 3 | 5 | **37** |
| cls7 | 30 | 22 | 5 | 4 | 5 | **36** |
| cls8 | 32 | 24 | 5 | 4 | 5 | **38** |
| **Total** | | | | | | **~148 pages** |

Average: **37 pages per grade** (within the 30-50 target).

---

## Sheet Types (5 types)

### Type 1: Module Cover Sheet (1 per module = 5 per grade)
**Purpose:** Section divider + module overview + self-tracking
**Layout:**
```
┌─────────────────────────────────────────┐
│ [hole punch margin 2cm]                 │
│                                         │
│   MODUL 3: Algoritmi pentru siruri      │
│   Clasa a VIII-a TIC                    │
│   Saptamanile S16-S21 | 6 ore           │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ CE VEI INVATA:                  │   │
│   │ □ Notiunea de sir de valori     │   │
│   │ □ Generare siruri               │   │
│   │ □ Citire si parcurgere          │   │
│   │ □ Suma, medie, minim, maxim     │   │
│   │ □ Simulari si modele            │   │
│   │ □ Aplicatii practice            │   │
│   └─────────────────────────────────┘   │
│                                         │
│   PROGRESUL MEU:                        │
│   Lectia 1: ___/10  Data: ___/___      │
│   Lectia 2: ___/10  Data: ___/___      │
│   ...                                   │
│   Nota modul: ___   Semnatura: ___     │
│                                         │
│   ID: CLS8-M3   [QR code to online]    │
└─────────────────────────────────────────┘
```
**Size:** 1 page, single-sided

### Type 2: Theory + Exercise Sheet (core content, ~24 per grade)
**Purpose:** Compressed theory + hands-on exercises with writing space
**Layout:**
```
┌─────────────────────────────────────────┐
│ CLS8-M3-L1 | Siruri de valori | pg 1/2 │
│─────────────────────────────────────────│
│                                         │
│ ■ TEORIE (left 60% column)             │
│                                         │
│ Un sir de valori (tablou/array) este    │
│ o colectie de date de acelasi tip,      │
│ stocate sub un singur nume si accesate  │
│ prin indice (pozitie).                  │
│                                         │
│   int note[5] = {7, 9, 5, 10, 8};      │
│       │         └── 5 elemente          │
│       └── tipul elementelor             │
│                                         │
│ Accesare: note[0]=7, note[4]=8          │
│ Atentie: indicii pornesc de la 0!       │
│                                         │
│ ■ VOCABULAR                             │
│ ┌────────────┬──────────────────────┐   │
│ │ Termen     │ Definitie            │   │
│ ├────────────┼──────────────────────┤   │
│ │ Array      │ Colectie indexata    │   │
│ │ Index      │ Pozitia unui element │   │
│ │ Lungime    │ Nr. de elemente      │   │
│ └────────────┴──────────────────────┘   │
│                                         │
│─────────────────────────────────────────│
│ ■ EXERCITII                             │
│                                         │
│ E1. (Minim) Completeaza valorile:       │
│ int x[4] = {3, 7, 1, 9};               │
│ x[0] = ___  x[2] = ___  x[3] = ___    │
│                                         │
│ E2. (Standard) Scrie ce afiseaza:       │
│ for(int i=0; i<3; i++)                  │
│   cout << x[i] << " ";                 │
│ Raspuns: ________________________       │
│                                         │
│ E3. (Performanta) Scrie un algoritm     │
│ care gaseste maximul dintr-un sir.      │
│ ┌───────────────────────────────────┐   │
│ │                                   │   │
│ │                                   │   │
│ │                                   │   │
│ │                                   │   │
│ │                                   │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ■ NOTITE PERSONALE                      │
│ _______________________________________│
│ _______________________________________│
│ _______________________________________│
└─────────────────────────────────────────┘
```
**Size:** 1-2 pages depending on topic density. Most topics = 1 page (front only). Complex topics (programming, HTML) = 2 pages.

**Content compression rules:**
- Theory: MAX 150 words per topic. No fluff. Definition → Example → Key rule.
- Vocabulary: 3-5 essential terms per sheet
- Exercises: 3 per sheet (1 Minim, 1 Standard, 1 Performanta). Pulled from worksheet JSONs.
- Writing space: 3-5 lines for notes at bottom
- Code examples: Syntax-highlighted boxes with monospace font

### Type 3: Reference Card (3-4 per grade)
**Purpose:** Quick-lookup cheat sheets students keep at front of binder
**Layout:** Dense, 2-column, small font (9pt). No exercises.
**Examples:**
- cls5: Keyboard Shortcuts, File Operations, Scratch Blocks Reference
- cls6: PowerPoint Shortcuts, Email Etiquette Rules, Scratch Control Blocks
- cls7: Word Formatting Toolbar, Audio/Video Formats Table, Python Syntax Card
- cls8: Excel Functions List, HTML Tags Reference, C++ Syntax Card
**Size:** 1 page each, double-column

### Type 4: Assessment Sheet (1 per module = 5 per grade)
**Purpose:** End-of-module self-test (formative, not summative)
**Layout:**
```
┌─────────────────────────────────────────┐
│ TEST RECAPITULATIV - Modul 3            │
│ Clasa a VIII-a | Algoritmi siruri       │
│─────────────────────────────────────────│
│                                         │
│ PARTEA I - Cunostinte (4p)              │
│ 1. Ce este un tablou? (2p)             │
│ ________________________________________│
│ ________________________________________│
│ 2. Care este indicele primului element? │
│ □ 0  □ 1  □ depinde  (1p)             │
│ 3. int a[3]={5,2,8}; a[1]=? ___ (1p)  │
│                                         │
│ PARTEA II - Aplicare (3p)               │
│ 4. Scrie ce afiseaza codul: (1.5p)     │
│ [code block]                            │
│ Raspuns: ________________________       │
│ 5. Gaseste eroarea: (1.5p)             │
│ [code with bug]                         │
│ Eroarea: ________________________       │
│                                         │
│ PARTEA III - Rezolvare (3p)             │
│ 6. Scrie algoritmul care calculeaza    │
│ suma elementelor unui sir. (3p)        │
│ ┌───────────────────────────────────┐   │
│ │                                   │   │
│ │                                   │   │
│ │                                   │   │
│ │                                   │   │
│ │                                   │   │
│ │                                   │   │
│ └───────────────────────────────────┘   │
│                                         │
│ Punctaj: ___/10   Nota: ___            │
│ Semnatura profesor: ___  Data: ___     │
└─────────────────────────────────────────┘
```
**Size:** 1 page, single-sided. Grading: 1 (din oficiu) + 4 + 3 + 3 = max 10 (matches digital scoring formula).

### Type 5: Blank Insert Sheet (not printed, but part of system)
**Purpose:** Student adds their own notes, extra exercises, test corrections
**Not counted in page budget** - students use their own lined paper.
**Identification:** Students write the sheet ID (e.g., "CLS8-M3-EXTRA") in the top-right corner to indicate where it belongs in the sequence.

---

## Sheet Identification System

Every printed sheet has a header with:
```
CLS8-M3-L1 | Siruri de valori: Declarare si initializare | pg 1/1
```

Format: `CLS{grade}-M{module}-L{lesson}` + topic title + page within sheet

This lets students:
- Sort sheets by ID if they get mixed up
- Tell the teacher exactly which sheet they're missing
- The teacher can reprint a single sheet by ID

Optional: QR code on module covers linking to the online lesson.

---

## Content Pipeline

### Source Data (already exists)
1. **content_map.json** → Module structure, topic names, week assignments
2. **data/worksheets/cls{5-8}.json** → 602 structured exercises (MCQ, short answer, explain, task, create, debug)
3. **content/tic/cls{5-8}/**/lectia*.html** → 189 lessons with atomic theory content
4. **planificari** → Official curriculum alignment (OMEN 3393/2017)

### Generation Script: `tools/generate_sheets.py`

**Input:** content_map.json + worksheet JSONs + lesson HTML files
**Output:** PDF files per grade (one PDF per module, for easy printing)

**Processing pipeline:**
1. Parse content_map.json → get module/topic structure
2. For each topic:
   a. Extract theory from lesson HTML (strip tags, compress to 150 words)
   b. Pull 3 exercises from worksheet JSON (1 per proficiency level)
   c. Generate vocabulary from key terms in theory
3. Generate module cover with topic checklist
4. Generate reference cards from curated content
5. Generate assessment sheets (1 per module)
6. Render to PDF via **ReportLab** (Python) or **WeasyPrint** (HTML→PDF)

**Why ReportLab/WeasyPrint over python-docx:**
Previous attempt used python-docx and had footer/header issues. PDF generation gives pixel-perfect control over layout, margins, and fonts. WeasyPrint specifically lets us use HTML/CSS templates (which we already know from the site).

### Recommended approach: HTML templates → WeasyPrint → PDF

```
templates/
  sheet_module_cover.html    → Jinja2 template
  sheet_theory_exercise.html → Jinja2 template
  sheet_reference_card.html  → Jinja2 template
  sheet_assessment.html      → Jinja2 template
  styles/
    print.css                → Print-optimized CSS (A4, margins, fonts)
```

**Advantages:**
- Reuse CSS skills from the site itself
- Syntax highlighting for code blocks (Prism.js or inline CSS)
- Easy to tweak layout without rewriting Python
- WeasyPrint handles page breaks, headers, footers natively
- Can preview in browser before generating PDF

---

## Content Per Grade

### Clasa a V-a (37 pages)

| Module | Unit | Topics | Sheets | Type |
|--------|------|--------|--------|------|
| M1 | Sisteme de calcul | 6 | 5 theory + 1 cover + 1 test | 7 |
| M2 | Sistemul de operare | 7 | 5 theory + 1 cover + 1 test | 7 |
| M3 | Internet + Editare grafica | 6 | 5 theory + 1 cover + 1 test | 7 |
| M4 | Algoritmi | 4 | 4 theory + 1 cover + 1 test | 6 |
| M5 | Scratch + Proiect | 9 | 5 theory (grouped) + 1 cover + 1 test | 7 |
| Ref | - | - | 3 reference cards | 3 |
| **Total** | | **32** | | **37** |

**Grouping for M5** (9 topics → 5 sheets): Combine "Proiect: Salvam planeta" + "Educatie muzicala" into 1 project sheet. Combine "Recapitulare" + "Evaluare" into the assessment sheet.

### Clasa a VI-a (37 pages)

| Module | Unit | Topics | Sheets | Type |
|--------|------|--------|--------|------|
| M1 | Prezentari | 6 | 5 theory + 1 cover + 1 test | 7 |
| M2 | Animatii + 3D | 7 | 5 theory + 1 cover + 1 test | 7 |
| M3 | Internet + Email | 7 | 5 theory + 1 cover + 1 test | 7 |
| M4 | Algoritmi repetitivi | 4 | 4 theory + 1 cover + 1 test | 6 |
| M5 | Programare + Proiecte | 9 | 4 theory + 1 cover + 1 test | 6 |
| Ref | - | - | 3 reference cards | 3 |
| **Total** | | **33** | | **36** |

### Clasa a VII-a (36 pages)

| Module | Unit | Topics | Sheets | Type |
|--------|------|--------|--------|------|
| M1 | Word fundamente | 7 | 5 theory + 1 cover + 1 test | 7 |
| M2 | Word avansat + Audio-video | 7 | 5 theory + 1 cover + 1 test | 7 |
| M3 | Audio-video continuare | 4 | 3 theory + 1 cover + 1 test | 5 |
| M4 | Aplicatii colaborative | 4 | 3 theory + 1 cover + 1 test | 5 |
| M5 | Python | 8 | 5 theory + 1 cover + 1 test | 7 |
| Ref | - | - | 4 reference cards | 4 |
| **Total** | | **30** | | **35** |

### Clasa a VIII-a (38 pages)

| Module | Unit | Topics | Sheets | Type |
|--------|------|--------|--------|------|
| M1 | Calcul tabelar (Excel) | 6 | 5 theory + 1 cover + 1 test | 7 |
| M2 | Pagini web (HTML/CSS) | 7 | 6 theory (2-page for HTML) + 1 cover + 1 test | 8 |
| M3 | Algoritmi siruri | 6 | 5 theory + 1 cover + 1 test | 7 |
| M4 | Robot didactic | 4 | 3 theory + 1 cover + 1 test | 5 |
| M5 | Recapitulare finala | 9 | 4 theory + 1 cover + 1 test | 6 |
| Ref | - | - | 4 reference cards | 4 |
| **Total** | | **32** | | **37** |

---

## Print Specifications

| Spec | Value | Rationale |
|------|-------|-----------|
| Paper | A4 (210x297mm) | Standard Romania |
| Sides | **Single-sided** | Easier to reorder, write on back for notes |
| Left margin | **25mm** (for hole punch) | Standard 2-hole or 4-hole punch |
| Other margins | 15mm | Enough for readability |
| Body font | 11pt, Open Sans or Noto Sans | Clean, readable, supports Romanian diacritics |
| Code font | 10pt, Fira Code or Consolas | Monospace with ligatures |
| Header | 9pt, grey, sheet ID + topic | Non-intrusive identification |
| Exercises | Numbered, with ruled lines/boxes for answers | Students write directly on sheet |

---

## Implementation Plan

### Phase 1: Infrastructure (2-3 hours)
1. Install WeasyPrint: `pip install weasyprint jinja2`
2. Create `tools/printables/` directory structure
3. Build 4 Jinja2 HTML templates (cover, theory+exercise, reference, assessment)
4. Create `print.css` with A4 layout, margins, typography
5. Build `generate_sheets.py` - the main orchestrator script

### Phase 2: Content Extraction (2-3 hours)
1. Write theory extractor: parse lesson HTML → compressed plaintext (150 words max)
2. Write exercise selector: pick best 3 from worksheet JSON per topic
3. Write vocabulary extractor: key terms from theory atoms
4. Manual curation needed for: reference cards (hand-picked content), topics without lesson content (cls7/M4, cls8/M4)

### Phase 3: Generation + QA (2-3 hours)
1. Generate all 4 grade PDFs
2. Print sample pages, check layout
3. Verify exercise answers are correct
4. Verify topic coverage matches planificari
5. Final adjustments to spacing, font sizes

### Phase 4: Production (1 hour)
1. Print cls8 M3 sheets first (inspection tomorrow)
2. Print remaining grades as needed throughout the year
3. Individual sheet reprints on demand

**Total: ~8-10 hours to full production**

---

## Exercise Selection Strategy

From the existing worksheet JSONs (602 exercises total):

**Per topic, select 3 exercises:**
1. **Minim** (easy): MCQ or fill-in-the-blank → students who struggle can still complete something
2. **Standard** (medium): Short answer or explain → demonstrates understanding
3. **Performanta** (advanced): Task, create, or debug → challenges top students

**Answer space allocation:**
- MCQ: Checkbox row (no extra space needed)
- Short answer: 2 ruled lines
- Explain: 4 ruled lines
- Code writing: 8-line box with faint grid
- Task/create: 6-line box

**Where worksheet JSON doesn't have exercises for a topic:**
Generate exercises from the lesson theory content (MCQ from atom quiz data, short answer from key concepts).

---

## Comparison: Old vs New Approach

| Aspect | Previous (524 pages) | New (148 pages) |
|--------|---------------------|-----------------|
| Pages per grade | ~130 | ~37 |
| Theory density | Full paragraphs, verbose | 150 words max, compressed |
| Exercises | Separate from theory | Integrated on same sheet |
| Format | Bound document (python-docx) | Loose-leaf PDF (WeasyPrint) |
| Reorderability | None (fixed binding) | Full (ring binder) |
| Reprintability | Reprint entire doc | Reprint single sheet |
| Student writing | Separate notebook needed | Write directly on sheet |
| Code rendering | Plain text, bad formatting | Syntax-highlighted, monospace |
| Diacritics | Inconsistent | Noto Sans, full support |

---

## Open Questions for CEO

1. **Single-sided vs double-sided?** Plan assumes single-sided (students use back for notes). Double-sided halves paper cost but reduces flexibility.

2. **Color or B&W?** Reference cards and code highlighting benefit from color. Theory sheets work fine in B&W. Recommendation: **reference cards in color, rest in B&W**.

3. **Print all at start of year or module-by-module?** Recommendation: **module-by-module** (5 prints per year, ~7 pages each). Students don't lose sheets they won't need for months.

4. **Include answer key as separate teacher sheet?** Useful for self-grading. Would add ~5 pages per grade (1 per module).

5. **QR codes on module covers?** Links to online lessons for students who want to practice digitally. Requires internet access.

---

## Files to Create

```
tools/printables/
  generate_sheets.py          # Main orchestrator
  extract_theory.py           # HTML → compressed text
  select_exercises.py         # Pick best 3 from worksheet JSON
  templates/
    module_cover.html         # Jinja2 template
    theory_exercise.html      # Jinja2 template
    reference_card.html       # Jinja2 template
    assessment.html           # Jinja2 template
  styles/
    print.css                 # A4 print stylesheet
  output/
    cls5_M1.pdf through cls5_M5.pdf
    cls6_M1.pdf through cls6_M5.pdf
    cls7_M1.pdf through cls7_M5.pdf
    cls8_M1.pdf through cls8_M5.pdf
    cls5_reference_cards.pdf
    ...
```

---

## Priority Order

1. **cls8 M3** (inspection tomorrow - arrays/algorithms for cls VIII-C)
2. **cls8 M1-M2** (already taught, students can backfill)
3. **cls5-cls7 M1-M3** (already taught modules)
4. **All M4** (starts Feb 23)
5. **All M5** (starts April 15)
