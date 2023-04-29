import { Component, Input } from '@angular/core';
import { ChatInput } from 'src/app/classes/chat';

@Component({
  selector: 'app-chat-row',
  templateUrl: './chat-row.component.html',
  styleUrls: ['./chat-row.component.scss']
})
export class ChatRowComponent {
  @Input() message!: ChatInput;
}
