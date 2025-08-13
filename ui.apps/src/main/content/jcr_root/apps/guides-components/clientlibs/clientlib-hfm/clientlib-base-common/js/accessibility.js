$(document).ready(function () {
  const $toolbar = $(".toolbar-hitech .desktop");
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
          $(".header").css({
            background: "transparent",
            "border-bottom": "none",
          });
        }

        $accessibilityBtn.attr("aria-expanded", "true");
        $accessibilityMenu.addClass("show");

        if (backdrop) {
          backdrop.style.display = "block";
          $toolbar.css("position", "static");
          $(".gu-toolbar_wrapper .sticky-middle.mobile").css("z-index", "11");
        }
      });

      $(document).on("click", function (event) {
        if (
          !$wrapper.is(event.target) &&
          $wrapper.has(event.target).length === 0
        ) {
          // Close menu
          $accessibilityMenu.removeClass("show");
          $accessibilityBtn.attr("aria-expanded", "false");

          // Hide backdrop
          if (backdrop) {
            backdrop.style.display = "none";
            $toolbar.css("position", "sticky");
          }

          // Restore z-index and header styles
          if ($(window).width() <= 768) {
            $(".gu-search__container").css("z-index", "");
            $(".gu-header__humberger").css("z-index", "");
            $(".header").css({
              background: "#ffffff",
              "border-bottom": "#e2e2e2",
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
      $toolbar.css("position", "sticky");

      if ($(window).width() <= 768) {
        $(".gu-search__container").css("z-index", "");
        $(".gu-header__humberger").css("z-index", "");
        $(".header").css({
          background: "#ffffff",
          "border-bottom": "#e2e2e2",
        });
      }
    });
  }
});
