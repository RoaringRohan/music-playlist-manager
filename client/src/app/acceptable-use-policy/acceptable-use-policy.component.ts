import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-acceptable-use-policy',
  templateUrl: './acceptable-use-policy.component.html',
  styleUrls: ['./acceptable-use-policy.component.css']
})
export class AcceptableUsePolicyComponent {
  policies: any[] = [];
  error: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>('/api/open/acceptable-use-policy').subscribe(response => {
      this.policies = response;
    }, error => {
      this.error = error.error.message;
    });
  }
}
