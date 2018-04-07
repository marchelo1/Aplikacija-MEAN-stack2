import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Funkcija za proveru da li je korisnik atorizovan da vidi putanju
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Provera da li je korisnik ulogovan
    if (this.authService.loggedIn()) {
      return true; // Ako se vrati true: User/ korisnik je dozvoljeno da vidi
    } else {
      this.redirectUrl = state.url; // Uzimanje prethodnog url
      this.router.navigate(['/login']);
      return false; // Ako se vrati false: korisniku nije dozvoljeno da vidi stranicu
    }
  }
}
