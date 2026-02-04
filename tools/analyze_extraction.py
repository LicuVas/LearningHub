#!/usr/bin/env python3
"""Analyze extraction quality from JSON files."""
import json
import sys
import io

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def analyze_file(filepath):
    print(f"\n{'='*70}")
    print(f"Analyzing: {filepath}")
    print(f"{'='*70}")

    with open(filepath, encoding='utf-8') as f:
        data = json.load(f)

    print(f"\nWorkbook: {data['workbook']['title']}")
    print(f"   Grade: {data['workbook']['grade']}")
    print(f"   Total pages: {data['workbook']['total_pages']}")
    print(f"   Total lessons: {len(data['lessons'])}")

    # Analyze lesson quality
    empty_objectives = 0
    empty_terms = 0
    encoding_issues = 0
    noisy_tasks = 0

    for i, lesson in enumerate(data['lessons']):
        # Check objectives
        if not lesson['objectives']:
            empty_objectives += 1
        else:
            # Check for encoding issues (cid: patterns)
            obj_text = ' '.join(lesson['objectives'])
            if '(cid:' in obj_text or len(obj_text) < 10:
                encoding_issues += 1

        # Check terms
        if not lesson['key_terms']:
            empty_terms += 1

        # Check task quality
        for level in ['minim', 'standard', 'performanta']:
            for task in lesson['practice_tasks'][level]:
                task_text = task['task']
                if '(cid:' in task_text or len(task_text) < 20:
                    noisy_tasks += 1
                    break

    print(f"\nQuality Issues:")
    print(f"   - Lessons with empty objectives: {empty_objectives}/{len(data['lessons'])}")
    print(f"   - Lessons with encoding issues: {encoding_issues}/{len(data['lessons'])}")
    print(f"   - Lessons with empty terms: {empty_terms}/{len(data['lessons'])}")
    print(f"   - Lessons with noisy tasks: {noisy_tasks}/{len(data['lessons'])}")

    # Sample problematic content
    print(f"\nSample Issues:")
    for i, lesson in enumerate(data['lessons'][:3]):
        print(f"\n   Lesson {i+1}: {lesson['meta']['title_ro']}")
        if lesson['objectives']:
            print(f"   Objective sample: {lesson['objectives'][0][:150]}...")
        else:
            print(f"   Objective: EMPTY")

        # Sample task
        if lesson['practice_tasks']['minim']:
            task = lesson['practice_tasks']['minim'][0]['task']
            print(f"   Task sample: {task[:150]}...")

        if lesson['evaluation_items']:
            eval_item = lesson['evaluation_items'][0]
            print(f"   Eval sample: {eval_item['text'][:100]}...")

if __name__ == '__main__':
    import sys

    # Allow command-line file specification
    if len(sys.argv) > 1:
        files = sys.argv[1:]
    else:
        files = [
            'C:/AI/Projects/Scoala/2025-2026/VictorBrauner/Manuale/cls_08/A1969.extracted.json',
            'C:/AI/Projects/Scoala/2025-2026/VictorBrauner/Manuale/cls_05/A1230.extracted.json',
        ]

    for f in files:
        try:
            analyze_file(f)
        except Exception as e:
            print(f"ERROR analyzing {f}: {e}")
