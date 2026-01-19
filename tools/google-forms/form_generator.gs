/**
 * LearningHub - Generator Google Forms din fișe de lucru
 *
 * INSTRUCȚIUNI:
 * 1. Deschide Google Drive → New → Google Apps Script
 * 2. Copiază acest cod
 * 3. Rulează funcția createFormForLesson()
 * 4. Modifică parametrii pentru lecția dorită
 */

// ============================================
// CONFIGURARE - MODIFICĂ AICI
// ============================================

const CONFIG = {
  // Titlul formularului
  formTitle: "Fișă de lucru - Word: Primii pași",

  // Descrierea formularului
  formDescription: "Completează această fișă după ce ai parcurs lecția. Ai 3 niveluri de dificultate.",

  // Clasa și lecția
  grade: "cls5",
  module: "m3-word",
  lesson: "lectia1"
};

// ============================================
// ÎNTREBĂRILE - EXEMPLU PENTRU CLS5/M3-WORD/LECTIA1
// ============================================

const LESSON_DATA = {
  minim: {
    title: "📗 NIVEL MINIM (Nota 5-6)",
    description: "Întrebări de bază - verifică dacă ai înțeles lecția",
    items: [
      {
        id: "m1",
        type: "mcq",
        question: "Ce este Microsoft Word?",
        options: [
          "Un program pentru navigare pe internet",
          "Un program pentru editare de texte și documente",
          "Un program pentru calcule matematice",
          "Un program pentru editare foto"
        ],
        points: 5
      },
      {
        id: "m2",
        type: "mcq",
        question: "Care este extensia standard pentru documentele Word?",
        options: [
          ".txt",
          ".docx",
          ".pdf",
          ".xlsx"
        ],
        points: 5
      },
      {
        id: "m3",
        type: "short",
        question: "Scrie 2 motive pentru care folosim Word în loc de caiet.",
        points: 10
      },
      {
        id: "m4",
        type: "task",
        question: "Deschide Word și scrie numele tău complet. Descrie ce ai făcut sau atașează screenshot.",
        points: 10
      }
    ]
  },

  standard: {
    title: "📘 NIVEL STANDARD (Nota 7-8)",
    description: "Întrebări de înțelegere și aplicare",
    items: [
      {
        id: "s1",
        type: "compare",
        question: "Compară Word cu Notepad. Scrie 3 diferențe și spune când folosești fiecare.",
        points: 15
      },
      {
        id: "s2",
        type: "task",
        question: "Creează un document despre familia ta sau hobby-ul tău (minim 5 rânduri). Cum l-ai numit? Ce ai scris?",
        points: 20
      }
    ]
  },

  performanta: {
    title: "📕 NIVEL PERFORMANȚĂ (Nota 9-10)",
    description: "Întrebări avansate - analiză și creație",
    items: [
      {
        id: "p1",
        type: "create",
        question: "Scrie o scrisoare către tine din viitor (peste 5 ani). Minim 100 de cuvinte, cu introducere și încheiere.",
        points: 20
      },
      {
        id: "p2",
        type: "scenario",
        question: "Un coleg a pierdut tot documentul pentru că nu a salvat. Ce sfaturi îi dai? Cum poate preveni asta pe viitor?",
        points: 15
      }
    ]
  }
};

// ============================================
// FUNCȚII - NU MODIFICA
// ============================================

