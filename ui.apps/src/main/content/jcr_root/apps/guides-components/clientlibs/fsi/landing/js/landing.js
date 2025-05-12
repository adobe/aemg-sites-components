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
  const container = document.querySelector(".leveloneprops");
  
  container.innerHTML = "";

  // Loop through the data and create HTML elements
  data.forEach((item) => {
    container.classList.add('.toc-list-meta')
    const title = item["jcr:title"];
    const description = item["dc:description"];
    const image = item["tp_icon"];
    const button = item["tp_button"] || "Know More";
    

    // Create the structure for each item
    const guideItem = document.createElement("div");
    guideItem.classList.add("guide-item");

    const link = item.pagePath.endsWith(".html") ? item.pagePath : item.pagePath + ".html";

    guideItem.innerHTML = `
      <a href="${link}">
        ${image ? `<img src="${image}" alt="${title}">` : ''}
        ${title ? `<h3>${title}</h3>` : ''}
        ${description ? `<p>${description}</p>` : ''}
        ${button ? `<button>${button}</button>` : ''}
      </a>
    `;

    // Append each item to the container
    container.appendChild(guideItem);
  });
}

// Call the function to populate the data
populateNavigation(jsonData);
