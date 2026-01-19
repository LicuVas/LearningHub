#!/usr/bin/env python3
"""
Generează codul Google Apps Script pentru o lecție specifică.

Folosire:
    python generate_form_script.py cls5 m3-word lectia1
    python generate_form_script.py cls6 m2-scratch lectia1 --output form_scratch.gs
"""

import json
import argparse
from pathlib import Path

WORKSHEETS_DIR = Path(__file__).parent.parent.parent / "data" / "worksheets"
TEMPLATE = '''/**
 * LearningHub - Fișă de lucru: {title}
 * Generat automat - {lesson_path}
 *
 * INSTRUCȚIUNI:
 * 1. Deschide script.google.com → New Project
 * 2. Lipește acest cod
 * 3. Rulează createFormForLesson()
 */

const CONFIG = {{
  formTitle: "Fișă de lucru - {title}",
  formDescription: "{description}",
  grade: "{grade}",
  module: "{module}",
  lesson: "{lesson}"
}};

const LESSON_DATA = {lesson_data};

// ============================================
// FUNCȚII - NU MODIFICA
// ============================================

function createFormForLesson() {{
  const form = FormApp.create(CONFIG.formTitle);
  form.setDescription(CONFIG.formDescription);
  form.setCollectEmail(true);

  form.addTextItem()
    .setTitle("Nume și prenume")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Clasa")
    .setRequired(true);

  for (const level of ["minim", "standard", "performanta"]) {{
    const levelData = LESSON_DATA[level];
    if (!levelData) continue;

    form.addSectionHeaderItem()
      .setTitle(levelData.title)
      .setHelpText(levelData.description);

    for (const item of levelData.items) {{
      addQuestion(form, item, level);
    }}
  }}

  form.addSectionHeaderItem()
    .setTitle("📎 DOVEZI (opțional)")
    .setHelpText("Atașează screenshot-uri sau link-uri");

  form.addTextItem()
    .setTitle("Link Google Drive cu screenshot-uri (opțional)");

  form.addParagraphTextItem()
    .setTitle("Note sau comentarii (opțional)");

  Logger.log("✅ Formular creat!");
  Logger.log("📝 URL editare: " + form.getEditUrl());
  Logger.log("🔗 URL completare: " + form.getPublishedUrl());

  return form;
}}

function addQuestion(form, item, level) {{
  const prefix = `[${{item.id}}] `;
  const suffix = ` (${{item.points}} pct)`;

  switch (item.type) {{
    case "mcq":
      const mcq = form.addMultipleChoiceItem();
      mcq.setTitle(prefix + item.question + suffix);
      mcq.setChoices(item.options.map(opt => mcq.createChoice(opt)));
      mcq.setRequired(level === "minim");
      break;

    case "short":
      form.addTextItem()
        .setTitle(prefix + item.question + suffix)
        .setRequired(level === "minim");
      break;

    default:
      form.addParagraphTextItem()
        .setTitle(prefix + item.question + suffix)
        .setRequired(false);
      break;
  }}
}}

function exportResponsesToJSON() {{
  const form = FormApp.getActiveForm();
  const responses = form.getResponses();
  const results = [];

  for (const response of responses) {{
    const itemResponses = response.getItemResponses();
    const submission = {{
      student: {{ name: "", class: "" }},
      lesson: `${{CONFIG.grade}}/${{CONFIG.module}}/${{CONFIG.lesson}}`,
      timestamp: response.getTimestamp().toISOString(),
      answers: {{ minim: {{}}, standard: {{}}, performanta: {{}} }}
    }};

    for (const itemResponse of itemResponses) {{
      const title = itemResponse.getItem().getTitle();
      const answer = itemResponse.getResponse();
      const match = title.match(/\\[([msp]\\d+)\\]/);

      if (match) {{
        const id = match[1];
        const level = id.startsWith('m') ? 'minim' :
                      id.startsWith('s') ? 'standard' : 'performanta';
        submission.answers[level][id] = answer;
      }} else if (title.includes("Nume")) {{
        submission.student.name = answer;
      }} else if (title.includes("Clasa")) {{
        submission.student.class = answer;
      }}
    }}

    results.push(submission);
  }}

  const fileName = `submissions_${{CONFIG.lesson}}_${{new Date().toISOString().split('T')[0]}}.json`;
  DriveApp.getRootFolder().createFile(fileName, JSON.stringify(results, null, 2), MimeType.PLAIN_TEXT);
  Logger.log("✅ Export: " + fileName);
}}
'''


