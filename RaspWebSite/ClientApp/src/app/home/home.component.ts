import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private dashShownSubj = new BehaviorSubject(true);
  public text = "> ";
  public dashInvisible = this.dashShownSubj.asObservable();

  private async wait(ms: number) {
    await new Promise(val => setTimeout(val, ms));
  }

  private async printText(txt: string) {
    for (let i = 0; i < txt.length; i++) {
      await this.wait(200);
      this.text += txt[i];
    }
  }

  private async enableDash() {
    while (true) {
      await this.wait(400);
      this.dashShownSubj.next(!this.dashShownSubj.value);
    }
  }

  ngOnInit() {
    this.printText("Hi there!");
    this.enableDash();
  }
}
