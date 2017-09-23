const express = require('express');

const app = express();


// Configuration du moteur de vue
app.set('view engine', 'ejs');


// Accès à l'index
app.get('/', function (req, res) {
  res.render('pages/index');
});


// Spécifie le port d'accès au serveur
app.listen(9090);
