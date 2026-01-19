/**
 * LearningHub PoW Migration Script
 * =================================
 * Mass-updates lesson and module HTML files to integrate PoW system.
 *
 * Usage:
 *   node tools/pow-migration.js --dry-run        # Preview changes
 *   node tools/pow-migration.js --apply          # Apply changes
 *   node tools/pow-migration.js --rollback       # Undo changes (restores backups)
 *   node tools/pow-migration.js --status         # Check migration status
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    contentRoot: path.join(__dirname, '..', 'content', 'tic'),
    backupDir: path.join(__dirname, '..', '.pow-migration-backup'),
    lessonPattern: /lectia\d+.*\.html$/,
    moduleIndexPattern: /index\.html$/,
    powScriptsLesson: `
    <!-- User System -->
    <script src="../../../../assets/js/user-system.js"></script>

    <!-- PoW System -->
    <script src="../../../../assets/js/pow/storage.js"></script>
    <script src="../../../../assets/js/pow/validator.js"></script>
    <script src="../../../../assets/js/pow/checkpoint.js"></script>
    <script src="../../../../assets/js/pow/gating.js"></script>
    <script src="../../../../assets/js/pow/quiz-limiter.js"></script>

    <!-- Progress Tracking -->
    <script src="../../../../assets/js/progress.js"></script>`,
    powScriptsModule: `
    <!-- User System -->
    <script src="../../../../assets/js/user-system.js"></script>

    <!-- PoW System for Sequential Locking -->
    <script src="../../../../assets/js/pow/storage.js"></script>
    <script src="../../../../assets/js/pow/sequential.js"></script>

    <!-- Progress Tracking -->
    <script src="../../../../assets/js/progress.js"></script>`,
    powCssLink: `    <!-- PoW System Styles -->
    <link rel="stylesheet" href="../../../../assets/css/pow.css">`
};

// State
const stats = {
    lessonsUpdated: 0,
    modulesUpdated: 0,
    skipped: 0,
    errors: []
};

/**
 * Find all HTML files recursively
 */
function findHtmlFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Skip quizuri directories (they have different structure)
            if (entry.name !== 'quizuri') {
                findHtmlFiles(fullPath, files);
            }
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Detect file type (lesson, module index, or other)
 */
function detectFileType(filePath) {
    const filename = path.basename(filePath);

    if (CONFIG.lessonPattern.test(filename)) {
        return 'lesson';
    }
    if (CONFIG.moduleIndexPattern.test(filename) && filePath.includes('/m')) {
        return 'module';
    }
    return 'other';
}

/**
 * Extract lesson ID from file path
 */
