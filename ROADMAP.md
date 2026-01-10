# LearningHub - Student-Centered Learning Platform

## Mission

Create a unified, interactive learning experience where students navigate knowledge through **purpose-driven paths**. Students start with "I want to do this" and discover concepts as tools to achieve their goals - not abstract theory to memorize.

## Core Philosophy

1. **Purpose Before Method** - Every lesson starts with a goal students can relate to
2. **Reverse Engineering** - From result to process, not process to result
3. **Easy & Steady Gains** - Small victories build momentum and confidence
4. **Concept as Tool** - Knowledge is a means, not an end
5. **Multiple Entry Points** - Access by grade, concept, goal, or skill

## Current Status

**Version:** 0.1.0
**Phase:** Initial Development
**Last Updated:** 2026-01-09
**Current Module:** Module 3 (Jan 8 - Feb 20, 2026)

### Milestones

| Milestone | Description | Status | Target |
|-----------|-------------|--------|--------|
| M0 | Project setup, architecture | In Progress | Jan 9 |
| M1 | Module 3 ICT content (all grades) | Planned | Jan 16 |
| M2 | Interactive quizzes per topic | Planned | Jan 23 |
| M3 | Concept linking system | Planned | Jan 30 |
| M4 | Student progress tracking | Planned | Feb 6 |
| M5 | Full multi-navigation system | Planned | Feb 13 |

## Architecture

```
LearningHub/
├── hub/                      # Main learning portal
│   ├── index.html            # Entry point - choose your path
│   ├── by-grade/             # Navigate by grade level
│   ├── by-concept/           # Navigate by concept/skill
│   ├── by-goal/              # Navigate by "I want to..."
│   └── assets/               # Shared CSS, JS, images
├── content/                  # Lesson content
│   ├── tic/                  # TIC lessons by grade
│   │   ├── cls5/             # Class 5 content
│   │   ├── cls6/             # Class 6 content
│   │   ├── cls7/             # Class 7 content
│   │   └── cls8/             # Class 8 content
│   └── english/              # English lessons
├── concepts/                 # Concept definitions & links
│   ├── index.json            # Concept graph
│   └── cards/                # Concept card components
├── exercises/                # Interactive exercises
│   ├── quizzes/              # Multiple choice, fill-in
│   ├── practice/             # Hands-on activities
│   └── challenges/           # Real-world problems
├── data/                     # Configuration & tracking
│   ├── curriculum.json       # What to teach when
│   ├── concepts-graph.json   # How concepts link together
│   └── progress/             # Student progress (future)
├── tools/                    # Helper scripts
├── ROADMAP.md
├── SESSION_LOG.md
└── AI_GUIDE.md
```

## Design Principles

### Navigation Modes

1. **By Grade** - "I'm in Class 6, what should I learn?"
   - Shows module-based curriculum
   - Highlights current week's focus
   - Links to prerequisites if gaps detected

2. **By Concept** - "I want to understand loops"
   - Concept cards with definitions
   - Links to related concepts
   - Examples from simple to complex
   - Cross-grade progression

3. **By Goal** - "I want to make a game"
   - Project-based learning paths
   - Shows required concepts
   - Step-by-step guidance
   - Celebrates completion

### Lesson Structure

Each lesson follows the **GOAL → TRY → LEARN → TEST** pattern:

1. **GOAL (30s)** - What will you be able to do?
   - Visual example of end result
   - "After this, you can..."

2. **TRY (2min)** - Jump in immediately
   - Simple challenge to attempt
   - Learn by doing first

3. **LEARN (5min)** - Concepts as tools
   - Just-in-time knowledge
   - Connected to what you just tried
   - "This is called X, and here's why it helps..."

4. **TEST (2min)** - Verify understanding
   - Quick check
   - Immediate feedback
   - Path to next lesson

### Concept Linking

Every concept has:
- **Prerequisites** - What you need to know first
- **Enables** - What this unlocks
- **Related** - Similar or complementary concepts
- **Grade Mapping** - Where this appears in curriculum

Example:
```json
{
  "id": "variable",
  "name": "Variabila",
  "description": "Un container cu nume pentru stocare date",
  "prerequisites": ["data-types"],
  "enables": ["loops", "functions", "conditions"],
  "grades": {
    "cls6": "Variabile in Scratch",
    "cls7": "Variabile in Python"
  }
}
```

## Module 3 Content Plan

### Class 5 - Word Processing
- Goal: Create a beautiful document
- Topics: Formatting, styles, images, layouts
- Project: Make a class newsletter

### Class 6 - Scratch Variables
- Goal: Make a score counter in a game
- Topics: Variables, data, change, show
- Project: Simple catching game with score

### Class 7 - Python Functions
- Goal: Stop repeating yourself in code
- Topics: def, parameters, return, calling
- Project: Calculator with functions

### Class 8 - Databases
- Goal: Organize information efficiently
- Topics: Tables, fields, SQL SELECT
- Project: Simple contact book database

## Integration Points

- **TeachingHub** - Curriculum structure source
- **TeachingTracker** - Lesson logging
- **Secretary** - Schedule awareness
- **Obsidian Vault** - Student roster access
- **MongoDB** - Progress tracking (future)

## Success Metrics

1. **Engagement** - Time on task, completion rates
2. **Understanding** - Quiz scores, concept mastery
3. **Application** - Project completion
4. **Retention** - Revisit patterns, long-term recall

---

*Part of the C:\AI ecosystem - Prof. Gurlan Vasile*
