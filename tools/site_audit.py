"""
LearningHub Full Site Audit
============================
Checks ALL lesson HTML files for common problems:
1. JS syntax errors (unescaped quotes in template literals)
2. Missing/incorrect script includes
3. Missing breadcrumb initialization
4. Skeleton content (too thin to be a real lesson)
5. Quiz system initialization issues
6. Broken internal links
7. Missing quiz directories/files
8. GoToStep function issues
9. Practice section placement
"""

import os
import re
import json
import sys
from pathlib import Path
from collections import defaultdict

SITE_ROOT = Path(r"C:\AI\Projects\LearningHub")
CONTENT_ROOT = SITE_ROOT / "content" / "tic"

# Required JS files for full-format lessons
CORE_JS_FILES = [
    "breadcrumb.js",
    "progress.js",
]

# Optional but important JS files
OPTIONAL_JS_FILES = [
    "quiz-bridge.js",
    "atomic-learning.js",
    "lesson-summary.js",
    "practice-simple.js",
    "practice-advanced.js",
    "user-system.js",
]

class Issue:
    CRITICAL = "CRITICAL"
    WARNING = "WARNING"
    INFO = "INFO"

    def __init__(self, severity, category, message, file_path, line=None):
        self.severity = severity
        self.category = category
        self.message = message
        self.file_path = file_path
        self.line = line

    def __str__(self):
        loc = f":{self.line}" if self.line else ""
        rel = os.path.relpath(self.file_path, SITE_ROOT)
        return f"[{self.severity}] {self.category}: {self.message} ({rel}{loc})"


def find_all_lessons():
    """Find all HTML files under content/tic/"""
    lessons = []
    for root, dirs, files in os.walk(CONTENT_ROOT):
        # Skip quiz directories
        if "quizuri" in root:
            continue
        for f in files:
            if f.endswith(".html"):
                lessons.append(os.path.join(root, f))
    return sorted(lessons)


def check_js_syntax(content, filepath):
    """Check for JS syntax errors - unescaped quotes in template literals"""
    issues = []

    # Find all <script> blocks
    script_blocks = re.finditer(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)

    for block in script_blocks:
        script = block.group(1)
        start_pos = block.start(1)

        # Check for the specific bug: single-quoted string containing onclick with single quotes
        # Pattern: '...<button onclick="goToStep('...')">...'
        # NOTE: This is VALID inside backtick template literals, so we must exclude those.
        bad_patterns = [
            (r"'[^']*onclick=\"goToStep\('[^']*'\)\"[^']*'", "Single-quoted string contains goToStep('...') - will break JS parser"),
            (r"'[^']*onclick=\"[^\"]*\('[^']*'\)[^\"]*\"[^']*'", "Single-quoted string contains function call with quotes in onclick"),
        ]

        for pattern, msg in bad_patterns:
            matches = re.finditer(pattern, script)
            for m in matches:
                # Skip matches inside backtick template literals (single quotes are valid there)
                match_line = script[script.rfind('\n', 0, m.start())+1:script.find('\n', m.end())]
                if '`' in match_line or '${' in match_line:
                    continue
                line_num = content[:start_pos + m.start()].count('\n') + 1
                issues.append(Issue(Issue.CRITICAL, "JS_SYNTAX", msg, filepath, line_num))

        # Check for unmatched template literals (backticks)
        backtick_count = script.count('`')
        if backtick_count % 2 != 0:
            issues.append(Issue(Issue.CRITICAL, "JS_SYNTAX", f"Odd number of backticks ({backtick_count}) - likely unmatched template literal", filepath))

        # Check for common JS errors: undefined function references in onclick
        # that are NOT defined in the script
        defined_functions = set(re.findall(r'function\s+(\w+)\s*\(', script))
        called_in_onclick = set(re.findall(r'onclick="(\w+)\(', content))

        undefined = called_in_onclick - defined_functions - {
            'window', 'document', 'console', 'alert', 'confirm', 'prompt',
            'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
            'QuizBridge', 'LessonSummary', 'PracticeSimple', 'LearningProgress',
            'Breadcrumb', 'AtomicLearning', 'PracticeAdvanced',
        }
        # These might be defined in external scripts, so only warn
        for fn in undefined:
            issues.append(Issue(Issue.INFO, "JS_UNDEFINED", f"onclick calls {fn}() - not defined in inline script (may be in external JS)", filepath))

    return issues


