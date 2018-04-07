import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form;
  commentForm;
  processing = false;
  username;
  blogPosts;
  newComment = [];
  enabledComments = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) {
    this.createNewBlogForm(); // Kreiranje novog bloga
    this.createCommentForm(); // Kreiranje forme za postravaljanje komentar na korisnikov post
  }

  // Funkcija za kreiranje novog bloga
  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    });
  }

  // Kreiranje forme za postavljanje komentara
  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    });
  }

  // Omoguci formu komntara
  enableCommentForm() {
    this.commentForm.get('comment').enable(); // Omoguci polje za komentare
  }

  // Onemoguci formu komentara
  disableCommentForm() {
    this.commentForm.get('comment').disable(); // Onemoguci polje za komentare
  }

  // Omoguci novu blog formu
  enableFormNewBlogForm() {
    this.form.get('title').enable(); // Omoguci polje za naslov
    this.form.get('body').enable(); // Omoguci polje za body
  }

  // Onemoguci novu blog formu
  disableFormNewBlogForm() {
    this.form.get('title').disable(); // Onemoguci polje za naslov
    this.form.get('body').disable(); // Onemoguci polje za body
  }

  // Validacija za naslov
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regularna ekspresiza za testiranje
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'alphaNumericValidation': true };
    }
  }

  // Funckija za prikazivanje nove forme bloga
  newBlogForm() {
    this.newPost = true; // Prikazi novu formu bloga
  }

  // Osvezi blogove na trenutnoj stranici
  reloadBlogs() {
    this.loadingBlogs = true;
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000);
  }

  // Funkcija za postavljanje novih komentra na blogu
  draftComment(id) {
    this.commentForm.reset();
    this.newComment = []; // Ocisti niz tako da samo jedan post moze da se kreira u isto vreme
    this.newComment.push(id);
  }

  // Funkcija za cancel na novi post
  cancelSubmission(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
  }

  // Funkcija za postavljanje novog blog posta
    onBlogSubmit() {
    this.processing = true;
    this.disableFormNewBlogForm();

    // Kreiranje blog objekta iz forme polja
    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    };

    // Funkcija za cuvanje blog u bazu podataka
    this.blogService.newBlog(blog).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableFormNewBlogForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllBlogs();

        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableFormNewBlogForm();
        }, 2000);
      }
    });
  }

  // Funkcija za vracanje na prethodnu stranicu
  goBack() {
    window.location.reload();
  }

  // Funkcija za dobijanje svih blogova iz baze podataka
  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogPosts = data.blogs;
    });
  }

  // Funkcija za like blog posta
  likeBlog(id) {
    this.blogService.likeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }

  // Funkcija za dislike blog posta
  dislikeBlog(id) {
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }

  // Funkcija za postavljanje novog komentara
  postComment(id) {
    this.disableCommentForm();
    this.processing = true;
    const comment = this.commentForm.get('comment').value;
    this.blogService.postComment(id, comment).subscribe(data => {
      this.getAllBlogs();
      const index = this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.enableCommentForm();
      this.commentForm.reset();
      this.processing = false;
      // tslint:disable-next-line:curly
      if (this.enabledComments.indexOf(id) < 0) this.expand(id);
    });
  }

  // Prosirivanje liste komentara
  expand(id) {
    this.enabledComments.push(id);
  }

  // Collapse liste komentara
  collapse(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

  ngOnInit() {
    // Dobijanje profil username na stranici koja je ocitana
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Koristi kada se kreira novi blog post i komentar
    });

    this.getAllBlogs();
  }

}
