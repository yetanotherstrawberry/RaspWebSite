import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  public adminName: string;
  isDarkMode: Observable<boolean>;

  constructor(private loginService: LoginService, private router: Router, private darkModeSrv: DarkModeService) {
    this.adminName = loginService.getName();
    this.isDarkMode = this.darkModeSrv.observableDarkMode;
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }
}
