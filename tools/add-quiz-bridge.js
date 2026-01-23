/**
 * Add Quiz Bridge to Legacy Lessons
 * ==================================
 * This script adds quiz-bridge.js to lessons that use legacy quiz systems
 *
 * Run with: node tools/add-quiz-bridge.js
 */

const fs = require('fs');
const path = require('path');

const TIC_PATH = 'C:/AI/Projects/LearningHub/content/tic';

// Lessons that need quiz-bridge (don't have atomic-learning.js but have quizzes)
const lessonsToUpdate = [
    // cls7/m1-baze-date
    'cls7/m1-baze-date/lectia1-ce-sunt-bd.html',
    'cls7/m1-baze-date/lectia2-tabele.html',
    'cls7/m1-baze-date/lectia3-campuri.html',
    'cls7/m1-baze-date/lectia4-inregistrari.html',
    'cls7/m1-baze-date/lectia5-access-intro.html',
    // cls7/m2-multimedia
    'cls7/m2-multimedia/lectia1-video-intro.html',
    'cls7/m2-multimedia/lectia2-taiere-lipire.html',
    'cls7/m2-multimedia/lectia3-text-efecte.html',
    'cls7/m2-multimedia/lectia4-audio.html',
    // cls7/m3-cpp-algorithms
    'cls7/m3-cpp-algorithms/lectia1-codeblocks.html',
    'cls7/m3-cpp-algorithms/lectia2-elemente-baza.html',
    'cls7/m3-cpp-algorithms/lectia3-structura-liniara.html',
    'cls7/m3-cpp-algorithms/lectia4-structura-alternativa.html',
    'cls7/m3-cpp-algorithms/lectia5-while.html',
    'cls7/m3-cpp-algorithms/lectia6-do-while.html',
    'cls7/m3-cpp-algorithms/lectia7-for.html',
    // cls7/m4-web
    'cls7/m4-web/lectia1-html-intro.html',
    'cls7/m4-web/lectia2-text-headings.html',
    'cls7/m4-web/lectia3-liste-linkuri.html',
    'cls7/m4-web/lectia4-imagini.html',
    'cls7/m4-web/lectia5-css-intro.html',
];

function addQuizBridge(filePath) {
    const fullPath = path.join(TIC_PATH, filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`SKIP: ${filePath} (not found)`);
        return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if already has quiz-bridge
    if (content.includes('quiz-bridge.js')) {
        console.log(`SKIP: ${filePath} (already has quiz-bridge)`);
        return false;
    }

    // Check if has atomic-learning (doesn't need bridge)
    if (content.includes('atomic-learning.js')) {
        console.log(`SKIP: ${filePath} (uses atomic-learning)`);
        return false;
    }

    // Extract lesson ID from LessonSummary.init call
    const summaryMatch = content.match(/LessonSummary\.init\(['"]([^'"]+)['"]\)/);
    const lessonId = summaryMatch ? summaryMatch[1] : path.basename(filePath, '.html');

    // Detect number of questions
    const quizQuestionCount = (content.match(/quiz-question|data-correct|feedback\d+/g) || []).length;
    const totalQuestions = Math.min(Math.max(quizQuestionCount / 2, 3), 10); // Estimate, between 3-10

    // Create bridge initialization code
    const bridgeScript = `
    <!-- Quiz Bridge for Legacy Systems -->
    <script src="../../../../assets/js/quiz-bridge.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            QuizBridge.init('${lessonId}', { totalQuestions: ${Math.round(totalQuestions)} });
        });
    </script>`;

    // Find where to insert (before </body> or after lesson-summary.js)
    let insertPoint;

    // Try to insert after lesson-summary.js script
    const summaryScriptMatch = content.match(/<script src="[^"]*lesson-summary\.js"><\/script>/);
    if (summaryScriptMatch) {
        insertPoint = content.indexOf(summaryScriptMatch[0]) + summaryScriptMatch[0].length;
    } else {
        // Insert before </body>
        insertPoint = content.indexOf('</body>');
    }

    if (insertPoint === -1) {
        console.log(`ERROR: ${filePath} (no insertion point found)`);
        return false;
    }

    // Insert the bridge script
    const newContent = content.slice(0, insertPoint) + bridgeScript + content.slice(insertPoint);

    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log(`UPDATED: ${filePath}`);
    return true;
}

// Main
console.log('Adding Quiz Bridge to legacy lessons...\n');

let updated = 0;
let skipped = 0;

for (const lesson of lessonsToUpdate) {
    if (addQuizBridge(lesson)) {
        updated++;
    } else {
        skipped++;
    }
}

console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
