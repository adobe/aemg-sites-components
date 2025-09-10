$(document).ready(function () {
  let tocLinks = document.querySelectorAll(".tableofcontents ul li a");
  let sections = [];
  let isScrollingByClick = false;
  let scrollTimeout;

  // Function to get the total height of fixed elements (header + breadcrumb)
  function getFixedElementsHeight() {
    let header = document.querySelector(".header");
    let breadcrumb = document.querySelector(".breadcrumb");
    let headerHeight = header ? header.getBoundingClientRect().height : 0;
    let breadcrumbHeight = breadcrumb
      ? breadcrumb.getBoundingClientRect().height
      : 0;
    return headerHeight + breadcrumbHeight;
  }

  // Store section elements
  tocLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      const rawId = href.slice(1); // remove "#"
      const safeSelector = "#" + CSS.escape(rawId);
      const target = document.querySelector(safeSelector);
      if (target) {
        sections.push(target);
      }
    }

    // Click event
    link.addEventListener("click", function (event) {
      event.preventDefault();
      isScrollingByClick = true;

      // Remove active class from all <li> elements
      document
        .querySelectorAll(".tableofcontents ul li")
        .forEach((li) => li.classList.remove("active"));
      link.parentElement.classList.add("active");

      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const rawId = href.slice(1);
        const safeSelector = "#" + CSS.escape(rawId);
        const targetSection = document.querySelector(safeSelector);

        if (targetSection) {
          let fixedElementsHeight = getFixedElementsHeight();
          let targetPosition =
            targetSection.getBoundingClientRect().top +
            window.scrollY -
            fixedElementsHeight -
            10;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingByClick = false;
      }, 1000);
    });
  });

  // Intersection Observer for active section highlighting
  let observer = new IntersectionObserver(
    (entries) => {
      if (isScrollingByClick) return;
      let fixedElementsHeight = getFixedElementsHeight();
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Escape the ID before matching href
          let safeSelector = `.tableofcontents ul li a[href="#${CSS.escape(
            entry.target.id
          )}"]`;
          let activeLink = document.querySelector(safeSelector);

          if (activeLink) {
            document
              .querySelectorAll(".tableofcontents ul li")
              .forEach((li) => li.classList.remove("active"));
            activeLink.parentElement.classList.add("active");
          }
        }
      });
    },
    {
      rootMargin: `-${getFixedElementsHeight() + 10}px 0px -80% 0px`,
      threshold: 0.1,
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Update observer on window resize
  window.addEventListener("resize", () => {
    observer.disconnect();
    sections.forEach((section) => observer.observe(section));
  });
});
