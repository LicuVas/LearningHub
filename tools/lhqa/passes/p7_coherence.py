"""Pass 7: Cross-Lesson Coherence - 8 checks (1 automated, 7 AI-evaluated).

Module-level evaluation: difficulty ramp, vocabulary consistency,
knowledge gaps, redundancy, narrative arc, integration, prerequisites,
and knowledge graph validation.
"""

import json
from typing import List, Dict

from ..models import CheckResult, PassResult
from ..ai_eval import AIEvaluator
from .. import loader

PASS_NUMBER = 7
PASS_NAME = "Cross-Lesson Coherence"


def run(ctx: dict, ai: AIEvaluator = None, module_lessons: list = None) -> PassResult:
    """Run all 8 coherence checks.

    Args:
        ctx: Lesson context (used for single-lesson reference point).
        ai: AI evaluator instance.
        module_lessons: List of all lesson dicts in the module.
            If not provided, loads them from the module.
    """
    if ai is None:
        ai = AIEvaluator(mode="deferred")

    result = PassResult(pass_number=PASS_NUMBER, pass_name=PASS_NAME)
    lesson = ctx.get("lesson")
    parsed = ctx.get("parsed", {})
    lesson_code = ctx.get("lesson_code", "")

    if not parsed:
        result.checks.append(CheckResult(
            check_id="7.0", check_name="Data available",
            passed=False, details="Cannot determine module context",
            severity="critical",
        ))
        return result

    grade = parsed["grade"]
    module = parsed["module"]

    # Load all module lessons if not provided
    if module_lessons is None:
        module_codes = loader.discover_module_lessons(grade, module)
        module_lessons = []
        for mc in module_codes:
            ml = loader.load_lesson(mc)
            if ml:
                module_lessons.append({"code": mc, "lesson": ml})

    if len(module_lessons) < 2:
        result.checks.append(CheckResult(
            check_id="7.0", check_name="Module context",
            passed=True,
            details=f"Only {len(module_lessons)} lesson(s) in module - coherence checks limited",
        ))
        return result

    # Build module summary for AI prompts
    module_summary = _build_module_summary(module_lessons)

    # 7.1 Difficulty ramp (AI)
    result.checks.append(_check_7_1(module_summary, grade, module, ai))

    # 7.2 Vocabulary consistency (AI)
    result.checks.append(_check_7_2(module_summary, grade, module, ai))

    # 7.3 No knowledge gaps (AI)
    result.checks.append(_check_7_3(module_summary, grade, module, ai))

    # 7.4 No excessive redundancy (AI)
    result.checks.append(_check_7_4(module_summary, grade, module, ai))

    # 7.5 Module story arc (AI)
    result.checks.append(_check_7_5(module_summary, grade, module, ai))

    # 7.6 Final lesson integrates prior lessons (AI)
    result.checks.append(_check_7_6(module_lessons, grade, module, ai))

    # 7.7 Cross-grade prerequisites valid (AI)
    result.checks.append(_check_7_7(module_lessons, grade, module, ai))

    # 7.8 Knowledge graph consistency (automated)
    result.checks.append(_check_7_8(module_lessons, ctx.get("concepts_graph", {}), grade, module))

    return result


def _build_module_summary(module_lessons: list) -> list:
    """Build a compact summary of all lessons in a module for AI prompts."""
    summary = []
    for ml in module_lessons:
        code = ml.get("code", "")
        lesson = ml.get("lesson", {})
        meta = lesson.get("meta", {})
        progression = lesson.get("knowledge_progression", {})
        concepts = progression.get("from_general_to_specific", [])

        summary.append({
            "code": code,
            "title": meta.get("title_ro", ""),
            "key_concepts": concepts[:4] if isinstance(concepts, list) else [],
            "prerequisites": meta.get("prerequisites", []),
            "tools": meta.get("tools", []),
        })
    return summary


