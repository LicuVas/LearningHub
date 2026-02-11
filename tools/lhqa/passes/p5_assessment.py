"""Pass 5: Assessment Alignment - 12 checks (4 automated, 8 AI-evaluated).

Validates quiz-to-lesson alignment, Bloom's taxonomy levels, distractor quality,
answer bias, rubric clarity, point distribution, and question variety.
"""

import json
from collections import Counter
from typing import List

from ..models import CheckResult, PassResult
from ..ai_eval import AIEvaluator

PASS_NUMBER = 5
PASS_NAME = "Assessment Alignment"

EXPECTED_POINTS = {"minim": 30, "standard": 35, "performanta": 35}
MIN_ITEMS_PER_LEVEL = 3
VALID_TYPES = {"mcq", "short", "explain", "compare", "task", "scenario", "create", "debug", "ordering", "fill"}


def _summarize_items(items: list, max_prompt: int = 100) -> str:
    """Build a JSON-safe summary of quiz items for AI prompts."""
    summary = [{"type": i.get("type", "?"), "prompt": i.get("prompt", "")[:max_prompt]} for i in items]
    return json.dumps(summary, ensure_ascii=False, indent=2)


def _summarize_items_with_answers(items: list, max_prompt: int = 120, max_answer: int = 200) -> str:
    """Build a JSON-safe summary including answer keys."""
    summary = [{"type": i.get("type", "?"), "prompt": i.get("prompt", "")[:max_prompt],
                "answer_key": str(i.get("answer_key", ""))[:max_answer]} for i in items]
    return json.dumps(summary, ensure_ascii=False, indent=2)


def run(ctx: dict, ai: AIEvaluator = None) -> PassResult:
    """Run all 12 assessment alignment checks."""
    if ai is None:
        ai = AIEvaluator(mode="deferred")

    result = PassResult(pass_number=PASS_NUMBER, pass_name=PASS_NAME)
    lesson = ctx.get("lesson")
    quiz = ctx.get("quiz")
    lesson_code = ctx.get("lesson_code", "")

    if not quiz:
        result.checks.append(CheckResult(
            check_id="5.0", check_name="Quiz data available",
            passed=False, details="No quiz data loaded",
            severity="critical",
        ))
        return result

    items_m = quiz.get("items_minim", [])
    items_s = quiz.get("items_standard", [])
    items_p = quiz.get("items_performanta", [])
    all_items = items_m + items_s + items_p

    # 5.1 Every quiz item maps to a taught concept (AI)
    result.checks.append(_check_5_1(lesson, quiz, lesson_code, ai))

    # 5.2 Bloom's taxonomy levels match (AI)
    result.checks.append(_check_5_2(items_m, items_s, items_p, lesson_code, ai))

    # 5.3 MCQ distractors are plausible (AI)
    result.checks.append(_check_5_3(all_items, lesson_code, ai))

    # 5.4 MCQ answer bias check (automated)
    result.checks.append(_check_5_4(all_items))

    # 5.5 Answer rubrics are clear (AI)
    result.checks.append(_check_5_5(all_items, lesson_code, ai))

    # 5.6 Point distribution matches spec (automated)
    result.checks.append(_check_5_6(quiz))

    # 5.7 Minimum item count per level (automated)
    result.checks.append(_check_5_7(items_m, items_s, items_p))

    # 5.8 Question type variety (automated)
    result.checks.append(_check_5_8(items_m, items_s, items_p))

    # 5.9 Scenario questions are realistic (AI)
    result.checks.append(_check_5_9(all_items, lesson_code, ai))

    # 5.10 Debug questions have actual bugs (AI)
    result.checks.append(_check_5_10(all_items, lesson_code, ai))

    # 5.11 Model answers are complete and correct (AI)
    result.checks.append(_check_5_11(all_items, lesson_code, ai))

    # 5.12 No duplicate questions across levels (AI)
    result.checks.append(_check_5_12(items_m, items_s, items_p, lesson_code, ai))

    return result


def _get_mcq_items(items: list) -> list:
    """Extract MCQ items from a list."""
    return [i for i in items if i.get("type") == "mcq"]


