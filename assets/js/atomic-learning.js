/**
 * Atomic Learning System for LearningHub
 * =======================================
 * Implements the "read → answer immediately" pattern
 *
 * Each concept block contains:
 * - Content explanation
 * - Inline quiz (1-2 questions)
 * - Hint system on wrong answer
 * - Gating until correct answer
 *
 * Usage:
 *   <div class="atom" data-atom-id="cpu">
 *     <div class="atom-content">...content...</div>
 *     <div class="atom-quiz" data-quiz='[{...question...}]'></div>
 *   </div>
 *
 *   AtomicLearning.init();
 */

const AtomicLearning = {
    // State
    atoms: {},
    completedAtoms: new Set(),
    currentLessonId: null,

    // Settings
    settings: {
        requireCorrectToProgress: true,
        maxHints: 1,  // Show hint immediately on wrong answer
        lockAfterAnswer: true,  // Lock answer - no changing allowed
        animationDuration: 300,
        saveProgress: true
    },

    /**
     * Initialize the atomic learning system
     * @param {string} lessonId - Unique lesson identifier for progress tracking
     * @param {object} options - Override default settings
     */
    init: function(lessonId, options = {}) {
        this.currentLessonId = lessonId;
        this.settings = { ...this.settings, ...options };

        // Load saved progress
        if (this.settings.saveProgress) {
            this.loadProgress();
        }

        // Find and initialize all atoms
        document.querySelectorAll('.atom').forEach(atomEl => {
            this.initAtom(atomEl);
        });

        // Setup gating
        if (this.settings.requireCorrectToProgress) {
            this.setupGating();
        }

        this.injectStyles();
        console.log(`AtomicLearning: Initialized ${Object.keys(this.atoms).length} atoms`);
    },

    /**
     * Initialize a single atom
     * @param {HTMLElement|string} atomElOrId - Atom element or atom ID string
     * @param {Array} quizDataOverride - Optional quiz data (if passed directly)
     */
    initAtom: function(atomElOrId, quizDataOverride) {
        // Handle both element and ID string
        let atomEl, atomId;
        if (typeof atomElOrId === 'string') {
            atomId = atomElOrId;
            atomEl = document.getElementById(atomId);
            if (!atomEl) {
                console.warn(`AtomicLearning: Could not find atom element with id ${atomId}`);
                return;
            }
        } else {
            atomEl = atomElOrId;
            atomId = atomEl.dataset.atomId || atomEl.id;
        }

        if (!atomId) {
            console.warn('AtomicLearning: Atom missing data-atom-id or id');
            return;
        }

        const quizContainer = atomEl.querySelector('.atom-quiz');
        if (!quizContainer) return;

        let quizData;
        try {
            // Use override if provided, otherwise read from data-quiz attribute
            if (quizDataOverride && Array.isArray(quizDataOverride)) {
                quizData = quizDataOverride;
            } else {
                // Read data-quiz from atom element (preferred) or quiz container
                quizData = JSON.parse(atomEl.dataset.quiz || quizContainer.dataset.quiz || '[]');
            }
        } catch (e) {
            console.error(`AtomicLearning: Invalid quiz data for atom ${atomId}`);
            return;
        }

        // Store atom state
        this.atoms[atomId] = {
            element: atomEl,
            questions: quizData,
            answers: {},
            hintsUsed: {},
            completed: this.completedAtoms.has(atomId)
        };

        // Render quiz UI
        this.renderAtomQuiz(atomId, quizContainer, quizData);

        // If already completed, show as completed
        if (this.completedAtoms.has(atomId)) {
            atomEl.classList.add('atom-completed');
            // Restore detailed answers if available
            this.restoreSavedAnswers(atomId);
        }
    },

    /**
     * Render quiz questions for an atom
     */
    renderAtomQuiz: function(atomId, container, questions) {
        const html = questions.map((q, idx) => this.renderQuestion(atomId, q, idx)).join('');
        container.innerHTML = `
            <div class="atom-quiz-wrapper">
                <div class="atom-quiz-header">
                    <span class="atom-quiz-icon">&#128269;</span>
                    <span class="atom-quiz-title">Verifica daca ai inteles</span>
                </div>
                ${html}
            </div>
        `;

        // Attach event listeners
        this.attachQuestionListeners(atomId, container);
    },

    /**
     * Render a single question
     */
    renderQuestion: function(atomId, question, index) {
        const qId = `${atomId}-q${index}`;
        const optionsHtml = question.options.map((opt, i) => `
            <button class="atom-option" data-answer="${String.fromCharCode(97 + i)}" data-qid="${qId}">
                <span class="atom-option-letter">${String.fromCharCode(65 + i)}</span>
                <span class="atom-option-text">${opt}</span>
            </button>
        `).join('');

        return `
            <div class="atom-question" data-qid="${qId}" data-correct="${question.correct}" data-hint="${question.hint || ''}">
                <p class="atom-question-text">${question.question}</p>
                <div class="atom-options">${optionsHtml}</div>
                <div class="atom-feedback" style="display: none;"></div>
                <div class="atom-hint" style="display: none;">
                    <span class="atom-hint-icon">&#128161;</span>
                    <span class="atom-hint-text">${question.hint || 'Gandeste-te mai bine...'}</span>
                </div>
            </div>
        `;
    },

    /**
     * Attach click listeners to question options
     */
    attachQuestionListeners: function(atomId, container) {
        const self = this;

        container.querySelectorAll('.atom-option').forEach(btn => {
            btn.addEventListener('click', function() {
                const qId = this.dataset.qid;
                const answer = this.dataset.answer;
                self.handleAnswer(atomId, qId, answer, this);
            });
        });
    },

    /**
     * Handle answer selection
     */
    handleAnswer: function(atomId, qId, answer, buttonEl) {
        const questionEl = buttonEl.closest('.atom-question');
        const correct = questionEl.dataset.correct;
        const feedbackEl = questionEl.querySelector('.atom-feedback');
        const hintEl = questionEl.querySelector('.atom-hint');
        const atom = this.atoms[atomId];

        // Don't allow changes if already answered (locked)
        if (atom.answers[qId] !== undefined) return;

        // Lock answer immediately
        atom.answers[qId] = answer;

        // Disable all options for this question
        questionEl.querySelectorAll('.atom-option').forEach(opt => {
            opt.classList.add('locked');
            opt.style.pointerEvents = 'none';
            opt.style.opacity = '0.7';
        });

        buttonEl.classList.add('selected');
        buttonEl.style.opacity = '1';

        if (answer === correct) {
            // Correct answer
            buttonEl.classList.add('correct');
            feedbackEl.innerHTML = '<span class="feedback-icon">&#10004;</span> Corect!';
            feedbackEl.className = 'atom-feedback correct';
            feedbackEl.style.display = 'block';
            hintEl.style.display = 'none';

            // Check if all questions in this atom are complete
            this.checkAtomComplete(atomId);

        } else {
            // Wrong answer - show correct answer and hint
            buttonEl.classList.add('incorrect');

            // Show the correct answer
            questionEl.querySelectorAll('.atom-option').forEach(opt => {
                if (opt.dataset.answer === correct) {
                    opt.classList.add('correct');
                    opt.style.opacity = '1';
                }
            });

            feedbackEl.innerHTML = '<span class="feedback-icon">&#10060;</span> Incorect. Raspunsul corect este marcat cu verde.';
            feedbackEl.className = 'atom-feedback incorrect';
            feedbackEl.style.display = 'block';
            hintEl.style.display = 'block';

            // Still allow progression but with penalty recorded
            atom.wrongAnswers = (atom.wrongAnswers || 0) + 1;

            // Check atom completion (even wrong answers count as "answered")
            this.checkAtomComplete(atomId);
        }
    },

    /**
     * Check if all questions in an atom are complete
     */
    checkAtomComplete: function(atomId) {
        const atom = this.atoms[atomId];
        const totalQuestions = atom.questions.length;
        const answeredCount = Object.keys(atom.answers).length;

        // Count correct answers
        let correctAnswers = 0;
        atom.questions.forEach((q, idx) => {
            const qId = `${atomId}-q${idx}`;
            if (atom.answers[qId] === q.correct) {
                correctAnswers++;
            }
        });

        // All questions answered (regardless of correct/incorrect)
        if (answeredCount >= totalQuestions) {
            atom.completed = true;
            atom.correctCount = correctAnswers;
            atom.score = Math.round((correctAnswers / totalQuestions) * 100);

            this.completedAtoms.add(atomId);

            // Visual feedback based on score
            if (correctAnswers === totalQuestions) {
                atom.element.classList.add('atom-completed', 'atom-perfect');
            } else {
                atom.element.classList.add('atom-completed', 'atom-partial');
            }

            // Save progress
            if (this.settings.saveProgress) {
                this.saveProgress();
            }

            // Unlock next atom
            this.unlockNextAtom(atomId);

            // Dispatch event with score info
            document.dispatchEvent(new CustomEvent('atomCompleted', {
                detail: {
                    atomId,
                    totalCompleted: this.completedAtoms.size,
                    correct: correctAnswers,
                    total: totalQuestions,
                    score: atom.score
                }
            }));
        }
    },

    /**
     * Setup gating (lock atoms until previous is complete)
     */
    setupGating: function() {
        const atomEls = document.querySelectorAll('.atom');

        atomEls.forEach((atomEl, index) => {
            if (index === 0) {
                // First atom is always unlocked
                atomEl.classList.add('atom-unlocked');
            } else {
                // Support both data-atom-id and id attributes
                const prevAtomId = atomEls[index - 1].dataset.atomId || atomEls[index - 1].id;
                if (this.completedAtoms.has(prevAtomId)) {
                    atomEl.classList.add('atom-unlocked');
                } else {
                    atomEl.classList.add('atom-locked');
                    this.addLockedOverlay(atomEl);
                }
            }
        });
    },

    /**
     * Add locked overlay to atom
     */
    addLockedOverlay: function(atomEl) {
        if (atomEl.querySelector('.atom-lock-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'atom-lock-overlay';
        overlay.innerHTML = `
            <div class="atom-lock-message">
                <span class="lock-icon">&#128274;</span>
                <span>Raspunde corect la intrebarile anterioare pentru a continua</span>
            </div>
        `;
        atomEl.appendChild(overlay);
    },

    /**
     * Unlock the next atom
     */
    unlockNextAtom: function(completedAtomId) {
        const atomEls = Array.from(document.querySelectorAll('.atom'));
        // Support both data-atom-id and id attributes
        const currentIndex = atomEls.findIndex(el => (el.dataset.atomId || el.id) === completedAtomId);

        if (currentIndex >= 0 && currentIndex < atomEls.length - 1) {
            const nextAtom = atomEls[currentIndex + 1];
            nextAtom.classList.remove('atom-locked');
            nextAtom.classList.add('atom-unlocked', 'atom-just-unlocked');

            const overlay = nextAtom.querySelector('.atom-lock-overlay');
            if (overlay) {
                overlay.classList.add('fade-out');
                setTimeout(() => overlay.remove(), 300);
            }

            // Scroll to next atom smoothly
            setTimeout(() => {
                nextAtom.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    },

    /**
     * Save progress to localStorage (detailed version)
     * Saves: completed atoms, individual answers, scores per atom
     */
    saveProgress: function() {
        if (!this.currentLessonId) return;
        const key = `atomic-progress-${this.currentLessonId}`;

        // Build detailed atom data
        const atomDetails = {};
        for (const atomId in this.atoms) {
            const atom = this.atoms[atomId];
            atomDetails[atomId] = {
                answers: { ...atom.answers },
                correctCount: atom.correctCount || 0,
                totalQuestions: atom.questions.length,
                score: atom.score || 0,
                wrongAnswers: atom.wrongAnswers || 0,
                completed: atom.completed || false
            };
        }

        // Calculate overall lesson score
        const lessonScore = this.calculateLessonScore();

        const data = {
            completedAtoms: Array.from(this.completedAtoms),
            atomDetails: atomDetails,
            lessonScore: lessonScore,
            timestamp: Date.now(),
            version: 2  // Mark as enhanced format
        };

        localStorage.setItem(key, JSON.stringify(data));

        // Dispatch event for external listeners (e.g., lesson summary)
        document.dispatchEvent(new CustomEvent('atomicProgressSaved', {
            detail: { lessonId: this.currentLessonId, data: data }
        }));
    },

    /**
     * Calculate overall lesson score from all atoms
     */
    calculateLessonScore: function() {
        let totalCorrect = 0;
        let totalQuestions = 0;
        let atomsCompleted = 0;
        let atomsPerfect = 0;

        for (const atomId in this.atoms) {
            const atom = this.atoms[atomId];
            totalQuestions += atom.questions.length;
            totalCorrect += atom.correctCount || 0;

            if (atom.completed) {
                atomsCompleted++;
                if (atom.score === 100) atomsPerfect++;
            }
        }

        return {
            totalCorrect: totalCorrect,
            totalQuestions: totalQuestions,
            percentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
            atomsCompleted: atomsCompleted,
            atomsTotal: Object.keys(this.atoms).length,
            atomsPerfect: atomsPerfect
        };
    },

    /**
     * Load progress from localStorage (handles both old and new formats)
     */
    loadProgress: function() {
        if (!this.currentLessonId) return;
        const key = `atomic-progress-${this.currentLessonId}`;
        const saved = localStorage.getItem(key);

        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.completedAtoms = new Set(data.completedAtoms || []);

                // Load detailed atom data if available (version 2+)
                if (data.version >= 2 && data.atomDetails) {
                    this.savedAtomDetails = data.atomDetails;
                }

                // Store lesson score for display
                if (data.lessonScore) {
                    this.savedLessonScore = data.lessonScore;
                }

                console.log('AtomicLearning: Loaded progress', {
                    completedAtoms: this.completedAtoms.size,
                    hasDetails: !!data.atomDetails
                });
            } catch (e) {
                console.warn('AtomicLearning: Could not load saved progress', e);
            }
        }
    },

    /**
     * Restore saved answers to an atom (called after initAtom)
     */
    restoreSavedAnswers: function(atomId) {
        if (!this.savedAtomDetails || !this.savedAtomDetails[atomId]) return;

        const savedAtom = this.savedAtomDetails[atomId];
        const atom = this.atoms[atomId];
        if (!atom) return;

        // Restore atom state
        atom.answers = { ...savedAtom.answers };
        atom.correctCount = savedAtom.correctCount;
        atom.score = savedAtom.score;
        atom.wrongAnswers = savedAtom.wrongAnswers;
        atom.completed = savedAtom.completed;

        // Visually restore the answered questions
        for (const qId in savedAtom.answers) {
            const answer = savedAtom.answers[qId];
            const questionEl = atom.element.querySelector(`[data-qid="${qId}"]`);
            if (!questionEl) continue;

            // Find the question config
            const qIndex = parseInt(qId.split('-q')[1]);
            const question = atom.questions[qIndex];
            if (!question) continue;

            // Lock all options and show selected answer
            questionEl.querySelectorAll('.atom-option').forEach(opt => {
                opt.classList.add('locked');
                opt.style.pointerEvents = 'none';
                opt.style.opacity = '0.7';

                if (opt.dataset.answer === answer) {
                    opt.classList.add('selected');
                    opt.style.opacity = '1';

                    if (answer === question.correct) {
                        opt.classList.add('correct');
                    } else {
                        opt.classList.add('incorrect');
                    }
                }

                // Show correct answer if wrong was selected
                if (answer !== question.correct && opt.dataset.answer === question.correct) {
                    opt.classList.add('correct');
                    opt.style.opacity = '1';
                }
            });

            // Show feedback
            const feedbackEl = questionEl.querySelector('.atom-feedback');
            const hintEl = questionEl.querySelector('.atom-hint');

            if (answer === question.correct) {
                feedbackEl.innerHTML = '<span class="feedback-icon">&#10004;</span> Corect!';
                feedbackEl.className = 'atom-feedback correct';
                feedbackEl.style.display = 'block';
            } else {
                feedbackEl.innerHTML = '<span class="feedback-icon">&#10060;</span> Incorect. Raspunsul corect este marcat cu verde.';
                feedbackEl.className = 'atom-feedback incorrect';
                feedbackEl.style.display = 'block';
                hintEl.style.display = 'block';
            }
        }
    },

    /**
     * Get saved progress data for external use
     */
    getSavedProgress: function() {
        if (!this.currentLessonId) return null;
        const key = `atomic-progress-${this.currentLessonId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    },

    /**
     * Reset progress for current lesson (full restart)
     */
    resetProgress: function() {
        this.completedAtoms.clear();
        this.atoms = {};

        if (this.currentLessonId) {
            localStorage.removeItem(`atomic-progress-${this.currentLessonId}`);
        }

        // Reload page to fully reset
        window.location.reload();
    },

    /**
     * Get final score for the lesson
     */
    getFinalScore: function() {
        let totalCorrect = 0;
        let totalQuestions = 0;
        let totalWrittenBonus = 0;

        for (const atomId in this.atoms) {
            const atom = this.atoms[atomId];
            totalQuestions += atom.questions.length;
            totalCorrect += atom.correctCount || 0;
            totalWrittenBonus += atom.writtenBonus || 0;
        }

        const baseScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        return {
            correct: totalCorrect,
            total: totalQuestions,
            baseScore: baseScore,
            writtenBonus: totalWrittenBonus,
            finalScore: Math.min(100, baseScore + totalWrittenBonus),
            canGetBonus: baseScore < 100
        };
    },

    /**
     * Add written answer bonus to an atom
     */
    addWrittenBonus: function(atomId, bonusPoints) {
        if (this.atoms[atomId]) {
            this.atoms[atomId].writtenBonus = (this.atoms[atomId].writtenBonus || 0) + bonusPoints;
            this.saveProgress();

            document.dispatchEvent(new CustomEvent('writtenBonusAdded', {
                detail: { atomId, bonus: bonusPoints, total: this.getFinalScore() }
            }));
        }
    },

    /**
     * Get completion status
     */
    getStatus: function() {
        const total = Object.keys(this.atoms).length;
        const completed = this.completedAtoms.size;
        return {
            total,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
            isComplete: completed >= total
        };
    },

    /**
     * Inject CSS styles
     */
    injectStyles: function() {
        if (document.getElementById('atomic-learning-styles')) return;

        const style = document.createElement('style');
        style.id = 'atomic-learning-styles';
        style.textContent = `
            /* Atom Container */
            .atom {
                position: relative;
                margin-bottom: 2rem;
                transition: all 0.3s ease;
            }

            .atom-locked {
                pointer-events: none;
                opacity: 0.5;
                filter: blur(2px);
            }

            .atom-unlocked {
                opacity: 1;
                filter: none;
            }

            .atom-just-unlocked {
                animation: atomUnlock 0.5s ease;
            }

            @keyframes atomUnlock {
                0% { transform: scale(0.98); opacity: 0.7; }
                50% { transform: scale(1.01); }
                100% { transform: scale(1); opacity: 1; }
            }

            .atom-completed {
                border-left: 4px solid var(--warning, #f59e0b);
            }

            .atom-completed.atom-perfect {
                border-left: 4px solid var(--success, #22c55e);
            }

            .atom-completed.atom-partial {
                border-left: 4px solid var(--warning, #f59e0b);
            }

            .atom-completed.atom-perfect::after {
                content: '\\2713';
                position: absolute;
                top: 1rem;
                right: 1rem;
                width: 28px;
                height: 28px;
                background: var(--success, #22c55e);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1rem;
            }

            .atom-completed.atom-partial::after {
                content: '~';
                position: absolute;
                top: 1rem;
                right: 1rem;
                width: 28px;
                height: 28px;
                background: var(--warning, #f59e0b);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.2rem;
            }

            /* Locked option state */
            .atom-option.locked {
                cursor: not-allowed;
            }

            /* Lock Overlay */
            .atom-lock-overlay {
                position: absolute;
                inset: 0;
                background: rgba(10, 10, 18, 0.85);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 16px;
                z-index: 10;
                transition: opacity 0.3s ease;
            }

            .atom-lock-overlay.fade-out {
                opacity: 0;
            }

            .atom-lock-message {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-secondary, #a0a0b0);
                text-align: center;
                padding: 1rem;
            }

            .atom-lock-message .lock-icon {
                font-size: 2rem;
                opacity: 0.7;
            }

            /* Quiz Wrapper */
            .atom-quiz-wrapper {
                background: var(--bg-primary, #0a0a12);
                border: 2px solid var(--accent-blue, #3b82f6);
                border-radius: 12px;
                padding: 1.25rem;
                margin-top: 1.5rem;
            }

            .atom-quiz-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid var(--border-color, #2a2a4a);
            }

            .atom-quiz-icon {
                font-size: 1.25rem;
            }

            .atom-quiz-title {
                font-weight: 600;
                color: var(--accent-blue-light, #60a5fa);
            }

            /* Question */
            .atom-question {
                margin-bottom: 1.25rem;
                padding-bottom: 1.25rem;
                border-bottom: 1px solid var(--border-color, #2a2a4a);
            }

            .atom-question:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }

            .atom-question-text {
                font-weight: 500;
                margin-bottom: 0.75rem;
                color: var(--text-primary, #ffffff);
            }

            /* Options */
            .atom-options {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .atom-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                background: var(--bg-card, #1a1a2e);
                border: 2px solid var(--border-color, #2a2a4a);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
                width: 100%;
                color: var(--text-primary, #ffffff);
                font-size: 0.95rem;
            }

            .atom-option:hover {
                border-color: var(--accent-blue, #3b82f6);
                background: var(--bg-card-hover, #252540);
            }

            .atom-option.selected {
                border-color: var(--accent-blue, #3b82f6);
            }

            .atom-option.correct {
                border-color: var(--success, #22c55e);
                background: rgba(34, 197, 94, 0.15);
            }

            .atom-option.incorrect {
                border-color: var(--error, #ef4444);
                background: rgba(239, 68, 68, 0.15);
                animation: shake 0.3s ease;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            .atom-option-letter {
                width: 26px;
                height: 26px;
                background: var(--bg-primary, #0a0a12);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 0.85rem;
                flex-shrink: 0;
            }

            .atom-option.correct .atom-option-letter {
                background: var(--success, #22c55e);
                color: white;
            }

            .atom-option.incorrect .atom-option-letter {
                background: var(--error, #ef4444);
                color: white;
            }

            /* Feedback */
            .atom-feedback {
                margin-top: 0.75rem;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .atom-feedback.correct {
                background: rgba(34, 197, 94, 0.15);
                border: 1px solid var(--success, #22c55e);
                color: var(--success, #22c55e);
            }

            .atom-feedback.incorrect {
                background: rgba(239, 68, 68, 0.15);
                border: 1px solid var(--error, #ef4444);
                color: var(--error, #ef4444);
            }

            .feedback-icon {
                font-size: 1.1rem;
            }

            /* Hint */
            .atom-hint {
                margin-top: 0.75rem;
                padding: 0.75rem 1rem;
                background: rgba(245, 158, 11, 0.15);
                border: 1px solid var(--warning, #f59e0b);
                border-radius: 8px;
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .atom-hint-icon {
                font-size: 1.25rem;
            }

            .atom-hint-text {
                color: var(--warning, #f59e0b);
                font-size: 0.9rem;
                line-height: 1.5;
            }

            /* Progress Bar (optional) */
            .atom-progress {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--bg-card, #1a1a2e);
                z-index: 1000;
            }

            .atom-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--accent-blue, #3b82f6), var(--success, #22c55e));
                transition: width 0.3s ease;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .atom-quiz-wrapper {
                    padding: 1rem;
                }

                .atom-option {
                    padding: 0.6rem 0.75rem;
                }

                .atom-option-letter {
                    width: 24px;
                    height: 24px;
                    font-size: 0.8rem;
                }
            }
        `;

        document.head.appendChild(style);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtomicLearning;
}
