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
    private static ITEMS_PER_GROUP = 5;

    constructor() {
        this.protocol = window.location.protocol;
        this.host = window.location.host;
        this.pathName = window.location.pathname;
    }

    private safeText(value: string | null): string {
        return value ?? "";
    }

    private createChevronSVG(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("viewBox", "0 0 20 20");
        svg.setAttribute("fill", "none");
        svg.setAttribute("aria-hidden", "true");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M7.5 4.167L13.333 10 7.5 15.833");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "1.5");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        svg.appendChild(path);
        return svg;
    }

    displayCategory(resultData: string[]) {
        const categoryDiv = document.querySelector(".cmp-category-list-group");
        if (!categoryDiv || !resultData || resultData.length === 0) {
            return;
        }

        const listFragment = new DocumentFragment();
        const templateName = this.pathName.split("/")[2];

        for (let i = 0; i < resultData.length; i += CategoryList.ITEMS_PER_GROUP) {
            const categoryPath = resultData[i];
            const categoryTitle = resultData[i + 1];
            const categoryDescription = resultData[i + 2];
            const categoryThumbnail = resultData[i + 3];
            const firstChildPath = resultData[i + 4];
            const targetPath = firstChildPath || categoryPath;
            const categoryURL = `${this.protocol}//${this.host}${targetPath}.html`;

            if (!categoryPath.startsWith('/content/' + templateName)) {
                continue;
            }

            const card = document.createElement('a');
            card.classList.add('category-list-item');
            card.href = this.safeText(categoryURL);
            card.setAttribute('role', 'listitem');

            const iconWrapper = document.createElement('div');
            iconWrapper.classList.add('category-list-item-icon');
            if (categoryThumbnail) {
                const img = document.createElement('img');
                img.src = categoryThumbnail;
                img.alt = "";
                img.loading = "lazy";
                iconWrapper.appendChild(img);
            }

            const textWrapper = document.createElement('div');
            textWrapper.classList.add('category-list-item-text');

            const titleEl = document.createElement('span');
            titleEl.classList.add('category-list-item-title');
            titleEl.textContent = this.safeText(categoryTitle);
            textWrapper.appendChild(titleEl);

            if (categoryDescription) {
                const descEl = document.createElement('span');
                descEl.classList.add('category-list-item-description');
                descEl.textContent = this.safeText(categoryDescription);
                textWrapper.appendChild(descEl);
            }

            const chevron = document.createElement('span');
            chevron.classList.add('category-list-item-chevron');
            chevron.appendChild(this.createChevronSVG());

            card.appendChild(iconWrapper);
            card.appendChild(textWrapper);
            card.appendChild(chevron);
            listFragment.appendChild(card);
        }

        categoryDiv.appendChild(listFragment);
    }

    onDocumentReady() {
        const categoryParentDiv = document.querySelector(".category-list");
        if (!categoryParentDiv) {
            return;
        }
        const categoryList = categoryParentDiv.getAttribute("data-cmp-category-list").split(",");
        this.displayCategory(categoryList);
    }
}

const categoryList = new CategoryList();
document.addEventListener("DOMContentLoaded", categoryList.onDocumentReady.bind(categoryList));