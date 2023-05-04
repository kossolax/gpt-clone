import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpDownloadProgressEvent, HttpHeaders } from '@angular/common/http';
import { ChatInput, ChatHistory } from 'src/app/classes/chat';
import { Subject, map, switchMap, takeUntil, timer } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})

export class ChatMainComponent implements OnInit, OnDestroy {
  message: string = '';
  writing: boolean = false;
  chat: ChatHistory = new ChatHistory();

  constructor(private http: HttpClient) {
  }

  private onDestroy$: Subject<void> = new Subject<void>();
  public ngOnInit(): void {
    timer(1000, 60 * 1000).pipe(
      takeUntil(this.onDestroy$),
      switchMap(() => this.http.get(`${environment.api}/keepalive`)),
    ).subscribe();
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onEnterPress(event: Event) {
    const message = this.message.trim();
    if( message.length > 0 && !this.writing ) {
      this.chat.addMessage({role: "user", content: message});
      this.message = "";
      this.writing = true;

      const req = new HttpRequest('POST', `${environment.api}/chat`, this.chat.log, {
        reportProgress: true,
        responseType: 'text'
      });

      this.http.request<string>(req).subscribe(
        event => {
          if ( event.type == HttpEventType.Sent )
            this.chat.addMessage({role: "assistant", content: ""});

          if ( event.type == HttpEventType.DownloadProgress )
            this.chat.log[this.chat.log.length-1].content = (event as HttpDownloadProgressEvent).partialText as string;

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
