window.addEventListener("DOMContentLoaded", function () {
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
