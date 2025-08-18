$(document).ready(function () {
  $(".gu-search__toggle").click(function (e) {
    e.stopPropagation();
    $(".gu-header_search-container").toggleClass("search-visible");

    if ($(window).width() < 768) {
      if ($(".gu-header_search-container").hasClass("search-visible")) {
        $("body").append('<div class="gu-search-backdrop"></div>');
      } else {
        $(".gu-search-backdrop").remove();
      }
    }
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".gu-header_search-container, .gu-search__toggle").length) {
      $(".gu-header_search-container").removeClass("search-visible");
      $(".gu-search-backdrop").remove();
    }
  });
});
