import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent {
  isExpanded: boolean;
  isDarkMode: Observable<boolean>;

  constructor(private darkModeSrv: DarkModeService) {
    this.isExpanded = false;
    this.isDarkMode = this.darkModeSrv.observableDarkMode;
  }

  toggleDark(isDark: boolean) {
    this.darkModeSrv.setMode(isDark);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
