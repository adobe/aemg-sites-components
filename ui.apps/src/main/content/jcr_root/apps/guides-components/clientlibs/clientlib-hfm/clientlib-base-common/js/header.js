$(document).ready(function () {
  $(".menu-tigger").on("click", function () {
    $(this).toggleClass("button-tigger");
    $(".hamburger-dropdown").toggleClass("res-menu");
  });

  // Mobile search functionality
  function initMobileSearch() {
    const isMobile = window.innerWidth <= 768;
    const searchField = $(".cmp-search__field");
    const hamburgerMenu = $(".gu-header__humberger");
    
    if (isMobile) {
      // Hide the existing search container on mobile
      searchField.hide();
      
      // Check if mobile search button already exists
      if ($(".mobile-search-btn").length === 0) {
        //if body has class guides-product-page then add mobile search button
        // Create mobile search button
        const mobileSearchBtn = $(`
          <button class="mobile-search-btn" aria-label="Search">
            <img src="/content/dam/guides/common-images/icons/search-icon.png" alt="Search Icon" />
          </button>
        `);
        
        // Insert the button before the hamburger menu
        if ($("body").hasClass("guides-product-page")) {
          hamburgerMenu.before(mobileSearchBtn);
        }
        
                  // Handle mobile search button click
          mobileSearchBtn.on("click", function() {
            if (searchField.is(":visible")) {
              // Hide search field and backdrop
              searchField.hide();
              $(".backdrop").hide();
            } else {
              // Show search field and backdrop
              searchField.show();
              $(".backdrop").show();
            }
          });
          
          // Use event delegation for backdrop click
          $(document).on("click", ".backdrop", function() {
            console.log("backdrop clicked");
            searchField.hide();
            $(".backdrop").hide();
          });
        
      }
    } else {
      // Show the existing search container on desktop
      searchField.show();
      // Remove mobile search button if it exists
      $(".mobile-search-btn").remove();
      $(".mobile-search-content").remove();
    }
  }
  
  // Initialize mobile search on page load
  initMobileSearch();
  
  // Re-initialize on window resize
  $(window).on("resize", function() {
    initMobileSearch();
  });
});