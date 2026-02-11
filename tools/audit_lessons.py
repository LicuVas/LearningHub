#!/usr/bin/env python3
"""
LearningHub Lesson Auditor
===========================
Scans ALL HTML files in content/ for issues:
- Broken links (href/src that don't resolve)
- Invalid data-quiz JSON
- Correct answer out of range
- Module name mismatches
- Missing JS/CSS assets
- Navigation consistency
- Practice sections without input fields
- Quiz answer validation

Outputs: results/audit_report.json + results/audit_summary.txt
"""

import os
import re
import json
import sys
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict

CONTENT_ROOT = Path(r"C:\AI\Projects\LearningHub\content")
PROJECT_ROOT = Path(r"C:\AI\Projects\LearningHub")
RESULTS_DIR = PROJECT_ROOT / "results"

class HTMLAuditor(HTMLParser):
    """Parse HTML and extract audit-relevant data."""

    def __init__(self):
        super().__init__()
        self.links = []          # All href values
        self.scripts = []        # All script src values
        self.stylesheets = []    # All link[rel=stylesheet] href values
        self.data_quizzes = []   # All data-quiz JSON strings
        self.title = ""
        self.in_title = False
        self.badges = []         # Text content of badge elements
        self.in_badge = False
        self.back_links = []     # Back navigation links
        self.atom_options = []   # data-answer values per quiz
        self.current_quiz_id = None
        self.has_practice_section = False
        self.has_textarea = False
        self.has_input_text = False
        self.nav_links = []      # Navigation links
        self.breadcrumb_info = {}
        self.script_content = [] # Inline script content
        self.in_script = False
        self.current_script = ""
        self.atom_ids = []       # IDs of .atom elements
        self.classes_stack = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        classes = attr_dict.get('class', '')

        if tag == 'a':
            href = attr_dict.get('href', '')
            if href:
                self.links.append(href)
                if 'nav-link' in classes or 'nav-back' in classes or 'back-link' in classes:
                    self.nav_links.append(href)

        if tag == 'script':
            src = attr_dict.get('src', '')
            if src:
                self.scripts.append(src)
            else:
                self.in_script = True
                self.current_script = ""

        if tag == 'link':
            rel = attr_dict.get('rel', '')
            href = attr_dict.get('href', '')
            if 'stylesheet' in rel and href:
                self.stylesheets.append(href)

        if tag == 'title':
            self.in_title = True

        # Check for data-quiz attribute
        data_quiz = attr_dict.get('data-quiz', '')
        if data_quiz:
            self.data_quizzes.append(data_quiz)

        # Check for badge/module name elements
        if 'lesson-badge' in classes or 'grade-badge' in classes:
            self.in_badge = True

        # Check for practice sections
        if 'practice-advanced' in classes or 'practice-exercise' in classes:
            self.has_practice_section = True

        if tag == 'textarea':
            self.has_textarea = True

        if tag == 'input':
            input_type = attr_dict.get('type', 'text')
            if input_type == 'text':
                self.has_input_text = True

        # Track atom IDs
        atom_id = attr_dict.get('id', '')
        if atom_id and ('atom' in classes or atom_id.startswith('atom')):
            self.atom_ids.append(atom_id)

        # Track data-answer on options
        data_answer = attr_dict.get('data-answer', '')
        if data_answer and ('atom-option' in classes or 'option' in classes):
            self.atom_options.append(data_answer)

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'script' and self.in_script:
            self.in_script = False
            self.script_content.append(self.current_script)

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_badge:
            self.badges.append(data.strip())
            self.in_badge = False
        if self.in_script:
            self.current_script += data


def resolve_path(base_file, relative_path):
    """Resolve a relative path from a base file location."""
    if relative_path.startswith(('http://', 'https://', 'mailto:', '#', 'javascript:')):
        return None  # External or special link
    base_dir = Path(base_file).parent
    resolved = (base_dir / relative_path).resolve()
    return resolved


def check_data_quiz(json_str, file_path):
    """Validate data-quiz JSON and check correct answers."""
    issues = []
    try:
        quiz_data = json.loads(json_str)
        if not isinstance(quiz_data, list):
            issues.append(f"data-quiz is not an array")
            return issues

        for i, q in enumerate(quiz_data):
            if not isinstance(q, dict):
                issues.append(f"Question {i} is not an object")
                continue

            # Check required fields
            if 'question' not in q:
                issues.append(f"Question {i}: missing 'question' field")
            if 'options' not in q:
                issues.append(f"Question {i}: missing 'options' field")
                continue
            if 'correct' not in q:
                issues.append(f"Question {i}: missing 'correct' field")
                continue

            options = q.get('options', [])
            correct = q.get('correct', '')

            if not options:
                issues.append(f"Question {i}: empty options array")
                continue

            # Correct answer validation (letter-based: a, b, c, etc.)
            if isinstance(correct, str) and len(correct) == 1:
                correct_idx = ord(correct.lower()) - ord('a')
                if correct_idx < 0 or correct_idx >= len(options):
                    issues.append(f"Question {i}: correct answer '{correct}' out of range (only {len(options)} options)")
            elif isinstance(correct, int):
                if correct < 0 or correct >= len(options):
                    issues.append(f"Question {i}: correct index {correct} out of range")
            else:
                issues.append(f"Question {i}: invalid correct answer format: '{correct}'")

    except json.JSONDecodeError as e:
        issues.append(f"Invalid JSON in data-quiz: {e}")

    return issues


