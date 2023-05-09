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
import { ClipboardOptions, MarkdownModule } from 'ngx-markdown';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ClipboardButtonComponent } from './components/clipboard/clipboard.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    ChatMainComponent,
    ChatRowComponent,
    ChatHistoryComponent,
    ChatInputComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AutosizeModule,
    MarkdownModule.forRoot({
      clipboardOptions: {
        provide: ClipboardOptions,
        useValue: {
          buttonComponent: ClipboardButtonComponent,
        },
      },
    }),
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
