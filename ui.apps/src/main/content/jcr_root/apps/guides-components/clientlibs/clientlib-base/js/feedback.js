$(document).ready(function() {

    if (!window.dataLayer) {
        console.warn('Google Tag Manager dataLayer not found!');
        window.dataLayer = []; // Initialize if not already defined
    }

    const likeButton = document.getElementById('gu-likeButton');
    const dislikeButton = document.getElementById('gu-dislikeButton');
    const pageID = window.location.pathname;
    let storedReaction = localStorage.getItem(`reaction_${pageID}`);
    updateUI(storedReaction);

    if (likeButton) {
        likeButton.addEventListener('click', () => {
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
    }

    if (dislikeButton) {
        dislikeButton.addEventListener('click', () => {
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
    }

    function sendEventToAdobeAnalytics() {
        if (window._satellite) {
            window._satellite.track('feedbackButtonClicked');
        }
    }

    function updateUI(reaction) {
        if (reaction === "liked") {
            if(likeButton) {
                likeButton.classList.toggle('selected');
                likeButton.disabled = true;
            }
            if(dislikeButton) {
                dislikeButton.classList.remove('selected');
                dislikeButton.disabled = false;
            }
        } else if (reaction === "disliked") {
            if(likeButton) {
                likeButton.classList.remove('selected');
                likeButton.disabled = false;
            }
            if(dislikeButton) {
                dislikeButton.classList.toggle('selected');
                dislikeButton.disabled = true;
            }
        } else {
            if(likeButton) {
                likeButton.classList.remove('selected');
                likeButton.disabled = false;
            }
            if(dislikeButton) {
                dislikeButton.classList.remove('selected');
                dislikeButton.disabled = false;
            }
        }
    }

});