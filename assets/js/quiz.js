/**
 * LearningHub Enhanced Quiz System
 * =================================
 * Improves quiz UX with better feedback, explanations, and navigation
 *
 * Usage:
 *   <script src="../../assets/js/quiz.js"></script>
 *   <script>
 *     Quiz.init({
 *       passingScore: 3,
 *       totalQuestions: 4,
 *       explanations: {
 *         1: 'Ctrl + M este scurtatura standard pentru slide nou in PowerPoint.',
 *         2: 'Title Slide este aspectul cu titlu mare si subtitlu centrat.',
 *         3: 'Delete sterge slide-ul selectat din prezentare.',
 *         4: 'Format Background este accesibil prin click dreapta pe slide.'
 *       }
 *     });
 *   </script>
 *
 * Expected HTML structure:
 *   <div class="quiz-question" data-correct="a">
 *     <p>1. Question text?</p>
 *     <div class="quiz-options">
 *       <div class="quiz-option" data-value="a">Answer A</div>
 *       <div class="quiz-option" data-value="b">Answer B</div>
 *     </div>
 *   </div>
 *   <button class="btn-check" onclick="Quiz.check()">Verifica</button>
 *   <div id="test-result"></div>
 */

const Quiz = {
    config: {
        passingScore: 3,
        totalQuestions: 4,
        explanations: {}
    },

    /**
     * Initialize the quiz with configuration
     */
    init(options = {}) {
        this.config = { ...this.config, ...options };

        // Add click handlers to quiz options (may already exist, but safe to add)
        document.querySelectorAll('.quiz-option').forEach(option => {
            // Only add if not already handled
            if (!option.dataset.quizHandler) {
                option.dataset.quizHandler = 'true';
                option.addEventListener('click', function() {
                    const question = this.closest('.quiz-question');
                    question.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
                    this.classList.add('selected');
                });
            }
        });

        // Override the global checkAnswers function
        window.checkAnswers = () => this.check();

        // Also update any onclick handlers on btn-check buttons
        document.querySelectorAll('.btn-check').forEach(btn => {
            btn.onclick = () => this.check();
        });

        // Add styles for quiz enhancements
        this.addStyles();
    },

    /**
     * Check all answers and show results
     */
    check() {
        let correctCount = 0;
        const questions = document.querySelectorAll('.quiz-question');

        questions.forEach((question, index) => {
            const correctAnswer = question.dataset.correct;
            const selected = question.querySelector('.quiz-option.selected');
            const questionNum = index + 1;

            // Reset states
            question.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('correct', 'wrong');
                // Remove old explanations
                const oldExp = opt.parentElement.querySelector('.explanation');
                if (oldExp) oldExp.remove();
            });

            // Mark correct answer
            question.querySelectorAll('.quiz-option').forEach(opt => {
                if (opt.dataset.value === correctAnswer) {
                    opt.classList.add('correct');
                }
            });

            // Check selection
            if (selected) {
                if (selected.dataset.value === correctAnswer) {
                    correctCount++;
                } else {
                    selected.classList.add('wrong');
                }
            }

            // Add explanation if available
            if (this.config.explanations[questionNum]) {
                this.addExplanation(question, this.config.explanations[questionNum]);
            }
        });

        // Show results
        this.showResults(correctCount);
    },

    /**
     * Add explanation to a question
     */
    addExplanation(question, text) {
        const expDiv = document.createElement('div');
        expDiv.className = 'explanation';
        expDiv.innerHTML = `
            <span class="explanation-icon">💡</span>
            <span class="explanation-text">${text}</span>
        `;

        const optionsDiv = question.querySelector('.quiz-options');
        optionsDiv.after(expDiv);
    },

    /**
     * Show quiz results with appropriate feedback
     */
    showResults(correctCount) {
        const resultDiv = document.getElementById('test-result');
        const passed = correctCount >= this.config.passingScore;

        if (passed) {
            resultDiv.innerHTML = `
                <div class="quiz-result quiz-result-pass">
                    <div class="result-icon">⭐</div>
                    <h3>Excelent! ${correctCount}/${this.config.totalQuestions} corecte!</h3>
                    <p>Ai trecut testul cu succes!</p>
                    <button class="btn-continue" onclick="Quiz.continue()">
                        Continua
                    </button>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="quiz-result quiz-result-fail">
                    <div class="result-icon">📚</div>
                    <h3>${correctCount}/${this.config.totalQuestions} corecte</h3>
                    <p>Ai nevoie de cel putin ${this.config.passingScore} raspunsuri corecte.</p>
                    <div class="result-actions">
                        <button class="btn-review" onclick="Quiz.reviewLesson()">
                            📖 Vreau sa revad lectia
                        </button>
                        <button class="btn-retry" onclick="Quiz.retry()">
                            🔄 Incearca din nou
                        </button>
                        <a href="index.html" class="btn-exit">
                            🚪 Iesire la modul
                        </a>
                    </div>
                </div>
            `;
        }

        resultDiv.style.display = 'block';

        // Scroll to results
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    /**
     * Continue to next section (completion)
     */
    continue() {
        if (typeof goToStep === 'function') {
            goToStep('complete');
        } else {
            // Fallback: look for next lesson link
            const nextLink = document.querySelector('a[href*="lectia"]');
            if (nextLink) {
                window.location = nextLink.href;
            }
        }
    },

    /**
     * Go back to learn section
     */
    reviewLesson() {
        if (typeof goToStep === 'function') {
            goToStep('learn');
        } else {
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    /**
     * Reset quiz for retry
     */
    retry() {
        // Clear all selections and states
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'wrong');
        });

        // Remove explanations
        document.querySelectorAll('.explanation').forEach(exp => exp.remove());

        // Hide results
        const resultDiv = document.getElementById('test-result');
        if (resultDiv) {
            resultDiv.style.display = 'none';
            resultDiv.innerHTML = '';
        }

        // Scroll to top of quiz
        const firstQuestion = document.querySelector('.quiz-question');
        if (firstQuestion) {
            firstQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    /**
     * Add quiz-specific styles
     */
    addStyles() {
        if (document.getElementById('quiz-enhanced-styles')) return;

        const style = document.createElement('style');
        style.id = 'quiz-enhanced-styles';
        style.textContent = `
            .quiz-result {
                text-align: center;
                padding: 2rem;
                border-radius: 16px;
                margin-top: 1.5rem;
                animation: slideIn 0.3s ease;
            }

            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .quiz-result-pass {
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15));
                border: 2px solid var(--accent-green, #10b981);
            }

            .quiz-result-fail {
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.1));
                border: 2px solid var(--accent-orange, #f59e0b);
            }

            .quiz-result .result-icon {
                font-size: 3rem;
                margin-bottom: 0.5rem;
            }

            .quiz-result h3 {
                margin-bottom: 0.5rem;
            }

            .quiz-result-pass h3 {
                color: var(--accent-green, #10b981);
            }

            .quiz-result-fail h3 {
                color: var(--accent-orange, #f59e0b);
            }

            .quiz-result p {
                color: var(--text-secondary, #94a3b8);
                margin-bottom: 1.5rem;
            }

            .result-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
                justify-content: center;
            }

            .btn-continue, .btn-review, .btn-retry, .btn-exit {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 10px;
                font-size: 0.95rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
            }

            .btn-continue {
                background: linear-gradient(135deg, var(--accent-green, #10b981), var(--accent-cyan, #06b6d4));
                color: white;
            }

            .btn-continue:hover {
                transform: scale(1.05);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            }

            .btn-review {
                background: var(--accent-blue, #3b82f6);
                color: white;
            }

            .btn-review:hover {
                background: #2563eb;
            }

            .btn-retry {
                background: var(--accent-purple, #8b5cf6);
                color: white;
            }

            .btn-retry:hover {
                background: #7c3aed;
            }

            .btn-exit {
                background: var(--bg-card, #1a1a2e);
                color: var(--text-secondary, #94a3b8);
                border: 1px solid var(--border, #2d2d44);
            }

            .btn-exit:hover {
                background: var(--bg-secondary, #12121f);
                color: var(--text-primary, #f1f5f9);
            }

            /* Explanation styling */
            .explanation {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                margin-top: 1rem;
                padding: 1rem;
                background: rgba(59, 130, 246, 0.1);
                border-left: 3px solid var(--accent-blue, #3b82f6);
                border-radius: 0 8px 8px 0;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .explanation-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            .explanation-text {
                color: var(--text-secondary, #94a3b8);
                font-size: 0.9rem;
                line-height: 1.6;
            }

            /* Improved option states */
            .quiz-option.correct {
                border-color: var(--accent-green, #10b981) !important;
                background: rgba(16, 185, 129, 0.15) !important;
            }

            .quiz-option.correct::after {
                content: ' ✓';
                color: var(--accent-green, #10b981);
                font-weight: bold;
            }

            .quiz-option.wrong {
                border-color: var(--accent-red, #ef4444) !important;
                background: rgba(239, 68, 68, 0.15) !important;
            }

            .quiz-option.wrong::after {
                content: ' ✗';
                color: var(--accent-red, #ef4444);
                font-weight: bold;
            }

            @media (max-width: 768px) {
                .result-actions {
                    flex-direction: column;
                }

                .btn-continue, .btn-review, .btn-retry, .btn-exit {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;

        document.head.appendChild(style);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Quiz;
}
