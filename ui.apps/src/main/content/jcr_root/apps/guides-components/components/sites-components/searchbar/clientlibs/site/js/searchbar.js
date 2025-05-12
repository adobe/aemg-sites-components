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

    function onDocumentReady() {
        handleInputChange();
        window.onload = function() {
            fillSearchText()
        };
        clearSearchBar();
    }
    function clearSearchBar() {
        let clearIcon = document.querySelectorAll('.cmp-search-bar__clear-icon');
        if(clearIcon === null){
            return;
        }
        clearIcon.forEach((icon) => {
            icon.addEventListener('click', function (){
                let input = icon.previousElementSibling;
                input.value = ''
            })
        })

    }

    function fillSearchText() {
        let params = new URLSearchParams(document.location.search);
        let fullText = params.get("fulltext");
        let searchInputs = document.querySelectorAll('.cmp-search-bar__input');
        searchInputs.forEach((searchInput)=>{
            searchInput.value = fullText;
            toggleClearButton(searchInput);
            console.log(searchInput)
        })
    }

    function handleInputChange() {
        let searchInputs = document.querySelectorAll('.cmp-search-bar__input');
        searchInputs.forEach((searchInput)=>{
            searchInput.addEventListener('input', function() {
                // Call the function to update clear button visibility
                // let searchInput = document.querySelector('.cmp-search-bar__input');
                // console.log("Changed:", searchInput.value);
                toggleClearButton(searchInput);
            });

            let clearButton = searchInput.nextElementSibling;
            clearButton.addEventListener('click', function() {
                // searchInput = document.querySelector('.cmp-search-bar__input');
                // Clear the input value
                searchInput.value = '';
                // Hide the clear button
                clearButton.style.display = 'none';
            });
        })
    }

    function toggleClearButton (searchInput) {
        // let searchInput = document.querySelector('.cmp-search-bar__input');
        let clearButton = searchInput.nextElementSibling;
        if (searchInput.value !== '') {
            // If input has a value, show the clear button
            clearButton.style.display = 'block';
        } else {
            // If input is empty, hide the clear button
            clearButton.style.display = 'none';
        }
    }

    document.addEventListener("DOMContentLoaded", onDocumentReady);
})();
