import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  public form: FormGroup;
  public loginFailed: boolean;

  constructor(private loginSrv: LoginService, private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.loginFailed = false;
  }

  public logout() {
    this.loginSrv.logout();
    this.router.navigateByUrl('/');
  }

  public async login(): Promise<void> {
    if (this.form.valid) {
      var ret: boolean = await this.loginSrv.login(this.form.value.userName, this.form.value.password);
      if (ret) {
        this.loginFailed = false;
        await this.router.navigateByUrl('/admin');
      } else {
        this.loginFailed = true;
      }
    }
  }
}
