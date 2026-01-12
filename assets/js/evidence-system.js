/**
 * LearningHub Evidence Collection System
 * ======================================
 * Collects proof of student work before allowing progress save.
 * Uses Google Forms as backend (static hosting compatible).
 *
 * @version 1.0.0
 * @author Prof. Gurlan Vasile
 */

const EvidenceSystem = {
    // Storage key for evidence submissions
    STORAGE_KEY: 'learninghub_evidence',

    // Configuration (loaded from evidence-config.json)
    config: null,

    // Track if system is initialized
    initialized: false,

    // Current lesson context
    currentContext: null,

    /**
     * Initialize the evidence system
     */
    async init() {
        if (this.initialized) return;

        try {
            await this.loadConfig();
            this.injectStyles();
            this.initialized = true;
            console.log('[EvidenceSystem] Initialized successfully');
        } catch (error) {
            console.warn('[EvidenceSystem] Could not load config, running in offline mode:', error);
            this.config = this.getDefaultConfig();
            this.initialized = true;
        }
    },

    /**
     * Load configuration from JSON file
     */
    async loadConfig() {
        // Try multiple paths (lesson pages are at different depths)
        const paths = [
            '/data/evidence-config.json',
            '../data/evidence-config.json',
            '../../data/evidence-config.json',
            '../../../data/evidence-config.json',
            '../../../../data/evidence-config.json'
        ];

        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    this.config = await response.json();
                    return;
                }
            } catch (e) {
                continue;
            }
        }

        throw new Error('Config file not found');
    },

    /**
     * Get default configuration (fallback)
     */
    getDefaultConfig() {
        return {
            validation: {
                minTextLength: 20,
                scratchUrlPattern: "^https://scratch\\.mit\\.edu/projects/\\d+",
                requiredForModules: ["m2-scratch", "m3-scratch-control", "m5-proiect"]
            },
            ui: {
                modalTitle: "Salvează-ți progresul",
                submitButton: "Trimite",
                cancelButton: "Mai târziu",
                successMessage: "Dovada a fost trimisă! Poți continua.",
                errorMessage: "Te rugăm să completezi toate câmpurile obligatorii."
            }
        };
    },

    /**
     * Check if evidence is required for this lesson
     */
    isEvidenceRequired(grade, module, lesson) {
        if (!this.config) return false;

        const requiredModules = this.config.validation?.requiredForModules || [];
        return requiredModules.includes(module);
    },

    /**
     * Check if evidence has already been submitted for this lesson
     */
    hasEvidence(grade, module, lesson) {
        const profileId = this.getProfileId();
        if (!profileId) return false;

        const key = `${grade}/${module}/${lesson}`;
        const evidence = this.getEvidenceData();
        return evidence[key]?.submitted === true;
    },

    /**
     * Get current profile ID from UserSystem
     */
    getProfileId() {
        if (typeof UserSystem !== 'undefined') {
            return UserSystem.getActiveProfile();
        }
        return localStorage.getItem('learninghub_active_profile') || '_guest';
    },

    /**
     * Get profile data
     */
    getProfileData() {
        const profileId = this.getProfileId();
        if (typeof UserSystem !== 'undefined') {
            const profiles = UserSystem.getProfiles();
            return profiles.find(p => p.id === profileId) || { id: profileId, name: 'Guest' };
        }
        return { id: profileId, name: 'Guest' };
    },

    /**
     * Get stored evidence data
     */
    getEvidenceData() {
        const profileId = this.getProfileId();
        const key = `${this.STORAGE_KEY}_${profileId}`;
        try {
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch (e) {
            return {};
        }
    },

    /**
     * Save evidence data
     */
    saveEvidenceData(data) {
        const profileId = this.getProfileId();
        const key = `${this.STORAGE_KEY}_${profileId}`;
        localStorage.setItem(key, JSON.stringify(data));
    },

    /**
     * Show evidence collection modal
     */
    showEvidenceModal(grade, module, lesson, lessonTitle, onSuccess, onCancel) {
        this.currentContext = { grade, module, lesson, lessonTitle, onSuccess, onCancel };

        // Remove existing modal if any
        const existing = document.getElementById('evidence-modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'evidence-modal-overlay';
        overlay.className = 'evidence-overlay';
        overlay.innerHTML = `
            <div class="evidence-modal">
                <div class="evidence-header">
                    <span class="evidence-icon">📤</span>
                    <h2>${this.config?.ui?.modalTitle || 'Salvează-ți progresul'}</h2>
                </div>

                <div class="evidence-lesson-info">
                    <span class="evidence-badge">${grade.toUpperCase()}</span>
                    <span class="evidence-lesson-title">${lessonTitle}</span>
                </div>

                <form id="evidence-form" class="evidence-form">
                    <div class="evidence-field">
                        <label for="evidence-scratch-url">
                            <span class="field-icon">🔗</span>
                            Link proiect Scratch
                        </label>
                        <input
                            type="url"
                            id="evidence-scratch-url"
                            placeholder="https://scratch.mit.edu/projects/..."
                            pattern="https://scratch\\.mit\\.edu/projects/\\d+.*"
                        >
                        <span class="field-hint">Copiază link-ul proiectului tău din Scratch</span>
                    </div>

                    <div class="evidence-field">
                        <label for="evidence-learned">
                            <span class="field-icon">📖</span>
                            Ce ai învățat? <span class="required">*</span>
                        </label>
                        <textarea
                            id="evidence-learned"
                            rows="3"
                            placeholder="Descrie pe scurt ce ai învățat în această lecție..."
                            required
                            minlength="20"
                        ></textarea>
                        <span class="field-hint char-count" id="learned-count">0 / 20 caractere minim</span>
                    </div>

                    <div class="evidence-field">
                        <label for="evidence-created">
                            <span class="field-icon">🎨</span>
                            Ce ai creat/modificat? <span class="required">*</span>
                        </label>
                        <textarea
                            id="evidence-created"
                            rows="3"
                            placeholder="Descrie ce ai făcut practic (proiect, cod, etc.)..."
                            required
                            minlength="20"
                        ></textarea>
                        <span class="field-hint char-count" id="created-count">0 / 20 caractere minim</span>
                    </div>

                    <div class="evidence-errors" id="evidence-errors"></div>

                    <div class="evidence-buttons">
                        <button type="button" class="btn-cancel" id="evidence-cancel">
                            ${this.config?.ui?.cancelButton || 'Mai târziu'}
                        </button>
                        <button type="submit" class="btn-submit" id="evidence-submit">
                            <span class="btn-text">${this.config?.ui?.submitButton || 'Trimite'}</span>
                            <span class="btn-loading" style="display:none;">⏳</span>
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);

        // Setup event listeners
        this.setupModalEvents();

        // Focus first field
        setTimeout(() => {
            document.getElementById('evidence-scratch-url')?.focus();
        }, 100);
    },

    /**
     * Setup modal event listeners
     */
    setupModalEvents() {
        const form = document.getElementById('evidence-form');
        const cancelBtn = document.getElementById('evidence-cancel');
        const overlay = document.getElementById('evidence-modal-overlay');
        const learnedInput = document.getElementById('evidence-learned');
        const createdInput = document.getElementById('evidence-created');

        // Character counters
        learnedInput?.addEventListener('input', () => {
            const count = learnedInput.value.length;
            const countEl = document.getElementById('learned-count');
            if (countEl) {
                countEl.textContent = `${count} / 20 caractere minim`;
                countEl.classList.toggle('valid', count >= 20);
            }
        });

        createdInput?.addEventListener('input', () => {
            const count = createdInput.value.length;
            const countEl = document.getElementById('created-count');
            if (countEl) {
                countEl.textContent = `${count} / 20 caractere minim`;
                countEl.classList.toggle('valid', count >= 20);
            }
        });

        // Form submit
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        // Cancel button
        cancelBtn?.addEventListener('click', () => {
            this.closeModal();
            if (this.currentContext?.onCancel) {
                this.currentContext.onCancel();
            }
        });

        // Click outside to close
        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal();
                if (this.currentContext?.onCancel) {
                    this.currentContext.onCancel();
                }
            }
        });

        // Escape key
        document.addEventListener('keydown', this.handleEscape.bind(this));
    },

    /**
     * Handle escape key
     */
    handleEscape(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('evidence-modal-overlay');
            if (modal) {
                this.closeModal();
                if (this.currentContext?.onCancel) {
                    this.currentContext.onCancel();
                }
            }
        }
    },

    /**
     * Close modal
     */
    closeModal() {
        const overlay = document.getElementById('evidence-modal-overlay');
        if (overlay) {
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 300);
        }
        document.removeEventListener('keydown', this.handleEscape);
    },

    /**
     * Handle form submission
     */
    async handleSubmit() {
        const scratchUrl = document.getElementById('evidence-scratch-url')?.value.trim();
        const whatLearned = document.getElementById('evidence-learned')?.value.trim();
        const whatCreated = document.getElementById('evidence-created')?.value.trim();
        const errorsEl = document.getElementById('evidence-errors');
        const submitBtn = document.getElementById('evidence-submit');

        // Validate
        const errors = this.validateEvidence({ scratchUrl, whatLearned, whatCreated });

        if (errors.length > 0) {
            if (errorsEl) {
                errorsEl.innerHTML = errors.map(e => `<div class="error-item">⚠️ ${e}</div>`).join('');
            }
            return;
        }

        // Show loading
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').style.display = 'none';
            submitBtn.querySelector('.btn-loading').style.display = 'inline';
        }

        try {
            // Submit to Google Form
            await this.submitToGoogleForm({
                scratchUrl,
                whatLearned,
                whatCreated
            });

            // Save locally
            this.saveSubmission({
                scratchUrl,
                whatLearned,
                whatCreated
            });

            // Show success
            this.showSuccess();

            // Call success callback
            setTimeout(() => {
                this.closeModal();
                if (this.currentContext?.onSuccess) {
                    this.currentContext.onSuccess();
                }
            }, 1500);

        } catch (error) {
            console.error('[EvidenceSystem] Submit error:', error);

            // Still save locally even if Google Form fails
            this.saveSubmission({
                scratchUrl,
                whatLearned,
                whatCreated,
                offlineSubmit: true
            });

            // Show success anyway (offline mode)
            this.showSuccess('Salvat local! Se va sincroniza ulterior.');

            setTimeout(() => {
                this.closeModal();
                if (this.currentContext?.onSuccess) {
                    this.currentContext.onSuccess();
                }
            }, 1500);
        }
    },

    /**
     * Validate evidence data
     */
    validateEvidence({ scratchUrl, whatLearned, whatCreated }) {
        const errors = [];
        const minLength = this.config?.validation?.minTextLength || 20;
        const urlPattern = new RegExp(this.config?.validation?.scratchUrlPattern || "^https://scratch\\.mit\\.edu/projects/\\d+");

        if (scratchUrl && !urlPattern.test(scratchUrl)) {
            errors.push('Link-ul Scratch nu este valid. Trebuie să fie de forma: scratch.mit.edu/projects/NUMAR');
        }

        if (!whatLearned || whatLearned.length < minLength) {
            errors.push(`Răspunsul "Ce ai învățat?" trebuie să aibă cel puțin ${minLength} caractere.`);
        }

        if (!whatCreated || whatCreated.length < minLength) {
            errors.push(`Răspunsul "Ce ai creat?" trebuie să aibă cel puțin ${minLength} caractere.`);
        }

        return errors;
    },

    /**
     * Submit to Google Form via hidden iframe
     */
    async submitToGoogleForm(data) {
        if (!this.config?.googleForm?.formActionUrl ||
            this.config.googleForm.formActionUrl.includes('YOUR_FORM_ID')) {
            console.log('[EvidenceSystem] Google Form not configured, skipping remote submit');
            return;
        }

        const { grade, module, lesson, lessonTitle } = this.currentContext;
        const profile = this.getProfileData();
        const sessionId = this.generateSessionId();

        const formData = new FormData();
        const fields = this.config.googleForm.fields;

        // Map data to form fields
        if (fields.profileId) formData.append(fields.profileId, profile.id);
        if (fields.profileName) formData.append(fields.profileName, profile.name);
        if (fields.grade) formData.append(fields.grade, profile.grade || grade);
        if (fields.module) formData.append(fields.module, module);
        if (fields.lesson) formData.append(fields.lesson, lesson);
        if (fields.lessonTitle) formData.append(fields.lessonTitle, lessonTitle);
        if (fields.scratchUrl) formData.append(fields.scratchUrl, data.scratchUrl || '');
        if (fields.whatLearned) formData.append(fields.whatLearned, data.whatLearned);
        if (fields.whatCreated) formData.append(fields.whatCreated, data.whatCreated);
        if (fields.sessionId) formData.append(fields.sessionId, sessionId);

        // Submit via fetch (no-cors mode for Google Forms)
        await fetch(this.config.googleForm.formActionUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
    },

    /**
     * Save submission locally
     */
    saveSubmission(data) {
        const { grade, module, lesson } = this.currentContext;
        const key = `${grade}/${module}/${lesson}`;

        const evidence = this.getEvidenceData();
        evidence[key] = {
            submitted: true,
            timestamp: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            scratchUrl: data.scratchUrl || null,
            whatLearned: data.whatLearned,
            whatCreated: data.whatCreated,
            offlineSubmit: data.offlineSubmit || false
        };

        this.saveEvidenceData(evidence);
    },

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Show success message
     */
    showSuccess(message) {
        const form = document.getElementById('evidence-form');
        if (form) {
            form.innerHTML = `
                <div class="evidence-success">
                    <div class="success-icon">✅</div>
                    <h3>Trimis cu succes!</h3>
                    <p>${message || this.config?.ui?.successMessage || 'Dovada a fost trimisă!'}</p>
                </div>
            `;
        }
    },

    /**
     * Inject CSS styles
     */
    injectStyles() {
        if (document.getElementById('evidence-system-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'evidence-system-styles';
        styles.textContent = `
            .evidence-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: evidence-fade-in 0.3s ease;
                padding: 1rem;
            }

            .evidence-overlay.closing {
                animation: evidence-fade-out 0.3s ease forwards;
            }

            @keyframes evidence-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes evidence-fade-out {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            .evidence-modal {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: evidence-slide-up 0.3s ease;
            }

            @keyframes evidence-slide-up {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .evidence-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .evidence-icon {
                font-size: 2rem;
            }

            .evidence-header h2 {
                margin: 0;
                font-size: 1.5rem;
                color: #f1f5f9;
            }

            .evidence-lesson-info {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
                padding: 0.75rem 1rem;
                background: rgba(6, 182, 212, 0.1);
                border-radius: 10px;
                border: 1px solid rgba(6, 182, 212, 0.2);
            }

            .evidence-badge {
                background: #06b6d4;
                color: #000;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 700;
            }

            .evidence-lesson-title {
                color: #94a3b8;
                font-size: 0.9rem;
            }

            .evidence-form {
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
            }

            .evidence-field {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .evidence-field label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #f1f5f9;
                font-weight: 600;
                font-size: 0.95rem;
            }

            .field-icon {
                font-size: 1.1rem;
            }

            .required {
                color: #ef4444;
            }

            .evidence-field input,
            .evidence-field textarea {
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 0.75rem 1rem;
                color: #f1f5f9;
                font-size: 0.95rem;
                font-family: inherit;
                transition: all 0.2s;
            }

            .evidence-field input:focus,
            .evidence-field textarea:focus {
                outline: none;
                border-color: #06b6d4;
                background: rgba(6, 182, 212, 0.1);
            }

            .evidence-field textarea {
                resize: vertical;
                min-height: 80px;
            }

            .field-hint {
                font-size: 0.8rem;
                color: #64748b;
            }

            .field-hint.char-count {
                text-align: right;
            }

            .field-hint.char-count.valid {
                color: #10b981;
            }

            .evidence-errors {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .error-item {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 8px;
                padding: 0.75rem 1rem;
                color: #fca5a5;
                font-size: 0.85rem;
            }

            .evidence-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 0.5rem;
            }

            .evidence-buttons button {
                flex: 1;
                padding: 0.875rem 1.5rem;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }

            .btn-cancel {
                background: rgba(255, 255, 255, 0.1);
                color: #94a3b8;
            }

            .btn-cancel:hover {
                background: rgba(255, 255, 255, 0.15);
                color: #f1f5f9;
            }

            .btn-submit {
                background: linear-gradient(135deg, #10b981, #06b6d4);
                color: #000;
            }

            .btn-submit:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            }

            .btn-submit:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }

            .evidence-success {
                text-align: center;
                padding: 2rem;
            }

            .success-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }

            .evidence-success h3 {
                color: #10b981;
                margin-bottom: 0.5rem;
            }

            .evidence-success p {
                color: #94a3b8;
            }

            @media (max-width: 500px) {
                .evidence-modal {
                    padding: 1.5rem;
                    border-radius: 16px;
                }

                .evidence-header h2 {
                    font-size: 1.25rem;
                }

                .evidence-buttons {
                    flex-direction: column;
                }
            }
        `;

        document.head.appendChild(styles);
    },

    /**
     * Quick check method for progress.js integration
     */
    requireEvidenceForCompletion(grade, module, lesson, lessonTitle, onComplete) {
        // Initialize if needed
        if (!this.initialized) {
            this.init().then(() => {
                this._checkAndShowModal(grade, module, lesson, lessonTitle, onComplete);
            });
        } else {
            this._checkAndShowModal(grade, module, lesson, lessonTitle, onComplete);
        }
    },

    _checkAndShowModal(grade, module, lesson, lessonTitle, onComplete) {
        // Check if evidence is required
        if (!this.isEvidenceRequired(grade, module, lesson)) {
            onComplete();
            return;
        }

        // Check if already submitted
        if (this.hasEvidence(grade, module, lesson)) {
            onComplete();
            return;
        }

        // Show modal
        this.showEvidenceModal(
            grade,
            module,
            lesson,
            lessonTitle,
            onComplete,
            () => {} // Cancel - do nothing
        );
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => EvidenceSystem.init());
} else {
    EvidenceSystem.init();
}
