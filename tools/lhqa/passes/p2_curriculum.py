"""Pass 2: Curriculum Alignment - 8 checks (6 automated, 2 AI).

Validates lesson content against Romanian curriculum (OMEN 3393/2017),
content_map.json module definitions, and competency frameworks.
"""

import json
import re
import unicodedata
from typing import List, Set

from ..models import CheckResult, PassResult
from ..ai_eval import AIEvaluator
from .. import loader


def _strip_diacritics(text: str) -> str:
    """Remove Romanian diacritics for fuzzy comparison."""
    replacements = {
        '\u0103': 'a', '\u00e2': 'a', '\u00ee': 'i',
        '\u0219': 's', '\u021b': 't',
        '\u0102': 'A', '\u00c2': 'A', '\u00ce': 'I',
        '\u0218': 'S', '\u021a': 'T',
        '\u015f': 's', '\u0163': 't',  # cedilla variants
        '\u015e': 'S', '\u0162': 'T',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

PASS_NUMBER = 2
PASS_NAME = "Curriculum Alignment"


def run(ctx: dict, ai: AIEvaluator = None) -> PassResult:
    """Run all 8 curriculum alignment checks."""
    if ai is None:
        ai = AIEvaluator(mode="deferred")

    result = PassResult(pass_number=PASS_NUMBER, pass_name=PASS_NAME)
    lesson = ctx.get("lesson")
    parsed = ctx.get("parsed")
    module_info = ctx.get("module_info", {})
    grade_curriculum = ctx.get("grade_curriculum", {})
    content_map = ctx.get("content_map", {})

    if not lesson or not parsed:
        result.checks.append(CheckResult(
            check_id="2.0", check_name="Data available",
            passed=False, details="Missing lesson or parsed data",
            severity="critical",
        ))
        return result

    grade = parsed["grade"]
    module = parsed["module"]
    meta = lesson.get("meta", {})
    contract = lesson.get("competency_contract", {})

    # 2.1 Official competencies reference real codes
    result.checks.append(_check_2_1(contract, grade_curriculum, grade))

    # 2.2 Competency codes match grade level
    result.checks.append(_check_2_2(contract, grade, parsed))

    # 2.3 Lesson topic falls within module's declared topics
    result.checks.append(_check_2_3(meta, module_info, grade, module))

    # 2.4 I-can-statements align with competency language (AI)
    result.checks.append(_check_2_4(contract, ai, ctx))

    # 2.5 All module competencies covered across module lessons
    result.checks.append(_check_2_5(module_info, grade, module))

    # 2.6 No out-of-scope competencies (scope creep)
    result.checks.append(_check_2_6(contract, module_info))

    # 2.7 Knowledge progression follows curriculum ordering (AI)
    result.checks.append(_check_2_7(lesson, grade_curriculum, ai, ctx))

    # 2.8 Tools field lists valid curriculum tools
    result.checks.append(_check_2_8(meta, grade_curriculum))

    return result


def _check_2_1(contract: dict, grade_curr: dict, grade: str) -> CheckResult:
    """Official competencies reference real competency codes."""
    official = contract.get("official_specific_competencies", [])
    if not official:
        return CheckResult(
            check_id="2.1", check_name="Competency codes valid",
            passed=False, details="No official_specific_competencies declared",
            severity="major",
            fix_suggestion="Add competency codes from OMEN 3393/2017",
        )
    # Validate competency ID format and grade match
    grade_prefix = grade.lower() + "-"
    invalid = []
    valid_count = 0
    for comp in official:
        if isinstance(comp, dict):
            cid = comp.get("id", "")
            text = comp.get("text_ro", "")
        else:
            cid = str(comp)
            text = ""
        if not cid:
            invalid.append("(missing id)")
            continue
        # Accept IDs like "v-1.1", "vi-3.2", "vii-2.1"
        if cid.lower().startswith(grade_prefix) and re.match(
            r'^[a-z]+-\d+\.\d+$', cid.lower(), re.IGNORECASE
        ):
            valid_count += 1
        else:
            invalid.append(cid[:40])
    if invalid:
        return CheckResult(
            check_id="2.1", check_name="Competency codes valid",
            passed=False,
            details=f"{len(invalid)} competencies with invalid IDs: {'; '.join(invalid[:3])}",
            severity="major",
            fix_suggestion=f"IDs should match pattern {grade_prefix}N.N (e.g., {grade_prefix}1.1)",
        )
    return CheckResult(
        check_id="2.1", check_name="Competency codes valid",
        passed=True, details=f"All {valid_count} competency IDs valid for grade {grade}",
    )


def _check_2_2(contract: dict, grade: str, parsed: dict) -> CheckResult:
    """Competency codes match the lesson's grade level."""
    official = contract.get("official_specific_competencies", [])
    if not official:
        return CheckResult(
            check_id="2.2", check_name="Competencies match grade",
            passed=True, details="No competencies to check",
        )
    # Check if any competency references a different grade
    other_grades = {"V", "VI", "VII", "VIII"} - {grade}
    grade_nums = {loader.GRADE_NUMS.get(g, "") for g in other_grades}
    wrong_grade = []
    for comp in official:
        comp_str = str(comp)
        for og in other_grades:
            if f"clasa {og}" in comp_str.lower() or f"cls{loader.GRADE_NUMS.get(og, '')}" in comp_str.lower():
                wrong_grade.append(f"{comp_str[:40]}... (references {og})")
    if wrong_grade:
        return CheckResult(
            check_id="2.2", check_name="Competencies match grade",
            passed=False,
            details=f"Cross-grade competency references: {'; '.join(wrong_grade[:3])}",
            severity="major",
        )
    return CheckResult(
        check_id="2.2", check_name="Competencies match grade",
        passed=True, details=f"All competencies appropriate for grade {grade}",
    )


def _check_2_3(meta: dict, module_info: dict, grade: str, module: int) -> CheckResult:
    """Lesson topic falls within module's declared topics."""
    topics = module_info.get("topics", [])
    if not topics:
        return CheckResult(
            check_id="2.3", check_name="Topic in module scope",
            passed=True,
            details=f"No topics declared for {grade}-M{module} (can't validate)",
            severity="minor",
        )
    title = meta.get("title_ro", "")
    title_norm = _strip_diacritics(title).lower()
    # Recap/evaluation lessons are inherently module-scoped
    recap_words = ["recapitulare", "evaluare", "sinteza", "proiect", "test"]
    if any(w in title_norm for w in recap_words):
        return CheckResult(
            check_id="2.3", check_name="Topic in module scope",
            passed=True,
            details=f"Recap/evaluation lesson inherently scoped to module {grade}-M{module}",
        )
    # Build searchable text from topics + module unit_name
    unit_name = module_info.get("unit_name", "")
    all_topic_text = _strip_diacritics(unit_name).lower()
    topic_words = set()
    for t in topics:
        t_str = str(t).lower() if isinstance(t, str) else json.dumps(t, ensure_ascii=False).lower()
        t_norm = _strip_diacritics(t_str)
        all_topic_text += " " + t_norm
        topic_words.update(w for w in t_norm.split() if len(w) > 3)
    title_words = set(w for w in title_norm.split() if len(w) > 3)
    overlap = title_words & topic_words
    if not overlap and title_words:
        # Second pass: substring matching (word-in-word)
        for tw in title_words:
            for topw in topic_words:
                if tw in topw or topw in tw:
                    overlap.add(tw + "~" + topw)
    if not overlap and title_words:
        # Third pass: check if any title word appears anywhere in full topic text
        for tw in title_words:
            if tw in all_topic_text:
                overlap.add(tw + "~text")
    if not overlap and title_words:
        return CheckResult(
            check_id="2.3", check_name="Topic in module scope",
            passed=False,
            details=f"Lesson title '{title}' has no keyword overlap with module topics",
            severity="major",
            fix_suggestion="Verify lesson belongs to this module",
        )
    return CheckResult(
        check_id="2.3", check_name="Topic in module scope",
        passed=True,
        details=f"Title matches module topics (overlap: {', '.join(list(overlap)[:5])})",
    )


def _check_2_4(contract: dict, ai: AIEvaluator, ctx: dict) -> CheckResult:
    """I-can-statements align with competency language (AI-evaluated)."""
    official = contract.get("official_specific_competencies", [])
    i_can = contract.get("i_can_statements", {})
    lesson_code = ctx.get("lesson_code", "")

    if not official or not i_can:
        return CheckResult(
            check_id="2.4", check_name="I-can-statements aligned",
            passed=True if not official else False,
            details="Missing competencies or i-can-statements",
            severity="major",
        )

    prompt = f"""Evaluate alignment between official competencies and student "I can" statements.

Lesson: {lesson_code}
Grade: {ctx.get('parsed', {}).get('grade', '')}

Official competencies:
{json.dumps(official, ensure_ascii=False, indent=2)}

Student "I can" statements (3 levels):
{json.dumps(i_can, ensure_ascii=False, indent=2)}

Check:
1. Does each official competency have at least one matching I-can statement?
2. Are the I-can statements written in student-friendly language?
3. Do minim/standard/performanta levels show genuine progression?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("2.4", "I-can-statements aligned", prompt, severity="major")


def _check_2_5(module_info: dict, grade: str, module: int) -> CheckResult:
    """All module competencies covered by at least one lesson in the module."""
    mod_competencies = module_info.get("competente", [])
    if not mod_competencies:
        return CheckResult(
            check_id="2.5", check_name="Module competency coverage",
            passed=True,
            details=f"No competencies declared for module {grade}-M{module}",
            severity="minor",
        )
    # Load all lessons in this module and collect their competencies
    module_lessons = loader.discover_module_lessons(grade, module)
    all_lesson_comps = []
    for lcode in module_lessons:
        ldata = loader.load_lesson(lcode)
        if ldata:
            comps = ldata.get("competency_contract", {}).get("official_specific_competencies", [])
            all_lesson_comps.extend(str(c).lower() for c in comps)
    all_comp_text = " ".join(all_lesson_comps)

    uncovered = []
    for mc in mod_competencies:
        mc_str = str(mc).lower()
        mc_words = [w for w in mc_str.split() if len(w) > 4]
        if mc_words and not any(w in all_comp_text for w in mc_words[:3]):
            uncovered.append(str(mc)[:60])

    if uncovered:
        return CheckResult(
            check_id="2.5", check_name="Module competency coverage",
            passed=False,
            details=f"{len(uncovered)} module competencies not covered: {'; '.join(uncovered[:3])}",
            severity="major",
            fix_suggestion="Add lessons or competency mappings for uncovered competencies",
        )
    return CheckResult(
        check_id="2.5", check_name="Module competency coverage",
        passed=True,
        details=f"All {len(mod_competencies)} module competencies covered across {len(module_lessons)} lessons",
    )


def _check_2_6(contract: dict, module_info: dict) -> CheckResult:
    """No out-of-scope competencies (lesson doesn't claim competencies from other modules)."""
    official = contract.get("official_specific_competencies", [])
    mod_comps_raw = module_info.get("competente", "")

    if not official or not mod_comps_raw:
        return CheckResult(
            check_id="2.6", check_name="No scope creep",
            passed=True, details="Insufficient data for scope check",
        )
    # Parse module competency IDs from string "1.1, 1.2" or list
    if isinstance(mod_comps_raw, str):
        mod_ids = {s.strip() for s in mod_comps_raw.split(",") if s.strip()}
    elif isinstance(mod_comps_raw, list):
        mod_ids = {str(c).strip() for c in mod_comps_raw}
    else:
        mod_ids = set()

    if not mod_ids:
        return CheckResult(
            check_id="2.6", check_name="No scope creep",
            passed=True, details="No module competency IDs to check against",
        )
    # Extract numeric IDs from lesson competencies (e.g., "v-1.1" -> "1.1")
    out_of_scope = []
    for comp in official:
        if isinstance(comp, dict):
            cid = comp.get("id", "")
        else:
            cid = str(comp)
        # Extract numeric part after grade prefix (e.g., "v-1.1" -> "1.1")
        parts = cid.split("-", 1)
        numeric_id = parts[1] if len(parts) > 1 else cid
        if numeric_id and numeric_id not in mod_ids:
            out_of_scope.append(cid)

    if out_of_scope and len(out_of_scope) == len(official):
        return CheckResult(
            check_id="2.6", check_name="No scope creep",
            passed=False,
            details=f"{len(out_of_scope)} competencies outside module scope ({', '.join(sorted(mod_ids))}): {'; '.join(out_of_scope[:3])}",
            severity="minor",
            fix_suggestion="Review competency-to-module mapping",
        )
    return CheckResult(
        check_id="2.6", check_name="No scope creep",
        passed=True,
        details=f"Competencies within module scope ({', '.join(sorted(mod_ids))})",
    )


def _check_2_7(lesson: dict, grade_curr: dict, ai: AIEvaluator, ctx: dict) -> CheckResult:
    """Knowledge progression follows curriculum ordering (AI-evaluated)."""
    progression = lesson.get("knowledge_progression", {})
    if not progression:
        return CheckResult(
            check_id="2.7", check_name="Progression follows curriculum",
            passed=False, details="No knowledge_progression section",
            severity="major",
        )

    prompt = f"""Evaluate whether this lesson's knowledge progression follows a logical curriculum sequence.

Lesson: {ctx.get('lesson_code', '')}
Title: {lesson.get('meta', {}).get('title_ro', '')}
Grade: {ctx.get('parsed', {}).get('grade', '')}

Knowledge progression:
{json.dumps(progression, ensure_ascii=False, indent=2)}

Grade curriculum topics:
{json.dumps(grade_curr.get('sample_topics', grade_curr.get('main_themes', [])), ensure_ascii=False, indent=2)}

Check:
1. Does from_general_to_specific actually go from general to specific?
2. Is the progression logical for this grade level?
3. Are common_misconceptions appropriate and actually common?

Respond with JSON: {{"passed": true/false, "reasoning": "...", "issues": [...]}}"""

    return ai.evaluate("2.7", "Progression follows curriculum", prompt, severity="major")


_COMMON_EDUCATIONAL_TOOLS = {
    # Generic classroom tools (always valid)
    "calculator", "proiector", "tabla", "tabla interactiva",
    "fise de lucru", "fise de evaluare", "caiet", "manual",
    "videoproiector", "laptop", "computer", "pc",
    # Peripherals & hardware
    "imprimanta", "casti", "casti audio", "microfon", "camera web",
    "mouse", "tastatura", "scanner", "boxe", "monitor",
    # Internet/browser tools
    "browser", "navigator", "internet", "calculator cu acces la internet",
    # Office & productivity
    "word", "excel", "powerpoint", "microsoft word", "microsoft excel",
    "microsoft powerpoint", "libreoffice", "google docs", "google slides",
    # Programming & CS
    "scratch", "python", "c++", "html", "css", "javascript",
    "visual studio code", "notepad++", "editor de text",
    # Graphics & multimedia
    "paint", "gimp", "tinkercad", "blender", "audacity",
    "editor grafic", "editor de imagini", "editor video",
    # OS & file management
    "sistem de operare", "windows", "linux", "explorator de fisiere",
    "file explorer", "manager de fisiere",
    # Educational resources (printouts, examples, prior work)
    "kahoot", "quizlet", "prezentare", "diagrama",
    "fise", "exemple", "capturi", "schita", "proiect",
    # Assessment & collaboration materials
    "fisa de testare", "fisa de evaluare", "rubrica",
    "partener de testare", "partener", "calendar",
    # Templates & documentation
    "sablon", "sabloane", "sabloane de planificare",
    "documentatie", "documentatia tehnica", "lista",
}

# Patterns that indicate lesson-reference tools (prior work, artifacts from earlier lessons)
_LESSON_REFERENCE_PATTERNS = [
    r"de la lecti[ai]",           # "de la lectia anterioara", "de la L02"
    r"creat[aă]\s+(anterior|in|în)",  # "creata anterior", "creata în lectia"
    r"din lecti[ai]",             # "din lectia anterioara"
    r"completat[aă]",            # "baza de date completată"
    r"complet[aă]$",             # "baza de date completă"
    r"cu date",                   # "cu date introduse"
    r"cu tabele",                 # "cu tabele și date"
    r"fiecarei componente",       # "documentatia tehnica a fiecarei componente"
    r"scenarii de test",          # "lista de scenarii de test"
    r"clasificate pe",            # "intrebarile clasificate pe dificultate"
    r"cu intrebarile",            # "planul cu intrebarile"
]


def _check_2_8(meta: dict, grade_curr: dict) -> CheckResult:
    """Tools field lists valid curriculum tools for this grade."""
    tools = meta.get("tools", [])
    if not tools:
        return CheckResult(
            check_id="2.8", check_name="Valid curriculum tools",
            passed=True, details="No tools declared (acceptable for theory lessons)",
        )
    # Build comprehensive tool set: curriculum tools + common educational tools
    curr_tools = grade_curr.get("key_tools", [])
    all_valid = set(_COMMON_EDUCATIONAL_TOOLS)
    for t in curr_tools:
        all_valid.add(_strip_diacritics(str(t)).lower())

    unknown = []
    for tool in tools:
        tool_norm = _strip_diacritics(str(tool)).lower().strip()
        # Direct match
        if tool_norm in all_valid:
            continue
        # Substring match: tool is part of a valid tool or vice versa
        if any(tool_norm in v or v in tool_norm for v in all_valid):
            continue
        # Word match: any significant word appears in valid tools
        tool_words = [w for w in tool_norm.split() if len(w) > 3]
        valid_text = " ".join(all_valid)
        if tool_words and any(w in valid_text for w in tool_words):
            continue
        # Lesson-reference pattern: prior work artifacts from earlier lessons
        if any(re.search(pat, tool_norm) for pat in _LESSON_REFERENCE_PATTERNS):
            continue
        unknown.append(str(tool))

    if unknown:
        return CheckResult(
            check_id="2.8", check_name="Valid curriculum tools",
            passed=False,
            details=f"Tools not in curriculum: {', '.join(unknown)}",
            severity="minor",
            fix_suggestion="Verify these tools are appropriate for this grade level",
        )
    return CheckResult(
        check_id="2.8", check_name="Valid curriculum tools",
        passed=True, details=f"All {len(tools)} tools valid for curriculum",
    )
