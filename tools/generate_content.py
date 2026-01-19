#!/usr/bin/env python3
"""
LearningHub Content Generator
=============================
Genereaza structura de module, lectii si quiz-uri din curriculum JSON.

Usage:
    python generate_content.py --all
    python generate_content.py --grade V
    python generate_content.py --grade V --module 3
"""

import argparse
import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Tuple, Optional

# Configurare cai
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
CURRICULUM_PATH = PROJECT_ROOT / "curriculum" / "curriculum_ro_ict_cs_gimnaziu.json"
MODULE_MAP_PATH = PROJECT_ROOT / "planning" / "module_thematic_map.json"
TEMPLATES_PATH = PROJECT_ROOT / "rules" / "question_templates.json"
OUTPUT_ROOT = PROJECT_ROOT

# Romanian stopwords for keyword extraction
STOPWORDS_RO = {
    "si", "de", "din", "in", "la", "cu", "pe", "un", "o", "unei", "ale", "al", "a", "intr", "pentru",
    "care", "sau", "prin", "se", "este", "sunt", "ca", "intre", "mai", "fara", "dupa", "despre",
    "unor", "unei", "ale", "cel", "cea", "cei", "cele"
}


def read_json(path: Path) -> Any:
    """Citeste fisier JSON."""
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def write_json(path: Path, obj: Any) -> None:
    """Scrie fisier JSON cu indentare."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    print(f"  [OK] {path.relative_to(PROJECT_ROOT)}")


def slugify(s: str) -> str:
    """Converteste string in slug (pentru foldere/fisiere)."""
    s = s.strip().lower()
    # Inlocuieste diacritice comune
    replacements = {
        'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
        'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T'
    }
    for old, new in replacements.items():
        s = s.replace(old, new)
    s = re.sub(r"[^a-z0-9\- _]", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"-{2,}", "-", s)
    return s.strip("-")


def extract_keywords(domain: str, contents: List[str], max_terms: int = 10) -> List[str]:
    """Extrage cuvinte cheie din domeniu si continuturi."""
    text = " ".join([domain] + contents)
    # Inlocuieste diacritice
    replacements = {'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't'}
    for old, new in replacements.items():
        text = text.replace(old, new).replace(old.upper(), new.upper())

    tokens = re.split(r"[\s,;:()/.]+", text)
    clean = []
    for t in tokens:
        t = t.strip().lower()
        if not t or len(t) < 3:
            continue
        if t in STOPWORDS_RO:
            continue
        clean.append(t)

    # Frecventa
    freq: Dict[str, int] = {}
    for t in clean:
        freq[t] = freq.get(t, 0) + 1
    ranked = sorted(freq.items(), key=lambda kv: (-kv[1], kv[0]))
    return [k for k, _ in ranked[:max_terms]]


def match_module_for_domain(domain_ro: str, module_domains: Dict[str, List[str]]) -> int:
    """Gaseste modulul potrivit pentru un domeniu oficial."""
    d = domain_ro.lower()
    best_module = 5  # Default: ultimul modul
    best_score = 0

    for m_str, needles in module_domains.items():
        score = 0
        for n in needles:
            n2 = n.lower()
            if n2 and n2 in d:
                score += 3  # Match direct
        # Weak match: tokeni comuni
        for n in needles:
            toks = [t for t in re.split(r"[\s\-]+", n.lower()) if t and len(t) > 2]
            score += sum(1 for t in toks if t in d)

        if score > best_score:
            best_score = score
            best_module = int(m_str)

    return best_module


def make_lesson_code(grade: str, module_index: int, lesson_num: int) -> str:
    """Genereaza codul lectiei: V-M1-L01."""
    return f"{grade}-M{module_index}-L{lesson_num:02d}"


def make_unit_code(grade: str, module_index: int, unit_num: int) -> str:
    """Genereaza codul unitatii: V-M1-U01."""
    return f"{grade}-M{module_index}-U{unit_num:02d}"


def build_lesson_skeleton(
    grade: str,
    module_index: int,
    lesson_code: str,
    title_ro: str,
    domain_ro: str,
    contents_ro: List[str],
    competencies: List[Dict[str, str]],
    question_templates: Dict[str, List[Dict]],
    items_per_level: Dict[str, int]
) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """Construieste scheletul lectiei si quiz-ului."""

    key_terms = extract_keywords(domain_ro, contents_ro, max_terms=10)

    # Why this matters
    purpose = (
        f"Ca sa poti lucra competent cu: {domain_ro}. "
        f"In viata reala, asta te ajuta sa rezolvi sarcini rapid si corect."
    )
    scenarios = [
        f"Trebuie sa aplici {key_terms[0] if key_terms else domain_ro} intr-un context real.",
        f"Primesti o cerinta cu {domain_ro} si trebuie sa o finalizezi in timp limitat."
    ]

    # I-can statements (3 niveluri)
    ican = {
        "minim": [
            f"Pot explica pe scurt ce inseamna {domain_ro}.",
            f"Pot executa o sarcina simpla legata de {domain_ro} urmand pasi clari."
        ],
        "standard": [
            f"Pot aplica conceptele-cheie din {domain_ro} intr-o sarcina completa.",
            "Pot verifica rezultatul folosind un checklist simplu."
        ],
        "performanta": [
            f"Pot integra {domain_ro} intr-un produs mai complex si pot justifica alegerile.",
            "Pot identifica si corecta erori tipice (debug/quality check)."
        ]
    }

    misconceptions = [
        {
            "misconception": f"Confuzie frecventa in domeniul {domain_ro} (ex: termeni asemanatori).",
            "fix_strategy": "Exemplu comparativ + checklist de verificare + demonstratie pe caz concret."
        }
    ]

    # Worked example
    worked_examples = [
        {
            "example_title": f"Exemplu ghidat: aplicarea {domain_ro}",
            "steps": [
                "Identifica cerinta si datele de intrare.",
                "Aplica regula/procedura relevanta.",
                "Verifica rezultatul cu un criteriu simplu."
            ],
            "teacher_thinks_aloud": [
                "Spun cu voce tare ce verific la fiecare pas.",
                "Daca apare o eroare, revin la pasul anterior si izolez cauza."
            ]
        }
    ]

    guided_practice = [
        {
            "task": f"Reproduce exemplul ghidat pentru {domain_ro} pe date similare.",
            "scaffold": [
                "Urmeaza pasii 1-3 din exemplu.",
                "Foloseste checklist-ul de verificare."
            ],
            "success_criteria": [
                "Pasii sunt in ordine corecta",
                "Rezultatul este verificat",
                "Lucrarea este salvata/organizata conform cerintei"
            ]
        }
    ]

    independent_practice = {
        "minim": [
            {"task": f"Sarcina simpla: executa o operatie de baza in {domain_ro}.", "expected_output": "Rezultat corect, verificat minimal."}
        ],
        "standard": [
            {"task": f"Sarcina completa: finalizeaza o cerinta standard in {domain_ro}.", "expected_output": "Produs complet + verificare."}
        ],
        "performanta": [
            {"task": f"Extension: integreaza {domain_ro} intr-un mini-proiect cu 2 cerinte suplimentare.", "expected_output": "Produs extins + justificare scurta."}
        ]
    }

    exit_ticket = {
        "minim": [f"Ce este {domain_ro}? (1 propozitie)"],
        "standard": [f"Numeste 2 concepte-cheie din {domain_ro} si cand le folosesti."],
        "performanta": [f"Da un exemplu de 'greseala tipica' in {domain_ro} si cum o previi."]
    }

    # Quiz generation
    def instantiate_templates(level: str) -> List[Dict[str, str]]:
        templates = question_templates.get(level, [])
        wanted = items_per_level.get(level, 4)
        out = []
        for i in range(wanted):
            t = templates[i % len(templates)] if templates else {"type": "short", "prompt_template": "Intrebare {TERM}"}
            prompt = t.get("prompt_template", t.get("prompt", ""))
            # Substitutii simple
            term = key_terms[i % len(key_terms)] if key_terms else domain_ro
            prompt = prompt.replace("{TERM}", term)
            prompt = prompt.replace("{CONCEPT}", domain_ro)
            prompt = prompt.replace("{TASK}", f"o sarcina in {domain_ro}")
            prompt = prompt.replace("{A}", key_terms[0] if len(key_terms) > 0 else "A")
            prompt = prompt.replace("{B}", key_terms[1] if len(key_terms) > 1 else "B")
            prompt = prompt.replace("{RULE}", f"regula de baza din {domain_ro}")
            prompt = prompt.replace("{SCENARIO}", scenarios[0] if scenarios else "un scenariu dat")
            prompt = prompt.replace("{BROKEN_STEPS}", "PASI_GRESITI_AICI")
            prompt = prompt.replace("{BASE_TASK}", f"o sarcina standard in {domain_ro}")
            prompt = prompt.replace("{ACTION}", f"faci o actiune gresita in {domain_ro}")

            out.append({
                "type": t.get("type", "short"),
                "prompt": prompt,
                "answer_key": t.get("answer_key", "MODEL_ANSWER_REQUIRED")
            })
        return out

    quiz = {
        "schema_version": "1.0.0",
        "lesson_code": lesson_code,
        "grade": grade,
        "module_index": module_index,
        "items_minim": instantiate_templates("minim"),
        "items_standard": instantiate_templates("standard"),
        "items_performanta": instantiate_templates("performanta")
    }

    lesson = {
        "meta": {
            "grade": grade,
            "module_index": module_index,
            "lesson_code": lesson_code,
            "title_ro": title_ro,
            "duration_minutes": 50,
            "prerequisites": [],
            "tools": [],
            "safety_and_ethics": []
        },
        "why_this_matters": {
            "purpose_ro": purpose,
            "real_life_scenarios": scenarios
        },
        "competency_contract": {
            "official_specific_competencies": competencies if competencies else [{"id": "TBD", "text_ro": "De mapat la competentele specifice oficiale."}],
            "i_can_statements": ican
        },
        "knowledge_progression": {
            "from_general_to_specific": [
                {"level": "general", "concepts": [f"Ce este {domain_ro} si la ce foloseste"]},
                {"level": "intermediate", "concepts": [f"Reguli/pasi de baza in {domain_ro}", "Criterii de verificare"]},
                {"level": "specific", "concepts": key_terms[:5] if key_terms else [domain_ro]}
            ],
            "common_misconceptions": misconceptions
        },
        "instructional_flow": {
            "hook_3min": f"Intrebare: cand ai folosi {domain_ro} in viata reala?",
            "micro_lecture_8_10min": {
                "key_terms": key_terms[:8] if key_terms else [domain_ro, "concept1", "concept2"],
                "explain_like_im_12": f"{domain_ro} inseamna sa urmezi pasi clari ca sa obtii un rezultat predictibil.",
                "rules_and_checks": [
                    "Incepe cu cerinta.",
                    "Aplica regula/pasii corecti.",
                    "Verifica rezultatul."
                ]
            },
            "worked_examples_10min": worked_examples,
            "guided_practice_12min": guided_practice,
            "independent_practice_12min": independent_practice,
            "exit_ticket_3min": exit_ticket
        },
        "assessment": {
            "quick_quiz": {
                "items_minim": quiz["items_minim"],
                "items_standard": quiz["items_standard"],
                "items_performanta": quiz["items_performanta"]
            },
            "homework_optional": {
                "minim": [f"Repeta o sarcina simpla din lectia de {domain_ro}."],
                "standard": [f"Finalizeaza o sarcina standard si verifica rezultatul (checklist)."],
                "performanta": [f"Extinde sarcina intr-un mini-proiect si documenteaza pasii (5 randuri)."]
            }
        },
        "spaced_retrieval_plan": {
            "R0_end_of_lesson": ["1 intrebare definitorie + 1 pas din procedura"],
            "R1_next_week": ["Task rapid: repeta procedura pe un set nou de date"],
            "R2_after_3_weeks": ["Debug/checklist: identifica si corecteaza 1 eroare tipica"]
        },
        "teacher_notes": {
            "differentiation": {
                "support": ["Lucru in perechi: driver/navigator", "Sablon de pasi tipariti sau pe ecran"],
                "stretch": ["Introduce o cerinta in plus: optimizare / justificare / calitate"]
            },
            "timeboxing": [
                {"segment": "Hook", "minutes": 3},
                {"segment": "Micro-lecture", "minutes": 9},
                {"segment": "Worked examples", "minutes": 10},
                {"segment": "Guided practice", "minutes": 12},
                {"segment": "Independent practice", "minutes": 12},
                {"segment": "Exit ticket", "minutes": 4}
            ]
        }
    }

    return lesson, quiz


def generate_for_grade(
    grade: str,
    curriculum: Dict,
    module_map: Dict,
    templates: Dict,
    target_module: Optional[int] = None
) -> None:
    """Genereaza continut pentru o clasa."""

    print(f"\n=== Clasa {grade} ===")

    grades_obj = curriculum.get("grades", {})
    g = grades_obj.get(grade)
    if not g:
        print(f"  [WARN] Clasa {grade} nu exista in curriculum. Skip.")
        return

    domains = g.get("official_content_domains_and_contents", [])
    if not domains:
        print(f"  [WARN] Clasa {grade} nu are domenii de continut. Skip.")
        return

    competencies = g.get("official_specific_competencies", [])
    grade_module_domains = module_map["grades"][grade]["module_domains"]
    module_themes = module_map["grades"][grade].get("module_themes", {})

    question_templates = templates.get("templates", {})
    items_per_level = templates.get("defaults", {}).get("items_per_lesson", {"minim": 4, "standard": 4, "performanta": 4})

    # Asigneaza fiecare domeniu oficial la un modul
    assignments: Dict[int, List[Dict]] = {i: [] for i in range(1, 6)}
    for d in domains:
        domain_ro = d.get("domain_ro", "").strip()
        contents_ro = d.get("contents_ro", []) or []
        m = match_module_for_domain(domain_ro, grade_module_domains)
        assignments[m].append({"domain_ro": domain_ro, "contents_ro": contents_ro})

    # Construieste 5 module
    modules = []

    for m in range(1, 6):
        # Skip daca nu e modulul tinta
        if target_module is not None and m != target_module:
            continue

        print(f"\n  Modul {m}: {module_themes.get(str(m), 'TBD')}")

        unit_list = []
        lesson_counter = 0
        unit_counter = 0

        for d in assignments[m]:
            unit_counter += 1
            unit_code = make_unit_code(grade, m, unit_counter)
            unit_title = d["domain_ro"]

            # O lectie per domeniu (schelet)
            lesson_counter += 1
            lesson_code = make_lesson_code(grade, m, lesson_counter)
            lesson_title = unit_title

            # Mapeaza competentele (simplificat: toate pentru acest domeniu)
            mapped_competencies = competencies[:2] if competencies else []

            lesson_obj, quiz_obj = build_lesson_skeleton(
                grade=grade,
                module_index=m,
                lesson_code=lesson_code,
                title_ro=lesson_title,
                domain_ro=d["domain_ro"],
                contents_ro=d["contents_ro"],
                competencies=mapped_competencies,
                question_templates=question_templates,
                items_per_level=items_per_level
            )

            # Cai relative
            lesson_rel = f"content/gimnaziu/{grade}/m{m}/{lesson_code}.json"
            quiz_rel = f"content/gimnaziu/{grade}/m{m}/{lesson_code}.quiz.json"

            # Scrie fisierele
            write_json(OUTPUT_ROOT / lesson_rel, lesson_obj)
            write_json(OUTPUT_ROOT / quiz_rel, quiz_obj)

            unit_list.append({
                "unit_code": unit_code,
                "title_ro": unit_title,
                "hours_estimate": 1,
                "mapped_domains": [d["domain_ro"]],
                "official_competency_targets": [],
                "lessons": [
                    {
                        "lesson_code": lesson_code,
                        "title_ro": lesson_title,
                        "path_lesson_json": lesson_rel,
                        "path_quiz_json": quiz_rel,
                        "estimated_minutes": 50
                    }
                ],
                "assessments": {
                    "diagnostic": [],
                    "formative": ["Exit ticket", "Mini-quiz (R0)"],
                    "summative": []
                }
            })

        # Daca modulul e gol, adauga placeholder
        if not unit_list:
            unit_counter += 1
            unit_code = make_unit_code(grade, m, unit_counter)
            unit_list.append({
                "unit_code": unit_code,
                "title_ro": "Placeholder (de completat)",
                "hours_estimate": 1,
                "mapped_domains": ["TBD"],
                "official_competency_targets": [],
                "lessons": [
                    {
                        "lesson_code": make_lesson_code(grade, m, 1),
                        "title_ro": "Placeholder lesson",
                        "path_lesson_json": "TBD",
                        "path_quiz_json": "TBD",
                        "estimated_minutes": 50
                    }
                ],
                "assessments": {"diagnostic": [], "formative": [], "summative": []}
            })

        modules.append({
            "module_index": m,
            "module_theme_ro": module_themes.get(str(m), f"Modul {m}"),
            "units": unit_list,
            "spaced_retrieval_plan": {
                "R0": ["Exit ticket la fiecare lectie"],
                "R1": ["Recapitulare scurta saptamana urmatoare"],
                "R2": ["Mini-debug/mini-task dupa 3 saptamani"]
            },
            "teacher_notes": {
                "integration_notes": [],
                "differentiation": {
                    "support": ["Lucru ghidat + sabloane"],
                    "stretch": ["Extension tasks / mini-proiecte"]
                }
            }
        })

    # Scrie modules.json doar daca generam tot
    if target_module is None:
        module_framework = {
            "schema_version": "1.0.0",
            "grade": grade,
            "hours_per_week": module_map.get("hours_per_week", 1),
            "year": module_map.get("year", "2025-2026"),
            "modules": modules,
            "x_metadata": {
                "generated_at": datetime.now().isoformat(timespec="seconds"),
                "generator": "tools/generate_content.py"
            }
        }
        write_json(OUTPUT_ROOT / "planning" / grade / "modules.json", module_framework)


def main():
    parser = argparse.ArgumentParser(description="Genereaza continut LearningHub din curriculum")
    parser.add_argument("--all", action="store_true", help="Genereaza pentru toate clasele")
    parser.add_argument("--grade", type=str, choices=["V", "VI", "VII", "VIII"], help="Clasa specifica")
    parser.add_argument("--module", type=int, choices=[1, 2, 3, 4, 5], help="Modul specific")
    args = parser.parse_args()

    print("=" * 60)
    print("  LearningHub Content Generator")
    print("=" * 60)

    # Incarca date
    print("\nIncarc fisierele sursa...")
    curriculum = read_json(CURRICULUM_PATH)
    module_map = read_json(MODULE_MAP_PATH)
    templates = read_json(TEMPLATES_PATH)
    print("  [OK] Curriculum, module map, templates incarcate.")

    # Determina ce generam
    grades_to_process = []
    if args.all:
        grades_to_process = ["V", "VI", "VII", "VIII"]
    elif args.grade:
        grades_to_process = [args.grade]
    else:
        print("\n[INFO] Foloseste --all sau --grade V/VI/VII/VIII")
        print("       Exemplu: python generate_content.py --grade V --module 3")
        return

    # Genereaza
    for grade in grades_to_process:
        generate_for_grade(
            grade=grade,
            curriculum=curriculum,
            module_map=module_map,
            templates=templates,
            target_module=args.module
        )

    print("\n" + "=" * 60)
    print("  Generare completa!")
    print("=" * 60)


if __name__ == "__main__":
    main()
