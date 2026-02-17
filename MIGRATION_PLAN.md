# LearningHub Format C Migration Plan

> **Status:** ACTIVE
> **Owner:** John (CTO)
> **Target:** 100% Format C compliance across all 178 lesson files + 120 quiz cleanups
> **Created:** 2026-02-17
> **Spec:** LESSON_SPECIFICATION.md (authoritative)

---

## Current State (2026-02-17)

| Category | Files | Format | Migration |
|----------|-------|--------|-----------|
| 5-Step lessons | 119 | goToStep + inline CSS | HEAVY |
| Atomic lessons | 59 | class="atom" + data-quiz | LIGHT |
| Quiz pages | 120 | Standalone, various | CSS CLEANUP |
| Index pages | 36 | Landing pages | SKIP |
| Presentations | 5 | Slide decks | SKIP |
| **Total needing work** | **298** | | |

Audit baseline: 0 CRITICAL, 6 WARNING, 7062 INFO
Inline `<style>` blocks: 296 files (87%)

---

## Phase 0: Foundation

**Goal:** Reference implementation + CSS ready
**Status:** NOT STARTED

- [ ] Extend `lesson-atomic.css` with FRAME/TRY/REVIEW styles (~150 lines)
- [ ] Hand-build reference Format C lesson (cls7/m1-word-fundamente/lectia1)
- [ ] Validate: browser clickthrough, LHQA, site_audit
- [ ] Git commit: "feat(format-c): reference implementation + CSS"

**Exit:** One lesson fully Format C compliant. CSS handles all sections.

---

## Phase 1: Migration Scripts

**Goal:** Automated conversion tools
**Status:** NOT STARTED

- [ ] Build `tools/migrate_atomic_to_c.py`
  - Parse HTML (BeautifulSoup)
  - Inject FRAME section (extract from existing content)
  - Inject REVIEW section (summary + next lesson)
  - Strip inline `<style>`
  - Fix scripts (6 scripts, correct order)
  - Fix DEPTH paths (os.path.relpath)
  - Validate data-quiz JSON
  - --dry-run, --single, --grade modes
- [ ] Build `tools/migrate_5step_to_c.py`
  - Extract GOAL → FRAME
  - Extract pain comparison → FRAME
  - Extract TRY → TRY section
  - Split LEARN into atoms (concept cards → atoms)
  - Redistribute quiz Qs into atom data-quiz
  - Extract COMPLETE → REVIEW
  - Remove ALL inline CSS
  - Replace scripts + init calls
  - Flag ambiguous splits with <!-- MANUAL_REVIEW -->
- [ ] Build `tools/cleanup_quiz_css.py`
  - Strip inline CSS from quiz files
  - Link to quiz-gamified.css
  - Preserve quiz-engine.js functionality
- [ ] Test each script on 3 files
- [ ] Git commit: "feat(migration): automated Format C conversion tools"

**Exit:** Scripts convert test files with 0 CRITICALs.

---

## Phase 2: Migrate Atomic Lessons (59 files)

**Priority:** cls7 (28) → cls8 (9) → cls5 (18) → cls6 (4)
**Status:** NOT STARTED

- [ ] cls7: 28 Atomic → Format C
- [ ] cls8: 9 Atomic → Format C
- [ ] cls5: 18 Atomic → Format C
- [ ] cls6: 4 Atomic → Format C
- [ ] Site audit after each grade: 0 CRITICAL
- [ ] Manual spot-check 3 files per grade in browser
- [ ] Git commit per grade

**Exit:** All 59 Atomic lessons are Format C compliant.

---

## Phase 3: Migrate 5-Step Lessons (119 files)

**Priority:** cls6 (25) → cls5 (31) → cls7 (27) → cls8 (36)
**Status:** NOT STARTED

- [ ] cls6: 25 5-Step → Format C (smallest, script validation set)
- [ ] cls5: 31 5-Step → Format C
- [ ] cls7: 27 5-Step → Format C
- [ ] cls8: 36 5-Step → Format C
- [ ] Manual review of flagged files (<!-- MANUAL_REVIEW -->)
- [ ] LHQA on 5 random files per grade
- [ ] Git commit per grade

**Exit:** All 119 5-Step lessons are Format C compliant. Zero <!-- MANUAL_REVIEW --> remaining.

---

## Phase 4: Quiz & CSS Cleanup (120 files)

**Status:** NOT STARTED

- [ ] Run cleanup_quiz_css.py on all quiz files
- [ ] Verify quiz functionality (quiz-engine.js)
- [ ] Site audit: 0 CRITICAL
- [ ] Git commit: "refactor(quiz): standardize CSS across all quiz files"

**Exit:** All quiz files use shared CSS. Zero inline `<style>` blocks site-wide.

---

## Phase 5: Lock Down

**Status:** NOT STARTED

- [ ] Deprecate: lesson-5step.css → _deprecated/
- [ ] Deprecate: quiz-bridge.js → _deprecated/
- [ ] Deprecate: practice-gate.js → _deprecated/
- [ ] Full audit: 0 CRITICAL, 0 WARNING
- [ ] Add Format C checks to site_audit.py (FRAME present, REVIEW present, zero inline CSS)
- [ ] Pre-commit hook: block on CRITICAL
- [ ] Final LHQA on 10 random lessons
- [ ] Update: .init.md, README.md, AGENT_CHECKLIST.md → "migration complete"
- [ ] Git commit: "feat(format-c): migration complete, legacy deprecated"

**Exit:** Site is 100% Format C. Legacy formats archived. Guardrails prevent regression.

---

## Success Criteria (Definition of Done)

1. `python tools/site_audit.py` → 0 CRITICAL, 0 WARNING
2. Zero inline `<style>` blocks in any lesson or quiz file
3. Every lesson has: FRAME + ATOMS + PRACTICE + REVIEW sections
4. Every lesson uses the 6-script stack (atomic-learning, practice-simple, lesson-summary, breadcrumb, progress, user-system)
5. Every lesson ID follows `{grade}-{module}-{filename}` convention
6. LHQA passes on 10 random lessons across all grades
7. Legacy CSS/JS files archived in `_deprecated/`
8. Documentation updated to reflect completed migration

---

*Plan authored by John (CTO). Execution starts Phase 0.*
