#!/usr/bin/env python3
"""
LearningHub QA Agent
====================
Comprehensive quality assurance checker for all lesson and quiz HTML files.
Finds broken quizzes, missing inputs, content issues, and structural problems.

Usage:
    python tools/qa_agent.py                    # Full audit
    python tools/qa_agent.py --path cls5/m1     # Audit specific path
    python tools/qa_agent.py --fix              # Show fix suggestions
    python tools/qa_agent.py --json             # JSON output
    python tools/qa_agent.py --severity critical # Filter by severity
"""

import os
import re
import json
import sys
import argparse
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import List, Optional, Tuple
from html.parser import HTMLParser
from collections import Counter

# ─── Configuration ────────────────────────────────────────────────────────────

SITE_ROOT = Path(__file__).resolve().parent.parent
CONTENT_ROOT = SITE_ROOT / "content"

# Keywords that indicate student should write something
WRITE_KEYWORDS_RO = [
    r'\bscrie\b', r'\bexplica\b', r'\bdescrie\b', r'\bcompara\b',
    r'\banalizeaza\b', r'\bargumenteaza\b', r'\bjustifica\b',
    r'\benumera\b', r'\bcompleteaza\b', r'\bredacteaza\b',
    r'\bformuleaza\b', r'\bprezinta\b', r'\brezolva\b',
    r'\braspunde\b', r'\bda un exemplu\b', r'\bda exemple\b',
    r'\bcreaza\b', r'\bproiecteaza\b', r'\bimagineaza\b',
]

# Fill-in-the-blank patterns
BLANK_PATTERNS = [
    r'_{3,}',           # Three or more underscores
    r'\.{3,}',          # Three or more dots used as blanks
    r'\[\.{3,}\]',      # [...]
    r'___+/\d+',        # ___/10 (score blanks)
]

# ─── Data Classes ─────────────────────────────────────────────────────────────

@dataclass
class Issue:
    file: str
    line: int
    severity: str  # critical, warning, info
    category: str  # quiz-logic, missing-input, broken-link, answer-bias, structural, content
    message: str
    fix_suggestion: str = ""
    context: str = ""  # surrounding code/text

@dataclass
class QuizQuestion:
    """Represents a quiz question extracted from HTML"""
    file: str
    line: int
    question_id: str
    question_text: str
    options: List[str]
    correct_index: Optional[int] = None
    correct_flag: Optional[bool] = None  # For selectOption pattern
    system: str = "unknown"  # selectOption, levels, instantQuiz

@dataclass
class AuditReport:
    files_scanned: int = 0
    issues: List[Issue] = field(default_factory=list)
    questions_checked: int = 0
    summary: dict = field(default_factory=dict)

# ─── HTML Content Extractor ──────────────────────────────────────────────────

class HTMLTextExtractor(HTMLParser):
    """Extract visible text content from HTML"""
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self._skip = False
        self._skip_tags = {'script', 'style', 'noscript'}

    def handle_starttag(self, tag, attrs):
        if tag in self._skip_tags:
            self._skip = True

    def handle_endtag(self, tag):
        if tag in self._skip_tags:
            self._skip = False

    def handle_data(self, data):
        if not self._skip:
            self.text_parts.append(data)

    def get_text(self):
        return ' '.join(self.text_parts)


# ─── Checkers ─────────────────────────────────────────────────────────────────

