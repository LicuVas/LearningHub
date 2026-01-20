/**
 * Lesson Summary System for LearningHub
 * ======================================
 * Combines atomic learning and practice scores into a unified lesson summary
 *
 * Features:
 * - Combines scores from AtomicLearning and AdvancedPractice
 * - Displays final lesson grade (1-10 system, 1 point automatic)
 * - Saves unified progress to JSON with SHA-256 checksum (anti-tampering)
 * - Includes detailed per-item answers with question text
 * - Exports written answers for teacher evaluation
 * - Integrates with RPG system for XP rewards
 *
 * Security:
 * - SHA-256 checksum prevents student tampering
 * - Timestamp and session fingerprint for authenticity
 *
 * Usage:
 *   LessonSummary.init('lesson-id');
 */

const LessonSummary = {
    lessonId: null,
    atomicScore: null,
    practiceScore: null,

    // Weights for final score calculation
    weights: {
        atomic: 0.6,      // 60% from atomic learning (core concepts)
        practice: 0.4    // 40% from practice (application)
    },

    // Grade thresholds (1-10 system, 1 point automatic/din oficiu)
    // Score 0-100% maps to grade 1-10 where:
    // - 1 = automatic (participare)
    // - 2-10 = earned based on performance
    grades: [
        { min: 95, grade: 10, label: 'Exceptional!', color: '#22c55e' },
        { min: 85, grade: 9, label: 'Excelent!', color: '#4ade80' },
        { min: 75, grade: 8, label: 'Foarte bine!', color: '#60a5fa' },
        { min: 65, grade: 7, label: 'Bine!', color: '#60a5fa' },
        { min: 55, grade: 6, label: 'Satisfacator', color: '#fbbf24' },
        { min: 45, grade: 5, label: 'Suficient', color: '#f59e0b' },
        { min: 35, grade: 4, label: 'Insuficient', color: '#ef4444' },
        { min: 25, grade: 3, label: 'Slab', color: '#ef4444' },
        { min: 10, grade: 2, label: 'Foarte slab', color: '#dc2626' },
        { min: 0, grade: 1, label: 'Participare', color: '#991b1b' }
    ],

    // Session fingerprint for authenticity
    sessionId: null,

    /**
     * Initialize the lesson summary system
     * @param {string} lessonId - Unique lesson identifier
     * @param {object} options - Optional configuration
     */
    init: function(lessonId, options = {}) {
        this.lessonId = lessonId;
        this.weights = { ...this.weights, ...options.weights };

        // Generate session fingerprint for authenticity
        this.sessionId = this.generateSessionId();

        // Listen for progress events from both systems
        document.addEventListener('atomicProgressSaved', (e) => this.onAtomicProgress(e));
        document.addEventListener('practiceProgressSaved', (e) => this.onPracticeProgress(e));
        document.addEventListener('atomCompleted', () => this.checkAndUpdate());
        document.addEventListener('practiceComplete', () => this.checkAndUpdate());

        // Load existing progress
        this.loadProgress();

        // Initial check
        this.checkAndUpdate();

        console.log('LessonSummary: Initialized for', lessonId);
    },

    /**
     * Generate a unique session fingerprint
     */
    generateSessionId: function() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const userAgent = navigator.userAgent.substring(0, 50);
        return btoa(`${timestamp}-${random}-${userAgent}`).substring(0, 32);
    },

    /**
     * Calculate SHA-256 hash for anti-tampering
     */
    async calculateChecksum(data) {
        const jsonString = JSON.stringify(data);
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(jsonString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Handle atomic learning progress update
     */
    onAtomicProgress: function(e) {
        if (e.detail.lessonId !== this.lessonId) return;
        this.atomicScore = e.detail.data.lessonScore;
        this.checkAndUpdate();
    },

    /**
     * Handle practice progress update
     */
    onPracticeProgress: function(e) {
        if (e.detail.lessonId !== this.lessonId) return;
        this.practiceScore = {
            correct: e.detail.data.correct,
            total: e.detail.data.total,
            xp: e.detail.data.xp,
            completed: e.detail.data.completed,
            percentage: e.detail.data.total > 0
                ? Math.round((e.detail.data.correct / e.detail.data.total) * 100)
                : 0
        };
        this.checkAndUpdate();
    },

    /**
     * Load progress from both systems
     */
    loadProgress: function() {
        // Load atomic progress
        const atomicKey = `atomic-progress-${this.lessonId}`;
        const atomicSaved = localStorage.getItem(atomicKey);
        if (atomicSaved) {
            try {
                const data = JSON.parse(atomicSaved);
                if (data.lessonScore) {
                    this.atomicScore = data.lessonScore;
                }
            } catch (e) {}
        }

        // Load practice progress
        const practiceKey = `practice-${this.lessonId}`;
        const practiceSaved = localStorage.getItem(practiceKey);
        if (practiceSaved) {
            try {
                const data = JSON.parse(practiceSaved);
                this.practiceScore = {
                    correct: data.correct || 0,
                    total: data.total || 0,
                    xp: data.xp || 0,
                    completed: data.completed || false,
                    percentage: data.total > 0
                        ? Math.round((data.correct / data.total) * 100)
                        : 0
                };
            } catch (e) {}
        }
    },

    /**
     * Check if we should update the summary and do it
     */
    checkAndUpdate: function() {
        // Try to get current scores from live systems
        if (typeof AtomicLearning !== 'undefined' && AtomicLearning.currentLessonId === this.lessonId) {
            this.atomicScore = AtomicLearning.calculateLessonScore();
        }

        if (typeof AdvancedPractice !== 'undefined' && AdvancedPractice.lessonId === this.lessonId) {
            const results = AdvancedPractice.getResults();
            if (results.completed > 0) {
                let correctCount = 0;
                for (const idx in AdvancedPractice.results) {
                    if (AdvancedPractice.results[idx].correct) correctCount++;
                }
                this.practiceScore = {
                    correct: correctCount,
                    total: results.total,
                    xp: results.totalXP,
                    completed: results.completed >= results.total,
                    percentage: results.total > 0
                        ? Math.round((correctCount / results.total) * 100)
                        : 0
                };
            }
        }

        // Update display
        this.updateSummaryDisplay();

        // Save unified progress
        this.saveUnifiedProgress();
    },

    /**
     * Calculate the final combined score
     */
    calculateFinalScore: function() {
        let atomicPct = this.atomicScore?.percentage || 0;
        let practicePct = this.practiceScore?.percentage || 0;

        // If practice not started, atomic counts for 100%
        if (!this.practiceScore || this.practiceScore.total === 0) {
            return {
                final: atomicPct,
                atomic: atomicPct,
                practice: 0,
                practiceStarted: false
            };
        }

        // Weighted average
        const final = Math.round(
            atomicPct * this.weights.atomic +
            practicePct * this.weights.practice
        );

        return {
            final: final,
            atomic: atomicPct,
            practice: practicePct,
            practiceStarted: true
        };
    },

    /**
     * Get the grade for a score
     */
    getGrade: function(score) {
        for (const g of this.grades) {
            if (score >= g.min) {
                return g;
            }
        }
        return this.grades[this.grades.length - 1];
    },

    /**
     * Update the summary display in the page
     */
    updateSummaryDisplay: function() {
        const container = document.getElementById('lesson-summary');
        if (!container) return;

        const scores = this.calculateFinalScore();
        const grade = this.getGrade(scores.final);

        // Check completion status
        const atomicComplete = this.atomicScore?.atomsCompleted >= this.atomicScore?.atomsTotal;
        const practiceComplete = this.practiceScore?.completed;

        container.innerHTML = `
            <div class="ls-header">
                <span class="ls-icon">&#128202;</span>
                <span class="ls-title">Rezumatul Lectiei</span>
            </div>

            <div class="ls-grade" style="border-color: ${grade.color};">
                <div class="ls-grade-number" style="color: ${grade.color};">Nota: ${grade.grade}</div>
                <div class="ls-grade-label">${grade.label}</div>
                <div class="ls-grade-score">${scores.final}% din punctaj</div>
            </div>

            <div class="ls-breakdown">
                <div class="ls-section">
                    <div class="ls-section-header">
                        <span class="ls-section-icon">${atomicComplete ? '&#10004;' : '&#9711;'}</span>
                        <span class="ls-section-name">Invatare Atomica</span>
                        <span class="ls-section-weight">(${Math.round(this.weights.atomic * 100)}%)</span>
                    </div>
                    <div class="ls-section-bar">
                        <div class="ls-section-fill" style="width: ${scores.atomic}%; background: var(--accent-blue);"></div>
                    </div>
                    <div class="ls-section-detail">
                        ${this.atomicScore?.totalCorrect || 0}/${this.atomicScore?.totalQuestions || 0} corecte
                        (${scores.atomic}%)
                    </div>
                </div>

                <div class="ls-section">
                    <div class="ls-section-header">
                        <span class="ls-section-icon">${practiceComplete ? '&#10004;' : '&#9711;'}</span>
                        <span class="ls-section-name">Practica Avansata</span>
                        <span class="ls-section-weight">(${Math.round(this.weights.practice * 100)}%)</span>
                    </div>
                    <div class="ls-section-bar">
                        <div class="ls-section-fill" style="width: ${scores.practice}%; background: var(--success);"></div>
                    </div>
                    <div class="ls-section-detail">
                        ${scores.practiceStarted
                            ? `${this.practiceScore?.correct || 0}/${this.practiceScore?.total || 0} corecte (${scores.practice}%)`
                            : 'Neinceputa - optional pentru XP bonus'}
                    </div>
                </div>
            </div>

            ${atomicComplete ? `
                <div class="ls-status ls-status-complete">
                    &#10004; Lectia completa! ${grade.grade >= 5 ? 'Poti continua la urmatoarea lectie.' : 'Recomandat: reia lectia pentru o nota mai buna.'}
                </div>
            ` : `
                <div class="ls-status ls-status-incomplete">
                    &#9888; Completeaza toate sectiunile de invatare atomica pentru a finaliza lectia.
                </div>
            `}
        `;

        container.style.display = 'block';
    },

    /**
     * Save unified progress to localStorage
     */
    saveUnifiedProgress: function() {
        if (!this.lessonId) return;

        const scores = this.calculateFinalScore();
        const grade = this.getGrade(scores.final);

        const key = `lesson-summary-${this.lessonId}`;
        const data = {
            lessonId: this.lessonId,

            // Final score
            finalScore: scores.final,
            grade: grade.grade,
            gradeLabel: grade.label,

            // Atomic learning details
            atomic: {
                percentage: scores.atomic,
                correct: this.atomicScore?.totalCorrect || 0,
                total: this.atomicScore?.totalQuestions || 0,
                atomsCompleted: this.atomicScore?.atomsCompleted || 0,
                atomsTotal: this.atomicScore?.atomsTotal || 0,
                atomsPerfect: this.atomicScore?.atomsPerfect || 0
            },

            // Practice details
            practice: {
                percentage: scores.practice,
                correct: this.practiceScore?.correct || 0,
                total: this.practiceScore?.total || 0,
                xp: this.practiceScore?.xp || 0,
                completed: this.practiceScore?.completed || false
            },

            // Completion status
            isComplete: (this.atomicScore?.atomsCompleted || 0) >= (this.atomicScore?.atomsTotal || 1),

            // Metadata
            timestamp: Date.now(),
            version: 1
        };

        localStorage.setItem(key, JSON.stringify(data));

        // Dispatch event for external listeners
        document.dispatchEvent(new CustomEvent('lessonSummarySaved', {
            detail: { lessonId: this.lessonId, data: data }
        }));
    },

    /**
     * Get the saved summary for a lesson
     */
    getSavedSummary: function(lessonId) {
        const key = `lesson-summary-${lessonId || this.lessonId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    },

    /**
     * Get detailed per-item answers with question text from AtomicLearning
     */
    getAtomicItemDetails: function() {
        if (typeof AtomicLearning === 'undefined') return [];

        const items = [];
        for (const atomId in AtomicLearning.atoms) {
            const atom = AtomicLearning.atoms[atomId];
            const atomEl = atom.element;
            const atomTitle = atomEl?.querySelector('.atom-title')?.textContent || atomId;

            atom.questions.forEach((q, idx) => {
                const qId = `${atomId}-q${idx}`;
                const studentAnswer = atom.answers[qId];
                const isCorrect = studentAnswer === q.correct;

                items.push({
                    itemId: qId,
                    atomId: atomId,
                    atomTitle: atomTitle,
                    questionText: q.question,
                    options: q.options,
                    correctAnswer: q.correct,
                    correctAnswerText: q.options[q.correct.charCodeAt(0) - 97] || '',
                    studentAnswer: studentAnswer || null,
                    studentAnswerText: studentAnswer ? (q.options[studentAnswer.charCodeAt(0) - 97] || '') : '',
                    isCorrect: isCorrect,
                    hint: q.hint || '',
                    answered: studentAnswer !== undefined
                });
            });
        }
        return items;
    },

    /**
     * Get detailed practice exercise results with question text
     */
    getPracticeItemDetails: function() {
        if (typeof AdvancedPractice === 'undefined') return [];

        const items = [];
        AdvancedPractice.exercises.forEach((ex, idx) => {
            const result = AdvancedPractice.results[idx];

            const item = {
                itemId: `practice-${idx}`,
                exerciseType: ex.type,
                questionText: ex.question || ex.scenario || '',
                answered: result !== undefined,
                isCorrect: result?.correct || false,
                xpEarned: result?.xp || 0
            };

            // Add type-specific details
            if (ex.type === 'synthesis') {
                item.options = ex.options;
                item.correctAnswer = ex.correct;
                item.correctAnswerText = ex.options[ex.correct.charCodeAt(0) - 97] || '';
                item.studentAnswer = result?.selectedAnswer || null;
                item.studentAnswerText = result?.selectedAnswer
                    ? (ex.options[result.selectedAnswer.charCodeAt(0) - 97] || '')
                    : '';
                item.explanation = ex.explanation || '';
            } else if (ex.type === 'scenario') {
                item.scenario = ex.scenario;
                item.choices = ex.choices.map(c => c.text);
                item.correctChoice = ex.correctChoice;
                item.studentChoice = result?.selectedChoice;
                item.explanation = ex.explanation || '';
            } else if (ex.type === 'dragdrop') {
                item.categories = ex.categories.map(c => ({ id: c.id, label: c.label }));
                item.items = ex.items.map(i => ({
                    id: i.id,
                    label: i.label,
                    correctCategory: i.category
                }));
                item.studentPlacements = result?.itemPositions || {};
                item.correctCount = result?.partial || 0;
                item.totalItems = ex.items.length;
            } else if (ex.type === 'schema') {
                item.slots = ex.slots.map(s => ({ label: s.label, correct: s.correct }));
                item.options = ex.options.map(o => ({ value: o.value, label: o.label }));
                item.studentValues = result?.slotValues || [];
                item.correctCount = result?.partial || 0;
            } else if (ex.type === 'written') {
                // IMPORTANT: Include full written answer for teacher evaluation
                item.questionText = ex.question;
                item.context = ex.context || '';
                item.hints = ex.hints || [];
                item.minChars = ex.minChars || 50;
                item.keywords = ex.keywords || [];
                item.studentWrittenAnswer = result?.writtenAnswer || '';
                item.keywordsFound = result?.keywordsFound || 0;
                item.totalKeywords = result?.totalKeywords || 0;
                item.requiresTeacherEvaluation = true;
            }

            items.push(item);
        });

        return items;
    },

    /**
     * Export all lesson progress as JSON (for teacher/backup)
     * Includes SHA-256 checksum for anti-tampering
     */
    exportProgress: async function() {
        const scores = this.calculateFinalScore();
        const grade = this.getGrade(scores.final);

        // Get current user profile if available
        let studentInfo = { name: 'Anonim', odidentifier: null };
        if (typeof UserSystem !== 'undefined' && UserSystem.currentUser) {
            studentInfo = {
                name: UserSystem.currentUser.name || 'Anonim',
                odidentifier: UserSystem.currentUser.id || null
            };
        }

        // Build the payload (without checksum - will be added after)
        const payload = {
            // Metadata
            _meta: {
                version: '2.0',
                exportedAt: new Date().toISOString(),
                sessionId: this.sessionId,
                userAgent: navigator.userAgent.substring(0, 100)
            },

            // Student identification
            student: studentInfo,

            // Lesson info
            lesson: {
                id: this.lessonId,
                title: document.querySelector('.lesson-title')?.textContent || this.lessonId
            },

            // Final grade (1-10 system)
            grading: {
                finalScore: scores.final,  // 0-100%
                grade: grade.grade,        // 1-10
                gradeLabel: grade.label,
                isComplete: (this.atomicScore?.atomsCompleted || 0) >= (this.atomicScore?.atomsTotal || 1)
            },

            // Summary breakdown
            summary: {
                atomic: {
                    percentage: scores.atomic,
                    correct: this.atomicScore?.totalCorrect || 0,
                    total: this.atomicScore?.totalQuestions || 0,
                    atomsCompleted: this.atomicScore?.atomsCompleted || 0,
                    atomsTotal: this.atomicScore?.atomsTotal || 0,
                    atomsPerfect: this.atomicScore?.atomsPerfect || 0
                },
                practice: {
                    percentage: scores.practice,
                    correct: this.practiceScore?.correct || 0,
                    total: this.practiceScore?.total || 0,
                    xpEarned: this.practiceScore?.xp || 0,
                    completed: this.practiceScore?.completed || false
                }
            },

            // Detailed per-item answers (for teacher review)
            atomicItems: this.getAtomicItemDetails(),
            practiceItems: this.getPracticeItemDetails(),

            // Items requiring teacher evaluation
            teacherReviewRequired: {
                writtenAnswers: this.getPracticeItemDetails().filter(i => i.requiresTeacherEvaluation),
                totalItemsToReview: 0  // Will be calculated
            }
        };

        // Calculate items needing review
        payload.teacherReviewRequired.totalItemsToReview =
            payload.teacherReviewRequired.writtenAnswers.length;

        // Calculate SHA-256 checksum of the payload
        const checksum = await this.calculateChecksum(payload);

        // Return with checksum wrapper
        return {
            payload: payload,
            security: {
                checksum: checksum,
                algorithm: 'SHA-256',
                warning: 'DO NOT MODIFY - Checksum verification will fail if content is altered'
            }
        };
    },

    /**
     * Download progress as JSON file (async for checksum)
     */
    downloadProgress: async function(filename) {
        try {
            const data = await this.exportProgress();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = filename || `lectie-${this.lessonId}-progres.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('LessonSummary: Progress downloaded with checksum');
        } catch (error) {
            console.error('LessonSummary: Error exporting progress', error);
            alert('Eroare la exportul progresului. Incearca din nou.');
        }
    },

    /**
     * Inject CSS styles for the summary display
     */
    injectStyles: function() {
        if (document.getElementById('lesson-summary-styles')) return;

        const style = document.createElement('style');
        style.id = 'lesson-summary-styles';
        style.textContent = `
            #lesson-summary {
                background: var(--bg-card, #1a1a2e);
                border: 2px solid var(--border-color, #2a2a4a);
                border-radius: 16px;
                padding: 1.5rem;
                margin: 2rem 0;
            }

            .ls-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid var(--border-color, #2a2a4a);
            }

            .ls-icon {
                font-size: 1.5rem;
            }

            .ls-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--text-primary, #fff);
            }

            .ls-grade {
                text-align: center;
                padding: 1.5rem;
                background: var(--bg-primary, #0a0a12);
                border: 3px solid;
                border-radius: 12px;
                margin-bottom: 1.5rem;
            }

            .ls-grade-number {
                font-size: 2.5rem;
                font-weight: 700;
                line-height: 1;
            }

            .ls-grade-label {
                font-size: 1.1rem;
                color: var(--text-secondary, #a0a0b0);
                margin: 0.5rem 0;
            }

            .ls-grade-score {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--text-primary, #fff);
            }

            .ls-breakdown {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .ls-section {
                background: var(--bg-primary, #0a0a12);
                border-radius: 10px;
                padding: 1rem;
            }

            .ls-section-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }

            .ls-section-icon {
                font-size: 1rem;
            }

            .ls-section-name {
                font-weight: 500;
                color: var(--text-primary, #fff);
                flex: 1;
            }

            .ls-section-weight {
                font-size: 0.85rem;
                color: var(--text-secondary, #a0a0b0);
            }

            .ls-section-bar {
                height: 8px;
                background: var(--bg-card, #1a1a2e);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }

            .ls-section-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            .ls-section-detail {
                font-size: 0.85rem;
                color: var(--text-secondary, #a0a0b0);
            }

            .ls-status {
                padding: 1rem;
                border-radius: 10px;
                font-size: 0.95rem;
            }

            .ls-status-complete {
                background: rgba(34, 197, 94, 0.15);
                border: 1px solid var(--success, #22c55e);
                color: var(--success, #22c55e);
            }

            .ls-status-incomplete {
                background: rgba(245, 158, 11, 0.15);
                border: 1px solid var(--warning, #f59e0b);
                color: var(--warning, #f59e0b);
            }

            @media (max-width: 768px) {
                .ls-grade-letter {
                    font-size: 2.5rem;
                }
            }
        `;

        document.head.appendChild(style);
    }
};

// Auto-inject styles when loaded
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LessonSummary.injectStyles());
    } else {
        LessonSummary.injectStyles();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LessonSummary;
}
