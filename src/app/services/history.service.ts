import { Injectable } from '@angular/core';
import { ChatHistory } from '../classes/chat';
import * as dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private history: ChatHistory[] = [];

  get historyRange(): {[key: string]: ChatHistory[]} {
    const res: {[key: string]: ChatHistory[]} = {};
    const now = dayjs();

    for (const history of this.history) {
      const date = dayjs(history.date);
      const diff = now.diff(date, 'day');
      let key: string;

      if (diff <= 0) key = "Today";
      else if (diff <= 1) key = "Yesterday";
      else if (diff <= 7) key = "Last 7 Days";
      else if (diff <= 30) key = "Last 30 Days";
      else key = date.format('MMMM');

      if (!res[key]) res[key] = [];
      res[key].push(history);
    }

    return res;
  }

  get first(): ChatHistory|null {
    if (this.history.length > 0) return this.history[0];
    return null;
  }

  constructor() {
    this.load();
  }

  add(history: ChatHistory) {
    this.history.unshift(history);
    this.save();
  }
  delete(history: ChatHistory) {
    const index = this.history.indexOf(history);
    if (index >= 0) {
      this.history.splice(index, 1);
      this.save();
    }
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
