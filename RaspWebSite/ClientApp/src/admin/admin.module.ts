import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { IndexComponent } from './index/index.component';
import { NewTagComponent } from './new-tag/new-tag.component';
import { NewTileComponent } from './new-tile/new-tile.component';
import { TagsComponent } from './tags/tags.component';
import { TilesComponent } from './tiles/tiles.component';
import { VisitorsComponent } from './visitors/visitors.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    TilesComponent,
    VisitorsComponent,
    AdminComponent,
    NewTileComponent,
    NewTagComponent,
    TagsComponent,
    IndexComponent
  ],
  imports: [
    MatButtonModule,
    MatTabsModule,
    MatGridListModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterModule
  ]
})
export class AdminModule { }
