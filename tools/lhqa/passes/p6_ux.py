"""Pass 6: User Experience - 10 checks (mostly automated, some require browser).

Validates page rendering, interactive elements, navigation, print layout,
quiz submission flow, mobile responsiveness.

Note: Full UX testing requires Playwright. Without it, structural UX checks
are performed based on HTML analysis.
"""

import json
import re
from pathlib import Path
from typing import Optional

from ..models import CheckResult, PassResult
from .. import loader

PASS_NUMBER = 6
PASS_NAME = "User Experience"


def run(ctx: dict, **kwargs) -> PassResult:
    """Run all 10 UX checks."""
    result = PassResult(pass_number=PASS_NUMBER, pass_name=PASS_NAME)
    lesson = ctx.get("lesson")
    quiz = ctx.get("quiz")
    lesson_code = ctx.get("lesson_code", "")
    parsed = ctx.get("parsed", {})

    if not lesson:
        result.checks.append(CheckResult(
            check_id="6.0", check_name="Data available",
            passed=False, details="No lesson data", severity="critical",
        ))
        return result

    # Find corresponding HTML file(s)
    html_path = _find_html_file(lesson_code, parsed)
    html_content = _read_html(html_path) if html_path else None

    # 6.1 HTML renders without errors
    result.checks.append(_check_6_1(html_path, html_content))

    # 6.2 Interactive elements present
    result.checks.append(_check_6_2(html_content, html_path))

    # 6.3 Navigation works (links resolve)
    result.checks.append(_check_6_3(html_content, html_path))

    # 6.4 Print layout consideration
    result.checks.append(_check_6_4(html_content))

    # 6.5 Quiz submission flow elements present
    result.checks.append(_check_6_5(html_content, quiz))

    # 6.6 No dead-end pages
    result.checks.append(_check_6_6(html_content))

    # 6.7 Mobile responsive meta tag
    result.checks.append(_check_6_7(html_content))

    # 6.8 Asset references valid
    result.checks.append(_check_6_8(html_content, html_path))

    # 6.9 Practice sections have input fields
    result.checks.append(_check_6_9(html_content))

    # 6.10 Quiz feedback mechanism present
    result.checks.append(_check_6_10(html_content))

    return result


def _find_html_file(lesson_code: str, parsed: dict) -> Optional[Path]:
    """Find the HTML file for a lesson."""
    if not parsed:
        return None
    grade = parsed.get("grade", "")
    module = parsed.get("module", 1)
    grade_num = loader.GRADE_NUMS.get(grade, grade)

    # Common patterns for HTML locations
    candidates = [
        loader.PROJECT_ROOT / "content" / "tic" / f"cls{grade_num}" / f"m{module}" / f"{lesson_code}.html",
        loader.PROJECT_ROOT / "content" / "tic" / f"cls{grade_num}" / f"m{module}" / "index.html",
        loader.CONTENT_GIMNAZIU / grade / f"m{module}" / f"{lesson_code}.html",
    ]
    # Also try lesson number-based naming
    lesson_num = parsed.get("lesson", 1)
    candidates.extend([
        loader.PROJECT_ROOT / "content" / "tic" / f"cls{grade_num}" / f"m{module}" / f"lectia{lesson_num}.html",
        loader.PROJECT_ROOT / "content" / "tic" / f"cls{grade_num}" / f"m{module}" / f"l{lesson_num:02d}.html",
    ])

    for c in candidates:
        if c.exists():
            return c
    return None


