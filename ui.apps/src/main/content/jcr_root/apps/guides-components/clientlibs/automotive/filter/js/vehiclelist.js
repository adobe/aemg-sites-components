// Get the encoded JSON string from the data-cmp-props-list attribute
let encodedData = document.querySelector('.leveloneprops div').getAttribute('data-cmp-props-list');

// Decode the HTML entities to get valid JSON
let decodedData = encodedData.replace(/&quot;/g, '"');

// Parse the JSON string into a JavaScript object
let jsonData = JSON.parse(decodedData);

// Log the decoded and parsed data
console.log(jsonData);

// Step 2: Populate the navigation with the fetched data
function populateNavigation(data) {
  // Select the element where we want to populate the JSON data
  const container = document.querySelector(".leveloneprops .cmp-div");

  // Loop through the data and create HTML elements
  data.forEach((item) => {
    const title = item["jcr:title"];
    const description = item["dc:description"];
    const image = item["tp_coverimage"];

    // Create the structure for each item
    const guideItem = document.createElement("div");
    guideItem.classList.add("guide-item");
    guideItem.dataset.tp_vehicletype = item.tp_vehicletype;
    guideItem.dataset.tp_category = item.tp_category;
    guideItem.dataset.tp_carmodel = item.tp_carmodel;
    
    const vehicletypeLabel = item.tp_vehicletype.toLowerCase() === 'fully electric' ? 
    '<span class="vehicle-type-label">Electric</span>' : 
    '';  

    guideItem.innerHTML = `
      <a class="cmp-teaser__title" href="${item.pagePath + ".html"}">
      ${vehicletypeLabel}
      <div class="cmp-teaser__image">
        ${image ? '<img src="'+ image +'" alt="' + title + '"/>' : ''}
      </div>
      <h3 class="cmp-teaser__title">${title}</h3>
      ${description ? '<p>'+ description +'</p>' : ''} 
      </a>
    `;

    // Append each item to the container
    container.appendChild(guideItem);
  });
}

// Call the function to populate the data
populateNavigation(jsonData);
