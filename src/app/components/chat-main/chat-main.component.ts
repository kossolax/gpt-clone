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
    { role: "assistant", content: "Thank you! How can I help you today?" },
    { role: "user", content: "What's the weather like today?" },
    { role: "assistant", content: "The weather today is sunny with a high of 25°C." },
    { role: "user", content: "What should I wear for a day like this?" },
    { role: "assistant", content: "I suggest wearing light, comfortable clothing and sunglasses. Don't forget sunscreen!", writing: false },
    { role: "user", content: "Thanks for the advice!" },
    { role: "assistant", content: "You're welcome! If you have any other questions, feel free to ask." },
  ];
  
  constructor(private http: HttpClient) { }

  onEnterPress(event: Event) {
    const message = this.message.trim();
    if( message.length > 0 ) {
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
