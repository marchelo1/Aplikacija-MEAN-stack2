const crypto = require('crypto').randomBytes(256).toString('hex'); // Kriptografska funkcionalnost

// Izvoz config objekta 
module.exports = {
  uri: 'mongodb://localhost:27017/mean-angular-2', // Baza podataka URI and Baza podataka imena
  secret: crypto, // Cryto-kreiranje tajne, sifre
  db: 'mean-angular-2' // Ime baze podataka
}
