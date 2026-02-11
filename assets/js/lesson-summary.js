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
    interactedThisSession: false,

    // Point-based grading system
    // Total: 10 points
    // - 1 point: din oficiu (participation)
    // - 6 points: atomic questions (1 point each)
    // - 3 points: practice exercises (1 point each)
    gradeLabels: {
        10: { label: 'Exceptional!', color: '#22c55e' },
        9: { label: 'Excelent!', color: '#4ade80' },
        8: { label: 'Foarte bine!', color: '#60a5fa' },
        7: { label: 'Bine!', color: '#60a5fa' },
        6: { label: 'Satisfacator', color: '#fbbf24' },
        5: { label: 'Suficient', color: '#f59e0b' },
        4: { label: 'Insuficient', color: '#ef4444' },
        3: { label: 'Slab', color: '#ef4444' },
        2: { label: 'Foarte slab', color: '#dc2626' },
        1: { label: 'Participare', color: '#991b1b' }
    },

    // Session fingerprint for authenticity
    sessionId: null,

    // Cached profile ID for consistent storage keys
    cachedProfileId: null,

    /**
     * Get current profile ID for storage keys
     */
    getProfileId: function() {
        // Use cached value if available (set at init)
        if (this.cachedProfileId) {
            return this.cachedProfileId;
        }
        // Fallback to live lookup
        if (typeof UserSystem !== 'undefined') {
            const profileId = UserSystem.getActiveProfile();
            if (profileId && profileId !== '_guest') {
                return profileId;
            }
        }
        return null;
    },

    /**
     * Initialize the lesson summary system
     * @param {string} lessonId - Unique lesson identifier
     * @param {object} options - Optional configuration
     */
    init: function(lessonId, options = {}) {
        this.lessonId = lessonId;
        this.weights = { ...this.weights, ...options.weights };

        // Cache profile ID at init time for consistent storage keys
        if (typeof UserSystem !== 'undefined') {
            const profileId = UserSystem.getActiveProfile();
            if (profileId && profileId !== '_guest') {
                this.cachedProfileId = profileId;
            }
        }

        // Generate session fingerprint for authenticity
        this.sessionId = this.generateSessionId();

        // Listen for progress events from both systems
        document.addEventListener('atomicProgressSaved', (e) => this.onAtomicProgress(e));
        document.addEventListener('practiceProgressSaved', (e) => this.onPracticeProgress(e));
        document.addEventListener('atomCompleted', () => this.checkAndUpdate());
        document.addEventListener('practiceComplete', () => this.checkAndUpdate());

        // Detect actual user clicks (not saved-data restoration events)
        // This sets interactedThisSession only when the student physically clicks
        document.addEventListener('click', (e) => {
            if (this.interactedThisSession) return; // already detected
            if (e.target.closest('.option, .quiz-option, .atom-option, .practice-option, .ps-save-btn')) {
                this.interactedThisSession = true;
            }
        });

        // Hook into goToStep to toggle practice section visibility
        // Practice should only show on 'test' and 'complete' steps
        this.hookPracticeVisibility();

        // Load existing progress
        this.loadProgress();

        // Initial check
        this.checkAndUpdate();

        console.log('LessonSummary: Initialized for', lessonId);
    },

    /**
     * Hook into goToStep to show practice section only on test/complete steps
     */
    hookPracticeVisibility: function() {
        const practiceEl = document.querySelector('.practice-section, #practice.practice-section');
        if (!practiceEl) return;

        // Hide practice initially (unless already on test/complete)
        const activeSection = document.querySelector('.section.active');
        const activeId = activeSection ? activeSection.id : '';
        if (activeId !== 'test' && activeId !== 'complete') {
            practiceEl.style.display = 'none';
        }

        // Wrap the existing goToStep to add practice toggle
        if (typeof window.goToStep === 'function') {
            const originalGoToStep = window.goToStep;
            window.goToStep = function(step) {
                originalGoToStep(step);
                // Show practice only on test and complete steps
                if (step === 'test' || step === 'complete') {
                    practiceEl.style.display = '';
                } else {
                    practiceEl.style.display = 'none';
                }
            };
        }
    },

    /**
     * Generate a unique session fingerprint using crypto API
     */
    generateSessionId: function() {
        // Use crypto.getRandomValues for cryptographically secure random bytes
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const array = new Uint8Array(16);
            crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        }
        // Fallback for older browsers (less secure but still unique)
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 15);
        return (timestamp + random).substring(0, 32);
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
        const profileId = this.getProfileId();
        const profileSuffix = profileId ? `_${profileId}` : '';

        // Load atomic progress (try multiple sources)
        // Try profile-aware key first, then fallback to legacy key
        const atomicKeyProfile = `atomic-progress-${this.lessonId}${profileSuffix}`;
        const atomicKeyLegacy = `atomic-progress-${this.lessonId}`;
        let atomicSaved = localStorage.getItem(atomicKeyProfile);
        if (!atomicSaved && profileId) {
            atomicSaved = localStorage.getItem(atomicKeyLegacy);
        }
        if (atomicSaved) {
            try {
                const data = JSON.parse(atomicSaved);
                if (data.lessonScore) {
                    this.atomicScore = data.lessonScore;
                }
            } catch (e) {}
        }

        // Also check QuizBridge data (for lessons using legacy quiz system)
        if (!this.atomicScore) {
            const quizBridgeKeyProfile = `quiz-bridge-${this.lessonId}${profileSuffix}`;
            const quizBridgeKeyLegacy = `quiz-bridge-${this.lessonId}`;
            let quizBridgeSaved = localStorage.getItem(quizBridgeKeyProfile);
            if (!quizBridgeSaved && profileId) {
                quizBridgeSaved = localStorage.getItem(quizBridgeKeyLegacy);
            }
            if (quizBridgeSaved) {
                try {
                    const data = JSON.parse(quizBridgeSaved);
                    if (data.correctCount !== undefined) {
                        this.atomicScore = {
                            totalCorrect: data.correctCount || 0,
                            totalQuestions: data.totalQuestions || 6,
                            percentage: data.totalQuestions > 0
                                ? Math.round((data.correctCount / data.totalQuestions) * 100)
                                : 0
                        };
                    }
                } catch (e) {}
            }
        }

        // Load practice progress
        // Try profile-aware key first, then fallback to legacy key
        const practiceKeyProfile = `practice-${this.lessonId}${profileSuffix}`;
        const practiceKeyLegacy = `practice-${this.lessonId}`;
        let practiceSaved = localStorage.getItem(practiceKeyProfile);
        if (!practiceSaved && profileId) {
            practiceSaved = localStorage.getItem(practiceKeyLegacy);
        }
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
            console.log('LessonSummary: Got score from AtomicLearning', this.atomicScore);
        }

        // Also check QuizBridge for legacy quiz system
        if (!this.atomicScore && typeof QuizBridge !== 'undefined' && QuizBridge.lessonId === this.lessonId) {
            this.atomicScore = {
                totalCorrect: QuizBridge.correctCount || 0,
                totalQuestions: QuizBridge.totalQuestions || 6,
                percentage: QuizBridge.totalQuestions > 0
                    ? Math.round((QuizBridge.correctCount / QuizBridge.totalQuestions) * 100)
                    : 0
            };
            console.log('LessonSummary: Got score from QuizBridge', this.atomicScore);
        }

        // Log current state for debugging
        if (!this.atomicScore) {
            console.log('LessonSummary: No atomic score available yet');
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
     * Calculate the final grade using point-based system
     * Total: 10 points = 1 (din oficiu) + 6 (atomic) + 3 (practice)
     *
     * Without practice: max grade is 7 (1 + 6)
     * With practice: max grade is 10 (1 + 6 + 3)
     * Practice is REQUIRED to get a 10.
     */
    calculateFinalScore: function() {
        // Get raw counts
        const atomicCorrect = this.atomicScore?.totalCorrect || 0;
        const atomicTotal = this.atomicScore?.totalQuestions || 6;
        console.log('LessonSummary.calculateFinalScore:', { atomicCorrect, atomicTotal, atomicScore: this.atomicScore });
        const practiceCorrect = this.practiceScore?.correct || 0;
        const practiceTotal = this.practiceScore?.total || 3;
        const practiceComplete = this.practiceScore?.completed || false;
        const practiceStarted = practiceCorrect > 0;

        // Calculate points
        // 1 point din oficiu (always given)
        const dinOficiuPoints = 1;

        // Atomic always worth max 6 points
        const atomicMaxPoints = 6;
        const atomicPoints = Math.round((atomicCorrect / atomicTotal) * atomicMaxPoints);

        // Practice worth 3 points - REQUIRED for grade 10
        let practicePoints = 0;
        if (practiceStarted) {
            practicePoints = Math.round((practiceCorrect / practiceTotal) * 3);
        }

        // Calculate final grade
        const grade = Math.max(1, Math.min(10, dinOficiuPoints + atomicPoints + practicePoints));

        return {
            grade: grade,
            dinOficiuPoints: dinOficiuPoints,
            atomicPoints: atomicPoints,
            atomicMaxPoints: atomicMaxPoints,
            atomicCorrect: atomicCorrect,
            atomicTotal: atomicTotal,
            practicePoints: practicePoints,
            practiceCorrect: practiceCorrect,
            practiceTotal: practiceTotal,
            practiceStarted: practiceStarted,
            practiceComplete: practiceComplete
        };
    },

    /**
     * Get the label and color for a grade
     */
    getGrade: function(grade) {
        const info = this.gradeLabels[grade] || this.gradeLabels[1];
        return {
            grade: grade,
            label: info.label,
            color: info.color
        };
    },

    /**
     * Update the summary display in the page
     */
    updateSummaryDisplay: function() {
        const container = document.getElementById('lesson-summary');
        if (!container) return;

        // Check completion status first (for final mode)
        // For AtomicLearning: atomsCompleted >= atomsTotal
        // For QuizBridge: all questions answered
        let atomicComplete = this.atomicScore?.atomsCompleted >= this.atomicScore?.atomsTotal;
        if (!atomicComplete && typeof QuizBridge !== 'undefined' && QuizBridge.initialized) {
            const answered = Object.keys(QuizBridge.answeredQuestions || {}).length;
            atomicComplete = answered >= QuizBridge.totalQuestions;
        }

        // In progress mode: only show after student interacts THIS session
        // In final mode (atomic complete): always show (it's the final result)
        if (!atomicComplete && !this.interactedThisSession) {
            container.style.display = 'none';
            return;
        }

        // Even in final mode, need actual answers
        const hasAnyAnswers = (this.atomicScore && this.atomicScore.totalCorrect > 0) ||
            (typeof QuizBridge !== 'undefined' && Object.keys(QuizBridge.answeredQuestions || {}).length > 0) ||
            (this.practiceScore && this.practiceScore.correct > 0);
        if (!hasAnyAnswers) {
            container.style.display = 'none';
            return;
        }

        const scores = this.calculateFinalScore();
        const gradeInfo = this.getGrade(scores.grade);

        // Check if there are written answers requiring teacher evaluation
        const hasPracticeAnswers = scores.practiceStarted;

        // Calculate percentages for progress bars
        const atomicPercent = scores.atomicTotal > 0 ? Math.round((scores.atomicCorrect / scores.atomicTotal) * 100) : 0;
        const practicePercent = scores.practiceTotal > 0 ? Math.round((scores.practiceCorrect / scores.practiceTotal) * 100) : 0;

        // Two display modes: progress (during lesson) vs final (after atomic complete)
        if (!atomicComplete) {
            // === PROGRESS MODE: Show points earned, not grade ===
            const earnedSoFar = scores.dinOficiuPoints + scores.atomicPoints;
            const maxPossible = scores.dinOficiuPoints + scores.atomicMaxPoints;
            container.innerHTML = `
                <div class="ls-header">
                    <span class="ls-icon">&#9889;</span>
                    <span class="ls-title">Progresul Tau</span>
                </div>

                <div class="ls-grade" style="border-color: var(--accent-blue, #3b82f6);">
                    <div class="ls-grade-number" style="color: var(--accent-blue, #3b82f6); font-size: 1.8rem;">+${scores.atomicPoints} puncte</div>
                    <div class="ls-grade-label" style="color: var(--text-secondary);">${scores.atomicCorrect}/${scores.atomicTotal} raspunsuri corecte</div>
                    <div class="ls-grade-breakdown">
                        Continua pentru a strange cat mai multe puncte!
                    </div>
                </div>

                <div class="ls-breakdown">
                    <div class="ls-section">
                        <div class="ls-section-header">
                            <span class="ls-section-icon">&#9711;</span>
                            <span class="ls-section-name">Invatare Atomica</span>
                            <span class="ls-section-weight">(max ${scores.atomicMaxPoints} puncte)</span>
                        </div>
                        <div class="ls-section-bar">
                            <div class="ls-section-fill" style="width: ${atomicPercent}%; background: var(--accent-blue);"></div>
                        </div>
                        <div class="ls-section-detail">
                            ${scores.atomicCorrect}/${scores.atomicTotal} corecte = <strong>${scores.atomicPoints} puncte</strong>
                        </div>
                    </div>
                </div>

                <div class="ls-status ls-status-incomplete">
                    &#9888; Completeaza toate sectiunile de invatare atomica pentru a vedea nota finala.
                </div>
            `;
        } else {
            // === FINAL MODE: Show full grade after atomic sections complete ===
            container.innerHTML = `
                <div class="ls-header">
                    <span class="ls-icon">&#128202;</span>
                    <span class="ls-title">Rezumatul Lectiei</span>
                </div>

                <div class="ls-grade" style="border-color: ${gradeInfo.color};">
                    <div class="ls-grade-number" style="color: ${gradeInfo.color};">Nota${hasPracticeAnswers ? ' provizorie' : ''}: ${scores.grade}</div>
                    <div class="ls-grade-label">${gradeInfo.label}</div>
                    <div class="ls-grade-breakdown">
                        ${scores.dinOficiuPoints} (oficiu) + ${scores.atomicPoints} (teorie)${scores.practiceStarted ? ` + ${scores.practicePoints} (practica)` : ''} = ${scores.grade} puncte
                    </div>
                    ${hasPracticeAnswers ? `
                        <div class="ls-provisional-notice">
                            <span>&#128269;</span> Nota finala va fi confirmata de profesor dupa evaluarea raspunsurilor scrise
                        </div>
                    ` : ''}
                </div>

                <div class="ls-breakdown">
                    <div class="ls-section">
                        <div class="ls-section-header">
                            <span class="ls-section-icon">&#10004;</span>
                            <span class="ls-section-name">Invatare Atomica</span>
                            <span class="ls-section-weight">(max ${scores.atomicMaxPoints} puncte)</span>
                        </div>
                        <div class="ls-section-bar">
                            <div class="ls-section-fill" style="width: ${atomicPercent}%; background: var(--accent-blue);"></div>
                        </div>
                        <div class="ls-section-detail">
                            ${scores.atomicCorrect}/${scores.atomicTotal} corecte = <strong>${scores.atomicPoints} puncte</strong> - <em>nota automata</em>
                        </div>
                    </div>

                    ${scores.practiceStarted ? `
                    <div class="ls-section">
                        <div class="ls-section-header">
                            <span class="ls-section-icon">${scores.practiceComplete ? '&#10004;' : '&#9203;'}</span>
                            <span class="ls-section-name">Practica Avansata</span>
                            <span class="ls-section-weight">(max 3 puncte)</span>
                        </div>
                        <div class="ls-section-bar">
                            <div class="ls-section-fill" style="width: ${practicePercent}%; background: var(--success);"></div>
                        </div>
                        <div class="ls-section-detail">
                            ${scores.practiceComplete
                                ? `${scores.practiceCorrect}/${scores.practiceTotal} completate = <strong>${scores.practicePoints} puncte</strong> - <em>necesita evaluare profesor</em>`
                                : `${scores.practiceCorrect}/${scores.practiceTotal} in curs = <strong>${scores.practicePoints} puncte</strong>`}
                        </div>
                    </div>
                    ` : ''}
                </div>

                <div class="ls-status ls-status-complete">
                    &#10004; Lectia completa! ${scores.grade >= 5 ? 'Poti continua la urmatoarea lectie.' : 'Recomandat: reia lectia pentru o nota mai buna.'}
                </div>
                ${!scores.practiceStarted && scores.practiceTotal > 0 ? `
                    <div class="ls-status" style="background: rgba(59, 130, 246, 0.15); border: 1px solid var(--accent-blue, #3b82f6); color: var(--accent-blue, #3b82f6); margin-top: 0.75rem;">
                        &#128161; <strong>Practica disponibila:</strong> Completeaza exercitiile practice pentru pana la 3 puncte in plus!
                    </div>
                ` : ''}
                ${hasPracticeAnswers ? `
                    <div class="ls-teacher-review" style="margin-top: 0.75rem;">
                        <span class="ls-teacher-icon">&#128100;</span>
                        <div>
                            <strong>Pas urmator:</strong> Descarca fisierul JSON si trimite-l profesorului pentru evaluarea finala a raspunsurilor scrise.
                            <button class="ls-download-btn" onclick="LessonSummary.downloadProgress()" style="margin-top: 0.5rem;">
                                &#128229; Descarca progresul (JSON)
                            </button>
                        </div>
                    </div>
                ` : `
                    <div style="text-align: center; margin-top: 0.75rem;">
                        <button class="ls-download-btn" onclick="LessonSummary.downloadProgress()">
                            &#128229; Descarca progresul (JSON)
                        </button>
                    </div>
                `}
            `;
        }

        container.style.display = 'block';
    },

    /**
     * Save unified progress to localStorage
     */
    saveUnifiedProgress: function() {
        if (!this.lessonId) return;

        const scores = this.calculateFinalScore();
        const gradeInfo = this.getGrade(scores.grade);

        // Use profile-aware key for storage
        const profileId = this.getProfileId();
        const profileSuffix = profileId ? `_${profileId}` : '';
        const key = `lesson-summary-${this.lessonId}${profileSuffix}`;
        const data = {
            lessonId: this.lessonId,

            // Point-based grading (new system)
            grading: {
                grade: scores.grade,
                gradeLabel: gradeInfo.label,
                dinOficiuPoints: scores.dinOficiuPoints,
                atomicPoints: scores.atomicPoints,
                practicePoints: scores.practicePoints,
                breakdown: `${scores.dinOficiuPoints} + ${scores.atomicPoints} + ${scores.practicePoints} = ${scores.grade}`
            },

            // Atomic learning details
            atomic: {
                correct: scores.atomicCorrect,
                total: scores.atomicTotal,
                points: scores.atomicPoints,
                atomsCompleted: this.atomicScore?.atomsCompleted || 0,
                atomsTotal: this.atomicScore?.atomsTotal || 0,
                atomsPerfect: this.atomicScore?.atomsPerfect || 0
            },

            // Practice details
            practice: {
                correct: scores.practiceCorrect,
                total: scores.practiceTotal,
                points: scores.practicePoints,
                started: scores.practiceStarted,
                completed: scores.practiceComplete
            },

            // Completion status
            isComplete: (this.atomicScore?.atomsCompleted || 0) >= (this.atomicScore?.atomsTotal || 1) ||
                (typeof QuizBridge !== 'undefined' && QuizBridge.initialized &&
                    Object.keys(QuizBridge.answeredQuestions || {}).length >= QuizBridge.totalQuestions),

            // Metadata
            timestamp: Date.now(),
            version: 2  // Version 2 for new point-based system
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
        const targetLessonId = lessonId || this.lessonId;
        const profileId = this.getProfileId();
        const profileSuffix = profileId ? `_${profileId}` : '';

        // Try profile-aware key first
        const keyProfile = `lesson-summary-${targetLessonId}${profileSuffix}`;
        let saved = localStorage.getItem(keyProfile);

        // Fallback to legacy key if profile key not found
        if (!saved && profileId) {
            const keyLegacy = `lesson-summary-${targetLessonId}`;
            saved = localStorage.getItem(keyLegacy);
        }

        return saved ? JSON.parse(saved) : null;
    },

    /**
     * Reset all lesson progress (quiz, practice, summary)
     * Called by "Reia lectia" button
     */
    resetAll: function() {
        // Reset QuizBridge
        if (typeof QuizBridge !== 'undefined' && QuizBridge.initialized) {
            QuizBridge.reset();
        }

        // Reset PracticeSimple
        if (typeof PracticeSimple !== 'undefined') {
            PracticeSimple.reset();
        }

        // Reset own state
        this.atomicScore = null;
        this.practiceScore = null;
        this.interactedThisSession = false;

        // Clear localStorage keys
        const profileId = this.getProfileId();
        const profileSuffix = profileId ? `_${profileId}` : '';
        ['lesson-summary-', 'atomic-progress-', 'quiz-bridge-', 'practice-'].forEach(prefix => {
            localStorage.removeItem(`${prefix}${this.lessonId}`);
            if (profileSuffix) {
                localStorage.removeItem(`${prefix}${this.lessonId}${profileSuffix}`);
            }
        });

        // Reset quiz DOM: remove locked/correct/wrong classes, hide feedback
        document.querySelectorAll('.option').forEach(o => {
            o.classList.remove('locked', 'correct', 'wrong');
        });
        document.querySelectorAll('.feedback').forEach(f => {
            f.innerHTML = '';
            f.className = 'feedback';
        });

        // Hide result box and check button
        const resultDiv = document.getElementById('test-result');
        if (resultDiv) resultDiv.style.display = 'none';
        const checkBtn = document.getElementById('check-btn');
        if (checkBtn) checkBtn.style.display = 'none';

        // Hide summary
        const container = document.getElementById('lesson-summary');
        if (container) container.style.display = 'none';

        console.log('LessonSummary: Full lesson reset');
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

                // Use shuffledCorrect for accurate comparison (accounts for randomization)
                const correctAnswer = atom.shuffledCorrect?.[qId] || q.correct;
                const isCorrect = studentAnswer === correctAnswer;

                // Get answer texts from DOM (reflects shuffled order)
                const questionEl = atomEl?.querySelector(`[data-qid="${qId}"]`);
                let studentAnswerText = '';
                let correctAnswerText = '';

                if (questionEl) {
                    // Get texts from rendered options (which are in shuffled order)
                    const options = questionEl.querySelectorAll('.atom-option');
                    options.forEach(opt => {
                        const letter = opt.dataset.answer;
                        const text = opt.querySelector('.atom-option-text')?.textContent || '';
                        if (letter === studentAnswer) {
                            studentAnswerText = text;
                        }
                        if (letter === correctAnswer) {
                            correctAnswerText = text;
                        }
                    });
                }

                // Fallback to original options if DOM not available
                if (!correctAnswerText && q.options) {
                    const origCorrectIdx = q.correct.charCodeAt(0) - 97;
                    correctAnswerText = q.options[origCorrectIdx] || '';
                }

                items.push({
                    itemId: qId,
                    atomId: atomId,
                    atomTitle: atomTitle,
                    questionText: q.question,
                    options: q.options,
                    correctAnswer: correctAnswer,
                    correctAnswerText: correctAnswerText,
                    studentAnswer: studentAnswer || null,
                    studentAnswerText: studentAnswerText,
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
        // Check for PracticeSimple first (written answers)
        if (typeof PracticeSimple !== 'undefined' && PracticeSimple.exercises.length > 0) {
            return PracticeSimple.getWrittenAnswers();
        }

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
        const gradeInfo = this.getGrade(scores.grade);

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
                version: '3.0',  // Version 3 for point-based grading
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

            // Point-based grading (1-10 system)
            // Formula: 1 (oficiu) + atomic points (max 6) + practice points (max 3) = max 10
            grading: {
                grade: scores.grade,
                gradeLabel: gradeInfo.label,
                isProvisional: scores.practiceStarted,  // Needs teacher review if practice started
                isComplete: (this.atomicScore?.atomsCompleted || 0) >= (this.atomicScore?.atomsTotal || 1) ||
                    (typeof QuizBridge !== 'undefined' && QuizBridge.initialized &&
                        Object.keys(QuizBridge.answeredQuestions || {}).length >= QuizBridge.totalQuestions),
                breakdown: {
                    dinOficiu: scores.dinOficiuPoints,
                    atomic: scores.atomicPoints,
                    practice: scores.practicePoints,
                    formula: `${scores.dinOficiuPoints} (oficiu) + ${scores.atomicPoints} (teorie) + ${scores.practicePoints} (practica) = ${scores.grade}`
                }
            },

            // Detailed results
            results: {
                atomic: {
                    correct: scores.atomicCorrect,
                    total: scores.atomicTotal,
                    points: scores.atomicPoints,
                    maxPoints: 6,
                    atomsCompleted: this.atomicScore?.atomsCompleted || 0,
                    atomsTotal: this.atomicScore?.atomsTotal || 0
                },
                practice: {
                    completed: scores.practiceCorrect,
                    total: scores.practiceTotal,
                    points: scores.practicePoints,
                    maxPoints: 3,
                    started: scores.practiceStarted,
                    allComplete: scores.practiceComplete
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

            .ls-grade-breakdown {
                font-size: 1rem;
                font-weight: 500;
                color: var(--text-secondary, #a0a0b0);
                margin-top: 0.5rem;
                padding: 0.5rem 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                display: inline-block;
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

            .ls-provisional-notice {
                margin-top: 0.75rem;
                padding: 0.5rem 0.75rem;
                background: rgba(139, 92, 246, 0.15);
                border-radius: 6px;
                font-size: 0.85rem;
                color: var(--accent-purple, #8b5cf6);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .ls-teacher-review {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 1rem;
                background: rgba(59, 130, 246, 0.15);
                border: 1px solid var(--accent-blue, #3b82f6);
                border-radius: 10px;
                font-size: 0.9rem;
                color: var(--accent-blue-light, #60a5fa);
            }

            .ls-teacher-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }

            .ls-download-btn {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1.25rem;
                background: var(--accent-blue, #3b82f6);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .ls-download-btn:hover {
                background: #60a5fa;
                transform: translateY(-1px);
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
