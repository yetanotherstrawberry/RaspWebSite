import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Tag, ApiService } from '../../services/api.service';

@Component({
  selector: 'admin-new-tag',
  templateUrl: './new-tag.component.html'
})
export class NewTagComponent {
  public form: FormGroup;

  constructor(
    fb: FormBuilder,
    private tileSrv: ApiService,
    @Inject(MAT_DIALOG_DATA) public editedItem: Tag,
    private dialogRef: MatDialogRef<NewTagComponent>
  ) {
    this.form = fb.group({
      name: [editedItem === undefined ? '' : editedItem.name, Validators.required]
    });
  }

  public async commit(): Promise<void> {
    if (this.form.valid) {
      this.form.disable();

      if (this.editedItem === undefined) {
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

      this.dialogRef.close();
    }
  }
}
