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

    var ARTICLE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<circle cx="12" cy="12" r="10.5" stroke="#959595" stroke-width="1.2"/>' +
        '<line x1="2" y1="12" x2="22" y2="12" stroke="#959595" stroke-width="1"/>' +
        '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" stroke="#959595" stroke-width="1"/>' +
        '</svg>';

    var SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var getCategory = new Array();
    var resultSize = 0;
    var showCountVal = 0;
    var LIST_GROUP;
    var NUMBER_OF_RECORDS;

    var getSortAscDesVal = getSortingVal($getSortAscDesVal);
    var getSortDirVal = getSortingVal($getSortDirVal);

    function getSortingVal(val) {
        if(!val) return ""
        return val[val.selectedIndex].value;
    }

    function formatShortDate(dateStr) {
        if (!dateStr) return "";
        try {
            var date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return SHORT_MONTHS[date.getMonth()] + " " + date.getFullYear();
        } catch (e) {
            return dateStr;
        }
    }

    getLoadMoreBtn.addEventListener("click", function(event) {
        resultSize = resultSize + parseInt(document.querySelector(".search__field--view").dataset.cmpResultsSize);
        getCategory.length > 0 ? fetchDataNew(getCategory) : fetchDataNew();
    });

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

    function onDocumentReady() {
        searchResultEndMessage.style.display = "none";
        getLoadMoreBtn.style.display = "none";
        fetchDataNew();
    }

    function fetchDataNew(getCategory) {
        var apiURL = getDataURL(getCategory);
        fetch(apiURL)
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                return displayDataOnPage(json);
            });
    }

    function getDataURL(getCategory) {
        var fetchAPIURL = getPageURL + "." + RESULTS_JSON + getRelativePath + getQueryParam + "&" + PARAM_RESULTS_OFFSET + "=" + resultSize + "&orderby=" + getSortDirVal + "&sort=" + getSortAscDesVal;
        var fetchAPIURLNew = getCategory ? fetchAPIURL + "&tags=" + getCategory : fetchAPIURL;
        return fetchAPIURLNew;
    }

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

    function buildResultItem(item, breadcrumb) {
        var shortDate = formatShortDate(item.formattedLastModifiedDate);
        var url = checkNull(item.url);
        var displayUrl = url;
        try {
            if (window.location.origin && url.indexOf("/") === 0) {
                displayUrl = window.location.origin + url;
            }
        } catch (e) { /* keep relative url */ }

        var html = "<li class='cmp-searchresult-item'>" +
            "<div class='cmp-searchresult-icon'>" + ARTICLE_ICON + "</div>" +
            "<div class='cmp-searchresult-content'>" +
                "<h3 class='cmp-searchresult-title'>" +
                    "<a class='cmp-searchresult-link' target='_blank' href='" + url + "'>" + checkNull(item.title) + "</a>" +
                "</h3>" +
                "<p class='cmp-searchresult-description'>" + checkNull(item.excerpt) + "</p>" +
                "<span class='cmp-searchresult-meta'>" +
                    "<span class='cmp-searchresult-date'>" + shortDate + "</span>" +
                    "<span class='cmp-searchresult-separator'>|</span>" +
                    "<span class='cmp-searchresult-url'>" + displayUrl + "</span>" +
                "</span>" +
            "</div>" +
        "</li>";
        return html;
    }

    function displayDataOnPage(resultData) {
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
            var breadcrumb = data[i].path.slice(1).replaceAll('/', ' > ');
            var fifthIndex = breadcrumb.indexOf(' > ', breadcrumb.indexOf(' > ', breadcrumb.indexOf(' > ', breadcrumb.indexOf(' > ') + 1) + 1) + 1) + 3;
            breadcrumb = breadcrumb.slice(fifthIndex);
            LIST_GROUP += buildResultItem(data[i], breadcrumb);
        }
        searchFieldListGroup.innerHTML = LIST_GROUP;
        var total = resultData.totalRecords;
        if(hasMore) {
            total = total + "+"
        }
        var format = totalRecords.getAttribute("data-cmp-format");
        if(dataCount === 0){
            searchResultEndMessage.style.display = "block";
            totalRecords.style.display = "none"
        } else {
            totalRecords.innerHTML = createResultsHeader(format, showCountVal, total);
        }
    }

    document.addEventListener("DOMContentLoaded", onDocumentReady);
})();
