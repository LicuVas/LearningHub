#!/usr/bin/env python3
"""
LearningHub Lesson Rebuild Tool
================================
Dual-generation lesson workflow automation.

Workflow:
  1. Read current lesson (V1) and curriculum requirements
  2. Generate teacher agent prompt for independent V2 creation
  3. Agent creates complete HTML lesson following gold-standard template
  4. Compare V1 vs V2 on 8 dimensions
  5. Deploy winner (or merge best elements)

Usage:
  python tools/lesson_rebuild.py inventory cls8 [module]
  python tools/lesson_rebuild.py prompt cls8 m1 lectia1
  python tools/lesson_rebuild.py batch cls8 m1
  python tools/lesson_rebuild.py status
  python tools/lesson_rebuild.py compare <v1_path> <v2_path>

Designed to be used FROM Claude Code sessions - generates prompts
that feed into Task tool spawns.
"""

import argparse
import json
import os
import sys
from pathlib import Path
from datetime import datetime

# Paths
LEARNINGHUB_ROOT = Path(r"C:\AI\Projects\LearningHub")
CONTENT_ROOT = LEARNINGHUB_ROOT / "content" / "tic"
TOOLS_ROOT = LEARNINGHUB_ROOT / "tools"
REBUILD_DIR = TOOLS_ROOT / "lesson_rebuild"
PROGRESS_FILE = REBUILD_DIR / "progress.json"
PROMPTS_DIR = REBUILD_DIR / "prompts"
V2_OUTPUT_DIR = REBUILD_DIR / "v2_output"

