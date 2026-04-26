/**
 * assets/js/sections-loader.js
 * Tüm HTML section dosyalarını fetch ile ilgili placeholder'lara yükler.
 * Her section dosyası sections/ klasöründe ayrı bir .html olarak tutulur.
 */

(function () {
    'use strict';

    /**
     * Verilen URL'den HTML içeriği çeker ve
     * hedef elementin innerHTML'ine yerleştirir.
     *
     * @param {string} url      - Yüklenecek HTML dosyasının yolu
     * @param {string} selector - İçeriğin yerleştirileceği CSS seçici
     * @returns {Promise<void>}
     */
    async function loadSection(url, selector) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
            const html = await response.text();
            const target = document.querySelector(selector);
            if (target) {
                target.innerHTML = html;
            } else {
                console.warn(`[sections-loader] Seçici bulunamadı: ${selector}`);
            }
        } catch (err) {
            console.error(`[sections-loader] Yükleme hatası (${url}):`, err);
        }
    }

    /**
     * Tüm section'ları sıralı şekilde yükler,
     * ardından script.js'in init fonksiyonunu çağırır.
     */
    async function loadAllSections() {
        const sections = [
            { url: 'header/header.html', selector: '#section-header' },
            { url: 'hero/hero.html', selector: '#section-hero' },
            { url: 'ticker/ticker.html', selector: '#section-ticker' },
            { url: 'portfolio/portfolio.html', selector: '#section-portfolio' },
            { url: 'about/about.html', selector: '#section-about' },
            { url: 'pricing/pricing.html', selector: '#section-pricing' },
            { url: 'contact/contact.html', selector: '#section-contact' },
            { url: 'footer/footer.html', selector: '#section-footer' },
        ];

        // Tüm section'ları paralel yükle
        await Promise.all(sections.map(s => loadSection(s.url, s.selector)));

        // Tüm HTML enjekte edildikten sonra ana script'i başlat
        if (typeof window.initApp === 'function') {
            window.initApp();
        }
    }

    // DOM hazır olduğunda çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllSections);
    } else {
        loadAllSections();
    }
})();