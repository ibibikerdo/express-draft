// ===================================
// Designer Portfolio - JavaScript
// ===================================

window.initApp = function () {
    initHeader();
    initScrollAnimations();
    initSmoothScroll();
    initFormHandling();
    initHeroPattern();
    initLightbox();
    initHeroWorksGrid();
    initPortfolioPagination();
};

// ===================================
// Header (Mobile Menu + Scroll + ActiveLink)
// ===================================
function initHeader() {
    initMobileMenu();
    initHeaderScroll();
    initActiveNavLink();
}

// ===================================
// Mobile Menu Toggle
// ===================================
function initMobileMenu() {
    const menuBtn  = document.querySelector('.mobile-menu-btn');
    const navList  = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuBtn || !navList) return;

    function closeMenu() {
        navList.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('active');
        menuBtn.classList.toggle('active', isOpen);
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && navList.classList.contains('active')) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('active')) {
            closeMenu();
            menuBtn.focus();
        }
    });
}

// ===================================
// Header Scroll Shadow
// ===================================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ===================================
// Active Nav Link (Scroll Spy)
// ===================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height')
    ) || 80;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === '#' + entry.target.id
                    );
                });
            }
        });
    }, {
        rootMargin: `-${headerH + 10}px 0px -60% 0px`,
        threshold: 0
    });

    sections.forEach((sec) => observer.observe(sec));
}

// ===================================
// Hero Works Grid - Random Images
// ===================================
function initHeroWorksGrid() {
    const grid = document.getElementById('heroWorksGrid');
    if (!grid) return;

    const items = Array.from(grid.children);

    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    grid.innerHTML = '';
    items.forEach((item, index) => {
        if (index < 12) grid.appendChild(item);
    });
}

// ===================================
// Portfolio Pagination + Auto-Slide
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

    const ITEMS_PER_PAGE = 7;
    const layouts        = ['large', '', '', 'tall', '', '', 'wide'];
    const totalPages     = Math.ceil(allImages.length / ITEMS_PER_PAGE);
    let currentPage      = 0;
    let autoSlideTimer   = null;
    const AUTO_INTERVAL  = 5000; // 5 saniye

    // ---- Sayfa render ----
    function renderPage(page, direction) {
        const start      = page * ITEMS_PER_PAGE;
        const pageImages = allImages.slice(start, start + ITEMS_PER_PAGE);

        // Çıkış animasyonu (ilk yüklemede yok)
        if (direction) {
            const exitX = direction === 'next' ? '-60px' : '60px';
            grid.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            grid.style.opacity    = '0';
            grid.style.transform  = `translateX(${exitX})`;
        }

        setTimeout(() => {
            grid.innerHTML = '';

            pageImages.forEach((src, i) => {
                const layoutClass = layouts[i] ? ' ' + layouts[i] : '';
                const article     = document.createElement('article');
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

            // Sayfa bilgisi ve buton durumları
            if (pageInfo) pageInfo.textContent = `${page + 1} / ${totalPages}`;
            prevBtn.disabled = page === 0;
            nextBtn.disabled = page === totalPages - 1;

            // Lightbox'ı yeni item'lara bağla
            bindLightboxToPortfolio();

            // Giriş yönüne göre başlangıç pozisyonu
            const enterX = direction === 'next' ? '60px' : direction === 'prev' ? '-60px' : '0px';
            grid.style.transition = 'none';
            grid.style.opacity    = '0';
            grid.style.transform  = `translateX(${enterX})`;

            // İki tick bekleyip fade-in başlat
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    grid.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
                    grid.style.opacity    = '1';
                    grid.style.transform  = 'translateX(0)';
                });
            });

            // Progress bar'ı sıfırla
            resetProgressBar();

        }, direction ? 360 : 0);
    }

    // ---- İlerleme çubuğu ----
    function resetProgressBar() {
        const bar = document.querySelector('.portfolio-progress-bar');
        if (!bar) return;
        bar.style.transition = 'none';
        bar.style.width      = '0%';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                bar.style.transition = `width ${AUTO_INTERVAL}ms linear`;
                bar.style.width      = '100%';
            });
        });
    }

    function pauseProgressBar() {
        const bar = document.querySelector('.portfolio-progress-bar');
        if (!bar) return;
        const computed = getComputedStyle(bar).width;
        const parent   = bar.parentElement;
        const pct      = parent ? (parseFloat(computed) / parent.offsetWidth) * 100 : 0;
        bar.style.transition = 'none';
        bar.style.width      = pct + '%';
    }

    // ---- Auto-slide ----
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(() => {
            currentPage = (currentPage + 1) % totalPages;
            renderPage(currentPage, 'next');
        }, AUTO_INTERVAL);
    }

    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }

    // ---- Hover'da duraklat ----
    const workSection = document.getElementById('work');
    if (workSection) {
        workSection.addEventListener('mouseenter', () => {
            stopAutoSlide();
            pauseProgressBar();
        });
        workSection.addEventListener('mouseleave', () => {
            startAutoSlide();
            resetProgressBar();
        });
    }

    // ---- Önceki / İleri butonları ----
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            renderPage(currentPage, 'prev');
            stopAutoSlide();
            startAutoSlide();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            renderPage(currentPage, 'next');
            stopAutoSlide();
            startAutoSlide();
        }
    });

    // ---- İlk yükleme ----
    renderPage(0, null);
    startAutoSlide();
}

// ===================================
// Lightbox — Portfolio item'larına bağla
// ===================================
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
        const rect = hero.getBoundingClientRect();
        const x    = (e.clientX - rect.left)  / rect.width  - 0.5;
        const y    = (e.clientY - rect.top)   / rect.height - 0.5;
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
        submitBtn.textContent           = 'E-posta İstemcisi Açılıyor...';
        submitBtn.style.backgroundColor = '#25D366';
        form.reset();
        setTimeout(() => {
            submitBtn.textContent           = origText;
            submitBtn.style.backgroundColor = '';
        }, 3000);
    });
}