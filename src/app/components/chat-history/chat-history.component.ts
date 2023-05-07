import { Component, EventEmitter, Output } from '@angular/core';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent {
  @Output() onNewChat = new EventEmitter();

  constructor(private historyService: HistoryService) {
  }

  get history() {
    return this.historyService.history;
  }
}
