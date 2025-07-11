$(document).ready(function () {
    let resizeTimer;
    let initialWidth = window.innerWidth;
    let initialHeight = window.innerHeight;

    $(window).on("resize", function () {
        clearTimeout(resizeTimer);

        // Only reload if the width changes significantly (not just height changes due to scrolling)
        if (Math.abs(window.innerWidth - initialWidth) > 20) {
            resizeTimer = setTimeout(() => location.reload(), 1500);
        }
    });
});
