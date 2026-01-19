/**
 * Instant Quiz System for LearningHub
 * Provides immediate feedback when user clicks on quiz options
 *
 * Usage:
 * 1. Include this script in lesson HTML
 * 2. Define correctAnswers array and explanations object
 * 3. Call InstantQuiz.init(correctAnswers, explanations, onComplete)
 */

const InstantQuiz = {
    correctAnswers: [],
    explanations: {},
    userAnswers: {},
    onComplete: null,
    passingScore: 0.75, // 75% to pass (3/4)

    /**
     * Initialize the instant quiz system
     * @param {string[]} answers - Array of correct answers (e.g., ['b', 'a', 'c', 'd'])
     * @param {object} explanations - Object with question index as key and explanation as value
     * @param {function} onComplete - Callback when all questions answered correctly
     */
    init: function(answers, explanations = {}, onComplete = null) {
        this.correctAnswers = answers;
        this.explanations = explanations;
        this.onComplete = onComplete;
        this.userAnswers = {};

        this.setupQuizOptions();
        this.createProgressIndicator();
    },

    /**
     * Setup click handlers for quiz options with instant feedback
     */
    setupQuizOptions: function() {
        const self = this;

        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', function() {
                const questionEl = this.closest('.quiz-question');
                const questionIndex = parseInt(questionEl.dataset.question);
                const selectedAnswer = this.dataset.answer;
                const correctAnswer = self.correctAnswers[questionIndex];

                // Check if already answered correctly - don't allow changes
                if (self.userAnswers[questionIndex] === correctAnswer) {
                    return;
                }

                // Remove previous feedback and selection from this question
                questionEl.querySelectorAll('.quiz-option').forEach(o => {
                    o.classList.remove('selected', 'incorrect');
                });

                // Add selection
                this.classList.add('selected');

                // Check answer and show feedback
                const isCorrect = selectedAnswer === correctAnswer;

                if (isCorrect) {
                    this.classList.add('correct');
                    self.showFeedback(questionEl, true, self.explanations[questionIndex]);
                } else {
                    this.classList.add('incorrect');
                    // Show correct answer
                    questionEl.querySelector(`[data-answer="${correctAnswer}"]`).classList.add('correct');
                    self.showFeedback(questionEl, false, self.explanations[questionIndex]);
                }

                // Store answer
                self.userAnswers[questionIndex] = selectedAnswer;

                // Update progress
                self.updateProgress();

                // Check if can complete
                self.checkCompletion();
            });
        });
    },

    /**
     * Display feedback under the question
     */
    showFeedback: function(questionEl, isCorrect, explanation) {
        // Remove existing feedback
        const existingFeedback = questionEl.querySelector('.instant-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create feedback element
        const feedbackEl = document.createElement('div');
        feedbackEl.className = `instant-feedback ${isCorrect ? 'correct' : 'incorrect'}`;

        let feedbackHTML = `
            <div class="feedback-status ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '✓ Corect!' : '✗ Incorect'}
            </div>
        `;

        if (explanation) {
            feedbackHTML += `
                <div class="feedback-explanation">
                    💡 ${explanation}
                </div>
            `;
        }

        feedbackEl.innerHTML = feedbackHTML;
        questionEl.appendChild(feedbackEl);
    },

    /**
     * Create progress indicator dots
     */
    createProgressIndicator: function() {
        const testSection = document.querySelector('.test-section');
        if (!testSection) return;

        // Check if progress indicator already exists
        if (testSection.querySelector('.quiz-progress-indicator')) return;

        const progressContainer = document.createElement('div');
        progressContainer.className = 'quiz-progress-indicator';

        for (let i = 0; i < this.correctAnswers.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'quiz-progress-dot';
            dot.dataset.question = i;
            progressContainer.appendChild(dot);
        }

        // Insert after the header
        const header = testSection.querySelector('.learn-header') || testSection.querySelector('.test-header');
        if (header) {
            header.after(progressContainer);
        } else {
            testSection.prepend(progressContainer);
        }
    },

    /**
     * Update progress dots based on answers
     */
    updateProgress: function() {
        document.querySelectorAll('.quiz-progress-dot').forEach((dot, index) => {
            const answer = this.userAnswers[index];
            dot.classList.remove('answered', 'correct', 'incorrect');

            if (answer !== undefined) {
                dot.classList.add('answered');
                if (answer === this.correctAnswers[index]) {
                    dot.classList.add('correct');
                } else {
                    dot.classList.add('incorrect');
                }
            }
        });
    },

    /**
     * Check if user can complete the quiz (passed)
     */
    checkCompletion: function() {
        const totalQuestions = this.correctAnswers.length;
        let correctCount = 0;

        for (let i = 0; i < totalQuestions; i++) {
            if (this.userAnswers[i] === this.correctAnswers[i]) {
                correctCount++;
            }
        }

        const answeredCount = Object.keys(this.userAnswers).length;
        const score = correctCount / totalQuestions;

        // Update result display
        this.updateResultDisplay(correctCount, totalQuestions, answeredCount);

        // Enable complete button if passed
        const completeBtn = document.getElementById('completeBtn');
        if (completeBtn) {
            if (score >= this.passingScore) {
                completeBtn.disabled = false;
                completeBtn.classList.add('ready');

                if (this.onComplete) {
                    this.onComplete(correctCount, totalQuestions);
                }
            } else if (answeredCount === totalQuestions) {
                // All answered but not passed - allow retry
                completeBtn.disabled = true;
                completeBtn.classList.remove('ready');
            }
        }
    },

    /**
     * Update the result display
     */
    updateResultDisplay: function(correct, total, answered) {
        const resultEl = document.getElementById('quizResult');
        if (!resultEl) return;

        if (answered < total) {
            // Not all answered yet
            resultEl.classList.remove('show');
            return;
        }

        resultEl.classList.add('show');

        const score = correct / total;
        const passed = score >= this.passingScore;

        resultEl.className = `quiz-result show ${passed ? 'passed' : 'failed'}`;

        if (passed) {
            resultEl.innerHTML = `
                <strong>🎉 Felicitari!</strong>
                Ai raspuns corect la ${correct} din ${total} intrebari. Poti continua!
            `;
        } else {
            resultEl.innerHTML = `
                <strong>📚 Mai incearca!</strong>
                Ai raspuns corect la ${correct} din ${total}.
                Ai nevoie de cel putin ${Math.ceil(total * this.passingScore)} raspunsuri corecte.
                <br><small style="opacity: 0.8; margin-top: 0.5rem; display: block;">
                Poti schimba raspunsurile incorecte facand click pe alta optiune.
                </small>
            `;
        }
    },

    /**
     * Get current score
     */
    getScore: function() {
        let correct = 0;
        for (let i = 0; i < this.correctAnswers.length; i++) {
            if (this.userAnswers[i] === this.correctAnswers[i]) {
                correct++;
            }
        }
        return {
            correct: correct,
            total: this.correctAnswers.length,
            percentage: (correct / this.correctAnswers.length) * 100,
            passed: (correct / this.correctAnswers.length) >= this.passingScore
        };
    },

    /**
     * Reset the quiz
     */
    reset: function() {
        this.userAnswers = {};

        // Reset all options
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });

        // Remove all feedback
        document.querySelectorAll('.instant-feedback').forEach(fb => fb.remove());

        // Reset progress dots
        document.querySelectorAll('.quiz-progress-dot').forEach(dot => {
            dot.classList.remove('answered', 'correct', 'incorrect');
        });

        // Hide result
        const resultEl = document.getElementById('quizResult');
        if (resultEl) {
            resultEl.classList.remove('show');
        }

        // Disable complete button
        const completeBtn = document.getElementById('completeBtn');
        if (completeBtn) {
            completeBtn.disabled = true;
            completeBtn.classList.remove('ready');
        }
    }
};

