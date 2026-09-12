/*
 * active-module.js — pune indicatorul „ACTIV ACUM" pe pagina unei clase.
 *
 * Paginile de clasa listeaza module, fiecare cu un interval scris in text
 * (".domain-label", ex. „8 ian - 20 feb"). Scriptul citeste ziua de azi si
 * marcheaza modulul care chiar e activ, stergand orice „ACTIV ACUM" scris de
 * mana, ca sa nu poata imbatrani.
 *
 * ISTORIA CARE CONTEAZA (11.09.2026): fisierul asta a fost scris exact ca sa nu
 * mai poata expira nimic — si a expirat el insusi, fiindca avea anul scolar ARS
 * IN COD (`var year = m >= 8 ? 2025 : 2026` si `summerStart = new Date(2026,5,20)`).
 * Pe 2026-2027 calcula ani din trecut si scria „vacanta de vara" in septembrie.
 * Acum anul vine din `window.SCHOOL_YEAR` (assets/js/school-year.js, generat din
 * curriculum/school_year_<an>.json). Un an nou = un fisier JSON + generatorul.
 *
 * Daca school-year.js NU e incarcat, scriptul NU ghiceste: nu scrie nimic despre
 * „acum". Mai bine tacere decat o data falsa.
 */
(function () {
    'use strict';
    var MON = { ian: 0, feb: 1, mar: 2, apr: 3, mai: 4, iun: 5, iul: 6, aug: 7, sep: 8, oct: 9, noi: 10, dec: 11 };

    function anScolar() {
        var sy = window.SCHOOL_YEAR;
        if (!sy || !sy.courses || !sy.courses.start_date || !sy.courses.end_date) return null;
        return {
            anInceput: parseInt(String(sy.courses.start_date).slice(0, 4), 10),
            anSfarsit: parseInt(String(sy.courses.end_date).slice(0, 4), 10),
            eticheta: sy.school_year
        };
    }

    function toDate(day, monRaw, an) {
        var key = monRaw.slice(0, 3).toLowerCase();
        var m = MON[key];
        if (m === undefined) return null;
        // Lunile sep-dec apartin primului an calendaristic al anului scolar.
        var year = m >= 8 ? an.anInceput : an.anSfarsit;
        return new Date(year, m, day);
    }

    /* Prima zi de vacanta de vara = prima zi de dupa ultimul modul. */
    function inceputVara() {
        var sy = window.SCHOOL_YEAR;
        var mods = (sy && sy.modules) || [];
        if (!mods.length) return null;
        var ultim = mods[mods.length - 1];
        var v = ultim.vacation_after;
        var s = (v && v.start) || ultim.end;
        var p = String(s).split('-');
        return new Date(+p[0], +p[1] - 1, +p[2]);
    }

    function run() {
        var an = anScolar();
        var now = new Date();
        var labels = Array.prototype.slice.call(document.querySelectorAll('.domain-label'));
        if (!labels.length) return;

        var activeLabel = null;
        labels.forEach(function (label) {
            // Sterge orice marcaj „ACTIV ACUM" scris de mana (text + span bold)
            label.querySelectorAll('strong').forEach(function (s) {
                if (/activ acum/i.test(s.textContent)) s.remove();
            });
            label.innerHTML = label.innerHTML
                .replace(/(•|&bull;)\s*<strong[^>]*>\s*ACTIV ACUM\s*<\/strong>/ig, '')
                .replace(/(•|&bull;)\s*ACTIV ACUM/ig, '')
                .replace(/\s*(•|&bull;)\s*$/i, '');
            label.classList.remove('module-is-active');
            label.removeAttribute('data-active-now');

            if (!an) return;   // fara structura anului nu marcam nimic
            var m = label.textContent.match(/(\d{1,2})\s+([a-zăîâșț]+)\s*[-–]\s*(\d{1,2})\s+([a-zăîâșț]+)/i);
            if (!m) return;
            var start = toDate(parseInt(m[1], 10), m[2], an);
            var end = toDate(parseInt(m[3], 10), m[4], an);
            if (!start || !end) return;
            end.setHours(23, 59, 59, 999);
            if (now >= start && now <= end) activeLabel = label;
        });

        // Fara structura anului incarcata, nu spunem nimic despre „acum".
        if (!an) return;

        var banner = document.getElementById('active-module-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'active-module-banner';
            banner.style.cssText = 'text-align:center;margin:0 auto 1.5rem;padding:0.6rem 1rem;border-radius:10px;font-weight:600;max-width:1100px;';
            var grid = document.querySelector('.modules-grid');
            if (grid && grid.parentNode) grid.parentNode.insertBefore(banner, grid.parentNode.firstChild);
            else document.body.insertBefore(banner, document.body.firstChild);
        }

        var vara = inceputVara();
        if (activeLabel) {
            activeLabel.classList.add('module-is-active');
            activeLabel.insertAdjacentHTML('beforeend', ' &bull; <strong style="color:var(--accent-green,#10b981)">ACTIV ACUM</strong>');
            var title = (activeLabel.textContent.split('•')[0] || '').trim();
            banner.style.background = 'rgba(16,185,129,0.12)';
            banner.style.color = 'var(--accent-green,#10b981)';
            banner.textContent = '📅 Modulul activ acum: ' + title;
        } else if (vara && now >= vara) {
            banner.style.background = 'rgba(245,158,11,0.12)';
            banner.style.color = 'var(--accent-orange,#f59e0b)';
            banner.textContent = '🏖️ Vacanță de vară — anul școlar ' + an.eticheta +
                                 ' s-a încheiat. Explorează liber orice modul!';
        } else {
            // Suntem in anul scolar, dar niciun interval scris pe pagina nu
            // acopera ziua de azi (vacanta intre module, sau pagina n-are date).
            var acum = window.SchoolYear && window.SchoolYear.sentence
                     ? window.SchoolYear.sentence(now) : null;
            banner.style.background = 'rgba(148,163,184,0.12)';
            banner.style.color = 'var(--text-secondary,#94a3b8)';
            if (acum && acum.stare === 'cursuri') {
                banner.textContent = '📚 Suntem în ' + acum.titlu + ' (' + acum.detaliu +
                                     '). Explorează orice modul în ritmul tău.';
            } else if (acum && acum.stare === 'vacanta') {
                banner.textContent = '🏖️ ' + acum.titlu + ' — explorează liber orice modul!';
            } else {
                banner.textContent = '📚 Explorează orice modul în ritmul tău.';
            }
        }

        // Neutralizeaza insignele „In curs" scrise de mana pe carduri (date statice).
        document.querySelectorAll('.module-status.status-active').forEach(function (s) {
            if (/in curs/i.test(s.textContent)) s.textContent = 'Disponibil';
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
})();