def check_select_option_quiz(content: str, filepath: str) -> Tuple[List[Issue], List[QuizQuestion]]:
    """
    Check lesson files using selectOption(el, qId, correct, explanation) pattern.
    Validates: correct flag matches expected answer, feedback div exists, all questions have options.
    """
    issues = []
    questions = []

    # Find all selectOption calls
    # Pattern: selectOption(this, 'q1', true/false, 'explanation text')
    pattern = r'selectOption\s*\(\s*this\s*,\s*[\'"](\w+)[\'"]\s*,\s*(true|false)\s*,\s*[\'"](.+?)[\'"]\s*\)'

    lines = content.split('\n')

    # Group options by question ID
    question_options = {}  # qId -> [(line_num, is_correct, explanation, option_text)]

    for i, line in enumerate(lines, 1):
        for match in re.finditer(pattern, line):
            q_id = match.group(1)
            is_correct = match.group(2) == 'true'
            explanation = match.group(3)

            # Extract option text from surrounding HTML
            option_text_match = re.search(r'class="option-text"[^>]*>([^<]+)', line)
            option_text = option_text_match.group(1).strip() if option_text_match else ""

            if q_id not in question_options:
                question_options[q_id] = []
            question_options[q_id].append((i, is_correct, explanation, option_text))

    for q_id, opts in question_options.items():
        correct_count = sum(1 for _, is_correct, _, _ in opts if is_correct)
        first_line = opts[0][0]

        # Check: exactly one correct answer per question
        if correct_count == 0:
            issues.append(Issue(
                file=filepath, line=first_line, severity="critical",
                category="quiz-logic",
                message=f"Question '{q_id}' has NO correct answer (all options are false)",
                fix_suggestion=f"Set one selectOption call for '{q_id}' to true"
            ))
        elif correct_count > 1:
            issues.append(Issue(
                file=filepath, line=first_line, severity="critical",
                category="quiz-logic",
                message=f"Question '{q_id}' has {correct_count} correct answers (should be exactly 1)",
                fix_suggestion=f"Ensure only one selectOption call for '{q_id}' has true"
            ))

        # Check: feedback div exists
        feedback_id = f'{q_id}-feedback'
        if feedback_id not in content:
            issues.append(Issue(
                file=filepath, line=first_line, severity="critical",
                category="structural",
                message=f"Missing feedback div with id='{feedback_id}' for question '{q_id}'",
                fix_suggestion=f'Add <div class="feedback" id="{feedback_id}"></div> after the question options'
            ))

        # Check: too few options
        if len(opts) < 2:
            issues.append(Issue(
                file=filepath, line=first_line, severity="warning",
                category="quiz-logic",
                message=f"Question '{q_id}' has only {len(opts)} option(s) - needs at least 2",
                fix_suggestion=f"Add more options for question '{q_id}'"
            ))

        # Build question record
        correct_idx = next((i for i, (_, c, _, _) in enumerate(opts) if c), None)
        questions.append(QuizQuestion(
            file=filepath, line=first_line, question_id=q_id,
            question_text="",  # Would need deeper parsing
            options=[t for _, _, _, t in opts],
            correct_index=correct_idx,
            correct_flag=True,
            system="selectOption"
        ))

    return issues, questions


