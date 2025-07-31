$(document).ready(function () {
  // Store search results globally
  var globalSearchResults = [];
  var currentPage = 1;
  var itemsPerPage = 10;
  var totalPages = 0;

  function serialize(form) {
    if (!form || !form.elements) return "";
    return $(form)
      .find("input, select, textarea")
      .not("[disabled]")
      .map(function () {
        return this.name
          ? `${encodeURIComponent(this.name)}=${encodeURIComponent(this.value)}`
          : null;
      })
      .get()
      .join("&");
  }

  function adjustTopicWidth() {
    // Check if we're on search page
    const templateName = $("meta[name='template']").attr("content");
    if (!templateName || !templateName.includes("search-page")) return;

    // Get current window width
    var windowWidth = window.innerWidth;

    $(
      ".toolbar-hitech,.toolbar-wrapper,.toolbar-container,.topic__container,.topic__updated,.toolsection__left,.toolsection__right"
    ).css({
      display: "none",
    });

    $(".breadcrumb").css({
      "margin-top": "5.5rem",
      "padding-left": "1rem",
      opacity: "100%",
    });
    $(".gu-custom-container").css({
      "margin-top": "0.5rem",
    });
    // Medium desktop/laptop
    if (windowWidth >= 1024) {
      $(".col-3grid").css({
        display: "none",
      });
      $(".col-9grid").css({
        flex: "0 0 75%",
        width: "60rem !important",
      });
      $(".gu-custom-container").css({
        display: "flex",
        "justify-content": "center",
        border: "none",
      });
      $(".cmp-search__results").css({
        color: "#000",
      });

      $("#section-topic").css({
        "margin-left": "auto",
        "margin-right": "auto",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "space-between",
      });
      $(".gu-custom-container").css({
        "margin-bottom": "1.5rem",
      });
      $(".col-9grid-components").css({
        width: "100%",
      });
    } else {
      $(".toolbar.below-updated.mobile").css({
        display: "none",
      });
    }
  }

  // Run on page load
  adjustTopicWidth();

  // Run on window resize
  $(window).on("resize", function () {
    adjustTopicWidth();
  });

  function populateItems(response) {
    // Store search results globally
    globalSearchResults = response.data || [];

    var $topicDiv = $(".topic");
    var $innerDiv = $topicDiv.find("div").first();
    var $searchContainer = $innerDiv.children("#search-container");

    if (!$searchContainer.length) {
      $searchContainer = $('<div id="search-container"></div>').appendTo(
        $innerDiv
      );
    }

    // Clear previous content
    $searchContainer.empty();

    // Remove any existing pagination
    $("#section-topic .pagination-container").remove();

    // Get search query
    var searchQuery = $(".cmp-search__input").val();

    // Add results header
    var resultsHeader = $('<h2 class="search-results-header"></h2>').text(
      (response.totalRecords || 0) + ' Results found for "' + searchQuery + '"'
    );

    $searchContainer.append(resultsHeader);

    // Check if there are results
    if (!response.data || response.data.length === 0) {
      // No results found
      var noResultsMessage = $('<div class="no-results-message"></div>').html(
        "<p>No results match your search criteria.</p>" +
          "<p>Suggestions:</p>" +
          "<ul>" +
          "<li>Check your spelling</li>" +
          "<li>Try more general keywords</li>" +
          "<li>Try different keywords</li>" +
          "</ul>"
      );

      $searchContainer.append(noResultsMessage);
    } else {
      // Calculate pagination values
      totalPages = Math.ceil(response.totalRecords / itemsPerPage);
	  let params = new URLSearchParams(window.location.search);
      var startIndex = (currentPage - 1) * itemsPerPage;
      var endIndex = Math.min(startIndex + itemsPerPage, response.totalRecords);
      var currentPageItems = response.data; //data.slice(startIndex, endIndex);
	
		let searchFormAction = $("form.cmp-search__form").attr("action");
		let searchRoot = searchFormAction.substring(0, searchFormAction.indexOf(".aemsitesearchresults.json"));
        searchRoot = searchRoot.substring(0, searchRoot.lastIndexOf("/"));
                
      // Display results for current page
      var $ul = $(`<ul class="cmp-search-results">`);
      currentPageItems.forEach(function (item) {
			let li =  $(`<li class="cmp-search-result">`);
			let headerfacet	= $(`<div class="cmp-searchresult-header">`);		
			if(item.tags) {
              let tags = item.tags.slice(1,item.tags.length-1).split(",")  
			  for(let tag of tags){
				  headerfacet.append(`<span class="cmp-searchresult-tag">${tag}</span>`);
			  }
			}
			if(item.formattedLastModifiedDate) {
				headerfacet.append(`<span class="cmp-searchresult-date">${item.formattedLastModifiedDate}</span>`);
			}
			li.append(headerfacet);
			
			li.append($("<a>").attr("href", item.url).append(`<h3 class="cmp-searchresult-title">`).text(item.title));
			if(item.excerpt) {
				li.append(`<p class="cmp-searchresult-description">${item.excerpt}</p>`);
			}
			if(item.path) {	
                let searchResultRelativePath = item.path.substring(searchRoot.length+1);
                let parts = searchResultRelativePath.split('/');
				let breadcrumbs = $(`<div class="cmp-seaarchresult-breadcrumbs">`);
				for(let index in parts) {
                    let part = parts[index];
					breadcrumbs.append(`<span class="cmp-seaarchresult-breadcrumbs-step"><a href="${searchRoot + '/' + parts.slice(0,index).join('/').concat('/' + part + '.html')}">${part}</a></span>`);
				}
				li.append(breadcrumbs);
			}
			li.appendTo($ul);
      });

      $searchContainer.append($ul);

      // Add pagination if more than one page
      if (totalPages > 1) {
        // Create a container for pagination that will be appended to #section-topic
        var $paginationContainer = $(
          '<div class="pagination-container"></div>'
        );
        var $pagination = $('<div class="pagination"></div>');

        // Page numbers
        $pagination.append('<span class="page-text">Page</span>');
        var $pageNumber = $(
          '<span class="page-number">' + currentPage + "</span>"
        );
        $pagination.append($pageNumber);
        $pagination.append(
          '<span class="page-text">of ' + totalPages + "</span>"
        );

        // Previous page button
        var $prevButton = $('<span class="nav-arrow prev-page">&lt;</span>');
        if (currentPage === 1) {
          $prevButton.addClass("disabled");
        } else {
          $prevButton.on("click", function () {
            if (currentPage > 1) {
              //populateItems(globalSearchResults, currentPage - 1);
			  let form = $("form.cmp-search__form")[0];
			  generateItemList(form, event, currentPage--, itemsPerPage);
              // Scroll to the top of results
              $("html, body").animate(
                {
                  scrollTop: $topicDiv.offset().top - 100,
                },
                300
              );
            }
          });
        }
        $pagination.append($prevButton);

        // Next page button
        var $nextButton = $('<span class="nav-arrow next-page">&gt;</span>');
        if (currentPage === totalPages) {
          $nextButton.addClass("disabled");
        } else {
          $nextButton.on("click", function () {
            if (currentPage < totalPages) {
              //populateItems(globalSearchResults, currentPage + 1);
			  let form = $("form.cmp-search__form")[0];
			  generateItemList(form, event, currentPage++, itemsPerPage);
              // Scroll to the top of results
              $("html, body").animate(
                {
                  scrollTop: $topicDiv.offset().top - 100,
                },
                300
              );
            }
          });
        }
        $pagination.append($nextButton);

        // Append pagination to its container
        $paginationContainer.append($pagination);

        // Append pagination container to #section-topic instead of search container
        $("#section-topic").append($paginationContainer);
      }
    }
  }

  function generateItemList(form, event, numrec) {
    event.preventDefault();

    if (!form) return;
    //var url = `${form.action}?${serialize(form)}`;
	
	let query = $(".cmp-search__input").val();
	if(!query) {
		query = new URLSearchParams(window.location.search).get("input");
	}
	let params = new URLSearchParams();
	params.set("fulltext", query);
	params.set("resultsOffset", (currentPage-1) * itemsPerPage);
	params.set("resultsSize", numrec || itemsPerPage);
	params.set("orderby", "@jcr:content/jcr:score");
	params.set("sort", "desc");
	let url = new URL(form.action);
	url.search = params.toString();;
    $.getJSON(url.href)
      .done(function (data) {
        // Always call populateItems, even with empty data
        populateItems(data || []);
      })
      .fail(function (error) {
        // Show empty results on failure
        populateItems([], 1);
      });
  }

  function updateUrlParam() {
    const queryParameterValue = new URLSearchParams(window.location.search).get(
      "input"
    );
    if (queryParameterValue) {
      $(".cmp-search__input").val(queryParameterValue);
    }
  }

  function hasUrlParameter(param) {
    return new URLSearchParams(window.location.search).has(param);
  }

  // Ensure the topic div structure exists
  function ensureTopicDivExists() {
    if ($(".topic").length === 0) {
      const $topicDiv = $('<div class="topic"></div>');
      const $innerDiv = $("<div></div>");
      $topicDiv.append($innerDiv);

      // Find a good place to append the structure
      const $main = $("main");
      if ($main.length > 0) {
        $main.append($topicDiv);
      } else {
        $("body").append($topicDiv);
      }
    }
  }

  // Create a search bar at the top of #section-topic
  function createSearchBar() {
    // Check if we're on search page
    const templateName = $("meta[name='template']").attr("content");
    if (!templateName || !templateName.includes("search-page")) return;

    // Check if search bar already exists
    if ($(".custom-search-container").length > 0) return;

    // Create search container
    const $searchBarContainer = $(
      '<div class="custom-search-container"></div>'
    );

    // Create search form
    const $searchForm = $('<form class="custom-search-form"></form>');

    // Create search input field container
    const $searchFieldContainer = $('<div class="custom-search-field"></div>');

    // Create search icon
    const $searchIcon = $('<div class="custom-search-icon"></div>');

    // Create search input
    const $searchInput = $(
      '<input type="text" class="custom-search-input" placeholder="Search" autocomplete="off">'
    );

    // Create clear button
    const $clearButton = $(
      '<button type="button" class="custom-search-clear"><span class="custom-search-clear-icon">×</span></button>'
    );
    $clearButton.hide(); // Hide by default, will show only when there's input

    // Create suggestions container
    const $suggestionsContainer = $(
      '<div class="custom-search-suggestions"></div>'
    );

    // Set current search value if present in URL
    const queryParameterValue = new URLSearchParams(window.location.search).get(
      "input"
    );
    if (queryParameterValue) {
      $searchInput.val(queryParameterValue);
    }

    // Cache for search results to avoid repeated API calls
    let searchResultsCache = {};

    // Debounce function to limit API calls
    function debounce(func, delay) {
      let timeout;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
      };
    }

    // Handle clear button click
    $clearButton.on("click", function (e) {
      e.preventDefault();
      $searchInput.val("").focus();
      $clearButton.hide();
      $suggestionsContainer.empty().hide();
    });

    // Function to highlight search terms in text
    function highlightText(text, searchTerm) {
      if (!searchTerm) return text;

      // Create a case-insensitive regular expression from the search term
      const regex = new RegExp(
        `(${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
        "gi"
      );

      // Replace matches with highlighted version
      return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // Function to perform auto-search
    const performAutoSearch = debounce(function (searchTerm) {
      if (!searchTerm || searchTerm.length < 2) {
        $suggestionsContainer.empty().hide();
        return;
      }

      // Check cache first
      if (searchResultsCache[searchTerm]) {
        displaySuggestions(searchResultsCache[searchTerm], searchTerm);
        return;
      }

      // Get the form action URL for search
      const $form = $(".cmp-search__form");
      if (!$form.length) return;

      const url = `${$form[0].action}?fulltext=${encodeURIComponent(
        searchTerm
      )}`;

      // Fetch search results
      $.getJSON(url)
        .done(function (data) {
          // Cache the results
          searchResultsCache[searchTerm] = data || [];

          // Display suggestions
          displaySuggestions(data, searchTerm);
        })
        .fail(function () {
          $suggestionsContainer.empty().hide();
        });
    }, 300);

    // Function to display suggestions
    function displaySuggestions(data, searchTerm) {
      $suggestionsContainer.empty();

      if (!data || data.length === 0) {
        $suggestionsContainer.hide();
        return;
      }

      // Create suggestion items (limit to 5)
      const maxSuggestions = 5;
      const suggestions = data.slice(0, maxSuggestions);

      suggestions.forEach(function (item) {
        const $suggestion = $('<div class="custom-search-suggestion"></div>');

        // Highlight the search term in the title
        const highlightedTitle = highlightText(item.title, searchTerm);

        $suggestion.html(highlightedTitle);

        // Handle click on suggestion
        $suggestion.on("click", function () {
          window.location.href = item.url;
        });

        $suggestionsContainer.append($suggestion);
      });

      // Show the suggestions container
      $suggestionsContainer.show();
    }

    // Handle input to show/hide clear button and trigger auto-search
    $searchInput.on("input", function () {
      const searchTerm = $(this).val().trim();

      if (searchTerm.length > 0) {
        $clearButton.show();
        performAutoSearch(searchTerm);
      } else {
        $clearButton.hide();
        $suggestionsContainer.empty().hide();
      }
    });

    // Close suggestions when clicking outside
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".custom-search-container").length) {
        $suggestionsContainer.hide();
      }
    });

    // Prevent form submission when pressing Enter on input
    $searchInput.on("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();

        // If suggestions are visible and user presses Enter, navigate to the first suggestion
        if (
          $suggestionsContainer.is(":visible") &&
          $suggestionsContainer.find(".custom-search-suggestion").length > 0
        ) {
          $suggestionsContainer
            .find(".custom-search-suggestion")
            .first()
            .click();
        } else {
          // Otherwise perform the search with the current input value
          const searchQuery = $(this).val().trim();
          if (searchQuery.length > 1) {
            const url = new URL(window.location.href);
            url.searchParams.set("input", searchQuery);
            window.location.href = url.toString();
          }
        }
      }
    });

    // Trigger input event to set initial state of clear button
    $searchInput.trigger("input");

    // Handle form submission
    $searchForm.on("submit", function (e) {
      e.preventDefault();
      const searchQuery = $searchInput.val().trim();
      if (searchQuery && searchQuery.length > 1) {
        // Get the current URL and update or add the input parameter
        const url = new URL(window.location.href);
        url.searchParams.set("input", searchQuery);

        // Reload with the new search query
        window.location.href = url.toString();
      }
    });

    // Assemble the search bar
    $searchFieldContainer.append($searchIcon);
    $searchFieldContainer.append($searchInput);
    $searchFieldContainer.append($clearButton);
    $searchForm.append($searchFieldContainer);
    $searchBarContainer.append($searchForm);
    $searchBarContainer.append($suggestionsContainer);

    // Remove existing search container if already present
    $(".custom-search-container").remove();

    // First try to insert in col-9grid-container
    const $col9GridContainer = $(".col-9grid-container");
    if ($col9GridContainer.length > 0) {
      // Prepend to make it appear at the top of the container
      $col9GridContainer.prepend($searchBarContainer);
      return;
    }

    // If col-9grid-container not found, try inserting before #section-topic
    const $sectionTopic = $("#section-topic");
    if ($sectionTopic.length > 0) {
      $searchBarContainer.insertBefore($sectionTopic);
      return;
    }

    // Fallback options
    const $homeBanner = $(".home-banner");
    if ($homeBanner.length > 0) {
      $homeBanner.prepend($searchBarContainer);
      return;
    }

    // Last resort: find .col-9grid-components and prepend to it
    const $gridComponents = $(".col-9grid-components");
    if ($gridComponents.length > 0) {
      $gridComponents.prepend($searchBarContainer);
      return;
    }

    // Very last resort: append to body
    $("body").append($searchBarContainer);
  }

  function onDocumentReady() {
    const templateName = $("meta[name='template']").attr("content");
    const $form = $(".cmp-search__form");
    const $input = $(".cmp-search__input");

    // Make sure the topic div exists
    ensureTopicDivExists();

    // Create search bar at the top
    createSearchBar();

    if (!templateName) return;

    if (!templateName.includes("search-page")) {
      $input.on("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          const searchQuery = $(this).val();
          if (searchQuery.length > 1) {
            window.location.href = `${window.location.origin}${$(
              "#search_page-path"
            ).val()}?input=${searchQuery}`;
          }
        }
      });
    } else {
      if (hasUrlParameter("input")) {
        updateUrlParam();
        generateItemList($form[0], { preventDefault: function () {} }, 0, itemsPerPage);

        // Also update our custom search input
        const queryParameterValue = new URLSearchParams(
          window.location.search
        ).get("input");
        if (queryParameterValue) {
          $(".custom-search-input").val(queryParameterValue);
        }
      }

      $input.on("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          generateItemList($form[0], event, 0, itemsPerPage);
        }
      });

      // Handle custom search input
      $(".custom-search-input").on("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          const searchQuery = $(this).val();
          if (searchQuery.length > 1) {
            // Update URL and trigger search
            const url = new URL(window.location.href);
            url.searchParams.set("input", searchQuery);
            window.location.href = url.toString();
          }
        }
      });
    }
  }

  if (document.readyState !== "loading") {
    onDocumentReady();
  } else {
    $(document).on("DOMContentLoaded", onDocumentReady);
  }
});
