import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'admin-visitors',
  templateUrl: './visitors.component.html'
})
export class VisitorsComponent {
  visitors: Visitor[] | null = null;
  displayedColumns: string[] = ['ip', 'visits', 'last', 'options'];

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl: string) {
    this.loadVisits();
  }

  private loadVisits(): void {
    this.http.get<Visitor[]>(this.apiUrl + 'visits/getvisitors').subscribe({
      next: res => {
        res.forEach(visitor => {
          visitor.lastVisit = new Date(visitor.lastVisit).toDateString();
        });
        this.visitors = res;
      },
      error: err => {
        console.error(err);
        this.visitors = [];
      }
    });
  }

  clear(): void {
    this.visitors = null;
    this.http.delete<number>(this.apiUrl + 'visits/clear').subscribe(_ => {
      this.loadVisits();
    });
  }
}

interface Visitor {
  id: string;
  ip: string;
  visits: number;
  lastVisit: string;
}
