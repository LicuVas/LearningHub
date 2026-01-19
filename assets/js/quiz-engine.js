/**
 * LearningHub Quiz Engine
 * ========================
 * Motor de quiz avansat cu:
 * - Incarcare banca de itemi din JSON
 * - Randomizare intrebari si optiuni
 * - Suport pentru tipuri multiple (mcq, short, ordering, scenario, debug)
 * - Evaluare cu feedback detaliat
 * - Integrare cu ProficiencySystem
 *
 * Usage:
 *   <script src="assets/js/quiz-engine.js"></script>
 *   const engine = new QuizEngine();
 *   await engine.loadQuestionBank('path/to/quiz.json');
 *   const quiz = engine.generateQuiz('standard', 4);
 *   // ... render quiz ...
 *   const results = engine.evaluateAll(userAnswers);
 */

class QuizEngine {
    constructor(options = {}) {
        this.options = {
            shuffleQuestions: true,
            shuffleOptions: true,
            showExplanations: true,
            ...options
        };

        this.questionBank = null;
        this.currentQuiz = [];
        this.userAnswers = {};
        this.results = null;

        this.injectStyles();
    }

    /**
     * Incarca banca de intrebari din fisier JSON
     * @param {string} path - Calea catre fisierul quiz JSON
     */
    async loadQuestionBank(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.questionBank = await response.json();
            return this.questionBank;
        } catch (e) {
            console.error('QuizEngine: Error loading question bank', e);
            return null;
        }
    }

    /**
     * Seteaza banca de intrebari direct (fara fetch)
     * @param {Object} data
     */
    setQuestionBank(data) {
        this.questionBank = data;
    }

    /**
     * Genereaza un quiz pentru un nivel specific
     * @param {string} level - 'minim' | 'standard' | 'performanta'
     * @param {number} count - Numarul de intrebari (optional, default: toate)
     * @returns {Array} - Array de intrebari randomizate
     */
    generateQuiz(level = 'standard', count = null) {
        if (!this.questionBank) {
            console.warn('QuizEngine: No question bank loaded');
            return [];
        }

        const key = `items_${level}`;
        let items = this.questionBank[key] || this.questionBank.items_standard || [];

        // Cloneaza pentru a nu modifica originalul
        items = JSON.parse(JSON.stringify(items));

        // Randomizeaza ordinea intrebarilor
        if (this.options.shuffleQuestions) {
            items = this.shuffle(items);
        }

        // Limiteaza numarul daca e specificat
        if (count && count < items.length) {
            items = items.slice(0, count);
        }

        // Randomizeaza optiunile pentru MCQ
        if (this.options.shuffleOptions) {
            items = items.map(item => {
                if (item.type === 'mcq' && item.options) {
                    item.options = this.shuffle([...item.options]);
                }
                return item;
            });
        }

        // Adauga ID-uri unice
        items = items.map((item, idx) => ({
            ...item,
            id: `q${idx + 1}`,
            originalIndex: idx
        }));

        this.currentQuiz = items;
        this.userAnswers = {};
        this.results = null;

        return items;
    }

    /**
     * Inregistreaza raspunsul utilizatorului
     * @param {string} questionId
     * @param {any} answer
     */
    setAnswer(questionId, answer) {
        this.userAnswers[questionId] = answer;
    }

    /**
     * Evalueaza o singura intrebare
     * @param {string} questionId
     * @param {any} userAnswer
     * @returns {Object} - { correct, expected, explanation }
     */
    evaluateQuestion(questionId, userAnswer) {
        const question = this.currentQuiz.find(q => q.id === questionId);
        if (!question) return { correct: false, expected: null };

        let correct = false;
        const expected = question.answer_key;
        const explanation = question.explanation || null;

        switch (question.type) {
            case 'mcq':
                // Pentru MCQ, compara direct valoarea
                correct = String(userAnswer).toLowerCase().trim() ===
                          String(expected).toLowerCase().trim();
                break;

            case 'short':
                // Pentru raspuns scurt, verifica daca contine cuvintele cheie
                // sau daca e aproximativ corect
                if (expected === 'MODEL_ANSWER_REQUIRED') {
                    // Nu putem evalua automat - manual review needed
                    correct = null; // null = needs review
                } else {
                    const userLower = String(userAnswer || '').toLowerCase().trim();
                    const expectedLower = String(expected).toLowerCase().trim();
                    // Verifica match partial sau keywords
                    correct = userLower.includes(expectedLower) ||
                              expectedLower.includes(userLower) ||
                              this.fuzzyMatch(userLower, expectedLower);
                }
                break;

            case 'ordering':
                // Pentru ordonare, verifica ordinea
                if (Array.isArray(userAnswer) && Array.isArray(expected)) {
                    correct = JSON.stringify(userAnswer) === JSON.stringify(expected);
                }
                break;

            case 'scenario':
            case 'debug':
                // Acestea necesita evaluare manuala
                correct = null;
                break;

            default:
                correct = String(userAnswer) === String(expected);
        }

        return { correct, expected, explanation };
    }

    /**
     * Evalueaza toate raspunsurile
     * @returns {Object} - { score, total, percentage, details }
     */
    evaluateAll() {
        const details = [];
        let score = 0;
        let autoGradable = 0;

        for (const question of this.currentQuiz) {
            const userAnswer = this.userAnswers[question.id];
            const result = this.evaluateQuestion(question.id, userAnswer);

            details.push({
                questionId: question.id,
                question: question.prompt,
                type: question.type,
                userAnswer,
                ...result
            });

            if (result.correct === true) {
                score++;
                autoGradable++;
            } else if (result.correct === false) {
                autoGradable++;
            }
            // null = needs manual review, nu se numara
        }

        const total = autoGradable;
        const percentage = total > 0 ? score / total : 0;

        this.results = { score, total, percentage, details };
        return this.results;
    }

    /**
     * Match fuzzy simplu (pentru raspunsuri scurte)
     */
    fuzzyMatch(str1, str2) {
        if (!str1 || !str2) return false;

        // Daca unul il contine pe celalalt
        if (str1.includes(str2) || str2.includes(str1)) return true;

        // Verifica daca 70%+ din cuvinte se potrivesc
        const words1 = str1.split(/\s+/).filter(w => w.length > 2);
        const words2 = str2.split(/\s+/).filter(w => w.length > 2);

        if (words1.length === 0 || words2.length === 0) return false;

        const matches = words1.filter(w1 =>
            words2.some(w2 => w1.includes(w2) || w2.includes(w1))
        ).length;

        return matches / Math.max(words1.length, words2.length) >= 0.7;
    }

    /**
     * Fisher-Yates shuffle
     */
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * Genereaza HTML pentru quiz
     * @returns {string}
     */
    renderQuizHTML() {
        if (!this.currentQuiz.length) return '<p>Nu sunt intrebari disponibile.</p>';

        return this.currentQuiz.map((q, idx) => this.renderQuestionHTML(q, idx)).join('');
    }

    /**
     * Genereaza HTML pentru o intrebare
     */
    renderQuestionHTML(question, index) {
        const num = index + 1;

        switch (question.type) {
            case 'mcq':
                return this.renderMCQ(question, num);
            case 'short':
                return this.renderShort(question, num);
            case 'ordering':
                return this.renderOrdering(question, num);
            case 'scenario':
            case 'debug':
                return this.renderTextArea(question, num);
            default:
                return this.renderShort(question, num);
        }
    }

    renderMCQ(question, num) {
        const options = question.options || ['A', 'B', 'C', 'D'];
        return `
            <div class="qe-question" data-id="${question.id}" data-type="mcq">
                <p class="qe-prompt"><strong>${num}.</strong> ${question.prompt}</p>
                <div class="qe-options">
                    ${options.map((opt, i) => `
                        <label class="qe-option">
                            <input type="radio" name="${question.id}" value="${String.fromCharCode(97 + i)}">
                            <span class="qe-option-text">${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderShort(question, num) {
        return `
            <div class="qe-question" data-id="${question.id}" data-type="short">
                <p class="qe-prompt"><strong>${num}.</strong> ${question.prompt}</p>
                <input type="text" class="qe-input" placeholder="Scrie raspunsul aici...">
            </div>
        `;
    }

    renderOrdering(question, num) {
        const items = question.options || ['Pas 1', 'Pas 2', 'Pas 3'];
        const shuffled = this.shuffle([...items]);
        return `
            <div class="qe-question" data-id="${question.id}" data-type="ordering">
                <p class="qe-prompt"><strong>${num}.</strong> ${question.prompt}</p>
                <p class="qe-hint">Trage elementele in ordinea corecta:</p>
                <ul class="qe-sortable" data-items='${JSON.stringify(items)}'>
                    ${shuffled.map(item => `
                        <li class="qe-sortable-item" draggable="true">${item}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    renderTextArea(question, num) {
        return `
            <div class="qe-question" data-id="${question.id}" data-type="${question.type}">
                <p class="qe-prompt"><strong>${num}.</strong> ${question.prompt}</p>
                <textarea class="qe-textarea" rows="4" placeholder="Scrie raspunsul tau..."></textarea>
            </div>
        `;
    }

    /**
     * Ataseaza event listeners pentru colectarea raspunsurilor
     * @param {HTMLElement} container
     */
    attachListeners(container) {
        // MCQ
        container.querySelectorAll('.qe-question[data-type="mcq"]').forEach(q => {
            q.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.setAnswer(q.dataset.id, e.target.value);
                    // Visual feedback
                    q.querySelectorAll('.qe-option').forEach(opt =>
                        opt.classList.toggle('selected', opt.querySelector('input').checked)
                    );
                });
            });
        });

        // Short answer
        container.querySelectorAll('.qe-question[data-type="short"] .qe-input').forEach(input => {
            const q = input.closest('.qe-question');
            input.addEventListener('input', () => {
                this.setAnswer(q.dataset.id, input.value);
            });
        });

        // Textarea (scenario, debug)
        container.querySelectorAll('.qe-textarea').forEach(ta => {
            const q = ta.closest('.qe-question');
            ta.addEventListener('input', () => {
                this.setAnswer(q.dataset.id, ta.value);
            });
        });

        // Ordering (drag & drop simplu)
        this.initSortable(container);
    }

    /**
     * Initializeaza drag & drop pentru ordering
     */
    initSortable(container) {
        container.querySelectorAll('.qe-sortable').forEach(list => {
            const q = list.closest('.qe-question');
            let draggedItem = null;

            list.querySelectorAll('.qe-sortable-item').forEach(item => {
                item.addEventListener('dragstart', () => {
                    draggedItem = item;
                    item.classList.add('dragging');
                });

                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                    // Update answer
                    const order = [...list.querySelectorAll('.qe-sortable-item')]
                        .map(i => i.textContent.trim());
                    this.setAnswer(q.dataset.id, order);
                });

                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const afterElement = this.getDragAfterElement(list, e.clientY);
                    if (afterElement == null) {
                        list.appendChild(draggedItem);
                    } else {
                        list.insertBefore(draggedItem, afterElement);
                    }
                });
            });
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.qe-sortable-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    /**
     * Afiseaza rezultatele in container
     * @param {HTMLElement} container
     */
    showResults(container) {
        if (!this.results) this.evaluateAll();

        const { score, total, percentage, details } = this.results;
        const passed = percentage >= 0.66;

        // Marcheaza intrebarile
        details.forEach(d => {
            const qEl = container.querySelector(`.qe-question[data-id="${d.questionId}"]`);
            if (!qEl) return;

            qEl.classList.remove('correct', 'wrong', 'review');

            if (d.correct === true) {
                qEl.classList.add('correct');
            } else if (d.correct === false) {
                qEl.classList.add('wrong');
            } else {
                qEl.classList.add('review');
            }

            // Adauga explicatie daca exista
            if (this.options.showExplanations && d.explanation) {
                let expEl = qEl.querySelector('.qe-explanation');
                if (!expEl) {
                    expEl = document.createElement('div');
                    expEl.className = 'qe-explanation';
                    qEl.appendChild(expEl);
                }
                expEl.innerHTML = `<span class="qe-exp-icon">💡</span> ${d.explanation}`;
            }

            // Arata raspunsul corect pentru MCQ
            if (d.type === 'mcq' && d.correct === false) {
                qEl.querySelectorAll('.qe-option').forEach(opt => {
                    const val = opt.querySelector('input').value;
                    if (val === d.expected) {
                        opt.classList.add('correct-answer');
                    }
                });
            }
        });

        // Returneaza summary
        return {
            html: `
                <div class="qe-results ${passed ? 'passed' : 'failed'}">
                    <div class="qe-results-icon">${passed ? '⭐' : '📚'}</div>
                    <h3>${score}/${total} corecte (${Math.round(percentage * 100)}%)</h3>
                    <p>${passed ? 'Felicitari! Ai trecut testul.' : 'Mai exerseaza si incearca din nou.'}</p>
                </div>
            `,
            passed,
            score,
            total,
            percentage
        };
    }

    /**
     * Reseteaza quiz-ul
     */
    reset() {
        this.userAnswers = {};
        this.results = null;
    }

    /**
     * Inject CSS styles
     */
    injectStyles() {
        if (document.getElementById('quiz-engine-styles')) return;

        const style = document.createElement('style');
        style.id = 'quiz-engine-styles';
        style.textContent = `
            .qe-question {
                margin-bottom: 1.5rem;
                padding: 1.25rem;
                background: var(--bg-card, #1a1a2e);
                border: 2px solid var(--border, #2d2d44);
                border-radius: 12px;
                transition: border-color 0.3s ease;
            }

            .qe-question.correct {
                border-color: var(--accent-green, #10b981);
                background: rgba(16, 185, 129, 0.1);
            }

            .qe-question.wrong {
                border-color: var(--accent-red, #ef4444);
                background: rgba(239, 68, 68, 0.1);
            }

            .qe-question.review {
                border-color: var(--accent-orange, #f59e0b);
                background: rgba(245, 158, 11, 0.1);
            }

            .qe-prompt {
                margin-bottom: 1rem;
                line-height: 1.6;
                color: var(--text-primary, #f1f5f9);
            }

            .qe-hint {
                font-size: 0.85rem;
                color: var(--text-muted, #64748b);
                margin-bottom: 0.75rem;
            }

            /* MCQ Options */
            .qe-options {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .qe-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                background: var(--bg-secondary, #12121f);
                border: 1px solid var(--border, #2d2d44);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .qe-option:hover {
                border-color: var(--accent-blue, #3b82f6);
            }

            .qe-option.selected {
                border-color: var(--accent-blue, #3b82f6);
                background: rgba(59, 130, 246, 0.15);
            }

            .qe-option.correct-answer {
                border-color: var(--accent-green, #10b981);
                background: rgba(16, 185, 129, 0.15);
            }

            .qe-option input {
                accent-color: var(--accent-blue, #3b82f6);
            }

            .qe-option-text {
                color: var(--text-secondary, #94a3b8);
            }

            /* Short answer input */
            .qe-input {
                width: 100%;
                padding: 0.75rem 1rem;
                background: var(--bg-secondary, #12121f);
                border: 1px solid var(--border, #2d2d44);
                border-radius: 8px;
                color: var(--text-primary, #f1f5f9);
                font-size: 1rem;
            }

            .qe-input:focus {
                outline: none;
                border-color: var(--accent-cyan, #06b6d4);
            }

            /* Textarea */
            .qe-textarea {
                width: 100%;
                padding: 0.75rem 1rem;
                background: var(--bg-secondary, #12121f);
                border: 1px solid var(--border, #2d2d44);
                border-radius: 8px;
                color: var(--text-primary, #f1f5f9);
                font-size: 1rem;
                resize: vertical;
                min-height: 80px;
            }

            .qe-textarea:focus {
                outline: none;
                border-color: var(--accent-cyan, #06b6d4);
            }

            /* Sortable (ordering) */
            .qe-sortable {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .qe-sortable-item {
                padding: 0.75rem 1rem;
                background: var(--bg-secondary, #12121f);
                border: 1px solid var(--border, #2d2d44);
                border-radius: 8px;
                margin-bottom: 0.5rem;
                cursor: grab;
                transition: all 0.2s ease;
            }

            .qe-sortable-item:hover {
                border-color: var(--accent-purple, #8b5cf6);
            }

            .qe-sortable-item.dragging {
                opacity: 0.5;
                border-color: var(--accent-purple, #8b5cf6);
            }

            /* Explanation */
            .qe-explanation {
                margin-top: 1rem;
                padding: 0.75rem 1rem;
                background: rgba(59, 130, 246, 0.1);
                border-left: 3px solid var(--accent-blue, #3b82f6);
                border-radius: 0 8px 8px 0;
                font-size: 0.9rem;
                color: var(--text-secondary, #94a3b8);
            }

            .qe-exp-icon {
                margin-right: 0.5rem;
            }

            /* Results */
            .qe-results {
                text-align: center;
                padding: 2rem;
                border-radius: 16px;
                margin-top: 1.5rem;
            }

            .qe-results.passed {
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15));
                border: 2px solid var(--accent-green, #10b981);
            }

            .qe-results.failed {
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.1));
                border: 2px solid var(--accent-orange, #f59e0b);
            }

            .qe-results-icon {
                font-size: 3rem;
                margin-bottom: 0.5rem;
            }

            .qe-results h3 {
                margin-bottom: 0.5rem;
            }

            .qe-results.passed h3 {
                color: var(--accent-green, #10b981);
            }

            .qe-results.failed h3 {
                color: var(--accent-orange, #f59e0b);
            }

            .qe-results p {
                color: var(--text-secondary, #94a3b8);
            }
        `;

        document.head.appendChild(style);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizEngine;
}
