import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  domain = 'http://localhost:8080/';
  authToken;
  user;
  options;

  constructor(
    private http: Http
  ) { }

   // Funkcija za kreiranje header-a, i tokena, koji ce se koristiti u HTTP zahtevima
  createAuthenticationHeaders() {
    this.loadToken(); // Uzimanje tokena kako bi se prikacili na headers (zaglavlje)
    // Konfiguracija headersa
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format postavljen na JSON
        'authorization': this.authToken // Zakacen token
      })
    });
  }

  // Funkcija za dobijanje tokena za klijentovo lokalno skladiste
  loadToken() {
    this.authToken = localStorage.getItem('token'); // Dobijanje tokena i dodeljivanje varijabli da bi se bilo gde koristila
  }

  // Funkcija za registrovanje korisnikovog naloga
    registerUser(user) {
    return this.http.post(this.domain + 'authentication/register', user).map(res => res.json());
  }

  // Funkcija za proveru da li je korisnicko ime uzeto
  checkUsername(username) {
    return this.http.get(this.domain + 'authentication/checkUsername/' + username).map(res => res.json());
  }

  // Funkcija za proveru da li je email ime uzet
  checkEmail(email) {
    return this.http.get(this.domain + 'authentication/checkEmail/' + email).map(res => res.json());
  }

  // Funkcija za logovanje korisnika
  login(user) {
    return this.http.post(this.domain + 'authentication/login', user).map(res => res.json());
  }

  // Funkcija za logout
  logout() {
    this.authToken = null; // Postavljanje tokena na null
    this.user = null; // Postavljanje korisnika na null
    localStorage.clear(); // Ciscenje lokalnog skladista
  }

  // Funkcija za skladistenje korisnikovih podataka u klijentovovo lokalno skladiste
  storeUserData(token, user) {
    localStorage.setItem('token', token); // Postavljanje tokena u lokalno skladiste
    localStorage.setItem('user', JSON.stringify(user)); // Postavljanje korisnika u lokalno skladiste kao string
    this.authToken = token; // Dodeljivanje tokena da bi se koristio negde drugde
    this.user = user; // Postavljanje user korisnika da bise koristio negde drugde
  }

  // Funkcija za uzimanje korisnikovog profila iz baze
    getProfile() {
    this.createAuthenticationHeaders(); // Kreiranje headersa pre slanja ka API
    return this.http.get(this.domain + 'authentication/profile', this.options).map(res => res.json());
  }

  // Funkcija za dobijanje javnog profila baze
  getPublicProfile(username) {
    this.createAuthenticationHeaders(); // Kreiranje headersa pre slanja ka API
    return this.http.get(this.domain + 'authentication/publicProfile/' + username, this.options).map(res => res.json());
  }

  // Funkcija za proveru da li je korisnik ulogovan
  loggedIn() {
    return tokenNotExpired();
  }

}
