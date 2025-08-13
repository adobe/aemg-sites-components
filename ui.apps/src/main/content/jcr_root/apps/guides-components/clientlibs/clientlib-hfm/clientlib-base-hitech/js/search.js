$(document).ready(function () {
  $(".gu-search__toggle").click(function (e) {
    e.stopPropagation(); // Prevent triggering document click

    //Block opening search if accessibility menu is open
    if ($("#gu_accessibility-menu").hasClass("show")) {
      return;
    }

    // If already open, don't toggle — let outside click close it
    if ($(".gu-header_search-container").hasClass("search-visible")) {
      return;
    }

    $(".gu-header_search-container").addClass("search-visible");

    // Add backdrop if not exists
    if ($(".gu-search-backdrop").length === 0) {
      $("body").append('<div class="gu-search-backdrop"></div>');
      if ($(window).width() <= 768) {
        $(".gu-toolbar_wrapper .sticky-middle.mobile").css("z-index", "11");
        $(".accessibility").css("z-index", "-1");
        $(".gu-header__humberger").css("z-index", "-1");
      }
    }
  });

  // Remove backdrop and close search when clicking outside
  $(document).on("click", function (event) {
    if (
      !$(event.target).closest(
        ".gu-header_search-container, .gu-search__toggle"
      ).length
    ) {
      $(".gu-header_search-container").removeClass("search-visible");
      $(".gu-search-backdrop").remove();
      if ($(window).width() <= 768) {
        $(".gu-toolbar_wrapper .sticky-middle.mobile").css("z-index", "");
        $(".accessibility").css("z-index", "");
        $(".gu-header__humberger").css("z-index", "");
      }
    }
  });
});
