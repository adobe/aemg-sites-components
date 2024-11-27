/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
/*******************************************************************************
 * Copyright 2019 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";
    var RESULTS_JSON = "aemsitesearchresults.json";
    var PARAM_RESULTS_OFFSET = "resultsOffset";
    var $getFacetFilterCheckbox = document.getElementsByName("facet");
    var currentPageUrl = window.location.href;
    var getPageURL = currentPageUrl.substring(0, currentPageUrl.lastIndexOf("."));
    var getQueryParam = window.location.search;
    var searchFieldListGroup = document.querySelector(".cmp-search-list__item-group");
    var totalRecords = document.querySelector(".cmp-search__total-records");

    var searchField = document.querySelector(".search__field--view");

    var getRelativePath = searchField.dataset.cmpRelativePath;
    var getLoadMoreBtn = document.querySelector(".search__results--footer button");
    var searchResultEndMessage = document.getElementById("js-searchResults-endData");
    var $getSortAscDesVal = document.getElementById("js-sorting-des-asc");
    var $getSortDirVal = document.getElementById("js-sort-dir");

    var getCategory = new Array();
    var resultSize = 0;
    var showCountVal = 0;
    var LIST_GROUP;
    var NUMBER_OF_RECORDS;

    var getSortAscDesVal = getSortingVal($getSortAscDesVal);
    var getSortDirVal = getSortingVal($getSortDirVal);

    // GET SORTING DROP-DOWN VALUES
    function getSortingVal(val) {
        if(!val) return ""
        return val[val.selectedIndex].value;
    }

    // Load More Button Click Function
    getLoadMoreBtn.addEventListener("click", function(event) {
        resultSize = resultSize + parseInt(document.querySelector(".search__field--view").dataset.cmpResultsSize);
        getCategory.length > 0 ? fetchDataNew(getCategory) : fetchDataNew();
    });

    // CATEGORIES CLICK EVENT
    $getFacetFilterCheckbox.forEach(function(getFacetFilterCheckbox) {
        getFacetFilterCheckbox.addEventListener("click", function(event) {
            resultSize = 0;
            showCountVal = 0
            if (getFacetFilterCheckbox.checked) {
                getCategory.push(getFacetFilterCheckbox.value);
            } else {
                var NEW_LIST = getCategory.filter(function(item) {
                    return item !== getFacetFilterCheckbox.value;
                });
                getCategory = NEW_LIST;
            }
            getCategory.length > 0 ? fetchDataNew(getCategory) : fetchDataNew();
        });
    });

    // SORT BY CLICK EVENT AND PAGE LOAD
    if($getSortAscDesVal) {
        $getSortAscDesVal.addEventListener("change", function(event) {
            resultSize = 0;
            showCountVal = 0
            getSortAscDesVal = getSortingVal($getSortAscDesVal);
            getCategory.length > 0 ? fetchDataNew(getCategory) : fetchDataNew();
        });
    }

    if($getSortDirVal) {
        $getSortDirVal.addEventListener("change", function(event) {
            resultSize = 0;
            showCountVal = 0
            getSortDirVal = getSortingVal($getSortDirVal.options);
            getCategory.length > 0 ? fetchDataNew(getCategory) : fetchDataNew();
        });
    }

    // On page load function
    function onDocumentReady() {
        searchResultEndMessage.style.display = "none";
        getLoadMoreBtn.style.display = "none";
        fetchDataNew();
    }

    // FETCH DATA API CALL
    function fetchDataNew(getCategory) {
        var apiURL = getDataURL(getCategory);
	console.log("API URL=", apiURL);
        fetch(apiURL)
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
		console.log("fetchDataNew(json) => json =", json);
                return displayDataOnPage(json);
            });
    }

    // FETCH DATA URL CREATION
    function getDataURL(getCategory) {
	console.log(`getDataURL($getCategory)) called`);
        var fetchAPIURL = getPageURL + "." + RESULTS_JSON + getRelativePath + getQueryParam + "&" + PARAM_RESULTS_OFFSET + "=" + resultSize + "&orderby=" + getSortDirVal + "&sort=" + getSortAscDesVal;
        var fetchAPIURLNew = getCategory ? fetchAPIURL + "&tags=" + getCategory : fetchAPIURL;
        return fetchAPIURLNew;
    }

    // Check null value and replace with empty string
    function checkNull(inputValue) {
        var value = "";
        if (inputValue === null) {
            return value;
        } else {
            return inputValue;
        }
    }

    function createResultsHeader(format, count, total) {
        if(format) {
            return format.replace("{count}", count).replace("{total}", total)
        }
        return ""
    }

    // DISPLAY DATA ON PAGE LOAD
    function displayDataOnPage(resultData) {
        console.log("Result Data: ", resultData);

        totalRecords.innerHTML = "";
        NUMBER_OF_RECORDS = "";

        if (resultSize === parseInt(0)) {
            searchFieldListGroup.innerHTML = "";
            LIST_GROUP = "";
        }
        var data = resultData.data;
        var hasMore = resultData.hasMore === true;
        var dataCount = Object.keys(data).length;
        if (dataCount !== 0) {
            searchResultEndMessage.style.display = "none";
            if (hasMore) {
                getLoadMoreBtn.style.display = "block";
                showCountVal += resultData.data.length;
            } else {
                getLoadMoreBtn.style.display = "none";
                showCountVal = resultData.totalRecords;
                if (resultData.isLastPage !== true) {
                    getLoadMoreBtn.style.display = "block";
                }
            }
        } else {
            searchResultEndMessage.style.display = "none";
            getLoadMoreBtn.style.display = "none";
            showCountVal = resultData.totalRecords;
        }

        for (var i = 0; i < dataCount; i++) {
            let breadcrumb = data[i].path.slice(1).replaceAll('/', ' > ')
            var fifthIndex = breadcrumb.indexOf(' > ', breadcrumb.indexOf(' > ', breadcrumb.indexOf(' > ', breadcrumb.indexOf(' > ') + 1) + 1) + 1) + 3; // Finding the index of the fifth '>'
            breadcrumb = breadcrumb.slice(fifthIndex);
            LIST_GROUP += "<li class='cmp-searchresult-item'><h3 class='cmp-searchresult-title'><a class='cmp-searchresult-link' target='_blank' href=" + checkNull(data[i].url) + ">" + checkNull(data[i].title) + "</a></h3><span class='cmp-searchresult-tags'>" + checkNull(data[i].tags) + "<span class='cmp-searchresult-date'>" + checkNull(data[i].formattedLastModifiedDate) + "</span> <p class='cmp-searchresult-description'>" + checkNull(data[i].excerpt) + "</p><p class='cmp-searchresult-breadcrumb'>" + checkNull(breadcrumb) + "</p></li>";
        }
        searchFieldListGroup.innerHTML = LIST_GROUP;
        let total = resultData.totalRecords
        if(hasMore) {
            total = total + "+"
        }
        const format = totalRecords.getAttribute("data-cmp-format")
        if(dataCount === 0){
            searchResultEndMessage.style.display = "block";
            totalRecords.style.display = "none"
        } else {
            totalRecords.innerHTML = createResultsHeader(format, showCountVal, total);
        }

    }

    document.addEventListener("DOMContentLoaded", onDocumentReady);
})();