function extractLessonId(filePath) {
    // Path like: content/tic/cls6/m3-scratch-control/lectia1-daca-atunci.html
    const match = filePath.match(/content[\\/]tic[\\/](cls\d+)[\\/]([^\\\/]+)[\\/](lectia\d+)/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return null;
}

/**
 * Extract module info from file path
 */
function extractModuleInfo(filePath) {
    const match = filePath.match(/content[\\/]tic[\\/](cls\d+)[\\/]([^\\\/]+)[\\/]index\.html/);
    if (match) {
        return { grade: match[1], module: match[2] };
    }
    return null;
}

/**
 * Generate checkpoint JSON for a lesson
 */
function generateCheckpointJson(lessonId) {
    return JSON.stringify({
        lessonId: lessonId,
        fields: [
            { name: "whatLearned", type: "textarea", minChars: 30, required: true, label: "Ce ai invatat in aceasta lectie?", placeholder: "Descrie conceptele principale..." },
            { name: "whatCreated", type: "textarea", minChars: 20, required: true, label: "Ce ai creat sau modificat?", placeholder: "Descrie ce ai facut practic..." }
        ]
    }, null, 0);
}

/**
 * Check if file already has PoW integration
 */
function hasPowIntegration(content) {
    return content.includes('pow/storage.js') ||
           content.includes('pow-checkpoint') ||
           content.includes('data-lesson-id=');
}

/**
 * Migrate a lesson file
 */
function migrateLesson(filePath, dryRun = true) {
    const content = fs.readFileSync(filePath, 'utf8');

    if (hasPowIntegration(content)) {
        console.log(`  SKIP (already migrated): ${path.relative(CONFIG.contentRoot, filePath)}`);
        stats.skipped++;
        return null;
    }

    const lessonId = extractLessonId(filePath);
    if (!lessonId) {
        console.log(`  SKIP (couldn't extract ID): ${path.relative(CONFIG.contentRoot, filePath)}`);
        stats.skipped++;
        return null;
    }

    let newContent = content;

    // 1. Add PoW CSS link before </head>
    if (!content.includes('pow.css')) {
        newContent = newContent.replace(
            /(<link[^>]*mobile\.css[^>]*>)\s*\n\s*<\/head>/i,
            `$1\n${CONFIG.powCssLink}\n</head>`
        );
    }

    // 2. Add checkpoint div before nav-buttons
    const checkpointHtml = `
        <!-- PoW Checkpoint -->
        <div class="pow-checkpoint" data-pow='${generateCheckpointJson(lessonId)}'></div>

        <!-- Navigation -->`;

    newContent = newContent.replace(
        /(\s*)<!-- Navigation -->/,
        checkpointHtml
    );

    // 3. Replace old script includes with PoW scripts
    // Remove evidence-system.js reference
    newContent = newContent.replace(
        /<script[^>]*evidence-system\.js[^>]*><\/script>\s*/g,
        ''
    );

    // Replace user-system + progress script block
    const scriptPattern = /<!-- Progress Tracking -->\s*<script[^>]*user-system\.js[^>]*><\/script>\s*(<script[^>]*evidence-system\.js[^>]*><\/script>\s*)?<script[^>]*progress\.js[^>]*><\/script>/;

    if (scriptPattern.test(newContent)) {
        newContent = newContent.replace(scriptPattern, CONFIG.powScriptsLesson);
    }

    // 4. Remove old LearningProgress init hooks (simplified)
    newContent = newContent.replace(
        /\s*<script>\s*LearningProgress\.init\([^)]+\);[\s\S]*?originalGoToStep[\s\S]*?<\/script>/g,
        `
    <script>
        LearningProgress.init('${lessonId.split('-')[0]}', '${lessonId.split('-').slice(1, -1).join('-')}', '${lessonId.split('-').pop()}');
    </script>`
    );

    if (dryRun) {
        console.log(`  WOULD UPDATE: ${path.relative(CONFIG.contentRoot, filePath)}`);
        return { path: filePath, original: content, updated: newContent };
    }

    // Backup and write
    backupFile(filePath, content);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`  UPDATED: ${path.relative(CONFIG.contentRoot, filePath)}`);
    stats.lessonsUpdated++;

    return { path: filePath, original: content, updated: newContent };
}

/**
 * Migrate a module index file
 */
function migrateModule(filePath, dryRun = true) {
    const content = fs.readFileSync(filePath, 'utf8');

    if (hasPowIntegration(content)) {
        console.log(`  SKIP (already migrated): ${path.relative(CONFIG.contentRoot, filePath)}`);
        stats.skipped++;
        return null;
    }

    const moduleInfo = extractModuleInfo(filePath);
    if (!moduleInfo) {
        console.log(`  SKIP (couldn't extract module info): ${path.relative(CONFIG.contentRoot, filePath)}`);
        stats.skipped++;
        return null;
    }

    let newContent = content;

    // 1. Add PoW CSS link
    if (!content.includes('pow.css')) {
        newContent = newContent.replace(
            /(<link[^>]*mobile\.css[^>]*>)\s*\n\s*<\/head>/i,
            `$1\n${CONFIG.powCssLink}\n</head>`
        );
    }

    // 2. Add data attributes to container
    newContent = newContent.replace(
        /<div class="container">/,
        `<div class="container" data-module-id="${moduleInfo.module}" data-grade-id="${moduleInfo.grade}" data-sequential="true">`
    );

    // 3. Add data-lesson-id to lesson cards
    let lessonNum = 1;
    newContent = newContent.replace(
        /<a href="(lectia\d+[^"]*\.html)" class="lesson-card"/g,
        (match, href) => {
            const id = `${moduleInfo.grade}-${moduleInfo.module}-lectia${lessonNum++}`;
            return `<a href="${href}" class="lesson-card" data-lesson-id="${id}"`;
        }
    );

    // 4. Update script includes
    newContent = newContent.replace(
        /<!-- Progress Tracking -->\s*<script[^>]*user-system\.js[^>]*><\/script>\s*<script[^>]*progress\.js[^>]*><\/script>\s*<script>[\s\S]*?LearningProgress\.updateModuleProgress[\s\S]*?<\/script>/,
        CONFIG.powScriptsModule
    );

    if (dryRun) {
        console.log(`  WOULD UPDATE: ${path.relative(CONFIG.contentRoot, filePath)}`);
        return { path: filePath, original: content, updated: newContent };
    }

    // Backup and write
    backupFile(filePath, content);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`  UPDATED: ${path.relative(CONFIG.contentRoot, filePath)}`);
    stats.modulesUpdated++;

    return { path: filePath, original: content, updated: newContent };
}

