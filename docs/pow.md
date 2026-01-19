# LearningHub Proof-of-Work (PoW) System

## Overview

The PoW system prevents "CS:GO clicking to green" by requiring students to complete checkpoint forms before they can proceed to the next lesson. It includes:

- **Checkpoint Forms**: Students must answer reflection questions to complete a lesson
- **Navigation Gating**: "Next" button is locked until checkpoint is completed
- **Sequential Locking**: Lessons are locked in order (lesson 2 requires lesson 1 completion)
- **Quiz Anti-Spam**: Limits quiz attempts with explanation unlock mechanism

## Quick Start

### Adding PoW to a Lesson (2 minutes)

1. Add CSS link in `<head>`:
```html
<link rel="stylesheet" href="../../../../assets/css/pow.css">
```

2. Add checkpoint div before navigation buttons:
```html
<!-- PoW Checkpoint -->
<div class="pow-checkpoint" data-pow='{
    "lessonId": "cls6-m3-scratch-control-lectia1",
    "fields": [
        {"name": "whatLearned", "type": "textarea", "minChars": 30, "required": true, "label": "Ce ai invatat?"},
        {"name": "whatCreated", "type": "textarea", "minChars": 20, "required": true, "label": "Ce ai creat?"}
    ]
}'></div>

<!-- Navigation -->
<div class="nav-buttons">...</div>
```

3. Add scripts before `</body>`:
```html
<script src="../../../../assets/js/pow/storage.js"></script>
<script src="../../../../assets/js/pow/validator.js"></script>
<script src="../../../../assets/js/pow/checkpoint.js"></script>
<script src="../../../../assets/js/pow/gating.js"></script>
<script src="../../../../assets/js/pow/quiz-limiter.js"></script>
```

### Adding Sequential Locking to a Module

1. Add data attributes to container:
```html
<div class="container" data-module-id="m3-scratch-control" data-grade-id="cls6" data-sequential="true">
```

2. Add data-lesson-id to each lesson card:
```html
<a href="lectia1.html" class="lesson-card" data-lesson-id="cls6-m3-scratch-control-lectia1">
```

3. Include scripts:
```html
<script src="../../../../assets/js/pow/storage.js"></script>
<script src="../../../../assets/js/pow/sequential.js"></script>
```

## Configuration

### Central Config File

Edit `data/pow-config.json` to configure:

- **Default checkpoint fields** for all lessons
- **Module overrides** (e.g., add Scratch URL field for m2-scratch)
- **Lesson overrides** (e.g., require project URL for final project lessons)
- **UI text** (Romanian labels, buttons, messages)

### Lesson ID Convention

Format: `{grade}-{module}-{lesson}`

Examples:
- `cls6-m3-scratch-control-lectia1`
- `cls5-m2-birotice-lectia3`
- `cls7-m4-web-lectia6`

### Field Types

| Type | Description | Example |
|------|-------------|---------|
| `textarea` | Multi-line text input | Reflection questions |
| `url` | URL input with validation | Scratch project links |
| `text` | Single-line text input | Short answers |

### Validation Rules

| Rule | Description | Example |
|------|-------------|---------|
| `minChars` | Minimum character count | `"minChars": 30` |
| `minWords` | Minimum word count | `"minWords": 5` |
| `urlPattern` | URL must contain domain | `"urlPattern": "scratch.mit.edu"` |
| `mustIncludeAny` | Contains at least one keyword | `"mustIncludeAny": ["daca", "atunci"]` |
| `mustIncludeAll` | Contains all keywords | `"mustIncludeAll": ["bucla", "repeta"]` |
| `required` | Field is mandatory | `"required": true` |
| `optional` | Field is optional | `"optional": true` |

## Teacher Override

Add `?teacher=1` to any URL to bypass all locks:

```
https://learninghub.../content/tic/cls6/m3-scratch-control/lectia3.html?teacher=1
```

This:
- Unlocks all navigation buttons
- Makes all lessons accessible
- Still shows checkpoint forms (but doesn't require completion)

## Quiz Anti-Spam

The `quiz-limiter.js` module:

1. **Tracks attempts per question** (max 3)
2. **Locks question after 3 wrong attempts**
3. **Requires explanation** (20+ chars) to unlock
4. **Grants 3 more attempts** after explanation
5. **Affects XP rewards** based on performance

XP Multipliers:
- 100%: Average ≤2 attempts per question
- 50%: Average 2-3 attempts
- 25%: Average >3 or needed explanation unlock

## Data Storage

All progress is stored in localStorage:

```javascript
// Key: learninghub_pow_v1_{profileId}
{
    "version": 1,
    "lessons": {
        "cls6-m3-scratch-control-lectia1": {
            "completed": true,
            "completedAt": "2026-01-19T10:30:00Z",
            "fields": { "whatLearned": "...", "whatCreated": "..." }
        }
    },
    "quizAttempts": {
        "cls6-m3-scratch-control-lectia1": {
            "q1": { "attempts": 2, "correct": true, "locked": false }
        }
    }
}
```

## Migration Script

Use `tools/pow-migration.js` for mass updates:

```bash
# Preview changes
node tools/pow-migration.js --dry-run

# Apply to all files
node tools/pow-migration.js --apply

# Undo all changes
node tools/pow-migration.js --rollback

# Check migration status
node tools/pow-migration.js --status
```

## Resetting Progress

### From Browser Console

```javascript
// Reset all progress for current user
PowStorage.resetAll();

// Reset single lesson
PowStorage.resetLesson('cls6-m3-scratch-control-lectia1');

// Debug: view all data
PowStorage.debug();
```

### From localStorage

```javascript
// Clear all PoW data
localStorage.removeItem('learninghub_pow_v1__guest');
```

## Files Reference

```
assets/
├── js/
│   └── pow/
│       ├── storage.js      # localStorage wrapper
│       ├── validator.js    # Field validation rules
│       ├── checkpoint.js   # Form renderer
│       ├── gating.js       # Navigation locking
│       ├── sequential.js   # Module lesson locking
│       └── quiz-limiter.js # Quiz attempt limits
├── css/
│   └── pow.css             # All styling
data/
└── pow-config.json         # Central configuration
tools/
└── pow-migration.js        # Mass migration script
docs/
└── pow.md                  # This documentation
```

## Troubleshooting

### Checkpoint not appearing
- Check that `pow-checkpoint` div has valid JSON in `data-pow`
- Verify scripts are loaded in correct order (storage → validator → checkpoint)
- Check browser console for errors

### Navigation not locking
- Ensure gating.js is loaded after checkpoint.js
- Verify lesson ID matches in checkpoint and storage

### Sequential lock not working
- Check `data-module-id` and `data-sequential="true"` on container
- Verify `data-lesson-id` on each lesson card matches storage keys
- Check that sequential.js is loaded

### Quiz attempts not tracking
- Verify quiz-limiter.js is loaded
- Check that questions have `.quiz-question` class
- Ensure checkAnswer function exists
