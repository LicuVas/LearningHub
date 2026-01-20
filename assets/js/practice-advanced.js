/**
 * Advanced Practice System for LearningHub
 * =========================================
 * Complex practice exercises that combine multiple concepts
 *
 * Exercise Types:
 * 1. synthesis - Quiz questions combining multiple concepts
 * 2. dragdrop - Drag & drop categorization
 * 3. scenario - Real-world scenarios with choices
 * 4. schema - Fill in the blank diagrams
 *
 * Features:
 * - Optional but contributes to XP/score
 * - Automatic verification
 * - Detailed feedback
 * - Integration with RPG system
 *
 * Usage:
 *   AdvancedPractice.init('lesson-id', exercisesConfig);
 */

const AdvancedPractice = {
    // State
    lessonId: null,
    exercises: [],
    results: {},
    totalScore: 0,
    maxScore: 0,

    // XP rewards
    xpRewards: {
        synthesis: { base: 30, perfect: 50 },
        dragdrop: { base: 40, perfect: 60 },
        scenario: { base: 35, perfect: 55 },
        schema: { base: 45, perfect: 70 },
        written: { base: 50, perfect: 100 }  // Bonus for written answers
    },

    // Settings
    settings: {
        lockAfterAnswer: true  // No changing answers
    },

    /**
     * Initialize the practice system
     * @param {string} lessonId - Unique lesson identifier
     * @param {Array} exercises - Array of exercise configurations
     */
    init: function(lessonId, exercises) {
        this.lessonId = lessonId;
        this.exercises = exercises;
        this.results = {};
        this.totalScore = 0;
        this.maxScore = exercises.length;

        // Load any saved progress first
        this.loadProgress();

        // Render exercises
        const container = document.getElementById('advanced-practice');
        if (container) {
            container.innerHTML = this.renderAllExercises();
            this.attachAllListeners();

            // Restore saved state after rendering
            this.restoreSavedState();
        }

        this.injectStyles();
        console.log(`AdvancedPractice: Initialized ${exercises.length} exercises`, {
            savedResults: Object.keys(this.results).length
        });
    },

    /**
     * Load progress from localStorage
     */
    loadProgress: function() {
        if (!this.lessonId) return;
        const key = `practice-${this.lessonId}`;
        const saved = localStorage.getItem(key);

        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Load detailed results if available (version 2+)
                if (data.version >= 2 && data.exerciseDetails) {
                    this.results = data.exerciseDetails;
                    this.totalScore = data.xp || 0;
                } else if (data.completed) {
                    // Legacy format - mark as completed but no details
                    this.legacyCompleted = true;
                }
            } catch (e) {
                console.warn('AdvancedPractice: Could not load saved progress', e);
            }
        }
    },

    /**
     * Save progress to localStorage (detailed version)
     */
    saveProgress: function() {
        if (!this.lessonId) return;
        const key = `practice-${this.lessonId}`;

        let totalXP = 0;
        let correctCount = 0;
        for (const idx in this.results) {
            totalXP += this.results[idx].xp || 0;
            if (this.results[idx].correct) correctCount++;
        }

        const data = {
            lessonId: this.lessonId,
            exerciseDetails: this.results,
            completed: Object.keys(this.results).length >= this.exercises.length,
            xp: totalXP,
            correct: correctCount,
            total: this.exercises.length,
            timestamp: Date.now(),
            version: 2
        };

        localStorage.setItem(key, JSON.stringify(data));

        // Dispatch event for external listeners
        document.dispatchEvent(new CustomEvent('practiceProgressSaved', {
            detail: { lessonId: this.lessonId, data: data }
        }));
    },

    /**
     * Restore saved visual state after rendering
     */
    restoreSavedState: function() {
        for (const idx in this.results) {
            const result = this.results[idx];
            const exerciseIdx = parseInt(idx);
            const container = document.querySelector(`[data-exercise-id="${exerciseIdx}"]`);
            if (!container) continue;

            const exercise = this.exercises[exerciseIdx];
            const feedback = container.querySelector('.ap-feedback');
            const type = container.dataset.type;

            // Restore based on exercise type
            if (type === 'synthesis') {
                this.restoreSynthesis(container, exercise, result);
            } else if (type === 'scenario') {
                this.restoreScenario(container, exercise, result);
            } else if (type === 'dragdrop') {
                this.restoreDragDrop(container, exercise, result);
            } else if (type === 'schema') {
                this.restoreSchema(container, exercise, result);
            } else if (type === 'written') {
                this.restoreWritten(container, exercise, result);
            }
        }

        // Update score display
        this.updateTotalScore();
    },

    restoreSynthesis: function(container, exercise, result) {
        const feedback = container.querySelector('.ap-feedback');

        // Lock all options
        container.querySelectorAll('.ap-option').forEach(opt => {
            opt.classList.add('locked');
            opt.style.pointerEvents = 'none';
            opt.style.opacity = '0.6';

            if (result.selectedAnswer && opt.dataset.answer === result.selectedAnswer) {
                opt.classList.add('selected');
                opt.style.opacity = '1';
                if (result.correct) {
                    opt.classList.add('correct');
                } else {
                    opt.classList.add('incorrect');
                }
            }

            // Show correct answer
            if (opt.dataset.answer === exercise.correct) {
                opt.classList.add('correct');
                opt.style.opacity = '1';
            }
        });

        if (result.correct) {
            feedback.innerHTML = `<span class="ap-feedback-icon">&#10004;</span> Corect! ${exercise.explanation || ''} +${result.xp} XP`;
            feedback.className = 'ap-feedback correct';
        } else {
            feedback.innerHTML = `<span class="ap-feedback-icon">&#10060;</span> Incorect. ${exercise.explanation || ''} +0 XP`;
            feedback.className = 'ap-feedback incorrect';
        }
        feedback.style.display = 'block';
    },

    restoreScenario: function(container, exercise, result) {
        const feedback = container.querySelector('.ap-feedback');

        container.querySelectorAll('.ap-scenario-choice').forEach((ch, i) => {
            ch.classList.add('locked');
            ch.style.pointerEvents = 'none';
            ch.style.opacity = '0.6';

            if (result.selectedChoice === i) {
                ch.classList.add('selected');
                ch.style.opacity = '1';
                if (result.correct) {
                    ch.classList.add('correct');
                } else {
                    ch.classList.add('incorrect');
                }
            }

            if (i === exercise.correctChoice) {
                ch.classList.add('correct');
                ch.style.opacity = '1';
            }
        });

        if (result.correct) {
            feedback.innerHTML = `<span class="ap-feedback-icon">&#10004;</span> Excelent! ${exercise.explanation || ''} +${result.xp} XP`;
            feedback.className = 'ap-feedback correct';
        } else {
            feedback.innerHTML = `<span class="ap-feedback-icon">&#10060;</span> ${exercise.explanation || ''} +0 XP`;
            feedback.className = 'ap-feedback incorrect';
        }
        feedback.style.display = 'block';
    },

    restoreDragDrop: function(container, exercise, result) {
        const feedback = container.querySelector('.ap-feedback');
        const checkBtn = container.querySelector('.ap-check-btn');

        // Restore items to their positions
        if (result.itemPositions) {
            for (const itemId in result.itemPositions) {
                const category = result.itemPositions[itemId];
                const item = container.querySelector(`[data-item="${itemId}"]`);
                const zone = container.querySelector(`[data-category="${category}"] .ap-drop-items`);
                if (item && zone) {
                    zone.appendChild(item);

                    // Mark correct/incorrect
                    const expectedCategory = exercise.items.find(i => i.id === itemId)?.category;
                    if (category === expectedCategory) {
                        item.classList.add('correct');
                    } else {
                        item.classList.add('incorrect');
                    }
                }
            }
        }

        if (checkBtn) {
            checkBtn.disabled = true;
            checkBtn.textContent = 'Verificat';
        }

        if (result.correct) {
            feedback.innerHTML = `<span class="ap-feedback-icon">✓</span> Perfect! +${result.xp} XP`;
            feedback.className = 'ap-feedback correct';
        } else {
            feedback.innerHTML = `<span class="ap-feedback-icon">~</span> ${result.partial || 0}/${exercise.items.length} corecte. +${result.xp} XP`;
            feedback.className = 'ap-feedback partial';
        }
        feedback.style.display = 'block';
    },

    restoreSchema: function(container, exercise, result) {
        const feedback = container.querySelector('.ap-feedback');
        const checkBtn = container.querySelector('.ap-check-btn');

        // Restore options to slots
        if (result.slotValues) {
            result.slotValues.forEach((value, idx) => {
                if (!value) return;
                const slot = container.querySelector(`[data-slot-idx="${idx}"]`);
                const opt = container.querySelector(`.ap-schema-option[data-value="${value}"]`);
                if (slot && opt) {
                    slot.innerHTML = '';
                    slot.appendChild(opt);

                    const slotContainer = slot.closest('.ap-schema-slot');
                    if (value === exercise.slots[idx].correct) {
                        slotContainer.classList.add('correct');
                    } else {
                        slotContainer.classList.add('incorrect');
                    }
                }
            });
        }

        if (checkBtn) {
            checkBtn.disabled = true;
            checkBtn.textContent = 'Verificat';
        }

        if (result.correct) {
            feedback.innerHTML = `<span class="ap-feedback-icon">✓</span> Excelent! +${result.xp} XP`;
            feedback.className = 'ap-feedback correct';
        } else {
            feedback.innerHTML = `<span class="ap-feedback-icon">~</span> ${result.partial || 0}/${exercise.slots.length} corecte. +${result.xp} XP`;
            feedback.className = 'ap-feedback partial';
        }
        feedback.style.display = 'block';
    },

    restoreWritten: function(container, exercise, result) {
        const textarea = container.querySelector('.ap-written-input');
        const submitBtn = container.querySelector('.ap-written-submit');
        const feedback = container.querySelector('.ap-feedback');

        if (textarea && result.writtenAnswer) {
            textarea.value = result.writtenAnswer;
            textarea.disabled = true;
            textarea.style.opacity = '0.8';
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Trimis';
        }

        const ratio = result.keywordsFound / (result.totalKeywords || 1);
        if (ratio >= 0.8) {
            feedback.innerHTML = `<span class="ap-feedback-icon">&#11088;</span> Excelent! +${result.xp} XP`;
            feedback.className = 'ap-feedback correct';
        } else if (ratio >= 0.5) {
            feedback.innerHTML = `<span class="ap-feedback-icon">&#10004;</span> Bine! +${result.xp} XP`;
            feedback.className = 'ap-feedback partial';
        } else {
            feedback.innerHTML = `<span class="ap-feedback-icon">~</span> Acceptat. +${result.xp} XP`;
            feedback.className = 'ap-feedback partial';
        }
        feedback.style.display = 'block';
    },

    /**
     * Render all exercises
     */
    renderAllExercises: function() {
        return this.exercises.map((ex, idx) => {
            switch(ex.type) {
                case 'synthesis': return this.renderSynthesis(ex, idx);
                case 'dragdrop': return this.renderDragDrop(ex, idx);
                case 'scenario': return this.renderScenario(ex, idx);
                case 'schema': return this.renderSchema(ex, idx);
                case 'written': return this.renderWritten(ex, idx);
                default: return '';
            }
        }).join('');
    },

    // ==================== SYNTHESIS QUIZ ====================
    renderSynthesis: function(ex, idx) {
        const options = ex.options.map((opt, i) => `
            <button class="ap-option" data-exercise="${idx}" data-answer="${String.fromCharCode(97 + i)}">
                <span class="ap-option-letter">${String.fromCharCode(65 + i)}</span>
                <span class="ap-option-text">${opt}</span>
            </button>
        `).join('');

        return `
            <div class="ap-exercise ap-synthesis" data-exercise-id="${idx}" data-type="synthesis">
                <div class="ap-exercise-header">
                    <span class="ap-exercise-badge ap-badge-synthesis">Sinteza</span>
                    <span class="ap-exercise-xp">+${this.xpRewards.synthesis.base} XP</span>
                </div>
                <p class="ap-question">${ex.question}</p>
                <div class="ap-options">${options}</div>
                <div class="ap-feedback" style="display: none;"></div>
            </div>
        `;
    },

    // ==================== DRAG & DROP ====================
    renderDragDrop: function(ex, idx) {
        // Shuffle items for display
        const shuffledItems = this.shuffle([...ex.items]);

        const items = shuffledItems.map(item => `
            <div class="ap-drag-item" draggable="true" data-item="${item.id}" data-correct="${item.category}">
                <span class="ap-drag-icon">${item.icon || '📦'}</span>
                <span class="ap-drag-label">${item.label}</span>
            </div>
        `).join('');

        const categories = ex.categories.map(cat => `
            <div class="ap-drop-zone" data-category="${cat.id}">
                <div class="ap-drop-header">
                    <span class="ap-drop-icon">${cat.icon || '📁'}</span>
                    <span class="ap-drop-label">${cat.label}</span>
                </div>
                <div class="ap-drop-items"></div>
            </div>
        `).join('');

        return `
            <div class="ap-exercise ap-dragdrop" data-exercise-id="${idx}" data-type="dragdrop">
                <div class="ap-exercise-header">
                    <span class="ap-exercise-badge ap-badge-dragdrop">Categorizare</span>
                    <span class="ap-exercise-xp">+${this.xpRewards.dragdrop.base} XP</span>
                </div>
                <p class="ap-question">${ex.question}</p>
                <div class="ap-drag-source">${items}</div>
                <div class="ap-drop-zones">${categories}</div>
                <button class="ap-check-btn" data-exercise="${idx}">Verifica</button>
                <div class="ap-feedback" style="display: none;"></div>
            </div>
        `;
    },

    // ==================== SCENARIO ====================
    renderScenario: function(ex, idx) {
        const choices = ex.choices.map((choice, i) => `
            <button class="ap-scenario-choice" data-exercise="${idx}" data-choice="${i}">
                <span class="ap-choice-icon">${choice.icon || '▶'}</span>
                <span class="ap-choice-text">${choice.text}</span>
            </button>
        `).join('');

        return `
            <div class="ap-exercise ap-scenario" data-exercise-id="${idx}" data-type="scenario">
                <div class="ap-exercise-header">
                    <span class="ap-exercise-badge ap-badge-scenario">Scenariu</span>
                    <span class="ap-exercise-xp">+${this.xpRewards.scenario.base} XP</span>
                </div>
                <div class="ap-scenario-box">
                    <div class="ap-scenario-icon">🎯</div>
                    <p class="ap-scenario-text">${ex.scenario}</p>
                </div>
                <p class="ap-question">${ex.question}</p>
                <div class="ap-scenario-choices">${choices}</div>
                <div class="ap-feedback" style="display: none;"></div>
            </div>
        `;
    },

    // ==================== SCHEMA COMPLETION ====================
    renderSchema: function(ex, idx) {
        // Create slots for the schema
        const slots = ex.slots.map((slot, i) => `
            <div class="ap-schema-slot" data-slot="${i}" data-correct="${slot.correct}">
                <div class="ap-slot-label">${slot.label}</div>
                <div class="ap-slot-drop" data-slot-idx="${i}">
                    <span class="ap-slot-placeholder">${slot.placeholder || 'Trage aici'}</span>
                </div>
            </div>
        `).join('');

        // Shuffle options
        const shuffledOptions = this.shuffle([...ex.options]);
        const options = shuffledOptions.map(opt => `
            <div class="ap-schema-option" draggable="true" data-value="${opt.value}">
                <span class="ap-schema-option-icon">${opt.icon || '🔹'}</span>
                <span class="ap-schema-option-text">${opt.label}</span>
            </div>
        `).join('');

        return `
            <div class="ap-exercise ap-schema" data-exercise-id="${idx}" data-type="schema">
                <div class="ap-exercise-header">
                    <span class="ap-exercise-badge ap-badge-schema">Completeaza Schema</span>
                    <span class="ap-exercise-xp">+${this.xpRewards.schema.base} XP</span>
                </div>
                <p class="ap-question">${ex.question}</p>
                <div class="ap-schema-container">
                    <div class="ap-schema-diagram">
                        ${ex.diagramHtml || ''}
                        <div class="ap-schema-slots">${slots}</div>
                    </div>
                    <div class="ap-schema-options">${options}</div>
                </div>
                <button class="ap-check-btn" data-exercise="${idx}">Verifica</button>
                <div class="ap-feedback" style="display: none;"></div>
            </div>
        `;
    },

    // ==================== WRITTEN ANSWER (BONUS) ====================
    renderWritten: function(ex, idx) {
        return `
            <div class="ap-exercise ap-written" data-exercise-id="${idx}" data-type="written">
                <div class="ap-exercise-header">
                    <span class="ap-exercise-badge ap-badge-written">Bonus - Raspuns Scris</span>
                    <span class="ap-exercise-xp">+${this.xpRewards.written.base}-${this.xpRewards.written.perfect} XP</span>
                </div>
                <div class="ap-written-intro">
                    <span class="ap-written-star">&#11088;</span>
                    <span>Pentru punctaj maxim, raspunde in propriile tale cuvinte:</span>
                </div>
                <p class="ap-question">${ex.question}</p>
                ${ex.context ? `<p class="ap-written-context">${ex.context}</p>` : ''}
                <div class="ap-written-hints">
                    <span class="ap-hint-label">Indicii pentru raspuns complet:</span>
                    <ul class="ap-hint-list">
                        ${(ex.hints || []).map(h => `<li>${h}</li>`).join('')}
                    </ul>
                </div>
                <textarea class="ap-written-input"
                    data-exercise="${idx}"
                    placeholder="Scrie raspunsul tau aici... (minim ${ex.minChars || 50} caractere)"
                    data-min-chars="${ex.minChars || 50}"
                    data-keywords='${JSON.stringify(ex.keywords || [])}'
                ></textarea>
                <div class="ap-written-counter">
                    <span class="ap-char-count">0</span> / ${ex.minChars || 50} caractere minime
                </div>
                <button class="ap-check-btn ap-written-submit" data-exercise="${idx}" disabled>Trimite raspunsul</button>
                <div class="ap-feedback" style="display: none;"></div>
            </div>
        `;
    },

    // ==================== EVENT LISTENERS ====================
    attachAllListeners: function() {
        // Synthesis quiz options
        document.querySelectorAll('.ap-synthesis .ap-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSynthesisAnswer(e));
        });

        // Scenario choices
        document.querySelectorAll('.ap-scenario-choice').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleScenarioChoice(e));
        });

        // Drag & drop
        this.initDragDrop();

        // Schema drag & drop
        this.initSchemaDragDrop();

        // Check buttons (for dragdrop, schema)
        document.querySelectorAll('.ap-check-btn:not(.ap-written-submit)').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCheckButton(e));
        });

        // Written answer textareas
        document.querySelectorAll('.ap-written-input').forEach(textarea => {
            textarea.addEventListener('input', (e) => this.handleWrittenInput(e));
        });

        // Written submit buttons
        document.querySelectorAll('.ap-written-submit').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleWrittenSubmit(e));
        });
    },

    handleWrittenInput: function(e) {
        const textarea = e.target;
        const container = textarea.closest('.ap-exercise');
        const submitBtn = container.querySelector('.ap-written-submit');
        const charCount = container.querySelector('.ap-char-count');
        const minChars = parseInt(textarea.dataset.minChars) || 50;

        const currentChars = textarea.value.length;
        charCount.textContent = currentChars;

        if (currentChars >= minChars) {
            submitBtn.disabled = false;
            charCount.style.color = 'var(--success, #22c55e)';
        } else {
            submitBtn.disabled = true;
            charCount.style.color = 'var(--text-secondary, #a0a0b0)';
        }
    },

    handleWrittenSubmit: function(e) {
        const btn = e.currentTarget;
        const exerciseIdx = parseInt(btn.dataset.exercise);
        const exercise = this.exercises[exerciseIdx];
        const container = btn.closest('.ap-exercise');
        const textarea = container.querySelector('.ap-written-input');
        const feedback = container.querySelector('.ap-feedback');

        // Lock if already submitted
        if (this.results[exerciseIdx] !== undefined) return;

        const answer = textarea.value.trim().toLowerCase();
        const originalAnswer = textarea.value.trim();  // Keep original for saving
        const keywords = exercise.keywords || [];
        const minChars = exercise.minChars || 50;

        // Check how many keywords are present
        let keywordsFound = 0;
        keywords.forEach(kw => {
            if (answer.includes(kw.toLowerCase())) {
                keywordsFound++;
            }
        });

        // Calculate score based on keywords found
        const keywordRatio = keywords.length > 0 ? keywordsFound / keywords.length : 0;
        const lengthBonus = answer.length >= minChars * 2 ? 0.2 : (answer.length >= minChars * 1.5 ? 0.1 : 0);
        const totalRatio = Math.min(1, keywordRatio + lengthBonus);

        const xpBase = this.xpRewards.written.base;
        const xpPerfect = this.xpRewards.written.perfect;
        const xpEarned = Math.round(xpBase + (xpPerfect - xpBase) * totalRatio);

        // Lock the textarea
        textarea.disabled = true;
        textarea.style.opacity = '0.8';
        btn.disabled = true;
        btn.textContent = 'Trimis';

        this.results[exerciseIdx] = {
            correct: keywordRatio >= 0.5,
            xp: xpEarned,
            keywordsFound,
            totalKeywords: keywords.length,
            writtenAnswer: originalAnswer,
            exerciseType: 'written'
        };

        // Show feedback
        if (totalRatio >= 0.8) {
            feedback.innerHTML = `<span class="ap-feedback-icon">&#11088;</span> Excelent! Raspuns complet si detaliat. +${xpEarned} XP`;
            feedback.className = 'ap-feedback correct';
        } else if (totalRatio >= 0.5) {
            feedback.innerHTML = `<span class="ap-feedback-icon">&#10004;</span> Bine! Ai acoperit ${keywordsFound}/${keywords.length} concepte cheie. +${xpEarned} XP`;
            feedback.className = 'ap-feedback partial';
        } else {
            feedback.innerHTML = `<span class="ap-feedback-icon">~</span> Raspunsul tau este acceptat dar incomplet. Ai mentionat ${keywordsFound}/${keywords.length} concepte. +${xpEarned} XP`;
            feedback.className = 'ap-feedback partial';
        }

        feedback.style.display = 'block';
        this.updateTotalScore();
        this.saveProgress();  // Save after submission
    },

    handleSynthesisAnswer: function(e) {
        const btn = e.currentTarget;
        const exerciseIdx = parseInt(btn.dataset.exercise);
        const answer = btn.dataset.answer;
        const exercise = this.exercises[exerciseIdx];
        const container = btn.closest('.ap-exercise');
        const feedback = container.querySelector('.ap-feedback');

        // Lock - no changes allowed after first answer
        if (this.results[exerciseIdx] !== undefined) return;

        // Lock all options immediately
        container.querySelectorAll('.ap-option').forEach(opt => {
            opt.classList.add('locked');
            opt.style.pointerEvents = 'none';
            opt.style.opacity = '0.6';
        });

        btn.classList.add('selected');
        btn.style.opacity = '1';
        const isCorrect = answer === exercise.correct;

        if (isCorrect) {
            btn.classList.add('correct');
            this.results[exerciseIdx] = {
                correct: true,
                xp: this.xpRewards.synthesis.perfect,
                selectedAnswer: answer,
                exerciseType: 'synthesis'
            };
            feedback.innerHTML = `<span class="ap-feedback-icon">&#10004;</span> Corect! ${exercise.explanation || ''} +${this.xpRewards.synthesis.perfect} XP`;
            feedback.className = 'ap-feedback correct';
        } else {
            btn.classList.add('incorrect');
            // Show correct answer
            const correctBtn = container.querySelector(`[data-answer="${exercise.correct}"]`);
            if (correctBtn) {
                correctBtn.classList.add('correct');
                correctBtn.style.opacity = '1';
            }

            this.results[exerciseIdx] = {
                correct: false,
                xp: 0,
                selectedAnswer: answer,
                exerciseType: 'synthesis'
            };
            feedback.innerHTML = `<span class="ap-feedback-icon">&#10060;</span> Incorect. ${exercise.explanation || 'Raspunsul corect este marcat cu verde.'} +0 XP`;
            feedback.className = 'ap-feedback incorrect';
        }

        feedback.style.display = 'block';
        this.updateTotalScore();
        this.saveProgress();  // Save after each answer
    },

    handleScenarioChoice: function(e) {
        const btn = e.currentTarget;
        const exerciseIdx = parseInt(btn.dataset.exercise);
        const choiceIdx = parseInt(btn.dataset.choice);
        const exercise = this.exercises[exerciseIdx];
        const container = btn.closest('.ap-exercise');
        const feedback = container.querySelector('.ap-feedback');

        // Lock - no changes allowed
        if (this.results[exerciseIdx] !== undefined) return;

        // Lock all choices immediately
        container.querySelectorAll('.ap-scenario-choice').forEach(ch => {
            ch.classList.add('locked');
            ch.style.pointerEvents = 'none';
            ch.style.opacity = '0.6';
        });

        btn.classList.add('selected');
        btn.style.opacity = '1';
        const isCorrect = choiceIdx === exercise.correctChoice;

        if (isCorrect) {
            btn.classList.add('correct');
            this.results[exerciseIdx] = {
                correct: true,
                xp: this.xpRewards.scenario.perfect,
                selectedChoice: choiceIdx,
                exerciseType: 'scenario'
            };
            feedback.innerHTML = `<span class="ap-feedback-icon">&#10004;</span> Excelent! ${exercise.choices[choiceIdx].feedback || exercise.explanation || ''} +${this.xpRewards.scenario.perfect} XP`;
            feedback.className = 'ap-feedback correct';
        } else {
            btn.classList.add('incorrect');
            // Show correct choice
            const correctBtn = container.querySelectorAll('.ap-scenario-choice')[exercise.correctChoice];
            if (correctBtn) {
                correctBtn.classList.add('correct');
                correctBtn.style.opacity = '1';
            }

            this.results[exerciseIdx] = {
                correct: false,
                xp: 0,
                selectedChoice: choiceIdx,
                exerciseType: 'scenario'
            };
            feedback.innerHTML = `<span class="ap-feedback-icon">&#10060;</span> ${exercise.choices[choiceIdx].feedback || 'Varianta corecta este marcata cu verde.'} +0 XP`;
            feedback.className = 'ap-feedback incorrect';
        }

        feedback.style.display = 'block';
        this.updateTotalScore();
        this.saveProgress();  // Save after each answer
    },

    initDragDrop: function() {
        const self = this;

        document.querySelectorAll('.ap-dragdrop').forEach(container => {
            const items = container.querySelectorAll('.ap-drag-item');
            const zones = container.querySelectorAll('.ap-drop-zone');
            const source = container.querySelector('.ap-drag-source');

            items.forEach(item => {
                item.addEventListener('dragstart', function(e) {
                    e.dataTransfer.setData('text/plain', this.dataset.item);
                    this.classList.add('dragging');
                });

                item.addEventListener('dragend', function() {
                    this.classList.remove('dragging');
                });
            });

            zones.forEach(zone => {
                const dropArea = zone.querySelector('.ap-drop-items');

                zone.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    this.classList.add('drag-over');
                });

                zone.addEventListener('dragleave', function() {
                    this.classList.remove('drag-over');
                });

                zone.addEventListener('drop', function(e) {
                    e.preventDefault();
                    this.classList.remove('drag-over');

                    const itemId = e.dataTransfer.getData('text/plain');
                    const item = container.querySelector(`[data-item="${itemId}"]`);

                    if (item && dropArea) {
                        dropArea.appendChild(item);
                    }
                });
            });

            // Allow dropping back to source
            source.addEventListener('dragover', function(e) {
                e.preventDefault();
            });

            source.addEventListener('drop', function(e) {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('text/plain');
                const item = container.querySelector(`[data-item="${itemId}"]`);
                if (item) {
                    source.appendChild(item);
                }
            });
        });
    },

    initSchemaDragDrop: function() {
        const self = this;

        document.querySelectorAll('.ap-schema').forEach(container => {
            const options = container.querySelectorAll('.ap-schema-option');
            const slots = container.querySelectorAll('.ap-slot-drop');
            const optionsContainer = container.querySelector('.ap-schema-options');

            options.forEach(opt => {
                opt.addEventListener('dragstart', function(e) {
                    e.dataTransfer.setData('text/plain', this.dataset.value);
                    this.classList.add('dragging');
                });

                opt.addEventListener('dragend', function() {
                    this.classList.remove('dragging');
                });
            });

            slots.forEach(slot => {
                slot.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    this.classList.add('drag-over');
                });

                slot.addEventListener('dragleave', function() {
                    this.classList.remove('drag-over');
                });

                slot.addEventListener('drop', function(e) {
                    e.preventDefault();
                    this.classList.remove('drag-over');

                    const value = e.dataTransfer.getData('text/plain');
                    const opt = container.querySelector(`.ap-schema-option[data-value="${value}"]`);

                    // Remove existing option in slot
                    const existingOpt = this.querySelector('.ap-schema-option');
                    if (existingOpt) {
                        optionsContainer.appendChild(existingOpt);
                    }

                    if (opt) {
                        this.innerHTML = '';
                        this.appendChild(opt);
                    }
                });
            });

            // Allow dropping back to options area
            optionsContainer.addEventListener('dragover', function(e) {
                e.preventDefault();
            });

            optionsContainer.addEventListener('drop', function(e) {
                e.preventDefault();
                const value = e.dataTransfer.getData('text/plain');
                const opt = container.querySelector(`.ap-schema-option[data-value="${value}"]`);
                if (opt) {
                    optionsContainer.appendChild(opt);
                }
            });
        });
    },

    handleCheckButton: function(e) {
        const btn = e.currentTarget;
        const exerciseIdx = parseInt(btn.dataset.exercise);
        const exercise = this.exercises[exerciseIdx];
        const container = btn.closest('.ap-exercise');
        const type = container.dataset.type;

        if (this.results[exerciseIdx] !== undefined) return;

        if (type === 'dragdrop') {
            this.checkDragDrop(exerciseIdx, container, exercise);
        } else if (type === 'schema') {
            this.checkSchema(exerciseIdx, container, exercise);
        }

        btn.disabled = true;
        btn.textContent = 'Verificat';
    },

    checkDragDrop: function(exerciseIdx, container, exercise) {
        const feedback = container.querySelector('.ap-feedback');
        let correctCount = 0;
        let totalItems = exercise.items.length;
        const itemPositions = {};

        exercise.items.forEach(item => {
            const itemEl = container.querySelector(`[data-item="${item.id}"]`);
            if (!itemEl) return;

            const parentZone = itemEl.closest('.ap-drop-zone');
            const isCorrect = parentZone && parentZone.dataset.category === item.category;

            // Save position for restoration
            if (parentZone) {
                itemPositions[item.id] = parentZone.dataset.category;
            }

            if (isCorrect) {
                itemEl.classList.add('correct');
                correctCount++;
            } else {
                itemEl.classList.add('incorrect');
            }
        });

        const allCorrect = correctCount === totalItems;
        const xp = allCorrect ? this.xpRewards.dragdrop.perfect :
                   (correctCount > 0 ? Math.round(this.xpRewards.dragdrop.base * (correctCount / totalItems)) : 0);

        this.results[exerciseIdx] = {
            correct: allCorrect,
            xp,
            partial: correctCount,
            itemPositions: itemPositions,
            exerciseType: 'dragdrop'
        };

        if (allCorrect) {
            feedback.innerHTML = `<span class="ap-feedback-icon">✓</span> Perfect! Toate elementele sunt in categoria corecta. +${xp} XP`;
            feedback.className = 'ap-feedback correct';
        } else {
            feedback.innerHTML = `<span class="ap-feedback-icon">~</span> ${correctCount}/${totalItems} corecte. ${exercise.explanation || ''} +${xp} XP`;
            feedback.className = 'ap-feedback partial';
        }

        feedback.style.display = 'block';
        this.updateTotalScore();
        this.saveProgress();  // Save after verification
    },

    checkSchema: function(exerciseIdx, container, exercise) {
        const feedback = container.querySelector('.ap-feedback');
        const slots = container.querySelectorAll('.ap-slot-drop');
        let correctCount = 0;
        const slotValues = [];

        slots.forEach((slot, idx) => {
            const expectedValue = exercise.slots[idx].correct;
            const placedOption = slot.querySelector('.ap-schema-option');
            const placedValue = placedOption ? placedOption.dataset.value : null;

            // Save slot value for restoration
            slotValues.push(placedValue);

            const slotContainer = slot.closest('.ap-schema-slot');

            if (placedValue === expectedValue) {
                slotContainer.classList.add('correct');
                correctCount++;
            } else {
                slotContainer.classList.add('incorrect');
            }
        });

        const allCorrect = correctCount === exercise.slots.length;
        const xp = allCorrect ? this.xpRewards.schema.perfect :
                   (correctCount > 0 ? Math.round(this.xpRewards.schema.base * (correctCount / exercise.slots.length)) : 0);

        this.results[exerciseIdx] = {
            correct: allCorrect,
            xp,
            partial: correctCount,
            slotValues: slotValues,
            exerciseType: 'schema'
        };

        if (allCorrect) {
            feedback.innerHTML = `<span class="ap-feedback-icon">✓</span> Excelent! Schema este completa si corecta. +${xp} XP`;
            feedback.className = 'ap-feedback correct';
        } else {
            feedback.innerHTML = `<span class="ap-feedback-icon">~</span> ${correctCount}/${exercise.slots.length} corecte. ${exercise.explanation || ''} +${xp} XP`;
            feedback.className = 'ap-feedback partial';
        }

        feedback.style.display = 'block';
        this.updateTotalScore();
        this.saveProgress();  // Save after verification
    },

    // ==================== SCORING ====================
    updateTotalScore: function() {
        let totalXP = 0;
        let completed = 0;
        let correct = 0;

        for (const idx in this.results) {
            completed++;
            totalXP += this.results[idx].xp || 0;
            if (this.results[idx].correct) correct++;
        }

        this.totalScore = totalXP;

        // Update score display
        const scoreEl = document.getElementById('practice-score');
        if (scoreEl) {
            scoreEl.textContent = `${totalXP} XP`;
        }

        const progressEl = document.getElementById('practice-progress');
        if (progressEl) {
            progressEl.textContent = `${completed}/${this.exercises.length} exercitii`;
        }

        // Dispatch event for RPG system integration
        document.dispatchEvent(new CustomEvent('practiceProgress', {
            detail: {
                lessonId: this.lessonId,
                completed,
                total: this.exercises.length,
                correct,
                xp: totalXP
            }
        }));

        // If all completed, trigger completion
        if (completed === this.exercises.length) {
            this.onPracticeComplete(totalXP, correct);
        }
    },

    onPracticeComplete: function(totalXP, correctCount) {
        // Award XP through RPG system if available
        if (typeof RPG !== 'undefined' && RPG.addXP) {
            RPG.addXP(totalXP, 'Practica avansata');
        }

        // Save to localStorage
        const key = `practice-${this.lessonId}`;
        localStorage.setItem(key, JSON.stringify({
            completed: true,
            xp: totalXP,
            correct: correctCount,
            total: this.exercises.length,
            timestamp: Date.now()
        }));

        // Dispatch completion event
        document.dispatchEvent(new CustomEvent('practiceComplete', {
            detail: {
                lessonId: this.lessonId,
                xp: totalXP,
                correct: correctCount,
                total: this.exercises.length,
                percentage: Math.round((correctCount / this.exercises.length) * 100)
            }
        }));
    },

    // ==================== UTILITIES ====================
    shuffle: function(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    getResults: function() {
        return {
            lessonId: this.lessonId,
            results: this.results,
            totalXP: this.totalScore,
            completed: Object.keys(this.results).length,
            total: this.exercises.length
        };
    },

    // ==================== STYLES ====================
    injectStyles: function() {
        if (document.getElementById('advanced-practice-styles')) return;

        const style = document.createElement('style');
        style.id = 'advanced-practice-styles';
        style.textContent = `
            /* Exercise Container */
            .ap-exercise {
                background: var(--bg-card, #1a1a2e);
                border: 2px solid var(--border-color, #2a2a4a);
                border-radius: 16px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
                transition: all 0.3s ease;
            }

            .ap-exercise-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .ap-exercise-badge {
                padding: 0.35rem 0.85rem;
                border-radius: 50px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .ap-badge-synthesis { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }
            .ap-badge-dragdrop { background: rgba(6, 182, 212, 0.2); color: #22d3ee; }
            .ap-badge-scenario { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
            .ap-badge-schema { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
            .ap-badge-written { background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.2)); color: #fbbf24; }

            .ap-exercise-xp {
                font-size: 0.85rem;
                font-weight: 600;
                color: var(--success, #22c55e);
            }

            .ap-question {
                font-size: 1.1rem;
                font-weight: 500;
                margin-bottom: 1rem;
                color: var(--text-primary, #fff);
                line-height: 1.5;
            }

            /* Synthesis Options */
            .ap-options {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .ap-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.85rem 1rem;
                background: var(--bg-primary, #0a0a12);
                border: 2px solid var(--border-color, #2a2a4a);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
                width: 100%;
                color: var(--text-primary, #fff);
            }

            .ap-option:hover { border-color: var(--accent-blue, #3b82f6); }
            .ap-option.selected { border-color: var(--accent-blue, #3b82f6); background: rgba(59, 130, 246, 0.1); }
            .ap-option.correct { border-color: var(--success, #22c55e); background: rgba(34, 197, 94, 0.15); }
            .ap-option.incorrect { border-color: var(--error, #ef4444); background: rgba(239, 68, 68, 0.15); }

            .ap-option-letter {
                width: 28px;
                height: 28px;
                background: var(--bg-card, #1a1a2e);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 0.85rem;
                flex-shrink: 0;
            }

            .ap-option.correct .ap-option-letter { background: var(--success, #22c55e); color: white; }
            .ap-option.incorrect .ap-option-letter { background: var(--error, #ef4444); color: white; }

            /* Drag & Drop */
            .ap-drag-source {
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
                padding: 1rem;
                background: var(--bg-primary, #0a0a12);
                border-radius: 12px;
                margin-bottom: 1rem;
                min-height: 60px;
            }

            .ap-drag-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1rem;
                background: var(--bg-card, #1a1a2e);
                border: 2px solid var(--border-color, #2a2a4a);
                border-radius: 8px;
                cursor: grab;
                transition: all 0.2s ease;
                user-select: none;
            }

            .ap-drag-item:hover { border-color: var(--accent-blue, #3b82f6); transform: translateY(-2px); }
            .ap-drag-item.dragging { opacity: 0.5; cursor: grabbing; }
            .ap-drag-item.correct { border-color: var(--success, #22c55e); background: rgba(34, 197, 94, 0.15); }
            .ap-drag-item.incorrect { border-color: var(--error, #ef4444); background: rgba(239, 68, 68, 0.15); }

            .ap-drag-icon { font-size: 1.25rem; }
            .ap-drag-label { font-size: 0.9rem; color: var(--text-primary, #fff); }

            .ap-drop-zones {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }

            .ap-drop-zone {
                background: var(--bg-primary, #0a0a12);
                border: 2px dashed var(--border-color, #2a2a4a);
                border-radius: 12px;
                padding: 1rem;
                min-height: 150px;
                transition: all 0.2s ease;
            }

            .ap-drop-zone.drag-over {
                border-color: var(--accent-blue, #3b82f6);
                background: rgba(59, 130, 246, 0.05);
            }

            .ap-drop-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.75rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid var(--border-color, #2a2a4a);
            }

            .ap-drop-icon { font-size: 1.25rem; }
            .ap-drop-label { font-weight: 600; color: var(--accent-blue-light, #60a5fa); }

            .ap-drop-items {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            /* Scenario */
            .ap-scenario-box {
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.05));
                border: 1px solid var(--warning, #f59e0b);
                border-radius: 12px;
                padding: 1.25rem;
                margin-bottom: 1rem;
                display: flex;
                gap: 1rem;
                align-items: flex-start;
            }

            .ap-scenario-icon { font-size: 2rem; }
            .ap-scenario-text { color: var(--text-secondary, #a0a0b0); line-height: 1.6; flex: 1; }

            .ap-scenario-choices {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .ap-scenario-choice {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem;
                background: var(--bg-primary, #0a0a12);
                border: 2px solid var(--border-color, #2a2a4a);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
                width: 100%;
                color: var(--text-primary, #fff);
            }

            .ap-scenario-choice:hover { border-color: var(--warning, #f59e0b); }
            .ap-scenario-choice.selected { border-color: var(--warning, #f59e0b); }
            .ap-scenario-choice.correct { border-color: var(--success, #22c55e); background: rgba(34, 197, 94, 0.15); }
            .ap-scenario-choice.incorrect { border-color: var(--error, #ef4444); background: rgba(239, 68, 68, 0.15); }

            .ap-choice-icon { font-size: 1.25rem; }

            /* Schema */
            .ap-schema-container {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 1.5rem;
                align-items: start;
            }

            @media (max-width: 768px) {
                .ap-schema-container {
                    grid-template-columns: 1fr;
                }
            }

            .ap-schema-diagram {
                background: var(--bg-primary, #0a0a12);
                border-radius: 12px;
                padding: 1.5rem;
            }

            .ap-schema-slots {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .ap-schema-slot {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.5rem;
                border-radius: 8px;
                transition: all 0.2s ease;
            }

            .ap-schema-slot.correct { background: rgba(34, 197, 94, 0.15); }
            .ap-schema-slot.incorrect { background: rgba(239, 68, 68, 0.15); }

            .ap-slot-label {
                min-width: 120px;
                font-weight: 500;
                color: var(--text-secondary, #a0a0b0);
            }

            .ap-slot-drop {
                flex: 1;
                min-height: 50px;
                background: var(--bg-card, #1a1a2e);
                border: 2px dashed var(--border-color, #2a2a4a);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .ap-slot-drop.drag-over {
                border-color: var(--accent-blue, #3b82f6);
                background: rgba(59, 130, 246, 0.1);
            }

            .ap-slot-placeholder {
                color: var(--text-secondary, #a0a0b0);
                font-size: 0.85rem;
                opacity: 0.6;
            }

            .ap-schema-options {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                min-width: 180px;
            }

            .ap-schema-option {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                background: var(--bg-card, #1a1a2e);
                border: 2px solid var(--border-color, #2a2a4a);
                border-radius: 8px;
                cursor: grab;
                transition: all 0.2s ease;
            }

            .ap-schema-option:hover { border-color: var(--success, #22c55e); }
            .ap-schema-option.dragging { opacity: 0.5; }

            .ap-schema-option-icon { font-size: 1.1rem; }
            .ap-schema-option-text { font-size: 0.9rem; }

            /* Check Button */
            .ap-check-btn {
                margin-top: 1rem;
                padding: 0.75rem 1.5rem;
                background: var(--accent-blue, #3b82f6);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .ap-check-btn:hover { background: var(--accent-blue-light, #60a5fa); }
            .ap-check-btn:disabled { opacity: 0.5; cursor: not-allowed; }

            /* Feedback */
            .ap-feedback {
                margin-top: 1rem;
                padding: 1rem;
                border-radius: 10px;
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                font-size: 0.95rem;
                line-height: 1.5;
            }

            .ap-feedback.correct {
                background: rgba(34, 197, 94, 0.15);
                border: 1px solid var(--success, #22c55e);
                color: var(--success, #22c55e);
            }

            .ap-feedback.incorrect {
                background: rgba(239, 68, 68, 0.15);
                border: 1px solid var(--error, #ef4444);
                color: var(--error, #ef4444);
            }

            .ap-feedback.partial {
                background: rgba(245, 158, 11, 0.15);
                border: 1px solid var(--warning, #f59e0b);
                color: var(--warning, #f59e0b);
            }

            .ap-feedback-icon {
                font-size: 1.1rem;
                flex-shrink: 0;
            }

            /* Score Display */
            .ap-score-display {
                background: linear-gradient(135deg, var(--bg-card, #1a1a2e), var(--bg-primary, #0a0a12));
                border: 2px solid var(--success, #22c55e);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .ap-score-label {
                color: var(--text-secondary, #a0a0b0);
                font-size: 0.9rem;
            }

            .ap-score-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--success, #22c55e);
            }

            /* Written Answer Styles */
            .ap-written {
                border-color: var(--warning, #f59e0b);
            }

            .ap-written-intro {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1));
                border: 1px solid var(--warning, #f59e0b);
                border-radius: 8px;
                padding: 0.75rem 1rem;
                margin-bottom: 1rem;
                color: var(--warning, #f59e0b);
                font-weight: 500;
            }

            .ap-written-star {
                font-size: 1.25rem;
            }

            .ap-written-context {
                color: var(--text-secondary, #a0a0b0);
                font-size: 0.9rem;
                font-style: italic;
                margin-bottom: 1rem;
            }

            .ap-written-hints {
                background: var(--bg-primary, #0a0a12);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .ap-hint-label {
                font-size: 0.85rem;
                color: var(--text-secondary, #a0a0b0);
                display: block;
                margin-bottom: 0.5rem;
            }

            .ap-hint-list {
                margin: 0;
                padding-left: 1.25rem;
                color: var(--text-secondary, #a0a0b0);
                font-size: 0.9rem;
            }

            .ap-hint-list li {
                margin-bottom: 0.25rem;
            }

            .ap-written-input {
                width: 100%;
                min-height: 120px;
                padding: 1rem;
                background: var(--bg-primary, #0a0a12);
                border: 2px solid var(--border-color, #2a2a4a);
                border-radius: 10px;
                color: var(--text-primary, #fff);
                font-family: inherit;
                font-size: 0.95rem;
                line-height: 1.6;
                resize: vertical;
                transition: border-color 0.2s ease;
            }

            .ap-written-input:focus {
                outline: none;
                border-color: var(--warning, #f59e0b);
            }

            .ap-written-input:disabled {
                cursor: not-allowed;
            }

            .ap-written-counter {
                text-align: right;
                font-size: 0.8rem;
                color: var(--text-secondary, #a0a0b0);
                margin-top: 0.5rem;
                margin-bottom: 1rem;
            }

            .ap-char-count {
                font-weight: 600;
            }

            .ap-written-submit {
                background: linear-gradient(135deg, var(--warning, #f59e0b), #d97706);
            }

            .ap-written-submit:hover:not(:disabled) {
                background: linear-gradient(135deg, #fbbf24, var(--warning, #f59e0b));
            }

            /* Locked state for options */
            .ap-option.locked,
            .ap-scenario-choice.locked {
                cursor: not-allowed;
            }
        `;

        document.head.appendChild(style);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedPractice;
}
