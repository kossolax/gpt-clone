import { Component } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
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

  constructor(private http: HttpClient) { }

  onEnterPress(event: Event) {
    const message = this.message.trim();
    if( message.length > 0 ) {
      this.log.push({message: message, type: "message"});
      this.message = "";

      const req = new HttpRequest('GET', "https://gptclone9ud9teaw-frontend.functions.fnc.fr-par.scw.cloud/api/chat", {
        reportProgress: true,
        responseType: 'text',
      });
      this.http.request(req).subscribe(
        event => {
          if ( event.type == 0 )
            this.log.push({message: "", type: "system"});
          if ( event.type == 3 )
            this.log[this.log.length-1].message = event.responseText;
          if ( event.type == 4 )
            this.log[this.log.length-1].message = event.responseText;
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
    return false;
  }
}