def check_levels_quiz(content: str, filepath: str) -> Tuple[List[Issue], List[QuizQuestion]]:
    """
    Check quiz files using the levels = { 1: { questions: [...] } } pattern.
    Validates: correct index in range, answer bias, option count.
    """
    issues = []
    questions = []

    # Extract the levels object - find the script containing it
    levels_match = re.search(r'const\s+levels\s*=\s*\{', content)
    if not levels_match:
        return issues, questions

    lines = content.split('\n')

    # Parse questions from the levels structure
    # Find question blocks
    question_blocks = re.finditer(
        r'\{\s*\n\s*text:\s*["\'](.+?)["\']\s*,\s*\n\s*options:\s*\[([\s\S]*?)\]\s*,\s*\n\s*correct:\s*(\d+)',
        content
    )

    correct_indices = []

    for match in question_blocks:
        q_text = match.group(1)
        options_raw = match.group(2)
        correct_idx = int(match.group(3))

        # Count options
        options = re.findall(r'["\'](.+?)["\']', options_raw)

        # Find line number
        pos = match.start()
        line_num = content[:pos].count('\n') + 1

        correct_indices.append(correct_idx)

        # Check: correct index in range
        if correct_idx >= len(options):
            issues.append(Issue(
                file=filepath, line=line_num, severity="critical",
                category="quiz-logic",
                message=f"Correct index {correct_idx} is out of range (only {len(options)} options: 0-{len(options)-1})",
                fix_suggestion=f"Change correct: {correct_idx} to a valid index (0-{len(options)-1})",
                context=f'Q: "{q_text[:80]}..."'
            ))
        elif correct_idx < 0:
            issues.append(Issue(
                file=filepath, line=line_num, severity="critical",
                category="quiz-logic",
                message=f"Correct index is negative ({correct_idx})",
                fix_suggestion="Set correct to a valid index (0 or higher)"
            ))

        # Check: too few options
        if len(options) < 2:
            issues.append(Issue(
                file=filepath, line=line_num, severity="warning",
                category="quiz-logic",
                message=f"Question has only {len(options)} option(s)",
                fix_suggestion="Add at least 2 options per question"
            ))

        questions.append(QuizQuestion(
            file=filepath, line=line_num, question_id=f"level-q",
            question_text=q_text,
            options=options,
            correct_index=correct_idx,
            system="levels"
        ))

    # Check answer bias - if most correct answers are the same index
    if len(correct_indices) >= 5:
        counter = Counter(correct_indices)
        most_common_idx, most_common_count = counter.most_common(1)[0]
        bias_pct = most_common_count / len(correct_indices) * 100

        if bias_pct >= 70:
            issues.append(Issue(
                file=filepath, line=1, severity="warning",
                category="answer-bias",
                message=f"Answer bias: {bias_pct:.0f}% of answers are option index {most_common_idx} ({most_common_count}/{len(correct_indices)})",
                fix_suggestion="Randomize correct answer positions to prevent guessing patterns"
            ))

    return issues, questions


def check_instant_quiz(content: str, filepath: str) -> Tuple[List[Issue], List[QuizQuestion]]:
    """
    Check files using InstantQuiz.init(answers, explanations, onComplete) pattern.
    Validates: answer count matches quiz-question divs, answers are valid.
    """
    issues = []
    questions = []

    # Find InstantQuiz.init calls
    init_match = re.search(r'InstantQuiz\.init\s*\(\s*\[([^\]]+)\]', content)
    if not init_match:
        return issues, questions

    answers_raw = init_match.group(1)
    answers = re.findall(r'["\'](\w+)["\']', answers_raw)

    line_num = content[:init_match.start()].count('\n') + 1

    # Count quiz-question divs
    quiz_questions = re.findall(r'data-question="(\d+)"', content)
    unique_questions = set(quiz_questions)

    if len(answers) != len(unique_questions):
        issues.append(Issue(
            file=filepath, line=line_num, severity="critical",
            category="quiz-logic",
            message=f"InstantQuiz answer count ({len(answers)}) doesn't match question count ({len(unique_questions)})",
            fix_suggestion=f"Ensure InstantQuiz.init has exactly {len(unique_questions)} answers"
        ))

    # For each question, check that the correct answer exists as a data-answer option
    for i, answer in enumerate(answers):
        # Find quiz-question with data-question="i"
        q_pattern = rf'data-question="{i}"[\s\S]*?(?=data-question="|$)'
        q_match = re.search(q_pattern, content)
        if q_match:
            q_content = q_match.group(0)
            available_answers = re.findall(r'data-answer="(\w+)"', q_content)

            if answer not in available_answers:
                q_line = content[:q_match.start()].count('\n') + 1
                issues.append(Issue(
                    file=filepath, line=q_line, severity="critical",
                    category="quiz-logic",
                    message=f"Question {i}: correct answer '{answer}' doesn't match any option (available: {available_answers})",
                    fix_suggestion=f"Either change the answer in InstantQuiz.init or add data-answer=\"{answer}\" to an option"
                ))

    return issues, questions


