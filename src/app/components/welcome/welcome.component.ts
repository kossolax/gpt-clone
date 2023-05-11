import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatHistory } from 'src/app/classes/chat';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {

  constructor(
    private history: HistoryService,
    private router: Router
    ) {

  }
  onPrePrompt(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if( target && target.innerText.length > 0 ) {
      this.onEnterPress(target.innerText);
    }
  }

  onEnterPress(message: string) {
    const chat = new ChatHistory();
    chat.addMessage({role: "system", content: "You are an helpfull assistant."});
    chat.addMessage({role: "user", content: message});
    chat.generateAnwser();
    chat.generateTitle(message);

    this.history.add(chat);
    this.router.navigate(['/c', chat.uuid]);
  }
}
