/**
 * Quiz Bridge for LearningHub
 * ============================
 * Integrates legacy quiz systems with LessonSummary grading
 *
 * This bridge allows lessons using older quiz patterns to work
 * with the new 1+6+3 grading system without rewriting HTML.
 *
 * Supported patterns:
 * 1. Inline checkAnswer(num, element, isCorrect) functions
 * 2. Quiz.js with .quiz-question[data-correct] elements
 * 3. checkAnswers() functions with data-value/data-correct
 *
 * Usage:
 *   <script src="assets/js/quiz-bridge.js"></script>
 *   <script>
 *     QuizBridge.init('lesson-id', { totalQuestions: 4 });
 *   </script>
 */

const QuizBridge = {
    lessonId: null,
    totalQuestions: 6,
    answeredQuestions: {},
    correctCount: 0,
    initialized: false,

    /**
     * Initialize the bridge
     * @param {string} lessonId - Unique lesson identifier
     * @param {object} options - Configuration options
     */
    init: function(lessonId, options = {}) {
        this.lessonId = lessonId;
        this.totalQuestions = options.totalQuestions || this.detectTotalQuestions();
        this.answeredQuestions = {};
        this.correctCount = 0;
        this.initialized = true;

        // Load any saved progress
        this.loadProgress();

        // Hook into existing quiz systems
        this.hookLegacyCheckAnswer();
        this.hookQuizOptions();

        // Dispatch initial state
        this.dispatchProgress();

        console.log('QuizBridge: Initialized for', lessonId, 'with', this.totalQuestions, 'questions');
    },

    /**
     * Detect total questions from DOM
     */
    detectTotalQuestions: function() {
        // Try different patterns
        const patterns = [
            '.quiz-question',
            '[id^="feedback"]',
            '.question-card',
            '[data-correct]'
        ];

        for (const pattern of patterns) {
            const count = document.querySelectorAll(pattern).length;
            if (count > 0) return count;
        }

        return 6; // Default
    },

    /**
     * Hook into legacy checkAnswer() function
     */
    hookLegacyCheckAnswer: function() {
        // Check if there's a global checkAnswer function
        if (typeof window.checkAnswer === 'function') {
            const originalCheckAnswer = window.checkAnswer;
            const self = this;

            window.checkAnswer = function(questionNum, element, isCorrect) {
                console.log('QuizBridge: checkAnswer called', questionNum, isCorrect);

                // Call original
                originalCheckAnswer.apply(this, arguments);

                // Track in bridge
                self.recordAnswer(questionNum, isCorrect);
            };

            console.log('QuizBridge: Successfully hooked into checkAnswer()');
        } else {
            console.warn('QuizBridge: window.checkAnswer not found, will retry...');
            // Retry after a short delay in case script order is wrong
            setTimeout(() => {
                if (typeof window.checkAnswer === 'function' && !this.hookedCheckAnswer) {
                    this.hookedCheckAnswer = true;
                    this.hookLegacyCheckAnswer();
                }
            }, 100);
        }

        // Also hook checkAnswers() if it exists
        if (typeof window.checkAnswers === 'function') {
            const originalCheckAnswers = window.checkAnswers;
            const self = this;

            window.checkAnswers = function() {
                // Call original
                originalCheckAnswers.apply(this, arguments);

                // After original runs, scan the DOM for results
                setTimeout(() => self.scanQuizResults(), 100);
            };

            console.log('QuizBridge: Hooked into checkAnswers()');
        }
    },

    /**
     * Hook into Quiz.js style quiz options
     */
    hookQuizOptions: function() {
        const self = this;

        // Listen for clicks on quiz options
        document.addEventListener('click', function(e) {
            const option = e.target.closest('.quiz-option');
            if (!option) return;

            const question = option.closest('.quiz-question, [data-correct]');
            if (!question) return;

            // Wait for any processing to complete
            setTimeout(() => {
                const questionNum = self.getQuestionNumber(question);
                const isCorrect = option.classList.contains('correct') ||
                    option.dataset.value === question.dataset.correct;

                // Only record if question was marked
                if (option.classList.contains('correct') || option.classList.contains('wrong') ||
                    option.classList.contains('selected')) {
                    self.recordAnswer(questionNum, isCorrect);
                }
            }, 200);
        });
    },

    /**
     * Get question number from element
     */
    getQuestionNumber: function(element) {
        // Try to get from id
        const id = element.id || '';
        const match = id.match(/(\d+)/);
        if (match) return parseInt(match[1]);

        // Try index in parent
        const parent = element.closest('section, .quiz-section, main');
        if (parent) {
            const questions = parent.querySelectorAll('.quiz-question, [data-correct]');
            return Array.from(questions).indexOf(element) + 1;
        }

        return Object.keys(this.answeredQuestions).length + 1;
    },

    /**
     * Scan DOM for quiz results after checkAnswers runs
     */
    scanQuizResults: function() {
        const questions = document.querySelectorAll('.quiz-question, [data-correct]');
        let idx = 1;

        questions.forEach(q => {
            const correctOption = q.querySelector('.quiz-option.correct, .option.correct');
            const selectedOption = q.querySelector('.quiz-option.selected, .option.selected, .quiz-option.wrong');

            if (correctOption || selectedOption) {
                const isCorrect = selectedOption &&
                    (selectedOption.classList.contains('correct') ||
                        selectedOption.dataset.value === q.dataset.correct);
                this.recordAnswer(idx, isCorrect);
            }
            idx++;
        });
    },

    /**
     * Record an answer
     */
    recordAnswer: function(questionNum, isCorrect) {
        if (this.answeredQuestions[questionNum] !== undefined) {
            return; // Already answered
        }

        this.answeredQuestions[questionNum] = isCorrect;
        if (isCorrect) {
            this.correctCount++;
        }

        this.saveProgress();
        this.dispatchProgress();

        console.log('QuizBridge: Q' + questionNum + ' answered', isCorrect ? 'correctly' : 'incorrectly',
            '(' + this.correctCount + '/' + this.totalQuestions + ')');
    },

    /**
     * Dispatch progress event for LessonSummary
     */
    dispatchProgress: function() {
        const eventData = {
            lessonId: this.lessonId,
            data: {
                lessonScore: {
                    totalCorrect: this.correctCount,
                    totalQuestions: this.totalQuestions,
                    percentage: Math.round((this.correctCount / this.totalQuestions) * 100)
                }
            }
        };

        document.dispatchEvent(new CustomEvent('atomicProgressSaved', {
            detail: eventData
        }));
    },

    /**
     * Save progress to localStorage
     */
    saveProgress: function() {
        const key = `quiz-bridge-${this.lessonId}`;
        const data = {
            lessonId: this.lessonId,
            answeredQuestions: this.answeredQuestions,
            correctCount: this.correctCount,
            totalQuestions: this.totalQuestions,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(data));
    },

    /**
     * Load progress from localStorage
     */
    loadProgress: function() {
        const key = `quiz-bridge-${this.lessonId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.lessonId === this.lessonId) {
                    this.answeredQuestions = data.answeredQuestions || {};
                    this.correctCount = data.correctCount || 0;
                    if (data.totalQuestions) {
                        this.totalQuestions = data.totalQuestions;
                    }
                }
            } catch (e) {
                console.warn('QuizBridge: Failed to load progress', e);
            }
        }
    },

    /**
     * Reset progress
     */
    reset: function() {
        this.answeredQuestions = {};
        this.correctCount = 0;
        const key = `quiz-bridge-${this.lessonId}`;
        localStorage.removeItem(key);
        this.dispatchProgress();
    },

    /**
     * Get current status
     */
    getStatus: function() {
        return {
            totalCorrect: this.correctCount,
            totalQuestions: this.totalQuestions,
            answered: Object.keys(this.answeredQuestions).length,
            percentage: Math.round((this.correctCount / this.totalQuestions) * 100),
            isComplete: Object.keys(this.answeredQuestions).length >= this.totalQuestions
        };
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizBridge;
}
