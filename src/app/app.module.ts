import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatMainComponent } from './components/chat-main/chat-main.component';
import { ChatRowComponent } from './components/chat-row/chat-row.component';
import { ChatHistoryComponent } from './components/chat-history/chat-history.component';
import { AutosizeModule } from 'ngx-autosize';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';


@NgModule({
  declarations: [
    AppComponent,
    ChatMainComponent,
    ChatRowComponent,
    ChatHistoryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AutosizeModule,
    MarkdownModule.forRoot(),
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          javascript: () => import('highlight.js/lib/languages/javascript'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          php: () => import('highlight.js/lib/languages/php'),
          sql: () => import('highlight.js/lib/languages/sql'),
          c: () => import('highlight.js/lib/languages/c'),
          cpp: () => import('highlight.js/lib/languages/cpp'),
          csharp: () => import('highlight.js/lib/languages/csharp'),
          java: () => import('highlight.js/lib/languages/java'),
          python: () => import('highlight.js/lib/languages/python'),
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
