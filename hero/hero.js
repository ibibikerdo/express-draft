/**
 * hero/hero.js
 * Sol dikey slider → sağ büyük görsel + proje adı senkronizasyonu
 * Dosya adından proje adı çıkarımı (uzantısız)
 */

(function () {
  "use strict";

  window.initHeroSlider = function () {
    "use strict";

    const WORKS = [
      { src: "hero/works/Çankaya Belediye Peyzaj Tasarımı.png" },
      { src: "hero/works/work (2).png" },
      { src: "hero/works/work (3).png" },
      { src: "hero/works/work (4).png" },
      { src: "hero/works/work (5).png" },
      { src: "hero/works/work (6).png" },
      { src: "hero/works/work (7).png" },
      { src: "hero/works/work (8).png" },
      { src: "hero/works/work (9).png" },
      { src: "hero/works/work (10).png" },
      { src: "hero/works/work (11).png" },
      { src: "hero/works/work (12).png" },
      { src: "hero/works/work (13).png" },
      { src: "hero/works/work (14).png" },
      { src: "hero/works/work (15).png" },
      { src: "hero/works/work (16).png" },
      { src: "hero/works/work (17).png" },
      { src: "hero/works/work (18).png" },
      { src: "hero/works/work (19).png" },
      { src: "hero/works/work (20).png" },
      { src: "hero/works/work (21).png" },
      { src: "hero/works/work (22).png" },
      { src: "hero/works/work (23).png" },
      { src: "hero/works/work (24).png" },
      { src: "hero/works/work (25).png" },
      { src: "hero/works/work (26).png" },
      { src: "hero/works/work (27).png" },
      { src: "hero/works/work (28).png" },
      { src: "hero/works/work (29).png" },
      { src: "hero/works/work (30).png" },
    ];

    function extractProjectName(src) {
      const parts = src.split("/");
      const filename = parts[parts.length - 1];
      const noExt = filename.replace(/\.[^.]+$/, "");
      const match = noExt.match(/^work\s*\((\d+)\)$/i);
      if (match) return "Proje " + match[1];
      return noExt;
    }

    let currentIndex = 0;
    const total = WORKS.length;

    const track = document.getElementById("heroSliderTrack");
    const prevBtn = document.getElementById("heroSliderPrev");
    const nextBtn = document.getElementById("heroSliderNext");
    const countEl = document.getElementById("heroSliderCount");
    const previewImg = document.getElementById("heroPreviewImg");
    const previewWrap = document.getElementById("heroPreviewWrap");
    const previewTitle = document.getElementById("heroPreviewTitle");
    const previewIndex = document.getElementById("heroPreviewIndex");
    const previewBar = document.getElementById("heroPreviewBar");
    const expandBtn = document.getElementById("heroExpandBtn");
    const lightbox = document.getElementById("heroLightbox");
    const lbImg = document.getElementById("heroLightboxImg");
    const lbName = document.getElementById("heroLightboxName");
    const lbClose = document.getElementById("heroLightboxClose");
    const lbOverlay = document.getElementById("heroLightboxOverlay");
    const lbPrev = document.getElementById("heroLightboxPrev");
    const lbNext = document.getElementById("heroLightboxNext");

    if (!track) return;
    function buildSlider() {
      track.innerHTML = "";
      WORKS.forEach((work, i) => {
        const slide = document.createElement("div");
        slide.className = "hero-slide" + (i === 0 ? " active" : "");
        slide.dataset.index = i;

        const img = document.createElement("img");
        img.src = work.src;
        img.alt = extractProjectName(work.src);
        img.loading = i < 4 ? "eager" : "lazy";

        const num = document.createElement("span");
        num.className = "hero-slide-num";
        num.textContent = String(i + 1).padStart(2, "0");

        slide.appendChild(img);
        slide.appendChild(num);
        slide.addEventListener("click", () => goTo(i));
        track.appendChild(slide);
      });
    }

    function goTo(index) {
      if (index < 0 || index >= total) return;
      const slides = track.querySelectorAll(".hero-slide");
      slides[currentIndex].classList.remove("active");
      currentIndex = index;
      slides[currentIndex].classList.add("active");
      positionTrack();
      updatePreview(currentIndex);
      updateNavBtns();
      updateCount();
    }

    function positionTrack() {
      const slides = track.querySelectorAll(".hero-slide");
      if (!slides.length) return;
      const slideH = slides[0].offsetHeight;
      const colH = track.parentElement.offsetHeight - 80;
      const offset = Math.max(
        0,
        currentIndex * slideH - (colH / 2 - slideH / 2),
      );
      track.style.transform = `translateY(-${offset}px)`;
    }

    function updatePreview(index) {
      if (!previewImg) return;
      const work = WORKS[index];
      const name = extractProjectName(work.src);

      previewImg.classList.remove("active");
      setTimeout(() => {
        previewImg.src = work.src;
        previewImg.alt = name;
        previewImg.onload = () => previewImg.classList.add("active");
        if (previewImg.complete) previewImg.classList.add("active");
      }, 260);

      if (previewTitle) {
        previewTitle.style.opacity = "0";
        setTimeout(() => {
          previewTitle.textContent = name;
          previewTitle.style.opacity = "1";
          previewTitle.style.transition = "opacity 0.3s ease";
        }, 200);
      }
      if (previewBar) {
        previewBar.style.width = ((index + 1) / total) * 100 + "%";
      }
      if (previewIndex) {
        previewIndex.textContent =
          String(index + 1).padStart(2, "0") +
          " / " +
          String(total).padStart(2, "0");
      }
    }

    function updateNavBtns() {
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === total - 1;
    }

    function updateCount() {
      if (countEl) countEl.textContent = currentIndex + 1 + " / " + total;
    }

    function openLightbox(index) {
      if (!lightbox || !lbImg) return;
      const work = WORKS[index];
      const name = extractProjectName(work.src);
      lbImg.src = work.src;
      lbImg.alt = name;
      if (lbName) lbName.textContent = name;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => lbImg.classList.add("active"), 50);
    }

    function closeLightbox() {
      if (!lightbox) return;
      lbImg.classList.remove("active");
      setTimeout(() => {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }, 250);
    }

    function lbNavigate(dir) {
      const next = (currentIndex + dir + total) % total;
      goTo(next);
      const work = WORKS[next];
      const name = extractProjectName(work.src);
      lbImg.classList.remove("active");
      setTimeout(() => {
        lbImg.src = work.src;
        lbImg.alt = name;
        if (lbName) lbName.textContent = name;
        lbImg.classList.add("active");
      }, 150);
    }

    function bindEvents() {
      if (prevBtn)
        prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
      if (nextBtn)
        nextBtn.addEventListener("click", () => goTo(currentIndex + 1));
      if (expandBtn)
        expandBtn.addEventListener("click", () => openLightbox(currentIndex));
      if (lbClose) lbClose.addEventListener("click", closeLightbox);
      if (lbOverlay) lbOverlay.addEventListener("click", closeLightbox);
      if (lbPrev) lbPrev.addEventListener("click", () => lbNavigate(-1));
      if (lbNext) lbNext.addEventListener("click", () => lbNavigate(1));
      window.addEventListener("resize", positionTrack, { passive: true });
    }

    buildSlider();
    updatePreview(0);
    updateNavBtns();
    updateCount();
    bindEvents();
    setTimeout(positionTrack, 100);
  };

  /* -----------------------------------------------
     İNİT
  ----------------------------------------------- */
  function init() {
    if (!track) return;
    buildSlider();
    updatePreview(0);
    updateNavBtns();
    updateCount();
    bindEvents();
    // İlk konumlandırma (görseller yüklendikten sonra)
    setTimeout(positionTrack, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
