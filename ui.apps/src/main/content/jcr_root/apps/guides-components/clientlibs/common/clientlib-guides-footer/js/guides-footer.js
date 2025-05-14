document.addEventListener("DOMContentLoaded", function () {
  let acc = document.getElementsByClassName("footer_links-title");
  let i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      let panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let gototop = document.querySelector('.gototop_arrow');

  gototop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  })
});
