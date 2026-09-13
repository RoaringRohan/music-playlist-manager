import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  loading = false;

  constructor(private http: HttpClient) {}

  createAccount() {
    this.loading = true;
    const body = {
      username: this.username,
      emailAddress: this.email,
      password: this.password
    };
    this.http.post('/api/account/register', body).pipe(
      finalize(() => {
        this.successMessage = 'Check your email to verify and activate your account.';
        this.loading = false;
      })
    ).subscribe(
      () => {
        this.successMessage = 'Check your email to verify and activate your account.';
      },
      (error) => {
        this.successMessage = '';
        this.errorMessage = error.error.message;
      }
    );
  }
}
