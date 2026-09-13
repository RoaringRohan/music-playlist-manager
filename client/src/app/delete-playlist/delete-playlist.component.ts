import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-delete-playlist',
  templateUrl: './delete-playlist.component.html',
  styleUrls: ['./delete-playlist.component.css']
})
export class DeletePlaylistComponent implements OnInit {
  playlistName: string = '';
  message: string = '';
  error: string = '';
  confirmDelete: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.confirmDelete) {
      const body = {
        "playlistName": this.playlistName
      };

      const accessToken = localStorage.getItem('accessToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);

      const options = {
        params: body,
        headers: headers
      };

      this.http.delete('/api/secure/playlist/delete', options).subscribe(
        (response: any) => {
          this.message = response.message;
        },
        (error) => {
          this.error = error.error.message;
        }
      );
    } else {
      this.error = 'Please confirm that you want to delete the playlist.';
    }
  }
}
