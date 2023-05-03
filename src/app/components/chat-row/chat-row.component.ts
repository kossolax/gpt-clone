import { Component, Input, OnInit } from '@angular/core';
import { ChatInput } from 'src/app/classes/chat';
import { MarkdownService } from 'ngx-markdown';
import { HighlightJS } from 'ngx-highlightjs';

@Component({
  selector: 'app-chat-row',
  templateUrl: './chat-row.component.html',
  styleUrls: ['./chat-row.component.scss']
})
export class ChatRowComponent implements OnInit {
  @Input() message!: ChatInput;
  @Input() writing!: boolean;

  constructor(
    private markdownService: MarkdownService,
    private highlightService: HighlightJS
    ) {
  }

  ngOnInit() {
    this.markdownService.renderer.code = (code: string, language: string) => {

      const highlight = this.highlightService.hljs?.highlightAuto(code, this.highlightService.hljs?.listLanguages());
      console.log(this.highlightService.hljs, highlight);

      return `<pre><code class="hljs language-${highlight?.language}">${highlight?.value}</code></pre>`;
    };
  }

}
