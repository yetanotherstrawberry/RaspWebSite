import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'admin-visitors',
  templateUrl: './visitors.component.html',
})
export class VisitorsComponent {
  public visitors: Visitor[] | null = null;
  isDarkMode: Observable<boolean>;

  constructor(http: HttpClient, @Inject('API_URL') apiUrl: string, private darkModeSrv: DarkModeService) {
    http.get<Visitor[]>(apiUrl + 'visits/getvisitors').subscribe({
      next: res => this.visitors = res,
      error: err => {
        console.error(err);
        this.visitors = [];
      }
    });
    this.isDarkMode = this.darkModeSrv.observableDarkMode;
  }
}

interface Visitor {
  id: string;
  ip: string;
  visits: number;
  lastVisit: string;
}
