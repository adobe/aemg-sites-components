
document.addEventListener("DOMContentLoaded", function () {
  const bookmarkContainers = document.querySelectorAll(".bookmark.button");

  bookmarkContainers.forEach(container => {
    const bookmarkBtn = container.querySelector(".cmp-button");
    const pageUrl = window.location.href;

    // Load bookmark status
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    if (bookmarks.includes(pageUrl)) {
      bookmarkBtn.classList.add("bookmarked");
    }

    // Toggle bookmark
    bookmarkBtn.addEventListener("click", function () {
      let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

      if (bookmarks.includes(pageUrl)) {
        bookmarks = bookmarks.filter(url => url !== pageUrl);
        bookmarkBtn.classList.remove("bookmarked");
      } else {
        bookmarks.push(pageUrl);
        bookmarkBtn.classList.add("bookmarked");
      }

      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const inputField = document.querySelector('.cmp-form-text__text');
  const listItems = document.querySelectorAll('.cmp-guidesnavigation__group li');

  if(!inputField) {
    return
  }

  inputField.addEventListener('input', function() {
    const searchValue = inputField.value.toLowerCase().trim();
    const searchInputParent = inputField.parentElement;
    if(searchValue) {
     searchInputParent.classList.add("input-active");
    } else {
      searchInputParent.classList.remove("input-active");
    }
      
    listItems.forEach(function(item) {
        const itemText = item.textContent.toLowerCase();
  
        if (itemText.includes(searchValue)) {
            item.style.display = 'list-item';  
        } else {
            item.style.display = 'none';
        }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
// left arrow 
var arrowbtnleft = document.querySelector(".arrow-btn-left");
var sidepanel = document.querySelector(".left-container");

if (arrowbtnleft) {
  arrowbtnleft.addEventListener("click", function () {

    let spWidth = sidepanel.offsetWidth;
    let spMarginLeft = parseInt(window.getComputedStyle(sidepanel).marginLeft, 10);
    let w = (spMarginLeft >= 0) ? spWidth * -1 : 0;

    if (w < 0) {
      sidepanel.classList.add('hide-side-panel');
      arrowbtnleft.classList.add('arrow-opposite');
    } else {
      sidepanel.classList.remove('hide-side-panel');
      arrowbtnleft.classList.remove('arrow-opposite');
    }

    sidepanel.style.transition = "margin-left 0.4s ease-in-out";
    sidepanel.style.marginLeft = w + "px";

    // sidepanel.classList.add('hide-side-panel');
  });
}

//right arrow 
var arrowbtnright = document.querySelector(".arrow-btn-right");
var sidepanelRight = document.querySelector(".right-container");

if (arrowbtnright) {
  arrowbtnright.addEventListener("click", function () {
    let spWidth = sidepanelRight.offsetWidth;
    let spMarginRight = parseInt(window.getComputedStyle(sidepanelRight).marginRight, 10);
    let w = (spMarginRight >= 0) ? spWidth * -1 : 0;

    if (w < 0) {
      sidepanelRight.classList.add('hide-side-panel');
      arrowbtnright.classList.add('arrow-opposite');
    } else {
      sidepanelRight.classList.remove('hide-side-panel');
      arrowbtnright.classList.remove('arrow-opposite');
    }

    // let cw = (w < 0) ? -w : spWidth - 22;

    sidepanelRight.style.transition = "margin-right 0.4s ease-in-out";
    sidepanelRight.style.marginRight = w + "px";
    // sidepanelRight.classList.add('hide-side-panel');  
  });
}

});

document.addEventListener('DOMContentLoaded', function() {
const pdfAbsPath = "/content/dam/fmdita-outputs/pdfs/";

window.addEventListener("DOMContentLoaded", function () {

  const downloadBtn = document.querySelector(".pdf-download");
  const ctaContainer = document.querySelector(".pdf-download");

  if(!downloadBtn) {
    return;
  }

  const pdfUrl = getPDFUrl();
  // Check if the PDF file exists before opening it

  try {
    checkPDFExistence(pdfUrl).then(isExists => {
      if (isExists) {
        downloadBtn.addEventListener("click", function () {
          window.open(pdfUrl, "_blank"); 
        });
      } else {
        downloadBtn.style.display = "none";
      }
    });

  } catch (error) {
    console.warn("pdf download error", error);
  }
});

function getPDFUrl() {
  const topicTitle = document.querySelector("#topic-title .cmp-title__text")?.textContent;
  if (!topicTitle) {
    console.error("Topic title not found");
    return "";
  }
  return pdfAbsPath + topicTitle.split(" ").join("_") + ".pdf";
}

function checkPDFExistence(url) {
  return new Promise((resolve, reject) => {
    fetch(url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          resolve(true); // PDF exists
        } else {
          resolve(false); // PDF does not exist
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}
// function showNoteMessage(container) {

//   const downloadManualButton = document.querySelector(".download-manual-button");
//   const noteMessage = document.createElement('div');

//   noteMessage.classList.add('pdf-note');
//   downloadManualButton.classList.add('padding-bottom');
//   noteMessage.textContent = "Sorry, the PDF file is not available.";

//   if (!container.querySelector('.pdf-note')) {
//     container.appendChild(noteMessage);
//   }

//   setTimeout(() => {
//     container.removeChild(noteMessage);
//     downloadManualButton.classList.remove('padding-bottom');
//   }, 30000);
// }

});


document.addEventListener("DOMContentLoaded", function () {
  const maxScrollHeight = (document.documentElement.scrollHeight - window.innerHeight);
  const readingProgBar = document.querySelector(".readingprogressbar");

  if (!readingProgBar) {
    return;
  }

  document.addEventListener("scroll", function () {
    if (window.scrollY == 0 || window.scrollY >= maxScrollHeight) {
      readingProgBar.style.display = "none";
    } else {
      readingProgBar.style.display = "block";
    }
  })
});


document.addEventListener("DOMContentLoaded", function () {
  if (typeof hljs !== 'undefined') {
    hljs.initHighlightingOnLoad();
  }
});

document.addEventListener("DOMContentLoaded", function () {
// Function to share the current page link via different platforms
function shareTo(platform) {
  const url = window.location.href;
  const text = document.title || 'Check this out!';

  if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)} &t= ${encodeURIComponent(text)}`, '_blank');
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  } else if (platform === 'instagram') {
    alert("Instagram doesn't allow sharing via a URL. Share via their app directly.");
  } else if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
  } else if (platform === 'telegram') {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  }
}

window.shareTo = shareTo;

// Function to copy the URL to the clipboard
function copyLink() {
  const input = document.querySelector('.field input');
  input.select();
  input.setSelectionRange(0, 99999); // For mobile devices
  document.execCommand('copy');
  alert("Link copied to clipboard!");
}

// Set the title of the page dynamically and copy the URL dynamically
const fullUrl = window.location.href; // Get the full URL (including 'https://')
const cleanUrl = fullUrl.replace('https://', ''); // Remove 'https://' for display purposes

// Set the title of the page dynamically
if (document.querySelector('.sharepopup')) {
  document.getElementById('page-title').textContent = document.title;
  document.getElementById('page-link').value = cleanUrl;

  // Set the input field to show the clean URL without 'https://'

  // Modal open and close logic
  const viewBtn = document.querySelector(".share"),
    popup = document.querySelector(".popup"),
    close = popup.querySelector(".close"),
    field = popup.querySelector(".field"),
    input = field.querySelector("input"),
    copy = field.querySelector("button");

  viewBtn.onclick = () => {
    popup.classList.toggle("show");
    document.querySelector('.overlay-modal').classList.add('popup-overlay-active');
  }

  close.onclick = () => {
    viewBtn.click();
    document.querySelector('.overlay-modal').classList.remove('popup-overlay-active');
  }

  copy.onclick = () => {
    input.select(); // Select input value
    if (document.execCommand("copy")) { // If the selected text is copied
      field.classList.add("active");
      copy.innerText = "Copied";
      setTimeout(() => {
        window.getSelection().removeAllRanges(); // Remove selection from page
        field.classList.remove("active");
        copy.innerText = "Copy";
      }, 3000);
    }
  }

  document.body.addEventListener('click', function (event) {
    if (!popup.contains(event.target) && !viewBtn.contains(event.target)) {
      popup.classList.remove("show");
      document.querySelector('.overlay-modal').classList.remove('popup-overlay-active');
    }
  });
}



});


document.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector("body");
  // const themeBtn = document.querySelector(".theme-btn");
  const themeBtn = document.querySelector("#checkbox");
    if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Dark
      body.classList.add("dark");
      document.querySelector('.checkbox').checked = true;
    } else {
      // Light
      body.classList.add("light");
    }
  }

  if(sessionStorage.getItem("theme")){
    if(sessionStorage.getItem("theme") == 'light'){
      body.classList.add("light");
      body.classList.remove('dark');
    }else{
      body.classList.add("dark");
      body.classList.remove('light');
      document.querySelector('.checkbox').checked = true;
    }
  }
  
  themeBtn.addEventListener("change", function () {
    if(body.classList.contains('dark')){
      body.classList.remove('dark');
      body.classList.add('light');
      sessionStorage.setItem("theme",'light');
    }else{
      body.classList.remove('light');
      body.classList.add('dark');
      sessionStorage.setItem("theme",'dark');
    }
  });

});


document.addEventListener("DOMContentLoaded", function () {
  const timeToRead = document.querySelector(".time-to-read");
  if(!timeToRead) return;
   
  var blog = document.querySelector('.topic-body');
  var blogLen = blog.innerText.trim().split(/\s+/).length;
  const wpm = 225;
  const time = Math.ceil(blogLen / wpm);
  document.querySelector('.time-to-read p').textContent = time + ' min read';
});



document.addEventListener("DOMContentLoaded", function () {
  const tocPopupInit = document.querySelector(".toc-popup-init");

  if(!tocPopupInit) {
    return;
  }

  const modal = createTocOverlayModal();

  document.querySelector("body").addEventListener("click", function (e) {

    if (e.target.closest("body:not(.toc-modal) .toc-popup-init")) {
      modal.classList.add("modal-active");
      document.querySelector("body").classList.add("toc-modal");
      document.querySelector(".toc-search").style.display = "block"; 
      document.querySelector(".toc-search").classList.add("toc-search-position");
      return;
    }

    if (!e.target.closest(".cmp-guides-navigation") && getComputedStyle(document.querySelector('.toc-popup-init')).display === "inline-block") {
      document.querySelector("body").classList.remove("toc-modal");
      document.querySelector(".toc-search").style.display = "none";
      modal.classList.remove("modal-active");
    }
  });

  document.querySelector(".toc-search input").addEventListener('click', function (e) {
    e.stopPropagation(); 
  });

});


function createTocOverlayModal() {
  const modal = document.createElement("div");
  modal.classList.add("overlay-modal");
  document.querySelector("body").append(modal);
  return modal;
}