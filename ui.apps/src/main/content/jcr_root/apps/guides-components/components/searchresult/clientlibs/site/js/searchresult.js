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
        '<rect width="24" height="24" rx="5" fill="#323232"/>' +
        '<g transform="translate(4,4)">' +
        '<path d="M7.9905 12.4218C7.80598 12.4283 7.6262 12.3627 7.48921 12.2389C7.22495 11.9469 7.22495 11.5021 7.48921 11.2101C7.62469 11.0833 7.80508 11.0156 7.99053 11.022C8.17961 11.0144 8.36324 11.0863 8.49694 11.2202C8.6266 11.3545 8.69627 11.5357 8.69004 11.7223C8.69994 11.9102 8.63437 12.0944 8.50788 12.2338C8.36901 12.3656 8.18158 12.4337 7.9905 12.4218Z" fill="#ffffff"/>' +
        '<path d="M8 15C4.13984 15 1 11.8602 1 8C1 4.13984 4.13984 1 8 1C11.8602 1 15 4.13984 15 8C15 11.8602 11.8602 15 8 15ZM8 2.2C4.80156 2.2 2.2 4.80156 2.2 8C2.2 11.1984 4.80156 13.8 8 13.8C11.1984 13.8 13.8 11.1984 13.8 8C13.8 4.80156 11.1984 2.2 8 2.2Z" fill="#ffffff"/>' +
        '<path d="M7.99382 10.1641C7.66257 10.1641 7.39382 9.89531 7.39382 9.56407C7.39382 8.7461 7.45007 8.19297 8.22507 7.41797C8.85319 6.78906 8.95944 6.53672 8.95944 6.09687C8.95944 5.92891 8.90631 5.09063 7.86023 5.09063C6.76804 5.09063 6.65163 6.01562 6.63913 6.20078C6.61803 6.53126 6.32507 6.77735 6.00163 6.76016C5.67038 6.73829 5.42038 6.45313 5.44225 6.12266C5.49303 5.35079 6.06335 3.89062 7.86022 3.89062C9.36959 3.89062 10.1594 5.00078 10.1594 6.09687C10.1594 7.01171 9.79381 7.54531 9.0735 8.2664C8.61256 8.72734 8.59381 8.91562 8.59381 9.56406C8.59381 9.89531 8.32507 10.1641 7.99382 10.1641Z" fill="#ffffff"/>' +
        '</g>' +
        '</svg>';

    var SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var getCategory = new Array();
    var resultSize = 0;
    var showCountVal = 0;
    var LIST_GROUP;
    var NUMBER_OF_RECORDS;
    var seenUrls = {};

    var getSortAscDesVal = getSortingVal($getSortAscDesVal) || "asc";
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
            getSortDirVal = getSortingVal($getSortDirVal);
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
        displayUrl = displayUrl.replace(/\/content\/[^/]+/, "/coldfusion");

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
            seenUrls = {};
        }
        var data = resultData.data;
        data = data.filter(function(item) {
            var key = item.title;
            if (seenUrls[key]) return false;
            seenUrls[key] = true;
            return true;
        });
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

    window.addEventListener("askai:search", function(e) {
        getQueryParam = "?fulltext=" + encodeURIComponent(e.detail.fulltext);
        resultSize = 0;
        showCountVal = 0;
        LIST_GROUP = "";
        getCategory = [];
        fetchDataNew();
    });

    document.addEventListener("DOMContentLoaded", onDocumentReady);
})();
