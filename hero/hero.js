(function () {
  "use strict";

  // ----- Mouse ile hareket eden glow efekti -----
  function initHeroGlow() {
    const hero = document.querySelector(".hero");
    const glow = document.getElementById("heroGlow");
    if (!hero || !glow) return;

    let ticking = false;

    hero.addEventListener("mousemove", (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(240, 197, 113, 0.15) 0%, transparent 60%)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  let lightboxInitialized = false;
  let currentBindEvents = null;

  function initLightbox() {
    // Eğer daha önce oluşturulduysa tekrar oluşturma
    if (lightboxInitialized) {
      return currentBindEvents;
    }

    // Lightbox elementlerini oluştur
    const lightbox = document.createElement("div");
    lightbox.id = "heroLightbox";
    lightbox.className = "hero-lightbox";
    lightbox.innerHTML = `
      <div class="hero-lightbox-overlay"></div>
      <div class="hero-lightbox-container">
        <button class="hero-lightbox-close">&times;</button>
        <button class="hero-lightbox-prev">‹</button>
        <button class="hero-lightbox-next">›</button>
        <div class="hero-lightbox-content">
          <img class="hero-lightbox-img" src="" alt="">
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const overlay = lightbox.querySelector(".hero-lightbox-overlay");
    const closeBtn = lightbox.querySelector(".hero-lightbox-close");
    const prevBtn = lightbox.querySelector(".hero-lightbox-prev");
    const nextBtn = lightbox.querySelector(".hero-lightbox-next");
    const lightboxImg = lightbox.querySelector(".hero-lightbox-img");

    let currentImages = [];
    let currentIndex = 0;

    // Tüm diamond item'larına tıklama eventi ekle
    function bindClickEvents() {
      const items = document.querySelectorAll("#heroDiamondGrid .diamond-item");
      items.forEach((item, index) => {
        // Eski event listener'ı kaldır (varsa)
        item.removeEventListener("click", item._lightboxHandler);
        // Yeni event listener ekle
        const handler = () => openLightbox(index);
        item.addEventListener("click", handler);
        item._lightboxHandler = handler;
        item.style.cursor = "pointer";
      });
    }

    // Lightbox'ı aç
    function openLightbox(startIndex) {
      // Mevcut görselleri güncelle
      const items = document.querySelectorAll("#heroDiamondGrid .diamond-item");
      if (items.length === 0) return;

      currentImages = Array.from(items).map(
        (item) => item.querySelector("img").src,
      );
      currentIndex = startIndex;

      lightboxImg.classList.remove("active");
      lightboxImg.src = currentImages[currentIndex];
      setTimeout(() => {
        lightboxImg.classList.add("active");
      }, 50);
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    // Lightbox'ı kapat
    function closeLightbox() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }

    // Önceki görsel
    function prevImage() {
      if (currentImages.length === 0) return;
      currentIndex =
        (currentIndex - 1 + currentImages.length) % currentImages.length;
      lightboxImg.classList.remove("active");
      setTimeout(() => {
        lightboxImg.src = currentImages[currentIndex];
        lightboxImg.classList.add("active");
      }, 50);
    }

    // Sonraki görsel
    function nextImage() {
      if (currentImages.length === 0) return;
      currentIndex = (currentIndex + 1) % currentImages.length;
      lightboxImg.classList.remove("active");
      setTimeout(() => {
        lightboxImg.src = currentImages[currentIndex];
        lightboxImg.classList.add("active");
      }, 50);
    }

    // Event listener'lar
    overlay.addEventListener("click", closeLightbox);
    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", prevImage);
    nextBtn.addEventListener("click", nextImage);

    // Klavye eventleri
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    });

    lightboxInitialized = true;
    currentBindEvents = bindClickEvents;

    // İlk çağrıda eventleri bağla
    setTimeout(bindClickEvents, 50);

    return bindClickEvents;
  }

  // ----- Diamond Grid: Görselleri shuffle ve 16 tane göster (4x4 grid) -----
  function initDiamondGrid() {
    const grid = document.getElementById("heroDiamondGrid");
    if (!grid) return;

    const items = Array.from(grid.children);

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    // Sadece 16 tane göster (4x4 diamond grid)
    grid.innerHTML = "";
    items.slice(0, 16).forEach((item) => grid.appendChild(item));

    // Lightbox'ı başlat (sadece bir kez)
    const bindEvents = initLightbox();

    // Grid değiştiğinde eventleri yeniden bağla
    if (bindEvents) {
      setTimeout(bindEvents, 100);
    }

    // Her 8 saniyede bir rastgele bir diamond item'ı değiştir
    startDiamondCycler(items, bindEvents);
  }

  function startDiamondCycler(allItems, bindEvents) {
    const grid = document.getElementById("heroDiamondGrid");
    if (!grid) return;

    let pool = [...allItems]; // Havuzu kopyala

    // Başlangıç havuzunu oluştur (gösterilmeyenler)
    function updatePool() {
      const shown = new Set(
        Array.from(grid.children).map((item) => item.querySelector("img").src),
      );
      pool = allItems.filter(
        (item) => !shown.has(item.querySelector("img").src),
      );
    }

    updatePool();

    setInterval(() => {
      const cells = Array.from(grid.children);
      if (cells.length === 0 || pool.length === 0) {
        updatePool();
        if (pool.length === 0) return;
      }

      const targetIdx = Math.floor(Math.random() * cells.length);
      const target = cells[targetIdx];
      const nextItem = pool[Math.floor(Math.random() * pool.length)];

      const oldImg = target.querySelector("img");
      const oldSrc = oldImg.src;
      const newSrc = nextItem.querySelector("img").src;

      // Crossfade efekti
      const newImg = document.createElement("img");
      newImg.src = newSrc;
      newImg.style.position = "absolute";
      newImg.style.top = "0";
      newImg.style.left = "0";
      newImg.style.width = "100%";
      newImg.style.height = "100%";
      newImg.style.objectFit = "cover";
      newImg.style.opacity = "0";
      newImg.style.transition = "opacity 0.6s ease";
      newImg.style.transform = "rotate(-45deg) scale(1.2)";

      target.style.position = "relative";
      target.appendChild(newImg);

      setTimeout(() => {
        newImg.style.opacity = "1";
      }, 50);

      setTimeout(() => {
        const images = target.querySelectorAll("img");
        if (images.length > 1) {
          images[0].remove();
        }
        newImg.style.position = "relative";

        // Havuzu güncelle
        const nextIndex = pool.findIndex(
          (w) => w.querySelector("img").src === newSrc,
        );
        if (nextIndex !== -1) {
          const replacement = allItems.find(
            (w) => w.querySelector("img").src === oldSrc,
          );
          if (replacement) pool[nextIndex] = replacement;
        }

        // Eventleri yeniden bağla (yeni img eklendiği için)
        if (bindEvents) {
          setTimeout(bindEvents, 50);
        }
      }, 650);
    }, 8000);
  }

  // ----- Scroll animasyonu için observer -----
  function initScrollAnimations() {
    const elements = document.querySelectorAll(".hero-text > *");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
          }
        });
      },
      { threshold: 0.1 },
    );

    elements.forEach((el) => {
      el.style.animationPlayState = "paused";
      observer.observe(el);
    });
  }

  // ----- Başlat -----
  document.addEventListener("DOMContentLoaded", () => {
    initHeroGlow();
    initDiamondGrid();
    initScrollAnimations();
  });

  if (document.readyState !== "loading") {
    initHeroGlow();
    initDiamondGrid();
    initScrollAnimations();
  }
})();
