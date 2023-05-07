import { Component } from '@angular/core';
import { ChatHistory } from 'src/app/classes/chat';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent {

  constructor(private historyService: HistoryService) {

  }
  get history() {
    return this.historyService.history;
  }
}
