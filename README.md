# LearningHub

Interactive TIC (ICT) learning platform for Romanian gymnasium students (grades 5-8).
Live at **https://learninghub-8z6.pages.dev** and **https://licuvas.github.io/LearningHub**.

## What It Is

346 self-contained HTML lesson and quiz pages covering the full TIC curriculum per OMEN 3393/2017. Each lesson is a single HTML file with embedded interactivity — no backend, no build step, no dependencies. Students open a page, learn, answer quizzes, practice, and get graded 1-10.

## Site Structure

```
content/tic/
├── cls5/          98 files  (Clasa a V-a)
│   ├── m1-sisteme/          Hardware, software, ergonomics
│   ├── m2-grafice-internet/  Paint, browsers, internet safety
│   ├── m3-algoritmi/         Algorithms, flowcharts, pseudocode
│   ├── m4-scratch/           Scratch basics, animation, games
│   ├── m5-proiect/           Final project + evaluation
│   └── extra-*/              Supplementary: Word, safety, office apps
├── cls6/          61 files  (Clasa a VI-a)
│   ├── m1-prezentari/        PowerPoint basics, slides, animation
│   ├── m2-scratch-variabile/ Scratch variables, lists, operators
│   ├── m3-scratch-control/   If/else, loops, logical operators
│   ├── m4-comunicare/        Email, attachments, collaboration
│   └── m5-proiect/           Scratch project
├── cls7/          97 files  (Clasa a VII-a)
│   ├── m1-word-fundamente/   Word: formatting, tables, lists
│   ├── m2-word-avansat/      Word: sections, headers, TOC, mail merge
│   ├── m3-html-css/          HTML tags, CSS styling, web pages
│   ├── m4-colaborare/        Online collaboration tools
│   └── extra-*/              Databases, multimedia, web projects
└── cls8/          89 files  (Clasa a VIII-a)
    ├── m1-cpp-baze/          C++ basics: variables, I/O, operators
    ├── m2-cpp-structuri/     If/else, switch, while, for, do-while
    ├── m3-cpp-functii/       Functions, parameters, recursion
    ├── m4-baze-date/         Access: tables, relationships, SQL
    ├── m5-recapitulare/      Review + evaluation
    └── extra-*/              Data structures, subprograms, databases
```

Each module folder contains:
- `index.html` — module overview with lesson links and quiz links
- `lectia1-*.html` through `lectia6-*.html` — individual lessons
- `quizuri/quiz1-*.html` through `quiz5-*.html` — standalone gamified quizzes

## Two Lesson Formats

### 5-Step Format (cls5, most of cls6)
Structure: **GOAL → TRY → LEARN → TEST → COMPLETE**
- Student sees one section at a time, clicks through steps
- JS functions: `goToStep()`, `selectOption()`, `checkAllAnswers()`
- CSS: `assets/css/lesson-5step.css` (shared) + per-lesson inline styles
- Required scripts: quiz-bridge.js, practice-simple.js, lesson-summary.js, breadcrumb.js, progress.js, user-system.js, practice-gate.js

### Atomic Format (cls7, cls8, extras)
Structure: Progressive **atoms** with embedded quizzes
- Student unlocks atoms sequentially by answering questions
- JS functions: `AtomicLearning.init()`, `AdvancedPractice.init()`
- CSS: `assets/css/lesson-atomic.css` (shared) + per-lesson inline styles
- Required scripts: atomic-learning.js, practice-simple.js, lesson-summary.js, breadcrumb.js, progress.js, user-system.js

### Gamified Quizzes
Structure: 5-level XP progression with star ratings
- CSS: `assets/css/quiz-gamified.css`
- 120 quiz files across all grades
- localStorage-based XP tracking
- 66% minimum to pass each level

## Grading System

Each lesson grades 1-10:
- **1 point** — din oficiu (automatic)
- **6 points** — quiz score (proportional to correct answers)
- **3 points** — practice exercises (teacher-evaluated via textareas)

## Shared Assets

### JavaScript (`assets/js/` — 20 files)
| Script | Purpose |
|--------|---------|
| `quiz-bridge.js` | Quiz state management, answer recording, grade calculation |
| `atomic-learning.js` | Atom progression, embedded quiz validation |
| `practice-simple.js` | Injects textareas into `.practice-exercise` and `.exercise` divs |
| `practice-gate.js` | Hides practice until test section is reached |
| `lesson-summary.js` | Shows grade summary after quiz interaction |
| `breadcrumb.js` | Dynamic breadcrumb navigation (works with Cloudflare extensionless URLs) |
| `progress.js` | LearningProgress tracking per module |
| `user-system.js` | Multi-profile support (school lab — multiple students per PC) |
| `scratch-blocks.js` | Renders Scratch-style colored blocks in lessons |
| `rpg-system.js` | XP and achievement system |

