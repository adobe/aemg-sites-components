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

class GuidesNavigation {
    selectedPath: string
    tokens: string[]
    limit: number
    loadMoreText: string
    generatePath(prefix, suffix) {
        if(prefix) {
            return `${prefix}-${suffix}`
        }
        return `${suffix}`
    }

    getLoadMoreButton() {
        const button = document.createElement('button')
        button.innerText = this.loadMoreText
        return button
    }

    handleExpand(chevron, container:HTMLElement, currPath, item, tokenIndex = -1, incrementer: number) {
        let hasRenderedChildren = "true" === chevron.getAttribute("children-rendered")
        let ul;
        if(!hasRenderedChildren) {
            ul = this.renderLevel(item.children, tokenIndex, currPath, incrementer, 0)
            container.appendChild(ul)
            chevron.setAttribute("children-rendered", "true")
        } else {
            ul = container.querySelector(':scope > ul')
        }
        if(chevron.classList.contains('show-children')) {
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

    getListItemContent(listItem: HTMLElement, item: {children: Array<any>, displayName: string, outputPath: string, active: boolean},  currPath: string, expandChildren: boolean, tokenIndex: number, incrementer: number) {
        const hasChildren = item.children.length > 0
        const container = document.createElement('span')
        const anchor = document.createElement('a')
        const chevron = document.createElement('span')
        const isSelected = (currPath === this.selectedPath)
        const isActive = item.active !== false
        container.classList.add('toc-list-item')
        const paddingDepth = 1.25*incrementer;
        container.style.paddingLeft = `${paddingDepth}rem`;
        chevron.classList.add('item-child-toggle')
        chevron.setAttribute("children-rendered", "false")
        if(isActive) {
            anchor.setAttribute("href", item.outputPath + ".html")
        } else {
            anchor.style.cursor = "default";
        }
        anchor.setAttribute("title", item.displayName)
        anchor.innerText = item.displayName
        anchor.setAttribute("aria-current", "page")
        if(isSelected) {
            listItem.classList.add('cmp-nav-item-selected')
        }
        let subtree;
        if(expandChildren) {
            subtree = this.renderLevel(item.children, tokenIndex+1, currPath, incrementer, 0)
            chevron.setAttribute("children-rendered", "true")
            chevron.classList.remove("hide-children")
            chevron.classList.add("show-children")
            subtree.classList.remove("hide-children")
            subtree.classList.add("show-children")
            listItem.classList.add("cmp-guidesnavigation__item--active")
        } else {
            listItem.classList.add("cmp-guidesnavigation__item--inactive")
        }

        if(hasChildren) {
            if(!expandChildren) {
                chevron.classList.add('hide-children')
            }
            chevron.addEventListener('click', () => {
                this.handleExpand(chevron, listItem, currPath, item, -1, incrementer)
            })
            container.appendChild(chevron)
        }
        container.appendChild(anchor)
        listItem.appendChild(container)
        if(subtree) {
            listItem.appendChild(subtree)
        }
    }

    doRenderLevel(ul, offset, currIdx, children, parentPath, idx, incrementer, button) {
        if(button) {
            ul.removeChild(button)
        }
        let idxMax = 0
        if(currIdx)
            idxMax = parseInt(currIdx) + 1;
        const end = Math.max(idxMax, Math.min(children.length, offset + this.limit))
        for(let i=offset;i<end;i++) {
            const expandChildren = idx > -1 ? i.toString() === currIdx : false
            const item = children[i]
            const currPath = this.generatePath(parentPath, i)
            const listItem = document.createElement("li")
            const isVisible = item.visible !== false
            this.getListItemContent(listItem, item, currPath, expandChildren, idx, incrementer+1)
            listItem.classList.add(`cmp-guidesnavigation__item`)
            listItem.classList.add(`cmp-guidesnavigation__item-level-${incrementer}`)
            listItem.classList.add(`cmp-guidesnavigation__item-${item.children.length > 0 ? 'has-children': 'no-children'}`)
            if(!isVisible) {
                listItem.style.display = 'none'
            }
            ul.appendChild(listItem)
        }
        const hasMore = end !== children.length;
        if(hasMore) {
            const button = this.getLoadMoreButton()
            const marginDepth = 1.25*incrementer;
            button.style.marginLeft = `${marginDepth}rem`;
            button.addEventListener("click", () => {
                this.doRenderLevel(ul, end, currIdx, children, parentPath, idx, incrementer, button)
            })
            ul.appendChild(button)
        }
        return ul;
    }

    renderLevel(children: Array<any>, idx: number, parentPath: string, incrementer: number, offset: number) {
        if(!children) {
            children = [];
        }
        const currIdx = this.tokens[idx]
        const ul = document.createElement("ul");
        ul.classList.add("cmp-guidesnavigation__group")
        this.doRenderLevel(ul, offset, currIdx, children, parentPath, idx, incrementer, null)
        
        return ul
    }

    onDocumentReady() {
        const navigationParent = document.querySelector(".guides-navigation");
        if(navigationParent === null) {
            return;
        }
        try {
            const navData = JSON.parse(navigationParent.getAttribute("data-cmp-guides-side-nav-list"));
            const selectedPath = navigationParent.getAttribute("data-cmp-guides-side-nav-current-index");
            const renderSize = navigationParent.getAttribute("data-cmp-guides-side-nav-items-limit") || "1000";
            const loadMoreText = navigationParent.getAttribute("data-cmp-guides-side-nav-load-more-text") || "load more...";
            this.tokens = selectedPath.split('-')
            this.tokens = this.tokens.slice(1, this.tokens.length)
            this.limit = parseInt(renderSize) || 1000
            this.selectedPath = this.tokens.join('-')
            this.loadMoreText = loadMoreText
            const ul = this.renderLevel(navData.children, 0, '', 0, 0)
            navigationParent.appendChild(ul)
        } catch(e) {

        }
    }

}
const guidesNavigation = new GuidesNavigation();
document.addEventListener("DOMContentLoaded", guidesNavigation.onDocumentReady.bind(guidesNavigation));