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

$(document).ready(() => {
  /* Register event to scroll to targeted elements on button click */
  $('.scroll-action').click(function eventOnScroll() {
    const idSelector = `#${$(this).attr('data-scroll-target')}`;
    scrollToTarget(idSelector);
  });

  /* Register event for the click on add repository button */
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

  /* Register event on compare button click */
  $('#compare-button').click(() => {
    if (!$('this').hasClass('disabled')) {
      createRepositoryForm();
    }
  });

  /* Load each missing statistic through ajax requests */
  $('.ajax-statistic').each(function requestAjaxStatistics() {
    const repositoryUrl = $(this).parents('.repository-stats').siblings('.full-name-link').html();
    const repositoryData = getRepositoryInfoFromUrl(repositoryUrl);

    const postUrl = $(this).attr('data-source');

    const target = this;

    $.post(postUrl, repositoryData, (data) => {
      $(target).html(data);
    });
  });
});