# Ensure directories exist
for d in [REBUILD_DIR, PROMPTS_DIR, V2_OUTPUT_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# ============================================================
# LESSON INVENTORY - What each module teaches
# ============================================================

INVENTORY = {
    "cls8": {
        "grade": 8,
        "grade_name": "Clasa a VIII-a",
        "color_scheme": {
            "accent_primary": "#ef4444",      # red
            "accent_secondary": "#f43f5e",    # rose
            "gradient": "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(244, 63, 94, 0.1))",
            "hover_color": "var(--accent-red)",
            "active_bg": "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(244, 63, 94, 0.15))",
        },
        "modules": {
            "m1-excel-fundamente": {
                "name": "Calcul Tabelar - Fundamente",
                "domain": "D1: Calcul Tabelar",
                "competencies": ["1.1", "2.1", "3.1"],
                "weeks": "S1-S7 (sept-oct)",
                "tool": "Excel / Google Sheets",
                "lessons": {
                    "lectia1-interfata": {
                        "title": "Interfata Excel - Celule si Navigare",
                        "topic": "Excel interface: ribbon, cells, rows, columns, sheets, cell addressing (A1, B3), selecting ranges, basic navigation shortcuts",
                        "competency": "1.1 - Utilizarea foilor de calcul tabelar",
                        "key_concepts": ["Interfata Excel (ribbon, bare)", "Celula, rand, coloana", "Adresa celulei (A1)", "Selectare intervale", "Foaia de calcul vs registrul"],
                        "pain_scenario": {
                            "bad": "Keeping student grades in a paper notebook - can't search, sort, or calculate averages",
                            "good": "Excel spreadsheet - instant search, auto-calculate, sort by any column"
                        },
                        "try_challenge": "Open Excel, create a class roster with Name, Grade1, Grade2, Grade3 columns for 5 students. Navigate using keyboard shortcuts.",
                        "practice_context": "Real-world: school catalog management"
                    },
                    "lectia2-date": {
                        "title": "Introducerea si Formatarea Datelor",
                        "topic": "Data types in cells (text, numbers, dates), entering data, cell formatting (font, size, color, borders, background), number formats, merging cells, text alignment",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["Tipuri de date (text, numar, data)", "Formatare celula (font, dimensiune, culoare)", "Chenar si fundal", "Imbinare celule (Merge)", "Aliniere text", "Format numar (%, decimale)"],
                        "pain_scenario": {
                            "bad": "A plain text file with no formatting - hard to distinguish headers from data",
                            "good": "Well-formatted Excel: bold headers, colored borders, proper number formats"
                        },
                        "try_challenge": "Take the class roster from Lesson 1 and format it: bold headers with blue background, borders around all cells, grades centered, names left-aligned.",
                        "practice_context": "Real-world: professional reports and invoices"
                    },
                    "lectia3-formule": {
                        "title": "Formule de Baza in Excel",
                        "topic": "Formula bar, = sign to start formulas, basic arithmetic (+, -, *, /), cell references in formulas, auto-fill (drag handle), relative references, SUM function introduction",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["Bara de formule", "Formula incepe cu =", "Operatori (+, -, *, /)", "Referinte celule (=A1+B1)", "Auto-completare (drag)", "Functia SUM", "Referinte relative"],
                        "pain_scenario": {
                            "bad": "Calculating 30 students' averages manually with a calculator - takes 20 minutes",
                            "good": "One formula =AVERAGE(B2:D2), drag down - done in 5 seconds for all 30"
                        },
                        "try_challenge": "Add a Total column that sums Grade1+Grade2+Grade3 using formulas. Then add an Average column. Use auto-fill to apply to all rows.",
                        "practice_context": "Real-world: budget calculations, grade computation"
                    },
                    "lectia4-functii": {
                        "title": "Functii Excel: MIN, MAX, AVERAGE, COUNT",
                        "topic": "Built-in functions syntax: =FUNCTION(range), MIN, MAX, AVERAGE, COUNT, COUNTA, function wizard, nesting simple functions",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["Sintaxa functie: =FUNCTIE(interval)", "MIN - valoarea minima", "MAX - valoarea maxima", "AVERAGE - media aritmetica", "COUNT - numara valori numerice", "COUNTA - numara celule nevide", "Asistent functii (fx)"],
                        "pain_scenario": {
                            "bad": "Scrolling through 100 rows to find the highest grade with your eyes",
                            "good": "=MAX(B2:B101) - instant answer, always accurate"
                        },
                        "try_challenge": "Add summary rows: Min grade, Max grade, Average, Count of students using functions. Try the function wizard (fx button).",
                        "practice_context": "Real-world: data analysis, statistics"
                    },
                    "lectia5-grafice": {
                        "title": "Grafice si Vizualizarea Datelor",
                        "topic": "Chart types (column, bar, line, pie), selecting data for charts, chart elements (title, legend, axes, data labels), basic chart formatting, choosing the right chart type",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["Tipuri grafice (coloana, bara, linie, cerc)", "Selectare date pentru grafic", "Elemente grafic (titlu, legenda, axe)", "Etichete date", "Formatare grafic", "Alegerea tipului potrivit"],
                        "pain_scenario": {
                            "bad": "Presenting raw numbers in a table to the school board - boring, hard to understand trends",
                            "good": "A colorful chart showing grade trends - instantly clear, professional, impactful"
                        },
                        "try_challenge": "Create 3 different charts from the class roster data: a column chart of averages, a pie chart of grade distribution, and a line chart of trends.",
                        "practice_context": "Real-world: presentations, data storytelling"
                    },
                    "lectia6-proiect": {
                        "title": "Proiect: Catalog Scolar Complet",
                        "topic": "Integration project combining all M1 skills: design a complete school catalog with formatted data, formulas, functions, charts, and print layout",
                        "competency": "1.1, 3.1 (all)",
                        "key_concepts": ["Integrare competente M1", "Proiectare catalog", "Formatare profesionala", "Formule si functii combinate", "Grafice relevante", "Pregatire pentru printare"],
                        "pain_scenario": {
                            "bad": "A messy, unformatted spreadsheet that looks unprofessional",
                            "good": "A complete, professional catalog with formatting, formulas, charts - ready to present"
                        },
                        "try_challenge": "Build a complete school catalog from scratch: 10 students, 4 subjects, averages, min/max, charts, and print-ready formatting.",
                        "practice_context": "Real-world: delivering professional work products"
                    }
                }
            },
            "m2-formule-functii": {
                "name": "Calcul Tabelar - Formule, Functii si Grafice",
                "domain": "D1: Calcul Tabelar (Advanced)",
                "competencies": ["1.1", "2.1", "3.1"],
                "weeks": "S8-S14 (nov-dec)",
                "tool": "Excel / Google Sheets",
                "lessons": {
                    "lectia1-introducere-formule": {
                        "title": "Aprofundare Formule - Operatori si Prioritati",
                        "topic": "Formula deep dive: operator precedence (PEMDAS), parentheses for grouping, complex multi-operator formulas, error types (#VALUE!, #DIV/0!, #REF!), formula auditing",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["Prioritatea operatorilor (PEMDAS)", "Paranteze pentru grupare", "Formule complexe multi-operator", "Erori formule (#VALUE!, #DIV/0!, #REF!)", "Auditare formule (Trace Precedents)"],
                        "pain_scenario": {
                            "bad": "Writing =A1+B1*C1 and getting wrong result because * runs before +",
                            "good": "Using =(A1+B1)*C1 with parentheses to control calculation order"
                        },
                        "try_challenge": "Build a price calculator: quantity * unit_price - discount% + VAT%. Get the parentheses right!",
                        "practice_context": "Real-world: financial calculations, invoicing"
                    },
                    "lectia2-referinte-celule": {
                        "title": "Referinte Relative si Absolute ($)",
                        "topic": "Relative references (default), absolute references ($A$1), mixed references ($A1, A$1), when to use each, the F4 shortcut, practical examples with tax rates and conversion tables",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["Referinta relativa (A1)", "Referinta absoluta ($A$1)", "Referinta mixta ($A1, A$1)", "Tasta F4 pentru comutare", "Cand folosim fiecare tip", "Exemplu: rata TVA fixa"],
                        "pain_scenario": {
                            "bad": "Dragging a formula and the tax rate cell shifts - all calculations wrong",
                            "good": "Using $B$1 for tax rate - formula drags perfectly, rate stays fixed"
                        },
                        "try_challenge": "Create a currency converter: amounts in column A, exchange rate in B1 (fixed with $). Convert RON to EUR, USD, GBP.",
                        "practice_context": "Real-world: exchange rates, tax calculations"
                    },
                    "lectia3-functii-baza": {
                        "title": "Functii: SUM, COUNT, IF",
                        "topic": "SUM with ranges and multiple ranges, COUNT vs COUNTA vs COUNTBLANK, IF function (logical_test, value_if_true, value_if_false), nested IF introduction, practical decision-making formulas",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["SUM cu intervale multiple", "COUNT vs COUNTA vs COUNTBLANK", "Functia IF (test_logic, da, nu)", "IF simplu: promovat/nepromovat", "IF imbricat (nested IF) intro", "Functii de decizie"],
                        "pain_scenario": {
                            "bad": "Manually checking each grade to write 'Promovat' or 'Nepromovat'",
                            "good": "=IF(E2>=5, 'Promovat', 'Nepromovat') - automatic for all 30 students"
                        },
                        "try_challenge": "Add a Status column: IF average>=9 then 'Excelent', IF>=7 then 'Bine', IF>=5 then 'Suficient', else 'Insuficient'.",
                        "practice_context": "Real-world: automated grading, pass/fail systems"
                    },
                    "lectia4-functii-text": {
                        "title": "Functii Text: CONCATENATE, UPPER, LOWER, LEN",
                        "topic": "Text functions: CONCATENATE (or &), UPPER, LOWER, PROPER, LEN, LEFT, RIGHT, MID, TRIM, text formatting in cells",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["CONCATENATE si operatorul &", "UPPER / LOWER / PROPER", "LEN - lungime text", "LEFT / RIGHT / MID - extragere", "TRIM - sterge spatii extra", "Combinare text cu date"],
                        "pain_scenario": {
                            "bad": "Retyping 100 names in UPPERCASE one by one",
                            "good": "=UPPER(A2) and drag - all 100 converted in 2 seconds"
                        },
                        "try_challenge": "Create a student ID generator: combine first 3 letters of last name + first 2 of first name + grade number, all uppercase.",
                        "practice_context": "Real-world: data cleanup, username generation"
                    },
                    "lectia5-functii-logice": {
                        "title": "Functii Logice: AND, OR, NOT",
                        "topic": "Logical functions AND, OR, NOT, combining with IF for complex conditions, COUNTIF, SUMIF, practical multi-criteria filtering",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["AND - toate conditiile adevarate", "OR - cel putin o conditie", "NOT - neaga conditia", "IF + AND/OR combinat", "COUNTIF - numarare conditionala", "SUMIF - insumare conditionala"],
                        "pain_scenario": {
                            "bad": "Manually counting students who have BOTH attendance>90% AND average>7",
                            "good": "=COUNTIFS(F2:F31,'>90%',E2:E31,'>7') - instant answer"
                        },
                        "try_challenge": "Build a scholarship eligibility checker: average>=8.5 AND no grade below 7 AND attendance>=95%.",
                        "practice_context": "Real-world: eligibility checking, multi-criteria decisions"
                    },
                    "lectia6-evaluare": {
                        "title": "Evaluare Modul 2 - Test Practic",
                        "topic": "Module assessment: practical test combining formulas, references, functions (SUM, IF, COUNT, text functions, logical functions), and data analysis",
                        "competency": "1.1, 3.1 (all M2)",
                        "key_concepts": ["Recapitulare formule", "Referinte relative/absolute", "Functii matematice si text", "Functii logice", "Aplicare practica integrata"],
                        "pain_scenario": {
                            "bad": "Panic before the test because you only memorized function names",
                            "good": "Confident because you practiced real scenarios - the test is just another exercise"
                        },
                        "try_challenge": "Complete a simulated practical test: 5 tasks combining all M2 skills, timed 40 minutes.",
                        "practice_context": "Real-world: assessment preparation, skill demonstration"
                    }
                }
            },
            "m3-grafice-web": {
                "name": "Tranzitie Grafice + Introducere Web",
                "domain": "D1->D2: Calcul Tabelar -> Pagini Web",
                "competencies": ["1.1", "1.2", "3.1", "3.2"],
                "weeks": "S15-S20 (ian-feb)",
                "tool": "Excel + Notepad/VS Code + Browser",
                "lessons": {
                    "lectia1-grafice-tipuri": {
                        "title": "Tipuri de Grafice si Cand le Folosim",
                        "topic": "Chart type deep dive: column (comparison), bar (ranking), line (trend), pie (proportion), area, scatter. When to use each type, misleading charts, best practices",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["Grafic coloana - comparatie", "Grafic bara - clasificare", "Grafic linie - tendinta/evolutie", "Grafic cerc (pie) - proportie", "Grafic dispersie (scatter)", "Alegerea corecta", "Grafice inselatoare"],
                        "pain_scenario": {
                            "bad": "Using a pie chart for 15 categories - unreadable mess",
                            "good": "Column chart for comparison, pie for 3-4 parts, line for trends - clear and professional"
                        },
                        "try_challenge": "Given a dataset of monthly temperatures, create 3 chart types and evaluate which tells the story best.",
                        "practice_context": "Real-world: data journalism, scientific reporting"
                    },
                    "lectia2-creare-formatare": {
                        "title": "Crearea si Formatarea Graficelor",
                        "topic": "Step-by-step chart creation, Chart Design tab, Chart Format tab, modifying chart elements (title, axes, labels, legend, gridlines), color schemes, chart templates, sparklines",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["Creare grafic pas cu pas", "Tab Chart Design", "Tab Chart Format", "Modificare titlu, axe, legenda", "Etichete date (data labels)", "Linii grila (gridlines)", "Scheme de culori", "Sparklines"],
                        "pain_scenario": {
                            "bad": "Default chart with no title, tiny font, wrong colors - looks amateurish",
                            "good": "Customized chart with clear title, readable labels, professional colors - presentation-ready"
                        },
                        "try_challenge": "Take a default chart and transform it: add title, format axes, change colors, add data labels, resize for presentation.",
                        "practice_context": "Real-world: business presentations, school projects"
                    },
                    "lectia3-proiect-excel": {
                        "title": "Proiect Excel: Analiza si Vizualizare Date",
                        "topic": "Capstone Excel project: real dataset analysis, multiple charts, dashboard layout, data interpretation, writing conclusions from charts",
                        "competency": "1.1, 3.1",
                        "key_concepts": ["Analiza date reale", "Dashboard cu grafice multiple", "Interpretare tendinte", "Scriere concluzii", "Layout profesional", "Pregatire prezentare"],
                        "pain_scenario": {
                            "bad": "Raw data table with no charts - nobody can see the patterns",
                            "good": "Dashboard with 4 charts showing different angles - patterns are instantly visible"
                        },
                        "try_challenge": "Build an Excel dashboard: population data for 5 Romanian cities over 10 years. Include line chart, bar chart, pie chart, and written analysis.",
                        "practice_context": "Real-world: data analyst portfolio piece"
                    },
                    "lectia4-introducere-web": {
                        "title": "Introducere in Lumea Web",
                        "topic": "How the web works: browser, server, HTTP, URL structure, domain names, HTML as the language of web pages, viewing page source, web vs internet distinction",
                        "competency": "1.2",
                        "key_concepts": ["Cum functioneaza web-ul", "Browser vs Server", "URL (adresa web)", "Domeniu (domain name)", "HTML = limbajul paginilor web", "View Page Source", "Web vs Internet"],
                        "pain_scenario": {
                            "bad": "Thinking web pages are magic - can't customize or create anything",
                            "good": "Understanding that every web page is just HTML text - you can read it, modify it, create your own"
                        },
                        "try_challenge": "Open 3 websites, use Ctrl+U to view source code, find the <title> tag. Then create a minimal HTML file and open it in browser.",
                        "practice_context": "Real-world: understanding digital world, web literacy"
                    },
                    "lectia5-structura-html": {
                        "title": "Structura unui Document HTML",
                        "topic": "HTML document structure: <!DOCTYPE html>, <html>, <head>, <body>, <title>, <meta>, headings <h1>-<h6>, paragraphs <p>, basic tags, nesting rules, indentation",
                        "competency": "1.2, 3.2",
                        "key_concepts": ["<!DOCTYPE html>", "<html>, <head>, <body>", "<title> si <meta>", "Titluri <h1> - <h6>", "Paragrafe <p>", "Reguli de imbricare (nesting)", "Indentare cod"],
                        "pain_scenario": {
                            "bad": "Writing text in Notepad and opening it in browser - just a wall of text, no structure",
                            "good": "Proper HTML with headings, paragraphs, title - organized, readable, professional"
                        },
                        "try_challenge": "Create an 'About Me' HTML page with: title, 3 headings (name, hobbies, school), paragraphs under each, proper nesting and indentation.",
                        "practice_context": "Real-world: personal web page, online portfolio"
                    },
                    "lectia6-evaluare-m3": {
                        "title": "Evaluare Modul 3",
                        "topic": "Module assessment combining Excel charts mastery and HTML basics. Practical test: create charts from data + create a basic HTML page",
                        "competency": "1.1, 1.2, 3.1, 3.2",
                        "key_concepts": ["Recapitulare grafice Excel", "Recapitulare structura HTML", "Aplicare practica combinata"],
                        "pain_scenario": {
                            "bad": "Confused by mixing Excel and HTML topics",
                            "good": "Clear mental model: Excel=data visualization, HTML=web structure - two complementary tools"
                        },
                        "try_challenge": "Two-part assessment: (1) Create a formatted chart from given data. (2) Create an HTML page that describes the chart analysis.",
                        "practice_context": "Real-world: multimodal communication skills"
                    }
                }
            }
        }
    }
}


# ============================================================
# PROMPT TEMPLATE - The teacher agent's instruction set
# ============================================================

TEACHER_AGENT_PROMPT = '''You are a **Romanian ICT Teacher Agent** creating a lesson for LearningHub.

## YOUR MISSION
Create a COMPLETE, standalone HTML lesson file for: **{lesson_title}**
Grade: {grade_name} | Module: {module_name} | Competency: {competency}

## TOPIC TO TEACH
{topic_description}

## KEY CONCEPTS (must all be covered)
{key_concepts_list}

## PEDAGOGICAL REQUIREMENTS

### GOAL Section (30 seconds read)
- Large emoji (4.5rem) relevant to topic
- Gradient title (red->rose for cls8)
- Pain scenario: show BEFORE (bad way) vs AFTER (good way with this skill)
  - BAD: {pain_bad}
  - GOOD: {pain_good}
- 3-5 learning outcomes as bullet list
- CTA button "Sa incepem! ->"

### TRY Section (5 minutes hands-on)
- Challenge: {try_challenge}
- 4-6 numbered step-by-step instructions
- Copyable code/instructions block with copy button
- Link to relevant tool (Excel Online / OneCompiler / browser)
- 2-3 collapsible hints (for students who get stuck)
- Optional bonus challenge
- "Am incercat! Vreau sa inteleg ->" button

### LEARN Section (5-7 minutes instruction)
- 3-4 concept cards, each with:
  - Clear concept name
  - Definition/explanation
  - Real-world analogy (from student's life: school, games, social media)
  - Visual diagram or table where applicable
- Info/Warning/Tip/Mistake boxes for important points
- Step-by-step trace example (if applicable)
- Complete working example
- Code blocks with syntax highlighting where needed

### TEST Section (3-5 minutes assessment)
- 6 quiz questions minimum (MCQ with 3-4 options each)
- Each option has onclick with selectOption(this, 'qN', true/false, 'Explanation...')
- Every option (correct AND wrong) must have an explanation
- Questions should test understanding, not just recall
- Pass threshold: 4/6 correct (66%)
- Include at least 1 scenario-based question
- Include at least 1 "what happens if..." question

### PRACTICE Section (always visible, after all sections)
- 3 exercises:
  1. Open-ended (creative application)
  2. Practical/hands-on (step-by-step task)
  3. Analytical (compare, explain, evaluate)
- Each with expandable hint

### COMPLETION Section
- Celebration message
- Score display
- "Ce ai invatat" summary (3-4 points)
- Next lesson link

## HTML TEMPLATE REQUIREMENTS

### Structure
```
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{lesson_title} | TIC {grade_name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>/* ALL CSS INLINE */</style>
</head>
<body>
  <div class="container">
    <!-- Nav bar with back link -->
    <!-- Progress steps: OBIECTIV -> INCEARCA -> INVATA -> VERIFICA -> COMPLET -->
    <!-- Section: goal (active by default) -->
    <!-- Section: try -->
    <!-- Section: learn -->
    <!-- Section: test -->
    <!-- Section: complete -->
    <!-- Practice advanced section (always visible) -->
    <!-- Lesson summary div -->
  </div>
  <!-- JS includes -->
  <script src="../../../../assets/js/atomic-learning.js"></script>
  <script src="../../../../assets/js/quiz-bridge.js"></script>
  <script src="../../../../assets/js/practice-simple.js"></script>
  <script src="../../../../assets/js/lesson-summary.js"></script>
  <script src="../../../../assets/js/breadcrumb.js"></script>
  <script src="../../../../assets/js/progress.js"></script>
  <!-- Init scripts -->
</body>
</html>
```

### Color Scheme (cls8 = red/rose theme)
```css
:root {{
    --bg-primary: #0a0a12;
    --bg-secondary: #12121f;
    --bg-card: #1a1a2e;
    --bg-card-hover: #252540;
    --accent-red: #ef4444;
    --accent-red-light: #f87171;
    --accent-rose: #f43f5e;
    --accent-green: #10b981;
    --accent-orange: #f59e0b;
    --accent-cyan: #06b6d4;
    --accent-purple: #8b5cf6;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --border: #2d2d44;
    --success: #22c55e;
    --error: #ef4444;
    --warning: #f59e0b;
}}
```

### JS Initialization (at bottom of body)
```javascript
document.addEventListener('DOMContentLoaded', function() {{
    if (typeof QuizBridge !== 'undefined') {{
        QuizBridge.init('{quiz_id}', {{ totalQuestions: 6 }});
    }}
    if (typeof PracticeSimple !== 'undefined') {{
        PracticeSimple.init('{quiz_id}');
    }}
    if (typeof LessonSummary !== 'undefined') {{
        LessonSummary.init('{quiz_id}');
    }}
    if (typeof Breadcrumb !== 'undefined') {{
        Breadcrumb.init({{
            grade: 'cls8',
            gradeName: '{grade_name}',
            module: '{module_dir}',
            moduleName: '{module_name}',
            lesson: '{lesson_nav_name}'
        }});
    }}
    if (typeof LearningProgress !== 'undefined') {{
        LearningProgress.init('cls8', '{module_dir}', '{lesson_file}');
    }}
}});
```

### Required JS Functions (include in <script> before external JS)
```javascript
function goToStep(step) {{
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(step).classList.add('active');
    // Mark completed steps
    const steps = ['goal', 'try', 'learn', 'test', 'complete'];
    const idx = steps.indexOf(step);
    document.querySelectorAll('.step').forEach((s, i) => {{
        if (i < idx) s.classList.add('completed');
        if (i === idx) s.classList.add('active');
    }});
    window.scrollTo({{ top: 0, behavior: 'smooth' }});
}}

function selectOption(el, qId, correct, explanation) {{
    if (el.classList.contains('locked')) return;
    const parent = el.closest('.quiz-question');
    parent.querySelectorAll('.option').forEach(o => {{
        o.classList.add('locked');
        if (o === el) o.classList.add(correct ? 'correct' : 'wrong');
    }});
    const fb = document.getElementById(qId + '-feedback');
    fb.innerHTML = explanation;
    fb.className = 'feedback ' + (correct ? 'success' : 'error');
    fb.style.display = 'block';
    if (typeof QuizBridge !== 'undefined') {{
        QuizBridge.recordAnswer(qId, correct);
    }}
    checkAllAnswered();
}}

function checkAllAnswered() {{
    const total = document.querySelectorAll('.quiz-question').length;
    const answered = document.querySelectorAll('.quiz-question .option.locked').length > 0 ?
        document.querySelectorAll('.quiz-question').length : 0;
    // Count questions that have at least one locked option
    let count = 0;
    document.querySelectorAll('.quiz-question').forEach(q => {{
        if (q.querySelector('.option.locked')) count++;
    }});
    if (count === total) {{
        document.getElementById('check-btn').style.display = 'inline-flex';
    }}
}}

function checkAllAnswers() {{
    const correct = document.querySelectorAll('.option.correct').length;
    const total = document.querySelectorAll('.quiz-question').length;
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 66;
    const result = document.getElementById('test-result');
    result.innerHTML = `
        <div class="result-box ${{passed ? 'result-pass' : 'result-fail'}}">
            <div class="result-icon">${{passed ? '🎉' : '📚'}}</div>
            <div class="result-score">${{correct}}/${{total}} (${{pct}}%)</div>
            <div class="result-text">${{passed ? 'Felicitari! Ai trecut testul!' : 'Mai repeta lectia si incearca din nou!'}}</div>
            ${{passed ? '<button class="btn btn-success" onclick="goToStep(\\'complete\\')">Vezi rezultatul final →</button>' : '<button class="btn btn-outline" onclick="goToStep(\\'learn\\')">← Repeta lectia</button>'}}
        </div>
    `;
    result.style.display = 'block';
}}

function toggleHint(el) {{
    const content = el.nextElementSibling;
    const arrow = el.querySelector('.hint-arrow');
    if (content.style.display === 'block') {{
        content.style.display = 'none';
        arrow.textContent = '▶';
    }} else {{
        content.style.display = 'block';
        arrow.textContent = '▼';
    }}
}}

function copyCode(btn) {{
    const code = btn.nextElementSibling.textContent;
    navigator.clipboard.writeText(code).then(() => {{
        btn.textContent = '✓ Copiat!';
        setTimeout(() => btn.textContent = 'Copiaza', 2000);
    }});
}}

function togglePracticeHint(el) {{
    const hint = el.nextElementSibling;
    hint.style.display = hint.style.display === 'block' ? 'none' : 'block';
}}
```

## CONTENT QUALITY REQUIREMENTS
1. ALL text in Romanian (diacritics optional but preferred where possible)
2. Analogies from student's daily life (school, games, social media, sports)
3. Every concept explained simply first, then technically
4. Visual diagrams using HTML/CSS (not images) for spreadsheet grids, charts
5. Code examples relevant to {practice_context}
6. At least 2000 lines of HTML (comprehensive lesson)
7. All CSS must be inline in <style> tag (no external CSS files)
8. Mobile responsive (test at 768px and 480px breakpoints)
9. Dark theme throughout (bg: #0a0a12)

## NAVIGATION
- Back to module: `index.html`
- Previous lesson: `{prev_lesson_file}` (or none if first)
- Next lesson: `{next_lesson_file}` (or none if last)

## OUTPUT
Output the COMPLETE HTML file content. No truncation. No placeholders. Every section fully implemented.
The file should be 100% functional when saved and opened in a browser.
'''


# ============================================================
# COMPARISON RUBRIC
# ============================================================

COMPARISON_DIMENSIONS = [
    ("GOAL", "Motivation clarity, pain scenario quality, learning outcomes specificity"),
    ("TRY", "Challenge relevance, step quality, hint usefulness, engagement level"),
    ("LEARN", "Concept clarity, analogy quality, visual diagrams, depth of explanation"),
    ("TEST", "Question quality, explanation depth, scenario variety, difficulty balance"),
    ("COMPLETION", "Summary accuracy, celebration design, next steps clarity"),
    ("PRACTICE", "Exercise variety, real-world relevance, difficulty progression"),
    ("CSS", "Visual polish, animation quality, responsive design, theme consistency"),
    ("JS", "Functionality correctness, quiz system, progress tracking, error handling"),
]


# ============================================================
# COMMANDS
# ============================================================

def load_progress():
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text(encoding='utf-8'))
    return {"rebuilt": {}, "started": datetime.now().isoformat()}


