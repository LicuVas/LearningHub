# LearningHub Agent Checklist

> **Written by John (CTO) — Feb 2026**
> Based on 4 phases of fixes, 831+ code fixes, and 1 humbling manual test that caught what automation missed.

This is the definitive checklist for any agent working on this site. Read it before touching any file.

---

## Architecture Overview

- **189 lesson files** across 4 grades: `content/tic/cls5/`, `cls6/`, `cls7/`, `cls8/`
- **Two template types:**
  - **5-step format** (cls5, some cls6): GOAL → TRY → LEARN → TEST → PRACTICE
    - Uses: `QuizBridge.init()`, inline `selectOption()`, `goToStep()`
    - Practice: `<section class="practice-section" id="practice">`
  - **Atomic format** (cls7, cls8, extras): Progressive atoms with embedded quizzes
    - Uses: `AtomicLearning.init()`, `AdvancedPractice.init()`
    - Practice: `<div class="practice-advanced" id="practice-advanced">`
- **Shared JS** (in `assets/js/`): quiz-bridge.js, practice-simple.js, lesson-summary.js, breadcrumb.js, progress.js, user-system.js, atomic-learning.js
- **Grading**: 1 (din oficiu) + 6 (quiz) + 3 (practice) = 10 max
- **Hosting**: Cloudflare Pages at `learninghub-8z6.pages.dev`, GitHub at `licuvas.github.io/LearningHub`

---

## TIER 1: STRUCTURAL CHECKS (Plumbing)

Run these with automated scripts. They catch wiring issues but NOT student experience issues.

### 1.1 Navigation Links
- [ ] First lesson's "prev" link → `index.html` (not another lesson)
- [ ] Last lesson's "next" link → `index.html` (not another lesson)
- [ ] Middle lessons link to correct prev/next by filename in directory order
- [ ] No lesson has BOTH nav links pointing to `index.html`

### 1.2 Script Tags
Every lesson file MUST include these scripts (in order):
```html
<script src="[depth]/assets/js/quiz-bridge.js"></script>
<!-- OR atomic-learning.js for atomic format -->
<script src="[depth]/assets/js/practice-simple.js"></script>
<script src="[depth]/assets/js/lesson-summary.js"></script>
<script src="[depth]/assets/js/breadcrumb.js"></script>
<script src="[depth]/assets/js/progress.js"></script>
<script src="[depth]/assets/js/user-system.js"></script>
```
- [ ] All 6 (or 7) scripts present
- [ ] `[depth]` matches actual folder depth (e.g., `../../../../assets/js/` for 4 levels deep)
- [ ] Use `os.path.relpath()` to calculate depth — NEVER count manually (KB: "Auto-fixer path regression caused 206 broken asset refs")

### 1.3 Init Calls
- [ ] `QuizBridge.init('id', { totalQuestions: N })` OR `AtomicLearning.init('id', {...})`
- [ ] `PracticeSimple.init('id')` — present in every file that has practice exercises
- [ ] `LessonSummary.init('id')`
- [ ] `Breadcrumb.init({grade, gradeName, module, moduleName, lesson})`
- [ ] `LearningProgress.init('grade', 'module', 'filename.html')`

### 1.4 Module IDs
The lesson ID must match the file path:
```
File: content/tic/cls7/m2-word-avansat/lectia3-sectiuni.html
ID:   cls7-m2-word-avansat-lectia3-sectiuni
```
- [ ] ID in QuizBridge/AtomicLearning init matches path-derived ID
- [ ] ID in PracticeSimple init matches
- [ ] ID in LessonSummary init matches
- [ ] localStorage keys use correct module name (not a copy-paste error from another module)

### 1.5 Quiz Question Count
- [ ] `totalQuestions` parameter matches actual number of `.quiz-question` divs in the HTML
- [ ] If using atomic format, verify atom count matches

