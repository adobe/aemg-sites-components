document.addEventListener("DOMContentLoaded", function () {
    const dropdownContainer = document.querySelector(".tag-filter .dropdown__container");
    const productCards = document.querySelectorAll(".gu-product-card");
    const noResultsMessage = document.querySelector(".gu-product-no-results");
    const paginationContainer = document.querySelector(".gu-product-pagination");
    const prevBtn = document.querySelector(".gu-pagination-prev");
    const nextBtn = document.querySelector(".gu-pagination-next");
    const currentSpan = document.querySelector(".gu-pagination-current");
    const totalSpan = document.querySelector(".gu-pagination-total");

    if (!dropdownContainer || productCards.length === 0) {
        return;
    }

    // Pagination configuration/state
    window.__productCardPagination__ = {
        PAGE_SIZE: 6,
        currentPage: 1,
        // Multi-select: maintain a Set of selected tags
        selectedTags: new Set(),
        nodes: {
            paginationContainer,
            prevBtn,
            nextBtn,
            currentSpan,
            totalSpan,
            noResultsMessage
        }
    };

    attachDropdownEvents();
    attachPaginationEvents(productCards);

    // Initial render (empty selection = all)
    paginatedFilterProducts(new Set(), productCards);
});

function attachDropdownEvents() {
    const dropdownContainer = document.querySelector(".tag-filter .dropdown__container");
    const dropdownList = document.querySelector(".tag-filter .dropdown__list");
    const dropdownValue = document.querySelector(".tag-filter .dropdown__value");
    const productCards = document.querySelectorAll(".gu-product-card");
    const noResultsMessage = document.querySelector(".gu-product-no-results");
    
    dropdownContainer.addEventListener("click", function(event) {
        event.stopPropagation();
        dropdownList.classList.toggle("hidden");
        updateDropdownIcon();
    });
    
    dropdownList.addEventListener("click", function(event) {
        const itemWrapper = event.target.closest(".dropdown__item-wrapper");
        // If clicking inside wrapper (icon/space), resolve the li within it; otherwise find nearest li
        const selectedItem = itemWrapper
            ? itemWrapper.querySelector(".dropdown__item")
            : event.target.closest(".dropdown__item");

        if (!selectedItem) {
            return; // Click outside selectable items
        }

        const tagValue = selectedItem.getAttribute("data-value");
        const state = window.__productCardPagination__;
        if (!state) return;

        // Handle "All" shortcut: clear selection and close
        if (tagValue === "all") {
            state.selectedTags.clear();
            // reset UI selection states
            document.querySelectorAll(".tag-filter .dropdown__item-wrapper").forEach(function(wrapper) {
                wrapper.removeAttribute("style");
                wrapper.classList.remove("active");
            });
            dropdownValue.textContent = "All Products";
            dropdownList.classList.add("hidden");
            updateDropdownIcon();
            paginatedFilterProducts(state.selectedTags, productCards);
            return;
        }

        // Toggle selection for clicked tag
        const normalized = (tagValue || "").trim();
        const itemWrapperSvg = itemWrapper.querySelector("svg path");
        if (normalized.length > 0) {
            if (state.selectedTags.has(normalized)) {
                state.selectedTags.delete(normalized);
                if (itemWrapper) {
                    itemWrapper.removeAttribute("style");
                    itemWrapper.classList.remove("active");
                    itemWrapperSvg.setAttribute("fill", "var(--version-unselected-color)");
                }
            } else {
                state.selectedTags.add(normalized);
                if (itemWrapper) {
                    itemWrapper.classList.add("active");
                    itemWrapper.setAttribute("style", "background: var(--accent-light-blue)");
                    itemWrapperSvg.setAttribute("fill", "var(--primary-color) !important");
                }
            }
        }

        // Update dropdown label (show count or joined names)
        updateDropdownLabel(dropdownValue, state.selectedTags);

        // Keep the list open to allow multi-select; just update filtering
        updateDropdownIcon();
        paginatedFilterProducts(state.selectedTags, productCards);
    });
    
    document.addEventListener("click", function(event) {
        if (!event.target.closest(".tag-filter")) {
            dropdownList.classList.add("hidden");
            updateDropdownIcon();
        }
    });
}

