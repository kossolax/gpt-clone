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
    {role: "system", content: "You are an helpfull assistant."},
  ];

  constructor(private http: HttpClient) { }

  onEnterPress(event: Event) {
    const message = this.message.trim();
    if( message.length > 0 ) {
      this.log.push({role: "user", content: message});
      this.message = "";

      const req = new HttpRequest('POST', "https://gptclone9ud9teaw-frontend.functions.fnc.fr-par.scw.cloud/api/chat", this.log, {
        reportProgress: true,
        responseType: 'text'
      });
      
      this.http.request<string>(req).subscribe(
        event => {
          if ( event.type == HttpEventType.Sent )
            this.log.push({role: "assistant", content: ""});
          if ( event.type == HttpEventType.DownloadProgress )
            this.log[this.log.length-1].content = (event as HttpDownloadProgressEvent).partialText as string;
          if ( event.type == HttpEventType.Response )
            this.log[this.log.length-1].content = event.body as string;
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
    return false;
  }
}
