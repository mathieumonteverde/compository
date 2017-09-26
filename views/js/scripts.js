$(document).ready(function() {

  /* Register event to scroll to targeted elements on button click */
  $('.scroll-action').click(function() {
  	let idSelector = `#${$(this).attr('data-scroll-target')}`;
    scrollToTarget(idSelector);
  });

  /* Register event for the click on add repository button */
  $('#add-repository').click(function() {
    let repositoryUrl = $(this).siblings('.repository-input').val();
    if (!(repositoryUrl === '')) {
      addRepositoryToList(repositoryUrl);
    }
  });
});

/*
  Scrolls to the element targeted by the given selector.
  Parameters:
  elementSelector: a selector of the targeted element.
*/
function scrollToTarget(elementSelector) {
  $('html, body').animate({
    scrollTop: $(elementSelector).offset().top
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
  template.removeClass('repository-list-item-template').find('.url').html(repositoryUrl);
  $('.repository-list .list-group').append(template);
  template.find('.control-delete').click(function() {
    $(this).parents('.list-group-item').remove();
    toggleCompareButton();
  });
  toggleCompareButton();
}