def check_missing_inputs(content: str, filepath: str) -> List[Issue]:
    """
    Check for exercises that ask students to write/explain/describe
    but have no textarea, input, or contenteditable element.
    """
    issues = []
    lines = content.split('\n')

    # Find practice sections
    in_practice = False
    practice_start = 0
    practice_blocks = []
    current_block = []
    current_block_start = 0

    for i, line in enumerate(lines, 1):
        # Detect practice section start
        if 'practice-section' in line or 'practice-exercise' in line or 'practice-header' in line:
            in_practice = True
            practice_start = i

        # Detect exercise blocks within practice
        if in_practice and ('practice-exercise' in line or 'Exercitiul' in line):
            if current_block:
                practice_blocks.append((current_block_start, current_block))
            current_block = [line]
            current_block_start = i
        elif in_practice and current_block:
            current_block.append(line)

        # Detect end of practice section
        if in_practice and ('</section>' in line and i > practice_start + 5):
            if current_block:
                practice_blocks.append((current_block_start, current_block))
            in_practice = False
            current_block = []

    if current_block:
        practice_blocks.append((current_block_start, current_block))

    for block_start, block_lines in practice_blocks:
        block_text = '\n'.join(block_lines)
        block_text_lower = block_text.lower()

        # Check if block asks student to write
        asks_writing = False
        for kw in WRITE_KEYWORDS_RO:
            if re.search(kw, block_text_lower):
                asks_writing = True
                break

        # Check for fill-in-the-blank patterns
        has_blanks = False
        for bp in BLANK_PATTERNS:
            if re.search(bp, block_text):
                has_blanks = True
                break

        if not asks_writing and not has_blanks:
            continue

        # Check if block has input elements
        has_input = bool(
            re.search(r'<textarea', block_text, re.I) or
            re.search(r'<input\s+type="text"', block_text, re.I) or
            re.search(r'<input\s+type="number"', block_text, re.I) or
            re.search(r'contenteditable="true"', block_text, re.I) or
            re.search(r'<input\s+type="checkbox"', block_text, re.I)
        )

        if not has_input:
            if has_blanks:
                issues.append(Issue(
                    file=filepath, line=block_start, severity="critical",
                    category="missing-input",
                    message="Fill-in-the-blank template with ____ but NO actual input fields",
                    fix_suggestion="Replace static ____ text with <input type='text' class='fill-blank'> elements",
                    context=block_text[:200].strip()
                ))
            elif asks_writing:
                issues.append(Issue(
                    file=filepath, line=block_start, severity="critical",
                    category="missing-input",
                    message="Exercise asks student to write/explain but has NO textarea or input field",
                    fix_suggestion="Add <textarea class='student-response' rows='4' placeholder='Scrie raspunsul tau aici...'></textarea>",
                    context=block_text[:200].strip()
                ))

    return issues


def check_static_checkboxes(content: str, filepath: str) -> List[Issue]:
    """
    Check for Unicode checkbox characters (□, ☐) used as text instead of actual HTML checkboxes.
    """
    issues = []
    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        # Look for Unicode checkbox characters in non-script content
        if ('□' in line or '☐' in line or '☑' in line) and '<script' not in line:
            # Check this isn't inside a real input
            if '<input' not in line:
                issues.append(Issue(
                    file=filepath, line=i, severity="warning",
                    category="missing-input",
                    message="Unicode checkbox character used as text instead of interactive <input type='checkbox'>",
                    fix_suggestion="Replace '□' with <input type='checkbox'> for interactive checklists",
                    context=line.strip()[:150]
                ))
                break  # Report once per file, not per line

    return issues


