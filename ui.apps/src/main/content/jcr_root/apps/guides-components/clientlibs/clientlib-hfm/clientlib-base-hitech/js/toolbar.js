$(document).ready(function () {
    let colGrid = $(".col-9grid-container");
    let toolbarComponent = $(".gu-toolbar_wrapper");
    let copyLinkComponent = $(".toolbar.desktop .copy-link-component");
    let title = $(".topic__container h1");

    if(colGrid && toolbarComponent) {
        colGrid.append(toolbarComponent);
    }
    if (copyLinkComponent.length && title.length) {
        copyLinkComponent.insertAfter(title);
    }
});
