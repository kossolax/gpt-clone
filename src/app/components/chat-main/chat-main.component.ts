import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpDownloadProgressEvent, HttpHeaders, HttpEvent, HttpResponse } from '@angular/common/http';
import { ChatInput, ChatHistory } from 'src/app/classes/chat';
import { EMPTY, Subject, catchError, map, switchMap, takeUntil, tap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HistoryService } from 'src/app/services/history.service';


@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})

export class ChatMainComponent implements OnInit, OnDestroy {
  message: string = '';
  writing: boolean = false;
  chat!: ChatHistory;

  constructor(private http: HttpClient, private history: HistoryService) {
    const oldChats = this.history.history;
    if( oldChats.length > 0 ) {
      this.chat = oldChats[ oldChats.length - 1 ];
    }
  }

  private onDestroy$: Subject<void> = new Subject<void>();
  public ngOnInit(): void {
    timer(1000, 60 * 1000).pipe(
      takeUntil(this.onDestroy$),
      switchMap(() => this.http.get(`${environment.api}/keepalive`,  {responseType: 'text'})),
    ).subscribe();
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onChatChange(chat: ChatHistory) {
    if( !this.writing ) {
      this.chat = chat;
    }
  }

  onMessageUpdate(message: string, messageIndex: number) {
    if( !this.writing ) {
      this.chat.fork(messageIndex);
      this.chat.log[ messageIndex ].content = message;
      this.generateAnwser();
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

    this.history.save();
    this.generateAnwser();
    if( this.chat.title === null )
      this.generateTitle(message);
  }

  generateAnwser() {

    this.writing = true;
    const req = new HttpRequest('POST', `${environment.api}/chat`, this.chat.log, {
      reportProgress: true,
      responseType: 'text'
    });

    this.http.request<string>(req).subscribe({
      next: (event) => {
        if ( event.type == HttpEventType.Sent )
          this.chat.addMessage({role: "assistant", content: ""});

        if ( event.type == HttpEventType.DownloadProgress )
          this.chat.log[this.chat.log.length-1].content = (event as HttpDownloadProgressEvent).partialText as string;

        if ( event.type == HttpEventType.Response )
          this.history.save();
      },
      error: (e) => console.error(e),
      complete: () =>  this.writing = false
    });
  }
  generateTitle(message: string) {
    const log: ChatInput[] = [];
    let prompt = "Generate a summary for the following conversation between a user and their assistant. ";
    prompt += "Only anwser with the summary of the conversation, do not add any other text. ";
    prompt += "The summary must be no longer than 4 words and 16 tokens, in the same language as the conversation, and relevant to the content. ";
    prompt += "If the conversation is task-related, summarize the task. ";
    prompt += "If it's casual, summarize the topic. ";
    prompt += "For greetings, summarize the greeting in a imaginative way. ";
    prompt += "If the input consists of unrecognized words or characters, answer 'Random string conversation'. ";
    prompt += "If you cannot determine a summary, answer 'New chat'.";


    log.push({role: "system", content: prompt});
    log.push({role: "user", content: message});

    this.http.post(`${environment.api}/chat`, log, {responseType: 'text'}).subscribe( data => {
      if( data && data.length > 1 ) {
        this.chat.title = data;
        this.history.save();
      }
    });
  }
}
