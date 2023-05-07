import { Injectable } from '@angular/core';
import { ChatHistory } from '../classes/chat';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  history: ChatHistory[] = [];

  constructor() {
    this.load();
  }

  addHistory(history: ChatHistory) {
    this.history.push(history);
    this.save();
  }

  save(): void {
    const data = this.history.map( i => i.serialize() );
    localStorage.setItem('history', JSON.stringify(data));
  }
  load(): void {
    const storage = localStorage.getItem('history');
    if (storage) {
      const data = JSON.parse(storage) as string[];
      if (data) {
        this.history = data.map(i => ChatHistory.deserialize(i));
      }
    }
  }


}
