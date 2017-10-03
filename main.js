const express = require('express');
const githubapi = require('./githubapi.js');
const bodyParser = require('body-parser')

const app = express();

// Spécifie le port d'accès au serveur
app.listen(9090);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuration du moteur de vue
app.set('view engine', 'ejs');

// Define static files root directory
app.use(express.static(__dirname));

// Accès à l'index
app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/landing_page', (req, res) => {
  res.render('pages/landing_page');
});

/* GET compare for view test and development purpose */
app.get('/compare', (req, res) => {
  res.render('pages/compare_get');
});

/*
  Process POST requests on /compare path.

  The requests are supposed to provide data containing
  information about one or more repositories.
*/
app.post('/compare', (req, res) => {
  // Parse Form JSON information
  const info = JSON.parse(req.body.repositories);

  /*
    Object to store main information about the repositories retrieved from
    the GitHub API.
  */
  const repositoriesSummary = {
    expectedNumber: info.repositories.length,
    numberOfErrors: 0, // How many repositories could not be retrieved
    list: [],
  };

  /*
    Function to process every github api response.
  */
  const processGithubResponse = (response) => {
    // Parse the response
    const json = JSON.parse(response);

    /*
      The GitHub API response will have a 'message' property set to 'Not Found'
      if the request could not be fullfilled...
      Check if the request was a success, and if it's the case, add the main
      information fields to the list of repository summaries.
      */
    if (json.message !== undefined && json.message === 'Not Found') {
      // Increase the number the number of error on repository request
      repositoriesSummary.numberOfErrors += 1;
    } else {
      // Convert the date of the pushed_at field
      const date = new Date(json.pushed_at);

      // Add the main information to the list of repository summaries
      repositoriesSummary.list.push({
        name: json.name,
        full_name: json.full_name,
        owner: json.owner.login,
        description: json.description,
        pushed_at: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
        open_issues_count: json.open_issues_count,
        forks_count: json.forks_count,
      });
    }

    /*
      At the end of the request, if there is enough repository summaries in the
      list (regarding the number of requests and the number of errors), we can
      render the view.
    */
    if (repositoriesSummary.list.length === repositoriesSummary.expectedNumber
      - repositoriesSummary.numberOfErrors) {
      // Render the view
      res.render('pages/compare', {
        data: repositoriesSummary,
      });
    }
  };

  /*
    For every repository submitted in the POST request, make a GitHub API
    request to retrieve the main information.

    We pass the processGithubResponse function as a callback.
  */
  for (let i = 0; i < info.repositories.length; i += 1) {
    const repositoryInfos = info.repositories[i];

    githubapi.getRepo(repositoryInfos.user, repositoryInfos.repository, processGithubResponse);
  }
});

// Example d'utilisation
app.get('/test', (req, res) => {
  const getRepo = new Promise((resolve, reject) => {
    // Récupère un repo
    githubapi.getRepo('mathieumonteverde', 'compository', (response) => {
      const json = JSON.parse(response);

      const data = {};
      data.name = json.name;
      data.full_name = json.full_name;
      data.description = json.description;
      data.created_at = json.created_at;
      data.updated_at = json.updated_at;
      data.pushed_at = json.pushed_at;
      data.forks_count = json.forks_count;
      data.open_issues_count = json.open_issues_count;

      resolve(data);
    });
  });

  const contributors = function (d) {
    return new Promise((resolve, reject) => {
      // Récupère les contributeurs
      githubapi.getContributors('mathieumonteverde', 'compository', (response) => {
        const json = JSON.parse(response);

        const data = {};
        data.contributors_count = Object.keys(json).length;

        Object.assign(data, d);

        resolve(data);
      });
    });
  };

  const commits = function(d) {
    return new Promise((resolve, reject) => {
      // Récupère les commits
      githubapi.getCommits('mathieumonteverde', 'compository', (response) => {
        const json = JSON.parse(response);
        const nbCommits = Object.keys(json).length;

        const data = {};
        data.commits_count = nbCommits;

        Object.assign(data, d);

        resolve(data);
      });
    });
  };

  getRepo
    .then(contributors)
    .then(commits)
    .then((data) => {
      // Envoie les données à la vues
      res.render('pages/test', {
        data: data,
      });
    });
});
