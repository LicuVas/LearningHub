/**
 * LearningHub Navigation Gating
 * ==============================
 * Gates Next/Prev navigation until PoW checkpoint is completed.
 *
 * @version 1.0.0
 * @depends storage.js
 */

const NavigationGating = {
    // Selectors for navigation elements
    selectors: {
        next: [
            'a.nav-btn.next',
            'a[rel="next"]',
            '.next-lesson',
            '[data-next]',
            '.nav-buttons a:last-child'
        ],
        prev: [
            'a.nav-btn.prev',
            'a[rel="prev"]',
            '.prev-lesson',
            '[data-prev]'
        ]
    },

    // Current lesson context
    currentLessonId: null,

    // Cached navigation elements
    nextBtn: null,
    prevBtn: null,

    // Original href (for restoring)
    originalNextHref: null,

    /**
     * Initialize navigation gating
     * @param {string} lessonId - Current lesson identifier
     */
    init(lessonId) {
        this.currentLessonId = lessonId || this.detectLessonId();

        // Find navigation elements
        this.findNavigationElements();

        // Apply initial gating state
        this.applyGatingState();

        // Listen for completion events
        window.addEventListener('pow:lessonComplete', (e) => {
            if (e.detail.lessonId === this.currentLessonId) {
                this.unlock();
            }
        });

        console.log('[NavigationGating] Initialized for:', this.currentLessonId);
    },

    /**
     * Detect lesson ID from page context
     */
    detectLessonId() {
        // Try to get from checkpoint
        if (typeof PowCheckpoint !== 'undefined' && PowCheckpoint.currentLesson) {
            return PowCheckpoint.currentLesson;
        }

        // Try from LearningProgress
        if (typeof LearningProgress !== 'undefined' && LearningProgress.currentLesson) {
            return `${LearningProgress.currentGrade}-${LearningProgress.currentModule}-${LearningProgress.currentLesson}`;
        }

        // Try from URL
        const path = window.location.pathname;
        const match = path.match(/content\/tic\/(cls\d+)\/([^\/]+)\/([^\/]+)\.html/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }

        return 'unknown';
    },

    /**
     * Find navigation elements on the page
     */
    findNavigationElements() {
        // Find Next button
        for (const selector of this.selectors.next) {
            const el = document.querySelector(selector);
            if (el && el.tagName === 'A') {
                this.nextBtn = el;
                this.originalNextHref = el.href;
                break;
            }
        }

        // Find Prev button
        for (const selector of this.selectors.prev) {
            const el = document.querySelector(selector);
            if (el && el.tagName === 'A') {
                this.prevBtn = el;
                break;
            }
        }
    },

    /**
     * Apply gating state based on completion
     */
    applyGatingState() {
        if (!this.nextBtn) return;

        const isComplete = PowStorage.isLessonComplete(this.currentLessonId);

        if (isComplete) {
            this.unlock();
        } else {
            this.lock();
        }
    },

    /**
     * Lock navigation (prevent Next)
     */
    lock() {
        if (!this.nextBtn) return;

        // Store original state
        if (!this.originalNextHref) {
            this.originalNextHref = this.nextBtn.href;
        }

        // Apply locked styling
        this.nextBtn.classList.add('is-locked');
        this.nextBtn.setAttribute('aria-disabled', 'true');
        this.nextBtn.setAttribute('data-original-href', this.originalNextHref);

        // Change text
        const originalText = this.nextBtn.textContent;
        this.nextBtn.setAttribute('data-original-text', originalText);
        this.nextBtn.innerHTML = `<span class="lock-icon">🔒</span> Completeaza lectia`;

        // Prevent click
        this.nextBtn.addEventListener('click', this.preventClick);

        // Add tooltip
        this.nextBtn.title = 'Completeaza checkpoint-ul pentru a continua';

        console.log('[NavigationGating] Navigation locked');
    },

    /**
     * Unlock navigation
     */
    unlock() {
        if (!this.nextBtn) return;

        // Restore href
        const originalHref = this.nextBtn.getAttribute('data-original-href') || this.originalNextHref;
        if (originalHref) {
            this.nextBtn.href = originalHref;
        }

        // Remove locked styling
        this.nextBtn.classList.remove('is-locked');
        this.nextBtn.classList.add('is-unlocked');
        this.nextBtn.removeAttribute('aria-disabled');

        // Restore text
        const originalText = this.nextBtn.getAttribute('data-original-text');
        if (originalText) {
            this.nextBtn.textContent = originalText;
        }

        // Remove click prevention
        this.nextBtn.removeEventListener('click', this.preventClick);

        // Remove tooltip
        this.nextBtn.title = '';

        // Add unlock animation
        this.nextBtn.classList.add('pow-unlocking');
        setTimeout(() => {
            this.nextBtn.classList.remove('pow-unlocking');
        }, 600);

        console.log('[NavigationGating] Navigation unlocked');
    },

    /**
     * Prevent click handler
     */
    preventClick(e) {
        e.preventDefault();
        e.stopPropagation();

        // Show toast message
        NavigationGating.showToast('Completeaza checkpoint-ul inainte de a continua!');

        // Scroll to checkpoint
        const checkpoint = document.querySelector('.pow-checkpoint');
        if (checkpoint) {
            checkpoint.scrollIntoView({ behavior: 'smooth', block: 'center' });
            checkpoint.classList.add('pow-highlight');
            setTimeout(() => checkpoint.classList.remove('pow-highlight'), 2000);
        }

        return false;
    },

    /**
     * Check and unlock if completed
     */
    checkAndUnlock(lessonId) {
        if (lessonId === this.currentLessonId || !lessonId) {
            if (PowStorage.isLessonComplete(this.currentLessonId)) {
                this.unlock();
            }
        }
    },

    /**
     * Show toast notification
     */
    showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.pow-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'pow-toast';
        toast.innerHTML = `
            <span class="pow-toast-icon">⚠️</span>
            <span class="pow-toast-message">${message}</span>
        `;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Check if teacher mode is active
     */
    isTeacherMode() {
        const params = new URLSearchParams(window.location.search);
        return params.get('teacher') === '1';
    }
};

// Auto-initialize when DOM ready (after checkpoint)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Delay slightly to ensure checkpoint initializes first
        setTimeout(() => NavigationGating.init(), 100);
    });
} else {
    setTimeout(() => NavigationGating.init(), 100);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationGating;
}
