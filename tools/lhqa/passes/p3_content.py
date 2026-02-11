"""Pass 3: Content Quality - 11 checks (1 automated, 10 AI-evaluated).

Evaluates factual accuracy, language level, examples, Romanian grammar,
terminology consistency, and absence of placeholder text.
"""

import json
import re

from ..models import CheckResult, PassResult
from ..ai_eval import AIEvaluator

PASS_NUMBER = 3
PASS_NAME = "Content Quality"

PLACEHOLDER_PATTERNS = [
    r'\bTODO\b', r'\bTBD\b', r'\bFIXME\b', r'\bXXX\b',
    r'\blorem\s+ipsum\b',
    r'\bINSERT\b.*\bHERE\b', r'\bCOMPLETEAZA\b',
    # Note: PLACEHOLDER removed — valid CS/design term (e.g., "Placeholder (Caseta de text)").
    # Note: "DE COMPLETAT" removed — Romanian "de completat" = "to fill in" in exercises.
    # Note: _+ removed — underscores are valid fill-in-the-blank markers in exercises.
]


def run(ctx: dict, ai: AIEvaluator = None) -> PassResult:
    """Run all 11 content quality checks."""
    if ai is None:
        ai = AIEvaluator(mode="deferred")

    result = PassResult(pass_number=PASS_NUMBER, pass_name=PASS_NAME)
    lesson = ctx.get("lesson")
    lesson_code = ctx.get("lesson_code", "")

    if not lesson:
        result.checks.append(CheckResult(
            check_id="3.0", check_name="Data available",
            passed=False, details="No lesson data", severity="critical",
        ))
        return result

    meta = lesson.get("meta", {})
    grade = meta.get("grade", "")
    title = meta.get("title_ro", "")

    # 3.1 Factual accuracy (AI)
    result.checks.append(_check_3_1(lesson, lesson_code, grade, title, ai))

    # 3.2 Language level appropriate (AI)
    result.checks.append(_check_3_2(lesson, lesson_code, grade, ai))

    # 3.3 No outdated information (AI)
    result.checks.append(_check_3_3(lesson, lesson_code, ai))

    # 3.4 Examples are concrete and relatable (AI)
    result.checks.append(_check_3_4(lesson, lesson_code, grade, ai))

    # 3.5 Common misconceptions are valid (AI)
    result.checks.append(_check_3_5(lesson, lesson_code, ai))

    # 3.6 No internal contradictions (AI)
    result.checks.append(_check_3_6(lesson, lesson_code, ai))

    # 3.7 No contradictions with other module lessons (AI)
    result.checks.append(_check_3_7(lesson, lesson_code, ctx, ai))

    # 3.8 Romanian grammar and spelling (AI)
    result.checks.append(_check_3_8(lesson, lesson_code, ai))

    # 3.9 Safety/ethics content appropriate (AI)
    result.checks.append(_check_3_9(lesson, lesson_code, ai))

    # 3.10 Technical terminology consistent (AI)
    result.checks.append(_check_3_10(lesson, lesson_code, ai))

    # 3.11 No placeholder text (automated)
    result.checks.append(_check_3_11(lesson))

    return result


def _extract_content_text(lesson: dict) -> str:
    """Extract all text content from lesson for analysis."""
    parts = []
    for key in ["why_this_matters", "knowledge_progression", "instructional_flow",
                 "competency_contract", "assessment", "teacher_notes"]:
        section = lesson.get(key, {})
        if isinstance(section, dict):
            parts.append(json.dumps(section, ensure_ascii=False))
        elif isinstance(section, str):
            parts.append(section)
    return "\n".join(parts)


def _check_3_1(lesson: dict, code: str, grade: str, title: str, ai: AIEvaluator) -> CheckResult:
    """Factual accuracy - all technical claims correct."""
    progression = lesson.get("knowledge_progression", {})
    flow = lesson.get("instructional_flow", {})

    prompt = f"""Review this ICT lesson for factual accuracy.

Lesson: {code} - "{title}" (Grade {grade}, Romanian curriculum)

Knowledge content:
{json.dumps(progression, ensure_ascii=False, indent=2)}

Instructional content:
{json.dumps(flow, ensure_ascii=False, indent=2)}

Check every technical claim. Flag any:
- Incorrect definitions or explanations
- Wrong technical specifications
- Misleading simplifications that cross into inaccuracy
- Outdated information presented as current

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("3.1", "Factual accuracy", prompt, severity="critical")


def _check_3_2(lesson: dict, code: str, grade: str, ai: AIEvaluator) -> CheckResult:
    """Language level appropriate for grade."""
    grade_age = {"V": "10-11", "VI": "11-12", "VII": "12-13", "VIII": "13-14"}
    age = grade_age.get(grade, "10-14")
    explanation = lesson.get("knowledge_progression", {}).get("explanation_like_im_12", "")
    if not explanation:
        explanation = json.dumps(lesson.get("knowledge_progression", {}), ensure_ascii=False)[:500]

    prompt = f"""Evaluate if this educational content is appropriate for students aged {age} (Grade {grade}).

