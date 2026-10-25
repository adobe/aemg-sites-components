/*
 *  Copyright 2022 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

document.addEventListener("DOMContentLoaded", function () {
    var searchBars = document.querySelectorAll(".cmp-search-bar");

    searchBars.forEach(function (searchBar) {
        var clearIcon = searchBar.querySelector(".cmp-search-bar__clear-icon");
        var sendIcon = searchBar.querySelector(".cmp-search-bar__send-icon");
        var searchInput = searchBar.querySelector(".cmp-search-bar__input") as HTMLInputElement;
        var searchForm = searchBar.querySelector(".cmp-search-bar__form") as HTMLFormElement;

        if (clearIcon && searchInput) {
            clearIcon.addEventListener("click", function () {
                searchInput.value = "";
                searchInput.focus();
            });
        }

        if (sendIcon && searchForm) {
            sendIcon.addEventListener("mousedown", function (e) {
                e.preventDefault();
                if (searchInput && searchInput.value.trim()) {
                    searchForm.submit();
                }
            });
        }
    });
});