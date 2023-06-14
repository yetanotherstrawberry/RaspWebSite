import { Component } from '@angular/core';
import { Tag, TileService } from '../../services/tile.service';

@Component({
  selector: 'admin-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent {
  tags: Tag[] | null = null;

  constructor(tileSrv: TileService) {
    tileSrv.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }
}
