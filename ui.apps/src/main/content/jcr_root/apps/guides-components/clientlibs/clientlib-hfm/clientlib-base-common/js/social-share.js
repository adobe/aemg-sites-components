$(document).ready(function () {
  const getActiveToolbar = () =>
    document.querySelector(".toolbar:not(.hidden) .social-share-container");

  const isMobileView = () => window.matchMedia("(max-width: 1023px)").matches;

  // Create backdrop element
  let backdrop = document.createElement("div");

  if (backdrop) {
    backdrop.className = "backdrop hidden";
    document.body.appendChild(backdrop);
    backdrop.style.display = "none";
  }

  // Toggle share dropdown
  document.addEventListener("click", (event) => {
    const activeToolbar = getActiveToolbar();
    if (!activeToolbar) return;
    const shareIcon = activeToolbar.querySelector(".share-icon");
    const socialLinks = activeToolbar.querySelector(".social-links");

    const clickedOnShareIcon = shareIcon.contains(event.target);
    const clickedOnBackdrop = backdrop.contains(event.target);

    if (clickedOnShareIcon) {
      event.stopPropagation(); // Prevent closing when clicking the button
      let shouldShowLinks = null;
      // $toolbar.css('position', 'static');
      setMenu();

      if (socialLinks) {
        shouldShowLinks = socialLinks.classList.toggle("hidden");
      }
      if (isMobileView()) {
        backdrop.style.display = shouldShowLinks ? "none" : "block";
      }
      if (backdrop) {
        backdrop.style.display = "block";
      }
    } else if (!clickedOnBackdrop) {
      // Hide if clicking outside
      if (socialLinks) {
        socialLinks.classList.add("hidden");
      }
      if (backdrop) {
        backdrop.style.display = "none";
      }
    }
  });

  // Ensure dropdown resets when resizing
  window.addEventListener("resize", () => {
    Array.from(document.querySelectorAll(".social-links")).forEach((link) =>
      link.classList.add("hidden")
    );
    if (backdrop) {
      backdrop.style.display = "none";
    }
  });
  if (backdrop) {
    // Hide backdrop and dropdown when clicking on the backdrop
    backdrop.addEventListener("click", () => {
      //sticky
      resetMenu();

      Array.from(document.querySelectorAll(".social-links")).forEach((link) =>
        link.classList.add("hidden")
      );
      backdrop.style.display = "none";
    });
  }

  function setMenu() {
    $(".toolbar-hitech .desktop").css("z-index", "14");
    $(".toolsection .share-icon").css("pointer-events", "none");
    $(".toolsection #gu_theme-icon").css("pointer-events", "none");
    $(".toolsection .gu-pdf-export__button").css("pointer-events", "none");
    $(".toolsection .language-selector__toggle").css("pointer-events", "none");
    $(".toolsection #gu_accessibility-icon").css("pointer-events", "none");
    $(".toolsection .version-selector .dropdown").attr("style", "");
    $(".toolsection .version-selector .dropdown").css({
      background: "rgba(0, 0, 0, 0.01)",
      "border-width": "0px",
      "pointer-events": "none",
    });
  }

  function resetMenu() {
    $(".toolbar-hitech .desktop").css("z-index", "unset");
    $(".toolsection .share-icon").css("pointer-events", "unset");
    $(".toolsection #gu_theme-icon").css("pointer-events", "unset");
    $(".toolsection .gu-pdf-export__button").css("pointer-events", "unset");
    $(".toolsection .language-selector__toggle").css("pointer-events", "unset");
    $(".toolsection #gu_accessibility-icon").css("pointer-events", "unset");
    $(".toolsection .version-selector .dropdown").css({
      background: "#ffffff",
      "border-width": "0px",
      "pointer-events": "unset",
    });
  }
});
