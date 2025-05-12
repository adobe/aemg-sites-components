window.addEventListener("DOMContentLoaded", function () {
  const timeToRead = document.querySelector(".time-to-read");
  if(!timeToRead) return;
   
  var blog = document.querySelector('.topic-body');
  var blogLen = blog.innerText.trim().split(/\s+/).length;
  const wpm = 225;
  const time = Math.ceil(blogLen / wpm);
  document.querySelector('.time-to-read p').textContent = time + ' min read';
});