def _read_html(path: Path) -> Optional[str]:
    """Read HTML file content."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return None


def _check_6_1(html_path: Optional[Path], html_content: Optional[str]) -> CheckResult:
    """HTML file exists and is parseable."""
    if not html_path:
        return CheckResult(
            check_id="6.1", check_name="HTML renders",
            passed=True,
            details="No HTML file found (lesson may be JSON-only, served via JS renderer)",
            severity="minor",
        )
    if not html_content:
        return CheckResult(
            check_id="6.1", check_name="HTML renders",
            passed=False, details=f"Cannot read HTML: {html_path.name}",
            severity="major",
        )
    # Basic HTML structure check
    has_html = "<html" in html_content.lower()
    has_body = "<body" in html_content.lower()
    has_head = "<head" in html_content.lower()
    if not (has_html and has_body):
        return CheckResult(
            check_id="6.1", check_name="HTML renders",
            passed=False,
            details=f"Incomplete HTML structure in {html_path.name} (html={has_html}, body={has_body})",
            severity="major",
        )
    return CheckResult(
        check_id="6.1", check_name="HTML renders",
        passed=True, details=f"HTML structure valid: {html_path.name}",
    )


def _check_6_2(html_content: Optional[str], html_path: Optional[Path]) -> CheckResult:
    """Interactive elements (buttons, inputs, quiz elements) present."""
    if not html_content:
        return CheckResult(
            check_id="6.2", check_name="Interactive elements",
            passed=True, details="No HTML to check",
        )
    buttons = len(re.findall(r'<button\b', html_content, re.IGNORECASE))
    inputs = len(re.findall(r'<input\b', html_content, re.IGNORECASE))
    textareas = len(re.findall(r'<textarea\b', html_content, re.IGNORECASE))
    selects = len(re.findall(r'<select\b', html_content, re.IGNORECASE))
    total = buttons + inputs + textareas + selects

    if total == 0:
        return CheckResult(
            check_id="6.2", check_name="Interactive elements",
            passed=False,
            details="No interactive elements (buttons, inputs, textareas, selects) found",
            severity="major",
            fix_suggestion="Add interactive elements for student engagement",
        )
    return CheckResult(
        check_id="6.2", check_name="Interactive elements",
        passed=True,
        details=f"Found {total} interactive elements (buttons={buttons}, inputs={inputs}, textareas={textareas})",
    )


def _check_6_3(html_content: Optional[str], html_path: Optional[Path]) -> CheckResult:
    """Navigation links resolve to existing files."""
    if not html_content or not html_path:
        return CheckResult(
            check_id="6.3", check_name="Navigation links valid",
            passed=True, details="No HTML to check",
        )
    hrefs = re.findall(r'href=["\']([^"\']+)["\']', html_content)
    broken = []
    for href in hrefs:
        if href.startswith(("http", "mailto:", "tel:", "#", "javascript:")):
            continue
        resolved = html_path.parent / href
        if not resolved.exists():
            broken.append(href)
    if broken:
        return CheckResult(
            check_id="6.3", check_name="Navigation links valid",
            passed=False,
            details=f"{len(broken)} broken links: {', '.join(broken[:5])}",
            severity="major",
            fix_suggestion="Fix or remove broken navigation links",
        )
    return CheckResult(
        check_id="6.3", check_name="Navigation links valid",
        passed=True, details=f"All {len(hrefs)} links valid",
    )


def _check_6_4(html_content: Optional[str]) -> CheckResult:
    """Print layout consideration (print CSS or print-friendly structure)."""
    if not html_content:
        return CheckResult(
            check_id="6.4", check_name="Print layout",
            passed=True, details="No HTML to check",
        )
    has_print_css = bool(re.search(r'media\s*=\s*["\']print["\']', html_content))
    has_print_style = bool(re.search(r'@media\s+print', html_content))
    has_print_class = bool(re.search(r'class\s*=\s*["\'][^"\']*print', html_content))

    if has_print_css or has_print_style or has_print_class:
        return CheckResult(
            check_id="6.4", check_name="Print layout",
            passed=True, details="Print styles detected",
        )
    return CheckResult(
        check_id="6.4", check_name="Print layout",
        passed=False,
        details="No print-specific CSS or classes found",
        severity="minor",
        fix_suggestion="Add @media print styles for clean printout",
    )


def _check_6_5(html_content: Optional[str], quiz: dict) -> CheckResult:
    """Quiz submission flow elements present."""
    if not html_content:
        return CheckResult(
            check_id="6.5", check_name="Quiz submission flow",
            passed=True, details="No HTML to check (quiz may be rendered via JS)",
        )
    if not quiz:
        return CheckResult(
            check_id="6.5", check_name="Quiz submission flow",
            passed=True, details="No quiz data",
        )
    has_submit = bool(re.search(r'(submit|verifica|trimite|check)', html_content, re.IGNORECASE))
    has_quiz_container = bool(re.search(r'(quiz|test|evaluare|fisa)', html_content, re.IGNORECASE))

    if has_quiz_container and not has_submit:
        return CheckResult(
            check_id="6.5", check_name="Quiz submission flow",
            passed=False,
            details="Quiz container found but no submit/verify mechanism",
            severity="major",
            fix_suggestion="Add a submit or verify button for quiz answers",
        )
    return CheckResult(
        check_id="6.5", check_name="Quiz submission flow",
        passed=True, details="Quiz submission mechanism detected" if has_submit else "No quiz in HTML",
    )


def _check_6_6(html_content: Optional[str]) -> CheckResult:
    """No dead-end pages (has next/back/home link)."""
    if not html_content:
        return CheckResult(
            check_id="6.6", check_name="No dead-end pages",
            passed=True, details="No HTML to check",
        )
    nav_patterns = [
        r'(next|urmat|inainte)',
        r'(back|inapoi|prev)',
        r'(home|acasa|index|menu|cuprins)',
    ]
    has_nav = any(re.search(p, html_content, re.IGNORECASE) for p in nav_patterns)
    if not has_nav:
        return CheckResult(
            check_id="6.6", check_name="No dead-end pages",
            passed=False,
            details="No navigation links (next, back, home) found",
            severity="major",
            fix_suggestion="Add navigation links to prevent dead-end pages",
        )
    return CheckResult(
        check_id="6.6", check_name="No dead-end pages",
        passed=True, details="Navigation elements present",
    )


def _check_6_7(html_content: Optional[str]) -> CheckResult:
    """Mobile responsive meta viewport tag."""
    if not html_content:
        return CheckResult(
            check_id="6.7", check_name="Mobile responsive",
            passed=True, details="No HTML to check",
        )
    has_viewport = bool(re.search(r'name\s*=\s*["\']viewport["\']', html_content))
    if not has_viewport:
        return CheckResult(
            check_id="6.7", check_name="Mobile responsive",
            passed=False,
            details="No viewport meta tag found",
            severity="minor",
            fix_suggestion='Add <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        )
    return CheckResult(
        check_id="6.7", check_name="Mobile responsive",
        passed=True, details="Viewport meta tag present",
    )


def _check_6_8(html_content: Optional[str], html_path: Optional[Path]) -> CheckResult:
    """Asset references (JS/CSS/images) resolve."""
    if not html_content or not html_path:
        return CheckResult(
            check_id="6.8", check_name="Assets valid",
            passed=True, details="No HTML to check",
        )
    # Check script src, link href, img src
    assets = []
    assets.extend(re.findall(r'src=["\']([^"\']+)["\']', html_content))
    assets.extend(re.findall(r'href=["\']([^"\']+\.(?:css|js|png|jpg|gif|svg))["\']', html_content))

    broken = []
    for asset in assets:
        if asset.startswith(("http", "data:", "//")):
            continue
        resolved = html_path.parent / asset
        if not resolved.exists():
            broken.append(asset)

    if broken:
        return CheckResult(
            check_id="6.8", check_name="Assets valid",
            passed=False,
            details=f"{len(broken)} missing assets: {', '.join(broken[:5])}",
            severity="major",
            fix_suggestion="Fix asset paths or add missing files",
        )
    return CheckResult(
        check_id="6.8", check_name="Assets valid",
        passed=True, details=f"All {len(assets)} asset references valid",
    )


def _check_6_9(html_content: Optional[str]) -> CheckResult:
    """Practice sections have input fields where students need to write."""
    if not html_content:
        return CheckResult(
            check_id="6.9", check_name="Practice inputs present",
            passed=True, details="No HTML to check",
        )
    # Find practice/exercise sections
    practice_match = re.search(
        r'(practice|exercitiu|activitate|practica)(.*?)(</section>|</div>)',
        html_content, re.IGNORECASE | re.DOTALL
    )
    if not practice_match:
        return CheckResult(
            check_id="6.9", check_name="Practice inputs present",
            passed=True, details="No practice section detected in HTML",
        )
    practice_html = practice_match.group(0)
    has_input = bool(re.search(r'(<input|<textarea|<select|contenteditable)', practice_html, re.IGNORECASE))
    if not has_input:
        return CheckResult(
            check_id="6.9", check_name="Practice inputs present",
            passed=False,
            details="Practice section found but no input fields for student responses",
            severity="major",
            fix_suggestion="Add textarea or input fields in practice sections",
        )
    return CheckResult(
        check_id="6.9", check_name="Practice inputs present",
        passed=True, details="Practice section has input fields",
    )


def _check_6_10(html_content: Optional[str]) -> CheckResult:
    """Quiz feedback mechanism (shows right/wrong on answer)."""
    if not html_content:
        return CheckResult(
            check_id="6.10", check_name="Quiz feedback mechanism",
            passed=True, details="No HTML to check",
        )
    feedback_patterns = [
        r'(correct|corect|gresit|wrong|feedback)',
        r'(data-correct|data-answer|checkAnswer|verificaRaspuns)',
        r'(\.correct|\.wrong|\.feedback|\.result)',
    ]
    has_feedback = any(re.search(p, html_content, re.IGNORECASE) for p in feedback_patterns)
    if not has_feedback:
        # Check in script content
        scripts = re.findall(r'<script[^>]*>(.*?)</script>', html_content, re.DOTALL | re.IGNORECASE)
        has_feedback = any(
            re.search(r'(correct|feedback|answer|raspuns)', s, re.IGNORECASE)
            for s in scripts
        )
    if not has_feedback:
        return CheckResult(
            check_id="6.10", check_name="Quiz feedback mechanism",
            passed=False,
            details="No quiz feedback mechanism found (no correct/wrong indicators)",
            severity="major",
            fix_suggestion="Add immediate feedback for quiz answers",
        )
    return CheckResult(
        check_id="6.10", check_name="Quiz feedback mechanism",
        passed=True, details="Quiz feedback mechanism detected",
    )
