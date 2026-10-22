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
interface CategoryItem {
    path: string;
    title: string;
    description: string;
    thumbnail: string;
    redirectPath: string;
}

class CategoryList {
    private protocol: string;
    private host: string;

    constructor() {
        this.protocol = window.location.protocol;
        this.host = window.location.host;
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

    displayCategory(items: CategoryItem[]) {
        const categoryDiv = document.querySelector(".cmp-category-list-group");
        if (!categoryDiv || !items || items.length === 0) {
            return;
        }

        const listFragment = new DocumentFragment();

        for (const item of items) {
            const targetPath = item.redirectPath || item.path;
            const categoryURL = `${this.protocol}//${this.host}${targetPath}.html`;

            const card = document.createElement('a');
            card.classList.add('category-list-item');
            card.href = categoryURL;
            card.setAttribute('role', 'listitem');

            const iconWrapper = document.createElement('div');
            iconWrapper.classList.add('category-list-item-icon');
            if (item.thumbnail) {
                const img = document.createElement('img');
                img.src = item.thumbnail;
                img.alt = "";
                img.loading = "lazy";
                iconWrapper.appendChild(img);
            }

            const textWrapper = document.createElement('div');
            textWrapper.classList.add('category-list-item-text');

            const titleEl = document.createElement('span');
            titleEl.classList.add('category-list-item-title');
            titleEl.textContent = item.title ?? "";
            textWrapper.appendChild(titleEl);

            if (item.description) {
                const descEl = document.createElement('span');
                descEl.classList.add('category-list-item-description');
                descEl.textContent = item.description;
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
        const rawData = categoryParentDiv.getAttribute("data-cmp-category-list");
        if (!rawData) {
            return;
        }
        try {
            const items: CategoryItem[] = JSON.parse(rawData);
            this.displayCategory(items);
        } catch (e) {
            console.error("Failed to parse category list data", e);
        }
    }
}

const categoryList = new CategoryList();
document.addEventListener("DOMContentLoaded", categoryList.onDocumentReady.bind(categoryList));