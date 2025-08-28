$(document).ready(function () {
  const $toolbarContainer = $(".toolbar-container");
  const $headerToolbarContainer = $(".gu-header__toolbar-container");
  const $toolbarTopic = $(".toolbar.toolbar-topic.desktop");
  const $toolbarHeader = $(".toolbar.toolbar-header.desktop");
  const $html = $("html");
  if ($toolbarTopic.length && $toolbarContainer.length) {
    $toolbarContainer.append($toolbarTopic);
  }
  if ($toolbarHeader.length && $headerToolbarContainer.length) {
    $headerToolbarContainer.append($toolbarHeader);
  }
  $(".toolbar.above-title .lat-button").click(function () {
    $(".toolbar.above-title .lat-section").removeClass("hidden");
    $(".toolbar.above-title .lat-section").addClass("display-flex");
    $(".overlay").removeClass("hidden");
  });

  $(".toolbar.above-title .lat-closebutton").click(function () {
    $(".toolbar.above-title .lat-section").addClass("hidden");
    $(".toolbar.above-title .lat-section").removeClass("display-flex");
    $(".overlay").addClass("hidden");
  });
  function adjustPopupHeight() {
    var topOffset = 96;
    var newHeight = $(window).height() - topOffset;
    $(".toolbar.above-title .lat-section").css("height", newHeight + "px");
  }

  adjustPopupHeight();
  $(window).resize(function () {
    adjustPopupHeight();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleVisibility = () => {
    const isMobileView = window.innerWidth <= 1023; // Example breakpoint for mobile

    // Handle mobile elements
    Array.from(document.querySelectorAll(".mobile")).forEach((element) => {
      element.classList.toggle("hidden", !isMobileView);
    });

    // Handle desktop elements
    Array.from(document.querySelectorAll(".desktop")).forEach((element) => {
      element.classList.toggle("hidden", isMobileView);
    });
  };

  // Initial check
  toggleVisibility();
  // Recheck on window resize
  window.addEventListener("resize", toggleVisibility);
});

// change marge based on contributors
document.addEventListener("DOMContentLoaded", function () {
  const contributors = document.querySelector(
    "div.topic .topic__updated .updated__container .contributors"
  );
  const toolbarSection = document.querySelector(
    ".below-updated.mobile .toolsection"
  );
  if (window.innerWidth <= 768 && toolbarSection) {
    if (contributors && contributors.children.length > 0) {
      toolbarSection.style.marginTop = "-3.3rem";
    } else {
      toolbarSection.style.marginTop = "-2.6rem";
      contributors.style.background = "red";
    }
  }

  const applyManufacturingToolbarFilter = () => {
    const $html = $("html");
    const isLight = $html.hasClass("adobeguides-light-contrast");
    const $imgs = $(".toolbar-wrapper img");

    if (isLight) {
      $imgs.each(function () {
        this.style.setProperty("filter", "none", "important");
      });
    } else {
      $imgs.each(function () {
        this.style.removeProperty("filter");
      });
    }
  };

  const htmlEl = document.documentElement;
  if (window.MutationObserver && htmlEl) {
    const observer = new MutationObserver(() => applyManufacturingToolbarFilter());
    observer.observe(htmlEl, { attributes: true, attributeFilter: ["class", "id"] });
  }

  applyManufacturingToolbarFilter();
  setTimeout(applyManufacturingToolbarFilter, 300);
});
