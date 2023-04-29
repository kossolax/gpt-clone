import { Component } from '@angular/core';
import { ChatInput } from 'src/app/classes/chat';



@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})

export class ChatMainComponent {
  message: string = '';

  log: ChatInput[] = [
    {message: "Welcome to the chat!", type: "system"},
    {message: "Type a message and press enter to send it.", type: "message"},
    {message: "Welcome to the chat!", type: "system"},
  ];


  onEnterPress(event: Event) {
    const message = this.message.trim();
    if( message.length > 0 ) {
      this.log.push({message: this.message, type: "message"});
      this.message = "";
    }
    return false;
  }
}
