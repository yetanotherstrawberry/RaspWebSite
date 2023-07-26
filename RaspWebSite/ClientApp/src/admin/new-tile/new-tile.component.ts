import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Tag, Tile, ApiService } from '../../services/api.service';

@Component({
  selector: 'admin-new-tile',
  templateUrl: './new-tile.component.html'
})
export class NewTileComponent {
  form: FormGroup;
  selectedTags = new FormControl<number[]>([]);
  availTags: Tag[] | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tileSrv: ApiService,
    @Inject(MAT_DIALOG_DATA) public editedItem: Tile,
    public dialogRef: MatDialogRef<NewTileComponent>)
  {
    if (editedItem !== undefined) {
      this.selectedTags.setValue(editedItem.tags.map(tag => tag.id));
    }
    this.form = this.fb.group({
      description: [editedItem == undefined ? '' : editedItem.description, Validators.required],
      link: [editedItem == undefined ? '' : editedItem.link, Validators.required],
      name: [editedItem == undefined ? '' : editedItem.name, Validators.required],
      selectedTags: this.selectedTags,
      pictureId: [editedItem == undefined ? 'https://raw.githubusercontent.com/yetanotherstrawberry/RaspCalc/master/RaspCalc/Screenshots/DarkResponsiveError.png' : editedItem.pictureId, Validators.required]
    });
    this.form.disable();
    tileSrv.getTags().subscribe(tags => {
      this.availTags = tags;
      this.form.enable();
    });
  }

  public async add(): Promise<void> {
    if (this.form.valid) {
      this.form.disable();
      if (this.editedItem === undefined) {
        await lastValueFrom(this.tileSrv.addTile({
          pictureId: this.form.value.pictureId,
          tagIds: this.form.value.selectedTags,
          description: this.form.value.description,
          link: this.form.value.link,
          name: this.form.value.name
        }));
      } else {
        await lastValueFrom(this.tileSrv.editTile({
          id: this.editedItem.id,
          pictureId: this.form.value.pictureId,
          tagIds: this.form.value.selectedTags,
          description: this.form.value.description,
          link: this.form.value.link,
          name: this.form.value.name
        }));
      }
      this.dialogRef.close();
    }
  }
}
