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

    if (isMobile && $("body").hasClass("guides-product-page")) {
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

          hamburgerMenu.before(mobileSearchBtn);
        
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
  function hideEmptySearchResults() {
    const searchResults = $('.cmp-search__results');
    if (searchResults.children().length === 0) {
      searchResults.css('display', 'none');
    } else {
      searchResults.css('display', 'block');
    }
  }

  hideEmptySearchResults();

  const searchResultsObserver = new MutationObserver(hideEmptySearchResults);
  
  const searchResults = $('.cmp-search__results')[0];
  if (searchResults) {
    searchResultsObserver.observe(searchResults, {
      childList: true, 
      subtree: true    
    });
  }
  
  // Initialize mobile search on page load
  initMobileSearch();
  
  // Re-initialize on window resize
  $(window).on("resize", function() {
    initMobileSearch();
  });
});

$(document).ready(function () {
  $('.gu-header__humberger').click(function () {
    const toolbar = $('.gu-toolbar_wrapper')

    if (toolbar.is(':visible')) {
      toolbar.hide();
    } else {
      toolbar.show(); 
    }
  });
});

