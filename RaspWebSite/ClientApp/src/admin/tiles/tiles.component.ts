import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, Tile } from '../../services/api.service';
import { NewTileComponent } from '../new-tile/new-tile.component';

@Component({
  selector: 'admin-tiles',
  templateUrl: './tiles.component.html'
})
export class TilesComponent {
  items: Tile[] | null = null;
  displayedColumns: string[] = ['name', 'options'];

  constructor(private tileSrv: ApiService, public dialog: MatDialog) {
    this.downloadItems();
  }

  private downloadItems(): void {
    this.items = null;
    this.tileSrv.getTiles().subscribe(fetched => {
      this.items = fetched;
    });
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, item?: Tile): void {
    this.dialog.open(NewTileComponent, {
      width: '50vh',
      enterAnimationDuration,
      exitAnimationDuration,
      data: item
    });
    this.dialog.afterAllClosed.subscribe(_ => {
      this.items = null;
      this.downloadItems();
    });
  }

  delete(item: Tile): void {
    this.tileSrv.removeTile(item).subscribe(_ => {
      this.items = null;
      this.downloadItems();
    });
  }
}
