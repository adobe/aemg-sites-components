window.addEventListener("DOMContentLoaded", function () {
  const ROOT_PATH = document.querySelector("[data-cmp-rootpath]")?.dataset?.cmpRootpath;
  if(ROOT_PATH) {
    fetchSearchData();
  }
});

async function fetchSearchData() {
  const API_ENDPOINT = "/content/aemguidesDALP/api/search-api.model.json";
  const ROOT_PATH = document.querySelector("[data-cmp-rootpath]").dataset.cmpRootpath;
  const KEYWORD = getKeywordFromUrl();

  // Construct the full URL using the variables
  const url = `${API_ENDPOINT}?pagePath=${ROOT_PATH}&keyword=${KEYWORD}`;

  try {
    const response = await fetch(url, {
      method: 'GET', // Specify the method (GET is default)
      headers: {
        'Content-Type': 'application/json', // Set the content type if needed
        // Add any other headers if required
      }
    });

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json(); // Parse the JSON from the response
    console.log(data); // Log the data to the console
    displayDataOnPage(data);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function getKeywordFromUrl() {
  // Get the current URL
  const currentUrl = window.location.href;

  // Create a URL object
  const url = new URL(currentUrl);

  // Use URLSearchParams to get the 'fulltext' parameter
  const keyword = url.searchParams.get('fulltext');

  return keyword;
}

function displayDataOnPage(resultData) {
  console.log("Result Data: ", resultData);
  var totalRecords = document.querySelector(".cmp-search__total-records");
  var searchFieldListGroup = document.querySelector(".cmp-search-list__item-group");
  var searchResultEndMessage = document.getElementById("js-searchResults-endData");

  var LIST_GROUP="";

  const data = resultData.filter(obj => obj.path);
  const dataCount = data.length;

  console.log(data, "data");

  totalRecords.innerHTML = "";
  NUMBER_OF_RECORDS = "";
  var showCountVal = "";

  // if (resultSize === parseInt(0)) {
  //     searchFieldListGroup.innerHTML = "";
  //     LIST_GROUP = "";
  // }
  // var data = resultData.data;
  // var hasMore = resultData.hasMore === true;
  // var dataCount = Object.keys(data).length;

  if (dataCount !== 0) {
      showCountVal = dataCount;
      searchResultEndMessage.style.display = "none";
      // if (hasMore) {
      //     getLoadMoreBtn.style.display = "block";
      //     showCountVal += resultData.totalRecords;
      // } else {
      //     getLoadMoreBtn.style.display = "none";
      //     showCountVal += resultData.totalRecords;
      //     if (resultData.isLastPage !== true) {
      //         getLoadMoreBtn.style.display = "block";
      //     }
      // }
  } else {
      searchResultEndMessage.style.display = "none";
      // getLoadMoreBtn.style.display = "none";
  }

  var uniqueUrls = new Set();

  for (var i = 0; i < data.length; i++) {

    if(uniqueUrls.has(data[i].path)) {
      continue;
    }
    
    uniqueUrls.add(data[i].path);

    let breadcrumb = data[i].path.slice(1).replaceAll('/', ' > ')
    var fifthIndex = breadcrumb.indexOf(' > ', breadcrumb.indexOf(' > ', breadcrumb.indexOf(' > ', breadcrumb.indexOf(' > ') + 1) + 1) + 1) + 3; // Finding the index of the fifth '>'
    breadcrumb = breadcrumb.slice(fifthIndex);
    // LIST_GROUP += "<li class='cmp-searchresult-item'><h3 class='cmp-searchresult-title'><a class='cmp-searchresult-link' target='_blank' href=" + checkNull(data[i].url) + ">" + checkNull(data[i].title) + "</a></h3><span class='cmp-searchresult-tags'>" + checkNull(data[i].tags) + "<span class='cmp-searchresult-date'>" + checkNull(data[i].formattedLastModifiedDate) + "</span> <p class='cmp-searchresult-description'>" + checkNull(data[i].excerpt) + "</p><p class='cmp-searchresult-breadcrumb'>" + checkNull(breadcrumb) + "</p></li>";
    LIST_GROUP += ("<li class='cmp-searchresult-item'><h3 class='cmp-searchresult-title'><a class='cmp-searchresult-link' target='_blank' href=" + checkNull(data[i].url || (data[i].path + ".html")) + ">" + checkNull(data[i]['jcr:title']) + "</a></h3><span class='cmp-searchresult-tags'>" + checkNull(data[i].tags) + "<span class='cmp-searchresult-date'>" + checkNull(data[i].formattedLastModifiedDate) + "</span> <p class='cmp-searchresult-description'>" + checkNull(data[i].excerpt) + "</p><p class='cmp-searchresult-breadcrumb'>" + checkNull(breadcrumb) + "</p></li>")
      || "";
  }
  
  showCountVal = uniqueUrls.size;

  searchFieldListGroup.innerHTML = LIST_GROUP;
  let startFrom = Math.min(1, showCountVal);
  // if(hasMore) {
  //     showCountVal = showCountVal + "+"
  // }
  NUMBER_OF_RECORDS += `<span>Showing</span> <b>${startFrom} - ${showCountVal}</b>`;
  //  <span>out of ${showCountVal} results</span>`;

  if(dataCount === 0){
      NUMBER_OF_RECORDS = `<span>No results found</span>`
  }
  totalRecords.innerHTML = NUMBER_OF_RECORDS;

}

function checkNull(inputValue) {
  var value = "";
  if (inputValue === null || inputValue === undefined) {
    return value;
  } else {
    return inputValue;
  }
}