function createFormForLesson() {
  // Creează formularul
  const form = FormApp.create(CONFIG.formTitle);
  form.setDescription(CONFIG.formDescription);
  form.setCollectEmail(true);

  // Adaugă secțiunea de identificare
  form.addTextItem()
    .setTitle("Nume și prenume")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Clasa")
    .setRequired(true);

  // Adaugă câmp ascuns pentru identificare lecție
  form.addTextItem()
    .setTitle("Cod lecție (nu modifica)")
    .setHelpText(`${CONFIG.grade}/${CONFIG.module}/${CONFIG.lesson}`)
    .setRequired(false);

  // Procesează fiecare nivel
  for (const level of ["minim", "standard", "performanta"]) {
    const levelData = LESSON_DATA[level];

    // Adaugă header pentru nivel
    form.addSectionHeaderItem()
      .setTitle(levelData.title)
      .setHelpText(levelData.description);

    // Adaugă întrebările
    for (const item of levelData.items) {
      addQuestion(form, item, level);
    }
  }

  // Adaugă secțiune pentru dovezi
  form.addSectionHeaderItem()
    .setTitle("📎 DOVEZI (opțional)")
    .setHelpText("Atașează screenshot-uri sau link-uri pentru sarcinile practice");

  form.addTextItem()
    .setTitle("Link Google Drive cu screenshot-uri (opțional)")
    .setHelpText("Încarcă imaginile în Drive și pune link-ul aici");

  form.addParagraphTextItem()
    .setTitle("Note sau comentarii (opțional)");

  // Log URL-ul formularului
  Logger.log("✅ Formular creat cu succes!");
  Logger.log("📝 URL editare: " + form.getEditUrl());
  Logger.log("🔗 URL completare: " + form.getPublishedUrl());

  return form;
}

function addQuestion(form, item, level) {
  const prefix = `[${item.id}] `;
  const suffix = ` (${item.points} pct)`;

  switch (item.type) {
    case "mcq":
      const mcq = form.addMultipleChoiceItem();
      mcq.setTitle(prefix + item.question + suffix);
      mcq.setChoices(item.options.map(opt => mcq.createChoice(opt)));
      mcq.setRequired(level === "minim"); // Doar minim e obligatoriu
      break;

    case "short":
      form.addTextItem()
        .setTitle(prefix + item.question + suffix)
        .setRequired(level === "minim");
      break;

    case "explain":
    case "compare":
    case "scenario":
    case "create":
      form.addParagraphTextItem()
        .setTitle(prefix + item.question + suffix)
        .setHelpText("Răspuns detaliat")
        .setRequired(false);
      break;

    case "task":
      form.addParagraphTextItem()
        .setTitle(prefix + item.question + suffix)
        .setHelpText("Descrie ce ai făcut sau menționează că ai atașat screenshot")
        .setRequired(level === "minim");
      break;

    case "debug":
      form.addParagraphTextItem()
        .setTitle(prefix + item.question + suffix)
        .setHelpText("Identifică greșeala și scrie varianta corectă")
        .setRequired(false);
      break;
  }
}

// ============================================
// EXPORT RĂSPUNSURI CA JSON
// ============================================

function exportResponsesToJSON() {
  // Găsește formularul activ sau specifică ID-ul
  const form = FormApp.getActiveForm();
  // SAU: const form = FormApp.openById("ID_FORMULAR_AICI");

  const responses = form.getResponses();
  const results = [];

  for (const response of responses) {
    const itemResponses = response.getItemResponses();
    const submission = {
      student: {
        name: "",
        class: ""
      },
      lesson: `${CONFIG.grade}/${CONFIG.module}/${CONFIG.lesson}`,
      timestamp: response.getTimestamp().toISOString(),
      answers: {
        minim: {},
        standard: {},
        performanta: {}
      }
    };

    for (const itemResponse of itemResponses) {
      const title = itemResponse.getItem().getTitle();
      const answer = itemResponse.getResponse();

      // Extrage ID-ul întrebării din titlu [m1], [s1], etc.
      const match = title.match(/\[([msp]\d+)\]/);
      if (match) {
        const id = match[1];
        const level = id.startsWith('m') ? 'minim' :
                      id.startsWith('s') ? 'standard' : 'performanta';
        submission.answers[level][id] = answer;
      } else if (title.includes("Nume")) {
        submission.student.name = answer;
      } else if (title.includes("Clasa")) {
        submission.student.class = answer;
      }
    }

    results.push(submission);
  }

  // Salvează în Drive
  const folder = DriveApp.getRootFolder();
  const fileName = `submissions_${CONFIG.lesson}_${new Date().toISOString().split('T')[0]}.json`;
  const file = folder.createFile(fileName, JSON.stringify(results, null, 2), MimeType.PLAIN_TEXT);

  Logger.log("✅ Export complet!");
  Logger.log("📁 Fișier: " + file.getUrl());

  return results;
}
