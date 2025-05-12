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

    if(e.target == accessibilityIcon || e.target == closeBtn) {
      document.querySelector(".overlay-main").classList.toggle("overlay");
      return;
    }

    accessibilityMenu.classList.add("hidden");
    document.querySelector(".overlay-main").classList.remove("overlay");
  });

  //Onclick functionality for
 /*  document.querySelectorAll(".menu-option-container").forEach((singleBtn) => {
    singleBtn.addEventListener("click", () => {
      // console.log(singleBtn, "singlebutton");
      if (
        singleBtn.querySelector(".accordion-header")?.textContent ===
        "Appearance"
      ) {
        const pageInfoMain = document.querySelector(".main-body-container");

        // console.log("yes");
        if (pageInfoMain.classList.contains("overlay")) {
          pageInfoMain.classList.remove("overlay");
        }
      } else {
        accessibilityMenu.classList.add("hidden");
        document.querySelector(".overlay-main").classList.remove("overlay");
        // console.log("no");
      }
    });
  }); */

  // PDF Generation
  document.getElementById("generate-pdf-btn").addEventListener("click", () => {
    // Clone the content to avoid modifying the original HTML

    document.querySelector(".main-body-container").classList.remove("overlay");
    const contentClone = document
      .getElementById("content-to-pdf")
      .cloneNode(true);

    // Remove the elements you want to exclude from the PDF
    const accessibilityIcon = contentClone.querySelector("#accessibility-icon");
    const accessibilityMenu = contentClone.querySelector("#accessibility-menu");

    const tinyUrlModal = contentClone.querySelector("#main-short-url-div");
    const pageInfoModal = contentClone.querySelector("#page-info");

    if (accessibilityIcon) {
      accessibilityIcon.remove();
    }
    if (accessibilityMenu) {
      accessibilityMenu.remove();
    }

    if (tinyUrlModal) {
      tinyUrlModal.remove();
    }
    if (pageInfoModal) {
      pageInfoModal.remove();
    }

    // Convert the cloned content to a string
    const htmlContent = contentClone.innerHTML; // Use innerHTML instead of outerHTML
    const cssContent = `
   * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.container-wrapper {
  padding: 0px 40px;
}

.main-body {
  position: relative;
}

/*--------------------------------------Header CSS---------------------------------------------*/

.header-main-container {
  background-color: #37474f;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-main-container .logo a {
  font-size: 1.8em;
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.logo {
  margin: 10px 0px;
}

.search-bar input {
  padding: 5px;
  font-size: 1em;
}

/*--------------------------------------Main Body CSS---------------------------------------------*/

.main-container {
  display: flex;
  margin: 20px auto;
}

.sidebar {
  flex: 1;
  max-width: 200px;
  margin-right: 20px;
  border-right: 1px solid rgb(197, 187, 187);
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.nav-list li {
  margin: 10px 0;
}

.nav-list li a {
  text-decoration: none;
  color: #333;
  font-size: 1em;
}

.nav-list li a:hover {
  color: #007bff;
}

/*--------------------------------------Article Container CSS---------------------------------------------*/

.article-content {
  flex: 3;
}

/* Content container for the two main sections */
.article-content-container {
  display: flex;
  gap: 20px; /* Space between the two columns */
  justify-content: space-between;
}

.article-content-container > div {
  flex: 1; /* Makes both divs have equal width */
}

.article-img-text {
  display: flex;
  gap: 15px;
}

.article-img-text img {
  max-width: 150px;
  height: auto;
}

.article-section h1,
.article-section h2 {
  margin: 20px 0;
}

.article-section p {
  margin-bottom: 15px;
  font-size: 1.2em;
}

/* Featured Article and News Styles */
.featured-article,
.news-section {
  /* background-color: white; */
  padding: 15px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
}

.featured-article h2,
.news-section h2 {
  font-size: 1.5em;
  margin-bottom: 15px;
}

.featured-content {
  display: flex;
}

.featured-content img {
  max-width: 150px;
  margin-right: 15px;
  height: 100%;
}

@media (max-width: 1120px) {
  .featured-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.featured-text p {
  font-size: 0.9em;
  color: #333;
}

.featured-text a {
  color: #3366cc;
  text-decoration: none;
}

.featured-text a:hover {
  text-decoration: underline;
}

.news-section ul {
  list-style-type: none;
}

.news-section ul li {
  font-size: 0.9em;
  margin-bottom: 10px;
}

.news-section ul li strong {
  color: #3366cc;
}

/*-------------------------------------------- Footer CSS -------------------------------------------*/
.footer-section {
  margin-top: 40px;
}

footer {
  background-color: #37474f;
  color: white;
  text-align: center;
  padding: 10px 0;
}

footer p {
  font-size: 0.9em;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  .sidebar {
    max-width: 100%;
    margin-bottom: 20px;
  }

  .nav-list {
    flex-direction: row;
    justify-content: center;
  }

  .nav-list li {
    margin: 5px;
  }

  .article-content-container {
    flex-direction: column; /* Stack the columns vertically */
  }

  .article-img-text {
    flex-direction: column;
  }
}

/* Accessibility Icon */
.accessibility-icon {
  position: fixed; /* Changed from absolute to fixed */
  bottom: 20px; /* Added a distance from the bottom */
  right: 20px; /* Added a distance from the right */
  width: 50px;
  cursor: pointer;
  z-index: 1;
}

/* Accessibility Menu Container */
.accessibility-menu {
  position: fixed;
  top: 100px;
  right: 20px;
  /* width: 300px; */
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 3;
  display: flex;
  flex-direction: column;
}

/* Menu Header */
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background-color: #37474f;
  padding: 12px 40px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.menu-header h3 {
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
}

.reset-btn {
  background-color: grey;
  color: white;
  border: none;
  margin: 2px 16px;
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 5px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
}

/* Menu Content */
.menu-content {
  max-height: 500px; /* Set this to your preferred maximum height */
  overflow-y: auto;
  padding: 15px;
  box-sizing: border-box;
  scrollbar-width: none;
}

.menu-content-wrapper {
  padding: 10px 25px;
}

.menu-option-container {
  border: 1px solid grey;
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
}

.menu-option-container h4 {
  margin-left: 12px;
}

.menu-content h4 {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #333;
}

.menu-options {
  display: flex;
  flex-direction: column;
}

/* Menu Button */
.menu-button {
  display: flex;
  align-items: center;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.menu-button .icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.menu-button.active {
  background-color: #007bff;
  color: white;
}

.menu-button:hover {
  background-color: #e6e6e6;
}

/* Range Input */
#font-size-range {
  width: 100%;
  margin: 10px 0;
}

/* Additional Option Styles */
.option {
  margin-bottom: 15px;
}

.option label {
  margin-right: 10px;
  font-weight: bold;
}

.accordion-container {
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.accordion-header {
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  cursor: pointer;
  text-align: center;
}

.accordion-content {
  display: none;
  padding: 15px;
  background-color: #fff;
}

.option-group {
  margin-bottom: 15px;
}

.option-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.radio-option {
  margin-right: 10px;
}

/*-------------------------------------------------------*/

.overlay {
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}

.hidden {
  display: none;
}

        `;

    const styledHtmlContent = `
        <html>
          <head>
            <style>${cssContent}</style>
          </head>
          <body>${htmlContent}</body>
        </html>`;

    fetch("http://localhost:8080/download-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ styledHtmlContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.filePath) {
          const fileName = data.filePath.split("/").pop();
          const downloadUrl = `http://localhost:8080/download-pdf/${fileName}`;

          // Trigger download
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else {
          alert("Failed to generate PDF.");
        }
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        alert("Error: Failed to generate PDF.");
      });
  });

  // QR Code Generation
  // document.getElementById("generate-qr-btn").addEventListener("click", () => {
  //   const urlToEncode = "http://127.0.0.1:5501/main.html#";

  //   document.querySelector(".main-body-container").classList.remove("overlay");
  //   fetch("http://localhost:8080/download-qr", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ url: urlToEncode }),
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         return response.blob();
  //       } else {
  //         throw new Error("Failed to generate QR code.");
  //       }
  //     })
  //     .then((blob) => {
  //       const downloadUrl = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = downloadUrl;
  //       a.download = "qr_code.svg";
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //     })
  //     .catch((error) => {
  //       console.error("Error generating QR code:", error);
  //       alert("Error: Failed to generate QR code.");
  //     });
  // });

  // URL Shortening
  const shortUrlModal = document.getElementById("short-url-modal");
  const shortUrlInput = document.getElementById("shortened-url-input");
  const copyUrlBtn = document.getElementById("copy-url-btn");
  const closeModalBtn = document.getElementById("close-modal-btn");

  window.addEventListener("load", () => {
    shortUrlModal.classList.add("hidden");
  });

  // Page Information
  document.getElementById("fetch-info-btn").onclick = async function () {
    // Clone the content to avoid modifying the original HTML
    const contentClone = document
      .getElementById("content-to-pdf")
      .cloneNode(true);

    // Remove the elements you want to exclude from the content sent to the server
    const accessibilityIcon = contentClone.querySelector("#accessibility-icon");
    const accessibilityMenu = contentClone.querySelector("#accessibility-menu");

    if (accessibilityIcon) {
      accessibilityIcon.remove();
    }
    if (accessibilityMenu) {
      accessibilityMenu.remove();
    }

    // Convert the cloned content to a string
    const modifiedHtmlContent = contentClone.innerHTML;

    try {
      // Send the modified HTML content to the API
      const response = await fetch("http://localhost:8080/extract-page-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ htmlContent: modifiedHtmlContent }), // Send the modified HTML as JSON
      });

      // Handle the API response
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);

        const pageInfoParent = document.getElementById("page-info");
        // // Make sure page information modal is visible, then set value
        pageInfoParent.classList.remove("hidden-page-info");

        const pageInfoMain = document.querySelector(".overlay-main");

        if (pageInfoMain.classList.contains("overlay")) {
          pageInfoMain.classList.remove("overlay");
        } else {
          pageInfoMain.classList.add("overlay");
        }

        // Display the extracted information in the table
        document.getElementById("display-title").textContent =
          data.displayTitle;
        document.getElementById("page-length").textContent = data.pageLength;
        document.getElementById("content-language").textContent =
          data.contentLanguage;
        document.getElementById("redirects").textContent = data.redirects;
        document.getElementById("wikidata-id").textContent =
          data.wikidataItemId;

        // Add new values to the table
        document.getElementById("meta-description").textContent =
          data.metaDescription;
        document.getElementById("meta-keywords").textContent =
          data.metaKeywords;

        // Populate links
        if (data.links && data.links.length > 0) {
          const linksHtml = data.links
            .map((link) => `<a href="${link.href}">${link.text}</a>`)
            .join(", ");
          document.getElementById("links").innerHTML = linksHtml;
        } else {
          document.getElementById("links").textContent = "No links found";
        }

        // Populate images
        if (data.images && data.images.length > 0) {
          const imagesHtml = data.images
            .map(
              (img) =>
                `<img src="${img.src}" alt="${img.alt}" style="max-width: 100px;" />`
            )
            .join(" ");
          document.getElementById("images").innerHTML = imagesHtml;
        } else {
          document.getElementById("images").textContent = "No images found";
        }

        // Populate scripts
        if (data.scripts && data.scripts.length > 0) {
          const scriptsHtml = data.scripts.join(", ");
          document.getElementById("scripts").textContent = scriptsHtml;
        } else {
          document.getElementById("scripts").textContent = "No scripts found";
        }

        // Display word count
        document.getElementById("word-count").textContent = data.wordCount;

        // Show the information table
        // document.getElementById("page-info").style.display = "block";
      } else {
        console.error("Failed to send HTML content:", response.statusText);
        alert("Error: Could not send page information.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending page information.");
    }
  };

  const pageInfoParent = document.getElementById("page-info");
  // // Make sure page information modal is visible, then set value
  if (!pageInfoParent.classList.contains("hidden-page-info")) {
    window.addEventListener("click", (event) => {
      const container = document.getElementById("page-info");
      // Check if the click happened outside the container
      if (!container.contains(event.target)) {
        if (pageInfoMain.classList.contains("overlay")) {
          pageInfoMain.classList.add("overlay");
        }
      }
    });
  }

  document.getElementById("close-page-info-btn").onclick = () => {
    console.log("here");
    document.querySelector(".overlay-main").classList.remove("overlay");
    document.getElementById("page-info").classList.add("hidden-page-info"); // Hide modal
  };

  //Print As
  document.getElementById("print-btn").addEventListener("click", () => {
    // Apply temporary styles for printing
    document.querySelector(".overlay-main").classList.add("print-mode"); // Ensure print-specific styles are applied
    document
      .getElementById("accessibility-icon")
      .classList.add("hidden-page-info"); // Hide accessibility icon for printing
    document
      .getElementById("accessibility-menu")
      .classList.add("hidden-page-info"); // Hide accessibility menu for printing

    // Add custom print styles directly in the head if required (optional)
    const printStyle = document.createElement("style");
    printStyle.innerHTML = `
      @media print {
        body {
          font-size: 12px; /* Adjust font size for print */
          background-color: #fff; /* Ensure background is white for print */
        }
        .overlay-main {
          display: block;
          background: #fff; /* Print background */
        }
        .hidden-page-info {
          display: none !important; /* Hide elements like accessibility menu and icon for print */
        }

        .featured-article{
        text-align: center;
        }
        
        .featured-content{
            display : flex;
            justify-content: center;
            align-items: center;
        }

        .article-img-text{
            display : flex;
            justify-content: center;
            align-items: center;
        }
      }
    `;
    document.head.appendChild(printStyle);

    // Trigger the print dialog
    window.print();

    document
    .getElementById("accessibility-icon")
    .classList.remove("hidden-page-info");

    // Use afterprint event to revert styles after printing
    window.addEventListener(
      "afterprint",
      () => {
        // Remove print-specific styles
        document
          .getElementById("accessibility-menu")
          .classList.remove("hidden-page-info");
        document.querySelector(".overlay-main").classList.remove("print-mode");

        // Clean up the print styles added dynamically
        document.head.removeChild(printStyle);
      },
      { once: true } // Ensures this event listener is used only once
    );
  });

  document.getElementById("text-magnifier").addEventListener("click", () => {
    document.querySelector(".main-body-container").classList.remove("overlay");
  });

  //Text Magnifier
  //   const textMagnifier = document.getElementById("text-magnifier");
  //   const magnifier = document.getElementById("magnifier");

  //   // Function to activate the magnifier functionality
  //   function activateMagnifier() {
  //     const paragraphs = document.querySelectorAll("p");
  //     paragraphs.forEach((paragraph) => {
  //       // Add event listeners to each paragraph
  //       paragraph.addEventListener("mousemove", handleMagnifier);
  //       paragraph.addEventListener("mouseleave", hideMagnifier);
  //     });
  //   }

  //   // Function to deactivate the magnifier functionality
  //   function deactivateMagnifier() {
  //     const paragraphs = document.querySelectorAll("p");
  //     paragraphs.forEach((paragraph) => {
  //       // Remove event listeners from each paragraph
  //       paragraph.removeEventListener("mousemove", handleMagnifier);
  //       paragraph.removeEventListener("mouseleave", hideMagnifier);
  //     });
  //     // Hide the magnifier
  //     magnifier.style.display = "none";
  //   }

  //   // Event handler for magnification on mouse move
  //   function handleMagnifier(event) {
  //     const rect = event.target.getBoundingClientRect();
  //     const x = event.clientX - rect.left;
  //     const y = event.clientY - rect.top;

  //     magnifier.style.display = "block";

  //     const magnifierWidth = magnifier.offsetWidth;
  //     const magnifierHeight = magnifier.offsetHeight;

  //     let leftPosition = event.pageX + 20;
  //     if (leftPosition + magnifierWidth > window.innerWidth) {
  //       leftPosition = window.innerWidth - magnifierWidth - 20;
  //     }

  //     let topPosition = event.pageY - 100;
  //     if (topPosition + magnifierHeight > window.innerHeight) {
  //       topPosition = window.innerHeight - magnifierHeight - 30;
  //     }

  //     magnifier.style.left = `${leftPosition}px`;
  //     magnifier.style.top = `${topPosition}px`;
  //     magnifier.innerHTML = `<p>${event.target.textContent}</p>`;

  //     const magnifiedText = magnifier.querySelector("p");
  //     magnifiedText.style.transformOrigin = `${x}px ${y}px`;
  //     magnifiedText.style.transform = `scale(2) translate(-${x / 2}px, -${y / 2}px)`;
  //   }

  //   // Event handler to hide magnifier on mouse leave
  //   function hideMagnifier() {
  //     magnifier.style.display = "none";
  //   }

  //   // Toggle the magnifier functionality
  //   textMagnifier.addEventListener("click", () => {
  //     textMagnifier.classList.toggle("active");

  //     if (textMagnifier.classList.contains("active")) {
  //       console.log("Text Magnifier activated");
  //       activateMagnifier();
  //     } else {
  //       console.log("Text Magnifier deactivated");
  //       deactivateMagnifier();
  //     }
  //   });

  //text-mag

  // const textMagnifier = document.getElementById("text-magnifier");
  // const magnifier = document.getElementById("magnifier");

  // function activateMagnifier() {
  //   const paragraphs = document.querySelectorAll("p");
  //   paragraphs.forEach((paragraph) => {
  //     paragraph.addEventListener("mousemove", handleMagnifier);
  //     paragraph.addEventListener("mouseleave", hideMagnifier);
  //   });
  // }

  // function deactivateMagnifier() {
  //   const paragraphs = document.querySelectorAll("p");
  //   paragraphs.forEach((paragraph) => {
  //     paragraph.removeEventListener("mousemove", handleMagnifier);
  //     paragraph.removeEventListener("mouseleave", hideMagnifier);
  //   });
  //   magnifier.style.display = "none";
  // }

  // function handleMagnifier(event) {
  //   const rect = event.target.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;

  //   magnifier.style.display = "block";

  //   const magnifierWidth = magnifier.offsetWidth;
  //   const magnifierHeight = magnifier.offsetHeight;

  //   let leftPosition = event.pageX + 20;
  //   if (leftPosition + magnifierWidth > window.innerWidth) {
  //     leftPosition = window.innerWidth - magnifierWidth - 20;
  //   }

  //   let topPosition = event.pageY - 140;
  //   if (topPosition + magnifierHeight > window.innerHeight) {
  //     topPosition = window.innerHeight - magnifierHeight - 30;
  //   }

  //   magnifier.style.left = `${leftPosition}px`;
  //   magnifier.style.top = `${topPosition}px`;

  //   // Set multiline content in the magnifier
  //   magnifier.innerHTML = `<p>${event.target.textContent}</p>`;
  //   const magnifiedText = magnifier.querySelector("p");
  //   magnifiedText.style.fontSize = "1.5em"; // Increase font size for magnification effect
  // }

  // function hideMagnifier() {
  //   magnifier.style.display = "none";
  // }

  // textMagnifier.addEventListener("click", () => {
  //   textMagnifier.classList.toggle("active");

  //   if (textMagnifier.classList.contains("active")) {
  //     console.log("Text Magnifier activated");
  //     activateMagnifier();
  //   } else {
  //     console.log("Text Magnifier deactivated");
  //     deactivateMagnifier();
  //   }
  // });

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

  // Handle text size change
  document.querySelectorAll('input[name="textSize"]').forEach((radio) => {
    radio.addEventListener("change", (event) => {
      const value = event.target.value;
      const pageContent = document.querySelector("main");

      if (value === "small") {
        pageContent.style.fontSize = "14px";
      } else if (value === "standard") {
        pageContent.style.fontSize = "16px";
      } else if (value === "large") {
        pageContent.style.fontSize = "20px";
      }
    });
  });

  // Handle page width change
  //   document.querySelectorAll('input[name="width"]').forEach((radio) => {
  //     radio.addEventListener("change", (event) => {
  //       const value = event.target.value;
  //       const pageContent = document.querySelector("main");

  //       // Remove previous width classes
  //       pageContent.classList.remove("standard-width", "wide-width");

  //       if (value === "standard") {
  //         pageContent.classList.add("standard-width");
  //       } else if (value === "wide") {
  //         pageContent.classList.add("wide-width");
  //       }
  //     });
  //   });

  // Handle color theme change
  document.querySelectorAll('input[name="color-theme"]').forEach((radio) => {
    radio.addEventListener("change", (event) => {
      const value = event.target.value;
      const body = document.body;

      // Select elements with the "apperance-opt" class
      const apperanceThemes = document.querySelectorAll(".apperance-opt");

      // Remove previous theme classes from all appearance theme elements
      apperanceThemes.forEach((element) => {
        element.classList.remove("theme-light-text", "theme-dark-text");
      });

      // Remove previous theme classes from body
      body.classList.remove("theme-light", "theme-dark");

      if (value === "light") {
        body.classList.add("theme-light");
        apperanceThemes.forEach((element) => {
          element.classList.add("theme-light-text");
        });
      } else if (value === "dark") {
        body.classList.add("theme-dark");
        apperanceThemes.forEach((element) => {
          element.classList.add("theme-dark-text");
        });
      }
    });
  });

  document.body.addEventListener("click", function(e) {

    if(e.target == accessibilityIcon) {
      // accessibilityMenu.classList.toggle("hidden");
      return;
    }

    if(!e.target.closest(".accessibility") || e.target == closeBtn) {
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

  if(currentFontSize == 22) {
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


decreaseFontSize.addEventListener('click',()=>{
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