def check_script_includes(content, filepath):
    """Check for required script includes"""
    issues = []

    # Skip index files - they have different requirements
    if os.path.basename(filepath) == "index.html":
        return issues

    # Find all script src includes
    script_srcs = re.findall(r'<script\s+src="([^"]+)"', content)
    script_basenames = [os.path.basename(s) for s in script_srcs]

    # Check for breadcrumb.js
    if "breadcrumb.js" not in script_basenames:
        issues.append(Issue(Issue.WARNING, "MISSING_SCRIPT", "Missing breadcrumb.js include", filepath))

    # Check if it has quiz content but no quiz JS
    has_quiz_content = bool(re.search(r'class="quiz-question|class="atom-quiz|data-quiz|QuizBridge|AtomicLearning', content))
    has_quiz_js = any(js in script_basenames for js in ["quiz-bridge.js", "atomic-learning.js", "quiz.js", "quiz-engine.js"])

    if has_quiz_content and not has_quiz_js:
        issues.append(Issue(Issue.CRITICAL, "MISSING_SCRIPT", "Has quiz content but no quiz JS include", filepath))

    # Check if it uses goToStep but no inline script defines it
    uses_gotostep = 'goToStep' in content
    has_gotostep_def = 'function goToStep' in content
    if uses_gotostep and not has_gotostep_def:
        # Check if it's in an external script
        issues.append(Issue(Issue.INFO, "MISSING_FUNCTION", "Uses goToStep() but function not defined inline (check external JS)", filepath))

    return issues


def check_breadcrumb(content, filepath):
    """Check breadcrumb initialization"""
    issues = []

    if os.path.basename(filepath) == "index.html":
        # Index files should have breadcrumb too
        if "Breadcrumb.init" not in content and "breadcrumb.js" in content:
            issues.append(Issue(Issue.WARNING, "BREADCRUMB", "Includes breadcrumb.js but never calls Breadcrumb.init()", filepath))
        return issues

    has_breadcrumb_js = "breadcrumb.js" in content
    has_breadcrumb_init = "Breadcrumb.init" in content

    if has_breadcrumb_js and not has_breadcrumb_init:
        issues.append(Issue(Issue.WARNING, "BREADCRUMB", "Includes breadcrumb.js but never calls Breadcrumb.init()", filepath))

    if has_breadcrumb_init:
        # Check if grade param matches the actual directory
        grade_match = re.search(r"grade:\s*['\"](\w+)['\"]", content)
        if grade_match:
            expected_grade = None
            parts = filepath.replace("\\", "/").split("/")
            for p in parts:
                if p.startswith("cls"):
                    expected_grade = p
                    break
            if expected_grade and grade_match.group(1) != expected_grade:
                issues.append(Issue(Issue.CRITICAL, "BREADCRUMB", f"Breadcrumb grade='{grade_match.group(1)}' but file is in {expected_grade}", filepath))

    return issues