def check_inline_quiz_js(script_content, file_path):
    """Check inline quiz JavaScript for issues."""
    issues = []

    # Look for levels object
    levels_match = re.search(r'const\s+levels\s*=\s*\{', script_content)
    if not levels_match:
        return issues  # Not a quiz file

    # Find all correct: N references
    correct_matches = re.findall(r'correct:\s*(\d+)', script_content)

    # Find all options arrays
    # Count options per question (rough estimate)
    option_blocks = re.findall(r'options:\s*\[(.*?)\]', script_content, re.DOTALL)

    for i, (correct, opts_str) in enumerate(zip(correct_matches, option_blocks)):
        correct_idx = int(correct)
        # Count quoted strings as options
        num_options = len(re.findall(r'"[^"]*"', opts_str))
        if correct_idx < 0 or correct_idx >= num_options:
            issues.append(f"Inline quiz q{i}: correct={correct_idx} but only {num_options} options")

    return issues


def check_module_name_match(file_path, parser):
    """Check if module name in content matches the URL path."""
    issues = []
    rel_path = Path(file_path).relative_to(CONTENT_ROOT)
    parts = rel_path.parts  # e.g., ('tic', 'cls5', 'extra-birotice-cls7', 'lectia1.html')

    if len(parts) < 3:
        return issues

    # Extract module info from path
    grade_dir = parts[1] if len(parts) > 1 else ''  # cls5, cls6, etc.
    module_dir = parts[2] if len(parts) > 2 else ''  # m1-sisteme, extra-birotice-cls7, etc.

    # Extract module number from directory name
    module_num_match = re.match(r'm(\d+)', module_dir)
    extra_match = re.match(r'extra-', module_dir)

    # Check badges for module number
    for badge_text in parser.badges:
        badge_module_match = re.search(r'MODUL(?:UL)?\s*(\d+)', badge_text, re.IGNORECASE)
        if badge_module_match and module_num_match:
            badge_num = badge_module_match.group(1)
            dir_num = module_num_match.group(1)
            if badge_num != dir_num:
                issues.append(f"Module number mismatch: badge says 'Modul {badge_num}' but directory is m{dir_num}")

    # Check for breadcrumb mismatches in inline scripts
    for script in parser.script_content:
        breadcrumb_match = re.search(r"module:\s*'([^']*)'", script)
        module_name_match = re.search(r"moduleName:\s*'([^']*)'", script)
        if breadcrumb_match:
            bc_module = breadcrumb_match.group(1)
            if module_dir and bc_module and module_dir not in bc_module and bc_module not in module_dir:
                # Only flag if clearly different
                if not any(x in bc_module for x in module_dir.split('-')):
                    issues.append(f"Breadcrumb module '{bc_module}' doesn't match directory '{module_dir}'")

    return issues


def check_navigation_links(file_path, parser):
    """Check navigation consistency."""
    issues = []

    for nav_link in parser.nav_links:
        if nav_link.startswith(('http', 'mailto:', '#', 'javascript:')):
            continue
        resolved = resolve_path(file_path, nav_link)
        if resolved and not resolved.exists():
            issues.append(f"Navigation link broken: '{nav_link}' -> {resolved}")

    return issues


