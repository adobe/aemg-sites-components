document.addEventListener("DOMContentLoaded", function () {
  const updateLogo = (logo) => {
    const darkLogo = logo.getAttribute("data-src-dark");
    const lightLogo = logo.getAttribute("data-src-light");

    const isDarkMode = document.body.classList.contains("dark");
    const isAdobeDarkContrast =
      document.documentElement.id === "adobeguides-dark-contrast";

    if (isDarkMode || isAdobeDarkContrast) {
      logo.src = darkLogo;
    } else {
      logo.src = lightLogo;
    }
  };

  const logos = document.querySelectorAll(".gu-header_logo, .gu-footer_logo");

  // Initial update for all logos
  logos.forEach(updateLogo);

  // Observe body class changes and document element ID changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        (mutation.type === "attributes" &&
          mutation.attributeName === "class") ||
        (mutation.type === "attributes" &&
          mutation.attributeName === "id" &&
          mutation.target === document.documentElement)
      ) {
        logos.forEach(updateLogo);
      }
    });
  });
  // Configure observer to watch both body class and document element ID
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["id"],
  });
});
