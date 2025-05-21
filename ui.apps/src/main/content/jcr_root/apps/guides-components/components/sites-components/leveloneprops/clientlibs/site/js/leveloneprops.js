// Step 1: Get the div element
const divElement = document.querySelector('.leveloneprops div');

// Step 2: Get and parse the JSON data from the data-cmp-props-list attribute
const data = JSON.parse(divElement.getAttribute('data-cmp-props-list'));

// Step 3: Create a <ul> element
const ulElement = document.createElement('ul');

// Step 4: Loop through the data and create <li> elements
data.forEach(item => {
  const liElement = document.createElement('li');
  liElement.dataset.tp_vehicletype = item.tp_vehicletype;
  liElement.dataset.tp_category = item.tp_category;
  liElement.dataset.tp_carmodel = item.tp_carmodel;
    
  liElement.textContent = `Vehicle Type: ${item.tp_vehicletype}, Category: ${item.tp_category}, Model: ${item.tp_carmodel}`;
  
  // Append each <li> to the <ul>
  ulElement.appendChild(liElement);
});

// Step 5: Append the <ul> to the div
divElement.appendChild(ulElement);
