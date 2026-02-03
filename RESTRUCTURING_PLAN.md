# LearningHub Restructuring Plan

> Generated: 2026-02-03 | Status: Ready for Implementation

## Executive Summary

**Current State:** 12.5% complete (18/144 lessons)
**Target State:** 100% curriculum coverage, audit-ready
**Gap:** 126 lessons needed across 4 grades

### Key Metrics

| Grade | Current | Target | Gap | Priority |
|-------|---------|--------|-----|----------|
| V     | 7       | 36     | 29  | High     |
| VI    | 4       | 36     | 32  | High     |
| VII   | 4       | 36     | 32  | Medium   |
| VIII  | 3       | 36     | 33  | Medium   |

---

## Phase 1: Critical Fixes (Week 1)

### 1.1 Fix Existing Content Issues
Per KB audit reports:
- [ ] Fix quiz ID mismatches (Atom 2 labeled as "atom-3-q0")
- [ ] Align Atom 1 quiz content with actual atom content in m1-sisteme
- [ ] Add missing Atom 3 in m4-siguranta lessons
- [ ] Fix title metadata inconsistencies

### 1.2 Add Module Status Tracking
- [ ] Update curriculum.json with status fields for all 20 modules
- [ ] Implement progress tracking hooks

---

## Phase 2: Module Completion by Priority

### CRITICAL: Missing Modules (Zero Content)

| Module | Grade | Topic | Lessons Needed |
|--------|-------|-------|----------------|
| V-M5   | V     | Integrare și proiect | 8 |
| VI-M5  | VI    | Proiect integrat | 8 |
| VII-M5 | VII   | Proiect integrat | 8 |
| VIII-M2| VIII  | Structuri de date | 7 |
| VIII-M3| VIII  | Baze de date - SQL | 7 |

**Total: 38 new lessons**

### HIGH: Incomplete Modules (1-4 lessons exist)

**Grade V (29 lessons needed):**
- V-M1: Introducere în sisteme de calcul (4→7, need 3)
- V-M2: Aplicații birotice (1→7, need 6)
- V-M3: Procesare de text/Word (1→7, need 6)
- V-M4: Siguranță digitală și multimedia (1→7, need 6)

**Grade VI (32 lessons needed):**
- VI-M1: Prezentări multimedia (1→7, need 6)
- VI-M2: Algoritmi în Scratch (1→7, need 6)
- VI-M3: Scratch - Structuri de control (1→7, need 6)
- VI-M4: Comunicare digitală (1→7, need 6)

**Grade VII (32 lessons needed):**
- VII-M1: Baze de date și organizare informație (1→7, need 6)
- VII-M2: Programare textuală - introducere (1→7, need 6)
- VII-M3: C++ - Algoritmi și structuri (1→7, need 6)
- VII-M4: Web - HTML/CSS bazic (1→7, need 6)

**Grade VIII (26 lessons needed):**
- VIII-M1: Algoritmi cu subprograme (1→7, need 6)
- VIII-M4: Rețele și securitate (1→7, need 6)
- VIII-M5: Recapitulare și proiect (1→8, need 7)

---

## Phase 3: OMEN 3393/2017 Alignment

### Module Structure per Grade

**Clasa V (36 ore/an):**
```
M1: Sisteme de calcul (7h) - Sept-Oct
M2: Aplicații birotice (7h) - Nov-Dec
M3: Procesare de text (7h) - Ian-Feb
M4: Siguranță digitală (7h) - Feb-Apr
M5: Proiect integrat (8h) - Apr-Iun
```

**Clasa VI (36 ore/an):**
```
M1: Prezentări multimedia (7h) - Sept-Oct
M2: Algoritmi în Scratch (7h) - Nov-Dec
M3: Structuri de control (7h) - Ian-Feb
M4: Comunicare digitală (7h) - Feb-Apr
M5: Proiect integrat (8h) - Apr-Iun
```

**Clasa VII (36 ore/an):**
```
M1: Baze de date (7h) - Sept-Oct
M2: Programare textuală (7h) - Nov-Dec
M3: C++ Algoritmi (7h) - Ian-Feb
M4: Web HTML/CSS (7h) - Feb-Apr
M5: Proiect integrat (8h) - Apr-Iun
```

**Clasa VIII (35 ore/an):**
```
M1: Algoritmi subprograme (7h) - Sept-Oct
M2: Structuri de date (7h) - Nov-Dec
M3: SQL (7h) - Ian-Feb
M4: Rețele și securitate (7h) - Feb-Apr
M5: Recapitulare & proiect (7h) - Apr-Iun
```

---

## Phase 4: Audit Compliance (OMEC 6106/2020)

### Required Documentation per Lesson

1. **OMEN Reference** - Link to official curriculum competency
2. **Week Range** - Calendar alignment (e.g., "S5-S7")
3. **Competencies** - Specific competencies addressed
4. **Assessment Criteria** - How learning is measured
5. **Track Differentiation** - Support/Core/Extend variants

### Quality Criteria (Inspector Checklist)

| Criterion | Implementation |
|-----------|----------------|
| Student-centered strategies | Atomic learning with immediate feedback |
| Individualization | 3 tracks (🐢 support, 📚 core, 🚀 extend) |
| Cross-curricular approach | Real-world scenarios, project integration |
| Digital resources | Interactive quizzes, media popups |
| Student work display | Evidence system, portfolio export |

