$(document).ready(function () {
    function adjustColumnMargins() {
        var $topic    = $('.home-banner');
        var $left     = $('.col-3grid--left');
        var $prevNext = $('.prev-next-topic');
        var $cols     = $('.col-3grid--left, .col-3grid--right');

        // only proceed if all elements exist
        if (!$topic.length || !$left.length || !$prevNext.length) {
            return;
        }

        var topicHeight = $topic.outerHeight();
        var leftHeight  = $left.outerHeight();

        // if topic content is taller than left column
        if (topicHeight > leftHeight) {
            var extraSpace = $prevNext.outerHeight();
            // set margin-bottom on both left and right columns
            $cols.css('margin-bottom', extraSpace + 'px');
        }
    }

    // run on initial load
    adjustColumnMargins();

    // re-run on window resize
    $(window).on('resize', adjustColumnMargins);
});