def save_progress(progress):
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2, ensure_ascii=False), encoding='utf-8')


def cmd_inventory(grade, module=None):
    """Show lesson inventory for a grade (optionally filtered by module)."""
    if grade not in INVENTORY:
        print(f"ERROR: Grade '{grade}' not found. Available: {list(INVENTORY.keys())}")
        return

    grade_data = INVENTORY[grade]
    progress = load_progress()
    rebuilt = progress.get("rebuilt", {})

    print(f"\n{'='*60}")
    print(f"  LESSON INVENTORY: {grade_data['grade_name']}")
    print(f"{'='*60}\n")

    total = 0
    done = 0

    for mod_key, mod_data in grade_data["modules"].items():
        if module and module != mod_key and not mod_key.startswith(module):
            continue

        print(f"  {mod_data['name']} ({mod_key})")
        print(f"  Domain: {mod_data['domain']} | Weeks: {mod_data['weeks']}")
        print(f"  Competencies: {', '.join(mod_data['competencies'])}")
        print(f"  {'-'*50}")

        for lesson_key, lesson_data in mod_data["lessons"].items():
            total += 1
            key = f"{grade}/{mod_key}/{lesson_key}"
            status = rebuilt.get(key, {}).get("status", "pending")
            if status == "done":
                done += 1
            icon = {"done": "[OK]", "in_progress": "[..]", "pending": "[  ]"}.get(status, "[  ]")
            print(f"    {icon} {lesson_key}: {lesson_data['title']}")

        print()

    print(f"  Progress: {done}/{total} ({round(done/total*100) if total else 0}%)")
    print()


