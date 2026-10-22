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
interface TocListItem {
    url: string;
    title: string;
    thumbnail: string;
    active: boolean;
}

class TocList {
    private createDocumentSVG(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("aria-hidden", "true");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M9 13h6M9 17h6");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "1.5");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        svg.appendChild(path);
        return svg;
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

    displayTocList(tocListGroup: Element | null, items: TocListItem[]) {
        if (!tocListGroup || !items || items.length === 0) {
            return;
        }

        const listFragment = new DocumentFragment();

        for (const item of items) {
            const card = document.createElement('a');
            card.classList.add('toc-list-card');
            if (item.active !== false && item.url) {
                card.href = item.url;
            } else {
                card.style.cursor = 'default';
            }
            card.setAttribute('role', 'listitem');

            const iconWrapper = document.createElement('div');
            iconWrapper.classList.add('toc-list-card-icon');
            if (item.thumbnail) {
                const img = document.createElement('img');
                img.alt = "";
                img.loading = "lazy";
                img.addEventListener('error', () => img.replaceWith(this.createDocumentSVG()), { once: true });
                img.src = item.thumbnail;
                iconWrapper.appendChild(img);
            } else {
                iconWrapper.appendChild(this.createDocumentSVG());
            }

            const textWrapper = document.createElement('div');
            textWrapper.classList.add('toc-list-card-text');

            const titleEl = document.createElement('span');
            titleEl.classList.add('toc-list-card-title');
            titleEl.textContent = item.title ?? "";
            textWrapper.appendChild(titleEl);

            const chevron = document.createElement('span');
            chevron.classList.add('toc-list-card-chevron');
            chevron.appendChild(this.createChevronSVG());

            card.appendChild(iconWrapper);
            card.appendChild(textWrapper);
            card.appendChild(chevron);
            listFragment.appendChild(card);
        }

        tocListGroup.appendChild(listFragment);
    }

    onDocumentReady() {
        document.querySelectorAll(".toc-list").forEach((tocListElement) => {
            const rawData = tocListElement.getAttribute("data-cmp-toc-list");
            if (!rawData) {
                return;
            }
            try {
                const items: TocListItem[] = JSON.parse(rawData);
                if (Array.isArray(items)) {
                    this.displayTocList(tocListElement.querySelector(".cmp-toc-list-group"), items);
                }
            } catch (e) {
                console.error("Failed to parse TOC list data", e);
            }
        });
    }
}

const tocList = new TocList();
document.addEventListener("DOMContentLoaded", tocList.onDocumentReady.bind(tocList));
