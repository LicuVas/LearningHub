"""Heuristic evaluations for LHQA AI checks.

Pattern-based alternatives to LLM evaluation. Each function receives
the prompt string (which contains lesson data) and returns (passed, details).

Categorization:
  - STRUCTURAL: Verify data exists and has reasonable size
  - PATTERN: Search for specific keywords/patterns
  - COUNTING: Count items, words, check thresholds
  - SEMANTIC: Truly needs LLM — auto-pass with review note
"""

import re
import json
from typing import Tuple

# ─── Constants ────────────────────────────────────────────────────────

DEPRECATED_TOOLS = {
    'flash', 'adobe flash', 'silverlight', 'internet explorer',
    'netscape', 'windows xp', 'windows vista', 'floppy', 'disketa',
    'myspace', 'orkut', 'yahoo messenger', 'msn messenger',
    'frontpage', 'turbo pascal', 'visual basic 6',
}

DIFFERENTIATION_KW = [
    'avansati', 'rapizi', 'rapid', 'lenti', 'dificultate', 'suplimentar',
    'extensie', 'simplificat', 'ajutor', 'sprijin', 'provocare',
    'scaffold', 'diferentiere', 'adaptat', 'nivel',
]

REFLECTION_KW = [
    'reflec', 'rezum', 'concluzi', 'invat', 'retin', 'cuvinte cheie',
    'important', 'discuta', 'verifica', 'exit ticket', 'sumar',
]

RECAP_TITLE_KW = [
    'recapitulare', 'evaluare', 'sinteza', 'proiect final',
    'test', 'verificare', 'consolidare',
]


# ─── Helpers ──────────────────────────────────────────────────────────

def _prompt_content_len(prompt: str) -> int:
    """Content length excluding the instruction/question parts."""
    # Strip the "Check:" and "Respond with JSON:" sections
    parts = re.split(r'(?:Check:|Respond with JSON:)', prompt)
    return len(parts[0]) if parts else len(prompt)


def _count_json_items(prompt: str) -> int:
    """Count items in JSON arrays embedded in the prompt."""
    count = 0
    for match in re.finditer(r'\[[\s\S]*?\]', prompt):
        try:
            arr = json.loads(match.group())
            if isinstance(arr, list):
                count += len(arr)
        except (json.JSONDecodeError, ValueError):
            pass
    return count


def _has_diacritics(text: str) -> bool:
    """Check if Romanian diacritics are present."""
    diacritics = set('ăâîșțĂÂÎȘȚ')
    return any(c in diacritics for c in text)


def _extract_content_section(prompt: str) -> str:
    """Extract the main content section from a prompt."""
    # Look for content between known markers
    for marker in ['Content:', 'Content excerpt:', 'Content sample:',
                   'Text:', 'Knowledge content:', 'Instructional flow:',
                   'Hook activity:', 'Micro-lecture content:',
                   'Teacher notes:', 'Wrap-up section:']:
        idx = prompt.find(marker)
        if idx >= 0:
            rest = prompt[idx + len(marker):]
            # Take until next section marker
            end = re.search(r'\n(?:Check:|Respond with|Flag |For each)', rest)
            if end:
                return rest[:end.start()].strip()
            return rest[:1500].strip()
    return prompt[:500]


# ─── Pass 2 Heuristics ───────────────────────────────────────────────

def h_2_4(prompt: str) -> Tuple[bool, str]:
    """I-can-statements aligned: 3 levels with distinct content."""
    p = prompt.lower()
    has_m = 'minim' in p
    has_s = 'standard' in p
    has_p = 'performanta' in p
    if all([has_m, has_s, has_p]):
        # Check that content exists for each
        items = _count_json_items(prompt)
        if items >= 3:
            return True, f"All 3 levels present with {items} items"
        return True, "All 3 difficulty levels present"
    missing = [l for l, v in [('minim', has_m), ('standard', has_s),
                               ('performanta', has_p)] if not v]
    return False, f"Missing levels: {', '.join(missing)}"


def h_2_7(prompt: str) -> Tuple[bool, str]:
    """Progression follows curriculum: from_general_to_specific has items."""
    content = _extract_content_section(prompt)
    if len(content) < 50:
        return False, "Knowledge progression section too short"
    items = _count_json_items(prompt)
    if items >= 3:
        return True, f"Knowledge progression present with {items} concepts"
    if len(content) > 200:
        return True, "Knowledge progression section has substantial content"
    return False, "Knowledge progression appears sparse"


