#!/usr/bin/env python3
"""Check which practice container types exist across lesson files."""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import os
import glob
from pathlib import Path

BASE = Path(__file__).parent.parent / "content" / "tic"

files = sorted(glob.glob(str(BASE / '**' / 'lectia*.html'), recursive=True))
has_practice_advanced = 0
has_practice_section = 0
has_exercises_no_container = []
no_practice = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    rel = str(Path(f).relative_to(BASE)).replace(os.sep, '/')
    if 'practice-advanced' in c:
        has_practice_advanced += 1
    elif 'practice-section' in c or 'id="practice"' in c:
        has_practice_section += 1
    elif 'practice-exercise' in c:
        has_exercises_no_container.append(rel)
    else:
        no_practice += 1

print(f"Files with practice-advanced container: {has_practice_advanced}")
print(f"Files with practice-section container: {has_practice_section}")
print(f"Files with no practice section: {no_practice}")
if has_exercises_no_container:
    print(f"Files with exercises but no recognized container: {len(has_exercises_no_container)}")
    for f in has_exercises_no_container:
        print(f"  {f}")
print(f"Total lesson files: {len(files)}")
