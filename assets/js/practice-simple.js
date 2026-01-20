/**
 * Simple Practice System for LearningHub
 * =======================================
 * Works with existing static HTML practice sections
 * Adds text inputs and saves answers for teacher review
 *
 * Features:
 * - Adds textareas to existing .practice-exercise divs
 * - Auto-save to localStorage
 * - Integration with LessonSummary for JSON export
 * - Progress tracking per exercise
 *
 * Usage:
 *   PracticeSimple.init('lesson-id');
 */

const PracticeSimple = {
    lessonId: null,
    exercises: [],
    answers: {},

    /**
     * Initialize the practice system
     * @param {string} lessonId - Unique lesson identifier
     */
    init: function(lessonId) {
        this.lessonId = lessonId;
        this.loadProgress();
        this.setupExercises();
        this.injectStyles();

        console.log('PracticeSimple: Initialized for', lessonId);
    },

    /**
     * Find and setup all practice exercises
     */
    setupExercises: function() {
        // Find the practice section
        const container = document.querySelector('.practice-advanced, #practice-advanced');
        if (!container) {
            console.log('PracticeSimple: No practice section found');
            return;
        }

        const exerciseEls = container.querySelectorAll('.practice-exercise');

        exerciseEls.forEach((el, idx) => {
            const exerciseId = `exercise-${idx}`;
            el.setAttribute('data-exercise-id', exerciseId);

            // Get exercise title
            const titleEl = el.querySelector('h4');
            const title = titleEl ? titleEl.textContent.trim() : `Exercitiu ${idx + 1}`;

            // Store exercise info
            this.exercises.push({
                id: exerciseId,
                element: el,
                title: title
            });

            // Add textarea if not already present
            if (!el.querySelector('.ps-textarea')) {
                this.addTextarea(el, exerciseId, title);
            }
        });

        // Add progress header
        this.addProgressHeader(container);

        // Update completion status display
        this.updateCompletionDisplay();

        // Dispatch initial event
        this.dispatchProgressEvent();
    },

    /**
     * Add progress header to practice section
     */
    addProgressHeader: function(container) {
        const header = container.querySelector('.practice-advanced-header');
        if (!header) return;

        // Check if progress already exists
        if (container.querySelector('.ps-progress')) return;

        const progressEl = document.createElement('div');
        progressEl.className = 'ps-progress';
        header.parentNode.insertBefore(progressEl, header.nextSibling);
    },

    /**
     * Add a textarea and save button to an exercise
     */
    addTextarea: function(el, exerciseId, title) {
        const savedAnswer = this.answers[exerciseId] || '';
        const isSaved = savedAnswer.length >= 10;

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'ps-input-wrapper';
        inputWrapper.innerHTML = `
            <div class="ps-input-header">
                <label for="ps-textarea-${exerciseId}">Raspunsul tau:</label>
                <span class="ps-char-count" id="ps-charcount-${exerciseId}">${savedAnswer.length} caractere</span>
            </div>
            <textarea
                id="ps-textarea-${exerciseId}"
                class="ps-textarea"
                placeholder="Scrie raspunsul tau aici... (minim 10 caractere pentru a fi considerat complet)"
                rows="5"
            >${this.escapeHtml(savedAnswer)}</textarea>
            <div class="ps-actions">
                <button type="button" class="ps-save-btn ${isSaved ? 'saved' : ''}" id="ps-savebtn-${exerciseId}">
                    ${isSaved ? '&#10004; Salvat' : '&#128190; Salveaza raspunsul'}
                </button>
                <span class="ps-status" id="ps-status-${exerciseId}">
                    ${isSaved ? 'Raspuns salvat!' : 'Nesalvat'}
                </span>
            </div>
        `;

        el.appendChild(inputWrapper);

        // Setup event listeners
        const textarea = inputWrapper.querySelector('textarea');
        const charCount = inputWrapper.querySelector('.ps-char-count');
        const saveBtn = inputWrapper.querySelector('.ps-save-btn');
        const statusEl = inputWrapper.querySelector('.ps-status');

        // Update char count on input
        textarea.addEventListener('input', () => {
            const count = textarea.value.length;
            charCount.textContent = `${count} caractere`;

            // Visual feedback for minimum
            if (count >= 10) {
                charCount.classList.add('sufficient');
            } else {
                charCount.classList.remove('sufficient');
            }

            // Mark as unsaved if changed
            if (textarea.value !== this.answers[exerciseId]) {
                saveBtn.classList.remove('saved');
                saveBtn.innerHTML = '&#128190; Salveaza raspunsul';
                statusEl.textContent = 'Modificari nesalvate';
                statusEl.classList.add('unsaved');
            }
        });

        // Save button click
        saveBtn.addEventListener('click', () => {
            this.saveAnswer(exerciseId, textarea.value);
            this.showSaved(saveBtn, statusEl);
        });

        // Auto-save on blur
        textarea.addEventListener('blur', () => {
            if (textarea.value.length > 0 && textarea.value !== this.answers[exerciseId]) {
                this.saveAnswer(exerciseId, textarea.value);
                this.showSaved(saveBtn, statusEl, 'Salvat automat');
            }
        });
    },

    /**
     * Show saved state
     */
    showSaved: function(saveBtn, statusEl, message = 'Raspuns salvat!') {
        saveBtn.classList.add('saved');
        saveBtn.innerHTML = '&#10004; Salvat';
        statusEl.textContent = message;
        statusEl.classList.remove('unsaved');
    },

    /**
     * Escape HTML for safe display
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Save an answer
     */
    saveAnswer: function(exerciseId, answer) {
        this.answers[exerciseId] = answer;
        this.saveProgress();
        this.updateCompletionDisplay();
        this.dispatchProgressEvent();
    },

    /**
     * Save all progress to localStorage
     */
    saveProgress: function() {
        const key = `practice-${this.lessonId}`;
        const status = this.getCompletionStatus();

        const data = {
            lessonId: this.lessonId,
            answers: this.answers,
            completed: status.isComplete,
            correct: status.completed,  // Each completed exercise counts as "correct"
            total: status.total,
            xp: status.completed * 15,  // 15 XP per exercise
            timestamp: Date.now(),
            version: 2
        };

        localStorage.setItem(key, JSON.stringify(data));
    },

    /**
     * Load progress from localStorage
     */
    loadProgress: function() {
        const key = `practice-${this.lessonId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.answers = data.answers || {};
            } catch (e) {
                this.answers = {};
            }
        }
    },

    /**
     * Get completion status
     */
    getCompletionStatus: function() {
        const total = this.exercises.length;
        let completed = 0;

        this.exercises.forEach(ex => {
            const answer = this.answers[ex.id];
            if (answer && answer.trim().length >= 10) {
                completed++;
            }
        });

        return {
            total: total,
            completed: completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
            isComplete: completed >= total && total > 0
        };
    },

    /**
     * Update the completion display
     */
    updateCompletionDisplay: function() {
        const container = document.querySelector('.practice-advanced, #practice-advanced');
        if (!container) return;

        const status = this.getCompletionStatus();
        const progressEl = container.querySelector('.ps-progress');

        if (progressEl) {
            progressEl.innerHTML = `
                <div class="ps-progress-bar">
                    <div class="ps-progress-fill" style="width: ${status.percentage}%"></div>
                </div>
                <div class="ps-progress-text">
                    ${status.completed}/${status.total} exercitii completate
                    ${status.isComplete ? '<span class="ps-complete-badge">&#10004; Complet!</span>' : ''}
                </div>
            `;
        }

        // Mark exercises as complete/incomplete visually
        this.exercises.forEach(ex => {
            const answer = this.answers[ex.id];
            const isComplete = answer && answer.trim().length >= 10;
            ex.element.classList.toggle('exercise-complete', isComplete);
        });
    },

    /**
     * Dispatch progress event for LessonSummary integration
     */
    dispatchProgressEvent: function() {
        const status = this.getCompletionStatus();

        const eventData = {
            lessonId: this.lessonId,
            data: {
                correct: status.completed,
                total: status.total,
                completed: status.isComplete,
                xp: status.completed * 15,
                percentage: status.percentage
            }
        };

        document.dispatchEvent(new CustomEvent('practiceProgressSaved', {
            detail: eventData
        }));
    },

    /**
     * Get all answers for JSON export (used by LessonSummary)
     */
    getWrittenAnswers: function() {
        const result = [];

        this.exercises.forEach(ex => {
            const answer = this.answers[ex.id] || '';
            result.push({
                exerciseId: ex.id,
                exerciseTitle: ex.title,
                studentWrittenAnswer: answer,
                charCount: answer.length,
                isComplete: answer.trim().length >= 10,
                requiresTeacherEvaluation: true
            });
        });

        return result;
    },

    /**
     * Reset all practice progress
     */
    reset: function() {
        this.answers = {};
        const key = `practice-${this.lessonId}`;
        localStorage.removeItem(key);

        // Reset UI
        this.exercises.forEach(ex => {
            const textarea = ex.element.querySelector('textarea');
            if (textarea) textarea.value = '';

            const saveBtn = ex.element.querySelector('.ps-save-btn');
            if (saveBtn) {
                saveBtn.classList.remove('saved');
                saveBtn.innerHTML = '&#128190; Salveaza raspunsul';
            }

            const statusEl = ex.element.querySelector('.ps-status');
            if (statusEl) {
                statusEl.textContent = 'Nesalvat';
                statusEl.classList.remove('unsaved');
            }

            ex.element.classList.remove('exercise-complete');
        });

        this.updateCompletionDisplay();
        this.dispatchProgressEvent();
    },

    /**
     * Inject CSS styles
     */
    injectStyles: function() {
        if (document.getElementById('practice-simple-styles')) return;

        const style = document.createElement('style');
        style.id = 'practice-simple-styles';
        style.textContent = `
            .ps-input-wrapper {
                margin-top: 1.25rem;
                padding-top: 1.25rem;
                border-top: 1px dashed var(--border-color, #2a2a4a);
            }

            .ps-input-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .ps-input-header label {
                font-weight: 600;
                color: var(--text-primary, #fff);
                font-size: 0.95rem;
            }

            .ps-char-count {
                font-size: 0.8rem;
                color: var(--text-secondary, #a0a0b0);
                transition: color 0.2s ease;
            }

            .ps-char-count.sufficient {
                color: var(--success, #22c55e);
            }

            .ps-textarea {
                width: 100%;
                min-height: 120px;
                padding: 0.875rem;
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

            .ps-textarea:focus {
                outline: none;
                border-color: var(--accent-purple, #8b5cf6);
            }

            .ps-textarea::placeholder {
                color: var(--text-secondary, #a0a0b0);
                opacity: 0.6;
            }

            .ps-actions {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-top: 0.75rem;
            }

            .ps-save-btn {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1.25rem;
                background: var(--accent-purple, #8b5cf6);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .ps-save-btn:hover {
                background: #a78bfa;
                transform: translateY(-1px);
            }

            .ps-save-btn.saved {
                background: var(--success, #22c55e);
            }

            .ps-status {
                font-size: 0.85rem;
                color: var(--text-secondary, #a0a0b0);
            }

            .ps-status.unsaved {
                color: var(--warning, #f59e0b);
            }

            .ps-progress {
                background: var(--bg-card, #1a1a2e);
                border-radius: 10px;
                padding: 1rem 1.25rem;
                margin-bottom: 1.25rem;
            }

            .ps-progress-bar {
                height: 10px;
                background: var(--bg-primary, #0a0a12);
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }

            .ps-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--accent-purple, #8b5cf6), var(--success, #22c55e));
                border-radius: 5px;
                transition: width 0.4s ease;
            }

            .ps-progress-text {
                font-size: 0.9rem;
                color: var(--text-secondary, #a0a0b0);
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .ps-complete-badge {
                color: var(--success, #22c55e);
                font-weight: 600;
            }

            .practice-exercise.exercise-complete {
                border-color: var(--success, #22c55e) !important;
                background: rgba(34, 197, 94, 0.05) !important;
            }

            .practice-exercise.exercise-complete h4::after {
                content: ' \\2714';
                color: var(--success, #22c55e);
                margin-left: 0.5rem;
            }
        `;

        document.head.appendChild(style);
    }
};

// Make it work as AdvancedPractice for LessonSummary compatibility
// Override if no complex AdvancedPractice is initialized
window.addEventListener('DOMContentLoaded', function() {
    // If AdvancedPractice hasn't been initialized with exercises, use PracticeSimple
    setTimeout(function() {
        if (typeof AdvancedPractice !== 'undefined' &&
            (!AdvancedPractice.exercises || AdvancedPractice.exercises.length === 0)) {
            // Proxy getResults to PracticeSimple
            AdvancedPractice.getResults = function() {
                const status = PracticeSimple.getCompletionStatus();
                return {
                    completed: status.completed,
                    total: status.total,
                    totalXP: status.completed * 15
                };
            };
        }
    }, 100);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PracticeSimple;
}
