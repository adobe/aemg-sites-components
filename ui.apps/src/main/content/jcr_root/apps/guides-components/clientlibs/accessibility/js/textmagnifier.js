// Call the function to create the magnifier when the page loads
const magnifier = document.getElementById("magnifier");
const magnifiedText = document.getElementById("magnifiedText");
const toggleButton = document.getElementById("text-magnifier");

let isMagnifierActive = false; // Track whether the magnifier is active or not

let currentElement = null; // To keep track of the currently hovered element


// Function to update magnifier content and position
function updateMagnifier(e, textContent) {
    const magnifierSize = 100; // Size of the magnifier

    const cursorX = e.pageX;
    const cursorY = e.pageY;

    magnifiedText.textContent = textContent; // Set the content of the magnifier
    magnifier.style.left = `${cursorX - magnifierSize / 2}px`;
    magnifier.style.top = `${cursorY - magnifierSize / 2}px`;

    // Show the magnifier
    magnifier.style.display = "block";

    // Adjust the magnifier scale
    magnifier.style.transform = "scale(2)"; // Adjust the zoom level as needed
}

// Toggle the magnifier effect when the button is clicked
toggleButton.addEventListener("click", () => {
    isMagnifierActive = !isMagnifierActive; // Toggle the state

    // Show or hide the magnifier based on the toggle state
    if (!isMagnifierActive) {
        magnifier.style.display = "none"; // Hide the magnifier when deactivated
    } else {
        magnifier.style.display = "none"; // Start hidden, will be activated when mousemove
    }
});

// Event listener for mousemove on the whole document
document.addEventListener("mousemove", (e) => {
    if (isMagnifierActive) {
        const target = e.target;

        // Ensure that the target is a text element or contains text
        if (target && target.innerText && target !== currentElement) {
            // Avoid updating if the same element is hovered
            currentElement = target;
            updateMagnifier(e, target.innerText);
        }
    }
});

// Hide the magnifier when mouse leaves the page or any element
document.addEventListener("mouseleave", () => {
    magnifier.style.display = "none";
    currentElement = null; // Reset the current element
});

// Close the magnifier when the Escape key is pressed
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
      isMagnifierActive = false;  // Set the magnifier to inactive
      magnifier.style.display = "none"; // Hide the magnifier
  }
});

// Dynamically create the magnifier div and span element
function createMagnifier() {
  // Create the magnifier container div
  const magnifierDiv = document.createElement("div");
  magnifierDiv.classList.add("magnifier");
  magnifierDiv.id = "magnifier";

  // Create the span element to hold magnified text
  const magnifiedTextSpan = document.createElement("span");
  magnifiedTextSpan.id = "magnifiedText";
  
  // Append the span to the magnifier div
  magnifierDiv.appendChild(magnifiedTextSpan);

  // Append the magnifier div to the body
  document.body.appendChild(magnifierDiv);
}
