$(document).ready(function () {
  //const $toolbar = $('.toolbar-hitech .desktop');

  const getActiveToolbar = () =>
    document.querySelector(".toolbar:not(.hidden) .language-selector");
  const isMobileView = () => window.matchMedia("(max-width: 1023px)").matches;

  const createBackdrop = () => {
    //if (!isMobileView()) return; // Only add backdrop for mobile view
    let backdrop = document.createElement("div");
    //$toolbar.css('position', 'static');
    setMenu();

    if (backdrop) {
      backdrop.classList.add("language-backdrop");
      document.body.appendChild(backdrop);
    }
  };

  const removeBackdrop = () => {
    const backdrop = document.querySelector(".language-backdrop");
    if (backdrop) backdrop.remove();
  };

  document.addEventListener("click", (event) => {
    const activeToolbar = getActiveToolbar();
    if (!activeToolbar || activeToolbar.closest(".lat-section")) return;

    const toggleButton = activeToolbar.querySelector(
      ".language-selector__toggle"
    );
    const menu = activeToolbar.querySelector(".cmp-languagenavigation");
    if (!menu) {
      return;
    }
    if (toggleButton.contains(event.target)) {
      event.stopPropagation(); // Prevent immediate closing due to document click listener
      const isVisible = menu.style.display === "block";

      if (isVisible) {
        menu.style.display = "none";

        removeBackdrop();
      } else {
        menu.style.display = "block";

        createBackdrop(); // Add backdrop only if in mobile view
      }
    } else if (event.target.closest(".cmp-languagenavigation__item-title")) {
      const clickedTitle = event.target.closest(
        ".cmp-languagenavigation__item-title"
      );
      const parentItem = clickedTitle.closest(".cmp-languagenavigation__item");

      // Close all items first
      activeToolbar
        .querySelectorAll(".cmp-languagenavigation__item")
        .forEach((item) => item.classList.remove("open"));

      // Toggle clicked item
      if (!parentItem.classList.contains("open")) {
        parentItem.classList.add("open");
      }
    } else {
      menu.style.display = "none"; // Hide menu if clicking outside
      removeBackdrop();
    }
  });

  // Hide menu and remove backdrop on resize
  window.addEventListener("resize", () => {
    const activeToolbar = getActiveToolbar();
    if (!activeToolbar || activeToolbar.closest(".lat-section")) return;
    document
      .querySelectorAll(".cmp-languagenavigation")
      .forEach((menu) => (menu.style.display = "none"));
    removeBackdrop();
  });

  // Hide menu and remove backdrop when clicking the backdrop
  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("language-backdrop")) {
      //$toolbar.css('position', 'sticky');
      resetMenu();
      document
        .querySelectorAll(".cmp-languagenavigation")
        .forEach((menu) => (menu.style.display = "none"));
      removeBackdrop();
    }
  });

  function setMenu() {
    setTimeout(function () {
      $(".toolbar-hitech .desktop").css("z-index", "14");

      $(".toolsection .share-icon").css("pointer-events", "none");
      $(".toolsection #gu_theme-icon").css("pointer-events", "none");
      $(".toolsection .gu-pdf-export__button").css("pointer-events", "none");
      $(".toolsection .language-selector__toggle").css(
        "pointer-events",
        "none"
      );
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
      
      $(".fsi-guides-topic-page .gu-search__container").css("pointer-events", "none");
      $(".fsi-guides-topic-page .gu-header_nav-link").css("pointer-events", "none");
      $(".fsi-guides-topic-page .gu-header_logo-container").css("pointer-events", "none");

      // Manufacturing
      $(".manufacturing-guides-topic-page .header").attr("style", "");
      $(".manufacturing-guides-topic-page .header").css({
        "background-color": "rgba(255, 255, 255, 0.1)",
        "backdrop-filter": "blur(100px)",
        "border-bottom": "unset",
      });

      $(".manufacturing-guides-topic-page .cmp-search__input").attr("style","");
      $(".manufacturing-guides-topic-page .cmp-search__input").css({
        "background-color": "rgba(255, 255, 255, 0.1)",
        "pointer-events": "none",
      });

      $(".manufacturing-guides-topic-page .gu-search__container").css("pointer-events", "none");
      $(".manufacturing-guides-topic-page .gu-header_nav-link").css("pointer-events", "none");
      $(".manufacturing-guides-topic-page .gu-header_logo-container").css("pointer-events", "none");
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
      "border-width": "1px",
      "pointer-events": "unset",
    });

    //fsi
    $(".fsi-guides-topic-page .header").css({
      "background-color": "var(--white-color)",
      "backdrop-filter": "unset",
      "border-bottom": "1px solid var(--greyish-border)",
    });

    $(".fsi-guides-topic-page .gu-search__container").css("pointer-events", "unset");
    $(".fsi-guides-topic-page .gu-header_nav-link").css("pointer-events", "unset");
    $(".fsi-guides-topic-page .gu-header_logo-container").css("pointer-events", "unset");

    //Manufacturing
    $(".manufacturing-guides-topic-page .header").css({
      "background-color": "var(--white-color)",
      "backdrop-filter": "unset",
      "border-bottom": "1px solid var(--greyish-border)",
    });

    $(".manufacturing-guides-topic-page .cmp-search__input").attr("style", "");
    $(".manufacturing-guides-topic-page .cmp-search__input").css({
      "background-color": "unset",
      "pointer-events": "unset",
    });

    $(".manufacturing-guides-topic-page .gu-search__container").css("pointer-events", "unset");
    $(".manufacturing-guides-topic-page .gu-header_nav-link").css("pointer-events", "unset");
    $(".manufacturing-guides-topic-page .gu-header_logo-container").css("pointer-events", "unset");
  }
});
