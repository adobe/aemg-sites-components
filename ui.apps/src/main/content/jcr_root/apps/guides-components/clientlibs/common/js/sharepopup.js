// Function to share the current page link via different platforms
function shareTo(platform) {
  const url = window.location.href;
  const text = document.title || 'Check this out!';

  if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)} &t= ${encodeURIComponent(text)}`, '_blank');
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  } else if (platform === 'instagram') {
    alert("Instagram doesn't allow sharing via a URL. Share via their app directly.");
  } else if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
  } else if (platform === 'telegram') {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  }
}

window.shareTo = shareTo;

// Function to copy the URL to the clipboard
function copyLink() {
  const input = document.querySelector('.field input');
  input.select();
  input.setSelectionRange(0, 99999); // For mobile devices
  document.execCommand('copy');
  alert("Link copied to clipboard!");
}

// Set the title of the page dynamically and copy the URL dynamically
const fullUrl = window.location.href; // Get the full URL (including 'https://')
const cleanUrl = fullUrl.replace('https://', ''); // Remove 'https://' for display purposes

// Set the title of the page dynamically
if (document.querySelector('.sharepopup')) {
  document.getElementById('page-title').textContent = document.title;
  document.getElementById('page-link').value = cleanUrl;

  // Set the input field to show the clean URL without 'https://'

  // Modal open and close logic
  const viewBtn = document.querySelector(".share"),
    popup = document.querySelector(".popup"),
    close = popup.querySelector(".close"),
    field = popup.querySelector(".field"),
    input = field.querySelector("input"),
    copy = field.querySelector("button");

  viewBtn.onclick = () => {
    popup.classList.toggle("show");
    document.querySelector('.overlay-modal').classList.add('popup-overlay-active');
  }

  close.onclick = () => {
    viewBtn.click();
    document.querySelector('.overlay-modal').classList.remove('popup-overlay-active');
  }

  copy.onclick = () => {
    input.select(); // Select input value
    if (document.execCommand("copy")) { // If the selected text is copied
      field.classList.add("active");
      copy.innerText = "Copied";
      setTimeout(() => {
        window.getSelection().removeAllRanges(); // Remove selection from page
        field.classList.remove("active");
        copy.innerText = "Copy";
      }, 3000);
    }
  }

  document.body.addEventListener('click', function (event) {
    if (!popup.contains(event.target) && !viewBtn.contains(event.target)) {
      popup.classList.remove("show");
      document.querySelector('.overlay-modal').classList.remove('popup-overlay-active');
    }
  });
}