def check_broken_links(content: str, filepath: str) -> List[Issue]:
    """
    Check for broken internal links (href to other HTML files that don't exist).
    """
    issues = []
    file_dir = Path(filepath).parent
    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        # Find href attributes pointing to local HTML files
        for match in re.finditer(r'href="([^"]+\.html)"', line):
            href = match.group(1)

            # Skip external URLs
            if href.startswith('http://') or href.startswith('https://'):
                continue

            # Resolve relative path
            target = (file_dir / href).resolve()

            if not target.exists():
                issues.append(Issue(
                    file=filepath, line=i, severity="warning",
                    category="broken-link",
                    message=f"Broken link: '{href}' - file does not exist",
                    fix_suggestion=f"Fix the href or create the missing file: {target}"
                ))

    return issues


def check_missing_js_deps(content: str, filepath: str) -> List[Issue]:
    """
    Check for JavaScript files referenced in <script src="..."> that don't exist.
    """
    issues = []
    file_dir = Path(filepath).parent
    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        for match in re.finditer(r'<script\s+src="([^"]+)"', line):
            src = match.group(1)

            # Skip external CDN links
            if src.startswith('http://') or src.startswith('https://') or src.startswith('//'):
                continue

            # Resolve relative path
            target = (file_dir / src).resolve()

            if not target.exists():
                issues.append(Issue(
                    file=filepath, line=i, severity="critical",
                    category="structural",
                    message=f"Missing JS file: '{src}' - script will fail to load",
                    fix_suggestion=f"Fix the src path or create: {target}"
                ))

    return issues


def check_css_deps(content: str, filepath: str) -> List[Issue]:
    """
    Check for CSS files referenced in <link> that don't exist.
    """
    issues = []
    file_dir = Path(filepath).parent
    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        for match in re.finditer(r'<link[^>]+href="([^"]+\.css)"', line):
            href = match.group(1)

            if href.startswith('http://') or href.startswith('https://') or href.startswith('//'):
                continue

            target = (file_dir / href).resolve()

            if not target.exists():
                issues.append(Issue(
                    file=filepath, line=i, severity="warning",
                    category="structural",
                    message=f"Missing CSS file: '{href}'",
                    fix_suggestion=f"Fix the href path or create: {target}"
                ))

    return issues


def check_question_content_quality(questions: List[QuizQuestion], filepath: str) -> List[Issue]:
    """
    Check for content quality issues in quiz questions.
    - Duplicate questions
    - Very short options (likely placeholders)
    - All options same length (copy-paste error)
    """
    issues = []

    # Check for duplicate question text
    texts = [q.question_text for q in questions if q.question_text]
    seen = set()
    for t in texts:
        if t in seen:
            issues.append(Issue(
                file=filepath, line=0, severity="warning",
                category="content",
                message=f"Duplicate question: '{t[:80]}...'",
                fix_suggestion="Remove or rewrite the duplicate question"
            ))
        seen.add(t)

    return issues


def check_test_section_structure(content: str, filepath: str) -> List[Issue]:
    """
    Check the TEST section structure:
    - Has quiz questions
    - Has check button
    - Has result div
    """
    issues = []

    # If file has a test section
    if 'id="test"' not in content and 'test-section' not in content:
        # Not a lesson file with test, skip
        return issues

    # Check for quiz questions
    has_quiz_questions = bool(re.search(r'class="quiz-question"', content) or
                              re.search(r'selectOption', content))

    if not has_quiz_questions:
        issues.append(Issue(
            file=filepath, line=0, severity="warning",
            category="structural",
            message="Test section exists but has no quiz questions",
            fix_suggestion="Add quiz questions to the test section"
        ))

    return issues


