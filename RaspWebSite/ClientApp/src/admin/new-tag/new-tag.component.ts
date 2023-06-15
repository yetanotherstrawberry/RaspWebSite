import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Tag, TileService } from '../../services/tile.service';

@Component({
  selector: 'admin-new-tag',
  templateUrl: './new-tag.component.html'
})
export class NewTagComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tileSrv: TileService,
    @Inject(MAT_DIALOG_DATA) public editedItem: Tag)
  {
    this.form = this.fb.group({
      name: [editedItem == undefined ? '' : editedItem.name, Validators.required]
    });
  }

  public async add(): Promise<void> {
    if (this.form.valid) {
      this.form.disable();
      if (this.editedItem == undefined) {
        await lastValueFrom(this.tileSrv.addTag({
          id: 0, // 0 makes the database use autoincrementing.
          name: this.form.value.name
        }));
      } else {
        await lastValueFrom(this.tileSrv.editTag({
          id: this.editedItem.id,
          name: this.form.value.name
        }));
      }
    }
  }
}
