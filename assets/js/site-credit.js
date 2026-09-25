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

    // Evidența activității elevilor (24.09.2026): site-credit.js e pe toate lecțiile, deci aduce și
    // prezenta.js, fără să mai atingem ~900 de pagini. Stă lângă el, în assets/js/.
    if (!document.getElementById('lh-prezenta')) {
        var me = document.currentScript && document.currentScript.src;
        var s = document.createElement('script');
        s.id = 'lh-prezenta';
        s.src = me ? new URL('prezenta.js', me).href : '/assets/js/prezenta.js';
        s.defer = true;
        document.head.appendChild(s);
    }

    // Contorul de vizitatori (25.09.2026): o dată pe zi, browserul spune „am trecut azi” la
    // teste-vasile.netlify.app/api/vizitatori, cu un id aleator (fără nume). Hub-ul afișează cifrele.
    // Hub-ul (are #visitorCount) își face singur trimiterea, cu citirea cifrelor.
    (function () {
        try {
            if (window.top !== window || document.getElementById('visitorCount')) return;
            var d = new Date();
            var azi = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
            if (localStorage.getItem('lh_viz_zi') === azi) return;
            var v = localStorage.getItem('lh_viz');
            if (!/^[a-f0-9]{32}$/.test(v || '')) {
                var a = new Uint8Array(16); crypto.getRandomValues(a);
                v = Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
                localStorage.setItem('lh_viz', v);
            }
            fetch('https://teste-vasile.netlify.app/api/vizitatori', { method: 'POST', body: JSON.stringify({ v: v, doar: 1 }), keepalive: true })
                .then(function (r) { if (r.ok) localStorage.setItem('lh_viz_zi', azi); })
                .catch(function () {});
        } catch (e) {}
    })();
})();
