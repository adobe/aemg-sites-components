window.addEventListener("DOMContentLoaded", function () {
  const bannerImgs = document.querySelectorAll(".banner-img");
  const themeButton = document.querySelector(".theme-btn");

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      bannerImgs.forEach((img) => {
        img.classList.toggle("bg-img-monochrome");
      });
    });
  }
});
