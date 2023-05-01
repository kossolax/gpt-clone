import { Component } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpDownloadProgressEvent, HttpHeaders } from '@angular/common/http';
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

      const req = new HttpRequest('POST', "https://gptclone9ud9teaw-frontend.functions.fnc.fr-par.scw.cloud/api/chat", {
        reportProgress: true,
        responseType: 'text',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
      
      const body = JSON.stringify([
          { "role": "system", "content": "You are an helpful assistant." },
          { "role": "user", "content": message }
      ]);
      
      this.http.request(req, body).subscribe(
        event => {
          if ( event.type == HttpEventType.Sent )
            this.log.push({message: "", type: "system"});
          if ( event.type == HttpEventType.DownloadProgress )
            this.log[this.log.length-1].message = (event as HttpDownloadProgressEvent).partialText as string;
          if ( event.type == HttpEventType.Response )
            this.log[this.log.length-1].message = event.body as string;
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
    return false;
  }
}