### 1.6 Function Definitions
- [ ] `selectOption()` defined (in 5-step format files)
- [ ] `goToStep()` defined (in 5-step format files)
- [ ] `checkAllAnswers()` defined (in 5-step format files)
- [ ] `toggleHint()` / `togglePracticeHint()` defined if hint buttons exist
- [ ] `checkSynthesis()` defined if synthesis exercises exist
- [ ] `checkScenario()` defined if scenario exercises exist
- [ ] `restartLesson()` defined if restart button exists

---

## TIER 2: FUNCTIONAL CHECKS (Student Clickpath)

**THIS IS WHERE AUTOMATED INSPECTION FAILED.** These require actually simulating what a student does.

### 2.1 Quiz Options Actually Clickable
- [ ] **NO escaped quotes in onclick attributes**: `\"` is JS escape, NOT HTML escape. Use `&quot;` instead.
  - Bad: `onclick="selectOption(this, 'q5', true, 'text \"quoted\" text')"`
  - Good: `onclick="selectOption(this, 'q5', true, 'text &quot;quoted&quot; text')"`
  - Check: `grep -r '\\"' content/tic/**/*.html` in onclick context
- [ ] Every quiz option's onclick handler has valid JavaScript syntax
- [ ] The correct answer option has `true` as the 3rd parameter
- [ ] Wrong answer options have `false` as the 3rd parameter
- [ ] After clicking an option, feedback div shows with correct ID (`qN-feedback`)

### 2.2 Practice Section Has Input Areas
- [ ] PracticeSimple.js finds the container — it accepts BOTH:
  - `.practice-advanced, #practice-advanced` (atomic format)
  - `.practice-section, #practice` (5-step format)
- [ ] Each `.practice-exercise` div gets a textarea injected by PracticeSimple
- [ ] Textareas are editable (not inside a `<code>` or read-only div)
- [ ] Save button works and shows "Salvat" confirmation
- [ ] Character count updates on typing

### 2.3 Lesson Summary NOT Visible Before Answering
- [ ] `<div id="lesson-summary" style="display: none;">` starts hidden
- [ ] Summary only appears after at least 1 quiz question answered
- [ ] Summary shows correct grade based on actual answers, not "Nota: 1"

### 2.4 Step Navigation Works (5-step format)
- [ ] "Sa incepem!" button in GOAL → shows TRY section
- [ ] "Continua" in TRY → shows LEARN section
- [ ] "Verifica" in LEARN → shows TEST section
- [ ] After passing quiz → shows COMPLETE section
- [ ] Progress bar updates at each step
- [ ] Only the active section is visible (`class="section active"`)

### 2.5 Content Quality
- [ ] Pain scenario (FARA/CU) matches the actual lesson topic
- [ ] Quiz questions are about the lesson topic (not copy-pasted from another lesson)
- [ ] Practice exercises are topic-relevant (not placeholders like "Exercitiu generativ")
- [ ] No typos in Romanian text (common: "Scenriu"→"Scenariu", "altsel"→"altfel")
- [ ] `<title>` tag matches the lesson content
- [ ] Grade in title matches folder (cls5 → "Clasa a V-a", etc.)

---

## TIER 3: SYSTEMIC CHECKS (Cross-File Consistency)

### 3.1 localStorage Key Consistency
Keys must use the correct module name from the file path:
```
File: cls5/m1-sisteme/lectia1-calculator.html
Keys: quiz-bridge-cls5-m1-sisteme-lectia1-calculator
      practice-cls5-m1-sisteme-lectia1-calculator
      lesson-summary-cls5-m1-sisteme-lectia1-calculator
```
- [ ] No key uses a wrong module name (e.g., "m2-web" when file is in "m4-html-css")
- [ ] downloadProgress filename uses correct module
- [ ] Run: `tools/fix_storage_keys.py` (dry-run first)

### 3.2 Index Pages
- [ ] Every module folder has an `index.html`
- [ ] Index lists all lessons in correct order
- [ ] Lesson links use actual filenames (not conceptual names)
- [ ] Quiz links in index match actual quiz filenames

