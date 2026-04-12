// ===================================
// Designer Portfolio - JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initFormHandling();
    initHeroPattern();
    initLightbox();
    initHeroWorksGrid();
    initPortfolioPagination();
});

// ===================================
// Hero Works Grid - Random Images
// ===================================
function initHeroWorksGrid() {
    const grid = document.getElementById('heroWorksGrid');
    if (!grid) return;

    const items = Array.from(grid.children);

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    // Sadece 12 tane göster (3x4)
    grid.innerHTML = '';
    items.forEach((item, index) => {
        if (index < 12) grid.appendChild(item);
    });
}

// ===================================
// Portfolio Pagination
// ===================================
function initPortfolioPagination() {
    const grid     = document.getElementById('portfolioGrid');
    const prevBtn  = document.getElementById('portfolioPrev');
    const nextBtn  = document.getElementById('portfolioNext');
    const pageInfo = document.getElementById('portfolioPageInfo');

    if (!grid || !prevBtn || !nextBtn) return;

    // Tüm works dosyaları havuzu (1–55)
    const allImages = [];
    for (let i = 1; i <= 55; i++) {
        allImages.push(`works/work (${i}).png`);
    }

    // Her sayfada 7 resim — CSS grid layout'u korur
    const ITEMS_PER_PAGE = 7;
    const layouts = ['large', '', '', 'tall', '', '', 'wide'];
    const totalPages = Math.ceil(allImages.length / ITEMS_PER_PAGE);
    let currentPage = 0;

    function renderPage(page) {
        const start      = page * ITEMS_PER_PAGE;
        const pageImages = allImages.slice(start, start + ITEMS_PER_PAGE);

        // Fade out
        grid.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        grid.style.opacity    = '0';
        grid.style.transform  = 'translateY(12px)';

        setTimeout(() => {
            grid.innerHTML = '';

            pageImages.forEach((src, i) => {
                const layoutClass = layouts[i] ? ' ' + layouts[i] : '';
                const article = document.createElement('article');
                article.className = `portfolio-item${layoutClass}`;

                article.innerHTML = `
                    <div class="portfolio-image">
                        <img src="${src}" alt="Proje ${start + i + 1}" loading="lazy">
                    </div>
                    <div class="portfolio-overlay">
                        <h3>Proje ${start + i + 1}</h3>
                        <p>3D Çizim &amp; Görselleştirme</p>
                    </div>
                `;

                grid.appendChild(article);
            });

            // Sayfa bilgisi & buton durumları
            pageInfo.textContent  = `${page + 1} / ${totalPages}`;
            prevBtn.disabled      = page === 0;
            nextBtn.disabled      = page === totalPages - 1;

            // Lightbox'ı yeni item'lara bağla
            bindLightboxToPortfolio();

            // Fade in
            grid.style.opacity   = '1';
            grid.style.transform = 'translateY(0)';

        }, 270);
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) { currentPage--; renderPage(currentPage); }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) { currentPage++; renderPage(currentPage); }
    });

    // İlk yükleme
    grid.style.opacity    = '1';
    grid.style.transform  = 'translateY(0)';
    renderPage(0);
}

// Lightbox event'lerini portfolio item'larına bağlar (sayfa geçişlerinde yeniden çağrılır)
function bindLightboxToPortfolio() {
    const lightbox      = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    if (!lightbox || !lightboxImage) return;

    document.querySelectorAll('.portfolio-item').forEach((item) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.portfolio-image img');
            if (img) {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// ===================================
// Lightbox for Fullscreen Images
// ===================================
function initLightbox() {
    const lightbox      = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (!lightbox || !lightboxImage) return;

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
}

// ===================================
// Hero Pattern Mouse Parallax
// ===================================
function initHeroPattern() {
    const heroPattern = document.querySelector('.hero-pattern');
    const hero        = document.querySelector('.hero');
    if (!heroPattern || !hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect  = hero.getBoundingClientRect();
        const x     = (e.clientX - rect.left)  / rect.width  - 0.5;
        const y     = (e.clientY - rect.top)   / rect.height - 0.5;
        heroPattern.style.transform = `translate(${x * -30}px, ${y * -30}px)`;
    });

    hero.addEventListener('mouseleave', () => {
        heroPattern.style.transform = 'translate(0, 0)';
    });
}

// ===================================
// Scroll-Triggered Fade-In Animations
// ===================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    fadeElements.forEach((el) => observer.observe(el));
}

// ===================================
// Mobile Menu Toggle
// ===================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!menuBtn || !navList) return;

    menuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        menuBtn.classList.toggle('active');
        const spans = menuBtn.querySelectorAll('span');
        if (menuBtn.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity   = '1';
            spans[2].style.transform = 'none';
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            menuBtn.classList.remove('active');
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity   = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ===================================
// Smooth Scroll for Navigation
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' });
            }
        });
    });
}

// ===================================
// Form Handling
// ===================================
function initFormHandling() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data     = Object.fromEntries(formData);
        const subject  = `Yeni İletişim Formu Mesajı: ${data.name}`;
        const body     = `Ad Soyad: ${data.name}\nE-posta: ${data.email}\n\nMesaj:\n${data.message}`;
        window.location.href = `mailto:erdoganntvn@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        const submitBtn = form.querySelector('button[type="submit"]');
        const origText  = submitBtn.textContent;
        submitBtn.textContent = 'E-posta İstemcisi Açılıyor...';
        submitBtn.style.backgroundColor = '#25D366';
        form.reset();
        setTimeout(() => {
            submitBtn.textContent = origText;
            submitBtn.style.backgroundColor = '';
        }, 3000);
    });
}

// ===================================
// Header Scroll Effect
// ===================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (!header) return;
    header.style.boxShadow = window.scrollY > 100
        ? '0 2px 20px rgba(0, 0, 0, 0.1)'
        : 'none';
});
