window.addEventListener("DOMContentLoaded", function () {
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
