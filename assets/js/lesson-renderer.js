/**
 * LearningHub Lesson Renderer
 * ============================
 * Renderer pentru lectii in format Universal Lesson Blueprint.
 *
 * Incarca JSON-ul lectiei si genereaza interfata completa cu:
 * - Selector nivel (minim/standard/performanta)
 * - Sectiuni: Why, Competencies, Knowledge, Flow, Assessment
 * - Quiz integrat cu QuizEngine
 * - Progress tracking
 *
 * Usage:
 *   <script src="assets/js/lesson-renderer.js"></script>
 *   const renderer = new LessonRenderer('lesson-container');
 *   await renderer.load('content/gimnaziu/V/m3/V-M3-L01.json', 'V-M3-L01.quiz.json');
 */

class LessonRenderer {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            showProficiencySelector: true,
            showProgressBar: true,
            showTeacherNotes: false,
            defaultLevel: 'standard',
            ...options
        };

        this.lessonData = null;
        this.quizData = null;
        this.currentLevel = this.options.defaultLevel;
        this.currentSection = 'why';
        this.quizEngine = null;

        this.sections = [
            { id: 'why', label: 'De ce?', icon: '🎯' },
            { id: 'competencies', label: 'Ce vei putea?', icon: '📋' },
            { id: 'learn', label: 'Invata', icon: '📚' },
            { id: 'practice', label: 'Exerseaza', icon: '✏️' },
            { id: 'test', label: 'Testeaza', icon: '🧪' }
        ];

        this.injectStyles();
    }

    /**
     * Incarca datele lectiei si quiz-ului
     */
    async load(lessonPath, quizPath = null) {
        try {
            // Incarca lectia
            const lessonResponse = await fetch(lessonPath);
            if (!lessonResponse.ok) throw new Error(`Lesson: HTTP ${lessonResponse.status}`);
            this.lessonData = await lessonResponse.json();

            // Incarca quiz-ul (optional, poate fi in acelasi folder)
            if (quizPath) {
                const quizFullPath = quizPath.startsWith('http') || quizPath.startsWith('/')
                    ? quizPath
                    : lessonPath.replace(/[^/]+\.json$/, quizPath.split('/').pop());

                try {
                    const quizResponse = await fetch(quizFullPath);
                    if (quizResponse.ok) {
                        this.quizData = await quizResponse.json();
                    }
                } catch (e) {
                    console.warn('Quiz not loaded:', e);
                }
            }

            // Restaureaza nivelul selectat
            if (typeof ProficiencySystem !== 'undefined') {
                const savedLevel = ProficiencySystem.getLessonLevel(this.lessonData.meta.lesson_code);
                if (savedLevel) {
                    this.currentLevel = savedLevel;
                }
            }

            // Render
            this.render();

            return this.lessonData;
        } catch (e) {
            console.error('LessonRenderer: Error loading lesson', e);
            this.container.innerHTML = `
                <div class="lr-error">
                    <h3>Eroare la incarcarea lectiei</h3>
                    <p>${e.message}</p>
                </div>
            `;
            return null;
        }
    }

    /**
     * Render complet
     */
    render() {
        if (!this.lessonData) return;

        const meta = this.lessonData.meta;

        this.container.innerHTML = `
            <div class="lr-lesson">
                ${this.renderHeader(meta)}
                ${this.options.showProficiencySelector ? this.renderLevelSelector() : ''}
                ${this.options.showProgressBar ? this.renderProgressBar() : ''}
                <div class="lr-content">
                    ${this.renderSectionNav()}
                    <div class="lr-section-content" id="lr-section-content">
                        ${this.renderSection(this.currentSection)}
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    /**
     * Header cu titlu si meta
     */
    renderHeader(meta) {
        return `
            <header class="lr-header">
                <div class="lr-breadcrumb">
                    <span>Clasa ${meta.grade}</span>
                    <span class="lr-sep">›</span>
                    <span>Modulul ${meta.module_index}</span>
                    <span class="lr-sep">›</span>
                    <span>${meta.lesson_code}</span>
                </div>
                <h1 class="lr-title">${meta.title_ro}</h1>
                <div class="lr-meta">
                    <span class="lr-duration">⏱️ ${meta.duration_minutes} min</span>
                    ${meta.tools?.length ? `<span class="lr-tools">🛠️ ${meta.tools.join(', ')}</span>` : ''}
                </div>
            </header>
        `;
    }

    /**
     * Selector nivel
     */
    renderLevelSelector() {
        if (typeof ProficiencySystem === 'undefined') return '';

        const levels = ProficiencySystem.LEVELS;
        return `
            <div class="lr-level-selector">
                <span class="lr-level-label">Nivel:</span>
                <div class="lr-level-buttons">
                    ${Object.values(levels).map(l => `
                        <button class="lr-level-btn ${l.id === this.currentLevel ? 'active' : ''}"
                                data-level="${l.id}"
                                style="--level-color: ${l.color}">
                            ${l.icon} ${l.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Progress bar pe sectiuni
     */
    renderProgressBar() {
        const currentIdx = this.sections.findIndex(s => s.id === this.currentSection);
        const percent = Math.round(((currentIdx + 1) / this.sections.length) * 100);

        return `
            <div class="lr-progress-bar">
                <div class="lr-progress-fill" style="width: ${percent}%"></div>
            </div>
        `;
    }

    /**
     * Navigare sectiuni
     */
    renderSectionNav() {
        return `
            <nav class="lr-section-nav">
                ${this.sections.map(s => `
                    <button class="lr-nav-btn ${s.id === this.currentSection ? 'active' : ''}"
                            data-section="${s.id}">
                        <span class="lr-nav-icon">${s.icon}</span>
                        <span class="lr-nav-label">${s.label}</span>
                    </button>
                `).join('')}
            </nav>
        `;
    }

    /**
     * Render sectiune specifica
     */
    renderSection(sectionId) {
        switch (sectionId) {
            case 'why':
                return this.renderWhySection();
            case 'competencies':
                return this.renderCompetenciesSection();
            case 'learn':
                return this.renderLearnSection();
            case 'practice':
                return this.renderPracticeSection();
            case 'test':
                return this.renderTestSection();
            default:
                return '<p>Sectiune necunoscuta.</p>';
        }
    }

    /**
     * Sectiunea "De ce?"
     */
    renderWhySection() {
        const why = this.lessonData.why_this_matters;
        if (!why) return '<p>Informatii indisponibile.</p>';

        return `
            <div class="lr-section lr-why">
                <h2>🎯 De ce conteaza?</h2>
                <p class="lr-purpose">${why.purpose_ro}</p>

                <h3>Situatii din viata reala:</h3>
                <ul class="lr-scenarios">
                    ${why.real_life_scenarios.map(s => `<li>${s}</li>`).join('')}
                </ul>

                <div class="lr-nav-buttons">
                    <button class="lr-btn-primary" data-goto="competencies">
                        Continua ➡️
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Sectiunea "Ce vei putea?"
     */
    renderCompetenciesSection() {
        const contract = this.lessonData.competency_contract;
        if (!contract) return '<p>Competente indisponibile.</p>';

        const ican = contract.i_can_statements?.[this.currentLevel] ||
                     contract.i_can_statements?.standard || [];

        return `
            <div class="lr-section lr-competencies">
                <h2>📋 Ce vei putea sa faci?</h2>

                <div class="lr-ican-list">
                    ${ican.map(statement => `
                        <div class="lr-ican-item">
                            <span class="lr-check">☐</span>
                            <span>${statement}</span>
                        </div>
                    `).join('')}
                </div>

                ${contract.official_specific_competencies?.length ? `
                    <details class="lr-official-comp">
                        <summary>📜 Competente oficiale (programa)</summary>
                        <ul>
                            ${contract.official_specific_competencies.map(c =>
                                `<li><strong>${c.id}:</strong> ${c.text_ro}</li>`
                            ).join('')}
                        </ul>
                    </details>
                ` : ''}

                <div class="lr-nav-buttons">
                    <button class="lr-btn-secondary" data-goto="why">⬅️ Inapoi</button>
                    <button class="lr-btn-primary" data-goto="learn">Continua ➡️</button>
                </div>
            </div>
        `;
    }

    /**
     * Sectiunea "Invata"
     */
    renderLearnSection() {
        const flow = this.lessonData.instructional_flow;
        const progression = this.lessonData.knowledge_progression;
        if (!flow) return '<p>Continut indisponibil.</p>';

        return `
            <div class="lr-section lr-learn">
                <h2>📚 Invata</h2>

                <!-- Hook -->
                <div class="lr-hook">
                    <span class="lr-hook-icon">💡</span>
                    <p>${flow.hook_3min}</p>
                </div>

                <!-- Termeni cheie -->
                ${flow.micro_lecture_8_10min ? `
                    <div class="lr-micro-lecture">
                        <h3>Termeni cheie:</h3>
                        <div class="lr-terms">
                            ${flow.micro_lecture_8_10min.key_terms.map(t =>
                                `<span class="lr-term">${t}</span>`
                            ).join('')}
                        </div>

                        <div class="lr-eli12">
                            <strong>Pe scurt:</strong> ${flow.micro_lecture_8_10min.explain_like_im_12}
                        </div>

                        <h3>Reguli importante:</h3>
                        <ul class="lr-rules">
                            ${flow.micro_lecture_8_10min.rules_and_checks.map(r =>
                                `<li>${r}</li>`
                            ).join('')}
                        </ul>
                    </div>
                ` : ''}

                <!-- Worked examples -->
                ${flow.worked_examples_10min?.length ? `
                    <div class="lr-examples">
                        <h3>Exemple rezolvate:</h3>
                        ${flow.worked_examples_10min.map(ex => `
                            <div class="lr-example">
                                <h4>${ex.example_title}</h4>
                                <ol class="lr-steps">
                                    ${ex.steps.map(s => `<li>${s}</li>`).join('')}
                                </ol>
                                ${ex.teacher_thinks_aloud?.length ? `
                                    <details class="lr-think-aloud">
                                        <summary>🤔 Cum gandeste profesorul:</summary>
                                        <ul>
                                            ${ex.teacher_thinks_aloud.map(t => `<li>${t}</li>`).join('')}
                                        </ul>
                                    </details>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Common misconceptions -->
                ${progression?.common_misconceptions?.length ? `
                    <div class="lr-misconceptions">
                        <h3>⚠️ Greseli frecvente:</h3>
                        ${progression.common_misconceptions.map(m => `
                            <div class="lr-misconception">
                                <p class="lr-wrong"><strong>Greseala:</strong> ${m.misconception}</p>
                                <p class="lr-fix"><strong>Solutie:</strong> ${m.fix_strategy}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="lr-nav-buttons">
                    <button class="lr-btn-secondary" data-goto="competencies">⬅️ Inapoi</button>
                    <button class="lr-btn-primary" data-goto="practice">Exerseaza ➡️</button>
                </div>
            </div>
        `;
    }

    /**
     * Sectiunea "Exerseaza"
     */
    renderPracticeSection() {
        const flow = this.lessonData.instructional_flow;
        if (!flow) return '<p>Exercitii indisponibile.</p>';

        // Guided practice
        const guided = flow.guided_practice_12min || [];

        // Independent practice pentru nivelul curent
        const independent = flow.independent_practice_12min?.[this.currentLevel] ||
                           flow.independent_practice_12min?.standard || [];

        return `
            <div class="lr-section lr-practice">
                <h2>✏️ Exerseaza</h2>

                <!-- Guided practice -->
                ${guided.length ? `
                    <div class="lr-guided">
                        <h3>Practica ghidata:</h3>
                        ${guided.map((g, idx) => `
                            <div class="lr-guided-task">
                                <p class="lr-task-desc">${g.task}</p>
                                ${g.scaffold?.length ? `
                                    <details>
                                        <summary>💡 Indicii</summary>
                                        <ul>${g.scaffold.map(s => `<li>${s}</li>`).join('')}</ul>
                                    </details>
                                ` : ''}
                                <div class="lr-success-criteria">
                                    <strong>Criterii de succes:</strong>
                                    <ul>
                                        ${g.success_criteria.map(c => `
                                            <li><label><input type="checkbox"> ${c}</label></li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Independent practice -->
                ${independent.length ? `
                    <div class="lr-independent">
                        <h3>Practica independenta (nivel ${this.currentLevel}):</h3>
                        ${independent.map((task, idx) => `
                            <div class="lr-independent-task">
                                <p><strong>Sarcina ${idx + 1}:</strong> ${task.task}</p>
                                <p class="lr-expected"><em>Rezultat asteptat:</em> ${task.expected_output}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="lr-nav-buttons">
                    <button class="lr-btn-secondary" data-goto="learn">⬅️ Inapoi</button>
                    <button class="lr-btn-primary" data-goto="test">Test final ➡️</button>
                </div>
            </div>
        `;
    }

    /**
     * Sectiunea "Test"
     */
    renderTestSection() {
        if (!this.quizData) {
            return `
                <div class="lr-section lr-test">
                    <h2>🧪 Test final</h2>
                    <p>Quiz-ul nu este disponibil pentru aceasta lectie.</p>
                    <div class="lr-nav-buttons">
                        <button class="lr-btn-secondary" data-goto="practice">⬅️ Inapoi</button>
                    </div>
                </div>
            `;
        }

        // Initializeaza QuizEngine
        if (typeof QuizEngine !== 'undefined') {
            this.quizEngine = new QuizEngine();
            this.quizEngine.setQuestionBank(this.quizData);
            this.quizEngine.generateQuiz(this.currentLevel, 4);
        }

        return `
            <div class="lr-section lr-test">
                <h2>🧪 Test final (nivel ${this.currentLevel})</h2>

                <div id="lr-quiz-container">
                    ${this.quizEngine ? this.quizEngine.renderQuizHTML() : '<p>Quiz indisponibil.</p>'}
                </div>

                <div class="lr-quiz-actions">
                    <button class="lr-btn-check" id="lr-check-quiz">
                        Verifica raspunsurile
                    </button>
                </div>

                <div id="lr-quiz-results"></div>

                <div class="lr-nav-buttons">
                    <button class="lr-btn-secondary" data-goto="practice">⬅️ Inapoi</button>
                    <button class="lr-btn-primary lr-btn-complete" id="lr-complete-lesson" style="display: none;">
                        ✅ Marcheaza lectia ca terminata
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Ataseaza event listeners
     */
    attachEventListeners() {
        // Level selector
        this.container.querySelectorAll('.lr-level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentLevel = btn.dataset.level;

                // Salveaza in ProficiencySystem
                if (typeof ProficiencySystem !== 'undefined') {
                    ProficiencySystem.setLessonLevel(
                        this.lessonData.meta.lesson_code,
                        this.currentLevel
                    );
                }

                // Update UI
                this.container.querySelectorAll('.lr-level-btn').forEach(b =>
                    b.classList.toggle('active', b.dataset.level === this.currentLevel)
                );

                // Re-render sectiunea curenta daca e relevanta
                if (['practice', 'test'].includes(this.currentSection)) {
                    this.navigateToSection(this.currentSection);
                }
            });
        });

        // Section navigation
        this.container.querySelectorAll('.lr-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.navigateToSection(btn.dataset.section);
            });
        });

        // Goto buttons
        this.container.querySelectorAll('[data-goto]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.navigateToSection(btn.dataset.goto);
            });
        });

        // Quiz check button
        const checkBtn = this.container.querySelector('#lr-check-quiz');
        if (checkBtn && this.quizEngine) {
            // Attach quiz listeners
            const quizContainer = this.container.querySelector('#lr-quiz-container');
            this.quizEngine.attachListeners(quizContainer);

            checkBtn.addEventListener('click', () => {
                const result = this.quizEngine.showResults(quizContainer);
                const resultsDiv = this.container.querySelector('#lr-quiz-results');
                resultsDiv.innerHTML = result.html;

                // Show complete button if passed
                if (result.passed) {
                    this.container.querySelector('#lr-complete-lesson').style.display = 'inline-flex';

                    // Record in ProficiencySystem
                    if (typeof ProficiencySystem !== 'undefined') {
                        ProficiencySystem.recordQuizScore(
                            this.lessonData.meta.lesson_code,
                            this.currentLevel,
                            result.score,
                            result.total
                        );
                    }
                }

                checkBtn.textContent = 'Incearca din nou';
                checkBtn.onclick = () => {
                    this.quizEngine.reset();
                    this.navigateToSection('test');
                };
            });
        }

        // Complete lesson button
        const completeBtn = this.container.querySelector('#lr-complete-lesson');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                // Mark complete in Progress system
                if (typeof LearningProgress !== 'undefined') {
                    const meta = this.lessonData.meta;
                    LearningProgress.completeLesson(
                        `cls${meta.grade === 'V' ? '5' : meta.grade === 'VI' ? '6' : meta.grade === 'VII' ? '7' : '8'}`,
                        `m${meta.module_index}`,
                        meta.lesson_code
                    );
                }

                // Show celebration
                completeBtn.innerHTML = '🎉 Lectie completata!';
                completeBtn.disabled = true;
                completeBtn.classList.add('completed');
            });
        }
    }

    /**
     * Navigheaza la o sectiune
     */
    navigateToSection(sectionId) {
        this.currentSection = sectionId;

        // Update nav buttons
        this.container.querySelectorAll('.lr-nav-btn').forEach(btn =>
            btn.classList.toggle('active', btn.dataset.section === sectionId)
        );

        // Update progress bar
        const progressFill = this.container.querySelector('.lr-progress-fill');
        if (progressFill) {
            const currentIdx = this.sections.findIndex(s => s.id === sectionId);
            const percent = Math.round(((currentIdx + 1) / this.sections.length) * 100);
            progressFill.style.width = `${percent}%`;
        }

        // Render new section
        const contentDiv = this.container.querySelector('#lr-section-content');
        if (contentDiv) {
            contentDiv.innerHTML = this.renderSection(sectionId);
            this.attachEventListeners();
        }
    }

    /**
     * Inject CSS styles
     */
    injectStyles() {
        if (document.getElementById('lesson-renderer-styles')) return;

        const style = document.createElement('style');
        style.id = 'lesson-renderer-styles';
        style.textContent = `
            .lr-lesson {
                max-width: 800px;
                margin: 0 auto;
                padding: 1rem;
            }

            .lr-header {
                margin-bottom: 1.5rem;
            }

            .lr-breadcrumb {
                font-size: 0.85rem;
                color: var(--text-muted, #64748b);
                margin-bottom: 0.5rem;
            }

            .lr-sep {
                margin: 0 0.5rem;
                opacity: 0.5;
            }

            .lr-title {
                font-size: 1.75rem;
                margin-bottom: 0.5rem;
                background: linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-purple, #8b5cf6));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .lr-meta {
                display: flex;
                gap: 1rem;
                font-size: 0.9rem;
                color: var(--text-secondary, #94a3b8);
            }

            /* Level selector */
            .lr-level-selector {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
                padding: 0.75rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 12px;
            }

            .lr-level-label {
                font-size: 0.9rem;
                color: var(--text-secondary, #94a3b8);
            }

            .lr-level-buttons {
                display: flex;
                gap: 0.5rem;
            }

            .lr-level-btn {
                padding: 0.5rem 1rem;
                background: var(--bg-secondary, #12121f);
                border: 2px solid var(--border, #2d2d44);
                border-radius: 8px;
                color: var(--text-primary, #f1f5f9);
                cursor: pointer;
                font-size: 0.85rem;
                transition: all 0.2s ease;
            }

            .lr-level-btn:hover {
                border-color: var(--level-color);
            }

            .lr-level-btn.active {
                border-color: var(--level-color);
                background: color-mix(in srgb, var(--level-color) 20%, var(--bg-secondary));
            }

            /* Progress bar */
            .lr-progress-bar {
                height: 4px;
                background: var(--bg-card, #1a1a2e);
                border-radius: 2px;
                margin-bottom: 1rem;
                overflow: hidden;
            }

            .lr-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--accent-blue, #3b82f6), var(--accent-purple, #8b5cf6));
                transition: width 0.3s ease;
            }

            /* Section nav */
            .lr-section-nav {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
                overflow-x: auto;
                padding-bottom: 0.5rem;
            }

            .lr-nav-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                background: var(--bg-card, #1a1a2e);
                border: 2px solid var(--border, #2d2d44);
                border-radius: 10px;
                color: var(--text-secondary, #94a3b8);
                cursor: pointer;
                white-space: nowrap;
                transition: all 0.2s ease;
            }

            .lr-nav-btn:hover {
                border-color: var(--accent-blue, #3b82f6);
            }

            .lr-nav-btn.active {
                border-color: var(--accent-blue, #3b82f6);
                background: rgba(59, 130, 246, 0.15);
                color: var(--text-primary, #f1f5f9);
            }

            .lr-nav-icon {
                font-size: 1.1rem;
            }

            /* Section content */
            .lr-section {
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .lr-section h2 {
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }

            .lr-section h3 {
                margin: 1.5rem 0 0.75rem;
                font-size: 1.1rem;
                color: var(--text-secondary, #94a3b8);
            }

            /* Why section */
            .lr-purpose {
                font-size: 1.1rem;
                line-height: 1.7;
                padding: 1rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 12px;
                border-left: 4px solid var(--accent-green, #10b981);
            }

            .lr-scenarios {
                padding-left: 1.5rem;
            }

            .lr-scenarios li {
                margin-bottom: 0.5rem;
                line-height: 1.6;
            }

            /* Competencies */
            .lr-ican-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .lr-ican-item {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 8px;
            }

            .lr-check {
                font-size: 1.2rem;
            }

            .lr-official-comp {
                margin-top: 1.5rem;
                padding: 1rem;
                background: var(--bg-secondary, #12121f);
                border-radius: 8px;
            }

            .lr-official-comp summary {
                cursor: pointer;
                color: var(--text-muted, #64748b);
            }

            /* Learn section */
            .lr-hook {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1rem;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
                border-radius: 12px;
                margin-bottom: 1.5rem;
            }

            .lr-hook-icon {
                font-size: 1.5rem;
            }

            .lr-terms {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }

            .lr-term {
                padding: 0.35rem 0.75rem;
                background: var(--bg-card, #1a1a2e);
                border: 1px solid var(--border, #2d2d44);
                border-radius: 20px;
                font-size: 0.85rem;
            }

            .lr-eli12 {
                padding: 1rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 8px;
                margin-top: 1rem;
                line-height: 1.6;
            }

            .lr-rules {
                padding-left: 1.5rem;
            }

            .lr-rules li {
                margin-bottom: 0.5rem;
            }

            .lr-example {
                padding: 1rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 8px;
                margin-bottom: 1rem;
            }

            .lr-example h4 {
                margin-bottom: 0.75rem;
                color: var(--accent-cyan, #06b6d4);
            }

            .lr-steps {
                padding-left: 1.5rem;
            }

            .lr-steps li {
                margin-bottom: 0.5rem;
            }

            .lr-think-aloud {
                margin-top: 1rem;
                padding: 0.75rem;
                background: var(--bg-secondary, #12121f);
                border-radius: 6px;
            }

            .lr-think-aloud summary {
                cursor: pointer;
                color: var(--text-muted, #64748b);
            }

            .lr-misconceptions {
                margin-top: 1.5rem;
            }

            .lr-misconception {
                padding: 1rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 8px;
                margin-bottom: 0.75rem;
            }

            .lr-wrong {
                color: var(--accent-red, #ef4444);
            }

            .lr-fix {
                color: var(--accent-green, #10b981);
            }

            /* Practice section */
            .lr-guided-task,
            .lr-independent-task {
                padding: 1rem;
                background: var(--bg-card, #1a1a2e);
                border-radius: 8px;
                margin-bottom: 1rem;
            }

            .lr-task-desc {
                font-weight: 500;
                margin-bottom: 0.75rem;
            }

            .lr-success-criteria ul {
                list-style: none;
                padding: 0;
                margin-top: 0.5rem;
            }

            .lr-success-criteria li {
                margin-bottom: 0.35rem;
            }

            .lr-success-criteria input {
                margin-right: 0.5rem;
            }

            .lr-expected {
                font-size: 0.9rem;
                color: var(--text-muted, #64748b);
            }

            /* Test section */
            .lr-quiz-actions {
                margin-top: 1.5rem;
                text-align: center;
            }

            .lr-btn-check {
                padding: 0.875rem 2rem;
                background: linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-purple, #8b5cf6));
                border: none;
                border-radius: 10px;
                color: white;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .lr-btn-check:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
            }

            /* Navigation buttons */
            .lr-nav-buttons {
                display: flex;
                justify-content: space-between;
                gap: 1rem;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border, #2d2d44);
            }

            .lr-btn-primary,
            .lr-btn-secondary {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-size: 0.95rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .lr-btn-primary {
                background: linear-gradient(135deg, var(--accent-green, #10b981), var(--accent-cyan, #06b6d4));
                color: white;
            }

            .lr-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
            }

            .lr-btn-secondary {
                background: var(--bg-card, #1a1a2e);
                color: var(--text-secondary, #94a3b8);
                border: 1px solid var(--border, #2d2d44);
            }

            .lr-btn-secondary:hover {
                border-color: var(--text-muted, #64748b);
            }

            .lr-btn-complete.completed {
                background: var(--accent-green, #10b981);
            }

            /* Error */
            .lr-error {
                text-align: center;
                padding: 2rem;
                color: var(--accent-red, #ef4444);
            }

            /* Mobile */
            @media (max-width: 600px) {
                .lr-level-selector {
                    flex-direction: column;
                    align-items: stretch;
                }

                .lr-level-buttons {
                    flex-wrap: wrap;
                }

                .lr-nav-btn {
                    padding: 0.5rem 0.75rem;
                }

                .lr-nav-label {
                    display: none;
                }

                .lr-nav-buttons {
                    flex-direction: column;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LessonRenderer;
}
