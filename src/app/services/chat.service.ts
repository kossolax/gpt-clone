import { HttpClient, HttpDownloadProgressEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HistoryService } from './history.service';
import { ChatHistory, ChatInput } from '../classes/chat';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private history: HistoryService,
    private http: HttpClient
  ) { }

  generateAnwser(chat: ChatHistory) {
    if( chat.writing ) return;

    chat.writing = true;
    const sub = new Subject();

    const req = new HttpRequest('POST', `${environment.api}/chat`, chat.log, {
      reportProgress: true,
      responseType: 'text'
    });

    this.http.request<string>(req).subscribe({
      next: (event) => {

        if ( event.type == HttpEventType.Sent )
          chat.addMessage({role: "assistant", content: ""});

        if ( event.type == HttpEventType.DownloadProgress )
          chat.log[chat.log.length-1].content = (event as HttpDownloadProgressEvent).partialText as string;

        if ( event.type == HttpEventType.Response ) {
          chat.writing = false;
          this.history.save();
          sub.next(event);
        }
      },
      error: (e) => console.error(e),
      complete: () => sub.complete()
    });

    return sub;
  }
  generateTitle(chat: ChatHistory, message: string) {
    const sub = new Subject();

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

    this.http.post(`${environment.api}/chat`, log, {responseType: 'text'}).subscribe({
      next: data => {
        if( data && data.length > 1 ) {
          chat.title = data;
          this.history.save();
          sub.next(data);
        }
      },
      error: (e) => console.error(e),
      complete: () => sub.complete()
    });
  }

}
