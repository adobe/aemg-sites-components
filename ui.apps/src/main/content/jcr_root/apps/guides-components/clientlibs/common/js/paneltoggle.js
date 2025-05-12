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
