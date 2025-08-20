document.addEventListener("DOMContentLoaded", () => {
  //const $toolbar = $('.toolbar-hitech .desktop');

  $(".gu-pdf_topic-download").on("click", function (event) {
    let topicTitle = $("#section-topic .topic h1.title").text();
    if (topicTitle) {
      topicTitle =
        topicTitle.trim().toLowerCase().replaceAll(" ", "-") + ".pdf";
    }
    CreatePDFfromHTML("#section-topic", topicTitle);
  });

  const getActiveToolbar = () =>
    document.querySelector(".toolbar:not(.hidden) .gu-pdf-export__wrapper");

  const isMobileView = () => window.matchMedia("(max-width: 1023px)").matches;

  // Create backdrop element
  let backdrop = document.createElement("div");
  if (backdrop) {
    backdrop.className = "backdrop hidden";
    document.body.appendChild(backdrop);

    // Ensure initial state is hidden
    backdrop.style.display = "none";
  }
  // Toggle PDF Export Dropdown
  document.addEventListener("click", (event) => {
    const activeToolbar = getActiveToolbar();
    if (!activeToolbar) return;
    const button = activeToolbar.querySelector(".gu-pdf-export__button");

    if (button && button.contains(event.target)) {
      event.stopPropagation(); // Prevent immediate closing due to document click listener
      const isActive = activeToolbar.classList.toggle("active");
      // $toolbar.css('position', 'static');

      setMenu();

      //if (isMobileView()) {
      backdrop.style.display = isActive ? "block" : "none";
      if (backdrop) {
        backdrop.style.display = isActive ? "block" : "none";
      }
      // }
    } else {
      activeToolbar.classList.remove("active"); // Hide dropdown if clicking outside
      if (backdrop) {
        backdrop.style.display = "none"; // Hide backdrop when clicking outside
      }
      // $toolbar.css('position', 'sticky');
    }
  });

  // Hide dropdown on resize
  window.addEventListener("resize", () => {
    Array.from(document.querySelectorAll(".gu-pdf-export__wrapper")).forEach(
      (wrapper) => wrapper.classList.remove("active")
    );
    if (backdrop) {
      backdrop.style.display = "none";
    }
  });
  // Close dropdown and remove backdrop when backdrop is clicked
  if (backdrop) {
    backdrop.addEventListener("click", () => {
      Array.from(document.querySelectorAll(".gu-pdf-export__wrapper")).forEach(
        (wrapper) => wrapper.classList.remove("active")
      );
      backdrop.style.display = "none";
    });
  }
});

//Create PDf from HTML...
function CreatePDFfromHTML(selector, pdfFileName) {
  if (!selector || !pdfFileName) {
    return;
  }

  let html_source_element = document.querySelector(selector);
  if (!html_source_element) {
    return;
  }

  if (typeof html2pdf !== "function") {
    console.error("html2pdf library is missing.");
    return;
  }

  // Scroll to the top before capturing to avoid empty spaces
  window.scrollTo(0, 0);

  // Ensure the content is fully rendered
  setTimeout(() => {
    var options = {
      margin: 0.5,
      filename: pdfFileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        optimizeClipping: true,
      },
      pagebreak: { mode: ["css", "legacy"] },
      jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
    };

    html2pdf().set(options).from(html_source_element).save();
  }, 500); // Small delay to ensure all elements are loaded
}

function setMenu() {
  $(".toolbar-hitech .desktop").css("z-index", "14");

  $(".toolsection .share-icon").css("pointer-events", "none");
  $(".toolsection #gu_theme-icon").css("pointer-events", "none");
  $(".toolsection .gu-pdf-export__button").css("pointer-events", "none");
  $(".toolsection .language-selector__toggle").css("pointer-events", "none");
  $(".toolsection #gu_accessibility-icon").css("pointer-events", "none");

  $(".feedback-component").hide();

  $(".backToTop").hide();

  $(".toolsection .version-selector .dropdown").attr("style", "");
  $(".toolsection .version-selector .dropdown").css({
    "border-width": "0px",
    "pointer-events": "none",
  });
  
  //fsi
  $(".fsi-guides-topic-page .header").attr("style", "");
  $(".fsi-guides-topic-page .header").css({
    "background-color": "rgba(255, 255, 255, 0.1)",
    "backdrop-filter": "blur(100px)",
    "border-bottom": "unset",
  });

  $(".gu-search__container").css("pointer-events", "none");
  $(".gu-header_nav-link").css("pointer-events", "none");
  $(".gu-header_logo").css("pointer-events", "none");
}

function resetMenu() {
  $(".toolbar-hitech .desktop").css("z-index", "unset");

  $(".toolsection .share-icon").css("pointer-events", "unset");
  $(".toolsection #gu_theme-icon").css("pointer-events", "unset");
  $(".toolsection .gu-pdf-export__button").css("pointer-events", "unset");
  $(".toolsection .language-selector__toggle").css("pointer-events", "unset");
  $(".toolsection #gu_accessibility-icon").css("pointer-events", "unset");

  $(".feedback-component").show();

  $(".backToTop").show();

  $(".toolsection .version-selector .dropdown").css({
    "border-width": "1px",
    "pointer-events": "unset",
  });

  //fsi
  $(".fsi-guides-topic-page .header").css({
    "background-color": "var(--white-color)",
    "backdrop-filter": "unset",
    "border-bottom": "1px solid #e2e2e2",
  });

  $(".gu-search__container").css("pointer-events", "unset");
  $(".gu-header_nav-link").css("pointer-events", "unset");
  $(".gu-header_logo").css("pointer-events", "unset");
}
