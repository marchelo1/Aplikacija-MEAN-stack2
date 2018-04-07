import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class BlogService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  // Funkcija za kreiranje header-a, i tokena, koji ce se koristiti u HTTP zahtevima
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Uzimanje tokena kako bi se prikacili na headers (zaglavlje)
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format postavljen na JSON
        'authorization': this.authService.authToken // Zakacen token
      })
    });
  }

  // Funkcija za kreiranje novog blog posta
  newBlog(blog) {
    this.createAuthenticationHeaders(); // Kreiranje headersa
    return this.http.post(this.domain + 'blogs/newBlog', blog, this.options).map(res => res.json());
  }

  // Funkcija za dobijanje svih blogova iz baze podataka
  getAllBlogs() {
    this.createAuthenticationHeaders(); // Kreiranje headersa
    return this.http.get(this.domain + 'blogs/allBlogs', this.options).map(res => res.json());
  }

  // Funkcija za dobijanje bloga koristeci id
    getSingleBlog(id) {
    this.createAuthenticationHeaders(); // Kreiranje headersa
    return this.http.get(this.domain + 'blogs/singleBlog/' + id, this.options).map(res => res.json());
  }

  // Funkcija za edit/update blog posta
  editBlog(blog) {
    this.createAuthenticationHeaders(); // Kreiranje headersa
    return this.http.put(this.domain + 'blogs/updateBlog/', blog, this.options).map(res => res.json());
  }

  // Funkcija za brisanje bloga
  deleteBlog(id) {
    this.createAuthenticationHeaders(); // Kreiranje headersa
    return this.http.delete(this.domain + 'blogs/deleteBlog/' + id, this.options).map(res => res.json());
  }

  // Funkcija za like a blog posta
  likeBlog(id) {
    const blogData = { id: id };
    return this.http.put(this.domain + 'blogs/likeBlog/', blogData, this.options).map(res => res.json());
  }

  // Funkcija za dislike a blog posta
  dislikeBlog(id) {
    const blogData = { id: id };
    return this.http.put(this.domain + 'blogs/dislikeBlog/', blogData, this.options).map(res => res.json());
  }

  // Funkcija za postavljanje komentara na blogu
  postComment(id, comment) {
    this.createAuthenticationHeaders(); // Kreiranje headersa
    // Kreiranje blogData za prolaz ka backendu
    const blogData = {
      id: id,
      comment: comment
    };
    return this.http.post(this.domain + 'blogs/comment', blogData, this.options).map(res => res.json());

  }

}



