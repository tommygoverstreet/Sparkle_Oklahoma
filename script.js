(() => {
  "use strict";

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme toggle ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const storedTheme = localStorage.getItem("sparkle-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (storedTheme ? storedTheme === "dark" : systemPrefersDark) {
    root.classList.add("dark");
  }
  const syncThemeToggleLabel = () => {
    if (!themeToggle) return;
    const isDark = root.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  };
  syncThemeToggleLabel();
  themeToggle?.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("sparkle-theme", isDark ? "dark" : "light");
    syncThemeToggleLabel();
  });

  /* ---------- mobile nav ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  navToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  document.querySelectorAll('.nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (nav?.classList.contains("open")) {
        nav.classList.remove("open");
        navToggle?.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---------- sticky header shadow ---------- */
  const header = document.querySelector(".site-header");
  const onScrollHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- sticky mobile CTA ---------- */
  const mobileCta = document.querySelector(".mobile-cta");
  const hero = document.querySelector(".hero");
  if (mobileCta && hero) {
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          mobileCta.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { rootMargin: "-60% 0px 0px 0px" }
    );
    ctaObserver.observe(hero);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector(".faq-question");
    button?.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  /* ---------- scroll reveal ---------- */
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- before/after sparkle slider ---------- */
  const slider = document.querySelector(".sparkle-slider");
  const range = document.querySelector(".sparkle-range");
  const afterPane = document.querySelector(".pane-after");
  if (slider && range && afterPane) {
    const setReveal = (value) => {
      const clamped = Math.max(0, Math.min(100, value));
      slider.style.setProperty("--reveal", `${clamped}%`);
      range.value = String(clamped);
      range.setAttribute("aria-valuenow", String(Math.round(clamped)));
    };
    range.addEventListener("input", (e) => setReveal(Number(e.target.value)));
    setReveal(52);

    if (!prefersReducedMotion) {
      let introDone = false;
      const introObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !introDone) {
            introDone = true;
            let v = 52;
            const dir = { toggled: false };
            const step = () => {
              v += dir.toggled ? 0.6 : -0.6;
              if (v <= 30) dir.toggled = true;
              if (v >= 70) { setReveal(70); return; }
              setReveal(v);
              requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        });
      }, { threshold: 0.4 });
      introObserver.observe(slider);
    }
  }

  /* ---------- instant estimate calculator ---------- */
  const estimateForm = document.getElementById("estimateForm");
  const estimateValue = document.getElementById("estimateValue");
  const estimateNote = document.getElementById("estimateNote");

  const SIZE_BASE = {
    studio: 90,
    "2bed": 115,
    "3bed": 140,
    "4bed": 170,
    "5bed": 205
  };
  const BATH_ADD = {
    "1": 0,
    "1.5": 10,
    "2": 18,
    "2.5": 26,
    "3plus": 40
  };
  const SERVICE_FACTOR = {
    recurring: 1,
    deep: 1.42,
    movein: 1.55,
    moveout: 1.55
  };
  const FREQUENCY_DISCOUNT = {
    onetime: 0,
    weekly: 0.18,
    biweekly: 0.12,
    monthly: 0.05
  };
  const FREQUENCY_LABEL = {
    onetime: "one-time visit",
    weekly: "weekly visits",
    biweekly: "bi-weekly visits",
    monthly: "monthly visits"
  };

  function updateEstimate() {
    if (!estimateForm || !estimateValue) return;
    const data = new FormData(estimateForm);
    const size = data.get("size") || "2bed";
    const baths = data.get("baths") || "1";
    const service = data.get("service") || "recurring";
    const frequency = data.get("frequency") || "onetime";

    const base = (SIZE_BASE[size] || 115) + (BATH_ADD[baths] || 0);
    const factored = base * (SERVICE_FACTOR[service] || 1);
    const discount = FREQUENCY_DISCOUNT[frequency] || 0;
    const price = factored * (1 - discount);

    const low = Math.round((price * 0.92) / 5) * 5;
    const high = Math.round((price * 1.12) / 5) * 5;

    estimateValue.textContent = `$${low}–$${high}`;
    if (estimateNote) {
      estimateNote.textContent = `Estimated per visit for ${FREQUENCY_LABEL[frequency] || "your schedule"}. We'll confirm exact pricing after a quick chat about your space.`;
    }
  }

  estimateForm?.addEventListener("change", updateEstimate);
  updateEstimate();

  /* ---------- review carousel ---------- */
  const track = document.querySelector(".review-track");
  const slides = track ? Array.from(track.children) : [];
  const dotsWrap = document.querySelector(".carousel-dots");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");
  let current = 0;
  let autoplayId = null;

  if (track && slides.length > 1) {
    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Show review ${i + 1}`);
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function render() {
      slides.forEach((slide, i) => {
        slide.style.display = i === current ? "block" : "none";
      });
      dotsWrap?.querySelectorAll("button").forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      render();
    }

    prevBtn?.addEventListener("click", () => { goTo(current - 1); restartAutoplay(); });
    nextBtn?.addEventListener("click", () => { goTo(current + 1); restartAutoplay(); });

    function startAutoplay() {
      if (prefersReducedMotion) return;
      autoplayId = window.setInterval(() => goTo(current + 1), 6000);
    }
    function stopAutoplay() {
      if (autoplayId) window.clearInterval(autoplayId);
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    const carousel = document.querySelector(".review-carousel");
    carousel?.addEventListener("mouseenter", stopAutoplay);
    carousel?.addEventListener("mouseleave", startAutoplay);
    carousel?.addEventListener("focusin", stopAutoplay);
    carousel?.addEventListener("focusout", startAutoplay);

    render();
    startAutoplay();
  }

  /* ---------- contact form ---------- */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      formStatus.className = "form-status";
      formStatus.textContent = "Sending your request...";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Request failed");

        formStatus.classList.add("is-success");
        formStatus.textContent = "Thanks! Your request was sent successfully. Sparkle Oklahoma will follow up by email soon.";
        contactForm.reset();
      } catch (error) {
        formStatus.classList.add("is-error");
        formStatus.textContent = "We couldn't send the form right now. Please call 405-409-3466 or email shanklinemma@gmail.com.";
      }
    });
  }
})();