def check_content_quality(content, filepath):
    """Check for skeleton/thin content"""
    issues = []

    if os.path.basename(filepath) == "index.html":
        return issues

    # File size check
    size = len(content)

    # Count meaningful content indicators
    paragraphs = len(re.findall(r'<p[^>]*>', content))
    headings = len(re.findall(r'<h[1-6][^>]*>', content))
    quiz_questions = len(re.findall(r'class="quiz-question|class="question-card|data-question', content))
    atoms = len(re.findall(r'class="atom[^"]*"', content))
    sections = len(re.findall(r'class="section[^"]*"|class="step[^"]*"', content))

    # Skeleton detection: very small file with few content elements
    if size < 15000 and paragraphs < 10 and quiz_questions < 3:
        issues.append(Issue(Issue.CRITICAL, "SKELETON", f"Thin content: {size} bytes, {paragraphs} paragraphs, {quiz_questions} quiz questions", filepath))
    elif size < 25000 and paragraphs < 15 and quiz_questions < 5:
        issues.append(Issue(Issue.WARNING, "THIN_CONTENT", f"Below average content: {size} bytes, {paragraphs} paragraphs, {quiz_questions} quiz questions", filepath))

    # Check for placeholder text
    placeholders = re.findall(r'TODO|FIXME|PLACEHOLDER|Lorem ipsum|xxx|TBD', content, re.IGNORECASE)
    if placeholders:
        issues.append(Issue(Issue.WARNING, "PLACEHOLDER", f"Found placeholder text: {', '.join(set(placeholders))}", filepath))

    return issues


def check_internal_links(content, filepath):
    """Check for broken internal links"""
    issues = []
    file_dir = os.path.dirname(filepath)

    # Find all href links that are local
    links = re.findall(r'href="([^"#][^"]*)"', content)

    for link in links:
        # Skip external links, javascript:, mailto:
        if link.startswith(('http://', 'https://', 'javascript:', 'mailto:', '#', 'data:')):
            continue

        # Resolve relative path
        target = os.path.normpath(os.path.join(file_dir, link))

        if not os.path.exists(target):
            # Check if it's a directory reference (index.html implied)
            if not os.path.exists(target.rstrip('/') + '/index.html'):
                issues.append(Issue(Issue.WARNING, "BROKEN_LINK", f"Link target not found: {link}", filepath))

    return issues


def check_quiz_files(content, filepath):
    """Check if referenced quiz files exist"""
    issues = []
    file_dir = os.path.dirname(filepath)

    # Check for quiz references
    quiz_refs = re.findall(r'(?:href|src|data-quiz-file)="([^"]*quiz[^"]*)"', content, re.IGNORECASE)

    for ref in quiz_refs:
        if ref.startswith(('http://', 'https://')):
            continue
        target = os.path.normpath(os.path.join(file_dir, ref))
        if not os.path.exists(target):
            issues.append(Issue(Issue.WARNING, "MISSING_QUIZ", f"Quiz file not found: {ref}", filepath))

    return issues


def check_practice_placement(content, filepath):
    """Check if practice sections are properly gated"""
    issues = []

    if os.path.basename(filepath) == "index.html":
        return issues

    # If the lesson uses goToStep navigation (full format), practice should be gated
    has_gotostep = 'function goToStep' in content
    has_practice = 'class="practice-section"' in content or 'class="practice-area"' in content

    if has_gotostep and has_practice:
        # Check if practice is inside a step-gated section or has display:none
        practice_match = re.search(r'<(?:section|div)[^>]*class="practice-(?:section|area)"[^>]*>', content)
        if practice_match:
            # Check if it has display:none or is inside a step section
            practice_html = practice_match.group(0)
            if 'display: none' not in practice_html and 'display:none' not in practice_html:
                # Check surrounding context for step gating
                pos = practice_match.start()
                context_before = content[max(0, pos-500):pos]
                if 'id="step-' not in context_before and 'id="section-test' not in context_before:
                    issues.append(Issue(Issue.WARNING, "PRACTICE_UNGATED", "Practice section may be visible before test completion", filepath))

    return issues


