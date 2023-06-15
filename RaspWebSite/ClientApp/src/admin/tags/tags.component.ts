import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tag, TileService } from '../../services/tile.service';
import { NewTagComponent } from '../new-tag/new-tag.component';

@Component({
  selector: 'admin-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent {
  tags: Tag[] | null = null;
  displayedColumns: string[] = ['name', 'options'];

  private downloadTags(): void {
    this.tags = null;
    this.tileSrv.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }

  constructor(private tileSrv: TileService, public dialog: MatDialog) {
    this.downloadTags();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, item?: Tag): void {
    this.dialog.open(NewTagComponent, {
      width: '50vh',
      enterAnimationDuration,
      exitAnimationDuration,
      data: item
    });
    this.dialog.afterAllClosed.subscribe(_ => {
      this.tags = null;
      this.downloadTags();
    });
  }

  delete(item: Tag): void {
    this.tileSrv.removeTag(item).subscribe(_ => {
      this.tags = null;
      this.downloadTags();
    });
  }
}