---

## Phase 5: "Sunt în clasa..." Reorganization

### Current Issue
Content in "Sunt în clasa..." sections does not follow official chronological order.

### Solution
Reorganize navigation to match OMEN module sequence:

```
hub/sunt-in-clasa/
├── clasa-5/
│   ├── index.html (grade overview)
│   ├── m1-sisteme-calcul/
│   │   ├── lectia-1-ergonomie.html
│   │   ├── lectia-2-hardware.html
│   │   ├── lectia-3-software.html
│   │   └── ...
│   ├── m2-birotice/
│   ├── m3-word/
│   ├── m4-siguranta/
│   └── m5-proiect/
├── clasa-6/
├── clasa-7/
└── clasa-8/
```

### URL Pattern
`/hub/sunt-in-clasa/clasa-{grade}/m{module}-{slug}/lectia-{number}.html`

---

## Phase 6: Content Generation Pipeline

### Lesson Template (JSON Schema)

```json
{
  "meta": {
    "grade": "V",
    "module_index": 1,
    "lesson_code": "V-M1-L01",
    "title_ro": "Norme de ergonomie și siguranță",
    "omen_reference": "OMEN 3393/2017, Anexa 1",
    "week_range": "S1-S2",
    "duration_minutes": 50
  },
  "competencies": {
    "general": ["GC1.2", "GC3.1"],
    "specific": ["Identifică componentele hardware", "Aplică norme de siguranță"]
  },
  "structure": {
    "goal": "Ce vei învăța și de ce contează",
    "atoms": [
      {
        "id": "atom-1",
        "content": "Explicație concept",
        "quiz": [{"question": "...", "options": [...], "correct": "a", "hint": "..."}]
      }
    ],
    "practice": [
      {"type": "written", "question": "...", "rubric": "..."}
    ],
    "summary": "Recapitulare și export"
  },
  "tracks": {
    "support": {"modifications": "Hints extinse, mai puține întrebări"},
    "core": {"modifications": "Standard"},
    "extend": {"modifications": "Provocări suplimentare"}
  }
}
```

### Generation Order (Recommended)

1. **Week 1-2:** Grade V Module 1 (complete existing 4→7 lessons)
2. **Week 2-3:** Grade V Modules 2-4 (expand from 1 to 7 each)
3. **Week 3-4:** Grade V Module 5 (create 8 new lessons)
4. **Week 4-6:** Grade VI all modules
5. **Week 6-8:** Grade VII all modules
6. **Week 8-10:** Grade VIII all modules

---

## Phase 7: Technical Improvements

### From Site Analysis Recommendations

1. **Content Consolidation**
   - Move all lesson HTML to JSON format
   - Single source of truth for content

2. **Script Consolidation**
   - Reduce 27 JS files to core modules
   - Bundle for production

3. **CSS Unification**
   - Implement design tokens
   - Consistent theming

4. **Build System**
   - Add Vite for bundling/minification
   - Development workflow

---

## Implementation Checklist

### Immediate (This Week)
- [ ] Fix quiz ID mismatches in existing lessons
- [ ] Add status tracking to curriculum.json
- [ ] Create lesson generation script using template

### Short Term (2-4 Weeks)
- [ ] Complete Grade V (all 5 modules, 36 lessons)
- [ ] Complete Grade VI (all 5 modules, 36 lessons)
- [ ] Replace MODEL_ANSWER_REQUIRED placeholders

### Medium Term (4-8 Weeks)
- [ ] Complete Grade VII (all 5 modules, 36 lessons)
- [ ] Complete Grade VIII (all 5 modules, 35 lessons)
- [ ] Expand concepts-graph.json to 100+ concepts

### Long Term (8+ Weeks)
- [ ] Implement full track differentiation
- [ ] Create teacher dashboard
- [ ] Add content versioning
- [ ] Performance optimization

---

## Success Criteria

### Audit-Ready Checklist
- [ ] All lessons reference official OMEN/OMENCS
- [ ] Module order matches official curriculum
- [ ] Week ranges align with 2025-2026 school calendar
- [ ] Competencies listed per official standards
- [ ] Assessment criteria documented
- [ ] Track differentiation available

### Technical Checklist
- [ ] All pages load under 3s
- [ ] Mobile responsive
- [ ] Quizzes functional
- [ ] Progress persistence works
- [ ] No broken links

---

## Resources

### Generated Files
- `curriculum_data.json` - Structured curriculum data
- `RESEARCH_FINDINGS_ROMANIAN_EDUCATION.md` - Full research document
- `data/evaluation_report.json` - Gap analysis
- `data/site_analysis.json` - Technical architecture
- `data/kb_search_results.json` - Existing materials inventory

### Official References
- OMEN 3393/2017: https://www.edu.ro/Ordin_ministru_3393_2017
- OMEC 6106/2020: Inspection regulation
- DigComp 2.2: EU digital competencies framework
- School Calendar 2025-2026: 5-module structure

---

## Next Action

Run the builder agent to generate lessons systematically:

```bash
# Start with Grade V Module 1 (highest priority, most complete)
python tools/lesson_generator.py --grade V --module 1 --lessons 5,6,7
```

Or use multi-agent orchestration per REFACTOR_SYSTEM.md architecture.
