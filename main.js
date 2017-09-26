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
  // Promise permet d'enchainer plusieurs callback en synchro
  new Promise((resolve, reject) => {
    // Récupère un repo
    githubapi.getRepo('mathieumonteverde', 'compository', (response) => {
      resolve(response);
    });
  }).then((data) => {
    // Envoie les données à la vues
    res.render('pages/test', {
      repo: JSON.parse(data),
    });
  });
});

// Spécifie le port d'accès au serveur
app.listen(9090);
