window.addEventListener("DOMContentLoaded", function () {
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
