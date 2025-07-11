$(document).ready(function () {
  $(".menu-tigger").on("click", function () {
    $(this).toggleClass("button-tigger");
    $(".hamburger-dropdown").toggleClass("res-menu");
  });
});


