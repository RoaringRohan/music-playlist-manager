import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-security-privacy-policy',
  templateUrl: './security-privacy-policy.component.html',
  styleUrls: ['./security-privacy-policy.component.css']
})
export class SecurityPrivacyPolicyComponent implements OnInit {
  policies: any[] = [];
  error: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('/api/open/security-and-privacy-policy').subscribe(response => {
      this.policies = response;
    }, error => {
      this.error = error.error.message;
    });
  }
}
