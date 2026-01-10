/**
 * LearningHub Progress Tracking System
 * =====================================
 * Tracks lesson completion using localStorage
 *
 * Usage in lesson pages:
 *   <script src="../../assets/js/progress.js"></script>
 *   <script>
 *     LearningProgress.init('cls5', 'm3-word', 'lectia1');
 *   </script>
 *
 * In module index pages:
 *   <script>
 *     LearningProgress.updateModuleProgress('cls5', 'm3-word', 6);
 *   </script>
 */

const LearningProgress = {
    STORAGE_KEY: 'learninghub_progress',

    /**
     * Get all progress data from localStorage
     */
    getData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading progress:', e);
            return {};
        }
    },

    /**
     * Save progress data to localStorage
     */
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    },

    /**
     * Mark a lesson as complete
     * @param {string} grade - e.g., 'cls5'
     * @param {string} module - e.g., 'm3-word'
     * @param {string} lesson - e.g., 'lectia1'
     */
    completeLesson(grade, module, lesson) {
        const data = this.getData();

        if (!data[grade]) data[grade] = {};
        if (!data[grade][module]) data[grade][module] = { completed: [], lastAccess: null };

        if (!data[grade][module].completed.includes(lesson)) {
            data[grade][module].completed.push(lesson);
        }
        data[grade][module].lastAccess = new Date().toISOString();

        this.saveData(data);
        return data[grade][module].completed.length;
    },

    /**
     * Check if a lesson is complete
     */
    isLessonComplete(grade, module, lesson) {
        const data = this.getData();
        return data[grade]?.[module]?.completed?.includes(lesson) || false;
    },

    /**
     * Get count of completed lessons for a module
     */
    getCompletedCount(grade, module) {
        const data = this.getData();
        return data[grade]?.[module]?.completed?.length || 0;
    },

    /**
     * Get completion percentage for a module
     */
    getModuleProgress(grade, module, totalLessons) {
        const completed = this.getCompletedCount(grade, module);
        return Math.round((completed / totalLessons) * 100);
    },

    /**
     * Initialize a lesson page with completion tracking
     */
    init(grade, module, lesson) {
        // Store current lesson info
        this.currentGrade = grade;
        this.currentModule = module;
        this.currentLesson = lesson;

        // Update last access
        const data = this.getData();
        if (!data[grade]) data[grade] = {};
        if (!data[grade][module]) data[grade][module] = { completed: [], lastAccess: null };
        data[grade][module].lastAccess = new Date().toISOString();
        this.saveData(data);

        // Check if already complete and update UI
        if (this.isLessonComplete(grade, module, lesson)) {
            this.markUIComplete();
        }

        // Add completion button if not exists
        this.addCompletionButton();
    },

    /**
     * Add a "Mark as Complete" button to the page
     */
    addCompletionButton() {
        // Find navigation buttons container
        const navButtons = document.querySelector('.nav-buttons');
        if (!navButtons) return;

        // Check if already complete
        const isComplete = this.isLessonComplete(
            this.currentGrade,
            this.currentModule,
            this.currentLesson
        );

        const button = document.createElement('button');
        button.id = 'complete-btn';
        button.className = 'complete-btn';
        button.innerHTML = isComplete ? '✅ Completat!' : '☐ Marchează ca terminat';
        button.style.cssText = `
            padding: 0.75rem 1.5rem;
            background: ${isComplete ? '#10b981' : '#3b82f6'};
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.95rem;
        `;

        if (!isComplete) {
            button.onclick = () => this.markComplete();
        } else {
            button.style.cursor = 'default';
        }

        // Insert before the navigation buttons
        navButtons.insertBefore(button, navButtons.firstChild);
    },

    /**
     * Mark current lesson as complete
     */
    markComplete() {
        const count = this.completeLesson(
            this.currentGrade,
            this.currentModule,
            this.currentLesson
        );

        // Update UI
        this.markUIComplete();

        // Show celebration
        this.showCelebration(count);
    },

    /**
     * Update UI to show completion
     */
    markUIComplete() {
        const btn = document.getElementById('complete-btn');
        if (btn) {
            btn.innerHTML = '✅ Completat!';
            btn.style.background = '#10b981';
            btn.style.cursor = 'default';
            btn.onclick = null;
        }
    },

    /**
     * Show a brief celebration animation
     */
    showCelebration(lessonCount) {
        const celebration = document.createElement('div');
        celebration.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #10b981, #06b6d4);
                color: white;
                padding: 2rem 3rem;
                border-radius: 20px;
                text-align: center;
                z-index: 10000;
                animation: popIn 0.3s ease-out;
                box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            ">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
                <div style="font-size: 1.3rem; font-weight: 700;">Bravo!</div>
                <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 0.5rem;">
                    ${lessonCount} lecție${lessonCount > 1 ? 'i' : ''} completată${lessonCount > 1 ? 'e' : ''}!
                </div>
            </div>
        `;

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes popIn {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(celebration);

        // Remove after 2 seconds
        setTimeout(() => {
            celebration.style.opacity = '0';
            celebration.style.transition = 'opacity 0.3s ease';
            setTimeout(() => celebration.remove(), 300);
        }, 2000);
    },

    /**
     * Update progress bar on module index page
     */
    updateModuleProgress(grade, module, totalLessons) {
        const completed = this.getCompletedCount(grade, module);
        const percentage = this.getModuleProgress(grade, module, totalLessons);

        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }

        // Update progress text
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${completed} din ${totalLessons} lecții completate`;
        }

        // Update lesson cards with completion status
        const lessonCards = document.querySelectorAll('.lesson-card');
        lessonCards.forEach((card, index) => {
            const lessonId = `lectia${index + 1}`;
            if (this.isLessonComplete(grade, module, lessonId)) {
                const status = card.querySelector('.lesson-status');
                if (status) {
                    status.textContent = '✅ COMPLETAT';
                    status.className = 'lesson-status status-complete';
                    status.style.background = 'rgba(16, 185, 129, 0.3)';
                    status.style.color = '#10b981';
                }
            }
        });
    },

    /**
     * Get overall stats
     */
    getOverallStats() {
        const data = this.getData();
        let totalCompleted = 0;
        let modulesStarted = 0;

        for (const grade in data) {
            for (const module in data[grade]) {
                totalCompleted += data[grade][module].completed?.length || 0;
                if (data[grade][module].completed?.length > 0) {
                    modulesStarted++;
                }
            }
        }

        return { totalCompleted, modulesStarted };
    },

    /**
     * Reset all progress (use with caution!)
     */
    resetAll() {
        if (confirm('Sigur vrei să ștergi tot progresul? Această acțiune nu poate fi anulată.')) {
            localStorage.removeItem(this.STORAGE_KEY);
            location.reload();
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearningProgress;
}