def find_lesson(worksheet: dict, module_id: str, lesson_id: str) -> dict:
    """Găsește o lecție în worksheet."""
    for module in worksheet.get("modules", []):
        if module["module_id"] == module_id:
            for lesson in module.get("lessons", []):
                if lesson["lesson_id"] == lesson_id:
                    return lesson
    return None


def convert_level_to_js(level_data: dict, level_name: str) -> dict:
    """Convertește datele unui nivel în format JS."""
    titles = {
        "minim": "📗 NIVEL MINIM (Nota 5-6)",
        "standard": "📘 NIVEL STANDARD (Nota 7-8)",
        "performanta": "📕 NIVEL PERFORMANȚĂ (Nota 9-10)"
    }
    descriptions = {
        "minim": "Întrebări de bază - verifică dacă ai înțeles lecția",
        "standard": "Întrebări de înțelegere și aplicare",
        "performanta": "Întrebări avansate - analiză și creație"
    }

    return {
        "title": titles[level_name],
        "description": descriptions[level_name],
        "items": level_data.get("items", [])
    }


def generate_form_script(grade: str, module: str, lesson: str) -> str:
    """Generează scriptul Apps Script pentru o lecție."""
    # Încarcă worksheet
    worksheet_path = WORKSHEETS_DIR / f"{grade}.json"
    if not worksheet_path.exists():
        raise FileNotFoundError(f"Nu există worksheet pentru {grade}")

    with open(worksheet_path, 'r', encoding='utf-8') as f:
        worksheet = json.load(f)

    # Găsește lecția
    lesson_data = find_lesson(worksheet, module, lesson)
    if not lesson_data:
        raise ValueError(f"Nu am găsit lecția {module}/{lesson} în {grade}")

    # Construiește datele pentru JS
    js_data = {}
    for level in ["minim", "standard", "performanta"]:
        if level in lesson_data.get("levels", {}):
            js_data[level] = convert_level_to_js(lesson_data["levels"][level], level)

    # Generează script
    script = TEMPLATE.format(
        title=lesson_data.get("title", f"{module} - {lesson}"),
        description=f"Fișă de lucru pentru lecția {lesson_data.get('title', lesson)}",
        grade=grade,
        module=module,
        lesson=lesson,
        lesson_path=f"{grade}/{module}/{lesson}",
        lesson_data=json.dumps(js_data, indent=2, ensure_ascii=False)
    )

    return script


def main():
    parser = argparse.ArgumentParser(description="Generează Google Apps Script pentru fișe de lucru")
    parser.add_argument("grade", help="Clasa (cls5, cls6, cls7, cls8)")
    parser.add_argument("module", help="ID-ul modulului (ex: m3-word)")
    parser.add_argument("lesson", help="ID-ul lecției (ex: lectia1)")
    parser.add_argument("--output", "-o", help="Fișier output (default: form_{lesson}.gs)")

    args = parser.parse_args()

    try:
        script = generate_form_script(args.grade, args.module, args.lesson)

        output_file = args.output or f"form_{args.lesson}.gs"
        output_path = Path(__file__).parent / output_file

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(script)

        print(f"✅ Script generat: {output_path}")
        print(f"\nPași următori:")
        print(f"1. Deschide script.google.com")
        print(f"2. Creează proiect nou")
        print(f"3. Copiază conținutul din {output_file}")
        print(f"4. Rulează createFormForLesson()")

    except Exception as e:
        print(f"❌ Eroare: {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
