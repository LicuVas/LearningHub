/**
 * LearningHub Practice System
 * ===========================
 * Extended practice exercises with XP tracking
 *
 * DEPENDS ON: user-system.js, rpg-system.js (must be loaded first)
 *
 * Usage:
 *   <link rel="stylesheet" href="../../assets/css/practice.css">
 *   <script src="../../assets/js/practice-system.js"></script>
 *   <script>
 *     PracticeSystem.init('cls7', 'm3-cpp-algorithms', 'lectia3');
 *   </script>
 */

const PracticeSystem = {
    STORAGE_KEY: 'learninghub_practice',

    // XP rewards
    XP_PER_PROBLEM: 25,
    XP_ALL_COMPLETE_BONUS: 50,

    // Current context
    currentGrade: null,
    currentModule: null,
    currentLesson: null,

    /**
     * Initialize Practice system for current lesson
     */
    init(grade, module, lesson) {
        this.currentGrade = grade;
        this.currentModule = module;
        this.currentLesson = lesson;

        this.setupTabs();
        this.loadProgress();
        this.updateProgressBar();

        console.log(`[Practice] Initialized for ${grade}/${module}/${lesson}`);
    },

    /**
     * Setup tab navigation click handlers
     */
    setupTabs() {
        const tabs = document.querySelectorAll('.learn-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    },

    /**
     * Switch between Learn and Practice tabs
     */
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.learn-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });

        // Track tab switch
        if (tabName === 'practice') {
            this.trackEvent('practice_tab_opened');
        }
    },

    /**
     * Show hint for a problem
     */
    showHint(problemId) {
        const hintContent = document.getElementById(`hint-${problemId}`);
        const hintBtn = document.querySelector(`[onclick*="showHint('${problemId}')"]`);

        if (hintContent) {
            hintContent.classList.toggle('revealed');
            if (hintBtn) {
                hintBtn.classList.toggle('revealed');
                hintBtn.innerHTML = hintContent.classList.contains('revealed')
                    ? '👁 Ascunde hint'
                    : '💡 Hint';
            }
        }
    },

    /**
     * Mark a problem as complete
     */
    markProblemComplete(problemId) {
        const data = this.getData();
        const lessonKey = this.getLessonKey();

        if (!data.lessons[lessonKey]) {
            data.lessons[lessonKey] = {
                problems: {},
                completed: false
            };
        }

        // Check if already completed
        if (data.lessons[lessonKey].problems[problemId]) {
            console.log(`[Practice] Problem ${problemId} already completed`);
            return;
        }

        // Mark as complete
        data.lessons[lessonKey].problems[problemId] = {
            completedAt: new Date().toISOString()
        };

        // Update total count
        data.totalProblemsCompleted = (data.totalProblemsCompleted || 0) + 1;

        this.saveData(data);

        // Update UI
        const problemCard = document.querySelector(`[data-problem="${problemId}"]`);
        if (problemCard) {
            problemCard.classList.add('completed');
        }

        const solveBtn = problemCard?.querySelector('.btn-solve');
        if (solveBtn) {
            solveBtn.classList.add('completed');
            solveBtn.textContent = 'Rezolvat!';
        }

        // Award XP
        this.awardXP(this.XP_PER_PROBLEM, `Problema ${problemId} rezolvata`);

        // Show notification
        this.showXPNotification(`+${this.XP_PER_PROBLEM} XP`);

        // Update progress bar
        this.updateProgressBar();

        // Check for achievements
        this.checkAchievements(data);

        // Check if all problems complete
        this.checkAllComplete();
    },

    /**
     * Mark a checkpoint as complete (for mini-projects)
     */
    markCheckpointComplete(projectId, checkpointId, checkbox) {
        const data = this.getData();
        const lessonKey = this.getLessonKey();

        if (!data.lessons[lessonKey]) {
            data.lessons[lessonKey] = {
                problems: {},
                projects: {},
                completed: false
            };
        }

        if (!data.lessons[lessonKey].projects) {
            data.lessons[lessonKey].projects = {};
        }

        if (!data.lessons[lessonKey].projects[projectId]) {
            data.lessons[lessonKey].projects[projectId] = {
                checkpoints: {}
            };
        }

        const isChecked = checkbox ? checkbox.checked : true;
        const project = data.lessons[lessonKey].projects[projectId];

        if (isChecked) {
            project.checkpoints[checkpointId] = {
                completedAt: new Date().toISOString()
            };
        } else {
            delete project.checkpoints[checkpointId];
        }

        this.saveData(data);

        // Update UI
        const checkpointEl = document.querySelector(
            `[data-problem="${projectId}"] [data-checkpoint="${checkpointId}"]`
        );
        if (checkpointEl) {
            checkpointEl.classList.toggle('done', isChecked);
        }

        // Check if all checkpoints complete
        this.checkProjectComplete(projectId);

        // Update progress bar
        this.updateProgressBar();
    },

    /**
     * Check if a project is fully complete
     */
    checkProjectComplete(projectId) {
        const projectEl = document.querySelector(`[data-problem="${projectId}"]`);
        if (!projectEl) return;

        const checkboxes = projectEl.querySelectorAll('input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);

        if (allChecked && checkboxes.length > 0) {
            // Mark project as complete
            const data = this.getData();
            const lessonKey = this.getLessonKey();

            if (!data.lessons[lessonKey].problems[projectId]) {
                data.lessons[lessonKey].problems[projectId] = {
                    completedAt: new Date().toISOString(),
                    type: 'project'
                };
                data.totalProblemsCompleted = (data.totalProblemsCompleted || 0) + 1;
                this.saveData(data);

                projectEl.classList.add('completed');
                this.awardXP(this.XP_PER_PROBLEM * 2, `Proiect ${projectId} finalizat`);
                this.showXPNotification(`+${this.XP_PER_PROBLEM * 2} XP - Proiect complet!`);
            }
        }
    },

    /**
     * Check if all practice problems are complete
     */
    checkAllComplete() {
        const data = this.getData();
        const lessonKey = this.getLessonKey();
        const lessonData = data.lessons[lessonKey];

        if (!lessonData || lessonData.completed) return;

        // Count total problems on page
        const totalProblems = document.querySelectorAll('.practice-problem').length;
        const completedProblems = Object.keys(lessonData.problems || {}).length;

        if (completedProblems >= totalProblems && totalProblems > 0) {
            // Mark lesson practice as complete
            lessonData.completed = true;
            lessonData.completedAt = new Date().toISOString();

            // Increment completed lessons count
            data.completedLessons = (data.completedLessons || 0) + 1;

            this.saveData(data);

            // Award bonus XP
            this.awardXP(this.XP_ALL_COMPLETE_BONUS, 'Practica completa');
            this.showXPNotification(`+${this.XP_ALL_COMPLETE_BONUS} XP BONUS!`);

            // Show celebration
            this.showCelebration();

            // Check for master achievement
            this.checkAchievements(data);
        }
    },

    /**
     * Check and unlock achievements
     */
    checkAchievements(data) {
        // First practice problem
        if (data.totalProblemsCompleted === 1) {
            this.unlockAchievement('practice_first');
        }

        // 10 lessons with practice complete
        if (data.completedLessons >= 10) {
            this.unlockAchievement('practice_master');
        }
    },

    /**
     * Unlock an achievement via RPG system
     */
    unlockAchievement(achievementId) {
        if (typeof RPG !== 'undefined' && RPG.unlockAchievement) {
            RPG.unlockAchievement(achievementId);
        }
    },

    /**
     * Award XP via RPG system
     */
    awardXP(amount, reason) {
        if (typeof RPG !== 'undefined' && RPG.addXP) {
            RPG.addXP(amount, reason);
        }
        console.log(`[Practice] Awarded ${amount} XP: ${reason}`);
    },

    /**
     * Show XP notification popup
     */
    showXPNotification(text) {
        // Remove existing notification
        const existing = document.querySelector('.xp-notification');
        if (existing) existing.remove();

        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.textContent = text;
        document.body.appendChild(notification);

        // Remove after animation
        setTimeout(() => notification.remove(), 3000);
    },

    /**
     * Show celebration when all practice complete
     */
    showCelebration() {
        const practiceTab = document.getElementById('tab-practice');
        if (!practiceTab) return;

        // Check if celebration already exists
        if (practiceTab.querySelector('.practice-complete')) return;

        const celebration = document.createElement('div');
        celebration.className = 'practice-complete';
        celebration.innerHTML = `
            <div class="practice-complete-icon">🎉</div>
            <h3>Practica Completa!</h3>
            <p>Ai rezolvat toate problemele din aceasta lectie.</p>
            <div class="xp-bonus">+${this.XP_ALL_COMPLETE_BONUS} XP Bonus!</div>
        `;
        practiceTab.appendChild(celebration);

        // Scroll to celebration
        celebration.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    /**
     * Update progress bar
     */
    updateProgressBar() {
        const progressBar = document.querySelector('.practice-progress .progress-fill');
        const progressText = document.querySelector('.practice-progress .progress-text');

        if (!progressBar || !progressText) return;

        const totalProblems = document.querySelectorAll('.practice-problem').length;
        const data = this.getData();
        const lessonKey = this.getLessonKey();
        const completedProblems = Object.keys(data.lessons[lessonKey]?.problems || {}).length;

        const percentage = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;

        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${completedProblems}/${totalProblems}`;
    },

    /**
     * Load saved progress and restore UI state
     */
    loadProgress() {
        const data = this.getData();
        const lessonKey = this.getLessonKey();
        const lessonData = data.lessons[lessonKey];

        if (!lessonData) return;

        // Restore problem completion states
        Object.keys(lessonData.problems || {}).forEach(problemId => {
            const problemCard = document.querySelector(`[data-problem="${problemId}"]`);
            if (problemCard) {
                problemCard.classList.add('completed');
                const solveBtn = problemCard.querySelector('.btn-solve');
                if (solveBtn) {
                    solveBtn.classList.add('completed');
                    solveBtn.textContent = 'Rezolvat!';
                }
            }
        });

        // Restore project checkpoint states
        Object.keys(lessonData.projects || {}).forEach(projectId => {
            const project = lessonData.projects[projectId];
            Object.keys(project.checkpoints || {}).forEach(checkpointId => {
                const checkpointEl = document.querySelector(
                    `[data-problem="${projectId}"] [data-checkpoint="${checkpointId}"]`
                );
                if (checkpointEl) {
                    checkpointEl.classList.add('done');
                    const checkbox = checkpointEl.querySelector('input[type="checkbox"]');
                    if (checkbox) checkbox.checked = true;
                }
            });
        });

        // Show celebration if already complete
        if (lessonData.completed) {
            this.showCelebration();
        }
    },

    /**
     * Track events (for analytics)
     */
    trackEvent(eventName, data = {}) {
        console.log(`[Practice] Event: ${eventName}`, data);
        // Could integrate with analytics here
    },

    /**
     * Get lesson key for storage
     */
    getLessonKey() {
        return `${this.currentGrade}_${this.currentModule}_${this.currentLesson}`;
    },

    /**
     * Get practice data from localStorage
     */
    getData() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('[Practice] Error reading data:', e);
        }

        return {
            lessons: {},
            totalProblemsCompleted: 0,
            completedLessons: 0
        };
    },

    /**
     * Save practice data to localStorage
     */
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('[Practice] Error saving data:', e);
        }
    },

    /**
     * Reset progress for current lesson (for testing)
     */
    resetLesson() {
        const data = this.getData();
        const lessonKey = this.getLessonKey();
        delete data.lessons[lessonKey];
        this.saveData(data);
        location.reload();
    },

    /**
     * Reset all practice progress (for testing)
     */
    resetAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        location.reload();
    }
};

// Make globally available
window.PracticeSystem = PracticeSystem;