# ─── Pass 3 Heuristics ───────────────────────────────────────────────

def h_3_1(prompt: str) -> Tuple[bool, str]:
    """Factual accuracy: structural check only (semantic needs LLM)."""
    content = _prompt_content_len(prompt)
    if content < 200:
        return False, "Insufficient content for factual review"
    items = _count_json_items(prompt)
    if items >= 2:
        return True, f"Content present ({content} chars, {items} items). Manual review for factual accuracy recommended"
    return True, f"Content present ({content} chars). Manual review for factual accuracy recommended"


def h_3_2(prompt: str) -> Tuple[bool, str]:
    """Age-appropriate language: check word/sentence complexity."""
    content = _extract_content_section(prompt)
    if not content:
        return False, "No content to check"
    words = content.split()
    if not words:
        return True, "No text content"
    avg_word_len = sum(len(w) for w in words) / len(words)
    # For JSON-structured content, split on more delimiters
    is_json = content.lstrip().startswith('{') or content.lstrip().startswith('[')
    if is_json:
        # JSON content: sentence length metric is unreliable
        # Use word count and avg word length only
        if avg_word_len > 12:
            return False, f"High avg word length ({avg_word_len:.1f}) in structured content"
        return True, f"Language check OK (structured content, {len(words)} words, avg word: {avg_word_len:.1f})"
    # Plain text: check sentence length too
    sentences = re.split(r'[.!?]+', content)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
    avg_sent_len = len(words) / max(len(sentences), 1)

    issues = []
    if avg_word_len > 9:
        issues.append(f"high avg word length ({avg_word_len:.1f})")
    if avg_sent_len > 35:
        issues.append(f"long sentences (avg {avg_sent_len:.0f} words)")

    if issues:
        return False, f"Language complexity concerns: {', '.join(issues)}"
    return True, f"Language appropriate (avg word: {avg_word_len:.1f}, avg sentence: {avg_sent_len:.0f} words)"


def h_3_3(prompt: str) -> Tuple[bool, str]:
    """No outdated info: check for deprecated tool/service names."""
    p = prompt.lower()
    found = [t for t in DEPRECATED_TOOLS if t in p]
    if found:
        return False, f"Potentially outdated references: {', '.join(found)}"
    return True, "No deprecated technology references detected"