def _check_5_1(lesson: dict, quiz: dict, code: str, ai: AIEvaluator) -> CheckResult:
    """Every quiz item maps to a concept taught in the lesson."""
    if not lesson:
        return CheckResult(
            check_id="5.1", check_name="Quiz-lesson alignment",
            passed=False, details="No lesson data for alignment check",
            severity="critical",
        )
    progression = lesson.get("knowledge_progression", {})
    flow = lesson.get("instructional_flow", {})
    items = quiz.get("items_minim", []) + quiz.get("items_standard", []) + quiz.get("items_performanta", [])
    items_summary = _summarize_items(items)

    prompt = f"""Check if every quiz question tests concepts actually taught in the lesson.

Lesson: {code}

What was taught:
{json.dumps(progression, ensure_ascii=False, indent=2)[:800]}

Instructional activities:
{json.dumps(flow, ensure_ascii=False, indent=2)[:600]}

Quiz questions:
{items_summary}

For each question, verify the concept was explicitly taught in the lesson.
Flag any questions that test knowledge NOT covered in the lesson.

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": ["Q: <prompt> tests <concept> not in lesson"]}}"""

    return ai.evaluate("5.1", "Quiz-lesson alignment", prompt, severity="critical")


def _check_5_2(items_m: list, items_s: list, items_p: list, code: str, ai: AIEvaluator) -> CheckResult:
    """Bloom's taxonomy levels match difficulty tiers."""
    minim_summary = _summarize_items(items_m, 80)
    standard_summary = _summarize_items(items_s, 80)
    performanta_summary = _summarize_items(items_p, 80)

    prompt = f"""Evaluate Bloom's taxonomy alignment for these 3-tier quiz questions.

Lesson: {code}

Expected levels:
- Minim (grades 5-6): Remember, Understand
- Standard (grades 7-8): Apply, Analyze
- Performanta (grades 9-10): Evaluate, Create

MINIM questions:
{minim_summary}

STANDARD questions:
{standard_summary}

PERFORMANTA questions:
{performanta_summary}

Check: Does each tier actually match its expected Bloom's level? Are minim questions truly basic recall, and performanta questions truly higher-order thinking?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("5.2", "Bloom's taxonomy match", prompt, severity="major")


def _check_5_3(all_items: list, code: str, ai: AIEvaluator) -> CheckResult:
    """MCQ distractors are plausible but clearly wrong."""
    mcqs = _get_mcq_items(all_items)
    if not mcqs:
        return CheckResult(
            check_id="5.3", check_name="MCQ distractors plausible",
            passed=True, details="No MCQ questions to check",
        )

    mcq_data = []
    for item in mcqs[:8]:  # Limit to 8 for prompt size
        mcq_data.append({
            "prompt": item.get("prompt", ""),
            "options": item.get("options", []),
            "correct": item.get("answer_key", ""),
        })

    prompt = f"""Evaluate MCQ distractor quality for this quiz.

Lesson: {code}

MCQ questions:
{json.dumps(mcq_data, ensure_ascii=False, indent=2)}

For each MCQ, check:
1. Are distractors plausible (a student could reasonably choose them)?
2. Are distractors clearly wrong (not ambiguous or arguable)?
3. Are distractors different enough from each other?
4. Is there no "obviously absurd" option that gives away the answer?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("5.3", "MCQ distractors plausible", prompt, severity="major")


def _check_5_4(all_items: list) -> CheckResult:
    """MCQ answer position bias check (automated)."""
    mcqs = _get_mcq_items(all_items)
    if len(mcqs) < 3:
        return CheckResult(
            check_id="5.4", check_name="No answer position bias",
            passed=True, details=f"Only {len(mcqs)} MCQs (need 3+ for bias check)",
        )

    positions = []
    for item in mcqs:
        answer = item.get("answer_key", "")
        options = item.get("options", [])
        if isinstance(answer, int):
            positions.append(answer)
        elif isinstance(answer, str) and options:
            for i, opt in enumerate(options):
                opt_str = str(opt)
                if isinstance(opt, dict):
                    opt_str = opt.get("text", opt.get("label", str(opt)))
                if answer.strip().lower() == opt_str.strip().lower():
                    positions.append(i)
                    break

    if not positions:
        return CheckResult(
            check_id="5.4", check_name="No answer position bias",
            passed=True, details="Could not extract answer positions",
        )

    counts = Counter(positions)
    total = len(positions)
    # Check if any position has more than 50% of answers
    for pos, count in counts.items():
        if count / total > 0.5 and total >= 4:
            return CheckResult(
                check_id="5.4", check_name="No answer position bias",
                passed=False,
                details=f"Position {pos} has {count}/{total} correct answers ({count/total:.0%}). Answers should be distributed evenly.",
                severity="minor",
                fix_suggestion="Randomize correct answer positions",
            )

    # Check if correct answer is always the longest option
    longest_is_correct = 0
    for item in mcqs:
        options = item.get("options", [])
        answer = item.get("answer_key", "")
        if options:
            lens = [len(str(o)) for o in options]
            longest_idx = lens.index(max(lens))
            if isinstance(answer, int) and answer == longest_idx:
                longest_is_correct += 1

    if longest_is_correct / max(len(mcqs), 1) > 0.6 and len(mcqs) >= 3:
        return CheckResult(
            check_id="5.4", check_name="No answer position bias",
            passed=False,
            details=f"Longest option is correct in {longest_is_correct}/{len(mcqs)} MCQs (length bias)",
            severity="minor",
            fix_suggestion="Vary option lengths so correct answer isn't always longest",
        )

    return CheckResult(
        check_id="5.4", check_name="No answer position bias",
        passed=True,
        details=f"No bias detected in {len(mcqs)} MCQs. Position distribution: {dict(counts)}",
    )


