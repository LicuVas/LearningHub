/*
 * active-module.js — date-drives the "ACTIV ACUM" indicator on class index pages.
 * The class pages list module sections, each with a .domain-label that contains a
 * Romanian date range ("8 ian - 20 feb", "15 apr - 19 iun"). This script reads the
 * current date and marks the truly-active module, clearing any stale hard-coded
 * "ACTIV ACUM" so it can never go out of date again.
 *
 * School year 2025-2026: months Sep-Dec belong to 2025, Jan-Aug to 2026.
 * Summer break starts 2026-06-20.
 */
(function () {
    'use strict';
    var MON = { ian: 0, feb: 1, mar: 2, apr: 3, mai: 4, iun: 5, iul: 6, aug: 7, sep: 8, oct: 9, noi: 10, dec: 11 };

    function toDate(day, monRaw) {
        var key = monRaw.slice(0, 3).toLowerCase();
        var m = MON[key];
        if (m === undefined) return null;
        var year = m >= 8 ? 2025 : 2026; // Sep+ = first half of school year (2025)
        return new Date(year, m, day);
    }

    function run() {
        var now = new Date();
        var summerStart = new Date(2026, 5, 20); // 20 iunie 2026
        var labels = Array.prototype.slice.call(document.querySelectorAll('.domain-label'));
        if (!labels.length) return;

        var activeLabel = null;
        labels.forEach(function (label) {
            // Strip any pre-existing hard-coded "ACTIV ACUM" marker (text + bold span)
            label.querySelectorAll('strong').forEach(function (s) {
                if (/activ acum/i.test(s.textContent)) s.remove();
            });
            label.innerHTML = label.innerHTML
                .replace(/(•|&bull;)\s*<strong[^>]*>\s*ACTIV ACUM\s*<\/strong>/ig, '')
                .replace(/(•|&bull;)\s*ACTIV ACUM/ig, '')
                .replace(/\s*(•|&bull;)\s*$/i, '');
            label.classList.remove('module-is-active');
            label.removeAttribute('data-active-now');

            var m = label.textContent.match(/(\d{1,2})\s+([a-zăîâșț]+)\s*[-–]\s*(\d{1,2})\s+([a-zăîâșț]+)/i);
            if (!m) return;
            var start = toDate(parseInt(m[1], 10), m[2]);
            var end = toDate(parseInt(m[3], 10), m[4]);
            if (!start || !end) return;
            end.setHours(23, 59, 59, 999);
            if (now >= start && now <= end) activeLabel = label;
        });

        // Banner with the honest current status
        var banner = document.getElementById('active-module-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'active-module-banner';
            banner.style.cssText = 'text-align:center;margin:0 auto 1.5rem;padding:0.6rem 1rem;border-radius:10px;font-weight:600;max-width:1100px;';
            var grid = document.querySelector('.modules-grid');
            if (grid && grid.parentNode) grid.parentNode.insertBefore(banner, grid.parentNode.firstChild);
            else document.body.insertBefore(banner, document.body.firstChild);
        }

        if (activeLabel) {
            activeLabel.classList.add('module-is-active');
            activeLabel.insertAdjacentHTML('beforeend', ' &bull; <strong style="color:var(--accent-green,#10b981)">ACTIV ACUM</strong>');
            var title = (activeLabel.textContent.split('•')[0] || '').trim();
            banner.style.background = 'rgba(16,185,129,0.12)';
            banner.style.color = 'var(--accent-green,#10b981)';
            banner.textContent = '📅 Modulul activ acum: ' + title;
        } else if (now >= summerStart) {
            banner.style.background = 'rgba(245,158,11,0.12)';
            banner.style.color = 'var(--accent-orange,#f59e0b)';
            banner.textContent = '🏖️ Vacanță de vară — anul școlar 2025–2026 s-a încheiat. Explorează liber orice modul!';
        } else {
            banner.style.background = 'rgba(148,163,184,0.12)';
            banner.style.color = 'var(--text-secondary,#94a3b8)';
            banner.textContent = '📚 Explorează orice modul în ritmul tău.';
        }

        // Neutralize stale per-card "In curs" badges (date-static, can mislead).
        document.querySelectorAll('.module-status.status-active').forEach(function (s) {
            if (/in curs/i.test(s.textContent)) s.textContent = 'Disponibil';
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
})();
