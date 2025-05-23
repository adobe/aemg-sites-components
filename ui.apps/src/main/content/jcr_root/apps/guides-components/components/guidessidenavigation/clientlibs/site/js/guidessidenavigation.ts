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
/**
 * <span class="toc-list-item show-children">
 <span class="item-child-toggle hide-children"></span>
 <a href="/content/47-smonga/en/kb/category/submap.html" title="submap" aria-current="page" data-cmp-clickable="" class="cmp-guidesnavigation__item-link">submap</a>
 </span>
 */

interface GuidesNavigationItem {
    children: Array<GuidesNavigationItem>
    displayName: string
    outputPath: string
    active: boolean
    visible: boolean
}

class GuidesNavigation {
    selectedPath: string
    tokens: string[]
    limit: number
    loadMoreText: string
    categoryPath: string

    generatePath(prefix, suffix) {
        if (prefix) {
            return `${prefix}-${suffix}`
        }
        return `${suffix}`
    }

    static LOAD_MORE_TEXT_DEFAULT_VALUE: string = "load more...";
    static LIMIT_DEFAULT_VALUE: string = "1000";

    getLoadMoreButton() {
        const button = document.createElement('button')
        button.innerText = this.loadMoreText
        return button
    }

    handleExpand(chevron, container: HTMLElement, currPath: string, item: GuidesNavigationItem, tokenIndex: number = -1, incrementer: number) {
        let hasRenderedChildren = "true" === chevron.getAttribute("children-rendered")
        let ul;
        if (!hasRenderedChildren) {
            ul = this.renderLevel(item.children, tokenIndex, currPath, incrementer, 0)
            container.appendChild(ul)
            chevron.setAttribute("children-rendered", "true")
        } else {
            ul = container.querySelector(':scope > ul')
        }
        if (chevron.classList.contains('show-children')) {
            ul.classList.remove('show-children')
            chevron.classList.remove('show-children')

            chevron.classList.add('hide-children')
            ul.classList.add('hide-children')

        } else {
            chevron.classList.add('show-children')
            ul.classList.add('show-children')

            chevron.classList.remove('hide-children')
            ul.classList.remove('hide-children')
        }
    }

    getListItemContent(listItem: HTMLElement, item: GuidesNavigationItem, currPath: string, expandChildren: boolean, tokenIndex: number, incrementer: number) {
        const children = item.children
        const hasChildren = children.length > 0
        const container = document.createElement('span')
        const anchor = document.createElement('a')
        const chevron = document.createElement('span')
        const isSelected = (currPath === this.selectedPath)
        const isActive = item.active !== false
        container.classList.add('toc-list-item')
        const paddingDepth = 1.25 * incrementer;
        container.style.paddingLeft = `${paddingDepth}rem`;
        chevron.classList.add('item-child-toggle')
        chevron.setAttribute("children-rendered", "false")
        const outputPath = this.makeFullPath(item.outputPath, this.categoryPath);
        if (isActive) {
            anchor.setAttribute("href", outputPath);
        } else {
            anchor.style.cursor = "default";
        }
        anchor.setAttribute("title", item.displayName)
        anchor.innerText = item.displayName
        anchor.setAttribute("aria-current", "page")
        if (isSelected) {
            listItem.classList.add('cmp-nav-item-selected')
        }
        let subtree;
        if (expandChildren) {
            subtree = this.renderLevel(children, tokenIndex + 1, currPath, incrementer, 0)
            chevron.setAttribute("children-rendered", "true")
            chevron.classList.remove("hide-children")
            chevron.classList.add("show-children")
            subtree.classList.remove("hide-children")
            subtree.classList.add("show-children")
            listItem.classList.add("cmp-guidesnavigation__item--active")
        } else {
            listItem.classList.add("cmp-guidesnavigation__item--inactive")
        }

        if (hasChildren) {
            if (!expandChildren) {
                chevron.classList.add('hide-children')
            }
            chevron.addEventListener('click', () => {
                this.handleExpand(chevron, listItem, currPath, item, -1, incrementer)
            })
            container.appendChild(chevron)
        }
        container.appendChild(anchor)
        listItem.appendChild(container)
        if (subtree) {
            listItem.appendChild(subtree)
        }
    }

