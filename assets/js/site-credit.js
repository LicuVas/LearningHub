/*
 * site-credit.js — adauga discret creditul "realizat de gurlan.ro" in footerul
 * fiecarei pagini. Daca pagina are deja un <footer>, atasam o linie de credit;
 * altfel cream un footer minimal. Idempotent (nu se dubleaza).
 */
(function () {
    'use strict';
    function run() {
        if (document.getElementById('gurlan-credit')) return;

        var credit = document.createElement('div');
        credit.id = 'gurlan-credit';
        credit.style.cssText = 'text-align:center;font-size:0.8rem;color:var(--text-muted,#64748b);padding:0.6rem 1rem;line-height:1.6;';
        credit.innerHTML = 'Site web realizat de <a href="https://gurlan.ro" target="_blank" rel="noopener" style="color:var(--accent-cyan,#06b6d4);text-decoration:none;font-weight:600;">gurlan.ro</a>';

        var footer = document.querySelector('footer');
        if (footer) {
            // Linie separata in footerul existent
            var sep = document.createElement('div');
            sep.style.cssText = 'margin-top:0.5rem;';
            sep.appendChild(credit);
            footer.appendChild(sep);
        } else {
            // Footer minimal la finalul paginii
            var f = document.createElement('footer');
            f.style.cssText = 'margin-top:2.5rem;padding:1rem;border-top:1px solid var(--border,#2d2d44);';
            f.appendChild(credit);
            document.body.appendChild(f);
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
})();
