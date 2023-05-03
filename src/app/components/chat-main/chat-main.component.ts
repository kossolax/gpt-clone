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
  writing: boolean = false;

  log: ChatInput[] = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "You can ask me anything about the project." },
  ];

  constructor(private http: HttpClient) { }

  onEnterPress(event: Event) {
    const message = this.message.trim();
    if( message.length > 0 && !this.writing ) {
      this.log.push({role: "user", content: message});
      this.message = "";
      this.writing = true;

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
            this.writing = false;
        },
        error => {
          this.writing = false;
        }
      );
    }

    return false;
  }
}
