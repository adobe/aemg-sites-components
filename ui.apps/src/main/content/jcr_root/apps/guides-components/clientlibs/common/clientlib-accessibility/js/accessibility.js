
!function () {
  document.addEventListener("DOMContentLoaded", () => {
    const accessibilityMenu = document.getElementById("accessibility-menu");
    const accessibilityIcon = document.getElementById("accessibility-icon");
    const closeBtn = document.querySelector(".close-btn");

    // Function to toggle the visibility of the menu
    function toggleMenu() {
      const pageInfoMain = document.querySelector(".overlay-main");

      if (pageInfoMain.classList.contains("overlay")) {
        pageInfoMain.classList.remove("overlay");
      } else {
        pageInfoMain.classList.add("overlay");
      }

      // document.querySelectorAll(".menu-option-container").forEach((singleBtn) => {
      //   singleBtn.addEventListener("click", () => {
      //     // console.log(singleBtn, "singlebutton");
      //     if (
      //       singleBtn.querySelector(".accordion-header")?.textContent ===
      //       "Appearance"
      //     ) {
      //       const pageInfoMain = document.querySelector(".main-body-container");

      //       // console.log("yes");
      //       if (pageInfoMain.classList.contains("overlay")) {
      //         pageInfoMain.classList.remove("overlay");
      //       }
      //     } else {
      //       accessibilityMenu.classList.add("hidden");
      //       // console.log("no");
      //     }
      //   });
      // });

      //   if (pageInfoMain.classList.contains("overlay")) {
      //     pageInfoMain.classList.remove("overlay");
      //   } else {
      //     pageInfoMain.classList.add("overlay");
      //   }
      accessibilityMenu.classList.toggle("hidden");
    }
    // Event listener for clicking the accessibility icon
    accessibilityIcon.addEventListener("click", toggleMenu);

    let overlayOffBtn = document.getElementById("overlay-off");

    overlayOffBtn.addEventListener("click", () => {
      const pageInfoMain = document.querySelector(".overlay-main");
      const pageInfoParent = document.getElementById("page-info");
      // // Make sure page information modal is visible, then set value
      if (pageInfoParent.classList.contains("hidden-page-info")) {
        if (pageInfoMain.classList.contains("overlay")) {
          pageInfoMain.classList.remove("overlay");
          accessibilityMenu.classList.toggle("hidden");
        } else {
          pageInfoMain.classList.add("overlay");
        }
      }
    });

    // Event listener for clicking the close button
    closeBtn.addEventListener("click", () => {

      if (e.target == accessibilityIcon || e.target == closeBtn) {
        document.querySelector(".overlay-main").classList.toggle("overlay");
        return;
      }

      accessibilityMenu.classList.add("hidden");
      document.querySelector(".overlay-main").classList.remove("overlay");
    });

    window.addEventListener("load", () => {
      shortUrlModal.classList.add("hidden");
    });

    document.getElementById("text-magnifier").addEventListener("click", () => {
      document.querySelector(".main-body-container").classList.remove("overlay");
    });

    //Appereance Code
    const accordionHeader = document.querySelector(".accordion-header");
    const accordionContent = document.getElementById("accordionContent");

    accordionHeader.addEventListener("click", () => {
      toggleAccordion(accordionContent);
    });

    function toggleAccordion(content) {
      content.style.display =
        content.style.display === "block" ? "none" : "block";
    }

    document.body.addEventListener("click", function (e) {

      if (e.target == accessibilityIcon) {
        // accessibilityMenu.classList.toggle("hidden");
        return;
      }

      if (!e.target.closest(".accessibility") || e.target == closeBtn) {
        accessibilityMenu.classList.add("hidden");
      }
    });

  });

  let increaseFontSize = document.querySelector('.increase-fs')
  let decreaseFontSize = document.querySelector('.decrease-fs')
  const currentFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
  let defaultFontSize = document.querySelector('.default-fs')
  defaultFontSize.innerHTML = currentFontSize;

  increaseFontSize.addEventListener('click', () => {
    const currentFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);

    if (currentFontSize == 22) {
      return;
    }

    const newFontSize = currentFontSize + 1;
    defaultFontSize.innerHTML = newFontSize;
    document.documentElement.style.fontSize = `${newFontSize}px`;
    const accessibilityElem = document.querySelector('.accessibility-menu');
    accessibilityElem.style.fontSize = 'initial';

    if (newFontSize == 22) {
      // Disable the button by changing the cursor style
      increaseFontSize.style.cursor = 'not-allowed';
    }
  });


  decreaseFontSize.addEventListener('click', () => {
    const currentFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    const newFontSize = currentFontSize - 1;
    defaultFontSize.innerHTML = newFontSize;
    document.documentElement.style.fontSize = `${newFontSize}px`;
    const accessibilityElem = document.querySelector('.accessibility-menu');
    accessibilityElem.style.fontSize = 'initial';

    if (newFontSize < 22) {
      increaseFontSize.style.cursor = 'pointer';
    }
  });

}();

!function () {
  // Get the button element
  const bigCursorBtn = document.getElementById('bigcursor-btn');

  // Add an event listener to the button
  bigCursorBtn.addEventListener('click', function () {
    // Toggle the 'big-cursor-active' class on the <html> element
    document.body.classList.toggle('big-cursor-active');
  });

}();

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("highlight-links-btn");

  // Function to toggle highlight on links
  function toggleHighlight() {
    document.body.classList.toggle("accessibility-highlight");
  }

  // Event listener for the button
  toggleButton.addEventListener("click", toggleHighlight);
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("letter-spacing-btn");

  function toggleTextSpacing() {
    document.body.classList.toggle("accessibility-text-spacing");
  }

  // Event listener for the button
  toggleButton.addEventListener("click", toggleTextSpacing);
})

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("line-height-btn");

  function toggleLineHeight() {
    document.body.classList.toggle("accessibility-line-height");
  }

  // Event listener for the button
  toggleButton.addEventListener("click", toggleLineHeight);
});

document.addEventListener("DOMContentLoaded", function () {
  const resetButton = document.getElementById("accessibility-reset");
  const magnifier = document.getElementById("magnifier");

  resetButton.addEventListener("click", function () {
    document.body.classList.remove("accessibility-highlight",
      "accessibility-text-spacing",
      "accessibility-line-height",
      "big-cursor-active");

    document.documentElement.style.filter = "initial";
    document.querySelector("#saturation-slider").value = 100;
    document.documentElement.style.fontSize = "initial";
    let defaultFontSize = document.querySelector('.default-fs')
    defaultFontSize.textContent = "16";
    magnifier.click();

  });

});

document.addEventListener("DOMContentLoaded", function () {
  const saturationSlider = document.getElementById('saturation-slider');
  saturationSlider.addEventListener('input', function () {
    document.documentElement.style.filter = `saturate(${this.value}%)`;
  });
});

document.addEventListener("DOMContentLoaded", function () {
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

});
