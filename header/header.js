/* ===================================
   Header JavaScript — header/header.js
   =================================== */

(function () {
  "use strict";

  function initHeader() {
    initMobileMenu();
    initHeaderScroll();
    initActiveNavLink();
  }

  /* ---- Mobil menü ---- */
  function initMobileMenu() {
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const navList = document.querySelector(".nav-list");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!menuBtn || !navList) return;

    function closeMenu() {
      navList.classList.remove("active");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    menuBtn.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("active");
      menuBtn.classList.toggle("active", isOpen);
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav") && navList.classList.contains("active")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navList.classList.contains("active")) {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  /* ---- Scroll efekti ---- */
  function initHeaderScroll() {
    const header = document.querySelector(".header");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Aktif nav linki (IntersectionObserver) ---- */
  function initActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!sections.length || !navLinks.length) return;

    const headerH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
      ) || 88;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + entry.target.id,
              );
            });
          }
        });
      },
      {
        rootMargin: `-${headerH + 10}px 0px -60% 0px`,
        threshold: 0,
      },
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  /* ---- Init ---- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeader);
  } else {
    initHeader();
  }

  window.initHeader = initHeader;
})();