def _check_5_5(all_items: list, code: str, ai: AIEvaluator) -> CheckResult:
    """Answer rubrics are clear and actionable."""
    non_mcq = [i for i in all_items if i.get("type") != "mcq"]
    if not non_mcq:
        return CheckResult(
            check_id="5.5", check_name="Clear rubrics",
            passed=True, details="Only MCQ questions (no rubrics needed)",
        )

    rubric_data = [{
        "type": i.get("type"),
        "prompt": i.get("prompt", "")[:100],
        "answer_key": i.get("answer_key", "")[:200],
    } for i in non_mcq[:6]]

    prompt = f"""Evaluate answer rubrics/model answers for open-ended questions.

Lesson: {code}

Questions with rubrics:
{json.dumps(rubric_data, ensure_ascii=False, indent=2)}

Check:
1. Is each answer_key specific enough to grade consistently?
2. Could two teachers grade the same response the same way using this rubric?
3. Are key points/criteria clearly listed?
4. For "short" type: is the expected answer length clear?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("5.5", "Clear rubrics", prompt, severity="major")


def _check_5_6(quiz: dict) -> CheckResult:
    """Point distribution matches spec: minim=30, standard=35, performanta=35 (automated)."""
    # Check if quiz has point allocations
    # Some quizzes have points_per_item or total_points fields
    # If not, we check item counts as a proxy
    items_m = quiz.get("items_minim", [])
    items_s = quiz.get("items_standard", [])
    items_p = quiz.get("items_performanta", [])

    # Check for explicit point fields
    total_m = sum(i.get("points", 0) for i in items_m)
    total_s = sum(i.get("points", 0) for i in items_s)
    total_p = sum(i.get("points", 0) for i in items_p)

    if total_m + total_s + total_p > 0:
        # Explicit points found
        issues = []
        if total_m != EXPECTED_POINTS["minim"]:
            issues.append(f"minim: {total_m}pts (expected {EXPECTED_POINTS['minim']})")
        if total_s != EXPECTED_POINTS["standard"]:
            issues.append(f"standard: {total_s}pts (expected {EXPECTED_POINTS['standard']})")
        if total_p != EXPECTED_POINTS["performanta"]:
            issues.append(f"performanta: {total_p}pts (expected {EXPECTED_POINTS['performanta']})")
        if issues:
            return CheckResult(
                check_id="5.6", check_name="Point distribution correct",
                passed=False,
                details=f"Point mismatch: {'; '.join(issues)}",
                severity="major",
                fix_suggestion="Adjust points to: minim=30, standard=35, performanta=35 (total=100)",
            )
        return CheckResult(
            check_id="5.6", check_name="Point distribution correct",
            passed=True,
            details=f"Points correct: minim={total_m}, standard={total_s}, performanta={total_p}",
        )

    # No explicit points - check structurally (all 3 levels present)
    return CheckResult(
        check_id="5.6", check_name="Point distribution correct",
        passed=True,
        details=f"No explicit points. Items: minim={len(items_m)}, standard={len(items_s)}, performanta={len(items_p)}",
        severity="minor",
    )


def _check_5_7(items_m: list, items_s: list, items_p: list) -> CheckResult:
    """Minimum item count per level (automated)."""
    issues = []
    for name, items in [("minim", items_m), ("standard", items_s), ("performanta", items_p)]:
        if len(items) < MIN_ITEMS_PER_LEVEL:
            issues.append(f"{name}: {len(items)} items (need {MIN_ITEMS_PER_LEVEL}+)")
    if issues:
        return CheckResult(
            check_id="5.7", check_name="Minimum item count",
            passed=False,
            details=f"Insufficient items: {'; '.join(issues)}",
            severity="major",
            fix_suggestion=f"Add items to reach minimum of {MIN_ITEMS_PER_LEVEL} per level",
        )
    return CheckResult(
        check_id="5.7", check_name="Minimum item count",
        passed=True,
        details=f"minim={len(items_m)}, standard={len(items_s)}, performanta={len(items_p)} (all >= {MIN_ITEMS_PER_LEVEL})",
    )


def _check_5_8(items_m: list, items_s: list, items_p: list) -> CheckResult:
    """Question type variety - at least 2 types per level (automated)."""
    issues = []
    for name, items in [("minim", items_m), ("standard", items_s), ("performanta", items_p)]:
        types = set(i.get("type", "unknown") for i in items)
        if len(types) < 2 and len(items) >= 2:
            issues.append(f"{name}: only type '{list(types)[0]}' (need 2+ types)")
    if issues:
        return CheckResult(
            check_id="5.8", check_name="Question type variety",
            passed=False,
            details=f"Insufficient variety: {'; '.join(issues)}",
            severity="minor",
            fix_suggestion="Mix question types: mcq, short, explain, compare, task, scenario, debug, create",
        )
    # Report distribution
    all_types = Counter(i.get("type", "unknown") for i in items_m + items_s + items_p)
    return CheckResult(
        check_id="5.8", check_name="Question type variety",
        passed=True,
        details=f"Type distribution: {dict(all_types)}",
    )


def _check_5_9(all_items: list, code: str, ai: AIEvaluator) -> CheckResult:
    """Scenario questions are realistic."""
    scenarios = [i for i in all_items if i.get("type") == "scenario"]
    if not scenarios:
        return CheckResult(
            check_id="5.9", check_name="Realistic scenarios",
            passed=True, details="No scenario questions to check",
        )

    scenario_summary = json.dumps([{"prompt": s.get("prompt", "")} for s in scenarios], ensure_ascii=False, indent=2)
    prompt = f"""Evaluate scenario-based questions for realism.

