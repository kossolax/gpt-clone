import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpDownloadProgressEvent, HttpHeaders, HttpEvent, HttpResponse } from '@angular/common/http';
import { ChatInput, ChatHistory } from 'src/app/classes/chat';
import { EMPTY, Subject, catchError, map, switchMap, takeUntil, tap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HistoryService } from 'src/app/services/history.service';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss']
})

export class ChatMainComponent implements OnInit, OnDestroy {
  message: string = '';
  chat: ChatHistory|null = null;

  constructor(
    private http: HttpClient,
    private history: HistoryService,
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe( params => {
      this.chat = this.history.get(params['id']);
    } );
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

  onChatChange(chat: ChatHistory|null) {
    this.chat = chat;
  }

  onMessageUpdate(message: string, messageIndex: number) {
    if( !this.chat ) return;
    if( this.chat.writing ) return;

    this.chat.fork(messageIndex);
    this.chat.log[ messageIndex ].content = message;
    this.chatService.generateAnwser(this.chat);
  }
  onMessagePrevious(messageIndex: number) {
    if( !this.chat ) return;
    if( this.chat.writing ) return;

    this.chat.previous(messageIndex);
  }
  onMessageNext(messageIndex: number) {
    if( !this.chat ) return;
    if( this.chat.writing ) return;

    this.chat.next(messageIndex);
  }

  onEnterPress(message: string) {
    if( !this.chat ) return;

    this.chat.addMessage({role: "user", content: message});
    this.message = "";

    this.history.save();
    this.chatService.generateAnwser(this.chat);
    if( this.chat.title === null )
      this.chatService.generateTitle(this.chat, message);
  }
}
