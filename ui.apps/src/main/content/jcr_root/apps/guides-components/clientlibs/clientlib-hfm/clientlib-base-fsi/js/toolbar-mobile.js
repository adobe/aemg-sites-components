$(document).ready(function () {
    // Move the mobile toolbar to the toolbar container
    const $toolbarHeaderContainer = $(".toolbar-container");
    const $toolbarHeaderMobile = $(".toolbar.below-updated.mobile");
    if ($toolbarHeaderMobile.length && $toolbarHeaderContainer.length) {
        $toolbarHeaderContainer.append($toolbarHeaderMobile);
    }
});
