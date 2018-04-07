import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username = '';
  email = '';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Jednom kada se komponente ocitaju, uzmi korisnikove podatke koje ce se prikaza na profilu
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.email = profile.user.email;
    });
  }

}