/**
 * Inline Practice System
 * For quick practice boxes after concepts/tables
 */
const InlinePractice = {
    /**
     * Initialize inline practice components
     * @param {object} practiceData - Object with practice ID as key and correct answer + explanation as value
     */
    init: function(practiceData) {
        document.querySelectorAll('.inline-practice').forEach(practice => {
            const practiceId = practice.dataset.practice;
            const data = practiceData[practiceId];

            if (!data) return;

            practice.querySelectorAll('.practice-option').forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove previous selection
                    practice.querySelectorAll('.practice-option').forEach(b => {
                        b.classList.remove('correct', 'incorrect', 'selected');
                    });

                    this.classList.add('selected');
                    const feedbackEl = practice.querySelector('.practice-feedback');
                    const isCorrect = this.dataset.answer === data.correct;

                    if (isCorrect) {
                        this.classList.add('correct');
                        feedbackEl.innerHTML = `✓ ${data.correctMessage || 'Corect!'}`;
                        feedbackEl.className = 'practice-feedback correct';
                    } else {
                        this.classList.add('incorrect');
                        feedbackEl.innerHTML = `✗ ${data.incorrectMessage || 'Incearca din nou.'}`;
                        feedbackEl.className = 'practice-feedback incorrect';
                    }
                    feedbackEl.style.display = 'block';
                });
            });
        });
    }
};

// Export for use in modules (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InstantQuiz, InlinePractice };
}