def check_module_index(filepath, content):
    """Check module index pages for consistency"""
    issues = []

    if os.path.basename(filepath) != "index.html":
        return issues

    file_dir = os.path.dirname(filepath)

    # Find lesson links in the index
    lesson_links = re.findall(r'href="(lectia[^"]+\.html)"', content)

    # Check each referenced lesson exists
    for link in lesson_links:
        target = os.path.join(file_dir, link)
        if not os.path.exists(target):
            issues.append(Issue(Issue.CRITICAL, "BROKEN_INDEX", f"Index references {link} but file doesn't exist", filepath))

    # Check for lesson files that exist but aren't linked
    existing_lessons = [f for f in os.listdir(file_dir) if f.startswith("lectia") and f.endswith(".html")]
    unlinked = set(existing_lessons) - set(lesson_links)
    for ul in unlinked:
        issues.append(Issue(Issue.INFO, "UNLINKED_LESSON", f"Lesson file {ul} exists but not linked from index", filepath))

    return issues


def check_onclick_quotes(content, filepath):
    """Check for unescaped double quotes inside onclick attributes (CRITICAL).

    Pattern: onclick="...text with "quotes" inside..." breaks the HTML attribute.
    Fix: use &quot; instead of literal " inside onclick values.
    """
    issues = []

    if os.path.basename(filepath) == "index.html":
        return issues

    # Only check HTML outside <script> blocks
    # Remove script blocks first
    no_scripts = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)

    for line_num, line in enumerate(no_scripts.split('\n'), 1):
        if 'onclick="' not in line:
            continue

        # Find all onclick attributes on this line
        for match in re.finditer(r'onclick="', line):
            start = match.end()
            # Walk forward tracking single-quote strings and parens
            depth = 0
            in_sq = False
            j = start
            has_bad_quote = False
            while j < len(line):
                ch = line[j]
                if ch == "'" and not in_sq:
                    in_sq = True
                elif ch == "'" and in_sq:
                    in_sq = False
                elif ch == '(' and not in_sq:
                    depth += 1
                elif ch == ')' and not in_sq:
                    depth -= 1
                    if depth <= 0:
                        break
                elif ch == '"' and not in_sq:
                    if depth == 0:
                        # This is the closing " of the onclick attribute — valid
                        break
                    has_bad_quote = True
                    break
                j += 1

            if has_bad_quote:
                # Get surrounding text for context
                context = line[max(0, match.start()-10):min(len(line), j+30)].strip()
                issues.append(Issue(
                    Issue.CRITICAL, "ONCLICK_QUOTES",
                    f"Unescaped \" inside onclick attribute breaks handler",
                    filepath, line_num
                ))

    return issues


def check_exercise_class(content, filepath):
    """Check for .exercise class that should be .practice-exercise.

    practice-simple.js now accepts both, but .practice-exercise is preferred.
    """
    issues = []

    if os.path.basename(filepath) == "index.html":
        return issues

    # Check if file has practice section
    has_practice = bool(re.search(r'practice-simple\.js|PracticeSimple', content))
    if not has_practice:
        return issues

    # Find .exercise without .practice-exercise
    exercise_only = re.findall(r'class="exercise"', content)
    practice_exercise = re.findall(r'class="practice-exercise"', content)

    if exercise_only and not practice_exercise:
        issues.append(Issue(
            Issue.WARNING, "EXERCISE_CLASS",
            f"Uses class='exercise' ({len(exercise_only)}x) instead of 'practice-exercise' - works but non-standard",
            filepath
        ))

    return issues


def check_css_consistency(content, filepath):
    """Check for CSS issues"""
    issues = []

    if os.path.basename(filepath) == "index.html":
        return issues

    # Check for inline styles that conflict with the global theme
    # (e.g., hardcoded light-mode colors in a dark-mode site)
    light_colors = re.findall(r'(?:background|color)\s*:\s*(white|#fff|#ffffff|rgb\(255)', content, re.IGNORECASE)
    if len(light_colors) > 5:
        issues.append(Issue(Issue.INFO, "CSS_THEME", f"Many hardcoded light colors ({len(light_colors)}) - may conflict with dark theme", filepath))

    return issues


