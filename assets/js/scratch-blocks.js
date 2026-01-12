/**
 * Scratch Blocks - Language Toggle System
 * ========================================
 *
 * Allows students to switch between Romanian and English block text.
 * Preference is saved to localStorage.
 *
 * Usage:
 *   <div class="scratch-lang-toggle" id="scratchLangToggle"></div>
 *   <script>ScratchBlocks.init();</script>
 *
 * Block markup:
 *   <span class="sb sb-motion">
 *     <span data-lang-ro>mergi</span>
 *     <span data-lang-en>move</span>
 *     <span class="sb-input">10</span>
 *     <span data-lang-ro>pași</span>
 *     <span data-lang-en>steps</span>
 *   </span>
 */

const ScratchBlocks = {
    // Current language
    currentLang: 'ro',

    // Storage key
    STORAGE_KEY: 'scratchBlocksLang',

    /**
     * Initialize the language system
     */
    init() {
        // Load saved preference
        this.currentLang = localStorage.getItem(this.STORAGE_KEY) || 'ro';
        this.applyLanguage(this.currentLang);

        // Create toggle buttons if container exists
        this.createToggle();
    },

    /**
     * Create the language toggle UI
     */
    createToggle() {
        const container = document.getElementById('scratchLangToggle');
        if (!container) return;

        container.innerHTML = `
            <button data-lang="ro" class="${this.currentLang === 'ro' ? 'active' : ''}" title="Blocuri în Română">
                🇷🇴 RO
            </button>
            <button data-lang="en" class="${this.currentLang === 'en' ? 'active' : ''}" title="Blocks in English">
                🇬🇧 EN
            </button>
        `;

        // Add click handlers
        container.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.setLanguage(lang);

                // Update active state
                container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },

    /**
     * Set the current language
     * @param {string} lang - 'ro' or 'en'
     */
    setLanguage(lang) {
        if (lang !== 'ro' && lang !== 'en') return;

        this.currentLang = lang;
        localStorage.setItem(this.STORAGE_KEY, lang);
        this.applyLanguage(lang);
    },

    /**
     * Apply language to the document
     * @param {string} lang - 'ro' or 'en'
     */
    applyLanguage(lang) {
        document.documentElement.setAttribute('data-scratch-lang', lang);
    },

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getLanguage() {
        return this.currentLang;
    },

    /**
     * Helper: Create a motion block
     * @param {string} roText - Romanian text
     * @param {string} enText - English text
     * @param {string} value - Input value (optional)
     * @returns {string} HTML string
     */
    motion(roText, enText, value = null) {
        return this._block('motion', roText, enText, value);
    },

    /**
     * Helper: Create a looks block
     */
    looks(roText, enText, value = null) {
        return this._block('looks', roText, enText, value);
    },

    /**
     * Helper: Create a control block
     */
    control(roText, enText, value = null) {
        return this._block('control', roText, enText, value);
    },

    /**
     * Helper: Create an events block
     */
    events(roText, enText, value = null) {
        return this._block('events', roText, enText, value);
    },

    /**
     * Helper: Create a sensing block
     */
    sensing(roText, enText, value = null) {
        return this._block('sensing', roText, enText, value);
    },

    /**
     * Helper: Create an operators block
     */
    operators(roText, enText, value = null) {
        return this._block('operators', roText, enText, value);
    },

    /**
     * Helper: Create a variables block
     */
    variables(roText, enText, value = null) {
        return this._block('variables', roText, enText, value);
    },

    /**
     * Internal: Create block HTML
     */
    _block(category, roText, enText, value) {
        const valueHtml = value !== null ? `<span class="sb-input">${value}</span>` : '';
        return `<span class="sb sb-${category}">
            <span data-lang-ro>${roText}</span>
            <span data-lang-en>${enText}</span>
            ${valueHtml}
        </span>`;
    }
};

