import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    const body = {
      emailAddress: this.email,
      password: this.password
    };
    this.http.post('/api/account/login', body).subscribe(
      (response: any) => {
        this.errorMessage = '';
        localStorage.setItem('accessToken', response.accessToken);
        if (response.role == "Normal") {
          this.router.navigate(['/user-homepage']);
        }
        else if (response.role == "Admin") {
          this.router.navigate(['/admin-homepage']);
        }
      },
      (error) => {
        this.errorMessage = error.error.message;
      });
  }

  goToSignup() {
    this.router.navigate(['/create-account']);
  }
}
