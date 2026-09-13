import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dmca-notice-takedown-policy',
  templateUrl: './dmca-notice-takedown-policy.component.html',
  styleUrls: ['./dmca-notice-takedown-policy.component.css']
})
export class DmcaNoticeTakedownPolicyComponent {
  policies: any[] = [];
  error: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('/api/open/dmca-notice-and-takedown-policy').subscribe(response => {
      this.policies = response;
    }, error => {
      this.error = error.error.message;
    });
  }
}
