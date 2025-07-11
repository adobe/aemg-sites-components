$(document).ready(function () {
  $(".gu-search__toggle").click(function () {
    $(".gu-header_search-container").toggleClass("search-visible");

    // Check if backdrop exists, if not, add it
    if ($(".gu-search-backdrop").length === 0) {
      $("body").append('<div class="gu-search-backdrop"></div>');
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
    }
  });
});