### 3.3 Asset Paths
- [ ] All `<script src="...">` paths resolve to existing files
- [ ] All `<link href="...">` paths resolve to existing files
- [ ] Font imports use HTTPS (Google Fonts CDN)
- [ ] No hardcoded absolute paths to local filesystem

---

## TIER 4: DEPLOYMENT CHECKS

### 4.1 Pre-Deploy
- [ ] `git status` shows only intended changes
- [ ] No `.env`, credentials, or personal data in staged files
- [ ] Run a sample of 12 random lessons through Tier 1 + Tier 2 checks

### 4.2 Post-Deploy
- [ ] Hard-refresh the live URL (Ctrl+Shift+R)
- [ ] Check that JS files contain the new code (CDN cache can serve stale)
- [ ] Manually click through 1 full lesson: GOAL → TRY → LEARN → TEST → PRACTICE
- [ ] Verify quiz options are clickable
- [ ] Verify practice textareas appear
- [ ] Verify summary doesn't show until quiz is answered

---

## TOOLS AVAILABLE

| Tool | Purpose |
|------|---------|
| `tools/phase1_fixer.py` | Automated fixes: nav links, scripts, IDs, functions, inits |
| `tools/fix_storage_keys.py` | Fix localStorage key mismatches |
| `tools/fix_escaped_quotes.py` | Fix `\"` → `&quot;` in onclick attributes |
| `tools/fix_baze_date_practice.py` | Replace placeholder practices in cls7/extra-baze-date |
| `tools/check_practice_containers.py` | Audit practice container types across all files |
| `tools/auto_fixer.py` | Original fixer (JS order, missing divs, nav depth) |

---

## KNOWN TRAPS

1. **`\"` in onclick attributes breaks the handler silently.** The browser stops parsing at the `"`, the rest becomes garbage HTML attributes. The option renders but clicking does nothing. NO JavaScript error. NO visual indication. Only discovered by actually clicking.

2. **PracticeSimple looks for specific container classes.** If HTML uses `practice-section` but JS looks for `practice-advanced`, textareas never appear. Students see exercises with no way to answer.

3. **LessonSummary runs on init.** It calculates grade immediately. With 0 answers, grade = 1 (din oficiu only). If the summary div exists and isn't guarded, students see "Nota: 1" before answering anything.

4. **Path depth changes break all asset refs.** Moving a file one level deeper/shallower breaks every `<script src>` and `<link href>`. Always use `os.path.relpath()` in fixers.

5. **Automated inspection catches plumbing, not experience.** You can have 100% pass on structural checks and still have a completely broken student experience. ALWAYS test the clickpath manually on at least 3 random lessons after any batch fix.

6. **CDN caching.** After deploying, Cloudflare/GitHub Pages may serve stale JS files for several minutes. Always hard-refresh (Ctrl+Shift+R) when verifying.

7. **Two template types require different checks.** 5-step format has `selectOption()`, `goToStep()`, `checkAllAnswers()`. Atomic format has `AtomicLearning.init()` with atom configs. Don't apply 5-step fixes to atomic files or vice versa.

---

## INSPECTION PROTOCOL (for QA agents)

When asked to "inspect" or "verify" lessons:

1. **Pick 12 random lessons** (3 per grade, from different modules)
2. **Run Tier 1** (structural) — all automated, grep/regex based
3. **Run Tier 2** (functional) — simulate student actions:
   - Read the onclick attributes CHARACTER BY CHARACTER for quote issues
   - Check if practice container class matches what PracticeSimple expects
   - Verify lesson-summary div has `display: none` initial state
   - Check that pain scenario content matches `<title>` topic
4. **Report format:**
   ```
   FILE: relative/path.html
   TIER 1: PASS/FAIL (details)
   TIER 2: PASS/FAIL (details)
   VERDICT: PASS / MINOR (cosmetic) / FAIL (student-blocking)
   ```
5. **NEVER report 100% unless you tested clicking.** Structural pass ≠ student-ready.
