import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent implements OnInit {
  playlistName: string = '';
  description: string = '';
  error: string = '';
  message: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  onSubmit() {
    const body : any = {
      "playlistName": this.playlistName,
      "description": this.description
    };

    // Remove null values from the body object
    Object.keys(body).forEach((key) => {
      if (body[key] === "") {
        delete body[key];
      }
    });


    // function getCookie(name: string) {
    //   const value = `; ${document.cookie}`;
    //   console.log(value);
    //   return value;
    // }

    const accessToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    // this.http.post('/api/secure/playlist/new', body, { headers: headers }).subscribe(
    //   (response: any) => {
    //     this.message = response.message;
    //   },
    //   (error) => {
    //     this.error = error.error.message;
    //   }
    // );

    this.http.post('/api/secure/playlist/new', body, { headers: headers })
      .pipe(
        finalize(() => {
          // Code to run after the observable completes
        })
      )
      .subscribe(
        (response: any) => {
          this.message = response.message;
        },
        (error) => {
          this.error = error.error.message;
        }
      );
  }
}