def cmd_prompt(grade, module, lesson):
    """Generate teacher agent prompt for a specific lesson."""
    if grade not in INVENTORY:
        print(f"ERROR: Grade '{grade}' not found.")
        return

    grade_data = INVENTORY[grade]
    modules = grade_data["modules"]

    # Find module
    mod_key = None
    for mk in modules:
        if mk == module or mk.startswith(module):
            mod_key = mk
            break

    if not mod_key:
        print(f"ERROR: Module '{module}' not found. Available: {list(modules.keys())}")
        return

    mod_data = modules[mod_key]
    lessons = mod_data["lessons"]

    # Find lesson
    lesson_key = None
    for lk in lessons:
        if lk == lesson or lk.startswith(lesson):
            lesson_key = lk
            break

    if not lesson_key:
        print(f"ERROR: Lesson '{lesson}' not found. Available: {list(lessons.keys())}")
        return

    lesson_data = lessons[lesson_key]
    lesson_keys = list(lessons.keys())
    idx = lesson_keys.index(lesson_key)

    # Navigation
    prev_lesson = f"{lesson_keys[idx-1]}.html" if idx > 0 else "index.html"
    next_lesson = f"{lesson_keys[idx+1]}.html" if idx < len(lesson_keys)-1 else "index.html"

    # Quiz ID
    quiz_id = f"cls8-{mod_key}-{lesson_key}"

    # Lesson nav name
    lesson_num = idx + 1
    lesson_nav_name = f"Lectia {lesson_num}"

    # Format key concepts
    key_concepts_list = "\n".join(f"- {c}" for c in lesson_data["key_concepts"])

    prompt = TEACHER_AGENT_PROMPT.format(
        lesson_title=lesson_data["title"],
        grade_name=grade_data["grade_name"],
        module_name=mod_data["name"],
        module_dir=mod_key,
        competency=lesson_data["competency"],
        topic_description=lesson_data["topic"],
        key_concepts_list=key_concepts_list,
        pain_bad=lesson_data["pain_scenario"]["bad"],
        pain_good=lesson_data["pain_scenario"]["good"],
        try_challenge=lesson_data["try_challenge"],
        practice_context=lesson_data["practice_context"],
        quiz_id=quiz_id,
        lesson_file=lesson_key,
        lesson_nav_name=lesson_nav_name,
        prev_lesson_file=prev_lesson,
        next_lesson_file=next_lesson,
    )

    # Save to file
    prompt_file = PROMPTS_DIR / f"{grade}_{mod_key}_{lesson_key}.txt"
    prompt_file.write_text(prompt, encoding='utf-8')

    print(f"Prompt generated: {prompt_file}")
    print(f"Length: {len(prompt)} chars")
    print(f"\nTo use: spawn a Task agent with this prompt content")
    print(f"Output should be saved to: {V2_OUTPUT_DIR / f'{lesson_key}.html'}")

    return prompt


