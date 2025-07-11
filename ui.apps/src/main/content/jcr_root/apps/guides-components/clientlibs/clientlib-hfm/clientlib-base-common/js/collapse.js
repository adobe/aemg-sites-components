$(document).ready(function () {
    $(".cmp-navigation__col-icon").click(function () {
        $(this).closest(".gu-custom-container").toggleClass("left-collapsed");
    });
});