window.addEventListener("DOMContentLoaded", function() {
  const toggleButton = document.getElementById("highlight-links-btn");

  // Function to toggle highlight on links
  function toggleHighlight() {
     document.body.classList.toggle("accessibility-highlight");
  }

  // Event listener for the button
  toggleButton.addEventListener("click", toggleHighlight);
});