def cmd_batch(grade, module):
    """Generate all prompts for a module."""
    if grade not in INVENTORY:
        print(f"ERROR: Grade '{grade}' not found.")
        return

    modules = INVENTORY[grade]["modules"]
    mod_key = None
    for mk in modules:
        if mk == module or mk.startswith(module):
            mod_key = mk
            break

    if not mod_key:
        print(f"ERROR: Module '{module}' not found.")
        return

    mod_data = modules[mod_key]
    print(f"\nGenerating prompts for {mod_data['name']}...")
    print(f"{'='*50}")

    prompts = {}
    for lesson_key in mod_data["lessons"]:
        prompt = cmd_prompt(grade, mod_key, lesson_key)
        if prompt:
            prompts[lesson_key] = prompt
        print()

    print(f"\nGenerated {len(prompts)} prompts in {PROMPTS_DIR}")
    print(f"\nRecommended: spawn {len(prompts)} parallel Task agents")
    return prompts


def cmd_status():
    """Show rebuild progress."""
    progress = load_progress()
    rebuilt = progress.get("rebuilt", {})

    print(f"\n{'='*60}")
    print(f"  LESSON REBUILD STATUS")
    print(f"  Started: {progress.get('started', 'unknown')}")
    print(f"{'='*60}\n")

    if not rebuilt:
        print("  No lessons rebuilt yet.")
        print("  Run: python tools/lesson_rebuild.py batch cls8 m1")
        return

    for key, info in sorted(rebuilt.items()):
        icon = {"done": "[OK]", "in_progress": "[..]", "failed": "[XX]"}.get(info.get("status"), "[  ]")
        print(f"  {icon} {key}: {info.get('status', 'unknown')} ({info.get('timestamp', '')})")

    done = sum(1 for v in rebuilt.values() if v.get("status") == "done")
    print(f"\n  Total: {done}/{len(rebuilt)} complete")