function updateDropdownIcon() {
    const dropdownList = document.querySelector(".tag-filter .dropdown__list");
    const dropdownIcon = document.querySelector(".tag-filter .dropdown__button svg path");
    const dropdown__value = document.querySelector(".tag-filter .dropdown__value");
    const isHidden = dropdownList.classList.contains("hidden");
    
    const iconPath = isHidden
        ? "M14.7194 7.27931C14.5417 7.10041 14.3012 7 14.0506 7C13.8 7 13.5596 7.10041 13.3818 7.27931L9.97628 10.6796L6.61816 7.27931C6.44042 7.10041 6.19999 7 5.94938 7C5.69877 7 5.45834 7.10041 5.2806 7.27931C5.19169 7.36861 5.12112 7.47484 5.07296 7.59189C5.0248 7.70894 5 7.83448 5 7.96129C5 8.08809 5.0248 8.21363 5.07296 8.33068C5.12112 8.44773 5.19169 8.55396 5.2806 8.64326L9.30276 12.7159C9.39095 12.8059 9.49587 12.8774 9.61147 12.9261C9.72706 12.9749 9.85105 13 9.97628 13C10.1015 13 10.2255 12.9749 10.3411 12.9261C10.4567 12.8774 10.5616 12.8059 10.6498 12.7159L14.7194 8.64326C14.8083 8.55396 14.8789 8.44773 14.927 8.33068C14.9752 8.21363 15 8.08809 15 7.96129C15 7.83448 14.9752 7.70894 14.927 7.59189C14.8789 7.47484 14.8083 7.36861 14.7194 7.27931Z"
        : "M14.7194 12.7207C14.5416 12.8996 14.3012 13 14.0506 13C13.8 13 13.5595 12.8996 13.3818 12.7207L9.97625 9.32043L6.61813 12.7207C6.44039 12.8996 6.19996 13 5.94935 13C5.69874 13 5.45831 12.8996 5.28057 12.7207C5.19166 12.6314 5.12109 12.5252 5.07292 12.4081C5.02476 12.2911 4.99997 12.1655 4.99997 12.0387C4.99997 11.9119 5.02476 11.7864 5.07292 11.6693C5.12109 11.5523 5.19166 11.446 5.28057 11.3567L9.30273 7.28412C9.39092 7.19409 9.49584 7.12264 9.61143 7.07387C9.72703 7.02511 9.85102 7 9.97625 7C10.1015 7 10.2255 7.02511 10.3411 7.07387C10.4567 7.12264 10.5616 7.19409 10.6498 7.28412L14.7194 11.3567C14.8083 11.446 14.8789 11.5523 14.927 11.6693C14.9752 11.7864 15 11.9119 15 12.0387C15 12.1655 14.9752 12.2911 14.927 12.4081C14.8789 12.5252 14.8083 12.6314 14.7194 12.7207Z";
    
    dropdownIcon.setAttribute("d", iconPath);
    dropdownIcon.setAttribute("fill", "var(--version-unselected-color)");
    dropdown__value.setAttribute("style", "color: var(--version-unselected-color)");

    if (!isHidden) {
        dropdownIcon.setAttribute("fill", "var(--primary-color) !important");
        dropdown__value.setAttribute("style", "color: var(--version-selected-color)");
        
    }
}

function updateDropdownLabel(dropdownValueNode, selectedTagsSet) {
    if (!dropdownValueNode) return;
    if (!(selectedTagsSet && selectedTagsSet.size > 0)) {
        dropdownValueNode.textContent = "All Products";
        return;
    }
    const tags = Array.from(selectedTagsSet);
    if (tags.length <= 2) {
        dropdownValueNode.textContent = tags.join(", ");
    } else {
        dropdownValueNode.textContent = tags.slice(0, 2).join(", ") + " +" + (tags.length - 2);
    }
}

