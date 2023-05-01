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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
