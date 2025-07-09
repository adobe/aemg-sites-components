$(document).ready(function () {
    // Move the mobile toolbar to the toolbar container
    const $toolbarHeaderContainer = $(".toolbar-scenario-mobile");
    const $toolbarHeaderMobile = $(".toolbar.above-title.mobile");
    if ($toolbarHeaderMobile.length && $toolbarHeaderContainer.length) {
        $toolbarHeaderContainer.append($toolbarHeaderMobile);
    }
});
