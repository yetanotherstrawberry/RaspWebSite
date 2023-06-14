import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tag, TileService } from '../../services/tile.service';

@Component({
  selector: 'admin-new-tag',
  templateUrl: './new-tag.component.html'
})
export class NewTagComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private tileSrv: TileService) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  public add(): void {
    if (this.form.valid) {
      this.tileSrv.addTag({
        id: 0, // 0 makes the database use autoincrementing.
        name: this.form.value.name
      }).subscribe(_ => {
        this.router.navigateByUrl('/admin');
      });
    }
  }
}
