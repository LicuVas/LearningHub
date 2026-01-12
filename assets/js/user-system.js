/**
 * LearningHub Unified User System
 * ================================
 * Single source of truth for user profiles across the entire site.
 *
 * Features:
 * - Multi-profile support (school lab scenario)
 * - Profile creation, selection, switching
 * - Progress reset (all, module, XP, achievements)
 * - Guest mode for visitors
 * - Persistent across all pages
 *
 * Usage:
 *   Include this script BEFORE rpg-system.js and progress.js
 *   <script src="assets/js/user-system.js"></script>
 *
 *   Then call:
 *   UserSystem.init(); // On every page
 *   UserSystem.requireProfile(); // Force profile selection
 */

const UserSystem = {
    PROFILES_KEY: 'learninghub_profiles',
    ACTIVE_PROFILE_KEY: 'learninghub_active_profile',

    // CSS variables for theming
    CSS_VARS: `
        :root {
            --us-bg-primary: #0a0a12;
            --us-bg-secondary: #12121f;
            --us-bg-card: #1a1a2e;
            --us-bg-card-hover: #252545;
            --us-accent-blue: #3b82f6;
            --us-accent-purple: #8b5cf6;
            --us-accent-cyan: #06b6d4;
            --us-accent-green: #10b981;
            --us-accent-orange: #f59e0b;
            --us-accent-red: #ef4444;
            --us-text-primary: #f1f5f9;
            --us-text-secondary: #94a3b8;
            --us-text-muted: #64748b;
            --us-border: #2d2d44;
        }
    `,

    // Available avatars for profiles
    AVATARS: ['🦊', '🐼', '🦁', '🐯', '🐸', '🦉', '🐺', '🦄', '🐲', '🦋', '🐬', '🦅', '🐢', '🦎', '🐙', '🐨', '🦝', '🐹', '🐰', '🦔'],

    // Available grades for evidence reporting
    GRADES: [
        { id: 'cls5', label: 'Clasa a 5-a' },
        { id: 'cls6', label: 'Clasa a 6-a' },
        { id: 'cls7', label: 'Clasa a 7-a' },
        { id: 'cls8', label: 'Clasa a 8-a' }
    ],

    /**
     * Initialize the user system
     * @param {Object} options - Configuration options
     * @param {boolean} options.requireProfile - If true, forces profile selection
     * @param {Function} options.onProfileSelected - Callback when profile is selected
     */
    init(options = {}) {
        this.options = options;
        this.injectStyles();

        const activeProfile = this.getActiveProfile();

        if (!activeProfile && options.requireProfile !== false) {
            this.showProfileSelector();
            return null;
        }

        if (activeProfile && options.onProfileSelected) {
            options.onProfileSelected(activeProfile);
        }

        return activeProfile;
    },

    /**
     * Require a profile to be selected (blocks until selected)
     * @param {Function} callback - Called when profile is selected/confirmed
     */
    requireProfile(callback) {
        const activeProfile = this.getActiveProfile();

        if (activeProfile) {
            if (callback) callback(activeProfile);
            return activeProfile;
        }

        this.showProfileSelector(callback);
        return null;
    },

    /**
     * Get all stored profiles
     */
    getProfiles() {
        try {
            const profiles = localStorage.getItem(this.PROFILES_KEY);
            return profiles ? JSON.parse(profiles) : [];
        } catch (e) {
            console.error('UserSystem: Error reading profiles', e);
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
     * Get currently active profile ID
     */
    getActiveProfile() {
        return localStorage.getItem(this.ACTIVE_PROFILE_KEY);
    },

    /**
     * Get active profile data (full object)
     */
    getActiveProfileData() {
        const activeId = this.getActiveProfile();
        if (!activeId || activeId === '_guest') {
            return activeId === '_guest' ? { id: '_guest', name: 'Vizitator', avatar: '👤' } : null;
        }
        return this.getProfiles().find(p => p.id === activeId) || null;
    },

    /**
     * Set active profile
     */
    setActiveProfile(profileId) {
        localStorage.setItem(this.ACTIVE_PROFILE_KEY, profileId);
    },

    /**
     * Create a new profile
     * @param {string} name - Profile display name
     * @param {string} avatar - Optional avatar emoji
     * @param {string} grade - Student grade (cls5, cls6, cls7, cls8)
     * @returns {string} - The new profile ID
     */
    createProfile(name, avatar = null, grade = null) {
        const profiles = this.getProfiles();
        const profileId = name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);

        // Ensure unique ID
        let uniqueId = profileId;
        let counter = 1;
        while (profiles.find(p => p.id === uniqueId)) {
            uniqueId = `${profileId}_${counter++}`;
        }

        const newProfile = {
            id: uniqueId,
            name: name.substring(0, 20),
            avatar: avatar || this.AVATARS[Math.floor(Math.random() * this.AVATARS.length)],
            grade: grade || 'cls6', // Default to cls6 if not specified
            created: new Date().toISOString()
        };

        profiles.push(newProfile);
        this.saveProfiles(profiles);

        // Initialize empty data for this profile
        this.initProfileData(uniqueId);

        return uniqueId;
    },

    /**
     * Initialize empty data structures for a new profile
     */
    initProfileData(profileId) {
        // RPG data
        const rpgKey = `learninghub_rpg_${profileId}`;
        if (!localStorage.getItem(rpgKey)) {
            localStorage.setItem(rpgKey, JSON.stringify({
                xp: 0,
                achievements: [],
                perfectQuizzes: 0,
                tracksUsed: [],
                currentTrack: 'core',
                streak: { current: 0, lastDate: null, longest: 0 },
                stats: { lessonsCompleted: 0, quizzesPassed: 0, modulesCompleted: 0, totalTime: 0 },
                created: new Date().toISOString()
            }));
        }

        // Progress data
        const progressKey = `learninghub_progress_${profileId}`;
        if (!localStorage.getItem(progressKey)) {
            localStorage.setItem(progressKey, JSON.stringify({}));
        }
    },

    /**
     * Select and activate a profile
     */
    selectProfile(profileId, callback) {
        this.setActiveProfile(profileId);

        // Update other systems to use profile-specific storage
        if (typeof LearningProgress !== 'undefined') {
            LearningProgress.STORAGE_KEY = `learninghub_progress_${profileId}`;
        }

        if (callback) callback(profileId);

        return profileId;
    },

    /**
     * Continue as guest (no profile)
     */
    continueAsGuest(callback) {
        this.setActiveProfile('_guest');
        if (callback) callback('_guest');
    },

    /**
     * Switch to a different profile (shows selector)
     */
    switchProfile(callback) {
        localStorage.removeItem(this.ACTIVE_PROFILE_KEY);
        this.showProfileSelector(callback || (() => location.reload()));
    },

    /**
     * Logout current profile
     */
    logout() {
        localStorage.removeItem(this.ACTIVE_PROFILE_KEY);
        location.reload();
    },

    /**
     * Delete a profile and all its data
     */
    deleteProfile(profileId, confirmFirst = true) {
        if (confirmFirst && !confirm('Esti sigur ca vrei sa stergi acest profil?\nTot progresul va fi pierdut permanent!')) {
            return false;
        }

        // Remove from profiles list
        const profiles = this.getProfiles().filter(p => p.id !== profileId);
        this.saveProfiles(profiles);

        // Remove profile data
        localStorage.removeItem(`learninghub_rpg_${profileId}`);
        localStorage.removeItem(`learninghub_progress_${profileId}`);

        // If this was the active profile, clear it
        if (this.getActiveProfile() === profileId) {
            localStorage.removeItem(this.ACTIVE_PROFILE_KEY);
        }

        return true;
    },

    /**
     * Reset progress for the active profile
     * @param {string} type - 'all', 'xp', 'achievements', or 'progress'
     */
    resetProgress(type = 'all') {
        const profileId = this.getActiveProfile();
        if (!profileId || profileId === '_guest') {
            alert('Nu poti reseta progresul fara un profil!');
            return false;
        }

        const rpgKey = `learninghub_rpg_${profileId}`;
        const progressKey = `learninghub_progress_${profileId}`;

        switch (type) {
            case 'all':
                if (!confirm('Esti sigur ca vrei sa stergi TOT progresul?\nAceasta actiune nu poate fi anulata!')) {
                    return false;
                }
                localStorage.setItem(rpgKey, JSON.stringify({
                    xp: 0,
                    achievements: [],
                    perfectQuizzes: 0,
                    tracksUsed: [],
                    currentTrack: 'core',
                    streak: { current: 0, lastDate: null, longest: 0 },
                    stats: { lessonsCompleted: 0, quizzesPassed: 0, modulesCompleted: 0, totalTime: 0 },
                    created: new Date().toISOString()
                }));
                localStorage.setItem(progressKey, JSON.stringify({}));
                break;

            case 'xp':
                const rpgDataXP = JSON.parse(localStorage.getItem(rpgKey) || '{}');
                rpgDataXP.xp = 0;
                localStorage.setItem(rpgKey, JSON.stringify(rpgDataXP));
                break;

            case 'achievements':
                const rpgDataAch = JSON.parse(localStorage.getItem(rpgKey) || '{}');
                rpgDataAch.achievements = [];
                rpgDataAch.perfectQuizzes = 0;
                localStorage.setItem(rpgKey, JSON.stringify(rpgDataAch));
                break;

            case 'progress':
                localStorage.setItem(progressKey, JSON.stringify({}));
                break;
        }

        return true;
    },

    /**
     * Reset a specific module's progress
     */
    resetModule(grade, module) {
        const profileId = this.getActiveProfile();
        if (!profileId || profileId === '_guest') return false;

        const progressKey = `learninghub_progress_${profileId}`;
        const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');

        if (progress[grade] && progress[grade][module]) {
            delete progress[grade][module];
            localStorage.setItem(progressKey, JSON.stringify(progress));
            return true;
        }

        return false;
    },

    /**
     * Get RPG data for active profile
     */
    getRPGData() {
        const profileId = this.getActiveProfile();
        if (!profileId || profileId === '_guest') return null;

        try {
            const data = localStorage.getItem(`learninghub_rpg_${profileId}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },

    /**
     * Get progress data for active profile
     */
    getProgressData() {
        const profileId = this.getActiveProfile();
        if (!profileId || profileId === '_guest') return {};

        try {
            const data = localStorage.getItem(`learninghub_progress_${profileId}`);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    /**
     * Show the profile selector modal
     */
    showProfileSelector(onSelect = null) {
        // Ensure styles are injected
        this.injectStyles();

        // Remove existing modal if any
        const existing = document.getElementById('us-profile-modal');
        if (existing) existing.remove();

        const profiles = this.getProfiles();

        const modal = document.createElement('div');
        modal.id = 'us-profile-modal';
        modal.className = 'us-modal';
        modal.innerHTML = `
            <div class="us-modal-content">
                <div class="us-modal-icon">🎓</div>
                <h2>Bine ai venit la LearningHub!</h2>
                <p class="us-modal-subtitle">Pentru a-ti salva progresul, selecteaza sau creeaza un profil.</p>

                ${profiles.length > 0 ? `
                    <div class="us-profiles-list">
                        <h4>Profile existente:</h4>
                        ${profiles.map(p => `
                            <button class="us-profile-btn" data-profile="${p.id}">
                                <span class="us-avatar">${p.avatar || '👤'}</span>
                                <span class="us-name">${p.name}</span>
                                ${p.grade ? `<span class="us-grade-tag">${this.GRADES.find(g => g.id === p.grade)?.label || p.grade}</span>` : ''}
                                <span class="us-arrow">→</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="us-divider"><span>sau creeaza unul nou</span></div>
                ` : ''}

                <div class="us-new-profile">
                    <input type="text" id="us-name-input" placeholder="Numele tau (ex: Maria)" maxlength="20" autocomplete="off">
                    <select id="us-grade-select" class="us-grade-select">
                        <option value="" disabled selected>Alege clasa ta</option>
                        ${this.GRADES.map(g => `<option value="${g.id}">${g.label}</option>`).join('')}
                    </select>
                    <button id="us-create-btn" class="us-btn-primary">Creeaza profil</button>
                </div>

                <button id="us-guest-btn" class="us-btn-ghost">Continua fara profil</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Focus input
        setTimeout(() => {
            const input = document.getElementById('us-name-input');
            if (input) input.focus();
        }, 100);

        // Event handlers
        modal.querySelectorAll('.us-profile-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const profileId = btn.dataset.profile;
                this.selectProfile(profileId);
                modal.remove();
                if (onSelect) onSelect(profileId);
            });
        });

        document.getElementById('us-create-btn').addEventListener('click', () => {
            const name = document.getElementById('us-name-input').value.trim();
            const gradeSelect = document.getElementById('us-grade-select');
            const grade = gradeSelect.value;

            // Validate name
            if (name.length < 2) {
                const input = document.getElementById('us-name-input');
                input.style.borderColor = 'var(--us-accent-red)';
                input.placeholder = 'Minim 2 caractere!';
                input.value = '';
                return;
            }

            // Validate grade selection
            if (!grade) {
                gradeSelect.style.borderColor = 'var(--us-accent-red)';
                gradeSelect.classList.add('us-error');
                return;
            }

            const profileId = this.createProfile(name, null, grade);
            this.selectProfile(profileId);
            modal.remove();
            if (onSelect) onSelect(profileId);
        });

        document.getElementById('us-name-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('us-create-btn').click();
            }
        });

        document.getElementById('us-guest-btn').addEventListener('click', () => {
            this.continueAsGuest();
            modal.remove();
            if (onSelect) onSelect('_guest');
        });
    },

    /**
     * Show reset options modal
     */
    showResetModal(onComplete = null) {
        const existing = document.getElementById('us-reset-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'us-reset-modal';
        modal.className = 'us-modal';
        modal.innerHTML = `
            <div class="us-modal-content us-reset-content">
                <h3>🔧 Reseteaza Progresul</h3>
                <p class="us-modal-subtitle">Alege ce vrei sa resetezi:</p>

                <button class="us-reset-option" data-reset="all">
                    <span class="us-reset-icon">🌐</span>
                    <div class="us-reset-info">
                        <strong>Tot site-ul</strong>
                        <small>XP, achievements, toate lectiile</small>
                    </div>
                </button>

                <button class="us-reset-option" data-reset="xp">
                    <span class="us-reset-icon">⭐</span>
                    <div class="us-reset-info">
                        <strong>Doar XP si nivel</strong>
                        <small>Pastreaza lectiile completate</small>
                    </div>
                </button>

                <button class="us-reset-option" data-reset="achievements">
                    <span class="us-reset-icon">🏆</span>
                    <div class="us-reset-info">
                        <strong>Doar achievements</strong>
                        <small>Pastreaza XP si progresul</small>
                    </div>
                </button>

                <button class="us-reset-option" data-reset="progress">
                    <span class="us-reset-icon">📚</span>
                    <div class="us-reset-info">
                        <strong>Doar lectiile</strong>
                        <small>Pastreaza XP si achievements</small>
                    </div>
                </button>

                <button class="us-btn-ghost us-cancel-btn">Anuleaza</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelectorAll('.us-reset-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.reset;
                if (this.resetProgress(type)) {
                    modal.remove();
                    if (onComplete) onComplete(type);
                    else alert('Progresul a fost resetat!');
                }
            });
        });

        modal.querySelector('.us-cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    },

    /**
     * Create a profile badge component (for headers)
     * @returns {HTMLElement}
     */
    createProfileBadge(options = {}) {
        const profile = this.getActiveProfileData();
        if (!profile) return null;

        // Get grade label if available
        const gradeInfo = profile.grade ? this.GRADES.find(g => g.id === profile.grade) : null;
        const gradeLabel = gradeInfo ? gradeInfo.label.replace('Clasa a ', '').replace('-a', '') : '';

        const badge = document.createElement('div');
        badge.className = 'us-profile-badge';
        badge.innerHTML = `
            <span class="us-badge-avatar">${profile.avatar}</span>
            <span class="us-badge-name">${profile.name}</span>
            ${gradeLabel ? `<span class="us-badge-grade">${gradeLabel}</span>` : ''}
            ${options.showMenu !== false ? '<button class="us-badge-menu-btn">▼</button>' : ''}
        `;

        if (options.showMenu !== false) {
            badge.querySelector('.us-badge-menu-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showProfileMenu(badge);
            });
        }

        return badge;
    },

    /**
     * Show profile dropdown menu
     */
    showProfileMenu(anchorElement) {
        const existing = document.getElementById('us-profile-menu');
        if (existing) {
            existing.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.id = 'us-profile-menu';
        menu.className = 'us-menu';
        menu.innerHTML = `
            <button class="us-menu-item" data-action="switch">🔄 Schimba profilul</button>
            <div class="us-menu-divider"></div>
            <button class="us-menu-item" data-action="reset">🔧 Reseteaza progresul</button>
            <div class="us-menu-divider"></div>
            <button class="us-menu-item us-menu-danger" data-action="delete">🗑️ Sterge profilul</button>
        `;

        // Position menu
        const rect = anchorElement.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 8}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;

        document.body.appendChild(menu);

        // Handle actions
        menu.querySelectorAll('.us-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                menu.remove();

                switch (action) {
                    case 'switch':
                        this.switchProfile();
                        break;
                    case 'reset':
                        this.showResetModal();
                        break;
                    case 'delete':
                        const profileId = this.getActiveProfile();
                        if (this.deleteProfile(profileId)) {
                            this.switchProfile();
                        }
                        break;
                }
            });
        });

        // Close on outside click
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && !anchorElement.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 10);
    },

    /**
     * Inject CSS styles
     */
    injectStyles() {
        if (document.getElementById('us-styles')) return;

        const style = document.createElement('style');
        style.id = 'us-styles';
        style.textContent = `
            ${this.CSS_VARS}

            /* Modal Base */
            .us-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100000;
                padding: 1rem;
                animation: us-fadeIn 0.2s ease;
            }

            .us-modal-content {
                background: var(--us-bg-secondary);
                border-radius: 24px;
                padding: 2.5rem;
                max-width: 420px;
                width: 100%;
                text-align: center;
                animation: us-scaleIn 0.3s ease;
            }

            .us-modal-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }

            .us-modal-content h2 {
                font-size: 1.75rem;
                margin-bottom: 0.5rem;
                background: linear-gradient(135deg, var(--us-accent-blue), var(--us-accent-purple));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .us-modal-content h3 {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
            }

            .us-modal-subtitle {
                color: var(--us-text-secondary);
                margin-bottom: 1.5rem;
            }

            /* Profiles List */
            .us-profiles-list {
                margin-bottom: 1rem;
            }

            .us-profiles-list h4 {
                color: var(--us-text-muted);
                font-size: 0.85rem;
                margin-bottom: 0.75rem;
                font-weight: 500;
            }

            .us-profile-btn {
                display: flex;
                align-items: center;
                gap: 1rem;
                width: 100%;
                padding: 1rem 1.25rem;
                background: var(--us-bg-card);
                border: 2px solid var(--us-border);
                border-radius: 12px;
                color: var(--us-text-primary);
                cursor: pointer;
                margin-bottom: 0.5rem;
                transition: all 0.2s ease;
                font-size: 1rem;
            }

            .us-profile-btn:hover {
                border-color: var(--us-accent-blue);
                background: var(--us-bg-card-hover);
                transform: translateX(5px);
            }

            .us-avatar {
                font-size: 1.75rem;
            }

            .us-name {
                flex: 1;
                text-align: left;
                font-weight: 600;
            }

            .us-arrow {
                color: var(--us-text-muted);
                font-size: 1.25rem;
            }

            /* Divider */
            .us-divider {
                color: var(--us-text-muted);
                margin: 1.5rem 0;
                position: relative;
                font-size: 0.9rem;
            }

            .us-divider::before,
            .us-divider::after {
                content: '';
                position: absolute;
                top: 50%;
                width: 30%;
                height: 1px;
                background: var(--us-border);
            }

            .us-divider::before { left: 0; }
            .us-divider::after { right: 0; }

            /* New Profile Form */
            .us-new-profile {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
            }

            #us-name-input {
                padding: 1rem;
                background: var(--us-bg-card);
                border: 2px solid var(--us-border);
                border-radius: 12px;
                color: var(--us-text-primary);
                font-size: 1rem;
                text-align: center;
                transition: border-color 0.2s ease;
            }

            #us-name-input:focus {
                outline: none;
                border-color: var(--us-accent-cyan);
            }

            #us-name-input::placeholder {
                color: var(--us-text-muted);
            }

            /* Buttons */
            .us-btn-primary {
                padding: 1rem;
                background: linear-gradient(135deg, var(--us-accent-green), var(--us-accent-cyan));
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .us-btn-primary:hover {
                transform: scale(1.02);
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            }

            .us-btn-ghost {
                padding: 0.75rem 1.5rem;
                background: transparent;
                border: 1px solid var(--us-border);
                border-radius: 8px;
                color: var(--us-text-muted);
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s ease;
            }

            .us-btn-ghost:hover {
                border-color: var(--us-text-secondary);
                color: var(--us-text-secondary);
            }

            /* Reset Content */
            .us-reset-content {
                max-width: 380px;
            }

            .us-reset-option {
                display: flex;
                align-items: center;
                gap: 1rem;
                width: 100%;
                padding: 1rem;
                background: var(--us-bg-card);
                border: 1px solid var(--us-border);
                border-radius: 12px;
                color: var(--us-text-primary);
                cursor: pointer;
                margin-bottom: 0.75rem;
                text-align: left;
                transition: all 0.2s ease;
            }

            .us-reset-option:hover {
                border-color: var(--us-accent-orange);
                background: var(--us-bg-card-hover);
            }

            .us-reset-icon {
                font-size: 1.5rem;
            }

            .us-reset-info strong {
                display: block;
                margin-bottom: 0.25rem;
            }

            .us-reset-info small {
                color: var(--us-text-muted);
                font-size: 0.8rem;
            }

            .us-cancel-btn {
                margin-top: 0.5rem;
                width: 100%;
            }

            /* Profile Badge */
            .us-profile-badge {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: var(--us-bg-card);
                padding: 0.5rem 1rem;
                border-radius: 25px;
                border: 1px solid var(--us-border);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .us-profile-badge:hover {
                border-color: var(--us-accent-cyan);
            }

            .us-badge-avatar {
                font-size: 1.25rem;
            }

            .us-badge-name {
                font-weight: 600;
                font-size: 0.9rem;
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .us-badge-menu-btn {
                background: none;
                border: none;
                color: var(--us-text-muted);
                cursor: pointer;
                font-size: 0.7rem;
                padding: 0 0.25rem;
            }

            .us-badge-grade {
                font-size: 0.7rem;
                padding: 0.15rem 0.5rem;
                background: var(--us-accent-purple);
                border-radius: 10px;
                color: white;
                font-weight: 600;
            }

            /* Grade Select */
            .us-grade-select {
                padding: 1rem;
                background: var(--us-bg-card);
                border: 2px solid var(--us-border);
                border-radius: 12px;
                color: var(--us-text-primary);
                font-size: 1rem;
                text-align: center;
                cursor: pointer;
                transition: border-color 0.2s ease;
                appearance: none;
                -webkit-appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 1rem center;
            }

            .us-grade-select:focus {
                outline: none;
                border-color: var(--us-accent-cyan);
            }

            .us-grade-select.us-error {
                border-color: var(--us-accent-red);
                animation: us-shake 0.3s ease;
            }

            .us-grade-select option {
                background: var(--us-bg-secondary);
                color: var(--us-text-primary);
                padding: 0.5rem;
            }

            /* Grade tag in profile list */
            .us-grade-tag {
                font-size: 0.7rem;
                padding: 0.2rem 0.5rem;
                background: var(--us-accent-purple);
                border-radius: 8px;
                color: white;
                font-weight: 500;
                margin-left: auto;
                margin-right: 0.5rem;
            }

            @keyframes us-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            /* Dropdown Menu */
            .us-menu {
                background: var(--us-bg-secondary);
                border: 1px solid var(--us-border);
                border-radius: 12px;
                padding: 0.5rem;
                min-width: 200px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                z-index: 100001;
            }

            .us-menu-item {
                display: block;
                width: 100%;
                padding: 0.75rem 1rem;
                background: none;
                border: none;
                color: var(--us-text-primary);
                text-align: left;
                cursor: pointer;
                border-radius: 8px;
                font-size: 0.9rem;
                transition: background 0.2s ease;
            }

            .us-menu-item:hover {
                background: var(--us-bg-card);
            }

            .us-menu-danger {
                color: var(--us-accent-red);
            }

            .us-menu-danger:hover {
                background: rgba(239, 68, 68, 0.1);
            }

            .us-menu-divider {
                height: 1px;
                background: var(--us-border);
                margin: 0.5rem 0;
            }

            /* Animations */
            @keyframes us-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes us-scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            /* Mobile */
            @media (max-width: 480px) {
                .us-modal-content {
                    padding: 1.5rem;
                    border-radius: 20px;
                }

                .us-modal-icon {
                    font-size: 3rem;
                }

                .us-modal-content h2 {
                    font-size: 1.4rem;
                }
            }
        `;

        document.head.appendChild(style);
    }
};

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Don't auto-init, let pages decide when to init
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserSystem;
}
