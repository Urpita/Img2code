document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. Mobile Menu Controller
     ========================================================================== */
  const burgerBtn = document.querySelector(".burger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-signin-btn");

  function openMenu() {
    if (!burgerBtn || !mobileMenu || !mobileOverlay) return;
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileMenu.removeAttribute("hidden");
    mobileOverlay.removeAttribute("hidden");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!burgerBtn || !mobileMenu || !mobileOverlay) return;
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("hidden", "");
    mobileOverlay.setAttribute("hidden", "");
    document.body.classList.remove("menu-open");
  }

  if (burgerBtn) {
    burgerBtn.addEventListener("click", () => {
      const isOpen = burgerBtn.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720 && document.body.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  /* ==========================================================================
     2. Stats Count-Up Animation
     ========================================================================== */
  const statCards = document.querySelectorAll(".stat-card");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function runCountUp(card, index) {
    const target = parseFloat(card.dataset.target);
    const decimals = parseInt(card.dataset.decimals ?? "0", 10);
    const numEl = card.querySelector(".num");
    if (!numEl) return;

    if (prefersReduced) {
      numEl.textContent = target.toFixed(decimals);
      return;
    }

    const duration = 1500 + index * 80;
    const offset = 480 + index * 90;

    setTimeout(() => {
      let startTime = null;

      function frame(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = target * eased;

        numEl.textContent = current.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          numEl.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(frame);
    }, offset);
  }

  let animated = false;
  const statsFooter = document.querySelector(".stats-footer");

  if (statsFooter && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            statCards.forEach((card, index) => {
              runCountUp(card, index);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(statsFooter);
  } else {
    // Fallback if IntersectionObserver is unsupported or element already visible
    statCards.forEach((card, index) => {
      runCountUp(card, index);
    });
  }
});
