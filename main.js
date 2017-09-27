const express = require('express');
const githubapi = require('./githubapi.js');

const app = express();


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

// Spécifie le port d'accès au serveur
app.listen(9090);
