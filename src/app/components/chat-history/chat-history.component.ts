import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatHistory } from 'src/app/classes/chat';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})

export class ChatHistoryComponent {
  @Input() current:ChatHistory|null = null;
  @Output() onChatChange:EventEmitter<ChatHistory> = new EventEmitter<ChatHistory>();


  constructor(private historyService: HistoryService) {
  }

  get historyRange() {
    return this.historyService.historyRange;
  }

  create() {
    const chat = new ChatHistory();
    chat.addMessage({role: "system", content: "You are an helpfull assistant."});
    chat.addMessage({role: "assistant", content: "Hello, how can I help you?"});
    this.historyService.add(chat);
    this.onChatChange.emit(chat);
  }
  change(value: ChatHistory) {
    this.onChatChange.emit(value);
  }
  delete(value: ChatHistory) {
    this.historyService.delete(value);
  }
}
