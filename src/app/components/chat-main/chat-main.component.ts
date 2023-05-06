import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpDownloadProgressEvent, HttpHeaders } from '@angular/common/http';
import { ChatInput, ChatHistory } from 'src/app/classes/chat';
import { Subject, catchError, map, switchMap, takeUntil, timer } from 'rxjs';
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
    this.chat.addMessage({role: "system", content: "You are an helpfull assistant."});
    this.chat.addMessage({role: "assistant", content: "Hello, how can I help you?"});
  }

  private onDestroy$: Subject<void> = new Subject<void>();
  public ngOnInit(): void {
    timer(1000, 60 * 1000).pipe(
      takeUntil(this.onDestroy$),
      switchMap(() => this.http.get(`${environment.api}/keepalive`)),
      catchError( () => { return [] })
    ).subscribe();
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onMessageUpdate(message: string, messageIndex: number) {
    if( !this.writing ) {
      this.chat.fork(messageIndex);
      this.chat.log[ messageIndex ].content = message;
      this.query();
    }
  }
  onMessagePrevious(messageIndex: number) {
    if( !this.writing ) {
      this.chat.previous(messageIndex);
    }
  }
  onMessageNext(messageIndex: number) {
    if( !this.writing ) {
      this.chat.next(messageIndex);
    }
  }

  onEnterPress(message: string) {
    this.chat.addMessage({role: "user", content: message});
    this.message = "";

    this.query();
  }

  query() {

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
}