def audit_file(file_path):
    """Run all checks on a single HTML file."""
    issues = []

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return [f"Cannot read file: {e}"]

    parser = HTMLAuditor()
    try:
        parser.feed(content)
    except Exception as e:
        issues.append(f"HTML parse error: {e}")
        return issues

    # 1. Check broken links (hrefs)
    for link in parser.links:
        if link.startswith(('http://', 'https://', 'mailto:', '#', 'javascript:', 'data:')):
            continue
        resolved = resolve_path(file_path, link)
        if resolved and not resolved.exists():
            issues.append(f"BROKEN_LINK: '{link}' does not exist (resolved: {resolved})")

    # 2. Check script sources
    for src in parser.scripts:
        if src.startswith(('http://', 'https://', '//')):
            continue
        resolved = resolve_path(file_path, src)
        if resolved and not resolved.exists():
            issues.append(f"MISSING_JS: '{src}' does not exist (resolved: {resolved})")

    # 3. Check stylesheet sources
    for href in parser.stylesheets:
        if href.startswith(('http://', 'https://', '//')):
            continue
        resolved = resolve_path(file_path, href)
        if resolved and not resolved.exists():
            issues.append(f"MISSING_CSS: '{href}' does not exist (resolved: {resolved})")

    # 4. Validate data-quiz JSON
    for dq in parser.data_quizzes:
        dq_issues = check_data_quiz(dq, file_path)
        issues.extend([f"DATA_QUIZ: {i}" for i in dq_issues])

    # 5. Check inline quiz JS
    for script in parser.script_content:
        if 'const levels' in script:
            js_issues = check_inline_quiz_js(script, file_path)
            issues.extend([f"INLINE_QUIZ: {i}" for i in js_issues])

    # 6. Module name consistency
    name_issues = check_module_name_match(file_path, parser)
    issues.extend([f"MODULE_MISMATCH: {i}" for i in name_issues])

    # 7. Navigation links
    nav_issues = check_navigation_links(file_path, parser)
    issues.extend([f"NAV_BROKEN: {i}" for i in nav_issues])

    # 8. Practice sections without inputs
    if parser.has_practice_section:
        # practice-simple.js adds textareas dynamically, but check if JS is loaded
        has_practice_js = any('practice-simple' in s or 'practice-advanced' in s or 'practice-system' in s for s in parser.scripts)
        if not has_practice_js:
            issues.append(f"PRACTICE_NO_JS: Practice section exists but no practice JS loaded")

    # 9. Check for files that have static atom-options but no atomic-learning.js
    if parser.atom_options or parser.data_quizzes:
        has_atomic_js = any('atomic-learning' in s for s in parser.scripts)
        if not has_atomic_js:
            # Only flag if it looks like a lesson (has data-quiz)
            if parser.data_quizzes:
                issues.append(f"LESSON_NO_JS: Has data-quiz atoms but atomic-learning.js not loaded - options will be dead/unclickable")

    # 10. Check title exists
    if not parser.title.strip():
        issues.append("NO_TITLE: Page has no <title>")

    return issues


def main():
    """Run audit on all HTML files."""
    RESULTS_DIR.mkdir(exist_ok=True)

    # Collect all HTML files
    html_files = []
    for root, dirs, files in os.walk(CONTENT_ROOT):
        for f in files:
            if f.endswith('.html'):
                html_files.append(Path(root) / f)

    print(f"Found {len(html_files)} HTML files to audit")

    # Audit each file
    all_results = {}
    issue_counts = defaultdict(int)
    files_with_issues = 0
    total_issues = 0

    for i, fp in enumerate(sorted(html_files)):
        rel = fp.relative_to(CONTENT_ROOT)
        issues = audit_file(str(fp))

        if issues:
            all_results[str(rel)] = issues
            files_with_issues += 1
            total_issues += len(issues)

            for issue in issues:
                category = issue.split(':')[0]
                issue_counts[category] += 1

        if (i + 1) % 50 == 0:
            print(f"  Processed {i+1}/{len(html_files)}...")

    # Write JSON report
    report = {
        "summary": {
            "total_files": len(html_files),
            "files_with_issues": files_with_issues,
            "total_issues": total_issues,
            "issue_breakdown": dict(issue_counts)
        },
        "files": all_results
    }

    report_path = RESULTS_DIR / "audit_report.json"
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    # Write summary text
    summary_path = RESULTS_DIR / "audit_summary.txt"
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write(f"LearningHub Audit Report\n")
        f.write(f"========================\n\n")
        f.write(f"Total HTML files: {len(html_files)}\n")
        f.write(f"Files with issues: {files_with_issues}\n")
        f.write(f"Total issues: {total_issues}\n\n")

        f.write(f"Issue Breakdown:\n")
        for cat, count in sorted(issue_counts.items(), key=lambda x: -x[1]):
            f.write(f"  {cat}: {count}\n")

        f.write(f"\n{'='*60}\nDETAILED ISSUES BY FILE\n{'='*60}\n\n")

        for file_path, issues in sorted(all_results.items()):
            f.write(f"\n--- {file_path} ---\n")
            for issue in issues:
                f.write(f"  [{issue}]\n")

    print(f"\nAudit complete!")
    print(f"  Files scanned: {len(html_files)}")
    print(f"  Files with issues: {files_with_issues}")
    print(f"  Total issues: {total_issues}")
    print(f"\nIssue breakdown:")
    for cat, count in sorted(issue_counts.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}")
    print(f"\nFull report: {report_path}")
    print(f"Summary: {summary_path}")


if __name__ == '__main__':
    main()
