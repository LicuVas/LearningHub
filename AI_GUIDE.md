# LearningHub - AI Agent Guide

## Quick Context

LearningHub is a student-centered learning platform where students navigate knowledge through purpose-driven paths. The core philosophy is **"I want to do this"** → discover concepts as tools.

## Core Design Patterns

### Lesson Structure (GOAL → TRY → LEARN → TEST)

Every lesson follows this exact pattern:

1. **GOAL (30s)** - Visual preview of what they'll achieve
   - Show end result first
   - "After this, you can..."

2. **TRY (2min)** - Jump in immediately
   - Challenge without full instructions
   - Learn by doing, then explain

3. **LEARN (5min)** - Just-in-time concepts
   - Explain what they just tried
   - Connect to the challenge
   - "This is called X, and here's why..."

4. **TEST (2min)** - Quick verification
   - 3 questions minimum
   - Immediate feedback
   - 66%+ to progress

### Navigation Modes

1. **By Grade** - `/hub/by-grade/cls{N}.html`
2. **By Concept** - `/hub/by-concept/index.html`
3. **By Goal** - `/hub/by-goal/index.html`

### Content Path Structure

```
content/
├── tic/
│   ├── cls5/
│   │   └── m3-word/
│   │       ├── index.html         # Module overview
│   │       ├── lectia1-*.html     # Individual lessons
│   │       └── proiect-*.html     # Final project
│   ├── cls6/
│   ├── cls7/
│   └── cls8/
```

## How to Add a New Lesson

1. Copy the lesson template pattern from `lectia1-primul-document.html`
2. Update the 4 sections (goal, try, learn, test)
3. Link to concepts in `data/concepts-graph.json`
4. Add to module index

### Lesson HTML Template Sections

```html
<div class="section" id="goal">
    <!-- Goal icon, title, description, preview of result -->
</div>

<div class="section" id="try">
    <!-- Challenge box with task, optional hints -->
</div>

<div class="section" id="learn">
    <!-- Concept cards, step-by-step instructions -->
</div>

<div class="section" id="test">
    <!-- Quiz questions, match games, or interactive checks -->
</div>
```

## Concept Graph

Located at `data/concepts-graph.json`:
- Each concept has: prerequisites, enables, related
- Maps to specific grades and modules
- Used for concept navigation and prerequisite checks

## Style Guidelines

### Visual Design
- Dark theme (--bg-primary: #0a0a12)
- Accent colors: blue (#3b82f6), purple (#8b5cf6), green (#10b981), orange (#f59e0b)
- Inter font family
- Card-based layout with subtle gradients

### Language
- Romanian for student-facing content
- Simple, direct language
- "Tu" form (informal)
- Focus on what they CAN do, not theory

## Integration Points

- **Portal** - `C:\AI\portal.html` links to LearningHub
- **Secretary** - Can reference for schedule awareness
- **TeachingHub** - Curriculum structure source
- **MongoDB** - Future progress tracking

## Priority for Development

1. **Module 3 content** - Current teaching needs (Jan-Feb 2026)
2. **Class 5** - Word Processing (done: 2 lessons)
3. **Class 6** - Scratch Variables (pending)
4. **Class 7** - Python Functions (pending)
5. **Class 8** - Databases (pending)

## Testing

- Each lesson should be testable by opening the HTML in a browser
- Interactive elements should work without backend
- Progress is stored in localStorage (temporary) or MongoDB (future)

---

*Part of C:\AI ecosystem - Prof. Gurlan Vasile*