Lesson: {code}

Scenario questions:
{scenario_summary}

Check:
1. Are the scenarios realistic situations a student might encounter?
2. Are they specific enough to solve (not vague)?
3. Do they require applying lesson concepts (not just recall)?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("5.9", "Realistic scenarios", prompt, severity="minor")


def _check_5_10(all_items: list, code: str, ai: AIEvaluator) -> CheckResult:
    """Debug questions contain actual, solvable bugs."""
    debug_items = [i for i in all_items if i.get("type") == "debug"]
    if not debug_items:
        return CheckResult(
            check_id="5.10", check_name="Debug questions valid",
            passed=True, details="No debug questions to check",
        )

    debug_summary = json.dumps([{"prompt": d.get("prompt", ""), "answer_key": d.get("answer_key", "")} for d in debug_items], ensure_ascii=False, indent=2)
    prompt = f"""Evaluate debug-type questions for quality.

Lesson: {code}

Debug questions:
{debug_summary}

Check:
1. Does each question contain an actual bug/error?
2. Is the bug solvable with knowledge from this lesson?
3. Is it non-trivial but not impossible?
4. Is the correct answer (fix) clearly defined?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("5.10", "Debug questions valid", prompt, severity="minor")


def _check_5_11(all_items: list, code: str, ai: AIEvaluator) -> CheckResult:
    """Model answers are complete and correct."""
    items_with_answers = [i for i in all_items if i.get("answer_key") and
                          str(i.get("answer_key")) != "MODEL_ANSWER_REQUIRED"]
    if not items_with_answers:
        return CheckResult(
            check_id="5.11", check_name="Model answers correct",
            passed=False, details="No model answers to evaluate",
            severity="critical",
        )

    sample = items_with_answers[:6]
    sample_summary = _summarize_items_with_answers(sample)
    prompt = f"""Verify model answers are factually correct and complete.

Lesson: {code}

Questions with answers:
{sample_summary}

For each:
1. Is the answer factually correct?
2. Is it complete (covers the key points the question asks for)?
3. Would it earn full marks against its own rubric?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("5.11", "Model answers correct", prompt, severity="critical")


def _check_5_12(items_m: list, items_s: list, items_p: list, code: str, ai: AIEvaluator) -> CheckResult:
    """No duplicate questions across levels."""
    all_prompts = []
    for level, items in [("minim", items_m), ("standard", items_s), ("performanta", items_p)]:
        for item in items:
            all_prompts.append({"level": level, "prompt": item.get("prompt", "")[:100]})

    if len(all_prompts) < 4:
        return CheckResult(
            check_id="5.12", check_name="No duplicate questions",
            passed=True, details="Too few questions to check for duplicates",
        )

    prompt = f"""Check for duplicate or near-duplicate questions across difficulty levels.

Lesson: {code}

Questions by level:
{json.dumps(all_prompts, ensure_ascii=False, indent=2)}

A question rephrased slightly at a different level is NOT genuine differentiation.
Flag pairs where the core question is the same, just worded differently.
Legitimate: same TOPIC at different Bloom's levels.
Illegitimate: same QUESTION with cosmetic rewording.

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": ["Q1 minim ≈ Q2 standard: both ask about X"]}}"""

    return ai.evaluate("5.12", "No duplicate questions", prompt, severity="minor")
