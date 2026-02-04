#!/usr/bin/env python3
"""Compare before/after extraction quality."""
import sys
import io
import json

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def compare_files(old_file, new_file):
    print(f"\n{'='*70}")
    print(f"BEFORE/AFTER COMPARISON")
    print(f"{'='*70}\n")

    with open(old_file, encoding='utf-8') as f:
        old_data = json.load(f)

    with open(new_file, encoding='utf-8') as f:
        new_data = json.load(f)

    print(f"File: {old_data['workbook']['title']}\n")

    # Compare overall stats
    print(f"{'Metric':<40} {'BEFORE':<15} {'AFTER':<15} {'CHANGE':>10}")
    print(f"{'-'*70}")

    old_lessons = old_data['lessons']
    new_lessons = new_data['lessons']

    print(f"{'Total lessons':<40} {len(old_lessons):<15} {len(new_lessons):<15}")

    # Objectives
    old_empty_obj = sum(1 for l in old_lessons if not l['objectives'])
    new_empty_obj = sum(1 for l in new_lessons if not l['objectives'])
    print(f"{'Lessons with empty objectives':<40} {old_empty_obj:<15} {new_empty_obj:<15} {new_empty_obj-old_empty_obj:>10}")

    # Terms
    old_empty_terms = sum(1 for l in old_lessons if not l['key_terms'])
    new_empty_terms = sum(1 for l in new_lessons if not l['key_terms'])
    print(f"{'Lessons with empty terms':<40} {old_empty_terms:<15} {new_empty_terms:<15} {new_empty_terms-old_empty_terms:>10}")

    # Total terms
    old_total_terms = sum(len(l['key_terms']) for l in old_lessons)
    new_total_terms = sum(len(l['key_terms']) for l in new_lessons)
    print(f"{'Total terms extracted':<40} {old_total_terms:<15} {new_total_terms:<15} {new_total_terms-old_total_terms:>10}")

    # Sample comparison
    print(f"\n{'='*70}")
    print(f"SAMPLE LESSON COMPARISON (Lesson 1)")
    print(f"{'='*70}\n")

    old_lesson = old_lessons[0] if old_lessons else {}
    new_lesson = new_lessons[0] if new_lessons else {}

    print(f"BEFORE - Objective:")
    if old_lesson.get('objectives'):
        print(f"  {old_lesson['objectives'][0][:150]}...")
    else:
        print(f"  (empty)")

    print(f"\nAFTER - Objective:")
    if new_lesson.get('objectives'):
        print(f"  {new_lesson['objectives'][0][:150]}...")
    else:
        print(f"  (empty)")

    print(f"\nBEFORE - Key terms: {len(old_lesson.get('key_terms', []))}")
    for term in old_lesson.get('key_terms', [])[:3]:
        print(f"  - {term.get('term', 'N/A')}")

    print(f"\nAFTER - Key terms: {len(new_lesson.get('key_terms', []))}")
    for term in new_lesson.get('key_terms', [])[:3]:
        print(f"  - {term.get('term', 'N/A')}")

    print(f"\nBEFORE - Practice tasks (minim): {len(old_lesson.get('practice_tasks', {}).get('minim', []))}")
    if old_lesson.get('practice_tasks', {}).get('minim'):
        task = old_lesson['practice_tasks']['minim'][0]
        print(f"  Sample: {task.get('task', '')[:100]}...")

    print(f"\nAFTER - Practice tasks (minim): {len(new_lesson.get('practice_tasks', {}).get('minim', []))}")
    if new_lesson.get('practice_tasks', {}).get('minim'):
        task = new_lesson['practice_tasks']['minim'][0]
        print(f"  Sample: {task.get('task', '')[:100]}...")
        if 'subitems' in task and task['subitems']:
            print(f"  Sub-items: {len(task['subitems'])}")
            for sub in task['subitems'][:2]:
                print(f"    {sub.get('letter', '?')}) {sub.get('text', '')[:60]}...")

if __name__ == '__main__':
    compare_files(
        'C:/AI/Projects/Scoala/2025-2026/VictorBrauner/Manuale/cls_05/A1230.extracted.json',
        'C:/AI/Projects/Scoala/2025-2026/VictorBrauner/Manuale/cls_05/A1230.extracted_improved.json'
    )
