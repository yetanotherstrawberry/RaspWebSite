import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string) {
    lastValueFrom(http.get(apiUrl + 'visits/visited'));
  }
}
