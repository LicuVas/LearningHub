/**
 * Atomic Learning System for LearningHub
 * =======================================
 * Implements the "read → answer immediately" pattern
 *
 * Each concept block contains:
 * - Content explanation
 * - Inline quiz (1-2 questions)
 * - Hint system on wrong answer
 * - Gating until correct answer
 *
 * Usage:
 *   <div class="atom" data-atom-id="cpu">
 *     <div class="atom-content">...content...</div>
 *     <div class="atom-quiz" data-quiz='[{...question...}]'></div>
 *   </div>
 *
 *   AtomicLearning.init();
 */

const AtomicLearning = {
    // State
    atoms: {},
    completedAtoms: new Set(),
    currentLessonId: null,

    // Settings
    settings: {
        requireCorrectToProgress: true,
        stepByStep: true,  // un atom = un ecran (vezi setupStepByStep)
        maxHints: 1,  // Show hint immediately on wrong answer
        lockAfterAnswer: true,  // Lock answer - no changing allowed
        animationDuration: 300,
        saveProgress: true
    },

    /**
     * Initialize the atomic learning system
     * @param {string} lessonId - Unique lesson identifier for progress tracking
     * @param {object} options - Override default settings
     */
    init: function(lessonId, options = {}) {
        this.currentLessonId = lessonId;
        this.settings = { ...this.settings, ...options };

        // Cache profile ID at init time to ensure consistent storage key throughout session
        this.cachedProfileId = null;
        if (typeof UserSystem !== 'undefined') {
            const activeProfile = UserSystem.getActiveProfile();
            if (activeProfile && activeProfile !== '_guest') {
                this.cachedProfileId = activeProfile;
            }
        }

        // Load saved progress
        if (this.settings.saveProgress) {
            this.loadProgress();
        }

        // Find and initialize all atoms
        document.querySelectorAll('.atom').forEach(atomEl => {
            this.initAtom(atomEl);
        });

        // Setup gating
        if (this.settings.requireCorrectToProgress) {
            this.setupGating();
        }

        this.injectStyles();

        // Un atom = un ecran. DUPA injectStyles, ca stilurile sa fie deja acolo.
        if (this.settings.stepByStep) {
            try {
                this.setupStepByStep();
            } catch (e) {
                // Daca pasul-cu-pasul nu se poate monta pe structura paginii,
                // lectia ramane exact cum era. Nu blocam invatarea pentru un ornament.
                console.warn('AtomicLearning: step-by-step indisponibil pe pagina asta', e);
                document.querySelectorAll('.ux-step-hidden').forEach(function (el) {
                    el.classList.remove('ux-step-hidden');
                });
            }
        }
        console.log(`AtomicLearning: Initialized ${Object.keys(this.atoms).length} atoms`);
    },

    /**
     * Initialize a single atom
     * @param {HTMLElement|string} atomElOrId - Atom element or atom ID string
     * @param {Array} quizDataOverride - Optional quiz data (if passed directly)
     */
    initAtom: function(atomElOrId, quizDataOverride) {
        // Handle both element and ID string
        let atomEl, atomId;
        if (typeof atomElOrId === 'string') {
            atomId = atomElOrId;
            atomEl = document.getElementById(atomId);
            if (!atomEl) {
                console.warn(`AtomicLearning: Could not find atom element with id ${atomId}`);
                return;
            }
        } else {
            atomEl = atomElOrId;
            atomId = atomEl.dataset.atomId || atomEl.id;
        }

        if (!atomId) {
            console.warn('AtomicLearning: Atom missing data-atom-id or id');
            return;
        }

        const quizContainer = atomEl.querySelector('.atom-quiz');

        // Atomi FARA intrebare (de obicei recapitularea de la finalul lectiei).
        // Se marcheaza CITIT, nu „perfect": elevul n-a fost intrebat nimic, deci
        // nu are ce sa demonstreze. Inainte primeau score: 100 si clasa
        // `atom-perfect`, adica exact insigna pe care ceilalti o castiga
        // raspunzand — masurat 12.09.2026: 239 de atomi in 225 de lectii.
        // (Procentul lectiei NU era afectat: ei aduc 0 intrebari in
        // calculateLessonScore. Umflat era doar `atomsPerfect`.)
        if (!quizContainer) {
            this.atoms[atomId] = {
                element: atomEl,
                questions: [],
                answers: {},
                hintsUsed: {},
                completed: true,
                contentOnly: true,
                correctCount: 0,
                score: null            // null = „nu se noteaza", nu „100"
            };
            this.completedAtoms.add(atomId);
            atomEl.classList.add('atom-completed', 'atom-read');
            return;
        }

        let quizData;
        try {
            // Use override if provided, otherwise read from data-quiz attribute
            if (quizDataOverride && Array.isArray(quizDataOverride)) {
                quizData = quizDataOverride;
            } else {
                // Read data-quiz from atom element (preferred) or quiz container
                quizData = JSON.parse(atomEl.dataset.quiz || quizContainer.dataset.quiz || '[]');
            }
        } catch (e) {
            console.error(`AtomicLearning: Invalid quiz data for atom ${atomId}`);
            return;
        }

        // A doua cale catre acelasi lucru: containerul exista, dar lista de
        // intrebari e goala. Se trateaza identic — CITIT, nu „perfect".
        if (!quizData || quizData.length === 0) {
            this.atoms[atomId] = {
                element: atomEl,
                questions: [],
                answers: {},
                hintsUsed: {},
                completed: true,
                contentOnly: true,
                correctCount: 0,
                score: null
            };
            this.completedAtoms.add(atomId);
            atomEl.classList.add('atom-completed', 'atom-read');
            return;
        }

        // Store atom state
        this.atoms[atomId] = {
            element: atomEl,
            questions: quizData,
            answers: {},
            hintsUsed: {},
            completed: this.completedAtoms.has(atomId),
            shuffledCorrect: {}  // Will store correct answers after shuffling
        };

        // Render quiz UI (this will populate shuffledCorrect)
        this.renderAtomQuiz(atomId, quizContainer, quizData);

        // If already completed, show as completed
        if (this.completedAtoms.has(atomId)) {
            atomEl.classList.add('atom-completed');
            // Restore detailed answers if available
            this.restoreSavedAnswers(atomId);
        }
    },

    /**
     * Render quiz questions for an atom
     */
    renderAtomQuiz: function(atomId, container, questions) {
        const html = questions.map((q, idx) => this.renderQuestion(atomId, q, idx)).join('');
        container.innerHTML = `
            <div class="atom-quiz-wrapper">
                <div class="atom-quiz-header">
                    <span class="atom-quiz-icon">&#128269;</span>
                    <span class="atom-quiz-title">Verifică dacă ai înțeles</span>
                </div>
                <div class="atom-quiz-warning">
                    <span class="warning-icon">&#9888;</span>
                    <span>Atenție! Răspunsul se blochează după selectare. Citește cu atenție înainte de a alege!</span>
                </div>
                ${html}
            </div>
        `;

        // Attach event listeners
        this.attachQuestionListeners(atomId, container);
    },

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    shuffleArray: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Format text that may contain code - adds styling and multi-line breaks.
     * Works on raw text (before HTML escaping) to correctly handle semicolons
     * inside for() loops vs HTML entities like &lt; which also contain ;
     */
    formatText: function(text) {
        var codeRe = /(?:cout|cin|for\s*\(|while\s*\(|if\s*\(|int\s+|float\s+|char\s+|double\s+|string\s+|void\s+|return\s|#include|printf|scanf|endl|sizeof|\w+\[\w*\])/;
        if (!codeRe.test(text)) return this._escHtml(text);
        // "question text: code" pattern
        var cm = text.match(/^(.+?:\s*)(.+)$/s);
        if (cm && codeRe.test(cm[2]) && !codeRe.test(cm[1])) {
            return this._escHtml(cm[1]) + this._fmtCode(cm[2]);
        }
        return this._fmtCode(text);
    },

    _escHtml: function(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },

    _fmtCode: function(raw) {
        // Split into statements respecting parentheses depth (raw text, before escaping)
        var stmts = [], depth = 0, current = '';
        for (var i = 0; i < raw.length; i++) {
            var ch = raw[i];
            if (ch === '(') depth++;
            else if (ch === ')') depth = Math.max(0, depth - 1);
            current += ch;
            if (ch === ';' && depth === 0) {
                stmts.push(current.trim());
                current = '';
            }
        }
        if (current.trim()) stmts.push(current.trim());
        var self = this;
        if (stmts.length >= 2) {
            var fmt = stmts.map(function(s) { return '  ' + self._escHtml(s); }).join('\n');
            return '<pre style="background:rgba(0,0,0,0.25);padding:0.6rem 0.8rem;border-radius:8px;font-family:\'Consolas\',\'Monaco\',monospace;font-size:0.85em;white-space:pre-wrap;margin:0.4rem 0;line-height:1.6;color:var(--accent-cyan,#67e8f9);overflow-x:auto;"><code>' + fmt + '</code></pre>';
        }
        return '<code style="background:rgba(0,0,0,0.2);padding:0.15rem 0.5rem;border-radius:4px;font-family:\'Consolas\',\'Monaco\',monospace;font-size:0.9em;color:var(--accent-cyan,#67e8f9);">' + this._escHtml(stmts.length ? stmts[0] : raw) + '</code>';
    },

    /**
     * Render a single question with randomized answer positions
     */
    renderQuestion: function(atomId, question, index) {
        const qId = `${atomId}-q${index}`;

        // Check if this atom was already completed - don't shuffle to preserve saved answers
        const isAlreadyCompleted = this.completedAtoms.has(atomId);

        // Get original correct answer index (a=0, b=1, c=2, etc.)
        const originalCorrectIndex = question.correct.charCodeAt(0) - 97;
        const correctAnswerText = question.options[originalCorrectIndex];

        let finalOptions;
        let newCorrectLetter;

        if (isAlreadyCompleted) {
            // Don't shuffle for completed atoms - preserve original order
            finalOptions = question.options.map((opt, i) => ({ text: opt, originalIndex: i }));

            // CRITICAL FIX: Use saved shuffledCorrect mapping if available
            // This ensures the correct answer matches what was displayed when user answered
            if (this.savedShuffledCorrect && this.savedShuffledCorrect[atomId] && this.savedShuffledCorrect[atomId][qId]) {
                newCorrectLetter = this.savedShuffledCorrect[atomId][qId];
            } else {
                // Fallback to original (for old data without shuffledCorrect)
                newCorrectLetter = question.correct;
            }
        } else {
            // Create array of options with their original indices
            const optionsWithIndices = question.options.map((opt, i) => ({
                text: opt,
                originalIndex: i
            }));

            // Shuffle the options
            finalOptions = this.shuffleArray(optionsWithIndices);

            // Find new position of correct answer
            const newCorrectIndex = finalOptions.findIndex(opt => opt.text === correctAnswerText);
            newCorrectLetter = String.fromCharCode(97 + newCorrectIndex);
        }

        // Store the correct answer for later verification
        if (this.atoms[atomId]) {
            this.atoms[atomId].shuffledCorrect[qId] = newCorrectLetter;
        }

        const optionsHtml = finalOptions.map((opt, i) => `
            <button class="atom-option" data-answer="${String.fromCharCode(97 + i)}" data-qid="${qId}">
                <span class="atom-option-letter">${String.fromCharCode(65 + i)}</span>
                <span class="atom-option-text">${this.formatText(opt.text)}</span>
            </button>
        `).join('');

        return `
            <div class="atom-question" data-qid="${qId}" data-correct="${newCorrectLetter}" data-hint="${question.hint || ''}">
                <p class="atom-question-text">${this.formatText(question.question)}</p>
                <div class="atom-options">${optionsHtml}</div>
                <div class="atom-feedback" style="display: none;"></div>
                <div class="atom-hint" style="display: none;">
                    <span class="atom-hint-icon">&#128161;</span>
                    <span class="atom-hint-text">${question.hint || 'Gândește-te mai bine...'}</span>
                </div>
            </div>
        `;
    },

    /**
     * Attach click listeners to question options
     */
    attachQuestionListeners: function(atomId, container) {
        const self = this;

        container.querySelectorAll('.atom-option').forEach(btn => {
            btn.addEventListener('click', function() {
                const qId = this.dataset.qid;
                const answer = this.dataset.answer;
                self.handleAnswer(atomId, qId, answer, this);
            });
        });
    },

    /**
     * Handle answer selection
     */
    handleAnswer: function(atomId, qId, answer, buttonEl) {
        const questionEl = buttonEl.closest('.atom-question');
        const correct = questionEl.dataset.correct;
        const feedbackEl = questionEl.querySelector('.atom-feedback');
        const hintEl = questionEl.querySelector('.atom-hint');
        const atom = this.atoms[atomId];

        // Don't allow changes if already answered (locked)
        if (atom.answers[qId] !== undefined) return;

        // Lock answer immediately
        atom.answers[qId] = answer;

        // Disable all options for this question
        questionEl.querySelectorAll('.atom-option').forEach(opt => {
            opt.classList.add('locked');
            opt.style.pointerEvents = 'none';
            opt.style.opacity = '0.7';
        });

        buttonEl.classList.add('selected');
        buttonEl.style.opacity = '1';

        if (answer === correct) {
            // Correct answer
            buttonEl.classList.add('correct');
            feedbackEl.innerHTML = '<span class="feedback-icon">&#10004;</span> Corect!';
            feedbackEl.className = 'atom-feedback correct';
            feedbackEl.style.display = 'block';
            hintEl.style.display = 'none';

            // Check if all questions in this atom are complete
            this.checkAtomComplete(atomId);

        } else {
            // Wrong answer - show correct answer and hint
            buttonEl.classList.add('incorrect');

            // Show the correct answer
            questionEl.querySelectorAll('.atom-option').forEach(opt => {
                if (opt.dataset.answer === correct) {
                    opt.classList.add('correct');
                    opt.style.opacity = '1';
                }
            });

            feedbackEl.innerHTML = '<span class="feedback-icon">&#10060;</span> Incorect. Răspunsul corect este marcat cu verde.';
            feedbackEl.className = 'atom-feedback incorrect';
            feedbackEl.style.display = 'block';
            // Multe indicii din continut incep cu „Corect!" (scrise pentru raspunsul bun). Afisate sub
            // „Incorect", copilul citea „Incorect. ... Corect!" (13.09.2026, 3 lectii la rand in M1).
            const hintText = hintEl.querySelector('.atom-hint-text');
            if (hintText) {
                hintText.innerHTML = hintText.innerHTML.replace(/^\s*(?:[✓✔]\s*)?(?:corect|exact|bravo)\s*[!.,:]*\s*/i, 'De ce: ');
            }
            hintEl.style.display = 'block';

            // Still allow progression but with penalty recorded
            atom.wrongAnswers = (atom.wrongAnswers || 0) + 1;

            // Check atom completion (even wrong answers count as "answered")
            this.checkAtomComplete(atomId);
        }
    },

    /**
     * Check if all questions in an atom are complete
     */
    checkAtomComplete: function(atomId) {
        const atom = this.atoms[atomId];
        const totalQuestions = atom.questions.length;
        const answeredCount = Object.keys(atom.answers).length;

        // Count correct answers using shuffledCorrect (randomized positions)
        let correctAnswers = 0;
        atom.questions.forEach((q, idx) => {
            const qId = `${atomId}-q${idx}`;
            // Use shuffledCorrect for comparison (accounts for randomization)
            const correctAnswer = atom.shuffledCorrect?.[qId] || q.correct;
            if (atom.answers[qId] === correctAnswer) {
                correctAnswers++;
            }
        });

        // All questions answered (regardless of correct/incorrect)
        if (answeredCount >= totalQuestions) {
            atom.completed = true;
            atom.correctCount = correctAnswers;
            atom.score = Math.round((correctAnswers / totalQuestions) * 100);

            this.completedAtoms.add(atomId);

            // Visual feedback based on score
            if (correctAnswers === totalQuestions) {
                atom.element.classList.add('atom-completed', 'atom-perfect');
            } else {
                atom.element.classList.add('atom-completed', 'atom-partial');
            }

            // Save progress
            if (this.settings.saveProgress) {
                this.saveProgress();
            }

            // Unlock next atom
            this.unlockNextAtom(atomId);

            // Dispatch event with score info
            document.dispatchEvent(new CustomEvent('atomCompleted', {
                detail: {
                    atomId,
                    totalCompleted: this.completedAtoms.size,
                    correct: correctAnswers,
                    total: totalQuestions,
                    score: atom.score
                }
            }));
        }
    },

    /**
     * Setup gating (lock atoms until previous is complete)
     */
    /* ------------------------------------------------------------------
       „Un atom = un ecran".

       De ce: masurat pe tot situl (12.09.2026), mediana unei lectii e 2978 de
       cuvinte, cea mai scurta din 531 are 959, si NICIUNA nu e sub 800. Elevul
       care deschide o lectie vede un zid. Blocarea pe atomi exista deja
       (setupGating), dar toti atomii stateau pe ecran, doar acoperiti — deci
       zidul ramanea zid.

       Ce face: arata un singur atom o data, cu „pasul N din M" si un buton
       Urmatorul. Nu e motor nou — foloseste aceiasi atomi, aceeasi stare
       (completedAtoms) si acelasi gating. Textul dinaintea primului atom
       (introducerea) ramane sus; ce vine dupa ultimul atom (exercitii,
       recapitulare) apare la final, nu se arunca.
       ------------------------------------------------------------------ */
    setupStepByStep: function() {
        const atomEls = Array.from(document.querySelectorAll('.atom'));
        if (atomEls.length < 2) return;          // o lectie cu un singur pas n-are ce numara

        const self = this;
        const parent = atomEls[0].parentNode;
        const acelasiParinte = atomEls.every(a => a.parentNode === parent);

        /* Ce vine DUPA ultimul atom (exercitii, recapitulare) - se arata la final.
           Atentie: in sabloanele lectiilor, `.practice-section` (884 cuvinte) si
           `.review-section` (357) NU sunt frati cu atomii, ci frati cu <main>-ul
           care-i contine. O prima versiune se uita doar langa atomi si le lasa pe
           ecran de la pasul 1 - adica ii dadea elevului rezumatul si raspunsurile
           inainte sa lucreze. Deci strangem ambele niveluri. */
        let dupaAtomi = [];
        let dupaInParinte = [];      // doar copiii lui `parent`, pt. inserarea butonului
        if (acelasiParinte) {
            let n = atomEls[atomEls.length - 1].nextElementSibling;
            while (n) { dupaAtomi.push(n); dupaInParinte.push(n); n = n.nextElementSibling; }
            let q = parent.nextElementSibling;
            while (q) {
                // nu ascundem subsolul / creditul sitului
                if (!/footer|site-credit|credit/i.test(q.className + ' ' + q.tagName)) {
                    dupaAtomi.push(q);
                }
                q = q.nextElementSibling;
            }
        }

        // --- antetul cu pasul curent
        const bara = document.createElement('div');
        bara.className = 'ux-step-counter';
        bara.setAttribute('data-ux-step-counter', '');
        bara.innerHTML =
            '<div class="ux-step-line"><span class="ux-step-text"></span>' +
            '<span class="ux-step-pct"></span></div>' +
            '<div class="ux-step-bar"><div class="ux-step-fill"></div></div>';

        /* Unde se pune contorul. Masurat pe 10 lectii (12.09.2026): pana la
           primul pas erau in mediana 1560 px si 265 de cuvinte de derulat —
           obiectivele lectiei plus „incearca". Deci contorul urca DEASUPRA
           lor: din prima secunda elevul vede „Pasul 1 din 7", nu un eseu.
           Obiectivele nu se arunca, se pliaza. */
        const frame = document.querySelector('.lesson-frame');
        if (frame && frame.parentNode) {
            frame.parentNode.insertBefore(bara, frame);

            const fold = document.createElement('details');
            fold.className = 'ux-frame-fold';
            const sum = document.createElement('summary');
            sum.textContent = 'De ce înveți asta (obiectivele lecției)';
            fold.appendChild(sum);
            frame.parentNode.insertBefore(fold, frame);
            fold.appendChild(frame);       // muta sectiunea intreaga inauntru
        } else {
            parent.insertBefore(bara, atomEls[0]);
        }

        /* „Sunt alt elev" (13.09.2026). Calculatoarele din laborator nu se reseteaza dupa fiecare ora:
           elevul urmator gasea pasii rezolvati si raspunsurile colegului, fara nicio cale de a incepe curat.
           Doua apasari (fara fereastra de confirmare, care blocheaza pagina): prima intreaba, a doua sterge. */
        const reia = document.createElement('button');
        reia.type = 'button';
        reia.className = 'ux-new-student';
        reia.textContent = 'Refă lecția de la zero';
        reia.style.cssText = 'margin:.4rem 0 0;padding:.35rem .7rem;font-size:.85rem;border:1px solid currentColor;border-radius:6px;background:transparent;color:inherit;opacity:.8;cursor:pointer';
        let armat = false;
        reia.addEventListener('click', function () {
            if (!armat) {
                armat = true;
                reia.textContent = 'Apasă din nou: se șterg răspunsurile tale la lecția asta';
                setTimeout(function () { armat = false; reia.textContent = 'Refă lecția de la zero'; }, 6000);
                return;
            }
            // Evidența activității (prezenta.js): NU scoatem elevul (25.09.2026: copiii apasă butonul ca să refacă
            // lecția și ieșeau din evidență), ci întrebăm „Ești tot X?”; până la răspuns, totul se ține deoparte.
            self.clearAllForThisLesson();
        });
        bara.appendChild(reia);
        /* 26.09.2026: schimbarea elevului NU mai sterge nimic - lista elevilor calculatorului (prezenta.js).
           „Refă lecția” sterge doar lecția elevului curent; „Nu ești tu?” trece pe sertarul altui elev. */
        const altul = document.createElement('button');
        altul.type = 'button';
        altul.className = 'ux-new-student';
        altul.textContent = 'Nu ești tu? Alege-te din listă';
        altul.style.cssText = reia.style.cssText + ';margin-left:.4rem';
        altul.addEventListener('click', function () { if (window.Prezenta && window.Prezenta.alege) window.Prezenta.alege(); });
        bara.appendChild(altul);

        // --- butonul de inaintare
        const nav = document.createElement('div');
        nav.className = 'ux-step-nav';
        nav.innerHTML =
            '<button type="button" class="ux-step-back" hidden>&larr; Înapoi</button>' +
            '<button type="button" class="ux-step-next">Următorul pas &rarr;</button>';
        if (acelasiParinte) parent.insertBefore(nav, dupaInParinte[0] || null);
        else atomEls[atomEls.length - 1].parentNode.appendChild(nav);

        const btnNext = nav.querySelector('.ux-step-next');
        const btnBack = nav.querySelector('.ux-step-back');

        // Porneste de la primul atom neterminat - elevul nu reia ce a facut.
        let i = atomEls.findIndex(a => !self.completedAtoms.has(a.dataset.atomId || a.id));
        if (i < 0) i = atomEls.length;           // totul terminat -> ecranul de final

        function terminat(idx) {
            const el = atomEls[idx];
            return el && self.completedAtoms.has(el.dataset.atomId || el.id);
        }

        function deseneaza(scroll) {
            const M = atomEls.length;
            atomEls.forEach((a, k) => a.classList.toggle('ux-step-hidden', k !== i));
            dupaAtomi.forEach(e => e.classList.toggle('ux-step-hidden', i < M));

            const gata = atomEls.filter((a, k) => terminat(k)).length;
            const pct = Math.round((gata / M) * 100);
            bara.querySelector('.ux-step-fill').style.width = pct + '%';
            bara.querySelector('.ux-step-pct').textContent = gata + ' din ' + M;

            if (i >= M) {
                bara.querySelector('.ux-step-text').textContent = 'Ai terminat lecția';
                bara.classList.add('ux-step-done');
                nav.hidden = true;
                return;
            }
            bara.classList.remove('ux-step-done');
            nav.hidden = false;
            bara.querySelector('.ux-step-text').textContent = 'Pasul ' + (i + 1) + ' din ' + M;
            btnBack.hidden = i === 0;
            btnNext.disabled = !terminat(i);
            btnNext.textContent = (i === M - 1)
                ? 'Termin lecția →'
                : (terminat(i) ? 'Următorul pas →' : 'Răspunde ca să mergi mai departe');
            if (scroll) bara.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        btnNext.addEventListener('click', function () {
            if (!terminat(i)) return;
            i++;
            deseneaza(true);
        });
        btnBack.addEventListener('click', function () {
            if (i > 0) { i--; deseneaza(true); }
        });

        // Cand un atom se completeaza, butonul se deblocheaza singur.
        document.addEventListener('atomCompleted', function () { deseneaza(false); });
        document.addEventListener('atomicProgressSaved', function () { deseneaza(false); });

        this._stepRedraw = deseneaza;
        deseneaza(false);
    },

    setupGating: function() {
        const atomEls = document.querySelectorAll('.atom');

        atomEls.forEach((atomEl, index) => {
            if (index === 0) {
                // First atom is always unlocked
                atomEl.classList.add('atom-unlocked');
            } else {
                // Support both data-atom-id and id attributes
                const prevAtomId = atomEls[index - 1].dataset.atomId || atomEls[index - 1].id;
                if (this.completedAtoms.has(prevAtomId)) {
                    atomEl.classList.add('atom-unlocked');
                } else {
                    atomEl.classList.add('atom-locked');
                    this.addLockedOverlay(atomEl);
                }
            }
        });
    },

    /**
     * Add locked overlay to atom
     */
    addLockedOverlay: function(atomEl) {
        if (atomEl.querySelector('.atom-lock-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'atom-lock-overlay';
        overlay.innerHTML = `
            <div class="atom-lock-message">
                <span class="lock-icon">&#128274;</span>
                <span>Răspunde corect la întrebările anterioare pentru a continua</span>
            </div>
        `;
        atomEl.appendChild(overlay);
    },

    /**
     * Unlock the next atom
     */
    unlockNextAtom: function(completedAtomId) {
        const atomEls = Array.from(document.querySelectorAll('.atom'));
        // Support both data-atom-id and id attributes
        const currentIndex = atomEls.findIndex(el => (el.dataset.atomId || el.id) === completedAtomId);

        if (currentIndex >= 0 && currentIndex < atomEls.length - 1) {
            const nextAtom = atomEls[currentIndex + 1];
            nextAtom.classList.remove('atom-locked');
            nextAtom.classList.add('atom-unlocked', 'atom-just-unlocked');

            const overlay = nextAtom.querySelector('.atom-lock-overlay');
            if (overlay) {
                overlay.classList.add('fade-out');
                setTimeout(() => overlay.remove(), 300);
            }

            // Scroll to next atom smoothly
            setTimeout(() => {
                nextAtom.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    },

    /**
     * Get storage key including profile ID for proper scoping
     * Uses cached profile ID from init for consistency throughout session
     */
    getStorageKey: function() {
        if (!this.currentLessonId) return null;

        // Use cached profile ID for consistent storage key
        const profileId = this.cachedProfileId ? this.cachedProfileId + '-' : '';

        return `atomic-progress-${profileId}${this.currentLessonId}`;
    },

    /**
     * Save progress to localStorage (detailed version)
     * Saves: completed atoms, individual answers, scores per atom, shuffledCorrect mapping
     */
    saveProgress: function() {
        const key = this.getStorageKey();
        if (!key) return;

        // Build detailed atom data
        const atomDetails = {};
        for (const atomId in this.atoms) {
            const atom = this.atoms[atomId];
            atomDetails[atomId] = {
                answers: { ...atom.answers },
                correctCount: atom.correctCount || 0,
                totalQuestions: atom.questions.length,
                score: atom.score || 0,
                wrongAnswers: atom.wrongAnswers || 0,
                completed: atom.completed || false,
                // CRITICAL: Save shuffledCorrect mapping to correctly restore scores after reload
                shuffledCorrect: { ...atom.shuffledCorrect }
            };
        }

        // Calculate overall lesson score
        const lessonScore = this.calculateLessonScore();

        const data = {
            completedAtoms: Array.from(this.completedAtoms),
            atomDetails: atomDetails,
            lessonScore: lessonScore,
            timestamp: Date.now(),
            version: 3  // Version 3: includes shuffledCorrect for randomized answer fix
        };

        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('AtomicLearning: Error saving progress', e);
            if (e.name === 'QuotaExceededError') {
                alert('Spațiul de stocare este plin! Progresul nu a putut fi salvat.');
            }
        }

        // Dispatch event for external listeners (e.g., lesson summary)
        document.dispatchEvent(new CustomEvent('atomicProgressSaved', {
            detail: { lessonId: this.currentLessonId, data: data }
        }));
    },

    /**
     * Calculate overall lesson score from all atoms
     */
    calculateLessonScore: function() {
        let totalCorrect = 0;
        let totalQuestions = 0;
        let atomsCompleted = 0;
        let atomsPerfect = 0;
        let atomsReadOnly = 0;

        for (const atomId in this.atoms) {
            const atom = this.atoms[atomId];
            totalQuestions += atom.questions.length;
            totalCorrect += atom.correctCount || 0;

            if (atom.contentOnly) {
                // Citit, nu notat. Nu intra in „perfect" — n-a fost intrebat nimic.
                atomsReadOnly++;
                if (atom.completed) atomsCompleted++;
                continue;
            }
            if (atom.completed) {
                atomsCompleted++;
                if (atom.score === 100) atomsPerfect++;
            }
        }

        return {
            totalCorrect: totalCorrect,
            totalQuestions: totalQuestions,
            percentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
            atomsCompleted: atomsCompleted,
            atomsTotal: Object.keys(this.atoms).length,
            atomsPerfect: atomsPerfect,
            atomsReadOnly: atomsReadOnly,
            atomsScored: Object.keys(this.atoms).length - atomsReadOnly
        };
    },

    /**
     * Load progress from localStorage (handles both old and new formats)
     */
    loadProgress: function() {
        const key = this.getStorageKey();
        if (!key) return;
        const saved = localStorage.getItem(key);

        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.completedAtoms = new Set(data.completedAtoms || []);

                // Load detailed atom data if available (version 2+)
                if (data.version >= 2 && data.atomDetails) {
                    this.savedAtomDetails = data.atomDetails;

                    // CRITICAL: Pre-load shuffledCorrect mappings for completed atoms
                    // This ensures correct score calculation after page reload
                    this.savedShuffledCorrect = {};
                    for (const atomId in data.atomDetails) {
                        if (data.atomDetails[atomId].shuffledCorrect) {
                            this.savedShuffledCorrect[atomId] = data.atomDetails[atomId].shuffledCorrect;
                        }
                    }
                }

                // Store lesson score for display
                if (data.lessonScore) {
                    this.savedLessonScore = data.lessonScore;
                }

                console.log('AtomicLearning: Loaded progress', {
                    completedAtoms: this.completedAtoms.size,
                    hasDetails: !!data.atomDetails,
                    hasShuffledCorrect: !!this.savedShuffledCorrect
                });
            } catch (e) {
                console.warn('AtomicLearning: Could not load saved progress', e);
            }
        }
    },

    /**
     * Restore saved answers to an atom (called after initAtom)
     */
    restoreSavedAnswers: function(atomId) {
        if (!this.savedAtomDetails || !this.savedAtomDetails[atomId]) return;

        const savedAtom = this.savedAtomDetails[atomId];
        const atom = this.atoms[atomId];
        if (!atom) return;

        // Restore atom state
        atom.answers = { ...savedAtom.answers };
        atom.correctCount = savedAtom.correctCount;
        atom.score = savedAtom.score;
        atom.wrongAnswers = savedAtom.wrongAnswers;
        atom.completed = savedAtom.completed;

        // CRITICAL: Restore shuffledCorrect mapping from saved data
        if (savedAtom.shuffledCorrect) {
            atom.shuffledCorrect = { ...savedAtom.shuffledCorrect };
        }

        // Visually restore the answered questions
        for (const qId in savedAtom.answers) {
            const answer = savedAtom.answers[qId];
            const questionEl = atom.element.querySelector(`[data-qid="${qId}"]`);
            if (!questionEl) continue;

            // Find the question config
            const qIndex = parseInt(qId.split('-q')[1]);
            const question = atom.questions[qIndex];
            if (!question) continue;

            // CRITICAL FIX: Use saved shuffledCorrect first, then fall back
            const correctAnswer = savedAtom.shuffledCorrect?.[qId] || atom.shuffledCorrect?.[qId] || question.correct;

            // Lock all options and show selected answer
            questionEl.querySelectorAll('.atom-option').forEach(opt => {
                opt.classList.add('locked');
                opt.style.pointerEvents = 'none';
                opt.style.opacity = '0.7';

                if (opt.dataset.answer === answer) {
                    opt.classList.add('selected');
                    opt.style.opacity = '1';

                    if (answer === correctAnswer) {
                        opt.classList.add('correct');
                    } else {
                        opt.classList.add('incorrect');
                    }
                }

                // Show correct answer if wrong was selected
                if (answer !== correctAnswer && opt.dataset.answer === correctAnswer) {
                    opt.classList.add('correct');
                    opt.style.opacity = '1';
                }
            });

            // Show feedback
            const feedbackEl = questionEl.querySelector('.atom-feedback');
            const hintEl = questionEl.querySelector('.atom-hint');

            if (answer === correctAnswer) {
                feedbackEl.innerHTML = '<span class="feedback-icon">&#10004;</span> Corect!';
                feedbackEl.className = 'atom-feedback correct';
                feedbackEl.style.display = 'block';
            } else {
                feedbackEl.innerHTML = '<span class="feedback-icon">&#10060;</span> Incorect. Răspunsul corect este marcat cu verde.';
                feedbackEl.className = 'atom-feedback incorrect';
                feedbackEl.style.display = 'block';
                hintEl.style.display = 'block';
            }
        }
    },

    /**
     * Get saved progress data for external use
     */
    getSavedProgress: function() {
        const key = this.getStorageKey();
        if (!key) return null;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    },

    /**
     * Reset progress for current lesson (full restart)
     */
    /**
     * Sterge TOT ce tine de lectia curenta pe acest calculator (pasi, raspunsuri scrise, rezumat),
     * pentru profilul activ si in formele vechi fara profil, apoi reincarca. Folosit de „Sunt alt elev".
     */
    clearAllForThisLesson: function() {
        const id = this.currentLessonId;
        if (id) {
            const prof = this.cachedProfileId;
            const chei = [
                `atomic-progress-${id}`, `practice-${id}`, `lesson-summary-${id}`, `quiz-bridge-${id}`
            ];
            if (prof) {
                chei.push(`atomic-progress-${prof}-${id}`, `practice-${id}_${prof}`,
                          `lesson-summary-${id}_${prof}`, `quiz-bridge-${id}_${prof}`);
            }
            chei.forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
        }
        window.location.reload();
    },

    resetProgress: function() {
        this.completedAtoms.clear();
        this.atoms = {};

        const key = this.getStorageKey();
        if (key) {
            localStorage.removeItem(key);
        }

        // Reload page to fully reset
        window.location.reload();
    },

    /**
     * Get final score for the lesson
     */
    getFinalScore: function() {
        let totalCorrect = 0;
        let totalQuestions = 0;
        let totalWrittenBonus = 0;

        for (const atomId in this.atoms) {
            const atom = this.atoms[atomId];
            totalQuestions += atom.questions.length;
            totalCorrect += atom.correctCount || 0;
            totalWrittenBonus += atom.writtenBonus || 0;
        }

        const baseScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        return {
            correct: totalCorrect,
            total: totalQuestions,
            baseScore: baseScore,
            writtenBonus: totalWrittenBonus,
            finalScore: Math.min(100, baseScore + totalWrittenBonus),
            canGetBonus: baseScore < 100
        };
    },

    /**
     * Add written answer bonus to an atom
     */
    addWrittenBonus: function(atomId, bonusPoints) {
        if (this.atoms[atomId]) {
            this.atoms[atomId].writtenBonus = (this.atoms[atomId].writtenBonus || 0) + bonusPoints;
            this.saveProgress();

            document.dispatchEvent(new CustomEvent('writtenBonusAdded', {
                detail: { atomId, bonus: bonusPoints, total: this.getFinalScore() }
            }));
        }
    },

    /**
     * Get completion status
     */
    getStatus: function() {
        const total = Object.keys(this.atoms).length;
        const completed = this.completedAtoms.size;
        return {
            total,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
            isComplete: completed >= total
        };
    },

    /**
     * Inject CSS styles
     */
    injectStyles: function() {
        if (document.getElementById('atomic-learning-styles')) return;

        const style = document.createElement('style');
        style.id = 'atomic-learning-styles';
        style.textContent = `
            /* Atom Container */
            .atom {
                position: relative;
                margin-bottom: 2rem;
                transition: all 0.3s ease;
            }

            .atom-locked {
                pointer-events: none;
                opacity: 0.5;
                filter: blur(2px);
            }

            .atom-unlocked {
                opacity: 1;
                filter: none;
            }

            .atom-just-unlocked {
                animation: atomUnlock 0.5s ease;
            }

            @keyframes atomUnlock {
                0% { transform: scale(0.98); opacity: 0.7; }
                50% { transform: scale(1.01); }
                100% { transform: scale(1); opacity: 1; }
            }

            .atom-completed {
                border-left: 4px solid var(--warning, #f59e0b);
            }

            .atom-completed.atom-perfect {
                border-left: 4px solid var(--success, #22c55e);
            }

            .atom-completed.atom-partial {
                border-left: 4px solid var(--warning, #f59e0b);
            }

            /* --- „un atom = un ecran" --- */
            .ux-step-hidden { display: none !important; }

            .ux-frame-fold {
                margin: 0 0 1.5rem;
                border: 1px solid var(--border, #2d2d44);
                border-radius: 12px;
                background: rgba(148, 163, 184, 0.05);
            }

            .ux-frame-fold > summary {
                cursor: pointer;
                padding: 0.8rem 1rem;
                font-weight: 600;
                font-size: 0.92rem;
                color: var(--text-secondary, #94a3b8);
                list-style: none;
            }

            .ux-frame-fold > summary::-webkit-details-marker { display: none; }

            .ux-frame-fold > summary::before {
                content: '\\25B8';
                display: inline-block;
                margin-right: 0.5rem;
                transition: transform 0.2s;
            }

            .ux-frame-fold[open] > summary::before { transform: rotate(90deg); }

            .ux-frame-fold > summary:hover { color: var(--text-primary, #f1f5f9); }

            .ux-frame-fold .lesson-frame { margin: 0 1rem 1rem; }

            .ux-step-counter {
                position: sticky;
                top: 0;
                z-index: 30;
                background: var(--bg-secondary, #12121f);
                padding: 0.75rem 0 0.6rem;
                margin-bottom: 1.25rem;
            }

            .ux-step-line {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                gap: 1rem;
                margin-bottom: 0.5rem;
            }

            .ux-step-text {
                font-weight: 700;
                font-size: 1rem;
                color: var(--text-primary, #f1f5f9);
            }

            .ux-step-pct {
                font-size: 0.85rem;
                color: var(--text-secondary, #94a3b8);
            }

            .ux-step-bar {
                height: 8px;
                border-radius: 999px;
                background: var(--border, #2d2d44);
                overflow: hidden;
            }

            .ux-step-fill {
                height: 100%;
                width: 0;
                border-radius: 999px;
                background: linear-gradient(90deg, var(--accent-blue, #3b82f6), var(--success, #22c55e));
                transition: width 0.35s ease;
            }

            .ux-step-counter.ux-step-done .ux-step-text { color: var(--success, #22c55e); }

            .ux-step-nav {
                display: flex;
                justify-content: space-between;
                gap: 0.75rem;
                margin: 1.5rem 0 2rem;
                flex-wrap: wrap;
            }

            .ux-step-nav button {
                font: inherit;
                font-weight: 600;
                padding: 0.85rem 1.4rem;
                border-radius: 12px;
                border: 1px solid var(--border, #2d2d44);
                cursor: pointer;
            }

            .ux-step-next {
                background: linear-gradient(135deg, var(--accent-blue, #3b82f6), var(--accent-purple, #8b5cf6));
                color: #fff;
                border-color: transparent;
                margin-left: auto;
            }

            .ux-step-next[disabled] {
                background: var(--border, #2d2d44);
                color: var(--text-muted, #64748b);
                cursor: not-allowed;
            }

            .ux-step-back {
                background: transparent;
                color: var(--text-secondary, #94a3b8);
            }

            @media (max-width: 480px) {
                .ux-step-nav button { width: 100%; margin-left: 0; }
            }

            /* Atom fara intrebare: CITIT. Deliberat altfel decat „perfect" —
               bifa verde se castiga raspunzand, nu deruland. */
            .atom-completed.atom-read {
                border-left: 4px dashed var(--text-muted, #64748b);
            }

            .atom-completed.atom-read::after {
                content: 'citit';
                position: absolute;
                top: 1rem;
                right: 1rem;
                padding: 0.15rem 0.5rem;
                font-size: 0.7rem;
                font-weight: 600;
                letter-spacing: 0.03em;
                color: var(--text-muted, #64748b);
                border: 1px solid var(--text-muted, #64748b);
                border-radius: 999px;
                opacity: 0.8;
            }

            .atom-completed.atom-perfect::after {
                content: '\\2713';
                position: absolute;
                top: 1rem;
                right: 1rem;
                width: 28px;
                height: 28px;
                background: var(--success, #22c55e);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1rem;
            }

            .atom-completed.atom-partial::after {
                content: '~';
                position: absolute;
                top: 1rem;
                right: 1rem;
                width: 28px;
                height: 28px;
                background: var(--warning, #f59e0b);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.2rem;
            }

            /* Locked option state */
            .atom-option.locked {
                cursor: not-allowed;
            }

            /* Lock Overlay */
            .atom-lock-overlay {
                position: absolute;
                inset: 0;
                background: rgba(10, 10, 18, 0.85);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 16px;
                z-index: 10;
                transition: opacity 0.3s ease;
            }

            .atom-lock-overlay.fade-out {
                opacity: 0;
            }

            .atom-lock-message {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-secondary, #a0a0b0);
                text-align: center;
                padding: 1rem;
            }

            .atom-lock-message .lock-icon {
                font-size: 2rem;
                opacity: 0.7;
            }

            /* Quiz Wrapper */
            .atom-quiz-wrapper {
                background: var(--bg-primary, #0a0a12);
                border: 2px solid var(--accent-blue, #3b82f6);
                border-radius: 12px;
                padding: 1.25rem;
                margin-top: 1.5rem;
            }

            .atom-quiz-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid var(--border-color, #2a2a4a);
            }

            .atom-quiz-icon {
                font-size: 1.25rem;
            }

            .atom-quiz-title {
                font-weight: 600;
                color: var(--accent-blue-light, #60a5fa);
            }

            .atom-quiz-warning {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 0.9rem;
                margin-bottom: 1rem;
                background: rgba(245, 158, 11, 0.15);
                border: 1px solid var(--warning, #f59e0b);
                border-radius: 8px;
                font-size: 0.85rem;
                color: var(--warning, #f59e0b);
            }

            .atom-quiz-warning .warning-icon {
                font-size: 1rem;
            }

            /* Question */
            .atom-question {
                margin-bottom: 1.25rem;
                padding-bottom: 1.25rem;
                border-bottom: 1px solid var(--border-color, #2a2a4a);
            }

            .atom-question:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }

            .atom-question-text {
                font-weight: 500;
                margin-bottom: 0.75rem;
                color: var(--text-primary, #ffffff);
            }

            /* Options */
            .atom-options {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .atom-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                background: var(--bg-card, #1a1a2e);
                border: 2px solid var(--border-color, #2a2a4a);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
                width: 100%;
                color: var(--text-primary, #ffffff);
                font-size: 0.95rem;
            }

            .atom-option:hover {
                border-color: var(--accent-blue, #3b82f6);
                background: var(--bg-card-hover, #252540);
            }

            .atom-option.selected {
                border-color: var(--accent-blue, #3b82f6);
            }

            .atom-option.correct {
                border-color: var(--success, #22c55e);
                background: rgba(34, 197, 94, 0.15);
            }

            .atom-option.incorrect {
                border-color: var(--error, #ef4444);
                background: rgba(239, 68, 68, 0.15);
                animation: shake 0.3s ease;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            .atom-option-letter {
                width: 26px;
                height: 26px;
                background: var(--bg-primary, #0a0a12);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 0.85rem;
                flex-shrink: 0;
            }

            .atom-option.correct .atom-option-letter {
                background: var(--success, #22c55e);
                color: white;
            }

            .atom-option.incorrect .atom-option-letter {
                background: var(--error, #ef4444);
                color: white;
            }

            /* Feedback */
            .atom-feedback {
                margin-top: 0.75rem;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .atom-feedback.correct {
                background: rgba(34, 197, 94, 0.15);
                border: 1px solid var(--success, #22c55e);
                color: var(--success, #22c55e);
            }

            .atom-feedback.incorrect {
                background: rgba(239, 68, 68, 0.15);
                border: 1px solid var(--error, #ef4444);
                color: var(--error, #ef4444);
            }

            .feedback-icon {
                font-size: 1.1rem;
            }

            /* Hint */
            .atom-hint {
                margin-top: 0.75rem;
                padding: 0.75rem 1rem;
                background: rgba(245, 158, 11, 0.15);
                border: 1px solid var(--warning, #f59e0b);
                border-radius: 8px;
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .atom-hint-icon {
                font-size: 1.25rem;
            }

            .atom-hint-text {
                color: var(--warning, #f59e0b);
                font-size: 0.9rem;
                line-height: 1.5;
            }

            /* Progress Bar (optional) */
            .atom-progress {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--bg-card, #1a1a2e);
                z-index: 1000;
            }

            .atom-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--accent-blue, #3b82f6), var(--success, #22c55e));
                transition: width 0.3s ease;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .atom-quiz-wrapper {
                    padding: 1rem;
                }

                .atom-option {
                    padding: 0.6rem 0.75rem;
                }

                .atom-option-letter {
                    width: 24px;
                    height: 24px;
                    font-size: 0.8rem;
                }
            }
        `;

        document.head.appendChild(style);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtomicLearning;
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic Interactive Handlers (auto-attached for all lessons)
// Handles: hint toggles, hint boxes, copy buttons, drag-reorder, "Am incercat"
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

    // ── .hint-toggle / .hint-content pairs ───────────────────────────
    // When inside .hint-box, toggle .open on the box (CSS: .hint-box.open .hint-content)
    // When standalone, toggle .open on both toggle and content directly
    document.querySelectorAll('.hint-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var box = this.closest('.hint-box');
            if (box) {
                box.classList.toggle('open');
            } else {
                this.classList.toggle('open');
                var content = this.nextElementSibling;
                if (content && content.classList.contains('hint-content')) {
                    content.classList.toggle('open');
                }
            }
        });
    });

    // ── .hint-box with .hint-header (div-based collapsible) ──────────
    document.querySelectorAll('.hint-box .hint-header').forEach(function(header) {
        header.addEventListener('click', function() {
            this.closest('.hint-box').classList.toggle('open');
        });
    });

    // ── .copy-btn ────────────────────────────────────────────────────
    // Four HTML patterns exist:
    //   A) .copyable-code > .copy-btn + .code-block  (text in .code-block)
    //   B) .code-block > .code-block-header > .copy-btn  (text in .code-content)
    //   C) .code-block > .copy-btn + <pre>  (text in <pre>, button is sibling)
    //   D) .copyable-block > .copy-btn + pre.copyable-code  (lectia1-interfata, m1-excel)
    document.querySelectorAll('.copy-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var text = '';
            // Pattern D: .copyable-block wrapper with a sibling pre.copyable-code
            var copyableBlock = this.closest('.copyable-block');
            if (copyableBlock) {
                var pre = copyableBlock.querySelector('.copyable-code');
                if (pre) { text = pre.textContent.trim(); }
            } else {
                // Patterns A/B/C: .copyable-code (legacy wrapper) or .code-block
                var wrapper = this.closest('.copyable-code');
                var block = wrapper
                    ? wrapper.querySelector('.code-block')       // pattern A
                    : this.closest('.code-block');                // patterns B & C
                if (block) {
                    var inner = block.querySelector('.code-content') || block.querySelector('pre');
                    text = (inner || block).textContent.trim();
                }
            }
            if (text && navigator.clipboard) {
                var self = this;
                navigator.clipboard.writeText(text).then(function() {
                    self.textContent = 'Copiat!';
                    setTimeout(function() { self.textContent = 'Copiază'; }, 2000);
                });
            }
        });
    });

    // ── "Am incercat! Vreau sa inteleg" → scroll to atoms ────────────
    // Two wrapper patterns: .btn-center (cls5/6) and .actions (cls7/8)
    document.querySelectorAll('.btn-center .btn, .actions .btn').forEach(function(btn) {
        if (btn.getAttribute('onclick') || btn.getAttribute('href')) return;
        btn.addEventListener('click', function() {
            if (this.classList.contains('btn-outline')) {
                // "← Inapoi" → scroll to top of page
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // "Am incercat!" → scroll to atoms
                // Cateva lectii mai vechi isi numesc containerul 'main-content'.
                // Fara varianta de rezerva, butonul "Am incercat!" nu duce nicaieri
                // pe ele; cu ea, derulam pana la primul atom (05.09.2026).
                var target = document.getElementById('atomic-content')
                          || document.getElementById('main-content')
                          || document.querySelector('.atom');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Drag-and-Drop Reorder (.shuffled-steps) ───────────────────────
    var reorderContainer = document.getElementById('shuffled-steps');
    if (reorderContainer) {
        var dragSrc = null;
        reorderContainer.addEventListener('dragstart', function(e) {
            dragSrc = e.target.closest('.step-card');
            if (dragSrc) {
                dragSrc.style.opacity = '0.45';
                e.dataTransfer.effectAllowed = 'move';
            }
        });
        reorderContainer.addEventListener('dragend', function() {
            if (dragSrc) dragSrc.style.opacity = '';
            reorderContainer.querySelectorAll('.step-card').forEach(function(c) {
                c.classList.remove('drag-over');
            });
        });
        reorderContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            var target = e.target.closest('.step-card');
            if (target && target !== dragSrc) {
                reorderContainer.querySelectorAll('.step-card').forEach(function(c) {
                    c.classList.remove('drag-over');
                });
                target.classList.add('drag-over');
            }
        });
        reorderContainer.addEventListener('dragleave', function(e) {
            var target = e.target.closest('.step-card');
            if (target) target.classList.remove('drag-over');
        });
        reorderContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            var target = e.target.closest('.step-card');
            if (target && target !== dragSrc) {
                target.classList.remove('drag-over');
                var cards = Array.from(reorderContainer.children);
                if (cards.indexOf(dragSrc) < cards.indexOf(target)) {
                    reorderContainer.insertBefore(dragSrc, target.nextSibling);
                } else {
                    reorderContainer.insertBefore(dragSrc, target);
                }
            }
        });
    }

    // ── checkStepOrder (global, used by onclick in HTML) ─────────────
    window.checkStepOrder = window.checkStepOrder || function() {
        var cards = document.querySelectorAll('#shuffled-steps .step-card');
        var feedback = document.getElementById('order-feedback');
        if (!feedback) return;
        var allCorrect = true;
        cards.forEach(function(card, idx) {
            var correct = parseInt(card.getAttribute('data-correct-order'));
            if (correct === idx + 1) {
                card.classList.add('correct-pos');
                card.classList.remove('wrong-pos');
            } else {
                card.classList.add('wrong-pos');
                card.classList.remove('correct-pos');
                allCorrect = false;
            }
        });
        feedback.className = 'order-feedback show ' + (allCorrect ? 'correct' : 'wrong');
        feedback.textContent = allCorrect
            ? '✓ Felicitări! Ai ordonat corect toți pașii! Continuă să înveți teoria.'
            : '✗ Nu e chiar așa. Pașii marcați cu roșu sunt pe poziții greșite. Mai încearcă!';
        if (allCorrect) feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
});
