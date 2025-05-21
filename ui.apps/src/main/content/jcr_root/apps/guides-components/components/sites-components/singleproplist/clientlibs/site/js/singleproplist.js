window.addEventListener("DOMContentLoaded", function () {
  callafunction();

});

function callafunction() {
  const ulElement = document.querySelectorAll(".singleproplist-ul");
  let isPropsExist = false;

  for (let i = 0; i < ulElement.length; i++) {
    // Retrieve the data-cmp-uniqueprops attribute and parse it as JSON
    const uniquePropsData = JSON.parse(ulElement[i].dataset.cmpUniqueprops);

    // Get the array of strings from the parsed JSON object
    const stringKey = Object.entries(uniquePropsData)[0][0];
    const stringValues = Object.entries(uniquePropsData)[0][1];

    // Create a document fragment to optimize DOM manipulation
    const fragment = document.createDocumentFragment();

    // Loop through each string in the array and create an <li> element
    stringValues.forEach(item => {
      if (item) {
        const li = document.createElement('li');
        li.dataset.filterKey = stringKey;
        li.dataset.value = item;
        li.textContent = item;
        fragment.appendChild(li);
        if(stringKey == "tp_vehicletype" || stringKey == "tp_carmodel") {
          isPropsExist = true;
        }
      }
    });
    
    if(stringValues == "" || stringValues.length <= 0) {
      const parentEle = ulElement[i].closest(".singleproplist");
      if(parentEle) {
        parentEle.style.display = "none";
        continue;
      }
    }

    // Append the fragment containing the <li> elements to the <ul>
    ulElement[i].appendChild(fragment);
  }
  
  const filterContainer = document.querySelector(".vehicles_type");
  if(!isPropsExist && filterContainer) {
    filterContainer.style.display = "none";
  }

  const mobFilterBtn = document.querySelector(".vehicle_search_btn");
  if(!isPropsExist && mobFilterBtn) {
    mobFilterBtn.style.display = "none";
  }
 }
