import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private static readonly Dark = 'dark';
  private static readonly Light = 'light';
  private static readonly ThemeCookieName = 'theme';
  private document: Document;
  private renderer: Renderer2;
  private readonly style: HTMLLinkElement;

  private isDarkMode = new BehaviorSubject(this.getLocalStorage());

  public readonly observableDarkMode = this.isDarkMode.asObservable();

  public setMode(dark: boolean) {
    this.isDarkMode.next(dark);
    localStorage.setItem(DarkModeService.ThemeCookieName, this.returnName(dark));
    this.setClass(dark);
    this.setStyles(dark);
  }

  private setStyles(dark: boolean) {
    this.style.href = `${this.returnName(dark)}.css`;
  }

  private getLocalStorage(): boolean {
    return (localStorage.getItem(DarkModeService.ThemeCookieName) ?? DarkModeService.Dark) === DarkModeService.Dark;
  }

  private returnName(dark: boolean) {
    return dark ? DarkModeService.Dark : DarkModeService.Light;
  }

  private setClass(dark: boolean) {
    this.renderer.addClass(this.document.body, dark ? DarkModeService.Dark : DarkModeService.Light);
    this.renderer.removeClass(this.document.body, !dark ? DarkModeService.Dark : DarkModeService.Light);
  }

  constructor(@Inject(DOCUMENT) document: Document, renderer: RendererFactory2) {
    this.document = document;
    this.renderer = renderer.createRenderer(null, null);

    this.style = document.createElement('link');
    this.style.rel = 'stylesheet';
    document.head.appendChild(this.style);

    this.setMode(this.getLocalStorage());
  }
}
