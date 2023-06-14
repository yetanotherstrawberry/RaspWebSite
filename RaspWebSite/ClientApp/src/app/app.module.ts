import { HttpClientModule } from '@angular/common/http';
import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CanActivateFn, Router, RouterModule } from '@angular/router';
import { JwtModule } from "@auth0/angular-jwt";
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { VisitorsComponent } from '../admin/visitors/visitors.component';

import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { LoginComponent } from './login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from '../services/login.service';
import { AdminComponent } from '../admin/admin.component';
import { TilesComponent } from '../admin/tiles/tiles.component';
import { AdminModule } from '../admin/admin.module';
import { IndexComponent } from '../admin/index/index.component';
import { NewTileComponent } from '../admin/new-tile/new-tile.component';
import { NewTagComponent } from '../admin/new-tag/new-tag.component';
import { TagsComponent } from '../admin/tags/tags.component';

const canActivateTeam: CanActivateFn =
  async (): Promise<boolean> => {
    var loginSrv = inject(LoginService);
    var routeSrv = inject(Router);
    var ok: boolean = await loginSrv.check();
    if (ok) {
      return true;
    } else {
      routeSrv.navigateByUrl('/login'); // Do not await - return false ASAP.
      return false; // Cancel navigation to admin page.
  }
};

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    PortfolioComponent,
    LoginComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem("access_token")
      },
    }),
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'portfolio', component: PortfolioComponent },
      { path: 'login', component: LoginComponent },
      {
        path: 'admin', component: AdminComponent,
        canActivate: [canActivateTeam], canActivateChild: [canActivateTeam],
        children: [
          { path: '', component: IndexComponent, pathMatch: 'full' },
          { path: 'visitors', component: VisitorsComponent },
          { path: 'tiles', component: TilesComponent },
          { path: 'newtile', component: NewTileComponent },
          { path: 'newtag', component: NewTagComponent },
          { path: 'tags', component: TagsComponent },
        ]
      },
    ]),
    MatSlideToggleModule,
    MatButtonModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    BrowserAnimationsModule,
    AdminModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