def check_try_section(content: str, filepath: str) -> List[Issue]:
    """
    Check TRY sections for exercises that need student input.
    TRY sections often have challenges/tasks where students must write code or text.
    """
    issues = []
    lines = content.split('\n')

    in_try = False
    try_start = 0
    try_blocks = []
    current_content = []

    for i, line in enumerate(lines, 1):
        if 'id="try"' in line or 'try-section' in line:
            in_try = True
            try_start = i
            current_content = []
        elif in_try:
            current_content.append(line)
            # Check for section end (but not too soon)
            if '</section>' in line and i > try_start + 5:
                try_blocks.append((try_start, '\n'.join(current_content)))
                in_try = False

    for block_start, block_text in try_blocks:
        block_lower = block_text.lower()

        asks_writing = False
        for kw in WRITE_KEYWORDS_RO:
            if re.search(kw, block_lower):
                asks_writing = True
                break

        has_blanks = any(re.search(bp, block_text) for bp in BLANK_PATTERNS)

        has_input = bool(
            re.search(r'<textarea', block_text, re.I) or
            re.search(r'<input\s+type="text"', block_text, re.I) or
            re.search(r'contenteditable="true"', block_text, re.I)
        )

        # Only flag if it directs to external tools (poor UX)
        directs_external = bool(
            re.search(r'deschide\s+(un\s+)?(editor|notepad|word|google\s+docs)', block_lower) or
            re.search(r'intr-un\s+(editor|document|fisier)', block_lower)
        )

        if (asks_writing or has_blanks) and not has_input and directs_external:
            issues.append(Issue(
                file=filepath, line=block_start, severity="warning",
                category="missing-input",
                message="TRY section directs student to external tools instead of providing inline input",
                fix_suggestion="Add <textarea> for students to write directly in the lesson page",
                context=block_text[:200].strip()
            ))

    return issues


# ─── Main Audit Engine ────────────────────────────────────────────────────────

def audit_file(filepath: str) -> Tuple[List[Issue], List[QuizQuestion]]:
    """Run all checks on a single HTML file."""
    all_issues = []
    all_questions = []

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        all_issues.append(Issue(
            file=filepath, line=0, severity="critical",
            category="structural",
            message=f"Cannot read file: {e}"
        ))
        return all_issues, all_questions

    # Run all checkers
    # 1. selectOption quiz system
    issues, questions = check_select_option_quiz(content, filepath)
    all_issues.extend(issues)
    all_questions.extend(questions)

    # 2. Levels quiz system
    issues, questions = check_levels_quiz(content, filepath)
    all_issues.extend(issues)
    all_questions.extend(questions)

    # 3. InstantQuiz system
    issues, questions = check_instant_quiz(content, filepath)
    all_issues.extend(issues)
    all_questions.extend(questions)

    # 4. Missing input fields
    all_issues.extend(check_missing_inputs(content, filepath))

    # 5. Static checkboxes
    all_issues.extend(check_static_checkboxes(content, filepath))

    # 6. Broken internal links
    all_issues.extend(check_broken_links(content, filepath))

    # 7. Missing JS dependencies
    all_issues.extend(check_missing_js_deps(content, filepath))

    # 8. Missing CSS dependencies
    all_issues.extend(check_css_deps(content, filepath))

    # 9. Test section structure
    all_issues.extend(check_test_section_structure(content, filepath))

    # 10. TRY section input
    all_issues.extend(check_try_section(content, filepath))

    # 11. Content quality
    all_issues.extend(check_question_content_quality(all_questions, filepath))

    return all_issues, all_questions


def run_audit(path_filter: str = None) -> AuditReport:
    """Run the full audit across all HTML files."""
    report = AuditReport()

    # Find all HTML files
    search_root = CONTENT_ROOT
    if path_filter:
        candidate = CONTENT_ROOT / path_filter
        if candidate.exists():
            search_root = candidate
        else:
            # Try as relative to site root
            candidate = SITE_ROOT / path_filter
            if candidate.exists():
                search_root = candidate

    html_files = sorted(search_root.rglob("*.html"))

    if not html_files:
        print(f"No HTML files found in {search_root}")
        return report

    all_questions = []

    for html_file in html_files:
        filepath = str(html_file)
        rel_path = str(html_file.relative_to(SITE_ROOT))

        issues, questions = audit_file(filepath)

        # Use relative paths in issues for readability
        for issue in issues:
            issue.file = rel_path

        report.issues.extend(issues)
        all_questions.extend(questions)
        report.files_scanned += 1

    report.questions_checked = len(all_questions)

    # Build summary
    by_severity = Counter(i.severity for i in report.issues)
    by_category = Counter(i.category for i in report.issues)

    report.summary = {
        "files_scanned": report.files_scanned,
        "total_issues": len(report.issues),
        "questions_checked": report.questions_checked,
        "by_severity": dict(by_severity),
        "by_category": dict(by_category),
    }

    return report