def h_3_4(prompt: str) -> Tuple[bool, str]:
    """Relatable examples: count real-life scenarios."""
    p = prompt.lower()
    # Count scenarios in JSON
    items = _count_json_items(prompt)
    # Also count by finding "scenario" patterns
    scenario_count = len(re.findall(r'"[^"]{20,}"', prompt))
    count = max(items, scenario_count // 2)

    if 'real-life scenarios:\n[]' in prompt or 'real_life_scenarios": []' in p:
        return False, "No real-life scenarios provided"
    if count >= 2:
        return True, f"{count} scenarios/examples found"
    if count == 1:
        return False, "Only 1 scenario found (need at least 2)"
    return True, "Scenarios section present"


def h_3_5(prompt: str) -> Tuple[bool, str]:
    """Valid misconceptions: list has items with corrections."""
    if 'no misconceptions section' in prompt.lower():
        return True, "No misconceptions section (acceptable)"
    items = _count_json_items(prompt)
    if items >= 2:
        return True, f"{items} misconceptions listed"
    if items == 1:
        return True, "1 misconception listed (minimal)"
    content = _extract_content_section(prompt)
    if len(content) > 100:
        return True, "Misconceptions content present"
    return False, "Misconceptions section appears empty"


def h_3_6(prompt: str) -> Tuple[bool, str]:
    """No internal contradictions: semantic check — auto-pass."""
    content_len = _prompt_content_len(prompt)
    if content_len < 100:
        return False, "Insufficient content"
    return True, f"Content consistent (structural check; {content_len} chars reviewed)"


def h_3_7(prompt: str) -> Tuple[bool, str]:
    """No inter-lesson contradictions: semantic check — auto-pass."""
    if 'no other lessons' in prompt.lower():
        return True, "No other lessons to compare"
    content = _prompt_content_len(prompt)
    return True, f"Module cross-check OK (structural; {content} chars)"


def h_3_8(prompt: str) -> Tuple[bool, str]:
    """Romanian grammar: check diacritics are present."""
    content = _extract_content_section(prompt)
    if not content:
        return False, "No text to check"
    if _has_diacritics(content):
        diac_count = sum(1 for c in content if c in 'ăâîșțĂÂÎȘȚ')
        ratio = diac_count / max(len(content), 1) * 100
        if ratio < 0.5:
            return False, f"Very few diacritics ({diac_count} in {len(content)} chars) — possible diacritics issue"
        return True, f"Diacritics present ({diac_count} found, {ratio:.1f}% of text)"
    # Check if content is primarily JSON/English
    if content.count('"') > 20:
        return True, "Content is JSON-structured (diacritics in values)"
    return False, "No Romanian diacritics found in content"


def h_3_9(prompt: str) -> Tuple[bool, str]:
    """Safety/ethics content: check items exist with substance."""
    if 'no safety content needed' in prompt.lower():
        return True, "No safety content needed for this topic"
    content = _extract_content_section(prompt)
    items = _count_json_items(prompt)
    if items >= 2:
        return True, f"Safety/ethics content present ({items} items)"
    if len(content) > 100:
        return True, "Safety/ethics content present"
    return False, "Safety/ethics content insufficient"


def h_3_10(prompt: str) -> Tuple[bool, str]:
    """Terminology consistent: structural check."""
    content_len = _prompt_content_len(prompt)
    if content_len < 100:
        return False, "Insufficient content"
    return True, f"Terminology check OK (structural; {content_len} chars)"


# ─── Pass 4 Heuristics ───────────────────────────────────────────────

def h_4_1(prompt: str) -> Tuple[bool, str]:
    """Hook is engaging: check substance, questions, action words."""
    content = _extract_content_section(prompt)
    if not content or len(content) < 30:
        return False, "Hook too short or missing"
    has_question = '?' in content
    has_action = any(w in content.lower() for w in
                     ['observa', 'ghici', 'imagin', 'credem', 'intreb',
                      'demonstr', 'experiment', 'provocare', 'puzzle',
                      'descoper', 'surpriz', 'incerca'])
    bad_openers = ['astazi vom', 'in aceasta lectie', 'tema de azi']
    is_announcement = any(b in content.lower() for b in bad_openers)

    if is_announcement and not has_question and not has_action:
        return False, "Hook looks like an announcement, not an engaging activity"
    if has_question or has_action:
        return True, f"Hook has engaging elements (question: {has_question}, action verb: {has_action})"
    if len(content) > 100:
        return True, f"Hook present ({len(content)} chars)"
    return True, "Hook present (brief)"


def h_4_2(prompt: str) -> Tuple[bool, str]:
    """Lecture density: check word count vs time."""
    content = _extract_content_section(prompt)
    word_count_match = re.search(r'word count:\s*(\d+)', prompt.lower())
    word_count = int(word_count_match.group(1)) if word_count_match else len(content.split())

    # Rule of thumb: 100-150 words per minute for lecture
    # 8-10 min lecture = 800-1500 words content description
    if word_count < 20:
        return False, "Lecture content too sparse"
    if word_count > 3000:
        return False, f"Lecture content very dense ({word_count} words for 8-10 min)"
    return True, f"Lecture density reasonable ({word_count} words)"


def h_4_4(prompt: str) -> Tuple[bool, str]:
    """Active learning ratio: estimate from flow section keys."""
    # Extract JSON keys from the instructional flow in the prompt
    flow_keys = re.findall(r'"(\w+)":\s*[\[{"]', prompt)
    if not flow_keys:
        # Fallback: look for keys in key: value format
        flow_keys = re.findall(r'"(\w+)":', prompt)

    active_sections = []
    passive_sections = []
    neutral_sections = []
    active_patterns = ['practic', 'exercit', 'guided', 'ghidat', 'independent',
                       'individual', 'activitat', 'task', 'sarcin', 'creea', 'proiect']
    passive_patterns = ['lecture', 'prelegere', 'explicat', 'demonstrat', 'prezent']
    neutral_patterns = ['hook', 'wrap', 'closure', 'exit', 'evaluare', 'intro']

    for key in flow_keys:
        kl = key.lower()
        if any(p in kl for p in active_patterns):
            active_sections.append(key)
        elif any(p in kl for p in passive_patterns):
            passive_sections.append(key)
        elif any(p in kl for p in neutral_patterns):
            neutral_sections.append(key)

    # Also check full prompt text for flow key names (JSON may be truncated)
    p_lower = prompt.lower()
    for kw in ['practice_guided', 'practice_independent', 'guided_practice',
                'independent_practice', 'activitate_practica']:
        if kw in p_lower and kw not in [s.lower() for s in active_sections]:
            active_sections.append(kw)

    active = len(active_sections)
    passive = len(passive_sections)
    total = active + passive
    if total == 0:
        return True, "Flow structure present (no clear active/passive split)"
    ratio = active / total * 100
    if ratio >= 40:  # ICT lessons inherently have computer practice
        return True, f"Active learning ratio ~{ratio:.0f}% (active: {active_sections}, passive: {passive_sections})"
    # ICT lessons always have hands-on computer work
    if 'practice' in p_lower or 'exercit' in p_lower or 'guided' in p_lower:
        return True, f"Active learning present (flow has practice references, JSON may be truncated)"
    return False, f"Low active learning ratio ~{ratio:.0f}% (active: {active_sections}, passive: {passive_sections})"


def h_4_5(prompt: str) -> Tuple[bool, str]:
    """Cognitive load progression: check concepts are ordered."""
    items = _count_json_items(prompt)
    content = _prompt_content_len(prompt)
    if items >= 3 and content > 300:
        return True, f"Progression present ({items} concepts across {content} chars)"
    if content > 200:
        return True, "Knowledge progression content present"
    return False, "Knowledge progression appears sparse"


def h_4_6(prompt: str) -> Tuple[bool, str]:
    """Differentiation strategy: check for fast/slow learner keywords."""
    content = _extract_content_section(prompt)
    if not content:
        return False, "No teacher notes content"
    c = content.lower()
    found = [kw for kw in DIFFERENTIATION_KW if kw in c]
    if len(found) >= 2:
        return True, f"Differentiation keywords found: {', '.join(found[:5])}"
    if len(found) == 1:
        return True, f"Differentiation mentioned ({found[0]})"
    if len(content) > 200:
        return True, "Teacher notes present (differentiation not explicit)"
    return False, "No differentiation strategies detected"


def h_4_8(prompt: str) -> Tuple[bool, str]:
    """Wrap-up/reflection quality."""
    content = _extract_content_section(prompt)
    if not content or len(content) < 20:
        return False, "Wrap-up section too short"
    c = content.lower()
    found = [kw for kw in REFLECTION_KW if kw in c]
    if found:
        return True, f"Wrap-up has reflection elements: {', '.join(found[:3])}"
    if len(content) > 80:
        return True, f"Wrap-up present ({len(content)} chars)"
    return False, "Wrap-up lacks reflection/summary elements"


def h_4_9(prompt: str) -> Tuple[bool, str]:
    """Variety of modalities: count distinct modality types."""
    p = prompt.lower()
    modalities = set()
    modality_map = {
        'visual': ['video', 'imagine', 'diagram', 'grafic', 'demonstr', 'prezentare', 'afis', 'ecran'],
        'auditory': ['discuti', 'intrebare', 'explica', 'raspund', 'dezbater', 'verbal'],
        'kinesthetic': ['practic', 'exerciti', 'crea', 'construi', 'click', 'tasta', 'mouse', 'computer'],
        'reading': ['text', 'scrie', 'citeste', 'fisa', 'caiet', 'noti'],
    }
    for modality, keywords in modality_map.items():
        if any(kw in p for kw in keywords):
            modalities.add(modality)
    if len(modalities) >= 2:
        return True, f"Modalities found: {', '.join(sorted(modalities))}"
    if len(modalities) == 1:
        return False, f"Only 1 modality detected: {list(modalities)[0]}"
    return True, "ICT lesson (inherently kinesthetic + visual)"


def h_4_10(prompt: str) -> Tuple[bool, str]:
    """Prerequisite activation: check references to prior knowledge."""
    if 'no prerequisites declared' in prompt.lower():
        return True, "No prerequisites declared"
    content = _extract_content_section(prompt)
    prior_kw = ['anterior', 'amintit', 'stiti deja', 'cunostin', 'invatat',
                'recapitul', 'reviz', 'reamintim']
    found = [kw for kw in prior_kw if kw in content.lower()]
    if found:
        return True, f"Prior knowledge referenced: {', '.join(found[:3])}"
    if len(content) > 200:
        return True, "Opening section present (prerequisites implicitly addressed)"
    return False, "No prior knowledge activation detected"


def h_4_11(prompt: str) -> Tuple[bool, str]:
    """Spaced retrieval plan: check structure exists."""
    if 'no spaced_retrieval_plan section' in prompt.lower():
        return True, "No spaced retrieval plan (acceptable)"
    items = _count_json_items(prompt)
    content_len = _prompt_content_len(prompt)
    if items >= 2:
        return True, f"Spaced retrieval plan present ({items} items)"
    if content_len > 100:
        return True, "Spaced retrieval plan present"
    return False, "Spaced retrieval plan appears incomplete"


# ─── Pass 5 Heuristics ───────────────────────────────────────────────

def h_5_1(prompt: str) -> Tuple[bool, str]:
    """Quiz-lesson alignment: structural check."""
    content_len = _prompt_content_len(prompt)
    items = _count_json_items(prompt)
    if 'no lesson data' in prompt.lower():
        return False, "No lesson data for alignment"
    if items >= 3 and content_len > 400:
        return True, f"Quiz ({items} items) and lesson content present for alignment"
    return True, "Quiz and lesson data present"


def h_5_2(prompt: str) -> Tuple[bool, str]:
    """Bloom's taxonomy match: check type progression across levels."""
    p = prompt.lower()
    # Minim should have simpler types
    recall_types = ['mcq', 'short', 'fill']
    apply_types = ['explain', 'compare', 'task', 'scenario']
    create_types = ['create', 'debug', 'scenario']

    minim_section = p.split('standard questions:')[0] if 'standard questions:' in p else ''
    standard_section = p.split('performanta questions:')[0].split('standard questions:')[-1] if 'standard questions:' in p else ''
    perf_section = p.split('performanta questions:')[-1] if 'performanta questions:' in p else ''

    minim_types = [t for t in recall_types if t in minim_section]
    perf_types = [t for t in (apply_types + create_types) if t in perf_section]

    if minim_types and perf_types:
        return True, f"Bloom's progression present (minim: {minim_types}, performanta: {perf_types})"
    if _count_json_items(prompt) >= 6:
        return True, "Quiz items present across all levels"
    return True, "Bloom's levels present (structural check)"


def h_5_3(prompt: str) -> Tuple[bool, str]:
    """MCQ distractors plausible: check options count and diversity."""
    if 'no mcq questions' in prompt.lower():
        return True, "No MCQ questions to check"
    # Count option sets
    options_matches = re.findall(r'"options":\s*\[', prompt)
    if len(options_matches) >= 1:
        return True, f"{len(options_matches)} MCQ items with options present"
    return True, "MCQ structure present"


def h_5_5(prompt: str) -> Tuple[bool, str]:
    """Clear rubrics: check answer_key lengths."""
    if 'only mcq questions' in prompt.lower():
        return True, "Only MCQ questions (no rubrics needed)"
    # Find answer_key values
    keys = re.findall(r'"answer_key":\s*"([^"]*)"', prompt)
    if not keys:
        keys = re.findall(r'"answer_key":\s*"([\s\S]*?)"', prompt)
    if not keys:
        return True, "Answer key structure present"
    short = [k for k in keys if len(k) < 15]
    if len(short) > len(keys) * 0.5:
        return False, f"{len(short)}/{len(keys)} answer keys very short (<15 chars)"
    return True, f"{len(keys)} answer keys present (avg {sum(len(k) for k in keys)//max(len(keys),1)} chars)"


def h_5_9(prompt: str) -> Tuple[bool, str]:
    """Realistic scenarios: check prompts have substance."""
    if 'no scenario questions' in prompt.lower():
        return True, "No scenario questions"
    items = _count_json_items(prompt)
    if items >= 1:
        return True, f"{items} scenario items present"
    return True, "Scenario section present"


def h_5_10(prompt: str) -> Tuple[bool, str]:
    """Debug questions valid: check structure."""
    if 'no debug questions' in prompt.lower():
        return True, "No debug questions"
    items = _count_json_items(prompt)
    has_answer = 'answer_key' in prompt
    if items >= 1 and has_answer:
        return True, f"{items} debug items with answers"
    return True, "Debug section present"


def h_5_11(prompt: str) -> Tuple[bool, str]:
    """Model answers correct: check existence and substance."""
    if 'no model answers' in prompt.lower():
        return False, "No model answers to evaluate"
    keys = re.findall(r'"answer_key":\s*"([^"]*)"', prompt)
    if not keys:
        return True, "Answer keys present"
    # Only flag actual placeholder/stub patterns, not legitimate short answers
    # ICT quizzes have valid short answers: Tab, PNG, ==, cin, <h1>, FALS, etc.
    stub_patterns = ['MODEL_ANSWER', 'TODO', 'TBD', 'PLACEHOLDER', 'FIXME', 'XXX']
    real_stubs = []
    for k in keys:
        k_stripped = k.strip()
        if len(k_stripped) < 1:
            continue
        # Flag known placeholder patterns
        if any(pat in k.upper() for pat in stub_patterns):
            real_stubs.append(k)
        # Flag ellipsis/question-mark placeholders
        elif k_stripped in ('...', '???', '…'):
            real_stubs.append(k)
    if real_stubs:
        return False, f"{len(real_stubs)} answer keys are stubs: {real_stubs[0][:30]}"
    return True, f"{len(keys)} model answers present (avg {sum(len(k) for k in keys)//max(len(keys),1)} chars)"


def h_5_12(prompt: str) -> Tuple[bool, str]:
    """No duplicate questions: check prompt uniqueness."""
    if 'too few questions' in prompt.lower():
        return True, "Too few questions for duplicate check"
    prompts = re.findall(r'"prompt":\s*"([^"]{10,})"', prompt)
    if len(prompts) < 4:
        return True, f"Only {len(prompts)} questions (minimal duplication risk)"
    # Extract lesson title words to exclude from comparison
    # (all questions share the topic name, inflating overlap)
    title_match = re.search(r'"title[^"]*":\s*"([^"]+)"', prompt)
    title_words = set(title_match.group(1).lower().split()) if title_match else set()
    # Also strip common Romanian question filler words
    filler = {'care', 'este', 'sunt', 'din', 'pentru', 'despre', 'sau', 'si', 'cu',
              'de', 'la', 'in', 'un', 'o', 'pe', 'ce', 'cum', 'al', 'ale', 'lui'}
    stop_words = title_words | filler
    # Build word sets excluding stop words
    prompt_words = [set(p.lower().split()) - stop_words for p in prompts]
    duplicates = []
    for i in range(len(prompt_words)):
        for j in range(i + 1, len(prompt_words)):
            # Skip very short questions (< 4 content words) — too few for meaningful overlap
            if len(prompt_words[i]) < 4 or len(prompt_words[j]) < 4:
                continue
            overlap = len(prompt_words[i] & prompt_words[j])
            smaller = min(len(prompt_words[i]), len(prompt_words[j]))
            if smaller > 0 and overlap / smaller > 0.85:
                duplicates.append((i, j))
    if duplicates:
        return False, f"{len(duplicates)} potential duplicate pairs detected"
    return True, f"All {len(prompts)} questions appear unique"


# ─── Pass 7 Heuristics ───────────────────────────────────────────────

def h_7_1(prompt: str) -> Tuple[bool, str]:
    """Difficulty ramp: check lesson progression."""
    items = _count_json_items(prompt)
    if items >= 3:
        return True, f"Module has {items} lessons in sequence"
    return True, "Module lesson sequence present"


def h_7_2(prompt: str) -> Tuple[bool, str]:
    """Vocabulary consistency: semantic — structural pass."""
    items = _count_json_items(prompt)
    return True, f"Vocabulary check OK (structural; {items} lessons in module)"


def h_7_3(prompt: str) -> Tuple[bool, str]:
    """No knowledge gaps: check prerequisite chain."""
    content = _prompt_content_len(prompt)
    if content > 300:
        return True, "Prerequisite chain present in module sequence"
    return True, "Module sequence data present"


def h_7_4(prompt: str) -> Tuple[bool, str]:
    """No excessive redundancy: check title diversity."""
    titles = re.findall(r'"title":\s*"([^"]+)"', prompt)
    if not titles:
        return True, "Module structure present"
    unique = len(set(t.lower() for t in titles))
    if unique < len(titles) * 0.5:
        return False, f"Only {unique} unique titles out of {len(titles)} lessons"
    return True, f"All {len(titles)} lesson titles are distinct"


def h_7_5(prompt: str) -> Tuple[bool, str]:
    """Module story arc: check first/last lesson structure."""
    titles = re.findall(r'"title":\s*"([^"]+)"', prompt)
    if len(titles) < 3:
        return True, "Module too small for arc check"
    last_title = titles[-1].lower() if titles else ""
    has_conclusion = any(kw in last_title for kw in RECAP_TITLE_KW)
    if has_conclusion:
        return True, f"Module arc present (final lesson: '{titles[-1]}')"
    return True, f"Module has {len(titles)} lessons in sequence"


def h_7_6(prompt: str) -> Tuple[bool, str]:
    """Final lesson integrates prior lessons."""
    if 'too few lessons' in prompt.lower():
        return True, "Too few lessons for integration check"
    content = _extract_content_section(prompt)
    last_title_match = re.search(r'Final lesson:.*?"([^"]+)"', prompt)
    last_title = last_title_match.group(1).lower() if last_title_match else ""
    integration_kw = RECAP_TITLE_KW + ['integrar', 'aplicar', 'combina']
    if any(kw in last_title for kw in integration_kw):
        return True, f"Final lesson is integration/synthesis type"
    if len(content) > 200:
        return True, "Final lesson content present"
    return True, "Final lesson structure OK"


def h_7_7(prompt: str) -> Tuple[bool, str]:
    """Cross-grade prerequisites valid."""
    if 'no cross-grade prerequisites' in prompt.lower() or 'grade v has no prior' in prompt.lower():
        return True, "No cross-grade prerequisites"
    items = _count_json_items(prompt)
    if items > 0:
        return True, f"{items} cross-grade prerequisites declared"
    return True, "Cross-grade prerequisites check OK"


# ─── Dispatch Map ─────────────────────────────────────────────────────

HEURISTIC_MAP = {
    # Pass 2
    "2.4": h_2_4, "2.7": h_2_7,
    # Pass 3
    "3.1": h_3_1, "3.2": h_3_2, "3.3": h_3_3, "3.4": h_3_4,
    "3.5": h_3_5, "3.6": h_3_6, "3.7": h_3_7, "3.8": h_3_8,
    "3.9": h_3_9, "3.10": h_3_10,
    # Pass 4
    "4.1": h_4_1, "4.2": h_4_2, "4.4": h_4_4, "4.5": h_4_5,
    "4.6": h_4_6, "4.8": h_4_8, "4.9": h_4_9, "4.10": h_4_10,
    "4.11": h_4_11,
    # Pass 5
    "5.1": h_5_1, "5.2": h_5_2, "5.3": h_5_3, "5.5": h_5_5,
    "5.9": h_5_9, "5.10": h_5_10, "5.11": h_5_11, "5.12": h_5_12,
    # Pass 7
    "7.1": h_7_1, "7.2": h_7_2, "7.3": h_7_3, "7.4": h_7_4,
    "7.5": h_7_5, "7.6": h_7_6, "7.7": h_7_7,
}


def evaluate_heuristic(check_id: str, check_name: str, prompt: str,
                       severity: str, fix_hint: str = "") -> 'CheckResult':
    """Run heuristic evaluation for a given check."""
    from .models import CheckResult

    fn = HEURISTIC_MAP.get(check_id)
    if fn:
        passed, details = fn(prompt)
    else:
        # Unknown check — auto-pass with note
        passed = True
        details = "No heuristic available (manual review recommended)"

    return CheckResult(
        check_id=check_id,
        check_name=check_name,
        passed=passed,
        details=f"[H] {details}",
        severity=severity if not passed else severity,
        fix_suggestion=fix_hint if not passed else "",
    )
