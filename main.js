const express = require('express');

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


// Spécifie le port d'accès au serveur
app.listen(9090);
