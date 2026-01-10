/**
 * LearningHub Breadcrumb Navigation System
 * =========================================
 * Provides consistent breadcrumb navigation across all pages
 *
 * Usage:
 *   <script src="../../assets/js/breadcrumb.js"></script>
 *   <script>
 *     Breadcrumb.init({
 *       grade: 'cls6',
 *       gradeName: 'Clasa a VI-a',
 *       module: 'm1-prezentari',
 *       moduleName: 'Modulul 1: Prezentari',
 *       lesson: 'Lectia 2: Lucrul cu slide-uri' // optional
 *     });
 *   </script>
 */

const Breadcrumb = {
    // Grade display names
    gradeNames: {
        'cls5': 'Clasa a V-a',
        'cls6': 'Clasa a VI-a',
        'cls7': 'Clasa a VII-a',
        'cls8': 'Clasa a VIII-a',
        'cls9': 'Clasa a IX-a',
        'cls10': 'Clasa a X-a',
        'cls11': 'Clasa a XI-a',
        'cls12': 'Clasa a XII-a'
    },

    // Calculate relative path to hub based on current location
    getHubPath() {
        const path = window.location.pathname;

        // From lesson page: content/tic/cls6/m1-prezentari/lectia1.html
        if (path.includes('/content/tic/') && path.match(/\/m\d+-[^/]+\/[^/]+\.html$/)) {
            return '../../../../hub/index.html';
        }
        // From module index: content/tic/cls6/m1-prezentari/index.html
        if (path.includes('/content/tic/') && path.match(/\/m\d+-[^/]+\/index\.html$/)) {
            return '../../../../hub/index.html';
        }
        // From grade index: content/tic/cls6/index.html
        if (path.includes('/content/tic/') && path.match(/\/cls\d+\/index\.html$/)) {
            return '../../../hub/index.html';
        }
        // From hub pages: hub/by-grade/cls5.html
        if (path.includes('/hub/')) {
            return 'index.html';
        }

        return '../hub/index.html';
    },

    // Get path to grade index from current page
    getGradePath(grade) {
        const path = window.location.pathname;

        // From lesson page
        if (path.match(/\/m\d+-[^/]+\/[^/]+\.html$/)) {
            return '../index.html';
        }
        // From module index
        if (path.match(/\/m\d+-[^/]+\/index\.html$/)) {
            return '../index.html';
        }

        return `../content/tic/${grade}/index.html`;
    },

    // Get path to module index from current page
    getModulePath() {
        const path = window.location.pathname;

        // From lesson page (non-index)
        if (path.match(/\/m\d+-[^/]+\/[^/]+\.html$/) && !path.endsWith('/index.html')) {
            return 'index.html';
        }

        return '#';
    },

    /**
     * Initialize breadcrumb navigation
     * @param {Object} config - Configuration object
     * @param {string} config.grade - Grade ID (e.g., 'cls6')
     * @param {string} [config.gradeName] - Display name for grade
     * @param {string} [config.module] - Module ID (e.g., 'm1-prezentari')
     * @param {string} [config.moduleName] - Display name for module
     * @param {string} [config.lesson] - Lesson name (for lesson pages)
     */
    init(config) {
        // Create breadcrumb container
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'breadcrumb-nav';
        breadcrumb.setAttribute('aria-label', 'Navigare');

        // Build breadcrumb items
        const items = [];

        // Learning Hub (always first)
        items.push({
            label: 'Learning Hub',
            href: this.getHubPath(),
            icon: '🏠'
        });

        // Grade (if provided)
        if (config.grade) {
            items.push({
                label: config.gradeName || this.gradeNames[config.grade] || config.grade,
                href: this.getGradePath(config.grade)
            });
        }

        // Module (if provided)
        if (config.module && config.moduleName) {
            items.push({
                label: config.moduleName,
                href: config.lesson ? this.getModulePath() : null
            });
        }

        // Lesson (if provided - current page, no link)
        if (config.lesson) {
            items.push({
                label: config.lesson,
                href: null
            });
        }

        // Generate HTML
        breadcrumb.innerHTML = `
            <div class="breadcrumb-container">
                ${items.map((item, index) => `
                    ${index > 0 ? '<span class="breadcrumb-separator">|</span>' : ''}
                    ${item.href
                        ? `<a href="${item.href}" class="breadcrumb-item">${item.icon || ''}${item.icon ? ' ' : ''}${item.label}</a>`
                        : `<span class="breadcrumb-item current">${item.label}</span>`
                    }
                `).join('')}
            </div>
        `;

        // Add styles if not already present
        this.addStyles();

        // Insert at top of container or body
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(breadcrumb, container.firstChild);
        } else {
            document.body.insertBefore(breadcrumb, document.body.firstChild);
        }

        // Remove old navigation elements
        this.removeOldNav();
    },

    /**
     * Remove old "Inapoi" style navigation
     */
    removeOldNav() {
        // Hide old nav-bar completely
        const navBars = document.querySelectorAll('.nav-bar, nav.nav-bar');
        navBars.forEach(el => {
            el.style.display = 'none';
        });

        // Remove nav-back links
        const navBacks = document.querySelectorAll('.nav-back');
        navBacks.forEach(el => el.remove());

        // Also check for standalone back links
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            const text = link.textContent.trim();
            if (text.startsWith('←') && (text.includes('Inapoi') || text.includes('Înapoi') || text.includes('Hub') || text.includes('Clasa') || text.includes('toate'))) {
                link.remove();
            }
        });
    },

    /**
     * Add breadcrumb styles
     */
    addStyles() {
        if (document.getElementById('breadcrumb-styles')) return;

        const style = document.createElement('style');
        style.id = 'breadcrumb-styles';
        style.textContent = `
            .breadcrumb-nav {
                background: var(--bg-secondary, #12121f);
                border-bottom: 1px solid var(--border, #2d2d44);
                padding: 0.75rem 0;
                margin-bottom: 1.5rem;
                position: sticky;
                top: 0;
                z-index: 100;
            }

            .breadcrumb-container {
                max-width: 900px;
                margin: 0 auto;
                padding: 0 2rem;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 0.5rem;
            }

            .breadcrumb-item {
                color: var(--text-secondary, #94a3b8);
                text-decoration: none;
                font-size: 0.9rem;
                font-weight: 500;
                padding: 0.25rem 0.5rem;
                border-radius: 6px;
                transition: all 0.2s ease;
                white-space: nowrap;
            }

            .breadcrumb-item:hover:not(.current) {
                color: var(--accent-cyan, #06b6d4);
                background: rgba(6, 182, 212, 0.1);
            }

            .breadcrumb-item.current {
                color: var(--text-primary, #f1f5f9);
                font-weight: 600;
            }

            .breadcrumb-separator {
                color: var(--text-muted, #64748b);
                font-weight: 300;
                opacity: 0.5;
            }

            @media (max-width: 768px) {
                .breadcrumb-container {
                    padding: 0 1rem;
                }

                .breadcrumb-item {
                    font-size: 0.85rem;
                    padding: 0.2rem 0.4rem;
                }

                /* Hide lesson name on mobile to save space */
                .breadcrumb-item.current {
                    max-width: 150px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        `;

        document.head.appendChild(style);
    },

    /**
     * Quick init for common page types
     */
    initModuleIndex(grade, moduleName) {
        this.init({
            grade: grade,
            module: grade + '-module',
            moduleName: moduleName
        });
    },

    initLesson(grade, moduleName, lessonName) {
        this.init({
            grade: grade,
            module: grade + '-module',
            moduleName: moduleName,
            lesson: lessonName
        });
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Breadcrumb;
}