Lesson: {code}
Target age: {age} years old

Content sample:
{explanation[:1000]}

Check:
1. Is vocabulary appropriate for the age group?
2. Are sentences too complex or too simple?
3. Would a {age}-year-old understand the main concepts?
4. Are abstract concepts explained with concrete analogies?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("3.2", "Age-appropriate language", prompt, severity="major")


def _check_3_3(lesson: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """No outdated information."""
    tools = lesson.get("meta", {}).get("tools", [])
    content_text = _extract_content_text(lesson)[:1500]

    prompt = f"""Check this ICT lesson for outdated information (school year 2025-2026).

Lesson: {code}
Tools mentioned: {json.dumps(tools, ensure_ascii=False)}

Content excerpt:
{content_text}

Flag any:
- References to discontinued software/services
- Outdated version numbers
- Dead URLs or obsolete websites
- Technology that's no longer standard practice
- Information that was true before 2024 but is now incorrect

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("3.3", "No outdated information", prompt, severity="major")


def _check_3_4(lesson: dict, code: str, grade: str, ai: AIEvaluator) -> CheckResult:
    """Examples are concrete and relatable to student life."""
    scenarios = lesson.get("why_this_matters", {}).get("real_life_scenarios", [])
    purpose = lesson.get("why_this_matters", {}).get("purpose_ro", "")

    prompt = f"""Evaluate the real-life examples in this lesson for student relevance.

Lesson: {code} (Grade {grade})
Purpose: {purpose}

Real-life scenarios:
{json.dumps(scenarios, ensure_ascii=False, indent=2)}

Check:
1. Are scenarios actually relevant to students aged {{"V":"10-11","VI":"11-12","VII":"12-13","VIII":"13-14"}}["{grade}"]?
2. Are they concrete (not abstract/generic)?
3. Do they connect ICT concepts to the student's daily life?
4. Are there enough scenarios (at least 2)?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("3.4", "Relatable examples", prompt, severity="major")


def _check_3_5(lesson: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """Common misconceptions are actually common."""
    misconceptions = lesson.get("knowledge_progression", {}).get("common_misconceptions", [])
    if not misconceptions:
        return CheckResult(
            check_id="3.5", check_name="Valid misconceptions",
            passed=True, details="No misconceptions section (acceptable)",
        )

    prompt = f"""Evaluate whether these listed misconceptions are genuinely common among students.

Lesson: {code}

Listed misconceptions:
{json.dumps(misconceptions, ensure_ascii=False, indent=2)}

Check:
1. Are these actually common student misconceptions (not obscure edge cases)?
2. Would a teacher recognize these from classroom experience?
3. Are corrections provided clearly?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("3.5", "Valid misconceptions", prompt, severity="minor")


def _check_3_6(lesson: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """No internal contradictions within the lesson."""
    content = _extract_content_text(lesson)[:2000]

    prompt = f"""Check this lesson for internal contradictions.

Lesson: {code}

Full content:
{content}

Look for:
1. Definitions that contradict each other in different sections
2. Instructions that conflict with the explanation
3. Assessment criteria that don't match what was taught
4. Terminology used inconsistently (same concept, different names)

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("3.6", "No internal contradictions", prompt, severity="critical")


def _check_3_7(lesson: dict, code: str, ctx: dict, ai: AIEvaluator) -> CheckResult:
    """No contradictions with other lessons in same module."""
    from .. import loader as ldr
    parsed = ctx.get("parsed", {})
    if not parsed:
        return CheckResult(
            check_id="3.7", check_name="No inter-lesson contradictions",
            passed=True, details="Cannot check without parsed code",
        )

    module_lessons = ldr.discover_module_lessons(parsed["grade"], parsed["module"])
    other_lessons_summary = []
    for lc in module_lessons:
        if lc == code:
            continue
        other = ldr.load_lesson(lc)
        if other:
            other_lessons_summary.append({
                "code": lc,
                "title": other.get("meta", {}).get("title_ro", ""),
                "key_concepts": list(other.get("knowledge_progression", {}).get(
                    "from_general_to_specific", []))[:3],
            })

    if not other_lessons_summary:
        return CheckResult(
            check_id="3.7", check_name="No inter-lesson contradictions",
            passed=True, details="No other lessons in module to compare",
        )

    this_content = _extract_content_text(lesson)[:1000]

    prompt = f"""Check for contradictions between this lesson and other lessons in the same module.

This lesson: {code}
Content excerpt:
{this_content}

Other lessons in the module:
{json.dumps(other_lessons_summary, ensure_ascii=False, indent=2)}

Flag any definitions, explanations, or claims that would contradict content in sibling lessons.

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("3.7", "No inter-lesson contradictions", prompt, severity="major")


def _check_3_8(lesson: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """Romanian grammar and spelling correct."""
    content = _extract_content_text(lesson)[:1500]

    prompt = f"""Check this Romanian educational text for grammar and spelling errors.

Lesson: {code}

Text:
{content}

Check for:
1. Spelling errors in Romanian
2. Grammar mistakes (agreement, verb conjugation, diacritics)
3. Missing or incorrect diacritics (ă, â, î, ș, ț)
4. Awkward phrasing or unnatural Romanian

Note: Technical terms in English are acceptable (e.g., "mouse", "click", "browser").

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("3.8", "Romanian grammar correct", prompt, severity="minor")


def _check_3_9(lesson: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """Safety/ethics content appropriate for topic."""
    safety = lesson.get("meta", {}).get("safety_and_ethics", [])
    title = lesson.get("meta", {}).get("title_ro", "")

    if not safety:
        # Check if this topic SHOULD have safety content
        safety_keywords = ["internet", "online", "retea", "social", "email",
                           "parola", "securitate", "date personale", "comunicare"]
        title_lower = title.lower()
        needs_safety = any(kw in title_lower for kw in safety_keywords)
        if needs_safety:
            return CheckResult(
                check_id="3.9", check_name="Safety/ethics content",
                passed=False,
                details=f"Topic '{title}' likely needs safety/ethics content but none provided",
                severity="major",
                fix_suggestion="Add safety_and_ethics section for this internet/security topic",
            )
        return CheckResult(
            check_id="3.9", check_name="Safety/ethics content",
            passed=True, details="No safety content needed for this topic",
        )

    prompt = f"""Evaluate the safety/ethics section of this ICT lesson for completeness.

Lesson: {code} - "{title}"

Safety & ethics content:
{json.dumps(safety, ensure_ascii=False, indent=2)}

Check:
1. Is the safety advice appropriate for the lesson topic?
2. Is it age-appropriate?
3. Does it cover the main risks associated with this technology?
4. Is it practical (actionable advice, not just warnings)?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("3.9", "Safety/ethics content", prompt, severity="major")


def _check_3_10(lesson: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """Technical terminology consistent throughout lesson."""
    content = _extract_content_text(lesson)[:2000]

    prompt = f"""Check technical terminology consistency in this ICT lesson.

Lesson: {code}

Content:
{content}

Check:
1. Is the same concept always referred to by the same term?
2. Are Romanian and English terms used consistently (not mixing randomly)?
3. Are abbreviations explained on first use?
4. Are technical terms defined before being used in exercises?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("3.10", "Terminology consistent", prompt, severity="minor")


def _check_3_11(lesson: dict) -> CheckResult:
    """No placeholder or template text remaining (automated)."""
    lesson_str = json.dumps(lesson, ensure_ascii=False)
    found = []
    for pattern in PLACEHOLDER_PATTERNS:
        matches = re.findall(pattern, lesson_str, re.IGNORECASE)
        if matches:
            found.extend(matches[:3])
    if found:
        return CheckResult(
            check_id="3.11", check_name="No placeholder text",
            passed=False,
            details=f"Found {len(found)} placeholder patterns: {', '.join(found[:5])}",
            severity="major",
            fix_suggestion="Replace all placeholder text with actual content",
        )
    return CheckResult(
        check_id="3.11", check_name="No placeholder text",
        passed=True, details="No placeholder patterns found",
    )
