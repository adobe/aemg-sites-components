$(document).ready(function () {
    const $themeButton = $("#gu_theme-icon");
    const $body = $("body");

    if($themeButton) {
        if(!$body.hasClass("hi-tech")) {
            $body.addClass("hi-tech");
        }
    }

});
