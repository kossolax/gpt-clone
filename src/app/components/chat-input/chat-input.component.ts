import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent {
  @Input() locked: boolean = false;
  @Output() message: EventEmitter<string> = new EventEmitter<string>();

  currentText: string = '';

  onEnterPress(event: Event) {
    const message = this.currentText.trim();
    if( message.length > 0 && !this.locked ) {
      this.message.emit(message);
      this.currentText = '';
    }

    return false;
  }
}
