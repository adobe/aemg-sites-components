window.addEventListener("DOMContentLoaded", function () {
  const filterElements = document.querySelectorAll("[data-filter-key]");
  const listParent = document.querySelector(".leveloneprops div");
  const elements = document.querySelectorAll(".leveloneprops div .guide-item");

  const noResultElement = document.createElement("div");
  noResultElement.textContent = "No matching results found. Please try again with different filters.";
  noResultElement.style.color = "var(--color-accent)";
  noResultElement.style.display = "none";

  const allFilter = document.querySelector("[data-filter-key='all']");

  listParent.appendChild(noResultElement);

  filterElements.forEach(li => {
    li.addEventListener("click", () => {

      activeFilterClassToggle(li);

      const activeProductCat = document.querySelector(".vehicleproductcategory .active-filter");
      const activeVehType = document.querySelector(".vehicletype .active-filter");
      const activeModel = document.querySelector(".vehiclemodel  .active-filter");

      const filters = [activeProductCat, activeVehType, activeModel];

      let noOfResults = 0;

      if(li.dataset.filterKey.toLowerCase() == "all") {
        allFilter.classList.add("active-filter");

        elements.forEach(item => {
          item.style.display = "block";
        });

        filters.forEach(ele => {
          if(ele && ele != li) {
            ele.classList.remove("active-filter");
          }
        });

      } else {
        allFilter.classList.remove("active-filter");
      }

      const curactiveProductCat = document.querySelector(".vehicleproductcategory .active-filter");
      const curactiveVehType = document.querySelector(".vehicletype .active-filter");
      const curactiveModel = document.querySelector(".vehiclemodel  .active-filter");

      elements.forEach(item => {
        noOfResults += validator([curactiveProductCat, curactiveVehType, curactiveModel], item) ;
      });

      if(noOfResults == 0) {
        noResultElement.style.display = "block";
      } else {
        noResultElement.style.display = "none";
      }
    
    });
  });
});

function activeFilterClassToggle(li) {
  const parentUl = li.closest("ul");
  const prevActiveLi = parentUl.querySelector(".active-filter");
  if(prevActiveLi) {
    prevActiveLi.classList.remove("active-filter");
  }

  li.classList.add("active-filter");
}

function validator(array, item) {
  const validArr = array.filter(ele => ele);

  const isValid = validArr.every(element => {
    const key = element.dataset.filterKey;
    const value = element.dataset.value;

    return item.dataset[key] == value;
  });

  if(isValid) {
    item.style.display = "block";
  } else {
    item.style.display = "none";
  }

  return isValid;
}