    doRenderLevel(ul: HTMLUListElement, offset: number, currIdx: string, children: Array<GuidesNavigationItem>, parentPath: string, idx: number, incrementer: number, button: HTMLButtonElement) {
        if (button) {
            ul.removeChild(button)
        }
        let idxMax = 0
        if (currIdx)
            idxMax = parseInt(currIdx) + 1;
        const end = Math.max(idxMax, Math.min(children.length, offset + this.limit))
        for (let i = offset; i < end; i++) {
            const expandChildren = idx > -1 ? i.toString() === currIdx : false
            const item = children[i]
            const currPath = this.generatePath(parentPath, i)
            const listItem = document.createElement("li")
            const isVisible = item.visible !== false
            this.getListItemContent(listItem, item, currPath, expandChildren, idx, incrementer + 1)
            listItem.classList.add(`cmp-guidesnavigation__item`)
            listItem.classList.add(`cmp-guidesnavigation__item-level-${incrementer}`)
            listItem.classList.add(`cmp-guidesnavigation__item-${item.children.length > 0 ? 'has-children' : 'no-children'}`)
            if (!isVisible) {
                listItem.style.display = 'none'
            }
            ul.appendChild(listItem)
        }
        const hasMore = end !== children.length;
        if (hasMore) {
            const button = this.getLoadMoreButton()
            const marginDepth = 1.25 * incrementer;
            button.style.marginLeft = `${marginDepth}rem`;
            button.addEventListener("click", () => {
                this.doRenderLevel(ul, end, currIdx, children, parentPath, idx, incrementer, button)
            })
            ul.appendChild(button)
        }
        return ul;
    }

    renderLevel(children: Array<GuidesNavigationItem>, idx: number, parentPath: string, incrementer: number, offset: number) {
        if (!children) {
            children = [];
        }
        const currIdx = this.tokens[idx]
        const ul = document.createElement("ul");
        ul.classList.add("cmp-guidesnavigation__group")
        this.doRenderLevel(ul, offset, currIdx, children, parentPath, idx, incrementer, null)

        return ul
    }

    makeFullPath(relUrl, baseUrl) {
        relUrl = relUrl || ''

        let baseParts = this.filePath(baseUrl).split('/'),
            relPath = this.filePath(relUrl),
            params = relUrl.substring(relPath.length),
            relParts = relPath.split('/')

        if(relParts.length > 1 || relParts[0]) {
            baseParts.pop()
            relParts.forEach(relPart => {
                if(relPart === '..') {
                    baseParts.pop()
                } else if(relPart !== '.') {
                    baseParts.push(relPart)
                }
            })
        }

        return `${baseParts.join('/')}${params}`
    }
    filePath(url) {
        let index;
        url = url || ''
        index = url.indexOf('?')
        if (index !== -1) {
            url = url.substring(0, index)
        }
        index = url.indexOf('#')
        if (index !== -1) {
            url = url.substring(0, index)
        }
        return url
    }

    removeExtension(path) {
        return path.substring(0, path.lastIndexOf('.')) || path
    }

    onDocumentReady() {
        const navigationParent = document.querySelector(".guides-navigation");
        if (navigationParent === null) {
            return;
        }
        try {
            const navData = JSON.parse(navigationParent.getAttribute("data-cmp-guides-side-nav-list"));
            const navDataIndex = JSON.parse(navigationParent.getAttribute("data-cmp-guides-side-nav-index"));
            const currentPageRelativeUrl = navigationParent.getAttribute("data-cmp-guides-current-page-relative-url") || "";
            let bookMark = window.location.hash.substring(1).split('?')[0];
            if(bookMark) {
                bookMark = '#' + bookMark;
            }
            const selectedPath = navDataIndex[currentPageRelativeUrl + ".html" + bookMark] || "";
            const renderSize = navigationParent.getAttribute("data-cmp-guides-side-nav-items-limit") || GuidesNavigation.LIMIT_DEFAULT_VALUE;
            const loadMoreText = navigationParent.getAttribute("data-cmp-guides-side-nav-load-more-text") || GuidesNavigation.LOAD_MORE_TEXT_DEFAULT_VALUE
            const categoryPath = navigationParent.getAttribute("data-cmp-guides-side-nav-category-path");
            this.tokens = selectedPath.split('-')
            this.tokens = this.tokens.slice(1, this.tokens.length)
            this.limit = parseInt(renderSize)
            this.selectedPath = this.tokens.join('-')
            this.loadMoreText = loadMoreText
            this.categoryPath = categoryPath
            const ul = this.renderLevel(navData.children, 0, '', 0, 0)
            navigationParent.appendChild(ul)
        } catch (e) {

        }
    }

}

const guidesNavigation = new GuidesNavigation();
document.addEventListener("DOMContentLoaded", guidesNavigation.onDocumentReady.bind(guidesNavigation));