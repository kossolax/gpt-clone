import { CommonModule } from '@angular/common';


import { Component, OnInit } from '@angular/core';
import { Subject, distinctUntilChanged, map, mapTo, merge, of, shareReplay, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-clipboard-button',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.scss']
})
export class ClipboardButtonComponent implements OnInit {
  private _buttonClick$ = new Subject<void>();
  private copied$ = this._buttonClick$.pipe(
    switchMap(() => merge(
      of(true),
      timer(2000).pipe(map(() => false)),
    )),
    distinctUntilChanged(),
    shareReplay(1),
  );
  copied = false;

  ngOnInit(): void {
    this.copied$.subscribe( (copied) => this.copied = copied );
  }

  onCopyToClipboardClick(): void {
    this._buttonClick$.next();
  }
}

