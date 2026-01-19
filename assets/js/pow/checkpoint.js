/**
 * LearningHub PoW Checkpoint System
 * ==================================
 * Renders checkpoint forms from declarative JSON configuration.
 * Validates input and saves completion to localStorage.
 *
 * @version 1.0.0
 * @depends storage.js, validator.js
 */

const PowCheckpoint = {
    // Configuration
    config: null,
    configLoaded: false,

    // Current checkpoint context
    currentLesson: null,
    currentFields: null,

    /**
     * Initialize the checkpoint system
     */
    async init() {
        await this.loadConfig();
        this.injectStyles();
        this.renderAllCheckpoints();
        console.log('[PowCheckpoint] Initialized');
    },

    /**
     * Load central configuration
     */
    async loadConfig() {
        if (this.configLoaded) return;

        const paths = [
            '/data/pow-config.json',
            '../data/pow-config.json',
            '../../data/pow-config.json',
            '../../../data/pow-config.json',
            '../../../../data/pow-config.json'
        ];

        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    this.config = await response.json();
                    this.configLoaded = true;
                    return;
                }
            } catch (e) {
                continue;
            }
        }

        // Use defaults if config not found
        this.config = this.getDefaultConfig();
        this.configLoaded = true;
    },

    /**
     * Get default configuration
     */
    getDefaultConfig() {
        return {
            defaultCheckpoint: {
                fields: [
                    { name: 'whatLearned', type: 'textarea', minChars: 30, required: true, label: 'Ce ai invitat?' },
                    { name: 'whatCreated', type: 'textarea', minChars: 20, required: true, label: 'Ce ai creat/modificat?' }
                ]
            },
            moduleOverrides: {},
            lessonOverrides: {},
            ui: {
                title: 'Checkpoint',
                submitButton: 'Completeaza lectia',
                successMessage: 'Felicitari! Lectia a fost completata.'
            }
        };
    },

    /**
     * Find and render all checkpoint placeholders
     */
    renderAllCheckpoints() {
        const placeholders = document.querySelectorAll('.pow-checkpoint');
        placeholders.forEach(el => this.renderCheckpoint(el));
    },

    /**
     * Render a single checkpoint form
     */
    renderCheckpoint(container) {
        // Parse data-pow JSON
        let powData = {};
        try {
            const rawData = container.getAttribute('data-pow');
            if (rawData) {
                powData = JSON.parse(rawData);
            }
        } catch (e) {
            console.error('[PowCheckpoint] Invalid data-pow JSON:', e);
        }

        const lessonId = powData.lessonId || this.detectLessonId();
        const fields = this.getFieldsForLesson(lessonId, powData);

        this.currentLesson = lessonId;
        this.currentFields = fields;

        // Check if already completed
        if (PowStorage.isLessonComplete(lessonId)) {
            this.renderCompleted(container, lessonId);
            return;
        }

        // Render form
        this.renderForm(container, lessonId, fields);
    },

    /**
     * Detect lesson ID from page context
     */
    detectLessonId() {
        // Try to get from page metadata
        const meta = document.querySelector('meta[name="lesson-id"]');
        if (meta) return meta.content;

        // Try to construct from URL
        const path = window.location.pathname;
        const match = path.match(/content\/tic\/(cls\d+)\/([^\/]+)\/([^\/]+)\.html/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }

        // Try to get from LearningProgress if initialized
        if (typeof LearningProgress !== 'undefined' && LearningProgress.currentLesson) {
            return `${LearningProgress.currentGrade}-${LearningProgress.currentModule}-${LearningProgress.currentLesson}`;
        }

        return 'unknown-lesson';
    },

    /**
     * Get fields for a specific lesson (with overrides)
     */
    getFieldsForLesson(lessonId, powData) {
        // Start with provided fields or defaults
        let fields = powData.fields || this.config.defaultCheckpoint.fields;

        // Check for lesson-specific overrides
        if (this.config.lessonOverrides?.[lessonId]) {
            fields = this.config.lessonOverrides[lessonId].fields || fields;
        }

        // Check for module overrides
        const moduleMatch = lessonId.match(/^(cls\d+-[^-]+)/);
        if (moduleMatch) {
            const moduleId = moduleMatch[1];
            const moduleConfig = this.config.moduleOverrides?.[moduleId.split('-')[1]];
            if (moduleConfig?.additionalFields) {
                fields = [...fields, ...moduleConfig.additionalFields];
            }
        }

        return fields;
    },

    /**
     * Render the checkpoint form
     */
    renderForm(container, lessonId, fields) {
        const title = this.config.ui?.title || 'Checkpoint';

        container.innerHTML = `
            <div class="pow-checkpoint-box">
                <div class="pow-header">
                    <span class="pow-icon">📝</span>
                    <h3 class="pow-title">${title}</h3>
                </div>
                <p class="pow-description">Completeaza acest formular pentru a termina lectia.</p>
                <form class="pow-form" id="pow-form-${lessonId}">
                    ${fields.map(f => this.renderField(f)).join('')}
                    <div class="pow-errors" id="pow-errors-${lessonId}"></div>
                    <button type="submit" class="pow-submit">
                        <span class="pow-submit-text">${this.config.ui?.submitButton || 'Completeaza lectia'}</span>
                        <span class="pow-submit-loading" style="display:none;">Se trimite...</span>
                    </button>
                </form>
            </div>
        `;

        // Setup character counters
        fields.forEach(f => {
            if (f.minChars) {
                const input = container.querySelector(`#pow-field-${f.name}`);
                const counter = container.querySelector(`#pow-counter-${f.name}`);
                if (input && counter) {
                    input.addEventListener('input', () => {
                        const len = input.value.length;
                        counter.textContent = `${len} / ${f.minChars} caractere`;
                        counter.classList.toggle('pow-counter-valid', len >= f.minChars);
                    });
                }
            }
        });

        // Form submit handler
        const form = container.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(container, lessonId, fields);
        });
    },

    /**
     * Render a single form field
     */
    renderField(field) {
        const required = field.required !== false && field.optional !== true;
        const label = field.label || this.getDefaultLabel(field.name);

        let inputHtml = '';

        switch (field.type) {
            case 'textarea':
                inputHtml = `
                    <textarea
                        id="pow-field-${field.name}"
                        name="${field.name}"
                        rows="3"
                        placeholder="${field.placeholder || ''}"
                        ${required ? 'required' : ''}
                    ></textarea>
                `;
                break;

            case 'url':
                inputHtml = `
                    <input
                        type="url"
                        id="pow-field-${field.name}"
                        name="${field.name}"
                        placeholder="${field.placeholder || 'https://...'}"
                        ${required ? 'required' : ''}
                    >
                `;
                break;

            default:
                inputHtml = `
                    <input
                        type="text"
                        id="pow-field-${field.name}"
                        name="${field.name}"
                        placeholder="${field.placeholder || ''}"
                        ${required ? 'required' : ''}
                    >
                `;
        }

        return `
            <div class="pow-field">
                <label for="pow-field-${field.name}">
                    ${label}
                    ${required ? '<span class="pow-required">*</span>' : ''}
                </label>
                ${inputHtml}
                ${field.minChars ? `<span class="pow-counter" id="pow-counter-${field.name}">0 / ${field.minChars} caractere</span>` : ''}
                ${field.hint ? `<span class="pow-hint">${field.hint}</span>` : ''}
                <div class="pow-field-error" id="pow-error-${field.name}"></div>
            </div>
        `;
    },

    /**
     * Get default label for common field names
     */
    getDefaultLabel(name) {
        const labels = {
            whatLearned: 'Ce ai invitat in aceasta lectie?',
            whatCreated: 'Ce ai creat sau modificat?',
            scratchUrl: 'Link proiect Scratch',
            projectUrl: 'Link proiect',
            explanation: 'Explicatie'
        };
        return labels[name] || name;
    },

    /**
     * Handle form submission
     */
    handleSubmit(container, lessonId, fields) {
        const form = container.querySelector('form');
        const errorsContainer = container.querySelector(`#pow-errors-${lessonId}`);
        const submitBtn = container.querySelector('.pow-submit');

        // Collect values
        const values = {};
        fields.forEach(f => {
            const input = form.querySelector(`#pow-field-${f.name}`);
            values[f.name] = input ? input.value.trim() : '';
        });

        // Validate
        const validation = PowValidator.validateAll(values, fields);

        // Clear previous errors
        errorsContainer.innerHTML = '';
        container.querySelectorAll('.pow-field-error').forEach(el => el.textContent = '');
        container.querySelectorAll('.pow-field').forEach(el => el.classList.remove('has-error'));

        if (!validation.valid) {
            // Show field-specific errors
            for (const fieldName in validation.fieldErrors) {
                const fieldEl = container.querySelector(`#pow-error-${fieldName}`);
                const fieldContainer = container.querySelector(`#pow-field-${fieldName}`)?.closest('.pow-field');
                if (fieldEl) {
                    fieldEl.textContent = validation.fieldErrors[fieldName].join('. ');
                }
                if (fieldContainer) {
                    fieldContainer.classList.add('has-error');
                }
            }
            return;
        }

        // Show loading
        submitBtn.disabled = true;
        submitBtn.querySelector('.pow-submit-text').style.display = 'none';
        submitBtn.querySelector('.pow-submit-loading').style.display = 'inline';

        // Save completion
        PowStorage.completeLessonPow(lessonId, values);

        // Show success
        setTimeout(() => {
            this.renderCompleted(container, lessonId);

            // Trigger navigation gating update
            if (typeof NavigationGating !== 'undefined') {
                NavigationGating.checkAndUnlock(lessonId);
            }

            // Trigger progress update
            if (typeof LearningProgress !== 'undefined') {
                LearningProgress._doComplete();
            }

        }, 500);
    },

    /**
     * Render completed state
     */
    renderCompleted(container, lessonId) {
        const data = PowStorage.getLessonData(lessonId);
        const completedAt = data?.completedAt ? new Date(data.completedAt).toLocaleDateString('ro-RO') : '';

        container.innerHTML = `
            <div class="pow-checkpoint-box pow-completed">
                <div class="pow-success">
                    <div class="pow-success-icon">✅</div>
                    <h3>Lectia completata!</h3>
                    ${completedAt ? `<p class="pow-completed-date">Terminata pe ${completedAt}</p>` : ''}
                </div>
            </div>
        `;

        // Mark container as completed for CSS
        container.classList.add('is-completed');
    },

    /**
     * Inject CSS (minimal - main styles in pow.css)
     */
    injectStyles() {
        if (document.getElementById('pow-checkpoint-styles')) return;

        const style = document.createElement('style');
        style.id = 'pow-checkpoint-styles';
        style.textContent = `
            /* Fallback styles if pow.css not loaded */
            .pow-checkpoint-box { margin: 2rem 0; }
        `;
        document.head.appendChild(style);
    }
};

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PowCheckpoint.init());
} else {
    PowCheckpoint.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PowCheckpoint;
}
