/**
 * Related Links Handler
 * 
 * This script finds all anchor links within elements having the class 'related-links'
 * and appends them to the element with class 'cmp-related-articles__list' using document fragments.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Find all elements with class 'related-links'
    const relatedLinksContainers = document.querySelectorAll('.related-links');
    
    // Find the target container where links will be appended
    const targetContainer = document.querySelectorAll('.cmp-related-articles__list');

    // If target container doesn't exist, exit
    if (!targetContainer.length) {
        console.warn('Target container .cmp-related-articles__list not found');
        return;
    }

    if(!relatedLinksContainers.length) {
        targetContainer.forEach(t => {
            const relatedArticles = t.closest('.relatedarticles');
            relatedArticles.style.display = "none";
        });
        
        console.warn('no related articels found');
        return;
    }

    // Create a document fragment to hold all the new elements
    const fragment = document.createDocumentFragment();

    // Process each related-links container
    relatedLinksContainers.forEach(function (container) {
        // Find all anchor links within the container
        const links = container.querySelectorAll('a.link');

        // Process each link
        links.forEach(function (link) {
            // Create a new list item
            const listItem = document.createElement('li');
            listItem.className = 'cmp-related-articles__item';

            if(link.href) {
                // Clone the link to avoid removing it from the original location
                const clonedLink = link.cloneNode(true);
                clonedLink.className = 'cmp-related-articles__link';

                // Append the cloned link to the list item
                listItem.appendChild(clonedLink);

                // Append the list item to the fragment
                fragment.appendChild(listItem);
            }
        });
    });

    // Append the fragment to the target container (single DOM operation)
    for(let i = 0; i<targetContainer.length; i++) {
        const fragClone = fragment.cloneNode(true);
        targetContainer[i].appendChild(fragClone);
    }
});
