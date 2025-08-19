$(document).ready(function () {
  //const $toolbar = $(".toolbar-hitech .desktop");
  let backdrop = document.createElement("div");
  if (backdrop) {
    backdrop.className = "backdropAccessibility hidden";
    document.body.appendChild(backdrop);
    backdrop.style.display = "none";
  }

  $(".gu-accessibility_wrapper").each(function () {
    const $wrapper = $(this);
    const $accessibilityBtn = $wrapper.find("#gu_accessibility-icon");
    const $accessibilityMenu = $wrapper.find("#gu_accessibility-menu");

    if ($accessibilityBtn.length && $accessibilityMenu.length) {
      $accessibilityBtn.on("click", function (e) {
        e.stopPropagation();

        // If already open, don't toggle — let outside click close it
        if ($accessibilityMenu.hasClass("show")) {
          return;
        }

        if ($(window).width() <= 768) {
          $(".gu-search__container").css("z-index", "-1");
          $(".gu-header__humberger").css("z-index", "-1");
          $(".hi-tech .header").attr(
            "style",
            "background-color: rgba(255, 255, 255, 0.1);" +
            "border-bottom: unset;" +
            "backdrop-filter: blur(100px);"
          );
        }

        $accessibilityBtn.attr("aria-expanded", "true");
        $accessibilityMenu.addClass("show");

        if (backdrop) {
          backdrop.style.display = "block";
          //$toolbar.css("position", "static");
          setMenu();
          $(".gu-toolbar_wrapper .sticky-middle.mobile").css("z-index", "11");
        }
      });

      $(document).on("click", function (event) {
        // if click is NOT on button or inside menu
        if (
          !$accessibilityBtn.is(event.target) &&
          !$accessibilityMenu.is(event.target) &&
          $accessibilityMenu.has(event.target).length === 0
        ) {
          // Close menu
          $accessibilityMenu.removeClass("show");
          $accessibilityBtn.attr("aria-expanded", "false");

          // Hide backdrop
          if (backdrop) {
            backdrop.style.display = "none";
            resetMenu();
          }

          // Restore z-index and header styles
          if ($(window).width() <= 768) {
            $(".gu-search__container").css("z-index", "");
            $(".gu-header__humberger").css("z-index", "");
            $(".hi-tech .header").css({
              background: "#ffffff",
              "border-bottom": "1px solid #e2e2e2",
              "backdrop-filter": "unset"
            });
          }
        }
      });
      
      const $menuItems = $accessibilityMenu.find("li");
      $menuItems.on("keydown", function (event) {
        const index = $menuItems.index(this);
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            $menuItems.eq((index + 1) % $menuItems.length).focus();
            break;
          case "ArrowUp":
            event.preventDefault();
            $menuItems
              .eq((index - 1 + $menuItems.length) % $menuItems.length)
              .focus();
            break;
          case "Enter":
          case " ":
            event.preventDefault();
            alert("Selected: " + $(this).text());
            $accessibilityMenu.removeClass("show");
            $accessibilityBtn.attr("aria-expanded", "false");
            break;
          case "Escape":
            $accessibilityMenu.removeClass("show");
            $accessibilityBtn.attr("aria-expanded", "false").focus();
            break;
        }
      });
    }
  });

  if (backdrop) {
    // Hide backdrop and dropdown when clicking on the backdrop
    backdrop.addEventListener("click", () => {
      backdrop.style.display = "none";
      //$toolbar.css("position", "sticky");
      resetMenu();
      

      if ($(window).width() <= 768) {
        $(".gu-search__container").css("z-index", "");
        $(".gu-header__humberger").css("z-index", "");
        $(".hi-tech .header").css({
          background: "#ffffff",
          "border-bottom": "1px solid #e2e2e2",
        });
      }
    });
  }
  
  function setMenu() {
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

    $(".gu-header_search-container").removeClass("search-visible");
    $(".cmp-search__form").css("display", "none");

    $(".gu-search__container").css("pointer-events", "none");
    $(".gu-header_nav-link").css("pointer-events", "none");
    $(".gu-header_logo").css("pointer-events", "none");
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
    
    $(".gu-header_search-container").addClass("search-visible");
    $(".cmp-search__form").css("display", "block");

    $(".gu-search__container").css("pointer-events", "unset");
    $(".gu-header_nav-link").css("pointer-events", "unset");
    $(".gu-header_logo").css("pointer-events", "unset");
  }
});