### CSS (`assets/css/` — 9 files)
| Stylesheet | Purpose |
|------------|---------|
| `lesson-5step.css` | Shared styles for 5-step format lessons (~824 lines) |
| `lesson-atomic.css` | Shared styles for atomic format lessons (~241 lines) |
| `quiz-gamified.css` | Shared styles for gamified quizzes (~417 lines) |
| `mobile.css` | Mobile responsive overrides |
| `scratch-blocks.css` | Scratch block visual styling |
| `practice.css` | Practice section styling |

## Tools (`tools/` — 57 scripts)

### Essential Tools
| Tool | Purpose |
|------|---------|
| `site_audit.py` | **Primary QA tool** — scans all files for 9 issue categories |
| `site_audit.py --quick` | Fast mode — CRITICALs only (used in pre-commit hook) |
| `extract_css.py` | Extracts shared CSS from inline styles to external files |
| `fix_site_issues.py` | Batch fix: practice gates + breadcrumbs |
| `phase1_fixer.py` | Nav links, scripts, IDs, functions, inits |
| `fix_storage_keys.py` | Fix localStorage key mismatches |
| `fix_escaped_quotes.py` | Fix `\"` → `&quot;` in onclick attributes |

### Running the Audit
```bash
cd C:\AI\Projects\LearningHub
python tools/site_audit.py          # Full audit — all categories
python tools/site_audit.py --quick  # CRITICALs only (pre-commit)
```

Output: `tools/audit_report.json` + terminal summary with CRITICAL/WARNING/INFO counts.

**Audit categories:** JS_SYNTAX, MISSING_SCRIPT, BREADCRUMB, SKELETON, THIN_CONTENT, BROKEN_LINK, PRACTICE_UNGATED, PLACEHOLDER, CSS_THEME

## Deployment

- **Primary:** Cloudflare Pages at `learninghub-8z6.pages.dev` (auto-deploys from GitHub)
- **Mirror:** GitHub Pages at `licuvas.github.io/LearningHub`
- **Important:** Cloudflare serves extensionless URLs (`/lectia1-calculator` not `/lectia1-calculator.html`)

### Pre-commit Hook
A git hook at `.githooks/pre-commit` runs `site_audit.py --quick` and blocks commits with CRITICAL issues.

```bash
git config core.hooksPath .githooks   # Enable hooks
```

## Debugging Guide

### "Button does nothing when clicked"
1. Open browser DevTools (F12) → Console tab
2. If you see `Uncaught SyntaxError` — a quote nesting bug killed the entire `<script>` block
3. Search for `'..onclick="goToStep('` patterns — single quotes inside single quotes break JS
4. Fix: use backtick template literals or `&quot;` for HTML attribute quotes

### "Quiz option clicks but no feedback"
1. Check the onclick attribute for `\"` — this is JS escape, not HTML escape
2. Browser stops parsing at the unescaped `"`, rest becomes garbage
3. Fix: replace `\"` with `&quot;` inside onclick strings

### "Practice exercises show no textareas"
1. Check if the exercise div uses `class="practice-exercise"` or `class="exercise"`
2. `practice-simple.js` accepts both — but older lessons may use other class names
3. Check if `practice-simple.js` is included in the script tags
4. Check if `PracticeSimple.init('lesson-id')` is called

### "Practice visible on first page/step"
1. Check if `practice-gate.js` is included (required for 5-step format)
2. Practice sections use `.practice-section` class, not `.section`
3. `goToStep()` only hides `.section` elements — practice stays visible without the gate

### "Grade shows 1/10 before answering"
1. `lesson-summary.js` calculates grade on init
2. Check if `<div id="lesson-summary">` has `style="display: none;"`
3. Without this, summary renders immediately with 0 answers = grade 1

### "Breadcrumb links broken on Cloudflare"
1. `breadcrumb.js` uses regex to parse URLs
2. Cloudflare serves without `.html` extension
3. Check that `getModulePath()` has fallback patterns for extensionless URLs

### "All asset paths broken after moving files"
1. Asset paths are relative: `../../../../assets/js/quiz-bridge.js`
2. Moving a file one level deeper/shallower breaks ALL paths
3. Always use `os.path.relpath()` in scripts, never count `../` manually

### "Changes deployed but old version shows"
1. Cloudflare/GitHub Pages cache aggressively
2. Hard-refresh: Ctrl+Shift+R
3. Wait 2-5 minutes for CDN propagation

## Language Conventions

- **Romanian** throughout, informal "tu" form
- **ASCII only** — no diacritics (î, ă, ș, ț) in titles or content
- **Formal class names**: "Clasa a V-a" (not "Clasa 5")
- **Spelling**: "creeaza" (not "creaza"), "obiectul" (not "objectul")

## Curriculum Reference

Follows OMEN 3393/2017 (Romanian national TIC curriculum):
- **Cls 5**: Computer systems, graphics/internet, algorithms, Scratch
- **Cls 6**: Presentations, Scratch (variables, control), email/collaboration
- **Cls 7**: Word processing, HTML/CSS, online collaboration
- **Cls 8**: C++ programming, databases (Access/SQL)

Detailed curriculum mapping: `OFFICIAL_TEACHING_SEQUENCE.md`

---

*Prof. Gurlan Vasile — LearningHub v1.0 (Feb 2026)*