/**
 * Backup a file before modification
 */
function backupFile(filePath, content) {
    if (!fs.existsSync(CONFIG.backupDir)) {
        fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    }

    const relativePath = path.relative(CONFIG.contentRoot, filePath);
    const backupPath = path.join(CONFIG.backupDir, relativePath);
    const backupDir = path.dirname(backupPath);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    fs.writeFileSync(backupPath, content, 'utf8');
}

/**
 * Rollback all changes
 */
function rollback() {
    if (!fs.existsSync(CONFIG.backupDir)) {
        console.log('No backup found. Nothing to rollback.');
        return;
    }

    function restoreDir(backupDir, targetDir) {
        const entries = fs.readdirSync(backupDir, { withFileTypes: true });

        for (const entry of entries) {
            const backupPath = path.join(backupDir, entry.name);
            const targetPath = path.join(targetDir, entry.name);

            if (entry.isDirectory()) {
                restoreDir(backupPath, targetPath);
            } else {
                const content = fs.readFileSync(backupPath, 'utf8');
                fs.writeFileSync(targetPath, content, 'utf8');
                console.log(`  RESTORED: ${entry.name}`);
            }
        }
    }

    restoreDir(CONFIG.backupDir, CONFIG.contentRoot);
    console.log('\nRollback complete!');
}

/**
 * Show migration status
 */
function showStatus() {
    const files = findHtmlFiles(CONFIG.contentRoot);

    let migrated = 0;
    let pending = 0;

    for (const file of files) {
        const type = detectFileType(file);
        if (type === 'other') continue;

        const content = fs.readFileSync(file, 'utf8');
        if (hasPowIntegration(content)) {
            migrated++;
        } else {
            pending++;
            console.log(`  PENDING: ${path.relative(CONFIG.contentRoot, file)}`);
        }
    }

    console.log(`\nStatus: ${migrated} migrated, ${pending} pending`);
}

/**
 * Main execution
 */
function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const apply = args.includes('--apply');
    const rollbackMode = args.includes('--rollback');
    const statusMode = args.includes('--status');

    console.log('LearningHub PoW Migration Script');
    console.log('================================\n');

    if (rollbackMode) {
        console.log('Rolling back changes...\n');
        rollback();
        return;
    }

    if (statusMode) {
        console.log('Checking migration status...\n');
        showStatus();
        return;
    }

    if (!dryRun && !apply) {
        console.log('Usage:');
        console.log('  node pow-migration.js --dry-run   Preview changes');
        console.log('  node pow-migration.js --apply     Apply changes');
        console.log('  node pow-migration.js --rollback  Undo changes');
        console.log('  node pow-migration.js --status    Check status');
        return;
    }

    console.log(`Mode: ${dryRun ? 'DRY RUN (preview only)' : 'APPLY (making changes)'}\n`);

    // Find all HTML files
    const files = findHtmlFiles(CONFIG.contentRoot);
    console.log(`Found ${files.length} HTML files\n`);

    // Process each file
    for (const file of files) {
        const type = detectFileType(file);

        if (type === 'lesson') {
            migrateLesson(file, dryRun);
        } else if (type === 'module') {
            migrateModule(file, dryRun);
        }
    }

    // Summary
    console.log('\n--- Summary ---');
    if (dryRun) {
        console.log('This was a dry run. No files were modified.');
        console.log(`Would update: ${stats.lessonsUpdated + stats.modulesUpdated} files`);
    } else {
        console.log(`Lessons updated: ${stats.lessonsUpdated}`);
        console.log(`Modules updated: ${stats.modulesUpdated}`);
    }
    console.log(`Skipped: ${stats.skipped}`);

    if (stats.errors.length > 0) {
        console.log(`\nErrors:`);
        stats.errors.forEach(e => console.log(`  - ${e}`));
    }
}

main();