// New: Pagination + Filtering integration
function paginatedFilterProducts(selectedTags, productCards) {
    const state = window.__productCardPagination__;
    if (!state) return;

    // Normalize to a stable key for comparison
    const prevKey = Array.from(state.selectedTags || []).sort().join("||");
    const nextKey = Array.from(selectedTags || []).sort().join("||");

    // Reset to page 1 when filter changes
    if (prevKey !== nextKey) {
        state.currentPage = 1;
    }
    state.selectedTags = new Set(Array.from(selectedTags || []));

    const filtered = getFilteredCards(state.selectedTags, productCards);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / state.PAGE_SIZE));
    state.currentPage = clamp(state.currentPage, 1, totalPages);

    // Update cards visibility for current page
    showOnlyPage(filtered, productCards, state.currentPage, state.PAGE_SIZE);

    // Update UI elements (pagination + no results)
    updatePaginationUI(total, state.currentPage, totalPages);
}

function getFilteredCards(selectedTags, productCards) {
    const result = [];
    productCards.forEach(function(card) {
        const cardTags = card.getAttribute("data-tags");
        // No selection = show all
        if (!(selectedTags && selectedTags.size)) {
            result.push(card);
        } else if (cardTags) {
            const tags = cardTags.split(",").map(function(tag) { return tag.trim(); });
            // AND logic: card must include all selected tags
            const allSelectedPresent = Array.from(selectedTags).every(function(sel) { return tags.includes(sel); });
            if (allSelectedPresent) result.push(card);
        }
    });
    return result;
}

function showOnlyPage(filteredCards, allCards, page, pageSize) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const setToShow = new Set(filteredCards.slice(start, end));
    allCards.forEach(function(card) {
        if (setToShow.has(card)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

function updatePaginationUI(totalFiltered, currentPage, totalPages) {
    const state = window.__productCardPagination__;
    if (!state) return;
    const { paginationContainer, prevBtn, nextBtn, currentSpan, totalSpan, noResultsMessage } = state.nodes;

    // No results handling
    if (noResultsMessage) {
        if (totalFiltered === 0) {
            noResultsMessage.style.display = "block";
        } else {
            noResultsMessage.style.display = "none";
        }
    }

    // Hide pagination if no results or single page
    if (!paginationContainer) return;
    if (totalFiltered === 0 || totalPages <= 1) {
        paginationContainer.style.display = "none";
        return;
    }

    paginationContainer.style.display = "flex";
    if (currentSpan) currentSpan.textContent = String(currentPage);
    if (totalSpan) totalSpan.textContent = String(totalPages);

    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

function attachPaginationEvents(productCards) {
    const state = window.__productCardPagination__;
    if (!state) return;
    const { prevBtn, nextBtn } = state.nodes;

    if (prevBtn) {
        prevBtn.addEventListener("click", function() {
            const filtered = getFilteredCards(state.selectedTags, productCards);
            const totalPages = Math.max(1, Math.ceil(filtered.length / state.PAGE_SIZE));
            state.currentPage = clamp(state.currentPage - 1, 1, totalPages);
            showOnlyPage(filtered, productCards, state.currentPage, state.PAGE_SIZE);
            updatePaginationUI(filtered.length, state.currentPage, totalPages);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function() {
            const filtered = getFilteredCards(state.selectedTags, productCards);
            const totalPages = Math.max(1, Math.ceil(filtered.length / state.PAGE_SIZE));
            state.currentPage = clamp(state.currentPage + 1, 1, totalPages);
            showOnlyPage(filtered, productCards, state.currentPage, state.PAGE_SIZE);
            updatePaginationUI(filtered.length, state.currentPage, totalPages);
        });
    }
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
