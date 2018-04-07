import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message;
  messageClass;
  blog;
  processing = false;
  currentUrl;
  loading = true;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) { }

  // Funkcija za Submit Update
  updateBlogSubmit() {
    this.processing = true;
    // Funkcija za slanje blog objekta ka backend
    this.blogService.editBlog(this.blog).subscribe(data => {
      // Provera da li je PUT zahtev uspesan ili ne
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        // Posle dve sekunde, vrati na blog stranicu
        setTimeout(() => {
          this.router.navigate(['/blog']);
        }, 2000);
      }
    });
  }

  // Funkcija za vracanje na prethodnu stranicu
  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // Kada se komponenta ocita, uzmi id
        // Funkcija za GET trenutnog bloga sa id u parametrima
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      // Provera da li je GET zahtev uspesan ili ne
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = 'Blog not found.'; // Set error message
      } else {
        this.blog = data.blog; // Sacuvaj blog objekt za koriscenje u HTML-u
        this.loading = false;
      }
    });

  }

}
