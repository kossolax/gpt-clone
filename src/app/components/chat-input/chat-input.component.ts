import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnChanges {
  @Input() locked: boolean = false;
  @Output() message: EventEmitter<string> = new EventEmitter<string>();

  currentText: string = '';
  bulletCount = 0;

  onEnterPress(event: Event) {
    const message = this.currentText.trim();
    if( message.length > 0 && !this.locked ) {
      this.message.emit(message);
      this.currentText = '';
    }

    return false;
  }


  private intervalSubscription: Subscription = new Subscription();
  ngOnChanges(changes: SimpleChanges): void {
    if( changes["locked"] ) {
      if( this.locked )
      this.intervalSubscription = interval(350).subscribe( () => this.bulletCount = (this.bulletCount + 1) % 3 );
    else
      this.intervalSubscription.unsubscribe();
    }
  }
}
