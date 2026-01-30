(() => {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu toggle
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when clicking a link
    navLinks.forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll w/ small offset for sticky header
  const header = document.querySelector(".topbar");
  const headerOffset = () => (header ? header.offsetHeight + 10 : 0);

  function scrollToHash(hash) {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const y =
      el.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // Intercept anchor clicks to apply offset
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    e.preventDefault();
    history.pushState(null, "", href);
    scrollToHash(href);
  });

  // Handle initial load with hash (e.g., #Customer-Reviews)
  window.addEventListener("load", () => {
    if (location.hash) {
      // delay so layout is ready
      setTimeout(() => scrollToHash(location.hash), 50);
    }
  });

  // Highlight active nav link based on scroll position
  const sectionIds = navLinks
    .map((a) => a.getAttribute("href"))
    .filter(Boolean)
    .map((h) => h.replace("#", ""));

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", isActive);
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      // pick the most visible intersecting section
      const visible = entries
        .filter((en) => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible && visible.target && visible.target.id) {
        setActive(visible.target.id);
      }
    },
    {
      root: null,
      threshold: [0.2, 0.35, 0.5, 0.65],
      rootMargin: `-${headerOffset()}px 0px -60% 0px`,
    }
  );

  sections.forEach((s) => io.observe(s));

  // If user uses back/forward and hash changes
  window.addEventListener("popstate", () => {
    if (location.hash) scrollToHash(location.hash);
  });
})();