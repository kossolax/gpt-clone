import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'gpt-clone';

  private themeChangeListener = (e: MediaQueryListEvent) => {
    this.setTheme();
  }
  private storageEventListener = (e: StorageEvent) => {
    if( e.key === 'theme' ) {
      this.setTheme();
    }
  }

  ngOnInit() {
    this.setTheme();
    try {
      window.addEventListener('storage', this.storageEventListener);
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.themeChangeListener);
    } catch( e ) { }
  }
  ngOnDestroy() {
    try {
      window.removeEventListener('storage', this.storageEventListener);
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.themeChangeListener);
    } catch( e ) { }
  }

  private detectTheme(): 'light'|'dark' {
    const fromStorage = localStorage.getItem('theme');

    if( fromStorage && (fromStorage === 'light' || fromStorage === 'dark') )
      return fromStorage;

    try {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches)
        return 'dark';
      else
        return 'light';
    } catch( e ) {
      return 'light';
    }
  }

  private setTheme() {
    const theme = this.detectTheme();
    document.documentElement.className = theme;
    document.documentElement.style.colorScheme = theme;
  }

}
