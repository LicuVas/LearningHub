/**
 * LearningHub PoW Storage System
 * ===============================
 * localStorage wrapper for Proof-of-Work completion tracking.
 * Profile-aware: integrates with UserSystem if available.
 *
 * @version 2.0.0
 */

const PowStorage = {
    STORAGE_KEY: 'learninghub_pow_v1',
    VERSION: 1,

    /**
     * Get storage key (profile-aware)
     */
    getStorageKey() {
        let profileId = '_guest';
        if (typeof UserSystem !== 'undefined') {
            profileId = UserSystem.getActiveProfile() || '_guest';
        } else {
            profileId = localStorage.getItem('learninghub_active_profile') || '_guest';
        }
        return `${this.STORAGE_KEY}_${profileId}`;
    },

    /**
     * Get all PoW data
     */
    getData() {
        try {
            const key = this.getStorageKey();
            const raw = localStorage.getItem(key);
            if (!raw) return this.getEmptyData();
            const data = JSON.parse(raw);
            // Migration check
            if (data.version !== this.VERSION) {
                return this.migrate(data);
            }
            return data;
        } catch (e) {
            console.error('[PowStorage] Error reading data:', e);
            return this.getEmptyData();
        }
    },

    /**
     * Get empty data structure
     */
    getEmptyData() {
        return {
            version: this.VERSION,
            lessons: {},
            quizAttempts: {}
        };
    },

    /**
     * Migrate old data formats
     */
    migrate(data) {
        // Future migration logic
        data.version = this.VERSION;
        this.saveData(data);
        return data;
    },

    /**
     * Save all data
     */
    saveData(data) {
        try {
            const key = this.getStorageKey();
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('[PowStorage] Error saving data:', e);
        }
    },

    // ==================== LESSON COMPLETION ====================

    /**
     * Check if lesson PoW is completed
     */
    isLessonComplete(lessonId) {
        const data = this.getData();
        return data.lessons[lessonId]?.completed === true;
    },

    /**
     * Mark lesson as completed with evidence
     */
    completeLessonPow(lessonId, fields = {}) {
        const data = this.getData();
        data.lessons[lessonId] = {
            completed: true,
            completedAt: new Date().toISOString(),
            fields: fields
        };
        this.saveData(data);

        // Dispatch event for other systems
        window.dispatchEvent(new CustomEvent('pow:lessonComplete', {
            detail: { lessonId, fields }
        }));

        return true;
    },

    /**
     * Get lesson completion data
     */
    getLessonData(lessonId) {
        const data = this.getData();
        return data.lessons[lessonId] || null;
    },

    /**
     * Get completed lesson count for a module
     */
    getModuleCompletedCount(moduleId, lessonIds) {
        const data = this.getData();
        return lessonIds.filter(id => data.lessons[id]?.completed).length;
    },

    /**
     * Get all completed lessons matching a prefix
     */
    getCompletedLessons(prefix = '') {
        const data = this.getData();
        return Object.keys(data.lessons).filter(id =>
            id.startsWith(prefix) && data.lessons[id]?.completed
        );
    },

    // ==================== QUIZ ATTEMPTS ====================

    /**
     * Get quiz attempts for a lesson/question
     */
    getQuizAttempts(lessonId, questionId) {
        const data = this.getData();
        return data.quizAttempts[lessonId]?.[questionId] || {
            attempts: 0,
            correct: false,
            locked: false,
            unlockText: null
        };
    },

    /**
     * Record a quiz attempt
     */
    recordAttempt(lessonId, questionId, isCorrect) {
        const data = this.getData();

        if (!data.quizAttempts[lessonId]) {
            data.quizAttempts[lessonId] = {};
        }

        const current = data.quizAttempts[lessonId][questionId] || {
            attempts: 0,
            correct: false,
            locked: false,
            unlockText: null
        };

        current.attempts++;
        if (isCorrect) {
            current.correct = true;
        } else if (current.attempts >= 3 && !current.correct) {
            current.locked = true;
        }

        data.quizAttempts[lessonId][questionId] = current;
        this.saveData(data);

        return current;
    },

    /**
     * Unlock a question with explanation
     */
    unlockQuestion(lessonId, questionId, explanationText) {
        const data = this.getData();

        if (!data.quizAttempts[lessonId]?.[questionId]) return false;

        const current = data.quizAttempts[lessonId][questionId];
        current.locked = false;
        current.attempts = 0; // Reset attempts for new round
        current.unlockText = explanationText;

        this.saveData(data);
        return true;
    },

    /**
     * Get total quiz stats for a lesson
     */
    getQuizStats(lessonId) {
        const data = this.getData();
        const lessonAttempts = data.quizAttempts[lessonId] || {};

        let totalAttempts = 0;
        let correctCount = 0;
        let lockedCount = 0;

        for (const qId in lessonAttempts) {
            const q = lessonAttempts[qId];
            totalAttempts += q.attempts;
            if (q.correct) correctCount++;
            if (q.locked) lockedCount++;
        }

        const questionCount = Object.keys(lessonAttempts).length;
        const avgAttempts = questionCount > 0 ? totalAttempts / questionCount : 0;

        return {
            totalAttempts,
            correctCount,
            lockedCount,
            questionCount,
            avgAttempts
        };
    },

    // ==================== RESET/DEBUG ====================

    /**
     * Reset all PoW data for current profile
     */
    resetAll() {
        const key = this.getStorageKey();
        localStorage.removeItem(key);
        console.log('[PowStorage] All data reset');
    },

    /**
     * Reset single lesson
     */
    resetLesson(lessonId) {
        const data = this.getData();
        delete data.lessons[lessonId];
        delete data.quizAttempts[lessonId];
        this.saveData(data);
    },

    /**
     * Debug: print all data
     */
    debug() {
        console.log('[PowStorage] Current data:', this.getData());
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PowStorage;
}