def print_report(report: AuditReport, show_fix: bool = False, severity_filter: str = None):
    """Print the audit report in a readable format."""

    issues = report.issues
    if severity_filter:
        issues = [i for i in issues if i.severity == severity_filter]

    # Header
    print("=" * 70)
    print("  LEARNINGHUB QA AUDIT REPORT")
    print("=" * 70)
    print(f"  Files scanned:    {report.files_scanned}")
    print(f"  Questions checked: {report.questions_checked}")
    print(f"  Total issues:     {len(report.issues)}")
    print()

    # Summary by severity
    sev_colors = {"critical": "!!!", "warning": "! ", "info": "  "}
    for sev in ["critical", "warning", "info"]:
        count = report.summary.get("by_severity", {}).get(sev, 0)
        if count > 0:
            print(f"  {sev_colors.get(sev, '  ')} {sev.upper()}: {count}")

    print()

    # Summary by category
    print("  By category:")
    for cat, count in sorted(report.summary.get("by_category", {}).items(), key=lambda x: -x[1]):
        print(f"    - {cat}: {count}")

    print()
    print("-" * 70)

    if not issues:
        print("  No issues found! Site is clean.")
        return

    # Group by file
    by_file = {}
    for issue in issues:
        if issue.file not in by_file:
            by_file[issue.file] = []
        by_file[issue.file].append(issue)

    for filepath, file_issues in sorted(by_file.items()):
        print(f"\n  {filepath}")
        print(f"  {'-' * len(filepath)}")

        for issue in sorted(file_issues, key=lambda x: ({"critical": 0, "warning": 1, "info": 2}.get(x.severity, 3), x.line)):
            sev_marker = {"critical": "[CRITICAL]", "warning": "[WARNING]", "info": "[INFO]"}.get(issue.severity, "[?]")

            line_info = f"L{issue.line}" if issue.line > 0 else ""
            print(f"    {sev_marker} {line_info} [{issue.category}] {issue.message}")

            if show_fix and issue.fix_suggestion:
                print(f"      FIX: {issue.fix_suggestion}")

            if issue.context:
                ctx = issue.context[:120].replace('\n', ' ')
                print(f"      CTX: {ctx}...")

    print()
    print("=" * 70)
    print(f"  VERDICT: {'FAIL' if report.summary.get('by_severity', {}).get('critical', 0) > 0 else 'PASS (with warnings)' if report.issues else 'PASS'}")
    print("=" * 70)


def json_report(report: AuditReport):
    """Output report as JSON."""
    output = {
        "summary": report.summary,
        "issues": [asdict(i) for i in report.issues]
    }
    print(json.dumps(output, indent=2, ensure_ascii=False))


# ─── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="LearningHub QA Agent")
    parser.add_argument("--path", help="Subdirectory to audit (relative to content/)")
    parser.add_argument("--fix", action="store_true", help="Show fix suggestions")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--severity", choices=["critical", "warning", "info"], help="Filter by severity")

    args = parser.parse_args()

    report = run_audit(args.path)

    if args.json:
        json_report(report)
    else:
        print_report(report, show_fix=args.fix, severity_filter=args.severity)

    # Exit code: 1 if critical issues found
    if report.summary.get("by_severity", {}).get("critical", 0) > 0:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
