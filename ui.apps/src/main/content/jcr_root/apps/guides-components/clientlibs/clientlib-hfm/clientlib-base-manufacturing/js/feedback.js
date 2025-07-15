document.addEventListener("DOMContentLoaded", function () {
    const feedbackBtn = document.querySelector(".gu-feedback__cta");
    const feedbackContainer = document.querySelector(".gu-feedback__container");
    const closeFeedbackBtn = document.querySelector(".gu-feedback__close-btn");

    // Ensure the feedback container starts hidden
    feedbackContainer.style.display = "none";

    // Show feedback popup
    feedbackBtn.addEventListener("click", () => {
        feedbackContainer.style.display = "flex";
    });

    // Hide feedback popup
    closeFeedbackBtn.addEventListener("click", () => {
        feedbackContainer.style.display = "none";
    });
});
