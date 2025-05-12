window.addEventListener("DOMContentLoaded", function () {
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
