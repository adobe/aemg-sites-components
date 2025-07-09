$(document).ready(function () {
    // Move the mobile toolbar to the toolbar container
    const $toolbarHeaderContainer = $(".toolbar-header-container");
    const $toolbarHeaderMobile = $(".toolbar.below-title.mobile");
    if ($toolbarHeaderMobile.length && $toolbarHeaderContainer.length) {
        $toolbarHeaderContainer.append($toolbarHeaderMobile);
    }
});
