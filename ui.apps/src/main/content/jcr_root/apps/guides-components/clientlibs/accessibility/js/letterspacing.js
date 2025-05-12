window.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("letter-spacing-btn");

  function toggleTextSpacing() {
    document.body.classList.toggle("accessibility-text-spacing");    
  }

  // Event listener for the button
  toggleButton.addEventListener("click", toggleTextSpacing);
})