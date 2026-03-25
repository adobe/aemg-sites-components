/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

// Wrap bindings in anonymous namespace to prevent collisions
jQuery(function ($) {
    "use strict";

    var $popover = null;

    function getPopover() {
        if (!$popover) {
            $popover = $('<div>', {
                id: 'cite-popover',
                css: {
                    display: 'none',
                    position: 'absolute',
                    zIndex: 10000,
                    background: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    maxWidth: '480px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    fontSize: '14px',
                    lineHeight: '1.5'
                }
            });
            $('body').append($popover);
        }
        return $popover;
    }

    function showPopover(evt, $span) {
        var bib = $span.attr('data-citation-bib');
        if (!bib) {
            return;
        }

        var $p = getPopover();
        $p.html(bib).show();

        var sx = window.pageXOffset || document.documentElement.scrollLeft;
        var sy = window.pageYOffset || document.documentElement.scrollTop;
        $p.css({ left: evt.clientX + sx, top: evt.clientY + sy + 20 });

        var rect = $p[0].getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            $p.css('left', Math.max(0, window.innerWidth - rect.width - 10));
        }
        if (rect.bottom > window.innerHeight + sy) {
            $p.css('top', evt.clientY + sy - rect.height - 10);
        }
    }

    $(document).on('mouseenter', '[data-citation-bib]', function (evt) {
        showPopover(evt, $(this));
    });

    $(document).on('mouseleave', '[data-citation-bib]', function () {
        getPopover().hide();
    });

    $(document).on('click', '[data-citation-bib]', function () {
        var citationId = $(this).attr('data-citation-id');
        // Write your code here to handle the click event.
        console.log(citationId);
    });
});
