
window.addEventListener("DOMContentLoaded", function () {
  // ---------- Parse and Render Data ----------
  const listParent = document.querySelector(".leveloneprops div");
  const dataAttr = listParent?.getAttribute("data-cmp-props-list");
  if (!dataAttr) return;

  let decodedData;
  try {
    decodedData = JSON.parse(dataAttr.replace(/&quot;/g, '"'));
  } catch (e) {
    console.error("Invalid JSON data in data-cmp-props-list", e);
    return;
  }

  populateNavigation(decodedData);

  // ---------- Filtering Logic ----------
  const filterElements = document.querySelectorAll("[data-filter-key]");
  const elements = document.querySelectorAll(".leveloneprops div .guide-item");
  const allFilter = document.querySelector("[data-filter-key='all']");

  const noResultElement = document.createElement("div");
  noResultElement.textContent = "No matching results found. Please try again with different filters.";
  noResultElement.style.color = "var(--color-accent)";
  noResultElement.style.display = "none";
  listParent.appendChild(noResultElement);

  filterElements.forEach(li => {
    li.addEventListener("click", () => {
      activeFilterClassToggle(li);

      const activeProductCat = document.querySelector(".vehicleproductcategory .active-filter");
      const activeVehType = document.querySelector(".vehicletype .active-filter");
      const activeModel = document.querySelector(".vehiclemodel .active-filter");
      const filters = [activeProductCat, activeVehType, activeModel];

      let noOfResults = 0;

      if (li.dataset.filterKey.toLowerCase() === "all") {
        allFilter.classList.add("active-filter");
        elements.forEach(item => item.style.display = "block");
        filters.forEach(ele => {
          if (ele && ele !== li) ele.classList.remove("active-filter");
        });
      } else {
        allFilter.classList.remove("active-filter");
      }

      const curFilters = [
        document.querySelector(".vehicleproductcategory .active-filter"),
        document.querySelector(".vehicletype .active-filter"),
        document.querySelector(".vehiclemodel .active-filter")
      ];

      elements.forEach(item => {
        noOfResults += validator(curFilters, item);
      });

      noResultElement.style.display = noOfResults === 0 ? "block" : "none";
    });
  });

  // ---------- Modal Toggle ----------
  const vehicleFilterBtn = document.querySelector(".vehicle_search_btn");
  const vehiclesType = document.querySelector(".vehicles_type .cmp-container");

  vehicleFilterBtn?.addEventListener('click', function (e) {
    e.stopPropagation();
    document.body.classList.add("vehicles_modal");
  });

  document.body.addEventListener("click", function (e) {
    if (!vehiclesType.contains(e.target) && e.target !== vehicleFilterBtn) {
      document.body.classList.remove("vehicles_modal");
    }
  });

  vehiclesType?.addEventListener('click', function (e) {
    e.stopPropagation();
  });
});

// ---------- Functions ----------
function activeFilterClassToggle(li) {
  const parentUl = li.closest("ul");
  const prevActiveLi = parentUl.querySelector(".active-filter");
  if (prevActiveLi) {
    prevActiveLi.classList.remove("active-filter");
  }
  li.classList.add("active-filter");
}

function validator(filters, item) {
  const validFilters = filters.filter(Boolean);
  const isValid = validFilters.every(filter => {
    const key = filter.dataset.filterKey;
    const value = filter.dataset.value;
    return item.dataset[key] === value;
  });

  item.style.display = isValid ? "block" : "none";
  return isValid;
}

function populateNavigation(data) {
  const container = document.querySelector(".leveloneprops .cmp-div");
  if (!container) return;

  data.forEach(item => {
    const { "jcr:title": title, "dc:description": description, "tp_coverimage": image, tp_vehicletype, tp_category, tp_carmodel, pagePath } = item;

    const guideItem = document.createElement("div");
    guideItem.classList.add("guide-item");
    guideItem.dataset.tp_vehicletype = tp_vehicletype;
    guideItem.dataset.tp_category = tp_category;
    guideItem.dataset.tp_carmodel = tp_carmodel;

    const vehicletypeLabel = tp_vehicletype?.toLowerCase() === 'fully electric'
      ? '<span class="vehicle-type-label">Electric</span>'
      : '';

    guideItem.innerHTML = `
        <a class="cmp-teaser__title" href="${pagePath}.html">
          ${vehicletypeLabel}
          <div class="cmp-teaser__image">
            ${image ? `<img src="${image}" alt="${title}"/>` : ''}
          </div>
          <h3 class="cmp-teaser__title">${title}</h3>
          ${description ? `<p>${description}</p>` : ''}
        </a>
      `;

    container.appendChild(guideItem);
  });
}

