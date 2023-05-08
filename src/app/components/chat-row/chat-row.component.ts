import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Input() writing = false;
  @Input() branchIndex = 0;
  @Input() branchCount = 0;

  @Output() messageUpdate = new EventEmitter<string>();
  @Output() prev = new EventEmitter<number>();
  @Output() next = new EventEmitter<number>();

  showCarret: boolean = false;

  constructor(
    private markdownService: MarkdownService,
    public highlightService: HighlightJS
    ) {
      this.markdownService.renderer.code = (code: string, language: string) => {
        let languages = this.highlightService.hljs?.listLanguages()!;
        if ( language.length > 0 && languages?.includes(language) )
          languages = [language];

        const highlight = this.highlightService.hljs?.highlightAuto(code, languages);
        return `<div class="code"><span class="legend">${highlight?.language}</span><code class="hljs language-${highlight?.language}">${highlight?.value}</code></div>`;
      };
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
  }
  ngOnDestroy(): void {
    if( this.intervalSubscription ) this.intervalSubscription.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if( changes["writing"] ) {
      this.startOrStopInterval();
    }
  }

  onUpdate() {
    const message = this.message.content;
    this.messageUpdate.emit(message);
  }


}
