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

$(document).ready(function () {
  let twoLineFound = false;

  $('.gu-pre-next-topic_link').each(function () {
    const $link = $(this);
    const lineHeight = parseFloat($link.css('line-height'));
    const lines = Math.round($link.outerHeight() / lineHeight);

    if (lines >= 2) {
      twoLineFound = true;
      return false; 
    }
  });

  if (twoLineFound) {
    $('.gu-pre-topic_container, .gu-next-topic_container')
      .addClass('min-height-added');
  }
});

