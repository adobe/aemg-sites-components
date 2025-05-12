
document.addEventListener("DOMContentLoaded", function () {
    const bookmarkContainers = document.querySelectorAll(".bookmark.button");
  
    bookmarkContainers.forEach(container => {
      const bookmarkBtn = container.querySelector(".cmp-button"); 
      const pageUrl = window.location.href;
  
      // Load bookmark status
      let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
      if (bookmarks.includes(pageUrl)) {
        bookmarkBtn.classList.add("bookmarked"); 
      }
  
      // Toggle bookmark
      bookmarkBtn.addEventListener("click", function () {
        let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  
        if (bookmarks.includes(pageUrl)) {
          bookmarks = bookmarks.filter(url => url !== pageUrl);
          bookmarkBtn.classList.remove("bookmarked"); 
        } else {
          bookmarks.push(pageUrl);
          bookmarkBtn.classList.add("bookmarked"); 
        }
  
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      });
    });
  });
  