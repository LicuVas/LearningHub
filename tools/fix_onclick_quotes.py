"""Fix unescaped double quotes inside onclick attributes in HTML files.

The problem: onclick="selectOption(this, 'q3', true, '✅ Corect! "maria.ionescu" este...')"
The " inside breaks the HTML attribute delimiter.
Fix: Replace inner " with &quot;

Strategy:
- Find all onclick="..." attributes
- Replace " inside the attribute value with &quot;
- Skip <script> blocks (template literals use different rules)
"""

import re
import os
import sys
from pathlib import Path

def fix_onclick_quotes_in_line(line):
    """Fix unescaped quotes in onclick attributes on a single line."""
    # Pattern: onclick="...content..."
    # We need to find onclick=" then capture everything until the real closing "
    # But the real closing is ambiguous when inner " exist

    # Strategy: Find onclick=" and then greedily collect until we find a pattern
    # that looks like the end: ')"> or ');">' or similar

    result = []
    i = 0
    modified = False

    while i < len(line):
        # Look for onclick="
        match = re.search(r'onclick="', line[i:])
        if not match:
            result.append(line[i:])
            break

        # Add everything before onclick="
        start = i + match.start()
        result.append(line[i:start])

        # Find the onclick attribute value
        attr_start = start + len('onclick="')

        # Find the closing: look for ')"> or similar patterns
        # The closing pattern is typically: ') followed by " and then >
        # or ');" followed by " and >
        # We need to find where the onclick value truly ends

        # Strategy: count parentheses depth and find matching close
        depth = 0
        j = attr_start
        in_single_quote = False
        onclick_end = None

        while j < len(line):
            ch = line[j]

            if ch == "'" and not in_single_quote:
                in_single_quote = True
            elif ch == "'" and in_single_quote:
                in_single_quote = False
            elif ch == '(' and not in_single_quote:
                depth += 1
            elif ch == ')' and not in_single_quote:
                depth -= 1
                if depth <= 0:
                    # Found the closing paren of the function call
                    # The onclick value ends at the next "
                    onclick_end = j + 1  # after the )
                    break
            j += 1

        if onclick_end is None:
            # Couldn't parse, skip this match
            result.append(line[start:attr_start])
            i = attr_start
            continue

        # Extract the onclick value
        onclick_value = line[attr_start:onclick_end]

        # Replace any " inside with &quot;
        if '"' in onclick_value:
            fixed_value = onclick_value.replace('"', '&quot;')
            modified = True
        else:
            fixed_value = onclick_value

        result.append('onclick="')
        result.append(fixed_value)
        i = onclick_end

    return ''.join(result), modified


def fix_file(filepath):
    """Fix all onclick quotes in a single file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    modified_lines = 0
    new_lines = []
    in_script = False

    for line in lines:
        # Track <script> blocks - don't modify inside them
        if '<script' in line.lower():
            in_script = True
        if '</script' in line.lower():
            in_script = False
            new_lines.append(line)
            continue

        if in_script:
            new_lines.append(line)
            continue

        if 'onclick="' in line:
            fixed_line, was_modified = fix_onclick_quotes_in_line(line)
            if was_modified:
                modified_lines += 1
                new_lines.append(fixed_line)
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)

    if modified_lines > 0:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.writelines(new_lines)

    return modified_lines


def main():
    content_dir = Path(r'C:\AI\Projects\LearningHub\content')

    total_files = 0
    total_lines = 0

    for html_file in content_dir.rglob('*.html'):
        fixed = fix_file(html_file)
        if fixed > 0:
            total_files += 1
            total_lines += fixed
            print(f"  Fixed {fixed} lines in {html_file.relative_to(content_dir)}")

    print(f"\nTotal: {total_lines} lines fixed in {total_files} files")

    if total_lines == 0:
        print("No issues found (already fixed or no matches)")


if __name__ == '__main__':
    main()
