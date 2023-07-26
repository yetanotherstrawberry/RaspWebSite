import { HttpClientModule } from '@angular/common/http';
import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CanActivateFn, Router, RouterModule } from '@angular/router';
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { VisitorsComponent } from '../admin/visitors/visitors.component';
import { AdminComponent } from '../admin/admin.component';
import { TilesComponent } from '../admin/tiles/tiles.component';
import { NewTileComponent } from '../admin/new-tile/new-tile.component';
import { NewTagComponent } from '../admin/new-tag/new-tag.component';
import { TagsComponent } from '../admin/tags/tags.component';
import { IndexComponent } from '../admin/index/index.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';

import { AdminModule } from '../admin/admin.module';

import { LoginService } from '../services/login.service';

import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotFoundComponent } from './notfound/notfound.component';

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

export function jwtOptionsFactory(loginSrv: LoginService) {
  return {
    tokenGetter: () => loginSrv.getToken()
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    PortfolioComponent,
    LoginComponent,
    ErrorComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [LoginService]
      }
    }),
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'portfolio', component: PortfolioComponent },
      { path: 'login', component: LoginComponent },
      {
        path: 'admin', component: AdminComponent,
        canActivate: [canActivateTeam],
        canActivateChild: [canActivateTeam],
        children: [
          { path: '', component: IndexComponent, pathMatch: 'full' },
          { path: 'visitors', component: VisitorsComponent },
          { path: 'tiles', component: TilesComponent },
          { path: 'newtile', component: NewTileComponent },
          { path: 'newtag', component: NewTagComponent },
          { path: 'tags', component: TagsComponent }
        ]
      },
      { path: '**', component: NotFoundComponent }
    ]),
    MatSlideToggleModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    AdminModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
