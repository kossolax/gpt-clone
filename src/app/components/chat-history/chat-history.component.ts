import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ChatHistory } from 'src/app/classes/chat';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})

export class ChatHistoryComponent {
  @Input() current:ChatHistory|null = null;

  constructor(
    private history: HistoryService,
    private router: Router
    ) {
  }

  get historyRange() {
    return this.history.historyRange;
  }

  create() {
    const chat = new ChatHistory();
    chat.addMessage({role: "system", content: "You are an helpfull assistant."});
    chat.addMessage({role: "assistant", content: "Hello, how can I help you?"});
    this.history.add(chat);

    this.router.navigate(['/c', chat.uuid]);
  }
  change(value: ChatHistory) {
    this.router.navigate(['/c', value.uuid]);
  }
  delete(value: ChatHistory) {
    this.history.delete(value);
    if( this.current === value ) {
      if( this.history.first )
        this.router.navigate(['/c', this.history.first.uuid]);
      else
        this.router.navigate(['/']);
    }
  }
}
