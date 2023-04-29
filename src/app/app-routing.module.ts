import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatMainComponent } from './components/chat-main/chat-main.component';

const routes: Routes = [
  { path: '', component: ChatMainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
