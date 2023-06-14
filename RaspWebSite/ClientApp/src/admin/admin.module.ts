import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TilesComponent } from './tiles/tiles.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { IndexComponent } from './index/index.component';
import { NewTileComponent } from './new-tile/new-tile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewTagComponent } from './new-tag/new-tag.component';

@NgModule({
  declarations: [
    TilesComponent,
    VisitorsComponent,
    AdminComponent,
    NewTileComponent,
    NewTagComponent
  ],
  imports: [
    MatButtonModule,
    MatGridListModule,
    MatButtonModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    RouterModule,
  ],
  bootstrap: [IndexComponent]
})
export class AdminModule { }
