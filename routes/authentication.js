const User = require('../models/user'); // Uvoz User Model Schema
const jwt = require('jsonwebtoken'); // Kompaktnost, URL-sigurnost znaci transfer izmedju dve strane 
const config = require('../config/database'); // Uvoz konfiguracije za bazu podataka 

module.exports = (router) => {
  /* ==============
     Ruta za registraciju
  ============== */
  router.post('/register', (req, res) => {
    // Provera da li je email obezbedjen 
    if (!req.body.email) {
      res.json({ success: false, message: 'You must provide an e-mail' }); 
    } else {
      // Provera da li je korisnicko ime obezbedjen 
      if (!req.body.username) {
        res.json({ success: false, message: 'You must provide a username' }); 
      } else {
        // Provera da li je sifra obezbedjena 
        if (!req.body.password) {
          res.json({ success: false, message: 'You must provide a password' });
        } else {
          // Kreiranje novog korisnika i pohrana u ulaz
          let user = new User({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
          });
          // Cuvanje korisnika u bazu i provera gresaka
          user.save((err) => {
            if (err) {
              if (err.code === 11000) {
                res.json({ success: false, message: 'Username or e-mail already exists' });
              } else {
                if (err.errors) {
                  if (err.errors.email) {
                    res.json({ success: false, message: err.errors.email.message }); 
                  } else {
                    if (err.errors.username) {
                      res.json({ success: false, message: err.errors.username.message }); 
                    } else {
                      if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message }); 
                      } else {
                        res.json({ success: false, message: err }); 
                      }
                    }
                  }
                } else {
                  res.json({ success: false, message: 'Could not save user. Error: ', err }); 
                }
              }
            } else {
              res.json({ success: true, message: 'Acount registered!' }); 
            }
          });
        }
      }
    }
  });

  /* ============================================================
    Ruta za proveru da li je korisnikov email dostupan za registraciju
  ============================================================ */
  router.get('/checkEmail/:email', (req, res) => {
    // Provera da li je email obezbedjen u parametrima 
    if (!req.params.email) {
      res.json({ success: false, message: 'E-mail was not provided' });
    } else {
      // Pretraga za korisnikov email u bazi 
            User.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err }); 
        } else {
          // Provera da li je korisnikov email iskoriscen
          if (user) {
            res.json({ success: false, message: 'E-mail is already taken' }); 
          } else {
            res.json({ success: true, message: 'E-mail is available' }); 
          }
        }
      });
    }
  });

  /* ===============================================================
     Ruta za proveru da li je korisnicko ime slobodno za registraciju
  =============================================================== */
  router.get('/checkUsername/:username', (req, res) => {
    // Provera da li je korisnicko ime obezbedjeno u parametrima 
    if (!req.params.username) {
      res.json({ success: false, message: 'Username was not provided' }); 
    } else {
      // Pretraga za korisnickim imenom u bazi 
      User.findOne({ username: req.params.username }, (err, user) => { // Proveriti da li je greska u konekciji
        if (err) {
          res.json({ success: false, message: err }); // 
        } else {
          // Proveriti da li je korisnikovo korisnicko ime pronadjeno 
          if (user) {
            res.json({ success: false, message: 'Username is already taken' }); 
            res.json({ success: true, message: 'Username is available' }); 
          }
        }
      });
    }
  });

  /* ========
  Ruta za Login
  ======== */
  router.post('/login', (req, res) => {
    // Proveriti da li je korisnicko ime obezbedjeno
       if (!req.body.username) {
      res.json({ success: false, message: 'No username was provided' }); 
    } else {
      // Proveriti da li je sifra obezbedjena 
      if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided.' });
      } else {
        // Proveriti da li korisnicko ime postoji u bazi 
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          // Proveriti da li ima gresaka 
          if (err) {
            res.json({ success: false, message: err }); 
          } else {
            // Proveriti da li je korisnicko ime pronadjeno 
            if (!user) {
              res.json({ success: false, message: 'Username not found.' }); 
            } else {
              const validPassword = user.comparePassword(req.body.password); //Uporediti sifru koja je uneta sa sifrom u bazi 
              // Proveriti da li se sifra poklapa 
              if (!validPassword) {
                res.json({ success: false, message: 'Password invalid' }); 
              } else {
                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); //Kreiranje tokena za klijenta 
                res.json({
                  success: true,
                  message: 'Success!',
                  token: token,
                  user: {
                    username: user.username
                  }
                }); // Vratiti uspesno i token u frontend
              }
            }
          }
        });
      }
    }
  });

  /* ================================================
  MIDDLEWARE - Used to grab user's token from headers
  ================================================ */
  router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'No token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });

  /* ===============================================================
     Route to get user's profile data
  =============================================================== */
  router.get('/profile', (req, res) => {
    // Search for user in database
    User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
        } else {
          res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
        }
      }
    });
  });

  /* ===============================================================
     Route to get user's public profile data
  =============================================================== */
  router.get('/publicProfile/:username', (req, res) => {
    // Check if username was passed in the parameters
    if (!req.params.username) {
      res.json({ success: false, message: 'No username was provided' }); // Return error message
    } else {
      // Check the database for username
      User.findOne({ username: req.params.username }).select('username email').exec((err, user) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
        } else {
          // Check if user was found in the database
          if (!user) {
            res.json({ success: false, message: 'Username not found.' }); // Return error message
          } else {
            res.json({ success: true, user: user }); // Return the public user's profile data
          }
        }
      });
    }
  });

  return router; // Return router object to main index.js
}
