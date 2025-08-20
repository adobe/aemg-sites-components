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
    setTimeout(function () {
      $(".toolbar-hitech .desktop").css("z-index", "14");

      $(".toolsection .share-icon").css("pointer-events", "none");
      $(".toolsection #gu_theme-icon").css("pointer-events", "none");
      $(".toolsection .gu-pdf-export__button").css("pointer-events", "none");
      $(".toolsection .language-selector__toggle").css("pointer-events", "none");
      $(".toolsection #gu_accessibility-icon").css("pointer-events", "none");

      $(".feedback-component").hide();

      $(".backToTop").hide();

      $(".toolsection .version-selector .dropdown").attr("style", "");
      $(".toolsection .version-selector .dropdown").css({
        "border-width": "0px",
        "pointer-events": "none",
      });

      //fsi
      $(".fsi-guides-topic-page .header").attr("style", "");
      $(".fsi-guides-topic-page .header").css({
        "background-color": "rgba(255, 255, 255, 0.1)",
        "backdrop-filter": "blur(100px)",
        "border-bottom": "unset",
      });

      $(".gu-search__container").css("pointer-events", "none");
      $(".gu-header_nav-link").css("pointer-events", "none");
      $(".gu-header_logo").css("pointer-events", "none");

      });
    }

  function resetMenu() {
    $(".toolbar-hitech .desktop").css("z-index", "unset");

    $(".toolsection .share-icon").css("pointer-events", "unset");
    $(".toolsection #gu_theme-icon").css("pointer-events", "unset");
    $(".toolsection .gu-pdf-export__button").css("pointer-events", "unset");
    $(".toolsection .language-selector__toggle").css("pointer-events", "unset");
    $(".toolsection #gu_accessibility-icon").css("pointer-events", "unset");

    $(".feedback-component").show();

    $(".backToTop").show();

    $(".toolsection .version-selector .dropdown").css({
      "border-width": "0px",
      "pointer-events": "unset",
    });

    //fsi
    $(".fsi-guides-topic-page .header").css({
      "background-color": "var(--white-color)",
      "backdrop-filter": "unset",
      "border-bottom": "1px solid #e2e2e2",
    });

    $(".gu-search__container").css("pointer-events", "unset");
    $(".gu-header_nav-link").css("pointer-events", "unset");
    $(".gu-header_logo").css("pointer-events", "unset");

  }
});
