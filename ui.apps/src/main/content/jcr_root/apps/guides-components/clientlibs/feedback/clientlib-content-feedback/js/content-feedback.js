document.addEventListener("DOMContentLoaded", function () {

    // Get all like buttons, dislike buttons, and feedback containers
    const likeButtons = document.querySelectorAll(".like-button");
    const dislikeButtons = document.querySelectorAll(".dislike-button");
    const feedbackContainers = document.querySelectorAll(".feedback-container");

    // Function to handle feedback logic for each button and container
    function handleFeedback(likeButton, dislikeButton, feedbackContainer, type) {
        // Highlight selected button
        if (type === "like") {
            likeButton.classList.add("selected");
        } else {
            dislikeButton.classList.add("selected");
        }

        // Disable both buttons
        likeButton.disabled = true;
        dislikeButton.disabled = true;

        // Show confirmation message
        const message = document.createElement("p");
        message.classList.add("feedback-message");
        message.innerText = "Thanks for your feedback!";
        feedbackContainer.appendChild(message);

        setTimeout(() => {
            message.style.opacity = "1";
            message.style.transform = "translateY(0)";
        }, 100);
    }

    // Attach event listeners to each set of buttons and feedback containers
    likeButtons.forEach((likeButton, index) => {
        const dislikeButton = dislikeButtons[index];
        const feedbackContainer = feedbackContainers[index];

        likeButton.addEventListener("click", () => handleFeedback(likeButton, dislikeButton, feedbackContainer, "like"));
        dislikeButton.addEventListener("click", () => handleFeedback(likeButton, dislikeButton, feedbackContainer, "dislike"));
    });
    
});
