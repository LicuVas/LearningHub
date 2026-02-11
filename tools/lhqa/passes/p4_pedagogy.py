"""Pass 4: Pedagogical Design - 11 checks (2 automated, 9 AI-evaluated).

Evaluates pacing, engagement, cognitive load, differentiation,
instructional flow, and activity variety.
"""

import json
import re

from ..models import CheckResult, PassResult
from ..ai_eval import AIEvaluator

PASS_NUMBER = 4
PASS_NAME = "Pedagogical Design"

# Time allocation patterns in instructional_flow keys
TIME_PATTERNS = {
    "hook": (2, 5),         # 2-5 minutes
    "micro_lecture": (5, 15),
    "guided_practice": (8, 20),
    "independent": (8, 20),
    "wrap": (3, 8),
    "assessment": (5, 15),
}


def run(ctx: dict, ai: AIEvaluator = None) -> PassResult:
    """Run all 11 pedagogical design checks."""
    if ai is None:
        ai = AIEvaluator(mode="deferred")

    result = PassResult(pass_number=PASS_NUMBER, pass_name=PASS_NAME)
    lesson = ctx.get("lesson")
    lesson_code = ctx.get("lesson_code", "")

    if not lesson:
        result.checks.append(CheckResult(
            check_id="4.0", check_name="Data available",
            passed=False, details="No lesson data", severity="critical",
        ))
        return result

    meta = lesson.get("meta", {})
    flow = lesson.get("instructional_flow", {})
    teacher = lesson.get("teacher_notes", {})
    grade = meta.get("grade", "")
    title = meta.get("title_ro", "")

    # 4.1 Hook is engaging (AI)
    result.checks.append(_check_4_1(flow, lesson_code, grade, ai))

    # 4.2 Micro-lecture content density appropriate (AI)
    result.checks.append(_check_4_2(flow, lesson_code, grade, ai))

    # 4.3 Time budget sums to ~50 min (automated)
    result.checks.append(_check_4_3(flow, meta))

    # 4.4 Active learning ratio >= 60% (AI)
    result.checks.append(_check_4_4(flow, lesson_code, ai))

    # 4.5 Cognitive load progression (AI)
    result.checks.append(_check_4_5(lesson, lesson_code, ai))

    # 4.6 Differentiation strategy (AI)
    result.checks.append(_check_4_6(teacher, lesson_code, ai))

    # 4.7 Guided practice before independent (automated)
    result.checks.append(_check_4_7(flow))

    # 4.8 Wrap-up/reflection exists (AI)
    result.checks.append(_check_4_8(flow, lesson_code, ai))

    # 4.9 Variety of modalities (AI)
    result.checks.append(_check_4_9(flow, lesson_code, ai))

    # 4.10 Prerequisite knowledge activated (AI)
    result.checks.append(_check_4_10(lesson, lesson_code, ctx, ai))

    # 4.11 Spaced retrieval plan valid (AI)
    result.checks.append(_check_4_11(lesson, lesson_code, ctx, ai))

    return result


def _extract_time_minutes(text: str) -> int:
    """Try to extract minute count from a flow section key or text."""
    # Match patterns like "hook_3min", "micro_lecture_8_10min"
    m = re.search(r'(\d+)_?(\d+)?min', text)
    if m:
        if m.group(2):
            return (int(m.group(1)) + int(m.group(2))) // 2
        return int(m.group(1))
    # Match "X minute" patterns in text
    m = re.search(r'(\d+)\s*minut', text)
    if m:
        return int(m.group(1))
    return 0


def _check_4_1(flow: dict, code: str, grade: str, ai: AIEvaluator) -> CheckResult:
    """Hook (3 min) is genuinely engaging."""
    hook_text = ""
    for key, val in flow.items():
        if "hook" in key.lower():
            hook_text = str(val) if isinstance(val, str) else json.dumps(val, ensure_ascii=False)
            break

    if not hook_text:
        return CheckResult(
            check_id="4.1", check_name="Hook is engaging",
            passed=False, details="No hook section found in instructional_flow",
            severity="major",
            fix_suggestion="Add a hook_3min section to instructional_flow",
        )

    prompt = f"""Evaluate this lesson hook for student engagement.

Lesson: {code} (Grade {grade})

Hook activity:
{hook_text[:500]}

Criteria:
1. Does it create genuine curiosity or surprise?
2. Is it doable in 2-5 minutes?
3. Does it connect to students' prior experience?
4. Will it motivate students to learn the lesson topic?
5. Is it age-appropriate?

A GOOD hook: poses a puzzle, shows a surprising demo, asks a provocative question.
A BAD hook: "Today we will learn about..." (that's an announcement, not a hook).

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("4.1", "Hook is engaging", prompt, severity="major")


def _check_4_2(flow: dict, code: str, grade: str, ai: AIEvaluator) -> CheckResult:
    """Micro-lecture content density appropriate for time."""
    lecture_text = ""
    for key, val in flow.items():
        if "lecture" in key.lower() or "micro" in key.lower():
            lecture_text = str(val) if isinstance(val, str) else json.dumps(val, ensure_ascii=False)
            break

    if not lecture_text:
        return CheckResult(
            check_id="4.2", check_name="Lecture density appropriate",
            passed=True, details="No micro-lecture section (may use different format)",
        )

    word_count = len(lecture_text.split())

    prompt = f"""Evaluate the content density of this micro-lecture section.

