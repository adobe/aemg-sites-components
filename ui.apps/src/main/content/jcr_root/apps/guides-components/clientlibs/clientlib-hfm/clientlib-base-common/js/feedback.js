$(document).ready(function() {

    if (!window.dataLayer) {
        console.warn('Google Tag Manager dataLayer not found!');
        window.dataLayer = []; // Initialize if not already defined
    }

    const likeButton = $('.gu-likeButton');
    const dislikeButton = $('.gu-dislikeButton');
    const pageID = window.location.pathname;
    let storedReaction = localStorage.getItem(`reaction_${pageID}`);
    updateUI(storedReaction);

    $('.gu-likeButton, .gu-likeButton .gu-feedback__like-icon, .gu-likeButton .gu-feedback__button-text').on('click', function(event) {
        if(!window.dataLayer) {window.dataLayer = [];}
        window.dataLayer.push({
            event: 'feedback_click',
            feedback_type: 'like',
            page_id: window.location.pathname,
        });
        sendEventToAdobeAnalytics();
        localStorage.setItem(`reaction_${pageID}`, "liked");
        updateUI("liked");
    });

    $('.gu-dislikeButton, .gu-dislikeButton .gu-feedback__dislike-icon, .gu-dislikeButton .gu-feedback__button-text').on('click', function(event) {
        if(!window.dataLayer) {window.dataLayer = [];}
        window.dataLayer.push({
            event: 'feedback_click',
            feedback_type: 'dislike',
            page_id: window.location.pathname,
        });
        sendEventToAdobeAnalytics();
        localStorage.setItem(`reaction_${pageID}`, "disliked");
        updateUI("disliked");
    });


    function sendEventToAdobeAnalytics() {
        if (window._satellite) {
            window._satellite.track('feedbackButtonClicked');
        }
    }

    function updateUI(reaction) {
        if (reaction === "liked") {
            likeButton.toggleClass('selected');
            likeButton.attr("disabled","true");
            dislikeButton.removeClass('selected');
            dislikeButton.attr("disabled","true");
        } else if (reaction === "disliked") {
            likeButton.removeClass('selected');
            likeButton.attr("disabled","true");
            dislikeButton.toggleClass('selected');
            dislikeButton.attr("disabled","true");
        } else {
            likeButton.removeClass('selected');
            likeButton.attr("disabled","true");
            dislikeButton.removeClass('selected');
            dislikeButton.attr("disabled","true");
        }
    }

});