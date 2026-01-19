/**
 * LearningHub Sequential Lesson Locking
 * ======================================
 * Hard-locks lessons in sequence. Lesson N+1 is inaccessible
 * until lesson N is completed via PoW checkpoint.
 *
 * Used on module index pages.
 *
 * @version 1.0.0
 * @depends storage.js
 */

const SequentialLocking = {
    // Module context
    moduleId: null,
    gradeId: null,
    sequential: false,

    // Lesson data
    lessons: [],

    /**
     * Initialize sequential locking on a module page
     * @param {Object} options - { gradeId, moduleId, sequential, lessons }
     */
    init(options = {}) {
        // Try to detect from data attributes
        const container = document.querySelector('[data-module-id]');
        if (container) {
            this.moduleId = container.getAttribute('data-module-id');
            this.gradeId = container.getAttribute('data-grade-id') || this.detectGrade();
            this.sequential = container.getAttribute('data-sequential') === 'true';
        }

        // Override with options
        if (options.moduleId) this.moduleId = options.moduleId;
        if (options.gradeId) this.gradeId = options.gradeId;
        if (options.sequential !== undefined) this.sequential = options.sequential;

        // Check teacher mode
        if (this.isTeacherMode()) {
            console.log('[SequentialLocking] Teacher mode - all lessons unlocked');
            this.sequential = false;
        }

        // Find lesson cards
        this.detectLessons();

        // Apply locking
        this.applyLocking();

        // Update progress display
        this.updateProgressDisplay();

        console.log('[SequentialLocking] Initialized:', {
            gradeId: this.gradeId,
            moduleId: this.moduleId,
            sequential: this.sequential,
            lessons: this.lessons.length
        });
    },

    /**
     * Detect grade from URL
     */
    detectGrade() {
        const path = window.location.pathname;
        const match = path.match(/content\/tic\/(cls\d+)/);
        return match ? match[1] : 'cls6';
    },

    /**
     * Detect lessons from page structure
     */
    detectLessons() {
        this.lessons = [];

        // Try lesson cards with data-lesson-id
        const cardsWithId = document.querySelectorAll('[data-lesson-id]');
        if (cardsWithId.length > 0) {
            cardsWithId.forEach((card, idx) => {
                this.lessons.push({
                    element: card,
                    lessonId: card.getAttribute('data-lesson-id'),
                    index: idx,
                    href: card.href || card.querySelector('a')?.href
                });
            });
            return;
        }

        // Fallback: find .lesson-card elements
        const cards = document.querySelectorAll('.lesson-card');
        cards.forEach((card, idx) => {
            // Construct lesson ID from index
            const lessonNum = idx + 1;
            const lessonId = `${this.gradeId}-${this.moduleId}-lectia${lessonNum}`;

            this.lessons.push({
                element: card,
                lessonId: lessonId,
                index: idx,
                href: card.href || card.querySelector('a')?.href
            });
        });
    },

    /**
     * Apply sequential locking to lesson cards
     */
    applyLocking() {
        let lastUnlockedIndex = -1;

        // Find the last completed lesson
        this.lessons.forEach((lesson, idx) => {
            if (PowStorage.isLessonComplete(lesson.lessonId)) {
                lastUnlockedIndex = idx;
            }
        });

        // First lesson is always unlocked
        // After that, only next one after last completed
        const nextUnlockedIndex = lastUnlockedIndex + 1;

        this.lessons.forEach((lesson, idx) => {
            const isCompleted = PowStorage.isLessonComplete(lesson.lessonId);
            const isAccessible = !this.sequential || idx <= nextUnlockedIndex;

            this.updateLessonCard(lesson, {
                completed: isCompleted,
                accessible: isAccessible,
                isNext: idx === nextUnlockedIndex
            });
        });
    },

    /**
     * Update a lesson card's state
     */
    updateLessonCard(lesson, state) {
        const card = lesson.element;
        if (!card) return;

        // Find or create status element
        let statusEl = card.querySelector('.lesson-status');
        if (!statusEl) {
            statusEl = document.createElement('span');
            statusEl.className = 'lesson-status';
            card.appendChild(statusEl);
        }

        // Remove existing state classes
        card.classList.remove('is-completed', 'is-locked', 'is-accessible', 'is-next');
        statusEl.classList.remove('status-complete', 'status-locked', 'status-ready');

        if (state.completed) {
            // Completed state
            card.classList.add('is-completed');
            statusEl.className = 'lesson-status status-complete';
            statusEl.textContent = '✅ TERMINAT';
            statusEl.style.background = 'rgba(16, 185, 129, 0.3)';
            statusEl.style.color = '#10b981';
        } else if (!state.accessible) {
            // Locked state (HARD LOCK)
            card.classList.add('is-locked');
            statusEl.className = 'lesson-status status-locked';
            statusEl.textContent = '🔒 BLOCAT';
            statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
            statusEl.style.color = '#ef4444';

            // Prevent navigation
            if (card.tagName === 'A') {
                card.addEventListener('click', this.handleLockedClick.bind(this));
                card.style.pointerEvents = 'auto'; // Keep clickable for feedback
                card.style.cursor = 'not-allowed';
            }

            // Grey out
            card.style.opacity = '0.6';
            card.style.filter = 'grayscale(30%)';
        } else {
            // Accessible (not yet started)
            card.classList.add('is-accessible');
            if (state.isNext) {
                card.classList.add('is-next');
            }
            statusEl.className = 'lesson-status status-ready';
            statusEl.textContent = state.isNext ? '▶️ URMATORUL' : '⏳ DE FACUT';
            statusEl.style.background = state.isNext ? 'rgba(245, 158, 11, 0.3)' : 'rgba(148, 163, 184, 0.2)';
            statusEl.style.color = state.isNext ? '#f59e0b' : '#94a3b8';
        }
    },

    /**
     * Handle click on locked lesson
     */
    handleLockedClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.showToast('Completeaza lectia anterioara inainte!', 'error');
        return false;
    },

    /**
     * Update progress display on module page
     */
    updateProgressDisplay() {
        const completedCount = this.lessons.filter(l =>
            PowStorage.isLessonComplete(l.lessonId)
        ).length;
        const totalCount = this.lessons.length;

        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
            progressFill.style.width = `${percentage}%`;
        }

        // Update progress text
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${completedCount} din ${totalCount} lectii completate`;
        }
    },

    /**
     * Check if teacher mode is active
     */
    isTeacherMode() {
        const params = new URLSearchParams(window.location.search);
        return params.get('teacher') === '1';
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'warning') {
        const existing = document.querySelector('.pow-toast');
        if (existing) existing.remove();

        const icons = {
            warning: '⚠️',
            error: '🔒',
            success: '✅'
        };

        const toast = document.createElement('div');
        toast.className = `pow-toast pow-toast-${type}`;
        toast.innerHTML = `
            <span class="pow-toast-icon">${icons[type] || '⚠️'}</span>
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
     * Get first unlocked, incomplete lesson (for "Continue" button)
     */
    getNextLesson() {
        for (const lesson of this.lessons) {
            if (!PowStorage.isLessonComplete(lesson.lessonId)) {
                return lesson;
            }
        }
        return null;
    },

    /**
     * Check direct URL access - redirect if lesson is locked
     * Call this on lesson pages to enforce locking
     */
    checkDirectAccess(currentLessonId) {
        if (!this.sequential) return true;
        if (this.isTeacherMode()) return true;

        // Find lesson index
        const idx = this.lessons.findIndex(l => l.lessonId === currentLessonId);
        if (idx <= 0) return true; // First lesson always accessible

        // Check if previous lesson is completed
        const prevLesson = this.lessons[idx - 1];
        if (!PowStorage.isLessonComplete(prevLesson.lessonId)) {
            // Redirect to previous lesson
            if (prevLesson.href) {
                this.showToast('Completeaza lectia anterioara inainte!', 'error');
                setTimeout(() => {
                    window.location.href = prevLesson.href;
                }, 1500);
                return false;
            }
        }

        return true;
    }
};

// Auto-initialize on module pages (pages with data-module-id)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('[data-module-id]')) {
            SequentialLocking.init();
        }
    });
} else {
    if (document.querySelector('[data-module-id]')) {
        SequentialLocking.init();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SequentialLocking;
}
