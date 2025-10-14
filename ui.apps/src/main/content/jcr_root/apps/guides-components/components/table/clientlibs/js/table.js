/**
 * Table Component JavaScript
 * 
 * Moves rendered Core Image Components from hidden containers
 * into their respective placeholder divs within the table.
 */
(function() {
    "use strict";

    /**
     * Move images from hidden containers into their placeholder divs
     * @param {HTMLElement} componentElement - The table wrapper element
     */
    function moveImagesIntoPlaceholders(componentElement) {
        var tableContent = componentElement.querySelector('.gu-table-content');
        if (!tableContent) {
            console.warn('Table content not found');
            return;
        }

        var imageContainers = componentElement.querySelectorAll('.gu-table-image-container');
        
        imageContainers.forEach(function(container) {
            var placeholderId = container.getAttribute('data-placeholder-id');
            
            if (placeholderId) {
                // Find the placeholder div in the table
                var placeholderDiv = tableContent.querySelector('div[data-placeholder-id="' + placeholderId + '"]');
                
                if (placeholderDiv) {
                    // Move all children (the rendered core image component) 
                    // from the hidden container to the placeholder div
                    while (container.firstChild) {
                        placeholderDiv.appendChild(container.firstChild);
                    }
                    
                    // Remove the now-empty container
                    container.remove();
                } else {
                    console.warn('Placeholder not found for ID:', placeholderId);
                }
            }
        });

        // Clean up the hidden images container if empty
        var imagesContainer = componentElement.querySelector('.gu-table-images');
        if (imagesContainer && !imagesContainer.hasChildNodes()) {
            imagesContainer.remove();
        }
    }

    /**
     * Initialize all table components on the page
     */
    function initTableComponents() {
        var tableComponents = document.querySelectorAll('.gu-table-wrapper');
        
        tableComponents.forEach(function(component) {
            moveImagesIntoPlaceholders(component);
        });
        
        console.log('Table components initialized:', tableComponents.length);
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTableComponents);
    } else {
        // DOM already loaded
        initTableComponents();
    }

    /**
     * Re-initialize when component is updated in AEM editor
     * This handles edit/preview mode updates
     */
    if (typeof Granite !== 'undefined' && Granite.author) {
        // Listen for component refresh events in AEM editor
        document.addEventListener('cq-layer-activated', function() {
            setTimeout(initTableComponents, 100);
        });
    }

})();

