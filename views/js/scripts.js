/*
  Returns an object containing the repository information
*/
function getRepositoryInfoFromUrl(repositoryUrl) {
  const data = repositoryUrl.split('/');

  const repositoryInfo = {
    owner: data[0],
    repository: data[1],
  };

  return repositoryInfo;
}

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

/*
  Checks if the Compare button is to be enabled or disabled.
*/
function toggleCompareButton() {
  if ($('.repository-list .list-group-item').not('.repository-list-item-template').length === 0) {
    $('#compare-button').addClass('disabled');
  } else {
    $('#compare-button').removeClass('disabled');
  }
}

/*
  Adds a repository to the list of repositories given a repository url.
  Parameters:
  repositoryUrl: the repository url
*/
function addRepositoryToList(repositoryUrl) {
  const template = $('.repository-list-item-template').clone();
  template.attr('data-repository-url', repositoryUrl);
  template.removeClass('repository-list-item-template').find('.url').html(repositoryUrl);
  $('.repository-list .list-group').append(template);
  template.find('.control-delete').click(function deleteRepositoryFromList() {
    $(this).parents('.list-group-item').remove();
    toggleCompareButton();
  });
  toggleCompareButton();
}

/*
  Create the HTML form to make a POST request with repository information.
*/
function createRepositoryForm() {
  // Container object
  const repositoryContainer = {
    repositories: [],
  };

  // Retrieve repositories information from the DOM
  $('.repository-list-item').not('.repository-list-item-template').each(function retrieveRepositoryFromDOM() {
    const repositoryValues = getRepositoryInfoFromUrl($(this).attr('data-repository-url'));
    repositoryContainer.repositories.push(repositoryValues);
  });

  // Populate the form
  $('#compare-json').val(JSON.stringify(repositoryContainer));

  // Send the form
  $('#compare-form').submit();
}

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

  /*
    Register event for the click on add repository button
  */
  $('#add-repository').click(function addButtonEvent() {
    // Retrieve repository url input
    const repositoryUrl = $(this).siblings('.repository-input').val();

    // Check the input, and if valid, add it to the list of repositories
    if (repositoryUrl === '') {
      // Show empty input repository alert
      $('#alert-empty-repository').show(500);
      setTimeout(() => { $('#alert-empty-repository').hide(500); }, 4000);
    } else if ($(`.list-group-item[data-repository-url='${repositoryUrl}']`).length > 0) {
      // Show existing repositiory input
      $('#alert-exist-repository').show(500);
      setTimeout(() => { $('#alert-exist-repository').hide(500); }, 4000);
    } else {
      addRepositoryToList(repositoryUrl);
    }
  });

  /*
    Register event on compare button click
  */
  $('#compare-button').click(() => {
    if (!$('this').hasClass('disabled')) {
      createRepositoryForm();
    }
  });

  /*
    Load each missing statistic through ajax requests
  */
  $('.ajax-statistic').each(function requestAjaxStatistics() {
    // Get the repository identfying data
    const repositoryUrl = $(this).parents('.repository-stats').siblings('.full-name-link').html();
    const repositoryData = getRepositoryInfoFromUrl(repositoryUrl);

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
