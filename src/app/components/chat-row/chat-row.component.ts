import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChatInput } from 'src/app/classes/chat';
import { MarkdownService } from 'ngx-markdown';
import { HighlightJS } from 'ngx-highlightjs';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chat-row',
  templateUrl: './chat-row.component.html',
  styleUrls: ['./chat-row.component.scss']
})
export class ChatRowComponent implements OnInit, OnChanges {
  @Input() message!: ChatInput;
  @Input() writing!: boolean;
  showCarret: boolean = false;

  constructor(
    private markdownService: MarkdownService,
    private highlightService: HighlightJS
    ) {
  }

  private intervalSubscription: Subscription | undefined;
  private startOrStopInterval() {
    if( this.intervalSubscription ) this.intervalSubscription.unsubscribe();

    if( this.writing ) {
      this.showCarret = true;
      this.intervalSubscription = interval(500).subscribe( () => this.showCarret = !this.showCarret );
    }
    else {
      this.showCarret = false;
    }
  }

  ngOnInit() {
    this.startOrStopInterval();
    this.markdownService.renderer.code = (code: string, language: string) => {
      let languages = this.highlightService.hljs?.listLanguages()!;
      if ( language.length > 0 && languages?.includes(language) )
        languages = [language];

      const highlight = this.highlightService.hljs?.highlightAuto(code, languages);
      return `<pre><code class="hljs language-${highlight?.language}">${highlight?.value}</code></pre>`;
    };
  }

  ngOnDestroy(): void {
    if( this.intervalSubscription ) this.intervalSubscription.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if( changes["writing"] ) {
      this.startOrStopInterval();
    }
  }

}
