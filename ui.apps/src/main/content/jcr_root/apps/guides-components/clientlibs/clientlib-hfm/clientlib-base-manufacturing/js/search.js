$(document).ready(function () {
  $(".gu-search__toggle").click(function () {
    $(".gu-header_search-container").toggleClass("search-visible");

    if ($(window).width() < 768) {
      // Adjust breakpoint as needed

      if ($(".gu-header_search-container").hasClass("search-visible")) {
        $("body").append('<div class="gu-search-backdrop"></div>');
      } else {
        $(".gu-search-backdrop").remove();
      }
    }
  });

  // Remove backdrop when clicking outside

  $(document).on("click", ".gu-search-backdrop", function () {
    $(".gu-header_search-container").removeClass("search-visible");

    $(this).remove();
  });
});
