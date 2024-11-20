/*******************************************************************************
 * Copyright 2022 Adobe Systems Incorporated
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
class CategoryList {
    private protocol: string;
    private host: string;
    private pathName: string;
    constructor() {
        this.protocol = window.location.protocol;
        this.host = window.location.host;
        this.pathName = window.location.pathname;
    }

    checkNull(inputValue) {
        const value = "";
        if (inputValue === null) {
            return value;
        } else {
            return inputValue;
        }
    }

    displayCategory(resultData) {
        const categoryDiv = document.querySelector(".cmp-category-list-group");
        const listFragment = new DocumentFragment();

        if(resultData == null || resultData.length === 0) {
            return;
        }

        resultData.forEach((categoryPath, index) => {
            if (index % 3 === 0) {
                const categoryTitle = resultData[index + 1];
                const categoryTumbnail = resultData[index + 2];
                const categoryURL = this.protocol + '//' + this.host + categoryPath + '.html';
                const templateName = this.pathName.split("/")[2];
                if (categoryPath.startsWith('/content/' + templateName)) {
                    const listItem = document.createElement('div');
                    listItem.classList.add('category-list-item');
                    const imageContainer = document.createElement('div');
                    imageContainer.classList.add('category-list-item-image-container');
                    imageContainer.style.backgroundImage = `url('${categoryTumbnail}')`
                    const titleElement = document.createElement('span');
                    titleElement.classList.add('category-list-item-title');

                    const linkElement = document.createElement('a');
                    linkElement.classList.add('category-list-item-link');
                    linkElement.target = '_blank';
                    linkElement.rel = 'noopener noreferrer';
                    linkElement.href = this.checkNull(categoryURL);
                    linkElement.textContent = this.checkNull(categoryTitle);

                    titleElement.appendChild(linkElement);
                    listItem.appendChild(imageContainer);
                    listItem.appendChild(titleElement);
                    listFragment.appendChild(listItem);
                }
            }
        });


        categoryDiv.appendChild(listFragment);
    }

    onDocumentReady() {
        const categoryParentDiv = document.querySelector(".category-list");
        if(categoryParentDiv === null) {
            return;
        }
        const categoryList = categoryParentDiv.getAttribute("data-cmp-category-list").split(",");
        this.displayCategory(categoryList);
    }
}

const categoryList = new CategoryList();
document.addEventListener("DOMContentLoaded", categoryList.onDocumentReady.bind(categoryList));