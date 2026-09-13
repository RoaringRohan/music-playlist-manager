import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-query-track',
  templateUrl: './query-track.component.html',
  styleUrls: ['./query-track.component.css']
})
export class QueryTrackComponent implements OnInit {
  artistName: string = "";
  trackGenre: string = "";
  trackTitle: string = "";
  tracks: any[] = [];
  error: string = "";

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  onSubmit() {
    const body: any = {
      "artist_name": this.artistName,
      "track_genre": this.trackGenre,
      "track_title": this.trackTitle
    };

    // Remove null values from the body object
    Object.keys(body).forEach((key) => {
      if (body[key] === "") {
        delete body[key];
      }
    });

     this.http.post('/api/open/tracks', body).subscribe(
    (response: any) => {
      this.tracks = response;
    },
    (error) => {
      this.error = error;
    }
  );
  }

  toggleExpand(track: any) {
    track.expanded = !track.expanded;
  }
}