def run_audit(quick_mode=False):
    """Run the full audit. quick_mode=True only checks CRITICAL issues."""
    lessons = find_all_lessons()
    all_issues = []

    mode_label = "QUICK (CRITICALs only)" if quick_mode else "FULL"
    print(f"LearningHub Site Audit [{mode_label}]")
    print(f"{'=' * 60}")
    print(f"Scanning {len(lessons)} HTML files...\n")

    for filepath in lessons:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            all_issues.append(Issue(Issue.CRITICAL, "READ_ERROR", str(e), filepath))
            continue

        # Run all checks
        all_issues.extend(check_js_syntax(content, filepath))
        all_issues.extend(check_onclick_quotes(content, filepath))
        all_issues.extend(check_script_includes(content, filepath))
        if not quick_mode:
            all_issues.extend(check_breadcrumb(content, filepath))
            all_issues.extend(check_content_quality(content, filepath))
            all_issues.extend(check_internal_links(content, filepath))
            all_issues.extend(check_quiz_files(content, filepath))
            all_issues.extend(check_practice_placement(content, filepath))
            all_issues.extend(check_module_index(filepath, content))
            all_issues.extend(check_css_consistency(content, filepath))
            all_issues.extend(check_exercise_class(content, filepath))

    # Group by severity
    critical = [i for i in all_issues if i.severity == Issue.CRITICAL]
    warnings = [i for i in all_issues if i.severity == Issue.WARNING]
    info = [i for i in all_issues if i.severity == Issue.INFO]

    # Group by category
    by_category = defaultdict(list)
    for issue in all_issues:
        by_category[issue.category].append(issue)

    # Print summary
    print(f"\n{'=' * 60}")
    print(f"AUDIT RESULTS")
    print(f"{'=' * 60}")
    print(f"Total files scanned: {len(lessons)}")
    print(f"Total issues: {len(all_issues)}")
    print(f"  CRITICAL: {len(critical)}")
    print(f"  WARNING:  {len(warnings)}")
    print(f"  INFO:     {len(info)}")

    print(f"\n{'=' * 60}")
    print(f"CRITICAL ISSUES ({len(critical)})")
    print(f"{'=' * 60}")
    for issue in critical:
        print(f"  {issue}")

    print(f"\n{'=' * 60}")
    print(f"WARNINGS ({len(warnings)})")
    print(f"{'=' * 60}")
    for issue in warnings:
        print(f"  {issue}")

    print(f"\n{'=' * 60}")
    print(f"BY CATEGORY")
    print(f"{'=' * 60}")
    for cat in sorted(by_category.keys()):
        issues = by_category[cat]
        crits = len([i for i in issues if i.severity == Issue.CRITICAL])
        warns = len([i for i in issues if i.severity == Issue.WARNING])
        infos = len([i for i in issues if i.severity == Issue.INFO])
        print(f"  {cat}: {len(issues)} total ({crits}C/{warns}W/{infos}I)")

    # Save detailed report as JSON
    report = {
        "total_files": len(lessons),
        "total_issues": len(all_issues),
        "critical": len(critical),
        "warnings": len(warnings),
        "info": len(info),
        "issues": [
            {
                "severity": i.severity,
                "category": i.category,
                "message": i.message,
                "file": os.path.relpath(i.file_path, SITE_ROOT),
                "line": i.line,
            }
            for i in all_issues
        ]
    }

    report_path = SITE_ROOT / "tools" / "audit_report.json"
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"\nDetailed report saved to: {report_path}")

    return all_issues


if __name__ == "__main__":
    quick = "--quick" in sys.argv
    issues = run_audit(quick_mode=quick)

    # Exit with error code if any CRITICALs found (for pre-commit hook)
    critical_count = len([i for i in issues if i.severity == Issue.CRITICAL])
    if critical_count > 0:
        sys.exit(1)