def _check_7_1(summary: list, grade: str, module: int, ai: AIEvaluator) -> CheckResult:
    """Difficulty increases across lessons in the module."""
    prompt = f"""Evaluate difficulty progression across lessons in module {grade}-M{module}.

Lessons in order:
{json.dumps(summary, ensure_ascii=False, indent=2)}

Check:
1. Do lessons increase in complexity from first to last?
2. Are there any sudden difficulty jumps?
3. Is the final lesson the most complex?
4. Is the progression appropriate for the grade level?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("7.1", "Difficulty ramp", prompt, severity="major")


def _check_7_2(summary: list, grade: str, module: int, ai: AIEvaluator) -> CheckResult:
    """Same concept uses same term across all lessons."""
    prompt = f"""Check vocabulary consistency across lessons in module {grade}-M{module}.

Lessons:
{json.dumps(summary, ensure_ascii=False, indent=2)}

Check:
1. Is the same concept always referred to by the same term?
2. Are Romanian and English terms used consistently?
3. If a term is introduced in lesson 1, is it used the same way in lesson 5?
4. Are there conflicting definitions of the same term?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": ["term X called Y in L01 but Z in L03"]}}"""

    return ai.evaluate("7.2", "Vocabulary consistency", prompt, severity="major")


def _check_7_3(summary: list, grade: str, module: int, ai: AIEvaluator) -> CheckResult:
    """No knowledge gaps - lesson N+1 doesn't assume untaught knowledge."""
    prompt = f"""Check for knowledge gaps in the lesson sequence of module {grade}-M{module}.

Lessons in teaching order:
{json.dumps(summary, ensure_ascii=False, indent=2)}

Check:
1. Does each lesson build on concepts from previous lessons?
2. Does any lesson assume knowledge that wasn't taught in earlier lessons?
3. Are there concepts that "appear out of nowhere" without introduction?
4. Is the prerequisite chain complete?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": ["L03 uses concept X but it was never taught in L01 or L02"]}}"""

    return ai.evaluate("7.3", "No knowledge gaps", prompt, severity="critical")


def _check_7_4(summary: list, grade: str, module: int, ai: AIEvaluator) -> CheckResult:
    """No excessive content redundancy between lessons."""
    prompt = f"""Check for excessive redundancy between lessons in module {grade}-M{module}.

Lessons:
{json.dumps(summary, ensure_ascii=False, indent=2)}

Check:
1. Do any two lessons cover substantially the same content?
2. Is there more than 30% overlap between any pair of lessons?
3. Is intentional review/repetition clearly different from accidental duplication?
4. Note: Some overlap for spaced retrieval is OK. Flag only excessive duplication.

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("7.4", "No excessive redundancy", prompt, severity="minor")


def _check_7_5(summary: list, grade: str, module: int, ai: AIEvaluator) -> CheckResult:
    """Module has a coherent narrative/learning arc."""
    prompt = f"""Evaluate the overall narrative arc of module {grade}-M{module}.

Lessons in order:
{json.dumps(summary, ensure_ascii=False, indent=2)}

A good module arc:
- Has a clear beginning (introduction to the topic)
- Builds progressively (each lesson adds to understanding)
- Has a clear end (synthesis, project, or assessment)
- Tells a "story" of learning

Check:
1. Is there a clear introduction-development-conclusion structure?
2. Can you see WHY the lessons are in this order?
3. Would reordering the lessons make them less effective?
4. Is the module more than just "random lessons on related topics"?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("7.5", "Module story arc", prompt, severity="major")


