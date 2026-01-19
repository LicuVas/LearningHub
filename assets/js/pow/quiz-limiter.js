/**
 * LearningHub Quiz Limiter (Anti-Spam)
 * =====================================
 * Limits quiz attempts per question. After 3 wrong attempts,
 * requires explanation before unlocking more tries.
 *
 * @version 1.0.0
 * @depends storage.js
 */

const QuizLimiter = {
    // Configuration
    MAX_ATTEMPTS: 3,
    MIN_EXPLANATION_CHARS: 20,

    // Current lesson context
    lessonId: null,

    // Tracked questions
    questions: new Map(),

    // Original checkAnswer function (if exists)
    originalCheckAnswer: null,

    /**
     * Initialize quiz limiter
     * @param {string} lessonId - Current lesson identifier
     */
    init(lessonId) {
        this.lessonId = lessonId || this.detectLessonId();

        // Wrap existing checkAnswer if present
        if (typeof window.checkAnswer === 'function') {
            this.wrapCheckAnswer();
        }

        // Setup for quiz-option clicks
        this.setupQuizOptionTracking();

        // Inject styles
        this.injectStyles();

        console.log('[QuizLimiter] Initialized for:', this.lessonId);
    },

    /**
     * Detect lesson ID from page context
     */
    detectLessonId() {
        if (typeof LearningProgress !== 'undefined' && LearningProgress.currentLesson) {
            return `${LearningProgress.currentGrade}-${LearningProgress.currentModule}-${LearningProgress.currentLesson}`;
        }

        const path = window.location.pathname;
        const match = path.match(/content\/tic\/(cls\d+)\/([^\/]+)\/([^\/]+)\.html/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }

        return 'unknown';
    },

    /**
     * Wrap the global checkAnswer function
     */
    wrapCheckAnswer() {
        if (this.originalCheckAnswer) return; // Already wrapped

        this.originalCheckAnswer = window.checkAnswer;

        window.checkAnswer = (element, isCorrect) => {
            // Get question context
            const questionContainer = element.closest('.quiz-question');
            const questionId = this.getQuestionId(questionContainer);

            // Check if locked
            const attemptData = PowStorage.getQuizAttempts(this.lessonId, questionId);
            if (attemptData.locked) {
                this.showLockedState(questionContainer, questionId);
                return;
            }

            // Record attempt
            const newState = PowStorage.recordAttempt(this.lessonId, questionId, isCorrect);

            // Call original function
            this.originalCheckAnswer(element, isCorrect);

            // Check if just got locked
            if (newState.locked && !isCorrect) {
                this.showLockedState(questionContainer, questionId);
            }

            // Update attempt counter display
            this.updateAttemptDisplay(questionContainer, questionId);
        };
    },

    /**
     * Setup tracking for quiz options (alternative to wrapping checkAnswer)
     */
    setupQuizOptionTracking() {
        document.querySelectorAll('.quiz-question').forEach((question, idx) => {
            const questionId = this.getQuestionId(question) || `q${idx + 1}`;
            this.questions.set(question, questionId);

            // Add attempt counter
            this.addAttemptCounter(question, questionId);

            // Check if already locked from storage
            const attemptData = PowStorage.getQuizAttempts(this.lessonId, questionId);
            if (attemptData.locked) {
                this.showLockedState(question, questionId);
            }
        });
    },

    /**
     * Get question ID from container
     */
    getQuestionId(container) {
        if (!container) return null;

        // Try data attribute
        if (container.dataset.questionId) {
            return container.dataset.questionId;
        }

        // Generate from index
        const allQuestions = document.querySelectorAll('.quiz-question');
        const idx = Array.from(allQuestions).indexOf(container);
        return `q${idx + 1}`;
    },

    /**
     * Add attempt counter to question
     */
    addAttemptCounter(container, questionId) {
        // Check if already has counter
        if (container.querySelector('.quiz-attempt-counter')) return;

        const attemptData = PowStorage.getQuizAttempts(this.lessonId, questionId);
        const remaining = Math.max(0, this.MAX_ATTEMPTS - attemptData.attempts);

        const counter = document.createElement('div');
        counter.className = 'quiz-attempt-counter';
        counter.innerHTML = `
            <span class="attempt-icon">🎯</span>
            <span class="attempt-text">Incercari ramase: <strong>${remaining}</strong></span>
        `;

        // Insert before options
        const options = container.querySelector('.quiz-options');
        if (options) {
            options.parentNode.insertBefore(counter, options);
        } else {
            container.appendChild(counter);
        }
    },

    /**
     * Update attempt display
     */
    updateAttemptDisplay(container, questionId) {
        const counter = container.querySelector('.quiz-attempt-counter');
        if (!counter) return;

        const attemptData = PowStorage.getQuizAttempts(this.lessonId, questionId);
        const remaining = Math.max(0, this.MAX_ATTEMPTS - attemptData.attempts);

        const textEl = counter.querySelector('.attempt-text');
        if (textEl) {
            if (attemptData.correct) {
                textEl.innerHTML = '✅ <strong>Raspuns corect!</strong>';
                counter.classList.add('is-correct');
            } else if (attemptData.locked) {
                textEl.innerHTML = '🔒 <strong>Blocat - explica mai jos</strong>';
                counter.classList.add('is-locked');
            } else {
                textEl.innerHTML = `Incercari ramase: <strong>${remaining}</strong>`;
                if (remaining === 1) {
                    counter.classList.add('is-warning');
                }
            }
        }
    },

    /**
     * Show locked state for a question
     */
    showLockedState(container, questionId) {
        // Add locked class
        container.classList.add('quiz-question-locked');

        // Disable options
        container.querySelectorAll('.quiz-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
            opt.style.opacity = '0.5';
        });

        // Check if unlock form already exists
        if (container.querySelector('.quiz-unlock-form')) return;

        // Add explanation unlock form
        const unlockForm = document.createElement('div');
        unlockForm.className = 'quiz-unlock-form';
        unlockForm.innerHTML = `
            <div class="unlock-header">
                <span class="unlock-icon">🔒</span>
                <span class="unlock-title">Intrebare blocata</span>
            </div>
            <p class="unlock-description">
                Ai folosit toate cele 3 incercari. Pentru a primi inca 3 incercari,
                explica de ce crezi ca ai gresit:
            </p>
            <textarea
                class="unlock-textarea"
                placeholder="De ce crezi ca raspunsul tau a fost gresit? (minim ${this.MIN_EXPLANATION_CHARS} caractere)"
                rows="3"
            ></textarea>
            <div class="unlock-counter">0 / ${this.MIN_EXPLANATION_CHARS} caractere</div>
            <button class="unlock-button" disabled>Deblocheaza intrebarea</button>
        `;

        container.appendChild(unlockForm);

        // Setup form handlers
        const textarea = unlockForm.querySelector('.unlock-textarea');
        const counter = unlockForm.querySelector('.unlock-counter');
        const button = unlockForm.querySelector('.unlock-button');

        textarea.addEventListener('input', () => {
            const len = textarea.value.trim().length;
            counter.textContent = `${len} / ${this.MIN_EXPLANATION_CHARS} caractere`;
            counter.classList.toggle('is-valid', len >= this.MIN_EXPLANATION_CHARS);
            button.disabled = len < this.MIN_EXPLANATION_CHARS;
        });

        button.addEventListener('click', () => {
            const explanation = textarea.value.trim();
            if (explanation.length >= this.MIN_EXPLANATION_CHARS) {
                this.unlockQuestion(container, questionId, explanation);
            }
        });
    },

    /**
     * Unlock a question after explanation
     */
    unlockQuestion(container, questionId, explanation) {
        // Save unlock to storage
        PowStorage.unlockQuestion(this.lessonId, questionId, explanation);

        // Remove locked state
        container.classList.remove('quiz-question-locked');

        // Re-enable options
        container.querySelectorAll('.quiz-option').forEach(opt => {
            opt.style.pointerEvents = '';
            opt.style.opacity = '';
            opt.classList.remove('correct', 'wrong');
        });

        // Remove unlock form
        const unlockForm = container.querySelector('.quiz-unlock-form');
        if (unlockForm) {
            unlockForm.remove();
        }

        // Update attempt counter
        this.updateAttemptDisplay(container, questionId);

        // Show success toast
        this.showToast('Intrebarea a fost deblocata! Ai inca 3 incercari.', 'success');
    },

    /**
     * Calculate XP multiplier based on quiz performance
     */
    getXpMultiplier() {
        const stats = PowStorage.getQuizStats(this.lessonId);

        if (stats.questionCount === 0) return 1;

        // Full XP: avg attempts <= 2
        if (stats.avgAttempts <= 2) {
            return 1;
        }

        // 50% XP: avg attempts 2-3
        if (stats.avgAttempts <= 3) {
            return 0.5;
        }

        // 25% XP: avg attempts > 3 or needed unlock
        return 0.25;
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const existing = document.querySelector('.pow-toast');
        if (existing) existing.remove();

        const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };

        const toast = document.createElement('div');
        toast.className = `pow-toast pow-toast-${type}`;
        toast.innerHTML = `
            <span class="pow-toast-icon">${icons[type]}</span>
            <span class="pow-toast-message">${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Inject styles
     */
    injectStyles() {
        if (document.getElementById('quiz-limiter-styles')) return;

        const style = document.createElement('style');
        style.id = 'quiz-limiter-styles';
        style.textContent = `
            .quiz-attempt-counter {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: rgba(100, 116, 139, 0.2);
                border-radius: 8px;
                font-size: 0.85rem;
                color: #94a3b8;
                margin-bottom: 1rem;
            }

            .quiz-attempt-counter.is-warning {
                background: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
            }

            .quiz-attempt-counter.is-locked {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
            }

            .quiz-attempt-counter.is-correct {
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
            }

            .quiz-question-locked {
                border-color: #ef4444 !important;
            }

            .quiz-unlock-form {
                margin-top: 1rem;
                padding: 1.5rem;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.1));
                border: 2px solid rgba(239, 68, 68, 0.3);
                border-radius: 12px;
            }

            .unlock-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.75rem;
            }

            .unlock-icon { font-size: 1.25rem; }

            .unlock-title {
                font-weight: 700;
                color: #ef4444;
            }

            .unlock-description {
                color: #94a3b8;
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }

            .unlock-textarea {
                width: 100%;
                padding: 0.75rem;
                background: rgba(0, 0, 0, 0.3);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: #f1f5f9;
                font-family: inherit;
                font-size: 0.95rem;
                resize: vertical;
                min-height: 80px;
            }

            .unlock-textarea:focus {
                outline: none;
                border-color: #f59e0b;
            }

            .unlock-counter {
                text-align: right;
                font-size: 0.8rem;
                color: #64748b;
                margin: 0.5rem 0;
            }

            .unlock-counter.is-valid {
                color: #10b981;
            }

            .unlock-button {
                width: 100%;
                padding: 0.875rem;
                background: linear-gradient(135deg, #f59e0b, #ef4444);
                color: #000;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .unlock-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .unlock-button:not(:disabled):hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
};

// Auto-initialize on lesson pages with quiz
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.quiz-question')) {
            setTimeout(() => QuizLimiter.init(), 200);
        }
    });
} else {
    if (document.querySelector('.quiz-question')) {
        setTimeout(() => QuizLimiter.init(), 200);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizLimiter;
}
