import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Funkcija za odredjivanje da li je korisnik autorizovan da vidi putanju
  canActivate() {
   // Provera da li je korisnik ulogovan
    if (this.authService.loggedIn()) {
      this.router.navigate(['/']); // Ako vrati error, putanja ka home
      return false; // Ako vrati false: korisniku nije dozvoljeno da vidi putanju
    } else {
      return true; // Ako vrati true: user je dozvoljeno da vidi putanju
    }
  }
}
