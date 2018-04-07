import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

// Nas Niz iz Angular Putanje
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // Default Putanja
  },
  {
    path: 'dashboard',
    component: DashboardComponent, // Dashboard Putanja,
    canActivate: [AuthGuard] // Korisnik mora biti ulogovan da bi video ovu putanju
  },
  {
    path: 'register',
    component: RegisterComponent, // Register Putanja
    canActivate: [NotAuthGuard] // Korisnik ne sme biti ulogovan da bi video ovu putanju
  },
  {
    path: 'login',
    component: LoginComponent, // Login Putanja
    canActivate: [NotAuthGuard] // Korisnik ne sme biti ulogovan da bi video ovu putanju
  },
  {
    path: 'profile',
    component: ProfileComponent, // Profile Putanja
    canActivate: [AuthGuard] // Korisnik mora biti ulogovan da bi video ovu putanju
  },
  {
    path: 'blog',
    component: BlogComponent, // Blog Putanja,
    canActivate: [AuthGuard] // Korisnik mora biti ulogovan da bi video ovu putanju
  },
  {
    path: 'edit-blog/:id',
    component: EditBlogComponent, // Edit Blog Putanja
    canActivate: [AuthGuard] // Korisnik mora biti ulogovan da bi video ovu putanju
  },
  {
    path: 'delete-blog/:id',
    component: DeleteBlogComponent, // Delete Blog Putanja
    canActivate: [AuthGuard] // Korisnik mora biti ulogovan da bi video ovu putanju
  },
  {
    path: 'user/:username',
    component: PublicProfileComponent, // Public Profile Putanja
    canActivate: [AuthGuard] // Korisnik mora biti ulogovan da bi video ovu putanju
  },
  { path: '**', component: HomeComponent } // "Catch-All" Putanja
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }
