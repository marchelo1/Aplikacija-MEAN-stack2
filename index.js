/* ===================
   Import Node Modules
=================== */
const express = require('express'); 
const app = express(); 
const router = express.Router(); // Kreiranje novog ruter objekta.
const mongoose = require('mongoose'); // Node alat za MongoDB
mongoose.Promise = global.Promise;
const config = require('./config/database');
const path = require('path'); // NodeJS paket za putanju
const authentication = require('./routes/authentication')(router); // Uvozenje Authentication putanje
const blogs = require('./routes/blogs')(router); // Importovanje Blog putanja
const bodyParser = require('body-parser'); // Body-parser sluzi da bi se zahtevi HTTP PUT iil POST transformisali u body kod header zahteva nakon specifiranja Content-Type i tako pristupilo zahtevu pre ocitavanja celog fajla  
const cors = require('cors'); // CORS je node.js paket koji obezbedjuje konekciju sa ekspres midlverom kako bi se mogao koristiti sa razlicitim opcijama

// Konekcija sa bazom podataka
mongoose.connect(config.uri, (err) => {
  if (err) {
    console.log('Could NOT connect to database: ', err);
  } else {
    console.log('Connected to database: ' + config.db);
  }
});

// Middleware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 
app.use(express.static(__dirname + '/client/dist/')); // Snabdevanje statickog direktorijuma za frontend
app.use('/authentication', authentication); // Koriscenje Autentikacije putanja u aplikaciji
app.use('/blogs', blogs); // Koriscenje Blog rute u aplikaciji 

// Konektovanje servera sa angular Index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server: Listen on port 8080
app.listen(8080, () => {
  console.log('Listening on port 8080');
});
