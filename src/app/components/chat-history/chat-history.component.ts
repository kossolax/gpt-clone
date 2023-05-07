import { Component, EventEmitter, Output } from '@angular/core';
import { ChatHistory } from 'src/app/classes/chat';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent {
  @Output() onChatChange:EventEmitter<ChatHistory> = new EventEmitter<ChatHistory>();

  constructor(private historyService: HistoryService) {
  }

  get history() {
    return this.historyService.history;
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
