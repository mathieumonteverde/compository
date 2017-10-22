/*
  eslint no-unused-vars: ["error", { "varsIgnorePattern": "repositorySelector" }]
*/

/*
  Scrolls to the element targeted by the given selector.
  Parameters:
  elementSelector: a selector of the targeted element.
*/
function scrollToTarget(elementSelector) {
  $('html, body').animate({
    scrollTop: $(elementSelector).offset().top,
  }, 'slow');
}

/**
  Returns an array of DOM elements selected by given
  CSS selector.
*/
function getDOMElementsAsArray(CSSSelector) {
  const elementsArray = [];
  $(CSSSelector).each(function addElementArray() {
    elementsArray.push($(this));
  });

  return elementsArray;
}

$(document).ready(() => {
  /*
    Register event to scroll to targeted elements on button click
  */
  $('.scroll-action').click(function eventOnScroll() {
    const idSelector = `#${$(this).attr('data-scroll-target')}`;
    scrollToTarget(idSelector);
  });

  // Create the repository selector object
  const repositorySelector = new RepositorySelector({
    containerSelector: '.repository-selection',
  });

  /*
    Load each missing statistic through ajax requests
  */
  $('.ajax-statistic').each(function requestAjaxStatistics() {
    // Get the repository identfying data
    const repositoryUrl = $(this).parents('.repository-stats').siblings('.full-name-link').html();
    const repositoryData = RepositorySelector.getRepositoryInfoFromUrl(repositoryUrl);

    // Retrieve the url to which make the request
    const postUrl = $(this).attr('data-source');

    // Save the current statistic DOM element for later use in the callbacks
    const target = $(this);

    $.post(postUrl, repositoryData, (data) => {
      // Display the statistic in the DOM element
      target.attr('data-raw', data);
      target.html(data + target.attr('data-text-complement'));
      target.removeClass('ajax-statistic');

      /*
        If all data that was to be loaded from the same source has been
        retreived, then enable the corresponding loader...
      */
      const dataSource = target.attr('data-source');
      if ($(`.repository-stats-list li.ajax-statistic[data-source='${dataSource}']`).length === 0) {
        const dataType = target.attr('data-type');
        $(`.statistic-filter[data-statistic-target='${dataType}']`).removeClass('disabled');
      }
    }).fail(() => {
      target.attr('data-raw', -1);
      target.html('Error: Could not fetch required data...');
    });
  });

  /*
    Register an event to sort the repositories according to the
    clicked filter corresponding statistic.
  */
  $('.statistic-filter').click(function sortLastUpdate() {
    // Do nothing if the button is disabled
    if ($(this).hasClass('disabled')) {
      return;
    }

    // If not, reorder the repositories according to that statistic
    // Get all the repository overviews in an array
    const repositoryOverviewsArray = getDOMElementsAsArray('.repository-overview-container');
    // Retrieve the identifying class from the target statistic
    const statisticTargetClass = $(this).attr('data-statistic-target');

    // Collapse the data, except desired statistic, to facilitate the visual comparison
    $('.repository-overview').addClass('summary');
    $('.repository-overview  .repository-stats-list li').removeClass('summary-visible');
    $(`.${statisticTargetClass}`).addClass('summary-visible');

    // Sort the repositories according to the statistic raw data stored in the DOM
    if ($(this).attr('data-order') === 'decreasing') {
      repositoryOverviewsArray.sort((a, b) =>
        parseFloat(b.find(`.${statisticTargetClass}`).attr('data-raw'))
        - parseFloat(a.find(`.${statisticTargetClass}`).attr('data-raw')));
    } else {
      repositoryOverviewsArray.sort((a, b) =>
        parseFloat(a.find(`.${statisticTargetClass}`).attr('data-raw'))
        - parseFloat(b.find(`.${statisticTargetClass}`).attr('data-raw')));
    }

    // Remove the content of the repository listing
    $('.repository-listing').html('');
    // Add every repository back in sorted order
    for (let i = 0; i < repositoryOverviewsArray.length; i += 1) {
      $('.repository-listing').append(repositoryOverviewsArray[i]);
    }

    // Allow user to expand data again
    $('.expand-repository-data-button').removeClass('disabled');
  });

  /*
    Register an event to expand the repository data.
  */
  $('.expand-repository-data-button').click(function expandSummaryData() {
    if (!$(this).hasClass('disabled')) {
      $('.repository-overview').removeClass('summary');
      $(this).addClass('disabled');
    }
  });
});
