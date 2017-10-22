const express = require('express');
const githubapi = require('./githubapi.js');
const bodyParser = require('body-parser');

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
  res.render('pages/landing_page');
});

/* GET compare for view test and development purpose */
app.get('/compare', (req, res) => {
  res.render('pages/compare_get');
});

app.post('/number_commits', (req, res) => {
  githubapi.getNumberOfCommits(req.body.owner, req.body.repository, (err, response) => {
    res.send(`${response}`);
  });
});

app.post('/number_contributors', (req, res) => {
  githubapi.getNumberOfContributors(req.body.owner, req.body.repository, (err, response) => {
    res.send(`${response}`);
  });
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
  const processGithubResponse = (err, response) => {
    /*
      The GitHub API response will have a 'message' property set to 'Not Found'
      if the request could not be fullfilled...
      Check if the request was a success, and if it's the case, add the main
      information fields to the list of repository summaries.
      */
    if (err) {
      // Increase the number the number of error on repository request
      repositoriesSummary.numberOfErrors += 1;
    } else {
      // Parse the response
      const json = JSON.parse(response);
      
      // Convert the date of the pushed_at field
      const date = new Date(json.pushed_at);
      const nowDate = new Date();

      const hoursDiff = Math.abs(nowDate.getTime() - date.getTime()) / 60 / 60 / 1000;

      // Add the main information to the list of repository summaries
      repositoriesSummary.list.push({
        name: json.name,
        full_name: json.full_name,
        owner: json.owner.login,
        description: json.description,
        pushed_at: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
        updated_hours_ago: hoursDiff,
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

    githubapi.getRepo(repositoryInfos.owner, repositoryInfos.repository, processGithubResponse);
  }
});
