document.addEventListener('DOMContentLoaded', function() {
  const inputField = document.querySelector('.cmp-form-text__text');
  const listItems = document.querySelectorAll('.cmp-guidesnavigation__group li');

  if(!inputField) {
    return
  }

  inputField.addEventListener('input', function() {
    const searchValue = inputField.value.toLowerCase().trim();
    const searchInputParent = inputField.parentElement;
    if(searchValue) {
     searchInputParent.classList.add("input-active");
    } else {
      searchInputParent.classList.remove("input-active");
    }
      
    listItems.forEach(function(item) {
        const itemText = item.textContent.toLowerCase();
  
        if (itemText.includes(searchValue)) {
            item.style.display = 'list-item';  
        } else {
            item.style.display = 'none';
        }
    });
  });
});
