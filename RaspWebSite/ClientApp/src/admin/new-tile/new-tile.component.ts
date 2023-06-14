import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tag, TileService } from '../../services/tile.service';

@Component({
  selector: 'admin-new-tile',
  templateUrl: './new-tile.component.html'
})
export class NewTileComponent {
  form: FormGroup;
  selectedTags = new FormControl('');
  availTags: Tag[] | null = null;

  constructor(private fb: FormBuilder, private router: Router, private tileSrv: TileService) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      link: ['', Validators.required],
      name: ['', Validators.required],
      selectedTags: this.selectedTags,
      pictureId: ['https://raw.githubusercontent.com/yetanotherstrawberry/RaspCalc/master/RaspCalc/Screenshots/DarkResponsiveError.png', Validators.required]
    });
    this.form.disable();
    tileSrv.getTags().subscribe(tags => {
      this.availTags = tags;
      this.form.enable();
    });
  }

  public add(): void {
    if (this.form.valid) {
      this.form.disable();
      var tagIds: number[] = [];
      if (this.selectedTags.value != null) {
        if (this.selectedTags.value.length > 0) {
          tagIds = new String(this.selectedTags.value).split(',').map(tagIdsSplitStr => Number.parseInt(tagIdsSplitStr));
        }
      }
      this.tileSrv.addTile({
        pictureId: this.form.value.pictureId,
        tagIds: tagIds,
        description: this.form.value.description,
        link: this.form.value.link,
        name: this.form.value.name
      }).subscribe(_ => {
        this.router.navigateByUrl('/portfolio');
      });
    }
  }
}