// Block text translations for common Scratch blocks
const SCRATCH_TRANSLATIONS = {
    // Motion blocks
    'move_steps': { ro: 'mergi {0} pași', en: 'move {0} steps' },
    'turn_right': { ro: 'rotește-te ↻ {0} grade', en: 'turn ↻ {0} degrees' },
    'turn_left': { ro: 'rotește-te ↺ {0} grade', en: 'turn ↺ {0} degrees' },
    'go_to_xy': { ro: 'mergi la x: {0} y: {1}', en: 'go to x: {0} y: {1}' },
    'glide_to': { ro: 'glisează în {0} sec la x: {1} y: {2}', en: 'glide {0} secs to x: {1} y: {2}' },
    'point_direction': { ro: 'îndreaptă-te spre {0}', en: 'point in direction {0}' },
    'set_x': { ro: 'setează x la {0}', en: 'set x to {0}' },
    'set_y': { ro: 'setează y la {0}', en: 'set y to {0}' },
    'change_x': { ro: 'schimbă x cu {0}', en: 'change x by {0}' },
    'change_y': { ro: 'schimbă y cu {0}', en: 'change y by {0}' },

    // Looks blocks
    'say': { ro: 'spune {0}', en: 'say {0}' },
    'say_for': { ro: 'spune {0} timp de {1} secunde', en: 'say {0} for {1} seconds' },
    'think': { ro: 'gândește {0}', en: 'think {0}' },
    'show': { ro: 'arată-te', en: 'show' },
    'hide': { ro: 'ascunde-te', en: 'hide' },
    'switch_costume': { ro: 'schimbă costumul la {0}', en: 'switch costume to {0}' },
    'next_costume': { ro: 'costumul următor', en: 'next costume' },
    'set_size': { ro: 'setează mărimea la {0}%', en: 'set size to {0}%' },

    // Events blocks
    'when_flag': { ro: 'când se dă click pe 🏴', en: 'when 🏴 clicked' },
    'when_key': { ro: 'când se apasă tasta {0}', en: 'when {0} key pressed' },
    'when_clicked': { ro: 'când se dă click pe acest sprite', en: 'when this sprite clicked' },
    'when_backdrop': { ro: 'când decorul se schimbă la {0}', en: 'when backdrop switches to {0}' },
    'broadcast': { ro: 'transmite {0}', en: 'broadcast {0}' },
    'when_receive': { ro: 'când primesc {0}', en: 'when I receive {0}' },

    // Control blocks
    'wait': { ro: 'așteaptă {0} secunde', en: 'wait {0} seconds' },
    'repeat': { ro: 'repetă de {0} ori', en: 'repeat {0}' },
    'forever': { ro: 'la infinit', en: 'forever' },
    'if_then': { ro: 'dacă <{0}> atunci', en: 'if <{0}> then' },
    'if_then_else': { ro: 'dacă <{0}> atunci ... altfel ...', en: 'if <{0}> then ... else ...' },
    'wait_until': { ro: 'așteaptă până când <{0}>', en: 'wait until <{0}>' },
    'repeat_until': { ro: 'repetă până când <{0}>', en: 'repeat until <{0}>' },
    'stop_all': { ro: 'oprește [tot v]', en: 'stop [all v]' },
    'stop_this': { ro: 'oprește [acest script v]', en: 'stop [this script v]' },

    // Sensing blocks
    'touching': { ro: 'atingi {0}?', en: 'touching {0}?' },
    'touching_color': { ro: 'atingi culoarea {0}?', en: 'touching color {0}?' },
    'key_pressed': { ro: 'tasta {0} apăsată?', en: 'key {0} pressed?' },
    'mouse_down': { ro: 'buton mouse apăsat?', en: 'mouse down?' },
    'ask': { ro: 'întreabă {0} și așteaptă', en: 'ask {0} and wait' },
    'answer': { ro: 'răspuns', en: 'answer' },
    'mouse_x': { ro: 'mouse x', en: 'mouse x' },
    'mouse_y': { ro: 'mouse y', en: 'mouse y' },
    'timer': { ro: 'cronometru', en: 'timer' },

    // Operators blocks
    'add': { ro: '{0} + {1}', en: '{0} + {1}' },
    'subtract': { ro: '{0} - {1}', en: '{0} - {1}' },
    'multiply': { ro: '{0} * {1}', en: '{0} * {1}' },
    'divide': { ro: '{0} / {1}', en: '{0} / {1}' },
    'random': { ro: 'alege aleator între {0} și {1}', en: 'pick random {0} to {1}' },
    'greater': { ro: '{0} > {1}', en: '{0} > {1}' },
    'less': { ro: '{0} < {1}', en: '{0} < {1}' },
    'equals': { ro: '{0} = {1}', en: '{0} = {1}' },
    'and': { ro: '<{0}> și <{1}>', en: '<{0}> and <{1}>' },
    'or': { ro: '<{0}> sau <{1}>', en: '<{0}> or <{1}>' },
    'not': { ro: 'nu <{0}>', en: 'not <{0}>' },
    'join': { ro: 'unește {0} {1}', en: 'join {0} {1}' },
    'length': { ro: 'lungimea lui {0}', en: 'length of {0}' },

    // Variables
    'set_var': { ro: 'setează [{0} v] la {1}', en: 'set [{0} v] to {1}' },
    'change_var': { ro: 'schimbă [{0} v] cu {1}', en: 'change [{0} v] by {1}' },
    'show_var': { ro: 'arată variabila [{0} v]', en: 'show variable [{0} v]' },
    'hide_var': { ro: 'ascunde variabila [{0} v]', en: 'hide variable [{0} v]' }
};

/**
 * Helper function to create a bilingual block
 * @param {string} blockId - Key from SCRATCH_TRANSLATIONS
 * @param {string} category - Block category (motion, looks, etc.)
 * @param {...string} values - Values to insert into the template
 * @returns {string} HTML string for the block
 */
function scratchBlock(blockId, category, ...values) {
    const trans = SCRATCH_TRANSLATIONS[blockId];
    if (!trans) return `<span class="sb sb-${category}">[${blockId}]</span>`;

    let roText = trans.ro;
    let enText = trans.en;

    // Replace placeholders with values
    values.forEach((val, i) => {
        const placeholder = `{${i}}`;
        const inputHtml = `</span><span class="sb-input">${val}</span><span data-lang-ro>`;
        const inputHtmlEn = `</span><span class="sb-input">${val}</span><span data-lang-en>`;

        roText = roText.replace(placeholder, `</span><span class="sb-input">${val}</span><span data-lang-ro>`);
        enText = enText.replace(placeholder, `</span><span class="sb-input">${val}</span><span data-lang-en>`);
    });

    return `<span class="sb sb-${category}"><span data-lang-ro>${roText}</span><span data-lang-en>${enText}</span></span>`;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ScratchBlocks.init());
} else {
    ScratchBlocks.init();
}
