import nullDomHanlder from "../../utils/js/nulldomhandler";

//go to top functionality
let gototop = nullDomHanlder(document.querySelector('.gototop_arrow'));

gototop.addEventListener('click', ()=> {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
})