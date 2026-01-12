/**
 * LearningHub RPG System
 * ======================
 * Gamification layer: XP, Levels, Achievements, Track Selection
 *
 * MULTI-PROFILE SUPPORT:
 * Since multiple students may use the same computer (school lab),
 * we support multiple profiles stored locally. Each student selects
 * their profile at the start.
 *
 * Integrates with progress.js for lesson completion tracking
 *
 * Usage:
 *   <script src="../../assets/js/progress.js"></script>
 *   <script src="../../assets/js/rpg-system.js"></script>
 *   <script>
 *     RPG.init('cls7', 'm3-cpp-algorithms');
 *   </script>
 */

const RPG = {
    STORAGE_KEY: 'learninghub_rpg',
    PROFILES_KEY: 'learninghub_profiles',
    ACTIVE_PROFILE_KEY: 'learninghub_active_profile',
    currentProfile: null,

    // XP rewards for different actions
    XP_REWARDS: {
        lesson_complete: 100,
        quiz_pass: 50,
        quiz_perfect: 100,
        first_try_pass: 25,
        module_complete: 500,
        streak_bonus: 10,  // per day in streak
        challenge_complete: 150
    },

    // Level thresholds (cumulative XP needed)
    LEVELS: [
        { level: 1, xp: 0, title: 'Incepator', icon: '🌱', color: '#94a3b8' },
        { level: 2, xp: 200, title: 'Explorator', icon: '🔍', color: '#3b82f6' },
        { level: 3, xp: 500, title: 'Ucenic', icon: '📖', color: '#06b6d4' },
        { level: 4, xp: 1000, title: 'Invatacel', icon: '✏️', color: '#10b981' },
        { level: 5, xp: 1800, title: 'Programator Junior', icon: '💻', color: '#8b5cf6' },
        { level: 6, xp: 3000, title: 'Coder', icon: '⌨️', color: '#ec4899' },
        { level: 7, xp: 4500, title: 'Developer', icon: '🚀', color: '#f59e0b' },
        { level: 8, xp: 6500, title: 'Hacker Etic', icon: '🔐', color: '#ef4444' },
        { level: 9, xp: 9000, title: 'Maestru', icon: '🎓', color: '#ffd700' },
        { level: 10, xp: 12000, title: 'Legenda', icon: '👑', color: '#ffd700' }
    ],

    // Achievement definitions
    ACHIEVEMENTS: {
        first_lesson: {
            id: 'first_lesson',
            name: 'Primul Pas',
            desc: 'Ai completat prima lectie!',
            icon: '🎯',
            xp: 50
        },
        five_lessons: {
            id: 'five_lessons',
            name: 'Pe Drum',
            desc: 'Ai completat 5 lectii',
            icon: '🏃',
            xp: 100
        },
        ten_lessons: {
            id: 'ten_lessons',
            name: 'Dedicat',
            desc: 'Ai completat 10 lectii',
            icon: '⭐',
            xp: 200
        },
        first_module: {
            id: 'first_module',
            name: 'Modul Complet',
            desc: 'Ai terminat un modul intreg!',
            icon: '🏆',
            xp: 300
        },
        quiz_master: {
            id: 'quiz_master',
            name: 'Quiz Master',
            desc: '5 quizuri cu scor perfect',
            icon: '🧠',
            xp: 250
        },
        streak_3: {
            id: 'streak_3',
            name: 'Foc!',
            desc: '3 zile consecutive de invatare',
            icon: '🔥',
            xp: 75
        },
        streak_7: {
            id: 'streak_7',
            name: 'Saptamana Perfecta',
            desc: '7 zile consecutive!',
            icon: '💪',
            xp: 200
        },
        explorer: {
            id: 'explorer',
            name: 'Explorator',
            desc: 'Ai incercat toate cele 3 track-uri',
            icon: '🧭',
            xp: 100
        },
        night_owl: {
            id: 'night_owl',
            name: 'Bufnita',
            desc: 'Ai invatat dupa ora 21:00',
            icon: '🦉',
            xp: 25
        },
        early_bird: {
            id: 'early_bird',
            name: 'Matinal',
            desc: 'Ai invatat inainte de ora 8:00',
            icon: '🐦',
            xp: 25
        },
        cpp_starter: {
            id: 'cpp_starter',
            name: 'C++ Novice',
            desc: 'Prima lectie de C++',
            icon: '💠',
            xp: 50
        },
        html_starter: {
            id: 'html_starter',
            name: 'Web Developer',
            desc: 'Prima lectie de HTML',
            icon: '🌐',
            xp: 50
        },
        scratch_starter: {
            id: 'scratch_starter',
            name: 'Scratch Cat',
            desc: 'Prima lectie de Scratch',
            icon: '🐱',
            xp: 50
        }
    },

    /**
     * Initialize RPG system for current page
     */
    init(grade, module) {
        this.currentGrade = grade;
        this.currentModule = module;

        // Check for active profile or show selector
        this.currentProfile = this.getActiveProfile();

        if (!this.currentProfile) {
            // No profile selected - show profile selector
            this.showProfileSelector();
            return; // Don't initialize until profile is selected
        }

        // Load or create player data for this profile
        this.loadData();

        // Update streak
        this.updateStreak();

        // Check time-based achievements
        this.checkTimeAchievements();

        // Add RPG UI elements
        this.addStatusBar();

        // Hook into progress system
        this.hookProgressSystem();
    },

    /**
     * Get all stored profiles
     */
    getProfiles() {
        try {
            const profiles = localStorage.getItem(this.PROFILES_KEY);
            return profiles ? JSON.parse(profiles) : [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Save profiles list
     */
    saveProfiles(profiles) {
        localStorage.setItem(this.PROFILES_KEY, JSON.stringify(profiles));
    },

    /**
     * Get currently active profile
     */
    getActiveProfile() {
        return localStorage.getItem(this.ACTIVE_PROFILE_KEY);
    },

    /**
     * Set active profile
     */
    setActiveProfile(profileName) {
        localStorage.setItem(this.ACTIVE_PROFILE_KEY, profileName);
        this.currentProfile = profileName;
    },

    /**
     * Create a new profile
     */
    createProfile(name) {
        const profiles = this.getProfiles();
        const profileId = name.toLowerCase().replace(/\s+/g, '_');

        if (!profiles.find(p => p.id === profileId)) {
            profiles.push({
                id: profileId,
                name: name,
                created: new Date().toISOString(),
                avatar: this.getRandomAvatar()
            });
            this.saveProfiles(profiles);
        }

        // Initialize empty data for this profile
        const storageKey = `${this.STORAGE_KEY}_${profileId}`;
        if (!localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, JSON.stringify(this.getDefaultData()));
        }

        // Also initialize progress tracking for this profile
        const progressKey = `learninghub_progress_${profileId}`;
        if (!localStorage.getItem(progressKey)) {
            localStorage.setItem(progressKey, JSON.stringify({}));
        }

        return profileId;
    },

    /**
     * Get random avatar for new profile
     */
    getRandomAvatar() {
        const avatars = ['🦊', '🐼', '🦁', '🐯', '🐸', '🦉', '🐺', '🦄', '🐲', '🦋', '🐬', '🦅', '🐢', '🦎', '🐙'];
        return avatars[Math.floor(Math.random() * avatars.length)];
    },

    /**
     * Show profile selector modal
     */
    showProfileSelector(onSelect = null) {
        const profiles = this.getProfiles();

        const modal = document.createElement('div');
        modal.id = 'rpg-profile-selector';
        modal.innerHTML = `
            <div class="profile-selector-content">
                <h2>Cine esti?</h2>
                <p style="color: var(--text-secondary, #94a3b8); margin-bottom: 1.5rem;">
                    Selecteaza profilul tau sau creeaza unul nou
                </p>

                ${profiles.length > 0 ? `
                    <div class="existing-profiles">
                        ${profiles.map(p => `
                            <button class="profile-option" data-profile="${p.id}">
                                <span class="profile-avatar">${p.avatar || '👤'}</span>
                                <span class="profile-name">${p.name}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="profile-divider">sau</div>
                ` : ''}

                <div class="new-profile-form">
                    <input type="text" id="new-profile-name" placeholder="Numele tau (ex: Maria 7A)" maxlength="20">
                    <button id="create-profile-btn">Creeaza profil nou</button>
                </div>

                ${profiles.length > 0 ? `
                    <div class="guest-option">
                        <button id="guest-mode-btn">Continua fara profil</button>
                    </div>
                ` : ''}
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.id = 'profile-selector-styles';
        style.textContent = `
            #rpg-profile-selector {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10003;
                padding: 1rem;
            }

            .profile-selector-content {
                background: var(--bg-secondary, #12121f);
                border-radius: 24px;
                padding: 2.5rem;
                max-width: 400px;
                width: 100%;
                text-align: center;
            }

            .profile-selector-content h2 {
                font-size: 1.75rem;
                margin-bottom: 0.5rem;
                background: linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-purple, #8b5cf6));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .existing-profiles {
                display: grid;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }

            .profile-option {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.5rem;
                background: var(--bg-card, #1a1a2e);
                border: 2px solid var(--border, #2d2d44);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                width: 100%;
                color: var(--text-primary, #f1f5f9);
                font-size: 1rem;
            }

            .profile-option:hover {
                border-color: var(--accent-blue, #3b82f6);
                background: var(--bg-card-hover, #252545);
                transform: translateX(5px);
            }

            .profile-avatar {
                font-size: 2rem;
            }

            .profile-name {
                font-weight: 600;
            }

            .profile-divider {
                color: var(--text-muted, #64748b);
                margin: 1rem 0;
                position: relative;
            }

            .profile-divider::before,
            .profile-divider::after {
                content: '';
                position: absolute;
                top: 50%;
                width: 40%;
                height: 1px;
                background: var(--border, #2d2d44);
            }

            .profile-divider::before { left: 0; }
            .profile-divider::after { right: 0; }

            .new-profile-form {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            #new-profile-name {
                padding: 1rem;
                background: var(--bg-card, #1a1a2e);
                border: 2px solid var(--border, #2d2d44);
                border-radius: 12px;
                color: var(--text-primary, #f1f5f9);
                font-size: 1rem;
                text-align: center;
            }

            #new-profile-name:focus {
                outline: none;
                border-color: var(--accent-cyan, #06b6d4);
            }

            #create-profile-btn {
                padding: 1rem;
                background: linear-gradient(135deg, var(--accent-green, #10b981), var(--accent-cyan, #06b6d4));
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            #create-profile-btn:hover {
                transform: scale(1.02);
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            }

            .guest-option {
                margin-top: 1.5rem;
            }

            #guest-mode-btn {
                padding: 0.75rem 1.5rem;
                background: transparent;
                border: 1px solid var(--border, #2d2d44);
                border-radius: 8px;
                color: var(--text-muted, #64748b);
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s ease;
            }

            #guest-mode-btn:hover {
                border-color: var(--text-secondary, #94a3b8);
                color: var(--text-secondary, #94a3b8);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Event handlers
        modal.querySelectorAll('.profile-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const profileId = btn.dataset.profile;
                this.selectProfile(profileId);
                modal.remove();
                if (onSelect) onSelect(profileId);
            });
        });

        document.getElementById('create-profile-btn').addEventListener('click', () => {
            const name = document.getElementById('new-profile-name').value.trim();
            if (name.length >= 2) {
                const profileId = this.createProfile(name);
                this.selectProfile(profileId);
                modal.remove();
                if (onSelect) onSelect(profileId);
            } else {
                document.getElementById('new-profile-name').style.borderColor = '#ef4444';
                document.getElementById('new-profile-name').placeholder = 'Minim 2 caractere!';
            }
        });

        document.getElementById('new-profile-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('create-profile-btn').click();
            }
        });

        const guestBtn = document.getElementById('guest-mode-btn');
        if (guestBtn) {
            guestBtn.addEventListener('click', () => {
                this.setActiveProfile('_guest');
                this.currentProfile = '_guest';
                modal.remove();
                // Continue initialization without profile
                this.loadData();
                this.addStatusBar();
                this.hookProgressSystem();
            });
        }
    },

    /**
     * Select and activate a profile
     */
    selectProfile(profileId) {
        this.setActiveProfile(profileId);
        this.currentProfile = profileId;

        // Update progress.js to use profile-specific storage
        if (typeof LearningProgress !== 'undefined') {
            LearningProgress.STORAGE_KEY = `learninghub_progress_${profileId}`;
        }

        // Continue initialization
        this.loadData();
        this.updateStreak();
        this.checkTimeAchievements();
        this.addStatusBar();
        this.hookProgressSystem();
    },

    /**
     * Get storage key for current profile
     */
    getStorageKey() {
        if (this.currentProfile && this.currentProfile !== '_guest') {
            return `${this.STORAGE_KEY}_${this.currentProfile}`;
        }
        return this.STORAGE_KEY;
    },

    /**
     * Load player data from localStorage
     */
    loadData() {
        try {
            const key = this.getStorageKey();
            const data = localStorage.getItem(key);
            this.data = data ? JSON.parse(data) : this.getDefaultData();
        } catch (e) {
            console.error('Error loading RPG data:', e);
            this.data = this.getDefaultData();
        }
    },

    /**
     * Get default player data structure
     */
    getDefaultData() {
        return {
            xp: 0,
            achievements: [],
            perfectQuizzes: 0,
            tracksUsed: [],
            currentTrack: 'core',
            streak: {
                current: 0,
                lastDate: null,
                longest: 0
            },
            stats: {
                lessonsCompleted: 0,
                quizzesPassed: 0,
                modulesCompleted: 0,
                totalTime: 0
            },
            created: new Date().toISOString()
        };
    },

    /**
     * Save player data to localStorage
     */
    saveData() {
        try {
            const key = this.getStorageKey();
            localStorage.setItem(key, JSON.stringify(this.data));
        } catch (e) {
            console.error('Error saving RPG data:', e);
        }
    },

    /**
     * Add XP and check for level up
     */
    addXP(amount, reason) {
        const oldLevel = this.getLevel();
        this.data.xp += amount;
        this.saveData();

        const newLevel = this.getLevel();

        // Show XP gain notification
        this.showXPGain(amount, reason);

        // Check for level up
        if (newLevel.level > oldLevel.level) {
            this.showLevelUp(newLevel);
        }

        // Update status bar
        this.updateStatusBar();
    },

    /**
     * Get current level info
     */
    getLevel() {
        const xp = this.data.xp;
        let currentLevel = this.LEVELS[0];

        for (const level of this.LEVELS) {
            if (xp >= level.xp) {
                currentLevel = level;
            } else {
                break;
            }
        }

        // Calculate progress to next level
        const nextLevel = this.LEVELS[currentLevel.level] || currentLevel;
        const xpForCurrent = currentLevel.xp;
        const xpForNext = nextLevel.xp;
        const progress = xpForNext > xpForCurrent
            ? (xp - xpForCurrent) / (xpForNext - xpForCurrent)
            : 1;

        return {
            ...currentLevel,
            currentXP: xp,
            xpToNext: xpForNext - xp,
            progress: Math.min(progress, 1)
        };
    },

    /**
     * Update streak tracking
     */
    updateStreak() {
        const today = new Date().toDateString();
        const lastDate = this.data.streak.lastDate;

        if (lastDate === today) {
            // Already logged today
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate === yesterday.toDateString()) {
            // Consecutive day!
            this.data.streak.current++;
            if (this.data.streak.current > this.data.streak.longest) {
                this.data.streak.longest = this.data.streak.current;
            }

            // Streak bonus XP
            const bonus = this.data.streak.current * this.XP_REWARDS.streak_bonus;
            this.addXP(bonus, `Streak ${this.data.streak.current} zile! 🔥`);

            // Check streak achievements
            if (this.data.streak.current >= 3) {
                this.unlockAchievement('streak_3');
            }
            if (this.data.streak.current >= 7) {
                this.unlockAchievement('streak_7');
            }
        } else if (lastDate !== today) {
            // Streak broken
            this.data.streak.current = 1;
        }

        this.data.streak.lastDate = today;
        this.saveData();
    },

    /**
     * Check for time-based achievements
     */
    checkTimeAchievements() {
        const hour = new Date().getHours();

        if (hour >= 21 || hour < 5) {
            this.unlockAchievement('night_owl');
        }
        if (hour >= 5 && hour < 8) {
            this.unlockAchievement('early_bird');
        }
    },

    /**
     * Unlock an achievement
     */
    unlockAchievement(achievementId) {
        if (this.data.achievements.includes(achievementId)) {
            return; // Already unlocked
        }

        const achievement = this.ACHIEVEMENTS[achievementId];
        if (!achievement) return;

        this.data.achievements.push(achievementId);
        this.saveData();

        // Award XP
        this.addXP(achievement.xp, `Achievement: ${achievement.name}`);

        // Show achievement popup
        this.showAchievement(achievement);
    },

    /**
     * Hook into the progress system
     */
    hookProgressSystem() {
        // Override LearningProgress.completeLesson if it exists
        if (typeof LearningProgress !== 'undefined') {
            const originalComplete = LearningProgress.completeLesson.bind(LearningProgress);

            LearningProgress.completeLesson = (grade, module, lesson) => {
                const count = originalComplete(grade, module, lesson);

                // Award XP for lesson completion
                this.onLessonComplete(grade, module, lesson, count);

                return count;
            };
        }
    },

    /**
     * Called when a lesson is completed
     */
    onLessonComplete(grade, module, lesson, totalLessons) {
        this.data.stats.lessonsCompleted++;
        this.saveData();

        // Award XP
        this.addXP(this.XP_REWARDS.lesson_complete, 'Lectie completata!');

        // Check lesson count achievements
        if (this.data.stats.lessonsCompleted === 1) {
            this.unlockAchievement('first_lesson');
        }
        if (this.data.stats.lessonsCompleted === 5) {
            this.unlockAchievement('five_lessons');
        }
        if (this.data.stats.lessonsCompleted === 10) {
            this.unlockAchievement('ten_lessons');
        }

        // Check subject-specific achievements
        if (module.includes('cpp') || module.includes('programare')) {
            this.unlockAchievement('cpp_starter');
        }
        if (module.includes('web') || module.includes('html')) {
            this.unlockAchievement('html_starter');
        }
        if (module.includes('scratch')) {
            this.unlockAchievement('scratch_starter');
        }
    },

    /**
     * Called when a quiz is passed
     */
    onQuizPass(score, total, isPerfect) {
        this.data.stats.quizzesPassed++;

        if (isPerfect) {
            this.data.perfectQuizzes++;
            this.addXP(this.XP_REWARDS.quiz_perfect, 'Quiz perfect! 💯');

            if (this.data.perfectQuizzes >= 5) {
                this.unlockAchievement('quiz_master');
            }
        } else {
            this.addXP(this.XP_REWARDS.quiz_pass, 'Quiz trecut!');
        }

        this.saveData();
    },

    /**
     * Set current learning track
     */
    setTrack(trackId) {
        this.data.currentTrack = trackId;

        if (!this.data.tracksUsed.includes(trackId)) {
            this.data.tracksUsed.push(trackId);

            // Check explorer achievement
            if (this.data.tracksUsed.length >= 3) {
                this.unlockAchievement('explorer');
            }
        }

        this.saveData();
        this.showTrackChange(trackId);
    },

    /**
     * Add status bar to the page
     */
    addStatusBar() {
        const level = this.getLevel();
        const profile = this.getProfiles().find(p => p.id === this.currentProfile);
        const profileName = profile ? profile.name : (this.currentProfile === '_guest' ? 'Vizitator' : 'Necunoscut');
        const profileAvatar = profile ? profile.avatar : '👤';

        const statusBar = document.createElement('div');
        statusBar.id = 'rpg-status-bar';
        statusBar.innerHTML = `
            <div class="rpg-profile-info" onclick="RPG.switchProfile()" title="Click pentru a schimba profilul">
                <span class="profile-avatar-small">${profileAvatar}</span>
                <span class="profile-name-small">${profileName}</span>
            </div>
            <div class="rpg-level" title="Nivel ${level.level}: ${level.title}">
                <span class="level-icon">${level.icon}</span>
                <span class="level-num">${level.level}</span>
            </div>
            <div class="rpg-xp-bar">
                <div class="xp-fill" style="width: ${level.progress * 100}%"></div>
                <span class="xp-text">${level.currentXP} XP</span>
            </div>
            <div class="rpg-streak" title="Streak: ${this.data.streak.current} zile">
                🔥 ${this.data.streak.current}
            </div>
            <button class="rpg-profile-btn" onclick="RPG.showProfile()">⚙️</button>
        `;

        // Add styles
        this.addStyles();

        document.body.appendChild(statusBar);
    },

    /**
     * Switch to a different profile
     */
    switchProfile() {
        // Clear active profile
        localStorage.removeItem(this.ACTIVE_PROFILE_KEY);
        this.currentProfile = null;

        // Remove status bar
        const statusBar = document.getElementById('rpg-status-bar');
        if (statusBar) statusBar.remove();

        // Show profile selector
        this.showProfileSelector(() => {
            // Reload page to reset everything with new profile
            location.reload();
        });
    },

    /**
     * Logout current profile (just switch, don't delete)
     */
    logout() {
        localStorage.removeItem(this.ACTIVE_PROFILE_KEY);
        location.reload();
    },

    /**
     * Update status bar display
     */
    updateStatusBar() {
        const level = this.getLevel();
        const statusBar = document.getElementById('rpg-status-bar');
        if (!statusBar) return;

        statusBar.querySelector('.level-icon').textContent = level.icon;
        statusBar.querySelector('.level-num').textContent = level.level;
        statusBar.querySelector('.xp-fill').style.width = `${level.progress * 100}%`;
        statusBar.querySelector('.xp-text').textContent = `${level.currentXP} XP`;
        statusBar.querySelector('.rpg-streak').innerHTML = `🔥 ${this.data.streak.current}`;
    },

    /**
     * Show XP gain notification
     */
    showXPGain(amount, reason) {
        const notification = document.createElement('div');
        notification.className = 'rpg-xp-notification';
        notification.innerHTML = `+${amount} XP<br><small>${reason}</small>`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    },

    /**
     * Show level up celebration
     */
    showLevelUp(level) {
        const popup = document.createElement('div');
        popup.className = 'rpg-level-up';
        popup.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">${level.icon}</div>
                <h2>NIVEL ${level.level}!</h2>
                <p class="level-title" style="color: ${level.color}">${level.title}</p>
                <p class="level-congrats">Felicitari! Continua tot asa!</p>
                <button onclick="this.parentElement.parentElement.remove()">Multumesc!</button>
            </div>
        `;
        document.body.appendChild(popup);
    },

    /**
     * Show achievement popup
     */
    showAchievement(achievement) {
        const popup = document.createElement('div');
        popup.className = 'rpg-achievement-popup';
        popup.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">🏆 ${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        `;
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 500);
        }, 4000);
    },

    /**
     * Show track change notification
     */
    showTrackChange(trackId) {
        const tracks = {
            support: { name: 'Mai incet', icon: '🐢' },
            core: { name: 'Standard', icon: '📚' },
            extend: { name: 'Mai rapid', icon: '🚀' }
        };
        const track = tracks[trackId];

        const notification = document.createElement('div');
        notification.className = 'rpg-track-notification';
        notification.innerHTML = `${track.icon} Track: ${track.name}`;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 2000);
    },

    /**
     * Show player profile modal
     */
    showProfile() {
        const level = this.getLevel();
        const stats = this.data.stats;
        const profile = this.getProfiles().find(p => p.id === this.currentProfile);
        const profileName = profile ? profile.name : (this.currentProfile === '_guest' ? 'Vizitator' : 'Profil');
        const profileAvatar = profile ? profile.avatar : '👤';

        const modal = document.createElement('div');
        modal.className = 'rpg-profile-modal';
        modal.innerHTML = `
            <div class="profile-content">
                <button class="profile-close" onclick="this.parentElement.parentElement.remove()">&times;</button>

                <div class="profile-user-info">
                    <span class="profile-user-avatar">${profileAvatar}</span>
                    <span class="profile-user-name">${profileName}</span>
                    <button class="switch-profile-btn" onclick="RPG.switchProfile()">Schimba</button>
                </div>

                <div class="profile-header">
                    <div class="profile-level" style="background: ${level.color}20; border-color: ${level.color}">
                        <span class="profile-level-icon">${level.icon}</span>
                        <span class="profile-level-num">Nivel ${level.level}</span>
                    </div>
                    <h2 class="profile-title">${level.title}</h2>
                    <div class="profile-xp">${level.currentXP} XP total</div>
                </div>

                <div class="profile-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${level.progress * 100}%; background: ${level.color}"></div>
                    </div>
                    <div class="progress-text">${Math.round(level.progress * 100)}% spre nivel ${level.level + 1}</div>
                </div>

                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-value">${stats.lessonsCompleted}</span>
                        <span class="stat-label">Lectii</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.quizzesPassed}</span>
                        <span class="stat-label">Quizuri</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.data.streak.current}</span>
                        <span class="stat-label">🔥 Streak</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.data.streak.longest}</span>
                        <span class="stat-label">Record</span>
                    </div>
                </div>

                <div class="profile-achievements">
                    <h3>🏆 Achievements (${this.data.achievements.length}/${Object.keys(this.ACHIEVEMENTS).length})</h3>
                    <div class="achievements-grid">
                        ${Object.values(this.ACHIEVEMENTS).map(a => `
                            <div class="achievement-item ${this.data.achievements.includes(a.id) ? 'unlocked' : 'locked'}">
                                <span class="ach-icon">${a.icon}</span>
                                <span class="ach-name">${a.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="profile-track">
                    <h3>🎮 Track curent</h3>
                    <div class="track-selector">
                        <button class="track-btn ${this.data.currentTrack === 'support' ? 'active' : ''}" onclick="RPG.setTrack('support')">
                            🐢 Mai incet
                        </button>
                        <button class="track-btn ${this.data.currentTrack === 'core' ? 'active' : ''}" onclick="RPG.setTrack('core')">
                            📚 Standard
                        </button>
                        <button class="track-btn ${this.data.currentTrack === 'extend' ? 'active' : ''}" onclick="RPG.setTrack('extend')">
                            🚀 Mai rapid
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    /**
     * Add RPG system styles
     */
    addStyles() {
        if (document.getElementById('rpg-styles')) return;

        const style = document.createElement('style');
        style.id = 'rpg-styles';
        style.textContent = `
            /* Status Bar */
            #rpg-status-bar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 50px;
                background: linear-gradient(180deg, rgba(26, 26, 46, 0.98), rgba(18, 18, 31, 0.95));
                border-bottom: 1px solid var(--border, #2d2d44);
                display: flex;
                align-items: center;
                padding: 0 1rem;
                gap: 1rem;
                z-index: 9999;
                backdrop-filter: blur(10px);
            }

            .rpg-profile-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: var(--bg-card, #1a1a2e);
                padding: 0.4rem 0.75rem;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid var(--border, #2d2d44);
            }

            .rpg-profile-info:hover {
                border-color: var(--accent-cyan, #06b6d4);
                background: var(--bg-card-hover, #252545);
            }

            .profile-avatar-small { font-size: 1.2rem; }
            .profile-name-small {
                font-weight: 600;
                font-size: 0.85rem;
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .rpg-level {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                background: var(--bg-card, #1a1a2e);
                padding: 0.4rem 0.75rem;
                border-radius: 20px;
                border: 1px solid var(--accent-purple, #8b5cf6);
            }

            .level-icon { font-size: 1.2rem; }
            .level-num { font-weight: 700; color: var(--accent-purple, #8b5cf6); }

            .rpg-xp-bar {
                flex: 1;
                max-width: 200px;
                height: 20px;
                background: var(--bg-card, #1a1a2e);
                border-radius: 10px;
                position: relative;
                overflow: hidden;
            }

            .xp-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--accent-blue, #3b82f6), var(--accent-purple, #8b5cf6));
                border-radius: 10px;
                transition: width 0.5s ease;
            }

            .xp-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 0.75rem;
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            }

            .rpg-streak {
                font-weight: 600;
                color: var(--accent-orange, #f59e0b);
            }

            .rpg-profile-btn {
                background: var(--bg-card, #1a1a2e);
                border: 1px solid var(--border, #2d2d44);
                border-radius: 50%;
                width: 36px;
                height: 36px;
                cursor: pointer;
                font-size: 1.1rem;
                transition: all 0.2s ease;
            }

            .rpg-profile-btn:hover {
                border-color: var(--accent-cyan, #06b6d4);
                transform: scale(1.1);
            }

            /* XP Notification */
            .rpg-xp-notification {
                position: fixed;
                top: 70px;
                right: 20px;
                background: linear-gradient(135deg, var(--accent-green, #10b981), var(--accent-cyan, #06b6d4));
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                font-weight: 700;
                font-size: 1.1rem;
                animation: slideInRight 0.3s ease;
                z-index: 10001;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            }

            .rpg-xp-notification small {
                font-weight: 400;
                opacity: 0.9;
            }

            .rpg-xp-notification.fade-out {
                animation: fadeOutRight 0.5s ease forwards;
            }

            @keyframes slideInRight {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes fadeOutRight {
                to { transform: translateX(100px); opacity: 0; }
            }

            /* Level Up Popup */
            .rpg-level-up {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
                animation: fadeIn 0.3s ease;
            }

            .level-up-content {
                background: var(--bg-card, #1a1a2e);
                padding: 3rem;
                border-radius: 24px;
                text-align: center;
                animation: scaleIn 0.5s ease;
                border: 2px solid var(--accent-purple, #8b5cf6);
            }

            .level-up-icon {
                font-size: 5rem;
                animation: bounce 0.5s ease infinite alternate;
            }

            .level-up-content h2 {
                font-size: 2rem;
                background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 1rem 0 0.5rem;
            }

            .level-title {
                font-size: 1.5rem;
                font-weight: 600;
            }

            .level-congrats {
                color: var(--text-secondary, #94a3b8);
                margin: 1rem 0;
            }

            .level-up-content button {
                padding: 0.75rem 2rem;
                background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
            }

            .level-up-content button:hover {
                transform: scale(1.05);
            }

            @keyframes scaleIn {
                from { transform: scale(0.5); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            @keyframes bounce {
                to { transform: translateY(-10px); }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            /* Achievement Popup */
            .rpg-achievement-popup {
                position: fixed;
                top: 70px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2));
                border: 2px solid var(--accent-orange, #f59e0b);
                padding: 1rem 2rem;
                border-radius: 16px;
                display: flex;
                align-items: center;
                gap: 1rem;
                animation: dropIn 0.5s ease;
                z-index: 10001;
            }

            .achievement-icon {
                font-size: 2.5rem;
            }

            .achievement-title {
                font-weight: 700;
                color: var(--accent-orange, #f59e0b);
            }

            .achievement-desc {
                color: var(--text-secondary, #94a3b8);
                font-size: 0.9rem;
            }

            .rpg-achievement-popup.fade-out {
                animation: dropOut 0.5s ease forwards;
            }

            @keyframes dropIn {
                from { transform: translateX(-50%) translateY(-50px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }

            @keyframes dropOut {
                to { transform: translateX(-50%) translateY(-50px); opacity: 0; }
            }

            /* Track Notification */
            .rpg-track-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--bg-card, #1a1a2e);
                border: 1px solid var(--border, #2d2d44);
                padding: 0.75rem 1.5rem;
                border-radius: 20px;
                font-weight: 600;
                animation: slideUp 0.3s ease;
                z-index: 10001;
            }

            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(50px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }

            /* Profile Modal */
            .rpg-profile-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
                animation: fadeIn 0.2s ease;
                padding: 1rem;
            }

            .profile-content {
                background: var(--bg-secondary, #12121f);
                border-radius: 24px;
                padding: 2rem;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }

            .profile-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: var(--text-secondary, #94a3b8);
                font-size: 1.5rem;
                cursor: pointer;
            }

            .profile-user-info {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                padding: 1rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 12px;
                margin-bottom: 1.5rem;
            }

            .profile-user-avatar {
                font-size: 2rem;
            }

            .profile-user-name {
                font-size: 1.25rem;
                font-weight: 700;
            }

            .switch-profile-btn {
                padding: 0.4rem 0.8rem;
                background: var(--bg-secondary, #12121f);
                border: 1px solid var(--border, #2d2d44);
                border-radius: 8px;
                color: var(--text-secondary, #94a3b8);
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .switch-profile-btn:hover {
                border-color: var(--accent-cyan, #06b6d4);
                color: var(--accent-cyan, #06b6d4);
            }

            .profile-header {
                text-align: center;
                margin-bottom: 1.5rem;
            }

            .profile-level {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                border: 2px solid;
                margin-bottom: 0.5rem;
            }

            .profile-level-icon { font-size: 1.5rem; }
            .profile-level-num { font-weight: 700; }

            .profile-title {
                font-size: 1.5rem;
                margin: 0.5rem 0;
            }

            .profile-xp {
                color: var(--text-secondary, #94a3b8);
            }

            .profile-progress {
                margin-bottom: 1.5rem;
            }

            .profile-progress .progress-bar {
                height: 12px;
                background: var(--bg-card, #1a1a2e);
                border-radius: 6px;
                overflow: hidden;
            }

            .profile-progress .progress-fill {
                height: 100%;
                border-radius: 6px;
                transition: width 0.5s ease;
            }

            .progress-text {
                text-align: center;
                font-size: 0.85rem;
                color: var(--text-secondary, #94a3b8);
                margin-top: 0.5rem;
            }

            .profile-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .stat-item {
                text-align: center;
                background: var(--bg-card, #1a1a2e);
                padding: 1rem;
                border-radius: 12px;
            }

            .stat-value {
                display: block;
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--accent-cyan, #06b6d4);
            }

            .stat-label {
                font-size: 0.75rem;
                color: var(--text-secondary, #94a3b8);
            }

            .profile-achievements h3,
            .profile-track h3 {
                margin-bottom: 1rem;
                font-size: 1rem;
            }

            .achievements-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 0.75rem;
                margin-bottom: 1.5rem;
            }

            .achievement-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.75rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 10px;
                text-align: center;
            }

            .achievement-item.locked {
                opacity: 0.4;
                filter: grayscale(1);
            }

            .achievement-item.unlocked {
                border: 1px solid var(--accent-orange, #f59e0b);
            }

            .ach-icon {
                font-size: 1.5rem;
                margin-bottom: 0.25rem;
            }

            .ach-name {
                font-size: 0.7rem;
                color: var(--text-secondary, #94a3b8);
            }

            .track-selector {
                display: flex;
                gap: 0.5rem;
            }

            .track-btn {
                flex: 1;
                padding: 0.75rem;
                background: var(--bg-card, #1a1a2e);
                border: 1px solid var(--border, #2d2d44);
                border-radius: 10px;
                color: var(--text-primary, #f1f5f9);
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.85rem;
            }

            .track-btn:hover {
                border-color: var(--accent-blue, #3b82f6);
            }

            .track-btn.active {
                background: linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-purple, #8b5cf6));
                border-color: transparent;
            }

            /* Page content offset for status bar */
            body.rpg-enabled {
                padding-top: 50px;
            }

            @media (max-width: 600px) {
                #rpg-status-bar {
                    padding: 0 0.5rem;
                    gap: 0.5rem;
                }

                .rpg-xp-bar {
                    max-width: 100px;
                }

                .profile-stats {
                    grid-template-columns: repeat(2, 1fr);
                }

                .track-selector {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.classList.add('rpg-enabled');
    },

    /**
     * Get player stats summary
     */
    getStats() {
        return {
            level: this.getLevel(),
            stats: this.data.stats,
            streak: this.data.streak,
            achievements: this.data.achievements.length,
            totalAchievements: Object.keys(this.ACHIEVEMENTS).length
        };
    },

    /**
     * Reset all RPG data (for testing)
     */
    reset() {
        if (confirm('Sigur vrei sa stergi progresul RPG? Aceasta actiune nu poate fi anulata.')) {
            localStorage.removeItem(this.STORAGE_KEY);
            location.reload();
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RPG;
}
