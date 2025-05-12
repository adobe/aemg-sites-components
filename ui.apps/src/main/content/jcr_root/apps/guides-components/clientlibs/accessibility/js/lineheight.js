window.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("line-height-btn");

  function toggleLineHeight() {
    document.body.classList.toggle("accessibility-line-height");    
  }

  // Event listener for the button
  toggleButton.addEventListener("click", toggleLineHeight);
});