def _check_7_6(module_lessons: list, grade: str, module: int, ai: AIEvaluator) -> CheckResult:
    """Final lesson integrates/synthesizes prior lessons."""
    if len(module_lessons) < 2:
        return CheckResult(
            check_id="7.6", check_name="Final lesson integrates",
            passed=True, details="Too few lessons to check integration",
        )

    last = module_lessons[-1]
    earlier_titles = [ml.get("lesson", {}).get("meta", {}).get("title_ro", "")
                      for ml in module_lessons[:-1]]
    last_lesson = last.get("lesson", {})
    last_title = last_lesson.get("meta", {}).get("title_ro", "")
    last_concepts = last_lesson.get("knowledge_progression", {}).get("from_general_to_specific", [])

    prompt = f"""Evaluate whether the final lesson synthesizes the module.

Module: {grade}-M{module}

Earlier lessons: {json.dumps(earlier_titles, ensure_ascii=False)}

Final lesson: {last.get('code', '')} - "{last_title}"
Final lesson concepts:
{json.dumps(last_concepts[:5] if isinstance(last_concepts, list) else [], ensure_ascii=False, indent=2)}

Check:
1. Does the final lesson reference or build on concepts from earlier lessons?
2. Is it a synthesis/project/integration lesson?
3. Or is it just "another topic" unrelated to the module arc?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("7.6", "Final lesson integrates", prompt, severity="major")


def _check_7_7(module_lessons: list, grade: str, module: int, ai: AIEvaluator) -> CheckResult:
    """Cross-grade prerequisites are valid (grade N references N-1 correctly)."""
    if grade == "V":  # First grade, no cross-grade prereqs possible
        return CheckResult(
            check_id="7.7", check_name="Cross-grade prerequisites",
            passed=True, details="Grade V has no prior grade prerequisites",
        )

    cross_grade_prereqs = []
    for ml in module_lessons:
        lesson = ml.get("lesson", {})
        prereqs = lesson.get("meta", {}).get("prerequisites", [])
        for p in prereqs:
            p_str = str(p) if isinstance(p, str) else p.get("lesson_code", p.get("code", ""))
            if p_str and not p_str.startswith(grade):
                cross_grade_prereqs.append({
                    "lesson": ml.get("code", ""),
                    "prerequisite": p_str,
                })

    if not cross_grade_prereqs:
        return CheckResult(
            check_id="7.7", check_name="Cross-grade prerequisites",
            passed=True, details="No cross-grade prerequisites declared",
        )

    prompt = f"""Verify cross-grade prerequisite references for module {grade}-M{module}.

Cross-grade prerequisites found:
{json.dumps(cross_grade_prereqs, ensure_ascii=False, indent=2)}

Check:
1. Do referenced prerequisite lessons from other grades actually make sense?
2. Is the knowledge they provide actually needed?
3. Are they from the correct prior grade (not skipping grades)?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("7.7", "Cross-grade prerequisites", prompt, severity="minor")


def _check_7_8(module_lessons: list, concepts_graph: dict, grade: str, module: int) -> CheckResult:
    """Knowledge graph edges are consistent with actual lesson dependencies (automated)."""
    if not concepts_graph:
        return CheckResult(
            check_id="7.8", check_name="Knowledge graph consistent",
            passed=True, details="No concepts-graph.json to validate",
        )

    # Extract concepts from lessons
    lesson_concepts = {}
    for ml in module_lessons:
        code = ml.get("code", "")
        lesson = ml.get("lesson", {})
        concepts = lesson.get("knowledge_progression", {}).get("from_general_to_specific", [])
        if isinstance(concepts, list):
            lesson_concepts[code] = [str(c).lower() for c in concepts]

    # Check graph nodes/edges
    nodes = concepts_graph.get("nodes", concepts_graph.get("concepts", []))
    edges = concepts_graph.get("edges", concepts_graph.get("links", concepts_graph.get("dependencies", [])))

    if not nodes and not edges:
        return CheckResult(
            check_id="7.8", check_name="Knowledge graph consistent",
            passed=True, details="Concepts graph has no nodes/edges structure to validate",
        )

    # Validate that graph concepts appear in lesson content
    graph_concepts = set()
    if isinstance(nodes, list):
        for n in nodes:
            if isinstance(n, str):
                graph_concepts.add(n.lower())
            elif isinstance(n, dict):
                graph_concepts.add(str(n.get("id", n.get("name", ""))).lower())

    lesson_concept_set = set()
    for concepts in lesson_concepts.values():
        lesson_concept_set.update(concepts)

    orphan_concepts = graph_concepts - lesson_concept_set if graph_concepts and lesson_concept_set else set()

    if len(orphan_concepts) > len(graph_concepts) * 0.3:  # More than 30% orphaned
        return CheckResult(
            check_id="7.8", check_name="Knowledge graph consistent",
            passed=False,
            details=f"{len(orphan_concepts)} graph concepts not found in lessons: {', '.join(list(orphan_concepts)[:5])}",
            severity="minor",
            fix_suggestion="Update concepts-graph.json to match actual lesson content",
        )
    return CheckResult(
        check_id="7.8", check_name="Knowledge graph consistent",
        passed=True,
        details=f"Graph concepts aligned with lesson content ({len(graph_concepts)} concepts checked)",
    )