Lesson: {code} (Grade {grade})
Approximate word count: {word_count}
Target duration: 8-10 minutes

Micro-lecture content:
{lecture_text[:1000]}

Criteria:
1. Can this content be delivered clearly in 8-10 minutes?
2. Is it too dense (too many concepts for the time)?
3. Is it too sparse (not enough substance)?
4. Does it focus on key ideas or try to cover everything?

Rule of thumb: 1 major concept per 3-4 minutes of lecture.

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("4.2", "Lecture density appropriate", prompt, severity="major")


def _check_4_3(flow: dict, meta: dict) -> CheckResult:
    """Time budget sums to approximately 50 minutes (automated)."""
    target = meta.get("duration_minutes", 50)
    total_minutes = 0
    found_sections = []

    for key in flow:
        mins = _extract_time_minutes(key)
        if mins:
            total_minutes += mins
            found_sections.append(f"{key}: {mins}min")

    if not found_sections:
        # Try to count sections and estimate
        section_count = len(flow)
        return CheckResult(
            check_id="4.3", check_name="Time budget ~50 min",
            passed=True,
            details=f"Cannot extract times from keys. {section_count} flow sections found.",
            severity="minor",
        )

    diff = abs(total_minutes - target)
    if diff > 10:
        return CheckResult(
            check_id="4.3", check_name="Time budget ~50 min",
            passed=False,
            details=f"Total time: {total_minutes}min (target: {target}min, off by {diff}min). Sections: {'; '.join(found_sections)}",
            severity="major",
            fix_suggestion=f"Adjust activity times to total ~{target} minutes",
        )
    return CheckResult(
        check_id="4.3", check_name="Time budget ~50 min",
        passed=True,
        details=f"Total time: {total_minutes}min (target: {target}min). Sections: {'; '.join(found_sections)}",
    )


