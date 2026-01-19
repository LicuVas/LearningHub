/**
 * LearningHub Proficiency System
 * ===============================
 * Gestioneaza nivelurile de proficienta per lectie: minim / standard / performanta
 *
 * Integrat cu:
 * - UserSystem (storage per profil)
 * - RPG System (XP diferentiat pe nivel)
 * - Progress (tracking completare)
 *
 * Usage:
 *   <script src="assets/js/proficiency-system.js"></script>
 *   ProficiencySystem.init();
 *   ProficiencySystem.setLessonLevel('V-M3-L01', 'standard');
 */

const ProficiencySystem = {
    STORAGE_KEY_SUFFIX: '_proficiency',

    // Niveluri disponibile cu configurari
    LEVELS: {
        minim: {
            id: 'minim',
            label: 'Minim',
            icon: '🐢',
            description: 'Concepte de baza, sarcini simple',
            xp_multiplier: 0.5,
            color: '#f59e0b',    // orange
            pass_threshold: 0.5  // 50% pentru a trece
        },
        standard: {
            id: 'standard',
            label: 'Standard',
            icon: '📚',
            description: 'Parcurs complet, sarcini normale',
            xp_multiplier: 1.0,
            color: '#3b82f6',    // blue
            pass_threshold: 0.66 // 66% pentru a trece
        },
        performanta: {
            id: 'performanta',
            label: 'Performanta',
            icon: '🚀',
            description: 'Provocari, transfer, aplicatii complexe',
            xp_multiplier: 1.5,
            color: '#10b981',    // green
            pass_threshold: 0.80 // 80% pentru a trece
        }
    },

    // XP de baza pe actiuni
    BASE_XP: {
        lesson_complete: 100,
        quiz_pass: 50,
        quiz_perfect: 100
    },

    /**
     * Initializeaza sistemul
     */
    init() {
        this.injectStyles();
        return this;
    },

    /**
     * Obtine cheia de storage pentru profilul activ
     */
    getStorageKey() {
        const profileId = typeof UserSystem !== 'undefined' ?
            UserSystem.getActiveProfile() : '_default';
        return `learninghub${this.STORAGE_KEY_SUFFIX}_${profileId || '_guest'}`;
    },

    /**
     * Obtine toate datele de proficiency
     */
    getData() {
        try {
            const data = localStorage.getItem(this.getStorageKey());
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('ProficiencySystem: Error reading data', e);
            return {};
        }
    },

    /**
     * Salveaza datele de proficiency
     */
    saveData(data) {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(data));
    },

    /**
     * Obtine nivelul curent pentru o lectie
     * @param {string} lessonCode - Codul lectiei (ex: V-M3-L01)
     * @returns {string} - 'minim' | 'standard' | 'performanta' | null
     */
    getLessonLevel(lessonCode) {
        const data = this.getData();
        return data[lessonCode]?.level || null;
    },

    /**
     * Seteaza nivelul pentru o lectie
     * @param {string} lessonCode
     * @param {string} level - 'minim' | 'standard' | 'performanta'
     */
    setLessonLevel(lessonCode, level) {
        if (!this.LEVELS[level]) {
            console.warn(`ProficiencySystem: Invalid level "${level}"`);
            return false;
        }

        const data = this.getData();
        if (!data[lessonCode]) {
            data[lessonCode] = {};
        }
        data[lessonCode].level = level;
        data[lessonCode].selected_at = new Date().toISOString();
        this.saveData(data);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('proficiency-level-changed', {
            detail: { lessonCode, level }
        }));

        return true;
    },

    /**
     * Inregistreaza scorul quiz pentru o lectie
     * @param {string} lessonCode
     * @param {string} level
     * @param {number} score - Punctaj obtinut
     * @param {number} total - Punctaj maxim
     * @returns {Object} - { passed, xp_earned, suggested_level }
     */
    recordQuizScore(lessonCode, level, score, total) {
        const levelConfig = this.LEVELS[level];
        if (!levelConfig) {
            return { passed: false, xp_earned: 0, suggested_level: 'standard' };
        }

        const percentage = total > 0 ? score / total : 0;
        const passed = percentage >= levelConfig.pass_threshold;

        // Calculeaza XP
        let xp_earned = 0;
        if (passed) {
            xp_earned = Math.round(this.BASE_XP.quiz_pass * levelConfig.xp_multiplier);
            if (percentage >= 1.0) {
                xp_earned += Math.round(this.BASE_XP.quiz_perfect * levelConfig.xp_multiplier);
            }
        }

        // Salveaza rezultatul
        const data = this.getData();
        if (!data[lessonCode]) {
            data[lessonCode] = {};
        }
        data[lessonCode].quiz_results = data[lessonCode].quiz_results || [];
        data[lessonCode].quiz_results.push({
            level,
            score,
            total,
            percentage,
            passed,
            xp_earned,
            timestamp: new Date().toISOString()
        });
        this.saveData(data);

        // Sugereaza nivel pentru data viitoare
        const suggested_level = this.suggestNextLevel(percentage, level);

        // Acorda XP daca e integrat cu RPG
        if (passed && xp_earned > 0 && typeof RPG !== 'undefined') {
            RPG.addXP(xp_earned, `Quiz ${level} - ${lessonCode}`);
        }

        return { passed, xp_earned, suggested_level, percentage };
    },

    /**
     * Sugereaza nivelul urmator bazat pe performanta
     */
    suggestNextLevel(percentage, currentLevel) {
        if (percentage >= 0.95) {
            // Excelent -> sugereaza nivel mai sus
            if (currentLevel === 'minim') return 'standard';
            if (currentLevel === 'standard') return 'performanta';
            return 'performanta';
        } else if (percentage < 0.5) {
            // Slab -> sugereaza nivel mai jos
            if (currentLevel === 'performanta') return 'standard';
            if (currentLevel === 'standard') return 'minim';
            return 'minim';
        }
        // Mentine nivelul curent
        return currentLevel;
    },

    /**
     * Obtine progresul general pentru un modul
     * @param {string} grade - V, VI, VII, VIII
     * @param {number} moduleIndex - 1-5
     * @returns {Object} - { completed, total, by_level }
     */
    getModuleProgress(grade, moduleIndex) {
        const data = this.getData();
        const prefix = `${grade}-M${moduleIndex}-`;

        let completed = 0;
        let total = 0;
        const by_level = { minim: 0, standard: 0, performanta: 0 };

        for (const [key, value] of Object.entries(data)) {
            if (key.startsWith(prefix)) {
                total++;
                if (value.quiz_results?.some(r => r.passed)) {
                    completed++;
                    if (value.level && by_level.hasOwnProperty(value.level)) {
                        by_level[value.level]++;
                    }
                }
            }
        }

        return { completed, total, by_level };
    },

    /**
     * Obtine statistici generale pentru profilul activ
     */
    getOverallStats() {
        const data = this.getData();
        const stats = {
            total_lessons: 0,
            completed_lessons: 0,
            by_level: { minim: 0, standard: 0, performanta: 0 },
            total_xp_earned: 0,
            average_score: 0
        };

        let totalScores = 0;
        let scoreSum = 0;

        for (const [key, value] of Object.entries(data)) {
            if (key.match(/^[A-Z]+-M\d-L\d+$/)) {
                stats.total_lessons++;

                if (value.quiz_results?.length > 0) {
                    const lastResult = value.quiz_results[value.quiz_results.length - 1];
                    if (lastResult.passed) {
                        stats.completed_lessons++;
                        if (value.level && stats.by_level.hasOwnProperty(value.level)) {
                            stats.by_level[value.level]++;
                        }
                    }
                    stats.total_xp_earned += value.quiz_results.reduce((sum, r) => sum + (r.xp_earned || 0), 0);

                    totalScores++;
                    scoreSum += lastResult.percentage;
                }
            }
        }

        stats.average_score = totalScores > 0 ? Math.round((scoreSum / totalScores) * 100) : 0;

        return stats;
    },

    /**
     * Filtreaza continutul lectiei pentru un anumit nivel
     * @param {Object} lessonData - Datele complete ale lectiei
     * @param {string} level - 'minim' | 'standard' | 'performanta'
     * @returns {Object} - Lectie filtrata pentru nivel
     */
    getContentForLevel(lessonData, level) {
        if (!lessonData || !level) return lessonData;

        // Cloneaza pentru a nu modifica originalul
        const filtered = JSON.parse(JSON.stringify(lessonData));

        // Filtreaza independent_practice
        if (filtered.instructional_flow?.independent_practice_12min) {
            const practice = filtered.instructional_flow.independent_practice_12min;
            filtered.instructional_flow.independent_practice_12min = {
                [level]: practice[level] || practice.standard || []
            };
        }

        // Filtreaza exit_ticket
        if (filtered.instructional_flow?.exit_ticket_3min) {
            const ticket = filtered.instructional_flow.exit_ticket_3min;
            filtered.instructional_flow.exit_ticket_3min = {
                [level]: ticket[level] || ticket.standard || []
            };
        }

        // Filtreaza i_can_statements
        if (filtered.competency_contract?.i_can_statements) {
            const ican = filtered.competency_contract.i_can_statements;
            filtered.competency_contract.i_can_statements = {
                [level]: ican[level] || ican.standard || []
            };
        }

        return filtered;
    },

    /**
     * Filtreaza quiz-ul pentru un anumit nivel
     * @param {Object} quizData - Datele complete ale quiz-ului
     * @param {string} level - 'minim' | 'standard' | 'performanta'
     * @returns {Array} - Itemi pentru nivelul specificat
     */
    getQuizForLevel(quizData, level) {
        if (!quizData) return [];

        const key = `items_${level}`;
        return quizData[key] || quizData.items_standard || [];
    },

    /**
     * Creeaza selectorul de nivel UI
     * @param {string} lessonCode
     * @param {Function} onChange - Callback cand se schimba nivelul
     * @returns {HTMLElement}
     */
    createLevelSelector(lessonCode, onChange) {
        const currentLevel = this.getLessonLevel(lessonCode) || 'standard';

        const container = document.createElement('div');
        container.className = 'proficiency-selector';
        container.innerHTML = `
            <div class="proficiency-label">Alege nivelul tau:</div>
            <div class="proficiency-options">
                ${Object.values(this.LEVELS).map(level => `
                    <button class="proficiency-option ${level.id === currentLevel ? 'active' : ''}"
                            data-level="${level.id}"
                            style="--level-color: ${level.color}">
                        <span class="proficiency-icon">${level.icon}</span>
                        <span class="proficiency-name">${level.label}</span>
                        <span class="proficiency-desc">${level.description}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Event handlers
        container.querySelectorAll('.proficiency-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = btn.dataset.level;
                this.setLessonLevel(lessonCode, level);

                // Update UI
                container.querySelectorAll('.proficiency-option').forEach(b =>
                    b.classList.toggle('active', b.dataset.level === level)
                );

                if (onChange) onChange(level);
            });
        });

        return container;
    },

    /**
     * Inject CSS styles
     */
    injectStyles() {
        if (document.getElementById('proficiency-styles')) return;

        const style = document.createElement('style');
        style.id = 'proficiency-styles';
        style.textContent = `
            .proficiency-selector {
                margin: 1.5rem 0;
                padding: 1.25rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 16px;
                border: 1px solid var(--border, #2d2d44);
            }

            .proficiency-label {
                font-size: 0.9rem;
                color: var(--text-secondary, #94a3b8);
                margin-bottom: 1rem;
                text-align: center;
            }

            .proficiency-options {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
                justify-content: center;
            }

            .proficiency-option {
                flex: 1;
                min-width: 140px;
                max-width: 200px;
                padding: 1rem;
                background: var(--bg-secondary, #12121f);
                border: 2px solid var(--border, #2d2d44);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                text-align: center;
            }

            .proficiency-option:hover {
                border-color: var(--level-color);
                transform: translateY(-2px);
            }

            .proficiency-option.active {
                border-color: var(--level-color);
                background: color-mix(in srgb, var(--level-color) 15%, var(--bg-secondary));
                box-shadow: 0 4px 15px color-mix(in srgb, var(--level-color) 30%, transparent);
            }

            .proficiency-icon {
                font-size: 2rem;
            }

            .proficiency-name {
                font-weight: 600;
                font-size: 1rem;
                color: var(--text-primary, #f1f5f9);
            }

            .proficiency-option.active .proficiency-name {
                color: var(--level-color);
            }

            .proficiency-desc {
                font-size: 0.75rem;
                color: var(--text-muted, #64748b);
                line-height: 1.3;
            }

            /* Badge mic pentru afisare in header/card */
            .proficiency-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.35rem;
                padding: 0.25rem 0.6rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 20px;
                font-size: 0.75rem;
                border: 1px solid var(--level-color, var(--border));
            }

            .proficiency-badge-icon {
                font-size: 0.9rem;
            }

            .proficiency-badge-text {
                color: var(--level-color, var(--text-secondary));
                font-weight: 500;
            }

            /* Mobile */
            @media (max-width: 600px) {
                .proficiency-options {
                    flex-direction: column;
                }

                .proficiency-option {
                    max-width: none;
                    flex-direction: row;
                    justify-content: flex-start;
                    text-align: left;
                    gap: 1rem;
                }

                .proficiency-icon {
                    font-size: 1.5rem;
                }

                .proficiency-desc {
                    display: none;
                }
            }
        `;

        document.head.appendChild(style);
    },

    /**
     * Creeaza un badge de nivel (pentru carduri, headere)
     * @param {string} level
     * @returns {HTMLElement}
     */
    createLevelBadge(level) {
        const config = this.LEVELS[level];
        if (!config) return null;

        const badge = document.createElement('span');
        badge.className = 'proficiency-badge';
        badge.style.setProperty('--level-color', config.color);
        badge.innerHTML = `
            <span class="proficiency-badge-icon">${config.icon}</span>
            <span class="proficiency-badge-text">${config.label}</span>
        `;

        return badge;
    }
};

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProficiencySystem.init());
} else {
    ProficiencySystem.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProficiencySystem;
}
