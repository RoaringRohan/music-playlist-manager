import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-top-playlists',
  templateUrl: './top-playlists.component.html',
  styleUrls: ['./top-playlists.component.css']
})
export class TopPlaylistsComponent implements OnInit {
  playlists: any[] = [];
  error: string = "";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/api/open/playlists').subscribe(
      (response: any) => {
        this.playlists = response;
      },
      (error) => {
        this.error = error;
      }
    );
  }

  toggleExpand(playlist: any) {
    // console.log(playlist.list_of_tracks);
    // playlist.listOfTracks = JSON.parse(playlist.list_of_tracks);
    playlist.expanded = !playlist.expanded;
  }
}
