/* ===================
   Importovanje Node Modjulsa
=================== */
const mongoose = require('mongoose'); // Node alat za MongoDB
mongoose.Promise = global.Promise; //Konfigurisanje Mongoose Promises
const Schema = mongoose.Schema; // Importovanje sheme za Mongoose 
const bcrypt = require('bcrypt-nodejs'); // JS bcrypt biblioteka za NodeJS

// Funkcija za validaciju provere duzine emaila
let emailLengthChecker = (email) => {
  // Provera da li postoji e-mail 
  if (!email) {
    return false; 
  } else {
    // Proveriti duzinu stringa u email
    if (email.length < 5 || email.length > 30) {
      return false; // Vratiti gresku ako nije odgovarajuca duzina 
    } else {
      return true; // Vratiti validan email
    }
  }
};

// Funkcija za validaciju provere email formata 
let validEmailChecker = (email) => {
  // Provera da li postoji e-mail 
  if (!email) {
    return false; 
  } else {
    // Regularan izraz za testiranje validnosti emaila
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email); // Rezultat testa validnosti emaila 
  }
};

// Niz Email Validatora 
const emailValidators = [
  // Prvi email validator 
  {
    validator: emailLengthChecker,
    message: 'E-mail must be at least 5 characters but no more than 30'
  },
  // Drugi email validator 
  {
    validator: validEmailChecker,
    message: 'Must be a valid e-mail'
  }
];

// Funkcija za validnost provere duzine korisnickog imena 
let usernameLengthChecker = (username) => {
  // // Provera da li postoji korisnicko ime postoji  
  if (!username) {
    return false; 
  } else {
    // Proveriti duzinu stringa u korisnickom imenu
    if (username.length < 3 || username.length > 15) {
      return false; // Vratiti gresku ako nije odgovarajuca duzina 
    } else {
      return true; // Vratiti validan username
    }
  }
};

// // Funkcija za validaciju provere formata korisnickog imena  
// let validUsername = (username) => {
//   if (!username) {
//     return false;
//   } else {
//     const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
//     return regExp.test(username);
//   }
// };

// // Niz Validatora Korisnickog imena 
// const usernameValidators = [
//   // Prvi username validator 
//   {
//     validator: usernameLengthChecker,
//     message: 'Username must be at least 3 characters but no more than 15'
//   },
//    // Drugi username validator 
//   {
//     validator: validUsername,
//     message: 'Username must not have any special characters'
//   }
// ];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Check password length
    if (password.length < 8 || password.length > 35) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return password as valid
    }
  }
};

// Funkcija za validnost provere duzine imena sifre 
let validPassword = (password) => {
  if (!password) {
    return false; 
  } else {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password); 
  }
};

const passwordValidators = [
  {
    validator: passwordLengthChecker,
    message: 'Password must be at least 8 characters but no more than 35'
  },
  {
    validator: validPassword,
    message: 'Must have at least one uppercase, lowercase, special character, and number'
  }
];

// Definisanje modela korisnika 
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, validate: passwordValidators }
});

// Schema Middleware za Enkripciju sifre
userSchema.pre('save', function(next) {
  if (!this.isModified('password'))
    return next();

  // Potvrdi enkripciju 
    bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err); 
    this.password = hash; 
    next(); 
  });
});

// Metoda za uporedjivanje sifre sa enkriptovanom sifrom nakon logovanja 
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password); 
};

// Export Module/Schema
module.exports = mongoose.model('User', userSchema);
