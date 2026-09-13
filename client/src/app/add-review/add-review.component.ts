import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent {
  playlistName: string = '';
  playlistOwner: string = '';
  rating: number = 0;
  comment: string = '';
  errorMessage: string = '';
  message: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const body = {
      playlistName: this.playlistName,
      playlistOwner: this.playlistOwner,
      rating: this.rating,
      comment: this.comment
    };

    const accessToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);

    this.http.post('api/secure/playlist/review/add', body,  { headers: headers }).subscribe(
      (response: any) => {
        this.message = response.message;
      },
      (error) => {
        this.errorMessage = error.error.message;
      }
    );
  }
}