def _check_4_4(flow: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """Active learning ratio >= 60%."""
    prompt = f"""Estimate the active learning ratio in this lesson's instructional flow.

Lesson: {code}

Instructional flow:
{json.dumps(flow, ensure_ascii=False, indent=2)[:1500]}

Active learning = time students DO something (practice, discuss, create, solve).
Passive learning = time students LISTEN (lecture, demo, reading).

Estimate:
1. What percentage of class time is active vs passive?
2. Is the ratio at least 60% active?
3. Which sections are active and which are passive?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": ["estimated active: X%"]}}"""

    return ai.evaluate("4.4", "Active learning ratio >= 60%", prompt, severity="major")


def _check_4_5(lesson: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """Cognitive load progression - simple to complex."""
    progression = lesson.get("knowledge_progression", {})
    flow = lesson.get("instructional_flow", {})

    prompt = f"""Evaluate cognitive load progression in this lesson.

Lesson: {code}

Knowledge progression:
{json.dumps(progression, ensure_ascii=False, indent=2)[:800]}

Instructional flow:
{json.dumps(flow, ensure_ascii=False, indent=2)[:800]}

Check:
1. Does the lesson start with simple/familiar concepts?
2. Does complexity increase gradually?
3. Are there no sudden jumps in difficulty?
4. Is scaffolding provided when complexity increases?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("4.5", "Cognitive load progression", prompt, severity="major")


def _check_4_6(teacher: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """Differentiation strategy addresses fast and slow learners."""
    if not teacher:
        return CheckResult(
            check_id="4.6", check_name="Differentiation strategy",
            passed=False, details="No teacher_notes section",
            severity="major",
            fix_suggestion="Add teacher_notes with differentiation strategies",
        )

    prompt = f"""Evaluate the differentiation strategy in these teacher notes.

Lesson: {code}

Teacher notes:
{json.dumps(teacher, ensure_ascii=False, indent=2)[:1000]}

Check:
1. Are there strategies for FAST learners (extension activities, challenges)?
2. Are there strategies for SLOW learners (scaffolding, simplified tasks)?
3. Are the strategies specific and actionable (not just "help struggling students")?
4. Are timing adjustments suggested?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("4.6", "Differentiation strategy", prompt, severity="major")


def _check_4_7(flow: dict) -> CheckResult:
    """Guided practice comes before independent practice (automated)."""
    keys = list(flow.keys())
    guided_idx = -1
    independent_idx = -1

    for i, key in enumerate(keys):
        key_lower = key.lower()
        if "guided" in key_lower or "ghidat" in key_lower:
            guided_idx = i
        if "independent" in key_lower or "individual" in key_lower:
            independent_idx = i

    if guided_idx < 0 and independent_idx < 0:
        return CheckResult(
            check_id="4.7", check_name="Guided before independent",
            passed=True,
            details="No explicit guided/independent sections (may use different naming)",
        )
    if guided_idx < 0:
        return CheckResult(
            check_id="4.7", check_name="Guided before independent",
            passed=False,
            details="Independent practice found but no guided practice precedes it",
            severity="major",
            fix_suggestion="Add guided practice section before independent practice",
        )
    if independent_idx >= 0 and guided_idx > independent_idx:
        return CheckResult(
            check_id="4.7", check_name="Guided before independent",
            passed=False,
            details="Independent practice appears before guided practice",
            severity="major",
            fix_suggestion="Reorder: guided practice should come before independent",
        )
    return CheckResult(
        check_id="4.7", check_name="Guided before independent",
        passed=True,
        details="Guided practice precedes independent practice",
    )


def _check_4_8(flow: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """Lesson has wrap-up/reflection (not just stopping)."""
    wrap_text = ""
    for key, val in flow.items():
        if any(w in key.lower() for w in ["wrap", "closure", "reflec", "rezumat", "concluzi", "exit_ticket"]):
            wrap_text = str(val) if isinstance(val, str) else json.dumps(val, ensure_ascii=False)
            break

    if not wrap_text:
        return CheckResult(
            check_id="4.8", check_name="Wrap-up/reflection exists",
            passed=False,
            details="No wrap-up/closure section found in instructional_flow",
            severity="major",
            fix_suggestion="Add a wrap-up section with reflection or summary activity",
        )

    prompt = f"""Evaluate this lesson's wrap-up/closure activity.

Lesson: {code}

Wrap-up section:
{wrap_text[:500]}

A GOOD wrap-up: students reflect, summarize key points, connect to next lesson, exit ticket.
A BAD wrap-up: "The lesson is over" or just assigning homework.

Check:
1. Does it help students consolidate what they learned?
2. Is there an active reflection component?
3. Does it provide closure (not just stopping)?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("4.8", "Wrap-up/reflection exists", prompt, severity="major")


def _check_4_9(flow: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """Variety of learning modalities (not all reading)."""
    prompt = f"""Evaluate the variety of learning modalities in this lesson.

Lesson: {code}

Instructional flow:
{json.dumps(flow, ensure_ascii=False, indent=2)[:1500]}

Modalities to look for:
- Visual (images, diagrams, videos, demonstrations)
- Auditory (discussion, verbal explanation)
- Kinesthetic (hands-on practice, computer activities)
- Reading/Writing (notes, worksheets)

Check:
1. Are at least 2 different modalities used?
2. Is there hands-on computer practice (essential for ICT)?
3. Is the lesson not just "read and answer questions"?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": ["modalities found: X, Y"]}}"""

    return ai.evaluate("4.9", "Variety of modalities", prompt, severity="major")


def _check_4_10(lesson: dict, code: str, ctx: dict, ai: AIEvaluator) -> CheckResult:
    """Prerequisite knowledge is activated at lesson start."""
    prereqs = lesson.get("meta", {}).get("prerequisites", [])
    if not prereqs:
        return CheckResult(
            check_id="4.10", check_name="Prerequisite activation",
            passed=True, details="No prerequisites declared",
        )

    flow = lesson.get("instructional_flow", {})
    prompt = f"""Check if this lesson activates prerequisite knowledge.

Lesson: {code}
Prerequisites: {json.dumps(prereqs, ensure_ascii=False)}

Instructional flow (first sections):
{json.dumps(dict(list(flow.items())[:3]), ensure_ascii=False, indent=2)[:800]}

Check:
1. Does the hook or opening reference prior learning?
2. Are prerequisite concepts briefly reviewed?
3. Is there a bridge from what students already know?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("4.10", "Prerequisite activation", prompt, severity="minor")


def _check_4_11(lesson: dict, code: str, ctx: dict, ai: AIEvaluator) -> CheckResult:
    """Spaced retrieval plan is realistic and references valid lessons."""
    spaced = lesson.get("spaced_retrieval_plan", {})
    if not spaced:
        return CheckResult(
            check_id="4.11", check_name="Spaced retrieval plan valid",
            passed=True, details="No spaced_retrieval_plan section (acceptable)",
        )

    prompt = f"""Evaluate this spaced retrieval plan for pedagogical soundness.

Lesson: {code}

Spaced retrieval plan:
{json.dumps(spaced, ensure_ascii=False, indent=2)[:800]}

Check:
1. Are the retrieval intervals realistic (not too close, not too far)?
2. Do referenced lessons actually exist in the sequence?
3. Are the retrieval activities appropriate (not just re-reading)?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("4.11", "Spaced retrieval plan valid", prompt, severity="minor")
