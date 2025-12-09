/**
 * Table Component JavaScript
 * 
 * Server-Side Rendering Approach:
 * - Images are rendered server-side by the Core Image Component
 * - No client-side manipulation needed
 * - This file is kept minimal for future enhancements
 */
(function() {
    "use strict";

    /**
     * Initialize table components
     * Currently minimal as images are rendered server-side
     */
    function initTableComponents() {
        var tableComponents = document.querySelectorAll('.gu-table-wrapper');
        
        if (tableComponents.length > 0) {
            console.log('Table components loaded:', tableComponents.length);
            console.log('Images rendered server-side - no client-side processing needed');
        }
    }

})();

