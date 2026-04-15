/* ===================================
   Footer JavaScript — footer/footer.js
   =================================== */

(function () {
  "use strict";

  function initFooter() {
    initLightbox();
    initProcessBadge();
  }

  /* ---- Lightbox ---- */
  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxClose = document.querySelector(".lightbox-close");

    if (!lightbox || !lightboxImage) return;

    function closeLightbox() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });

    // Global erişim için dışa aç
    window.openLightbox = function (src, alt) {
      lightboxImage.src = src;
      lightboxImage.alt = alt || "";
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    window.closeLightbox = closeLightbox;
  }

  /* ---- Process Badge (dokunmatik için toggle) ---- */
  function initProcessBadge() {
    const badge = document.getElementById("processBadge");
    if (!badge) return;

    // Mobilde hover çalışmaz → tıklama ile toggle
    badge.addEventListener("click", (e) => {
      // Panel dışına tıklanınca kapat
      const panel = badge.querySelector(".process-badge-panel");
      if (panel && panel.contains(e.target)) return;

      badge.classList.toggle("active");
    });

    // Dışarı tıklanınca kapat
    document.addEventListener("click", (e) => {
      if (!badge.contains(e.target)) {
        badge.classList.remove("active");
      }
    });
  }

  /* ---- Init ---- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFooter);
  } else {
    initFooter();
  }

  // sections-loader callback için dışa aç
  window.initFooter = initFooter;
})();
