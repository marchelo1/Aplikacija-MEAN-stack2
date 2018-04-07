import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  // Funkcija za kreiranje forme registracije
  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5), // minimum 5 karaktera
        Validators.maxLength(30), // maksimum 30 karaktera
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm') });
  }

  // Funkcija da onemogucavanje forme registracije
  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

   // Funkcija da omogucavanje forme registracije
  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

 // Funkcija za vaditaciju forme emaila
  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true };
    }
  }

   // Funkcija za vaditaciju forme username
   validateUsername(controls) {
     const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
     if (regExp.test(controls.value)) {
       return null;
     } else {
       return { 'validateUsername': true };
     }
   }

  // Funkcija za vaditaciju forme passworda
  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true };
    }
  }

  // Funckija da se osigura da se sifre poklapaju
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { 'matchingPasswords': true };
      }
    };
  }

  // Funkcija za submit formu
  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };

    // Funkija iz authentication service za registraciju korisnika
    this.authService.registerUser(user).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        // Posle 2 sekunde tajmauta, odvedi na login stranicu
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    });

  }

  // Funkcija da se proveri ako je emai iskoriscen
  checkEmail() {
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      if (!data.success) {
        this.emailValid = false;
        this.emailMessage = data.message;
      } else {
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    });
  }

  // Funkcija za proveru da li je username slobodan
  checkUsername() {
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      if (!data.success) {
        this.usernameValid = false;
        this.usernameMessage = data.message;
      } else {
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    });
  }

  ngOnInit() {
  }

}
