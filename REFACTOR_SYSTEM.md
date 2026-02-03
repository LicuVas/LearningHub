# LearningHub Closed-Loop Feedback System

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR (Main Agent)                        │
│  - Receives task results from all agents                            │
│  - Validates against audit criteria                                 │
│  - Routes feedback back to relevant agents                          │
│  - Tracks completion state                                          │
└─────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  RESEARCH   │    │   EVALUATOR     │    │   BUILDER       │
│   AGENT     │    │    AGENT        │    │    AGENT        │
│             │    │                 │    │                 │
│ - Curriculum│    │ - Audit check   │    │ - HTML/CSS      │
│ - Legislation│   │ - Quality score │    │ - Content gen   │
│ - Calendar  │    │ - Gap analysis  │    │ - Integration   │
│ - Standards │    │ - Compliance    │    │ - Testing       │
└─────────────┘    └─────────────────┘    └─────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │  FEEDBACK LOOP  │
                    │                 │
                    │ 1. Execute task │
                    │ 2. Validate     │
                    │ 3. Report gaps  │
                    │ 4. Iterate      │
                    └─────────────────┘
```

## Module Breakdown

### MODULE 1: Research & Data Collection
**Agent:** `research-agent`
**Purpose:** Gather all Romanian education system information

**Tasks:**
- [ ] R1.1: Extract curriculum from OMEN 3393/2017, OMENCS 3590/2016
- [ ] R1.2: Map school calendar 2025-2026 (vacations, semesters)
- [ ] R1.3: Document official teaching methodology for ICT
- [ ] R1.4: List competencies per grade (V-VIII) from official sources
- [ ] R1.5: Identify audit criteria from OMEC 6106/2020
- [ ] R1.6: Search existing KB for reusable materials
- [ ] R1.7: Catalog existing lessons in `data/` folder

**Output:** `research_findings.json`

---

### MODULE 2: Content Evaluation & Gap Analysis
**Agent:** `evaluator-agent`
**Purpose:** Assess existing materials against official standards

**Tasks:**
- [ ] E2.1: Audit existing curriculum.json against official OMEN
- [ ] E2.2: Score existing materials (completeness, accuracy)
- [ ] E2.3: Identify missing modules/lessons
- [ ] E2.4: Check chronological order compliance
- [ ] E2.5: Verify "Sunt în clasa..." sections match standards
- [ ] E2.6: Generate compliance report

**Output:** `evaluation_report.json`

---

### MODULE 3: Content Restructuring
**Agent:** `restructure-agent`
**Purpose:** Reorganize content for official compliance

**Tasks:**
- [ ] S3.1: Reorder "Sunt în clasa..." to match OMEN modules
- [ ] S3.2: Add missing metadata (OMEN references, week ranges)
- [ ] S3.3: Create standard lesson template
- [ ] S3.4: Map prerequisites and enables for each lesson
- [ ] S3.5: Generate navigation structure

**Output:** Updated `curriculum.json`, site structure

---

### MODULE 4: Content Enhancement
**Agent:** `builder-agent`
**Purpose:** Build/improve actual lesson content

**Tasks:**
- [ ] B4.1: Create missing lesson HTML files
- [ ] B4.2: Add GOAL-TRY-LEARN-TEST structure to all lessons
- [ ] B4.3: Generate quizzes with AI grading
- [ ] B4.4: Add track variants (support/core/extend)
- [ ] B4.5: Integrate existing HackMD materials
- [ ] B4.6: Add breadcrumbs and progress tracking

**Output:** Complete lesson files

---

### MODULE 5: Quality Assurance & Testing
**Agent:** `qa-agent`
**Purpose:** Validate all changes before deployment

**Tasks:**
- [ ] Q5.1: Validate all HTML/CSS
- [ ] Q5.2: Test all quizzes work
- [ ] Q5.3: Verify navigation paths
- [ ] Q5.4: Check mobile responsiveness
- [ ] Q5.5: Audit accessibility (WCAG)
- [ ] Q5.6: Final compliance check

**Output:** `qa_report.json`

---

## Feedback Loop Protocol

```
FOR each module:
    1. Agent executes tasks
    2. Agent outputs results to shared JSON
    3. Orchestrator validates against criteria
    4. IF gaps found:
        - Route specific feedback to agent
        - Agent iterates
    5. UNTIL validation passes
    6. Mark module complete
    7. Trigger dependent modules
```

## Validation Criteria

### Audit-Ready Checklist
- [ ] All lessons reference official OMEN/OMENCS
- [ ] Module order matches official curriculum
- [ ] Week ranges align with school calendar
- [ ] Competencies listed per official standards
- [ ] Assessment criteria documented
- [ ] Track differentiation available

### Technical Checklist
- [ ] All pages load under 3s
- [ ] Mobile responsive
- [ ] Quizzes functional
- [ ] Progress persistence works
- [ ] No broken links

## File Structure

```
LearningHub/
├── data/
│   ├── curriculum.json          # Master curriculum data
│   ├── research_findings.json   # Research output
│   ├── evaluation_report.json   # Gap analysis
│   └── qa_report.json           # QA results
├── hub/
│   ├── index.html               # Main portal
│   └── sunt-in-clasa/           # Official curriculum path
│       ├── clasa-5/
│       ├── clasa-6/
│       ├── clasa-7/
│       └── clasa-8/
├── learn/                       # Intuitive learning path
│   ├── by-concept/
│   ├── by-goal/
│   └── by-project/
└── tools/
    └── *.py                     # Build/validation tools
```

## Agent Communication Protocol

```json
{
  "agent_id": "research-agent",
  "task_id": "R1.1",
  "status": "complete|in_progress|blocked|failed",
  "output": { ... },
  "feedback_needed": [],
  "blocks": [],
  "blocked_by": []
}
```

## Success Criteria

1. **Official Audit**: Pass ISJ inspection criteria (OMEC 6106/2020)
2. **Self-Sufficiency**: Site works offline, minimal external deps
3. **Curriculum Compliance**: 100% match to OMEN modules
4. **Student Usability**: Clear navigation, progress tracking
5. **Teacher Utility**: Exportable reports, assessment data
