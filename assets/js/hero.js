// ===================================
// hero.js — Sadece Hero section'a özel
// sections/hero.html tarafından yüklenir
// ===================================

(function () {

    // ---- Parallax pattern ----
    function initHeroPattern() {
        const heroPattern = document.querySelector('.hero-pattern');
        const hero        = document.querySelector('.hero');
        if (!heroPattern || !hero) return;

        let ticking = false;

        hero.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const rect = hero.getBoundingClientRect();
                    const x    = (e.clientX - rect.left)  / rect.width  - 0.5;
                    const y    = (e.clientY - rect.top)   / rect.height - 0.5;
                    heroPattern.style.transform = `translate(${x * -25}px, ${y * -25}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });

        hero.addEventListener('mouseleave', () => {
            heroPattern.style.transform = 'translate(0, 0)';
        });
    }

    // ---- Works grid: Fisher-Yates shuffle + 12 tane göster ----
    function initHeroWorksGrid() {
        const grid = document.getElementById('heroWorksGrid');
        if (!grid) return;

        const items = Array.from(grid.children);

        // Shuffle
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        // Sadece 12 tane göster (3x4 grid)
        grid.innerHTML = '';
        items.forEach((item, idx) => {
            if (idx < 12) grid.appendChild(item);
        });

        // Her 8 saniyede bir rastgele bir hücreyi değiştir
        startGridCycler(items);
    }

    // ---- Grid cycler: tek tek hücre değişimi ----
    function startGridCycler(allItems) {
        const grid = document.getElementById('heroWorksGrid');
        if (!grid) return;

        // Şu anda gösterilmeyen resimler havuzu
        const shown  = new Set(Array.from(grid.children).map(w => w.querySelector('img').src));
        const pool   = allItems.filter(w => !shown.has(w.querySelector('img').src));

        setInterval(() => {
            const cells     = Array.from(grid.children);
            const targetIdx = Math.floor(Math.random() * cells.length);
            const target    = cells[targetIdx];

            if (!pool.length) return;

            const nextItem  = pool[Math.floor(Math.random() * pool.length)];
            const nextSrc   = nextItem.querySelector('img').src;

            // Fade out
            target.style.transition = 'opacity 0.4s ease';
            target.style.opacity    = '0';

            setTimeout(() => {
                const img   = target.querySelector('img');
                const oldSrc = img.src;
                img.src     = nextSrc;
                img.onload  = () => {
                    target.style.opacity = '1';
                };

                // Havuzu güncelle
                const oldIdx = pool.findIndex(w => w.querySelector('img').src === nextSrc);
                if (oldIdx !== -1) {
                    const replacement = allItems.find(w => w.querySelector('img').src === oldSrc);
                    if (replacement) pool.splice(oldIdx, 1, replacement);
                }
            }, 420);

        }, 8000);
    }

    // ---- Başlat ----
    document.addEventListener('DOMContentLoaded', () => {
        initHeroPattern();
        initHeroWorksGrid();
    });

    // sections-loader.js ile çalışıyorsa (DOMContentLoaded geçmiş olabilir)
    if (document.readyState !== 'loading') {
        initHeroPattern();
        initHeroWorksGrid();
    }

})();