def cmd_mark(grade, module, lesson, status="done"):
    """Mark a lesson rebuild status."""
    progress = load_progress()
    key = f"{grade}/{module}/{lesson}"
    if "rebuilt" not in progress:
        progress["rebuilt"] = {}
    progress["rebuilt"][key] = {
        "status": status,
        "timestamp": datetime.now().isoformat()
    }
    save_progress(progress)
    print(f"Marked {key} as {status}")


def main():
    parser = argparse.ArgumentParser(description="LearningHub Lesson Rebuild Tool")
    sub = parser.add_subparsers(dest="command")

    # inventory
    inv = sub.add_parser("inventory", help="Show lesson inventory")
    inv.add_argument("grade", help="Grade (e.g., cls8)")
    inv.add_argument("module", nargs="?", help="Module filter (e.g., m1)")

    # prompt
    pr = sub.add_parser("prompt", help="Generate teacher agent prompt")
    pr.add_argument("grade")
    pr.add_argument("module")
    pr.add_argument("lesson")

    # batch
    ba = sub.add_parser("batch", help="Generate all prompts for a module")
    ba.add_argument("grade")
    ba.add_argument("module")

    # status
    sub.add_parser("status", help="Show rebuild progress")

    # mark
    mk = sub.add_parser("mark", help="Mark lesson rebuild status")
    mk.add_argument("grade")
    mk.add_argument("module")
    mk.add_argument("lesson")
    mk.add_argument("--status", default="done", choices=["done", "in_progress", "failed"])

    args = parser.parse_args()

    if args.command == "inventory":
        cmd_inventory(args.grade, args.module)
    elif args.command == "prompt":
        cmd_prompt(args.grade, args.module, args.lesson)
    elif args.command == "batch":
        cmd_batch(args.grade, args.module)
    elif args.command == "status":
        cmd_status()
    elif args.command == "mark":
        cmd_mark(args.grade, args.module, args.lesson, args.status)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
