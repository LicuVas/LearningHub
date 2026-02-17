# LearningHub Master Lesson Specification

> **Status:** AUTHORITATIVE — all agents building or refactoring lessons MUST follow this document.
> **Author:** John (CTO), consolidated from 55+ KB entries, 346 file audits, 6 repair sessions, and format evaluation.
> **Date:** February 17, 2026
> **Supersedes:** AI_GUIDE.md lesson format sections (kept for historical reference only)

---

## Table of Contents

1. [Decision: Format C "Guided Atomic"](#1-decision-format-c-guided-atomic)
2. [Lesson Structure Specification](#2-lesson-structure-specification)
3. [HTML Template](#3-html-template)
4. [Content Requirements](#4-content-requirements)
5. [Quiz & Assessment Specification](#5-quiz--assessment-specification)
6. [Grading System](#6-grading-system)
7. [Visual Design Standards](#7-visual-design-standards)
8. [JavaScript Architecture](#8-javascript-architecture)
9. [CSS Architecture](#9-css-architecture)
10. [Curriculum Compliance (OMEN 3393/2017)](#10-curriculum-compliance)
11. [Quality Checklist](#11-quality-checklist)
12. [Known Traps & Anti-Patterns](#12-known-traps--anti-patterns)
13. [Migration Guide: Converting Existing Lessons](#13-migration-guide)
14. [Appendix A: Format Evaluation Evidence](#appendix-a-format-evaluation-evidence)
15. [Appendix B: Question Templates by Tier](#appendix-b-question-templates-by-tier)
16. [Appendix C: Per-Grade Curriculum Map](#appendix-c-per-grade-curriculum-map)

---

## 1. Decision: Format C "Guided Atomic"

### What was evaluated

Two existing formats were compared across 6 dimensions (18 criteria, scored 1-10 each):

| Format | Description | Used in | Score |
|--------|-------------|---------|-------|
| **A: 5-Step** | GOAL → TRY → LEARN → TEST → COMPLETE | cls5, most cls6 | 152/290 (52%) |
| **B: Atomic** | Sequential atoms with embedded quizzes | cls7, cls8, extras | 184/290 (63%) |

### Why Atomic wins as the base

- **Technical quality:** 35/50 vs 17/50 — zero inline CSS duplication, fewer scripts (6 vs 8), centralized logic
- **Formative assessment:** 9/10 vs 4/10 — quiz inside each knowledge atom, not bolted on at the end
- **Scaffolding:** 8/10 vs 5/10 — sequential gating enforces mastery before progression
- **Cognitive load:** 8/10 vs 6/10 — one concept per screen vs entire LEARN section dumped at once
- **Scalability:** 8/10 vs 3/10 — complex topics = more atoms; simple format stays the same

### What 5-Step does better (kept in Format C)

- **TRY section (8/10):** Productive struggle before instruction — research-backed (Kapur 2016)
- **Pain comparison (7/10):** "FARA vs CU aceasta lectie" creates immediate relevance
- **Completion review (7/10):** Summary of "Ce ai invatat" + next lesson teaser
- **Step navigation (8/10):** Visible progress through labeled steps

### Format C: Guided Atomic

Keeps Atomic's engine + assessment integration. Adds 5-Step's motivational wrapper.

```
FRAME   (goal + pain comparison + learning outcomes)    ← from 5-Step
TRY     (hands-on challenge, OPTIONAL)                  ← from 5-Step
ATOMS   (content + embedded quiz, sequentially gated)   ← from Atomic
PRACTICE (3 exercises: minim/standard/performanta)      ← shared system
REVIEW  (summary + grade + export + next lesson)        ← from 5-Step
```

### Scripts: Keep / Discard

| Script | Action | Reason |
|--------|--------|--------|
| `atomic-learning.js` | **KEEP** | Core engine, handles atoms + quizzes + gating |
| `lesson-summary.js` | **KEEP** | Grade calculation, JSON export, SHA-256 verification |
| `practice-simple.js` | **KEEP** | Injects textareas into exercise divs |
| `breadcrumb.js` | **KEEP** | Navigation, works with Cloudflare extensionless URLs |
| `progress.js` | **KEEP** | Module progress tracking |
| `user-system.js` | **KEEP** | Multi-profile support for school labs |
| `quiz-bridge.js` | **DISCARD** | Only needed for 5-Step legacy quiz pattern |
| `practice-gate.js` | **DISCARD** | Replace with AtomicLearning event listener |

### CSS: Keep / Discard

| CSS | Action | Reason |
|-----|--------|--------|
| `lesson-atomic.css` | **KEEP + EXTEND** | Add ~150 lines for FRAME, TRY, REVIEW sections |
| `lesson-5step.css` | **ARCHIVE** | Move to `_deprecated/`, keep for reference only |
| Per-lesson inline `<style>` | **ZERO TOLERANCE** | No inline CSS blocks in Format C lessons |

---

## 2. Lesson Structure Specification

### Section Flow (all sections mandatory unless marked OPTIONAL)

```
┌─────────────────────────────────────────────────────┐
│  NAV BAR  (breadcrumb + user profile)               │
├─────────────────────────────────────────────────────┤
│  HEADER   (badge + title + subtitle)                │
├─────────────────────────────────────────────────────┤
│  PROGRESS BAR  (real-time atom completion %)        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FRAME SECTION                                      │
│  ├── Goal statement (1-2 sentences)                 │
│  ├── Pain comparison (OPTIONAL, recommended cls5-6) │
│  │   ├── Red card: "FARA aceasta lectie..."         │
│  │   └── Green card: "CU aceasta lectie..."         │
│  └── Learning outcomes (3-5 bullet points)          │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  TRY SECTION (OPTIONAL, recommended for practical)  │
│  ├── Challenge box with steps                       │
│  ├── Expandable hints (progressive, 2-3 levels)     │
│  └── Bonus challenge (optional, for advanced)       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ATOM 1: [Title]                                    │
│  ├── Content (4-8 paragraphs, lists, code, images)  │
│  └── Embedded quiz (1-2 MCQ questions)              │
│      └── Correct → unlocks Atom 2                   │
│                                                     │
│  ATOM 2: [Title]  (locked until Atom 1 completed)   │
│  ├── Content                                        │
│  └── Embedded quiz                                  │
│      └── Correct → unlocks Atom 3                   │
│                                                     │
│  ... (4-8 atoms per lesson)                         │
│                                                     │
│  ATOM N: [Title]  (final atom)                      │
│  ├── Content                                        │
│  └── Embedded quiz                                  │
│      └── Correct → unlocks PRACTICE                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PRACTICE SECTION (unlocked after all atoms done)   │
│  ├── Exercise 1: Minim (recall/identify)            │
│  ├── Exercise 2: Standard (apply/compare)           │
│  └── Exercise 3: Performanta (analyze/create)       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  REVIEW SECTION                                     │
│  ├── "Ce ai invatat astazi" summary (3-5 bullets)   │
│  ├── Grade display (1-10 system)                    │
│  ├── JSON export button                             │
│  ├── Next lesson teaser                             │
│  └── "Reia lectia" button                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Atom Count Guidelines

| Lesson complexity | Atoms | Duration |
|-------------------|-------|----------|
| Introduction / overview | 4-5 | 35-40 min |
| Standard lesson | 5-7 | 45-50 min |
| Complex / programming | 6-8 | 50-60 min |

### Per-Atom Content Guidelines

- **Title:** 3-8 words, descriptive (e.g., "Ce este Microsoft Word?")
- **Content:** 4-8 paragraphs maximum. If more, split into 2 atoms.
- **Quiz:** 1-2 questions per atom. MCQ with 3-4 options. Shuffle enabled.
- **Hint:** Each question MUST have a hint (shown after wrong answer).
- **Explanation:** Each question MUST have feedback for both correct and incorrect answers.

---

## 3. HTML Template

This is the canonical template for Format C. Copy this for every new lesson.

```html
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LESSON_TITLE | TIC Clasa a X-a</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="DEPTH/assets/css/lesson-atomic.css">
    <!-- NO inline <style> blocks. ZERO. -->
</head>
<body>
<div class="container">

    <!-- NAV BAR -->
    <nav class="nav-bar">
        <a href="index.html" class="nav-btn" title="Inapoi la modul">&#8592; Modulul</a>
        <a href="NEXT_LESSON.html" class="nav-btn" title="Lectia urmatoare">Urmatoarea &#8594;</a>
    </nav>

    <!-- HEADER -->
    <header class="lesson-header">
        <span class="lesson-badge">BADGE_TEXT</span>
        <h1 class="lesson-title">LESSON_TITLE</h1>
        <p class="lesson-subtitle">LESSON_SUBTITLE</p>
    </header>

    <!-- PROGRESS BAR -->
    <div class="progress-container">
        <div class="progress-bar" id="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
        </div>
        <span class="progress-text" id="progress-text">0% completat</span>
    </div>

    <!-- ═══════════════ FRAME SECTION ═══════════════ -->
    <section class="lesson-frame">
        <div class="goal-section">
            <h2>Obiectivul lectiei</h2>
            <p>GOAL_DESCRIPTION_1_2_SENTENCES</p>
        </div>

        <!-- Pain comparison: OPTIONAL. Use data-show-pain="true" to display. -->
        <!-- Recommended for cls5-6. Can omit for cls7-8. -->
        <div class="pain-comparison" data-show-pain="true">
            <div class="pain-card bad">
                <h3>FARA aceasta lectie</h3>
                <ul>
                    <li>PAIN_POINT_1</li>
                    <li>PAIN_POINT_2</li>
                    <li>PAIN_POINT_3</li>
                </ul>
            </div>
            <div class="pain-card good">
                <h3>CU aceasta lectie</h3>
                <ul>
                    <li>BENEFIT_1</li>
                    <li>BENEFIT_2</li>
                    <li>BENEFIT_3</li>
                </ul>
            </div>
        </div>

        <div class="learning-outcomes">
            <h3>Dupa aceasta lectie vei putea:</h3>
            <ul>
                <li>OUTCOME_1</li>
                <li>OUTCOME_2</li>
                <li>OUTCOME_3</li>
                <li>OUTCOME_4</li>
            </ul>
        </div>
    </section>

    <!-- ═══════════════ TRY SECTION (OPTIONAL) ═══════════════ -->
    <!-- Include for practical lessons. Omit for theory-heavy content. -->
    <section class="try-section">
        <h2>Incearca singur!</h2>
        <div class="try-challenge">
            <p>TRY_CHALLENGE_DESCRIPTION</p>
            <ol>
                <li>TRY_STEP_1</li>
                <li>TRY_STEP_2</li>
                <li>TRY_STEP_3</li>
            </ol>
        </div>
        <details class="hint-box">
            <summary>Indiciu 1</summary>
            <p>HINT_1_TEXT</p>
        </details>
        <details class="hint-box">
            <summary>Indiciu 2</summary>
            <p>HINT_2_TEXT</p>
        </details>
        <div class="bonus-challenge">
            <h4>Provocare bonus (optional)</h4>
            <p>BONUS_CHALLENGE_TEXT</p>
        </div>
    </section>

    <!-- ═══════════════ ATOMS ═══════════════ -->
    <main id="atomic-content">

        <div class="atom" id="atom-1"
             data-quiz='[{
                 "question": "QUESTION_TEXT_RO",
                 "options": ["OPT_A", "OPT_B", "OPT_C", "OPT_D"],
                 "correct": "a",
                 "hint": "HINT_TEXT_RO"
             }]'>
            <h2 class="atom-title">1. ATOM_1_TITLE</h2>
            <p>ATOM_1_CONTENT_PARAGRAPH_1</p>
            <p>ATOM_1_CONTENT_PARAGRAPH_2</p>
            <!-- Use: <div class="info-box">, <div class="warning-box">, <div class="tip-box"> -->
            <!-- Use: <pre><code class="language-X"> for code blocks -->
            <!-- Use: <table> for data tables -->
        </div>

        <div class="atom" id="atom-2"
             data-quiz='[{
                 "question": "QUESTION_TEXT_RO",
                 "options": ["OPT_A", "OPT_B", "OPT_C"],
                 "correct": "b",
                 "hint": "HINT_TEXT_RO"
             }]'>
            <h2 class="atom-title">2. ATOM_2_TITLE</h2>
            <p>ATOM_2_CONTENT</p>
        </div>

        <!-- Repeat for atoms 3-N -->

    </main>

    <!-- ═══════════════ PRACTICE ═══════════════ -->
    <section class="practice-section" id="practice">
        <h2>Exercitii practice</h2>

        <div class="practice-exercise" data-level="minim">
            <h3>Exercitiul 1 (Nivel minim)</h3>
            <p>EXERCISE_1_INSTRUCTIONS</p>
            <!-- PracticeSimple auto-injects textarea here -->
        </div>

        <div class="practice-exercise" data-level="standard">
            <h3>Exercitiul 2 (Nivel standard)</h3>
            <p>EXERCISE_2_INSTRUCTIONS</p>
        </div>

        <div class="practice-exercise" data-level="performanta">
            <h3>Exercitiul 3 (Nivel performanta)</h3>
            <p>EXERCISE_3_INSTRUCTIONS</p>
        </div>
    </section>

    <!-- ═══════════════ REVIEW ═══════════════ -->
    <section class="review-section">
        <div class="summary-box">
            <h2>Ce ai invatat astazi</h2>
            <ul>
                <li>SUMMARY_POINT_1</li>
                <li>SUMMARY_POINT_2</li>
                <li>SUMMARY_POINT_3</li>
                <li>SUMMARY_POINT_4</li>
            </ul>
        </div>

        <div id="lesson-summary" style="display: none;"></div>

        <div class="next-lesson">
            <h3>Urmatoarea lectie</h3>
            <p>NEXT_LESSON_TEASER</p>
            <a href="NEXT_LESSON.html" class="btn-next">Continua →</a>
        </div>
    </section>

</div>

<!-- ═══════════════ SCRIPTS ═══════════════ -->
<script src="DEPTH/assets/js/atomic-learning.js"></script>
<script src="DEPTH/assets/js/practice-simple.js"></script>
<script src="DEPTH/assets/js/lesson-summary.js"></script>
<script src="DEPTH/assets/js/breadcrumb.js"></script>
<script src="DEPTH/assets/js/progress.js"></script>
<script src="DEPTH/assets/js/user-system.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        AtomicLearning.init('LESSON_ID');
        PracticeSimple.init('LESSON_ID');
        LessonSummary.init('LESSON_ID');
        Breadcrumb.init({
            grade: 'clsX',
            gradeName: 'Clasa a X-a',
            module: 'mY-MODULE_SLUG',
            moduleName: 'MODULE_DISPLAY_NAME',
            lesson: 'LESSON_TITLE'
        });
        LearningProgress.init('clsX', 'mY-MODULE_SLUG', 'FILENAME.html');
    });
</script>
</body>
</html>
```

### Template Variables

| Variable | Example | How to derive |
|----------|---------|---------------|
| `DEPTH` | `../../../../assets` | Use `os.path.relpath(assets_dir, lesson_dir)`. **NEVER count `../` manually.** |
| `LESSON_ID` | `cls7-m1-word-lectia3-tabele` | `{grade}-{module}-{filename_without_extension}` |
| `BADGE_TEXT` | `Invatare Atomica` (standard) or per-module name | Keep consistent within module |
| `FILENAME.html` | `lectia3-tabele.html` | Actual filename on disk |
| `data-show-pain` | `true` / `false` | `true` for cls5-6, `false` for cls7-8 unless helpful |

---

## 4. Content Requirements

### Language

- **Romanian** throughout, informal "tu" form
- **ASCII-safe titles:** No diacritics (î, ă, ș, ț) in `<title>` tags or filenames
- **Diacritics IN content:** Use proper ă, â, î, ș, ț in body text
- **Spelling conventions:** "creeaza" (not "creaza"), "obiectul" (not "objectul")
- **Formal class names:** "Clasa a V-a" (not "Clasa 5")

### Content Density Per Atom

| Element | Minimum | Maximum |
|---------|---------|---------|
| Paragraphs | 3 | 8 |
| Words | 80 | 300 |
| Images/diagrams | 0 | 2 |
| Code blocks | 0 | 3 |
| Info/warning/tip boxes | 0 | 2 |
| Quiz questions | 1 | 2 |

### Mandatory Content Elements Per Lesson

| Element | Required | Where |
|---------|----------|-------|
| Goal statement | YES | FRAME section |
| Learning outcomes (3-5) | YES | FRAME section |
| Pain comparison | RECOMMENDED cls5-6 | FRAME section |
| TRY challenge | RECOMMENDED for practical topics | TRY section |
| 4-8 content atoms | YES | ATOMS section |
| 1-2 quiz per atom | YES | data-quiz attribute |
| 3 practice exercises (minim/standard/perf) | YES | PRACTICE section |
| Summary bullet points | YES | REVIEW section |
| Next lesson teaser | YES | REVIEW section |

### Bloom's Taxonomy Progression

Atoms should progress through Bloom's levels within a single lesson:

| Atom position | Target Bloom level | Question type |
|---------------|-------------------|---------------|
| Atom 1-2 | Remember / Understand | "Ce este X?", "Care este diferenta?" |
| Atom 3-4 | Understand / Apply | "Ce se intampla daca?", "Cum ai folosi?" |
| Atom 5-6 | Apply / Analyze | "De ce functioneaza?", "Gaseste greseala" |
| Atom 7-8 | Analyze / Create | Scenario questions, debugging |
| Practice Ex 1 | Apply (minim) | Recall + basic application |
| Practice Ex 2 | Analyze (standard) | Compare, explain, solve |
| Practice Ex 3 | Create (performanta) | Design, extend, teach others |

---

## 5. Quiz & Assessment Specification

### In-Atom Quiz Format (data-quiz JSON)

```json
[{
    "question": "Question text in Romanian with proper diacritics",
    "options": ["Opțiunea A", "Opțiunea B", "Opțiunea C", "Opțiunea D"],
    "correct": "a",
    "hint": "Gândește-te la... (shown after wrong answer)"
}]
```

**Rules:**
- 3-4 options per question (not 2, not 5+)
- `correct` is a **lowercase letter** matching the option position: `"a"` = first, `"b"` = second, `"c"` = third, `"d"` = fourth. The engine converts via `charCodeAt(0) - 97`.
- Options are auto-shuffled by AtomicLearning.js (Fisher-Yates)
- Hint is mandatory — shown after first wrong attempt
- Answer locks after selection (no retry per question, only full lesson reset)
- No `\"` escaped quotes inside JSON — use `&quot;` if needed in strings

### Question Templates by Difficulty Tier

**Minim (recall):**
- MCQ: "Ce este {TERM}?"
- MCQ: "Care dintre urmatoarele este un exemplu de {CONCEPT}?"
- Short: "Scrie o definitie scurta pentru {TERM}."
- Short: "Numeste 1 exemplu de {CONCEPT}."

**Standard (apply):**
- Ordering: "Pune in ordine pasii corecti pentru {TASK}."
- Comparison: "Explica diferenta dintre {A} si {B}."
- MCQ: "Care varianta respecta regula {RULE}?"
- Prediction: "Ce se intampla daca {ACTION}?"

**Performanta (analyze/create):**
- Scenario: "Scenariu: {SCENARIO}. Ce ai face si de ce?"
- Debug: "Gaseste greseala in {BROKEN_STEPS}. Propune fixul."
- Extension: "Extinde {BASE_TASK} cu 2 cerinte suplimentare."
- Teaching: "Explica unui coleg mai mic cum sa faca {TASK} in maxim 3 pasi."

### In-Atom vs Practice Split

| Assessment type | Location | Auto-graded? | Counts toward |
|----------------|----------|-------------|---------------|
| MCQ in atoms | data-quiz JSON | YES | 6 points (quiz score) |
| Practice Exercise 1 | PRACTICE section textarea | NO (teacher grades) | 1 point |
| Practice Exercise 2 | PRACTICE section textarea | NO (teacher grades) | 1 point |
| Practice Exercise 3 | PRACTICE section textarea | NO (teacher grades) | 1 point |

---

## 6. Grading System

### Formula: 1 + 6 + 3 = 10

```
Grade = 1 (din oficiu)
      + 6 × (correct_atoms / total_atoms)
      + 3 × (practice_score / 3)         ← teacher evaluates 0-3
```

- **Minimum grade:** 1 (student opened the page)
- **Quiz-only grade:** max 7 (no practice = max 1 + 6)
- **Full grade:** 10 (perfect quiz + perfect practice)

### JSON Export Structure

LessonSummary.js generates a tamper-evident JSON export:

```json
{
    "lessonId": "cls7-m1-word-lectia3-tabele",
    "studentName": "Popescu Ion",
    "profileId": "student-1",
    "timestamp": "2026-02-17T10:30:00Z",
    "quizScore": { "correct": 5, "total": 6, "percentage": 83 },
    "practiceCompleted": true,
    "grade": 8,
    "checksum": "sha256:abc123..."
}
```

The SHA-256 checksum prevents manual grade editing. Teachers verify by re-computing the hash.

---

## 7. Visual Design Standards

### Theme

| Property | Value |
|----------|-------|
| Background | `#0a0a12` |
| Card background | `#12121a` |
| Text primary | `#e0e0e0` |
| Text secondary | `#a0a0b0` |
| Border | `#2a2a3a` |
| Font family | Inter, system-ui, sans-serif |
| Font size base | 16px |
| Line height | 1.7 |
| Max container width | 900px |

### Per-Grade Accent Colors

| Grade | Primary | Secondary | Usage |
|-------|---------|-----------|-------|
| cls5 | `#3b82f6` (blue) | `#8b5cf6` (purple) | Buttons, links, atom borders |
| cls6 | `#ff9500` (orange) | `#8b5cf6` (purple) | Scratch-themed |
| cls7 | `#10b981` (green) | `#06b6d4` (cyan) | Programming-themed |
| cls8 | `#ef4444` (red) | `#f43f5e` (rose) | C++/database-themed |

### Content Boxes

| Box type | Border color | Icon | Use when |
|----------|-------------|------|----------|
| `.info-box` | blue (`var(--accent)`) | ℹ️ | Important definitions, key facts |
| `.warning-box` | orange (`#f59e0b`) | ⚠️ | Common mistakes, things to avoid |
| `.tip-box` | green (`#10b981`) | 💡 | Shortcuts, pro tips, best practices |
| `.example-box` | purple (`#8b5cf6`) | 📝 | Worked examples |

### Mobile Breakpoints

| Breakpoint | Changes |
|------------|---------|
| `< 768px` | Single column, larger touch targets, stacked pain comparison |
| `< 480px` | Reduced padding, smaller headings, full-width atoms |

**Mandatory:** `overflow-x: hidden` on `html` and `body`. All `<img>` must have `width: 100%; max-width: 100%;`.

---

## 8. JavaScript Architecture

### Script Load Order

```html
<script src="DEPTH/assets/js/atomic-learning.js"></script>
<script src="DEPTH/assets/js/practice-simple.js"></script>
<script src="DEPTH/assets/js/lesson-summary.js"></script>
<script src="DEPTH/assets/js/breadcrumb.js"></script>
<script src="DEPTH/assets/js/progress.js"></script>
<script src="DEPTH/assets/js/user-system.js"></script>
```

### Init Calls (inside DOMContentLoaded)

```javascript
AtomicLearning.init('LESSON_ID');
PracticeSimple.init('LESSON_ID');
LessonSummary.init('LESSON_ID');
Breadcrumb.init({ grade, gradeName, module, moduleName, lesson });
LearningProgress.init('grade', 'module', 'filename.html');
```

### Lesson ID Convention

```
File: content/tic/cls7/m2-word-avansat/lectia3-sectiuni.html
ID:   cls7-m2-word-avansat-lectia3-sectiuni
```

Pattern: `{grade_dir}-{module_dir}-{filename_without_extension}`

### localStorage Keys

| Key pattern | Content |
|-------------|---------|
| `atomic-progress-{profileId}-{lessonId}` | All atom state, shuffled answers, scores |
| `practice-{lessonId}` | Textarea content per exercise |
| `lesson-summary-{lessonId}` | Grade, completion state |

### Events Emitted

| Event | Fired when | Listened by |
|-------|-----------|-------------|
| `atomicProgressSaved` | Atom quiz answered | LessonSummary |
| `allAtomsComplete` | Last atom completed | Practice reveal logic |
| `practiceUpdated` | Practice textarea saved | LessonSummary |

---

## 9. CSS Architecture

### File Structure

```
assets/css/
├── lesson-atomic.css    ← Shared lesson styles (~390 lines after FRAME/TRY/REVIEW additions)
├── mobile-first.css     ← Mobile responsive overrides
├── quiz-gamified.css    ← Standalone quiz styles (quiz files only, not lessons)
├── practice.css         ← Practice section styles
├── scratch-blocks.css   ← Scratch block rendering (cls5-6 only)
└── _deprecated/
    └── lesson-5step.css ← Archived, not used by Format C
```

### CSS Rules for Agents

1. **NEVER write inline `<style>` blocks.** All styles go in `lesson-atomic.css` or a linked file.
2. **NEVER duplicate CSS** that already exists in the shared file.
3. **Use CSS custom properties** (`:root` variables) for any value that varies per grade.
4. **Per-lesson unique styles** (rare): create a small `.css` file in the lesson's directory, linked via `<link>`.
5. **Test at 768px and 480px** breakpoints before declaring done.

---

## 10. Curriculum Compliance

### Legal Basis

| Document | What it governs |
|----------|----------------|
| **OMEN 3393/2017** | Subject content, competencies per grade |
| **OMEC 6106/2020** | Lesson inspection criteria, grading standards |
| **Ordinul 6466/2024** | Digital competency framework (DigCompRo), 6 areas |

### Per-Grade Teaching Sequence (OMEN 3393/2017)

#### Clasa a V-a (36 hours)

| Module | Weeks | Topic | Key Competencies |
|--------|-------|-------|-----------------|
| M1 | 7 | Sisteme de calcul | Hardware, software, ergonomics |
| M2 | 7 | Grafica si internet | Paint, browsers, internet safety |
| M3 | 5-6 | Algoritmi | Flowcharts, pseudocode, sequential |
| M4 | 5-6 | Scratch | Sequential programming, animation |
| M5 | 10 | Proiect final | Integration project + evaluation |

#### Clasa a VI-a (36 hours)

| Module | Weeks | Topic | Key Competencies |
|--------|-------|-------|-----------------|
| M1 | 7 | Prezentari | PowerPoint basics, slides, animation |
| M2 | 7 | Scratch variabile | Variables, lists, operators |
| M3 | 5-6 | Scratch control | If/else, loops, logical operators |
| M4 | 5-6 | Comunicare | Email, attachments, collaboration |
| M5 | 10 | Proiect Scratch | Project + evaluation |

#### Clasa a VII-a (36 hours)

| Module | Weeks | Topic | Key Competencies |
|--------|-------|-------|-----------------|
| M1 | 7 | Word fundamente | Formatting, tables, lists |
| M2 | 7 | Word avansat | Sections, headers, TOC, mail merge |
| M3 | 5-6 | HTML/CSS | Tags, styling, web pages |
| M4 | 5-6 | Colaborare online | Google Docs, collaboration tools |
| M5 | 10 | Proiect web | Web project + evaluation |

#### Clasa a VIII-a (35 hours — ends June 12)

| Module | Weeks | Topic | Key Competencies |
|--------|-------|-------|-----------------|
| M1 | 7 | C++ baze | Variables, I/O, operators |
| M2 | 7 | C++ structuri | If/else, switch, while, for, do-while |
| M3 | 5-6 | C++ functii | Functions, parameters, recursion |
| M4 | 5-6 | Baze de date | Access: tables, relationships, SQL |
| M5 | 10 | Recapitulare | Review + national evaluation prep |

### DigCompRo Areas (Ordinul 6466/2024)

Each lesson should map to at least one DigCompRo area:

1. **Informatii si date** — Browsing, searching, evaluating, managing data
2. **Comunicare si colaborare** — Digital interaction, sharing, citizenship
3. **Creare de continut digital** — Creating content, copyright, programming
4. **Siguranta** — Device protection, personal data, health
5. **Rezolvarea problemelor** — Troubleshooting, creative tool use
6. **Utilizarea responsabila** — Cybersecurity, ethics, digital footprint

### Inspection Readiness (OMEC 6106/2020)

A lesson must demonstrate:
- **Student-centered strategies** (not lecture-only)
- **Individualized tasks** (minim/standard/performanta tiers)
- **Cross-curricular connections** (real-world examples)
- **Appropriate resources** (age-appropriate, relevant)
- **Student work evidence** (practice exercises, JSON export)

---

## 11. Quality Checklist

### Pre-Build (before writing ANY HTML)

- [ ] Identified curriculum position (grade, module, week, competency)
- [ ] Read 2+ existing lessons from same module for consistency
- [ ] Defined 4-8 atom topics that cover the lesson competency
- [ ] Written quiz questions for each atom (before writing content)
- [ ] Defined 3 practice exercises at minim/standard/performanta levels

### Post-Build (after HTML is written)

**Structural:**
- [ ] File is valid HTML (no unclosed tags)
- [ ] ZERO inline `<style>` blocks
- [ ] All 6 scripts present with correct DEPTH
- [ ] All init calls present with correct LESSON_ID
- [ ] LESSON_ID matches `{grade}-{module}-{filename}` pattern
- [ ] `<title>` matches lesson content
- [ ] Grade in title matches folder (`cls5` → "Clasa a V-a")
- [ ] Nav links point to correct prev/next lessons
- [ ] `<div id="lesson-summary" style="display: none;">` present

**Content:**
- [ ] Romanian text with proper diacritics (ă, â, î, ș, ț)
- [ ] 4-8 atoms present, each with content + quiz
- [ ] Every quiz question has a hint
- [ ] Correct answer index matches the actual correct option
- [ ] No `MODEL_ANSWER_REQUIRED`, `TODO`, `TBD`, `FIXME`, `PLACEHOLDER` text
- [ ] Pain comparison topic matches lesson topic (if present)
- [ ] Summary bullets match what atoms actually teach
- [ ] Practice exercises are topic-specific (not generic)

**Technical:**
- [ ] No `\"` escaped quotes inside onclick or data attributes
- [ ] No single-quotes wrapping strings that contain single quotes
- [ ] `data-quiz` JSON is valid (test with `JSON.parse()`)
- [ ] File size > 15KB (skeleton check) and > 25KB (thin content check)
- [ ] All image tags have `width: 100%; max-width: 100%`

**Curriculum:**
- [ ] Lesson maps to a specific OMEN 3393/2017 competency
- [ ] Content matches the grade-appropriate difficulty level
- [ ] Practice exercises explicitly labeled minim/standard/performanta

### Automated Verification

```bash
cd C:\AI\Projects\LearningHub

# Full site audit (9 categories, all 346 files)
python tools/site_audit.py

# CRITICALs only (fast, used in pre-commit hook)
python tools/site_audit.py --quick

# LHQA 7-pass quality assurance (if lesson has JSON blueprint)
python tools/lhqa/orchestrator.py LESSON_CODE
```

---

## 12. Known Traps & Anti-Patterns

### Critical (will break student experience silently)

| # | Trap | Symptom | Fix |
|---|------|---------|-----|
| 1 | Template literal quote nesting | ALL buttons stop working, no console error | Use backtick strings inside `${}` |
| 2 | `\"` in onclick attributes | Option renders but click does nothing | Use `&quot;` for HTML attribute quotes |
| 3 | Wrong DEPTH in script/CSS paths | 404 on all assets, blank page | Use `os.path.relpath()`, NEVER count `../` manually |
| 4 | `LessonSummary` div without `display: none` | Grade "1/10" shown before answering | Always add `style="display: none;"` |
| 5 | `data-quiz` invalid JSON | Atom renders with no quiz, no gating | Validate JSON before embedding |

### Major (causes confusion or data loss)

| # | Trap | Symptom | Fix |
|---|------|---------|-----|
| 6 | Wrong LESSON_ID in init calls | Progress not saved or loads another lesson's data | Derive ID from filepath, verify consistency |
| 7 | Mismatched totalQuestions count | Grade calculation wrong | Count actual atoms, pass correct number |
| 8 | Practice container class wrong | Textareas never appear | Use `.practice-section` or `.practice-exercise` |
| 9 | Inline CSS overriding shared CSS | Inconsistent look, maintenance nightmare | ZERO inline CSS policy |
| 10 | Auto-fixer with manual depth counting | 206+ broken asset refs in one batch | ALWAYS use `os.path.relpath()` |

### Process Anti-Patterns

| Anti-pattern | Why it's bad | Do instead |
|---|---|---|
| `Write()` on 1200-line HTML | Fills context with 2400-line diff, crashes session | Use `Edit()` for surgical changes. Multiple small edits, not one rewrite. |
| Copy-pasting quiz questions from another lesson | Questions don't match content | Write questions AFTER writing the atom content |
| "100% pass" without clicking | Structural pass ≠ student-ready | ALWAYS simulate student clickpath on 3+ lessons |
| Running fixer then declaring victory | Fixer may introduce new bugs | Re-run `site_audit.py` AFTER every batch fix |
| Generating all atoms at once without review | Content quality degrades at scale | Generate 2-3 atoms, review, adjust tone, continue |

---

## 13. Migration Guide

### Converting 5-Step Lessons to Format C

For each cls5/cls6 5-Step lesson:

**Step 1: Extract sections**
```
GOAL section      → FRAME section (goal + outcomes)
Pain comparison   → FRAME section (pain-comparison div)
TRY section       → TRY section (keep as-is, wrap in .try-section)
LEARN section     → Split into atoms (each concept card = 1 atom)
TEST questions    → Distribute into atoms (assign each question to its concept's atom)
COMPLETE section  → REVIEW section (summary + next lesson)
PRACTICE          → Keep as-is, ensure .practice-exercise class
```

**Step 2: Convert quiz**
```
Old: <div class="quiz-question" id="q1">
       <p>Question text</p>
       <div class="option" onclick="selectOption(this, 'q1', true, 'Explicatie')">A) Answer</div>
       <div class="option" onclick="selectOption(this, 'q1', false, 'Explicatie')">B) Wrong</div>
     </div>

New: <div class="atom" id="atom-3"
          data-quiz='[{
              "question": "Question text",
              "options": ["Answer", "Wrong"],
              "correct": "a",
              "hint": "Explicatie"
          }]'>
       <h2 class="atom-title">3. Concept Title</h2>
       <p>Content that was in the LEARN concept card...</p>
     </div>
```

**Step 3: Replace scripts**
```
REMOVE: quiz-bridge.js, practice-gate.js
REMOVE: selectOption(), goToStep(), checkAllAnswers() function definitions
REPLACE init: QuizBridge.init() → AtomicLearning.init()
```

**Step 4: Delete all inline CSS**
```
REMOVE: entire <style>...</style> block (typically 500-1055 lines)
KEEP: <link rel="stylesheet" href="DEPTH/assets/css/lesson-atomic.css">
```

**Step 5: Verify**
```bash
python tools/site_audit.py --quick   # Zero CRITICALs
# Then manually click through: FRAME → TRY → Atoms 1-N → Practice → Review
```

### Converting Atomic Lessons to Format C

For each cls7/cls8 Atomic lesson (lighter migration):

1. **ADD** FRAME section before atoms (goal + learning outcomes, optional pain comparison)
2. **ADD** REVIEW section after practice (summary bullets + next lesson teaser)
3. **ADD** TRY section if lesson is practical (optional)
4. **VERIFY** practice exercises have `data-level` attributes (minim/standard/performanta)
5. **REMOVE** any remaining inline `<style>` blocks
6. **RUN** audit to verify

### Estimated Effort

| Task | Files | Per-file effort | Total |
|------|-------|----------------|-------|
| Extend `lesson-atomic.css` with FRAME/TRY/REVIEW styles | 1 | 2-4 hours | 4 hours |
| Create Format C reference implementation | 1 | 3-5 hours | 5 hours |
| Migrate Atomic lessons (cls7-8) | ~186 | 15-30 min | 46-93 hours |
| Migrate 5-Step lessons (cls5-6) | ~159 | 45-90 min | 119-238 hours |
| Deprecate legacy assets | 3 files | 1 hour | 1 hour |
| Update LHQA checks for Format C | 1 | 2-3 hours | 3 hours |

### Priority Order

1. **First:** Extend CSS + create reference implementation
2. **Second:** Migrate cls7-8 Atomic lessons (lower effort, higher student count)
3. **Third:** Migrate cls5-6 5-Step lessons (higher effort, but format is more broken)
4. **Last:** Deprecate legacy files, update tooling

---

## Appendix A: Format Evaluation Evidence

### Scoring Detail

| Dimension | 5-Step | Atomic | Evidence |
|-----------|--------|--------|----------|
| Bloom's alignment | 7 | 6 | 5-Step TRY = Bloom level 4 (Analyze) early; Atomic stuck at levels 1-2 |
| Active learning | 8 | 5 | TRY section is genuine hands-on; Atomic = read + click MCQ |
| Scaffolding | 5 | 8 | Atomic gating enforces mastery; 5-Step LEARN dumps all concepts at once |
| Formative assessment | 4 | 9 | Atomic quiz inside atom; 5-Step quiz bolted on at end via QuizBridge |
| Differentiation | 5 | 4 | 5-Step has TRY hints + bonus challenge; Atomic has no adaptive path |
| Motivation | 7 | 5 | 5-Step has pain comparison + celebration; Atomic has only progress bar |
| Cognitive load | 6 | 8 | Atomic: 1 concept/screen; 5-Step LEARN: 450 lines of HTML in one scroll |
| Navigation clarity | 8 | 6 | 5-Step: 5 labeled steps always visible; Atomic: % bar only |
| Code maintainability | 3 | 8 | 5-Step: 1055 lines inline CSS per lesson; Atomic: 0 inline CSS |
| Bug surface area | 3 | 6 | 5-Step: 3 scripts wrapping same goToStep(); Atomic: 1 centralized engine |
| Scales with complexity | 3 | 8 | Complex topic = more atoms (scales); 5-Step LEARN section becomes unwieldy |

### Key Files Analyzed

| File | Lines | Format | Notable |
|------|-------|--------|---------|
| `cls5/m1-sisteme/lectia1-calculator.html` | 2125 | 5-Step | 1055 lines inline CSS |
| `cls5/m1-sisteme/lectia2-componente.html` | ~1800 | 5-Step | Similar CSS duplication |
| `cls7/m1-word-fundamente/lectia1-interfata-word.html` | 796 | Atomic | 0 inline CSS |
| `cls7/m1-word-fundamente/lectia2-formatare-text.html` | 557 | Atomic | 7+ atoms, clean |
| `assets/css/lesson-5step.css` | 823 | — | Shared but overridden by every lesson |
| `assets/css/lesson-atomic.css` | 240 | — | Shared, no overrides needed |
| `assets/js/quiz-bridge.js` | ~700 | — | Retrofit bridge, 3 function hooks |
| `assets/js/atomic-learning.js` | ~1150 | — | Self-contained engine |

---

## Appendix B: Question Templates by Tier

See `rules/question_templates.json` for the full machine-readable schema.

### Tier: Minim (Bloom 1-2: Remember, Understand)

| Type | Template | Expected answer |
|------|----------|----------------|
| MCQ | Ce este {TERM}? | Select correct definition |
| MCQ | Care dintre urmatoarele este un exemplu de {CONCEPT}? | Identify example |
| Short | Scrie o definitie scurta pentru {TERM}. | 1-2 sentences |
| Short | Numeste 1 exemplu de {CONCEPT}. | Single example |

### Tier: Standard (Bloom 3-4: Apply, Analyze)

| Type | Template | Expected answer |
|------|----------|----------------|
| Ordering | Pune in ordine pasii corecti pentru {TASK}. | Correct sequence |
| Compare | Explica diferenta dintre {A} si {B}. | 1-2 sentences |
| MCQ | Care varianta respecta regula {RULE}? | Select compliant option |
| Prediction | Ce se intampla daca {ACTION}? | Select outcome |

### Tier: Performanta (Bloom 5-6: Evaluate, Create)

| Type | Template | Expected answer |
|------|----------|----------------|
| Scenario | Scenariu: {SCENARIO}. Ce ai face si de ce? | Reasoned response |
| Debug | Gaseste greseala in {BROKEN_STEPS}. Propune fixul. | Error + fix |
| Extension | Extinde {BASE_TASK} cu 2 cerinte suplimentare. | Creative extension |
| Teaching | Explica unui coleg mai mic cum sa faca {TASK} in maxim 3 pasi. | Simplified explanation |

---

## Appendix C: Per-Grade Curriculum Map

Full week-by-week sequences are in `OFFICIAL_TEACHING_SEQUENCE.md`.

### Quick Reference: Lessons Per Module

| Grade | M1 | M2 | M3 | M4 | M5 | Total |
|-------|----|----|----|----|-----|-------|
| cls5 | 7 lessons | 7 lessons | 5-6 lessons | 5-6 lessons | 10 lessons | ~35 |
| cls6 | 7 lessons | 7 lessons | 5-6 lessons | 5-6 lessons | 10 lessons | ~35 |
| cls7 | 7 lessons | 7 lessons | 5-6 lessons | 5-6 lessons | 10 lessons | ~35 |
| cls8 | 7 lessons | 7 lessons | 5-6 lessons | 5-6 lessons | 10 lessons | ~35 |

Each "lesson" = 1 teaching hour (50 minutes). The lesson HTML covers one hour's content.

---

*Document maintained by John (CTO). Last updated: 2026-02-17.*
*For questions: run `/john` in any agent session.*
