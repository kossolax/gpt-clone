import { Component } from '@angular/core';
import { ChatInput } from 'src/app/classes/chat';



@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})

export class ChatMainComponent {
  message: string = '';

  log: ChatInput[] = [];


  onEnterPress(event: Event) {
    this.log.push({message: this.message, type: "message"});
    this.message = "";
    return false;
  }
}
