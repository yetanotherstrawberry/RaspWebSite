import { Component } from '@angular/core';
import { Tile, ApiService } from '../../services/api.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {
  gridColumns: number = 2;
  tiles: Tile[] | null = null;
  readonly breakWidth: number = 768; // Equal to Bootstrap's *-md

  resize(): void {
    this.gridColumns = (window.innerWidth <= this.breakWidth) ? 1 : 2;
  }

  constructor(tileSrv: ApiService) {
    tileSrv.getTiles().subscribe(tiles => {
      this.tiles = tiles;
    });
    this.resize();
  }

  onResize() {
    this.resize();
  }
}
