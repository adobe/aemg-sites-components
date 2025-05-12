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
