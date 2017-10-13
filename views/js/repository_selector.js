/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "RepositorySelector" }] */
class RepositorySelector {
  constructor(options) {
    // Default plugin options definition
    const defaultOptions = {
      containerSelector: undefined,
      repositoryListSelector: '.list-group',
      listItemSelector: '.repository-list-item',
      addRepositoryButtonSelector: '.add-repository',
      compareButtonSelector: '.compare-button',
      deleteButtonSelector: '.control-delete',
      repositoryInputSelector: '.repository-input',
      templateSelector: '.repository-list-item-template',

      listItemClass: 'repository-list-item',
      templateClass: 'repository-list-item-template',

      errors: {
        emptyRepository: '.alert-empty-repository',
        existingRepository: '.alert-exist-repository',
      },
    };

    // Merge and save the plugin options
    this.options = Object.assign({}, defaultOptions, options);

    // Register events needed at set up
    this.registerSetUpEvents();
  }

  /**
    Register the set up events to manage the user actions on the repository list.

    It registers the click event on the add button, and the click event on the
    compare button.
  */
  registerSetUpEvents() {
    // Register event for the click on add repository button
    $(`${this.options.containerSelector} ${this.options.addRepositoryButtonSelector}`).click(() => {
      // Retrieve repository url input
      const repositoryUrl =
        $(`${this.options.containerSelector} ${this.options.repositoryInputSelector}`)
          .val();

      // Check the input, and if valid, add it to the list of repositories
      if (!RepositorySelector.isValidRepositoryUrl(repositoryUrl)) {
        this.showError(this.options.errors.emptyRepository);
      } else if ($(`${this.options.containerSelector} ${this.options.listItemSelector}[data-repository-url='${repositoryUrl}']`).length > 0) {
        this.showError(this.options.errors.existingRepository);
      } else {
        this.addRepositoryToList(repositoryUrl);
      }
    });

    // Register event on compare button click
    $(`${this.options.containerSelector} ${this.options.compareButtonSelector}`).click(() => {
      if (!$(`${this.options.containerSelector} ${this.options.compareButtonSelector}`).hasClass('disabled')) {
        this.createRepositoryForm();
      }
    });
  }

  /*
    Adds a repository to the list of repositories given a repository url.
    Parameters:
    repositoryUrl: the repository url
  */
  addRepositoryToList(repositoryUrl) {
    // Retrieve a copy of the list template from the DOM
    const template =
      $(`${this.options.containerSelector} ${this.options.templateSelector}`)
        .clone();
    // Set the repository url attribute on the template, remove template class and set content value
    template.attr('data-repository-url', repositoryUrl)
      .addClass(this.options.listItemClass)
      .removeClass(this.options.templateClass)
      .find('.url')
      .html(repositoryUrl);

    // Append the template to the list
    $(`${this.options.containerSelector} ${this.options.repositoryListSelector}`)
      .append(template);

    const pluginObject = this;
    template.find(this.options.deleteButtonSelector).click(function deleteRepositoryFromList() {
      $(this).parents(pluginObject.options.listItemSelector).remove();
      pluginObject.toggleCompareButton();
    });
    pluginObject.toggleCompareButton();
  }

  /*
    Create the HTML form to make a POST request with repository information.
  */
  createRepositoryForm() {
    // Container object
    const repositoryContainer = {
      repositories: [],
    };

    // Retrieve repositories information from the DOM
    $(`${this.options.containerSelector} ${this.options.listItemSelector}`).each(function retrieveRepositoryFromDOM() {
      const repositoryValues =
        RepositorySelector.getRepositoryInfoFromUrl($(this).attr('data-repository-url'));

      repositoryContainer.repositories.push(repositoryValues);
    });

    // If there are any repositories in the selection, send the form
    if (repositoryContainer.repositories.length > 0) {
      // Populate the form
      $(`${this.options.containerSelector} .compare-json`).val(JSON.stringify(repositoryContainer));

      // Send the form
      $(`${this.options.containerSelector} .compare-form`).submit();
    }
  }

  /*
    Checks if the Compare button is to be enabled or disabled.
  */
  toggleCompareButton() {
    if ($(`${this.options.containerSelector} ${this.options.listItemSelector}`).length === 0) {
      $(`${this.options.containerSelector} ${this.options.compareButtonSelector}`).addClass('disabled');
    } else {
      $(`${this.options.containerSelector} ${this.options.compareButtonSelector}`).removeClass('disabled');
    }
  }

  /*
    Returns an object containing the repository information
  */
  static getRepositoryInfoFromUrl(repositoryUrl) {
    const data = repositoryUrl.split('/');

    const repositoryInfo = {
      owner: data[0],
      repository: data[1],
    };

    return repositoryInfo;
  }

  /**
    Check if a GitHub repository url is valid
  */
  static isValidRepositoryUrl(url) {
    return url !== '';
  }

  /**
    Show an error selected by its CSS selector, and hide it a moment later
  */
  showError(errorSelector) {
    $(`${this.options.containerSelector} ${errorSelector}`).show(500);
    setTimeout(() => { $('.alert-empty-repository').hide(500); }, 4000);
  }
}